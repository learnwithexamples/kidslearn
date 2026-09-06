"""sokoban_demo.py - the demos beside the editor in the Python workshop."""

import json

import sokoban_rules as rules
import sokoban_draw as draw

SCALE = 0.62

kind = "walls"
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

    demo = rules.create_game()
    if kind in ("walls", "boxes"):
        rules.load_level(demo, 3)          # the level with a wall in the way
        demo["look"] = {"x": 4, "y": 2}
    elif kind == "push":
        rules.load_level(demo, 2)


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def update_demo(elapsed):
    """Sokoban has no clock, so nothing happens between key presses."""
    return


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)
        draw.render_game(ctx, demo)

        if kind in ("walls", "boxes"):
            look = demo["look"]
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 3
            ctx.setLineDash([5, 4])
            ctx.strokeRect(draw.cell_left(look["x"]) + 2, draw.cell_top(look["y"]) + 2,
                           draw.CELL - 4, draw.CELL - 4)
            ctx.setLineDash([])
            if kind == "walls":
                set_message("is_wall(%d, %d) -> %s"
                            % (look["x"], look["y"], rules.is_wall(demo, look["x"], look["y"])))
            else:
                set_message("box_at(%d, %d) -> %d"
                            % (look["x"], look["y"], rules.box_at(demo, look["x"], look["y"])))
        else:
            done = "  SOLVED!" if demo["is_solved"] else ""
            set_message("level %d  -  %d moves  -  %d of %d boxes home%s"
                        % (demo["level"] + 1, demo["moves"], rules.boxes_on_goals(demo),
                           len(demo["boxes"]), done))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind in ("walls", "boxes"):
        return json.dumps([["<", "Look left", "look_left"], [">", "Look right", "look_right"],
                           ["^", "Look up", "look_up"], ["v", "Look down", "look_down"]])
    return json.dumps([["^", "Walk up", "up"], ["v", "Walk down", "down"],
                       ["<", "Walk left", "left"], [">", "Walk right", "right"],
                       ["Undo", "Step back in time", "undo"],
                       ["Reset", "Start the level again", "reset"],
                       ["Next", "The next level", "next"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    looks = {"look_up": (0, -1), "look_down": (0, 1),
             "look_left": (-1, 0), "look_right": (1, 0)}
    if action in looks and "look" in demo:
        look = demo["look"]
        look["x"] = max(0, min(rules.LEVEL_WIDTH - 1, look["x"] + looks[action][0]))
        look["y"] = max(0, min(rules.LEVEL_HEIGHT - 1, look["y"] + looks[action][1]))
        return

    walks = {"up": (0, -1), "down": (0, 1), "left": (-1, 0), "right": (1, 0)}
    if action in walks:
        rules.move_player(demo, walks[action][0], walks[action][1])
    elif action == "undo":
        rules.undo_move(demo)
    elif action == "reset":
        rules.reset_level(demo)
    elif action == "next":
        rules.next_level(demo)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
