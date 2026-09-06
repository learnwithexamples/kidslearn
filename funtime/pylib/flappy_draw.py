"""flappy_draw.py - everything you can see in Flappy, in Python."""

import math

from flappy_rules import (FIELD_WIDTH, FIELD_HEIGHT, GROUND_Y, BIRD_X, BIRD_SIZE,
                          PIPE_WIDTH, GAP_HEIGHT, pipe_rects)

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#d8d8d8"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the sky."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def draw_sky(ctx, offset):
    """Faint clouds, so the pipes have something to slide past."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 2
    for i in range(4):
        x = ((i * 90) - (offset % 360) + 360) % 360 - 30
        y = 40 + (i % 3) * 70
        ctx.beginPath()
        ctx.arc(x, y, 14, math.pi * 0.9, math.pi * 2.1)
        ctx.arc(x + 18, y - 4, 17, math.pi * 0.9, math.pi * 2.1)
        ctx.arc(x + 36, y, 13, math.pi * 0.9, math.pi * 2.1)
        ctx.stroke()


def draw_ground(ctx, offset):
    """The striped floor the bird must not touch."""
    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(0, GROUND_Y, FIELD_WIDTH, FIELD_HEIGHT - GROUND_Y)
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(FIELD_WIDTH, GROUND_Y)
    ctx.stroke()

    ctx.lineWidth = 1
    x = -20
    while x < FIELD_WIDTH + 20:
        slid = x - (offset % 14)
        ctx.beginPath()
        ctx.moveTo(slid, GROUND_Y + 4)
        ctx.lineTo(slid + 10, FIELD_HEIGHT - 4)
        ctx.stroke()
        x += 14


def draw_pipe(ctx, pipe):
    """One pipe, both halves, with a thick lip beside the gap."""
    rects = pipe_rects(pipe)
    for rect in (rects["top"], rects["bottom"]):
        if rect["height"] <= 0:
            continue
        ctx.fillStyle = COLOR_PAPER
        ctx.fillRect(rect["x"], rect["y"], rect["width"], rect["height"])
        ctx.strokeStyle = COLOR_INK
        ctx.lineWidth = 2
        ctx.strokeRect(rect["x"] + 1, rect["y"] + 1, rect["width"] - 2, rect["height"] - 2)

        ctx.lineWidth = 1
        y = rect["y"] + 6
        while y < rect["y"] + rect["height"] - 4:
            ctx.beginPath()
            ctx.moveTo(rect["x"] + 5, y)
            ctx.lineTo(rect["x"] + rect["width"] - 5, y)
            ctx.stroke()
            y += 9

    ctx.fillStyle = COLOR_INK
    ctx.fillRect(pipe["x"] - 3, pipe["gap_y"] - 12, PIPE_WIDTH + 6, 12)
    ctx.fillRect(pipe["x"] - 3, pipe["gap_y"] + GAP_HEIGHT, PIPE_WIDTH + 6, 12)


def draw_bird(ctx, bird):
    """The bird: a circle with a beak, tipped by how fast it is moving."""
    x = BIRD_X + BIRD_SIZE / 2
    y = bird["y"] + BIRD_SIZE / 2
    tilt = max(-0.5, min(0.9, bird["dy"] / 500))

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(tilt)

    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, math.pi * 2)
    ctx.fill()

    ctx.fillStyle = COLOR_PAPER
    ctx.beginPath()
    ctx.arc(3, -3, 4, 0, math.pi * 2)
    ctx.fill()
    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(4, -3, 1.8, 0, math.pi * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(BIRD_SIZE / 2 - 2, 1)
    ctx.lineTo(BIRD_SIZE / 2 + 7, 4)
    ctx.lineTo(BIRD_SIZE / 2 - 2, 7)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = COLOR_PAPER
    ctx.beginPath()
    ctx.ellipse(-3, 2, 6, 4, -0.3, 0, math.pi * 2)
    ctx.fill()
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.restore()


def draw_score(ctx, state):
    """The big number at the top."""
    ctx.fillStyle = COLOR_INK
    ctx.font = "bold 30px monospace"
    ctx.textAlign = "center"
    ctx.fillText(str(state["score"]), FIELD_WIDTH / 2, 46)
    ctx.textAlign = "left"


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the sky."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(0, height / 2 - 46, width, 92)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / FIELD_WIDTH
    title_size = max(14, round(26 * scale))
    subtitle_size = max(9, round(12 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 4)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    scrolled = state.get("scrolled", 0)
    draw_sky(ctx, scrolled)

    for pipe in state["pipes"]:
        draw_pipe(ctx, pipe)

    draw_ground(ctx, scrolled)
    draw_bird(ctx, state["bird"])
    draw_score(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "CRASH!",
                     "%d pipes - press R to try again" % state["score"])
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "READY?", "Press SPACE to flap")
