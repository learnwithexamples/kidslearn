/* ============================================================
   whack-rules.js — the rules of Whack-a-Mole

   Nine holes in a 3 x 3 grid. A mole pops out of one hole at a time; hit it
   before it ducks back down. The game lasts GAME_SECONDS, and the moles get
   faster the better you do.
   ============================================================ */

const GRID_SIZE = 3;
const HOLE_COUNT = GRID_SIZE * GRID_SIZE;

/** How long one game lasts, in seconds. */
const GAME_SECONDS = 45;

/**
 * holeIndex — turn a column and row into a place in the list.
 * INPUT: column, row (0 to 2). OUTPUT: 0 to 8.
 */
function holeIndex(column, row) {
    return row * GRID_SIZE + column;
}

/**
 * randomHole — pick the next hole for the mole.
 *
 * INPUT:  previous — the hole the mole was just in (-1 if there was none)
 * OUTPUT: a hole number from 0 to HOLE_COUNT - 1, never the same as previous
 *
 * ALGORITHM: list every hole except the one it just used, then pick one of
 *            those at random. (Popping out of the same hole twice in a row
 *            feels broken, even though it is perfectly random.)
 */
function randomHole(previous) {
    const choices = [];
    for (let hole = 0; hole < HOLE_COUNT; hole++) {
        if (hole !== previous) {
            choices.push(hole);
        }
    }
    return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * moleInterval — how long the mole stays up, in milliseconds.
 *
 * INPUT:  level — the level you are on (1, 2, 3, …)
 * OUTPUT: milliseconds
 *
 * ALGORITHM: 1100 ms on level 1, 90 ms less each level, never below 350 —
 *            below that even a very fast player cannot see it coming.
 */
function moleInterval(level) {
    const milliseconds = 1100 - (level - 1) * 90;
    if (milliseconds < 350) {
        return 350;
    }
    return milliseconds;
}

/**
 * levelForHits — which level has this many hits earned?
 * INPUT: hits. OUTPUT: the level, starting at 1.
 * ALGORITHM: a new level every 5 hits.
 */
function levelForHits(hits) {
    return Math.floor(hits / 5) + 1;
}

/**
 * scoreForHit — how many points is one mole worth?
 * INPUT: level. OUTPUT: the points to add.
 * ALGORITHM: 10 points times the level, because faster moles are harder.
 */
function scoreForHit(level) {
    return 10 * level;
}

/** createGame — start a brand-new game. */
function createGame() {
    return {
        mole: randomHole(-1),
        moleTimer: 0,
        secondsLeft: GAME_SECONDS,
        score: 0,
        hits: 0,
        misses: 0,
        level: 1,
        cursor: { column: 1, row: 1 },
        lastResult: '',
        isOver: false,
        isPaused: false
    };
}

/**
 * whack — swing at one hole.
 *
 * INPUT:  state — the game. index — the hole you hit.
 * OUTPUT: true if there was a mole there
 *
 * ALGORITHM:
 *   1. Do nothing if the game is over or paused.
 *   2. A hit: count it, add the points, work out the new level, and send the
 *      mole to a different hole straight away.
 *   3. A miss: count it. The mole stays where it is — no free clues!
 */
function whack(state, index) {
    if (state.isOver || state.isPaused) {
        return false;
    }

    if (index === state.mole) {
        state.hits = state.hits + 1;
        state.score = state.score + scoreForHit(state.level);
        state.level = levelForHits(state.hits);
        state.mole = randomHole(state.mole);
        state.moleTimer = 0;
        state.lastResult = 'hit';
        return true;
    }

    state.misses = state.misses + 1;
    state.lastResult = 'miss';
    return false;
}

/**
 * updateGame — let time pass (called about 60 times a second).
 *
 * INPUT:  state, elapsedMs
 * OUTPUT: nothing
 *
 * ALGORITHM: count down the clock and end the game at zero; and while the
 *            game runs, move the mole whenever it has been up for longer than
 *            this level's interval.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }

    state.secondsLeft = state.secondsLeft - elapsedMs / 1000;
    if (state.secondsLeft <= 0) {
        state.secondsLeft = 0;
        state.isOver = true;
        return;
    }

    state.moleTimer = state.moleTimer + elapsedMs;
    if (state.moleTimer >= moleInterval(state.level)) {
        state.moleTimer = 0;
        state.mole = randomHole(state.mole);
    }
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
    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'whack'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
