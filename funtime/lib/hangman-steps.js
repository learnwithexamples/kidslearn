/* ============================================================
   hangman-steps.js - the 5 steps of "Build Hangman"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const HANGMAN_STEPS = [
    {
        "id": "masked_word",
        "fnName": "maskedWord",
        "title": "Hide the word",
        "adds": "The blanks appear.",
        "intro": "<p>The first thing the player ever sees: the word with everything they have not guessed replaced by underscores.</p><p>Joining the letters with spaces matters more than it looks — <code>_ _ _ _</code> can be counted at a glance, but <code>____</code> cannot.</p>",
        "spec": {
            "input": "word — the hidden word. guessed — the letters tried so far.",
            "output": "a string like \"_ A _ _ E\"",
            "algorithm": [
                "Go through the word one letter at a time.",
                "If that letter is in `guessed`, show it.",
                "If not, show an underscore.",
                "Join everything with a space between."
            ]
        },
        "starter": "function maskedWord(word, guessed) {\n    // a letter if it has been guessed, otherwise an underscore\n}\n",
        "answer": "function maskedWord(word, guessed) {\n    const shown = [];\n    for (let i = 0; i < word.length; i++) {\n        if (guessed.indexOf(word.charAt(i)) !== -1) {\n            shown.push(word.charAt(i));\n        } else {\n            shown.push('_');\n        }\n    }\n    return shown.join(' ');\n}\n",
        "hints": [
            "word.charAt(i) gives one letter of the word.",
            "guessed.indexOf(letter) !== -1 means 'this letter has been guessed'.",
            "Collect the pieces in a list, then join(' ') them at the end."
        ],
        "tests": [
            {
                "name": "Nothing guessed shows all blanks",
                "code": "assert(maskedWord('CAT', '') === '_ _ _', 'gave \"' + maskedWord('CAT', '') + '\"');"
            },
            {
                "name": "A guessed letter shows through",
                "code": "assert(maskedWord('CAT', 'A') === '_ A _', 'gave \"' + maskedWord('CAT', 'A') + '\"');"
            },
            {
                "name": "The whole word can be revealed",
                "code": "assert(maskedWord('CAT', 'CAT') === 'C A T');"
            },
            {
                "name": "A letter that appears twice shows both times",
                "code": "assert(maskedWord('BOOK', 'O') === '_ O O _', 'gave \"' + maskedWord('BOOK', 'O') + '\" — every O must appear');"
            },
            {
                "name": "Guesses that are not in the word change nothing",
                "code": "assert(maskedWord('CAT', 'XYZ') === '_ _ _');"
            },
            {
                "name": "Letters are separated by spaces",
                "code": "assert(maskedWord('HI', '').indexOf(' ') !== -1, 'a row of underscores has to be countable');"
            },
            {
                "name": "A long word works too",
                "code": "assert(maskedWord('ELEPHANT', 'E') === 'E _ E _ _ _ _ _');"
            }
        ],
        "demo": {
            "kind": "mask",
            "caption": "Guess letters and watch the blanks fill in."
        }
    },
    {
        "id": "is_word_complete",
        "fnName": "isWordComplete",
        "title": "Is it finished?",
        "adds": "The game knows when you have won.",
        "intro": "<p>The word is complete when every one of its letters has been guessed.</p><p>Note what this does <em>not</em> say. It says nothing about wrong guesses, and nothing about the letters you tried that were not in the word. Only: is anything still hidden?</p>",
        "spec": {
            "input": "word, guessed",
            "output": "True if nothing is still hidden",
            "algorithm": [
                "Look at every letter of the word.",
                "If one of them has NOT been guessed, the word is not finished.",
                "If you get all the way through, it is."
            ]
        },
        "starter": "function isWordComplete(word, guessed) {\n    // is every letter of the word in the guesses?\n}\n",
        "answer": "function isWordComplete(word, guessed) {\n    for (let i = 0; i < word.length; i++) {\n        if (guessed.indexOf(word.charAt(i)) === -1) {\n            return false;\n        }\n    }\n    return true;\n}\n",
        "hints": [
            "Look for a letter that is MISSING — one is enough to say no.",
            "return false; as soon as you find one.",
            "return true; goes after the loop."
        ],
        "tests": [
            {
                "name": "A fully guessed word is complete",
                "code": "assert(isWordComplete('CAT', 'CAT') === true);"
            },
            {
                "name": "A half-guessed word is not",
                "code": "assert(isWordComplete('CAT', 'CA') === false);"
            },
            {
                "name": "Nothing guessed is not complete",
                "code": "assert(isWordComplete('CAT', '') === false);"
            },
            {
                "name": "The order of the guesses does not matter",
                "code": "assert(isWordComplete('CAT', 'TAC') === true, 'you can guess the letters in any order');"
            },
            {
                "name": "Extra wrong guesses do not stop a win",
                "code": "assert(isWordComplete('CAT', 'XYZCAT') === true, 'wrong guesses have nothing to do with it');"
            },
            {
                "name": "A repeated letter only needs guessing once",
                "code": "assert(isWordComplete('BOOK', 'BOK') === true, 'guessing O once reveals both of them');"
            },
            {
                "name": "A long word works too",
                "code": "assert(isWordComplete('ELEPHANT', 'ELPHANT') === true);\nassert(isWordComplete('ELEPHANT', 'ELPHAN') === false);"
            }
        ],
        "demo": {
            "kind": "mask",
            "caption": "Keep guessing until every blank is filled."
        }
    },
    {
        "id": "wrong_letters",
        "fnName": "wrongLetters",
        "title": "Count the mistakes",
        "adds": "The drawing starts to appear.",
        "intro": "<p>Every guess that was <em>not</em> in the word costs a life, and draws another line of the picture.</p><p>Working this out from the guesses each time — rather than keeping a separate counter — means the two can never disagree with each other. One source of truth is always worth more than two that need keeping in step.</p>",
        "spec": {
            "input": "state",
            "output": "a string of the wrong guesses, in order",
            "algorithm": [
                "Start with an empty string.",
                "Go through every letter that has been guessed.",
                "If it does NOT appear in the word, add it to the answer."
            ]
        },
        "starter": "function wrongLetters(state) {\n    // the guesses that were not in the word\n}\n",
        "answer": "function wrongLetters(state) {\n    let wrong = '';\n    for (let i = 0; i < state.guessed.length; i++) {\n        const letter = state.guessed.charAt(i);\n        if (state.word.indexOf(letter) === -1) {\n            wrong = wrong + letter;\n        }\n    }\n    return wrong;\n}\n",
        "hints": [
            "Walk state.guessed, and check each letter against state.word.",
            "state.word.indexOf(letter) === -1 means 'not in the word'.",
            "Glue the wrong ones onto a string with +."
        ],
        "tests": [
            {
                "name": "No guesses means no mistakes",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = '';\nassert(wrongLetters(state) === '');"
            },
            {
                "name": "A right guess is not a mistake",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'A';\nassert(wrongLetters(state) === '');"
            },
            {
                "name": "A wrong guess is",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'X';\nassert(wrongLetters(state) === 'X');"
            },
            {
                "name": "Only the wrong ones are collected",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'XAYTZ';\nassert(wrongLetters(state) === 'XYZ', 'gave \"' + wrongLetters(state) + '\"');"
            },
            {
                "name": "They stay in the order they were guessed",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'ZXY';\nassert(wrongLetters(state) === 'ZXY');"
            },
            {
                "name": "The lives count follows it",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'XY';\nassert(livesLeft(state) === MAX_WRONG - 2, 'lives is ' + livesLeft(state));"
            },
            {
                "name": "Six mistakes uses every life",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'BDFGHJ';\nassert(wrongCount(state) === 6);\nassert(livesLeft(state) === 0);"
            }
        ],
        "demo": {
            "kind": "wrong",
            "caption": "Every wrong guess crosses off a life and draws another line."
        }
    },
    {
        "id": "guess_letter",
        "fnName": "guessLetter",
        "title": "Make a guess",
        "adds": "The game works!",
        "intro": "<p>The move itself. Most of it is politely refusing things:</p><ul><li>Not a letter? Ignore it — the number keys must not cost a life.</li><li>Already guessed? Ignore it too. Pressing E twice is a slip, not a mistake.</li></ul><p>Then add the letter and see where the game stands. Notice the order in <code>gameStatus</code>: a win is checked <em>before</em> a loss, so completing the word on your very last life counts as a win.</p>",
        "spec": {
            "input": "state, letter",
            "output": "True if it counted as a new guess",
            "algorithm": [
                "Refuse if the game is over or paused.",
                "Turn the letter into a capital.",
                "Refuse anything that is not a single letter A-Z.",
                "Refuse a letter that has already been guessed.",
                "Add it to the guesses.",
                "Ask game-status. 'won' means won and over; 'lost' means over."
            ]
        },
        "starter": "function guessLetter(state, letter) {\n    // refuse the silly ones, then add it and see where we stand\n}\n",
        "answer": "function guessLetter(state, letter) {\n    if (state.isOver || state.isPaused) {\n        return false;\n    }\n    const upper = String(letter).toUpperCase();\n\n    if (LETTERS.indexOf(upper) === -1 || upper.length !== 1) {\n        return false;\n    }\n    if (state.guessed.indexOf(upper) !== -1) {\n        return false;\n    }\n\n    state.guessed = state.guessed + upper;\n\n    const status = gameStatus(state);\n    if (status === 'won') {\n        state.isWon = true;\n        state.isOver = true;\n        state.wins = state.wins + 1;\n    } else if (status === 'lost') {\n        state.isOver = true;\n        state.losses = state.losses + 1;\n    }\n    return true;\n}\n",
        "hints": [
            "toUpperCase() first, so 'a' and 'A' are the same guess.",
            "LETTERS.indexOf(upper) === -1 catches digits and punctuation.",
            "gameStatus(state) is written for you — use it rather than checking twice."
        ],
        "tests": [
            {
                "name": "A new letter is accepted",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = '';\nassert(guessLetter(state, 'A') === true);\nassert(state.guessed === 'A');"
            },
            {
                "name": "Small letters work too",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = '';\nguessLetter(state, 'a');\nassert(state.guessed === 'A', 'guesses are stored as capitals');"
            },
            {
                "name": "The same letter twice is free",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = '';\nguessLetter(state, 'X');\nassert(guessLetter(state, 'X') === false, 'a slip must not cost a second life');\nassert(wrongCount(state) === 1, 'lives lost: ' + wrongCount(state));"
            },
            {
                "name": "Numbers and symbols are ignored",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = '';\nassert(guessLetter(state, '5') === false);\nassert(guessLetter(state, '!') === false);\nassert(state.guessed === '');"
            },
            {
                "name": "Finishing the word wins",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'CA';\nguessLetter(state, 'T');\nassert(state.isWon === true && state.isOver === true);"
            },
            {
                "name": "Six mistakes lose",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'BDFGH';\nguessLetter(state, 'J');\nassert(state.isOver === true);\nassert(state.isWon === false);"
            },
            {
                "name": "Winning on the very last life still counts as a win",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = 'BDFGHCA';\nassert(livesLeft(state) === 1, 'lives is ' + livesLeft(state));\nguessLetter(state, 'T');\nassert(state.isWon === true, 'that finished the word — it is a win, not a loss');"
            },
            {
                "name": "A finished game ignores guesses",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = '';\nstate.isOver = true;\nassert(guessLetter(state, 'A') === false);"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play properly. Try the vowels first — it is usually a good opening."
        },
        "warning": "Check for a WIN before a LOSS. Do it the other way round and a player who finishes the word on their last life is told they lost."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function, and it works differently from every other game in this collection.</p><p>Everywhere else a key turns into a <em>word</em> like 'left' or 'fire'. Here, twenty-six of the keys are actions in their own right — so the letter itself is handed straight back.</p>",
        "spec": {
            "input": "key",
            "output": "'new', 'pause', a single capital letter, or nothing",
            "algorithm": [
                "Enter (or the 1 key) → 'new'.",
                "Escape → 'pause'.",
                "Any single letter → that letter, as a capital.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key);\n    // enter, escape, or the letter itself\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key);\n\n    if (k.toLowerCase() === 'enter' || k === '1') { return 'new'; }\n    if (k.toLowerCase() === 'escape') { return 'pause'; }\n\n    const upper = k.toUpperCase();\n    if (upper.length === 1 && LETTERS.indexOf(upper) !== -1) {\n        return upper;\n    }\n    return null;\n}\n",
        "hints": [
            "Check the named keys first, before you look at letters.",
            "'Enter' and 'Escape' are the key names the browser gives you.",
            "A letter comes back as itself, in capitals."
        ],
        "tests": [
            {
                "name": "A letter comes back as itself",
                "code": "assert(actionForKey('a') === 'A');\nassert(actionForKey('Z') === 'Z');"
            },
            {
                "name": "Enter starts a new word",
                "code": "assert(actionForKey('Enter') === 'new');"
            },
            {
                "name": "Escape pauses",
                "code": "assert(actionForKey('Escape') === 'pause');"
            },
            {
                "name": "Numbers are not letters",
                "code": "assert(actionForKey('5') === null, 'gave ' + actionForKey('5'));"
            },
            {
                "name": "Named keys are not treated as letters",
                "code": "assert(actionForKey('ArrowUp') === null, 'ArrowUp is not a letter — gave ' + actionForKey('ArrowUp'));\nassert(actionForKey('Shift') === null);\nassert(actionForKey('Tab') === null);"
            },
            {
                "name": "Every letter of the alphabet works",
                "code": "for (let i = 0; i < LETTERS.length; i++) {\n    const letter = LETTERS.charAt(i);\n    assert(actionForKey(letter.toLowerCase()) === letter, letter + ' did not come back');\n}"
            },
            {
                "name": "What comes back can be guessed straight away",
                "code": "const state = createGame();\nstate.word = 'CAT';\nstate.guessed = '';\nguessLetter(state, actionForKey('c'));\nassert(state.guessed === 'C');"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page and just type. Any letter is a guess."
        }
    }
];
