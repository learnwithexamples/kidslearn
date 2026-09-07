/* ============================================================
   bubbles-rules.js — the rules of Bubble Shooter

   Aim, shoot, and stick a bubble to the ceiling of bubbles. Three or more of
   the same kind touching, and they all pop — and anything left dangling with
   nothing above it falls away.

   Two searches do all the work here, and they are the same search asked two
   different questions:
     • which bubbles of the SAME KIND are joined to this one?   (do they pop?)
     • which bubbles are joined to the CEILING?                 (what falls?)
   ============================================================ */

const COLUMNS = 10;
const ROWS = 12;
const CELL = 28;
const BUBBLE_RADIUS = CELL / 2 - 1;

const GRID_WIDTH = COLUMNS * CELL;
const GRID_HEIGHT = ROWS * CELL;

const FIELD_WIDTH = GRID_WIDTH;
const FIELD_HEIGHT = GRID_HEIGHT + 64;

const SHOOTER_X = FIELD_WIDTH / 2;
const SHOOTER_Y = FIELD_HEIGHT - 24;

const KIND_COUNT = 5;
const EMPTY = -1;

const SHOT_SPEED = 420;

/* How far a shot may travel between two collision checks. A whole frame's
   worth at once is over half a cell, which is enough to carry a fast bubble
   through a gap, or bury it deep inside the cluster before anything notices —
   and a bubble that stops deep inside lands nowhere near where it hit. */
const MAX_STEP = 4;
const MIN_POP = 3;
const POINTS_PER_BUBBLE = 10;
const POINTS_PER_DROP = 25;

/* the shooter may not aim flat sideways, or a shot would never come down */
const MIN_ANGLE = -Math.PI + 0.35;
const MAX_ANGLE = -0.35;
const TURN_SPEED = 2.2;

/**
 * bubbleIndex — turn a column and row into a place in the grid list.
 * INPUT: column, row. OUTPUT: the position in the flat list.
 */
function bubbleIndex(column, row) {
    return row * COLUMNS + column;
}

/** isInsideGrid — is this cell on the grid? */
function isInsideGrid(column, row) {
    return column >= 0 && column < COLUMNS && row >= 0 && row < ROWS;
}

/**
 * bubbleCentre — the middle of one cell, in pixels.
 *
 * INPUT:  column, row
 * OUTPUT: { x, y }
 *
 * ALGORITHM: step across by CELL for each column and down for each row, then
 *            add half a cell to land in the MIDDLE rather than the corner.
 *            Bubbles are circles, and a circle is drawn from its middle.
 */
function bubbleCentre(column, row) {
    return {
        x: column * CELL + CELL / 2,
        y: row * CELL + CELL / 2
    };
}

/** cellAtPixel — which cell is this point in? null if it is off the grid. */
function cellAtPixel(x, y) {
    const column = Math.floor(x / CELL);
    const row = Math.floor(y / CELL);
    if (!isInsideGrid(column, row)) {
        return null;
    }
    return { column: column, row: row };
}

/** randomKind — one of the kinds of bubble, at random. */
function randomKind() {
    return Math.floor(Math.random() * KIND_COUNT);
}

/** neighbours — the four cells touching this one, on the grid. */
function neighbours(column, row) {
    const found = [];
    const steps = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (let i = 0; i < steps.length; i++) {
        const c = column + steps[i][0];
        const r = row + steps[i][1];
        if (isInsideGrid(c, r)) {
            found.push({ column: c, row: r });
        }
    }
    return found;
}

/**
 * turnShooter — swing the aim left or right.
 *
 * INPUT:  state. change — -1 for left, 1 for right. seconds.
 * OUTPUT: nothing; it changes state.angle
 *
 * ALGORITHM: move the angle, then keep it between MIN_ANGLE and MAX_ANGLE.
 *            Without those limits the player could aim flat sideways, and a
 *            shot that never comes down is a shot that hangs the game.
 */
function turnShooter(state, change, seconds) {
    let angle = state.angle + change * TURN_SPEED * seconds;
    if (angle < MIN_ANGLE) { angle = MIN_ANGLE; }
    if (angle > MAX_ANGLE) { angle = MAX_ANGLE; }
    state.angle = angle;
}

/**
 * sameGroup — every bubble of the same kind joined to this one.
 *
 * INPUT:  grid, column, row
 * OUTPUT: a list of cells, including the one you started from
 *
 * ALGORITHM: FLOOD FILL again — a to-do list, exactly like Minesweeper. Take
 *            a cell off, and if it holds the same kind and you have not seen
 *            it before, keep it and put its neighbours on the list.
 *
 *            An empty cell has no group at all, so that case comes first.
 */
function sameGroup(grid, column, row) {
    const kind = grid[bubbleIndex(column, row)];
    if (kind === EMPTY) {
        return [];
    }

    const seen = {};
    const group = [];
    const todo = [{ column: column, row: row }];

    while (todo.length > 0) {
        const cell = todo.pop();
        const index = bubbleIndex(cell.column, cell.row);

        if (seen[index] || grid[index] !== kind) {
            continue;
        }
        seen[index] = true;
        group.push(cell);

        const around = neighbours(cell.column, cell.row);
        for (let i = 0; i < around.length; i++) {
            todo.push(around[i]);
        }
    }
    return group;
}

