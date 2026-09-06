"""twenty48_web.py - the glue between the web page and Python 2048."""

from js import document, window
from pyodide.ffi import create_proxy

import twenty48_rules as rules
import twenty48_draw as draw

BEST_KEY = "twenty48-python-best"

state = None
ctx = None
canvas = None
PROXIES = []
swipe_start = {"x": 0, "y": 0}


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def load_best():
    """The best score this browser has seen."""
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("score").textContent = str(state["score"])
    get_element("biggest").textContent = str(rules.biggest_tile(state["board"]))
    get_element("moves").textContent = str(state["moves"])

    best = load_best()
    if state["score"] > best:
        window.localStorage.setItem(BEST_KEY, str(state["score"]))
        best = state["score"]
    get_element("best").textContent = str(best)


def update_pause_button():
    """Keep the button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_over"]:
        button.textContent = "Play again"
    elif state["is_paused"]:
        button.textContent = "> Play"
    else:
        button.textContent = "|| Pause"


def draw_everything():
    """Draw one frame and refresh the numbers."""
    draw.render_game(ctx, state)
    update_scoreboard()
    update_pause_button()


def start_new_game():
    """A fresh board with two tiles."""
    global state
    state = rules.create_game()
    state["keep_playing"] = False
    draw_everything()


def do_action(action):
    """Carry out one game action."""
    if action is None:
        return
    if action == "restart":
        start_new_game()
        return
    if action == "pause":
        if state["is_over"]:
            start_new_game()
        else:
            rules.toggle_pause(state)
    elif action == "keepgoing":
        state["keep_playing"] = True
    else:
        rules.make_move(state, action)
    draw_everything()


def on_key(event):
    """React to a key press."""
    key = str(event.key).lower()
    if key in (" ", "spacebar"):
        event.preventDefault()
        do_action("keepgoing")
        return
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_touch_start(event):
    """Remember where the finger went down."""
    swipe_start["x"] = event.touches[0].clientX
    swipe_start["y"] = event.touches[0].clientY


def on_touch_end(event):
    """Work out which way the finger travelled, and slide that way."""
    across = event.changedTouches[0].clientX - swipe_start["x"]
    down = event.changedTouches[0].clientY - swipe_start["y"]

    if abs(across) < 24 and abs(down) < 24:
        return
    event.preventDefault()

    if abs(across) > abs(down):
        do_action("right" if across > 0 else "left")
    else:
        do_action("down" if down > 0 else "up")


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


def start_game():
    """Everything that has to happen once, when the page is ready."""
    global ctx, canvas

    canvas = get_element("twenty48-board")
    canvas.width = draw.board_pixel_size()
    canvas.height = draw.board_pixel_size()
    ctx = canvas.getContext("2d")

    key_proxy = create_proxy(on_key)
    start_proxy = create_proxy(on_touch_start)
    end_proxy = create_proxy(on_touch_end)
    PROXIES.extend([key_proxy, start_proxy, end_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("touchstart", start_proxy)
    canvas.addEventListener("touchend", end_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"),
                               ("btn-left", "left"), ("btn-right", "right"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
