/* ============================================================
   bubbles-main.js — the glue between the page and Bubble Shooter
   ============================================================ */

const BEST_KEY = 'bubbles-best-score';

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
    getElement('popped').textContent = state.popped;
    getElement('shots').textContent = state.shots;

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

/** startNewGame — a fresh ceiling of bubbles. */
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
    else if (action === 'shoot') { shootBubble(game); }
    drawEverything(game);
}

/** connectKeyboard — the arrows aim while held, space shoots. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
    document.addEventListener('keyup', function (event) {
        const action = actionForKey(event.key);
        if ((action === 'left' && game.turning === -1) ||
            (action === 'right' && game.turning === 1)) {
            game.turning = 0;
        }
    });
}

/**
 * connectBoard — aim at where you tap, then tap again to shoot.
 * ALGORITHM: work out the angle from the shooter to the point tapped, keep it
 *            inside the aiming limits, and fire. Aiming and firing in one
 *            gesture is what makes this game work on a phone.
 */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        const y = (point.clientY - box.top) * (boardCanvas.height / box.height);

        let angle = Math.atan2(y - SHOOTER_Y, x - SHOOTER_X);
        if (angle > 0) { angle = angle > Math.PI / 2 ? MIN_ANGLE : MAX_ANGLE; }
        game.angle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, angle));
        shootBubble(game);
        drawEverything(game);
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** holdButton — an on-screen button that aims only while it is held. */
function holdButton(id, direction) {
    const element = getElement(id);
    if (!element) { return; }
    const press = function (event) { event.preventDefault(); game.turning = direction; };
    const release = function () { if (game.turning === direction) { game.turning = 0; } };
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
    [['btn-shoot', 'shoot'], ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** gameLoop — the heartbeat. */
function gameLoop(timestamp) {
    if (lastFrameTime === 0) { lastFrameTime = timestamp; }
    let elapsed = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    if (elapsed > 40) { elapsed = 40; }

    updateGame(game, elapsed);
    drawEverything(game);
    window.requestAnimationFrame(gameLoop);
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('bubbles-board');
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
