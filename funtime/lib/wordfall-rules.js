/* ============================================================
   wordfall-rules.js — the rules of Word Rain

   Words drift down out of the sky. Type one before it reaches the ground.
   Miss three and it is over — and the longer you last, the faster they come.

   The interesting problem here is not the falling. It is deciding WHICH word
   you are typing: there are several on screen, you never pick one, and yet
   the game always knows. See matchingWord.
   ============================================================ */

const FIELD_WIDTH = 340;
const FIELD_HEIGHT = 400;

/* where the sky ends and the ground begins */
const GROUND_Y = 336;
const SKY_MARGIN = 8;

/* one letter of the falling words, in pixels */
const LETTER_WIDTH = 11;

const START_LIVES = 3;
const WORDS_PER_LEVEL = 6;

/* How fast words fall, in pixels per second, and how long between one word
   and the next. These six numbers ARE the difficulty, and they were tuned by
   letting a robot play at a fixed typing speed and seeing how far it got:

       18 WPM -> level 6      36 WPM -> level 12
       24 WPM -> level 8      96 WPM -> level 20

   The ceilings matter as much as the steps. Set MAX_SPEED too low and a fast
   typist never loses at all — at 72 px/s the same robot was still playing
   after ten minutes, because the game had stopped getting harder. */
const START_SPEED = 22;
const SPEED_STEP = 4;
const MAX_SPEED = 130;

const START_GAP = 2600;
const GAP_STEP = 140;
const MIN_GAP = 450;

const POINTS_PER_LETTER = 10;

const WORD_POOL = [
    'cat', 'dog', 'sun', 'run', 'big', 'red', 'top', 'cup', 'hat', 'box',
    'egg', 'ice', 'jam', 'key', 'log', 'map', 'net', 'owl', 'pen', 'pig',
    'sky', 'toy', 'van', 'web', 'zip', 'arm', 'bus', 'cow', 'day', 'ear',
    'bird', 'cake', 'door', 'fish', 'gold', 'hand', 'jump', 'king', 'lamp',
    'moon', 'nest', 'open', 'park', 'rain', 'star', 'tree', 'wind', 'boat',
    'corn', 'duck', 'farm', 'gate', 'horn', 'iron', 'lake', 'milk',
    'apple', 'brave', 'cloud', 'dream', 'eagle', 'flame', 'grape', 'house',
    'juice', 'knife', 'lemon', 'mouse', 'night', 'ocean', 'plant', 'queen',
    'river', 'stone', 'tiger', 'water', 'whale', 'zebra', 'bread', 'chair',
    'basket', 'candle', 'dragon', 'engine', 'forest', 'garden', 'hammer',
    'island', 'jungle', 'ladder', 'market', 'orange', 'pencil', 'rocket',
    'silver', 'wizard', 'bridge', 'circle', 'flower', 'guitar',
    'balloon', 'capture', 'diamond', 'evening', 'fortune', 'gallery',
    'harvest', 'journey', 'kitchen', 'machine', 'network', 'package',
    'rainbow', 'thunder', 'village', 'whisper', 'compass', 'lantern'
];

/**
 * speedForLevel — how fast words fall on a given level.
 *
 * INPUT:  level — 1, 2, 3 …
 * OUTPUT: pixels per second
 *
 * ALGORITHM: start at START_SPEED and add SPEED_STEP for every level after
 *            the first — then put a CEILING on it. Without the ceiling level
 *            30 would drop words faster than anybody could read them, and a
 *            game nobody can play is not a hard game, it is a broken one.
 */
function speedForLevel(level) {
    const speed = START_SPEED + (level - 1) * SPEED_STEP;
    return speed > MAX_SPEED ? MAX_SPEED : speed;
}

/**
 * gapForLevel — how long to wait before dropping the next word.
 *
 * INPUT:  level
 * OUTPUT: milliseconds
 *
 * ALGORITHM: the mirror image of speedForLevel. Start at START_GAP and take
 *            GAP_STEP off for every level — then put a FLOOR under it, or the
 *            gap would eventually reach zero and the sky would fill up in a
 *            single frame.
 */
