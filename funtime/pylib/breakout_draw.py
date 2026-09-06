"""breakout_draw.py - everything you can see in Breakout, in Python.

Black and white: a brick is an outlined box with a solid bar inside it, and the
bar is thicker the higher up the wall the brick is.
"""

import math

from breakout_rules import (FIELD_WIDTH, FIELD_HEIGHT, BRICK_COLUMNS, BRICK_ROWS,
                            BALL_RADIUS, PADDLE_Y, PADDLE_HEIGHT,
                            brick_index, brick_rect, paddle_rect)

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#d8d8d8"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the playing field."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def draw_brick(ctx, column, row):
    """One brick.

    ALGORITHM: an outlined box with a solid bar inside it. The bar's height
    comes from the row, so five kinds of brick are visible in two colours.
    """
    rect = brick_rect(column, row)
    fill_height = (rect["height"] - 6) * (BRICK_ROWS - row) / BRICK_ROWS

    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(rect["x"], rect["y"], rect["width"], rect["height"])
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(rect["x"] + 1, rect["y"] + 1, rect["width"] - 2, rect["height"] - 2)

    ctx.fillStyle = COLOR_INK
    ctx.fillRect(rect["x"] + 4, rect["y"] + 3, rect["width"] - 8, fill_height)


def draw_paddle(ctx, state):
    """The bat along the bottom."""
    rect = paddle_rect(state)
    ctx.fillStyle = COLOR_INK
    ctx.fillRect(rect["x"], rect["y"], rect["width"], rect["height"])
    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(rect["x"] + rect["width"] / 2 - 6, rect["y"] + 4, 12, rect["height"] - 8)


def draw_ball(ctx, ball):
    """A filled circle with a white highlight, so it reads as a ball."""
    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(ball["x"], ball["y"], BALL_RADIUS, 0, math.pi * 2)
    ctx.fill()
    ctx.fillStyle = COLOR_PAPER
    ctx.beginPath()
    ctx.arc(ball["x"] - 2, ball["y"] - 2, BALL_RADIUS / 3, 0, math.pi * 2)
    ctx.fill()


def draw_lives(ctx, state):
    """One small circle per life left, and the score in the other corner."""
    ctx.fillStyle = COLOR_INK
    for i in range(state["lives"]):
        ctx.beginPath()
        ctx.arc(14 + i * 16, 18, 5, 0, math.pi * 2)
        ctx.fill()
    ctx.font = "12px monospace"
    ctx.textAlign = "right"
    ctx.fillText(str(state["score"]), FIELD_WIDTH - 12, 22)
    ctx.textAlign = "left"


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the field."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(0, height / 2 - 46, width, 92)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / FIELD_WIDTH
    title_size = max(14, round(28 * scale))
    subtitle_size = max(9, round(13 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 4)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)

    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, PADDLE_Y + PADDLE_HEIGHT + 8)
    ctx.lineTo(FIELD_WIDTH, PADDLE_Y + PADDLE_HEIGHT + 8)
    ctx.stroke()

    for row in range(BRICK_ROWS):
        for column in range(BRICK_COLUMNS):
            if state["bricks"][brick_index(column, row)]:
                draw_brick(ctx, column, row)

    draw_paddle(ctx, state)
    draw_ball(ctx, state["ball"])
    draw_lives(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"] and state["is_won"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "YOU WIN!",
                     "%d points - press R" % state["score"])
    elif state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "GAME OVER",
                     "%d points - press R" % state["score"])
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "READY?", "Press SPACE to launch the ball")
