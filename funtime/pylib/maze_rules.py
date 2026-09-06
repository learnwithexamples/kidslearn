"""maze_rules.py - the rules of Maze Runner, in Python.

A maze is dug out fresh every game, and you have to find your way from the
top-left corner to the bottom-right.

Two famous algorithms live in this file, and they are worth more than the game
itself:
  * the RECURSIVE BACKTRACKER, which digs a perfect maze with a stack
  * BREADTH-FIRST SEARCH, which finds the shortest way through anything
"""

import random
from collections import deque

MAZE_WIDTH = 21          # always odd: walls and corridors alternate
MAZE_HEIGHT = 15


def maze_index(x, y):
    """Turn an x and y into a place in the list."""
    return y * MAZE_WIDTH + x


def is_inside_maze(x, y):
    """Is this square inside the maze at all?"""
    return 0 <= x < MAZE_WIDTH and 0 <= y < MAZE_HEIGHT


def is_wall(maze, x, y):
    """Is this square solid rock?

    ALGORITHM: anything outside the maze is solid too, so nothing can escape.
    """
    if not is_inside_maze(x, y):
        return True
    return maze[maze_index(x, y)]


def solid_maze():
    """Every square filled in, ready to be dug out."""
    return [True] * (MAZE_WIDTH * MAZE_HEIGHT)


def room_neighbours(x, y):
    """The four rooms around this one, two squares away.

    OUTPUT: a list of (room_x, room_y, wall_x, wall_y).
    ALGORITHM: rooms sit at odd coordinates and the wall between two rooms is
    the single square in the middle. So a neighbour is TWO squares away, and
    the wall to knock through is ONE square away.
    """
    found = []
    for dx, dy in ((0, -2), (2, 0), (0, 2), (-2, 0)):
        nx, ny = x + dx, y + dy
        if is_inside_maze(nx, ny):
            found.append((nx, ny, x + dx // 2, y + dy // 2))
    return found


def carve_maze():
    """Dig a whole maze out of solid rock.

    OUTPUT: a maze - a list where True means wall.

    ALGORITHM - the RECURSIVE BACKTRACKER, done with a stack:
      1. Start in one room and dig it out. Put it on the stack.
      2. Look at the room on top of the stack. Shuffle its neighbours.
      3. If any neighbour is still solid rock, knock through the wall between,
         dig the neighbour out, and put IT on the stack. (Walk further.)
      4. If every neighbour has already been dug, take the top room off the
         stack. (Walk back until there is somewhere new to go.)
      5. Stop when the stack is empty.

    What you get is a "perfect" maze: exactly one route between any two rooms,
    with no loops and nothing walled off.
    """
    maze = solid_maze()
    maze[maze_index(1, 1)] = False

    stack = [(1, 1)]
    while stack:
        x, y = stack[-1]
        options = room_neighbours(x, y)
        random.shuffle(options)

        dug = False
        for nx, ny, wall_x, wall_y in options:
            if is_wall(maze, nx, ny):
                maze[maze_index(wall_x, wall_y)] = False
                maze[maze_index(nx, ny)] = False
                stack.append((nx, ny))
                dug = True
                break

        if not dug:
            stack.pop()
    return maze


def build_path(came_from, to):
    """Turn the "came from" trail into a route, start first."""
    path = []
    key = maze_index(to["x"], to["y"])

    while key is not None and key != -1:
        path.append({"x": key % MAZE_WIDTH, "y": key // MAZE_WIDTH})
        key = came_from.get(key)
    path.reverse()
    return path


def find_path(maze, start, goal):
    """The shortest way from one square to another.

    OUTPUT: a list of squares from start to finish, or an empty list.

    ALGORITHM - BREADTH-FIRST SEARCH, the shortest-path algorithm:
      1. Keep a QUEUE of squares to look at, starting with the first one.
      2. Take the square at the FRONT of the queue. For each open neighbour
         you have not seen before, remember which square you came from and put
         it at the BACK of the queue.
      3. When you reach the target, walk the "came from" trail backwards to
         build the route, then turn it round.

    The queue is what makes it shortest. Because you always look at the
    nearest squares first, the very first time you reach a square is by the
    shortest possible route. Swap the queue for a stack and you still find a
    way - just not the best one.
    """
    came_from = {maze_index(start["x"], start["y"]): -1}
    queue = deque([start])

    while queue:
        here = queue.popleft()

        if here["x"] == goal["x"] and here["y"] == goal["y"]:
            return build_path(came_from, goal)

        for dx, dy in ((0, -1), (1, 0), (0, 1), (-1, 0)):
            nx, ny = here["x"] + dx, here["y"] + dy
            key = maze_index(nx, ny)
            if not is_wall(maze, nx, ny) and key not in came_from:
                came_from[key] = maze_index(here["x"], here["y"])
                queue.append({"x": nx, "y": ny})
    return []


def exit_square():
    """The square you are trying to reach."""
    return {"x": MAZE_WIDTH - 2, "y": MAZE_HEIGHT - 2}


def move_player(state, dx, dy):
    """One step, if there is no wall in the way."""
    if state["is_solved"] or state["is_paused"]:
        return False
    to_x = state["player"]["x"] + dx
    to_y = state["player"]["y"] + dy

    if is_wall(state["maze"], to_x, to_y):
        return False

    state["player"] = {"x": to_x, "y": to_y}
    state["steps"] += 1
    state["hint"] = []

    goal = exit_square()
    if to_x == goal["x"] and to_y == goal["y"]:
        state["is_solved"] = True
        state["solved"] += 1
    return True


def show_hint(state):
    """Light up the shortest way from here to the exit."""
    state["hint"] = find_path(state["maze"], state["player"], exit_square())
    state["hints_used"] += 1
    return len(state["hint"])


def shortest_from_start(maze):
    """How many steps a perfect run would take."""
    path = find_path(maze, {"x": 1, "y": 1}, exit_square())
    return 0 if not path else len(path) - 1


def new_maze(state):
    """Dig a fresh maze and stand at the start of it."""
    state["maze"] = carve_maze()
    state["player"] = {"x": 1, "y": 1}
    state["steps"] = 0
    state["seconds"] = 0
    state["hint"] = []
    state["shortest"] = shortest_from_start(state["maze"])
    state["is_solved"] = False


def create_game():
    """Start a brand-new game."""
    state = {"solved": 0, "hints_used": 0, "is_paused": False}
    new_maze(state)
    return state


def update_game(state, elapsed_ms):
    """The only moving part is the clock."""
    if state["is_solved"] or state["is_paused"]:
        return
    state["seconds"] += elapsed_ms / 1000


def toggle_pause(state):
    """Freeze or unfreeze the clock."""
    if not state["is_solved"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        "h": "hint", " ": "hint", "spacebar": "hint",
        "n": "new", "enter": "new", "p": "pause",
    }
    return keys.get(str(key).lower())
