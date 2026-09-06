/* ============================================================
   memory-build.js — the Memory Match workshop's demos

   Only the things that are special to this game. workshop.js runs everything
   else: the steps, the editor, the tests and the progress dots.
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.62;

    let demo = null;
    let demoKind = 'grid';
    let demoFlags = {};
    let note = '';

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'grid';
        demoFlags = (step.demo && step.demo.flags) || {};
        note = '';

        if (demoKind === 'grid') {
            demo = {};
        } else if (demoKind === 'deck') {
            demo = { cards: createDeck() };
        } else if (demoKind === 'pair') {
            demo = { left: 2, right: 5 };
        } else {
            demo = createGame();
        }
    }

    /** updateDemo — let the demo's clock tick (only the real game needs it). */
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
            const width = boardPixelWidth();
            const height = boardPixelHeight();

            if (demoKind === 'grid') {
                clearCanvas(ctx, width, height, '#ffffff');
                ctx.textAlign = 'center';
                for (let row = 0; row < GRID_ROWS; row++) {
                    for (let column = 0; column < GRID_COLUMNS; column++) {
                        const x = cardLeft(column);
                        const y = cardTop(row);
                        ctx.strokeStyle = '#111111';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);
                        ctx.fillStyle = '#111111';
                        ctx.font = 'bold 30px monospace';
                        ctx.fillText(String(cardIndex(column, row)),
                                     x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2 + 10);
                    }
                }
                note = 'cardIndex(column, row) numbers every square';

            } else if (demoKind === 'deck') {
                clearCanvas(ctx, width, height, '#ffffff');
                const counts = {};
                demo.cards.forEach(function (card) {
                    counts[card.symbol] = (counts[card.symbol] || 0) + 1;
                });
                for (let row = 0; row < GRID_ROWS; row++) {
                    for (let column = 0; column < GRID_COLUMNS; column++) {
                        const card = demo.cards[cardIndex(column, row)];
                        drawCard(ctx, { symbol: card.symbol, faceUp: true, matched: false }, column, row);
                    }
                }
                const twice = Object.keys(counts).every(function (key) { return counts[key] === 2; });
                note = demo.cards.length + ' cards, every symbol twice: ' + twice;

            } else if (demoKind === 'pair') {
                clearCanvas(ctx, width, height, '#ffffff');
                [demo.left, demo.right].forEach(function (symbol, slot) {
                    drawCard(ctx, { symbol: symbol, faceUp: true, matched: false }, 1 + slot, 1);
                });
                const state = {
                    cards: [{ symbol: demo.left }, { symbol: demo.right }],
                    picked: [0, 1]
                };
                note = 'isMatch(state) → ' + isMatch(state);

            } else {
                renderGame(ctx, demo);
                note = 'Moves ' + demo.moves + '  •  Pairs ' + demo.pairs + '/' + PAIR_COUNT;
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

    /** sizeCanvas — the demo board is the real board, shrunk. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(boardPixelWidth() * SCALE);
        canvas.height = Math.round(boardPixelHeight() * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'grid') {
            addButton('↺ Redraw', 'Draw the grid again', function () { startDemo(step); });
            return;
        }
        if (kind === 'deck') {
            addButton('🔀 Shuffle', 'Deal a new deck', function () { startDemo(step); });
            return;
        }
        if (kind === 'pair') {
            addButton('Left card', 'Change the left symbol', function () {
                demo.left = (demo.left + 1) % PAIR_COUNT;
            });
            addButton('Right card', 'Change the right symbol', function () {
                demo.right = (demo.right + 1) % PAIR_COUNT;
            });
            addButton('Make them match', 'Set both the same', function () {
                demo.right = demo.left;
            });
            return;
        }

        addButton('←', 'Cursor left', function () { moveCursor(demo, -1, 0); });
        addButton('→', 'Cursor right', function () { moveCursor(demo, 1, 0); });
        addButton('↑', 'Cursor up', function () { moveCursor(demo, 0, -1); });
        addButton('↓', 'Cursor down', function () { moveCursor(demo, 0, 1); });
        addButton('Flip', 'Turn the card over', function () {
            flipCard(demo, cardIndex(demo.cursor.column, demo.cursor.row));
        });
        addButton('↺ New', 'Deal again', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'flip') { flipCard(demo, cardIndex(demo.cursor.column, demo.cursor.row)); }
        else if (action === 'left') { moveCursor(demo, -1, 0); }
        else if (action === 'right') { moveCursor(demo, 1, 0); }
        else if (action === 'up') { moveCursor(demo, 0, -1); }
        else if (action === 'down') { moveCursor(demo, 0, 1); }
        else if (action === 'pause') { togglePause(demo); }
    }

    startWorkshop({
        storagePrefix: 'memory-build',
        steps: MEMORY_STEPS,
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
