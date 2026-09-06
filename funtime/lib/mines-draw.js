/* ============================================================
   mines-draw.js — everything you can see in Minesweeper

   Black and white: a covered square is shaded, an open one is plain paper, a
   flag is a little triangle on a pole, and a mine is a spiky black circle.
   The numbers are drawn in different weights so 1 and 8 look different at a
   glance even without colour.
   ============================================================ */

const CELL = 30;
const BOARD_MARGIN = 8;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_COVER = '#e6e6e6';
const COLOR_FAINT = '#bcbcbc';

/** boardPixelSize — how big the square canvas must be. */
function boardPixelSize() {
    return BOARD_MARGIN * 2 + GRID_SIZE * CELL;
}

/** cellLeft / cellTop — the top-left corner of one square. */
function cellLeft(column) { return BOARD_MARGIN + column * CELL; }
function cellTop(row) { return BOARD_MARGIN + row * CELL; }

/** cellAtPixel — which square did the player click? null if none. */
function cellAtPixel(x, y) {
    const column = Math.floor((x - BOARD_MARGIN) / CELL);
    const row = Math.floor((y - BOARD_MARGIN) / CELL);
    if (!isInsideGrid(column, row)) {
        return null;
    }
    return { column: column, row: row };
}

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawCovered — a square that has not been dug yet. */
function drawCovered(ctx, column, row) {
    const x = cellLeft(column);
    const y = cellTop(row);
    ctx.fillStyle = COLOR_COVER;
    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
    ctx.strokeStyle = COLOR_PAPER;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + CELL - 2);
    ctx.lineTo(x + 2, y + 2);
    ctx.lineTo(x + CELL - 2, y + 2);
    ctx.stroke();
}

/** drawOpen — a square that has been dug, with its number if it has one. */
function drawOpen(ctx, state, column, row) {
    const x = cellLeft(column);
    const y = cellTop(row);
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 1.5, y + 1.5, CELL - 3, CELL - 3);

    const count = countMines(state, column, row);
    if (count === 0) {
        return;
    }
    ctx.fillStyle = COLOR_INK;
    /* the bigger the number, the heavier it is drawn */
    ctx.font = (count >= 4 ? 'bold ' : '') + (13 + count) + 'px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(count), x + CELL / 2, y + CELL / 2 + 6);
    ctx.textAlign = 'left';
}

/** drawFlag — a triangle on a pole. */
function drawFlag(ctx, column, row) {
    const x = cellLeft(column);
    const y = cellTop(row);
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(x + CELL / 2 - 1, y + 7, 2, CELL - 14);
    ctx.fillRect(x + 8, y + CELL - 8, CELL - 16, 3);
    ctx.beginPath();
    ctx.moveTo(x + CELL / 2, y + 7);
    ctx.lineTo(x + CELL - 8, y + 11);
    ctx.lineTo(x + CELL / 2, y + 15);
    ctx.closePath();
    ctx.fill();
}

/** drawMine — a spiky black circle. */
function drawMine(ctx, column, row, exploded) {
    const x = cellLeft(column) + CELL / 2;
    const y = cellTop(row) + CELL / 2;

    if (exploded) {
        ctx.fillStyle = COLOR_INK;
        ctx.fillRect(cellLeft(column) + 1, cellTop(row) + 1, CELL - 2, CELL - 2);
        ctx.fillStyle = COLOR_PAPER;
    } else {
        ctx.fillStyle = COLOR_INK;
    }

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = exploded ? COLOR_PAPER : COLOR_INK;
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(angle) * 10, y - Math.sin(angle) * 10);
        ctx.lineTo(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10);
        ctx.stroke();
    }
}

/** drawCursor — the dashed box showing where the keyboard is pointing. */
function drawCursor(ctx, cursor) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(cellLeft(cursor.column) + 2, cellTop(cursor.row) + 2, CELL - 4, CELL - 4);
    ctx.setLineDash([]);
}

/** drawMessage — big centred words across the board. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(0, height / 2 - 42, width, 84);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / boardPixelSize();
    const titleSize = Math.max(14, Math.round(28 * scale));
    const subtitleSize = Math.max(9, Math.round(13 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 2);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    const size = boardPixelSize();
    clearCanvas(ctx, size, size, COLOR_PAPER);

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            const index = cellIndex(column, row);
            const isMine = state.mines[index];

            if (state.revealed[index]) {
                if (isMine) {
                    drawMine(ctx, column, row, index === state.hitMine);
                } else {
                    drawOpen(ctx, state, column, row);
                }
            } else if (state.isOver && isMine && !state.flagged[index]) {
                drawCovered(ctx, column, row);
                drawMine(ctx, column, row, false);
            } else {
                drawCovered(ctx, column, row);
                if (state.flagged[index]) {
                    drawFlag(ctx, column, row);
                }
            }
        }
    }

    if (!state.isOver) {
        drawCursor(ctx, state.cursor);
    }

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(BOARD_MARGIN - 1, BOARD_MARGIN - 1,
                   GRID_SIZE * CELL + 2, GRID_SIZE * CELL + 2);

    if (state.isWon) {
        drawMessage(ctx, size, size, 'CLEARED!',
                    'in ' + Math.round(state.seconds) + ' seconds');
    } else if (state.isOver) {
        drawMessage(ctx, size, size, 'BOOM!', 'Press R to try again');
    } else if (state.isPaused) {
        drawMessage(ctx, size, size, 'PAUSED', 'Press P to carry on');
    }
}
