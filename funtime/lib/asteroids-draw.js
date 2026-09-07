/* ============================================================
   asteroids-draw.js — everything you can see in Asteroids

   The original arcade machine drew with a beam that traced LINES rather than
   filling in pixels, which is why everything in this game is an outline. It
   suits black and white perfectly.
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
    for (let i = 0; i < 30; i++) {
        const x = (i * 113) % (FIELD_WIDTH - 12) + 6;
        const y = (i * 71) % (FIELD_HEIGHT - 12) + 6;
        ctx.fillRect(x, y, 2, 2);
    }
}

/**
 * drawShip — an outlined triangle pointing the way it is going.
 * ALGORITHM: three points worked out with pointFrom — the nose straight
 *            ahead, and two back corners a little over half a turn away on
 *            either side. Rotating the ship is then just changing one number.
 */
function drawShip(ctx, ship, thrusting) {
    const nose = pointFrom(ship.x, ship.y, ship.angle, SHIP_RADIUS + 4);
    const left = pointFrom(ship.x, ship.y, ship.angle + 2.5, SHIP_RADIUS);
    const right = pointFrom(ship.x, ship.y, ship.angle - 2.5, SHIP_RADIUS);

    ctx.strokeStyle = COLOR_INK;
    ctx.fillStyle = COLOR_PAPER;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(nose.x, nose.y);
    ctx.lineTo(left.x, left.y);
    ctx.lineTo(ship.x, ship.y);
    ctx.lineTo(right.x, right.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (thrusting) {
        const flame = pointFrom(ship.x, ship.y, ship.angle + Math.PI, SHIP_RADIUS + 7);
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(flame.x, flame.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
    }
}

/** drawShield — the dashed ring that means "you cannot be hit yet". */
function drawShield(ctx, ship) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, SHIP_RADIUS + 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * drawRock — a lumpy outlined circle.
 * ALGORITHM: ask rockPoints for the corners, then join them up. The shape is
 *            worked out in the rules, so the drawing has no maths in it at
 *            all — and the shape can be tested without drawing anything.
 */
function drawRock(ctx, rock) {
    const corners = rockPoints(rock);

    ctx.strokeStyle = COLOR_INK;
    ctx.fillStyle = COLOR_PAPER;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < corners.length; i++) {
        if (i === 0) {
            ctx.moveTo(corners[i].x, corners[i].y);
        } else {
            ctx.lineTo(corners[i].x, corners[i].y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

/** drawBullet — a small solid dot. */
function drawBullet(ctx, bullet) {
    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
}

/** drawStatus — the score along the top and the lives beneath it. */
function drawStatus(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(String(state.score), 10, 22);
    ctx.textAlign = 'right';
    ctx.fillText('WAVE ' + state.wave, FIELD_WIDTH - 10, 22);
    ctx.textAlign = 'left';

    for (let i = 0; i < state.lives; i++) {
        const spare = { x: 18 + i * 18, y: 40, angle: -Math.PI / 2 };
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 1.5;
        const nose = pointFrom(spare.x, spare.y, spare.angle, 7);
        const left = pointFrom(spare.x, spare.y, spare.angle + 2.5, 5);
        const right = pointFrom(spare.x, spare.y, spare.angle - 2.5, 5);
        ctx.beginPath();
        ctx.moveTo(nose.x, nose.y);
        ctx.lineTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.closePath();
        ctx.stroke();
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

    for (let i = 0; i < state.rocks.length; i++) {
        drawRock(ctx, state.rocks[i]);
    }
    for (let i = 0; i < state.bullets.length; i++) {
        drawBullet(ctx, state.bullets[i]);
    }

    if (!state.isOver) {
        drawShip(ctx, state.ship, state.thrusting);
        if (state.shield > 0) {
            drawShield(ctx, state.ship);
        }
    }

    drawStatus(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'GAME OVER',
                    state.score + ' points — press R');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'PAUSED', 'Press P to carry on');
    }
}
