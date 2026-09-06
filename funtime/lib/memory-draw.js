/* ============================================================
   memory-draw.js — everything you can see in Memory Match

   Black and white: a face-down card is a black rectangle with a white
   pattern, and a face-up card is white with a black symbol on it.
   ============================================================ */

const CARD_WIDTH = 76;
const CARD_HEIGHT = 96;
const CARD_GAP = 8;
const BOARD_MARGIN = 10;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#c8c8c8';

/**
 * boardPixelWidth / boardPixelHeight — how big the canvas must be.
 * INPUT: none. OUTPUT: a number of pixels.
 * ALGORITHM: the cards, plus the gaps between them, plus a margin each side.
 */
function boardPixelWidth() {
    return BOARD_MARGIN * 2 + GRID_COLUMNS * CARD_WIDTH + (GRID_COLUMNS - 1) * CARD_GAP;
}

function boardPixelHeight() {
    return BOARD_MARGIN * 2 + GRID_ROWS * CARD_HEIGHT + (GRID_ROWS - 1) * CARD_GAP;
}

/**
 * cardLeft / cardTop — where one card sits on the canvas.
 * INPUT: column or row. OUTPUT: the pixel position of its corner.
 */
function cardLeft(column) {
    return BOARD_MARGIN + column * (CARD_WIDTH + CARD_GAP);
}

function cardTop(row) {
    return BOARD_MARGIN + row * (CARD_HEIGHT + CARD_GAP);
}

/**
 * cardAtPixel — which card did the player click on?
 *
 * INPUT:  x, y — a position on the canvas, in pixels
 * OUTPUT: the index of the card there, or -1 for a click on the gaps
 *
 * ALGORITHM: take off the margin, divide by "one card plus one gap" to get the
 *            column and row, check the click was not in a gap, then turn the
 *            column and row into a list position with cardIndex.
 */
function cardAtPixel(x, y) {
    const column = Math.floor((x - BOARD_MARGIN) / (CARD_WIDTH + CARD_GAP));
    const row = Math.floor((y - BOARD_MARGIN) / (CARD_HEIGHT + CARD_GAP));
    if (column < 0 || column >= GRID_COLUMNS || row < 0 || row >= GRID_ROWS) {
        return -1;
    }
    if (x - cardLeft(column) > CARD_WIDTH || y - cardTop(row) > CARD_HEIGHT) {
        return -1;
    }
    return cardIndex(column, row);
}

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * drawSymbol — one of the eight shapes hiding on the cards.
 *
 * INPUT:  ctx, symbol (0 to 7), centreX, centreY, size
 * OUTPUT: nothing
 *
 * ALGORITHM: a small switch — circle, square, triangle, diamond, cross, star,
 *            ring, bars. Eight shapes that are easy to tell apart even in
 *            black and white.
 */
