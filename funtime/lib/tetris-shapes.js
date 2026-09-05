/* ============================================================
   tetris-shapes.js — the seven tetromino shapes and how to turn them

   A SHAPE is stored as a square grid ("matrix") of 0s and 1s:

       T piece            I piece
       [0, 1, 0]          [0, 0, 0, 0]
       [1, 1, 1]          [1, 1, 1, 1]
       [0, 0, 0]          [0, 0, 0, 0]
                          [0, 0, 0, 0]

   1 means "there is a block here", 0 means "empty".
   The grid is square so that rotating it is easy.
   ============================================================ */

/**
 * SHAPES — the seven classic tetrominoes, each one made of exactly 4 blocks.
 * Each entry is a square matrix (an array of rows).
 */
const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

/** The seven shape names, in a fixed order. */
const SHAPE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

/**
 * copyMatrix — make a brand-new copy of a matrix.
 *
 * INPUT:  matrix — an array of rows (array of arrays of numbers)
 * OUTPUT: a new matrix with the same numbers, sharing nothing with the old one
 *
 * ALGORITHM:
 *   1. Make an empty result array.
 *   2. For every row of the input, push a copy of that row (row.slice()).
 *   3. Return the result.
 *
 * WHY: if we copy before changing, the original shape is never damaged.
 */
function copyMatrix(matrix) {
    const result = [];
    for (let row = 0; row < matrix.length; row++) {
        result.push(matrix[row].slice());
    }
    return result;
}

/**
 * rotateMatrixClockwise — turn a square matrix a quarter turn to the right.
 *
 * INPUT:  matrix — a square matrix, size N x N
 * OUTPUT: a NEW square matrix, also N x N, rotated 90° clockwise
 *
 * ALGORITHM (the classic one):
 *   For every position (r, c) in the answer:
 *       answer[r][c] = matrix[N - 1 - c][r]
 *   In words: the bottom-left corner becomes the top-left corner.
 *
 * EXAMPLE (the T piece turning to point right):
 *   [0,1,0]        [0,1,0]
 *   [1,1,1]   -->  [0,1,1]
 *   [0,0,0]        [0,1,0]
 */
function rotateMatrixClockwise(matrix) {
    const size = matrix.length;
    const result = [];
    for (let r = 0; r < size; r++) {
        const newRow = [];
        for (let c = 0; c < size; c++) {
            newRow.push(matrix[size - 1 - c][r]);
        }
        result.push(newRow);
    }
    return result;
}

/**
 * rotateMatrixCounterClockwise — turn a square matrix a quarter turn to the left.
 *
 * INPUT:  matrix — a square matrix, size N x N
 * OUTPUT: a NEW square matrix rotated 90° anti-clockwise
 *
 * ALGORITHM:
 *   answer[r][c] = matrix[c][N - 1 - r]
 *
 * TIP: rotating clockwise three times does the same job — but this is faster
 *      and it is a good exercise to write it directly.
 */
function rotateMatrixCounterClockwise(matrix) {
    const size = matrix.length;
    const result = [];
    for (let r = 0; r < size; r++) {
        const newRow = [];
        for (let c = 0; c < size; c++) {
            newRow.push(matrix[c][size - 1 - r]);
        }
        result.push(newRow);
    }
    return result;
}

/**
 * createPiece — build a falling piece from a shape name.
 *
 * INPUT:  type — one of 'I','O','T','S','Z','J','L'
 * OUTPUT: a piece object: { type, cells, x, y }
 *           cells — a copy of the shape matrix
 *           x, y  — where the matrix's top-left corner sits on the board
 *
 * ALGORITHM:
 *   1. Look the shape up in SHAPES.
 *   2. Copy it (never hand out the original!).
 *   3. Return it with x = 0 and y = 0; the game will place it properly.
 */
function createPiece(type) {
    return {
        type: type,
        cells: copyMatrix(SHAPES[type]),
        x: 0,
        y: 0
    };
}

/**
 * copyPiece — make a separate copy of a piece.
 *
 * INPUT:  piece — a piece object
 * OUTPUT: a new piece object with the same type, position and a copied matrix
 *
 * ALGORITHM: build a new object, copying the matrix with copyMatrix.
 *
 * WHY: it lets us try a move on the copy and only keep it if it is legal.
 */
function copyPiece(piece) {
    return {
        type: piece.type,
        cells: copyMatrix(piece.cells),
        x: piece.x,
        y: piece.y
    };
}

/**
 * movePiece — make a copy of a piece shifted by some amount.
 *
 * INPUT:  piece — a piece object
 *         dx    — how far to move sideways (-1 = left, +1 = right)
 *         dy    — how far to move down (+1 = one row down)
 * OUTPUT: a NEW piece at the new position (the old one is untouched)
 *
 * ALGORITHM:
 *   1. Copy the piece.
 *   2. Add dx to x and dy to y.
 *   3. Return the copy.
 */
function movePiece(piece, dx, dy) {
    const moved = copyPiece(piece);
    moved.x = moved.x + dx;
    moved.y = moved.y + dy;
    return moved;
}

