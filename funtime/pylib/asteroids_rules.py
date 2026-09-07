"""asteroids_rules.py - the rules of Asteroids, in Python.

A ship drifting in space. Turn it, push it, shoot the rocks - and every rock
you hit breaks into smaller, faster ones.

Two ideas run through this whole file:
  * ANGLES. The ship points somewhere, and turning that direction into an
    actual x and y is what cos and sin are for.
  * WRAPPING. Space has no walls. Fly off one edge and you come back on the
    other, which makes the field a loop in both directions.
"""

import math
import random

FIELD_WIDTH = 340
FIELD_HEIGHT = 340

SHIP_RADIUS = 9
TURN_SPEED = 3.6            # radians per second
THRUST = 190                # pixels per second, per second
MAX_SPEED = 260
DRIFT_SLOWDOWN = 0.4

BULLET_SPEED = 320
BULLET_LIFE = 1.1
MAX_BULLETS = 4

ROCK_CORNERS = 9            # how many corners a rock's outline has
BIG_ROCK = 3
ROCK_RADIUS = {3: 26, 2: 16, 1: 9}
ROCK_SCORE = {3: 20, 2: 50, 1: 100}
ROCK_SPEED = {3: 34, 2: 52, 1: 74}

START_LIVES = 3
SHIELD_SECONDS = 2


def point_from(x, y, angle, distance):
    """Where do you end up going a certain way for a certain distance?

    ALGORITHM: the one piece of trigonometry the whole game needs. cos(angle)
    is how much of the direction is sideways, sin(angle) is how much is up and
    down. Multiply each by the distance and add them on.

    Angle 0 points RIGHT. A quarter turn points DOWN, because y grows
    downwards on a canvas.
    """
    return {
        "x": x + math.cos(angle) * distance,
        "y": y + math.sin(angle) * distance,
    }


def wrap_position(thing):
    """Space has no edges.

    ALGORITHM: off the left, come back on the right; off the top, come back at
    the bottom. Doing it with `while` rather than `if` means it still works
    for something that has jumped a long way in one go.
    """
    while thing["x"] < 0:
        thing["x"] += FIELD_WIDTH
    while thing["x"] >= FIELD_WIDTH:
        thing["x"] -= FIELD_WIDTH
    while thing["y"] < 0:
        thing["y"] += FIELD_HEIGHT
    while thing["y"] >= FIELD_HEIGHT:
        thing["y"] -= FIELD_HEIGHT


def distance_between(a, b):
    """How far apart are two things? Pythagoras."""
    across = a["x"] - b["x"]
    down = a["y"] - b["y"]
    return math.sqrt(across * across + down * down)


def touches(a, b, radius_a, radius_b):
    """Are two round things overlapping?

    ALGORITHM: circles touch when they are closer than their radii added up.
    Much simpler than rectangles, which is why space games use it.
    """
    return distance_between(a, b) < radius_a + radius_b


def speed_of(thing):
    """How fast is this thing going, in total?

    ALGORITHM: Pythagoras again. dx and dy are the two short sides of a right
    triangle and the speed is the long one - exactly the same sum as
    distance_between, asked about a SPEED rather than a place.
    """
    return math.sqrt(thing["dx"] ** 2 + thing["dy"] ** 2)


def clamp_speed(thing, limit):
    """Put a ceiling on how fast something may travel.

    OUTPUT: True if it had to be slowed down.
    ALGORITHM: work out the speed. If it is over the limit, scale BOTH dx and
    dy by the same fraction - limit / speed. Scaling both by the same amount
    is what keeps the direction unchanged; the ship slows down without being
    nudged off course.
    """
    speed = speed_of(thing)
    if speed <= limit:
        return False
    thing["dx"] = thing["dx"] / speed * limit
    thing["dy"] = thing["dy"] / speed * limit
    return True


def turn_ship(ship, turning, seconds):
    """Swing the nose round.

    ALGORITHM: add turning x TURN_SPEED x seconds, then fold the answer back
    into the range -pi to pi.

    WHY fold it: spin one way for five minutes and the angle would climb into
    the thousands. cos and sin would still work, but every number you printed
    would be nonsense. Python's % always returns a positive answer, which
    makes this tidier here than it is in JavaScript.
    """
    whole = math.pi * 2
    angle = ship["angle"] + turning * TURN_SPEED * seconds
    ship["angle"] = (angle + math.pi) % whole - math.pi


