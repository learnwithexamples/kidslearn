/* ============================================================
   tictactoe-rules.js — the rules of Tic-Tac-Toe

   Nine squares, stored as one flat list. Each square holds '' (empty), 'X'
   (you) or 'O' (the computer).

       0 | 1 | 2
       3 | 4 | 5
       6 | 7 | 8
   ============================================================ */

const GRID_SIZE = 3;
const SQUARE_COUNT = GRID_SIZE * GRID_SIZE;

const PLAYER = 'X';
const COMPUTER = 'O';
const EMPTY = '';

/** The eight ways to make three in a row: rows, columns and the two diagonals. */
const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

/**
 * squareIndex — turn a column and row into a place in the list.
 * INPUT: column, row (0 to 2). OUTPUT: 0 to 8.
 * ALGORITHM: skip a whole row for each row, then add the column.
 */
function squareIndex(column, row) {
    return row * GRID_SIZE + column;
}

/**
 * emptySquares — which squares can still be played?
 * INPUT: board — the list of nine marks.
 * OUTPUT: a list of the index numbers that are still empty.
 * ALGORITHM: walk the board keeping the numbers whose square is EMPTY.
 */
function emptySquares(board) {
    const free = [];
    for (let index = 0; index < board.length; index++) {
        if (board[index] === EMPTY) {
            free.push(index);
        }
    }
    return free;
}

/**
 * placeMark — put an X or an O on the board.
 * INPUT: board, index, mark. OUTPUT: a NEW board with the mark added.
 * ALGORITHM: copy the board and set that square — but only if it was empty.
 */
function placeMark(board, index, mark) {
    const next = board.slice();
    if (next[index] === EMPTY) {
        next[index] = mark;
    }
    return next;
}

/**
 * winningLine — has somebody made three in a row?
 *
 * INPUT:  board — the nine marks
 * OUTPUT: the winning line as [a, b, c], or null if nobody has won
 *
 * ALGORITHM: try each of the eight lines. If its first square is not empty
 *            and all three squares hold the same mark, that is the winner.
 */
function winningLine(board) {
    for (let i = 0; i < WINNING_LINES.length; i++) {
        const line = WINNING_LINES[i];
        const first = board[line[0]];
        if (first !== EMPTY && first === board[line[1]] && first === board[line[2]]) {
            return line;
        }
    }
    return null;
}

/**
 * isDraw — is the game a draw?
 * INPUT: board. OUTPUT: true when the board is full and nobody has won.
 * ALGORITHM: no empty squares left AND no winning line.
 */
function isDraw(board) {
    return emptySquares(board).length === 0 && winningLine(board) === null;
}

/**
 * computerMove — where should the computer play?
 *
 * INPUT:  board — the nine marks
 * OUTPUT: the index to play, or -1 if the board is full
 *
 * ALGORITHM (a simple but sneaky player, in order):
 *   1. If the computer can win right now, do that.
 *   2. Otherwise, if the player is about to win, block them.
 *   3. Otherwise take the middle, because it is on four lines.
 *   4. Otherwise take a corner.
 *   5. Otherwise take whatever is left.
 */
function computerMove(board) {
    const free = emptySquares(board);
    if (free.length === 0) {
        return -1;
    }

    for (let i = 0; i < free.length; i++) {
        if (winningLine(placeMark(board, free[i], COMPUTER)) !== null) {
            return free[i];
        }
    }
    for (let i = 0; i < free.length; i++) {
        if (winningLine(placeMark(board, free[i], PLAYER)) !== null) {
            return free[i];
        }
    }
    if (board[4] === EMPTY) {
        return 4;
    }
    const corners = [0, 2, 6, 8].filter(function (corner) { return board[corner] === EMPTY; });
    if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
    }
    return free[Math.floor(Math.random() * free.length)];
}

/** createGame — start a brand-new game. */
function createGame() {
    const board = [];
    for (let i = 0; i < SQUARE_COUNT; i++) {
        board.push(EMPTY);
    }
    return {
        board: board,
        cursor: { column: 1, row: 1 },
        winner: null,
        line: null,
        wins: 0,
        losses: 0,
        draws: 0,
        isOver: false,
        isPaused: false
    };
}

/**
 * finishIfOver — has the game just ended?
 * INPUT: state. OUTPUT: nothing; it may set winner, line and isOver.
 * ALGORITHM: look for a winning line, then for a draw, and count the result.
 */
function finishIfOver(state) {
    const line = winningLine(state.board);
    if (line !== null) {
        state.line = line;
        state.winner = state.board[line[0]];
        state.isOver = true;
        if (state.winner === PLAYER) { state.wins = state.wins + 1; }
        else { state.losses = state.losses + 1; }
    } else if (isDraw(state.board)) {
        state.winner = 'draw';
        state.isOver = true;
        state.draws = state.draws + 1;
    }
}

/**
 * playSquare — the player's move, followed by the computer's reply.
 * INPUT: state, index. OUTPUT: true if the move happened.
 */
function playSquare(state, index) {
    if (state.isOver || state.isPaused || state.board[index] !== EMPTY) {
        return false;
    }

    state.board = placeMark(state.board, index, PLAYER);
    finishIfOver(state);

    if (!state.isOver) {
        const reply = computerMove(state.board);
        if (reply >= 0) {
            state.board = placeMark(state.board, reply, COMPUTER);
            finishIfOver(state);
        }
    }
    return true;
}

/** nextRound — clear the board but keep the score. */
function nextRound(state) {
    const board = [];
    for (let i = 0; i < SQUARE_COUNT; i++) { board.push(EMPTY); }
    state.board = board;
    state.winner = null;
    state.line = null;
    state.isOver = false;
}

/** moveCursor — move the keyboard cursor, staying on the board. */
function moveCursor(state, dx, dy) {
    const column = state.cursor.column + dx;
    const row = state.cursor.row + dy;
    if (column >= 0 && column < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
        state.cursor.column = column;
        state.cursor.row = row;
    }
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    if (!state.isOver) { state.isPaused = !state.isPaused; }
}

/** actionForKey — turn a keyboard key into an action name, or null. */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowup' || k === 'w') { return 'up'; }
    if (k === 'arrowdown' || k === 's') { return 'down'; }
    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'play'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
