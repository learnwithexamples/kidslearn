/* ============================================================
   workshop-python.js — the Python flavour of the workshop

   The "Build it yourself" pages are all the same page. workshop.js runs the
   steps, the editor, the tests and the demo; this file plugs Python into it:

     * the student's code is run inside Pyodide, in the game's own module, so
       their function really does replace ours everywhere;
     * each test is a few lines of Python ending in an `assert`, so the message
       a failing test shows is a real Python message;
     * the demo panel is Python too — this file just passes the canvas over to
       a `*_demo.py` module and lets Python draw.

   A page starts one like this:

       startPythonWorkshop({
           storagePrefix: 'snake-python-build',
           steps: SNAKE_PYTHON_STEPS,
           module: 'snake_rules',            // the module being taught
           demoModule: 'snake_demo',         // the module that draws the demo
           files: ['snake_rules.py', 'snake_draw.py', 'snake_demo.py',
                   'workshop_support.py']
       });
   ============================================================ */

/**
 * startPythonWorkshop — boot Python, then hand the workshop over to workshop.js.
 *
 * INPUT:  options — { storagePrefix, steps, module, demoModule, files, status }
 * OUTPUT: a promise for the pyodide object
 *
 * ALGORITHM:
 *   1. Download Pyodide and the game's .py files.
 *   2. Take a snapshot of the finished module, so the demos work from the start.
 *   3. Build the three engine functions (compile / install / runTests) out of
 *      workshop_support.py, and a demo that forwards everything to Python.
 *   4. Call startWorkshop with them.
 */
function startPythonWorkshop(options) {
    const statusId = options.status || 'py-status';
    const moduleName = options.module;

    return bootPython(options.files, statusId, options.pythonDir || 'pylib/')
        .then(function (py) {
            const support = py.pyimport('workshop_support');
            const demo = py.pyimport(options.demoModule);
            support.remember(moduleName);

            /** ask — call a Python helper that answers with JSON. */
            function ask(text) {
                return JSON.parse(text);
            }

            /* ---------------------------------------------------- engine */

            const engine = {
                /**
                 * compile — run the student's Python and check the name appeared.
                 * INPUT: code, step. OUTPUT: { ok, fn } or { ok: false, error }.
                 */
                compile: function (code, step) {
                    support.reset(moduleName);
                    const result = ask(support.install(moduleName, step.fnName, code));
                    if (!result.ok) {
                        return { ok: false, error: result.error };
                    }
                    /* the "compiled function" we hand back is simply the code,
                       so the test run can put it in place again */
                    return { ok: true, fn: { name: step.fnName, code: code } };
                },

                /**
                 * install — decide whose code the demo runs.
                 * INPUT: useStudent, step, code, steps, isDone, loadCode.
                 * OUTPUT: true if the current step's own code is in use.
                 */
                install: function (useStudent, step, code, steps, isDone, loadCode) {
                    support.reset(moduleName);
                    if (!useStudent) {
                        return false;
                    }
                    steps.forEach(function (other) {
                        if (isDone(other.id)) {
                            const saved = loadCode(other.id);
                            if (saved) {
                                support.install(moduleName, other.fnName, saved);
                            }
                        }
                    });
                    if (step && code) {
                        return ask(support.install(moduleName, step.fnName, code)).ok;
                    }
                    return true;
                },

                /**
                 * runTests — run this step's Python checks.
                 * INPUT: step, compiled (what compile returned).
                 * OUTPUT: an array of { name, ok, detail }.
                 *
                 * ALGORITHM: put the finished versions back, then install only
                 * the function being tested, so a wobble in an earlier step can
                 * never confuse this one. Then run each test.
                 */
                runTests: function (step, compiled) {
                    support.reset(moduleName);
                    const installed = ask(support.install(moduleName, step.fnName, compiled.code));
                    if (!installed.ok) {
                        return [{ name: 'Your code', ok: false, detail: installed.error }];
                    }
                    return step.tests.map(function (test) {
                        const result = ask(support.run_test(moduleName, test.code));
                        return { name: test.name, ok: result.ok, detail: result.detail };
                    });
                }
            };

            /* ------------------------------------------------------ demo */

            const demoAdapter = {
                sizeCanvas: function (step, canvas) {
                    const size = ask(demo.canvas_size(step.demo.kind));
                    canvas.width = size[0];
                    canvas.height = size[1];
                },
                start: function (step) {
                    demo.start_demo(step.demo.kind, JSON.stringify(step.demo.flags || {}));
                },
                update: function (step, elapsed) {
                    demo.update_demo(elapsed);
                },
                draw: function (step, ctx, canvas, setNote) {
                    try {
                        demo.draw_demo(ctx, canvas.width, canvas.height);
                        setNote(demo.demo_note());
                    } catch (error) {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = '#111111';
                        ctx.font = '13px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText('Waiting for working code…', canvas.width / 2, canvas.height / 2);
                        setNote('The demo stopped: ' + String(error.message).split('\n').pop());
                    }
                },
                controls: function (step, addButton) {
                    const buttons = ask(demo.demo_buttons(step.demo.kind, JSON.stringify(step.demo.flags || {})));
                    buttons.forEach(function (button) {
                        addButton(button[0], button[1], function () {
                            demo.demo_button(button[2]);
                        });
                    });
                },
                onKey: function (step, event) {
                    if (step.demo.kind === 'final') {
                        event.preventDefault();
                        demo.demo_key(String(event.key));
                    }
                }
            };

            showStatus(statusId, '🐍 Python is ready — your code will be tested with real Python.');
            const box = document.getElementById(statusId);
            if (box) {
                box.className = 'py-status ready';
            }

            startWorkshop({
                storagePrefix: options.storagePrefix,
                steps: options.steps,
                engine: engine,
                demo: demoAdapter
            });

            return py;
        });
}
