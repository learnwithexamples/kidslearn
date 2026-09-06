"""asteroids_demo.py - the demos beside the editor in the Python workshop."""

import json
import math

import asteroids_rules as rules
import asteroids_draw as draw

SCALE = 0.66

kind = "angles"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    size = round(rules.FIELD_WIDTH * SCALE)
    return json.dumps([size, size])


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    demo = rules.create_game()
    if kind in ("angles", "drift"):
        demo["rocks"] = []
        demo["shield"] = 0
    elif kind == "split":
        demo["rocks"] = [rules.make_rock(rules.FIELD_WIDTH / 2, 110, 3)]
        for rock in demo["rocks"]:
            rock["dx"] = 0
            rock["dy"] = 0


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def robot_pilot(state):
    """A robot player: turn towards the nearest rock and shoot it."""
    if not state["rocks"]:
        return
    rock = min(state["rocks"], key=lambda r: rules.distance_between(state["ship"], r))
    want = math.atan2(rock["y"] - state["ship"]["y"], rock["x"] - state["ship"]["x"])
    turn = (want - state["ship"]["angle"] + math.pi) % (2 * math.pi) - math.pi
    state["turning"] = 0 if abs(turn) < 0.08 else (1 if turn > 0 else -1)
    if abs(turn) < 0.12:
        rules.fire_bullet(state)


def update_demo(elapsed):
    """Let the demo's clock tick."""
    seconds = elapsed / 1000

    if kind in ("angles", "drift"):
        state = demo
        state["ship"]["angle"] += state["turning"] * rules.TURN_SPEED * seconds
        if state["thrusting"]:
            rules.thrust_ship(state["ship"], seconds)
        rules.move_thing(state["ship"], seconds)
        for bullet in list(state["bullets"]):
            rules.move_thing(bullet, seconds)
            bullet["life"] -= seconds
        state["bullets"] = [b for b in state["bullets"] if b["life"] > 0]

    elif kind == "split":
        for bullet in list(demo["bullets"]):
            rules.move_thing(bullet, seconds)
            bullet["life"] -= seconds
        demo["bullets"] = [b for b in demo["bullets"] if b["life"] > 0]
        rules.hit_rocks(demo)

    elif kind in ("game", "final"):
        if flags.get("robot"):
            robot_pilot(demo)
        rules.update_game(demo, elapsed)
        if demo["is_over"]:
            start_demo(kind, json.dumps(flags))


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)
        draw.render_game(ctx, demo)

        ship = demo["ship"]
        if kind == "angles":
            nose = rules.point_from(ship["x"], ship["y"], ship["angle"], 60)
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 1.5
            ctx.setLineDash([4, 4])
            ctx.beginPath()
            ctx.moveTo(ship["x"], ship["y"])
            ctx.lineTo(nose["x"], nose["y"])
            ctx.stroke()
            ctx.setLineDash([])
            set_message("angle %.2f  ->  60 pixels ahead is x %d, y %d"
                        % (ship["angle"], round(nose["x"]), round(nose["y"])))

        elif kind == "drift":
            speed = math.sqrt(ship["dx"] ** 2 + ship["dy"] ** 2)
            set_message("x %d  y %d   drifting at %d px/s"
                        % (round(ship["x"]), round(ship["y"]), round(speed)))

        elif kind == "split":
            sizes = [rock["size"] for rock in demo["rocks"]]
            set_message("%d rock(s), sizes %s  -  score %d"
                        % (len(demo["rocks"]), sizes, demo["score"]))

        else:
            set_message("score %d  -  %d lives  -  wave %d  -  %d rocks"
                        % (demo["score"], demo["lives"], demo["wave"], len(demo["rocks"])))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "angles":
        return json.dumps([["Turn left", "Point further left", "left"],
                           ["Turn right", "Point further right", "right"],
                           ["Stop", "Stop turning", "stop"],
                           ["Reset", "Start again", "restart"]])
    if demo_kind == "drift":
        return json.dumps([["Thrust", "Fire the engine for a moment", "thrust"],
                           ["Turn left", "Point further left", "left"],
                           ["Turn right", "Point further right", "right"],
                           ["Stop turning", "Stop turning", "stop"],
                           ["Reset", "Stop everything", "restart"]])
    if demo_kind == "split":
        return json.dumps([["Shoot it", "Fire at the rock", "shoot"],
                           ["Reset", "A whole rock again", "restart"]])
    return json.dumps([["Left", "Turn left", "left"], ["Right", "Turn right", "right"],
                       ["Stop", "Stop turning", "stop"],
                       ["Thrust", "Fire the engine", "thrust"],
                       ["FIRE", "Shoot", "fire"], ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if action == "left":
        demo["turning"] = -1
    elif action == "right":
        demo["turning"] = 1
    elif action == "stop":
        demo["turning"] = 0
    elif action == "thrust":
        rules.thrust_ship(demo["ship"], 0.25)
    elif action == "fire":
        rules.fire_bullet(demo)
    elif action == "shoot":
        rock = demo["rocks"][0] if demo["rocks"] else None
        if rock is not None:
            demo["bullets"].append({"x": rock["x"] - 60, "y": rock["y"],
                                    "dx": 320, "dy": 0, "life": 1.1})


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
