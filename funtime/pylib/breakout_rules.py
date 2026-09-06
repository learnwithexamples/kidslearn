"""breakout_rules.py - the rules of Breakout, in Python.

A ball bounces around a box; you slide a paddle along the bottom to keep it in
play and knock out every brick.

Nothing here sits on a grid: the ball has a real position in PIXELS and a
speed in pixels per second.
"""

FIELD_WIDTH = 320
FIELD_HEIGHT = 420

BRICK_COLUMNS = 7
BRICK_ROWS = 5
BRICK_TOP = 44
BRICK_HEIGHT = 18
BRICK_GAP = 4
BRICK_SIDE_MARGIN = 8
BRICK_WIDTH = (FIELD_WIDTH - BRICK_SIDE_MARGIN * 2 - BRICK_GAP * (BRICK_COLUMNS - 1)) / BRICK_COLUMNS

PADDLE_WIDTH = 74
PADDLE_HEIGHT = 12
PADDLE_Y = FIELD_HEIGHT - 30
PADDLE_SPEED = 340

BALL_RADIUS = 6
START_LIVES = 3


def brick_index(column, row):
    """Turn a column and row into a place in the list of bricks."""
    return row * BRICK_COLUMNS + column


def brick_rect(column, row):
    """Where one brick sits, as a rectangle.

    INPUT:  column, row. OUTPUT: a dict with x, y, width, height.
    ALGORITHM: start at the margin, then skip a brick plus a gap for every
    column, and the same downwards for the rows.
    """
    return {
        "x": BRICK_SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_GAP),
        "y": BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP),
        "width": BRICK_WIDTH,
        "height": BRICK_HEIGHT,
    }


def hits_rect(ball, rect):
    """Is the ball touching this rectangle?

    INPUT:  ball - a dict with x and y (the middle). rect - x, y, width, height.
    OUTPUT: True if they overlap.
    ALGORITHM (the closest-point trick): squeeze the ball's middle onto the
    rectangle to find the nearest point on it, then see whether that point is
    within one radius.
    """
    nearest_x = max(rect["x"], min(ball["x"], rect["x"] + rect["width"]))
    nearest_y = max(rect["y"], min(ball["y"], rect["y"] + rect["height"]))
    gap_x = ball["x"] - nearest_x
    gap_y = ball["y"] - nearest_y
    return gap_x * gap_x + gap_y * gap_y <= BALL_RADIUS * BALL_RADIUS


def paddle_rect(state):
    """The paddle as a rectangle, so the same test works on it."""
    return {"x": state["paddle_x"], "y": PADDLE_Y, "width": PADDLE_WIDTH, "height": PADDLE_HEIGHT}


def create_bricks():
    """A full wall of bricks, all unbroken."""
    return [True] * (BRICK_COLUMNS * BRICK_ROWS)


def create_game():
    """Start a brand-new game."""
    return {
        "bricks": create_bricks(),
        "paddle_x": (FIELD_WIDTH - PADDLE_WIDTH) / 2,
        "ball": {"x": FIELD_WIDTH / 2, "y": PADDLE_Y - 40, "dx": 150, "dy": -230},
        "steering": 0,
        "lives": START_LIVES,
        "score": 0,
        "level": 1,
        "is_over": False,
        "is_won": False,
        "is_paused": True,
    }


def move_paddle(state, seconds):
    """Slide the paddle sideways, keeping it on the field.

    ALGORITHM: move by steering x PADDLE_SPEED x seconds, then clamp.
    """
    x = state["paddle_x"] + state["steering"] * PADDLE_SPEED * seconds
    state["paddle_x"] = max(0, min(FIELD_WIDTH - PADDLE_WIDTH, x))


def bounce_off_walls(ball):
    """Keep the ball inside the box.

    ALGORITHM: at the left, right or top edge, push the ball back to the edge
    and flip its direction. The floor is NOT a wall - that is where you lose a
    life.
    """
    if ball["x"] < BALL_RADIUS:
        ball["x"] = BALL_RADIUS
        ball["dx"] = -ball["dx"]
    if ball["x"] > FIELD_WIDTH - BALL_RADIUS:
        ball["x"] = FIELD_WIDTH - BALL_RADIUS
        ball["dx"] = -ball["dx"]
    if ball["y"] < BALL_RADIUS:
        ball["y"] = BALL_RADIUS
        ball["dy"] = -ball["dy"]


def bounce_off_paddle(state):
    """Bat the ball back into play.

    OUTPUT: True if the paddle hit the ball.
    ALGORITHM: only when the ball is falling and touching the paddle. Send it
    back up, and steer it by WHERE it hit - the middle sends it straight up,
    the edges send it away at an angle.
    """
    if state["ball"]["dy"] <= 0 or not hits_rect(state["ball"], paddle_rect(state)):
        return False
    middle = state["paddle_x"] + PADDLE_WIDTH / 2
    offset = (state["ball"]["x"] - middle) / (PADDLE_WIDTH / 2)
    state["ball"]["dy"] = -abs(state["ball"]["dy"])
    state["ball"]["dx"] = offset * 240
    state["ball"]["y"] = PADDLE_Y - BALL_RADIUS
    return True


def score_for_brick(row):
    """How many points is one brick worth? The higher the row, the more."""
    return (BRICK_ROWS - row) * 10


def bricks_left(state):
    """How many bricks are still standing?"""
    return sum(1 for brick in state["bricks"] if brick)


def break_bricks(state):
    """Knock out the brick the ball is touching.

    OUTPUT: True if a brick was broken.
    ALGORITHM: the first brick the ball touches is removed, the ball bounces
    back, and the score goes up. Stop after ONE brick, so the ball cannot
    tunnel through a whole row in a single frame.
    """
    for row in range(BRICK_ROWS):
        for column in range(BRICK_COLUMNS):
            index = brick_index(column, row)
            if state["bricks"][index] and hits_rect(state["ball"], brick_rect(column, row)):
                state["bricks"][index] = False
                state["ball"]["dy"] = -state["ball"]["dy"]
                state["score"] += score_for_brick(row)
                if bricks_left(state) == 0:
                    state["is_won"] = True
                    state["is_over"] = True
                return True
    return False


def reset_ball(state):
    """Put the ball back above the paddle after losing a life."""
    state["ball"] = {"x": FIELD_WIDTH / 2, "y": PADDLE_Y - 40, "dx": 150, "dy": -230}
    state["is_paused"] = True


def update_game(state, elapsed_ms):
    """One frame of the game."""
    if state["is_over"] or state["is_paused"]:
        return
    seconds = elapsed_ms / 1000

    move_paddle(state, seconds)

    state["ball"]["x"] += state["ball"]["dx"] * seconds
    state["ball"]["y"] += state["ball"]["dy"] * seconds

    bounce_off_walls(state["ball"])
    bounce_off_paddle(state)
    break_bricks(state)

    if state["ball"]["y"] > FIELD_HEIGHT + BALL_RADIUS:
        state["lives"] -= 1
        if state["lives"] <= 0:
            state["lives"] = 0
            state["is_over"] = True
        else:
            reset_ball(state)


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "pause", "spacebar": "pause", "p": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