/**
 * centerLongBar — put the I piece's bar back in the middle of its box.
 *
 * INPUT:  cells — a piece matrix that has just been rotated
 * OUTPUT: the same matrix, or a NEW one with the bar slid back to the middle
 *
 * ALGORITHM:
 *   1. If the matrix is not 4 x 4, there is nothing to do — hand it back.
 *   2. Find which rows and which columns hold blocks.
 *   3. If every block is in ONE row, slide that row to row 1.
 *      If every block is in ONE column, slide that column to column 1.
 *   4. Build the shifted matrix and return it.
 *
 * WHY THIS EXISTS:
 *   A 3 x 3 piece has a middle square, at (1, 1), and turning it spins the
 *   piece neatly around that square. A 4 x 4 box has NO middle square — its
 *   centre is the corner point where the four inner squares meet. So the bar
 *   lands on the far side of that centre every quarter turn:
 *
 *       ....        ..#.        ....        .#..
 *       ####   ->   ..#.   ->   ....   ->   .#..
 *       ....        ..#.        ####        .#..
 *       ....        ..#.        ....        .#..
 *        row 1      column 2     row 2      column 1
 *
 *   Turning it twice would leave the bar one row LOWER than it started, so a
 *   player who spins it twice sees the piece move. Sliding a lone bar back to
 *   row 1 (or column 1) gives the I piece exactly two positions, flat and
 *   upright, which is how the classic game behaves.
 */
function centerLongBar(cells) {
    const size = cells.length;
    if (size !== 4) {
        return cells;
    }

    const filledRows = [];
    const filledColumns = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (cells[r][c] === 1) {
                if (filledRows.indexOf(r) === -1) { filledRows.push(r); }
                if (filledColumns.indexOf(c) === -1) { filledColumns.push(c); }
            }
        }
    }

    let shiftRows = 0;
    let shiftColumns = 0;
    if (filledRows.length === 1) { shiftRows = 1 - filledRows[0]; }
    if (filledColumns.length === 1) { shiftColumns = 1 - filledColumns[0]; }
    if (shiftRows === 0 && shiftColumns === 0) {
        return cells;
    }

    const result = [];
    for (let r = 0; r < size; r++) {
        result.push([0, 0, 0, 0]);
    }
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (cells[r][c] === 1) {
                const newRow = r + shiftRows;
                const newColumn = c + shiftColumns;
                if (newRow >= 0 && newRow < size && newColumn >= 0 && newColumn < size) {
                    result[newRow][newColumn] = 1;
                }
            }
        }
    }
    return result;
}

/**
 * rotatePiece — make a copy of a piece turned a quarter turn.
 *
 * INPUT:  piece     — a piece object
 *         clockwise — true for right, false for left
 * OUTPUT: a NEW rotated piece at the same x and y
 *
 * ALGORITHM:
 *   1. Copy the piece.
 *   2. Replace its cells with the rotated matrix.
 *   3. Slide a lone bar back to the middle (see centerLongBar) so the I piece
 *      does not creep across the board every time it is turned.
 *   4. Return the copy.
 *
 * NOTE: the O piece looks identical after rotating, which is fine — the
 *       maths still works, it just looks like nothing happened.
 */
function rotatePiece(piece, clockwise) {
    const turned = copyPiece(piece);
    if (clockwise) {
        turned.cells = rotateMatrixClockwise(piece.cells);
    } else {
        turned.cells = rotateMatrixCounterClockwise(piece.cells);
    }
    turned.cells = centerLongBar(turned.cells);
    return turned;
}

/**
 * forEachBlock — visit every filled block of a piece.
 *
 * INPUT:  piece    — a piece object
 *         callback — a function called as callback(boardX, boardY)
 * OUTPUT: nothing (it just calls the callback)
 *
 * ALGORITHM:
 *   For every row r and column c of the piece matrix:
 *       if cells[r][c] is 1:
 *           callback(piece.x + c, piece.y + r)
 *
 * WHY: almost every other function needs "where are this piece's 4 blocks
 *      on the board?", so we write that loop once and reuse it.
 */
function forEachBlock(piece, callback) {
    for (let r = 0; r < piece.cells.length; r++) {
        for (let c = 0; c < piece.cells[r].length; c++) {
            if (piece.cells[r][c] === 1) {
                callback(piece.x + c, piece.y + r);
            }
        }
    }
}

/**
 * randomShapeType — pick one of the seven shape names at random.
 *
 * INPUT:  none
 * OUTPUT: a shape name, e.g. 'T'
 *
 * ALGORITHM:
 *   1. Pick a random whole number from 0 to 6:  Math.floor(Math.random() * 7)
 *   2. Return SHAPE_TYPES at that index.
 */
function randomShapeType() {
    const index = Math.floor(Math.random() * SHAPE_TYPES.length);
    return SHAPE_TYPES[index];
}

/**
 * createShuffledBag — make a shuffled list of all seven shapes.
 *
 * INPUT:  none
 * OUTPUT: an array of the 7 shape names in random order, e.g. ['S','I','O',...]
 *
 * ALGORITHM (the Fisher-Yates shuffle):
 *   1. Copy SHAPE_TYPES into a new array called bag.
 *   2. For i from the last index down to 1:
 *        pick a random j between 0 and i,
 *        swap bag[i] and bag[j].
 *   3. Return bag.
 *
 * WHY: real Tetris deals pieces from a "bag" of all seven, so you never wait
 *      forever for a long I piece. Much fairer than pure random!
 */
function createShuffledBag() {
    const bag = SHAPE_TYPES.slice();
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = bag[i];
        bag[i] = bag[j];
        bag[j] = temp;
    }
    return bag;
}
