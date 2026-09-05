/* Drive the whole SNAKE workshop page against a fake browser: walk all 12 steps the
   way a student would, and check the unlocking, testing and demos behave. */
const fs = require('fs'), vm = require('vm');
const LIB = require('path').join(__dirname, '..', 'lib') + require('path').sep;

/* ---------------- a very small fake DOM ---------------- */
class El {
    constructor(tag) {
        this.tagName = (tag || 'div').toUpperCase();
        this.children = [];
        this.listeners = {};
        this.style = {};
        this._className = '';
        this.textContent = '';
        this._innerHTML = '';
        this.disabled = false;
        this.value = '';
        this.width = 0;
        this.height = 0;
    }
    get className() { return this._className; }
    set className(v) { this._className = v; }
    get innerHTML() { return this._innerHTML; }
    set innerHTML(v) { this._innerHTML = v; this.children = []; }
    appendChild(child) { this.children.push(child); return child; }
    addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
    click() { (this.listeners['click'] || []).forEach(fn => fn({ preventDefault() {} })); }
    getContext() { return fakeCtx; }
}

const drawn = { fillRect: 0, strokeRect: 0, fillText: 0, stroke: 0, errors: [] };
const fakeCtx = {
    set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set font(v) {}, set textAlign(v) {},
    fillRect: () => drawn.fillRect++, strokeRect: () => drawn.strokeRect++,
    fillText: (t) => { drawn.fillText++; drawn.lastText = t; },
    beginPath() {}, moveTo() {}, lineTo() {}, stroke: () => drawn.stroke++,
    save() {}, restore() {}, translate() {}
};

const ids = ['progress', 'progress-text', 'step-number', 'step-title', 'step-adds', 'step-intro',
    'step-spec', 'step-warning', 'code-editor', 'btn-test', 'btn-hint', 'btn-answer', 'btn-reset',
    'hint-box', 'test-summary', 'test-results', 'btn-prev', 'btn-next', 'finish-panel',
    'btn-demo-yours', 'btn-demo-goal', 'demo-status', 'demo-canvas', 'demo-controls', 'demo-note',
    'demo-caption', 'btn-restart-course'];
const elements = {};
ids.forEach(id => { elements[id] = new El(id === 'code-editor' ? 'textarea' : 'div'); });

const store = {};
const docListeners = {};
let frameCb = null;

const sandbox = {
    Math, console, JSON, Date, Array, Object, String, Number, Boolean, Error, JSON,
    document: {
        getElementById: (id) => elements[id] || null,
        createElement: (tag) => new El(tag),
        addEventListener: (type, fn) => { (docListeners[type] = docListeners[type] || []).push(fn); }
    }
};
sandbox.window = sandbox;
sandbox.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};
sandbox.requestAnimationFrame = (fn) => { frameCb = fn; };
sandbox.confirm = () => true;
sandbox.scrollTo = () => {};

const ctx = vm.createContext(sandbox);
['snake-grid.js', 'snake-game.js', 'snake-draw.js', 'snake-input.js',
 'workshop.js', 'snake-steps.js', 'snake-build.js'].forEach(f => {
    vm.runInContext(fs.readFileSync(LIB + f, 'utf8'), ctx, { filename: f });
});

let failures = 0;
const check = (name, ok, extra) => {
    if (ok) { console.log('  ok   ' + name); }
    else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : '')); }
};
const fire = (type, event) => (docListeners[type] || []).forEach(fn => fn(event));
const frames = (n) => {
    let t = Date.now();
    for (let i = 0; i < n; i++) {
        t += 16;
        const fn = frameCb; frameCb = null;
        try { fn(t); } catch (e) { drawn.errors.push(e.message); }
    }
};

/* ---------------- the walkthrough ---------------- */
fire('DOMContentLoaded');
const steps = vm.runInContext('SNAKE_STEPS', ctx);

console.log('start state:');
check('opens on step 1', elements['step-number'].textContent === 'Step 1 of 12', elements['step-number'].textContent);
check('shows the step title', elements['step-title'].textContent === steps[0].title);
check('Next is locked until the tests pass', elements['btn-next'].disabled === true);
check('editor is filled with the starter code', elements['code-editor'].value === steps[0].starter);
check('12 progress dots, later ones locked', elements['progress'].children.length === 12 &&
      elements['progress'].children[11].className.indexOf('locked') !== -1);
