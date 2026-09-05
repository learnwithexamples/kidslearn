/* ============================================================
   snake-build.js — the Snake workshop

   This file holds only the things that are special to Snake: the little demos
   that grow beside the editor, and the buttons each one needs. Everything else
   — the steps, the editor, the tests, the progress dots — is handled by
   workshop.js, which the Tetris workshop uses too.
   ============================================================ */

(function () {
    'use strict';

    /** How many pixels wide one square of the demo field is. */
    const DEMO_CELL = 12;

    /** How long the little demos wait between steps (the real game varies it). */
    const DEMO_STEP_MS = 220;

    let demo = null;        /* whatever the current demo is showing */
    let demoKind = 'still';
    let demoFlags = {};
    let demoTimer = 0;
    let demoMessage = '';

    /**
     * wrapPosition — bring a square back onto the field from the other side.
     *
     * INPUT:  position — a position, possibly just off the edge
     * OUTPUT: a position inside the grid, having come round the other side
     *
     * ALGORITHM: add the grid size and take the remainder, so -1 becomes 19
     *            and 20 becomes 0.
     *
     * NOTE: this belongs to the WORKSHOP, not to the game. Before the student
     *       writes isInsideGrid there are no walls yet, so the demo wraps the
     *       snake around instead of letting it crawl away for ever.
     */
    function wrapPosition(position) {
        return {
            x: (position.x + GRID_WIDTH) % GRID_WIDTH,
            y: (position.y + GRID_HEIGHT) % GRID_HEIGHT
        };
    }

    /**
     * startDemo — build whatever the current step wants to show.
     * INPUT: step. OUTPUT: nothing.
     */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'still';
        demoFlags = (step.demo && step.demo.flags) || {};
        demoMessage = '';
        demoTimer = 0;

        if (demoKind === 'still') {
            demo = { snake: createStartingSnake() };
        } else if (demoKind === 'compare') {
            demo = { head: createPosition(6, 10), apple: createPosition(13, 10) };
        } else if (demoKind === 'head') {
            demo = { head: createPosition(10, 10), direction: DIRECTIONS.right };
        } else if (demoKind === 'mini') {
            demo = {
                snake: createStartingSnake(),
                direction: DIRECTIONS.right,
                turns: [],
                food: null,
                eaten: 0,
                isOver: false
            };
            if (demoFlags.eat) {
                demo.food = randomEmptyCell(demo.snake);
            }
        } else {
            /* 'game' and 'final' run the real thing */
            demo = createGame();
            demo.isPaused = false;
        }
    }

    /**
     * miniTurn — steer the little demo snake.
     * INPUT: direction. OUTPUT: nothing.
     * ALGORITHM: refuse a U-turn once the student has written
     *            isOppositeDirection, then queue the turn (at most two).
     */
    function miniTurn(direction) {
        if (!demo || demo.isOver) { return; }
        const facing = demo.turns.length > 0 ? demo.turns[demo.turns.length - 1] : demo.direction;
        if (demoFlags.noReverse && isOppositeDirection(direction, facing)) {
            demoMessage = 'No U-turns!';
            return;
        }
        if (demo.turns.length < 2) {
            demo.turns.push(direction);
        }
    }

    /**
     * miniStep — one turn of the little demo snake.
     *
     * INPUT:  none
     * OUTPUT: nothing
     *
     * ALGORITHM: the same shape as the real stepGame, but each rule is only
     *            switched on once the student has written the function it
     *            needs. Before the walls exist the snake wraps around; before
     *            containsPosition exists it can pass through itself.
     */
    function miniStep() {
        if (!demo || demo.isOver) { return; }

        if (demo.turns.length > 0) {
            demo.direction = demo.turns.shift();
        }

        let head = addDirection(demo.snake[0], demo.direction);

        if (demoFlags.walls) {
            if (!isInsideGrid(head)) {
                demo.isOver = true;
                demoMessage = 'Crashed into the wall!';
                return;
            }
        } else {
            head = wrapPosition(head);
        }

        if (demoFlags.self) {
            const bodyThatStays = demo.snake.slice(0, demo.snake.length - 1);
            if (containsPosition(bodyThatStays, head)) {
                demo.isOver = true;
                demoMessage = 'It bit itself!';
                return;
            }
        }

        const eating = demoFlags.eat && demo.food !== null && samePosition(head, demo.food);
        demo.snake = moveSnake(demo.snake, head, eating);

        if (eating) {
            demo.eaten = demo.eaten + 1;
            demo.food = randomEmptyCell(demo.snake);
            demoMessage = 'Yum! ' + demo.eaten + ' apple' + (demo.eaten === 1 ? '' : 's');
        }
    }

    /**
     * updateDemo — let the demo's clock tick.
     * INPUT: elapsed — milliseconds since the last frame. OUTPUT: nothing.
     */
    function updateDemo(elapsed) {
        if (demoKind === 'game' || demoKind === 'final') {
            updateGame(demo, elapsed);
            return;
        }
        if (demoKind !== 'mini') { return; }

        demoTimer = demoTimer + elapsed;
        while (demoTimer >= DEMO_STEP_MS) {
            demoTimer = demoTimer - DEMO_STEP_MS;
            miniStep();
        }
    }

    /**
     * drawField — the white field, the faint grid and the black border.
     * INPUT: ctx, canvas. OUTPUT: nothing.
     */
    function drawField(ctx, canvas) {
        clearCanvas(ctx, canvas.width, canvas.height, '#ffffff');
        drawGrid(ctx, GRID_WIDTH, GRID_HEIGHT, DEMO_CELL);
    }

    /**
     * drawSnakeAndFood — draw a snake (head last, so it sits on top) and an apple.
     * INPUT: ctx, snake (array), direction, food (or null). OUTPUT: nothing.
     */
    function drawSnakeAndFood(ctx, snake, direction, food) {
        if (food) {
            drawFood(ctx, food, DEMO_CELL);
        }
        for (let i = 1; i < snake.length; i++) {
            drawSegment(ctx, snake[i], DEMO_CELL);
        }
        if (snake.length > 0) {
            drawHead(ctx, snake[0], direction, DEMO_CELL);
        }
    }

    /**
     * drawDemo — draw the current demo onto the canvas.
     * INPUT: ctx, canvas, setNote (writes the line of text under the canvas).
     * OUTPUT: nothing.
     */
    function drawDemo(ctx, canvas, setNote) {
        try {
            if (demoKind === 'still') {
                const snake = createStartingSnake();
                drawField(ctx, canvas);
                drawSnakeAndFood(ctx, snake, DIRECTIONS.right, null);
                drawFrame(ctx, canvas.width, canvas.height);
                setNote(snake.length + ' squares, head at (' + snake[0].x + ', ' + snake[0].y + ')');
                return;
            }

            if (demoKind === 'compare') {
                drawField(ctx, canvas);
                drawFood(ctx, demo.apple, DEMO_CELL);
                drawHead(ctx, demo.head, DIRECTIONS.right, DEMO_CELL);
                drawFrame(ctx, canvas.width, canvas.height);
                const answer = samePosition(demo.head, demo.apple);
                setNote('samePosition(head, apple) → ' + answer +
                        (answer ? '   🍎 the snake would eat!' : ''));
                return;
            }

            if (demoKind === 'head') {
                drawField(ctx, canvas);
                if (isInsideGrid(demo.head)) {
                    drawHead(ctx, demo.head, demo.direction, DEMO_CELL);
                }
                drawFrame(ctx, canvas.width, canvas.height);
                setNote('head is at (' + demo.head.x + ', ' + demo.head.y + ')' +
                        (isInsideGrid(demo.head) ? '' : '   ← off the field!'));
                return;
            }

            if (demoKind === 'mini') {
                drawField(ctx, canvas);
                drawSnakeAndFood(ctx, demo.snake, demo.direction, demo.food);
                drawFrame(ctx, canvas.width, canvas.height);
                if (demo.isOver) {
                    drawMessage(ctx, canvas.width, canvas.height, 'CRASH', 'Press ↺ to try again');
                }
                setNote(demoMessage || 'Length ' + demo.snake.length + ' — steer with the buttons');
                return;
            }

            /* the real game */
            renderGame(ctx, demo, DEMO_CELL);
            let note = 'Length ' + demo.snake.length;
            if (demoFlags.hud) {
                note = 'Score ' + demo.score + '  •  Length ' + demo.snake.length + '  •  Level ' + demo.level;
            }
            setNote(note);
        } catch (e) {
            clearCanvas(ctx, canvas.width, canvas.height, '#ffffff');
            ctx.fillStyle = '#111111';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Waiting for working code…', canvas.width / 2, canvas.height / 2 - 10);
            ctx.font = '11px monospace';
            ctx.fillText(String(e.message).slice(0, 40), canvas.width / 2, canvas.height / 2 + 12);
            setNote('The demo stopped: ' + e.message);
        }
    }

    /**
     * sizeCanvas — every snake demo uses the same square field.
     * INPUT: step, canvas. OUTPUT: nothing.
     */
    function sizeCanvas(step, canvas) {
        canvas.width = GRID_WIDTH * DEMO_CELL;
        canvas.height = GRID_HEIGHT * DEMO_CELL;
    }

    /**
     * controls — the buttons under the demo, chosen by the step.
     * INPUT: step, and addButton(label, title, onClick) from the workshop.
     * OUTPUT: nothing; it adds the buttons this demo needs.
     */
    function controls(step, addButton) {
        const kind = step.demo.kind;
        const flags = step.demo.flags || {};

        if (kind === 'still') {
            addButton('↺ Redraw', 'Build the snake again', function () { startDemo(step); });
            return;
        }

        if (kind === 'compare') {
            addButton('←', 'Move the head left', function () {
                demo.head = wrapPosition(addDirection(demo.head, DIRECTIONS.left));
            });
            addButton('→', 'Move the head right', function () {
                demo.head = wrapPosition(addDirection(demo.head, DIRECTIONS.right));
            });
            addButton('↑', 'Move the head up', function () {
                demo.head = wrapPosition(addDirection(demo.head, DIRECTIONS.up));
            });
            addButton('↓', 'Move the head down', function () {
                demo.head = wrapPosition(addDirection(demo.head, DIRECTIONS.down));
            });
            addButton('🍎 Move apple', 'Put the apple somewhere else', function () {
                demo.apple = randomEmptyCell([demo.head]);
            });
            return;
        }

        if (kind === 'head') {
            addButton('←', 'Step left', function () { demo.direction = DIRECTIONS.left; demo.head = addDirection(demo.head, DIRECTIONS.left); });
            addButton('→', 'Step right', function () { demo.direction = DIRECTIONS.right; demo.head = addDirection(demo.head, DIRECTIONS.right); });
            addButton('↑', 'Step up', function () { demo.direction = DIRECTIONS.up; demo.head = addDirection(demo.head, DIRECTIONS.up); });
            addButton('↓', 'Step down', function () { demo.direction = DIRECTIONS.down; demo.head = addDirection(demo.head, DIRECTIONS.down); });
            addButton('↺', 'Back to the middle', function () { startDemo(step); });
            return;
        }

        if (kind === 'mini') {
            addButton('←', 'Turn left', function () { miniTurn(DIRECTIONS.left); });
            addButton('→', 'Turn right', function () { miniTurn(DIRECTIONS.right); });
            addButton('↑', 'Turn up', function () { miniTurn(DIRECTIONS.up); });
            addButton('↓', 'Turn down', function () { miniTurn(DIRECTIONS.down); });
            addButton('↺', 'Start the demo again', function () { startDemo(step); });
            return;
        }

        /* the real game */
        addButton('←', 'Turn left', function () { turnSnake(demo, DIRECTIONS.left); });
        addButton('→', 'Turn right', function () { turnSnake(demo, DIRECTIONS.right); });
        addButton('↑', 'Turn up', function () { turnSnake(demo, DIRECTIONS.up); });
        addButton('↓', 'Turn down', function () { turnSnake(demo, DIRECTIONS.down); });
        if (flags.levelPicker) {
            addButton('Level −', 'Slower', function () { demo.level = Math.max(1, demo.level - 1); });
            addButton('Level +', 'Faster', function () { demo.level = Math.min(20, demo.level + 1); });
        }
        addButton('▶ / ⏸', 'Start or pause', function () { togglePause(demo); });
        addButton('↺ New', 'Start again', function () { startDemo(step); });
    }

    /**
     * onKey — only the last step plays with the keyboard.
     * INPUT: step, event (a keydown). OUTPUT: nothing.
     */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }

        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        const direction = directionForAction(action);
        if (direction !== null) {
            turnSnake(demo, direction);
        } else if (action === 'pause') {
            togglePause(demo);
        } else if (action === 'restart') {
            startDemo(step);
        }
    }

    /* Hand the demo over to the shared workshop engine. */
    startWorkshop({
        storagePrefix: 'snake-build',
        steps: SNAKE_STEPS,
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
