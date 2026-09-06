/* ============================================================
   breakout-python-steps.js - the 7 steps of "Build Breakout in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const BREAKOUT_PYTHON_STEPS = [
    {
        "id": "brick_rect",
        "fnName": "brick_rect",
        "title": "Where does a brick go?",
        "adds": "The wall of bricks appears.",
        "intro": "<p>Every game so far has put things on a grid of squares. Breakout is different: the ball can be <em>anywhere</em>, so everything has to know its exact place in pixels.</p><p>Start with the bricks. Brick (0, 0) is the top-left one. Each step right adds one brick width plus one gap; each step down adds one brick height plus one gap.</p>",
        "spec": {
            "input": "column, row",
            "output": "a rectangle: x, y, width, height",
            "algorithm": [
                "x starts at BRICK_SIDE_MARGIN, then add column × (BRICK_WIDTH + BRICK_GAP).",
                "y starts at BRICK_TOP, then add row × (BRICK_HEIGHT + BRICK_GAP).",
                "width is BRICK_WIDTH and height is BRICK_HEIGHT — every brick is the same size."
            ]
        },
        "starter": "def brick_rect(column, row):\n    return {\n        \"x\": 0,\n        \"y\": 0,\n        \"width\": BRICK_WIDTH,\n        \"height\": BRICK_HEIGHT,\n    }\n",
        "answer": "def brick_rect(column, row):\n    return {\n        \"x\": BRICK_SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_GAP),\n        \"y\": BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP),\n        \"width\": BRICK_WIDTH,\n        \"height\": BRICK_HEIGHT,\n    }\n",
        "hints": [
            "Column 0 must give exactly BRICK_SIDE_MARGIN.",
            "A whole brick AND a gap have to be skipped for each column.",
            "\"x\": BRICK_SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_GAP)"
        ],
        "tests": [
            {
                "name": "The first brick sits in the top-left corner",
                "code": "r = brick_rect(0, 0)\nassert r['x'] == BRICK_SIDE_MARGIN, f\"x is {r['x']}\"\nassert r['y'] == BRICK_TOP"
            },
            {
                "name": "Every brick is the same size",
                "code": "r = brick_rect(4, 3)\nassert r['width'] == BRICK_WIDTH and r['height'] == BRICK_HEIGHT"
            },
            {
                "name": "The next column is one brick and one gap to the right",
                "code": "assert brick_rect(1, 0)['x'] - brick_rect(0, 0)['x'] == BRICK_WIDTH + BRICK_GAP"
            },
            {
                "name": "The next row is one brick and one gap further down",
                "code": "assert brick_rect(0, 1)['y'] - brick_rect(0, 0)['y'] == BRICK_HEIGHT + BRICK_GAP"
            },
            {
                "name": "The bricks stay in the same row as you go across",
                "code": "assert brick_rect(5, 2)['y'] == brick_rect(0, 2)['y'], 'a row must be level'"
            },
            {
                "name": "The last brick still fits on the field",
                "code": "r = brick_rect(BRICK_COLUMNS - 1, BRICK_ROWS - 1)\nassert r['x'] + r['width'] <= FIELD_WIDTH"
            }
        ],
        "demo": {
            "kind": "bricks",
            "caption": "Move the dashed box around the wall and read the numbers underneath."
        }
    },
    {
        "id": "hits_rect",
        "fnName": "hits_rect",
        "title": "Is the ball touching it?",
        "adds": "The game can tell when the ball hits something.",
        "intro": "<p>This is the most useful function in the whole game. It is used for the bricks <em>and</em> the paddle — anything shaped like a rectangle.</p><p>The trick is called <strong>closest point</strong>. Squash the middle of the ball onto the rectangle: if the ball is to the left of it, the nearest point is on the left edge; if it is inside, the nearest point is the ball itself. Then just ask whether that point is within one radius.</p>",
        "spec": {
            "input": "ball — something with x and y. rect — x, y, width, height.",
            "output": "True if they overlap",
            "algorithm": [
                "Clamp the ball's x between rect.x and rect.x + width — that is the nearest x.",
                "Do the same with y.",
                "Measure the gap from the ball to that point.",
                "They touch if the gap is no bigger than BALL_RADIUS."
            ]
        },
        "starter": "def hits_rect(ball, rect):\n    # find the nearest point of the rectangle, then measure\n    pass\n",
        "answer": "def hits_rect(ball, rect):\n    nearest_x = max(rect[\"x\"], min(ball[\"x\"], rect[\"x\"] + rect[\"width\"]))\n    nearest_y = max(rect[\"y\"], min(ball[\"y\"], rect[\"y\"] + rect[\"height\"]))\n    gap_x = ball[\"x\"] - nearest_x\n    gap_y = ball[\"y\"] - nearest_y\n    return gap_x * gap_x + gap_y * gap_y <= BALL_RADIUS * BALL_RADIUS\n",
        "hints": [
            "max(low, min(value, high)) squeezes a number between two others.",
            "The distance between two points is sqrt(gap_x ** 2 + gap_y ** 2).",
            "You can skip the square root and compare with BALL_RADIUS * BALL_RADIUS."
        ],
        "tests": [
            {
                "name": "A ball in the middle of a brick is touching it",
                "code": "assert hits_rect({'x': 50, 'y': 50}, {'x': 40, 'y': 40, 'width': 40, 'height': 20}) is True"
            },
            {
                "name": "A ball far away is not",
                "code": "assert hits_rect({'x': 300, 'y': 300}, {'x': 40, 'y': 40, 'width': 40, 'height': 20}) is False"
            },
            {
                "name": "A ball just above the top edge is touching",
                "code": "assert hits_rect({'x': 60, 'y': 36}, {'x': 40, 'y': 40, 'width': 40, 'height': 20}) is True"
            },
            {
                "name": "A ball a long way above is not",
                "code": "assert hits_rect({'x': 60, 'y': 20}, {'x': 40, 'y': 40, 'width': 40, 'height': 20}) is False"
            },
            {
                "name": "It works off the left edge too",
                "code": "assert hits_rect({'x': 36, 'y': 50}, {'x': 40, 'y': 40, 'width': 40, 'height': 20}) is True"
            },
            {
                "name": "The corners work as well",
                "code": "brick = {'x': 40, 'y': 40, 'width': 40, 'height': 20}\nassert hits_rect({'x': 38, 'y': 38}, brick) is True\nassert hits_rect({'x': 34, 'y': 34}, brick) is False, 'measure BOTH directions'"
            },
            {
                "name": "It works on the paddle, not just bricks",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nassert hits_rect({'x': 130, 'y': PADDLE_Y + 4}, paddle_rect(state)) is True"
            }
        ],
        "demo": {
            "kind": "hit",
            "caption": "Walk the ball into the brick with the arrows and watch the answer flip."
        },
        "warning": "Measure the gap in BOTH directions. Checking only x would say a ball at the top of the field is touching a brick at the bottom."
    },
    {
        "id": "bounce_off_walls",
        "fnName": "bounce_off_walls",
        "title": "Bounce off the walls",
        "adds": "The ball stays in the box.",
        "intro": "<p>A bounce is far simpler than it looks: <strong>flip the direction</strong>. Hit the left or right wall and dx becomes -dx; hit the ceiling and dy becomes -dy.</p><p>Push the ball back to the edge first. Without that it can end up slightly inside the wall, flip, and get stuck flipping for ever — a bug that looks like the ball is vibrating in the corner.</p>",
        "spec": {
            "input": "ball — x, y, dx, dy",
            "output": "nothing; it changes the ball",
            "algorithm": [
                "If x is less than BALL_RADIUS: put x back to BALL_RADIUS and flip dx.",
                "If x is more than FIELD_WIDTH - BALL_RADIUS: put it back and flip dx.",
                "If y is less than BALL_RADIUS: put it back and flip dy.",
                "Do NOTHING at the bottom — that is where a life is lost."
            ]
        },
        "starter": "def bounce_off_walls(ball):\n    # left wall, right wall, ceiling - but not the floor\n    pass\n",
        "answer": "def bounce_off_walls(ball):\n    if ball[\"x\"] < BALL_RADIUS:\n        ball[\"x\"] = BALL_RADIUS\n        ball[\"dx\"] = -ball[\"dx\"]\n    if ball[\"x\"] > FIELD_WIDTH - BALL_RADIUS:\n        ball[\"x\"] = FIELD_WIDTH - BALL_RADIUS\n        ball[\"dx\"] = -ball[\"dx\"]\n    if ball[\"y\"] < BALL_RADIUS:\n        ball[\"y\"] = BALL_RADIUS\n        ball[\"dy\"] = -ball[\"dy\"]\n",
        "hints": [
            "Flipping a direction is just ball[\"dx\"] = -ball[\"dx\"]",
            "Move the ball back onto the edge BEFORE you flip it.",
            "Three separate ifs - a ball in a corner can hit two walls at once."
        ],
        "tests": [
            {
                "name": "A ball in the middle is left alone",
                "code": "ball = {'x': 160, 'y': 200, 'dx': 100, 'dy': -100}\nbounce_off_walls(ball)\nassert ball['x'] == 160 and ball['dx'] == 100"
            },
            {
                "name": "The left wall sends it right",
                "code": "ball = {'x': 1, 'y': 200, 'dx': -100, 'dy': 50}\nbounce_off_walls(ball)\nassert ball['dx'] == 100, f\"dx is {ball['dx']}\"\nassert ball['x'] == BALL_RADIUS"
            },
            {
                "name": "The right wall sends it left",
                "code": "ball = {'x': FIELD_WIDTH - 1, 'y': 200, 'dx': 100, 'dy': 50}\nbounce_off_walls(ball)\nassert ball['dx'] == -100"
            },
            {
                "name": "The ceiling sends it down",
                "code": "ball = {'x': 160, 'y': 1, 'dx': 100, 'dy': -100}\nbounce_off_walls(ball)\nassert ball['dy'] == 100 and ball['y'] == BALL_RADIUS"
            },
            {
                "name": "The floor is NOT a wall",
                "code": "ball = {'x': 160, 'y': FIELD_HEIGHT + 5, 'dx': 100, 'dy': 100}\nbounce_off_walls(ball)\nassert ball['dy'] == 100, 'the ball must be allowed to fall off the bottom'"
            },
            {
                "name": "A ball loose in the box never escapes",
                "code": "ball = {'x': 160, 'y': 200, 'dx': 411, 'dy': -389}\nfor i in range(4000):\n    ball['x'] += ball['dx'] * 0.016\n    ball['y'] += ball['dy'] * 0.016\n    if ball['y'] > FIELD_HEIGHT - BALL_RADIUS:\n        ball['y'] = FIELD_HEIGHT - BALL_RADIUS\n        ball['dy'] = -abs(ball['dy'])\n    bounce_off_walls(ball)\n    assert 0 <= ball['x'] <= FIELD_WIDTH, f'it escaped sideways at frame {i}'\n    assert ball['y'] >= 0, f'it escaped through the ceiling at frame {i}'"
            }
        ],
        "demo": {
            "kind": "walls",
            "caption": "The ball is loose in an empty box. Speed it up and see if it can escape."
        },
        "warning": "Push the ball back onto the edge before flipping it. Otherwise it can flip again next frame while still inside the wall — and get stuck buzzing there."
    },
    {
        "id": "move_paddle",
        "fnName": "move_paddle",
        "title": "Slide the paddle",
        "adds": "You can move!",
        "intro": "<p><code>state.steering</code> is -1, 0 or 1: the keyboard sets it while a key is held down.</p><p>Distance = speed × time, as always. Then keep the paddle on the field: not past 0 on the left, and not past FIELD_WIDTH - PADDLE_WIDTH on the right (that is the x of its LEFT edge when its RIGHT edge is against the wall).</p>",
        "spec": {
            "input": "state, seconds",
            "output": "nothing; it changes state.paddleX",
            "algorithm": [
                "Work out the new x: paddleX + steering × PADDLE_SPEED × seconds.",
                "Never let it go below 0.",
                "Never let it go above FIELD_WIDTH - PADDLE_WIDTH.",
                "Save it back into state.paddleX."
            ]
        },
        "starter": "def move_paddle(state, seconds):\n    # move by steering x speed x time, then stay on the field\n    pass\n",
        "answer": "def move_paddle(state, seconds):\n    x = state[\"paddle_x\"] + state[\"steering\"] * PADDLE_SPEED * seconds\n    state[\"paddle_x\"] = max(0, min(FIELD_WIDTH - PADDLE_WIDTH, x))\n",
        "hints": [
            "Multiplying by steering handles -1, 0 and 1 all at once.",
            "max(0, min(limit, x)) keeps x between 0 and limit.",
            "The right-hand limit is FIELD_WIDTH - PADDLE_WIDTH."
        ],
        "tests": [
            {
                "name": "Steering right moves it right",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['steering'] = 1\nmove_paddle(state, 0.1)\nassert abs(state['paddle_x'] - 134) < 0.001, f\"gave {state['paddle_x']}\""
            },
            {
                "name": "Steering left moves it left",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['steering'] = -1\nmove_paddle(state, 0.1)\nassert abs(state['paddle_x'] - 66) < 0.001"
            },
            {
                "name": "Not steering leaves it alone",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['steering'] = 0\nmove_paddle(state, 0.1)\nassert state['paddle_x'] == 100"
            },
            {
                "name": "A longer frame moves it further",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['steering'] = 1\nmove_paddle(state, 0.2)\nassert abs(state['paddle_x'] - 168) < 0.001, 'the time must be part of the sum'"
            },
            {
                "name": "It cannot slide off the left",
                "code": "state = create_game()\nstate['paddle_x'] = 5\nstate['steering'] = -1\nmove_paddle(state, 1)\nassert state['paddle_x'] == 0"
            },
            {
                "name": "It cannot slide off the right",
                "code": "state = create_game()\nstate['paddle_x'] = FIELD_WIDTH - PADDLE_WIDTH - 5\nstate['steering'] = 1\nmove_paddle(state, 1)\nassert state['paddle_x'] == FIELD_WIDTH - PADDLE_WIDTH"
            }
        ],
        "demo": {
            "kind": "paddle",
            "caption": "Steer the paddle and try to shove it off either side."
        }
    },
    {
        "id": "bounce_off_paddle",
        "fnName": "bounce_off_paddle",
        "title": "Bat the ball back",
        "adds": "Now it is a game and not a screensaver.",
        "intro": "<p>Bouncing off the paddle could be one line — flip dy. But then every game would be identical and the player would have nothing to do.</p><p>So the bounce depends on <em>where</em> the ball lands. Hit the middle and it goes straight up; hit near an edge and it flies off at an angle. That one idea is what turns Breakout from luck into skill.</p>",
        "spec": {
            "input": "state",
            "output": "True if the paddle hit the ball",
            "algorithm": [
                "Do nothing unless the ball is falling (dy is more than 0) AND hits-rect says it touches the paddle.",
                "Work out the offset: how far the ball is from the middle of the paddle, divided by half the paddle's width. That gives -1 at the left edge, 0 in the middle, +1 at the right.",
                "Send the ball upwards: dy becomes minus its size.",
                "Set dx to offset × 240, and put the ball on top of the paddle.",
                "Return True."
            ]
        },
        "starter": "def bounce_off_paddle(state):\n    # only when falling and touching\n    # the angle comes from where it hit\n    pass\n",
        "answer": "def bounce_off_paddle(state):\n    if state[\"ball\"][\"dy\"] <= 0 or not hits_rect(state[\"ball\"], paddle_rect(state)):\n        return False\n    middle = state[\"paddle_x\"] + PADDLE_WIDTH / 2\n    offset = (state[\"ball\"][\"x\"] - middle) / (PADDLE_WIDTH / 2)\n    state[\"ball\"][\"dy\"] = -abs(state[\"ball\"][\"dy\"])\n    state[\"ball\"][\"dx\"] = offset * 240\n    state[\"ball\"][\"y\"] = PADDLE_Y - BALL_RADIUS\n    return True\n",
        "hints": [
            "Use the hits_rect you already wrote, with paddle_rect(state).",
            "-abs(dy) always means 'upwards'.",
            "offset = (ball x - middle) / (PADDLE_WIDTH / 2)"
        ],
        "tests": [
            {
                "name": "A falling ball on the paddle is sent back up",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['ball'] = {'x': 137, 'y': PADDLE_Y + 2, 'dx': 0, 'dy': 200}\nassert bounce_off_paddle(state) is True\nassert state['ball']['dy'] < 0"
            },
            {
                "name": "A ball already going up is left alone",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['ball'] = {'x': 137, 'y': PADDLE_Y + 2, 'dx': 0, 'dy': -200}\nassert bounce_off_paddle(state) is False"
            },
            {
                "name": "A ball nowhere near the paddle is left alone",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['ball'] = {'x': 20, 'y': 100, 'dx': 0, 'dy': 200}\nassert bounce_off_paddle(state) is False"
            },
            {
                "name": "The middle sends it straight up",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['ball'] = {'x': 100 + PADDLE_WIDTH / 2, 'y': PADDLE_Y + 2, 'dx': 90, 'dy': 200}\nbounce_off_paddle(state)\nassert abs(state['ball']['dx']) < 1, f\"dx is {state['ball']['dx']}\""
            },
            {
                "name": "The right-hand edge sends it right",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['ball'] = {'x': 100 + PADDLE_WIDTH - 2, 'y': PADDLE_Y + 2, 'dx': 0, 'dy': 200}\nbounce_off_paddle(state)\nassert state['ball']['dx'] > 100"
            },
            {
                "name": "The left-hand edge sends it left",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['ball'] = {'x': 102, 'y': PADDLE_Y + 2, 'dx': 0, 'dy': 200}\nbounce_off_paddle(state)\nassert state['ball']['dx'] < -100"
            },
            {
                "name": "The ball is lifted clear of the paddle",
                "code": "state = create_game()\nstate['paddle_x'] = 100\nstate['ball'] = {'x': 137, 'y': PADDLE_Y + 6, 'dx': 0, 'dy': 200}\nbounce_off_paddle(state)\nassert state['ball']['y'] <= PADDLE_Y"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "robot": true
            },
            "caption": "A robot hand keeps the paddle under the ball so you can watch the angles."
        },
        "warning": "Only bounce a ball that is FALLING. A ball that is already going up would be flipped again and again and stick to the paddle."
    },
    {
        "id": "break_bricks",
        "fnName": "break_bricks",
        "title": "Break the bricks",
        "adds": "The whole game works!",
        "intro": "<p>The last rule: find the brick the ball is touching, take it out of the wall, bounce, and score.</p><p>Stop after the <em>first</em> brick you find. Without that a fast ball could clear a whole row in one frame, which looks like a glitch and makes the game far too easy.</p>",
        "spec": {
            "input": "state",
            "output": "True if a brick was broken",
            "algorithm": [
                "Look at every row and column.",
                "Skip bricks that are already gone.",
                "If hits-rect says the ball touches this brick's rectangle: set it to false, flip the ball's dy, and add score-for-brick(row) points.",
                "If no bricks are left, the game is won and over.",
                "Return True straight away — one brick per frame."
            ]
        },
        "starter": "def break_bricks(state):\n    # find the first brick the ball touches, and knock it out\n    pass\n",
        "answer": "def break_bricks(state):\n    for row in range(BRICK_ROWS):\n        for column in range(BRICK_COLUMNS):\n            index = brick_index(column, row)\n            if state[\"bricks\"][index] and hits_rect(state[\"ball\"], brick_rect(column, row)):\n                state[\"bricks\"][index] = False\n                state[\"ball\"][\"dy\"] = -state[\"ball\"][\"dy\"]\n                state[\"score\"] += score_for_brick(row)\n                if bricks_left(state) == 0:\n                    state[\"is_won\"] = True\n                    state[\"is_over\"] = True\n                return True\n    return False\n",
        "hints": [
            "Two loops: for row in range(BRICK_ROWS), and for column inside it.",
            "brick_index(column, row) finds the brick's place in state['bricks'].",
            "return True inside the if - that is what stops it at one brick."
        ],
        "tests": [
            {
                "name": "A ball inside a brick breaks it",
                "code": "state = create_game()\nr = brick_rect(2, 1)\nstate['ball'] = {'x': r['x'] + r['width'] / 2, 'y': r['y'] + r['height'] / 2, 'dx': 0, 'dy': -100}\nassert break_bricks(state) is True\nassert state['bricks'][brick_index(2, 1)] is False"
            },
            {
                "name": "The ball bounces back",
                "code": "state = create_game()\nr = brick_rect(2, 1)\nstate['ball'] = {'x': r['x'] + r['width'] / 2, 'y': r['y'] + r['height'] / 2, 'dx': 0, 'dy': -100}\nbreak_bricks(state)\nassert state['ball']['dy'] == 100"
            },
            {
                "name": "Breaking a brick scores",
                "code": "state = create_game()\nr = brick_rect(0, 0)\nstate['ball'] = {'x': r['x'] + r['width'] / 2, 'y': r['y'] + r['height'] / 2, 'dx': 0, 'dy': -100}\nbreak_bricks(state)\nassert state['score'] == score_for_brick(0)"
            },
            {
                "name": "A ball in open space breaks nothing",
                "code": "state = create_game()\nstate['ball'] = {'x': 160, 'y': 300, 'dx': 0, 'dy': -100}\nassert break_bricks(state) is False\nassert bricks_left(state) == BRICK_COLUMNS * BRICK_ROWS"
            },
            {
                "name": "Only ONE brick goes per frame",
                "code": "state = create_game()\nstate['ball'] = {'x': 160, 'y': BRICK_TOP + 40, 'dx': 0, 'dy': -100}\nbreak_bricks(state)\ngone = BRICK_COLUMNS * BRICK_ROWS - bricks_left(state)\nassert gone <= 1, f'it took out {gone} bricks in one frame'"
            },
            {
                "name": "A brick already broken is not broken again",
                "code": "state = create_game()\nr = brick_rect(2, 1)\nstate['bricks'][brick_index(2, 1)] = False\nstate['ball'] = {'x': r['x'] + r['width'] / 2, 'y': r['y'] + r['height'] / 2, 'dx': 0, 'dy': -100}\nassert break_bricks(state) is False"
            },
            {
                "name": "The last brick wins the game",
                "code": "state = create_game()\nstate['bricks'] = [False] * (BRICK_COLUMNS * BRICK_ROWS)\nstate['bricks'][brick_index(2, 1)] = True\nr = brick_rect(2, 1)\nstate['ball'] = {'x': r['x'] + r['width'] / 2, 'y': r['y'] + r['height'] / 2, 'dx': 0, 'dy': -100}\nbreak_bricks(state)\nassert state['is_won'] is True and state['is_over'] is True"
            }
        ],
        "demo": {
            "kind": "game",
            "flags": {
                "robot": true
            },
            "caption": "A robot player clears the wall — every function you have written is running here."
        },
        "warning": "Return as soon as you break one brick. A ball that clears a whole row in one frame is the classic Breakout bug."
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Take control",
        "adds": "You can play it yourself.",
        "intro": "<p>One last function to hand the keyboard over to a human.</p><p>Notice how this one does not touch the game at all: it only turns a key into a WORD. The page then decides what that word means. Keeping the two apart is why the buttons, the mouse and the keyboard can all drive the same game.</p>",
        "spec": {
            "input": "key — the name of the key that was pressed",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Left arrow or A → 'left'.",
                "Right arrow or D → 'right'.",
                "Space or P → 'pause'.",
                "R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "def action_for_key(key):\n    keys = {\n        # \"arrowleft\": \"left\", ...\n    }\n    return keys.get(str(key).lower())\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \" \": \"pause\", \"spacebar\": \"pause\", \"p\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "A dictionary is the neatest way: every key name points at an action.",
            "keys.get(...) gives None when the key is not in the dictionary - exactly what you want.",
            "Do not forget \" \" for the space bar."
        ],
        "tests": [
            {
                "name": "The arrows steer",
                "code": "assert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "A and D steer too",
                "code": "assert action_for_key('a') == 'left'\nassert action_for_key('d') == 'right'"
            },
            {
                "name": "Capital letters work",
                "code": "assert action_for_key('A') == 'left'\nassert action_for_key('R') == 'restart'"
            },
            {
                "name": "Space launches the ball",
                "code": "assert action_for_key(' ') == 'pause'"
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
            "caption": "Click the page, then play it with the arrow keys — the game is entirely yours now."
        }
    }
];
