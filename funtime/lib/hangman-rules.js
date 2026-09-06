/* ============================================================
   hangman-rules.js — the rules of Hangman

   A hidden word, one letter at a time. Six wrong guesses and the drawing is
   finished — and so are you.

   Everything in this game is about STRINGS: hiding letters, revealing them,
   and checking whether anything is left to find.
   ============================================================ */

const MAX_WRONG = 6;

const WORDS = [
    'PYTHON', 'ROCKET', 'PLANET', 'GARDEN', 'BRIDGE', 'CASTLE', 'DRAGON',
    'ISLAND', 'JUNGLE', 'MARKET', 'ORANGE', 'PENCIL', 'RABBIT', 'SILVER',
    'TUNNEL', 'WINDOW', 'YELLOW', 'ANCHOR', 'BASKET', 'CAMERA', 'DOLPHIN',
    'ELEPHANT', 'FEATHER', 'GIRAFFE', 'HAMSTER', 'JOURNEY', 'KITCHEN',
    'LANTERN', 'MONSTER', 'NOTEBOOK', 'OCTOPUS', 'PUMPKIN', 'RAINBOW',
    'SANDWICH', 'TREASURE', 'UMBRELLA', 'VOLCANO', 'WHISTLE', 'BICYCLE',
    'COMPUTER', 'DINOSAUR', 'MOUNTAIN', 'PENGUIN', 'SQUIRREL', 'TELESCOPE',
    'BUTTERFLY', 'CROCODILE', 'ADVENTURE', 'CHOCOLATE', 'HELICOPTER',
    'KANGAROO', 'LIGHTHOUSE', 'MUSHROOM', 'ORCHESTRA', 'PINEAPPLE',
    'SUBMARINE', 'TRAMPOLINE', 'WATERFALL', 'XYLOPHONE', 'ZOOKEEPER'
];

/** LETTERS — the alphabet, in the order the keyboard shows it. */
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * pickWord — choose a word to hide.
 * INPUT: nothing. OUTPUT: one of the words, at random.
 */
function pickWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

/**
 * maskedWord — the word as the player sees it.
 *
 * INPUT:  word — the hidden word. guessed — the letters tried so far.
 * OUTPUT: a string with spaces between, e.g. "_ A _ _ E"
 *
 * ALGORITHM: go through the word one letter at a time. If that letter has been
 *            guessed, show it; if not, show an underscore. Join them with
 *            spaces so a row of underscores can be counted at a glance.
 */
function maskedWord(word, guessed) {
    const shown = [];
    for (let i = 0; i < word.length; i++) {
        if (guessed.indexOf(word.charAt(i)) !== -1) {
            shown.push(word.charAt(i));
        } else {
            shown.push('_');
        }
    }
    return shown.join(' ');
}

/**
 * isWordComplete — has every letter been found?
 *
 * INPUT:  word, guessed
 * OUTPUT: true if nothing is still hidden
 *
 * ALGORITHM: if any letter of the word has NOT been guessed, it is not
 *            finished. Get all the way through and it is.
 */
function isWordComplete(word, guessed) {
    for (let i = 0; i < word.length; i++) {
        if (guessed.indexOf(word.charAt(i)) === -1) {
            return false;
        }
    }
    return true;
}

/**
 * wrongLetters — the letters that were not in the word.
 *
 * INPUT:  state
 * OUTPUT: a string of the wrong guesses, in the order they were made
 *
 * ALGORITHM: keep only the guesses that do not appear in the word.
 */
function wrongLetters(state) {
    let wrong = '';
    for (let i = 0; i < state.guessed.length; i++) {
        const letter = state.guessed.charAt(i);
        if (state.word.indexOf(letter) === -1) {
            wrong = wrong + letter;
        }
    }
    return wrong;
}

/** wrongCount — how many mistakes have been made. */
function wrongCount(state) {
    return wrongLetters(state).length;
}

/** livesLeft — how many wrong guesses are still allowed. */
function livesLeft(state) {
    return MAX_WRONG - wrongCount(state);
}

/**
 * gameStatus — where the game stands.
 *
 * INPUT:  state
 * OUTPUT: 'won', 'lost' or 'playing'
 *
 * ALGORITHM: check for a win FIRST. A player who completes the word on their
 *            very last life has won, not lost — and checking in the other
 *            order would tell them otherwise.
 */
function gameStatus(state) {
    if (isWordComplete(state.word, state.guessed)) {
        return 'won';
    }
    if (wrongCount(state) >= MAX_WRONG) {
        return 'lost';
    }
    return 'playing';
}

/**
 * guessLetter — try a letter.
 *
 * INPUT:  state, letter
 * OUTPUT: true if it counted as a new guess
 *
 * ALGORITHM: ignore anything that is not a letter, and ignore a letter that
 *            has already been tried — guessing 'E' twice must not cost a life.
 *            Otherwise add it to the guesses and see where the game stands.
 */
function guessLetter(state, letter) {
    if (state.isOver || state.isPaused) {
        return false;
    }
    const upper = String(letter).toUpperCase();

    if (LETTERS.indexOf(upper) === -1 || upper.length !== 1) {
        return false;
    }
    if (state.guessed.indexOf(upper) !== -1) {
        return false;
    }

    state.guessed = state.guessed + upper;

    const status = gameStatus(state);
    if (status === 'won') {
        state.isWon = true;
        state.isOver = true;
        state.wins = state.wins + 1;
    } else if (status === 'lost') {
        state.isOver = true;
        state.losses = state.losses + 1;
    }
    return true;
}

/** newRound — hide a new word. */
function newRound(state) {
    state.word = pickWord();
    state.guessed = '';
    state.isWon = false;
    state.isOver = false;
}

/** createGame — start a brand-new game. */
function createGame() {
    const state = { wins: 0, losses: 0, isPaused: false };
    newRound(state);
    return state;
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    if (!state.isOver) { state.isPaused = !state.isPaused; }
}

/** updateGame — Hangman has no clock, so a frame changes nothing. */
function updateGame(state, elapsedMs) {
    return;
}

/**
 * actionForKey — turn a keyboard key into an action, or null.
 *
 * INPUT:  key
 * OUTPUT: 'new', 'pause', a single letter, or null
 *
 * ALGORITHM: this one is different from the other games — any of the twenty-six
 *            letters is an action in itself, so the letter is handed straight
 *            back rather than being turned into a word.
 */
function actionForKey(key) {
    const k = String(key);

    if (k.toLowerCase() === 'enter' || k === '1') { return 'new'; }
    if (k.toLowerCase() === 'escape') { return 'pause'; }

    const upper = k.toUpperCase();
    if (upper.length === 1 && LETTERS.indexOf(upper) !== -1) {
        return upper;
    }
    return null;
}
