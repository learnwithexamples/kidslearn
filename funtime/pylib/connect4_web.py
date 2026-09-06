"""connect4_web.py - the glue between the web page and Python Connect Four."""

from js import document
from pyodide.ffi import create_proxy

import connect4_rules as rules
import connect4_draw as draw

state = None
ctx = None
canvas = None
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("wins").textContent = str(state["wins"])
    get_element("losses").textContent = str(state["losses"])
    get_element("draws").textContent = str(state["draws"])


def update_pause_button():
    """Keep the pause button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_over"]:
        button.textContent = "Next round"
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
    """Clear the board and the score."""
    global state
    state = rules.create_game()
    draw_everything()


def do_action(action):
    """Carry out one game action."""
    if action is None:
        return
    if action == "restart":
        rules.next_round(state)
    elif action == "pause":
        if state["is_over"]:
            rules.next_round(state)
        else:
            rules.toggle_pause(state)
    elif action == "drop":
        rules.play_column(state, state["cursor"])
    elif action == "left":
        rules.move_cursor(state, -1)
    elif action == "right":
        rules.move_cursor(state, 1)
    draw_everything()


def on_key(event):
    """React to a key press."""
    key = str(event.key).lower()
    if key in ("arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar"):
        event.preventDefault()
    do_action(rules.action_for_key(event.key))


def on_board_click(event):
    """Drop a counter into whichever column was clicked."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    column = draw.column_at_pixel(x)
    if column >= 0:
        state["cursor"] = column
        rules.play_column(state, column)
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

    canvas = get_element("connect4-board")
    canvas.width = draw.board_pixel_width()
    canvas.height = draw.board_pixel_height()
    ctx = canvas.getContext("2d")

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    for element_id, action in [("btn-left", "left"), ("btn-right", "right"), ("btn-drop", "drop"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
