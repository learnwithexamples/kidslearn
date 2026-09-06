"""mines_web.py - the glue between the web page and Python Minesweeper."""

import math

from js import document, window
from pyodide.ffi import create_proxy

import mines_rules as rules
import mines_draw as draw

BEST_KEY = "mines-python-best"

state = None
ctx = None
canvas = None
last_time = 0.0
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def load_best():
    """The quickest clearance this browser has seen."""
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("mines").textContent = str(rules.mines_left(state))
    get_element("time").textContent = str(int(state["seconds"]))
    get_element("opened").textContent = str(rules.revealed_count(state))

    best = load_best()
    if state["is_won"]:
        taken = round(state["seconds"])
        if best == 0 or taken < best:
            window.localStorage.setItem(BEST_KEY, str(taken))
            best = taken
    get_element("best").textContent = "-" if best == 0 else str(best)


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
    """A fresh covered board."""
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
    elif action == "dig":
        rules.reveal_cell(state, state["cursor"]["column"], state["cursor"]["row"])
    elif action == "flag":
        rules.toggle_flag(state, state["cursor"]["column"], state["cursor"]["row"])
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


def cell_from_event(event):
    """Which square is under the pointer?"""
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    y = (event.clientY - box.top) * (canvas.height / box.height)
    return draw.cell_at_pixel(x, y)


def on_click(event):
    """A left click digs."""
    cell = cell_from_event(event)
    if cell is None:
        return
    state["cursor"] = {"column": cell[0], "row": cell[1]}
    rules.reveal_cell(state, cell[0], cell[1])
    draw_everything()


def on_right_click(event):
    """A right click plants or lifts a flag."""
    event.preventDefault()
    cell = cell_from_event(event)
    if cell is None:
        return
    state["cursor"] = {"column": cell[0], "row": cell[1]}
    rules.toggle_flag(state, cell[0], cell[1])
    draw_everything()


def frame(timestamp):
    """The heartbeat: only the clock ticks."""
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

    canvas = get_element("mines-board")
    canvas.width = draw.board_pixel_size()
    canvas.height = draw.board_pixel_size()
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_click)
    right_proxy = create_proxy(on_right_click)
    PROXIES.extend([key_proxy, click_proxy, right_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)
    canvas.addEventListener("contextmenu", right_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"),
                               ("btn-left", "left"), ("btn-right", "right"),
                               ("btn-dig", "dig"), ("btn-flag", "flag"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
