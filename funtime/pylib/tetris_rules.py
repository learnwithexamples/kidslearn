"""tetris_rules.py - the rules of Tetris, written in Python.

The same game as funtime/tetris.html, but this version is Python running in
your browser through Pyodide.

A BOARD is a list of rows of numbers - 0 is empty, 1 is a locked block:

    board[row][column]        row 0 = top, row 19 = bottom
                              column 0 = left wall, column 9 = right wall

A PIECE is a dictionary holding a small square grid and where its top-left
corner sits on the board:

    {"type": "T", "cells": [[0,1,0],[1,1,1],[0,0,0]], "x": 4, "y": 0}
"""

import random

BOARD_WIDTH = 10
BOARD_HEIGHT = 20

# The seven tetrominoes. Each one is made of exactly four blocks.
SHAPES = {
    "I": [[0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]],
    "O": [[1, 1],
          [1, 1]],
    "T": [[0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]],
    "S": [[0, 1, 1],
          [1, 1, 0],
          [0, 0, 0]],
    "Z": [[1, 1, 0],
          [0, 1, 1],
          [0, 0, 0]],
    "J": [[1, 0, 0],
          [1, 1, 1],
          [0, 0, 0]],
    "L": [[0, 0, 1],
          [1, 1, 1],
          [0, 0, 0]],
}

SHAPE_TYPES = ["I", "O", "T", "S", "Z", "J", "L"]

# The sideways nudges to try when a rotation does not quite fit.
WALL_KICKS = [0, -1, 1, -2, 2]


def copy_matrix(matrix):
    """Make a brand-new copy of a grid.

    INPUT:  matrix - a list of rows
    OUTPUT: a new list of new rows
    ALGORITHM: copy each row with row[:] - a slice of the whole thing.
    """
    return [row[:] for row in matrix]


def create_empty_board(width, height):
    """Build a fresh, empty playing field.

    INPUT:  width, height
    OUTPUT: a list of `height` rows, each a list of `width` zeros
    ALGORITHM: build one row of zeros per line of the field.

    NOTE: write [0] * width inside the loop. Writing row = [0] * width once and
    reusing it would give every line the SAME row, and changing one would
    change them all.
    """
    return [[0] * width for _ in range(height)]


def rotate_matrix_clockwise(matrix):
    """Turn a square grid a quarter turn to the right.

    INPUT:  matrix - a square grid, N x N
    OUTPUT: a NEW grid, turned 90 degrees clockwise
    ALGORITHM: answer[r][c] = matrix[N - 1 - c][r]

    EXAMPLE (the T piece turning to point right):
        [0,1,0]        [0,1,0]
        [1,1,1]  -->   [0,1,1]
        [0,0,0]        [0,1,0]
    """
    size = len(matrix)
    return [[matrix[size - 1 - c][r] for c in range(size)] for r in range(size)]


def center_long_bar(cells):
    """Put the I piece's bar back in the middle of its box.

    INPUT:  cells - a piece grid that has just been rotated
    OUTPUT: the same grid, or a new one with a lone bar slid back to the middle
    ALGORITHM: only 4 x 4 grids need this. Find which rows and columns hold
    blocks; if every block is in ONE row, slide it to row 1, and if every block
    is in ONE column, slide it to column 1.

    WHY: a 3 x 3 piece turns around its middle square, but a 4 x 4 box has no
    middle square - so the bar lands on the far side of the centre every
    quarter turn, and turning twice would visibly move the piece.
    """
    size = len(cells)
    if size != 4:
        return cells

    filled_rows = sorted({r for r in range(size) for c in range(size) if cells[r][c] == 1})
    filled_columns = sorted({c for r in range(size) for c in range(size) if cells[r][c] == 1})

    shift_rows = 1 - filled_rows[0] if len(filled_rows) == 1 else 0
    shift_columns = 1 - filled_columns[0] if len(filled_columns) == 1 else 0
    if shift_rows == 0 and shift_columns == 0:
        return cells

    result = create_empty_board(size, size)
    for r in range(size):
        for c in range(size):
            if cells[r][c] == 1:
                new_row = r + shift_rows
                new_column = c + shift_columns
                if 0 <= new_row < size and 0 <= new_column < size:
                    result[new_row][new_column] = 1
    return result


def create_piece(piece_type):
    """Build a falling piece from a shape name.

    INPUT:  piece_type - one of SHAPE_TYPES
    OUTPUT: a piece dictionary with its own copy of the shape
    """
    return {"type": piece_type, "cells": copy_matrix(SHAPES[piece_type]), "x": 0, "y": 0}


def move_piece(piece, dx, dy):
    """A copy of a piece, shifted.

    INPUT:  piece, dx (sideways), dy (down)
    OUTPUT: a NEW piece at the new place; the old one is untouched
    """
    moved = dict(piece)
    moved["cells"] = copy_matrix(piece["cells"])
    moved["x"] = piece["x"] + dx
    moved["y"] = piece["y"] + dy
    return moved


