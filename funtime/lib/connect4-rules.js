/* ============================================================
   connect4-rules.js — the rules of Connect Four

   Seven columns, six rows, stored as one flat list of 42 squares. Each holds
   '' (empty), 'R' (your red counter) or 'Y' (the computer's yellow one).

   Counters are DROPPED into a column and fall to the lowest free row, which
   is what makes this game different from noughts and crosses.
   ============================================================ */

const COLUMNS = 7;
const ROWS = 6;
const CELL_COUNT = COLUMNS * ROWS;
const WIN_LENGTH = 4;

const PLAYER = 'R';
const COMPUTER = 'Y';
const EMPTY = '';

/** The four directions to look in: across, down, and the two diagonals. */
const DIRECTIONS = [[1, 0], [0, 1], [1, 1], [1, -1]];

/**
 * cellIndex — turn a column and row into a place in the list.
 * INPUT: column (0-6), row (0-5, 0 is the TOP). OUTPUT: 0 to 41.
 */
function cellIndex(column, row) {
    return row * COLUMNS + column;
}

/** isInsideBoard — is this square on the board? */
function isInsideBoard(column, row) {
    return column >= 0 && column < COLUMNS && row >= 0 && row < ROWS;
}

/**
 * dropRow — where would a counter land in this column?
 *
 * INPUT:  board — the 42 squares. column — which column.
 * OUTPUT: the row it would land in, or -1 when the column is full
 *
 * ALGORITHM: start at the BOTTOM row and walk upwards; the first empty square
 *            you meet is where the counter stops. If none are empty, the
 *            column is full.
 */
function dropRow(board, column) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[cellIndex(column, row)] === EMPTY) {
            return row;
        }
    }
    return -1;
}

/**
 * dropPiece — drop a counter into a column.
 * INPUT: board, column, mark. OUTPUT: a NEW board (unchanged if the column is full).
 */
function dropPiece(board, column, mark) {
    const row = dropRow(board, column);
    if (row === -1) {
        return board.slice();
    }
    const next = board.slice();
    next[cellIndex(column, row)] = mark;
    return next;
}

/**
 * countInDirection — how many of my counters run this way?
 *
 * INPUT:  board, column, row — where to start (not counted).
 *         dx, dy — the step to take each time. mark — whose counters to count.
 * OUTPUT: how many of that mark are in a row in that direction
 *
 * ALGORITHM: take one step at a time; while the square is on the board and
 *            holds the mark, add one and step again.
 */
function countInDirection(board, column, row, dx, dy, mark) {
    let found = 0;
    let c = column + dx;
    let r = row + dy;
    while (isInsideBoard(c, r) && board[cellIndex(c, r)] === mark) {
        found = found + 1;
        c = c + dx;
        r = r + dy;
    }
    return found;
}

/**
 * isWinAt — does the counter just dropped here make four in a row?
 *
 * INPUT:  board, column, row — the counter just played. mark — whose it is.
 * OUTPUT: true if it is part of a line of WIN_LENGTH or more
 *
 * ALGORITHM: for each of the four directions, count how many run one way and
 *            how many run the opposite way, then add 1 for the counter itself.
 *            Four or more anywhere means a win.
 */
function isWinAt(board, column, row, mark) {
    for (let i = 0; i < DIRECTIONS.length; i++) {
        const dx = DIRECTIONS[i][0];
        const dy = DIRECTIONS[i][1];
        const total = 1 +
            countInDirection(board, column, row, dx, dy, mark) +
            countInDirection(board, column, row, -dx, -dy, mark);
        if (total >= WIN_LENGTH) {
            return true;
        }
    }
    return false;
}

/** isBoardFull — is there nowhere left to play? */
function isBoardFull(board) {
    for (let column = 0; column < COLUMNS; column++) {
        if (dropRow(board, column) !== -1) {
            return false;
        }
    }
    return true;
}

