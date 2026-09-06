"""floors_rules.py - the rules of Hundred Floors, in Python.

You are falling down a shaft. Platforms slide up past you, and you have to
keep landing on them. Land on a plain one and you are fine. Land on a SPIKED
one (锯齿) and it costs you blood. Miss them all and you drop off the bottom of
the shaft - and that is that.

The ceiling is spiked too, so standing still is not an option: the view keeps
sinking and pushes you up into it. The only way to survive is to keep going
down.

THE ONE IDEA TO TAKE AWAY FROM THIS FILE: the shaft does not move. The CAMERA
moves. Every platform has a fixed place in the world and stays there for ever;
what changes is how far down we are looking. Getting that the right way round
is the difference between a game that works and one that fights itself - see
camera_speed below.
"""

import random

FIELD_WIDTH = 300
FIELD_HEIGHT = 420
CEILING_HEIGHT = 22

PLAYER_WIDTH = 20
PLAYER_HEIGHT = 24
WALK_SPEED = 190
GRAVITY = 980
MAX_FALL_SPEED = 430
SPRING_SPEED = -230

PLATFORM_WIDTH = 62
PLATFORM_HEIGHT = 10
ROW_GAP = 92
REACH = 104                 # the furthest apart two platforms may be
CONVEYOR_SPEED = 78
CRUMBLE_SECONDS = 0.4

MAX_HEALTH = 10
SPIKE_DAMAGE = 2
CEILING_DAMAGE = 1
CEILING_HURT_EVERY = 0.6

BASE_SINK = 28              # how fast the view sinks all by itself
FOLLOW_Y = 150              # where on the screen the camera likes you
CHASE = 3.2                 # how hard it hurries to put you there
MAX_SINK = 330              # and the fastest it can ever hurry

# the six kinds of platform
PLAIN = 0
SPIKED = 1
SLIDE_LEFT = 2
SLIDE_RIGHT = 3
SPRING = 4
CRUMBLING = 5


def screen_y(state, world_y):
    """Where something in the world appears on the screen.

    ALGORITHM: everything has a fixed place in the world; the camera tells us
    how far down we are looking, so take that off.
    """
    return world_y - state["camera"]


def base_sink_speed(floor):
    """How fast the view sinks all by itself, in pixels per second.

    ALGORITHM: 28 to start and a little more every floor, up to 92. THIS is
    what stops you resting: stand still and the view keeps sinking until you
    are scraping along the spiked ceiling.
    """
    return min(92, BASE_SINK + floor * 0.9)


def camera_speed(state):
    """How fast the camera is sinking right now, in pixels per second.

    ALGORITHM: the base speed, plus a CHASE. The camera would like you to sit
    FOLLOW_Y down the screen; if you have dropped below that it hurries after
    you, and the further behind it is the faster it goes. It never hurries
    backwards - the view only ever sinks.

    WHY the chase is capped at MAX_SINK: a falling player reaches
    MAX_FALL_SPEED, which is faster. So the camera can keep up with somebody
    hopping neatly from platform to platform, but it can never keep up with
    somebody in real free fall. That gap is exactly what makes missing every
    platform a death rather than an inconvenience.

    AND WHY IT IS THE CAMERA THAT MOVES: it would be tempting to slide all the
    platforms upwards instead. Do that and a player standing on one has to be
    dragged up with it - so hurrying the view would physically fire the player
    into the ceiling. Moving the camera touches nobody.
    """
    wanted = state["player"]["y"] - FOLLOW_Y
    behind = wanted - state["camera"]
    chase = behind * CHASE if behind > 0 else 0
    return min(MAX_SINK, base_sink_speed(state["floor"]) + chase)


def kind_weights(floor):
    """How likely each kind of platform is, this far down.

    OUTPUT: a list of (kind, weight).
    ALGORITHM: plain platforms are always the commonest. Spikes and crumbling
    ones get steadily more likely the deeper you go, which is what makes floor
    80 harder than floor 8 without changing any rule.
    """
    spikes = min(7, 1.5 + floor / 9)
    crumbles = min(4, 0.5 + floor / 14)
    return [
        (PLAIN, 12),
        (SPIKED, spikes),
        (SLIDE_LEFT, 1.5),
        (SLIDE_RIGHT, 1.5),
        (SPRING, 1.5),
        (CRUMBLING, crumbles),
    ]