function drawSymbol(ctx, symbol, centreX, centreY, size) {
    const half = size / 2;
    ctx.fillStyle = COLOR_INK;
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 4;

    if (symbol === 0) {
        ctx.beginPath();
        ctx.arc(centreX, centreY, half, 0, Math.PI * 2);
        ctx.fill();
    } else if (symbol === 1) {
        ctx.fillRect(centreX - half, centreY - half, size, size);
    } else if (symbol === 2) {
        ctx.beginPath();
        ctx.moveTo(centreX, centreY - half);
        ctx.lineTo(centreX + half, centreY + half);
        ctx.lineTo(centreX - half, centreY + half);
        ctx.fill();
    } else if (symbol === 3) {
        ctx.beginPath();
        ctx.moveTo(centreX, centreY - half);
        ctx.lineTo(centreX + half, centreY);
        ctx.lineTo(centreX, centreY + half);
        ctx.lineTo(centreX - half, centreY);
        ctx.fill();
    } else if (symbol === 4) {
        ctx.fillRect(centreX - half / 3, centreY - half, size / 3, size);
        ctx.fillRect(centreX - half, centreY - half / 3, size, size / 3);
    } else if (symbol === 5) {
        ctx.beginPath();
        for (let point = 0; point < 8; point++) {
            const radius = point % 2 === 0 ? half : half / 2.4;
            const angle = (Math.PI / 4) * point - Math.PI / 2;
            const px = centreX + Math.cos(angle) * radius;
            const py = centreY + Math.sin(angle) * radius;
            if (point === 0) { ctx.moveTo(px, py); } else { ctx.lineTo(px, py); }
        }
        ctx.closePath();
        ctx.fill();
    } else if (symbol === 6) {
        ctx.beginPath();
        ctx.arc(centreX, centreY, half - 3, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        ctx.fillRect(centreX - half, centreY - half, size, size / 4);
        ctx.fillRect(centreX - half, centreY - size / 8, size, size / 4);
        ctx.fillRect(centreX - half, centreY + half - size / 4, size, size / 4);
    }
}

/**
 * drawCard — one card, face up or face down.
 *
 * INPUT:  ctx, card, column, row
 * OUTPUT: nothing
 *
 * ALGORITHM: a face-down card is solid black with a white diamond on it; a
 *            face-up card is white with its symbol; a matched card is white
 *            with a thin grey border, so found pairs fade into the background.
 */
function drawCard(ctx, card, column, row) {
    const x = cardLeft(column);
    const y = cardTop(row);

    if (card.faceUp || card.matched) {
        ctx.fillStyle = COLOR_PAPER;
        ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
        ctx.strokeStyle = card.matched ? COLOR_FAINT : COLOR_INK;
        ctx.lineWidth = card.matched ? 2 : 3;
        ctx.strokeRect(x + 1.5, y + 1.5, CARD_WIDTH - 3, CARD_HEIGHT - 3);
        drawSymbol(ctx, card.symbol, x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2, 40);
    } else {
        ctx.fillStyle = COLOR_INK;
        ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
        ctx.fillStyle = COLOR_PAPER;
        ctx.beginPath();
        ctx.moveTo(x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2 - 16);
        ctx.lineTo(x + CARD_WIDTH / 2 + 16, y + CARD_HEIGHT / 2);
        ctx.lineTo(x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2 + 16);
        ctx.lineTo(x + CARD_WIDTH / 2 - 16, y + CARD_HEIGHT / 2);
        ctx.fill();
    }
}

/**
 * drawCursor — the box showing where the keyboard cursor is.
 * INPUT: ctx, cursor. OUTPUT: nothing.
 */
function drawCursor(ctx, cursor) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(cardLeft(cursor.column) - 4, cardTop(cursor.row) - 4,
                   CARD_WIDTH + 8, CARD_HEIGHT + 8);
    ctx.setLineDash([]);
}

/** drawMessage — big centred words across the board. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / 350;
    const titleSize = Math.max(14, Math.round(32 * scale));
    const subtitleSize = Math.max(9, Math.round(15 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 8);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
}

/**
 * renderGame — draw one complete frame.
 * INPUT: ctx, state. OUTPUT: nothing.
 * ALGORITHM: clear, draw every card in its place, draw the cursor, then any
 *            message over the top.
 */
function renderGame(ctx, state) {
    const width = boardPixelWidth();
    const height = boardPixelHeight();

    clearCanvas(ctx, width, height, COLOR_PAPER);

    for (let row = 0; row < GRID_ROWS; row++) {
        for (let column = 0; column < GRID_COLUMNS; column++) {
            drawCard(ctx, state.cards[cardIndex(column, row)], column, row);
        }
    }

    if (!state.isOver) {
        drawCursor(ctx, state.cursor);
    }

    if (state.isOver) {
        const stars = starsForMoves(state.moves);
        drawMessage(ctx, width, height, 'ALL FOUND!',
                    state.moves + ' moves — ' + '★'.repeat(stars) + '☆'.repeat(3 - stars));
    } else if (state.isPaused) {
        drawMessage(ctx, width, height, 'PAUSED', 'Press P or tap Play to carry on');
    }
}
