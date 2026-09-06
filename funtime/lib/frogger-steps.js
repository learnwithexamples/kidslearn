/* ============================================================
   frogger-steps.js - the 7 steps of "Build Frogger"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const FROGGER_STEPS = [
    {
        "id": "lane_direction",
        "fnName": "laneDirection",
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
        "starter": "function laneDirection(row) {\n    // odd rows go right, even rows go left\n}\n",
        "answer": "function laneDirection(row) {\n    return row % 2 === 1 ? 1 : -1;\n}\n",
        "hints": [
            "% gives the remainder: 7 % 2 is 1, and 8 % 2 is 0.",
            "An if works perfectly well — you do not have to use ? :",
            "return row % 2 === 1 ? 1 : -1;"
        ],
        "tests": [
            {
                "name": "Row 1 drives right",
                "code": "assert(laneDirection(1) === 1);"
            },
            {
                "name": "Row 2 drives left",
                "code": "assert(laneDirection(2) === -1, 'gave ' + laneDirection(2));"
            },
            {
                "name": "Row 3 drives right",
                "code": "assert(laneDirection(3) === 1);"
            },
            {
                "name": "Every row is 1 or -1",
                "code": "for (let row = 0; row < ROWS; row++) { const d = laneDirection(row);\n    assert(d === 1 || d === -1, 'row ' + row + ' gave ' + d); }"
            },
            {
                "name": "No two rows next to each other go the same way",
                "code": "for (let row = 1; row < ROWS; row++) {\n    assert(laneDirection(row) !== laneDirection(row - 1), 'rows ' + (row - 1) + ' and ' + row + ' both go the same way');\n}"
            }
        ],
        "demo": {
            "kind": "lanes",
            "caption": "Walk up and down the rows and watch the traffic turn around."
        }
    },
    {
        "id": "lane_speed",
        "fnName": "laneSpeed",
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
        "starter": "function laneSpeed(row, level) {\n    // 34, plus 9 a row, plus 8 a level — but never over 190\n}\n",
        "answer": "function laneSpeed(row, level) {\n    const speed = 34 + row * 9 + (level - 1) * 8;\n    return speed > 190 ? 190 : speed;\n}\n",
        "hints": [
            "Work the sum out into a variable first, then cap it.",
            "Level 1 must add nothing, so use (level - 1).",
            "Math.min(190, speed) is the short way to write the cap."
        ],
        "tests": [
            {
                "name": "Row 1 at level 1 crawls along",
                "code": "assert(laneSpeed(1, 1) === 43, 'gave ' + laneSpeed(1, 1));"
            },
            {
                "name": "Higher rows are faster",
                "code": "assert(laneSpeed(5, 1) > laneSpeed(2, 1), 'each row should have its own speed');"
            },
            {
                "name": "Higher levels are faster",
                "code": "assert(laneSpeed(3, 4) > laneSpeed(3, 1));"
            },
            {
                "name": "Every lane in a level is different",
                "code": "const speeds = [];\nfor (let row = 1; row <= 9; row++) { speeds.push(laneSpeed(row, 1)); }\nassert(new Set(speeds).size === speeds.length, 'two lanes move at the same speed: ' + speeds.join(','));"
            },
            {
                "name": "It never goes above 190",
                "code": "for (let level = 1; level <= 40; level++) {\n    for (let row = 0; row < ROWS; row++) {\n        assert(laneSpeed(row, level) <= 190, 'row ' + row + ' level ' + level + ' gave ' + laneSpeed(row, level));\n    }\n}"
            },
            {
                "name": "Speeds are always positive",
                "code": "for (let row = 0; row < ROWS; row++) { assert(laneSpeed(row, 1) > 0); }"
            }
        ],
        "demo": {
            "kind": "lanes",
            "caption": "Step through the rows and read each lane's speed."
        }
    },
    {
        "id": "wrap_car",
        "fnName": "wrapCar",
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
        "starter": "function wrapCar(car) {\n    // off one side, back on the other\n}\n",
        "answer": "function wrapCar(car) {\n    if (car.x > FIELD_WIDTH) {\n        car.x = -car.width;\n    }\n    if (car.x + car.width < 0) {\n        car.x = FIELD_WIDTH;\n    }\n}\n",
        "hints": [
            "Two ifs — cars go both ways, so both edges need catching.",
            "Set x to -car.width, not 0, or the car would pop into view.",
            "A car has gone off the left when x + width is below 0."
        ],
        "tests": [
            {
                "name": "A car in the middle is left alone",
                "code": "const car = { row: 1, x: 100, width: 38 };\nwrapCar(car);\nassert(car.x === 100);"
            },
            {
                "name": "A car off the right comes back on the left",
                "code": "const car = { row: 1, x: FIELD_WIDTH + 5, width: 38 };\nwrapCar(car);\nassert(car.x < 0, 'x is ' + car.x + ' — it should be waiting off the left edge');"
            },
            {
                "name": "A car off the left comes back on the right",
                "code": "const car = { row: 2, x: -50, width: 38 };\nwrapCar(car);\nassert(car.x === FIELD_WIDTH, 'x is ' + car.x);"
            },
            {
                "name": "A car half off the edge is left alone",
                "code": "const car = { row: 1, x: FIELD_WIDTH - 10, width: 38 };\nwrapCar(car);\nassert(car.x === FIELD_WIDTH - 10, 'it is still partly visible, so leave it');"
            },
            {
                "name": "It comes back completely off screen, not halfway",
                "code": "const car = { row: 1, x: FIELD_WIDTH + 1, width: 38 };\nwrapCar(car);\nassert(car.x + car.width <= 0, 'the whole car should still be hidden, ready to drive in');"
            },
            {
                "name": "A whole road stays full for ever",
                "code": "const cars = makeTraffic();\nfor (let frame = 0; frame < 4000; frame++) { moveCars(cars, 0.016, 3); }\nassert(cars.length === makeTraffic().length, 'no car may be lost');\nassert(cars.every(c => c.x > -200 && c.x < FIELD_WIDTH + 200), 'a car has escaped down the road for ever');"
            }
        ],
        "demo": {
            "kind": "traffic",
            "caption": "Watch the traffic loop round for ever — and speed it up with the level buttons."
        }
    },
    {
        "id": "move_frog",
        "fnName": "moveFrog",
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
        "starter": "function moveFrog(state, dColumn, dRow) {\n    // work out where it lands, stay on the field, score a NEW row\n}\n",
        "answer": "function moveFrog(state, dColumn, dRow) {\n    if (state.isOver || state.isPaused) {\n        return false;\n    }\n    const column = state.frog.column + dColumn;\n    const row = state.frog.row + dRow;\n\n    if (column < 0 || column >= COLUMNS || row < 0 || row >= ROWS) {\n        return false;\n    }\n\n    state.frog.column = column;\n    state.frog.row = row;\n\n    if (row < state.highestRow) {\n        state.highestRow = row;\n        state.score = state.score + 10;\n    }\n    return true;\n}\n",
        "hints": [
            "Work out where it WOULD land before you move it.",
            "Row 0 is the top, so 'higher up' means a SMALLER row number.",
            "if (row < state.highestRow) { ... }"
        ],
        "tests": [
            {
                "name": "Hopping forward moves the frog",
                "code": "const state = createGame();\nconst before = state.frog.row;\nmoveFrog(state, 0, -1);\nassert(state.frog.row === before - 1, 'row is ' + state.frog.row);"
            },
            {
                "name": "Hopping sideways moves the frog",
                "code": "const state = createGame();\nconst before = state.frog.column;\nmoveFrog(state, 1, 0);\nassert(state.frog.column === before + 1);"
            },
            {
                "name": "The frog cannot hop off the left",
                "code": "const state = createGame();\nstate.frog.column = 0;\nassert(moveFrog(state, -1, 0) === false);\nassert(state.frog.column === 0, 'it should have stayed put');"
            },
            {
                "name": "The frog cannot hop off the right",
                "code": "const state = createGame();\nstate.frog.column = COLUMNS - 1;\nmoveFrog(state, 1, 0);\nassert(state.frog.column === COLUMNS - 1);"
            },
            {
                "name": "The frog cannot hop off the bottom",
                "code": "const state = createGame();\nstate.frog.row = ROWS - 1;\nassert(moveFrog(state, 0, 1) === false);"
            },
            {
                "name": "A new row forward scores 10",
                "code": "const state = createGame();\nmoveFrog(state, 0, -1);\nassert(state.score === 10, 'score is ' + state.score);"
            },
            {
                "name": "Hopping back and forth does not score twice",
                "code": "const state = createGame();\nmoveFrog(state, 0, -1);\nmoveFrog(state, 0, 1);\nmoveFrog(state, 0, -1);\nassert(state.score === 10, 'score is ' + state.score + ' — a row only pays once');"
            },
            {
                "name": "Hopping sideways scores nothing",
                "code": "const state = createGame();\nmoveFrog(state, 1, 0);\nassert(state.score === 0);"
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
        "fnName": "isSquashed",
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
        "starter": "function isSquashed(state) {\n    // only the cars in the frog's own row can reach it\n}\n",
        "answer": "function isSquashed(state) {\n    const frog = frogRect(state.frog);\n    for (let i = 0; i < state.cars.length; i++) {\n        const car = state.cars[i];\n        if (car.row === state.frog.row && overlaps(frog, carRect(car))) {\n            return true;\n        }\n    }\n    return false;\n}\n",
        "hints": [
            "frogRect, carRect and overlaps are all written for you.",
            "Check the row FIRST — it is much cheaper than the rectangle test.",
            "return false; goes after the loop, not inside it."
        ],
        "tests": [
            {
                "name": "A frog on the empty bank is safe",
                "code": "const state = createGame();\nassert(isSquashed(state) === false, 'the bottom bank has no traffic at all');"
            },
            {
                "name": "A frog standing under a car is squashed",
                "code": "const state = createGame();\nstate.frog = { column: 2, row: 1 };\nstate.cars = [{ row: 1, x: frogRect(state.frog).x, width: 38 }];\nassert(isSquashed(state) === true);"
            },
            {
                "name": "A car in another row cannot touch it",
                "code": "const state = createGame();\nstate.frog = { column: 2, row: 1 };\nstate.cars = [{ row: 4, x: frogRect(state.frog).x, width: 38 }];\nassert(isSquashed(state) === false, 'that car is three rows away');"
            },
            {
                "name": "A car in the same row but far along misses",
                "code": "const state = createGame();\nstate.frog = { column: 0, row: 1 };\nstate.cars = [{ row: 1, x: 200, width: 38 }];\nassert(isSquashed(state) === false);"
            },
            {
                "name": "Every car is checked, not just the first",
                "code": "const state = createGame();\nstate.frog = { column: 2, row: 1 };\nstate.cars = [{ row: 1, x: 250, width: 38 }, { row: 1, x: frogRect(state.frog).x, width: 38 }];\nassert(isSquashed(state) === true, 'the second car is the one that got it');"
            },
            {
                "name": "The safe island really is safe",
                "code": "const state = createGame();\nstate.frog = { column: 4, row: MEDIAN_ROW };\nfor (let frame = 0; frame < 2000; frame++) {\n    moveCars(state.cars, 0.016, 5);\n    assert(isSquashed(state) === false, 'nothing may ever hit the frog on the middle island');\n}"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "The real road. Hop across it — the note tells you the moment you are hit."
        }
    },
    {
        "id": "reach_home",
        "fnName": "reachHome",
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
        "starter": "function reachHome(state) {\n    // 100 points, next level, back to the start\n}\n",
        "answer": "function reachHome(state) {\n    if (state.frog.row !== HOME_ROW) {\n        return false;\n    }\n    state.score = state.score + 100;\n    state.crossings = state.crossings + 1;\n    state.level = state.level + 1;\n    resetFrog(state);\n    return true;\n}\n",
        "hints": [
            "The very first line is a guard: not home yet? return false.",
            "resetFrog is already written for you.",
            "Reset the frog LAST, once everything has been counted."
        ],
        "tests": [
            {
                "name": "Reaching the top counts as a crossing",
                "code": "const state = createGame();\nstate.frog.row = HOME_ROW;\nassert(reachHome(state) === true);\nassert(state.crossings === 1);"
            },
            {
                "name": "A crossing is worth 100",
                "code": "const state = createGame();\nstate.frog.row = HOME_ROW;\nreachHome(state);\nassert(state.score === 100, 'score is ' + state.score);"
            },
            {
                "name": "The next level is faster",
                "code": "const state = createGame();\nstate.frog.row = HOME_ROW;\nreachHome(state);\nassert(state.level === 2);\nassert(laneSpeed(3, state.level) > laneSpeed(3, 1), 'the traffic should now be quicker');"
            },
            {
                "name": "The frog goes back to the start",
                "code": "const state = createGame();\nstate.frog.row = HOME_ROW;\nreachHome(state);\nassert(state.frog.row === START_ROW, 'the frog is at row ' + state.frog.row);"
            },
            {
                "name": "It can score again on the way back up",
                "code": "const state = createGame();\nstate.frog.row = HOME_ROW;\nreachHome(state);\nassert(state.highestRow === START_ROW, 'the new crossing has to start from scratch');"
            },
            {
                "name": "A frog halfway across has not got home",
                "code": "const state = createGame();\nstate.frog.row = 4;\nassert(reachHome(state) === false);\nassert(state.score === 0);"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Get all the way to the top and watch the score jump by 100."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
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
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // four directions, pause, restart\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === 'p' || k === ' ' || k === 'spacebar') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "The arrows are 'ArrowUp', 'ArrowDown', 'ArrowLeft' and 'ArrowRight'.",
            "toLowerCase() up front means you only ever compare lower-case names.",
            "Six ifs and a return null;"
        ],
        "tests": [
            {
                "name": "The arrows hop",
                "code": "assert(actionForKey('ArrowUp') === 'up');\nassert(actionForKey('ArrowDown') === 'down');\nassert(actionForKey('ArrowLeft') === 'left');\nassert(actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "WASD hops too",
                "code": "assert(actionForKey('w') === 'up');\nassert(actionForKey('s') === 'down');\nassert(actionForKey('a') === 'left');\nassert(actionForKey('d') === 'right');"
            },
            {
                "name": "Capital letters work",
                "code": "assert(actionForKey('W') === 'up');\nassert(actionForKey('R') === 'restart');"
            },
            {
                "name": "P and space pause",
                "code": "assert(actionForKey('p') === 'pause');\nassert(actionForKey(' ') === 'pause');"
            },
            {
                "name": "R starts a new game",
                "code": "assert(actionForKey('r') === 'restart');"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert(actionForKey('z') === null);\nassert(actionForKey('Enter') === null);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then cross the road with the arrow keys."
        }
    }
];
