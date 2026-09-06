"""simon_rules.py - the rules of Simon Says, in Python.

Four pads. The game flashes a sequence, then you play it back; every round it
grows by one and the flashes get quicker.

The game is always in one of three PHASES: "watch", "play" or "over".
"""

import random

PAD_COUNT = 4


def random_pad():
    """Pick one of the four pads (0 to 3)."""
    return random.randrange(PAD_COUNT)


def add_step(sequence):
    """Make the sequence one longer.

    INPUT:  sequence. OUTPUT: a NEW list with one more random pad on the end.
    """
    return list(sequence) + [random_pad()]


def is_correct_so_far(sequence, input_pads):
    """Is the player's answer still right?

    INPUT:  sequence - what the game flashed. input_pads - what was pressed.
    OUTPUT: True while every pad pressed matches the sequence.
    ALGORITHM: the input cannot be longer than the sequence, and every pad
    must match the one in the same place. An empty input is fine.
    """
    if len(input_pads) > len(sequence):
        return False
    return all(pad == sequence[i] for i, pad in enumerate(input_pads))


def is_round_complete(sequence, input_pads):
    """Has the player repeated the whole sequence?"""
    return is_correct_so_far(sequence, input_pads) and len(input_pads) == len(sequence)


def flash_interval(round_number):
    """How long each flash lasts, in milliseconds.

    ALGORITHM: 620 ms in round 1, 25 ms quicker each round, never below 260.
    """
    return max(260, 620 - (round_number - 1) * 25)


def score_for_round(round_number):
    """How many points is finishing a round worth? 10 per pad remembered."""
    return 10 * round_number


def create_game():
    """Start a brand-new game, already flashing the first pad."""
    sequence = add_step([])
    return {
        "sequence": sequence,
        "input": [],
        "round": 1,
        "score": 0,
        "phase": "watch",
        "flash_index": 0,
        "flash_on": True,
        "flash_timer": 0,
        "lit": sequence[0],
        "is_over": False,
        "is_paused": False,
    }


def press_pad(state, pad):
    """The player presses one pad.

    ALGORITHM: only during the player's turn; add the pad, light it, end the
    game if it is wrong, and start the next round if it completes the sequence.
    """
    if state["phase"] != "play" or state["is_over"] or state["is_paused"]:
        return False

    state["input"].append(pad)
    state["lit"] = pad
    state["flash_timer"] = 0

    if not is_correct_so_far(state["sequence"], state["input"]):
        state["phase"] = "over"
        state["is_over"] = True
        return True

    if is_round_complete(state["sequence"], state["input"]):
        state["score"] += score_for_round(state["round"])
        state["round"] += 1
        state["sequence"] = add_step(state["sequence"])
        state["input"] = []
        state["phase"] = "watch"
        state["flash_index"] = 0
        state["flash_on"] = True
        state["lit"] = state["sequence"][0]
    return True


def update_game(state, elapsed_ms):
    """Let time pass (called about 60 times a second).

    ALGORITHM: while the game is flashing, count the timer up; each time it
    passes this round's interval, either turn the pad off (a gap) or move on to
    the next pad. After the last flash it becomes the player's turn.
    """
    if state["is_over"] or state["is_paused"]:
        return

    if state["phase"] == "watch":
        state["flash_timer"] += elapsed_ms
        if state["flash_timer"] >= flash_interval(state["round"]):
            state["flash_timer"] = 0
            if state["flash_on"]:
                state["flash_on"] = False
                state["lit"] = -1
            else:
                state["flash_on"] = True
                state["flash_index"] += 1
                if state["flash_index"] >= len(state["sequence"]):
                    state["phase"] = "play"
                    state["lit"] = -1
                else:
                    state["lit"] = state["sequence"][state["flash_index"]]
        if state["phase"] == "watch" and state["flash_on"]:
            state["lit"] = state["sequence"][state["flash_index"]]
    elif state["lit"] != -1:
        state["flash_timer"] += elapsed_ms
        if state["flash_timer"] > 220:
            state["lit"] = -1
            state["flash_timer"] = 0


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "1": "pad0", "q": "pad0", "arrowleft": "pad0",
        "2": "pad1", "w": "pad1", "arrowup": "pad1",
        "3": "pad2", "a": "pad2", "arrowdown": "pad2",
        "4": "pad3", "s": "pad3", "arrowright": "pad3",
        "p": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
