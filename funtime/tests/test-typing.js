/* ============================================================
   test-typing.js — the Typing Race board

       node funtime/tests/test-typing.js

   The words used to be laid out starting from the one you were ON, so every
   press of the space bar shuffled the whole line along and the text you were
   reading from moved under your eyes. Now the whole race is laid out from the
   first word, every frame, and only the COLOURS change.

   That is the property worth guarding: the layout must not depend on how far
   through the race you are. Everything below checks that, and that the words
   still fit in the space kept for them.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LIB = path.join(__dirname, '..', 'lib');

/* A pretend canvas: monospace, so a word's width is just its length. */
const CHAR_WIDTH = 9;

function fakeContext() {
    return {
        fillStyle: '', strokeStyle: '', lineWidth: 0, font: '', textAlign: '',
        drawn: [], lines: [],
        measureText(text) { return { width: String(text).length * CHAR_WIDTH }; },
        fillText(text, x, y) { this.drawn.push({ text: text, x: x, y: y, fill: this.fillStyle }); },
        beginPath() { this._from = null; },
        moveTo(x, y) { this._from = { x: x, y: y }; },
        lineTo(x, y) { this._to = { x: x, y: y }; },
        stroke() {
            if (this._from) {
                this.lines.push({ from: this._from, to: this._to,
                                  color: this.strokeStyle, width: this.lineWidth });
            }
        },
        fillRect() {}, strokeRect() {}, save() {}, restore() {}, scale() {},
        arc() {}, fill() {}, closePath() {}, setLineDash() {}, clearRect() {}
    };
}

const sandbox = { Math, console, JSON };
sandbox.window = sandbox;
vm.createContext(sandbox);
['typing-rules.js', 'typing-draw.js'].forEach(function (file) {
    vm.runInContext(fs.readFileSync(path.join(LIB, file), 'utf8'), sandbox, { filename: file });
});
const T = name => vm.runInContext(name, sandbox);

const createGame = T('createGame'), submitWord = T('submitWord'), newRace = T('newRace');
const layoutWords = T('layoutWords'), drawWords = T('drawWords'), renderGame = T('renderGame');
const pickWords = T('pickWords'), currentWord = T('currentWord');
const WORDS_PER_RACE = T('WORDS_PER_RACE');
const FIELD_WIDTH = T('FIELD_WIDTH'), FIELD_HEIGHT = T('FIELD_HEIGHT');
const WORD_LEFT = T('WORD_LEFT'), WORD_TOP = T('WORD_TOP'), WORD_LINE = T('WORD_LINE');
const COLOR_INK = T('COLOR_INK'), COLOR_DONE = T('COLOR_DONE');

/* Where the big typed word is drawn — the words must not reach it. */
const TYPED_TOP = 190 - 26;

let failures = 0;
let checks = 0;

function check(name, ok, extra) {
    checks++;
    if (!ok) {
        failures++;
        console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : ''));
    }
}

/* -------------------------------------------------- the layout stays still */

console.log('the words stay where they are');

(function () {
    let moved = 0;
    let dropped = 0;
    let tooLow = 0;
    let outsideMargins = 0;
    let mostLines = 0;

    for (let race = 0; race < 3000; race++) {
        const words = pickWords(WORDS_PER_RACE);
        const first = layoutWords(fakeContext(), words);

        if (first.length !== words.length) { dropped++; }

        /* Lay it out again after every space bar. Nothing may move. */
        for (let index = 0; index < words.length; index += 4) {
            const again = layoutWords(fakeContext(), words);
            for (let i = 0; i < first.length; i++) {
                if (again[i].x !== first[i].x || again[i].y !== first[i].y) { moved++; }
            }
        }

        let lines = 1;
        for (let i = 0; i < first.length; i++) {
            const item = first[i];
            if (item.y + 6 > TYPED_TOP) { tooLow++; }
            if (item.x < WORD_LEFT || item.x + item.width > FIELD_WIDTH - WORD_LEFT + 0.01) {
                outsideMargins++;
            }
            lines = Math.max(lines, (item.y - WORD_TOP) / WORD_LINE + 1);
        }
        mostLines = Math.max(mostLines, lines);
    }

    check('every word is laid out, none dropped', dropped === 0, dropped);
    check('no word ever moves as the race goes on', moved === 0, moved);
    check('the words never reach the typing line', tooLow === 0, tooLow);
    check('and never spill past the margins', outsideMargins === 0, outsideMargins);
    check('a race needs ' + mostLines + ' lines at most', mostLines <= 5, mostLines);
})();

