"""sokoban_draw.py - everything you can see in Sokoban, in Python."""

import math

from sokoban_rules import (LEVEL_WIDTH, LEVEL_HEIGHT, is_wall, is_goal)

CELL = 34
BOARD_MARGIN = 8

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#dddddd"


def board_pixel_width():
    """How wide the canvas must be."""
    return BOARD_MARGIN * 2 + LEVEL_WIDTH * CELL


def board_pixel_height():
    """How tall the canvas must be."""
    return BOARD_MARGIN * 2 + LEVEL_HEIGHT * CELL


def cell_left(x):
    """The left edge of one square."""
    return BOARD_MARGIN + x * CELL


def cell_top(y):
    """The top edge of one square."""
    return BOARD_MARGIN + y * CELL


def cell_at_pixel(x, y):
    """Which square did the player click? (x, y), or None."""
    column = int((x - BOARD_MARGIN) // CELL)
    row = int((y - BOARD_MARGIN) // CELL)
    if not (0 <= column < LEVEL_WIDTH) or not (0 <= row < LEVEL_HEIGHT):
        return None
    return (column, row)


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_wall(ctx, x, y):
    """A hatched block."""
    left = cell_left(x)
    top = cell_top(y)
    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(left, top, CELL, CELL)
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 1
    i = -CELL
    while i < CELL:
        ctx.beginPath()
        ctx.moveTo(left + i, top + CELL)
        ctx.lineTo(left + i + CELL, top)
        ctx.stroke()
        i += 6
    ctx.lineWidth = 2
    ctx.strokeRect(left + 1, top + 1, CELL - 2, CELL - 2)


def draw_floor(ctx, x, y):
    """A plain square with a faint outline."""
    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(cell_left(x), cell_top(y), CELL, CELL)
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 1
    ctx.strokeRect(cell_left(x) + 0.5, cell_top(y) + 0.5, CELL - 1, CELL - 1)


def draw_goal(ctx, x, y):
    """The ring showing where a box belongs."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cell_left(x) + CELL / 2, cell_top(y) + CELL / 2, 6, 0, math.pi * 2)
    ctx.stroke()


def draw_box(ctx, x, y, home):
    """A crate: outlined, or solid black once it is home."""
    left = cell_left(x) + 4
    top = cell_top(y) + 4
    size = CELL - 8

    if home:
        ctx.fillStyle = COLOR_INK
        ctx.fillRect(left, top, size, size)
        ctx.strokeStyle = COLOR_PAPER
    else:
        ctx.fillStyle = COLOR_PAPER
        ctx.fillRect(left, top, size, size)
        ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(left + 1, top + 1, size - 2, size - 2)
    ctx.beginPath()
    ctx.moveTo(left + 4, top + 4)
    ctx.lineTo(left + size - 4, top + size - 4)
    ctx.moveTo(left + size - 4, top + 4)
    ctx.lineTo(left + 4, top + size - 4)
    ctx.stroke()


def draw_player(ctx, player):
    """A little person: a head, a body and two feet."""
    middle_x = cell_left(player["x"]) + CELL / 2
    top = cell_top(player["y"])

    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(middle_x, top + 11, 5.5, 0, math.pi * 2)
    ctx.fill()
    ctx.fillRect(middle_x - 5, top + 17, 10, 9)
    ctx.fillRect(middle_x - 7, top + 26, 4, 4)
    ctx.fillRect(middle_x + 3, top + 26, 4, 4)

    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(middle_x - 2, top + 8, 2, 2)
    ctx.fillRect(middle_x + 1, top + 8, 2, 2)


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the level."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
    ctx.fillRect(0, height / 2 - 40, width, 80)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / board_pixel_width()
    title_size = max(14, round(26 * scale))
    subtitle_size = max(9, round(12 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 2)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, board_pixel_width(), board_pixel_height(), COLOR_PAPER)

    for y in range(LEVEL_HEIGHT):
        for x in range(LEVEL_WIDTH):
            if is_wall(state, x, y):
                draw_wall(ctx, x, y)
            else:
                draw_floor(ctx, x, y)
                if is_goal(state, x, y):
                    draw_goal(ctx, x, y)

    for box in state["boxes"]:
        draw_box(ctx, box["x"], box["y"], is_goal(state, box["x"], box["y"]))

    draw_player(ctx, state["player"])

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(BOARD_MARGIN - 1, BOARD_MARGIN - 1,
                   LEVEL_WIDTH * CELL + 2, LEVEL_HEIGHT * CELL + 2)

    if state["is_solved"]:
        draw_message(ctx, board_pixel_width(), board_pixel_height(), "SOLVED!",
                     "%d moves - press N for the next one" % state["moves"])
    elif state["is_paused"]:
        draw_message(ctx, board_pixel_width(), board_pixel_height(),
                     "PAUSED", "Press P to carry on")
