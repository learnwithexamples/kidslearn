/* ============================================================
   tetris-game.js — the rules of the game

   Everything the game needs to remember lives in one object called the
   "state":

       {
         board:     the 10 x 20 grid of locked blocks
         piece:     the piece falling right now (or null)
         bag:       the shuffled list the next pieces come from
         nextType:  which shape comes next ('T', 'I', ...)
         score:     points
         lines:     how many rows have been cleared in total
         level:     goes up every 10 lines; makes pieces fall faster
         dropTimer: milliseconds counted since the last automatic step down
         isOver:    true once a new piece cannot fit
         isPaused:  true while the game is frozen
       }

   The functions below CHANGE that state according to the rules. They do not
   draw anything and they do not read the keyboard.
   ============================================================ */

/**
 * createGame — start a brand-new game.
 *
 * INPUT:  none
 * OUTPUT: a fresh state object with an empty board and the first piece ready
 *
 * ALGORITHM:
 *   1. Build the empty board.
 *   2. Fill the bag with a shuffled set of the seven shapes.
 *   3. Set score, lines and timers to their starting values, level to 1.
 *   4. Spawn the first piece.
 */
function createGame() {
    const state = {
        board: createEmptyBoard(BOARD_WIDTH, BOARD_HEIGHT),
        piece: null,
        bag: createShuffledBag(),
        nextType: null,
        score: 0,
        lines: 0,
        level: 1,
        dropTimer: 0,
        isOver: false,
        isPaused: false
    };
    state.nextType = takeFromBag(state);
    spawnPiece(state);
    return state;
}

/**
 * takeFromBag — get the next shape name, refilling the bag when it runs out.
 *
 * INPUT:  state — the game state
 * OUTPUT: a shape name such as 'S'
 *
 * ALGORITHM:
 *   1. If the bag is empty, refill it with a new shuffled bag.
 *   2. Remove the first name from the bag (shift) and return it.
 */
function takeFromBag(state) {
    if (state.bag.length === 0) {
        state.bag = createShuffledBag();
    }
    return state.bag.shift();
}

/**
 * startingColumn — where along the top should a new piece appear?
 *
 * INPUT:  board — a board
 *         piece — a piece object
 * OUTPUT: a column number that puts the piece in the middle
 *
 * ALGORITHM: (board width - piece matrix width) / 2, rounded down.
 */
function startingColumn(board, piece) {
    return Math.floor((boardWidth(board) - piece.cells.length) / 2);
}

/**
 * spawnPiece — bring the next piece into play at the top of the board.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing; it changes state.piece, state.nextType and maybe state.isOver
 *
 * ALGORITHM:
 *   1. Build a piece from state.nextType and choose a new nextType from the bag.
 *   2. Put it in the middle of the top row (y = 0).
 *   3. If the piece cannot be placed there, the pile has reached the ceiling:
 *      the game is over.
 */
function spawnPiece(state) {
    const piece = createPiece(state.nextType);
    piece.x = startingColumn(state.board, piece);
    piece.y = 0;

    state.nextType = takeFromBag(state);
    state.piece = piece;
    state.dropTimer = 0;

    if (!canPlacePiece(state.board, piece)) {
        state.isOver = true;
    }
}

/**
 * tryMove — try to slide the falling piece.
 *
 * INPUT:  state — the game state
 *         dx    — -1 for left, +1 for right, 0 for none
 *         dy    — +1 for one row down, 0 for none
 * OUTPUT: true if the move happened, false if something was in the way
 *
 * ALGORITHM:
 *   1. Work out where the piece WOULD be (movePiece makes a copy).
 *   2. Ask canPlacePiece whether that spot is legal.
 *   3. If it is, keep the moved copy and answer true. Otherwise answer false
 *      and leave the piece exactly where it was.
 *
 * "Try it on a copy first" is the trick that makes collisions easy.
 */
function tryMove(state, dx, dy) {
    if (state.piece === null || state.isOver || state.isPaused) {
        return false;
    }
    const moved = movePiece(state.piece, dx, dy);
    if (canPlacePiece(state.board, moved)) {
        state.piece = moved;
        return true;
    }
    return false;
}

/**
 * WALL_KICKS — the sideways nudges to try when a rotation does not fit.
 * 0 means "no nudge", -1 means "one square left", and so on.
 */
const WALL_KICKS = [0, -1, 1, -2, 2];

/**
 * tryRotate — try to turn the falling piece a quarter turn.
 *
 * INPUT:  state     — the game state
 *         clockwise — true for right, false for left
 * OUTPUT: true if the piece turned, false if there was no room
 *
 * ALGORITHM (rotation with "wall kicks"):
 *   1. Make a rotated copy of the piece.
 *   2. For each nudge in WALL_KICKS:
 *        move the rotated copy sideways by that nudge,
 *        and if canPlacePiece says it fits, keep it and answer true.
 *   3. If no nudge worked, answer false and leave the piece alone.
 *
 * WHY the nudges: without them you could never spin a piece while it is
 * touching a wall, which feels broken to a player.
 */
function tryRotate(state, clockwise) {
    if (state.piece === null || state.isOver || state.isPaused) {
        return false;
    }
    const turned = rotatePiece(state.piece, clockwise);
    for (let i = 0; i < WALL_KICKS.length; i++) {
        const candidate = movePiece(turned, WALL_KICKS[i], 0);
        if (canPlacePiece(state.board, candidate)) {
            state.piece = candidate;
            return true;
        }
    }
    return false;
}

