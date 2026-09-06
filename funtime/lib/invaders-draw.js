/* ============================================================
   invaders-draw.js — everything you can see in Space Invaders

   Black and white: each row of aliens has a different shape, so you can tell
   the 40-point back row from the 10-point front row without any colour.
   ============================================================ */

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#dcdcdc';

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawFrame — the thin border round space. */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
}

/** drawStars — a few faint dots so space is not just empty paper. */
function drawStars(ctx) {
    ctx.fillStyle = COLOR_FAINT;
    for (let i = 0; i < 26; i++) {
        const x = (i * 97) % (FIELD_WIDTH - 12) + 6;
        const y = (i * 61) % (FIELD_HEIGHT - 60) + 8;
        ctx.fillRect(x, y, 2, 2);
    }
}

/**
 * drawAlien — one alien.
 * ALGORITHM: a body block plus two legs, with the head shape decided by the
 *            row — round for the back row, square for the middle, spiky for
 *            the front. Different shapes, one colour.
 */
function drawAlien(ctx, alien, state) {
    const rect = alienRect(alien, state);
    const middleX = rect.x + rect.width / 2;

    ctx.fillStyle = COLOR_INK;

    if (alien.row === 0) {
        ctx.beginPath();
        ctx.arc(middleX, rect.y + 8, 8, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(rect.x + 3, rect.y + 8, rect.width - 6, 5);
    } else if (alien.row === 1) {
        ctx.fillRect(rect.x + 4, rect.y + 2, rect.width - 8, 11);
    } else {
        ctx.beginPath();
        ctx.moveTo(middleX, rect.y + 1);
        ctx.lineTo(rect.x + rect.width - 3, rect.y + 12);
        ctx.lineTo(rect.x + 3, rect.y + 12);
        ctx.closePath();
        ctx.fill();
    }

    /* eyes */
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(middleX - 5, rect.y + 6, 3, 3);
    ctx.fillRect(middleX + 2, rect.y + 6, 3, 3);

    /* legs */
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(rect.x + 2, rect.y + 13, 4, 5);
    ctx.fillRect(rect.x + rect.width - 6, rect.y + 13, 4, 5);
}

/** drawShip — the player's ship: a block with a gun barrel on top. */
function drawShip(ctx, state) {
    const rect = shipRect(state);
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(rect.x, rect.y + 5, rect.width, rect.height - 5);
    ctx.fillRect(rect.x + rect.width / 2 - 3, rect.y, 6, 7);
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(rect.x + 4, rect.y + 8, 4, 3);
    ctx.fillRect(rect.x + rect.width - 8, rect.y + 8, 4, 3);
}

/** drawShot — a bullet or a bomb. Bombs are drawn hollow so they differ. */
function drawShot(ctx, shot, hollow) {
    const rect = bulletRect(shot);
    if (hollow) {
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(rect.x - 1, rect.y, rect.width + 2, rect.height);
    } else {
        ctx.fillStyle = COLOR_INK;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
}

/** drawStatus — the score along the top and the lives along the bottom. */
function drawStatus(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE ' + state.score, 8, 20);
    ctx.textAlign = 'right';
    ctx.fillText('WAVE ' + state.wave, FIELD_WIDTH - 8, 20);
    ctx.textAlign = 'left';

    for (let i = 0; i < state.lives; i++) {
        ctx.fillRect(8 + i * 16, FIELD_HEIGHT - 12, 11, 5);
        ctx.fillRect(11 + i * 16, FIELD_HEIGHT - 15, 5, 3);
    }
}

/** drawMessage — big centred words across space. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(0, height / 2 - 42, width, 84);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / FIELD_WIDTH;
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
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);
    drawStars(ctx);

    for (let i = 0; i < state.aliens.length; i++) {
        if (state.aliens[i].alive) {
            drawAlien(ctx, state.aliens[i], state);
        }
    }

    for (let i = 0; i < state.bullets.length; i++) { drawShot(ctx, state.bullets[i], false); }
    for (let i = 0; i < state.bombs.length; i++) { drawShot(ctx, state.bombs[i], true); }

    drawShip(ctx, state);
    drawStatus(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'GAME OVER',
                    state.score + ' points — press R');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'PAUSED', 'Press P to carry on');
    }
}
