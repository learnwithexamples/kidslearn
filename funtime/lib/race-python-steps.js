/* ============================================================
   race-python-steps.js - the twelve steps of "Build Car Racing in Python"

   The same twelve functions as the JavaScript workshop, written in Python.
   Every test is a few lines of real Python ending in an `assert`.
   ============================================================ */

const RACE_PYTHON_STEPS = [
    {
        "id": "lane_center_x",
        "fnName": "lane_center_x",
        "title": "Mark out the lanes",
        "adds": "The road gets three lanes.",
        "intro": "<p>Snake and Tetris lived on a grid of squares. A racing game does not: cars slide smoothly, so everything is measured in <strong>pixels</strong>.</p><pre class=\"mini-code\">|edge|   lane 0   |   lane 1   |   lane 2   |edge|\n0   15           105          195          285  300</pre><p>The road is <code>ROAD_WIDTH</code> = 300 wide, the verges are <code>EDGE_WIDTH</code> = 15, and each of the <code>LANE_COUNT</code> = 3 lanes is <code>LANE_WIDTH</code> = 90 across.</p>",
        "spec": {
            "input": "lane - 0 (left), 1 (middle) or 2 (right)",
            "output": "the x position of the middle of that lane, in pixels",
            "algorithm": [
                "Start at EDGE_WIDTH, where the tarmac begins.",
                "Skip the lanes before this one: lane * LANE_WIDTH.",
                "Add half a lane (LANE_WIDTH / 2) to land in the middle."
            ]
        },
        "starter": "def lane_center_x(lane):\n    # the verge, then the lanes before this one, then half a lane\n    pass\n",
        "answer": "def lane_center_x(lane):\n    return EDGE_WIDTH + lane * LANE_WIDTH + LANE_WIDTH / 2\n",
        "hints": [
            "One line: three things added together.",
            "The lanes before this one take up lane * LANE_WIDTH pixels.",
            "return EDGE_WIDTH + lane * LANE_WIDTH + LANE_WIDTH / 2"
        ],
        "tests": [
            {
                "name": "Lane 0 is at 60",
                "code": "got = lane_center_x(0)\nassert got == 60, f'gave {got}'"
            },
            {
                "name": "Lane 1 is at 150 - the middle of the road",
                "code": "assert lane_center_x(1) == 150"
            },
            {
                "name": "Lane 2 is at 240",
                "code": "assert lane_center_x(2) == 240"
            },
            {
                "name": "The lanes are one LANE_WIDTH apart",
                "code": "assert lane_center_x(1) - lane_center_x(0) == LANE_WIDTH\nassert lane_center_x(2) - lane_center_x(1) == LANE_WIDTH"
            },
            {
                "name": "Every lane leaves room for a whole car",
                "code": "for lane in range(LANE_COUNT):\n    left = lane_center_x(lane) - CAR_WIDTH / 2\n    assert left >= EDGE_WIDTH and left + CAR_WIDTH <= ROAD_WIDTH - EDGE_WIDTH, f'a car in lane {lane} would hang over a verge'"
            }
        ],
        "demo": {
            "kind": "lanes",
            "caption": "A car parked in the middle of each lane, using your function."
        },
        "warning": "Use the names EDGE_WIDTH, LANE_WIDTH and LANE_COUNT rather than typing 15, 90 and 3 - then a wider road still works."
    },
    {
        "id": "clamp",
        "fnName": "clamp",
        "title": "Keep the car on the road",
        "adds": "The car can no longer drive onto the verge.",
        "intro": "<p>Steering just adds to the car's <code>x</code>. Nothing stops it adding for ever - unless we squeeze the answer back between two limits. That is <strong>clamping</strong>, and you will meet it everywhere: volume sliders, health bars, zoom levels.</p><p>Python can say it in one line with <code>min</code> and <code>max</code>.</p>",
        "spec": {
            "input": "value - the number. low - the smallest allowed. high - the largest allowed.",
            "output": "value squeezed between the two limits",
            "algorithm": [
                "If value is below low, the answer is low.",
                "If value is above high, the answer is high.",
                "Otherwise the answer is value. max(low, min(high, value)) does all three at once."
            ]
        },
        "starter": "def clamp(value, low, high):\n    # squeeze value between low and high\n    pass\n",
        "answer": "def clamp(value, low, high):\n    return max(low, min(high, value))\n",
        "hints": [
            "min(high, value) chops off anything too big.",
            "max(low, ...) then lifts anything too small.",
            "Two ifs work just as well - write whichever you find clearer."
        ],
        "tests": [
            {
                "name": "A number already in range is left alone",
                "code": "got = clamp(50, 0, 100)\nassert got == 50, f'gave {got}'"
            },
            {
                "name": "A number below the bottom is pulled up",
                "code": "assert clamp(-30, 0, 100) == 0"
            },
            {
                "name": "A number above the top is pulled down",
                "code": "assert clamp(300, 0, 100) == 100"
            },
            {
                "name": "The bottom limit itself is allowed",
                "code": "assert clamp(0, 0, 100) == 0"
            },
            {
                "name": "The top limit itself is allowed",
                "code": "assert clamp(100, 0, 100) == 100"
            },
            {
                "name": "It works with the road's real limits",
                "code": "assert clamp(999, 15, 241) == 241"
            },
            {
                "name": "It works with decimals",
                "code": "assert clamp(7.5, 0, 10) == 7.5"
            },
            {
                "name": "It works with negative limits",
                "code": "assert clamp(-99, -20, 20) == -20"
            }
        ],
        "demo": {
            "kind": "clamp",
            "caption": "Push the car past the verge and watch your clamp refuse to let it through."
        }
    },
    {
        "id": "create_car",
        "fnName": "create_car",
        "title": "Build a car",
        "adds": "Cars can be put on the road.",
        "intro": "<p>Every car - yours and the traffic - is the same thing: a <strong>rectangle</strong>, stored as a dictionary.</p><pre class=\"mini-code\">{\"x\": 38, \"y\": 120, \"width\": 44, \"height\": 74, \"lane\": 0}</pre><p><code>x</code> and <code>y</code> are the <strong>top-left corner</strong> - which makes the crash test in step 4 much easier. Lanes, though, are measured from their middle.</p>",
        "spec": {
            "input": "lane - 0, 1 or 2. y - how far down the road the top edge is.",
            "output": "a dictionary with x, y, width, height and lane",
            "algorithm": [
                "Find the middle of the lane with lane_center_x(lane).",
                "The left edge is that middle minus CAR_WIDTH / 2.",
                "Return the dictionary with all five keys."
            ]
        },
        "starter": "def create_car(lane, y):\n    # a rectangle, centred in its lane\n    pass\n",
        "answer": "def create_car(lane, y):\n    return {\n        \"x\": lane_center_x(lane) - CAR_WIDTH / 2,\n        \"y\": y,\n        \"width\": CAR_WIDTH,\n        \"height\": CAR_HEIGHT,\n        \"lane\": lane,\n    }\n",
        "hints": [
            "You already wrote lane_center_x - use it.",
            "The left edge is lane_center_x(lane) - CAR_WIDTH / 2.",
            "Remember the \"lane\" key: the spawner uses it later."
        ],
        "tests": [
            {
                "name": "The car sits in the middle of its lane",
                "code": "car = create_car(0, 100)\nassert car['x'] + car['width'] / 2 == lane_center_x(0), f\"the car spans {car['x']} to {car['x'] + car['width']}\""
            },
            {
                "name": "It uses the y you asked for",
                "code": "assert create_car(1, 123)['y'] == 123"
            },
            {
                "name": "Every car is CAR_WIDTH by CAR_HEIGHT",
                "code": "car = create_car(2, 0)\nassert car['width'] == CAR_WIDTH and car['height'] == CAR_HEIGHT, f\"got {car['width']} x {car['height']}\""
            },
            {
                "name": "It remembers which lane it is in",
                "code": "assert create_car(2, 0)['lane'] == 2"
            },
            {
                "name": "No lane lets a car hang over a verge",
                "code": "for lane in range(LANE_COUNT):\n    car = create_car(lane, 0)\n    assert car['x'] >= EDGE_WIDTH and car['x'] + car['width'] <= ROAD_WIDTH - EDGE_WIDTH, f'lane {lane} put a car at x = {car[\"x\"]}'"
            },
            {
                "name": "A car can start above the road",
                "code": "assert create_car(1, -74)['y'] == -74"
            }
        ],
        "demo": {
            "kind": "cars",
            "caption": "Press the button to drop cars onto the road with your function."
        }
    },
    {
        "id": "overlaps",
        "fnName": "overlaps",
        "title": "Do two cars touch?",
        "adds": "The game can tell when two cars are in the same place.",
        "intro": "<p>The most useful function in all of game programming: <strong>do two rectangles overlap?</strong> Every crash, every bullet hit, every button click is this test.</p><p>Think backwards - ask where the <strong>gaps</strong> are. There are only four ways to miss:</p><pre class=\"mini-code\">a fully left of b:   a.x + a.width  &lt;= b.x\na fully right of b:  a.x            &gt;= b.x + b.width\na fully above b:     a.y + a.height &lt;= b.y\na fully below b:     a.y            &gt;= b.y + b.height</pre><p>If none of those gaps exist, they touch. Flip all four and join them with <code>and</code>.</p>",
        "spec": {
            "input": "a, b - two rectangles",
            "output": "True if they overlap, False if there is any gap",
            "algorithm": [
                "a[\"x\"] < b[\"x\"] + b[\"width\"]   (a starts before b ends)",
                "and a[\"x\"] + a[\"width\"] > b[\"x\"]",
                "and the same two lines again with y and height.",
                "Return all four joined with `and`."
            ]
        },
        "starter": "def overlaps(a, b):\n    # four checks joined with `and`\n    pass\n",
        "answer": "def overlaps(a, b):\n    return (a[\"x\"] < b[\"x\"] + b[\"width\"] and\n            a[\"x\"] + a[\"width\"] > b[\"x\"] and\n            a[\"y\"] < b[\"y\"] + b[\"height\"] and\n            a[\"y\"] + a[\"height\"] > b[\"y\"])\n",
        "hints": [
            "Start with the sideways half, then copy it for y and height.",
            "Wrap the whole thing in ( ) so you can spread it over several lines.",
            "Use < and >, not <= and >= - see the warning."
        ],
        "tests": [
            {
                "name": "Two rectangles in the same place overlap",
                "code": "a = {'x': 0, 'y': 0, 'width': 10, 'height': 10}\nassert overlaps(a, dict(a)) is True"
            },
            {
                "name": "A gap to the side means no overlap",
                "code": "assert overlaps({'x':0,'y':0,'width':10,'height':10}, {'x':20,'y':0,'width':10,'height':10}) is False"
            },
            {
                "name": "A gap above means no overlap",
                "code": "assert overlaps({'x':0,'y':0,'width':10,'height':10}, {'x':0,'y':50,'width':10,'height':10}) is False"
            },
            {
                "name": "Edges exactly touching do NOT count",
                "code": "got = overlaps({'x':0,'y':0,'width':10,'height':10}, {'x':10,'y':0,'width':10,'height':10})\nassert got is False, f'gave {got!r} - touching edges are driving alongside, not crashing'"
            },
            {
                "name": "One pixel of shared space DOES count",
                "code": "assert overlaps({'x':0,'y':0,'width':10,'height':10}, {'x':9,'y':0,'width':10,'height':10}) is True"
            },
            {
                "name": "A small rectangle inside a big one overlaps",
                "code": "assert overlaps({'x':2,'y':2,'width':2,'height':2}, {'x':0,'y':0,'width':10,'height':10}) is True"
            },
            {
                "name": "Corner to corner does not count",
                "code": "assert overlaps({'x':0,'y':0,'width':10,'height':10}, {'x':10,'y':10,'width':10,'height':10}) is False"
            },
            {
                "name": "It gives the same answer whichever comes first",
                "code": "a = {'x':0,'y':0,'width':10,'height':10}\nb = {'x':5,'y':5,'width':10,'height':10}\nassert overlaps(a, b) == overlaps(b, a) is True"
            },
            {
                "name": "Two real cars in different lanes never touch",
                "code": "assert overlaps(create_car(0, 100), create_car(1, 100)) is False\nassert overlaps(create_car(0, 100), create_car(2, 100)) is False"
            },
            {
                "name": "Two real cars stacked in one lane do",
                "code": "assert overlaps(create_car(1, 100), create_car(1, 140)) is True"
            }
        ],
        "demo": {
            "kind": "overlap",
            "caption": "Drive the striped car into the other one and watch your function notice."
        },
        "warning": "Use < and >, not <= and >=. Two cars whose edges exactly touch are driving alongside each other, not crashing."
    },
    {
        "id": "steer_player",
        "fnName": "steer_player",
        "title": "Steer the car",
        "adds": "You can drive!",
        "intro": "<p>The state holds <code>steering</code>: <code>-1</code> for left, <code>1</code> for right, <code>0</code> for not steering.</p><p>Notice the <code>seconds</code> input. Frames do not all take the same time, so movement is always <strong>speed x time</strong> - that way the car drives at the same speed on a fast computer and a slow one.</p>",
        "spec": {
            "input": "state - the game state. seconds - how long this frame took.",
            "output": "nothing; it changes state[\"player\"][\"x\"]",
            "algorithm": [
                "Work out where the car wants to go: player x + steering * STEER_SPEED * seconds.",
                "Squeeze it between PLAYER_MIN_X and PLAYER_MAX_X with clamp.",
                "Store it back in state[\"player\"][\"x\"]."
            ]
        },
        "starter": "def steer_player(state, seconds):\n    # move by steering x STEER_SPEED x seconds, then clamp\n    pass\n",
        "answer": "def steer_player(state, seconds):\n    moved = state[\"player\"][\"x\"] + state[\"steering\"] * STEER_SPEED * seconds\n    state[\"player\"][\"x\"] = clamp(moved, PLAYER_MIN_X, PLAYER_MAX_X)\n",
        "hints": [
            "Work the new position out into a variable first.",
            "When steering is 0 the sum adds 0, so a car nobody steers stays put by itself.",
            "state[\"player\"][\"x\"] = clamp(moved, PLAYER_MIN_X, PLAYER_MAX_X)"
        ],
        "tests": [
            {
                "name": "Steering right moves the car right",
                "code": "state = create_game()\nstart = state['player']['x']\nstate['steering'] = 1\nsteer_player(state, 0.1)\nassert state['player']['x'] > start, f\"x went from {start} to {state['player']['x']}\""
            },
            {
                "name": "Steering left moves the car left",
                "code": "state = create_game()\nstart = state['player']['x']\nstate['steering'] = -1\nsteer_player(state, 0.1)\nassert state['player']['x'] < start"
            },
            {
                "name": "Not steering leaves the car where it was",
                "code": "state = create_game()\nstart = state['player']['x']\nstate['steering'] = 0\nsteer_player(state, 0.5)\nassert state['player']['x'] == start, 'the car drifted on its own'"
            },
            {
                "name": "It moves STEER_SPEED pixels in a whole second",
                "code": "state = create_game()\nstart = state['player']['x']\nstate['steering'] = 1\nsteer_player(state, 0.1)\nmoved = state['player']['x'] - start\nassert abs(moved - STEER_SPEED * 0.1) < 0.001, f'moved {moved} in 0.1s, expected {STEER_SPEED * 0.1}'"
            },
            {
                "name": "Twice the time is twice the distance",
                "code": "one = create_game(); two = create_game()\none['steering'] = two['steering'] = 1\nstart = one['player']['x']\nsteer_player(one, 0.1)\nsteer_player(two, 0.2)\nassert abs((two['player']['x'] - start) - 2 * (one['player']['x'] - start)) < 0.001"
            },
            {
                "name": "The car stops at the left verge",
                "code": "state = create_game()\nstate['steering'] = -1\nfor _ in range(100):\n    steer_player(state, 0.1)\nassert state['player']['x'] == PLAYER_MIN_X, f\"the car ended at {state['player']['x']}\""
            },
            {
                "name": "The car stops at the right verge",
                "code": "state = create_game()\nstate['steering'] = 1\nfor _ in range(100):\n    steer_player(state, 0.1)\nassert state['player']['x'] == PLAYER_MAX_X, f\"the car ended at {state['player']['x']}\""
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {},
            "caption": "An empty road to practise on. The traffic arrives in step 6."
        }
    },
    {
        "id": "move_cars",
        "fnName": "move_cars",
        "title": "Make the traffic flow",
        "adds": "The other cars come down the road.",
        "intro": "<p>The illusion at the heart of every racing game: <strong>your car never moves forward</strong>. It sits at the bottom all race long, and the traffic slides <em>down</em> past it.</p><p>A list comprehension builds the new list of moved cars in one go.</p>",
        "spec": {
            "input": "cars - a list of cars. distance - how many pixels to move them down.",
            "output": "a NEW list of cars, each further down the road",
            "algorithm": [
                "For every car, build a new dictionary with the same x, width, height and lane, but y + distance.",
                "Return the new list."
            ]
        },
        "starter": "def move_cars(cars, distance):\n    # a new list, every car pushed further down the road\n    pass\n",
        "answer": "def move_cars(cars, distance):\n    return [{\"x\": car[\"x\"], \"y\": car[\"y\"] + distance,\n             \"width\": car[\"width\"], \"height\": car[\"height\"], \"lane\": car[\"lane\"]}\n            for car in cars]\n",
        "hints": [
            "A list comprehension: [ {...} for car in cars ]",
            "Copy x, width, height and lane straight across; only y changes.",
            "A plain for loop with .append() is just as good."
        ],
        "tests": [
            {
                "name": "One car moves down by the distance",
                "code": "got = move_cars([{'x': 1, 'y': 10, 'width': 44, 'height': 74, 'lane': 0}], 25)\nassert got == [{'x': 1, 'y': 35, 'width': 44, 'height': 74, 'lane': 0}], f'gave {got}'"
            },
            {
                "name": "Every car in the list moves",
                "code": "out = move_cars([create_car(0, 0), create_car(1, 100), create_car(2, 200)], 10)\nassert [c['y'] for c in out] == [10, 110, 210], f\"gave {[c['y'] for c in out]}\""
            },
            {
                "name": "An empty road stays empty",
                "code": "assert move_cars([], 20) == []"
            },
            {
                "name": "The lane number is kept",
                "code": "assert move_cars([create_car(2, 0)], 5)[0]['lane'] == 2"
            },
            {
                "name": "The old cars are not damaged",
                "code": "cars = [create_car(0, 10)]\nmove_cars(cars, 50)\nassert cars[0]['y'] == 10, f\"the car you were given moved to {cars[0]['y']}\""
            },
            {
                "name": "It returns a new list, not the old one",
                "code": "cars = [create_car(0, 10)]\nassert move_cars(cars, 5) is not cars"
            },
            {
                "name": "Decimal distances work too",
                "code": "assert move_cars([create_car(0, 0)], 2.5)[0]['y'] == 2.5"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "traffic": true
            },
            "caption": "Traffic! Watch the counter below - no car is ever forgotten yet."
        },
        "warning": "Build NEW dictionaries rather than changing the old ones. Functions that never damage what you hand them are far easier to trust."
    },
    {
        "id": "keep_cars_on_screen",
        "fnName": "keep_cars_on_screen",
        "title": "Tidy up behind you",
        "adds": "Cars you have overtaken are forgotten.",
        "intro": "<p>Right now every car ever created stays in the list for ever, crawling further and further below the screen. After a few minutes the game would be checking thousands of invisible cars every frame.</p><p>And there is a bonus: the number of cars we <em>drop</em> is exactly the number you have overtaken, which is how the game scores you.</p>",
        "spec": {
            "input": "cars - a list of cars",
            "output": "a NEW list holding only the cars still on the road",
            "algorithm": [
                "Keep every car that is_on_screen(car) likes.",
                "Return the kept cars."
            ]
        },
        "starter": "def keep_cars_on_screen(cars):\n    # keep only the cars is_on_screen still likes\n    pass\n",
        "answer": "def keep_cars_on_screen(cars):\n    return [car for car in cars if is_on_screen(car)]\n",
        "hints": [
            "A list comprehension can end with an `if`.",
            "is_on_screen(car) is written for you.",
            "return [car for car in cars if is_on_screen(car)]"
        ],
        "tests": [
            {
                "name": "A car in the middle of the road is kept",
                "code": "assert len(keep_cars_on_screen([create_car(0, 100)])) == 1"
            },
            {
                "name": "A car past the bottom is dropped",
                "code": "assert keep_cars_on_screen([create_car(0, ROAD_HEIGHT + 5)]) == []"
            },
            {
                "name": "A car half off the bottom is still kept",
                "code": "assert len(keep_cars_on_screen([create_car(0, ROAD_HEIGHT - 10)])) == 1"
            },
            {
                "name": "A car still above the top is kept",
                "code": "assert len(keep_cars_on_screen([create_car(0, -70)])) == 1"
            },
            {
                "name": "It keeps the right ones out of a mixed list",
                "code": "out = keep_cars_on_screen([create_car(0, 100), create_car(1, ROAD_HEIGHT + 1), create_car(2, 300)])\nassert [c['y'] for c in out] == [100, 300], f\"kept {[c['y'] for c in out]}\""
            },
            {
                "name": "An empty road stays empty",
                "code": "assert keep_cars_on_screen([]) == []"
            },
            {
                "name": "The order is not shuffled",
                "code": "out = keep_cars_on_screen([create_car(0, 10), create_car(1, 20), create_car(2, 30)])\nassert [c['y'] for c in out] == [10, 20, 30]"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "traffic": true,
                "remove": true
            },
            "caption": "The counter stays low now - cars past the bottom are forgotten."
        }
    },
    {
        "id": "spawn_car",
        "fnName": "spawn_car",
        "title": "Send in the traffic",
        "adds": "The traffic never stops coming.",
        "intro": "<p>New cars appear just above the top of the screen, at <code>y = -CAR_HEIGHT</code>, so they slide into view.</p><p>One rule: <strong>never use the same lane as the car before</strong>, so there is always a way through. We list the allowed lanes and let <code>random.choice</code> pick - the same trick the Snake game uses for apples.</p>",
        "spec": {
            "input": "state - the game state",
            "output": "nothing; it adds one car to state[\"cars\"]",
            "algorithm": [
                "Look at the last car in state[\"cars\"] - there may not be one yet.",
                "Build a list of allowed lanes: range(LANE_COUNT), minus the last car's lane.",
                "Pick one with random.choice, and append create_car(lane, -CAR_HEIGHT)."
            ]
        },
        "starter": "def spawn_car(state):\n    # 1. which lane did the last car use? (there may not be one)\n    # 2. list every OTHER lane\n    # 3. pick one at random and add a car just above the road\n    pass\n",
        "answer": "def spawn_car(state):\n    last_car = state[\"cars\"][-1] if state[\"cars\"] else None\n    choices = [lane for lane in range(LANE_COUNT)\n               if last_car is None or lane != last_car[\"lane\"]]\n    state[\"cars\"].append(create_car(random.choice(choices), -CAR_HEIGHT))\n",
        "hints": [
            "state[\"cars\"][-1] is the last car - but only when the list is not empty.",
            "A list comprehension with an `if` builds the allowed lanes.",
            "random.choice(choices) picks one - random is already imported."
        ],
        "tests": [
            {
                "name": "It adds exactly one car",
                "code": "state = create_game()\nspawn_car(state)\nassert len(state['cars']) == 1, f\"the road now has {len(state['cars'])} car(s)\""
            },
            {
                "name": "The new car starts just above the road",
                "code": "state = create_game()\nspawn_car(state)\nassert state['cars'][0]['y'] == -CAR_HEIGHT, f\"it appeared at y = {state['cars'][0]['y']}\""
            },
            {
                "name": "It works on an empty road",
                "code": "state = create_game()\nspawn_car(state)\nassert len(state['cars']) == 1"
            },
            {
                "name": "The new car is in a real lane",
                "code": "state = create_game()\nfor _ in range(20):\n    spawn_car(state)\nassert all(0 <= car['lane'] < LANE_COUNT for car in state['cars'])"
            },
            {
                "name": "It never uses the same lane twice in a row",
                "code": "state = create_game()\nfor _ in range(200):\n    spawn_car(state)\nfor i in range(1, len(state['cars'])):\n    assert state['cars'][i]['lane'] != state['cars'][i-1]['lane'], f'cars {i-1} and {i} were both sent down lane {state[\"cars\"][i][\"lane\"]}'"
            },
            {
                "name": "But it does use all three lanes over time",
                "code": "state = create_game()\nfor _ in range(200):\n    spawn_car(state)\nlanes = {car['lane'] for car in state['cars']}\nassert len(lanes) == 3, f'in 200 cars it only used {len(lanes)} lane(s)'"
            },
            {
                "name": "The cars it makes are proper rectangles",
                "code": "state = create_game()\nspawn_car(state)\ncar = state['cars'][0]\nassert car['width'] == CAR_WIDTH and car['height'] == CAR_HEIGHT"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "traffic": true,
                "remove": true
            },
            "caption": "Endless traffic - and you can drive straight through it. Step 9 fixes that!"
        },
        "warning": "On the very first car there is nothing to compare with, so every lane is allowed. Check for that, or your code will crash on an empty road."
    },
    {
        "id": "has_crashed",
        "fnName": "has_crashed",
        "title": "Crash!",
        "adds": "Hitting a car ends the race.",
        "intro": "<p>You wrote the hard part in step 4. Now use it: the player has crashed if their car overlaps <em>any</em> of the traffic.</p><p>JavaScript wrote a loop that returns early. Python has <code>any()</code>, which asks \"is this true of at least one of them?\"</p>",
        "spec": {
            "input": "state - the game state",
            "output": "True if the player overlaps any traffic car",
            "algorithm": [
                "Check overlaps(state[\"player\"], car) for every car in state[\"cars\"].",
                "Return any(...) of those."
            ]
        },
        "starter": "def has_crashed(state):\n    # does the player touch any of the traffic?\n    pass\n",
        "answer": "def has_crashed(state):\n    return any(overlaps(state[\"player\"], car) for car in state[\"cars\"])\n",
        "hints": [
            "any(...) stops at the first True, just like a loop with an early return.",
            "any(overlaps(state[\"player\"], car) for car in state[\"cars\"])",
            "An empty list gives False, which is exactly right for an empty road."
        ],
        "tests": [
            {
                "name": "An empty road is never a crash",
                "code": "state = create_game()\nassert has_crashed(state) is False"
            },
            {
                "name": "A car right on top of the player is a crash",
                "code": "state = create_game()\nstate['cars'] = [create_car(1, PLAYER_Y)]\nassert has_crashed(state) is True, 'the player starts in lane 1'"
            },
            {
                "name": "A car in another lane is not",
                "code": "state = create_game()\nstate['cars'] = [create_car(0, PLAYER_Y), create_car(2, PLAYER_Y)]\nassert has_crashed(state) is False"
            },
            {
                "name": "A car far up the road is not",
                "code": "state = create_game()\nstate['cars'] = [create_car(1, 0)]\nassert has_crashed(state) is False"
            },
            {
                "name": "A car overlapping by a few pixels is a crash",
                "code": "state = create_game()\nstate['cars'] = [create_car(1, PLAYER_Y - CAR_HEIGHT + 4)]\nassert has_crashed(state) is True"
            },
            {
                "name": "A car exactly bumper to bumper is not",
                "code": "state = create_game()\nstate['cars'] = [create_car(1, PLAYER_Y - CAR_HEIGHT)]\nassert has_crashed(state) is False"
            },
            {
                "name": "It finds a crash anywhere in a long list",
                "code": "state = create_game()\nstate['cars'] = [create_car(0, 10), create_car(2, 80), create_car(0, 150), create_car(1, PLAYER_Y)]\nassert has_crashed(state) is True"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "traffic": true,
                "remove": true,
                "crash": true
            },
            "caption": "Now it matters. Steer with the buttons and try to survive."
        }
    },
    {
        "id": "update_race",
        "fnName": "update_race",
        "title": "One frame of the race",
        "adds": "Everything you have written now works together.",
        "intro": "<p>The boss step. Sixty times a second the browser hands the game a few milliseconds and asks what happens next.</p><p>Two helpers are written for you: <code>score_for_pass(level)</code> gives 10 x level, and <code>level_for_passed(passed)</code> goes up every 5 cars.</p>",
        "spec": {
            "input": "state - the game state. elapsed_ms - milliseconds since the last frame.",
            "output": "nothing; it changes the state",
            "algorithm": [
                "Do nothing if state[\"is_over\"] or state[\"is_paused\"].",
                "seconds = elapsed_ms / 1000, travelled = speed_for_level(level) * boost * seconds.",
                "steer_player(state, seconds), then state[\"cars\"] = move_cars(state[\"cars\"], travelled).",
                "Remember how many cars there were, call keep_cars_on_screen, and the difference is how many you overtook.",
                "For those: add to passed, add score_for_pass(level) each, then level = level_for_passed(passed).",
                "Add travelled to distance, and stripe_offset = (stripe_offset + travelled) % STRIPE_PERIOD.",
                "Add travelled to since_spawn; once it reaches spawn_gap_for_level(level), spawn_car(state) and set since_spawn to 0.",
                "Finally, if has_crashed(state): state[\"is_over\"] = True."
            ]
        },
        "starter": "def update_race(state, elapsed_ms):\n    # 1. nothing to do if the race is over or paused\n    # 2. how far does the road move this frame?\n    # 3. steer, move the traffic, tidy up behind you\n    # 4. score the cars you passed and work out the level\n    # 5. distance, road markings, and the next car\n    # 6. did you crash?\n    pass\n",
        "answer": "def update_race(state, elapsed_ms):\n    if state[\"is_over\"] or state[\"is_paused\"]:\n        return\n\n    seconds = elapsed_ms / 1000\n    travelled = speed_for_level(state[\"level\"]) * state[\"boost\"] * seconds\n\n    steer_player(state, seconds)\n    state[\"cars\"] = move_cars(state[\"cars\"], travelled)\n\n    before = len(state[\"cars\"])\n    state[\"cars\"] = keep_cars_on_screen(state[\"cars\"])\n    overtaken = before - len(state[\"cars\"])\n    if overtaken > 0:\n        state[\"passed\"] += overtaken\n        state[\"score\"] += score_for_pass(state[\"level\"]) * overtaken\n        state[\"level\"] = level_for_passed(state[\"passed\"])\n\n    state[\"distance\"] += travelled\n    state[\"stripe_offset\"] = (state[\"stripe_offset\"] + travelled) % STRIPE_PERIOD\n\n    state[\"since_spawn\"] += travelled\n    if state[\"since_spawn\"] >= spawn_gap_for_level(state[\"level\"]):\n        spawn_car(state)\n        state[\"since_spawn\"] = 0\n\n    if has_crashed(state):\n        state[\"is_over\"] = True\n",
        "hints": [
            "Build it a line at a time and press Test after each - the messages say what is missing.",
            "The number overtaken is simply before - len(state[\"cars\"]).",
            "The % keeps the road markings scrolling round instead of running away to a huge number."
        ],
        "tests": [
            {
                "name": "The road moves and the distance grows",
                "code": "state = create_game()\nupdate_race(state, 100)\nassert state['distance'] > 0, f\"distance is still {state['distance']}\""
            },
            {
                "name": "The road markings scroll",
                "code": "state = create_game()\nupdate_race(state, 100)\nassert 0 < state['stripe_offset'] < STRIPE_PERIOD, f\"stripe_offset is {state['stripe_offset']}\""
            },
            {
                "name": "The player is steered",
                "code": "state = create_game()\nstart = state['player']['x']\nstate['steering'] = 1\nupdate_race(state, 100)\nassert state['player']['x'] > start, 'the car did not move'"
            },
            {
                "name": "Traffic moves down the road",
                "code": "state = create_game()\nstate['cars'] = [create_car(0, 0)]\nupdate_race(state, 100)\nassert state['cars'][0]['y'] > 0"
            },
            {
                "name": "A car that leaves the screen is dropped",
                "code": "state = create_game()\nstate['cars'] = [create_car(0, ROAD_HEIGHT - 1)]\nupdate_race(state, 100)\nassert state['cars'] == [], 'it is still in the list'"
            },
            {
                "name": "Overtaking scores 10 points on level 1",
                "code": "state = create_game()\nstate['cars'] = [create_car(0, ROAD_HEIGHT - 1)]\nupdate_race(state, 100)\nassert state['passed'] == 1 and state['score'] == 10, f\"passed {state['passed']}, score {state['score']}\""
            },
            {
                "name": "Five overtakes reach level 2",
                "code": "state = create_game()\nfor _ in range(5):\n    state['cars'] = [create_car(0, ROAD_HEIGHT - 1)]\n    update_race(state, 16)\nassert state['passed'] == 5 and state['level'] == 2, f\"passed {state['passed']}, level {state['level']}\""
            },
            {
                "name": "The fifth car is still paid at the old level",
                "code": "state = create_game()\nfor _ in range(5):\n    state['cars'] = [create_car(0, ROAD_HEIGHT - 1)]\n    update_race(state, 16)\nassert state['score'] == 50, f\"score is {state['score']}, expected 50\""
            },
            {
                "name": "New traffic appears after enough road",
                "code": "state = create_game()\nfor _ in range(40):\n    update_race(state, 100)\nassert len(state['cars']) >= 1, 'no car appeared after 4 seconds'"
            },
            {
                "name": "Hitting a car ends the race",
                "code": "state = create_game()\nstate['cars'] = [create_car(1, PLAYER_Y - 5)]\nupdate_race(state, 16)\nassert state['is_over'] is True"
            },
            {
                "name": "A paused race does not move",
                "code": "state = create_game()\nstate['is_paused'] = True\nupdate_race(state, 500)\nassert state['distance'] == 0 and state['cars'] == []"
            },
            {
                "name": "A finished race does not move either",
                "code": "state = create_game()\nstate['is_over'] = True\nupdate_race(state, 500)\nassert state['distance'] == 0"
            },
            {
                "name": "Accelerating covers more road",
                "code": "slow = create_game(); fast = create_game()\nfast['boost'] = 2\nupdate_race(slow, 100)\nupdate_race(fast, 100)\nassert fast['distance'] > slow['distance'], 'did you multiply by state[\"boost\"]?'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "The real game, run by your update_race. Steer with the buttons."
        },
        "warning": "Score the overtaken cars BEFORE working out the new level, or the car that pushes you up a level would be paid at the higher rate."
    },
    {
        "id": "speed_for_level",
        "fnName": "speed_for_level",
        "title": "Put your foot down",
        "adds": "Every level really is faster.",
        "intro": "<p>Level 1 rolls along at 180 pixels a second. Each level adds 35 - and then it stops at 520, because past that a car could cross more than its own length between two frames and the crash test would start missing things.</p>",
        "spec": {
            "input": "level - the level number",
            "output": "the speed in pixels per second",
            "algorithm": [
                "Work out 180 + (level - 1) * 35.",
                "Return the smaller of that and 520, using min()."
            ]
        },
        "starter": "def speed_for_level(level):\n    # 180 at level 1, 35 faster each level, never above 520\n    pass\n",
        "answer": "def speed_for_level(level):\n    return min(520, 180 + (level - 1) * 35)\n",
        "hints": [
            "min(520, something) gives 520 whenever something has grown past it.",
            "Level 1 must give exactly 180, so the sum uses (level - 1).",
            "An if statement works just as well."
        ],
        "tests": [
            {
                "name": "Level 1 runs at 180",
                "code": "got = speed_for_level(1)\nassert got == 180, f'gave {got}'"
            },
            {
                "name": "Level 2 runs at 215",
                "code": "assert speed_for_level(2) == 215"
            },
            {
                "name": "Level 5 runs at 320",
                "code": "assert speed_for_level(5) == 320"
            },
            {
                "name": "Level 10 runs at 495",
                "code": "assert speed_for_level(10) == 495"
            },
            {
                "name": "Level 11 has hit the ceiling of 520",
                "code": "got = speed_for_level(11)\nassert got == 520, f'gave {got}'"
            },
            {
                "name": "Level 40 is still 520",
                "code": "assert speed_for_level(40) == 520"
            },
            {
                "name": "It never returns more than 520",
                "code": "for level in range(1, 101):\n    assert speed_for_level(level) <= 520, f'level {level} gave {speed_for_level(level)}'"
            },
            {
                "name": "It never gets slower as the level goes up",
                "code": "for level in range(2, 41):\n    assert speed_for_level(level) >= speed_for_level(level - 1)"
            }
        ],
        "demo": {
            "kind": "game",
            "flags": {
                "levelPicker": true
            },
            "caption": "Use the level buttons to feel your speed curve."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Wire up the keyboard",
        "adds": "You can drive with the keyboard - the game is finished!",
        "intro": "<p>The browser hands us a key name; the game needs the name of an action. In Python a <strong>dictionary is the lookup table</strong>, and <code>.get()</code> returns <code>None</code> for anything missing.</p><p>Steering is different from the other two games: you <em>hold</em> these keys. That is handled elsewhere - here you only give each key its name.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"left\", \"right\", \"faster\", \"slower\", \"pause\", \"restart\" - or None",
            "algorithm": [
                "Lowercase the key.",
                "ArrowLeft/a -> left, ArrowRight/d -> right",
                "ArrowUp/w -> faster, ArrowDown/s -> slower",
                "p or space -> pause, r -> restart, anything else -> None."
            ]
        },
        "starter": "def action_for_key(key):\n    k = str(key).lower()\n    # a dictionary from key names to action names, then .get(k)\n    pass\n",
        "answer": "def action_for_key(key):\n    k = str(key).lower()\n    keys = {\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"arrowup\": \"faster\", \"w\": \"faster\",\n        \"arrowdown\": \"slower\", \"s\": \"slower\",\n        \"p\": \"pause\", \" \": \"pause\", \"spacebar\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(k)\n",
        "hints": [
            "Lowercase first so \"W\" and \"w\" behave the same.",
            "Several keys can share an action.",
            "keys.get(k) returns None when the key is not there."
        ],
        "tests": [
            {
                "name": "ArrowLeft steers left",
                "code": "got = action_for_key('ArrowLeft')\nassert got == 'left', f'gave {got!r}'"
            },
            {
                "name": "The letter A steers left too",
                "code": "assert action_for_key('a') == 'left'"
            },
            {
                "name": "A capital A still works",
                "code": "assert action_for_key('A') == 'left'"
            },
            {
                "name": "ArrowRight steers right",
                "code": "assert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "The letter D steers right",
                "code": "assert action_for_key('d') == 'right'"
            },
            {
                "name": "ArrowUp accelerates",
                "code": "assert action_for_key('ArrowUp') == 'faster'"
            },
            {
                "name": "W accelerates too",
                "code": "assert action_for_key('w') == 'faster'"
            },
            {
                "name": "ArrowDown brakes",
                "code": "assert action_for_key('ArrowDown') == 'slower'"
            },
            {
                "name": "S brakes too",
                "code": "assert action_for_key('s') == 'slower'"
            },
            {
                "name": "P pauses",
                "code": "assert action_for_key('p') == 'pause'"
            },
            {
                "name": "The space bar pauses as well",
                "code": "assert action_for_key(' ') == 'pause'"
            },
            {
                "name": "R starts a new race",
                "code": "assert action_for_key('r') == 'restart'"
            },
            {
                "name": "An unused key gives None",
                "code": "got = action_for_key('q')\nassert got is None, f'gave {got!r}'"
            },
            {
                "name": "Enter is not one of ours either",
                "code": "assert action_for_key('Enter') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then drive with the arrow keys. Every function here is yours."
        },
        "warning": "Return None (not False, not \"none\") for keys the game does not use."
    }
];
