/* ============================================================
   connect4-build.js — the Connect Four workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.6;

    let demo = null;
    let demoKind = 'grid';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'grid';

        if (demoKind === 'grid') {
            demo = {};
        } else if (demoKind === 'drop') {
            let board = new Array(CELL_COUNT).fill(EMPTY);
            [[0, 3], [1, 1], [3, 5], [5, 2]].forEach(function (pair) {
                for (let i = 0; i < pair[1]; i++) {
                    board = dropPiece(board, pair[0], COMPUTER);
                }
            });
            demo = { board: board, column: 3 };
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
            const width = boardPixelWidth();
            const height = boardPixelHeight();

            if (demoKind === 'grid') {
                clearCanvas(ctx, width, height, '#ffffff');
                ctx.textAlign = 'center';
                ctx.fillStyle = '#111111';
                ctx.font = 'bold 20px monospace';
                for (let row = 0; row < ROWS; row++) {
                    for (let column = 0; column < COLUMNS; column++) {
                        ctx.fillText(String(cellIndex(column, row)),
                                     holeCentreX(column), holeCentreY(row) + 7);
                    }
                }
                drawBoardFrame(ctx);
                setNote('cellIndex(column, row) numbers all 42 holes');

            } else if (demoKind === 'drop') {
                clearCanvas(ctx, width, height, '#ffffff');
                for (let row = 0; row < ROWS; row++) {
                    for (let column = 0; column < COLUMNS; column++) {
                        drawCounter(ctx, demo.board[cellIndex(column, row)],
                                    holeCentreX(column), holeCentreY(row), CELL_SIZE / 2 - 6);
                    }
                }
                drawBoardFrame(ctx);
                drawDropMarker(ctx, demo.column);
                const row = dropRow(demo.board, demo.column);
                setNote('dropRow(board, ' + demo.column + ') → ' + row + (row === -1 ? '  (full!)' : ''));

            } else {
                renderGame(ctx, demo);
                setNote(demo.isOver ? ('winner: ' + demo.winner)
                    : ('column ' + demo.cursor + ' — press Drop'));
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
        canvas.width = Math.round(boardPixelWidth() * SCALE);
        canvas.height = Math.round(boardPixelHeight() * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'grid') {
            addButton('↺ Redraw', 'Draw the grid again', function () { startDemo(step); });
            return;
        }
        if (kind === 'drop') {
            addButton('←', 'Aim left', function () { demo.column = Math.max(0, demo.column - 1); });
            addButton('→', 'Aim right', function () { demo.column = Math.min(COLUMNS - 1, demo.column + 1); });
            addButton('Fill it', 'Add a counter to this column', function () {
                demo.board = dropPiece(demo.board, demo.column, COMPUTER);
            });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }

        addButton('←', 'Aim left', function () { moveCursor(demo, -1); });
        addButton('→', 'Aim right', function () { moveCursor(demo, 1); });
        addButton('Drop', 'Drop a counter', function () { playColumn(demo, demo.cursor); });
        addButton('↺ New', 'Clear the board', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'drop') { playColumn(demo, demo.cursor); }
        else if (action === 'left') { moveCursor(demo, -1); }
        else if (action === 'right') { moveCursor(demo, 1); }
    }

    startWorkshop({
        storagePrefix: 'connect4-build',
        steps: CONNECT4_STEPS,
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
