/* ============================================================
   invaders-build.js — the Space Invaders workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.66;

    let demo = null;
    let demoKind = 'fleet';
    let demoFlags = {};

    /** practiceState — a game with a still fleet, for the picture-only demos. */
    function practiceState() {
        const state = createGame();
        state.isPaused = true;
        return state;
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'fleet';
        demoFlags = (step.demo && step.demo.flags) || {};

        if (demoKind === 'fleet') {
            demo = practiceState();
            demo.picked = { column: 2, row: 1 };
        } else if (demoKind === 'march' || demoKind === 'shoot') {
            demo = practiceState();
            demo.isPaused = false;
        } else {
            demo = createGame();
        }
    }

    /** robotGunner — a robot player: line up under an alien and fire. */
    function robotGunner(state) {
        const targets = state.aliens.filter(function (a) { return a.alive; });
        if (targets.length === 0) { return; }
        let target = targets[0];
        for (let i = 1; i < targets.length; i++) {
            if (Math.abs(alienRect(targets[i], state).x - state.shipX) <
                Math.abs(alienRect(target, state).x - state.shipX)) {
                target = targets[i];
            }
        }
        const want = alienRect(target, state).x + ALIEN_WIDTH / 2 - SHIP_WIDTH / 2;
        if (Math.abs(want - state.shipX) < 4) {
            state.steering = 0;
            fireBullet(state);
        } else {
            state.steering = want > state.shipX ? 1 : -1;
        }
    }

    /** updateDemo — one frame of whichever practice field is showing. */
    function updateDemo(elapsed) {
        const seconds = elapsed / 1000;

        if (demoKind === 'march') {
            moveFleet(demo, seconds);

        } else if (demoKind === 'shoot') {
            moveShip(demo, seconds);
            demo.bullets = moveBullets(demo.bullets, -BULLET_SPEED * seconds);
            hitAliens(demo);

        } else if (demoKind === 'game' || demoKind === 'final') {
            if (demoFlags.robot) { robotGunner(demo); }
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

            if (demoKind === 'fleet') {
                const rect = alienRect(demo.picked, demo);
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 4]);
                ctx.strokeRect(rect.x - 4, rect.y - 4, rect.width + 8, rect.height + 8);
                ctx.setLineDash([]);
                setNote('alienRect(column ' + demo.picked.column + ', row ' + demo.picked.row +
                        ') → x ' + Math.round(rect.x) + '  y ' + Math.round(rect.y));

            } else if (demoKind === 'march') {
                const way = demo.fleetDirection === 1 ? 'right →' : '← left';
                setNote('fleet at x ' + Math.round(demo.fleetX) + '  ' + way + '  at ' +
                        fleetSpeed(demo) + ' px/s  •  ' + aliensLeft(demo) + ' aliens left');

            } else if (demoKind === 'shoot') {
                setNote(demo.bullets.length + ' bullet(s) in the air  •  ' + demo.shots +
                        ' shots fired  •  score ' + demo.score);

            } else {
                setNote('score ' + demo.score + '  •  ' + demo.lives + ' lives  •  wave ' +
                        demo.wave + '  •  ' + aliensLeft(demo) + ' aliens left');
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

        if (kind === 'fleet') {
            addButton('←', 'The alien to the left', function () { demo.picked.column = Math.max(0, demo.picked.column - 1); });
            addButton('→', 'The alien to the right', function () { demo.picked.column = Math.min(ALIEN_COLUMNS - 1, demo.picked.column + 1); });
            addButton('↑', 'The row behind', function () { demo.picked.row = Math.max(0, demo.picked.row - 1); });
            addButton('↓', 'The row in front', function () { demo.picked.row = Math.min(ALIEN_ROWS - 1, demo.picked.row + 1); });
            return;
        }
        if (kind === 'march') {
            addButton('Shoot some', 'Take a few aliens out', function () {
                demo.aliens.forEach(function (alien) {
                    if (alien.column === 0 || alien.column === 1 || alien.column === 5) {
                        alien.alive = false;
                    }
                });
            });
            addButton('↺', 'A full fleet again', function () { startDemo(step); });
            return;
        }

        addButton('←', 'Move left', function () { demo.steering = -1; });
        addButton('Stop', 'Stop moving', function () { demo.steering = 0; });
        addButton('→', 'Move right', function () { demo.steering = 1; });
        addButton('FIRE', 'Shoot', function () { fireBullet(demo); });
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
        else if (action === 'left') { demo.steering = -1; }
        else if (action === 'right') { demo.steering = 1; }
        else if (action === 'fire') { fireBullet(demo); }
    }

    startWorkshop({
        storagePrefix: 'invaders-build',
        steps: INVADERS_STEPS,
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
