"""asteroids_demo.py - the demos beside the editor in the Python workshop.

Twenty steps need more than one practice field, so there are nine. Each one
shows the least it can get away with: the step about angles has no rocks in it
at all, the step about bullets has nothing to shoot. Fewer moving parts means
a student can actually see what their function just did.
"""

import json
import math
import random

import asteroids_rules as rules
import asteroids_draw as draw

SCALE = 0.66

# Kinds that are just the ship flying about, with nothing to hit.
OPEN_SKY = ("angles", "measure", "drift", "shoot")

kind = "angles"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    size = round(rules.FIELD_WIDTH * SCALE)
    return json.dumps([size, size])


def still_rock(x, y, size):
    """A rock that stays put, so a demo can be read slowly."""
    rock = rules.make_rock(x, y, size)
    rock["dx"] = 0
    rock["dy"] = 0
    return rock


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    demo = rules.create_game()

    if kind in OPEN_SKY:
        demo["rocks"] = []
        demo["shield"] = 0
        if kind == "measure":
            demo["rocks"] = [still_rock(250, 110, 3)]
    elif kind == "rock":
        demo["shield"] = 0
        demo["rocks"] = [still_rock(rules.FIELD_WIDTH / 2, rules.FIELD_HEIGHT / 2, 3)]
    elif kind == "split":
        demo["rocks"] = [still_rock(rules.FIELD_WIDTH / 2, 110, 3)]
    elif kind == "wave":
        demo["wave"] = 1
        rules.start_wave(demo)


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


def fly_ship(seconds):
    """The ship's own frame: turn, thrust or drift, move."""
    rules.turn_ship(demo["ship"], demo["turning"], seconds)
    if demo["thrusting"]:
        rules.thrust_ship(demo["ship"], seconds)
    else:
        rules.drift_ship(demo["ship"], seconds)
    rules.move_thing(demo["ship"], seconds)


def fly_bullets(seconds):
    """Carry the shots along and let the spent ones fade."""
    for bullet in demo["bullets"]:
        rules.move_thing(bullet, seconds)
    demo["bullets"] = rules.age_bullets(demo["bullets"], seconds)


def update_demo(elapsed):
    """Let the demo's clock tick."""
    seconds = elapsed / 1000

    if kind in OPEN_SKY:
        fly_ship(seconds)
        fly_bullets(seconds)

    elif kind == "rock":
        for rock in demo["rocks"]:
            rock["wobble"] += rock["spin"] * seconds

    elif kind == "wave":
        for rock in demo["rocks"]:
            rules.move_thing(rock, seconds)
            rock["wobble"] += rock["spin"] * seconds

    elif kind == "split":
        fly_bullets(seconds)
        rules.hit_rocks(demo)

    elif kind in ("game", "final"):
        if flags.get("robot"):
            robot_pilot(demo)
        rules.update_game(demo, elapsed)
        if demo["is_over"]:
            start_demo(kind, json.dumps(flags))


def dashed_line(ctx, start, end):
    """The measuring line the geometry demos draw."""
    ctx.strokeStyle = "#111111"
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(start["x"], start["y"])
    ctx.lineTo(end["x"], end["y"])
    ctx.stroke()
    ctx.setLineDash([])


def mark_corners(ctx, rock):
    """A dot on every point rock_points handed back."""
    ctx.fillStyle = "#111111"
    for point in rules.rock_points(rock):
        ctx.beginPath()
        ctx.arc(point["x"], point["y"], 2.5, 0, math.pi * 2)
        ctx.fill()


