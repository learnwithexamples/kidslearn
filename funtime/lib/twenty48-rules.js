/* ============================================================
   twenty48-rules.js — the rules of 2048

   Slide all the tiles one way. Two equal tiles that bump into each other join
   into one worth double. A new tile appears. Reach 2048.

   The big idea in this file: there is only ONE move function. Sliding LEFT is
   written properly, and the other three directions are done by turning the
   board round, sliding left, and turning it back. Four moves for the price of
   one — and only one place for a bug to hide.
   ============================================================ */

const SIZE = 4;
const CELL_COUNT = SIZE * SIZE;
const WINNING_TILE = 2048;

/**
 * cellIndex — turn a column and row into a place in the list.
 * INPUT: column, row. OUTPUT: the position in the flat list of tiles.
 */
function cellIndex(column, row) {
    return row * SIZE + column;
}

/** emptyBoard — sixteen empty squares. */
function emptyBoard() {
    const board = [];
    for (let i = 0; i < CELL_COUNT; i++) { board.push(0); }
    return board;
}

/** getRow — the four numbers in one row, as a list. */
function getRow(board, row) {
    return board.slice(row * SIZE, row * SIZE + SIZE);
}

/** setRow — write four numbers back into one row. */
function setRow(board, row, values) {
    for (let column = 0; column < SIZE; column++) {
        board[cellIndex(column, row)] = values[column];
    }
}

/**
 * emptyCells — where could a new tile go?
 *
 * INPUT:  board
 * OUTPUT: a list of the places that are still 0
 *
 * ALGORITHM: walk the whole board and collect the positions holding nothing.
 */
function emptyCells(board) {
    const found = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) {
            found.push(i);
        }
    }
    return found;
}

/**
 * addTile — drop a new tile into a random empty square.
 *
 * INPUT:  board
 * OUTPUT: true if a tile was added
 *
 * ALGORITHM: pick one of the empty squares at random and put a 2 in it —
 *            except one time in ten, when it is a 4. That occasional 4 is
 *            what stops the game from being completely predictable.
 */
function addTile(board) {
    const empty = emptyCells(board);
    if (empty.length === 0) {
        return false;
    }
    const where = empty[Math.floor(Math.random() * empty.length)];
    board[where] = Math.random() < 0.9 ? 2 : 4;
    return true;
}

/**
 * slideRow — push the numbers in one row to the left.
 *
 * INPUT:  row — a list of four numbers, 0 meaning empty
 * OUTPUT: a NEW list, same numbers, all the gaps at the right
 *
 * ALGORITHM: keep the numbers that are not 0, in the order they came, then
 *            pad the rest of the row with 0. Nothing joins up here — that is
 *            the next function's job.
 */
function slideRow(row) {
    const packed = [];
    for (let i = 0; i < row.length; i++) {
        if (row[i] !== 0) {
            packed.push(row[i]);
        }
    }
    while (packed.length < SIZE) {
        packed.push(0);
    }
    return packed;
}

/**
 * mergeRow — join up equal neighbours in a row that has already been slid.
 *
 * INPUT:  row — four numbers, already packed to the left
 * OUTPUT: { row: the new row, gained: the points scored }
 *
 * ALGORITHM: walk along the row. If this number equals the next one, replace
 *            them with one tile of double the value and step PAST both. If
 *            not, keep it and step on by one. Pad with 0 at the end.
 *
 * WHY step past both: it stops a row of four 2s becoming a single 8. The
 * correct answer is two 4s — each tile may only join once per move.
 */
function mergeRow(row) {
    const result = [];
    let gained = 0;
    let i = 0;

    while (i < row.length) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            const joined = row[i] * 2;
            result.push(joined);
            gained = gained + joined;
            i = i + 2;
        } else {
            result.push(row[i]);
            i = i + 1;
        }
    }

    while (result.length < SIZE) {
        result.push(0);
    }
    return { row: result, gained: gained };
}

/**
 * moveLeft — slide and join the whole board to the left.
 *
 * INPUT:  board
 * OUTPUT: { board: a NEW board, gained: the points scored }
 *
 * ALGORITHM: do each row on its own — slide it, then merge it.
 */
function moveLeft(board) {
    const result = emptyBoard();
    let gained = 0;

    for (let row = 0; row < SIZE; row++) {
        const merged = mergeRow(slideRow(getRow(board, row)));
        setRow(result, row, merged.row);
        gained = gained + merged.gained;
    }
    return { board: result, gained: gained };
}

