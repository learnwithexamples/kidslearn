"""whack_demo.py - the demos beside the editor in the Python workshop."""

import json

import whack_rules as rules
import whack_draw as draw

SCALE = 0.66

kind = "grid"
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

    if kind == "grid":
        demo = {}
    elif kind == "speed":
        demo = {"level": 1}
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

        if kind == "grid":
            draw.clear_canvas(ctx, size, size, "#ffffff")
            ctx.textAlign = "center"
            for row in range(rules.GRID_SIZE):
                for column in range(rules.GRID_SIZE):
                    draw.draw_hole(ctx, column, row)
                    ctx.fillStyle = "#111111"
                    ctx.font = "bold 34px monospace"
                    ctx.fillText(str(rules.hole_index(column, row)),
                                 draw.hole_centre_x(column), draw.hole_centre_y(row) - 12)
            set_message("hole_index(column, row) numbers every hole")

        elif kind == "speed":
            draw.clear_canvas(ctx, size, size, "#ffffff")
            level = demo["level"]
            for row in range(rules.GRID_SIZE):
                for column in range(rules.GRID_SIZE):
                    draw.draw_hole(ctx, column, row)
            draw.draw_mole(ctx, 1, 1)
            ctx.textAlign = "center"
            ctx.fillStyle = "#111111"
            ctx.font = "bold 26px monospace"
            ctx.fillText("level %d" % level, size / 2, 40)
            set_message("mole_interval(%d) -> %d ms" % (level, rules.mole_interval(level)))

        else:
            draw.render_game(ctx, demo)
            set_message("Score %d  -  %d hits  -  %d s left"
                        % (demo["score"], demo["hits"], int(demo["seconds_left"])))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "grid":
        return json.dumps([["Redraw", "Draw the holes again", "restart"]])
    if demo_kind == "speed":
        return json.dumps([["Level -", "An easier level", "slower"],
                           ["Level +", "A harder level", "faster"]])
    return json.dumps([["<", "Aim left", "left"], [">", "Aim right", "right"],
                       ["^", "Aim up", "up"], ["v", "Aim down", "down"],
                       ["Whack!", "Swing the hammer", "whack"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if kind == "speed":
        demo["level"] = max(1, demo["level"] + (1 if action == "faster" else -1))
        return
    if action == "whack":
        rules.whack(demo, rules.hole_index(demo["cursor"]["column"], demo["cursor"]["row"]))
    elif action == "left":
        rules.move_cursor(demo, -1, 0)
    elif action == "right":
        rules.move_cursor(demo, 1, 0)
    elif action == "up":
        rules.move_cursor(demo, 0, -1)
    elif action == "down":
        rules.move_cursor(demo, 0, 1)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action is not None and action != "pause":
        demo_button(action)