def rotate_piece(piece, clockwise=True):
    """A copy of a piece, turned a quarter turn.

    INPUT:  piece, clockwise
    OUTPUT: a NEW turned piece at the same x and y
    ALGORITHM: rotate the grid (three times for anti-clockwise), then slide a
    lone bar back to the middle so the I piece does not creep.
    """
    turned = move_piece(piece, 0, 0)
    cells = piece["cells"]
    turns = 1 if clockwise else 3
    for _ in range(turns):
        cells = rotate_matrix_clockwise(cells)
    turned["cells"] = center_long_bar(cells)
    return turned


def piece_blocks(piece):
    """Where are this piece's four blocks on the board?

    INPUT:  piece
    OUTPUT: a list of (x, y) positions
    ALGORITHM: walk the grid and note every square holding a 1, adding the
    piece's own position.
    """
    return [(piece["x"] + c, piece["y"] + r)
            for r, row in enumerate(piece["cells"])
            for c, value in enumerate(row)
            if value == 1]


def is_cell_filled(board, x, y):
    """Is there already a locked block in this square?

    INPUT:  board, x, y. OUTPUT: True or False.
    ALGORITHM: squares above the top count as empty; otherwise look it up.
    """
    if y < 0:
        return False
    if not (0 <= x < len(board[0]) and 0 <= y < len(board)):
        return False
    return board[y][x] == 1


def can_place_piece(board, piece):
    """May this piece sit exactly here?

    INPUT:  board, piece
    OUTPUT: True if all four blocks land on free squares
    ALGORITHM: every block must be inside the side walls, above the floor, and
    on a square that is not already taken.
    """
    for x, y in piece_blocks(piece):
        if x < 0 or x >= len(board[0]):
            return False
        if y >= len(board):
            return False
        if is_cell_filled(board, x, y):
            return False
    return True


def merge_piece_into_board(board, piece):
    """Stamp a piece permanently onto the field.

    INPUT:  board, piece
    OUTPUT: a NEW board with the piece's blocks turned into 1s
    """
    result = copy_matrix(board)
    for x, y in piece_blocks(piece):
        if 0 <= y < len(result) and 0 <= x < len(result[0]):
            result[y][x] = 1
    return result


def is_row_full(row):
    """Is this row completely packed with blocks?

    INPUT:  row - one row of the board
    OUTPUT: True if every square is 1
    ALGORITHM: Python's all() asks "is this true of every item?" in one word.
    """
    return all(value == 1 for value in row)


def find_full_rows(board):
    """Which rows are ready to be cleared?

    INPUT:  board
    OUTPUT: a list of row numbers, top first
    ALGORITHM: check every row and keep the numbers of the full ones.
    """
    return [y for y, row in enumerate(board) if is_row_full(row)]


def remove_rows(board, row_numbers):
    """Delete some rows and let everything above fall down.

    INPUT:  board, row_numbers - the rows to delete
    OUTPUT: a NEW board of the same size, with empty rows added on top
    ALGORITHM: keep the rows we are not deleting, then put new empty rows at
    the FRONT until the field is the right height again.
    """
    height = len(board)
    width = len(board[0])
    kept = [row[:] for y, row in enumerate(board) if y not in row_numbers]
    while len(kept) < height:
        kept.insert(0, [0] * width)
    return kept


def drop_distance(board, piece):
    """How many rows can this piece still fall?

    INPUT:  board, piece
    OUTPUT: a whole number; 0 means it is already resting on something
    ALGORITHM: keep testing one row lower while the piece still fits.
    """
    distance = 0
    while can_place_piece(board, move_piece(piece, 0, distance + 1)):
        distance += 1
    return distance


def score_for_lines(line_count, level):
    """How many points is a line clear worth?

    INPUT:  line_count (0 to 4), level
    OUTPUT: points
    ALGORITHM: look the base score up in a list, then multiply by the level.
    """
    table = [0, 100, 300, 500, 800]
    return table[line_count] * level


def level_for_lines(total_lines):
    """Which level does this many cleared lines earn?

    INPUT:  total_lines. OUTPUT: the level, starting at 1.
    """
    return total_lines // 10 + 1


def drop_interval_for_level(level):
    """How long between automatic steps down, in milliseconds?

    INPUT:  level. OUTPUT: milliseconds.
    ALGORITHM: 800 ms at level 1, 65 ms quicker each level, never below 90.
    """
    return max(90, 800 - (level - 1) * 65)


def create_shuffled_bag():
    """A shuffled list of all seven shapes.

    INPUT:  nothing. OUTPUT: the seven names in random order.
    ALGORITHM: copy the list and let random.shuffle do the work - the same
    Fisher-Yates shuffle the JavaScript version writes out by hand.
    """
    bag = SHAPE_TYPES[:]
    random.shuffle(bag)
    return bag


