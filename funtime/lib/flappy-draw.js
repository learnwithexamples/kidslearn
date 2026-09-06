/* ============================================================
   flappy-draw.js — everything you can see in Flappy

   Black and white: the pipes are outlined boxes with a striped lip, and the
   bird is a circle with a beak, tipped up or down by how fast it is moving.
   ============================================================ */

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#d8d8d8';

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawFrame — the thin border round the sky. */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
}

/** drawSky — faint clouds, so the pipes have something to slide past. */
function drawSky(ctx, offset) {
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
        const x = ((i * 90) - (offset % 360) + 360) % 360 - 30;
        const y = 40 + (i % 3) * 70;
        ctx.beginPath();
        ctx.arc(x, y, 14, Math.PI * 0.9, Math.PI * 2.1);
        ctx.arc(x + 18, y - 4, 17, Math.PI * 0.9, Math.PI * 2.1);
        ctx.arc(x + 36, y, 13, Math.PI * 0.9, Math.PI * 2.1);
        ctx.stroke();
    }
}

/** drawGround — the striped floor the bird must not touch. */
function drawGround(ctx, offset) {
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(0, GROUND_Y, FIELD_WIDTH, FIELD_HEIGHT - GROUND_Y);
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(FIELD_WIDTH, GROUND_Y);
    ctx.stroke();

    ctx.lineWidth = 1;
    for (let x = -20; x < FIELD_WIDTH + 20; x += 14) {
        const slid = x - (offset % 14);
        ctx.beginPath();
        ctx.moveTo(slid, GROUND_Y + 4);
        ctx.lineTo(slid + 10, FIELD_HEIGHT - 4);
        ctx.stroke();
    }
}

/**
 * drawPipe — one pipe, both halves.
 * ALGORITHM: draw each rectangle as a white box with a black outline, then a
 *            thicker "lip" at the end nearest the gap, the way the arcade
 *            original did it.
 */
function drawPipe(ctx, pipe) {
    const rects = pipeRects(pipe);
    [rects.top, rects.bottom].forEach(function (rect) {
        if (rect.height <= 0) { return; }
        ctx.fillStyle = COLOR_PAPER;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2);

        ctx.lineWidth = 1;
        for (let y = rect.y + 6; y < rect.y + rect.height - 4; y += 9) {
            ctx.beginPath();
            ctx.moveTo(rect.x + 5, y);
            ctx.lineTo(rect.x + rect.width - 5, y);
            ctx.stroke();
        }
    });

    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(pipe.x - 3, pipe.gapY - 12, PIPE_WIDTH + 6, 12);
    ctx.fillRect(pipe.x - 3, pipe.gapY + GAP_HEIGHT, PIPE_WIDTH + 6, 12);
}

/**
 * drawBird — the bird itself.
 * ALGORITHM: a black circle with a white eye and a small beak, tipped by how
 *            fast it is going up or down — that tilt is what makes a plain
 *            circle read as a flying bird.
 */
function drawBird(ctx, bird) {
    const x = BIRD_X + BIRD_SIZE / 2;
    const y = bird.y + BIRD_SIZE / 2;
    const tilt = Math.max(-0.5, Math.min(0.9, bird.dy / 500));

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLOR_PAPER;
    ctx.beginPath();
    ctx.arc(3, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(4, -3, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2 - 2, 1);
    ctx.lineTo(BIRD_SIZE / 2 + 7, 4);
    ctx.lineTo(BIRD_SIZE / 2 - 2, 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = COLOR_PAPER;
    ctx.beginPath();
    ctx.ellipse(-3, 2, 6, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
}

/** drawScore — the big number at the top. */
function drawScore(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = 'bold 30px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(state.score), FIELD_WIDTH / 2, 46);
    ctx.textAlign = 'left';
}

/** drawMessage — big centred words across the sky. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(0, height / 2 - 46, width, 92);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / FIELD_WIDTH;
    const titleSize = Math.max(14, Math.round(26 * scale));
    const subtitleSize = Math.max(9, Math.round(12 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 4);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    const scrolled = state.scrolled || 0;
    drawSky(ctx, scrolled);

    for (let i = 0; i < state.pipes.length; i++) {
        drawPipe(ctx, state.pipes[i]);
    }

    drawGround(ctx, scrolled);
    drawBird(ctx, state.bird);
    drawScore(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'CRASH!',
                    state.score + ' pipes — press R to try again');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'READY?', 'Press SPACE to flap');
    }
}
