/* ============================================================
   match3-rules.js — the rules of Match Three

   Swap two neighbouring shapes to make a line of three or more. They vanish,
   everything above falls down, new shapes drop in from the top — and if that
   makes another line, it all happens again.

   That last part is the best bit of this game, and it comes free: clear,
   fall, look again, and keep going while there is still something to find.
   ============================================================ */

const GRID_SIZE = 8;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const SHAPE_COUNT = 6;
const EMPTY = -1;

const MIN_RUN = 3;
const POINTS_PER_GEM = 10;

/**
 * gemIndex — turn a column and row into a place in the list.
 * INPUT: column, row. OUTPUT: the position in the flat list.
 */
function gemIndex(column, row) {
    return row * GRID_SIZE + column;
}

/** isInsideBoard — is this square on the board? */
function isInsideBoard(column, row) {
    return column >= 0 && column < GRID_SIZE && row >= 0 && row < GRID_SIZE;
}

/** randomShape — one of the six shapes, at random. */
function randomShape() {
    return Math.floor(Math.random() * SHAPE_COUNT);
}

/**
 * areNeighbours — are these two squares next to each other?
 *
 * INPUT:  a, b — two squares, each { column, row }
 * OUTPUT: true if they touch along an edge
 *
 * ALGORITHM: add up how far apart they are across and down. Neighbours are
 *            exactly 1 apart in total — which neatly rules out the diagonals,
 *            where the total is 2, and a square with itself, where it is 0.
 */
function areNeighbours(a, b) {
    const across = Math.abs(a.column - b.column);
    const down = Math.abs(a.row - b.row);
    return across + down === 1;
}

/**
 * swapGems — exchange two shapes.
 *
 * INPUT:  board, a, b — two squares
 * OUTPUT: a NEW board with the two swapped
 *
 * ALGORITHM: copy the board first, then put each shape where the other was.
 *            Making a copy means the game can try a swap, look at what would
 *            happen, and throw the whole thing away if it does not match.
 */
function swapGems(board, a, b) {
    const copy = board.slice();
    const first = gemIndex(a.column, a.row);
    const second = gemIndex(b.column, b.row);

    copy[first] = board[second];
    copy[second] = board[first];
    return copy;
}

/**
 * findMatches — every shape that is part of a line of three or more.
 *
 * INPUT:  board
 * OUTPUT: a sorted list of the places to clear (no repeats)
 *
 * ALGORITHM: walk each row keeping a RUN — how many of the same shape you
 *            have seen in a row. When the shape changes (or the row ends),
 *            look at how long the run was: three or more and every square in
 *            it goes on the list. Then do exactly the same down the columns.
 *
 *            A square in a cross shape belongs to both a row and a column, so
 *            the list would hold it twice — which is why the marks go into a
 *            lookup first, and the list is built from that at the end.
 */
function findMatches(board) {
    const marked = {};

    const markRun = function (cells, start, length) {
        if (length < MIN_RUN) {
            return;
        }
        for (let i = start; i < start + length; i++) {
            marked[cells[i]] = true;
        }
    };

    /* along the rows */
    for (let row = 0; row < GRID_SIZE; row++) {
        const cells = [];
        for (let column = 0; column < GRID_SIZE; column++) {
            cells.push(gemIndex(column, row));
        }
        scanLine(board, cells, markRun);
    }

    /* down the columns */
    for (let column = 0; column < GRID_SIZE; column++) {
        const cells = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            cells.push(gemIndex(column, row));
        }
        scanLine(board, cells, markRun);
    }

    const found = [];
    for (let i = 0; i < CELL_COUNT; i++) {
        if (marked[i]) { found.push(i); }
    }
    return found;
}

/**
 * scanLine — find the runs along one row or column.
 *
 * INPUT:  board, cells — the places along the line. markRun — what to call.
 * OUTPUT: nothing; it reports each long run through markRun
 *
 * ALGORITHM: keep a run length. Every time the shape changes, report the run
 *            that just ended and start a new one. Report the last run too —
 *            forgetting that is the classic bug, and it means a match that
 *            reaches the edge of the board never counts.
 */
function scanLine(board, cells, markRun) {
    let runStart = 0;
    let runLength = 1;

    for (let i = 1; i <= cells.length; i++) {
        const same = i < cells.length &&
                     board[cells[i]] === board[cells[i - 1]] &&
                     board[cells[i]] !== EMPTY;
        if (same) {
            runLength = runLength + 1;
        } else {
            if (board[cells[runStart]] !== EMPTY) {
                markRun(cells, runStart, runLength);
            }
            runStart = i;
            runLength = 1;
        }
    }
}

/**
 * applyGravity — empty squares fill up from above.
 *
 * INPUT:  board
 * OUTPUT: a NEW board with everything fallen and the gaps at the top refilled
 *
 * ALGORITHM: take one column at a time. Read it from the BOTTOM upwards,
 *            collecting the shapes that are still there. Put them back at the
 *            bottom in the same order, and fill whatever is left at the top
 *            with brand-new random shapes.
 */
function applyGravity(board) {
    const result = board.slice();

    for (let column = 0; column < GRID_SIZE; column++) {
        const kept = [];
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
            const shape = board[gemIndex(column, row)];
            if (shape !== EMPTY) {
                kept.push(shape);
            }
        }

        for (let row = GRID_SIZE - 1; row >= 0; row--) {
            const fromBottom = GRID_SIZE - 1 - row;
            result[gemIndex(column, row)] =
                fromBottom < kept.length ? kept[fromBottom] : randomShape();
        }
    }
    return result;
}

