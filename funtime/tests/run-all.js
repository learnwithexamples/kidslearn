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
    ['Racing — workshop page', 'test-race-build.js']
];

let failed = 0;

/* The Python versions of the games are checked by Python itself. */
const PYTHON_SUITES = [
    ['Python games — rules & drawing', 'test_python_games.py'],
    ['Python workshops — every step', 'test_python_steps.py']
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
        const checks = (out.match(/ ok   /g) || []).length;
        console.log('  PASS  ' + label.padEnd(32) + checks + ' checks');
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
        const checks = (out.match(/ ok   /g) || []).length || (out.match(/checks run/) ? out : '').length;
        console.log('  PASS  ' + label.padEnd(32) + (out.match(/(\d+) checks run/) || [0, '?'])[1] + ' checks');
    } catch (e) {
        failed++;
        console.log('  FAIL  ' + label);
        console.log(String(e.stdout || '').split('\n').filter(l => l.indexOf('FAIL') !== -1).map(l => '        ' + l).join('\n'));
    }
});

console.log(failed === 0 ? '\nEverything passes. 🎉' : '\n' + failed + ' suite(s) failed.');
process.exit(failed === 0 ? 0 : 1);
