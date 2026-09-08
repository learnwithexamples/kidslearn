/* ============================================================
   test-wordfall.js — Word Rain, played by robots

       node funtime/tests/test-wordfall.js

   The workshop already tests all twelve of this game's functions one at a
   time. What no test of a single function can check is whether the GAME is
   any good: that a beginner gets a fair run, that it really does get harder,
   and — the one that is easy to get wrong — that it eventually beats
   everybody.

   The first version of these rules capped out at level 15. Past that it
   stopped getting harder at all, and a robot typing at 72 WPM was still
   playing ten minutes later. That is the bug this file exists to catch, and
   it is invisible to every test of a single function.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');
const LIB = path.join(__dirname, '..', 'lib');

const sandbox = { Math, console, JSON, RegExp };
sandbox.window = sandbox;
sandbox.document = { getElementById: () => null };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', 'vocabulary-data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(LIB, 'wordlists.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(LIB, 'wordfall-rules.js'), 'utf8'), sandbox);
const W = name => vm.runInContext(name, sandbox);

const createGame = W('createGame'), updateGame = W('updateGame');
const typeLetter = W('typeLetter'), zapWord = W('zapWord'), spawnWord = W('spawnWord');
const wordWidth = W('wordWidth'), speedForLevel = W('speedForLevel'), gapForLevel = W('gapForLevel');
const FIELD_WIDTH = W('FIELD_WIDTH'), GROUND_Y = W('GROUND_Y'), SKY_MARGIN = W('SKY_MARGIN');
const START_LIVES = W('START_LIVES'), MAX_SPEED = W('MAX_SPEED'), MIN_GAP = W('MIN_GAP');
const newGame = W('newGame'), changeLevel = W('changeLevel'), actionForKey = W('actionForKey');
const dropGap = W('dropGap'), wordForLevel = W('wordForLevel'), WORD_POOL = W('WORD_POOL');
const MIN_LEVEL = W('MIN_LEVEL'), MAX_LEVEL = W('MAX_LEVEL');
const Lists = sandbox.window.WordLists;

let failures = 0;
let checks = 0;

function check(name, ok, extra) {
    checks++;
    if (!ok) {
        failures++;
        console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : ''));
    }
}

/**
 * play — a robot that types at a steady speed, always at the lowest word.
 *
 * INPUT:  lettersPerSecond, frameLimit
 * OUTPUT: how the game went, and everything that looked wrong on the way
 */
function play(lettersPerSecond, frameLimit, pool, startLevel) {
    const state = createGame();
    state.pool = pool || null;
    state.startLevel = startLevel || 1;
    newGame(state);
    const STEP = 25;
    let owed = 0;
    let peakWords = 0;
    let seconds = 0;
    let lastLevel = state.level;
    const faults = [];

    for (let frame = 0; frame < frameLimit && !state.isOver; frame++) {
        updateGame(state, STEP);
        seconds += STEP / 1000;
        peakWords = Math.max(peakWords, state.words.length);

        if (state.lives < 0) { faults.push('lives went negative'); }
        if (state.level < lastLevel) { faults.push('the level went DOWN'); }
        lastLevel = state.level;

        for (const word of state.words) {
            if (word.x < 0 || word.x + wordWidth(word.text) > FIELD_WIDTH) {
                faults.push('"' + word.text + '" is off the side at x ' + word.x.toFixed(1));
            }
            if (word.y > GROUND_Y + 60) {
                faults.push('"' + word.text + '" fell through the ground');
            }
        }

        owed += lettersPerSecond * STEP / 1000;
        while (owed >= 1 && !state.isOver) {
            owed -= 1;
            let target = null;
            for (const word of state.words) {
                if (state.typed.length > 0 && word.text.indexOf(state.typed) !== 0) { continue; }
                if (target === null || word.y > target.y) { target = word; }
            }
            if (target === null) { state.typed = ''; break; }

            const next = target.text.charAt(state.typed.length);
            if (!typeLetter(state, next)) {
                faults.push('it refused "' + next + '" of "' + target.text + '"');
                state.typed = '';
                break;
            }
            zapWord(state);
        }
    }
    return { state: state, seconds: seconds, peakWords: peakWords,
             faults: faults, finished: state.isOver };
}

/* ------------------------------------------------ the difficulty curve */

console.log('the difficulty curve');

check('a higher level falls faster', speedForLevel(10) > speedForLevel(1));
check('and the words arrive closer together', gapForLevel(10) < gapForLevel(1));
check('the speed has a ceiling', speedForLevel(9999) === MAX_SPEED, speedForLevel(9999));
check('the gap has a floor', gapForLevel(9999) === MIN_GAP, gapForLevel(9999));

