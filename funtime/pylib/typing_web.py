"""typing_web.py - the glue between the web page and Python Typing Race."""

from js import document, window
from pyodide.ffi import create_proxy

import typing_rules as rules
import typing_draw as draw

BEST_KEY = "typing-python-best"

state = None
ctx = None
canvas = None
last_time = 0.0
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def load_best():
    """The fastest race this browser has seen."""
    saved = window.localStorage.getItem(BEST_KEY)
    return int(saved) if saved else 0


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("wpm").textContent = str(rules.words_per_minute(state))
    get_element("accuracy").textContent = "%d%%" % rules.accuracy(state)
    get_element("words").textContent = str(state["correct"])

    best = load_best()
    if state["is_over"] and rules.words_per_minute(state) > best:
        best = rules.words_per_minute(state)
        window.localStorage.setItem(BEST_KEY, str(best))
    get_element("best").textContent = str(best)


def update_pause_button():
    """Keep the button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_over"]:
        button.textContent = "Race again"
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
    """A fresh race."""
    global state
    state = rules.create_game()
    draw_everything()


def do_action(action):
    """Carry out one game action."""
    if action is None:
        return
    if action == "new":
        rules.new_race(state)
    elif action == "pause":
        if state["is_over"]:
            rules.new_race(state)
        else:
            rules.toggle_pause(state)
    elif action == "space":
        rules.submit_word(state)
    elif action == "back":
        rules.backspace(state)
    else:
        rules.type_letter(state, action)
    draw_everything()


def on_key(event):
    """Typing IS the game, so almost every key matters."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_hidden_input(event):
    """A phone has no physical keyboard, so read the on-screen one."""
    hidden = get_element("hidden-input")
    text = hidden.value
    hidden.value = ""
    for letter in text:
        do_action(rules.action_for_key(letter))


def on_open_keyboard(event):
    """Tapping the button focuses the hidden box, which opens the keyboard."""
    event.preventDefault()
    hidden = get_element("hidden-input")
    if hidden is not None:
        hidden.focus()


def on_words_chosen(words, note):
    """The player picked a word list, so start a race on it.

    INPUT: words - a JavaScript array, empty for the game's own list.
    """
    chosen = [str(word) for word in words]
    state["pool"] = chosen if chosen else None
    rules.new_race(state)
    draw_everything()

    line = get_element("source-note")
    if line is not None:
        line.textContent = note


def connect_word_source():
    """Let the player race on a Classical Roots lesson.

    ALGORITHM: the panel itself is shared with the JavaScript version, over in
    lib/wordlists.js. All this has to do is take the words it hands back, hang
    them on the game, and start a fresh race.
    """
    lists = getattr(window, "WordLists", None)
    if lists is None:
        return
    proxy = create_proxy(on_words_chosen)
    PROXIES.append(proxy)
    lists.connectPicker(proxy)


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

    canvas = get_element("typing-board")
    canvas.width = draw.FIELD_WIDTH
    canvas.height = draw.FIELD_HEIGHT
    ctx = canvas.getContext("2d")

    PROXIES.append(create_proxy(frame))

    key_proxy = create_proxy(on_key)
    PROXIES.append(key_proxy)
    document.addEventListener("keydown", key_proxy)

    hidden = get_element("hidden-input")
    if hidden is not None:
        input_proxy = create_proxy(on_hidden_input)
        PROXIES.append(input_proxy)
        hidden.addEventListener("input", input_proxy)

    keyboard = get_element("btn-keyboard")
    if keyboard is not None:
        open_proxy = create_proxy(on_open_keyboard)
        PROXIES.append(open_proxy)
        keyboard.addEventListener("click", open_proxy)

    connect_button("pause-btn", "pause")
    connect_button("restart-btn", "new")

    start_new_game()
    connect_word_source()
    window.requestAnimationFrame(PROXIES[0])
