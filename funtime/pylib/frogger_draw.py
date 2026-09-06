"""frogger_draw.py - everything you can see in Frogger, in Python."""

import math

from frogger_rules import (COLUMNS, ROWS, CELL, FIELD_WIDTH, FIELD_HEIGHT,
                           is_lane, lane_direction, car_rect, frog_rect)

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#d5d5d5"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the road."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def draw_safe_row(ctx, row):
    """A hatched strip: the banks and the island in the middle."""
    y = row * CELL
    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(0, y, FIELD_WIDTH, CELL)
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 1
    x = -CELL
    while x < FIELD_WIDTH + CELL:
        ctx.beginPath()
        ctx.moveTo(x, y + CELL)
        ctx.lineTo(x + CELL, y)
        ctx.stroke()
        x += 8
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(FIELD_WIDTH, y)
    ctx.moveTo(0, y + CELL)
    ctx.lineTo(FIELD_WIDTH, y + CELL)
    ctx.stroke()


def draw_lane(ctx, row):
    """A plain road row with a faint dashed centre line."""
    y = row * CELL
    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(0, y, FIELD_WIDTH, CELL)
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 2
    ctx.setLineDash([7, 7])
    ctx.beginPath()
    ctx.moveTo(0, y + CELL / 2)
    ctx.lineTo(FIELD_WIDTH, y + CELL / 2)
    ctx.stroke()
    ctx.setLineDash([])


def draw_car(ctx, car):
    """One vehicle: an outlined box with wheels and a solid nose at the front."""
    rect = car_rect(car)
    facing_right = lane_direction(car["row"]) == 1

    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(rect["x"], rect["y"], rect["width"], rect["height"])
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(rect["x"] + 1, rect["y"] + 1, rect["width"] - 2, rect["height"] - 2)

    ctx.fillStyle = COLOR_INK
    nose_x = rect["x"] + rect["width"] - 8 if facing_right else rect["x"] + 2
    ctx.fillRect(nose_x, rect["y"] + 3, 6, rect["height"] - 6)

    ctx.fillRect(rect["x"] + 6, rect["y"] - 2, 7, 4)
    ctx.fillRect(rect["x"] + rect["width"] - 13, rect["y"] - 2, 7, 4)
    ctx.fillRect(rect["x"] + 6, rect["y"] + rect["height"] - 2, 7, 4)
    ctx.fillRect(rect["x"] + rect["width"] - 13, rect["y"] + rect["height"] - 2, 7, 4)


def draw_frog(ctx, frog):
    """The frog: a black body with white eyes and four little legs."""
    rect = frog_rect(frog)
    middle_x = rect["x"] + rect["width"] / 2
    middle_y = rect["y"] + rect["height"] / 2

    ctx.fillStyle = COLOR_INK
    ctx.fillRect(rect["x"] - 2, rect["y"] + 3, 4, 6)
    ctx.fillRect(rect["x"] + rect["width"] - 2, rect["y"] + 3, 4, 6)
    ctx.fillRect(rect["x"] - 2, rect["y"] + rect["height"] - 9, 4, 6)
    ctx.fillRect(rect["x"] + rect["width"] - 2, rect["y"] + rect["height"] - 9, 4, 6)

    ctx.beginPath()
    ctx.ellipse(middle_x, middle_y, rect["width"] / 2, rect["height"] / 2, 0, 0, math.pi * 2)
    ctx.fill()

    ctx.fillStyle = COLOR_PAPER
    ctx.beginPath()
    ctx.arc(middle_x - 5, middle_y - 4, 3.4, 0, math.pi * 2)
    ctx.arc(middle_x + 5, middle_y - 4, 3.4, 0, math.pi * 2)
    ctx.fill()
    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(middle_x - 5, middle_y - 4, 1.4, 0, math.pi * 2)
    ctx.arc(middle_x + 5, middle_y - 4, 1.4, 0, math.pi * 2)
    ctx.fill()


def draw_lives(ctx, state):
    """One small frog head per life, on the home bank."""
    ctx.fillStyle = COLOR_INK
    for i in range(state["lives"]):
        ctx.beginPath()
        ctx.arc(12 + i * 15, 16, 5, 0, math.pi * 2)
        ctx.fill()
    ctx.font = "bold 13px monospace"
    ctx.textAlign = "right"
    ctx.fillText("HOME", FIELD_WIDTH - 8, 20)
    ctx.textAlign = "left"


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the road."""
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

    for row in range(ROWS):
        if is_lane(row):
            draw_lane(ctx, row)
        else:
            draw_safe_row(ctx, row)

    for car in state["cars"]:
        draw_car(ctx, car)

    draw_frog(ctx, state["frog"])
    draw_lives(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "SQUASHED!",
                     "%d crossings - press R" % state["crossings"])
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "PAUSED", "Press P to carry on")
