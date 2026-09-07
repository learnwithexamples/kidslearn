"""wordfall_rules.py - the rules of Word Rain, in Python.

Words drift down out of the sky. Type one before it reaches the ground. Miss
three and it is over - and the longer you last, the faster they come.

The interesting problem here is not the falling. It is deciding WHICH word you
are typing: there are several on screen, you never pick one, and yet the game
always knows. See matching_word.
"""

import random

FIELD_WIDTH = 340
FIELD_HEIGHT = 400

# where the sky ends and the ground begins
GROUND_Y = 336
SKY_MARGIN = 8

# one letter of the falling words, in pixels
LETTER_WIDTH = 11

START_LIVES = 3
WORDS_PER_LEVEL = 6

# How fast words fall, in pixels per second, and how long between one word and
# the next. These six numbers ARE the difficulty, and they were tuned by
# letting a robot play at a fixed typing speed and seeing how far it got:
#
#     18 WPM -> level 6      36 WPM -> level 12
#     24 WPM -> level 8      96 WPM -> level 20
#
# The ceilings matter as much as the steps. Set MAX_SPEED too low and a fast
# typist never loses at all - at 72 px/s the same robot was still playing after
# ten minutes, because the game had stopped getting harder.
START_SPEED = 22
SPEED_STEP = 4
MAX_SPEED = 130

START_GAP = 2600
GAP_STEP = 140
MIN_GAP = 450

POINTS_PER_LETTER = 10

WORD_POOL = [
    "cat", "dog", "sun", "run", "big", "red", "top", "cup", "hat", "box",
    "egg", "ice", "jam", "key", "log", "map", "net", "owl", "pen", "pig",
    "sky", "toy", "van", "web", "zip", "arm", "bus", "cow", "day", "ear",
    "bird", "cake", "door", "fish", "gold", "hand", "jump", "king", "lamp",
    "moon", "nest", "open", "park", "rain", "star", "tree", "wind", "boat",
    "corn", "duck", "farm", "gate", "horn", "iron", "lake", "milk",
    "apple", "brave", "cloud", "dream", "eagle", "flame", "grape", "house",
    "juice", "knife", "lemon", "mouse", "night", "ocean", "plant", "queen",
    "river", "stone", "tiger", "water", "whale", "zebra", "bread", "chair",
    "basket", "candle", "dragon", "engine", "forest", "garden", "hammer",
    "island", "jungle", "ladder", "market", "orange", "pencil", "rocket",
    "silver", "wizard", "bridge", "circle", "flower", "guitar",
    "balloon", "capture", "diamond", "evening", "fortune", "gallery",
    "harvest", "journey", "kitchen", "machine", "network", "package",
    "rainbow", "thunder", "village", "whisper", "compass", "lantern",
]


def speed_for_level(level):
    """How fast words fall on a given level, in pixels per second.

    ALGORITHM: start at START_SPEED and add SPEED_STEP for every level after
    the first - then put a CEILING on it. Without the ceiling level 30 would
    drop words faster than anybody could read them, and a game nobody can play
    is not a hard game, it is a broken one.
    """
    return min(START_SPEED + (level - 1) * SPEED_STEP, MAX_SPEED)


def gap_for_level(level):
    """How long to wait before dropping the next word, in milliseconds.

    ALGORITHM: the mirror image of speed_for_level. Start at START_GAP and take
    GAP_STEP off for every level - then put a FLOOR under it, or the gap would
    eventually reach zero and the sky would fill up in a single frame.
    """
    return max(START_GAP - (level - 1) * GAP_STEP, MIN_GAP)


def word_width(text):
    """How wide a word is on screen, in pixels.

    ALGORITHM: the words are drawn in a MONOSPACE font, where every letter is
    exactly as wide as every other. That one fact turns measuring text -
    normally a fiddly job - into a multiplication.
    """
    return len(text) * LETTER_WIDTH


