/* ============================================================
   lights-draw.js — everything you can see in Lights Out

   Black and white: a light that is ON is a black square with a white ring,
   and a light that is OFF is white with a thin grey border.
   ============================================================ */

const CELL_SIZE = 64;
const CELL_GAP = 6;
const BOARD_MARGIN = 10;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#cccccc';

/** boardPixelSize — how big the square canvas must be. */
function boardPixelSize() {
    return BOARD_MARGIN * 2 + GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_GAP;
}

/** cellLeft / cellTop — where one square sits on the canvas. */
function cellLeft(column) {
    return BOARD_MARGIN + column * (CELL_SIZE + CELL_GAP);
}

function cellTop(row) {
    return BOARD_MARGIN + row * (CELL_SIZE + CELL_GAP);
}

/**
 * squareAtPixel — which square did the player click on?
 * INPUT: x, y — canvas pixels. OUTPUT: { column, row }, or null for a gap.
 */
function squareAtPixel(x, y) {
    const column = Math.floor((x - BOARD_MARGIN) / (CELL_SIZE + CELL_GAP));
    const row = Math.floor((y - BOARD_MARGIN) / (CELL_SIZE + CELL_GAP));
    if (!isOnBoard(column, row)) {
        return null;
    }
    if (x - cellLeft(column) > CELL_SIZE || y - cellTop(row) > CELL_SIZE) {
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
 * drawLight — one square, lit or dark.
 * INPUT: ctx, isOn, column, row. OUTPUT: nothing.
 * ALGORITHM: a lit square is solid black with a white ring in the middle; an
 *            unlit one is white with a thin grey border.
 */
function drawLight(ctx, isOn, column, row) {
    const x = cellLeft(column);
    const y = cellTop(row);

    if (isOn) {
        ctx.fillStyle = COLOR_INK;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = COLOR_PAPER;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 4, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        ctx.fillStyle = COLOR_PAPER;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = COLOR_FAINT;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    }
}

/** drawCursor — the dashed box showing where the keyboard cursor is. */
function drawCursor(ctx, cursor) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(cellLeft(cursor.column) - 4, cellTop(cursor.row) - 4, CELL_SIZE + 8, CELL_SIZE + 8);
    ctx.setLineDash([]);
}

/** drawMessage — big centred words across the board. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / 370;
    const titleSize = Math.max(14, Math.round(32 * scale));
    const subtitleSize = Math.max(9, Math.round(15 * scale));

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
            drawLight(ctx, state.lights[lightIndex(column, row)], column, row);
        }
    }

    if (!state.isOver) {
        drawCursor(ctx, state.cursor);
    }

    if (state.isOver) {
        drawMessage(ctx, size, size, 'ALL OUT!', 'Solved in ' + state.moves + ' presses');
    } else if (state.isPaused) {
        drawMessage(ctx, size, size, 'PAUSED', 'Press P or tap Play to carry on');
    }
}
