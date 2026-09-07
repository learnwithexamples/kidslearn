/* ============================================================
   test-js-workshops.js — play every JavaScript workshop from start to finish.

       node funtime/tests/test-js-workshops.js

   For each `<game>-build.js` it builds a pretend browser, starts the
   workshop, then for every step types the answer, presses Test, checks the
   step passed and the demo switched over, and clicks Next. It also checks
   that a wrong answer is refused and that a runaway loop is stopped.

   New games are picked up automatically — no changes needed here.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LIB = path.join(__dirname, '..', 'lib');

/** discover — every game that has both a steps file and a build (demo) file. */
function discover() {
    return fs.readdirSync(LIB)
        .filter(name => name.endsWith('-build.js') && !name.endsWith('-python-build.js'))
        .map(name => name.replace('-build.js', ''))
        .filter(game => fs.existsSync(path.join(LIB, game + '-steps.js')))
        .sort();
}

/** libsFor — the game's own library files, in load order (no page glue). */
function libsFor(game) {
    const prefix = game === 'tetris' ? 'tetris-' : game + '-';
    const order = ['-shapes', '-grid', '-road', '-rules', '-board', '-game', '-draw', '-input'];
    const files = fs.readdirSync(LIB).filter(name =>
        name.startsWith(prefix) && name.endsWith('.js') &&
        !name.endsWith('-steps.js') && !name.endsWith('-build.js') && !name.endsWith('-main.js'));
    return files.sort(function (a, b) {
        const rank = f => {
            const found = order.findIndex(part => f.indexOf(part + '.js') !== -1);
            return found === -1 ? order.length : found;
        };
        return rank(a) - rank(b);
    });
}

/* ---------------- a very small pretend browser ---------------- */

function makeElement(tag) {
    const element = {
        tagName: (tag || 'div').toUpperCase(),
        children: [], listeners: {}, style: {},
        className: '', textContent: '', value: '',
        disabled: false, width: 0, height: 0,
        appendChild(child) { this.children.push(child); return child; },
        addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); },
        click() { (this.listeners['click'] || []).forEach(fn => fn({ preventDefault() {} })); },
        getContext() { return fakeContext(); },
        querySelectorAll() { return []; }
    };

    /* Setting innerHTML empties an element - the real browser does this, and
       the workshop relies on it to clear the demo's buttons between steps. */
    let html = '';
    Object.defineProperty(element, 'innerHTML', {
        get() { return html; },
        set(value) { html = value; if (value === '') { element.children = []; } }
    });
    return element;
}

function fakeContext() {
    return {
        set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set font(v) {},
        set textAlign(v) {}, set lineCap(v) {},
        fillRect() {}, strokeRect() {}, fillText() {}, strokeText() {},
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, arc() {}, arcTo() {},
        stroke() {}, fill() {}, save() {}, restore() {}, translate() {}, scale() {}, rotate() {},
        setLineDash() {}, clearRect() {}, drawImage() {}, measureText() { return { width: 10 }; }
    };
}

const ELEMENT_IDS = ['progress', 'progress-text', 'step-number', 'step-title', 'step-adds',
    'step-intro', 'step-spec', 'step-warning', 'code-editor', 'code-highlight', 'btn-test', 'btn-hint',
    'btn-answer', 'btn-reset', 'hint-box', 'test-summary', 'test-results', 'btn-prev',
    'btn-next', 'finish-panel', 'btn-demo-yours', 'btn-demo-goal', 'demo-status',
    'demo-canvas', 'demo-controls', 'demo-note', 'demo-caption', 'btn-restart-course'];

let failures = 0;
let checks = 0;

function check(name, ok, extra) {
    checks++;
    if (!ok) {
        failures++;
        console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : ''));
    }
}

