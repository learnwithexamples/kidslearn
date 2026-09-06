"""bubbles_demo.py - the demos beside the editor in the Python workshop."""

import json

import bubbles_rules as rules
import bubbles_draw as draw

SCALE = 0.62

kind = "grid"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(rules.FIELD_WIDTH * SCALE), round(rules.FIELD_HEIGHT * SCALE)])


def practice_state():
    """A hand-made board: a group of three, and a cluster hanging by one bubble."""
    state = rules.create_game()
    state["grid"] = [rules.EMPTY] * (rules.COLUMNS * rules.ROWS)

    for column in (1, 2, 3):
        state["grid"][rules.bubble_index(column, 0)] = 0
    state["grid"][rules.bubble_index(6, 0)] = 1
    state["grid"][rules.bubble_index(6, 1)] = 2
    for column in (5, 6, 7):
        state["grid"][rules.bubble_index(column, 2)] = 2
    state["look"] = {"column": 2, "row": 0}
    return state


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind in ("grid", "group", "drop"):
        demo = practice_state()
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
        draw.render_game(ctx, demo)

        if kind in ("grid", "group"):
            look = demo["look"]
            centre = rules.bubble_centre(look["column"], look["row"])
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 2
            ctx.setLineDash([4, 3])
            ctx.strokeRect(centre["x"] - rules.CELL / 2, centre["y"] - rules.CELL / 2,
                           rules.CELL, rules.CELL)
            ctx.setLineDash([])

            if kind == "grid":
                set_message("bubble_centre(%d, %d) -> x %d, y %d"
                            % (look["column"], look["row"],
                               round(centre["x"]), round(centre["y"])))
            else:
                group = rules.same_group(demo["grid"], look["column"], look["row"])
                for c, r in group:
                    spot = rules.bubble_centre(c, r)
                    ctx.strokeRect(spot["x"] - rules.CELL / 2 + 2,
                                   spot["y"] - rules.CELL / 2 + 2,
                                   rules.CELL - 4, rules.CELL - 4)
                enough = "POP!" if len(group) >= rules.MIN_POP else "not enough"
                set_message("same_group -> %d joined  (%s)" % (len(group), enough))

        elif kind == "drop":
            set_message("%d bubble(s) up there  -  score %d"
                        % (rules.bubbles_left(demo), demo["score"]))
        else:
            set_message("score %d  -  %d popped  -  %d dropped  -  %d shots"
                        % (demo["score"], demo["popped"], demo["dropped"], demo["shots"]))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind in ("grid", "group"):
        return json.dumps([["<", "Look left", "look_left"], [">", "Look right", "look_right"],
                           ["^", "Look up", "look_up"], ["v", "Look down", "look_down"],
                           ["Reset", "Start again", "restart"]])
    if demo_kind == "drop":
        return json.dumps([["Pop the group", "Burst the three at the top left", "pop"],
                           ["Cut the thread", "Remove the bubble holding the cluster", "cut"],
                           ["Let them fall", "Drop anything dangling", "drop"],
                           ["Reset", "Start again", "restart"]])
    return json.dumps([["<", "Aim left", "left"], [">", "Aim right", "right"],
                       ["Stop", "Stop aiming", "stop"],
                       ["SHOOT", "Fire the bubble", "shoot"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    looks = {"look_up": (0, -1), "look_down": (0, 1),
             "look_left": (-1, 0), "look_right": (1, 0)}
    if action in looks and "look" in demo:
        look = demo["look"]
        look["column"] = max(0, min(rules.COLUMNS - 1, look["column"] + looks[action][0]))
        look["row"] = max(0, min(rules.ROWS - 1, look["row"] + looks[action][1]))
        return

    if action == "pop":
        rules.pop_group(demo, rules.same_group(demo["grid"], 2, 0))
    elif action == "cut":
        demo["grid"][rules.bubble_index(6, 1)] = rules.EMPTY
    elif action == "drop":
        rules.drop_floaters(demo)
    elif action == "left":
        demo["turning"] = -1
    elif action == "right":
        demo["turning"] = 1
    elif action == "stop":
        demo["turning"] = 0
    elif action == "shoot":
        rules.shoot_bubble(demo)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
