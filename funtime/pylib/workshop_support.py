"""workshop_support.py - the tools the Python workshops use.

When you press "Test it" on a Build-it-yourself page, this is what runs your
code. It has three jobs:

  * remember the finished version of every function, so the demos still work
    before you have written your own;
  * run your code INSIDE the game's module, so your function really does
    replace ours everywhere;
  * run each test and turn a Python error into a friendly sentence.

It also carries a safety net. Before your code is run, every loop in it gets
one extra hidden line that checks the clock, so a loop that never ends is
stopped after two seconds and reported as a mistake - instead of freezing the
whole page.
"""

import ast
import json
import sys
import time

# The original contents of each module, kept so we can always put them back.
_ORIGINALS = {}

TIME_LIMIT_SECONDS = 2.0

# A second safety net: even if the clock is standing still (some browsers
# freeze it while a page is busy), a loop that turns this many times has
# clearly run away.
TURN_LIMIT = 4_000_000

# The name of the safety-net function planted inside the student's loops.
GUARD_NAME = "_workshop_tick"

# One-item lists so these can be changed from inside other functions.
_DEADLINE = [0.0]
_TURNS = [0]


def remember(module_name):
    """Take a snapshot of a module's finished functions.

    INPUT:  module_name - e.g. "snake_rules"
    OUTPUT: nothing
    ALGORITHM: copy the module's dictionary the first time we are asked; later
    calls leave the first snapshot alone.
    """
    if module_name not in _ORIGINALS:
        _ORIGINALS[module_name] = dict(vars(sys.modules[module_name]))


def reset(module_name):
    """Put every finished function back.

    INPUT:  module_name. OUTPUT: nothing.
    ALGORITHM: restore each remembered name, then delete anything the student's
    code added, so one step can never leave litter behind for the next.
    """
    module = sys.modules[module_name]
    saved = _ORIGINALS.get(module_name, {})
    for name, value in saved.items():
        setattr(module, name, value)
    for name in [n for n in vars(module)
                 if n not in saved and not n.startswith("__") and n != GUARD_NAME]:
        delattr(module, name)


def _guard_tick():
    """Called once per turn of every loop in the student's code.

    INPUT:  nothing
    OUTPUT: nothing
    ALGORITHM: count the turn. Every so often, check the clock as well. If
    either the turn limit or the deadline has passed, raise TimeoutError -
    which stops a runaway loop dead instead of freezing the page.

    WHY BOTH: the clock is the friendly test ("2 seconds"), but some browsers
    stop the clock while a page is busy, and then only counting saves us.
    """
    _TURNS[0] += 1
    if _TURNS[0] > TURN_LIMIT:
        raise TimeoutError(
            "your code went round a loop %d times without stopping - "
            "is there a loop that never ends?" % TURN_LIMIT)
    if _TURNS[0] % 4096 == 0 and time.time() > _DEADLINE[0]:
        raise TimeoutError(
            "your code has been running for 2 seconds without stopping - "
            "is there a loop that never ends?")


class _AddLoopGuards(ast.NodeTransformer):
    """Put a _workshop_tick() call at the top of every loop body.

    The student never sees this: we change the parsed shape of their code, not
    their text. A `while` or `for` that never ends now checks the clock on
    every turn, so it can be stopped politely.
    """

    def _guard_statement(self, node):
        call = ast.Expr(value=ast.Call(
            func=ast.Name(id=GUARD_NAME, ctx=ast.Load()), args=[], keywords=[]))
        return ast.copy_location(call, node)

    def visit_While(self, node):
        self.generic_visit(node)
        node.body.insert(0, self._guard_statement(node))
        return node

    def visit_For(self, node):
        self.generic_visit(node)
        node.body.insert(0, self._guard_statement(node))
        return node


def _compile_guarded(code):
    """Turn the student's text into code objects with loop guards in place.

    INPUT:  code - the text from the editor
    OUTPUT: a compiled code object ready for exec
    ALGORITHM: parse the code into a tree, add the guard calls, then compile.
    """
    tree = _AddLoopGuards().visit(ast.parse(code))
    ast.fix_missing_locations(tree)
    return compile(tree, "<your code>", "exec")


def _run_guarded(work):
    """Run something, but never for longer than TIME_LIMIT_SECONDS.

    INPUT:  work - a function of no arguments
    OUTPUT: whatever work() returns
    ALGORITHM: set the deadline, then run. The guard calls planted inside the
    student's loops do the checking.
    """
    _DEADLINE[0] = time.time() + TIME_LIMIT_SECONDS
    _TURNS[0] = 0
    return work()


def install(module_name, function_name, code):
    """Run the student's code inside the game's module.

    INPUT:  module_name, function_name, code - the text from the editor
    OUTPUT: a JSON string: {"ok": true} or {"ok": false, "error": "..."}
    ALGORITHM: exec the code using the module's own dictionary, which both
    defines the function AND puts it in place of ours. Then check that a
    function with the right name really appeared.
    """
    module = sys.modules[module_name]
    setattr(module, GUARD_NAME, _guard_tick)
    try:
        guarded = _compile_guarded(code)
        _run_guarded(lambda: exec(guarded, vars(module)))
    except SyntaxError as error:
        return json.dumps({
            "ok": False,
            "error": "Python cannot read your code - line %s: %s" % (error.lineno, error.msg),
        })
    except Exception as error:                       # noqa: BLE001 - any mistake counts
        return json.dumps({
            "ok": False,
            "error": "Your code crashed while loading: %s: %s" % (type(error).__name__, error),
        })

    function = getattr(module, function_name, None)
    if not callable(function):
        return json.dumps({
            "ok": False,
            "error": "I cannot find a function called %s(). Check the spelling - "
                     "it must match exactly." % function_name,
        })
    return json.dumps({"ok": True})


def run_test(module_name, test_code):
    """Run one test against whatever is currently installed.

    INPUT:  module_name, test_code - a few lines of Python ending in asserts
    OUTPUT: a JSON string: {"ok": true/false, "detail": "..."}
    ALGORITHM: exec the test inside the module, so it can call the functions by
    name. An AssertionError means the check failed and its message explains
    why; any other error means the code crashed.
    """
    module = sys.modules[module_name]
    setattr(module, GUARD_NAME, _guard_tick)
    try:
        _run_guarded(lambda: exec(test_code, vars(module)))
        return json.dumps({"ok": True, "detail": ""})
    except AssertionError as error:
        return json.dumps({"ok": False, "detail": str(error) or "the check failed"})
    except TimeoutError as error:
        return json.dumps({"ok": False, "detail": str(error)})
    except Exception as error:                       # noqa: BLE001
        return json.dumps({"ok": False, "detail": "%s: %s" % (type(error).__name__, error)})
