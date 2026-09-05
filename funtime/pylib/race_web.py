"""race_web.py - the glue between the web page and the Python racing game.

Steering is different from the other two games: you HOLD the key down. So this
file keeps a small record of which keys are down and hands it to the rules
every frame.
"""

from js import document, window
from pyodide.ffi import create_proxy

import race_rules as rules
import race_draw as draw

BEST_KEY = "race-python-best"

state = None
ctx = None
last_time = 0.0
held = {"left": False, "right": False, "faster": False, "slower": False}
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def load_best():
    """The best score this browser has ever seen."""
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def save_best(score):
    """Remember a new best score."""
    window.localStorage.setItem(BEST_KEY, str(score))


def update_scoreboard():
    """Copy the numbers from the race onto the page."""
    get_element("score").textContent = str(state["score"])
    get_element("metres").textContent = str(rules.metres_driven(state))
    get_element("level").textContent = str(state["level"])

    best = load_best()
    if state["score"] > best:
        save_best(state["score"])
        best = state["score"]
    get_element("best").textContent = str(best)


def update_pause_button():
    """Keep the pause button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_over"]:
        button.textContent = "✖ Crashed"
    elif state["is_paused"]:
        button.textContent = "▶ Go"
    else:
        button.textContent = "⏸ Pause"


def draw_everything():
    """Draw one frame and refresh the numbers."""
    draw.render_game(ctx, state)
    update_scoreboard()
    update_pause_button()


def release_all():
    """Forget every held key (used when the page loses focus)."""
    for name in held:
        held[name] = False


def start_new_game():
    """Throw the old race away and line up again, paused."""
    global state
    state = rules.create_game()
    state["is_paused"] = True
    release_all()
    draw_everything()


def set_held(action, is_down):
    """Remember that a driving key went down or came up."""
    if action in held:
        held[action] = is_down
        if is_down and state["is_paused"] and not state["is_over"]:
            state["is_paused"] = False


def on_key_down(event):
    """React to a key going down."""
    key = str(event.key).lower()
    if key in ("arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar"):
        event.preventDefault()

    action = rules.action_for_key(event.key)
    if action is None:
        return
    if action in held:
        set_held(action, True)
    elif action == "pause":
        rules.toggle_pause(state)
        draw_everything()
    elif action == "restart":
        start_new_game()


def on_key_up(event):
    """React to a key coming up."""
    action = rules.action_for_key(event.key)
    if action in held:
        set_held(action, False)


def frame(timestamp):
    """The heartbeat, about 60 times a second."""
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(100, timestamp - last_time)
    last_time = timestamp

    state["steering"] = rules.steering_from_input(held)
    state["boost"] = rules.boost_from_input(held)

    rules.update_race(state, elapsed)
    draw_everything()
    window.requestAnimationFrame(PROXIES[0])


def connect_hold_button(element_id, action):
    """An on-screen button you hold, like a key."""
    element = get_element(element_id)
    if element is None:
        return

    def press(event):
        event.preventDefault()
        set_held(action, True)

    def release(event):
        event.preventDefault()
        set_held(action, False)

    press_proxy = create_proxy(press)
    release_proxy = create_proxy(release)
    PROXIES.append(press_proxy)
    PROXIES.append(release_proxy)

    for name in ("mousedown", "touchstart"):
        element.addEventListener(name, press_proxy)
    for name in ("mouseup", "mouseleave", "touchend", "touchcancel"):
        element.addEventListener(name, release_proxy)


def connect_tap_button(element_id, action):
    """An on-screen button you tap once."""
    element = get_element(element_id)
    if element is None:
        return

    def handler(event):
        event.preventDefault()
        if action == "pause":
            rules.toggle_pause(state)
            draw_everything()
        elif action == "restart":
            start_new_game()

    proxy = create_proxy(handler)
    PROXIES.append(proxy)
    element.addEventListener("click", proxy)
    element.addEventListener("touchstart", proxy)


def start_game():
    """Everything that has to happen once, when the page is ready."""
    global ctx

    road_canvas = get_element("race-road")
    road_canvas.width = rules.ROAD_WIDTH
    road_canvas.height = rules.ROAD_HEIGHT
    ctx = road_canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_down = create_proxy(on_key_down)
    key_up = create_proxy(on_key_up)
    blur = create_proxy(lambda event: release_all())
    PROXIES.extend([key_down, key_up, blur])
    document.addEventListener("keydown", key_down)
    document.addEventListener("keyup", key_up)
    window.addEventListener("blur", blur)

    for element_id, action in [("btn-left", "left"), ("btn-right", "right"),
                               ("btn-faster", "faster"), ("btn-slower", "slower")]:
        connect_hold_button(element_id, action)
    connect_tap_button("pause-btn", "pause")
    connect_tap_button("restart-btn", "restart")

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
