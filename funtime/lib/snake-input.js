/* ============================================================
   snake-input.js — listening to the player

   Snake needs no held keys: one tap, one turn. All this file does is turn a
   key press into the name of an action, and an action into a direction.
   ============================================================ */

/**
 * actionForKey — turn a keyboard key into the name of a game action.
 *
 * INPUT:  key — the key name from the browser, e.g. 'ArrowLeft' or 'w'
 * OUTPUT: one of 'up', 'down', 'left', 'right', 'pause', 'restart'
 *         — or null for keys the game does not use
 *
 * ALGORITHM: make the key lowercase, then look it up.
 *
 * CONTROLS:
 *   ↑ or W  up          ↓ or S  down
 *   ← or A  left        → or D  right
 *   P       pause       R       new game
 *   Space   pause too (it is the easiest key to hit in a hurry)
 */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowup' || k === 'w') { return 'up'; }
    if (k === 'arrowdown' || k === 's') { return 'down'; }
    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === 'p' || k === ' ' || k === 'spacebar') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}

/**
 * directionForAction — turn an action name into a direction to travel.
 *
 * INPUT:  action — an action name such as 'left'
 * OUTPUT: the matching direction object, or null if that action is not a move
 *
 * ALGORITHM: look the name up in DIRECTIONS; 'pause' and 'restart' are not in
 *            there, so they come back as null.
 */
function directionForAction(action) {
    if (DIRECTIONS[action]) {
        return DIRECTIONS[action];
    }
    return null;
}

/**
 * shouldBlockBrowserKey — should the page ignore its normal job for this key?
 *
 * INPUT:  key — the browser key name
 * OUTPUT: true for the arrow keys and the space bar
 *
 * ALGORITHM: check the key against the small list of keys that would otherwise
 *            scroll the page while you are playing.
 */
function shouldBlockBrowserKey(key) {
    const k = String(key).toLowerCase();
    return k === 'arrowleft' || k === 'arrowright' || k === 'arrowup' ||
           k === 'arrowdown' || k === ' ' || k === 'spacebar';
}

/**
 * connectButton — make an on-screen button run an action (for phones/tablets).
 *
 * INPUT:  element — a button on the page (or null). action — what to run.
 * OUTPUT: nothing
 *
 * ALGORITHM: listen for 'click' and for 'touchstart'; on touch, also stop the
 *            browser turning the tap into a second click.
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
