"""twenty48_rules.py - the rules of 2048, in Python.

Slide all the tiles one way. Two equal tiles that bump into each other join
into one worth double. A new tile appears. Reach 2048.

The big idea in this file: there is only ONE move function. Sliding LEFT is
written properly, and the other three directions are done by turning the board
round, sliding left, and turning it back. Four moves for the price of one -
and only one place for a bug to hide.
"""

import random

SIZE = 4
CELL_COUNT = SIZE * SIZE
WINNING_TILE = 2048


def cell_index(column, row):
    """Turn a column and row into a place in the flat list of tiles."""
    return row * SIZE + column


def empty_board():
    """Sixteen empty squares."""
    return [0] * CELL_COUNT


def get_row(board, row):
    """The four numbers in one row, as a list."""
    return board[row * SIZE:row * SIZE + SIZE]


def set_row(board, row, values):
    """Write four numbers back into one row."""
    for column in range(SIZE):
        board[cell_index(column, row)] = values[column]


def empty_cells(board):
    """Where could a new tile go? A list of the places still holding 0."""
    return [i for i, value in enumerate(board) if value == 0]


def add_tile(board):
    """Drop a new tile into a random empty square.

    ALGORITHM: pick one of the empty squares at random and put a 2 in it -
    except one time in ten, when it is a 4. That occasional 4 is what stops
    the game from being completely predictable.
    """
    empty = empty_cells(board)
    if not empty:
        return False
    board[random.choice(empty)] = 2 if random.random() < 0.9 else 4
    return True


def slide_row(row):
    """Push the numbers in one row to the left.

    OUTPUT: a NEW list, the same numbers, all the gaps at the right.
    ALGORITHM: keep the numbers that are not 0, in order, then pad with 0.
    Nothing joins up here - that is the next function's job.
    """
    packed = [value for value in row if value != 0]
    return packed + [0] * (SIZE - len(packed))


def merge_row(row):
    """Join up equal neighbours in a row that has already been slid.

    OUTPUT: (the new row, the points scored).
    ALGORITHM: walk along the row. If this number equals the next one, replace
    them with one tile of double the value and step PAST both. If not, keep it
    and step on by one. Pad with 0 at the end.

    WHY step past both: it stops a row of four 2s becoming a single 8. The
    correct answer is two 4s - each tile may only join once per move.
    """
    result = []
    gained = 0
    i = 0

    while i < len(row):
        if row[i] != 0 and i + 1 < len(row) and row[i] == row[i + 1]:
            joined = row[i] * 2
            result.append(joined)
            gained += joined
            i += 2
        else:
            result.append(row[i])
            i += 1

    return result + [0] * (SIZE - len(result)), gained


def move_left(board):
    """Slide and join the whole board to the left.

    OUTPUT: (a NEW board, the points scored).
    """
    result = empty_board()
    gained = 0

    for row in range(SIZE):
        new_row, points = merge_row(slide_row(get_row(board, row)))
        set_row(result, row, new_row)
        gained += points
    return result, gained


def rotate_board(board):
    """Turn the whole board a quarter turn clockwise.

    ALGORITHM: the square that ends up at (column, row) is the one that
    started at (row, SIZE - 1 - column). Draw it on paper once and it will
    make sense for ever.
    """
    turned = empty_board()
    for row in range(SIZE):
        for column in range(SIZE):
            turned[cell_index(column, row)] = board[cell_index(row, SIZE - 1 - column)]
    return turned


def turns_for_direction(direction):
    """How many quarter turns make this direction into 'left'."""
    return {"left": 0, "down": 1, "right": 2, "up": 3}[direction]


def move_board(board, direction):
    """Slide the board in any of the four directions.

    OUTPUT: (the new board, the points scored).
    ALGORITHM: turn the board until the direction you want is pointing left,
    do the one move you have written properly, then turn it back the rest of
    the way round. Four turns is a full circle, so the board always comes back
    the right way up.
    """
    turns = turns_for_direction(direction)

    work = board
    for _ in range(turns):
        work = rotate_board(work)

    work, gained = move_left(work)

    for _ in range((SIZE - turns) % SIZE):
        work = rotate_board(work)
    return work, gained


def has_moves(board):
    """Is there anything left to do?

    ALGORITHM: an empty square always means yes. Otherwise look for any two
    neighbours holding the same number - those could still join. Only when
    neither is true is the game really over.
    """
    if empty_cells(board):
        return True
    for row in range(SIZE):
        for column in range(SIZE):
            value = board[cell_index(column, row)]
            if column + 1 < SIZE and board[cell_index(column + 1, row)] == value:
                return True
            if row + 1 < SIZE and board[cell_index(column, row + 1)] == value:
                return True
    return False


def biggest_tile(board):
    """The largest number on the board."""
    return max(board)


def make_move(state, direction):
    """One whole turn of the game.

    OUTPUT: True if anything moved.
    ALGORITHM: slide the board. If nothing moved at all, the turn does not
    count - no score, and no new tile. If something did move, score it, drop a
    new tile in, and see whether the game is finished.
    """
    if state["is_over"] or state["is_paused"]:
        return False
    moved, gained = move_board(state["board"], direction)

    if moved == state["board"]:
        return False

    state["board"] = moved
    state["score"] += gained
    state["moves"] += 1
    add_tile(state["board"])

    if biggest_tile(state["board"]) >= WINNING_TILE:
        state["is_won"] = True
    if not has_moves(state["board"]):
        state["is_over"] = True
    return True


def create_game():
    """A fresh board with two tiles on it."""
    board = empty_board()
    add_tile(board)
    add_tile(board)
    return {
        "board": board,
        "score": 0,
        "moves": 0,
        "is_won": False,
        "is_over": False,
        "is_paused": False,
    }


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def update_game(state, elapsed_ms):
    """2048 has no clock, so a frame changes nothing."""
    return


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        "p": "pause", "r": "restart",
    }
    return keys.get(str(key).lower())