function gapForLevel(level) {
    const gap = START_GAP - (level - 1) * GAP_STEP;
    return gap < MIN_GAP ? MIN_GAP : gap;
}

/**
 * wordWidth — how wide a word is on screen.
 * INPUT: text. OUTPUT: pixels.
 * ALGORITHM: the words are drawn in a MONOSPACE font, where every letter is
 *            exactly as wide as every other. That one fact turns measuring
 *            text — normally a fiddly job — into a multiplication.
 */
function wordWidth(text) {
    return text.length * LETTER_WIDTH;
}

/**
 * wordForLevel — pick a word to drop.
 *
 * INPUT:  level
 * OUTPUT: one word from the pool
 *
 * ALGORITHM: work out the longest word this level is allowed — three letters
 *            at level 1, one more every two levels, never past seven. Then
 *            keep only the words that short and pick one at random.
 */
function wordForLevel(level) {
    let longest = 3 + Math.floor((level - 1) / 2);
    if (longest > 7) { longest = 7; }

    const choices = WORD_POOL.filter(function (word) { return word.length <= longest; });
    return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * makeWord — one word, at the top of the sky.
 * INPUT: text, x. OUTPUT: { text, x, y }.
 */
function makeWord(text, x) {
    return { text: text, x: x, y: 0 };
}

/**
 * spawnWord — drop a new word out of the sky.
 *
 * INPUT:  state
 * OUTPUT: the word that was dropped
 *
 * ALGORITHM: pick a word for the level, then pick somewhere across the sky to
 *            drop it — but only as far right as it can go and still FIT. A
 *            long word dropped at the right-hand edge would hang off the side
 *            of the screen where you could not read it.
 */
function spawnWord(state) {
    const text = wordForLevel(state.level);
    let room = FIELD_WIDTH - wordWidth(text) - SKY_MARGIN * 2;
    if (room < 0) { room = 0; }

    const word = makeWord(text, SKY_MARGIN + Math.random() * room);
    state.words.push(word);
    return word;
}

/**
 * moveWords — everything in the sky comes down.
 * INPUT: state, seconds. OUTPUT: nothing.
 * ALGORITHM: every word falls at this level's speed. Multiplying by the time
 *            gone by is what makes them fall at the same rate on a fast
 *            computer and a slow one.
 */
function moveWords(state, seconds) {
    const speed = speedForLevel(state.level);
    for (let i = 0; i < state.words.length; i++) {
        state.words[i].y = state.words[i].y + speed * seconds;
    }
}

/** hasLanded — has this word reached the ground? */
function hasLanded(word) {
    return word.y >= GROUND_Y;
}

/**
 * removeLandedWords — anything that reached the ground costs you a life.
 *
 * INPUT:  state
 * OUTPUT: how many words landed
 *
 * ALGORITHM: build a NEW list of the words still falling, and count the ones
 *            left out. Taking things out of a list while you are walking along
 *            it is how you skip one by accident; collecting the keepers into a
 *            fresh list simply cannot go wrong.
 */
function removeLandedWords(state) {
    const falling = [];
    let landed = 0;

    for (let i = 0; i < state.words.length; i++) {
        if (hasLanded(state.words[i])) {
            landed = landed + 1;
        } else {
            falling.push(state.words[i]);
        }
    }
    state.words = falling;

    if (landed > 0) {
        state.missed = state.missed + landed;
        state.lives = state.lives - landed;
        if (state.lives <= 0) {
            state.lives = 0;
            state.isOver = true;
        }
    }
    return landed;
}

/**
 * matchingWord — which word are you typing?
 *
 * INPUT:  state, typed — the letters typed so far
 * OUTPUT: the word being typed, or null if none of them match
 *
 * ALGORITHM: of every word that STARTS WITH what you have typed, take the one
 *            furthest down the screen — the one in the most trouble.
 *
 * WHY the game never asks you to choose: you just start typing, and the
 *      letters themselves say which word you meant. Type "ca" and only the
 *      words beginning "ca" are still in the running. It is the same idea as
 *      a search box completing what you type.
 */
function matchingWord(state, typed) {
    if (typed.length === 0) {
        return null;
    }
    let best = null;
    for (let i = 0; i < state.words.length; i++) {
        const word = state.words[i];
        if (word.text.indexOf(typed) === 0) {
            if (best === null || word.y > best.y) {
                best = word;
            }
        }
    }
    return best;
}

/**
 * typeLetter — add one letter, if it still spells something.
 *
 * INPUT:  state, letter
 * OUTPUT: true if the letter was taken
 *
 * ALGORITHM: try the letter first. If no word in the sky begins with the
 *            result, throw it away and count it as a slip — that way a
 *            mistyped letter never leaves you stuck spelling a word that is
 *            not up there.
 */
function typeLetter(state, letter) {
    if (state.isOver || state.isPaused) {
        return false;
    }
    if (String(letter).length !== 1) {
        return false;
    }

    const wanted = state.typed + letter;
    if (matchingWord(state, wanted) === null) {
        state.slips = state.slips + 1;
        return false;
    }

    state.typed = wanted;
    state.keystrokes = state.keystrokes + 1;
    return true;
}

/**
 * zapWord — a finished word disappears in a puff.
 *
 * INPUT:  state
 * OUTPUT: true if a word was cleared
 *
 * ALGORITHM: only the word you have typed IN FULL counts. Keep every word
 *            except that very one — `!==` compares the words themselves, not
 *            what they say, so two identical words never both vanish.
 *            Then score, and step up a level every WORDS_PER_LEVEL.
 */
function zapWord(state) {
    const target = matchingWord(state, state.typed);
    if (target === null || target.text !== state.typed) {
        return false;
    }

    state.words = state.words.filter(function (word) { return word !== target; });
    state.score = state.score + target.text.length * POINTS_PER_LETTER;
    state.cleared = state.cleared + 1;
    state.typed = '';

    if (state.cleared % WORDS_PER_LEVEL === 0) {
        state.level = state.level + 1;
    }
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

/** clearTyped — give up on this word and start again. */
function clearTyped(state) {
    state.typed = '';
}

/** newGame — an empty sky and a fresh three lives. */
function newGame(state) {
    state.words = [];
    state.typed = '';
    state.score = 0;
    state.level = 1;
    state.cleared = 0;
    state.missed = 0;
    state.keystrokes = 0;
    state.slips = 0;
    state.lives = START_LIVES;
    state.sinceDrop = 0;
    state.isOver = false;
    spawnWord(state);
}

/** createGame — start a brand-new game. */
function createGame() {
    const state = { best: 0, isPaused: false };
    newGame(state);
    return state;
}

/**
 * updateGame — one frame of the game.
 * INPUT: state, elapsedMs. OUTPUT: nothing.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }
    const seconds = elapsedMs / 1000;

    state.sinceDrop = state.sinceDrop + elapsedMs;
    if (state.sinceDrop >= gapForLevel(state.level)) {
        state.sinceDrop = 0;
        spawnWord(state);
    }

    moveWords(state, seconds);
    removeLandedWords(state);

    /* the word you were halfway through may have just hit the ground */
    if (state.typed.length > 0 && matchingWord(state, state.typed) === null) {
        state.typed = '';
    }

    if (state.isOver && state.score > state.best) {
        state.best = state.score;
    }
}

/** togglePause — freeze or unfreeze the sky. */
function togglePause(state) {
    if (!state.isOver) { state.isPaused = !state.isPaused; }
}

/**
 * actionForKey — turn a keyboard key into an action, or null.
 * INPUT: key. OUTPUT: 'back', 'clear', 'new', 'pause', a letter, or null.
 */
function actionForKey(key) {
    const k = String(key);

    if (k === ' ' || k.toLowerCase() === 'spacebar') { return 'clear'; }
    if (k.toLowerCase() === 'backspace') { return 'back'; }
    if (k.toLowerCase() === 'enter') { return 'new'; }
    if (k.toLowerCase() === 'escape') { return 'pause'; }

    if (k.length === 1 && k >= 'a' && k <= 'z') { return k; }
    if (k.length === 1 && k >= 'A' && k <= 'Z') { return k.toLowerCase(); }

    return null;
}
