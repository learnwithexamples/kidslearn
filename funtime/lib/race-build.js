/* ============================================================
   race-build.js — the Car Racing workshop

   This file holds only the things that are special to the racing game: the
   little demos that grow beside the editor, and the buttons each one needs.
   Everything else — the steps, the editor, the tests, the progress dots — is
   handled by workshop.js, which the Tetris and Snake workshops use too.
   ============================================================ */

(function () {
    'use strict';

    /* The demo panel is narrower than the real game, so everything is drawn
       four fifths of its normal size. */
    const DEMO_SCALE = 0.8;

    /** How fast the practice road moves before speedForLevel is written. */
    const DEMO_SPEED = 200;

    /** How far apart the practice traffic is. */
    const DEMO_GAP = 300;

    let demo = null;
    let demoKind = 'lanes';
    let demoFlags = {};
    let demoMessage = '';

    /**
     * targetX — where the demo car is trying to get to.
     * INPUT: lane. OUTPUT: the x for the LEFT edge of a car in that lane.
     */
    function targetX(lane) {
        return laneCenterX(lane) - CAR_WIDTH / 2;
    }

    /**
     * steerTowardTarget — turn "I want lane 2" into a steering value.
     *
     * INPUT:  state — anything with a player and a targetLane
     * OUTPUT: nothing; it sets state.steering to -1, 0 or 1
     *
     * ALGORITHM: if the car is already within a few pixels of the middle of the
     *            lane it is heading for, steer 0; otherwise steer towards it.
     *
     * WHY: the real game holds a key down, but the demo only has buttons to
     *      click, so the buttons pick a lane and the demo drives to it.
     */
    function steerTowardTarget(state) {
        const wanted = targetX(state.targetLane);
        if (Math.abs(wanted - state.player.x) < 4) {
            state.steering = 0;
        } else {
            state.steering = wanted > state.player.x ? 1 : -1;
        }
    }

    /** nudgeLane — move the demo car's target one lane left or right. */
    function nudgeLane(step, change) {
        if (!demo || demo.targetLane === undefined) { return; }
        demo.targetLane = clamp(demo.targetLane + change, 0, LANE_COUNT - 1);
    }

    /**
     * startDemo — build whatever the current step wants to show.
     * INPUT: step. OUTPUT: nothing.
     */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'lanes';
        demoFlags = (step.demo && step.demo.flags) || {};
        demoMessage = '';

        if (demoKind === 'lanes') {
            demo = { cars: [createCar(0, 60), createCar(1, 210), createCar(2, 360)] };
        } else if (demoKind === 'clamp') {
            demo = { wanted: targetX(1) };
        } else if (demoKind === 'cars') {
            demo = { cars: [] };
        } else if (demoKind === 'overlap') {
            demo = { a: createCar(1, PLAYER_Y), b: createCar(1, 120) };
        } else if (demoKind === 'mini') {
            demo = {
                player: createCar(1, PLAYER_Y),
                cars: [],
                targetLane: 1,
                steering: 0,
                sinceSpawn: DEMO_GAP,
                stripeOffset: 0,
                isOver: false
            };
        } else {
            demo = createGame();
            demo.targetLane = 1;
            demo.isPaused = false;
        }
    }

    /**
     * updateMini — one frame of the practice road.
     *
     * INPUT:  elapsed — milliseconds since the last frame
     * OUTPUT: nothing
     *
     * ALGORITHM: the same shape as the real updateRace, but each rule only
     *            switches on once the student has written the function it
     *            needs. Before keepCarsOnScreen exists the cars pile up in the
     *            list for ever — which is exactly the point of that step.
     */
    function updateMini(elapsed) {
        if (!demo || demo.isOver) { return; }

        const seconds = elapsed / 1000;
        const travelled = DEMO_SPEED * seconds;

        steerTowardTarget(demo);
        steerPlayer(demo, seconds);
        demo.stripeOffset = (demo.stripeOffset + travelled) % STRIPE_PERIOD;

        if (demoFlags.traffic) {
            demo.cars = moveCars(demo.cars, travelled);

            demo.sinceSpawn = demo.sinceSpawn + travelled;
            if (demo.sinceSpawn >= DEMO_GAP) {
                spawnCar(demo);
                demo.sinceSpawn = 0;
            }
        }

        if (demoFlags.remove) {
            demo.cars = keepCarsOnScreen(demo.cars);
        }

        if (demoFlags.crash && hasCrashed(demo)) {
            demo.isOver = true;
            demoMessage = 'Crash! Press ↺ to try again';
        }
    }

    /**
     * updateDemo — let the demo's clock tick.
     * INPUT: elapsed — milliseconds. OUTPUT: nothing.
     */
    function updateDemo(elapsed) {
        if (demoKind === 'game' || demoKind === 'final') {
            steerTowardTarget(demo);
            updateRace(demo, elapsed);
            return;
        }
        if (demoKind === 'mini') {
            updateMini(elapsed);
        }
    }

    /**
     * drawDemo — draw the current demo onto the canvas.
     * INPUT: ctx, canvas, setNote. OUTPUT: nothing.
     *
     * ALGORITHM: shrink everything to DEMO_SCALE first, then draw the road and
     *            whatever this step is showing, then put the scale back.
     */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(DEMO_SCALE, DEMO_SCALE);

            if (demoKind === 'lanes') {
                drawRoad(ctx, 0);
                demo.cars.forEach(function (car) { drawCar(ctx, car, false); });
                drawFrame(ctx, ROAD_WIDTH, ROAD_HEIGHT);
                setNote('lane 0 → ' + laneCenterX(0) + '   lane 1 → ' + laneCenterX(1) + '   lane 2 → ' + laneCenterX(2));

            } else if (demoKind === 'clamp') {
                const parked = createCar(1, PLAYER_Y);
                parked.x = clamp(demo.wanted, PLAYER_MIN_X, PLAYER_MAX_X);
                drawRoad(ctx, 0);
                drawCar(ctx, parked, true);
                drawFrame(ctx, ROAD_WIDTH, ROAD_HEIGHT);
                setNote('clamp(' + Math.round(demo.wanted) + ', ' + PLAYER_MIN_X + ', ' + PLAYER_MAX_X + ') → ' + Math.round(parked.x));

            } else if (demoKind === 'cars') {
                drawRoad(ctx, 0);
                demo.cars.forEach(function (car) { drawCar(ctx, car, false); });
                drawFrame(ctx, ROAD_WIDTH, ROAD_HEIGHT);
                setNote(demo.cars.length + ' car(s) on the road');

            } else if (demoKind === 'overlap') {
                drawRoad(ctx, 0);
                drawCar(ctx, demo.b, false);
                drawCar(ctx, demo.a, true);
                drawFrame(ctx, ROAD_WIDTH, ROAD_HEIGHT);
                const touching = overlaps(demo.a, demo.b);
                setNote('overlaps(yours, theirs) → ' + touching + (touching ? '   💥 that is a crash!' : ''));

            } else if (demoKind === 'mini') {
                drawRoad(ctx, demo.stripeOffset);
                demo.cars.forEach(function (car) { drawCar(ctx, car, false); });
                drawCar(ctx, demo.player, true);
                drawFrame(ctx, ROAD_WIDTH, ROAD_HEIGHT);
                if (demo.isOver) {
                    drawMessage(ctx, ROAD_WIDTH, ROAD_HEIGHT, 'CRASH!', 'Press ↺ to try again');
                }
                setNote(demoMessage || 'cars in the list: ' + demo.cars.length);

            } else {
                renderGame(ctx, demo);
                setNote('Score ' + demo.score + '  •  Level ' + demo.level + '  •  ' + metresDriven(demo) + ' m');
            }
        } catch (e) {
            ctx.restore();
            ctx.save();
            clearCanvas(ctx, canvas.width, canvas.height, '#ffffff');
            ctx.fillStyle = '#111111';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Waiting for working code…', canvas.width / 2, canvas.height / 2 - 10);
            ctx.font = '11px monospace';
            ctx.fillText(String(e.message).slice(0, 40), canvas.width / 2, canvas.height / 2 + 12);
            setNote('The demo stopped: ' + e.message);
        }
        ctx.restore();
    }

    /**
     * sizeCanvas — every racing demo uses the same shrunken road.
     * INPUT: step, canvas. OUTPUT: nothing.
     */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(ROAD_WIDTH * DEMO_SCALE);
        canvas.height = Math.round(ROAD_HEIGHT * DEMO_SCALE);
    }

    /**
     * controls — the buttons under the demo, chosen by the step.
     * INPUT: step, addButton(label, title, onClick). OUTPUT: nothing.
     */
    function controls(step, addButton) {
        const kind = step.demo.kind;
        const flags = step.demo.flags || {};

        if (kind === 'lanes') {
            addButton('↺ Redraw', 'Park the cars again', function () { startDemo(step); });
            return;
        }

        if (kind === 'clamp') {
            addButton('←← Push left', 'Try to shove the car off the road', function () { demo.wanted -= 40; });
            addButton('Push right →→', 'Try to shove it off the other side', function () { demo.wanted += 40; });
            addButton('↺', 'Back to the middle', function () { startDemo(step); });
            return;
        }

        if (kind === 'cars') {
            addButton('+ Car', 'Drop another car on the road', function () {
                demo.cars.push(createCar(randomLane(), Math.floor(Math.random() * (ROAD_HEIGHT - CAR_HEIGHT))));
            });
            addButton('Lane 0', 'A car in the left lane', function () { demo.cars.push(createCar(0, 40)); });
            addButton('Lane 2', 'A car in the right lane', function () { demo.cars.push(createCar(2, 40)); });
            addButton('↺', 'Clear the road', function () { startDemo(step); });
            return;
        }

        if (kind === 'overlap') {
            addButton('←', 'Move your car left', function () { demo.a.x -= 12; });
            addButton('→', 'Move your car right', function () { demo.a.x += 12; });
            addButton('↑', 'Move your car up the road', function () { demo.a.y -= 16; });
            addButton('↓', 'Move your car back down', function () { demo.a.y += 16; });
            addButton('↺', 'Put them back', function () { startDemo(step); });
            return;
        }

        /* the practice road and the real game both steer with two buttons */
        addButton('←', 'Move one lane left', function () { nudgeLane(step, -1); });
        addButton('→', 'Move one lane right', function () { nudgeLane(step, 1); });

        if (flags.levelPicker) {
            addButton('Level −', 'Slower', function () { demo.level = Math.max(1, demo.level - 1); });
            addButton('Level +', 'Faster', function () { demo.level = Math.min(20, demo.level + 1); });
        }
        if (kind === 'game' || kind === 'final') {
            addButton('▶ / ⏸', 'Start or pause', function () { togglePause(demo); });
        }
        addButton('↺ New', 'Start the demo again', function () { startDemo(step); });
    }

    /**
     * onKey — only the last step drives with the keyboard.
     * INPUT: step, event (a keydown). OUTPUT: nothing.
     */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }

        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'left') { nudgeLane(step, -1); }
        else if (action === 'right') { nudgeLane(step, 1); }
        else if (action === 'faster') { demo.boost = BOOST_FAST; }
        else if (action === 'slower') { demo.boost = BOOST_SLOW; }
        else if (action === 'pause') { togglePause(demo); }
        else if (action === 'restart') { startDemo(step); }
    }

    /* Hand the demo over to the shared workshop engine. */
    startWorkshop({
        storagePrefix: 'race-build',
        steps: RACE_STEPS,
        demo: {
            sizeCanvas: sizeCanvas,
            start: startDemo,
            update: function (step, elapsed) { updateDemo(elapsed); },
            draw: function (step, ctx, canvas, setNote) { drawDemo(ctx, canvas, setNote); },
            controls: controls,
            onKey: onKey
        }
    });
})();
