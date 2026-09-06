/* ============================================================
   floors-rules.js — the rules of Hundred Floors

   You are falling down a shaft. Platforms slide up past you, and you have to
   keep landing on them. Land on a plain one and you are fine. Land on a
   SPIKED one (锯齿) and it costs you blood. Miss them all and you drop off the
   bottom of the shaft — and that is that.

   The ceiling is spiked too, so standing still is not an option: the view
   keeps sinking and pushes you up into it. The only way to survive is to keep
   going down.

   THE ONE IDEA TO TAKE AWAY FROM THIS FILE: the shaft does not move. The
   CAMERA moves. Every platform has a fixed place in the world and stays there
   for ever; what changes is how far down we are looking. Getting that the
   right way round is the difference between a game that works and one that
   fights itself — see cameraSpeed below.
   ============================================================ */

const FIELD_WIDTH = 300;
const FIELD_HEIGHT = 420;
const CEILING_HEIGHT = 22;

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 24;
const WALK_SPEED = 190;
const GRAVITY = 980;
const MAX_FALL_SPEED = 430;
const SPRING_SPEED = -230;

const PLATFORM_WIDTH = 62;
const PLATFORM_HEIGHT = 10;
const ROW_GAP = 92;
const REACH = 104;              /* the furthest apart two platforms may be */
const CONVEYOR_SPEED = 78;
const CRUMBLE_SECONDS = 0.4;

const MAX_HEALTH = 10;
const SPIKE_DAMAGE = 2;
const CEILING_DAMAGE = 1;
const CEILING_HURT_EVERY = 0.6;

const BASE_SINK = 28;           /* how fast the view sinks all by itself */
const FOLLOW_Y = 150;           /* where on the screen the camera likes you */
const CHASE = 3.2;              /* how hard it hurries to put you there */
const MAX_SINK = 330;           /* and the fastest it can ever hurry */

/* the six kinds of platform */
const PLAIN = 0;
const SPIKED = 1;
const SLIDE_LEFT = 2;
const SLIDE_RIGHT = 3;
const SPRING = 4;
const CRUMBLING = 5;

/**
 * screenY — where something in the world appears on the screen.
 * INPUT: state, worldY. OUTPUT: the y to draw it at.
 * ALGORITHM: everything has a fixed place in the world; the camera tells us
 *            how far down we are looking, so take that off.
 */
function screenY(state, worldY) {
    return worldY - state.camera;
}

/**
 * baseSinkSpeed — how fast the view sinks all by itself.
 * INPUT: floor. OUTPUT: pixels per second.
 * ALGORITHM: 40 to start and a little more every floor, up to 130. THIS is
 *            what stops you resting: stand still and the view keeps sinking
 *            until you are scraping along the spiked ceiling.
 */
function baseSinkSpeed(floor) {
    const speed = BASE_SINK + floor * 0.9;
    return speed > 92 ? 92 : speed;
}

/**
 * cameraSpeed — how fast the camera is sinking right now.
 *
 * INPUT:  state
 * OUTPUT: pixels per second
 *
 * ALGORITHM: the base speed, plus a CHASE. The camera would like you to sit
 *            FOLLOW_Y down the screen; if you have dropped below that it
 *            hurries after you, and the further behind it is the faster it
 *            goes. It never hurries backwards — the view only ever sinks.
 *
 * WHY the chase is capped at MAX_SINK: a falling player reaches
 *     MAX_FALL_SPEED, which is faster. So the camera can keep up with
 *     somebody hopping neatly from platform to platform, but it can never
 *     keep up with somebody in real free fall. That gap is exactly what makes
 *     missing every platform a death rather than an inconvenience.
 *
 * AND WHY IT IS THE CAMERA THAT MOVES: it would be tempting to slide all the
 *     platforms upwards instead. Do that and a player standing on one has to
 *     be dragged up with it — so hurrying the view would physically fire the
 *     player into the ceiling. Moving the camera touches nobody.
 */
function cameraSpeed(state) {
    const wanted = state.player.y - FOLLOW_Y;
    const behind = wanted - state.camera;
    const chase = behind > 0 ? behind * CHASE : 0;
    const speed = baseSinkSpeed(state.floor) + chase;
    return speed > MAX_SINK ? MAX_SINK : speed;
}

