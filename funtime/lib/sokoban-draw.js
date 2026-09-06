/* ============================================================
   sokoban-draw.js — everything you can see in Sokoban

   Black and white: a wall is a hatched block, a target is a small ring, a box
   is an outlined crate, and a box that is home is filled in solid — so you can
   count how many are done without reading any numbers.
   ============================================================ */

const CELL = 34;
const BOARD_MARGIN = 8;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#dddddd';

/** boardPixelWidth / boardPixelHeight — how big the canvas must be. */
function boardPixelWidth() { return BOARD_MARGIN * 2 + LEVEL_WIDTH * CELL; }
function boardPixelHeight() { return BOARD_MARGIN * 2 + LEVEL_HEIGHT * CELL; }

/** cellLeft / cellTop — the top-left corner of one square. */
function cellLeft(x) { return BOARD_MARGIN + x * CELL; }
function cellTop(y) { return BOARD_MARGIN + y * CELL; }

/** cellAtPixel — which square did the player click? null if none. */
function cellAtPixel(x, y) {
    const column = Math.floor((x - BOARD_MARGIN) / CELL);
    const row = Math.floor((y - BOARD_MARGIN) / CELL);
    if (column < 0 || column >= LEVEL_WIDTH || row < 0 || row >= LEVEL_HEIGHT) {
        return null;
    }
    return { x: column, y: row };
}

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawWall — a hatched block. */
function drawWall(ctx, x, y) {
    const left = cellLeft(x);
    const top = cellTop(y);
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(left, top, CELL, CELL);
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 1;
    for (let i = -CELL; i < CELL; i += 6) {
        ctx.beginPath();
        ctx.moveTo(left + i, top + CELL);
        ctx.lineTo(left + i + CELL, top);
        ctx.stroke();
    }
    ctx.lineWidth = 2;
    ctx.strokeRect(left + 1, top + 1, CELL - 2, CELL - 2);
}

/** drawFloor — a plain square with a faint outline. */
function drawFloor(ctx, x, y) {
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(cellLeft(x), cellTop(y), CELL, CELL);
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 1;
    ctx.strokeRect(cellLeft(x) + 0.5, cellTop(y) + 0.5, CELL - 1, CELL - 1);
}

/** drawGoal — the ring showing where a box belongs. */
function drawGoal(ctx, x, y) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cellLeft(x) + CELL / 2, cellTop(y) + CELL / 2, 6, 0, Math.PI * 2);
    ctx.stroke();
}

/**
 * drawBox — a crate.
 * ALGORITHM: an outlined square with a cross through it, or a solid black one
 *            once it is standing on a target. Solid means done.
 */
function drawBox(ctx, x, y, home) {
    const left = cellLeft(x) + 4;
    const top = cellTop(y) + 4;
    const size = CELL - 8;

    if (home) {
        ctx.fillStyle = COLOR_INK;
        ctx.fillRect(left, top, size, size);
        ctx.strokeStyle = COLOR_PAPER;
    } else {
        ctx.fillStyle = COLOR_PAPER;
        ctx.fillRect(left, top, size, size);
        ctx.strokeStyle = COLOR_INK;
    }
    ctx.lineWidth = 2;
    ctx.strokeRect(left + 1, top + 1, size - 2, size - 2);
    ctx.beginPath();
    ctx.moveTo(left + 4, top + 4);
    ctx.lineTo(left + size - 4, top + size - 4);
    ctx.moveTo(left + size - 4, top + 4);
    ctx.lineTo(left + 4, top + size - 4);
    ctx.stroke();
}

/** drawPlayer — a little person: a head, a body and two feet. */
function drawPlayer(ctx, player) {
    const middleX = cellLeft(player.x) + CELL / 2;
    const top = cellTop(player.y);

    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.arc(middleX, top + 11, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(middleX - 5, top + 17, 10, 9);
    ctx.fillRect(middleX - 7, top + 26, 4, 4);
    ctx.fillRect(middleX + 3, top + 26, 4, 4);

    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(middleX - 2, top + 8, 2, 2);
    ctx.fillRect(middleX + 1, top + 8, 2, 2);
}

/** drawMessage — big centred words across the level. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    ctx.fillRect(0, height / 2 - 40, width, 80);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / boardPixelWidth();
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
    clearCanvas(ctx, boardPixelWidth(), boardPixelHeight(), COLOR_PAPER);

    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        for (let x = 0; x < LEVEL_WIDTH; x++) {
            if (isWall(state, x, y)) {
                drawWall(ctx, x, y);
            } else {
                drawFloor(ctx, x, y);
                if (isGoal(state, x, y)) {
                    drawGoal(ctx, x, y);
                }
            }
        }
    }

    for (let i = 0; i < state.boxes.length; i++) {
        const box = state.boxes[i];
        drawBox(ctx, box.x, box.y, isGoal(state, box.x, box.y));
    }

    drawPlayer(ctx, state.player);

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(BOARD_MARGIN - 1, BOARD_MARGIN - 1,
                   LEVEL_WIDTH * CELL + 2, LEVEL_HEIGHT * CELL + 2);

    if (state.isSolved) {
        drawMessage(ctx, boardPixelWidth(), boardPixelHeight(), 'SOLVED!',
                    state.moves + ' moves — press N for the next one');
    } else if (state.isPaused) {
        drawMessage(ctx, boardPixelWidth(), boardPixelHeight(), 'PAUSED', 'Press P to carry on');
    }
}
