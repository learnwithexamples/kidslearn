"""invaders_draw.py - everything you can see in Space Invaders, in Python."""

import math

from invaders_rules import (FIELD_WIDTH, FIELD_HEIGHT, ALIEN_WIDTH,
                            alien_rect, ship_rect, bullet_rect)

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
    for i in range(26):
        x = (i * 97) % (FIELD_WIDTH - 12) + 6
        y = (i * 61) % (FIELD_HEIGHT - 60) + 8
        ctx.fillRect(x, y, 2, 2)


def draw_alien(ctx, alien, state):
    """One alien.

    ALGORITHM: a body plus two legs, with the head shape decided by the row -
    round for the back row, square for the middle, spiky for the front.
    Different shapes, one colour.
    """
    rect = alien_rect(alien, state)
    middle_x = rect["x"] + rect["width"] / 2

    ctx.fillStyle = COLOR_INK

    if alien["row"] == 0:
        ctx.beginPath()
        ctx.arc(middle_x, rect["y"] + 8, 8, math.pi, 0)
        ctx.fill()
        ctx.fillRect(rect["x"] + 3, rect["y"] + 8, rect["width"] - 6, 5)
    elif alien["row"] == 1:
        ctx.fillRect(rect["x"] + 4, rect["y"] + 2, rect["width"] - 8, 11)
    else:
        ctx.beginPath()
        ctx.moveTo(middle_x, rect["y"] + 1)
        ctx.lineTo(rect["x"] + rect["width"] - 3, rect["y"] + 12)
        ctx.lineTo(rect["x"] + 3, rect["y"] + 12)
        ctx.closePath()
        ctx.fill()

    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(middle_x - 5, rect["y"] + 6, 3, 3)
    ctx.fillRect(middle_x + 2, rect["y"] + 6, 3, 3)

    ctx.fillStyle = COLOR_INK
    ctx.fillRect(rect["x"] + 2, rect["y"] + 13, 4, 5)
    ctx.fillRect(rect["x"] + rect["width"] - 6, rect["y"] + 13, 4, 5)


def draw_ship(ctx, state):
    """The player's ship: a block with a gun barrel on top."""
    rect = ship_rect(state)
    ctx.fillStyle = COLOR_INK
    ctx.fillRect(rect["x"], rect["y"] + 5, rect["width"], rect["height"] - 5)
    ctx.fillRect(rect["x"] + rect["width"] / 2 - 3, rect["y"], 6, 7)
    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(rect["x"] + 4, rect["y"] + 8, 4, 3)
    ctx.fillRect(rect["x"] + rect["width"] - 8, rect["y"] + 8, 4, 3)


def draw_shot(ctx, shot, hollow):
    """A bullet or a bomb. Bombs are drawn hollow so they differ."""
    rect = bullet_rect(shot)
    if hollow:
        ctx.strokeStyle = COLOR_INK
        ctx.lineWidth = 2
        ctx.strokeRect(rect["x"] - 1, rect["y"], rect["width"] + 2, rect["height"])
    else:
        ctx.fillStyle = COLOR_INK
        ctx.fillRect(rect["x"], rect["y"], rect["width"], rect["height"])


def draw_status(ctx, state):
    """The score along the top and the lives along the bottom."""
    ctx.fillStyle = COLOR_INK
    ctx.font = "bold 13px monospace"
    ctx.textAlign = "left"
    ctx.fillText("SCORE %d" % state["score"], 8, 20)
    ctx.textAlign = "right"
    ctx.fillText("WAVE %d" % state["wave"], FIELD_WIDTH - 8, 20)
    ctx.textAlign = "left"

    for i in range(state["lives"]):
        ctx.fillRect(8 + i * 16, FIELD_HEIGHT - 12, 11, 5)
        ctx.fillRect(11 + i * 16, FIELD_HEIGHT - 15, 5, 3)


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

    for alien in state["aliens"]:
        if alien["alive"]:
            draw_alien(ctx, alien, state)

    for bullet in state["bullets"]:
        draw_shot(ctx, bullet, False)
    for bomb in state["bombs"]:
        draw_shot(ctx, bomb, True)

    draw_ship(ctx, state)
    draw_status(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "GAME OVER",
                     "%d points - press R" % state["score"])
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "PAUSED", "Press P to carry on")
