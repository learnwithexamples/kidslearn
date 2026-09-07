/* ============================================================
   asteroids-build.js — the Asteroids workshop's demos

   Twenty steps need more than one practice field, so there are nine. Each one
   shows the least it can get away with: the step about angles has no rocks in
   it at all, the step about bullets has nothing to shoot. Fewer moving parts
   means a student can actually see what their function just did.
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.66;

    /* Kinds that are just the ship flying about, with nothing to hit. */
    const OPEN_SKY = ['angles', 'measure', 'drift', 'shoot'];

    let demo = null;
    let demoKind = 'angles';
    let demoFlags = {};

    function isOpenSky() { return OPEN_SKY.indexOf(demoKind) !== -1; }

    /** stillRock — a rock that stays put, so a demo can be read slowly. */
    function stillRock(x, y, size) {
        const rock = makeRock(x, y, size);
        rock.dx = 0;
        rock.dy = 0;
        return rock;
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'angles';
        demoFlags = (step.demo && step.demo.flags) || {};

        demo = createGame();

        if (isOpenSky()) {
            demo.rocks = [];
            demo.shield = 0;
            if (demoKind === 'measure') {
                demo.rocks = [stillRock(250, 110, 3)];
            }
        } else if (demoKind === 'rock') {
            demo.shield = 0;
            demo.rocks = [stillRock(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, 3)];
        } else if (demoKind === 'split') {
            demo.rocks = [stillRock(FIELD_WIDTH / 2, 110, 3)];
        } else if (demoKind === 'wave') {
            demo.wave = 1;
            startWave(demo);
        }
    }

    /** robotPilot — a robot player: turn towards the nearest rock and shoot. */
    function robotPilot(state) {
        if (state.rocks.length === 0) { return; }
        let target = state.rocks[0];
        for (let i = 1; i < state.rocks.length; i++) {
            if (distanceBetween(state.ship, state.rocks[i]) <
                distanceBetween(state.ship, target)) {
                target = state.rocks[i];
            }
        }
        const want = Math.atan2(target.y - state.ship.y, target.x - state.ship.x);
        let turn = (want - state.ship.angle + Math.PI) % (Math.PI * 2) - Math.PI;
        if (turn < -Math.PI) { turn = turn + Math.PI * 2; }
        state.turning = Math.abs(turn) < 0.08 ? 0 : (turn > 0 ? 1 : -1);
        if (Math.abs(turn) < 0.12) { fireBullet(state); }
    }

    /** flyShip — the ship's own frame: turn, thrust or drift, move. */
    function flyShip(seconds) {
        turnShip(demo.ship, demo.turning, seconds);
        if (demo.thrusting) { thrustShip(demo.ship, seconds); } else { driftShip(demo.ship, seconds); }
        moveThing(demo.ship, seconds);
    }

    /** flyBullets — carry the shots along and let the spent ones fade. */
    function flyBullets(seconds) {
        demo.bullets.forEach(function (bullet) { moveThing(bullet, seconds); });
        demo.bullets = ageBullets(demo.bullets, seconds);
    }

    /** updateDemo — one frame of whichever practice field is showing. */
    function updateDemo(elapsed) {
        const seconds = elapsed / 1000;

        if (isOpenSky()) {
            flyShip(seconds);
            flyBullets(seconds);

        } else if (demoKind === 'rock') {
            demo.rocks.forEach(function (rock) { rock.wobble = rock.wobble + rock.spin * seconds; });

        } else if (demoKind === 'wave') {
            demo.rocks.forEach(function (rock) {
                moveThing(rock, seconds);
                rock.wobble = rock.wobble + rock.spin * seconds;
            });

        } else if (demoKind === 'split') {
            flyBullets(seconds);
            hitRocks(demo);

        } else if (demoKind === 'game' || demoKind === 'final') {
            if (demoFlags.robot) { robotPilot(demo); }
            updateGame(demo, elapsed);
            if (demo.isOver) { startDemo({ demo: { kind: demoKind, flags: demoFlags } }); }
        }
    }

    /** dashedLine — the measuring line the geometry demos draw. */
    function dashedLine(ctx, from, to) {
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    /** markCorners — a dot on every point rockPoints handed back. */
    function markCorners(ctx, rock) {
        ctx.fillStyle = '#111111';
        rockPoints(rock).forEach(function (point) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /** describe — the line of words under the canvas, per demo kind. */
    function describe(setNote) {
        const ship = demo.ship;

        if (demoKind === 'angles') {
            const nose = pointFrom(ship.x, ship.y, ship.angle, 60);
            setNote('angle ' + ship.angle.toFixed(2) + '  →  60 pixels ahead is x ' +
                    Math.round(nose.x) + ', y ' + Math.round(nose.y));

        } else if (demoKind === 'measure') {
            const rock = demo.rocks[0];
            const gap = distanceBetween(ship, rock);
            const hit = touches(ship, rock, SHIP_RADIUS, ROCK_RADIUS[rock.size]);
            setNote('distanceBetween → ' + gap.toFixed(1) + '   •   touches → ' +
                    (hit ? 'TRUE, they overlap' : 'false, still clear'));

        } else if (demoKind === 'drift') {
            setNote('x ' + Math.round(ship.x) + '  y ' + Math.round(ship.y) +
                    '   speedOf → ' + Math.round(speedOf(ship)) + ' px/s  (limit ' + MAX_SPEED + ')');

        } else if (demoKind === 'shoot') {
            setNote(demo.bullets.length + ' of ' + MAX_BULLETS + ' shots in the air   •   ' +
                    demo.shots + ' fired so far');

        } else if (demoKind === 'rock') {
            const rock = demo.rocks[0];
            setNote(rock ? ('size ' + rock.size + '   •   rockPoints → ' + rockPoints(rock).length +
                            ' corners   •   wobble ' + rock.wobble.toFixed(1)) : 'no rock');

        } else if (demoKind === 'wave') {
            setNote('wave ' + demo.wave + '   •   ' + demo.rocks.length + ' rocks in the ring');

        } else if (demoKind === 'split') {
            const sizes = demo.rocks.map(function (rock) { return rock.size; });
            setNote(demo.rocks.length + ' rock(s), sizes [' + sizes + ']  •  score ' + demo.score);

        } else {
            setNote('score ' + demo.score + '  •  ' + demo.lives + ' lives  •  wave ' +
                    demo.wave + '  •  ' + demo.rocks.length + ' rocks');
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);
            renderGame(ctx, demo);

            if (demoKind === 'angles') {
                dashedLine(ctx, demo.ship, pointFrom(demo.ship.x, demo.ship.y, demo.ship.angle, 60));
            } else if (demoKind === 'measure' && demo.rocks[0]) {
                dashedLine(ctx, demo.ship, demo.rocks[0]);
            } else if (demoKind === 'rock' && demo.rocks[0]) {
                markCorners(ctx, demo.rocks[0]);
            }

            describe(setNote);
        } catch (error) {
            ctx.restore();
            ctx.save();
            clearCanvas(ctx, canvas.width, canvas.height, '#ffffff');
            ctx.fillStyle = '#111111';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Waiting for working code…', canvas.width / 2, canvas.height / 2);
            setNote('The demo stopped: ' + error.message);
        }
        ctx.restore();
    }

    /** sizeCanvas — every demo uses the same shrunken field. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(FIELD_WIDTH * SCALE);
        canvas.height = Math.round(FIELD_HEIGHT * SCALE);
    }

    /** steering — the three buttons every flying demo needs. */
    function steering(addButton) {
        addButton('◀ TURN', 'Point further left', function () { demo.turning = -1; });
        addButton('TURN ▶', 'Point further right', function () { demo.turning = 1; });
        addButton('Stop', 'Stop turning', function () { demo.turning = 0; });
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'rock') {
            addButton('New rock', 'Another rock, drifting its own way', function () {
                demo.rocks = [stillRock(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, 3)];
            });
            addButton('Smaller', 'Try the next size down', function () {
                const rock = demo.rocks[0];
                const size = rock && rock.size > 1 ? rock.size - 1 : 3;
                demo.rocks = [stillRock(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, size)];
            });
            addButton('Spin', 'Give it a shove', function () {
                if (demo.rocks[0]) { demo.rocks[0].spin = Math.random() * 2 - 1; }
            });
            return;
        }

        if (kind === 'wave') {
            addButton('Next wave', 'A bigger ring', function () {
                demo.wave = demo.wave + 1;
                startWave(demo);
            });
            addButton('↺ Wave 1', 'Back to the start', function () { startDemo(step); });
            return;
        }

        if (kind === 'split') {
            addButton('Shoot it', 'Fire at the rock', function () {
                const rock = demo.rocks[0];
                if (rock) {
                    demo.bullets.push({ x: rock.x - 60, y: rock.y, dx: 320, dy: 0, life: 1.1 });
                }
            });
            addButton('↺', 'A whole rock again', function () { startDemo(step); });
            return;
        }

        steering(addButton);

        if (kind !== 'angles') {
            addButton('Thrust', 'Fire the engine', function () { thrustShip(demo.ship, 0.25); });
        }
        if (kind === 'shoot' || kind === 'game' || kind === 'final') {
            addButton('FIRE', 'Shoot', function () { fireBullet(demo); });
        }
        addButton('↺ New', 'Start again', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'pause') { togglePause(demo); }
        else if (action === 'left') { demo.turning = -1; }
        else if (action === 'right') { demo.turning = 1; }
        else if (action === 'thrust') { demo.thrusting = true; }
        else if (action === 'fire') { fireBullet(demo); }
    }

    startWorkshop({
        storagePrefix: 'asteroids-build',
        steps: ASTEROIDS_STEPS,
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
