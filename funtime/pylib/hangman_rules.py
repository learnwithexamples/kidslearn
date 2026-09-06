"""hangman_rules.py - the rules of Hangman, in Python.

A hidden word, one letter at a time. Six wrong guesses and the drawing is
finished - and so are you.

Everything in this game is about STRINGS: hiding letters, revealing them, and
checking whether anything is left to find.
"""

import random

MAX_WRONG = 6

WORDS = [
    "PYTHON", "ROCKET", "PLANET", "GARDEN", "BRIDGE", "CASTLE", "DRAGON",
    "ISLAND", "JUNGLE", "MARKET", "ORANGE", "PENCIL", "RABBIT", "SILVER",
    "TUNNEL", "WINDOW", "YELLOW", "ANCHOR", "BASKET", "CAMERA", "DOLPHIN",
    "ELEPHANT", "FEATHER", "GIRAFFE", "HAMSTER", "JOURNEY", "KITCHEN",
    "LANTERN", "MONSTER", "NOTEBOOK", "OCTOPUS", "PUMPKIN", "RAINBOW",
    "SANDWICH", "TREASURE", "UMBRELLA", "VOLCANO", "WHISTLE", "BICYCLE",
    "COMPUTER", "DINOSAUR", "MOUNTAIN", "PENGUIN", "SQUIRREL", "TELESCOPE",
    "BUTTERFLY", "CROCODILE", "ADVENTURE", "CHOCOLATE", "HELICOPTER",
    "KANGAROO", "LIGHTHOUSE", "MUSHROOM", "ORCHESTRA", "PINEAPPLE",
    "SUBMARINE", "TRAMPOLINE", "WATERFALL", "XYLOPHONE", "ZOOKEEPER",
]

LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def pick_word():
    """Choose a word to hide."""
    return random.choice(WORDS)


def masked_word(word, guessed):
    """The word as the player sees it, e.g. "_ A _ _ E".

    ALGORITHM: go through the word one letter at a time. If that letter has
    been guessed, show it; if not, show an underscore. Join them with spaces so
    a row of underscores can be counted at a glance.
    """
    return " ".join(letter if letter in guessed else "_" for letter in word)


def is_word_complete(word, guessed):
    """Has every letter been found?"""
    return all(letter in guessed for letter in word)


def wrong_letters(state):
    """The letters that were not in the word, in the order they were guessed."""
    return "".join(letter for letter in state["guessed"] if letter not in state["word"])


def wrong_count(state):
    """How many mistakes have been made."""
    return len(wrong_letters(state))


def lives_left(state):
    """How many wrong guesses are still allowed."""
    return MAX_WRONG - wrong_count(state)


def game_status(state):
    """Where the game stands: 'won', 'lost' or 'playing'.

    ALGORITHM: check for a win FIRST. A player who completes the word on their
    very last life has won, not lost - and checking in the other order would
    tell them otherwise.
    """
    if is_word_complete(state["word"], state["guessed"]):
        return "won"
    if wrong_count(state) >= MAX_WRONG:
        return "lost"
    return "playing"


def guess_letter(state, letter):
    """Try a letter.

    OUTPUT: True if it counted as a new guess.
    ALGORITHM: ignore anything that is not a letter, and ignore a letter that
    has already been tried - guessing 'E' twice must not cost a life.
    """
    if state["is_over"] or state["is_paused"]:
        return False
    upper = str(letter).upper()

    if len(upper) != 1 or upper not in LETTERS:
        return False
    if upper in state["guessed"]:
        return False

    state["guessed"] += upper

    status = game_status(state)
    if status == "won":
        state["is_won"] = True
        state["is_over"] = True
        state["wins"] += 1
    elif status == "lost":
        state["is_over"] = True
        state["losses"] += 1
    return True


def new_round(state):
    """Hide a new word."""
    state["word"] = pick_word()
    state["guessed"] = ""
    state["is_won"] = False
    state["is_over"] = False


def create_game():
    """Start a brand-new game."""
    state = {"wins": 0, "losses": 0, "is_paused": False}
    new_round(state)
    return state


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def update_game(state, elapsed_ms):
    """Hangman has no clock, so a frame changes nothing."""
    return


def action_for_key(key):
    """Turn a keyboard key into an action, or None.

    OUTPUT: 'new', 'pause', a single letter, or None.
    ALGORITHM: this one is different from the other games - any of the
    twenty-six letters is an action in itself, so the letter is handed straight
    back rather than being turned into a word.
    """
    text = str(key)

    if text.lower() == "enter" or text == "1":
        return "new"
    if text.lower() == "escape":
        return "pause"

    upper = text.upper()
    if len(upper) == 1 and upper in LETTERS:
        return upper
    return None
