/* ============================================================
   race-game.js — the rules of the race

   Everything the game remembers lives in one object called the "state":

       {
         player:      the player's car (a rectangle)
         cars:        an array of the traffic cars
         steering:    -1 (going left), 0 (straight) or 1 (going right)
         boost:       1 normally, more while accelerating, less while braking
         distance:    how far the player has driven, in pixels
         passed:      how many cars have been overtaken
         score:       points
         level:       goes up every 5 cars passed; makes the road faster
         sinceSpawn:  pixels driven since the last car appeared
         stripeOffset: how far the road markings have scrolled
         isOver:      true after a crash
         isPaused:    true while the game is frozen
       }

   These functions change that state. They never draw and never read keys.
   ============================================================ */

/** How long the dashes in the road markings are, plus their gap. */
const STRIPE_PERIOD = 60;

/**
 * createPlayerCar — the car you drive, in the middle lane.
 *
 * INPUT:  none
 * OUTPUT: a car rectangle at the bottom of the middle lane
 *
 * ALGORITHM: build a car in lane 1 at PLAYER_Y, the fixed height where the
 *            player's car always sits.
 */
function createPlayerCar() {
    return createCar(1, PLAYER_Y);
}

/**
 * createGame — start a brand-new race.
 *
 * INPUT:  none
 * OUTPUT: a fresh state with your car on an empty road
 *
 * ALGORITHM: build the state object with its starting values. The road starts
 *            empty; the first traffic car arrives after a short distance.
 */
function createGame() {
    return {
        player: createPlayerCar(),
        cars: [],
        steering: 0,
        boost: 1,
        distance: 0,
        passed: 0,
        score: 0,
        level: 1,
        sinceSpawn: 0,
        stripeOffset: 0,
        isOver: false,
        isPaused: false
    };
}

/**
 * steerPlayer — slide the player's car sideways.
 *
 * INPUT:  state — the game state. seconds — how much time has passed.
 * OUTPUT: nothing; it moves state.player
 *
 * ALGORITHM:
 *   1. Work out how far to move: steering × STEER_SPEED × seconds.
 *      (steering is -1, 0 or +1, so this is 0 when nobody is steering.)
 *   2. Add that to the car's x.
 *   3. Use clamp to keep x between PLAYER_MIN_X and PLAYER_MAX_X, so the car
 *      can never drive onto the black verge.
 */
function steerPlayer(state, seconds) {
    const moved = state.player.x + state.steering * STEER_SPEED * seconds;
    state.player.x = clamp(moved, PLAYER_MIN_X, PLAYER_MAX_X);
}

/**
 * moveCars — slide every traffic car down the road.
 *
 * INPUT:  cars — an array of cars. distance — how many pixels to move them.
 * OUTPUT: a NEW array of cars, each one further down the road
 *
 * ALGORITHM:
 *   1. Start an empty array.
 *   2. For every car, push a new car with the same x, width, height and lane,
 *      but with y + distance.
 *   3. Return the new array.
 *
 * The traffic does not really move towards you — you drive into it. Adding to
 * y moves a car DOWN the screen, which looks like the road rushing past.
 */
function moveCars(cars, distance) {
    const moved = [];
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        moved.push({
            x: car.x,
            y: car.y + distance,
            width: car.width,
            height: car.height,
            lane: car.lane
        });
    }
    return moved;
}

/**
 * keepCarsOnScreen — throw away the cars that have driven off the bottom.
 *
 * INPUT:  cars — an array of cars
 * OUTPUT: a NEW array holding only the cars still on the road
 *
 * ALGORITHM:
 *   1. Start an empty array.
 *   2. For every car, if isOnScreen says it is still visible, keep it.
 *   3. Return the kept cars.
 *
 * WHY: without this the list would grow for ever, and the game would get
 *      slower and slower while checking cars nobody can see.
 */
function keepCarsOnScreen(cars) {
    const kept = [];
    for (let i = 0; i < cars.length; i++) {
        if (isOnScreen(cars[i])) {
            kept.push(cars[i]);
        }
    }
    return kept;
}

/**
 * spawnCar — send a new car onto the road, just above the top edge.
 *
 * INPUT:  state — the game state
 * OUTPUT: nothing; it adds one car to state.cars
 *
 * ALGORITHM:
 *   1. Build a list of the lanes we are allowed to use: every lane, except
 *      the one the last car was sent down.
 *   2. Pick one of those lanes at random.
 *   3. Add a car in that lane at y = -CAR_HEIGHT, which is just off the top of
 *      the screen, so it slides into view.
 *
 * WHY SKIP THE LAST LANE: two cars nose-to-tail in the same lane are no fun to
 * dodge, and it means there is always a way through.
 */
function spawnCar(state) {
    const choices = [];
    const lastCar = state.cars.length > 0 ? state.cars[state.cars.length - 1] : null;

    for (let lane = 0; lane < LANE_COUNT; lane++) {
        if (lastCar === null || lane !== lastCar.lane) {
            choices.push(lane);
        }
    }

    const lane = choices[Math.floor(Math.random() * choices.length)];
    state.cars.push(createCar(lane, -CAR_HEIGHT));
}

/**
 * hasCrashed — has the player hit anything?
 *
 * INPUT:  state — the game state
 * OUTPUT: true if the player's car overlaps any traffic car
 *
 * ALGORITHM:
 *   Look at every traffic car; if overlaps(state.player, car) says yes for any
 *   of them, answer true straight away. If none of them touch, answer false.
 */
