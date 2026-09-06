/* ============================================================
   whack-steps.js - the 6 steps of "Build Whack-a-Mole"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const WHACK_STEPS = [
    {
        "id": "hole_index",
        "fnName": "holeIndex",
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
        "starter": "function holeIndex(column, row) {\n    // skip whole rows, then add the column\n}\n",
        "answer": "function holeIndex(column, row) {\n    return row * GRID_SIZE + column;\n}\n",
        "hints": [
            "One line.",
            "A row is GRID_SIZE holes wide.",
            "return row * GRID_SIZE + column;"
        ],
        "tests": [
            {
                "name": "The top-left hole is 0",
                "code": "assert(holeIndex(0, 0) === 0, 'gave ' + holeIndex(0, 0));"
            },
            {
                "name": "The middle hole is 4",
                "code": "assert(holeIndex(1, 1) === 4, 'gave ' + holeIndex(1, 1));"
            },
            {
                "name": "The bottom-right hole is 8",
                "code": "assert(holeIndex(2, 2) === 8);"
            },
            {
                "name": "All nine holes get different numbers",
                "code": "const seen = {};\nfor (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { seen[holeIndex(c, r)] = true; } }\nassert(Object.keys(seen).length === 9);"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers every hole."
        }
    },
    {
        "id": "random_hole",
        "fnName": "randomHole",
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
        "starter": "function randomHole(previous) {\n    // every hole except `previous`, then pick one\n}\n",
        "answer": "function randomHole(previous) {\n    const choices = [];\n    for (let hole = 0; hole < HOLE_COUNT; hole++) {\n        if (hole !== previous) {\n            choices.push(hole);\n        }\n    }\n    return choices[Math.floor(Math.random() * choices.length)];\n}\n",
        "hints": [
            "Loop from 0 to HOLE_COUNT - 1, skipping `previous`.",
            "Math.floor(Math.random() * choices.length) is a random position in the list.",
            "Return the hole itself, not its position in the list."
        ],
        "tests": [
            {
                "name": "It gives a real hole",
                "code": "for (let i = 0; i < 50; i++) { const hole = randomHole(-1);\n    assert(hole >= 0 && hole < HOLE_COUNT, 'gave ' + hole); }"
            },
            {
                "name": "It never repeats the last hole",
                "code": "for (let i = 0; i < 200; i++) { assert(randomHole(4) !== 4, 'it popped out of the same hole twice'); }"
            },
            {
                "name": "It still uses all the other holes",
                "code": "const seen = {};\nfor (let i = 0; i < 300; i++) { seen[randomHole(4)] = true; }\nassert(Object.keys(seen).length === HOLE_COUNT - 1, 'it only used ' + Object.keys(seen).length + ' of the other holes');"
            },
            {
                "name": "With no previous hole, every hole is possible",
                "code": "const seen = {};\nfor (let i = 0; i < 400; i++) { seen[randomHole(-1)] = true; }\nassert(Object.keys(seen).length === HOLE_COUNT, 'it only used ' + Object.keys(seen).length + ' holes');"
            },
            {
                "name": "It really is random",
                "code": "const first = randomHole(-1);\nlet different = false;\nfor (let i = 0; i < 40; i++) { if (randomHole(-1) !== first) { different = true; } }\nassert(different, 'forty tries all gave the same hole');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Watch the mole hop about — it never lands in the same hole twice."
        }
    },
    {
        "id": "mole_interval",
        "fnName": "moleInterval",
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
        "starter": "function moleInterval(level) {\n    // 1100 ms at level 1, 90 ms quicker each level, never below 350\n}\n",
        "answer": "function moleInterval(level) {\n    const milliseconds = 1100 - (level - 1) * 90;\n    if (milliseconds < 350) {\n        return 350;\n    }\n    return milliseconds;\n}\n",
        "hints": [
            "Work the number out into a variable first.",
            "Level 1 must give exactly 1100, so the sum uses (level - 1).",
            "Math.max(350, milliseconds) does the floor in one line."
        ],
        "tests": [
            {
                "name": "Level 1 waits 1100 ms",
                "code": "assert(moleInterval(1) === 1100, 'gave ' + moleInterval(1));"
            },
            {
                "name": "Level 2 waits 1010 ms",
                "code": "assert(moleInterval(2) === 1010, 'gave ' + moleInterval(2));"
            },
            {
                "name": "Level 5 waits 740 ms",
                "code": "assert(moleInterval(5) === 740, 'gave ' + moleInterval(5));"
            },
            {
                "name": "Level 10 has hit the floor",
                "code": "assert(moleInterval(10) === 350, 'gave ' + moleInterval(10));"
            },
            {
                "name": "Level 40 is still 350",
                "code": "assert(moleInterval(40) === 350);"
            },
            {
                "name": "It never goes below 350",
                "code": "for (let level = 1; level <= 60; level++) { assert(moleInterval(level) >= 350, 'level ' + level + ' gave ' + moleInterval(level)); }"
            }
        ],
        "demo": {
            "kind": "speed",
            "caption": "Press the level buttons and watch your speed curve."
        }
    },
    {
        "id": "level_for_hits",
        "fnName": "levelForHits",
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
        "starter": "function levelForHits(hits) {\n    // a new level every 5 hits, starting at level 1\n}\n",
        "answer": "function levelForHits(hits) {\n    return Math.floor(hits / 5) + 1;\n}\n",
        "hints": [
            "Math.floor(7 / 5) is 1.",
            "One line.",
            "return Math.floor(hits / 5) + 1;"
        ],
        "tests": [
            {
                "name": "No hits yet is level 1",
                "code": "assert(levelForHits(0) === 1, 'gave ' + levelForHits(0));"
            },
            {
                "name": "4 hits is still level 1",
                "code": "assert(levelForHits(4) === 1);"
            },
            {
                "name": "5 hits reaches level 2",
                "code": "assert(levelForHits(5) === 2, 'gave ' + levelForHits(5));"
            },
            {
                "name": "23 hits is level 5",
                "code": "assert(levelForHits(23) === 5, 'gave ' + levelForHits(23));"
            },
            {
                "name": "It never returns 0",
                "code": "for (let hits = 0; hits < 50; hits++) { assert(levelForHits(hits) >= 1); }"
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
        "starter": "function whack(state, index) {\n    // hit: score and move the mole. miss: just count it.\n}\n",
        "answer": "function whack(state, index) {\n    if (state.isOver || state.isPaused) {\n        return false;\n    }\n\n    if (index === state.mole) {\n        state.hits = state.hits + 1;\n        state.score = state.score + scoreForHit(state.level);\n        state.level = levelForHits(state.hits);\n        state.mole = randomHole(state.mole);\n        state.moleTimer = 0;\n        state.lastResult = 'hit';\n        return true;\n    }\n\n    state.misses = state.misses + 1;\n    state.lastResult = 'miss';\n    return false;\n}\n",
        "hints": [
            "Start with the over/paused guard.",
            "Score BEFORE working out the new level, so the fifth hit is still paid at the old rate.",
            "randomHole(state.mole) sends it somewhere new."
        ],
        "tests": [
            {
                "name": "Hitting the mole scores",
                "code": "const state = createGame();\nstate.mole = 3;\nwhack(state, 3);\nassert(state.hits === 1, 'hits is ' + state.hits);\nassert(state.score === 10, 'score is ' + state.score);"
            },
            {
                "name": "Hitting the mole moves it",
                "code": "const state = createGame();\nstate.mole = 3;\nwhack(state, 3);\nassert(state.mole !== 3, 'the mole should run away');"
            },
            {
                "name": "Missing counts as a miss",
                "code": "const state = createGame();\nstate.mole = 3;\nwhack(state, 5);\nassert(state.misses === 1, 'misses is ' + state.misses);\nassert(state.hits === 0);"
            },
            {
                "name": "Missing does NOT move the mole",
                "code": "const state = createGame();\nstate.mole = 3;\nwhack(state, 5);\nassert(state.mole === 3, 'a miss must not give the mole away');"
            },
            {
                "name": "It answers true for a hit and false for a miss",
                "code": "const state = createGame();\nstate.mole = 3;\nassert(whack(state, 3) === true);\nstate.mole = 3;\nassert(whack(state, 8) === false);"
            },
            {
                "name": "Five hits reach level 2",
                "code": "const state = createGame();\nfor (let i = 0; i < 5; i++) { whack(state, state.mole); }\nassert(state.level === 2, 'level is ' + state.level);"
            },
            {
                "name": "A finished game cannot be whacked",
                "code": "const state = createGame();\nstate.isOver = true;\nstate.mole = 3;\nwhack(state, 3);\nassert(state.hits === 0, 'the game is over');"
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
        "fnName": "actionForKey",
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
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // return the action name, or null\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'whack'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "One if per action.",
            "Keys share an action with ||.",
            "The last line is: return null;"
        ],
        "tests": [
            {
                "name": "The arrows aim",
                "code": "assert(actionForKey('ArrowUp') === 'up' && actionForKey('ArrowDown') === 'down' && actionForKey('ArrowLeft') === 'left' && actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "WASD works too",
                "code": "assert(actionForKey('w') === 'up' && actionForKey('d') === 'right');"
            },
            {
                "name": "Capitals still work",
                "code": "assert(actionForKey('W') === 'up', 'did you lowercase the key?');"
            },
            {
                "name": "Space swings",
                "code": "assert(actionForKey(' ') === 'whack', 'gave ' + actionForKey(' '));"
            },
            {
                "name": "Enter swings too",
                "code": "assert(actionForKey('Enter') === 'whack');"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert(actionForKey('p') === 'pause' && actionForKey('r') === 'restart');"
            },
            {
                "name": "An unused key gives null",
                "code": "assert(actionForKey('q') === null);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then aim with the arrows and swing with space."
        }
    }
];
