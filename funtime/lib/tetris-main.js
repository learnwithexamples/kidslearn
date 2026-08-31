/* ============================================================
   tetris-main.js — the glue

   This file is the only one that knows about the web page. It:
     1. finds the canvas and the buttons,
     2. starts a game,
     3. runs the game loop about 60 times a second,
     4. and passes key presses on to the rules.

   All the interesting thinking lives in the other four files.
   ============================================================ */

/** How many pixels wide one square of the board is. */
const CELL_SIZE = 30;

/** How many pixels wide one square of the "next piece" preview is. */
const PREVIEW_CELL_SIZE = 22;

/* The pieces of the page and the game we are playing right now. */
let game = null;
let input = null;
let boardContext = null;
let previewContext = null;
let previewCanvas = null;
let lastFrameTime = 0;
let actions = null;

/**
 * getElement — find one thing on the page by its id.
 *
 * INPUT:  id — the id written in the HTML, e.g. 'score'
 * OUTPUT: the element, or null if there is no such id
 *
 * ALGORITHM: ask the document for it.
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * updateScoreboard — copy the numbers from the game onto the page.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing (it changes the page)
 *
 * ALGORITHM: for score, lines and level, write the number into its element.
 */
function updateScoreboard(state) {
    getElement('score').textContent = state.score;
    getElement('lines').textContent = state.lines;
    getElement('level').textContent = state.level;
}

/**
 * updatePauseButton — keep the pause button's label honest.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing
 *
 * ALGORITHM: if the game is over say so; if it is paused the button offers
 *            "Play"; otherwise it offers "Pause".
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
 * drawEverything — draw one frame: the board, the preview and the numbers.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing
 *
 * ALGORITHM: call renderGame for the big canvas, renderNextPiece for the
 *            small one, then update the scoreboard and the pause button.
 */
function drawEverything(state) {
    renderGame(boardContext, state, CELL_SIZE);
    renderNextPiece(previewContext, state.nextType,
                    previewCanvas.width, previewCanvas.height, PREVIEW_CELL_SIZE);
    updateScoreboard(state);
    updatePauseButton(state);
}

/**
 * buildActions — make the list of things the player can ask for.
 *
 * INPUT:  none
 * OUTPUT: an object whose keys are action names and whose values are functions
 *
 * ALGORITHM: one small function per action, each one calling into the rules
 *            file. Every action redraws afterwards so the screen keeps up.
 *
 * This is the bridge between "a key was pressed" and "the rules of Tetris".
 */
function buildActions() {
    return {
        left: function () { tryMove(game, -1, 0); drawEverything(game); },
        right: function () { tryMove(game, 1, 0); drawEverything(game); },
        softDrop: function () { softDrop(game); drawEverything(game); },
        rotateRight: function () { tryRotate(game, true); drawEverything(game); },
        rotateLeft: function () { tryRotate(game, false); drawEverything(game); },
        hardDrop: function () { hardDrop(game); drawEverything(game); },
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
 * ALGORITHM:
 *   1. Build a fresh game state and a fresh input state.
 *   2. Start it paused so the player can read the controls first.
 *   3. Draw the first frame.
 */
function startNewGame() {
    game = createGame();
    game.isPaused = true;
    input = createInputState();
    drawEverything(game);
}

/**
 * gameLoop — the heartbeat, run by the browser about 60 times a second.
 *
 * INPUT:  timestamp — the current time in milliseconds, given by the browser
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Work out how long since the last frame (elapsed = now - lastTime),
 *      and remember the new time.
 *   2. Let held keys repeat (updateHeldKey).
 *   3. Let gravity pull the piece down (updateGame).
 *   4. Draw everything.
 *   5. Ask the browser to call this function again for the next frame.
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

    if (!game.isPaused && !game.isOver) {
        updateHeldKey(input, elapsed, actions);
        updateGame(game, elapsed);
    }

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
 *   1. On keydown: stop the arrows and space from scrolling the page, then
 *      hand the key to pressKey with the action list.
 *   2. On keyup: hand the key to releaseKey so it stops repeating.
 */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        if (shouldBlockBrowserKey(event.key)) {
            event.preventDefault();
        }
        pressKey(input, event.key, actions);
    });

    document.addEventListener('keyup', function (event) {
        releaseKey(input, event.key);
    });
}

/**
 * connectTouchButtons — make the on-screen buttons work on a tablet or phone.
 *
 * INPUT:  none
 * OUTPUT: nothing
 *
 * ALGORITHM: for each button id on the page, connect it to the matching action.
 */
function connectTouchButtons() {
    connectButton(getElement('btn-left'), actions.left);
    connectButton(getElement('btn-right'), actions.right);
    connectButton(getElement('btn-down'), actions.softDrop);
    connectButton(getElement('btn-rotate'), actions.rotateRight);
    connectButton(getElement('btn-drop'), actions.hardDrop);
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
 *   1. Find the two canvases and get their drawing tools.
 *   2. Size the board canvas from the board size and the cell size.
 *   3. Start a new game, connect the keyboard and the buttons.
 *   4. Kick off the game loop.
 */
function setUpGame() {
    const boardCanvas = getElement('tetris-board');
    previewCanvas = getElement('tetris-next');

    boardCanvas.width = BOARD_WIDTH * CELL_SIZE;
    boardCanvas.height = BOARD_HEIGHT * CELL_SIZE;

    boardContext = boardCanvas.getContext('2d');
    previewContext = previewCanvas.getContext('2d');

    actions = buildActions();
    startNewGame();
    connectKeyboard();
    connectTouchButtons();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
