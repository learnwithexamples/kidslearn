/* ============================================================
   tetris-input.js — listening to the player

   Two different kinds of key press:

   * TAP once   — rotate, hard drop, pause, restart.
   * HOLD down  — left, right and soft drop should repeat while you hold them.

   Holding is handled the way real games do it: one move straight away, a
   short wait (the "delay"), then a steady stream of moves (the "repeat").
   ============================================================ */

/** Wait this long (milliseconds) before a held key starts repeating. */
const HOLD_DELAY_MS = 170;

/** Once repeating, do the move again every this many milliseconds. */
const HOLD_REPEAT_MS = 55;

/**
 * actionForKey — turn a keyboard key into the name of a game action.
 *
 * INPUT:  key — the key name from the browser, e.g. 'ArrowLeft' or 'a'
 * OUTPUT: one of 'left', 'right', 'softDrop', 'rotateRight', 'rotateLeft',
 *         'hardDrop', 'pause', 'restart' — or null for keys we ignore
 *
 * ALGORITHM: make the key lowercase, then look it up in a list of choices.
 *
 * CONTROLS:
 *   ←  or A     move left            →  or D   move right
 *   ↓  or S     soft drop (faster)   ↑ or W    rotate right
 *   Z           rotate left          Space     hard drop (slam down)
 *   P           pause                R         restart
 */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === 'arrowdown' || k === 's') { return 'softDrop'; }
    if (k === 'arrowup' || k === 'w' || k === 'x') { return 'rotateRight'; }
    if (k === 'z') { return 'rotateLeft'; }
    if (k === ' ' || k === 'spacebar') { return 'hardDrop'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}

/**
 * isHoldableAction — may this action repeat while the key is held down?
 *
 * INPUT:  action — an action name
 * OUTPUT: true for 'left', 'right' and 'softDrop'; false for everything else
 *
 * ALGORITHM: check whether the action is one of the three moving actions.
 *
 * WHY: holding rotate should NOT spin the piece forever — that would be
 *      unplayable. Only sliding and dropping repeat.
 */
function isHoldableAction(action) {
    return action === 'left' || action === 'right' || action === 'softDrop';
}

/**
 * createInputState — remember which movement key is being held.
 *
 * INPUT:  none
 * OUTPUT: an input state object:
 *           { heldAction, timer, hasStartedRepeating }
 *
 * ALGORITHM: return the object with nothing held yet.
 */
function createInputState() {
    return {
        heldAction: null,
        timer: 0,
        hasStartedRepeating: false
    };
}

/**
 * pressKey — react to a key going DOWN.
 *
 * INPUT:  input   — the input state
 *         key     — the browser key name
 *         actions — an object of functions, one per action name, e.g.
 *                   { left: fn, right: fn, softDrop: fn, ... }
 * OUTPUT: true if the key was one of ours (so the page can ignore it),
 *         false if it was a key we do not use
 *
 * ALGORITHM:
 *   1. Look up the action for this key; if there is none, answer false.
 *   2. Run that action once, straight away.
 *   3. If the action can repeat, remember it as the held action and reset
 *      the timer so the delay starts counting.
 *   4. Answer true.
 */
function pressKey(input, key, actions) {
    const action = actionForKey(key);
    if (action === null) {
        return false;
    }

    if (typeof actions[action] === 'function') {
        actions[action]();
    }

    if (isHoldableAction(action)) {
        input.heldAction = action;
        input.timer = 0;
        input.hasStartedRepeating = false;
    }

    return true;
}

/**
 * releaseKey — react to a key going UP.
 *
 * INPUT:  input — the input state
 *         key   — the browser key name
 * OUTPUT: nothing
 *
 * ALGORITHM: if the released key is the one we are holding, forget it.
 */
function releaseKey(input, key) {
    const action = actionForKey(key);
    if (action !== null && action === input.heldAction) {
        input.heldAction = null;
        input.timer = 0;
        input.hasStartedRepeating = false;
    }
}

/**
 * updateHeldKey — repeat the held move as time passes.
 *
 * INPUT:  input     — the input state
 *         elapsedMs — milliseconds since the last frame
 *         actions   — the same object of action functions
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. If nothing is held, stop.
 *   2. Add elapsedMs to the timer.
 *   3. Choose the waiting time: HOLD_DELAY_MS before the first repeat,
 *      HOLD_REPEAT_MS afterwards.
 *   4. While the timer is past that waiting time:
 *        take the waiting time off the timer,
 *        run the held action once,
 *        and remember that repeating has started.
 */
function updateHeldKey(input, elapsedMs, actions) {
    if (input.heldAction === null) {
        return;
    }

    input.timer = input.timer + elapsedMs;

    let wait = HOLD_DELAY_MS;
    if (input.hasStartedRepeating) {
        wait = HOLD_REPEAT_MS;
    }

    while (input.timer >= wait) {
        input.timer = input.timer - wait;
        input.hasStartedRepeating = true;
        wait = HOLD_REPEAT_MS;
        if (typeof actions[input.heldAction] === 'function') {
            actions[input.heldAction]();
        }
    }
}

/**
 * shouldBlockBrowserKey — should the page ignore its normal job for this key?
 *
 * INPUT:  key — the browser key name
 * OUTPUT: true for the arrow keys and the space bar
 *
 * ALGORITHM: check the key against the small list of keys that would
 *            otherwise scroll the page while you are playing.
 */
function shouldBlockBrowserKey(key) {
    const k = String(key).toLowerCase();
    return k === 'arrowleft' || k === 'arrowright' || k === 'arrowup' ||
           k === 'arrowdown' || k === ' ' || k === 'spacebar';
}

/**
 * connectButton — make an on-screen button run an action (for phones/tablets).
 *
 * INPUT:  element — a button element on the page (or null)
 *         action  — a function to run when it is tapped
 * OUTPUT: nothing
 *
 * ALGORITHM: listen for both 'click' and 'touchstart'; on touch, also stop
 *            the browser turning the tap into a second click.
 */
function connectButton(element, action) {
    if (!element) {
        return;
    }
    element.addEventListener('click', function () {
        action();
    });
    element.addEventListener('touchstart', function (event) {
        event.preventDefault();
        action();
    }, { passive: false });
}
