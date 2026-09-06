/* ============================================================
   flappy-main.js — the glue between the page and Flappy
   ============================================================ */

const BEST_KEY = 'flappy-best-score';

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
    getElement('level').textContent = currentLevel(state);
    getElement('pipes').textContent = state.pipes.length;

    let best = loadBest();
    if (state.score > best) {
        try { window.localStorage.setItem(BEST_KEY, String(state.score)); } catch (e) { /* ignore */ }
        best = state.score;
    }
    getElement('best').textContent = best;
}

/** updatePauseButton — keep the button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) { button.textContent = '↺ Play again'; }
    else if (state.isPaused) { button.textContent = '▶ Start'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — a fresh bird in the middle of the sky. */
function startNewGame() {
    game = createGame();
    game.scrolled = 0;
    drawEverything(game);
}

/**
 * doAction — carry out one game action.
 * ALGORITHM: flapping while the game is waiting starts it — that is what
 *            makes "press space to play" feel like one motion, not two.
 */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'restart') { startNewGame(); return; }
    if (action === 'pause') {
        if (game.isOver) { startNewGame(); } else { togglePause(game); }
    } else if (action === 'flap') {
        if (game.isOver) { startNewGame(); return; }
        if (game.isPaused) { game.isPaused = false; }
        flap(game.bird);
    }
    drawEverything(game);
}

/** connectKeyboard — space, up or W all flap. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
}

/** connectBoard — tapping or clicking the sky flaps too. */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        doAction('flap');
    };
    boardCanvas.addEventListener('mousedown', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['btn-flap', 'flap'], ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** gameLoop — the heartbeat. */
function gameLoop(timestamp) {
    if (lastFrameTime === 0) { lastFrameTime = timestamp; }
    let elapsed = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    if (elapsed > 60) { elapsed = 60; }

    if (!game.isPaused && !game.isOver) {
        game.scrolled = (game.scrolled || 0) + pipeSpeed(currentLevel(game)) * elapsed / 1000;
    }
    updateGame(game, elapsed);
    drawEverything(game);
    window.requestAnimationFrame(gameLoop);
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('flappy-board');
    boardCanvas.width = FIELD_WIDTH;
    boardCanvas.height = FIELD_HEIGHT;
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectKeyboard();
    connectBoard();
    connectButtons();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
