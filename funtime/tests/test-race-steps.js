/* Every step's ANSWER must pass every one of that step's own tests, and the
   empty STARTER must fail — otherwise the workshop would pass you for nothing. */
const fs = require('fs'), vm = require('vm');
const LIB = require('path').join(__dirname, '..', 'lib') + require('path').sep;

const sandbox = { Math, console, JSON };
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);
['race-road.js', 'race-game.js', 'race-draw.js',
 'race-input.js', 'race-steps.js'].forEach(f => {
    vm.runInContext(fs.readFileSync(LIB + f, 'utf8'), ctx, { filename: f });
});

const steps = vm.runInContext('RACE_STEPS', ctx);

function compile(code, fnName) {
    try {
        const factory = vm.runInContext(
            '(function (code, fnName) { return new Function(code + "\\n;return typeof " + fnName + " === \\"function\\" ? " + fnName + " : null;"); })',
            ctx);
        return factory(code, fnName)();
    } catch (e) {
        return null;
    }
}

function runTests(step, fn) {
    const out = [];
    step.tests.forEach(test => {
        try {
            if (test.check) {
                const r = test.check(fn);
                out.push({ name: test.name, ok: r.ok === true, detail: r.detail || '' });
            } else {
                const args = JSON.parse(JSON.stringify(test.args));
                const got = fn.apply(null, args);
                const ok = JSON.stringify(got) === JSON.stringify(test.expect);
                out.push({ name: test.name, ok,
                           detail: ok ? '' : 'got ' + JSON.stringify(got) + ', expected ' + JSON.stringify(test.expect) });
            }
        } catch (e) {
            out.push({ name: test.name, ok: false, detail: 'crashed: ' + e.message });
        }
    });
    return out;
}

let failures = 0;
console.log(`${steps.length} steps\n`);

steps.forEach((step, i) => {
    const label = `${i + 1}. ${step.fnName}`;

    // the answer must compile and pass everything
    const answerFn = compile(step.answer, step.fnName);
    if (!answerFn) { failures++; console.log(`  FAIL ${label}: answer does not compile`); return; }
    const results = runTests(step, answerFn);
    const bad = results.filter(r => !r.ok);
    if (bad.length) {
        failures++;
        console.log(`  FAIL ${label}: answer failed ${bad.length}/${results.length} tests`);
        bad.forEach(b => console.log(`         - ${b.name}: ${b.detail}`));
    } else {
        console.log(`  ok   ${label}: answer passes all ${results.length} tests`);
    }

    // the starter must NOT pass (or the step would be free)
    const starterFn = compile(step.starter, step.fnName);
    if (starterFn) {
        const starterResults = runTests(step, starterFn);
        if (starterResults.every(r => r.ok)) {
            failures++;
            console.log(`  FAIL ${label}: the empty starter passes the tests!`);
        }
    }

    // the answer must match the real library function's behaviour on the tests
    const libFn = vm.runInContext(step.fnName, ctx);
    if (typeof libFn !== 'function') {
        failures++; console.log(`  FAIL ${label}: no such function in the game libraries`);
    }

    // required fields for the page
    ['id', 'title', 'adds', 'intro', 'spec', 'starter', 'answer', 'hints', 'demo'].forEach(field => {
        if (!step[field]) { failures++; console.log(`  FAIL ${label}: missing field "${field}"`); }
    });
    if (!step.spec.input || !step.spec.output || !Array.isArray(step.spec.algorithm)) {
        failures++; console.log(`  FAIL ${label}: incomplete spec`);
    }
    if (step.starter.indexOf('function ' + step.fnName) === -1) {
        failures++; console.log(`  FAIL ${label}: starter does not declare the function`);
    }
});

/* The library must really contain a function for every step, and every step id
   must be unique (they are localStorage keys). */
const ids = steps.map(s => s.id);
if (new Set(ids).size !== ids.length) { failures++; console.log('  FAIL duplicate step ids'); }

console.log(failures === 0 ? '\nALL STEP TESTS PASSED' : `\n${failures} PROBLEM(S)`);
process.exit(failures === 0 ? 0 : 1);
