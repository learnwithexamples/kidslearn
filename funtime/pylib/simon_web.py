"""simon_web.py - the glue between the web page and Python Simon Says."""

from js import document, window
from pyodide.ffi import create_proxy

import simon_rules as rules
import simon_draw as draw

BEST_KEY = "simon-python-best"

state = None
ctx = None
canvas = None
last_time = 0.0
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def load_best():
    """The furthest round this browser has reached."""
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("round").textContent = str(state["round"])
    get_element("score").textContent = str(state["score"])
    get_element("length").textContent = str(len(state["sequence"]))

    best = load_best()
    if state["round"] > best:
        window.localStorage.setItem(BEST_KEY, str(state["round"]))
        best = state["round"]
    get_element("best").textContent = str(best)


def update_pause_button():
    """Keep the pause button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_over"]:
        button.textContent = "Wrong"
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
    """A fresh sequence of one."""
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
        rules.toggle_pause(state)
    elif action.startswith("pad"):
        rules.press_pad(state, int(action[3:]))
    draw_everything()


def on_key(event):
    """React to a key press."""
    key = str(event.key).lower()
    if key in ("arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar"):
        event.preventDefault()
    do_action(rules.action_for_key(event.key))


def on_board_click(event):
    """Press whichever pad was clicked."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    y = (event.clientY - box.top) * (canvas.height / box.height)
    pad = draw.pad_at_pixel(x, y)
    if pad >= 0:
        rules.press_pad(state, pad)
        draw_everything()


def frame(timestamp):
    """The heartbeat: the flashing sequence."""
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(100, timestamp - last_time)
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

    canvas = get_element("simon-board")
    canvas.width = draw.board_pixel_size()
    canvas.height = draw.board_pixel_size()
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    for element_id, action in [("btn-pad0", "pad0"), ("btn-pad1", "pad1"),
                               ("btn-pad2", "pad2"), ("btn-pad3", "pad3"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
