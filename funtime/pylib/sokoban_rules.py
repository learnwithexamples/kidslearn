"""sokoban_rules.py - the rules of Sokoban, in Python.

Push every box onto a target. You can only PUSH, never pull, so one careless
shove into a corner and the level is unwinnable - which is why this game has an
UNDO button, and why building one is one of the steps.

The levels are written as pictures made of characters:
    #  wall        .  target        $  box
    @  you         *  box on a target
That is the real Sokoban file format, used since 1982.
"""

LEVEL_WIDTH = 10
LEVEL_HEIGHT = 7

LEVELS = [
    # 1 - one push
    "##########"
    "#        #"
    "#        #"
    "#  .$@   #"
    "#        #"
    "#        #"
    "##########",

    # 2 - push upwards
    "##########"
    "#        #"
    "#    .   #"
    "#    $   #"
    "#    @   #"
    "#        #"
    "##########",

    # 3 - two boxes, one at a time
    "##########"
    "#        #"
    "#   ..   #"
    "#   $$   #"
    "#   @    #"
    "#        #"
    "##########",

    # 4 - a wall in the way, so you must go round
    "##########"
    "#        #"
    "#   # .  #"
    "#   $    #"
    "#  @     #"
    "#        #"
    "##########",

    # 5 - three in a row
    "##########"
    "#        #"
    "#  ...   #"
    "#  $$$   #"
    "#   @    #"
    "#        #"
    "##########",

    # 6 - from both ends
    "##########"
    "#        #"
    "# $ .. $ #"
    "#        #"
    "#   @    #"
    "#        #"
    "##########",
]


def cell_index(x, y):
    """Turn an x and y into a place in the lists."""
    return y * LEVEL_WIDTH + x


def parse_level(text):
    """Turn a picture into a game.

    ALGORITHM: walk the characters. '#' becomes a wall, '.' and '*' mark a
    target, '$' and '*' start a box, '@' is where you begin.
    """
    walls = []
    goals = []
    boxes = []
    player = {"x": 1, "y": 1}

    for y in range(LEVEL_HEIGHT):
        for x in range(LEVEL_WIDTH):
            symbol = text[cell_index(x, y)]
            walls.append(symbol == "#")
            goals.append(symbol in ".*")
            if symbol in "$*":
                boxes.append({"x": x, "y": y})
            if symbol == "@":
                player = {"x": x, "y": y}

    return {"walls": walls, "goals": goals, "boxes": boxes, "player": player}


def is_wall(state, x, y):
    """Is this square a wall?

    ALGORITHM: anything outside the level counts as a wall too, so nothing can
    ever escape the picture.
    """
    if not (0 <= x < LEVEL_WIDTH) or not (0 <= y < LEVEL_HEIGHT):
        return True
    return state["walls"][cell_index(x, y)]


def is_goal(state, x, y):
    """Is this square a target?"""
    if not (0 <= x < LEVEL_WIDTH) or not (0 <= y < LEVEL_HEIGHT):
        return False
    return state["goals"][cell_index(x, y)]


def box_at(state, x, y):
    """Is there a box on this square?

    OUTPUT: which box it is (0, 1, 2 ...), or -1 for none.
    WHY a number and not just True/False: the move function needs to know WHICH
    box it is about to push, so it can move that one.
    """
    for i, box in enumerate(state["boxes"]):
        if box["x"] == x and box["y"] == y:
            return i
    return -1


def boxes_on_goals(state):
    """How many boxes are already home?"""
    return sum(1 for box in state["boxes"] if is_goal(state, box["x"], box["y"]))


def is_solved(state):
    """Is the level finished? True when every box is on a target."""
    return boxes_on_goals(state) == len(state["boxes"])


def snapshot(state):
    """Remember exactly where everything is.

    ALGORITHM: copy the boxes one at a time. Copying the LIST alone is not
    enough - the copies would still point at the same boxes, and moving one
    would change your saved picture too.
    """
    return {
        "player": dict(state["player"]),
        "boxes": [dict(box) for box in state["boxes"]],
    }


def move_player(state, dx, dy):
    """One step, pushing a box if one is in the way.

    OUTPUT: True if anything moved.
    ALGORITHM:
      1. Work out the square you are stepping into. A wall stops you.
      2. If there is a box there, work out where THAT box would go. If it
         would land on a wall or on another box, nothing moves at all.
      3. Save a snapshot for undo, then move the box, then move yourself.

    The order matters: save first, or the undo remembers the move you just made.
    """
    if state["is_solved"] or state["is_paused"]:
        return False
    to_x = state["player"]["x"] + dx
    to_y = state["player"]["y"] + dy

    if is_wall(state, to_x, to_y):
        return False

    box = box_at(state, to_x, to_y)
    if box != -1:
        box_to_x = to_x + dx
        box_to_y = to_y + dy
        if is_wall(state, box_to_x, box_to_y) or box_at(state, box_to_x, box_to_y) != -1:
            return False
        state["history"].append(snapshot(state))
        state["boxes"][box] = {"x": box_to_x, "y": box_to_y}
        state["pushes"] += 1
    else:
        state["history"].append(snapshot(state))

    state["player"] = {"x": to_x, "y": to_y}
    state["moves"] += 1

    if is_solved(state):
        state["is_solved"] = True
    return True


def undo_move(state):
    """Step back in time.

    OUTPUT: True if there was anything to undo.
    ALGORITHM: the history is a STACK - the newest snapshot is on top. Take the
    top one off and put its player and boxes back. Because every move pushed
    one on, undo can walk all the way back to the start.
    """
    if not state["history"]:
        return False
    past = state["history"].pop()
    state["player"] = past["player"]
    state["boxes"] = past["boxes"]
    state["moves"] += 1
    state["is_solved"] = is_solved(state)
    return True


def load_level(state, number):
    """Start one of the levels."""
    level = parse_level(LEVELS[number % len(LEVELS)])
    state["walls"] = level["walls"]
    state["goals"] = level["goals"]
    state["boxes"] = level["boxes"]
    state["player"] = level["player"]
    state["history"] = []
    state["moves"] = 0
    state["pushes"] = 0
    state["level"] = number % len(LEVELS)
    state["is_solved"] = False


def reset_level(state):
    """Put the level back exactly as it started."""
    load_level(state, state["level"])


def next_level(state):
    """Move on to the next puzzle."""
    solved = state["solved"] + (1 if state["is_solved"] else 0)
    load_level(state, state["level"] + 1)
    state["solved"] = solved


def create_game():
    """Start at level 1."""
    state = {"solved": 0, "is_paused": False}
    load_level(state, 0)
    return state


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    state["is_paused"] = not state["is_paused"]


def update_game(state, elapsed_ms):
    """Sokoban has no clock, so a frame changes nothing."""
    return


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        "u": "undo", "z": "undo", "backspace": "undo",
        "r": "reset", "n": "next", "enter": "next", "p": "pause",
    }
    return keys.get(str(key).lower())
