# The games, written in Python

Every game in this folder is **real Python running in your browser**. When you
open one of the `*-python.html` pages, the browser downloads
[Pyodide](https://pyodide.org) — CPython compiled to WebAssembly — and then
runs these `.py` files. Python does everything: the rules, the maths, and the
drawing.

```
tetris_rules.py   snake_rules.py   race_rules.py     the rules  (pure Python)
tetris_draw.py    snake_draw.py    race_draw.py      the picture (calls the canvas)
tetris_web.py     snake_web.py     race_web.py       the glue   (keyboard, buttons, loop)
tetris_demo.py    snake_demo.py    race_demo.py      the demos in the workshops
workshop_support.py                                  runs and tests your code
```

| Page | What it runs |
|---|---|
| `../tetris-python.html` | `tetris_rules` + `tetris_draw` + `tetris_web` |
| `../snake-python.html` | `snake_rules` + `snake_draw` + `snake_web` |
| `../race-python.html` | `race_rules` + `race_draw` + `race_web` |
| `../tetris-python-build.html` | the workshop: `tetris_rules` + `tetris_demo` + `workshop_support` |
| `../snake-python-build.html` | the workshop: `snake_rules` + `snake_demo` + `workshop_support` |
| `../race-python-build.html` | the workshop: `race_rules` + `race_demo` + `workshop_support` |

## Two Pyodide tricks worth knowing

**Python can use the browser.** `from js import document, window` hands Python
the very same objects JavaScript uses, so `ctx.fillRect(...)` in `*_draw.py`
paints on the canvas exactly as it would in JavaScript.

**Callbacks need a wrapper.** A Python function cannot be handed to the
browser directly — it has to be wrapped with `create_proxy` first, and
something must keep a reference to that proxy. That is what the `PROXIES` list
in each `*_web.py` is for.

## Compare the two versions

Each game exists twice: once in `../lib/*.js` and once here. The ideas are
identical, so put them side by side and see where each language is clearer:

| Idea | JavaScript | Python |
|---|---|---|
| are two squares the same? | four number comparisons | `a == b` (tuples compare by value) |
| is this square in the list? | a `for` loop | `position in items` |
| is every square full? | a loop with an early return | `all(value == 1 for value in row)` |
| did we hit anything? | a loop with an early return | `any(...)` |
| build an empty board | two nested loops | `[[0] * width for _ in range(height)]` |
| keep a number in range | two `if`s | `max(low, min(high, value))` |
| look a key up | a row of `if`s | a dictionary and `.get()` |

## Running the Python outside the browser

These files are ordinary Python. The rules and the drawing can be run and
tested with a normal `python3` — only the `*_web.py` files need a browser:

```bash
python3 funtime/tests/test_python_games.py     # the rules and the drawing
python3 funtime/tests/test_python_steps.py     # every step of the workshops
```

## If a page never starts

The pages have to *read* these `.py` files, and a browser will not let a page
opened straight off your disk do that. Open them from the live site, or serve
the folder yourself:

```bash
python3 -m http.server
# then visit http://localhost:8000/funtime/snake-python.html
```
