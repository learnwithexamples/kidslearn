/* ============================================================
   simon-main.js — the glue between the page and Simon Says
   ============================================================ */

const BEST_KEY = 'simon-best-round';

let game = null;
let boardCanvas = null;
let ctx = null;
let lastFrameTime = 0;

function getElement(id) { return document.getElementById(id); }

/** loadBest — the furthest round this browser has reached. */
function loadBest() {
    try {
        const saved = window.localStorage.getItem(BEST_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) { return 0; }
}

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('round').textContent = state.round;
    getElement('score').textContent = state.score;
    getElement('length').textContent = state.sequence.length;

    let best = loadBest();
    if (state.round > best) {
        try { window.localStorage.setItem(BEST_KEY, String(state.round)); } catch (e) { /* ignore */ }
        best = state.round;
    }
    getElement('best').textContent = best;
}

/** updatePauseButton — keep the pause button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) { button.textContent = '✖ Wrong'; }
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — a fresh sequence of one. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'restart') { startNewGame(); return; }
    if (action === 'pause') { togglePause(game); }
    else if (action.indexOf('pad') === 0) { pressPad(game, Number(action.slice(3))); }
    drawEverything(game);
}

/** connectBoard — clicking or tapping a pad presses it. */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        const y = (point.clientY - box.top) * (boardCanvas.height / box.height);
        const pad = padAtPixel(x, y);
        if (pad >= 0) {
            pressPad(game, pad);
            drawEverything(game);
        }
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectKeyboard — 1-4, QWAS or the arrows press the pads. */
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
    [['btn-pad0', 'pad0'], ['btn-pad1', 'pad1'], ['btn-pad2', 'pad2'], ['btn-pad3', 'pad3'],
     ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** gameLoop — the heartbeat: the flashing sequence. */
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
    boardCanvas = getElement('simon-board');
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
