"""lights_web.py - the glue between the web page and Python Lights Out."""

from js import document, window
from pyodide.ffi import create_proxy

import lights_rules as rules
import lights_draw as draw

BEST_KEY = "lights-python-best"

state = None
ctx = None
canvas = None
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def load_best():
    """The fewest presses this browser has seen (0 means none yet)."""
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("moves").textContent = str(state["moves"])
    get_element("lit").textContent = str(rules.count_lights_on(state["lights"]))

    best = load_best()
    if state["is_over"] and (best == 0 or state["moves"] < best):
        window.localStorage.setItem(BEST_KEY, str(state["moves"]))
        best = state["moves"]
    get_element("best").textContent = "-" if best == 0 else str(best)


def update_pause_button():
    """Keep the pause button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_over"]:
        button.textContent = "Solved"
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
    """Scramble a fresh puzzle."""
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
    elif action == "press":
        rules.press_square(state, state["cursor"]["column"], state["cursor"]["row"])
    elif action == "left":
        rules.move_cursor(state, -1, 0)
    elif action == "right":
        rules.move_cursor(state, 1, 0)
    elif action == "up":
        rules.move_cursor(state, 0, -1)
    elif action == "down":
        rules.move_cursor(state, 0, 1)
    draw_everything()


def on_key(event):
    """React to a key press."""
    key = str(event.key).lower()
    if key in ("arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar"):
        event.preventDefault()
    do_action(rules.action_for_key(event.key))


def on_board_click(event):
    """Press whichever square was clicked or tapped."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    y = (event.clientY - box.top) * (canvas.height / box.height)
    square = draw.square_at_pixel(x, y)
    if square is not None:
        state["cursor"] = {"column": square[0], "row": square[1]}
        rules.press_square(state, square[0], square[1])
        draw_everything()


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

    canvas = get_element("lights-board")
    canvas.width = draw.board_pixel_size()
    canvas.height = draw.board_pixel_size()
    ctx = canvas.getContext("2d")

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"), ("btn-left", "left"),
                               ("btn-right", "right"), ("btn-press", "Press"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action if action != "Press" else "press")

    start_new_game()
