"""snake_rules.py - the rules of Snake, written in Python.

This is the same game as funtime/snake.html, but every rule below is Python
running in your browser through Pyodide. Open both files side by side: the
ideas are identical, and Python says several of them in fewer words.

A POSITION is a tuple of two numbers:

    (3, 7)      x = column (0 is the left wall)
                y = row    (0 is the TOP row)

A SNAKE is simply a list of positions, head first:

    [(10, 10), (9, 10), (8, 10)]

Nothing in this file draws anything or reads the keyboard - it is only rules.
"""

import random

# The size of the field, in squares.
GRID_WIDTH = 20
GRID_HEIGHT = 20

# The four ways a snake can travel. Up is -1 because row 0 is the top.
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}


def create_position(x, y):
    """Build one square's position.

    INPUT:  x - the column, y - the row
    OUTPUT: a tuple (x, y)
    ALGORITHM: put the two numbers in a tuple.
    """
    return (x, y)


def same_position(a, b):
    """Are these two squares the same square?

    INPUT:  a, b - two positions
    OUTPUT: True if both numbers match
    ALGORITHM: compare the tuples with ==.

    NOTE: in JavaScript this needed four comparisons, because two objects that
    look the same are not equal. Python tuples compare by VALUE, so == is
    enough. Same idea, less typing.
    """
    return a == b


def add_direction(position, direction):
    """Take one step from a square.

    INPUT:  position - where you are. direction - the step to take.
    OUTPUT: a NEW position one square along
    ALGORITHM: add the two x values, add the two y values, return the pair.
    """
    return (position[0] + direction[0], position[1] + direction[1])


def is_inside_grid(position):
    """Is this square still on the field?

    INPUT:  position
    OUTPUT: True if it is on the board, False if it has gone through a wall
    ALGORITHM: x must be from 0 up to GRID_WIDTH - 1, and the same for y.

    NOTE: Python lets you chain comparisons - 0 <= x < GRID_WIDTH means
    "x is at least 0 AND less than GRID_WIDTH", which reads just like maths.
    """
    x, y = position
    return 0 <= x < GRID_WIDTH and 0 <= y < GRID_HEIGHT


def contains_position(items, position):
    """Is this square somewhere in that list?

    INPUT:  items - a list of positions. position - one square.
    OUTPUT: True if the list holds that square
    ALGORITHM: Python's `in` walks the list comparing values, which is exactly
    the loop the JavaScript version had to write by hand.
    """
    return position in items


def is_opposite_direction(a, b):
    """Are these two directions exact opposites?

    INPUT:  a, b - two directions
    OUTPUT: True for up/down or left/right
    ALGORITHM: opposite steps cancel out, so both sums are 0.
    """
    return a[0] + b[0] == 0 and a[1] + b[1] == 0


def empty_cells(occupied):
    """Every square the snake is NOT sitting on.

    INPUT:  occupied - a list of positions
    OUTPUT: a list of all the free positions
    ALGORITHM: walk every row and column and keep the squares that are free.

    NOTE: the whole thing fits in one "list comprehension", which is Python's
    way of saying "build me a list from this loop".
    """
    return [(x, y)
            for y in range(GRID_HEIGHT)
            for x in range(GRID_WIDTH)
            if (x, y) not in occupied]


def random_empty_cell(occupied):
    """Pick a free square at random - where the next apple goes.

    INPUT:  occupied - a list of positions (the snake)
    OUTPUT: one free position, or None when the whole grid is full
    ALGORITHM: list the free squares; if there are none return None; otherwise
    let random.choice pick one.
    """
    free = empty_cells(occupied)
    if not free:
        return None
    return random.choice(free)


def create_starting_snake():
    """The three squares a new snake begins with.

    INPUT:  nothing
    OUTPUT: a list of three positions, head first, in the middle of the grid
    ALGORITHM: find the middle square, then add two more to its left.
    """
    middle_x = GRID_WIDTH // 2
    middle_y = GRID_HEIGHT // 2
    return [
        (middle_x, middle_y),
        (middle_x - 1, middle_y),
        (middle_x - 2, middle_y),
    ]


def create_game():
    """Start a brand-new game.

    INPUT:  nothing
    OUTPUT: a dictionary holding everything the game remembers
    ALGORITHM: build the dictionary, then drop the first apple on a free square.
    """
    state = {
        "snake": create_starting_snake(),
        "direction": DIRECTIONS["right"],
        "turns": [],
        "food": None,
        "score": 0,
        "eaten": 0,
        "level": 1,
        "step_timer": 0,
        "is_over": False,
        "is_won": False,
        "is_paused": False,
    }
    state["food"] = random_empty_cell(state["snake"])
    return state


