"""simon_draw.py - everything you can see in Simon Says, in Python."""

import math

from simon_rules import PAD_COUNT

PAD_SIZE = 130
PAD_GAP = 10
BOARD_MARGIN = 12

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"


def board_pixel_size():
    """How big the square canvas must be."""
    return BOARD_MARGIN * 2 + PAD_SIZE * 2 + PAD_GAP


def pad_left(pad):
    """The left edge of one pad. Pads are numbered 0,1 on top and 2,3 below."""
    return BOARD_MARGIN + (pad % 2) * (PAD_SIZE + PAD_GAP)


def pad_top(pad):
    """The top edge of one pad."""
    return BOARD_MARGIN + (pad // 2) * (PAD_SIZE + PAD_GAP)


def pad_at_pixel(x, y):
    """Which pad did the player press? -1 for a miss."""
    for pad in range(PAD_COUNT):
        if pad_left(pad) <= x <= pad_left(pad) + PAD_SIZE and pad_top(pad) <= y <= pad_top(pad) + PAD_SIZE:
            return pad
    return -1


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_pad(ctx, pad, is_lit):
    """One pad, lit (solid black) or dark (white with a black border).

    Each pad also shows a different number of dots, so they can be told apart
    without any colour at all.
    """
    x = pad_left(pad)
    y = pad_top(pad)

    ctx.fillStyle = COLOR_INK if is_lit else COLOR_PAPER
    ctx.fillRect(x, y, PAD_SIZE, PAD_SIZE)
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 4
    ctx.strokeRect(x + 2, y + 2, PAD_SIZE - 4, PAD_SIZE - 4)

    ctx.fillStyle = COLOR_PAPER if is_lit else COLOR_INK
    for dot in range(pad + 1):
        ctx.beginPath()
        ctx.arc(x + PAD_SIZE / 2 - pad * 9 + dot * 18, y + PAD_SIZE / 2, 7, 0, math.pi * 2)
        ctx.fill()

    ctx.textAlign = "center"
    ctx.font = "bold 20px monospace"
    ctx.fillText(str(pad + 1), x + PAD_SIZE - 20, y + PAD_SIZE - 14)


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the pads."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / 294
    title_size = max(14, round(30 * scale))
    subtitle_size = max(9, round(14 * scale))

    ctx.font = "bold " + str(title_size) + "px monospace"
    ctx.fillText(title, width / 2, height / 2 - 8)
    ctx.font = str(subtitle_size) + "px monospace"
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)


def render_game(ctx, state):
    """Draw one complete frame."""
    size = board_pixel_size()
    clear_canvas(ctx, size, size, COLOR_PAPER)

    for pad in range(PAD_COUNT):
        draw_pad(ctx, pad, state["lit"] == pad)

    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"
    ctx.font = "bold 16px monospace"
    if state["phase"] == "watch":
        label = "WATCH..."
    elif state["phase"] == "play":
        label = "YOUR TURN - %d/%d" % (len(state["input"]), len(state["sequence"]))
    else:
        label = ""
    ctx.fillText(label, size / 2, BOARD_MARGIN - 1)

    if state["is_over"]:
        draw_message(ctx, size, size, "WRONG PAD",
                     "You reached round %d - press R to try again" % state["round"])
    elif state["is_paused"]:
        draw_message(ctx, size, size, "PAUSED", "Press P or tap Play to carry on")
