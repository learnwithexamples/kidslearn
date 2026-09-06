/* ============================================================
   invaders-python-steps.js - the 7 steps of "Build Space Invaders in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const INVADERS_PYTHON_STEPS = [
    {
        "id": "alien_rect",
        "fnName": "alien_rect",
        "title": "Where is each alien?",
        "adds": "The fleet appears.",
        "intro": "<p>There are 24 aliens, but they do <strong>not</strong> each remember where they are. The whole fleet has one <code>fleetX</code> and one <code>fleetY</code>, and every alien works out its own place from its column and row.</p><p>That is the trick that made this game possible on a 1978 computer, and it is still a good idea: change one number and all 24 move together.</p>",
        "spec": {
            "input": "alien — { column, row }. state — the game.",
            "output": "a rectangle: x, y, width, height",
            "algorithm": [
                "x starts at the fleet's x, then add column × (ALIEN_WIDTH + ALIEN_GAP_X).",
                "y starts at the fleet's y, then add row × (ALIEN_HEIGHT + ALIEN_GAP_Y).",
                "Every alien is ALIEN_WIDTH by ALIEN_HEIGHT."
            ]
        },
        "starter": "def alien_rect(alien, state):\n    return {\n        \"x\": state[\"fleet_x\"],\n        \"y\": state[\"fleet_y\"],\n        \"width\": ALIEN_WIDTH,\n        \"height\": ALIEN_HEIGHT,\n    }\n",
        "answer": "def alien_rect(alien, state):\n    return {\n        \"x\": state[\"fleet_x\"] + alien[\"column\"] * (ALIEN_WIDTH + ALIEN_GAP_X),\n        \"y\": state[\"fleet_y\"] + alien[\"row\"] * (ALIEN_HEIGHT + ALIEN_GAP_Y),\n        \"width\": ALIEN_WIDTH,\n        \"height\": ALIEN_HEIGHT,\n    }\n",
        "hints": [
            "Column 0 must sit exactly at the fleet's x.",
            "A whole alien AND a gap have to be skipped for each column.",
            "\"x\": state[\"fleet_x\"] + alien[\"column\"] * (ALIEN_WIDTH + ALIEN_GAP_X)"
        ],
        "tests": [
            {
                "name": "The first alien sits at the fleet's own corner",
                "code": "state = create_game()\nr = alien_rect({'column': 0, 'row': 0}, state)\nassert r['x'] == state['fleet_x'] and r['y'] == state['fleet_y']"
            },
            {
                "name": "Every alien is the same size",
                "code": "state = create_game()\nr = alien_rect({'column': 3, 'row': 2}, state)\nassert r['width'] == ALIEN_WIDTH and r['height'] == ALIEN_HEIGHT"
            },
            {
                "name": "The next column is one alien and one gap across",
                "code": "state = create_game()\ngap = alien_rect({'column': 1, 'row': 0}, state)['x'] - alien_rect({'column': 0, 'row': 0}, state)['x']\nassert gap == ALIEN_WIDTH + ALIEN_GAP_X"
            },
            {
                "name": "The next row is one alien and one gap down",
                "code": "state = create_game()\ngap = alien_rect({'column': 0, 'row': 1}, state)['y'] - alien_rect({'column': 0, 'row': 0}, state)['y']\nassert gap == ALIEN_HEIGHT + ALIEN_GAP_Y"
            },
            {
                "name": "Moving the fleet moves every alien",
                "code": "state = create_game()\nbefore = alien_rect({'column': 4, 'row': 2}, state)['x']\nstate['fleet_x'] += 30\nassert alien_rect({'column': 4, 'row': 2}, state)['x'] - before == 30"
            },
            {
                "name": "A whole fleet fits on the field",
                "code": "state = create_game()\nlast = alien_rect({'column': ALIEN_COLUMNS - 1, 'row': 0}, state)\nassert last['x'] + last['width'] <= FIELD_WIDTH"
            }
        ],
        "demo": {
            "kind": "fleet",
            "caption": "Move the dashed box around the fleet and read the numbers underneath."
        }
    },
    {
        "id": "fleet_speed",
        "fnName": "fleet_speed",
        "title": "The aliens speed up",
        "adds": "The fleet gets faster as it thins out.",
        "intro": "<p>Everyone remembers this from the arcade: the fewer aliens are left, the faster they come. In 1978 that happened by accident — the computer simply had fewer aliens to draw, so it drew them more often.</p><p>It turned out to be brilliant game design, so now everybody does it on purpose.</p>",
        "spec": {
            "input": "state",
            "output": "pixels per second",
            "algorithm": [
                "Work out how many have been shot: all of them minus aliens-left.",
                "Start at 22, add 5 for every alien shot, and 12 for every wave after the first.",
                "Never go above 260."
            ]
        },
        "starter": "def fleet_speed(state):\n    # faster with every alien you shoot\n    pass\n",
        "answer": "def fleet_speed(state):\n    shot = ALIEN_COLUMNS * ALIEN_ROWS - aliens_left(state)\n    return min(260, 22 + shot * 5 + (state[\"wave\"] - 1) * 12)\n",
        "hints": [
            "aliens_left(state) is written for you - count backwards from the full fleet.",
            "Wave 1 must add nothing, so use (state['wave'] - 1).",
            "min(260, speed) is the cap."
        ],
        "tests": [
            {
                "name": "A full fleet crawls",
                "code": "state = create_game()\nassert fleet_speed(state) == 22"
            },
            {
                "name": "Shooting one speeds them up",
                "code": "state = create_game()\nstate['aliens'][0]['alive'] = False\nassert fleet_speed(state) == 27"
            },
            {
                "name": "The last alien is fast",
                "code": "state = create_game()\nfor alien in state['aliens'][1:]:\n    alien['alive'] = False\nassert fleet_speed(state) > 100"
            },
            {
                "name": "A later wave starts faster",
                "code": "a = create_game()\nb = create_game()\nb['wave'] = 4\nassert fleet_speed(b) > fleet_speed(a)"
            },
            {
                "name": "It never goes above 260",
                "code": "state = create_game()\nstate['wave'] = 30\nfor alien in state['aliens']:\n    alien['alive'] = False\nassert fleet_speed(state) == 260"
            },
            {
                "name": "The speed only ever goes up as aliens die",
                "code": "state = create_game()\nlast = fleet_speed(state)\nfor alien in state['aliens']:\n    alien['alive'] = False\n    now = fleet_speed(state)\n    assert now >= last, 'shooting an alien must never slow the fleet down'\n    last = now"
            }
        ],
        "demo": {
            "kind": "march",
            "caption": "Press Shoot some and watch what happens to the marching speed."
        }
    },
    {
        "id": "move_fleet",
        "fnName": "move_fleet",
        "title": "March!",
        "adds": "The fleet advances.",
        "intro": "<p>The whole fleet slides sideways together. When it touches a wall it turns round <em>and drops a row</em> — that drop is what eventually brings the aliens down onto you.</p><p>One subtlety: measure the fleet by the aliens still <strong>alive</strong>. Shoot out the left-hand column and the fleet should be able to march further left, not keep bouncing off an invisible wall.</p>",
        "spec": {
            "input": "state, seconds",
            "output": "nothing; it moves the fleet",
            "algorithm": [
                "Move fleetX by direction × fleet-speed × seconds.",
                "Ask fleet-edges where the living aliens now reach. If there are none, stop.",
                "If the right edge is past FIELD_WIDTH - 6 and we are going right: turn around and add FLEET_DROP to fleetY.",
                "If the left edge is before 6 and we are going left: turn around and drop."
            ]
        },
        "starter": "def move_fleet(state, seconds):\n    # slide sideways; at a wall, turn round AND drop\n    pass\n",
        "answer": "def move_fleet(state, seconds):\n    state[\"fleet_x\"] += state[\"fleet_direction\"] * fleet_speed(state) * seconds\n\n    edges = fleet_edges(state)\n    if edges is None:\n        return\n    if edges[\"right\"] > FIELD_WIDTH - 6 and state[\"fleet_direction\"] == 1:\n        state[\"fleet_direction\"] = -1\n        state[\"fleet_y\"] += FLEET_DROP\n    elif edges[\"left\"] < 6 and state[\"fleet_direction\"] == -1:\n        state[\"fleet_direction\"] = 1\n        state[\"fleet_y\"] += FLEET_DROP\n",
        "hints": [
            "fleet_edges(state) is written for you - it only measures living aliens.",
            "Check the direction as well as the edge, or the fleet gets stuck flipping.",
            "Turning round and dropping always happen together."
        ],
        "tests": [
            {
                "name": "The fleet slides sideways",
                "code": "state = create_game()\nbefore = state['fleet_x']\nmove_fleet(state, 0.5)\nassert state['fleet_x'] > before"
            },
            {
                "name": "It turns round at the right-hand wall",
                "code": "state = create_game()\nstate['fleet_x'] = FIELD_WIDTH - FLEET_WIDTH\nstate['fleet_direction'] = 1\nmove_fleet(state, 0.5)\nassert state['fleet_direction'] == -1"
            },
            {
                "name": "Turning round drops it a row",
                "code": "state = create_game()\nbefore = state['fleet_y']\nstate['fleet_x'] = FIELD_WIDTH - FLEET_WIDTH\nstate['fleet_direction'] = 1\nmove_fleet(state, 0.5)\nassert state['fleet_y'] == before + FLEET_DROP"
            },
            {
                "name": "It turns round at the left-hand wall too",
                "code": "state = create_game()\nstate['fleet_x'] = 0\nstate['fleet_direction'] = -1\nmove_fleet(state, 0.5)\nassert state['fleet_direction'] == 1"
            },
            {
                "name": "It does not flip twice at the same wall",
                "code": "state = create_game()\nstate['fleet_x'] = FIELD_WIDTH - FLEET_WIDTH\nstate['fleet_direction'] = 1\nmove_fleet(state, 0.5)\nafter_first = state['fleet_y']\nmove_fleet(state, 0.01)\nassert state['fleet_y'] == after_first, 'it dropped twice at one wall'"
            },
            {
                "name": "Dead columns let the fleet go further",
                "code": "state = create_game()\nfor a in state['aliens']:\n    if a['column'] >= 3:\n        a['alive'] = False\nstate['fleet_x'] = FIELD_WIDTH - FLEET_WIDTH\nstate['fleet_direction'] = 1\nmove_fleet(state, 0.1)\nassert state['fleet_direction'] == 1"
            },
            {
                "name": "A whole game of marching never leaves the field",
                "code": "state = create_game()\nfor frame in range(3000):\n    move_fleet(state, 0.016)\n    edges = fleet_edges(state)\n    assert -20 < edges['left'] and edges['right'] < FIELD_WIDTH + 20, f'off the field at frame {frame}'"
            }
        ],
        "demo": {
            "kind": "march",
            "caption": "The fleet marches by itself. Shoot some columns out and watch it use the extra room."
        },
        "warning": "Check the DIRECTION as well as the edge. Without that the fleet flips back and forth at the wall, dropping a row every frame, and the game is over in a second."
    },
    {
        "id": "fire_bullet",
        "fnName": "fire_bullet",
        "title": "Shoot back",
        "adds": "You can fight.",
        "intro": "<p>The famous rule of Space Invaders: <strong>one bullet at a time</strong>. You cannot fire again until your shot has hit something or left the screen.</p><p>That one restriction is the entire game. Take it away and you would just hold the fire button down and win. With it, every shot is a decision.</p>",
        "spec": {
            "input": "state",
            "output": "True if a shot was fired",
            "algorithm": [
                "Refuse if the game is over, paused, or a bullet is already in the air.",
                "Add a bullet just above the middle of the ship.",
                "Count the shot, and return True."
            ]
        },
        "starter": "def fire_bullet(state):\n    # only one bullet in the air at a time!\n    pass\n",
        "answer": "def fire_bullet(state):\n    if state[\"is_over\"] or state[\"is_paused\"] or state[\"bullets\"]:\n        return False\n    state[\"bullets\"].append({\n        \"x\": state[\"ship_x\"] + SHIP_WIDTH / 2 - BULLET_WIDTH / 2,\n        \"y\": SHIP_Y - BULLET_HEIGHT,\n    })\n    state[\"shots\"] += 1\n    return True\n",
        "hints": [
            "An empty list is False in Python, so `or state['bullets']` reads nicely.",
            "The middle of the ship is ship_x + SHIP_WIDTH / 2.",
            "Start the bullet just ABOVE the ship: SHIP_Y - BULLET_HEIGHT."
        ],
        "tests": [
            {
                "name": "Firing puts a bullet in the air",
                "code": "state = create_game()\nassert fire_bullet(state) is True\nassert len(state['bullets']) == 1"
            },
            {
                "name": "You cannot fire twice at once",
                "code": "state = create_game()\nfire_bullet(state)\nassert fire_bullet(state) is False\nassert len(state['bullets']) == 1"
            },
            {
                "name": "Once the shot has gone you may fire again",
                "code": "state = create_game()\nfire_bullet(state)\nstate['bullets'] = []\nassert fire_bullet(state) is True"
            },
            {
                "name": "The bullet starts at the middle of the ship",
                "code": "state = create_game()\nstate['ship_x'] = 100\nfire_bullet(state)\nmiddle = state['bullets'][0]['x'] + BULLET_WIDTH / 2\nassert abs(middle - (100 + SHIP_WIDTH / 2)) < 0.001"
            },
            {
                "name": "The bullet starts above the ship, not inside it",
                "code": "state = create_game()\nfire_bullet(state)\nassert state['bullets'][0]['y'] + BULLET_HEIGHT <= SHIP_Y"
            },
            {
                "name": "Shots are counted",
                "code": "state = create_game()\nfire_bullet(state)\nstate['bullets'] = []\nfire_bullet(state)\nassert state['shots'] == 2"
            },
            {
                "name": "A finished game cannot fire",
                "code": "state = create_game()\nstate['is_over'] = True\nassert fire_bullet(state) is False"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Move and fire. Notice you cannot shoot again until the last shot has gone."
        }
    },
    {
        "id": "move_bullets",
        "fnName": "move_bullets",
        "title": "Move the shots",
        "adds": "Bullets fly.",
        "intro": "<p>The same function moves your bullets <em>and</em> the aliens' bombs — the only difference is which way you tell it to go. Pass a negative distance and things fly up; pass a positive one and they fall.</p><p>One function, two jobs. That is what well-chosen inputs buy you.</p>",
        "spec": {
            "input": "bullets — the list. distance — how far to move them (negative is up).",
            "output": "a NEW list, without the shots that have left the field",
            "algorithm": [
                "Make an empty list for the answer.",
                "For each shot, make a copy whose y has moved by distance.",
                "Keep it only if it is still on the field: its bottom is below 0 and its top is above FIELD_HEIGHT.",
                "Return the new list."
            ]
        },
        "starter": "def move_bullets(bullets, distance):\n    # move them, and forget the ones that have left\n    pass\n",
        "answer": "def move_bullets(bullets, distance):\n    moved = []\n    for bullet in bullets:\n        shifted = {\"x\": bullet[\"x\"], \"y\": bullet[\"y\"] + distance}\n        if shifted[\"y\"] + BULLET_HEIGHT > 0 and shifted[\"y\"] < FIELD_HEIGHT:\n            moved.append(shifted)\n    return moved\n",
        "hints": [
            "Make a copy of each bullet rather than editing the old one.",
            "A shot has gone off the top when y + BULLET_HEIGHT is no longer above 0.",
            "The same test, the other way round, catches the ones off the bottom."
        ],
        "tests": [
            {
                "name": "A negative distance sends shots up",
                "code": "moved = move_bullets([{'x': 10, 'y': 200}], -50)\nassert moved[0]['y'] == 150"
            },
            {
                "name": "A positive distance sends them down",
                "code": "moved = move_bullets([{'x': 10, 'y': 200}], 50)\nassert moved[0]['y'] == 250"
            },
            {
                "name": "Shots off the top are forgotten",
                "code": "assert move_bullets([{'x': 10, 'y': 5}], -50) == []"
            },
            {
                "name": "Shots off the bottom are forgotten too",
                "code": "assert move_bullets([{'x': 10, 'y': FIELD_HEIGHT - 2}], 50) == []"
            },
            {
                "name": "A shot still on screen is kept",
                "code": "assert len(move_bullets([{'x': 10, 'y': 200}], -50)) == 1"
            },
            {
                "name": "The x never changes",
                "code": "moved = move_bullets([{'x': 137, 'y': 200}], -50)\nassert moved[0]['x'] == 137"
            },
            {
                "name": "Several shots all move",
                "code": "moved = move_bullets([{'x': 1, 'y': 100}, {'x': 2, 'y': 200}], -10)\nassert len(moved) == 2 and moved[0]['y'] == 90 and moved[1]['y'] == 190"
            },
            {
                "name": "The list you were given is left alone",
                "code": "before = [{'x': 10, 'y': 200}]\nmove_bullets(before, -50)\nassert before[0]['y'] == 200, 'make copies'"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Fire away — the shots fly up and vanish off the top."
        }
    },
    {
        "id": "hit_aliens",
        "fnName": "hit_aliens",
        "title": "Shoot them down",
        "adds": "The whole game works!",
        "intro": "<p>The moment the game has been building to. Every bullet is checked against every alien; the first one it touches dies, the bullet disappears, and the score goes up.</p><p>Two details make this feel right. A bullet may only kill <em>one</em> alien — stop looking after the first. And the bullet must be removed, or it would keep flying and mow down the whole column.</p>",
        "spec": {
            "input": "state",
            "output": "how many aliens were shot this frame",
            "algorithm": [
                "Start a count at 0 and an empty list of surviving bullets.",
                "For each bullet, look through the aliens for the first LIVING one it overlaps.",
                "If it finds one: kill the alien, add score-for-row points, count the hit, and stop looking.",
                "If it hit nothing, keep the bullet.",
                "Put the surviving bullets back into the state and return the count."
            ]
        },
        "starter": "def hit_aliens(state):\n    # every bullet against every alien - one kill each\n    pass\n",
        "answer": "def hit_aliens(state):\n    hits = 0\n    survivors = []\n\n    for bullet in state[\"bullets\"]:\n        hit_something = False\n        for alien in state[\"aliens\"]:\n            if alien[\"alive\"] and overlaps(bullet_rect(bullet), alien_rect(alien, state)):\n                alien[\"alive\"] = False\n                state[\"score\"] += score_for_row(alien[\"row\"])\n                hits += 1\n                hit_something = True\n                break\n        if not hit_something:\n            survivors.append(bullet)\n\n    state[\"bullets\"] = survivors\n    return hits\n",
        "hints": [
            "Two loops: bullets on the outside, aliens on the inside.",
            "break stops the inner loop as soon as one alien has been hit.",
            "Only keep a bullet if it hit nothing at all."
        ],
        "tests": [
            {
                "name": "A bullet on an alien kills it",
                "code": "state = create_game()\nrect = alien_rect(state['aliens'][7], state)\nstate['bullets'] = [{'x': rect['x'] + 10, 'y': rect['y'] + 5}]\nassert hit_aliens(state) == 1\nassert state['aliens'][7]['alive'] is False"
            },
            {
                "name": "The bullet is used up",
                "code": "state = create_game()\nrect = alien_rect(state['aliens'][7], state)\nstate['bullets'] = [{'x': rect['x'] + 10, 'y': rect['y'] + 5}]\nhit_aliens(state)\nassert state['bullets'] == []"
            },
            {
                "name": "A hit scores",
                "code": "state = create_game()\nalien = state['aliens'][0]\nrect = alien_rect(alien, state)\nstate['bullets'] = [{'x': rect['x'] + 10, 'y': rect['y'] + 5}]\nhit_aliens(state)\nassert state['score'] == score_for_row(alien['row'])"
            },
            {
                "name": "A bullet in empty space hits nothing",
                "code": "state = create_game()\nstate['bullets'] = [{'x': 10, 'y': 300}]\nassert hit_aliens(state) == 0\nassert len(state['bullets']) == 1"
            },
            {
                "name": "A dead alien cannot be shot again",
                "code": "state = create_game()\nrect = alien_rect(state['aliens'][7], state)\nstate['aliens'][7]['alive'] = False\nstate['bullets'] = [{'x': rect['x'] + 10, 'y': rect['y'] + 5}]\nassert hit_aliens(state) == 0"
            },
            {
                "name": "One bullet kills one alien, not two",
                "code": "state = create_game()\nrect = alien_rect(state['aliens'][0], state)\nstate['bullets'] = [{'x': rect['x'] + 10, 'y': rect['y'] + 5}]\nhit_aliens(state)\nassert aliens_left(state) == ALIEN_COLUMNS * ALIEN_ROWS - 1"
            },
            {
                "name": "The back row is worth more than the front",
                "code": "assert score_for_row(0) > score_for_row(ALIEN_ROWS - 1)"
            }
        ],
        "demo": {
            "kind": "game",
            "flags": {
                "robot": true
            },
            "caption": "A robot gunner clears the fleet — every function you have written is running here."
        },
        "warning": "Remove the bullet when it hits. Leave it in and one shot will wipe out an entire column on its way up."
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Take command",
        "adds": "The game is yours.",
        "intro": "<p>The last function: two directions and a fire button.</p><p>The arrows are held down to steer, but firing happens once per press — the page handles that difference. All this function has to do is name the action.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Left or A → 'left'. Right or D → 'right'.",
                "Space, up or W → 'fire'.",
                "P → 'pause'. R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "def action_for_key(key):\n    keys = {\n        # \"arrowleft\": \"left\", ...\n    }\n    return keys.get(str(key).lower())\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \" \": \"fire\", \"spacebar\": \"fire\", \"arrowup\": \"fire\", \"w\": \"fire\",\n        \"p\": \"pause\", \"r\": \"restart\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "A dictionary is tidier than five ifs.",
            "keys.get(...) gives None for anything not listed.",
            "Remember \" \" for the space bar."
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
                "name": "Space fires",
                "code": "assert action_for_key(' ') == 'fire'"
            },
            {
                "name": "The up arrow fires too",
                "code": "assert action_for_key('ArrowUp') == 'fire'"
            },
            {
                "name": "Capital letters work",
                "code": "assert action_for_key('A') == 'left'\nassert action_for_key('R') == 'restart'"
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
            "caption": "Click the page, then defend the Earth with the arrow keys and space."
        }
    }
];
