/* ============================================================
   asteroids-main.js — the glue between the page and Asteroids
   ============================================================ */

const BEST_KEY = 'asteroids-best-score';

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
    getElement('lives').textContent = state.lives;
    getElement('wave').textContent = state.wave;

    let best = loadBest();
    if (state.score > best) {
        best = state.score;
        try { window.localStorage.setItem(BEST_KEY, String(best)); } catch (e) { /* ignore */ }
    }
    getElement('best').textContent = best;
}

/** updatePauseButton — keep the button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) { button.textContent = '↺ Play again'; }
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — a fresh ship and a first wave of rocks. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'restart') { startNewGame(); return; }
    if (action === 'pause') {
        if (game.isOver) { startNewGame(); } else { togglePause(game); }
    }
    else if (action === 'left') { game.turning = -1; }
    else if (action === 'right') { game.turning = 1; }
    else if (action === 'thrust') { game.thrusting = true; }
    else if (action === 'fire') { fireBullet(game); }
    drawEverything(game);
}

/**
 * connectKeyboard — turning and thrust are HELD, firing is per press.
 * ALGORITHM: keydown starts turning or thrusting and keyup stops it, so the
 *            ship keeps turning while a key is down. Firing happens once per
 *            press, which is why it is not undone on keyup.
 */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
    document.addEventListener('keyup', function (event) {
        const action = actionForKey(event.key);
        if (action === 'left' && game.turning === -1) { game.turning = 0; }
        else if (action === 'right' && game.turning === 1) { game.turning = 0; }
        else if (action === 'thrust') { game.thrusting = false; }
    });
}

/** connectBoard — tapping space fires. */
function connectBoard() {
    boardCanvas.addEventListener('mousedown', function (event) {
        event.preventDefault();
        doAction('fire');
    });
    boardCanvas.addEventListener('touchstart', function (event) {
        event.preventDefault();
        doAction('fire');
    }, { passive: false });
}

/** holdButton — an on-screen button that acts only while it is held down. */
function holdButton(id, press, release) {
    const element = getElement(id);
    if (!element) { return; }
    const down = function (event) { event.preventDefault(); press(); };
    element.addEventListener('mousedown', down);
    element.addEventListener('touchstart', down, { passive: false });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function (name) {
        element.addEventListener(name, release);
    });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    holdButton('btn-left', function () { game.turning = -1; },
               function () { if (game.turning === -1) { game.turning = 0; } });
    holdButton('btn-right', function () { game.turning = 1; },
               function () { if (game.turning === 1) { game.turning = 0; } });
    holdButton('btn-thrust', function () { game.thrusting = true; },
               function () { game.thrusting = false; });

    [['btn-fire', 'fire'], ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
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

    updateGame(game, elapsed);
    drawEverything(game);
    window.requestAnimationFrame(gameLoop);
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('asteroids-board');
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