def drift_ship(ship, seconds):
    """Space is not quite empty.

    ALGORITHM: multiply the speed by a shade less than 1. Note it is
    (1 - rate x seconds) rather than a flat 0.99: tie it to the time and the
    ship drifts the same on a fast computer and a slow one.

    Real space would not do this. The game does, because a ship that never
    slows down is exhausting to fly.
    """
    slow = 1 - DRIFT_SLOWDOWN * seconds
    ship["dx"] *= slow
    ship["dy"] *= slow


def thrust_ship(ship, seconds):
    """Push the ship along the way it is pointing.

    ALGORITHM: the engine does not move the ship - it changes the ship's
    SPEED, the way gravity did in Flappy. Add cos and sin of the angle, each
    times THRUST times seconds. Then cap the total speed.

    WHY it feels the way it does: the ship keeps its old speed too. Turn round
    and thrust and you do not stop - you slow down, then go the other way.
    """
    ship["dx"] += math.cos(ship["angle"]) * THRUST * seconds
    ship["dy"] += math.sin(ship["angle"]) * THRUST * seconds

    clamp_speed(ship, MAX_SPEED)


def make_bullet(ship):
    """One shot, leaving the nose of the ship.

    ALGORITHM: the shot starts at the NOSE, not the middle, or you would shoot
    yourself. It flies at BULLET_SPEED in the direction the ship is pointing -
    PLUS the ship's own speed, so a shot fired while racing forwards really
    does travel faster.
    """
    nose = point_from(ship["x"], ship["y"], ship["angle"], SHIP_RADIUS + 3)
    flight = point_from(0, 0, ship["angle"], BULLET_SPEED)

    return {
        "x": nose["x"],
        "y": nose["y"],
        "dx": flight["x"] + ship["dx"],
        "dy": flight["y"] + ship["dy"],
        "life": BULLET_LIFE,
    }


def fire_bullet(state):
    """Shoot, if the rules allow it.

    ALGORITHM: three reasons to refuse - the game is over, it is paused, or
    there are already MAX_BULLETS in the air.
    """
    if state["is_over"] or state["is_paused"] or len(state["bullets"]) >= MAX_BULLETS:
        return False
    state["bullets"].append(make_bullet(state["ship"]))
    state["shots"] += 1
    return True


def age_bullets(bullets, seconds):
    """A shot does not fly for ever.

    OUTPUT: a NEW list, holding only the ones still alive.
    ALGORITHM: take the time off every bullet's life, and keep the ones with
    anything left. Without this the screen slowly fills with old shots and you
    could clear a wave without aiming.
    """
    flying = []
    for bullet in bullets:
        bullet["life"] -= seconds
        if bullet["life"] > 0:
            flying.append(bullet)
    return flying


def make_rock(x, y, size):
    """One rock of a given size, drifting in a random direction."""
    angle = random.uniform(0, math.pi * 2)
    drift = point_from(0, 0, angle, ROCK_SPEED[size])
    return {
        "x": x, "y": y, "size": size,
        "dx": drift["x"], "dy": drift["y"],
        "spin": random.uniform(-1, 1),
        "wobble": random.randrange(1000),
    }


def rock_points(rock):
    """The corners of one rock's outline.

    OUTPUT: a list of ROCK_CORNERS points, all the way round.
    ALGORITHM: walk right round the circle in equal steps. At each step push
    the corner in or out a little, so the rock is lumpy rather than a perfect
    circle. The wobble number decides how - so every rock has its own shape,
    and always the same one.

    This is the drawing turned into DATA. The picture is then just "join these
    points up", which is a great deal easier to test than a drawing.
    """
    radius = ROCK_RADIUS[rock["size"]]
    points = []

    for i in range(ROCK_CORNERS):
        angle = i / ROCK_CORNERS * math.pi * 2 + rock["wobble"]
        lumpy = radius * (0.78 + 0.22 * abs(math.sin(i * 2.3 + rock["wobble"])))
        points.append(point_from(rock["x"], rock["y"], angle, lumpy))
    return points


