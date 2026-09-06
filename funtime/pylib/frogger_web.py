"""frogger_web.py - the glue between the web page and Python Frogger."""

from js import document, window
from pyodide.ffi import create_proxy

import frogger_rules as rules
import frogger_draw as draw

BEST_KEY = "frogger-python-best"

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
    get_element("lives").textContent = str(state["lives"])
    get_element("crossings").textContent = str(state["crossings"])

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
    """A fresh frog on the bottom bank."""
    global state
    state = rules.create_game()
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
    elif action == "up":
        rules.move_frog(state, 0, -1)
        rules.reach_home(state)
    elif action == "down":
        rules.move_frog(state, 0, 1)
    elif action == "left":
        rules.move_frog(state, -1, 0)
    elif action == "right":
        rules.move_frog(state, 1, 0)
    draw_everything()


def on_key(event):
    """React to a key press."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_board_click(event):
    """Tapping above the frog hops forward, and so on."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    y = (event.clientY - box.top) * (canvas.height / box.height)
    column = int(x // rules.CELL)
    row = int(y // rules.CELL)

    if row < state["frog"]["row"]:
        do_action("up")
    elif row > state["frog"]["row"]:
        do_action("down")
    elif column < state["frog"]["column"]:
        do_action("left")
    elif column > state["frog"]["column"]:
        do_action("right")


def frame(timestamp):
    """The heartbeat: the traffic never stops."""
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(60, timestamp - last_time)
    last_time = timestamp

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

    canvas = get_element("frogger-board")
    canvas.width = rules.FIELD_WIDTH
    canvas.height = rules.FIELD_HEIGHT
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"),
                               ("btn-left", "left"), ("btn-right", "right"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
