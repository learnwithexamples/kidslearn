/* ============================================================
   frogger-python-steps.js - the 7 steps of "Build Frogger in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const FROGGER_PYTHON_STEPS = [
    {
        "id": "lane_direction",
        "fnName": "lane_direction",
        "title": "Which way does the traffic go?",
        "adds": "The road knows its own directions.",
        "intro": "<p>If every lane went the same way the game would be dull and easy. So the rows take turns: odd rows drive right, even rows drive left.</p><p>The tool for this is <strong>remainder</strong> — <code>row % 2</code> is 1 for odd rows and 0 for even ones. You will use that trick in almost every grid program you ever write.</p>",
        "spec": {
            "input": "row",
            "output": "1 for rightwards, -1 for leftwards",
            "algorithm": [
                "Work out row % 2.",
                "If it is 1, the row goes right: return 1.",
                "Otherwise return -1."
            ]
        },
        "starter": "def lane_direction(row):\n    # odd rows go right, even rows go left\n    pass\n",
        "answer": "def lane_direction(row):\n    return 1 if row % 2 == 1 else -1\n",
        "hints": [
            "% gives the remainder: 7 % 2 is 1, and 8 % 2 is 0.",
            "An if works perfectly well.",
            "return 1 if row % 2 == 1 else -1"
        ],
        "tests": [
            {
                "name": "Row 1 drives right",
                "code": "assert lane_direction(1) == 1"
            },
            {
                "name": "Row 2 drives left",
                "code": "assert lane_direction(2) == -1"
            },
            {
                "name": "Row 3 drives right",
                "code": "assert lane_direction(3) == 1"
            },
            {
                "name": "Every row is 1 or -1",
                "code": "for row in range(ROWS):\n    assert lane_direction(row) in (1, -1), f'row {row} gave {lane_direction(row)}'"
            },
            {
                "name": "No two rows next to each other go the same way",
                "code": "for row in range(1, ROWS):\n    assert lane_direction(row) != lane_direction(row - 1)"
            }
        ],
        "demo": {
            "kind": "lanes",
            "caption": "Walk up and down the rows and watch the traffic turn around."
        }
    },
    {
        "id": "lane_speed",
        "fnName": "lane_speed",
        "title": "How fast is each lane?",
        "adds": "Every row moves at its own pace.",
        "intro": "<p>Two lanes moving at exactly the same speed look wrong — the traffic seems to march in step. Giving each row its own speed makes the road look alive.</p><p>The cap matters just as much: without it, level 30 would be uncrossable and the game would stop being a game.</p>",
        "spec": {
            "input": "row, level",
            "output": "pixels per second",
            "algorithm": [
                "Start with 34.",
                "Add 9 for every row — that is what makes each lane different.",
                "Add 8 for every level after the first.",
                "Never go above 190."
            ]
        },
        "starter": "def lane_speed(row, level):\n    # 34, plus 9 a row, plus 8 a level - but never over 190\n    pass\n",
        "answer": "def lane_speed(row, level):\n    return min(190, 34 + row * 9 + (level - 1) * 8)\n",
        "hints": [
            "min(190, something) is the cap.",
            "Level 1 must add nothing, so use (level - 1).",
            "return min(190, 34 + row * 9 + (level - 1) * 8)"
        ],
        "tests": [
            {
                "name": "Row 1 at level 1 crawls along",
                "code": "assert lane_speed(1, 1) == 43"
            },
            {
                "name": "Higher rows are faster",
                "code": "assert lane_speed(5, 1) > lane_speed(2, 1)"
            },
            {
                "name": "Higher levels are faster",
                "code": "assert lane_speed(3, 4) > lane_speed(3, 1)"
            },
            {
                "name": "Every lane in a level is different",
                "code": "speeds = [lane_speed(r, 1) for r in range(1, 10)]\nassert len(set(speeds)) == len(speeds), f'two lanes move together: {speeds}'"
            },
            {
                "name": "It never goes above 190",
                "code": "for level in range(1, 41):\n    for row in range(ROWS):\n        assert lane_speed(row, level) <= 190"
            },
            {
                "name": "Speeds are always positive",
                "code": "assert all(lane_speed(row, 1) > 0 for row in range(ROWS))"
            }
        ],
        "demo": {
            "kind": "lanes",
            "caption": "Step through the rows and read each lane's speed."
        }
    },
    {
        "id": "wrap_car",
        "fnName": "wrap_car",
        "title": "Make the road a loop",
        "adds": "The traffic never runs out.",
        "intro": "<p>Cars drive off the edge of the screen. If nothing catches them, the road empties out after a few seconds and the game is over in the boring sense.</p><p>The fix is a trick you will meet again and again: when something leaves one side, put it back on the other. The road becomes an endless loop with only a handful of cars in it.</p>",
        "spec": {
            "input": "car — { row, x, width }",
            "output": "nothing; it changes car.x",
            "algorithm": [
                "If the car's x is past FIELD_WIDTH, put it just off the left: x becomes -width.",
                "If the car's right-hand edge (x + width) is left of 0, put it at FIELD_WIDTH."
            ]
        },
        "starter": "def wrap_car(car):\n    # off one side, back on the other\n    pass\n",
        "answer": "def wrap_car(car):\n    if car[\"x\"] > FIELD_WIDTH:\n        car[\"x\"] = -car[\"width\"]\n    if car[\"x\"] + car[\"width\"] < 0:\n        car[\"x\"] = FIELD_WIDTH\n",
        "hints": [
            "Two ifs - cars go both ways.",
            "Set x to -car['width'], not 0, or the car would pop into view.",
            "A car has gone off the left when x + width is below 0."
        ],
        "tests": [
            {
                "name": "A car in the middle is left alone",
                "code": "car = {'row': 1, 'x': 100, 'width': 38}\nwrap_car(car)\nassert car['x'] == 100"
            },
            {
                "name": "A car off the right comes back on the left",
                "code": "car = {'row': 1, 'x': FIELD_WIDTH + 5, 'width': 38}\nwrap_car(car)\nassert car['x'] < 0"
            },
            {
                "name": "A car off the left comes back on the right",
                "code": "car = {'row': 2, 'x': -50, 'width': 38}\nwrap_car(car)\nassert car['x'] == FIELD_WIDTH"
            },
            {
                "name": "A car half off the edge is left alone",
                "code": "car = {'row': 1, 'x': FIELD_WIDTH - 10, 'width': 38}\nwrap_car(car)\nassert car['x'] == FIELD_WIDTH - 10"
            },
            {
                "name": "It comes back completely off screen, not halfway",
                "code": "car = {'row': 1, 'x': FIELD_WIDTH + 1, 'width': 38}\nwrap_car(car)\nassert car['x'] + car['width'] <= 0"
            },
            {
                "name": "A whole road stays full for ever",
                "code": "cars = make_traffic()\nfor _ in range(4000):\n    move_cars(cars, 0.016, 3)\nassert len(cars) == len(make_traffic())\nassert all(-200 < c['x'] < FIELD_WIDTH + 200 for c in cars)"
            }
        ],
        "demo": {
            "kind": "traffic",
            "caption": "Watch the traffic loop round for ever — and speed it up with the level buttons."
        }
    },
    {
        "id": "move_frog",
        "fnName": "move_frog",
        "title": "Hop!",
        "adds": "The frog can move.",
        "intro": "<p>The frog moves one whole square at a time — no sliding. That is what makes it feel like hopping.</p><p>The clever bit is <code>highestRow</code>. Scoring for every forward hop would let a player bounce between two rows for ever and win. Scoring only for a row they have <em>never reached before</em> fixes that in one line.</p>",
        "spec": {
            "input": "state. dColumn, dRow — the hop, e.g. 0 and -1 for 'up'.",
            "output": "True if the frog moved",
            "algorithm": [
                "Do nothing if the game is over or paused.",
                "Work out the new column and row.",
                "If either is off the field, return false and do not move.",
                "Move the frog.",
                "If the new row is higher than any row reached before, remember it and add 10 points."
            ]
        },
        "starter": "def move_frog(state, d_column, d_row):\n    # work out where it lands, stay on the field, score a NEW row\n    pass\n",
        "answer": "def move_frog(state, d_column, d_row):\n    if state[\"is_over\"] or state[\"is_paused\"]:\n        return False\n    column = state[\"frog\"][\"column\"] + d_column\n    row = state[\"frog\"][\"row\"] + d_row\n\n    if not (0 <= column < COLUMNS) or not (0 <= row < ROWS):\n        return False\n\n    state[\"frog\"][\"column\"] = column\n    state[\"frog\"][\"row\"] = row\n\n    if row < state[\"highest_row\"]:\n        state[\"highest_row\"] = row\n        state[\"score\"] += 10\n    return True\n",
        "hints": [
            "Work out where it WOULD land before you move it.",
            "0 <= column < COLUMNS is the neat Python way to check both edges.",
            "Row 0 is the top, so 'higher up' means a SMALLER row number."
        ],
        "tests": [
            {
                "name": "Hopping forward moves the frog",
                "code": "state = create_game()\nbefore = state['frog']['row']\nmove_frog(state, 0, -1)\nassert state['frog']['row'] == before - 1"
            },
            {
                "name": "Hopping sideways moves the frog",
                "code": "state = create_game()\nbefore = state['frog']['column']\nmove_frog(state, 1, 0)\nassert state['frog']['column'] == before + 1"
            },
            {
                "name": "The frog cannot hop off the left",
                "code": "state = create_game()\nstate['frog']['column'] = 0\nassert move_frog(state, -1, 0) is False\nassert state['frog']['column'] == 0"
            },
            {
                "name": "The frog cannot hop off the right",
                "code": "state = create_game()\nstate['frog']['column'] = COLUMNS - 1\nmove_frog(state, 1, 0)\nassert state['frog']['column'] == COLUMNS - 1"
            },
            {
                "name": "The frog cannot hop off the bottom",
                "code": "state = create_game()\nstate['frog']['row'] = ROWS - 1\nassert move_frog(state, 0, 1) is False"
            },
            {
                "name": "A new row forward scores 10",
                "code": "state = create_game()\nmove_frog(state, 0, -1)\nassert state['score'] == 10"
            },
            {
                "name": "Hopping back and forth does not score twice",
                "code": "state = create_game()\nmove_frog(state, 0, -1)\nmove_frog(state, 0, 1)\nmove_frog(state, 0, -1)\nassert state['score'] == 10, 'a row only pays once'"
            },
            {
                "name": "Hopping sideways scores nothing",
                "code": "state = create_game()\nmove_frog(state, 1, 0)\nassert state['score'] == 0"
            }
        ],
        "demo": {
            "kind": "hop",
            "caption": "An empty road to practise on. Hop about and watch the score."
        },
        "warning": "Score only for a row the frog has never reached. Score every forward hop and a player can farm points by bouncing on the spot."
    },
    {
        "id": "is_squashed",
        "fnName": "is_squashed",
        "title": "Squashed?",
        "adds": "The traffic becomes dangerous.",
        "intro": "<p>Now the two worlds meet. The frog is on a grid; the cars are at any pixel. Turn both into rectangles and the question becomes easy.</p><p>There is a small trick worth copying: only the cars in the frog's own row can possibly hit it, so skip the rest. That is nine times less work, sixty times a second.</p>",
        "spec": {
            "input": "state",
            "output": "True if a car has caught the frog",
            "algorithm": [
                "Work out the frog's rectangle with frog-rect.",
                "Look at every car. Skip any that is not in the frog's row.",
                "If overlaps() says its rectangle touches the frog's, return True.",
                "Otherwise, False."
            ]
        },
        "starter": "def is_squashed(state):\n    # only the cars in the frog's own row can reach it\n    pass\n",
        "answer": "def is_squashed(state):\n    frog = frog_rect(state[\"frog\"])\n    for car in state[\"cars\"]:\n        if car[\"row\"] == state[\"frog\"][\"row\"] and overlaps(frog, car_rect(car)):\n            return True\n    return False\n",
        "hints": [
            "frog_rect, car_rect and overlaps are all written for you.",
            "Check the row FIRST - it is much cheaper than the rectangle test.",
            "return False goes after the loop, not inside it."
        ],
        "tests": [
            {
                "name": "A frog on the empty bank is safe",
                "code": "assert is_squashed(create_game()) is False"
            },
            {
                "name": "A frog standing under a car is squashed",
                "code": "state = create_game()\nstate['frog'] = {'column': 2, 'row': 1}\nstate['cars'] = [{'row': 1, 'x': frog_rect(state['frog'])['x'], 'width': 38}]\nassert is_squashed(state) is True"
            },
            {
                "name": "A car in another row cannot touch it",
                "code": "state = create_game()\nstate['frog'] = {'column': 2, 'row': 1}\nstate['cars'] = [{'row': 4, 'x': frog_rect(state['frog'])['x'], 'width': 38}]\nassert is_squashed(state) is False"
            },
            {
                "name": "A car in the same row but far along misses",
                "code": "state = create_game()\nstate['frog'] = {'column': 0, 'row': 1}\nstate['cars'] = [{'row': 1, 'x': 200, 'width': 38}]\nassert is_squashed(state) is False"
            },
            {
                "name": "Every car is checked, not just the first",
                "code": "state = create_game()\nstate['frog'] = {'column': 2, 'row': 1}\nstate['cars'] = [{'row': 1, 'x': 250, 'width': 38}, {'row': 1, 'x': frog_rect(state['frog'])['x'], 'width': 38}]\nassert is_squashed(state) is True"
            },
            {
                "name": "The safe island really is safe",
                "code": "state = create_game()\nstate['frog'] = {'column': 4, 'row': MEDIAN_ROW}\nfor _ in range(2000):\n    move_cars(state['cars'], 0.016, 5)\n    assert is_squashed(state) is False"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "The real road. Hop across it — the note tells you the moment you are hit."
        }
    },
    {
        "id": "reach_home",
        "fnName": "reach_home",
        "title": "Getting home",
        "adds": "A crossing is worth something.",
        "intro": "<p>The reward for a whole crossing. A hundred points, the level goes up so the traffic speeds up, and the frog starts again from the bottom.</p><p>Notice the order: score, count, level, <em>then</em> put the frog back. Reset it first and the frog would no longer be on the home row, so nothing else would happen.</p>",
        "spec": {
            "input": "state",
            "output": "True if the frog just got home",
            "algorithm": [
                "If the frog is not on HOME_ROW, return False.",
                "Add 100 to the score.",
                "Add 1 to the crossings and 1 to the level.",
                "Call reset-frog to put it back at the bottom.",
                "Return True."
            ]
        },
        "starter": "def reach_home(state):\n    # 100 points, next level, back to the start\n    pass\n",
        "answer": "def reach_home(state):\n    if state[\"frog\"][\"row\"] != HOME_ROW:\n        return False\n    state[\"score\"] += 100\n    state[\"crossings\"] += 1\n    state[\"level\"] += 1\n    reset_frog(state)\n    return True\n",
        "hints": [
            "The very first line is a guard: not home yet? return False.",
            "reset_frog is already written for you.",
            "Reset the frog LAST, once everything has been counted."
        ],
        "tests": [
            {
                "name": "Reaching the top counts as a crossing",
                "code": "state = create_game()\nstate['frog']['row'] = HOME_ROW\nassert reach_home(state) is True\nassert state['crossings'] == 1"
            },
            {
                "name": "A crossing is worth 100",
                "code": "state = create_game()\nstate['frog']['row'] = HOME_ROW\nreach_home(state)\nassert state['score'] == 100"
            },
            {
                "name": "The next level is faster",
                "code": "state = create_game()\nstate['frog']['row'] = HOME_ROW\nreach_home(state)\nassert state['level'] == 2\nassert lane_speed(3, state['level']) > lane_speed(3, 1)"
            },
            {
                "name": "The frog goes back to the start",
                "code": "state = create_game()\nstate['frog']['row'] = HOME_ROW\nreach_home(state)\nassert state['frog']['row'] == START_ROW"
            },
            {
                "name": "It can score again on the way back up",
                "code": "state = create_game()\nstate['frog']['row'] = HOME_ROW\nreach_home(state)\nassert state['highest_row'] == START_ROW"
            },
            {
                "name": "A frog halfway across has not got home",
                "code": "state = create_game()\nstate['frog']['row'] = 4\nassert reach_home(state) is False\nassert state['score'] == 0"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Get all the way to the top and watch the score jump by 100."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function. Four directions, a pause and a restart — and the game is yours.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Up arrow or W → 'up'. Down or S → 'down'.",
                "Left or A → 'left'. Right or D → 'right'.",
                "P or space → 'pause'. R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "def action_for_key(key):\n    keys = {\n        # \"arrowup\": \"up\", ...\n    }\n    return keys.get(str(key).lower())\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"p\": \"pause\", \" \": \"pause\", \"spacebar\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "A dictionary is much tidier than six ifs.",
            "keys.get(...) gives None for anything not listed.",
            "Remember \" \" for the space bar."
        ],
        "tests": [
            {
                "name": "The arrows hop",
                "code": "assert action_for_key('ArrowUp') == 'up'\nassert action_for_key('ArrowDown') == 'down'\nassert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "WASD hops too",
                "code": "assert action_for_key('w') == 'up'\nassert action_for_key('s') == 'down'\nassert action_for_key('a') == 'left'\nassert action_for_key('d') == 'right'"
            },
            {
                "name": "Capital letters work",
                "code": "assert action_for_key('W') == 'up'\nassert action_for_key('R') == 'restart'"
            },
            {
                "name": "P and space pause",
                "code": "assert action_for_key('p') == 'pause'\nassert action_for_key(' ') == 'pause'"
            },
            {
                "name": "R starts a new game",
                "code": "assert action_for_key('r') == 'restart'"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert action_for_key('z') is None\nassert action_for_key('Enter') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then cross the road with the arrow keys."
        }
    }
];
