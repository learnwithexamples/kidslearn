#!/usr/bin/env python3
"""Build LearnCamp class data from the Python sources.

    python3 python/learncamp/tools/build.py          # every class in src/
    python3 python/learncamp/tools/build.py 2        # just class 2
    python3 python/learncamp/tools/build.py 2 --check   # verify only, write nothing

For each problem it:
  * runs the reference solution on every example and checks the output you typed;
  * runs it on every test input to record the expected output;
  * runs the optional `alt` solution on every test and checks it agrees;
  * checks the problem has a hint, a statement, at least 8 tests, …
then writes data/class-NN.js for the web page.  Exit code 1 on any problem.
"""
from __future__ import annotations

import importlib.util
import json
import random
import re
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SRC, DATA = ROOT / 'src', ROOT / 'data'
sys.path.insert(0, str(HERE))
from lc import Problem  # noqa: E402

TIMEOUT = 10          # seconds per run of a reference solution
MIN_TESTS = 8         # examples + tests
MAX_TEST_BYTES = 6000

errors = 0


def err(where: str, msg: str) -> None:
    global errors
    errors += 1
    print(f'  ✗ {where}: {msg}')


def norm(s: str) -> str:
    """The same comparison the web judge uses: ignore trailing spaces on each
    line and blank lines at the end. Leading spaces DO matter."""
    return re.sub(r'\n+$', '', re.sub(r'[ \t]+$', '', s.replace('\r\n', '\n'), flags=re.M))


def run(code: str, stdin: str) -> tuple[str, str]:
    """Run Python source with stdin; return (stdout, error text or '')."""
    with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False) as f:
        f.write(code)
        path = f.name
    try:
        p = subprocess.run([sys.executable, '-I', path], input=stdin, capture_output=True, text=True, timeout=TIMEOUT)
    except subprocess.TimeoutExpired:
        return '', f'timed out after {TIMEOUT}s'
    finally:
        Path(path).unlink(missing_ok=True)
    if p.returncode != 0:
        return p.stdout, p.stderr.strip().splitlines()[-1] if p.stderr.strip() else f'exit code {p.returncode}'
    return p.stdout, ''