(function () {
    let bad = 0;
    for (let level = 1; level < 400; level++) {
        if (speedForLevel(level + 1) < speedForLevel(level)) { bad++; }
        if (gapForLevel(level + 1) > gapForLevel(level)) { bad++; }
        if (gapForLevel(level) <= 0) { bad++; }
    }
    check('it never gets EASIER as the levels go up', bad === 0, bad);
})();

/* ------------------------------------------------------- playing it */

console.log('playing it, at four typing speeds');

const RUNS = 12;
const results = {};

[[1.5, 18], [2, 24], [3, 36], [5, 60], [8, 96]].forEach(function (pair) {
    const [cps, wpm] = pair;
    let level = 0, seconds = 0, peak = 0, unfinished = 0;
    let faults = null;

    for (let run = 0; run < RUNS; run++) {
        const played = play(cps, 30000);
        level += played.state.level;
        seconds += played.seconds;
        peak = Math.max(peak, played.peakWords);
        if (!played.finished) { unfinished++; }
        if (faults === null && played.faults.length > 0) { faults = played.faults[0]; }
    }
    results[wpm] = { level: level / RUNS, seconds: seconds / RUNS, peak: peak };

    check(wpm + ' WPM: the rules are never broken', faults === null, faults);
    check(wpm + ' WPM: the rain always wins in the end', unfinished === 0,
          unfinished + ' of ' + RUNS + ' games never ended — the game stops getting harder');
    check(wpm + ' WPM: the sky does not get crowded', peak <= 14, peak + ' words at once');
});

/* A beginner must get a real game out of it, and a good typist must get
   further. Without both, the levels are decoration. */
check('a beginner (18 WPM) gets past level 3', results[18].level > 3, results[18].level.toFixed(1));
check('and lasts at least half a minute', results[18].seconds > 30, results[18].seconds.toFixed(0) + 's');
check('24 WPM gets further than 18 WPM', results[24].level > results[18].level,
      results[24].level.toFixed(1) + ' vs ' + results[18].level.toFixed(1));
check('36 WPM gets further than 24 WPM', results[36].level > results[24].level,
      results[36].level.toFixed(1) + ' vs ' + results[24].level.toFixed(1));
check('60 WPM gets further than 36 WPM', results[60].level > results[36].level,
      results[60].level.toFixed(1) + ' vs ' + results[36].level.toFixed(1));
check('96 WPM gets further still', results[96].level > results[60].level,
      results[96].level.toFixed(1) + ' vs ' + results[60].level.toFixed(1));
/* The one that matters. A game that stops getting harder is a game a good
   typist plays until they are bored, and that is not a game. 96 WPM is
   faster than almost anybody, and the rain must still win. */
check('but even 96 WPM does not run away with it', results[96].level < 60,
      'reached level ' + results[96].level.toFixed(1) + ' — has the game stopped getting harder?');

console.log('   18 WPM -> level ' + results[18].level.toFixed(1) + ', ' + results[18].seconds.toFixed(0) + 's');
console.log('   24 WPM -> level ' + results[24].level.toFixed(1) + ', ' + results[24].seconds.toFixed(0) + 's');
console.log('   36 WPM -> level ' + results[36].level.toFixed(1) + ', ' + results[36].seconds.toFixed(0) + 's');
console.log('   60 WPM -> level ' + results[60].level.toFixed(1) + ', ' + results[60].seconds.toFixed(0) + 's');
console.log('   96 WPM -> level ' + results[96].level.toFixed(1) + ', ' + results[96].seconds.toFixed(0) + 's');

/* Somebody who types nothing at all must lose, and lose quickly. */
(function () {
    const idle = play(0, 30000);
    check('doing nothing loses the game', idle.finished === true);
    check('and loses it in under a minute', idle.seconds < 60, idle.seconds.toFixed(0) + 's');
    check('it takes exactly ' + START_LIVES + ' misses', idle.state.missed >= START_LIVES,
          idle.state.missed);
    check('lives end at zero, never below', idle.state.lives === 0, idle.state.lives);
})();

/* ------------------------------------------------- words stay on screen */

console.log('words stay where they can be read');

(function () {
    const state = createGame();
    let off = 0;
    for (let level = 1; level <= 40; level++) {
        state.level = level;
        for (let i = 0; i < 60; i++) {
            state.words = [];
            const word = spawnWord(state);
            if (word.x < 0 || word.x + wordWidth(word.text) > FIELD_WIDTH) { off++; }
            if (word.x < SKY_MARGIN - 0.01) { off++; }
        }
    }
    check('no word is ever dropped off the edge, at any level', off === 0, off);
})();

/* ------------------------------------------ the player's hand on the level */

console.log('driving the level by hand');

check('the up arrow means faster', actionForKey('ArrowUp') === 'faster');
check('the down arrow means slower', actionForKey('ArrowDown') === 'slower');
check('and letters still mean themselves', actionForKey('k') === 'k');