/* ------------------------------------------------- what the colours say */

console.log('what the colours say');

(function () {
    const state = createGame();
    state.words = ['alpha', 'bravo', 'charlie', 'delta', 'echo'];
    state.index = 0;
    state.typed = '';
    state.results = [];

    /* right, wrong, right — then stop on 'delta' */
    ['alpha', 'XXXXX', 'charlie'].forEach(function (typed) {
        state.typed = typed;
        submitWord(state);
    });

    check('the results say which words went wrong',
          JSON.stringify(state.results) === '[true,false,true]', state.results);

    const ctx = fakeContext();
    drawWords(ctx, state);

    const shown = {};
    ctx.drawn.forEach(function (d) { shown[d.text] = d.fill; });

    check('every word is still on the board',
          state.words.every(word => shown[word] !== undefined), Object.keys(shown));
    check('the word being typed is black', shown['delta'] === COLOR_INK, shown['delta']);
    check('a word already done is grey', shown['alpha'] === COLOR_DONE, shown['alpha']);
    check('a word still to come is grey too', shown['echo'] === COLOR_DONE, shown['echo']);
    check('the word typed wrongly is grey as well', shown['bravo'] === COLOR_DONE, shown['bravo']);

    /* the rules drawn across words: one under 'delta', one through 'bravo' */
    const laid = layoutWords(fakeContext(), state.words);
    const at = word => laid.find(item => item.word === word);

    const underCurrent = ctx.lines.filter(l =>
        Math.abs(l.from.x - at('delta').x) < 0.01 && l.from.y > at('delta').y && l.color === COLOR_INK);
    check('the word being typed is underlined', underCurrent.length === 1, ctx.lines);

    const throughWrong = ctx.lines.filter(l =>
        Math.abs(l.from.x - at('bravo').x) < 0.01 && l.from.y < at('bravo').y);
    check('the word typed wrongly is crossed out', throughWrong.length === 1, throughWrong);

    const throughRight = ctx.lines.filter(l =>
        Math.abs(l.from.x - at('alpha').x) < 0.01 && l.from.y < at('alpha').y);
    check('a word typed correctly is NOT crossed out', throughRight.length === 0, throughRight);

    const throughFuture = ctx.lines.filter(l =>
        Math.abs(l.from.x - at('echo').x) < 0.01);
    check('a word not reached yet is left plain', throughFuture.length === 0, throughFuture);
})();

/* ------------------------------------------------------- keeping it honest */

console.log('the rest of the race');

(function () {
    const state = createGame();
    check('a fresh race has no results yet', state.results.length === 0, state.results);

    for (let i = 0; i < state.words.length; i++) {
        state.typed = currentWord(state);
        submitWord(state);
    }
    check('one result per word by the end',
          state.results.length === state.words.length, state.results.length);
    check('and all of them right', state.results.every(r => r === true));

    newRace(state);
    check('a new race clears the results', state.results.length === 0, state.results);

    /* pressing space with nothing typed must not record anything */
    state.typed = '';
    submitWord(state);
    check('a refused space records nothing', state.results.length === 0, state.results);
})();

(function () {
    /* the whole board must draw at every stage without complaint */
    const state = createGame();
    let broke = null;
    for (let i = 0; i <= state.words.length && broke === null; i++) {
        try {
            renderGame(fakeContext(), state);
        } catch (error) {
            broke = 'word ' + i + ': ' + error.message;
        }
        state.typed = currentWord(state);
        submitWord(state);
    }
    check('the board draws at every stage of a race', broke === null, broke);
    check('the board is tall enough for five lines of words',
          FIELD_HEIGHT > WORD_TOP + 4 * WORD_LINE + 100, FIELD_HEIGHT);
})();

console.log('\n' + checks + ' checks run');
if (failures) {
    console.log(failures + ' PROBLEM(S)');
    process.exit(1);
}
console.log('ALL TYPING RACE TESTS PASSED');
