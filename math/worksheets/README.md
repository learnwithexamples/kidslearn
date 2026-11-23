# Math page worksheets

Every topic page in `math/` (except Challenge Academy, which has its own) has a
printable 50-problem assignment with an answer key:

- `topics/<page>.js` — the problem generators for `math/<page>.html`
- `worksheet.html?t=<page>` — the printable page
- `pdf/<page>-assignment.pdf` — the downloadable PDF, linked from the topic page

They use the Challenge Academy engine (`../challenge-academy/ca-core.js`). A topic
file is a Challenge Academy lesson without the tutorial and examples:

```js
CA.register({
    id: 'equations', title: 'Equations', page: 'equations.html',
    assignmentNote: '…optional instructions printed under the header…',
    compact: true,                           // optional: three columns, small answer space
    practice: [ { id, name, level: 1|2|3, gen(rng) { return { q, fig?, ans, sol }; } }, … ],
    assignment: [ ['one-step', 5], … ],      // counts add up to exactly 50
});
```

Read `../challenge-academy/lessons/README.md` for the rules on answers, TeX and
figures; `topics/equations.js` is a worked reference.

```sh
node math/challenge-academy/tools/validate.mjs equations           # or --topics for all
node math/challenge-academy/tools/build-assignments.mjs equations  # or --topics for all
```
