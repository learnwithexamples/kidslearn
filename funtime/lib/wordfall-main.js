/* ============================================================
   wordfall-main.js — the glue between the page and Word Rain
   ============================================================ */

const BEST_KEY = 'wordfall-best-score';

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
    getElement('level').textContent = state.level;
    getElement('lives').textContent = state.lives;

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

/** startNewGame — an empty sky again. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/**
 * doAction — carry out one game action.
 * ALGORITHM: a letter is the interesting one — take it, then see whether it
 *            finished a word. Everything else is a plain command.
 */
function doAction(action) {
    if (action === null) { return; }

    if (action === 'new') { newGame(game); }
    else if (action === 'pause') {
        if (game.isOver) { newGame(game); } else { togglePause(game); }
    }
    else if (action === 'back') { backspace(game); }
    else if (action === 'clear') { clearTyped(game); }
    else {
        typeLetter(game, action);
        zapWord(game);
    }
    drawEverything(game);
}

/** connectKeyboard — typing IS the game, so almost every key matters. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
}

/** connectButtons — the on-screen buttons, and the phone keyboard. */
function connectButtons() {
    [['pause-btn', 'pause'], ['restart-btn', 'new']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });

    /* a phone has no physical keyboard, so open the on-screen one */
    const typeHere = getElement('btn-keyboard');
    const hidden = getElement('hidden-input');
    if (typeHere && hidden) {
        typeHere.addEventListener('click', function (event) {
            event.preventDefault();
            hidden.focus();
        });
    }
    if (hidden) {
        hidden.addEventListener('input', function () {
            const text = hidden.value;
            hidden.value = '';
            for (let i = 0; i < text.length; i++) {
                doAction(actionForKey(text.charAt(i)));
            }
        });
    }
}

/** gameLoop — the heartbeat: the sky comes down. */
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
    boardCanvas = getElement('wordfall-board');
    boardCanvas.width = FIELD_WIDTH;
    boardCanvas.height = FIELD_HEIGHT;
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectKeyboard();
    connectButtons();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
