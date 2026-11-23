# LearnCamp

A Python data-structures-and-algorithms track. Each class has a tutorial with
runnable code and 50 judged problems: students write a full program, press
Submit, and it is run against test vectors in the browser (Pyodide in a Web
Worker, with a time limit).

```
index.html            hub — lists the classes from data/catalog.js
class.html?c=N        a class: Tutorial tab + Problems tab
learncamp.js / .css   page code; judge-worker.js runs Python
src/classNN.py        the source of class N: CLASS (tutorial) + PROBLEMS
tools/lc.py           the Problem type and small helpers
tools/build.py        checks every class and writes data/class-NN.js + data/catalog.js
tests/test-judge.js   headless Chrome: every reference solution must be Accepted in the browser
```

## Adding or changing a class

1. Edit or add `src/classNN.py` (copy `src/class01.py` for the layout).
2. `python3 python/learncamp/tools/build.py` (or `… build.py 2` for one class).
3. `node python/learncamp/tests/test-judge.js 2` to confirm the browser judge accepts every solution.

Never edit `data/*.js` by hand — they are generated.

## Writing a problem

```python
Problem(
    slug='a-plus-b', title='A + B', level=1,          # 1 warm-up, 2 core, 3 challenge
    statement='<p>…</p>', input='<p>…</p>', output='<p>…</p>', constraints='<p>…</p>',
    examples=[('1 2\n', '3\n'), ('10 20\n', '30\n', 'optional explanation HTML')],
    hint='<p>a nudge, not the answer</p>',
    solution='a, b = map(int, input().split())\nprint(a + b)\n',
    alt='…optional second solution written differently…',
    explanation='<p>optional: how the solution works / the trap</p>',
    tests=lambda r: ['0 0', '1000 1000'] + [f'{r.randint(0, 1000)} {r.randint(0, 1000)}' for _ in range(8)],
)
```

- **Expected outputs are never typed for tests.** The build runs `solution` with
  real Python on every test input and records what it prints. The outputs you
  type in `examples` must match the solution exactly — that is the check that
  the solution is right. For anything tricky, add an `alt` solution written a
  different way (e.g. brute force); the build fails if they ever disagree.
- `tests` is a list of input strings or a function `rng -> list`. Include edge
  cases (smallest input, largest input, ties, empty results) plus random cases;
  at least 8 different inputs including the examples. Keep each under 6 KB.
- Comparison ignores spaces at the end of lines and blank lines at the very end;
  everything else (including leading spaces) must match.
- Problems must work with plain `input()` / `sys.stdin`. Remember the browser
  runs Python about 3–10× slower than a desktop and the limit is 4 s per test,
  so keep tests small enough for a sensible solution.
- Don't name other courses or their numbers in any text.
