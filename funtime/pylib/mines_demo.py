"""mines_demo.py - the demos beside the editor in the Python workshop."""

import json

import mines_rules as rules
import mines_draw as draw

SCALE = 0.74

kind = "grid"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    size = round(draw.board_pixel_size() * SCALE)
    return json.dumps([size, size])


def open_board():
    """A board with the mines laid and every square uncovered."""
    state = rules.create_game()
    rules.place_mines(state, 4, 4)
    state["revealed"] = [True] * rules.CELL_COUNT
    return state


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind in ("grid", "count"):
        demo = open_board()
        demo["cursor"] = {"column": 4, "row": 4}
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

        cursor = demo["cursor"]
        column, row = cursor["column"], cursor["row"]

        if kind == "grid":
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 3
            for c, r in rules.neighbours(column, row):
                ctx.strokeRect(draw.cell_left(c) + 3, draw.cell_top(r) + 3,
                               draw.CELL - 6, draw.CELL - 6)
            draw.draw_cursor(ctx, cursor)
            set_message("(%d, %d) has %d neighbours"
                        % (column, row, len(rules.neighbours(column, row))))

        elif kind == "count":
            draw.draw_cursor(ctx, cursor)
            if demo["mines"][rules.cell_index(column, row)]:
                set_message("(%d, %d) IS a mine" % (column, row))
            else:
                set_message("count_mines(%d, %d) -> %d"
                            % (column, row, rules.count_mines(demo, column, row)))

        else:
            state = "won" if demo["is_won"] else ("lost" if demo["is_over"] else "playing")
            set_message("%d opened  -  %d mines left  -  %s"
                        % (rules.revealed_count(demo), rules.mines_left(demo), state))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind in ("grid", "count"):
        return json.dumps([["<", "Look left", "left"], [">", "Look right", "right"],
                           ["^", "Look up", "up"], ["v", "Look down", "down"],
                           ["New board", "Lay the mines again", "restart"]])
    return json.dumps([["<", "Move left", "left"], [">", "Move right", "right"],
                       ["^", "Move up", "up"], ["v", "Move down", "down"],
                       ["Dig!", "Uncover this square", "dig"],
                       ["Flag", "Plant or lift a flag", "flag"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    moves = {"up": (0, -1), "down": (0, 1), "left": (-1, 0), "right": (1, 0)}
    if action in moves:
        rules.move_cursor(demo, moves[action][0], moves[action][1])
    elif action == "dig":
        rules.reveal_cell(demo, demo["cursor"]["column"], demo["cursor"]["row"])
    elif action == "flag":
        rules.toggle_flag(demo, demo["cursor"]["column"], demo["cursor"]["row"])


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
