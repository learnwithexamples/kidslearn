/* ============================================================
   tetris-draw.js — everything you can see

   This game is deliberately BLACK AND WHITE, like the very first Tetris on a
   little grey handheld. There are no colours anywhere: a block is a black
   square with a white square inside it.

   Every function here takes a canvas "ctx" (the drawing tool) and paints
   something. None of them change the game state — drawing never cheats.
   ============================================================ */

/** How the game looks. Change these to restyle the whole game at once. */
const COLOR_BACKGROUND = '#ffffff';
const COLOR_GRID = '#e6e6e6';
const COLOR_BLOCK = '#111111';
const COLOR_BLOCK_INNER = '#ffffff';
const COLOR_GHOST = '#b0b0b0';
const COLOR_FRAME = '#111111';

/**
 * clearCanvas — paint the whole canvas one flat colour.
 *
 * INPUT:  ctx    — the canvas drawing tool
 *         width  — canvas width in pixels
 *         height — canvas height in pixels
 *         color  — a CSS colour string
 * OUTPUT: nothing (it draws)
 *
 * ALGORITHM: set fillStyle to the colour, then fillRect over everything.
 */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * drawGrid — draw the faint lines that show the squares.
 *
 * INPUT:  ctx      — the drawing tool
 *         columns  — how many columns
 *         rows     — how many rows
 *         cellSize — how many pixels wide one square is
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. For every column number c, draw a vertical line at x = c * cellSize.
 *   2. For every row number r, draw a horizontal line at y = r * cellSize.
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
 * drawBlock — draw one solid block of a tetromino.
 *
 * INPUT:  ctx      — the drawing tool
 *         column   — which column (0 is the left wall)
 *         row      — which row (0 is the top)
 *         cellSize — pixels per square
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Work out the pixel corner: x = column * cellSize, y = row * cellSize.
 *   2. Fill a black square there, one pixel smaller all round so blocks
 *      do not smudge into each other.
 *   3. Draw a smaller white square inside it — that hollow middle is what
 *      makes the classic black-and-white look.
 */
function drawBlock(ctx, column, row, cellSize) {
    const x = column * cellSize;
    const y = row * cellSize;

    ctx.fillStyle = COLOR_BLOCK;
    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

    ctx.strokeStyle = COLOR_BLOCK_INNER;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 5, y + 5, cellSize - 10, cellSize - 10);
}

/**
 * drawGhostBlock — draw one square of the "landing spot" outline.
 *
 * INPUT:  same as drawBlock
 * OUTPUT: nothing
 *
 * ALGORITHM: draw a grey hollow square instead of a solid black one.
 */
function drawGhostBlock(ctx, column, row, cellSize) {
    const x = column * cellSize;
    const y = row * cellSize;
    ctx.strokeStyle = COLOR_GHOST;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 3, y + 3, cellSize - 6, cellSize - 6);
}

/**
 * drawBoardBlocks — draw every block that is already locked in place.
 *
 * INPUT:  ctx, board, cellSize
 * OUTPUT: nothing
 *
 * ALGORITHM: look at every square of the board; wherever the value is 1,
 *            call drawBlock for that column and row.
 */
function drawBoardBlocks(ctx, board, cellSize) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            if (board[row][column] === 1) {
                drawBlock(ctx, column, row, cellSize);
            }
        }
    }
}

/**
 * drawPiece — draw the four blocks of a falling piece.
 *
 * INPUT:  ctx, piece, cellSize
 * OUTPUT: nothing
 *
 * ALGORITHM: use forEachBlock to visit the piece's board positions and call
 *            drawBlock on each one. Blocks above the top edge are skipped.
 */
function drawPiece(ctx, piece, cellSize) {
    forEachBlock(piece, function (bx, by) {
        if (by >= 0) {
            drawBlock(ctx, bx, by, cellSize);
        }
    });
}

