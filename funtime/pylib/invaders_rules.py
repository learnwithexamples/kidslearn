"""invaders_rules.py - the rules of Space Invaders, in Python.

A fleet of aliens marches side to side, dropping a row every time it touches
an edge. You slide along the bottom and shoot upwards.

The clever old trick in this game: the aliens do not each have their own
position. The whole FLEET has one position, and each alien's place is worked
out from its column and row. Move one number and all 24 move.
"""

import random

FIELD_WIDTH = 320
FIELD_HEIGHT = 400

ALIEN_COLUMNS = 6
ALIEN_ROWS = 4
ALIEN_WIDTH = 24
ALIEN_HEIGHT = 18
ALIEN_GAP_X = 14
ALIEN_GAP_Y = 12
FLEET_WIDTH = ALIEN_COLUMNS * (ALIEN_WIDTH + ALIEN_GAP_X) - ALIEN_GAP_X
FLEET_DROP = 16

SHIP_WIDTH = 30
SHIP_HEIGHT = 14
SHIP_Y = FIELD_HEIGHT - 28
SHIP_SPEED = 260

BULLET_WIDTH = 3
BULLET_HEIGHT = 11
BULLET_SPEED = 430
BOMB_SPEED = 190

START_LIVES = 3


def alien_index(column, row):
    """Turn a column and row into a place in the list of aliens."""
    return row * ALIEN_COLUMNS + column


def alien_rect(alien, state):
    """Where one alien is right now.

    ALGORITHM: start at the fleet's own x and y, then step across one alien
    plus one gap for every column, and down for every row.
    """
    return {
        "x": state["fleet_x"] + alien["column"] * (ALIEN_WIDTH + ALIEN_GAP_X),
        "y": state["fleet_y"] + alien["row"] * (ALIEN_HEIGHT + ALIEN_GAP_Y),
        "width": ALIEN_WIDTH,
        "height": ALIEN_HEIGHT,
    }


def ship_rect(state):
    """The player's ship as a rectangle."""
    return {"x": state["ship_x"], "y": SHIP_Y, "width": SHIP_WIDTH, "height": SHIP_HEIGHT}


def bullet_rect(bullet):
    """One shot as a rectangle."""
    return {"x": bullet["x"], "y": bullet["y"], "width": BULLET_WIDTH, "height": BULLET_HEIGHT}


def overlaps(a, b):
    """Do two rectangles touch?"""
    return (a["x"] < b["x"] + b["width"]
            and a["x"] + a["width"] > b["x"]
            and a["y"] < b["y"] + b["height"]
            and a["y"] + a["height"] > b["y"])


def make_aliens():
    """A full fleet, all alive."""
    return [{"column": c, "row": r, "alive": True}
            for r in range(ALIEN_ROWS) for c in range(ALIEN_COLUMNS)]


def aliens_left(state):
    """How many are still alive?"""
    return sum(1 for alien in state["aliens"] if alien["alive"])


def fleet_speed(state):
    """How fast the aliens march, in pixels per second.

    ALGORITHM: the fewer aliens are left, the faster they go - 22 to start,
    plus 5 for every alien shot down, plus 12 a wave. That is why the last one
    always seems to be sprinting.
    """
    shot = ALIEN_COLUMNS * ALIEN_ROWS - aliens_left(state)
    return min(260, 22 + shot * 5 + (state["wave"] - 1) * 12)


def fleet_edges(state):
    """How far the LIVING aliens reach, left and right, or None.

    ALGORITHM: dead aliens leave a hole, so the fleet must be measured by the
    ones still alive - otherwise an empty column would keep bouncing the fleet
    off the wall early.
    """
    left = None
    right = None
    for alien in state["aliens"]:
        if not alien["alive"]:
            continue
        rect = alien_rect(alien, state)
        if left is None or rect["x"] < left:
            left = rect["x"]
        if right is None or rect["x"] + rect["width"] > right:
            right = rect["x"] + rect["width"]
    return None if left is None else {"left": left, "right": right}


def move_fleet(state, seconds):
    """March the aliens sideways, and down at the walls.

    ALGORITHM: slide the whole fleet, then if the living aliens now stick out
    past either wall, turn round and drop a row. Dropping is what eventually
    ends the game.
    """
    state["fleet_x"] += state["fleet_direction"] * fleet_speed(state) * seconds

    edges = fleet_edges(state)
    if edges is None:
        return
    if edges["right"] > FIELD_WIDTH - 6 and state["fleet_direction"] == 1:
        state["fleet_direction"] = -1
        state["fleet_y"] += FLEET_DROP
    elif edges["left"] < 6 and state["fleet_direction"] == -1:
        state["fleet_direction"] = 1
        state["fleet_y"] += FLEET_DROP


def move_ship(state, seconds):
    """Slide the player's ship, keeping the whole of it on the field."""
    x = state["ship_x"] + state["steering"] * SHIP_SPEED * seconds
    state["ship_x"] = max(0, min(FIELD_WIDTH - SHIP_WIDTH, x))


