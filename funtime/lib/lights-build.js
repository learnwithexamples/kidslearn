/* ============================================================
   lights-build.js — the Lights Out workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.62;

    let demo = null;
    let demoKind = 'grid';
    let demoFlags = {};

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'grid';
        demoFlags = (step.demo && step.demo.flags) || {};

        if (demoKind === 'grid') {
            demo = {};
        } else if (demoKind === 'cross') {
            demo = { column: 2, row: 2 };
        } else {
            demo = createGame();
        }
    }

    /** updateDemo — nothing in this game moves on its own. */
    function updateDemo() { }

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
                        const x = cellLeft(column);
                        const y = cellTop(row);
                        ctx.strokeStyle = '#111111';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
                        ctx.fillStyle = '#111111';
                        ctx.font = 'bold 24px monospace';
                        ctx.fillText(String(lightIndex(column, row)),
                                     x + CELL_SIZE / 2, y + CELL_SIZE / 2 + 8);
                    }
                }
                setNote('lightIndex(column, row) numbers every square');

            } else if (demoKind === 'cross') {
                const dark = [];
                for (let i = 0; i < LIGHT_COUNT; i++) { dark.push(false); }
                const lights = pressLight(dark, demo.column, demo.row);
                clearCanvas(ctx, size, size, '#ffffff');
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let column = 0; column < GRID_SIZE; column++) {
                        drawLight(ctx, lights[lightIndex(column, row)], column, row);
                    }
                }
                drawCursor(ctx, { column: demo.column, row: demo.row });
                setNote('pressing (' + demo.column + ', ' + demo.row + ') flips ' +
                        countLightsOn(lights) + ' lights');

            } else {
                renderGame(ctx, demo);
                setNote(countLightsOn(demo.lights) + ' lights on  •  ' + demo.moves + ' presses');
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
            addButton('↺ Redraw', 'Draw the grid again', function () { startDemo(step); });
            return;
        }
        if (kind === 'cross') {
            const move = function (dx, dy) {
                if (isOnBoard(demo.column + dx, demo.row + dy)) {
                    demo.column += dx;
                    demo.row += dy;
                }
            };
            addButton('←', 'Move left', function () { move(-1, 0); });
            addButton('→', 'Move right', function () { move(1, 0); });
            addButton('↑', 'Move up', function () { move(0, -1); });
            addButton('↓', 'Move down', function () { move(0, 1); });
            return;
        }

        addButton('←', 'Cursor left', function () { moveCursor(demo, -1, 0); });
        addButton('→', 'Cursor right', function () { moveCursor(demo, 1, 0); });
        addButton('↑', 'Cursor up', function () { moveCursor(demo, 0, -1); });
        addButton('↓', 'Cursor down', function () { moveCursor(demo, 0, 1); });
        addButton('Press', 'Press this square', function () {
            pressSquare(demo, demo.cursor.column, demo.cursor.row);
        });
        addButton('↺ New', 'Scramble again', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'press') { pressSquare(demo, demo.cursor.column, demo.cursor.row); }
        else if (action === 'left') { moveCursor(demo, -1, 0); }
        else if (action === 'right') { moveCursor(demo, 1, 0); }
        else if (action === 'up') { moveCursor(demo, 0, -1); }
        else if (action === 'down') { moveCursor(demo, 0, 1); }
    }

    startWorkshop({
        storagePrefix: 'lights-build',
        steps: LIGHTS_STEPS,
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
