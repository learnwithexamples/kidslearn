/* ============================================================
   frogger-rules.js — the rules of Frogger

   Hop across a busy road, one square at a time, without being squashed.

   Two different worlds meet in this game: the frog lives on a GRID and moves
   one whole square at a time, while the cars live in PIXELS and slide
   smoothly. Working out where they meet is the interesting part.
   ============================================================ */

const COLUMNS = 9;
const ROWS = 11;
const CELL = 32;

const FIELD_WIDTH = COLUMNS * CELL;   /* 288 */
const FIELD_HEIGHT = ROWS * CELL;     /* 352 */

const HOME_ROW = 0;                   /* the safe bank at the top */
const START_ROW = ROWS - 1;           /* the safe bank at the bottom */
const FIRST_LANE = 1;
const LAST_LANE = ROWS - 2;           /* rows 1 … 9 could have traffic */
const MEDIAN_ROW = 5;                 /* … except this one: a safe island */

const CAR_HEIGHT = 22;
const START_LIVES = 3;

/**
 * laneDirection — which way does the traffic in this row go?
 * INPUT: row. OUTPUT: 1 for rightwards, -1 for leftwards.
 * ALGORITHM: odd rows go right, even rows go left, so the frog always has
 *            traffic coming at it from both sides.
 */
function laneDirection(row) {
    return row % 2 === 1 ? 1 : -1;
}

/**
 * laneSpeed — how fast the traffic in this row moves.
 *
 * INPUT:  row, level
 * OUTPUT: pixels per second (always a positive number)
 *
 * ALGORITHM: a base speed of 34 plus 9 for every row, so no two lanes move
 *            together, then 8 more for every level. Capped at 190 so even
 *            level 20 can be crossed.
 */
function laneSpeed(row, level) {
    const speed = 34 + row * 9 + (level - 1) * 8;
    return speed > 190 ? 190 : speed;
}

/**
 * isLane — does this row have traffic in it?
 * INPUT: row. OUTPUT: true if cars drive along it.
 * ALGORITHM: the two banks are safe, and so is the island in the middle —
 *            without somewhere to stop and think, the road is unfair.
 */
function isLane(row) {
    return row >= FIRST_LANE && row <= LAST_LANE && row !== MEDIAN_ROW;
}

/**
 * carWidth — how long the cars in this row are.
 * INPUT: row. OUTPUT: a width in pixels.
 * ALGORITHM: rows divisible by three get long lorries; the rest get cars.
 */
function carWidth(row) {
    return row % 3 === 0 ? 58 : 38;
}

/** carsInLane — how many vehicles share one row. */
function carsInLane(row) {
    return row % 3 === 0 ? 2 : 3;
}

/**
 * makeLane — the vehicles for one row, spread out evenly.
 * INPUT: row. OUTPUT: a list of cars.
 */
function makeLane(row) {
    const cars = [];
    const count = carsInLane(row);
    const spacing = FIELD_WIDTH / count;
    const offset = laneOffset(row, spacing);
    for (let i = 0; i < count; i++) {
        cars.push({ row: row, x: i * spacing + offset, width: carWidth(row) });
    }
    return cars;
}

/**
 * laneOffset — how far along its row a lane's traffic starts.
 *
 * INPUT:  row, spacing — the distance between two cars in that row
 * OUTPUT: a shift in pixels
 *
 * ALGORITHM: every row is shifted by a different amount so the traffic is
 *            staggered. Line them all up instead and the frog would be run
 *            over on its very first hop, every single game.
 */
function laneOffset(row, spacing) {
    return (row * 37) % spacing;
}

/** makeTraffic — every vehicle on the whole road. */
function makeTraffic() {
    let cars = [];
    for (let row = FIRST_LANE; row <= LAST_LANE; row++) {
        if (isLane(row)) {
            cars = cars.concat(makeLane(row));
        }
    }
    return cars;
}

/**
 * wrapCar — a car that drives off one side comes back on the other.
 *
 * INPUT:  car — { row, x, width }
 * OUTPUT: nothing; it changes car.x
 *
 * ALGORITHM: once the car is completely past the right-hand edge, put its
 *            back bumper just off the left edge, and the other way round.
 *            The road is a loop, so the traffic never runs out.
 */
