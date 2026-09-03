/* ============================================================
   tetris-build.js — the "Build Tetris Yourself" workshop

   How it works:

   * The finished game's functions are already loaded (tetris-shapes.js,
     tetris-board.js, tetris-game.js, tetris-draw.js, tetris-input.js).
     We keep a copy of each one and call it the REFERENCE version.

   * When you write a function and press Test, we build your code into a real
     function and run the step's checks on it.

   * When your version passes, we INSTALL it — your function replaces the
     reference one everywhere, so from then on the demos really are running
     your code.

   * The demo beside the editor can show either "the goal" (reference code) or
     "your code", so you can always see what you are aiming at.
   ============================================================ */

(function () {
    'use strict';

    /* ---------------------------------------------------------- storage */

    const STORAGE_CODE = 'tetris-build-code-';
    const STORAGE_DONE = 'tetris-build-done';

    /**
     * loadCode — get the code the student saved for one step.
     * INPUT:  stepId. OUTPUT: the saved text, or null.
     */
    function loadCode(stepId) {
        try {
            return window.localStorage.getItem(STORAGE_CODE + stepId);
        } catch (e) {
            return null;
        }
    }

    /** saveCode — remember the code for one step (ignores private-mode errors). */
    function saveCode(stepId, code) {
        try {
            window.localStorage.setItem(STORAGE_CODE + stepId, code);
        } catch (e) { /* storage is not available — never mind */ }
    }

    /** loadDone — the list of step ids that have passed their tests. */
    function loadDone() {
        try {
            const raw = window.localStorage.getItem(STORAGE_DONE);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    /** saveDone — store the list of finished step ids. */
    function saveDone(list) {
        try {
            window.localStorage.setItem(STORAGE_DONE, JSON.stringify(list));
        } catch (e) { /* never mind */ }
    }

    let doneList = loadDone();

    /** isDone — has this step already passed all its tests? */
    function isDone(stepId) {
        return doneList.indexOf(stepId) !== -1;
    }

    /** markDone — remember that a step passed. */
    function markDone(stepId) {
        if (!isDone(stepId)) {
            doneList.push(stepId);
            saveDone(doneList);
        }
    }

    /* ------------------------------------------------- reference copies */

    /* One copy of every function a step asks you to write, kept safe so the
       demos still work before you have written your own. */
    const REFERENCE = {};
    TETRIS_STEPS.forEach(function (step) {
        REFERENCE[step.fnName] = window[step.fnName];
    });

    /**
     * makeTicker — a safety net for loops that never stop.
     *
     * INPUT:  none
     * OUTPUT: a function to call once per loop turn; it returns true normally
     *         and throws once a single burst of looping passes 2 seconds
     *
     * ALGORITHM: count the turns. Every 1024th turn look at the clock. If more
     *            than 100 ms went by since the last check we must be in a new
     *            loop, so start timing again; otherwise, if this burst has run
     *            for over 2 seconds, throw.
     *
     * WHY: a `while` loop with a condition that never becomes false would
     *      freeze the whole page. This turns that into a friendly message.
     */
    function makeTicker() {
        let count = 0;
        let lastCheck = 0;
        let burstStart = 0;
        return function () {
            count++;
            if ((count & 1023) !== 0) {
                return true;
            }
            const now = Date.now();
            if (now - lastCheck > 100) {
                burstStart = now;
            }
            lastCheck = now;
            if (now - burstStart > 2000) {
                throw new Error('your loop has been going for 2 seconds without stopping — it probably never ends. Check the condition!');
            }
            return true;
        };
    }

    /**
     * addLoopGuards — plant the safety net inside every while loop.
     *
     * INPUT:  code — the student's code
     * OUTPUT: the same code with `while (` turned into `while (__tick() && `
     *
     * ALGORITHM: a straight text replacement. `__tick()` always returns true,
     *            so the loop behaves exactly the same — unless it runs away.
     */
    function addLoopGuards(code) {
        return code.replace(/\bwhile\s*\(/g, 'while (__tick() && ');
    }

    /**
     * compileFunction — turn the student's text into a real function.
     *
     * INPUT:  code — the text in the editor. fnName — the name we need.
     * OUTPUT: { ok: true, fn: theFunction } or { ok: false, error: 'message' }
     *
     * ALGORITHM: build a new Function whose body is their (guarded) code
     *            followed by "return theFunctionName;". If that throws, the
     *            code has a syntax error and we hand the message back.
     */
    function compileFunction(code, fnName) {
        let factory;
        try {
            factory = new Function('__tick', addLoopGuards(code) + '\n;return typeof ' + fnName +
                                   ' === "function" ? ' + fnName + ' : null;');
        } catch (e) {
            return { ok: false, error: 'Your code has a mistake JavaScript cannot read: ' + e.message };
        }
        let fn;
        try {
            fn = factory(makeTicker());
        } catch (e) {
            return { ok: false, error: 'Your code crashed while loading: ' + e.message };
        }
        if (typeof fn !== 'function') {
            return { ok: false, error: 'I cannot find a function called ' + fnName + '(). Check the spelling — it must match exactly.' };
        }
        return { ok: true, fn: fn };
    }

    /**
     * installFunctions — decide whose code the demo runs.
     *
     * INPUT:  useStudent — true to run the student's versions where possible
     *         currentStep, currentCode — the step being edited right now
     * OUTPUT: true if the current step's own code is being used
     *
     * ALGORITHM:
     *   1. Put every reference version back first.
     *   2. If we want the student's code, replace each FINISHED step's function
     *      with their saved version.
     *   3. Also try the code sitting in the editor right now for this step.
     */
    function installFunctions(useStudent, currentStep, currentCode) {
        TETRIS_STEPS.forEach(function (step) {
            window[step.fnName] = REFERENCE[step.fnName];
        });

        if (!useStudent) {
            return false;
        }

        TETRIS_STEPS.forEach(function (step) {
            if (isDone(step.id)) {
                const saved = loadCode(step.id);
                if (saved) {
                    const built = compileFunction(saved, step.fnName);
                    if (built.ok) {
                        window[step.fnName] = built.fn;
                    }
                }
            }
        });

        if (currentStep && currentCode) {
            const built = compileFunction(currentCode, currentStep.fnName);
            if (built.ok) {
                window[currentStep.fnName] = built.fn;
                return true;
            }
            return false;
        }
        return true;
    }

    /* ------------------------------------------------------------ tests */

    /** describe — show a value the way a person would like to read it. */
    function describe(value) {
        if (value === null) { return 'null'; }
        if (value === undefined) { return 'undefined'; }
        if (typeof value === 'string') { return '"' + value + '"'; }
        try {
            return JSON.stringify(value);
        } catch (e) {
            return String(value);
        }
    }

    /** sameValue — deep comparison, good enough for numbers, strings and arrays. */
    function sameValue(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    /** cloneArgs — give each test its own copy of the inputs. */
    function cloneArgs(args) {
        return JSON.parse(JSON.stringify(args));
    }

    /**
     * runTests — check the student's function against one step's tests.
     *
     * INPUT:  step — a step object. fn — the student's function.
     * OUTPUT: an array of { name, ok, detail } results
     *
     * ALGORITHM: for each test, either call the function with the given
     *            arguments and compare with `expect`, or run the test's own
     *            `check` function. Any crash counts as a failure.
     */
    function runTests(step, fn) {
        const results = [];

        step.tests.forEach(function (test) {
            let result;
            try {
                if (test.check) {
                    const custom = test.check(fn);
                    result = { name: test.name, ok: custom.ok === true, detail: custom.detail || '' };
                } else {
                    const got = fn.apply(null, cloneArgs(test.args));
                    const ok = sameValue(got, test.expect);
                    result = {
                        name: test.name,
                        ok: ok,
                        detail: ok ? '' : (step.fnName + '(' + cloneArgs(test.args).map(describe).join(', ') +
                                ')  gave ' + describe(got) + ', expected ' + describe(test.expect))
                    };
                }
            } catch (e) {
                result = { name: test.name, ok: false, detail: 'it crashed: ' + e.message };
            }
            results.push(result);
        });

        return results;
    }

    /* ------------------------------------------------------------ demos */

    const DEMO_CELL = 20;

    let demo = null;            /* the little game running in the demo panel */
    let demoFlags = {};
    let demoKind = 'board';
    let demoTimer = 0;
    let demoMessage = '';
    let spinType = 'T';
    let spinMatrix = null;

    /**
     * makeSampleBoard — a 10 x 20 field with a realistic pile at the bottom,
     * where exactly two rows are complete.
     *
     * INPUT:  none
     * OUTPUT: a board
     *
     * ALGORITHM: fill the bottom six rows with random blocks, always leaving at
     *            least one gap — except in two rows, which are filled right
     *            across so there is something for your function to find.
     */
    function makeSampleBoard() {
        const board = createEmptyBoard(10, 20);
        const pile = 6;
        const fullRowA = 1 + Math.floor(Math.random() * 2);
        const fullRowB = 4;
        for (let i = 0; i < pile; i++) {
            const y = 20 - pile + i;
            const isFull = (i === fullRowA || i === fullRowB);
            for (let x = 0; x < 10; x++) {
                board[y][x] = (isFull || Math.random() < 0.8) ? 1 : 0;
            }
            if (!isFull) {
                board[y][Math.floor(Math.random() * 10)] = 0;
            }
        }
        return board;
    }

    /**
     * startDemo — build whatever the current step wants to show.
     * INPUT: step. OUTPUT: nothing.
     */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'board';
        demoFlags = (step.demo && step.demo.flags) || {};
        demoMessage = '';
        demoTimer = 0;

        if (demoKind === 'spin') {
            spinType = 'T';
            spinMatrix = createPiece(spinType).cells;
        } else if (demoKind === 'rows') {
            demo = { board: makeSampleBoard() };
        } else if (demoKind === 'final') {
            demo = createGame();
            demo.isPaused = true;
        } else if (demoKind === 'game') {
            demo = {
                board: createEmptyBoard(10, 20),
                piece: null,
                score: 0,
                lines: 0,
                level: 1
            };
            demoSpawn();
        }
    }

    /** demoSpawn — put a new random piece at the top of the demo board. */
    function demoSpawn() {
        const piece = createPiece(randomShapeType());
        piece.x = Math.floor((10 - piece.cells.length) / 2);
        piece.y = 0;
        if (!canPlacePiece(demo.board, piece)) {
            demo.board = createEmptyBoard(10, 20);
            demoMessage = 'The pile reached the top — starting again!';
        }
        demo.piece = piece;
    }

    /** demoMove — slide the demo piece, locking it if it cannot fall. */
    function demoMove(dx, dy) {
        if (!demo || !demo.piece) { return; }
        const moved = movePiece(demo.piece, dx, dy);
        if (canPlacePiece(demo.board, moved)) {
            demo.piece = moved;
        } else if (dy > 0 && demoFlags.lock) {
            demoLock();
        }
    }

    /** demoRotate — turn the demo piece, nudging it away from walls. */
    function demoRotate() {
        if (!demo || !demo.piece) { return; }
        const turned = rotatePiece(demo.piece, true);
        const kicks = [0, -1, 1, -2, 2];
        for (let i = 0; i < kicks.length; i++) {
            const candidate = movePiece(turned, kicks[i], 0);
            if (canPlacePiece(demo.board, candidate)) {
                demo.piece = candidate;
                return;
            }
        }
    }

    /** demoLock — stamp the piece down, clear rows, score, and spawn the next. */
    function demoLock() {
        demo.board = mergePieceIntoBoard(demo.board, demo.piece);

        if (demoFlags.clear) {
            const full = findFullRows(demo.board);
            if (full.length > 0) {
                demo.board = removeRows(demo.board, full);
                demo.lines = demo.lines + full.length;
                if (demoFlags.hud) {
                    demo.score = demo.score + scoreForLines(full.length, demo.level);
                    demo.level = levelForLines(demo.lines);
                }
                demoMessage = 'Cleared ' + full.length + ' row' + (full.length === 1 ? '' : 's') + '!';
            }
        }
        demoSpawn();
    }

    /** demoHardDrop — slam the demo piece to the bottom. */
    function demoHardDrop() {
        if (!demo || !demo.piece) { return; }
        demo.piece = movePiece(demo.piece, 0, dropDistance(demo.board, demo.piece));
        if (demoFlags.lock) {
            demoLock();
        }
    }

    /**
     * updateDemo — let the demo's clock tick.
     * INPUT: elapsed — milliseconds since the last frame. OUTPUT: nothing.
     */
    function updateDemo(elapsed) {
        if (demoKind === 'final') {
            updateGame(demo, elapsed);
            return;
        }
        if (demoKind !== 'game' || !demoFlags.gravity) { return; }

        let interval = 550;
        if (demoFlags.hud) {
            interval = dropIntervalForLevel(demo.level);
        }
        demoTimer = demoTimer + elapsed;
        while (demoTimer >= interval) {
            demoTimer = demoTimer - interval;
            demoMove(0, 1);
        }
    }

    /**
     * drawMatrix — draw one piece matrix in the middle of a canvas.
     * INPUT: ctx, matrix, cellSize, width, height. OUTPUT: nothing.
     */
    function drawMatrix(ctx, matrix, cellSize, width, height) {
        const size = matrix.length;
        ctx.save();
        ctx.translate((width - size * cellSize) / 2, (height - size * cellSize) / 2);
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (matrix[r][c] === 1) {
                    drawBlock(ctx, c, r, cellSize);
                }
            }
        }
        ctx.restore();
    }

    /**
     * drawInvertedRow — paint one row "highlighted" (black stripe, white blocks).
     * INPUT: ctx, rowNumber, columns, cellSize. OUTPUT: nothing.
     */
    function drawInvertedRow(ctx, rowNumber, columns, cellSize) {
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, rowNumber * cellSize, columns * cellSize, cellSize);
        ctx.fillStyle = '#ffffff';
        for (let c = 0; c < columns; c++) {
            ctx.fillRect(c * cellSize + 4, rowNumber * cellSize + 4, cellSize - 8, cellSize - 8);
        }
    }

    /**
     * drawDemo — draw the current demo onto the canvas.
     * INPUT: ctx, canvas. OUTPUT: nothing.
     */
    function drawDemo(ctx, canvas) {
        const width = canvas.width;
        const height = canvas.height;

        try {
            if (demoKind === 'board') {
                const board = createEmptyBoard(10, 20);
                if (!Array.isArray(board) || !Array.isArray(board[0])) {
                    throw new Error('createEmptyBoard did not return a grid yet');
                }
                clearCanvas(ctx, width, height, '#ffffff');
                drawGrid(ctx, board[0].length, board.length, DEMO_CELL);
                drawBoardBlocks(ctx, board, DEMO_CELL);
                drawFrame(ctx, board[0].length * DEMO_CELL, board.length * DEMO_CELL);
                setDemoNote(board.length + ' rows x ' + board[0].length + ' columns, all empty.');
                return;
            }

            if (demoKind === 'rows') {
                const board = demo.board;
                const full = findFullRows(board);
                clearCanvas(ctx, width, height, '#ffffff');
                drawGrid(ctx, 10, 20, DEMO_CELL);
                drawBoardBlocks(ctx, board, DEMO_CELL);
                for (let i = 0; i < full.length; i++) {
                    drawInvertedRow(ctx, full[i], 10, DEMO_CELL);
                }
                drawFrame(ctx, 10 * DEMO_CELL, 20 * DEMO_CELL);
                setDemoNote(full.length === 0
                    ? 'No complete rows found yet.'
                    : 'Complete rows: ' + JSON.stringify(full));
                return;
            }

            if (demoKind === 'spin') {
                clearCanvas(ctx, width, height, '#ffffff');
                drawMatrix(ctx, spinMatrix, 34, width, height);
                drawFrame(ctx, width, height);
                setDemoNote('Piece ' + spinType + ' — press ↻ to turn it.');
                return;
            }

            if (demoKind === 'final') {
                renderGame(ctx, demo, DEMO_CELL);
                setDemoNote('Score ' + demo.score + '  •  Lines ' + demo.lines + '  •  Level ' + demo.level);
                return;
            }

            /* the growing mini-game */
            clearCanvas(ctx, width, height, '#ffffff');
            drawGrid(ctx, 10, 20, DEMO_CELL);
            drawBoardBlocks(ctx, demo.board, DEMO_CELL);
            if (demo.piece) {
                if (demoFlags.ghost) {
                    drawGhost(ctx, movePiece(demo.piece, 0, dropDistance(demo.board, demo.piece)), DEMO_CELL);
                }
                drawPiece(ctx, demo.piece, DEMO_CELL);
            }
            drawFrame(ctx, 10 * DEMO_CELL, 20 * DEMO_CELL);

            let note = demoMessage;
            if (demoFlags.hud) {
                note = 'Score ' + demo.score + '  •  Lines ' + demo.lines + '  •  Level ' + demo.level +
                       (demoMessage ? '  •  ' + demoMessage : '');
            }
            setDemoNote(note || 'Use the buttons under the board.');
        } catch (e) {
            clearCanvas(ctx, width, height, '#ffffff');
            ctx.fillStyle = '#111111';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Waiting for working code…', width / 2, height / 2 - 10);
            ctx.font = '11px monospace';
            ctx.fillText(String(e.message).slice(0, 40), width / 2, height / 2 + 12);
            setDemoNote('The demo stopped: ' + e.message);
        }
    }

    /* ------------------------------------------------------- page wiring */

    let currentIndex = 0;
    let demoUsesStudentCode = false;
    let hintsShown = 0;
    let canvas = null;
    let context = null;
    let lastTime = 0;

    function el(id) {
        return document.getElementById(id);
    }

    function setDemoNote(text) {
        const note = el('demo-note');
        if (note) {
            note.textContent = text;
        }
    }

    /** currentStep — the step object being worked on right now. */
    function currentStep() {
        return TETRIS_STEPS[currentIndex];
    }

    /** isUnlocked — a step opens once every earlier step is finished. */
    function isUnlocked(index) {
        for (let i = 0; i < index; i++) {
            if (!isDone(TETRIS_STEPS[i].id)) {
                return false;
            }
        }
        return true;
    }

    /** buildProgressBar — the row of numbered dots at the top. */
    function buildProgressBar() {
        const bar = el('progress');
        bar.innerHTML = '';
        TETRIS_STEPS.forEach(function (step, index) {
            const dot = document.createElement('button');
            dot.className = 'step-dot';
            dot.textContent = String(index + 1);
            dot.title = step.title;
            if (isDone(step.id)) { dot.className += ' done'; }
            if (index === currentIndex) { dot.className += ' current'; }
            if (!isUnlocked(index)) { dot.className += ' locked'; dot.disabled = true; }
            dot.addEventListener('click', function () {
                if (isUnlocked(index)) {
                    goToStep(index);
                }
            });
            bar.appendChild(dot);
        });

        const doneCount = TETRIS_STEPS.filter(function (s) { return isDone(s.id); }).length;
        el('progress-text').textContent = doneCount + ' of ' + TETRIS_STEPS.length + ' functions written';
    }

    /** listItems — turn an array of strings into an HTML list. */
    function listItems(lines) {
        return lines.map(function (line) {
            return '<li>' + line + '</li>';
        }).join('');
    }

    /** renderStep — put the current step on the page. */
    function renderStep() {
        const step = currentStep();

        el('step-number').textContent = 'Step ' + (currentIndex + 1) + ' of ' + TETRIS_STEPS.length;
        el('step-title').textContent = step.title;
        el('step-adds').textContent = '➕ ' + step.adds;
        el('step-intro').innerHTML = step.intro;

        el('step-spec').innerHTML =
            '<h4>📥 INPUT</h4><p>' + step.spec.input + '</p>' +
            '<h4>📤 OUTPUT</h4><p>' + step.spec.output + '</p>' +
            '<h4>🪜 ALGORITHM</h4><ol>' + listItems(step.spec.algorithm) + '</ol>';

        const warn = el('step-warning');
        if (step.warning) {
            warn.innerHTML = '⚠️ ' + step.warning;
            warn.style.display = 'block';
        } else {
            warn.style.display = 'none';
        }

        const saved = loadCode(step.id);
        el('code-editor').value = saved !== null ? saved : step.starter;

        hintsShown = 0;
        el('hint-box').style.display = 'none';
        el('hint-box').innerHTML = '';
        el('test-results').innerHTML = '';
        el('test-summary').className = 'test-summary';
        el('test-summary').textContent = isDone(step.id)
            ? '✅ You already finished this step — but feel free to write it again.'
            : 'Write your function, then press ▶ Test it.';

        el('demo-caption').textContent = step.demo.caption;
        const isLastStep = currentIndex === TETRIS_STEPS.length - 1;
        el('btn-next').disabled = !isDone(step.id) || isLastStep;
        el('btn-prev').disabled = currentIndex === 0;
        el('finish-panel').style.display = (isLastStep && isDone(step.id)) ? 'block' : 'none';

        sizeCanvasForStep(step);
        setDemoMode(isDone(step.id));
        buildDemoControls(step);
        buildProgressBar();
        window.scrollTo(0, 0);
    }

    /** sizeCanvasForStep — square canvas for the spinning piece, tall for boards. */
    function sizeCanvasForStep(step) {
        if (step.demo.kind === 'spin') {
            canvas.width = 200;
            canvas.height = 200;
        } else {
            canvas.width = 10 * DEMO_CELL;
            canvas.height = 20 * DEMO_CELL;
        }
    }

    /** button — build one demo control button. */
    function button(label, title, onClick) {
        const b = document.createElement('button');
        b.className = 'mono-btn small';
        b.textContent = label;
        b.title = title || label;
        b.addEventListener('click', onClick);
        return b;
    }

    /** buildDemoControls — the buttons under the demo, chosen by the step. */
    function buildDemoControls(step) {
        const bar = el('demo-controls');
        bar.innerHTML = '';
        const kind = step.demo.kind;
        const flags = step.demo.flags || {};

        if (kind === 'spin') {
            bar.appendChild(button('↻ Turn', 'Rotate clockwise', function () {
                spinMatrix = rotateMatrixClockwise(spinMatrix);
            }));
            bar.appendChild(button('🎲 Next piece', 'Try another shape', function () {
                spinType = randomShapeType();
                spinMatrix = createPiece(spinType).cells;
            }));
            return;
        }

        if (kind === 'rows') {
            bar.appendChild(button('🎲 New pile', 'Build a different pile of blocks', function () {
                demo = { board: makeSampleBoard() };
            }));
            return;
        }

        if (kind === 'game') {
            bar.appendChild(button('←', 'Move left', function () { demoMove(-1, 0); }));
            bar.appendChild(button('↻', 'Rotate', function () { demoRotate(); }));
            bar.appendChild(button('→', 'Move right', function () { demoMove(1, 0); }));
            bar.appendChild(button('↓', 'Down one row', function () { demoMove(0, 1); }));
            if (flags.hardDrop) {
                bar.appendChild(button('⇓ Drop', 'Slam it down', function () { demoHardDrop(); }));
            }
            if (flags.levelPicker) {
                bar.appendChild(button('Level −', 'Slower', function () {
                    demo.level = Math.max(1, demo.level - 1);
                }));
                bar.appendChild(button('Level +', 'Faster', function () {
                    demo.level = Math.min(20, demo.level + 1);
                }));
            }
            bar.appendChild(button('↺', 'Clear the demo board', function () { startDemo(step); }));
            return;
        }

        if (kind === 'final') {
            bar.appendChild(button('▶ / ⏸', 'Start or pause', function () { togglePause(demo); }));
            bar.appendChild(button('↺ New game', 'Start again', function () {
                demo = createGame();
                demo.isPaused = false;
            }));
        }
    }

    /**
     * setDemoMode — choose whose code the demo runs and say so on screen.
     * INPUT: useStudent — true for the student's code, false for the goal.
     */
    function setDemoMode(useStudent) {
        const step = currentStep();
        const usedOwn = installFunctions(useStudent, step, el('code-editor').value);
        demoUsesStudentCode = useStudent;

        const status = el('demo-status');
        if (!useStudent) {
            status.textContent = '🎬 Showing the goal — this is the finished version';
            status.className = 'demo-status goal';
        } else if (usedOwn) {
            status.textContent = '🧑‍💻 Running YOUR code';
            status.className = 'demo-status yours';
        } else {
            status.textContent = '🧑‍💻 Your code does not run yet — showing the goal instead';
            status.className = 'demo-status broken';
        }

        el('btn-demo-yours').className = 'mono-btn small' + (useStudent ? ' active' : '');
        el('btn-demo-goal').className = 'mono-btn small' + (useStudent ? '' : ' active');

        startDemo(step);
    }

    /** showTestResults — draw the pass/fail list. */
    function showTestResults(results, step) {
        const list = el('test-results');
        list.innerHTML = '';

        let passed = 0;
        results.forEach(function (result) {
            if (result.ok) { passed++; }
            const item = document.createElement('li');
            item.className = result.ok ? 'test-pass' : 'test-fail';
            item.innerHTML = (result.ok ? '✅ ' : '❌ ') + '<strong>' + result.name + '</strong>' +
                (result.detail ? '<span class="detail">' + result.detail + '</span>' : '');
            list.appendChild(item);
        });

        const summary = el('test-summary');
        if (passed === results.length) {
            summary.className = 'test-summary pass';
            summary.textContent = '🎉 All ' + results.length + ' tests passed! ' + step.adds +
                                  ' Press "Next step →" to carry on.';
        } else {
            summary.className = 'test-summary fail';
            summary.textContent = passed + ' of ' + results.length +
                                  ' tests passed. Read the first ❌ carefully — it tells you what went wrong.';
        }
    }

    /** handleTest — the ▶ Test it button. */
    function handleTest() {
        const step = currentStep();
        const code = el('code-editor').value;
        saveCode(step.id, code);

        const built = compileFunction(code, step.fnName);
        if (!built.ok) {
            el('test-results').innerHTML = '';
            const summary = el('test-summary');
            summary.className = 'test-summary fail';
            summary.textContent = '❌ ' + built.error;
            return;
        }

        /* Everything except the function being tested uses the finished version,
           so one small mistake in an earlier step cannot confuse this one. */
        installFunctions(false, null, null);
        const results = runTests(step, built.fn);
        showTestResults(results, step);

        const allPassed = results.every(function (r) { return r.ok; });
        if (allPassed) {
            markDone(step.id);
            el('btn-next').disabled = (currentIndex === TETRIS_STEPS.length - 1);
            setDemoMode(true);
            buildProgressBar();
            if (currentIndex === TETRIS_STEPS.length - 1) {
                el('finish-panel').style.display = 'block';
            }
        } else {
            setDemoMode(demoUsesStudentCode);
        }
    }

    /** goToStep — open another step. */
    function goToStep(index) {
        if (index < 0 || index >= TETRIS_STEPS.length) { return; }
        currentIndex = index;
        renderStep();
    }

    /** handleHint — reveal one more hint each time it is pressed. */
    function handleHint() {
        const step = currentStep();
        const box = el('hint-box');
        if (hintsShown >= step.hints.length) {
            box.innerHTML += '<p>That is every hint — try the 🔑 answer button if you are really stuck.</p>';
            return;
        }
        hintsShown++;
        box.style.display = 'block';
        box.innerHTML = '';
        for (let i = 0; i < hintsShown; i++) {
            box.innerHTML += '<p>💡 <strong>Hint ' + (i + 1) + ':</strong> ' + step.hints[i] + '</p>';
        }
    }

    /** handleAnswer — put a correct version in the editor. */
    function handleAnswer() {
        const step = currentStep();
        if (!window.confirm('Show one correct answer? Try your own version first — that is where the learning happens!')) {
            return;
        }
        el('code-editor').value = step.answer;
        saveCode(step.id, step.answer);
        el('test-summary').className = 'test-summary';
        el('test-summary').textContent = 'Read the answer, then press ▶ Test it. Afterwards, delete it and write it again from memory!';
    }

    /** handleReset — go back to the empty starter code. */
    function handleReset() {
        const step = currentStep();
        el('code-editor').value = step.starter;
        saveCode(step.id, step.starter);
        el('test-results').innerHTML = '';
        el('test-summary').className = 'test-summary';
        el('test-summary').textContent = 'Back to the beginning. You can do this!';
    }

    /** handleKeyboardForFinalDemo — only the last step plays with the keyboard. */
    function handleKeyboardForFinalDemo(event) {
        if (demoKind !== 'final' || !demo) { return; }
        const tag = event.target && event.target.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT') { return; }

        const action = actionForKey(event.key);
        if (action === null) { return; }
        event.preventDefault();

        if (action === 'left') { tryMove(demo, -1, 0); }
        else if (action === 'right') { tryMove(demo, 1, 0); }
        else if (action === 'softDrop') { softDrop(demo); }
        else if (action === 'rotateRight') { tryRotate(demo, true); }
        else if (action === 'rotateLeft') { tryRotate(demo, false); }
        else if (action === 'hardDrop') { hardDrop(demo); }
        else if (action === 'pause') { togglePause(demo); }
        else if (action === 'restart') { demo = createGame(); demo.isPaused = false; }
    }

    /** loop — redraw the demo about 60 times a second. */
    function loop(timestamp) {
        if (lastTime === 0) { lastTime = timestamp; }
        let elapsed = timestamp - lastTime;
        lastTime = timestamp;
        if (elapsed > 100) { elapsed = 100; }

        try {
            updateDemo(elapsed);
        } catch (e) {
            demoMessage = 'stopped: ' + e.message;
        }
        drawDemo(context, canvas);
        window.requestAnimationFrame(loop);
    }

    /** enableTabKey — let Tab indent inside the editor instead of jumping away. */
    function enableTabKey(textarea) {
        textarea.addEventListener('keydown', function (event) {
            if (event.key === 'Tab') {
                event.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.slice(0, start) + '    ' + textarea.value.slice(end);
                textarea.selectionStart = textarea.selectionEnd = start + 4;
            }
        });
    }

    /** setUpWorkshop — everything that happens once, when the page loads. */
    function setUpWorkshop() {
        canvas = el('demo-canvas');
        context = canvas.getContext('2d');

        el('btn-test').addEventListener('click', handleTest);
        el('btn-hint').addEventListener('click', handleHint);
        el('btn-answer').addEventListener('click', handleAnswer);
        el('btn-reset').addEventListener('click', handleReset);
        el('btn-next').addEventListener('click', function () { goToStep(currentIndex + 1); });
        el('btn-prev').addEventListener('click', function () { goToStep(currentIndex - 1); });
        el('btn-demo-yours').addEventListener('click', function () { setDemoMode(true); });
        el('btn-demo-goal').addEventListener('click', function () { setDemoMode(false); });

        el('btn-restart-course').addEventListener('click', function () {
            if (window.confirm('Erase all your saved code and start the whole course again?')) {
                TETRIS_STEPS.forEach(function (step) {
                    try { window.localStorage.removeItem(STORAGE_CODE + step.id); } catch (e) { /* ignore */ }
                });
                doneList = [];
                saveDone(doneList);
                el('finish-panel').style.display = 'none';
                goToStep(0);
            }
        });

        el('code-editor').addEventListener('input', function () {
            saveCode(currentStep().id, el('code-editor').value);
        });
        enableTabKey(el('code-editor'));

        document.addEventListener('keydown', handleKeyboardForFinalDemo);

        /* Start on the first step that is not finished yet. */
        let start = 0;
        for (let i = 0; i < TETRIS_STEPS.length; i++) {
            if (!isDone(TETRIS_STEPS[i].id)) { start = i; break; }
            start = i;
        }
        goToStep(start);

        window.requestAnimationFrame(loop);
    }

    document.addEventListener('DOMContentLoaded', setUpWorkshop);
})();
