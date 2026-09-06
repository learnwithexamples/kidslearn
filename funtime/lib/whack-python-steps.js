/* ============================================================
   whack-python-steps.js - the 6 steps of "Build Whack-a-Mole in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const WHACK_PYTHON_STEPS = [
    {
        "id": "hole_index",
        "fnName": "hole_index",
        "title": "Number the holes",
        "adds": "The board has holes to whack.",
        "intro": "<p>Nine holes in a 3 x 3 grid, and — as in every board game you have built so far — they live in one flat <strong>list</strong>.</p>",
        "spec": {
            "input": "column, row (0 to 2)",
            "output": "the position of that hole in the list of nine",
            "algorithm": [
                "Skip a whole row of holes for every row above: row * GRID_SIZE.",
                "Add the column."
            ]
        },
        "starter": "def hole_index(column, row):\n    # skip whole rows, then add the column\n    pass\n",
        "answer": "def hole_index(column, row):\n    return row * GRID_SIZE + column\n",
        "hints": [
            "One line.",
            "A row is GRID_SIZE holes wide.",
            "return row * GRID_SIZE + column"
        ],
        "tests": [
            {
                "name": "The top-left hole is 0",
                "code": "got = hole_index(0, 0)\nassert got == 0, f'gave {got}'"
            },
            {
                "name": "The middle hole is 4",
                "code": "got = hole_index(1, 1)\nassert got == 4, f'gave {got}'"
            },
            {
                "name": "The bottom-right hole is 8",
                "code": "assert hole_index(2, 2) == 8"
            },
            {
                "name": "All nine holes get different numbers",
                "code": "seen = {hole_index(c, r) for r in range(3) for c in range(3)}\nassert len(seen) == 9"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers every hole."
        }
    },
    {
        "id": "random_hole",
        "fnName": "random_hole",
        "title": "Pop up somewhere new",
        "adds": "The mole moves about.",
        "intro": "<p>The mole needs a random hole — but never the one it was just in. Popping out of the same hole twice in a row feels broken to a player, even though it is perfectly random.</p><p>So we do what the Snake game does with apples: <strong>list the allowed choices, then pick one</strong>.</p>",
        "spec": {
            "input": "previous - the hole the mole was just in (-1 if there was none)",
            "output": "a hole number from 0 to HOLE_COUNT - 1, never the same as previous",
            "algorithm": [
                "Build a list of every hole except `previous`.",
                "Pick one of those at random.",
                "Return it."
            ]
        },
        "starter": "def random_hole(previous):\n    # every hole except `previous`, then pick one\n    pass\n",
        "answer": "def random_hole(previous):\n    choices = [hole for hole in range(HOLE_COUNT) if hole != previous]\n    return random.choice(choices)\n",
        "hints": [
            "A list comprehension with an `if` builds the choices.",
            "random.choice(choices) picks one (random is already imported).",
            "Return the hole itself, not its position."
        ],
        "tests": [
            {
                "name": "It gives a real hole",
                "code": "for _ in range(50):\n    hole = random_hole(-1)\n    assert 0 <= hole < HOLE_COUNT, f'gave {hole}'"
            },
            {
                "name": "It never repeats the last hole",
                "code": "assert all(random_hole(4) != 4 for _ in range(200)), 'it popped out of the same hole twice'"
            },
            {
                "name": "It still uses all the other holes",
                "code": "seen = {random_hole(4) for _ in range(300)}\nassert len(seen) == HOLE_COUNT - 1, f'it only used {len(seen)} of the other holes'"
            },
            {
                "name": "With no previous hole, every hole is possible",
                "code": "seen = {random_hole(-1) for _ in range(400)}\nassert len(seen) == HOLE_COUNT, f'it only used {len(seen)} holes'"
            },
            {
                "name": "It really is random",
                "code": "first = random_hole(-1)\nassert any(random_hole(-1) != first for _ in range(40))"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Watch the mole hop about — it never lands in the same hole twice."
        }
    },
    {
        "id": "mole_interval",
        "fnName": "mole_interval",
        "title": "How long does it stay up?",
        "adds": "Higher levels really are faster.",
        "intro": "<p>On level 1 the mole waits 1100 milliseconds — over a second, which feels generous. Every level takes 90 ms off that, down to a floor of 350 ms.</p><p>Why a floor? Below about a third of a second you cannot see the mole, move the hammer and swing. A game you cannot possibly win is not fun.</p>",
        "spec": {
            "input": "level - the level number",
            "output": "milliseconds the mole stays up",
            "algorithm": [
                "Work out 1100 - (level - 1) * 90.",
                "Never return less than 350."
            ]
        },
        "starter": "def mole_interval(level):\n    # 1100 ms at level 1, 90 ms quicker each level, never below 350\n    pass\n",
        "answer": "def mole_interval(level):\n    return max(350, 1100 - (level - 1) * 90)\n",
        "hints": [
            "max(350, something) gives 350 whenever something drops below it.",
            "Level 1 must give exactly 1100, so the sum uses (level - 1).",
            "return max(350, 1100 - (level - 1) * 90)"
        ],
        "tests": [
            {
                "name": "Level 1 waits 1100 ms",
                "code": "got = mole_interval(1)\nassert got == 1100, f'gave {got}'"
            },
            {
                "name": "Level 2 waits 1010 ms",
                "code": "assert mole_interval(2) == 1010"
            },
            {
                "name": "Level 5 waits 740 ms",
                "code": "got = mole_interval(5)\nassert got == 740, f'gave {got}'"
            },
            {
                "name": "Level 10 has hit the floor",
                "code": "assert mole_interval(10) == 350"
            },
            {
                "name": "Level 40 is still 350",
                "code": "assert mole_interval(40) == 350"
            },
            {
                "name": "It never goes below 350",
                "code": "for level in range(1, 61):\n    assert mole_interval(level) >= 350, f'level {level} gave {mole_interval(level)}'"
            }
        ],
        "demo": {
            "kind": "speed",
            "caption": "Press the level buttons and watch your speed curve."
        }
    },
    {
        "id": "level_for_hits",
        "fnName": "level_for_hits",
        "title": "Level up",
        "adds": "Five hits and it gets harder.",
        "intro": "<p>Every 5 moles you hit, the level goes up — and the moles speed up with it. Hits 0-4 are level 1, hits 5-9 are level 2, and so on.</p>",
        "spec": {
            "input": "hits - how many moles you have hit",
            "output": "the level number, starting at 1",
            "algorithm": [
                "Divide the hits by 5 and round down.",
                "Add 1."
            ]
        },
        "starter": "def level_for_hits(hits):\n    # a new level every 5 hits, starting at level 1\n    pass\n",
        "answer": "def level_for_hits(hits):\n    return hits // 5 + 1\n",
        "hints": [
            "// is whole-number divide: 7 // 5 is 1.",
            "One line.",
            "return hits // 5 + 1"
        ],
        "tests": [
            {
                "name": "No hits yet is level 1",
                "code": "got = level_for_hits(0)\nassert got == 1, f'gave {got}'"
            },
            {
                "name": "4 hits is still level 1",
                "code": "assert level_for_hits(4) == 1"
            },
            {
                "name": "5 hits reaches level 2",
                "code": "got = level_for_hits(5)\nassert got == 2, f'gave {got}'"
            },
            {
                "name": "23 hits is level 5",
                "code": "assert level_for_hits(23) == 5"
            },
            {
                "name": "It never returns 0",
                "code": "assert all(level_for_hits(h) >= 1 for h in range(50))"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Hit five moles and watch the level box tick over."
        }
    },
    {
        "id": "whack",
        "fnName": "whack",
        "title": "Swing the hammer",
        "adds": "The game can be played!",
        "intro": "<p>The move itself. If the mole is in the hole you hit, you score — and it runs away to a different hole at once. If it is not, that is a miss, and the mole stays exactly where it is.</p><p>That last detail matters: if a miss moved the mole, you could find it by hitting every hole in turn.</p>",
        "spec": {
            "input": "state - the game. index - the hole you hit.",
            "output": "True if there was a mole there",
            "algorithm": [
                "Do nothing if the game is over or paused.",
                "If the index is the mole's hole: count the hit, add score-for-hit points, work out the new level with level-for-hits, send the mole to a different hole with random-hole, reset the mole timer and answer True.",
                "Otherwise count a miss and answer False."
            ]
        },
        "starter": "def whack(state, index):\n    # hit: score and move the mole. miss: just count it.\n    pass\n",
        "answer": "def whack(state, index):\n    if state[\"is_over\"] or state[\"is_paused\"]:\n        return False\n\n    if index == state[\"mole\"]:\n        state[\"hits\"] += 1\n        state[\"score\"] += score_for_hit(state[\"level\"])\n        state[\"level\"] = level_for_hits(state[\"hits\"])\n        state[\"mole\"] = random_hole(state[\"mole\"])\n        state[\"mole_timer\"] = 0\n        state[\"last_result\"] = \"hit\"\n        return True\n\n    state[\"misses\"] += 1\n    state[\"last_result\"] = \"miss\"\n    return False\n",
        "hints": [
            "Start with the over/paused guard.",
            "Score BEFORE working out the new level.",
            "random_hole(state[\"mole\"]) sends it somewhere new."
        ],
        "tests": [
            {
                "name": "Hitting the mole scores",
                "code": "state = create_game()\nstate['mole'] = 3\nwhack(state, 3)\nassert state['hits'] == 1\nassert state['score'] == 10, f\"score is {state['score']}\""
            },
            {
                "name": "Hitting the mole moves it",
                "code": "state = create_game()\nstate['mole'] = 3\nwhack(state, 3)\nassert state['mole'] != 3, 'the mole should run away'"
            },
            {
                "name": "Missing counts as a miss",
                "code": "state = create_game()\nstate['mole'] = 3\nwhack(state, 5)\nassert state['misses'] == 1 and state['hits'] == 0"
            },
            {
                "name": "Missing does NOT move the mole",
                "code": "state = create_game()\nstate['mole'] = 3\nwhack(state, 5)\nassert state['mole'] == 3, 'a miss must not give the mole away'"
            },
            {
                "name": "It answers True for a hit and False for a miss",
                "code": "state = create_game()\nstate['mole'] = 3\nassert whack(state, 3) is True\nstate['mole'] = 3\nassert whack(state, 8) is False"
            },
            {
                "name": "Five hits reach level 2",
                "code": "state = create_game()\nfor _ in range(5):\n    whack(state, state['mole'])\nassert state['level'] == 2, f\"level is {state['level']}\""
            },
            {
                "name": "A finished game cannot be whacked",
                "code": "state = create_game()\nstate['is_over'] = True\nstate['mole'] = 3\nwhack(state, 3)\nassert state['hits'] == 0"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Aim with the buttons and swing. Quick!"
        },
        "warning": "A miss must leave the mole where it is. Otherwise a player could just hit every hole in turn and never really look."
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Wire up the keyboard",
        "adds": "You can play without a mouse — the game is finished!",
        "intro": "<p>Arrows aim the hammer and space swings it.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"up\", \"down\", \"left\", \"right\", \"whack\", \"pause\", \"restart\" - or nothing",
            "algorithm": [
                "Lowercase the key first.",
                "Arrows or WASD aim.",
                "Space or Enter swings; p pauses; r starts a new game."
            ]
        },
        "starter": "def action_for_key(key):\n    k = str(key).lower()\n    # a dictionary from key names to action names, then .get(k)\n    pass\n",
        "answer": "def action_for_key(key):\n    k = str(key).lower()\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \" \": \"whack\", \"spacebar\": \"whack\", \"enter\": \"whack\",\n        \"p\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(k)\n",
        "hints": [
            "A dictionary IS the lookup table.",
            "Several keys can share an action.",
            "keys.get(k) gives None for anything missing."
        ],
        "tests": [
            {
                "name": "The arrows aim",
                "code": "assert action_for_key('ArrowUp') == 'up'\nassert action_for_key('ArrowDown') == 'down'\nassert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "WASD works too",
                "code": "assert action_for_key('w') == 'up' and action_for_key('d') == 'right'"
            },
            {
                "name": "Capitals still work",
                "code": "assert action_for_key('W') == 'up'"
            },
            {
                "name": "Space swings",
                "code": "got = action_for_key(' ')\nassert got == 'whack', f'gave {got!r}'"
            },
            {
                "name": "Enter swings too",
                "code": "assert action_for_key('Enter') == 'whack'"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert action_for_key('p') == 'pause' and action_for_key('r') == 'restart'"
            },
            {
                "name": "An unused key gives None",
                "code": "assert action_for_key('q') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then aim with the arrows and swing with space."
        }
    }
];
