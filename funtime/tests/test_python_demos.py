#!/usr/bin/env python3
"""Run every Python workshop demo, for every kind of demo its steps ask for.

    python3 funtime/tests/test_python_demos.py

Each game's workshop has a Python demo module in pylib/<game>_demo.py, and its
JavaScript twin is already played through by test-js-workshops.js. Nothing was
checking the Python one, which is exactly how the two quietly drift apart: a
step asks for a demo kind the Python module has never heard of, and the panel
beside the editor goes blank for anyone learning in Python.

So: read the demo kinds straight out of the generated step files, start each
one, run it for a few seconds, draw it, then press every button it offers.
New games and new demo kinds are picked up automatically.
"""

import json
import math
import pathlib
import random
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "pylib"))

failures = 0
checks = 0


def check(name, condition, extra=None):
    """Report one check."""
    global failures, checks
    checks += 1
    if condition:
        print("  ok   " + name)
    else:
        failures += 1
        print("  FAIL " + name + ("  -> " + str(extra) if extra is not None else ""))


class FakeCanvas:
    """A pretend canvas that counts the drawing calls instead of painting."""

    def __init__(self):
        object.__setattr__(self, "calls", {})

    def __getattr__(self, name):
        def record(*args, **kwargs):
            self.calls[name] = self.calls.get(name, 0) + 1
        return record

    def __setattr__(self, name, value):
        pass

    def measureText(self, text):          # noqa: N802 - the canvas spells it this way
        self.calls["measureText"] = self.calls.get("measureText", 0) + 1
        return type("Size", (), {"width": len(text) * 6})()


def steps_for(game):
    """The steps of one Python workshop, straight out of the generated file."""
    path = ROOT / "lib" / (game.replace("_", "-") + "-python-steps.js")
    if not path.exists():
        return None
    text = path.read_text()
    return json.loads(text[text.index("["):text.rindex("]") + 1])


def demo_plan(steps):
    """Every distinct demo the steps ask for, as (kind, flags_json)."""
    seen = {}
    for step in steps:
        demo = step.get("demo") or {}
        kind = demo.get("kind")
        if kind is None:
            continue
        seen.setdefault(kind, json.dumps(demo.get("flags") or {}))
    return sorted(seen.items())


def exercise(game, module, kind, flags_json):
    """Start one demo, run it, draw it, and press all of its buttons."""
    label = "%s/%s" % (game, kind)

    try:
        module.start_demo(kind, flags_json)
    except Exception as error:                                  # noqa: BLE001
        check(label + ": starts", False, repr(error))
        return
    check(label + ": starts", True)

    # A few seconds of clock, so anything that only breaks in motion breaks here.
    try:
        for _ in range(180):
            module.update_demo(16)
    except Exception as error:                                  # noqa: BLE001
        check(label + ": runs for 3 seconds", False, repr(error))
        return
    check(label + ": runs for 3 seconds", True)

    canvas = FakeCanvas()
    try:
        size = json.loads(module.canvas_size(kind))
        module.draw_demo(canvas, size[0], size[1])
    except Exception as error:                                  # noqa: BLE001
        check(label + ": draws", False, repr(error))
        return
    check(label + ": draws", len(canvas.calls) > 2, canvas.calls)

    note = module.demo_note()
    check(label + ": says something under the canvas",
          isinstance(note, str) and len(note) > 0, repr(note))

    try:
        buttons = json.loads(module.demo_buttons(kind, flags_json))
    except Exception as error:                                  # noqa: BLE001
        check(label + ": offers buttons", False, repr(error))
        return
    check(label + ": offers buttons",
          len(buttons) > 0 and all(len(b) == 3 for b in buttons), buttons)

    broken = None
    for button in buttons:
        try:
            module.demo_button(button[2])
            for _ in range(20):
                module.update_demo(16)
            module.draw_demo(FakeCanvas(), 100, 100)
        except Exception as error:                              # noqa: BLE001
            broken = "%s -> %r" % (button[2], error)
            break
    check(label + ": every button works", broken is None, broken)

    if kind == "final":
        broken = None
        for key in ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "p", "r", "q"]:
            try:
                module.demo_key(key)
                module.update_demo(16)
            except Exception as error:                          # noqa: BLE001
                broken = "%s -> %r" % (key, error)
                break
        check(label + ": the keyboard works", broken is None, broken)


def main():
    random.seed(7)
    modules = sorted(p.stem for p in (ROOT / "pylib").glob("*_demo.py"))
    check("there are Python workshop demos to test", len(modules) > 0, modules)

    for name in modules:
        game = name[:-len("_demo")]
        steps = steps_for(game)
        if steps is None:
            check(game + ": has a Python step file", False, "no lib/*-python-steps.js")
            continue

        try:
            module = __import__(name)
        except Exception as error:                              # noqa: BLE001
            check(game + ": the demo module imports", False, repr(error))
            continue

        plan = demo_plan(steps)
        check(game + ": every step names a demo", len(plan) > 0, plan)

        # A kind a step asks for but the module has never heard of is the bug
        # this whole file exists to catch, so start_demo must handle them all.
        for kind, flags_json in plan:
            exercise(game, module, kind, flags_json)

    print()
    if failures:
        print("%d of %d checks FAILED" % (failures, checks))
        sys.exit(1)
    print("All %d checks passed." % checks)


main()
