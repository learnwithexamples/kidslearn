"""bubbles_rules.py - the rules of Bubble Shooter, in Python.

Aim, shoot, and stick a bubble to the ceiling of bubbles. Three or more of the
same kind touching, and they all pop - and anything left dangling with nothing
above it falls away.

Two searches do all the work here, and they are the same search asked two
different questions:
  * which bubbles of the SAME KIND are joined to this one?   (do they pop?)
  * which bubbles are joined to the CEILING?                 (what falls?)
"""

import math
import random

COLUMNS = 10
ROWS = 12
CELL = 28
BUBBLE_RADIUS = CELL / 2 - 1

GRID_WIDTH = COLUMNS * CELL
GRID_HEIGHT = ROWS * CELL

FIELD_WIDTH = GRID_WIDTH
FIELD_HEIGHT = GRID_HEIGHT + 64

SHOOTER_X = FIELD_WIDTH / 2
SHOOTER_Y = FIELD_HEIGHT - 24

KIND_COUNT = 5
EMPTY = -1

SHOT_SPEED = 420

# How far a shot may travel between two collision checks. A whole frame's
# worth at once is over half a cell, which is enough to carry a fast bubble
# through a gap, or bury it deep inside the cluster before anything notices -
# and a bubble that stops deep inside lands nowhere near where it hit.
MAX_STEP = 4
MIN_POP = 3
POINTS_PER_BUBBLE = 10
POINTS_PER_DROP = 25

# the shooter may not aim flat sideways, or a shot would never come down
MIN_ANGLE = -math.pi + 0.35
MAX_ANGLE = -0.35
TURN_SPEED = 2.2


def bubble_index(column, row):
    """Turn a column and row into a place in the grid list."""
    return row * COLUMNS + column


def is_inside_grid(column, row):
    """Is this cell on the grid?"""
    return 0 <= column < COLUMNS and 0 <= row < ROWS


def bubble_centre(column, row):
    """The middle of one cell, in pixels.

    ALGORITHM: step across by CELL for each column and down for each row, then
    add half a cell to land in the MIDDLE rather than the corner. Bubbles are
    circles, and a circle is drawn from its middle.
    """
    return {"x": column * CELL + CELL / 2, "y": row * CELL + CELL / 2}