function hasCrashed(state) {
    for (let i = 0; i < state.cars.length; i++) {
        if (overlaps(state.player, state.cars[i])) {
            return true;
        }
    }
    return false;
}

/**
 * scoreForPass — how many points is overtaking one car worth?
 *
 * INPUT:  level — the level the player is on
 * OUTPUT: the points to add
 *
 * ALGORITHM: 10 points, multiplied by the level.
 */
function scoreForPass(level) {
    return 10 * level;
}

/**
 * levelForPassed — which level has this many overtakes earned?
 *
 * INPUT:  passed — how many cars have been overtaken in the whole race
 * OUTPUT: the level number, starting at 1
 *
 * ALGORITHM: level = (passed / 5, rounded down) + 1.
 */
function levelForPassed(passed) {
    return Math.floor(passed / 5) + 1;
}

/**
 * speedForLevel — how fast does the road rush past?
 *
 * INPUT:  level — the level number (1, 2, 3, …)
 * OUTPUT: the speed in pixels per second
 *
 * ALGORITHM: start at 180 and add 35 for every level above 1, but never go
 *            faster than 520.
 *            Level 1 = 180, level 5 = 320, level 11 or more = 520.
 */
function speedForLevel(level) {
    const speed = 180 + (level - 1) * 35;
    if (speed > 520) {
        return 520;
    }
    return speed;
}

/**
 * secondsBetweenCars — how much thinking time the driver gets.
 *
 * INPUT:  level — the level number
 * OUTPUT: the seconds between one car arriving and the next
 *
 * ALGORITHM: 1.6 seconds on level 1, a tenth of a second less each level,
 *            but never less than 0.8 seconds.
 *
 * WHY THE FLOOR: swerving from one lane to the next takes LANE_WIDTH divided
 * by STEER_SPEED — about 0.3 seconds. If cars arrived faster than that, a
 * driver could be trapped with nowhere to go and no time to get there, and a
 * game you cannot possibly survive is not a game. 0.8 seconds always leaves
 * room to dodge — but at 520 pixels a second you will barely see it coming.
 */
function secondsBetweenCars(level) {
    const seconds = 1.6 - (level - 1) * 0.1;
    if (seconds < 0.8) {
        return 0.8;
    }
    return seconds;
}

/**
 * spawnGapForLevel — how far apart the traffic cars are, in pixels.
 *
 * INPUT:  level — the level number
 * OUTPUT: the distance to drive before the next car appears
 *
 * ALGORITHM: take the thinking time for this level and turn it into a
 *            distance by multiplying by this level's speed.
 *            distance = speed x time — the same sum you use for car journeys.
 */
function spawnGapForLevel(level) {
    return speedForLevel(level) * secondsBetweenCars(level);
}

/**
 * updateRace — one frame of the race. This is the heart of the game.
 *
 * INPUT:  state — the game state. elapsedMs — milliseconds since the last frame.
 * OUTPUT: nothing; it changes the state
 *
 * ALGORITHM:
 *   1. If the game is over or paused, do nothing.
 *   2. Turn the milliseconds into seconds (divide by 1000) and work out how far
 *      the road moves this frame: speedForLevel(level) × boost × seconds.
 *   3. Steer the player.
 *   4. Move every traffic car down by that distance.
 *   5. Throw away the cars that have gone off the bottom — each one of those is
 *      a car you have overtaken, so count it, score it and work out the level.
 *   6. Add the distance to the total, and scroll the road markings.
 *   7. Add the distance to sinceSpawn; once that reaches the level's gap, send
 *      a new car and reset it to 0.
 *   8. Finally, if hasCrashed says the player hit something, the race is over.
 */
function updateRace(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }

    const seconds = elapsedMs / 1000;
    const travelled = speedForLevel(state.level) * state.boost * seconds;

    steerPlayer(state, seconds);
    state.cars = moveCars(state.cars, travelled);

    const before = state.cars.length;
    state.cars = keepCarsOnScreen(state.cars);
    const overtaken = before - state.cars.length;
    if (overtaken > 0) {
        state.passed = state.passed + overtaken;
        state.score = state.score + scoreForPass(state.level) * overtaken;
        state.level = levelForPassed(state.passed);
    }

    state.distance = state.distance + travelled;
    state.stripeOffset = (state.stripeOffset + travelled) % STRIPE_PERIOD;

    state.sinceSpawn = state.sinceSpawn + travelled;
    if (state.sinceSpawn >= spawnGapForLevel(state.level)) {
        spawnCar(state);
        state.sinceSpawn = 0;
    }

    if (hasCrashed(state)) {
        state.isOver = true;
    }
}

/**
 * togglePause — freeze or unfreeze the race.
 * INPUT: state. OUTPUT: nothing.
 * ALGORITHM: flip isPaused — but never unpause a race that has already ended.
 */
function togglePause(state) {
    if (state.isOver) {
        return;
    }
    state.isPaused = !state.isPaused;
}

/**
 * metresDriven — the distance, in something friendlier than pixels.
 *
 * INPUT:  state — the game state
 * OUTPUT: a whole number of "metres"
 *
 * ALGORITHM: ten pixels make one metre, so divide by 10 and round down.
 */
function metresDriven(state) {
    return Math.floor(state.distance / 10);
}
