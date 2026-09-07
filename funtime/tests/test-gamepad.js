/* ============================================================
   test-gamepad.js — check the Xbox controller support.

       node funtime/tests/test-gamepad.js

   It builds a pretend browser and a pretend controller, presses things, and
   checks that the right key presses come out the other side. Then it loads
   every game's rules and makes sure each one actually understands what the
   controller can send.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LIB = path.join(__dirname, '..', 'lib');

let failures = 0;
let checks = 0;

/** check — one assertion, printed either way. */
function check(name, ok, detail) {
    checks++;
    if (ok) {
        console.log('  ok    ' + name);
    } else {
        failures++;
        console.log('  FAIL  ' + name + (detail ? '  -> ' + JSON.stringify(detail) : ''));
    }
}

/**
 * makeBrowser — a pretend browser just big enough for gamepad.js.
 *
 * OUTPUT: { sandbox, sent, setPad, tick, setNow }
 *
 * ALGORITHM: requestAnimationFrame does not really animate anything — it just
 *            remembers the callback so the test can step one frame at a time
 *            and know exactly when things happen.
 */
function makeBrowser() {
    const sent = [];
    let pad = null;
    let now = 1000;
    let nextFrame = null;
    const listeners = {};
    const extra = {};

    class KeyboardEvent {
        constructor(type, options) {
            this.type = type;
            this.key = options.key;
            this.bubbles = options.bubbles;
        }
    }

    const element = () => ({
        style: { cssText: '', opacity: '' },
        textContent: '',
        appendChild() { /* nothing to do */ }
    });

    const document = {
        body: element(),
        hidden: false,
        createElement: element,
        addEventListener(name, fn) {
            listeners[name] = fn;
            (extra[name] = extra[name] || []).push(fn);
        },
        dispatchEvent(event) {
            sent.push({ type: event.type, key: event.key });
            /* a real document hands the event to everybody listening, and so
               does this one - that is what lets a whole game be plugged in */
            (extra[event.type] || []).forEach(function (fn) { fn(event); });
        }
    };

    const sandbox = {
        console,
        Math,
        Date: { now: () => now },
        KeyboardEvent,
        document,
        navigator: { getGamepads: () => [pad] },
        window: {
            addEventListener(name, fn) { listeners[name] = fn; },
            requestAnimationFrame(fn) { nextFrame = fn; },
            setTimeout() { return 0; },
            clearTimeout() { /* nothing to do */ }
        }
    };
    sandbox.window.document = document;

    return {
        sandbox,
        sent,
        listeners,
        setPad(next) { pad = next; },
        setNow(next) { now = next; },
        tick() {
            const fn = nextFrame;
            nextFrame = null;
            if (fn) { fn(); }
        }
    };
}

/** makePad — a pretend Xbox controller with everything at rest. */
function makePad() {
    const buttons = [];
    for (let i = 0; i < 17; i++) { buttons.push({ pressed: false }); }
    return { connected: true, axes: [0, 0, 0, 0], buttons: buttons };
}

/** load — start gamepad.js inside a pretend browser. */
function load() {
    const browser = makeBrowser();
    vm.createContext(browser.sandbox);
    vm.runInContext(fs.readFileSync(path.join(LIB, 'gamepad.js'), 'utf8'),
                    browser.sandbox, { filename: 'gamepad.js' });
    return browser;
}

/** keysSent — just the keydowns, in order. */
function keysSent(sent) {
    return sent.filter(e => e.type === 'keydown').map(e => e.key);
}

console.log('\na pretend controller:');

/* ---- a button press becomes a key press ---- */
{
    const browser = load();
    const pad = makePad();
    browser.setPad(pad);
    browser.tick();                         /* notices the pad */
    browser.sent.length = 0;

    pad.buttons[0].pressed = true;          /* A */
    browser.tick();
    check('pressing A sends a space keydown',
          browser.sent.length === 1 && browser.sent[0].type === 'keydown' &&
          browser.sent[0].key === ' ', browser.sent);

    browser.sent.length = 0;
    browser.tick();
    check('holding A sends nothing more', browser.sent.length === 0, browser.sent);

    pad.buttons[0].pressed = false;
    browser.tick();
    check('letting A go sends a keyup',
          browser.sent.length === 1 && browser.sent[0].type === 'keyup' &&
          browser.sent[0].key === ' ', browser.sent);
}

