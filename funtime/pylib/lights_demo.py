"""lights_demo.py - the demos beside the editor in the Python workshop."""

import json

import lights_rules as rules
import lights_draw as draw

SCALE = 0.62

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
    elif kind == "cross":
        demo = {"lights": [False] * rules.LIGHT_COUNT, "column": 2, "row": 2}
    else:
        demo = rules.create_game()


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def update_demo(elapsed):
    """Nothing in this game moves on its own."""
    return None


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
                    x = draw.cell_left(column)
                    y = draw.cell_top(row)
                    ctx.strokeStyle = "#111111"
                    ctx.lineWidth = 3
                    ctx.strokeRect(x, y, draw.CELL_SIZE, draw.CELL_SIZE)
                    ctx.fillStyle = "#111111"
                    ctx.font = "bold 24px monospace"
                    ctx.fillText(str(rules.light_index(column, row)),
                                 x + draw.CELL_SIZE / 2, y + draw.CELL_SIZE / 2 + 8)
            set_message("light_index(column, row) numbers every square")

        elif kind == "cross":
            lights = rules.press_light([False] * rules.LIGHT_COUNT, demo["column"], demo["row"])
            draw.clear_canvas(ctx, size, size, "#ffffff")
            for row in range(rules.GRID_SIZE):
                for column in range(rules.GRID_SIZE):
                    draw.draw_light(ctx, lights[rules.light_index(column, row)], column, row)
            draw.draw_cursor(ctx, {"column": demo["column"], "row": demo["row"]})
            set_message("pressing (%d, %d) flips %d lights"
                        % (demo["column"], demo["row"], rules.count_lights_on(lights)))

        else:
            draw.render_game(ctx, demo)
            set_message("%d lights on  -  %d presses"
                        % (rules.count_lights_on(demo["lights"]), demo["moves"]))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "grid":
        return json.dumps([["Redraw", "Draw the grid again", "restart"]])
    if demo_kind == "cross":
        return json.dumps([["<", "Move left", "left"], [">", "Move right", "right"],
                           ["^", "Move up", "up"], ["v", "Move down", "down"]])
    return json.dumps([["<", "Cursor left", "left"], [">", "Cursor right", "right"],
                       ["^", "Cursor up", "up"], ["v", "Cursor down", "down"],
                       ["Press", "Press this square", "press"],
                       ["New", "Scramble again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind == "cross":
        moves = {"left": (-1, 0), "right": (1, 0), "up": (0, -1), "down": (0, 1)}
        dx, dy = moves[action]
        if rules.is_on_board(demo["column"] + dx, demo["row"] + dy):
            demo["column"] += dx
            demo["row"] += dy
        return

    if action == "press":
        rules.press_square(demo, demo["cursor"]["column"], demo["cursor"]["row"])
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
