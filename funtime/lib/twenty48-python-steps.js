/* ============================================================
   twenty48-python-steps.js - the 7 steps of "Build 2048 in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const TWENTY48_PYTHON_STEPS = [
    {
        "id": "slide_row",
        "fnName": "slide_row",
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
        "starter": "def slide_row(row):\n    # close up the gaps - nothing joins yet\n    pass\n",
        "answer": "def slide_row(row):\n    packed = [value for value in row if value != 0]\n    return packed + [0] * (SIZE - len(packed))\n",
        "hints": [
            "[v for v in row if v != 0] collects the tiles.",
            "[0] * n makes a list of n zeros, and + glues two lists together.",
            "return packed + [0] * (SIZE - len(packed))"
        ],
        "tests": [
            {
                "name": "Gaps close up",
                "code": "got = slide_row([2, 0, 2, 4])\nassert got == [2, 2, 4, 0], f'gave {got}'"
            },
            {
                "name": "A row already packed does not change",
                "code": "assert slide_row([2, 4, 8, 16]) == [2, 4, 8, 16]"
            },
            {
                "name": "An empty row stays empty",
                "code": "assert slide_row([0, 0, 0, 0]) == [0, 0, 0, 0]"
            },
            {
                "name": "A lonely tile goes all the way",
                "code": "assert slide_row([0, 0, 0, 2]) == [2, 0, 0, 0]"
            },
            {
                "name": "The order is kept",
                "code": "assert slide_row([0, 8, 0, 2]) == [8, 2, 0, 0]"
            },
            {
                "name": "Nothing joins up yet",
                "code": "assert slide_row([2, 2, 0, 0]) == [2, 2, 0, 0], 'sliding does not merge'"
            },
            {
                "name": "The answer is always four long",
                "code": "assert len(slide_row([2, 0, 0, 0])) == SIZE"
            },
            {
                "name": "The row you were given is left alone",
                "code": "before = [2, 0, 2, 4]\nslide_row(before)\nassert before == [2, 0, 2, 4]"
            }
        ],
        "demo": {
            "kind": "row",
            "caption": "Pick a row and watch what sliding does to it — the middle line is the answer."
        }
    },
    {
        "id": "merge_row",
        "fnName": "merge_row",
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
        "starter": "def merge_row(row):\n    # join equal neighbours - each tile joins at most once\n    return row, 0\n",
        "answer": "def merge_row(row):\n    result = []\n    gained = 0\n    i = 0\n\n    while i < len(row):\n        if row[i] != 0 and i + 1 < len(row) and row[i] == row[i + 1]:\n            joined = row[i] * 2\n            result.append(joined)\n            gained += joined\n            i += 2\n        else:\n            result.append(row[i])\n            i += 1\n\n    return result + [0] * (SIZE - len(result)), gained\n",
        "hints": [
            "A while loop is easier here than a for loop, because i jumps by 1 or 2.",
            "Check i + 1 < len(row) before looking at the next number.",
            "i += 2 after a join is what stops one tile joining twice."
        ],
        "tests": [
            {
                "name": "Two the same become one",
                "code": "row, gained = merge_row([2, 2, 0, 0])\nassert row == [4, 0, 0, 0], f'gave {row}'"
            },
            {
                "name": "Joining scores the new tile's value",
                "code": "assert merge_row([2, 2, 0, 0])[1] == 4"
            },
            {
                "name": "Four the same become TWO tiles, not one",
                "code": "row, gained = merge_row([2, 2, 2, 2])\nassert row == [4, 4, 0, 0], f'gave {row}'\nassert gained == 8"
            },
            {
                "name": "Three the same join only the first two",
                "code": "row, gained = merge_row([4, 4, 4, 0])\nassert row == [8, 4, 0, 0], f'gave {row}'"
            },
            {
                "name": "Different numbers do not join",
                "code": "row, gained = merge_row([2, 4, 8, 16])\nassert row == [2, 4, 8, 16] and gained == 0"
            },
            {
                "name": "Zeros never join with each other",
                "code": "assert merge_row([0, 0, 0, 0])[0] == [0, 0, 0, 0]"
            },
            {
                "name": "A mixed row works",
                "code": "row, gained = merge_row([2, 2, 4, 0])\nassert row == [4, 4, 0, 0] and gained == 4"
            },
            {
                "name": "The answer is always four long",
                "code": "assert len(merge_row([2, 2, 2, 2])[0]) == SIZE"
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
        "fnName": "empty_cells",
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
        "starter": "def empty_cells(board):\n    # the positions holding nothing\n    pass\n",
        "answer": "def empty_cells(board):\n    return [i for i, value in enumerate(board) if value == 0]\n",
        "hints": [
            "enumerate(board) gives the position and the value together.",
            "Collect the POSITIONS, not the values.",
            "return [i for i, value in enumerate(board) if value == 0]"
        ],
        "tests": [
            {
                "name": "A new board has fourteen free squares",
                "code": "board = empty_board()\nadd_tile(board)\nadd_tile(board)\nassert len(empty_cells(board)) == CELL_COUNT - 2"
            },
            {
                "name": "An empty board has sixteen",
                "code": "assert len(empty_cells(empty_board())) == CELL_COUNT"
            },
            {
                "name": "A full board has none",
                "code": "assert empty_cells([2] * CELL_COUNT) == []"
            },
            {
                "name": "It gives back positions, not values",
                "code": "board = empty_board()\nboard[0] = 2\nassert empty_cells(board)[0] == 1"
            },
            {
                "name": "Every position it names really is empty",
                "code": "board = empty_board()\nboard[3] = 4\nboard[9] = 8\nfor i in empty_cells(board):\n    assert board[i] == 0"
            }
        ],
        "demo": {
            "kind": "board",
            "caption": "Slide the practice board about and watch the free-square count."
        }
    },
    {
        "id": "rotate_board",
        "fnName": "rotate_board",
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
        "starter": "def rotate_board(board):\n    turned = empty_board()\n    # (column, row) comes from (row, SIZE - 1 - column)\n    return turned\n",
        "answer": "def rotate_board(board):\n    turned = empty_board()\n    for row in range(SIZE):\n        for column in range(SIZE):\n            turned[cell_index(column, row)] = board[cell_index(row, SIZE - 1 - column)]\n    return turned\n",
        "hints": [
            "Two loops over the NEW board, fetching from the old one.",
            "cell_index(column, row) turns a pair into a position.",
            "turned[cell_index(column, row)] = board[cell_index(row, SIZE - 1 - column)]"
        ],
        "tests": [
            {
                "name": "The top-left corner goes to the top-right",
                "code": "board = empty_board()\nboard[cell_index(0, 0)] = 2\nturned = rotate_board(board)\nassert turned[cell_index(SIZE - 1, 0)] == 2"
            },
            {
                "name": "The top-right goes to the bottom-right",
                "code": "board = empty_board()\nboard[cell_index(SIZE - 1, 0)] = 2\nturned = rotate_board(board)\nassert turned[cell_index(SIZE - 1, SIZE - 1)] == 2"
            },
            {
                "name": "Four turns is a full circle",
                "code": "board = list(range(CELL_COUNT))\nwork = board\nfor _ in range(4):\n    work = rotate_board(work)\nassert work == board"
            },
            {
                "name": "No tile is lost or invented",
                "code": "board = list(range(CELL_COUNT))\nassert sorted(rotate_board(board)) == sorted(board)"
            },
            {
                "name": "A top row becomes a right-hand column",
                "code": "board = empty_board()\nset_row(board, 0, [2, 4, 8, 16])\nturned = rotate_board(board)\nfor row in range(SIZE):\n    assert turned[cell_index(SIZE - 1, row)] == [2, 4, 8, 16][row]"
            },
            {
                "name": "The board you were given is left alone",
                "code": "board = empty_board()\nboard[0] = 2\nrotate_board(board)\nassert board[0] == 2"
            }
        ],
        "demo": {
            "kind": "board",
            "caption": "Press Turn a few times. Four turns bring the board right back."
        }
    },
    {
        "id": "move_board",
        "fnName": "move_board",
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
        "starter": "def move_board(board, direction):\n    # turn, slide left, turn back\n    return board, 0\n",
        "answer": "def move_board(board, direction):\n    turns = turns_for_direction(direction)\n\n    work = board\n    for _ in range(turns):\n        work = rotate_board(work)\n\n    work, gained = move_left(work)\n\n    for _ in range((SIZE - turns) % SIZE):\n        work = rotate_board(work)\n    return work, gained\n",
        "hints": [
            "turns_for_direction and move_left are both written for you.",
            "The turns before and after must add up to four - a full circle.",
            "(SIZE - turns) % SIZE handles the left case, where turns is 0."
        ],
        "tests": [
            {
                "name": "Sliding left packs tiles to the left",
                "code": "board = empty_board()\nboard[cell_index(2, 1)] = 2\nout, _ = move_board(board, 'left')\nassert out[cell_index(0, 1)] == 2"
            },
            {
                "name": "Sliding right packs them to the right",
                "code": "board = empty_board()\nboard[cell_index(1, 1)] = 2\nout, _ = move_board(board, 'right')\nassert out[cell_index(SIZE - 1, 1)] == 2"
            },
            {
                "name": "Sliding up packs them to the top",
                "code": "board = empty_board()\nboard[cell_index(1, 2)] = 2\nout, _ = move_board(board, 'up')\nassert out[cell_index(1, 0)] == 2"
            },
            {
                "name": "Sliding down packs them to the bottom",
                "code": "board = empty_board()\nboard[cell_index(1, 1)] = 2\nout, _ = move_board(board, 'down')\nassert out[cell_index(1, SIZE - 1)] == 2"
            },
            {
                "name": "Tiles still join in every direction",
                "code": "for direction in ('left', 'right', 'up', 'down'):\n    board = empty_board()\n    set_row(board, 0, [2, 2, 0, 0])\n    set_row(board, 1, [2, 2, 0, 0])\n    _, gained = move_board(board, direction)\n    assert gained > 0, f'nothing joined when sliding {direction}'"
            },
            {
                "name": "A board with nothing to do does not change",
                "code": "board = empty_board()\nset_row(board, 0, [2, 4, 8, 16])\nset_row(board, 1, [4, 8, 16, 32])\nset_row(board, 2, [2, 4, 8, 16])\nset_row(board, 3, [4, 8, 16, 32])\nout, _ = move_board(board, 'left')\nassert out == board"
            },
            {
                "name": "The board comes back the right way up",
                "code": "board = empty_board()\nboard[cell_index(0, 0)] = 2\nboard[cell_index(1, 0)] = 4\nout, _ = move_board(board, 'left')\nassert out[cell_index(0, 0)] == 2 and out[cell_index(1, 0)] == 4"
            }
        ],
        "demo": {
            "kind": "board",
            "caption": "Slide the practice board every way. One function is doing all four."
        }
    },
    {
        "id": "has_moves",
        "fnName": "has_moves",
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
        "starter": "def has_moves(board):\n    # an empty square, or two equal neighbours\n    pass\n",
        "answer": "def has_moves(board):\n    if empty_cells(board):\n        return True\n    for row in range(SIZE):\n        for column in range(SIZE):\n            value = board[cell_index(column, row)]\n            if column + 1 < SIZE and board[cell_index(column + 1, row)] == value:\n                return True\n            if row + 1 < SIZE and board[cell_index(column, row + 1)] == value:\n                return True\n    return False\n",
        "hints": [
            "Checking for an empty square first saves all the rest of the work.",
            "Only look right and down - every pair gets checked once that way.",
            "Guard the edges with column + 1 < SIZE and row + 1 < SIZE."
        ],
        "tests": [
            {
                "name": "A new game has moves",
                "code": "assert has_moves(create_game()['board']) is True"
            },
            {
                "name": "An empty board has moves",
                "code": "assert has_moves(empty_board()) is True"
            },
            {
                "name": "A full board with a matching pair still has moves",
                "code": "board = [2, 4, 2, 4,\n         4, 2, 4, 2,\n         2, 4, 2, 4,\n         4, 2, 2, 8]\nassert has_moves(board) is True"
            },
            {
                "name": "A properly stuck board has none",
                "code": "board = [2, 4, 2, 4,\n         4, 2, 4, 2,\n         2, 4, 2, 4,\n         4, 2, 4, 2]\nassert has_moves(board) is False"
            },
            {
                "name": "A pair side by side counts",
                "code": "board = [2, 2, 2, 4,\n         4, 8, 4, 2,\n         2, 4, 2, 4,\n         4, 2, 4, 2]\nassert has_moves(board) is True"
            },
            {
                "name": "A pair one above the other counts too",
                "code": "board = [2, 4, 8, 4,\n         2, 8, 4, 2,\n         4, 4, 2, 4,\n         8, 2, 4, 2]\nassert has_moves(board) is True"
            },
            {
                "name": "A real game ends only when it is truly stuck",
                "code": "state = create_game()\nfor _ in range(3000):\n    if state['is_over']:\n        break\n    for d in ('left', 'up', 'right', 'down'):\n        make_move(state, d)\nassert state['is_over'] is False or not has_moves(state['board'])"
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
        "fnName": "action_for_key",
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
        "starter": "def action_for_key(key):\n    keys = {\n        # \"arrowup\": \"up\", ...\n    }\n    return keys.get(str(key).lower())\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"p\": \"pause\", \"r\": \"restart\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "The action names must match the ones move_board expects exactly.",
            "A dictionary is tidier than six ifs.",
            "keys.get(...) gives None for anything not listed."
        ],
        "tests": [
            {
                "name": "The arrows slide the board",
                "code": "assert action_for_key('ArrowUp') == 'up'\nassert action_for_key('ArrowDown') == 'down'\nassert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "WASD works too",
                "code": "assert action_for_key('w') == 'up'\nassert action_for_key('s') == 'down'\nassert action_for_key('a') == 'left'\nassert action_for_key('d') == 'right'"
            },
            {
                "name": "Capital letters work",
                "code": "assert action_for_key('W') == 'up'\nassert action_for_key('R') == 'restart'"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert action_for_key('p') == 'pause'\nassert action_for_key('r') == 'restart'"
            },
            {
                "name": "The names match what the game expects",
                "code": "for key in ('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'):\n    make_move(create_game(), action_for_key(key))"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert action_for_key('z') is None\nassert action_for_key('Enter') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page and play with the arrow keys. How far can you get?"
        }
    }
];
