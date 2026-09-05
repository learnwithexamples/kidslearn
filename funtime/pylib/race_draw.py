"""race_draw.py - drawing the racing game, in Python.

Black and white only: a white road, black verges with white dashes, black lane
markings, and black cars with white windows. Your car has a racing stripe.
"""

from race_rules import (ROAD_WIDTH, ROAD_HEIGHT, EDGE_WIDTH, LANE_COUNT,
                        LANE_WIDTH, STRIPE_PERIOD)

COLOR_ROAD = "#ffffff"
COLOR_INK = "#111111"
COLOR_PAINT = "#ffffff"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_dashed_line(ctx, x, offset, width, color):
    """A line of dashes running down the road.

    INPUT:  ctx, x, offset (how far they have scrolled), width, color
    OUTPUT: nothing
    ALGORITHM: start one dash above the top so a dash is always sliding in,
    then step down the road STRIPE_PERIOD pixels at a time.
    """
    dash_length = STRIPE_PERIOD / 2
    ctx.fillStyle = color
    y = -STRIPE_PERIOD + offset
    while y < ROAD_HEIGHT:
        ctx.fillRect(x - width / 2, y, width, dash_length)
        y += STRIPE_PERIOD


def draw_road(ctx, stripe_offset):
    """The road itself: verges, lane markings and all."""
    clear_canvas(ctx, ROAD_WIDTH, ROAD_HEIGHT, COLOR_ROAD)

    ctx.fillStyle = COLOR_INK
    ctx.fillRect(0, 0, EDGE_WIDTH, ROAD_HEIGHT)
    ctx.fillRect(ROAD_WIDTH - EDGE_WIDTH, 0, EDGE_WIDTH, ROAD_HEIGHT)

    draw_dashed_line(ctx, EDGE_WIDTH / 2, stripe_offset, EDGE_WIDTH - 6, COLOR_PAINT)
    draw_dashed_line(ctx, ROAD_WIDTH - EDGE_WIDTH / 2, stripe_offset, EDGE_WIDTH - 6, COLOR_PAINT)

    for lane in range(1, LANE_COUNT):
        draw_dashed_line(ctx, EDGE_WIDTH + lane * LANE_WIDTH, stripe_offset, 4, COLOR_INK)


def draw_car(ctx, car, is_player):
    """One car, seen from above.

    ALGORITHM: a black rectangle, two white windows (your windscreen is at the
    top because you drive away from the camera; the traffic's is at the bottom
    because it comes towards you), four white wheel notches, and a racing
    stripe if this is your car.
    """
    ctx.fillStyle = COLOR_INK
    ctx.fillRect(car["x"], car["y"], car["width"], car["height"])

    window_width = car["width"] - 14
    window_height = 14
    windscreen_y = car["y"] + 10 if is_player else car["y"] + car["height"] - 10 - window_height
    rear_window_y = car["y"] + car["height"] - 16 - window_height if is_player else car["y"] + 16

    ctx.fillStyle = COLOR_PAINT
    ctx.fillRect(car["x"] + 7, windscreen_y, window_width, window_height)
    ctx.fillRect(car["x"] + 7, rear_window_y, window_width, window_height - 4)

    if is_player:
        ctx.fillRect(car["x"] + car["width"] / 2 - 3, car["y"] + 28, 6, 13)

    ctx.fillRect(car["x"] + 1, car["y"] + 14, 3, 12)
    ctx.fillRect(car["x"] + car["width"] - 4, car["y"] + 14, 3, 12)
    ctx.fillRect(car["x"] + 1, car["y"] + car["height"] - 26, 3, 12)
    ctx.fillRect(car["x"] + car["width"] - 4, car["y"] + car["height"] - 26, 3, 12)


def draw_frame(ctx, width, height):
    """The thick black border around the picture."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 3
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3)


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the road."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / 300
    title_size = max(14, round(30 * scale))
    subtitle_size = max(9, round(14 * scale))

    ctx.font = "bold " + str(title_size) + "px monospace"
    ctx.fillText(title, width / 2, height / 2 - 8)
    ctx.font = str(subtitle_size) + "px monospace"
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)


def render_game(ctx, state):
    """Draw one complete frame of the race."""
    draw_road(ctx, state["stripe_offset"])

    for car in state["cars"]:
        draw_car(ctx, car, False)
    draw_car(ctx, state["player"], True)

    draw_frame(ctx, ROAD_WIDTH, ROAD_HEIGHT)

    if state["is_over"]:
        draw_message(ctx, ROAD_WIDTH, ROAD_HEIGHT, "CRASH!", "Press R or tap New to race again")
    elif state["is_paused"]:
        draw_message(ctx, ROAD_WIDTH, ROAD_HEIGHT, "READY?", "Press P or tap Go to start")
