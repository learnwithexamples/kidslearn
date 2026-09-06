"""connect4_draw.py - everything you can see in Connect Four, in Python.

Your counters are solid black discs, the computer's are hollow rings, and
empty holes are faint circles.
"""

import math

from connect4_rules import COLUMNS, ROWS, PLAYER, COMPUTER, cell_index

CELL_SIZE = 52
BOARD_MARGIN = 10
DROP_STRIP = 34

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#cfcfcf"


def board_pixel_width():
    """How wide the canvas must be."""
    return BOARD_MARGIN * 2 + COLUMNS * CELL_SIZE


def board_pixel_height():
    """How tall the canvas must be, including the strip for the drop marker."""
    return BOARD_MARGIN * 2 + DROP_STRIP + ROWS * CELL_SIZE


def hole_centre_x(column):
    """The middle of one hole, across."""
    return BOARD_MARGIN + column * CELL_SIZE + CELL_SIZE / 2


def hole_centre_y(row):
    """The middle of one hole, down."""
    return BOARD_MARGIN + DROP_STRIP + row * CELL_SIZE + CELL_SIZE / 2


def column_at_pixel(x):
    """Which column did the player click on? -1 for a miss."""
    column = int((x - BOARD_MARGIN) // CELL_SIZE)
    return column if 0 <= column < COLUMNS else -1


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_counter(ctx, mark, centre_x, centre_y, radius):
    """One hole: empty (faint outline), yours (solid) or the computer's (ring)."""
    ctx.beginPath()
    ctx.arc(centre_x, centre_y, radius, 0, math.pi * 2)

    if mark == PLAYER:
        ctx.fillStyle = COLOR_INK
        ctx.fill()
    elif mark == COMPUTER:
        ctx.strokeStyle = COLOR_INK
        ctx.lineWidth = 7
        ctx.stroke()
    else:
        ctx.strokeStyle = COLOR_FAINT
        ctx.lineWidth = 2
        ctx.stroke()


def draw_board_frame(ctx):
    """The border around the playing area."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 4
    ctx.strokeRect(BOARD_MARGIN - 4, BOARD_MARGIN + DROP_STRIP - 4,
                   COLUMNS * CELL_SIZE + 8, ROWS * CELL_SIZE + 8)


def draw_drop_marker(ctx, column):
    """The counter waiting above the column you have chosen."""
    draw_counter(ctx, PLAYER, hole_centre_x(column), BOARD_MARGIN + DROP_STRIP / 2, CELL_SIZE / 2 - 8)
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    ctx.beginPath()
    ctx.moveTo(hole_centre_x(column), BOARD_MARGIN + DROP_STRIP - 2)
    ctx.lineTo(hole_centre_x(column), BOARD_MARGIN + DROP_STRIP + 10)
    ctx.stroke()
    ctx.setLineDash([])


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / 384
    title_size = max(14, round(30 * scale))
    subtitle_size = max(9, round(14 * scale))

    ctx.font = "bold " + str(title_size) + "px monospace"
    ctx.fillText(title, width / 2, height / 2 - 8)
    ctx.font = str(subtitle_size) + "px monospace"
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)


def render_game(ctx, state):
    """Draw one complete frame."""
    width = board_pixel_width()
    height = board_pixel_height()

    clear_canvas(ctx, width, height, COLOR_PAPER)

    for row in range(ROWS):
        for column in range(COLUMNS):
            draw_counter(ctx, state["board"][cell_index(column, row)],
                         hole_centre_x(column), hole_centre_y(row), CELL_SIZE / 2 - 6)
    draw_board_frame(ctx)

    if not state["is_over"] and not state["is_paused"]:
        draw_drop_marker(ctx, state["cursor"])

    if state["is_over"]:
        if state["winner"] == PLAYER:
            title = "YOU WIN!"
        elif state["winner"] == "draw":
            title = "A DRAW"
        else:
            title = "COMPUTER WINS"
        draw_message(ctx, width, height, title, "Press R or tap New for another round")
    elif state["is_paused"]:
        draw_message(ctx, width, height, "PAUSED", "Press P or tap Play to carry on")