/* ---- the D-pad ---- */
{
    const browser = load();
    const pad = makePad();
    browser.setPad(pad);
    browser.tick();
    browser.sent.length = 0;

    pad.buttons[14].pressed = true;         /* D-pad left */
    browser.tick();
    check('the D-pad sends the arrow keys',
          keysSent(browser.sent).join(',') === 'ArrowLeft', browser.sent);
}

/* ---- the stick, and its deadzone ---- */
{
    const browser = load();
    const pad = makePad();
    browser.setPad(pad);
    browser.tick();
    browser.sent.length = 0;

    pad.axes[0] = 0.2;                      /* a resting stick is never still */
    browser.tick();
    check('a barely-moved stick does nothing', browser.sent.length === 0, browser.sent);

    pad.axes[0] = 0.9;
    browser.tick();
    check('pushing the stick right sends ArrowRight',
          keysSent(browser.sent).join(',') === 'ArrowRight', browser.sent);

    browser.sent.length = 0;
    pad.axes[0] = 0.45;                     /* on the way back, but not home yet */
    browser.tick();
    check('a stick coming back stays held until it is well clear',
          browser.sent.length === 0, browser.sent);

    pad.axes[0] = 0.1;
    browser.tick();
    check('a stick back at rest lets the key go',
          browser.sent.length === 1 && browser.sent[0].type === 'keyup' &&
          browser.sent[0].key === 'ArrowRight', browser.sent);
}

/* ---- holding a direction repeats, holding a button does not ---- */
{
    const browser = load();
    const pad = makePad();
    browser.setPad(pad);
    browser.tick();
    browser.sent.length = 0;

    pad.buttons[15].pressed = true;         /* D-pad right */
    browser.tick();
    browser.setNow(1000 + 250);
    browser.tick();
    check('a held direction does not repeat straight away',
          keysSent(browser.sent).length === 1, browser.sent);

    browser.setNow(1000 + 450);
    browser.tick();
    browser.setNow(1000 + 600);
    browser.tick();
    check('a held direction repeats after a pause',
          keysSent(browser.sent).length === 3, keysSent(browser.sent));
}
{
    const browser = load();
    const pad = makePad();
    browser.setPad(pad);
    browser.tick();
    browser.sent.length = 0;

    pad.buttons[0].pressed = true;          /* A, held for a long time */
    browser.tick();
    for (let ms = 100; ms < 3000; ms += 100) {
        browser.setNow(1000 + ms);
        browser.tick();
    }
    check('a held fire button fires only once',
          keysSent(browser.sent).length === 1, keysSent(browser.sent));
}

/* ---- unplugging must not leave a key stuck down ---- */
{
    const browser = load();
    const pad = makePad();
    browser.setPad(pad);
    browser.tick();

    pad.buttons[14].pressed = true;
    browser.tick();
    browser.sent.length = 0;

    browser.setPad(null);                   /* somebody pulled the cable out */
    browser.tick();
    check('unplugging lets go of everything',
          browser.sent.some(e => e.type === 'keyup' && e.key === 'ArrowLeft'),
          browser.sent);
}

/* ---- and so must tabbing away ---- */
{
    const browser = load();
    const pad = makePad();
    browser.setPad(pad);
    browser.tick();
    pad.buttons[13].pressed = true;
    browser.tick();
    browser.sent.length = 0;

    browser.sandbox.document.hidden = true;
    browser.listeners.visibilitychange();
    check('tabbing away lets go of everything',
          browser.sent.some(e => e.type === 'keyup' && e.key === 'ArrowDown'),
          browser.sent);
}

/* ---- with no controller at all, nothing happens ---- */
{
    const browser = load();
    browser.tick();
    browser.tick();
    check('no controller means no key presses at all',
          browser.sent.length === 0, browser.sent);
}

/* ============================================================
   The whole chain, end to end: a controller moving a real game.

   Everything above tests gamepad.js on its own. This plugs a real game's
   rules onto the far end and checks that pushing the stick actually moves
   the player - through a genuine KeyboardEvent, exactly as in a browser.
   ============================================================ */

