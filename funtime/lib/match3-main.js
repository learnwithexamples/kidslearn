/* ============================================================
   match3-main.js — the glue between the page and Match Three
   ============================================================ */

const BEST_KEY = 'match3-best-score';

let game = null;
let boardCanvas = null;
let ctx = null;

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
    getElement('moves').textContent = state.moves;
    getElement('chain').textContent = state.bestChain;

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
    button.textContent = state.isPaused ? '▶ Play' : '⏸ Pause';
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);

    /* nobody should ever be stuck: deal again if there is no move left */
    if (!state.isPaused && !hasAnyMove(state.board)) {
        shuffleBoard(state);
    }
}

/** startNewGame — a fresh board and a clean score. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'restart') { startNewGame(); return; }
    if (action === 'pause') { togglePause(game); }
    else if (action === 'shuffle') { shuffleBoard(game); }
    else if (action === 'pick') { pickSquare(game, game.cursor); }
    else if (action === 'up') { moveCursor(game, 0, -1); }
    else if (action === 'down') { moveCursor(game, 0, 1); }
    else if (action === 'left') { moveCursor(game, -1, 0); }
    else if (action === 'right') { moveCursor(game, 1, 0); }
    drawEverything(game);
}

/** connectKeyboard — the arrows move, space picks. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
}

/** connectBoard — click one shape then its neighbour to swap them. */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        const y = (point.clientY - box.top) * (boardCanvas.height / box.height);
        const cell = cellAtPixel(x, y);
        if (!cell) { return; }

        game.cursor = cell;
        pickSquare(game, cell);
        drawEverything(game);
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['btn-up', 'up'], ['btn-down', 'down'], ['btn-left', 'left'], ['btn-right', 'right'],
     ['btn-pick', 'pick'], ['btn-shuffle', 'shuffle'],
     ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('match3-board');
    boardCanvas.width = boardPixelSize();
    boardCanvas.height = boardPixelSize();
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectKeyboard();
    connectBoard();
    connectButtons();
}

document.addEventListener('DOMContentLoaded', setUpGame);