/**
 * rotateBoard — turn the whole board a quarter turn clockwise.
 *
 * INPUT:  board
 * OUTPUT: a NEW board, turned
 *
 * ALGORITHM: the square that ends up at (column, row) is the one that started
 *            at (row, SIZE - 1 - column). Draw it on paper once and it will
 *            make sense for ever.
 */
function rotateBoard(board) {
    const turned = emptyBoard();
    for (let row = 0; row < SIZE; row++) {
        for (let column = 0; column < SIZE; column++) {
            turned[cellIndex(column, row)] = board[cellIndex(row, SIZE - 1 - column)];
        }
    }
    return turned;
}

/** turnsForDirection — how many quarter turns make this direction into "left". */
function turnsForDirection(direction) {
    if (direction === 'left') { return 0; }
    if (direction === 'down') { return 1; }
    if (direction === 'right') { return 2; }
    return 3;                      /* up */
}

/** boardsMatch — are two boards exactly the same? */
function boardsMatch(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) { return false; }
    }
    return true;
}

/**
 * moveBoard — slide the board in any of the four directions.
 *
 * INPUT:  board, direction — 'left', 'right', 'up' or 'down'
 * OUTPUT: { board, gained }
 *
 * ALGORITHM: turn the board until the direction you want is pointing left,
 *            do the one move you have written properly, then turn it back the
 *            rest of the way round. Four turns is a full circle, so the board
 *            always comes back the right way up.
 */
function moveBoard(board, direction) {
    const turns = turnsForDirection(direction);

    let work = board;
    for (let i = 0; i < turns; i++) {
        work = rotateBoard(work);
    }

    const moved = moveLeft(work);
    work = moved.board;

    for (let i = 0; i < (SIZE - turns) % SIZE; i++) {
        work = rotateBoard(work);
    }
    return { board: work, gained: moved.gained };
}

/**
 * hasMoves — is there anything left to do?
 *
 * INPUT:  board
 * OUTPUT: true if the player can still move
 *
 * ALGORITHM: an empty square always means yes. Otherwise, look for any two
 *            neighbours holding the same number — those could still join. Only
 *            when neither is true is the game really over.
 */
function hasMoves(board) {
    if (emptyCells(board).length > 0) {
        return true;
    }
    for (let row = 0; row < SIZE; row++) {
        for (let column = 0; column < SIZE; column++) {
            const value = board[cellIndex(column, row)];
            if (column + 1 < SIZE && board[cellIndex(column + 1, row)] === value) {
                return true;
            }
            if (row + 1 < SIZE && board[cellIndex(column, row + 1)] === value) {
                return true;
            }
        }
    }
    return false;
}

/** biggestTile — the largest number on the board. */
function biggestTile(board) {
    let best = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i] > best) { best = board[i]; }
    }
    return best;
}

/**
 * makeMove — one whole turn of the game.
 *
 * INPUT:  state, direction
 * OUTPUT: true if anything moved
 *
 * ALGORITHM: slide the board. If nothing moved at all, the turn does not
 *            count — no score, and no new tile. If something did move, score
 *            it, drop a new tile in, and see whether the game is finished.
 */
function makeMove(state, direction) {
    if (state.isOver || state.isPaused) {
        return false;
    }
    const moved = moveBoard(state.board, direction);

    if (boardsMatch(moved.board, state.board)) {
        return false;
    }

    state.board = moved.board;
    state.score = state.score + moved.gained;
    state.moves = state.moves + 1;
    addTile(state.board);

    if (biggestTile(state.board) >= WINNING_TILE) {
        state.isWon = true;
    }
    if (!hasMoves(state.board)) {
        state.isOver = true;
    }
    return true;
}

/** createGame — a fresh board with two tiles on it. */
function createGame() {
    const board = emptyBoard();
    addTile(board);
    addTile(board);
    return {
        board: board,
        score: 0,
        moves: 0,
        isWon: false,
        isOver: false,
        isPaused: false
    };
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    if (!state.isOver) { state.isPaused = !state.isPaused; }
}

/** updateGame — 2048 has no clock, so a frame changes nothing. */
function updateGame(state, elapsedMs) {
    return;
}

/** actionForKey — turn a keyboard key into an action name, or null. */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowup' || k === 'w') { return 'up'; }
    if (k === 'arrowdown' || k === 's') { return 'down'; }
    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
