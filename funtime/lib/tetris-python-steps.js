/* ============================================================
   tetris-python-steps.js - the twelve steps of "Build Tetris in Python"

   The same twelve functions as the JavaScript workshop, written in Python -
   and each step points out where Python says the idea more neatly.

   Every test is a few lines of real Python ending in an `assert`.
   ============================================================ */

const TETRIS_PYTHON_STEPS = [
    {
        "id": "create_empty_board",
        "fnName": "create_empty_board",
        "title": "Build the empty field",
        "adds": "The playing field appears.",
        "intro": "<p>The field is <strong>10 columns across and 20 rows down</strong>, stored as a list of rows. <code>0</code> means empty, <code>1</code> means a locked block.</p><pre class=\"mini-code\">board[row][column]     row 0 = top, row 19 = the floor</pre><p>Python builds lists with a <strong>list comprehension</strong> - a loop that makes a list - so this whole function fits on one line.</p>",
        "spec": {
            "input": "width - how many columns (10). height - how many rows (20).",
            "output": "a list of `height` rows, each a list of `width` zeros",
            "algorithm": [
                "Build one row with [0] * width.",
                "Repeat that for every row: [[0] * width for _ in range(height)].",
                "Return it."
            ]
        },
        "starter": "def create_empty_board(width, height):\n    # a list of `height` rows, each holding `width` zeros\n    pass\n",
        "answer": "def create_empty_board(width, height):\n    return [[0] * width for _ in range(height)]\n",
        "hints": [
            "[0] * 10 makes a list of ten zeros.",
            "A list comprehension repeats that: [ ... for _ in range(height) ].",
            "The _ is just a name for \"I do not need this number\"."
        ],
        "tests": [
            {
                "name": "A 3 x 2 board is [[0,0,0],[0,0,0]]",
                "code": "got = create_empty_board(3, 2)\nassert got == [[0, 0, 0], [0, 0, 0]], f'gave {got}'"
            },
            {
                "name": "The real board is 10 wide and 20 tall",
                "code": "board = create_empty_board(10, 20)\nassert len(board) == 20, f'got {len(board)} rows'\nassert len(board[0]) == 10, f'got {len(board[0])} columns'"
            },
            {
                "name": "Every square starts empty",
                "code": "board = create_empty_board(10, 20)\nassert all(value == 0 for row in board for value in row), 'some squares were not 0'"
            },
            {
                "name": "Each row is its own list (a classic bug!)",
                "code": "board = create_empty_board(4, 3)\nboard[0][0] = 1\nassert board[1][0] == 0 and board[2][0] == 0, 'changing row 0 changed the other rows too - build a NEW list for each row'"
            },
            {
                "name": "A tall thin board works too",
                "code": "board = create_empty_board(1, 5)\nassert board == [[0], [0], [0], [0], [0]], f'gave {board}'"
            }
        ],
        "demo": {
            "kind": "board",
            "caption": "Your board, drawn by Python. 10 columns x 20 rows."
        },
        "warning": "Do not build one row and reuse it: [row] * height would give every line the SAME list, and changing one would change them all."
    },
    {
        "id": "is_row_full",
        "fnName": "is_row_full",
        "title": "Spot a completed row",
        "adds": "The game can see which rows are ready to clear.",
        "intro": "<p>The whole point of Tetris: is every square in this row full?</p><p>JavaScript needed a loop that returns early. Python has <code>all()</code>, which asks \"is this true of every item?\" and stops at the first one that is not.</p>",
        "spec": {
            "input": "row - one row of the board, e.g. [1, 1, 0, 1]",
            "output": "True if every square is 1",
            "algorithm": [
                "Check every value in the row with all(...).",
                "all(value == 1 for value in row) is True only when nothing is 0."
            ]
        },
        "starter": "def is_row_full(row):\n    # is every square a 1?\n    pass\n",
        "answer": "def is_row_full(row):\n    return all(value == 1 for value in row)\n",
        "hints": [
            "all(...) takes a generator: all(value == 1 for value in row).",
            "A plain for loop with `return False` inside works just as well.",
            "return all(value == 1 for value in row)"
        ],
        "tests": [
            {
                "name": "A row of four 1s is full",
                "code": "got = is_row_full([1, 1, 1, 1])\nassert got is True, f'gave {got!r}'"
            },
            {
                "name": "One gap means not full",
                "code": "assert is_row_full([1, 1, 0, 1]) is False"
            },
            {
                "name": "An empty row is not full",
                "code": "assert is_row_full([0, 0, 0, 0]) is False"
            },
            {
                "name": "A gap at the very start is spotted",
                "code": "assert is_row_full([0, 1, 1, 1]) is False"
            },
            {
                "name": "A gap at the very end is spotted",
                "code": "assert is_row_full([1, 1, 1, 0]) is False"
            },
            {
                "name": "A full 10-wide row works too",
                "code": "assert is_row_full([1] * 10) is True"
            }
        ],
        "demo": {
            "kind": "rows",
            "caption": "Rows your function calls FULL are drawn inverted."
        }
    },
    {
        "id": "find_full_rows",
        "fnName": "find_full_rows",
        "title": "Find every completed row",
        "adds": "The game knows exactly which rows to delete.",
        "intro": "<p>One piece can complete up to four rows at once, so the game collects the row <em>numbers</em> of every finished row.</p><p><code>enumerate</code> hands you the number and the row together - no counting by hand.</p>",
        "spec": {
            "input": "board - the whole field",
            "output": "a list of row numbers, top first; an empty list if none are complete",
            "algorithm": [
                "Walk the board with enumerate(board), which gives (number, row) pairs.",
                "Keep the numbers whose row is_row_full.",
                "Return that list."
            ]
        },
        "starter": "def find_full_rows(board):\n    # the numbers of the rows that are full\n    pass\n",
        "answer": "def find_full_rows(board):\n    return [y for y, row in enumerate(board) if is_row_full(row)]\n",
        "hints": [
            "enumerate(board) gives pairs: for y, row in enumerate(board)",
            "A list comprehension can end with an `if`, which keeps only some items.",
            "Collect y (the number), not row (the list)."
        ],
        "tests": [
            {
                "name": "Rows 1 and 3 are full",
                "code": "got = find_full_rows([[1,0,1,1],[1,1,1,1],[0,0,0,0],[1,1,1,1]])\nassert got == [1, 3], f'gave {got}'"
            },
            {
                "name": "Nothing full gives an empty list",
                "code": "assert find_full_rows([[1,0],[0,0]]) == []"
            },
            {
                "name": "Everything full gives every row",
                "code": "assert find_full_rows([[1,1],[1,1],[1,1]]) == [0, 1, 2]"
            },
            {
                "name": "The numbers come back in order, top first",
                "code": "got = find_full_rows([[1,1],[0,1],[1,1],[1,1]])\nassert got == [0, 2, 3], f'gave {got}'"
            },
            {
                "name": "It returns numbers, not rows",
                "code": "got = find_full_rows([[1,1],[0,1]])\nassert got == [0], f'gave {got} - collect the row NUMBER'"
            }
        ],
        "demo": {
            "kind": "rows",
            "caption": "The rows your function returns are listed below and drawn inverted."
        }
    },
    {
        "id": "remove_rows",
        "fnName": "remove_rows",
        "title": "Clear the rows and drop the stack",
        "adds": "Completed rows vanish and everything above falls.",
        "intro": "<p>The moment every Tetris player plays for. Delete the finished rows, let everything above slide down, and add fresh empty rows on top so the field stays 20 rows tall.</p><p>The clever version moves nothing: it builds a new board out of the rows we are <strong>keeping</strong>.</p>",
        "spec": {
            "input": "board - the field. row_numbers - the rows to delete.",
            "output": "a NEW board of the same size, with empty rows added on top",
            "algorithm": [
                "Keep every row whose number is not in row_numbers.",
                "While the kept list is shorter than the original height, insert a new empty row at the FRONT (position 0).",
                "Return it."
            ]
        },
        "starter": "def remove_rows(board, row_numbers):\n    height = len(board)\n    width = len(board[0])\n    # keep the rows we are not deleting, then pad the top\n    pass\n",
        "answer": "def remove_rows(board, row_numbers):\n    height = len(board)\n    width = len(board[0])\n    kept = [row[:] for y, row in enumerate(board) if y not in row_numbers]\n    while len(kept) < height:\n        kept.insert(0, [0] * width)\n    return kept\n",
        "hints": [
            "`if y not in row_numbers` keeps the rows we are not deleting.",
            "row[:] copies a row, so the new board does not share rows with the old one.",
            "kept.insert(0, [0] * width) puts an empty row at the top."
        ],
        "tests": [
            {
                "name": "Deleting row 1 of a 3-row board",
                "code": "got = remove_rows([[1,1],[0,1],[1,0]], [1])\nassert got == [[0,0],[1,1],[1,0]], f'gave {got}'"
            },
            {
                "name": "The board keeps its height",
                "code": "got = remove_rows([[1,1],[1,1],[1,1],[1,1]], [1, 2])\nassert len(got) == 4, f'got {len(got)} rows, expected 4'"
            },
            {
                "name": "The new top row is empty",
                "code": "got = remove_rows([[1,1],[1,1],[1,1]], [2])\nassert got[0] == [0, 0], f'the top row is {got[0]}'"
            },
            {
                "name": "Deleting nothing changes nothing",
                "code": "assert remove_rows([[1,0],[0,1]], []) == [[1,0],[0,1]]"
            },
            {
                "name": "Deleting the bottom row drops the stack down",
                "code": "got = remove_rows([[0,0],[1,0],[1,1]], [2])\nassert got == [[0,0],[0,0],[1,0]], f'gave {got}'"
            },
            {
                "name": "The original board is not damaged",
                "code": "original = [[1,1],[0,1]]\nremove_rows(original, [0])\nassert original == [[1,1],[0,1]], f'the board you were given became {original}'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Fill a row across and watch your remove_rows do its job."
        },
        "warning": "`y not in row_numbers` is how Python asks \"is this row number missing from the list?\"."
    },
    {
        "id": "rotate_matrix_clockwise",
        "fnName": "rotate_matrix_clockwise",
        "title": "Turn a piece",
        "adds": "Pieces can spin!",
        "intro": "<p>A piece is a little square grid, and turning it is pure maths:</p><pre class=\"mini-code\">answer[r][c] = matrix[N - 1 - c][r]</pre><pre class=\"mini-code\">[0,1,0]        [0,1,0]\n[1,1,1]  -->   [0,1,1]\n[0,0,0]        [0,1,0]</pre><p>With a nested list comprehension the whole rotation is one line of Python.</p>",
        "spec": {
            "input": "matrix - a square grid, N x N",
            "output": "a NEW N x N grid, turned a quarter turn clockwise",
            "algorithm": [
                "Let size be len(matrix).",
                "For every row r and column c of the ANSWER: answer[r][c] = matrix[size - 1 - c][r].",
                "Build it with a nested list comprehension, or two loops if you prefer."
            ]
        },
        "starter": "def rotate_matrix_clockwise(matrix):\n    size = len(matrix)\n    # answer[r][c] = matrix[size - 1 - c][r]\n    pass\n",
        "answer": "def rotate_matrix_clockwise(matrix):\n    size = len(matrix)\n    return [[matrix[size - 1 - c][r] for c in range(size)] for r in range(size)]\n",
        "hints": [
            "The inner comprehension builds one row; the outer one repeats it for every row.",
            "Read the formula carefully - the ROW index uses c, and the COLUMN index uses r.",
            "If your piece comes out mirrored, you have written matrix[c][size - 1 - r], which is the anti-clockwise turn."
        ],
        "tests": [
            {
                "name": "The T piece turns to point right",
                "code": "got = rotate_matrix_clockwise([[0,1,0],[1,1,1],[0,0,0]])\nassert got == [[0,1,0],[0,1,1],[0,1,0]], f'gave {got}'"
            },
            {
                "name": "A 2 x 2 square looks the same",
                "code": "assert rotate_matrix_clockwise([[1,1],[1,1]]) == [[1,1],[1,1]]"
            },
            {
                "name": "The L piece turns correctly",
                "code": "got = rotate_matrix_clockwise([[0,0,1],[1,1,1],[0,0,0]])\nassert got == [[0,1,0],[0,1,0],[0,1,1]], f'gave {got}'"
            },
            {
                "name": "Turning four times comes back to the start",
                "code": "start = [[0,1,0],[1,1,1],[0,0,0]]\nm = start\nfor _ in range(4):\n    m = rotate_matrix_clockwise(m)\nassert m == start, f'after four turns the piece is {m}'"
            },
            {
                "name": "The original piece is not changed",
                "code": "start = [[0,1,0],[1,1,1],[0,0,0]]\nrotate_matrix_clockwise(start)\nassert start == [[0,1,0],[1,1,1],[0,0,0]], 'you changed the grid you were given'"
            },
            {
                "name": "It works on the 4 x 4 I piece",
                "code": "got = rotate_matrix_clockwise([[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]])\nassert got == [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]], f'gave {got}'"
            }
        ],
        "demo": {
            "kind": "spin",
            "caption": "Press Turn to rotate each of the seven pieces with YOUR function."
        }
    },
    {
        "id": "can_place_piece",
        "fnName": "can_place_piece",
        "title": "The referee",
        "adds": "Pieces stop at the walls, the floor and the pile.",
        "intro": "<p>The most important function in the game. Every move, rotation and drop asks it: <strong>may this piece sit exactly here?</strong></p><p>A helper is written for you: <code>piece_blocks(piece)</code> gives the list of <code>(x, y)</code> squares the piece covers on the board.</p>",
        "spec": {
            "input": "board - the field. piece - a piece dictionary.",
            "output": "True if all four blocks land on free squares",
            "algorithm": [
                "For every (x, y) in piece_blocks(piece):",
                "    if x is left of 0 or past the last column -> False",
                "    if y is below the last row -> False",
                "    if is_cell_filled(board, x, y) -> False",
                "If none of those happened, return True."
            ]
        },
        "starter": "def can_place_piece(board, piece):\n    for x, y in piece_blocks(piece):\n        # walls, floor, and squares already taken\n        pass\n    return True\n",
        "answer": "def can_place_piece(board, piece):\n    for x, y in piece_blocks(piece):\n        if x < 0 or x >= len(board[0]):\n            return False\n        if y >= len(board):\n            return False\n        if is_cell_filled(board, x, y):\n            return False\n    return True\n",
        "hints": [
            "`for x, y in piece_blocks(piece)` unpacks each square into two names.",
            "len(board[0]) is the width and len(board) is the height.",
            "is_cell_filled(board, x, y) is already written - it also copes with squares above the top."
        ],
        "tests": [
            {
                "name": "A piece in the middle of an empty board fits",
                "code": "piece = create_piece('T')\npiece['x'], piece['y'] = 4, 5\nassert can_place_piece(create_empty_board(10, 20), piece) is True"
            },
            {
                "name": "A piece through the left wall does not fit",
                "code": "piece = create_piece('O')\npiece['x'], piece['y'] = -1, 5\nassert can_place_piece(create_empty_board(10, 20), piece) is False"
            },
            {
                "name": "A piece through the right wall does not fit",
                "code": "piece = create_piece('O')\npiece['x'], piece['y'] = 9, 5\nassert can_place_piece(create_empty_board(10, 20), piece) is False, 'the O piece is 2 wide, so x = 9 hangs over the edge'"
            },
            {
                "name": "A piece cannot go below the floor",
                "code": "piece = create_piece('O')\npiece['x'], piece['y'] = 4, 19\nassert can_place_piece(create_empty_board(10, 20), piece) is False"
            },
            {
                "name": "A piece may still be above the ceiling",
                "code": "piece = create_piece('I')\npiece['x'], piece['y'] = 3, -1\nassert can_place_piece(create_empty_board(10, 20), piece) is True, 'new pieces start partly above the board'"
            },
            {
                "name": "A piece cannot sit on top of another block",
                "code": "board = create_empty_board(10, 20)\nboard[6][4] = 1\npiece = create_piece('O')\npiece['x'], piece['y'] = 4, 6\nassert can_place_piece(board, piece) is False"
            },
            {
                "name": "It fits right next to a block without touching it",
                "code": "board = create_empty_board(10, 20)\nboard[6][0] = 1\npiece = create_piece('O')\npiece['x'], piece['y'] = 4, 6\nassert can_place_piece(board, piece) is True"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Slide the piece around - your referee decides where it may go."
        },
        "warning": "A piece is allowed to poke ABOVE the top of the board while it is being born, so do not fail on a negative y."
    },
    {
        "id": "merge_piece_into_board",
        "fnName": "merge_piece_into_board",
        "title": "Make a piece land",
        "adds": "Pieces stop falling and join the pile.",
        "intro": "<p>When a piece can fall no further it becomes part of the field for ever. We stamp its four blocks onto the board.</p><p>Notice we build a <strong>new</strong> board rather than scribbling on the old one - <code>copy_matrix</code> is written for you.</p>",
        "spec": {
            "input": "board - the field. piece - the piece that just landed.",
            "output": "a NEW board with the piece's four blocks turned into 1s",
            "algorithm": [
                "Copy the board with copy_matrix(board).",
                "For every (x, y) in piece_blocks(piece): if that square is on the board, set result[y][x] = 1.",
                "Return the copy."
            ]
        },
        "starter": "def merge_piece_into_board(board, piece):\n    result = copy_matrix(board)\n    # stamp the piece's blocks onto result\n    pass\n",
        "answer": "def merge_piece_into_board(board, piece):\n    result = copy_matrix(board)\n    for x, y in piece_blocks(piece):\n        if 0 <= y < len(result) and 0 <= x < len(result[0]):\n            result[y][x] = 1\n    return result\n",
        "hints": [
            "Row first, column second: result[y][x] = 1, not result[x][y].",
            "Guard against squares above the top with 0 <= y < len(result).",
            "Do not forget to return result."
        ],
        "tests": [
            {
                "name": "Exactly four squares become 1",
                "code": "piece = create_piece('T')\npiece['x'], piece['y'] = 4, 5\nout = merge_piece_into_board(create_empty_board(10, 20), piece)\ncount = sum(sum(row) for row in out)\nassert count == 4, f'found {count} filled squares'"
            },
            {
                "name": "The blocks land in the right places",
                "code": "piece = create_piece('O')\npiece['x'], piece['y'] = 0, 0\nout = merge_piece_into_board(create_empty_board(4, 3), piece)\nassert out == [[1,1,0,0],[1,1,0,0],[0,0,0,0]], f'gave {out}'"
            },
            {
                "name": "Blocks already on the board stay there",
                "code": "board = create_empty_board(10, 20)\nboard[19][0] = 1\npiece = create_piece('O')\npiece['x'], piece['y'] = 4, 18\nout = merge_piece_into_board(board, piece)\nassert out[19][0] == 1, 'the old block was lost'"
            },
            {
                "name": "The original board is not changed",
                "code": "board = create_empty_board(4, 4)\npiece = create_piece('O')\npiece['x'], piece['y'] = 0, 0\nmerge_piece_into_board(board, piece)\nassert board[0][0] == 0, 'you drew on the board you were given instead of a copy'"
            },
            {
                "name": "A piece hanging above the top does not crash",
                "code": "piece = create_piece('I')\npiece['x'], piece['y'] = 3, -1\nmerge_piece_into_board(create_empty_board(10, 20), piece)"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Pieces now land and stack up, and your rows clear."
        }
    },
    {
        "id": "drop_distance",
        "fnName": "drop_distance",
        "title": "How far can it fall?",
        "adds": "The landing shadow appears and the hard drop works.",
        "intro": "<p>Players want to see where a piece will land before letting go, and the space bar needs to slam it all the way down. Both need the same number.</p>",
        "spec": {
            "input": "board - the field. piece - the falling piece.",
            "output": "a whole number; 0 means it is already resting on something",
            "algorithm": [
                "Start with distance = 0.",
                "While the piece moved down (distance + 1) rows can still be placed, add 1.",
                "Return distance."
            ]
        },
        "starter": "def drop_distance(board, piece):\n    distance = 0\n    # keep testing one row lower while it still fits\n    return distance\n",
        "answer": "def drop_distance(board, piece):\n    distance = 0\n    while can_place_piece(board, move_piece(piece, 0, distance + 1)):\n        distance += 1\n    return distance\n",
        "hints": [
            "move_piece(piece, 0, n) gives a copy moved n rows down.",
            "The while condition is: can_place_piece(board, move_piece(piece, 0, distance + 1))",
            "Check distance + 1 (the NEXT row down). Checking distance alone loops for ever!"
        ],
        "tests": [
            {
                "name": "From the top of an empty board an O piece falls 18 rows",
                "code": "piece = create_piece('O')\npiece['x'], piece['y'] = 4, 0\ngot = drop_distance(create_empty_board(10, 20), piece)\nassert got == 18, f'gave {got}'"
            },
            {
                "name": "A piece already on the floor cannot fall",
                "code": "piece = create_piece('O')\npiece['x'], piece['y'] = 4, 18\nassert drop_distance(create_empty_board(10, 20), piece) == 0"
            },
            {
                "name": "It stops on top of the pile",
                "code": "board = create_empty_board(10, 20)\nboard[19][4] = 1\nboard[19][5] = 1\npiece = create_piece('O')\npiece['x'], piece['y'] = 4, 0\ngot = drop_distance(board, piece)\nassert got == 17, f'gave {got}, expected 17'"
            },
            {
                "name": "The piece itself is not moved",
                "code": "piece = create_piece('O')\npiece['x'], piece['y'] = 4, 0\ndrop_distance(create_empty_board(10, 20), piece)\nassert piece['y'] == 0, f'the piece jumped to row {piece[\"y\"]}'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "See the grey landing shadow? That is your function. Press Drop to slam the piece down."
        }
    },
    {
        "id": "score_for_lines",
        "fnName": "score_for_lines",
        "title": "Count the points",
        "adds": "Clearing rows finally scores!",
        "intro": "<p>Tetris rewards greed: four rows at once is worth eight times as much as one row.</p><table class=\"score-table\"><tr><th>Rows</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr><tr><th>Points</th><td>0</td><td>100</td><td>300</td><td>500</td><td>800</td></tr></table><p>A Python list makes a perfect lookup table: the number of lines IS the index.</p>",
        "spec": {
            "input": "line_count - rows cleared at once (0 to 4). level - the current level.",
            "output": "the points to add",
            "algorithm": [
                "Put the five base scores in a list: [0, 100, 300, 500, 800].",
                "Look up the one at position line_count.",
                "Multiply by level and return it."
            ]
        },
        "starter": "def score_for_lines(line_count, level):\n    # a lookup table, then multiply by the level\n    pass\n",
        "answer": "def score_for_lines(line_count, level):\n    table = [0, 100, 300, 500, 800]\n    return table[line_count] * level\n",
        "hints": [
            "A list is a lookup table: table = [0, 100, 300, 500, 800]",
            "table[2] is 300 - the number of lines is the index.",
            "Do not forget the * level at the end."
        ],
        "tests": [
            {
                "name": "No lines, no points",
                "code": "assert score_for_lines(0, 1) == 0"
            },
            {
                "name": "One line on level 1 is 100",
                "code": "got = score_for_lines(1, 1)\nassert got == 100, f'gave {got}'"
            },
            {
                "name": "Two lines on level 1 is 300",
                "code": "assert score_for_lines(2, 1) == 300"
            },
            {
                "name": "Three lines on level 1 is 500",
                "code": "assert score_for_lines(3, 1) == 500"
            },
            {
                "name": "Four lines on level 1 is 800",
                "code": "assert score_for_lines(4, 1) == 800"
            },
            {
                "name": "Four lines on level 3 is 2400",
                "code": "got = score_for_lines(4, 3)\nassert got == 2400, f'gave {got}'"
            },
            {
                "name": "One line on level 7 is 700",
                "code": "assert score_for_lines(1, 7) == 700"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Clear a row and watch the score climb. Try clearing two at once!"
        }
    },
    {
        "id": "level_for_lines",
        "fnName": "level_for_lines",
        "title": "Level up",
        "adds": "Every 10 lines the level goes up.",
        "intro": "<p>Rows 0-9 are level 1, rows 10-19 are level 2, and so on. Python's <code>//</code> is whole-number divide, which does the rounding for you.</p>",
        "spec": {
            "input": "total_lines - rows cleared in the whole game",
            "output": "the level number, starting at 1",
            "algorithm": [
                "Divide total_lines by 10 with // (whole-number divide).",
                "Add 1 and return it."
            ]
        },
        "starter": "def level_for_lines(total_lines):\n    # every 10 lines is one level, and we start at level 1\n    pass\n",
        "answer": "def level_for_lines(total_lines):\n    return total_lines // 10 + 1\n",
        "hints": [
            "7 // 10 is 0, and 23 // 10 is 2.",
            "The whole function is one line.",
            "If you forget the + 1 the game starts on level 0 and never moves."
        ],
        "tests": [
            {
                "name": "No lines cleared yet is level 1",
                "code": "got = level_for_lines(0)\nassert got == 1, f'gave {got}'"
            },
            {
                "name": "9 lines is still level 1",
                "code": "assert level_for_lines(9) == 1"
            },
            {
                "name": "10 lines becomes level 2",
                "code": "got = level_for_lines(10)\nassert got == 2, f'gave {got}'"
            },
            {
                "name": "19 lines is still level 2",
                "code": "assert level_for_lines(19) == 2"
            },
            {
                "name": "35 lines is level 4",
                "code": "assert level_for_lines(35) == 4"
            },
            {
                "name": "100 lines is level 11",
                "code": "assert level_for_lines(100) == 11"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "The LEVEL box now works."
        }
    },
    {
        "id": "drop_interval_for_level",
        "fnName": "drop_interval_for_level",
        "title": "Make it faster",
        "adds": "Higher levels really do fall faster.",
        "intro": "<p>The level sets how long the game waits between steps down: 800 milliseconds on level 1, 65 ms less each level - but never faster than 90 ms, or the game would be impossible.</p><p>Python's <code>max()</code> writes that floor in one word.</p>",
        "spec": {
            "input": "level - the level number",
            "output": "milliseconds to wait between steps down",
            "algorithm": [
                "Work out 800 - (level - 1) * 65.",
                "Return the bigger of that and 90, using max()."
            ]
        },
        "starter": "def drop_interval_for_level(level):\n    # 800 ms at level 1, 65 ms quicker each level, never below 90\n    pass\n",
        "answer": "def drop_interval_for_level(level):\n    return max(90, 800 - (level - 1) * 65)\n",
        "hints": [
            "max(90, something) gives 90 whenever something has dropped below it.",
            "Level 1 must give exactly 800, so the sum uses (level - 1).",
            "An if statement works just as well if you prefer."
        ],
        "tests": [
            {
                "name": "Level 1 waits 800 ms",
                "code": "got = drop_interval_for_level(1)\nassert got == 800, f'gave {got}'"
            },
            {
                "name": "Level 2 waits 735 ms",
                "code": "assert drop_interval_for_level(2) == 735"
            },
            {
                "name": "Level 5 waits 540 ms",
                "code": "assert drop_interval_for_level(5) == 540"
            },
            {
                "name": "Level 12 has hit the floor of 90 ms",
                "code": "got = drop_interval_for_level(12)\nassert got == 90, f'gave {got}'"
            },
            {
                "name": "Level 30 never goes below 90 ms",
                "code": "assert drop_interval_for_level(30) == 90"
            },
            {
                "name": "It never returns a negative number",
                "code": "for level in range(1, 51):\n    assert drop_interval_for_level(level) >= 90, f'level {level} gave {drop_interval_for_level(level)}'"
            }
        ],
        "demo": {
            "kind": "game",
            "flags": {
                "levelPicker": true
            },
            "caption": "Use the level buttons to feel your speed curve."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Wire up the keyboard",
        "adds": "You can play with the keyboard - the game is finished!",
        "intro": "<p>The browser hands us a key name like <code>\"ArrowLeft\"</code>; the game needs the name of an action.</p><p>JavaScript needed a row of ifs. In Python a <strong>dictionary is the lookup table</strong>, and <code>.get()</code> hands back <code>None</code> for anything missing.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"left\", \"right\", \"soft_drop\", \"rotate_right\", \"rotate_left\", \"hard_drop\", \"pause\", \"restart\" - or None",
            "algorithm": [
                "Lowercase the key: str(key).lower().",
                "ArrowLeft/a -> left, ArrowRight/d -> right, ArrowDown/s -> soft_drop",
                "ArrowUp/w/x -> rotate_right, z -> rotate_left, space -> hard_drop",
                "p -> pause, r -> restart, anything else -> None."
            ]
        },
        "starter": "def action_for_key(key):\n    k = str(key).lower()\n    # a dictionary from key names to action names, then .get(k)\n    pass\n",
        "answer": "def action_for_key(key):\n    k = str(key).lower()\n    keys = {\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"arrowdown\": \"soft_drop\", \"s\": \"soft_drop\",\n        \"arrowup\": \"rotate_right\", \"w\": \"rotate_right\", \"x\": \"rotate_right\",\n        \"z\": \"rotate_left\",\n        \" \": \"hard_drop\", \"spacebar\": \"hard_drop\",\n        \"p\": \"pause\",\n        \"r\": \"restart\",\n    }\n    return keys.get(k)\n",
        "hints": [
            "Lowercase first so \"A\" and \"a\" behave the same.",
            "Several keys can share an action - just put them all in the dictionary.",
            "keys.get(k) returns None when the key is not there."
        ],
        "tests": [
            {
                "name": "ArrowLeft moves left",
                "code": "got = action_for_key('ArrowLeft')\nassert got == 'left', f'gave {got!r}'"
            },
            {
                "name": "The letter A also moves left",
                "code": "assert action_for_key('a') == 'left'"
            },
            {
                "name": "A capital A works too",
                "code": "got = action_for_key('A')\nassert got == 'left', f'gave {got!r} - did you lowercase the key?'"
            },
            {
                "name": "ArrowRight moves right",
                "code": "assert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "ArrowDown is the soft drop",
                "code": "assert action_for_key('ArrowDown') == 'soft_drop'"
            },
            {
                "name": "ArrowUp rotates right",
                "code": "assert action_for_key('ArrowUp') == 'rotate_right'"
            },
            {
                "name": "Z rotates the other way",
                "code": "assert action_for_key('z') == 'rotate_left'"
            },
            {
                "name": "The space bar hard drops",
                "code": "assert action_for_key(' ') == 'hard_drop'"
            },
            {
                "name": "P pauses",
                "code": "assert action_for_key('p') == 'pause'"
            },
            {
                "name": "R restarts",
                "code": "assert action_for_key('r') == 'restart'"
            },
            {
                "name": "An unused key gives None",
                "code": "got = action_for_key('q')\nassert got is None, f'gave {got!r}'"
            },
            {
                "name": "Enter is not one of ours either",
                "code": "assert action_for_key('Enter') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then play with the keyboard. Every function here is yours."
        },
        "warning": "Return None (not False, not \"none\") for keys the game does not use."
    }
];
