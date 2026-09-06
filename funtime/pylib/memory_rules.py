"""memory_rules.py - the rules of Memory Match, written in Python.

Sixteen cards lie face down in a 4 x 4 grid, hiding eight pairs. Turn two over:
matching cards stay up, wrong ones turn back down. Find every pair to win.

A CARD is a dictionary:

    {"symbol": 3, "face_up": False, "matched": False}

The board is one flat LIST of sixteen cards, read left to right, top to bottom.
"""

import random

GRID_COLUMNS = 4
GRID_ROWS = 4
PAIR_COUNT = GRID_COLUMNS * GRID_ROWS // 2

# How long two wrong cards stay up before turning back, in milliseconds.
PEEK_MS = 900


def card_index(column, row):
    """Turn a column and row into a place in the list.

    INPUT:  column - 0 to 3. row - 0 to 3.
    OUTPUT: the position of that card in the flat list of sixteen
    ALGORITHM: skip a whole row of cards for each row, then add the column.
    """
    return row * GRID_COLUMNS + column


def create_deck():
    """Build the sixteen shuffled cards.

    INPUT:  nothing
    OUTPUT: a list of 16 cards, every symbol from 0 to 7 appearing twice
    ALGORITHM: make a list with each symbol twice, shuffle it, and turn every
    symbol into a card that starts face down and unmatched.

    NOTE: `list(range(PAIR_COUNT)) * 2` repeats the whole list - a neat Python
    trick for "one of each, twice".
    """
    symbols = list(range(PAIR_COUNT)) * 2
    random.shuffle(symbols)
    return [{"symbol": symbol, "face_up": False, "matched": False} for symbol in symbols]


def create_game():
    """Start a brand-new game.

    INPUT:  nothing. OUTPUT: the game state dictionary.
    """
    return {
        "cards": create_deck(),
        "picked": [],
        "moves": 0,
        "pairs": 0,
        "peek_timer": 0,
        "cursor": {"column": 0, "row": 0},
        "is_over": False,
        "is_paused": False,
    }


def is_match(state):
    """Do the two picked cards show the same symbol?

    INPUT:  state. OUTPUT: True if exactly two are picked and they match.
    ALGORITHM: look both cards up and compare their "symbol" values.
    """
    if len(state["picked"]) != 2:
        return False
    first = state["cards"][state["picked"][0]]
    second = state["cards"][state["picked"][1]]
    return first["symbol"] == second["symbol"]


def can_flip(state, index):
    """May this card be turned over right now?

    INPUT:  state, index. OUTPUT: True or False.
    ALGORITHM: not while the game is over or paused, not while two wrong cards
    are still showing, never a third card, and never a card that is already up
    or already matched.
    """
    if state["is_over"] or state["is_paused"]:
        return False
    if state["peek_timer"] > 0 or len(state["picked"]) >= 2:
        return False
    if index < 0 or index >= len(state["cards"]):
        return False
    card = state["cards"][index]
    return not card["face_up"] and not card["matched"]


def keep_match(state):
    """The two cards match, so they stay up for good.

    INPUT:  state. OUTPUT: nothing.
    """
    for index in state["picked"]:
        state["cards"][index]["matched"] = True
    state["picked"] = []
    state["pairs"] += 1
    if is_game_won(state):
        state["is_over"] = True


def flip_card(state, index):
    """Turn one card face up.

    INPUT:  state, index. OUTPUT: True if the card was turned over.
    ALGORITHM:
      1. If can_flip says no, do nothing.
      2. Turn the card up and remember it in state["picked"].
      3. If that was the second card it counts as a move: a match stays up, a
         miss starts the timer that turns them both back down.
    """
    if not can_flip(state, index):
        return False

    state["cards"][index]["face_up"] = True
    state["picked"].append(index)

    if len(state["picked"]) == 2:
        state["moves"] += 1
        if is_match(state):
            keep_match(state)
        else:
            state["peek_timer"] = PEEK_MS
    return True


def hide_unmatched(state):
    """Turn the two wrong cards back face down.

    INPUT:  state. OUTPUT: nothing.
    """
    for index in state["picked"]:
        if not state["cards"][index]["matched"]:
            state["cards"][index]["face_up"] = False
    state["picked"] = []
    state["peek_timer"] = 0


def is_game_won(state):
    """Has every pair been found?

    INPUT:  state. OUTPUT: True if all sixteen cards are matched.
    ALGORITHM: all() asks "is this true of every card?" in one word.
    """
    return all(card["matched"] for card in state["cards"])


def stars_for_moves(moves):
    """How well did the player do?

    INPUT:  moves. OUTPUT: 3, 2 or 1 star.
    ALGORITHM: 12 moves or fewer is 3 stars, 18 or fewer is 2, otherwise 1.
    """
    if moves <= 12:
        return 3
    if moves <= 18:
        return 2
    return 1


def update_game(state, elapsed_ms):
    """Let time pass (called about 60 times a second).

    INPUT:  state, elapsed_ms. OUTPUT: nothing.
    ALGORITHM: count the peek timer down; at zero, turn the wrong cards back.
    """
    if state["is_over"] or state["is_paused"]:
        return
    if state["peek_timer"] > 0:
        state["peek_timer"] -= elapsed_ms
        if state["peek_timer"] <= 0:
            hide_unmatched(state)


def move_cursor(state, dx, dy):
    """Move the keyboard cursor around the grid, staying on the board."""
    state["cursor"]["column"] = max(0, min(GRID_COLUMNS - 1, state["cursor"]["column"] + dx))
    state["cursor"]["row"] = max(0, min(GRID_ROWS - 1, state["cursor"]["row"] + dy))


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into the name of a game action.

    INPUT:  key. OUTPUT: an action name, or None.
    """
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "flip", "spacebar": "flip", "enter": "flip",
        "p": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