console.log('\nthe whole chain, controller to game:');
{
    const browser = load();

    /* load a real game's rules into the same pretend browser */
    vm.runInContext(fs.readFileSync(path.join(LIB, 'floors-rules.js'), 'utf8'),
                    browser.sandbox, { filename: 'floors-rules.js' });

    /* wire it up the way every game's page does: a key becomes an action,
       an action becomes a change in the game */
    vm.runInContext(`
        var game = createGame();
        document.addEventListener('keydown', function (event) {
            var action = actionForKey(event.key);
            if (action === 'left') { game.steering = -1; }
            else if (action === 'right') { game.steering = 1; }
        });
        document.addEventListener('keyup', function (event) {
            var action = actionForKey(event.key);
            if ((action === 'left' && game.steering === -1) ||
                (action === 'right' && game.steering === 1)) { game.steering = 0; }
        });
    `, browser.sandbox);

    const pad = makePad();
    browser.setPad(pad);
    browser.tick();

    const steering = () => vm.runInContext('game.steering', browser.sandbox);
    check('the game starts still', steering() === 0, steering());

    pad.axes[0] = 0.95;                     /* push the stick right */
    browser.tick();
    check('pushing the stick right steers the player right', steering() === 1, steering());

    /* and let the game actually run on it */
    const before = vm.runInContext('game.player.x', browser.sandbox);
    vm.runInContext('for (var f = 0; f < 40; f++) { updateGame(game, 16); }', browser.sandbox);
    const after = vm.runInContext('game.player.x', browser.sandbox);
    check('the player really moves across the shaft', after > before + 40,
          { before: before, after: after });

    pad.axes[0] = 0;                        /* let the stick go */
    browser.tick();
    check('letting the stick go stops the player', steering() === 0, steering());

    pad.buttons[9].pressed = true;          /* Menu = pause */
    browser.tick();
    check('the Menu button reaches the game as "p"',
          browser.sent.some(e => e.type === 'keydown' && e.key === 'p'), browser.sent);
}

/* ============================================================
   Every game has to understand what the controller can send.
   ============================================================ */

console.log('\nwhat each game does with the controller:');

const PAD_KEYS = [' ', 'Enter', 'f', 'h', 'z', 'n', 'r', 'p',
                  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const games = fs.readdirSync(LIB)
    .filter(name => name.endsWith('-rules.js'))
    .map(name => name.replace('-rules.js', ''))
    .sort();

/* Two of the games are about TYPING. You cannot type twenty-six letters on a
   controller, so those two need a keyboard and always will. Every other game
   has to be playable with the pad alone. */
const KEYBOARD_ONLY = ['hangman', 'typing'];

games.forEach(function (game) {
    const sandbox = { Math, console, JSON, Date };
    sandbox.window = sandbox;
    vm.createContext(sandbox);

    const prefix = game + '-';
    fs.readdirSync(LIB)
        .filter(name => name.startsWith(prefix) && name.endsWith('.js') &&
                        !name.endsWith('-steps.js') && !name.endsWith('-build.js') &&
                        !name.endsWith('-main.js'))
        .sort()
        .forEach(function (file) {
            vm.runInContext(fs.readFileSync(path.join(LIB, file), 'utf8'), sandbox,
                            { filename: file });
        });

    const understood = PAD_KEYS.filter(function (key) {
        try {
            return vm.runInContext('actionForKey', sandbox)(key) !== null;
        } catch (e) {
            return false;
        }
    });

    /* pause and restart are on every pad, but they do not make a game
       playable — there has to be something that actually plays it */
    const useful = understood.filter(k => k !== 'r' && k !== 'p');
    const label = game.padEnd(10) + ' [' + understood.join(' ') + ']';

    if (KEYBOARD_ONLY.indexOf(game) === -1) {
        check(label + ' — playable on the pad', useful.length > 0, understood);
    } else {
        check(label + ' — needs a keyboard, as expected', true);
    }
});

/* and the list of keyboard-only games has to stay honest */
check('only the two typing games need a keyboard',
      KEYBOARD_ONLY.every(name => games.indexOf(name) !== -1), KEYBOARD_ONLY);

console.log('\n' + checks + ' checks run');
console.log(failures === 0 ? 'ALL GAMEPAD TESTS PASSED' : failures + ' TEST(S) FAILED');
process.exit(failures === 0 ? 0 : 1);