(function () {
    const state = createGame();
    state.level = 5;
    check('up goes up one', changeLevel(state, 1) === 6);
    check('down goes down one', changeLevel(state, -1) === 5);

    for (let i = 0; i < 50; i++) { changeLevel(state, -1); }
    check('it never goes below level ' + MIN_LEVEL, state.level === MIN_LEVEL, state.level);

    for (let i = 0; i < 400; i++) { changeLevel(state, 1); }
    check('and never above level ' + MAX_LEVEL, state.level === MAX_LEVEL, state.level);

    /* winding it up must really make the game harder */
    const easy = createGame(); easy.level = 1;
    const hard = createGame(); hard.level = 1;
    for (let i = 0; i < 9; i++) { changeLevel(hard, 1); }
    check('a higher level really does fall faster',
          speedForLevel(hard.level) > speedForLevel(easy.level));
    check('and really does arrive quicker',
          gapForLevel(hard.level) < gapForLevel(easy.level));
})();

console.log('starting where you asked');

(function () {
    const state = createGame();
    state.startLevel = 9;
    newGame(state);
    check('a new game starts on the level you asked for', state.level === 9, state.level);

    state.startLevel = 0;
    newGame(state);
    check('zero is pulled up to level 1', state.level === MIN_LEVEL, state.level);

    state.startLevel = 5000;
    newGame(state);
    check('a silly number is pulled down', state.level === MAX_LEVEL, state.level);

    state.startLevel = 'nonsense';
    newGame(state);
    check('so is something that is not a number at all', state.level === MIN_LEVEL, state.level);

    /* it must survive a new game, or the setting would be useless */
    state.startLevel = 6;
    newGame(state);
    newGame(state);
    check('and it lasts from one game to the next', state.level === 6, state.level);

    const high = play(3, 30000, null, 12);
    const low = play(3, 30000, null, 1);
    check('starting high makes for a shorter game', high.seconds < low.seconds,
          high.seconds.toFixed(0) + 's vs ' + low.seconds.toFixed(0) + 's');
})();

/* ------------------------------------------------- racing on a word list */

console.log('racing on a Classical Roots lesson');

(function () {
    const books = Lists.books();
    check('the vocabulary is there to choose from', books.length > 0, books.length);

    const book = books[0];
    const pool = Lists.words(book.id, book.lessons.slice(0, 2).map(l => l.number));
    check('a lesson gives some words', pool.length > 4, pool.length);

    const state = createGame();
    state.pool = pool;
    newGame(state);
    for (let frame = 0; frame < 600; frame++) { updateGame(state, 25); }
    check('every word in the sky came from the lesson',
          state.words.every(w => pool.indexOf(w.text) !== -1),
          state.words.filter(w => pool.indexOf(w.text) === -1).map(w => w.text));

    /* a lesson may hold no short words at all — level 1 must still work */
    const longOnly = ['photosynthesis', 'constellation', 'metamorphosis'];
    let picked = true;
    for (let i = 0; i < 60; i++) {
        if (longOnly.indexOf(wordForLevel(1, longOnly)) === -1) { picked = false; }
    }
    check('a list with no short words still works at level 1', picked === true);

    /* the gap has to grow with the words, or a lesson is unplayable */
    const everyday = createGame();
    check('the everyday game is scaled by exactly one',
          dropGap(everyday) === gapForLevel(everyday.level),
          dropGap(everyday) + ' vs ' + gapForLevel(everyday.level));

    const wordy = createGame();
    wordy.pool = longOnly;
    check('a list of long words is given longer', dropGap(wordy) > dropGap(everyday) * 2,
          Math.round(dropGap(wordy)) + ' vs ' + Math.round(dropGap(everyday)));

    /* and the whole thing must still be a game */
    let level = 0, seconds = 0, unfinished = 0, faults = null;
    for (let run = 0; run < 8; run++) {
        const played = play(3, 30000, pool);
        level += played.state.level;
        seconds += played.seconds;
        if (!played.finished) { unfinished++; }
        if (faults === null && played.faults.length > 0) { faults = played.faults[0]; }
    }
    check('a lesson race breaks no rules', faults === null, faults);
    check('a 36 WPM typist gets past level 3 on a lesson', level / 8 > 3, (level / 8).toFixed(1));
    check('and lasts a good while', seconds / 8 > 45, (seconds / 8).toFixed(0) + 's');
    check('and the rain still wins in the end', unfinished === 0, unfinished);
})();

console.log('\n' + checks + ' checks run');
if (failures) {
    console.log(failures + ' PROBLEM(S)');
    process.exit(1);
}
console.log('ALL WORD RAIN TESTS PASSED');
