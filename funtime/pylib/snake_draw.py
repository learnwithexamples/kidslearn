"""snake_draw.py - drawing the Snake game, in Python.

Yes: this Python code paints on an HTML canvas. Pyodide lets Python call the
same drawing tools JavaScript uses, so `ctx.fillRect(...)` works here exactly
as it does there.

Every function takes the canvas drawing tool `ctx` as its first input. None of
them change the game - drawing never cheats.
"""

from snake_rules import GRID_WIDTH, GRID_HEIGHT

COLOR_BACKGROUND = "#ffffff"
COLOR_GRID = "#ececec"
COLOR_SNAKE = "#111111"
COLOR_INNER = "#ffffff"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour.

    INPUT:  ctx, width, height, color. OUTPUT: nothing.
    ALGORITHM: set fillStyle, then fillRect over everything.
    """
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_grid(ctx, columns, rows, cell_size):
    """The faint lines that show the squares.

    INPUT:  ctx, columns, rows, cell_size. OUTPUT: nothing.
    ALGORITHM: one line per column, then one per row.
    """
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


def draw_segment(ctx, position, cell_size):
    """One square of the snake's body.

    INPUT:  ctx, position, cell_size. OUTPUT: nothing.
    ALGORITHM: a black square with a smaller white square outlined inside it.
    """
    x = position[0] * cell_size
    y = position[1] * cell_size

    ctx.fillStyle = COLOR_SNAKE
    ctx.fillRect(x + 1, y + 1, cell_size - 2, cell_size - 2)

    inset = max(3, round(cell_size * 0.26))
    ctx.strokeStyle = COLOR_INNER
    ctx.lineWidth = max(1, round(cell_size * 0.1))
    ctx.strokeRect(x + inset, y + inset, cell_size - inset * 2, cell_size - inset * 2)


def draw_head(ctx, position, direction, cell_size):
    """The snake's head, with two eyes looking where it is going.

    INPUT:  ctx, position, direction, cell_size. OUTPUT: nothing.
    ALGORITHM: fill the square solid (no hollow middle, so the head stands out),
    then step forward from the middle to the face and out to each side - the
    sideways step of (x, y) is (-y, x) - and put a white eye at each spot.
    """
    x = position[0] * cell_size
    y = position[1] * cell_size

    ctx.fillStyle = COLOR_SNAKE
    ctx.fillRect(x + 1, y + 1, cell_size - 2, cell_size - 2)

    middle_x = x + cell_size / 2
    middle_y = y + cell_size / 2
    forward = cell_size * 0.20
    sideways = cell_size * 0.22
    eye = max(2, round(cell_size * 0.13))

    face_x = middle_x + direction[0] * forward
    face_y = middle_y + direction[1] * forward
    side_x = -direction[1] * sideways
    side_y = direction[0] * sideways

    ctx.fillStyle = COLOR_INNER
    ctx.fillRect(face_x + side_x - eye / 2, face_y + side_y - eye / 2, eye, eye)
    ctx.fillRect(face_x - side_x - eye / 2, face_y - side_y - eye / 2, eye, eye)


def draw_food(ctx, position, cell_size):
    """The apple.

    INPUT:  ctx, position, cell_size. OUTPUT: nothing.
    ALGORITHM: a filled black circle with a small white dot for shine.
    """
    import math

    middle_x = position[0] * cell_size + cell_size / 2
    middle_y = position[1] * cell_size + cell_size / 2

    ctx.fillStyle = COLOR_SNAKE
    ctx.beginPath()
    ctx.arc(middle_x, middle_y, cell_size * 0.38, 0, math.pi * 2)
    ctx.fill()

    ctx.fillStyle = COLOR_INNER
    ctx.beginPath()
    ctx.arc(middle_x - cell_size * 0.12, middle_y - cell_size * 0.12, cell_size * 0.09, 0, math.pi * 2)
    ctx.fill()


def draw_frame(ctx, width, height):
    """The thick black border around the field.

    INPUT:  ctx, width, height. OUTPUT: nothing.
    """
    ctx.strokeStyle = COLOR_SNAKE
    ctx.lineWidth = 3
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3)


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the field.

    INPUT:  ctx, width, height, title, subtitle. OUTPUT: nothing.
    ALGORITHM: cover the field with a see-through white sheet, then write the
    two lines, sized from the width of the canvas.
    """
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = COLOR_SNAKE
    ctx.textAlign = "center"

    scale = width / 400
    title_size = max(14, round(34 * scale))
    subtitle_size = max(9, round(15 * scale))

    ctx.font = "bold " + str(title_size) + "px monospace"
    ctx.fillText(title, width / 2, height / 2 - 8)

    ctx.font = str(subtitle_size) + "px monospace"
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)


def render_game(ctx, state, cell_size):
    """Draw one complete frame.

    INPUT:  ctx, state, cell_size. OUTPUT: nothing.
    ALGORITHM (order matters - later things cover earlier ones):
      1. Clear to white and draw the faint grid.
      2. Draw the apple.
      3. Draw the body, then the head on top.
      4. Draw the border, and any message.
    """
    width = GRID_WIDTH * cell_size
    height = GRID_HEIGHT * cell_size

    clear_canvas(ctx, width, height, COLOR_BACKGROUND)
    draw_grid(ctx, GRID_WIDTH, GRID_HEIGHT, cell_size)

    if state["food"] is not None:
        draw_food(ctx, state["food"], cell_size)

    for segment in state["snake"][1:]:
        draw_segment(ctx, segment, cell_size)
    if state["snake"]:
        draw_head(ctx, state["snake"][0], state["direction"], cell_size)

    draw_frame(ctx, width, height)

    if state["is_won"]:
        draw_message(ctx, width, height, "YOU WIN!", "You filled the whole board!")
    elif state["is_over"]:
        draw_message(ctx, width, height, "GAME OVER", "Press R or tap New to play again")
    elif state["is_paused"]:
        draw_message(ctx, width, height, "PAUSED", "Press P or tap Play to start")
