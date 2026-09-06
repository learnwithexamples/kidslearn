/* ============================================================
   simon-draw.js — everything you can see in Simon Says

   Four big pads. A pad that is lit turns solid black; the others are white
   with a thick outline and a pattern so you can still tell them apart.
   ============================================================ */

const PAD_SIZE = 130;
const PAD_GAP = 10;
const BOARD_MARGIN = 12;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';

/** boardPixelSize — how big the square canvas must be. */
function boardPixelSize() {
    return BOARD_MARGIN * 2 + PAD_SIZE * 2 + PAD_GAP;
}

/** padLeft / padTop — where one pad sits. Pads are numbered 0,1 / 2,3. */
function padLeft(pad) {
    return BOARD_MARGIN + (pad % 2) * (PAD_SIZE + PAD_GAP);
}

function padTop(pad) {
    return BOARD_MARGIN + Math.floor(pad / 2) * (PAD_SIZE + PAD_GAP);
}

/** padAtPixel — which pad did the player press? -1 for a miss. */
function padAtPixel(x, y) {
    for (let pad = 0; pad < PAD_COUNT; pad++) {
        if (x >= padLeft(pad) && x <= padLeft(pad) + PAD_SIZE &&
            y >= padTop(pad) && y <= padTop(pad) + PAD_SIZE) {
            return pad;
        }
    }
    return -1;
}

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * drawPad — one pad, lit or dark.
 * ALGORITHM: a lit pad is solid black with a white number; a dark one is
 *            white with a black border and a black number, plus a pattern of
 *            dots so each pad still looks different in black and white.
 */
function drawPad(ctx, pad, isLit) {
    const x = padLeft(pad);
    const y = padTop(pad);

    ctx.fillStyle = isLit ? COLOR_INK : COLOR_PAPER;
    ctx.fillRect(x, y, PAD_SIZE, PAD_SIZE);
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 2, y + 2, PAD_SIZE - 4, PAD_SIZE - 4);

    ctx.fillStyle = isLit ? COLOR_PAPER : COLOR_INK;
    for (let dot = 0; dot <= pad; dot++) {
        ctx.beginPath();
        ctx.arc(x + PAD_SIZE / 2 - pad * 9 + dot * 18, y + PAD_SIZE / 2, 7, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(String(pad + 1), x + PAD_SIZE - 20, y + PAD_SIZE - 14);
}

/** drawMessage — big centred words across the pads. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / 294;
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

    for (let pad = 0; pad < PAD_COUNT; pad++) {
        drawPad(ctx, pad, state.lit === pad);
    }

    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px monospace';
    const label = state.phase === 'watch' ? 'WATCH…'
        : (state.phase === 'play' ? 'YOUR TURN — ' + state.input.length + '/' + state.sequence.length : '');
    ctx.fillText(label, size / 2, BOARD_MARGIN - 1);

    if (state.isOver) {
        drawMessage(ctx, size, size, 'WRONG PAD',
                    'You reached round ' + state.round + ' — press R to try again');
    } else if (state.isPaused) {
        drawMessage(ctx, size, size, 'PAUSED', 'Press P or tap Play to carry on');
    }
}
