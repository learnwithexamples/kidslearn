/* ============================================================
   run-all.js — run every test suite for the Fun Time games.

       node funtime/tests/run-all.js

   Each suite loads the real library files from ../lib and checks them, either
   as plain functions or by driving a whole page against a pretend browser.
   Nothing here needs a network connection or anything installed.
   ============================================================ */

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SUITES = [
    ['Tetris — game rules', 'test-tetris.js'],
    ['Tetris — page wiring', 'test-tetris-dom.js'],
    ['Tetris — workshop steps', 'test-steps.js'],
    ['Tetris — workshop page', 'test-build.js'],
    ['Snake — game rules', 'test-snake.js'],
    ['Snake — page wiring', 'test-snake-dom.js'],
    ['Snake — workshop steps', 'test-snake-steps.js'],
    ['Snake — workshop page', 'test-snake-build.js'],
    ['Racing — game rules', 'test-race.js'],
    ['Racing — page wiring', 'test-race-dom.js'],
    ['Racing — workshop steps', 'test-race-steps.js'],
    ['Racing — workshop page', 'test-race-build.js'],
    ['Arrow keys stay in the game', 'test-no-scroll.js'],
    ['The Fun Time hub', 'test-hub.js'],
    ['Files the pages need', 'test-assets.js'],
    ['Xbox controller support', 'test-gamepad.js'],
    ['Bubble Shooter — game rules', 'test-bubbles.js'],
    ['Typing Race — the board', 'test-typing.js'],
    ['Typing Race — the word lists', 'test-wordlists.js'],
    ['Word Rain — played by robots', 'test-wordfall.js'],
    ['Every JS workshop — steps', 'test-js-steps.js'],
    ['Every JS workshop — played through', 'test-js-workshops.js'],
    ['The code editor — colours & spec', 'test-editor.js']
];

let failed = 0;

/* The Python versions of the games are checked by Python itself. */
const PYTHON_SUITES = [
    ['Python games — rules & drawing', 'test_python_games.py'],
    ['Python workshops — every step', 'test_python_steps.py'],
    ['Python workshops — every demo', 'test_python_demos.py']
];

SUITES.forEach(function (suite) {
    const label = suite[0];
    const file = path.join(__dirname, suite[1]);
    if (!fs.existsSync(file)) {
        console.log('  MISSING  ' + label + '  (' + suite[1] + ')');
        failed++;
        return;
    }
    try {
        const out = execFileSync(process.execPath, [file], { encoding: 'utf8' });
        /* Some suites tick off each check with " ok   "; the auto-discovering
           ones just print a total at the end. Take whichever we can find. */
        const counted = (out.match(/ ok   /g) || []).length;
        const reported = out.match(/(\d+) checks run/);
        const checks = reported ? Number(reported[1]) : counted;
        console.log('  PASS  ' + label.padEnd(32) + ' ' + checks + ' checks');
    } catch (e) {
        failed++;
        console.log('  FAIL  ' + label);
        console.log(String(e.stdout || '').split('\n').filter(l => l.indexOf('FAIL') !== -1).map(l => '        ' + l).join('\n'));
    }
});

PYTHON_SUITES.forEach(function (suite) {
    const label = suite[0];
    const file = path.join(__dirname, suite[1]);
    if (!fs.existsSync(file)) {
        console.log('  MISSING  ' + label);
        failed++;
        return;
    }
    try {
        const out = execFileSync('python3', [file], { encoding: 'utf8' });
        const counted = (out.match(/ ok   /g) || []).length;
        const reported = out.match(/(\d+) checks run/);
        const checks = reported ? Number(reported[1]) : counted;
        console.log('  PASS  ' + label.padEnd(32) + ' ' + checks + ' checks');
    } catch (e) {
        failed++;
        console.log('  FAIL  ' + label);
        console.log(String(e.stdout || '').split('\n').filter(l => l.indexOf('FAIL') !== -1).map(l => '        ' + l).join('\n'));
    }
});

console.log(failed === 0 ? '\nEverything passes. 🎉' : '\n' + failed + ' suite(s) failed.');
process.exit(failed === 0 ? 0 : 1);
