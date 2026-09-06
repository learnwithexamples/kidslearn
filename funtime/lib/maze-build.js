/* ============================================================
   maze-build.js — the Maze Runner workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.72;

    let demo = null;
    let demoKind = 'rock';

    /** blankState — the extra fields renderGame expects, around a bare maze. */
    function blankState(maze) {
        return {
            maze: maze, player: { x: 1, y: 1 }, hint: [],
            steps: 0, shortest: 0, seconds: 0, solved: 0, hintsUsed: 0,
            isSolved: false, isPaused: false
        };
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'rock';

        if (demoKind === 'rock') {
            demo = blankState(solidMaze());
            demo.look = { x: 3, y: 3 };
            /* dig one small room so there is something to look at */
            [[1, 1], [2, 1], [3, 1], [3, 2], [3, 3]].forEach(function (square) {
                demo.maze[mazeIndex(square[0], square[1])] = false;
            });
        } else if (demoKind === 'carve') {
            demo = blankState(carveMaze());
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

            if (demoKind === 'rock') {
                const look = demo.look;
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 3]);
                ctx.strokeRect(cellLeft(look.x) - 1, cellTop(look.y) - 1, CELL + 2, CELL + 2);
                ctx.setLineDash([]);
                setNote('isWall(' + look.x + ', ' + look.y + ') → ' +
                        isWall(demo.maze, look.x, look.y));

            } else if (demoKind === 'carve') {
                let open = 0;
                for (let i = 0; i < demo.maze.length; i++) {
                    if (!demo.maze[i]) { open = open + 1; }
                }
                setNote('a fresh maze: ' + open + ' open squares, shortest way out ' +
                        shortestFromStart(demo.maze) + ' steps');

            } else {
                setNote(demo.steps + ' steps  •  best possible ' + demo.shortest +
                        '  •  ' + demo.hintsUsed + ' hint(s)' + (demo.isSolved ? '  OUT!' : ''));
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

    /** sizeCanvas — every demo uses the same shrunken maze. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(boardPixelWidth() * SCALE);
        canvas.height = Math.round(boardPixelHeight() * SCALE);
    }

    /** lookAround — move the dashed inspection box. */
    function lookAround(dx, dy) {
        demo.look.x = Math.max(0, Math.min(MAZE_WIDTH - 1, demo.look.x + dx));
        demo.look.y = Math.max(0, Math.min(MAZE_HEIGHT - 1, demo.look.y + dy));
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'rock') {
            addButton('←', 'Look left', function () { lookAround(-1, 0); });
            addButton('→', 'Look right', function () { lookAround(1, 0); });
            addButton('↑', 'Look up', function () { lookAround(0, -1); });
            addButton('↓', 'Look down', function () { lookAround(0, 1); });
            return;
        }
        if (kind === 'carve') {
            addButton('↺ Dig a new one', 'Carve a fresh maze', function () { startDemo(step); });
            return;
        }

        addButton('↑', 'Walk up', function () { movePlayer(demo, 0, -1); });
        addButton('↓', 'Walk down', function () { movePlayer(demo, 0, 1); });
        addButton('←', 'Walk left', function () { movePlayer(demo, -1, 0); });
        addButton('→', 'Walk right', function () { movePlayer(demo, 1, 0); });
        addButton('? Hint', 'Show the shortest way', function () { showHint(demo); });
        addButton('↺ New', 'Dig a new maze', function () { newMaze(demo); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'up') { movePlayer(demo, 0, -1); }
        else if (action === 'down') { movePlayer(demo, 0, 1); }
        else if (action === 'left') { movePlayer(demo, -1, 0); }
        else if (action === 'right') { movePlayer(demo, 1, 0); }
        else if (action === 'hint') { showHint(demo); }
        else if (action === 'new') { newMaze(demo); }
        else if (action === 'pause') { togglePause(demo); }
    }

    startWorkshop({
        storagePrefix: 'maze-build',
        steps: MAZE_STEPS,
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