/**
 * popGroup — burst a group, if it is big enough.
 *
 * INPUT:  state, group — the cells found by sameGroup
 * OUTPUT: how many bubbles popped
 *
 * ALGORITHM: fewer than MIN_POP and nothing happens at all — that is the
 *            whole rule of the game. Otherwise empty every cell in the group
 *            and score for each one.
 */
function popGroup(state, group) {
    if (group.length < MIN_POP) {
        return 0;
    }
    for (let i = 0; i < group.length; i++) {
        state.grid[bubbleIndex(group[i].column, group[i].row)] = EMPTY;
    }
    state.score = state.score + group.length * POINTS_PER_BUBBLE;
    state.popped = state.popped + group.length;
    return group.length;
}

/**
 * dropFloaters — anything no longer hanging from the ceiling falls away.
 *
 * INPUT:  state
 * OUTPUT: how many bubbles fell
 *
 * ALGORITHM: the same search as sameGroup, asked a different question. Start
 *            from every bubble in the TOP row and spread out through their
 *            neighbours — ignoring what kind they are this time. Anything the
 *            search never reaches is dangling in mid-air, so it drops.
 *
 * WHY it is worth the trouble: popping the bubble that holds up a whole
 *      cluster brings the lot down at once, and that is where the big scores
 *      come from.
 */
function dropFloaters(state) {
    const held = {};
    const todo = [];

    for (let column = 0; column < COLUMNS; column++) {
        if (state.grid[bubbleIndex(column, 0)] !== EMPTY) {
            todo.push({ column: column, row: 0 });
        }
    }

    while (todo.length > 0) {
        const cell = todo.pop();
        const index = bubbleIndex(cell.column, cell.row);

        if (held[index] || state.grid[index] === EMPTY) {
            continue;
        }
        held[index] = true;

        const around = neighbours(cell.column, cell.row);
        for (let i = 0; i < around.length; i++) {
            todo.push(around[i]);
        }
    }

    let fell = 0;
    for (let i = 0; i < state.grid.length; i++) {
        if (state.grid[i] !== EMPTY && !held[i]) {
            state.grid[i] = EMPTY;
            fell = fell + 1;
        }
    }

    if (fell > 0) {
        state.score = state.score + fell * POINTS_PER_DROP;
        state.dropped = state.dropped + fell;
    }
    return fell;
}

/** bubblesLeft — how many bubbles are still up there. */
function bubblesLeft(state) {
    let count = 0;
    for (let i = 0; i < state.grid.length; i++) {
        if (state.grid[i] !== EMPTY) { count = count + 1; }
    }
    return count;
}

/** lowestRow — how far down the bubbles reach. -1 if there are none. */
function lowestRow(state) {
    let lowest = -1;
    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            if (state.grid[bubbleIndex(column, row)] !== EMPTY) { lowest = row; }
        }
    }
    return lowest;
}

/**
 * shootBubble — send the waiting bubble on its way.
 * INPUT: state. OUTPUT: true if a shot was fired.
 * ALGORITHM: one shot at a time — the flying bubble has to land before the
 *            next one can go, which is what makes each shot a decision.
 */
function shootBubble(state) {
    if (state.isOver || state.isPaused || state.flying !== null) {
        return false;
    }
    state.flying = {
        x: SHOOTER_X,
        y: SHOOTER_Y,
        dx: Math.cos(state.angle) * SHOT_SPEED,
        dy: Math.sin(state.angle) * SHOT_SPEED,
        kind: state.holding
    };
    state.holding = state.next;
    state.next = randomKind();
    state.shots = state.shots + 1;
    return true;
}

/**
 * canStickHere — may a flying bubble stop in this cell?
 *
 * INPUT:  state, column, row
 * OUTPUT: true if a bubble could sit there
 *
 * ALGORITHM: the cell has to be empty, and it has to have something to hold
 *            on to — either it is up on the ceiling row, or one of its four
 *            neighbours already holds a bubble.
 *
 * WHY the second half matters: without it a shot can stop in a cell that
 *      touches nothing at all and hang there in mid-air. Worse, it then
 *      belongs to no group, so it can never be popped — it just sits there
 *      until something else pops and the falling rule sweeps it away.
 */
function canStickHere(state, column, row) {
    if (state.grid[bubbleIndex(column, row)] !== EMPTY) {
        return false;
    }
    if (row === 0) {
        return true;
    }
    const around = neighbours(column, row);
    for (let i = 0; i < around.length; i++) {
        if (state.grid[bubbleIndex(around[i].column, around[i].row)] !== EMPTY) {
            return true;
        }
    }
    return false;
}

