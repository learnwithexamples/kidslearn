/* ============================================================
   wordfall-main.js — the glue between the page and Word Rain
   ============================================================ */

const BEST_KEY = 'wordfall-best-score';
const LEVEL_KEY = 'wordfall-start-level';

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
    else if (action === 'faster') { changeLevel(game, 1); }
    else if (action === 'slower') { changeLevel(game, -1); }
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

/**
 * connectStartLevel — the box that says which level a new game begins on.
 *
 * ALGORITHM: read it whenever it changes, remember it, and hand it to the
 *            game. It only takes effect on the NEXT game, which is why the
 *            arrow keys exist as well.
 */
function connectStartLevel() {
    const box = getElement('start-level');
    if (!box) { return; }

    let saved = 1;
    try { saved = Number(window.localStorage.getItem(LEVEL_KEY)) || 1; } catch (e) { /* ignore */ }
    box.value = String(saved);
    game.startLevel = saved;

    box.addEventListener('change', function () {
        const wanted = Math.floor(Number(box.value));
        const level = (wanted >= 1) ? Math.min(wanted, 99) : 1;
        box.value = String(level);
        game.startLevel = level;
        try { window.localStorage.setItem(LEVEL_KEY, String(level)); } catch (e) { /* ignore */ }
        newGame(game);
        drawEverything(game);
    });
}

/**
 * connectWordSource — let the player race on a Classical Roots lesson.
 *
 * ALGORITHM: the panel itself is shared with the Python version and with
 *            Typing Race, over in wordlists.js. All this has to do is take
 *            the words it hands back and start a fresh game on them.
 */
function connectWordSource() {
    if (!window.WordLists) { return; }

    window.WordLists.connectPicker(function (words, note) {
        game.pool = (words && words.length > 0) ? words : null;
        newGame(game);
        drawEverything(game);
        const line = getElement('source-note');
        if (line) { line.textContent = note; }
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
    connectStartLevel();
    connectWordSource();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
