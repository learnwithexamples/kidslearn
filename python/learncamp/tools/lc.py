"""LearnCamp authoring helpers.

A class file (python/learncamp/src/classNN.py) defines:

    CLASS = dict(id=1, title='…', blurb='…', summary='<p>…</p>', tutorial=[dict(h='…', html='…'), …])
    PROBLEMS = [Problem(…), …]            # 50 of them

Every Problem carries a reference `solution` (Python source that reads stdin and
prints the answer).  tools/build.py runs that solution with real CPython on every
example and test input: the example outputs you typed must match exactly, and the
test outputs are recorded from it.  An optional `alt` solution, written a
different way, is run on every test too and must agree — use it for anything
that is easy to get subtly wrong.
"""
from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Callable, Sequence, Union

TestSpec = Union[Sequence[str], Callable[[random.Random], Sequence[str]]]


@dataclass
class Problem:
    slug: str                    # unique within the class, kebab-case
    title: str
    level: int                   # 1 = warm-up, 2 = core, 3 = challenge
    statement: str               # HTML: what to do
    input: str                   # HTML: the input format
    output: str                  # HTML: the output format
    examples: Sequence[tuple]    # (input, expected output[, explanation HTML])
    hint: str                    # HTML: a nudge, not the answer
    solution: str                # Python source of a correct solution
    tests: TestSpec = ()         # extra test inputs, or a function rng -> list of inputs
    constraints: str = ''        # HTML
    alt: str = ''                # optional second solution; must agree on every test
    explanation: str = ''        # optional HTML shown with the solution (how it works)
    tags: Sequence[str] = field(default_factory=tuple)


def lines(*rows) -> str:
    """Join rows into stdin text ending with a newline: lines('1 2', '3 4')."""
    return '\n'.join(str(r) for r in rows) + '\n'


def ints(seq) -> str:
    return ' '.join(str(x) for x in seq)
