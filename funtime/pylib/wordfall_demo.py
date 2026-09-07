"""wordfall_demo.py - the demos beside the editor in the Python workshop.

Five practice fields, each showing the least it can get away with. The steps
about levels have nothing falling at all; the step about widths has no sky.
Fewer moving parts means a student can see what their function just did.
"""

import json

import wordfall_rules as rules
import wordfall_draw as draw

SCALE = 0.68

kind = "sky"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(rules.FIELD_WIDTH * SCALE), round(rules.FIELD_HEIGHT * SCALE)])


def blank_sky():
    """A game with nothing in it, for the demos to fill."""
    state = rules.create_game()
    state["words"] = []
    state["typed"] = ""
    return state


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    demo = blank_sky()

    if kind == "pace":
        demo["level"] = 1
        rules.spawn_word(demo)
    elif kind == "sizes":
        demo["words"] = [rules.make_word(rules.word_for_level(letters * 2), 20)
                         for letters in range(3, 8)]
    elif kind in ("sky", "match"):
        for i in range(4):
            word = rules.spawn_word(demo)
            word["y"] = 40 + i * 60
    else:
        demo = rules.create_game()


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def type_next_letter():
    """The demo's stand-in for a keyboard."""
    target = rules.matching_word(demo, demo["typed"])
    if target is None:
        for word in demo["words"]:
            if target is None or word["y"] > target["y"]:
                target = word
    if target is None:
        return
    rules.type_letter(demo, target["text"][len(demo["typed"])])
    rules.zap_word(demo)


def update_demo(elapsed):
    """Let the demo's clock tick."""
    seconds = elapsed / 1000

    if kind == "sizes":
        return

    if kind in ("pace", "sky", "match"):
        rules.move_words(demo, seconds)
        rules.remove_landed_words(demo)
        demo["lives"] = rules.START_LIVES          # a demo never dies
        demo["is_over"] = False
        if not demo["words"]:
            rules.spawn_word(demo)
        if demo["typed"] and rules.matching_word(demo, demo["typed"]) is None:
            demo["typed"] = ""
    else:
        rules.update_game(demo, elapsed)
        if demo["is_over"]:
            start_demo(kind, json.dumps(flags))


def draw_sizes(ctx):
    """The width of a word, drawn as a box round it."""
    draw.clear_canvas(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT, "#ffffff")
    ctx.font = "18px monospace"
    ctx.textAlign = "left"

    for i, word in enumerate(demo["words"]):
        text = word["text"]
        y = 60 + i * 56
        width = rules.word_width(text)

        ctx.strokeStyle = "#b4b4b4"
        ctx.lineWidth = 1.5
        ctx.strokeRect(20, y - 17, width, 22)
        ctx.fillStyle = "#111111"
        ctx.fillText(text, 20, y)
        ctx.font = "11px monospace"
        ctx.fillStyle = "#777777"
        ctx.fillText("%d x %d = %dpx" % (len(text), rules.LETTER_WIDTH, width), 24 + width, y)
        ctx.font = "18px monospace"

    draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)

        if kind == "sizes":
            draw_sizes(ctx)
            set_message("word_width turns letters into pixels - the box is what it gives back.")
        else:
            draw.render_game(ctx, demo)

            if kind == "pace":
                set_message("level %d  ->  %d px/s, a new word every %d ms"
                            % (demo["level"], rules.speed_for_level(demo["level"]),
                               rules.gap_for_level(demo["level"])))
            elif kind == "match":
                target = rules.matching_word(demo, demo["typed"])
                set_message('typed "%s"  ->  %s'
                            % (demo["typed"],
                               "nothing matches" if target is None
                               else "aiming at " + target["text"]))
            else:
                set_message("%d words falling  -  %d have hit the ground"
                            % (len(demo["words"]), demo["missed"]))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "pace":
        return json.dumps([["Level -", "An easier level", "slower"],
                           ["Level +", "A harder level", "faster"],
                           ["Level 20", "Right up at the ceiling", "top"],
                           ["Reset", "Back to level 1", "restart"]])
    if demo_kind == "sizes":
        return json.dumps([["New words", "Five more words", "restart"]])
    if demo_kind in ("match", "final"):
        return json.dumps([["Type >", "Type the next letter of the lowest word", "type"],
                           ["Back", "Rub out a letter", "back"],
                           ["Clear", "Give up on this word", "clear"],
                           ["Drop", "One more word", "drop"],
                           ["New", "Start again", "restart"]])
    return json.dumps([["Drop", "One more word out of the sky", "drop"],
                       ["Nudge", "Push them all down a bit", "nudge"],
                       ["New", "An empty sky", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "slower":
        demo["level"] = max(1, demo["level"] - 1)
    elif action == "faster":
        demo["level"] += 1
    elif action == "top":
        demo["level"] = 20
    elif action == "drop":
        rules.spawn_word(demo)
    elif action == "nudge":
        rules.move_words(demo, 1.2)
    elif action == "type":
        type_next_letter()
    elif action == "back":
        rules.backspace(demo)
    elif action == "clear":
        rules.clear_typed(demo)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "new":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action == "back":
        rules.backspace(demo)
    elif action == "clear":
        rules.clear_typed(demo)
    elif action is not None:
        rules.type_letter(demo, action)
        rules.zap_word(demo)
