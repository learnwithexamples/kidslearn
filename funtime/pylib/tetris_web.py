"""tetris_web.py - the glue between the web page and the Python Tetris game.

The only file here that knows about the browser. See snake_web.py for the two
Pyodide details that matter: `from js import ...` and create_proxy.
"""

from js import document, window
from pyodide.ffi import create_proxy

import tetris_rules as rules
import tetris_draw as draw

CELL_SIZE = 30
PREVIEW_CELL_SIZE = 22

state = None
ctx = None
preview_ctx = None
preview_canvas = None
last_time = 0.0
PROXIES = []
held = {"action": None, "timer": 0.0, "repeating": False}

HOLD_DELAY_MS = 170
HOLD_REPEAT_MS = 55


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("score").textContent = str(state["score"])
    get_element("lines").textContent = str(state["lines"])
    get_element("level").textContent = str(state["level"])


def update_pause_button():
    """Keep the pause button's label honest."""
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
    """Draw the board, the preview and the numbers."""
    draw.render_game(ctx, state, CELL_SIZE)
    draw.render_next_piece(preview_ctx, state["next_type"],
                           preview_canvas.width, preview_canvas.height, PREVIEW_CELL_SIZE)
    update_scoreboard()
    update_pause_button()


def start_new_game():
    """Throw the old game away and begin again, paused."""
    global state
    state = rules.create_game()
    state["is_paused"] = True
    held["action"] = None
    draw_everything()


def do_action(action):
    """Carry out one game action.

    INPUT:  action - "left", "right", "soft_drop", "rotate_right",
            "rotate_left", "hard_drop", "pause" or "restart"
    OUTPUT: nothing
    """
    if action is None:
        return
    if action == "left":
        rules.try_move(state, -1, 0)
    elif action == "right":
        rules.try_move(state, 1, 0)
    elif action == "soft_drop":
        rules.soft_drop(state)
    elif action == "rotate_right":
        rules.try_rotate(state, True)
    elif action == "rotate_left":
        rules.try_rotate(state, False)
    elif action == "hard_drop":
        rules.hard_drop(state)
    elif action == "pause":
        rules.toggle_pause(state)
    elif action == "restart":
        start_new_game()
    draw_everything()


def is_held_action(action):
    """May this action repeat while the key is held down?"""
    return action in ("left", "right", "soft_drop")


def on_key_down(event):
    """React to a key going down."""
    key = str(event.key).lower()
    if key in ("arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar"):
        event.preventDefault()

    action = rules.action_for_key(event.key)
    if action is None:
        return
    do_action(action)
    if is_held_action(action):
        held["action"] = action
        held["timer"] = 0
        held["repeating"] = False


def on_key_up(event):
    """React to a key coming up."""
    action = rules.action_for_key(event.key)
    if action is not None and action == held["action"]:
        held["action"] = None
        held["timer"] = 0
        held["repeating"] = False


def update_held_key(elapsed):
    """Repeat the held move as time passes.

    ALGORITHM: wait HOLD_DELAY_MS for the first repeat, then HOLD_REPEAT_MS
    between the rest - the same rhythm the JavaScript version uses.
    """
    if held["action"] is None:
        return
    held["timer"] += elapsed
    wait = HOLD_REPEAT_MS if held["repeating"] else HOLD_DELAY_MS
    while held["timer"] >= wait:
        held["timer"] -= wait
        held["repeating"] = True
        wait = HOLD_REPEAT_MS
        do_action(held["action"])


def frame(timestamp):
    """The heartbeat, about 60 times a second."""
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(100, timestamp - last_time)
    last_time = timestamp

    if not state["is_paused"] and not state["is_over"]:
        update_held_key(elapsed)
        rules.update_game(state, elapsed)

    draw_everything()
    window.requestAnimationFrame(PROXIES[0])


def connect_button(element_id, action):
    """Make an on-screen button run an action when tapped."""
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
    """Everything that has to happen once, when the page is ready."""
    global ctx, preview_ctx, preview_canvas

    board_canvas = get_element("tetris-board")
    board_canvas.width = rules.BOARD_WIDTH * CELL_SIZE
    board_canvas.height = rules.BOARD_HEIGHT * CELL_SIZE
    ctx = board_canvas.getContext("2d")

    preview_canvas = get_element("tetris-next")
    preview_ctx = preview_canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_down = create_proxy(on_key_down)
    key_up = create_proxy(on_key_up)
    PROXIES.append(key_down)
    PROXIES.append(key_up)
    document.addEventListener("keydown", key_down)
    document.addEventListener("keyup", key_up)

    for element_id, action in [("btn-left", "left"), ("btn-right", "right"),
                               ("btn-down", "soft_drop"), ("btn-rotate", "rotate_right"),
                               ("btn-drop", "hard_drop"), ("pause-btn", "pause"),
                               ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
