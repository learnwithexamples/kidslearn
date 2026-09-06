"""memory_web.py - the glue between the web page and the Python Memory Match."""

from js import document, window
from pyodide.ffi import create_proxy

import memory_rules as rules
import memory_draw as draw

BEST_KEY = "memory-python-best"

state = None
ctx = None
canvas = None
last_time = 0.0
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def load_best():
    """The fewest moves this browser has seen (0 means none yet)."""
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("moves").textContent = str(state["moves"])
    get_element("pairs").textContent = "%d / %d" % (state["pairs"], rules.PAIR_COUNT)
    get_element("stars").textContent = "*" * rules.stars_for_moves(state["moves"])

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
        button.textContent = "Done"
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
    """Deal a fresh set of cards."""
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
    elif action == "flip":
        rules.flip_card(state, rules.card_index(state["cursor"]["column"], state["cursor"]["row"]))
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
    """Turn over whichever card was clicked or tapped."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    point = event.touches.item(0) if hasattr(event, "touches") and event.touches.length else event
    x = (point.clientX - box.left) * (canvas.width / box.width)
    y = (point.clientY - box.top) * (canvas.height / box.height)
    index = draw.card_at_pixel(x, y)
    if index >= 0:
        state["cursor"]["column"] = index % rules.GRID_COLUMNS
        state["cursor"]["row"] = index // rules.GRID_COLUMNS
        rules.flip_card(state, index)
        draw_everything()


def frame(timestamp):
    """The heartbeat: count the peek timer down and redraw."""
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

    canvas = get_element("memory-board")
    canvas.width = draw.board_pixel_width()
    canvas.height = draw.board_pixel_height()
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    for element_id, action in [("btn-up", "up"), ("btn-down", "down"), ("btn-left", "left"),
                               ("btn-right", "right"), ("btn-flip", "flip"),
                               ("pause-btn", "pause"), ("restart-btn", "restart")]:
        connect_button(element_id, action)

    start_new_game()
    window.requestAnimationFrame(PROXIES[0])
