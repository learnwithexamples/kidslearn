/* ============================================================
   invaders-rules.js — the rules of Space Invaders

   A fleet of aliens marches side to side, dropping a row every time it
   touches an edge. You slide along the bottom and shoot upwards.

   The clever old trick in this game: the aliens do not each have their own
   position. The whole FLEET has one position, and each alien's place is
   worked out from its column and row. Move one number and all 24 move.
   ============================================================ */

const FIELD_WIDTH = 320;
const FIELD_HEIGHT = 400;

const ALIEN_COLUMNS = 6;
const ALIEN_ROWS = 4;
const ALIEN_WIDTH = 24;
const ALIEN_HEIGHT = 18;
const ALIEN_GAP_X = 14;
const ALIEN_GAP_Y = 12;
const FLEET_WIDTH = ALIEN_COLUMNS * (ALIEN_WIDTH + ALIEN_GAP_X) - ALIEN_GAP_X;
const FLEET_DROP = 16;

const SHIP_WIDTH = 30;
const SHIP_HEIGHT = 14;
const SHIP_Y = FIELD_HEIGHT - 28;
const SHIP_SPEED = 260;

const BULLET_WIDTH = 3;
const BULLET_HEIGHT = 11;
const BULLET_SPEED = 430;
const BOMB_SPEED = 190;

const START_LIVES = 3;

/**
 * alienIndex — turn a column and row into a place in the list.
 * INPUT: column, row. OUTPUT: the position in the flat list of aliens.
 */
function alienIndex(column, row) {
    return row * ALIEN_COLUMNS + column;
}

/**
 * alienRect — where one alien is right now.
 *
 * INPUT:  alien — { column, row }. state — the game (for the fleet position).
 * OUTPUT: { x, y, width, height }
 *
 * ALGORITHM: start at the fleet's own x and y, then step across one alien
 *            plus one gap for every column, and down for every row.
 */
function alienRect(alien, state) {
    return {
        x: state.fleetX + alien.column * (ALIEN_WIDTH + ALIEN_GAP_X),
        y: state.fleetY + alien.row * (ALIEN_HEIGHT + ALIEN_GAP_Y),
        width: ALIEN_WIDTH,
        height: ALIEN_HEIGHT
    };
}

/** shipRect — the player's ship as a rectangle. */
function shipRect(state) {
    return { x: state.shipX, y: SHIP_Y, width: SHIP_WIDTH, height: SHIP_HEIGHT };
}

/** bulletRect — one shot as a rectangle. */
function bulletRect(bullet) {
    return { x: bullet.x, y: bullet.y, width: BULLET_WIDTH, height: BULLET_HEIGHT };
}

