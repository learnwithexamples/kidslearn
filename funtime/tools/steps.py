#!/usr/bin/env python3
"""steps.py - write a workshop's step list for BOTH languages from one source.

Every game's workshop teaches the same functions twice: once in JavaScript and
once in Python. The words, the INPUT/OUTPUT/ALGORITHM box and the order are
the same; only the code and the tests differ. So each step is described once
here and this module writes the two `.js` step files the pages load.

Both step files are plain JSON, because a test is now just a few lines of code
ending in `assert(...)` (JavaScript) or `assert ...` (Python).
"""

import json
import pathlib

LIB = pathlib.Path(__file__).resolve().parent.parent / "lib"


def step(id, js_fn, py_fn, title, adds, intro, spec_in, spec_out, algorithm,
         js, py, demo, warning=None, intro_js="", intro_py=""):
    """Describe one step of a workshop, in both languages.

    INPUT:  id        - a short name (also the localStorage key)
            js_fn/py_fn - the function name in each language
            title/adds/intro/spec_*/algorithm - the words the student reads
            js/py     - dicts with starter, answer, hints and tests
            demo      - which live demo to show
            warning   - optional ⚠️ note
            intro_js/intro_py - an extra paragraph for just one language
    OUTPUT: a dict holding both language versions
    """
    return {
        "id": id, "js_fn": js_fn, "py_fn": py_fn, "title": title, "adds": adds,
        "intro": intro, "intro_js": intro_js, "intro_py": intro_py,
        "spec_in": spec_in, "spec_out": spec_out, "algorithm": algorithm,
        "warning": warning, "js": js, "py": py, "demo": demo,
    }


def _one_language(source, language):
    """Turn a two-language step into the single-language form the page wants."""
    part = source[language]
    data = {
        "id": source["id"],
        "fnName": source["js_fn"] if language == "js" else source["py_fn"],
        "title": source["title"],
        "adds": source["adds"],
        "intro": source["intro"] + (source["intro_js"] if language == "js" else source["intro_py"]),
        "spec": {
            "input": source["spec_in"],
            "output": source["spec_out"],
            "algorithm": part.get("algorithm", source["algorithm"]),
        },
        "starter": part["starter"],
        "answer": part["answer"],
        "hints": part["hints"],
        "tests": [{"name": name, "code": code} for name, code in part["tests"]],
        "demo": source["demo"],
    }
    if source["warning"]:
        data["warning"] = source["warning"]
    return data


def write_workshop(game, name, steps):
    """Write both step files for one game.

    INPUT:  game  - the slug, e.g. "memory"
            name  - the pretty name, e.g. "Memory Match"
            steps - the list built with step()
    OUTPUT: nothing; it writes lib/<game>-steps.js and lib/<game>-python-steps.js
    """
    for language, suffix, constant_suffix, blurb in [
            ("js", "-steps.js", "_STEPS", "JavaScript"),
            ("py", "-python-steps.js", "_PYTHON_STEPS", "Python")]:
        constant = game.replace("-", "_").upper() + constant_suffix
        header = ("/* ============================================================\n"
                  "   %s%s - the %d steps of \"Build %s%s\"\n"
                  "\n"
                  "   Each step teaches one function. Every test is a few lines of real\n"
                  "   %s ending in an assert, so a failing test explains itself.\n"
                  "   ============================================================ */\n"
                  % (game, suffix, len(steps), name,
                     "" if language == "js" else " in Python", blurb))
        body = json.dumps([_one_language(s, language) for s in steps], indent=4, ensure_ascii=False)
        (LIB / (game + suffix)).write_text(header + "\nconst " + constant + " = " + body + ";\n")

    print("%s: %d steps written for both languages (%d + %d tests)"
          % (game, len(steps),
             sum(len(s["js"]["tests"]) for s in steps),
             sum(len(s["py"]["tests"]) for s in steps)))
