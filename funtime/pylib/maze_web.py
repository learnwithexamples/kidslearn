"""maze_web.py - the glue between the web page and Python Maze Runner."""

from js import document, window
from pyodide.ffi import create_proxy

import maze_rules as rules
import maze_draw as draw

state = None
ctx = None
canvas = None
last_time = 0.0
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("steps").textContent = str(state["steps"])
    get_element("shortest").textContent = str(state["shortest"])
    get_element("time").textContent = str(int(state["seconds"]))
    get_element("solved").textContent = str(state["solved"])


def update_pause_button():
    """Keep the button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_solved"]:
        button.textContent = "-> New maze"
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
    """Dig a fresh maze."""
    global state
    state = rules.create_game()
    draw_everything()


def do_action(action):
    """Carry out one game action."""
    if action is None:
        return
    if action == "pause":
        if state["is_solved"]:
            rules.new_maze(state)
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
    elif action == "hint":
        rules.show_hint(state)
    elif action == "new":
        rules.new_maze(state)
    draw_everything()


def on_key(event):
    """React to a key press."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_board_click(event):
    """Tapping walks one step towards where you tapped."""
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

    canvas = get_element("maze-board")
    canvas.width = draw.board_pixel_width()
    canvas.height = draw.board_pixel_height()
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"),
                               ("btn-left", "left"), ("btn-right", "right"),
                               ("btn-hint", "hint"), ("pause-btn", "pause"),
                               ("restart-btn", "new")]:
        connect_button(element_id, action)

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