def load(path: Path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def build_class(path: Path, write: bool) -> None:
    mod = load(path)
    C, problems = mod.CLASS, mod.PROBLEMS
    cid = C['id']
    print(f'Class {cid}: {C["title"]}')
    for key in ('title', 'blurb', 'summary', 'tutorial'):
        if not C.get(key):
            err('class', f'missing {key}')
    if len(C.get('tutorial', [])) < 4:
        err('class', 'tutorial needs at least 4 sections')
    if len(problems) != 50:
        err('class', f'has {len(problems)} problems, needs 50')
    slugs = set()
    out_problems = []
    levels = {1: 0, 2: 0, 3: 0}
    for n, p in enumerate(problems, 1):
        where = f'#{n} {p.slug}'
        if not isinstance(p, Problem):
            err(where, 'is not a Problem'); continue
        if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', p.slug):
            err(where, 'slug must be kebab-case')
        if p.slug in slugs:
            err(where, 'duplicate slug')
        slugs.add(p.slug)
        if p.level not in levels:
            err(where, 'level must be 1, 2 or 3')
        else:
            levels[p.level] += 1
        for f in ('title', 'statement', 'input', 'output', 'hint', 'solution'):
            if not str(getattr(p, f)).strip():
                err(where, f'missing {f}')
        if not p.examples:
            err(where, 'needs at least one example')
        if re.search(r'x-?camp|\bCS\s?10[0-9]', ' '.join([p.title, p.statement, p.hint, p.explanation]), re.I):
            err(where, 'mentions a course name it should not')

        # Examples: the solution must reproduce the outputs written by hand.
        examples = []
        for k, ex in enumerate(p.examples, 1):
            exin, exout = ex[0], ex[1]
            got, e = run(p.solution, exin)
            if e:
                err(where, f'solution crashes on example {k}: {e}')
            elif norm(got) != norm(exout):
                err(where, f'solution gives {got!r} on example {k}, the example says {exout!r}')
            examples.append({'in': exin, 'out': exout, **({'why': ex[2]} if len(ex) > 2 else {})})

        # Tests: recorded from the solution, cross-checked by `alt`.
        spec = p.tests
        inputs = list(spec(random.Random(f'{cid}-{p.slug}')) if callable(spec) else spec)
        tests, seen = [], set()
        for k, tin in enumerate(inputs, 1):
            if not tin.endswith('\n'):
                tin += '\n'
            if tin in seen:
                continue
            seen.add(tin)
            if len(tin) > MAX_TEST_BYTES:
                err(where, f'test {k} input is {len(tin)} bytes; keep tests under {MAX_TEST_BYTES}')
            got, e = run(p.solution, tin)
            if e:
                err(where, f'solution crashes on test {k}: {e} (input {tin[:80]!r})'); continue
            if p.alt:
                alt, e2 = run(p.alt, tin)
                if e2:
                    err(where, f'alt solution crashes on test {k}: {e2}')
                elif norm(alt) != norm(got):
                    err(where, f'alt disagrees on test {k}: {norm(alt)[:60]!r} vs {norm(got)[:60]!r} (input {tin[:80]!r})')
            tests.append({'in': tin, 'out': got})
        all_ins = {e['in'] if e['in'].endswith('\n') else e['in'] + '\n' for e in examples} | {t['in'] for t in tests}
        if len(all_ins) < MIN_TESTS:
            err(where, f'only {len(all_ins)} different test inputs; needs {MIN_TESTS}')
        out_problems.append({
            'slug': p.slug, 'title': p.title, 'level': p.level, 'statement': p.statement,
            'input': p.input, 'output': p.output, 'constraints': p.constraints, 'examples': examples,
            'hint': p.hint, 'solution': p.solution.strip('\n'), 'explanation': p.explanation,
            'tests': tests,
        })
    print(f'  {len(problems)} problems (warm-up {levels[1]}, core {levels[2]}, challenge {levels[3]}), '
          f'{sum(len(p["tests"]) for p in out_problems)} tests')
    if write:
        DATA.mkdir(exist_ok=True)
        payload = {k: C[k] for k in ('id', 'title', 'blurb', 'summary', 'tutorial')}
        payload['problems'] = out_problems
        js = '/* Generated by python/learncamp/tools/build.py from src/' + path.name + ' — do not edit. */\n' \
             'LC.register(' + json.dumps(payload, ensure_ascii=False, indent=1) + ');\n'
        target = DATA / f'class-{cid:02d}.js'
        target.write_text(js, encoding='utf-8')
        print(f'  → {target.relative_to(ROOT.parent.parent)} ({len(js) // 1024} KB)')


def main() -> None:
    args = sys.argv[1:]
    write = '--check' not in args
    wanted = {int(a) for a in args if a.isdigit()}
    files = sorted(SRC.glob('class*.py'))
    for f in files:
        n = int(re.search(r'\d+', f.stem).group())
        if wanted and n not in wanted:
            continue
        before = errors
        build_class(f, write and True)
        if errors > before and write:
            print('  (data written anyway so the page can be inspected — fix the errors above)')
    if write and not wanted:
        catalog = []
        for f in files:
            mod = load(f)
            catalog.append({'id': mod.CLASS['id'], 'title': mod.CLASS['title'], 'blurb': mod.CLASS['blurb'], 'problems': len(mod.PROBLEMS)})
        (DATA / 'catalog.js').write_text('/* Generated by tools/build.py — do not edit. */\nLC.setCatalog(' + json.dumps(catalog, ensure_ascii=False, indent=1) + ');\n', encoding='utf-8')
        print(f'Catalog: {len(catalog)} class(es) → data/catalog.js')
    print(f'\n{errors} error(s).' if errors else '\nAll good.')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
