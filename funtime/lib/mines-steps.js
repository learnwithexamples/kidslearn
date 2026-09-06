/* ============================================================
   mines-steps.js - the 7 steps of "Build Minesweeper"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const MINES_STEPS = [
    {
        "id": "neighbours",
        "fnName": "neighbours",
        "title": "Who is next door?",
        "adds": "The board knows which squares touch.",
        "intro": "<p>Almost everything in Minesweeper is about the eight squares around a square. Write this one well and the rest of the game falls out of it.</p><p>The neat way is to walk over the little 3×3 box around the square, skipping two things: the middle (that is the square itself) and anything that falls off the edge of the board. A corner has 3 neighbours, an edge has 5, and the middle has 8.</p>",
        "spec": {
            "input": "column, row",
            "output": "a list of the squares touching it",
            "algorithm": [
                "Loop dRow from -1 to 1, and dColumn from -1 to 1 inside it.",
                "Skip the case where both are 0 — that is the square itself.",
                "Work out the neighbour's column and row.",
                "Only keep it if is-inside-grid says it is on the board."
            ]
        },
        "starter": "function neighbours(column, row) {\n    const list = [];\n    // the 3x3 box around it, minus the middle, minus anything off the board\n    return list;\n}\n",
        "answer": "function neighbours(column, row) {\n    const list = [];\n    for (let dRow = -1; dRow <= 1; dRow++) {\n        for (let dColumn = -1; dColumn <= 1; dColumn++) {\n            if (dColumn === 0 && dRow === 0) {\n                continue;\n            }\n            const c = column + dColumn;\n            const r = row + dRow;\n            if (isInsideGrid(c, r)) {\n                list.push({ column: c, row: r });\n            }\n        }\n    }\n    return list;\n}\n",
        "hints": [
            "Two loops, both from -1 to 1.",
            "continue; skips the middle without leaving the loop.",
            "isInsideGrid(c, r) is already written for you."
        ],
        "tests": [
            {
                "name": "The middle of the board has 8 neighbours",
                "code": "assert(neighbours(4, 4).length === 8, 'gave ' + neighbours(4, 4).length);"
            },
            {
                "name": "A corner has only 3",
                "code": "assert(neighbours(0, 0).length === 3, 'gave ' + neighbours(0, 0).length + ' — most of a corner\\'s box is off the board');"
            },
            {
                "name": "An edge has 5",
                "code": "assert(neighbours(4, 0).length === 5, 'gave ' + neighbours(4, 0).length);"
            },
            {
                "name": "The other three corners work too",
                "code": "assert(neighbours(GRID_SIZE - 1, 0).length === 3);\nassert(neighbours(0, GRID_SIZE - 1).length === 3);\nassert(neighbours(GRID_SIZE - 1, GRID_SIZE - 1).length === 3);"
            },
            {
                "name": "A square is never its own neighbour",
                "code": "assert(neighbours(4, 4).every(n => !(n.column === 4 && n.row === 4)), 'the middle of the box must be skipped');"
            },
            {
                "name": "Every neighbour is on the board",
                "code": "for (let row = 0; row < GRID_SIZE; row++) {\n    for (let column = 0; column < GRID_SIZE; column++) {\n        neighbours(column, row).forEach(function (n) {\n            assert(isInsideGrid(n.column, n.row), '(' + n.column + ',' + n.row + ') is off the board');\n        });\n    }\n}"
            },
            {
                "name": "Neighbours are always right next door",
                "code": "neighbours(4, 4).forEach(function (n) {\n    assert(Math.abs(n.column - 4) <= 1 && Math.abs(n.row - 4) <= 1, 'that square is not touching');\n});"
            },
            {
                "name": "Being a neighbour goes both ways",
                "code": "const mine = neighbours(3, 5);\nassert(mine.some(n => n.column === 4 && n.row === 5));\nassert(neighbours(4, 5).some(n => n.column === 3 && n.row === 5), 'if A touches B then B touches A');"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Move around the board — the outlined squares are the neighbours of the dashed one."
        }
    },
    {
        "id": "count_mines",
        "fnName": "countMines",
        "title": "The numbers",
        "adds": "The board can tell you what it knows.",
        "intro": "<p>This is the number printed on a square, and it is the only information the game ever gives you. Everything a good player does is deduced from these numbers.</p><p>Now that neighbours() exists, this is four lines.</p>",
        "spec": {
            "input": "state, column, row",
            "output": "how many of its neighbours are mines (0 to 8)",
            "algorithm": [
                "Start a count at 0.",
                "Ask neighbours() for the squares around this one.",
                "For each, look it up in state.mines — add 1 if it is a mine.",
                "Return the count."
            ]
        },
        "starter": "function countMines(state, column, row) {\n    // how many neighbours are mines?\n}\n",
        "answer": "function countMines(state, column, row) {\n    let count = 0;\n    const around = neighbours(column, row);\n    for (let i = 0; i < around.length; i++) {\n        if (state.mines[cellIndex(around[i].column, around[i].row)]) {\n            count = count + 1;\n        }\n    }\n    return count;\n}\n",
        "hints": [
            "Use the neighbours() you just wrote.",
            "cellIndex(column, row) finds a square's place in state.mines.",
            "Do NOT count the square itself — neighbours() already left it out."
        ],
        "tests": [
            {
                "name": "An empty board has no numbers",
                "code": "const state = createGame();\nassert(countMines(state, 4, 4) === 0);"
            },
            {
                "name": "One mine next door counts as one",
                "code": "const state = createGame();\nstate.mines[cellIndex(3, 4)] = true;\nassert(countMines(state, 4, 4) === 1, 'gave ' + countMines(state, 4, 4));"
            },
            {
                "name": "A diagonal mine counts too",
                "code": "const state = createGame();\nstate.mines[cellIndex(3, 3)] = true;\nassert(countMines(state, 4, 4) === 1, 'corners touch as well as sides');"
            },
            {
                "name": "A mine two squares away does not count",
                "code": "const state = createGame();\nstate.mines[cellIndex(2, 4)] = true;\nassert(countMines(state, 4, 4) === 0);"
            },
            {
                "name": "Eight mines give an 8",
                "code": "const state = createGame();\nneighbours(4, 4).forEach(n => { state.mines[cellIndex(n.column, n.row)] = true; });\nassert(countMines(state, 4, 4) === 8, 'gave ' + countMines(state, 4, 4));"
            },
            {
                "name": "A square does not count itself",
                "code": "const state = createGame();\nstate.mines[cellIndex(4, 4)] = true;\nassert(countMines(state, 4, 4) === 0, 'a mine does not count itself');"
            },
            {
                "name": "It works in a corner",
                "code": "const state = createGame();\nstate.mines[cellIndex(1, 0)] = true;\nstate.mines[cellIndex(1, 1)] = true;\nassert(countMines(state, 0, 0) === 2);"
            }
        ],
        "demo": {
            "kind": "count",
            "caption": "An open board with the mines showing. Move around and check the numbers yourself."
        }
    },
    {
        "id": "place_mines",
        "fnName": "placeMines",
        "title": "Hide the mines",
        "adds": "A fair board.",
        "intro": "<p>Here is a rule almost every beginner gets wrong, and every good Minesweeper gets right: <strong>the mines are laid after the first click, not before</strong>.</p><p>Lay them first and your opening move is a coin toss — you can lose a game before you have made a single decision. Laying them afterwards, avoiding the square you clicked <em>and its neighbours</em>, guarantees your first click always opens a nice big area.</p>",
        "spec": {
            "input": "state, safeColumn, safeRow — where the player just clicked",
            "output": "nothing; it fills in state.mines",
            "algorithm": [
                "Build a set of banned squares: the one clicked and all its neighbours.",
                "Make a list of every other square — those are allowed to hold a mine.",
                "Shuffle that list.",
                "Set state.mines to all false, then turn on the first MINE_COUNT of the shuffled list.",
                "Remember that the mines are now placed."
            ]
        },
        "starter": "function placeMines(state, safeColumn, safeRow) {\n    // never under the first click, or next to it\n}\n",
        "answer": "function placeMines(state, safeColumn, safeRow) {\n    const banned = {};\n    banned[cellIndex(safeColumn, safeRow)] = true;\n    neighbours(safeColumn, safeRow).forEach(function (cell) {\n        banned[cellIndex(cell.column, cell.row)] = true;\n    });\n\n    const allowed = [];\n    for (let i = 0; i < CELL_COUNT; i++) {\n        if (!banned[i]) { allowed.push(i); }\n    }\n\n    for (let i = allowed.length - 1; i > 0; i--) {\n        const j = Math.floor(Math.random() * (i + 1));\n        const swap = allowed[i];\n        allowed[i] = allowed[j];\n        allowed[j] = swap;\n    }\n\n    state.mines = [];\n    for (let i = 0; i < CELL_COUNT; i++) { state.mines.push(false); }\n    for (let i = 0; i < MINE_COUNT && i < allowed.length; i++) {\n        state.mines[allowed[i]] = true;\n    }\n    state.minesPlaced = true;\n}\n",
        "hints": [
            "Ban the clicked square AND its neighbours — that is what opens a big area.",
            "Shuffling then taking the first ten is the easiest way to pick ten at random with no repeats.",
            "Do not forget state.minesPlaced = true; at the end."
        ],
        "tests": [
            {
                "name": "It lays exactly MINE_COUNT mines",
                "code": "const state = createGame();\nplaceMines(state, 4, 4);\nassert(state.mines.filter(Boolean).length === MINE_COUNT, 'laid ' + state.mines.filter(Boolean).length);"
            },
            {
                "name": "The clicked square is never a mine",
                "code": "for (let trial = 0; trial < 60; trial++) {\n    const state = createGame();\n    placeMines(state, 4, 4);\n    assert(state.mines[cellIndex(4, 4)] === false, 'you cannot lose on your first click');\n}"
            },
            {
                "name": "Nor are any of its neighbours",
                "code": "for (let trial = 0; trial < 60; trial++) {\n    const state = createGame();\n    placeMines(state, 4, 4);\n    neighbours(4, 4).forEach(function (n) {\n        assert(state.mines[cellIndex(n.column, n.row)] === false, 'the first click must open an AREA, not one square');\n    });\n}"
            },
            {
                "name": "It works in a corner too",
                "code": "const state = createGame();\nplaceMines(state, 0, 0);\nassert(state.mines.filter(Boolean).length === MINE_COUNT, 'a corner has fewer safe squares, but there is still room');\nassert(state.mines[cellIndex(0, 0)] === false);"
            },
            {
                "name": "It remembers that the mines are down",
                "code": "const state = createGame();\nplaceMines(state, 4, 4);\nassert(state.minesPlaced === true);"
            },
            {
                "name": "Different games get different boards",
                "code": "const a = createGame();\nconst b = createGame();\nplaceMines(a, 4, 4);\nplaceMines(b, 4, 4);\nassert(a.mines.join('') !== b.mines.join(''), 'two games in a row should not be identical');"
            },
            {
                "name": "Every square can hold a mine sometimes",
                "code": "const seen = {};\nfor (let trial = 0; trial < 300; trial++) {\n    const state = createGame();\n    placeMines(state, 0, 0);\n    state.mines.forEach(function (isMine, i) { if (isMine) { seen[i] = true; } });\n}\nassert(Object.keys(seen).length > CELL_COUNT / 2, 'the mines should be spread over the whole board');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Dig anywhere. Your first click can never be a mine — try it a few times."
        },
        "warning": "Ban the neighbours as well as the square itself. Ban only the one square and your first click often opens a single number, which is no fun at all."
    },
    {
        "id": "reveal_cell",
        "fnName": "revealCell",
        "title": "Flood fill",
        "adds": "One click opens a whole field.",
        "intro": "<p>This is the big one — the most valuable algorithm in this entire collection. It is called <strong>flood fill</strong>, and the paint bucket in every drawing program is the same idea.</p><p>The rule is simple: uncover a square; if it has no mines touching it, there is nothing to work out around it, so uncover its neighbours too — and keep going.</p><p>Rather than a function that calls itself, this version keeps a <em>to-do list</em>. Take a square off, deal with it, and if it is blank put its neighbours on. When the list is empty you are done.</p>",
        "spec": {
            "input": "state, column, row",
            "output": "True if anything was uncovered",
            "algorithm": [
                "Refuse if the game is over or the square is off the board.",
                "Refuse if it is already open or flagged.",
                "If the mines are not down yet, lay them now — this click is the first.",
                "If this square IS a mine: uncover it and the game is over.",
                "Otherwise start a to-do list holding just this square. While it is not empty: take one off, skip it if it is already open or flagged, uncover it, and if count-mines is 0 add all its neighbours to the list.",
                "Finally, check whether that won the game."
            ]
        },
        "starter": "function revealCell(state, column, row) {\n    // guards, then the first click, then FLOOD FILL\n}\n",
        "answer": "function revealCell(state, column, row) {\n    if (state.isOver || !isInsideGrid(column, row)) {\n        return false;\n    }\n    const first = cellIndex(column, row);\n    if (state.revealed[first] || state.flagged[first]) {\n        return false;\n    }\n\n    if (!state.minesPlaced) {\n        placeMines(state, column, row);\n    }\n\n    if (state.mines[first]) {\n        state.revealed[first] = true;\n        state.isOver = true;\n        state.hitMine = first;\n        return true;\n    }\n\n    const todo = [{ column: column, row: row }];\n    while (todo.length > 0) {\n        const cell = todo.pop();\n        const index = cellIndex(cell.column, cell.row);\n\n        if (state.revealed[index] || state.flagged[index]) {\n            continue;\n        }\n        state.revealed[index] = true;\n\n        if (countMines(state, cell.column, cell.row) === 0) {\n            const around = neighbours(cell.column, cell.row);\n            for (let i = 0; i < around.length; i++) {\n                todo.push(around[i]);\n            }\n        }\n    }\n\n    checkWin(state);\n    return true;\n}\n",
        "hints": [
            "The to-do list is just an array. push() puts one on, pop() takes one off.",
            "The 'already open' check inside the loop is what stops it going round for ever.",
            "Only spread out from squares whose count is 0."
        ],
        "tests": [
            {
                "name": "Digging a safe square opens it",
                "code": "const state = createGame();\nrevealCell(state, 4, 4);\nassert(state.revealed[cellIndex(4, 4)] === true);"
            },
            {
                "name": "The first click lays the mines",
                "code": "const state = createGame();\nassert(state.minesPlaced === false);\nrevealCell(state, 4, 4);\nassert(state.minesPlaced === true);"
            },
            {
                "name": "You can never lose on the first click",
                "code": "for (let trial = 0; trial < 60; trial++) {\n    const state = createGame();\n    revealCell(state, 4, 4);\n    assert(state.isOver === false || state.isWon === true, 'the first click must be safe');\n}"
            },
            {
                "name": "The first click opens more than one square",
                "code": "for (let trial = 0; trial < 30; trial++) {\n    const state = createGame();\n    revealCell(state, 4, 4);\n    assert(revealedCount(state) >= 9, 'only ' + revealedCount(state) + ' opened — the flood should spread');\n}"
            },
            {
                "name": "Digging a mine ends the game",
                "code": "const state = createGame();\nrevealCell(state, 0, 0);\nlet mine = state.mines.indexOf(true);\nconst column = mine % GRID_SIZE;\nconst row = Math.floor(mine / GRID_SIZE);\nrevealCell(state, column, row);\nassert(state.isOver === true);"
            },
            {
                "name": "A flagged square is protected",
                "code": "const state = createGame();\nrevealCell(state, 0, 0);\n/* whichever square is still covered — the flood fill may have opened a lot */\nconst covered = state.revealed.indexOf(false);\nconst column = covered % GRID_SIZE;\nconst row = Math.floor(covered / GRID_SIZE);\ntoggleFlag(state, column, row);\nrevealCell(state, column, row);\nassert(state.revealed[covered] === false, 'a flag should stop a fumbled click');"
            },
            {
                "name": "The flood never goes past a number",
                "code": "const state = createGame();\nrevealCell(state, 4, 4);\nstate.revealed.forEach(function (open, i) {\n    if (open) { assert(state.mines[i] === false, 'the flood uncovered a mine!'); }\n});"
            },
            {
                "name": "Opening every safe square wins",
                "code": "const state = createGame();\nrevealCell(state, 4, 4);\nfor (let row = 0; row < GRID_SIZE; row++) {\n    for (let column = 0; column < GRID_SIZE; column++) {\n        if (!state.mines[cellIndex(column, row)]) { revealCell(state, column, row); }\n    }\n}\nassert(state.isWon === true, 'every safe square is open — that is a win');"
            },
            {
                "name": "Digging the same square twice does nothing",
                "code": "const state = createGame();\nrevealCell(state, 4, 4);\nconst before = revealedCount(state);\nassert(revealCell(state, 4, 4) === false);\nassert(revealedCount(state) === before);"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Dig around and watch one click open a whole area."
        },
        "warning": "Check 'is it already open?' INSIDE the loop, not just before it. A square can land on the to-do list several times, and without that check the loop never ends."
    },
    {
        "id": "toggle_flag",
        "fnName": "toggleFlag",
        "title": "Plant a flag",
        "adds": "You can mark the mines you have found.",
        "intro": "<p>A flag is a note to yourself: <em>I have worked out that this one is a mine.</em></p><p>It also protects the square. Once flagged, digging refuses to open it — which is exactly what you want when you are clicking quickly and your finger slips.</p>",
        "spec": {
            "input": "state, column, row",
            "output": "True if the flag changed",
            "algorithm": [
                "Refuse if the game is over or the square is off the board.",
                "Refuse if the square is already open — there is nothing left to mark.",
                "Otherwise flip the flag: on becomes off, off becomes on."
            ]
        },
        "starter": "function toggleFlag(state, column, row) {\n    // only on a covered square, and it flips\n}\n",
        "answer": "function toggleFlag(state, column, row) {\n    if (state.isOver || !isInsideGrid(column, row)) {\n        return false;\n    }\n    const index = cellIndex(column, row);\n    if (state.revealed[index]) {\n        return false;\n    }\n    state.flagged[index] = !state.flagged[index];\n    return true;\n}\n",
        "hints": [
            "Flipping a true/false is just x = !x;",
            "Three guards first, then the one line that does the work.",
            "state.flagged[index] = !state.flagged[index];"
        ],
        "tests": [
            {
                "name": "Flagging a covered square works",
                "code": "const state = createGame();\ntoggleFlag(state, 2, 2);\nassert(state.flagged[cellIndex(2, 2)] === true);"
            },
            {
                "name": "Flagging it again takes the flag off",
                "code": "const state = createGame();\ntoggleFlag(state, 2, 2);\ntoggleFlag(state, 2, 2);\nassert(state.flagged[cellIndex(2, 2)] === false, 'the same action should undo itself');"
            },
            {
                "name": "An open square cannot be flagged",
                "code": "const state = createGame();\nrevealCell(state, 4, 4);\nassert(toggleFlag(state, 4, 4) === false);"
            },
            {
                "name": "A square off the board cannot be flagged",
                "code": "const state = createGame();\nassert(toggleFlag(state, -1, 4) === false);\nassert(toggleFlag(state, GRID_SIZE, 4) === false);"
            },
            {
                "name": "The mines-left number goes down",
                "code": "const state = createGame();\nassert(minesLeft(state) === MINE_COUNT);\ntoggleFlag(state, 2, 2);\nassert(minesLeft(state) === MINE_COUNT - 1, 'gave ' + minesLeft(state));"
            },
            {
                "name": "A finished game cannot be flagged",
                "code": "const state = createGame();\nstate.isOver = true;\nassert(toggleFlag(state, 2, 2) === false);"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Dig a bit, then flag the squares you think are mines."
        }
    },
    {
        "id": "check_win",
        "fnName": "checkWin",
        "title": "Have you won?",
        "adds": "The game can be finished.",
        "intro": "<p>The winning condition catches a lot of people out, so read it carefully: <strong>you win by uncovering every square that is not a mine</strong>.</p><p>Flags have nothing to do with it. You can win having planted no flags at all, and flagging all ten mines is not a win on its own — the safe squares still have to be open.</p>",
        "spec": {
            "input": "state",
            "output": "True if the player has won",
            "algorithm": [
                "Count the uncovered squares.",
                "If that equals CELL_COUNT - MINE_COUNT, the game is won and over.",
                "Otherwise return False."
            ]
        },
        "starter": "function checkWin(state) {\n    // every safe square open — flags do not matter\n}\n",
        "answer": "function checkWin(state) {\n    if (revealedCount(state) === CELL_COUNT - MINE_COUNT) {\n        state.isWon = true;\n        state.isOver = true;\n        return true;\n    }\n    return false;\n}\n",
        "hints": [
            "revealedCount(state) is written for you.",
            "There are CELL_COUNT squares and MINE_COUNT of them are mines.",
            "Set isWon AND isOver — a won game has also finished."
        ],
        "tests": [
            {
                "name": "A new game is not won",
                "code": "const state = createGame();\nassert(checkWin(state) === false);"
            },
            {
                "name": "A half-open board is not won",
                "code": "const state = createGame();\nrevealCell(state, 4, 4);\nassert(state.isWon === false || revealedCount(state) === CELL_COUNT - MINE_COUNT);"
            },
            {
                "name": "Every safe square open is a win",
                "code": "const state = createGame();\nplaceMines(state, 4, 4);\nfor (let i = 0; i < CELL_COUNT; i++) {\n    if (!state.mines[i]) { state.revealed[i] = true; }\n}\nassert(checkWin(state) === true);\nassert(state.isWon === true && state.isOver === true);"
            },
            {
                "name": "One square short is not a win",
                "code": "const state = createGame();\nplaceMines(state, 4, 4);\nlet left = 1;\nfor (let i = 0; i < CELL_COUNT; i++) {\n    if (!state.mines[i]) {\n        if (left > 0) { left = left - 1; } else { state.revealed[i] = true; }\n    }\n}\nassert(checkWin(state) === false, 'there is still one square to open');"
            },
            {
                "name": "Flags alone do not win",
                "code": "const state = createGame();\nplaceMines(state, 4, 4);\nfor (let i = 0; i < CELL_COUNT; i++) {\n    if (state.mines[i]) { state.flagged[i] = true; }\n}\nassert(checkWin(state) === false, 'flagging every mine is not a win — the safe squares still have to be opened');"
            },
            {
                "name": "A real game can be won",
                "code": "const state = createGame();\nrevealCell(state, 4, 4);\nfor (let row = 0; row < GRID_SIZE; row++) {\n    for (let column = 0; column < GRID_SIZE; column++) {\n        if (!state.mines[cellIndex(column, row)]) { revealCell(state, column, row); }\n    }\n}\nassert(state.isWon === true);"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Clear the whole board and see the win message."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function: move the cursor, dig, flag.</p><p>The mouse works too — a left click digs and a right click flags — but a keyboard player deserves the same game.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "The arrows or WASD move the cursor.",
                "Space or Enter → 'dig'. F → 'flag'.",
                "P → 'pause'. R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // move, dig, flag, pause, restart\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'dig'; }\n    if (k === 'f') { return 'flag'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "The arrows are 'ArrowUp', 'ArrowDown', 'ArrowLeft' and 'ArrowRight'.",
            "Both the space bar and Enter should dig — players reach for either.",
            "Eight ifs and a return null;"
        ],
        "tests": [
            {
                "name": "The arrows move the cursor",
                "code": "assert(actionForKey('ArrowUp') === 'up');\nassert(actionForKey('ArrowDown') === 'down');\nassert(actionForKey('ArrowLeft') === 'left');\nassert(actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "WASD moves it too",
                "code": "assert(actionForKey('w') === 'up');\nassert(actionForKey('s') === 'down');\nassert(actionForKey('a') === 'left');\nassert(actionForKey('d') === 'right');"
            },
            {
                "name": "Space digs",
                "code": "assert(actionForKey(' ') === 'dig');"
            },
            {
                "name": "Enter digs too",
                "code": "assert(actionForKey('Enter') === 'dig');"
            },
            {
                "name": "F plants a flag",
                "code": "assert(actionForKey('f') === 'flag');"
            },
            {
                "name": "Capital letters work",
                "code": "assert(actionForKey('F') === 'flag');\nassert(actionForKey('R') === 'restart');"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert(actionForKey('z') === null);\nassert(actionForKey('Tab') === null);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then play with the arrows, SPACE to dig and F to flag."
        }
    }
];
