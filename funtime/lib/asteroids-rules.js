/* ============================================================
   asteroids-rules.js — the rules of Asteroids

   A ship drifting in space. Turn it, push it, shoot the rocks — and every
   rock you hit breaks into smaller, faster ones.

   Two ideas run through this whole file:
     • ANGLES. The ship points somewhere, and turning that direction into an
       actual x and y is what cos and sin are for.
     • WRAPPING. Space has no walls. Fly off one edge and you come back on
       the other, which makes the field a loop in both directions.
   ============================================================ */

const FIELD_WIDTH = 340;
const FIELD_HEIGHT = 340;

const SHIP_RADIUS = 9;
const TURN_SPEED = 3.6;         /* radians per second */
const THRUST = 190;             /* pixels per second, per second */
const MAX_SPEED = 260;
const DRIFT_SLOWDOWN = 0.4;     /* space is not quite empty, to keep it playable */

const BULLET_SPEED = 320;
const BULLET_LIFE = 1.1;        /* seconds before a shot fizzles out */
const MAX_BULLETS = 4;

const ROCK_CORNERS = 9;         /* how many corners a rock's outline has */
const BIG_ROCK = 3;
const ROCK_RADIUS = { 3: 26, 2: 16, 1: 9 };
const ROCK_SCORE = { 3: 20, 2: 50, 1: 100 };
const ROCK_SPEED = { 3: 34, 2: 52, 1: 74 };

const START_LIVES = 3;
const SHIELD_SECONDS = 2;

/**
 * pointFrom — where do you end up going a certain way for a certain distance?
 *
 * INPUT:  x, y — where you start. angle — which way, in radians.
 *         distance — how far.
 * OUTPUT: { x, y } — where you end up
 *
 * ALGORITHM: this is the one piece of trigonometry the whole game needs.
 *            cos(angle) is how much of the direction is sideways, and
 *            sin(angle) is how much is up and down. Multiply each by the
 *            distance and add them on.
 *
 *            Angle 0 points RIGHT. A quarter turn (about 1.57) points DOWN,
 *            because y grows downwards on a canvas.
 */
function pointFrom(x, y, angle, distance) {
    return {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance
    };
}

/**
 * wrapPosition — space has no edges.
 *
 * INPUT:  thing — anything with an x and a y
 * OUTPUT: nothing; it changes the thing
 *
 * ALGORITHM: off the left, come back on the right; off the top, come back at
 *            the bottom. Doing it with `while` rather than `if` means it
 *            still works for something that has jumped a long way in one go.
 */
function wrapPosition(thing) {
    while (thing.x < 0) { thing.x = thing.x + FIELD_WIDTH; }
    while (thing.x >= FIELD_WIDTH) { thing.x = thing.x - FIELD_WIDTH; }
    while (thing.y < 0) { thing.y = thing.y + FIELD_HEIGHT; }
    while (thing.y >= FIELD_HEIGHT) { thing.y = thing.y - FIELD_HEIGHT; }
}

/**
 * distanceBetween — how far apart are two things?
 * INPUT: a, b — each with an x and a y. OUTPUT: the distance in pixels.
 * ALGORITHM: Pythagoras. The sides of the triangle are the differences in x
 *            and in y, and the distance is the long side.
 */
function distanceBetween(a, b) {
    const acrossBy = a.x - b.x;
    const downBy = a.y - b.y;
    return Math.sqrt(acrossBy * acrossBy + downBy * downBy);
}

/**
 * touches — are two round things overlapping?
 * INPUT: a, b — positions. radiusA, radiusB — their sizes.
 * ALGORITHM: circles touch when they are closer than their radii added up.
 *            Much simpler than rectangles, which is why space games use it.
 */
function touches(a, b, radiusA, radiusB) {
    return distanceBetween(a, b) < radiusA + radiusB;
}

