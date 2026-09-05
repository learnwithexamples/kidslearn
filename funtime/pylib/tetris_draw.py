"""tetris_draw.py - drawing the Tetris game, in Python.

Python calls the HTML canvas directly through Pyodide, so `ctx.fillRect(...)`
here does exactly what it does in JavaScript. Black and white only: a block is
a black square with a white square inside it.
"""

from tetris_rules import BOARD_WIDTH, BOARD_HEIGHT, create_piece, piece_blocks, get_ghost_piece

COLOR_BACKGROUND = "#ffffff"
COLOR_GRID = "#e6e6e6"
COLOR_BLOCK = "#111111"
COLOR_INNER = "#ffffff"
COLOR_GHOST = "#b0b0b0"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_grid(ctx, columns, rows, cell_size):
    """The faint lines that show the squares."""
    ctx.strokeStyle = COLOR_GRID
    ctx.lineWidth = 1
    for c in range(columns + 1):
        ctx.beginPath()
        ctx.moveTo(c * cell_size + 0.5, 0)
        ctx.lineTo(c * cell_size + 0.5, rows * cell_size)
        ctx.stroke()
    for r in range(rows + 1):
        ctx.beginPath()
        ctx.moveTo(0, r * cell_size + 0.5)
        ctx.lineTo(columns * cell_size, r * cell_size + 0.5)
        ctx.stroke()


def draw_block(ctx, column, row, cell_size):
    """One solid block of a tetromino.

    INPUT:  ctx, column, row, cell_size. OUTPUT: nothing.
    ALGORITHM: a black square with a smaller white square outlined inside it.
    """
    x = column * cell_size
    y = row * cell_size
    ctx.fillStyle = COLOR_BLOCK
    ctx.fillRect(x + 1, y + 1, cell_size - 2, cell_size - 2)
    inset = max(3, round(cell_size * 0.25))
    ctx.strokeStyle = COLOR_INNER
    ctx.lineWidth = max(1, round(cell_size * 0.1))
    ctx.strokeRect(x + inset, y + inset, cell_size - inset * 2, cell_size - inset * 2)


def draw_ghost_block(ctx, column, row, cell_size):
    """One square of the landing outline."""
    x = column * cell_size
    y = row * cell_size
    ctx.strokeStyle = COLOR_GHOST
    ctx.lineWidth = 2
    ctx.strokeRect(x + 3, y + 3, cell_size - 6, cell_size - 6)


def draw_frame(ctx, width, height):
    """The thick black border around the field."""
    ctx.strokeStyle = COLOR_BLOCK
    ctx.lineWidth = 3
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3)


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the board."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = COLOR_BLOCK
    ctx.textAlign = "center"

    scale = width / 300
    title_size = max(14, round(30 * scale))
    subtitle_size = max(9, round(15 * scale))

    ctx.font = "bold " + str(title_size) + "px monospace"
    ctx.fillText(title, width / 2, height / 2 - 8)
    ctx.font = str(subtitle_size) + "px monospace"
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)


def render_game(ctx, state, cell_size):
    """Draw one complete frame of the game.

    ALGORITHM: clear, grid, locked blocks, the landing outline, the falling
    piece, the border, and any message on top.
    """
    width = BOARD_WIDTH * cell_size
    height = BOARD_HEIGHT * cell_size

    clear_canvas(ctx, width, height, COLOR_BACKGROUND)
    draw_grid(ctx, BOARD_WIDTH, BOARD_HEIGHT, cell_size)

    for row_number, row in enumerate(state["board"]):
        for column, value in enumerate(row):
            if value == 1:
                draw_block(ctx, column, row_number, cell_size)

    if state["piece"] is not None and not state["is_over"]:
        ghost = get_ghost_piece(state)
        if ghost is not None:
            for x, y in piece_blocks(ghost):
                if y >= 0:
                    draw_ghost_block(ctx, x, y, cell_size)
        for x, y in piece_blocks(state["piece"]):
            if y >= 0:
                draw_block(ctx, x, y, cell_size)

    draw_frame(ctx, width, height)

    if state["is_over"]:
        draw_message(ctx, width, height, "GAME OVER", "Press R or tap New to play again")
    elif state["is_paused"]:
        draw_message(ctx, width, height, "PAUSED", "Press P or tap Play to start")


def render_next_piece(ctx, piece_type, width, height, cell_size):
    """Draw the preview of the piece that comes next.

    ALGORITHM: clear the little canvas, work out the offsets that centre the
    piece's grid in the box, and draw a block for every 1 in it.
    """
    clear_canvas(ctx, width, height, COLOR_BACKGROUND)
    draw_frame(ctx, width, height)
    if not piece_type:
        return

    cells = create_piece(piece_type)["cells"]
    size = len(cells)
    offset_x = (width - size * cell_size) / 2
    offset_y = (height - size * cell_size) / 2

    ctx.save()
    ctx.translate(offset_x, offset_y)
    for r in range(size):
        for c in range(size):
            if cells[r][c] == 1:
                draw_block(ctx, c, r, cell_size)
    ctx.restore()
