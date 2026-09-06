/* ============================================================
   mines-rules.js — the rules of Minesweeper

   A grid with mines hidden in it. Every safe square you uncover tells you how
   many mines are touching it, and from those numbers you work out where the
   mines must be.

   There is no clock and nothing moves. This game is pure thinking — and it
   contains the single most useful algorithm in this whole collection:
   FLOOD FILL, the thing that opens up a big empty area in one click.
   ============================================================ */

const GRID_SIZE = 9;
const MINE_COUNT = 10;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

/**
 * cellIndex — turn a column and row into a place in the lists.
 * INPUT: column, row. OUTPUT: the position in a flat list.
 */
function cellIndex(column, row) {
    return row * GRID_SIZE + column;
}

/** isInsideGrid — is this square actually on the board? */
function isInsideGrid(column, row) {
    return column >= 0 && column < GRID_SIZE && row >= 0 && row < GRID_SIZE;
}

/**
 * neighbours — the squares touching this one.
 *
 * INPUT:  column, row
 * OUTPUT: a list of { column, row } — up to 8 of them
 *
 * ALGORITHM: try all nine squares in the little 3×3 box around it, skip the
 *            middle one (that is the square itself), and skip anything that
 *            falls off the edge of the board. Corners have 3 neighbours,
 *            edges have 5, and the middle has 8.
 */
function neighbours(column, row) {
    const list = [];
    for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dColumn = -1; dColumn <= 1; dColumn++) {
            if (dColumn === 0 && dRow === 0) {
                continue;
            }
            const c = column + dColumn;
            const r = row + dRow;
            if (isInsideGrid(c, r)) {
                list.push({ column: c, row: r });
            }
        }
    }
    return list;
}

/**
 * countMines — the number that gets printed on a square.
 *
 * INPUT:  state, column, row
 * OUTPUT: how many of its neighbours are mines (0 to 8)
 *
 * ALGORITHM: ask for the neighbours, and count the ones with a mine.
 */
function countMines(state, column, row) {
    let count = 0;
    const around = neighbours(column, row);
    for (let i = 0; i < around.length; i++) {
        if (state.mines[cellIndex(around[i].column, around[i].row)]) {
            count = count + 1;
        }
    }
    return count;
}

/**
 * placeMines — hide the mines, but never under the first click.
 *
 * INPUT:  state, safeColumn, safeRow — where the player has just clicked
 * OUTPUT: nothing; it fills in state.mines
 *
 * ALGORITHM: build a list of every square that is allowed to hold a mine —
 *            that is every square except the one clicked and its neighbours.
 *            Shuffle it, and take the first MINE_COUNT.
 *
 * WHY: losing on your very first click is not a game, it is a coin toss. Every
 *      good Minesweeper lays its mines AFTER the first click for this reason.
 */
function placeMines(state, safeColumn, safeRow) {
    const banned = {};
    banned[cellIndex(safeColumn, safeRow)] = true;
    neighbours(safeColumn, safeRow).forEach(function (cell) {
        banned[cellIndex(cell.column, cell.row)] = true;
    });

    const allowed = [];
    for (let i = 0; i < CELL_COUNT; i++) {
        if (!banned[i]) { allowed.push(i); }
    }

    for (let i = allowed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const swap = allowed[i];
        allowed[i] = allowed[j];
        allowed[j] = swap;
    }

    state.mines = [];
    for (let i = 0; i < CELL_COUNT; i++) { state.mines.push(false); }
    for (let i = 0; i < MINE_COUNT && i < allowed.length; i++) {
        state.mines[allowed[i]] = true;
    }
    state.minesPlaced = true;
}

/**
 * revealCell — uncover one square, and everything obviously safe around it.
 *
 * INPUT:  state, column, row
 * OUTPUT: true if anything was uncovered
 *
 * ALGORITHM — this is FLOOD FILL, and it is worth learning properly:
 *   1. Put the first square on a "to do" list.
 *   2. Take a square off the list. If it is already uncovered or flagged,
 *      ignore it. Otherwise uncover it.
 *   3. If that square has NO mines touching it, there is nothing to work out
 *      around it — so put all its neighbours on the to-do list too.
 *   4. Keep going until the list is empty.
 *
 * That is how one click can open a whole field. The same algorithm fills in
 * shapes in a paint program.
 */
