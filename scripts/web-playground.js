/* ============================================================
   Web Playground — a tiny browser inside the lesson page.

   The Python lessons send code to Pyodide. These lessons need something
   different: HTML has to be RENDERED, JavaScript has to RUN, and a canvas has
   to be DRAWN ON. So every task is run inside a sandboxed <iframe>, which is
   a real browser page — the same thing the student will build one day.

   Markup expected for each task:

   <div class="task" data-kind="js" data-expected="Hello!">
       <div class="task-head">
           <span class="task-badge">⭐</span>
           <h3>Task title</h3>
           <span class="task-difficulty diff-easy">Easy</span>
       </div>
       <p class="task-goal">What to do…</p>
       <div class="playground web-playground">
           <textarea class="code-input" spellcheck="false"></textarea>
           <div class="pg-buttons">…</div>
           <div class="web-stage"><iframe class="web-preview" …></iframe></div>
           <pre class="pg-output" aria-live="polite"></pre>
       </div>
       <div class="solution" hidden><pre>… reference solution …</pre></div>
   </div>

   data-kind says what the student is writing, and therefore what to wrap it in:

     page    — a whole HTML document, used exactly as typed
     html    — the inside of <body>; the rest of the page is supplied
     js      — JavaScript; console.log appears in the output box
     canvas  — JavaScript, with `canvas` and `ctx` already made for it

   How Check knows:

     data-expected       text the output must match (js) or contain (html/page)
     data-check          "contains" to loosen an exact match
     data-expect-tags    CSS selectors the page must contain, comma separated
     data-expect-calls   canvas methods that must have been used

   Nothing is read back out of the iframe by reaching into it: the page posts
   its own results home with postMessage. That keeps working when the iframe
   has no origin of its own — which is what `sandbox` gives it, and what a
   page opened straight off the disk gets too.
   ============================================================ */

