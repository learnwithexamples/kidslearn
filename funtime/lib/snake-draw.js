/* ============================================================
   snake-draw.js — everything you can see

   Black and white only, like the very first handheld snake games: the field is
   white, the snake is black, and the apple is a black circle.

   Every function here takes a canvas "ctx" (the drawing tool) and paints
   something. None of them change the game — drawing never cheats.
   ============================================================ */

const COLOR_BACKGROUND = '#ffffff';
const COLOR_GRID = '#ececec';
const COLOR_SNAKE = '#111111';
const COLOR_INNER = '#ffffff';
const COLOR_FRAME = '#111111';

/**
 * clearCanvas — paint the whole canvas one flat colour.
 * INPUT: ctx, width, height, color. OUTPUT: nothing.
 * ALGORITHM: set fillStyle, then fillRect over everything.
 */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * drawGrid — the faint lines that show the squares.
 * INPUT: ctx, columns, rows, cellSize. OUTPUT: nothing.
 * ALGORITHM: one vertical line per column, one horizontal line per row.
 */
function drawGrid(ctx, columns, rows, cellSize) {
    ctx.strokeStyle = COLOR_GRID;
    ctx.lineWidth = 1;
    for (let c = 0; c <= columns; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellSize + 0.5, 0);
        ctx.lineTo(c * cellSize + 0.5, rows * cellSize);
        ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellSize + 0.5);
        ctx.lineTo(columns * cellSize, r * cellSize + 0.5);
        ctx.stroke();
    }
}

/**
 * drawSegment — one square of the snake's body.
 *
 * INPUT:  ctx, position, cellSize
 * OUTPUT: nothing
 *
 * ALGORITHM: a black square with a smaller white square outlined inside it, so
 *            you can count the segments even when the snake is packed tight.
 */
function drawSegment(ctx, position, cellSize) {
    const x = position.x * cellSize;
    const y = position.y * cellSize;

    ctx.fillStyle = COLOR_SNAKE;
    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

    /* The hollow middle is sized from the square, so the snake still reads
       clearly on the small board the workshop uses. */
    const inset = Math.max(3, Math.round(cellSize * 0.26));
    ctx.strokeStyle = COLOR_INNER;
    ctx.lineWidth = Math.max(1, Math.round(cellSize * 0.1));
    ctx.strokeRect(x + inset, y + inset, cellSize - inset * 2, cellSize - inset * 2);
}

/**
 * drawHead — the snake's head, with two eyes looking where it is going.
 *
 * INPUT:  ctx, position, direction, cellSize
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Fill the whole square black (no hollow middle — that is what makes the
 *      head stand out from the body).
 *   2. Find the middle of the square.
 *   3. Step a little way along the direction to reach the face, then a little
 *      way to each side (the sideways step of (x, y) is (-y, x)) — and put a
 *      small white eye at each of those two spots.
 */
function drawHead(ctx, position, direction, cellSize) {
    const x = position.x * cellSize;
    const y = position.y * cellSize;

    ctx.fillStyle = COLOR_SNAKE;
    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

    const middleX = x + cellSize / 2;
    const middleY = y + cellSize / 2;
    const forward = cellSize * 0.20;
    const sideways = cellSize * 0.22;
    const eyeSize = Math.max(2, Math.round(cellSize * 0.13));

    const faceX = middleX + direction.x * forward;
    const faceY = middleY + direction.y * forward;
    const sideX = -direction.y * sideways;
    const sideY = direction.x * sideways;

    ctx.fillStyle = COLOR_INNER;
    ctx.fillRect(faceX + sideX - eyeSize / 2, faceY + sideY - eyeSize / 2, eyeSize, eyeSize);
    ctx.fillRect(faceX - sideX - eyeSize / 2, faceY - sideY - eyeSize / 2, eyeSize, eyeSize);
}

/**
 * drawFood — the apple.
 *
 * INPUT:  ctx, position, cellSize
 * OUTPUT: nothing
 *
 * ALGORITHM: a filled black circle in the middle of the square, with a small
 *            white dot on it so it never looks like a body segment.
 */
function drawFood(ctx, position, cellSize) {
    const middleX = position.x * cellSize + cellSize / 2;
    const middleY = position.y * cellSize + cellSize / 2;

    ctx.fillStyle = COLOR_SNAKE;
    ctx.beginPath();
    ctx.arc(middleX, middleY, cellSize * 0.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLOR_INNER;
    ctx.beginPath();
    ctx.arc(middleX - cellSize * 0.12, middleY - cellSize * 0.12, cellSize * 0.09, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * drawFrame — the thick black border around the field.
 * INPUT: ctx, width, height. OUTPUT: nothing.
 * ALGORITHM: stroke a rectangle just inside the edge of the canvas.
 */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_FRAME;
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);
}

/**
 * drawMessage — big centred words across the field.
 *
 * INPUT:  ctx, width, height, title, subtitle
 * OUTPUT: nothing
 *
 * ALGORITHM: cover the field with a see-through white sheet, then write the
 *            title and the subtitle in the middle. The letters are sized from
 *            the width of the canvas so they still fit on a small board.
 */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = COLOR_SNAKE;
    ctx.textAlign = 'center';

    const scale = width / 400;
    const titleSize = Math.max(14, Math.round(34 * scale));
    const subtitleSize = Math.max(9, Math.round(15 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 8);

    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
}

/**
 * renderGame — draw one complete frame.
 *
 * INPUT:  ctx — the drawing tool. state — the game state. cellSize — pixels per square.
 * OUTPUT: nothing
 *
 * ALGORITHM (order matters — later things cover earlier ones):
 *   1. Clear to white and draw the faint grid.
 *   2. Draw the apple.
 *   3. Draw every body segment, then the head on top.
 *   4. Draw the black frame.
 *   5. If the game is won, lost or paused, write the message over everything.
 */
function renderGame(ctx, state, cellSize) {
    const width = GRID_WIDTH * cellSize;
    const height = GRID_HEIGHT * cellSize;

    clearCanvas(ctx, width, height, COLOR_BACKGROUND);
    drawGrid(ctx, GRID_WIDTH, GRID_HEIGHT, cellSize);

    if (state.food !== null) {
        drawFood(ctx, state.food, cellSize);
    }

    for (let i = 1; i < state.snake.length; i++) {
        drawSegment(ctx, state.snake[i], cellSize);
    }
    if (state.snake.length > 0) {
        drawHead(ctx, state.snake[0], state.direction, cellSize);
    }

    drawFrame(ctx, width, height);

    if (state.isWon) {
        drawMessage(ctx, width, height, 'YOU WIN!', 'You filled the whole board!');
    } else if (state.isOver) {
        drawMessage(ctx, width, height, 'GAME OVER', 'Press R or tap New to play again');
    } else if (state.isPaused) {
        drawMessage(ctx, width, height, 'PAUSED', 'Press P or tap Play to start');
    }
}
