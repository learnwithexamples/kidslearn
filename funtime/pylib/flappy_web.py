"""flappy_web.py - the glue between the web page and Python Flappy."""

from js import document, window
from pyodide.ffi import create_proxy

import flappy_rules as rules
import flappy_draw as draw

BEST_KEY = "flappy-python-best"

state = None
ctx = None
canvas = None
last_time = 0.0
PROXIES = []


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
    get_element("level").textContent = str(rules.current_level(state))
    get_element("pipes").textContent = str(len(state["pipes"]))

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
        button.textContent = "> Start"
    else:
        button.textContent = "|| Pause"


def draw_everything():
    """Draw one frame and refresh the numbers."""
    draw.render_game(ctx, state)
    update_scoreboard()
    update_pause_button()


def start_new_game():
    """A fresh bird in the middle of the sky."""
    global state
    state = rules.create_game()
    state["scrolled"] = 0
    draw_everything()


def do_action(action):
    """Carry out one game action.

    Flapping while the game is waiting starts it, so "press space to play"
    feels like one motion instead of two.
    """
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
    elif action == "flap":
        if state["is_over"]:
            start_new_game()
            return
        if state["is_paused"]:
            state["is_paused"] = False
        rules.flap(state["bird"])
    draw_everything()


def on_key(event):
    """React to a key press."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_board_press(event):
    """Tapping the sky flaps too."""
    event.preventDefault()
    do_action("flap")


def frame(timestamp):
    """The heartbeat."""
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(60, timestamp - last_time)
    last_time = timestamp

    if not state["is_paused"] and not state["is_over"]:
        state["scrolled"] += rules.pipe_speed(rules.current_level(state)) * elapsed / 1000
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


def start_game():
    """Everything that has to happen once, when the page is ready."""
    global ctx, canvas

    canvas = get_element("flappy-board")
    canvas.width = rules.FIELD_WIDTH
    canvas.height = rules.FIELD_HEIGHT
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_proxy = create_proxy(on_key)
    press_proxy = create_proxy(on_board_press)
    PROXIES.extend([key_proxy, press_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("mousedown", press_proxy)
    canvas.addEventListener("touchstart", press_proxy)

    for element_id, action in [("btn-flap", "flap"), ("pause-btn", "pause"),
                               ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