/** clearMatches — take the matched shapes off the board. */
function clearMatches(board, matches) {
    const result = board.slice();
    for (let i = 0; i < matches.length; i++) {
        result[matches[i]] = EMPTY;
    }
    return result;
}

/**
 * settleBoard — clear, drop, and keep going while more lines appear.
 *
 * INPUT:  state, board
 * OUTPUT: { board, cleared, chains }
 *
 * ALGORITHM: this is where the cascades come from. Clear what matched, let
 *            everything fall, then LOOK AGAIN. If the falling shapes made a
 *            new line, round we go — and each round is worth more than the
 *            last, which is why a lucky chain feels so good.
 */
function settleBoard(state, board) {
    let working = board;
    let cleared = 0;
    let chains = 0;

    let matches = findMatches(working);
    while (matches.length > 0) {
        chains = chains + 1;
        cleared = cleared + matches.length;
        state.score = state.score + matches.length * POINTS_PER_GEM * chains;

        working = clearMatches(working, matches);
        working = applyGravity(working);
        matches = findMatches(working);
    }
    return { board: working, cleared: cleared, chains: chains };
}

/**
 * trySwap — the player's move.
 *
 * INPUT:  state, a, b — the two squares to exchange
 * OUTPUT: true if the swap was allowed
 *
 * ALGORITHM: refuse anything that is not a swap of two neighbours. Then swap
 *            them and look for a match. NO match means the move was not legal
 *            after all, so put them back exactly as they were — that is why
 *            swapGems hands back a copy instead of changing the board.
 */
function trySwap(state, a, b) {
    if (state.isOver || state.isPaused || !areNeighbours(a, b)) {
        return false;
    }

    const swapped = swapGems(state.board, a, b);
    if (findMatches(swapped).length === 0) {
        state.badSwaps = state.badSwaps + 1;
        return false;
    }

    const settled = settleBoard(state, swapped);
    state.board = settled.board;
    state.moves = state.moves + 1;
    state.cleared = state.cleared + settled.cleared;
    if (settled.chains > state.bestChain) {
        state.bestChain = settled.chains;
    }
    return true;
}

/**
 * hasAnyMove — is there a swap left anywhere on the board?
 *
 * INPUT:  board
 * OUTPUT: true if some swap would make a line
 *
 * ALGORITHM: try swapping every square with the one to its right and the one
 *            below it, and see whether any of those would match. Every
 *            possible move gets tried exactly once that way.
 */
function hasAnyMove(board) {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            const here = { column: column, row: row };
            const right = { column: column + 1, row: row };
            const below = { column: column, row: row + 1 };

            if (isInsideBoard(right.column, right.row) &&
                findMatches(swapGems(board, here, right)).length > 0) {
                return true;
            }
            if (isInsideBoard(below.column, below.row) &&
                findMatches(swapGems(board, here, below)).length > 0) {
                return true;
            }
        }
    }
    return false;
}

/**
 * freshBoard — a board with no lines on it already, and at least one move.
 * ALGORITHM: fill it at random, settle away anything that matched by
 *            accident, and shuffle again if the player would be stuck.
 */
function freshBoard() {
    for (let attempt = 0; attempt < 60; attempt++) {
        let board = [];
        for (let i = 0; i < CELL_COUNT; i++) {
            board.push(randomShape());
        }
        /* clear away any accidental lines without scoring for them */
        const throwaway = { score: 0 };
        board = settleBoard(throwaway, board).board;

        if (hasAnyMove(board)) {
            return board;
        }
    }
    return null;
}

/** moveCursor — slide the keyboard cursor, staying on the board. */
function moveCursor(state, dColumn, dRow) {
    const column = state.cursor.column + dColumn;
    const row = state.cursor.row + dRow;
    if (isInsideBoard(column, row)) {
        state.cursor = { column: column, row: row };
        return true;
    }
    return false;
}

/**
 * pickSquare — choose a square, or swap with the one already chosen.
 * INPUT: state, square. OUTPUT: 'picked', 'swapped' or 'cancelled'.
 */
function pickSquare(state, square) {
    if (state.isOver || state.isPaused) {
        return 'cancelled';
    }
    if (state.picked === null) {
        state.picked = square;
        return 'picked';
    }
    if (state.picked.column === square.column && state.picked.row === square.row) {
        state.picked = null;
        return 'cancelled';
    }

    const from = state.picked;
    state.picked = null;
    if (trySwap(state, from, square)) {
        return 'swapped';
    }
    return 'cancelled';
}

/** createGame — start a brand-new game. */
function createGame() {
    return {
        board: freshBoard(),
        cursor: { column: 0, row: 0 },
        picked: null,
        score: 0,
        moves: 0,
        cleared: 0,
        badSwaps: 0,
        bestChain: 0,
        isOver: false,
        isPaused: false
    };
}

/** shuffleBoard — deal a whole new board when the player is stuck. */
function shuffleBoard(state) {
    state.board = freshBoard();
    state.picked = null;
}

/** updateGame — Match Three has no clock, so a frame changes nothing. */
function updateGame(state, elapsedMs) {
    return;
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
    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'pick'; }
    if (k === 'n') { return 'shuffle'; }
    if (k === 'r') { return 'restart'; }
    if (k === 'p') { return 'pause'; }

    return null;
}
