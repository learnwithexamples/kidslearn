"""typing_demo.py - the demos beside the editor in the Python workshop."""

import json

import typing_rules as rules
import typing_draw as draw

SCALE = 0.7

kind = "match"
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
    if kind == "match":
        demo["words"] = ["water", "little", "before", "number", "people"]
        demo["typed"] = "wat"
    elif kind == "sums":
        demo["words"] = rules.pick_words(rules.WORDS_PER_RACE)
        demo["correct"] = 12
        demo["wrong"] = 3
        demo["letters_typed"] = 60
        demo["seconds"] = 30
        demo["has_started"] = True


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def update_demo(elapsed):
    """Let the demo's clock tick."""
    if kind in ("game", "final"):
        rules.update_game(demo, elapsed)


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)
        draw.render_game(ctx, demo)

        if kind == "match":
            word = rules.current_word(demo)
            set_message("matching_letters(%r, %r) -> %d"
                        % (word, demo["typed"], rules.matching_letters(word, demo["typed"])))
        elif kind == "sums":
            set_message("%d right, %d wrong, %d letters in %ds  ->  %d WPM, %d%% right"
                        % (demo["correct"], demo["wrong"], demo["letters_typed"],
                           demo["seconds"], rules.words_per_minute(demo),
                           rules.accuracy(demo)))
        else:
            set_message("%d WPM  -  %d%% right  -  %d words done"
                        % (rules.words_per_minute(demo), rules.accuracy(demo),
                           demo["correct"]))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "match":
        return json.dumps([["Type 'e'", "The right next letter", "letter_e"],
                           ["Type 'x'", "A wrong letter", "letter_x"],
                           ["Backspace", "Rub one out", "back"],
                           ["Reset", "Start again", "restart"]])
    if demo_kind == "sums":
        return json.dumps([["+5 seconds", "Let time pass", "slower"],
                           ["+1 right word", "Type another word", "faster"],
                           ["+1 wrong word", "Make a mistake", "mistake"],
                           ["Reset", "Start again", "restart"]])
    return json.dumps([["Type the word", "Type it correctly", "auto"],
                       ["Type it wrong", "Get it wrong on purpose", "wrong"],
                       ["SPACE", "Submit the word", "space"],
                       ["New race", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind == "match":
        if action == "letter_e":
            demo["typed"] += "e"
        elif action == "letter_x":
            demo["typed"] += "x"
        elif action == "back":
            demo["typed"] = demo["typed"][:-1]
        return

    if kind == "sums":
        if action == "slower":
            demo["seconds"] += 5
        elif action == "faster":
            demo["correct"] += 1
            demo["letters_typed"] += 5
        elif action == "mistake":
            demo["wrong"] += 1
        return

    if action == "auto":
        for letter in rules.current_word(demo):
            rules.type_letter(demo, letter)
    elif action == "wrong":
        for letter in "zzz":
            rules.type_letter(demo, letter)
    elif action == "space":
        rules.submit_word(demo)
    elif action == "back":
        rules.backspace(demo)
    elif len(action) == 1:
        rules.type_letter(demo, action)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "new":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
