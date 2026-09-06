/* ============================================================
   memory-python-steps.js - the 9 steps of "Build Memory Match in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const MEMORY_PYTHON_STEPS = [
    {
        "id": "card_index",
        "fnName": "card_index",
        "title": "Number the squares",
        "adds": "The board has places to put cards.",
        "intro": "<p>Sixteen cards lie in a 4 x 4 grid, but they are stored as one flat <strong>list</strong> of sixteen. So the game needs a way to turn \"column 2, row 1\" into \"card number 6\".</p><pre class=\"mini-code\"> 0  1  2  3\n 4  5  6  7\n 8  9 10 11\n12 13 14 15</pre><p>Every row holds GRID_COLUMNS cards, so skipping a whole row means skipping that many places.</p>",
        "spec": {
            "input": "column - 0 to 3, left to right. row - 0 to 3, top to bottom.",
            "output": "the position of that card in the flat list of sixteen",
            "algorithm": [
                "Skip a whole row of cards for every row above this one: row * GRID_COLUMNS.",
                "Add the column.",
                "Return the answer."
            ]
        },
        "starter": "def card_index(column, row):\n    # skip whole rows, then add the column\n    pass\n",
        "answer": "def card_index(column, row):\n    return row * GRID_COLUMNS + column\n",
        "hints": [
            "The whole function is one line.",
            "Skipping `row` rows means skipping row * GRID_COLUMNS cards.",
            "return row * GRID_COLUMNS + column"
        ],
        "tests": [
            {
                "name": "The first card is number 0",
                "code": "got = card_index(0, 0)\nassert got == 0, f'card_index(0,0) gave {got}'"
            },
            {
                "name": "Column 2 of row 1 is number 6",
                "code": "got = card_index(2, 1)\nassert got == 6, f'card_index(2,1) gave {got}, expected 6'"
            },
            {
                "name": "The last card is number 15",
                "code": "assert card_index(3, 3) == 15"
            },
            {
                "name": "Moving one column right adds 1",
                "code": "assert card_index(1, 2) - card_index(0, 2) == 1"
            },
            {
                "name": "Moving one row down adds a whole row",
                "code": "assert card_index(0, 2) - card_index(0, 1) == GRID_COLUMNS"
            },
            {
                "name": "Every square gets a different number",
                "code": "seen = {card_index(c, r) for r in range(GRID_ROWS) for c in range(GRID_COLUMNS)}\nassert len(seen) == 16, f'only {len(seen)} different numbers - two squares share one'"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers every square on the board."
        }
    },
    {
        "id": "create_deck",
        "fnName": "create_deck",
        "title": "Deal the cards",
        "adds": "The cards exist — eight pairs, shuffled.",
        "intro": "<p>Eight symbols, each on two cards, mixed into a random order. A card remembers three things: which symbol it hides, whether it is face up, and whether it has been matched.</p>",
        "spec": {
            "input": "nothing",
            "output": "a list of 16 cards, every symbol from 0 to PAIR_COUNT-1 appearing exactly twice, in a random order",
            "algorithm": [
                "Build a list holding every symbol number twice.",
                "Shuffle it.",
                "Turn each symbol into a card that starts face down and unmatched."
            ]
        },
        "starter": "def create_deck():\n    # every symbol twice, shuffled, turned into cards\n    pass\n",
        "answer": "def create_deck():\n    symbols = list(range(PAIR_COUNT)) * 2\n    random.shuffle(symbols)\n    return [{\"symbol\": symbol, \"face_up\": False, \"matched\": False} for symbol in symbols]\n",
        "hints": [
            "list(range(PAIR_COUNT)) * 2 repeats the whole list - one of each, twice.",
            "random.shuffle(symbols) mixes a list in place (random is already imported).",
            "A list comprehension turns each symbol into a card dictionary."
        ],
        "tests": [
            {
                "name": "There are sixteen cards",
                "code": "deck = create_deck()\nassert len(deck) == 16, f'got {len(deck)} cards'"
            },
            {
                "name": "Every card starts face down and unmatched",
                "code": "deck = create_deck()\nassert all(not c['face_up'] and not c['matched'] for c in deck), 'a card started face up or matched'"
            },
            {
                "name": "Every symbol appears exactly twice",
                "code": "symbols = [c['symbol'] for c in create_deck()]\nassert len(set(symbols)) == PAIR_COUNT, f'expected {PAIR_COUNT} different symbols, got {len(set(symbols))}'\nassert all(symbols.count(s) == 2 for s in set(symbols)), 'some symbol does not appear exactly twice'"
            },
            {
                "name": "The symbols are 0 up to PAIR_COUNT - 1",
                "code": "assert all(0 <= c['symbol'] < PAIR_COUNT for c in create_deck())"
            },
            {
                "name": "The deck really is shuffled",
                "code": "first = [c['symbol'] for c in create_deck()]\nassert any([c['symbol'] for c in create_deck()] != first for _ in range(20)), 'twenty decks came out the same - did you shuffle?'"
            }
        ],
        "demo": {
            "kind": "deck",
            "caption": "Your deck, dealt face up so you can check the pairs."
        }
    },
    {
        "id": "is_match",
        "fnName": "is_match",
        "title": "Do they match?",
        "adds": "The game can tell a pair from a miss.",
        "intro": "<p>When two cards are face up the game asks one question: are they the same symbol?</p><p>The two turned-up cards are remembered in <code>picked</code>, a list of their <em>positions</em> in the deck — so look each one up before comparing.</p>",
        "spec": {
            "input": "state - the game",
            "output": "True if exactly two cards are picked and their symbols are equal",
            "algorithm": [
                "If there are not exactly two picked cards, the answer is False.",
                "Look up both cards in the deck using the numbers in picked.",
                "Return whether their symbols are equal."
            ]
        },
        "starter": "def is_match(state):\n    # exactly two picked cards, showing the same symbol?\n    pass\n",
        "answer": "def is_match(state):\n    if len(state[\"picked\"]) != 2:\n        return False\n    first = state[\"cards\"][state[\"picked\"][0]]\n    second = state[\"cards\"][state[\"picked\"][1]]\n    return first[\"symbol\"] == second[\"symbol\"]\n",
        "hints": [
            "Deal with the \"not two cards\" case first and return False.",
            "state[\"cards\"][state[\"picked\"][0]] is the first turned-up card.",
            "Compare the two symbols with =="
        ],
        "tests": [
            {
                "name": "Two of the same symbol match",
                "code": "state = {'cards': [{'symbol': 3}, {'symbol': 3}], 'picked': [0, 1]}\nassert is_match(state) is True, 'two 3s should match'"
            },
            {
                "name": "Two different symbols do not",
                "code": "state = {'cards': [{'symbol': 3}, {'symbol': 5}], 'picked': [0, 1]}\nassert is_match(state) is False, 'a 3 and a 5 should not match'"
            },
            {
                "name": "One card picked is not a match",
                "code": "assert is_match({'cards': [{'symbol': 1}], 'picked': [0]}) is False"
            },
            {
                "name": "No cards picked is not a match",
                "code": "assert is_match({'cards': [], 'picked': []}) is False"
            },
            {
                "name": "It looks the cards up, wherever they are",
                "code": "state = {'cards': [{'symbol': 0}, {'symbol': 7}, {'symbol': 2}, {'symbol': 7}], 'picked': [1, 3]}\nassert is_match(state) is True"
            }
        ],
        "demo": {
            "kind": "pair",
            "caption": "Change the two symbols and watch your function decide."
        }
    },
    {
        "id": "can_flip",
        "fnName": "can_flip",
        "title": "What may be turned over?",
        "adds": "The game stops you cheating.",
        "intro": "<p>Not every card may be turned over. You cannot turn one that is already up, or one that has been matched, or a third card while two are showing — and nothing moves while the game is paused, finished, or while the two wrong cards are still being looked at.</p>",
        "spec": {
            "input": "state - the game. index - which card.",
            "output": "True if that card may be turned face up right now",
            "algorithm": [
                "Say no if the game is over or paused.",
                "Say no while the peek timer is still running, or two cards are already picked.",
                "Say no if the index is not a real card.",
                "Otherwise say yes when the card is neither face up nor matched."
            ]
        },
        "starter": "def can_flip(state, index):\n    # four reasons to say no, then yes\n    pass\n",
        "answer": "def can_flip(state, index):\n    if state[\"is_over\"] or state[\"is_paused\"]:\n        return False\n    if state[\"peek_timer\"] > 0 or len(state[\"picked\"]) >= 2:\n        return False\n    if index < 0 or index >= len(state[\"cards\"]):\n        return False\n    card = state[\"cards\"][index]\n    return not card[\"face_up\"] and not card[\"matched\"]\n",
        "hints": [
            "Write the \"no\" checks first, each returning False.",
            "Check the index is really on the board before looking the card up.",
            "The last line is: return not card[\"face_up\"] and not card[\"matched\"]"
        ],
        "tests": [
            {
                "name": "A fresh face-down card may be turned",
                "code": "state = create_game()\nassert can_flip(state, 0) is True"
            },
            {
                "name": "A card that is already face up may not",
                "code": "state = create_game()\nstate['cards'][0]['face_up'] = True\nassert can_flip(state, 0) is False"
            },
            {
                "name": "A matched card may not",
                "code": "state = create_game()\nstate['cards'][0]['matched'] = True\nassert can_flip(state, 0) is False"
            },
            {
                "name": "A third card may not be turned",
                "code": "state = create_game()\nstate['picked'] = [1, 2]\nassert can_flip(state, 0) is False, 'only two cards at a time'"
            },
            {
                "name": "Nothing may be turned while the wrong pair is showing",
                "code": "state = create_game()\nstate['peek_timer'] = 500\nassert can_flip(state, 0) is False"
            },
            {
                "name": "Nothing may be turned when the game is over or paused",
                "code": "over = create_game(); over['is_over'] = True\npaused = create_game(); paused['is_paused'] = True\nassert can_flip(over, 0) is False and can_flip(paused, 0) is False"
            },
            {
                "name": "A card that does not exist may not be turned",
                "code": "assert can_flip(create_game(), 99) is False"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Try to break the rules — your function will not let you."
        }
    },
    {
        "id": "flip_card",
        "fnName": "flip_card",
        "title": "Turn a card over",
        "adds": "The game can be played!",
        "intro": "<p>This is the move itself. Turn the card face up, remember it, and if it was the second one, count the move and see whether it is a pair.</p><p>Two helpers are already written: <code>keepMatch</code> makes a pair stay up for good, and the peek timer turns a wrong pair back down a moment later.</p>",
        "spec": {
            "input": "state - the game. index - which card.",
            "output": "True if the card was turned over",
            "algorithm": [
                "If can-flip says no, do nothing and answer False.",
                "Turn the card face up and add its number to picked.",
                "If two cards are now picked: add one to moves, and either keep the match or start the peek timer (PEEK_MS)."
            ]
        },
        "starter": "def flip_card(state, index):\n    # 1. allowed?\n    # 2. turn it up and remember it\n    # 3. if that was the second card: count the move, match or peek\n    pass\n",
        "answer": "def flip_card(state, index):\n    if not can_flip(state, index):\n        return False\n\n    state[\"cards\"][index][\"face_up\"] = True\n    state[\"picked\"].append(index)\n\n    if len(state[\"picked\"]) == 2:\n        state[\"moves\"] += 1\n        if is_match(state):\n            keep_match(state)\n        else:\n            state[\"peek_timer\"] = PEEK_MS\n    return True\n",
        "hints": [
            "Start with: if not can_flip(state, index): return False",
            "state[\"picked\"].append(index) remembers which card was turned.",
            "Only when len(picked) == 2 do you count a move and check for a match."
        ],
        "tests": [
            {
                "name": "Turning a card puts it face up",
                "code": "state = create_game()\nflip_card(state, 0)\nassert state['cards'][0]['face_up'] is True"
            },
            {
                "name": "The turned card is remembered",
                "code": "state = create_game()\nflip_card(state, 3)\nassert state['picked'] == [3], f\"picked is {state['picked']}\""
            },
            {
                "name": "One card is not yet a move",
                "code": "state = create_game()\nflip_card(state, 0)\nassert state['moves'] == 0, 'a move is a PAIR of cards'"
            },
            {
                "name": "Two cards count as one move",
                "code": "state = create_game()\nflip_card(state, 0)\nflip_card(state, 1)\nassert state['moves'] == 1, f\"moves is {state['moves']}\""
            },
            {
                "name": "A matching pair stays up and scores",
                "code": "state = create_game()\nstate['cards'] = [{'symbol': 1, 'face_up': False, 'matched': False}, {'symbol': 1, 'face_up': False, 'matched': False}]\nflip_card(state, 0)\nflip_card(state, 1)\nassert state['cards'][0]['matched'] and state['cards'][1]['matched']\nassert state['pairs'] == 1"
            },
            {
                "name": "A wrong pair starts the peek timer",
                "code": "state = create_game()\nstate['cards'] = [{'symbol': 1, 'face_up': False, 'matched': False}, {'symbol': 2, 'face_up': False, 'matched': False}]\nflip_card(state, 0)\nflip_card(state, 1)\nassert state['peek_timer'] > 0, 'the two wrong cards must show for a moment'\nassert state['pairs'] == 0"
            },
            {
                "name": "Turning a card that may not be turned answers False",
                "code": "state = create_game()\nstate['cards'][0]['matched'] = True\nassert flip_card(state, 0) is False"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Now you can really play. Use the buttons to move and flip."
        },
        "warning": "Count the move when the SECOND card is turned, not the first — a move is a pair of cards."
    },
    {
        "id": "hide_unmatched",
        "fnName": "hide_unmatched",
        "title": "Turn the wrong ones back",
        "adds": "Wrong pairs no longer stay up for ever.",
        "intro": "<p>A moment after two wrong cards are turned up, they go back face down — and the player has to remember what was there. That memory is the whole game.</p>",
        "spec": {
            "input": "state - the game",
            "output": "nothing; it changes the cards",
            "algorithm": [
                "For every picked card that has not been matched, set it face down again.",
                "Empty the picked list.",
                "Set the peek timer back to 0."
            ]
        },
        "starter": "def hide_unmatched(state):\n    # turn the picked cards back down, forget them, stop the timer\n    pass\n",
        "answer": "def hide_unmatched(state):\n    for index in state[\"picked\"]:\n        if not state[\"cards\"][index][\"matched\"]:\n            state[\"cards\"][index][\"face_up\"] = False\n    state[\"picked\"] = []\n    state[\"peek_timer\"] = 0\n",
        "hints": [
            "Loop over state[\"picked\"] - those are the card numbers.",
            "Only turn a card down if it is not matched.",
            "Do not forget the last two lines."
        ],
        "tests": [
            {
                "name": "The two wrong cards go face down",
                "code": "state = create_game()\nstate['cards'][0]['face_up'] = True\nstate['cards'][1]['face_up'] = True\nstate['picked'] = [0, 1]\nhide_unmatched(state)\nassert not state['cards'][0]['face_up'] and not state['cards'][1]['face_up']"
            },
            {
                "name": "The picked list is emptied",
                "code": "state = create_game()\nstate['picked'] = [0, 1]\nhide_unmatched(state)\nassert state['picked'] == []"
            },
            {
                "name": "The timer is stopped",
                "code": "state = create_game()\nstate['picked'] = [0, 1]\nstate['peek_timer'] = 500\nhide_unmatched(state)\nassert state['peek_timer'] == 0"
            },
            {
                "name": "Matched cards are left alone",
                "code": "state = create_game()\nstate['cards'][0]['face_up'] = True\nstate['cards'][0]['matched'] = True\nstate['picked'] = [0]\nhide_unmatched(state)\nassert state['cards'][0]['face_up'] is True, 'a found pair must stay showing'"
            },
            {
                "name": "Other cards are not touched",
                "code": "state = create_game()\nstate['cards'][5]['face_up'] = True\nstate['picked'] = [0, 1]\nhide_unmatched(state)\nassert state['cards'][5]['face_up'] is True"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Pick two wrong cards and watch them turn back over."
        }
    },
    {
        "id": "is_game_won",
        "fnName": "is_game_won",
        "title": "Have you won?",
        "adds": "The game knows when every pair is found.",
        "intro": "<p>The game is won when there is not a single unmatched card left on the table.</p>",
        "spec": {
            "input": "state - the game",
            "output": "True if every card has been matched",
            "algorithm": [
                "Look at every card.",
                "If any is still unmatched, the answer is False.",
                "If you get through them all, the answer is True."
            ]
        },
        "starter": "def is_game_won(state):\n    # is every card matched?\n    pass\n",
        "answer": "def is_game_won(state):\n    return all(card[\"matched\"] for card in state[\"cards\"])\n",
        "hints": [
            "all(...) asks \"is this true of every item?\" in one word.",
            "all(card[\"matched\"] for card in state[\"cards\"])",
            "A for loop with an early `return False` works just as well."
        ],
        "tests": [
            {
                "name": "A brand-new game is not won",
                "code": "assert is_game_won(create_game()) is False"
            },
            {
                "name": "A board with every card matched is won",
                "code": "state = create_game()\nfor card in state['cards']:\n    card['matched'] = True\nassert is_game_won(state) is True"
            },
            {
                "name": "One unmatched card means not won",
                "code": "state = create_game()\nfor card in state['cards']:\n    card['matched'] = True\nstate['cards'][7]['matched'] = False\nassert is_game_won(state) is False"
            },
            {
                "name": "Face up is not the same as matched",
                "code": "state = create_game()\nfor card in state['cards']:\n    card['face_up'] = True\nassert is_game_won(state) is False"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Find all eight pairs and your function ends the game."
        }
    },
    {
        "id": "stars_for_moves",
        "fnName": "stars_for_moves",
        "title": "Award the stars",
        "adds": "Playing well is worth something.",
        "intro": "<p>Eight pairs cannot be found in fewer than eight moves, so a really sharp player finishes in about twelve. The rating: <strong>12 moves or fewer is three stars</strong>, 18 or fewer is two, and anything else is one — because everybody who finishes deserves a star.</p>",
        "spec": {
            "input": "moves - how many pairs were tried",
            "output": "3, 2 or 1",
            "algorithm": [
                "12 or fewer: 3.",
                "18 or fewer: 2.",
                "Otherwise: 1."
            ]
        },
        "starter": "def stars_for_moves(moves):\n    # 3 stars, 2 stars or 1 star\n    pass\n",
        "answer": "def stars_for_moves(moves):\n    if moves <= 12:\n        return 3\n    if moves <= 18:\n        return 2\n    return 1\n",
        "hints": [
            "Two ifs and a return - check the best score first.",
            "if moves <= 12: return 3",
            "The last line is just: return 1"
        ],
        "tests": [
            {
                "name": "A perfect 8 moves is three stars",
                "code": "got = stars_for_moves(8)\nassert got == 3, f'gave {got}'"
            },
            {
                "name": "12 moves is still three stars",
                "code": "assert stars_for_moves(12) == 3"
            },
            {
                "name": "13 moves drops to two stars",
                "code": "got = stars_for_moves(13)\nassert got == 2, f'gave {got}'"
            },
            {
                "name": "18 moves is still two stars",
                "code": "assert stars_for_moves(18) == 2"
            },
            {
                "name": "19 moves is one star",
                "code": "assert stars_for_moves(19) == 1"
            },
            {
                "name": "Everybody gets at least one star",
                "code": "for moves in range(200):\n    assert stars_for_moves(moves) >= 1, f'moves {moves} gave {stars_for_moves(moves)}'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Finish the board and see your rating."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Wire up the keyboard",
        "adds": "You can play without a mouse — the game is finished!",
        "intro": "<p>Arrows move a dashed cursor around the grid and the space bar turns a card over. As always, the browser gives us a key name and the game needs the name of an action.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"up\", \"down\", \"left\", \"right\", \"flip\", \"pause\", \"restart\" - or nothing for other keys",
            "algorithm": [
                "Lowercase the key first.",
                "Arrows or WASD move the cursor.",
                "Space or Enter flips; p pauses; r restarts; anything else is nothing."
            ]
        },
        "starter": "def action_for_key(key):\n    k = str(key).lower()\n    # a dictionary from key names to action names, then .get(k)\n    pass\n",
        "answer": "def action_for_key(key):\n    k = str(key).lower()\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \" \": \"flip\", \"spacebar\": \"flip\", \"enter\": \"flip\",\n        \"p\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(k)\n",
        "hints": [
            "In Python a dictionary IS the lookup table.",
            "Several keys can share an action - just list them all.",
            "keys.get(k) returns None for anything that is not there."
        ],
        "tests": [
            {
                "name": "ArrowUp moves up",
                "code": "got = action_for_key('ArrowUp')\nassert got == 'up', f'gave {got!r}'"
            },
            {
                "name": "W moves up too",
                "code": "assert action_for_key('w') == 'up'"
            },
            {
                "name": "A capital W still works",
                "code": "assert action_for_key('W') == 'up', 'did you lowercase the key?'"
            },
            {
                "name": "The arrows all work",
                "code": "assert action_for_key('ArrowDown') == 'down'\nassert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "Space turns a card over",
                "code": "assert action_for_key(' ') == 'flip'"
            },
            {
                "name": "Enter turns a card over too",
                "code": "assert action_for_key('Enter') == 'flip'"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert action_for_key('p') == 'pause'\nassert action_for_key('r') == 'restart'"
            },
            {
                "name": "An unused key gives None",
                "code": "got = action_for_key('q')\nassert got is None, f'gave {got!r}'"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then play with the arrow keys and space."
        },
        "warning": "Return null (JavaScript) or None (Python) for keys the game does not use."
    }
];
