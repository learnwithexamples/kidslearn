/* ============================================================
   bubbles-steps.js - the 5 steps of "Build Bubble Shooter"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const BUBBLES_STEPS = [
    {
        "id": "bubble_centre",
        "fnName": "bubbleCentre",
        "title": "Where does a bubble sit?",
        "adds": "The ceiling of bubbles appears.",
        "intro": "<p>The bubbles live on a grid, but they are <em>circles</em> — and a circle is drawn from its middle, not its corner.</p><p>So this gives back the MIDDLE of a cell: step across and down as usual, then add half a cell. Forget that half and every bubble is drawn a quarter of a cell up and to the left of where it belongs, which looks subtly wrong in a way that is maddening to track down.</p>",
        "spec": {
            "input": "column, row",
            "output": "the middle of that cell: { x, y }",
            "algorithm": [
                "x is column × CELL, plus half a cell.",
                "y is row × CELL, plus half a cell."
            ]
        },
        "starter": "function bubbleCentre(column, row) {\n    return { x: 0, y: 0 };\n}\n",
        "answer": "function bubbleCentre(column, row) {\n    return {\n        x: column * CELL + CELL / 2,\n        y: row * CELL + CELL / 2\n    };\n}\n",
        "hints": [
            "column * CELL gets you to the left edge of the cell.",
            "Add CELL / 2 to get to the middle.",
            "x: column * CELL + CELL / 2"
        ],
        "tests": [
            {
                "name": "The first cell's middle is half a cell in",
                "code": "const c = bubbleCentre(0, 0);\nassert(c.x === CELL / 2, 'x is ' + c.x + ' — a circle is drawn from its MIDDLE');\nassert(c.y === CELL / 2);"
            },
            {
                "name": "The next column is one cell across",
                "code": "assert(bubbleCentre(1, 0).x - bubbleCentre(0, 0).x === CELL);"
            },
            {
                "name": "The next row is one cell down",
                "code": "assert(bubbleCentre(0, 1).y - bubbleCentre(0, 0).y === CELL);"
            },
            {
                "name": "A cell in the middle of the grid",
                "code": "const c = bubbleCentre(3, 2);\nassert(c.x === 3 * CELL + CELL / 2, 'x is ' + c.x);\nassert(c.y === 2 * CELL + CELL / 2);"
            },
            {
                "name": "Every bubble fits on the field",
                "code": "for (let row = 0; row < ROWS; row++) {\n    for (let column = 0; column < COLUMNS; column++) {\n        const c = bubbleCentre(column, row);\n        assert(c.x - BUBBLE_RADIUS >= 0 && c.x + BUBBLE_RADIUS <= FIELD_WIDTH, 'the bubble at column ' + column + ' hangs off the side');\n    }\n}"
            },
            {
                "name": "It agrees with cellAtPixel",
                "code": "for (let row = 0; row < ROWS; row++) {\n    for (let column = 0; column < COLUMNS; column++) {\n        const c = bubbleCentre(column, row);\n        const back = cellAtPixel(c.x, c.y);\n        assert(back && back.column === column && back.row === row, 'the middle of (' + column + ',' + row + ') should be inside that very cell');\n    }\n}"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Move the dashed box around and read the middle of each cell."
        }
    },
    {
        "id": "turn_shooter",
        "fnName": "turnShooter",
        "title": "Take aim",
        "adds": "The arrow swings.",
        "intro": "<p>Holding a key swings the aim round. That part is easy — the interesting part is the <strong>limits</strong>.</p><p>The shooter must never point flat sideways, and certainly never downwards. A shot fired exactly horizontally would bounce between the two walls for ever and the game would simply stop, waiting for a bubble that is never going to land.</p><p>Two lines of clamping turn an unplayable bug into a rule nobody notices.</p>",
        "spec": {
            "input": "state. change — -1 for left, 1 for right. seconds.",
            "output": "nothing; it changes state.angle",
            "algorithm": [
                "Work out the new angle: the old one plus change × TURN_SPEED × seconds.",
                "If it is below MIN_ANGLE, hold it at MIN_ANGLE.",
                "If it is above MAX_ANGLE, hold it at MAX_ANGLE.",
                "Save it back."
            ]
        },
        "starter": "function turnShooter(state, change, seconds) {\n    // swing the aim, but never past the limits\n}\n",
        "answer": "function turnShooter(state, change, seconds) {\n    let angle = state.angle + change * TURN_SPEED * seconds;\n    if (angle < MIN_ANGLE) { angle = MIN_ANGLE; }\n    if (angle > MAX_ANGLE) { angle = MAX_ANGLE; }\n    state.angle = angle;\n}\n",
        "hints": [
            "Work the new angle out into a variable, then clamp it, then save it.",
            "Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, angle)) does both limits in one line.",
            "The time has to be part of the sum, or the aim moves at different speeds on different computers."
        ],
        "tests": [
            {
                "name": "Turning right increases the angle",
                "code": "const state = createGame();\nstate.angle = -Math.PI / 2;\nturnShooter(state, 1, 0.1);\nassert(state.angle > -Math.PI / 2);"
            },
            {
                "name": "Turning left decreases it",
                "code": "const state = createGame();\nstate.angle = -Math.PI / 2;\nturnShooter(state, -1, 0.1);\nassert(state.angle < -Math.PI / 2);"
            },
            {
                "name": "Not turning changes nothing",
                "code": "const state = createGame();\nstate.angle = -Math.PI / 2;\nturnShooter(state, 0, 0.1);\nassert(state.angle === -Math.PI / 2);"
            },
            {
                "name": "A longer frame turns further",
                "code": "const slow = createGame();\nconst quick = createGame();\nslow.angle = -Math.PI / 2;\nquick.angle = -Math.PI / 2;\nturnShooter(slow, 1, 0.1);\nturnShooter(quick, 1, 0.2);\nassert(quick.angle > slow.angle, 'the time must be part of the sum');"
            },
            {
                "name": "It stops at the left-hand limit",
                "code": "const state = createGame();\nfor (let i = 0; i < 200; i++) { turnShooter(state, -1, 0.05); }\nassert(Math.abs(state.angle - MIN_ANGLE) < 0.0001, 'the aim reached ' + state.angle.toFixed(2) + ' — it must stop at ' + MIN_ANGLE.toFixed(2));"
            },
            {
                "name": "It stops at the right-hand limit",
                "code": "const state = createGame();\nfor (let i = 0; i < 200; i++) { turnShooter(state, 1, 0.05); }\nassert(Math.abs(state.angle - MAX_ANGLE) < 0.0001, 'the aim reached ' + state.angle.toFixed(2));"
            },
            {
                "name": "The aim can never point downwards",
                "code": "const state = createGame();\nfor (let i = 0; i < 400; i++) {\n    turnShooter(state, i % 2 === 0 ? 1 : -1, 0.4);\n    assert(Math.sin(state.angle) < 0, 'the shooter is pointing DOWN — a shot fired there would never land');\n}"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Aim left and right — the dashed line shows where the shot will go."
        },
        "warning": "Clamp the angle. Without limits a player can aim flat sideways, and that shot bounces between the walls until the end of time."
    },
    {
        "id": "same_group",
        "fnName": "sameGroup",
        "title": "Which ones are joined?",
        "adds": "The game can see a group.",
        "intro": "<p>You have met this before: it is <strong>flood fill</strong>, exactly as in Minesweeper. Start at one bubble, look at its neighbours, and keep spreading while they hold the same kind.</p><p>Two details make it work. Check <em>have I seen this one before?</em> inside the loop, or a group of three will chase itself round in circles for ever. And an empty cell has no group at all, so deal with that first — it is the case that reaches you when a shot lands somewhere unexpected.</p>",
        "spec": {
            "input": "grid, column, row",
            "output": "a list of the joined cells of the same kind, including the one you started from",
            "algorithm": [
                "Look at what kind is in the starting cell. If it is EMPTY, there is no group: return an empty list.",
                "Keep a set of the cells you have seen, a list for the answer, and a to-do list holding the first cell.",
                "While the to-do list is not empty: take one off; skip it if you have seen it or it holds a different kind; otherwise mark it, keep it, and add its neighbours to the to-do list."
            ]
        },
        "starter": "function sameGroup(grid, column, row) {\n    // flood fill, but only through bubbles of the same kind\n    return [];\n}\n",
        "answer": "function sameGroup(grid, column, row) {\n    const kind = grid[bubbleIndex(column, row)];\n    if (kind === EMPTY) {\n        return [];\n    }\n\n    const seen = {};\n    const group = [];\n    const todo = [{ column: column, row: row }];\n\n    while (todo.length > 0) {\n        const cell = todo.pop();\n        const index = bubbleIndex(cell.column, cell.row);\n\n        if (seen[index] || grid[index] !== kind) {\n            continue;\n        }\n        seen[index] = true;\n        group.push(cell);\n\n        const around = neighbours(cell.column, cell.row);\n        for (let i = 0; i < around.length; i++) {\n            todo.push(around[i]);\n        }\n    }\n    return group;\n}\n",
        "hints": [
            "neighbours(column, row) is written for you and never leaves the grid.",
            "The 'have I seen this?' check goes INSIDE the loop — that is what stops it going round for ever.",
            "An empty starting cell returns an empty list, before anything else happens."
        ],
        "tests": [
            {
                "name": "A lone bubble is a group of one",
                "code": "const grid = [];\nfor (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }\ngrid[bubbleIndex(3, 1)] = 2;\nassert(sameGroup(grid, 3, 1).length === 1);"
            },
            {
                "name": "A row of three is one group",
                "code": "const grid = [];\nfor (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }\n[1, 2, 3].forEach(function (c) { grid[bubbleIndex(c, 0)] = 1; });\nassert(sameGroup(grid, 2, 0).length === 3, 'found ' + sameGroup(grid, 2, 0).length);"
            },
            {
                "name": "A column of three is one group too",
                "code": "const grid = [];\nfor (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }\n[0, 1, 2].forEach(function (r) { grid[bubbleIndex(4, r)] = 3; });\nassert(sameGroup(grid, 4, 1).length === 3);"
            },
            {
                "name": "A different kind next door is NOT in the group",
                "code": "const grid = [];\nfor (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }\ngrid[bubbleIndex(2, 0)] = 1;\ngrid[bubbleIndex(3, 0)] = 4;\nassert(sameGroup(grid, 2, 0).length === 1, 'a bubble of another kind must not join the group');"
            },
            {
                "name": "An empty cell has no group",
                "code": "const grid = [];\nfor (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }\nassert(sameGroup(grid, 4, 4).length === 0);"
            },
            {
                "name": "A big blob is found whole",
                "code": "const grid = [];\nfor (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }\nfor (let row = 0; row < 3; row++) {\n    for (let column = 0; column < 4; column++) {\n        grid[bubbleIndex(column, row)] = 2;\n    }\n}\nassert(sameGroup(grid, 1, 1).length === 12, 'found ' + sameGroup(grid, 1, 1).length + ' of 12');"
            },
            {
                "name": "Starting anywhere in the group finds the same group",
                "code": "const grid = [];\nfor (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }\n[1, 2, 3].forEach(function (c) { grid[bubbleIndex(c, 0)] = 1; });\nassert(sameGroup(grid, 1, 0).length === sameGroup(grid, 3, 0).length);"
            },
            {
                "name": "Nothing appears twice",
                "code": "const grid = [];\nfor (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }\nfor (let row = 0; row < 3; row++) {\n    for (let column = 0; column < 3; column++) {\n        grid[bubbleIndex(column, row)] = 0;\n    }\n}\nconst group = sameGroup(grid, 1, 1);\nconst seen = {};\ngroup.forEach(function (cell) {\n    const key = bubbleIndex(cell.column, cell.row);\n    assert(!seen[key], 'cell ' + key + ' is in the list twice');\n    seen[key] = true;\n});"
            }
        ],
        "demo": {
            "kind": "group",
            "caption": "Move the box onto a bubble — the outlines show everything joined to it."
        },
        "warning": "Check 'have I seen this cell?' inside the loop. Without it, two neighbouring bubbles put each other on the to-do list for ever."
    },
    {
        "id": "pop_group",
        "fnName": "popGroup",
        "title": "Pop!",
        "adds": "Bubbles burst.",
        "intro": "<p>The rule everybody knows: <strong>three or more</strong>. Two of a kind touching is not enough, and nothing at all happens.</p><p>That refusal is the game. If pairs popped, you could clear the board by firing at random.</p>",
        "spec": {
            "input": "state, group — the cells found by same-group",
            "output": "how many bubbles popped",
            "algorithm": [
                "If the group is smaller than MIN_POP, do nothing and return 0.",
                "Otherwise set every cell in the group to EMPTY.",
                "Score POINTS_PER_BUBBLE for each one, count them, and return how many."
            ]
        },
        "starter": "function popGroup(state, group) {\n    // three or more, or nothing at all\n}\n",
        "answer": "function popGroup(state, group) {\n    if (group.length < MIN_POP) {\n        return 0;\n    }\n    for (let i = 0; i < group.length; i++) {\n        state.grid[bubbleIndex(group[i].column, group[i].row)] = EMPTY;\n    }\n    state.score = state.score + group.length * POINTS_PER_BUBBLE;\n    state.popped = state.popped + group.length;\n    return group.length;\n}\n",
        "hints": [
            "The guard comes first: too small, return 0, and change nothing at all.",
            "EMPTY is what an empty cell holds.",
            "Score for every bubble in the group, not just one."
        ],
        "tests": [
            {
                "name": "Three pop",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\n[1, 2, 3].forEach(function (c) { state.grid[bubbleIndex(c, 0)] = 1; });\nconst group = sameGroup(state.grid, 2, 0);\nassert(popGroup(state, group) === 3);"
            },
            {
                "name": "The cells really are emptied",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\n[1, 2, 3].forEach(function (c) { state.grid[bubbleIndex(c, 0)] = 1; });\npopGroup(state, sameGroup(state.grid, 2, 0));\nassert(state.grid[bubbleIndex(2, 0)] === EMPTY);"
            },
            {
                "name": "Two do NOT pop",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\n[1, 2].forEach(function (c) { state.grid[bubbleIndex(c, 0)] = 1; });\nassert(popGroup(state, sameGroup(state.grid, 1, 0)) === 0, 'a pair is not enough');"
            },
            {
                "name": "A pair is left exactly where it was",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\n[1, 2].forEach(function (c) { state.grid[bubbleIndex(c, 0)] = 1; });\npopGroup(state, sameGroup(state.grid, 1, 0));\nassert(state.grid[bubbleIndex(1, 0)] === 1, 'nothing should have changed');"
            },
            {
                "name": "Popping scores",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nstate.score = 0;\n[1, 2, 3].forEach(function (c) { state.grid[bubbleIndex(c, 0)] = 1; });\npopGroup(state, sameGroup(state.grid, 2, 0));\nassert(state.score === 3 * POINTS_PER_BUBBLE, 'score is ' + state.score);"
            },
            {
                "name": "A bigger group scores more",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nstate.score = 0;\nfor (let c = 0; c < 6; c++) { state.grid[bubbleIndex(c, 0)] = 1; }\npopGroup(state, sameGroup(state.grid, 2, 0));\nassert(state.score === 6 * POINTS_PER_BUBBLE);"
            },
            {
                "name": "An empty group does nothing",
                "code": "const state = createGame();\nconst before = state.score;\nassert(popGroup(state, []) === 0);\nassert(state.score === before);"
            }
        ],
        "demo": {
            "kind": "drop",
            "caption": "Press Pop the group and watch the three at the top left burst."
        }
    },
    {
        "id": "drop_floaters",
        "fnName": "dropFloaters",
        "title": "Cut them loose",
        "adds": "The whole game works!",
        "intro": "<p>The most satisfying rule in the game, and the cleverest one.</p><p>It is the <em>same search again</em>, asked a completely different question. Instead of \"which bubbles of the same kind are joined to this one?\", ask <strong>\"which bubbles are joined to the ceiling?\"</strong> — starting from the whole top row, and ignoring what kind they are.</p><p>Whatever the search never reaches must be dangling in mid-air. Down it all comes, and each one is worth more than a popped bubble, because knocking out a whole cluster with one shot deserves it.</p>",
        "spec": {
            "input": "state",
            "output": "how many bubbles fell",
            "algorithm": [
                "Start a to-do list holding every bubble in the TOP row.",
                "Spread out through the neighbours exactly as before, but do not care what kind they are. Mark everything you reach as HELD.",
                "Then look at every cell: anything that holds a bubble but was never marked is floating.",
                "Empty those, score POINTS_PER_DROP for each, and return how many fell."
            ]
        },
        "starter": "function dropFloaters(state) {\n    // what is joined to the ceiling stays; everything else falls\n}\n",
        "answer": "function dropFloaters(state) {\n    const held = {};\n    const todo = [];\n\n    for (let column = 0; column < COLUMNS; column++) {\n        if (state.grid[bubbleIndex(column, 0)] !== EMPTY) {\n            todo.push({ column: column, row: 0 });\n        }\n    }\n\n    while (todo.length > 0) {\n        const cell = todo.pop();\n        const index = bubbleIndex(cell.column, cell.row);\n\n        if (held[index] || state.grid[index] === EMPTY) {\n            continue;\n        }\n        held[index] = true;\n\n        const around = neighbours(cell.column, cell.row);\n        for (let i = 0; i < around.length; i++) {\n            todo.push(around[i]);\n        }\n    }\n\n    let fell = 0;\n    for (let i = 0; i < state.grid.length; i++) {\n        if (state.grid[i] !== EMPTY && !held[i]) {\n            state.grid[i] = EMPTY;\n            fell = fell + 1;\n        }\n    }\n\n    if (fell > 0) {\n        state.score = state.score + fell * POINTS_PER_DROP;\n        state.dropped = state.dropped + fell;\n    }\n    return fell;\n}\n",
        "hints": [
            "Start the to-do list with EVERY bubble in row 0, not just one.",
            "This search ignores the kind — any bubble at all keeps the search going.",
            "Do the dropping in a second pass, after the search has finished."
        ],
        "tests": [
            {
                "name": "A bubble on the ceiling stays",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nstate.grid[bubbleIndex(0, 0)] = 1;\nassert(dropFloaters(state) === 0);\nassert(state.grid[bubbleIndex(0, 0)] === 1);"
            },
            {
                "name": "A bubble floating in mid-air falls",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nstate.grid[bubbleIndex(5, 5)] = 2;\nassert(dropFloaters(state) === 1, 'nothing is holding that one up');\nassert(state.grid[bubbleIndex(5, 5)] === EMPTY);"
            },
            {
                "name": "A chain hanging from the ceiling stays",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nfor (let row = 0; row < 5; row++) { state.grid[bubbleIndex(3, row)] = 1; }\nassert(dropFloaters(state) === 0, 'every one of those is joined to the top');"
            },
            {
                "name": "Different kinds still hold each other up",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nstate.grid[bubbleIndex(3, 0)] = 0;\nstate.grid[bubbleIndex(3, 1)] = 4;\nassert(dropFloaters(state) === 0, 'a bubble of any kind can hold up any other — this search ignores the kind');"
            },
            {
                "name": "Cutting the thread brings the whole cluster down",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nstate.grid[bubbleIndex(6, 0)] = 1;\nstate.grid[bubbleIndex(6, 1)] = 2;\n[5, 6, 7].forEach(function (c) { state.grid[bubbleIndex(c, 2)] = 2; });\nassert(dropFloaters(state) === 0, 'it is all still hanging on');\nstate.grid[bubbleIndex(6, 1)] = EMPTY;\nassert(dropFloaters(state) === 3, 'with the thread cut, all three should fall');"
            },
            {
                "name": "Falling scores",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nstate.score = 0;\nstate.grid[bubbleIndex(5, 5)] = 2;\nstate.grid[bubbleIndex(6, 5)] = 2;\ndropFloaters(state);\nassert(state.score === 2 * POINTS_PER_DROP, 'score is ' + state.score);"
            },
            {
                "name": "An empty board drops nothing",
                "code": "const state = createGame();\nstate.grid = state.grid.map(function () { return EMPTY; });\nassert(dropFloaters(state) === 0);"
            },
            {
                "name": "A full ceiling never falls",
                "code": "const state = createGame();\nassert(dropFloaters(state) === 0, 'a freshly filled ceiling is all connected to the top');"
            }
        ],
        "demo": {
            "kind": "drop",
            "caption": "Press Cut the thread, then Let them fall — the whole cluster on the right drops."
        },
        "warning": "Start from EVERY bubble in the top row. Start from just one and everything hanging from a different part of the ceiling is wrongly thrown away."
    }
];