/**
 * drawGhost — draw the outline showing where the piece will land.
 *
 * INPUT:  ctx, ghostPiece, cellSize
 * OUTPUT: nothing
 *
 * ALGORITHM: the same walk as drawPiece, but drawing hollow grey squares.
 */
function drawGhost(ctx, ghostPiece, cellSize) {
    forEachBlock(ghostPiece, function (bx, by) {
        if (by >= 0) {
            drawGhostBlock(ctx, bx, by, cellSize);
        }
    });
}

/**
 * drawFrame — draw the thick black border around the playing field.
 *
 * INPUT:  ctx, width, height (in pixels)
 * OUTPUT: nothing
 *
 * ALGORITHM: stroke a rectangle just inside the edge of the canvas.
 */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_FRAME;
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);
}

/**
 * drawMessage — write big centred words across the board.
 *
 * INPUT:  ctx, width, height, title (big text), subtitle (smaller text)
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Cover the board with a see-through white sheet so the text stands out.
 *   2. Draw the title in the middle, then the subtitle just below it.
 */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = COLOR_BLOCK;
    ctx.textAlign = 'center';

    ctx.font = 'bold 30px monospace';
    ctx.fillText(title, width / 2, height / 2 - 8);

    ctx.font = '15px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + 22);
}

/**
 * renderGame — draw one complete frame of the game.
 *
 * INPUT:  ctx      — the drawing tool for the main canvas
 *         state    — the game state
 *         cellSize — pixels per square
 * OUTPUT: nothing
 *
 * ALGORITHM (order matters — later things cover earlier things):
 *   1. Clear the canvas to white.
 *   2. Draw the faint grid.
 *   3. Draw the locked blocks.
 *   4. Draw the ghost outline, then the falling piece on top of it.
 *   5. Draw the black frame.
 *   6. If the game is paused or over, draw the message over everything.
 */
function renderGame(ctx, state, cellSize) {
    const width = boardWidth(state.board) * cellSize;
    const height = boardHeight(state.board) * cellSize;

    clearCanvas(ctx, width, height, COLOR_BACKGROUND);
    drawGrid(ctx, boardWidth(state.board), boardHeight(state.board), cellSize);
    drawBoardBlocks(ctx, state.board, cellSize);

    if (state.piece !== null && !state.isOver) {
        const ghost = getGhostPiece(state);
        if (ghost !== null) {
            drawGhost(ctx, ghost, cellSize);
        }
        drawPiece(ctx, state.piece, cellSize);
    }

    drawFrame(ctx, width, height);

    if (state.isOver) {
        drawMessage(ctx, width, height, 'GAME OVER', 'Press R or tap New to play again');
    } else if (state.isPaused) {
        drawMessage(ctx, width, height, 'PAUSED', 'Press P or tap Play to start');
    }
}

/**
 * renderNextPiece — draw the preview of the piece that comes next.
 *
 * INPUT:  ctx      — the drawing tool for the small preview canvas
 *         type     — a shape name such as 'L'
 *         width    — preview canvas width in pixels
 *         height   — preview canvas height in pixels
 *         cellSize — pixels per square (usually smaller than the board's)
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Clear the little canvas and draw its frame.
 *   2. Build the piece so we can read its matrix.
 *   3. Work out the left and top offsets that centre the matrix in the box.
 *   4. Draw a block for every 1 in the matrix, shifted by those offsets.
 */
function renderNextPiece(ctx, type, width, height, cellSize) {
    clearCanvas(ctx, width, height, COLOR_BACKGROUND);
    drawFrame(ctx, width, height);

    if (!type) {
        return;
    }

    const piece = createPiece(type);
    const size = piece.cells.length;
    const offsetX = (width - size * cellSize) / 2;
    const offsetY = (height - size * cellSize) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
            if (piece.cells[row][column] === 1) {
                drawBlock(ctx, column, row, cellSize);
            }
        }
    }
    ctx.restore();
}