def word_for_level(level):
    """Pick a word to drop.

    ALGORITHM: work out the longest word this level is allowed - three letters
    at level 1, one more every two levels, never past seven. Then keep only the
    words that short and pick one at random.
    """
    longest = min(3 + (level - 1) // 2, 7)
    choices = [word for word in WORD_POOL if len(word) <= longest]
    return random.choice(choices)


def make_word(text, x):
    """One word, at the top of the sky."""
    return {"text": text, "x": x, "y": 0}


def spawn_word(state):
    """Drop a new word out of the sky.

    ALGORITHM: pick a word for the level, then pick somewhere across the sky to
    drop it - but only as far right as it can go and still FIT. A long word
    dropped at the right-hand edge would hang off the side of the screen where
    you could not read it.
    """
    text = word_for_level(state["level"])
    room = max(0, FIELD_WIDTH - word_width(text) - SKY_MARGIN * 2)

    word = make_word(text, SKY_MARGIN + random.random() * room)
    state["words"].append(word)
    return word


def move_words(state, seconds):
    """Everything in the sky comes down.

    ALGORITHM: every word falls at this level's speed. Multiplying by the time
    gone by is what makes them fall at the same rate on a fast computer and a
    slow one.
    """
    speed = speed_for_level(state["level"])
    for word in state["words"]:
        word["y"] += speed * seconds


def has_landed(word):
    """Has this word reached the ground?"""
    return word["y"] >= GROUND_Y


def remove_landed_words(state):
    """Anything that reached the ground costs you a life.

    OUTPUT: how many words landed.
    ALGORITHM: build a NEW list of the words still falling, and count the ones
    left out. Taking things out of a list while you are walking along it is how
    you skip one by accident; collecting the keepers into a fresh list simply
    cannot go wrong.
    """
    falling = []
    landed = 0

    for word in state["words"]:
        if has_landed(word):
            landed += 1
        else:
            falling.append(word)
    state["words"] = falling

    if landed > 0:
        state["missed"] += landed
        state["lives"] -= landed
        if state["lives"] <= 0:
            state["lives"] = 0
            state["is_over"] = True
    return landed


def matching_word(state, typed):
    """Which word are you typing? None if none of them match.

    ALGORITHM: of every word that STARTS WITH what you have typed, take the one
    furthest down the screen - the one in the most trouble.

    WHY the game never asks you to choose: you just start typing, and the
    letters themselves say which word you meant. Type "ca" and only the words
    beginning "ca" are still in the running. It is the same idea as a search
    box completing what you type.
    """
    if not typed:
        return None

    best = None
    for word in state["words"]:
        if word["text"].startswith(typed):
            if best is None or word["y"] > best["y"]:
                best = word
    return best


def type_letter(state, letter):
    """Add one letter, if it still spells something.

    OUTPUT: True if the letter was taken.
    ALGORITHM: try the letter first. If no word in the sky begins with the
    result, throw it away and count it as a slip - that way a mistyped letter
    never leaves you stuck spelling a word that is not up there.
    """
    if state["is_over"] or state["is_paused"]:
        return False
    if len(str(letter)) != 1:
        return False

    wanted = state["typed"] + letter
    if matching_word(state, wanted) is None:
        state["slips"] += 1
        return False

    state["typed"] = wanted
    state["keystrokes"] += 1
    return True


def zap_word(state):
    """A finished word disappears in a puff.

    OUTPUT: True if a word was cleared.
    ALGORITHM: only the word you have typed IN FULL counts. Keep every word
    except that very one - `is not` compares the words themselves, not what
    they say, so two identical words never both vanish. Then score, and step up
    a level every WORDS_PER_LEVEL.
    """
    target = matching_word(state, state["typed"])
    if target is None or target["text"] != state["typed"]:
        return False

    state["words"] = [word for word in state["words"] if word is not target]
    state["score"] += len(target["text"]) * POINTS_PER_LETTER
    state["cleared"] += 1
    state["typed"] = ""

    if state["cleared"] % WORDS_PER_LEVEL == 0:
        state["level"] += 1
    return True


def backspace(state):
    """Rub out the last letter typed."""
    if state["is_over"] or not state["typed"]:
        return False
    state["typed"] = state["typed"][:-1]
    return True


def clear_typed(state):
    """Give up on this word and start again."""
    state["typed"] = ""


def new_game(state):
    """An empty sky and a fresh three lives."""
    state["words"] = []
    state["typed"] = ""
    state["score"] = 0
    state["level"] = 1
    state["cleared"] = 0
    state["missed"] = 0
    state["keystrokes"] = 0
    state["slips"] = 0
    state["lives"] = START_LIVES
    state["since_drop"] = 0
    state["is_over"] = False
    spawn_word(state)


def create_game():
    """Start a brand-new game."""
    state = {"best": 0, "is_paused": False}
    new_game(state)
    return state


def update_game(state, elapsed_ms):
    """One frame of the game."""
    if state["is_over"] or state["is_paused"]:
        return
    seconds = elapsed_ms / 1000

    state["since_drop"] += elapsed_ms
    if state["since_drop"] >= gap_for_level(state["level"]):
        state["since_drop"] = 0
        spawn_word(state)

    move_words(state, seconds)
    remove_landed_words(state)

    # the word you were halfway through may have just hit the ground
    if state["typed"] and matching_word(state, state["typed"]) is None:
        state["typed"] = ""

    if state["is_over"] and state["score"] > state["best"]:
        state["best"] = state["score"]


def toggle_pause(state):
    """Freeze or unfreeze the sky."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    k = str(key)

    if k == " " or k.lower() == "spacebar":
        return "clear"
    if k.lower() == "backspace":
        return "back"
    if k.lower() == "enter":
        return "new"
    if k.lower() == "escape":
        return "pause"

    if len(k) == 1 and "a" <= k <= "z":
        return k
    if len(k) == 1 and "A" <= k <= "Z":
        return k.lower()

    return None