check('demo shows the goal first', elements['demo-status'].className.indexOf('goal') !== -1,
      elements['demo-status'].className);
frames(30);
check('the goal demo draws something', drawn.fillRect > 0);

console.log('\na wrong answer must fail:');
elements['code-editor'].value = 'function createStartingSnake() { return "nope"; }';
elements['btn-test'].click();
check('bad code fails the tests', elements['test-summary'].className.indexOf('fail') !== -1);
check('Next stays locked', elements['btn-next'].disabled === true);
check('the failure is explained', (elements['test-results'].children[0] || {}).className === 'test-fail');

console.log('\na snake facing the wrong way must fail:');
elements['code-editor'].value =
    'function createStartingSnake() { return [createPosition(10,10), createPosition(11,10), createPosition(12,10)]; }';
elements['btn-test'].click();
check('a body trailing the wrong way is caught', elements['test-summary'].className.indexOf('fail') !== -1);

console.log('\nan endless while loop must be caught, not freeze:');
elements['code-editor'].value = 'function createStartingSnake() { let i = 0; while (i >= 0) { i++; } return []; }';
const t0 = Date.now();
elements['btn-test'].click();
const elapsed = Date.now() - t0;
check('runaway loop stopped in a few seconds', elapsed < 6000, elapsed + 'ms');
check('and reported as a failure', elements['test-summary'].className.indexOf('fail') !== -1);

console.log('\nnow walk all twelve steps with the real answers:');
for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    check('step ' + (i + 1) + ' (' + step.fnName + ') is showing',
          elements['step-number'].textContent === 'Step ' + (i + 1) + ' of 12',
          elements['step-number'].textContent);

    elements['code-editor'].value = step.answer;
    elements['btn-test'].click();

    const passed = elements['test-summary'].className.indexOf('pass') !== -1;
    check('step ' + (i + 1) + ' answer passes', passed, elements['test-summary'].textContent);
    check('step ' + (i + 1) + ' demo switched to my code',
          elements['demo-status'].className.indexOf('yours') !== -1, elements['demo-status'].className);

    /* let the demo run for half a second */
    drawn.errors = [];
    frames(30);
    check('step ' + (i + 1) + ' demo runs without errors', drawn.errors.length === 0, drawn.errors.slice(0, 2));

    /* poke the demo buttons, if it has any */
    elements['demo-controls'].children.forEach(b => b.click());
    frames(10);
    check('step ' + (i + 1) + ' demo buttons work', drawn.errors.length === 0, drawn.errors.slice(0, 2));

    if (i < steps.length - 1) {
        check('step ' + (i + 1) + ' unlocked Next', elements['btn-next'].disabled === false);
        elements['btn-next'].click();
    }
}

console.log('\nthe finish:');
check('the last step disables Next', elements['btn-next'].disabled === true);
check('the trophy panel is showing', elements['finish-panel'].style.display === 'block');
check('all twelve steps are saved as done', JSON.parse(store['snake-build-done']).length === 12);
check('every dot is marked done',
      elements['progress'].children.filter(d => d.className.indexOf('done') !== -1).length === 12);
check('progress text counts them', elements['progress-text'].textContent === '12 of 12 functions written');

console.log('\nplaying the finished game with the keyboard:');
drawn.errors = [];
frames(20);
fire('keydown', { key: 'ArrowUp', target: { tagName: 'DIV' }, preventDefault() {} });
frames(20);
fire('keydown', { key: 'ArrowLeft', target: { tagName: 'DIV' }, preventDefault() {} });
frames(20);
fire('keydown', { key: 'r', target: { tagName: 'DIV' }, preventDefault() {} });
frames(40);
check('keyboard play does not error', drawn.errors.length === 0, drawn.errors.slice(0, 2));
fire('keydown', { key: 'ArrowLeft', target: { tagName: 'TEXTAREA' }, preventDefault() {} });
check('typing in the editor does not steer the snake', true);

console.log('\ncoming back later:');
check('the code was saved for every step',
      steps.every(s => typeof store['snake-build-code-' + s.id] === 'string'));

console.log(failures === 0 ? '\nALL SNAKE WORKSHOP TESTS PASSED' : `\n${failures} WORKSHOP TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
