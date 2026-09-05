/* ============================================================
   snake-grid.js — the playing field, positions and directions

   Snake lives on a grid of squares, 20 across and 20 down.

   A POSITION is just an object with two numbers:

       { x: 3, y: 7 }      x = column (0 is the left wall)
                           y = row    (0 is the TOP row)

   A DIRECTION is a position-sized step: how far to move in x and y.
   Moving up means y goes DOWN by one, because row 0 is at the top.

   Every function in this file is "pure": give it numbers, it gives you an
   answer. Nothing here draws anything or reads the keyboard.
   ============================================================ */

/** The size of the field, in squares. */
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

/** The four ways a snake can travel. */
const DIRECTIONS = {
    up:    { x: 0, y: -1 },
    down:  { x: 0, y: 1 },
    left:  { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

/**
 * createPosition — build one square's position.
 *
 * INPUT:  x — the column, y — the row
 * OUTPUT: an object { x, y }
 *
 * ALGORITHM: return an object with those two numbers in it.
 */
function createPosition(x, y) {
    return { x: x, y: y };
}

/**
 * samePosition — are these two squares the same square?
 *
 * INPUT:  a, b — two positions
 * OUTPUT: true if both the x values and the y values match
 *
 * ALGORITHM: compare a.x with b.x AND a.y with b.y.
 *
 * WHY: you cannot compare objects with ===. Two different objects that both
 *      say { x: 3, y: 7 } are NOT === each other, so we compare the numbers.
 */
function samePosition(a, b) {
    return a.x === b.x && a.y === b.y;
}

/**
 * addDirection — take one step from a square.
 *
 * INPUT:  position — where you are. direction — which way to step.
 * OUTPUT: a NEW position one square along; the old one is untouched
 *
 * ALGORITHM: add the direction's x to the position's x, and the same for y.
 *
 * EXAMPLE: addDirection({x: 5, y: 5}, DIRECTIONS.up) is {x: 5, y: 4}.
 */
function addDirection(position, direction) {
    return { x: position.x + direction.x, y: position.y + direction.y };
}

/**
 * isInsideGrid — is this square still on the field?
 *
 * INPUT:  position — a position
 * OUTPUT: true if it is on the board, false if it has gone through a wall
 *
 * ALGORITHM: x must be from 0 to GRID_WIDTH - 1, and y from 0 to
 *            GRID_HEIGHT - 1. Anything else is outside.
 */
function isInsideGrid(position) {
    return position.x >= 0 && position.x < GRID_WIDTH &&
           position.y >= 0 && position.y < GRID_HEIGHT;
}

/**
 * containsPosition — is this square somewhere in that list?
 *
 * INPUT:  list — an array of positions (usually the snake). position — one square.
 * OUTPUT: true if the list holds a square with the same x and y
 *
 * ALGORITHM: walk the list; if samePosition says yes for any of them, answer
 *            true straight away. If you reach the end, answer false.
 *
 * This is how the snake finds out that it has bitten itself.
 */
function containsPosition(list, position) {
    for (let i = 0; i < list.length; i++) {
        if (samePosition(list[i], position)) {
            return true;
        }
    }
    return false;
}

/**
 * isOppositeDirection — are these two directions exact opposites?
 *
 * INPUT:  a, b — two directions
 * OUTPUT: true for up/down or left/right, false for anything else
 *
 * ALGORITHM: two opposite steps cancel each other out, so add them: if both
 *            a.x + b.x and a.y + b.y are 0, they are opposites.
 *
 * WHY: a snake must never turn straight back into its own neck.
 */
function isOppositeDirection(a, b) {
    return a.x + b.x === 0 && a.y + b.y === 0;
}

/**
 * emptyCells — every square that the snake is NOT sitting on.
 *
 * INPUT:  occupied — an array of positions (the snake)
 * OUTPUT: an array of all the free positions on the grid
 *
 * ALGORITHM:
 *   1. Start with an empty list.
 *   2. For every row y and every column x on the grid:
 *        build that position, and if the snake is not there, add it.
 *   3. Return the list.
 */
function emptyCells(occupied) {
    const free = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const position = createPosition(x, y);
            if (!containsPosition(occupied, position)) {
                free.push(position);
            }
        }
    }
    return free;
}

/**
 * randomEmptyCell — pick a free square at random (where the next apple goes).
 *
 * INPUT:  occupied — an array of positions (the snake)
 * OUTPUT: one free position, or null when the whole grid is full
 *
 * ALGORITHM:
 *   1. Ask emptyCells for every free square.
 *   2. If there are none, return null — the player has filled the board!
 *   3. Pick a random index and return that square.
 *
 * NOTE: it is tempting to guess random squares until one is free. That works
 *       at the start but takes longer and longer as the snake grows, and it
 *       never finishes at all when the board is full. Listing the free squares
 *       always finishes.
 */
function randomEmptyCell(occupied) {
    const free = emptyCells(occupied);
    if (free.length === 0) {
        return null;
    }
    const index = Math.floor(Math.random() * free.length);
    return free[index];
}