def create_game():
    """Start a brand-new game.

    INPUT:  nothing. OUTPUT: the game state dictionary.
    """
    state = {
        "board": create_empty_board(BOARD_WIDTH, BOARD_HEIGHT),
        "piece": None,
        "bag": create_shuffled_bag(),
        "next_type": None,
        "score": 0,
        "lines": 0,
        "level": 1,
        "drop_timer": 0,
        "is_over": False,
        "is_paused": False,
    }
    state["next_type"] = take_from_bag(state)
    spawn_piece(state)
    return state


def take_from_bag(state):
    """The next shape name, refilling the bag when it runs out.

    INPUT:  state. OUTPUT: a shape name.
    """
    if not state["bag"]:
        state["bag"] = create_shuffled_bag()
    return state["bag"].pop(0)


def spawn_piece(state):
    """Bring the next piece into play at the top of the board.

    INPUT:  state. OUTPUT: nothing.
    ALGORITHM: build the piece, centre it, take a new next_type from the bag,
    and end the game if the piece cannot fit where it is born.
    """
    piece = create_piece(state["next_type"])
    piece["x"] = (BOARD_WIDTH - len(piece["cells"])) // 2
    piece["y"] = 0

    state["next_type"] = take_from_bag(state)
    state["piece"] = piece
    state["drop_timer"] = 0

    if not can_place_piece(state["board"], piece):
        state["is_over"] = True


def try_move(state, dx, dy):
    """Try to slide the falling piece.

    INPUT:  state, dx, dy
    OUTPUT: True if the move happened
    ALGORITHM: try it on a copy first, and keep the copy only if it fits.
    """
    if state["piece"] is None or state["is_over"] or state["is_paused"]:
        return False
    moved = move_piece(state["piece"], dx, dy)
    if can_place_piece(state["board"], moved):
        state["piece"] = moved
        return True
    return False


def try_rotate(state, clockwise=True):
    """Try to turn the falling piece, nudging it away from walls.

    INPUT:  state, clockwise
    OUTPUT: True if the piece turned
    ALGORITHM: rotate a copy, then try each nudge in WALL_KICKS until one fits.
    """
    if state["piece"] is None or state["is_over"] or state["is_paused"]:
        return False
    turned = rotate_piece(state["piece"], clockwise)
    for kick in WALL_KICKS:
        candidate = move_piece(turned, kick, 0)
        if can_place_piece(state["board"], candidate):
            state["piece"] = candidate
            return True
    return False


def lock_piece(state):
    """The piece has landed: freeze it and clear any full rows.

    INPUT:  state. OUTPUT: nothing.
    """
    state["board"] = merge_piece_into_board(state["board"], state["piece"])

    full_rows = find_full_rows(state["board"])
    if full_rows:
        state["board"] = remove_rows(state["board"], full_rows)
        state["lines"] += len(full_rows)
        state["score"] += score_for_lines(len(full_rows), state["level"])
        state["level"] = level_for_lines(state["lines"])

    spawn_piece(state)


def soft_drop(state):
    """Push the piece down one row, or lock it if it cannot move.

    INPUT:  state. OUTPUT: nothing.
    """
    if state["piece"] is None or state["is_over"] or state["is_paused"]:
        return
    if try_move(state, 0, 1):
        state["score"] += 1
        state["drop_timer"] = 0
    else:
        lock_piece(state)


def hard_drop(state):
    """Slam the piece straight to the bottom.

    INPUT:  state. OUTPUT: nothing.
    ALGORITHM: fall by drop_distance rows, score 2 points a row, then lock.
    """
    if state["piece"] is None or state["is_over"] or state["is_paused"]:
        return
    distance = drop_distance(state["board"], state["piece"])
    state["piece"] = move_piece(state["piece"], 0, distance)
    state["score"] += distance * 2
    lock_piece(state)


def update_game(state, elapsed_ms):
    """Let time pass (called about 60 times a second).

    INPUT:  state, elapsed_ms. OUTPUT: nothing.
    ALGORITHM: add the time to the timer; each time it passes this level's
    interval, step the piece down - or lock it if it cannot fall.
    """
    if state["is_over"] or state["is_paused"] or state["piece"] is None:
        return

    interval = drop_interval_for_level(state["level"])
    state["drop_timer"] += elapsed_ms

    while state["drop_timer"] >= interval:
        state["drop_timer"] -= interval
        if not try_move(state, 0, 1):
            lock_piece(state)
            return


def get_ghost_piece(state):
    """Where would the piece land if you dropped it now?

    INPUT:  state. OUTPUT: a piece at the landing spot, or None.
    """
    if state["piece"] is None:
        return None
    return move_piece(state["piece"], 0, drop_distance(state["board"], state["piece"]))


def toggle_pause(state):
    """Freeze or unfreeze the game.

    INPUT:  state. OUTPUT: nothing.
    """
    if state["is_over"]:
        return
    state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into the name of a game action.

    INPUT:  key. OUTPUT: an action name, or None.
    """
    keys = {
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        "arrowdown": "soft_drop", "s": "soft_drop",
        "arrowup": "rotate_right", "w": "rotate_right", "x": "rotate_right",
        "z": "rotate_left",
        " ": "hard_drop", "spacebar": "hard_drop",
        "p": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
