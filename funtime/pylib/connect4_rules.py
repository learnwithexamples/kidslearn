"""connect4_rules.py - the rules of Connect Four, in Python.

Seven columns, six rows, stored as one flat list of 42 squares holding ""
(empty), "R" (your counter) or "Y" (the computer's). Counters are DROPPED into
a column and fall to the lowest free row.
"""

COLUMNS = 7
ROWS = 6
CELL_COUNT = COLUMNS * ROWS
WIN_LENGTH = 4

PLAYER = "R"
COMPUTER = "Y"
EMPTY = ""

# Across, down, and the two diagonals.
DIRECTIONS = [(1, 0), (0, 1), (1, 1), (1, -1)]


def cell_index(column, row):
    """Turn a column and row into a place in the list (0 to 41)."""
    return row * COLUMNS + column


def is_inside_board(column, row):
    """Is this square on the board?"""
    return 0 <= column < COLUMNS and 0 <= row < ROWS


def drop_row(board, column):
    """Where would a counter land in this column?

    INPUT:  board, column. OUTPUT: the row, or -1 when the column is full.
    ALGORITHM: start at the BOTTOM row and walk upwards; the first empty
    square is where the counter stops.
    """
    for row in range(ROWS - 1, -1, -1):
        if board[cell_index(column, row)] == EMPTY:
            return row
    return -1


def drop_piece(board, column, mark):
    """Drop a counter into a column.

    INPUT:  board, column, mark. OUTPUT: a NEW board.
    """
    row = drop_row(board, column)
    next_board = list(board)
    if row != -1:
        next_board[cell_index(column, row)] = mark
    return next_board


def count_in_direction(board, column, row, dx, dy, mark):
    """How many of my counters run this way?

    INPUT:  board, column, row (not counted), dx, dy, mark
    OUTPUT: how many of that mark are in a row in that direction
    ALGORITHM: step again and again while the square is on the board and holds
    the mark.
    """
    found = 0
    c, r = column + dx, row + dy
    while is_inside_board(c, r) and board[cell_index(c, r)] == mark:
        found += 1
        c += dx
        r += dy
    return found


def is_win_at(board, column, row, mark):
    """Does the counter just dropped here make four in a row?

    ALGORITHM: for each direction, count one way, count the opposite way, and
    add 1 for the counter itself. Four or more anywhere is a win.
    """
    for dx, dy in DIRECTIONS:
        total = (1
                 + count_in_direction(board, column, row, dx, dy, mark)
                 + count_in_direction(board, column, row, -dx, -dy, mark))
        if total >= WIN_LENGTH:
            return True
    return False


def is_board_full(board):
    """Is there nowhere left to play?"""
    return all(drop_row(board, column) == -1 for column in range(COLUMNS))


def playable_columns(board):
    """The columns that still have room."""
    return [column for column in range(COLUMNS) if drop_row(board, column) != -1]


def computer_column(board):
    """Which column should the computer drop into?

    ALGORITHM: win if you can; block if you must; otherwise prefer the middle
    columns, but never hand the player a win on top of your own counter.
    """
    open_columns = playable_columns(board)
    if not open_columns:
        return -1

    for column in open_columns:
        row = drop_row(board, column)
        if is_win_at(drop_piece(board, column, COMPUTER), column, row, COMPUTER):
            return column
    for column in open_columns:
        row = drop_row(board, column)
        if is_win_at(drop_piece(board, column, PLAYER), column, row, PLAYER):
            return column

    middle_first = sorted(open_columns, key=lambda column: abs(column - 3))
    for column in middle_first:
        after = drop_piece(board, column, COMPUTER)
        reply_row = drop_row(after, column)
        if reply_row == -1 or not is_win_at(drop_piece(after, column, PLAYER), column, reply_row, PLAYER):
            return column
    return middle_first[0]


def create_game():
    """Start a brand-new game."""
    return {
        "board": [EMPTY] * CELL_COUNT,
        "cursor": 3,
        "winner": None,
        "wins": 0,
        "losses": 0,
        "draws": 0,
        "is_over": False,
        "is_paused": False,
    }


def play_column(state, column):
    """The player's drop, followed by the computer's reply."""
    if state["is_over"] or state["is_paused"] or drop_row(state["board"], column) == -1:
        return False

    row = drop_row(state["board"], column)
    state["board"] = drop_piece(state["board"], column, PLAYER)
    if is_win_at(state["board"], column, row, PLAYER):
        state["winner"] = PLAYER
        state["is_over"] = True
        state["wins"] += 1
        return True
    if is_board_full(state["board"]):
        state["winner"] = "draw"
        state["is_over"] = True
        state["draws"] += 1
        return True

    reply = computer_column(state["board"])
    row = drop_row(state["board"], reply)
    state["board"] = drop_piece(state["board"], reply, COMPUTER)
    if is_win_at(state["board"], reply, row, COMPUTER):
        state["winner"] = COMPUTER
        state["is_over"] = True
        state["losses"] += 1
    elif is_board_full(state["board"]):
        state["winner"] = "draw"
        state["is_over"] = True
        state["draws"] += 1
    return True


def next_round(state):
    """Clear the board but keep the score."""
    state["board"] = [EMPTY] * CELL_COUNT
    state["winner"] = None
    state["is_over"] = False


def move_cursor(state, dx):
    """Slide the drop marker left or right."""
    column = state["cursor"] + dx
    if 0 <= column < COLUMNS:
        state["cursor"] = column


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "drop", "spacebar": "drop", "enter": "drop", "arrowdown": "drop", "s": "drop",
        "p": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
