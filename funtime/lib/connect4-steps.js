/* ============================================================
   connect4-steps.js - the 7 steps of "Build Connect Four"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const CONNECT4_STEPS = [
    {
        "id": "cell_index",
        "fnName": "cellIndex",
        "title": "Number the holes",
        "adds": "The board has places for counters.",
        "intro": "<p>Seven columns and six rows — 42 holes — stored as one flat <strong>list</strong>. Row 0 is the TOP, so row 5 is the bottom where counters land.</p>",
        "spec": {
            "input": "column (0 to 6), row (0 to 5)",
            "output": "the position of that hole in the flat list of 42",
            "algorithm": [
                "Skip a whole row of holes for every row above: row * COLUMNS.",
                "Add the column.",
                "Return the answer."
            ]
        },
        "starter": "function cellIndex(column, row) {\n    // skip whole rows, then add the column\n}\n",
        "answer": "function cellIndex(column, row) {\n    return row * COLUMNS + column;\n}\n",
        "hints": [
            "One line.",
            "A row is COLUMNS holes wide.",
            "return row * COLUMNS + column;"
        ],
        "tests": [
            {
                "name": "The top-left hole is 0",
                "code": "assert(cellIndex(0, 0) === 0, 'gave ' + cellIndex(0, 0));"
            },
            {
                "name": "The top-right hole is 6",
                "code": "assert(cellIndex(6, 0) === 6, 'gave ' + cellIndex(6, 0));"
            },
            {
                "name": "The bottom-left hole is 35",
                "code": "assert(cellIndex(0, 5) === 35, 'gave ' + cellIndex(0, 5));"
            },
            {
                "name": "The bottom-right hole is 41",
                "code": "assert(cellIndex(6, 5) === 41, 'gave ' + cellIndex(6, 5));"
            },
            {
                "name": "One row down adds COLUMNS",
                "code": "assert(cellIndex(2, 3) - cellIndex(2, 2) === COLUMNS);"
            },
            {
                "name": "All 42 holes get different numbers",
                "code": "const seen = {};\nfor (let r = 0; r < ROWS; r++) { for (let c = 0; c < COLUMNS; c++) { seen[cellIndex(c, r)] = true; } }\nassert(Object.keys(seen).length === 42, 'only ' + Object.keys(seen).length + ' different numbers');"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers all 42 holes."
        }
    },
    {
        "id": "drop_row",
        "fnName": "dropRow",
        "title": "Where does it land?",
        "adds": "Counters fall to the bottom.",
        "intro": "<p>This is what makes Connect Four different from noughts and crosses: you do not choose a square, you choose a <strong>column</strong>, and gravity does the rest.</p><p>So the game has to work out which row a counter would stop in — the lowest free one.</p>",
        "spec": {
            "input": "board - the 42 holes. column - which column.",
            "output": "the row the counter would land in, or -1 when the column is full",
            "algorithm": [
                "Start at the BOTTOM row (ROWS - 1) and walk upwards.",
                "The first empty hole you meet is where the counter stops — return that row.",
                "If you get all the way to the top without finding one, the column is full: return -1."
            ]
        },
        "starter": "function dropRow(board, column) {\n    // walk up from the bottom looking for the first empty hole\n}\n",
        "answer": "function dropRow(board, column) {\n    for (let row = ROWS - 1; row >= 0; row--) {\n        if (board[cellIndex(column, row)] === EMPTY) {\n            return row;\n        }\n    }\n    return -1;\n}\n",
        "hints": [
            "Count DOWNWARDS in the loop: for (let row = ROWS - 1; row >= 0; row--)",
            "Check board[cellIndex(column, row)] === EMPTY.",
            "return -1; goes after the loop, for a full column."
        ],
        "tests": [
            {
                "name": "On an empty board a counter falls to the bottom row",
                "code": "const board = new Array(CELL_COUNT).fill(EMPTY);\nassert(dropRow(board, 3) === ROWS - 1, 'gave ' + dropRow(board, 3) + ', expected ' + (ROWS - 1));"
            },
            {
                "name": "It lands on top of a counter already there",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\nboard[cellIndex(3, ROWS - 1)] = 'R';\nassert(dropRow(board, 3) === ROWS - 2, 'gave ' + dropRow(board, 3));"
            },
            {
                "name": "A full column gives -1",
                "code": "const board = new Array(CELL_COUNT).fill(EMPTY);\nfor (let row = 0; row < ROWS; row++) { board[cellIndex(2, row)] = 'Y'; }\nassert(dropRow(board, 2) === -1, 'gave ' + dropRow(board, 2));"
            },
            {
                "name": "Other columns are not affected",
                "code": "const board = new Array(CELL_COUNT).fill(EMPTY);\nfor (let row = 0; row < ROWS; row++) { board[cellIndex(2, row)] = 'Y'; }\nassert(dropRow(board, 1) === ROWS - 1, 'column 1 is still empty');"
            },
            {
                "name": "A column with one gap at the top",
                "code": "const board = new Array(CELL_COUNT).fill(EMPTY);\nfor (let row = 1; row < ROWS; row++) { board[cellIndex(0, row)] = 'R'; }\nassert(dropRow(board, 0) === 0, 'only the top hole is free — gave ' + dropRow(board, 0));"
            }
        ],
        "demo": {
            "kind": "drop",
            "caption": "Aim at a column and watch your function say which row a counter would reach."
        }
    },
    {
        "id": "drop_piece",
        "fnName": "dropPiece",
        "title": "Drop a counter",
        "adds": "The board fills up.",
        "intro": "<p>Now put the counter where it lands. As always, build a <strong>new</strong> board — the computer will want to try drops without really making them.</p>",
        "spec": {
            "input": "board, column, mark - 'R' for you or 'Y' for the computer",
            "output": "a NEW board with the counter added (unchanged if the column is full)",
            "algorithm": [
                "Ask drop-row where the counter would land.",
                "If that is -1 the column is full: return a copy, unchanged.",
                "Otherwise copy the board, put the mark in that hole, and return the copy."
            ]
        },
        "starter": "function dropPiece(board, column, mark) {\n    // find the row, then put the mark there on a COPY\n}\n",
        "answer": "function dropPiece(board, column, mark) {\n    const row = dropRow(board, column);\n    if (row === -1) {\n        return board.slice();\n    }\n    const next = board.slice();\n    next[cellIndex(column, row)] = mark;\n    return next;\n}\n",
        "hints": [
            "Reuse dropRow — you already wrote it.",
            "board.slice() makes the copy.",
            "next[cellIndex(column, row)] = mark;"
        ],
        "tests": [
            {
                "name": "The counter lands at the bottom",
                "code": "const board = dropPiece(new Array(CELL_COUNT).fill(EMPTY), 3, 'R');\nassert(board[cellIndex(3, ROWS - 1)] === 'R', 'the bottom hole of column 3 should hold R');"
            },
            {
                "name": "Two drops stack up",
                "code": "let board = dropPiece(new Array(CELL_COUNT).fill(EMPTY), 3, 'R');\nboard = dropPiece(board, 3, 'Y');\nassert(board[cellIndex(3, ROWS - 2)] === 'Y', 'the second counter sits on the first');"
            },
            {
                "name": "Only one hole changes",
                "code": "const board = dropPiece(new Array(CELL_COUNT).fill(EMPTY), 3, 'R');\nassert(board.filter(m => m !== EMPTY).length === 1);"
            },
            {
                "name": "A full column leaves the board alone",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\nfor (let i = 0; i < ROWS; i++) { board = dropPiece(board, 0, 'R'); }\nconst after = dropPiece(board, 0, 'Y');\nassert(after.filter(m => m === 'Y').length === 0, 'nothing should fit in a full column');"
            },
            {
                "name": "The board you were given is not changed",
                "code": "const before = new Array(CELL_COUNT).fill(EMPTY);\ndropPiece(before, 3, 'R');\nassert(before.every(m => m === EMPTY), 'you changed the board you were given');"
            }
        ],
        "demo": {
            "kind": "drop",
            "caption": "Press Fill it a few times and watch the column stack up."
        }
    },
    {
        "id": "count_in_direction",
        "fnName": "countInDirection",
        "title": "Count along a line",
        "adds": "The game can look in any direction.",
        "intro": "<p>To find four in a row you need to be able to count counters going <em>any</em> way: right, down, and both diagonals.</p><p>This function starts at a hole and walks in one direction, counting how many of your counters it passes — <strong>not</strong> counting the starting hole itself.</p>",
        "spec": {
            "input": "board, column, row - where to start. dx, dy - the step. mark - whose counters to count.",
            "output": "how many of that mark are in a row in that direction",
            "algorithm": [
                "Start the count at 0, and take one step from the starting hole.",
                "While the hole is on the board AND holds the mark: add one and step again.",
                "Return the count."
            ]
        },
        "starter": "function countInDirection(board, column, row, dx, dy, mark) {\n    let found = 0;\n    // step again and again while the mark keeps going\n    return found;\n}\n",
        "answer": "function countInDirection(board, column, row, dx, dy, mark) {\n    let found = 0;\n    let c = column + dx;\n    let r = row + dy;\n    while (isInsideBoard(c, r) && board[cellIndex(c, r)] === mark) {\n        found = found + 1;\n        c = c + dx;\n        r = r + dy;\n    }\n    return found;\n}\n",
        "hints": [
            "Take the first step BEFORE the loop, so the starting hole is not counted.",
            "The while condition has two parts: still on the board, and still the same mark.",
            "Do not forget to step again inside the loop, or it will never end."
        ],
        "tests": [
            {
                "name": "Three counters to the right",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[1,2,3].forEach(c => { board[cellIndex(c, 5)] = 'R'; });\nassert(countInDirection(board, 0, 5, 1, 0, 'R') === 3, 'gave ' + countInDirection(board, 0, 5, 1, 0, 'R'));"
            },
            {
                "name": "The starting hole is not counted",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\nboard[cellIndex(0, 5)] = 'R';\nassert(countInDirection(board, 0, 5, 1, 0, 'R') === 0, 'only the starting hole holds a counter, and it does not count');"
            },
            {
                "name": "It stops at a different mark",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\nboard[cellIndex(1, 5)] = 'R';\nboard[cellIndex(2, 5)] = 'Y';\nboard[cellIndex(3, 5)] = 'R';\nassert(countInDirection(board, 0, 5, 1, 0, 'R') === 1, 'the Y blocks the run — gave ' + countInDirection(board, 0, 5, 1, 0, 'R'));"
            },
            {
                "name": "It stops at the edge of the board",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\nfor (let c = 0; c < COLUMNS; c++) { board[cellIndex(c, 5)] = 'R'; }\nassert(countInDirection(board, 0, 5, 1, 0, 'R') === COLUMNS - 1, 'gave ' + countInDirection(board, 0, 5, 1, 0, 'R'));"
            },
            {
                "name": "It counts upwards too",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[3,4,5].forEach(r => { board[cellIndex(2, r)] = 'Y'; });\nassert(countInDirection(board, 2, 2, 0, 1, 'Y') === 3, 'gave ' + countInDirection(board, 2, 2, 0, 1, 'Y'));"
            },
            {
                "name": "It counts along a diagonal",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[[1,4],[2,3],[3,2]].forEach(p => { board[cellIndex(p[0], p[1])] = 'R'; });\nassert(countInDirection(board, 0, 5, 1, -1, 'R') === 3, 'gave ' + countInDirection(board, 0, 5, 1, -1, 'R'));"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play a few counters — this function is what the win check is made of."
        },
        "warning": "Step once before the loop starts. If you count the hole you are standing on, every line will come out one too long."
    },
    {
        "id": "is_win_at",
        "fnName": "isWinAt",
        "title": "Four in a row!",
        "adds": "The game can be won.",
        "intro": "<p>Here is the neat bit. You do not have to search the whole board — only the counter that was <em>just dropped</em> can have made a new line.</p><p>So from that counter, look both ways along each of the four directions and add them up, plus one for the counter itself.</p><pre class=\"mini-code\">   . . R R R . .        going right: 2 counters\n         ^             going left:  0 counters\n     just dropped      2 + 0 + 1 = 3 — not yet!</pre>",
        "spec": {
            "input": "board, column, row - the counter just dropped. mark - whose it is.",
            "output": "True if it is part of a line of WIN_LENGTH or more",
            "algorithm": [
                "For each direction in DIRECTIONS (across, down, and both diagonals):",
                "    count one way with count-in-direction,",
                "    count the OPPOSITE way (use -dx and -dy),",
                "    add them together and add 1 for the counter itself.",
                "If any direction reaches WIN_LENGTH, it is a win."
            ]
        },
        "starter": "function isWinAt(board, column, row, mark) {\n    // look both ways along each of the four directions\n}\n",
        "answer": "function isWinAt(board, column, row, mark) {\n    for (let i = 0; i < DIRECTIONS.length; i++) {\n        const dx = DIRECTIONS[i][0];\n        const dy = DIRECTIONS[i][1];\n        const total = 1 +\n            countInDirection(board, column, row, dx, dy, mark) +\n            countInDirection(board, column, row, -dx, -dy, mark);\n        if (total >= WIN_LENGTH) {\n            return true;\n        }\n    }\n    return false;\n}\n",
        "hints": [
            "DIRECTIONS holds the four [dx, dy] pairs you need.",
            "The opposite direction is -dx and -dy — that is why one loop covers both ways.",
            "Do not forget the + 1 for the counter you just dropped."
        ],
        "tests": [
            {
                "name": "Four across is a win",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[0,1,2,3].forEach(c => { board[cellIndex(c, 5)] = 'R'; });\nassert(isWinAt(board, 3, 5, 'R') === true, 'four along the bottom is a win');"
            },
            {
                "name": "Three across is not",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[0,1,2].forEach(c => { board[cellIndex(c, 5)] = 'R'; });\nassert(isWinAt(board, 2, 5, 'R') === false, 'three is not four');"
            },
            {
                "name": "A counter in the MIDDLE of a line still wins",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[0,1,2,3].forEach(c => { board[cellIndex(c, 5)] = 'R'; });\nassert(isWinAt(board, 1, 5, 'R') === true, 'you must look BOTH ways, not just one');"
            },
            {
                "name": "Four going down is a win",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[2,3,4,5].forEach(r => { board[cellIndex(1, r)] = 'Y'; });\nassert(isWinAt(board, 1, 2, 'Y') === true);"
            },
            {
                "name": "Four on a diagonal is a win",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[[0,5],[1,4],[2,3],[3,2]].forEach(p => { board[cellIndex(p[0], p[1])] = 'R'; });\nassert(isWinAt(board, 3, 2, 'R') === true, 'diagonals count too');"
            },
            {
                "name": "The other player's counters do not help",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[0,1,2].forEach(c => { board[cellIndex(c, 5)] = 'R'; });\nboard[cellIndex(3, 5)] = 'Y';\nassert(isWinAt(board, 3, 5, 'Y') === false);"
            },
            {
                "name": "An empty board has no win",
                "code": "assert(isWinAt(new Array(CELL_COUNT).fill(EMPTY), 3, 5, 'R') === false);"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Try to get four in a row — your function decides when you have."
        }
    },
    {
        "id": "computer_column",
        "fnName": "computerColumn",
        "title": "Give the computer a brain",
        "adds": "You have an opponent!",
        "intro": "<p>Three rules make a surprisingly tough player:</p><p><strong>1.</strong> Win if you can. <strong>2.</strong> Block if you must. <strong>3.</strong> Otherwise play near the middle — the middle column belongs to more possible lines than any other.</p><p>There is one extra trap to avoid: never drop a counter that lets the player win by landing <em>on top of it</em>.</p>",
        "spec": {
            "input": "board - the 42 holes",
            "output": "the column to play, or -1 if the board is full",
            "algorithm": [
                "Get the playable columns. If there are none, return -1.",
                "1. If dropping there would win for the COMPUTER, play it.",
                "2. Otherwise if dropping there would win for the PLAYER, play it to block.",
                "3. Otherwise sort the columns by how close they are to the middle (column 3),",
                "   and take the first one that does NOT let the player win on top of it."
            ]
        },
        "starter": "function computerColumn(board) {\n    const open = playableColumns(board);\n    // win, block, then middle-ish and safe\n}\n",
        "answer": "function computerColumn(board) {\n    const open = playableColumns(board);\n    if (open.length === 0) {\n        return -1;\n    }\n\n    for (let i = 0; i < open.length; i++) {\n        const column = open[i];\n        const row = dropRow(board, column);\n        if (isWinAt(dropPiece(board, column, COMPUTER), column, row, COMPUTER)) {\n            return column;\n        }\n    }\n    for (let i = 0; i < open.length; i++) {\n        const column = open[i];\n        const row = dropRow(board, column);\n        if (isWinAt(dropPiece(board, column, PLAYER), column, row, PLAYER)) {\n            return column;\n        }\n    }\n\n    const middleFirst = open.slice().sort(function (a, b) {\n        return Math.abs(a - 3) - Math.abs(b - 3);\n    });\n    for (let i = 0; i < middleFirst.length; i++) {\n        const column = middleFirst[i];\n        const after = dropPiece(board, column, COMPUTER);\n        const replyRow = dropRow(after, column);\n        if (replyRow === -1 || !isWinAt(dropPiece(after, column, PLAYER), column, replyRow, PLAYER)) {\n            return column;\n        }\n    }\n    return middleFirst[0];\n}\n",
        "hints": [
            "To try a drop: isWinAt(dropPiece(board, column, MARK), column, dropRow(board, column), MARK)",
            "Remember to work out the row BEFORE the drop — that is where the counter lands.",
            "Sorting by Math.abs(column - 3) puts the middle column first."
        ],
        "tests": [
            {
                "name": "It takes a winning drop",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[0,1,2].forEach(c => { board[cellIndex(c, 5)] = 'Y'; });\nassert(computerColumn(board) === 3, 'Y can win in column 3 — gave ' + computerColumn(board));"
            },
            {
                "name": "It blocks the player",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[0,1,2].forEach(c => { board[cellIndex(c, 5)] = 'R'; });\nassert(computerColumn(board) === 3, 'R would win in column 3 — gave ' + computerColumn(board));"
            },
            {
                "name": "Winning beats blocking",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\n[0,1,2].forEach(c => { board[cellIndex(c, 5)] = 'Y'; });\n[0,1,2].forEach(c => { board[cellIndex(c, 4)] = 'R'; });\nassert(isWinAt(dropPiece(board, 3, COMPUTER), 3, 5, COMPUTER), 'setup check');\nassert(computerColumn(board) === 3, 'it should win rather than block');"
            },
            {
                "name": "On an empty board it plays near the middle",
                "code": "const move = computerColumn(new Array(CELL_COUNT).fill(EMPTY));\nassert(move === 3, 'the middle column is the strongest — gave ' + move);"
            },
            {
                "name": "It never picks a full column",
                "code": "let board = new Array(CELL_COUNT).fill(EMPTY);\nfor (let r = 0; r < ROWS; r++) { board[cellIndex(3, r)] = 'R'; }\nassert(computerColumn(board) !== 3, 'column 3 is full');"
            },
            {
                "name": "It says -1 when the board is full",
                "code": "assert(computerColumn(new Array(CELL_COUNT).fill('R')) === -1);"
            },
            {
                "name": "It always returns a playable column",
                "code": "for (let go = 0; go < 30; go++) {\n    let board = new Array(CELL_COUNT).fill(EMPTY);\n    board = dropPiece(board, 2, 'R');\n    board = dropPiece(board, 4, 'Y');\n    const move = computerColumn(board);\n    assert(dropRow(board, move) !== -1, 'column ' + move + ' has no room');\n}"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Now it fights back. Beating it takes a trap it cannot see."
        },
        "warning": "Work out the landing row BEFORE dropping. After the drop that row already holds the counter, and the win check needs the spot the counter is in."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Wire up the keyboard",
        "adds": "You can play without a mouse — the game is finished!",
        "intro": "<p>Left and right slide the counter above the board, and space drops it.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"left\", \"right\", \"drop\", \"pause\", \"restart\" - or nothing",
            "algorithm": [
                "Lowercase the key first.",
                "Left/right (or A/D) aim.",
                "Space, Enter or Down drops; p pauses; r starts a new round."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // return the action name, or null\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === ' ' || k === 'spacebar' || k === 'enter' || k === 'arrowdown') { return 'drop'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "One if per action.",
            "Several keys can drop: space, Enter and the down arrow.",
            "The last line is: return null;"
        ],
        "tests": [
            {
                "name": "Left and right aim",
                "code": "assert(actionForKey('ArrowLeft') === 'left' && actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "A and D aim too",
                "code": "assert(actionForKey('a') === 'left' && actionForKey('d') === 'right');"
            },
            {
                "name": "Capitals still work",
                "code": "assert(actionForKey('A') === 'left', 'did you lowercase the key?');"
            },
            {
                "name": "Space drops",
                "code": "assert(actionForKey(' ') === 'drop', 'gave ' + actionForKey(' '));"
            },
            {
                "name": "Enter and Down drop too",
                "code": "assert(actionForKey('Enter') === 'drop' && actionForKey('ArrowDown') === 'drop');"
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
            "caption": "Click the page, then aim with the arrows and drop with space."
        }
    }
];
