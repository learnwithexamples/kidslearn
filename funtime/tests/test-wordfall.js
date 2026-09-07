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

const sandbox = { Math, console, JSON };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'lib', 'wordfall-rules.js'), 'utf8'),
                sandbox);
const W = name => vm.runInContext(name, sandbox);

const createGame = W('createGame'), updateGame = W('updateGame');
const typeLetter = W('typeLetter'), zapWord = W('zapWord'), spawnWord = W('spawnWord');
const wordWidth = W('wordWidth'), speedForLevel = W('speedForLevel'), gapForLevel = W('gapForLevel');
const FIELD_WIDTH = W('FIELD_WIDTH'), GROUND_Y = W('GROUND_Y'), SKY_MARGIN = W('SKY_MARGIN');
const START_LIVES = W('START_LIVES'), MAX_SPEED = W('MAX_SPEED'), MIN_GAP = W('MIN_GAP');

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
function play(lettersPerSecond, frameLimit) {
    const state = createGame();
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

console.log('\n' + checks + ' checks run');
if (failures) {
    console.log(failures + ' PROBLEM(S)');
    process.exit(1);
}
console.log('ALL WORD RAIN TESTS PASSED');
