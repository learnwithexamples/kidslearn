/* ============================================================
   whack-draw.js — everything you can see in Whack-a-Mole

   Black and white: a hole is a faint circle, and a mole is a black blob with
   two white eyes peeping out of it.
   ============================================================ */

const CELL_SIZE = 104;
const BOARD_MARGIN = 12;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#d0d0d0';

/** boardPixelSize — how big the square canvas must be. */
function boardPixelSize() {
    return BOARD_MARGIN * 2 + GRID_SIZE * CELL_SIZE;
}

function holeCentreX(column) { return BOARD_MARGIN + column * CELL_SIZE + CELL_SIZE / 2; }
function holeCentreY(row) { return BOARD_MARGIN + row * CELL_SIZE + CELL_SIZE / 2; }

/** holeAtPixel — which hole did the player hit? null for a miss. */
function holeAtPixel(x, y) {
    const column = Math.floor((x - BOARD_MARGIN) / CELL_SIZE);
    const row = Math.floor((y - BOARD_MARGIN) / CELL_SIZE);
    if (column < 0 || column >= GRID_SIZE || row < 0 || row >= GRID_SIZE) {
        return null;
    }
    return { column: column, row: row };
}

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawHole — the empty hole a mole might pop out of. */
function drawHole(ctx, column, row) {
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(holeCentreX(column), holeCentreY(row) + 10, CELL_SIZE / 2 - 14, CELL_SIZE / 5, 0, 0, Math.PI * 2);
    ctx.stroke();
}

/**
 * drawMole — the mole itself.
 * ALGORITHM: a black dome sitting in the hole, with two white eyes and a
 *            white nose so it reads clearly even in black and white.
 */
function drawMole(ctx, column, row) {
    const x = holeCentreX(column);
    const y = holeCentreY(row) + 8;
    const radius = CELL_SIZE / 2 - 22;

    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(x - radius, y, radius * 2, radius * 0.5);

    ctx.fillStyle = COLOR_PAPER;
    ctx.beginPath();
    ctx.arc(x - radius / 2.4, y - radius / 3, radius / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + radius / 2.4, y - radius / 3, radius / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + radius / 6, radius / 7, 0, Math.PI * 2);
    ctx.fill();
}

/** drawCursor — the dashed box showing where the hammer is aimed. */
function drawCursor(ctx, cursor) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(BOARD_MARGIN + cursor.column * CELL_SIZE + 6,
                   BOARD_MARGIN + cursor.row * CELL_SIZE + 6,
                   CELL_SIZE - 12, CELL_SIZE - 12);
    ctx.setLineDash([]);
}

/** drawMessage — big centred words across the board. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / 336;
    const titleSize = Math.max(14, Math.round(30 * scale));
    const subtitleSize = Math.max(9, Math.round(14 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 8);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    const size = boardPixelSize();
    clearCanvas(ctx, size, size, COLOR_PAPER);

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            drawHole(ctx, column, row);
            if (holeIndex(column, row) === state.mole) {
                drawMole(ctx, column, row);
            }
        }
    }

    if (!state.isOver) {
        drawCursor(ctx, state.cursor);
    }

    if (state.isOver) {
        drawMessage(ctx, size, size, 'TIME UP!',
                    state.hits + ' hits — ' + state.score + ' points');
    } else if (state.isPaused) {
        drawMessage(ctx, size, size, 'PAUSED', 'Press P or tap Play to carry on');
    }
}