def random_kind(floor):
    """Pick a kind of platform, with some kinds likelier than others.

    ALGORITHM - WEIGHTED RANDOM CHOICE, and it is worth learning properly:
      1. Add up all the weights.
      2. Pick a random number somewhere in that total.
      3. Walk the list, taking each weight off your number as you go. The
         moment your number runs out, that is the one you have landed on.

    Picture a row of buckets of different widths and a dart thrown at random:
    a wide bucket catches more darts. That is all this is.
    """
    weights = kind_weights(floor)

    total = sum(weight for kind, weight in weights)
    ticket = random.uniform(0, total)

    for kind, weight in weights:
        ticket -= weight
        if ticket < 0:
            return kind
    return PLAIN


def platform_rect(platform):
    """Where a platform is in the world, as a rectangle."""
    return {
        "x": platform["x"],
        "y": platform["y"],
        "width": PLATFORM_WIDTH,
        "height": PLATFORM_HEIGHT,
    }


def player_rect(player):
    """The player as a rectangle, in the world."""
    return {
        "x": player["x"],
        "y": player["y"],
        "width": PLAYER_WIDTH,
        "height": PLAYER_HEIGHT,
    }


def is_over(player, platform):
    """Is the player standing over this platform?

    ALGORITHM: compare the MIDDLE of the player, not the whole body.

    WHY the middle: if any overlap at all counted, you could stand balanced on
    half a pixel of platform, hanging in mid-air and refusing to fall, while
    the ceiling ground you down. Using the middle means you drop the moment
    you walk past the edge, which is what a player expects.
    """
    middle = player["x"] + PLAYER_WIDTH / 2
    return platform["x"] < middle < platform["x"] + PLATFORM_WIDTH


def lands_on(player, platform):
    """Has the player just landed on this platform?

    ALGORITHM - the CROSSING test:
      * the player must be falling. Rising up through a platform from below is
        allowed, and that matters after a spring throws you upwards.
      * their feet must have been ABOVE the platform's top last frame, and be
        level with or below it now. That is what "crossed it" means.
      * and they must be over it - see is_over.

    WHY not simply "are the feet near the top?": at full speed the player
    falls seven pixels in a frame and a platform is ten thick. A "near" test
    misses fast landings; a crossing test cannot.
    """
    if player["dy"] <= 0:
        return False
    rect = platform_rect(platform)
    feet = player["y"] + PLAYER_HEIGHT

    if player["last_feet"] > rect["y"] or feet < rect["y"]:
        return False
    return is_over(player, platform)


def hurt(state, amount):
    """Take some blood off, never below zero."""
    state["health"] = max(0, state["health"] - amount)
    state["hurts"] += 1


def land_on_platform(state, platform):
    """What happens when you land on one.

    ALGORITHM: stand the player exactly on top, then do whatever this KIND of
    platform does:
      spiked      - 锯齿. It costs you SPIKE_DAMAGE blood.
      spring      - it throws you straight back up.
      crumbling   - it starts falling apart under your feet.
      sliding     - it carries you sideways while you stand on it.
      plain       - nothing at all, and that is a relief.

    Landing somewhere new is a new floor, and floors are the score.
    """
    rect = platform_rect(platform)

    state["player"]["y"] = rect["y"] - PLAYER_HEIGHT
    state["player"]["dy"] = 0
    state["player"]["riding"] = platform

    if platform["floor"] > state["floor"]:
        state["floor"] = platform["floor"]
        state["score"] += 10

    if platform["kind"] == SPIKED:
        hurt(state, SPIKE_DAMAGE)

    elif platform["kind"] == SPRING:
        state["player"]["dy"] = SPRING_SPEED
        state["player"]["riding"] = None
        state["bounces"] += 1

    elif platform["kind"] == CRUMBLING:
        platform["crumbling"] = CRUMBLE_SECONDS


def is_dead(state):
    """Is the game over?

    ALGORITHM: two ways to go. Run out of blood, or fall off the bottom of the
    screen having missed every platform on the way down.
    """
    return state["health"] <= 0 or screen_y(state, state["player"]["y"]) > FIELD_HEIGHT


def lowest_platform(state):
    """The platform furthest down the shaft."""
    if not state["platforms"]:
        return None
    return max(state["platforms"], key=lambda p: p["y"])


def add_platform(state):
    """Hang a new platform below the bottom of the shaft.

    ALGORITHM: put it one ROW_GAP below the lowest one, and never further than
    REACH sideways from it. Without that limit the game could deal you a
    platform you had no way of reaching.
    """
    lowest = lowest_platform(state)
    from_x = lowest["x"] if lowest else (FIELD_WIDTH - PLATFORM_WIDTH) / 2
    y = lowest["y"] + ROW_GAP if lowest else state["camera"] + FIELD_HEIGHT - 40

    low = max(0, from_x - REACH)
    high = min(FIELD_WIDTH - PLATFORM_WIDTH, from_x + REACH)

    state["nextFloor"] += 1
    state["platforms"].append({
        "x": random.uniform(low, high),
        "y": y,
        "kind": PLAIN if state["nextFloor"] <= 3 else random_kind(state["nextFloor"]),
        "floor": state["nextFloor"],
        "crumbling": 0,
    })


