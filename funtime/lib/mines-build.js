/* ============================================================
   mines-build.js — the Minesweeper workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.74;

    let demo = null;
    let demoKind = 'grid';

    /** openBoard — a board with the mines laid and every square uncovered. */
    function openBoard() {
        const state = createGame();
        placeMines(state, 4, 4);
        state.revealed = state.revealed.map(function () { return true; });
        return state;
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'grid';

        if (demoKind === 'grid' || demoKind === 'count') {
            demo = openBoard();
            demo.cursor = { column: 4, row: 4 };
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

            const cursor = demo.cursor;

            if (demoKind === 'grid') {
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 3;
                neighbours(cursor.column, cursor.row).forEach(function (cell) {
                    ctx.strokeRect(cellLeft(cell.column) + 3, cellTop(cell.row) + 3,
                                   CELL - 6, CELL - 6);
                });
                drawCursor(ctx, cursor);
                setNote('(' + cursor.column + ', ' + cursor.row + ') has ' +
                        neighbours(cursor.column, cursor.row).length + ' neighbours');

            } else if (demoKind === 'count') {
                drawCursor(ctx, cursor);
                if (demo.mines[cellIndex(cursor.column, cursor.row)]) {
                    setNote('(' + cursor.column + ', ' + cursor.row + ') IS a mine');
                } else {
                    setNote('countMines(' + cursor.column + ', ' + cursor.row + ') → ' +
                            countMines(demo, cursor.column, cursor.row));
                }

            } else {
                const how = demo.isWon ? 'won' : (demo.isOver ? 'lost' : 'playing');
                setNote(revealedCount(demo) + ' opened  •  ' + minesLeft(demo) +
                        ' mines left  •  ' + how);
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

    /** sizeCanvas — every demo uses the same shrunken board. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(boardPixelSize() * SCALE);
        canvas.height = Math.round(boardPixelSize() * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        addButton('←', 'Look left', function () { moveCursor(demo, -1, 0); });
        addButton('→', 'Look right', function () { moveCursor(demo, 1, 0); });
        addButton('↑', 'Look up', function () { moveCursor(demo, 0, -1); });
        addButton('↓', 'Look down', function () { moveCursor(demo, 0, 1); });

        if (kind !== 'grid' && kind !== 'count') {
            addButton('Dig!', 'Uncover this square', function () {
                revealCell(demo, demo.cursor.column, demo.cursor.row);
            });
            addButton('⚑ Flag', 'Plant or lift a flag', function () {
                toggleFlag(demo, demo.cursor.column, demo.cursor.row);
            });
        }
        addButton('↺ New', 'Lay the mines again', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'pause') { togglePause(demo); }
        else if (action === 'dig') { revealCell(demo, demo.cursor.column, demo.cursor.row); }
        else if (action === 'flag') { toggleFlag(demo, demo.cursor.column, demo.cursor.row); }
        else if (action === 'up') { moveCursor(demo, 0, -1); }
        else if (action === 'down') { moveCursor(demo, 0, 1); }
        else if (action === 'left') { moveCursor(demo, -1, 0); }
        else if (action === 'right') { moveCursor(demo, 1, 0); }
    }

    startWorkshop({
        storagePrefix: 'mines-build',
        steps: MINES_STEPS,
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
