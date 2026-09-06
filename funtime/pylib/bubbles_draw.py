"""bubbles_draw.py - everything you can see in Bubble Shooter, in Python.

Five kinds of bubble, told apart by their PATTERN rather than their colour:
solid, plain ring, ring with a dot, striped, and crossed.
"""

import math

from bubbles_rules import (COLUMNS, ROWS, CELL, BUBBLE_RADIUS, GRID_HEIGHT,
                           FIELD_WIDTH, FIELD_HEIGHT, SHOOTER_X, SHOOTER_Y,
                           EMPTY, bubble_index, bubble_centre)

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#e0e0e0"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the field."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def draw_bubble(ctx, kind, x, y):
    """One bubble, drawn by its kind.

    ALGORITHM: every bubble is the same circle; the pattern inside is what
    tells them apart, so the game needs no colour at all.
    """
    r = BUBBLE_RADIUS

    ctx.fillStyle = COLOR_PAPER
    ctx.beginPath()
    ctx.arc(x, y, r, 0, math.pi * 2)
    ctx.fill()
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = COLOR_INK
    ctx.strokeStyle = COLOR_INK

    if kind == 0:                       # solid
        ctx.beginPath()
        ctx.arc(x, y, r - 3, 0, math.pi * 2)
        ctx.fill()

    elif kind == 1:                     # plain ring - nothing inside
        return

    elif kind == 2:                     # a dot in the middle
        ctx.beginPath()
        ctx.arc(x, y, r / 2.4, 0, math.pi * 2)
        ctx.fill()

    elif kind == 3:                     # stripes
        ctx.lineWidth = 1.6
        for i in (-1, 0, 1):
            offset = i * 4
            reach = math.sqrt(max(0, (r - 3) ** 2 - offset ** 2))
            ctx.beginPath()
            ctx.moveTo(x - reach, y + offset)
            ctx.lineTo(x + reach, y + offset)
            ctx.stroke()

    else:                               # a cross
        ctx.lineWidth = 2
        reach = (r - 3) * 0.72
        ctx.beginPath()
        ctx.moveTo(x - reach, y - reach)
        ctx.lineTo(x + reach, y + reach)
        ctx.moveTo(x + reach, y - reach)
        ctx.lineTo(x - reach, y + reach)
        ctx.stroke()


def draw_ceiling(ctx):
    """The line the bubbles hang from."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 1.5)
    ctx.lineTo(FIELD_WIDTH, 1.5)
    ctx.stroke()


def draw_danger_line(ctx):
    """How far down the bubbles are allowed to reach."""
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 2
    ctx.setLineDash([6, 5])
    ctx.beginPath()
    ctx.moveTo(0, GRID_HEIGHT - CELL)
    ctx.lineTo(FIELD_WIDTH, GRID_HEIGHT - CELL)
    ctx.stroke()
    ctx.setLineDash([])


def draw_shooter(ctx, state):
    """The aiming arrow and the bubble waiting in it."""
    reach = 46
    tip_x = SHOOTER_X + math.cos(state["angle"]) * reach
    tip_y = SHOOTER_Y + math.sin(state["angle"]) * reach

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    ctx.beginPath()
    ctx.moveTo(SHOOTER_X, SHOOTER_Y)
    ctx.lineTo(tip_x, tip_y)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.beginPath()
    ctx.arc(SHOOTER_X, SHOOTER_Y, BUBBLE_RADIUS + 4, 0, math.pi * 2)
    ctx.stroke()

    draw_bubble(ctx, state["holding"], SHOOTER_X, SHOOTER_Y)


def draw_next(ctx, state):
    """The bubble you will be given after this one."""
    ctx.fillStyle = COLOR_FAINT
    ctx.font = "10px monospace"
    ctx.textAlign = "left"
    ctx.fillText("NEXT", 8, SHOOTER_Y - 14)
    draw_bubble(ctx, state["next"], 20, SHOOTER_Y + 4)


def draw_score(ctx, state):
    """The score in the bottom corner."""
    ctx.fillStyle = COLOR_INK
    ctx.font = "bold 13px monospace"
    ctx.textAlign = "right"
    ctx.fillText(str(state["score"]), FIELD_WIDTH - 10, SHOOTER_Y + 4)
    ctx.textAlign = "left"


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the field."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
    ctx.fillRect(0, height / 2 - 42, width, 84)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / FIELD_WIDTH
    title_size = max(13, round(24 * scale))
    subtitle_size = max(9, round(11 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 2)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)
    draw_danger_line(ctx)

    for row in range(ROWS):
        for column in range(COLUMNS):
            kind = state["grid"][bubble_index(column, row)]
            if kind != EMPTY:
                centre = bubble_centre(column, row)
                draw_bubble(ctx, kind, centre["x"], centre["y"])

    draw_ceiling(ctx)

    if state["flying"]:
        draw_bubble(ctx, state["flying"]["kind"], state["flying"]["x"], state["flying"]["y"])

    if not state["is_over"]:
        draw_shooter(ctx, state)
    draw_next(ctx, state)
    draw_score(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "FULL UP!",
                     "%d points - press R" % state["score"])
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "PAUSED", "Press P to carry on")
