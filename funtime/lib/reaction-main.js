/* ============================================================
   reaction-main.js — the glue between the page and Reaction Test
   ============================================================ */

const BEST_KEY = 'reaction-best-time';

let game = null;
let boardCanvas = null;
let ctx = null;
let lastFrameTime = 0;

function getElement(id) { return document.getElementById(id); }

/** loadBest — the fastest press this browser has seen. */
function loadBest() {
    try {
        const saved = window.localStorage.getItem(BEST_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) { return 0; }
}

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('last').textContent = state.lastTime > 0 ? state.lastTime + ' ms' : '—';
    getElement('average').textContent = averageTime(state) > 0 ? averageTime(state) + ' ms' : '—';
    getElement('goes').textContent = state.attempts;

    let best = loadBest();
    const now = bestTime(state);
    if (now > 0 && (best === 0 || now < best)) {
        best = now;
        try { window.localStorage.setItem(BEST_KEY, String(best)); } catch (e) { /* ignore */ }
    }
    getElement('best').textContent = best > 0 ? best + ' ms' : '—';
}

/** updatePauseButton — keep the button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    button.textContent = state.isPaused ? '▶ Play' : '⏸ Pause';
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — clear the scores and start again. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'press') { press(game); }
    else if (action === 'new') { newGame(game); }
    else if (action === 'pause') { togglePause(game); }
    drawEverything(game);
}

/** connectKeyboard — space is the whole game. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
}

/**
 * connectBoard — clicking or tapping the panel counts as a press.
 * ALGORITHM: mousedown rather than click, because a click only happens when
 *            the button comes back up — and in a game measured in
 *            milliseconds, that wait is not fair.
 */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        doAction('press');
    };
    boardCanvas.addEventListener('mousedown', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['btn-press', 'press'], ['pause-btn', 'pause'], ['restart-btn', 'new']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) {
            const action = pair[1];
            element.addEventListener('mousedown', function (event) {
                event.preventDefault();
                doAction(action);
            });
            element.addEventListener('touchstart', function (event) {
                event.preventDefault();
                doAction(action);
            }, { passive: false });
        }
    });
}

/** gameLoop — the heartbeat: the delay and the stopwatch. */
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
    boardCanvas = getElement('reaction-board');
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
