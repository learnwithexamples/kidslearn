/* ============================================================
   mines-main.js — the glue between the page and Minesweeper
   ============================================================ */

const BEST_KEY = 'mines-best-time';

let game = null;
let boardCanvas = null;
let ctx = null;
let lastFrameTime = 0;

function getElement(id) { return document.getElementById(id); }

/** loadBest — the quickest clearance this browser has seen. */
function loadBest() {
    try {
        const saved = window.localStorage.getItem(BEST_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) { return 0; }
}

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('mines').textContent = minesLeft(state);
    getElement('time').textContent = Math.floor(state.seconds);
    getElement('opened').textContent = revealedCount(state);

    let best = loadBest();
    if (state.isWon) {
        const taken = Math.round(state.seconds);
        if (best === 0 || taken < best) {
            try { window.localStorage.setItem(BEST_KEY, String(taken)); } catch (e) { /* ignore */ }
            best = taken;
        }
    }
    getElement('best').textContent = best === 0 ? '—' : best;
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

/** startNewGame — a fresh covered board. */
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
    else if (action === 'dig') { revealCell(game, game.cursor.column, game.cursor.row); }
    else if (action === 'flag') { toggleFlag(game, game.cursor.column, game.cursor.row); }
    else if (action === 'up') { moveCursor(game, 0, -1); }
    else if (action === 'down') { moveCursor(game, 0, 1); }
    else if (action === 'left') { moveCursor(game, -1, 0); }
    else if (action === 'right') { moveCursor(game, 1, 0); }
    drawEverything(game);
}

/**
 * connectBoard — left click digs, right click flags.
 * ALGORITHM: the right-hand button and a long press both mean "flag", so the
 *            game works the same with a mouse and with a finger.
 */
function connectBoard() {
    let pressStarted = 0;

    const cellFromEvent = function (event) {
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        const y = (point.clientY - box.top) * (boardCanvas.height / box.height);
        return cellAtPixel(x, y);
    };

    boardCanvas.addEventListener('click', function (event) {
        const cell = cellFromEvent(event);
        if (!cell) { return; }
        game.cursor = cell;
        revealCell(game, cell.column, cell.row);
        drawEverything(game);
    });

    boardCanvas.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        const cell = cellFromEvent(event);
        if (!cell) { return; }
        game.cursor = cell;
        toggleFlag(game, cell.column, cell.row);
        drawEverything(game);
    });

    boardCanvas.addEventListener('touchstart', function (event) {
        pressStarted = Date.now();
        const cell = cellFromEvent(event);
        if (cell) { game.cursor = cell; drawEverything(game); }
    }, { passive: true });

    boardCanvas.addEventListener('touchend', function (event) {
        event.preventDefault();
        const held = Date.now() - pressStarted;
        if (held > 350) {
            toggleFlag(game, game.cursor.column, game.cursor.row);
        } else {
            revealCell(game, game.cursor.column, game.cursor.row);
        }
        drawEverything(game);
    }, { passive: false });
}

/** connectKeyboard — arrows move, space digs, F flags. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['btn-up', 'up'], ['btn-down', 'down'], ['btn-left', 'left'], ['btn-right', 'right'],
     ['btn-dig', 'dig'], ['btn-flag', 'flag'],
     ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** gameLoop — the heartbeat: only the clock ticks. */
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
    boardCanvas = getElement('mines-board');
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
