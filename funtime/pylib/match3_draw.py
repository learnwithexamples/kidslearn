"""match3_draw.py - everything you can see in Match Three, in Python.

Six different SHAPES, not six colours - a circle, a square, a triangle, a
diamond, a star and a cross. That way the game works in black and white, and
it works for a colour-blind player too.
"""

import math

from match3_rules import GRID_SIZE, EMPTY, gem_index, is_inside_board

CELL = 34
BOARD_MARGIN = 8

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#e2e2e2"


def board_pixel_size():
    """How big the square canvas must be."""
    return BOARD_MARGIN * 2 + GRID_SIZE * CELL


def cell_left(column):
    """The left edge of one square."""
    return BOARD_MARGIN + column * CELL


def cell_top(row):
    """The top edge of one square."""
    return BOARD_MARGIN + row * CELL


def cell_at_pixel(x, y):
    """Which square did the player click? (column, row), or None."""
    column = int((x - BOARD_MARGIN) // CELL)
    row = int((y - BOARD_MARGIN) // CELL)
    if not is_inside_board(column, row):
        return None
    return (column, row)


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_shape(ctx, shape, x, y, size):
    """One of the six shapes, drawn in the middle of a square.

    ALGORITHM: one branch per shape. Shapes 0, 2 and 4 are solid and 1, 3 and
    5 are outlines, so even two similar shapes never look alike.
    """
    r = size / 2
    ctx.strokeStyle = COLOR_INK
    ctx.fillStyle = COLOR_INK
    ctx.lineWidth = 2.5

    if shape == 0:                      # solid circle
        ctx.beginPath()
        ctx.arc(x, y, r, 0, math.pi * 2)
        ctx.fill()

    elif shape == 1:                    # hollow square
        ctx.strokeRect(x - r, y - r, r * 2, r * 2)

    elif shape == 2:                    # solid triangle
        ctx.beginPath()
        ctx.moveTo(x, y - r)
        ctx.lineTo(x + r, y + r)
        ctx.lineTo(x - r, y + r)
        ctx.closePath()
        ctx.fill()

    elif shape == 3:                    # hollow diamond
        ctx.beginPath()
        ctx.moveTo(x, y - r)
        ctx.lineTo(x + r, y)
        ctx.lineTo(x, y + r)
        ctx.lineTo(x - r, y)
        ctx.closePath()
        ctx.stroke()

    elif shape == 4:                    # solid star
        ctx.beginPath()
        for point in range(10):
            reach = r if point % 2 == 0 else r * 0.45
            angle = -math.pi / 2 + point * math.pi / 5
            px = x + math.cos(angle) * reach
            py = y + math.sin(angle) * reach
            if point == 0:
                ctx.moveTo(px, py)
            else:
                ctx.lineTo(px, py)
        ctx.closePath()
        ctx.fill()

    else:                               # hollow cross
        ctx.beginPath()
        ctx.moveTo(x - r, y - r)
        ctx.lineTo(x + r, y + r)
        ctx.moveTo(x + r, y - r)
        ctx.lineTo(x - r, y + r)
        ctx.stroke()


def draw_grid(ctx):
    """The faint lines between the squares."""
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 1
    for i in range(GRID_SIZE + 1):
        ctx.beginPath()
        ctx.moveTo(BOARD_MARGIN + i * CELL, BOARD_MARGIN)
        ctx.lineTo(BOARD_MARGIN + i * CELL, BOARD_MARGIN + GRID_SIZE * CELL)
        ctx.moveTo(BOARD_MARGIN, BOARD_MARGIN + i * CELL)
        ctx.lineTo(BOARD_MARGIN + GRID_SIZE * CELL, BOARD_MARGIN + i * CELL)
        ctx.stroke()


def draw_picked(ctx, square):
    """The heavy box round the shape waiting to be swapped."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 3
    ctx.strokeRect(cell_left(square["column"]) + 2, cell_top(square["row"]) + 2,
                   CELL - 4, CELL - 4)


def draw_cursor(ctx, cursor):
    """The dashed box showing where the keyboard is pointing."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.setLineDash([4, 3])
    ctx.strokeRect(cell_left(cursor["column"]) + 4, cell_top(cursor["row"]) + 4,
                   CELL - 8, CELL - 8)
    ctx.setLineDash([])


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
    ctx.fillRect(0, height / 2 - 40, width, 80)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / board_pixel_size()
    title_size = max(14, round(26 * scale))
    subtitle_size = max(9, round(12 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 2)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    size = board_pixel_size()
    clear_canvas(ctx, size, size, COLOR_PAPER)
    draw_grid(ctx)

    for row in range(GRID_SIZE):
        for column in range(GRID_SIZE):
            shape = state["board"][gem_index(column, row)]
            if shape != EMPTY:
                draw_shape(ctx, shape, cell_left(column) + CELL / 2,
                           cell_top(row) + CELL / 2, CELL - 16)

    if state["picked"]:
        draw_picked(ctx, state["picked"])
    if not state["is_over"]:
        draw_cursor(ctx, state["cursor"])

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(BOARD_MARGIN - 1, BOARD_MARGIN - 1,
                   GRID_SIZE * CELL + 2, GRID_SIZE * CELL + 2)

    if state["is_paused"]:
        draw_message(ctx, size, size, "PAUSED", "Press P to carry on")
