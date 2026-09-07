/* ============================================================
   test-wordlists.js — the Classical Roots words, in Typing Race

       node funtime/tests/test-wordlists.js

   Typing Race can now race on a vocabulary lesson instead of its own everyday
   words. The words come from data/vocabulary-data.js, which was written for
   the vocabulary section and never for a typing game — so it holds entries a
   typist cannot deal with: "Prime Meridian" has a space in it, and a space
   SUBMITS the word halfway through. "avant-garde" has a hyphen and "outré" an
   accent, and the game listens for neither.

   So the checks below are not really about lists. They are about whether
   every word this game might show you can actually be typed on it.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');
const LIB = path.join(__dirname, '..', 'lib');

let failures = 0;
let checks = 0;

function check(name, ok, extra) {
    checks++;
    if (!ok) {
        failures++;
        console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : ''));
    }
}

/** load — the word lists and the game rules, in one world. */
function load(withData) {
    const box = { Math, console, JSON, RegExp };
    box.window = box;
    box.document = { getElementById: () => null };
    vm.createContext(box);
    if (withData) {
        vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', 'vocabulary-data.js'), 'utf8'), box);
    }
    vm.runInContext(fs.readFileSync(path.join(LIB, 'wordlists.js'), 'utf8'), box);
    vm.runInContext(fs.readFileSync(path.join(LIB, 'typing-rules.js'), 'utf8'), box);
    return box;
}

const world = load(true);
const Lists = world.window.WordLists;
const T = name => vm.runInContext(name, world);

/* ------------------------------------------------- with no data at all */

console.log('when the vocabulary file is not there');

(function () {
    const bare = load(false);
    const none = bare.window.WordLists;
    check('it says so rather than crashing', none.available() === false);
    check('and offers no books', none.books().length === 0);
    check('and no words', none.words('book-4', [1]).length === 0);

    /* the game must still deal a full race from its own list */
    const state = vm.runInContext('createGame()', bare);
    check('the game still works on its own words',
          state.words.length === vm.runInContext('WORDS_PER_RACE', bare));
})();

/* ---------------------------------------------------- the books on offer */

console.log('the books');

const books = Lists.books();
check('the vocabulary file is found', Lists.available() === true);
check('there are several books', books.length >= 5, books.length);
check('every book has a name and lessons',
      books.every(b => b.id && b.title && b.lessons.length > 0));
check('no lesson is offered with nothing in it',
      books.every(b => b.lessons.every(l => l.count > 0)));

(function () {
    let longest = '';
    books.forEach(b => b.lessons.forEach(l => {
        if (l.label.length > longest.length) { longest = l.label; }
    }));
    /* the tick-boxes are one line each in a narrow column */
    check('lesson labels are short enough for one line', longest.length <= 26,
          longest + ' (' + longest.length + ' characters)');
    check('and none of them is blank',
          books.every(b => b.lessons.every(l => l.label.trim().length > 0)));
})();

/* --------------------------------------------------- choosing the words */

console.log('choosing lessons');

(function () {
    const book = books[0];
    const one = Lists.words(book.id, [book.lessons[0].number]);
    const two = Lists.words(book.id, [book.lessons[0].number, book.lessons[1].number]);

    check('one lesson gives its words', one.length === book.lessons[0].count,
          one.length + ' vs ' + book.lessons[0].count);
    check('two lessons give more than one', two.length > one.length,
          two.length + ' vs ' + one.length);
    check('and include the first lesson\'s words', one.every(w => two.indexOf(w) !== -1));

    check('lesson numbers may be a string, as Python sends them',
          Lists.words(book.id, book.lessons[0].number + ',' + book.lessons[1].number).length === two.length);

    check('an unknown book gives nothing', Lists.words('no-such-book', [1]).length === 0);
    check('no lessons gives nothing', Lists.words(book.id, []).length === 0);
    check('a lesson that does not exist gives nothing',
          Lists.words(book.id, [9999]).length === 0);
    check('the same choice always gives the same list',
          Lists.words(book.id, [1, 2]).join(' ') === Lists.words(book.id, [1, 2]).join(' '));

    const repeated = Lists.words(book.id, book.lessons.map(l => l.number));
    check('a word is never listed twice', new Set(repeated).size === repeated.length,
          repeated.length - new Set(repeated).size + ' repeats');
})();

