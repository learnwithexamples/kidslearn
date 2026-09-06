/* ============================================================
   tictactoe-build.js — the Tic-Tac-Toe workshop's demos
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
        else if (demoKind === 'lines') { demo = { line: 0 }; }
        else { demo = createGame(); }
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
                drawGridLines(ctx);
                ctx.textAlign = 'center';
                ctx.fillStyle = '#111111';
                ctx.font = 'bold 40px monospace';
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let column = 0; column < GRID_SIZE; column++) {
                        ctx.fillText(String(squareIndex(column, row)),
                                     cellLeft(column) + CELL_SIZE / 2,
                                     cellTop(row) + CELL_SIZE / 2 + 14);
                    }
                }
                setNote('squareIndex(column, row) numbers every square');

            } else if (demoKind === 'lines') {
                const line = WINNING_LINES[demo.line % WINNING_LINES.length];
                const board = new Array(SQUARE_COUNT).fill(EMPTY);
                line.forEach(function (index) { board[index] = PLAYER; });
                clearCanvas(ctx, size, size, '#ffffff');
                drawGridLines(ctx);
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let column = 0; column < GRID_SIZE; column++) {
                        drawMark(ctx, board[squareIndex(column, row)], column, row);
                    }
                }
                drawWinningLine(ctx, line);
                setNote('winningLine(board) → ' + JSON.stringify(winningLine(board)));

            } else {
                renderGame(ctx, demo);
                setNote(demo.isOver ? ('winner: ' + demo.winner)
                    : ('your turn — ' + emptySquares(demo.board).length + ' squares free'));
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
        if (kind === 'lines') {
            addButton('Next line', 'Show the next winning line', function () { demo.line += 1; });
            return;
        }
        addButton('←', 'Cursor left', function () { moveCursor(demo, -1, 0); });
        addButton('→', 'Cursor right', function () { moveCursor(demo, 1, 0); });
        addButton('↑', 'Cursor up', function () { moveCursor(demo, 0, -1); });
        addButton('↓', 'Cursor down', function () { moveCursor(demo, 0, 1); });
        addButton('Play', 'Play here', function () {
            playSquare(demo, squareIndex(demo.cursor.column, demo.cursor.row));
        });
        addButton('↺ New', 'Clear the board', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'play') { playSquare(demo, squareIndex(demo.cursor.column, demo.cursor.row)); }
        else if (action === 'left') { moveCursor(demo, -1, 0); }
        else if (action === 'right') { moveCursor(demo, 1, 0); }
        else if (action === 'up') { moveCursor(demo, 0, -1); }
        else if (action === 'down') { moveCursor(demo, 0, 1); }
    }

    startWorkshop({
        storagePrefix: 'tictactoe-build',
        steps: TICTACTOE_STEPS,
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
