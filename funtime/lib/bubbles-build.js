/* ============================================================
   bubbles-build.js — the Bubble Shooter workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.62;

    let demo = null;
    let demoKind = 'grid';

    /**
     * practiceState — a hand-made board.
     * ALGORITHM: a group of three at the top left to pop, and a cluster on the
     *            right hanging from the ceiling by a single bubble — cut that
     *            one and the whole cluster should fall.
     */
    function practiceState() {
        const state = createGame();
        state.grid = state.grid.map(function () { return EMPTY; });

        [1, 2, 3].forEach(function (column) {
            state.grid[bubbleIndex(column, 0)] = 0;
        });
        state.grid[bubbleIndex(6, 0)] = 1;
        state.grid[bubbleIndex(6, 1)] = 2;
        [5, 6, 7].forEach(function (column) {
            state.grid[bubbleIndex(column, 2)] = 2;
        });
        state.look = { column: 2, row: 0 };
        return state;
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'grid';

        if (demoKind === 'grid' || demoKind === 'group' || demoKind === 'drop') {
            demo = practiceState();
        } else {
            demo = createGame();
        }
    }

    /** updateDemo — let the demo's clock tick. */
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
            renderGame(ctx, demo);

            if (demoKind === 'grid' || demoKind === 'group') {
                const look = demo.look;
                const centre = bubbleCentre(look.column, look.row);
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 3]);
                ctx.strokeRect(centre.x - CELL / 2, centre.y - CELL / 2, CELL, CELL);
                ctx.setLineDash([]);

                if (demoKind === 'grid') {
                    setNote('bubbleCentre(' + look.column + ', ' + look.row + ') → x ' +
                            Math.round(centre.x) + ', y ' + Math.round(centre.y));
                } else {
                    const group = sameGroup(demo.grid, look.column, look.row);
                    group.forEach(function (cell) {
                        const spot = bubbleCentre(cell.column, cell.row);
                        ctx.strokeRect(spot.x - CELL / 2 + 2, spot.y - CELL / 2 + 2,
                                       CELL - 4, CELL - 4);
                    });
                    setNote('sameGroup → ' + group.length + ' joined  (' +
                            (group.length >= MIN_POP ? 'POP!' : 'not enough') + ')');
                }

            } else if (demoKind === 'drop') {
                setNote(bubblesLeft(demo) + ' bubble(s) up there  •  score ' + demo.score);

            } else {
                setNote('score ' + demo.score + '  •  ' + demo.popped + ' popped  •  ' +
                        demo.dropped + ' dropped  •  ' + demo.shots + ' shots');
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

    /** lookAround — move the dashed inspection box. */
    function lookAround(dColumn, dRow) {
        demo.look.column = Math.max(0, Math.min(COLUMNS - 1, demo.look.column + dColumn));
        demo.look.row = Math.max(0, Math.min(ROWS - 1, demo.look.row + dRow));
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'grid' || kind === 'group') {
            addButton('←', 'Look left', function () { lookAround(-1, 0); });
            addButton('→', 'Look right', function () { lookAround(1, 0); });
            addButton('↑', 'Look up', function () { lookAround(0, -1); });
            addButton('↓', 'Look down', function () { lookAround(0, 1); });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }
        if (kind === 'drop') {
            addButton('Pop the group', 'Burst the three at the top left', function () {
                popGroup(demo, sameGroup(demo.grid, 2, 0));
            });
            addButton('Cut the thread', 'Remove the bubble holding the cluster', function () {
                demo.grid[bubbleIndex(6, 1)] = EMPTY;
            });
            addButton('Let them fall', 'Drop anything dangling', function () {
                dropFloaters(demo);
            });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }

        addButton('←', 'Aim left', function () { demo.turning = -1; });
        addButton('Stop', 'Stop aiming', function () { demo.turning = 0; });
        addButton('→', 'Aim right', function () { demo.turning = 1; });
        addButton('SHOOT', 'Fire the bubble', function () { shootBubble(demo); });
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
        else if (action === 'shoot') { shootBubble(demo); }
    }

    startWorkshop({
        storagePrefix: 'bubbles-build',
        steps: BUBBLES_STEPS,
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