/** unhighlight — the plain text the colour layer is actually showing. */
function unhighlight(html) {
    return String(html).replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/**
 * checkStarter — what the student sees when a step first opens.
 *
 * The spec is written into the editor as a comment, so it has to be real
 * code: it must still compile, it must not carry any leftover HTML, and the
 * colour layer underneath must show exactly the same characters — a layer
 * showing anything else would sit visibly out of line with the text.
 */
function checkStarter(game, step, seeded, highlightHtml) {
    const label = game + ': ' + step.fnName;

    check(label + ' opens with the spec as a comment',
          seeded.indexOf('INPUT:') !== -1 && seeded.indexOf('OUTPUT:') !== -1 &&
          seeded.indexOf('ALGORITHM:') !== -1, seeded.slice(0, 60));
    check(label + ' spec comment carries no leftover HTML',
          seeded.indexOf('<code>') === -1 && seeded.indexOf('&lt;') === -1,
          seeded.slice(0, 200));
    check(label + ' starter still compiles', (function () {
        try { new Function(seeded); return true; } catch (e) { return e.message; } })() === true);

    /* Only the comment is ours to wrap; a long line in the starter code
       itself is the game's own business. 64 characters is what the editor
       fits at its narrowest usable width. */
    const commentLines = [];
    for (const line of seeded.split('\n')) {
        if (line.indexOf('/**') !== 0 && line.indexOf(' *') !== 0) { break; }
        commentLines.push(line);
    }
    const tooLong = commentLines.filter(line => line.length > 64);
    check(label + ' spec comment wraps', tooLong.length === 0, tooLong[0]);

    check(label + ' colour layer matches the text',
          unhighlight(highlightHtml) === seeded + '\n',
          unhighlight(highlightHtml).slice(0, 80));
}

discover().forEach(function (game) {
    const elements = {};
    ELEMENT_IDS.forEach(id => { elements[id] = makeElement(id === 'code-editor' ? 'textarea' : 'div'); });
    const store = {};
    const docListeners = {};
    let frameCallback = null;

    const sandbox = {
        Math, console, JSON, Date, Array, Object, String, Number, Boolean, Error,
        document: {
            getElementById: id => elements[id] || null,
            createElement: tag => makeElement(tag),
            addEventListener: (type, fn) => { (docListeners[type] = docListeners[type] || []).push(fn); },
            querySelectorAll: () => elements['progress'].children.filter(
                d => String(d.className).indexOf('done') !== -1)
        }
    };
    sandbox.window = sandbox;
    sandbox.localStorage = {
        getItem: k => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: k => { delete store[k]; }
    };
    sandbox.requestAnimationFrame = fn => { frameCallback = fn; };
    sandbox.confirm = () => true;
    sandbox.scrollTo = () => {};

    const ctx = vm.createContext(sandbox);
    const files = libsFor(game).concat(['code-highlight.js', 'workshop.js',
                                        game + '-steps.js', game + '-build.js']);
    try {
        files.forEach(f => vm.runInContext(fs.readFileSync(path.join(LIB, f), 'utf8'), ctx, { filename: f }));
    } catch (e) {
        failures++;
        console.log('\n' + game + ' — FAILED TO LOAD: ' + e.message);
        return;
    }

    (docListeners['DOMContentLoaded'] || []).forEach(fn => fn());
    const steps = vm.runInContext(Object.keys(sandbox).find(k => k.endsWith('_STEPS')) ||
                                  game.replace('-', '_').toUpperCase() + '_STEPS', ctx);

    console.log('\n' + game + ' — ' + steps.length + ' steps');
    const failuresBefore = failures;

    const frames = n => {
        let t = 0;
        for (let i = 0; i < n; i++) {
            t += 16;
            const fn = frameCallback; frameCallback = null;
            if (fn) { fn(t); }
        }
    };

    check(game + ': opens on step 1', elements['step-number'].textContent === 'Step 1 of ' + steps.length,
          elements['step-number'].textContent);
    check(game + ': Next starts locked', elements['btn-next'].disabled === true);
    check(game + ': the goal demo draws', (function () {
        try { frames(5); return true; } catch (e) { return e.message; } })() === true);

    /* Step 1 as the student first sees it, before the probes below type over
       the editor. Later steps are checked live, straight after renderStep. */
    const firstSeeded = elements['code-editor'].value;
    const firstHighlight = elements['code-highlight'].innerHTML;

    /* a wrong answer must be refused */
    elements['code-editor'].value = 'function ' + steps[0].fnName + '() { return "nope"; }';
    elements['btn-test'].click();
    check(game + ': a wrong answer is refused',
          elements['test-summary'].className.indexOf('fail') !== -1);

    /* a runaway loop must be stopped, not hang */
    const started = Date.now();
    elements['code-editor'].value = 'function ' + steps[0].fnName + '() { let i = 0; while (i >= 0) { i++; } }';
    elements['btn-test'].click();
    check(game + ': a runaway loop is stopped', Date.now() - started < 8000,
          (Date.now() - started) + 'ms');

    /* now the real answers, one step at a time */
    steps.forEach(function (step, index) {
        check(game + ': step ' + (index + 1) + ' is showing',
              elements['step-number'].textContent === 'Step ' + (index + 1) + ' of ' + steps.length,
              elements['step-number'].textContent);

        checkStarter(game, step,
                     index === 0 ? firstSeeded : elements['code-editor'].value,
                     index === 0 ? firstHighlight : elements['code-highlight'].innerHTML);

        elements['code-editor'].value = step.answer;
        elements['btn-test'].click();
        const passed = elements['test-summary'].className.indexOf('pass') !== -1;
        check(game + ': ' + step.fnName + ' answer passes', passed,
              passed ? '' : elements['test-results'].children.length + ' results');
        check(game + ': ' + step.fnName + ' demo switched to my code',
              elements['demo-status'].className.indexOf('yours') !== -1);

        let drewFine = true;
        try { frames(6); } catch (e) { drewFine = e.message; }
        check(game + ': ' + step.fnName + ' demo runs', drewFine === true, drewFine);

        let buttonsFine = true;
        try {
            elements['demo-controls'].children.forEach(b => b.click());
            frames(3);
        } catch (e) { buttonsFine = e.message; }
        check(game + ': ' + step.fnName + ' demo buttons work', buttonsFine === true, buttonsFine);

        if (index < steps.length - 1) {
            check(game + ': step ' + (index + 1) + ' unlocked Next', elements['btn-next'].disabled === false);
            elements['btn-next'].click();
        }
    });

    check(game + ': the last step disables Next', elements['btn-next'].disabled === true);
    check(game + ': the trophy panel shows', elements['finish-panel'].style.display === 'block');
    check(game + ': every step is saved as done',
          JSON.parse(store[game + '-build-done'] || '[]').length === steps.length,
          store[game + '-build-done']);
    check(game + ': the code was saved for every step',
          steps.every(s => typeof store[game + '-build-code-' + s.id] === 'string'));

    console.log('  ' + (failures === failuresBefore ? 'all good' : (failures - failuresBefore) + ' problem(s) above'));
});

console.log('\n' + checks + ' checks run');
console.log(failures === 0 ? 'ALL JS WORKSHOP TESTS PASSED' : failures + ' PROBLEM(S)');
process.exit(failures === 0 ? 0 : 1);
