"""tictactoe_draw.py - everything you can see in Tic-Tac-Toe, in Python."""

import math

from tictactoe_rules import GRID_SIZE, EMPTY, PLAYER, square_index

CELL_SIZE = 100
BOARD_MARGIN = 12

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#bbbbbb"


def board_pixel_size():
    """How big the square canvas must be."""
    return BOARD_MARGIN * 2 + GRID_SIZE * CELL_SIZE


def cell_left(column):
    """The pixel position of a square's left edge."""
    return BOARD_MARGIN + column * CELL_SIZE


def cell_top(row):
    """The pixel position of a square's top edge."""
    return BOARD_MARGIN + row * CELL_SIZE


def square_at_pixel(x, y):
    """Which square did the player click on? Returns (column, row) or None."""
    column = int((x - BOARD_MARGIN) // CELL_SIZE)
    row = int((y - BOARD_MARGIN) // CELL_SIZE)
    if not (0 <= column < GRID_SIZE and 0 <= row < GRID_SIZE):
        return None
    return (column, row)


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_grid_lines(ctx):
    """The two vertical and two horizontal bars."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    for line in range(1, GRID_SIZE):
        ctx.beginPath()
        ctx.moveTo(cell_left(line), BOARD_MARGIN + 6)
        ctx.lineTo(cell_left(line), BOARD_MARGIN + GRID_SIZE * CELL_SIZE - 6)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(BOARD_MARGIN + 6, cell_top(line))
        ctx.lineTo(BOARD_MARGIN + GRID_SIZE * CELL_SIZE - 6, cell_top(line))
        ctx.stroke()


def draw_mark(ctx, mark, column, row):
    """One X (two crossing lines) or one O (a circle)."""
    if mark == EMPTY:
        return

    x = cell_left(column)
    y = cell_top(row)
    pad = 24

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 10
    ctx.lineCap = "round"

    if mark == PLAYER:
        ctx.beginPath()
        ctx.moveTo(x + pad, y + pad)
        ctx.lineTo(x + CELL_SIZE - pad, y + CELL_SIZE - pad)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x + CELL_SIZE - pad, y + pad)
        ctx.lineTo(x + pad, y + CELL_SIZE - pad)
        ctx.stroke()
    else:
        ctx.beginPath()
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2 - pad, 0, math.pi * 2)
        ctx.stroke()


def draw_winning_line(ctx, line):
    """Strike through the three winning squares."""
    first, last = line[0], line[2]
    from_x = cell_left(first % GRID_SIZE) + CELL_SIZE / 2
    from_y = cell_top(first // GRID_SIZE) + CELL_SIZE / 2
    to_x = cell_left(last % GRID_SIZE) + CELL_SIZE / 2
    to_y = cell_top(last // GRID_SIZE) + CELL_SIZE / 2

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(from_x, from_y)
    ctx.lineTo(to_x, to_y)
    ctx.stroke()


def draw_cursor(ctx, cursor):
    """The dashed box showing where the keyboard cursor is."""
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 4
    ctx.setLineDash([8, 6])
    ctx.strokeRect(cell_left(cursor["column"]) + 6, cell_top(cursor["row"]) + 6,
                   CELL_SIZE - 12, CELL_SIZE - 12)
    ctx.setLineDash([])


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / 340
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
    draw_grid_lines(ctx)

    for row in range(GRID_SIZE):
        for column in range(GRID_SIZE):
            draw_mark(ctx, state["board"][square_index(column, row)], column, row)

    if not state["is_over"]:
        draw_cursor(ctx, state["cursor"])
    if state["line"]:
        draw_winning_line(ctx, state["line"])

    if state["is_over"]:
        if state["winner"] == PLAYER:
            title = "YOU WIN!"
        elif state["winner"] == "draw":
            title = "A DRAW"
        else:
            title = "COMPUTER WINS"
        draw_message(ctx, size, size, title, "Press R or tap New for another round")
    elif state["is_paused"]:
        draw_message(ctx, size, size, "PAUSED", "Press P or tap Play to carry on")
