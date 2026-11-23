# Writing a Challenge Academy lesson

One file per lesson: `lessons/lesson-NN.js`. It calls `CA.register({...})` once.
The same file drives the lesson page (`lesson.html?n=NN`: Tutorial, Examples,
Practice tabs) and the printable 50-problem assignment (`assignment.html?n=NN`,
printed to `assignments/*.pdf`). `lesson-01.js` is the reference — read it first,
then `ca-core.js` for the helpers.

## Shape

```js
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m;

    CA.register({
        id: 7,
        tutorial: [ { h: 'Section heading', html: R`<p>…</p>` }, … ],          // 5–7 sections
        summary:  [ { topic: 'Topic', points: [R`…`, …] }, … ],                // optional: mind map shown after the tutorial
        examples: [ { title, q, fig?, steps: [R`…`, …], answer: R`…` }, … ],   // 5–6 worked examples
        practice: [ { id: 'kebab-id', name: 'Shown to students', level: 1|2|3,
                      gen(rng) { return { q, fig?, ans, sol }; } }, … ],       // 10–15 generators
        assignment: [ ['kebab-id', 4], … ],                                    // counts add up to exactly 50
    });
})();
```

- **tutorial** teaches the lesson from scratch for a strong 11–13 year old: the idea, why
  it works, the formulas, the classic traps. Use the boxes `<div class="ca-key">` (key idea),
  `ca-tip`, `ca-warn` (common mistake), `ca-formula`, plus `<table>`, `<ul>`, figures.
- **examples** are solved step by step (the page reveals one step at a time). Cover each
  main problem type the practice asks for, easiest first.
- **practice** generators make an endless supply of problems. Level 1 = warm-up
  (one step), 2 = core, 3 = challenge (multi-step / contest style). Every level must appear.
- **assignment** says how many problems each generator gives to the PDF. Aim for roughly
  15 level-1, 23 level-2, 12 level-3. The sheet is sorted by level automatically.

## Rules that keep the answers right

1. **Compute, never type, an answer.** `ans` and every number in `sol` come from the same
   variables as the question. If you catch yourself writing a literal result, derive it.
2. **Use only `rng`** (`rng.int(lo, hi)`, `rng.pick(arr)`, `rng.bool(p)`, `rng.shuffle(arr)`,
   `rng.sample(arr, k)`) — never `Math.random()`. The assignment must come out identical every time.
3. **Pick numbers so answers are clean**: integers, simple fractions, multiples of π, simple
   radicals. Build problems backwards from a nice answer. Loop until the numbers are nice.
4. **Each generator needs variety**: at least ~15 genuinely different problems (the assignment
   takes up to 6 without repeats; practice should not feel repetitive). Vary contexts and wording,
   not just numbers.
5. **Unambiguous wording.** One correct answer; say the unit and the form wanted
   ("in terms of π", "as a fraction in lowest terms", "simplest radical form").
6. **`sol` is a 1–3 sentence worked solution** showing the key step, not just the answer.

## Answers (`ans`)

| Call | Means | Student types |
|---|---|---|
| `CA.num(24, 'cm²')` | a number; unit optional; `'$'` and `'%'` are placed correctly | `24` |
| `CA.frac(3, 4)` | a fraction, auto-reduced; `{mixed:true}` as 4th arg shows a mixed number | `3/4` or `0.75` |
| `CA.pi(9, 2, 'cm²')` | (9/2)π cm² | the coefficient, `9/2` |
| `CA.root(3, 2)` / `CA.rootOf(18)` | 3√2, auto-simplified | two boxes: 3 and 2 |
| `CA.ratio([6, 4])` | 3 : 2, auto-reduced | `3:2` |
| `CA.mc(rng, correct, [wrong…])` | multiple choice, shuffled; strings may be HTML/SVG; needs ≥2 distinct wrong ones (3 is best); `{keepOrder:true}` keeps your order, then pass the full list | clicks |
| `CA.text('even', ['even'])` | free text — avoid; prefer `CA.mc` | text |

Use `CA.mc` for anything a number box cannot hold (expressions like 2+√3, "rational/irrational",
comparisons, pairs of numbers). Make the wrong choices the answers that real mistakes produce.

## Maths text

- Write every string that contains TeX with **`R\`…\``** (`String.raw`). A plain template
  literal turns `\frac` into a form-feed plus "rac". The validator catches this.
- Inline maths is `\( … \)`, display maths `\[ … \]`. Not `$…$`.
- `m('x^2')` wraps a TeX string built in JS; inside a non-raw string remember to double
  backslashes: `` m(`${a}\\times${b}`) `` — or build it with `R`: ``m(R`${a}\times${b}`)``.
- TeX builders: `CA.tex.frac(n, d)`, `CA.tex.mixed(n, d)`, `CA.tex.pi(n, d)`, `CA.tex.root(c, r)`, `CA.tex.num(x)`.
- Number helpers: `CA.gcd`, `CA.lcm`, `CA.fact`, `CA.nPr`, `CA.nCr`, `CA.isSquare`,
  `CA.simplifyRoot(72) → [6, 2]`, `CA.reduce(n, d)`, `CA.round(x, dp)`.
- Units outside the maths as plain text with Unicode: `cm²`, `cm³`, `°`.
- Money: write `$${x}` in the question and `CA.num(x, '$')` for the answer.

## Figures

Figures are SVG strings and must work in print (no CSS classes, no scripts). Give
geometry problems a figure whenever a textbook would. `fig` on a problem or example is
placed under the question text; in tutorials interpolate figures into the HTML.

- Ready-made: `F.cubes(heights)`, `F.grid(cells, {label, numbers})`, `F.threeViews`, `F.plan`,
  `F.box(l, w, h, {labels:['8','3','5'], extra})`, `F.cylinder(r, h, {labels:{r:'3', h:'10'}})`,
  `F.cone(r, h, {labels:{r, h, l}})`, `F.rightTriangle(a, b, {a, b, c})`.
- Build your own: `F.svg(width, height, body)` with `F.line`, `F.poly`, `F.rect`, `F.circle`,
  `F.ellipse`, `F.path`, `F.arc`, `F.sector`, `F.text`, `F.dot`, `F.rightAngle`, `F.polar`.
  Options: `{fill, stroke, width, dash:true, opacity}`. Colours: `F.colors.FILL`, `.SHADE`, `.DARK`,
  `.ACCENT`, `.INK`. Angles are degrees anticlockwise from east. SVG text is plain Unicode (π √ ² °), no TeX.
- `F.row(fig1, fig2)` puts figures side by side; `F.cap(fig, 'caption')` adds a caption.
- Keep figures at most ~300 px wide (the PDF has two columns of about 320 px) and ~180 px high.
  If your lesson needs wide problems, set `assignmentCols: 1` on the lesson.
- A figure must be true to the problem (right labels, sensible proportions). A wrong figure
  is worse than none.

Need a helper that is missing? Define it inside your lesson file. **Do not edit `ca-core.js`**
or any shared file — others are working in parallel.

## Check your work

```sh
node math/challenge-academy/tools/validate.mjs 7           # structure, 300 runs per generator, 50-problem sheet
node math/challenge-academy/tools/build-assignments.mjs 7 --no-pdf --preview /some/scratch/dir
```

The second command renders the assignment and the lesson page (every tab laid open, three
samples of every generator with answers) in headless Chrome, reports KaTeX errors, and writes
PNGs of every page. **Look at the PNGs**: check figures, and check a sample of answers by hand
(or better, with an independent brute-force script). Leave building the real PDFs to the
final step (`build-assignments.mjs` with no flags).