def cell_at_pixel(x, y):
    """Which cell is this point in? (column, row), or None."""
    column = int(x // CELL)
    row = int(y // CELL)
    if not is_inside_grid(column, row):
        return None
    return (column, row)


def random_kind():
    """One of the kinds of bubble, at random."""
    return random.randrange(KIND_COUNT)


def neighbours(column, row):
    """The four cells touching this one, on the grid."""
    found = []
    for dx, dy in ((0, -1), (1, 0), (0, 1), (-1, 0)):
        c, r = column + dx, row + dy
        if is_inside_grid(c, r):
            found.append((c, r))
    return found


def turn_shooter(state, change, seconds):
    """Swing the aim left or right.

    ALGORITHM: move the angle, then keep it between MIN_ANGLE and MAX_ANGLE.
    Without those limits the player could aim flat sideways, and a shot that
    never comes down is a shot that hangs the game.
    """
    angle = state["angle"] + change * TURN_SPEED * seconds
    state["angle"] = max(MIN_ANGLE, min(MAX_ANGLE, angle))


def same_group(grid, column, row):
    """Every bubble of the same kind joined to this one.

    OUTPUT: a list of (column, row), including the one you started from.
    ALGORITHM: FLOOD FILL again - a to-do list, exactly like Minesweeper. Take
    a cell off, and if it holds the same kind and you have not seen it before,
    keep it and put its neighbours on the list.

    An empty cell has no group at all, so that case comes first.
    """
    kind = grid[bubble_index(column, row)]
    if kind == EMPTY:
        return []

    seen = set()
    group = []
    todo = [(column, row)]

    while todo:
        c, r = todo.pop()
        index = bubble_index(c, r)

        if index in seen or grid[index] != kind:
            continue
        seen.add(index)
        group.append((c, r))
        todo.extend(neighbours(c, r))

    return group


def pop_group(state, group):
    """Burst a group, if it is big enough.

    OUTPUT: how many bubbles popped.
    ALGORITHM: fewer than MIN_POP and nothing happens at all - that is the
    whole rule of the game.
    """
    if len(group) < MIN_POP:
        return 0
    for column, row in group:
        state["grid"][bubble_index(column, row)] = EMPTY
    state["score"] += len(group) * POINTS_PER_BUBBLE
    state["popped"] += len(group)
    return len(group)


def drop_floaters(state):
    """Anything no longer hanging from the ceiling falls away.

    OUTPUT: how many bubbles fell.
    ALGORITHM: the same search as same_group, asked a different question.
    Start from every bubble in the TOP row and spread out through their
    neighbours - ignoring what kind they are this time. Anything the search
    never reaches is dangling in mid-air, so it drops.

    WHY it is worth the trouble: popping the bubble that holds up a whole
    cluster brings the lot down at once.
    """
    held = set()
    todo = [(column, 0) for column in range(COLUMNS)
            if state["grid"][bubble_index(column, 0)] != EMPTY]

    while todo:
        c, r = todo.pop()
        index = bubble_index(c, r)

        if index in held or state["grid"][index] == EMPTY:
            continue
        held.add(index)
        todo.extend(neighbours(c, r))

    fell = 0
    for i, kind in enumerate(state["grid"]):
        if kind != EMPTY and i not in held:
            state["grid"][i] = EMPTY
            fell += 1

    if fell:
        state["score"] += fell * POINTS_PER_DROP
        state["dropped"] += fell
    return fell


def bubbles_left(state):
    """How many bubbles are still up there."""
    return sum(1 for kind in state["grid"] if kind != EMPTY)


def lowest_row(state):
    """How far down the bubbles reach. -1 if there are none."""
    lowest = -1
    for row in range(ROWS):
        for column in range(COLUMNS):
            if state["grid"][bubble_index(column, row)] != EMPTY:
                lowest = row
    return lowest


def shoot_bubble(state):
    """Send the waiting bubble on its way.

    ALGORITHM: one shot at a time - the flying bubble has to land before the
    next one can go, which is what makes each shot a decision.
    """
    if state["is_over"] or state["is_paused"] or state["flying"] is not None:
        return False
    state["flying"] = {
        "x": SHOOTER_X,
        "y": SHOOTER_Y,
        "dx": math.cos(state["angle"]) * SHOT_SPEED,
        "dy": math.sin(state["angle"]) * SHOT_SPEED,
        "kind": state["holding"],
    }
    state["holding"] = state["next"]
    state["next"] = random_kind()
    state["shots"] += 1
    return True


def can_stick_here(state, column, row):
    """May a flying bubble stop in this cell?

    ALGORITHM: the cell has to be empty, and it has to have something to hold
    on to - either it is up on the ceiling row, or one of its four neighbours
    already holds a bubble.

    WHY the second half matters: without it a shot can stop in a cell that
    touches nothing at all and hang there in mid-air. Worse, it then belongs
    to no group, so it can never be popped - it just sits there until
    something else pops and the falling rule sweeps it away.
    """
    if state["grid"][bubble_index(column, row)] != EMPTY:
        return False
    if row == 0:
        return True
    return any(state["grid"][bubble_index(c, r)] != EMPTY
               for c, r in neighbours(column, row))


def nearest_free_cell(state, x, y):
    """Where should a flying bubble stick? A cell, or None.

    ALGORITHM: of every cell it COULD stick to, take the one whose middle is
    closest to where the bubble actually stopped.
    """
    best = None
    best_distance = 0
    for row in range(ROWS):
        for column in range(COLUMNS):
            if not can_stick_here(state, column, row):
                continue
            centre = bubble_centre(column, row)
            away = math.sqrt((centre["x"] - x) ** 2 + (centre["y"] - y) ** 2)
            if best is None or away < best_distance:
                best = (column, row)
                best_distance = away
    return best


def hits_a_bubble(state, x, y):
    """Is the flying bubble touching one that is already stuck?"""
    for row in range(ROWS):
        for column in range(COLUMNS):
            if state["grid"][bubble_index(column, row)] == EMPTY:
                continue
            centre = bubble_centre(column, row)
            away = math.sqrt((centre["x"] - x) ** 2 + (centre["y"] - y) ** 2)
            if away < BUBBLE_RADIUS * 1.8:
                return True
    return False


def fill_ceiling(state, rows):
    """Hang a fresh block of bubbles from the top."""
    for row in range(rows):
        for column in range(COLUMNS):
            state["grid"][bubble_index(column, row)] = random_kind()


def land_bubble(state):
    """The flying bubble sticks, pops what it can, and drops the rest."""
    cell = nearest_free_cell(state, state["flying"]["x"], state["flying"]["y"])
    if cell is None:
        state["flying"] = None
        return

    state["grid"][bubble_index(cell[0], cell[1])] = state["flying"]["kind"]
    state["flying"] = None

    popped = pop_group(state, same_group(state["grid"], cell[0], cell[1]))
    if popped:
        drop_floaters(state)

    if bubbles_left(state) == 0:
        state["score"] += 500
        fill_ceiling(state, 4)
        state["wave"] += 1
    elif lowest_row(state) >= ROWS - 1:
        state["is_over"] = True


def create_game():
    """Start a brand-new game."""
    state = {
        "grid": [EMPTY] * (COLUMNS * ROWS),
        "flying": None,
        "angle": -math.pi / 2,
        "turning": 0,
        "holding": random_kind(),
        "next": random_kind(),
        "score": 0,
        "shots": 0,
        "popped": 0,
        "dropped": 0,
        "wave": 1,
        "is_over": False,
        "is_paused": False,
    }
    fill_ceiling(state, 4)
    return state


def move_shot(state, distance):
    """Carry the flying bubble along by one small step.

    ALGORITHM: move along the direction it is travelling, bounce off the side
    walls, then look for a landing. Called over and over with a small
    distance, so a shot is never checked only after a big jump.
    """
    flying = state["flying"]
    speed = math.sqrt(flying["dx"] ** 2 + flying["dy"] ** 2)
    if speed == 0:
        state["flying"] = None
        return

    flying["x"] += flying["dx"] / speed * distance
    flying["y"] += flying["dy"] / speed * distance

    # the side walls bounce a shot back - that is how you reach the corners
    if flying["x"] < BUBBLE_RADIUS:
        flying["x"] = BUBBLE_RADIUS
        flying["dx"] = -flying["dx"]
    if flying["x"] > FIELD_WIDTH - BUBBLE_RADIUS:
        flying["x"] = FIELD_WIDTH - BUBBLE_RADIUS
        flying["dx"] = -flying["dx"]

    if flying["y"] < BUBBLE_RADIUS or hits_a_bubble(state, flying["x"], flying["y"]):
        land_bubble(state)
    elif flying["y"] > FIELD_HEIGHT:
        state["flying"] = None


def update_game(state, elapsed_ms):
    """One frame of the game."""
    if state["is_over"] or state["is_paused"]:
        return
    seconds = elapsed_ms / 1000

    if state["turning"] != 0:
        turn_shooter(state, state["turning"], seconds)

    if state["flying"] is None:
        return

    # Walk the shot along in small steps, checking as it goes.
    speed = math.sqrt(state["flying"]["dx"] ** 2 + state["flying"]["dy"] ** 2)
    togo = speed * seconds

    while state["flying"] is not None and togo > 0:
        step = min(MAX_STEP, togo)
        togo -= step
        move_shot(state, step)


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "shoot", "spacebar": "shoot", "arrowup": "shoot", "w": "shoot",
        "p": "pause", "r": "restart",
    }
    return keys.get(str(key).lower())
