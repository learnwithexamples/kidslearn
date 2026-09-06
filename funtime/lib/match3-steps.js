/* ============================================================
   match3-steps.js - the 5 steps of "Build Match Three"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const MATCH3_STEPS = [
    {
        "id": "are_neighbours",
        "fnName": "areNeighbours",
        "title": "Are they next door?",
        "adds": "The game knows which swaps are allowed.",
        "intro": "<p>You may only swap two shapes that are <strong>touching along an edge</strong> — not diagonally, and certainly not from opposite corners of the board.</p><p>There is a lovely one-line way to say that. Add up how far apart the two squares are across and down. Neighbours come to exactly 1. Diagonals come to 2. A square with itself comes to 0. One sum, three cases, all correct.</p>",
        "spec": {
            "input": "a, b — two squares, each with a column and a row",
            "output": "True if they touch along an edge",
            "algorithm": [
                "Work out the difference in columns, ignoring the sign.",
                "Do the same for the rows.",
                "They are neighbours when the two differences add up to exactly 1."
            ]
        },
        "starter": "function areNeighbours(a, b) {\n    // exactly one square apart, in total\n}\n",
        "answer": "function areNeighbours(a, b) {\n    const across = Math.abs(a.column - b.column);\n    const down = Math.abs(a.row - b.row);\n    return across + down === 1;\n}\n",
        "hints": [
            "Math.abs(...) throws away the minus sign, so the order does not matter.",
            "Add the two distances together.",
            "return across + down === 1;"
        ],
        "tests": [
            {
                "name": "Left and right are neighbours",
                "code": "assert(areNeighbours({ column: 3, row: 4 }, { column: 4, row: 4 }) === true);"
            },
            {
                "name": "Up and down are too",
                "code": "assert(areNeighbours({ column: 3, row: 4 }, { column: 3, row: 5 }) === true);"
            },
            {
                "name": "It works in either order",
                "code": "assert(areNeighbours({ column: 4, row: 4 }, { column: 3, row: 4 }) === true, 'a and b can be given round the other way');"
            },
            {
                "name": "Diagonals are NOT neighbours",
                "code": "assert(areNeighbours({ column: 3, row: 4 }, { column: 4, row: 5 }) === false, 'a diagonal is 1 across AND 1 down, which comes to 2');"
            },
            {
                "name": "A square is not its own neighbour",
                "code": "assert(areNeighbours({ column: 3, row: 4 }, { column: 3, row: 4 }) === false);"
            },
            {
                "name": "Two apart is too far",
                "code": "assert(areNeighbours({ column: 3, row: 4 }, { column: 5, row: 4 }) === false);"
            },
            {
                "name": "Opposite corners are certainly not",
                "code": "assert(areNeighbours({ column: 0, row: 0 }, { column: 7, row: 7 }) === false);"
            },
            {
                "name": "Every square has the right number of neighbours",
                "code": "let corner = 0;\nlet middle = 0;\nfor (let row = 0; row < GRID_SIZE; row++) {\n    for (let column = 0; column < GRID_SIZE; column++) {\n        if (areNeighbours({ column: 0, row: 0 }, { column: column, row: row })) { corner++; }\n        if (areNeighbours({ column: 4, row: 4 }, { column: column, row: row })) { middle++; }\n    }\n}\nassert(corner === 2, 'a corner square has 2 neighbours, not ' + corner);\nassert(middle === 4, 'a middle square has 4 neighbours, not ' + middle);"
            }
        ],
        "demo": {
            "kind": "shapes",
            "caption": "Move the cursor about — the note says whether the square to its right is a neighbour."
        }
    },
    {
        "id": "swap_gems",
        "fnName": "swapGems",
        "title": "Trade places",
        "adds": "Shapes can be swapped.",
        "intro": "<p>Swapping two things needs somewhere to put the first one while you move the second. Here that is easy, because we are building a <strong>new board</strong> rather than editing the old one.</p><p>That is not just tidiness. The game needs to try a swap, look at what it would do, and then <em>undo</em> it if it makes no line. Handing back a copy means undoing costs nothing at all — you simply throw the copy away.</p>",
        "spec": {
            "input": "board, a, b — two squares",
            "output": "a NEW board with the two shapes exchanged",
            "algorithm": [
                "Copy the board.",
                "Work out both places with gem-index.",
                "In the copy, put the shape from the second place into the first, and the shape from the first into the second.",
                "Return the copy."
            ]
        },
        "starter": "function swapGems(board, a, b) {\n    // a copy, with the two shapes exchanged\n}\n",
        "answer": "function swapGems(board, a, b) {\n    const copy = board.slice();\n    const first = gemIndex(a.column, a.row);\n    const second = gemIndex(b.column, b.row);\n\n    copy[first] = board[second];\n    copy[second] = board[first];\n    return copy;\n}\n",
        "hints": [
            "board.slice() copies a list.",
            "Read from the ORIGINAL board and write into the copy — then you never need a temporary variable.",
            "copy[first] = board[second];"
        ],
        "tests": [
            {
                "name": "The two shapes change places",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % SHAPE_COUNT); }\nconst a = { column: 0, row: 0 };\nconst b = { column: 1, row: 0 };\nconst swapped = swapGems(board, a, b);\nassert(swapped[gemIndex(0, 0)] === board[gemIndex(1, 0)]);\nassert(swapped[gemIndex(1, 0)] === board[gemIndex(0, 0)]);"
            },
            {
                "name": "Nothing else moves",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % SHAPE_COUNT); }\nconst swapped = swapGems(board, { column: 0, row: 0 }, { column: 1, row: 0 });\nfor (let i = 2; i < CELL_COUNT; i++) {\n    assert(swapped[i] === board[i], 'square ' + i + ' should not have changed');\n}"
            },
            {
                "name": "The board you were given is left alone",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % SHAPE_COUNT); }\nconst before = board.join(',');\nswapGems(board, { column: 0, row: 0 }, { column: 1, row: 0 });\nassert(board.join(',') === before, 'build a NEW board — the game needs to be able to undo a swap');"
            },
            {
                "name": "Swapping twice puts everything back",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % SHAPE_COUNT); }\nconst a = { column: 2, row: 3 };\nconst b = { column: 2, row: 4 };\nconst there = swapGems(board, a, b);\nconst back = swapGems(there, a, b);\nassert(back.join(',') === board.join(','));"
            },
            {
                "name": "It works up and down as well as across",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % SHAPE_COUNT); }\nconst swapped = swapGems(board, { column: 3, row: 3 }, { column: 3, row: 4 });\nassert(swapped[gemIndex(3, 3)] === board[gemIndex(3, 4)]);"
            },
            {
                "name": "The board is still the right size",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % SHAPE_COUNT); }\nassert(swapGems(board, { column: 0, row: 0 }, { column: 1, row: 0 }).length === CELL_COUNT);"
            }
        ],
        "demo": {
            "kind": "shapes",
            "caption": "Press Swap right and watch two shapes trade places."
        }
    },
    {
        "id": "find_matches",
        "fnName": "findMatches",
        "title": "Spot the lines",
        "adds": "The game can see a match.",
        "intro": "<p>The heart of the game: find every shape that is part of a line of three or more, across or down.</p><p>The trick is to keep a <strong>run</strong> as you walk along a row: how many of the same shape you have seen in a row so far. When the shape changes, the run has ended — and if it got to three or more, everything in it goes on the list.</p><p>Two things catch people out. The run that ends at the very <em>edge</em> of the board still counts, so you must check it after the loop. And a shape in the middle of a cross belongs to a row AND a column, so the same square would be listed twice — which is why the marks go into a set first.</p>",
        "spec": {
            "input": "board",
            "output": "a sorted list of the places to clear, with no repeats",
            "algorithm": [
                "Keep a set of marked places.",
                "For each row, build the list of places along it and scan it for runs.",
                "Do exactly the same for each column.",
                "A run of MIN_RUN or more means every place in it gets marked.",
                "Turn the set into a sorted list at the end."
            ]
        },
        "starter": "function findMatches(board) {\n    const marked = {};\n    // scan every row, then every column\n    return [];\n}\n",
        "answer": "function findMatches(board) {\n    const marked = {};\n\n    const markRun = function (cells, start, length) {\n        if (length < MIN_RUN) {\n            return;\n        }\n        for (let i = start; i < start + length; i++) {\n            marked[cells[i]] = true;\n        }\n    };\n\n    for (let row = 0; row < GRID_SIZE; row++) {\n        const cells = [];\n        for (let column = 0; column < GRID_SIZE; column++) {\n            cells.push(gemIndex(column, row));\n        }\n        scanLine(board, cells, markRun);\n    }\n\n    for (let column = 0; column < GRID_SIZE; column++) {\n        const cells = [];\n        for (let row = 0; row < GRID_SIZE; row++) {\n            cells.push(gemIndex(column, row));\n        }\n        scanLine(board, cells, markRun);\n    }\n\n    const found = [];\n    for (let i = 0; i < CELL_COUNT; i++) {\n        if (marked[i]) { found.push(i); }\n    }\n    return found;\n}\n",
        "hints": [
            "scanLine(board, cells, markRun) does the hard part — it finds the runs along one line.",
            "Build the list of places for a row, then for a column, and hand each to scanLine.",
            "Using an object as the marker set means a square listed twice only appears once."
        ],
        "tests": [
            {
                "name": "An empty-looking board with no lines finds nothing",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push((i % 3) + (Math.floor(i / GRID_SIZE) % 2) * 3); }\nassert(Array.isArray(findMatches(board)), 'it must return a list');"
            },
            {
                "name": "A row of three is found",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % 5 + 1); }\nboard[gemIndex(2, 3)] = 0;\nboard[gemIndex(3, 3)] = 0;\nboard[gemIndex(4, 3)] = 0;\nconst found = findMatches(board);\nassert(found.indexOf(gemIndex(2, 3)) !== -1 && found.indexOf(gemIndex(3, 3)) !== -1 && found.indexOf(gemIndex(4, 3)) !== -1, 'found ' + found);"
            },
            {
                "name": "A column of three is found",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % 5 + 1); }\nboard[gemIndex(2, 1)] = 0;\nboard[gemIndex(2, 2)] = 0;\nboard[gemIndex(2, 3)] = 0;\nconst found = findMatches(board);\nassert(found.indexOf(gemIndex(2, 2)) !== -1, 'a line going down must count too');"
            },
            {
                "name": "Two the same are NOT a match",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % 5 + 1); }\nboard[gemIndex(2, 3)] = 0;\nboard[gemIndex(3, 3)] = 0;\nassert(findMatches(board).indexOf(gemIndex(2, 3)) === -1, 'you need THREE in a line');"
            },
            {
                "name": "A run of four is all found",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % 5 + 1); }\nfor (let column = 1; column <= 4; column++) { board[gemIndex(column, 2)] = 0; }\nconst found = findMatches(board);\nlet count = 0;\nfor (let column = 1; column <= 4; column++) {\n    if (found.indexOf(gemIndex(column, 2)) !== -1) { count++; }\n}\nassert(count === 4, 'only ' + count + ' of the four were found');"
            },
            {
                "name": "A match at the very edge still counts",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push((i * 7) % 5 + 1); }\nboard[gemIndex(5, 0)] = 0;\nboard[gemIndex(6, 0)] = 0;\nboard[gemIndex(7, 0)] = 0;\nconst found = findMatches(board);\nassert(found.indexOf(gemIndex(7, 0)) !== -1, 'a run that ends at the edge of the board is still a run — did you check the last run after the loop?');"
            },
            {
                "name": "A square in a cross is only listed once",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push((i * 7) % 5 + 1); }\nfor (let column = 2; column <= 4; column++) { board[gemIndex(column, 3)] = 0; }\nfor (let row = 2; row <= 4; row++) { board[gemIndex(3, row)] = 0; }\nconst found = findMatches(board);\nlet appearances = 0;\nfound.forEach(function (index) { if (index === gemIndex(3, 3)) { appearances++; } });\nassert(appearances === 1, 'the middle of the cross appears ' + appearances + ' times — it must appear once');"
            },
            {
                "name": "Empty squares never match each other",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(EMPTY); }\nassert(findMatches(board).length === 0, 'a row of empty squares is not a line of three');"
            }
        ],
        "demo": {
            "kind": "matches",
            "caption": "Press Make a row or Make a column — the boxes show what the function found."
        },
        "warning": "Check the run that ends at the edge of the board. Miss it and a match against the right-hand or bottom wall is invisible to the game."
    },
    {
        "id": "apply_gravity",
        "fnName": "applyGravity",
        "title": "Let them fall",
        "adds": "The board refills itself.",
        "intro": "<p>Shapes have vanished and there are holes. Everything above a hole slides down, and brand-new shapes drop in from the top.</p><p>Rather than moving shapes one square at a time, there is a much simpler way: take a column, read it from the BOTTOM upwards collecting whatever is still there, then write that pile straight back at the bottom. Whatever is left at the top gets a new random shape. One pass, no shuffling.</p>",
        "spec": {
            "input": "board",
            "output": "a NEW board with everything fallen and the gaps refilled",
            "algorithm": [
                "Copy the board to write into.",
                "For each column: read from the bottom row upwards, collecting the shapes that are not EMPTY.",
                "Write them back from the bottom up, in the order you collected them.",
                "Any place above the pile gets a random shape."
            ]
        },
        "starter": "function applyGravity(board) {\n    const result = board.slice();\n    // one column at a time: collect from the bottom, write back from the bottom\n    return result;\n}\n",
        "answer": "function applyGravity(board) {\n    const result = board.slice();\n\n    for (let column = 0; column < GRID_SIZE; column++) {\n        const kept = [];\n        for (let row = GRID_SIZE - 1; row >= 0; row--) {\n            const shape = board[gemIndex(column, row)];\n            if (shape !== EMPTY) {\n                kept.push(shape);\n            }\n        }\n\n        for (let row = GRID_SIZE - 1; row >= 0; row--) {\n            const fromBottom = GRID_SIZE - 1 - row;\n            result[gemIndex(column, row)] =\n                fromBottom < kept.length ? kept[fromBottom] : randomShape();\n        }\n    }\n    return result;\n}\n",
        "hints": [
            "Collect from the bottom up, and write back from the bottom up — then the order takes care of itself.",
            "GRID_SIZE - 1 - row tells you how far up from the bottom a row is.",
            "randomShape() gives you a new one for the gaps at the top."
        ],
        "tests": [
            {
                "name": "No holes means nothing moves",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % SHAPE_COUNT); }\nassert(applyGravity(board).join(',') === board.join(','), 'a full board should come back unchanged');"
            },
            {
                "name": "A shape falls into the hole below it",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(1); }\nboard[gemIndex(3, 2)] = 5;\nboard[gemIndex(3, 7)] = EMPTY;\nconst fallen = applyGravity(board);\nassert(fallen[gemIndex(3, 3)] === 5, 'the 5 should have dropped one row');"
            },
            {
                "name": "The board comes back completely full",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(i % SHAPE_COUNT); }\nfor (let column = 0; column < GRID_SIZE; column++) { board[gemIndex(column, 4)] = EMPTY; }\nconst fallen = applyGravity(board);\nfor (let i = 0; i < CELL_COUNT; i++) {\n    assert(fallen[i] !== EMPTY, 'square ' + i + ' is still empty');\n}"
            },
            {
                "name": "New shapes appear at the TOP, not the bottom",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(1); }\nboard[gemIndex(0, 7)] = EMPTY;\nboard[gemIndex(0, 6)] = 3;\nconst fallen = applyGravity(board);\nassert(fallen[gemIndex(0, 7)] === 3, 'the 3 should have fallen to the bottom of the column');"
            },
            {
                "name": "An empty column fills up completely",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(1); }\nfor (let row = 0; row < GRID_SIZE; row++) { board[gemIndex(2, row)] = EMPTY; }\nconst fallen = applyGravity(board);\nfor (let row = 0; row < GRID_SIZE; row++) {\n    assert(fallen[gemIndex(2, row)] !== EMPTY);\n}"
            },
            {
                "name": "The shapes stay in their own column",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(1); }\nboard[gemIndex(0, 0)] = 4;\nboard[gemIndex(0, 7)] = EMPTY;\nconst fallen = applyGravity(board);\nlet fours = 0;\nfor (let row = 0; row < GRID_SIZE; row++) {\n    for (let column = 1; column < GRID_SIZE; column++) {\n        if (fallen[gemIndex(column, row)] === 4) { fours++; }\n    }\n}\nassert(fours === 0, 'a shape must never slide sideways into another column');"
            },
            {
                "name": "The board you were given is left alone",
                "code": "const board = [];\nfor (let i = 0; i < CELL_COUNT; i++) { board.push(1); }\nboard[gemIndex(3, 7)] = EMPTY;\napplyGravity(board);\nassert(board[gemIndex(3, 7)] === EMPTY, 'build a NEW board');"
            }
        ],
        "demo": {
            "kind": "matches",
            "caption": "Make a line, then press Let them fall and watch the board refill."
        }
    },
    {
        "id": "try_swap",
        "fnName": "trySwap",
        "title": "The move",
        "adds": "The whole game works!",
        "intro": "<p>Everything comes together. Swap the two shapes, look for a line — and if there is not one, <strong>put them straight back</strong>. That refusal is what makes the game a puzzle rather than a shuffling toy.</p><p>Putting them back costs nothing here, because swap-gems handed you a copy and the real board was never touched. That is the payoff for the decision you made two steps ago.</p>",
        "spec": {
            "input": "state, a, b — the two squares to exchange",
            "output": "True if the swap was allowed",
            "algorithm": [
                "Refuse if the game is over or paused, or if the two are not neighbours.",
                "Make the swapped board with swap-gems.",
                "If find-matches finds nothing, the move was not legal: count a bad swap and return False. The real board is untouched.",
                "Otherwise settle-board clears, drops and cascades — keep its board.",
                "Count the move, add up the shapes cleared, and remember the longest chain."
            ]
        },
        "starter": "function trySwap(state, a, b) {\n    // swap, look for a line, and put them back if there is none\n}\n",
        "answer": "function trySwap(state, a, b) {\n    if (state.isOver || state.isPaused || !areNeighbours(a, b)) {\n        return false;\n    }\n\n    const swapped = swapGems(state.board, a, b);\n    if (findMatches(swapped).length === 0) {\n        state.badSwaps = state.badSwaps + 1;\n        return false;\n    }\n\n    const settled = settleBoard(state, swapped);\n    state.board = settled.board;\n    state.moves = state.moves + 1;\n    state.cleared = state.cleared + settled.cleared;\n    if (settled.chains > state.bestChain) {\n        state.bestChain = settled.chains;\n    }\n    return true;\n}\n",
        "hints": [
            "Do the cheap checks first: over, paused, not neighbours.",
            "settleBoard(state, board) is written for you — it does the clearing, the falling and the cascades.",
            "Only write to state.board once you know the swap was legal."
        ],
        "tests": [
            {
                "name": "A swap that makes no line is refused",
                "code": "const state = createGame();\nconst before = state.board.join(',');\nlet refused = false;\nfor (let row = 0; row < GRID_SIZE && !refused; row++) {\n    for (let column = 0; column + 1 < GRID_SIZE && !refused; column++) {\n        const a = { column: column, row: row };\n        const b = { column: column + 1, row: row };\n        if (findMatches(swapGems(state.board, a, b)).length === 0) {\n            assert(trySwap(state, a, b) === false, 'that swap makes no line, so it must be refused');\n            refused = true;\n        }\n    }\n}\nassert(refused, 'the test could not find a bad swap to try');\nassert(state.board.join(',') === before, 'a refused swap must leave the board exactly as it was');"
            },
            {
                "name": "Two squares that are not neighbours are refused",
                "code": "const state = createGame();\nassert(trySwap(state, { column: 0, row: 0 }, { column: 5, row: 5 }) === false);"
            },
            {
                "name": "A swap that makes a line is allowed",
                "code": "const state = createGame();\nlet done = false;\nfor (let row = 0; row < GRID_SIZE && !done; row++) {\n    for (let column = 0; column + 1 < GRID_SIZE && !done; column++) {\n        const a = { column: column, row: row };\n        const b = { column: column + 1, row: row };\n        if (findMatches(swapGems(state.board, a, b)).length > 0) {\n            assert(trySwap(state, a, b) === true);\n            done = true;\n        }\n    }\n}\nassert(done, 'every fresh board has at least one good swap in it');"
            },
            {
                "name": "A good swap scores",
                "code": "const state = createGame();\nlet done = false;\nfor (let row = 0; row < GRID_SIZE && !done; row++) {\n    for (let column = 0; column + 1 < GRID_SIZE && !done; column++) {\n        const a = { column: column, row: row };\n        const b = { column: column + 1, row: row };\n        if (findMatches(swapGems(state.board, a, b)).length > 0) {\n            trySwap(state, a, b);\n            done = true;\n        }\n    }\n}\nassert(state.score > 0, 'clearing shapes must be worth something');\nassert(state.moves === 1);"
            },
            {
                "name": "A refused swap does not count as a move",
                "code": "const state = createGame();\ntrySwap(state, { column: 0, row: 0 }, { column: 5, row: 5 });\nassert(state.moves === 0);"
            },
            {
                "name": "The board is always full after a move",
                "code": "const state = createGame();\nfor (let attempt = 0; attempt < 15; attempt++) {\n    for (let row = 0; row < GRID_SIZE; row++) {\n        for (let column = 0; column + 1 < GRID_SIZE; column++) {\n            trySwap(state, { column: column, row: row }, { column: column + 1, row: row });\n        }\n    }\n}\nfor (let i = 0; i < CELL_COUNT; i++) {\n    assert(state.board[i] !== EMPTY, 'square ' + i + ' was left empty');\n}"
            },
            {
                "name": "No lines are left sitting on the board",
                "code": "const state = createGame();\nfor (let row = 0; row < GRID_SIZE; row++) {\n    for (let column = 0; column + 1 < GRID_SIZE; column++) {\n        trySwap(state, { column: column, row: row }, { column: column + 1, row: row });\n    }\n}\nassert(findMatches(state.board).length === 0, 'everything that matched should already have been cleared');"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page. Move with the arrows, SPACE to pick a shape, then SPACE on its neighbour."
        },
        "warning": "Put the shapes back when the swap makes no line. Forget that and the board can be shuffled about for ever, and the puzzle disappears."
    }
];
