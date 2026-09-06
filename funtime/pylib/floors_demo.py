"""floors_demo.py - the demos beside the editor in the Python workshop."""

import json

import floors_rules as rules
import floors_draw as draw

SCALE = 0.66

kind = "kinds"
flags = {}
demo = {}
message = ""

NAMES = {
    rules.PLAIN: "plain",
    rules.SPIKED: "spiked (锯齿)",
    rules.SLIDE_LEFT: "slides left",
    rules.SLIDE_RIGHT: "slides right",
    rules.SPRING: "spring",
    rules.CRUMBLING: "crumbling",
}


def canvas_size(demo_kind):
    """How big the demo canvas should be."""
    return json.dumps([round(rules.FIELD_WIDTH * SCALE),
                       round(rules.FIELD_HEIGHT * SCALE)])


def showcase():
    """A hand-made shaft with one of every kind of platform in it."""
    state = rules.create_game()
    state["platforms"] = []
    for i, platform_kind in enumerate((rules.PLAIN, rules.SPIKED, rules.SLIDE_LEFT,
                                       rules.SLIDE_RIGHT, rules.SPRING, rules.CRUMBLING)):
        state["platforms"].append({
            "x": 30 + (i % 2) * 130,
            "y": 60 + i * 58,
            "kind": platform_kind,
            "floor": i + 1,
            "crumbling": 0,
        })
    state["player"]["x"] = 40
    state["player"]["y"] = 36
    state["player"]["riding"] = None
    return state


def start_demo(demo_kind, flags_json):
    """Build whatever the current step wants to show."""
    global kind, flags, demo, message
    kind = demo_kind
    flags = json.loads(flags_json) if flags_json else {}
    message = ""

    if kind in ("kinds", "land"):
        demo = showcase()
    else:
        demo = rules.create_game()


def set_message(text):
    """Remember a line of news to show under the canvas."""
    global message
    message = text


def robot_climber(state):
    """A robot player: plan once on landing, then walk that way."""
    player = state["player"]
    if state.get("plan") is None or player["riding"] is not state.get("planned_from"):
        feet = player["y"] + rules.PLAYER_HEIGHT
        below = sorted([q for q in state["platforms"] if q["y"] > feet + 2],
                       key=lambda q: q["y"])[:3]
        nice = [q for q in below if q["kind"] not in (rules.SPIKED, rules.SPRING)]
        choices = nice or below
        if choices:
            target = min(choices, key=lambda q: abs(q["x"] - player["x"]))
            want = target["x"] + rules.PLATFORM_WIDTH / 2 - rules.PLAYER_WIDTH / 2
            here = player["riding"]
            if here is not None:
                ways = [x for x in (here["x"] - rules.PLAYER_WIDTH - 2,
                                    here["x"] + rules.PLATFORM_WIDTH + 2)
                        if 0 <= x <= rules.FIELD_WIDTH - rules.PLAYER_WIDTH]
                if ways:
                    want = min(ways, key=lambda x: abs(x - want))
            state["plan"] = want
            state["planned_from"] = here
    gap = state.get("plan", player["x"]) - player["x"]
    state["steering"] = 0 if abs(gap) < 2 else (1 if gap > 0 else -1)


def update_demo(elapsed):
    """Let the demo's clock tick."""
    if kind == "land":
        # just gravity and landings - the shaft stays still so you can watch
        player = demo["player"]
        seconds = elapsed / 1000
        rules.walk_player(demo, seconds)
        if player["riding"] and not rules.still_on_platform(player, player["riding"]):
            player["riding"] = None
        if not player["riding"]:
            player["last_feet"] = player["y"] + rules.PLAYER_HEIGHT
            player["dy"] = min(rules.MAX_FALL_SPEED,
                               player["dy"] + rules.GRAVITY * seconds)
            player["y"] += player["dy"] * seconds
            for platform in demo["platforms"]:
                if rules.lands_on(player, platform):
                    rules.land_on_platform(demo, platform)
                    break
        if player["y"] > rules.FIELD_HEIGHT:
            start_demo(kind, json.dumps(flags))

    elif kind in ("game", "final"):
        if flags.get("robot"):
            robot_climber(demo)
        rules.update_game(demo, elapsed)
        if demo["is_over"]:
            start_demo(kind, json.dumps(flags))


def draw_demo(ctx, width, height):
    """Draw the current demo onto the canvas, shrunk to fit the panel."""
    ctx.save()
    try:
        ctx.scale(SCALE, SCALE)
        draw.render_game(ctx, demo)

        if kind == "kinds":
            here = demo["platforms"][demo.get("looking", 0)]
            y = rules.screen_y(demo, here["y"])
            ctx.strokeStyle = "#111111"
            ctx.lineWidth = 2
            ctx.setLineDash([5, 4])
            ctx.strokeRect(here["x"] - 4, y - 14,
                           rules.PLATFORM_WIDTH + 8, rules.PLATFORM_HEIGHT + 20)
            ctx.setLineDash([])
            set_message("kind %d - %s" % (here["kind"], NAMES[here["kind"]]))

        elif kind == "land":
            riding = demo["player"]["riding"]
            set_message("%s  -  blood %d/%d"
                        % (("standing on " + NAMES[riding["kind"]]) if riding else "falling",
                           demo["health"], rules.MAX_HEALTH))
        else:
            set_message("floor %d  -  blood %d/%d  -  %d hurt(s)"
                        % (demo["floor"], demo["health"], rules.MAX_HEALTH, demo["hurts"]))
    finally:
        ctx.restore()


def demo_note():
    """The line of text shown under the canvas."""
    return message


def demo_buttons(demo_kind, flags_json):
    """Which buttons this demo needs."""
    if demo_kind == "kinds":
        return json.dumps([["^ Next kind", "Look at the platform above", "up"],
                           ["v Next kind", "Look at the platform below", "down"]])
    return json.dumps([["<", "Walk left", "left"], ["Stop", "Stop walking", "stop"],
                       [">", "Walk right", "right"],
                       ["New", "Start again", "restart"]])


def demo_button(action):
    """React to one of the demo's buttons being pressed."""
    if action == "restart":
        start_demo(kind, json.dumps(flags))
        return
    if kind == "kinds":
        looking = demo.get("looking", 0)
        if action == "up":
            demo["looking"] = max(0, looking - 1)
        elif action == "down":
            demo["looking"] = min(len(demo["platforms"]) - 1, looking + 1)
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
        rules.toggle_pause(demo)
    elif action is not None:
        demo_button(action)
