/* ============================================================
   workshop.js — the engine behind every "Build it yourself" page

   Both workshops (Tetris and Snake) use this same file. It knows nothing
   about either game: it handles the steps, the editor, the tests, the
   progress dots and the demo panel, and asks the game's own demo module to
   draw whatever should be showing.

   How a workshop works:

   * The finished game's libraries are already loaded, so every function the
     student is asked to write already exists. We keep a copy of each one and
     call it the REFERENCE version.

   * When the student presses Test we build their code into a real function and
     run that step's checks on it.

   * When their version passes we INSTALL it — their function replaces the
     reference one everywhere — so from then on the demo really is running
     their code.

   * The demo panel can show either "the goal" (reference code) or "your code",
     so the student can always see what they are aiming at.

   To start a workshop, call:

       startWorkshop({
           storagePrefix: 'snake-build',   // where work is saved in the browser
           steps: SNAKE_STEPS,             // the step definitions
           demo: { sizeCanvas, start, update, draw, controls, onKey },
           engine: { compile, install, runTests }   // optional
       });

   The `engine` is how the same page can teach a different language. Leave it
   out and the workshop checks JavaScript, exactly as written below. The Python
   workshops pass in an engine that runs the student's code inside Pyodide
   instead — everything else on the page works the same way.

   The demo module gets called like this:

       sizeCanvas(step, canvas)          set canvas.width / canvas.height
       start(step)                       build a fresh demo
       update(step, elapsedMs)           let time pass
       draw(step, ctx, canvas, setNote)  paint it; setNote('...') writes the
                                         line of text under the canvas
       controls(step, addButton)         addButton('↻', 'Rotate', fn)
       onKey(step, event)                optional: key presses (not while the
                                         student is typing in the editor)
   ============================================================ */

