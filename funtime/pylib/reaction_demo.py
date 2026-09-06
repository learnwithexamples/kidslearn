"""reaction_demo.py - the demos beside the editor in the Python workshop."""

import json

import reaction_rules as rules
import reaction_draw as draw

SCALE = 0.7

kind = "phases"
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
    if kind == "stats":
        demo["times"] = [240, 310, 195, 420]
        demo["attempts"] = 4


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

        if kind == "phases":
            set_message("phase '%s'  -  %d ms of the wait gone by"
                        % (demo["phase"], round(demo["elapsed"])))
        elif kind == "stats":
            set_message("times %s  ->  best %d, average %d"
                        % (demo["times"], rules.best_time(demo), rules.average_time(demo)))
        else:
            set_message("phase '%s'  -  last %d ms  -  %d goes  -  %d false start(s)"
                        % (demo["phase"], demo["last_time"], demo["attempts"],
                           demo["false_starts"]))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "phases":
        return json.dumps([["Press", "Press the button", "press"],
                           ["Skip the wait", "Jump straight to the signal", "skip"],
                           ["Reset", "Start again", "restart"]])
    if demo_kind == "stats":
        return json.dumps([["A fast go", "Add a 190 ms go", "fast"],
                           ["A slow go", "Add a 520 ms go", "slow"],
                           ["Clear", "Forget them all", "restart"]])
    return json.dumps([["PRESS", "Press the button", "press"],
                       ["New", "Clear the scores", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if action == "press":
        rules.press(demo)
    elif action == "skip":
        demo["elapsed"] = demo["wait_for"]
        rules.update_game(demo, 1)
    elif action == "fast":
        demo["times"].append(190)
        demo["attempts"] += 1
    elif action == "slow":
        demo["times"].append(520)
        demo["attempts"] += 1


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "new":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
