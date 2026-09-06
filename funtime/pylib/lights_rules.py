"""lights_rules.py - the rules of Lights Out, written in Python.

Twenty-five lights in a 5 x 5 grid. Pressing one flips it and its four
neighbours. Turn every light off to win.

The board is a flat list of 25 True/False values, read left to right and top
to bottom.
"""

import random

GRID_SIZE = 5
LIGHT_COUNT = GRID_SIZE * GRID_SIZE
SCRAMBLE_PRESSES = 12


def light_index(column, row):
    """Turn a column and row into a place in the list.

    INPUT:  column, row. OUTPUT: the position in the flat list of 25.
    ALGORITHM: skip a whole row of lights for each row, then add the column.
    """
    return row * GRID_SIZE + column


def is_on_board(column, row):
    """Is this square really on the grid?

    INPUT:  column, row. OUTPUT: True or False.
    ALGORITHM: Python can chain the comparisons: 0 <= column < GRID_SIZE.
    """
    return 0 <= column < GRID_SIZE and 0 <= row < GRID_SIZE


def neighbours(column, row):
    """The squares one press changes.

    INPUT:  column, row. OUTPUT: a list of (column, row) pairs.
    ALGORITHM: the square itself plus one step up, down, left and right,
    keeping only the steps that stay on the board.
    """
    steps = [(0, 0), (0, -1), (0, 1), (-1, 0), (1, 0)]
    return [(column + dx, row + dy) for dx, dy in steps if is_on_board(column + dx, row + dy)]


def press_light(lights, column, row):
    """Press one square and flip the cross of lights around it.

    INPUT:  lights, column, row. OUTPUT: a NEW list with those lights flipped.
    ALGORITHM: copy the list, then flip the value at each neighbour's index.
    """
    changed = list(lights)
    for c, r in neighbours(column, row):
        index = light_index(c, r)
        changed[index] = not changed[index]
    return changed


def is_solved(lights):
    """Are all the lights off?

    INPUT:  lights. OUTPUT: True if every one is False.
    ALGORITHM: `not any(lights)` - any() is True when at least one is on.
    """
    return not any(lights)


def count_lights_on(lights):
    """How many are still lit?

    INPUT:  lights. OUTPUT: how many are True.
    ALGORITHM: sum() counts True as 1 and False as 0.
    """
    return sum(1 for light in lights if light)


def create_puzzle(presses):
    """Build a puzzle that is definitely solvable.

    INPUT:  presses - how many random presses to scramble with
    OUTPUT: a list of 25 lights
    ALGORITHM: start with everything off and press random squares. Pressing is
    its own undo, so any board built this way can be unpressed back to
    darkness - the puzzle is never impossible.
    """
    lights = [False] * LIGHT_COUNT
    for _ in range(presses):
        lights = press_light(lights, random.randrange(GRID_SIZE), random.randrange(GRID_SIZE))
    return lights


def create_game():
    """Start a brand-new puzzle."""
    lights = create_puzzle(SCRAMBLE_PRESSES)
    while is_solved(lights):
        lights = create_puzzle(SCRAMBLE_PRESSES)
    return {
        "lights": lights,
        "moves": 0,
        "cursor": {"column": 2, "row": 2},
        "is_over": False,
        "is_paused": False,
    }


def press_square(state, column, row):
    """The player's move.

    INPUT:  state, column, row. OUTPUT: True if the press happened.
    ALGORITHM: refuse if the puzzle is finished, paused or the square is off
    the board; otherwise flip the cross, count the move and check for a win.
    """
    if state["is_over"] or state["is_paused"] or not is_on_board(column, row):
        return False
    state["lights"] = press_light(state["lights"], column, row)
    state["moves"] += 1
    if is_solved(state["lights"]):
        state["is_over"] = True
    return True


def move_cursor(state, dx, dy):
    """Move the keyboard cursor, staying on the board."""
    column = state["cursor"]["column"] + dx
    row = state["cursor"]["row"] + dy
    if is_on_board(column, row):
        state["cursor"]["column"] = column
        state["cursor"]["row"] = row


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into the name of a game action."""
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "press", "spacebar": "press", "enter": "press",
        "p": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
