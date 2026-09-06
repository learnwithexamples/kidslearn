"""asteroids_web.py - the glue between the web page and Python Asteroids."""

from js import document, window
from pyodide.ffi import create_proxy

import asteroids_rules as rules
import asteroids_draw as draw

BEST_KEY = "asteroids-python-best"

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
    get_element("wave").textContent = str(state["wave"])

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
    """A fresh ship and a first wave of rocks."""
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
    elif action == "thrust":
        state["thrusting"] = True
    elif action == "fire":
        rules.fire_bullet(state)
    draw_everything()


def on_key_down(event):
    """Turning and thrust are HELD; firing happens once per press."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_key_up(event):
    """Letting go stops the ship turning or thrusting."""
    action = rules.action_for_key(event.key)
    if action == "left" and state["turning"] == -1:
        state["turning"] = 0
    elif action == "right" and state["turning"] == 1:
        state["turning"] = 0
    elif action == "thrust":
        state["thrusting"] = False


def on_press(event):
    """Tapping the field fires."""
    event.preventDefault()
    do_action("fire")


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


def connect_hold_button(element_id, on_press_action, on_release_action):
    """An on-screen button that acts only while it is held down."""
    element = get_element(element_id)
    if element is None:
        return

    def press(event):
        event.preventDefault()
        on_press_action()

    def release(event):
        on_release_action()

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


def turn_left():
    """Start turning to the left."""
    state["turning"] = -1


def turn_right():
    """Start turning to the right."""
    state["turning"] = 1


def stop_turning():
    """Stop turning."""
    state["turning"] = 0


def start_thrust():
    """Fire the engine."""
    state["thrusting"] = True


def stop_thrust():
    """Cut the engine."""
    state["thrusting"] = False


def start_game():
    """Everything that has to happen once, when the page is ready."""
    global ctx, canvas

    canvas = get_element("asteroids-board")
    canvas.width = rules.FIELD_WIDTH
    canvas.height = rules.FIELD_HEIGHT
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    down_proxy = create_proxy(on_key_down)
    up_proxy = create_proxy(on_key_up)
    press_proxy = create_proxy(on_press)
    PROXIES.extend([down_proxy, up_proxy, press_proxy])
    document.addEventListener("keydown", down_proxy)
    document.addEventListener("keyup", up_proxy)
    canvas.addEventListener("mousedown", press_proxy)
    canvas.addEventListener("touchstart", press_proxy)

    connect_hold_button("btn-left", turn_left, stop_turning)
    connect_hold_button("btn-right", turn_right, stop_turning)
    connect_hold_button("btn-thrust", start_thrust, stop_thrust)
    connect_button("btn-fire", "fire")
    connect_button("pause-btn", "pause")
    connect_button("restart-btn", "restart")

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
