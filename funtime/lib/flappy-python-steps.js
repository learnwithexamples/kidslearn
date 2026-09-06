/* ============================================================
   flappy-python-steps.js - the 8 steps of "Build Flappy in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const FLAPPY_PYTHON_STEPS = [
    {
        "id": "apply_gravity",
        "fnName": "apply_gravity",
        "title": "Make the bird fall",
        "adds": "Gravity! The bird drops out of the sky.",
        "intro": "<p>Here is the idea that makes every falling thing in every game work.</p><p>Gravity does not move the bird. It changes the bird's <strong>speed</strong>. Each frame the bird falls a little faster than the frame before, which is exactly what real falling looks like.</p><p>So there are two sums, in this order: first speed changes, then position changes.</p>",
        "spec": {
            "input": "bird — something with y and dy. seconds — how long this frame took.",
            "output": "nothing; it changes the bird",
            "algorithm": [
                "Add GRAVITY × seconds to the bird's dy.",
                "If dy is now bigger than MAX_FALL_SPEED, hold it there.",
                "Move the bird: add dy × seconds to its y."
            ]
        },
        "starter": "def apply_gravity(bird, seconds):\n    # 1. speed up\n    # 2. don't fall TOO fast\n    # 3. move\n    pass\n",
        "answer": "def apply_gravity(bird, seconds):\n    bird[\"dy\"] += GRAVITY * seconds\n    if bird[\"dy\"] > MAX_FALL_SPEED:\n        bird[\"dy\"] = MAX_FALL_SPEED\n    bird[\"y\"] += bird[\"dy\"] * seconds\n",
        "hints": [
            "dy is the speed; y is the place. Gravity changes the speed.",
            "The order matters: change dy first, then use it to move y.",
            "bird[\"dy\"] += GRAVITY * seconds"
        ],
        "tests": [
            {
                "name": "Gravity speeds the bird up",
                "code": "bird = {'y': 100, 'dy': 0}\napply_gravity(bird, 0.1)\nassert abs(bird['dy'] - 90) < 0.001, f\"dy is {bird['dy']}\""
            },
            {
                "name": "A falling bird moves down",
                "code": "bird = {'y': 100, 'dy': 200}\napply_gravity(bird, 0.1)\nassert bird['y'] > 100"
            },
            {
                "name": "A flapping bird still rises for a moment",
                "code": "bird = {'y': 100, 'dy': -300}\napply_gravity(bird, 0.1)\nassert bird['y'] < 100, 'a bird moving upwards should go UP'"
            },
            {
                "name": "It falls further every frame",
                "code": "bird = {'y': 0, 'dy': 0}\napply_gravity(bird, 0.1)\nfirst = bird['y']\nmid = bird['y']\napply_gravity(bird, 0.1)\nsecond = bird['y'] - mid\nassert second > first, 'each frame should be a bigger drop than the last'"
            },
            {
                "name": "It never falls faster than MAX_FALL_SPEED",
                "code": "bird = {'y': 0, 'dy': 0}\nfor _ in range(200):\n    apply_gravity(bird, 0.1)\nassert bird['dy'] <= MAX_FALL_SPEED, f\"dy reached {bird['dy']}\""
            },
            {
                "name": "A longer frame falls further",
                "code": "slow = {'y': 0, 'dy': 0}\nfast = {'y': 0, 'dy': 0}\napply_gravity(slow, 0.05)\napply_gravity(fast, 0.1)\nassert fast['y'] > slow['y']"
            }
        ],
        "demo": {
            "kind": "fall",
            "caption": "The bird falls faster and faster, then starts again from the top."
        },
        "warning": "Speed first, then position. Move the bird before changing dy and the fall is subtly wrong — and much harder to debug than to get right."
    },
    {
        "id": "flap",
        "fnName": "flap",
        "title": "Flap!",
        "adds": "The bird can fly.",
        "intro": "<p>The player has exactly one control in this whole game.</p><p>The important word here is <strong>set</strong>, not add. <code>dy = FLAP_SPEED</code> means every flap feels identical whether the bird was climbing or plummeting. If you added to dy instead, a bird that had been falling for a while would barely respond — and the game would feel broken without anyone being able to say why.</p>",
        "spec": {
            "input": "bird",
            "output": "nothing; it changes bird.dy",
            "algorithm": [
                "Set the bird's dy to FLAP_SPEED. One line."
            ]
        },
        "starter": "def flap(bird):\n    # straight up, every time\n    pass\n",
        "answer": "def flap(bird):\n    bird[\"dy\"] = FLAP_SPEED\n",
        "hints": [
            "FLAP_SPEED is already negative - on a canvas, up is negative.",
            "One line, one equals sign.",
            "bird[\"dy\"] = FLAP_SPEED"
        ],
        "tests": [
            {
                "name": "A flap sends the bird upwards",
                "code": "bird = {'y': 100, 'dy': 0}\nflap(bird)\nassert bird['dy'] < 0, 'up is NEGATIVE on a canvas'"
            },
            {
                "name": "A flap sets the speed exactly",
                "code": "bird = {'y': 100, 'dy': 0}\nflap(bird)\nassert bird['dy'] == FLAP_SPEED"
            },
            {
                "name": "It works just as well on a plummeting bird",
                "code": "bird = {'y': 100, 'dy': 400}\nflap(bird)\nassert bird['dy'] == FLAP_SPEED, 'did you ADD to dy instead of setting it?'"
            },
            {
                "name": "Two flaps in a row are not twice as strong",
                "code": "bird = {'y': 100, 'dy': 0}\nflap(bird)\nflap(bird)\nassert bird['dy'] == FLAP_SPEED"
            },
            {
                "name": "It does not teleport the bird",
                "code": "bird = {'y': 100, 'dy': 0}\nflap(bird)\nassert bird['y'] == 100, 'a flap changes the SPEED - gravity does the moving'"
            }
        ],
        "demo": {
            "kind": "fly",
            "caption": "Press FLAP! and keep the bird in the air as long as you can."
        }
    },
    {
        "id": "pipe_rects",
        "fnName": "pipe_rects",
        "title": "Build a pipe",
        "adds": "Pipes appear in the sky.",
        "intro": "<p>A pipe is stored as just two numbers: its <code>x</code>, and <code>gapY</code> — the top of the hole you fly through.</p><p>Everything else is worked out from those. The top half runs from the ceiling down to the gap. The bottom half starts where the gap ends and runs to the ground.</p>",
        "spec": {
            "input": "pipe — x and gapY",
            "output": "an object with a top rectangle and a bottom rectangle",
            "algorithm": [
                "The top piece starts at y 0 and its height is gapY.",
                "The bottom piece starts at gapY + GAP_HEIGHT.",
                "Its height reaches down to GROUND_Y.",
                "Both are PIPE_WIDTH wide and both start at the pipe's x."
            ]
        },
        "starter": "def pipe_rects(pipe):\n    return {\n        \"top\": {\"x\": pipe[\"x\"], \"y\": 0, \"width\": PIPE_WIDTH, \"height\": 0},\n        \"bottom\": {\"x\": pipe[\"x\"], \"y\": 0, \"width\": PIPE_WIDTH, \"height\": 0},\n    }\n",
        "answer": "def pipe_rects(pipe):\n    return {\n        \"top\": {\"x\": pipe[\"x\"], \"y\": 0, \"width\": PIPE_WIDTH, \"height\": pipe[\"gap_y\"]},\n        \"bottom\": {\n            \"x\": pipe[\"x\"],\n            \"y\": pipe[\"gap_y\"] + GAP_HEIGHT,\n            \"width\": PIPE_WIDTH,\n            \"height\": GROUND_Y - (pipe[\"gap_y\"] + GAP_HEIGHT),\n        },\n    }\n",
        "hints": [
            "The top piece's height IS gap_y - it fills everything above the gap.",
            "The bottom piece begins at gap_y + GAP_HEIGHT.",
            "Its height is GROUND_Y minus where it begins."
        ],
        "tests": [
            {
                "name": "The top piece starts at the ceiling",
                "code": "r = pipe_rects({'x': 100, 'gap_y': 150})\nassert r['top']['y'] == 0"
            },
            {
                "name": "The top piece reaches the gap",
                "code": "r = pipe_rects({'x': 100, 'gap_y': 150})\nassert r['top']['height'] == 150"
            },
            {
                "name": "The bottom piece starts below the gap",
                "code": "r = pipe_rects({'x': 100, 'gap_y': 150})\nassert r['bottom']['y'] == 150 + GAP_HEIGHT"
            },
            {
                "name": "The bottom piece reaches the ground",
                "code": "r = pipe_rects({'x': 100, 'gap_y': 150})\nassert abs(r['bottom']['y'] + r['bottom']['height'] - GROUND_Y) < 0.001"
            },
            {
                "name": "Both halves are at the pipe's x",
                "code": "r = pipe_rects({'x': 100, 'gap_y': 150})\nassert r['top']['x'] == 100 and r['bottom']['x'] == 100"
            },
            {
                "name": "Both halves are PIPE_WIDTH wide",
                "code": "r = pipe_rects({'x': 100, 'gap_y': 150})\nassert r['top']['width'] == PIPE_WIDTH and r['bottom']['width'] == PIPE_WIDTH"
            },
            {
                "name": "The gap really is GAP_HEIGHT tall",
                "code": "r = pipe_rects({'x': 100, 'gap_y': 90})\nassert r['bottom']['y'] - (r['top']['y'] + r['top']['height']) == GAP_HEIGHT"
            }
        ],
        "demo": {
            "kind": "pipe",
            "caption": "Slide the gap up and down and watch both halves resize themselves."
        }
    },
    {
        "id": "overlaps",
        "fnName": "overlaps",
        "title": "Do two boxes touch?",
        "adds": "The game can tell when you have crashed.",
        "intro": "<p>This one function is the crash test for the whole game, and it is used in almost every game ever written.</p><p>Rather than working out when two boxes DO touch, it is far easier to list the four ways they can MISS: one is entirely left of the other, entirely right, entirely above, or entirely below. If none of those escapes is true, they must be touching.</p>",
        "spec": {
            "input": "a, b — two rectangles with x, y, width, height",
            "output": "True if they overlap",
            "algorithm": [
                "a is left of b if a.x + a.width is not past b.x.",
                "a is right of b if a.x is not before b.x + b.width.",
                "The same two tests again with y and height.",
                "They touch when none of those four is true."
            ]
        },
        "starter": "def overlaps(a, b):\n    # they touch unless one is completely past the other\n    pass\n",
        "answer": "def overlaps(a, b):\n    return (a[\"x\"] < b[\"x\"] + b[\"width\"]\n            and a[\"x\"] + a[\"width\"] > b[\"x\"]\n            and a[\"y\"] < b[\"y\"] + b[\"height\"]\n            and a[\"y\"] + a[\"height\"] > b[\"y\"])\n",
        "hints": [
            "Four comparisons joined with `and`.",
            "a['x'] < b['x'] + b['width'] means 'a starts before b ends'.",
            "Do the same pair of tests for y that you did for x."
        ],
        "tests": [
            {
                "name": "Two boxes on top of each other overlap",
                "code": "assert overlaps({'x': 0, 'y': 0, 'width': 10, 'height': 10}, {'x': 5, 'y': 5, 'width': 10, 'height': 10}) is True"
            },
            {
                "name": "Boxes far apart do not",
                "code": "assert overlaps({'x': 0, 'y': 0, 'width': 10, 'height': 10}, {'x': 100, 'y': 100, 'width': 10, 'height': 10}) is False"
            },
            {
                "name": "Side by side but not touching",
                "code": "assert overlaps({'x': 0, 'y': 0, 'width': 10, 'height': 10}, {'x': 20, 'y': 0, 'width': 10, 'height': 10}) is False"
            },
            {
                "name": "One above the other does not count",
                "code": "assert overlaps({'x': 0, 'y': 0, 'width': 10, 'height': 10}, {'x': 0, 'y': 40, 'width': 10, 'height': 10}) is False"
            },
            {
                "name": "Lined up across but apart down is still a miss",
                "code": "assert overlaps({'x': 0, 'y': 0, 'width': 10, 'height': 10}, {'x': 5, 'y': 40, 'width': 10, 'height': 10}) is False, 'check BOTH directions'"
            },
            {
                "name": "Just touching edges does not count",
                "code": "assert overlaps({'x': 0, 'y': 0, 'width': 10, 'height': 10}, {'x': 10, 'y': 0, 'width': 10, 'height': 10}) is False"
            },
            {
                "name": "A tiny overlap does count",
                "code": "assert overlaps({'x': 0, 'y': 0, 'width': 10, 'height': 10}, {'x': 9, 'y': 0, 'width': 10, 'height': 10}) is True"
            },
            {
                "name": "The real bird and a real pipe agree",
                "code": "assert hits_pipe({'y': 10, 'dy': 0}, {'x': BIRD_X, 'gap_y': 200}) is True\nassert hits_pipe({'y': 220, 'dy': 0}, {'x': BIRD_X, 'gap_y': 200}) is False"
            }
        ],
        "demo": {
            "kind": "overlap",
            "caption": "Move the bird and the pipe around each other and watch the answer flip."
        },
        "warning": "Both directions matter. A test that only looks at x would say a bird at the top of the sky has crashed into a pipe way below it."
    },
    {
        "id": "move_pipes",
        "fnName": "move_pipes",
        "title": "Slide the pipes past",
        "adds": "The world starts moving.",
        "intro": "<p>The bird never actually goes anywhere — it only goes up and down. It is the <em>pipes</em> that move, and that is what makes it feel like flying.</p><p>This function does two jobs at once: move everything left, and throw away anything that has gone off the left-hand edge. Forget the second job and the list grows for ever until the game slows to a crawl.</p>",
        "spec": {
            "input": "pipes — the list. distance — how far to move them.",
            "output": "a NEW list, moved, without the pipes that have gone",
            "algorithm": [
                "Make an empty list for the answer.",
                "For each pipe, make a copy whose x is distance smaller. Keep gapY and passed.",
                "Only add it to the answer if its right-hand edge (x + PIPE_WIDTH) is still above 0.",
                "Return the new list."
            ]
        },
        "starter": "def move_pipes(pipes, distance):\n    # move them all left, drop the ones that have gone\n    pass\n",
        "answer": "def move_pipes(pipes, distance):\n    moved = []\n    for pipe in pipes:\n        shifted = {\"x\": pipe[\"x\"] - distance, \"gap_y\": pipe[\"gap_y\"], \"passed\": pipe[\"passed\"]}\n        if shifted[\"x\"] + PIPE_WIDTH > 0:\n            moved.append(shifted)\n    return moved\n",
        "hints": [
            "Moving left means SUBTRACTING from x.",
            "Copy gap_y and passed too, or the pipe forgets where its hole is.",
            "A pipe is gone when x + PIPE_WIDTH is no longer above 0."
        ],
        "tests": [
            {
                "name": "Pipes move to the left",
                "code": "moved = move_pipes([{'x': 200, 'gap_y': 100, 'passed': False}], 50)\nassert moved[0]['x'] == 150"
            },
            {
                "name": "The gap goes with the pipe",
                "code": "moved = move_pipes([{'x': 200, 'gap_y': 137, 'passed': False}], 50)\nassert moved[0]['gap_y'] == 137"
            },
            {
                "name": "Pipes that have scrolled away are dropped",
                "code": "moved = move_pipes([{'x': 10, 'gap_y': 100, 'passed': True}], 100)\nassert moved == []"
            },
            {
                "name": "A pipe still half on screen is kept",
                "code": "moved = move_pipes([{'x': 10, 'gap_y': 100, 'passed': True}], 30)\nassert len(moved) == 1"
            },
            {
                "name": "Several pipes all move",
                "code": "moved = move_pipes([{'x': 100, 'gap_y': 1, 'passed': False}, {'x': 300, 'gap_y': 2, 'passed': False}], 40)\nassert len(moved) == 2 and moved[0]['x'] == 60 and moved[1]['x'] == 260"
            },
            {
                "name": "The 'passed' flag is not forgotten",
                "code": "moved = move_pipes([{'x': 200, 'gap_y': 100, 'passed': True}], 10)\nassert moved[0]['passed'] is True, 'lose this and the pipe scores over and over'"
            },
            {
                "name": "The list you were given is left alone",
                "code": "before = [{'x': 200, 'gap_y': 100, 'passed': False}]\nmove_pipes(before, 50)\nassert before[0]['x'] == 200, 'make copies'"
            }
        ],
        "demo": {
            "kind": "scroll",
            "caption": "Pipes stream past for ever, but the list never grows past a few."
        },
        "warning": "Throw away the pipes that have scrolled off. A list that only ever grows is the classic way to make a game get slower the longer it is played."
    },
    {
        "id": "is_crashed",
        "fnName": "is_crashed",
        "title": "Have we crashed?",
        "adds": "The game can end.",
        "intro": "<p>Three ways to lose: hit the ground, hit the ceiling, or hit a pipe.</p><p>Notice that this function only <em>answers a question</em> — it does not end the game itself. Keeping the question and the consequence apart is what lets the same function be used by the game, by the demo beside you, and by the tests.</p>",
        "spec": {
            "input": "state",
            "output": "True if the bird has hit anything",
            "algorithm": [
                "The ground: the bird's y plus BIRD_SIZE has reached GROUND_Y.",
                "The ceiling: the bird's y is above 0.",
                "The pipes: hits-pipe says yes for any pipe in the list.",
                "Otherwise, False."
            ]
        },
        "starter": "def is_crashed(state):\n    # ground, ceiling, pipes\n    pass\n",
        "answer": "def is_crashed(state):\n    if state[\"bird\"][\"y\"] + BIRD_SIZE >= GROUND_Y:\n        return True\n    if state[\"bird\"][\"y\"] < 0:\n        return True\n    return any(hits_pipe(state[\"bird\"], pipe) for pipe in state[\"pipes\"])\n",
        "hints": [
            "The bird's y is its TOP, so the ground test needs + BIRD_SIZE.",
            "hits_pipe is already written for you.",
            "any(...) is True when at least one pipe was hit."
        ],
        "tests": [
            {
                "name": "A bird in clear sky is fine",
                "code": "assert is_crashed({'bird': {'y': 200, 'dy': 0}, 'pipes': []}) is False"
            },
            {
                "name": "Hitting the ground is a crash",
                "code": "assert is_crashed({'bird': {'y': GROUND_Y - BIRD_SIZE + 1, 'dy': 0}, 'pipes': []}) is True"
            },
            {
                "name": "Flying off the top is a crash",
                "code": "assert is_crashed({'bird': {'y': -2, 'dy': 0}, 'pipes': []}) is True"
            },
            {
                "name": "Just above the ground is not",
                "code": "assert is_crashed({'bird': {'y': GROUND_Y - BIRD_SIZE - 5, 'dy': 0}, 'pipes': []}) is False"
            },
            {
                "name": "Flying into a pipe is a crash",
                "code": "assert is_crashed({'bird': {'y': 10, 'dy': 0}, 'pipes': [{'x': BIRD_X, 'gap_y': 200, 'passed': False}]}) is True"
            },
            {
                "name": "Flying through the gap is safe",
                "code": "assert is_crashed({'bird': {'y': 220, 'dy': 0}, 'pipes': [{'x': BIRD_X, 'gap_y': 200, 'passed': False}]}) is False"
            },
            {
                "name": "Every pipe is checked, not just the first",
                "code": "state = {'bird': {'y': 10, 'dy': 0}, 'pipes': [{'x': 250, 'gap_y': 200, 'passed': False}, {'x': BIRD_X, 'gap_y': 200, 'passed': False}]}\nassert is_crashed(state) is True"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "robot": true
            },
            "caption": "A robot pilot flies the practice sky — it starts again whenever it crashes."
        }
    },
    {
        "id": "score_passed_pipes",
        "fnName": "score_passed_pipes",
        "title": "Count the pipes",
        "adds": "The whole game works!",
        "intro": "<p>The score goes up by one for every pipe the bird gets past. The problem is that the game asks this question sixty times a second, and the pipe stays behind the bird for a long time.</p><p>The answer is the <code>passed</code> flag: score the pipe once, then mark it, and never score it again. That little flag is the difference between a score of 1 and a score of 200.</p>",
        "spec": {
            "input": "state",
            "output": "nothing; it changes the score",
            "algorithm": [
                "Look at every pipe.",
                "Skip any that are already marked passed.",
                "A pipe is behind the bird when its x plus PIPE_WIDTH is less than BIRD_X.",
                "When it is: mark it passed and add 1 to the score."
            ]
        },
        "starter": "def score_passed_pipes(state):\n    # one point per pipe - but only once each!\n    pass\n",
        "answer": "def score_passed_pipes(state):\n    for pipe in state[\"pipes\"]:\n        if not pipe[\"passed\"] and pipe[\"x\"] + PIPE_WIDTH < BIRD_X:\n            pipe[\"passed\"] = True\n            state[\"score\"] += 1\n",
        "hints": [
            "Two things have to be true: not already passed, AND behind the bird.",
            "Set pipe['passed'] = True, or it will score every frame.",
            "The right-hand edge of the pipe is pipe['x'] + PIPE_WIDTH."
        ],
        "tests": [
            {
                "name": "Getting past a pipe scores a point",
                "code": "state = {'score': 0, 'bird': {'y': 200, 'dy': 0}, 'pipes': [{'x': 10, 'gap_y': 100, 'passed': False}]}\nscore_passed_pipes(state)\nassert state['score'] == 1"
            },
            {
                "name": "A pipe still ahead scores nothing",
                "code": "state = {'score': 0, 'bird': {'y': 200, 'dy': 0}, 'pipes': [{'x': 200, 'gap_y': 100, 'passed': False}]}\nscore_passed_pipes(state)\nassert state['score'] == 0"
            },
            {
                "name": "The pipe is marked as counted",
                "code": "state = {'score': 0, 'bird': {'y': 200, 'dy': 0}, 'pipes': [{'x': 10, 'gap_y': 100, 'passed': False}]}\nscore_passed_pipes(state)\nassert state['pipes'][0]['passed'] is True"
            },
            {
                "name": "The same pipe never scores twice",
                "code": "state = {'score': 0, 'bird': {'y': 200, 'dy': 0}, 'pipes': [{'x': 10, 'gap_y': 100, 'passed': False}]}\nfor _ in range(60):\n    score_passed_pipes(state)\nassert state['score'] == 1, f\"score is {state['score']}\""
            },
            {
                "name": "Two pipes are worth two points",
                "code": "state = {'score': 0, 'bird': {'y': 200, 'dy': 0}, 'pipes': [{'x': 5, 'gap_y': 100, 'passed': False}, {'x': 12, 'gap_y': 100, 'passed': False}]}\nscore_passed_pipes(state)\nassert state['score'] == 2"
            },
            {
                "name": "A pipe already marked is left alone",
                "code": "state = {'score': 7, 'bird': {'y': 200, 'dy': 0}, 'pipes': [{'x': 10, 'gap_y': 100, 'passed': True}]}\nscore_passed_pipes(state)\nassert state['score'] == 7"
            }
        ],
        "demo": {
            "kind": "game",
            "flags": {
                "robot": true
            },
            "caption": "The robot flies the real game and the score climbs — every function you wrote is running here."
        },
        "warning": "Without the `passed` flag the score jumps by sixty a second. With it, one pipe is one point."
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Take the controls",
        "adds": "You can play it yourself.",
        "intro": "<p>One function left, and it is the shortest in the game — because there is only one thing a player can do.</p>",
        "spec": {
            "input": "key — the name of the key that was pressed",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Space, the up arrow or W → 'flap'.",
                "P → 'pause'.",
                "R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "def action_for_key(key):\n    keys = {\n        # \" \": \"flap\", ...\n    }\n    return keys.get(str(key).lower())\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \" \": \"flap\", \"spacebar\": \"flap\", \"arrowup\": \"flap\", \"w\": \"flap\",\n        \"p\": \"pause\", \"r\": \"restart\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "A dictionary is the neatest way.",
            "keys.get(...) gives None for anything not listed.",
            "Do not forget \" \" for the space bar."
        ],
        "tests": [
            {
                "name": "Space flaps",
                "code": "assert action_for_key(' ') == 'flap'"
            },
            {
                "name": "The up arrow flaps",
                "code": "assert action_for_key('ArrowUp') == 'flap'"
            },
            {
                "name": "W flaps too",
                "code": "assert action_for_key('w') == 'flap'"
            },
            {
                "name": "Capital letters work",
                "code": "assert action_for_key('W') == 'flap'\nassert action_for_key('R') == 'restart'"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert action_for_key('p') == 'pause'\nassert action_for_key('r') == 'restart'"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert action_for_key('z') is None\nassert action_for_key('ArrowDown') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then press SPACE. How many pipes can you get through?"
        }
    }
];
