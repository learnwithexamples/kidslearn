/* ============================================================
   snake-python-steps.js - the twelve steps of "Build Snake in Python"

   The same twelve functions as the JavaScript workshop, written in Python -
   and each step points out where Python says the idea more neatly.

   Every test is a few lines of real Python ending in an `assert`. When a test
   fails, the message you see is the message the assert prints, so learning to
   read it is learning to read Python.
   ============================================================ */

const SNAKE_PYTHON_STEPS = [
    {
        "id": "create_starting_snake",
        "fnName": "create_starting_snake",
        "title": "Put a snake on the field",
        "adds": "The snake appears.",
        "intro": "<p>The field is 20 squares across and 20 down. In Python a square is a <strong>tuple</strong> of two numbers:</p><pre class=\"mini-code\">(3, 7)     x = column (0 is the left wall)\n           y = row    (0 is the TOP row)</pre><p>And the big idea of the whole game: <strong>a snake is just a list of squares</strong>, head first.</p>",
        "spec": {
            "input": "nothing",
            "output": "A list of three tuples, head first. The head is in the middle of the grid and the other two are to its LEFT.",
            "algorithm": [
                "Find the middle column: GRID_WIDTH // 2 (// is whole-number divide).",
                "Find the middle row the same way with GRID_HEIGHT.",
                "Return a list of three tuples: the middle square, then one to its left, then one more."
            ]
        },
        "starter": "def create_starting_snake():\n    # the middle of the grid, plus two squares trailing to the left\n    pass\n",
        "answer": "def create_starting_snake():\n    middle_x = GRID_WIDTH // 2\n    middle_y = GRID_HEIGHT // 2\n    return [\n        (middle_x, middle_y),\n        (middle_x - 1, middle_y),\n        (middle_x - 2, middle_y),\n    ]\n",
        "hints": [
            "20 // 2 is 10 - that is the middle of a 20-wide grid.",
            "All three squares share the same y; only the x changes.",
            "Return a LIST of three TUPLES: [(x, y), (x - 1, y), (x - 2, y)]."
        ],
        "tests": [
            {
                "name": "The snake is three squares long",
                "code": "snake = create_starting_snake()\nassert isinstance(snake, list), f'expected a list, got {type(snake).__name__}'\nassert len(snake) == 3, f'expected 3 squares, got {len(snake)}'"
            },
            {
                "name": "The head is in the middle of the grid",
                "code": "head = create_starting_snake()[0]\nassert head == (10, 10), f'the head is at {head}, expected (10, 10)'"
            },
            {
                "name": "The body trails to the LEFT of the head",
                "code": "snake = create_starting_snake()\nassert snake[1] == (9, 10), f'the second square is {snake[1]}, expected (9, 10)'\nassert snake[2] == (8, 10), f'the third square is {snake[2]}, expected (8, 10)'"
            },
            {
                "name": "Every square is a tuple of two numbers",
                "code": "for square in create_starting_snake():\n    assert isinstance(square, tuple) and len(square) == 2, f'{square!r} is not a (x, y) tuple'"
            },
            {
                "name": "The whole snake is on the field",
                "code": "for square in create_starting_snake():\n    assert is_inside_grid(square), f'{square} is off the grid'"
            }
        ],
        "demo": {
            "kind": "still",
            "caption": "Your snake, drawn by Python on a 20 x 20 field."
        },
        "warning": "The head must be FIRST in the list. Everything else - moving, growing, the eyes - expects snake[0] to be the head."
    },
    {
        "id": "same_position",
        "fnName": "same_position",
        "title": "Are these two squares the same?",
        "adds": "The game can tell when the head reaches the apple.",
        "intro": "<p>Here is the first place Python does something JavaScript could not. Over there, two objects that both said <code>{x: 3, y: 7}</code> were <em>not</em> equal, so the check needed four comparisons.</p><p>Python tuples compare by <strong>value</strong>:</p><pre class=\"mini-code\">(3, 7) == (3, 7)     # True. That is the whole function.</pre>",
        "spec": {
            "input": "a, b - two positions",
            "output": "True if they are the same square",
            "algorithm": [
                "Compare the two tuples with ==.",
                "Return that answer - no if statement needed."
            ]
        },
        "starter": "def same_position(a, b):\n    # tuples compare by value in Python\n    pass\n",
        "answer": "def same_position(a, b):\n    return a == b\n",
        "hints": [
            "The whole function is one line starting with return.",
            "You do not need to look inside the tuples at all.",
            "return a == b"
        ],
        "tests": [
            {
                "name": "The same square is the same square",
                "code": "got = same_position((3, 7), (3, 7))\nassert got is True, f'same_position((3,7), (3,7)) gave {got!r}, expected True'"
            },
            {
                "name": "A different column is not",
                "code": "got = same_position((3, 7), (4, 7))\nassert got is False, f'gave {got!r}, expected False'"
            },
            {
                "name": "A different row is not either",
                "code": "got = same_position((3, 7), (3, 8))\nassert got is False, f'gave {got!r}, expected False'"
            },
            {
                "name": "Swapped numbers are not the same square",
                "code": "assert same_position((3, 7), (7, 3)) is False"
            },
            {
                "name": "The corner square works",
                "code": "assert same_position((0, 0), (0, 0)) is True"
            },
            {
                "name": "It answers True or False, not something else",
                "code": "got = same_position((1, 1), (1, 1))\nassert got is True, f'gave {got!r} - use == so you get a real True'"
            }
        ],
        "demo": {
            "kind": "compare",
            "caption": "Move the head onto the apple and watch your function answer True."
        }
    },
    {
        "id": "add_direction",
        "fnName": "add_direction",
        "title": "Take one step",
        "adds": "The head can move one square in any direction.",
        "intro": "<p>A direction is a small step, also a tuple:</p><pre class=\"mini-code\">DIRECTIONS[\"right\"] = ( 1,  0)\nDIRECTIONS[\"left\"]  = (-1,  0)\nDIRECTIONS[\"up\"]    = ( 0, -1)   # up is MINUS one\nDIRECTIONS[\"down\"]  = ( 0,  1)</pre><p>Up is <code>-1</code> because row 0 is at the top of the screen.</p>",
        "spec": {
            "input": "position - where you are. direction - the step to take.",
            "output": "a NEW tuple, one square along",
            "algorithm": [
                "Add the two x values: position[0] + direction[0].",
                "Add the two y values: position[1] + direction[1].",
                "Return them as a tuple."
            ]
        },
        "starter": "def add_direction(position, direction):\n    # return a NEW (x, y) one step along\n    pass\n",
        "answer": "def add_direction(position, direction):\n    return (position[0] + direction[0], position[1] + direction[1])\n",
        "hints": [
            "position[0] is the x, position[1] is the y.",
            "Build the answer straight inside the return: return (x_part, y_part)",
            "You can also unpack first: x, y = position - some people find that easier to read."
        ],
        "tests": [
            {
                "name": "Stepping right adds 1 to x",
                "code": "got = add_direction((5, 5), (1, 0))\nassert got == (6, 5), f'gave {got}, expected (6, 5)'"
            },
            {
                "name": "Stepping left takes 1 off x",
                "code": "got = add_direction((5, 5), (-1, 0))\nassert got == (4, 5), f'gave {got}, expected (4, 5)'"
            },
            {
                "name": "Stepping up takes 1 off y",
                "code": "got = add_direction((5, 5), (0, -1))\nassert got == (5, 4), f'gave {got}, expected (5, 4)'"
            },
            {
                "name": "Stepping down adds 1 to y",
                "code": "got = add_direction((5, 5), (0, 1))\nassert got == (5, 6), f'gave {got}, expected (5, 6)'"
            },
            {
                "name": "It works from the corner too",
                "code": "assert add_direction((0, 0), (0, -1)) == (0, -1)"
            },
            {
                "name": "It works with the real DIRECTIONS",
                "code": "assert add_direction((10, 10), DIRECTIONS['up']) == (10, 9)"
            },
            {
                "name": "It gives back a tuple, not a list",
                "code": "got = add_direction((1, 1), (1, 1))\nassert isinstance(got, tuple), f'gave a {type(got).__name__}, the rest of the game expects a tuple'"
            }
        ],
        "demo": {
            "kind": "head",
            "caption": "Steer the head with the buttons. Nothing stops it yet - the walls come in step 5!"
        }
    },
    {
        "id": "move_snake",
        "fnName": "move_snake",
        "title": "Make the snake crawl",
        "adds": "The snake slithers around the field.",
        "intro": "<p>The trick at the heart of Snake: <strong>the snake does not really move</strong>. You add a new head at the front and drop the tail off the back.</p><pre class=\"mini-code\">before:  [head] [body] [tail]\nafter:   [NEW ] [head] [body]     # tail dropped</pre><p>Growing is the same, except you keep the tail. In Python you can glue lists together with <code>+</code>, and <code>.pop()</code> takes the last item off.</p>",
        "spec": {
            "input": "snake - the list. new_head - where the head is going. grow - True if it just ate.",
            "output": "a NEW list of positions",
            "algorithm": [
                "Build a new list: [new_head] + snake.",
                "If grow is not True, remove the last square with .pop().",
                "Return the new list."
            ]
        },
        "starter": "def move_snake(snake, new_head, grow):\n    # add a head; drop the tail unless the snake is growing\n    pass\n",
        "answer": "def move_snake(snake, new_head, grow):\n    moved = [new_head] + snake\n    if not grow:\n        moved.pop()\n    return moved\n",
        "hints": [
            "[new_head] + snake makes a new list with the head on the front.",
            "`if not grow:` is how Python says \"if grow is false\".",
            "moved.pop() removes the last item - the tail."
        ],
        "tests": [
            {
                "name": "The new head goes on the front",
                "code": "out = move_snake([(2, 0), (1, 0), (0, 0)], (3, 0), False)\nassert out[0] == (3, 0), f'the first square is {out[0]}, expected (3, 0)'"
            },
            {
                "name": "Walking keeps the same length",
                "code": "out = move_snake([(2, 0), (1, 0), (0, 0)], (3, 0), False)\nassert out == [(3, 0), (2, 0), (1, 0)], f'gave {out}'"
            },
            {
                "name": "Growing makes it one square longer",
                "code": "out = move_snake([(2, 0), (1, 0), (0, 0)], (3, 0), True)\nassert out == [(3, 0), (2, 0), (1, 0), (0, 0)], f'gave {out}'"
            },
            {
                "name": "A one-square snake still works",
                "code": "assert move_snake([(5, 5)], (6, 5), False) == [(6, 5)]"
            },
            {
                "name": "The old snake is not damaged",
                "code": "snake = [(2, 0), (1, 0)]\nmove_snake(snake, (3, 0), False)\nassert len(snake) == 2, f'the snake you were given is now {len(snake)} long'"
            },
            {
                "name": "It returns a new list, not the old one",
                "code": "snake = [(2, 0), (1, 0)]\nassert move_snake(snake, (3, 0), False) is not snake, 'you returned the same list'"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {},
            "caption": "It crawls! No walls yet, so it wraps around the edges for now."
        }
    },
    {
        "id": "is_inside_grid",
        "fnName": "is_inside_grid",
        "title": "Build the walls",
        "adds": "Leaving the field is fatal.",
        "intro": "<p>The field is <code>GRID_WIDTH</code> by <code>GRID_HEIGHT</code> - 20 each - so the columns run 0 to 19 and so do the rows.</p><p>Python has a lovely way to say this: you can <strong>chain</strong> comparisons, so <code>0 &lt;= x &lt; GRID_WIDTH</code> reads exactly like it does in maths.</p>",
        "spec": {
            "input": "position - a position",
            "output": "True if the square is on the field",
            "algorithm": [
                "x must be at least 0 and less than GRID_WIDTH.",
                "y must be at least 0 and less than GRID_HEIGHT.",
                "Return True only when both are true."
            ]
        },
        "starter": "def is_inside_grid(position):\n    # 0 <= x < GRID_WIDTH, and the same for y\n    pass\n",
        "answer": "def is_inside_grid(position):\n    x, y = position\n    return 0 <= x < GRID_WIDTH and 0 <= y < GRID_HEIGHT\n",
        "hints": [
            "x, y = position unpacks the tuple into two names.",
            "0 <= x < GRID_WIDTH is Python for \"x is at least 0 AND less than GRID_WIDTH\".",
            "Join the two halves with `and`."
        ],
        "tests": [
            {
                "name": "The middle of the field is inside",
                "code": "assert is_inside_grid((10, 10)) is True"
            },
            {
                "name": "The top-left corner is inside",
                "code": "assert is_inside_grid((0, 0)) is True"
            },
            {
                "name": "The bottom-right corner is inside",
                "code": "assert is_inside_grid((19, 19)) is True"
            },
            {
                "name": "Through the left wall is outside",
                "code": "got = is_inside_grid((-1, 5))\nassert got is False, f'gave {got!r} for (-1, 5)'"
            },
            {
                "name": "Through the right wall is outside",
                "code": "got = is_inside_grid((20, 5))\nassert got is False, f'gave {got!r} for (20, 5) - column 19 is the last one INSIDE'"
            },
            {
                "name": "Above the top is outside",
                "code": "assert is_inside_grid((5, -1)) is False"
            },
            {
                "name": "Below the bottom is outside",
                "code": "assert is_inside_grid((5, 20)) is False"
            },
            {
                "name": "A long way out is outside",
                "code": "assert is_inside_grid((99, 99)) is False"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "walls": true
            },
            "caption": "Crash into a wall on purpose - your function is the wall."
        },
        "warning": "Watch the last square! The grid is 20 wide, so column 19 is the last one inside and column 20 is already through the wall - which is why it is < and not <=."
    },
    {
        "id": "contains_position",
        "fnName": "contains_position",
        "title": "Do not bite yourself",
        "adds": "Running into your own body ends the game.",
        "intro": "<p>The other way to die is to bite yourself, so the game asks: is this square anywhere in that list?</p><p>JavaScript had to write the loop. Python has a word for it: <code>in</code>. And because tuples compare by value, it finds the square you mean.</p>",
        "spec": {
            "input": "items - a list of positions. position - one square.",
            "output": "True if the list holds that square",
            "algorithm": [
                "Use Python's `in`: position in items.",
                "Return that answer."
            ]
        },
        "starter": "def contains_position(items, position):\n    # Python has a word for this\n    pass\n",
        "answer": "def contains_position(items, position):\n    return position in items\n",
        "hints": [
            "The whole function is one line.",
            "`x in my_list` is True when the list holds something equal to x.",
            "return position in items"
        ],
        "tests": [
            {
                "name": "It finds a square that is there",
                "code": "got = contains_position([(1, 1), (2, 2)], (2, 2))\nassert got is True, f'gave {got!r}'"
            },
            {
                "name": "It finds the first square",
                "code": "assert contains_position([(1, 1), (2, 2)], (1, 1)) is True"
            },
            {
                "name": "It says False for a square that is missing",
                "code": "got = contains_position([(1, 1), (2, 2)], (3, 3))\nassert got is False, f'gave {got!r}'"
            },
            {
                "name": "An empty list holds nothing",
                "code": "assert contains_position([], (0, 0)) is False"
            },
            {
                "name": "It compares values, not objects",
                "code": "snake = [(4, 4)]\nsomewhere_else = (4, 4)\nassert contains_position(snake, somewhere_else) is True"
            },
            {
                "name": "It works on a long snake",
                "code": "snake = [(i, 3) for i in range(50)]\nassert contains_position(snake, (49, 3)) is True\nassert contains_position(snake, (49, 4)) is False"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "walls": true,
                "self": true
            },
            "caption": "Turn back on yourself and the game ends. (Step 8 stops you doing it by accident.)"
        }
    },
    {
        "id": "random_empty_cell",
        "fnName": "random_empty_cell",
        "title": "Drop the apples",
        "adds": "Apples appear - and the snake grows.",
        "intro": "<p>Every apple must land on a free square: never under the snake, never outside the field.</p><p>Guessing squares at random until one is free gets slower and slower as the snake grows, and never finishes at all on a full board. So list the free squares first - <code>empty_cells(occupied)</code> already does that - and let <code>random.choice</code> pick one.</p>",
        "spec": {
            "input": "occupied - a list of positions (the snake)",
            "output": "one free position, or None when the board is full",
            "algorithm": [
                "Ask empty_cells(occupied) for the free squares.",
                "If the list is empty, return None - the player has filled the board!",
                "Otherwise return random.choice(free)."
            ]
        },
        "starter": "def random_empty_cell(occupied):\n    free = empty_cells(occupied)\n    # no free squares? return None. Otherwise pick one at random.\n    pass\n",
        "answer": "def random_empty_cell(occupied):\n    free = empty_cells(occupied)\n    if not free:\n        return None\n    return random.choice(free)\n",
        "hints": [
            "`if not free:` is Python for \"if the list is empty\".",
            "random.choice(free) picks one item from a list for you - random is already imported.",
            "Return the square itself, not its position in the list."
        ],
        "tests": [
            {
                "name": "It gives back a real square",
                "code": "cell = random_empty_cell(create_starting_snake())\nassert cell is not None, 'it returned None on an almost empty board'\nassert isinstance(cell, tuple), f'gave a {type(cell).__name__}'"
            },
            {
                "name": "The square is always on the field",
                "code": "snake = create_starting_snake()\nfor _ in range(100):\n    cell = random_empty_cell(snake)\n    assert is_inside_grid(cell), f'{cell} is off the grid'"
            },
            {
                "name": "It never lands on the snake (100 tries)",
                "code": "snake = create_starting_snake()\nfor _ in range(100):\n    cell = random_empty_cell(snake)\n    assert not contains_position(snake, cell), f'it put the apple on the snake at {cell}'"
            },
            {
                "name": "With one free square, it finds that square",
                "code": "everywhere = [(x, y) for y in range(GRID_HEIGHT) for x in range(GRID_WIDTH) if (x, y) != (7, 12)]\ngot = random_empty_cell(everywhere)\nassert got == (7, 12), f'gave {got}, expected (7, 12)'"
            },
            {
                "name": "A completely full board gives None",
                "code": "everywhere = [(x, y) for y in range(GRID_HEIGHT) for x in range(GRID_WIDTH)]\ngot = random_empty_cell(everywhere)\nassert got is None, f'gave {got!r} - this must be None, or the game can never be won'"
            },
            {
                "name": "It really is random",
                "code": "snake = create_starting_snake()\nseen = {random_empty_cell(snake) for _ in range(60)}\nassert len(seen) > 5, f'in 60 tries it only picked {len(seen)} different square(s)'"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "walls": true,
                "self": true,
                "eat": true
            },
            "caption": "Steer onto an apple: the snake grows and a new apple appears somewhere free."
        }
    },
    {
        "id": "is_opposite_direction",
        "fnName": "is_opposite_direction",
        "title": "No U-turns",
        "adds": "The snake can no longer turn back into its own neck.",
        "intro": "<p>Try it in the demo: while the snake heads right, press left. It eats itself instantly, because its neck is right there.</p><p>Two directions are opposites when they cancel out: add them and both answers are 0.</p>",
        "spec": {
            "input": "a, b - two directions",
            "output": "True for up/down or left/right, False for anything else",
            "algorithm": [
                "Add the two x values.",
                "Add the two y values.",
                "Return True only if BOTH sums are 0."
            ]
        },
        "starter": "def is_opposite_direction(a, b):\n    # opposite steps cancel out: both sums are zero\n    pass\n",
        "answer": "def is_opposite_direction(a, b):\n    return a[0] + b[0] == 0 and a[1] + b[1] == 0\n",
        "hints": [
            "One line, like same_position - but with + instead of ==.",
            "a[0] + b[0] == 0 checks the sideways halves cancel out.",
            "Join the two checks with `and`."
        ],
        "tests": [
            {
                "name": "Up and down are opposites",
                "code": "assert is_opposite_direction((0, -1), (0, 1)) is True"
            },
            {
                "name": "Left and right are opposites",
                "code": "assert is_opposite_direction((-1, 0), (1, 0)) is True"
            },
            {
                "name": "It works the other way round too",
                "code": "assert is_opposite_direction((1, 0), (-1, 0)) is True"
            },
            {
                "name": "Up and left are not opposites",
                "code": "got = is_opposite_direction((0, -1), (-1, 0))\nassert got is False, f'gave {got!r}'"
            },
            {
                "name": "The same direction is not its own opposite",
                "code": "got = is_opposite_direction((0, -1), (0, -1))\nassert got is False, f'gave {got!r}'"
            },
            {
                "name": "It works on the real DIRECTIONS",
                "code": "assert is_opposite_direction(DIRECTIONS['up'], DIRECTIONS['down']) is True\nassert is_opposite_direction(DIRECTIONS['up'], DIRECTIONS['right']) is False"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "walls": true,
                "self": true,
                "eat": true,
                "noReverse": true
            },
            "caption": "Now try turning back on yourself - the game politely ignores you."
        }
    },
    {
        "id": "step_game",
        "fnName": "step_game",
        "title": "One whole turn of the game",
        "adds": "Every piece you have written now works together.",
        "intro": "<p>The boss step. Everything so far - stepping, walls, biting, apples - comes together in one function that plays a single turn.</p><p>It changes the state dictionary rather than returning something. The keys you need are <code>snake</code>, <code>direction</code>, <code>turns</code>, <code>food</code>, <code>score</code>, <code>eaten</code>, <code>level</code>, <code>is_over</code> and <code>is_won</code>.</p>",
        "spec": {
            "input": "state - the game dictionary",
            "output": "nothing; it changes the state",
            "algorithm": [
                "If state[\"is_over\"] or state[\"is_paused\"], do nothing at all.",
                "If state[\"turns\"] has a turn waiting, pop(0) it and make it the new direction.",
                "head = add_direction(state[\"snake\"][0], state[\"direction\"]).",
                "body_that_stays = state[\"snake\"][:-1] - the last square moves away this turn, so it does not count.",
                "If the head is not inside the grid, or the staying body contains it: state[\"is_over\"] = True and return.",
                "eating = the food is not None and same_position(head, state[\"food\"]).",
                "state[\"snake\"] = move_snake(state[\"snake\"], head, eating).",
                "If eating: add 1 to eaten, add score_for_food(level) to score, set level = level_for_food(eaten), and put the next apple at random_empty_cell(state[\"snake\"]). If that is None, set is_won and is_over to True."
            ]
        },
        "starter": "def step_game(state):\n    # 1. nothing to do if the game is over or paused\n    # 2. take the next turn the player asked for\n    # 3. work out the new head square\n    # 4. wall or body? then the game is over\n    # 5. is the head landing on the apple?\n    # 6. move the snake (growing only if it ate)\n    # 7. if it ate: count it, score it, level up, new apple\n    pass\n",
        "answer": "def step_game(state):\n    if state[\"is_over\"] or state[\"is_paused\"]:\n        return\n\n    if state[\"turns\"]:\n        state[\"direction\"] = state[\"turns\"].pop(0)\n\n    head = add_direction(state[\"snake\"][0], state[\"direction\"])\n    body_that_stays = state[\"snake\"][:-1]\n\n    if not is_inside_grid(head) or contains_position(body_that_stays, head):\n        state[\"is_over\"] = True\n        return\n\n    eating = state[\"food\"] is not None and same_position(head, state[\"food\"])\n    state[\"snake\"] = move_snake(state[\"snake\"], head, eating)\n\n    if eating:\n        state[\"eaten\"] += 1\n        state[\"score\"] += score_for_food(state[\"level\"])\n        state[\"level\"] = level_for_food(state[\"eaten\"])\n        state[\"food\"] = random_empty_cell(state[\"snake\"])\n        if state[\"food\"] is None:\n            state[\"is_won\"] = True\n            state[\"is_over\"] = True\n",
        "hints": [
            "Build it a line at a time and press Test after each - the messages tell you what is still missing.",
            "state[\"snake\"][:-1] is \"everything except the last square\" - Python slicing at its best.",
            "Do not forget to store the new snake back: state[\"snake\"] = move_snake(...)"
        ],
        "tests": [
            {
                "name": "The snake moves one square forward",
                "code": "state = create_game()\nstate['food'] = (0, 0)\nstart_x = state['snake'][0][0]\nstep_game(state)\nassert state['snake'][0][0] == start_x + 1, f\"head is at {state['snake'][0]}\"\nassert len(state['snake']) == 3"
            },
            {
                "name": "A waiting turn is taken",
                "code": "state = create_game()\nstate['food'] = (0, 0)\nstate['turns'] = [DIRECTIONS['up']]\nstep_game(state)\nassert state['direction'] == DIRECTIONS['up'], f\"direction is {state['direction']}\"\nassert state['turns'] == []"
            },
            {
                "name": "Hitting a wall ends the game",
                "code": "state = create_game()\nstate['food'] = (0, 0)\nstate['snake'] = [(19, 10), (18, 10), (17, 10)]\nstep_game(state)\nassert state['is_over'] is True, 'the snake went through the wall'"
            },
            {
                "name": "Biting your own body ends the game",
                "code": "state = create_game()\nstate['food'] = (0, 0)\nstate['snake'] = [(5, 5), (4, 5), (4, 4), (5, 4), (6, 4), (6, 5)]\nstate['direction'] = DIRECTIONS['up']\nstep_game(state)\nassert state['is_over'] is True, 'the head went into its own body and survived'"
            },
            {
                "name": "The square the tail is leaving is safe",
                "code": "state = create_game()\nstate['food'] = (0, 0)\nstate['snake'] = [(5, 5), (5, 4), (6, 4), (6, 5)]\nstate['direction'] = DIRECTIONS['right']\nstep_game(state)\nassert state['is_over'] is False, 'the tail moves out of the way, so this must not be a crash'"
            },
            {
                "name": "Eating grows the snake",
                "code": "state = create_game()\nstate['snake'] = [(5, 5), (4, 5), (3, 5)]\nstate['direction'] = DIRECTIONS['right']\nstate['food'] = (6, 5)\nstep_game(state)\nassert len(state['snake']) == 4, f\"the snake is {len(state['snake'])} long, expected 4\""
            },
            {
                "name": "Eating scores points and counts the apple",
                "code": "state = create_game()\nstate['snake'] = [(5, 5), (4, 5), (3, 5)]\nstate['direction'] = DIRECTIONS['right']\nstate['food'] = (6, 5)\nstep_game(state)\nassert state['score'] == 10, f\"score is {state['score']}, expected 10\"\nassert state['eaten'] == 1"
            },
            {
                "name": "A new apple appears somewhere free",
                "code": "state = create_game()\nstate['snake'] = [(5, 5), (4, 5), (3, 5)]\nstate['direction'] = DIRECTIONS['right']\nstate['food'] = (6, 5)\nstep_game(state)\nassert state['food'] is not None\nassert not contains_position(state['snake'], state['food']), 'the new apple landed on the snake'"
            },
            {
                "name": "Walking past an apple does not grow the snake",
                "code": "state = create_game()\nstate['snake'] = [(5, 5), (4, 5), (3, 5)]\nstate['direction'] = DIRECTIONS['right']\nstate['food'] = (12, 12)\nstep_game(state)\nassert len(state['snake']) == 3 and state['score'] == 0"
            },
            {
                "name": "A paused game does not move",
                "code": "state = create_game()\nstate['is_paused'] = True\nbefore = list(state['snake'])\nstep_game(state)\nassert state['snake'] == before, 'the snake moved while paused'"
            },
            {
                "name": "A finished game does not move either",
                "code": "state = create_game()\nstate['is_over'] = True\nbefore = list(state['snake'])\nstep_game(state)\nassert state['snake'] == before, 'the snake moved after the game had ended'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "The real game, played by your step_game. Steer with the buttons."
        },
        "warning": "The order matters! Check for death BEFORE moving the snake, and work out \"eating\" while the head and the apple can still be compared."
    },
    {
        "id": "score_for_food",
        "fnName": "score_for_food",
        "title": "Count the points",
        "adds": "Apples are finally worth something.",
        "intro": "<p>An apple is worth <strong>10 points times the level</strong>. Apples on level 5 are worth five times as much, which is fair - the snake is much faster and much longer by then.</p>",
        "spec": {
            "input": "level - the level the player is on",
            "output": "the points to add",
            "algorithm": [
                "Multiply 10 by the level and return it."
            ]
        },
        "starter": "def score_for_food(level):\n    # ten points per level\n    pass\n",
        "answer": "def score_for_food(level):\n    return 10 * level\n",
        "hints": [
            "This really is a one-line function.",
            "return 10 * level"
        ],
        "tests": [
            {
                "name": "Level 1 apples are worth 10",
                "code": "got = score_for_food(1)\nassert got == 10, f'gave {got}, expected 10'"
            },
            {
                "name": "Level 2 apples are worth 20",
                "code": "assert score_for_food(2) == 20"
            },
            {
                "name": "Level 5 apples are worth 50",
                "code": "assert score_for_food(5) == 50"
            },
            {
                "name": "Level 12 apples are worth 120",
                "code": "assert score_for_food(12) == 120"
            },
            {
                "name": "It returns a number, not text",
                "code": "got = score_for_food(3)\nassert isinstance(got, int), f'gave a {type(got).__name__}'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Eat an apple and watch the score climb. Every 5 apples is a new level."
        }
    },
    {
        "id": "step_interval_for_level",
        "fnName": "step_interval_for_level",
        "title": "Make it faster",
        "adds": "Higher levels really are faster.",
        "intro": "<p>The level has to mean something, and in Snake it means speed: how long the game waits between steps. Level 1 waits 200 milliseconds; each level is 15 ms quicker.</p><p>There has to be a floor, or a high level would wait a negative time. Python's <code>max()</code> writes that floor in one word.</p>",
        "spec": {
            "input": "level - the level number",
            "output": "milliseconds to wait before the snake moves again",
            "algorithm": [
                "Work out 200 - (level - 1) * 15.",
                "Return the bigger of that and 70, using max()."
            ]
        },
        "starter": "def step_interval_for_level(level):\n    # 200 ms at level 1, 15 ms quicker each level, never below 70\n    pass\n",
        "answer": "def step_interval_for_level(level):\n    interval = 200 - (level - 1) * 15\n    return max(70, interval)\n",
        "hints": [
            "Work the number out into a variable first.",
            "max(70, interval) gives 70 whenever interval has dropped below it.",
            "An if statement works just as well if you prefer: if interval < 70: return 70"
        ],
        "tests": [
            {
                "name": "Level 1 waits 200 ms",
                "code": "got = step_interval_for_level(1)\nassert got == 200, f'gave {got}, expected 200'"
            },
            {
                "name": "Level 2 waits 185 ms",
                "code": "assert step_interval_for_level(2) == 185"
            },
            {
                "name": "Level 5 waits 140 ms",
                "code": "assert step_interval_for_level(5) == 140"
            },
            {
                "name": "Level 10 has hit the floor of 70 ms",
                "code": "got = step_interval_for_level(10)\nassert got == 70, f'gave {got}, expected 70'"
            },
            {
                "name": "Level 50 is still 70 ms",
                "code": "assert step_interval_for_level(50) == 70"
            },
            {
                "name": "It never returns less than 70",
                "code": "for level in range(1, 61):\n    assert step_interval_for_level(level) >= 70, f'level {level} gave {step_interval_for_level(level)}'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Eat apples and feel your speed curve. Level 10 is properly frightening."
        },
        "warning": "Level 1 must come out at exactly 200, which is why the sum uses (level - 1) and not level."
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Wire up the keyboard",
        "adds": "You can play with the keyboard - the game is finished!",
        "intro": "<p>Last piece. The browser hands us a key name like <code>\"ArrowLeft\"</code> or <code>\"w\"</code>, and the game needs the name of the action instead.</p><p>JavaScript needed a row of if statements. In Python a <strong>dictionary is the lookup table</strong>, and <code>.get()</code> hands back <code>None</code> for anything that is not in it.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"up\", \"down\", \"left\", \"right\", \"pause\", \"restart\" - or None",
            "algorithm": [
                "Make the key lowercase: str(key).lower().",
                "Build a dictionary from key names to action names.",
                "Return keys.get(k) - which is None for anything missing.",
                "Arrow keys and WASD both steer; p and space pause; r restarts."
            ]
        },
        "starter": "def action_for_key(key):\n    k = str(key).lower()\n    # a dictionary from key names to action names, then .get(k)\n    pass\n",
        "answer": "def action_for_key(key):\n    k = str(key).lower()\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"p\": \"pause\", \" \": \"pause\", \"spacebar\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(k)\n",
        "hints": [
            "Lowercase first, so \"W\" and \"w\" behave the same.",
            "Two keys can share an action - just put both in the dictionary.",
            "keys.get(k) returns None when the key is not there, which is exactly what the game wants."
        ],
        "tests": [
            {
                "name": "ArrowUp goes up",
                "code": "got = action_for_key('ArrowUp')\nassert got == 'up', f'gave {got!r}, expected \"up\"'"
            },
            {
                "name": "The letter W goes up too",
                "code": "assert action_for_key('w') == 'up'"
            },
            {
                "name": "A capital W still works",
                "code": "got = action_for_key('W')\nassert got == 'up', f'gave {got!r} - did you lowercase the key?'"
            },
            {
                "name": "ArrowDown goes down",
                "code": "assert action_for_key('ArrowDown') == 'down'"
            },
            {
                "name": "ArrowLeft goes left",
                "code": "assert action_for_key('ArrowLeft') == 'left'"
            },
            {
                "name": "The letter A goes left",
                "code": "assert action_for_key('a') == 'left'"
            },
            {
                "name": "ArrowRight goes right",
                "code": "assert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "The letter D goes right",
                "code": "assert action_for_key('d') == 'right'"
            },
            {
                "name": "P pauses",
                "code": "assert action_for_key('p') == 'pause'"
            },
            {
                "name": "The space bar pauses too",
                "code": "assert action_for_key(' ') == 'pause'"
            },
            {
                "name": "R restarts",
                "code": "assert action_for_key('r') == 'restart'"
            },
            {
                "name": "An unused key gives None",
                "code": "got = action_for_key('q')\nassert got is None, f'gave {got!r}, expected None'"
            },
            {
                "name": "Enter is not one of ours either",
                "code": "assert action_for_key('Enter') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then play with the keyboard. Every function here is yours."
        },
        "warning": "Return None (not False, not \"none\") for keys the game does not use. The rest of the game checks for exactly None."
    }
];
