"""invaders_demo.py - the demos beside the editor in the Python workshop."""

import json

import invaders_rules as rules
import invaders_draw as draw

SCALE = 0.66

kind = "fleet"
flags = {}
demo = {}
message = ""


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(rules.FIELD_WIDTH * SCALE), round(rules.FIELD_HEIGHT * SCALE)])


def practice_state():
    """A game with a still fleet, for the demos that only need the picture."""
    state = rules.create_game()
    state["is_paused"] = True
    return state


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind == "fleet":
        demo = practice_state()
        demo["picked"] = {"column": 2, "row": 1}
    elif kind == "march":
        demo = practice_state()
        demo["is_paused"] = False
    elif kind == "shoot":
        demo = practice_state()
        demo["is_paused"] = False
    else:
        demo = rules.create_game()


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def robot_gunner(state):
    """A robot player: line up under the nearest living alien and fire."""
    targets = [a for a in state["aliens"] if a["alive"]]
    if not targets:
        return
    target = min(targets, key=lambda a: abs(rules.alien_rect(a, state)["x"] - state["ship_x"]))
    want = rules.alien_rect(target, state)["x"] + rules.ALIEN_WIDTH / 2 - rules.SHIP_WIDTH / 2
    if abs(want - state["ship_x"]) < 4:
        state["steering"] = 0
        rules.fire_bullet(state)
    else:
        state["steering"] = 1 if want > state["ship_x"] else -1


def update_demo(elapsed):
    """Let the demo's clock tick."""
    seconds = elapsed / 1000

    if kind == "march":
        rules.move_fleet(demo, seconds)

    elif kind == "shoot":
        rules.move_ship(demo, seconds)
        demo["bullets"] = rules.move_bullets(demo["bullets"], -rules.BULLET_SPEED * seconds)
        rules.hit_aliens(demo)

    elif kind in ("game", "final"):
        if flags.get("robot"):
            robot_gunner(demo)
        rules.update_game(demo, elapsed)
        if demo["is_over"]:
            start_demo(kind, json.dumps(flags))


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)
        draw.render_game(ctx, demo)

        if kind == "fleet":
            picked = demo["picked"]
            rect = rules.alien_rect(picked, demo)
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 3
            ctx.setLineDash([5, 4])
            ctx.strokeRect(rect["x"] - 4, rect["y"] - 4, rect["width"] + 8, rect["height"] + 8)
            ctx.setLineDash([])
            set_message("alien_rect(column %d, row %d) -> x %d  y %d"
                        % (picked["column"], picked["row"], round(rect["x"]), round(rect["y"])))

        elif kind == "march":
            way = "right ->" if demo["fleet_direction"] == 1 else "<- left"
            set_message("fleet at x %d  %s  at %d px/s  -  %d aliens left"
                        % (round(demo["fleet_x"]), way, rules.fleet_speed(demo),
                           rules.aliens_left(demo)))

        elif kind == "shoot":
            set_message("%d bullet(s) in the air  -  %d shots fired  -  score %d"
                        % (len(demo["bullets"]), demo["shots"], demo["score"]))

        else:
            set_message("score %d  -  %d lives  -  wave %d  -  %d aliens left"
                        % (demo["score"], demo["lives"], demo["wave"], rules.aliens_left(demo)))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "fleet":
        return json.dumps([["<", "The alien to the left", "left"],
                           [">", "The alien to the right", "right"],
                           ["^", "The row behind", "up"], ["v", "The row in front", "down"]])
    if demo_kind == "march":
        return json.dumps([["Shoot some", "Take a few aliens out", "thin"],
                           ["Reset", "A full fleet again", "restart"]])
    return json.dumps([["<", "Move left", "left"], ["Stop", "Stop moving", "stop"],
                       [">", "Move right", "right"], ["FIRE", "Shoot", "fire"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return

    if kind == "fleet":
        picked = demo["picked"]
        if action == "left":
            picked["column"] = max(0, picked["column"] - 1)
        elif action == "right":
            picked["column"] = min(rules.ALIEN_COLUMNS - 1, picked["column"] + 1)
        elif action == "up":
            picked["row"] = max(0, picked["row"] - 1)
        elif action == "down":
            picked["row"] = min(rules.ALIEN_ROWS - 1, picked["row"] + 1)
        return

    if kind == "march" and action == "thin":
        for alien in demo["aliens"]:
            if alien["alive"] and alien["column"] in (0, 1, 5):
                alien["alive"] = False
        return

    if action == "left":
        demo["steering"] = -1
    elif action == "right":
        demo["steering"] = 1
    elif action == "stop":
        demo["steering"] = 0
    elif action == "fire":
        rules.fire_bullet(demo)


def demo_key(key):
    """React to a key press on the final step."""
    action = rules.action_for_key(key)
    if action == "restart":
        start_demo(kind, json.dumps(flags))
    elif action == "pause":
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
