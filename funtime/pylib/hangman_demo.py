"""hangman_demo.py - the demos beside the editor in the Python workshop."""

import json

import hangman_rules as rules
import hangman_draw as draw

SCALE = 0.66

kind = "mask"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(draw.FIELD_WIDTH * SCALE), round(draw.FIELD_HEIGHT * SCALE)])


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    demo = rules.create_game()
    if kind == "mask":
        demo["word"] = "PYTHON"
        demo["guessed"] = "PO"
    elif kind == "wrong":
        demo["word"] = "RABBIT"
        demo["guessed"] = "RAXZ"


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def update_demo(elapsed):
    """Hangman has no clock, so nothing happens between key presses."""
    return


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)
        draw.render_game(ctx, demo)

        if kind == "mask":
            set_message("word %s  guessed '%s'  ->  %s"
                        % (demo["word"], demo["guessed"],
                           rules.masked_word(demo["word"], demo["guessed"])))
        elif kind == "wrong":
            set_message("wrong letters '%s'  -  %d lives left"
                        % (rules.wrong_letters(demo), rules.lives_left(demo)))
        else:
            set_message("%s  -  %d lives  -  %s"
                        % (rules.masked_word(demo["word"], demo["guessed"]),
                           rules.lives_left(demo), rules.game_status(demo)))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "mask":
        return json.dumps([["Guess T", "Try the letter T", "T"],
                           ["Guess H", "Try the letter H", "H"],
                           ["Guess N", "Try the letter N", "N"],
                           ["Guess Y", "Try the letter Y", "Y"],
                           ["Reset", "Start again", "restart"]])
    if demo_kind == "wrong":
        return json.dumps([["Guess Q", "A wrong letter", "Q"],
                           ["Guess B", "A right letter", "B"],
                           ["Guess K", "Another wrong one", "K"],
                           ["Reset", "Start again", "restart"]])
    return json.dumps([["A E I O U", "Try all the vowels", "vowels"],
                       ["Guess S", "Try the letter S", "S"],
                       ["Guess T", "Try the letter T", "T"],
                       ["Guess R", "Try the letter R", "R"],
                       ["New word", "Hide a new word", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if action == "vowels":
        for letter in "AEIOU":
            rules.guess_letter(demo, letter)
        return
    if kind in ("mask", "wrong"):
        # these demos are just pictures, so add the letter straight in
        if action not in demo["guessed"]:
            demo["guessed"] += action
        return
    rules.guess_letter(demo, action)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "new":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
