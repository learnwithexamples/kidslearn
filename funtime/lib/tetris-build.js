/* ============================================================
   tetris-build.js — the Tetris workshop

   This file holds only the things that are special to Tetris: the little
   demos that grow beside the editor, and the list of buttons each one needs.
   Everything else — the steps, the editor, the tests, the progress dots — is
   handled by workshop.js, which the Snake workshop uses too.
   ============================================================ */

(function () {
    'use strict';


    const DEMO_CELL = 20;

    let demo = null;            /* the little game running in the demo panel */
    let demoFlags = {};
    let demoKind = 'board';
    let demoTimer = 0;
    let demoMessage = '';
    let spinType = 'T';
    let spinPiece = null;

    /**
     * makeSampleBoard — a 10 x 20 field with a realistic pile at the bottom,
     * where exactly two rows are complete.
     *
     * INPUT:  none
     * OUTPUT: a board
     *
     * ALGORITHM: fill the bottom six rows with random blocks, always leaving at
     *            least one gap — except in two rows, which are filled right
     *            across so there is something for your function to find.
     */
    function makeSampleBoard() {
        const board = createEmptyBoard(10, 20);
        const pile = 6;
        const fullRowA = 1 + Math.floor(Math.random() * 2);
        const fullRowB = 4;
        for (let i = 0; i < pile; i++) {
            const y = 20 - pile + i;
            const isFull = (i === fullRowA || i === fullRowB);
            for (let x = 0; x < 10; x++) {
                board[y][x] = (isFull || Math.random() < 0.8) ? 1 : 0;
            }
            if (!isFull) {
                board[y][Math.floor(Math.random() * 10)] = 0;
            }
        }
        return board;
    }

    /**
     * startDemo — build whatever the current step wants to show.
     * INPUT: step. OUTPUT: nothing.
     */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'board';
        demoFlags = (step.demo && step.demo.flags) || {};
        demoMessage = '';
        demoTimer = 0;

        if (demoKind === 'spin') {
            spinType = 'T';
            spinPiece = createPiece(spinType);
        } else if (demoKind === 'rows') {
            demo = { board: makeSampleBoard() };
        } else if (demoKind === 'final') {
            demo = createGame();
            demo.isPaused = true;
        } else if (demoKind === 'game') {
            demo = {
                board: createEmptyBoard(10, 20),
                piece: null,
                score: 0,
                lines: 0,
                level: 1
            };
            demoSpawn();
        }
    }

    /** demoSpawn — put a new random piece at the top of the demo board. */
    function demoSpawn() {
        const piece = createPiece(randomShapeType());
        piece.x = Math.floor((10 - piece.cells.length) / 2);
        piece.y = 0;
        if (!canPlacePiece(demo.board, piece)) {
            demo.board = createEmptyBoard(10, 20);
            demoMessage = 'The pile reached the top — starting again!';
        }
        demo.piece = piece;
    }

    /** demoMove — slide the demo piece, locking it if it cannot fall. */
    function demoMove(dx, dy) {
        if (!demo || !demo.piece) { return; }
        const moved = movePiece(demo.piece, dx, dy);
        if (canPlacePiece(demo.board, moved)) {
            demo.piece = moved;
        } else if (dy > 0 && demoFlags.lock) {
            demoLock();
        }
    }

    /** demoRotate — turn the demo piece, nudging it away from walls. */
    function demoRotate() {
        if (!demo || !demo.piece) { return; }
        const turned = rotatePiece(demo.piece, true);
        const kicks = [0, -1, 1, -2, 2];
        for (let i = 0; i < kicks.length; i++) {
            const candidate = movePiece(turned, kicks[i], 0);
            if (canPlacePiece(demo.board, candidate)) {
                demo.piece = candidate;
                return;
            }
        }
    }

    /** demoLock — stamp the piece down, clear rows, score, and spawn the next. */
    function demoLock() {
        demo.board = mergePieceIntoBoard(demo.board, demo.piece);

        if (demoFlags.clear) {
            const full = findFullRows(demo.board);
            if (full.length > 0) {
                demo.board = removeRows(demo.board, full);
                demo.lines = demo.lines + full.length;
                if (demoFlags.hud) {
                    demo.score = demo.score + scoreForLines(full.length, demo.level);
                    demo.level = levelForLines(demo.lines);
                }
                demoMessage = 'Cleared ' + full.length + ' row' + (full.length === 1 ? '' : 's') + '!';
            }
        }
        demoSpawn();
    }

    /** demoHardDrop — slam the demo piece to the bottom. */
    function demoHardDrop() {
        if (!demo || !demo.piece) { return; }
        demo.piece = movePiece(demo.piece, 0, dropDistance(demo.board, demo.piece));
        if (demoFlags.lock) {
            demoLock();
        }
    }

    /**
     * updateDemo — let the demo's clock tick.
     * INPUT: elapsed — milliseconds since the last frame. OUTPUT: nothing.
     */
    function updateDemo(elapsed) {
        if (demoKind === 'final') {
            updateGame(demo, elapsed);
            return;
        }
        if (demoKind !== 'game' || !demoFlags.gravity) { return; }

        let interval = 550;
        if (demoFlags.hud) {
            interval = dropIntervalForLevel(demo.level);
        }
        demoTimer = demoTimer + elapsed;
        while (demoTimer >= interval) {
            demoTimer = demoTimer - interval;
            demoMove(0, 1);
        }
    }

    /**
     * drawMatrix — draw one piece matrix in the middle of a canvas.
     * INPUT: ctx, matrix, cellSize, width, height. OUTPUT: nothing.
     */
    function drawMatrix(ctx, matrix, cellSize, width, height) {
        const size = matrix.length;
        ctx.save();
        ctx.translate((width - size * cellSize) / 2, (height - size * cellSize) / 2);
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (matrix[r][c] === 1) {
                    drawBlock(ctx, c, r, cellSize);
                }
            }
        }
        ctx.restore();
    }

    /**
     * drawInvertedRow — paint one row "highlighted" (black stripe, white blocks).
     * INPUT: ctx, rowNumber, columns, cellSize. OUTPUT: nothing.
     */
    function drawInvertedRow(ctx, rowNumber, columns, cellSize) {
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, rowNumber * cellSize, columns * cellSize, cellSize);
        ctx.fillStyle = '#ffffff';
        for (let c = 0; c < columns; c++) {
            ctx.fillRect(c * cellSize + 4, rowNumber * cellSize + 4, cellSize - 8, cellSize - 8);
        }
    }

    /**
     * drawDemo — draw the current demo onto the canvas.
     * INPUT: ctx, canvas. OUTPUT: nothing.
     */
    function drawDemo(ctx, canvas, setNote) {
        const width = canvas.width;
        const height = canvas.height;

        try {
            if (demoKind === 'board') {
                const board = createEmptyBoard(10, 20);
                if (!Array.isArray(board) || !Array.isArray(board[0])) {
                    throw new Error('createEmptyBoard did not return a grid yet');
                }
                clearCanvas(ctx, width, height, '#ffffff');
                drawGrid(ctx, board[0].length, board.length, DEMO_CELL);
                drawBoardBlocks(ctx, board, DEMO_CELL);
                drawFrame(ctx, board[0].length * DEMO_CELL, board.length * DEMO_CELL);
                setNote(board.length + ' rows x ' + board[0].length + ' columns, all empty.');
                return;
            }

            if (demoKind === 'rows') {
                const board = demo.board;
                const full = findFullRows(board);
                clearCanvas(ctx, width, height, '#ffffff');
                drawGrid(ctx, 10, 20, DEMO_CELL);
                drawBoardBlocks(ctx, board, DEMO_CELL);
                for (let i = 0; i < full.length; i++) {
                    drawInvertedRow(ctx, full[i], 10, DEMO_CELL);
                }
                drawFrame(ctx, 10 * DEMO_CELL, 20 * DEMO_CELL);
                setNote(full.length === 0
                    ? 'No complete rows found yet.'
                    : 'Complete rows: ' + JSON.stringify(full));
                return;
            }

            if (demoKind === 'spin') {
                clearCanvas(ctx, width, height, '#ffffff');
                drawMatrix(ctx, spinPiece.cells, 34, width, height);
                drawFrame(ctx, width, height);
                setNote('Piece ' + spinType + ' — press ↻ to turn it.');
                return;
            }

            if (demoKind === 'final') {
                renderGame(ctx, demo, DEMO_CELL);
                setNote('Score ' + demo.score + '  •  Lines ' + demo.lines + '  •  Level ' + demo.level);
                return;
            }

            /* the growing mini-game */
            clearCanvas(ctx, width, height, '#ffffff');
            drawGrid(ctx, 10, 20, DEMO_CELL);
            drawBoardBlocks(ctx, demo.board, DEMO_CELL);
            if (demo.piece) {
                if (demoFlags.ghost) {
                    drawGhost(ctx, movePiece(demo.piece, 0, dropDistance(demo.board, demo.piece)), DEMO_CELL);
                }
                drawPiece(ctx, demo.piece, DEMO_CELL);
            }
            drawFrame(ctx, 10 * DEMO_CELL, 20 * DEMO_CELL);

            let note = demoMessage;
            if (demoFlags.hud) {
                note = 'Score ' + demo.score + '  •  Lines ' + demo.lines + '  •  Level ' + demo.level +
                       (demoMessage ? '  •  ' + demoMessage : '');
            }
            setNote(note || 'Use the buttons under the board.');
        } catch (e) {
            clearCanvas(ctx, width, height, '#ffffff');
            ctx.fillStyle = '#111111';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Waiting for working code…', width / 2, height / 2 - 10);
            ctx.font = '11px monospace';
            ctx.fillText(String(e.message).slice(0, 40), width / 2, height / 2 + 12);
            setNote('The demo stopped: ' + e.message);
        }
    }


    /** sizeCanvasForStep — square canvas for the spinning piece, tall for boards. */
    function sizeCanvas(step, canvas) {
        if (step.demo.kind === 'spin') {
            canvas.width = 200;
            canvas.height = 200;
        } else {
            canvas.width = 10 * DEMO_CELL;
            canvas.height = 20 * DEMO_CELL;
        }
    }


    /**
     * controls — the buttons under the demo, chosen by the step.
     * INPUT: step, and addButton(label, title, onClick) from the workshop.
     * OUTPUT: nothing; it adds the buttons this demo needs.
     */
    function controls(step, addButton) {
        const kind = step.demo.kind;
        const flags = step.demo.flags || {};

        if (kind === 'spin') {
            addButton('↻ Turn', 'Rotate clockwise', function () {
                spinPiece = rotatePiece(spinPiece, true);
            });
            addButton('🎲 Next piece', 'Try another shape', function () {
                spinType = randomShapeType();
                spinPiece = createPiece(spinType);
            });
            return;
        }

        if (kind === 'rows') {
            addButton('🎲 New pile', 'Build a different pile of blocks', function () {
                demo = { board: makeSampleBoard() };
            });
            return;
        }

        if (kind === 'game') {
            addButton('←', 'Move left', function () { demoMove(-1, 0); });
            addButton('↻', 'Rotate', function () { demoRotate(); });
            addButton('→', 'Move right', function () { demoMove(1, 0); });
            addButton('↓', 'Down one row', function () { demoMove(0, 1); });
            if (flags.hardDrop) {
                addButton('⇓ Drop', 'Slam it down', function () { demoHardDrop(); });
            }
            if (flags.levelPicker) {
                addButton('Level −', 'Slower', function () {
                    demo.level = Math.max(1, demo.level - 1);
                });
                addButton('Level +', 'Faster', function () {
                    demo.level = Math.min(20, demo.level + 1);
                });
            }
            addButton('↺', 'Clear the demo board', function () { startDemo(step); });
            return;
        }

        if (kind === 'final') {
            addButton('▶ / ⏸', 'Start or pause', function () { togglePause(demo); });
            addButton('↺ New game', 'Start again', function () {
                demo = createGame();
                demo.isPaused = false;
            });
        }
    }


    /**
     * onKey — only the last step plays with the keyboard.
     * INPUT: step, event (a keydown). OUTPUT: nothing.
     */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }

        const action = actionForKey(event.key);
        if (action === null) { return; }
        event.preventDefault();

        if (action === 'left') { tryMove(demo, -1, 0); }
        else if (action === 'right') { tryMove(demo, 1, 0); }
        else if (action === 'softDrop') { softDrop(demo); }
        else if (action === 'rotateRight') { tryRotate(demo, true); }
        else if (action === 'rotateLeft') { tryRotate(demo, false); }
        else if (action === 'hardDrop') { hardDrop(demo); }
        else if (action === 'pause') { togglePause(demo); }
        else if (action === 'restart') { demo = createGame(); demo.isPaused = false; }
    }


    /* Hand the demo over to the shared workshop engine. */
    startWorkshop({
        storagePrefix: 'tetris-build',
        steps: TETRIS_STEPS,
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
