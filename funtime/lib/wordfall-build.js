/* ============================================================
   wordfall-build.js — the Word Rain workshop's demos

   Five practice fields, each showing the least it can get away with. The
   steps about levels have nothing falling at all; the step about widths has
   no sky. Fewer moving parts means a student can see what their function
   just did.
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.68;

    let demo = null;
    let demoKind = 'sky';
    let demoFlags = {};

    /** blankSky — a game with nothing in it, for the demos to fill. */
    function blankSky() {
        const state = createGame();
        state.words = [];
        state.typed = '';
        return state;
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'sky';
        demoFlags = (step.demo && step.demo.flags) || {};

        demo = blankSky();

        if (demoKind === 'pace') {
            demo.level = 1;
            spawnWord(demo);
        } else if (demoKind === 'sizes') {
            demo.words = [];
            for (let letters = 3; letters <= 7; letters++) {
                const word = wordForLevel(letters * 2);
                demo.words.push(makeWord(word, 20));
            }
        } else if (demoKind === 'sky' || demoKind === 'match') {
            for (let i = 0; i < 4; i++) {
                const word = spawnWord(demo);
                word.y = 40 + i * 60;
            }
        } else {
            demo = createGame();
        }
    }

    /** typeNextLetter — the demo's stand-in for a keyboard. */
    function typeNextLetter() {
        let target = matchingWord(demo, demo.typed);
        if (target === null) {
            /* nothing started yet — aim at whatever is lowest */
            for (let i = 0; i < demo.words.length; i++) {
                if (target === null || demo.words[i].y > target.y) { target = demo.words[i]; }
            }
        }
        if (target === null) { return; }
        typeLetter(demo, target.text.charAt(demo.typed.length));
        zapWord(demo);
    }

    /** updateDemo — one frame of whichever practice field is showing. */
    function updateDemo(elapsed) {
        const seconds = elapsed / 1000;

        if (demoKind === 'sizes') {
            return;                                     /* nothing moves here */
        }

        if (demoKind === 'pace' || demoKind === 'sky' || demoKind === 'match') {
            moveWords(demo, seconds);
            removeLandedWords(demo);
            demo.lives = START_LIVES;                   /* a demo never dies */
            demo.isOver = false;
            if (demo.words.length === 0) { spawnWord(demo); }
            if (demo.typed.length > 0 && matchingWord(demo, demo.typed) === null) {
                demo.typed = '';
            }
        } else {
            updateGame(demo, elapsed);
            if (demo.isOver) { startDemo({ demo: { kind: demoKind, flags: demoFlags } }); }
        }
    }

    /** drawSizes — the width of a word, drawn as a box round it. */
    function drawSizes(ctx) {
        clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, '#ffffff');
        ctx.font = '18px monospace';
        ctx.textAlign = 'left';

        for (let i = 0; i < demo.words.length; i++) {
            const text = demo.words[i].text;
            const y = 60 + i * 56;
            const width = wordWidth(text);

            ctx.strokeStyle = '#b4b4b4';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(20, y - 17, width, 22);
            ctx.fillStyle = '#111111';
            ctx.fillText(text, 20, y);
            ctx.font = '11px monospace';
            ctx.fillStyle = '#777777';
            ctx.fillText(text.length + ' x ' + LETTER_WIDTH + ' = ' + width + 'px', 24 + width, y);
            ctx.font = '18px monospace';
        }
        drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);

            if (demoKind === 'sizes') {
                drawSizes(ctx);
                setNote('wordWidth turns letters into pixels — the box is what it gives back.');
            } else {
                renderGame(ctx, demo);

                if (demoKind === 'pace') {
                    setNote('level ' + demo.level + '  →  ' + speedForLevel(demo.level) +
                            ' px/s, a new word every ' + gapForLevel(demo.level) + ' ms');
                } else if (demoKind === 'match') {
                    const target = matchingWord(demo, demo.typed);
                    setNote('typed "' + demo.typed + '"  →  ' +
                            (target === null ? 'nothing matches' : 'aiming at ' + target.text));
                } else {
                    setNote(demo.words.length + ' words falling  •  ' + demo.missed +
                            ' have hit the ground');
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

    /** sizeCanvas — every demo uses the same shrunken sky. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(FIELD_WIDTH * SCALE);
        canvas.height = Math.round(FIELD_HEIGHT * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'pace') {
            addButton('Level −', 'An easier level', function () {
                demo.level = demo.level > 1 ? demo.level - 1 : 1;
            });
            addButton('Level +', 'A harder level', function () { demo.level = demo.level + 1; });
            addButton('Level 20', 'Right up at the ceiling', function () { demo.level = 20; });
            addButton('↺', 'Back to level 1', function () { startDemo(step); });
            return;
        }

        if (kind === 'sizes') {
            addButton('↺ New words', 'Five more words', function () { startDemo(step); });
            return;
        }

        if (kind === 'match' || kind === 'final') {
            addButton('Type ▶', 'Type the next letter of the lowest word', typeNextLetter);
            addButton('⌫', 'Rub out a letter', function () { backspace(demo); });
            addButton('Clear', 'Give up on this word', function () { clearTyped(demo); });
            addButton('Drop', 'One more word', function () { spawnWord(demo); });
            addButton('↺ New', 'Start again', function () { startDemo(step); });
            return;
        }

        addButton('Drop', 'One more word out of the sky', function () { spawnWord(demo); });
        addButton('Nudge', 'Push them all down a bit', function () { moveWords(demo, 1.2); });
        addButton('↺ New', 'An empty sky', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'new') { startDemo(step); }
        else if (action === 'pause') { togglePause(demo); }
        else if (action === 'back') { backspace(demo); }
        else if (action === 'clear') { clearTyped(demo); }
        else { typeLetter(demo, action); zapWord(demo); }
    }

    startWorkshop({
        storagePrefix: 'wordfall-build',
        steps: WORDFALL_STEPS,
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
