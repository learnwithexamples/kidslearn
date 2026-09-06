/* ============================================================
   twenty48-steps.js - the 7 steps of "Build 2048"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const TWENTY48_STEPS = [
    {
        "id": "slide_row",
        "fnName": "slideRow",
        "title": "Push a row along",
        "adds": "Tiles stop floating in mid-air.",
        "intro": "<p>Everything in 2048 happens one row at a time, and a move is really two separate jobs. This is the first: <strong>close up the gaps</strong>.</p><p>Nothing joins together here. <code>[2, 0, 2, 4]</code> becomes <code>[2, 2, 4, 0]</code> — the tiles simply shuffle up against the left-hand wall, keeping their order.</p>",
        "spec": {
            "input": "row — a list of four numbers, 0 meaning empty",
            "output": "a NEW list, the same numbers, all the gaps at the right",
            "algorithm": [
                "Make an empty list.",
                "Walk the row and copy across everything that is not 0.",
                "Add 0s to the end until the list is SIZE long.",
                "Return it."
            ]
        },
        "starter": "function slideRow(row) {\n    // close up the gaps — nothing joins yet\n}\n",
        "answer": "function slideRow(row) {\n    const packed = [];\n    for (let i = 0; i < row.length; i++) {\n        if (row[i] !== 0) {\n            packed.push(row[i]);\n        }\n    }\n    while (packed.length < SIZE) {\n        packed.push(0);\n    }\n    return packed;\n}\n",
        "hints": [
            "Collect the non-zero numbers first, in the order you meet them.",
            "Then pad the answer out to four with 0s.",
            "row.filter(v => v !== 0) does the first half in one line."
        ],
        "tests": [
            {
                "name": "Gaps close up",
                "code": "assert(slideRow([2, 0, 2, 4]).join(',') === '2,2,4,0', 'gave ' + slideRow([2, 0, 2, 4]));"
            },
            {
                "name": "A row already packed does not change",
                "code": "assert(slideRow([2, 4, 8, 16]).join(',') === '2,4,8,16');"
            },
            {
                "name": "An empty row stays empty",
                "code": "assert(slideRow([0, 0, 0, 0]).join(',') === '0,0,0,0');"
            },
            {
                "name": "A lonely tile goes all the way",
                "code": "assert(slideRow([0, 0, 0, 2]).join(',') === '2,0,0,0', 'gave ' + slideRow([0, 0, 0, 2]));"
            },
            {
                "name": "The order is kept",
                "code": "assert(slideRow([0, 8, 0, 2]).join(',') === '8,2,0,0', 'the 8 was in front, so it stays in front');"
            },
            {
                "name": "Nothing joins up yet",
                "code": "assert(slideRow([2, 2, 0, 0]).join(',') === '2,2,0,0', 'sliding does not merge — that is the next step');"
            },
            {
                "name": "The answer is always four long",
                "code": "assert(slideRow([2, 0, 0, 0]).length === SIZE);"
            },
            {
                "name": "The row you were given is left alone",
                "code": "const before = [2, 0, 2, 4];\nslideRow(before);\nassert(before.join(',') === '2,0,2,4', 'build a new row instead of editing this one');"
            }
        ],
        "demo": {
            "kind": "row",
            "caption": "Pick a row and watch what sliding does to it — the middle line is the answer."
        }
    },
    {
        "id": "merge_row",
        "fnName": "mergeRow",
        "title": "Join the twins",
        "adds": "Tiles combine, and you can score.",
        "intro": "<p>The second half of a move, and the heart of the game.</p><p>Walk along a row that has already been slid. If a number equals the one after it, replace the pair with a single tile worth double — and then <strong>step past both of them</strong>.</p><p>That last bit matters more than it looks. A row of four 2s must become two 4s, not one 8. Each tile may only join once per move, and skipping past both is how you enforce that in one line.</p>",
        "spec": {
            "input": "row — four numbers, already slid",
            "output": "the new row, and how many points it scored",
            "algorithm": [
                "Start an empty result and a score of 0.",
                "Walk along with a counter i.",
                "If row[i] is not 0 and equals row[i + 1]: add row[i] × 2 to the result, add that to the score, and move i on by TWO.",
                "Otherwise add row[i] and move i on by ONE.",
                "Pad the result with 0s."
            ]
        },
        "starter": "function mergeRow(row) {\n    // join equal neighbours — each tile joins at most once\n    return { row: row, gained: 0 };\n}\n",
        "answer": "function mergeRow(row) {\n    const result = [];\n    let gained = 0;\n    let i = 0;\n\n    while (i < row.length) {\n        if (row[i] !== 0 && row[i] === row[i + 1]) {\n            const joined = row[i] * 2;\n            result.push(joined);\n            gained = gained + joined;\n            i = i + 2;\n        } else {\n            result.push(row[i]);\n            i = i + 1;\n        }\n    }\n\n    while (result.length < SIZE) {\n        result.push(0);\n    }\n    return { row: result, gained: gained };\n}\n",
        "hints": [
            "A while loop is easier here than a for loop, because i jumps by 1 or 2.",
            "row[i + 1] is undefined at the end of the row — that is fine, it will not equal anything.",
            "i = i + 2 after a join is what stops one tile joining twice."
        ],
        "tests": [
            {
                "name": "Two the same become one",
                "code": "const out = mergeRow([2, 2, 0, 0]);\nassert(out.row.join(',') === '4,0,0,0', 'gave ' + out.row);"
            },
            {
                "name": "Joining scores the new tile's value",
                "code": "assert(mergeRow([2, 2, 0, 0]).gained === 4, 'gave ' + mergeRow([2, 2, 0, 0]).gained);"
            },
            {
                "name": "Four the same become TWO tiles, not one",
                "code": "const out = mergeRow([2, 2, 2, 2]);\nassert(out.row.join(',') === '4,4,0,0', 'gave ' + out.row + ' — each tile may only join once');\nassert(out.gained === 8);"
            },
            {
                "name": "Three the same join only the first two",
                "code": "const out = mergeRow([4, 4, 4, 0]);\nassert(out.row.join(',') === '8,4,0,0', 'gave ' + out.row);"
            },
            {
                "name": "Different numbers do not join",
                "code": "assert(mergeRow([2, 4, 8, 16]).row.join(',') === '2,4,8,16');\nassert(mergeRow([2, 4, 8, 16]).gained === 0);"
            },
            {
                "name": "Zeros never join with each other",
                "code": "assert(mergeRow([0, 0, 0, 0]).row.join(',') === '0,0,0,0', 'two empty squares must not become a 0-tile');"
            },
            {
                "name": "A mixed row works",
                "code": "const out = mergeRow([2, 2, 4, 0]);\nassert(out.row.join(',') === '4,4,0,0', 'gave ' + out.row);\nassert(out.gained === 4);"
            },
            {
                "name": "The answer is always four long",
                "code": "assert(mergeRow([2, 2, 2, 2]).row.length === SIZE);"
            }
        ],
        "demo": {
            "kind": "row",
            "caption": "The bottom line is the merged row. Try 2,2,2,2 — it must become two 4s."
        },
        "warning": "After a join, step past BOTH tiles. Move on by one instead and four 2s turn into a single 8, which is wrong and lets a player score twice as fast."
    },
    {
        "id": "empty_cells",
        "fnName": "emptyCells",
        "title": "Where is there room?",
        "adds": "The board knows where a tile can appear.",
        "intro": "<p>A short one, but three later functions depend on it: dropping a new tile, working out whether the board is full, and deciding whether the game is over.</p>",
        "spec": {
            "input": "board",
            "output": "a list of the places still holding 0",
            "algorithm": [
                "Make an empty list.",
                "Walk the whole board.",
                "Whenever a square is 0, add its position to the list."
            ]
        },
        "starter": "function emptyCells(board) {\n    // the positions holding nothing\n}\n",
        "answer": "function emptyCells(board) {\n    const found = [];\n    for (let i = 0; i < board.length; i++) {\n        if (board[i] === 0) {\n            found.push(i);\n        }\n    }\n    return found;\n}\n",
        "hints": [
            "Collect the POSITIONS (0 to 15), not the values — they are all 0 anyway.",
            "One loop and one if.",
            "found.push(i);"
        ],
        "tests": [
            {
                "name": "A new board has fourteen free squares",
                "code": "const board = emptyBoard();\naddTile(board);\naddTile(board);\nassert(emptyCells(board).length === CELL_COUNT - 2, 'gave ' + emptyCells(board).length);"
            },
            {
                "name": "An empty board has sixteen",
                "code": "assert(emptyCells(emptyBoard()).length === CELL_COUNT);"
            },
            {
                "name": "A full board has none",
                "code": "const board = emptyBoard().map(function () { return 2; });\nassert(emptyCells(board).length === 0);"
            },
            {
                "name": "It gives back positions, not values",
                "code": "const board = emptyBoard();\nboard[0] = 2;\nassert(emptyCells(board)[0] === 1, 'the first free square is at position 1');"
            },
            {
                "name": "Every position it names really is empty",
                "code": "const board = emptyBoard();\nboard[3] = 4;\nboard[9] = 8;\nemptyCells(board).forEach(function (i) {\n    assert(board[i] === 0, 'position ' + i + ' is not empty');\n});"
            }
        ],
        "demo": {
            "kind": "board",
            "caption": "Slide the practice board about and watch the free-square count."
        }
    },
    {
        "id": "rotate_board",
        "fnName": "rotateBoard",
        "title": "Turn the board",
        "adds": "One move becomes four.",
        "intro": "<p>Here is the trick that makes this whole game short.</p><p>You have written how to slide LEFT. Writing three more copies for right, up and down would mean three more places for bugs to hide. Instead: <strong>turn the board</strong> until the way you want to go is pointing left, slide left, then turn it back.</p><p>The square that ends up at (column, row) after a clockwise quarter turn is the one that started at (row, SIZE - 1 - column). Draw a 4×4 grid on paper and turn it once — you will see it.</p>",
        "spec": {
            "input": "board",
            "output": "a NEW board, turned a quarter turn clockwise",
            "algorithm": [
                "Make a new empty board.",
                "For every column and row of the NEW board, fetch the square from (row, SIZE - 1 - column) of the old one.",
                "Return the new board."
            ]
        },
        "starter": "function rotateBoard(board) {\n    const turned = emptyBoard();\n    // (column, row) comes from (row, SIZE - 1 - column)\n    return turned;\n}\n",
        "answer": "function rotateBoard(board) {\n    const turned = emptyBoard();\n    for (let row = 0; row < SIZE; row++) {\n        for (let column = 0; column < SIZE; column++) {\n            turned[cellIndex(column, row)] = board[cellIndex(row, SIZE - 1 - column)];\n        }\n    }\n    return turned;\n}\n",
        "hints": [
            "Two loops over the NEW board, fetching from the old one.",
            "cellIndex(column, row) turns a pair into a position.",
            "turned[cellIndex(column, row)] = board[cellIndex(row, SIZE - 1 - column)];"
        ],
        "tests": [
            {
                "name": "The top-left corner goes to the top-right",
                "code": "const board = emptyBoard();\nboard[cellIndex(0, 0)] = 2;\nconst turned = rotateBoard(board);\nassert(turned[cellIndex(SIZE - 1, 0)] === 2, 'a clockwise turn sends the top-left corner to the top-right');"
            },
            {
                "name": "The top-right goes to the bottom-right",
                "code": "const board = emptyBoard();\nboard[cellIndex(SIZE - 1, 0)] = 2;\nconst turned = rotateBoard(board);\nassert(turned[cellIndex(SIZE - 1, SIZE - 1)] === 2);"
            },
            {
                "name": "Four turns is a full circle",
                "code": "let board = emptyBoard();\nfor (let i = 0; i < CELL_COUNT; i++) { board[i] = i; }\nconst original = board.join(',');\nfor (let i = 0; i < 4; i++) { board = rotateBoard(board); }\nassert(board.join(',') === original, 'four quarter turns must bring it back exactly');"
            },
            {
                "name": "No tile is lost or invented",
                "code": "let board = emptyBoard();\nfor (let i = 0; i < CELL_COUNT; i++) { board[i] = i; }\nconst turned = rotateBoard(board);\nassert(turned.slice().sort().join(',') === board.slice().sort().join(','), 'the same sixteen numbers must come out');"
            },
            {
                "name": "A top row becomes a right-hand column",
                "code": "const board = emptyBoard();\nsetRow(board, 0, [2, 4, 8, 16]);\nconst turned = rotateBoard(board);\nfor (let row = 0; row < SIZE; row++) {\n    assert(turned[cellIndex(SIZE - 1, row)] === [2, 4, 8, 16][row], 'the top row should stand up on the right');\n}"
            },
            {
                "name": "The board you were given is left alone",
                "code": "const board = emptyBoard();\nboard[0] = 2;\nrotateBoard(board);\nassert(board[0] === 2, 'build a new board instead of editing this one');"
            }
        ],
        "demo": {
            "kind": "board",
            "caption": "Press Turn a few times. Four turns bring the board right back."
        }
    },
    {
        "id": "move_board",
        "fnName": "moveBoard",
        "title": "All four directions",
        "adds": "The board slides any way you like.",
        "intro": "<p>Now cash in the trick. Turn, slide left, turn back.</p><p>How many turns? Sliding left needs none. Down needs one. Right needs two. Up needs three. Then turn the rest of the way — <code>SIZE - turns</code> more — to bring the board back the right way up.</p>",
        "spec": {
            "input": "board, direction — 'left', 'right', 'up' or 'down'",
            "output": "the new board, and the points scored",
            "algorithm": [
                "Ask turns-for-direction how many quarter turns you need.",
                "Rotate the board that many times.",
                "Slide it left with move-left, keeping the points.",
                "Rotate it (SIZE - turns) more times to put it back.",
                "Return the board and the points."
            ]
        },
        "starter": "function moveBoard(board, direction) {\n    // turn, slide left, turn back\n    return { board: board, gained: 0 };\n}\n",
        "answer": "function moveBoard(board, direction) {\n    const turns = turnsForDirection(direction);\n\n    let work = board;\n    for (let i = 0; i < turns; i++) {\n        work = rotateBoard(work);\n    }\n\n    const moved = moveLeft(work);\n    work = moved.board;\n\n    for (let i = 0; i < (SIZE - turns) % SIZE; i++) {\n        work = rotateBoard(work);\n    }\n    return { board: work, gained: moved.gained };\n}\n",
        "hints": [
            "turnsForDirection and moveLeft are both written for you.",
            "The turns before and after must add up to four — a full circle.",
            "(SIZE - turns) % SIZE handles the left case, where turns is 0."
        ],
        "tests": [
            {
                "name": "Sliding left packs tiles to the left",
                "code": "const board = emptyBoard();\nboard[cellIndex(2, 1)] = 2;\nconst out = moveBoard(board, 'left');\nassert(out.board[cellIndex(0, 1)] === 2, 'the tile should be at the left of its row');"
            },
            {
                "name": "Sliding right packs them to the right",
                "code": "const board = emptyBoard();\nboard[cellIndex(1, 1)] = 2;\nconst out = moveBoard(board, 'right');\nassert(out.board[cellIndex(SIZE - 1, 1)] === 2);"
            },
            {
                "name": "Sliding up packs them to the top",
                "code": "const board = emptyBoard();\nboard[cellIndex(1, 2)] = 2;\nconst out = moveBoard(board, 'up');\nassert(out.board[cellIndex(1, 0)] === 2, 'the tile should be at the top of its column');"
            },
            {
                "name": "Sliding down packs them to the bottom",
                "code": "const board = emptyBoard();\nboard[cellIndex(1, 1)] = 2;\nconst out = moveBoard(board, 'down');\nassert(out.board[cellIndex(1, SIZE - 1)] === 2);"
            },
            {
                "name": "Tiles still join in every direction",
                "code": "['left', 'right', 'up', 'down'].forEach(function (direction) {\n    const board = emptyBoard();\n    setRow(board, 0, [2, 2, 0, 0]);\n    setRow(board, 1, [2, 2, 0, 0]);\n    const out = moveBoard(board, direction);\n    assert(out.gained > 0, 'nothing joined when sliding ' + direction);\n});"
            },
            {
                "name": "A board with nothing to do does not change",
                "code": "const board = emptyBoard();\nsetRow(board, 0, [2, 4, 8, 16]);\nsetRow(board, 1, [4, 8, 16, 32]);\nsetRow(board, 2, [2, 4, 8, 16]);\nsetRow(board, 3, [4, 8, 16, 32]);\nconst out = moveBoard(board, 'left');\nassert(out.board.join(',') === board.join(','), 'every row is already packed and nothing can join');"
            },
            {
                "name": "The board comes back the right way up",
                "code": "const board = emptyBoard();\nboard[cellIndex(0, 0)] = 2;\nboard[cellIndex(1, 0)] = 4;\nconst out = moveBoard(board, 'left');\nassert(out.board[cellIndex(0, 0)] === 2 && out.board[cellIndex(1, 0)] === 4, 'the turns before and after must add up to a full circle');"
            }
        ],
        "demo": {
            "kind": "board",
            "caption": "Slide the practice board every way. One function is doing all four."
        }
    },
    {
        "id": "has_moves",
        "fnName": "hasMoves",
        "title": "Is it over?",
        "adds": "The game knows when to stop.",
        "intro": "<p>A full board is <em>not</em> the same as a finished game. If two neighbours hold the same number they can still join, and that join makes room again.</p><p>So there are two questions: is there an empty square, and is there a pair of equal neighbours? Only when the answer to both is no is the game really over.</p>",
        "spec": {
            "input": "board",
            "output": "True if the player can still move",
            "algorithm": [
                "If there is any empty square, return True straight away.",
                "Otherwise look at every square and compare it with the one to its right and the one below.",
                "If any pair matches, return True.",
                "If you get all the way through, return False."
            ]
        },
        "starter": "function hasMoves(board) {\n    // an empty square, or two equal neighbours\n}\n",
        "answer": "function hasMoves(board) {\n    if (emptyCells(board).length > 0) {\n        return true;\n    }\n    for (let row = 0; row < SIZE; row++) {\n        for (let column = 0; column < SIZE; column++) {\n            const value = board[cellIndex(column, row)];\n            if (column + 1 < SIZE && board[cellIndex(column + 1, row)] === value) {\n                return true;\n            }\n            if (row + 1 < SIZE && board[cellIndex(column, row + 1)] === value) {\n                return true;\n            }\n        }\n    }\n    return false;\n}\n",
        "hints": [
            "Checking for an empty square first saves all the rest of the work.",
            "Only look right and down — every pair gets checked once that way.",
            "Guard the edges with column + 1 < SIZE and row + 1 < SIZE."
        ],
        "tests": [
            {
                "name": "A new game has moves",
                "code": "assert(hasMoves(createGame().board) === true);"
            },
            {
                "name": "An empty board has moves",
                "code": "assert(hasMoves(emptyBoard()) === true);"
            },
            {
                "name": "A full board with a matching pair still has moves",
                "code": "const board = [2, 4, 2, 4,\n               4, 2, 4, 2,\n               2, 4, 2, 4,\n               4, 2, 2, 8];\nassert(hasMoves(board) === true, 'the two 2s at the bottom can still join');"
            },
            {
                "name": "A properly stuck board has none",
                "code": "const board = [2, 4, 2, 4,\n               4, 2, 4, 2,\n               2, 4, 2, 4,\n               4, 2, 4, 2];\nassert(hasMoves(board) === false, 'no gaps and no two neighbours the same');"
            },
            {
                "name": "A pair side by side counts",
                "code": "const board = [2, 2, 2, 4,\n               4, 8, 4, 2,\n               2, 4, 2, 4,\n               4, 2, 4, 2];\nassert(hasMoves(board) === true);"
            },
            {
                "name": "A pair one above the other counts too",
                "code": "const board = [2, 4, 8, 4,\n               2, 8, 4, 2,\n               4, 4, 2, 4,\n               8, 2, 4, 2];\nassert(hasMoves(board) === true, 'the two 2s in the left column can join');"
            },
            {
                "name": "A real game ends only when it is truly stuck",
                "code": "const state = createGame();\nlet guard = 0;\nwhile (!state.isOver && guard < 3000) {\n    ['left', 'up', 'right', 'down'].forEach(function (d) { makeMove(state, d); });\n    guard = guard + 1;\n}\nassert(state.isOver === false || !hasMoves(state.board), 'the game may only end when nothing can move');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play a real game. It only ends when nothing on the board can move."
        },
        "warning": "A full board is not a finished game. Forget the neighbour check and you will be told 'no moves left' while a perfectly good join is sitting right there."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>Four keys, four directions, and the game is yours.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "The arrows or WASD give the four directions.",
                "P → 'pause'. R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // four directions, pause, restart\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "The action names must match the ones moveBoard expects exactly.",
            "toLowerCase() up front means capitals work too.",
            "Six ifs and a return null;"
        ],
        "tests": [
            {
                "name": "The arrows slide the board",
                "code": "assert(actionForKey('ArrowUp') === 'up');\nassert(actionForKey('ArrowDown') === 'down');\nassert(actionForKey('ArrowLeft') === 'left');\nassert(actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "WASD works too",
                "code": "assert(actionForKey('w') === 'up');\nassert(actionForKey('s') === 'down');\nassert(actionForKey('a') === 'left');\nassert(actionForKey('d') === 'right');"
            },
            {
                "name": "Capital letters work",
                "code": "assert(actionForKey('W') === 'up');\nassert(actionForKey('R') === 'restart');"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert(actionForKey('p') === 'pause');\nassert(actionForKey('r') === 'restart');"
            },
            {
                "name": "The names match what the game expects",
                "code": "['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(function (key) {\n    const state = createGame();\n    makeMove(state, actionForKey(key));\n});"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert(actionForKey('z') === null);\nassert(actionForKey('Enter') === null);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page and play with the arrow keys. How far can you get?"
        }
    }
];