def split_rock(rock):
    """What a rock leaves behind when it is shot.

    OUTPUT: a list of the smaller rocks - empty if it was already the smallest.
    ALGORITHM: a big rock becomes TWO of the next size down, in the same place
    but drifting their own ways.

    WHY it matters: shooting a big rock makes the screen busier, not emptier.
    That is the whole shape of the game - it gets harder as you win.
    """
    if rock["size"] <= 1:
        return []
    return [make_rock(rock["x"], rock["y"], rock["size"] - 1),
            make_rock(rock["x"], rock["y"], rock["size"] - 1)]


def hit_rocks(state):
    """Check every shot against every rock.

    OUTPUT: how many rocks were hit this frame.
    ALGORITHM: for each bullet, find the first rock it touches. That rock is
    replaced by whatever it splits into, the bullet is used up, and the score
    goes up - smaller rocks are worth MORE, because they are harder to hit.
    """
    surviving = []
    hits = 0

    for bullet in state["bullets"]:
        hit_index = -1
        for r, rock in enumerate(state["rocks"]):
            if touches(bullet, rock, 1, ROCK_RADIUS[rock["size"]]):
                hit_index = r
                break

        if hit_index == -1:
            surviving.append(bullet)
        else:
            rock = state["rocks"].pop(hit_index)
            state["score"] += ROCK_SCORE[rock["size"]]
            state["rocks"].extend(split_rock(rock))
            hits += 1

    state["bullets"] = surviving
    return hits


def ship_is_hit(state):
    """Has a rock caught the ship?"""
    if state["shield"] > 0:
        return False
    return any(touches(state["ship"], rock, SHIP_RADIUS, ROCK_RADIUS[rock["size"]])
               for rock in state["rocks"])


def start_wave(state):
    """A ring of big rocks around the edge, away from the ship."""
    state["rocks"] = []
    count = 3 + state["wave"]
    for i in range(count):
        angle = i / count * math.pi * 2
        spot = point_from(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, angle, 130)
        state["rocks"].append(make_rock(spot["x"], spot["y"], BIG_ROCK))
    state["bullets"] = []


def reset_ship(state):
    """Put the ship back in the middle, with a moment of shield."""
    state["ship"] = {
        "x": FIELD_WIDTH / 2, "y": FIELD_HEIGHT / 2,
        "angle": -math.pi / 2, "dx": 0, "dy": 0,
    }
    state["shield"] = SHIELD_SECONDS
    state["turning"] = 0
    state["thrusting"] = False


def create_game():
    """Start a brand-new game."""
    state = {
        "ship": None, "rocks": [], "bullets": [],
        "turning": 0, "thrusting": False, "shield": 0,
        "lives": START_LIVES, "score": 0, "wave": 1, "shots": 0,
        "is_over": False, "is_paused": False,
    }
    reset_ship(state)
    start_wave(state)
    return state


def move_thing(thing, seconds):
    """Carry something along by its own speed, and wrap it."""
    thing["x"] += thing["dx"] * seconds
    thing["y"] += thing["dy"] * seconds
    wrap_position(thing)


def update_game(state, elapsed_ms):
    """One frame of the game."""
    if state["is_over"] or state["is_paused"]:
        return
    seconds = elapsed_ms / 1000

    turn_ship(state["ship"], state["turning"], seconds)
    if state["thrusting"]:
        thrust_ship(state["ship"], seconds)
    else:
        drift_ship(state["ship"], seconds)
    move_thing(state["ship"], seconds)

    for rock in state["rocks"]:
        move_thing(rock, seconds)
        rock["wobble"] += rock["spin"] * seconds

    for bullet in state["bullets"]:
        move_thing(bullet, seconds)
    state["bullets"] = age_bullets(state["bullets"], seconds)

    hit_rocks(state)

    if state["shield"] > 0:
        state["shield"] -= seconds
    elif ship_is_hit(state):
        state["lives"] -= 1
        if state["lives"] <= 0:
            state["lives"] = 0
            state["is_over"] = True
        else:
            reset_ship(state)
        return

    if not state["rocks"]:
        state["wave"] += 1
        state["score"] += 100
        start_wave(state)
        state["shield"] = SHIELD_SECONDS


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        "arrowup": "thrust", "w": "thrust",
        " ": "fire", "spacebar": "fire",
        "p": "pause", "r": "restart",
    }
    return keys.get(str(key).lower())
