/* ============================================================
   asteroids-build.js — the Asteroids workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.66;

    let demo = null;
    let demoKind = 'angles';
    let demoFlags = {};

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'angles';
        demoFlags = (step.demo && step.demo.flags) || {};

        demo = createGame();
        if (demoKind === 'angles' || demoKind === 'drift') {
            demo.rocks = [];
            demo.shield = 0;
        } else if (demoKind === 'split') {
            const rock = makeRock(FIELD_WIDTH / 2, 110, 3);
            rock.dx = 0;
            rock.dy = 0;
            demo.rocks = [rock];
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

    /** updateDemo — one frame of whichever practice field is showing. */
    function updateDemo(elapsed) {
        const seconds = elapsed / 1000;

        if (demoKind === 'angles' || demoKind === 'drift') {
            demo.ship.angle = demo.ship.angle + demo.turning * TURN_SPEED * seconds;
            if (demo.thrusting) { thrustShip(demo.ship, seconds); }
            moveThing(demo.ship, seconds);
            demo.bullets.forEach(function (bullet) {
                moveThing(bullet, seconds);
                bullet.life = bullet.life - seconds;
            });
            demo.bullets = demo.bullets.filter(function (b) { return b.life > 0; });

        } else if (demoKind === 'split') {
            demo.bullets.forEach(function (bullet) {
                moveThing(bullet, seconds);
                bullet.life = bullet.life - seconds;
            });
            demo.bullets = demo.bullets.filter(function (b) { return b.life > 0; });
            hitRocks(demo);

        } else if (demoKind === 'game' || demoKind === 'final') {
            if (demoFlags.robot) { robotPilot(demo); }
            updateGame(demo, elapsed);
            if (demo.isOver) { startDemo({ demo: { kind: demoKind, flags: demoFlags } }); }
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);
            renderGame(ctx, demo);

            const ship = demo.ship;
            if (demoKind === 'angles') {
                const nose = pointFrom(ship.x, ship.y, ship.angle, 60);
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(ship.x, ship.y);
                ctx.lineTo(nose.x, nose.y);
                ctx.stroke();
                ctx.setLineDash([]);
                setNote('angle ' + ship.angle.toFixed(2) + '  →  60 pixels ahead is x ' +
                        Math.round(nose.x) + ', y ' + Math.round(nose.y));

            } else if (demoKind === 'drift') {
                const speed = Math.sqrt(ship.dx * ship.dx + ship.dy * ship.dy);
                setNote('x ' + Math.round(ship.x) + '  y ' + Math.round(ship.y) +
                        '   drifting at ' + Math.round(speed) + ' px/s');

            } else if (demoKind === 'split') {
                const sizes = demo.rocks.map(function (rock) { return rock.size; });
                setNote(demo.rocks.length + ' rock(s), sizes [' + sizes + ']  •  score ' + demo.score);

            } else {
                setNote('score ' + demo.score + '  •  ' + demo.lives + ' lives  •  wave ' +
                        demo.wave + '  •  ' + demo.rocks.length + ' rocks');
            }
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

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

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

        addButton('↺ Left', 'Point further left', function () { demo.turning = -1; });
        addButton('Right ↻', 'Point further right', function () { demo.turning = 1; });
        addButton('Stop', 'Stop turning', function () { demo.turning = 0; });

        if (kind !== 'angles') {
            addButton('Thrust', 'Fire the engine', function () { thrustShip(demo.ship, 0.25); });
        }
        if (kind === 'game' || kind === 'final') {
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
