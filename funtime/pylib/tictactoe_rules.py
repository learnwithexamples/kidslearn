"""tictactoe_rules.py - the rules of Tic-Tac-Toe, in Python.

Nine squares, stored as one flat list. Each holds "" (empty), "X" (you) or
"O" (the computer).

    0 | 1 | 2
    3 | 4 | 5
    6 | 7 | 8
"""

import random

GRID_SIZE = 3
SQUARE_COUNT = GRID_SIZE * GRID_SIZE

PLAYER = "X"
COMPUTER = "O"
EMPTY = ""

WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
]


def square_index(column, row):
    """Turn a column and row into a place in the list (0 to 8)."""
    return row * GRID_SIZE + column


def empty_squares(board):
    """Which squares can still be played?

    INPUT:  board. OUTPUT: a list of the index numbers that are still empty.
    ALGORITHM: enumerate() gives the number and the mark together.
    """
    return [index for index, mark in enumerate(board) if mark == EMPTY]


def place_mark(board, index, mark):
    """Put an X or an O on the board.

    INPUT:  board, index, mark. OUTPUT: a NEW board with the mark added.
    ALGORITHM: copy the list and set that square, but only if it was empty.
    """
    next_board = list(board)
    if next_board[index] == EMPTY:
        next_board[index] = mark
    return next_board


def winning_line(board):
    """Has somebody made three in a row?

    INPUT:  board. OUTPUT: the winning line as a list, or None.
    ALGORITHM: try each of the eight lines; a line wins when its first square
    is not empty and all three squares hold the same mark.
    """
    for line in WINNING_LINES:
        first = board[line[0]]
        if first != EMPTY and first == board[line[1]] == board[line[2]]:
            return line
    return None


def is_draw(board):
    """Is the game a draw?

    INPUT:  board. OUTPUT: True when the board is full and nobody has won.
    """
    return not empty_squares(board) and winning_line(board) is None


def computer_move(board):
    """Where should the computer play?

    INPUT:  board. OUTPUT: the index to play, or -1 if the board is full.
    ALGORITHM: win if you can; block if you must; then the middle, a corner,
    and finally anything left.
    """
    free = empty_squares(board)
    if not free:
        return -1

    for index in free:
        if winning_line(place_mark(board, index, COMPUTER)) is not None:
            return index
    for index in free:
        if winning_line(place_mark(board, index, PLAYER)) is not None:
            return index
    if board[4] == EMPTY:
        return 4
    corners = [corner for corner in (0, 2, 6, 8) if board[corner] == EMPTY]
    if corners:
        return random.choice(corners)
    return random.choice(free)


def create_game():
    """Start a brand-new game."""
    return {
        "board": [EMPTY] * SQUARE_COUNT,
        "cursor": {"column": 1, "row": 1},
        "winner": None,
        "line": None,
        "wins": 0,
        "losses": 0,
        "draws": 0,
        "is_over": False,
        "is_paused": False,
    }


def finish_if_over(state):
    """Has the game just ended? Sets winner, line and is_over."""
    line = winning_line(state["board"])
    if line is not None:
        state["line"] = line
        state["winner"] = state["board"][line[0]]
        state["is_over"] = True
        if state["winner"] == PLAYER:
            state["wins"] += 1
        else:
            state["losses"] += 1
    elif is_draw(state["board"]):
        state["winner"] = "draw"
        state["is_over"] = True
        state["draws"] += 1


def play_square(state, index):
    """The player's move, followed by the computer's reply."""
    if state["is_over"] or state["is_paused"] or state["board"][index] != EMPTY:
        return False

    state["board"] = place_mark(state["board"], index, PLAYER)
    finish_if_over(state)

    if not state["is_over"]:
        reply = computer_move(state["board"])
        if reply >= 0:
            state["board"] = place_mark(state["board"], reply, COMPUTER)
            finish_if_over(state)
    return True


def next_round(state):
    """Clear the board but keep the score."""
    state["board"] = [EMPTY] * SQUARE_COUNT
    state["winner"] = None
    state["line"] = None
    state["is_over"] = False


def move_cursor(state, dx, dy):
    """Move the keyboard cursor, staying on the board."""
    column = state["cursor"]["column"] + dx
    row = state["cursor"]["row"] + dy
    if 0 <= column < GRID_SIZE and 0 <= row < GRID_SIZE:
        state["cursor"]["column"] = column
        state["cursor"]["row"] = row


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "play", "spacebar": "play", "enter": "play",
        "p": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
