/* ============================================================
   flappy-build.js — the Flappy workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.62;

    let demo = null;
    let demoKind = 'fall';
    let demoFlags = {};

    /** practiceBird — a bird for the demos with no whole game behind them. */
    function practiceBird() {
        return { y: 120, dy: 0 };
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'fall';
        demoFlags = (step.demo && step.demo.flags) || {};

        if (demoKind === 'fall' || demoKind === 'fly') {
            demo = { bird: practiceBird(), flaps: 0 };
        } else if (demoKind === 'pipe') {
            demo = { pipe: { x: 120, gapY: 150, passed: false } };
        } else if (demoKind === 'overlap') {
            demo = { bird: { y: 180, dy: 0 }, pipe: { x: 120, gapY: 150, passed: false } };
        } else if (demoKind === 'scroll') {
            demo = { pipes: [makePipe(120), makePipe(292)], scrolled: 0 };
        } else if (demoKind === 'mini') {
            demo = {
                bird: practiceBird(), pipes: [makePipe(FIELD_WIDTH)],
                sinceLastPipe: 0, score: 0, isOver: false, isPaused: false, scrolled: 0
            };
        } else {
            demo = createGame();
            demo.scrolled = 0;
            demo.isPaused = false;
        }
    }

    /** robotFlap — a robot pilot: flap whenever the bird is below the next gap. */
    function robotFlap(state) {
        const ahead = state.pipes.filter(function (p) { return p.x + PIPE_WIDTH > BIRD_X; });
        const target = ahead.length > 0
            ? ahead[0].gapY + GAP_HEIGHT / 2 - BIRD_SIZE / 2
            : FIELD_HEIGHT / 2;
        if (state.bird.y > target && state.bird.dy > -60) { flap(state.bird); }
    }

    /** updateDemo — one frame of whichever practice sky is showing. */
    function updateDemo(elapsed) {
        const seconds = elapsed / 1000;

        if (demoKind === 'fall' || demoKind === 'fly') {
            applyGravity(demo.bird, seconds);
            if (demo.bird.y > GROUND_Y - BIRD_SIZE) { demo.bird = practiceBird(); }

        } else if (demoKind === 'scroll') {
            const distance = BASE_PIPE_SPEED * seconds;
            demo.scrolled = demo.scrolled + distance;
            demo.pipes = movePipes(demo.pipes, distance);
            const last = demo.pipes[demo.pipes.length - 1];
            if (!last || last.x < FIELD_WIDTH - PIPE_SPACING) {
                demo.pipes.push(makePipe(FIELD_WIDTH));
            }

        } else if (demoKind === 'mini') {
            if (demoFlags.robot) { robotFlap(demo); }
            const distance = BASE_PIPE_SPEED * seconds;
            demo.scrolled = demo.scrolled + distance;
            applyGravity(demo.bird, seconds);
            demo.pipes = movePipes(demo.pipes, distance);
            demo.sinceLastPipe = demo.sinceLastPipe + distance;
            if (demo.sinceLastPipe >= PIPE_SPACING) {
                demo.pipes.push(makePipe(FIELD_WIDTH));
                demo.sinceLastPipe = 0;
            }
            if (isCrashed(demo)) { startDemo({ demo: { kind: demoKind, flags: demoFlags } }); }

        } else if (demoKind === 'game' || demoKind === 'final') {
            if (demoFlags.robot) { robotFlap(demo); }
            demo.scrolled = demo.scrolled + pipeSpeed(currentLevel(demo)) * seconds;
            updateGame(demo, elapsed);
            if (demo.isOver && demoFlags.robot) {
                startDemo({ demo: { kind: demoKind, flags: demoFlags } });
            }
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);

            if (demoKind === 'fall' || demoKind === 'fly') {
                drawSky(ctx, 0);
                drawGround(ctx, 0);
                drawBird(ctx, demo.bird);
                drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
                setNote('y ' + Math.round(demo.bird.y) + '   dy ' + Math.round(demo.bird.dy) +
                        '   (' + demo.flaps + ' flaps)');

            } else if (demoKind === 'pipe') {
                drawSky(ctx, 0);
                drawPipe(ctx, demo.pipe);
                drawGround(ctx, 0);
                drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
                const rects = pipeRects(demo.pipe);
                setNote('top height ' + Math.round(rects.top.height) +
                        '   bottom height ' + Math.round(rects.bottom.height));

            } else if (demoKind === 'overlap') {
                drawSky(ctx, 0);
                drawPipe(ctx, demo.pipe);
                drawGround(ctx, 0);
                drawBird(ctx, demo.bird);
                drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
                const touching = hitsPipe(demo.bird, demo.pipe);
                setNote('hitsPipe(bird, pipe) → ' + touching + (touching ? '   💥 crash!' : '   safe'));

            } else if (demoKind === 'scroll') {
                drawSky(ctx, demo.scrolled);
                demo.pipes.forEach(function (pipe) { drawPipe(ctx, pipe); });
                drawGround(ctx, demo.scrolled);
                drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
                setNote(demo.pipes.length + ' pipe(s) in the list');

            } else if (demoKind === 'mini') {
                drawSky(ctx, demo.scrolled);
                demo.pipes.forEach(function (pipe) { drawPipe(ctx, pipe); });
                drawGround(ctx, demo.scrolled);
                drawBird(ctx, demo.bird);
                drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
                setNote('isCrashed → ' + isCrashed(demo));

            } else {
                renderGame(ctx, demo);
                setNote('score ' + demo.score + '  •  level ' + currentLevel(demo));
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

    /** sizeCanvas — every Flappy demo uses the same shrunken sky. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(FIELD_WIDTH * SCALE);
        canvas.height = Math.round(FIELD_HEIGHT * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'fall') {
            addButton('Drop again', 'Put the bird back at the top', function () { startDemo(step); });
            return;
        }
        if (kind === 'fly') {
            addButton('FLAP!', 'Flap the wings', function () { flap(demo.bird); demo.flaps++; });
            addButton('↺', 'Put the bird back', function () { startDemo(step); });
            return;
        }
        if (kind === 'pipe') {
            const highest = GAP_MARGIN;
            const lowest = GROUND_Y - GAP_HEIGHT - GAP_MARGIN;
            addButton('Gap up', 'Move the gap up', function () {
                demo.pipe.gapY = Math.max(highest, demo.pipe.gapY - 14);
            });
            addButton('Gap down', 'Move the gap down', function () {
                demo.pipe.gapY = Math.min(lowest, demo.pipe.gapY + 14);
            });
            addButton('↺ New pipe', 'A random pipe', function () { startDemo(step); });
            return;
        }
        if (kind === 'overlap') {
            addButton('Bird ↑', 'Move the bird up', function () { demo.bird.y -= 14; });
            addButton('Bird ↓', 'Move the bird down', function () { demo.bird.y += 14; });
            addButton('Pipe ←', 'Slide the pipe closer', function () { demo.pipe.x -= 12; });
            addButton('Pipe →', 'Slide the pipe away', function () { demo.pipe.x += 12; });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }
        if (kind === 'scroll') {
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }

        addButton('FLAP!', 'Flap the wings', function () { if (demo.bird) { flap(demo.bird); } });
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
        else if (action === 'flap') { flap(demo.bird); }
    }

    startWorkshop({
        storagePrefix: 'flappy-build',
        steps: FLAPPY_STEPS,
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
