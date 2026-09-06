"""twenty48_draw.py - everything you can see in 2048, in Python."""

from twenty48_rules import SIZE, cell_index

CELL = 66
BOARD_MARGIN = 10
TILE_GAP = 6

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_EMPTY = "#eeeeee"
COLOR_SHADE = "#d2d2d2"


def board_pixel_size():
    """How big the square canvas must be."""
    return BOARD_MARGIN * 2 + SIZE * CELL


def tile_left(column):
    """The left edge of one square."""
    return BOARD_MARGIN + column * CELL


def tile_top(row):
    """The top edge of one square."""
    return BOARD_MARGIN + row * CELL


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def tile_look(value):
    """How a tile of this value should be drawn: three bands, no colour."""
    if value >= 256:
        return {"fill": COLOR_INK, "text": COLOR_PAPER, "weight": "bold "}
    if value >= 16:
        return {"fill": COLOR_SHADE, "text": COLOR_INK, "weight": "bold "}
    return {"fill": COLOR_PAPER, "text": COLOR_INK, "weight": ""}


def tile_font_size(value):
    """Long numbers have to be drawn smaller to fit."""
    digits = len(str(value))
    if digits >= 4:
        return 20
    if digits == 3:
        return 25
    return 30


def rounded_box(ctx, x, y, width, height, radius):
    """A square with softened corners."""
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()


def draw_tile(ctx, column, row, value):
    """One square, empty or with a number in it."""
    x = tile_left(column) + TILE_GAP / 2
    y = tile_top(row) + TILE_GAP / 2
    size = CELL - TILE_GAP

    if value == 0:
        ctx.fillStyle = COLOR_EMPTY
        rounded_box(ctx, x, y, size, size, 6)
        ctx.fill()
        return

    look = tile_look(value)
    ctx.fillStyle = look["fill"]
    rounded_box(ctx, x, y, size, size, 6)
    ctx.fill()
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    rounded_box(ctx, x + 1, y + 1, size - 2, size - 2, 6)
    ctx.stroke()

    ctx.fillStyle = look["text"]
    font_size = tile_font_size(value)
    ctx.font = "%s%dpx monospace" % (look["weight"], font_size)
    ctx.textAlign = "center"
    ctx.fillText(str(value), x + size / 2, y + size / 2 + font_size / 3)
    ctx.textAlign = "left"


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)"
    ctx.fillRect(0, height / 2 - 44, width, 88)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / board_pixel_size()
    title_size = max(14, round(30 * scale))
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

    for row in range(SIZE):
        for column in range(SIZE):
            draw_tile(ctx, column, row, state["board"][cell_index(column, row)])

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(BOARD_MARGIN - 2, BOARD_MARGIN - 2, SIZE * CELL + 4, SIZE * CELL + 4)

    if state["is_over"]:
        draw_message(ctx, size, size, "NO MOVES LEFT", "%d points - press R" % state["score"])
    elif state["is_won"] and not state.get("keep_playing"):
        draw_message(ctx, size, size, "2048!", "Press SPACE to keep going")
    elif state["is_paused"]:
        draw_message(ctx, size, size, "PAUSED", "Press P to carry on")
