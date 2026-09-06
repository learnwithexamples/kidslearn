"""bubbles_web.py - the glue between the web page and Python Bubble Shooter."""

import math

from js import document, window
from pyodide.ffi import create_proxy

import bubbles_rules as rules
import bubbles_draw as draw

BEST_KEY = "bubbles-python-best"

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
    get_element("popped").textContent = str(state["popped"])
    get_element("shots").textContent = str(state["shots"])

    best = load_best()
    if state["score"] > best:
        best = state["score"]
        window.localStorage.setItem(BEST_KEY, str(best))
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
    """A fresh ceiling of bubbles."""
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
    elif action == "left":
        state["turning"] = -1
    elif action == "right":
        state["turning"] = 1
    elif action == "shoot":
        rules.shoot_bubble(state)
    draw_everything()


def on_key_down(event):
    """The arrows aim while held, space shoots."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_key_up(event):
    """Letting go stops the aim moving."""
    action = rules.action_for_key(event.key)
    if action == "left" and state["turning"] == -1:
        state["turning"] = 0
    elif action == "right" and state["turning"] == 1:
        state["turning"] = 0


def on_board_click(event):
    """Aim at where you tap, and shoot in the same gesture."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    y = (event.clientY - box.top) * (canvas.height / box.height)

    angle = math.atan2(y - rules.SHOOTER_Y, x - rules.SHOOTER_X)
    if angle > 0:
        angle = rules.MIN_ANGLE if angle > math.pi / 2 else rules.MAX_ANGLE
    state["angle"] = max(rules.MIN_ANGLE, min(rules.MAX_ANGLE, angle))
    rules.shoot_bubble(state)
    draw_everything()


def frame(timestamp):
    """The heartbeat."""
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(40, timestamp - last_time)
    last_time = timestamp

    rules.update_game(state, elapsed)
    draw_everything()
    window.requestAnimationFrame(PROXIES[0])


def connect_hold_button(element_id, direction):
    """An on-screen button that aims only while it is held down."""
    element = get_element(element_id)
    if element is None:
        return

    def press(event):
        event.preventDefault()
        state["turning"] = direction

    def release(event):
        if state["turning"] == direction:
            state["turning"] = 0

    press_proxy = create_proxy(press)
    release_proxy = create_proxy(release)
    PROXIES.extend([press_proxy, release_proxy])
    element.addEventListener("mousedown", press_proxy)
    element.addEventListener("touchstart", press_proxy)
    for name in ("mouseup", "mouseleave", "touchend", "touchcancel"):
        element.addEventListener(name, release_proxy)


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

    canvas = get_element("bubbles-board")
    canvas.width = rules.FIELD_WIDTH
    canvas.height = rules.FIELD_HEIGHT
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    down_proxy = create_proxy(on_key_down)
    up_proxy = create_proxy(on_key_up)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([down_proxy, up_proxy, click_proxy])
    document.addEventListener("keydown", down_proxy)
    document.addEventListener("keyup", up_proxy)
    canvas.addEventListener("click", click_proxy)

    connect_hold_button("btn-left", -1)
    connect_hold_button("btn-right", 1)
    connect_button("btn-shoot", "shoot")
    connect_button("pause-btn", "pause")
    connect_button("restart-btn", "restart")

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