/* ------------------------------------------- can the game actually type them? */

console.log('every word must be typable');

(function () {
    const actionForKey = T('actionForKey');
    const matchingLetters = T('matchingLetters');

    let everyWord = [];
    books.forEach(function (book) {
        everyWord = everyWord.concat(Lists.words(book.id, book.lessons.map(l => l.number)));
    });
    check('there are plenty of words altogether', everyWord.length > 800, everyWord.length);

    const badShape = everyWord.filter(w => !/^[a-z]+$/.test(w));
    check('no spaces, hyphens, accents or capitals get through', badShape.length === 0,
          badShape.slice(0, 6));

    /* the real test: press the keys and see the word come out */
    const unreachable = everyWord.filter(function (word) {
        for (let i = 0; i < word.length; i++) {
            if (actionForKey(word.charAt(i)) !== word.charAt(i)) { return true; }
        }
        return false;
    });
    check('every letter of every word is a key the game accepts',
          unreachable.length === 0, unreachable.slice(0, 6));

    const mismatched = everyWord.filter(w => matchingLetters(w, w) !== w.length);
    check('and every word matches itself all the way through',
          mismatched.length === 0, mismatched.slice(0, 6));

    /* a space would end the word early, which is exactly the trap */
    check('not one word contains a space',
          everyWord.every(w => w.indexOf(' ') === -1));
})();

/* ----------------------------------------------------- racing on a lesson */

console.log('racing on a lesson');

(function () {
    const createGame = T('createGame'), newRace = T('newRace');
    const typeLetter = T('typeLetter'), submitWord = T('submitWord');
    const currentWord = T('currentWord'), accuracy = T('accuracy');
    const WORDS_PER_RACE = T('WORDS_PER_RACE');

    const book = books[0];
    const pool = Lists.words(book.id, [book.lessons[0].number]);

    const state = createGame();
    state.pool = pool;
    newRace(state);

    check('a race is still a full ' + WORDS_PER_RACE + ' words',
          state.words.length === WORDS_PER_RACE, state.words.length);
    check('and every word came from the lesson',
          state.words.every(w => pool.indexOf(w) !== -1),
          state.words.filter(w => pool.indexOf(w) === -1).slice(0, 4));

    /* type the whole race, one key at a time, exactly as a player would */
    let typedAll = true;
    for (let i = 0; i < WORDS_PER_RACE && !state.isOver; i++) {
        const word = currentWord(state);
        for (let k = 0; k < word.length; k++) {
            if (!typeLetter(state, word.charAt(k))) { typedAll = false; }
        }
        if (!submitWord(state)) { typedAll = false; }
    }
    check('the whole race can be typed', typedAll === true);
    check('with every word right', accuracy(state) === 100, accuracy(state) + '%');
    check('and the race finishes', state.isOver === true);

    /* a short lesson must not show one word five times and another never */
    const small = createGame();
    small.pool = pool.slice(0, 6);
    newRace(small);
    const seen = {};
    small.words.forEach(w => { seen[w] = (seen[w] || 0) + 1; });
    const times = Object.keys(seen).map(w => seen[w]);
    check('a short list deals evenly', Math.max(...times) - Math.min(...times) <= 1,
          JSON.stringify(seen));
    check('and uses every word in it', Object.keys(seen).length === 6, Object.keys(seen).length);

    /* no pool at all falls back to the built-in words */
    const plain = createGame();
    plain.pool = null;
    newRace(plain);
    const WORD_POOL = T('WORD_POOL');
    check('no chosen list falls back to the everyday words',
          plain.words.every(w => WORD_POOL.indexOf(w) !== -1));
})();

console.log('\n' + checks + ' checks run');
if (failures) {
    console.log(failures + ' PROBLEM(S)');
    process.exit(1);
}
console.log('ALL WORD LIST TESTS PASSED');
