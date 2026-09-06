"""mines_draw.py - everything you can see in Minesweeper, in Python."""

import math

from mines_rules import GRID_SIZE, cell_index, is_inside_grid, count_mines

CELL = 30
BOARD_MARGIN = 8

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_COVER = "#e6e6e6"
COLOR_FAINT = "#bcbcbc"


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
    if not is_inside_grid(column, row):
        return None
    return (column, row)


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_covered(ctx, column, row):
    """A square that has not been dug yet."""
    x = cell_left(column)
    y = cell_top(row)
    ctx.fillStyle = COLOR_COVER
    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
    ctx.strokeStyle = COLOR_PAPER
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + 2, y + CELL - 2)
    ctx.lineTo(x + 2, y + 2)
    ctx.lineTo(x + CELL - 2, y + 2)
    ctx.stroke()


def draw_open(ctx, state, column, row):
    """A square that has been dug, with its number if it has one."""
    x = cell_left(column)
    y = cell_top(row)
    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 1
    ctx.strokeRect(x + 1.5, y + 1.5, CELL - 3, CELL - 3)

    count = count_mines(state, column, row)
    if count == 0:
        return
    ctx.fillStyle = COLOR_INK
    weight = "bold " if count >= 4 else ""
    ctx.font = "%s%dpx monospace" % (weight, 13 + count)
    ctx.textAlign = "center"
    ctx.fillText(str(count), x + CELL / 2, y + CELL / 2 + 6)
    ctx.textAlign = "left"


def draw_flag(ctx, column, row):
    """A triangle on a pole."""
    x = cell_left(column)
    y = cell_top(row)
    ctx.fillStyle = COLOR_INK
    ctx.fillRect(x + CELL / 2 - 1, y + 7, 2, CELL - 14)
    ctx.fillRect(x + 8, y + CELL - 8, CELL - 16, 3)
    ctx.beginPath()
    ctx.moveTo(x + CELL / 2, y + 7)
    ctx.lineTo(x + CELL - 8, y + 11)
    ctx.lineTo(x + CELL / 2, y + 15)
    ctx.closePath()
    ctx.fill()


def draw_mine(ctx, column, row, exploded):
    """A spiky black circle."""
    x = cell_left(column) + CELL / 2
    y = cell_top(row) + CELL / 2

    if exploded:
        ctx.fillStyle = COLOR_INK
        ctx.fillRect(cell_left(column) + 1, cell_top(row) + 1, CELL - 2, CELL - 2)
        ctx.fillStyle = COLOR_PAPER
    else:
        ctx.fillStyle = COLOR_INK

    ctx.beginPath()
    ctx.arc(x, y, 6, 0, math.pi * 2)
    ctx.fill()

    ctx.strokeStyle = COLOR_PAPER if exploded else COLOR_INK
    ctx.lineWidth = 2
    for i in range(4):
        angle = i * math.pi / 4
        ctx.beginPath()
        ctx.moveTo(x - math.cos(angle) * 10, y - math.sin(angle) * 10)
        ctx.lineTo(x + math.cos(angle) * 10, y + math.sin(angle) * 10)
        ctx.stroke()


def draw_cursor(ctx, cursor):
    """The dashed box showing where the keyboard is pointing."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    ctx.strokeRect(cell_left(cursor["column"]) + 2, cell_top(cursor["row"]) + 2, CELL - 4, CELL - 4)
    ctx.setLineDash([])


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)"
    ctx.fillRect(0, height / 2 - 42, width, 84)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / board_pixel_size()
    title_size = max(14, round(28 * scale))
    subtitle_size = max(9, round(13 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 2)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    size = board_pixel_size()
    clear_canvas(ctx, size, size, COLOR_PAPER)

    for row in range(GRID_SIZE):
        for column in range(GRID_SIZE):
            index = cell_index(column, row)
            is_mine = state["mines"][index]

            if state["revealed"][index]:
                if is_mine:
                    draw_mine(ctx, column, row, index == state["hit_mine"])
                else:
                    draw_open(ctx, state, column, row)
            elif state["is_over"] and is_mine and not state["flagged"][index]:
                draw_covered(ctx, column, row)
                draw_mine(ctx, column, row, False)
            else:
                draw_covered(ctx, column, row)
                if state["flagged"][index]:
                    draw_flag(ctx, column, row)

    if not state["is_over"]:
        draw_cursor(ctx, state["cursor"])

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(BOARD_MARGIN - 1, BOARD_MARGIN - 1,
                   GRID_SIZE * CELL + 2, GRID_SIZE * CELL + 2)

    if state["is_won"]:
        draw_message(ctx, size, size, "CLEARED!", "in %d seconds" % round(state["seconds"]))
    elif state["is_over"]:
        draw_message(ctx, size, size, "BOOM!", "Press R to try again")
    elif state["is_paused"]:
        draw_message(ctx, size, size, "PAUSED", "Press P to carry on")
