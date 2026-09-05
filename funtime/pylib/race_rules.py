"""race_rules.py - the rules of the car racing game, written in Python.

The same game as funtime/race.html. Unlike Snake and Tetris there is no grid
here: cars sit at real pixel positions and slide smoothly.

A CAR is a dictionary describing a rectangle:

    {"x": 38, "y": 120, "width": 44, "height": 74, "lane": 0}

    x, y = the TOP-LEFT corner, in pixels
"""

import random

ROAD_WIDTH = 300
ROAD_HEIGHT = 500
EDGE_WIDTH = 15
LANE_COUNT = 3
LANE_WIDTH = (ROAD_WIDTH - EDGE_WIDTH * 2) / LANE_COUNT

CAR_WIDTH = 44
CAR_HEIGHT = 74

PLAYER_Y = ROAD_HEIGHT - CAR_HEIGHT - 24
PLAYER_MIN_X = EDGE_WIDTH
PLAYER_MAX_X = ROAD_WIDTH - EDGE_WIDTH - CAR_WIDTH

STEER_SPEED = 300          # pixels per second
STRIPE_PERIOD = 60         # how long a road dash plus its gap is
BOOST_FAST = 1.6
BOOST_SLOW = 0.55


def lane_center_x(lane):
    """The middle of one lane, in pixels from the left.

    INPUT:  lane - 0, 1 or 2. OUTPUT: the x of the middle of that lane.
    ALGORITHM: skip the verge, skip the lanes before this one, add half a lane.
    """
    return EDGE_WIDTH + lane * LANE_WIDTH + LANE_WIDTH / 2


def clamp(value, low, high):
    """Keep a number between two limits.

    INPUT:  value, low, high. OUTPUT: value squeezed into range.
    ALGORITHM: Python can do this in one line with min and max.
    """
    return max(low, min(high, value))


def create_car(lane, y):
    """Build one car in a lane.

    INPUT:  lane, y. OUTPUT: a car dictionary.
    ALGORITHM: the left edge is half a car-width left of the lane's middle.
    """
    return {
        "x": lane_center_x(lane) - CAR_WIDTH / 2,
        "y": y,
        "width": CAR_WIDTH,
        "height": CAR_HEIGHT,
        "lane": lane,
    }


def overlaps(a, b):
    """Do two rectangles touch?

    INPUT:  a, b - two rectangles. OUTPUT: True if they overlap.
    ALGORITHM: think about the GAPS. They miss each other if one is fully left,
    fully right, fully above or fully below the other. Flip all four round and
    join them with "and".
    """
    return (a["x"] < b["x"] + b["width"] and
            a["x"] + a["width"] > b["x"] and
            a["y"] < b["y"] + b["height"] and
            a["y"] + a["height"] > b["y"])


def is_on_screen(car):
    """Is this car still somewhere on the road?

    INPUT:  car. OUTPUT: True while its top edge is above the bottom.
    """
    return car["y"] < ROAD_HEIGHT


def random_lane():
    """Pick one of the lanes at random."""
    return random.randrange(LANE_COUNT)


def create_player_car():
    """The car you drive, in the middle lane at the bottom."""
    return create_car(1, PLAYER_Y)


def create_game():
    """Start a brand-new race.

    INPUT:  nothing. OUTPUT: the state dictionary.
    """
    return {
        "player": create_player_car(),
        "cars": [],
        "steering": 0,
        "boost": 1,
        "distance": 0,
        "passed": 0,
        "score": 0,
        "level": 1,
        "since_spawn": 0,
        "stripe_offset": 0,
        "is_over": False,
        "is_paused": False,
    }


def steer_player(state, seconds):
    """Slide the player's car sideways.

    INPUT:  state, seconds - how long this frame took
    OUTPUT: nothing; it changes state["player"]["x"]
    ALGORITHM: move by steering x STEER_SPEED x seconds, then clamp so the car
    can never reach the verge.
    """
    moved = state["player"]["x"] + state["steering"] * STEER_SPEED * seconds
    state["player"]["x"] = clamp(moved, PLAYER_MIN_X, PLAYER_MAX_X)


def move_cars(cars, distance):
    """Slide every traffic car down the road.

    INPUT:  cars, distance. OUTPUT: a NEW list of cars, further down.
    ALGORITHM: build a new dictionary per car with y + distance.
    """
    return [{"x": car["x"], "y": car["y"] + distance,
             "width": car["width"], "height": car["height"], "lane": car["lane"]}
            for car in cars]


def keep_cars_on_screen(cars):
    """Throw away the cars that have driven off the bottom.

    INPUT:  cars. OUTPUT: a NEW list holding only the visible ones.
    """
    return [car for car in cars if is_on_screen(car)]


