/* ============================================================
   lights-main.js — the glue between the page and Lights Out
   ============================================================ */

const BEST_KEY = 'lights-best-moves';

let game = null;
let boardCanvas = null;
let ctx = null;

/** getElement — find one thing on the page by its id. */
function getElement(id) {
    return document.getElementById(id);
}

/** loadBest — the fewest presses this browser has seen (0 means none yet). */
function loadBest() {
    try {
        const saved = window.localStorage.getItem(BEST_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) {
        return 0;
    }
}

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('moves').textContent = state.moves;
    getElement('lit').textContent = countLightsOn(state.lights);

    let best = loadBest();
    if (state.isOver && (best === 0 || state.moves < best)) {
        try { window.localStorage.setItem(BEST_KEY, String(state.moves)); } catch (e) { /* ignore */ }
        best = state.moves;
    }
    getElement('best').textContent = best === 0 ? '—' : best;
}

/** updatePauseButton — keep the pause button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) { button.textContent = '🏆 Solved'; }
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — scramble a fresh puzzle. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'restart') { startNewGame(); return; }
    if (action === 'pause') { togglePause(game); }
    else if (action === 'press') { pressSquare(game, game.cursor.column, game.cursor.row); }
    else if (action === 'left') { moveCursor(game, -1, 0); }
    else if (action === 'right') { moveCursor(game, 1, 0); }
    else if (action === 'up') { moveCursor(game, 0, -1); }
    else if (action === 'down') { moveCursor(game, 0, 1); }
    drawEverything(game);
}

/** connectBoard — clicking or tapping a square presses it. */
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
            pressSquare(game, square.column, square.row);
            drawEverything(game);
        }
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectKeyboard — arrows move the cursor, space presses. */
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
     ['btn-press', 'press'], ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) {
            element.addEventListener('click', function () { doAction(pair[1]); });
        }
    });
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('lights-board');
    boardCanvas.width = boardPixelSize();
    boardCanvas.height = boardPixelSize();
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectBoard();
    connectKeyboard();
    connectButtons();
}

document.addEventListener('DOMContentLoaded', setUpGame);
