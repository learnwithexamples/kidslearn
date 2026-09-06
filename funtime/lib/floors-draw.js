/* ============================================================
   floors-draw.js — everything you can see in Hundred Floors

   Six kinds of platform, told apart by their PATTERN rather than by colour:
   a plain bar, a bar with 锯齿 sawteeth on top, arrows for the sliding ones, a
   coil for the spring, and a broken dashed bar for the one about to give way.

   Everything is drawn through screenY, because the world stays still and the
   camera is what moves.
   ============================================================ */

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#d6d6d6';

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawFrame — the thin border round the shaft. */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
}

/**
 * drawSawteeth — a row of 锯齿, the spikes that cost you blood.
 * INPUT: ctx, x, y, width, height, pointingUp. OUTPUT: nothing.
 * ALGORITHM: walk along in steps, drawing a triangle each time. The same
 *            function draws the platform spikes and the ceiling ones — the
 *            only difference is which way up they point.
 */
function drawSawteeth(ctx, x, y, width, height, pointingUp) {
    const step = 8;
    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    for (let at = 0; at + step <= width; at = at + step) {
        if (pointingUp) {
            ctx.moveTo(x + at, y);
            ctx.lineTo(x + at + step / 2, y - height);
            ctx.lineTo(x + at + step, y);
        } else {
            ctx.moveTo(x + at, y);
            ctx.lineTo(x + at + step / 2, y + height);
            ctx.lineTo(x + at + step, y);
        }
        ctx.closePath();
    }
    ctx.fill();
}

/** drawCeiling — the spiked lid of the shaft, which you do not want to touch. */
function drawCeiling(ctx) {
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(0, 0, FIELD_WIDTH, CEILING_HEIGHT - 8);
    drawSawteeth(ctx, 0, CEILING_HEIGHT - 8, FIELD_WIDTH, 8, false);
}

/**
 * drawPlatform — one platform, drawn by its kind.
 * INPUT: ctx, state, platform. OUTPUT: nothing.
 */
function drawPlatform(ctx, state, platform) {
    const x = platform.x;
    const y = screenY(state, platform.y);
    const w = PLATFORM_WIDTH;
    const h = PLATFORM_HEIGHT;

    if (platform.kind === CRUMBLING) {
        /* a broken bar, and it fades as it gives way */
        ctx.strokeStyle = platform.crumbling > 0 ? COLOR_FAINT : COLOR_INK;
        ctx.lineWidth = 3;
        ctx.setLineDash([7, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y + h / 2);
        ctx.lineTo(x + w, y + h / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        return;
    }

    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(x, y, w, h);

    if (platform.kind === SPIKED) {
        drawSawteeth(ctx, x, y, w, 9, true);

    } else if (platform.kind === SLIDE_LEFT || platform.kind === SLIDE_RIGHT) {
        const pointsRight = platform.kind === SLIDE_RIGHT;
        ctx.fillStyle = COLOR_PAPER;
        for (let i = 0; i < 3; i++) {
            const at = x + 12 + i * 18;
            ctx.beginPath();
            if (pointsRight) {
                ctx.moveTo(at, y + 2);
                ctx.lineTo(at + 7, y + h / 2);
                ctx.lineTo(at, y + h - 2);
            } else {
                ctx.moveTo(at + 7, y + 2);
                ctx.lineTo(at, y + h / 2);
                ctx.lineTo(at + 7, y + h - 2);
            }
            ctx.closePath();
            ctx.fill();
        }

    } else if (platform.kind === SPRING) {
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 10, y);
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(x + 14 + i * 8, y - (i % 2 === 0 ? 8 : 0));
        }
        ctx.stroke();
    }
}

/**
 * drawPlayer — the little person.
 * ALGORITHM: a head, a body and two legs, with the legs apart while falling
 *            and together while standing, so you can see at a glance whether
 *            you are safely on something.
 */
function drawPlayer(ctx, state) {
    const player = state.player;
    const x = player.x;
    const y = screenY(state, player.y);
    const middle = x + PLAYER_WIDTH / 2;

    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(middle, y + 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(middle - 5, y + 12, 10, 8);

    const apart = player.riding ? 2 : 5;
    ctx.fillRect(middle - apart - 2, y + 20, 3, 4);
    ctx.fillRect(middle + apart - 1, y + 20, 3, 4);

    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(middle - 3, y + 4, 2, 2);
    ctx.fillRect(middle + 1, y + 4, 2, 2);
}

/**
 * drawHealth — the blood bar: one block per point left.
 * ALGORITHM: ten outlined boxes, filled in while you still have that much
 *            blood. No colour needed — full or empty says it all.
 */
function drawHealth(ctx, state) {
    const left = 10;
    const top = FIELD_HEIGHT - 22;
    const box = 11;

    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'left';
    ctx.fillText('BLOOD', left, top - 5);

    for (let i = 0; i < MAX_HEALTH; i++) {
        const x = left + i * (box + 2);
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, top, box, box);
        if (i < state.health) {
            ctx.fillStyle = COLOR_INK;
            ctx.fillRect(x + 2, top + 2, box - 4, box - 4);
        }
    }
}

/** drawFloor — how far down you have got. */
function drawFloor(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('FLOOR ' + state.floor, FIELD_WIDTH - 8, FIELD_HEIGHT - 10);
    ctx.textAlign = 'left';
}

/** drawMessage — big centred words across the shaft. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    ctx.fillRect(0, height / 2 - 42, width, 84);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / FIELD_WIDTH;
    const titleSize = Math.max(13, Math.round(26 * scale));
    const subtitleSize = Math.max(9, Math.round(12 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 2);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);

    /* the walls of the shaft, so it is obvious you cannot leave sideways */
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.lineTo(2, FIELD_HEIGHT);
    ctx.moveTo(FIELD_WIDTH - 2, 0);
    ctx.lineTo(FIELD_WIDTH - 2, FIELD_HEIGHT);
    ctx.stroke();

    for (let i = 0; i < state.platforms.length; i++) {
        drawPlatform(ctx, state, state.platforms[i]);
    }

    drawPlayer(ctx, state);
    drawCeiling(ctx);
    drawHealth(ctx, state);
    drawFloor(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver) {
        const why = state.health <= 0 ? 'NO BLOOD LEFT' : 'YOU MISSED!';
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, why,
                    'floor ' + state.floor + ' — press R to try again');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'PAUSED', 'Press P to carry on');
    }
}