/** overlaps — do two rectangles touch? */
function overlaps(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

/** makeAliens — a full fleet, all alive. */
function makeAliens() {
    const aliens = [];
    for (let row = 0; row < ALIEN_ROWS; row++) {
        for (let column = 0; column < ALIEN_COLUMNS; column++) {
            aliens.push({ column: column, row: row, alive: true });
        }
    }
    return aliens;
}

/** aliensLeft — how many are still alive? */
function aliensLeft(state) {
    let count = 0;
    for (let i = 0; i < state.aliens.length; i++) {
        if (state.aliens[i].alive) { count = count + 1; }
    }
    return count;
}

/**
 * fleetSpeed — how fast the aliens march.
 *
 * INPUT:  state
 * OUTPUT: pixels per second
 *
 * ALGORITHM: the fewer aliens are left, the faster they go — 22 to start,
 *            plus 5 for every alien shot down, plus 12 a wave. That is why
 *            the last one always seems to be sprinting.
 */
function fleetSpeed(state) {
    const shot = ALIEN_COLUMNS * ALIEN_ROWS - aliensLeft(state);
    const speed = 22 + shot * 5 + (state.wave - 1) * 12;
    return speed > 260 ? 260 : speed;
}

/**
 * fleetEdges — how far the living aliens reach, left and right.
 *
 * INPUT:  state
 * OUTPUT: { left, right } in pixels, or null if they are all gone
 *
 * ALGORITHM: dead aliens leave a hole, so the fleet must be measured by the
 *            ones still alive — otherwise an empty column would keep bouncing
 *            the fleet off the wall early.
 */
function fleetEdges(state) {
    let left = null;
    let right = null;
    for (let i = 0; i < state.aliens.length; i++) {
        const alien = state.aliens[i];
        if (!alien.alive) { continue; }
        const rect = alienRect(alien, state);
        if (left === null || rect.x < left) { left = rect.x; }
        if (right === null || rect.x + rect.width > right) { right = rect.x + rect.width; }
    }
    return left === null ? null : { left: left, right: right };
}

/**
 * moveFleet — march the aliens sideways, and down at the walls.
 *
 * INPUT:  state, seconds
 * OUTPUT: nothing
 *
 * ALGORITHM: slide the whole fleet by speed × direction × seconds. If the
 *            living aliens now stick out past either wall, turn round and
 *            drop a row. Dropping is what eventually ends the game.
 */
function moveFleet(state, seconds) {
    state.fleetX = state.fleetX + state.fleetDirection * fleetSpeed(state) * seconds;

    const edges = fleetEdges(state);
    if (edges === null) {
        return;
    }
    if (edges.right > FIELD_WIDTH - 6 && state.fleetDirection === 1) {
        state.fleetDirection = -1;
        state.fleetY = state.fleetY + FLEET_DROP;
    } else if (edges.left < 6 && state.fleetDirection === -1) {
        state.fleetDirection = 1;
        state.fleetY = state.fleetY + FLEET_DROP;
    }
}

/**
 * moveShip — slide the player's ship.
 * INPUT: state, seconds. OUTPUT: nothing.
 * ALGORITHM: speed × steering × time, then keep the whole ship on the field.
 */
function moveShip(state, seconds) {
    let x = state.shipX + state.steering * SHIP_SPEED * seconds;
    x = Math.max(0, Math.min(FIELD_WIDTH - SHIP_WIDTH, x));
    state.shipX = x;
}

/**
 * fireBullet — shoot, if you are allowed to.
 *
 * INPUT:  state
 * OUTPUT: true if a shot was fired
 *
 * ALGORITHM: only ONE of your bullets may be in the air at a time. That single
 *            rule is what makes the game about aiming instead of holding the
 *            button down.
 */
function fireBullet(state) {
    if (state.isOver || state.isPaused || state.bullets.length > 0) {
        return false;
    }
    state.bullets.push({
        x: state.shipX + SHIP_WIDTH / 2 - BULLET_WIDTH / 2,
        y: SHIP_Y - BULLET_HEIGHT
    });
    state.shots = state.shots + 1;
    return true;
}

/**
 * moveBullets — move every shot and forget the ones that have left.
 *
 * INPUT:  bullets — the list. distance — how far they move (up is negative).
 * OUTPUT: a NEW list of bullets
 *
 * ALGORITHM: shift each one, then keep only the ones still on the field.
 */
function moveBullets(bullets, distance) {
    const moved = [];
    for (let i = 0; i < bullets.length; i++) {
        const bullet = { x: bullets[i].x, y: bullets[i].y + distance };
        if (bullet.y + BULLET_HEIGHT > 0 && bullet.y < FIELD_HEIGHT) {
            moved.push(bullet);
        }
    }
    return moved;
}

/**
 * scoreForRow — how many points is an alien worth?
 * INPUT: row — 0 is the back row. OUTPUT: points.
 * ALGORITHM: the ones at the back are furthest away and worth the most.
 */
function scoreForRow(row) {
    return (ALIEN_ROWS - row) * 10;
}

/**
 * hitAliens — check every shot against every alien.
 *
 * INPUT:  state
 * OUTPUT: how many aliens were shot this frame
 *
 * ALGORITHM: for each bullet, look for the first living alien it touches.
 *            Kill the alien, remove the bullet, and score. A bullet can only
 *            ever hit one alien — that is why we stop looking after the first.
 */
function hitAliens(state) {
    let hits = 0;
    const survivors = [];

    for (let b = 0; b < state.bullets.length; b++) {
        const bullet = state.bullets[b];
        let hitSomething = false;

        for (let a = 0; a < state.aliens.length; a++) {
            const alien = state.aliens[a];
            if (alien.alive && overlaps(bulletRect(bullet), alienRect(alien, state))) {
                alien.alive = false;
                state.score = state.score + scoreForRow(alien.row);
                hits = hits + 1;
                hitSomething = true;
                break;
            }
        }

        if (!hitSomething) {
            survivors.push(bullet);
        }
    }

    state.bullets = survivors;
    return hits;
}

/** lowestAlienInColumn — the alien at the bottom of a column, or null. */
function lowestAlienInColumn(state, column) {
    let found = null;
    for (let i = 0; i < state.aliens.length; i++) {
        const alien = state.aliens[i];
        if (alien.alive && alien.column === column) {
            if (found === null || alien.row > found.row) { found = alien; }
        }
    }
    return found;
}

/** dropBomb — one of the front-row aliens throws something back. */
function dropBomb(state) {
    const column = Math.floor(Math.random() * ALIEN_COLUMNS);
    const alien = lowestAlienInColumn(state, column);
    if (alien === null) { return false; }
    const rect = alienRect(alien, state);
    state.bombs.push({ x: rect.x + rect.width / 2, y: rect.y + rect.height });
    return true;
}

/** bombInterval — how long between bombs, in milliseconds. */
function bombInterval(state) {
    const gap = 1500 - (state.wave - 1) * 120;
    return gap < 500 ? 500 : gap;
}

/** aliensHaveLanded — has the fleet reached the ship's row? */
function aliensHaveLanded(state) {
    for (let i = 0; i < state.aliens.length; i++) {
        const alien = state.aliens[i];
        if (alien.alive && alienRect(alien, state).y + ALIEN_HEIGHT >= SHIP_Y) {
            return true;
        }
    }
    return false;
}

/** startWave — put a fresh fleet at the top. */
function startWave(state) {
    state.aliens = makeAliens();
    state.fleetX = (FIELD_WIDTH - FLEET_WIDTH) / 2;
    state.fleetY = 40;
    state.fleetDirection = 1;
    state.bullets = [];
    state.bombs = [];
    state.sinceBomb = 0;
}

/** createGame — start a brand-new game. */
function createGame() {
    const state = {
        shipX: (FIELD_WIDTH - SHIP_WIDTH) / 2,
        steering: 0,
        aliens: [],
        bullets: [],
        bombs: [],
        fleetX: 0,
        fleetY: 40,
        fleetDirection: 1,
        sinceBomb: 0,
        lives: START_LIVES,
        score: 0,
        wave: 1,
        shots: 0,
        isOver: false,
        isPaused: false
    };
    startWave(state);
    return state;
}

/** loseLife — take a life, and end the game if that was the last one. */
function loseLife(state) {
    state.lives = state.lives - 1;
    state.bombs = [];
    state.bullets = [];
    if (state.lives <= 0) {
        state.lives = 0;
        state.isOver = true;
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

    moveShip(state, seconds);
    moveFleet(state, seconds);

    state.bullets = moveBullets(state.bullets, -BULLET_SPEED * seconds);
    state.bombs = moveBullets(state.bombs, BOMB_SPEED * seconds);

    hitAliens(state);

    for (let i = 0; i < state.bombs.length; i++) {
        if (overlaps(bulletRect(state.bombs[i]), shipRect(state))) {
            loseLife(state);
            return;
        }
    }

    if (aliensHaveLanded(state)) {
        loseLife(state);
        return;
    }

    state.sinceBomb = state.sinceBomb + elapsedMs;
    if (state.sinceBomb >= bombInterval(state)) {
        dropBomb(state);
        state.sinceBomb = 0;
    }

    if (aliensLeft(state) === 0) {
        state.wave = state.wave + 1;
        state.score = state.score + 100;
        startWave(state);
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
    if (k === ' ' || k === 'spacebar' || k === 'arrowup' || k === 'w') { return 'fire'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
