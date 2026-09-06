"""simon_demo.py - the demos beside the editor in the Python workshop."""

import json

import simon_rules as rules
import simon_draw as draw

SCALE = 0.72

kind = "pads"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    size = round(draw.board_pixel_size() * SCALE)
    return json.dumps([size, size])


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind == "pads":
        demo = {"lit": -1}
    elif kind == "sequence":
        demo = {"sequence": [], "input": []}
    else:
        demo = rules.create_game()


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
        size = draw.board_pixel_size()

        if kind == "pads":
            draw.clear_canvas(ctx, size, size, "#ffffff")
            for pad in range(rules.PAD_COUNT):
                draw.draw_pad(ctx, pad, demo["lit"] == pad)
            set_message("pad %s is lit" % (demo["lit"] if demo["lit"] >= 0 else "none"))

        elif kind == "sequence":
            draw.clear_canvas(ctx, size, size, "#ffffff")
            for pad in range(rules.PAD_COUNT):
                lit = bool(demo["input"]) and demo["input"][-1] == pad
                draw.draw_pad(ctx, pad, lit)
            correct = rules.is_correct_so_far(demo["sequence"], demo["input"])
            complete = rules.is_round_complete(demo["sequence"], demo["input"])
            set_message("sequence %s  input %s  ->  correct %s%s"
                        % (demo["sequence"], demo["input"], correct,
                           "  COMPLETE!" if complete else ""))

        else:
            draw.render_game(ctx, demo)
            set_message("round %d  -  score %d  -  %s"
                        % (demo["round"], demo["score"], demo["phase"]))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "pads":
        return json.dumps([["Light 1", "Light the first pad", "light0"],
                           ["Light 2", "Light the second pad", "light1"],
                           ["Light 3", "Light the third pad", "light2"],
                           ["Light 4", "Light the fourth pad", "light3"],
                           ["Off", "Turn them all off", "off"]])
    if demo_kind == "sequence":
        return json.dumps([["Add a step", "Grow the sequence", "add"],
                           ["Press 1", "Press pad 1", "in0"], ["Press 2", "Press pad 2", "in1"],
                           ["Press 3", "Press pad 3", "in2"], ["Press 4", "Press pad 4", "in3"],
                           ["Clear", "Start again", "restart"]])
    return json.dumps([["Pad 1", "Press pad 1", "pad0"], ["Pad 2", "Press pad 2", "pad1"],
                       ["Pad 3", "Press pad 3", "pad2"], ["Pad 4", "Press pad 4", "pad3"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if kind == "pads":
        demo["lit"] = -1 if action == "off" else int(action[-1])
        return
    if kind == "sequence":
        if action == "add":
            demo["sequence"] = rules.add_step(demo["sequence"])
        else:
            demo["input"] = demo["input"] + [int(action[-1])]
        return
    if action.startswith("pad"):
        rules.press_pad(demo, int(action[3:]))


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action is not None and action != "pause":
        demo_button(action)
