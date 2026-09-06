/* ============================================================
   sokoban-main.js — the glue between the page and Sokoban
   ============================================================ */

let game = null;
let boardCanvas = null;
let ctx = null;

function getElement(id) { return document.getElementById(id); }

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('level').textContent = (state.level + 1) + ' / ' + LEVELS.length;
    getElement('moves').textContent = state.moves;
    getElement('boxes').textContent = boxesOnGoals(state) + ' / ' + state.boxes.length;
    getElement('solved').textContent = state.solved;
}

/** updatePauseButton — keep the button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isSolved) { button.textContent = '➜ Next level'; }
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — back to level 1. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'pause') {
        if (game.isSolved) { nextLevel(game); } else { togglePause(game); }
    }
    else if (action === 'up') { movePlayer(game, 0, -1); }
    else if (action === 'down') { movePlayer(game, 0, 1); }
    else if (action === 'left') { movePlayer(game, -1, 0); }
    else if (action === 'right') { movePlayer(game, 1, 0); }
    else if (action === 'undo') { undoMove(game); }
    else if (action === 'reset') { resetLevel(game); }
    else if (action === 'next') { nextLevel(game); }
    drawEverything(game);
}

/** connectKeyboard — the arrows walk, U undoes, R resets. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
}

/**
 * connectBoard — tapping a square walks one step towards it.
 * ALGORITHM: compare the square tapped with where the player is, and take one
 *            step along whichever direction is further away.
 */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        const y = (point.clientY - box.top) * (boardCanvas.height / box.height);
        const cell = cellAtPixel(x, y);
        if (!cell) { return; }

        const acrossBy = cell.x - game.player.x;
        const downBy = cell.y - game.player.y;
        if (acrossBy === 0 && downBy === 0) { return; }

        if (Math.abs(acrossBy) >= Math.abs(downBy)) {
            doAction(acrossBy > 0 ? 'right' : 'left');
        } else {
            doAction(downBy > 0 ? 'down' : 'up');
        }
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['btn-up', 'up'], ['btn-down', 'down'], ['btn-left', 'left'], ['btn-right', 'right'],
     ['btn-undo', 'undo'], ['btn-next', 'next'],
     ['pause-btn', 'pause'], ['restart-btn', 'reset']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('sokoban-board');
    boardCanvas.width = boardPixelWidth();
    boardCanvas.height = boardPixelHeight();
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectKeyboard();
    connectBoard();
    connectButtons();
}

document.addEventListener('DOMContentLoaded', setUpGame);
