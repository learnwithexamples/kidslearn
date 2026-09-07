/* ============================================================
   wordlists.js — the Classical Roots words, ready to type

   The vocabulary section of this site already carries every Classical Roots
   book in data/vocabulary-data.js. This turns that pile into something a
   typing game can use: a list of books, the lessons in each, and a plain list
   of words for whichever lessons you tick.

   Both the JavaScript game and the Python one call in here, so the words are
   chosen the same way in both.

   If the data file is not on the page at all, everything below quietly says
   "nothing", and the game carries on with its own built-in words.
   ============================================================ */

(function () {
    'use strict';

    /**
     * data — the vocabulary, if the page loaded it.
     * OUTPUT: the books object, or null.
     */
    function data() {
        if (typeof vocabularyData === 'undefined' || !vocabularyData) { return null; }
        return vocabularyData.books || null;
    }

    /** available — is there anything to choose from? */
    function available() {
        return data() !== null;
    }

    /**
     * usableWord — is this something you could actually type?
     *
     * ALGORITHM: letters only, once lower-cased. That throws out the dozen
     *            entries like "avant-garde", "Prime Meridian" and "outré" —
     *            a space would submit the word halfway through, and a hyphen
     *            or an accent is not on the keys these games listen for.
     */
    function usableWord(word) {
        return /^[a-z]+$/.test(String(word).toLowerCase());
    }

    /* A label has to fit one line of a narrow column, so it gets cut here. */
    const LABEL_LIMIT = 26;

    function shorten(text) {
        const clean = String(text).replace(/\s+/g, ' ').trim();
        return clean.length > LABEL_LIMIT ? clean.slice(0, LABEL_LIMIT - 1) + '…' : clean;
    }

    /**
     * rootNames — the roots a lesson is built on, tidied up.
     * ALGORITHM: some entries hold several roots in one string, comma
     *            separated and spaced any old how, so split and trim them all.
     */
    function rootNames(lesson) {
        const names = [];
        (lesson.roots || []).forEach(function (root) {
            String(root.root || '').split(',').forEach(function (piece) {
                const clean = piece.trim();
                if (clean !== '') { names.push(clean); }
            });
        });
        return names;
    }

    /**
     * lessonLabel — what to call a lesson in the list.
     *
     * ALGORITHM: its title if it has one. Many lessons have an empty title but
     *            do name their roots — "PORT", "pan, omnis, totus" — which is
     *            a better label than nothing at all. Some name fifteen of
     *            them, though, so the answer is always cut to one line.
     */
    function lessonLabel(lesson) {
        if (lesson.title) { return shorten(lesson.title); }
        const names = rootNames(lesson);
        return names.length > 0 ? shorten(names.join(', ')) : 'Lesson ' + lesson.number;
    }

    /** lessonTitle — the whole label, for hovering over. */
    function lessonTitle(lesson) {
        if (lesson.title) { return lesson.title; }
        const names = rootNames(lesson);
        return names.length > 0 ? names.join(', ') : 'Lesson ' + lesson.number;
    }

    /** lessonWords — every usable word in one lesson, lower-cased. */
    function lessonWords(lesson) {
        const found = [];
        (lesson.roots || []).forEach(function (root) {
            (root.words || []).forEach(function (entry) {
                const word = String(entry.word).toLowerCase();
                if (usableWord(word)) { found.push(word); }
            });
        });
        return found;
    }

    /**
     * books — every book, with its lessons.
     *
     * OUTPUT: [{ id, title, level, lessons: [{ number, label, count }] }]
     *         Lessons with no usable words at all are left out.
     */
    function books() {
        const all = data();
        if (all === null) { return []; }

        const list = [];
        Object.keys(all).forEach(function (id) {
            const book = all[id];
            const lessons = [];

            (book.lessons || []).forEach(function (lesson) {
                const count = lessonWords(lesson).length;
                if (count > 0) {
                    lessons.push({ number: lesson.number, label: lessonLabel(lesson),
                                   full: lessonTitle(lesson), count: count });
                }
            });

            if (lessons.length > 0) {
                list.push({ id: id, title: book.title || id,
                            level: book.level || '', lessons: lessons });
            }
        });
        return list;
    }

    /**
     * words — the words for one book and a set of its lessons.
     *
     * INPUT:  bookId. lessons — an array of lesson numbers, or a string like
     *         "1,3,5" (Python hands it over that way).
     * OUTPUT: a list of words, lower-cased, with no repeats.
     *
     * ALGORITHM: walk the book's lessons in order, keep the ones asked for,
     *            and collect their words. Keeping the order means the same
     *            choice always gives the same list, which is one less thing to
     *            wonder about when a race looks odd.
     */
    function words(bookId, lessons) {
        const all = data();
        if (all === null || !all[bookId]) { return []; }

        const wanted = {};
        const asked = typeof lessons === 'string'
            ? lessons.split(',')
            : (lessons || []);
        for (let i = 0; i < asked.length; i++) {
            const number = Number(String(asked[i]).trim());
            if (!isNaN(number)) { wanted[number] = true; }
        }

        const seen = {};
        const found = [];
        (all[bookId].lessons || []).forEach(function (lesson) {
            if (wanted[lesson.number] !== true) { return; }
            lessonWords(lesson).forEach(function (word) {
                if (seen[word] !== true) {
                    seen[word] = true;
                    found.push(word);
                }
            });
        });
        return found;
    }

    /* ------------------------------------------------------- the picker */

    /* Where the player's choice is remembered between visits. */
    const STORAGE_KEY = 'typing-word-source';

    function loadChoice() {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            const choice = saved ? JSON.parse(saved) : null;
            return (choice && choice.book) ? choice : null;
        } catch (e) { return null; }
    }

    function saveChoice(choice) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
        } catch (e) { /* a private window will not have it; never mind */ }
    }

    function el(id) { return document.getElementById(id); }

    /**
     * connectPicker — wire up the "Which words?" panel.
     *
     * INPUT:  onChoose(words, note) — called with the chosen list, and a line
     *         of words to show. An EMPTY list means "use the game's own".
     * OUTPUT: nothing
     *
     * ALGORITHM: fill the book menu, redraw the lesson tick-boxes whenever the
     *            book changes, and hand the words over when the player says so.
     *            The choice is saved, and put back the next time they come.
     *
     * This lives here rather than in the game's own glue because BOTH the
     * JavaScript game and the Python one need it, and neither should have to
     * write it twice.
     */
    function connectPicker(onChoose) {
        const panel = el('word-source');
        if (!panel) { return; }

        /* No vocabulary file on the page: hide the whole thing rather than
           offering a menu with nothing in it. */
        if (!available()) {
            panel.style.display = 'none';
            return;
        }

        const bookMenu = el('book-choice');
        const lessonList = el('lesson-list');
        const note = el('source-note');
        const all = books();

        function say(text) { if (note) { note.textContent = text; } }

        function tickedLessons() {
            const numbers = [];
            const boxes = lessonList.querySelectorAll('input');
            for (let i = 0; i < boxes.length; i++) {
                if (boxes[i].checked) { numbers.push(Number(boxes[i].value)); }
            }
            return numbers;
        }

        /** showLessons — draw the tick-boxes for one book. */
        function showLessons(bookId, ticked) {
            lessonList.innerHTML = '';
            const book = all.filter(function (b) { return b.id === bookId; })[0];
            if (!book) { return; }

            book.lessons.forEach(function (lesson) {
                const label = document.createElement('label');
                const box = document.createElement('input');
                box.type = 'checkbox';
                box.value = String(lesson.number);
                box.checked = ticked.indexOf(lesson.number) !== -1;

                const text = document.createElement('span');
                text.className = 'name';
                text.textContent = lesson.number + '. ' + lesson.label;
                label.title = lesson.number + '. ' + lesson.full + '  (' + lesson.count + ' words)';
                const count = document.createElement('span');
                count.className = 'count';
                count.textContent = lesson.count;

                label.appendChild(box);
                label.appendChild(text);
                label.appendChild(count);
                lessonList.appendChild(label);
            });
        }

        /** use — hand the current choice to the game. */
        function use(quiet) {
            const bookId = bookMenu.value;
            if (bookId === '') {
                saveChoice({ book: '', lessons: [] });
                onChoose([], 'Everyday words — the game\'s own list.');
                return;
            }

            const lessons = tickedLessons();
            if (lessons.length === 0) {
                say('Tick at least one lesson, then press Use these words.');
                return;
            }

            const chosen = words(bookId, lessons);
            if (chosen.length === 0) {
                say('Those lessons have no words that can be typed.');
                return;
            }

            saveChoice({ book: bookId, lessons: lessons });
            const book = all.filter(function (b) { return b.id === bookId; })[0];
            onChoose(chosen, chosen.length + ' words from ' + book.title + ', lesson' +
                     (lessons.length === 1 ? ' ' : 's ') + lessons.join(', ') + '.');
        }

        /* the menu of books, with the built-in list first */
        const everyday = document.createElement('option');
        everyday.value = '';
        everyday.textContent = 'Everyday words (built in)';
        bookMenu.appendChild(everyday);

        all.forEach(function (book) {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = 'Classical Roots — ' + book.title +
                                 (book.level ? ' (' + book.level + ')' : '');
            bookMenu.appendChild(option);
        });

        bookMenu.addEventListener('change', function () {
            showLessons(bookMenu.value, []);
            say(bookMenu.value === ''
                ? 'Press Use these words to go back to the everyday list.'
                : 'Tick the lessons you want, then press Use these words.');
        });

        el('lessons-all').addEventListener('click', function () {
            const boxes = lessonList.querySelectorAll('input');
            for (let i = 0; i < boxes.length; i++) { boxes[i].checked = true; }
        });
        el('lessons-none').addEventListener('click', function () {
            const boxes = lessonList.querySelectorAll('input');
            for (let i = 0; i < boxes.length; i++) { boxes[i].checked = false; }
        });
        el('lessons-use').addEventListener('click', function () { use(false); });

        /* put back whatever they chose last time */
        const saved = loadChoice();
        if (saved && all.filter(function (b) { return b.id === saved.book; }).length > 0) {
            bookMenu.value = saved.book;
            showLessons(saved.book, saved.lessons || []);
            use(true);
        } else {
            say('Racing on the everyday words. Pick a book above to practise a lesson.');
        }
    }

    window.WordLists = {
        available: available,
        books: books,
        words: words,
        lessonLabel: lessonLabel,
        connectPicker: connectPicker
    };
})();
