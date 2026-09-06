"""twenty48_demo.py - the demos beside the editor in the Python workshop."""

import json

import twenty48_rules as rules
import twenty48_draw as draw

SCALE = 0.62

kind = "row"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    size = round(draw.board_pixel_size() * SCALE)
    return json.dumps([size, size])


def practice_board():
    """A board with a few known tiles, good for trying moves on."""
    board = rules.empty_board()
    for index, value in ((0, 2), (1, 2), (2, 4), (5, 8), (7, 8), (9, 4), (12, 2)):
        board[index] = value
    return board


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind == "row":
        demo = {"board": practice_board(), "row": [2, 0, 2, 4],
                "score": 0, "moves": 0, "is_won": False, "is_over": False,
                "is_paused": False}
    elif kind == "board":
        demo = {"board": practice_board(), "score": 0, "moves": 0,
                "is_won": False, "is_over": False, "is_paused": False}
    else:
        demo = rules.create_game()


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def update_demo(elapsed):
    """2048 has no clock, so nothing happens between key presses."""
    return


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)

        if kind == "row":
            # show the one practice row across the top of an empty board
            board = rules.empty_board()
            rules.set_row(board, 0, demo["row"])
            slid = rules.slide_row(demo["row"])
            merged, gained = rules.merge_row(slid)
            rules.set_row(board, 2, slid)
            rules.set_row(board, 3, merged)
            draw.render_game(ctx, {"board": board, "score": 0, "is_won": False,
                                   "is_over": False, "is_paused": False})
            set_message("row %s  ->  slide %s  ->  merge %s  (+%d)"
                        % (demo["row"], slid, merged, gained))
        else:
            draw.render_game(ctx, demo)
            if kind == "board":
                set_message("score %d  -  %d moves  -  %d empty squares"
                            % (demo["score"], demo["moves"],
                               len(rules.empty_cells(demo["board"]))))
            else:
                over = "  NO MOVES LEFT" if demo["is_over"] else ""
                set_message("score %d  -  biggest tile %d  -  %d moves%s"
                            % (demo["score"], rules.biggest_tile(demo["board"]),
                               demo["moves"], over))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "row":
        return json.dumps([["2,0,2,4", "Try this row", "row1"],
                           ["2,2,2,2", "Four the same", "row2"],
                           ["4,4,4,0", "Three the same", "row3"],
                           ["0,0,0,2", "One lonely tile", "row4"]])
    if demo_kind == "board":
        return json.dumps([["<", "Slide left", "left"], [">", "Slide right", "right"],
                           ["^", "Slide up", "up"], ["v", "Slide down", "down"],
                           ["Turn", "Rotate the board", "rotate"],
                           ["Reset", "Start again", "restart"]])
    return json.dumps([["<", "Slide left", "left"], [">", "Slide right", "right"],
                       ["^", "Slide up", "up"], ["v", "Slide down", "down"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind == "row":
        rows = {"row1": [2, 0, 2, 4], "row2": [2, 2, 2, 2],
                "row3": [4, 4, 4, 0], "row4": [0, 0, 0, 2]}
        if action in rows:
            demo["row"] = rows[action]
        return

    if action == "rotate":
        demo["board"] = rules.rotate_board(demo["board"])
        return

    if action in ("left", "right", "up", "down"):
        if kind == "board":
            demo["board"], gained = rules.move_board(demo["board"], action)
            demo["score"] += gained
            demo["moves"] += 1
        else:
            rules.make_move(demo, action)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
