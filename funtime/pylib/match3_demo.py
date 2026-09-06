"""match3_demo.py - the demos beside the editor in the Python workshop."""

import json

import match3_rules as rules
import match3_draw as draw

SCALE = 0.72

kind = "shapes"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    size = round(draw.board_pixel_size() * SCALE)
    return json.dumps([size, size])


def practice_board():
    """A hand-made board with one obvious swap waiting in it."""
    board = [(column * 2 + row * 3) % rules.SHAPE_COUNT
             for row in range(rules.GRID_SIZE) for column in range(rules.GRID_SIZE)]
    # plant a nearly-finished row: two 0s with a 0 just below the gap
    board[rules.gem_index(1, 4)] = 0
    board[rules.gem_index(2, 4)] = 0
    board[rules.gem_index(4, 4)] = 1
    board[rules.gem_index(3, 5)] = 0
    return board


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    demo = rules.create_game()
    if kind in ("shapes", "matches"):
        demo["board"] = practice_board()
        demo["cursor"] = {"column": 3, "row": 4}


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def update_demo(elapsed):
    """Match Three has no clock, so nothing happens between clicks."""
    return


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)
        draw.render_game(ctx, demo)

        if kind == "matches":
            found = rules.find_matches(demo["board"])
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 3
            for index in found:
                column = index % rules.GRID_SIZE
                row = index // rules.GRID_SIZE
                ctx.strokeRect(draw.cell_left(column) + 2, draw.cell_top(row) + 2,
                               draw.CELL - 4, draw.CELL - 4)
            set_message("find_matches -> %d shape(s) in a line" % len(found))
        elif kind == "shapes":
            cursor = demo["cursor"]
            right = {"column": cursor["column"] + 1, "row": cursor["row"]}
            set_message("cursor (%d, %d) and the square to its right are neighbours: %s"
                        % (cursor["column"], cursor["row"],
                           rules.are_neighbours(cursor, right)))
        else:
            set_message("score %d  -  %d moves  -  best chain %d  -  %d shapes cleared"
                        % (demo["score"], demo["moves"], demo["best_chain"],
                           demo["cleared"]))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "shapes":
        return json.dumps([["<", "Move left", "left"], [">", "Move right", "right"],
                           ["^", "Move up", "up"], ["v", "Move down", "down"],
                           ["Swap right", "Swap with the square to the right", "swap_right"],
                           ["Reset", "Start again", "restart"]])
    if demo_kind == "matches":
        return json.dumps([["Make a row", "Line three up in a row", "make_row"],
                           ["Make a column", "Line three up in a column", "make_column"],
                           ["Let them fall", "Clear and drop", "settle"],
                           ["Reset", "Start again", "restart"]])
    return json.dumps([["<", "Move left", "left"], [">", "Move right", "right"],
                       ["^", "Move up", "up"], ["v", "Move down", "down"],
                       ["Pick", "Pick or swap", "pick"],
                       ["Shuffle", "Deal a new board", "shuffle"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    moves = {"up": (0, -1), "down": (0, 1), "left": (-1, 0), "right": (1, 0)}
    if action in moves:
        rules.move_cursor(demo, moves[action][0], moves[action][1])
        return

    if action == "swap_right":
        here = dict(demo["cursor"])
        right = {"column": here["column"] + 1, "row": here["row"]}
        if rules.is_inside_board(right["column"], right["row"]):
            demo["board"] = rules.swap_gems(demo["board"], here, right)
        return

    if action == "make_row":
        row = demo["cursor"]["row"]
        for column in range(3):
            demo["board"][rules.gem_index(column, row)] = 4
        return

    if action == "make_column":
        column = demo["cursor"]["column"]
        for row in range(3):
            demo["board"][rules.gem_index(column, row)] = 2
        return

    if action == "settle":
        demo["board"] = rules.settle_board(demo, demo["board"])[0]
        return

    if action == "pick":
        rules.pick_square(demo, dict(demo["cursor"]))
    elif action == "shuffle":
        rules.shuffle_board(demo)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
