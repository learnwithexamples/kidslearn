/* ============================================================
   race-input.js — listening to the driver

   Steering is different from Tetris and Snake: you do not tap a key once, you
   HOLD it. So this file keeps a little record of which keys are down right
   now, and the game asks it every frame.
   ============================================================ */

/** How much faster the road rushes past while you accelerate. */
const BOOST_FAST = 1.6;

/** And how much slower while you brake. */
const BOOST_SLOW = 0.55;

/**
 * actionForKey — turn a keyboard key into the name of a driving action.
 *
 * INPUT:  key — the key name from the browser, e.g. 'ArrowLeft' or 'a'
 * OUTPUT: one of 'left', 'right', 'faster', 'slower', 'pause', 'restart'
 *         — or null for keys the game does not use
 *
 * ALGORITHM: make the key lowercase, then look it up.
 *
 * CONTROLS:
 *   ← or A  steer left      → or D  steer right
 *   ↑ or W  accelerate      ↓ or S  brake
 *   P or Space  pause       R  new race
 */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === 'arrowup' || k === 'w') { return 'faster'; }
    if (k === 'arrowdown' || k === 's') { return 'slower'; }
    if (k === 'p' || k === ' ' || k === 'spacebar') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}

/**
 * isHeldAction — is this an action you hold down rather than tap?
 *
 * INPUT:  action — an action name
 * OUTPUT: true for 'left', 'right', 'faster' and 'slower'
 *
 * ALGORITHM: check the action against those four names.
 */
function isHeldAction(action) {
    return action === 'left' || action === 'right' ||
           action === 'faster' || action === 'slower';
}

/**
 * createInputState — a record of which driving keys are held down.
 *
 * INPUT:  none
 * OUTPUT: { left: false, right: false, faster: false, slower: false }
 */
function createInputState() {
    return { left: false, right: false, faster: false, slower: false };
}

/**
 * setHeld — remember that a key went down or came up.
 *
 * INPUT:  input — the input state. action — an action name. isDown — true/false.
 * OUTPUT: nothing
 *
 * ALGORITHM: if it is one of the four held actions, store isDown under that name.
 */
function setHeld(input, action, isDown) {
    if (isHeldAction(action)) {
        input[action] = isDown;
    }
}

/**
 * releaseAll — forget every held key.
 *
 * INPUT:  input — the input state
 * OUTPUT: nothing
 *
 * ALGORITHM: set all four back to false.
 *
 * WHY: if you press a key and then click on another window, the browser never
 *      tells us the key came up — so the car would steer for ever.
 */
function releaseAll(input) {
    input.left = false;
    input.right = false;
    input.faster = false;
    input.slower = false;
}

/**
 * steeringFromInput — which way is the driver steering?
 *
 * INPUT:  input — the input state
 * OUTPUT: -1 for left, 1 for right, 0 for straight ahead
 *
 * ALGORITHM: left alone is -1, right alone is 1. Holding both cancels out, so
 *            add them: (right ? 1 : 0) - (left ? 1 : 0).
 */
function steeringFromInput(input) {
    return (input.right ? 1 : 0) - (input.left ? 1 : 0);
}

/**
 * boostFromInput — how hard is the driver on the pedals?
 *
 * INPUT:  input — the input state
 * OUTPUT: BOOST_FAST while accelerating, BOOST_SLOW while braking, 1 otherwise
 *
 * ALGORITHM: braking wins if both pedals are down — that is what real brakes
 *            are for.
 */
function boostFromInput(input) {
    if (input.slower) {
        return BOOST_SLOW;
    }
    if (input.faster) {
        return BOOST_FAST;
    }
    return 1;
}

/**
 * shouldBlockBrowserKey — should the page ignore its normal job for this key?
 * INPUT: key. OUTPUT: true for the arrow keys and the space bar.
 */
function shouldBlockBrowserKey(key) {
    const k = String(key).toLowerCase();
    return k === 'arrowleft' || k === 'arrowright' || k === 'arrowup' ||
           k === 'arrowdown' || k === ' ' || k === 'spacebar';
}

/**
 * connectButton — make an on-screen button run an action when tapped.
 * INPUT: element (or null), action — a function. OUTPUT: nothing.
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

/**
 * connectHoldButton — an on-screen button you hold, like a key.
 *
 * INPUT:  element — a button (or null). onDown, onUp — functions to run.
 * OUTPUT: nothing
 *
 * ALGORITHM: press it with the mouse or a finger and onDown runs; let go,
 *            slide off it, or leave the page and onUp runs. The extra
 *            listeners matter: without them a finger that slides off the
 *            button would leave the car steering for ever.
 */
function connectHoldButton(element, onDown, onUp) {
    if (!element) {
        return;
    }
    const down = function (event) { event.preventDefault(); onDown(); };
    const up = function (event) { event.preventDefault(); onUp(); };

    element.addEventListener('mousedown', down);
    element.addEventListener('touchstart', down, { passive: false });
    element.addEventListener('mouseup', up);
    element.addEventListener('mouseleave', up);
    element.addEventListener('touchend', up);
    element.addEventListener('touchcancel', up);
}
