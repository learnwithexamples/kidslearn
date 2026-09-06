"""reaction_rules.py - the rules of Reaction Test, in Python.

Wait for the signal, then press as fast as you can. Press too early and it
does not count.

This is the smallest game in the collection, and it is built entirely out of
one idea: a PHASE. The game is always in exactly one of five states, and every
rule begins by asking which.

    ready    - press to begin
    waiting  - the signal has not come yet. DO NOT PRESS.
    go       - press NOW
    result   - here is how fast you were
    toosoon  - you jumped the gun
"""

import random

SHORTEST_WAIT = 1500        # milliseconds
LONGEST_WAIT = 4500
HISTORY_LENGTH = 8


def random_delay():
    """How long to wait before the signal, in milliseconds.

    ALGORITHM: a random amount between the two limits. It has to be random, or
    after three goes the player would simply learn the rhythm and press on the
    beat without ever looking.
    """
    return random.uniform(SHORTEST_WAIT, LONGEST_WAIT)


def rating(milliseconds):
    """A friendly word for how fast that was.

    ALGORITHM: bands, from fastest to slowest. The order matters - the first
    one that matches wins, so they must go quickest first.
    """
    if milliseconds < 200:
        return "lightning!"
    if milliseconds < 250:
        return "very quick"
    if milliseconds < 320:
        return "quick"
    if milliseconds < 400:
        return "not bad"
    if milliseconds < 550:
        return "a bit slow"
    return "were you asleep?"


def average_time(state):
    """The average of the recent goes, or 0 if there are none yet.

    ALGORITHM: add the times up and divide by how many there are - but check
    for an empty list FIRST, or you are dividing by zero.
    """
    if not state["times"]:
        return 0
    return round(sum(state["times"]) / len(state["times"]))


def best_time(state):
    """The fastest go so far, or 0 if there are none."""
    if not state["times"]:
        return 0
    return min(state["times"])


def start_waiting(state):
    """Arm the test and pick a fresh delay."""
    state["phase"] = "waiting"
    state["wait_for"] = random_delay()
    state["elapsed"] = 0
    state["last_time"] = 0


def press(state):
    """The only thing the player can do.

    OUTPUT: the phase the game has moved into.
    ALGORITHM: what a press means depends entirely on the phase.
      ready    -> start waiting
      waiting  -> too soon! this does not count
      go       -> stop the clock, remember the time, show the result
      anything else -> go again
    """
    if state["is_paused"]:
        return state["phase"]

    if state["phase"] == "ready":
        start_waiting(state)
    elif state["phase"] == "waiting":
        state["phase"] = "toosoon"
        state["false_starts"] += 1
    elif state["phase"] == "go":
        state["last_time"] = round(state["elapsed"])
        state["times"].append(state["last_time"])
        if len(state["times"]) > HISTORY_LENGTH:
            state["times"].pop(0)
        state["attempts"] += 1
        state["phase"] = "result"
    else:
        start_waiting(state)
    return state["phase"]


def update_game(state, elapsed_ms):
    """The clock, which does two quite different jobs.

    ALGORITHM: while waiting, count up to the delay and then give the signal -
    resetting the clock so it can start timing the player. Once on 'go', the
    same clock is measuring how long they are taking.
    """
    if state["is_paused"]:
        return

    if state["phase"] == "waiting":
        state["elapsed"] += elapsed_ms
        if state["elapsed"] >= state["wait_for"]:
            state["phase"] = "go"
            state["elapsed"] = 0
    elif state["phase"] == "go":
        state["elapsed"] += elapsed_ms


def create_game():
    """Start a brand-new game."""
    return {
        "phase": "ready",
        "wait_for": 0,
        "elapsed": 0,
        "last_time": 0,
        "times": [],
        "attempts": 0,
        "false_starts": 0,
        "is_paused": False,
    }


def new_game(state):
    """Clear the scores and start again."""
    state["phase"] = "ready"
    state["wait_for"] = 0
    state["elapsed"] = 0
    state["last_time"] = 0
    state["times"] = []
    state["attempts"] = 0
    state["false_starts"] = 0


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        " ": "press", "spacebar": "press", "enter": "press",
        "r": "new", "p": "pause",
    }
    return keys.get(str(key).lower())
