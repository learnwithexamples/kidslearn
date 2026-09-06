/* ============================================================
   frogger-draw.js — everything you can see in Frogger

   Black and white: the safe rows are hatched, the lanes are plain, and each
   vehicle has a black nose pointing the way it is driving so you can read the
   traffic at a glance.
   ============================================================ */

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#d5d5d5';

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawFrame — the thin border round the road. */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
}

/** drawSafeRow — a hatched strip: the banks and the island in the middle. */
function drawSafeRow(ctx, row) {
    const y = row * CELL;
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(0, y, FIELD_WIDTH, CELL);
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 1;
    for (let x = -CELL; x < FIELD_WIDTH + CELL; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x, y + CELL);
        ctx.lineTo(x + CELL, y);
        ctx.stroke();
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(FIELD_WIDTH, y);
    ctx.moveTo(0, y + CELL);
    ctx.lineTo(FIELD_WIDTH, y + CELL);
    ctx.stroke();
}

/** drawLane — a plain road row with a faint dashed centre line. */
function drawLane(ctx, row) {
    const y = row * CELL;
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(0, y, FIELD_WIDTH, CELL);
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(0, y + CELL / 2);
    ctx.lineTo(FIELD_WIDTH, y + CELL / 2);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * drawCar — one vehicle.
 * ALGORITHM: an outlined box with two black wheels and a solid nose at the
 *            front, so which way it is coming is obvious without colour.
 */
function drawCar(ctx, car) {
    const rect = carRect(car);
    const facingRight = laneDirection(car.row) === 1;

    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2);

    ctx.fillStyle = COLOR_INK;
    const noseX = facingRight ? rect.x + rect.width - 8 : rect.x + 2;
    ctx.fillRect(noseX, rect.y + 3, 6, rect.height - 6);

    ctx.fillRect(rect.x + 6, rect.y - 2, 7, 4);
    ctx.fillRect(rect.x + rect.width - 13, rect.y - 2, 7, 4);
    ctx.fillRect(rect.x + 6, rect.y + rect.height - 2, 7, 4);
    ctx.fillRect(rect.x + rect.width - 13, rect.y + rect.height - 2, 7, 4);
}

/**
 * drawFrog — the frog itself.
 * ALGORITHM: a black body with two white eyes and four little legs poking out,
 *            drawn inside its square so it never looks off-grid.
 */
function drawFrog(ctx, frog) {
    const rect = frogRect(frog);
    const middleX = rect.x + rect.width / 2;
    const middleY = rect.y + rect.height / 2;

    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(rect.x - 2, rect.y + 3, 4, 6);
    ctx.fillRect(rect.x + rect.width - 2, rect.y + 3, 4, 6);
    ctx.fillRect(rect.x - 2, rect.y + rect.height - 9, 4, 6);
    ctx.fillRect(rect.x + rect.width - 2, rect.y + rect.height - 9, 4, 6);

    ctx.beginPath();
    ctx.ellipse(middleX, middleY, rect.width / 2, rect.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLOR_PAPER;
    ctx.beginPath();
    ctx.arc(middleX - 5, middleY - 4, 3.4, 0, Math.PI * 2);
    ctx.arc(middleX + 5, middleY - 4, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(middleX - 5, middleY - 4, 1.4, 0, Math.PI * 2);
    ctx.arc(middleX + 5, middleY - 4, 1.4, 0, Math.PI * 2);
    ctx.fill();
}

/** drawLives — one small frog head per life, on the home bank. */
function drawLives(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    for (let i = 0; i < state.lives; i++) {
        ctx.beginPath();
        ctx.arc(12 + i * 15, 16, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('HOME', FIELD_WIDTH - 8, 20);
    ctx.textAlign = 'left';
}

/** drawMessage — big centred words across the road. */
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

    for (let row = 0; row < ROWS; row++) {
        if (isLane(row)) { drawLane(ctx, row); } else { drawSafeRow(ctx, row); }
    }

    for (let i = 0; i < state.cars.length; i++) {
        drawCar(ctx, state.cars[i]);
    }

    drawFrog(ctx, state.frog);
    drawLives(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'SQUASHED!',
                    state.crossings + ' crossings — press R');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'PAUSED', 'Press P to carry on');
    }
}
