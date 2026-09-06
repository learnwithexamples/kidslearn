/* ============================================================
   memory-main.js — the glue between the page and Memory Match
   ============================================================ */

const BEST_KEY = 'memory-best-moves';

let game = null;
let boardCanvas = null;
let ctx = null;
let lastFrameTime = 0;

/** getElement — find one thing on the page by its id. */
function getElement(id) {
    return document.getElementById(id);
}

/** loadBest — the fewest moves this browser has ever seen (0 means none yet). */
function loadBest() {
    try {
        const saved = window.localStorage.getItem(BEST_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) {
        return 0;
    }
}

/** saveBest — remember a new best. */
function saveBest(moves) {
    try {
        window.localStorage.setItem(BEST_KEY, String(moves));
    } catch (e) { /* never mind */ }
}

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('moves').textContent = state.moves;
    getElement('pairs').textContent = state.pairs + ' / ' + PAIR_COUNT;
    getElement('stars').textContent = '★'.repeat(starsForMoves(state.moves));

    let best = loadBest();
    if (state.isOver && (best === 0 || state.moves < best)) {
        saveBest(state.moves);
        best = state.moves;
    }
    getElement('best').textContent = best === 0 ? '—' : best;
}

/** updatePauseButton — keep the pause button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) {
        button.textContent = '🏆 Done';
    } else if (state.isPaused) {
        button.textContent = '▶ Play';
    } else {
        button.textContent = '⏸ Pause';
    }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — deal a fresh set of cards. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/**
 * doAction — carry out one game action.
 * INPUT: action — an action name. OUTPUT: nothing.
 */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'pause') { togglePause(game); }
    else if (action === 'restart') { startNewGame(); return; }
    else if (action === 'flip') { flipCard(game, cardIndex(game.cursor.column, game.cursor.row)); }
    else if (action === 'left') { moveCursor(game, -1, 0); }
    else if (action === 'right') { moveCursor(game, 1, 0); }
    else if (action === 'up') { moveCursor(game, 0, -1); }
    else if (action === 'down') { moveCursor(game, 0, 1); }
    drawEverything(game);
}

/**
 * canvasPosition — where on the board did the mouse or finger land?
 *
 * INPUT:  event — a click or touch event
 * OUTPUT: { x, y } in canvas pixels
 *
 * ALGORITHM: take the position on the page, subtract where the canvas starts,
 *            then scale it — the canvas may be drawn smaller than it really is
 *            on a narrow screen.
 */
function canvasPosition(event) {
    const box = boardCanvas.getBoundingClientRect();
    const point = event.touches ? event.touches[0] : event;
    return {
        x: (point.clientX - box.left) * (boardCanvas.width / box.width),
        y: (point.clientY - box.top) * (boardCanvas.height / box.height)
    };
}

/** connectBoard — clicking or tapping a card turns it over. */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        const at = canvasPosition(event);
        const index = cardAtPixel(at.x, at.y);
        if (index >= 0) {
            game.cursor.column = index % GRID_COLUMNS;
            game.cursor.row = Math.floor(index / GRID_COLUMNS);
            flipCard(game, index);
            drawEverything(game);
        }
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectKeyboard — arrows move the cursor, space turns a card over. */
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
    const pairs = [['btn-up', 'up'], ['btn-down', 'down'], ['btn-left', 'left'],
                   ['btn-right', 'right'], ['btn-flip', 'flip'],
                   ['pause-btn', 'pause'], ['restart-btn', 'restart']];
    pairs.forEach(function (pair) {
        const element = getElement(pair[0]);
        if (!element) { return; }
        element.addEventListener('click', function () { doAction(pair[1]); });
    });
}

/** gameLoop — the heartbeat; all it does here is count the peek timer down. */
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
    boardCanvas = getElement('memory-board');
    boardCanvas.width = boardPixelWidth();
    boardCanvas.height = boardPixelHeight();
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectBoard();
    connectKeyboard();
    connectButtons();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
