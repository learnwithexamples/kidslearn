"""frogger_demo.py - the demos beside the editor in the Python workshop."""

import json

import frogger_rules as rules
import frogger_draw as draw

SCALE = 0.72

kind = "lanes"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(rules.FIELD_WIDTH * SCALE), round(rules.FIELD_HEIGHT * SCALE)])


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind == "lanes":
        demo = {"row": 3}
    elif kind == "traffic":
        demo = {"cars": rules.make_traffic(), "level": 1}
    elif kind == "hop":
        demo = rules.create_game()
        demo["cars"] = []
    else:
        demo = rules.create_game()


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def update_demo(elapsed):
    """Let the demo's clock tick."""
    if kind == "traffic":
        rules.move_cars(demo["cars"], elapsed / 1000, demo["level"])
    elif kind in ("game", "final"):
        rules.update_game(demo, elapsed)


def draw_road(ctx):
    """The empty road every demo is drawn on."""
    draw.clear_canvas(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT, "#ffffff")
    for row in range(rules.ROWS):
        if rules.is_lane(row):
            draw.draw_lane(ctx, row)
        else:
            draw.draw_safe_row(ctx, row)


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)

        if kind == "lanes":
            draw_road(ctx)
            row = demo["row"]
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 3
            ctx.setLineDash([6, 4])
            ctx.strokeRect(2, row * rules.CELL + 2, rules.FIELD_WIDTH - 4, rules.CELL - 4)
            ctx.setLineDash([])
            if rules.is_lane(row):
                for car in rules.make_lane(row):
                    draw.draw_car(ctx, car)
                way = "right ->" if rules.lane_direction(row) == 1 else "<- left"
                set_message("row %d  %s  at %d px/s" % (row, way, rules.lane_speed(row, 1)))
            else:
                set_message("row %d is a SAFE row - no traffic here" % row)
            draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)

        elif kind == "traffic":
            draw_road(ctx)
            for car in demo["cars"]:
                draw.draw_car(ctx, car)
            draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)
            set_message("level %d  -  %d vehicles, all still on the road"
                        % (demo["level"], len(demo["cars"])))

        elif kind == "hop":
            draw_road(ctx)
            draw.draw_frog(ctx, demo["frog"])
            draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)
            set_message("frog at column %d row %d   -   score %d"
                        % (demo["frog"]["column"], demo["frog"]["row"], demo["score"]))

        else:
            draw.render_game(ctx, demo)
            set_message("score %d  -  %d lives  -  %d crossings  -  squashed %s"
                        % (demo["score"], demo["lives"], demo["crossings"],
                           rules.is_squashed(demo)))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "lanes":
        return json.dumps([["Row up", "Look at the row above", "up"],
                           ["Row down", "Look at the row below", "down"]])
    if demo_kind == "traffic":
        return json.dumps([["Level -", "Slower traffic", "slower"],
                           ["Level +", "Faster traffic", "faster"],
                           ["Reset", "Line the traffic up again", "restart"]])
    return json.dumps([["^", "Hop forward", "up"], ["v", "Hop back", "down"],
                       ["<", "Hop left", "left"], [">", "Hop right", "right"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind == "lanes":
        if action == "up":
            demo["row"] = max(0, demo["row"] - 1)
        elif action == "down":
            demo["row"] = min(rules.ROWS - 1, demo["row"] + 1)
        return

    if kind == "traffic":
        demo["level"] = max(1, demo["level"] + (1 if action == "faster" else -1))
        return

    hops = {"up": (0, -1), "down": (0, 1), "left": (-1, 0), "right": (1, 0)}
    if action in hops:
        rules.move_frog(demo, hops[action][0], hops[action][1])
        if action == "up":
            rules.reach_home(demo)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
