"""whack_rules.py - the rules of Whack-a-Mole, in Python.

Nine holes in a 3 x 3 grid. A mole pops out of one hole at a time; hit it
before it ducks back down. The game lasts GAME_SECONDS and the moles get
faster the better you do.
"""

import random

GRID_SIZE = 3
HOLE_COUNT = GRID_SIZE * GRID_SIZE
GAME_SECONDS = 45


def hole_index(column, row):
    """Turn a column and row into a place in the list (0 to 8)."""
    return row * GRID_SIZE + column


def random_hole(previous):
    """Pick the next hole for the mole.

    INPUT:  previous - the hole it was just in (-1 if none)
    OUTPUT: a hole from 0 to HOLE_COUNT - 1, never the same as previous
    ALGORITHM: list every other hole, then choose one. Popping out of the same
    hole twice feels broken, even though it is perfectly random.
    """
    choices = [hole for hole in range(HOLE_COUNT) if hole != previous]
    return random.choice(choices)


def mole_interval(level):
    """How long the mole stays up, in milliseconds.

    ALGORITHM: 1100 ms at level 1, 90 ms less each level, never below 350.
    """
    return max(350, 1100 - (level - 1) * 90)


def level_for_hits(hits):
    """Which level has this many hits earned? A new level every 5 hits."""
    return hits // 5 + 1


def score_for_hit(level):
    """How many points is one mole worth? 10 times the level."""
    return 10 * level


def create_game():
    """Start a brand-new game."""
    return {
        "mole": random_hole(-1),
        "mole_timer": 0,
        "seconds_left": GAME_SECONDS,
        "score": 0,
        "hits": 0,
        "misses": 0,
        "level": 1,
        "cursor": {"column": 1, "row": 1},
        "last_result": "",
        "is_over": False,
        "is_paused": False,
    }


def whack(state, index):
    """Swing at one hole.

    INPUT:  state, index. OUTPUT: True if there was a mole there.
    ALGORITHM: a hit counts, scores, may level you up and moves the mole
    somewhere else at once; a miss just counts - the mole stays put, so you
    get no free clues.
    """
    if state["is_over"] or state["is_paused"]:
        return False

    if index == state["mole"]:
        state["hits"] += 1
        state["score"] += score_for_hit(state["level"])
        state["level"] = level_for_hits(state["hits"])
        state["mole"] = random_hole(state["mole"])
        state["mole_timer"] = 0
        state["last_result"] = "hit"
        return True

    state["misses"] += 1
    state["last_result"] = "miss"
    return False


def update_game(state, elapsed_ms):
    """Let time pass (called about 60 times a second).

    ALGORITHM: count the clock down and end the game at zero; and move the
    mole whenever it has been up longer than this level's interval.
    """
    if state["is_over"] or state["is_paused"]:
        return

    state["seconds_left"] -= elapsed_ms / 1000
    if state["seconds_left"] <= 0:
        state["seconds_left"] = 0
        state["is_over"] = True
        return

    state["mole_timer"] += elapsed_ms
    if state["mole_timer"] >= mole_interval(state["level"]):
        state["mole_timer"] = 0
        state["mole"] = random_hole(state["mole"])


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
        " ": "whack", "spacebar": "whack", "enter": "whack",
        "p": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