/**
 * kindWeights — how likely each kind of platform is, this far down.
 *
 * INPUT:  floor
 * OUTPUT: a list of { kind, weight }
 *
 * ALGORITHM: plain platforms are always the commonest. Spikes and crumbling
 *            ones get steadily more likely the deeper you go, which is what
 *            makes floor 80 harder than floor 8 without changing any rule.
 */
function kindWeights(floor) {
    const spikes = Math.min(7, 1.5 + floor / 9);
    const crumbles = Math.min(4, 0.5 + floor / 14);
    return [
        { kind: PLAIN, weight: 12 },
        { kind: SPIKED, weight: spikes },
        { kind: SLIDE_LEFT, weight: 1.5 },
        { kind: SLIDE_RIGHT, weight: 1.5 },
        { kind: SPRING, weight: 1.5 },
        { kind: CRUMBLING, weight: crumbles }
    ];
}

/**
 * randomKind — pick a kind of platform, with some kinds likelier than others.
 *
 * INPUT:  floor
 * OUTPUT: one of PLAIN, SPIKED, SLIDE_LEFT, SLIDE_RIGHT, SPRING, CRUMBLING
 *
 * ALGORITHM — WEIGHTED RANDOM CHOICE, and it is worth learning properly:
 *   1. Add up all the weights.
 *   2. Pick a random number somewhere in that total.
 *   3. Walk the list, taking each weight off your number as you go. The
 *      moment your number runs out, that is the one you have landed on.
 *
 * Picture a row of buckets of different widths and a dart thrown at random: a
 * wide bucket catches more darts. That is all this is.
 */
function randomKind(floor) {
    const weights = kindWeights(floor);

    let total = 0;
    for (let i = 0; i < weights.length; i++) {
        total = total + weights[i].weight;
    }

    let ticket = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        ticket = ticket - weights[i].weight;
        if (ticket < 0) {
            return weights[i].kind;
        }
    }
    return PLAIN;
}

/** platformRect — where a platform is in the world, as a rectangle. */
function platformRect(platform) {
    return {
        x: platform.x,
        y: platform.y,
        width: PLATFORM_WIDTH,
        height: PLATFORM_HEIGHT
    };
}

/** playerRect — the player as a rectangle, in the world. */
function playerRect(player) {
    return {
        x: player.x,
        y: player.y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT
    };
}

/**
 * isOver — is the player standing over this platform?
 *
 * INPUT:  player, platform
 * OUTPUT: true if the player's MIDDLE is above the platform
 *
 * ALGORITHM: compare the middle of the player, not the whole body.
 *
 * WHY the middle: if any overlap at all counted, you could stand balanced on
 *      half a pixel of platform, hanging in mid-air and refusing to fall,
 *      while the ceiling ground you down. Using the middle means you drop the
 *      moment you walk past the edge, which is what a player expects.
 */
function isOver(player, platform) {
    const middle = player.x + PLAYER_WIDTH / 2;
    return middle > platform.x && middle < platform.x + PLATFORM_WIDTH;
}

/**
 * landsOn — has the player just landed on this platform?
 *
 * INPUT:  player — with x, y, dy and lastFeet. platform.
 * OUTPUT: true if the player's feet crossed the top of it this frame
 *
 * ALGORITHM — the CROSSING test:
 *   • the player must be falling. Rising up through a platform from below is
 *     allowed, and that matters after a spring throws you upwards.
 *   • their feet must have been ABOVE the platform's top last frame, and be
 *     level with or below it now. That is what "crossed it" means.
 *   • and they must be over it — see isOver.
 *
 * WHY not simply "are the feet near the top?": at full speed the player falls
 *      seven pixels in a frame and a platform is ten thick. A "near" test
 *      misses fast landings; a crossing test cannot.
 */
function landsOn(player, platform) {
    if (player.dy <= 0) {
        return false;
    }
    const rect = platformRect(platform);
    const feet = player.y + PLAYER_HEIGHT;

    if (player.lastFeet > rect.y || feet < rect.y) {
        return false;
    }
    return isOver(player, platform);
}

