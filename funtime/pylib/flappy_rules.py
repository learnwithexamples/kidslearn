"""flappy_rules.py - the rules of Flappy, in Python.

A bird falls. Tapping makes it flap upwards. Pipes slide past, and you have to
fit through the gaps.

The whole game is two ideas: GRAVITY pulling the bird down a little more every
frame, and RECTANGLES that must not overlap.
"""

import random

FIELD_WIDTH = 300
FIELD_HEIGHT = 420
GROUND_Y = 388

BIRD_X = 70
BIRD_SIZE = 22
GRAVITY = 900
FLAP_SPEED = -305
MAX_FALL_SPEED = 420

PIPE_WIDTH = 46
GAP_HEIGHT = 122
GAP_MARGIN = 44
PIPE_SPACING = 172
BASE_PIPE_SPEED = 118


def pipe_speed(level):
    """How fast the pipes slide past on this level.

    ALGORITHM: 118 to start, 9 faster each level, never above 240.
    """
    return min(240, BASE_PIPE_SPEED + (level - 1) * 9)


def level_for_score(score):
    """The level you have reached - one every 5 pipes."""
    return score // 5 + 1


def bird_rect(bird):
    """The bird as a rectangle, so it can be tested against pipes."""
    return {"x": BIRD_X, "y": bird["y"], "width": BIRD_SIZE, "height": BIRD_SIZE}


def make_pipe(x):
    """One pipe, with its gap in a random place.

    OUTPUT: a dict with x, gap_y and passed.
    ALGORITHM: gap_y is the TOP of the gap, never closer than GAP_MARGIN to the
    ceiling or the ground, so every pipe can be flown through.
    """
    highest = GAP_MARGIN
    lowest = GROUND_Y - GAP_HEIGHT - GAP_MARGIN
    return {"x": x, "gap_y": random.uniform(highest, lowest), "passed": False}


def pipe_rects(pipe):
    """The two solid parts of a pipe, as rectangles.

    ALGORITHM: the top piece runs from the ceiling down to the gap; the bottom
    piece runs from the end of the gap down to the ground.
    """
    return {
        "top": {"x": pipe["x"], "y": 0, "width": PIPE_WIDTH, "height": pipe["gap_y"]},
        "bottom": {
            "x": pipe["x"],
            "y": pipe["gap_y"] + GAP_HEIGHT,
            "width": PIPE_WIDTH,
            "height": GROUND_Y - (pipe["gap_y"] + GAP_HEIGHT),
        },
    }


def overlaps(a, b):
    """Do two rectangles touch?

    ALGORITHM: they MISS if one is completely left of, right of, above or below
    the other. If none of those four escapes is true, they touch.
    """
    return (a["x"] < b["x"] + b["width"]
            and a["x"] + a["width"] > b["x"]
            and a["y"] < b["y"] + b["height"]
            and a["y"] + a["height"] > b["y"])


def apply_gravity(bird, seconds):
    """The bird falls.

    ALGORITHM: gravity does not move the bird - it changes its SPEED. Add
    GRAVITY x seconds to dy, cap dy at MAX_FALL_SPEED, and only then move the
    bird by dy x seconds.
    """
    bird["dy"] += GRAVITY * seconds
    if bird["dy"] > MAX_FALL_SPEED:
        bird["dy"] = MAX_FALL_SPEED
    bird["y"] += bird["dy"] * seconds


def flap(bird):
    """The only thing the player can do.

    ALGORITHM: SET dy to FLAP_SPEED - do not add to it. Setting it means every
    flap feels the same whether the bird was rising or plummeting.
    """
    bird["dy"] = FLAP_SPEED


def move_pipes(pipes, distance):
    """Slide the pipes left and forget the ones that have gone.

    OUTPUT: a NEW list of pipes.
    """
    moved = []
    for pipe in pipes:
        shifted = {"x": pipe["x"] - distance, "gap_y": pipe["gap_y"], "passed": pipe["passed"]}
        if shifted["x"] + PIPE_WIDTH > 0:
            moved.append(shifted)
    return moved


def hits_pipe(bird, pipe):
    """Has the bird flown into this pipe?"""
    rects = pipe_rects(pipe)
    return overlaps(bird_rect(bird), rects["top"]) or overlaps(bird_rect(bird), rects["bottom"])


def is_crashed(state):
    """Is the game over? The ground counts, the ceiling counts, pipes count."""
    if state["bird"]["y"] + BIRD_SIZE >= GROUND_Y:
        return True
    if state["bird"]["y"] < 0:
        return True
    return any(hits_pipe(state["bird"], pipe) for pipe in state["pipes"])


def score_passed_pipes(state):
    """Count the pipes the bird has just got through.

    ALGORITHM: a pipe scores once the bird is past its right-hand edge. The
    "passed" flag is what stops it scoring again on the next frame.
    """
    for pipe in state["pipes"]:
        if not pipe["passed"] and pipe["x"] + PIPE_WIDTH < BIRD_X:
            pipe["passed"] = True
            state["score"] += 1


def create_game():
    """Start a brand-new game."""
    return {
        "bird": {"y": 130, "dy": 0},
        "pipes": [make_pipe(FIELD_WIDTH + 40)],
        "since_last_pipe": 0,
        "score": 0,
        "is_over": False,
        "is_paused": True,
    }


def current_level(state):
    """The level the player has reached."""
    return level_for_score(state["score"])


def update_game(state, elapsed_ms):
    """One frame of the game."""
    if state["is_over"] or state["is_paused"]:
        return
    seconds = elapsed_ms / 1000
    distance = pipe_speed(current_level(state)) * seconds

    apply_gravity(state["bird"], seconds)
    state["pipes"] = move_pipes(state["pipes"], distance)

    state["since_last_pipe"] += distance
    if state["since_last_pipe"] >= PIPE_SPACING:
        state["pipes"].append(make_pipe(FIELD_WIDTH + PIPE_WIDTH))
        state["since_last_pipe"] = 0

    score_passed_pipes(state)

    if is_crashed(state):
        state["is_over"] = True


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        " ": "flap", "spacebar": "flap", "arrowup": "flap", "w": "flap",
        "p": "pause", "r": "restart",
    }
    return keys.get(str(key).lower())
