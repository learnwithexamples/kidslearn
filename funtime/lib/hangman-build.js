/* ============================================================
   hangman-build.js — the Hangman workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.66;

    let demo = null;
    let demoKind = 'mask';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'mask';

        demo = createGame();
        if (demoKind === 'mask') {
            demo.word = 'PYTHON';
            demo.guessed = 'PO';
        } else if (demoKind === 'wrong') {
            demo.word = 'RABBIT';
            demo.guessed = 'RAXZ';
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);
            renderGame(ctx, demo);

            if (demoKind === 'mask') {
                setNote('word ' + demo.word + "  guessed '" + demo.guessed + "'  →  " +
                        maskedWord(demo.word, demo.guessed));
            } else if (demoKind === 'wrong') {
                setNote("wrong letters '" + wrongLetters(demo) + "'  •  " +
                        livesLeft(demo) + ' lives left');
            } else {
                setNote(maskedWord(demo.word, demo.guessed) + '  •  ' +
                        livesLeft(demo) + ' lives  •  ' + gameStatus(demo));
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

    /** tryLetter — add a letter, whichever kind of demo is showing. */
    function tryLetter(letter) {
        if (demoKind === 'mask' || demoKind === 'wrong') {
            /* these demos are just pictures, so add the letter straight in */
            if (demo.guessed.indexOf(letter) === -1) {
                demo.guessed = demo.guessed + letter;
            }
        } else {
            guessLetter(demo, letter);
        }
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'mask') {
            ['T', 'H', 'N', 'Y'].forEach(function (letter) {
                addButton('Guess ' + letter, 'Try the letter ' + letter,
                          function () { tryLetter(letter); });
            });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }
        if (kind === 'wrong') {
            ['Q', 'B', 'K'].forEach(function (letter) {
                addButton('Guess ' + letter, 'Try the letter ' + letter,
                          function () { tryLetter(letter); });
            });
            addButton('↺', 'Start again', function () { startDemo(step); });
            return;
        }

        addButton('A E I O U', 'Try all the vowels', function () {
            'AEIOU'.split('').forEach(function (letter) { guessLetter(demo, letter); });
        });
        ['S', 'T', 'R'].forEach(function (letter) {
            addButton('Guess ' + letter, 'Try the letter ' + letter,
                      function () { guessLetter(demo, letter); });
        });
        addButton('↺ New word', 'Hide a new word', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'new') { startDemo(step); }
        else if (action === 'pause') { togglePause(demo); }
        else { guessLetter(demo, action); }
    }

    startWorkshop({
        storagePrefix: 'hangman-build',
        steps: HANGMAN_STEPS,
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
