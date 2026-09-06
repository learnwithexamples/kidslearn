#!/usr/bin/env python3
"""probe.py - build a throwaway page that plays a whole workshop by itself.

    python3 funtime/tools/probe.py memory-build MEMORY_STEPS

It copies a "Build it yourself" page, adds a script that types every step's
answer, presses Test, and checks the workshop unlocked properly - then writes
the verdict into the page so a screenshot can be read at a glance.

The probe pages are temporary: they are written next to the real ones as
_probe_*.html and deleted once the screenshot has been taken.
"""

import pathlib
import sys

FUNTIME = pathlib.Path(__file__).resolve().parent.parent

PROBE = """
    <script>
    (function () {
        function el(id) { return document.getElementById(id); }

        function waitForWorkshop() {
            if (!el('step-number') || el('step-number').textContent.indexOf('Step 1') !== 0) {
                setTimeout(waitForWorkshop, 100);
                return;
            }
            /* the demo redraws every frame, which is far too slow headless */
            window.requestAnimationFrame = function () {};
            setTimeout(runProbe, 100);
        }

        function runProbe() {
            try {
                runSteps();
            } catch (error) {
                report('CRASHED: ' + error.message + ' | ' + (error.stack || '').split('\n')[1], false);
            }
        }

        function runSteps() {
            const steps = window.%(constant)s;
            const problems = [];
            let passed = 0;

            /* a deliberately wrong answer must be refused */
            el('code-editor').value = %(wrong)s;
            el('btn-test').click();
            if (el('test-summary').className.indexOf('fail') === -1) {
                problems.push('a wrong answer was accepted');
            }

            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                if (el('step-number').textContent !== 'Step ' + (i + 1) + ' of ' + steps.length) {
                    problems.push('step ' + (i + 1) + ' was not showing');
                }
                el('code-editor').value = step.answer;
                el('btn-test').click();
                if (el('test-summary').className.indexOf('pass') !== -1) {
                    passed++;
                } else {
                    problems.push(step.fnName + ': ' + el('test-results').textContent.slice(0, 60));
                }
                if (el('demo-status').className.indexOf('yours') === -1) {
                    problems.push(step.fnName + ' demo did not switch to my code');
                }
                if (i < steps.length - 1) { el('btn-next').click(); }
            }

            const dots = document.querySelectorAll('.step-dot.done').length;
            const finished = el('finish-panel').style.display === 'block';
            report(passed + '/' + steps.length + ' answers pass | dots ' + dots +
                   ' | finish ' + finished + ' | problems: ' +
                   (problems.length === 0 ? 'NONE' : problems.join(' ; ')),
                   problems.length === 0);
        }

        /* The verdict goes in a banner of its own, pinned to the top, so
           nothing the workshop redraws can wipe it out. */
        function report(text, ok) {
            const verdict = 'PROBE %(label)s: ' + text;
            document.title = verdict;
            const banner = document.createElement('div');
            banner.textContent = verdict;
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;' +
                'font-family:monospace;font-size:15px;font-weight:bold;padding:12px;' +
                'border-bottom:4px solid #111;background:' + (ok ? '#111' : '#fff') +
                ';color:' + (ok ? '#fff' : '#111') + ';';
            document.body.appendChild(banner);
        }

        try {
            waitForWorkshop();
        } catch (error) {
            report('CRASHED: ' + error.message, false);
        }
    })();
    </script>
"""


def build(page_name, constant, wrong_code, label):
    """Write a probe copy of one workshop page.

    INPUT:  page_name - e.g. "memory-build". constant - e.g. "MEMORY_STEPS".
            wrong_code - a deliberately broken answer, as a JS string literal.
            label - what to call this workshop in the verdict.
    OUTPUT: the file name written
    """
    source = (FUNTIME / (page_name + ".html")).read_text()
    probe = PROBE % {"constant": constant, "wrong": wrong_code, "label": label}
    out = source.replace("</body>", probe + "</body>")
    name = "_probe_" + page_name + ".html"
    (FUNTIME / name).write_text(out)
    return name


if __name__ == "__main__":
    page, constant = sys.argv[1], sys.argv[2]
    wrong = sys.argv[3] if len(sys.argv) > 3 else "'function nope() { return 1; }'"
    print(build(page, constant, wrong, page))
