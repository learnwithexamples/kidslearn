/* ============================================================
   typing-steps.js - the 5 steps of "Build Typing Race"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const TYPING_STEPS = [
    {
        "id": "matching_letters",
        "fnName": "matchingLetters",
        "title": "How much is right so far?",
        "adds": "Your typing turns black as it matches.",
        "intro": "<p>As you type, the game shows you how much of the word you have got right — and strikes through the moment you go wrong.</p><p>The important detail is that you must stop at the <strong>first</strong> mistake. Type <code>wxter</code> for <code>water</code> and only the <code>w</code> counts, even though four of your five letters are in the right place. Once you have gone wrong, everything after it is wrong too.</p>",
        "spec": {
            "input": "word — the word to type. typed — what has been typed so far.",
            "output": "how many letters from the start match",
            "algorithm": [
                "Start a count at 0.",
                "Walk through what has been typed, one letter at a time.",
                "If you run past the end of the word, or the letters differ, stop and return the count.",
                "Otherwise add one and carry on."
            ]
        },
        "starter": "function matchingLetters(word, typed) {\n    // count from the start, stop at the first difference\n}\n",
        "answer": "function matchingLetters(word, typed) {\n    let count = 0;\n    for (let i = 0; i < typed.length; i++) {\n        if (i >= word.length || word.charAt(i) !== typed.charAt(i)) {\n            return count;\n        }\n        count = count + 1;\n    }\n    return count;\n}\n",
        "hints": [
            "Walk what was TYPED, not the word — the player may not have finished.",
            "return count; the moment two letters differ.",
            "i >= word.length catches typing more letters than the word has."
        ],
        "tests": [
            {
                "name": "Nothing typed matches nothing",
                "code": "assert(matchingLetters('water', '') === 0);"
            },
            {
                "name": "A right start counts",
                "code": "assert(matchingLetters('water', 'wat') === 3, 'gave ' + matchingLetters('water', 'wat'));"
            },
            {
                "name": "The whole word counts",
                "code": "assert(matchingLetters('water', 'water') === 5);"
            },
            {
                "name": "It stops at the first mistake",
                "code": "assert(matchingLetters('water', 'wxt') === 1, 'gave ' + matchingLetters('water', 'wxt') + ' — after a wrong letter, nothing counts');"
            },
            {
                "name": "Letters that happen to match after a mistake do not count",
                "code": "assert(matchingLetters('water', 'wxter') === 1, 'gave ' + matchingLetters('water', 'wxter') + ' — the t, e and r are in the right place, but the word is still wrong');"
            },
            {
                "name": "A wrong first letter counts nothing",
                "code": "assert(matchingLetters('water', 'z') === 0);"
            },
            {
                "name": "Typing past the end of the word is safe",
                "code": "assert(matchingLetters('at', 'atom') === 2, 'gave ' + matchingLetters('at', 'atom'));"
            },
            {
                "name": "It matches what isTypedRight thinks",
                "code": "const state = createGame();\nstate.words = ['water'];\nstate.index = 0;\nstate.typed = 'wat';\nassert(isTypedRight(state) === true);\nstate.typed = 'wxt';\nassert(isTypedRight(state) === false);"
            }
        ],
        "demo": {
            "kind": "match",
            "caption": "Add letters and watch the count. One wrong letter spoils everything after it."
        }
    },
    {
        "id": "submit_word",
        "fnName": "submitWord",
        "title": "Press space",
        "adds": "The race moves along.",
        "intro": "<p>Space means \"I have finished that word\". Right or wrong, the game moves on — this is a <em>race</em>, and stopping to fix things would ruin the rhythm.</p><p>Notice what gets counted when the word is right: the length of the word <strong>plus one</strong>. That extra one is the space you just pressed, and typists have always counted it. Leave it out and everyone's speed comes out about 15% too low.</p><p>One more job: push the answer onto <code>state.results</code>. The counters only say <em>how many</em> went wrong — this list says <em>which</em>, and that is what lets the page draw a line through the words you fluffed.</p>",
        "spec": {
            "input": "state",
            "output": "True if the word was right",
            "algorithm": [
                "Refuse if the game is over, paused, or nothing has been typed.",
                "Compare what was typed with the current word.",
                "If it matches: add one to `correct`, and add the word's length PLUS ONE to `lettersTyped`.",
                "If not: add one to `wrong`.",
                "Either way, remember the answer by pushing it onto `results`.",
                "Move on to the next word and clear what was typed.",
                "If there are no words left, the race is over."
            ]
        },
        "starter": "function submitWord(state) {\n    // right or wrong, move on to the next word\n}\n",
        "answer": "function submitWord(state) {\n    if (state.isOver || state.isPaused || state.typed.length === 0) {\n        return false;\n    }\n    const right = state.typed === currentWord(state);\n\n    if (right) {\n        state.correct = state.correct + 1;\n        state.lettersTyped = state.lettersTyped + currentWord(state).length + 1;\n    } else {\n        state.wrong = state.wrong + 1;\n    }\n    state.results.push(right);\n\n    state.index = state.index + 1;\n    state.typed = '';\n\n    if (state.index >= state.words.length) {\n        state.isOver = true;\n    }\n    return right;\n}\n",
        "hints": [
            "currentWord(state) is written for you.",
            "The + 1 on lettersTyped is the space bar — it counts.",
            "state.results.push(right) records the answer for the page to draw.",
            "Move on and clear the typing whether the word was right or wrong."
        ],
        "tests": [
            {
                "name": "A right word is counted",
                "code": "const state = createGame();\nstate.words = ['water', 'little'];\nstate.index = 0;\nstate.typed = 'water';\nassert(submitWord(state) === true);\nassert(state.correct === 1);"
            },
            {
                "name": "A wrong word is counted too",
                "code": "const state = createGame();\nstate.words = ['water', 'little'];\nstate.index = 0;\nstate.typed = 'wxter';\nassert(submitWord(state) === false);\nassert(state.wrong === 1);"
            },
            {
                "name": "Either way the race moves on",
                "code": "const state = createGame();\nstate.words = ['water', 'little'];\nstate.index = 0;\nstate.typed = 'nonsense';\nsubmitWord(state);\nassert(state.index === 1, 'the race does not stop for a mistake');\nassert(state.typed === '', 'the typing box should be empty for the next word');"
            },
            {
                "name": "The space bar counts as a character",
                "code": "const state = createGame();\nstate.words = ['water'];\nstate.index = 0;\nstate.typed = 'water';\nsubmitWord(state);\nassert(state.lettersTyped === 6, 'gave ' + state.lettersTyped + ' — five letters plus the space');"
            },
            {
                "name": "A wrong word earns no characters",
                "code": "const state = createGame();\nstate.words = ['water'];\nstate.index = 0;\nstate.typed = 'wrong';\nsubmitWord(state);\nassert(state.lettersTyped === 0);"
            },
            {
                "name": "Pressing space with nothing typed does nothing",
                "code": "const state = createGame();\nstate.typed = '';\nconst before = state.index;\nassert(submitWord(state) === false);\nassert(state.index === before);"
            },
            {
                "name": "Finishing the last word ends the race",
                "code": "const state = createGame();\nstate.words = ['water'];\nstate.index = 0;\nstate.typed = 'water';\nsubmitWord(state);\nassert(state.isOver === true);"
            },
            {
                "name": "Which words went wrong is remembered",
                "code": "const state = createGame();\nstate.words = ['water', 'little', 'sound'];\nstate.index = 0;\nstate.typed = 'water';\nsubmitWord(state);\nstate.typed = 'wrong';\nsubmitWord(state);\nstate.typed = 'sound';\nsubmitWord(state);\nassert(state.results.length === 3, 'one entry per word, got ' + state.results.length);\nassert(state.results[0] === true && state.results[1] === false && state.results[2] === true, 'got ' + JSON.stringify(state.results));"
            },
            {
                "name": "A whole race can be typed",
                "code": "const state = createGame();\nfor (let i = 0; i < state.words.length; i++) {\n    state.typed = currentWord(state);\n    submitWord(state);\n}\nassert(state.correct === state.words.length, 'every word should have been right');\nassert(state.isOver === true, 'the race should have finished');\nassert(state.results.length === state.words.length, 'results should have one entry per word');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Type a word and press SPACE. Try getting one wrong on purpose."
        }
    },
    {
        "id": "accuracy",
        "fnName": "accuracy",
        "title": "How accurate were you?",
        "adds": "The scoreboard comes alive.",
        "intro": "<p>A percentage: right words out of all the words attempted.</p><p>The whole difficulty is one line at the top. At the very start of a race nothing has been typed, so right is 0 and wrong is 0 — and <code>0 ÷ 0</code> is not a number. Every language handles that badly in its own way, so you have to say what should happen. Nothing has gone wrong yet, so: 100%.</p>",
        "spec": {
            "input": "state",
            "output": "a percentage from 0 to 100",
            "algorithm": [
                "Add up right and wrong to get the number of words attempted.",
                "If that is 0, return 100 — nothing has gone wrong yet.",
                "Otherwise: right ÷ attempted × 100, rounded."
            ]
        },
        "starter": "function accuracy(state) {\n    // right out of attempted, as a percentage\n}\n",
        "answer": "function accuracy(state) {\n    const done = state.correct + state.wrong;\n    if (done === 0) {\n        return 100;\n    }\n    return Math.round(state.correct / done * 100);\n}\n",
        "hints": [
            "Guard against dividing by zero BEFORE you divide.",
            "Math.round(...) gives a whole percentage.",
            "state.correct / done * 100"
        ],
        "tests": [
            {
                "name": "A fresh race is 100%",
                "code": "const state = createGame();\nassert(accuracy(state) === 100, 'nothing has gone wrong yet — gave ' + accuracy(state));"
            },
            {
                "name": "All right is 100%",
                "code": "const state = createGame();\nstate.correct = 10;\nstate.wrong = 0;\nassert(accuracy(state) === 100);"
            },
            {
                "name": "All wrong is 0%",
                "code": "const state = createGame();\nstate.correct = 0;\nstate.wrong = 10;\nassert(accuracy(state) === 0);"
            },
            {
                "name": "Half and half is 50%",
                "code": "const state = createGame();\nstate.correct = 5;\nstate.wrong = 5;\nassert(accuracy(state) === 50);"
            },
            {
                "name": "Twelve out of fifteen is 80%",
                "code": "const state = createGame();\nstate.correct = 12;\nstate.wrong = 3;\nassert(accuracy(state) === 80, 'gave ' + accuracy(state));"
            },
            {
                "name": "The answer is always a whole number",
                "code": "const state = createGame();\nstate.correct = 1;\nstate.wrong = 2;\nassert(accuracy(state) === Math.round(accuracy(state)), 'gave ' + accuracy(state));"
            },
            {
                "name": "It never goes outside 0 to 100",
                "code": "for (let right = 0; right <= 20; right++) {\n    for (let wrong = 0; wrong <= 20; wrong++) {\n        const state = createGame();\n        state.correct = right;\n        state.wrong = wrong;\n        const percent = accuracy(state);\n        assert(percent >= 0 && percent <= 100, right + '/' + wrong + ' gave ' + percent);\n    }\n}"
            }
        ],
        "demo": {
            "kind": "sums",
            "caption": "Add right and wrong words with the buttons and watch the percentage."
        },
        "warning": "Deal with 0 out of 0 before you divide. In JavaScript it gives NaN and in Python it crashes — neither is what a player wants to see at the start of a race."
    },
    {
        "id": "words_per_minute",
        "fnName": "wordsPerMinute",
        "title": "How fast were you?",
        "adds": "A real typing speed.",
        "intro": "<p>Words per minute — but typists do not count real words. They agreed a hundred years ago that a \"word\" is <strong>five characters</strong>, whatever the actual words were. Otherwise someone typing <em>a a a a</em> would look faster than someone typing <em>elephant</em>.</p><p>So: characters ÷ 5 gives you \"words\", and then scale from however many seconds have gone by up to a whole minute.</p>",
        "spec": {
            "input": "state",
            "output": "words per minute, rounded",
            "algorithm": [
                "If less than a second has gone by, return 0 — the sum would be silly.",
                "Work out the words: lettersTyped ÷ 5.",
                "Scale up to a minute: words ÷ seconds × 60.",
                "Round it."
            ]
        },
        "starter": "function wordsPerMinute(state) {\n    // five characters is one 'word'\n}\n",
        "answer": "function wordsPerMinute(state) {\n    if (state.seconds < 1) {\n        return 0;\n    }\n    const words = state.lettersTyped / 5;\n    return Math.round(words / state.seconds * 60);\n}\n",
        "hints": [
            "Guard the first second BEFORE dividing by state.seconds.",
            "words / seconds gives words per SECOND — multiply by 60 for a minute.",
            "Math.round(words / state.seconds * 60)"
        ],
        "tests": [
            {
                "name": "A race that has not started is 0",
                "code": "const state = createGame();\nassert(wordsPerMinute(state) === 0);"
            },
            {
                "name": "Sixty characters in sixty seconds is 12 WPM",
                "code": "const state = createGame();\nstate.lettersTyped = 60;\nstate.seconds = 60;\nassert(wordsPerMinute(state) === 12, 'gave ' + wordsPerMinute(state) + ' — sixty characters is twelve \"words\"');"
            },
            {
                "name": "Three hundred characters in a minute is 60 WPM",
                "code": "const state = createGame();\nstate.lettersTyped = 300;\nstate.seconds = 60;\nassert(wordsPerMinute(state) === 60);"
            },
            {
                "name": "The same typing in half the time is twice the speed",
                "code": "const slow = createGame();\nslow.lettersTyped = 150;\nslow.seconds = 60;\nconst fast = createGame();\nfast.lettersTyped = 150;\nfast.seconds = 30;\nassert(wordsPerMinute(fast) === wordsPerMinute(slow) * 2);"
            },
            {
                "name": "Half a second of typing gives 0, not a huge number",
                "code": "const state = createGame();\nstate.lettersTyped = 20;\nstate.seconds = 0.4;\nassert(wordsPerMinute(state) === 0, 'gave ' + wordsPerMinute(state) + ' — dividing by almost nothing gives nonsense');"
            },
            {
                "name": "A real race adds up",
                "code": "const state = createGame();\nstate.words = ['water', 'water', 'water', 'water'];\nstate.index = 0;\nfor (let i = 0; i < 4; i++) {\n    state.typed = 'water';\n    submitWord(state);\n}\nstate.seconds = 24;\nassert(wordsPerMinute(state) === 12, 'four words of six characters in 24 seconds — gave ' + wordsPerMinute(state));"
            }
        ],
        "demo": {
            "kind": "sums",
            "caption": "Add words and seconds with the buttons and watch the speed change."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function, and the busiest keyboard in the collection — because in this game typing <em>is</em> the game.</p><p>The space bar is not a letter here: it means \"I have finished that word\". Backspace rubs one out. And every letter is itself.</p>",
        "spec": {
            "input": "key",
            "output": "'space', 'back', 'new', 'pause', a letter, or nothing",
            "algorithm": [
                "Space → 'space'. Backspace → 'back'.",
                "Enter → 'new'. Escape → 'pause'.",
                "Any single letter → that letter, in lower case.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key);\n    // space, backspace, enter, escape, or the letter itself\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key);\n\n    if (k === ' ' || k.toLowerCase() === 'spacebar') { return 'space'; }\n    if (k.toLowerCase() === 'backspace') { return 'back'; }\n    if (k.toLowerCase() === 'enter') { return 'new'; }\n    if (k.toLowerCase() === 'escape') { return 'pause'; }\n\n    if (k.length === 1 && k >= 'a' && k <= 'z') { return k; }\n    if (k.length === 1 && k >= 'A' && k <= 'Z') { return k.toLowerCase(); }\n\n    return null;\n}\n",
        "hints": [
            "The named keys come first — 'Backspace' would otherwise fall through.",
            "The words are all lower case, so guesses come back lower case too.",
            "k >= 'a' && k <= 'z' is a neat way to ask 'is this a letter?'"
        ],
        "tests": [
            {
                "name": "Space submits the word",
                "code": "assert(actionForKey(' ') === 'space');"
            },
            {
                "name": "Backspace rubs one out",
                "code": "assert(actionForKey('Backspace') === 'back');"
            },
            {
                "name": "Enter starts a new race",
                "code": "assert(actionForKey('Enter') === 'new');"
            },
            {
                "name": "A letter comes back as itself",
                "code": "assert(actionForKey('a') === 'a');\nassert(actionForKey('z') === 'z');"
            },
            {
                "name": "Capitals come back in lower case",
                "code": "assert(actionForKey('A') === 'a', 'the words are lower case, so the guesses must be too');"
            },
            {
                "name": "Numbers and arrows do nothing",
                "code": "assert(actionForKey('5') === null);\nassert(actionForKey('ArrowUp') === null);\nassert(actionForKey('Shift') === null);"
            },
            {
                "name": "Every letter of the alphabet works",
                "code": "'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (letter) {\n    assert(actionForKey(letter) === letter, letter + ' did not come back');\n});"
            },
            {
                "name": "What comes back can be typed straight in",
                "code": "const state = createGame();\nstate.words = ['water'];\nstate.index = 0;\nstate.typed = '';\ntypeLetter(state, actionForKey('w'));\nassert(state.typed === 'w');"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page and race. SPACE after each word."
        }
    }
];
