/* ============================================================
   maze-draw.js — everything you can see in Maze Runner

   Black and white: the rock is solid black, the corridors are paper white,
   the exit is a ring, and a hint is a trail of small dots.
   ============================================================ */

const CELL = 16;
const BOARD_MARGIN = 6;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_HINT = '#9a9a9a';

/** boardPixelWidth / boardPixelHeight — how big the canvas must be. */
function boardPixelWidth() { return BOARD_MARGIN * 2 + MAZE_WIDTH * CELL; }
function boardPixelHeight() { return BOARD_MARGIN * 2 + MAZE_HEIGHT * CELL; }

/** cellLeft / cellTop — the top-left corner of one square. */
function cellLeft(x) { return BOARD_MARGIN + x * CELL; }
function cellTop(y) { return BOARD_MARGIN + y * CELL; }

/** cellAtPixel — which square did the player click? null if none. */
function cellAtPixel(x, y) {
    const column = Math.floor((x - BOARD_MARGIN) / CELL);
    const row = Math.floor((y - BOARD_MARGIN) / CELL);
    if (!isInsideMaze(column, row)) {
        return null;
    }
    return { x: column, y: row };
}

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawMaze — the rock and the corridors. */
function drawMaze(ctx, maze) {
    ctx.fillStyle = COLOR_INK;
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
            if (isWall(maze, x, y)) {
                ctx.fillRect(cellLeft(x), cellTop(y), CELL, CELL);
            }
        }
    }
}

/** drawHint — a trail of dots along the shortest way out. */
function drawHint(ctx, path) {
    ctx.fillStyle = COLOR_HINT;
    for (let i = 0; i < path.length; i++) {
        ctx.beginPath();
        ctx.arc(cellLeft(path[i].x) + CELL / 2, cellTop(path[i].y) + CELL / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

/** drawExit — the ring you are heading for. */
function drawExit(ctx) {
    const exit = exitSquare();
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cellLeft(exit.x) + CELL / 2, cellTop(exit.y) + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
}

/** drawPlayer — a filled circle with a white dot, so it stands out on white. */
function drawPlayer(ctx, player) {
    const x = cellLeft(player.x) + CELL / 2;
    const y = cellTop(player.y) + CELL / 2;
    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(x, y, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOR_PAPER;
    ctx.beginPath();
    ctx.arc(x - 1.5, y - 1.5, 2, 0, Math.PI * 2);
    ctx.fill();
}

/** drawMessage — big centred words across the maze. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    ctx.fillRect(0, height / 2 - 38, width, 76);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / boardPixelWidth();
    const titleSize = Math.max(14, Math.round(26 * scale));
    const subtitleSize = Math.max(9, Math.round(12 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 2);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    clearCanvas(ctx, boardPixelWidth(), boardPixelHeight(), COLOR_PAPER);

    drawMaze(ctx, state.maze);
    if (state.hint && state.hint.length > 0) {
        drawHint(ctx, state.hint);
    }
    drawExit(ctx);
    drawPlayer(ctx, state.player);

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(BOARD_MARGIN - 1, BOARD_MARGIN - 1,
                   MAZE_WIDTH * CELL + 2, MAZE_HEIGHT * CELL + 2);

    if (state.isSolved) {
        drawMessage(ctx, boardPixelWidth(), boardPixelHeight(), 'OUT!',
                    state.steps + ' steps (best possible ' + state.shortest + ') — press N');
    } else if (state.isPaused) {
        drawMessage(ctx, boardPixelWidth(), boardPixelHeight(), 'PAUSED', 'Press P to carry on');
    }
}
