/* ============================================================
   floors-python-steps.js - the 6 steps of "Build Hundred Floors in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const FLOORS_PYTHON_STEPS = [
    {
        "id": "screen_y",
        "fnName": "screen_y",
        "title": "Where does the camera look?",
        "adds": "The shaft can be drawn.",
        "intro": "<p>Here is the idea the whole game rests on, and it is worth getting straight before anything else: <strong>the shaft does not move. The camera does.</strong></p><p>Every platform is given a place in the world when it is made, and it stays there for ever. What changes is how far down we are looking. To draw something you take the camera's depth off its world position.</p><p>You could have written this game the other way round, sliding every platform upwards. It seems simpler — right up until you notice that a player standing on a platform has to be dragged along with it, so speeding up the view would physically fling the player into the ceiling. Moving the camera touches nobody.</p>",
        "spec": {
            "input": "state, worldY — where something is in the world",
            "output": "the y to draw it at",
            "algorithm": [
                "Take the camera's depth off the world position. That is the whole function."
            ]
        },
        "starter": "def screen_y(state, world_y):\n    # the world position, minus how far down we are looking\n    pass\n",
        "answer": "def screen_y(state, world_y):\n    return world_y - state[\"camera\"]\n",
        "hints": [
            "The camera is state['camera'] - how far down the shaft we are looking.",
            "Something at the same depth as the camera appears at the very top.",
            "return world_y - state['camera']"
        ],
        "tests": [
            {
                "name": "At the start the camera is at the top",
                "code": "state = create_game()\nassert state['camera'] == 0\nassert screen_y(state, 100) == 100"
            },
            {
                "name": "Looking further down moves things up the screen",
                "code": "state = create_game()\nstate['camera'] = 50\nassert screen_y(state, 100) == 50"
            },
            {
                "name": "Something at the camera's own depth is at the very top",
                "code": "state = create_game()\nstate['camera'] = 137\nassert screen_y(state, 137) == 0"
            },
            {
                "name": "Something above the camera has a negative screen y",
                "code": "state = create_game()\nstate['camera'] = 200\nassert screen_y(state, 150) < 0"
            },
            {
                "name": "The gap between two things never changes",
                "code": "state = create_game()\nstate['camera'] = 0\napart = screen_y(state, 300) - screen_y(state, 200)\nstate['camera'] = 500\nassert screen_y(state, 300) - screen_y(state, 200) == apart"
            },
            {
                "name": "The player starts in view",
                "code": "state = create_game()\ny = screen_y(state, state['player']['y'])\nassert 0 < y < FIELD_HEIGHT"
            }
        ],
        "demo": {
            "kind": "kinds",
            "caption": "One of every kind of platform, all drawn through screenY."
        }
    },
    {
        "id": "random_kind",
        "fnName": "random_kind",
        "title": "Deal a platform",
        "adds": "The shaft fills with six different kinds.",
        "intro": "<p>Six kinds of platform, but they are not equally likely — plain ones are common and 锯齿 spikes are rarer, and the deeper you go the nastier the mixture gets.</p><p>The way to do that is <strong>weighted random choice</strong>, and it is genuinely useful. Picture a row of buckets of different widths and a dart thrown at random: a wide bucket catches more darts.</p><ol><li>Add up all the weights — that is how wide the whole row of buckets is.</li><li>Pick a random number somewhere in that total — that is where the dart lands.</li><li>Walk along, taking each weight off your number. The moment it goes below zero, you are standing in that bucket.</li></ol>",
        "spec": {
            "input": "floor — how deep we are",
            "output": "one of the six kinds",
            "algorithm": [
                "Ask kind-weights for the list of kinds and their weights.",
                "Add all the weights together.",
                "Pick a random number from 0 up to that total.",
                "Walk the list, taking each weight off your number. As soon as it drops below 0, return that kind."
            ]
        },
        "starter": "def random_kind(floor):\n    weights = kind_weights(floor)\n    # add them up, throw a dart, walk along\n    return PLAIN\n",
        "answer": "def random_kind(floor):\n    weights = kind_weights(floor)\n\n    total = sum(weight for kind, weight in weights)\n    ticket = random.uniform(0, total)\n\n    for kind, weight in weights:\n        ticket -= weight\n        if ticket < 0:\n            return kind\n    return PLAIN\n",
        "hints": [
            "kind_weights(floor) gives you a list of (kind, weight) pairs.",
            "random.uniform(0, total) throws the dart somewhere in the whole row.",
            "Take each weight off the ticket, and return as soon as it goes below zero."
        ],
        "tests": [
            {
                "name": "It always gives back a real kind",
                "code": "for _ in range(300):\n    assert PLAIN <= random_kind(1) <= CRUMBLING"
            },
            {
                "name": "Every kind turns up sooner or later",
                "code": "seen = {random_kind(20) for _ in range(3000)}\nassert len(seen) == 6, f'only {len(seen)} of the six kinds appeared'"
            },
            {
                "name": "Plain platforms are the commonest",
                "code": "import collections\ncounts = collections.Counter(random_kind(1) for _ in range(4000))\nfor kind in range(1, CRUMBLING + 1):\n    assert counts[PLAIN] > counts[kind]"
            },
            {
                "name": "Spikes get likelier the deeper you go",
                "code": "shallow = sum(1 for _ in range(4000) if random_kind(1) == SPIKED)\ndeep = sum(1 for _ in range(4000) if random_kind(60) == SPIKED)\nassert deep > shallow * 1.5, f'floor 60 had {deep} spikes, floor 1 had {shallow}'"
            },
            {
                "name": "The weights really are respected",
                "code": "import collections\ncounts = collections.Counter(random_kind(1) for _ in range(8000))\nweights = kind_weights(1)\ntotal = sum(w for k, w in weights)\nfor kind, weight in weights:\n    expected = weight / total * 8000\n    assert abs(counts[kind] - expected) < expected * 0.35 + 40, \\\n        f'kind {kind} came up {counts[kind]} times, expected near {expected:.0f}'"
            },
            {
                "name": "Two shafts in a row are different",
                "code": "same = sum(1 for _ in range(40) if random_kind(30) == random_kind(30))\nassert same < 40"
            }
        ],
        "demo": {
            "kind": "kinds",
            "caption": "Step through the six kinds and read what each one is."
        }
    },
    {
        "id": "is_over",
        "fnName": "is_over",
        "title": "Are you standing on it?",
        "adds": "You stop balancing on thin air.",
        "intro": "<p>A small function with a surprisingly big effect. Are you over this platform?</p><p>The obvious answer is \"do our rectangles overlap?\" — and it is wrong. With that rule you can stand balanced on <em>half a pixel</em> of platform, hanging in mid-air and refusing to fall, while the shaft carries you up into the ceiling spikes. It looks like the game has frozen.</p><p>Use the player's <strong>middle</strong> instead. You fall the moment you walk past the edge, which is exactly what a player expects.</p>",
        "spec": {
            "input": "player, platform",
            "output": "True if the player's middle is above the platform",
            "algorithm": [
                "Work out the middle of the player: their x plus half their width.",
                "That has to be past the platform's left edge and before its right edge."
            ]
        },
        "starter": "def is_over(player, platform):\n    # the player's MIDDLE has to be above the platform\n    pass\n",
        "answer": "def is_over(player, platform):\n    middle = player[\"x\"] + PLAYER_WIDTH / 2\n    return platform[\"x\"] < middle < platform[\"x\"] + PLATFORM_WIDTH\n",
        "hints": [
            "The middle of the player is player['x'] + PLAYER_WIDTH / 2.",
            "Python lets you write a < b < c, which reads beautifully here.",
            "return platform['x'] < middle < platform['x'] + PLATFORM_WIDTH"
        ],
        "tests": [
            {
                "name": "Standing in the middle counts",
                "code": "assert is_over({'x': 121}, {'x': 100, 'y': 0}) is True"
            },
            {
                "name": "Standing well to the side does not",
                "code": "assert is_over({'x': 250}, {'x': 100, 'y': 0}) is False"
            },
            {
                "name": "Just over the left edge counts",
                "code": "assert is_over({'x': 92}, {'x': 100, 'y': 0}) is True"
            },
            {
                "name": "Balancing on a sliver does NOT count",
                "code": "assert is_over({'x': 81}, {'x': 100, 'y': 0}) is False, 'the middle is off the edge, so they must fall'"
            },
            {
                "name": "Nor does hanging off the right",
                "code": "assert is_over({'x': 161}, {'x': 100, 'y': 0}) is False"
            },
            {
                "name": "A player can only be over one platform at a time",
                "code": "left = {'x': 100, 'y': 0}\nright = {'x': 162, 'y': 0}\nfor x in range(60, 240):\n    assert not (is_over({'x': x}, left) and is_over({'x': x}, right)), f'both at x {x}'"
            },
            {
                "name": "It agrees with still_on_platform",
                "code": "p = {'x': 121}\nplatform = {'x': 100, 'y': 0}\nassert still_on_platform(p, platform) == is_over(p, platform)"
            }
        ],
        "demo": {
            "kind": "land",
            "caption": "Walk off the edge and you fall the moment your middle passes it."
        },
        "warning": "Use the middle, not the whole body. Any-overlap-counts lets a player balance on half a pixel and hang in the air for ever."
    },
    {
        "id": "lands_on",
        "fnName": "lands_on",
        "title": "Did you land on it?",
        "adds": "You can stand on things.",
        "intro": "<p>The most important test in the game: has the player's feet just crossed the top of this platform?</p><p>The tempting version is \"are the feet near the top?\" — and it breaks. At full speed the player falls seven pixels in a single frame, and a platform is ten thick. A fast fall skips straight past the \"near\" window and lands on nothing.</p><p>So ask a better question: were the feet <strong>above</strong> the platform last frame, and are they <strong>level with or below</strong> it now? That cannot be skipped over, however fast the fall.</p>",
        "spec": {
            "input": "player — with y, dy and lastFeet. platform.",
            "output": "True if the player just landed on it",
            "algorithm": [
                "If the player is not falling (dy is 0 or less), it is not a landing — going up through a platform is allowed.",
                "Work out where the feet are now: y plus PLAYER_HEIGHT.",
                "If the feet were already below the platform's top last frame, we did not land on it.",
                "If the feet have not reached it yet, we have not landed either.",
                "Otherwise it comes down to whether we are over it — use is-over."
            ]
        },
        "starter": "def lands_on(player, platform):\n    # falling, crossed the top this frame, and over it\n    pass\n",
        "answer": "def lands_on(player, platform):\n    if player[\"dy\"] <= 0:\n        return False\n    rect = platform_rect(platform)\n    feet = player[\"y\"] + PLAYER_HEIGHT\n\n    if player[\"last_feet\"] > rect[\"y\"] or feet < rect[\"y\"]:\n        return False\n    return is_over(player, platform)\n",
        "hints": [
            "player['last_feet'] is where the feet were at the start of the frame.",
            "'Crossed it' means last_feet was above the top AND feet is now at or below it.",
            "Finish with is_over(player, platform) - the function you just wrote."
        ],
        "tests": [
            {
                "name": "Falling onto a platform is a landing",
                "code": "platform = {'x': 100, 'y': 200}\nplayer = {'x': 121, 'y': 180, 'dy': 200, 'last_feet': 200}\nassert lands_on(player, platform) is True"
            },
            {
                "name": "Still above it is not a landing",
                "code": "platform = {'x': 100, 'y': 200}\nplayer = {'x': 121, 'y': 100, 'dy': 200, 'last_feet': 120}\nassert lands_on(player, platform) is False"
            },
            {
                "name": "Already below it is not a landing",
                "code": "platform = {'x': 100, 'y': 200}\nplayer = {'x': 121, 'y': 300, 'dy': 200, 'last_feet': 310}\nassert lands_on(player, platform) is False"
            },
            {
                "name": "Rising up through it is allowed",
                "code": "platform = {'x': 100, 'y': 200}\nplayer = {'x': 121, 'y': 180, 'dy': -200, 'last_feet': 210}\nassert lands_on(player, platform) is False, 'a spring has thrown the player upwards'"
            },
            {
                "name": "Falling past it to one side is not a landing",
                "code": "platform = {'x': 100, 'y': 200}\nplayer = {'x': 250, 'y': 180, 'dy': 200, 'last_feet': 200}\nassert lands_on(player, platform) is False"
            },
            {
                "name": "A very fast fall is still caught",
                "code": "platform = {'x': 100, 'y': 200}\nplayer = {'x': 121, 'y': 206, 'dy': MAX_FALL_SPEED, 'last_feet': 190}\nassert lands_on(player, platform) is True, 'the feet leapt over it in one frame, but still crossed it'"
            },
            {
                "name": "Landing exactly on the edge of the top counts",
                "code": "platform = {'x': 100, 'y': 200}\nplayer = {'x': 121, 'y': 176, 'dy': 100, 'last_feet': 199}\nassert lands_on(player, platform) is True"
            },
            {
                "name": "A real game lands on things",
                "code": "state = create_game()\n# drop the player from a standstill, squarely above a real platform\nplatform = state['platforms'][1]\nstate['player']['riding'] = None\nstate['player']['x'] = platform['x'] + PLATFORM_WIDTH / 2 - PLAYER_WIDTH / 2\nstate['player']['y'] = platform['y'] - 90\nstate['player']['dy'] = 0\nstate['player']['last_feet'] = state['player']['y'] + PLAYER_HEIGHT\nstate['steering'] = 0\nlanded = False\nfor _ in range(90):\n    update_game(state, 16)\n    if state['player']['riding']:\n        landed = True\n        break\nassert landed, 'the player was dropped straight onto a platform and never landed'"
            }
        ],
        "demo": {
            "kind": "land",
            "caption": "A still shaft to practise on. Walk about and watch the landings."
        },
        "warning": "Compare where the feet WERE with where they are NOW. A 'near the top' test misses fast falls, and the player drops straight through solid platforms."
    },
    {
        "id": "land_on_platform",
        "fnName": "land_on_platform",
        "title": "What kind did you land on?",
        "adds": "The 锯齿 start to hurt.",
        "intro": "<p>Now the fun part — and the heart of the whole game. You have landed; what happens next depends entirely on <em>what you landed on</em>.</p><ul><li><strong>plain</strong> — nothing at all, and that is a relief.</li><li><strong>锯齿 spiked</strong> — it costs you SPIKE_DAMAGE blood. This is the one to avoid.</li><li><strong>spring</strong> — it throws you straight back up, and you are airborne again at once.</li><li><strong>crumbling</strong> — it starts falling apart the moment you touch it.</li><li><strong>sliding</strong> — it carries you sideways while you stand on it (that is handled while you walk).</li></ul><p>Whatever the kind, first stand the player neatly on top and count the floor.</p>",
        "spec": {
            "input": "state, platform",
            "output": "nothing; it changes the player and the platform",
            "algorithm": [
                "Put the player exactly on top: the platform's y, minus PLAYER_HEIGHT. Stop them falling and remember what they are riding.",
                "If this platform is deeper than any reached before, that is a new floor: remember it and score 10.",
                "Spiked? hurt the player by SPIKE_DAMAGE.",
                "Spring? set dy to SPRING_SPEED, stop riding (you are in the air again), and count the bounce.",
                "Crumbling? start its timer at CRUMBLE_SECONDS."
            ]
        },
        "starter": "def land_on_platform(state, platform):\n    # stand on top, count the floor, then do what this KIND does\n    pass\n",
        "answer": "def land_on_platform(state, platform):\n    rect = platform_rect(platform)\n\n    state[\"player\"][\"y\"] = rect[\"y\"] - PLAYER_HEIGHT\n    state[\"player\"][\"dy\"] = 0\n    state[\"player\"][\"riding\"] = platform\n\n    if platform[\"floor\"] > state[\"floor\"]:\n        state[\"floor\"] = platform[\"floor\"]\n        state[\"score\"] += 10\n\n    if platform[\"kind\"] == SPIKED:\n        hurt(state, SPIKE_DAMAGE)\n\n    elif platform[\"kind\"] == SPRING:\n        state[\"player\"][\"dy\"] = SPRING_SPEED\n        state[\"player\"][\"riding\"] = None\n        state[\"bounces\"] += 1\n\n    elif platform[\"kind\"] == CRUMBLING:\n        platform[\"crumbling\"] = CRUMBLE_SECONDS\n",
        "hints": [
            "Standing on top means y = the platform's y MINUS the player's height.",
            "hurt(state, amount) is written for you.",
            "A spring has to clear riding as well as setting dy - you are in the air again."
        ],
        "tests": [
            {
                "name": "Landing stands you on top",
                "code": "state = create_game()\nplatform = {'x': 100, 'y': 300, 'kind': PLAIN, 'floor': 9, 'crumbling': 0}\nstate['player']['x'] = 121\nland_on_platform(state, platform)\nassert state['player']['y'] == 300 - PLAYER_HEIGHT\nassert state['player']['dy'] == 0"
            },
            {
                "name": "Landing counts a new floor",
                "code": "state = create_game()\nland_on_platform(state, {'x': 100, 'y': 300, 'kind': PLAIN, 'floor': 9, 'crumbling': 0})\nassert state['floor'] == 9 and state['score'] == 10"
            },
            {
                "name": "Landing on a floor you have already had scores nothing",
                "code": "state = create_game()\nstate['floor'] = 20\nstate['score'] = 0\nland_on_platform(state, {'x': 100, 'y': 300, 'kind': PLAIN, 'floor': 9, 'crumbling': 0})\nassert state['score'] == 0"
            },
            {
                "name": "A plain platform does nothing else",
                "code": "state = create_game()\nplatform = {'x': 100, 'y': 300, 'kind': PLAIN, 'floor': 9, 'crumbling': 0}\nland_on_platform(state, platform)\nassert state['health'] == MAX_HEALTH\nassert state['player']['riding'] is platform"
            },
            {
                "name": "锯齿 spikes cost blood",
                "code": "state = create_game()\nland_on_platform(state, {'x': 100, 'y': 300, 'kind': SPIKED, 'floor': 9, 'crumbling': 0})\nassert state['health'] == MAX_HEALTH - SPIKE_DAMAGE"
            },
            {
                "name": "A spring throws you back up",
                "code": "state = create_game()\nland_on_platform(state, {'x': 100, 'y': 300, 'kind': SPRING, 'floor': 9, 'crumbling': 0})\nassert state['player']['dy'] == SPRING_SPEED < 0\nassert state['player']['riding'] is None"
            },
            {
                "name": "A crumbling platform starts falling apart",
                "code": "state = create_game()\nplatform = {'x': 100, 'y': 300, 'kind': CRUMBLING, 'floor': 9, 'crumbling': 0}\nland_on_platform(state, platform)\nassert platform['crumbling'] == CRUMBLE_SECONDS"
            },
            {
                "name": "A sliding platform is safe to land on",
                "code": "state = create_game()\nplatform = {'x': 100, 'y': 300, 'kind': SLIDE_LEFT, 'floor': 9, 'crumbling': 0}\nland_on_platform(state, platform)\nassert state['health'] == MAX_HEALTH\nassert state['player']['riding'] is platform"
            },
            {
                "name": "Enough spikes finish you off",
                "code": "state = create_game()\nfor _ in range(MAX_HEALTH):\n    land_on_platform(state, {'x': 100, 'y': 300, 'kind': SPIKED, 'floor': 1, 'crumbling': 0})\nassert state['health'] == 0 and is_dead(state) is True"
            }
        ],
        "demo": {
            "kind": "land",
            "caption": "Six platforms, one of each kind. Land on the 锯齿 one and watch the blood bar."
        },
        "warning": "A spring must clear `riding` as well as setting dy. Leave the player marked as standing on it and they will be glued to a platform that is trying to throw them off."
    },
    {
        "id": "is_dead",
        "fnName": "is_dead",
        "title": "Two ways to go",
        "adds": "The game can end.",
        "intro": "<p>The last rule, and it says exactly what the game is about.</p><p><strong>Run out of blood</strong> — too many 锯齿.<br><strong>Fall off the bottom of the screen</strong> — you missed every platform on the way down.</p><p>Note the second one has to be measured on the SCREEN, not in the world. In the world you are always falling deeper; what matters is whether the camera has lost you.</p>",
        "spec": {
            "input": "state",
            "output": "True if the player is finished",
            "algorithm": [
                "No blood left is death.",
                "So is being below the bottom of the screen — use screen-y to find out where the player actually appears."
            ]
        },
        "starter": "def is_dead(state):\n    # no blood left, or fallen off the bottom of the screen\n    pass\n",
        "answer": "def is_dead(state):\n    return state[\"health\"] <= 0 or screen_y(state, state[\"player\"][\"y\"]) > FIELD_HEIGHT\n",
        "hints": [
            "Two things joined with `or` - either one is enough.",
            "Use screen_y(state, state['player']['y']), not the world position.",
            "FIELD_HEIGHT is the bottom of the screen."
        ],
        "tests": [
            {
                "name": "A fresh game is not over",
                "code": "assert is_dead(create_game()) is False"
            },
            {
                "name": "No blood left is death",
                "code": "state = create_game()\nstate['health'] = 0\nassert is_dead(state) is True"
            },
            {
                "name": "Falling off the bottom is death",
                "code": "state = create_game()\nstate['player']['y'] = state['camera'] + FIELD_HEIGHT + 1\nassert is_dead(state) is True"
            },
            {
                "name": "Being near the bottom is still alive",
                "code": "state = create_game()\nstate['player']['y'] = state['camera'] + FIELD_HEIGHT - 20\nassert is_dead(state) is False"
            },
            {
                "name": "It is the SCREEN that matters, not the world",
                "code": "state = create_game()\nstate['camera'] = 5000\nstate['player']['y'] = 5100\nassert is_dead(state) is False, 'with the camera at 5000 the player is 100 pixels down the screen'"
            },
            {
                "name": "One point of blood is enough to live on",
                "code": "state = create_game()\nstate['health'] = 1\nassert is_dead(state) is False"
            }
        ],
        "demo": {
            "kind": "final",
            "flags": {
                "robot": true
            },
            "caption": "A robot climber plays the finished game. Click the page and take over with ← and →."
        }
    }
];
