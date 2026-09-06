/* ============================================================
   typing-build.js — the Typing Race workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.7;

    let demo = null;
    let demoKind = 'match';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'match';

        demo = createGame();
        if (demoKind === 'match') {
            demo.words = ['water', 'little', 'before', 'number', 'people'];
            demo.typed = 'wat';
        } else if (demoKind === 'sums') {
            demo.correct = 12;
            demo.wrong = 3;
            demo.lettersTyped = 60;
            demo.seconds = 30;
            demo.hasStarted = true;
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

            if (demoKind === 'match') {
                const word = currentWord(demo);
                setNote("matchingLetters('" + word + "', '" + demo.typed + "') → " +
                        matchingLetters(word, demo.typed));
            } else if (demoKind === 'sums') {
                setNote(demo.correct + ' right, ' + demo.wrong + ' wrong, ' +
                        demo.lettersTyped + ' letters in ' + demo.seconds + 's  →  ' +
                        wordsPerMinute(demo) + ' WPM, ' + accuracy(demo) + '% right');
            } else {
                setNote(wordsPerMinute(demo) + ' WPM  •  ' + accuracy(demo) +
                        '% right  •  ' + demo.correct + ' words done');
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

        if (kind === 'match') {
            addButton("Type 'e'", 'The right next letter', function () { demo.typed += 'e'; });
            addButton("Type 'x'", 'A wrong letter', function () { demo.typed += 'x'; });
            addButton('⌫', 'Rub one out', function () {
                demo.typed = demo.typed.slice(0, demo.typed.length - 1);
            });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }
        if (kind === 'sums') {
            addButton('+5 seconds', 'Let time pass', function () { demo.seconds += 5; });
            addButton('+1 right word', 'Type another word', function () {
                demo.correct += 1;
                demo.lettersTyped += 5;
            });
            addButton('+1 wrong word', 'Make a mistake', function () { demo.wrong += 1; });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }

        addButton('Type the word', 'Type it correctly', function () {
            currentWord(demo).split('').forEach(function (letter) { typeLetter(demo, letter); });
        });
        addButton('Type it wrong', 'Get it wrong on purpose', function () {
            'zzz'.split('').forEach(function (letter) { typeLetter(demo, letter); });
        });
        addButton('SPACE', 'Submit the word', function () { submitWord(demo); });
        addButton('↺ New race', 'Start again', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'new') { startDemo(step); }
        else if (action === 'pause') { togglePause(demo); }
        else if (action === 'space') { submitWord(demo); }
        else if (action === 'back') { backspace(demo); }
        else { typeLetter(demo, action); }
    }

    startWorkshop({
        storagePrefix: 'typing-build',
        steps: TYPING_STEPS,
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
