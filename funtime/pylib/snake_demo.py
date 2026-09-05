"""snake_demo.py - the little demos beside the editor in the Python workshop.

The workshop page hands this module the canvas and asks it to draw. Everything
here is Python, and it deliberately calls the game's functions through the
module (`rules.move_snake(...)`) rather than importing them by name - that way
the moment you replace one of those functions with your own, the demo starts
using yours.
"""

import json

import snake_rules as rules
import snake_draw as draw

CELL = 12
DEMO_STEP_MS = 220

kind = "still"
flags = {}
demo = {}
message = ""
timer = 0.0


def canvas_size(demo_kind):
    """How big the demo canvas should be.

    INPUT:  demo_kind. OUTPUT: a JSON list [width, height].
    """
    return json.dumps([rules.GRID_WIDTH * CELL, rules.GRID_HEIGHT * CELL])


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show.

    INPUT:  demo_kind, flags_json - the step's demo settings as JSON
    OUTPUT: nothing
    """
    global kind, flags, demo, message, timer
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""
    timer = 0

    if kind == "still":
        demo = {"snake": rules.create_starting_snake()}
    elif kind == "compare":
        demo = {"head": (6, 10), "apple": (13, 10)}
    elif kind == "head":
        demo = {"head": (10, 10), "direction": rules.DIRECTIONS["right"]}
    elif kind == "mini":
        demo = {
            "snake": rules.create_starting_snake(),
            "direction": rules.DIRECTIONS["right"],
            "turns": [],
            "food": rules.random_empty_cell(rules.create_starting_snake()) if flags.get("eat") else None,
            "eaten": 0,
            "is_over": False,
        }
    else:
        demo = rules.create_game()
        demo["is_paused"] = False


def wrap_position(position):
    """Bring a square back onto the field from the other side.

    INPUT:  position. OUTPUT: a position inside the grid.
    ALGORITHM: Python's % always gives a positive answer for a positive
    divisor, so (-1) % 20 is 19 - exactly the wrap we want.

    NOTE: this belongs to the WORKSHOP, not the game. Before you write
    is_inside_grid there are no walls, so the demo wraps instead of letting the
    snake crawl away for ever.
    """
    return (position[0] % rules.GRID_WIDTH, position[1] % rules.GRID_HEIGHT)


def mini_turn(direction):
    """Steer the little demo snake."""
    if not demo or demo.get("is_over"):
        return
    facing = demo["turns"][-1] if demo["turns"] else demo["direction"]
    if flags.get("noReverse") and rules.is_opposite_direction(direction, facing):
        set_message("No U-turns!")
        return
    if len(demo["turns"]) < 2:
        demo["turns"].append(direction)


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def mini_step():
    """One turn of the little demo snake.

    ALGORITHM: the same shape as the real step_game, but each rule only
    switches on once the step that teaches it has been written.
    """
    if demo.get("is_over"):
        return

    if demo["turns"]:
        demo["direction"] = demo["turns"].pop(0)

    head = rules.add_direction(demo["snake"][0], demo["direction"])

    if flags.get("walls"):
        if not rules.is_inside_grid(head):
            demo["is_over"] = True
            set_message("Crashed into the wall!")
            return
    else:
        head = wrap_position(head)

    if flags.get("self"):
        if rules.contains_position(demo["snake"][:-1], head):
            demo["is_over"] = True
            set_message("It bit itself!")
            return

    eating = bool(flags.get("eat")) and demo["food"] is not None and rules.same_position(head, demo["food"])
    demo["snake"] = rules.move_snake(demo["snake"], head, eating)

    if eating:
        demo["eaten"] += 1
        demo["food"] = rules.random_empty_cell(demo["snake"])
        set_message("Yum! %d apple%s" % (demo["eaten"], "" if demo["eaten"] == 1 else "s"))


def update_demo(elapsed):
    """Let the demo's clock tick.

    INPUT:  elapsed - milliseconds since the last frame. OUTPUT: nothing.
    """
    global timer
    if kind in ("game", "final"):
        rules.update_game(demo, elapsed)
        return
    if kind != "mini":
        return

    timer += elapsed
    while timer >= DEMO_STEP_MS:
        timer -= DEMO_STEP_MS
        mini_step()


def draw_field(ctx, width, height):
    """The white field, the faint grid and nothing else yet."""
    draw.clear_canvas(ctx, width, height, "#ffffff")
    draw.draw_grid(ctx, rules.GRID_WIDTH, rules.GRID_HEIGHT, CELL)


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas.

    INPUT:  ctx - the canvas drawing tool, width, height. OUTPUT: nothing.
    """
    if kind == "still":
        snake = rules.create_starting_snake()
        draw_field(ctx, width, height)
        draw.draw_head(ctx, snake[0], rules.DIRECTIONS["right"], CELL)
        for segment in snake[1:]:
            draw.draw_segment(ctx, segment, CELL)
        draw.draw_frame(ctx, width, height)
        set_message("%d squares, head at (%d, %d)" % (len(snake), snake[0][0], snake[0][1]))

    elif kind == "compare":
        draw_field(ctx, width, height)
        draw.draw_food(ctx, demo["apple"], CELL)
        draw.draw_head(ctx, demo["head"], rules.DIRECTIONS["right"], CELL)
        draw.draw_frame(ctx, width, height)
        answer = rules.same_position(demo["head"], demo["apple"])
        set_message("same_position(head, apple) -> %s%s"
                    % (answer, "   the snake would eat!" if answer else ""))

    elif kind == "head":
        draw_field(ctx, width, height)
        if rules.is_inside_grid(demo["head"]):
            draw.draw_head(ctx, demo["head"], demo["direction"], CELL)
        draw.draw_frame(ctx, width, height)
        set_message("head is at (%d, %d)%s" % (
            demo["head"][0], demo["head"][1],
            "" if rules.is_inside_grid(demo["head"]) else "   <- off the field!"))

    elif kind == "mini":
        draw_field(ctx, width, height)
        if demo["food"] is not None:
            draw.draw_food(ctx, demo["food"], CELL)
        for segment in demo["snake"][1:]:
            draw.draw_segment(ctx, segment, CELL)
        draw.draw_head(ctx, demo["snake"][0], demo["direction"], CELL)
        draw.draw_frame(ctx, width, height)
        if demo["is_over"]:
            draw.draw_message(ctx, width, height, "CRASH", "Press the arrows to try again")
        if not message:
            set_message("Length %d - steer with the buttons" % len(demo["snake"]))

    else:
        draw.render_game(ctx, demo, CELL)
        set_message("Score %d  -  Length %d  -  Level %d"
                    % (demo["score"], rules.snake_length(demo), demo["level"]))


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs.

    INPUT:  demo_kind, flags_json
    OUTPUT: a JSON list of [label, tooltip, action] triples
    """
    if demo_kind == "still":
        return json.dumps([["Redraw", "Build the snake again", "restart"]])
    if demo_kind == "compare":
        return json.dumps([
            ["<", "Move the head left", "left"],
            [">", "Move the head right", "right"],
            ["^", "Move the head up", "up"],
            ["v", "Move the head down", "down"],
            ["Move apple", "Put the apple somewhere else", "move_apple"],
        ])
    if demo_kind == "head":
        return json.dumps([
            ["<", "Step left", "left"], [">", "Step right", "right"],
            ["^", "Step up", "up"], ["v", "Step down", "down"],
            ["Reset", "Back to the middle", "restart"],
        ])
    return json.dumps([
        ["<", "Turn left", "left"], [">", "Turn right", "right"],
        ["^", "Turn up", "up"], ["v", "Turn down", "down"],
        ["Restart", "Start the demo again", "restart"],
    ])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind == "compare":
        if action == "move_apple":
            demo["apple"] = rules.random_empty_cell([demo["head"]])
        else:
            demo["head"] = wrap_position(rules.add_direction(demo["head"], rules.DIRECTIONS[action]))
        return

    if kind == "head":
        demo["direction"] = rules.DIRECTIONS[action]
        demo["head"] = rules.add_direction(demo["head"], rules.DIRECTIONS[action])
        return

    if kind == "mini":
        mini_turn(rules.DIRECTIONS[action])
        return

    rules.turn_snake(demo, rules.DIRECTIONS[action])


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action is None:
        return
    if action == "pause":
        rules.toggle_pause(demo)
    elif action == "restart":
        start_demo(kind, json.dumps(flags))
    else:
        rules.turn_snake(demo, rules.DIRECTIONS[action])
