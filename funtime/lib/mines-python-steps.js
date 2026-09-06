/* ============================================================
   mines-python-steps.js - the 7 steps of "Build Minesweeper in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const MINES_PYTHON_STEPS = [
    {
        "id": "neighbours",
        "fnName": "neighbours",
        "title": "Who is next door?",
        "adds": "The board knows which squares touch.",
        "intro": "<p>Almost everything in Minesweeper is about the eight squares around a square. Write this one well and the rest of the game falls out of it.</p><p>The neat way is to walk over the little 3×3 box around the square, skipping two things: the middle (that is the square itself) and anything that falls off the edge of the board. A corner has 3 neighbours, an edge has 5, and the middle has 8.</p>",
        "spec": {
            "input": "column, row",
            "output": "a list of the squares touching it",
            "algorithm": [
                "Loop dRow from -1 to 1, and dColumn from -1 to 1 inside it.",
                "Skip the case where both are 0 — that is the square itself.",
                "Work out the neighbour's column and row.",
                "Only keep it if is-inside-grid says it is on the board."
            ]
        },
        "starter": "def neighbours(column, row):\n    found = []\n    # the 3x3 box around it, minus the middle, minus anything off the board\n    return found\n",
        "answer": "def neighbours(column, row):\n    found = []\n    for d_row in (-1, 0, 1):\n        for d_column in (-1, 0, 1):\n            if d_column == 0 and d_row == 0:\n                continue\n            c = column + d_column\n            r = row + d_row\n            if is_inside_grid(c, r):\n                found.append((c, r))\n    return found\n",
        "hints": [
            "Two loops, both over (-1, 0, 1).",
            "continue skips the middle without leaving the loop.",
            "is_inside_grid(c, r) is already written for you."
        ],
        "tests": [
            {
                "name": "The middle of the board has 8 neighbours",
                "code": "assert len(neighbours(4, 4)) == 8"
            },
            {
                "name": "A corner has only 3",
                "code": "got = len(neighbours(0, 0))\nassert got == 3, f'gave {got}'"
            },
            {
                "name": "An edge has 5",
                "code": "assert len(neighbours(4, 0)) == 5"
            },
            {
                "name": "The other three corners work too",
                "code": "assert len(neighbours(GRID_SIZE - 1, 0)) == 3\nassert len(neighbours(0, GRID_SIZE - 1)) == 3\nassert len(neighbours(GRID_SIZE - 1, GRID_SIZE - 1)) == 3"
            },
            {
                "name": "A square is never its own neighbour",
                "code": "assert (4, 4) not in neighbours(4, 4)"
            },
            {
                "name": "Every neighbour is on the board",
                "code": "for row in range(GRID_SIZE):\n    for column in range(GRID_SIZE):\n        for c, r in neighbours(column, row):\n            assert is_inside_grid(c, r), f'({c},{r}) is off the board'"
            },
            {
                "name": "Neighbours are always right next door",
                "code": "for c, r in neighbours(4, 4):\n    assert abs(c - 4) <= 1 and abs(r - 4) <= 1"
            },
            {
                "name": "Being a neighbour goes both ways",
                "code": "assert (4, 5) in neighbours(3, 5)\nassert (3, 5) in neighbours(4, 5), 'if A touches B then B touches A'"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Move around the board — the outlined squares are the neighbours of the dashed one."
        }
    },
    {
        "id": "count_mines",
        "fnName": "count_mines",
        "title": "The numbers",
        "adds": "The board can tell you what it knows.",
        "intro": "<p>This is the number printed on a square, and it is the only information the game ever gives you. Everything a good player does is deduced from these numbers.</p><p>Now that neighbours() exists, this is four lines.</p>",
        "spec": {
            "input": "state, column, row",
            "output": "how many of its neighbours are mines (0 to 8)",
            "algorithm": [
                "Start a count at 0.",
                "Ask neighbours() for the squares around this one.",
                "For each, look it up in state.mines — add 1 if it is a mine.",
                "Return the count."
            ]
        },
        "starter": "def count_mines(state, column, row):\n    # how many neighbours are mines?\n    pass\n",
        "answer": "def count_mines(state, column, row):\n    return sum(1 for c, r in neighbours(column, row) if state[\"mines\"][cell_index(c, r)])\n",
        "hints": [
            "Use the neighbours() you just wrote.",
            "cell_index(column, row) finds a square's place in state['mines'].",
            "sum(1 for ... if ...) counts the ones that match."
        ],
        "tests": [
            {
                "name": "An empty board has no numbers",
                "code": "state = create_game()\nassert count_mines(state, 4, 4) == 0"
            },
            {
                "name": "One mine next door counts as one",
                "code": "state = create_game()\nstate['mines'][cell_index(3, 4)] = True\nassert count_mines(state, 4, 4) == 1"
            },
            {
                "name": "A diagonal mine counts too",
                "code": "state = create_game()\nstate['mines'][cell_index(3, 3)] = True\nassert count_mines(state, 4, 4) == 1"
            },
            {
                "name": "A mine two squares away does not count",
                "code": "state = create_game()\nstate['mines'][cell_index(2, 4)] = True\nassert count_mines(state, 4, 4) == 0"
            },
            {
                "name": "Eight mines give an 8",
                "code": "state = create_game()\nfor c, r in neighbours(4, 4):\n    state['mines'][cell_index(c, r)] = True\nassert count_mines(state, 4, 4) == 8"
            },
            {
                "name": "A square does not count itself",
                "code": "state = create_game()\nstate['mines'][cell_index(4, 4)] = True\nassert count_mines(state, 4, 4) == 0"
            },
            {
                "name": "It works in a corner",
                "code": "state = create_game()\nstate['mines'][cell_index(1, 0)] = True\nstate['mines'][cell_index(1, 1)] = True\nassert count_mines(state, 0, 0) == 2"
            }
        ],
        "demo": {
            "kind": "count",
            "caption": "An open board with the mines showing. Move around and check the numbers yourself."
        }
    },
    {
        "id": "place_mines",
        "fnName": "place_mines",
        "title": "Hide the mines",
        "adds": "A fair board.",
        "intro": "<p>Here is a rule almost every beginner gets wrong, and every good Minesweeper gets right: <strong>the mines are laid after the first click, not before</strong>.</p><p>Lay them first and your opening move is a coin toss — you can lose a game before you have made a single decision. Laying them afterwards, avoiding the square you clicked <em>and its neighbours</em>, guarantees your first click always opens a nice big area.</p>",
        "spec": {
            "input": "state, safeColumn, safeRow — where the player just clicked",
            "output": "nothing; it fills in state.mines",
            "algorithm": [
                "Build a set of banned squares: the one clicked and all its neighbours.",
                "Make a list of every other square — those are allowed to hold a mine.",
                "Shuffle that list.",
                "Set state.mines to all false, then turn on the first MINE_COUNT of the shuffled list.",
                "Remember that the mines are now placed."
            ]
        },
        "starter": "def place_mines(state, safe_column, safe_row):\n    # never under the first click, or next to it\n    pass\n",
        "answer": "def place_mines(state, safe_column, safe_row):\n    banned = {cell_index(safe_column, safe_row)}\n    for c, r in neighbours(safe_column, safe_row):\n        banned.add(cell_index(c, r))\n\n    allowed = [i for i in range(CELL_COUNT) if i not in banned]\n    random.shuffle(allowed)\n\n    state[\"mines\"] = [False] * CELL_COUNT\n    for index in allowed[:MINE_COUNT]:\n        state[\"mines\"][index] = True\n    state[\"mines_placed\"] = True\n",
        "hints": [
            "A set is the natural way to hold the banned squares.",
            "random.shuffle(allowed) then allowed[:MINE_COUNT] picks ten with no repeats.",
            "Do not forget state['mines_placed'] = True at the end."
        ],
        "tests": [
            {
                "name": "It lays exactly MINE_COUNT mines",
                "code": "state = create_game()\nplace_mines(state, 4, 4)\nassert sum(state['mines']) == MINE_COUNT"
            },
            {
                "name": "The clicked square is never a mine",
                "code": "for _ in range(60):\n    state = create_game()\n    place_mines(state, 4, 4)\n    assert state['mines'][cell_index(4, 4)] is False"
            },
            {
                "name": "Nor are any of its neighbours",
                "code": "for _ in range(60):\n    state = create_game()\n    place_mines(state, 4, 4)\n    for c, r in neighbours(4, 4):\n        assert state['mines'][cell_index(c, r)] is False, 'the first click must open an AREA'"
            },
            {
                "name": "It works in a corner too",
                "code": "state = create_game()\nplace_mines(state, 0, 0)\nassert sum(state['mines']) == MINE_COUNT\nassert state['mines'][cell_index(0, 0)] is False"
            },
            {
                "name": "It remembers that the mines are down",
                "code": "state = create_game()\nplace_mines(state, 4, 4)\nassert state['mines_placed'] is True"
            },
            {
                "name": "Different games get different boards",
                "code": "a = create_game()\nb = create_game()\nplace_mines(a, 4, 4)\nplace_mines(b, 4, 4)\nassert a['mines'] != b['mines']"
            },
            {
                "name": "Every square can hold a mine sometimes",
                "code": "seen = set()\nfor _ in range(300):\n    state = create_game()\n    place_mines(state, 0, 0)\n    seen.update(i for i, m in enumerate(state['mines']) if m)\nassert len(seen) > CELL_COUNT / 2"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Dig anywhere. Your first click can never be a mine — try it a few times."
        },
        "warning": "Ban the neighbours as well as the square itself. Ban only the one square and your first click often opens a single number, which is no fun at all."
    },
    {
        "id": "reveal_cell",
        "fnName": "reveal_cell",
        "title": "Flood fill",
        "adds": "One click opens a whole field.",
        "intro": "<p>This is the big one — the most valuable algorithm in this entire collection. It is called <strong>flood fill</strong>, and the paint bucket in every drawing program is the same idea.</p><p>The rule is simple: uncover a square; if it has no mines touching it, there is nothing to work out around it, so uncover its neighbours too — and keep going.</p><p>Rather than a function that calls itself, this version keeps a <em>to-do list</em>. Take a square off, deal with it, and if it is blank put its neighbours on. When the list is empty you are done.</p>",
        "spec": {
            "input": "state, column, row",
            "output": "True if anything was uncovered",
            "algorithm": [
                "Refuse if the game is over or the square is off the board.",
                "Refuse if it is already open or flagged.",
                "If the mines are not down yet, lay them now — this click is the first.",
                "If this square IS a mine: uncover it and the game is over.",
                "Otherwise start a to-do list holding just this square. While it is not empty: take one off, skip it if it is already open or flagged, uncover it, and if count-mines is 0 add all its neighbours to the list.",
                "Finally, check whether that won the game."
            ]
        },
        "starter": "def reveal_cell(state, column, row):\n    # guards, then the first click, then FLOOD FILL\n    pass\n",
        "answer": "def reveal_cell(state, column, row):\n    if state[\"is_over\"] or not is_inside_grid(column, row):\n        return False\n    first = cell_index(column, row)\n    if state[\"revealed\"][first] or state[\"flagged\"][first]:\n        return False\n\n    if not state[\"mines_placed\"]:\n        place_mines(state, column, row)\n\n    if state[\"mines\"][first]:\n        state[\"revealed\"][first] = True\n        state[\"is_over\"] = True\n        state[\"hit_mine\"] = first\n        return True\n\n    todo = [(column, row)]\n    while todo:\n        c, r = todo.pop()\n        index = cell_index(c, r)\n\n        if state[\"revealed\"][index] or state[\"flagged\"][index]:\n            continue\n        state[\"revealed\"][index] = True\n\n        if count_mines(state, c, r) == 0:\n            todo.extend(neighbours(c, r))\n\n    check_win(state)\n    return True\n",
        "hints": [
            "The to-do list is just a list. append() puts one on, pop() takes one off.",
            "`while todo:` keeps going until the list is empty.",
            "The 'already open' check inside the loop is what stops it going round for ever."
        ],
        "tests": [
            {
                "name": "Digging a safe square opens it",
                "code": "state = create_game()\nreveal_cell(state, 4, 4)\nassert state['revealed'][cell_index(4, 4)] is True"
            },
            {
                "name": "The first click lays the mines",
                "code": "state = create_game()\nassert state['mines_placed'] is False\nreveal_cell(state, 4, 4)\nassert state['mines_placed'] is True"
            },
            {
                "name": "You can never lose on the first click",
                "code": "for _ in range(60):\n    state = create_game()\n    reveal_cell(state, 4, 4)\n    assert state['is_over'] is False or state['is_won'] is True"
            },
            {
                "name": "The first click opens more than one square",
                "code": "for _ in range(30):\n    state = create_game()\n    reveal_cell(state, 4, 4)\n    assert revealed_count(state) >= 9, 'the flood should spread'"
            },
            {
                "name": "Digging a mine ends the game",
                "code": "state = create_game()\nreveal_cell(state, 0, 0)\nmine = state['mines'].index(True)\nreveal_cell(state, mine % GRID_SIZE, mine // GRID_SIZE)\nassert state['is_over'] is True"
            },
            {
                "name": "A flagged square is protected",
                "code": "state = create_game()\nreveal_cell(state, 0, 0)\n# whichever square is still covered - the flood fill may have opened a lot\ncovered = state['revealed'].index(False)\ncolumn, row = covered % GRID_SIZE, covered // GRID_SIZE\ntoggle_flag(state, column, row)\nreveal_cell(state, column, row)\nassert state['revealed'][covered] is False, 'a flag should stop a fumbled click'"
            },
            {
                "name": "The flood never uncovers a mine",
                "code": "state = create_game()\nreveal_cell(state, 4, 4)\nfor i, open_ in enumerate(state['revealed']):\n    if open_:\n        assert state['mines'][i] is False"
            },
            {
                "name": "Opening every safe square wins",
                "code": "state = create_game()\nreveal_cell(state, 4, 4)\nfor row in range(GRID_SIZE):\n    for column in range(GRID_SIZE):\n        if not state['mines'][cell_index(column, row)]:\n            reveal_cell(state, column, row)\nassert state['is_won'] is True"
            },
            {
                "name": "Digging the same square twice does nothing",
                "code": "state = create_game()\nreveal_cell(state, 4, 4)\nbefore = revealed_count(state)\nassert reveal_cell(state, 4, 4) is False\nassert revealed_count(state) == before"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Dig around and watch one click open a whole area."
        },
        "warning": "Check 'is it already open?' INSIDE the loop, not just before it. A square can land on the to-do list several times, and without that check the loop never ends."
    },
    {
        "id": "toggle_flag",
        "fnName": "toggle_flag",
        "title": "Plant a flag",
        "adds": "You can mark the mines you have found.",
        "intro": "<p>A flag is a note to yourself: <em>I have worked out that this one is a mine.</em></p><p>It also protects the square. Once flagged, digging refuses to open it — which is exactly what you want when you are clicking quickly and your finger slips.</p>",
        "spec": {
            "input": "state, column, row",
            "output": "True if the flag changed",
            "algorithm": [
                "Refuse if the game is over or the square is off the board.",
                "Refuse if the square is already open — there is nothing left to mark.",
                "Otherwise flip the flag: on becomes off, off becomes on."
            ]
        },
        "starter": "def toggle_flag(state, column, row):\n    # only on a covered square, and it flips\n    pass\n",
        "answer": "def toggle_flag(state, column, row):\n    if state[\"is_over\"] or not is_inside_grid(column, row):\n        return False\n    index = cell_index(column, row)\n    if state[\"revealed\"][index]:\n        return False\n    state[\"flagged\"][index] = not state[\"flagged\"][index]\n    return True\n",
        "hints": [
            "Flipping a True/False is just x = not x",
            "Three guards first, then the one line that does the work.",
            "state['flagged'][index] = not state['flagged'][index]"
        ],
        "tests": [
            {
                "name": "Flagging a covered square works",
                "code": "state = create_game()\ntoggle_flag(state, 2, 2)\nassert state['flagged'][cell_index(2, 2)] is True"
            },
            {
                "name": "Flagging it again takes the flag off",
                "code": "state = create_game()\ntoggle_flag(state, 2, 2)\ntoggle_flag(state, 2, 2)\nassert state['flagged'][cell_index(2, 2)] is False"
            },
            {
                "name": "An open square cannot be flagged",
                "code": "state = create_game()\nreveal_cell(state, 4, 4)\nassert toggle_flag(state, 4, 4) is False"
            },
            {
                "name": "A square off the board cannot be flagged",
                "code": "state = create_game()\nassert toggle_flag(state, -1, 4) is False\nassert toggle_flag(state, GRID_SIZE, 4) is False"
            },
            {
                "name": "The mines-left number goes down",
                "code": "state = create_game()\nassert mines_left(state) == MINE_COUNT\ntoggle_flag(state, 2, 2)\nassert mines_left(state) == MINE_COUNT - 1"
            },
            {
                "name": "A finished game cannot be flagged",
                "code": "state = create_game()\nstate['is_over'] = True\nassert toggle_flag(state, 2, 2) is False"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Dig a bit, then flag the squares you think are mines."
        }
    },
    {
        "id": "check_win",
        "fnName": "check_win",
        "title": "Have you won?",
        "adds": "The game can be finished.",
        "intro": "<p>The winning condition catches a lot of people out, so read it carefully: <strong>you win by uncovering every square that is not a mine</strong>.</p><p>Flags have nothing to do with it. You can win having planted no flags at all, and flagging all ten mines is not a win on its own — the safe squares still have to be open.</p>",
        "spec": {
            "input": "state",
            "output": "True if the player has won",
            "algorithm": [
                "Count the uncovered squares.",
                "If that equals CELL_COUNT - MINE_COUNT, the game is won and over.",
                "Otherwise return False."
            ]
        },
        "starter": "def check_win(state):\n    # every safe square open - flags do not matter\n    pass\n",
        "answer": "def check_win(state):\n    if revealed_count(state) == CELL_COUNT - MINE_COUNT:\n        state[\"is_won\"] = True\n        state[\"is_over\"] = True\n        return True\n    return False\n",
        "hints": [
            "revealed_count(state) is written for you.",
            "There are CELL_COUNT squares and MINE_COUNT of them are mines.",
            "Set is_won AND is_over - a won game has also finished."
        ],
        "tests": [
            {
                "name": "A new game is not won",
                "code": "assert check_win(create_game()) is False"
            },
            {
                "name": "Every safe square open is a win",
                "code": "state = create_game()\nplace_mines(state, 4, 4)\nfor i in range(CELL_COUNT):\n    if not state['mines'][i]:\n        state['revealed'][i] = True\nassert check_win(state) is True\nassert state['is_won'] is True and state['is_over'] is True"
            },
            {
                "name": "One square short is not a win",
                "code": "state = create_game()\nplace_mines(state, 4, 4)\nsafe = [i for i in range(CELL_COUNT) if not state['mines'][i]]\nfor i in safe[1:]:\n    state['revealed'][i] = True\nassert check_win(state) is False"
            },
            {
                "name": "Flags alone do not win",
                "code": "state = create_game()\nplace_mines(state, 4, 4)\nfor i in range(CELL_COUNT):\n    if state['mines'][i]:\n        state['flagged'][i] = True\nassert check_win(state) is False, 'the safe squares still have to be opened'"
            },
            {
                "name": "A real game can be won",
                "code": "state = create_game()\nreveal_cell(state, 4, 4)\nfor row in range(GRID_SIZE):\n    for column in range(GRID_SIZE):\n        if not state['mines'][cell_index(column, row)]:\n            reveal_cell(state, column, row)\nassert state['is_won'] is True"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Clear the whole board and see the win message."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function: move the cursor, dig, flag.</p><p>The mouse works too — a left click digs and a right click flags — but a keyboard player deserves the same game.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "The arrows or WASD move the cursor.",
                "Space or Enter → 'dig'. F → 'flag'.",
                "P → 'pause'. R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "def action_for_key(key):\n    keys = {\n        # \"arrowup\": \"up\", ...\n    }\n    return keys.get(str(key).lower())\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \" \": \"dig\", \"spacebar\": \"dig\", \"enter\": \"dig\",\n        \"f\": \"flag\", \"p\": \"pause\", \"r\": \"restart\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "A dictionary is much tidier than eight ifs.",
            "Both \" \" and \"enter\" should dig.",
            "keys.get(...) gives None for anything not listed."
        ],
        "tests": [
            {
                "name": "The arrows move the cursor",
                "code": "assert action_for_key('ArrowUp') == 'up'\nassert action_for_key('ArrowDown') == 'down'\nassert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "WASD moves it too",
                "code": "assert action_for_key('w') == 'up'\nassert action_for_key('s') == 'down'\nassert action_for_key('a') == 'left'\nassert action_for_key('d') == 'right'"
            },
            {
                "name": "Space digs",
                "code": "assert action_for_key(' ') == 'dig'"
            },
            {
                "name": "Enter digs too",
                "code": "assert action_for_key('Enter') == 'dig'"
            },
            {
                "name": "F plants a flag",
                "code": "assert action_for_key('f') == 'flag'"
            },
            {
                "name": "Capital letters work",
                "code": "assert action_for_key('F') == 'flag'\nassert action_for_key('R') == 'restart'"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert action_for_key('z') is None\nassert action_for_key('Tab') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then play with the arrows, SPACE to dig and F to flag."
        }
    }
];
