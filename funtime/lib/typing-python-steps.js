/* ============================================================
   typing-python-steps.js - the 5 steps of "Build Typing Race in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const TYPING_PYTHON_STEPS = [
    {
        "id": "matching_letters",
        "fnName": "matching_letters",
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
        "starter": "def matching_letters(word, typed):\n    # count from the start, stop at the first difference\n    pass\n",
        "answer": "def matching_letters(word, typed):\n    count = 0\n    for i, letter in enumerate(typed):\n        if i >= len(word) or word[i] != letter:\n            return count\n        count += 1\n    return count\n",
        "hints": [
            "Walk what was TYPED, not the word - the player may not have finished.",
            "return count the moment two letters differ.",
            "i >= len(word) catches typing more letters than the word has."
        ],
        "tests": [
            {
                "name": "Nothing typed matches nothing",
                "code": "assert matching_letters('water', '') == 0"
            },
            {
                "name": "A right start counts",
                "code": "assert matching_letters('water', 'wat') == 3"
            },
            {
                "name": "The whole word counts",
                "code": "assert matching_letters('water', 'water') == 5"
            },
            {
                "name": "It stops at the first mistake",
                "code": "got = matching_letters('water', 'wxt')\nassert got == 1, f'gave {got}'"
            },
            {
                "name": "Letters that happen to match after a mistake do not count",
                "code": "got = matching_letters('water', 'wxter')\nassert got == 1, f'gave {got}'"
            },
            {
                "name": "A wrong first letter counts nothing",
                "code": "assert matching_letters('water', 'z') == 0"
            },
            {
                "name": "Typing past the end of the word is safe",
                "code": "assert matching_letters('at', 'atom') == 2"
            },
            {
                "name": "It matches what is_typed_right thinks",
                "code": "state = create_game()\nstate.update({'words': ['water'], 'index': 0, 'typed': 'wat'})\nassert is_typed_right(state) is True\nstate['typed'] = 'wxt'\nassert is_typed_right(state) is False"
            }
        ],
        "demo": {
            "kind": "match",
            "caption": "Add letters and watch the count. One wrong letter spoils everything after it."
        }
    },
    {
        "id": "submit_word",
        "fnName": "submit_word",
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
        "starter": "def submit_word(state):\n    # right or wrong, move on to the next word\n    pass\n",
        "answer": "def submit_word(state):\n    if state[\"is_over\"] or state[\"is_paused\"] or not state[\"typed\"]:\n        return False\n    right = state[\"typed\"] == current_word(state)\n\n    if right:\n        state[\"correct\"] += 1\n        state[\"letters_typed\"] += len(current_word(state)) + 1\n    else:\n        state[\"wrong\"] += 1\n    state[\"results\"].append(right)\n\n    state[\"index\"] += 1\n    state[\"typed\"] = \"\"\n\n    if state[\"index\"] >= len(state[\"words\"]):\n        state[\"is_over\"] = True\n    return right\n",
        "hints": [
            "current_word(state) is written for you.",
            "The + 1 on letters_typed is the space bar - it counts.",
            "state['results'].append(right) records the answer for the page to draw.",
            "Move on and clear the typing whether the word was right or wrong."
        ],
        "tests": [
            {
                "name": "A right word is counted",
                "code": "state = create_game()\nstate.update({'words': ['water', 'little'], 'index': 0, 'typed': 'water'})\nassert submit_word(state) is True\nassert state['correct'] == 1"
            },
            {
                "name": "A wrong word is counted too",
                "code": "state = create_game()\nstate.update({'words': ['water', 'little'], 'index': 0, 'typed': 'wxter'})\nassert submit_word(state) is False\nassert state['wrong'] == 1"
            },
            {
                "name": "Either way the race moves on",
                "code": "state = create_game()\nstate.update({'words': ['water', 'little'], 'index': 0, 'typed': 'nonsense'})\nsubmit_word(state)\nassert state['index'] == 1 and state['typed'] == ''"
            },
            {
                "name": "The space bar counts as a character",
                "code": "state = create_game()\nstate.update({'words': ['water'], 'index': 0, 'typed': 'water'})\nsubmit_word(state)\nassert state['letters_typed'] == 6, 'five letters plus the space'"
            },
            {
                "name": "A wrong word earns no characters",
                "code": "state = create_game()\nstate.update({'words': ['water'], 'index': 0, 'typed': 'wrong'})\nsubmit_word(state)\nassert state['letters_typed'] == 0"
            },
            {
                "name": "Pressing space with nothing typed does nothing",
                "code": "state = create_game()\nstate['typed'] = ''\nbefore = state['index']\nassert submit_word(state) is False\nassert state['index'] == before"
            },
            {
                "name": "Finishing the last word ends the race",
                "code": "state = create_game()\nstate.update({'words': ['water'], 'index': 0, 'typed': 'water'})\nsubmit_word(state)\nassert state['is_over'] is True"
            },
            {
                "name": "Which words went wrong is remembered",
                "code": "state = create_game()\nstate.update({'words': ['water', 'little', 'sound'], 'index': 0})\nfor typed in ('water', 'wrong', 'sound'):\n    state['typed'] = typed\n    submit_word(state)\nassert state['results'] == [True, False, True], f\"got {state['results']}\""
            },
            {
                "name": "A whole race can be typed",
                "code": "state = create_game()\nfor _ in range(len(state['words'])):\n    state['typed'] = current_word(state)\n    submit_word(state)\nassert state['correct'] == len(state['words'])\nassert state['is_over'] is True\nassert len(state['results']) == len(state['words'])"
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
        "starter": "def accuracy(state):\n    # right out of attempted, as a percentage\n    pass\n",
        "answer": "def accuracy(state):\n    done = state[\"correct\"] + state[\"wrong\"]\n    if done == 0:\n        return 100\n    return round(state[\"correct\"] / done * 100)\n",
        "hints": [
            "Guard against dividing by zero BEFORE you divide.",
            "round(...) gives a whole percentage.",
            "state['correct'] / done * 100"
        ],
        "tests": [
            {
                "name": "A fresh race is 100%",
                "code": "assert accuracy(create_game()) == 100"
            },
            {
                "name": "All right is 100%",
                "code": "state = create_game()\nstate.update({'correct': 10, 'wrong': 0})\nassert accuracy(state) == 100"
            },
            {
                "name": "All wrong is 0%",
                "code": "state = create_game()\nstate.update({'correct': 0, 'wrong': 10})\nassert accuracy(state) == 0"
            },
            {
                "name": "Half and half is 50%",
                "code": "state = create_game()\nstate.update({'correct': 5, 'wrong': 5})\nassert accuracy(state) == 50"
            },
            {
                "name": "Twelve out of fifteen is 80%",
                "code": "state = create_game()\nstate.update({'correct': 12, 'wrong': 3})\nassert accuracy(state) == 80"
            },
            {
                "name": "The answer is always a whole number",
                "code": "state = create_game()\nstate.update({'correct': 1, 'wrong': 2})\nassert isinstance(accuracy(state), int)"
            },
            {
                "name": "It never goes outside 0 to 100",
                "code": "for right in range(21):\n    for wrong in range(21):\n        state = create_game()\n        state.update({'correct': right, 'wrong': wrong})\n        assert 0 <= accuracy(state) <= 100"
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
        "fnName": "words_per_minute",
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
        "starter": "def words_per_minute(state):\n    # five characters is one 'word'\n    pass\n",
        "answer": "def words_per_minute(state):\n    if state[\"seconds\"] < 1:\n        return 0\n    words = state[\"letters_typed\"] / 5\n    return round(words / state[\"seconds\"] * 60)\n",
        "hints": [
            "Guard the first second BEFORE dividing by state['seconds'].",
            "words / seconds gives words per SECOND - multiply by 60 for a minute.",
            "round(words / state['seconds'] * 60)"
        ],
        "tests": [
            {
                "name": "A race that has not started is 0",
                "code": "assert words_per_minute(create_game()) == 0"
            },
            {
                "name": "Sixty characters in sixty seconds is 12 WPM",
                "code": "state = create_game()\nstate.update({'letters_typed': 60, 'seconds': 60})\nassert words_per_minute(state) == 12"
            },
            {
                "name": "Three hundred characters in a minute is 60 WPM",
                "code": "state = create_game()\nstate.update({'letters_typed': 300, 'seconds': 60})\nassert words_per_minute(state) == 60"
            },
            {
                "name": "The same typing in half the time is twice the speed",
                "code": "slow = create_game()\nslow.update({'letters_typed': 150, 'seconds': 60})\nfast = create_game()\nfast.update({'letters_typed': 150, 'seconds': 30})\nassert words_per_minute(fast) == words_per_minute(slow) * 2"
            },
            {
                "name": "Half a second of typing gives 0, not a huge number",
                "code": "state = create_game()\nstate.update({'letters_typed': 20, 'seconds': 0.4})\nassert words_per_minute(state) == 0"
            },
            {
                "name": "A real race adds up",
                "code": "state = create_game()\nstate.update({'words': ['water'] * 4, 'index': 0})\nfor _ in range(4):\n    state['typed'] = 'water'\n    submit_word(state)\nstate['seconds'] = 24\nassert words_per_minute(state) == 12"
            }
        ],
        "demo": {
            "kind": "sums",
            "caption": "Add words and seconds with the buttons and watch the speed change."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
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
        "starter": "def action_for_key(key):\n    text = str(key)\n    # space, backspace, enter, escape, or the letter itself\n    return None\n",
        "answer": "def action_for_key(key):\n    text = str(key)\n\n    if text == \" \" or text.lower() == \"spacebar\":\n        return \"space\"\n    if text.lower() == \"backspace\":\n        return \"back\"\n    if text.lower() == \"enter\":\n        return \"new\"\n    if text.lower() == \"escape\":\n        return \"pause\"\n\n    if len(text) == 1 and text.isalpha():\n        return text.lower()\n\n    return None\n",
        "hints": [
            "The named keys come first - 'Backspace' would otherwise fall through.",
            "text.isalpha() asks 'is this a letter?'",
            "The words are all lower case, so guesses come back lower case too."
        ],
        "tests": [
            {
                "name": "Space submits the word",
                "code": "assert action_for_key(' ') == 'space'"
            },
            {
                "name": "Backspace rubs one out",
                "code": "assert action_for_key('Backspace') == 'back'"
            },
            {
                "name": "Enter starts a new race",
                "code": "assert action_for_key('Enter') == 'new'"
            },
            {
                "name": "A letter comes back as itself",
                "code": "assert action_for_key('a') == 'a'\nassert action_for_key('z') == 'z'"
            },
            {
                "name": "Capitals come back in lower case",
                "code": "assert action_for_key('A') == 'a'"
            },
            {
                "name": "Numbers and arrows do nothing",
                "code": "assert action_for_key('5') is None\nassert action_for_key('ArrowUp') is None\nassert action_for_key('Shift') is None"
            },
            {
                "name": "Every letter of the alphabet works",
                "code": "for letter in 'abcdefghijklmnopqrstuvwxyz':\n    assert action_for_key(letter) == letter"
            },
            {
                "name": "What comes back can be typed straight in",
                "code": "state = create_game()\nstate.update({'words': ['water'], 'index': 0, 'typed': ''})\ntype_letter(state, action_for_key('w'))\nassert state['typed'] == 'w'"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page and race. SPACE after each word."
        }
    }
];