/** hurt — take some blood off, never below zero. */
function hurt(state, amount) {
    state.health = state.health - amount;
    if (state.health < 0) {
        state.health = 0;
    }
    state.hurts = state.hurts + 1;
}

/**
 * landOnPlatform — what happens when you land on one.
 *
 * INPUT:  state, platform
 * OUTPUT: nothing; it changes the player and the platform
 *
 * ALGORITHM: stand the player exactly on top, then do whatever this KIND of
 *            platform does:
 *              spiked      — 锯齿. It costs you SPIKE_DAMAGE blood.
 *              spring      — it throws you straight back up.
 *              crumbling   — it starts falling apart under your feet.
 *              sliding     — it carries you sideways while you stand on it.
 *              plain       — nothing at all, and that is a relief.
 *
 *            Landing somewhere new is a new floor, and floors are the score.
 */
function landOnPlatform(state, platform) {
    const rect = platformRect(platform);

    state.player.y = rect.y - PLAYER_HEIGHT;
    state.player.dy = 0;
    state.player.riding = platform;

    if (platform.floor > state.floor) {
        state.floor = platform.floor;
        state.score = state.score + 10;
    }

    if (platform.kind === SPIKED) {
        hurt(state, SPIKE_DAMAGE);

    } else if (platform.kind === SPRING) {
        state.player.dy = SPRING_SPEED;
        state.player.riding = null;
        state.bounces = state.bounces + 1;

    } else if (platform.kind === CRUMBLING) {
        platform.crumbling = CRUMBLE_SECONDS;
    }
}

/**
 * isDead — is the game over?
 *
 * INPUT:  state
 * OUTPUT: true if the player is finished
 *
 * ALGORITHM: two ways to go. Run out of blood, or fall off the bottom of the
 *            screen having missed every platform on the way down.
 */
function isDead(state) {
    return state.health <= 0 || screenY(state, state.player.y) > FIELD_HEIGHT;
}

/** lowestPlatform — the platform furthest down the shaft. */
function lowestPlatform(state) {
    let lowest = null;
    for (let i = 0; i < state.platforms.length; i++) {
        if (lowest === null || state.platforms[i].y > lowest.y) {
            lowest = state.platforms[i];
        }
    }
    return lowest;
}

/**
 * addPlatform — hang a new platform below the bottom of the shaft.
 *
 * INPUT:  state
 * OUTPUT: nothing
 *
 * ALGORITHM: put it one ROW_GAP below the lowest one, and never further than
 *            REACH sideways from it. Without that limit the game could deal
 *            you a platform you had no way of reaching.
 */
function addPlatform(state) {
    const lowest = lowestPlatform(state);
    const fromX = lowest ? lowest.x : (FIELD_WIDTH - PLATFORM_WIDTH) / 2;
    const y = lowest ? lowest.y + ROW_GAP : state.camera + FIELD_HEIGHT - 40;

    let low = fromX - REACH;
    let high = fromX + REACH;
    if (low < 0) { low = 0; }
    if (high > FIELD_WIDTH - PLATFORM_WIDTH) { high = FIELD_WIDTH - PLATFORM_WIDTH; }

    state.nextFloor = state.nextFloor + 1;
    state.platforms.push({
        x: low + Math.random() * (high - low),
        y: y,
        kind: state.nextFloor <= 3 ? PLAIN : randomKind(state.nextFloor),
        floor: state.nextFloor,
        crumbling: 0
    });
}

/** fillShaft — keep making platforms until the bottom of the screen is covered. */
function fillShaft(state) {
    while (lowestPlatform(state) === null ||
           screenY(state, lowestPlatform(state).y) < FIELD_HEIGHT) {
        addPlatform(state);
    }
}

