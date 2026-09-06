/* ============================================================
   breakout-main.js — the glue between the page and Breakout
   ============================================================ */

const BEST_KEY = 'breakout-best-score';

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
    getElement('bricks').textContent = bricksLeft(state);

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
    else if (state.isPaused) { button.textContent = '▶ Launch'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — a fresh wall of bricks and three lives. */
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
    } else if (action === 'left') { game.steering = -1; }
    else if (action === 'right') { game.steering = 1; }
    drawEverything(game);
}

/**
 * connectKeyboard — arrows steer while held, space launches.
 * ALGORITHM: keydown starts the steering, keyup stops it — that is what makes
 *            the paddle glide instead of jumping one step per press.
 */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
    document.addEventListener('keyup', function (event) {
        const action = actionForKey(event.key);
        if ((action === 'left' && game.steering === -1) ||
            (action === 'right' && game.steering === 1)) {
            game.steering = 0;
        }
    });
}

/** connectMouse — the paddle follows your finger or mouse across the canvas. */
function connectMouse() {
    const follow = function (event) {
        event.preventDefault();
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        game.paddleX = Math.max(0, Math.min(FIELD_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
    };
    boardCanvas.addEventListener('mousemove', follow);
    boardCanvas.addEventListener('touchmove', follow, { passive: false });
    boardCanvas.addEventListener('click', function () { doAction('pause'); });
}

/** holdButton — an on-screen button that steers only while it is held down. */
function holdButton(id, direction) {
    const element = getElement(id);
    if (!element) { return; }
    const press = function (event) { event.preventDefault(); game.steering = direction; };
    const release = function () { if (game.steering === direction) { game.steering = 0; } };
    element.addEventListener('mousedown', press);
    element.addEventListener('touchstart', press, { passive: false });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function (name) {
        element.addEventListener(name, release);
    });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    holdButton('btn-left', -1);
    holdButton('btn-right', 1);
    [['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
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
    boardCanvas = getElement('breakout-board');
    boardCanvas.width = FIELD_WIDTH;
    boardCanvas.height = FIELD_HEIGHT;
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectKeyboard();
    connectMouse();
    connectButtons();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
