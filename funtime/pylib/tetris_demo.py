"""tetris_demo.py - the little demos beside the editor in the Python workshop.

The workshop page hands this module the canvas and asks it to draw. It calls
the game's functions through the module (`rules.find_full_rows(...)`), so the
moment you replace one with your own, the demo starts using yours.
"""

import json
import random

import tetris_rules as rules
import tetris_draw as draw

CELL = 20

kind = "board"
flags = {}
demo = {}
message = ""
timer = 0.0
spin_piece = None


def canvas_size(demo_kind):
    """How big the demo canvas should be.

    INPUT:  demo_kind. OUTPUT: a JSON list [width, height].
    """
    if demo_kind == "spin":
        return json.dumps([200, 200])
    return json.dumps([rules.BOARD_WIDTH * CELL, rules.BOARD_HEIGHT * CELL])


def make_sample_board():
    """A field with a realistic pile at the bottom and two complete rows."""
    board = rules.create_empty_board(rules.BOARD_WIDTH, rules.BOARD_HEIGHT)
    pile = 6
    full_a = 1 + random.randrange(2)
    for i in range(pile):
        y = rules.BOARD_HEIGHT - pile + i
        is_full = i in (full_a, 4)
        for x in range(rules.BOARD_WIDTH):
            board[y][x] = 1 if (is_full or random.random() < 0.8) else 0
        if not is_full:
            board[y][random.randrange(rules.BOARD_WIDTH)] = 0
    return board


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message, timer, spin_piece
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""
    timer = 0

    if kind == "rows":
        demo = {"board": make_sample_board()}
    elif kind == "spin":
        spin_piece = rules.create_piece("T")
        demo = {}
    elif kind == "game":
        demo = {"board": rules.create_empty_board(rules.BOARD_WIDTH, rules.BOARD_HEIGHT),
                "piece": None, "next_type": None, "score": 0, "lines": 0, "level": 1,
                "is_over": False, "is_paused": False, "bag": rules.create_shuffled_bag(),
                "drop_timer": 0}
        demo["next_type"] = rules.take_from_bag(demo)
        rules.spawn_piece(demo)
    elif kind == "final":
        demo = rules.create_game()
        demo["is_paused"] = False
    else:
        demo = {}


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def update_demo(elapsed):
    """Let the demo's clock tick."""
    global timer
    if kind in ("game", "final"):
        if not flags.get("manual"):
            rules.update_game(demo, elapsed)


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas."""
    if kind == "board":
        board = rules.create_empty_board(rules.BOARD_WIDTH, rules.BOARD_HEIGHT)
        draw.clear_canvas(ctx, width, height, "#ffffff")
        draw.draw_grid(ctx, len(board[0]), len(board), CELL)
        draw.draw_frame(ctx, len(board[0]) * CELL, len(board) * CELL)
        set_message("%d rows x %d columns, all empty." % (len(board), len(board[0])))

    elif kind == "rows":
        board = demo["board"]
        full = rules.find_full_rows(board)
        draw.clear_canvas(ctx, width, height, "#ffffff")
        draw.draw_grid(ctx, rules.BOARD_WIDTH, rules.BOARD_HEIGHT, CELL)
        for y, row in enumerate(board):
            for x, value in enumerate(row):
                if value == 1:
                    draw.draw_block(ctx, x, y, CELL)
        for y in full:
            ctx.fillStyle = "#111111"
            ctx.fillRect(0, y * CELL, rules.BOARD_WIDTH * CELL, CELL)
            ctx.fillStyle = "#ffffff"
            for x in range(rules.BOARD_WIDTH):
                ctx.fillRect(x * CELL + 4, y * CELL + 4, CELL - 8, CELL - 8)
        draw.draw_frame(ctx, rules.BOARD_WIDTH * CELL, rules.BOARD_HEIGHT * CELL)
        set_message("Complete rows: %s" % (full if full else "none yet"))

    elif kind == "spin":
        draw.clear_canvas(ctx, width, height, "#ffffff")
        cells = spin_piece["cells"]
        size = len(cells)
        cell_size = 34
        ctx.save()
        ctx.translate((width - size * cell_size) / 2, (height - size * cell_size) / 2)
        for r in range(size):
            for c in range(size):
                if cells[r][c] == 1:
                    draw.draw_block(ctx, c, r, cell_size)
        ctx.restore()
        draw.draw_frame(ctx, width, height)
        set_message("Piece %s - press Turn to rotate it" % spin_piece["type"])

    else:
        draw.render_game(ctx, demo, CELL)
        set_message("Score %d  -  Lines %d  -  Level %d" % (demo["score"], demo["lines"], demo["level"]))


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs, as JSON [label, tooltip, action] triples."""
    if demo_kind == "board":
        return json.dumps([["Redraw", "Build the board again", "restart"]])
    if demo_kind == "rows":
        return json.dumps([["New pile", "Build a different pile of blocks", "restart"]])
    if demo_kind == "spin":
        return json.dumps([["Turn", "Rotate clockwise", "rotate"],
                           ["Next piece", "Try another shape", "next_piece"]])
    buttons = [["<", "Move left", "left"], ["Turn", "Rotate", "rotate"],
               [">", "Move right", "right"], ["v", "Down one row", "soft_drop"],
               ["Drop", "Slam it down", "hard_drop"]]
    if json.loads(flags_json or "{}").get("levelPicker"):
        buttons.append(["Level -", "Slower", "level_down"])
        buttons.append(["Level +", "Faster", "level_up"])
    buttons.append(["Restart", "Start the demo again", "restart"])
    return json.dumps(buttons)


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    global spin_piece
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if kind == "spin":
        if action == "rotate":
            spin_piece = rules.rotate_piece(spin_piece, True)
        else:
            spin_piece = rules.create_piece(random.choice(rules.SHAPE_TYPES))
        return
    if kind in ("game", "final"):
        if action == "left":
            rules.try_move(demo, -1, 0)
        elif action == "right":
            rules.try_move(demo, 1, 0)
        elif action == "rotate":
            rules.try_rotate(demo, True)
        elif action == "soft_drop":
            rules.soft_drop(demo)
        elif action == "hard_drop":
            rules.hard_drop(demo)
        elif action == "level_down":
            demo["level"] = max(1, demo["level"] - 1)
        elif action == "level_up":
            demo["level"] = min(20, demo["level"] + 1)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action is None:
        return
    if action == "pause":
        rules.toggle_pause(demo)
    elif action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "rotate_left":
        rules.try_rotate(demo, False)
    elif action == "rotate_right":
        rules.try_rotate(demo, True)
    elif action == "left":
        rules.try_move(demo, -1, 0)
    elif action == "right":
        rules.try_move(demo, 1, 0)
    elif action == "soft_drop":
        rules.soft_drop(demo)
    elif action == "hard_drop":
        rules.hard_drop(demo)
