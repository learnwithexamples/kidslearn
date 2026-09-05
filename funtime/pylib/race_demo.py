"""race_demo.py - the little demos beside the editor in the Python workshop.

The workshop page hands this module the canvas and asks it to draw. It calls
the game's functions through the module, so the moment you replace one with
your own, the demo starts using yours.
"""

import json
import random

import race_rules as rules
import race_draw as draw

DEMO_SCALE = 0.8
DEMO_SPEED = 200
DEMO_GAP = 300

kind = "lanes"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(rules.ROAD_WIDTH * DEMO_SCALE),
                       round(rules.ROAD_HEIGHT * DEMO_SCALE)])


def target_x(lane):
    """Where a car in this lane wants its left edge to be."""
    return rules.lane_center_x(lane) - rules.CAR_WIDTH / 2


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind == "lanes":
        demo = {"cars": [rules.create_car(0, 60), rules.create_car(1, 210), rules.create_car(2, 360)]}
    elif kind == "clamp":
        demo = {"wanted": target_x(1)}
    elif kind == "cars":
        demo = {"cars": []}
    elif kind == "overlap":
        demo = {"a": rules.create_car(1, rules.PLAYER_Y), "b": rules.create_car(1, 120)}
    elif kind == "mini":
        demo = {"player": rules.create_car(1, rules.PLAYER_Y), "cars": [], "target_lane": 1,
                "steering": 0, "since_spawn": DEMO_GAP, "stripe_offset": 0, "is_over": False}
    else:
        demo = rules.create_game()
        demo["target_lane"] = 1
        demo["is_paused"] = False


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def steer_toward_target():
    """Turn "I want lane 2" into a steering value of -1, 0 or 1."""
    wanted = target_x(demo["target_lane"])
    if abs(wanted - demo["player"]["x"]) < 4:
        demo["steering"] = 0
    else:
        demo["steering"] = 1 if wanted > demo["player"]["x"] else -1


def update_mini(elapsed):
    """One frame of the practice road."""
    if demo.get("is_over"):
        return

    seconds = elapsed / 1000
    travelled = DEMO_SPEED * seconds

    steer_toward_target()
    rules.steer_player(demo, seconds)
    demo["stripe_offset"] = (demo["stripe_offset"] + travelled) % rules.STRIPE_PERIOD

    if flags.get("traffic"):
        demo["cars"] = rules.move_cars(demo["cars"], travelled)
        demo["since_spawn"] += travelled
        if demo["since_spawn"] >= DEMO_GAP:
            rules.spawn_car(demo)
            demo["since_spawn"] = 0

    if flags.get("remove"):
        demo["cars"] = rules.keep_cars_on_screen(demo["cars"])

    if flags.get("crash") and rules.has_crashed(demo):
        demo["is_over"] = True
        set_message("Crash! Press Restart to try again")


