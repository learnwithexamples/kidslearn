/* ============================================================
   flappy-rules.js — the rules of Flappy

   A bird falls. Tapping makes it flap upwards. Pipes slide past, and you have
   to fit through the gaps.

   The whole game is two ideas: GRAVITY pulling the bird down a little more
   every frame, and RECTANGLES that must not overlap.
   ============================================================ */

const FIELD_WIDTH = 300;
const FIELD_HEIGHT = 420;
const GROUND_Y = 388;

const BIRD_X = 70;
const BIRD_SIZE = 22;
const GRAVITY = 900;          /* pixels per second, per second */
const FLAP_SPEED = -305;      /* pixels per second, upwards */
const MAX_FALL_SPEED = 420;

const PIPE_WIDTH = 46;
const GAP_HEIGHT = 122;
const GAP_MARGIN = 44;        /* a gap is never closer than this to an edge */
const PIPE_SPACING = 172;     /* pixels between one pipe and the next */
const BASE_PIPE_SPEED = 118;

/**
 * pipeSpeed — how fast the pipes slide past on this level.
 * INPUT: level (1, 2, 3 …). OUTPUT: pixels per second.
 * ALGORITHM: 118 to start, 9 faster each level, but never above 240.
 */
function pipeSpeed(level) {
    const speed = BASE_PIPE_SPEED + (level - 1) * 9;
    return speed > 240 ? 240 : speed;
}

/**
 * levelForScore — the level you have reached.
 * INPUT: score. OUTPUT: 1, 2, 3 … (one level every 5 pipes).
 */
function levelForScore(score) {
    return Math.floor(score / 5) + 1;
}

/**
 * birdRect — the bird as a rectangle, so it can be tested against pipes.
 * INPUT: bird — something with a y. OUTPUT: { x, y, width, height }.
 */
function birdRect(bird) {
    return { x: BIRD_X, y: bird.y, width: BIRD_SIZE, height: BIRD_SIZE };
}

/**
 * makePipe — one pipe, with its gap in a random place.
 *
 * INPUT:  x — where the pipe starts, off the right-hand side
 * OUTPUT: { x, gapY, passed }
 *
 * ALGORITHM: gapY is the TOP of the gap. It is never closer than GAP_MARGIN
 *            to the ceiling or to the ground, so every pipe can be flown
 *            through.
 */
function makePipe(x) {
    const highest = GAP_MARGIN;
    const lowest = GROUND_Y - GAP_HEIGHT - GAP_MARGIN;
    const gapY = highest + Math.random() * (lowest - highest);
    return { x: x, gapY: gapY, passed: false };
}

/**
 * pipeRects — the two solid parts of a pipe.
 *
 * INPUT:  pipe — { x, gapY }
 * OUTPUT: { top, bottom } — two rectangles
 *
 * ALGORITHM: the top piece runs from the ceiling down to the gap; the bottom
 *            piece runs from the end of the gap down to the ground.
 */
function pipeRects(pipe) {
    return {
        top: { x: pipe.x, y: 0, width: PIPE_WIDTH, height: pipe.gapY },
        bottom: {
            x: pipe.x,
            y: pipe.gapY + GAP_HEIGHT,
            width: PIPE_WIDTH,
            height: GROUND_Y - (pipe.gapY + GAP_HEIGHT)
        }
    };
}

/**
 * overlaps — do two rectangles touch?
 *
 * INPUT:  a, b — { x, y, width, height }
 * OUTPUT: true if they overlap
 *
 * ALGORITHM: they MISS if one is completely left of, right of, above or below
 *            the other. If none of those four escapes is true, they touch.
 */
