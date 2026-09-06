/* ============================================================
   match3-python-steps.js - the 5 steps of "Build Match Three in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const MATCH3_PYTHON_STEPS = [
    {
        "id": "are_neighbours",
        "fnName": "are_neighbours",
        "title": "Are they next door?",
        "adds": "The game knows which swaps are allowed.",
        "intro": "<p>You may only swap two shapes that are <strong>touching along an edge</strong> — not diagonally, and certainly not from opposite corners of the board.</p><p>There is a lovely one-line way to say that. Add up how far apart the two squares are across and down. Neighbours come to exactly 1. Diagonals come to 2. A square with itself comes to 0. One sum, three cases, all correct.</p>",
        "spec": {
            "input": "a, b — two squares, each with a column and a row",
            "output": "True if they touch along an edge",
            "algorithm": [
                "Work out the difference in columns, ignoring the sign.",
                "Do the same for the rows.",
                "They are neighbours when the two differences add up to exactly 1."
            ]
        },
        "starter": "def are_neighbours(a, b):\n    # exactly one square apart, in total\n    pass\n",
        "answer": "def are_neighbours(a, b):\n    across = abs(a[\"column\"] - b[\"column\"])\n    down = abs(a[\"row\"] - b[\"row\"])\n    return across + down == 1\n",
        "hints": [
            "abs(...) throws away the minus sign, so the order does not matter.",
            "Add the two distances together.",
            "return across + down == 1"
        ],
        "tests": [
            {
                "name": "Left and right are neighbours",
                "code": "assert are_neighbours({'column': 3, 'row': 4}, {'column': 4, 'row': 4}) is True"
            },
            {
                "name": "Up and down are too",
                "code": "assert are_neighbours({'column': 3, 'row': 4}, {'column': 3, 'row': 5}) is True"
            },
            {
                "name": "It works in either order",
                "code": "assert are_neighbours({'column': 4, 'row': 4}, {'column': 3, 'row': 4}) is True"
            },
            {
                "name": "Diagonals are NOT neighbours",
                "code": "assert are_neighbours({'column': 3, 'row': 4}, {'column': 4, 'row': 5}) is False"
            },
            {
                "name": "A square is not its own neighbour",
                "code": "assert are_neighbours({'column': 3, 'row': 4}, {'column': 3, 'row': 4}) is False"
            },
            {
                "name": "Two apart is too far",
                "code": "assert are_neighbours({'column': 3, 'row': 4}, {'column': 5, 'row': 4}) is False"
            },
            {
                "name": "Opposite corners are certainly not",
                "code": "assert are_neighbours({'column': 0, 'row': 0}, {'column': 7, 'row': 7}) is False"
            },
            {
                "name": "Every square has the right number of neighbours",
                "code": "corner = sum(1 for r in range(GRID_SIZE) for c in range(GRID_SIZE)\n             if are_neighbours({'column': 0, 'row': 0}, {'column': c, 'row': r}))\nmiddle = sum(1 for r in range(GRID_SIZE) for c in range(GRID_SIZE)\n             if are_neighbours({'column': 4, 'row': 4}, {'column': c, 'row': r}))\nassert corner == 2, f'a corner has 2 neighbours, not {corner}'\nassert middle == 4, f'a middle square has 4 neighbours, not {middle}'"
            }
        ],
        "demo": {
            "kind": "shapes",
            "caption": "Move the cursor about — the note says whether the square to its right is a neighbour."
        }
    },
    {
        "id": "swap_gems",
        "fnName": "swap_gems",
        "title": "Trade places",
        "adds": "Shapes can be swapped.",
        "intro": "<p>Swapping two things needs somewhere to put the first one while you move the second. Here that is easy, because we are building a <strong>new board</strong> rather than editing the old one.</p><p>That is not just tidiness. The game needs to try a swap, look at what it would do, and then <em>undo</em> it if it makes no line. Handing back a copy means undoing costs nothing at all — you simply throw the copy away.</p>",
        "spec": {
            "input": "board, a, b — two squares",
            "output": "a NEW board with the two shapes exchanged",
            "algorithm": [
                "Copy the board.",
                "Work out both places with gem-index.",
                "In the copy, put the shape from the second place into the first, and the shape from the first into the second.",
                "Return the copy."
            ]
        },
        "starter": "def swap_gems(board, a, b):\n    # a copy, with the two shapes exchanged\n    pass\n",
        "answer": "def swap_gems(board, a, b):\n    copy = list(board)\n    first = gem_index(a[\"column\"], a[\"row\"])\n    second = gem_index(b[\"column\"], b[\"row\"])\n\n    copy[first] = board[second]\n    copy[second] = board[first]\n    return copy\n",
        "hints": [
            "list(board) copies a list.",
            "Read from the ORIGINAL board and write into the copy.",
            "copy[first] = board[second]"
        ],
        "tests": [
            {
                "name": "The two shapes change places",
                "code": "board = [i % SHAPE_COUNT for i in range(CELL_COUNT)]\nswapped = swap_gems(board, {'column': 0, 'row': 0}, {'column': 1, 'row': 0})\nassert swapped[gem_index(0, 0)] == board[gem_index(1, 0)]\nassert swapped[gem_index(1, 0)] == board[gem_index(0, 0)]"
            },
            {
                "name": "Nothing else moves",
                "code": "board = [i % SHAPE_COUNT for i in range(CELL_COUNT)]\nswapped = swap_gems(board, {'column': 0, 'row': 0}, {'column': 1, 'row': 0})\nassert swapped[2:] == board[2:]"
            },
            {
                "name": "The board you were given is left alone",
                "code": "board = [i % SHAPE_COUNT for i in range(CELL_COUNT)]\nbefore = list(board)\nswap_gems(board, {'column': 0, 'row': 0}, {'column': 1, 'row': 0})\nassert board == before, 'build a NEW board'"
            },
            {
                "name": "Swapping twice puts everything back",
                "code": "board = [i % SHAPE_COUNT for i in range(CELL_COUNT)]\na = {'column': 2, 'row': 3}\nb = {'column': 2, 'row': 4}\nassert swap_gems(swap_gems(board, a, b), a, b) == board"
            },
            {
                "name": "It works up and down as well as across",
                "code": "board = [i % SHAPE_COUNT for i in range(CELL_COUNT)]\nswapped = swap_gems(board, {'column': 3, 'row': 3}, {'column': 3, 'row': 4})\nassert swapped[gem_index(3, 3)] == board[gem_index(3, 4)]"
            },
            {
                "name": "The board is still the right size",
                "code": "board = [i % SHAPE_COUNT for i in range(CELL_COUNT)]\nassert len(swap_gems(board, {'column': 0, 'row': 0}, {'column': 1, 'row': 0})) == CELL_COUNT"
            }
        ],
        "demo": {
            "kind": "shapes",
            "caption": "Press Swap right and watch two shapes trade places."
        }
    },
    {
        "id": "find_matches",
        "fnName": "find_matches",
        "title": "Spot the lines",
        "adds": "The game can see a match.",
        "intro": "<p>The heart of the game: find every shape that is part of a line of three or more, across or down.</p><p>The trick is to keep a <strong>run</strong> as you walk along a row: how many of the same shape you have seen in a row so far. When the shape changes, the run has ended — and if it got to three or more, everything in it goes on the list.</p><p>Two things catch people out. The run that ends at the very <em>edge</em> of the board still counts, so you must check it after the loop. And a shape in the middle of a cross belongs to a row AND a column, so the same square would be listed twice — which is why the marks go into a set first.</p>",
        "spec": {
            "input": "board",
            "output": "a sorted list of the places to clear, with no repeats",
            "algorithm": [
                "Keep a set of marked places.",
                "For each row, build the list of places along it and scan it for runs.",
                "Do exactly the same for each column.",
                "A run of MIN_RUN or more means every place in it gets marked.",
                "Turn the set into a sorted list at the end."
            ]
        },
        "starter": "def find_matches(board):\n    marked = set()\n    # scan every row, then every column\n    return sorted(marked)\n",
        "answer": "def find_matches(board):\n    marked = set()\n\n    def mark_run(cells, start, length):\n        if length >= MIN_RUN:\n            marked.update(cells[start:start + length])\n\n    for row in range(GRID_SIZE):\n        scan_line(board, [gem_index(c, row) for c in range(GRID_SIZE)], mark_run)\n\n    for column in range(GRID_SIZE):\n        scan_line(board, [gem_index(column, r) for r in range(GRID_SIZE)], mark_run)\n\n    return sorted(marked)\n",
        "hints": [
            "scan_line(board, cells, mark_run) does the hard part.",
            "Build the list of places for a row, then for a column, and hand each to scan_line.",
            "A set never holds the same square twice, which is exactly what a cross needs."
        ],
        "tests": [
            {
                "name": "It returns a list",
                "code": "board = [(i % 3) + (i // GRID_SIZE % 2) * 3 for i in range(CELL_COUNT)]\nassert isinstance(find_matches(board), list)"
            },
            {
                "name": "A row of three is found",
                "code": "board = [i % 5 + 1 for i in range(CELL_COUNT)]\nfor c in (2, 3, 4):\n    board[gem_index(c, 3)] = 0\nfound = find_matches(board)\nassert all(gem_index(c, 3) in found for c in (2, 3, 4)), f'found {found}'"
            },
            {
                "name": "A column of three is found",
                "code": "board = [i % 5 + 1 for i in range(CELL_COUNT)]\nfor r in (1, 2, 3):\n    board[gem_index(2, r)] = 0\nassert gem_index(2, 2) in find_matches(board)"
            },
            {
                "name": "Two the same are NOT a match",
                "code": "board = [i % 5 + 1 for i in range(CELL_COUNT)]\nboard[gem_index(2, 3)] = 0\nboard[gem_index(3, 3)] = 0\nassert gem_index(2, 3) not in find_matches(board)"
            },
            {
                "name": "A run of four is all found",
                "code": "board = [i % 5 + 1 for i in range(CELL_COUNT)]\nfor c in range(1, 5):\n    board[gem_index(c, 2)] = 0\nfound = find_matches(board)\nassert all(gem_index(c, 2) in found for c in range(1, 5))"
            },
            {
                "name": "A match at the very edge still counts",
                "code": "board = [(i * 7) % 5 + 1 for i in range(CELL_COUNT)]\nfor c in (5, 6, 7):\n    board[gem_index(c, 0)] = 0\nassert gem_index(7, 0) in find_matches(board), 'did you check the last run after the loop?'"
            },
            {
                "name": "A square in a cross is only listed once",
                "code": "board = [(i * 7) % 5 + 1 for i in range(CELL_COUNT)]\nfor c in range(2, 5):\n    board[gem_index(c, 3)] = 0\nfor r in range(2, 5):\n    board[gem_index(3, r)] = 0\nfound = find_matches(board)\nassert found.count(gem_index(3, 3)) == 1"
            },
            {
                "name": "Empty squares never match each other",
                "code": "assert find_matches([EMPTY] * CELL_COUNT) == []"
            }
        ],
        "demo": {
            "kind": "matches",
            "caption": "Press Make a row or Make a column — the boxes show what the function found."
        },
        "warning": "Check the run that ends at the edge of the board. Miss it and a match against the right-hand or bottom wall is invisible to the game."
    },
    {
        "id": "apply_gravity",
        "fnName": "apply_gravity",
        "title": "Let them fall",
        "adds": "The board refills itself.",
        "intro": "<p>Shapes have vanished and there are holes. Everything above a hole slides down, and brand-new shapes drop in from the top.</p><p>Rather than moving shapes one square at a time, there is a much simpler way: take a column, read it from the BOTTOM upwards collecting whatever is still there, then write that pile straight back at the bottom. Whatever is left at the top gets a new random shape. One pass, no shuffling.</p>",
        "spec": {
            "input": "board",
            "output": "a NEW board with everything fallen and the gaps refilled",
            "algorithm": [
                "Copy the board to write into.",
                "For each column: read from the bottom row upwards, collecting the shapes that are not EMPTY.",
                "Write them back from the bottom up, in the order you collected them.",
                "Any place above the pile gets a random shape."
            ]
        },
        "starter": "def apply_gravity(board):\n    result = list(board)\n    # one column at a time: collect from the bottom, write back from the bottom\n    return result\n",
        "answer": "def apply_gravity(board):\n    result = list(board)\n\n    for column in range(GRID_SIZE):\n        kept = []\n        for row in range(GRID_SIZE - 1, -1, -1):\n            shape = board[gem_index(column, row)]\n            if shape != EMPTY:\n                kept.append(shape)\n\n        for row in range(GRID_SIZE - 1, -1, -1):\n            from_bottom = GRID_SIZE - 1 - row\n            result[gem_index(column, row)] = (kept[from_bottom]\n                                              if from_bottom < len(kept)\n                                              else random_shape())\n    return result\n",
        "hints": [
            "range(GRID_SIZE - 1, -1, -1) walks a column from the bottom upwards.",
            "GRID_SIZE - 1 - row tells you how far up from the bottom a row is.",
            "random_shape() gives you a new one for the gaps at the top."
        ],
        "tests": [
            {
                "name": "No holes means nothing moves",
                "code": "board = [i % SHAPE_COUNT for i in range(CELL_COUNT)]\nassert apply_gravity(board) == board"
            },
            {
                "name": "A shape falls into the hole below it",
                "code": "board = [1] * CELL_COUNT\nboard[gem_index(3, 2)] = 5\nboard[gem_index(3, 7)] = EMPTY\nfallen = apply_gravity(board)\nassert fallen[gem_index(3, 3)] == 5"
            },
            {
                "name": "The board comes back completely full",
                "code": "board = [i % SHAPE_COUNT for i in range(CELL_COUNT)]\nfor c in range(GRID_SIZE):\n    board[gem_index(c, 4)] = EMPTY\nassert EMPTY not in apply_gravity(board)"
            },
            {
                "name": "New shapes appear at the TOP, not the bottom",
                "code": "board = [1] * CELL_COUNT\nboard[gem_index(0, 7)] = EMPTY\nboard[gem_index(0, 6)] = 3\nfallen = apply_gravity(board)\nassert fallen[gem_index(0, 7)] == 3"
            },
            {
                "name": "An empty column fills up completely",
                "code": "board = [1] * CELL_COUNT\nfor r in range(GRID_SIZE):\n    board[gem_index(2, r)] = EMPTY\nfallen = apply_gravity(board)\nassert all(fallen[gem_index(2, r)] != EMPTY for r in range(GRID_SIZE))"
            },
            {
                "name": "The shapes stay in their own column",
                "code": "board = [1] * CELL_COUNT\nboard[gem_index(0, 0)] = 4\nboard[gem_index(0, 7)] = EMPTY\nfallen = apply_gravity(board)\nfours = sum(1 for r in range(GRID_SIZE) for c in range(1, GRID_SIZE)\n            if fallen[gem_index(c, r)] == 4)\nassert fours == 0, 'a shape must never slide sideways'"
            },
            {
                "name": "The board you were given is left alone",
                "code": "board = [1] * CELL_COUNT\nboard[gem_index(3, 7)] = EMPTY\napply_gravity(board)\nassert board[gem_index(3, 7)] == EMPTY"
            }
        ],
        "demo": {
            "kind": "matches",
            "caption": "Make a line, then press Let them fall and watch the board refill."
        }
    },
    {
        "id": "try_swap",
        "fnName": "try_swap",
        "title": "The move",
        "adds": "The whole game works!",
        "intro": "<p>Everything comes together. Swap the two shapes, look for a line — and if there is not one, <strong>put them straight back</strong>. That refusal is what makes the game a puzzle rather than a shuffling toy.</p><p>Putting them back costs nothing here, because swap-gems handed you a copy and the real board was never touched. That is the payoff for the decision you made two steps ago.</p>",
        "spec": {
            "input": "state, a, b — the two squares to exchange",
            "output": "True if the swap was allowed",
            "algorithm": [
                "Refuse if the game is over or paused, or if the two are not neighbours.",
                "Make the swapped board with swap-gems.",
                "If find-matches finds nothing, the move was not legal: count a bad swap and return False. The real board is untouched.",
                "Otherwise settle-board clears, drops and cascades — keep its board.",
                "Count the move, add up the shapes cleared, and remember the longest chain."
            ]
        },
        "starter": "def try_swap(state, a, b):\n    # swap, look for a line, and put them back if there is none\n    pass\n",
        "answer": "def try_swap(state, a, b):\n    if state[\"is_over\"] or state[\"is_paused\"] or not are_neighbours(a, b):\n        return False\n\n    swapped = swap_gems(state[\"board\"], a, b)\n    if not find_matches(swapped):\n        state[\"bad_swaps\"] += 1\n        return False\n\n    board, cleared, chains = settle_board(state, swapped)\n    state[\"board\"] = board\n    state[\"moves\"] += 1\n    state[\"cleared\"] += cleared\n    if chains > state[\"best_chain\"]:\n        state[\"best_chain\"] = chains\n    return True\n",
        "hints": [
            "Do the cheap checks first: over, paused, not neighbours.",
            "settle_board(state, board) is written for you and gives back three things.",
            "Only write to state['board'] once you know the swap was legal."
        ],
        "tests": [
            {
                "name": "A swap that makes no line is refused",
                "code": "state = create_game()\nbefore = list(state['board'])\nrefused = False\nfor row in range(GRID_SIZE):\n    for column in range(GRID_SIZE - 1):\n        a = {'column': column, 'row': row}\n        b = {'column': column + 1, 'row': row}\n        if not find_matches(swap_gems(state['board'], a, b)):\n            assert try_swap(state, a, b) is False\n            refused = True\n            break\n    if refused:\n        break\nassert refused, 'the test could not find a bad swap to try'\nassert state['board'] == before, 'a refused swap must leave the board as it was'"
            },
            {
                "name": "Two squares that are not neighbours are refused",
                "code": "state = create_game()\nassert try_swap(state, {'column': 0, 'row': 0}, {'column': 5, 'row': 5}) is False"
            },
            {
                "name": "A swap that makes a line is allowed",
                "code": "state = create_game()\ndone = False\nfor row in range(GRID_SIZE):\n    for column in range(GRID_SIZE - 1):\n        a = {'column': column, 'row': row}\n        b = {'column': column + 1, 'row': row}\n        if find_matches(swap_gems(state['board'], a, b)):\n            assert try_swap(state, a, b) is True\n            done = True\n            break\n    if done:\n        break\nassert done, 'every fresh board has at least one good swap in it'"
            },
            {
                "name": "A good swap scores",
                "code": "state = create_game()\ndone = False\nfor row in range(GRID_SIZE):\n    for column in range(GRID_SIZE - 1):\n        a = {'column': column, 'row': row}\n        b = {'column': column + 1, 'row': row}\n        if find_matches(swap_gems(state['board'], a, b)):\n            try_swap(state, a, b)\n            done = True\n            break\n    if done:\n        break\nassert state['score'] > 0 and state['moves'] == 1"
            },
            {
                "name": "A refused swap does not count as a move",
                "code": "state = create_game()\ntry_swap(state, {'column': 0, 'row': 0}, {'column': 5, 'row': 5})\nassert state['moves'] == 0"
            },
            {
                "name": "The board is always full after a move",
                "code": "state = create_game()\nfor _ in range(15):\n    for row in range(GRID_SIZE):\n        for column in range(GRID_SIZE - 1):\n            try_swap(state, {'column': column, 'row': row}, {'column': column + 1, 'row': row})\nassert EMPTY not in state['board']"
            },
            {
                "name": "No lines are left sitting on the board",
                "code": "state = create_game()\nfor row in range(GRID_SIZE):\n    for column in range(GRID_SIZE - 1):\n        try_swap(state, {'column': column, 'row': row}, {'column': column + 1, 'row': row})\nassert find_matches(state['board']) == []"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page. Move with the arrows, SPACE to pick a shape, then SPACE on its neighbour."
        },
        "warning": "Put the shapes back when the swap makes no line. Forget that and the board can be shuffled about for ever, and the puzzle disappears."
    }
];
