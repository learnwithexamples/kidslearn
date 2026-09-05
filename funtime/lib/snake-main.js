/* ============================================================
   snake-main.js — the glue

   This is the only file that knows about the web page. It finds the canvas
   and the buttons, starts a game, runs the loop about 60 times a second, and
   passes key presses on to the rules. All the thinking lives in the other
   four files.
   ============================================================ */

/** How many pixels wide one square of the field is. */
const CELL_SIZE = 20;

/** Where the best-ever score is kept in this browser. */
const BEST_SCORE_KEY = 'snake-best-score';

let game = null;
let boardContext = null;
let lastFrameTime = 0;
let actions = null;

/**
 * getElement — find one thing on the page by its id.
 * INPUT: id. OUTPUT: the element, or null.
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * loadBestScore — the best score this browser has ever seen.
 *
 * INPUT:  none
 * OUTPUT: a number (0 if there is nothing saved or storage is blocked)
 *
 * ALGORITHM: read the saved text and turn it into a number; if anything goes
 *            wrong, say 0.
 */
function loadBestScore() {
    try {
        const saved = window.localStorage.getItem(BEST_SCORE_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) {
        return 0;
    }
}

/**
 * saveBestScore — remember a new best score.
 *
 * INPUT:  score — the score to save
 * OUTPUT: nothing
 *
 * ALGORITHM: write it down, and quietly give up if the browser will not let us.
 */
function saveBestScore(score) {
    try {
        window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    } catch (e) { /* storage is not available — never mind */ }
}

/**
 * updateScoreboard — copy the numbers from the game onto the page.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing
 *
 * ALGORITHM: write the score, the snake's length and the level into their
 *            boxes, and update the best score whenever this game beats it.
 */
function updateScoreboard(state) {
    getElement('score').textContent = state.score;
    getElement('length').textContent = snakeLength(state);
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
 * ALGORITHM: say "Over" for a finished game, "Play" while paused, else "Pause".
 */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) {
        return;
    }
    if (state.isOver) {
        button.textContent = '✖ Over';
    } else if (state.isPaused) {
        button.textContent = '▶ Play';
    } else {
        button.textContent = '⏸ Pause';
    }
}

/**
 * drawEverything — draw one frame and refresh the numbers.
 * INPUT: state. OUTPUT: nothing.
 */
function drawEverything(state) {
    renderGame(boardContext, state, CELL_SIZE);
    updateScoreboard(state);
    updatePauseButton(state);
}

/**
 * buildActions — the list of things the player can ask for.
 *
 * INPUT:  none
 * OUTPUT: an object whose keys are action names and whose values are functions
 *
 * ALGORITHM: one small function per action. This is the bridge between "a key
 *            was pressed" and "the rules of Snake".
 */
function buildActions() {
    return {
        up: function () { turnSnake(game, DIRECTIONS.up); },
        down: function () { turnSnake(game, DIRECTIONS.down); },
        left: function () { turnSnake(game, DIRECTIONS.left); },
        right: function () { turnSnake(game, DIRECTIONS.right); },
        pause: function () { togglePause(game); drawEverything(game); },
        restart: function () { startNewGame(); }
    };
}

/**
 * startNewGame — throw the old game away and begin again.
 *
 * INPUT:  none
 * OUTPUT: nothing
 *
 * ALGORITHM: build a fresh state, start it paused so the player can read the
 *            controls, and draw the first frame.
 */
function startNewGame() {
    game = createGame();
    game.isPaused = true;
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
 *   2. Let the snake crawl (updateGame).
 *   3. Draw everything.
 *   4. Ask the browser to call this again for the next frame.
 */
function gameLoop(timestamp) {
    if (lastFrameTime === 0) {
        lastFrameTime = timestamp;
    }
    let elapsed = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    /* If the tab was hidden for a while, do not fast-forward the game. */
    if (elapsed > 100) {
        elapsed = 100;
    }

    updateGame(game, elapsed);
    drawEverything(game);
    window.requestAnimationFrame(gameLoop);
}

/**
 * connectKeyboard — start listening to the keyboard.
 *
 * INPUT:  none
 * OUTPUT: nothing
 *
 * ALGORITHM: on every key, stop the arrows scrolling the page, look the action
 *            up with actionForKey, and run it if we have one.
 */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        if (shouldBlockBrowserKey(event.key)) {
            event.preventDefault();
        }
        const action = actionForKey(event.key);
        if (action !== null && typeof actions[action] === 'function') {
            /* A turn should also wake a paused game up. */
            if (game.isPaused && !game.isOver && action !== 'pause' && action !== 'restart') {
                game.isPaused = false;
            }
            actions[action]();
        }
    });
}

/**
 * connectTouchButtons — make the on-screen buttons work on a tablet or phone.
 * INPUT: none. OUTPUT: nothing.
 * ALGORITHM: connect each button id to its matching action.
 */
function connectTouchButtons() {
    connectButton(getElement('btn-up'), actions.up);
    connectButton(getElement('btn-down'), actions.down);
    connectButton(getElement('btn-left'), actions.left);
    connectButton(getElement('btn-right'), actions.right);
    connectButton(getElement('pause-btn'), actions.pause);
    connectButton(getElement('restart-btn'), actions.restart);
}

/**
 * setUpGame — everything that has to happen once, when the page loads.
 *
 * INPUT:  none
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Find the canvas and size it from the grid.
 *   2. Build the actions, start a game, connect the keyboard and buttons.
 *   3. Kick off the loop.
 */
function setUpGame() {
    const boardCanvas = getElement('snake-board');
    boardCanvas.width = GRID_WIDTH * CELL_SIZE;
    boardCanvas.height = GRID_HEIGHT * CELL_SIZE;
    boardContext = boardCanvas.getContext('2d');

    actions = buildActions();
    startNewGame();
    connectKeyboard();
    connectTouchButtons();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
