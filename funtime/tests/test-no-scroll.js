/* ============================================================
   test-no-scroll.js — the arrow keys must stay in the game.

       node funtime/tests/test-no-scroll.js

   In a browser the arrows and the space bar scroll the page. In a game that
   is wrong: press DOWN to duck and the page lurches instead. This checks the
   shared fix stops exactly the right keys, in exactly the right places - and
   leaves typing, browser shortcuts and ordinary reading alone.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LIB = path.join(__dirname, '..', 'lib');
const PAGES = path.join(__dirname, '..');

let failures = 0;
let checks = 0;

function check(name, ok, detail) {
    checks++;
    if (ok) {
        console.log('  ok    ' + name);
    } else {
        failures++;
        console.log('  FAIL  ' + name + (detail !== undefined ? '  -> ' + JSON.stringify(detail) : ''));
    }
}

/**
 * press — send one key into no-scroll.js and see whether it was stopped.
 *
 * INPUT:  key, and optionally what it was aimed at and any modifier held
 * OUTPUT: true if the page would have been stopped from scrolling
 */
function press(key, options) {
    options = options || {};
    let handler = null;
    const sandbox = {
        document: {
            addEventListener(type, fn) { if (type === 'keydown') { handler = fn; } }
        }
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(LIB, 'no-scroll.js'), 'utf8'), sandbox,
                    { filename: 'no-scroll.js' });

    let prevented = false;
    handler({
        key: key,
        target: options.target || { tagName: 'BODY' },
        ctrlKey: !!options.ctrl,
        metaKey: !!options.meta,
        altKey: !!options.alt,
        preventDefault() { prevented = true; }
    });
    return prevented;
}

console.log('\nkeys that must stay in the game:');
['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].forEach(function (key) {
    check((key === ' ' ? 'SPACE' : key).padEnd(11) + ' does not scroll the page', press(key));
});

console.log('\nkeys that must still work as normal:');
['PageUp', 'PageDown', 'Home', 'End', 'Tab', 'a', 'Enter'].forEach(function (key) {
    check(key.padEnd(11) + ' still does its usual job', !press(key));
});

console.log('\ntyping must not be broken:');
[['TEXTAREA', 'the workshop editor'], ['INPUT', 'a text box'], ['SELECT', 'a dropdown']]
    .forEach(function ([tag, what]) {
        check('arrows still work in ' + what,
              !press('ArrowDown', { target: { tagName: tag } }));
    });
check('arrows still work in anything editable',
      !press('ArrowDown', { target: { tagName: 'DIV', isContentEditable: true } }));
check('space still works in the workshop editor',
      !press(' ', { target: { tagName: 'TEXTAREA' } }));

console.log('\nbrowser and system shortcuts are left alone:');
check('Cmd + Down still jumps to the bottom', !press('ArrowDown', { meta: true }));
check('Ctrl + Down is left alone', !press('ArrowDown', { ctrl: true }));
check('Alt + Left still goes back', !press('ArrowLeft', { alt: true }));

console.log('\nwhich pages get it:');
{
    const pages = fs.readdirSync(PAGES).filter(n => n.endsWith('.html'));
    const has = name => fs.readFileSync(path.join(PAGES, name), 'utf8').includes('lib/no-scroll.js');

    /* a page where a game is played: not a workshop, not the hub, not the tester */
    const playPages = pages.filter(n =>
        !n.endsWith('-build.html') && n !== 'funtime.html' && n !== 'gamepad-test.html');
    const workshops = pages.filter(n => n.endsWith('-build.html'));

    const missing = playPages.filter(n => !has(n));
    check('every one of the ' + playPages.length + ' game pages blocks arrow-scrolling',
          missing.length === 0, missing);

    const wrong = workshops.filter(has);
    check('no workshop page does — they are long and meant to be scrolled',
          wrong.length === 0, wrong);
}

console.log('\nthe gap this was closing:');
{
    /* Breakout only uses LEFT and RIGHT, so nothing in the game itself ever
       stopped DOWN from scrolling. That is the bug, and this proves the shape
       of it rather than just trusting the fix. */
    const sandbox = { Math, console, JSON, Date };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    ['breakout-rules.js', 'breakout-draw.js'].forEach(function (file) {
        vm.runInContext(fs.readFileSync(path.join(LIB, file), 'utf8'), sandbox, { filename: file });
    });
    const actionForKey = vm.runInContext('actionForKey', sandbox);

    check('Breakout itself has no use for ArrowDown', actionForKey('ArrowDown') === null);
    check('so the shared file is what stops it scrolling', press('ArrowDown'));
}

console.log('\n' + checks + ' checks run');
console.log(failures === 0 ? 'ALL SCROLL TESTS PASSED' : failures + ' TEST(S) FAILED');
process.exit(failures === 0 ? 0 : 1);
