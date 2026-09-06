"""floors_draw.py - everything you can see in Hundred Floors, in Python.

Six kinds of platform, told apart by their PATTERN rather than by colour: a
plain bar, a bar with 锯齿 sawteeth on top, arrows for the sliding ones, a coil
for the spring, and a broken dashed bar for the one about to give way.

Everything is drawn through screen_y, because the world stays still and the
camera is what moves.
"""

import math

from floors_rules import (FIELD_WIDTH, FIELD_HEIGHT, CEILING_HEIGHT,
                          PLAYER_WIDTH, PLATFORM_WIDTH, PLATFORM_HEIGHT,
                          MAX_HEALTH, PLAIN, SPIKED, SLIDE_LEFT, SLIDE_RIGHT,
                          SPRING, CRUMBLING, screen_y)

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#d6d6d6"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the shaft."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def draw_sawteeth(ctx, x, y, width, height, pointing_up):
    """A row of 锯齿, the spikes that cost you blood.

    ALGORITHM: walk along in steps, drawing a triangle each time. The same
    function draws the platform spikes and the ceiling ones - the only
    difference is which way up they point.
    """
    step = 8
    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    at = 0
    while at + step <= width:
        if pointing_up:
            ctx.moveTo(x + at, y)
            ctx.lineTo(x + at + step / 2, y - height)
            ctx.lineTo(x + at + step, y)
        else:
            ctx.moveTo(x + at, y)
            ctx.lineTo(x + at + step / 2, y + height)
            ctx.lineTo(x + at + step, y)
        ctx.closePath()
        at += step
    ctx.fill()


def draw_ceiling(ctx):
    """The spiked lid of the shaft, which you do not want to touch."""
    ctx.fillStyle = COLOR_INK
    ctx.fillRect(0, 0, FIELD_WIDTH, CEILING_HEIGHT - 8)
    draw_sawteeth(ctx, 0, CEILING_HEIGHT - 8, FIELD_WIDTH, 8, False)


def draw_platform(ctx, state, platform):
    """One platform, drawn by its kind."""
    x = platform["x"]
    y = screen_y(state, platform["y"])
    w = PLATFORM_WIDTH
    h = PLATFORM_HEIGHT

    if platform["kind"] == CRUMBLING:
        # a broken bar, and it fades as it gives way
        ctx.strokeStyle = COLOR_FAINT if platform["crumbling"] > 0 else COLOR_INK
        ctx.lineWidth = 3
        ctx.setLineDash([7, 5])
        ctx.beginPath()
        ctx.moveTo(x, y + h / 2)
        ctx.lineTo(x + w, y + h / 2)
        ctx.stroke()
        ctx.setLineDash([])
        return

    ctx.fillStyle = COLOR_INK
    ctx.fillRect(x, y, w, h)

    if platform["kind"] == SPIKED:
        draw_sawteeth(ctx, x, y, w, 9, True)

    elif platform["kind"] in (SLIDE_LEFT, SLIDE_RIGHT):
        points_right = platform["kind"] == SLIDE_RIGHT
        ctx.fillStyle = COLOR_PAPER
        for i in range(3):
            at = x + 12 + i * 18
            ctx.beginPath()
            if points_right:
                ctx.moveTo(at, y + 2)
                ctx.lineTo(at + 7, y + h / 2)
                ctx.lineTo(at, y + h - 2)
            else:
                ctx.moveTo(at + 7, y + 2)
                ctx.lineTo(at, y + h / 2)
                ctx.lineTo(at + 7, y + h - 2)
            ctx.closePath()
            ctx.fill()

    elif platform["kind"] == SPRING:
        ctx.strokeStyle = COLOR_INK
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x + 10, y)
        for i in range(5):
            ctx.lineTo(x + 14 + i * 8, y - (8 if i % 2 == 0 else 0))
        ctx.stroke()


def draw_player(ctx, state):
    """The little person.

    ALGORITHM: a head, a body and two legs, with the legs apart while falling
    and together while standing, so you can see at a glance whether you are
    safely on something.
    """
    player = state["player"]
    x = player["x"]
    y = screen_y(state, player["y"])
    middle = x + PLAYER_WIDTH / 2

    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(middle, y + 6, 6, 0, math.pi * 2)
    ctx.fill()
    ctx.fillRect(middle - 5, y + 12, 10, 8)

    apart = 2 if player["riding"] else 5
    ctx.fillRect(middle - apart - 2, y + 20, 3, 4)
    ctx.fillRect(middle + apart - 1, y + 20, 3, 4)

    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(middle - 3, y + 4, 2, 2)
    ctx.fillRect(middle + 1, y + 4, 2, 2)


def draw_health(ctx, state):
    """The blood bar: one block per point left."""
    left = 10
    top = FIELD_HEIGHT - 22
    box = 11

    ctx.font = "bold 9px monospace"
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "left"
    ctx.fillText("BLOOD", left, top - 5)

    for i in range(MAX_HEALTH):
        x = left + i * (box + 2)
        ctx.strokeStyle = COLOR_INK
        ctx.lineWidth = 1.5
        ctx.strokeRect(x, top, box, box)
        if i < state["health"]:
            ctx.fillStyle = COLOR_INK
            ctx.fillRect(x + 2, top + 2, box - 4, box - 4)


def draw_floor(ctx, state):
    """How far down you have got."""
    ctx.fillStyle = COLOR_INK
    ctx.font = "bold 15px monospace"
    ctx.textAlign = "right"
    ctx.fillText("FLOOR %d" % state["floor"], FIELD_WIDTH - 8, FIELD_HEIGHT - 10)
    ctx.textAlign = "left"


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the shaft."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
    ctx.fillRect(0, height / 2 - 42, width, 84)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / FIELD_WIDTH
    title_size = max(13, round(26 * scale))
    subtitle_size = max(9, round(12 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 2)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)

    # the walls of the shaft, so it is obvious you cannot leave sideways
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(2, 0)
    ctx.lineTo(2, FIELD_HEIGHT)
    ctx.moveTo(FIELD_WIDTH - 2, 0)
    ctx.lineTo(FIELD_WIDTH - 2, FIELD_HEIGHT)
    ctx.stroke()

    for platform in state["platforms"]:
        draw_platform(ctx, state, platform)

    draw_player(ctx, state)
    draw_ceiling(ctx)
    draw_health(ctx, state)
    draw_floor(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"]:
        why = "NO BLOOD LEFT" if state["health"] <= 0 else "YOU MISSED!"
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, why,
                     "floor %d - press R to try again" % state["floor"])
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "PAUSED", "Press P to carry on")
