/* ============================================================
   typing-rules.js — the rules of Typing Race

   A line of words appears. Type them, space between each one, as fast and as
   accurately as you can.

   This game has no monsters and nothing to dodge. What it has instead is
   ARITHMETIC — working out words-per-minute and accuracy from what actually
   happened is the whole point.
   ============================================================ */

const WORDS_PER_RACE = 24;
const SECONDS_PER_RACE = 60;

const WORD_POOL = [
    'the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they',
    'this', 'have', 'from', 'one', 'had', 'word', 'but', 'not', 'what', 'all',
    'were', 'when', 'your', 'said', 'there', 'use', 'each', 'which', 'she',
    'how', 'their', 'will', 'other', 'about', 'out', 'many', 'then', 'them',
    'these', 'some', 'her', 'would', 'make', 'like', 'him', 'into', 'time',
    'has', 'look', 'two', 'more', 'write', 'see', 'number', 'way', 'could',
    'people', 'than', 'first', 'water', 'been', 'call', 'who', 'now', 'find',
    'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part',
    'over', 'new', 'sound', 'take', 'only', 'little', 'work', 'know', 'place',
    'year', 'live', 'back', 'give', 'most', 'very', 'after', 'thing', 'our',
    'just', 'name', 'good', 'sentence', 'man', 'think', 'say', 'great',
    'where', 'help', 'through', 'much', 'before', 'line', 'right', 'too',
    'mean', 'old', 'any', 'same', 'tell', 'boy', 'follow', 'came', 'want',
    'show', 'also', 'around', 'form', 'three', 'small', 'set', 'put', 'end'
];

/**
 * shuffled — a copy of a list, in a random order.
 * ALGORITHM: walk backwards, swapping each item with a random one at or
 *            before it. Every order is equally likely, and it takes one pass.
 */
function shuffled(list) {
    const bag = list.slice();
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const held = bag[i];
        bag[i] = bag[j];
        bag[j] = held;
    }
    return bag;
}

/**
 * pickWords — a fresh line of words to type.
 *
 * INPUT:  count. pool — the words to choose from, or nothing for the
 *         built-in list.
 * OUTPUT: a list of `count` words.
 *
 * ALGORITHM: shuffle the pool and deal from it, shuffling again whenever it
 *            runs out.
 *
 * WHY not just pick at random each time: a spelling lesson might hold only
 *      eight words, and picking at random would show you one of them five
 *      times and another one never. Dealing from a shuffled bag gives every
 *      word a turn before any word gets a second one.
 */
function pickWords(count, pool) {
    const from = (pool && pool.length > 0) ? pool : WORD_POOL;
    if (from.length === 0) {
        return [];
    }

    const words = [];
    while (words.length < count) {
        const bag = shuffled(from);
        for (let i = 0; i < bag.length && words.length < count; i++) {
            words.push(bag[i]);
        }
    }
    return words;
}

/** currentWord — the word the player is on right now. */
function currentWord(state) {
    return state.words[state.index] || '';
}

/**
 * matchingLetters — how much of the current word has been typed correctly.
 *
 * INPUT:  word — the word to type. typed — what has been typed so far.
 * OUTPUT: how many letters from the start match
 *
 * ALGORITHM: compare letter by letter and stop at the FIRST difference.
 *            Everything after a mistake counts as wrong even if it happens to
 *            match — that is why the loop stops rather than skipping on.
 */
function matchingLetters(word, typed) {
    let count = 0;
    for (let i = 0; i < typed.length; i++) {
        if (i >= word.length || word.charAt(i) !== typed.charAt(i)) {
            return count;
        }
        count = count + 1;
    }
    return count;
}

/** isTypedRight — is what has been typed so far still correct? */
function isTypedRight(state) {
    return matchingLetters(currentWord(state), state.typed) === state.typed.length;
}

/**
 * typeLetter — add one letter to what has been typed.
 * INPUT: state, letter. OUTPUT: true if it was added.
 * ALGORITHM: the race starts the moment the first letter is typed, so nobody
 *            loses time reaching for a start button.
 */
function typeLetter(state, letter) {
    if (state.isOver || state.isPaused) {
        return false;
    }
    if (String(letter).length !== 1) {
        return false;
    }
    state.hasStarted = true;
    state.typed = state.typed + letter;
    state.keystrokes = state.keystrokes + 1;
    return true;
}

/** backspace — rub out the last letter typed. */
function backspace(state) {
    if (state.isOver || state.typed.length === 0) {
        return false;
    }
    state.typed = state.typed.slice(0, state.typed.length - 1);
    return true;
}

