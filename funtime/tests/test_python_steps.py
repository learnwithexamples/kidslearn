#!/usr/bin/env python3
"""Check every step of the Python workshops.

    python3 funtime/tests/test_python_steps.py

For each step it makes sure that
  * the ANSWER passes every one of that step's own tests, and
  * the empty STARTER does not (or the workshop would pass you for nothing).

The step lists live in the .js files the browser loads, but they are plain
JSON, so this script reads them straight out.
"""

import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT / "pylib"))

import workshop_support as support        # noqa: E402


def load_steps(js_file, const_name):
    """Pull the JSON step list out of a JavaScript file."""
    text = (ROOT / "lib" / js_file).read_text()
    start = text.index("const " + const_name + " = ") + len("const " + const_name + " = ")
    end = text.rindex("];") + 1
    return json.loads(text[start:end])


WORKSHOPS = [
    ("Snake", "snake-python-steps.js", "SNAKE_PYTHON_STEPS", "snake_rules"),
    ("Tetris", "tetris-python-steps.js", "TETRIS_PYTHON_STEPS", "tetris_rules"),
    ("Racing", "race-python-steps.js", "RACE_PYTHON_STEPS", "race_rules"),
]

failures = 0
checked = 0

for label, js_file, const_name, module_name in WORKSHOPS:
    if not (ROOT / "lib" / js_file).exists():
        continue

    __import__(module_name)
    support.remember(module_name)
    steps = load_steps(js_file, const_name)
    print("\n%s in Python - %d steps" % (label, len(steps)))

    for number, step in enumerate(steps, start=1):
        name = "%2d. %s" % (number, step["fnName"])

        # the answer must pass everything
        support.reset(module_name)
        installed = json.loads(support.install(module_name, step["fnName"], step["answer"]))
        if not installed["ok"]:
            failures += 1
            print("  FAIL %s: the answer does not even load - %s" % (name, installed["error"]))
            continue

        bad = []
        for test in step["tests"]:
            checked += 1
            result = json.loads(support.run_test(module_name, test["code"]))
            if not result["ok"]:
                bad.append((test["name"], result["detail"]))

        if bad:
            failures += 1
            print("  FAIL %s: the answer failed %d of %d tests" % (name, len(bad), len(step["tests"])))
            for test_name, detail in bad[:3]:
                print("         - %s: %s" % (test_name, detail))
        else:
            print("  ok   %s: answer passes all %d tests" % (name, len(step["tests"])))

        # the starter must NOT pass everything
        support.reset(module_name)
        starter = json.loads(support.install(module_name, step["fnName"], step["starter"]))
        if starter["ok"]:
            all_passed = all(json.loads(support.run_test(module_name, t["code"]))["ok"]
                             for t in step["tests"])
            if all_passed:
                failures += 1
                print("  FAIL %s: the empty starter passes the tests!" % name)

        # every step must name a function the module really has
        support.reset(module_name)
        module = sys.modules[module_name]
        if not callable(getattr(module, step["fnName"], None)):
            failures += 1
            print("  FAIL %s: %s.%s does not exist" % (name, module_name, step["fnName"]))

    support.reset(module_name)

print("\n%d checks run" % checked)
print("ALL PYTHON STEP TESTS PASSED" if failures == 0 else "%d PROBLEM(S)" % failures)
sys.exit(0 if failures == 0 else 1)