/** createGame — start a brand-new game at the top of the shaft. */
function createGame() {
    const state = {
        player: {
            x: (FIELD_WIDTH - PLAYER_WIDTH) / 2,
            y: 150,
            dy: 0,
            lastFeet: 150 + PLAYER_HEIGHT,
            riding: null
        },
        platforms: [],
        camera: 0,
        steering: 0,
        health: MAX_HEALTH,
        floor: 1,
        nextFloor: 1,
        score: 0,
        hurts: 0,
        bounces: 0,
        sinceCeilingHurt: 0,
        isOver: false,
        isPaused: false
    };

    /* a platform right under the player's feet, then a ladder of them below */
    state.platforms.push({
        x: (FIELD_WIDTH - PLATFORM_WIDTH) / 2,
        y: 150 + PLAYER_HEIGHT,
        kind: PLAIN,
        floor: 1,
        crumbling: 0
    });
    state.player.riding = state.platforms[0];
    fillShaft(state);
    return state;
}

/**
 * walkPlayer — move the player sideways, staying inside the shaft.
 * INPUT: state, seconds. OUTPUT: nothing.
 * ALGORITHM: speed × steering × time, plus a shove from any sliding platform
 *            being stood on, then keep the whole player inside the walls.
 */
function walkPlayer(state, seconds) {
    let x = state.player.x + state.steering * WALK_SPEED * seconds;

    const riding = state.player.riding;
    if (riding && riding.kind === SLIDE_LEFT) {
        x = x - CONVEYOR_SPEED * seconds;
    } else if (riding && riding.kind === SLIDE_RIGHT) {
        x = x + CONVEYOR_SPEED * seconds;
    }

    if (x < 0) { x = 0; }
    if (x > FIELD_WIDTH - PLAYER_WIDTH) { x = FIELD_WIDTH - PLAYER_WIDTH; }
    state.player.x = x;
}

/** stillOnPlatform — has the player walked off the edge of what they were on? */
function stillOnPlatform(player, platform) {
    return isOver(player, platform);
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

    walkPlayer(state, seconds);

    /* platforms that are falling apart do so whether you are on them or not */
    for (let i = 0; i < state.platforms.length; i++) {
        const platform = state.platforms[i];
        if (platform.crumbling > 0) {
            platform.crumbling = platform.crumbling - seconds;
            if (platform.crumbling <= 0) {
                platform.gone = true;
            }
        }
    }
    state.platforms = state.platforms.filter(function (p) { return !p.gone; });
    if (state.player.riding && state.platforms.indexOf(state.player.riding) === -1) {
        state.player.riding = null;
    }

    if (state.player.riding) {
        if (stillOnPlatform(state.player, state.player.riding)) {
            state.player.y = state.player.riding.y - PLAYER_HEIGHT;
            state.player.dy = 0;
        } else {
            state.player.riding = null;
        }
    }

    if (!state.player.riding) {
        state.player.lastFeet = state.player.y + PLAYER_HEIGHT;
        state.player.dy = state.player.dy + GRAVITY * seconds;
        if (state.player.dy > MAX_FALL_SPEED) {
            state.player.dy = MAX_FALL_SPEED;
        }
        state.player.y = state.player.y + state.player.dy * seconds;

        for (let i = 0; i < state.platforms.length; i++) {
            if (landsOn(state.player, state.platforms[i])) {
                landOnPlatform(state, state.platforms[i]);
                break;
            }
        }
    }

    /* the view sinks; nothing in the world is touched by this */
    state.camera = state.camera + cameraSpeed(state) * seconds;
    state.platforms = state.platforms.filter(function (p) {
        return screenY(state, p.y) + PLATFORM_HEIGHT > 0;
    });
    if (state.player.riding && state.platforms.indexOf(state.player.riding) === -1) {
        state.player.riding = null;
    }
    fillShaft(state);

    /* the ceiling is spiked too — being scraped along it costs blood */
    state.sinceCeilingHurt = state.sinceCeilingHurt + seconds;
    if (screenY(state, state.player.y) < CEILING_HEIGHT) {
        state.player.y = state.camera + CEILING_HEIGHT;
        state.player.riding = null;
        if (state.sinceCeilingHurt >= CEILING_HURT_EVERY) {
            hurt(state, CEILING_DAMAGE);
            state.sinceCeilingHurt = 0;
        }
    }

    if (isDead(state)) {
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

    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === 'p' || k === ' ' || k === 'spacebar') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
