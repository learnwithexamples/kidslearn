/* ============================================================
   hangman-main.js — the glue between the page and Hangman
   ============================================================ */

let game = null;
let boardCanvas = null;
let ctx = null;

function getElement(id) { return document.getElementById(id); }

/** updateScoreboard — copy the numbers from the game onto the page. */
function updateScoreboard(state) {
    getElement('lives').textContent = livesLeft(state);
    getElement('letters').textContent = state.guessed.length;
    getElement('wins').textContent = state.wins;
    getElement('losses').textContent = state.losses;
}

/** updatePauseButton — keep the button's label honest. */
function updatePauseButton(state) {
    const button = getElement('pause-btn');
    if (!button) { return; }
    if (state.isOver) { button.textContent = '➜ New word'; }
    else if (state.isPaused) { button.textContent = '▶ Play'; }
    else { button.textContent = '⏸ Pause'; }
}

/** drawEverything — draw one frame and refresh the numbers. */
function drawEverything(state) {
    renderGame(ctx, state);
    updateScoreboard(state);
    updatePauseButton(state);
}

/** startNewGame — a fresh word and a clean score. */
function startNewGame() {
    game = createGame();
    drawEverything(game);
}

/** doAction — carry out one game action. */
function doAction(action) {
    if (action === null) { return; }
    if (action === 'new') { newRound(game); }
    else if (action === 'pause') {
        if (game.isOver) { newRound(game); } else { togglePause(game); }
    }
    else { guessLetter(game, action); }
    drawEverything(game);
}

/** connectKeyboard — any letter is a guess. */
function connectKeyboard() {
    document.addEventListener('keydown', function (event) {
        const action = actionForKey(event.key);
        if (action !== null) { event.preventDefault(); }
        doAction(action);
    });
}

/** connectBoard — the alphabet along the bottom can be clicked or tapped. */
function connectBoard() {
    const handle = function (event) {
        event.preventDefault();
        const box = boardCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - box.left) * (boardCanvas.width / box.width);
        const y = (point.clientY - box.top) * (boardCanvas.height / box.height);

        const letter = letterAtPixel(x, y);
        if (letter !== null) {
            doAction(letter);
        } else if (game.isOver) {
            doAction('new');
        }
    };
    boardCanvas.addEventListener('click', handle);
    boardCanvas.addEventListener('touchstart', handle, { passive: false });
}

/** connectButtons — the on-screen buttons. */
function connectButtons() {
    [['pause-btn', 'pause'], ['restart-btn', 'new']].forEach(function (pair) {
        const element = getElement(pair[0]);
        if (element) { element.addEventListener('click', function () { doAction(pair[1]); }); }
    });

    const vowels = getElement('btn-vowels');
    if (vowels) {
        vowels.addEventListener('click', function () {
            /* a friendly shortcut for young players: try all five vowels */
            'AEIOU'.split('').forEach(function (letter) { guessLetter(game, letter); });
            drawEverything(game);
        });
    }
}

/** setUpGame — everything that happens once, when the page loads. */
function setUpGame() {
    boardCanvas = getElement('hangman-board');
    boardCanvas.width = FIELD_WIDTH;
    boardCanvas.height = FIELD_HEIGHT;
    ctx = boardCanvas.getContext('2d');

    startNewGame();
    connectKeyboard();
    connectBoard();
    connectButtons();
}

document.addEventListener('DOMContentLoaded', setUpGame);
