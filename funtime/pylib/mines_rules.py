"""mines_rules.py - the rules of Minesweeper, in Python.

A grid with mines hidden in it. Every safe square you uncover tells you how
many mines are touching it, and from those numbers you work out where the
mines must be.

There is no clock and nothing moves. This game is pure thinking - and it
contains the single most useful algorithm in this whole collection: FLOOD
FILL, the thing that opens up a big empty area in one click.
"""

import random

GRID_SIZE = 9
MINE_COUNT = 10
CELL_COUNT = GRID_SIZE * GRID_SIZE


def cell_index(column, row):
    """Turn a column and row into a place in the lists."""
    return row * GRID_SIZE + column


def is_inside_grid(column, row):
    """Is this square actually on the board?"""
    return 0 <= column < GRID_SIZE and 0 <= row < GRID_SIZE


def neighbours(column, row):
    """The squares touching this one - up to 8 of them.

    ALGORITHM: try all nine squares in the little 3x3 box around it, skip the
    middle one (that is the square itself), and skip anything off the edge.
    Corners have 3 neighbours, edges have 5, and the middle has 8.
    """
    found = []
    for d_row in (-1, 0, 1):
        for d_column in (-1, 0, 1):
            if d_column == 0 and d_row == 0:
                continue
            c = column + d_column
            r = row + d_row
            if is_inside_grid(c, r):
                found.append((c, r))
    return found


def count_mines(state, column, row):
    """The number that gets printed on a square: 0 to 8."""
    return sum(1 for c, r in neighbours(column, row) if state["mines"][cell_index(c, r)])


def place_mines(state, safe_column, safe_row):
    """Hide the mines, but never under the first click.

    ALGORITHM: build a list of every square allowed to hold a mine - that is
    every square except the one clicked and its neighbours. Shuffle it and
    take the first MINE_COUNT.

    WHY: losing on your very first click is not a game, it is a coin toss.
    Every good Minesweeper lays its mines AFTER the first click.
    """
    banned = {cell_index(safe_column, safe_row)}
    for c, r in neighbours(safe_column, safe_row):
        banned.add(cell_index(c, r))

    allowed = [i for i in range(CELL_COUNT) if i not in banned]
    random.shuffle(allowed)

    state["mines"] = [False] * CELL_COUNT
    for index in allowed[:MINE_COUNT]:
        state["mines"][index] = True
    state["mines_placed"] = True


def reveal_cell(state, column, row):
    """Uncover one square, and everything obviously safe around it.

    ALGORITHM - this is FLOOD FILL, and it is worth learning properly:
      1. Put the first square on a "to do" list.
      2. Take a square off the list. If it is already uncovered or flagged,
         ignore it. Otherwise uncover it.
      3. If that square has NO mines touching it, there is nothing to work out
         around it - so put all its neighbours on the to-do list too.
      4. Keep going until the list is empty.

    That is how one click can open a whole field. The same algorithm fills in
    shapes in a paint program.
    """
    if state["is_over"] or not is_inside_grid(column, row):
        return False
    first = cell_index(column, row)
    if state["revealed"][first] or state["flagged"][first]:
        return False

    if not state["mines_placed"]:
        place_mines(state, column, row)

    if state["mines"][first]:
        state["revealed"][first] = True
        state["is_over"] = True
        state["hit_mine"] = first
        return True

    todo = [(column, row)]
    while todo:
        c, r = todo.pop()
        index = cell_index(c, r)

        if state["revealed"][index] or state["flagged"][index]:
            continue
        state["revealed"][index] = True

        if count_mines(state, c, r) == 0:
            todo.extend(neighbours(c, r))

    check_win(state)
    return True


def toggle_flag(state, column, row):
    """Put a flag on a square, or take one off.

    ALGORITHM: you may only flag a square that is still covered. A flag also
    protects the square - reveal_cell refuses to open a flagged one, so you
    cannot lose by fumbling a click.
    """
    if state["is_over"] or not is_inside_grid(column, row):
        return False
    index = cell_index(column, row)
    if state["revealed"][index]:
        return False
    state["flagged"][index] = not state["flagged"][index]
    return True


def flags_used(state):
    """How many flags are on the board."""
    return sum(1 for flag in state["flagged"] if flag)


def mines_left(state):
    """The number shown to the player: mines minus flags."""
    return MINE_COUNT - flags_used(state)


def revealed_count(state):
    """How many squares are uncovered."""
    return sum(1 for cell in state["revealed"] if cell)


def check_win(state):
    """Has the player finished?

    ALGORITHM: you win by uncovering every square that is NOT a mine. Note
    what this does not say: flags do not matter at all. You can win with no
    flags on the board, and flagging every mine is not enough on its own.
    """
    if revealed_count(state) == CELL_COUNT - MINE_COUNT:
        state["is_won"] = True
        state["is_over"] = True
        return True
    return False


def create_game():
    """Start a brand-new game, with the mines not yet laid."""
    return {
        "mines": [False] * CELL_COUNT,
        "revealed": [False] * CELL_COUNT,
        "flagged": [False] * CELL_COUNT,
        "mines_placed": False,
        "cursor": {"column": 4, "row": 4},
        "hit_mine": -1,
        "seconds": 0,
        "is_won": False,
        "is_over": False,
        "is_paused": False,
    }


def move_cursor(state, d_column, d_row):
    """Slide the keyboard cursor, staying on the board."""
    column = state["cursor"]["column"] + d_column
    row = state["cursor"]["row"] + d_row
    if is_inside_grid(column, row):
        state["cursor"] = {"column": column, "row": row}
        return True
    return False


def update_game(state, elapsed_ms):
    """The only moving part is the clock."""
    if state["is_over"] or state["is_paused"] or not state["mines_placed"]:
        return
    state["seconds"] += elapsed_ms / 1000


def toggle_pause(state):
    """Freeze or unfreeze the clock."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "dig", "spacebar": "dig", "enter": "dig",
        "f": "flag", "p": "pause", "r": "restart",
    }
    return keys.get(str(key).lower())
