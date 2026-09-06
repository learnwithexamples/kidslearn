/* ============================================================
   connect4-python-steps.js - the 7 steps of "Build Connect Four in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const CONNECT4_PYTHON_STEPS = [
    {
        "id": "cell_index",
        "fnName": "cell_index",
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
        "starter": "def cell_index(column, row):\n    # skip whole rows, then add the column\n    pass\n",
        "answer": "def cell_index(column, row):\n    return row * COLUMNS + column\n",
        "hints": [
            "One line.",
            "A row is COLUMNS holes wide.",
            "return row * COLUMNS + column"
        ],
        "tests": [
            {
                "name": "The top-left hole is 0",
                "code": "got = cell_index(0, 0)\nassert got == 0, f'gave {got}'"
            },
            {
                "name": "The top-right hole is 6",
                "code": "assert cell_index(6, 0) == 6"
            },
            {
                "name": "The bottom-left hole is 35",
                "code": "got = cell_index(0, 5)\nassert got == 35, f'gave {got}'"
            },
            {
                "name": "The bottom-right hole is 41",
                "code": "assert cell_index(6, 5) == 41"
            },
            {
                "name": "One row down adds COLUMNS",
                "code": "assert cell_index(2, 3) - cell_index(2, 2) == COLUMNS"
            },
            {
                "name": "All 42 holes get different numbers",
                "code": "seen = {cell_index(c, r) for r in range(ROWS) for c in range(COLUMNS)}\nassert len(seen) == 42, f'only {len(seen)} different numbers'"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers all 42 holes."
        }
    },
    {
        "id": "drop_row",
        "fnName": "drop_row",
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
        "starter": "def drop_row(board, column):\n    # walk up from the bottom looking for the first empty hole\n    pass\n",
        "answer": "def drop_row(board, column):\n    for row in range(ROWS - 1, -1, -1):\n        if board[cell_index(column, row)] == EMPTY:\n            return row\n    return -1\n",
        "hints": [
            "range(ROWS - 1, -1, -1) counts downwards: 5, 4, 3, 2, 1, 0.",
            "Check board[cell_index(column, row)] == EMPTY.",
            "return -1 goes after the loop, for a full column."
        ],
        "tests": [
            {
                "name": "On an empty board a counter falls to the bottom row",
                "code": "board = [EMPTY] * CELL_COUNT\ngot = drop_row(board, 3)\nassert got == ROWS - 1, f'gave {got}, expected {ROWS - 1}'"
            },
            {
                "name": "It lands on top of a counter already there",
                "code": "board = [EMPTY] * CELL_COUNT\nboard[cell_index(3, ROWS - 1)] = 'R'\nassert drop_row(board, 3) == ROWS - 2"
            },
            {
                "name": "A full column gives -1",
                "code": "board = [EMPTY] * CELL_COUNT\nfor row in range(ROWS):\n    board[cell_index(2, row)] = 'Y'\nassert drop_row(board, 2) == -1"
            },
            {
                "name": "Other columns are not affected",
                "code": "board = [EMPTY] * CELL_COUNT\nfor row in range(ROWS):\n    board[cell_index(2, row)] = 'Y'\nassert drop_row(board, 1) == ROWS - 1"
            },
            {
                "name": "A column with one gap at the top",
                "code": "board = [EMPTY] * CELL_COUNT\nfor row in range(1, ROWS):\n    board[cell_index(0, row)] = 'R'\nassert drop_row(board, 0) == 0"
            }
        ],
        "demo": {
            "kind": "drop",
            "caption": "Aim at a column and watch your function say which row a counter would reach."
        }
    },
    {
        "id": "drop_piece",
        "fnName": "drop_piece",
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
        "starter": "def drop_piece(board, column, mark):\n    # find the row, then put the mark there on a COPY\n    pass\n",
        "answer": "def drop_piece(board, column, mark):\n    row = drop_row(board, column)\n    next_board = list(board)\n    if row != -1:\n        next_board[cell_index(column, row)] = mark\n    return next_board\n",
        "hints": [
            "Reuse drop_row — you already wrote it.",
            "list(board) makes the copy.",
            "next_board[cell_index(column, row)] = mark"
        ],
        "tests": [
            {
                "name": "The counter lands at the bottom",
                "code": "board = drop_piece([EMPTY] * CELL_COUNT, 3, 'R')\nassert board[cell_index(3, ROWS - 1)] == 'R'"
            },
            {
                "name": "Two drops stack up",
                "code": "board = drop_piece([EMPTY] * CELL_COUNT, 3, 'R')\nboard = drop_piece(board, 3, 'Y')\nassert board[cell_index(3, ROWS - 2)] == 'Y'"
            },
            {
                "name": "Only one hole changes",
                "code": "board = drop_piece([EMPTY] * CELL_COUNT, 3, 'R')\nassert sum(1 for m in board if m != EMPTY) == 1"
            },
            {
                "name": "A full column leaves the board alone",
                "code": "board = [EMPTY] * CELL_COUNT\nfor _ in range(ROWS):\n    board = drop_piece(board, 0, 'R')\nafter = drop_piece(board, 0, 'Y')\nassert 'Y' not in after, 'nothing should fit in a full column'"
            },
            {
                "name": "The board you were given is not changed",
                "code": "before = [EMPTY] * CELL_COUNT\ndrop_piece(before, 3, 'R')\nassert all(m == EMPTY for m in before)"
            }
        ],
        "demo": {
            "kind": "drop",
            "caption": "Press Fill it a few times and watch the column stack up."
        }
    },
    {
        "id": "count_in_direction",
        "fnName": "count_in_direction",
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
        "starter": "def count_in_direction(board, column, row, dx, dy, mark):\n    found = 0\n    # step again and again while the mark keeps going\n    return found\n",
        "answer": "def count_in_direction(board, column, row, dx, dy, mark):\n    found = 0\n    c, r = column + dx, row + dy\n    while is_inside_board(c, r) and board[cell_index(c, r)] == mark:\n        found += 1\n        c += dx\n        r += dy\n    return found\n",
        "hints": [
            "Take the first step BEFORE the loop, so the starting hole is not counted.",
            "`c, r = column + dx, row + dy` sets both at once.",
            "Step again inside the loop, or it will never end."
        ],
        "tests": [
            {
                "name": "Three counters to the right",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in (1, 2, 3):\n    board[cell_index(c, 5)] = 'R'\ngot = count_in_direction(board, 0, 5, 1, 0, 'R')\nassert got == 3, f'gave {got}'"
            },
            {
                "name": "The starting hole is not counted",
                "code": "board = [EMPTY] * CELL_COUNT\nboard[cell_index(0, 5)] = 'R'\nassert count_in_direction(board, 0, 5, 1, 0, 'R') == 0"
            },
            {
                "name": "It stops at a different mark",
                "code": "board = [EMPTY] * CELL_COUNT\nboard[cell_index(1, 5)] = 'R'\nboard[cell_index(2, 5)] = 'Y'\nboard[cell_index(3, 5)] = 'R'\ngot = count_in_direction(board, 0, 5, 1, 0, 'R')\nassert got == 1, f'the Y blocks the run - gave {got}'"
            },
            {
                "name": "It stops at the edge of the board",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in range(COLUMNS):\n    board[cell_index(c, 5)] = 'R'\nassert count_in_direction(board, 0, 5, 1, 0, 'R') == COLUMNS - 1"
            },
            {
                "name": "It counts upwards too",
                "code": "board = [EMPTY] * CELL_COUNT\nfor r in (3, 4, 5):\n    board[cell_index(2, r)] = 'Y'\nassert count_in_direction(board, 2, 2, 0, 1, 'Y') == 3"
            },
            {
                "name": "It counts along a diagonal",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c, r in [(1,4),(2,3),(3,2)]:\n    board[cell_index(c, r)] = 'R'\nassert count_in_direction(board, 0, 5, 1, -1, 'R') == 3"
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
        "fnName": "is_win_at",
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
        "starter": "def is_win_at(board, column, row, mark):\n    # look both ways along each of the four directions\n    pass\n",
        "answer": "def is_win_at(board, column, row, mark):\n    for dx, dy in DIRECTIONS:\n        total = (1\n                 + count_in_direction(board, column, row, dx, dy, mark)\n                 + count_in_direction(board, column, row, -dx, -dy, mark))\n        if total >= WIN_LENGTH:\n            return True\n    return False\n",
        "hints": [
            "`for dx, dy in DIRECTIONS` unpacks each direction.",
            "The opposite direction is -dx, -dy.",
            "Do not forget the + 1 for the counter you just dropped."
        ],
        "tests": [
            {
                "name": "Four across is a win",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in range(4):\n    board[cell_index(c, 5)] = 'R'\nassert is_win_at(board, 3, 5, 'R') is True"
            },
            {
                "name": "Three across is not",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in range(3):\n    board[cell_index(c, 5)] = 'R'\nassert is_win_at(board, 2, 5, 'R') is False"
            },
            {
                "name": "A counter in the MIDDLE of a line still wins",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in range(4):\n    board[cell_index(c, 5)] = 'R'\nassert is_win_at(board, 1, 5, 'R') is True, 'you must look BOTH ways'"
            },
            {
                "name": "Four going down is a win",
                "code": "board = [EMPTY] * CELL_COUNT\nfor r in (2, 3, 4, 5):\n    board[cell_index(1, r)] = 'Y'\nassert is_win_at(board, 1, 2, 'Y') is True"
            },
            {
                "name": "Four on a diagonal is a win",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c, r in [(0,5),(1,4),(2,3),(3,2)]:\n    board[cell_index(c, r)] = 'R'\nassert is_win_at(board, 3, 2, 'R') is True"
            },
            {
                "name": "The other player's counters do not help",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in range(3):\n    board[cell_index(c, 5)] = 'R'\nboard[cell_index(3, 5)] = 'Y'\nassert is_win_at(board, 3, 5, 'Y') is False"
            },
            {
                "name": "An empty board has no win",
                "code": "assert is_win_at([EMPTY] * CELL_COUNT, 3, 5, 'R') is False"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Try to get four in a row — your function decides when you have."
        }
    },
    {
        "id": "computer_column",
        "fnName": "computer_column",
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
        "starter": "def computer_column(board):\n    open_columns = playable_columns(board)\n    # win, block, then middle-ish and safe\n    pass\n",
        "answer": "def computer_column(board):\n    open_columns = playable_columns(board)\n    if not open_columns:\n        return -1\n\n    for column in open_columns:\n        row = drop_row(board, column)\n        if is_win_at(drop_piece(board, column, COMPUTER), column, row, COMPUTER):\n            return column\n    for column in open_columns:\n        row = drop_row(board, column)\n        if is_win_at(drop_piece(board, column, PLAYER), column, row, PLAYER):\n            return column\n\n    middle_first = sorted(open_columns, key=lambda column: abs(column - 3))\n    for column in middle_first:\n        after = drop_piece(board, column, COMPUTER)\n        reply_row = drop_row(after, column)\n        if reply_row == -1 or not is_win_at(drop_piece(after, column, PLAYER), column, reply_row, PLAYER):\n            return column\n    return middle_first[0]\n",
        "hints": [
            "To try a drop: is_win_at(drop_piece(board, column, MARK), column, drop_row(board, column), MARK)",
            "Work out the row BEFORE the drop — that is where the counter lands.",
            "sorted(open_columns, key=lambda c: abs(c - 3)) puts the middle first."
        ],
        "tests": [
            {
                "name": "It takes a winning drop",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in range(3):\n    board[cell_index(c, 5)] = 'Y'\ngot = computer_column(board)\nassert got == 3, f'Y can win in column 3 - gave {got}'"
            },
            {
                "name": "It blocks the player",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in range(3):\n    board[cell_index(c, 5)] = 'R'\ngot = computer_column(board)\nassert got == 3, f'R would win in column 3 - gave {got}'"
            },
            {
                "name": "Winning beats blocking",
                "code": "board = [EMPTY] * CELL_COUNT\nfor c in range(3):\n    board[cell_index(c, 5)] = 'Y'\n    board[cell_index(c, 4)] = 'R'\nassert computer_column(board) == 3, 'it should win rather than block'"
            },
            {
                "name": "On an empty board it plays near the middle",
                "code": "got = computer_column([EMPTY] * CELL_COUNT)\nassert got == 3, f'the middle column is strongest - gave {got}'"
            },
            {
                "name": "It never picks a full column",
                "code": "board = [EMPTY] * CELL_COUNT\nfor r in range(ROWS):\n    board[cell_index(3, r)] = 'R'\nassert computer_column(board) != 3"
            },
            {
                "name": "It says -1 when the board is full",
                "code": "assert computer_column(['R'] * CELL_COUNT) == -1"
            },
            {
                "name": "It always returns a playable column",
                "code": "board = drop_piece(drop_piece([EMPTY] * CELL_COUNT, 2, 'R'), 4, 'Y')\nfor _ in range(30):\n    move = computer_column(board)\n    assert drop_row(board, move) != -1, f'column {move} has no room'"
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
        "fnName": "action_for_key",
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
        "starter": "def action_for_key(key):\n    k = str(key).lower()\n    # a dictionary from key names to action names, then .get(k)\n    pass\n",
        "answer": "def action_for_key(key):\n    k = str(key).lower()\n    keys = {\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \" \": \"drop\", \"spacebar\": \"drop\", \"enter\": \"drop\", \"arrowdown\": \"drop\", \"s\": \"drop\",\n        \"p\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(k)\n",
        "hints": [
            "A dictionary IS the lookup table.",
            "Several keys can share the drop action.",
            "keys.get(k) gives None for anything missing."
        ],
        "tests": [
            {
                "name": "Left and right aim",
                "code": "assert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "A and D aim too",
                "code": "assert action_for_key('a') == 'left' and action_for_key('d') == 'right'"
            },
            {
                "name": "Capitals still work",
                "code": "assert action_for_key('A') == 'left'"
            },
            {
                "name": "Space drops",
                "code": "got = action_for_key(' ')\nassert got == 'drop', f'gave {got!r}'"
            },
            {
                "name": "Enter and Down drop too",
                "code": "assert action_for_key('Enter') == 'drop' and action_for_key('ArrowDown') == 'drop'"
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
            "caption": "Click the page, then aim with the arrows and drop with space."
        }
    }
];