def spawn_car(state):
    """Send a new car onto the road, just above the top edge.

    INPUT:  state. OUTPUT: nothing.
    ALGORITHM: list every lane except the one the last car used, pick one at
    random, and add a car there at y = -CAR_HEIGHT.
    """
    last_car = state["cars"][-1] if state["cars"] else None
    choices = [lane for lane in range(LANE_COUNT)
               if last_car is None or lane != last_car["lane"]]
    state["cars"].append(create_car(random.choice(choices), -CAR_HEIGHT))


def has_crashed(state):
    """Has the player hit anything?

    INPUT:  state. OUTPUT: True if the player overlaps any traffic car.
    ALGORITHM: any() asks "is this true of at least one of them?" in one word.
    """
    return any(overlaps(state["player"], car) for car in state["cars"])


def score_for_pass(level):
    """How many points is overtaking one car worth?"""
    return 10 * level


def level_for_passed(passed):
    """Which level has this many overtakes earned?"""
    return passed // 5 + 1


def speed_for_level(level):
    """How fast does the road rush past, in pixels per second?

    ALGORITHM: 180 at level 1, 35 faster each level, never above 520.
    """
    return min(520, 180 + (level - 1) * 35)


def seconds_between_cars(level):
    """How much thinking time the driver gets.

    ALGORITHM: 1.6 seconds at level 1, a tenth less each level, never under
    0.8 - because swerving a lane takes about 0.3 seconds, and a game you
    cannot possibly survive is not a game.
    """
    return max(0.8, 1.6 - (level - 1) * 0.1)


def spawn_gap_for_level(level):
    """How far apart the traffic cars are, in pixels.

    ALGORITHM: distance = speed x time, the same sum you use for car journeys.
    """
    return speed_for_level(level) * seconds_between_cars(level)


def update_race(state, elapsed_ms):
    """One frame of the race. The heart of the game.

    INPUT:  state, elapsed_ms. OUTPUT: nothing.
    ALGORITHM:
      1. Do nothing if the race is over or paused.
      2. Work out how far the road moves: speed x boost x seconds.
      3. Steer, move the traffic, and drop the cars that have gone past.
      4. Every dropped car is one you overtook: count, score, level up.
      5. Add the distance, scroll the markings, and send a new car when the gap
         has been driven.
      6. Finally, check for a crash.
    """
    if state["is_over"] or state["is_paused"]:
        return

    seconds = elapsed_ms / 1000
    travelled = speed_for_level(state["level"]) * state["boost"] * seconds

    steer_player(state, seconds)
    state["cars"] = move_cars(state["cars"], travelled)

    before = len(state["cars"])
    state["cars"] = keep_cars_on_screen(state["cars"])
    overtaken = before - len(state["cars"])
    if overtaken > 0:
        state["passed"] += overtaken
        state["score"] += score_for_pass(state["level"]) * overtaken
        state["level"] = level_for_passed(state["passed"])

    state["distance"] += travelled
    state["stripe_offset"] = (state["stripe_offset"] + travelled) % STRIPE_PERIOD

    state["since_spawn"] += travelled
    if state["since_spawn"] >= spawn_gap_for_level(state["level"]):
        spawn_car(state)
        state["since_spawn"] = 0

    if has_crashed(state):
        state["is_over"] = True


def toggle_pause(state):
    """Freeze or unfreeze the race."""
    if state["is_over"]:
        return
    state["is_paused"] = not state["is_paused"]


def metres_driven(state):
    """The distance in something friendlier than pixels: 10 pixels is 1 metre."""
    return int(state["distance"] // 10)


def action_for_key(key):
    """Turn a keyboard key into the name of a driving action.

    INPUT:  key. OUTPUT: "left", "right", "faster", "slower", "pause",
            "restart" - or None.
    """
    keys = {
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        "arrowup": "faster", "w": "faster",
        "arrowdown": "slower", "s": "slower",
        "p": "pause", " ": "pause", "spacebar": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())


def steering_from_input(held):
    """Which way is the driver steering?

    INPUT:  held - a dictionary of which keys are down
    OUTPUT: -1 for left, 1 for right, 0 for straight ahead
    """
    return (1 if held.get("right") else 0) - (1 if held.get("left") else 0)


def boost_from_input(held):
    """How hard is the driver on the pedals?

    INPUT:  held. OUTPUT: BOOST_FAST, BOOST_SLOW or 1 (braking wins).
    """
    if held.get("slower"):
        return BOOST_SLOW
    if held.get("faster"):
        return BOOST_FAST
    return 1