/**
 * submitWord — press space and move on.
 *
 * INPUT:  state
 * OUTPUT: true if the word was right
 *
 * ALGORITHM: compare what was typed with the word. Right or wrong, the player
 *            moves on to the next word — this is a race, not a spelling test,
 *            and stopping to correct things would ruin the rhythm. Finishing
 *            the last word ends the race.
 *
 *            The answer is remembered in state.results, one entry per word,
 *            so the page can show at a glance which words went wrong.
 */
function submitWord(state) {
    if (state.isOver || state.isPaused || state.typed.length === 0) {
        return false;
    }
    const right = state.typed === currentWord(state);

    if (right) {
        state.correct = state.correct + 1;
        state.lettersTyped = state.lettersTyped + currentWord(state).length + 1;
    } else {
        state.wrong = state.wrong + 1;
    }
    state.results.push(right);

    state.index = state.index + 1;
    state.typed = '';

    if (state.index >= state.words.length) {
        state.isOver = true;
    }
    return right;
}

/**
 * accuracy — what percentage of the words were right?
 *
 * INPUT:  state
 * OUTPUT: 0 to 100
 *
 * ALGORITHM: right ÷ (right + wrong) × 100. Watch the very first moment of
 *            the game: nothing has been typed, so both are 0 and the division
 *            would be 0 ÷ 0. Give 100 there — nothing has gone wrong yet.
 */
function accuracy(state) {
    const done = state.correct + state.wrong;
    if (done === 0) {
        return 100;
    }
    return Math.round(state.correct / done * 100);
}

/**
 * wordsPerMinute — the classic typing speed.
 *
 * INPUT:  state
 * OUTPUT: words per minute, rounded
 *
 * ALGORITHM: typists have agreed for a hundred years that a "word" is FIVE
 *            characters, whatever the real words were. So: count the
 *            characters typed correctly, divide by 5, and scale up to a
 *            minute. Under a second of typing, give 0 — dividing by nearly
 *            nothing gives a silly answer.
 */
function wordsPerMinute(state) {
    if (state.seconds < 1) {
        return 0;
    }
    const words = state.lettersTyped / 5;
    return Math.round(words / state.seconds * 60);
}

/** timeLeft — how many seconds of the race remain. */
function timeLeft(state) {
    const left = SECONDS_PER_RACE - state.seconds;
    return left < 0 ? 0 : left;
}

/**
 * newRace — a fresh line of words and a clean clock.
 * ALGORITHM: state.pool holds whichever word list the player chose — a
 *            Classical Roots lesson, say. Leave it alone here: choosing words
 *            once and racing on them all afternoon is the whole point.
 */
function newRace(state) {
    state.words = pickWords(WORDS_PER_RACE, state.pool);
    state.index = 0;
    state.typed = '';
    state.correct = 0;
    state.wrong = 0;
    state.results = [];
    state.lettersTyped = 0;
    state.keystrokes = 0;
    state.seconds = 0;
    state.hasStarted = false;
    state.isOver = false;
}

/** createGame — start a brand-new game. */
function createGame() {
    const state = { best: 0, isPaused: false };
    newRace(state);
    return state;
}

/**
 * updateGame — the clock, which only runs once typing has begun.
 * INPUT: state, elapsedMs. OUTPUT: nothing.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused || !state.hasStarted) {
        return;
    }
    state.seconds = state.seconds + elapsedMs / 1000;

    if (state.seconds >= SECONDS_PER_RACE) {
        state.seconds = SECONDS_PER_RACE;
        state.isOver = true;
    }
    if (state.isOver && wordsPerMinute(state) > state.best) {
        state.best = wordsPerMinute(state);
    }
}

/** togglePause — freeze or unfreeze the clock. */
function togglePause(state) {
    if (!state.isOver) { state.isPaused = !state.isPaused; }
}

/**
 * actionForKey — turn a keyboard key into an action, or null.
 * INPUT: key. OUTPUT: 'space', 'back', 'new', 'pause', a letter, or null.
 */
function actionForKey(key) {
    const k = String(key);

    if (k === ' ' || k.toLowerCase() === 'spacebar') { return 'space'; }
    if (k.toLowerCase() === 'backspace') { return 'back'; }
    if (k.toLowerCase() === 'enter') { return 'new'; }
    if (k.toLowerCase() === 'escape') { return 'pause'; }

    if (k.length === 1 && k >= 'a' && k <= 'z') { return k; }
    if (k.length === 1 && k >= 'A' && k <= 'Z') { return k.toLowerCase(); }

    return null;
}
