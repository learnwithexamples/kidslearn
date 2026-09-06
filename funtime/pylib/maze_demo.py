"""maze_demo.py - the demos beside the editor in the Python workshop."""

import json

import maze_rules as rules
import maze_draw as draw

SCALE = 0.72

kind = "rock"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(draw.board_pixel_width() * SCALE),
                       round(draw.board_pixel_height() * SCALE)])


def blank_state(maze):
    """The extra fields render_game expects, around a bare maze."""
    return {"maze": maze, "player": {"x": 1, "y": 1}, "hint": [],
            "steps": 0, "shortest": 0, "seconds": 0, "solved": 0, "hints_used": 0,
            "is_solved": False, "is_paused": False}


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind == "rock":
        demo = blank_state(rules.solid_maze())
        demo["look"] = {"x": 3, "y": 3}
        # dig one small room so there is something to look at
        for x, y in ((1, 1), (2, 1), (3, 1), (3, 2), (3, 3)):
            demo["maze"][rules.maze_index(x, y)] = False
    elif kind == "carve":
        demo = blank_state(rules.carve_maze())
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

        if kind == "rock":
            look = demo["look"]
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 2
            ctx.setLineDash([4, 3])
            ctx.strokeRect(draw.cell_left(look["x"]) - 1, draw.cell_top(look["y"]) - 1,
                           draw.CELL + 2, draw.CELL + 2)
            ctx.setLineDash([])
            set_message("is_wall(%d, %d) -> %s"
                        % (look["x"], look["y"], rules.is_wall(demo["maze"], look["x"], look["y"])))

        elif kind == "carve":
            open_squares = sum(1 for solid in demo["maze"] if not solid)
            set_message("a fresh maze: %d open squares, shortest way out %d steps"
                        % (open_squares, rules.shortest_from_start(demo["maze"])))

        else:
            done = "  OUT!" if demo["is_solved"] else ""
            set_message("%d steps  -  best possible %d  -  %d hint(s)%s"
                        % (demo["steps"], demo["shortest"], demo["hints_used"], done))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "rock":
        return json.dumps([["<", "Look left", "look_left"], [">", "Look right", "look_right"],
                           ["^", "Look up", "look_up"], ["v", "Look down", "look_down"]])
    if demo_kind == "carve":
        return json.dumps([["Dig a new one", "Carve a fresh maze", "restart"]])
    return json.dumps([["^", "Walk up", "up"], ["v", "Walk down", "down"],
                       ["<", "Walk left", "left"], [">", "Walk right", "right"],
                       ["Hint", "Show the shortest way", "hint"],
                       ["New", "Dig a new maze", "new"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    looks = {"look_up": (0, -1), "look_down": (0, 1),
             "look_left": (-1, 0), "look_right": (1, 0)}
    if action in looks and "look" in demo:
        look = demo["look"]
        look["x"] = max(0, min(rules.MAZE_WIDTH - 1, look["x"] + looks[action][0]))
        look["y"] = max(0, min(rules.MAZE_HEIGHT - 1, look["y"] + looks[action][1]))
        return

    walks = {"up": (0, -1), "down": (0, 1), "left": (-1, 0), "right": (1, 0)}
    if action in walks:
        rules.move_player(demo, walks[action][0], walks[action][1])
    elif action == "hint":
        rules.show_hint(demo)
    elif action == "new":
        rules.new_maze(demo)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