/** playableColumns — the columns that still have room. */
function playableColumns(board) {
    const open = [];
    for (let column = 0; column < COLUMNS; column++) {
        if (dropRow(board, column) !== -1) {
            open.push(column);
        }
    }
    return open;
}

/**
 * computerColumn — which column should the computer drop into?
 *
 * INPUT:  board
 * OUTPUT: a column number, or -1 if the board is full
 *
 * ALGORITHM:
 *   1. If it can win right now, do that.
 *   2. Otherwise, if the player would win next turn, block them.
 *   3. Otherwise prefer the middle columns, which belong to more lines —
 *      but never pick a column that hands the player a win on top.
 */
function computerColumn(board) {
    const open = playableColumns(board);
    if (open.length === 0) {
        return -1;
    }

    for (let i = 0; i < open.length; i++) {
        const column = open[i];
        const row = dropRow(board, column);
        if (isWinAt(dropPiece(board, column, COMPUTER), column, row, COMPUTER)) {
            return column;
        }
    }
    for (let i = 0; i < open.length; i++) {
        const column = open[i];
        const row = dropRow(board, column);
        if (isWinAt(dropPiece(board, column, PLAYER), column, row, PLAYER)) {
            return column;
        }
    }

    const middleFirst = open.slice().sort(function (a, b) {
        return Math.abs(a - 3) - Math.abs(b - 3);
    });
    for (let i = 0; i < middleFirst.length; i++) {
        const column = middleFirst[i];
        const after = dropPiece(board, column, COMPUTER);
        const replyRow = dropRow(after, column);
        if (replyRow === -1 || !isWinAt(dropPiece(after, column, PLAYER), column, replyRow, PLAYER)) {
            return column;
        }
    }
    return middleFirst[0];
}

/** createGame — start a brand-new game. */
function createGame() {
    const board = [];
    for (let i = 0; i < CELL_COUNT; i++) { board.push(EMPTY); }
    return {
        board: board,
        cursor: 3,
        winner: null,
        wins: 0,
        losses: 0,
        draws: 0,
        isOver: false,
        isPaused: false
    };
}

/**
 * playColumn — the player's drop, followed by the computer's reply.
 * INPUT: state, column. OUTPUT: true if the drop happened.
 */
function playColumn(state, column) {
    if (state.isOver || state.isPaused || dropRow(state.board, column) === -1) {
        return false;
    }

    let row = dropRow(state.board, column);
    state.board = dropPiece(state.board, column, PLAYER);
    if (isWinAt(state.board, column, row, PLAYER)) {
        state.winner = PLAYER;
        state.isOver = true;
        state.wins = state.wins + 1;
        return true;
    }
    if (isBoardFull(state.board)) {
        state.winner = 'draw';
        state.isOver = true;
        state.draws = state.draws + 1;
        return true;
    }

    const reply = computerColumn(state.board);
    row = dropRow(state.board, reply);
    state.board = dropPiece(state.board, reply, COMPUTER);
    if (isWinAt(state.board, reply, row, COMPUTER)) {
        state.winner = COMPUTER;
        state.isOver = true;
        state.losses = state.losses + 1;
    } else if (isBoardFull(state.board)) {
        state.winner = 'draw';
        state.isOver = true;
        state.draws = state.draws + 1;
    }
    return true;
}

/** nextRound — clear the board but keep the score. */
function nextRound(state) {
    const board = [];
    for (let i = 0; i < CELL_COUNT; i++) { board.push(EMPTY); }
    state.board = board;
    state.winner = null;
    state.isOver = false;
}

/** moveCursor — slide the drop marker left or right. */
function moveCursor(state, dx) {
    const column = state.cursor + dx;
    if (column >= 0 && column < COLUMNS) {
        state.cursor = column;
    }
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    if (!state.isOver) { state.isPaused = !state.isPaused; }
}

/** actionForKey — turn a keyboard key into an action name, or null. */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === ' ' || k === 'spacebar' || k === 'enter' || k === 'arrowdown') { return 'drop'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