function wrapCar(car) {
    if (car.x > FIELD_WIDTH) {
        car.x = -car.width;
    }
    if (car.x + car.width < 0) {
        car.x = FIELD_WIDTH;
    }
}

/**
 * moveCars — slide every vehicle along its row.
 *
 * INPUT:  cars — the list. seconds — how long this frame took. level.
 * OUTPUT: nothing; it changes the cars
 *
 * ALGORITHM: each car moves by its own lane's speed and direction, then wraps.
 */
function moveCars(cars, seconds, level) {
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        car.x = car.x + laneDirection(car.row) * laneSpeed(car.row, level) * seconds;
        wrapCar(car);
    }
}

/** frogRect — the frog as a rectangle, slightly smaller than its square. */
function frogRect(frog) {
    return {
        x: frog.column * CELL + 4,
        y: frog.row * CELL + 5,
        width: CELL - 8,
        height: CELL - 10
    };
}

/** carRect — one vehicle as a rectangle. */
function carRect(car) {
    return {
        x: car.x,
        y: car.row * CELL + (CELL - CAR_HEIGHT) / 2,
        width: car.width,
        height: CAR_HEIGHT
    };
}

/** overlaps — do two rectangles touch? */
function overlaps(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

/**
 * isSquashed — has a car caught the frog?
 *
 * INPUT:  state
 * OUTPUT: true if any car overlaps the frog
 *
 * ALGORITHM: only the cars in the frog's own row can possibly touch it, so
 *            skip the rest — that is nine times less work every frame.
 */
function isSquashed(state) {
    const frog = frogRect(state.frog);
    for (let i = 0; i < state.cars.length; i++) {
        const car = state.cars[i];
        if (car.row === state.frog.row && overlaps(frog, carRect(car))) {
            return true;
        }
    }
    return false;
}

/**
 * moveFrog — one hop.
 *
 * INPUT:  state. dColumn, dRow — the hop, e.g. 0, -1 for "up".
 * OUTPUT: true if the frog moved
 *
 * ALGORITHM: work out where it would land, refuse to leave the field, and
 *            remember the highest row it has ever reached so that hopping
 *            forward scores but hopping back and forth does not.
 */
function moveFrog(state, dColumn, dRow) {
    if (state.isOver || state.isPaused) {
        return false;
    }
    const column = state.frog.column + dColumn;
    const row = state.frog.row + dRow;

    if (column < 0 || column >= COLUMNS || row < 0 || row >= ROWS) {
        return false;
    }

    state.frog.column = column;
    state.frog.row = row;

    if (row < state.highestRow) {
        state.highestRow = row;
        state.score = state.score + 10;
    }
    return true;
}

/**
 * reachHome — has the frog made it to the top?
 *
 * INPUT:  state
 * OUTPUT: true if it just got home
 *
 * ALGORITHM: a frog on the home row scores a big bonus, the level goes up,
 *            and it starts again from the bottom bank.
 */
function reachHome(state) {
    if (state.frog.row !== HOME_ROW) {
        return false;
    }
    state.score = state.score + 100;
    state.crossings = state.crossings + 1;
    state.level = state.level + 1;
    resetFrog(state);
    return true;
}

/** resetFrog — put the frog back on the starting bank. */
function resetFrog(state) {
    state.frog = { column: Math.floor(COLUMNS / 2), row: START_ROW };
    state.highestRow = START_ROW;
}

/** createGame — start a brand-new game. */
function createGame() {
    const state = {
        frog: { column: Math.floor(COLUMNS / 2), row: START_ROW },
        cars: makeTraffic(),
        highestRow: START_ROW,
        lives: START_LIVES,
        score: 0,
        level: 1,
        crossings: 0,
        isOver: false,
        isPaused: false
    };
    return state;
}

/**
 * updateGame — one frame of the game.
 * INPUT: state, elapsedMs. OUTPUT: nothing.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }
    moveCars(state.cars, elapsedMs / 1000, state.level);

    if (isSquashed(state)) {
        state.lives = state.lives - 1;
        if (state.lives <= 0) {
            state.lives = 0;
            state.isOver = true;
        } else {
            resetFrog(state);
        }
        return;
    }

    reachHome(state);
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
    if (k === 'p' || k === ' ' || k === 'spacebar') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