/**
 * speedOf — how fast is this thing going, in total?
 *
 * INPUT:  thing — anything with a dx and a dy
 * OUTPUT: its speed in pixels per second
 *
 * ALGORITHM: Pythagoras again. dx and dy are the two short sides of a right
 *            triangle and the speed is the long one — exactly the same sum as
 *            distanceBetween, asked about a SPEED rather than a place.
 */
function speedOf(thing) {
    return Math.sqrt(thing.dx * thing.dx + thing.dy * thing.dy);
}

/**
 * clampSpeed — put a ceiling on how fast something may travel.
 *
 * INPUT:  thing — with dx and dy. limit — the fastest it may go.
 * OUTPUT: true if it had to be slowed down
 *
 * ALGORITHM: work out the speed. If it is over the limit, scale BOTH dx and
 *            dy by the same fraction — limit ÷ speed. Scaling both by the
 *            same amount is what keeps the direction unchanged; the ship
 *            slows down without being nudged off course.
 */
function clampSpeed(thing, limit) {
    const speed = speedOf(thing);
    if (speed <= limit) {
        return false;
    }
    thing.dx = thing.dx / speed * limit;
    thing.dy = thing.dy / speed * limit;
    return true;
}

/**
 * turnShip — swing the nose round.
 *
 * INPUT:  ship. turning — -1, 0 or 1. seconds.
 * OUTPUT: nothing; it changes ship.angle
 *
 * ALGORITHM: add turning × TURN_SPEED × seconds, then fold the answer back
 *            into the range -π to π.
 *
 * WHY fold it: spin one way for five minutes and the angle would climb into
 *      the thousands. cos and sin would still work, but every number you
 *      printed would be nonsense and comparing two angles would get hard. The
 *      double % is the usual trick — the first can give a negative answer, so
 *      the second one straightens it out.
 */
function turnShip(ship, turning, seconds) {
    const whole = Math.PI * 2;
    let angle = ship.angle + turning * TURN_SPEED * seconds;
    angle = ((angle + Math.PI) % whole + whole) % whole - Math.PI;
    ship.angle = angle;
}

/**
 * thrustShip — push the ship along the way it is pointing.
 *
 * INPUT:  ship. seconds — how long this frame took.
 * OUTPUT: nothing; it changes the ship's speed
 *
 * ALGORITHM: the engine does not move the ship — it changes the ship's SPEED,
 *            the way gravity did in Flappy. Add cos and sin of the angle,
 *            each times THRUST times seconds. Then cap the total speed, or a
 *            player who holds the key down flies off at a silly rate.
 *
 * WHY it feels the way it does: the ship keeps its old speed too. Turn round
 *      and thrust and you do not stop — you slow down, then go the other way.
 *      That is what makes Asteroids feel like Asteroids.
 */
function thrustShip(ship, seconds) {
    ship.dx = ship.dx + Math.cos(ship.angle) * THRUST * seconds;
    ship.dy = ship.dy + Math.sin(ship.angle) * THRUST * seconds;
    clampSpeed(ship, MAX_SPEED);
}

/**
 * driftShip — space is not quite empty.
 *
 * INPUT:  ship, seconds
 * OUTPUT: nothing; it slows the ship a little
 *
 * ALGORITHM: multiply the speed by a shade less than 1. Note it is
 *            (1 - rate × seconds) rather than a flat 0.99: tie it to the time
 *            and the ship drifts the same on a fast computer and a slow one.
 *
 * Real space would not do this. The game does, because a ship that never
 *            slows down is exhausting to fly.
 */
function driftShip(ship, seconds) {
    const slow = 1 - DRIFT_SLOWDOWN * seconds;
    ship.dx = ship.dx * slow;
    ship.dy = ship.dy * slow;
}

/**
 * fireBullet — shoot from the nose of the ship.
 *
 * INPUT:  state
 * OUTPUT: true if a shot was fired
 *
 * ALGORITHM: the shot starts at the nose, not the middle, or you would shoot
 *            yourself. It travels at BULLET_SPEED in the direction the ship
 *            is pointing — PLUS the ship's own speed, so a shot fired while
 *            flying forwards really does go faster.
 */
