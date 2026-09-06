/* ============================================================
   twenty48-main.js — the glue between the page and 2048
   ============================================================ */

const BEST_KEY = 'twenty48-best-score';

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
    getElement('biggest').textContent = biggestTile(state.board);
    getElement('moves').textContent = state.moves;

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
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — a fresh board with two tiles. */
function startNewGame() {
    game = createGame();
    game.keepPlaying = false;
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'restart') { startNewGame(); return; }
    if (action === 'pause') {
        if (game.isOver) { startNewGame(); } else { togglePause(game); }
    } else if (action === 'keepgoing') {
        game.keepPlaying = true;
    } else {
        makeMove(game, action);
    }
    drawEverything(game);
}

/** connectKeyboard — the arrow keys slide the board. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const key = String(event.key).toLowerCase();
        if (key === ' ' || key === 'spacebar') {
            event.preventDefault();
            doAction('keepgoing');
            return;
        }
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
}

/**
 * connectSwipe — a finger swipe slides the board.
 * ALGORITHM: remember where the finger went down, and when it comes up see
 *            which way it travelled furthest. Anything under 24 pixels is a
 *            tap, not a swipe, so it is ignored.
 */
function connectSwipe() {
    let startX = 0;
    let startY = 0;

    boardCanvas.addEventListener('touchstart', function (event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }, { passive: true });

    boardCanvas.addEventListener('touchend', function (event) {
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const acrossBy = endX - startX;
        const downBy = endY - startY;

        if (Math.abs(acrossBy) < 24 && Math.abs(downBy) < 24) { return; }
        event.preventDefault();

        if (Math.abs(acrossBy) > Math.abs(downBy)) {
            doAction(acrossBy > 0 ? 'right' : 'left');
        } else {
            doAction(downBy > 0 ? 'down' : 'up');
        }
    }, { passive: false });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['btn-up', 'up'], ['btn-down', 'down'], ['btn-left', 'left'], ['btn-right', 'right'],
     ['pause-btn', 'pause'], ['restart-btn', 'restart']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('twenty48-board');
    boardCanvas.width = boardPixelSize();
    boardCanvas.height = boardPixelSize();
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectKeyboard();
    connectSwipe();
    connectButtons();
}

document.addEventListener('DOMContentLoaded', setUpGame);
