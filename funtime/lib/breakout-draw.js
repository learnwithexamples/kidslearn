/* ============================================================
   breakout-draw.js — everything you can see in Breakout

   Black and white: the bricks are outlined boxes with a solid bar inside them,
   so the higher rows look "heavier" and you can tell them apart without colour.
   ============================================================ */

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#d8d8d8';

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawFrame — the thin border round the playing field. */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
}

/**
 * drawBrick — one brick.
 * ALGORITHM: an outlined box, with a solid bar inside whose thickness comes
 *            from the row — the top row is nearly solid, the bottom row nearly
 *            empty. That is how you show five kinds of brick in two colours.
 */
function drawBrick(ctx, column, row) {
    const rect = brickRect(column, row);
    const fillHeight = (rect.height - 6) * (BRICK_ROWS - row) / BRICK_ROWS;

    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2);

    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(rect.x + 4, rect.y + 3, rect.width - 8, fillHeight);
}

/** drawPaddle — the bat along the bottom. */
function drawPaddle(ctx, state) {
    const rect = paddleRect(state);
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(rect.x + rect.width / 2 - 6, rect.y + 4, 12, rect.height - 8);
}

/** drawBall — a filled circle with a white centre, so it reads as a ball. */
function drawBall(ctx, ball) {
    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOR_PAPER;
    ctx.beginPath();
    ctx.arc(ball.x - 2, ball.y - 2, BALL_RADIUS / 3, 0, Math.PI * 2);
    ctx.fill();
}

/** drawLives — one small circle per life left, up in the corner. */
function drawLives(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    for (let i = 0; i < state.lives; i++) {
        ctx.beginPath();
        ctx.arc(14 + i * 16, 18, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(String(state.score), FIELD_WIDTH - 12, 22);
    ctx.textAlign = 'left';
}

/** drawMessage — big centred words across the field. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(0, height / 2 - 46, width, 92);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / FIELD_WIDTH;
    const titleSize = Math.max(14, Math.round(28 * scale));
    const subtitleSize = Math.max(9, Math.round(13 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 4);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);

    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, PADDLE_Y + PADDLE_HEIGHT + 8);
    ctx.lineTo(FIELD_WIDTH, PADDLE_Y + PADDLE_HEIGHT + 8);
    ctx.stroke();

    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let column = 0; column < BRICK_COLUMNS; column++) {
            if (state.bricks[brickIndex(column, row)]) {
                drawBrick(ctx, column, row);
            }
        }
    }

    drawPaddle(ctx, state);
    drawBall(ctx, state.ball);
    drawLives(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver && state.isWon) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'YOU WIN!', state.score + ' points — press R');
    } else if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'GAME OVER', state.score + ' points — press R');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'READY?', 'Press SPACE to launch the ball');
    }
}
