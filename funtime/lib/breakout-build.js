/* ============================================================
   breakout-build.js — the Breakout workshop's demos

   Only the things special to Breakout live here: the little practice fields
   that grow beside the editor, and the buttons each one needs. Everything
   else is handled by the shared workshop.js.
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.62;

    let demo = null;
    let demoKind = 'bricks';
    let demoFlags = {};
    let note = '';

    /** practiceBall — a ball for the demos with no whole game behind them. */
    function practiceBall() {
        return { x: FIELD_WIDTH / 2, y: 200, dx: 190, dy: -170 };
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'bricks';
        demoFlags = (step.demo && step.demo.flags) || {};
        note = '';

        if (demoKind === 'bricks') {
            demo = { column: 3, row: 2 };
        } else if (demoKind === 'hit') {
            demo = { ball: { x: 120, y: 200 } };
        } else if (demoKind === 'walls') {
            demo = { ball: practiceBall() };
        } else if (demoKind === 'paddle') {
            demo = { paddleX: (FIELD_WIDTH - PADDLE_WIDTH) / 2, steering: 0 };
        } else if (demoKind === 'mini') {
            demo = {
                paddleX: (FIELD_WIDTH - PADDLE_WIDTH) / 2,
                steering: 0,
                ball: practiceBall(),
                bounces: 0
            };
        } else {
            demo = createGame();
            demo.isPaused = false;
        }
    }

    /**
     * followBall — a robot hand for the demos.
     * INPUT: state. OUTPUT: nothing; it sets state.steering.
     * ALGORITHM: steer towards the ball unless the paddle is already under it.
     */
    function followBall(state) {
        const middle = state.paddleX + PADDLE_WIDTH / 2;
        if (Math.abs(state.ball.x - middle) < 8) {
            state.steering = 0;
        } else {
            state.steering = state.ball.x > middle ? 1 : -1;
        }
    }

    /** updateDemo — one frame of whichever practice field is showing. */
    function updateDemo(elapsed) {
        const seconds = elapsed / 1000;

        if (demoKind === 'walls') {
            demo.ball.x = demo.ball.x + demo.ball.dx * seconds;
            demo.ball.y = demo.ball.y + demo.ball.dy * seconds;
            bounceOffWalls(demo.ball);
            if (demo.ball.y > FIELD_HEIGHT - BALL_RADIUS) {
                demo.ball.y = FIELD_HEIGHT - BALL_RADIUS;
                demo.ball.dy = -Math.abs(demo.ball.dy);
            }

        } else if (demoKind === 'paddle') {
            movePaddle(demo, seconds);

        } else if (demoKind === 'mini') {
            if (demoFlags.robot) { followBall(demo); }
            movePaddle(demo, seconds);
            demo.ball.x = demo.ball.x + demo.ball.dx * seconds;
            demo.ball.y = demo.ball.y + demo.ball.dy * seconds;
            bounceOffWalls(demo.ball);
            if (bounceOffPaddle(demo)) { demo.bounces = demo.bounces + 1; }
            if (demo.ball.y > FIELD_HEIGHT + 40) { demo.ball = practiceBall(); }

        } else if (demoKind === 'game' || demoKind === 'final') {
            if (demoFlags.robot) { followBall(demo); }
            updateGame(demo, elapsed);
            if (demo.isOver) { demo = createGame(); demo.isPaused = false; }
        }
    }

    /** drawPracticeField — the empty box the practice demos happen in. */
    function drawPracticeField(ctx) {
        clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, '#ffffff');
        drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);

            if (demoKind === 'bricks') {
                drawPracticeField(ctx);
                for (let row = 0; row < BRICK_ROWS; row++) {
                    for (let column = 0; column < BRICK_COLUMNS; column++) {
                        drawBrick(ctx, column, row);
                    }
                }
                const rect = brickRect(demo.column, demo.row);
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 3;
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(rect.x - 4, rect.y - 4, rect.width + 8, rect.height + 8);
                ctx.setLineDash([]);
                note = 'brickRect(' + demo.column + ', ' + demo.row + ') → x ' + Math.round(rect.x) +
                       '  y ' + Math.round(rect.y) + '  w ' + Math.round(rect.width) +
                       '  h ' + Math.round(rect.height);

            } else if (demoKind === 'hit') {
                drawPracticeField(ctx);
                drawBrick(ctx, 3, 2);
                drawBall(ctx, demo.ball);
                const touching = hitsRect(demo.ball, brickRect(3, 2));
                note = 'hitsRect(ball, brick) → ' + touching + (touching ? '   💥 hit!' : '');

            } else if (demoKind === 'walls') {
                drawPracticeField(ctx);
                drawBall(ctx, demo.ball);
                note = 'ball  x ' + Math.round(demo.ball.x) + '  y ' + Math.round(demo.ball.y) +
                       '   dx ' + Math.round(demo.ball.dx) + '  dy ' + Math.round(demo.ball.dy);

            } else if (demoKind === 'paddle') {
                drawPracticeField(ctx);
                drawPaddle(ctx, demo);
                note = 'paddleX ' + Math.round(demo.paddleX) + '   steering ' + demo.steering;

            } else if (demoKind === 'mini') {
                drawPracticeField(ctx);
                drawPaddle(ctx, demo);
                drawBall(ctx, demo.ball);
                note = demo.bounces + ' bounce(s) off the paddle';

            } else {
                renderGame(ctx, demo);
                note = 'score ' + demo.score + '  •  ' + demo.lives + ' lives  •  ' +
                       bricksLeft(demo) + ' bricks left';
            }
            setNote(note);
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

    /** sizeCanvas — every Breakout demo uses the same shrunken field. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(FIELD_WIDTH * SCALE);
        canvas.height = Math.round(FIELD_HEIGHT * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'bricks') {
            addButton('←', 'The brick to the left', function () { demo.column = Math.max(0, demo.column - 1); });
            addButton('→', 'The brick to the right', function () { demo.column = Math.min(BRICK_COLUMNS - 1, demo.column + 1); });
            addButton('↑', 'The row above', function () { demo.row = Math.max(0, demo.row - 1); });
            addButton('↓', 'The row below', function () { demo.row = Math.min(BRICK_ROWS - 1, demo.row + 1); });
            return;
        }

        if (kind === 'hit') {
            addButton('←', 'Move the ball left', function () { demo.ball.x -= 8; });
            addButton('→', 'Move the ball right', function () { demo.ball.x += 8; });
            addButton('↑', 'Move the ball up', function () { demo.ball.y -= 8; });
            addButton('↓', 'Move the ball down', function () { demo.ball.y += 8; });
            addButton('↺', 'Put the ball back', function () { startDemo(step); });
            return;
        }

        if (kind === 'walls') {
            addButton('Faster', 'Speed the ball up', function () { demo.ball.dx *= 1.25; demo.ball.dy *= 1.25; });
            addButton('Slower', 'Slow it down', function () { demo.ball.dx *= 0.8; demo.ball.dy *= 0.8; });
            addButton('↺', 'Put the ball back', function () { startDemo(step); });
            return;
        }

        addButton('←', 'Steer left', function () { demo.steering = -1; });
        addButton('Stop', 'Stop steering', function () { demo.steering = 0; });
        addButton('→', 'Steer right', function () { demo.steering = 1; });
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
        else if (action === 'left') { demo.steering = -1; }
        else if (action === 'right') { demo.steering = 1; }
    }

    startWorkshop({
        storagePrefix: 'breakout-build',
        steps: BREAKOUT_STEPS,
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