function revealCell(state, column, row) {
    if (state.isOver || !isInsideGrid(column, row)) {
        return false;
    }
    const first = cellIndex(column, row);
    if (state.revealed[first] || state.flagged[first]) {
        return false;
    }

    if (!state.minesPlaced) {
        placeMines(state, column, row);
    }

    if (state.mines[first]) {
        state.revealed[first] = true;
        state.isOver = true;
        state.hitMine = first;
        return true;
    }

    const todo = [{ column: column, row: row }];
    while (todo.length > 0) {
        const cell = todo.pop();
        const index = cellIndex(cell.column, cell.row);

        if (state.revealed[index] || state.flagged[index]) {
            continue;
        }
        state.revealed[index] = true;

        if (countMines(state, cell.column, cell.row) === 0) {
            const around = neighbours(cell.column, cell.row);
            for (let i = 0; i < around.length; i++) {
                todo.push(around[i]);
            }
        }
    }

    checkWin(state);
    return true;
}

/**
 * toggleFlag — put a flag on a square, or take one off.
 *
 * INPUT:  state, column, row
 * OUTPUT: true if the flag changed
 *
 * ALGORITHM: you may only flag a square that is still covered. A flag also
 *            protects the square: revealCell refuses to open a flagged one,
 *            so you cannot lose by fumbling a click.
 */
function toggleFlag(state, column, row) {
    if (state.isOver || !isInsideGrid(column, row)) {
        return false;
    }
    const index = cellIndex(column, row);
    if (state.revealed[index]) {
        return false;
    }
    state.flagged[index] = !state.flagged[index];
    return true;
}

/** flagsUsed — how many flags are on the board. */
function flagsUsed(state) {
    let count = 0;
    for (let i = 0; i < state.flagged.length; i++) {
        if (state.flagged[i]) { count = count + 1; }
    }
    return count;
}

/** minesLeft — the number shown to the player: mines minus flags. */
function minesLeft(state) {
    return MINE_COUNT - flagsUsed(state);
}

/** revealedCount — how many squares are uncovered. */
function revealedCount(state) {
    let count = 0;
    for (let i = 0; i < state.revealed.length; i++) {
        if (state.revealed[i]) { count = count + 1; }
    }
    return count;
}

/**
 * checkWin — has the player finished?
 *
 * INPUT:  state
 * OUTPUT: true if they have won
 *
 * ALGORITHM: you win by uncovering every square that is NOT a mine. Note what
 *            this does not say: flags do not matter at all. You can win with
 *            no flags on the board, and having flagged every mine is not
 *            enough on its own.
 */
function checkWin(state) {
    if (revealedCount(state) === CELL_COUNT - MINE_COUNT) {
        state.isWon = true;
        state.isOver = true;
        return true;
    }
    return false;
}

/** createGame — start a brand-new game, with the mines not yet laid. */
function createGame() {
    const mines = [];
    const revealed = [];
    const flagged = [];
    for (let i = 0; i < CELL_COUNT; i++) {
        mines.push(false);
        revealed.push(false);
        flagged.push(false);
    }
    return {
        mines: mines,
        revealed: revealed,
        flagged: flagged,
        minesPlaced: false,
        cursor: { column: 4, row: 4 },
        hitMine: -1,
        seconds: 0,
        isWon: false,
        isOver: false,
        isPaused: false
    };
}

/** moveCursor — slide the keyboard cursor, staying on the board. */
function moveCursor(state, dColumn, dRow) {
    const column = state.cursor.column + dColumn;
    const row = state.cursor.row + dRow;
    if (isInsideGrid(column, row)) {
        state.cursor = { column: column, row: row };
        return true;
    }
    return false;
}

/** updateGame — the only moving part is the clock. */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused || !state.minesPlaced) {
        return;
    }
    state.seconds = state.seconds + elapsedMs / 1000;
}

/** togglePause — freeze or unfreeze the clock. */
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
    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'dig'; }
    if (k === 'f') { return 'flag'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