function overlaps(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

/**
 * applyGravity — the bird falls.
 *
 * INPUT:  bird — { y, dy }. seconds — how long this frame took.
 * OUTPUT: nothing; it changes the bird
 *
 * ALGORITHM: gravity does not move the bird — it changes its SPEED. Add
 *            GRAVITY × seconds to dy, keep dy below MAX_FALL_SPEED so it
 *            cannot fall faster than the game can draw, and only then move
 *            the bird by dy × seconds.
 */
function applyGravity(bird, seconds) {
    bird.dy = bird.dy + GRAVITY * seconds;
    if (bird.dy > MAX_FALL_SPEED) {
        bird.dy = MAX_FALL_SPEED;
    }
    bird.y = bird.y + bird.dy * seconds;
}

/**
 * flap — the only thing the player can do.
 *
 * INPUT:  bird
 * OUTPUT: nothing; it changes bird.dy
 *
 * ALGORITHM: SET dy to FLAP_SPEED — do not add to it. Setting it means every
 *            flap feels the same whether the bird was rising or plummeting.
 */
function flap(bird) {
    bird.dy = FLAP_SPEED;
}

/**
 * movePipes — slide the pipes left and forget the ones that have gone.
 *
 * INPUT:  pipes — the list. distance — how far to move them this frame.
 * OUTPUT: a NEW list of pipes
 *
 * ALGORITHM: take distance off every pipe's x, then keep only the ones whose
 *            right-hand edge is still on the screen.
 */
function movePipes(pipes, distance) {
    const moved = [];
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        const shifted = { x: pipe.x - distance, gapY: pipe.gapY, passed: pipe.passed };
        if (shifted.x + PIPE_WIDTH > 0) {
            moved.push(shifted);
        }
    }
    return moved;
}

/**
 * hitsPipe — has the bird flown into this pipe?
 * INPUT: bird, pipe. OUTPUT: true if it touches either half.
 */
function hitsPipe(bird, pipe) {
    const rects = pipeRects(pipe);
    return overlaps(birdRect(bird), rects.top) || overlaps(birdRect(bird), rects.bottom);
}

/**
 * isCrashed — is the game over?
 *
 * INPUT:  state
 * OUTPUT: true if the bird has hit anything
 *
 * ALGORITHM: the ground counts, the ceiling counts, and every pipe counts.
 */
function isCrashed(state) {
    if (state.bird.y + BIRD_SIZE >= GROUND_Y) {
        return true;
    }
    if (state.bird.y < 0) {
        return true;
    }
    for (let i = 0; i < state.pipes.length; i++) {
        if (hitsPipe(state.bird, state.pipes[i])) {
            return true;
        }
    }
    return false;
}

/**
 * scorePassedPipes — count the pipes the bird has just got through.
 *
 * INPUT:  state
 * OUTPUT: nothing; it changes the score
 *
 * ALGORITHM: a pipe scores once the bird is past its right-hand edge. The
 *            "passed" flag is what stops it scoring again on the next frame.
 */
function scorePassedPipes(state) {
    for (let i = 0; i < state.pipes.length; i++) {
        const pipe = state.pipes[i];
        if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
            pipe.passed = true;
            state.score = state.score + 1;
        }
    }
}

/** createGame — start a brand-new game. */
function createGame() {
    return {
        bird: { y: 130, dy: 0 },
        pipes: [makePipe(FIELD_WIDTH + 40)],
        sinceLastPipe: 0,
        score: 0,
        isOver: false,
        isPaused: true
    };
}

/** currentLevel — the level the player has reached. */
function currentLevel(state) {
    return levelForScore(state.score);
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
    const distance = pipeSpeed(currentLevel(state)) * seconds;

    applyGravity(state.bird, seconds);
    state.pipes = movePipes(state.pipes, distance);

    state.sinceLastPipe = state.sinceLastPipe + distance;
    if (state.sinceLastPipe >= PIPE_SPACING) {
        state.pipes.push(makePipe(FIELD_WIDTH + PIPE_WIDTH));
        state.sinceLastPipe = 0;
    }

    scorePassedPipes(state);

    if (isCrashed(state)) {
        state.isOver = true;
    }
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    if (!state.isOver) { state.isPaused = !state.isPaused; }
}

/** actionForKey — turn a keyboard key into an action name, or null. */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === ' ' || k === 'spacebar' || k === 'arrowup' || k === 'w') { return 'flap'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