function startWorkshop(config) {
    'use strict';

    const STEPS = config.steps;
    const DEMO = config.demo;
    const ENGINE = config.engine || {};
    const STORAGE_CODE = config.storagePrefix + '-code-';
    const STORAGE_DONE = config.storagePrefix + '-done';

    /* ---------------------------------------------------------- storage */

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

    /* One copy of every function a step asks for, kept safe so the demos still
       work before the student has written their own. */
    const REFERENCE = {};
    STEPS.forEach(function (step) {
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
     * WHY: a `while` loop whose condition never becomes false would freeze the
     *      whole page. This turns that into a friendly message.
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
    function compileFunction(code, fnName, step) {
        if (ENGINE.compile) {
            return ENGINE.compile(code, step);
        }
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
     *         step, code — the step being edited right now and its editor text
     * OUTPUT: true if the current step's own code is being used
     *
     * ALGORITHM:
     *   1. Put every reference version back first.
     *   2. If we want the student's code, replace each FINISHED step's function
     *      with their saved version.
     *   3. Also try the code sitting in the editor right now for this step.
     */
    function installFunctions(useStudent, step, code) {
        if (ENGINE.install) {
            return ENGINE.install(useStudent, step, code, STEPS, isDone, loadCode);
        }
        STEPS.forEach(function (other) {
            window[other.fnName] = REFERENCE[other.fnName];
        });

        if (!useStudent) {
            return false;
        }

        STEPS.forEach(function (other) {
            if (isDone(other.id)) {
                const saved = loadCode(other.id);
                if (saved) {
                    const built = compileFunction(saved, other.fnName, other);
                    if (built.ok) {
                        window[other.fnName] = built.fn;
                    }
                }
            }
        });

        if (step && code) {
            const built = compileFunction(code, step.fnName, step);
            if (built.ok) {
                window[step.fnName] = built.fn;
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

    /** sameValue — deep comparison, good enough for numbers, strings, arrays and simple objects. */
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
        if (ENGINE.runTests) {
            return ENGINE.runTests(step, fn);
        }
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

    /** setDemoNote — write the line of text under the demo canvas. */
    function setDemoNote(text) {
        const note = el('demo-note');
        if (note) {
            note.textContent = text;
        }
    }

    /** currentStep — the step being worked on right now. */
    function currentStep() {
        return STEPS[currentIndex];
    }

    /** isUnlocked — a step opens once every earlier step is finished. */
    function isUnlocked(index) {
        for (let i = 0; i < index; i++) {
            if (!isDone(STEPS[i].id)) {
                return false;
            }
        }
        return true;
    }

    /** buildProgressBar — the row of numbered dots at the top. */
    function buildProgressBar() {
        const bar = el('progress');
        bar.innerHTML = '';
        STEPS.forEach(function (step, index) {
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

        const doneCount = STEPS.filter(function (s) { return isDone(s.id); }).length;
        el('progress-text').textContent = doneCount + ' of ' + STEPS.length + ' functions written';
    }

    /** listItems — turn an array of strings into HTML list items. */
    function listItems(lines) {
        return lines.map(function (line) {
            return '<li>' + line + '</li>';
        }).join('');
    }

    /** renderStep — put the current step on the page. */
    function renderStep() {
        const step = currentStep();

        el('step-number').textContent = 'Step ' + (currentIndex + 1) + ' of ' + STEPS.length;
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

        const isLastStep = currentIndex === STEPS.length - 1;
        el('btn-next').disabled = !isDone(step.id) || isLastStep;
        el('btn-prev').disabled = currentIndex === 0;
        el('finish-panel').style.display = (isLastStep && isDone(step.id)) ? 'block' : 'none';

        DEMO.sizeCanvas(step, canvas);
        setDemoMode(isDone(step.id));
        buildDemoControls(step);
        buildProgressBar();
        window.scrollTo(0, 0);
    }

    /** addButton — build one demo control button (handed to the demo module). */
    function addButton(label, title, onClick) {
        const b = document.createElement('button');
        b.className = 'mono-btn small';
        b.textContent = label;
        b.title = title || label;
        b.addEventListener('click', onClick);
        el('demo-controls').appendChild(b);
        return b;
    }

    /** buildDemoControls — let the game decide which buttons its demo needs. */
    function buildDemoControls(step) {
        el('demo-controls').innerHTML = '';
        DEMO.controls(step, addButton);
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

        DEMO.start(step);
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

        const built = compileFunction(code, step.fnName, step);
        if (!built.ok) {
            el('test-results').innerHTML = '';
            const summary = el('test-summary');
            summary.className = 'test-summary fail';
            summary.textContent = '❌ ' + built.error;
            return;
        }

        /* Everything except the function being tested uses the finished
           version, so one small mistake in an earlier step cannot confuse
           this one. */
        installFunctions(false, null, null);
        const results = runTests(step, built.fn);
        showTestResults(results, step);

        const allPassed = results.every(function (r) { return r.ok; });
        if (allPassed) {
            markDone(step.id);
            el('btn-next').disabled = (currentIndex === STEPS.length - 1);
            setDemoMode(true);
            buildProgressBar();
            if (currentIndex === STEPS.length - 1) {
                el('finish-panel').style.display = 'block';
            }
        } else {
            setDemoMode(demoUsesStudentCode);
        }
    }

    /** goToStep — open another step. */
    function goToStep(index) {
        if (index < 0 || index >= STEPS.length) { return; }
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

    /** handleKey — pass key presses to the demo, unless the student is typing. */
    function handleKey(event) {
        if (!DEMO.onKey) { return; }
        const tag = event.target && event.target.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT') { return; }
        DEMO.onKey(currentStep(), event);
    }

    /** loop — redraw the demo about 60 times a second. */
    function loop(timestamp) {
        if (lastTime === 0) { lastTime = timestamp; }
        let elapsed = timestamp - lastTime;
        lastTime = timestamp;
        if (elapsed > 100) { elapsed = 100; }

        const step = currentStep();
        try {
            DEMO.update(step, elapsed);
        } catch (e) {
            setDemoNote('The demo stopped: ' + e.message);
        }
        DEMO.draw(step, context, canvas, setDemoNote);
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
                STEPS.forEach(function (step) {
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

        document.addEventListener('keydown', handleKey);

        /* Start on the first step that is not finished yet. */
        let start = 0;
        for (let i = 0; i < STEPS.length; i++) {
            if (!isDone(STEPS[i].id)) { start = i; break; }
            start = i;
        }
        goToStep(start);

        window.requestAnimationFrame(loop);
    }

    /* The JavaScript workshops start as soon as the page is ready. A Python
       workshop calls startWorkshop later, once Pyodide has finished loading —
       by which time DOMContentLoaded has already been and gone, so check. */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setUpWorkshop);
    } else {
        setUpWorkshop();
    }
}
