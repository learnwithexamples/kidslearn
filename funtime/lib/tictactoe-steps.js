/* ============================================================
   tictactoe-steps.js - the 7 steps of "Build Tic-Tac-Toe"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const TICTACTOE_STEPS = [
    {
        "id": "square_index",
        "fnName": "squareIndex",
        "title": "Number the squares",
        "adds": "The board has places to play.",
        "intro": "<p>Nine squares, stored as one flat <strong>list</strong> of nine marks. Each holds <code>''</code> (empty), <code>'X'</code> (you) or <code>'O'</code> (the computer).</p><pre class=\"mini-code\">0 | 1 | 2\n3 | 4 | 5\n6 | 7 | 8</pre>",
        "spec": {
            "input": "column, row - each 0, 1 or 2",
            "output": "the position of that square in the flat list of nine",
            "algorithm": [
                "Skip a whole row of squares for every row above: row * GRID_SIZE.",
                "Add the column.",
                "Return the answer."
            ]
        },
        "starter": "function squareIndex(column, row) {\n    // skip whole rows, then add the column\n}\n",
        "answer": "function squareIndex(column, row) {\n    return row * GRID_SIZE + column;\n}\n",
        "hints": [
            "One line.",
            "Skipping `row` rows means skipping row * GRID_SIZE squares.",
            "return row * GRID_SIZE + column;"
        ],
        "tests": [
            {
                "name": "The top-left square is 0",
                "code": "assert(squareIndex(0, 0) === 0, 'gave ' + squareIndex(0, 0));"
            },
            {
                "name": "The middle is 4",
                "code": "assert(squareIndex(1, 1) === 4, 'gave ' + squareIndex(1, 1));"
            },
            {
                "name": "The bottom-right is 8",
                "code": "assert(squareIndex(2, 2) === 8, 'gave ' + squareIndex(2, 2));"
            },
            {
                "name": "One step right adds 1",
                "code": "assert(squareIndex(2, 1) - squareIndex(1, 1) === 1);"
            },
            {
                "name": "All nine squares get different numbers",
                "code": "const seen = {};\nfor (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { seen[squareIndex(c, r)] = true; } }\nassert(Object.keys(seen).length === 9, 'only ' + Object.keys(seen).length + ' different numbers');"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers every square on the board."
        }
    },
    {
        "id": "empty_squares",
        "fnName": "emptySquares",
        "title": "Where can we play?",
        "adds": "The game knows which squares are free.",
        "intro": "<p>Before anybody moves — you or the computer — the game needs the list of squares that are still empty.</p><p>Careful: it wants the <strong>numbers</strong> of the free squares, not the marks in them.</p>",
        "spec": {
            "input": "board - the list of nine marks",
            "output": "a list of the index numbers that are still empty",
            "algorithm": [
                "Walk the board, keeping the numbers whose square is EMPTY.",
                "Return that list."
            ]
        },
        "starter": "function emptySquares(board) {\n    // the NUMBERS of the squares that are still empty\n}\n",
        "answer": "function emptySquares(board) {\n    const free = [];\n    for (let index = 0; index < board.length; index++) {\n        if (board[index] === EMPTY) {\n            free.push(index);\n        }\n    }\n    return free;\n}\n",
        "hints": [
            "Use a plain for loop so you have the index number.",
            "if (board[index] === EMPTY) { free.push(index); }",
            "Push the index, not board[index]."
        ],
        "tests": [
            {
                "name": "A new board has all nine free",
                "code": "const board = new Array(9).fill(EMPTY);\nassert(emptySquares(board).length === 9, 'gave ' + emptySquares(board).length);"
            },
            {
                "name": "A full board has none free",
                "code": "assert(emptySquares(new Array(9).fill('X')).length === 0);"
            },
            {
                "name": "It gives the right numbers",
                "code": "const board = ['X', EMPTY, 'O', EMPTY, EMPTY, 'X', 'O', 'X', EMPTY];\nassert(emptySquares(board).join(',') === '1,3,4,8', 'gave ' + emptySquares(board).join(','));"
            },
            {
                "name": "It returns numbers, not marks",
                "code": "const board = [EMPTY, 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];\nassert(emptySquares(board)[0] === 0, 'the free square is number 0');"
            },
            {
                "name": "The numbers come back in order",
                "code": "const board = new Array(9).fill(EMPTY);\nboard[0] = 'X';\nassert(emptySquares(board).join(',') === '1,2,3,4,5,6,7,8');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play a few squares and watch the free list shrink."
        }
    },
    {
        "id": "place_mark",
        "fnName": "placeMark",
        "title": "Make a move",
        "adds": "Marks can be put on the board.",
        "intro": "<p>Putting an X or an O on the board makes a <strong>new</strong> board rather than changing the old one. That matters more than it looks: in a moment the computer will want to try moves out without really making them.</p>",
        "spec": {
            "input": "board - the nine marks. index - which square. mark - 'X' or 'O'.",
            "output": "a NEW board with the mark added",
            "algorithm": [
                "Copy the board.",
                "If that square is EMPTY, put the mark in it.",
                "Return the copy."
            ]
        },
        "starter": "function placeMark(board, index, mark) {\n    // a NEW board with the mark added, if that square was free\n}\n",
        "answer": "function placeMark(board, index, mark) {\n    const next = board.slice();\n    if (next[index] === EMPTY) {\n        next[index] = mark;\n    }\n    return next;\n}\n",
        "hints": [
            "board.slice() copies a list.",
            "Only write into the square if it is EMPTY.",
            "Return the copy, not the original."
        ],
        "tests": [
            {
                "name": "The mark lands on the right square",
                "code": "const board = placeMark(new Array(9).fill(EMPTY), 4, 'X');\nassert(board[4] === 'X', 'square 4 is ' + JSON.stringify(board[4]));"
            },
            {
                "name": "The other squares are untouched",
                "code": "const board = placeMark(new Array(9).fill(EMPTY), 4, 'X');\nassert(board.filter(m => m === 'X').length === 1, 'only one square should change');"
            },
            {
                "name": "A square that is taken does not change",
                "code": "const board = placeMark(['O', EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 0, 'X');\nassert(board[0] === 'O', 'you cannot play on top of another mark');"
            },
            {
                "name": "The board you were given is not changed",
                "code": "const before = new Array(9).fill(EMPTY);\nplaceMark(before, 0, 'X');\nassert(before[0] === EMPTY, 'you changed the board you were given instead of a copy');"
            },
            {
                "name": "It returns a new list, not the old one",
                "code": "const before = new Array(9).fill(EMPTY);\nassert(placeMark(before, 0, 'X') !== before);"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Every mark you see was put there by your function."
        }
    },
    {
        "id": "winning_line",
        "fnName": "winningLine",
        "title": "Spot three in a row",
        "adds": "The game can be won.",
        "intro": "<p>There are exactly eight ways to make three in a row: three rows, three columns and two diagonals. They are already written down for you in <code>WINNING_LINES</code>.</p><pre class=\"mini-code\">[0,1,2] [3,4,5] [6,7,8]      the rows\n[0,3,6] [1,4,7] [2,5,8]      the columns\n[0,4,8] [2,4,6]              the diagonals</pre>",
        "spec": {
            "input": "board - the nine marks",
            "output": "the winning line (a list of three numbers), or nothing if no one has won",
            "algorithm": [
                "Try each line in WINNING_LINES.",
                "Look at the mark in its first square. If that square is EMPTY, skip this line.",
                "If all three squares hold that same mark, this line has won — return it.",
                "If no line wins, return null (JavaScript) or None (Python)."
            ]
        },
        "starter": "function winningLine(board) {\n    // try each of the eight lines\n}\n",
        "answer": "function winningLine(board) {\n    for (let i = 0; i < WINNING_LINES.length; i++) {\n        const line = WINNING_LINES[i];\n        const first = board[line[0]];\n        if (first !== EMPTY && first === board[line[1]] && first === board[line[2]]) {\n            return line;\n        }\n    }\n    return null;\n}\n",
        "hints": [
            "Loop over WINNING_LINES; each line is three numbers like [0, 4, 8].",
            "Check the first square is not EMPTY before comparing — three empty squares are not a win!",
            "return null; goes AFTER the loop."
        ],
        "tests": [
            {
                "name": "A top row of Xs wins",
                "code": "const board = ['X','X','X',EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY];\nassert(JSON.stringify(winningLine(board)) === '[0,1,2]', 'gave ' + JSON.stringify(winningLine(board)));"
            },
            {
                "name": "A column of Os wins",
                "code": "const board = ['O',EMPTY,EMPTY,'O',EMPTY,EMPTY,'O',EMPTY,EMPTY];\nassert(JSON.stringify(winningLine(board)) === '[0,3,6]', 'gave ' + JSON.stringify(winningLine(board)));"
            },
            {
                "name": "A diagonal wins",
                "code": "const board = ['X',EMPTY,EMPTY,EMPTY,'X',EMPTY,EMPTY,EMPTY,'X'];\nassert(JSON.stringify(winningLine(board)) === '[0,4,8]');"
            },
            {
                "name": "An empty board has no winner",
                "code": "assert(winningLine(new Array(9).fill(EMPTY)) === null, 'three empty squares are NOT three in a row');"
            },
            {
                "name": "A mixed line does not win",
                "code": "const board = ['X','O','X',EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY];\nassert(winningLine(board) === null, 'gave ' + JSON.stringify(winningLine(board)));"
            },
            {
                "name": "A full board with no line has no winner",
                "code": "const board = ['X','O','X','X','O','O','O','X','X'];\nassert(winningLine(board) === null, 'gave ' + JSON.stringify(winningLine(board)));"
            }
        ],
        "demo": {
            "kind": "lines",
            "caption": "Press Next line to see all eight ways to win — your function finds each one."
        }
    },
    {
        "id": "is_draw",
        "fnName": "isDraw",
        "title": "Spot a draw",
        "adds": "Nobody wins, and that is fine.",
        "intro": "<p>A draw is the boring ending: the board is full and no line has three in a row. Notice that this step is built entirely out of the two functions you have already written.</p>",
        "spec": {
            "input": "board - the nine marks",
            "output": "True when the board is full AND nobody has won",
            "algorithm": [
                "Ask empty-squares whether any square is left.",
                "Ask winning-line whether anybody has won.",
                "It is a draw only when there are no free squares and no winner."
            ]
        },
        "starter": "function isDraw(board) {\n    // full board, no winner\n}\n",
        "answer": "function isDraw(board) {\n    return emptySquares(board).length === 0 && winningLine(board) === null;\n}\n",
        "hints": [
            "Reuse emptySquares(board).length and winningLine(board).",
            "Both conditions must be true, so join them with &&.",
            "return emptySquares(board).length === 0 && winningLine(board) === null;"
        ],
        "tests": [
            {
                "name": "A full board with no line is a draw",
                "code": "const board = ['X','O','X','X','O','O','O','X','X'];\nassert(isDraw(board) === true, 'this board is full with no winner');"
            },
            {
                "name": "An empty board is not a draw",
                "code": "assert(isDraw(new Array(9).fill(EMPTY)) === false);"
            },
            {
                "name": "A half-played board is not a draw",
                "code": "const board = ['X','O',EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY];\nassert(isDraw(board) === false);"
            },
            {
                "name": "A full board WITH a winner is not a draw",
                "code": "const board = ['X','X','X','O','O','X','X','O','O'];\nassert(isDraw(board) === false, 'X won that one, so it is not a draw');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play until the board fills up — your function spots the draw."
        }
    },
    {
        "id": "computer_move",
        "fnName": "computerMove",
        "title": "Teach the computer to play",
        "adds": "You have an opponent!",
        "intro": "<p>Now for the fun part: the computer's brain. It is only four rules, but they are enough to make it very hard to beat.</p><p>The trick is that the computer <em>tries</em> a move on a copy of the board — that is why <code>placeMark</code> never changes the original.</p>",
        "spec": {
            "input": "board - the nine marks",
            "output": "the index the computer should play, or -1 if the board is full",
            "algorithm": [
                "Get the free squares. If there are none, return -1.",
                "1. If playing a square would make the COMPUTER win, play it.",
                "2. Otherwise, if playing a square would make the PLAYER win, play it — that blocks them.",
                "3. Otherwise take the middle (square 4) if it is free: it sits on four lines.",
                "4. Otherwise take a free corner (0, 2, 6 or 8), and if there are none, anything left."
            ]
        },
        "starter": "function computerMove(board) {\n    const free = emptySquares(board);\n    // win, block, middle, corner, anything\n}\n",
        "answer": "function computerMove(board) {\n    const free = emptySquares(board);\n    if (free.length === 0) {\n        return -1;\n    }\n\n    for (let i = 0; i < free.length; i++) {\n        if (winningLine(placeMark(board, free[i], COMPUTER)) !== null) {\n            return free[i];\n        }\n    }\n    for (let i = 0; i < free.length; i++) {\n        if (winningLine(placeMark(board, free[i], PLAYER)) !== null) {\n            return free[i];\n        }\n    }\n    if (board[4] === EMPTY) {\n        return 4;\n    }\n    const corners = [0, 2, 6, 8].filter(function (corner) { return board[corner] === EMPTY; });\n    if (corners.length > 0) {\n        return corners[Math.floor(Math.random() * corners.length)];\n    }\n    return free[Math.floor(Math.random() * free.length)];\n}\n",
        "hints": [
            "To try a move: winningLine(placeMark(board, square, COMPUTER)) !== null",
            "Do the winning loop FIRST, then the blocking loop — winning beats blocking.",
            "Only after both loops do you fall back to the middle, a corner, or anything free."
        ],
        "tests": [
            {
                "name": "It takes a winning move",
                "code": "const board = ['O','O',EMPTY,'X','X',EMPTY,EMPTY,EMPTY,EMPTY];\nassert(computerMove(board) === 2, 'O can win at square 2 — gave ' + computerMove(board));"
            },
            {
                "name": "It blocks the player",
                "code": "const board = ['X','X',EMPTY,'O',EMPTY,EMPTY,EMPTY,EMPTY,EMPTY];\nassert(computerMove(board) === 2, 'X would win at square 2, so block it — gave ' + computerMove(board));"
            },
            {
                "name": "Winning beats blocking",
                "code": "const board = ['O','O',EMPTY,'X','X',EMPTY,EMPTY,EMPTY,EMPTY];\nassert(computerMove(board) === 2, 'if it can win it should win, not block');"
            },
            {
                "name": "It takes the middle on an empty board",
                "code": "assert(computerMove(new Array(9).fill(EMPTY)) === 4, 'gave ' + computerMove(new Array(9).fill(EMPTY)));"
            },
            {
                "name": "It takes a corner when the middle is gone",
                "code": "const board = [EMPTY,EMPTY,EMPTY,EMPTY,'X',EMPTY,EMPTY,EMPTY,EMPTY];\nassert([0,2,6,8].indexOf(computerMove(board)) !== -1, 'gave ' + computerMove(board));"
            },
            {
                "name": "It says -1 when the board is full",
                "code": "assert(computerMove(new Array(9).fill('X')) === -1);"
            },
            {
                "name": "It always picks a free square",
                "code": "for (let go = 0; go < 50; go++) {\n    const board = ['X','O',EMPTY,'O','X',EMPTY,EMPTY,EMPTY,'O'];\n    const move = computerMove(board);\n    assert(board[move] === EMPTY, 'it played on a taken square: ' + move);\n}"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Try to beat it. (You probably cannot — but a draw is a fine result.)"
        },
        "warning": "Check for a WIN before checking for a block. A computer that blocks when it could have won is a computer that never wins."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Wire up the keyboard",
        "adds": "You can play without a mouse — the game is finished!",
        "intro": "<p>Arrows move a dashed cursor around the nine squares and the space bar plays there.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"up\", \"down\", \"left\", \"right\", \"play\", \"pause\", \"restart\" - or nothing",
            "algorithm": [
                "Lowercase the key first.",
                "Arrows or WASD move the cursor.",
                "Space or Enter plays; p pauses; r starts a new round."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // return the action name, or null\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'play'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "One if per action.",
            "Keys share an action with ||.",
            "The last line is: return null;"
        ],
        "tests": [
            {
                "name": "The arrows move the cursor",
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
                "name": "Space plays",
                "code": "assert(actionForKey(' ') === 'play', 'gave ' + actionForKey(' '));"
            },
            {
                "name": "Enter plays too",
                "code": "assert(actionForKey('Enter') === 'play');"
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
            "caption": "Click the page, then play with the arrow keys and space."
        }
    }
];
