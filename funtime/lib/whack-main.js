/* ============================================================
   whack-main.js — the glue between the page and Whack-a-Mole
   ============================================================ */

const BEST_KEY = 'whack-best-score';

let game = null;
let boardCanvas = null;
let ctx = null;
let lastFrameTime = 0;

function getElement(id) { return document.getElementById(id); }

/** loadBest — the best score this browser has seen. */
function loadBest() {
    try {
        const saved = window.localStorage.getItem(BEST_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) { return 0; }
}

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('score').textContent = state.score;
    getElement('hits').textContent = state.hits;
    getElement('time').textContent = Math.ceil(state.secondsLeft);
    getElement('level').textContent = state.level;

    let best = loadBest();
    if (state.score > best) {
        try { window.localStorage.setItem(BEST_KEY, String(state.score)); } catch (e) { /* ignore */ }
        best = state.score;
    }
    getElement('best').textContent = best;
}

/** updatePauseButton — keep the pause button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) { button.textContent = '⏱ Time up'; }
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — reset the clock and the score. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'restart') { startNewGame(); return; }
    if (action === 'pause') { togglePause(game); }
    else if (action === 'whack') { whack(game, holeIndex(game.cursor.column, game.cursor.row)); }
    else if (action === 'left') { moveCursor(game, -1, 0); }
    else if (action === 'right') { moveCursor(game, 1, 0); }
    else if (action === 'up') { moveCursor(game, 0, -1); }
    else if (action === 'down') { moveCursor(game, 0, 1); }
    drawEverything(game);
}

/** connectBoard — clicking or tapping a hole swings at it. */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        const y = (point.clientY - box.top) * (boardCanvas.height / box.height);
        const hole = holeAtPixel(x, y);
        if (hole) {
            game.cursor = hole;
            whack(game, holeIndex(hole.column, hole.row));
            drawEverything(game);
        }
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectKeyboard — arrows aim the hammer, space swings. */
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
     ['btn-whack', 'whack'], ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** gameLoop — the heartbeat: the clock and the moles. */
function gameLoop(timestamp) {
    if (lastFrameTime === 0) { lastFrameTime = timestamp; }
    let elapsed = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    if (elapsed > 100) { elapsed = 100; }

    updateGame(game, elapsed);
    drawEverything(game);
    window.requestAnimationFrame(gameLoop);
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('whack-board');
    boardCanvas.width = boardPixelSize();
    boardCanvas.height = boardPixelSize();
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectBoard();
    connectKeyboard();
    connectButtons();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
