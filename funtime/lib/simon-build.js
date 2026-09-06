/* ============================================================
   simon-build.js — the Simon Says workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.72;

    let demo = null;
    let demoKind = 'pads';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'pads';
        if (demoKind === 'pads') { demo = { lit: -1 }; }
        else if (demoKind === 'sequence') { demo = { sequence: [], input: [] }; }
        else { demo = createGame(); }
    }

    /** updateDemo — the flashing sequence keeps going. */
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
            const size = boardPixelSize();

            if (demoKind === 'pads') {
                clearCanvas(ctx, size, size, '#ffffff');
                for (let pad = 0; pad < PAD_COUNT; pad++) {
                    drawPad(ctx, pad, demo.lit === pad);
                }
                setNote('pad ' + (demo.lit >= 0 ? demo.lit : 'none') + ' is lit');

            } else if (demoKind === 'sequence') {
                clearCanvas(ctx, size, size, '#ffffff');
                for (let pad = 0; pad < PAD_COUNT; pad++) {
                    const lit = demo.input.length > 0 && demo.input[demo.input.length - 1] === pad;
                    drawPad(ctx, pad, lit);
                }
                const correct = isCorrectSoFar(demo.sequence, demo.input);
                const complete = isRoundComplete(demo.sequence, demo.input);
                setNote('sequence [' + demo.sequence + ']  input [' + demo.input + ']  →  correct ' +
                        correct + (complete ? '  COMPLETE!' : ''));

            } else {
                renderGame(ctx, demo);
                setNote('round ' + demo.round + '  •  score ' + demo.score + '  •  ' + demo.phase);
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

    /** sizeCanvas — the demo pads are the real pads, shrunk. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(boardPixelSize() * SCALE);
        canvas.height = Math.round(boardPixelSize() * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'pads') {
            for (let pad = 0; pad < PAD_COUNT; pad++) {
                addButton('Light ' + (pad + 1), 'Light this pad', function () { demo.lit = pad; });
            }
            addButton('Off', 'Turn them all off', function () { demo.lit = -1; });
            return;
        }
        if (kind === 'sequence') {
            addButton('Add a step', 'Grow the sequence', function () {
                demo.sequence = addStep(demo.sequence);
            });
            for (let pad = 0; pad < PAD_COUNT; pad++) {
                addButton('Press ' + (pad + 1), 'Press this pad', function () {
                    demo.input = demo.input.concat([pad]);
                });
            }
            addButton('↺ Clear', 'Start again', function () { startDemo(step); });
            return;
        }

        for (let pad = 0; pad < PAD_COUNT; pad++) {
            addButton('Pad ' + (pad + 1), 'Press this pad', function () { pressPad(demo, pad); });
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
        else if (action.indexOf('pad') === 0) { pressPad(demo, Number(action.slice(3))); }
    }

    startWorkshop({
        storagePrefix: 'simon-build',
        steps: SIMON_STEPS,
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
