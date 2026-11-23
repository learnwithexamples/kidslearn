/* Challenge Academy — Lesson 1: Three Views of Rectangular Prisms and Cubes */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m;

    // ── Maths for cube stacks ────────────────────────────────────────────
    // heights[r][c]: cubes stacked on each square of the floor plan.
    // Row 0 is the back row, the last row is the front row.
    const sum = a => a.reduce((x, y) => x + y, 0);
    const count = h => sum(h.flat());
    const colMax = h => h[0].map((_, c) => Math.max(...h.map(row => row[c])));   // front view, left → right
    const rowMax = h => h.map(row => Math.max(...row));                           // back → front
    const views = h => ({ f: F.viewCount(h, 'front'), t: F.viewCount(h, 'top'), s: F.viewCount(h, 'left') });

    /** Exact surface area in unit squares, bottom included. */
    function surface(h) {
        let a = 0;
        const at = (r, c) => (h[r] && h[r][c]) || 0;
        for (let r = 0; r < h.length; r++) for (let c = 0; c < h[0].length; c++) {
            if (!h[r][c]) continue;
            a += 2;
            for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) a += Math.max(0, h[r][c] - at(r + dr, c + dc));
        }
        return a;
    }

    /** A random stack in which every row and every column has at least one cube. */
    function stack(rng, o = {}) {
        const rows = o.rows || rng.pick([2, 2, 3]), cols = o.cols || rng.pick([2, 3, 3]), maxH = o.maxH || 3;
        for (;;) {
            const h = Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng.bool(0.2) ? 0 : rng.int(1, maxH))));
            if (rowMax(h).every(x => x > 0) && colMax(h).every(x => x > 0) && count(h) >= rows + cols && (!o.ok || o.ok(h))) return h;
        }
    }
    const noHidden = h => { const v = views(h); return surface(h) === 2 * (v.f + v.t + v.s); };
    const cubes = (h, o = {}) => F.cubes(h, { side: 'left', ...o });
    const both = h => F.row(cubes(h), F.plan(h));
    const viewName = { front: 'front', top: 'top', left: 'left' };

    // Fewest / most cubes when you know the front view and the top view.
    const perCol = h => h[0].map((_, c) => h.filter(row => row[c] > 0).length);
    const maxFrontTop = h => sum(colMax(h).map((x, c) => x * perCol(h)[c]));
    const minFrontTop = h => sum(colMax(h).map((x, c) => x + perCol(h)[c] - 1));
    // Fewest / most cubes when you know the front view and the left view.
    const maxFrontSide = h => sum(rowMax(h).map(a => sum(colMax(h).map(b => Math.min(a, b)))));
    function minFrontSide(h) {
        const cm = colMax(h), rm = rowMax(h);
        let t = 0;
        for (let k = 1; k <= Math.max(...cm); k++) t += k * Math.max(cm.filter(x => x === k).length, rm.filter(x => x === k).length);
        return t;
    }

    // All three views known: a stack can be at most the smaller of its front column and its left column.
    const cap = (h, r, c) => (h[r][c] ? Math.min(colMax(h)[c], rowMax(h)[r]) : 0);
    const fullest = h => h.map((row, r) => row.map((_, c) => cap(h, r, c)));
    /** Do the three views allow only one solid?  True when no stack of the fullest solid can lose a cube. */
    function forced(h) {
        const g = fullest(h), cm = colMax(h), rm = rowMax(h);
        for (let r = 0; r < g.length; r++) for (let c = 0; c < g[0].length; c++) {
            const v = g[r][c];
            if (v <= 1) continue;
            const colNeeds = v === cm[c] && g.filter(row => row[c] === cm[c]).length === 1;
            const rowNeeds = v === rm[r] && g[r].filter(x => x === rm[r]).length === 1;
            if (!colNeeds && !rowNeeds) return false;
        }
        return true;
    }
    const planText = g => g.map((row, r) => `${r === 0 ? 'back row' : r === g.length - 1 ? 'front row' : 'next row'} ${row.join(', ')}`).join('; ');

    // ── Figures used in the tutorial ─────────────────────────────────────
    const H0 = [[3, 1, 0], [2, 1, 1]];
    const V0 = views(H0);
    const HD = [[2, 2, 2], [2, 0, 2], [2, 2, 2]];      // a ring: the hole hides four faces
    const VD = views(HD);
    const E3 = [[3, 2, 0], [1, 2, 1]];                 // example: fewest and most
    const E4 = [[2, 1], [3, 1], [1, 1]];
    const E5 = [[1, 1, 1], [3, 2, 0]];                 // three views pin this one down

    if (!forced(E5)) throw new Error('Lesson 1: the three-view example must have only one solution');

    CA.register({
        id: 1,

        tutorial: [
            {
                h: 'Looking at a solid from three sides',
                html: R`
                <p>A solid looks different depending on where you stand. Mathematicians agree on three standard
                   places to look from, and the flat pictures you see are called the <strong>three views</strong>:</p>
                <ul>
                    <li><strong>Front view</strong> — stand in front and look straight at it.</li>
                    <li><strong>Top view</strong> — float above it and look straight down.</li>
                    <li><strong>Left view</strong> — stand on the left and look straight at it.</li>
                </ul>
                <p>Here is a solid built from ${count(H0)} small cubes, and its three views.</p>
                ${F.row(F.cap(cubes(H0, { size: 32 }), 'The solid'))}
                ${F.threeViews(H0, { cell: 26 })}
                <div class="ca-key"><strong>Key idea.</strong> A view is a <em>shadow picture</em>: you only see the
                   outline squares, not how far away each cube is. A tall stack hides everything behind it.</div>
                <div class="ca-tip"><strong>Which way round is the left view?</strong> When you stand on the left,
                   the <em>back</em> of the solid is on your left hand and the <em>front</em> is on your right. So the
                   left column of the left view is the back row of the solid.</div>`,
            },
            {
                h: 'The floor plan: a top view with numbers',
                html: R`
                <p>The top view alone cannot tell you how tall anything is. So we write, in each square of the top
                   view, <strong>how many cubes are stacked there</strong>. This one small picture describes the whole
                   solid.</p>
                ${F.row(F.cap(cubes(H0, { size: 30 }), 'The solid'), F.plan(H0, { cell: 30 }))}
                <p>The <strong>bottom row</strong> of the plan is the <strong>front</strong> of the solid. From the
                   plan you can read off every view without imagining anything:</p>
                <ul>
                    <li><strong>Front view:</strong> look down each <em>column</em> of the plan and take the biggest
                        number. Here the columns give ${colMax(H0).join(', ')} — a front view ${colMax(H0).length}
                        columns wide with those heights.</li>
                    <li><strong>Left view:</strong> look along each <em>row</em> and take the biggest number. Here the
                        rows give ${rowMax(H0).join(' (back) and ')} (front). The top row of the plan is the left
                        column of the left view.</li>
                    <li><strong>Top view:</strong> every square with a number bigger than 0.</li>
                    <li><strong>Number of cubes:</strong> add up all the numbers:
                        ${m(H0.flat().filter(x => x).join('+') + '=' + count(H0))}.</li>
                </ul>`,
            },
            {
                h: 'Finding the volume from the three views',
                html: R`
                <p>Now go the other way: you are given the three views and must find how many cubes there are (the
                   <strong>volume</strong>, counted in cubes). Rebuild the floor plan in two steps.</p>
                ${F.threeViews(E5, { cell: 24 })}
                <div class="ca-key">
                    <strong>Step 1.</strong> Use the <strong>top view as the foundation</strong>: it shows exactly
                    which squares have cubes on them.<br>
                    <strong>Step 2.</strong> Use the <strong>front view</strong> and the <strong>left view</strong> to
                    decide the number of cubes on each square.
                </div>
                <p>Write the height of each front-view column <em>under</em> its column of the top view:
                   ${colMax(E5).join(', ')}. Write the height of each left-view column <em>beside</em> its row (left
                   column = back row): ${rowMax(E5).join(', ')}. Then:</p>
                <ul>
                    <li>A stack can never be taller than the number under its column, or the number beside its row.
                        So each square holds <strong>at most the smaller</strong> of its two numbers.</li>
                    <li>Every column must reach its number somewhere, and so must every row. If only one square
                        can do that job, that square is <strong>forced</strong>.</li>
                </ul>
                ${F.row(F.plan(fullest(E5), { cell: 28, label: 'The rebuilt floor plan' }), F.cap(cubes(fullest(E5)), 'The solid'))}
                <p>Here every square is forced, so the solid is certain: ${m(fullest(E5).flat().filter(x => x).join('+') + '=' + count(fullest(E5)))} cubes.
                   When some square is <em>not</em> forced, the views allow several solids, and the question will ask
                   for the most or the fewest cubes.</p>`,
            },
            {
                h: 'From views back to the solid: most and fewest cubes',
                html: R`
                <p>Two views usually do <em>not</em> pin a solid down. A typical contest question gives you the
                   <strong>front view</strong> and the <strong>top view</strong> and asks for the most, or the fewest,
                   cubes that could be used.</p>
                ${F.row(F.grid(F.viewCells(E3, 'front'), { label: 'Front view', cell: 26 }), F.grid(F.viewCells(E3, 'top'), { label: 'Top view', cell: 26 }))}
                <p>Work one column at a time. The front view says how tall each column <em>may</em> be; the top view
                   says how many stacks stand in that column.</p>
                <div class="ca-key">
                    <strong>Most cubes:</strong> make <em>every</em> stack in a column as tall as the front view
                    allows.<br>
                    <strong>Fewest cubes:</strong> make <em>one</em> stack in each column reach the full height, and
                    give every other stack in that column just 1 cube.
                </div>
                <p>Here the columns are ${colMax(E3).join(', ')} tall and contain ${perCol(E3).join(', ')} stacks.</p>
                <ul>
                    <li>Most: ${m(colMax(E3).map((x, c) => `${x}\\times${perCol(E3)[c]}`).join('+') + '=' + maxFrontTop(E3))} cubes.</li>
                    <li>Fewest: ${m(colMax(E3).map((x, c) => `(${x}+${perCol(E3)[c] - 1})`).join('+') + '=' + minFrontTop(E3))} cubes.</li>
                </ul>
                <div class="ca-tip"><strong>Front view and left view only?</strong> Then a stack standing where a
                   front column of height \(a\) crosses a left-view column of height \(b\) can be at most the
                   <em>smaller</em> of \(a\) and \(b\) tall. Add those up for the most cubes.</div>`,
            },
            {
                h: 'Surface area from the three views',
                html: R`
                <p>Counting the outside faces of a stack one by one is slow and easy to get wrong. The three views do
                   it for you. Every outside face points in one of six directions: front or back, left or right, up
                   or down. Opposite directions always show the same number of squares, so:</p>
                <div class="ca-formula">\[ S = (A_{\text{front view}} + A_{\text{left view}} + A_{\text{top view}}) \times 2 \]</div>
                <p>For the solid from the first section the views have ${V0.f}, ${V0.t} and ${V0.s} squares, so its
                   surface area is ${m(`2\\times(${V0.f}+${V0.t}+${V0.s})=${2 * (V0.f + V0.t + V0.s)}`)} squares.</p>
                <div class="ca-warn"><strong>Watch out for grooves.</strong> The formula only counts faces you
                   can see from far away. A <strong>groove</strong> is a dent or hole whose walls face each other, so
                   those faces are hidden from every view. When a solid has grooves, add the hidden faces on:
                   \[ S = (A_{\text{front view}} + A_{\text{left view}} + A_{\text{top view}}) \times 2 + A_{\text{hidden faces}} \]
                </div>
                ${F.row(F.cap(cubes(HD), 'A ring of cubes'), F.plan(HD))}
                <p>For this ring, the views give ${m(`2\\times(${VD.f}+${VD.t}+${VD.s})=${2 * (VD.f + VD.t + VD.s)}`)},
                   but the four walls of the hole in the middle add ${m(`4\\times 2=${surface(HD) - 2 * (VD.f + VD.t + VD.s)}`)}
                   more squares. The true surface area is ${surface(HD)} squares.</p>`,
            },
            {
                h: 'Rectangular prisms: three rectangles',
                html: R`
                <p>A rectangular prism (a box) with length \(l\), width \(w\) and height \(h\) has three very simple
                   views — all rectangles.</p>
                ${F.row(F.box(5, 3, 4, { labels: ['l', 'w', 'h'] }))}
                <table>
                    <tr><th>View</th><th>Rectangle</th><th>Area</th></tr>
                    <tr><td>Front</td><td>\(l\) by \(h\)</td><td>\(lh\)</td></tr>
                    <tr><td>Top</td><td>\(l\) by \(w\)</td><td>\(lw\)</td></tr>
                    <tr><td>Left</td><td>\(w\) by \(h\)</td><td>\(wh\)</td></tr>
                </table>
                <p>So the surface area is \(2(lh+lw+wh)\) — twice the three views added together, exactly as before.</p>
                <div class="ca-key"><strong>A neat trick.</strong> Multiply the three view areas:
                   \(lh \times lw \times wh = l^2w^2h^2 = (lwh)^2\). That is the volume squared! So
                   \[ V = \sqrt{A_{\text{front view}} \times A_{\text{left view}} \times A_{\text{top view}}} \]</div>
                <p>If the views have areas 20, 15 and 12, then \(V=\sqrt{20\times15\times12}=\sqrt{3600}=60\).</p>`,
            },
            {
                h: 'Taking cubes away',
                html: R`
                <p>What happens to the surface area of a big cube when one small cube is removed? Removing a cube
                   <em>takes away</em> the faces that were outside and <em>uncovers</em> the faces that were hidden.</p>
                <table>
                    <tr><th>Cube removed from…</th><th>Faces lost</th><th>Faces uncovered</th><th>Change</th></tr>
                    <tr><td>a corner</td><td>3</td><td>3</td><td>0</td></tr>
                    <tr><td>the middle of an edge</td><td>2</td><td>4</td><td>+2</td></tr>
                    <tr><td>the middle of a face</td><td>1</td><td>5</td><td>+4</td></tr>
                </table>
                <div class="ca-tip"><strong>Check it with views.</strong> Taking a corner off does not change any of
                   the three views, and makes no groove — so the surface area cannot change.</div>`,
            },
        ],

        summary: [
            { topic: 'Three views of a solid figure', points: [
                'Front view: look from the front.',
                'Left view: look from the left (the back row appears on the left).',
                'Top view: look from above. Writing the height of each stack on it gives the floor plan.',
            ] },
            { topic: 'Surface area of a solid figure', points: [
                R`No grooves: \(S = (A_{\text{front view}} + A_{\text{left view}} + A_{\text{top view}}) \times 2\)`,
                R`With grooves: \(S = (A_{\text{front view}} + A_{\text{left view}} + A_{\text{top view}}) \times 2 + A_{\text{hidden faces}}\)`,
            ] },
            { topic: 'Volume of a solid figure from its three views', points: [
                'Step 1: use the top view as the foundation.',
                'Step 2: use the front view and the left view to decide the number of cubes on each square.',
                'If the views do not force every square, find the most (fill every stack) or the fewest (one full stack per column).',
            ] },
        ],

        examples: [
            {
                title: 'Reading a floor plan',
                q: 'The floor plan shows how many cubes are stacked on each square. How many cubes are there, and how many squares does each of the three views show?',
                fig: both(E4),
                steps: [
                    R`Number of cubes: add the numbers. ${m(E4.flat().join('+') + '=' + count(E4))}.`,
                    R`Front view: the biggest number in each column is ${colMax(E4).join(' and ')}, so it shows ${m(colMax(E4).join('+') + '=' + views(E4).f)} squares.`,
                    R`Left view: the biggest number in each row is ${rowMax(E4).join(', ')}, so it shows ${m(rowMax(E4).join('+') + '=' + views(E4).s)} squares.`,
                    R`Top view: every square of the plan is used, so it shows ${views(E4).t} squares.`,
                ],
                answer: R`${count(E4)} cubes; front ${views(E4).f}, left ${views(E4).s}, top ${views(E4).t} squares.`,
            },
            {
                title: 'Surface area of a stack',
                q: 'The solid in Example 1 is built from cubes with 1 cm edges. Find its surface area (include the bottom).',
                fig: F.threeViews(E4),
                steps: [
                    R`The front, left and top views show ${views(E4).f}, ${views(E4).s} and ${views(E4).t} squares.`,
                    R`${m(`(${views(E4).f}+${views(E4).s}+${views(E4).t})\\times2=${2 * (views(E4).f + views(E4).t + views(E4).s)}`)} squares can be seen from outside.`,
                    surface(E4) === 2 * (views(E4).f + views(E4).t + views(E4).s)
                        ? R`Check for grooves: no stack stands between two taller ones, so no face is hidden.`
                        : R`Check for grooves: the back row (2 high) stands behind the taller middle row (3 high), so part of the back row's faces cannot be seen from the front or the back. Hidden faces: ${surface(E4) - 2 * (views(E4).f + views(E4).t + views(E4).s)} squares. Add them on.`,
                ],
                answer: R`${surface(E4)} cm²`,
            },
            {
                title: 'Volume from three views',
                q: 'A solid is built from cubes. Its three views are shown. How many cubes does it contain?',
                fig: F.threeViews(E5),
                steps: [
                    R`Step 1: the top view is the foundation. It has ${views(E5).t} squares, so there are ${views(E5).t} stacks.`,
                    R`Step 2: the front view says the columns are ${colMax(E5).join(', ')} tall; the left view says the rows are ${rowMax(E5).join(' (back) and ')} (front) tall.`,
                    R`Each stack is at most the smaller of its column number and its row number, and each column and row must reach its number. That forces every stack: ${planText(fullest(E5))}.`,
                    R`Add them: ${m(fullest(E5).flat().filter(x => x).join('+') + '=' + count(fullest(E5)))}.`,
                ],
                answer: R`${count(fullest(E5))} cubes`,
            },
            {
                title: 'Most and fewest cubes',
                q: 'A solid made of cubes has the front view and top view shown. What are the most and the fewest cubes it could contain?',
                fig: F.row(F.grid(F.viewCells(E3, 'front'), { label: 'Front view' }), F.grid(F.viewCells(E3, 'top'), { label: 'Top view' })),
                steps: [
                    R`Front view: the columns are ${colMax(E3).join(', ')} squares tall.`,
                    R`Top view: the columns hold ${perCol(E3).join(', ')} stacks.`,
                    R`Most — every stack at full height: ${m(colMax(E3).map((x, c) => `${x}\\times${perCol(E3)[c]}`).join('+') + '=' + maxFrontTop(E3))}.`,
                    R`Fewest — one full stack per column, the others 1 cube each: ${m(colMax(E3).map((x, c) => `(${x}+${perCol(E3)[c] - 1})`).join('+') + '=' + minFrontTop(E3))}.`,
                ],
                answer: R`most ${maxFrontTop(E3)}, fewest ${minFrontTop(E3)}`,
            },
            {
                title: 'A box from its views',
                q: R`The front view of a rectangular prism is a rectangle 8 cm wide and 5 cm tall. Its top view is a rectangle 8 cm wide and 3 cm deep. Find its volume and surface area.`,
                fig: F.row(F.box(8, 3, 5, { labels: ['8', '3', '5'] })),
                steps: [
                    R`The front view gives the length and the height: \(l=8\), \(h=5\).`,
                    R`The top view gives the length again and the width: \(w=3\).`,
                    R`Volume: \(8\times3\times5=120\) cm³.`,
                    R`Surface area: \(2\times(8\times5+8\times3+3\times5)=2\times79=158\) cm².`,
                ],
                answer: R`120 cm³ and 158 cm²`,
            },
            {
                title: 'Volume from three areas',
                q: R`The three views of a rectangular prism have areas 24 cm², 18 cm² and 12 cm². What is its volume?`,
                steps: [
                    R`The views are \(lh\), \(lw\) and \(wh\). Their product is \((lwh)^2=V^2\).`,
                    R`\(V^2=24\times18\times12=5184\).`,
                    R`\(V=\sqrt{5184}=72\). (Check: \(6\times4\times3=72\), with views \(24, 18, 12\).)`,
                ],
                answer: R`72 cm³`,
            },
            {
                title: 'Removing cubes',
                q: R`A \(4\times4\times4\) cube is built from 64 small cubes with 1 cm edges. One small cube is taken from the middle of each of the 6 faces. What is the surface area now?`,
                steps: [
                    R`Start: \(6\times4\times4=96\) cm².`,
                    R`Each removed cube takes away 1 outside face and uncovers 5 new ones: a change of \(+4\).`,
                    R`Six cubes are removed, far enough apart not to affect each other: \(96+6\times4=120\).`,
                ],
                answer: R`120 cm²`,
            },
        ],

        practice: [
            {
                id: 'count-cubes', name: 'Count the cubes', level: 1,
                gen(rng) {
                    const h = stack(rng);
                    return {
                        q: 'The floor plan shows how many cubes are stacked on each square. How many cubes are in the solid?',
                        fig: both(h),
                        ans: CA.num(count(h), 'cubes'),
                        sol: R`Add the numbers on the plan: ${m(h.flat().filter(x => x).join('+') + '=' + count(h))}.`,
                    };
                },
            },
            {
                id: 'view-squares', name: 'Squares in a view', level: 1,
                gen(rng) {
                    const h = stack(rng), which = rng.pick(['front', 'left', 'top']);
                    const n = F.viewCount(h, which);
                    const sol = which === 'front' ? R`Take the biggest number in each column: ${m(colMax(h).join('+') + '=' + n)}.`
                        : which === 'left' ? R`Take the biggest number in each row: ${m(rowMax(h).join('+') + '=' + n)}.`
                        : R`Count the squares of the plan that have cubes on them: ${n}.`;
                    return {
                        q: `The floor plan shows how many cubes are stacked on each square (the bottom row is the front). How many squares does the <strong>${viewName[which]} view</strong> show?`,
                        fig: F.row(F.plan(h)),
                        ans: CA.num(n, 'squares'),
                        sol,
                    };
                },
            },
            {
                id: 'which-view', name: 'Pick the right view', level: 1,
                gen(rng) {
                    const which = rng.pick(['front', 'left']);
                    const pic = (hh, w) => F.grid(F.viewCells(hh, w), { cell: 16 });
                    for (;;) {
                        const h = stack(rng);
                        const correct = pic(h, which);
                        const mirror = F.grid(F.viewCells(h, which).map(r => r.slice().reverse()), { cell: 16 });
                        const wrong = [pic(h, which === 'front' ? 'left' : 'front'), mirror, pic(h, 'top')];
                        for (let i = 0; i < 6; i++) {           // nearby stacks that look slightly different
                            const g = h.map(r => r.slice()), r = rng.int(0, g.length - 1), c = rng.int(0, g[0].length - 1);
                            g[r][c] = g[r][c] >= 3 ? 2 : g[r][c] + 1;
                            wrong.push(pic(g, which));
                        }
                        const distinct = [...new Set(wrong)].filter(w => w !== correct);
                        if (distinct.length < 3) continue;
                        return {
                            q: `Which picture is the <strong>${viewName[which]} view</strong> of this solid?`,
                            fig: both(h),
                            ans: CA.mc(rng, correct, distinct),
                            sol: which === 'front' ? `The columns of the plan have biggest numbers ${colMax(h).join(', ')}, so the front view has columns of those heights, left to right.`
                                : `The rows of the plan have biggest numbers ${rowMax(h).join(', ')} (back to front). From the left the back row is on the left, so the columns are ${rowMax(h).join(', ')} tall, left to right.`,
                        };
                    }
                },
            },
            {
                id: 'fill-box', name: 'Fill up the box', level: 1,
                gen(rng) {
                    const h = stack(rng), top = Math.max(...h.flat());
                    const vol = h.length * h[0].length * top;
                    return {
                        q: `How many more cubes are needed to turn this solid into a solid rectangular block ${h[0].length} cubes long, ${h.length} cubes deep and ${top} cubes high?`,
                        fig: both(h),
                        ans: CA.num(vol - count(h), 'cubes'),
                        sol: R`The block needs ${m(`${h[0].length}\\times${h.length}\\times${top}=${vol}`)} cubes. The solid has ${count(h)}. ${m(`${vol}-${count(h)}=${vol - count(h)}`)}.`,
                    };
                },
            },
            {
                id: 'prism-view-area', name: 'Area of one view of a box', level: 1,
                gen(rng) {
                    const [l, w, h] = [rng.int(4, 12), rng.int(2, 9), rng.int(2, 10)];
                    const which = rng.pick(['front', 'top', 'left']);
                    const [a, b] = which === 'front' ? [l, h] : which === 'top' ? [l, w] : [w, h];
                    const names = which === 'front' ? 'length and height' : which === 'top' ? 'length and width' : 'width and height';
                    return {
                        q: `A rectangular prism is ${l} cm long, ${w} cm wide and ${h} cm high. What is the area of its <strong>${viewName[which]} view</strong>?`,
                        fig: F.row(F.box(l, w, h, { labels: [`${l}`, `${w}`, `${h}`] })),
                        ans: CA.num(a * b, 'cm²'),
                        sol: R`The ${viewName[which]} view is a rectangle showing the ${names}: ${m(`${a}\\times${b}=${a * b}`)}.`,
                    };
                },
            },
            {
                id: 'prism-sa-views', name: 'Surface area from view areas', level: 2,
                gen(rng) {
                    const [l, w, h] = rng.shuffle([rng.int(2, 5), rng.int(4, 8), rng.int(6, 11)]);
                    const [f, t, s] = [l * h, l * w, w * h];
                    return {
                        q: `The front, left and top views of a rectangular prism have areas ${f} cm², ${s} cm² and ${t} cm². What is the surface area of the prism?`,
                        ans: CA.num(2 * (f + t + s), 'cm²'),
                        sol: R`Each view appears twice on the surface: ${m(`(${f}+${s}+${t})\\times2=${2 * (f + t + s)}`)}.`,
                    };
                },
            },
            {
                id: 'prism-dims', name: 'A box from two views', level: 2,
                gen(rng) {
                    const [l, w, h] = [rng.int(5, 12), rng.int(2, 6), rng.int(3, 9)];
                    const wantV = rng.bool();
                    const two = rng.pick([
                        [`Its front view is a rectangle ${l} cm wide and ${h} cm tall. Its top view is a rectangle ${l} cm wide and ${w} cm deep.`, `Front: length ${l}, height ${h}. Top: width ${w}.`],
                        [`Its front view is a rectangle ${l} cm wide and ${h} cm tall. Its left view is a rectangle ${w} cm wide and ${h} cm tall.`, `Front: length ${l}, height ${h}. Left: width ${w}.`],
                        [`Its top view is a rectangle ${l} cm wide and ${w} cm deep. Its left view is a rectangle ${w} cm wide and ${h} cm tall.`, `Top: length ${l}, width ${w}. Left: height ${h}.`],
                    ]);
                    return {
                        q: `Look at the views of a rectangular prism. ${two[0]} What is its <strong>${wantV ? 'volume' : 'surface area'}</strong>?`,
                        ans: wantV ? CA.num(l * w * h, 'cm³') : CA.num(2 * (l * w + l * h + w * h), 'cm²'),
                        sol: two[1] + ' ' + (wantV ? R`Volume ${m(`=${l}\\times${w}\\times${h}=${l * w * h}`)}.`
                            : R`Surface area ${m(`=2\\times(${l * h}+${l * w}+${w * h})=${2 * (l * w + l * h + w * h)}`)}.`),
                    };
                },
            },
            {
                id: 'surface-area', name: 'Surface area of a stack', level: 2,
                gen(rng) {
                    const h = stack(rng), v = views(h), seen = 2 * (v.f + v.t + v.s), sa = surface(h);
                    return {
                        q: 'This solid is built from cubes with 1 cm edges; the floor plan shows the height of each stack. Find its surface area, including the bottom.',
                        fig: both(h),
                        ans: CA.num(sa, 'cm²'),
                        sol: R`The views show ${v.f} (front), ${v.s} (left) and ${v.t} (top) squares: ${m(`(${v.f}+${v.s}+${v.t})\\times2=${seen}`)}.` +
                            (sa === seen ? ' There are no grooves, so no faces are hidden.' : R` Faces hidden in grooves between taller stacks: ${sa - seen} more. ${m(`${seen}+${sa - seen}=${sa}`)}.`),
                    };
                },
            },
            {
                id: 'sa-three-views', name: 'Surface area from three views', level: 2,
                gen(rng) {
                    const h = stack(rng, { ok: noHidden }), v = views(h), e = rng.pick([1, 2, 2, 3, 5]);
                    return {
                        q: `A solid is built from cubes with ${e} cm edges. Its three views are shown, and it has no grooves (no hidden faces). What is its surface area, including the bottom?`,
                        fig: F.threeViews(h),
                        ans: CA.num(2 * (v.f + v.t + v.s) * e * e, 'cm²'),
                        sol: R`${m(`(${v.f}+${v.s}+${v.t})\\times2=${2 * (v.f + v.t + v.s)}`)} squares` +
                            (e === 1 ? ', each 1 cm².' : R`, each ${m(`${e}\\times${e}=${e * e}`)} cm²: ${m(`${2 * (v.f + v.t + v.s)}\\times${e * e}=${2 * (v.f + v.t + v.s) * e * e}`)}.`),
                    };
                },
            },
            {
                id: 'max-cubes', name: 'Most cubes (front and top views)', level: 2,
                gen(rng) {
                    const h = stack(rng, { ok: x => maxFrontTop(x) !== minFrontTop(x) });
                    const cm = colMax(h), pc = perCol(h);
                    return {
                        q: 'A solid made of cubes has this front view and top view. What is the <strong>greatest</strong> number of cubes it could contain?',
                        fig: F.row(F.grid(F.viewCells(h, 'front'), { label: 'Front view' }), F.grid(F.viewCells(h, 'top'), { label: 'Top view' })),
                        ans: CA.num(maxFrontTop(h), 'cubes'),
                        sol: R`Columns are ${cm.join(', ')} tall and hold ${pc.join(', ')} stacks. Make every stack full height: ${m(cm.map((x, c) => `${x}\\times${pc[c]}`).join('+') + '=' + maxFrontTop(h))}.`,
                    };
                },
            },
            {
                id: 'min-cubes', name: 'Fewest cubes (front and top views)', level: 2,
                gen(rng) {
                    const h = stack(rng, { ok: x => maxFrontTop(x) !== minFrontTop(x) });
                    const cm = colMax(h), pc = perCol(h);
                    return {
                        q: 'A solid made of cubes has this front view and top view. What is the <strong>smallest</strong> number of cubes it could contain?',
                        fig: F.row(F.grid(F.viewCells(h, 'front'), { label: 'Front view' }), F.grid(F.viewCells(h, 'top'), { label: 'Top view' })),
                        ans: CA.num(minFrontTop(h), 'cubes'),
                        sol: R`Columns are ${cm.join(', ')} tall and hold ${pc.join(', ')} stacks. One full stack per column, 1 cube for each other stack: ${m(cm.map((x, c) => `(${x}+${pc[c] - 1})`).join('+') + '=' + minFrontTop(h))}.`,
                    };
                },
            },
            {
                id: 'three-views-cubes', name: 'Volume from three views', level: 2,
                gen(rng) {
                    const h = stack(rng, { ok: x => forced(x) && Math.max(...x.flat()) >= 2 && count(fullest(x)) > x.flat().filter(v => v).length + 1 });
                    const g = fullest(h), e = rng.pick([1, 1, 1, 2, 3]);
                    const n = count(g);
                    return {
                        q: e === 1 ? 'A solid is built from cubes. Its three views are shown. How many cubes does it contain?'
                            : `A solid is built from cubes with ${e} cm edges. Its three views are shown. What is the volume of the solid?`,
                        fig: F.threeViews(h),
                        ans: e === 1 ? CA.num(n, 'cubes') : CA.num(n * e ** 3, 'cm³'),
                        sol: R`Use the top view as the foundation (${views(h).t} stacks). Front view: columns ${colMax(h).join(', ')} tall. Left view: rows ${rowMax(h).join(', ')} tall, back to front. Each stack is the smaller of its two numbers, and every one is forced: ${planText(g)}. Total ${n} cubes` +
                            (e === 1 ? '.' : R`, each ${m(`${e}^3=${e ** 3}`)} cm³: ${m(`${n}\\times${e ** 3}=${n * e ** 3}`)}.`),
                    };
                },
            },
            {
                id: 'three-views-max', name: 'Most cubes (all three views)', level: 3,
                gen(rng) {
                    const h = stack(rng, { rows: rng.pick([2, 3]), cols: 3, ok: x => !forced(x) });
                    const g = fullest(h);
                    return {
                        q: 'A solid made of cubes has the three views shown. More than one solid is possible. What is the <strong>greatest</strong> number of cubes it could contain?',
                        fig: F.threeViews(h),
                        ans: CA.num(count(g), 'cubes'),
                        sol: R`Top view: ${views(h).t} stacks. Front columns ${colMax(h).join(', ')}; left-view rows ${rowMax(h).join(', ')} (back to front). Make every stack as tall as allowed — the smaller of its column and row numbers: ${planText(g)}. ${m(g.flat().filter(x => x).join('+') + '=' + count(g))}.`,
                    };
                },
            },
            {
                id: 'front-side-max', name: 'Most cubes (front and left views)', level: 3,
                gen(rng) {
                    const h = stack(rng, { rows: rng.pick([2, 3]), cols: 3 });
                    const cm = colMax(h), rm = rowMax(h);
                    return {
                        q: 'A solid made of cubes has this front view and left view. Nothing is known about the top view. What is the <strong>greatest</strong> number of cubes it could contain?',
                        fig: F.row(F.grid(F.viewCells(h, 'front'), { label: 'Front view' }), F.grid(F.viewCells(h, 'left'), { label: 'Left view' })),
                        ans: CA.num(maxFrontSide(h), 'cubes'),
                        sol: R`Front columns: ${cm.join(', ')}. Left-view columns: ${rm.join(', ')}. Where a front column meets a left-view column the stack can be as tall as the smaller of the two: ` +
                            rm.map(a => `(${cm.map(b => Math.min(a, b)).join('+')})`).join(' + ') + ` = ${maxFrontSide(h)}.`,
                    };
                },
            },
            {
                id: 'front-side-min', name: 'Fewest cubes (front and left views)', level: 3,
                gen(rng) {
                    const h = stack(rng, { rows: rng.pick([2, 3]), cols: 3 });
                    const cm = colMax(h), rm = rowMax(h);
                    return {
                        q: 'A solid made of cubes has this front view and left view. Nothing is known about the top view, and cubes only need to rest on the table or on other cubes. What is the <strong>smallest</strong> number of cubes it could contain?',
                        fig: F.row(F.grid(F.viewCells(h, 'front'), { label: 'Front view' }), F.grid(F.viewCells(h, 'left'), { label: 'Left view' })),
                        ans: CA.num(minFrontSide(h), 'cubes'),
                        sol: `Front columns: ${cm.join(', ')}. Left-view columns: ${rm.join(', ')}. One stack of height <em>k</em> can serve a front column <em>and</em> a left-view column of that height at once, so for each height you need as many stacks as the larger of the two counts: ` +
                            [...new Set([...cm, ...rm])].sort((a, b) => b - a).map(k => `${Math.max(cm.filter(x => x === k).length, rm.filter(x => x === k).length)} of height ${k}`).join(', ') + ` → ${minFrontSide(h)} cubes.`,
                    };
                },
            },
            {
                id: 'prism-volume', name: 'Volume from three view areas', level: 3,
                gen(rng) {
                    const [l, w, h] = rng.shuffle(rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10], 3));
                    const a = rng.shuffle([l * h, l * w, w * h]);
                    return {
                        q: `The three views of a rectangular prism are rectangles with areas ${a[0]} cm², ${a[1]} cm² and ${a[2]} cm². What is the volume of the prism?`,
                        ans: CA.num(l * w * h, 'cm³'),
                        sol: R`The product of the three areas is the volume squared: ${m(`${a[0]}\\times${a[1]}\\times${a[2]}=${a[0] * a[1] * a[2]}`)}, and ${m(`\\sqrt{${a[0] * a[1] * a[2]}}=${l * w * h}`)}. (The sides are ${[l, w, h].sort((x, y) => x - y).join(', ')}.)`,
                    };
                },
            },
            {
                id: 'remove-cube', name: 'Taking cubes away', level: 3,
                gen(rng) {
                    const n = rng.pick([3, 4, 5]), base = 6 * n * n;
                    const [what, change, why] = rng.pick([
                        ['One small cube is removed from a corner', 0, 'A corner cube loses 3 faces and uncovers 3: no change.'],
                        ['One small cube is removed from each of the 8 corners', 0, 'Each corner cube loses 3 faces and uncovers 3: no change.'],
                        ['One small cube is removed from the middle of an edge (not at a corner)', 2, 'It loses 2 faces and uncovers 4: +2.'],
                        ['One small cube is removed from the middle of a face (not touching an edge)', 4, 'It loses 1 face and uncovers 5: +4.'],
                        ['One small cube is removed from the middle of each of the 6 faces (not touching any edge)', 24, R`Each loses 1 face and uncovers 5: \(6\times4=+24\).`],
                    ]);
                    return {
                        q: R`A ${m(`${n}\\times${n}\\times${n}`)} cube is built from ${n ** 3} small cubes with 1 cm edges. ${what}. What is the surface area of the solid that is left?`,
                        ans: CA.num(base + change, 'cm²'),
                        sol: R`Before: ${m(`6\\times${n}\\times${n}=${base}`)}. ${why} ${change ? m(`${base}+${change}=${base + change}`) : `Still ${base}`}.`,
                    };
                },
            },
        ],

        assignment: [
            ['count-cubes', 3], ['view-squares', 4], ['which-view', 3], ['fill-box', 2], ['prism-view-area', 2],
            ['prism-sa-views', 3], ['prism-dims', 3], ['surface-area', 5], ['sa-three-views', 4], ['three-views-cubes', 4], ['max-cubes', 3], ['min-cubes', 3],
            ['three-views-max', 2], ['front-side-max', 2], ['front-side-min', 2], ['prism-volume', 3], ['remove-cube', 2],
        ],
    });
})();
