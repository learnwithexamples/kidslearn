/* Challenge Academy — Lesson 2: Circles & Sectors with Magic Shapes */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, T = CA.tex;
    const { FILL, SHADE, INK } = F.colors;
    const WHITE = '#ffffff';
    const n2 = x => Math.round(x * 100) / 100;

    /** a + b·π with π = 3.14, computed in whole hundredths so nothing drifts. b may be a fraction bn/bd. */
    const approx = (a, bn, bd = 1) => CA.round((a * 100 * bd + bn * 314) / (100 * bd), 2);
    const dec = x => T.num(x);
    const USE = R`Use \(\pi = 3.14\).`;
    const EXACT = R`Give your answer in terms of \(\pi\).`;

    // ── Figures ──────────────────────────────────────────────────────────
    function sectorFig(r, deg, opt = {}) {
        const P = 62, pad = 26, W = 2 * P + 2 * pad, cx = W / 2, cy = W / 2;
        // Crop to the part of the circle the sector uses.
        const top = deg > 90 ? cy - P : F.polar(cx, cy, P, deg)[1];
        const bottom = deg > 270 ? cy + P : deg > 180 ? Math.max(cy, F.polar(cx, cy, P, deg)[1]) : cy;
        const left = deg > 180 ? cx - P : Math.min(cx, F.polar(cx, cy, P, deg)[0]);
        const x0 = left - pad, y0 = top - 14, w = cx + P + pad - x0, h = bottom + 22 - y0;
        const mid = F.polar(cx, cy, deg > 200 ? 20 : 24, deg / 2);
        const body = F.sector(cx, cy, P, 0, deg, { fill: opt.fill || FILL }) +
            F.arc(cx, cy, 11, 0, deg, { width: 1 }) +
            F.text(mid[0], mid[1] + 4, `${deg}°`, { size: 11 }) +
            F.text(cx + P / 2, cy + 15, opt.rLabel || `${r} cm`, { size: 12 });
        return `<svg class="ca-fig" xmlns="http://www.w3.org/2000/svg" viewBox="${n2(x0)} ${n2(y0)} ${n2(w)} ${n2(h)}" width="${n2(w)}" height="${n2(h)}" role="img" aria-label="sector" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
    }
    function circleFig(label, isDiameter) {
        const P = 48, W = 2 * P + 16, c = W / 2;
        return F.svg(W, W, F.circle(c, c, P, { fill: FILL }) + F.dot(c, c) +
            (isDiameter ? F.line(c - P, c, c + P, c, { width: 1 }) + F.text(c, c - 6, label, { size: 12 })
                : F.line(c, c, c + P, c, { width: 1 }) + F.text(c + P / 2, c - 6, label, { size: 12 })), { label: 'circle' });
    }
    function ringFig(big, small, lb, ls) {
        const P = 60, p = P * small / big, W = 2 * P + 16, c = W / 2;
        return F.svg(W, W, F.circle(c, c, P, { fill: SHADE }) + F.circle(c, c, p, { fill: WHITE }) + F.dot(c, c) +
            F.line(c, c, c + p, c, { width: 1 }) + F.text(c + p / 2, c - 5, ls, { size: 11 }) +
            F.line(c, c, ...F.polar(c, c, P, 235), { width: 1 }) + F.text(c - P * 0.42 - 12, c + P * 0.5, lb, { size: 11 }), { label: 'ring' });
    }
    function squareCircleFig(s, four) {
        const S = 110, x = 8, y = 8;
        let b = F.rect(x, y, S, S, { fill: SHADE });
        if (four) for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) b += F.circle(x + S / 4 + i * S / 2, y + S / 4 + j * S / 2, S / 4, { fill: WHITE });
        else b += F.circle(x + S / 2, y + S / 2, S / 2, { fill: WHITE });
        b += F.text(x + S / 2, y + S + 16, `${s} cm`, { size: 12 });
        return F.svg(S + 16, S + 30, b, { label: 'circle in a square' });
    }
    function quarterFig(a, shadeOutside) {
        const S = 110, x = 8, y = 8;
        const q = `M${x} ${y + S}L${x + S} ${y + S}A${S} ${S} 0 0 0 ${x} ${y}Z`;
        const b = F.rect(x, y, S, S, { fill: shadeOutside ? SHADE : WHITE }) + F.path(q, { fill: shadeOutside ? WHITE : SHADE }) +
            F.text(x + S / 2, y + S + 16, `${a} cm`, { size: 12 });
        return F.svg(S + 16, S + 30, b, { label: 'quarter circle in a square' });
    }
    function leafFig(a, shadeLeaf = true) {
        const S = 110, x = 8, y = 8;
        const leaf = `M${x} ${y}A${S} ${S} 0 0 1 ${x + S} ${y + S}A${S} ${S} 0 0 1 ${x} ${y}Z`;
        const b = F.rect(x, y, S, S, { fill: shadeLeaf ? WHITE : SHADE }) + F.path(leaf, { fill: shadeLeaf ? SHADE : WHITE }) +
            F.text(x + S / 2, y + S + 16, `${a} cm`, { size: 12 });
        return F.svg(S + 16, S + 30, b, { label: 'leaf in a square' });
    }
    function semisFig(D, n) {
        const W = 200, x = 10, Rr = W / 2, y = 10 + Rr, r = Rr / n;
        let d = `M${x + W} ${y}A${Rr} ${Rr} 0 0 0 ${x} ${y}`;
        for (let i = 1; i <= n; i++) d += `A${n2(r)} ${n2(r)} 0 0 1 ${n2(x + 2 * r * i)} ${y}`;
        const b = F.path(d + 'Z', { fill: SHADE }) + F.line(x, y, x + W, y, { dash: true, width: 1 }) + F.text(x + W / 2, y + 16, `${D} cm`, { size: 12 });
        return F.svg(W + 20, Rr + 32, b, { label: 'semicircles on a diameter' });
    }
    function stadiumFig(l, w) {
        const s = Math.min(130 / l, 80 / w), L = l * s, Wd = w * s, r = Wd / 2, x = 8 + r, y = 8;
        const d = `M${n2(x)} ${y}L${n2(x + L)} ${y}A${n2(r)} ${n2(r)} 0 0 1 ${n2(x + L)} ${n2(y + Wd)}L${n2(x)} ${n2(y + Wd)}A${n2(r)} ${n2(r)} 0 0 1 ${n2(x)} ${y}Z`;
        const b = F.path(d, { fill: FILL }) + F.line(x, y, x, y + Wd, { dash: true, width: 1 }) + F.line(x + L, y, x + L, y + Wd, { dash: true, width: 1 }) +
            F.text(x + L / 2, y + Wd + 16, `${l} m`, { size: 12 }) + F.text(x + L / 2, y + Wd / 2 + 4, `${w} m`, { size: 12 }) +
            F.line(x + L / 2 - 22, y + 3, x + L / 2 - 22, y + Wd - 3, { width: 1 });
        return F.svg(L + Wd + 16, Wd + 30, b, { label: 'running track shape' });
    }
    function luneFig(a, b) {
        const s = 96 / Math.max(a, b), A = a * s, B = b * s;
        const x = 10 + A / 2, y = 10 + A;                       // C, the right angle
        const ax = x, ay = y - A, bx = x + B, by = y, c = Math.hypot(A, B) / 2;
        const body =
            F.path(`M${n2(ax)} ${n2(ay)}A${n2(A / 2)} ${n2(A / 2)} 0 0 0 ${n2(x)} ${n2(y)}Z`, { fill: SHADE }) +
            F.path(`M${n2(x)} ${n2(y)}A${n2(B / 2)} ${n2(B / 2)} 0 0 0 ${n2(bx)} ${n2(by)}Z`, { fill: SHADE }) +
            F.path(`M${n2(ax)} ${n2(ay)}A${n2(c)} ${n2(c)} 0 0 0 ${n2(bx)} ${n2(by)}Z`, { fill: WHITE }) +
            F.poly([[x, y], [bx, by], [ax, ay]], { fill: FILL }) + F.rightAngle(x, y, 1, 0, 0, -1, 7) +
            F.text(x + 12, y - A / 2 + 4, a, { size: 12, anchor: 'start' }) + F.text(x + B / 2, y - 6, b, { size: 12 });
        return F.svg(B + A / 2 + 24, A + B / 2 + 22, body, { label: 'lunes on a right triangle' });
    }
    function inscribedSquareFig(r) {
        const P = 58, W = 2 * P + 16, c = W / 2;
        const pts = [45, 135, 225, 315].map(d => F.polar(c, c, P, d));
        return F.svg(W, W, F.circle(c, c, P, { fill: SHADE }) + F.poly(pts, { fill: WHITE }) + F.dot(c, c) +
            F.line(c, c, c + P, c, { width: 1 }) + F.text(c + P / 2, c - 5, `${r}`, { size: 11 }), { label: 'square inside a circle' });
    }

    /** Rectangle 2a by a with a quarter circle of radius a at each bottom corner; the part above both is shaded. */
    function twoQuartersFig(a) {
        const S = 84, x = 30, y = 8;
        const shaded = `M${x} ${y}L${x + 2 * S} ${y}A${S} ${S} 0 0 0 ${x + S} ${y + S}A${S} ${S} 0 0 0 ${x} ${y}Z`;
        const b = F.rect(x, y, 2 * S, S, { fill: WHITE }) + F.path(shaded, { fill: SHADE }) +
            F.text(x + S, y + S + 16, `${2 * a} cm`, { size: 12 }) + F.text(x - 5, y + S / 2 + 4, `${a} cm`, { size: 12, anchor: 'end' });
        return F.svg(2 * S + 40, S + 30, b, { label: 'two quarter circles in a rectangle' });
    }
    /** A big circle with two touching white circles of radii p and q along its diameter (p + q = big radius). */
    function twoCirclesFig(p, q) {
        const P = 62, k = P / (p + q), c = P + 8;
        const b = F.circle(c, c, P, { fill: SHADE }) +
            F.circle(c - P + p * k, c, p * k, { fill: WHITE }) + F.circle(c + P - q * k, c, q * k, { fill: WHITE }) +
            F.dot(c - P + p * k, c, { r: 2 }) + F.dot(c + P - q * k, c, { r: 2 }) +
            F.line(c - P + p * k, c, c - P + 2 * p * k, c, { width: 1 }) + F.text(c - P + 1.5 * p * k, c - 5, p, { size: 11 }) +
            F.line(c + P - q * k, c, c + P, c, { width: 1 }) + F.text(c + P - q * k / 2, c - 5, q, { size: 11 });
        return F.svg(2 * P + 16, 2 * P + 16, b, { label: 'two circles inside a circle' });
    }
    /** Semicircle on AB (length d) and right triangle ABC with BC = h: region 1 is semicircle-only, region 2 triangle-only. */
    function semiTriFig(d, h, labelH) {
        const D = 150, r = D / 2, H = h * D / d, x0 = 22, top = Math.max(r, H), yb = 12 + top;
        const t = H / D, px = x0 + D / (1 + t * t), py = yb - t * D / (1 + t * t), cx = x0 + r;
        const A = [x0, yb], B = [x0 + D, yb], C = [x0 + D, yb - H];
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
            F.text(cx, yb + 16, `${d} cm`, { size: 12 }) + (labelH ? F.text(B[0] + 6, (B[1] + C[1]) / 2 + 4, labelH, { size: 12, anchor: 'start' }) : '');
        return F.svg(D + 80, yb + 22, b, { label: 'semicircle and right triangle' });
    }
    /** A circle of radius r overlapping a w by h rectangle: region 1 is circle-only, region 2 rectangle-only. */
    function overlapFig(r, w, h) {
        const P = 50, k = P / r, cx = 8 + P, cy = 8 + P, x = cx - 0.1 * P, y = cy - 0.2 * P, W = w * k, H = h * k;
        const id = `ca-ov-${r}-${w}-${h}`;
        const b = `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${P}"/></clipPath>` +
            F.circle(cx, cy, P, { fill: SHADE }) + F.rect(x, y, W, H, { fill: SHADE }) +
            `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(W)}" height="${n2(H)}" fill="${WHITE}" stroke="none" clip-path="url(#${id})"/>` +
            F.circle(cx, cy, P) + F.rect(x, y, W, H) + F.dot(cx, cy, { r: 2 }) +
            F.line(cx, cy, cx - P, cy, { width: 1 }) + F.text(cx - P / 2, cy - 5, r, { size: 11 }) +
            F.text(cx - 0.42 * P, cy - 0.5 * P, '①', { size: 12 }) + F.text(x + W - 12, y + H / 2 + 4, '②', { size: 12 }) +
            F.text(x + W / 2, y + H + 14, w, { size: 11 }) + F.text(x + W + 5, y + H / 2 + 4, h, { size: 11, anchor: 'start' });
        return F.svg(Math.max(2 * P + 16, x + W + 24), Math.max(2 * P + 16, y + H + 22), b, { label: 'circle overlapping a rectangle' });
    }

    const ANGLES = [30, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270];
    const frac360 = deg => T.frac(deg, 360);

    CA.register({
        id: 2,

        tutorial: [
            {
                h: 'Circle basics',
                html: R`
                <p>Every point on a circle is the same distance from the centre. That distance is the
                   <strong>radius</strong> \(r\). A <strong>diameter</strong> \(d\) goes right across through the
                   centre, so \(d = 2r\).</p>
                ${F.row(F.cap(circleFig('r', false), 'radius'), F.cap(circleFig('d', true), 'diameter'))}
                <p>Measure around any circle and divide by its diameter: you always get the same number,
                   \(\pi = 3.14159\ldots\) It never ends and never repeats.</p>
                <div class="ca-formula">\[ C = \pi d = 2\pi r \qquad\qquad A = \pi r^2 \]</div>
                <div class="ca-key"><strong>Exact answers.</strong> Unless a problem tells you to use
                   \(\pi = 3.14\), leave \(\pi\) as a letter: a circle of radius 5 has area \(25\pi\), not 78.5.
                   Exact answers are shorter, and they make patterns easy to see.</div>
                <div class="ca-warn"><strong>Radius or diameter?</strong> The commonest mistake in this lesson is
                   putting a diameter into \(\pi r^2\). Halve it first.</div>`,
            },
            {
                h: 'Arcs and sectors: a fraction of the circle',
                html: R`
                <p>A <strong>sector</strong> is a slice of pizza: two radii and the <strong>arc</strong> between
                   them. Its angle at the centre tells you what fraction of the whole circle it is.</p>
                ${F.row(sectorFig(6, 60), sectorFig(6, 135), sectorFig(6, 270))}
                <div class="ca-formula">\[ \text{arc} = \frac{\text{angle}}{360}\times 2\pi r \]\[ \text{sector area} = \frac{\text{angle}}{360}\times \pi r^2 \]</div>
                <p>For the \(60^\circ\) sector of radius 6: the fraction is \(\frac{60}{360}=\frac16\), so the arc is
                   \(\frac16\times12\pi=2\pi\) and the area is \(\frac16\times36\pi=6\pi\).</p>
                <div class="ca-tip"><strong>Perimeter of a sector</strong> is the arc <em>plus two radii</em>. Do not
                   forget the straight edges.</div>
                <table>
                    <tr><th>Angle</th><td>30°</td><td>45°</td><td>60°</td><td>90°</td><td>120°</td><td>180°</td><td>270°</td></tr>
                    <tr><th>Fraction</th><td>\(\frac1{12}\)</td><td>\(\frac18\)</td><td>\(\frac16\)</td><td>\(\frac14\)</td><td>\(\frac13\)</td><td>\(\frac12\)</td><td>\(\frac34\)</td></tr>
                </table>`,
            },
            {
                h: 'Areas of irregular shapes: total minus unshaded',
                html: R`
                <p>Most "magic shapes" are irregular: they are not in any formula book. You find their areas by
                   turning them into <strong>additions and subtractions of regular shapes</strong> — squares,
                   rectangles, triangles, circles and sectors.</p>
                <div class="ca-formula">\[ A_{\text{shaded region}} = A_{\text{total}} - A_{\text{unshaded region}} \]</div>
                ${F.row(F.cap(ringFig(5, 3, '5', '3'), 'Ring'), F.cap(squareCircleFig(8, false), 'Corners'), F.cap(quarterFig(8, true), 'Outside a quarter circle'))}
                <ul>
                    <li><strong>Ring:</strong> big circle − small circle \(=\pi\times5^2-\pi\times3^2=16\pi\).</li>
                    <li><strong>Corners:</strong> square − circle \(=8^2-\pi\times4^2=64-16\pi\).</li>
                    <li><strong>Outside a quarter circle:</strong> square − quarter circle \(=8^2-\frac14\pi\times8^2=64-16\pi\).</li>
                </ul>
                <div class="ca-key"><strong>Did you notice?</strong> The last two answers are the same. One circle of
                   radius 4 and a quarter of a circle of radius 8 have the same area — halving the radius divides the
                   area by 4.</div>
                <p>An answer like \(64-16\pi\) cannot be tidied up any more. If you are told to use
                   \(\pi=3.14\), it becomes \(64-50.24=13.76\).</p>`,
            },
            {
                h: 'Subtracting twice',
                html: R`
                <p>Often the unshaded part is made of <strong>two</strong> regular pieces. Then you subtract twice:
                   shaded = total − first piece − second piece.</p>
                ${F.row(F.cap(twoQuartersFig(4), 'Rectangle − quarter − quarter'), F.cap(twoCirclesFig(2, 3), 'Circle − circle − circle'))}
                <ul>
                    <li><strong>Left:</strong> an 8 by 4 rectangle with a quarter circle of radius 4 at each bottom
                        corner. Shaded \(=8\times4-\frac14\pi\times4^2-\frac14\pi\times4^2=32-8\pi\).</li>
                    <li><strong>Right:</strong> circles of radius 2 and 3 inside a circle of radius 5. Shaded
                        \(=25\pi-4\pi-9\pi=12\pi\).</li>
                </ul>
                <div class="ca-tip"><strong>Subtracting twice, in two rounds.</strong> Sometimes the first
                   subtraction gives a piece you then subtract again. In a square with a quarter circle,
                   square − quarter circle gives one curved corner. Take <em>two</em> of those corners away from the
                   square and you are left with the leaf of the next section.</div>`,
            },
            {
                h: 'Magic shape 1: the leaf',
                html: R`
                <p>Draw a square. Put the point of your compasses on one corner and draw a quarter circle through
                   the two neighbouring corners. Do the same from the opposite corner. The two arcs enclose a
                   <strong>leaf</strong>.</p>
                ${F.row(leafFig(10))}
                <p>Lay the two quarter circles on the square. Together they cover the whole square — but the leaf
                   gets covered <strong>twice</strong>. So:</p>
                <div class="ca-formula">\[ \text{leaf} = \text{quarter} + \text{quarter} - \text{square} = \frac{\pi a^2}{2} - a^2 \]</div>
                <p>With \(a=10\) and \(\pi=3.14\): \(157-100=57\). A leaf always takes up 57% of its square.</p>
                <p><strong>Or subtract twice.</strong> One curved corner is square − quarter circle
                   \(=100-78.5=21.5\). The leaf is the square without its two corners:
                   \(100-21.5-21.5=57\). Same answer.</p>
                <div class="ca-tip"><strong>The overlap idea.</strong> Whenever two shapes overlap inside a region
                   they exactly fill: overlap = (first) + (second) − (region). It works for any shapes.</div>`,
            },
            {
                h: 'Magic shape 2: semicircles along a diameter',
                html: R`
                <p>Draw a big semicircle. Along its diameter draw several small semicircles, end to end. What is the
                   perimeter of the shaded shape?</p>
                ${F.row(semisFig(12, 2), semisFig(12, 3))}
                <p>An arc of a semicircle is \(\frac12\pi d\). The small diameters add up to the big diameter, so the
                   small arcs add up to \(\frac12\pi\times(\text{their diameters added})=\frac12\pi D\) — exactly the
                   same length as the big arc!</p>
                <div class="ca-formula">\[ \text{perimeter} = \tfrac12\pi D + \tfrac12\pi D = \pi D \]</div>
                <p>It does not matter how many small semicircles there are, or whether they are equal. For
                   \(D=12\) the perimeter is \(12\pi\) every time.</p>
                <div class="ca-warn"><strong>Area is different.</strong> Lengths add up like this; areas do not.
                   Two semicircles of diameter 6 have total area \(2\times\frac12\pi\times3^2=9\pi\), only half of the
                   big semicircle's \(\frac12\pi\times 6^2=18\pi\).</div>`,
            },
            {
                h: 'Magic shape 3: the moons on a right triangle',
                html: R`
                <p>Take a right triangle. Draw a semicircle on each of the two short sides, pointing outwards, and a
                   semicircle on the longest side, folded back over the triangle. Two crescent
                   <strong>moons</strong> (lunes) are left.</p>
                ${F.row(luneFig(3, 4))}
                <p>Moons = (two small semicircles + triangle) − big semicircle. Using diameters \(a\), \(b\), \(c\):</p>
                <div class="ca-formula">\[ \frac{\pi a^2}{8}+\frac{\pi b^2}{8}+\frac{ab}{2}-\frac{\pi c^2}{8} = \frac{\pi}{8}\left(a^2+b^2-c^2\right)+\frac{ab}{2} = \frac{ab}{2} \]</div>
                <p>because \(a^2+b^2=c^2\) in a right triangle. All the \(\pi\) disappears:
                   <strong>the two moons together have exactly the area of the triangle.</strong> For the 3-4-5
                   triangle that is 6. The Greek mathematician Hippocrates found this about 2400 years ago.</p>`,
            },
            {
                h: 'The area difference between two shapes',
                html: R`
                <p>Sometimes you cannot find either shaded area — but you can still find how much bigger one is
                   than the other.</p>
                ${F.row(semiTriFig(8, 5, '5 cm'))}
                <p>A semicircle is drawn on \(AB = 8\) cm, and \(ABC\) is a right triangle with \(BC = 5\) cm. Region
                   ① is inside the semicircle only; region ② is inside the triangle only. Neither is a regular
                   shape. How much larger is ① than ②?</p>
                <div class="ca-key"><strong>The difference stays the same when both get the same increase</strong>
                   (or the same decrease). Add the white part that the semicircle and the triangle share to
                   <em>both</em> regions:
                   <ul>
                       <li>① + white = the whole semicircle,</li>
                       <li>② + white = the whole triangle.</li>
                   </ul>
                   So ① − ② = semicircle − triangle: a difference of irregular shapes has become a difference of
                   regular shapes.</div>
                <p>Semicircle: \(\frac12\pi\times4^2=8\pi\approx25.12\). Triangle: \(\frac12\times8\times5=20\). So
                   ① is \(25.12-20=5.12\) cm² larger than ②.</p>
                <div class="ca-tip"><strong>Equal areas?</strong> If a problem says ① and ② have equal areas, then
                   the two regular shapes have equal areas too. Here that would need
                   \(\frac12\times8\times BC=25.12\), so \(BC=6.28\) cm.</div>`,
            },
            {
                h: 'A plan for any magic shape',
                html: R`
                <ol>
                    <li><strong>Find the radii.</strong> Mark every centre and write down every radius. Halve any
                        diameters.</li>
                    <li><strong>Name the pieces.</strong> Describe the shaded part with shapes you know: "square minus
                        quarter circle", "two quarters minus square", "big semicircle minus two small ones".</li>
                    <li><strong>Asked for a difference?</strong> Add the shared blank part to both regions and compare
                        two regular shapes instead.</li>
                    <li><strong>Keep π as a letter</strong> until the very end. Collect the π terms together.</li>
                    <li><strong>Check the size.</strong> A shaded part inside a 10 by 10 square cannot have area 150.</li>
                </ol>
                <div class="ca-tip"><strong>Move it!</strong> Sometimes a shaded piece can be slid or turned to fill
                   a gap, making a simple shape. Look for equal pieces before you calculate.</div>`,
            },
        ],

        summary: [
            { topic: 'Circles and sectors', points: [
                R`\(C = \pi d = 2\pi r\) and \(A = \pi r^2\). Halve a diameter before you use it.`,
                R`A sector is \(\frac{\text{angle}}{360}\) of its circle: use that fraction for the arc and for the area.`,
            ] },
            { topic: 'Find areas of irregular shapes', points: [
                R`\(A_{\text{shaded region}} = A_{\text{total}} - A_{\text{unshaded region}}\)`,
                'Convert an irregular shape into additions or subtractions of regular shapes.',
                'Some shaded regions need you to subtract twice.',
            ] },
            { topic: 'Find the area difference between two shapes', points: [
                'A difference between two areas stays the same when both get the same increase (or decrease).',
                'So convert a difference between irregular shapes into a difference between regular shapes.',
            ] },
        ],

        examples: [
            {
                title: 'Arc and sector',
                q: R`A sector has radius 9 cm and angle \(120^\circ\). Find its arc length, its area and its perimeter. Give exact answers.`,
                fig: F.row(sectorFig(9, 120)),
                steps: [
                    R`Fraction of the circle: \(\frac{120}{360}=\frac13\).`,
                    R`Arc: \(\frac13\times2\pi\times9=6\pi\) cm.`,
                    R`Area: \(\frac13\times\pi\times9^2=27\pi\) cm².`,
                    R`Perimeter: the arc and two radii, \(6\pi+18\) cm.`,
                ],
                answer: R`arc \(6\pi\) cm, area \(27\pi\) cm², perimeter \(6\pi+18\) cm`,
            },
            {
                title: 'Working backwards',
                q: R`The circumference of a circle is \(14\pi\) cm. What is its area?`,
                steps: [
                    R`\(2\pi r=14\pi\), so \(r=7\).`,
                    R`Area \(=\pi\times7^2=49\pi\).`,
                ],
                answer: R`\(49\pi\) cm²`,
            },
            {
                title: 'A path around a pond',
                q: R`A circular pond of radius 6 m is surrounded by a path 2 m wide. Find the area of the path in terms of \(\pi\).`,
                fig: F.row(ringFig(8, 6, '8', '6')),
                steps: [
                    R`The outer edge of the path is a circle of radius \(6+2=8\) m.`,
                    R`Path = big circle − pond \(=\pi\times8^2-\pi\times6^2\).`,
                    R`\(=64\pi-36\pi=28\pi\).`,
                ],
                answer: R`\(28\pi\) m²`,
            },
            {
                title: 'The leaf',
                q: R`Two quarter circles are drawn inside a square of side 6 cm, centred at opposite corners. Find the area of the leaf where they overlap. Use \(\pi=3.14\).`,
                fig: F.row(leafFig(6)),
                steps: [
                    R`Each quarter circle has radius 6: area \(\frac14\times3.14\times36=28.26\).`,
                    R`The two quarters cover the square, with the leaf counted twice: leaf \(=28.26+28.26-36\).`,
                    R`\(=56.52-36=20.52\).`,
                ],
                answer: R`20.52 cm²`,
            },
            {
                title: 'Subtracting twice',
                q: R`A rectangle is 12 cm long and 6 cm wide. A quarter circle of radius 6 cm is drawn at each bottom corner. Find the shaded area. Use \(\pi=3.14\).`,
                fig: F.row(twoQuartersFig(6)),
                steps: [
                    R`Total: the rectangle, \(12\times6=72\).`,
                    R`Unshaded: two quarter circles of radius 6, each \(\frac14\times3.14\times36=28.26\).`,
                    R`Subtract twice: \(72-28.26-28.26=15.48\).`,
                ],
                answer: R`15.48 cm²`,
            },
            {
                title: 'An area difference',
                q: R`A semicircle is drawn on \(AB=12\) cm, and \(ABC\) is a right triangle with \(BC=8\) cm. How much larger is the area of region ① than the area of region ②? Use \(\pi=3.14\).`,
                fig: F.row(semiTriFig(12, 8, '8 cm')),
                steps: [
                    R`Neither region is a regular shape. Add the white part shared by the semicircle and the triangle to both — the difference does not change.`,
                    R`① + white is the semicircle: \(\frac12\times3.14\times6^2=56.52\).`,
                    R`② + white is the triangle: \(\frac12\times12\times8=48\).`,
                    R`Difference: \(56.52-48=8.52\).`,
                ],
                answer: R`8.52 cm²`,
            },
            {
                title: 'Semicircles on a diameter',
                q: R`A semicircle has diameter 20 cm. Four equal semicircles are drawn along its diameter. Find the perimeter and the area of the shaded shape in terms of \(\pi\).`,
                fig: F.row(semisFig(20, 4)),
                steps: [
                    R`Big arc: \(\frac12\times\pi\times20=10\pi\).`,
                    R`Each small semicircle has diameter 5, so the four small arcs total \(4\times\frac12\times\pi\times5=10\pi\). Perimeter \(=20\pi\).`,
                    R`Big semicircle area: \(\frac12\pi\times10^2=50\pi\).`,
                    R`Small ones have radius \(\frac52\): \(4\times\frac12\pi\times\frac{25}{4}=\frac{25}{2}\pi\). Shaded \(=50\pi-\frac{25}{2}\pi=\frac{75}{2}\pi\).`,
                ],
                answer: R`perimeter \(20\pi\) cm, area \(\frac{75}{2}\pi\) cm²`,
            },
            {
                title: 'The moons',
                q: R`A right triangle has legs 6 cm and 8 cm. Semicircles are drawn on all three sides as shown. Find the total area of the two shaded moons.`,
                fig: F.row(luneFig(6, 8)),
                steps: [
                    R`The hypotenuse is 10. Moons = small semicircles + triangle − big semicircle.`,
                    R`Small semicircles: \(\frac12\pi\times3^2+\frac12\pi\times4^2=\frac{25}{2}\pi\). Big: \(\frac12\pi\times5^2=\frac{25}{2}\pi\). They cancel.`,
                    R`What is left is the triangle: \(\frac12\times6\times8=24\).`,
                ],
                answer: R`24 cm²`,
            },
        ],

        practice: [
            {
                id: 'circumference', name: 'Circumference', level: 1,
                gen(rng) {
                    const r = rng.int(2, 15), useD = rng.bool();
                    const thing = rng.pick(['circle', 'circular plate', 'round table top', 'coin', 'circular pond', 'bicycle wheel']);
                    return {
                        q: `A ${thing} has ${useD ? `diameter ${2 * r}` : `radius ${r}`} cm. Find its circumference. ${EXACT}`,
                        ans: CA.pi(2 * r, 1, 'cm'),
                        sol: useD ? R`\(C=\pi d=${2 * r}\pi\).` : R`\(C=2\pi r=2\times\pi\times${r}=${2 * r}\pi\).`,
                    };
                },
            },
            {
                id: 'area', name: 'Area of a circle', level: 1,
                gen(rng) {
                    const r = rng.int(2, 13), useD = rng.bool();
                    const thing = rng.pick(['circle', 'circular rug', 'round pizza', 'circular flower bed', 'round mirror', 'circular lid']);
                    return {
                        q: `A ${thing} has ${useD ? `diameter ${2 * r}` : `radius ${r}`} cm. Find its area. ${EXACT}`,
                        ans: CA.pi(r * r, 1, 'cm²'),
                        sol: (useD ? R`The radius is \(${2 * r}\div2=${r}\). ` : '') + R`\(A=\pi r^2=\pi\times${r}^2=${r * r}\pi\).`,
                    };
                },
            },
            {
                id: 'arc-length', name: 'Arc length', level: 1,
                gen(rng) {
                    const r = rng.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18]), deg = rng.pick(ANGLES);
                    return {
                        q: R`A sector has radius ${r} cm and angle \(${deg}^\circ\). Find the length of its arc. ${EXACT}`,
                        fig: F.row(sectorFig(r, deg)),
                        ans: CA.pi(deg * r, 180, 'cm'),
                        sol: R`The arc is \(${frac360(deg)}\) of the circumference: \(${frac360(deg)}\times2\pi\times${r}=${T.pi(deg * r, 180)}\).`,
                    };
                },
            },
            {
                id: 'sector-area', name: 'Sector area', level: 1,
                gen(rng) {
                    const r = rng.pick([2, 3, 4, 6, 8, 9, 10, 12]), deg = rng.pick(ANGLES);
                    return {
                        q: R`A sector has radius ${r} cm and angle \(${deg}^\circ\). Find its area. ${EXACT}`,
                        fig: F.row(sectorFig(r, deg)),
                        ans: CA.pi(deg * r * r, 360, 'cm²'),
                        sol: R`The sector is \(${frac360(deg)}\) of the circle: \(${frac360(deg)}\times\pi\times${r}^2=${T.pi(deg * r * r, 360)}\).`,
                    };
                },
            },
            {
                id: 'wheel', name: 'Rolling wheels', level: 1,
                gen(rng) {
                    const d = rng.pick([20, 30, 40, 50, 60, 70, 80]), turns = rng.pick([5, 10, 20, 25, 50, 100]);
                    if (rng.bool()) {
                        return {
                            q: R`A wheel has diameter ${d} cm. How far does it roll in ${turns} full turns? ${EXACT}`,
                            ans: CA.pi(d * turns, 1, 'cm'),
                            sol: R`One turn rolls one circumference, \(${d}\pi\) cm. \(${turns}\times${d}\pi=${d * turns}\pi\).`,
                        };
                    }
                    return {
                        q: R`A wheel has diameter ${d} cm. It rolls \(${d * turns}\pi\) cm along a straight road. How many full turns does it make?`,
                        ans: CA.num(turns, 'turns'),
                        sol: R`One turn rolls \(${d}\pi\) cm. \(${d * turns}\pi\div${d}\pi=${turns}\).`,
                    };
                },
            },
            {
                id: 'sector-perimeter', name: 'Perimeter of a sector', level: 2,
                gen(rng) {
                    let r, deg;
                    do { r = rng.pick([3, 4, 6, 8, 9, 10, 12, 18, 20]); deg = rng.pick(ANGLES); } while ((deg * r) % 180 !== 0);
                    const k = deg * r / 180, p = approx(2 * r, k);
                    return {
                        q: R`A sector has radius ${r} cm and angle \(${deg}^\circ\). Find its perimeter. ${USE}`,
                        fig: F.row(sectorFig(r, deg)),
                        ans: CA.num(p, 'cm'),
                        sol: R`Arc \(=${frac360(deg)}\times2\pi\times${r}=${T.pi(k)}\approx${dec(approx(0, k))}\). Add the two radii: \(${dec(approx(0, k))}+${2 * r}=${dec(p)}\).`,
                    };
                },
            },
            {
                id: 'ring', name: 'Rings', level: 2,
                gen(rng) {
                    const small = rng.int(2, 9), w = rng.int(1, 4), big = small + w;
                    const area = big * big - small * small;
                    if (rng.bool()) {
                        return {
                            q: R`Two circles share the same centre. Their radii are ${big} cm and ${small} cm. Find the area of the ring between them. ${EXACT}`,
                            fig: F.row(ringFig(big, small, `${big}`, `${small}`)),
                            ans: CA.pi(area, 1, 'cm²'),
                            sol: R`\(\pi\times${big}^2-\pi\times${small}^2=${big * big}\pi-${small * small}\pi=${area}\pi\).`,
                        };
                    }
                    const thing = rng.pick(['pond', 'fountain', 'lawn', 'flower bed']);
                    return {
                        q: R`A circular ${thing} of radius ${small} m is surrounded by a path ${w} m wide. Find the area of the path. ${EXACT}`,
                        fig: F.row(ringFig(big, small, `${big}`, `${small}`)),
                        ans: CA.pi(area, 1, 'm²'),
                        sol: R`The outer radius is \(${small}+${w}=${big}\). \(\pi\times${big}^2-\pi\times${small}^2=${area}\pi\).`,
                    };
                },
            },
            {
                id: 'reverse', name: 'Working backwards', level: 2,
                gen(rng) {
                    const r = rng.int(3, 14);
                    const kind = rng.int(0, 3);
                    if (kind === 0) return {
                        q: R`The circumference of a circle is \(${2 * r}\pi\) cm. Find its area. ${EXACT}`,
                        ans: CA.pi(r * r, 1, 'cm²'),
                        sol: R`\(2\pi r=${2 * r}\pi\) gives \(r=${r}\). Area \(=\pi\times${r}^2=${r * r}\pi\).`,
                    };
                    if (kind === 1) return {
                        q: R`The area of a circle is \(${r * r}\pi\) cm². Find its circumference. ${EXACT}`,
                        ans: CA.pi(2 * r, 1, 'cm'),
                        sol: R`\(r^2=${r * r}\) gives \(r=${r}\). \(C=2\pi\times${r}=${2 * r}\pi\).`,
                    };
                    if (kind === 2) return {
                        q: R`The area of a circle is \(${r * r}\pi\) cm². What is its diameter?`,
                        ans: CA.num(2 * r, 'cm'),
                        sol: R`\(r^2=${r * r}\) gives \(r=${r}\), so \(d=${2 * r}\).`,
                    };
                    let rr, deg;
                    do { rr = rng.pick([3, 4, 6, 8, 9, 10, 12, 15, 18]); deg = rng.pick([30, 45, 60, 90, 120, 135, 150, 240, 270]); } while ((deg * rr) % 180 !== 0);
                    const k = deg * rr / 180;
                    return {
                        q: R`An arc of a circle has length \(${T.pi(k)}\) cm and is the arc of a sector with angle \(${deg}^\circ\). What is the radius of the circle?`,
                        ans: CA.num(rr, 'cm'),
                        sol: R`The arc is \(${frac360(deg)}\) of the circumference, so the circumference is \(${T.pi(k)}\div${frac360(deg)}=${T.pi(2 * rr)}\), and \(r=${rr}\).`,
                    };
                },
            },
            {
                id: 'sector-angle', name: 'Find the angle', level: 2,
                gen(rng) {
                    const r = rng.pick([2, 3, 4, 6, 8, 9, 10, 12]), deg = rng.pick([30, 45, 60, 72, 90, 120, 135, 150, 240, 270]);
                    return {
                        q: R`A sector of a circle of radius ${r} cm has area \(${T.pi(deg * r * r, 360)}\) cm². What is the angle of the sector?`,
                        ans: CA.num(deg, '°'),
                        sol: R`The whole circle has area \(${r * r}\pi\). The sector is \(${T.pi(deg * r * r, 360)}\div${r * r}\pi=${frac360(deg)}\) of it, and \(${frac360(deg)}\times360^\circ=${deg}^\circ\).`,
                    };
                },
            },
            {
                id: 'square-circle', name: 'Circles in a square', level: 2,
                gen(rng) {
                    const four = rng.bool(0.4);
                    const s = four ? rng.pick([4, 8, 12, 16, 20, 24]) : rng.pick([2, 4, 6, 8, 10, 12, 14, 16, 20]);
                    const val = approx(s * s, -s * s, 4);
                    return {
                        q: (four ? `Four equal circles fit exactly inside a square of side ${s} cm, as shown.` : `A circle fits exactly inside a square of side ${s} cm.`) + ` Find the shaded area. ${USE}`,
                        fig: F.row(squareCircleFig(s, four)),
                        ans: CA.num(val, 'cm²'),
                        sol: four ? R`Each circle has radius \(${s}\div4=${s / 4}\). Shaded \(=${s}^2-4\times\pi\times${s / 4}^2=${s * s}-${T.pi(s * s, 4)}=${dec(val)}\).`
                            : R`The radius is \(${s / 2}\). Shaded \(=${s}^2-\pi\times${s / 2}^2=${s * s}-${T.pi(s * s, 4)}=${dec(val)}\).`,
                    };
                },
            },
            {
                id: 'quarter', name: 'Quarter circle in a square', level: 2,
                gen(rng) {
                    const a = rng.pick([2, 4, 6, 8, 10, 12, 16, 20]);
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const val = approx(a * a, -a * a, 4);
                        return {
                            q: `A quarter circle is drawn inside a square of side ${a} cm, centred at one corner. Find the shaded area. ${USE}`,
                            fig: F.row(quarterFig(a, true)),
                            ans: CA.num(val, 'cm²'),
                            sol: R`Square − quarter circle \(=${a}^2-\frac14\times\pi\times${a}^2=${a * a}-${T.pi(a * a, 4)}=${dec(val)}\).`,
                        };
                    }
                    if (kind === 1) {
                        const val = approx(2 * a, a, 2);
                        return {
                            q: `The shaded quarter circle is drawn inside a square of side ${a} cm, centred at one corner. Find the <strong>perimeter</strong> of the shaded quarter circle. ${USE}`,
                            fig: F.row(quarterFig(a, false)),
                            ans: CA.num(val, 'cm'),
                            sol: R`Arc \(=\frac14\times2\pi\times${a}=${T.pi(a, 2)}\approx${dec(approx(0, a, 2))}\). Add two radii: \(${dec(approx(0, a, 2))}+${2 * a}=${dec(val)}\).`,
                        };
                    }
                    return {
                        q: `The shaded quarter circle is drawn inside a square of side ${a} cm, centred at one corner. Find the area of the shaded quarter circle. ${EXACT}`,
                        fig: F.row(quarterFig(a, false)),
                        ans: CA.pi(a * a, 4, 'cm²'),
                        sol: R`\(\frac14\times\pi\times${a}^2=${T.pi(a * a, 4)}\).`,
                    };
                },
            },
            {
                id: 'semicircles', name: 'Semicircles on a diameter', level: 2,
                gen(rng) {
                    const n = rng.pick([2, 3, 4]);
                    const D = n * rng.pick([2, 4, 6, 8, 10]);
                    const lead = `A semicircle has diameter ${D} cm. ${['', '', 'Two', 'Three', 'Four'][n]} equal semicircles are drawn along its diameter, as shown.`;
                    if (rng.bool(0.6)) {
                        return {
                            q: `${lead} Find the <strong>perimeter</strong> of the shaded shape. ${EXACT}`,
                            fig: F.row(semisFig(D, n)),
                            ans: CA.pi(D, 1, 'cm'),
                            sol: R`Big arc \(=\frac12\pi\times${D}=${T.pi(D, 2)}\). Small arcs: \(${n}\times\frac12\pi\times${D / n}=${T.pi(D, 2)}\) — the same. Total \(${D}\pi\).`,
                        };
                    }
                    return {
                        q: `${lead} Find the <strong>area</strong> of the shaded shape. ${EXACT}`,
                        fig: F.row(semisFig(D, n)),
                        ans: CA.pi(D * D * (n - 1), 8 * n, 'cm²'),
                        sol: R`Big semicircle: \(\frac12\pi\times${T.frac(D, 2)}^2=${T.pi(D * D, 8)}\). Small ones (radius \(${T.frac(D, 2 * n)}\)): \(${n}\times\frac12\pi\times${T.frac(D * D, 4 * n * n)}=${T.pi(D * D, 8 * n)}\). Difference \(${T.pi(D * D * (n - 1), 8 * n)}\).`,
                    };
                },
            },
            {
                id: 'subtract-twice', name: 'Subtracting twice', level: 2,
                gen(rng) {
                    if (rng.bool()) {
                        const a = rng.pick([2, 4, 6, 8, 10, 12, 20]);
                        const val = approx(2 * a * a, -a * a, 2);
                        return {
                            q: `A rectangle is ${2 * a} cm long and ${a} cm wide. A quarter circle of radius ${a} cm is drawn at each bottom corner, as shown. Find the shaded area. ${USE}`,
                            fig: F.row(twoQuartersFig(a)),
                            ans: CA.num(val, 'cm²'),
                            sol: R`Rectangle \(${2 * a}\times${a}=${2 * a * a}\). Each quarter circle is \(\frac14\pi\times${a}^2=${T.pi(a * a, 4)}\approx${dec(approx(0, a * a, 4))}\). Subtract twice: \(${2 * a * a}-${dec(approx(0, a * a, 4))}-${dec(approx(0, a * a, 4))}=${dec(val)}\).`,
                        };
                    }
                    let p, q;
                    do { p = rng.int(1, 6); q = rng.int(1, 6); } while (p === q && rng.bool(0.7));
                    const big = p + q;
                    return {
                        q: `Two circles of radius ${p} cm and ${q} cm touch each other and fit inside a large circle along its diameter, as shown. Find the shaded area. ${EXACT}`,
                        fig: F.row(twoCirclesFig(p, q)),
                        ans: CA.pi(2 * p * q, 1, 'cm²'),
                        sol: R`The large circle has diameter \(${2 * p}+${2 * q}=${2 * big}\), so radius ${big}. Subtract twice: \(${big * big}\pi-${p * p}\pi-${q * q}\pi=${2 * p * q}\pi\).`,
                    };
                },
            },
            {
                id: 'overlap-difference', name: 'Overlapping shapes: the difference', level: 2,
                gen(rng) {
                    const r = rng.pick([5, 6, 8, 10]);
                    const w = rng.int(Math.ceil(1.4 * r), 2 * r), h = rng.int(Math.ceil(0.8 * r), Math.floor(1.2 * r));
                    const val = approx(-w * h, r * r);
                    return {
                        q: `A circle of radius ${r} cm overlaps a rectangle ${w} cm long and ${h} cm wide, as shown. Region ① is the part of the circle outside the rectangle; region ② is the part of the rectangle outside the circle. How much larger is the area of ① than the area of ②? ${USE}`,
                        fig: F.row(overlapFig(r, w, h)),
                        ans: CA.num(val, 'cm²'),
                        sol: R`Add the white overlap to both regions; the difference stays the same. ① − ② = circle − rectangle \(=\pi\times${r}^2-${w}\times${h}=${dec(approx(0, r * r))}-${w * h}=${dec(val)}\).`,
                    };
                },
            },
            {
                id: 'area-difference', name: 'Area difference: semicircle and triangle', level: 3,
                gen(rng) {
                    const d = rng.pick([4, 8, 12, 16, 20]);
                    if (rng.bool(0.35)) {
                        const bc = approx(0, d, 4);
                        return {
                            q: R`A semicircle is drawn on \(AB=${d}\) cm, and \(ABC\) is a right triangle with its right angle at \(B\). Regions ① and ② have <strong>equal areas</strong>. Find the length of \(BC\). ${USE}`,
                            fig: F.row(semiTriFig(d, bc, '?')),
                            ans: CA.num(bc, 'cm'),
                            sol: R`Add the white part to both regions: the semicircle and the triangle have equal areas. Semicircle \(=\frac12\pi\times${d / 2}^2=${T.pi(d * d, 8)}\approx${dec(approx(0, d * d, 8))}\). So \(\frac12\times${d}\times BC=${dec(approx(0, d * d, 8))}\), and \(BC=${dec(bc)}\).`,
                        };
                    }
                    const h = rng.int(Math.ceil(0.4 * d), Math.floor(0.7 * d));
                    const val = approx(-d * h / 2, d * d, 8);
                    return {
                        q: R`A semicircle is drawn on \(AB=${d}\) cm, and \(ABC\) is a right triangle with \(BC=${h}\) cm, as shown. How much larger is the area of region ① than the area of region ②? ${USE}`,
                        fig: F.row(semiTriFig(d, h, `${h} cm`)),
                        ans: CA.num(val, 'cm²'),
                        sol: R`Add the white part to both regions. ① − ② = semicircle − triangle \(=\frac12\pi\times${d / 2}^2-\frac12\times${d}\times${h}=${dec(approx(0, d * d, 8))}-${d * h / 2}=${dec(val)}\).`,
                    };
                },
            },
            {
                id: 'leaf', name: 'The leaf', level: 3,
                gen(rng) {
                    const a = rng.pick([2, 4, 6, 8, 10, 12, 20]);
                    const leaf = approx(-a * a, a * a, 2);
                    if (rng.bool(0.6)) {
                        return {
                            q: `Two quarter circles are drawn inside a square of side ${a} cm, centred at opposite corners. Find the area of the shaded leaf. ${USE}`,
                            fig: F.row(leafFig(a, true)),
                            ans: CA.num(leaf, 'cm²'),
                            sol: R`Two quarter circles cover the square with the leaf counted twice: leaf \(=2\times\frac14\pi\times${a}^2-${a}^2=${T.pi(a * a, 2)}-${a * a}=${dec(leaf)}\).`,
                        };
                    }
                    const rest = CA.round(a * a - leaf, 2);
                    return {
                        q: `Two quarter circles are drawn inside a square of side ${a} cm, centred at opposite corners. Find the total shaded area <strong>outside</strong> the leaf. ${USE}`,
                        fig: F.row(leafFig(a, false)),
                        ans: CA.num(rest, 'cm²'),
                        sol: R`Leaf \(=2\times\frac14\pi\times${a}^2-${a}^2=${dec(leaf)}\). Shaded \(=${a * a}-${dec(leaf)}=${dec(rest)}\). (Or: two lots of "square − quarter circle".)`,
                    };
                },
            },
            {
                id: 'stadium', name: 'Running-track shapes', level: 3,
                gen(rng) {
                    const w = rng.pick([10, 20, 30, 40, 60]), l = w + rng.pick([10, 20, 30, 50, 60]);
                    if (rng.bool()) {
                        const p = approx(2 * l, w);
                        return {
                            q: `A sports field is a rectangle ${l} m long and ${w} m wide with a semicircle on each short end. Find the distance once around the field. ${USE}`,
                            fig: F.row(stadiumFig(l, w)),
                            ans: CA.num(p, 'm'),
                            sol: R`Two straights and two semicircles that make one circle of diameter ${w}: \(2\times${l}+\pi\times${w}=${2 * l}+${dec(approx(0, w))}=${dec(p)}\).`,
                        };
                    }
                    const area = approx(l * w, w * w, 4);
                    return {
                        q: `A sports field is a rectangle ${l} m long and ${w} m wide with a semicircle on each short end. Find the area of the field. ${USE}`,
                        fig: F.row(stadiumFig(l, w)),
                        ans: CA.num(area, 'm²'),
                        sol: R`Rectangle plus one whole circle of radius ${w / 2}: \(${l}\times${w}+\pi\times${w / 2}^2=${l * w}+${dec(approx(0, w * w, 4))}=${dec(area)}\).`,
                    };
                },
            },
            {
                id: 'lunes', name: 'The moons', level: 3,
                gen(rng) {
                    const [a, b, c] = rng.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [10, 24, 26], [15, 20, 25], [12, 5, 13], [8, 6, 10], [4, 3, 5], [20, 21, 29]]);
                    return {
                        q: `A right triangle has legs ${a} cm and ${b} cm. A semicircle is drawn outwards on each leg, and a semicircle on the hypotenuse is folded back over the triangle, as shown. Find the total area of the two shaded moons.`,
                        fig: F.row(luneFig(a, b)),
                        ans: CA.num(a * b / 2, 'cm²'),
                        sol: R`Moons = two small semicircles + triangle − big semicircle. Since \(${a}^2+${b}^2=${c}^2\), the semicircle areas cancel, leaving the triangle: \(\frac12\times${a}\times${b}=${T.num(a * b / 2)}\).`,
                    };
                },
            },
            {
                id: 'inscribed-square', name: 'Square inside a circle', level: 3,
                gen(rng) {
                    const r = rng.pick([2, 3, 4, 5, 6, 8, 10, 20]);
                    if (rng.bool(0.4)) {
                        return {
                            q: `A square is drawn inside a circle of radius ${r} cm with all four corners on the circle. What is the area of the square?`,
                            fig: F.row(inscribedSquareFig(r)),
                            ans: CA.num(2 * r * r, 'cm²'),
                            sol: R`The diagonals of the square are diameters, ${2 * r} cm each, and cross at right angles. Area \(=\frac12\times${2 * r}\times${2 * r}=${2 * r * r}\).`,
                        };
                    }
                    const val = approx(-2 * r * r, r * r);
                    return {
                        q: `A square is drawn inside a circle of radius ${r} cm with all four corners on the circle. Find the shaded area. ${USE}`,
                        fig: F.row(inscribedSquareFig(r)),
                        ans: CA.num(val, 'cm²'),
                        sol: R`The square's diagonals are diameters: its area is \(\frac12\times${2 * r}\times${2 * r}=${2 * r * r}\). Shaded \(=\pi\times${r}^2-${2 * r * r}=${dec(approx(0, r * r))}-${2 * r * r}=${dec(val)}\).`,
                    };
                },
            },
        ],

        assignment: [
            ['circumference', 2], ['area', 2], ['arc-length', 3], ['sector-area', 3], ['wheel', 2],
            ['sector-perimeter', 2], ['ring', 3], ['reverse', 3], ['sector-angle', 2], ['square-circle', 3], ['quarter', 3], ['semicircles', 2],
            ['subtract-twice', 4], ['overlap-difference', 2],
            ['area-difference', 4], ['leaf', 3], ['stadium', 2], ['lunes', 3], ['inscribed-square', 2],
        ],
    });
})();
