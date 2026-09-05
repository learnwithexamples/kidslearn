"""snake_web.py - the glue between the web page and the Python game.

This is the only file that knows about the browser. It finds the canvas and
the buttons, starts a game, runs the loop about 60 times a second and passes
key presses on to the rules.

Two Pyodide details worth knowing:

  * `from js import document, window` gives Python the very same objects
    JavaScript uses. document.getElementById works exactly as you would expect.

  * A Python function cannot be handed to the browser directly - it has to be
    wrapped with create_proxy first, and something must keep a reference to
    that proxy or Python will tidy it away while the browser is still using it.
    That is what the PROXIES list is for.
"""

from js import document, window
from pyodide.ffi import create_proxy

import snake_rules as rules
import snake_draw as draw

CELL_SIZE = 20
BEST_KEY = "snake-python-best"

state = None
ctx = None
last_time = 0.0
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id.

    INPUT:  element_id. OUTPUT: the element, or None.
    """
    return document.getElementById(element_id)


def load_best():
    """The best score this browser has ever seen.

    INPUT:  nothing. OUTPUT: a number (0 if nothing is saved).
    """
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def save_best(score):
    """Remember a new best score.

    INPUT:  score. OUTPUT: nothing.
    """
    window.localStorage.setItem(BEST_KEY, str(score))


def update_scoreboard():
    """Copy the numbers from the game onto the page.

    INPUT:  nothing (it reads the module's state). OUTPUT: nothing.
    """
    get_element("score").textContent = str(state["score"])
    get_element("length").textContent = str(rules.snake_length(state))
    get_element("level").textContent = str(state["level"])

    best = load_best()
    if state["score"] > best:
        save_best(state["score"])
        best = state["score"]
    get_element("best").textContent = str(best)


def update_pause_button():
    """Keep the pause button's label honest.

    INPUT:  nothing. OUTPUT: nothing.
    ALGORITHM: "Over" for a finished game, "Play" while paused, else "Pause".
    """
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_over"]:
        button.textContent = "✖ Over"
    elif state["is_paused"]:
        button.textContent = "▶ Play"
    else:
        button.textContent = "⏸ Pause"


def draw_everything():
    """Draw one frame and refresh the numbers.

    INPUT:  nothing. OUTPUT: nothing.
    """
    draw.render_game(ctx, state, CELL_SIZE)
    update_scoreboard()
    update_pause_button()


def start_new_game():
    """Throw the old game away and begin again.

    INPUT:  nothing. OUTPUT: nothing.
    ALGORITHM: build a fresh state, start it paused so the player can read the
    controls, then draw the first frame.
    """
    global state
    state = rules.create_game()
    state["is_paused"] = True
    draw_everything()


def do_action(action):
    """Carry out one game action.

    INPUT:  action - "up", "down", "left", "right", "pause" or "restart"
    OUTPUT: nothing
    ALGORITHM: a turn also wakes a paused game up; pause flips the freeze;
    restart begins again.
    """
    if action is None:
        return

    if action == "pause":
        rules.toggle_pause(state)
        draw_everything()
        return
    if action == "restart":
        start_new_game()
        return

    direction = rules.DIRECTIONS.get(action)
    if direction is not None:
        if state["is_paused"] and not state["is_over"]:
            state["is_paused"] = False
        rules.turn_snake(state, direction)


def on_key(event):
    """React to a key press.

    INPUT:  event - the browser's keydown event. OUTPUT: nothing.
    ALGORITHM: stop the arrows scrolling the page, then look the action up.
    """
    key = str(event.key).lower()
    if key in ("arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar"):
        event.preventDefault()
    do_action(rules.action_for_key(event.key))


def frame(timestamp):
    """The heartbeat, run by the browser about 60 times a second.

    INPUT:  timestamp - the time in milliseconds. OUTPUT: nothing.
    ALGORITHM: work out how long since the last frame (never more than 100 ms,
    in case the tab was hidden), let the snake crawl, draw, and ask for the
    next frame.
    """
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(100, timestamp - last_time)
    last_time = timestamp

    rules.update_game(state, elapsed)
    draw_everything()
    window.requestAnimationFrame(PROXIES[0])


def connect_button(element_id, action):
    """Make an on-screen button run an action when tapped.

    INPUT:  element_id, action - the action name. OUTPUT: nothing.
    """
    element = get_element(element_id)
    if element is None:
        return

    def handler(event):
        event.preventDefault()
        do_action(action)

    proxy = create_proxy(handler)
    PROXIES.append(proxy)
    element.addEventListener("click", proxy)
    element.addEventListener("touchstart", proxy)


def start_game():
    """Everything that has to happen once, when the page is ready.

    INPUT:  nothing. OUTPUT: nothing.
    ALGORITHM: size the canvas from the grid, start a game, connect the
    keyboard and the buttons, then start the loop.
    """
    global ctx

    canvas = get_element("snake-board")
    canvas.width = rules.GRID_WIDTH * CELL_SIZE
    canvas.height = rules.GRID_HEIGHT * CELL_SIZE
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))          # PROXIES[0] is the loop itself

    key_proxy = create_proxy(on_key)
    PROXIES.append(key_proxy)
    document.addEventListener("keydown", key_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"),
                               ("btn-left", "left"), ("btn-right", "right"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
