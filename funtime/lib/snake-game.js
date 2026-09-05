/* ============================================================
   snake-game.js — the rules of Snake

   Everything the game remembers lives in one object called the "state":

       {
         snake:     an array of positions. snake[0] is the HEAD.
         direction: the way the snake is travelling right now
         turns:     directions the player has asked for but not used yet
         food:      where the apple is (a position), or null
         score:     points
         eaten:     how many apples have been eaten
         level:     goes up every 5 apples; makes the snake faster
         stepTimer: milliseconds counted since the snake last moved
         isOver:    true once the snake crashes
         isWon:     true if the snake filled the whole grid (very hard!)
         isPaused:  true while the game is frozen
       }

   These functions change that state. They never draw and never read keys.
   ============================================================ */

/**
 * createStartingSnake — the three squares a new snake begins with.
 *
 * INPUT:  none
 * OUTPUT: an array of three positions in the middle of the grid, head first,
 *         lying flat so the snake can set off to the right
 *
 * ALGORITHM:
 *   1. Work out the middle column and the middle row.
 *   2. Return the head there, then two more squares to its LEFT — those are
 *      the body and the tail trailing behind it.
 */
function createStartingSnake() {
    const middleX = Math.floor(GRID_WIDTH / 2);
    const middleY = Math.floor(GRID_HEIGHT / 2);
    return [
        createPosition(middleX, middleY),
        createPosition(middleX - 1, middleY),
        createPosition(middleX - 2, middleY)
    ];
}

/**
 * createGame — start a brand-new game.
 *
 * INPUT:  none
 * OUTPUT: a fresh state, with the snake in the middle and the first apple placed
 *
 * ALGORITHM: build the state object with its starting values, then drop an
 *            apple on a random free square.
 */
function createGame() {
    const state = {
        snake: createStartingSnake(),
        direction: DIRECTIONS.right,
        turns: [],
        food: null,
        score: 0,
        eaten: 0,
        level: 1,
        stepTimer: 0,
        isOver: false,
        isWon: false,
        isPaused: false
    };
    state.food = randomEmptyCell(state.snake);
    return state;
}

/**
 * moveSnake — slide the snake one square forward.
 *
 * INPUT:  snake   — the array of positions
 *         newHead — where the head is going
 *         grow    — true if the snake just ate and should get longer
 * OUTPUT: a NEW array of positions
 *
 * ALGORITHM:
 *   1. Start a new array with newHead at the front.
 *   2. Add every square of the old snake after it.
 *   3. If the snake is NOT growing, remove the last square (the tail).
 *   4. Return the new array.
 *
 * That is the whole trick of Snake: a step is "add a head, drop a tail", and
 * eating is simply "add a head and keep the tail".
 */
function moveSnake(snake, newHead, grow) {
    const moved = [newHead];
    for (let i = 0; i < snake.length; i++) {
        moved.push(snake[i]);
    }
    if (!grow) {
        moved.pop();
    }
    return moved;
}

/**
 * turnSnake — remember that the player wants to turn.
 *
 * INPUT:  state — the game state. direction — one of the DIRECTIONS.
 * OUTPUT: true if the turn was accepted, false if it was refused
 *
 * ALGORITHM:
 *   1. Work out the direction the snake will be facing when this turn happens:
 *      the last one already waiting, or the current one if none are waiting.
 *   2. Refuse a turn that is the same as that one (it would do nothing) or the
 *      exact opposite (the snake would eat its own neck).
 *   3. Never remember more than two turns.
 *   4. Otherwise add it to the queue.
 *
 * WHY A QUEUE: a good player taps "up" then "left" faster than the snake
 *              moves. Without a queue, the second tap would replace the first
 *              and the snake would miss the corner.
 */
function turnSnake(state, direction) {
    const facing = state.turns.length > 0 ? state.turns[state.turns.length - 1] : state.direction;

    if (samePosition(direction, facing) || isOppositeDirection(direction, facing)) {
        return false;
    }
    if (state.turns.length >= 2) {
        return false;
    }
    state.turns.push(direction);
    return true;
}

