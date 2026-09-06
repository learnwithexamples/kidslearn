/* ============================================================
   frogger-build.js — the Frogger workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.72;

    let demo = null;
    let demoKind = 'lanes';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'lanes';

        if (demoKind === 'lanes') {
            demo = { row: 3 };
        } else if (demoKind === 'traffic') {
            demo = { cars: makeTraffic(), level: 1 };
        } else if (demoKind === 'hop') {
            demo = createGame();
            demo.cars = [];
        } else {
            demo = createGame();
        }
    }

    /** updateDemo — let the demo's clock tick. */
    function updateDemo(elapsed) {
        if (demoKind === 'traffic') {
            moveCars(demo.cars, elapsed / 1000, demo.level);
        } else if (demoKind === 'game' || demoKind === 'final') {
            updateGame(demo, elapsed);
        }
    }

    /** drawRoad — the empty road every demo is drawn on. */
    function drawRoad(ctx) {
        clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, '#ffffff');
        for (let row = 0; row < ROWS; row++) {
            if (isLane(row)) { drawLane(ctx, row); } else { drawSafeRow(ctx, row); }
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);

            if (demoKind === 'lanes') {
                drawRoad(ctx);
                const row = demo.row;
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 3;
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(2, row * CELL + 2, FIELD_WIDTH - 4, CELL - 4);
                ctx.setLineDash([]);
                if (isLane(row)) {
                    makeLane(row).forEach(function (car) { drawCar(ctx, car); });
                    const way = laneDirection(row) === 1 ? 'right →' : '← left';
                    setNote('row ' + row + '  ' + way + '  at ' + laneSpeed(row, 1) + ' px/s');
                } else {
                    setNote('row ' + row + ' is a SAFE row — no traffic here');
                }
                drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

            } else if (demoKind === 'traffic') {
                drawRoad(ctx);
                demo.cars.forEach(function (car) { drawCar(ctx, car); });
                drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
                setNote('level ' + demo.level + '  •  ' + demo.cars.length +
                        ' vehicles, all still on the road');

            } else if (demoKind === 'hop') {
                drawRoad(ctx);
                drawFrog(ctx, demo.frog);
                drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
                setNote('frog at column ' + demo.frog.column + ' row ' + demo.frog.row +
                        '   •   score ' + demo.score);

            } else {
                renderGame(ctx, demo);
                setNote('score ' + demo.score + '  •  ' + demo.lives + ' lives  •  ' +
                        demo.crossings + ' crossings  •  squashed ' + isSquashed(demo));
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

    /** sizeCanvas — every Frogger demo uses the same shrunken road. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(FIELD_WIDTH * SCALE);
        canvas.height = Math.round(FIELD_HEIGHT * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'lanes') {
            addButton('Row ↑', 'Look at the row above', function () { demo.row = Math.max(0, demo.row - 1); });
            addButton('Row ↓', 'Look at the row below', function () { demo.row = Math.min(ROWS - 1, demo.row + 1); });
            return;
        }
        if (kind === 'traffic') {
            addButton('Level −', 'Slower traffic', function () { demo.level = Math.max(1, demo.level - 1); });
            addButton('Level +', 'Faster traffic', function () { demo.level = demo.level + 1; });
            addButton('↺', 'Line the traffic up again', function () { startDemo(step); });
            return;
        }

        addButton('↑', 'Hop forward', function () { moveFrog(demo, 0, -1); reachHome(demo); });
        addButton('↓', 'Hop back', function () { moveFrog(demo, 0, 1); });
        addButton('←', 'Hop left', function () { moveFrog(demo, -1, 0); });
        addButton('→', 'Hop right', function () { moveFrog(demo, 1, 0); });
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
        else if (action === 'up') { moveFrog(demo, 0, -1); reachHome(demo); }
        else if (action === 'down') { moveFrog(demo, 0, 1); }
        else if (action === 'left') { moveFrog(demo, -1, 0); }
        else if (action === 'right') { moveFrog(demo, 1, 0); }
    }

    startWorkshop({
        storagePrefix: 'frogger-build',
        steps: FROGGER_STEPS,
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
