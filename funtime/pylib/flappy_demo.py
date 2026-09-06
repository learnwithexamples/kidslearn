"""flappy_demo.py - the demos beside the editor in the Python workshop."""

import json

import flappy_rules as rules
import flappy_draw as draw

SCALE = 0.62

kind = "fall"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(rules.FIELD_WIDTH * SCALE), round(rules.FIELD_HEIGHT * SCALE)])


def practice_bird():
    """A bird for the demos with no whole game behind them."""
    return {"y": 120, "dy": 0}


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind in ("fall", "fly"):
        demo = {"bird": practice_bird(), "flaps": 0}
    elif kind == "pipe":
        demo = {"pipe": {"x": 120, "gap_y": 150, "passed": False}}
    elif kind == "overlap":
        demo = {"bird": {"y": 180, "dy": 0}, "pipe": {"x": 120, "gap_y": 150, "passed": False}}
    elif kind == "scroll":
        demo = {"pipes": [rules.make_pipe(120), rules.make_pipe(292)], "scrolled": 0}
    elif kind == "mini":
        demo = {"bird": practice_bird(), "pipes": [rules.make_pipe(rules.FIELD_WIDTH)],
                "since_last_pipe": 0, "score": 0, "is_over": False, "is_paused": False,
                "scrolled": 0}
    else:
        demo = rules.create_game()
        demo["scrolled"] = 0
        demo["is_paused"] = False


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def robot_flap(state):
    """A robot pilot: flap whenever the bird is below the next gap."""
    ahead = [p for p in state["pipes"] if p["x"] + rules.PIPE_WIDTH > rules.BIRD_X]
    if ahead:
        target = ahead[0]["gap_y"] + rules.GAP_HEIGHT / 2 - rules.BIRD_SIZE / 2
    else:
        target = rules.FIELD_HEIGHT / 2
    if state["bird"]["y"] > target and state["bird"]["dy"] > -60:
        rules.flap(state["bird"])


def update_demo(elapsed):
    """Let the demo's clock tick."""
    seconds = elapsed / 1000

    if kind in ("fall", "fly"):
        rules.apply_gravity(demo["bird"], seconds)
        if demo["bird"]["y"] > rules.GROUND_Y - rules.BIRD_SIZE:
            demo["bird"] = practice_bird()

    elif kind == "scroll":
        distance = rules.BASE_PIPE_SPEED * seconds
        demo["scrolled"] += distance
        demo["pipes"] = rules.move_pipes(demo["pipes"], distance)
        if not demo["pipes"] or demo["pipes"][-1]["x"] < rules.FIELD_WIDTH - rules.PIPE_SPACING:
            demo["pipes"].append(rules.make_pipe(rules.FIELD_WIDTH))

    elif kind == "mini":
        if flags.get("robot"):
            robot_flap(demo)
        distance = rules.BASE_PIPE_SPEED * seconds
        demo["scrolled"] += distance
        rules.apply_gravity(demo["bird"], seconds)
        demo["pipes"] = rules.move_pipes(demo["pipes"], distance)
        demo["since_last_pipe"] += distance
        if demo["since_last_pipe"] >= rules.PIPE_SPACING:
            demo["pipes"].append(rules.make_pipe(rules.FIELD_WIDTH))
            demo["since_last_pipe"] = 0
        if rules.is_crashed(demo):
            start_demo(kind, json.dumps(flags))

    elif kind in ("game", "final"):
        if flags.get("robot"):
            robot_flap(demo)
        demo["scrolled"] += rules.pipe_speed(rules.current_level(demo)) * seconds
        rules.update_game(demo, elapsed)
        if demo["is_over"] and flags.get("robot"):
            start_demo(kind, json.dumps(flags))


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)

        if kind in ("fall", "fly"):
            draw.draw_sky(ctx, 0)
            draw.draw_ground(ctx, 0)
            draw.draw_bird(ctx, demo["bird"])
            draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)
            set_message("y %d   dy %d   (%d flaps)"
                        % (demo["bird"]["y"], demo["bird"]["dy"], demo["flaps"]))

        elif kind == "pipe":
            draw.draw_sky(ctx, 0)
            draw.draw_pipe(ctx, demo["pipe"])
            draw.draw_ground(ctx, 0)
            draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)
            rects = rules.pipe_rects(demo["pipe"])
            set_message("top height %d   bottom height %d"
                        % (rects["top"]["height"], rects["bottom"]["height"]))

        elif kind == "overlap":
            draw.draw_sky(ctx, 0)
            draw.draw_pipe(ctx, demo["pipe"])
            draw.draw_ground(ctx, 0)
            draw.draw_bird(ctx, demo["bird"])
            draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)
            touching = rules.hits_pipe(demo["bird"], demo["pipe"])
            set_message("hits_pipe(bird, pipe) -> %s%s"
                        % (touching, "   *crash!*" if touching else "   safe"))

        elif kind == "scroll":
            draw.draw_sky(ctx, demo["scrolled"])
            for pipe in demo["pipes"]:
                draw.draw_pipe(ctx, pipe)
            draw.draw_ground(ctx, demo["scrolled"])
            draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)
            set_message("%d pipe(s) in the list" % len(demo["pipes"]))

        elif kind == "mini":
            draw.draw_sky(ctx, demo["scrolled"])
            for pipe in demo["pipes"]:
                draw.draw_pipe(ctx, pipe)
            draw.draw_ground(ctx, demo["scrolled"])
            draw.draw_bird(ctx, demo["bird"])
            draw.draw_frame(ctx, rules.FIELD_WIDTH, rules.FIELD_HEIGHT)
            set_message("is_crashed -> %s" % rules.is_crashed(demo))

        else:
            draw.render_game(ctx, demo)
            set_message("score %d  -  level %d" % (demo["score"], rules.current_level(demo)))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "fall":
        return json.dumps([["Drop again", "Put the bird back at the top", "restart"]])
    if demo_kind == "fly":
        return json.dumps([["FLAP!", "Flap the wings", "flap"],
                           ["Reset", "Put the bird back", "restart"]])
    if demo_kind == "pipe":
        return json.dumps([["Gap up", "Move the gap up", "up"],
                           ["Gap down", "Move the gap down", "down"],
                           ["New pipe", "A random pipe", "restart"]])
    if demo_kind == "overlap":
        return json.dumps([["Bird up", "Move the bird up", "up"],
                           ["Bird down", "Move the bird down", "down"],
                           ["Pipe left", "Slide the pipe closer", "left"],
                           ["Pipe right", "Slide the pipe away", "right"],
                           ["Reset", "Start again", "restart"]])
    if demo_kind == "scroll":
        return json.dumps([["Reset", "Start again", "restart"]])
    return json.dumps([["FLAP!", "Flap the wings", "flap"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind in ("fall", "fly") and action == "flap":
        rules.flap(demo["bird"])
        demo["flaps"] += 1
        return

    if kind == "pipe":
        change = -14 if action == "up" else 14
        highest = rules.GAP_MARGIN
        lowest = rules.GROUND_Y - rules.GAP_HEIGHT - rules.GAP_MARGIN
        demo["pipe"]["gap_y"] = max(highest, min(lowest, demo["pipe"]["gap_y"] + change))
        return

    if kind == "overlap":
        if action == "up":
            demo["bird"]["y"] -= 14
        elif action == "down":
            demo["bird"]["y"] += 14
        elif action == "left":
            demo["pipe"]["x"] -= 12
        elif action == "right":
            demo["pipe"]["x"] += 12
        return

    if action == "flap" and "bird" in demo:
        rules.flap(demo["bird"])


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
