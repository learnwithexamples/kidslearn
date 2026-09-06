"""maze_draw.py - everything you can see in Maze Runner, in Python."""

import math

from maze_rules import MAZE_WIDTH, MAZE_HEIGHT, is_inside_maze, is_wall, exit_square

CELL = 16
BOARD_MARGIN = 6

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_HINT = "#9a9a9a"


def board_pixel_width():
    """How wide the canvas must be."""
    return BOARD_MARGIN * 2 + MAZE_WIDTH * CELL


def board_pixel_height():
    """How tall the canvas must be."""
    return BOARD_MARGIN * 2 + MAZE_HEIGHT * CELL


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
    if not is_inside_maze(column, row):
        return None
    return (column, row)


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_maze(ctx, maze):
    """The rock and the corridors."""
    ctx.fillStyle = COLOR_INK
    for y in range(MAZE_HEIGHT):
        for x in range(MAZE_WIDTH):
            if is_wall(maze, x, y):
                ctx.fillRect(cell_left(x), cell_top(y), CELL, CELL)


def draw_hint(ctx, path):
    """A trail of dots along the shortest way out."""
    ctx.fillStyle = COLOR_HINT
    for square in path:
        ctx.beginPath()
        ctx.arc(cell_left(square["x"]) + CELL / 2, cell_top(square["y"]) + CELL / 2,
                2.5, 0, math.pi * 2)
        ctx.fill()


def draw_exit(ctx):
    """The ring you are heading for."""
    goal = exit_square()
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(cell_left(goal["x"]) + CELL / 2, cell_top(goal["y"]) + CELL / 2,
            CELL / 2 - 2, 0, math.pi * 2)
    ctx.stroke()


def draw_player(ctx, player):
    """A filled circle with a white dot, so it stands out on white."""
    x = cell_left(player["x"]) + CELL / 2
    y = cell_top(player["y"]) + CELL / 2
    ctx.fillStyle = COLOR_INK
    ctx.beginPath()
    ctx.arc(x, y, CELL / 2 - 2, 0, math.pi * 2)
    ctx.fill()
    ctx.fillStyle = COLOR_PAPER
    ctx.beginPath()
    ctx.arc(x - 1.5, y - 1.5, 2, 0, math.pi * 2)
    ctx.fill()


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the maze."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
    ctx.fillRect(0, height / 2 - 38, width, 76)
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

    draw_maze(ctx, state["maze"])
    if state.get("hint"):
        draw_hint(ctx, state["hint"])
    draw_exit(ctx)
    draw_player(ctx, state["player"])

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(BOARD_MARGIN - 1, BOARD_MARGIN - 1,
                   MAZE_WIDTH * CELL + 2, MAZE_HEIGHT * CELL + 2)

    if state["is_solved"]:
        draw_message(ctx, board_pixel_width(), board_pixel_height(), "OUT!",
                     "%d steps (best possible %d) - press N"
                     % (state["steps"], state["shortest"]))
    elif state["is_paused"]:
        draw_message(ctx, board_pixel_width(), board_pixel_height(),
                     "PAUSED", "Press P to carry on")
