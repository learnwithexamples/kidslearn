/* ============================================================
   breakout-rules.js — the rules of Breakout

   A ball bounces around a box. You slide a paddle along the bottom to keep it
   in play, and every brick it touches disappears. Clear them all to win.

   Unlike the board games, nothing here sits on a grid: the ball has a real
   position in PIXELS and a speed in pixels per second, so it can be anywhere.
   ============================================================ */

const FIELD_WIDTH = 320;
const FIELD_HEIGHT = 420;

const BRICK_COLUMNS = 7;
const BRICK_ROWS = 5;
const BRICK_TOP = 44;
const BRICK_HEIGHT = 18;
const BRICK_GAP = 4;
const BRICK_SIDE_MARGIN = 8;
const BRICK_WIDTH = (FIELD_WIDTH - BRICK_SIDE_MARGIN * 2 - BRICK_GAP * (BRICK_COLUMNS - 1)) / BRICK_COLUMNS;

const PADDLE_WIDTH = 74;
const PADDLE_HEIGHT = 12;
const PADDLE_Y = FIELD_HEIGHT - 30;
const PADDLE_SPEED = 340;      /* pixels per second */

const BALL_RADIUS = 6;
const START_LIVES = 3;

/**
 * brickIndex — turn a column and row into a place in the list.
 * INPUT: column, row. OUTPUT: the position in the flat list of bricks.
 */
function brickIndex(column, row) {
    return row * BRICK_COLUMNS + column;
}

/**
 * brickRect — where one brick sits, as a rectangle.
 *
 * INPUT:  column, row
 * OUTPUT: { x, y, width, height } in pixels
 *
 * ALGORITHM: start at the side margin, skip a brick plus a gap for every
 *            column, and do the same downwards for the rows.
 */
function brickRect(column, row) {
    return {
        x: BRICK_SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_GAP),
        y: BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP),
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT
    };
}

/**
 * hitsRect — is the ball touching this rectangle?
 *
 * INPUT:  ball — { x, y } the middle of the ball. rect — { x, y, width, height }.
 * OUTPUT: true if they overlap
 *
 * ALGORITHM (the closest-point trick): find the point of the rectangle that is
 *            nearest the middle of the ball by clamping the ball's x and y to
 *            the rectangle's edges. If that point is closer than the ball's
 *            radius, they are touching.
 */
function hitsRect(ball, rect) {
    const nearestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
    const nearestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));
    const gapX = ball.x - nearestX;
    const gapY = ball.y - nearestY;
    return gapX * gapX + gapY * gapY <= BALL_RADIUS * BALL_RADIUS;
}

