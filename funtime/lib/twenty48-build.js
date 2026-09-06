/* ============================================================
   twenty48-build.js — the 2048 workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.62;

    let demo = null;
    let demoKind = 'row';

    /** practiceBoard — a board with a few known tiles, good for trying moves. */
    function practiceBoard() {
        const board = emptyBoard();
        [[0, 2], [1, 2], [2, 4], [5, 8], [7, 8], [9, 4], [12, 2]].forEach(function (pair) {
            board[pair[0]] = pair[1];
        });
        return board;
    }

    /** blankState — the extra fields renderGame expects. */
    function blankState(board) {
        return {
            board: board, score: 0, moves: 0,
            isWon: false, isOver: false, isPaused: false
        };
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'row';

        if (demoKind === 'row') {
            demo = blankState(practiceBoard());
            demo.row = [2, 0, 2, 4];
        } else if (demoKind === 'board') {
            demo = blankState(practiceBoard());
        } else {
            demo = createGame();
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);

            if (demoKind === 'row') {
                /* the practice row on top, then what slide and merge do to it */
                const board = emptyBoard();
                setRow(board, 0, demo.row);
                const slid = slideRow(demo.row);
                const merged = mergeRow(slid);
                setRow(board, 2, slid);
                setRow(board, 3, merged.row);
                renderGame(ctx, blankState(board));
                setNote('row [' + demo.row + ']  →  slide [' + slid + ']  →  merge [' +
                        merged.row + ']  (+' + merged.gained + ')');

            } else {
                renderGame(ctx, demo);
                if (demoKind === 'board') {
                    setNote('score ' + demo.score + '  •  ' + demo.moves + ' moves  •  ' +
                            emptyCells(demo.board).length + ' empty squares');
                } else {
                    setNote('score ' + demo.score + '  •  biggest tile ' +
                            biggestTile(demo.board) + '  •  ' + demo.moves + ' moves' +
                            (demo.isOver ? '  NO MOVES LEFT' : ''));
                }
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

        if (kind === 'row') {
            [['2,0,2,4', [2, 0, 2, 4]], ['2,2,2,2', [2, 2, 2, 2]],
             ['4,4,4,0', [4, 4, 4, 0]], ['0,0,0,2', [0, 0, 0, 2]]].forEach(function (pair) {
                addButton(pair[0], 'Try this row', function () { demo.row = pair[1]; });
            });
            return;
        }

        addButton('←', 'Slide left', function () { slideDemo('left'); });
        addButton('→', 'Slide right', function () { slideDemo('right'); });
        addButton('↑', 'Slide up', function () { slideDemo('up'); });
        addButton('↓', 'Slide down', function () { slideDemo('down'); });

        if (kind === 'board') {
            addButton('↻ Turn', 'Rotate the board', function () {
                demo.board = rotateBoard(demo.board);
            });
        }
        addButton('↺ New', 'Start again', function () { startDemo(step); });
    }

    /** slideDemo — make a move in whichever demo is showing. */
    function slideDemo(direction) {
        if (demoKind === 'board') {
            const moved = moveBoard(demo.board, direction);
            demo.board = moved.board;
            demo.score = demo.score + moved.gained;
            demo.moves = demo.moves + 1;
        } else {
            makeMove(demo, direction);
        }
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'pause') { togglePause(demo); }
        else { makeMove(demo, action); }
    }

    startWorkshop({
        storagePrefix: 'twenty48-build',
        steps: TWENTY48_STEPS,
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