/**
 * softDrop — push the piece down one row (the player is holding Down).
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Try to move down one row.
 *   2. If it worked, add 1 point and reset the fall timer.
 *   3. If it did not work, the piece has landed: lock it.
 */
function softDrop(state) {
    if (state.piece === null || state.isOver || state.isPaused) {
        return;
    }
    if (tryMove(state, 0, 1)) {
        state.score = state.score + 1;
        state.dropTimer = 0;
    } else {
        lockPiece(state);
    }
}

/**
 * hardDrop — slam the piece straight to the bottom (the space bar).
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Ask dropDistance how many rows are free below the piece.
 *   2. Move the piece down by exactly that many rows.
 *   3. Add 2 points for every row travelled.
 *   4. Lock the piece immediately.
 */
function hardDrop(state) {
    if (state.piece === null || state.isOver || state.isPaused) {
        return;
    }
    const distance = dropDistance(state.board, state.piece);
    state.piece = movePiece(state.piece, 0, distance);
    state.score = state.score + distance * 2;
    lockPiece(state);
}

/**
 * scoreForLines — how many points is a line clear worth?
 *
 * INPUT:  lineCount — how many rows were cleared at once (0 to 4)
 *         level     — the current level
 * OUTPUT: a number of points
 *
 * ALGORITHM: look the base score up in a table, then multiply by the level.
 *      0 lines -> 0        1 line  -> 100
 *      2 lines -> 300      3 lines -> 500
 *      4 lines -> 800  (that is a "Tetris"! Four at once pays double.)
 */
function scoreForLines(lineCount, level) {
    const table = [0, 100, 300, 500, 800];
    return table[lineCount] * level;
}

/**
 * levelForLines — which level does this many cleared lines earn?
 *
 * INPUT:  totalLines — how many rows the player has cleared in the whole game
 * OUTPUT: the level number, starting at 1
 *
 * ALGORITHM: level = (totalLines / 10, rounded down) + 1.
 *            So 0-9 lines is level 1, 10-19 is level 2, and so on.
 */
function levelForLines(totalLines) {
    return Math.floor(totalLines / 10) + 1;
}

/**
 * dropIntervalForLevel — how long between automatic steps down?
 *
 * INPUT:  level — the level number (1, 2, 3, ...)
 * OUTPUT: a number of milliseconds
 *
 * ALGORITHM: start at 800 ms and take 65 ms off for every level above 1,
 *            but never go faster than 90 ms.
 *            Level 1 = 800 ms, level 5 = 540 ms, level 12 or more = 90 ms.
 */
function dropIntervalForLevel(level) {
    const interval = 800 - (level - 1) * 65;
    if (interval < 90) {
        return 90;
    }
    return interval;
}

/**
 * lockPiece — the piece has landed: freeze it and clear any full rows.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing; the board, score, lines and level all get updated
 *
 * ALGORITHM:
 *   1. Stamp the piece onto the board (mergePieceIntoBoard).
 *   2. Ask findFullRows which rows are complete.
 *   3. If there are any: remove them, add them to the line count, add the
 *      points, and work out the new level.
 *   4. Spawn the next piece (which may end the game).
 */
function lockPiece(state) {
    state.board = mergePieceIntoBoard(state.board, state.piece);

    const fullRows = findFullRows(state.board);
    if (fullRows.length > 0) {
        state.board = removeRows(state.board, fullRows);
        state.lines = state.lines + fullRows.length;
        state.score = state.score + scoreForLines(fullRows.length, state.level);
        state.level = levelForLines(state.lines);
    }

    state.lastCleared = fullRows.length;
    spawnPiece(state);
}

/**
 * updateGame — let time pass (called about 60 times a second).
 *
 * INPUT:  state     — the game state
 *         elapsedMs — how many milliseconds went by since the last call
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. If the game is over or paused, do nothing at all.
 *   2. Add elapsedMs to the drop timer.
 *   3. While the timer is bigger than the level's drop interval:
 *        take that much off the timer, and step the piece down one row —
 *        locking it instead if it cannot move.
 *
 * This is what makes the piece fall on its own, faster on higher levels.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused || state.piece === null) {
        return;
    }

    const interval = dropIntervalForLevel(state.level);
    state.dropTimer = state.dropTimer + elapsedMs;

    while (state.dropTimer >= interval) {
        state.dropTimer = state.dropTimer - interval;
        if (!tryMove(state, 0, 1)) {
            lockPiece(state);
            return;
        }
    }
}

/**
 * getGhostPiece — where would the piece land if you dropped it right now?
 *
 * INPUT:  state — the game state
 * OUTPUT: a piece object sitting at the landing spot, or null if no piece
 *
 * ALGORITHM: copy the falling piece and move it down by dropDistance rows.
 *
 * The drawing code shows this as a hollow outline so the player can aim.
 */
function getGhostPiece(state) {
    if (state.piece === null) {
        return null;
    }
    const distance = dropDistance(state.board, state.piece);
    return movePiece(state.piece, 0, distance);
}

/**
 * togglePause — freeze or unfreeze the game.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing
 *
 * ALGORITHM: flip isPaused to its opposite — but never unpause a finished game.
 */
function togglePause(state) {
    if (state.isOver) {
        return;
    }
    state.isPaused = !state.isPaused;
}
