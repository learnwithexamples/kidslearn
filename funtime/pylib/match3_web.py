"""match3_web.py - the glue between the web page and Python Match Three."""

from js import document, window
from pyodide.ffi import create_proxy

import match3_rules as rules
import match3_draw as draw

BEST_KEY = "match3-python-best"

state = None
ctx = None
canvas = None
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
    get_element("moves").textContent = str(state["moves"])
    get_element("chain").textContent = str(state["best_chain"])

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
    button.textContent = "> Play" if state["is_paused"] else "|| Pause"


def draw_everything():
    """Draw one frame and refresh the numbers."""
    draw.render_game(ctx, state)
    update_scoreboard()
    update_pause_button()

    # nobody should ever be stuck: deal again if there is no move left
    if not state["is_paused"] and not rules.has_any_move(state["board"]):
        rules.shuffle_board(state)


def start_new_game():
    """A fresh board and a clean score."""
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
    elif action == "shuffle":
        rules.shuffle_board(state)
    elif action == "pick":
        rules.pick_square(state, dict(state["cursor"]))
    elif action == "up":
        rules.move_cursor(state, 0, -1)
    elif action == "down":
        rules.move_cursor(state, 0, 1)
    elif action == "left":
        rules.move_cursor(state, -1, 0)
    elif action == "right":
        rules.move_cursor(state, 1, 0)
    draw_everything()


def on_key(event):
    """React to a key press."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_board_click(event):
    """Click one shape then its neighbour to swap them."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    y = (event.clientY - box.top) * (canvas.height / box.height)
    cell = draw.cell_at_pixel(x, y)
    if cell is None:
        return

    state["cursor"] = {"column": cell[0], "row": cell[1]}
    rules.pick_square(state, {"column": cell[0], "row": cell[1]})
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

    canvas = get_element("match3-board")
    canvas.width = draw.board_pixel_size()
    canvas.height = draw.board_pixel_size()
    ctx = canvas.getContext("2d")

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"),
                               ("btn-left", "left"), ("btn-right", "right"),
                               ("btn-pick", "pick"), ("btn-shuffle", "shuffle"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
