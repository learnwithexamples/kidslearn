/* ============================================================
   tictactoe-python-steps.js - the 7 steps of "Build Tic-Tac-Toe in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const TICTACTOE_PYTHON_STEPS = [
    {
        "id": "square_index",
        "fnName": "square_index",
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
        "starter": "def square_index(column, row):\n    # skip whole rows, then add the column\n    pass\n",
        "answer": "def square_index(column, row):\n    return row * GRID_SIZE + column\n",
        "hints": [
            "One line.",
            "Skipping `row` rows means skipping row * GRID_SIZE squares.",
            "return row * GRID_SIZE + column"
        ],
        "tests": [
            {
                "name": "The top-left square is 0",
                "code": "got = square_index(0, 0)\nassert got == 0, f'gave {got}'"
            },
            {
                "name": "The middle is 4",
                "code": "got = square_index(1, 1)\nassert got == 4, f'gave {got}'"
            },
            {
                "name": "The bottom-right is 8",
                "code": "assert square_index(2, 2) == 8"
            },
            {
                "name": "One step right adds 1",
                "code": "assert square_index(2, 1) - square_index(1, 1) == 1"
            },
            {
                "name": "All nine squares get different numbers",
                "code": "seen = {square_index(c, r) for r in range(3) for c in range(3)}\nassert len(seen) == 9, f'only {len(seen)} different numbers'"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers every square on the board."
        }
    },
    {
        "id": "empty_squares",
        "fnName": "empty_squares",
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
        "starter": "def empty_squares(board):\n    # the NUMBERS of the squares that are still empty\n    pass\n",
        "answer": "def empty_squares(board):\n    return [index for index, mark in enumerate(board) if mark == EMPTY]\n",
        "hints": [
            "enumerate(board) gives the number and the mark together.",
            "A list comprehension can end with an `if`.",
            "Collect index, not mark."
        ],
        "tests": [
            {
                "name": "A new board has all nine free",
                "code": "assert len(empty_squares([EMPTY] * 9)) == 9"
            },
            {
                "name": "A full board has none free",
                "code": "assert empty_squares(['X'] * 9) == []"
            },
            {
                "name": "It gives the right numbers",
                "code": "board = ['X', EMPTY, 'O', EMPTY, EMPTY, 'X', 'O', 'X', EMPTY]\ngot = empty_squares(board)\nassert got == [1, 3, 4, 8], f'gave {got}'"
            },
            {
                "name": "It returns numbers, not marks",
                "code": "board = [EMPTY] + ['X'] * 8\nassert empty_squares(board) == [0]"
            },
            {
                "name": "The numbers come back in order",
                "code": "board = ['X'] + [EMPTY] * 8\nassert empty_squares(board) == [1, 2, 3, 4, 5, 6, 7, 8]"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play a few squares and watch the free list shrink."
        }
    },
    {
        "id": "place_mark",
        "fnName": "place_mark",
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
        "starter": "def place_mark(board, index, mark):\n    # a NEW board with the mark added, if that square was free\n    pass\n",
        "answer": "def place_mark(board, index, mark):\n    next_board = list(board)\n    if next_board[index] == EMPTY:\n        next_board[index] = mark\n    return next_board\n",
        "hints": [
            "list(board) copies a list.",
            "Only write into the square if it is EMPTY.",
            "Return the copy, not the original."
        ],
        "tests": [
            {
                "name": "The mark lands on the right square",
                "code": "board = place_mark([EMPTY] * 9, 4, 'X')\nassert board[4] == 'X', f'square 4 is {board[4]!r}'"
            },
            {
                "name": "The other squares are untouched",
                "code": "board = place_mark([EMPTY] * 9, 4, 'X')\nassert board.count('X') == 1"
            },
            {
                "name": "A square that is taken does not change",
                "code": "board = place_mark(['O'] + [EMPTY] * 8, 0, 'X')\nassert board[0] == 'O', 'you cannot play on top of another mark'"
            },
            {
                "name": "The board you were given is not changed",
                "code": "before = [EMPTY] * 9\nplace_mark(before, 0, 'X')\nassert before[0] == EMPTY, 'you changed the board you were given'"
            },
            {
                "name": "It returns a new list, not the old one",
                "code": "before = [EMPTY] * 9\nassert place_mark(before, 0, 'X') is not before"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Every mark you see was put there by your function."
        }
    },
    {
        "id": "winning_line",
        "fnName": "winning_line",
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
        "starter": "def winning_line(board):\n    # try each of the eight lines\n    pass\n",
        "answer": "def winning_line(board):\n    for line in WINNING_LINES:\n        first = board[line[0]]\n        if first != EMPTY and first == board[line[1]] == board[line[2]]:\n            return line\n    return None\n",
        "hints": [
            "`for line in WINNING_LINES` gives each line in turn.",
            "Check the first square is not EMPTY before comparing.",
            "Python lets you chain: first == board[line[1]] == board[line[2]]"
        ],
        "tests": [
            {
                "name": "A top row of Xs wins",
                "code": "board = ['X','X','X'] + [EMPTY] * 6\nassert winning_line(board) == [0,1,2], f'gave {winning_line(board)}'"
            },
            {
                "name": "A column of Os wins",
                "code": "board = ['O',EMPTY,EMPTY,'O',EMPTY,EMPTY,'O',EMPTY,EMPTY]\nassert winning_line(board) == [0,3,6]"
            },
            {
                "name": "A diagonal wins",
                "code": "board = ['X',EMPTY,EMPTY,EMPTY,'X',EMPTY,EMPTY,EMPTY,'X']\nassert winning_line(board) == [0,4,8]"
            },
            {
                "name": "An empty board has no winner",
                "code": "assert winning_line([EMPTY] * 9) is None, 'three empty squares are NOT three in a row'"
            },
            {
                "name": "A mixed line does not win",
                "code": "board = ['X','O','X'] + [EMPTY] * 6\nassert winning_line(board) is None"
            },
            {
                "name": "A full board with no line has no winner",
                "code": "board = ['X','O','X','X','O','O','O','X','X']\nassert winning_line(board) is None"
            }
        ],
        "demo": {
            "kind": "lines",
            "caption": "Press Next line to see all eight ways to win — your function finds each one."
        }
    },
    {
        "id": "is_draw",
        "fnName": "is_draw",
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
        "starter": "def is_draw(board):\n    # full board, no winner\n    pass\n",
        "answer": "def is_draw(board):\n    return not empty_squares(board) and winning_line(board) is None\n",
        "hints": [
            "`not empty_squares(board)` is Python for \"the list is empty\".",
            "Join the two halves with `and`.",
            "return not empty_squares(board) and winning_line(board) is None"
        ],
        "tests": [
            {
                "name": "A full board with no line is a draw",
                "code": "board = ['X','O','X','X','O','O','O','X','X']\nassert is_draw(board) is True"
            },
            {
                "name": "An empty board is not a draw",
                "code": "assert is_draw([EMPTY] * 9) is False"
            },
            {
                "name": "A half-played board is not a draw",
                "code": "assert is_draw(['X','O'] + [EMPTY] * 7) is False"
            },
            {
                "name": "A full board WITH a winner is not a draw",
                "code": "board = ['X','X','X','O','O','X','X','O','O']\nassert is_draw(board) is False, 'X won that one'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play until the board fills up — your function spots the draw."
        }
    },
    {
        "id": "computer_move",
        "fnName": "computer_move",
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
        "starter": "def computer_move(board):\n    free = empty_squares(board)\n    # win, block, middle, corner, anything\n    pass\n",
        "answer": "def computer_move(board):\n    free = empty_squares(board)\n    if not free:\n        return -1\n\n    for index in free:\n        if winning_line(place_mark(board, index, COMPUTER)) is not None:\n            return index\n    for index in free:\n        if winning_line(place_mark(board, index, PLAYER)) is not None:\n            return index\n    if board[4] == EMPTY:\n        return 4\n    corners = [corner for corner in (0, 2, 6, 8) if board[corner] == EMPTY]\n    if corners:\n        return random.choice(corners)\n    return random.choice(free)\n",
        "hints": [
            "To try a move: winning_line(place_mark(board, index, COMPUTER)) is not None",
            "Do the winning loop FIRST, then the blocking loop.",
            "random.choice(corners) picks one corner (random is already imported)."
        ],
        "tests": [
            {
                "name": "It takes a winning move",
                "code": "board = ['O','O',EMPTY,'X','X',EMPTY,EMPTY,EMPTY,EMPTY]\ngot = computer_move(board)\nassert got == 2, f'O can win at square 2 - gave {got}'"
            },
            {
                "name": "It blocks the player",
                "code": "board = ['X','X',EMPTY,'O',EMPTY,EMPTY,EMPTY,EMPTY,EMPTY]\ngot = computer_move(board)\nassert got == 2, f'X would win at 2, so block it - gave {got}'"
            },
            {
                "name": "Winning beats blocking",
                "code": "board = ['O','O',EMPTY,'X','X',EMPTY,EMPTY,EMPTY,EMPTY]\nassert computer_move(board) == 2, 'if it can win it should win, not block'"
            },
            {
                "name": "It takes the middle on an empty board",
                "code": "got = computer_move([EMPTY] * 9)\nassert got == 4, f'gave {got}'"
            },
            {
                "name": "It takes a corner when the middle is gone",
                "code": "board = [EMPTY] * 9\nboard[4] = 'X'\nassert computer_move(board) in (0, 2, 6, 8), f'gave {computer_move(board)}'"
            },
            {
                "name": "It says -1 when the board is full",
                "code": "assert computer_move(['X'] * 9) == -1"
            },
            {
                "name": "It always picks a free square",
                "code": "board = ['X','O',EMPTY,'O','X',EMPTY,EMPTY,EMPTY,'O']\nfor _ in range(50):\n    move = computer_move(board)\n    assert board[move] == EMPTY, f'it played on a taken square: {move}'"
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
        "fnName": "action_for_key",
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
        "starter": "def action_for_key(key):\n    k = str(key).lower()\n    # a dictionary from key names to action names, then .get(k)\n    pass\n",
        "answer": "def action_for_key(key):\n    k = str(key).lower()\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \" \": \"play\", \"spacebar\": \"play\", \"enter\": \"play\",\n        \"p\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(k)\n",
        "hints": [
            "A dictionary IS the lookup table.",
            "Several keys can share an action.",
            "keys.get(k) gives None for anything missing."
        ],
        "tests": [
            {
                "name": "The arrows move the cursor",
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
                "name": "Space plays",
                "code": "got = action_for_key(' ')\nassert got == 'play', f'gave {got!r}'"
            },
            {
                "name": "Enter plays too",
                "code": "assert action_for_key('Enter') == 'play'"
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
            "caption": "Click the page, then play with the arrow keys and space."
        }
    }
];
