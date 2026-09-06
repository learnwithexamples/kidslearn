/* ============================================================
   tictactoe-draw.js — everything you can see in Tic-Tac-Toe
   ============================================================ */

const CELL_SIZE = 100;
const BOARD_MARGIN = 12;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#bbbbbb';

/** boardPixelSize — how big the square canvas must be. */
function boardPixelSize() {
    return BOARD_MARGIN * 2 + GRID_SIZE * CELL_SIZE;
}

/** cellLeft / cellTop — where one square sits on the canvas. */
function cellLeft(column) { return BOARD_MARGIN + column * CELL_SIZE; }
function cellTop(row) { return BOARD_MARGIN + row * CELL_SIZE; }

/**
 * squareAtPixel — which square did the player click on?
 * INPUT: x, y. OUTPUT: { column, row } or null.
 */
function squareAtPixel(x, y) {
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

/** drawGridLines — the two vertical and two horizontal bars. */
function drawGridLines(ctx) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    for (let line = 1; line < GRID_SIZE; line++) {
        ctx.beginPath();
        ctx.moveTo(cellLeft(line), BOARD_MARGIN + 6);
        ctx.lineTo(cellLeft(line), BOARD_MARGIN + GRID_SIZE * CELL_SIZE - 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(BOARD_MARGIN + 6, cellTop(line));
        ctx.lineTo(BOARD_MARGIN + GRID_SIZE * CELL_SIZE - 6, cellTop(line));
        ctx.stroke();
    }
}

/**
 * drawMark — one X or one O.
 * INPUT: ctx, mark, column, row. OUTPUT: nothing.
 * ALGORITHM: an X is two crossing lines; an O is a circle. Both are drawn
 *            inside the square with a comfortable margin.
 */
function drawMark(ctx, mark, column, row) {
    if (mark === EMPTY) { return; }

    const x = cellLeft(column);
    const y = cellTop(row);
    const pad = 24;

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';

    if (mark === PLAYER) {
        ctx.beginPath();
        ctx.moveTo(x + pad, y + pad);
        ctx.lineTo(x + CELL_SIZE - pad, y + CELL_SIZE - pad);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + CELL_SIZE - pad, y + pad);
        ctx.lineTo(x + pad, y + CELL_SIZE - pad);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2 - pad, 0, Math.PI * 2);
        ctx.stroke();
    }
}

/** drawWinningLine — strike through the three winning squares. */
function drawWinningLine(ctx, line) {
    const first = line[0];
    const last = line[2];
    const fromX = cellLeft(first % GRID_SIZE) + CELL_SIZE / 2;
    const fromY = cellTop(Math.floor(first / GRID_SIZE)) + CELL_SIZE / 2;
    const toX = cellLeft(last % GRID_SIZE) + CELL_SIZE / 2;
    const toY = cellTop(Math.floor(last / GRID_SIZE)) + CELL_SIZE / 2;

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}

/** drawCursor — the dashed box showing where the keyboard cursor is. */
function drawCursor(ctx, cursor) {
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(cellLeft(cursor.column) + 6, cellTop(cursor.row) + 6, CELL_SIZE - 12, CELL_SIZE - 12);
    ctx.setLineDash([]);
}

/** drawMessage — big centred words across the board. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / 340;
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
    drawGridLines(ctx);

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            drawMark(ctx, state.board[squareIndex(column, row)], column, row);
        }
    }

    if (!state.isOver) {
        drawCursor(ctx, state.cursor);
    }
    if (state.line) {
        drawWinningLine(ctx, state.line);
    }

    if (state.isOver) {
        const title = state.winner === PLAYER ? 'YOU WIN!'
            : (state.winner === 'draw' ? 'A DRAW' : 'COMPUTER WINS');
        drawMessage(ctx, size, size, title, 'Press R or tap New for another round');
    } else if (state.isPaused) {
        drawMessage(ctx, size, size, 'PAUSED', 'Press P or tap Play to carry on');
    }
}
