/* ============================================================
   race-road.js — the road, the lanes and the shape of a car

   The road is drawn on a canvas 300 pixels wide and 500 tall. Unlike Snake
   and Tetris there is no grid here: everything lives at a real pixel
   position, and cars can sit half way between two places.

   A CAR is a rectangle:

       { x: 60, y: 120, width: 44, height: 74, lane: 0 }

       x, y   = the TOP-LEFT corner, in pixels
       lane   = which of the three lanes it was born in (0, 1 or 2)

   Every function here is pure: give it numbers, it gives you an answer.
   ============================================================ */

/** The size of the road, in pixels. */
const ROAD_WIDTH = 300;
const ROAD_HEIGHT = 500;

/** The black verges down each side. Cars must stay between them. */
const EDGE_WIDTH = 15;

/** Three lanes, each the same width. */
const LANE_COUNT = 3;
const LANE_WIDTH = (ROAD_WIDTH - EDGE_WIDTH * 2) / LANE_COUNT;

/** Every car is the same size. */
const CAR_WIDTH = 44;
const CAR_HEIGHT = 74;

/** The player's car never moves up or down — the road moves instead. */
const PLAYER_Y = ROAD_HEIGHT - CAR_HEIGHT - 24;

/** How far left and right the player's car may go. */
const PLAYER_MIN_X = EDGE_WIDTH;
const PLAYER_MAX_X = ROAD_WIDTH - EDGE_WIDTH - CAR_WIDTH;

/** How fast the player's car slides sideways, in pixels per second. */
const STEER_SPEED = 300;

/**
 * laneCenterX — the middle of one lane, in pixels from the left.
 *
 * INPUT:  lane — 0 (left), 1 (middle) or 2 (right)
 * OUTPUT: the x position of the middle of that lane
 *
 * ALGORITHM:
 *   1. Skip past the black verge: that is EDGE_WIDTH.
 *   2. Skip past the lanes before this one: lane * LANE_WIDTH.
 *   3. Add half a lane to land in the middle: LANE_WIDTH / 2.
 *
 * EXAMPLE: lane 0 is at 60, lane 1 at 150, lane 2 at 240.
 */
function laneCenterX(lane) {
    return EDGE_WIDTH + lane * LANE_WIDTH + LANE_WIDTH / 2;
}

/**
 * clamp — keep a number between two limits.
 *
 * INPUT:  value — the number. low — the smallest allowed. high — the largest.
 * OUTPUT: value if it is already between the two, otherwise the limit it went past
 *
 * ALGORITHM:
 *   If value is smaller than low, answer low.
 *   If value is bigger than high, answer high.
 *   Otherwise answer value.
 *
 * WHY: this is how the car is kept on the road, and it turns up in almost
 *      every game ever written.
 */
function clamp(value, low, high) {
    if (value < low) {
        return low;
    }
    if (value > high) {
        return high;
    }
    return value;
}

/**
 * createCar — build one car in a lane.
 *
 * INPUT:  lane — 0, 1 or 2. y — how far down the road its top edge is.
 * OUTPUT: a car object { x, y, width, height, lane }
 *
 * ALGORITHM:
 *   1. Find the middle of the lane with laneCenterX.
 *   2. The car's LEFT edge is half a car-width to the left of that middle.
 *   3. Return the rectangle, remembering which lane it belongs to.
 */
function createCar(lane, y) {
    return {
        x: laneCenterX(lane) - CAR_WIDTH / 2,
        y: y,
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
        lane: lane
    };
}

/**
 * overlaps — do two rectangles touch?
 *
 * INPUT:  a, b — two rectangles, each { x, y, width, height }
 * OUTPUT: true if they overlap even slightly, otherwise false
 *
 * ALGORITHM (the classic rectangle test — think about the GAPS):
 *   Two rectangles do NOT touch if any of these is true:
 *       a is completely left of b   ->  a.x + a.width  <= b.x
 *       a is completely right of b  ->  a.x            >= b.x + b.width
 *       a is completely above b     ->  a.y + a.height <= b.y
 *       a is completely below b     ->  a.y            >= b.y + b.height
 *   So they DO touch when none of those gaps exist:
 *       a.x < b.x + b.width  AND  a.x + a.width  > b.x  AND
 *       a.y < b.y + b.height AND  a.y + a.height > b.y
 *
 * This one function decides every crash in the game.
 */
function overlaps(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

/**
 * isOnScreen — is this car still somewhere on the road?
 *
 * INPUT:  car — a car
 * OUTPUT: true while any part of it is above the bottom edge of the road
 *
 * ALGORITHM: the car's top edge (car.y) must still be less than ROAD_HEIGHT.
 *            Once it is past that, the whole car has driven off the bottom.
 */
function isOnScreen(car) {
    return car.y < ROAD_HEIGHT;
}

/**
 * randomLane — pick one of the three lanes at random.
 *
 * INPUT:  none
 * OUTPUT: 0, 1 or 2
 *
 * ALGORITHM: Math.floor(Math.random() * LANE_COUNT).
 */
function randomLane() {
    return Math.floor(Math.random() * LANE_COUNT);
}
