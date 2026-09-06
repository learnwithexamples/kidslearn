/* ============================================================
   reaction-build.js — the Reaction Test workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.7;

    let demo = null;
    let demoKind = 'phases';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'phases';

        demo = createGame();
        if (demoKind === 'stats') {
            demo.times = [240, 310, 195, 420];
            demo.attempts = 4;
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

            if (demoKind === 'phases') {
                setNote("phase '" + demo.phase + "'  •  " + Math.round(demo.elapsed) +
                        ' ms of the wait gone by');
            } else if (demoKind === 'stats') {
                setNote('times [' + demo.times + ']  →  best ' + bestTime(demo) +
                        ', average ' + averageTime(demo));
            } else {
                setNote("phase '" + demo.phase + "'  •  last " + demo.lastTime + ' ms  •  ' +
                        demo.attempts + ' goes  •  ' + demo.falseStarts + ' false start(s)');
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

    /** sizeCanvas — every demo uses the same shrunken page. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(FIELD_WIDTH * SCALE);
        canvas.height = Math.round(FIELD_HEIGHT * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'phases') {
            addButton('Press', 'Press the button', function () { press(demo); });
            addButton('Skip the wait', 'Jump straight to the signal', function () {
                demo.elapsed = demo.waitFor;
                updateGame(demo, 1);
            });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }
        if (kind === 'stats') {
            addButton('A fast go', 'Add a 190 ms go', function () {
                demo.times.push(190);
                demo.attempts += 1;
            });
            addButton('A slow go', 'Add a 520 ms go', function () {
                demo.times.push(520);
                demo.attempts += 1;
            });
            addButton('↺ Clear', 'Forget them all', function () { startDemo(step); });
            return;
        }

        addButton('PRESS', 'Press the button', function () { press(demo); });
        addButton('↺ New', 'Clear the scores', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'press') { press(demo); }
        else if (action === 'new') { startDemo(step); }
        else if (action === 'pause') { togglePause(demo); }
    }

    startWorkshop({
        storagePrefix: 'reaction-build',
        steps: REACTION_STEPS,
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
