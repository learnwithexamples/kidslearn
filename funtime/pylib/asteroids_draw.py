"""asteroids_draw.py - everything you can see in Asteroids, in Python.

The original arcade machine drew with a beam that traced LINES rather than
filling in pixels, which is why everything in this game is an outline.
"""

import math

from asteroids_rules import (FIELD_WIDTH, FIELD_HEIGHT, SHIP_RADIUS,
                            ROCK_RADIUS, point_from)

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#dcdcdc"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round space."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def draw_stars(ctx):
    """A few faint dots so space is not just empty paper."""
    ctx.fillStyle = COLOR_FAINT
    for i in range(30):
        x = (i * 113) % (FIELD_WIDTH - 12) + 6
        y = (i * 71) % (FIELD_HEIGHT - 12) + 6
        ctx.fillRect(x, y, 2, 2)


def draw_ship(ctx, ship, thrusting):
    """An outlined triangle pointing the way it is going.

    ALGORITHM: three points worked out with point_from - the nose straight
    ahead, and two back corners a little over half a turn away on either side.
    """
    nose = point_from(ship["x"], ship["y"], ship["angle"], SHIP_RADIUS + 4)
    left = point_from(ship["x"], ship["y"], ship["angle"] + 2.5, SHIP_RADIUS)
    right = point_from(ship["x"], ship["y"], ship["angle"] - 2.5, SHIP_RADIUS)

    ctx.strokeStyle = COLOR_INK
    ctx.fillStyle = COLOR_PAPER
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(nose["x"], nose["y"])
    ctx.lineTo(left["x"], left["y"])
    ctx.lineTo(ship["x"], ship["y"])
    ctx.lineTo(right["x"], right["y"])
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    if thrusting:
        flame = point_from(ship["x"], ship["y"], ship["angle"] + math.pi, SHIP_RADIUS + 7)
        ctx.beginPath()
        ctx.moveTo(left["x"], left["y"])
        ctx.lineTo(flame["x"], flame["y"])
        ctx.lineTo(right["x"], right["y"])
        ctx.stroke()


def draw_shield(ctx, ship):
    """The dashed ring that means "you cannot be hit yet"."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.arc(ship["x"], ship["y"], SHIP_RADIUS + 7, 0, math.pi * 2)
    ctx.stroke()
    ctx.setLineDash([])


def draw_rock(ctx, rock):
    """A lumpy outlined circle.

    ALGORITHM: walk right round the circle in nine steps, pushing each point
    in or out a little. The wobble number decides how, so every rock is a
    different shape but always the same shape.
    """
    radius = ROCK_RADIUS[rock["size"]]
    points = 9

    ctx.strokeStyle = COLOR_INK
    ctx.fillStyle = COLOR_PAPER
    ctx.lineWidth = 2
    ctx.beginPath()
    for i in range(points):
        angle = i / points * math.pi * 2 + rock["wobble"]
        lumpy = radius * (0.78 + 0.22 * abs(math.sin(i * 2.3 + rock["wobble"])))
        spot = point_from(rock["x"], rock["y"], angle, lumpy)
        if i == 0:
            ctx.moveTo(spot["x"], spot["y"])
        else:
            ctx.lineTo(spot["x"], spot["y"])
    ctx.closePath()
    ctx.fill()
    ctx.stroke()


def draw_bullet(ctx, bullet):
    """A small solid dot."""
    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(bullet["x"], bullet["y"], 2.5, 0, math.pi * 2)
    ctx.fill()


def draw_status(ctx, state):
    """The score along the top and the lives beneath it."""
    ctx.fillStyle = COLOR_INK
    ctx.font = "bold 14px monospace"
    ctx.textAlign = "left"
    ctx.fillText(str(state["score"]), 10, 22)
    ctx.textAlign = "right"
    ctx.fillText("WAVE %d" % state["wave"], FIELD_WIDTH - 10, 22)
    ctx.textAlign = "left"

    for i in range(state["lives"]):
        x = 18 + i * 18
        ctx.strokeStyle = COLOR_INK
        ctx.lineWidth = 1.5
        nose = point_from(x, 40, -math.pi / 2, 7)
        left = point_from(x, 40, -math.pi / 2 + 2.5, 5)
        right = point_from(x, 40, -math.pi / 2 - 2.5, 5)
        ctx.beginPath()
        ctx.moveTo(nose["x"], nose["y"])
        ctx.lineTo(left["x"], left["y"])
        ctx.lineTo(right["x"], right["y"])
        ctx.closePath()
        ctx.stroke()


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across space."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)"
    ctx.fillRect(0, height / 2 - 42, width, 84)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / FIELD_WIDTH
    title_size = max(14, round(26 * scale))
    subtitle_size = max(9, round(12 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 2)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)
    draw_stars(ctx)

    for rock in state["rocks"]:
        draw_rock(ctx, rock)
    for bullet in state["bullets"]:
        draw_bullet(ctx, bullet)

    if not state["is_over"]:
        draw_ship(ctx, state["ship"], state["thrusting"])
        if state["shield"] > 0:
            draw_shield(ctx, state["ship"])

    draw_status(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "GAME OVER",
                     "%d points - press R" % state["score"])
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "PAUSED", "Press P to carry on")
