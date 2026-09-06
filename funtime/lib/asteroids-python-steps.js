/* ============================================================
   asteroids-python-steps.js - the 5 steps of "Build Asteroids in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const ASTEROIDS_PYTHON_STEPS = [
    {
        "id": "point_from",
        "fnName": "point_from",
        "title": "Which way is forward?",
        "adds": "The ship knows where its nose is.",
        "intro": "<p>The ship points somewhere — an <strong>angle</strong> — and the game constantly needs to turn that into an actual place: where is the nose? which way does a shot fly? where does a rock drift?</p><p>That is what <code>cos</code> and <code>sin</code> are for, and you only need to learn them once. <code>cos(angle)</code> is how much of the direction is sideways, and <code>sin(angle)</code> is how much is up and down. Multiply each by the distance and add them on.</p><p>One thing to hold on to: angle 0 points <strong>right</strong>, and a quarter turn points <strong>down</strong> — because y grows downwards on a canvas.</p>",
        "spec": {
            "input": "x, y — where you start. angle — which way, in radians. distance — how far.",
            "output": "a point: { x, y }",
            "algorithm": [
                "The new x is x + cos(angle) × distance.",
                "The new y is y + sin(angle) × distance.",
                "Give both back together."
            ]
        },
        "starter": "def point_from(x, y, angle, distance):\n    return {\"x\": x, \"y\": y}\n",
        "answer": "def point_from(x, y, angle, distance):\n    return {\n        \"x\": x + math.cos(angle) * distance,\n        \"y\": y + math.sin(angle) * distance,\n    }\n",
        "hints": [
            "math.cos and math.sin both want the angle in radians, which is what we have.",
            "cos goes with x, sin goes with y. Always that way round.",
            "\"x\": x + math.cos(angle) * distance"
        ],
        "tests": [
            {
                "name": "Angle 0 goes to the right",
                "code": "p = point_from(0, 0, 0, 10)\nassert abs(p['x'] - 10) < 0.001\nassert abs(p['y']) < 0.001"
            },
            {
                "name": "A quarter turn goes DOWN",
                "code": "p = point_from(0, 0, math.pi / 2, 10)\nassert abs(p['x']) < 0.001\nassert abs(p['y'] - 10) < 0.001, 'on a canvas, y grows downwards'"
            },
            {
                "name": "Half a turn goes left",
                "code": "p = point_from(0, 0, math.pi, 10)\nassert abs(p['x'] + 10) < 0.001"
            },
            {
                "name": "Three quarters goes UP",
                "code": "p = point_from(0, 0, -math.pi / 2, 10)\nassert abs(p['y'] + 10) < 0.001"
            },
            {
                "name": "It starts from where you tell it",
                "code": "p = point_from(100, 50, 0, 10)\nassert abs(p['x'] - 110) < 0.001 and abs(p['y'] - 50) < 0.001"
            },
            {
                "name": "Twice the distance is twice as far",
                "code": "near = point_from(0, 0, 1, 10)\nfar = point_from(0, 0, 1, 20)\nassert abs(far['x'] - near['x'] * 2) < 0.001"
            },
            {
                "name": "Every angle lands the right distance away",
                "code": "for step in range(16):\n    angle = step / 16 * math.pi * 2\n    p = point_from(0, 0, angle, 25)\n    away = math.sqrt(p['x'] ** 2 + p['y'] ** 2)\n    assert abs(away - 25) < 0.001, f'angle {angle:.2f} landed {away:.1f} away'"
            },
            {
                "name": "Zero distance does not move at all",
                "code": "p = point_from(30, 40, 2.1, 0)\nassert abs(p['x'] - 30) < 0.001 and abs(p['y'] - 40) < 0.001"
            }
        ],
        "demo": {
            "kind": "angles",
            "caption": "Turn the ship and watch the dashed line — that is pointFrom drawing 60 pixels ahead."
        }
    },
    {
        "id": "wrap_position",
        "fnName": "wrap_position",
        "title": "Space has no edges",
        "adds": "Fly off one side, come back on the other.",
        "intro": "<p>There are no walls out here. Fly off the right and you appear on the left; off the top and you come back at the bottom. The field is a loop in both directions.</p><p>Use <code>while</code> rather than <code>if</code>. A rock nudged just past the edge only needs one wrap, but something that has jumped a long way in one frame might need more — and <code>while</code> handles both without you having to think about it.</p>",
        "spec": {
            "input": "thing — anything with an x and a y",
            "output": "nothing; it changes the thing",
            "algorithm": [
                "While x is below 0, add FIELD_WIDTH.",
                "While x has reached FIELD_WIDTH, take FIELD_WIDTH off.",
                "Do the same for y with FIELD_HEIGHT."
            ]
        },
        "starter": "def wrap_position(thing):\n    # off one edge, back on the other\n    pass\n",
        "answer": "def wrap_position(thing):\n    while thing[\"x\"] < 0:\n        thing[\"x\"] += FIELD_WIDTH\n    while thing[\"x\"] >= FIELD_WIDTH:\n        thing[\"x\"] -= FIELD_WIDTH\n    while thing[\"y\"] < 0:\n        thing[\"y\"] += FIELD_HEIGHT\n    while thing[\"y\"] >= FIELD_HEIGHT:\n        thing[\"y\"] -= FIELD_HEIGHT\n",
        "hints": [
            "Four while loops, two for x and two for y.",
            "Going off the left means ADDING the width.",
            "Use >= for the far edge, so exactly FIELD_WIDTH wraps to 0."
        ],
        "tests": [
            {
                "name": "Something in the middle is left alone",
                "code": "thing = {'x': 100, 'y': 100}\nwrap_position(thing)\nassert thing == {'x': 100, 'y': 100}"
            },
            {
                "name": "Off the left comes back on the right",
                "code": "thing = {'x': -5, 'y': 100}\nwrap_position(thing)\nassert thing['x'] == FIELD_WIDTH - 5"
            },
            {
                "name": "Off the right comes back on the left",
                "code": "thing = {'x': FIELD_WIDTH + 5, 'y': 100}\nwrap_position(thing)\nassert thing['x'] == 5"
            },
            {
                "name": "Off the top comes back at the bottom",
                "code": "thing = {'x': 100, 'y': -5}\nwrap_position(thing)\nassert thing['y'] == FIELD_HEIGHT - 5"
            },
            {
                "name": "Off the bottom comes back at the top",
                "code": "thing = {'x': 100, 'y': FIELD_HEIGHT + 5}\nwrap_position(thing)\nassert thing['y'] == 5"
            },
            {
                "name": "A corner wraps in both directions at once",
                "code": "thing = {'x': -5, 'y': -5}\nwrap_position(thing)\nassert thing['x'] == FIELD_WIDTH - 5 and thing['y'] == FIELD_HEIGHT - 5"
            },
            {
                "name": "A huge jump still lands on the field",
                "code": "thing = {'x': FIELD_WIDTH * 3 + 7, 'y': -FIELD_HEIGHT * 2 - 3}\nwrap_position(thing)\nassert 0 <= thing['x'] < FIELD_WIDTH, 'did you use while rather than if?'\nassert 0 <= thing['y'] < FIELD_HEIGHT"
            },
            {
                "name": "Nothing can ever escape",
                "code": "thing = {'x': 10, 'y': 10, 'dx': 411, 'dy': -389}\nfor frame in range(3000):\n    thing['x'] += thing['dx'] * 0.05\n    thing['y'] += thing['dy'] * 0.05\n    wrap_position(thing)\n    assert 0 <= thing['x'] < FIELD_WIDTH, f'escaped sideways at frame {frame}'\n    assert 0 <= thing['y'] < FIELD_HEIGHT, f'escaped up or down at frame {frame}'"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Thrust a few times and fly off an edge — you come straight back on the other side."
        },
        "warning": "Use while, not if. A single if handles a small nudge but not a big jump, and the bug only shows up when something is moving fast."
    },
    {
        "id": "thrust_ship",
        "fnName": "thrust_ship",
        "title": "Fire the engine",
        "adds": "The ship really flies.",
        "intro": "<p>The engine does not move the ship. It changes the ship's <strong>speed</strong> — exactly like gravity in Flappy, but pointing wherever the nose is.</p><p>And crucially, the old speed stays. Turn around and thrust and you do not stop dead: you slow down, stop, and then start going the other way. Everyone's first go at Asteroids ends in a wall because of that, and it is the whole character of the game.</p><p>Then cap the total speed, or holding the key down for ten seconds sends the ship across the screen faster than the eye can follow.</p>",
        "spec": {
            "input": "ship, seconds",
            "output": "nothing; it changes the ship's dx and dy",
            "algorithm": [
                "Add cos(angle) × THRUST × seconds to dx.",
                "Add sin(angle) × THRUST × seconds to dy.",
                "Work out the total speed with Pythagoras: √(dx² + dy²).",
                "If that is over MAX_SPEED, scale BOTH dx and dy down so the total is exactly MAX_SPEED."
            ]
        },
        "starter": "def thrust_ship(ship, seconds):\n    # push along the angle, then cap the total speed\n    pass\n",
        "answer": "def thrust_ship(ship, seconds):\n    ship[\"dx\"] += math.cos(ship[\"angle\"]) * THRUST * seconds\n    ship[\"dy\"] += math.sin(ship[\"angle\"]) * THRUST * seconds\n\n    speed = math.sqrt(ship[\"dx\"] ** 2 + ship[\"dy\"] ** 2)\n    if speed > MAX_SPEED:\n        ship[\"dx\"] = ship[\"dx\"] / speed * MAX_SPEED\n        ship[\"dy\"] = ship[\"dy\"] / speed * MAX_SPEED\n",
        "hints": [
            "ADD to dx and dy - never set them. The old speed has to survive.",
            "The total speed is math.sqrt(dx ** 2 + dy ** 2).",
            "To cap it, divide each by the speed and multiply by MAX_SPEED."
        ],
        "tests": [
            {
                "name": "Thrusting to the right speeds up sideways",
                "code": "ship = {'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert ship['dx'] > 0 and abs(ship['dy']) < 0.001"
            },
            {
                "name": "Thrusting down speeds up downwards",
                "code": "ship = {'x': 0, 'y': 0, 'angle': math.pi / 2, 'dx': 0, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert ship['dy'] > 0"
            },
            {
                "name": "The old speed is kept",
                "code": "ship = {'x': 0, 'y': 0, 'angle': 0, 'dx': 50, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert ship['dx'] > 50, 'thrusting ADDS to the speed you already had'"
            },
            {
                "name": "Thrusting backwards slows you down first",
                "code": "ship = {'x': 0, 'y': 0, 'angle': math.pi, 'dx': 100, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert 0 < ship['dx'] < 100"
            },
            {
                "name": "Longer thrust means more speed",
                "code": "quick = {'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0}\nslow = {'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0}\nthrust_ship(quick, 0.2)\nthrust_ship(slow, 0.1)\nassert quick['dx'] > slow['dx']"
            },
            {
                "name": "The speed is capped",
                "code": "ship = {'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0}\nfor _ in range(200):\n    thrust_ship(ship, 0.1)\nspeed = math.sqrt(ship['dx'] ** 2 + ship['dy'] ** 2)\nassert speed <= MAX_SPEED + 0.001, f'reached {speed:.0f}'"
            },
            {
                "name": "Capping keeps the direction",
                "code": "ship = {'x': 0, 'y': 0, 'angle': 0.7, 'dx': 0, 'dy': 0}\nfor _ in range(200):\n    thrust_ship(ship, 0.1)\nangle = math.atan2(ship['dy'], ship['dx'])\nassert abs(angle - 0.7) < 0.01, 'scale BOTH dx and dy by the same amount'"
            },
            {
                "name": "It is capped in every direction",
                "code": "for step in range(8):\n    ship = {'x': 0, 'y': 0, 'angle': step / 8 * math.pi * 2, 'dx': 0, 'dy': 0}\n    for _ in range(100):\n        thrust_ship(ship, 0.1)\n    assert math.sqrt(ship['dx'] ** 2 + ship['dy'] ** 2) <= MAX_SPEED + 0.001"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Turn, thrust, and try to stop again. It is harder than it looks."
        },
        "warning": "Scale dx and dy by the SAME amount when you cap the speed. Cap them one at a time and the ship quietly turns as it speeds up."
    },
    {
        "id": "split_rock",
        "fnName": "split_rock",
        "title": "Break the rocks",
        "adds": "Shooting makes more rocks, not fewer.",
        "intro": "<p>Here is the idea that makes Asteroids a game rather than a shooting gallery: hitting a rock does not remove it, it <strong>divides</strong> it.</p><p>A big rock becomes two mediums, a medium becomes two smalls, and only the smallest ones actually disappear. So clearing a wave means firing at least fourteen times for four rocks — and the screen gets busier and faster before it gets emptier.</p>",
        "spec": {
            "input": "rock",
            "output": "a list of the smaller rocks it leaves behind",
            "algorithm": [
                "If the rock is already the smallest size, it leaves nothing: an empty list.",
                "Otherwise make TWO rocks, one size smaller, both in the same place.",
                "make-rock gives each its own random direction."
            ]
        },
        "starter": "def split_rock(rock):\n    # two of the next size down - or nothing at all\n    pass\n",
        "answer": "def split_rock(rock):\n    if rock[\"size\"] <= 1:\n        return []\n    return [make_rock(rock[\"x\"], rock[\"y\"], rock[\"size\"] - 1),\n            make_rock(rock[\"x\"], rock[\"y\"], rock[\"size\"] - 1)]\n",
        "hints": [
            "Deal with the smallest size first: return an empty list.",
            "make_rock(x, y, size) is written for you and picks a random direction.",
            "Both new rocks start where the old one was."
        ],
        "tests": [
            {
                "name": "A big rock becomes two",
                "code": "assert len(split_rock(make_rock(100, 100, 3))) == 2"
            },
            {
                "name": "They are one size smaller",
                "code": "pieces = split_rock(make_rock(100, 100, 3))\nassert pieces[0]['size'] == 2 and pieces[1]['size'] == 2"
            },
            {
                "name": "A medium rock becomes two smalls",
                "code": "pieces = split_rock(make_rock(100, 100, 2))\nassert len(pieces) == 2 and pieces[0]['size'] == 1"
            },
            {
                "name": "The smallest rock leaves nothing",
                "code": "assert split_rock(make_rock(100, 100, 1)) == []"
            },
            {
                "name": "The pieces start where the rock was",
                "code": "pieces = split_rock(make_rock(137, 42, 3))\nassert pieces[0]['x'] == 137 and pieces[0]['y'] == 42"
            },
            {
                "name": "The pieces drift their own ways",
                "code": "pieces = split_rock(make_rock(100, 100, 3))\nassert pieces[0]['dx'] != pieces[1]['dx'] or pieces[0]['dy'] != pieces[1]['dy']"
            },
            {
                "name": "Smaller rocks move faster",
                "code": "big = make_rock(0, 0, 3)\nsmall = make_rock(0, 0, 1)\nassert math.sqrt(small['dx'] ** 2 + small['dy'] ** 2) > math.sqrt(big['dx'] ** 2 + big['dy'] ** 2)"
            },
            {
                "name": "Breaking one big rock all the way down takes seven shots",
                "code": "to_break = [make_rock(100, 100, 3)]\nshots = 0\nfor _ in range(50):\n    if not to_break:\n        break\n    rock = to_break.pop()\n    shots += 1\n    to_break.extend(split_rock(rock))\nassert shots == 7, f'it took {shots} shots - one big, two medium and four small is seven'"
            }
        ],
        "demo": {
            "kind": "split",
            "caption": "Press Shoot it and watch one rock become two — then shoot those."
        }
    },
    {
        "id": "hit_rocks",
        "fnName": "hit_rocks",
        "title": "Shoot them down",
        "adds": "The whole game works!",
        "intro": "<p>Every shot against every rock. The first rock a bullet touches is replaced by whatever it splits into, the bullet is used up, and the score goes up.</p><p>Note the scoring: the <em>smallest</em> rocks are worth the most. A big slow rock is 20 points; a little fast one is 100. That is the game telling you where the skill is.</p>",
        "spec": {
            "input": "state",
            "output": "how many rocks were hit this frame",
            "algorithm": [
                "Keep a list of the bullets that survive, and a count of hits.",
                "For each bullet, look for the first rock it touches — touches(bullet, rock, 1, ROCK_RADIUS[rock.size]).",
                "If it hit nothing, the bullet carries on.",
                "If it hit something: score ROCK_SCORE for that rock's size, take the rock out of the list, and add whatever it splits into.",
                "Put the surviving bullets back and return the count."
            ]
        },
        "starter": "def hit_rocks(state):\n    # every bullet against every rock - one rock each\n    pass\n",
        "answer": "def hit_rocks(state):\n    surviving = []\n    hits = 0\n\n    for bullet in state[\"bullets\"]:\n        hit_index = -1\n        for r, rock in enumerate(state[\"rocks\"]):\n            if touches(bullet, rock, 1, ROCK_RADIUS[rock[\"size\"]]):\n                hit_index = r\n                break\n\n        if hit_index == -1:\n            surviving.append(bullet)\n        else:\n            rock = state[\"rocks\"].pop(hit_index)\n            state[\"score\"] += ROCK_SCORE[rock[\"size\"]]\n            state[\"rocks\"].extend(split_rock(rock))\n            hits += 1\n\n    state[\"bullets\"] = surviving\n    return hits\n",
        "hints": [
            "Two loops: bullets on the outside, rocks on the inside.",
            "touches(a, b, radius_a, radius_b) is written for you - a bullet's radius is 1.",
            "list.pop(index) takes one rock out AND hands it to you."
        ],
        "tests": [
            {
                "name": "A bullet on a rock breaks it",
                "code": "state = create_game()\nstate['rocks'] = [make_rock(100, 100, 3)]\nstate['bullets'] = [{'x': 100, 'y': 100, 'dx': 0, 'dy': 0, 'life': 1}]\nassert hit_rocks(state) == 1"
            },
            {
                "name": "The rock is replaced by its pieces",
                "code": "state = create_game()\nstate['rocks'] = [make_rock(100, 100, 3)]\nstate['bullets'] = [{'x': 100, 'y': 100, 'dx': 0, 'dy': 0, 'life': 1}]\nhit_rocks(state)\nassert len(state['rocks']) == 2 and state['rocks'][0]['size'] == 2"
            },
            {
                "name": "The bullet is used up",
                "code": "state = create_game()\nstate['rocks'] = [make_rock(100, 100, 3)]\nstate['bullets'] = [{'x': 100, 'y': 100, 'dx': 0, 'dy': 0, 'life': 1}]\nhit_rocks(state)\nassert state['bullets'] == []"
            },
            {
                "name": "A hit scores",
                "code": "state = create_game()\nstate['score'] = 0\nstate['rocks'] = [make_rock(100, 100, 3)]\nstate['bullets'] = [{'x': 100, 'y': 100, 'dx': 0, 'dy': 0, 'life': 1}]\nhit_rocks(state)\nassert state['score'] == ROCK_SCORE[3]"
            },
            {
                "name": "Small rocks are worth more than big ones",
                "code": "assert ROCK_SCORE[1] > ROCK_SCORE[3]"
            },
            {
                "name": "Shooting the smallest rock leaves nothing behind",
                "code": "state = create_game()\nstate['rocks'] = [make_rock(100, 100, 1)]\nstate['bullets'] = [{'x': 100, 'y': 100, 'dx': 0, 'dy': 0, 'life': 1}]\nhit_rocks(state)\nassert state['rocks'] == []"
            },
            {
                "name": "A bullet in empty space hits nothing",
                "code": "state = create_game()\nstate['rocks'] = [make_rock(300, 300, 3)]\nstate['bullets'] = [{'x': 20, 'y': 20, 'dx': 0, 'dy': 0, 'life': 1}]\nassert hit_rocks(state) == 0\nassert len(state['bullets']) == 1"
            },
            {
                "name": "One bullet breaks one rock, not two",
                "code": "state = create_game()\nstate['rocks'] = [make_rock(100, 100, 1), make_rock(102, 100, 1)]\nstate['bullets'] = [{'x': 101, 'y': 100, 'dx': 0, 'dy': 0, 'life': 1}]\nhit_rocks(state)\nassert len(state['rocks']) == 1"
            },
            {
                "name": "A whole wave can be cleared",
                "code": "state = create_game()\nfor _ in range(200):\n    if not state['rocks']:\n        break\n    rock = state['rocks'][0]\n    state['bullets'] = [{'x': rock['x'], 'y': rock['y'], 'dx': 0, 'dy': 0, 'life': 1}]\n    hit_rocks(state)\nassert state['rocks'] == [] and state['score'] > 0"
            }
        ],
        "demo": {
            "kind": "final",
            "flags": {
                "robot": true
            },
            "caption": "A robot pilot flies the finished game. Click the page to take over with the arrows and SPACE."
        },
        "warning": "Remove the bullet as soon as it hits. Leave it in and one shot will chew straight through the whole wave."
    }
];
