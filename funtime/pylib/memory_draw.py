"""memory_draw.py - drawing Memory Match, in Python.

Black and white: a face-down card is a black rectangle with a white diamond, a
face-up card is white with a black symbol on it.
"""

import math

from memory_rules import GRID_COLUMNS, GRID_ROWS, card_index, stars_for_moves

CARD_WIDTH = 76
CARD_HEIGHT = 96
CARD_GAP = 8
BOARD_MARGIN = 10

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#c8c8c8"


def board_pixel_width():
    """How wide the canvas must be: cards, gaps and margins."""
    return BOARD_MARGIN * 2 + GRID_COLUMNS * CARD_WIDTH + (GRID_COLUMNS - 1) * CARD_GAP


def board_pixel_height():
    """How tall the canvas must be."""
    return BOARD_MARGIN * 2 + GRID_ROWS * CARD_HEIGHT + (GRID_ROWS - 1) * CARD_GAP


def card_left(column):
    """The pixel position of a card's left edge."""
    return BOARD_MARGIN + column * (CARD_WIDTH + CARD_GAP)


def card_top(row):
    """The pixel position of a card's top edge."""
    return BOARD_MARGIN + row * (CARD_HEIGHT + CARD_GAP)


def card_at_pixel(x, y):
    """Which card did the player click on?

    INPUT:  x, y - a position on the canvas
    OUTPUT: the index of the card there, or -1 for a click in the gaps
    """
    column = int((x - BOARD_MARGIN) // (CARD_WIDTH + CARD_GAP))
    row = int((y - BOARD_MARGIN) // (CARD_HEIGHT + CARD_GAP))
    if not (0 <= column < GRID_COLUMNS and 0 <= row < GRID_ROWS):
        return -1
    if x - card_left(column) > CARD_WIDTH or y - card_top(row) > CARD_HEIGHT:
        return -1
    return card_index(column, row)


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_symbol(ctx, symbol, centre_x, centre_y, size):
    """One of the eight shapes hiding on the cards."""
    half = size / 2
    ctx.fillStyle = COLOR_INK
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 4

    if symbol == 0:
        ctx.beginPath()
        ctx.arc(centre_x, centre_y, half, 0, math.pi * 2)
        ctx.fill()
    elif symbol == 1:
        ctx.fillRect(centre_x - half, centre_y - half, size, size)
    elif symbol == 2:
        ctx.beginPath()
        ctx.moveTo(centre_x, centre_y - half)
        ctx.lineTo(centre_x + half, centre_y + half)
        ctx.lineTo(centre_x - half, centre_y + half)
        ctx.fill()
    elif symbol == 3:
        ctx.beginPath()
        ctx.moveTo(centre_x, centre_y - half)
        ctx.lineTo(centre_x + half, centre_y)
        ctx.lineTo(centre_x, centre_y + half)
        ctx.lineTo(centre_x - half, centre_y)
        ctx.fill()
    elif symbol == 4:
        ctx.fillRect(centre_x - half / 3, centre_y - half, size / 3, size)
        ctx.fillRect(centre_x - half, centre_y - half / 3, size, size / 3)
    elif symbol == 5:
        ctx.beginPath()
        for point in range(8):
            radius = half if point % 2 == 0 else half / 2.4
            angle = (math.pi / 4) * point - math.pi / 2
            px = centre_x + math.cos(angle) * radius
            py = centre_y + math.sin(angle) * radius
            if point == 0:
                ctx.moveTo(px, py)
            else:
                ctx.lineTo(px, py)
        ctx.closePath()
        ctx.fill()
    elif symbol == 6:
        ctx.beginPath()
        ctx.arc(centre_x, centre_y, half - 3, 0, math.pi * 2)
        ctx.stroke()
    else:
        ctx.fillRect(centre_x - half, centre_y - half, size, size / 4)
        ctx.fillRect(centre_x - half, centre_y - size / 8, size, size / 4)
        ctx.fillRect(centre_x - half, centre_y + half - size / 4, size, size / 4)


def draw_card(ctx, card, column, row):
    """One card, face up or face down."""
    x = card_left(column)
    y = card_top(row)

    if card["face_up"] or card["matched"]:
        ctx.fillStyle = COLOR_PAPER
        ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT)
        ctx.strokeStyle = COLOR_FAINT if card["matched"] else COLOR_INK
        ctx.lineWidth = 2 if card["matched"] else 3
        ctx.strokeRect(x + 1.5, y + 1.5, CARD_WIDTH - 3, CARD_HEIGHT - 3)
        draw_symbol(ctx, card["symbol"], x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2, 40)
    else:
        ctx.fillStyle = COLOR_INK
        ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT)
        ctx.fillStyle = COLOR_PAPER
        ctx.beginPath()
        ctx.moveTo(x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2 - 16)
        ctx.lineTo(x + CARD_WIDTH / 2 + 16, y + CARD_HEIGHT / 2)
        ctx.lineTo(x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2 + 16)
        ctx.lineTo(x + CARD_WIDTH / 2 - 16, y + CARD_HEIGHT / 2)
        ctx.fill()


def draw_cursor(ctx, cursor):
    """The dashed box showing where the keyboard cursor is."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 4
    ctx.setLineDash([8, 6])
    ctx.strokeRect(card_left(cursor["column"]) - 4, card_top(cursor["row"]) - 4,
                   CARD_WIDTH + 8, CARD_HEIGHT + 8)
    ctx.setLineDash([])


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / 350
    title_size = max(14, round(32 * scale))
    subtitle_size = max(9, round(15 * scale))

    ctx.font = "bold " + str(title_size) + "px monospace"
    ctx.fillText(title, width / 2, height / 2 - 8)
    ctx.font = str(subtitle_size) + "px monospace"
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)


def render_game(ctx, state):
    """Draw one complete frame."""
    width = board_pixel_width()
    height = board_pixel_height()

    clear_canvas(ctx, width, height, COLOR_PAPER)

    for row in range(GRID_ROWS):
        for column in range(GRID_COLUMNS):
            draw_card(ctx, state["cards"][card_index(column, row)], column, row)

    if not state["is_over"]:
        draw_cursor(ctx, state["cursor"])

    if state["is_over"]:
        stars = stars_for_moves(state["moves"])
        draw_message(ctx, width, height, "ALL FOUND!",
                     "%d moves - %s%s" % (state["moves"], "*" * stars, "." * (3 - stars)))
    elif state["is_paused"]:
        draw_message(ctx, width, height, "PAUSED", "Press P or tap Play to carry on")
