"""tictactoe_demo.py - the demos beside the editor in the Python workshop."""

import json

import tictactoe_rules as rules
import tictactoe_draw as draw

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
    elif kind == "lines":
        demo = {"line": 0}
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
            draw.draw_grid_lines(ctx)
            ctx.textAlign = "center"
            ctx.fillStyle = "#111111"
            ctx.font = "bold 40px monospace"
            for row in range(rules.GRID_SIZE):
                for column in range(rules.GRID_SIZE):
                    ctx.fillText(str(rules.square_index(column, row)),
                                 draw.cell_left(column) + draw.CELL_SIZE / 2,
                                 draw.cell_top(row) + draw.CELL_SIZE / 2 + 14)
            set_message("square_index(column, row) numbers every square")

        elif kind == "lines":
            line = rules.WINNING_LINES[demo["line"] % len(rules.WINNING_LINES)]
            board = [rules.EMPTY] * rules.SQUARE_COUNT
            for index in line:
                board[index] = rules.PLAYER
            draw.clear_canvas(ctx, size, size, "#ffffff")
            draw.draw_grid_lines(ctx)
            for row in range(rules.GRID_SIZE):
                for column in range(rules.GRID_SIZE):
                    draw.draw_mark(ctx, board[rules.square_index(column, row)], column, row)
            draw.draw_winning_line(ctx, line)
            set_message("winning_line(board) -> %s" % (rules.winning_line(board),))

        else:
            draw.render_game(ctx, demo)
            if demo["is_over"]:
                set_message("winner: %s" % demo["winner"])
            else:
                set_message("your turn - %d squares free" % len(rules.empty_squares(demo["board"])))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "grid":
        return json.dumps([["Redraw", "Draw the grid again", "restart"]])
    if demo_kind == "lines":
        return json.dumps([["Next line", "Show the next winning line", "next_line"]])
    return json.dumps([["<", "Cursor left", "left"], [">", "Cursor right", "right"],
                       ["^", "Cursor up", "up"], ["v", "Cursor down", "down"],
                       ["Play", "Play here", "play"],
                       ["New", "Clear the board", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if kind == "lines":
        demo["line"] += 1
        return
    if action == "play":
        rules.play_square(demo, rules.square_index(demo["cursor"]["column"], demo["cursor"]["row"]))
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
