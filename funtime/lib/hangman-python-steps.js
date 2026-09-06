/* ============================================================
   hangman-python-steps.js - the 5 steps of "Build Hangman in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const HANGMAN_PYTHON_STEPS = [
    {
        "id": "masked_word",
        "fnName": "masked_word",
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
        "starter": "def masked_word(word, guessed):\n    # a letter if it has been guessed, otherwise an underscore\n    pass\n",
        "answer": "def masked_word(word, guessed):\n    return \" \".join(letter if letter in guessed else \"_\" for letter in word)\n",
        "hints": [
            "`for letter in word` walks the word one letter at a time.",
            "`letter in guessed` is True when that letter has been guessed.",
            "\" \".join(...) puts a space between everything."
        ],
        "tests": [
            {
                "name": "Nothing guessed shows all blanks",
                "code": "got = masked_word('CAT', '')\nassert got == '_ _ _', f'gave {got!r}'"
            },
            {
                "name": "A guessed letter shows through",
                "code": "assert masked_word('CAT', 'A') == '_ A _'"
            },
            {
                "name": "The whole word can be revealed",
                "code": "assert masked_word('CAT', 'CAT') == 'C A T'"
            },
            {
                "name": "A letter that appears twice shows both times",
                "code": "assert masked_word('BOOK', 'O') == '_ O O _', 'every O must appear'"
            },
            {
                "name": "Guesses that are not in the word change nothing",
                "code": "assert masked_word('CAT', 'XYZ') == '_ _ _'"
            },
            {
                "name": "Letters are separated by spaces",
                "code": "assert ' ' in masked_word('HI', '')"
            },
            {
                "name": "A long word works too",
                "code": "assert masked_word('ELEPHANT', 'E') == 'E _ E _ _ _ _ _'"
            }
        ],
        "demo": {
            "kind": "mask",
            "caption": "Guess letters and watch the blanks fill in."
        }
    },
    {
        "id": "is_word_complete",
        "fnName": "is_word_complete",
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
        "starter": "def is_word_complete(word, guessed):\n    # is every letter of the word in the guesses?\n    pass\n",
        "answer": "def is_word_complete(word, guessed):\n    return all(letter in guessed for letter in word)\n",
        "hints": [
            "all(...) is True only when every single check is.",
            "`letter in guessed` for each letter of the word.",
            "return all(letter in guessed for letter in word)"
        ],
        "tests": [
            {
                "name": "A fully guessed word is complete",
                "code": "assert is_word_complete('CAT', 'CAT') is True"
            },
            {
                "name": "A half-guessed word is not",
                "code": "assert is_word_complete('CAT', 'CA') is False"
            },
            {
                "name": "Nothing guessed is not complete",
                "code": "assert is_word_complete('CAT', '') is False"
            },
            {
                "name": "The order of the guesses does not matter",
                "code": "assert is_word_complete('CAT', 'TAC') is True"
            },
            {
                "name": "Extra wrong guesses do not stop a win",
                "code": "assert is_word_complete('CAT', 'XYZCAT') is True"
            },
            {
                "name": "A repeated letter only needs guessing once",
                "code": "assert is_word_complete('BOOK', 'BOK') is True"
            },
            {
                "name": "A long word works too",
                "code": "assert is_word_complete('ELEPHANT', 'ELPHANT') is True\nassert is_word_complete('ELEPHANT', 'ELPHAN') is False"
            }
        ],
        "demo": {
            "kind": "mask",
            "caption": "Keep guessing until every blank is filled."
        }
    },
    {
        "id": "wrong_letters",
        "fnName": "wrong_letters",
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
        "starter": "def wrong_letters(state):\n    # the guesses that were not in the word\n    pass\n",
        "answer": "def wrong_letters(state):\n    return \"\".join(letter for letter in state[\"guessed\"] if letter not in state[\"word\"])\n",
        "hints": [
            "Walk state['guessed'], and check each letter against state['word'].",
            "`letter not in state['word']` means it was a mistake.",
            "\"\".join(...) glues the wrong ones back into a string."
        ],
        "tests": [
            {
                "name": "No guesses means no mistakes",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': ''})\nassert wrong_letters(state) == ''"
            },
            {
                "name": "A right guess is not a mistake",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'A'})\nassert wrong_letters(state) == ''"
            },
            {
                "name": "A wrong guess is",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'X'})\nassert wrong_letters(state) == 'X'"
            },
            {
                "name": "Only the wrong ones are collected",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'XAYTZ'})\nassert wrong_letters(state) == 'XYZ'"
            },
            {
                "name": "They stay in the order they were guessed",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'ZXY'})\nassert wrong_letters(state) == 'ZXY'"
            },
            {
                "name": "The lives count follows it",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'XY'})\nassert lives_left(state) == MAX_WRONG - 2"
            },
            {
                "name": "Six mistakes uses every life",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'BDFGHJ'})\nassert wrong_count(state) == 6 and lives_left(state) == 0"
            }
        ],
        "demo": {
            "kind": "wrong",
            "caption": "Every wrong guess crosses off a life and draws another line."
        }
    },
    {
        "id": "guess_letter",
        "fnName": "guess_letter",
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
        "starter": "def guess_letter(state, letter):\n    # refuse the silly ones, then add it and see where we stand\n    pass\n",
        "answer": "def guess_letter(state, letter):\n    if state[\"is_over\"] or state[\"is_paused\"]:\n        return False\n    upper = str(letter).upper()\n\n    if len(upper) != 1 or upper not in LETTERS:\n        return False\n    if upper in state[\"guessed\"]:\n        return False\n\n    state[\"guessed\"] += upper\n\n    status = game_status(state)\n    if status == \"won\":\n        state[\"is_won\"] = True\n        state[\"is_over\"] = True\n        state[\"wins\"] += 1\n    elif status == \"lost\":\n        state[\"is_over\"] = True\n        state[\"losses\"] += 1\n    return True\n",
        "hints": [
            ".upper() first, so 'a' and 'A' are the same guess.",
            "`upper not in LETTERS` catches digits and punctuation.",
            "game_status(state) is written for you - use it rather than checking twice."
        ],
        "tests": [
            {
                "name": "A new letter is accepted",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': ''})\nassert guess_letter(state, 'A') is True\nassert state['guessed'] == 'A'"
            },
            {
                "name": "Small letters work too",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': ''})\nguess_letter(state, 'a')\nassert state['guessed'] == 'A'"
            },
            {
                "name": "The same letter twice is free",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': ''})\nguess_letter(state, 'X')\nassert guess_letter(state, 'X') is False\nassert wrong_count(state) == 1"
            },
            {
                "name": "Numbers and symbols are ignored",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': ''})\nassert guess_letter(state, '5') is False\nassert guess_letter(state, '!') is False\nassert state['guessed'] == ''"
            },
            {
                "name": "Finishing the word wins",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'CA'})\nguess_letter(state, 'T')\nassert state['is_won'] is True and state['is_over'] is True"
            },
            {
                "name": "Six mistakes lose",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'BDFGH'})\nguess_letter(state, 'J')\nassert state['is_over'] is True and state['is_won'] is False"
            },
            {
                "name": "Winning on the very last life still counts as a win",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': 'BDFGHCA'})\nassert lives_left(state) == 1\nguess_letter(state, 'T')\nassert state['is_won'] is True, 'that finished the word - it is a win'"
            },
            {
                "name": "A finished game ignores guesses",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': '', 'is_over': True})\nassert guess_letter(state, 'A') is False"
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
        "fnName": "action_for_key",
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
        "starter": "def action_for_key(key):\n    text = str(key)\n    # enter, escape, or the letter itself\n    return None\n",
        "answer": "def action_for_key(key):\n    text = str(key)\n\n    if text.lower() == \"enter\" or text == \"1\":\n        return \"new\"\n    if text.lower() == \"escape\":\n        return \"pause\"\n\n    upper = text.upper()\n    if len(upper) == 1 and upper in LETTERS:\n        return upper\n    return None\n",
        "hints": [
            "Check the named keys first, before you look at letters.",
            "'Enter' and 'Escape' are the key names the browser gives you.",
            "A letter comes back as itself, in capitals."
        ],
        "tests": [
            {
                "name": "A letter comes back as itself",
                "code": "assert action_for_key('a') == 'A'\nassert action_for_key('Z') == 'Z'"
            },
            {
                "name": "Enter starts a new word",
                "code": "assert action_for_key('Enter') == 'new'"
            },
            {
                "name": "Escape pauses",
                "code": "assert action_for_key('Escape') == 'pause'"
            },
            {
                "name": "Numbers are not letters",
                "code": "assert action_for_key('5') is None"
            },
            {
                "name": "Named keys are not treated as letters",
                "code": "assert action_for_key('ArrowUp') is None\nassert action_for_key('Shift') is None\nassert action_for_key('Tab') is None"
            },
            {
                "name": "Every letter of the alphabet works",
                "code": "for letter in LETTERS:\n    assert action_for_key(letter.lower()) == letter"
            },
            {
                "name": "What comes back can be guessed straight away",
                "code": "state = create_game()\nstate.update({'word': 'CAT', 'guessed': ''})\nguess_letter(state, action_for_key('c'))\nassert state['guessed'] == 'C'"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page and just type. Any letter is a guess."
        }
    }
];