/** paddleRect — the paddle as a rectangle, so the same test works on it. */
function paddleRect(state) {
    return { x: state.paddleX, y: PADDLE_Y, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
}

/** createBricks — a full wall of bricks, all unbroken. */
function createBricks() {
    const bricks = [];
    for (let i = 0; i < BRICK_COLUMNS * BRICK_ROWS; i++) {
        bricks.push(true);
    }
    return bricks;
}

/** createGame — start a brand-new game. */
function createGame() {
    return {
        bricks: createBricks(),
        paddleX: (FIELD_WIDTH - PADDLE_WIDTH) / 2,
        ball: { x: FIELD_WIDTH / 2, y: PADDLE_Y - 40, dx: 150, dy: -230 },
        steering: 0,
        lives: START_LIVES,
        score: 0,
        level: 1,
        isOver: false,
        isWon: false,
        isPaused: true
    };
}

/**
 * movePaddle — slide the paddle sideways.
 *
 * INPUT:  state — the game. seconds — how long this frame took.
 * OUTPUT: nothing; it changes state.paddleX
 *
 * ALGORITHM: move by steering × PADDLE_SPEED × seconds, then keep the paddle
 *            on the field by clamping it between 0 and the right-hand edge.
 */
function movePaddle(state, seconds) {
    let x = state.paddleX + state.steering * PADDLE_SPEED * seconds;
    x = Math.max(0, Math.min(FIELD_WIDTH - PADDLE_WIDTH, x));
    state.paddleX = x;
}

/**
 * bounceOffWalls — keep the ball inside the box.
 *
 * INPUT:  ball — { x, y, dx, dy }
 * OUTPUT: nothing; it changes the ball
 *
 * ALGORITHM: if the ball has reached the left or right wall, push it back to
 *            the edge and flip dx. Do the same with dy at the ceiling. The
 *            floor is NOT a wall — that is where you lose a life.
 */
function bounceOffWalls(ball) {
    if (ball.x < BALL_RADIUS) {
        ball.x = BALL_RADIUS;
        ball.dx = -ball.dx;
    }
    if (ball.x > FIELD_WIDTH - BALL_RADIUS) {
        ball.x = FIELD_WIDTH - BALL_RADIUS;
        ball.dx = -ball.dx;
    }
    if (ball.y < BALL_RADIUS) {
        ball.y = BALL_RADIUS;
        ball.dy = -ball.dy;
    }
}

/**
 * bounceOffPaddle — bat the ball back into play.
 *
 * INPUT:  state — the game
 * OUTPUT: true if the paddle hit the ball
 *
 * ALGORITHM: only when the ball is falling (dy > 0) and touching the paddle.
 *            Send it back up, and steer it by WHERE it hit: the middle sends
 *            it straight up, the edges send it off at an angle. That is what
 *            gives the player control instead of a game of luck.
 */
function bounceOffPaddle(state) {
    if (state.ball.dy <= 0 || !hitsRect(state.ball, paddleRect(state))) {
        return false;
    }
    const middle = state.paddleX + PADDLE_WIDTH / 2;
    const offset = (state.ball.x - middle) / (PADDLE_WIDTH / 2);
    state.ball.dy = -Math.abs(state.ball.dy);
    state.ball.dx = offset * 240;
    state.ball.y = PADDLE_Y - BALL_RADIUS;
    return true;
}

/**
 * breakBricks — knock out the brick the ball is touching.
 *
 * INPUT:  state — the game
 * OUTPUT: true if a brick was broken
 *
 * ALGORITHM: look at every brick that is still there; the first one the ball
 *            touches is removed, the ball bounces back the way it came, and
 *            the score goes up. Stop after one brick — a ball should not
 *            tunnel through a whole row in a single frame.
 */
function breakBricks(state) {
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let column = 0; column < BRICK_COLUMNS; column++) {
            const index = brickIndex(column, row);
            if (state.bricks[index] && hitsRect(state.ball, brickRect(column, row))) {
                state.bricks[index] = false;
                state.ball.dy = -state.ball.dy;
                state.score = state.score + scoreForBrick(row);
                if (bricksLeft(state) === 0) {
                    state.isWon = true;
                    state.isOver = true;
                }
                return true;
            }
        }
    }
    return false;
}

/**
 * scoreForBrick — how many points is one brick worth?
 * INPUT: row — 0 is the top row. OUTPUT: points.
 * ALGORITHM: the higher the row, the more it is worth: 50 down to 10.
 */
function scoreForBrick(row) {
    return (BRICK_ROWS - row) * 10;
}

/** bricksLeft — how many bricks are still standing? */
function bricksLeft(state) {
    let count = 0;
    for (let i = 0; i < state.bricks.length; i++) {
        if (state.bricks[i]) { count = count + 1; }
    }
    return count;
}

/** resetBall — put the ball back above the paddle after losing a life. */
function resetBall(state) {
    state.ball = { x: FIELD_WIDTH / 2, y: PADDLE_Y - 40, dx: 150, dy: -230 };
    state.isPaused = true;
}

/**
 * updateGame — one frame of the game.
 *
 * INPUT:  state, elapsedMs
 * OUTPUT: nothing
 *
 * ALGORITHM: move the paddle, move the ball, bounce it off the walls, the
 *            paddle and the bricks, and take a life if it falls off the
 *            bottom. Losing the last life ends the game.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }
    const seconds = elapsedMs / 1000;

    movePaddle(state, seconds);

    state.ball.x = state.ball.x + state.ball.dx * seconds;
    state.ball.y = state.ball.y + state.ball.dy * seconds;

    bounceOffWalls(state.ball);
    bounceOffPaddle(state);
    breakBricks(state);

    if (state.ball.y > FIELD_HEIGHT + BALL_RADIUS) {
        state.lives = state.lives - 1;
        if (state.lives <= 0) {
            state.lives = 0;
            state.isOver = true;
        } else {
            resetBall(state);
        }
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
    if (k === ' ' || k === 'spacebar' || k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
