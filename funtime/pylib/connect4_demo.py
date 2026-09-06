"""connect4_demo.py - the demos beside the editor in the Python workshop."""

import json

import connect4_rules as rules
import connect4_draw as draw

SCALE = 0.6

kind = "grid"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(draw.board_pixel_width() * SCALE),
                       round(draw.board_pixel_height() * SCALE)])


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind == "grid":
        demo = {}
    elif kind == "drop":
        board = [rules.EMPTY] * rules.CELL_COUNT
        for column, count in [(0, 3), (1, 1), (3, 5), (5, 2)]:
            for _ in range(count):
                board = rules.drop_piece(board, column, rules.COMPUTER)
        demo = {"board": board, "column": 3}
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
        board_width = draw.board_pixel_width()
        board_height = draw.board_pixel_height()

        if kind == "grid":
            draw.clear_canvas(ctx, board_width, board_height, "#ffffff")
            ctx.textAlign = "center"
            ctx.fillStyle = "#111111"
            ctx.font = "bold 20px monospace"
            for row in range(rules.ROWS):
                for column in range(rules.COLUMNS):
                    ctx.fillText(str(rules.cell_index(column, row)),
                                 draw.hole_centre_x(column), draw.hole_centre_y(row) + 7)
            draw.draw_board_frame(ctx)
            set_message("cell_index(column, row) numbers all 42 squares")

        elif kind == "drop":
            draw.clear_canvas(ctx, board_width, board_height, "#ffffff")
            for row in range(rules.ROWS):
                for column in range(rules.COLUMNS):
                    draw.draw_counter(ctx, demo["board"][rules.cell_index(column, row)],
                                      draw.hole_centre_x(column), draw.hole_centre_y(row),
                                      draw.CELL_SIZE / 2 - 6)
            draw.draw_board_frame(ctx)
            draw.draw_drop_marker(ctx, demo["column"])
            row = rules.drop_row(demo["board"], demo["column"])
            set_message("drop_row(board, %d) -> %d%s"
                        % (demo["column"], row, "  (full!)" if row == -1 else ""))

        else:
            draw.render_game(ctx, demo)
            if demo["is_over"]:
                set_message("winner: %s" % demo["winner"])
            else:
                set_message("column %d - press Drop" % demo["cursor"])
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "grid":
        return json.dumps([["Redraw", "Draw the grid again", "restart"]])
    if demo_kind == "drop":
        return json.dumps([["<", "Aim left", "left"], [">", "Aim right", "right"],
                           ["Fill it", "Add a counter to this column", "fill"],
                           ["Reset", "Start again", "restart"]])
    return json.dumps([["<", "Aim left", "left"], [">", "Aim right", "right"],
                       ["Drop", "Drop a counter", "drop"],
                       ["New", "Clear the board", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if kind == "drop":
        if action == "left":
            demo["column"] = max(0, demo["column"] - 1)
        elif action == "right":
            demo["column"] = min(rules.COLUMNS - 1, demo["column"] + 1)
        else:
            demo["board"] = rules.drop_piece(demo["board"], demo["column"], rules.COMPUTER)
        return
    if action == "drop":
        rules.play_column(demo, demo["cursor"])
    elif action == "left":
        rules.move_cursor(demo, -1)
    elif action == "right":
        rules.move_cursor(demo, 1)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action is not None and action != "pause":
        demo_button(action)
