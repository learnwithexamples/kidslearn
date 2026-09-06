/* ============================================================
   twenty48-draw.js — everything you can see in 2048

   Black and white: small tiles are plain outlines, middling ones are shaded,
   and the big ones flip to solid black with white numbers. So the board still
   reads at a glance — you can see where your big tile is without reading it.
   ============================================================ */

const CELL = 66;
const BOARD_MARGIN = 10;
const TILE_GAP = 6;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_EMPTY = '#eeeeee';
const COLOR_SHADE = '#d2d2d2';

/** boardPixelSize — how big the square canvas must be. */
function boardPixelSize() {
    return BOARD_MARGIN * 2 + SIZE * CELL;
}

/** tileLeft / tileTop — the top-left corner of one square. */
function tileLeft(column) { return BOARD_MARGIN + column * CELL; }
function tileTop(row) { return BOARD_MARGIN + row * CELL; }

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * tileLook — how a tile of this value should be drawn.
 * INPUT: value. OUTPUT: { fill, text, weight }.
 * ALGORITHM: three bands, so the board is readable without colour.
 */
function tileLook(value) {
    if (value >= 256) {
        return { fill: COLOR_INK, text: COLOR_PAPER, weight: 'bold ' };
    }
    if (value >= 16) {
        return { fill: COLOR_SHADE, text: COLOR_INK, weight: 'bold ' };
    }
    return { fill: COLOR_PAPER, text: COLOR_INK, weight: '' };
}

/** tileFontSize — long numbers have to be drawn smaller to fit. */
function tileFontSize(value) {
    const digits = String(value).length;
    if (digits >= 4) { return 20; }
    if (digits === 3) { return 25; }
    return 30;
}

/** roundedBox — a square with softened corners. */
function roundedBox(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/** drawTile — one square, empty or with a number in it. */
function drawTile(ctx, column, row, value) {
    const x = tileLeft(column) + TILE_GAP / 2;
    const y = tileTop(row) + TILE_GAP / 2;
    const size = CELL - TILE_GAP;

    if (value === 0) {
        ctx.fillStyle = COLOR_EMPTY;
        roundedBox(ctx, x, y, size, size, 6);
        ctx.fill();
        return;
    }

    const look = tileLook(value);
    ctx.fillStyle = look.fill;
    roundedBox(ctx, x, y, size, size, 6);
    ctx.fill();
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    roundedBox(ctx, x + 1, y + 1, size - 2, size - 2, 6);
    ctx.stroke();

    ctx.fillStyle = look.text;
    ctx.font = look.weight + tileFontSize(value) + 'px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(value), x + size / 2, y + size / 2 + tileFontSize(value) / 3);
    ctx.textAlign = 'left';
}

/** drawMessage — big centred words across the board. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(0, height / 2 - 44, width, 88);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / boardPixelSize();
    const titleSize = Math.max(14, Math.round(30 * scale));
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

    for (let row = 0; row < SIZE; row++) {
        for (let column = 0; column < SIZE; column++) {
            drawTile(ctx, column, row, state.board[cellIndex(column, row)]);
        }
    }

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(BOARD_MARGIN - 2, BOARD_MARGIN - 2, SIZE * CELL + 4, SIZE * CELL + 4);

    if (state.isOver) {
        drawMessage(ctx, size, size, 'NO MOVES LEFT',
                    state.score + ' points — press R');
    } else if (state.isWon && !state.keepPlaying) {
        drawMessage(ctx, size, size, '2048!', 'Press SPACE to keep going');
    } else if (state.isPaused) {
        drawMessage(ctx, size, size, 'PAUSED', 'Press P to carry on');
    }
}
