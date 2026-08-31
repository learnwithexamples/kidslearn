/* ============================================================
   tetris-board.js — the playing field and everything that happens to it

   The BOARD is a grid of rows:

       board[row][column]     0 = empty, 1 = a locked block

   Row 0 is the TOP of the screen, row 19 is the BOTTOM.
   Column 0 is the LEFT wall, column 9 is the RIGHT wall.

   Every function here is "pure": it looks at what you give it and returns an
   answer. Nothing in this file draws anything or knows about the keyboard.
   ============================================================ */

/** Standard Tetris field: 10 columns wide, 20 rows tall. */
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

/**
 * createEmptyBoard — build a fresh, empty playing field.
 *
 * INPUT:  width  — how many columns (usually 10)
 *         height — how many rows (usually 20)
 * OUTPUT: a board: an array of `height` rows, each row an array of `width` zeros
 *
 * ALGORITHM:
 *   1. Make an empty array called board.
 *   2. Repeat height times:
 *        build a row of `width` zeros and push it onto board.
 *   3. Return board.
 */
function createEmptyBoard(width, height) {
    const board = [];
    for (let row = 0; row < height; row++) {
        const newRow = [];
        for (let column = 0; column < width; column++) {
            newRow.push(0);
        }
        board.push(newRow);
    }
    return board;
}

/**
 * copyBoard — make a separate copy of a board.
 *
 * INPUT:  board — a board
 * OUTPUT: a new board with the same numbers
 *
 * ALGORITHM: push a copy of every row (row.slice()) into a new array.
 */
function copyBoard(board) {
    const result = [];
    for (let row = 0; row < board.length; row++) {
        result.push(board[row].slice());
    }
    return result;
}

/**
 * boardWidth / boardHeight — how big is this board?
 *
 * INPUT:  board — a board
 * OUTPUT: a whole number
 *
 * ALGORITHM: the height is how many rows there are; the width is how many
 *            columns the first row has.
 */
function boardHeight(board) {
    return board.length;
}

function boardWidth(board) {
    return board[0].length;
}

/**
 * isInsideBoard — is this square actually on the field?
 *
 * INPUT:  board — a board
 *         x     — a column number
 *         y     — a row number
 * OUTPUT: true or false
 *
 * ALGORITHM: x must be from 0 up to width-1, and y must be from 0 up to
 *            height-1. Anything else is off the field.
 *
 * NOTE: a piece is allowed to be ABOVE the board (y < 0) while it is being
 *       born, so collision checks treat that case separately.
 */
function isInsideBoard(board, x, y) {
    return x >= 0 && x < boardWidth(board) && y >= 0 && y < boardHeight(board);
}

/**
 * isCellFilled — is there already a locked block in this square?
 *
 * INPUT:  board, x (column), y (row)
 * OUTPUT: true if the square holds a block, false if it is empty
 *
 * ALGORITHM: look up board[y][x] and check whether it is 1.
 *            Squares above the top of the board count as empty.
 */
function isCellFilled(board, x, y) {
    if (y < 0) {
        return false;
    }
    if (!isInsideBoard(board, x, y)) {
        return false;
    }
    return board[y][x] === 1;
}

/**
 * canPlacePiece — may this piece sit exactly here?
 *
 * INPUT:  board — a board
 *         piece — a piece object { cells, x, y }
 * OUTPUT: true if every one of the piece's 4 blocks lands on a free square,
 *         false if any block would stick out of a wall, go through the floor,
 *         or overlap a block that is already there
 *
 * ALGORITHM:
 *   1. Assume the answer is true.
 *   2. For every filled block of the piece at board position (bx, by):
 *        - if bx is left of 0 or right of the last column  -> false
 *        - if by is below the last row                     -> false
 *        - if the square (bx, by) already holds a block    -> false
 *   3. Return the answer.
 *
 * This one function is the referee for moving, rotating and dropping.
 */
function canPlacePiece(board, piece) {
    let allowed = true;
    forEachBlock(piece, function (bx, by) {
        if (bx < 0 || bx >= boardWidth(board)) {
            allowed = false;
        } else if (by >= boardHeight(board)) {
            allowed = false;
        } else if (isCellFilled(board, bx, by)) {
            allowed = false;
        }
    });
    return allowed;
}

