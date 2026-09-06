/* ============================================================
   whack-build.js — the Whack-a-Mole workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.66;

    let demo = null;
    let demoKind = 'grid';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'grid';
        if (demoKind === 'grid') { demo = {}; }
        else if (demoKind === 'speed') { demo = { level: 1 }; }
        else { demo = createGame(); }
    }

    /** updateDemo — the clock and the moles keep moving. */
    function updateDemo(elapsed) {
        if (demoKind === 'game' || demoKind === 'final') {
            updateGame(demo, elapsed);
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);
            const size = boardPixelSize();

            if (demoKind === 'grid') {
                clearCanvas(ctx, size, size, '#ffffff');
                ctx.textAlign = 'center';
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let column = 0; column < GRID_SIZE; column++) {
                        drawHole(ctx, column, row);
                        ctx.fillStyle = '#111111';
                        ctx.font = 'bold 34px monospace';
                        ctx.fillText(String(holeIndex(column, row)),
                                     holeCentreX(column), holeCentreY(row) - 12);
                    }
                }
                setNote('holeIndex(column, row) numbers every hole');

            } else if (demoKind === 'speed') {
                clearCanvas(ctx, size, size, '#ffffff');
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let column = 0; column < GRID_SIZE; column++) {
                        drawHole(ctx, column, row);
                    }
                }
                drawMole(ctx, 1, 1);
                ctx.textAlign = 'center';
                ctx.fillStyle = '#111111';
                ctx.font = 'bold 26px monospace';
                ctx.fillText('level ' + demo.level, size / 2, 40);
                setNote('moleInterval(' + demo.level + ') → ' + moleInterval(demo.level) + ' ms');

            } else {
                renderGame(ctx, demo);
                setNote('Score ' + demo.score + '  •  ' + demo.hits + ' hits  •  ' +
                        Math.ceil(demo.secondsLeft) + ' s left');
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

    /** sizeCanvas — the demo board is the real board, shrunk. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(boardPixelSize() * SCALE);
        canvas.height = Math.round(boardPixelSize() * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'grid') {
            addButton('↺ Redraw', 'Draw the holes again', function () { startDemo(step); });
            return;
        }
        if (kind === 'speed') {
            addButton('Level −', 'An easier level', function () { demo.level = Math.max(1, demo.level - 1); });
            addButton('Level +', 'A harder level', function () { demo.level = demo.level + 1; });
            return;
        }

        addButton('←', 'Aim left', function () { moveCursor(demo, -1, 0); });
        addButton('→', 'Aim right', function () { moveCursor(demo, 1, 0); });
        addButton('↑', 'Aim up', function () { moveCursor(demo, 0, -1); });
        addButton('↓', 'Aim down', function () { moveCursor(demo, 0, 1); });
        addButton('Whack!', 'Swing the hammer', function () {
            whack(demo, holeIndex(demo.cursor.column, demo.cursor.row));
        });
        addButton('↺ New', 'Start again', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'whack') { whack(demo, holeIndex(demo.cursor.column, demo.cursor.row)); }
        else if (action === 'left') { moveCursor(demo, -1, 0); }
        else if (action === 'right') { moveCursor(demo, 1, 0); }
        else if (action === 'up') { moveCursor(demo, 0, -1); }
        else if (action === 'down') { moveCursor(demo, 0, 1); }
    }

    startWorkshop({
        storagePrefix: 'whack-build',
        steps: WHACK_STEPS,
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
