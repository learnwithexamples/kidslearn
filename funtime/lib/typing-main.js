/* ============================================================
   typing-main.js — the glue between the page and Typing Race
   ============================================================ */

const BEST_KEY = 'typing-best-wpm';

let game = null;
let boardCanvas = null;
let ctx = null;
let lastFrameTime = 0;

function getElement(id) { return document.getElementById(id); }

/** loadBest — the fastest race this browser has seen. */
function loadBest() {
    try {
        const saved = window.localStorage.getItem(BEST_KEY);
        return saved ? Number(saved) : 0;
    } catch (e) { return 0; }
}

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('wpm').textContent = wordsPerMinute(state);
    getElement('accuracy').textContent = accuracy(state) + '%';
    getElement('words').textContent = state.correct;

    let best = loadBest();
    if (state.isOver && wordsPerMinute(state) > best) {
        best = wordsPerMinute(state);
        try { window.localStorage.setItem(BEST_KEY, String(best)); } catch (e) { /* ignore */ }
    }
    getElement('best').textContent = best;
}

/** updatePauseButton — keep the button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) { button.textContent = '↺ Race again'; }
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — a fresh race. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'new') { newRace(game); }
    else if (action === 'pause') {
        if (game.isOver) { newRace(game); } else { togglePause(game); }
    }
    else if (action === 'space') { submitWord(game); }
    else if (action === 'back') { backspace(game); }
    else { typeLetter(game, action); }
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
 * connectWordSource — let the player race on a Classical Roots lesson.
 *
 * ALGORITHM: the panel itself is shared with the Python version, over in
 *            wordlists.js. All this has to do is take the words it hands
 *            back, hang them on the game, and start a fresh race.
 */
function connectWordSource() {
    if (!window.WordLists) { return; }

    window.WordLists.connectPicker(function (words, note) {
        game.pool = (words && words.length > 0) ? words : null;
        newRace(game);
        drawEverything(game);
        const line = getElement('source-note');
        if (line) { line.textContent = note; }
    });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['pause-btn', 'pause'], ['restart-btn', 'new']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });

    /* a phone has no physical keyboard, so open the on-screen one */
    const typeHere = getElement('btn-keyboard');
    if (typeHere) {
        typeHere.addEventListener('click', function () {
            const hidden = getElement('hidden-input');
            if (hidden) { hidden.focus(); }
        });
    }

    const hidden = getElement('hidden-input');
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
    boardCanvas = getElement('typing-board');
    boardCanvas.width = FIELD_WIDTH;
    boardCanvas.height = FIELD_HEIGHT;
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectKeyboard();
    connectButtons();
    connectWordSource();

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', setUpGame);
