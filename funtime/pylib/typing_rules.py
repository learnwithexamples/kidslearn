"""typing_rules.py - the rules of Typing Race, in Python.

A line of words appears. Type them, space between each one, as fast and as
accurately as you can.

This game has no monsters and nothing to dodge. What it has instead is
ARITHMETIC - working out words-per-minute and accuracy from what actually
happened is the whole point.
"""

import random

WORDS_PER_RACE = 24
SECONDS_PER_RACE = 60

WORD_POOL = [
    "the", "and", "you", "that", "was", "for", "are", "with", "his", "they",
    "this", "have", "from", "one", "had", "word", "but", "not", "what", "all",
    "were", "when", "your", "said", "there", "use", "each", "which", "she",
    "how", "their", "will", "other", "about", "out", "many", "then", "them",
    "these", "some", "her", "would", "make", "like", "him", "into", "time",
    "has", "look", "two", "more", "write", "see", "number", "way", "could",
    "people", "than", "first", "water", "been", "call", "who", "now", "find",
    "long", "down", "day", "did", "get", "come", "made", "may", "part",
    "over", "new", "sound", "take", "only", "little", "work", "know", "place",
    "year", "live", "back", "give", "most", "very", "after", "thing", "our",
    "just", "name", "good", "sentence", "man", "think", "say", "great",
    "where", "help", "through", "much", "before", "line", "right", "too",
    "mean", "old", "any", "same", "tell", "boy", "follow", "came", "want",
    "show", "also", "around", "form", "three", "small", "set", "put", "end",
]


def pick_words(count):
    """A fresh line of words to type, chosen at random."""
    return [random.choice(WORD_POOL) for _ in range(count)]


def current_word(state):
    """The word the player is on right now."""
    if state["index"] < len(state["words"]):
        return state["words"][state["index"]]
    return ""


def matching_letters(word, typed):
    """How much of the current word has been typed correctly.

    ALGORITHM: compare letter by letter and stop at the FIRST difference.
    Everything after a mistake counts as wrong even if it happens to match -
    that is why the loop stops rather than skipping on.
    """
    count = 0
    for i, letter in enumerate(typed):
        if i >= len(word) or word[i] != letter:
            return count
        count += 1
    return count


def is_typed_right(state):
    """Is what has been typed so far still correct?"""
    return matching_letters(current_word(state), state["typed"]) == len(state["typed"])


def type_letter(state, letter):
    """Add one letter to what has been typed.

    ALGORITHM: the race starts the moment the first letter is typed, so nobody
    loses time reaching for a start button.
    """
    if state["is_over"] or state["is_paused"]:
        return False
    if len(str(letter)) != 1:
        return False
    state["has_started"] = True
    state["typed"] += letter
    state["keystrokes"] += 1
    return True


def backspace(state):
    """Rub out the last letter typed."""
    if state["is_over"] or not state["typed"]:
        return False
    state["typed"] = state["typed"][:-1]
    return True


def submit_word(state):
    """Press space and move on.

    OUTPUT: True if the word was right.
    ALGORITHM: right or wrong, the player moves on to the next word - this is
    a race, not a spelling test, and stopping to correct things would ruin the
    rhythm. Finishing the last word ends the race.
    """
    if state["is_over"] or state["is_paused"] or not state["typed"]:
        return False
    right = state["typed"] == current_word(state)

    if right:
        state["correct"] += 1
        state["letters_typed"] += len(current_word(state)) + 1
    else:
        state["wrong"] += 1
    state["results"].append(right)

    state["index"] += 1
    state["typed"] = ""

    if state["index"] >= len(state["words"]):
        state["is_over"] = True
    return right


def accuracy(state):
    """What percentage of the words were right, 0 to 100.

    ALGORITHM: right / (right + wrong) x 100. Watch the very first moment of
    the game: nothing has been typed, so both are 0 and the division would be
    0 / 0. Give 100 there - nothing has gone wrong yet.
    """
    done = state["correct"] + state["wrong"]
    if done == 0:
        return 100
    return round(state["correct"] / done * 100)


def words_per_minute(state):
    """The classic typing speed.

    ALGORITHM: typists have agreed for a hundred years that a "word" is FIVE
    characters, whatever the real words were. So: count the characters typed
    correctly, divide by 5, and scale up to a minute. Under a second of
    typing, give 0 - dividing by nearly nothing gives a silly answer.
    """
    if state["seconds"] < 1:
        return 0
    words = state["letters_typed"] / 5
    return round(words / state["seconds"] * 60)


def time_left(state):
    """How many seconds of the race remain."""
    return max(0, SECONDS_PER_RACE - state["seconds"])


def new_race(state):
    """A fresh line of words and a clean clock."""
    state["words"] = pick_words(WORDS_PER_RACE)
    state["index"] = 0
    state["typed"] = ""
    state["correct"] = 0
    state["wrong"] = 0
    state["results"] = []
    state["letters_typed"] = 0
    state["keystrokes"] = 0
    state["seconds"] = 0
    state["has_started"] = False
    state["is_over"] = False


def create_game():
    """Start a brand-new game."""
    state = {"best": 0, "is_paused": False}
    new_race(state)
    return state


def update_game(state, elapsed_ms):
    """The clock, which only runs once typing has begun."""
    if state["is_over"] or state["is_paused"] or not state["has_started"]:
        return
    state["seconds"] += elapsed_ms / 1000

    if state["seconds"] >= SECONDS_PER_RACE:
        state["seconds"] = SECONDS_PER_RACE
        state["is_over"] = True
    if state["is_over"] and words_per_minute(state) > state["best"]:
        state["best"] = words_per_minute(state)


def toggle_pause(state):
    """Freeze or unfreeze the clock."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action, or None.

    OUTPUT: 'space', 'back', 'new', 'pause', a letter, or None.
    """
    text = str(key)

    if text == " " or text.lower() == "spacebar":
        return "space"
    if text.lower() == "backspace":
        return "back"
    if text.lower() == "enter":
        return "new"
    if text.lower() == "escape":
        return "pause"

    if len(text) == 1 and text.isalpha():
        return text.lower()

    return None
