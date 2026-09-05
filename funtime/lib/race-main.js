/* ============================================================
   race-main.js — the glue

   The only file that knows about the web page. It finds the canvas and the
   buttons, starts a race, runs the loop about 60 times a second, and passes
   key presses on to the rules.
   ============================================================ */

/** Where the best-ever score is kept in this browser. */
const BEST_SCORE_KEY = 'race-best-score';

let game = null;
let input = null;
let roadContext = null;
let lastFrameTime = 0;

/** getElement — find one thing on the page by its id. */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * loadBestScore — the best score this browser has ever seen.
 * INPUT: none. OUTPUT: a number (0 if nothing is saved).
 */
function loadBestScore() {
    try {
        const saved = window.localStorage.getItem(BEST_SCORE_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) {
        return 0;
    }
}

/** saveBestScore — remember a new best score. */
function saveBestScore(score) {
    try {
        window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    } catch (e) { /* storage is not available — never mind */ }
}

/**
 * updateScoreboard — copy the numbers from the race onto the page.
 * INPUT: state. OUTPUT: nothing.
 */
function updateScoreboard(state) {
    getElement('score').textContent = state.score;
    getElement('metres').textContent = metresDriven(state);
    getElement('level').textContent = state.level;

    const best = loadBestScore();
    if (state.score > best) {
        saveBestScore(state.score);
    }
    getElement('best').textContent = Math.max(best, state.score);
}

/**
 * updatePauseButton — keep the pause button's label honest.
 * INPUT: state. OUTPUT: nothing.
 */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) {
        return;
    }
    if (state.isOver) {
        button.textContent = '✖ Crashed';
    } else if (state.isPaused) {
        button.textContent = '▶ Go';
    } else {
        button.textContent = '⏸ Pause';
    }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(roadContext, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/**
 * startNewGame — throw the old race away and line up again.
 * INPUT: none. OUTPUT: nothing.
 * ALGORITHM: build a fresh state, forget any held keys, start it paused so the
 *            driver can read the controls, and draw the first frame.
 */
function startNewGame() {
    game = createGame();
    game.isPaused = true;
    releaseAll(input);
    drawEverything(game);
}

/**
 * gameLoop — the heartbeat, run by the browser about 60 times a second.
 *
 * INPUT:  timestamp — the current time in milliseconds, from the browser
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Work out how long since the last frame and remember the new time.
 *   2. Copy the held keys into the state as steering and boost.
 *   3. Let the race move on (updateRace).
 *   4. Draw everything, then ask for the next frame.
 */
function gameLoop(timestamp) {
    if (lastFrameTime === 0) {
        lastFrameTime = timestamp;
    }
    let elapsed = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    /* If the tab was hidden for a while, do not fast-forward the race. */
    if (elapsed > 100) {
        elapsed = 100;
    }

    game.steering = steeringFromInput(input);
    game.boost = boostFromInput(input);

    updateRace(game, elapsed);
    drawEverything(game);
    window.requestAnimationFrame(gameLoop);
}

/**
 * connectKeyboard — start listening to the keyboard.
 *
 * INPUT:  none
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   keydown: stop the arrows scrolling the page; a held action is remembered,
 *            pause and restart happen straight away. Steering also wakes a
 *            race that has not started yet.
 *   keyup:   forget the held key.
 *   blur:    the page lost focus, so forget every key.
 */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        if (shouldBlockBrowserKey(event.key)) {
            event.preventDefault();
        }
        const action = actionForKey(event.key);
        if (action === null) {
            return;
        }
        if (isHeldAction(action)) {
            setHeld(input, action, true);
            if (game.isPaused && !game.isOver) {
                game.isPaused = false;
            }
        } else if (action === 'pause') {
            togglePause(game);
            drawEverything(game);
        } else if (action === 'restart') {
            startNewGame();
        }
    });

    document.addEventListener('keyup', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) {
            setHeld(input, action, false);
        }
    });

    window.addEventListener('blur', function () {
        releaseAll(input);
    });
}

/**
 * connectTouchButtons — the on-screen controls for a tablet or phone.
 * INPUT: none. OUTPUT: nothing.
 * ALGORITHM: the four driving buttons are held down; pause and new race are taps.
 */
function connectTouchButtons() {
    connectHoldButton(getElement('btn-left'),
        function () { setHeld(input, 'left', true); if (game.isPaused && !game.isOver) { game.isPaused = false; } },
        function () { setHeld(input, 'left', false); });
    connectHoldButton(getElement('btn-right'),
        function () { setHeld(input, 'right', true); if (game.isPaused && !game.isOver) { game.isPaused = false; } },
        function () { setHeld(input, 'right', false); });
    connectHoldButton(getElement('btn-faster'),
        function () { setHeld(input, 'faster', true); },
        function () { setHeld(input, 'faster', false); });
    connectHoldButton(getElement('btn-slower'),
        function () { setHeld(input, 'slower', true); },
        function () { setHeld(input, 'slower', false); });

    connectButton(getElement('pause-btn'), function () { togglePause(game); drawEverything(game); });
    connectButton(getElement('restart-btn'), function () { startNewGame(); });
}

/**
 * setUpGame — everything that has to happen once, when the page loads.
 * INPUT: none. OUTPUT: nothing.
 */
function setUpGame() {
    const roadCanvas = getElement('race-road');
    roadCanvas.width = ROAD_WIDTH;
    roadCanvas.height = ROAD_HEIGHT;
    roadContext = roadCanvas.getContext('2d');

    input = createInputState();
    startNewGame();
    connectKeyboard();
    connectTouchButtons();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
