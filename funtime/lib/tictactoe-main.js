/* ============================================================
   tictactoe-main.js — the glue between the page and Tic-Tac-Toe
   ============================================================ */

let game = null;
let boardCanvas = null;
let ctx = null;

function getElement(id) { return document.getElementById(id); }

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('wins').textContent = state.wins;
    getElement('losses').textContent = state.losses;
    getElement('draws').textContent = state.draws;
}

/** updatePauseButton — keep the pause button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) { button.textContent = '↻ Next round'; }
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — clear the board and the score. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'restart') { nextRound(game); }
    else if (action === 'pause') {
        if (game.isOver) { nextRound(game); } else { togglePause(game); }
    }
    else if (action === 'play') { playSquare(game, squareIndex(game.cursor.column, game.cursor.row)); }
    else if (action === 'left') { moveCursor(game, -1, 0); }
    else if (action === 'right') { moveCursor(game, 1, 0); }
    else if (action === 'up') { moveCursor(game, 0, -1); }
    else if (action === 'down') { moveCursor(game, 0, 1); }
    drawEverything(game);
}

/** connectBoard — clicking or tapping a square plays there. */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        const y = (point.clientY - box.top) * (boardCanvas.height / box.height);
        const square = squareAtPixel(x, y);
        if (square) {
            game.cursor = square;
            playSquare(game, squareIndex(square.column, square.row));
            drawEverything(game);
        }
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectKeyboard — arrows move the cursor, space plays. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const key = String(event.key).toLowerCase();
        if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'spacebar'].indexOf(key) !== -1) {
            event.preventDefault();
        }
        doAction(actionForKey(event.key));
    });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['btn-up', 'up'], ['btn-down', 'down'], ['btn-left', 'left'], ['btn-right', 'right'],
     ['btn-play', 'play'], ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('tictactoe-board');
    boardCanvas.width = boardPixelSize();
    boardCanvas.height = boardPixelSize();
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectBoard();
    connectKeyboard();
    connectButtons();
}

document.addEventListener('DOMContentLoaded', setUpGame);