def fill_shaft(state):
    """Keep making platforms until the bottom of the screen is covered."""
    while (lowest_platform(state) is None
           or screen_y(state, lowest_platform(state)["y"]) < FIELD_HEIGHT):
        add_platform(state)


def create_game():
    """Start a brand-new game at the top of the shaft."""
    state = {
        "player": {
            "x": (FIELD_WIDTH - PLAYER_WIDTH) / 2,
            "y": 150,
            "dy": 0,
            "last_feet": 150 + PLAYER_HEIGHT,
            "riding": None,
        },
        "platforms": [],
        "camera": 0,
        "steering": 0,
        "health": MAX_HEALTH,
        "floor": 1,
        "nextFloor": 1,
        "score": 0,
        "hurts": 0,
        "bounces": 0,
        "since_ceiling_hurt": 0,
        "is_over": False,
        "is_paused": False,
    }

    # a platform right under the player's feet, then a ladder of them below
    state["platforms"].append({
        "x": (FIELD_WIDTH - PLATFORM_WIDTH) / 2,
        "y": 150 + PLAYER_HEIGHT,
        "kind": PLAIN,
        "floor": 1,
        "crumbling": 0,
    })
    state["player"]["riding"] = state["platforms"][0]
    fill_shaft(state)
    return state


def walk_player(state, seconds):
    """Move the player sideways, staying inside the shaft.

    ALGORITHM: speed x steering x time, plus a shove from any sliding platform
    being stood on, then keep the whole player inside the walls.
    """
    x = state["player"]["x"] + state["steering"] * WALK_SPEED * seconds

    riding = state["player"]["riding"]
    if riding and riding["kind"] == SLIDE_LEFT:
        x -= CONVEYOR_SPEED * seconds
    elif riding and riding["kind"] == SLIDE_RIGHT:
        x += CONVEYOR_SPEED * seconds

    state["player"]["x"] = max(0, min(FIELD_WIDTH - PLAYER_WIDTH, x))


def still_on_platform(player, platform):
    """Has the player walked off the edge of what they were standing on?"""
    return is_over(player, platform)


def update_game(state, elapsed_ms):
    """One frame of the game."""
    if state["is_over"] or state["is_paused"]:
        return
    seconds = elapsed_ms / 1000

    walk_player(state, seconds)

    # platforms that are falling apart do so whether you are on them or not
    for platform in state["platforms"]:
        if platform["crumbling"] > 0:
            platform["crumbling"] -= seconds
            if platform["crumbling"] <= 0:
                platform["gone"] = True
    state["platforms"] = [p for p in state["platforms"] if not p.get("gone")]
    if state["player"]["riding"] not in state["platforms"]:
        state["player"]["riding"] = None

    if state["player"]["riding"]:
        if still_on_platform(state["player"], state["player"]["riding"]):
            state["player"]["y"] = state["player"]["riding"]["y"] - PLAYER_HEIGHT
            state["player"]["dy"] = 0
        else:
            state["player"]["riding"] = None

    if not state["player"]["riding"]:
        state["player"]["last_feet"] = state["player"]["y"] + PLAYER_HEIGHT
        state["player"]["dy"] = min(MAX_FALL_SPEED,
                                    state["player"]["dy"] + GRAVITY * seconds)
        state["player"]["y"] += state["player"]["dy"] * seconds

        for platform in state["platforms"]:
            if lands_on(state["player"], platform):
                land_on_platform(state, platform)
                break

    # the view sinks; nothing in the world is touched by this
    state["camera"] += camera_speed(state) * seconds
    state["platforms"] = [p for p in state["platforms"]
                          if screen_y(state, p["y"]) + PLATFORM_HEIGHT > 0]
    if state["player"]["riding"] not in state["platforms"]:
        state["player"]["riding"] = None
    fill_shaft(state)

    # the ceiling is spiked too - being scraped along it costs blood
    state["since_ceiling_hurt"] += seconds
    if screen_y(state, state["player"]["y"]) < CEILING_HEIGHT:
        state["player"]["y"] = state["camera"] + CEILING_HEIGHT
        state["player"]["riding"] = None
        if state["since_ceiling_hurt"] >= CEILING_HURT_EVERY:
            hurt(state, CEILING_DAMAGE)
            state["since_ceiling_hurt"] = 0

    if is_dead(state):
        state["is_over"] = True


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        "p": "pause", " ": "pause", "spacebar": "pause",
        "r": "restart",
    }
    return keys.get(str(key).lower())