def move_snake(snake, new_head, grow):
    """Slide the snake one square forward.

    INPUT:  snake - the list of positions. new_head - where the head is going.
            grow - True if it just ate.
    OUTPUT: a NEW list of positions
    ALGORITHM: a new list with the head at the front and the old snake behind
    it; then drop the last square unless the snake is growing.

    This is the whole trick of Snake: a step is "add a head, drop a tail", and
    eating is "add a head and keep the tail".
    """
    moved = [new_head] + snake
    if not grow:
        moved.pop()
    return moved


def turn_snake(state, direction):
    """Remember that the player wants to turn.

    INPUT:  state - the game. direction - one of the DIRECTIONS.
    OUTPUT: True if the turn was accepted, False if it was refused
    ALGORITHM: work out which way the snake will be facing when this turn
    happens, then refuse a turn that repeats it or reverses it, and never
    remember more than two turns.
    """
    facing = state["turns"][-1] if state["turns"] else state["direction"]

    if same_position(direction, facing) or is_opposite_direction(direction, facing):
        return False
    if len(state["turns"]) >= 2:
        return False

    state["turns"].append(direction)
    return True


def score_for_food(level):
    """How many points is one apple worth?

    INPUT:  level. OUTPUT: the points to add.
    ALGORITHM: 10 points times the level.
    """
    return 10 * level


def level_for_food(eaten):
    """Which level does this many apples earn?

    INPUT:  eaten - apples eaten so far. OUTPUT: the level, starting at 1.
    ALGORITHM: whole-number divide by 5, then add 1.

    NOTE: // is Python's whole-number divide - the same job as
    Math.floor(eaten / 5) in JavaScript.
    """
    return eaten // 5 + 1


def step_interval_for_level(level):
    """How long between steps, in milliseconds?

    INPUT:  level. OUTPUT: milliseconds to wait.
    ALGORITHM: 200 ms on level 1, 15 ms quicker each level, never below 70.
    """
    interval = 200 - (level - 1) * 15
    return max(70, interval)


def step_game(state):
    """Move the snake one square. This is the heart of the game.

    INPUT:  state - the game
    OUTPUT: nothing; it changes the state
    ALGORITHM:
      1. Do nothing if the game is over or paused.
      2. Take the next turn the player asked for.
      3. Work out the new head square.
      4. Dying: off the grid, or onto its own body. The very last segment does
         not count, because it moves out of the way this turn.
      5. Eating is when the new head lands exactly on the apple.
      6. Move the snake, growing only if it ate.
      7. If it ate: count it, score it, work out the level and drop a new
         apple. No free square left means the player has WON.
    """
    if state["is_over"] or state["is_paused"]:
        return

    if state["turns"]:
        state["direction"] = state["turns"].pop(0)

    head = add_direction(state["snake"][0], state["direction"])
    body_that_stays = state["snake"][:-1]

    if not is_inside_grid(head) or contains_position(body_that_stays, head):
        state["is_over"] = True
        return

    eating = state["food"] is not None and same_position(head, state["food"])
    state["snake"] = move_snake(state["snake"], head, eating)

    if eating:
        state["eaten"] += 1
        state["score"] += score_for_food(state["level"])
        state["level"] = level_for_food(state["eaten"])
        state["food"] = random_empty_cell(state["snake"])
        if state["food"] is None:
            state["is_won"] = True
            state["is_over"] = True


def update_game(state, elapsed_ms):
    """Let time pass (called about 60 times a second).

    INPUT:  state, elapsed_ms - milliseconds since the last call
    OUTPUT: nothing
    ALGORITHM: add the time to the timer; while the timer has passed this
    level's waiting time, take that much off it and move the snake one square.
    """
    if state["is_over"] or state["is_paused"]:
        return

    interval = step_interval_for_level(state["level"])
    state["step_timer"] += elapsed_ms

    while state["step_timer"] >= interval:
        state["step_timer"] -= interval
        step_game(state)
        if state["is_over"]:
            return


def toggle_pause(state):
    """Freeze or unfreeze the game.

    INPUT:  state. OUTPUT: nothing.
    ALGORITHM: flip is_paused, but never unpause a finished game.
    """
    if state["is_over"]:
        return
    state["is_paused"] = not state["is_paused"]


def snake_length(state):
    """How long is the snake?

    INPUT:  state. OUTPUT: the number of squares it fills.
    ALGORITHM: that is just len() of the list.
    """
    return len(state["snake"])


def action_for_key(key):
    """Turn a keyboard key into the name of a game action.

    INPUT:  key - the key name from the browser, e.g. "ArrowLeft" or "w"
    OUTPUT: "up", "down", "left", "right", "pause", "restart" - or None
    ALGORITHM: lowercase the key, then look it up in a dictionary.

    NOTE: JavaScript needed a row of if statements. In Python a dictionary IS
    the lookup table, and .get() hands back None for anything missing.
    """
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        "p": "pause", " ": "pause", "spacebar": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
