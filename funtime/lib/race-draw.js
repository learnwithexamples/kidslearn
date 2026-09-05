/* ============================================================
   race-draw.js — everything you can see

   Black and white only: a white road, black verges down each side, black
   dashes marking the lanes, and black cars with white windows. The player's
   car has a white racing stripe so you can always tell which one is yours.

   Every function takes a canvas "ctx" (the drawing tool) and paints
   something. None of them change the game — drawing never cheats.
   ============================================================ */

const COLOR_ROAD = '#ffffff';
const COLOR_INK = '#111111';
const COLOR_PAINT = '#ffffff';

/**
 * clearCanvas — paint the whole canvas one flat colour.
 * INPUT: ctx, width, height, color. OUTPUT: nothing.
 * ALGORITHM: set fillStyle, then fillRect over everything.
 */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * drawDashedLine — a line of dashes running down the road.
 *
 * INPUT:  ctx — the drawing tool
 *         x — where the dashes are, across the road
 *         offset — how far the dashes have scrolled (0 to STRIPE_PERIOD)
 *         width — how wide each dash is
 *         color — what colour to paint them
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   Start one whole dash ABOVE the top of the road, so a dash is always
 *   sliding into view, then step down the road STRIPE_PERIOD pixels at a time
 *   drawing a dash half that long. Adding the offset each frame is what makes
 *   the road appear to move.
 */
function drawDashedLine(ctx, x, offset, width, color) {
    const dashLength = STRIPE_PERIOD / 2;
    ctx.fillStyle = color;
    for (let y = -STRIPE_PERIOD + offset; y < ROAD_HEIGHT; y += STRIPE_PERIOD) {
        ctx.fillRect(x - width / 2, y, width, dashLength);
    }
}

/**
 * drawRoad — the road itself: verges, lane markings and all.
 *
 * INPUT:  ctx — the drawing tool. stripeOffset — how far the markings have scrolled.
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Fill everything white — that is the tarmac.
 *   2. Paint a solid black verge down each side.
 *   3. Draw white dashes ON the verges, so the edges of the road rush past too.
 *   4. Draw black dashes on the two lines between the three lanes.
 */
function drawRoad(ctx, stripeOffset) {
    clearCanvas(ctx, ROAD_WIDTH, ROAD_HEIGHT, COLOR_ROAD);

    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(0, 0, EDGE_WIDTH, ROAD_HEIGHT);
    ctx.fillRect(ROAD_WIDTH - EDGE_WIDTH, 0, EDGE_WIDTH, ROAD_HEIGHT);

    drawDashedLine(ctx, EDGE_WIDTH / 2, stripeOffset, EDGE_WIDTH - 6, COLOR_PAINT);
    drawDashedLine(ctx, ROAD_WIDTH - EDGE_WIDTH / 2, stripeOffset, EDGE_WIDTH - 6, COLOR_PAINT);

    for (let lane = 1; lane < LANE_COUNT; lane++) {
        drawDashedLine(ctx, EDGE_WIDTH + lane * LANE_WIDTH, stripeOffset, 4, COLOR_INK);
    }
}

/**
 * drawCar — one car, seen from above.
 *
 * INPUT:  ctx — the drawing tool. car — the rectangle to draw.
 *         isPlayer — true for your car, false for the traffic.
 * OUTPUT: nothing
 *
 * ALGORITHM:
 *   1. Fill the car's rectangle black.
 *   2. Paint two white windows: your car's windscreen is at the top (you are
 *      driving away from the camera), the traffic's is at the bottom (they are
 *      coming towards you).
 *   3. If this is the player, add a white racing stripe down the middle.
 *   4. Add two small white notches on each side: the wheels.
 */
function drawCar(ctx, car, isPlayer) {
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(car.x, car.y, car.width, car.height);

    const windowWidth = car.width - 14;
    const windowHeight = 14;
    const windscreenY = isPlayer ? car.y + 10 : car.y + car.height - 10 - windowHeight;
    const rearWindowY = isPlayer ? car.y + car.height - 16 - windowHeight : car.y + 16;

    ctx.fillStyle = COLOR_PAINT;
    ctx.fillRect(car.x + 7, windscreenY, windowWidth, windowHeight);
    ctx.fillRect(car.x + 7, rearWindowY, windowWidth, windowHeight - 4);

    if (isPlayer) {
        /* short enough to leave a gap either side of the windows, so the
           stripe reads as a stripe and not as one long white blob */
        ctx.fillRect(car.x + car.width / 2 - 3, car.y + 28, 6, 13);
    }

    ctx.fillRect(car.x + 1, car.y + 14, 3, 12);
    ctx.fillRect(car.x + car.width - 4, car.y + 14, 3, 12);
    ctx.fillRect(car.x + 1, car.y + car.height - 26, 3, 12);
    ctx.fillRect(car.x + car.width - 4, car.y + car.height - 26, 3, 12);
}

/**
 * drawFrame — the thick black border around the whole picture.
 * INPUT: ctx, width, height. OUTPUT: nothing.
 */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);
}

/**
 * drawMessage — big centred words across the road.
 *
 * INPUT:  ctx, width, height, title, subtitle
 * OUTPUT: nothing
 *
 * ALGORITHM: cover the road with a see-through white sheet, then write the
 *            title and subtitle in the middle, sized from the width of the
 *            canvas so they still fit on a small board.
 */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / 300;
    const titleSize = Math.max(14, Math.round(30 * scale));
    const subtitleSize = Math.max(9, Math.round(14 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 8);

    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
}

/**
 * renderGame — draw one complete frame of the race.
 *
 * INPUT:  ctx — the drawing tool. state — the game state.
 * OUTPUT: nothing
 *
 * ALGORITHM (order matters — later things cover earlier ones):
 *   1. Draw the road, scrolled to state.stripeOffset.
 *   2. Draw every traffic car.
 *   3. Draw the player's car on top.
 *   4. Draw the border.
 *   5. If the race is over or paused, write the message over everything.
 */
function renderGame(ctx, state) {
    drawRoad(ctx, state.stripeOffset);

    for (let i = 0; i < state.cars.length; i++) {
        drawCar(ctx, state.cars[i], false);
    }
    drawCar(ctx, state.player, true);

    drawFrame(ctx, ROAD_WIDTH, ROAD_HEIGHT);

    if (state.isOver) {
        drawMessage(ctx, ROAD_WIDTH, ROAD_HEIGHT, 'CRASH!', 'Press R or tap New to race again');
    } else if (state.isPaused) {
        drawMessage(ctx, ROAD_WIDTH, ROAD_HEIGHT, 'READY?', 'Press P or tap Go to start');
    }
}
