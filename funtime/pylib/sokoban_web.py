"""sokoban_web.py - the glue between the web page and Python Sokoban."""

from js import document, window
from pyodide.ffi import create_proxy

import sokoban_rules as rules
import sokoban_draw as draw

state = None
ctx = None
canvas = None
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("level").textContent = "%d / %d" % (state["level"] + 1, len(rules.LEVELS))
    get_element("moves").textContent = str(state["moves"])
    get_element("boxes").textContent = "%d / %d" % (rules.boxes_on_goals(state),
                                                    len(state["boxes"]))
    get_element("solved").textContent = str(state["solved"])


def update_pause_button():
    """Keep the button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_solved"]:
        button.textContent = "-> Next level"
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
    """Back to level 1."""
    global state
    state = rules.create_game()
    draw_everything()


def do_action(action):
    """Carry out one game action."""
    if action is None:
        return
    if action == "pause":
        if state["is_solved"]:
            rules.next_level(state)
        else:
            rules.toggle_pause(state)
    elif action == "up":
        rules.move_player(state, 0, -1)
    elif action == "down":
        rules.move_player(state, 0, 1)
    elif action == "left":
        rules.move_player(state, -1, 0)
    elif action == "right":
        rules.move_player(state, 1, 0)
    elif action == "undo":
        rules.undo_move(state)
    elif action == "reset":
        rules.reset_level(state)
    elif action == "next":
        rules.next_level(state)
    draw_everything()


def on_key(event):
    """React to a key press."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_board_click(event):
    """Tapping a square walks one step towards it."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    y = (event.clientY - box.top) * (canvas.height / box.height)
    cell = draw.cell_at_pixel(x, y)
    if cell is None:
        return

    across = cell[0] - state["player"]["x"]
    down = cell[1] - state["player"]["y"]
    if across == 0 and down == 0:
        return

    if abs(across) >= abs(down):
        do_action("right" if across > 0 else "left")
    else:
        do_action("down" if down > 0 else "up")


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

    canvas = get_element("sokoban-board")
    canvas.width = draw.board_pixel_width()
    canvas.height = draw.board_pixel_height()
    ctx = canvas.getContext("2d")

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"),
                               ("btn-left", "left"), ("btn-right", "right"),
                               ("btn-undo", "undo"), ("btn-next", "next"),
                               ("pause-btn", "pause"), ("restart-btn", "reset")]:
        connect_button(element_id, action)

    start_new_game()
