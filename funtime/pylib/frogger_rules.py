"""frogger_rules.py - the rules of Frogger, in Python.

Hop across a busy road, one square at a time, without being squashed.

Two different worlds meet in this game: the frog lives on a GRID and moves one
whole square at a time, while the cars live in PIXELS and slide smoothly.
"""

COLUMNS = 9
ROWS = 11
CELL = 32

FIELD_WIDTH = COLUMNS * CELL
FIELD_HEIGHT = ROWS * CELL

HOME_ROW = 0
START_ROW = ROWS - 1
FIRST_LANE = 1
LAST_LANE = ROWS - 2
MEDIAN_ROW = 5

CAR_HEIGHT = 22
START_LIVES = 3


def lane_direction(row):
    """Which way does the traffic in this row go? 1 right, -1 left.

    ALGORITHM: odd rows go right, even rows go left, so the frog always has
    traffic coming at it from both sides.
    """
    return 1 if row % 2 == 1 else -1


def lane_speed(row, level):
    """How fast the traffic in this row moves, in pixels per second.

    ALGORITHM: 34 plus 9 for every row, so no two lanes move together, then 8
    more for every level, capped at 190 so even level 20 can be crossed.
    """
    return min(190, 34 + row * 9 + (level - 1) * 8)


def is_lane(row):
    """Does this row have traffic in it?

    ALGORITHM: the two banks are safe, and so is the island in the middle -
    without somewhere to stop and think, the road is unfair.
    """
    return FIRST_LANE <= row <= LAST_LANE and row != MEDIAN_ROW


def car_width(row):
    """Rows divisible by three get long lorries; the rest get cars."""
    return 58 if row % 3 == 0 else 38


def cars_in_lane(row):
    """How many vehicles share one row."""
    return 2 if row % 3 == 0 else 3


def lane_offset(row, spacing):
    """How far along its row a lane's traffic starts.

    ALGORITHM: every row is shifted by a different amount so the traffic is
    staggered. Line them all up instead and the frog would be run over on its
    very first hop, every single game.
    """
    return (row * 37) % spacing


def make_lane(row):
    """The vehicles for one row, spread out evenly and staggered."""
    count = cars_in_lane(row)
    spacing = FIELD_WIDTH / count
    offset = lane_offset(row, spacing)
    return [{"row": row, "x": i * spacing + offset, "width": car_width(row)}
            for i in range(count)]


def make_traffic():
    """Every vehicle on the whole road."""
    cars = []
    for row in range(FIRST_LANE, LAST_LANE + 1):
        if is_lane(row):
            cars.extend(make_lane(row))
    return cars


def wrap_car(car):
    """A car that drives off one side comes back on the other.

    ALGORITHM: once the car is completely past the right-hand edge, put its
    back bumper just off the left edge, and the other way round. The road is a
    loop, so the traffic never runs out.
    """
    if car["x"] > FIELD_WIDTH:
        car["x"] = -car["width"]
    if car["x"] + car["width"] < 0:
        car["x"] = FIELD_WIDTH


def move_cars(cars, seconds, level):
    """Slide every vehicle along its row, then wrap it round."""
    for car in cars:
        car["x"] += lane_direction(car["row"]) * lane_speed(car["row"], level) * seconds
        wrap_car(car)


def frog_rect(frog):
    """The frog as a rectangle, slightly smaller than its square."""
    return {
        "x": frog["column"] * CELL + 4,
        "y": frog["row"] * CELL + 5,
        "width": CELL - 8,
        "height": CELL - 10,
    }


def car_rect(car):
    """One vehicle as a rectangle."""
    return {
        "x": car["x"],
        "y": car["row"] * CELL + (CELL - CAR_HEIGHT) / 2,
        "width": car["width"],
        "height": CAR_HEIGHT,
    }


def overlaps(a, b):
    """Do two rectangles touch?"""
    return (a["x"] < b["x"] + b["width"]
            and a["x"] + a["width"] > b["x"]
            and a["y"] < b["y"] + b["height"]
            and a["y"] + a["height"] > b["y"])


def is_squashed(state):
    """Has a car caught the frog?

    ALGORITHM: only the cars in the frog's own row can possibly touch it, so
    skip the rest - nine times less work every frame.
    """
    frog = frog_rect(state["frog"])
    for car in state["cars"]:
        if car["row"] == state["frog"]["row"] and overlaps(frog, car_rect(car)):
            return True
    return False


def move_frog(state, d_column, d_row):
    """One hop.

    OUTPUT: True if the frog moved.
    ALGORITHM: work out where it would land, refuse to leave the field, and
    remember the highest row it has ever reached so hopping forward scores but
    hopping back and forth does not.
    """
    if state["is_over"] or state["is_paused"]:
        return False
    column = state["frog"]["column"] + d_column
    row = state["frog"]["row"] + d_row

    if not (0 <= column < COLUMNS) or not (0 <= row < ROWS):
        return False

    state["frog"]["column"] = column
    state["frog"]["row"] = row

    if row < state["highest_row"]:
        state["highest_row"] = row
        state["score"] += 10
    return True


def reset_frog(state):
    """Put the frog back on the starting bank."""
    state["frog"] = {"column": COLUMNS // 2, "row": START_ROW}
    state["highest_row"] = START_ROW


def reach_home(state):
    """Has the frog made it to the top?

    OUTPUT: True if it just got home. A big bonus, the level goes up, and the
    frog starts again from the bottom bank.
    """
    if state["frog"]["row"] != HOME_ROW:
        return False
    state["score"] += 100
    state["crossings"] += 1
    state["level"] += 1
    reset_frog(state)
    return True


def create_game():
    """Start a brand-new game."""
    return {
        "frog": {"column": COLUMNS // 2, "row": START_ROW},
        "cars": make_traffic(),
        "highest_row": START_ROW,
        "lives": START_LIVES,
        "score": 0,
        "level": 1,
        "crossings": 0,
        "is_over": False,
        "is_paused": False,
    }


def update_game(state, elapsed_ms):
    """One frame of the game."""
    if state["is_over"] or state["is_paused"]:
        return
    move_cars(state["cars"], elapsed_ms / 1000, state["level"])

    if is_squashed(state):
        state["lives"] -= 1
        if state["lives"] <= 0:
            state["lives"] = 0
            state["is_over"] = True
        else:
            reset_frog(state)
        return

    reach_home(state)


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
        "p": "pause", " ": "pause", "spacebar": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