def update_demo(elapsed):
    """Let the demo's clock tick."""
    if kind in ("game", "final"):
        steer_toward_target()
        rules.update_race(demo, elapsed)
    elif kind == "mini":
        update_mini(elapsed)


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(DEMO_SCALE, DEMO_SCALE)

        if kind == "lanes":
            draw.draw_road(ctx, 0)
            for car in demo["cars"]:
                draw.draw_car(ctx, car, False)
            draw.draw_frame(ctx, rules.ROAD_WIDTH, rules.ROAD_HEIGHT)
            set_message("lane 0 -> %g   lane 1 -> %g   lane 2 -> %g"
                        % (rules.lane_center_x(0), rules.lane_center_x(1), rules.lane_center_x(2)))

        elif kind == "clamp":
            parked = rules.create_car(1, rules.PLAYER_Y)
            parked["x"] = rules.clamp(demo["wanted"], rules.PLAYER_MIN_X, rules.PLAYER_MAX_X)
            draw.draw_road(ctx, 0)
            draw.draw_car(ctx, parked, True)
            draw.draw_frame(ctx, rules.ROAD_WIDTH, rules.ROAD_HEIGHT)
            set_message("clamp(%d, %g, %g) -> %d"
                        % (round(demo["wanted"]), rules.PLAYER_MIN_X, rules.PLAYER_MAX_X, round(parked["x"])))

        elif kind == "cars":
            draw.draw_road(ctx, 0)
            for car in demo["cars"]:
                draw.draw_car(ctx, car, False)
            draw.draw_frame(ctx, rules.ROAD_WIDTH, rules.ROAD_HEIGHT)
            set_message("%d car(s) on the road" % len(demo["cars"]))

        elif kind == "overlap":
            draw.draw_road(ctx, 0)
            draw.draw_car(ctx, demo["b"], False)
            draw.draw_car(ctx, demo["a"], True)
            draw.draw_frame(ctx, rules.ROAD_WIDTH, rules.ROAD_HEIGHT)
            touching = rules.overlaps(demo["a"], demo["b"])
            set_message("overlaps(yours, theirs) -> %s%s"
                        % (touching, "   that is a crash!" if touching else ""))

        elif kind == "mini":
            draw.draw_road(ctx, demo["stripe_offset"])
            for car in demo["cars"]:
                draw.draw_car(ctx, car, False)
            draw.draw_car(ctx, demo["player"], True)
            draw.draw_frame(ctx, rules.ROAD_WIDTH, rules.ROAD_HEIGHT)
            if demo["is_over"]:
                draw.draw_message(ctx, rules.ROAD_WIDTH, rules.ROAD_HEIGHT, "CRASH!", "Press Restart")
            if not message:
                set_message("cars in the list: %d" % len(demo["cars"]))

        else:
            draw.render_game(ctx, demo)
            set_message("Score %d  -  Level %d  -  %d m"
                        % (demo["score"], demo["level"], rules.metres_driven(demo)))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs, as JSON [label, tooltip, action] triples."""
    if demo_kind == "lanes":
        return json.dumps([["Redraw", "Park the cars again", "restart"]])
    if demo_kind == "clamp":
        return json.dumps([["<< Push left", "Try to shove the car off the road", "push_left"],
                           ["Push right >>", "Try to shove it off the other side", "push_right"],
                           ["Reset", "Back to the middle", "restart"]])
    if demo_kind == "cars":
        return json.dumps([["+ Car", "Drop another car on the road", "add_car"],
                           ["Lane 0", "A car in the left lane", "add_lane0"],
                           ["Lane 2", "A car in the right lane", "add_lane2"],
                           ["Clear", "Clear the road", "restart"]])
    if demo_kind == "overlap":
        return json.dumps([["<", "Move your car left", "left"], [">", "Move your car right", "right"],
                           ["^", "Move it up the road", "up"], ["v", "Move it back down", "down"],
                           ["Reset", "Put them back", "restart"]])
    buttons = [["<", "Move one lane left", "left"], [">", "Move one lane right", "right"]]
    if json.loads(flags_json or "{}").get("levelPicker"):
        buttons.append(["Level -", "Slower", "level_down"])
        buttons.append(["Level +", "Faster", "level_up"])
    buttons.append(["Restart", "Start the demo again", "restart"])
    return json.dumps(buttons)


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind == "clamp":
        demo["wanted"] += -40 if action == "push_left" else 40
        return

    if kind == "cars":
        if action == "add_car":
            demo["cars"].append(rules.create_car(rules.random_lane(),
                                                 random.randrange(rules.ROAD_HEIGHT - rules.CAR_HEIGHT)))
        elif action == "add_lane0":
            demo["cars"].append(rules.create_car(0, 40))
        elif action == "add_lane2":
            demo["cars"].append(rules.create_car(2, 40))
        return

    if kind == "overlap":
        moves = {"left": (-12, 0), "right": (12, 0), "up": (0, -16), "down": (0, 16)}
        dx, dy = moves[action]
        demo["a"]["x"] += dx
        demo["a"]["y"] += dy
        return

    if action == "left":
        demo["target_lane"] = rules.clamp(demo["target_lane"] - 1, 0, rules.LANE_COUNT - 1)
    elif action == "right":
        demo["target_lane"] = rules.clamp(demo["target_lane"] + 1, 0, rules.LANE_COUNT - 1)
    elif action == "level_down":
        demo["level"] = max(1, demo["level"] - 1)
    elif action == "level_up":
        demo["level"] = min(20, demo["level"] + 1)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action is None:
        return
    if action in ("left", "right"):
        demo_button(action)
    elif action == "faster":
        demo["boost"] = rules.BOOST_FAST
    elif action == "slower":
        demo["boost"] = rules.BOOST_SLOW
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action == "restart":
        start_demo(kind, json.dumps(flags))
