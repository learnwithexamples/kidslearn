/* ============================================================
   match3-draw.js — everything you can see in Match Three

   Six different SHAPES, not six colours — a circle, a square, a triangle, a
   diamond, a star and a cross. That way the game works in black and white,
   and it works for a colour-blind player too, which is worth remembering
   whenever you are tempted to make colour carry the meaning.
   ============================================================ */

const CELL = 34;
const BOARD_MARGIN = 8;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#e2e2e2';

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
    if (!isInsideBoard(column, row)) {
        return null;
    }
    return { column: column, row: row };
}

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * drawShape — one of the six shapes, drawn in the middle of a square.
 * INPUT: ctx, shape (0 to 5), x and y of the middle, size.
 * ALGORITHM: one branch per shape. Shapes 0, 2 and 4 are solid and 1, 3 and 5
 *            are outlines, so even two similar shapes never look alike.
 */
function drawShape(ctx, shape, x, y, size) {
    const r = size / 2;
    ctx.strokeStyle = COLOR_INK;
    ctx.fillStyle = COLOR_INK;
    ctx.lineWidth = 2.5;

    if (shape === 0) {                       /* solid circle */
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

    } else if (shape === 1) {                /* hollow square */
        ctx.strokeRect(x - r, y - r, r * 2, r * 2);

    } else if (shape === 2) {                /* solid triangle */
        ctx.beginPath();
        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y + r);
        ctx.lineTo(x - r, y + r);
        ctx.closePath();
        ctx.fill();

    } else if (shape === 3) {                /* hollow diamond */
        ctx.beginPath();
        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y);
        ctx.lineTo(x, y + r);
        ctx.lineTo(x - r, y);
        ctx.closePath();
        ctx.stroke();

    } else if (shape === 4) {                /* solid star */
        ctx.beginPath();
        for (let point = 0; point < 10; point++) {
            const reach = point % 2 === 0 ? r : r * 0.45;
            const angle = -Math.PI / 2 + point * Math.PI / 5;
            const px = x + Math.cos(angle) * reach;
            const py = y + Math.sin(angle) * reach;
            if (point === 0) { ctx.moveTo(px, py); } else { ctx.lineTo(px, py); }
        }
        ctx.closePath();
        ctx.fill();

    } else {                                 /* hollow cross */
        ctx.beginPath();
        ctx.moveTo(x - r, y - r);
        ctx.lineTo(x + r, y + r);
        ctx.moveTo(x + r, y - r);
        ctx.lineTo(x - r, y + r);
        ctx.stroke();
    }
}

/** drawGrid — the faint lines between the squares. */
function drawGrid(ctx) {
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_MARGIN + i * CELL, BOARD_MARGIN);
        ctx.lineTo(BOARD_MARGIN + i * CELL, BOARD_MARGIN + GRID_SIZE * CELL);
        ctx.moveTo(BOARD_MARGIN, BOARD_MARGIN + i * CELL);
        ctx.lineTo(BOARD_MARGIN + GRID_SIZE * CELL, BOARD_MARGIN + i * CELL);
        ctx.stroke();
    }
}

/** drawPicked — the heavy box round the shape waiting to be swapped. */
function drawPicked(ctx, square) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(cellLeft(square.column) + 2, cellTop(square.row) + 2, CELL - 4, CELL - 4);
}

/** drawCursor — the dashed box showing where the keyboard is pointing. */
function drawCursor(ctx, cursor) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(cellLeft(cursor.column) + 4, cellTop(cursor.row) + 4, CELL - 8, CELL - 8);
    ctx.setLineDash([]);
}

/** drawMessage — big centred words across the board. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    ctx.fillRect(0, height / 2 - 40, width, 80);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / boardPixelSize();
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
    const size = boardPixelSize();
    clearCanvas(ctx, size, size, COLOR_PAPER);
    drawGrid(ctx);

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            const shape = state.board[gemIndex(column, row)];
            if (shape !== EMPTY) {
                drawShape(ctx, shape, cellLeft(column) + CELL / 2,
                          cellTop(row) + CELL / 2, CELL - 16);
            }
        }
    }

    if (state.picked) {
        drawPicked(ctx, state.picked);
    }
    if (!state.isOver) {
        drawCursor(ctx, state.cursor);
    }

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(BOARD_MARGIN - 1, BOARD_MARGIN - 1,
                   GRID_SIZE * CELL + 2, GRID_SIZE * CELL + 2);

    if (state.isPaused) {
        drawMessage(ctx, size, size, 'PAUSED', 'Press P to carry on');
    }
}