def describe():
    """The line of words under the canvas, per demo kind."""
    ship = demo["ship"]

    if kind == "angles":
        nose = rules.point_from(ship["x"], ship["y"], ship["angle"], 60)
        set_message("angle %.2f  ->  60 pixels ahead is x %d, y %d"
                    % (ship["angle"], round(nose["x"]), round(nose["y"])))

    elif kind == "measure":
        rock = demo["rocks"][0]
        gap = rules.distance_between(ship, rock)
        hit = rules.touches(ship, rock, rules.SHIP_RADIUS, rules.ROCK_RADIUS[rock["size"]])
        set_message("distance_between -> %.1f   -   touches -> %s"
                    % (gap, "TRUE, they overlap" if hit else "False, still clear"))

    elif kind == "drift":
        set_message("x %d  y %d   speed_of -> %d px/s  (limit %d)"
                    % (round(ship["x"]), round(ship["y"]),
                       round(rules.speed_of(ship)), rules.MAX_SPEED))

    elif kind == "shoot":
        set_message("%d of %d shots in the air   -   %d fired so far"
                    % (len(demo["bullets"]), rules.MAX_BULLETS, demo["shots"]))

    elif kind == "rock":
        rock = demo["rocks"][0] if demo["rocks"] else None
        if rock is None:
            set_message("no rock")
        else:
            set_message("size %d   -   rock_points -> %d corners   -   wobble %.1f"
                        % (rock["size"], len(rules.rock_points(rock)), rock["wobble"]))

    elif kind == "wave":
        set_message("wave %d   -   %d rocks in the ring" % (demo["wave"], len(demo["rocks"])))

    elif kind == "split":
        sizes = [rock["size"] for rock in demo["rocks"]]
        set_message("%d rock(s), sizes %s  -  score %d"
                    % (len(demo["rocks"]), sizes, demo["score"]))

    else:
        set_message("score %d  -  %d lives  -  wave %d  -  %d rocks"
                    % (demo["score"], demo["lives"], demo["wave"], len(demo["rocks"])))


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)
        draw.render_game(ctx, demo)

        if kind == "angles":
            ship = demo["ship"]
            dashed_line(ctx, ship, rules.point_from(ship["x"], ship["y"], ship["angle"], 60))
        elif kind == "measure" and demo["rocks"]:
            dashed_line(ctx, demo["ship"], demo["rocks"][0])
        elif kind == "rock" and demo["rocks"]:
            mark_corners(ctx, demo["rocks"][0])

        describe()
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


STEERING = [["Turn left", "Point further left", "left"],
            ["Turn right", "Point further right", "right"],
            ["Stop", "Stop turning", "stop"]]


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "rock":
        return json.dumps([["New rock", "Another rock, drifting its own way", "newrock"],
                           ["Smaller", "Try the next size down", "smaller"],
                           ["Spin", "Give it a shove", "spin"]])
    if demo_kind == "wave":
        return json.dumps([["Next wave", "A bigger ring", "nextwave"],
                           ["Wave 1", "Back to the start", "restart"]])
    if demo_kind == "split":
        return json.dumps([["Shoot it", "Fire at the rock", "shoot"],
                           ["Reset", "A whole rock again", "restart"]])
    if demo_kind == "angles":
        return json.dumps(STEERING + [["Reset", "Start again", "restart"]])
    if demo_kind in ("drift", "measure"):
        return json.dumps([["Thrust", "Fire the engine for a moment", "thrust"]]
                          + STEERING + [["Reset", "Stop everything", "restart"]])

    return json.dumps(STEERING + [["Thrust", "Fire the engine", "thrust"],
                                  ["FIRE", "Shoot", "fire"],
                                  ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if action == "newrock":
        demo["rocks"] = [still_rock(rules.FIELD_WIDTH / 2, rules.FIELD_HEIGHT / 2, 3)]
    elif action == "smaller":
        rock = demo["rocks"][0] if demo["rocks"] else None
        size = rock["size"] - 1 if rock is not None and rock["size"] > 1 else 3
        demo["rocks"] = [still_rock(rules.FIELD_WIDTH / 2, rules.FIELD_HEIGHT / 2, size)]
    elif action == "spin":
        if demo["rocks"]:
            demo["rocks"][0]["spin"] = random.uniform(-1, 1)
    elif action == "nextwave":
        demo["wave"] += 1
        rules.start_wave(demo)
    elif action == "left":
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