function makeBullet(ship) {
    const nose = pointFrom(ship.x, ship.y, ship.angle, SHIP_RADIUS + 3);
    const flight = pointFrom(0, 0, ship.angle, BULLET_SPEED);

    return {
        x: nose.x,
        y: nose.y,
        dx: flight.x + ship.dx,
        dy: flight.y + ship.dy,
        life: BULLET_LIFE
    };
}

/**
 * fireBullet — shoot, if the rules allow it.
 *
 * INPUT:  state
 * OUTPUT: true if a shot was fired
 *
 * ALGORITHM: three reasons to refuse — the game is over, it is paused, or
 *            there are already MAX_BULLETS in the air. Otherwise make one and
 *            add it to the list.
 */
function fireBullet(state) {
    if (state.isOver || state.isPaused || state.bullets.length >= MAX_BULLETS) {
        return false;
    }
    state.bullets.push(makeBullet(state.ship));
    state.shots = state.shots + 1;
    return true;
}

/**
 * ageBullets — a shot does not fly for ever.
 *
 * INPUT:  bullets — the list. seconds.
 * OUTPUT: a NEW list, holding only the ones still alive
 *
 * ALGORITHM: take the time off every bullet's life, and keep the ones with
 *            anything left. Without this the screen slowly fills with old
 *            shots and you could clear a wave without aiming.
 */
function ageBullets(bullets, seconds) {
    const flying = [];
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].life = bullets[i].life - seconds;
        if (bullets[i].life > 0) {
            flying.push(bullets[i]);
        }
    }
    return flying;
}

/**
 * makeRock — one rock of a given size, drifting in a random direction.
 * INPUT: x, y, size — 3 big, 2 medium, 1 small. OUTPUT: the rock.
 */
function makeRock(x, y, size) {
    const angle = Math.random() * Math.PI * 2;
    const drift = pointFrom(0, 0, angle, ROCK_SPEED[size]);
    return {
        x: x, y: y, size: size,
        dx: drift.x, dy: drift.y,
        spin: (Math.random() - 0.5) * 2,
        wobble: Math.floor(Math.random() * 1000)
    };
}

/**
 * rockPoints — the corners of one rock's outline.
 *
 * INPUT:  rock
 * OUTPUT: a list of ROCK_CORNERS points, all the way round
 *
 * ALGORITHM: walk right round the circle in equal steps. At each step push
 *            the corner in or out a little, so the rock is lumpy rather than
 *            a perfect circle. The wobble number decides how — so every rock
 *            has its own shape, and always the same one.
 *
 * This is the drawing turned into DATA. The picture is then just "join these
 * points up", which is a great deal easier to test than a drawing.
 */
function rockPoints(rock) {
    const radius = ROCK_RADIUS[rock.size];
    const points = [];

    for (let i = 0; i < ROCK_CORNERS; i++) {
        const angle = i / ROCK_CORNERS * Math.PI * 2 + rock.wobble;
        const lumpy = radius * (0.78 + 0.22 * Math.abs(Math.sin(i * 2.3 + rock.wobble)));
        points.push(pointFrom(rock.x, rock.y, angle, lumpy));
    }
    return points;
}

/**
 * splitRock — what a rock leaves behind when it is shot.
 *
 * INPUT:  rock
 * OUTPUT: a list of the smaller rocks — empty if it was already the smallest
 *
 * ALGORITHM: a big rock becomes TWO of the next size down, in the same place
 *            but drifting their own ways. The smallest size leaves nothing.
 *
 * WHY it matters: shooting a big rock makes the screen busier, not emptier.
 *      That is the whole shape of the game — it gets harder as you win.
 */
function splitRock(rock) {
    if (rock.size <= 1) {
        return [];
    }
    return [
        makeRock(rock.x, rock.y, rock.size - 1),
        makeRock(rock.x, rock.y, rock.size - 1)
    ];
}