(function () {
    'use strict';

    /* Every canvas method worth noticing when a drawing task is checked. */
    const CANVAS_METHODS = ['fillRect', 'strokeRect', 'clearRect', 'beginPath', 'closePath',
        'moveTo', 'lineTo', 'arc', 'arcTo', 'ellipse', 'rect', 'roundRect',
        'quadraticCurveTo', 'bezierCurveTo', 'fill', 'stroke', 'fillText', 'strokeText',
        'save', 'restore', 'translate', 'rotate', 'scale', 'setLineDash'];

    const CANVAS_WIDTH = 320;
    const CANVAS_HEIGHT = 240;

    let nextToken = 1;
    const waiting = {};

    window.addEventListener('message', function (event) {
        const note = event.data;
        if (!note || note.from !== 'web-playground') { return; }
        const settle = waiting[note.token];
        if (settle) {
            delete waiting[note.token];
            settle(note);
        }
    });

    /** escapeHtml — text that must not become markup. */
    function escapeHtml(text) {
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /**
     * reporter — the little program every preview page carries.
     *
     * It collects what console.log said, which canvas methods were used and
     * any error, then posts the lot back to the lesson page. It is written as
     * one string because it has to travel inside the iframe's own HTML.
     */
    function reporter(token, tags) {
        return '<script data-stage>(function () {\n' +
            'var TOKEN = ' + JSON.stringify(token) + ';\n' +
            'var TAGS = ' + JSON.stringify(tags) + ';\n' +
            'var CANVAS_METHODS = ' + JSON.stringify(CANVAS_METHODS) + ';\n' +
            'window.__lines = [];\n' +
            'window.__calls = [];\n' +
            'function show(value) {\n' +
            '    if (typeof value === "string") { return value; }\n' +
            '    try { return JSON.stringify(value); } catch (e) { return String(value); }\n' +
            '}\n' +
            'console.log = function () {\n' +
            '    window.__lines.push(Array.prototype.map.call(arguments, show).join(" "));\n' +
            '    var box = document.getElementById("__out");\n' +
            '    if (box) { box.textContent = window.__lines.join("\\n"); }\n' +
            '};\n' +
            'console.info = console.warn = console.error = console.log;\n' +
            'window.__watchCanvas = function (ctx) {\n' +
            '    CANVAS_METHODS.forEach(function (name) {\n' +
            '        if (typeof ctx[name] !== "function") { return; }\n' +
            '        var real = ctx[name];\n' +
            '        ctx[name] = function () {\n' +
            '            window.__calls.push(name);\n' +
            '            return real.apply(ctx, arguments);\n' +
            '        };\n' +
            '    });\n' +
            '};\n' +
            'window.__report = function (error) {\n' +
            '    var found = [];\n' +
            '    TAGS.forEach(function (selector) {\n' +
            '        try {\n' +
            '            var hits = document.querySelectorAll(selector);\n' +
            '            for (var i = 0; i < hits.length; i++) {\n' +
            /* Skip anything the playground itself put on the page: its own
               style and script must not answer for the student's. */
            '                if (!hits[i].hasAttribute("data-stage")) { found.push(selector); break; }\n' +
            '            }\n' +
            '        } catch (e) { /* a selector we cannot read is simply not found */ }\n' +
            '    });\n' +
            '    parent.postMessage({\n' +
            '        from: "web-playground", token: TOKEN,\n' +
            '        output: window.__lines.join("\\n"),\n' +
            '        calls: window.__calls, found: found,\n' +
            '        text: document.body ? document.body.innerText : "",\n' +
            '        error: error ? String(error.message || error) : ""\n' +
            '    }, "*");\n' +
            '};\n' +
            'window.onerror = function (message) { window.__report(message); };\n' +
            '}());<\/script>';
    }

    /** runnerFor — the student's code, wrapped so a mistake is reported not lost. */
    function runnerFor(code) {
        return '<script data-stage>\ntry {\n' + code + '\n} catch (e) { window.__report(e); throw e; }\n' +
               'window.__report(null);\n<\/script>';
    }

    /* The canvas edge is a GUIDE, not ink.
       It used to be a solid black 2px border, which looks exactly like
       something a student drew with strokeRect — so a child reading "draw an
       X" reasonably wondered whether the box round it was theirs to draw too.
       A pale dashed line cannot be mistaken for a drawing, and `outline`
       rather than `border` means it takes no space and shifts nothing. */
    const STAGE_STYLE =
        'body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; ' +
        'margin: 0; padding: 14px; color: #222; background: #fff; } ' +
        '#__out { font-family: Menlo, Consolas, monospace; font-size: 13px; ' +
        'white-space: pre-wrap; margin: 0; color: #111; } ' +
        'canvas { display: block; background: #fff; max-width: 100%; height: auto; ' +
        'outline: 1px dashed #c9c9c9; }';

    /* Drawing tasks get their canvas centred, so the space around it reads as
       the frame's margin rather than as part of the picture. */
    const CANVAS_STAGE_STYLE =
        'body { display: flex; align-items: center; justify-content: center; ' +
        'min-height: 100vh; box-sizing: border-box; }';

    /**
     * buildPage — the whole little document for one run.
     *
     * INPUT:  kind, code, token, tags
     * OUTPUT: HTML for the iframe's srcdoc
     */
    function buildPage(kind, code, token, tags) {
        const head = '<meta charset="utf-8"><style data-stage>' + STAGE_STYLE + '</style>' +
                     reporter(token, tags);

        if (kind === 'page') {
            /* The student wrote the whole document, so slip the reporter in
               afterwards and let their markup stand exactly as typed. */
            return code + '\n<style data-stage>' + STAGE_STYLE + '</style>' + reporter(token, tags) +
                   '<script data-stage>window.__report(null);<\/script>';
        }
        if (kind === 'html') {
            return '<!DOCTYPE html><html><head>' + head + '</head><body>\n' + code +
                   '\n<script data-stage>window.__report(null);<\/script></body></html>';
        }
        if (kind === 'canvas') {
            const prelude = 'var canvas = document.getElementById("board");\n' +
                            'var ctx = canvas.getContext("2d");\n' +
                            'window.__watchCanvas(ctx);\n';
            return '<!DOCTYPE html><html><head>' + head +
                   '<style data-stage>' + CANVAS_STAGE_STYLE + '</style></head><body>' +
                   '<canvas data-stage id="board" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT +
                   '"></canvas>' + runnerFor(prelude + code) + '</body></html>';
        }
        /* kind === 'js' */
        return '<!DOCTYPE html><html><head>' + head + '</head><body>' +
               '<pre data-stage id="__out"></pre>' + runnerFor(code) + '</body></html>';
    }

    /**
     * run — show the student's code and wait for the page to report back.
     * OUTPUT: a promise for { output, calls, found, text, error }
     */
    /**
     * freshFrame — put a brand-new, empty preview in place of the old one.
     *
     * WHY replace it rather than just set srcdoc again: an iframe that has
     * already loaded does not reliably load a second time from a new srcdoc,
     * so the second Run would quietly show the first Run's picture. Swapping
     * the whole element always loads — and it throws away whatever the last
     * run left behind, which matters when a student's first loop is the one
     * that never ends.
     */
    function freshFrame(task) {
        /* .web-preview is the student's own frame. The goal beside it is a
           .goal-preview and is deliberately left alone. */
        const old = task.querySelector('.web-preview');
        const frame = document.createElement('iframe');
        frame.className = old.className;
        frame.title = old.title;
        frame.setAttribute('sandbox', old.getAttribute('sandbox') || 'allow-scripts');
        old.replaceWith(frame);
        return frame;
    }

    function run(task, code) {
        const kind = task.dataset.kind || 'js';
        const tags = splitList(task.dataset.expectTags);
        const token = 'run-' + (nextToken++);
        const frame = freshFrame(task);

        return new Promise(function (settle) {
            let done = false;
            waiting[token] = function (note) { done = true; settle(note); };
            frame.srcdoc = buildPage(kind, code, token, tags);

            /* A page that never reports — a syntax error before the reporter
               even runs — must not leave the student staring at nothing. */
            window.setTimeout(function () {
                if (done) { return; }
                delete waiting[token];
                settle({ output: '', calls: [], found: [], text: '',
                         error: 'Your code could not be read. Check for a missing bracket or quote.' });
            }, 2500);
        });
    }

    function splitList(text) {
        return String(text || '').split(',').map(function (part) { return part.trim(); })
                                 .filter(Boolean);
    }

    function normalize(text) {
        return String(text).replace(/[ \t]+$/gm, '').replace(/\n+$/g, '').trim();
    }

    /** showResult — put the run's news in the output box. */
    function showResult(task, result) {
        const output = task.querySelector('.pg-output');
        const kind = task.dataset.kind || 'js';
        output.classList.remove('error', 'success');

        if (result.error) {
            output.textContent = '⚠️ ' + result.error;
            output.classList.add('error');
            return;
        }
        if (kind === 'js') {
            output.textContent = result.output || '✅ It ran, but printed nothing. Add a console.log() to see something!';
            return;
        }
        if (kind === 'canvas') {
            output.textContent = result.calls.length > 0
                ? '🎨 Drawn with: ' + [...new Set(result.calls)].join(', ')
                : '✅ It ran, but nothing was drawn yet.';
            return;
        }
        output.textContent = result.output
            ? result.output
            : '✅ Your page is showing above.';
    }

    /**
     * judge — did the task's own conditions pass?
     * OUTPUT: { ok, why } — why is only filled in when it did not.
     */
    function judge(task, result) {
        if (result.error) {
            return { ok: false, why: 'it stopped with an error: ' + result.error };
        }

        const wantTags = splitList(task.dataset.expectTags);
        const missingTags = wantTags.filter(function (t) { return result.found.indexOf(t) === -1; });
        if (missingTags.length > 0) {
            return { ok: false, why: 'the page still needs: ' + missingTags.join(', ') };
        }

        const wantCalls = splitList(task.dataset.expectCalls);
        const missingCalls = wantCalls.filter(function (c) { return result.calls.indexOf(c) === -1; });
        if (missingCalls.length > 0) {
            return { ok: false, why: 'the drawing still needs: ' +
                     missingCalls.map(function (c) { return c + '()'; }).join(', ') };
        }

        const expected = normalize(task.dataset.expected || '');
        if (expected !== '') {
            const kind = task.dataset.kind || 'js';
            const got = normalize(kind === 'js' ? result.output : result.text);
            const loose = task.dataset.check === 'contains' || kind !== 'js';
            const ok = loose ? got.indexOf(expected) !== -1 : got === expected;
            if (!ok) {
                return { ok: false, why: 'the ' + (kind === 'js' ? 'output' : 'page') +
                         ' should ' + (loose ? 'contain' : 'be') + ':\n' + expected +
                         '\n\nbut it was:\n' + (got || '(nothing)') };
            }
        }
        return { ok: true };
    }

    /**
     * showGoal — run the task's own answer, so the student can see the aim.
     *
     * ALGORITHM: the reference answer is already on the page, behind the
     *            Solution button. Run it in a second, read-only preview and
     *            show whatever it produces:
     *
     *              a drawing or a page — show the preview itself
     *              JavaScript          — show what it printed
     *
     * WHY: "draw a house" does not say what the house looks like, and even
     *      "make a card" leaves a lot open. A picture of the finished thing
     *      is part of the requirement, not a hint. And because it is made
     *      FROM the answer, the picture and the answer can never disagree.
     */
    function showGoal(task) {
        if (task.dataset.goalShown === 'yes') { return; }
        const frame = task.querySelector('.goal-preview');
        const answer = task.querySelector('.solution pre');
        if (!frame || !answer) { return; }

        task.dataset.goalShown = 'yes';
        const kind = task.dataset.kind || 'js';
        const token = 'goal-' + (nextToken++);
        const box = task.querySelector('.goal-output');

        /* A JavaScript answer has nothing to look at, so catch what it
           printed and show that instead of the blank page it drew. */
        if (kind === 'js' && box) {
            box.textContent = 'running…';
            waiting[token] = function (note) {
                box.textContent = note.error
                    ? '⚠️ ' + note.error
                    : (note.output || '(it prints nothing)');
            };
        }

        frame.srcdoc = buildPage(kind, answer.textContent, token, []);
    }

    /* The Practice panel starts hidden, and a hidden iframe does not load.
       So the goals are drawn the moment the panel is first shown. */
    function showGoals() {
        document.querySelectorAll('.task').forEach(showGoal);
    }

    function setupTask(task) {
        const textarea = task.querySelector('.code-input');
        const output = task.querySelector('.pg-output');
        const runBtn = task.querySelector('.run-btn');
        const checkBtn = task.querySelector('.check-btn');
        const resetBtn = task.querySelector('.reset-btn');
        const solutionBtn = task.querySelector('.solution-btn');
        const solution = task.querySelector('.solution');
        if (!textarea || !output) { return; }

        /* Same rule as the Python lessons: every playground starts blank, and
           the student writes all of it. Any text sitting in the HTML is a note
           to whoever maintains the page, not a head start for the learner. */
        textarea.value = '';

        textarea.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = textarea.selectionStart, en = textarea.selectionEnd;
                textarea.value = textarea.value.slice(0, s) + '    ' + textarea.value.slice(en);
                textarea.selectionStart = textarea.selectionEnd = s + 4;
            }
        });

        if (runBtn) {
            runBtn.addEventListener('click', function () {
                run(task, textarea.value).then(function (result) { showResult(task, result); });
            });
        }

        if (checkBtn) {
            checkBtn.addEventListener('click', function () {
                run(task, textarea.value).then(function (result) {
                    showResult(task, result);
                    const verdict = judge(task, result);
                    if (verdict.ok) {
                        output.classList.remove('error');
                        output.classList.add('success');
                        output.textContent += '\n\n🎉 Correct! Great job — task complete!';
                        task.classList.add('task-done');
                    } else {
                        output.classList.remove('success');
                        output.classList.add('error');
                        output.textContent += '\n\n🤔 Not quite yet — ' + verdict.why;
                    }
                });
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                textarea.value = '';
                output.textContent = '';
                output.classList.remove('error', 'success');
                freshFrame(task);
            });
        }

        if (solutionBtn && solution) {
            solutionBtn.addEventListener('click', function () {
                solution.hidden = !solution.hidden;
                solutionBtn.textContent = solution.hidden ? '💡 Solution' : '🙈 Hide Solution';
            });
        }

        /* A JavaScript task has nothing to look at until it runs. */
        if ((task.dataset.kind || 'js') === 'js') {
            const stage = task.querySelector('.web-stage');
            if (stage) { stage.classList.add('stage-quiet'); }
        }
    }

    /* Description / Practice tab switching, same as the Python lessons. */
    function setupTabs() {
        const tabs = document.querySelectorAll('.lesson-tab');
        if (!tabs.length) { return; }
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');
                document.querySelectorAll('.tab-panel').forEach(function (panel) {
                    panel.style.display = panel.id === tab.dataset.panel ? 'block' : 'none';
                });
                if (tab.dataset.panel === 'practice') { showGoals(); }
            });
        });
    }

    /* The little live examples in the Description tab: read-only, already
       filled in, and run as soon as you scroll to them. */
    function setupDemos() {
        document.querySelectorAll('.web-demo').forEach(function (demo) {
            const source = demo.querySelector('.demo-code');
            const frame = demo.querySelector('.web-preview');
            if (!source || !frame) { return; }
            const kind = demo.dataset.kind || 'html';
            frame.srcdoc = buildPage(kind, source.textContent, 'demo-' + (nextToken++), []);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupTabs();
        setupDemos();
        document.querySelectorAll('.task').forEach(setupTask);

        /* If the Practice panel is already showing, the goals are needed now. */
        const practice = document.getElementById('practice');
        if (practice && practice.style.display !== 'none') { showGoals(); }
    });

    /* Handy for tests. */
    window.WebPlayground = { buildPage: buildPage, judge: judge, escapeHtml: escapeHtml };
})();
