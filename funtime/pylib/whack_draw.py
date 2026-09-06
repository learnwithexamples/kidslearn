"""whack_draw.py - everything you can see in Whack-a-Mole, in Python."""

import math

from whack_rules import GRID_SIZE, hole_index

CELL_SIZE = 104
BOARD_MARGIN = 12

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#d0d0d0"


def board_pixel_size():
    """How big the square canvas must be."""
    return BOARD_MARGIN * 2 + GRID_SIZE * CELL_SIZE


def hole_centre_x(column):
    """The middle of one hole, across."""
    return BOARD_MARGIN + column * CELL_SIZE + CELL_SIZE / 2


def hole_centre_y(row):
    """The middle of one hole, down."""
    return BOARD_MARGIN + row * CELL_SIZE + CELL_SIZE / 2


def hole_at_pixel(x, y):
    """Which hole did the player hit? (column, row), or None for a miss."""
    column = int((x - BOARD_MARGIN) // CELL_SIZE)
    row = int((y - BOARD_MARGIN) // CELL_SIZE)
    if not (0 <= column < GRID_SIZE and 0 <= row < GRID_SIZE):
        return None
    return (column, row)


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_hole(ctx, column, row):
    """The empty hole a mole might pop out of."""
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.ellipse(hole_centre_x(column), hole_centre_y(row) + 10,
                CELL_SIZE / 2 - 14, CELL_SIZE / 5, 0, 0, math.pi * 2)
    ctx.stroke()


def draw_mole(ctx, column, row):
    """A black dome with two white eyes and a white nose."""
    x = hole_centre_x(column)
    y = hole_centre_y(row) + 8
    radius = CELL_SIZE / 2 - 22

    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(x, y, radius, math.pi, 0)
    ctx.fill()
    ctx.fillRect(x - radius, y, radius * 2, radius * 0.5)

    ctx.fillStyle = COLOR_PAPER
    for eye_x in (x - radius / 2.4, x + radius / 2.4):
        ctx.beginPath()
        ctx.arc(eye_x, y - radius / 3, radius / 6, 0, math.pi * 2)
        ctx.fill()
    ctx.beginPath()
    ctx.arc(x, y + radius / 6, radius / 7, 0, math.pi * 2)
    ctx.fill()


def draw_cursor(ctx, cursor):
    """The dashed box showing where the hammer is aimed."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 4
    ctx.setLineDash([8, 6])
    ctx.strokeRect(BOARD_MARGIN + cursor["column"] * CELL_SIZE + 6,
                   BOARD_MARGIN + cursor["row"] * CELL_SIZE + 6,
                   CELL_SIZE - 12, CELL_SIZE - 12)
    ctx.setLineDash([])


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / 336
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

    for row in range(GRID_SIZE):
        for column in range(GRID_SIZE):
            draw_hole(ctx, column, row)
            if hole_index(column, row) == state["mole"]:
                draw_mole(ctx, column, row)

    if not state["is_over"]:
        draw_cursor(ctx, state["cursor"])

    if state["is_over"]:
        draw_message(ctx, size, size, "TIME UP!",
                     "%d hits - %d points" % (state["hits"], state["score"]))
    elif state["is_paused"]:
        draw_message(ctx, size, size, "PAUSED", "Press P or tap Play to carry on")