/**
 * scoreForFood — how many points is one apple worth?
 *
 * INPUT:  level — the level the player is on
 * OUTPUT: the points to add
 *
 * ALGORITHM: 10 points, multiplied by the level. Apples are worth more when
 *            the snake is moving fast, because they are harder to catch.
 */
function scoreForFood(level) {
    return 10 * level;
}

/**
 * levelForFood — which level does this many apples earn?
 *
 * INPUT:  eaten — how many apples have been eaten in the whole game
 * OUTPUT: the level number, starting at 1
 *
 * ALGORITHM: level = (eaten / 5, rounded down) + 1.
 *            So 0-4 apples is level 1, 5-9 is level 2, and so on.
 */
function levelForFood(eaten) {
    return Math.floor(eaten / 5) + 1;
}

/**
 * stepIntervalForLevel — how long between steps?
 *
 * INPUT:  level — the level number (1, 2, 3, …)
 * OUTPUT: milliseconds to wait before the snake moves again
 *
 * ALGORITHM: start at 200 ms and take 15 ms off for every level above 1, but
 *            never go faster than 70 ms.
 *            Level 1 = 200 ms, level 5 = 140 ms, level 10 or more = 70 ms.
 */
function stepIntervalForLevel(level) {
    const interval = 200 - (level - 1) * 15;
    if (interval < 70) {
        return 70;
    }
    return interval;
}

/**
 * stepGame — move the snake one square. This is the heart of the game.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing; it changes the state
 *
 * ALGORITHM:
 *   1. If the game is over or paused, do nothing.
 *   2. If the player has a turn waiting, take it and face that way.
 *   3. Work out the new head square: one step from the old head.
 *   4. The snake dies if the new head is off the grid, or lands on its own
 *      body. (The very last segment does not count — it is about to move out
 *      of the way this turn.)
 *   5. Eating happens when the new head is exactly on the apple.
 *   6. Move the snake, growing only if it ate.
 *   7. If it ate: count the apple, add the points, work out the new level, and
 *      put a new apple on a free square. No free squares means the player has
 *      filled the board and WON.
 */
function stepGame(state) {
    if (state.isOver || state.isPaused) {
        return;
    }

    if (state.turns.length > 0) {
        state.direction = state.turns.shift();
    }

    const head = addDirection(state.snake[0], state.direction);
    const bodyThatStays = state.snake.slice(0, state.snake.length - 1);

    if (!isInsideGrid(head) || containsPosition(bodyThatStays, head)) {
        state.isOver = true;
        return;
    }

    const eating = state.food !== null && samePosition(head, state.food);
    state.snake = moveSnake(state.snake, head, eating);

    if (eating) {
        state.eaten = state.eaten + 1;
        state.score = state.score + scoreForFood(state.level);
        state.level = levelForFood(state.eaten);
        state.food = randomEmptyCell(state.snake);
        if (state.food === null) {
            state.isWon = true;
            state.isOver = true;
        }
    }
}

/**
 * updateGame — let time pass (called about 60 times a second).
 *
 * INPUT:  state — the game state. elapsedMs — milliseconds since the last call.
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. If the game is over or paused, do nothing.
 *   2. Add elapsedMs to the step timer.
 *   3. While the timer is bigger than this level's waiting time, take that
 *      much off the timer and move the snake one square.
 *
 * This is what makes the snake crawl on its own, faster on higher levels.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }

    const interval = stepIntervalForLevel(state.level);
    state.stepTimer = state.stepTimer + elapsedMs;

    while (state.stepTimer >= interval) {
        state.stepTimer = state.stepTimer - interval;
        stepGame(state);
        if (state.isOver) {
            return;
        }
    }
}

/**
 * togglePause — freeze or unfreeze the game.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing
 *
 * ALGORITHM: flip isPaused — but never unpause a game that has already ended.
 */
function togglePause(state) {
    if (state.isOver) {
        return;
    }
    state.isPaused = !state.isPaused;
}

/**
 * snakeLength — how long is the snake?
 *
 * INPUT:  state — the game state
 * OUTPUT: the number of squares the snake fills
 *
 * ALGORITHM: that is just how many positions are in the array.
 */
function snakeLength(state) {
    return state.snake.length;
}