/**
 * mergePieceIntoBoard — stamp a piece permanently onto the field.
 *
 * INPUT:  board — a board
 *         piece — a piece object
 * OUTPUT: a NEW board with the piece's four blocks turned into 1s
 *
 * ALGORITHM:
 *   1. Copy the board.
 *   2. For every filled block of the piece at (bx, by):
 *        if that square is on the board, set copy[by][bx] = 1.
 *   3. Return the copy.
 *
 * This happens once, at the moment a piece lands and stops moving.
 */
function mergePieceIntoBoard(board, piece) {
    const result = copyBoard(board);
    forEachBlock(piece, function (bx, by) {
        if (isInsideBoard(result, bx, by)) {
            result[by][bx] = 1;
        }
    });
    return result;
}

/**
 * isRowFull — is this row completely packed with blocks?
 *
 * INPUT:  row — one row of the board (an array of 0s and 1s)
 * OUTPUT: true if every square is 1, otherwise false
 *
 * ALGORITHM: walk along the row; the moment you meet a 0, answer false.
 *            If you get to the end without meeting a 0, answer true.
 */
function isRowFull(row) {
    for (let column = 0; column < row.length; column++) {
        if (row[column] === 0) {
            return false;
        }
    }
    return true;
}

/**
 * findFullRows — which rows are ready to be cleared?
 *
 * INPUT:  board — a board
 * OUTPUT: an array of row numbers, e.g. [17, 19] (empty array if none)
 *
 * ALGORITHM:
 *   1. Start with an empty list.
 *   2. For every row number y, if isRowFull(board[y]) then add y to the list.
 *   3. Return the list.
 */
function findFullRows(board) {
    const fullRows = [];
    for (let y = 0; y < board.length; y++) {
        if (isRowFull(board[y])) {
            fullRows.push(y);
        }
    }
    return fullRows;
}

/**
 * removeRows — delete some rows and let everything above fall down.
 *
 * INPUT:  board      — a board
 *         rowNumbers — an array of row numbers to delete
 * OUTPUT: a NEW board of exactly the same size, with those rows gone,
 *         the rows above them shifted down, and fresh empty rows on top
 *
 * ALGORITHM:
 *   1. Build a list of the rows we are KEEPING (every row whose number is
 *      not in rowNumbers), in the same order.
 *   2. While that list is shorter than the original height, put a brand-new
 *      empty row at the FRONT of it (unshift).
 *   3. Return the list — it is the new board.
 *
 * This is the whole "line clear" trick, and it is only a few lines long.
 */
function removeRows(board, rowNumbers) {
    const width = boardWidth(board);
    const height = boardHeight(board);
    const kept = [];

    for (let y = 0; y < height; y++) {
        if (rowNumbers.indexOf(y) === -1) {
            kept.push(board[y].slice());
        }
    }

    while (kept.length < height) {
        const emptyRow = [];
        for (let column = 0; column < width; column++) {
            emptyRow.push(0);
        }
        kept.unshift(emptyRow);
    }

    return kept;
}

/**
 * dropDistance — how many rows can this piece still fall?
 *
 * INPUT:  board — a board
 *         piece — a piece object
 * OUTPUT: a whole number: 0 means it is already resting on something
 *
 * ALGORITHM:
 *   1. Start with distance = 0.
 *   2. While the piece moved down (distance + 1) rows can still be placed:
 *        add 1 to distance.
 *   3. Return distance.
 *
 * Used for the hard drop (space bar) and for drawing the ghost outline.
 */
function dropDistance(board, piece) {
    let distance = 0;
    while (canPlacePiece(board, movePiece(piece, 0, distance + 1))) {
        distance = distance + 1;
    }
    return distance;
}

/**
 * highestFilledRow — how tall is the pile of blocks?
 *
 * INPUT:  board — a board
 * OUTPUT: the row number of the topmost row that holds any block,
 *         or the board height if the field is completely empty
 *
 * ALGORITHM: scan rows from the top down; return the first row that has at
 *            least one 1 in it.
 *
 * (Not needed to play — handy if you want to add a danger warning.)
 */
function highestFilledRow(board) {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 1) {
                return y;
            }
        }
    }
    return board.length;
}
