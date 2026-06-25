/* ============================================================
   Python Playground — reusable embedded code runner
   Powered by Pyodide (real CPython compiled to WebAssembly).
   Used by every lesson's "Practice" tab.

   Markup expected for each task:

   <div class="task" data-expected="Hello, World!">
       <div class="task-head">
           <span class="task-badge">⭐</span>
           <h3>Task title</h3>
       </div>
       <p class="task-goal">What to do…</p>
       <div class="playground">
           <textarea class="code-input" spellcheck="false">… starter code …</textarea>
           <div class="pg-buttons">
               <button class="run-btn">▶ Run</button>
               <button class="check-btn">✓ Check</button>
               <button class="reset-btn">↺ Reset</button>
               <button class="solution-btn">💡 Solution</button>
           </div>
           <pre class="pg-output" aria-live="polite"></pre>
       </div>
       <div class="solution" hidden>
           <pre>… reference solution …</pre>
       </div>
   </div>

   - data-expected (optional): exact text the program should print. The
     Check button compares the trimmed output against this value.
   - data-check (optional): "contains" makes Check pass when the output
     merely contains data-expected instead of matching it exactly.
   ============================================================ */

(function () {
    'use strict';

    const PYODIDE_VERSION = 'v0.26.4';
    const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

    let pyodidePromise = null;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Failed to load ' + src));
            document.head.appendChild(s);
        });
    }

    function getPyodide() {
        if (!pyodidePromise) {
            pyodidePromise = (async () => {
                await loadScript(PYODIDE_BASE + 'pyodide.js');
                /* global loadPyodide */
                return await loadPyodide({ indexURL: PYODIDE_BASE });
            })();
        }
        return pyodidePromise;
    }

    // Run a chunk of Python and stream stdout/stderr into outputEl.
    async function runCode(code, outputEl, runBtn) {
        outputEl.classList.remove('error', 'success');
        outputEl.textContent = '🐍 Starting Python…';
        if (runBtn) { runBtn.disabled = true; runBtn.dataset.label = runBtn.textContent; runBtn.textContent = '⏳ Loading…'; }

        let py;
        try {
            py = await getPyodide();
        } catch (e) {
            outputEl.textContent = '⚠️ Could not load Python. Check your internet connection and try again.';
            outputEl.classList.add('error');
            if (runBtn) { runBtn.disabled = false; runBtn.textContent = runBtn.dataset.label || '▶ Run'; }
            return '';
        }

        let captured = '';
        outputEl.textContent = '';
        // Use the raw byte `write` handler instead of `batched`: batched only
        // delivers complete lines, so output ending without a newline (e.g.
        // print(..., end="")) would be buffered and lost.
        const decoder = new TextDecoder('utf-8');
        const write = (buf) => {
            const text = decoder.decode(buf, { stream: true });
            captured += text;
            outputEl.textContent += text;
            return buf.length;
        };
        py.setStdout({ write });
        py.setStderr({ write });
        py.setStdin({
            stdin: () => {
                const v = window.prompt('Your program is asking for input:');
                return v === null ? '' : v;
            }
        });

        try {
            await py.runPythonAsync(code);
            if (outputEl.textContent.trim() === '') {
                outputEl.textContent = '✅ Ran with no output. Try adding a print() to see something!';
            }
        } catch (e) {
            const msg = String(e.message || e);
            // Trim the long internal traceback to the friendly Python part.
            const lines = msg.split('\n');
            const idx = lines.findIndex(l => /Traceback \(most recent call last\)/.test(l));
            const friendly = idx >= 0 ? lines.slice(idx).join('\n') : msg;
            outputEl.textContent += '\n' + friendly;
            outputEl.classList.add('error');
        } finally {
            if (runBtn) { runBtn.disabled = false; runBtn.textContent = runBtn.dataset.label || '▶ Run'; }
        }
        return captured;
    }

    function setupTask(task) {
        const textarea = task.querySelector('.code-input');
        const output = task.querySelector('.pg-output');
        const runBtn = task.querySelector('.run-btn');
        const checkBtn = task.querySelector('.check-btn');
        const resetBtn = task.querySelector('.reset-btn');
        const solutionBtn = task.querySelector('.solution-btn');
        const solution = task.querySelector('.solution');
        if (!textarea || !output) return;

        // Every playground starts blank — students write all the code
        // themselves. (Any text in the HTML textarea is ignored.)
        textarea.value = '';
        const starter = '';

        // Tab key inserts 4 spaces instead of leaving the editor.
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = textarea.selectionStart, en = textarea.selectionEnd;
                textarea.value = textarea.value.slice(0, s) + '    ' + textarea.value.slice(en);
                textarea.selectionStart = textarea.selectionEnd = s + 4;
            }
        });

        if (runBtn) {
            runBtn.addEventListener('click', () => runCode(textarea.value, output, runBtn));
        }

        if (checkBtn) {
            checkBtn.addEventListener('click', async () => {
                const out = await runCode(textarea.value, output, runBtn);
                const expected = (task.dataset.expected || '').trim();
                if (!expected) return;
                const got = out.trim();
                const mode = task.dataset.check || 'exact';
                const ok = mode === 'contains'
                    ? got.includes(expected)
                    : normalize(got) === normalize(expected);
                if (ok) {
                    output.classList.remove('error');
                    output.classList.add('success');
                    output.textContent = got + '\n\n🎉 Correct! Great job — task complete!';
                    celebrate(task);
                } else {
                    output.classList.add('error');
                    output.textContent = got + '\n\n🤔 Not quite yet. Expected the output to ' +
                        (mode === 'contains' ? 'contain' : 'be') + ':\n' + expected;
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                textarea.value = starter;
                output.textContent = '';
                output.classList.remove('error', 'success');
            });
        }

        if (solutionBtn && solution) {
            solutionBtn.addEventListener('click', () => {
                solution.hidden = !solution.hidden;
                solutionBtn.textContent = solution.hidden ? '💡 Solution' : '🙈 Hide Solution';
            });
        }
    }

    function normalize(s) {
        // Compare ignoring trailing spaces per line and blank trailing lines.
        return s.replace(/[ \t]+$/gm, '').replace(/\n+$/g, '');
    }

    function celebrate(task) {
        task.classList.add('task-done');
    }

    // Description / Practice tab switching on lesson pages.
    function setupTabs() {
        const tabs = document.querySelectorAll('.lesson-tab');
        if (!tabs.length) return;
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.tab-panel').forEach(panel => {
                    panel.style.display = panel.id === tab.dataset.panel ? 'block' : 'none';
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupTabs();
        document.querySelectorAll('.task').forEach(setupTask);
    });
})();
