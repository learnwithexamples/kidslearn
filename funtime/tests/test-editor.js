/* ============================================================
   test-editor.js — the code editor: its colours and its spec comment

       node funtime/tests/test-editor.js

   Two things are checked here that no other suite can reach.

   The highlighter, on its own: it must never lose, add or reorder a single
   character, because the coloured layer sits directly underneath the
   textarea and any difference shows up as text visibly out of line.

   The spec comment in PYTHON. test-js-workshops.js already walks every
   JavaScript workshop, but the Python ones only start after Pyodide has
   downloaded, which a Node test cannot do. So this file runs the real
   workshop engine with a stub Python engine, reads what lands in the editor
   for every step, and then hands the lot to real python3 to compile.
   ============================================================ */

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const LIB = path.join(__dirname, '..', 'lib');

let failures = 0;
let checks = 0;

function check(name, ok, extra) {
    checks++;
    if (!ok) {
        failures++;
        console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : ''));
    }
}

/* ---------------------------------------------------------------- part A */

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(LIB, 'code-highlight.js'), 'utf8'), sandbox);
const HIGHLIGHT = sandbox.window.CodeHighlight;

/** plain — the text a coloured line actually shows, tags taken back off. */
function plain(html) {
    return String(html).replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/** classOf — which colour the highlighter gave one word. */
function classOf(html, word) {
    const found = new RegExp('<span class="tok-([a-z]+)">' +
                             word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '</span>').exec(html);
    return found ? found[1] : null;
}

console.log('the highlighter');

[['javascript', 'const MAX_SPEED = 260;\nfunction go(x) { /* hi */ return "a" + Math.cos(x); }'],
 ['python', 'MAX_SPEED = 260\n\n\ndef go(x):\n    # hi\n    return len("a") + math.cos(x)']
].forEach(function (pair) {
    const language = pair[0];
    const html = HIGHLIGHT.highlight(pair[1], language);
    check(language + ': nothing is lost or added', plain(html) === pair[1], plain(html));
    check(language + ': a constant is a constant', classOf(html, 'MAX_SPEED') === 'constant');
    check(language + ': a number is a number', classOf(html, '260') === 'number');
    check(language + ': the function being called is marked', classOf(html, 'go') === 'call');
    check(language + ': a comment is a comment',
          /<span class="tok-comment">[^<]*hi/.test(html), html);
});

check('javascript: const is a keyword',
      classOf(HIGHLIGHT.highlight('const a = 1;', 'javascript'), 'const') === 'keyword');
check('python: def is a keyword',
      classOf(HIGHLIGHT.highlight('def a():\n    pass', 'python'), 'def') === 'keyword');
check('javascript: Math is a builtin',
      classOf(HIGHLIGHT.highlight('Math.PI;', 'javascript'), 'Math') === 'builtin');
check('python: len is a builtin',
      classOf(HIGHLIGHT.highlight('len(x)', 'python'), 'len') === 'builtin');

/* A keyword inside a string is just letters, and must not be coloured as
   code — getting this wrong is the classic highlighter bug. */
check('a keyword inside a string stays a string',
      classOf(HIGHLIGHT.highlight('const s = "return if for";', 'javascript'), 'return') === null);
check("a # inside a Python string is not a comment",
      plain(HIGHLIGHT.highlight('s = "a # b"\nx = 1', 'python')) === 's = "a # b"\nx = 1' &&
      classOf(HIGHLIGHT.highlight('s = "a # b"\nx = 1', 'python'), '1') === 'number');
check('a triple-quoted Python string holds together',
      /^<span class="tok-string">"""one\ntwo"""<\/span>$/
          .test(HIGHLIGHT.highlight('"""one\ntwo"""', 'python')),
      HIGHLIGHT.highlight('"""one\ntwo"""', 'python'));

/* Code must never be able to become markup. */
const nasty = 'if (a < b && c > d) { x = "<script>alert(1)</script>"; }';
const nastyHtml = HIGHLIGHT.highlight(nasty, 'javascript');
check('code cannot turn into markup', nastyHtml.indexOf('<script>') === -1, nastyHtml);
check('and it still reads back exactly', plain(nastyHtml) === nasty, plain(nastyHtml));

check('empty code is fine', HIGHLIGHT.highlight('', 'javascript') === '');
check('an unknown language falls back to JavaScript',
      HIGHLIGHT.highlight('const a = 1;', 'klingon') === HIGHLIGHT.highlight('const a = 1;', 'javascript'));

/* Every real answer in every workshop, both languages, must survive intact. */
let roundTrips = 0;
let broken = null;
fs.readdirSync(LIB).filter(f => f.endsWith('-steps.js')).forEach(function (file) {
    const language = file.indexOf('-python-') !== -1 ? 'python' : 'javascript';
    const src = fs.readFileSync(path.join(LIB, file), 'utf8');
    const name = src.match(/const\s+([A-Z0-9_]+)\s*=\s*\[/)[1];
    const box = { __out: null };
    vm.createContext(box);
    vm.runInContext(src + '\n;__out = ' + name + ';', box);
    box.__out.forEach(function (step) {
        [step.starter, step.answer].forEach(function (code) {
            roundTrips++;
            if (broken === null && plain(HIGHLIGHT.highlight(code, language)) !== code) {
                broken = file + ' / ' + step.fnName;
            }
        });
    });
});
check('every workshop answer survives being coloured (' + roundTrips + ' of them)',
      broken === null, broken);

/* ---------------------------------------------------------------- part B */

/** makeElement — the least element workshop.js can work with. */
function makeElement(tag) {
    return {
        tagName: (tag || 'div').toUpperCase(),
        children: [], listeners: {}, style: {},
        className: '', textContent: '', value: '', title: '', disabled: false,
        width: 0, height: 0,
        appendChild(child) { this.children.push(child); return child; },
        addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); },
        click() { (this.listeners['click'] || []).forEach(fn => fn({ preventDefault() {} })); },
        getContext() { return new Proxy({}, { get: () => () => {} }); },
        querySelectorAll() { return []; },
        set innerHTML(value) { this._html = value; this.children = []; },
        get innerHTML() { return this._html || ''; }
    };
}

