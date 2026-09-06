"""hangman_web.py - the glue between the web page and Python Hangman."""

from js import document, window
from pyodide.ffi import create_proxy

import hangman_rules as rules
import hangman_draw as draw

state = None
ctx = None
canvas = None
PROXIES = []


def get_element(element_id):
    """Find one thing on the page by its id."""
    return document.getElementById(element_id)


def update_scoreboard():
    """Copy the numbers from the game onto the page."""
    get_element("lives").textContent = str(rules.lives_left(state))
    get_element("letters").textContent = str(len(state["guessed"]))
    get_element("wins").textContent = str(state["wins"])
    get_element("losses").textContent = str(state["losses"])


def update_pause_button():
    """Keep the button's label honest."""
    button = get_element("pause-btn")
    if button is None:
        return
    if state["is_over"]:
        button.textContent = "-> New word"
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
    """A fresh word and a clean score."""
    global state
    state = rules.create_game()
    draw_everything()


def do_action(action):
    """Carry out one game action."""
    if action is None:
        return
    if action == "new":
        rules.new_round(state)
    elif action == "pause":
        if state["is_over"]:
            rules.new_round(state)
        else:
            rules.toggle_pause(state)
    else:
        rules.guess_letter(state, action)
    draw_everything()


def on_key(event):
    """Any letter is a guess."""
    action = rules.action_for_key(event.key)
    if action is not None:
        event.preventDefault()
    do_action(action)


def on_board_click(event):
    """The alphabet along the bottom can be clicked."""
    event.preventDefault()
    box = canvas.getBoundingClientRect()
    x = (event.clientX - box.left) * (canvas.width / box.width)
    y = (event.clientY - box.top) * (canvas.height / box.height)

    letter = draw.letter_at_pixel(x, y)
    if letter is not None:
        do_action(letter)
    elif state["is_over"]:
        do_action("new")


def on_vowels(event):
    """A friendly shortcut for young players: try all five vowels."""
    event.preventDefault()
    for letter in "AEIOU":
        rules.guess_letter(state, letter)
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

    canvas = get_element("hangman-board")
    canvas.width = draw.FIELD_WIDTH
    canvas.height = draw.FIELD_HEIGHT
    ctx = canvas.getContext("2d")

    key_proxy = create_proxy(on_key)
    click_proxy = create_proxy(on_board_click)
    PROXIES.extend([key_proxy, click_proxy])
    document.addEventListener("keydown", key_proxy)
    canvas.addEventListener("click", click_proxy)

    vowels = get_element("btn-vowels")
    if vowels is not None:
        vowel_proxy = create_proxy(on_vowels)
        PROXIES.append(vowel_proxy)
        vowels.addEventListener("click", vowel_proxy)

    connect_button("pause-btn", "pause")
    connect_button("restart-btn", "new")

    start_new_game()
