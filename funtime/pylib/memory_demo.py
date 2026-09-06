"""memory_demo.py - the demos beside the editor in the Python workshop."""

import json

import memory_rules as rules
import memory_draw as draw

kind = "grid"
flags = {}
demo = {}
message = ""

SCALE = 0.62


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
    elif kind == "deck":
        demo = {"cards": rules.create_deck()}
    elif kind == "pair":
        demo = {"left": 2, "right": 5}
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
        board_width = draw.board_pixel_width()
        board_height = draw.board_pixel_height()

        if kind == "grid":
            draw.clear_canvas(ctx, board_width, board_height, "#ffffff")
            ctx.textAlign = "center"
            for row in range(rules.GRID_ROWS):
                for column in range(rules.GRID_COLUMNS):
                    x = draw.card_left(column)
                    y = draw.card_top(row)
                    ctx.strokeStyle = "#111111"
                    ctx.lineWidth = 3
                    ctx.strokeRect(x, y, draw.CARD_WIDTH, draw.CARD_HEIGHT)
                    ctx.fillStyle = "#111111"
                    ctx.font = "bold 30px monospace"
                    ctx.fillText(str(rules.card_index(column, row)),
                                 x + draw.CARD_WIDTH / 2, y + draw.CARD_HEIGHT / 2 + 10)
            set_message("card_index(column, row) numbers every square")

        elif kind == "deck":
            draw.clear_canvas(ctx, board_width, board_height, "#ffffff")
            for row in range(rules.GRID_ROWS):
                for column in range(rules.GRID_COLUMNS):
                    card = dict(demo["cards"][rules.card_index(column, row)])
                    card["face_up"] = True
                    draw.draw_card(ctx, card, column, row)
            symbols = sorted(card["symbol"] for card in demo["cards"])
            each_twice = all(symbols.count(s) == 2 for s in set(symbols))
            set_message("%d cards, every symbol twice: %s" % (len(demo["cards"]), each_twice))

        elif kind == "pair":
            draw.clear_canvas(ctx, board_width, board_height, "#ffffff")
            for slot, symbol in enumerate([demo["left"], demo["right"]]):
                draw.draw_card(ctx, {"symbol": symbol, "face_up": True, "matched": False},
                               1 + slot, 1)
            state = {"cards": [{"symbol": demo["left"], "face_up": True, "matched": False},
                               {"symbol": demo["right"], "face_up": True, "matched": False}],
                     "picked": [0, 1]}
            set_message("is_match(state) -> %s" % rules.is_match(state))

        else:
            draw.render_game(ctx, demo)
            set_message("Moves %d  -  Pairs %d/%d" % (demo["moves"], demo["pairs"], rules.PAIR_COUNT))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "grid":
        return json.dumps([["Redraw", "Draw the grid again", "restart"]])
    if demo_kind == "deck":
        return json.dumps([["Shuffle", "Deal a new deck", "restart"]])
    if demo_kind == "pair":
        return json.dumps([["Left card", "Change the left symbol", "left_symbol"],
                           ["Right card", "Change the right symbol", "right_symbol"],
                           ["Make them match", "Set both the same", "match"]])
    return json.dumps([["<", "Cursor left", "left"], [">", "Cursor right", "right"],
                       ["^", "Cursor up", "up"], ["v", "Cursor down", "down"],
                       ["Flip", "Turn the card over", "flip"],
                       ["New", "Deal again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if kind == "pair":
        if action == "left_symbol":
            demo["left"] = (demo["left"] + 1) % rules.PAIR_COUNT
        elif action == "right_symbol":
            demo["right"] = (demo["right"] + 1) % rules.PAIR_COUNT
        else:
            demo["right"] = demo["left"]
        return
    if action == "flip":
        rules.flip_card(demo, rules.card_index(demo["cursor"]["column"], demo["cursor"]["row"]))
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
    elif action is not None:
        demo_button(action if action != "pause" else "restart")