const ELEMENT_IDS = ['progress', 'progress-text', 'step-number', 'step-title', 'step-adds',
    'step-intro', 'step-spec', 'step-warning', 'code-editor', 'code-highlight', 'btn-test',
    'btn-hint', 'btn-answer', 'btn-reset', 'hint-box', 'test-summary', 'test-results',
    'btn-prev', 'btn-next', 'finish-panel', 'btn-demo-yours', 'btn-demo-goal', 'demo-status',
    'demo-canvas', 'demo-controls', 'demo-note', 'demo-caption', 'btn-restart-course'];

/**
 * runPythonWorkshop — start one Python workshop and read every step's editor.
 *
 * ALGORITHM: mark every step finished before starting, so none is locked;
 *            then click each progress dot in turn and take a copy of what
 *            the editor and the colour layer are showing.
 */
function runPythonWorkshop(file) {
    const src = fs.readFileSync(path.join(LIB, file), 'utf8');
    const constName = src.match(/const\s+([A-Z0-9_]+)\s*=\s*\[/)[1];

    const elements = {};
    ELEMENT_IDS.forEach(id => { elements[id] = makeElement(id === 'code-editor' ? 'textarea' : 'pre'); });
    const store = {};
    const docListeners = {};

    const box = {
        Math, console, JSON, Date, Array, Object, String, Number, Boolean, Error, RegExp,
        document: {
            readyState: 'complete',
            getElementById: id => elements[id] || null,
            createElement: tag => makeElement(tag),
            addEventListener: (t, fn) => { (docListeners[t] = docListeners[t] || []).push(fn); },
            querySelectorAll: () => []
        }
    };
    box.window = box;
    box.localStorage = {
        getItem: k => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: k => { delete store[k]; }
    };
    box.requestAnimationFrame = () => {};
    box.confirm = () => true;
    box.scrollTo = () => {};

    vm.createContext(box);
    vm.runInContext(fs.readFileSync(path.join(LIB, 'code-highlight.js'), 'utf8'), box);
    vm.runInContext(fs.readFileSync(path.join(LIB, 'workshop.js'), 'utf8'), box);
    vm.runInContext(src, box);
    const steps = vm.runInContext(constName, box);

    /* Every step finished, so every dot can be clicked. */
    store['t-done'] = JSON.stringify(steps.map(s => s.id));

    const noop = () => {};
    box.startWorkshop({
        storagePrefix: 't',
        steps: steps,
        language: 'python',
        engine: {
            compile: () => ({ ok: true, fn: {} }),
            install: () => true,
            runTests: step => step.tests.map(t => ({ name: t.name, ok: true, detail: '' }))
        },
        demo: { sizeCanvas: noop, start: noop, update: noop, draw: noop, controls: noop }
    });

    return steps.map(function (step, index) {
        elements['progress'].children[index].click();
        const seeded = elements['code-editor'].value;
        const layer = plain(elements['code-highlight'].innerHTML);
        elements['btn-answer'].click();
        return { fnName: step.fnName, seeded: seeded, layer: layer,
                 answered: elements['code-editor'].value };
    });
}

console.log('the spec comment, in Python');

const pythonFiles = fs.readdirSync(LIB).filter(f => f.endsWith('-python-steps.js')).sort();
check('there are Python workshops to check', pythonFiles.length > 0, pythonFiles.length);

const toCompile = [];
pythonFiles.forEach(function (file) {
    const game = file.replace('-python-steps.js', '');
    let seen;
    try {
        seen = runPythonWorkshop(file);
    } catch (error) {
        check(game + ': the workshop starts', false, error.message);
        return;
    }

    seen.forEach(function (step) {
        const label = game + '/' + step.fnName;
        const lines = step.seeded.split('\n');
        const commentLines = [];
        for (const line of lines) {
            if (line.indexOf('#') !== 0) { break; }
            commentLines.push(line);
        }

        check(label + ': opens with a # comment block',
              commentLines.length >= 3 && step.seeded.indexOf('# INPUT:') === 0,
              lines[0]);
        check(label + ': the comment holds the whole spec',
              commentLines.join('\n').indexOf('# OUTPUT:') !== -1 &&
              commentLines.join('\n').indexOf('# ALGORITHM:') !== -1,
              commentLines.join('\n'));
        check(label + ': no leftover HTML',
              step.seeded.indexOf('<code>') === -1 && step.seeded.indexOf('&lt;') === -1);
        check(label + ': it wraps',
              commentLines.every(line => line.length <= 64),
              commentLines.find(line => line.length > 64));
        check(label + ': the comment is Python, not JavaScript',
              commentLines.every(line => line.indexOf('/*') === -1 &&
                                         line.indexOf('*/') === -1),
              commentLines.find(line => line.indexOf('/*') !== -1));
        check(label + ': the colour layer matches the text',
              step.layer === step.seeded + '\n', step.layer.slice(0, 70));
        check(label + ': the Answer button keeps the spec on top',
              step.answered.indexOf('# INPUT:') === 0, step.answered.slice(0, 40));

        toCompile.push([label + ' (starter)', step.seeded]);
        toCompile.push([label + ' (answer)', step.answered]);
    });
});

/* The real proof: hand every one of them to Python itself. */
const listFile = path.join(os.tmpdir(), 'workshop-python-starters.json');
fs.writeFileSync(listFile, JSON.stringify(toCompile));
let compileReport;
try {
    compileReport = execFileSync('python3', ['-c', `
import json, sys
pairs = json.load(open(sys.argv[1]))
bad = []
for label, source in pairs:
    try:
        compile(source, label, "exec")
    except SyntaxError as error:
        bad.append("%s: %s" % (label, error))
print(json.dumps({"total": len(pairs), "bad": bad[:5], "count": len(bad)}))
`, listFile], { encoding: 'utf8' });
} catch (error) {
    compileReport = JSON.stringify({ total: 0, bad: [String(error.message)], count: 1 });
}
fs.unlinkSync(listFile);

const report = JSON.parse(compileReport);
check('real Python compiles every commented starter and answer (' + report.total + ')',
      report.count === 0, report.bad);

console.log('\n' + checks + ' checks run');
if (failures) {
    console.log(failures + ' PROBLEM(S)');
    process.exit(1);
}
console.log('ALL EDITOR TESTS PASSED');