def fire_bullet(state):
    """Shoot, if you are allowed to.

    ALGORITHM: only ONE of your bullets may be in the air at a time. That
    single rule is what makes the game about aiming instead of holding the
    button down.
    """
    if state["is_over"] or state["is_paused"] or state["bullets"]:
        return False
    state["bullets"].append({
        "x": state["ship_x"] + SHIP_WIDTH / 2 - BULLET_WIDTH / 2,
        "y": SHIP_Y - BULLET_HEIGHT,
    })
    state["shots"] += 1
    return True


def move_bullets(bullets, distance):
    """Move every shot and forget the ones that have left the field.

    OUTPUT: a NEW list of bullets.
    """
    moved = []
    for bullet in bullets:
        shifted = {"x": bullet["x"], "y": bullet["y"] + distance}
        if shifted["y"] + BULLET_HEIGHT > 0 and shifted["y"] < FIELD_HEIGHT:
            moved.append(shifted)
    return moved


def score_for_row(row):
    """The aliens at the back are furthest away and worth the most."""
    return (ALIEN_ROWS - row) * 10


def hit_aliens(state):
    """Check every shot against every alien.

    OUTPUT: how many aliens were shot this frame.
    ALGORITHM: for each bullet, find the first living alien it touches. Kill
    the alien, remove the bullet, and score. A bullet can only ever hit one
    alien - that is why we stop looking after the first.
    """
    hits = 0
    survivors = []

    for bullet in state["bullets"]:
        hit_something = False
        for alien in state["aliens"]:
            if alien["alive"] and overlaps(bullet_rect(bullet), alien_rect(alien, state)):
                alien["alive"] = False
                state["score"] += score_for_row(alien["row"])
                hits += 1
                hit_something = True
                break
        if not hit_something:
            survivors.append(bullet)

    state["bullets"] = survivors
    return hits


def lowest_alien_in_column(state, column):
    """The alien at the bottom of a column, or None."""
    found = None
    for alien in state["aliens"]:
        if alien["alive"] and alien["column"] == column:
            if found is None or alien["row"] > found["row"]:
                found = alien
    return found


def drop_bomb(state):
    """One of the front-row aliens throws something back."""
    alien = lowest_alien_in_column(state, random.randrange(ALIEN_COLUMNS))
    if alien is None:
        return False
    rect = alien_rect(alien, state)
    state["bombs"].append({"x": rect["x"] + rect["width"] / 2, "y": rect["y"] + rect["height"]})
    return True


def bomb_interval(state):
    """How long between bombs, in milliseconds."""
    return max(500, 1500 - (state["wave"] - 1) * 120)


def aliens_have_landed(state):
    """Has the fleet reached the ship's row?"""
    return any(alien["alive"] and alien_rect(alien, state)["y"] + ALIEN_HEIGHT >= SHIP_Y
               for alien in state["aliens"])


def start_wave(state):
    """Put a fresh fleet at the top."""
    state["aliens"] = make_aliens()
    state["fleet_x"] = (FIELD_WIDTH - FLEET_WIDTH) / 2
    state["fleet_y"] = 40
    state["fleet_direction"] = 1
    state["bullets"] = []
    state["bombs"] = []
    state["since_bomb"] = 0


def create_game():
    """Start a brand-new game."""
    state = {
        "ship_x": (FIELD_WIDTH - SHIP_WIDTH) / 2,
        "steering": 0,
        "aliens": [],
        "bullets": [],
        "bombs": [],
        "fleet_x": 0,
        "fleet_y": 40,
        "fleet_direction": 1,
        "since_bomb": 0,
        "lives": START_LIVES,
        "score": 0,
        "wave": 1,
        "shots": 0,
        "is_over": False,
        "is_paused": False,
    }
    start_wave(state)
    return state


def lose_life(state):
    """Take a life, and end the game if that was the last one."""
    state["lives"] -= 1
    state["bombs"] = []
    state["bullets"] = []
    if state["lives"] <= 0:
        state["lives"] = 0
        state["is_over"] = True


def update_game(state, elapsed_ms):
    """One frame of the game."""
    if state["is_over"] or state["is_paused"]:
        return
    seconds = elapsed_ms / 1000

    move_ship(state, seconds)
    move_fleet(state, seconds)

    state["bullets"] = move_bullets(state["bullets"], -BULLET_SPEED * seconds)
    state["bombs"] = move_bullets(state["bombs"], BOMB_SPEED * seconds)

    hit_aliens(state)

    for bomb in state["bombs"]:
        if overlaps(bullet_rect(bomb), ship_rect(state)):
            lose_life(state)
            return

    if aliens_have_landed(state):
        lose_life(state)
        return

    state["since_bomb"] += elapsed_ms
    if state["since_bomb"] >= bomb_interval(state):
        drop_bomb(state)
        state["since_bomb"] = 0

    if aliens_left(state) == 0:
        state["wave"] += 1
        state["score"] += 100
        start_wave(state)


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "fire", "spacebar": "fire", "arrowup": "fire", "w": "fire",
        "p": "pause", "r": "restart",
    }
    return keys.get(str(key).lower())
