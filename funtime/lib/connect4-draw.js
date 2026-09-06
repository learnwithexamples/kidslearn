/* ============================================================
   connect4-draw.js — everything you can see in Connect Four

   Black and white: your counters are solid black discs, the computer's are
   hollow rings, and empty holes are faint circles.
   ============================================================ */

const CELL_SIZE = 52;
const BOARD_MARGIN = 10;
const DROP_STRIP = 34;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#cfcfcf';

/** boardPixelWidth / boardPixelHeight — how big the canvas must be. */
function boardPixelWidth() {
    return BOARD_MARGIN * 2 + COLUMNS * CELL_SIZE;
}

function boardPixelHeight() {
    return BOARD_MARGIN * 2 + DROP_STRIP + ROWS * CELL_SIZE;
}

/** holeCentre — the middle of one hole, in pixels. */
function holeCentreX(column) {
    return BOARD_MARGIN + column * CELL_SIZE + CELL_SIZE / 2;
}

function holeCentreY(row) {
    return BOARD_MARGIN + DROP_STRIP + row * CELL_SIZE + CELL_SIZE / 2;
}

/** columnAtPixel — which column did the player click on? -1 for a miss. */
function columnAtPixel(x) {
    const column = Math.floor((x - BOARD_MARGIN) / CELL_SIZE);
    return (column >= 0 && column < COLUMNS) ? column : -1;
}

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * drawCounter — one hole, empty or holding a counter.
 * INPUT: ctx, mark, centreX, centreY, radius. OUTPUT: nothing.
 * ALGORITHM: an empty hole is a faint outline; yours is a solid black disc;
 *            the computer's is a thick black ring.
 */
function drawCounter(ctx, mark, centreX, centreY, radius) {
    ctx.beginPath();
    ctx.arc(centreX, centreY, radius, 0, Math.PI * 2);

    if (mark === PLAYER) {
        ctx.fillStyle = COLOR_INK;
        ctx.fill();
    } else if (mark === COMPUTER) {
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 7;
        ctx.stroke();
    } else {
        ctx.strokeStyle = COLOR_FAINT;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

/** drawBoardFrame — the border around the playing area. */
function drawBoardFrame(ctx) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(BOARD_MARGIN - 4, BOARD_MARGIN + DROP_STRIP - 4,
                   COLUMNS * CELL_SIZE + 8, ROWS * CELL_SIZE + 8);
}

/** drawDropMarker — the counter waiting above the column you have chosen. */
function drawDropMarker(ctx, column) {
    drawCounter(ctx, PLAYER, holeCentreX(column), BOARD_MARGIN + DROP_STRIP / 2, CELL_SIZE / 2 - 8);
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(holeCentreX(column), BOARD_MARGIN + DROP_STRIP - 2);
    ctx.lineTo(holeCentreX(column), BOARD_MARGIN + DROP_STRIP + 10);
    ctx.stroke();
    ctx.setLineDash([]);
}

/** drawMessage — big centred words across the board. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / 384;
    const titleSize = Math.max(14, Math.round(30 * scale));
    const subtitleSize = Math.max(9, Math.round(14 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 8);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    const width = boardPixelWidth();
    const height = boardPixelHeight();

    clearCanvas(ctx, width, height, COLOR_PAPER);

    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            drawCounter(ctx, state.board[cellIndex(column, row)],
                        holeCentreX(column), holeCentreY(row), CELL_SIZE / 2 - 6);
        }
    }
    drawBoardFrame(ctx);

    if (!state.isOver && !state.isPaused) {
        drawDropMarker(ctx, state.cursor);
    }

    if (state.isOver) {
        const title = state.winner === PLAYER ? 'YOU WIN!'
            : (state.winner === 'draw' ? 'A DRAW' : 'COMPUTER WINS');
        drawMessage(ctx, width, height, title, 'Press R or tap New for another round');
    } else if (state.isPaused) {
        drawMessage(ctx, width, height, 'PAUSED', 'Press P or tap Play to carry on');
    }
}
