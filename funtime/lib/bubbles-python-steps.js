/* ============================================================
   bubbles-python-steps.js - the 5 steps of "Build Bubble Shooter in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const BUBBLES_PYTHON_STEPS = [
    {
        "id": "bubble_centre",
        "fnName": "bubble_centre",
        "title": "Where does a bubble sit?",
        "adds": "The ceiling of bubbles appears.",
        "intro": "<p>The bubbles live on a grid, but they are <em>circles</em> — and a circle is drawn from its middle, not its corner.</p><p>So this gives back the MIDDLE of a cell: step across and down as usual, then add half a cell. Forget that half and every bubble is drawn a quarter of a cell up and to the left of where it belongs, which looks subtly wrong in a way that is maddening to track down.</p>",
        "spec": {
            "input": "column, row",
            "output": "the middle of that cell: { x, y }",
            "algorithm": [
                "x is column × CELL, plus half a cell.",
                "y is row × CELL, plus half a cell."
            ]
        },
        "starter": "def bubble_centre(column, row):\n    return {\"x\": 0, \"y\": 0}\n",
        "answer": "def bubble_centre(column, row):\n    return {\"x\": column * CELL + CELL / 2, \"y\": row * CELL + CELL / 2}\n",
        "hints": [
            "column * CELL gets you to the left edge of the cell.",
            "Add CELL / 2 to get to the middle.",
            "{\"x\": column * CELL + CELL / 2, \"y\": row * CELL + CELL / 2}"
        ],
        "tests": [
            {
                "name": "The first cell's middle is half a cell in",
                "code": "c = bubble_centre(0, 0)\nassert c['x'] == CELL / 2 and c['y'] == CELL / 2"
            },
            {
                "name": "The next column is one cell across",
                "code": "assert bubble_centre(1, 0)['x'] - bubble_centre(0, 0)['x'] == CELL"
            },
            {
                "name": "The next row is one cell down",
                "code": "assert bubble_centre(0, 1)['y'] - bubble_centre(0, 0)['y'] == CELL"
            },
            {
                "name": "A cell in the middle of the grid",
                "code": "c = bubble_centre(3, 2)\nassert c['x'] == 3 * CELL + CELL / 2 and c['y'] == 2 * CELL + CELL / 2"
            },
            {
                "name": "Every bubble fits on the field",
                "code": "for row in range(ROWS):\n    for column in range(COLUMNS):\n        c = bubble_centre(column, row)\n        assert 0 <= c['x'] - BUBBLE_RADIUS and c['x'] + BUBBLE_RADIUS <= FIELD_WIDTH"
            },
            {
                "name": "It agrees with cell_at_pixel",
                "code": "for row in range(ROWS):\n    for column in range(COLUMNS):\n        c = bubble_centre(column, row)\n        assert cell_at_pixel(c['x'], c['y']) == (column, row)"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Move the dashed box around and read the middle of each cell."
        }
    },
    {
        "id": "turn_shooter",
        "fnName": "turn_shooter",
        "title": "Take aim",
        "adds": "The arrow swings.",
        "intro": "<p>Holding a key swings the aim round. That part is easy — the interesting part is the <strong>limits</strong>.</p><p>The shooter must never point flat sideways, and certainly never downwards. A shot fired exactly horizontally would bounce between the two walls for ever and the game would simply stop, waiting for a bubble that is never going to land.</p><p>Two lines of clamping turn an unplayable bug into a rule nobody notices.</p>",
        "spec": {
            "input": "state. change — -1 for left, 1 for right. seconds.",
            "output": "nothing; it changes state.angle",
            "algorithm": [
                "Work out the new angle: the old one plus change × TURN_SPEED × seconds.",
                "If it is below MIN_ANGLE, hold it at MIN_ANGLE.",
                "If it is above MAX_ANGLE, hold it at MAX_ANGLE.",
                "Save it back."
            ]
        },
        "starter": "def turn_shooter(state, change, seconds):\n    # swing the aim, but never past the limits\n    pass\n",
        "answer": "def turn_shooter(state, change, seconds):\n    angle = state[\"angle\"] + change * TURN_SPEED * seconds\n    state[\"angle\"] = max(MIN_ANGLE, min(MAX_ANGLE, angle))\n",
        "hints": [
            "Work the new angle out into a variable, then clamp it, then save it.",
            "max(MIN_ANGLE, min(MAX_ANGLE, angle)) does both limits in one line.",
            "The time has to be part of the sum."
        ],
        "tests": [
            {
                "name": "Turning right increases the angle",
                "code": "state = create_game()\nstate['angle'] = -math.pi / 2\nturn_shooter(state, 1, 0.1)\nassert state['angle'] > -math.pi / 2"
            },
            {
                "name": "Turning left decreases it",
                "code": "state = create_game()\nstate['angle'] = -math.pi / 2\nturn_shooter(state, -1, 0.1)\nassert state['angle'] < -math.pi / 2"
            },
            {
                "name": "Not turning changes nothing",
                "code": "state = create_game()\nstate['angle'] = -math.pi / 2\nturn_shooter(state, 0, 0.1)\nassert state['angle'] == -math.pi / 2"
            },
            {
                "name": "A longer frame turns further",
                "code": "slow = create_game()\nquick = create_game()\nslow['angle'] = quick['angle'] = -math.pi / 2\nturn_shooter(slow, 1, 0.1)\nturn_shooter(quick, 1, 0.2)\nassert quick['angle'] > slow['angle']"
            },
            {
                "name": "It stops at the left-hand limit",
                "code": "state = create_game()\nfor _ in range(200):\n    turn_shooter(state, -1, 0.05)\nassert abs(state['angle'] - MIN_ANGLE) < 0.0001"
            },
            {
                "name": "It stops at the right-hand limit",
                "code": "state = create_game()\nfor _ in range(200):\n    turn_shooter(state, 1, 0.05)\nassert abs(state['angle'] - MAX_ANGLE) < 0.0001"
            },
            {
                "name": "The aim can never point downwards",
                "code": "state = create_game()\nfor i in range(400):\n    turn_shooter(state, 1 if i % 2 == 0 else -1, 0.4)\n    assert math.sin(state['angle']) < 0, 'a shot fired downwards would never land'"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Aim left and right — the dashed line shows where the shot will go."
        },
        "warning": "Clamp the angle. Without limits a player can aim flat sideways, and that shot bounces between the walls until the end of time."
    },
    {
        "id": "same_group",
        "fnName": "same_group",
        "title": "Which ones are joined?",
        "adds": "The game can see a group.",
        "intro": "<p>You have met this before: it is <strong>flood fill</strong>, exactly as in Minesweeper. Start at one bubble, look at its neighbours, and keep spreading while they hold the same kind.</p><p>Two details make it work. Check <em>have I seen this one before?</em> inside the loop, or a group of three will chase itself round in circles for ever. And an empty cell has no group at all, so deal with that first — it is the case that reaches you when a shot lands somewhere unexpected.</p>",
        "spec": {
            "input": "grid, column, row",
            "output": "a list of the joined cells of the same kind, including the one you started from",
            "algorithm": [
                "Look at what kind is in the starting cell. If it is EMPTY, there is no group: return an empty list.",
                "Keep a set of the cells you have seen, a list for the answer, and a to-do list holding the first cell.",
                "While the to-do list is not empty: take one off; skip it if you have seen it or it holds a different kind; otherwise mark it, keep it, and add its neighbours to the to-do list."
            ]
        },
        "starter": "def same_group(grid, column, row):\n    # flood fill, but only through bubbles of the same kind\n    return []\n",
        "answer": "def same_group(grid, column, row):\n    kind = grid[bubble_index(column, row)]\n    if kind == EMPTY:\n        return []\n\n    seen = set()\n    group = []\n    todo = [(column, row)]\n\n    while todo:\n        c, r = todo.pop()\n        index = bubble_index(c, r)\n\n        if index in seen or grid[index] != kind:\n            continue\n        seen.add(index)\n        group.append((c, r))\n        todo.extend(neighbours(c, r))\n\n    return group\n",
        "hints": [
            "neighbours(column, row) is written for you and never leaves the grid.",
            "The 'have I seen this?' check goes INSIDE the loop.",
            "An empty starting cell returns an empty list, before anything else happens."
        ],
        "tests": [
            {
                "name": "A lone bubble is a group of one",
                "code": "grid = [EMPTY] * (COLUMNS * ROWS)\ngrid[bubble_index(3, 1)] = 2\nassert len(same_group(grid, 3, 1)) == 1"
            },
            {
                "name": "A row of three is one group",
                "code": "grid = [EMPTY] * (COLUMNS * ROWS)\nfor c in (1, 2, 3):\n    grid[bubble_index(c, 0)] = 1\nassert len(same_group(grid, 2, 0)) == 3"
            },
            {
                "name": "A column of three is one group too",
                "code": "grid = [EMPTY] * (COLUMNS * ROWS)\nfor r in (0, 1, 2):\n    grid[bubble_index(4, r)] = 3\nassert len(same_group(grid, 4, 1)) == 3"
            },
            {
                "name": "A different kind next door is NOT in the group",
                "code": "grid = [EMPTY] * (COLUMNS * ROWS)\ngrid[bubble_index(2, 0)] = 1\ngrid[bubble_index(3, 0)] = 4\nassert len(same_group(grid, 2, 0)) == 1"
            },
            {
                "name": "An empty cell has no group",
                "code": "grid = [EMPTY] * (COLUMNS * ROWS)\nassert same_group(grid, 4, 4) == []"
            },
            {
                "name": "A big blob is found whole",
                "code": "grid = [EMPTY] * (COLUMNS * ROWS)\nfor row in range(3):\n    for column in range(4):\n        grid[bubble_index(column, row)] = 2\nassert len(same_group(grid, 1, 1)) == 12"
            },
            {
                "name": "Starting anywhere in the group finds the same group",
                "code": "grid = [EMPTY] * (COLUMNS * ROWS)\nfor c in (1, 2, 3):\n    grid[bubble_index(c, 0)] = 1\nassert len(same_group(grid, 1, 0)) == len(same_group(grid, 3, 0))"
            },
            {
                "name": "Nothing appears twice",
                "code": "grid = [EMPTY] * (COLUMNS * ROWS)\nfor row in range(3):\n    for column in range(3):\n        grid[bubble_index(column, row)] = 0\ngroup = same_group(grid, 1, 1)\nassert len(group) == len(set(group))"
            }
        ],
        "demo": {
            "kind": "group",
            "caption": "Move the box onto a bubble — the outlines show everything joined to it."
        },
        "warning": "Check 'have I seen this cell?' inside the loop. Without it, two neighbouring bubbles put each other on the to-do list for ever."
    },
    {
        "id": "pop_group",
        "fnName": "pop_group",
        "title": "Pop!",
        "adds": "Bubbles burst.",
        "intro": "<p>The rule everybody knows: <strong>three or more</strong>. Two of a kind touching is not enough, and nothing at all happens.</p><p>That refusal is the game. If pairs popped, you could clear the board by firing at random.</p>",
        "spec": {
            "input": "state, group — the cells found by same-group",
            "output": "how many bubbles popped",
            "algorithm": [
                "If the group is smaller than MIN_POP, do nothing and return 0.",
                "Otherwise set every cell in the group to EMPTY.",
                "Score POINTS_PER_BUBBLE for each one, count them, and return how many."
            ]
        },
        "starter": "def pop_group(state, group):\n    # three or more, or nothing at all\n    pass\n",
        "answer": "def pop_group(state, group):\n    if len(group) < MIN_POP:\n        return 0\n    for column, row in group:\n        state[\"grid\"][bubble_index(column, row)] = EMPTY\n    state[\"score\"] += len(group) * POINTS_PER_BUBBLE\n    state[\"popped\"] += len(group)\n    return len(group)\n",
        "hints": [
            "The guard comes first: too small, return 0, and change nothing at all.",
            "EMPTY is what an empty cell holds.",
            "Score for every bubble in the group, not just one."
        ],
        "tests": [
            {
                "name": "Three pop",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nfor c in (1, 2, 3):\n    state['grid'][bubble_index(c, 0)] = 1\nassert pop_group(state, same_group(state['grid'], 2, 0)) == 3"
            },
            {
                "name": "The cells really are emptied",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nfor c in (1, 2, 3):\n    state['grid'][bubble_index(c, 0)] = 1\npop_group(state, same_group(state['grid'], 2, 0))\nassert state['grid'][bubble_index(2, 0)] == EMPTY"
            },
            {
                "name": "Two do NOT pop",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nfor c in (1, 2):\n    state['grid'][bubble_index(c, 0)] = 1\nassert pop_group(state, same_group(state['grid'], 1, 0)) == 0"
            },
            {
                "name": "A pair is left exactly where it was",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nfor c in (1, 2):\n    state['grid'][bubble_index(c, 0)] = 1\npop_group(state, same_group(state['grid'], 1, 0))\nassert state['grid'][bubble_index(1, 0)] == 1"
            },
            {
                "name": "Popping scores",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nstate['score'] = 0\nfor c in (1, 2, 3):\n    state['grid'][bubble_index(c, 0)] = 1\npop_group(state, same_group(state['grid'], 2, 0))\nassert state['score'] == 3 * POINTS_PER_BUBBLE"
            },
            {
                "name": "A bigger group scores more",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nstate['score'] = 0\nfor c in range(6):\n    state['grid'][bubble_index(c, 0)] = 1\npop_group(state, same_group(state['grid'], 2, 0))\nassert state['score'] == 6 * POINTS_PER_BUBBLE"
            },
            {
                "name": "An empty group does nothing",
                "code": "state = create_game()\nbefore = state['score']\nassert pop_group(state, []) == 0\nassert state['score'] == before"
            }
        ],
        "demo": {
            "kind": "drop",
            "caption": "Press Pop the group and watch the three at the top left burst."
        }
    },
    {
        "id": "drop_floaters",
        "fnName": "drop_floaters",
        "title": "Cut them loose",
        "adds": "The whole game works!",
        "intro": "<p>The most satisfying rule in the game, and the cleverest one.</p><p>It is the <em>same search again</em>, asked a completely different question. Instead of \"which bubbles of the same kind are joined to this one?\", ask <strong>\"which bubbles are joined to the ceiling?\"</strong> — starting from the whole top row, and ignoring what kind they are.</p><p>Whatever the search never reaches must be dangling in mid-air. Down it all comes, and each one is worth more than a popped bubble, because knocking out a whole cluster with one shot deserves it.</p>",
        "spec": {
            "input": "state",
            "output": "how many bubbles fell",
            "algorithm": [
                "Start a to-do list holding every bubble in the TOP row.",
                "Spread out through the neighbours exactly as before, but do not care what kind they are. Mark everything you reach as HELD.",
                "Then look at every cell: anything that holds a bubble but was never marked is floating.",
                "Empty those, score POINTS_PER_DROP for each, and return how many fell."
            ]
        },
        "starter": "def drop_floaters(state):\n    # what is joined to the ceiling stays; everything else falls\n    pass\n",
        "answer": "def drop_floaters(state):\n    held = set()\n    todo = [(column, 0) for column in range(COLUMNS)\n            if state[\"grid\"][bubble_index(column, 0)] != EMPTY]\n\n    while todo:\n        c, r = todo.pop()\n        index = bubble_index(c, r)\n\n        if index in held or state[\"grid\"][index] == EMPTY:\n            continue\n        held.add(index)\n        todo.extend(neighbours(c, r))\n\n    fell = 0\n    for i, kind in enumerate(state[\"grid\"]):\n        if kind != EMPTY and i not in held:\n            state[\"grid\"][i] = EMPTY\n            fell += 1\n\n    if fell:\n        state[\"score\"] += fell * POINTS_PER_DROP\n        state[\"dropped\"] += fell\n    return fell\n",
        "hints": [
            "Start the to-do list with EVERY bubble in row 0, not just one.",
            "This search ignores the kind - any bubble at all keeps the search going.",
            "Do the dropping in a second pass, after the search has finished."
        ],
        "tests": [
            {
                "name": "A bubble on the ceiling stays",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nstate['grid'][bubble_index(0, 0)] = 1\nassert drop_floaters(state) == 0\nassert state['grid'][bubble_index(0, 0)] == 1"
            },
            {
                "name": "A bubble floating in mid-air falls",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nstate['grid'][bubble_index(5, 5)] = 2\nassert drop_floaters(state) == 1\nassert state['grid'][bubble_index(5, 5)] == EMPTY"
            },
            {
                "name": "A chain hanging from the ceiling stays",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nfor row in range(5):\n    state['grid'][bubble_index(3, row)] = 1\nassert drop_floaters(state) == 0"
            },
            {
                "name": "Different kinds still hold each other up",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nstate['grid'][bubble_index(3, 0)] = 0\nstate['grid'][bubble_index(3, 1)] = 4\nassert drop_floaters(state) == 0, 'this search ignores the kind'"
            },
            {
                "name": "Cutting the thread brings the whole cluster down",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nstate['grid'][bubble_index(6, 0)] = 1\nstate['grid'][bubble_index(6, 1)] = 2\nfor c in (5, 6, 7):\n    state['grid'][bubble_index(c, 2)] = 2\nassert drop_floaters(state) == 0\nstate['grid'][bubble_index(6, 1)] = EMPTY\nassert drop_floaters(state) == 3"
            },
            {
                "name": "Falling scores",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nstate['score'] = 0\nstate['grid'][bubble_index(5, 5)] = 2\nstate['grid'][bubble_index(6, 5)] = 2\ndrop_floaters(state)\nassert state['score'] == 2 * POINTS_PER_DROP"
            },
            {
                "name": "An empty board drops nothing",
                "code": "state = create_game()\nstate['grid'] = [EMPTY] * (COLUMNS * ROWS)\nassert drop_floaters(state) == 0"
            },
            {
                "name": "A full ceiling never falls",
                "code": "assert drop_floaters(create_game()) == 0"
            }
        ],
        "demo": {
            "kind": "drop",
            "caption": "Press Cut the thread, then Let them fall — the whole cluster on the right drops."
        },
        "warning": "Start from EVERY bubble in the top row. Start from just one and everything hanging from a different part of the ceiling is wrongly thrown away."
    }
];
