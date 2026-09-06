/* ============================================================
   test-js-steps.js — check every JavaScript workshop's steps.

       node funtime/tests/test-js-steps.js

   It finds each workshop by its `<game>-steps.js` file, then for every step
   makes sure the ANSWER passes all of that step's own tests and the empty
   STARTER does not.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LIB = path.join(__dirname, '..', 'lib');

/**
 * discoverWorkshops — find every JavaScript workshop in the lib folder.
 *
 * INPUT:  none
 * OUTPUT: an array of { game, stepsFile, constant, libs }
 *
 * ALGORITHM: a workshop is a `<game>-steps.js` file; the constant inside is
 *            named after the game, and the game's own libraries are every
 *            `<game>-*.js` that is not a steps or build file.
 */
function discoverWorkshops() {
    return fs.readdirSync(LIB)
        .filter(name => name.endsWith('-steps.js') && !name.endsWith('-python-steps.js'))
        .sort()
        .map(function (stepsFile) {
            const game = stepsFile.replace('-steps.js', '');
            const source = fs.readFileSync(path.join(LIB, stepsFile), 'utf8');
            const match = source.match(/const ([A-Z0-9_]+_STEPS)\s*=/);
            const prefix = game === 'tetris' ? 'tetris-' : game + '-';
            const libs = fs.readdirSync(LIB).filter(name =>
                name.startsWith(prefix) && name.endsWith('.js') &&
                !name.endsWith('-steps.js') && !name.endsWith('-build.js') &&
                !name.endsWith('-main.js')).sort();     /* -main talks to the page */
            return { game: game, stepsFile: stepsFile, constant: match && match[1], libs: libs };
        })
        .filter(w => w.constant && w.libs.length > 0);
}

let failures = 0;
let checked = 0;

discoverWorkshops().forEach(function (workshop) {
    const sandbox = { Math, console, JSON, Date };
    sandbox.window = sandbox;
    const ctx = vm.createContext(sandbox);
    workshop.libs.concat([workshop.stepsFile]).forEach(function (file) {
        vm.runInContext(fs.readFileSync(path.join(LIB, file), 'utf8'), ctx, { filename: file });
    });

    const steps = vm.runInContext(workshop.constant, ctx);
    console.log('\n' + workshop.game + ' — ' + steps.length + ' steps');

    const build = (code, fnName) => {
        try {
            return vm.runInContext(
                '(function (code, fnName) { return new Function(code + "\\n;return typeof " + fnName + " === \\"function\\" ? " + fnName + " : null;")(); })',
                ctx)(code, fnName);
        } catch (e) {
            return null;
        }
    };

    /**
     * makeTicker — a safety net for the tests themselves.
     *
     * INPUT:  none. OUTPUT: a function to call inside every loop.
     * ALGORITHM: count the turns and throw once there have been far too many.
     *
     * WHY: every test is run TWICE — once against the answer and once against
     *      the empty starter, which must fail. A test that loops until the
     *      student's function finishes something would never end against the
     *      starter, and would hang the whole suite instead of failing.
     */
    const makeTicker = () => {
        let turns = 0;
        return function () {
            turns++;
            if (turns > 20000000) {
                throw new Error('this test ran away — it must not loop until the answer works');
            }
            return true;
        };
    };

    /** guard — plant that safety net inside every while loop in a test. */
    const guard = code => code.replace(/\bwhile\s*\(/g, 'while (__tick() && ');

    const run = (step, fn) => step.tests.map(function (test) {
        try {
            if (test.code) {
                const assert = function (condition, message) {
                    if (!condition) { throw new Error(message || 'the check failed'); }
                };
                vm.runInContext('(function (fnName, code) { return new Function(fnName, "assert", "__tick", code); })', ctx)(step.fnName, guard(test.code))(fn, assert, makeTicker());
                return { name: test.name, ok: true, detail: '' };
            }
            if (test.check) {
                const custom = test.check(fn);
                return { name: test.name, ok: custom.ok === true, detail: custom.detail || '' };
            }
            const got = fn.apply(null, JSON.parse(JSON.stringify(test.args)));
            const ok = JSON.stringify(got) === JSON.stringify(test.expect);
            return { name: test.name, ok: ok, detail: ok ? '' : 'got ' + JSON.stringify(got) + ', expected ' + JSON.stringify(test.expect) };
        } catch (e) {
            return { name: test.name, ok: false, detail: 'crashed: ' + e.message };
        }
    });

    steps.forEach(function (step, index) {
        const label = String(index + 1).padStart(2) + '. ' + step.fnName;
        const answer = build(step.answer, step.fnName);
        if (!answer) {
            failures++;
            console.log('  FAIL ' + label + ': the answer does not compile');
            return;
        }
        const results = run(step, answer);
        checked += results.length;
        const bad = results.filter(r => !r.ok);
        if (bad.length) {
            failures++;
            console.log('  FAIL ' + label + ': answer failed ' + bad.length + '/' + results.length);
            bad.slice(0, 3).forEach(b => console.log('         - ' + b.name + ': ' + b.detail));
        } else {
            console.log('  ok   ' + label + ': answer passes all ' + results.length + ' tests');
        }

        const starter = build(step.starter, step.fnName);
        if (starter && run(step, starter).every(r => r.ok)) {
            failures++;
            console.log('  FAIL ' + label + ': the empty starter passes the tests!');
        }

        ['id', 'title', 'adds', 'intro', 'spec', 'starter', 'answer', 'hints', 'demo'].forEach(function (field) {
            if (!step[field]) { failures++; console.log('  FAIL ' + label + ': missing "' + field + '"'); }
        });
    });
});

console.log('\n' + checked + ' checks run');
console.log(failures === 0 ? 'ALL JS STEP TESTS PASSED' : failures + ' PROBLEM(S)');
process.exit(failures === 0 ? 0 : 1);
