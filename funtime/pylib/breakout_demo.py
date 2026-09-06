"""breakout_demo.py - the demos beside the editor in the Python workshop."""

import json

import breakout_rules as rules
import breakout_draw as draw

SCALE = 0.62

kind = "bricks"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(rules.FIELD_WIDTH * SCALE), round(rules.FIELD_HEIGHT * SCALE)])


def practice_ball():
    """A ball for the demos that do not have a whole game behind them."""
    return {"x": rules.FIELD_WIDTH / 2, "y": 200, "dx": 190, "dy": -170}


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind == "bricks":
        demo = {"column": 3, "row": 2}
    elif kind == "hit":
        demo = {"ball": {"x": 120, "y": 200}}
    elif kind == "walls":
        demo = {"ball": practice_ball()}
    elif kind == "paddle":
        demo = {"paddle_x": (rules.FIELD_WIDTH - rules.PADDLE_WIDTH) / 2, "steering": 0}
    elif kind == "mini":
        demo = {"paddle_x": (rules.FIELD_WIDTH - rules.PADDLE_WIDTH) / 2,
                "steering": 0, "ball": practice_ball(), "bounces": 0}
    else:
        demo = rules.create_game()
        demo["is_paused"] = False


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def follow_ball(state):
    """A robot hand for the demos: steer the paddle towards the ball."""
    middle = state["paddle_x"] + rules.PADDLE_WIDTH / 2
    if abs(state["ball"]["x"] - middle) < 8:
        state["steering"] = 0
    else:
        state["steering"] = 1 if state["ball"]["x"] > middle else -1


def update_demo(elapsed):
    """Let the demo's clock tick."""
    seconds = elapsed / 1000

    if kind == "walls":
        demo["ball"]["x"] += demo["ball"]["dx"] * seconds
        demo["ball"]["y"] += demo["ball"]["dy"] * seconds
        rules.bounce_off_walls(demo["ball"])
        if demo["ball"]["y"] > rules.FIELD_HEIGHT - rules.BALL_RADIUS:
            demo["ball"]["y"] = rules.FIELD_HEIGHT - rules.BALL_RADIUS
            demo["ball"]["dy"] = -abs(demo["ball"]["dy"])

    elif kind == "paddle":
        rules.move_paddle(demo, seconds)

    elif kind == "mini":
        if flags.get("robot"):
            follow_ball(demo)
        rules.move_paddle(demo, seconds)
        demo["ball"]["x"] += demo["ball"]["dx"] * seconds
        demo["ball"]["y"] += demo["ball"]["dy"] * seconds
        rules.bounce_off_walls(demo["ball"])
        if rules.bounce_off_paddle(demo):
            demo["bounces"] += 1
        if demo["ball"]["y"] > rules.FIELD_HEIGHT + 40:
            demo["ball"] = practice_ball()

    elif kind in ("game", "final"):
        if flags.get("robot"):
            follow_ball(demo)
        rules.update_game(demo, elapsed)
        if demo["is_over"]:
            start_demo(kind, json.dumps(flags))


def draw_practice_field(ctx):
    """The empty box the practice demos happen in."""
    draw.clear_canvas(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT, "#ffffff")
    draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)

        if kind == "bricks":
            draw_practice_field(ctx)
            for row in range(rules.BRICK_ROWS):
                for column in range(rules.BRICK_COLUMNS):
                    draw.draw_brick(ctx, column, row)
            rect = rules.brick_rect(demo["column"], demo["row"])
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 3
            ctx.setLineDash([6, 4])
            ctx.strokeRect(rect["x"] - 4, rect["y"] - 4, rect["width"] + 8, rect["height"] + 8)
            ctx.setLineDash([])
            set_message("brick_rect(%d, %d) -> x %d  y %d  w %d  h %d"
                        % (demo["column"], demo["row"], round(rect["x"]), round(rect["y"]),
                           round(rect["width"]), round(rect["height"])))

        elif kind == "hit":
            draw_practice_field(ctx)
            rect = rules.brick_rect(3, 2)
            draw.draw_brick(ctx, 3, 2)
            draw.draw_ball(ctx, demo["ball"])
            touching = rules.hits_rect(demo["ball"], rect)
            set_message("hits_rect(ball, brick) -> %s%s"
                        % (touching, "   *hit!*" if touching else ""))

        elif kind == "walls":
            draw_practice_field(ctx)
            draw.draw_ball(ctx, demo["ball"])
            set_message("ball  x %d  y %d   dx %d  dy %d"
                        % (demo["ball"]["x"], demo["ball"]["y"],
                           demo["ball"]["dx"], demo["ball"]["dy"]))

        elif kind == "paddle":
            draw_practice_field(ctx)
            draw.draw_paddle(ctx, demo)
            set_message("paddle_x %d   steering %d" % (demo["paddle_x"], demo["steering"]))

        elif kind == "mini":
            draw_practice_field(ctx)
            draw.draw_paddle(ctx, demo)
            draw.draw_ball(ctx, demo["ball"])
            set_message("%d bounce(s) off the paddle" % demo["bounces"])

        else:
            draw.render_game(ctx, demo)
            set_message("score %d  -  %d lives  -  %d bricks left"
                        % (demo["score"], demo["lives"], rules.bricks_left(demo)))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "bricks":
        return json.dumps([["<", "The brick to the left", "left"],
                           [">", "The brick to the right", "right"],
                           ["^", "The row above", "up"], ["v", "The row below", "down"]])
    if demo_kind == "hit":
        return json.dumps([["<", "Move the ball left", "left"], [">", "Move the ball right", "right"],
                           ["^", "Move the ball up", "up"], ["v", "Move the ball down", "down"],
                           ["Reset", "Put the ball back", "restart"]])
    if demo_kind == "walls":
        return json.dumps([["Faster", "Speed the ball up", "faster"],
                           ["Slower", "Slow it down", "slower"],
                           ["Reset", "Put the ball back", "restart"]])
    return json.dumps([["<", "Steer left", "left"], ["Stop", "Stop steering", "stop"],
                       [">", "Steer right", "right"], ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind == "bricks":
        if action == "left":
            demo["column"] = max(0, demo["column"] - 1)
        elif action == "right":
            demo["column"] = min(rules.BRICK_COLUMNS - 1, demo["column"] + 1)
        elif action == "up":
            demo["row"] = max(0, demo["row"] - 1)
        elif action == "down":
            demo["row"] = min(rules.BRICK_ROWS - 1, demo["row"] + 1)
        return

    if kind == "hit":
        steps = {"left": (-8, 0), "right": (8, 0), "up": (0, -8), "down": (0, 8)}
        if action in steps:
            demo["ball"]["x"] += steps[action][0]
            demo["ball"]["y"] += steps[action][1]
        return

    if kind == "walls":
        change = 1.25 if action == "faster" else 0.8
        demo["ball"]["dx"] *= change
        demo["ball"]["dy"] *= change
        return

    if action == "left":
        demo["steering"] = -1
    elif action == "right":
        demo["steering"] = 1
    elif action == "stop":
        demo["steering"] = 0


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        if "is_paused" in demo:
            rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