/**
 * hitRocks — check every shot against every rock.
 *
 * INPUT:  state
 * OUTPUT: how many rocks were hit this frame
 *
 * ALGORITHM: for each bullet, find the first rock it touches. That rock is
 *            replaced by whatever it splits into, the bullet is used up, and
 *            the score goes up — smaller rocks are worth MORE, because they
 *            are harder to hit.
 */
function hitRocks(state) {
    const survivingBullets = [];
    let hits = 0;

    for (let b = 0; b < state.bullets.length; b++) {
        const bullet = state.bullets[b];
        let hitIndex = -1;

        for (let r = 0; r < state.rocks.length; r++) {
            if (touches(bullet, state.rocks[r], 1, ROCK_RADIUS[state.rocks[r].size])) {
                hitIndex = r;
                break;
            }
        }

        if (hitIndex === -1) {
            survivingBullets.push(bullet);
        } else {
            const rock = state.rocks[hitIndex];
            state.score = state.score + ROCK_SCORE[rock.size];
            state.rocks.splice(hitIndex, 1);
            state.rocks = state.rocks.concat(splitRock(rock));
            hits = hits + 1;
        }
    }

    state.bullets = survivingBullets;
    return hits;
}

/** shipIsHit — has a rock caught the ship? */
function shipIsHit(state) {
    if (state.shield > 0) {
        return false;
    }
    for (let i = 0; i < state.rocks.length; i++) {
        if (touches(state.ship, state.rocks[i], SHIP_RADIUS, ROCK_RADIUS[state.rocks[i].size])) {
            return true;
        }
    }
    return false;
}

/** startWave — a ring of big rocks around the edge, away from the ship. */
function startWave(state) {
    state.rocks = [];
    const count = 3 + state.wave;
    for (let i = 0; i < count; i++) {
        const angle = i / count * Math.PI * 2;
        const spot = pointFrom(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, angle, 130);
        state.rocks.push(makeRock(spot.x, spot.y, BIG_ROCK));
    }
    state.bullets = [];
}

/** resetShip — put the ship back in the middle, with a moment of shield. */
function resetShip(state) {
    state.ship = {
        x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2,
        angle: -Math.PI / 2, dx: 0, dy: 0
    };
    state.shield = SHIELD_SECONDS;
    state.turning = 0;
    state.thrusting = false;
}

/** createGame — start a brand-new game. */
function createGame() {
    const state = {
        ship: null, rocks: [], bullets: [],
        turning: 0, thrusting: false, shield: 0,
        lives: START_LIVES, score: 0, wave: 1, shots: 0,
        isOver: false, isPaused: false
    };
    resetShip(state);
    startWave(state);
    return state;
}

/** moveThing — carry something along by its own speed, and wrap it. */
function moveThing(thing, seconds) {
    thing.x = thing.x + thing.dx * seconds;
    thing.y = thing.y + thing.dy * seconds;
    wrapPosition(thing);
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

    turnShip(state.ship, state.turning, seconds);
    if (state.thrusting) {
        thrustShip(state.ship, seconds);
    } else {
        driftShip(state.ship, seconds);
    }
    moveThing(state.ship, seconds);

    for (let i = 0; i < state.rocks.length; i++) {
        moveThing(state.rocks[i], seconds);
        state.rocks[i].wobble = state.rocks[i].wobble + state.rocks[i].spin * seconds;
    }

    for (let i = 0; i < state.bullets.length; i++) {
        moveThing(state.bullets[i], seconds);
    }
    state.bullets = ageBullets(state.bullets, seconds);

    hitRocks(state);

    if (state.shield > 0) {
        state.shield = state.shield - seconds;
    } else if (shipIsHit(state)) {
        state.lives = state.lives - 1;
        if (state.lives <= 0) {
            state.lives = 0;
            state.isOver = true;
        } else {
            resetShip(state);
        }
        return;
    }

    if (state.rocks.length === 0) {
        state.wave = state.wave + 1;
        state.score = state.score + 100;
        startWave(state);
        state.shield = SHIELD_SECONDS;
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
    if (k === 'arrowup' || k === 'w') { return 'thrust'; }
    if (k === ' ' || k === 'spacebar') { return 'fire'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
