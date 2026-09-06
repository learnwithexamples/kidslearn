/* ============================================================
   sokoban-build.js — the Sokoban workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.62;

    let demo = null;
    let demoKind = 'walls';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'walls';

        demo = createGame();
        if (demoKind === 'walls' || demoKind === 'boxes') {
            loadLevel(demo, 3);            /* the level with a wall in the way */
            demo.look = { x: 4, y: 2 };
        } else if (demoKind === 'push') {
            loadLevel(demo, 2);
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);
            renderGame(ctx, demo);

            if (demoKind === 'walls' || demoKind === 'boxes') {
                const look = demo.look;
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 4]);
                ctx.strokeRect(cellLeft(look.x) + 2, cellTop(look.y) + 2, CELL - 4, CELL - 4);
                ctx.setLineDash([]);
                if (demoKind === 'walls') {
                    setNote('isWall(' + look.x + ', ' + look.y + ') → ' + isWall(demo, look.x, look.y));
                } else {
                    setNote('boxAt(' + look.x + ', ' + look.y + ') → ' + boxAt(demo, look.x, look.y));
                }
            } else {
                setNote('level ' + (demo.level + 1) + '  •  ' + demo.moves + ' moves  •  ' +
                        boxesOnGoals(demo) + ' of ' + demo.boxes.length + ' boxes home' +
                        (demo.isSolved ? '  SOLVED!' : ''));
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

    /** sizeCanvas — every demo uses the same shrunken level. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(boardPixelWidth() * SCALE);
        canvas.height = Math.round(boardPixelHeight() * SCALE);
    }

    /** lookAround — move the dashed inspection box. */
    function lookAround(dx, dy) {
        demo.look.x = Math.max(0, Math.min(LEVEL_WIDTH - 1, demo.look.x + dx));
        demo.look.y = Math.max(0, Math.min(LEVEL_HEIGHT - 1, demo.look.y + dy));
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'walls' || kind === 'boxes') {
            addButton('←', 'Look left', function () { lookAround(-1, 0); });
            addButton('→', 'Look right', function () { lookAround(1, 0); });
            addButton('↑', 'Look up', function () { lookAround(0, -1); });
            addButton('↓', 'Look down', function () { lookAround(0, 1); });
            return;
        }

        addButton('↑', 'Walk up', function () { movePlayer(demo, 0, -1); });
        addButton('↓', 'Walk down', function () { movePlayer(demo, 0, 1); });
        addButton('←', 'Walk left', function () { movePlayer(demo, -1, 0); });
        addButton('→', 'Walk right', function () { movePlayer(demo, 1, 0); });
        addButton('↶ Undo', 'Step back in time', function () { undoMove(demo); });
        addButton('↺ Reset', 'Start the level again', function () { resetLevel(demo); });
        addButton('➜ Next', 'The next level', function () { nextLevel(demo); });
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
        else if (action === 'undo') { undoMove(demo); }
        else if (action === 'reset') { resetLevel(demo); }
        else if (action === 'next') { nextLevel(demo); }
        else if (action === 'pause') { togglePause(demo); }
    }

    startWorkshop({
        storagePrefix: 'sokoban-build',
        steps: SOKOBAN_STEPS,
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
