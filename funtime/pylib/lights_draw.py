"""lights_draw.py - everything you can see in Lights Out, in Python.

Black and white: a light that is ON is a black square with a white ring, and a
light that is OFF is white with a thin grey border.
"""

import math

from lights_rules import GRID_SIZE, light_index, is_on_board

CELL_SIZE = 64
CELL_GAP = 6
BOARD_MARGIN = 10

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#cccccc"


def board_pixel_size():
    """How big the square canvas must be."""
    return BOARD_MARGIN * 2 + GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_GAP


def cell_left(column):
    """The pixel position of a square's left edge."""
    return BOARD_MARGIN + column * (CELL_SIZE + CELL_GAP)


def cell_top(row):
    """The pixel position of a square's top edge."""
    return BOARD_MARGIN + row * (CELL_SIZE + CELL_GAP)


def square_at_pixel(x, y):
    """Which square did the player click on?

    INPUT:  x, y - canvas pixels. OUTPUT: (column, row), or None for a gap.
    """
    column = int((x - BOARD_MARGIN) // (CELL_SIZE + CELL_GAP))
    row = int((y - BOARD_MARGIN) // (CELL_SIZE + CELL_GAP))
    if not is_on_board(column, row):
        return None
    if x - cell_left(column) > CELL_SIZE or y - cell_top(row) > CELL_SIZE:
        return None
    return (column, row)


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_light(ctx, is_on, column, row):
    """One square, lit or dark."""
    x = cell_left(column)
    y = cell_top(row)

    if is_on:
        ctx.fillStyle = COLOR_INK
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        ctx.strokeStyle = COLOR_PAPER
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 4, 0, math.pi * 2)
        ctx.stroke()
    else:
        ctx.fillStyle = COLOR_PAPER
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        ctx.strokeStyle = COLOR_FAINT
        ctx.lineWidth = 2
        ctx.strokeRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2)


def draw_cursor(ctx, cursor):
    """The dashed box showing where the keyboard cursor is."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 4
    ctx.setLineDash([8, 6])
    ctx.strokeRect(cell_left(cursor["column"]) - 4, cell_top(cursor["row"]) - 4,
                   CELL_SIZE + 8, CELL_SIZE + 8)
    ctx.setLineDash([])


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / 370
    title_size = max(14, round(32 * scale))
    subtitle_size = max(9, round(15 * scale))

    ctx.font = "bold " + str(title_size) + "px monospace"
    ctx.fillText(title, width / 2, height / 2 - 8)
    ctx.font = str(subtitle_size) + "px monospace"
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)


def render_game(ctx, state):
    """Draw one complete frame."""
    size = board_pixel_size()
    clear_canvas(ctx, size, size, COLOR_PAPER)

    for row in range(GRID_SIZE):
        for column in range(GRID_SIZE):
            draw_light(ctx, state["lights"][light_index(column, row)], column, row)

    if not state["is_over"]:
        draw_cursor(ctx, state["cursor"])

    if state["is_over"]:
        draw_message(ctx, size, size, "ALL OUT!", "Solved in %d presses" % state["moves"])
    elif state["is_paused"]:
        draw_message(ctx, size, size, "PAUSED", "Press P or tap Play to carry on")
