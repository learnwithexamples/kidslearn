/* ============================================================
   bubbles-draw.js — everything you can see in Bubble Shooter

   Five kinds of bubble, told apart by their PATTERN rather than their colour:
   solid, plain ring, ring with a dot, striped, and crossed.
   ============================================================ */

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#e0e0e0';

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawFrame — the thin border round the field. */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
}

/**
 * drawBubble — one bubble, drawn by its kind.
 * INPUT: ctx, kind (0 to 4), x and y of the middle.
 * ALGORITHM: every bubble is the same circle; the pattern inside is what
 *            tells them apart, so the game needs no colour at all.
 */
function drawBubble(ctx, kind, x, y) {
    const r = BUBBLE_RADIUS;

    ctx.fillStyle = COLOR_PAPER;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = COLOR_INK;
    ctx.strokeStyle = COLOR_INK;

    if (kind === 0) {                        /* solid */
        ctx.beginPath();
        ctx.arc(x, y, r - 3, 0, Math.PI * 2);
        ctx.fill();

    } else if (kind === 1) {                 /* plain ring — nothing inside */
        return;

    } else if (kind === 2) {                 /* a dot in the middle */
        ctx.beginPath();
        ctx.arc(x, y, r / 2.4, 0, Math.PI * 2);
        ctx.fill();

    } else if (kind === 3) {                 /* stripes */
        ctx.lineWidth = 1.6;
        for (let i = -1; i <= 1; i++) {
            const offset = i * 4;
            const reach = Math.sqrt(Math.max(0, (r - 3) * (r - 3) - offset * offset));
            ctx.beginPath();
            ctx.moveTo(x - reach, y + offset);
            ctx.lineTo(x + reach, y + offset);
            ctx.stroke();
        }

    } else {                                 /* a cross */
        ctx.lineWidth = 2;
        const reach = (r - 3) * 0.72;
        ctx.beginPath();
        ctx.moveTo(x - reach, y - reach);
        ctx.lineTo(x + reach, y + reach);
        ctx.moveTo(x + reach, y - reach);
        ctx.lineTo(x - reach, y + reach);
        ctx.stroke();
    }
}

/** drawCeiling — the line the bubbles hang from. */
function drawCeiling(ctx) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 1.5);
    ctx.lineTo(FIELD_WIDTH, 1.5);
    ctx.stroke();
}

/** drawDangerLine — how far down the bubbles are allowed to reach. */
function drawDangerLine(ctx) {
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(0, GRID_HEIGHT - CELL);
    ctx.lineTo(FIELD_WIDTH, GRID_HEIGHT - CELL);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * drawShooter — the aiming arrow and the bubble waiting in it.
 * ALGORITHM: a dashed line along the angle shows where the shot will go, and
 *            without it aiming would be pure guesswork.
 */
function drawShooter(ctx, state) {
    const reach = 46;
    const tip = {
        x: SHOOTER_X + Math.cos(state.angle) * reach,
        y: SHOOTER_Y + Math.sin(state.angle) * reach
    };

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(SHOOTER_X, SHOOTER_Y);
    ctx.lineTo(tip.x, tip.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(SHOOTER_X, SHOOTER_Y, BUBBLE_RADIUS + 4, 0, Math.PI * 2);
    ctx.stroke();

    drawBubble(ctx, state.holding, SHOOTER_X, SHOOTER_Y);
}

/** drawNext — the bubble you will be given after this one. */
function drawNext(ctx, state) {
    ctx.fillStyle = COLOR_FAINT;
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('NEXT', 8, SHOOTER_Y - 14);
    drawBubble(ctx, state.next, 20, SHOOTER_Y + 4);
}

/** drawScore — the score in the bottom corner. */
function drawScore(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(String(state.score), FIELD_WIDTH - 10, SHOOTER_Y + 4);
    ctx.textAlign = 'left';
}

/** drawMessage — big centred words across the field. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    ctx.fillRect(0, height / 2 - 42, width, 84);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / FIELD_WIDTH;
    const titleSize = Math.max(13, Math.round(24 * scale));
    const subtitleSize = Math.max(9, Math.round(11 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 2);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);
    drawDangerLine(ctx);

    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            const kind = state.grid[bubbleIndex(column, row)];
            if (kind !== EMPTY) {
                const centre = bubbleCentre(column, row);
                drawBubble(ctx, kind, centre.x, centre.y);
            }
        }
    }

    drawCeiling(ctx);

    if (state.flying) {
        drawBubble(ctx, state.flying.kind, state.flying.x, state.flying.y);
    }

    if (!state.isOver) {
        drawShooter(ctx, state);
    }
    drawNext(ctx, state);
    drawScore(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'FULL UP!',
                    state.score + ' points — press R');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'PAUSED', 'Press P to carry on');
    }
}
