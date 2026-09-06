/* ============================================================
   lights-rules.js — the rules of Lights Out

   Twenty-five lights sit in a 5 x 5 grid. Pressing one flips it AND its four
   neighbours — up, down, left and right. Turn every light off to win.

   The board is a flat list of 25 true/false values, read left to right and
   top to bottom, so the light in column 2 of row 1 is at 1 * 5 + 2 = 7.
   ============================================================ */

const GRID_SIZE = 5;
const LIGHT_COUNT = GRID_SIZE * GRID_SIZE;

/** How many random presses are used to scramble a new puzzle. */
const SCRAMBLE_PRESSES = 12;

/**
 * lightIndex — turn a column and row into a place in the list.
 *
 * INPUT:  column, row — each 0 to GRID_SIZE - 1
 * OUTPUT: the position of that light in the flat list of 25
 *
 * ALGORITHM: skip a whole row of lights for each row, then add the column.
 */
function lightIndex(column, row) {
    return row * GRID_SIZE + column;
}

/**
 * isOnBoard — is this square really on the grid?
 *
 * INPUT:  column, row
 * OUTPUT: true if both are between 0 and GRID_SIZE - 1
 *
 * ALGORITHM: check both numbers against the two limits.
 *
 * WHY: a light on the edge has fewer than four neighbours, and this is how the
 *      game notices.
 */
function isOnBoard(column, row) {
    return column >= 0 && column < GRID_SIZE && row >= 0 && row < GRID_SIZE;
}

/**
 * neighbours — the squares one press changes.
 *
 * INPUT:  column, row — the square that was pressed
 * OUTPUT: an array of [column, row] pairs: the square itself and the four
 *         squares around it that are still on the board
 *
 * ALGORITHM: start with the square itself, then try one step up, down, left
 *            and right, keeping only the steps that stay on the board.
 */
function neighbours(column, row) {
    const steps = [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]];
    const found = [];
    steps.forEach(function (step) {
        const c = column + step[0];
        const r = row + step[1];
        if (isOnBoard(c, r)) {
            found.push([c, r]);
        }
    });
    return found;
}

/**
 * pressLight — press one square and flip the cross of lights around it.
 *
 * INPUT:  lights — the list of 25 true/false values.
 *         column, row — the square pressed.
 * OUTPUT: a NEW list with those lights flipped
 *
 * ALGORITHM:
 *   1. Copy the list.
 *   2. For every neighbour square (including the one pressed), flip the value
 *      at its index: true becomes false and false becomes true.
 *   3. Return the copy.
 */
function pressLight(lights, column, row) {
    const changed = lights.slice();
    neighbours(column, row).forEach(function (square) {
        const index = lightIndex(square[0], square[1]);
        changed[index] = !changed[index];
    });
    return changed;
}

/**
 * isSolved — are all the lights off?
 *
 * INPUT:  lights — the list of 25 values
 * OUTPUT: true if every one is false
 *
 * ALGORITHM: look at every light; a single one still on means not solved.
 */
function isSolved(lights) {
    for (let i = 0; i < lights.length; i++) {
        if (lights[i]) {
            return false;
        }
    }
    return true;
}

/**
 * countLightsOn — how many are still lit?
 *
 * INPUT:  lights
 * OUTPUT: how many of them are true
 *
 * ALGORITHM: count the true ones.
 */
function countLightsOn(lights) {
    let count = 0;
    for (let i = 0; i < lights.length; i++) {
        if (lights[i]) {
            count = count + 1;
        }
    }
    return count;
}

/**
 * createPuzzle — build a puzzle that is definitely solvable.
 *
 * INPUT:  presses — how many random presses to scramble with
 * OUTPUT: a list of 25 lights
 *
 * ALGORITHM: start with every light OFF, then press random squares. Because
 *            pressing is its own undo, any board built this way can always be
 *            unpressed back to darkness — so the puzzle is never impossible.
 */
function createPuzzle(presses) {
    let lights = [];
    for (let i = 0; i < LIGHT_COUNT; i++) {
        lights.push(false);
    }
    for (let press = 0; press < presses; press++) {
        const column = Math.floor(Math.random() * GRID_SIZE);
        const row = Math.floor(Math.random() * GRID_SIZE);
        lights = pressLight(lights, column, row);
    }
    return lights;
}

/**
 * createGame — start a brand-new puzzle.
 * INPUT: none. OUTPUT: the game state.
 */
function createGame() {
    let lights = createPuzzle(SCRAMBLE_PRESSES);
    /* A scramble can undo itself and leave the board already solved. */
    while (isSolved(lights)) {
        lights = createPuzzle(SCRAMBLE_PRESSES);
    }
    return {
        lights: lights,
        moves: 0,
        cursor: { column: 2, row: 2 },
        isOver: false,
        isPaused: false
    };
}

/**
 * pressSquare — the player's move.
 *
 * INPUT:  state — the game. column, row — the square pressed.
 * OUTPUT: true if the press happened
 *
 * ALGORITHM: refuse the press if the puzzle is finished, paused or the square
 *            is off the board. Otherwise flip the cross, count the move, and
 *            check whether every light is now off.
 */
function pressSquare(state, column, row) {
    if (state.isOver || state.isPaused || !isOnBoard(column, row)) {
        return false;
    }
    state.lights = pressLight(state.lights, column, row);
    state.moves = state.moves + 1;
    if (isSolved(state.lights)) {
        state.isOver = true;
    }
    return true;
}

/** moveCursor — move the keyboard cursor, staying on the board. */
function moveCursor(state, dx, dy) {
    const column = state.cursor.column + dx;
    const row = state.cursor.row + dy;
    if (isOnBoard(column, row)) {
        state.cursor.column = column;
        state.cursor.row = row;
    }
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    if (!state.isOver) {
        state.isPaused = !state.isPaused;
    }
}

/**
 * actionForKey — turn a keyboard key into the name of a game action.
 * INPUT: key. OUTPUT: an action name, or null.
 */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowup' || k === 'w') { return 'up'; }
    if (k === 'arrowdown' || k === 's') { return 'down'; }
    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'press'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
