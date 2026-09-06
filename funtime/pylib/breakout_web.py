"""breakout_web.py - the glue between the web page and Python Breakout."""

from js import document, window
from pyodide.ffi import create_proxy

import breakout_rules as rules
import breakout_draw as draw

BEST_KEY = "breakout-python-best"

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
    get_element("bricks").textContent = str(rules.bricks_left(state))

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
        button.textContent = "> Launch"
    else:
        button.textContent = "|| Pause"


def draw_everything():
    """Draw one frame and refresh the numbers."""
    draw.render_game(ctx, state)
    update_scoreboard()
    update_pause_button()


def start_new_game():
    """A fresh wall of bricks and three lives."""
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
        state["steering"] = -1
    elif action == "right":
        state["steering"] = 1
    draw_everything()


def on_key_down(event):
    """A key going down starts the paddle moving."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_key_up(event):
    """A key coming up stops it - that is what makes the paddle glide."""
    action = rules.action_for_key(event.key)
    if action == "left" and state["steering"] == -1:
        state["steering"] = 0
    elif action == "right" and state["steering"] == 1:
        state["steering"] = 0


def on_mouse_move(event):
    """The paddle follows the mouse across the canvas."""
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    wanted = x - rules.PADDLE_WIDTH / 2
    state["paddle_x"] = max(0, min(rules.FIELD_WIDTH - rules.PADDLE_WIDTH, wanted))


def on_click(event):
    """Clicking the field launches the ball or pauses."""
    event.preventDefault()
    do_action("pause")


def frame(timestamp):
    """The heartbeat."""
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(60, timestamp - last_time)
    last_time = timestamp

    rules.update_game(state, elapsed)
    draw_everything()
    window.requestAnimationFrame(PROXIES[0])


def connect_hold_button(element_id, direction):
    """An on-screen button that steers only while it is held down."""
    element = get_element(element_id)
    if element is None:
        return

    def press(event):
        event.preventDefault()
        state["steering"] = direction

    def release(event):
        if state["steering"] == direction:
            state["steering"] = 0

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

    canvas = get_element("breakout-board")
    canvas.width = rules.FIELD_WIDTH
    canvas.height = rules.FIELD_HEIGHT
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    down_proxy = create_proxy(on_key_down)
    up_proxy = create_proxy(on_key_up)
    move_proxy = create_proxy(on_mouse_move)
    click_proxy = create_proxy(on_click)
    PROXIES.extend([down_proxy, up_proxy, move_proxy, click_proxy])
    document.addEventListener("keydown", down_proxy)
    document.addEventListener("keyup", up_proxy)
    canvas.addEventListener("mousemove", move_proxy)
    canvas.addEventListener("click", click_proxy)

    connect_hold_button("btn-left", -1)
    connect_hold_button("btn-right", 1)
    connect_button("pause-btn", "pause")
    connect_button("restart-btn", "restart")

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