/**
 * nearestFreeCell — where should a flying bubble stick?
 *
 * INPUT:  state, x, y — where the bubble ended up
 * OUTPUT: a cell { column, row }, or null if there is nowhere at all
 *
 * ALGORITHM: of every cell it COULD stick to, take the one whose middle is
 *            closest to where the bubble actually stopped.
 */
function nearestFreeCell(state, x, y) {
    let best = null;
    let bestDistance = 0;

    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            if (!canStickHere(state, column, row)) { continue; }
            const centre = bubbleCentre(column, row);
            const away = Math.sqrt((centre.x - x) * (centre.x - x) +
                                   (centre.y - y) * (centre.y - y));
            if (best === null || away < bestDistance) {
                best = { column: column, row: row };
                bestDistance = away;
            }
        }
    }
    return best;
}

/** hitsABubble — is the flying bubble touching one that is already stuck? */
function hitsABubble(state, x, y) {
    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            if (state.grid[bubbleIndex(column, row)] === EMPTY) { continue; }
            const centre = bubbleCentre(column, row);
            const acrossBy = centre.x - x;
            const downBy = centre.y - y;
            if (Math.sqrt(acrossBy * acrossBy + downBy * downBy) < BUBBLE_RADIUS * 1.8) {
                return true;
            }
        }
    }
    return false;
}

/**
 * landBubble — the flying bubble sticks, pops what it can, and drops the rest.
 * INPUT: state. OUTPUT: nothing.
 */
function landBubble(state) {
    const cell = nearestFreeCell(state, state.flying.x, state.flying.y);
    if (cell === null) {
        state.flying = null;
        return;
    }

    state.grid[bubbleIndex(cell.column, cell.row)] = state.flying.kind;
    state.flying = null;

    const popped = popGroup(state, sameGroup(state.grid, cell.column, cell.row));
    if (popped > 0) {
        dropFloaters(state);
    }

    if (bubblesLeft(state) === 0) {
        state.score = state.score + 500;
        fillCeiling(state, 4);
        state.wave = state.wave + 1;
    } else if (lowestRow(state) >= ROWS - 1) {
        state.isOver = true;
    }
}

/** fillCeiling — hang a fresh block of bubbles from the top. */
function fillCeiling(state, rows) {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            state.grid[bubbleIndex(column, row)] = randomKind();
        }
    }
}

/** createGame — start a brand-new game. */
function createGame() {
    const grid = [];
    for (let i = 0; i < COLUMNS * ROWS; i++) {
        grid.push(EMPTY);
    }
    const state = {
        grid: grid,
        flying: null,
        angle: -Math.PI / 2,
        turning: 0,
        holding: randomKind(),
        next: randomKind(),
        score: 0,
        shots: 0,
        popped: 0,
        dropped: 0,
        wave: 1,
        isOver: false,
        isPaused: false
    };
    fillCeiling(state, 4);
    return state;
}

/**
 * moveShot — carry the flying bubble along by one small step.
 *
 * INPUT:  state, distance — how far to move it, in pixels
 * OUTPUT: nothing; the shot may land or fall off the bottom
 *
 * ALGORITHM: move along the direction it is travelling, bounce off the side
 *            walls, then look for a landing. Called over and over with a
 *            small distance, so a shot is never checked only after a big jump.
 */
function moveShot(state, distance) {
    const flying = state.flying;
    const speed = Math.sqrt(flying.dx * flying.dx + flying.dy * flying.dy);
    if (speed === 0) {
        state.flying = null;
        return;
    }

    flying.x = flying.x + flying.dx / speed * distance;
    flying.y = flying.y + flying.dy / speed * distance;

    /* the side walls bounce a shot back — that is how you reach the corners */
    if (flying.x < BUBBLE_RADIUS) {
        flying.x = BUBBLE_RADIUS;
        flying.dx = -flying.dx;
    }
    if (flying.x > FIELD_WIDTH - BUBBLE_RADIUS) {
        flying.x = FIELD_WIDTH - BUBBLE_RADIUS;
        flying.dx = -flying.dx;
    }

    if (flying.y < BUBBLE_RADIUS || hitsABubble(state, flying.x, flying.y)) {
        landBubble(state);
    } else if (flying.y > FIELD_HEIGHT) {
        state.flying = null;
    }
}

/**
 * updateGame — one frame of the game.
 * INPUT: state, elapsedMs. OUTPUT: nothing.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }
    const seconds = elapsedMs / 1000;

    if (state.turning !== 0) {
        turnShooter(state, state.turning, seconds);
    }

    if (state.flying === null) {
        return;
    }

    /* Walk the shot along in small steps, checking as it goes. */
    const speed = Math.sqrt(state.flying.dx * state.flying.dx +
                            state.flying.dy * state.flying.dy);
    let togo = speed * seconds;

    while (state.flying !== null && togo > 0) {
        const step = togo > MAX_STEP ? MAX_STEP : togo;
        togo = togo - step;
        moveShot(state, step);
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
    if (k === ' ' || k === 'spacebar' || k === 'arrowup' || k === 'w') { return 'shoot'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
