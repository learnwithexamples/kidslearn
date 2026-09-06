/* ============================================================
   match3-build.js — the Match Three workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.72;

    let demo = null;
    let demoKind = 'shapes';

    /** practiceBoard — a hand-made board with one obvious swap waiting in it. */
    function practiceBoard() {
        const board = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let column = 0; column < GRID_SIZE; column++) {
                board.push((column * 2 + row * 3) % SHAPE_COUNT);
            }
        }
        board[gemIndex(1, 4)] = 0;
        board[gemIndex(2, 4)] = 0;
        board[gemIndex(4, 4)] = 1;
        board[gemIndex(3, 5)] = 0;
        return board;
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'shapes';

        demo = createGame();
        if (demoKind === 'shapes' || demoKind === 'matches') {
            demo.board = practiceBoard();
            demo.cursor = { column: 3, row: 4 };
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);
            renderGame(ctx, demo);

            if (demoKind === 'matches') {
                const found = findMatches(demo.board);
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 3;
                found.forEach(function (index) {
                    const column = index % GRID_SIZE;
                    const row = Math.floor(index / GRID_SIZE);
                    ctx.strokeRect(cellLeft(column) + 2, cellTop(row) + 2, CELL - 4, CELL - 4);
                });
                setNote('findMatches → ' + found.length + ' shape(s) in a line');

            } else if (demoKind === 'shapes') {
                const cursor = demo.cursor;
                const right = { column: cursor.column + 1, row: cursor.row };
                setNote('cursor (' + cursor.column + ', ' + cursor.row +
                        ') and the square to its right are neighbours: ' +
                        areNeighbours(cursor, right));

            } else {
                setNote('score ' + demo.score + '  •  ' + demo.moves + ' moves  •  best chain ' +
                        demo.bestChain + '  •  ' + demo.cleared + ' shapes cleared');
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

        addButton('←', 'Move left', function () { moveCursor(demo, -1, 0); });
        addButton('→', 'Move right', function () { moveCursor(demo, 1, 0); });
        addButton('↑', 'Move up', function () { moveCursor(demo, 0, -1); });
        addButton('↓', 'Move down', function () { moveCursor(demo, 0, 1); });

        if (kind === 'shapes') {
            addButton('Swap right', 'Swap with the square to the right', function () {
                const here = demo.cursor;
                const right = { column: here.column + 1, row: here.row };
                if (isInsideBoard(right.column, right.row)) {
                    demo.board = swapGems(demo.board, here, right);
                }
            });
        } else if (kind === 'matches') {
            addButton('Make a row', 'Line three up in a row', function () {
                for (let column = 0; column < 3; column++) {
                    demo.board[gemIndex(column, demo.cursor.row)] = 4;
                }
            });
            addButton('Make a column', 'Line three up in a column', function () {
                for (let row = 0; row < 3; row++) {
                    demo.board[gemIndex(demo.cursor.column, row)] = 2;
                }
            });
            addButton('Let them fall', 'Clear and drop', function () {
                demo.board = settleBoard(demo, demo.board).board;
            });
        } else {
            addButton('Pick', 'Pick or swap', function () { pickSquare(demo, demo.cursor); });
            addButton('Shuffle', 'Deal a new board', function () { shuffleBoard(demo); });
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
        else if (action === 'pick') { pickSquare(demo, demo.cursor); }
        else if (action === 'shuffle') { shuffleBoard(demo); }
        else if (action === 'up') { moveCursor(demo, 0, -1); }
        else if (action === 'down') { moveCursor(demo, 0, 1); }
        else if (action === 'left') { moveCursor(demo, -1, 0); }
        else if (action === 'right') { moveCursor(demo, 1, 0); }
    }

    startWorkshop({
        storagePrefix: 'match3-build',
        steps: MATCH3_STEPS,
        demo: {
            sizeCanvas: sizeCanvas,
            start: startDemo,
            update: function () { return; },
            draw: function (step, ctx, canvas, setNote) { drawDemo(ctx, canvas, setNote); },
            controls: controls,
            onKey: onKey
        }
    });
})();
