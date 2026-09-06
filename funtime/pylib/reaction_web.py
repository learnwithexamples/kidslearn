"""reaction_web.py - the glue between the web page and Python Reaction Test."""

from js import document, window
from pyodide.ffi import create_proxy

import reaction_rules as rules
import reaction_draw as draw

BEST_KEY = "reaction-python-best"

state = None
ctx = None
canvas = None
last_time = 0.0
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def load_best():
    """The fastest press this browser has seen."""
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("last").textContent = ("%d ms" % state["last_time"]) if state["last_time"] else "-"
    average = rules.average_time(state)
    get_element("average").textContent = ("%d ms" % average) if average else "-"
    get_element("goes").textContent = str(state["attempts"])

    best = load_best()
    now = rules.best_time(state)
    if now and (best == 0 or now < best):
        best = now
        window.localStorage.setItem(BEST_KEY, str(best))
    get_element("best").textContent = ("%d ms" % best) if best else "-"


def update_pause_button():
    """Keep the button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    button.textContent = "> Play" if state["is_paused"] else "|| Pause"


def draw_everything():
    """Draw one frame and refresh the numbers."""
    draw.render_game(ctx, state)
    update_scoreboard()
    update_pause_button()


def start_new_game():
    """Clear the scores and start again."""
    global state
    state = rules.create_game()
    draw_everything()


def do_action(action):
    """Carry out one game action."""
    if action is None:
        return
    if action == "press":
        rules.press(state)
    elif action == "new":
        rules.new_game(state)
    elif action == "pause":
        rules.toggle_pause(state)
    draw_everything()


def on_key(event):
    """Space is the whole game."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_press(event):
    """Clicking or tapping the panel counts as a press.

    mousedown, not click: a click only happens when the button comes back up,
    and in a game measured in milliseconds that wait is not fair.
    """
    event.preventDefault()
    do_action("press")


def frame(timestamp):
    """The heartbeat: the delay and the stopwatch."""
    global last_time
    if last_time == 0:
        last_time = timestamp
    elapsed = min(100, timestamp - last_time)
    last_time = timestamp

    rules.update_game(state, elapsed)
    draw_everything()
    window.requestAnimationFrame(PROXIES[0])


def connect_press_button(element_id, action):
    """An on-screen button that reacts the moment it goes down."""
    element = get_element(element_id)
    if element is None:
        return

    def handler(event):
        event.preventDefault()
        do_action(action)

    proxy = create_proxy(handler)
    PROXIES.append(proxy)
    element.addEventListener("mousedown", proxy)
    element.addEventListener("touchstart", proxy)


def start_game():
    """Everything that has to happen once, when the page is ready."""
    global ctx, canvas

    canvas = get_element("reaction-board")
    canvas.width = draw.FIELD_WIDTH
    canvas.height = draw.FIELD_HEIGHT
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_proxy = create_proxy(on_key)
    press_proxy = create_proxy(on_press)
    PROXIES.extend([key_proxy, press_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("mousedown", press_proxy)
    canvas.addEventListener("touchstart", press_proxy)

    connect_press_button("btn-press", "press")
    connect_press_button("pause-btn", "pause")
    connect_press_button("restart-btn", "new")

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
