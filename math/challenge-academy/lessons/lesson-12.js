/* Challenge Academy — Lesson 12: Mid-term Review (Lessons 1–11) */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, T = CA.tex;
    const { FILL, SHADE, ACCENT, INK } = F.colors;

    // ── Small helpers ────────────────────────────────────────────────────
    const sum = a => a.reduce((x, y) => x + y, 0);
    const sq = x => R`\sqrt{${x}}`;
    const isqrt = n => { let a = Math.floor(Math.sqrt(n)); while (a * a > n) a--; while ((a + 1) * (a + 1) <= n) a++; return a; };
    const nonSquare = (rng, lo, hi) => { for (;;) { const n = rng.int(lo, hi); if (!CA.isSquare(n)) return n; } };
    const simp = (n, k = 1) => { const [c, r] = CA.simplifyRoot(n); return T.root(k * c, r); };
    const par = x => (x < 0 ? `(${x})` : `${x}`);
    const days = x => (x === 1 ? 'day' : 'days');

    // ── Lesson 1: cube stacks.  heights[r][c]; row 0 is the back row ──────
    const count = h => sum(h.flat());
    const colMax = h => h[0].map((_, c) => Math.max(...h.map(row => row[c])));     // front view, left → right
    const rowMax = h => h.map(row => Math.max(...row));                             // left view, left → right (back → front)
    const views = h => ({ f: F.viewCount(h, 'front'), l: F.viewCount(h, 'left'), t: F.viewCount(h, 'top') });
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
    /** How many different stacks (up to 2) share this stack's front, left and top views? */
    function solidsWithSameViews(h) {
        const cm = colMax(h), rm = rowMax(h), cells = [];
        h.forEach((row, r) => row.forEach((v, c) => { if (v) cells.push([r, c]); }));
        const g = h.map(row => row.map(() => 0));
        let found = 0;
        (function go(i) {
            if (found > 1) return;
            if (i === cells.length) { if (colMax(g).every((x, c) => x === cm[c]) && rowMax(g).every((x, r) => x === rm[r])) found++; return; }
            const [r, c] = cells[i];
            for (let v = 1; v <= Math.min(cm[c], rm[r]); v++) { g[r][c] = v; go(i + 1); }
            g[r][c] = 0;
        })(0);
        return found;
    }
    function stack(rng, ok) {
        for (;;) {
            const rows = rng.pick([2, 2, 3]), cols = rng.pick([2, 3, 3]);
            const h = Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng.bool(0.2) ? 0 : rng.int(1, 3))));
            if (rowMax(h).every(x => x > 0) && colMax(h).every(x => x > 0) && count(h) >= rows + cols && (!ok || ok(h))) return h;
        }
    }
    /** Front, left and top views, as the book draws them. */
    const threeViews = (h, cell = 20) => F.row(
        F.grid(F.viewCells(h, 'front'), { label: 'Front', cell }),
        F.grid(F.viewCells(h, 'left'), { label: 'Left', cell }),
        F.grid(F.viewCells(h, 'top'), { label: 'Top', cell }));
    const plan = h => F.grid(h, { numbers: true, label: 'Top view (heights)' });

    // ── Lesson 2: circle figures ─────────────────────────────────────────
    function sectorFig(rLabel, deg) {
        const cx = 84, cy = 76, r = 58;
        const [lx, ly] = F.polar(cx, cy, deg <= 60 ? 36 : 22, deg / 2);
        let b = F.sector(cx, cy, r, 0, deg, { fill: SHADE });
        b += F.text(cx + r / 2, cy + 15, rLabel, { size: 12 }) + F.text(lx, ly + 4, `${deg}°`, { size: 11 });
        return F.svg(168, 150, b, { label: 'sector' });
    }
    function ringFig(rIn, rOut, inLabel, outLabel) {
        const cx = 80, cy = 74, Ro = 62, Ri = Ro * rIn / rOut;
        let b = F.circle(cx, cy, Ro, { fill: SHADE }) + F.circle(cx, cy, Ri, { fill: '#ffffff' }) + F.dot(cx, cy, { r: 2 });
        b += F.line(cx, cy, cx + Ri, cy, { width: 1 }) + F.text(cx + Ri / 2, cy - 4, inLabel, { size: 11 });
        const [px, py] = F.polar(cx, cy, Ro, 225);
        b += F.line(cx, cy, px, py, { width: 1 }) + F.text(px - 4, py + 12, outLabel, { size: 11, anchor: 'end' });
        return F.svg(170, 150, b, { label: 'ring' });
    }
    /** A big semicircle with two smaller semicircles (diameters d1, d2 along its diameter) cut out. */
    function arbelosFig(d1, d2) {
        const x0 = 14, y = 96, s = 180 / (d1 + d2), xm = x0 + d1 * s, x1 = x0 + 180, Rb = 90, ra = d1 * s / 2, rb = d2 * s / 2;
        let b = F.path(`M${x0} ${y}A${Rb} ${Rb} 0 0 1 ${x1} ${y}A${rb} ${rb} 0 0 0 ${xm} ${y}A${ra} ${ra} 0 0 0 ${x0} ${y}Z`, { fill: SHADE });
        b += F.line(x0, y, x1, y) + F.text((x0 + xm) / 2, y + 16, `${d1} cm`, { size: 12 }) + F.text((xm + x1) / 2, y + 16, `${d2} cm`, { size: 12 });
        b += F.line(xm, y - 4, xm, y + 4);
        return F.svg(208, 118, b, { label: 'semicircles' });
    }
    /** A quarter circle with a semicircle (on one radius as diameter) cut out. */
    function quarterFig(label) {
        const x = 30, y = 112, Rq = 100, r = 50;
        let b = F.path(`M${x} ${y}L${x} ${y - Rq}A${Rq} ${Rq} 0 0 1 ${x + Rq} ${y}A${r} ${r} 0 0 0 ${x} ${y}Z`, { fill: SHADE });
        b += F.line(x, y, x + Rq, y) + F.rightAngle(x, y, 1, 0, 0, -1, 8) + F.text(x - 5, y - Rq / 2 + 4, label, { anchor: 'end', size: 12 }) + F.text(x + Rq / 2, y + 15, label, { size: 12 });
        return F.svg(150, 132, b, { label: 'quarter circle with a semicircle removed' });
    }
    /** The part of a sector between two radii. */
    function sectorRingFig(rIn, rOut, deg) {
        const cx = 30, cy = 122, Ro = 110, Ri = Ro * rIn / rOut;
        const [ax, ay] = F.polar(cx, cy, Ro, 0), [bx, by] = F.polar(cx, cy, Ro, deg), [cx2, cy2] = F.polar(cx, cy, Ri, deg), [dx, dy] = F.polar(cx, cy, Ri, 0);
        let b = F.path(`M${dx} ${dy}L${ax} ${ay}A${Ro} ${Ro} 0 0 0 ${bx.toFixed(2)} ${by.toFixed(2)}L${cx2.toFixed(2)} ${cy2.toFixed(2)}A${Ri.toFixed(2)} ${Ri.toFixed(2)} 0 0 1 ${dx.toFixed(2)} ${dy}Z`, { fill: SHADE });
        b += F.line(cx, cy, dx, dy, { dash: true, width: 1 }) + F.line(cx, cy, cx2, cy2, { dash: true, width: 1 }) + F.dot(cx, cy, { r: 2 });
        b += F.text(cx + Ri / 2, cy + 14, `${rIn} cm`, { size: 11 }) + F.text(cx + (Ri + Ro) / 2, cy + 14, `${rOut - rIn} cm`, { size: 11 });
        const [lx, ly] = F.polar(cx, cy, 20, deg / 2);
        b += F.text(lx + 4, ly + 4, `${deg}°`, { size: 10 });
        return F.svg(160, 140, b, { label: 'part of a sector' });
    }

    /** Semicircle on AB (length d) and right triangle ABC with BC = h: region ① is semicircle-only, ② triangle-only. */
    function semiTriFig(d, h, labelH) {
        const n2 = x => Math.round(x * 100) / 100;
        const Dw = 150, r = Dw / 2, H = h * Dw / d, x0 = 22, top = Math.max(r, H), yb = 12 + top;
        const t = H / Dw, px = x0 + Dw / (1 + t * t), py = yb - t * Dw / (1 + t * t), cx = x0 + r;
        const A = [x0, yb], B = [x0 + Dw, yb], C = [x0 + Dw, yb - H];
        const theta = Math.atan2(yb - py, px - cx) * 180 / Math.PI;
        const am = F.polar(cx, yb, r, (180 + theta) / 2);
        const l1 = [(am[0] + (A[0] + px) / 2) / 2, (am[1] + (A[1] + py) / 2) / 2];
        const l2 = [0.5 * C[0] + 0.2 * B[0] + 0.3 * px, 0.5 * C[1] + 0.2 * B[1] + 0.3 * py];
        const b =
            F.path(`M${A[0]} ${A[1]}A${r} ${r} 0 0 1 ${n2(px)} ${n2(py)}Z`, { fill: SHADE }) +
            F.path(`M${n2(px)} ${n2(py)}L${C[0]} ${n2(C[1])}L${B[0]} ${B[1]}A${r} ${r} 0 0 0 ${n2(px)} ${n2(py)}Z`, { fill: SHADE }) +
            F.path(`M${A[0]} ${A[1]}A${r} ${r} 0 0 1 ${B[0]} ${B[1]}Z`) + F.poly([A, B, C]) + F.rightAngle(B[0], B[1], -1, 0, 0, -1, 7) +
            F.text(l1[0], l1[1] + 4, '①', { size: 12 }) + F.text(l2[0] - 2, l2[1] + 6, '②', { size: 12 }) +
            F.text(A[0] - 8, A[1] + 4, 'A', { size: 12, italic: true }) + F.text(B[0] + 9, B[1] + 4, 'B', { size: 12, italic: true }) + F.text(C[0] + 9, C[1] + 2, 'C', { size: 12, italic: true }) +
            F.text(cx, yb + 16, `${d} cm`, { size: 12 }) + F.text(B[0] + 6, (B[1] + C[1]) / 2 + 4, labelH, { size: 12, anchor: 'start' });
        return F.svg(Dw + 80, yb + 22, b, { label: 'semicircle and right triangle' });
    }
    /** a + b·π with π = 3.14, in whole hundredths so nothing drifts; b = bn/bd. */
    const approx = (a, bn, bd = 1) => CA.round((a * 100 * bd + bn * 314) / (100 * bd), 2);

    // ── Lesson 8: a cone standing on a cylinder ──────────────────────────
    function siloFig(lab) {
        const cx = 80, rx = 44, ry = 12, top = 8, mid = 62, bot = 126;
        let b = F.path(`M${cx - rx} ${mid}L${cx - rx} ${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}L${cx + rx} ${mid}L${cx} ${top}Z`, { fill: FILL });
        b += F.path(`M${cx - rx} ${mid}A${rx} ${ry} 0 0 0 ${cx + rx} ${mid}`, { width: 1 }) + F.path(`M${cx - rx} ${mid}A${rx} ${ry} 0 0 1 ${cx + rx} ${mid}`, { dash: true, width: 1 });
        b += F.path(`M${cx - rx} ${bot}A${rx} ${ry} 0 0 1 ${cx + rx} ${bot}`, { dash: true, width: 1 });
        b += F.line(cx, bot, cx + rx, bot, { dash: true, width: 1 }) + F.text(cx + rx / 2, bot - 4, lab.r, { size: 12 });
        b += F.text(cx + rx + 6, (mid + bot) / 2 + 4, lab.h, { anchor: 'start', size: 12 }) + F.text(cx + rx / 2 + 8, (top + mid) / 2, lab.s, { anchor: 'start', size: 12 });
        return F.svg(180, 144, b, { label: 'cone on a cylinder' });
    }
    /** A box with the corner-to-corner segment (or just its two ends) marked. */
    const diagBox = (l, w, h, line) => F.row(F.box(l, w, h, {
        labels: [`${l}`, `${w}`, `${h}`],
        extra: ({ x, y, L, D, Dy, Ht }) => (line ? F.line(x, y, x + L + D, y - Ht - Dy, { dash: true, stroke: ACCENT }) : '')
            + F.dot(x, y, { fill: ACCENT, r: 3 }) + F.dot(x + L + D, y - Ht - Dy, { fill: ACCENT, r: 3 })
            + F.text(x - 4, y + 13, 'A', { bold: true, fill: ACCENT, anchor: 'end' }) + F.text(x + L + D + 6, y - Ht - Dy + 2, 'B', { bold: true, fill: ACCENT, anchor: 'start' }),
    }));

    // Figures for the tutorial and the examples
    const H0 = [[2, 1, 0], [3, 1, 1]];
    const V0 = views(H0);
    const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]];

    CA.register({
        id: 12,

        tutorial: [
            {
                h: 'Three views of cube solids (Lesson 1)',
                html: R`
                <p>This review collects the key ideas of Lessons 1–11 on a few pages. Read a section, cover it, and try to
                   say the formulas aloud before you start the mixed practice.</p>
                <p>Every solid has three standard views: the <strong>front view</strong>, the <strong>left view</strong> and the
                   <strong>top view</strong>.</p>
                ${F.row(F.cap(F.cubes(H0, { size: 26 }), 'The solid'), plan(H0))}
                ${threeViews(H0, 22)}
                <div class="ca-formula">\[ \text{No grooves:}\quad S = (A_\text{front} + A_\text{left} + A_\text{top})\times 2 \]
                   \[ \text{With grooves:}\quad S = (A_\text{front} + A_\text{left} + A_\text{top})\times 2 + A_\text{hidden faces} \]</div>
                <p>Here the views show ${V0.f}, ${V0.l} and ${V0.t} squares, so the surface area is
                   ${m(`(${V0.f}+${V0.l}+${V0.t})\\times2=${2 * (V0.f + V0.l + V0.t)}`)} squares${surface(H0) === 2 * (V0.f + V0.l + V0.t) ? ' (there are no grooves)' : ''}.</p>
                <div class="ca-key"><strong>Volume from three views.</strong> Step 1: use the <em>top view</em> as the
                   foundation. Step 2: use the front view (tallest stack in each column) and the left view (tallest stack in
                   each row) to write the number of cubes on each square. Then add the numbers.</div>`,
            },
            {
                h: 'Circles, sectors, cylinders and cones (Lessons 2 and 8)',
                html: R`
                <p>A sector with radius \(r\) and central angle \(n^\circ\) is \(\frac{n}{360}\) of its circle:</p>
                <div class="ca-formula">\[ \text{arc} = \frac{n}{360}\times 2\pi r \qquad\qquad \text{sector area} = \frac{n}{360}\times \pi r^2 \]</div>
                <div class="ca-key"><strong>Magic shapes.</strong> \(A_\text{shaded} = A_\text{total} - A_\text{unshaded}\). Turn an
                   irregular shape into a sum or difference of regular ones (circles, sectors, squares, triangles). Sometimes you
                   must <strong>subtract twice</strong>: two small semicircles cut from a big one leave
                   big − small − small.</div>
                <div class="ca-tip"><strong>Area difference.</strong> Adding the same piece to two regions (or taking it away
                   from both) does not change the <em>difference</em> of their areas. So “region ① − region ②” can often be
                   found as “whole shape A − whole shape B”, for example semicircle − triangle.</div>
                ${F.row(F.cylinder(3, 5, { labels: { r: 'r', h: 'h' }, max: 96 }), F.cone(3, 4, { labels: { r: 'r', h: 'h', l: 's' }, max: 96 }))}
                <table>
                    <tr><th></th><th>Surface area</th><th>Volume</th></tr>
                    <tr><th>Cylinder</th><td>\(2\pi r^2 + 2\pi r h\)</td><td>\(\pi r^2 h\)</td></tr>
                    <tr><th>Cone (slant height \(s\))</th><td>\(\pi r^2 + \pi r s\)</td><td>\(\frac13\pi r^2 h\)</td></tr>
                </table>
                <ul>
                    <li>In a cone \(r\), \(h\) and \(s\) form a right triangle: \(s^2 = r^2 + h^2\).</li>
                    <li><strong>Stacking:</strong> each time two solids are joined, two faces overlap and disappear from the surface.</li>
                    <li><strong>Removing a piece:</strong> new surface area = original + added area − lost area.</li>
                    <li><strong>Rotating:</strong> a rectangle spun about one side makes a cylinder; a right triangle spun about
                        a leg makes a cone. A different axis gives a different solid.</li>
                </ul>`,
            },
            {
                h: 'Negative numbers and their powers (Lesson 3)',
                html: R`
                <ul>
                    <li><strong>Products and quotients:</strong> count the negative factors. An <em>odd</em> number of them gives a
                        negative result, an <em>even</em> number a positive one. If any factor is 0, the product is 0.
                        Decide the sign first, then work with absolute values.</li>
                    <li><strong>Powers:</strong> for a negative base, an odd power is negative and an even power is positive:
                        \((-2)^3 = -8\), \((-2)^4 = 16\).</li>
                    <li><strong>Brackets matter:</strong> \(-2^4 = -(2^4) = -16\), but \((-2)^4 = 16\).</li>
                    <li><strong>In a longer expression</strong> find the value of each power first, then do the rest:
                        \((-2)^3-(-3)^2 = -8-9 = -17\).</li>
                </ul>
                <div class="ca-formula">\[ a^m\times a^n = a^{m+n} \qquad a^m\div a^n = a^{m-n}\ (m\ge n) \qquad a^0 = 1\ (a\ne0) \]</div>
                <p>Example: \((-3)^5\div(-3)^3 = (-3)^2 = 9\), and \((-1)^{99} + (-1)^{100} = -1 + 1 = 0\).</p>`,
            },
            {
                h: 'Efficiency problems (Lesson 4)',
                html: R`
                <div class="ca-formula">\[ \text{workload} = \text{work efficiency}\times\text{work time} \]</div>
                <ul>
                    <li><strong>Working together:</strong> treat the whole workload as “1”. Someone who needs 6 days alone has
                        efficiency \(\frac16\) per day. Efficiencies <em>add</em>: \(\frac16+\frac13 = \frac12\), so together the job
                        takes \(1\div\frac12 = 2\) days.</li>
                    <li><strong>One person's efficiency</strong> = group efficiency − efficiency of the others.</li>
                    <li><strong>Pipes:</strong> two inlets add; an inlet and an outlet subtract. An inlet that fills a tank in 4 h
                        with an outlet that empties it in 12 h gives \(\frac14-\frac1{12} = \frac16\): full in 6 h.</li>
                    <li><strong>Scatter plots</strong> (workload against time): join each point to the origin; the steeper the
                        line, the higher the efficiency.</li>
                </ul>
                <div class="ca-warn"><strong>Never add the times.</strong> Two people are faster than one, so the time together
                   must be <em>less</em> than either time alone.</div>`,
            },
            {
                h: 'Ratios, proportions, profit and discount (Lessons 5 and 7)',
                html: R`
                <ul>
                    <li><strong>Ratio of three quantities:</strong> make the shared quantity equal to the least common multiple.
                        If \(a:b = 2:3\) and \(b:c = 4:5\), make \(b = 12\): \(a:b:c = 8:12:15\).</li>
                    <li><strong>Proportional equation:</strong> product of means = product of extremes.
                        \(6 : x = 4 : 10\) gives \(4x = 60\), so \(x = 15\).</li>
                    <li><strong>A ratio that changes:</strong> set \(x\) from the ratio <em>before</em> the change, write both
                        quantities after the change, then use the new ratio as a proportion.</li>
                </ul>
                <div class="ca-formula">\[ \text{price} = \text{cost} + \text{profit} \qquad \text{profit percentage} = \frac{\text{profit}}{\text{cost}}\times100\% \]
                   \[ \text{price} = \text{cost}\times(1+\text{profit percentage}) \qquad \text{cost} = \text{price}\div(1+\text{profit percentage}) \]
                   \[ \text{discount rate} = \frac{\text{original price}-\text{new price}}{\text{original price}}\times100\% \qquad \text{new price} = \text{original price}\times(1-x\%) \]</div>
                <div class="ca-warn"><strong>Percent of what?</strong> Profit percentage is a percentage of the <em>cost</em>;
                   a discount is a percentage of the <em>original price</em>.</div>`,
            },
            {
                h: 'Arranging and counting (Lesson 6)',
                html: R`
                <ul>
                    <li><strong>Identical objects:</strong> only the <em>positions</em> matter, so choose them. Three identical
                        red balls and two identical blue balls in a row: choose 2 of the 5 places for blue, \(\binom52 = 10\) ways.</li>
                    <li><strong>Must be together — bind.</strong> Tie them into “one thing” and arrange that with everything
                        else; then remember the tied objects still have an order among themselves. Five people in a row with
                        A and B together: \(4!\times2! = 48\).</li>
                    <li><strong>Cannot be together — insert.</strong> Arrange the others first, then drop the separated objects
                        into different gaps. Five people with A and B <em>not</em> together: arrange the other 3 (\(3!\)), which
                        makes 4 gaps; put A and B in two of them (\(4\times3\)): \(6\times12 = 72\).</li>
                    <li><strong>Both rules at once:</strong> bind the adjacent ones first, insert the non-adjacent ones last.</li>
                </ul>`,
            },
            {
                h: 'Square roots and the Pythagorean theorem in solids (Lessons 9, 10 and 11)',
                html: R`
                <ul>
                    <li>A positive number has two square roots; \(\sqrt{\phantom{9}}\) means the positive one. 0 has one square
                        root; a negative number has none.</li>
                    <li>Rational numbers can be written \(\frac{a}{b}\): integers, fractions, terminating and repeating decimals.
                        Irrational numbers are the infinite non-repeating decimals: \(\pi\), \(\sqrt2\), \(1.030030003\ldots\)</li>
                    <li>To estimate or compare, square: \(49 &lt; 57 &lt; 64\), so \(7 &lt; \sqrt{57} &lt; 8\).</li>
                </ul>
                <div class="ca-formula">\[ \sqrt{a^2b} = a\sqrt b \qquad m\sqrt a\times n\sqrt b = mn\sqrt{ab} \qquad m\sqrt a\div n\sqrt b = \frac mn\sqrt{\frac ab} \]
                   \[ \sqrt{\frac ab} = \frac{\sqrt a\times\sqrt b}{\sqrt b\times\sqrt b} = \frac{\sqrt{ab}}{b} \qquad a\sqrt n \pm b\sqrt n = (a\pm b)\sqrt n \]</div>
                <p>Examples: \(\sqrt{72} = 6\sqrt2\); \(2\sqrt3\times5\sqrt6 = 10\sqrt{18} = 30\sqrt2\); \(\sqrt{\frac25} = \frac{\sqrt{10}}{5}\);
                   \(\sqrt8+\sqrt{18} = 2\sqrt2+3\sqrt2 = 5\sqrt2\) (simplify first, then combine like radicals).</p>
                <p><strong>Pythagoras with an unknown.</strong> If two sides of a right triangle are unknown, call one \(x\) and write
                   the other with \(x\). Legs 3 and \(x\), hypotenuse \(9-x\): \((9-x)^2-x^2 = 9\), so \(81-18x = 9\) and \(x = 4\)
                   (a 3-4-5 triangle).</p>
                ${F.row(F.box(4, 3, 3, { labels: ['l', 'w', 'h'], max: 110, extra: ({ x, y, L, D, Dy, Ht }) => F.line(x, y, x + L + D, y - Ht - Dy, { dash: true, stroke: ACCENT }) }))}
                <div class="ca-formula">\[ \text{space diagonal of a box} = \sqrt{l^2+w^2+h^2} \qquad\qquad \text{cube of edge } a:\ a\sqrt3 \]</div>
                <div class="ca-key"><strong>Shortest path on a surface.</strong> Unfold the faces flat; the shortest path is a
                   straight line. For a box between opposite corners, use the <em>longest</em> edge and the <em>sum of the
                   other two</em> as the legs: with edges \(a\le b\le c\), the shortest route is \(\sqrt{(a+b)^2+c^2}\).</div>`,
            },
        ],

        summary: [
            { topic: 'Lesson 1 · Three views', points: [R`Front, left and top views. Surface area \(= (A_\text{front}+A_\text{left}+A_\text{top})\times2\), plus hidden faces if there are grooves.`, R`Volume from views: start from the top view, then fill in heights from the front and left views.`] },
            { topic: 'Lesson 2 · Circles and sectors', points: [R`Sector: \(\frac{n}{360}\) of the circle, for both arc and area.`, R`\(A_\text{shaded}=A_\text{total}-A_\text{unshaded}\); the difference of two areas does not change when the same piece is added to both.`] },
            { topic: 'Lesson 3 · Negative numbers', points: [R`Odd number of negative factors → negative; even → positive; a zero factor → 0.`, R`\(a^m\times a^n=a^{m+n}\), \(a^m\div a^n=a^{m-n}\), \(a^0=1\). And \(-2^4\ne(-2)^4\).`] },
            { topic: 'Lesson 4 · Efficiency', points: [R`Workload = work efficiency × work time; take the whole job as 1.`, R`Efficiencies add when working together; an outlet pipe subtracts.`] },
            { topic: 'Lesson 5 · Ratios and proportions', points: [R`Join two ratios by making the common quantity their least common multiple.`, R`Product of means = product of extremes.`] },
            { topic: 'Lesson 6 · Arranging', points: [R`Identical objects: choose positions. Together: bind. Apart: insert into gaps. Bind first, insert last.`] },
            { topic: 'Lesson 7 · Benefits and costs', points: [R`Price = cost + profit; profit percentage = profit ÷ cost × 100%.`, R`New price = original price × (1 − discount rate).`] },
            { topic: 'Lesson 8 · Cylinders and cones', points: [R`Cylinder: \(S=2\pi r^2+2\pi rh\), \(V=\pi r^2h\). Cone: \(S=\pi r^2+\pi rs\), \(V=\frac13\pi r^2h\).`] },
            { topic: 'Lesson 9 · Square roots', points: [R`A positive number has two square roots; \(\sqrt a\) is the principal (positive) one. 0 has one; a negative number has none.`, R`Rational: integers, fractions, terminating and repeating decimals. Irrational: infinite non-repeating decimals. Estimate by squaring.`] },
            { topic: 'Lesson 10 · Radical expressions', points: [R`\(m\sqrt a\cdot n\sqrt b=mn\sqrt{ab}\); \(m\sqrt a\div n\sqrt b=\frac mn\sqrt{\frac ab}\); \(\sqrt{\frac ab}=\frac{\sqrt{ab}}{b}\).`, R`Simplify first, then add or subtract like radicals.`] },
            { topic: 'Lesson 11 · Pythagoras in solids', points: [R`Two unknown sides: call one \(x\) and set up an equation with the Pythagorean theorem.`, R`Space diagonal \(\sqrt{l^2+w^2+h^2}\). Shortest route over a box: legs = longest edge and the sum of the other two.`] },
        ],

        examples: [
            {
                title: 'Surface area and volume from three views',
                q: 'A solid is built from cubes with 2 cm edges. Its three views are shown, and it has no grooves. Find its surface area and its volume.',
                fig: threeViews(H0),
                steps: [
                    R`Count squares: front ${V0.f}, left ${V0.l}, top ${V0.t}.`,
                    R`Surface: ${m(`(${V0.f}+${V0.l}+${V0.t})\\times2=${2 * (V0.f + V0.l + V0.t)}`)} squares, each \(2\times2=4\) cm²: ${m(`${2 * (V0.f + V0.l + V0.t)}\\times4=${8 * (V0.f + V0.l + V0.t)}`)} cm².`,
                    R`Volume: start from the top view. The front view gives column heights ${colMax(H0).join(', ')}; the left view gives row heights ${rowMax(H0).join(' (back), ')} (front). The only way to fit both is ${H0.map(r => r.filter(x => x).join(', ')).join(' in the back row and ')} in the front row.`,
                    R`That is ${m(H0.flat().filter(x => x).join('+') + '=' + count(H0))} cubes of \(2^3=8\) cm³ each: ${count(H0) * 8} cm³.`,
                ],
                answer: R`${8 * (V0.f + V0.l + V0.t)} cm² and ${count(H0) * 8} cm³`,
            },
            {
                title: 'A magic shape',
                q: 'Two semicircles with diameters 6 cm and 4 cm are cut from a semicircle with diameter 10 cm, as shown. Find the area and the perimeter of the shaded region in terms of π.',
                fig: arbelosFig(6, 4),
                steps: [
                    R`Shaded = total − unshaded. Big semicircle: \(\frac12\pi\times5^2=\frac{25}{2}\pi\).`,
                    R`Small semicircles: \(\frac12\pi\times3^2+\frac12\pi\times2^2=\frac{9}{2}\pi+2\pi=\frac{13}{2}\pi\).`,
                    R`Area: \(\frac{25}{2}\pi-\frac{13}{2}\pi=6\pi\) cm².`,
                    R`Perimeter: three half-circumferences, \(5\pi+3\pi+2\pi=10\pi\) cm.`,
                ],
                answer: R`\(6\pi\) cm² and \(10\pi\) cm`,
            },
            {
                title: 'Pipes working together',
                q: 'Inlet pipe A fills a pool in 6 hours and inlet pipe B fills it in 12 hours. Outlet pipe C empties the full pool in 8 hours. With all three open, how long does it take to fill the empty pool?',
                steps: [
                    R`Take the pool as 1. Efficiencies per hour: A \(\frac16\), B \(\frac1{12}\), C \(-\frac18\).`,
                    R`Together: \(\frac16+\frac1{12}-\frac18=\frac{4+2-3}{24}=\frac18\).`,
                    R`Time \(=1\div\frac18=8\) hours.`,
                ],
                answer: R`8 hours`,
            },
            {
                title: 'Profit after a discount',
                q: 'A shop buys a jacket for $80 and sets its original price 50% above the cost. In a sale the jacket is sold with a discount of 20%. What is the profit percentage now?',
                steps: [
                    R`Original price \(=80\times(1+50\%)=\$120\).`,
                    R`New price \(=120\times(1-20\%)=\$96\).`,
                    R`Profit \(=96-80=\$16\). Profit percentage \(=\frac{16}{80}\times100\%=20\%\).`,
                ],
                answer: R`20%`,
            },
            {
                title: 'Bind and insert',
                q: 'Six students A, B, C, D, E and F stand in a row. A and B must stand next to each other, but C and D must not. How many arrangements are there?',
                steps: [
                    R`Bind first: tie A and B into one block (2 orders inside the block).`,
                    R`Leave C and D out. Arrange the block with E and F: \(3!=6\) ways. This makes 4 gaps.`,
                    R`Insert last: put C and D into two different gaps, \(4\times3=12\) ways.`,
                    R`Total: \(2\times6\times12=144\).`,
                ],
                answer: R`144`,
            },
            {
                title: 'An ant on a box',
                q: 'A box is 4 cm long, 2 cm wide and 3 cm high. (a) How long is its space diagonal AB? (b) An ant walks on the surface from A to B. What is the shortest distance it can walk?',
                fig: diagBox(4, 2, 3, true),
                steps: [
                    R`(a) \(\sqrt{4^2+2^2+3^2}=\sqrt{29}\) cm.`,
                    R`(b) Unfold two faces into one rectangle. The three choices give \(\sqrt{(2+3)^2+4^2}=\sqrt{41}\), \(\sqrt{(4+2)^2+3^2}=\sqrt{45}\) and \(\sqrt{(4+3)^2+2^2}=\sqrt{53}\).`,
                    R`The smallest is \(\sqrt{41}\) cm (the longest edge, 4, stands alone). It is longer than the space diagonal, as it must be.`,
                ],
                answer: R`(a) \(\sqrt{29}\) cm &nbsp; (b) \(\sqrt{41}\) cm`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'rv-negative-powers', name: 'L3 · Negative numbers and powers', level: 1,
                gen(rng) {
                    const type = rng.int(0, 7);
                    const a = rng.int(2, 5);
                    if (type === 0) {
                        const n = rng.int(3, 5);
                        const fs = Array.from({ length: n }, () => rng.int(1, 5) * (rng.bool(0.6) ? -1 : 1));
                        if (rng.bool(0.12)) fs[rng.int(0, n - 1)] = 0;
                        const negs = fs.filter(x => x < 0).length, v = fs.reduce((x, y) => x * y, 1);
                        return { q: R`Calculate \(${fs.map(par).join('\\times')}\).`, ans: CA.num(v === 0 ? 0 : v), sol: fs.includes(0) ? 'One factor is 0, so the product is 0.' : R`There ${negs === 1 ? 'is 1 negative factor' : `are ${negs} negative factors`} (${negs % 2 ? 'odd → negative' : 'even → positive'}), and \(${fs.map(Math.abs).join('\\times')}=${Math.abs(v)}\). Answer: \(${v}\).` };
                    }
                    if (type === 1) { const n = rng.int(2, a > 3 ? 3 : 5); return { q: R`Calculate \((-${a})^{${n}}\).`, ans: CA.num((-a) ** n), sol: R`The exponent is ${n % 2 ? 'odd, so the result is negative' : 'even, so the result is positive'}: \(${a}^{${n}}=${a ** n}\), giving \(${(-a) ** n}\).` }; }
                    if (type === 2) { const n = rng.pick([2, 4]); return { q: R`Calculate \(-${a}^{${n}}\).`, ans: CA.num(-(a ** n)), sol: R`There are no brackets, so only ${a} is raised to the power: \(-(${a}^{${n}})=-${a ** n}\). (Compare \((-${a})^{${n}}=${a ** n}\).)` }; }
                    if (type === 3) {
                        const es = [rng.int(7, 60), rng.int(61, 150), rng.pick([999, 1000, 2025, 2026, 501])];
                        const vs = es.map(e => (e % 2 ? -1 : 1));
                        return { q: R`Calculate \(${es.map(e => `(-1)^{${e}}`).join('+')}\).`, ans: CA.num(sum(vs)), sol: R`Odd powers of \(-1\) are \(-1\), even powers are \(1\): \(${vs.map(par).join('+')}=${sum(vs)}\).` };
                    }
                    if (type === 4) {
                        const b = rng.pick([2, 3]), mm = rng.int(2, 3), n = rng.int(2, b === 2 ? 4 : 3);
                        return { q: R`Calculate \((-${b})^{${mm}}\times(-${b})^{${n}}\).`, ans: CA.num((-b) ** (mm + n)), sol: R`Same base, so add the exponents: \((-${b})^{${mm + n}}\). The exponent is ${(mm + n) % 2 ? 'odd' : 'even'}, so the result is ${(mm + n) % 2 ? 'negative' : 'positive'}: \(${(-b) ** (mm + n)}\).` };
                    }
                    if (type === 5) {
                        const b = rng.int(2, 6), n = rng.int(2, 9), d = rng.int(0, 3), mm = n + d;
                        return { q: R`Calculate \((-${b})^{${mm}}\div(-${b})^{${n}}\).`, ans: CA.num((-b) ** d), sol: R`Same base, so subtract the exponents: \((-${b})^{${mm}-${n}}=(-${b})^{${d}}=${(-b) ** d}\).` + (d === 0 ? R` (Any nonzero number to the power 0 is 1.)` : '') };
                    }
                    if (type === 6) {
                        const b = rng.int(2, 4);
                        return { q: R`Calculate \((-${a})^2-(-${b})^3\).`, ans: CA.num(a * a + b ** 3), sol: R`\((-${a})^2=${a * a}\) and \((-${b})^3=-${b ** 3}\). So \(${a * a}-(-${b ** 3})=${a * a + b ** 3}\).` };
                    }
                    const b = rng.int(2, 6);
                    return { q: R`Calculate \(-${a}^2+(-${b})^2\).`, ans: CA.num(b * b - a * a), sol: R`\(-${a}^2=-${a * a}\) (no brackets) and \((-${b})^2=${b * b}\). So \(-${a * a}+${b * b}=${b * b - a * a}\).` };
                },
            },
            {
                id: 'rv-sector', name: 'L2 · Sectors', level: 1,
                gen(rng) {
                    const deg = rng.pick([30, 45, 60, 72, 90, 120, 135, 150, 240, 270]), r = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
                    const [n, d] = CA.reduce(deg, 360);
                    const type = rng.int(0, 2);
                    const fig = F.row(sectorFig(`${r} cm`, deg));
                    if (type === 0) return { q: `Find the area of this sector in terms of π. Its radius is ${r} cm and its angle is ${deg}°.`, fig, ans: CA.pi(deg * r * r, 360, 'cm²'), sol: R`The sector is \(\frac{${deg}}{360}=\frac{${n}}{${d}}\) of the circle: \(\frac{${n}}{${d}}\times\pi\times${r}^2=${T.pi(deg * r * r, 360)}\) cm².` };
                    if (type === 1) return { q: `Find the length of the arc of this sector in terms of π. Its radius is ${r} cm and its angle is ${deg}°.`, fig, ans: CA.pi(deg * 2 * r, 360, 'cm'), sol: R`The arc is \(\frac{${deg}}{360}=\frac{${n}}{${d}}\) of the circumference: \(\frac{${n}}{${d}}\times2\pi\times${r}=${T.pi(deg * 2 * r, 360)}\) cm.` };
                    // sector area given → radius.  area = n/d · π r²
                    return { q: R`A sector with an angle of ${deg}° has an area of \(${T.pi(deg * r * r, 360)}\) cm². What is its radius?`, ans: CA.num(r, 'cm'), sol: R`The whole circle has area \(${T.pi(deg * r * r, 360)}\div\frac{${n}}{${d}}=${r * r}\pi\) cm², so \(r^2=${r * r}\) and \(r=${r}\) cm.` };
                },
            },
            {
                id: 'rv-square-roots', name: 'L9 · Square roots and irrational numbers', level: 1,
                gen(rng) {
                    const type = rng.int(0, 5);
                    const k = rng.int(4, 20), N = k * k;
                    if (type === 0) return { q: `Which of these lists <strong>all</strong> the square roots of ${N}?`, ans: CA.mc(rng, R`\(${k}\) and \(-${k}\)`, [R`\(${k}\) only`, R`\(-${k}\) only`, 'It has no square roots']), sol: R`\(${k}^2=(-${k})^2=${N}\): a positive number has two square roots, \(\pm${k}\). Only the symbol \(\sqrt{${N}}\) means just ${k}.` };
                    if (type === 1) {
                        for (;;) {
                            const p = rng.int(1, 12), q = rng.int(2, 12);
                            if (p === q || CA.gcd(p, q) !== 1) continue;
                            return { q: R`Evaluate \(-\sqrt{\frac{${p * p}}{${q * q}}}\). Give your answer as a fraction.`, ans: CA.frac(-p, q), sol: R`\(\sqrt{\frac{${p * p}}{${q * q}}}=\frac{${p}}{${q}}\) (the positive root), so the answer is \(-\frac{${p}}{${q}}\).` };
                        }
                    }
                    if (type === 2) {
                        const n = nonSquare(rng, 5, 300), a = isqrt(n);
                        return { q: R`\(\sqrt{${n}}\) lies between two consecutive integers. What is the <strong>larger</strong> one?`, ans: CA.num(a + 1), sol: R`Square it: ${n} lies between the perfect squares \(${a}^2=${a * a}\) and \(${a + 1}^2=${(a + 1) ** 2}\), so \(${a}&lt;\sqrt{${n}}&lt;${a + 1}\).` };
                    }
                    if (type === 3) {
                        const [t, rat, why] = rng.pick([
                            () => { const n = nonSquare(rng, 2, 99); return [sq(n), false, `${n} is not a perfect square`]; },
                            () => { const j = rng.int(2, 15); return [sq(j * j), true, R`it equals ${j}`]; },
                            () => { const d = rng.pick(['1.\\overline{35}', '0.\\overline{6}', '-4.07\\overline{24}', '2.\\overline{18}']); return [d, true, 'it is a repeating decimal, and every repeating decimal is a fraction']; },
                            () => { const d = rng.pick(['1.030030003\\ldots', '0.101001000100001\\ldots', '4.121121112\\ldots']); return [d, false, 'its digits never end and no block repeats']; },
                            () => { const d = rng.pick(['\\pi', '-\\sqrt{2}', '\\frac{\\pi}{2}', '3\\sqrt{5}']); return [d, false, 'it is an infinite non-repeating decimal']; },
                            () => { const d = rng.pick(['\\frac{22}{7}', '-\\frac{1}{3}', '3.14', '\\sqrt{0.25}', '\\sqrt{\\frac{4}{9}}', '-0.214']); return [d, true, 'it can be written as a ratio of two integers']; },
                        ])();
                        return { q: R`Is \(${t}\) rational or irrational?`, ans: CA.mc(rng, rat ? 'Rational' : 'Irrational', ['Rational', 'Irrational'], { keepOrder: true }), sol: `${rat ? 'Rational' : 'Irrational'}: ${why}.` };
                    }
                    if (type === 4) {
                        const a = nonSquare(rng, 2, 40), b = rng.int(2, 15);
                        return { q: R`Evaluate \(\left(\sqrt{${a}}\right)^2+\sqrt{(-${b})^2}\).`, ans: CA.num(a + b), sol: R`\((\sqrt{${a}})^2=${a}\) and \(\sqrt{(-${b})^2}=\sqrt{${b * b}}=${b}\). Sum: ${a + b}.` };
                    }
                    const c = rng.pick([N, 0, -N, nonSquare(rng, 2, 50)]);
                    return { q: `How many square roots does ${c < 0 ? '−' + -c : c} have?`, ans: CA.num(c > 0 ? 2 : c === 0 ? 1 : 0), sol: c > 0 ? 'A positive number has two square roots, one positive and one negative.' : c === 0 ? '0 has one square root, itself.' : 'A negative number has no square root.' };
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'rv-three-views', name: 'L1 · Three views', level: 2,
                gen(rng) {
                    const type = rng.int(0, 2);
                    if (type === 0) {
                        const h = stack(rng, x => { const v = views(x); return surface(x) === 2 * (v.f + v.l + v.t); });
                        const v = views(h), e = rng.pick([1, 2, 3, 5]), n = 2 * (v.f + v.l + v.t);
                        return {
                            q: `A solid is built from cubes with ${e} cm edges. Its front, left and top views are shown, and it has no grooves. What is its surface area?`,
                            fig: threeViews(h), ans: CA.num(n * e * e, 'cm²'),
                            sol: R`\((${v.f}+${v.l}+${v.t})\times2=${n}\) squares` + (e === 1 ? ', each 1 cm².' : R`, each \(${e}\times${e}=${e * e}\) cm²: \(${n}\times${e * e}=${n * e * e}\) cm².`),
                        };
                    }
                    if (type === 1) {
                        const h = stack(rng, x => { const v = views(x); return surface(x) > 2 * (v.f + v.l + v.t); });
                        const v = views(h), n = 2 * (v.f + v.l + v.t), sa = surface(h);
                        return {
                            q: 'This solid is built from cubes with 1 cm edges; the top view shows the height of each stack (the bottom row of the top view is the front). It has grooves. Find its surface area, including the bottom.',
                            fig: F.row(F.cubes(h), plan(h)), ans: CA.num(sa, 'cm²'),
                            sol: R`Views: front ${v.f}, left ${v.l}, top ${v.t}, so \((${v.f}+${v.l}+${v.t})\times2=${n}\). Hidden faces inside the grooves (faces that look at a taller stack on the far side of a lower one): ${sa - n}. Total \(${n}+${sa - n}=${sa}\) cm².`,
                        };
                    }
                    const h = stack(rng, x => Math.max(...x.flat()) >= 2 && solidsWithSameViews(x) === 1);
                    const e = rng.pick([1, 1, 2]);
                    return {
                        q: `A solid is built from cubes with ${e} cm edges. Its front, left and top views are shown. What is its volume?`,
                        fig: threeViews(h), ans: CA.num(count(h) * e ** 3, 'cm³'),
                        sol: R`Start from the top view and write a height on each square. Front view: columns ${colMax(h).join(', ')} tall. Left view: rows ${rowMax(h).join(', ')} tall (back to front). Only one filling fits: ${h.map(r => r.join(' ')).join(' / ')} (back row first). That is ${count(h)} cubes` + (e === 1 ? R`, so ${count(h)} cm³.` : R` of \(${e}^3=${e ** 3}\) cm³: ${count(h) * e ** 3} cm³.`),
                    };
                },
            },
            {
                id: 'rv-shaded-shapes', name: 'L2 · Magic shapes and area differences', level: 2,
                gen(rng) {
                    const type = rng.int(0, 5);
                    if (type === 5) {
                        const d = rng.pick([4, 8, 12, 16, 20]), h = rng.int(Math.ceil(0.4 * d), Math.floor(0.7 * d)), val = approx(-d * h / 2, d * d, 8);
                        return { q: R`A semicircle is drawn on \(AB=${d}\) cm, and \(ABC\) is a right triangle with its right angle at \(B\) and \(BC=${h}\) cm, as shown. How much larger is the area of region ① than the area of region ②? Use \(\pi=3.14\).`,
                            fig: F.row(semiTriFig(d, h, `${h} cm`)), ans: CA.num(val, 'cm²'),
                            sol: R`Add the white part to both regions: the difference does not change. ① − ② = semicircle − triangle \(=\frac12\times3.14\times${d / 2}^2-\frac12\times${d}\times${h}=${T.num(approx(0, d * d, 8))}-${d * h / 2}=${T.num(val)}\) cm².` };
                    }
                    if (type === 0) {
                        const r = rng.int(1, 7), R2 = r + rng.int(1, 5);
                        return { q: `Two circles have the same centre. Their radii are ${r} cm and ${R2} cm. Find the area of the shaded ring in terms of π.`, fig: F.row(ringFig(r, R2, `${r}`, `${R2}`)), ans: CA.pi(R2 * R2 - r * r, 1, 'cm²'), sol: R`Shaded = total − unshaded: \(\pi\times${R2}^2-\pi\times${r}^2=${R2 * R2}\pi-${r * r}\pi=${R2 * R2 - r * r}\pi\) cm².` };
                    }
                    if (type === 1 || type === 2) {
                        const a = rng.int(1, 6), b = rng.int(1, 6);
                        const fig = F.row(arbelosFig(2 * a, 2 * b));
                        const intro = `Two semicircles with diameters ${2 * a} cm and ${2 * b} cm are cut out of a large semicircle whose diameter is ${2 * (a + b)} cm, as shown.`;
                        if (type === 1) return { q: `${intro} Find the area of the shaded region in terms of π.`, fig, ans: CA.pi(a * b, 1, 'cm²'), sol: R`Radii: ${a + b}, ${a} and ${b} cm. \(\frac12\pi\times${a + b}^2-\frac12\pi\times${a}^2-\frac12\pi\times${b}^2=\frac12\pi\times(${(a + b) ** 2}-${a * a}-${b * b})=${a * b}\pi\) cm².` };
                        return { q: `${intro} Find the perimeter of the shaded region in terms of π.`, fig, ans: CA.pi(2 * (a + b), 1, 'cm'), sol: R`The boundary is three semicircular arcs: \(\pi\times${a + b}+\pi\times${a}+\pi\times${b}=${2 * (a + b)}\pi\) cm.` };
                    }
                    if (type === 3) {
                        const r = rng.int(1, 8);
                        return { q: `A quarter circle has radius ${2 * r} cm. A semicircle, drawn on one of its straight sides as diameter, is cut out of it. Find the area of the shaded region in terms of π.`, fig: F.row(quarterFig(`${2 * r} cm`)), ans: CA.pi(r * r, 2, 'cm²'), sol: R`Quarter circle: \(\frac14\pi\times${2 * r}^2=${r * r}\pi\). Semicircle of radius ${r}: \(\frac12\pi\times${r}^2=${T.pi(r * r, 2)}\). Shaded: \(${r * r}\pi-${T.pi(r * r, 2)}=${T.pi(r * r, 2)}\) cm².` };
                    }
                    const deg = rng.pick([40, 45, 60, 72, 80]), r = rng.int(2, 6), R2 = r + rng.int(1, 4);
                    return { q: `The shaded region is the part of a ${deg}° sector of radius ${R2} cm that lies outside the ${deg}° sector of radius ${r} cm with the same centre. Find its area in terms of π.`, fig: F.row(sectorRingFig(r, R2, deg)), ans: CA.pi(deg * (R2 * R2 - r * r), 360, 'cm²'), sol: R`Big sector − small sector: \(\frac{${deg}}{360}\times\pi\times(${R2}^2-${r}^2)=${T.frac(deg, 360)}\times${R2 * R2 - r * r}\pi=${T.pi(deg * (R2 * R2 - r * r), 360)}\) cm².` };
                },
            },
            {
                id: 'rv-efficiency', name: 'L4 · Efficiency problems', level: 2,
                gen(rng) {
                    const type = rng.int(0, 4);
                    const [who1, who2, job] = rng.pick([['Ava', 'Ben', 'paint a fence'], ['Mia', 'Leo', 'tile a floor'], ['Team A', 'Team B', 'build a road'], ['Zoe', 'Sam', 'type a report'], ['Machine P', 'Machine Q', 'fill an order']]);
                    const PAIRS = [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [6, 30], [12, 36], [8, 24], [15, 30], [10, 40], [14, 35], [9, 18], [5, 20], [12, 4], [18, 9], [30, 6], [6, 8], [4, 6], [10, 14], [5, 8], [3, 4]];
                    if (type === 0) {
                        const [a, b] = rng.pick(PAIRS);
                        return { q: `${who1} can ${job} in ${a} days. ${who2} can do the same job in ${b} days. How many days do they need if they work together?`, ans: CA.frac(a * b, a + b, 'days', { mixed: true }), sol: R`Take the job as 1. Efficiencies: \(\frac1{${a}}+\frac1{${b}}=${T.frac(a + b, a * b)}\) per day. Time \(=1\div${T.frac(a + b, a * b)}=${T.mixed(a * b, a + b)}\) days.` };
                    }
                    if (type === 1) {
                        const [a, b] = rng.pick(PAIRS.filter(([x, y]) => (x * y) % (x + y) === 0)), t = a * b / (a + b);
                        return { q: `Working together, ${who1} and ${who2} can ${job} in ${t} days. ${who1} alone would need ${a} days. How many days would ${who2} need alone?`, ans: CA.num(b, 'days'), sol: R`${who2}'s efficiency = group efficiency − ${who1}'s: \(\frac1{${t}}-\frac1{${a}}=${T.frac(a - t, a * t)}\). So ${who2} needs ${b} days.` };
                    }
                    if (type === 2) {
                        for (;;) {
                            const a = rng.int(2, 10), b = rng.int(a + 1, 30);
                            if ((a * b) % (b - a)) continue;
                            return { q: `An inlet pipe can fill an empty tank in ${a} hours. An outlet pipe can empty the full tank in ${b} hours. If both pipes are open, how long does it take to fill the empty tank?`, ans: CA.num(a * b / (b - a), 'hours'), sol: R`Overall inflow efficiency = inlet − outlet: \(\frac1{${a}}-\frac1{${b}}=${T.frac(b - a, a * b)}\) of the tank per hour. Time \(=${a * b / (b - a)}\) hours.` };
                        }
                    }
                    if (type === 3) {
                        for (;;) {
                            const [a, b] = rng.pick(PAIRS), k = rng.int(1, a - 1);
                            const [n, d] = CA.reduce((a - k) * b, a + b);
                            if (d > 6) continue;
                            return { q: `${who1} alone can ${job} in ${a} days, and ${who2} alone in ${b} days. ${who1} works alone for ${k} ${days(k)}, and then ${who2} joins in. How many more days do they need to finish?`, ans: CA.frac(n, d, 'days', { mixed: true }), sol: R`${who1} does \(\frac{${k}}{${a}}\) alone, leaving \(${T.frac(a - k, a)}\). Together their efficiency is \(\frac1{${a}}+\frac1{${b}}=${T.frac(a + b, a * b)}\). Time \(=${T.frac(a - k, a)}\div${T.frac(a + b, a * b)}=${T.mixed(n, d)}\) days.` };
                        }
                    }
                    const e = rng.int(12, 60), t1 = rng.int(3, 8), t2 = rng.int(2, 9), e2 = e + rng.int(4, 20);
                    return { q: `A machine makes ${e * t1} parts in ${t1} hours. A faster machine makes ${e2} parts per hour. Working together, how many parts do the two machines make in ${t2} hours?`, ans: CA.num((e + e2) * t2, 'parts'), sol: R`Efficiency = workload ÷ time: \(${e * t1}\div${t1}=${e}\) parts per hour. Together: \(${e}+${e2}=${e + e2}\) per hour, so \(${e + e2}\times${t2}=${(e + e2) * t2}\) parts.` };
                },
            },
            {
                id: 'rv-ratios', name: 'L5 · Ratios and proportions', level: 2,
                gen(rng) {
                    const type = rng.int(0, 3);
                    if (type === 0 || type === 1) {
                        for (;;) {
                            const p = rng.int(1, 7), q = rng.int(2, 8), r = rng.int(2, 8), s = rng.int(1, 9);
                            if (CA.gcd(p, q) !== 1 || CA.gcd(r, s) !== 1 || q === r || p === q || r === s) continue;
                            const L = CA.lcm(q, r), parts = [p * L / q, L, s * L / r];
                            const unify = R`Make \(b\) the same in both ratios: the least common multiple of ${q} and ${r} is ${L}. \(a:b=${parts[0]}:${L}\) and \(b:c=${L}:${parts[2]}\), so \(a:b:c=${parts.join(':')}\).`;
                            if (type === 0) return { q: R`\(a:b=${p}:${q}\) and \(b:c=${r}:${s}\). Find \(a:b:c\) in simplest form.`, ans: CA.ratio(parts), sol: unify };
                            const k = rng.int(2, 6), total = sum(parts) * k, i = rng.int(0, 2);
                            return { q: R`Three numbers \(a\), \(b\) and \(c\) add up to ${total}. \(a:b=${p}:${q}\) and \(b:c=${r}:${s}\). What is \(${'abc'[i]}\)?`, ans: CA.num(parts[i] * k), sol: unify + R` That is \(${sum(parts)}\) parts, each worth \(${total}\div${sum(parts)}=${k}\). So \(${'abc'[i]}=${parts[i]}\times${k}=${parts[i] * k}\).` };
                        }
                    }
                    if (type === 2) {
                        for (;;) {
                            const c = rng.int(2, 9), d = rng.int(2, 9), k = rng.int(2, 7), x = rng.int(1, 12);
                            if (CA.gcd(c, d) !== 1) continue;
                            // (x + j) : (d k) = c : d   →  x + j = c k
                            const j = c * k - x;
                            if (j < 1) continue;
                            return { q: R`Solve the proportion \((x+${j}):${d * k}=${c}:${d}\).`, ans: CA.num(x), sol: R`Product of means = product of extremes: \(${d}(x+${j})=${d * k}\times${c}=${d * k * c}\). So \(x+${j}=${c * k}\) and \(x=${x}\).` };
                        }
                    }
                    for (;;) {
                        const a = rng.int(1, 7), b = rng.int(1, 7), x = rng.int(2, 12), k = rng.int(2, 30), gain = rng.bool();
                        if (CA.gcd(a, b) !== 1 || a === b) continue;
                        const A2 = gain ? a * x + k : a * x - k;
                        if (A2 < 1) continue;
                        const [c, d] = CA.reduce(A2, b * x);
                        if (c > 12 || d > 12 || c * b === a * d) continue;
                        const [n1, n2] = rng.pick([['Amy', 'Bo'], ['Kai', 'Lena'], ['Omar', 'Pia']]);
                        return {
                            q: `The ratio of ${n1}'s stickers to ${n2}'s stickers is ${a} : ${b}. After ${n1} ${gain ? 'gets' : 'gives away'} ${k} ${gain ? 'more ' : ''}stickers, the ratio becomes ${c} : ${d}. How many stickers did ${n1} have at first?`,
                            ans: CA.num(a * x, 'stickers'),
                            sol: R`Before: ${n1} \(${a}x\), ${n2} \(${b}x\). After: \((${a}x${gain ? '+' : '-'}${k}):${b}x=${c}:${d}\). Means and extremes: \(${d}(${a}x${gain ? '+' : '-'}${k})=${c}\times${b}x\), so \(${d * a}x${gain ? '+' : '-'}${d * k}=${c * b}x\) and \(x=${x}\). ${n1} had \(${a}\times${x}=${a * x}\).`,
                        };
                    }
                },
            },
            {
                id: 'rv-profit', name: 'L7 · Profit and discount', level: 2,
                gen(rng) {
                    const type = rng.int(0, 5);
                    const item = rng.pick(['a jacket', 'a pair of skates', 'a backpack', 'a lamp', 'a toy robot', 'a watch', 'a scooter']);
                    for (;;) {
                        const C = rng.int(2, 40) * 10, p = rng.pick([10, 20, 25, 30, 40, 50, 60, 75]), x = rng.pick([10, 15, 20, 25, 30, 40]);
                        const P = C * (100 + p) / 100;
                        if (!Number.isInteger(P)) continue;
                        if (type === 0) return { q: `A shop buys ${item} for $${C} and sells it for $${P}. What is the profit percentage?`, ans: CA.num(p, '%'), sol: R`Profit \(=${P}-${C}=${P - C}\). Profit percentage \(=\frac{${P - C}}{${C}}\times100\%=${p}\%\).` };
                        if (type === 1) return { q: `${item[0].toUpperCase() + item.slice(1)} costs a shop $${C}. The shop wants a profit percentage of ${p}%. What should the price be?`, ans: CA.num(P, '$'), sol: R`Price = cost × (1 + profit percentage) \(=${C}\times${(100 + p) / 100}=${P}\).` };
                        if (type === 2) return { q: `A shop sells ${item} for $${P}, which gives a profit percentage of ${p}%. What did it cost the shop?`, ans: CA.num(C, '$'), sol: R`Cost = price ÷ (1 + profit percentage) \(=${P}\div${(100 + p) / 100}=${C}\).` };
                        const N = C * (100 - x) / 100;
                        if (!Number.isInteger(N)) continue;
                        if (type === 3) return { q: `The price of ${item} is reduced from $${C} to $${N}. What is the discount rate?`, ans: CA.num(x, '%'), sol: R`Discount rate \(=\frac{${C}-${N}}{${C}}\times100\%=\frac{${C - N}}{${C}}\times100\%=${x}\%\).` };
                        if (type === 4) return { q: `After a discount of ${x}%, ${item} costs $${N}. What was the original price?`, ans: CA.num(C, '$'), sol: R`Original price = new price ÷ (1 − ${x}%) \(=${N}\div${(100 - x) / 100}=${C}\).` };
                        const S = P * (100 - x) / 100;
                        if (!Number.isInteger(S) || S <= C || ((S - C) * 100) % C) continue;
                        return { q: `A shop buys ${item} for $${C} and sets its original price ${p}% above the cost. In a sale it is sold with a discount of ${x}%. What is the profit percentage now?`, ans: CA.num((S - C) * 100 / C, '%'), sol: R`Original price \(=${C}\times${(100 + p) / 100}=${P}\). New price \(=${P}\times${(100 - x) / 100}=${S}\). Profit \(=${S}-${C}=${S - C}\), and \(\frac{${S - C}}{${C}}\times100\%=${(S - C) * 100 / C}\%\).` };
                    }
                },
            },
            {
                id: 'rv-cylinder-cone', name: 'L8 · Cylinders and cones', level: 2,
                gen(rng) {
                    const type = rng.int(0, 4);
                    const r = rng.int(2, 9), h = rng.int(2, 12);
                    if (type === 0) return { q: `Find the volume of a cylinder with radius ${r} cm and height ${h} cm, in terms of π.`, fig: F.row(F.cylinder(r, h, { labels: { r: `${r}`, h: `${h}` }, max: 110 })), ans: CA.pi(r * r * h, 1, 'cm³'), sol: R`\(V=\pi r^2h=\pi\times${r}^2\times${h}=${r * r * h}\pi\) cm³.` };
                    if (type === 1) return { q: `Find the total surface area of a cylinder with radius ${r} cm and height ${h} cm, in terms of π.`, fig: F.row(F.cylinder(r, h, { labels: { r: `${r}`, h: `${h}` }, max: 110 })), ans: CA.pi(2 * r * (r + h), 1, 'cm²'), sol: R`\(S=2\pi r^2+2\pi rh=2\pi\times${r * r}+2\pi\times${r}\times${h}=${2 * r * r}\pi+${2 * r * h}\pi=${2 * r * (r + h)}\pi\) cm².` };
                    const [tr, th, ts] = rng.pick(TRIPLES), flip = rng.bool();
                    const cr = flip ? th : tr, ch = flip ? tr : th;
                    if (cr > 3 * ch) return this.gen(rng);
                    const coneFig = lab => F.row(F.cone(cr, ch, { labels: lab, max: 110 }));
                    if (type === 2) return { q: `Find the volume of a cone with radius ${cr} cm and height ${ch} cm, in terms of π.`, fig: coneFig({ r: `${cr}`, h: `${ch}` }), ans: CA.pi(cr * cr * ch, 3, 'cm³'), sol: R`\(V=\frac13\pi r^2h=\frac13\times\pi\times${cr}^2\times${ch}=${T.pi(cr * cr * ch, 3)}\) cm³.` };
                    if (type === 3) return { q: `A cone has radius ${cr} cm and height ${ch} cm. Find its total surface area in terms of π.`, fig: coneFig({ r: `${cr}`, h: `${ch}`, l: 's' }), ans: CA.pi(cr * (cr + ts), 1, 'cm²'), sol: R`Slant height: \(s^2=${cr}^2+${ch}^2=${ts * ts}\), so \(s=${ts}\). \(S=\pi r^2+\pi rs=${cr * cr}\pi+${cr * ts}\pi=${cr * (cr + ts)}\pi\) cm².` };
                    return { q: `A cone with slant height ${ts} cm stands on top of a cylinder of height ${h} cm. Both have radius ${cr} cm. Find the total surface area of the combined solid in terms of π.`, fig: F.row(siloFig({ r: `${cr}`, h: `${h}`, s: `${ts}` })), ans: CA.pi(cr * cr + 2 * cr * h + cr * ts, 1, 'cm²'), sol: R`The cone's base and the cylinder's top overlap, so they are not on the surface. What is left: the cylinder's base \(${cr * cr}\pi\), its side \(2\pi\times${cr}\times${h}=${2 * cr * h}\pi\), and the cone's side \(\pi\times${cr}\times${ts}=${cr * ts}\pi\). Total \(${cr * cr + 2 * cr * h + cr * ts}\pi\) cm².` };
                },
            },
            {
                id: 'rv-radicals', name: 'L10 · Working with radicals', level: 2,
                gen(rng) {
                    const type = rng.int(0, 7);
                    if (type === 6) {
                        const nn = rng.int(1, 4), k = rng.int(2, 6), b = rng.pick([2, 3, 5, 7]), r = rng.pick([2, 3, 5, 6, 7].filter(z => z !== b));
                        return { q: R`Simplify \(${T.root(nn * k, b * r)}\div${T.root(nn, b)}\).`, ans: CA.root(k, r),
                            sol: R`\(m\sqrt a\div n\sqrt b=\frac{m}{n}\sqrt{\frac ab}\): \(\frac{${nn * k}}{${nn}}\sqrt{\frac{${b * r}}{${b}}}=${T.root(k, r)}\).` };
                    }
                    if (type === 7) {
                        for (;;) {
                            const q = rng.pick([2, 3, 5, 6, 7, 10]), p = rng.int(2, 9);
                            if (CA.gcd(p, q) !== 1 || CA.isSquare(p * q)) continue;
                            const [c, rr] = CA.simplifyRoot(p * q);
                            const show = (num, den) => { const [a1, d1] = CA.reduce(num, den); return d1 === 1 ? T.root(a1, rr) : R`\frac{${T.root(a1, rr)}}{${d1}}`; };
                            const right = show(c, q);
                            const wrong = [R`\frac{\sqrt{${p}}}{${q}}`, show(c, p * q), show(c, p), show(c, 1), R`\frac{\sqrt{${q}}}{${p}}`].filter(w => w !== right);
                            const raw = R`\frac{\sqrt{${p * q}}}{${q}}`;
                            return { q: R`Write \(\sqrt{\frac{${p}}{${q}}}\) with a rational denominator, in simplest form.`, ans: CA.mc(rng, m(right), wrong.map(w => m(w))),
                                sol: R`\(\sqrt{\frac{${p}}{${q}}}=\frac{\sqrt{${p}}}{\sqrt{${q}}}=\frac{\sqrt{${p}}\times\sqrt{${q}}}{\sqrt{${q}}\times\sqrt{${q}}}=${raw}${raw === right ? '' : '=' + right}\).` };
                        }
                    }
                    const r = rng.pick([2, 3, 5, 6, 7]);
                    if (type === 0) { const c = rng.int(2, 9), n = c * c * r; return { q: R`Write \(\sqrt{${n}}\) in simplest radical form.`, ans: CA.rootOf(n), sol: R`\(\sqrt{${n}}=\sqrt{${c * c}\times${r}}=${T.root(c, r)}\).` }; }
                    if (type === 1) {
                        const [u, v] = rng.sample([1, 2, 3, 4, 5, 6], 2), plus = u < v || rng.bool();
                        const total = plus ? u + v : u - v;
                        return { q: R`Simplify \(\sqrt{${r * u * u}}${plus ? '+' : '-'}\sqrt{${r * v * v}}\).`, ans: CA.root(total, r), sol: R`\(${T.root(u, r)}${plus ? '+' : '-'}${T.root(v, r)}=${T.root(total, r)}\) (simplify each root first, then collect like radicals).` };
                    }
                    if (type === 2) {
                        for (;;) {
                            const [p, q] = rng.sample([2, 3, 5, 6, 8, 10, 12, 15], 2), a = rng.int(2, 5), b = rng.int(1, 4);
                            if (CA.simplifyRoot(p * q)[0] === 1) continue;
                            return { q: R`Simplify \(${T.root(a, p)}\times${T.root(b, q)}\).`, ans: CA.root(a * b, p * q), sol: R`\(${a}\times${b}\times\sqrt{${p}\times${q}}=${T.root(a * b, p * q)}=${simp(p * q, a * b)}\).` };
                        }
                    }
                    if (type === 3) { const t = rng.int(1, 7); return { q: R`Rationalise the denominator and simplify: \(\dfrac{${t * r}}{\sqrt{${r}}}\).`, ans: CA.root(t, r), sol: R`Multiply top and bottom by \(\sqrt{${r}}\): \(\dfrac{${t * r}\sqrt{${r}}}{${r}}=${T.root(t, r)}\).` }; }
                    if (type === 4) { const a = rng.int(2, 9); return { q: R`Expand and simplify \(\left(${a}+\sqrt{${r}}\right)\left(${a}-\sqrt{${r}}\right)\).`, ans: CA.num(a * a - r), sol: R`Difference of squares: \(${a}^2-(\sqrt{${r}})^2=${a * a}-${r}=${a * a - r}\).` }; }
                    const c1 = rng.int(2, 6), r2 = rng.pick([2, 3, 5, 6, 7].filter(z => z !== r)), c2 = rng.int(2, 6);
                    if (c1 * c1 * r === c2 * c2 * r2 || Math.abs(c1 * c1 * r - c2 * c2 * r2) > 30) return this.gen(rng);
                    const big = c1 * c1 * r > c2 * c2 * r2 ? T.root(c1, r) : T.root(c2, r2);
                    return { q: R`Which is greater, \(${T.root(c1, r)}\) or \(${T.root(c2, r2)}\)?`, ans: CA.mc(rng, m(big), [m(T.root(c1, r)), m(T.root(c2, r2)), 'They are equal'], { keepOrder: true }), sol: R`Compare squares: \((${T.root(c1, r)})^2=${c1 * c1 * r}\) and \((${T.root(c2, r2)})^2=${c2 * c2 * r2}\). The greater is \(${big}\).` };
                },
            },
            {
                id: 'rv-space-diagonal', name: 'L11 · Pythagoras: equations, diagonals, cones', level: 2,
                gen(rng) {
                    const type = rng.int(0, 6);
                    if (type >= 5) {
                        const [p, q2, c0] = rng.pick(TRIPLES.filter(t => t[2] <= 25)), flip = rng.bool();
                        const k = type === 5 ? 1 : 10, a = k * (flip ? q2 : p), b = k * (flip ? p : q2), c = k * c0;   // a: across, b: the answer
                        if (type === 5 && b + c > 30) return this.gen(rng);
                        if (type === 5) return { q: `A bamboo pole ${b + c} m tall snaps, and its top touches the ground ${a} m from the foot of the pole (the bottom part stays upright). How high above the ground is the break?`,
                            ans: CA.num(b, 'm'), sol: R`Let the break be \(x\) m high; the broken part is \(${b + c}-x\). Pythagoras: \(x^2+${a}^2=(${b + c}-x)^2\), so \(${a * a}=${(b + c) ** 2}-${2 * (b + c)}x\), \(${2 * (b + c)}x=${(b + c) ** 2 - a * a}\) and \(x=${b}\) m.` };
                        return { q: `A reed sticks up ${c - b} cm above the water of a pond. When it is pulled sideways, keeping its root fixed, its tip just reaches the surface ${a} cm from where the reed stood. How deep is the pond?`,
                            ans: CA.num(b, 'cm'), sol: R`Let the depth be \(x\); the reed is \(x+${c - b}\) long. \(x^2+${a}^2=(x+${c - b})^2\), so \(${a * a}=${2 * (c - b)}x+${(c - b) ** 2}\) and \(x=${b}\) cm.` };
                    }
                    if (type === 0 || type === 1) {
                        const nice = type === 0;
                        const [l, w, h] = nice ? rng.pick([[2, 1, 2], [6, 2, 3], [4, 1, 8], [6, 2, 9], [4, 4, 7], [4, 3, 12], [8, 4, 1], [6, 3, 2], [12, 3, 4], [6, 6, 7], [4, 4, 2], [8, 4, 8]]) : [rng.int(3, 9), rng.int(1, 5), rng.int(2, 7)];
                        const d2 = l * l + w * w + h * h;
                        const ctx = rng.pick([`A box is ${l} cm long, ${w} cm wide and ${h} cm high. How long is the space diagonal AB?`, `What is the length of the longest straight rod that fits inside a box ${l} cm long, ${w} cm wide and ${h} cm high? (It runs from corner A to the opposite corner B.)`]);
                        return { q: ctx + (nice ? '' : ' Give your answer in simplest radical form.'), fig: diagBox(l, w, h, true), ans: CA.rootOf(d2, 'cm'), sol: R`\(AB=\sqrt{${l}^2+${w}^2+${h}^2}=\sqrt{${l * l}+${w * w}+${h * h}}=\sqrt{${d2}}` + (simp(d2) === sq(d2) ? R`\) cm.` : R`=${simp(d2)}\) cm.`) };
                    }
                    if (type === 2) { const a = rng.int(2, 15); return { q: `A cube has edges of ${a} cm. Find the length of its space diagonal in simplest radical form.`, ans: CA.root(a, 3, 'cm'), sol: R`\(\sqrt{${a}^2+${a}^2+${a}^2}=\sqrt{3\times${a}^2}=${T.root(a, 3)}\) cm.` }; }
                    if (type === 3) {
                        const [a, b, c] = rng.pick(TRIPLES), flip = rng.bool(), r = flip ? b : a, h = flip ? a : b, find = rng.pick(['s', 'h']);
                        if (r > 3 * h) return this.gen(rng);
                        return find === 's'
                            ? { q: `A cone has radius ${r} cm and height ${h} cm. What is its slant height?`, fig: F.row(F.cone(r, h, { labels: { r: `${r}`, h: `${h}`, l: 's' }, max: 110 })), ans: CA.num(c, 'cm'), sol: R`\(s^2=${r}^2+${h}^2=${r * r + h * h}\), so \(s=${c}\) cm.` }
                            : { q: `A cone has radius ${r} cm and slant height ${c} cm. What is its height?`, fig: F.row(F.cone(r, h, { labels: { r: `${r}`, h: 'h', l: `${c}` }, max: 110 })), ans: CA.num(h, 'cm'), sol: R`\(h^2=${c}^2-${r}^2=${c * c - r * r}\), so \(h=${h}\) cm.` };
                    }
                    const [a, b, c] = rng.pick(TRIPLES.filter(t => t[0] % 2 === 0 || t[1] % 2 === 0));
                    const [dia, h] = a % 2 === 0 && (b % 2 || rng.bool()) ? [a, b] : [b, a];
                    if (dia > 3 * h) return this.gen(rng);
                    return { q: `A cylinder has radius ${dia / 2} cm and height ${h} cm. What is the length of the longest straight rod that fits inside it?`, fig: F.row(F.cylinder(dia / 2, h, { labels: { r: `${dia / 2}`, h: `${h}` }, max: 110 })), ans: CA.num(c, 'cm'), sol: R`The rod runs from the edge of the bottom to the opposite edge of the top: a right triangle with legs ${dia} (the diameter) and ${h}. \(\sqrt{${dia}^2+${h}^2}=\sqrt{${c * c}}=${c}\) cm.` };
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'rv-arranging', name: 'L6 · Bind, insert and choose', level: 3,
                gen(rng) {
                    const type = rng.int(0, 5);
                    const n = rng.int(5, 7);
                    const who = rng.pick(['students', 'friends', 'runners', 'singers']);
                    if (type === 0) return { q: `${n} ${who} stand in a row. Two of them, A and B, must stand next to each other. How many arrangements are there?`, ans: CA.num(2 * CA.fact(n - 1)), sol: R`Bind A and B into one block: ${n - 1} things to arrange, \(${n - 1}!=${CA.fact(n - 1)}\) ways. Inside the block A and B can swap: \(${CA.fact(n - 1)}\times2=${2 * CA.fact(n - 1)}\).` };
                    if (type === 1) return { q: `${n} ${who} stand in a row. Three of them, A, B and C, must all stand together. How many arrangements are there?`, ans: CA.num(6 * CA.fact(n - 2)), sol: R`Bind A, B and C into one block: ${n - 2} things, \(${n - 2}!=${CA.fact(n - 2)}\) ways. Inside the block there are \(3!=6\) orders: \(${CA.fact(n - 2)}\times6=${6 * CA.fact(n - 2)}\).` };
                    if (type === 2) return { q: `${n} ${who} stand in a row. Two of them, A and B, must <strong>not</strong> stand next to each other. How many arrangements are there?`, ans: CA.num(CA.fact(n - 2) * (n - 1) * (n - 2)), sol: R`Arrange the other ${n - 2} first: \(${n - 2}!=${CA.fact(n - 2)}\). They make ${n - 1} gaps (including the two ends). Insert A and B into different gaps: \(${n - 1}\times${n - 2}=${(n - 1) * (n - 2)}\). Total \(${CA.fact(n - 2)}\times${(n - 1) * (n - 2)}=${CA.fact(n - 2) * (n - 1) * (n - 2)}\).` };
                    if (type === 3) {
                        const b = rng.int(3, 5), g = rng.int(2, Math.min(3, b));
                        const v = CA.fact(b) * CA.nPr(b + 1, g);
                        return { q: `${b} boys and ${g} girls stand in a row. No two girls may stand next to each other. How many arrangements are there?`, ans: CA.num(v), sol: R`Arrange the boys: \(${b}!=${CA.fact(b)}\). They make ${b + 1} gaps. Insert the ${g} girls into different gaps, in order: \(${Array.from({ length: g }, (_, i) => b + 1 - i).join('\\times')}=${CA.nPr(b + 1, g)}\). Total \(${CA.fact(b)}\times${CA.nPr(b + 1, g)}=${v}\).` };
                    }
                    if (type === 4) {
                        const [c1, c2] = rng.sample(['red', 'blue', 'green', 'white', 'yellow'], 2), x = rng.int(2, 6), y = rng.int(2, 5);
                        return { q: `${x} identical ${c1} beads and ${y} identical ${c2} beads are placed in a row. How many different rows can be made?`, ans: CA.num(CA.nCr(x + y, y)), sol: R`Only the positions matter. Choose which ${y} of the ${x + y} places get the ${c2} beads: \(\binom{${x + y}}{${y}}=${CA.nCr(x + y, y)}\).` };
                    }
                    const v = 2 * CA.fact(n - 3) * (n - 2) * (n - 3);
                    return { q: `${n} ${who} stand in a row. A and B must stand next to each other, but C and D must <strong>not</strong> stand next to each other. How many arrangements are there?`, ans: CA.num(v), sol: R`Bind first: A and B form a block (2 orders). Leave C and D out and arrange the block with the other ${n - 4}: \(${n - 3}!=${CA.fact(n - 3)}\) ways, making ${n - 2} gaps. Insert C and D into different gaps: \(${n - 2}\times${n - 3}=${(n - 2) * (n - 3)}\). Total \(2\times${CA.fact(n - 3)}\times${(n - 2) * (n - 3)}=${v}\).` };
                },
            },
            {
                id: 'rv-solid-combinations', name: 'L8 · Combining and reshaping round solids', level: 3,
                gen(rng) {
                    const type = rng.int(0, 4);
                    if (type === 0) {
                        const r2 = rng.int(1, 3), k = rng.int(1, 3), h2 = rng.pick([3, 6, 9]), j = rng.int(2, 6);
                        const r = k * r2, h = h2 / 3 * j, n = k * k * j;
                        return { q: `A solid metal cylinder with radius ${r} cm and height ${h} cm is melted down and cast into identical cones, each with radius ${r2} cm and height ${h2} cm. How many cones can be made?`, ans: CA.num(n, 'cones'), sol: R`Cylinder: \(\pi\times${r}^2\times${h}=${r * r * h}\pi\). One cone: \(\frac13\pi\times${r2}^2\times${h2}=${r2 * r2 * h2 / 3}\pi\). \(${r * r * h}\pi\div${r2 * r2 * h2 / 3}\pi=${n}\).` };
                    }
                    if (type === 1) {
                        for (;;) {
                            const rc = rng.int(2, 9), hc = rng.int(3, 12), Rc = rng.int(2, 9);
                            const [nn, dd] = CA.reduce(rc * rc * hc, 3 * Rc * Rc);
                            if (dd > 4 || nn / dd > 20 || rc === Rc) continue;
                            return { q: `A cone-shaped cup with radius ${rc} cm and height ${hc} cm is full of water. All the water is poured into an empty cylinder with radius ${Rc} cm. How deep is the water in the cylinder? (The cylinder is tall enough.)`, ans: CA.frac(nn, dd, 'cm', { mixed: true }), sol: R`Water: \(\frac13\pi\times${rc}^2\times${hc}=${T.pi(rc * rc * hc, 3)}\) cm³. In the cylinder \(\pi\times${Rc}^2\times d=${T.pi(rc * rc * hc, 3)}\), so \(d=${T.frac(rc * rc * hc, 3)}\div${Rc * Rc}=${T.mixed(nn, dd)}\) cm.` };
                        }
                    }
                    if (type === 2) {
                        const a = rng.int(2, 9), b = rng.int(2, 9), shape = rng.bool();
                        if (shape) return { q: `A rectangle with sides ${a} cm and ${b} cm is rotated one full turn about a side of length ${a} cm. Find the volume of the solid it sweeps out, in terms of π.`, ans: CA.pi(b * b * a, 1, 'cm³'), sol: R`The solid is a cylinder with height ${a} (the axis) and radius ${b}: \(\pi\times${b}^2\times${a}=${b * b * a}\pi\) cm³.` };
                        return { q: `A right triangle has legs of ${a} cm and ${b} cm. It is rotated one full turn about the leg of length ${a} cm. Find the volume of the solid it sweeps out, in terms of π.`, ans: CA.pi(b * b * a, 3, 'cm³'), sol: R`The solid is a cone with height ${a} (the axis) and radius ${b}: \(\frac13\pi\times${b}^2\times${a}=${T.pi(b * b * a, 3)}\) cm³.` };
                    }
                    if (type === 3) {
                        const r = rng.int(1, 5), R2 = r + rng.int(1, 5), h = rng.int(3, 12);
                        const orig = 2 * R2 * R2 + 2 * R2 * h, add = 2 * r * h, lost = 2 * r * r;
                        return { q: `A solid cylinder has radius ${R2} cm and height ${h} cm. A cylindrical hole of radius ${r} cm is drilled straight through it from top to bottom, along its axis. Find the surface area of the solid that is left, in terms of π.`, ans: CA.pi(orig + add - lost, 1, 'cm²'), sol: R`Original: \(2\pi\times${R2}^2+2\pi\times${R2}\times${h}=${orig}\pi\). Added (wall of the hole): \(2\pi\times${r}\times${h}=${add}\pi\). Lost (two small circles): \(2\pi\times${r}^2=${lost}\pi\). \(${orig}\pi+${add}\pi-${lost}\pi=${orig + add - lost}\pi\) cm².` };
                    }
                    const r = rng.int(2, 6), h1 = rng.int(2, 9), h2 = rng.int(2, 9);
                    const big = rng.int(r + 1, r + 5);
                    const total = (2 * big * big + 2 * big * h1) + (2 * r * r + 2 * r * h2) - 2 * r * r;
                    return { q: `A small cylinder (radius ${r} cm, height ${h2} cm) is glued, base down, onto the centre of the top of a large cylinder (radius ${big} cm, height ${h1} cm). Find the surface area of the combined solid in terms of π.`, ans: CA.pi(total, 1, 'cm²'), sol: R`Large cylinder: \(2\pi\times${big}^2+2\pi\times${big}\times${h1}=${2 * big * big + 2 * big * h1}\pi\). Small cylinder: \(2\pi\times${r}^2+2\pi\times${r}\times${h2}=${2 * r * r + 2 * r * h2}\pi\). Two circles of radius ${r} overlap and are lost: \(2\times${r * r}\pi=${2 * r * r}\pi\). Total \(${2 * big * big + 2 * big * h1}\pi+${2 * r * r + 2 * r * h2}\pi-${2 * r * r}\pi=${total}\pi\) cm².` };
                },
            },
            {
                id: 'rv-shortest-path', name: 'L11 · Shortest path on a surface', level: 3,
                gen(rng) {
                    let dims;
                    if (rng.bool(0.7)) {
                        const [p, q] = rng.pick([[3, 4], [5, 12], [6, 8], [8, 15], [9, 12], [12, 16]]);    // p = sum of the two shorter edges, q = longest
                        const a = rng.int(1, Math.min(p - 1, q)), b = p - a;
                        if (b > q) return this.gen(rng);
                        dims = [a, b, q];
                    } else dims = [rng.int(1, 6), rng.int(1, 6), rng.int(2, 9)];
                    const [l, w, h] = rng.shuffle(dims);
                    if (l < w) return this.gen(rng);
                    const cands = [[l + w, h], [l + h, w], [w + h, l]].map(([s, t]) => ({ s, t, d2: s * s + t * t }));
                    const best = Math.min(...cands.map(c => c.d2));
                    const critter = rng.pick(['An ant', 'A spider', 'A beetle', 'A ladybird']);
                    return {
                        q: `${critter} walks on the outside of a closed box from corner A to the opposite corner B. The box is ${l} cm long, ${w} cm wide and ${h} cm high. What is the length of the shortest path? Give your answer in simplest form.`,
                        fig: diagBox(l, w, h, false),
                        ans: CA.rootOf(best, 'cm'),
                        sol: R`Unfold two neighbouring faces into one rectangle; the path is its diagonal. Three ways: ${cands.map(c => m(`\\sqrt{${c.s}^2+${c.t}^2}=\\sqrt{${c.d2}}`)).join(', ')}. The shortest is \(\sqrt{${best}}` + (simp(best) === sq(best) ? R`\) cm.` : R`=${simp(best)}\) cm.`),
                    };
                },
            },
        ],

        assignment: [
            ['rv-negative-powers', 5], ['rv-sector', 5], ['rv-square-roots', 5],
            ['rv-three-views', 3], ['rv-shaded-shapes', 3], ['rv-efficiency', 3], ['rv-ratios', 3], ['rv-profit', 3], ['rv-cylinder-cone', 3], ['rv-radicals', 3], ['rv-space-diagonal', 2],
            ['rv-arranging', 4], ['rv-solid-combinations', 4], ['rv-shortest-path', 4],
        ],
    });
})();
