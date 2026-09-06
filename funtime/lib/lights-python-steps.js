/* ============================================================
   lights-python-steps.js - the 7 steps of "Build Lights Out in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const LIGHTS_PYTHON_STEPS = [
    {
        "id": "light_index",
        "fnName": "light_index",
        "title": "Number the squares",
        "adds": "The board has places to put lights.",
        "intro": "<p>Twenty-five lights sit in a 5 x 5 grid, but they are stored as one flat <strong>list</strong> of 25 true/false values. So the game needs to turn \"column 2, row 1\" into \"light number 7\".</p><pre class=\"mini-code\"> 0  1  2  3  4\n 5  6  7  8  9\n10 11 12 13 14\n15 16 17 18 19\n20 21 22 23 24</pre>",
        "spec": {
            "input": "column, row - each 0 to GRID_SIZE - 1",
            "output": "the position of that light in the flat list of 25",
            "algorithm": [
                "Skip a whole row of lights for every row above this one: row * GRID_SIZE.",
                "Add the column.",
                "Return the answer."
            ]
        },
        "starter": "def light_index(column, row):\n    # skip whole rows, then add the column\n    pass\n",
        "answer": "def light_index(column, row):\n    return row * GRID_SIZE + column\n",
        "hints": [
            "One line.",
            "Skipping `row` rows means skipping row * GRID_SIZE lights.",
            "return row * GRID_SIZE + column"
        ],
        "tests": [
            {
                "name": "The first light is number 0",
                "code": "got = light_index(0, 0)\nassert got == 0, f'gave {got}'"
            },
            {
                "name": "Column 2 of row 1 is number 7",
                "code": "got = light_index(2, 1)\nassert got == 7, f'gave {got}, expected 7'"
            },
            {
                "name": "The last light is number 24",
                "code": "assert light_index(4, 4) == 24"
            },
            {
                "name": "One step down adds a whole row",
                "code": "assert light_index(1, 3) - light_index(1, 2) == GRID_SIZE"
            },
            {
                "name": "All 25 squares get different numbers",
                "code": "seen = {light_index(c, r) for r in range(GRID_SIZE) for c in range(GRID_SIZE)}\nassert len(seen) == 25, f'only {len(seen)} different numbers'"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers every square on the board."
        }
    },
    {
        "id": "is_on_board",
        "fnName": "is_on_board",
        "title": "Stay on the board",
        "adds": "The game knows where the edges are.",
        "intro": "<p>A light in the middle has four neighbours, but a corner light has only two. Before the game touches a square it has to ask whether that square exists at all.</p>",
        "spec": {
            "input": "column, row",
            "output": "True if both are between 0 and GRID_SIZE - 1",
            "algorithm": [
                "column must be 0 or more, and less than GRID_SIZE.",
                "row must be the same.",
                "Return True only when both are."
            ]
        },
        "starter": "def is_on_board(column, row):\n    # two chained comparisons joined with and\n    pass\n",
        "answer": "def is_on_board(column, row):\n    return 0 <= column < GRID_SIZE and 0 <= row < GRID_SIZE\n",
        "hints": [
            "Python can chain comparisons: 0 <= column < GRID_SIZE.",
            "Join the two halves with `and`.",
            "return 0 <= column < GRID_SIZE and 0 <= row < GRID_SIZE"
        ],
        "tests": [
            {
                "name": "The middle is on the board",
                "code": "assert is_on_board(2, 2) is True"
            },
            {
                "name": "Every corner is on the board",
                "code": "assert all(is_on_board(c, r) for c, r in [(0,0),(4,0),(0,4),(4,4)])"
            },
            {
                "name": "One step left of the board is off it",
                "code": "assert is_on_board(-1, 2) is False"
            },
            {
                "name": "One step right of the board is off it",
                "code": "assert is_on_board(5, 2) is False, 'column 4 is the last one INSIDE'"
            },
            {
                "name": "Above the top and below the bottom are off it",
                "code": "assert is_on_board(2, -1) is False and is_on_board(2, 5) is False"
            }
        ],
        "demo": {
            "kind": "cross",
            "caption": "Move the cursor into a corner — the cross gets smaller at the edges."
        }
    },
    {
        "id": "neighbours",
        "fnName": "neighbours",
        "title": "Find the cross",
        "adds": "Pressing a light knows what it touches.",
        "intro": "<p>Pressing a square flips <strong>five</strong> lights: the one you pressed, and the four around it. At the edges some of those five do not exist, so the list is shorter.</p><pre class=\"mini-code\">    .  #  .\n    #  #  #        pressing the middle\n    .  #  .        flips this cross</pre>",
        "spec": {
            "input": "column, row - the square that was pressed",
            "output": "a list of the squares to flip: the square itself, plus the up, down, left and right neighbours that are still on the board",
            "algorithm": [
                "Write down the five steps: no step at all, then up, down, left and right.",
                "For each step, work out the square it lands on.",
                "Keep it only if is-on-board says it exists.",
                "Return the list of squares."
            ]
        },
        "starter": "def neighbours(column, row):\n    steps = [(0, 0), (0, -1), (0, 1), (-1, 0), (1, 0)]\n    # keep the steps that stay on the board\n    pass\n",
        "answer": "def neighbours(column, row):\n    steps = [(0, 0), (0, -1), (0, 1), (-1, 0), (1, 0)]\n    return [(column + dx, row + dy) for dx, dy in steps if is_on_board(column + dx, row + dy)]\n",
        "hints": [
            "`for dx, dy in steps` unpacks each step into two names.",
            "A list comprehension can end with an `if`.",
            "Build (column + dx, row + dy) and keep it when is_on_board says yes."
        ],
        "tests": [
            {
                "name": "The middle of the board flips five lights",
                "code": "got = neighbours(2, 2)\nassert len(got) == 5, f'gave {len(got)} squares'"
            },
            {
                "name": "A corner flips only three",
                "code": "got = neighbours(0, 0)\nassert len(got) == 3, f'a corner has two neighbours plus itself - gave {len(got)}'"
            },
            {
                "name": "An edge flips four",
                "code": "assert len(neighbours(2, 0)) == 4"
            },
            {
                "name": "The pressed square is always included",
                "code": "assert (3, 1) in neighbours(3, 1), 'the square you pressed must be in the list'"
            },
            {
                "name": "Every square it returns is on the board",
                "code": "for r in range(GRID_SIZE):\n    for c in range(GRID_SIZE):\n        for square in neighbours(c, r):\n            assert is_on_board(square[0], square[1]), f'returned {square}, which is off the board'"
            },
            {
                "name": "It returns the four true neighbours of the middle",
                "code": "assert sorted(neighbours(2, 2)) == [(1, 2), (2, 1), (2, 2), (2, 3), (3, 2)], f'gave {sorted(neighbours(2, 2))}'"
            }
        ],
        "demo": {
            "kind": "cross",
            "caption": "The lit cross IS your function's answer. Move it to an edge and watch it shrink."
        }
    },
    {
        "id": "press_light",
        "fnName": "press_light",
        "title": "Flip the cross",
        "adds": "Pressing a square changes the board.",
        "intro": "<p>Now put the two together: press a square, and every light in its cross swaps over — on becomes off and off becomes on.</p><p>Notice something lovely about this game: pressing the same square twice puts everything back. Every move is its own undo.</p>",
        "spec": {
            "input": "lights - the list of 25 values. column, row - the square pressed.",
            "output": "a NEW list with those lights flipped",
            "algorithm": [
                "Copy the list.",
                "For every square in the cross, work out its index and flip the value there.",
                "Return the copy."
            ]
        },
        "starter": "def press_light(lights, column, row):\n    changed = list(lights)\n    # flip every light in the cross\n    pass\n",
        "answer": "def press_light(lights, column, row):\n    changed = list(lights)\n    for c, r in neighbours(column, row):\n        index = light_index(c, r)\n        changed[index] = not changed[index]\n    return changed\n",
        "hints": [
            "list(lights) gives you a copy to work on.",
            "`for c, r in neighbours(column, row)` unpacks each square.",
            "`not value` flips True to False and False to True."
        ],
        "tests": [
            {
                "name": "Pressing the middle flips five lights",
                "code": "after = press_light([False] * LIGHT_COUNT, 2, 2)\nassert sum(after) == 5, f'gave {sum(after)} lights on'"
            },
            {
                "name": "Pressing a corner flips three",
                "code": "after = press_light([False] * LIGHT_COUNT, 0, 0)\nassert sum(after) == 3, f'gave {sum(after)}'"
            },
            {
                "name": "It flips the right squares",
                "code": "after = press_light([False] * LIGHT_COUNT, 2, 2)\nfor c, r in [(2,2),(2,1),(2,3),(1,2),(3,2)]:\n    assert after[light_index(c, r)] is True, f'square {(c, r)} should be on'"
            },
            {
                "name": "Pressing twice puts everything back",
                "code": "before = [False] * LIGHT_COUNT\nbefore[7] = True\nassert press_light(press_light(before, 1, 1), 1, 1) == before, 'pressing twice must undo itself'"
            },
            {
                "name": "Lights already on are turned off",
                "code": "after = press_light([True] * LIGHT_COUNT, 2, 2)\nassert after[light_index(2, 2)] is False"
            },
            {
                "name": "The list you were given is not changed",
                "code": "before = [False] * LIGHT_COUNT\npress_light(before, 2, 2)\nassert not any(before), 'you changed the list you were given instead of a copy'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Press squares and watch the crosses flip. (Nothing checks for a win yet.)"
        }
    },
    {
        "id": "is_solved",
        "fnName": "is_solved",
        "title": "Have you won?",
        "adds": "Turning every light off wins the game.",
        "intro": "<p>The puzzle is solved when not one light is left on.</p>",
        "spec": {
            "input": "lights - the list of 25 values",
            "output": "True if every one is off",
            "algorithm": [
                "Look at every light.",
                "A single one still on means not solved.",
                "If you get through them all, it is solved."
            ]
        },
        "starter": "def is_solved(lights):\n    # is every light off?\n    pass\n",
        "answer": "def is_solved(lights):\n    return not any(lights)\n",
        "hints": [
            "any(lights) is True when at least one light is on.",
            "So the puzzle is solved when NOT any of them are on.",
            "return not any(lights)"
        ],
        "tests": [
            {
                "name": "A dark board is solved",
                "code": "assert is_solved([False] * LIGHT_COUNT) is True"
            },
            {
                "name": "A board with one light on is not",
                "code": "lights = [False] * LIGHT_COUNT\nlights[12] = True\nassert is_solved(lights) is False"
            },
            {
                "name": "A fully lit board is not solved",
                "code": "assert is_solved([True] * LIGHT_COUNT) is False"
            },
            {
                "name": "The very last light counts too",
                "code": "lights = [False] * LIGHT_COUNT\nlights[-1] = True\nassert is_solved(lights) is False, 'do not stop looking before the end'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Turn every light off and your function ends the game."
        }
    },
    {
        "id": "create_puzzle",
        "fnName": "create_puzzle",
        "title": "Scramble a puzzle",
        "adds": "Every new game is solvable.",
        "intro": "<p>Here is the clever bit. You could turn random lights on to make a puzzle — but then some puzzles would be <strong>impossible</strong>, because not every pattern of lights can be switched off.</p><p>Instead, start with the board already solved and press random squares. Since pressing is its own undo, whatever you press can always be pressed back. Every puzzle built this way can be solved.</p>",
        "spec": {
            "input": "presses - how many random presses to scramble with",
            "output": "a list of 25 lights",
            "algorithm": [
                "Start with a list of LIGHT_COUNT lights, all off.",
                "Repeat `presses` times: pick a random column and row, and press there.",
                "Return the scrambled lights."
            ]
        },
        "starter": "def create_puzzle(presses):\n    # start dark, then press random squares\n    pass\n",
        "answer": "def create_puzzle(presses):\n    lights = [False] * LIGHT_COUNT\n    for _ in range(presses):\n        lights = press_light(lights, random.randrange(GRID_SIZE), random.randrange(GRID_SIZE))\n    return lights\n",
        "hints": [
            "[False] * LIGHT_COUNT builds the dark board in one go.",
            "random.randrange(GRID_SIZE) picks a random column (random is already imported).",
            "press_light returns a NEW list, so store it: lights = press_light(...)"
        ],
        "tests": [
            {
                "name": "It gives back 25 lights",
                "code": "assert len(create_puzzle(5)) == LIGHT_COUNT"
            },
            {
                "name": "Every value is True or False",
                "code": "assert all(isinstance(v, bool) for v in create_puzzle(5))"
            },
            {
                "name": "Pressing nothing leaves the board dark",
                "code": "assert not any(create_puzzle(0)), 'with no presses every light should be off'"
            },
            {
                "name": "One press lights a cross",
                "code": "lit = sum(create_puzzle(1))\nassert lit in (3, 4, 5), f'one press should light 3, 4 or 5 squares, not {lit}'"
            },
            {
                "name": "Different puzzles come out different",
                "code": "first = create_puzzle(8)\nassert any(create_puzzle(8) != first for _ in range(20)), 'twenty puzzles came out the same'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Press New a few times — every puzzle your function makes can be solved."
        },
        "warning": "Build the puzzle by PRESSING, never by turning random lights on. That is what makes it solvable."
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Wire up the keyboard",
        "adds": "You can play without a mouse — the game is finished!",
        "intro": "<p>Arrows move a dashed cursor and the space bar presses. The browser gives us a key name; the game needs an action name.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"up\", \"down\", \"left\", \"right\", \"press\", \"pause\", \"restart\" - or nothing",
            "algorithm": [
                "Lowercase the key first.",
                "Arrows or WASD move the cursor.",
                "Space or Enter presses; p pauses; r restarts; anything else is nothing."
            ]
        },
        "starter": "def action_for_key(key):\n    k = str(key).lower()\n    # a dictionary from key names to action names, then .get(k)\n    pass\n",
        "answer": "def action_for_key(key):\n    k = str(key).lower()\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \" \": \"press\", \"spacebar\": \"press\", \"enter\": \"press\",\n        \"p\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(k)\n",
        "hints": [
            "A dictionary IS the lookup table.",
            "Several keys can share an action.",
            "keys.get(k) gives None for anything missing."
        ],
        "tests": [
            {
                "name": "The arrows move the cursor",
                "code": "assert action_for_key('ArrowUp') == 'up'\nassert action_for_key('ArrowDown') == 'down'\nassert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "WASD works too",
                "code": "assert action_for_key('w') == 'up' and action_for_key('d') == 'right'"
            },
            {
                "name": "Capitals still work",
                "code": "assert action_for_key('W') == 'up', 'did you lowercase the key?'"
            },
            {
                "name": "Space presses the square",
                "code": "got = action_for_key(' ')\nassert got == 'press', f'gave {got!r}'"
            },
            {
                "name": "Enter presses too",
                "code": "assert action_for_key('Enter') == 'press'"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert action_for_key('p') == 'pause' and action_for_key('r') == 'restart'"
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
