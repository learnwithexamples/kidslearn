/* Challenge Academy — Lesson 11: Pythagorean Theorem in Solid Figures */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, troot = CA.tex.root, tnum = CA.tex.num;
    const { FILL, ACCENT, INK } = F.colors;
    const PALE = '#f5f7ff', SIDE = '#c3cffa', WATER = '#dbeafe';
    const q2 = x => Math.round(x * 100) / 100;

    // ── Maths helpers ────────────────────────────────────────────────────
    /** TeX for √n in simplest form. */
    const rt = n => { const [c, r] = CA.simplifyRoot(n); return troot(c, r); };
    /** "√56 = 2√14", or just "√14" / "√49 = 7" when there is nothing more to say. */
    const rtEq = n => { const [c, r] = CA.simplifyRoot(n); return c === 1 ? R`\sqrt{${n}}` : R`\sqrt{${n}}=${troot(c, r)}`; };
    /** Answer √n: a plain number when n is a perfect square, otherwise two boxes. */
    const rootAns = (n, unit = '') => (CA.isSquare(n) ? CA.num(Math.sqrt(n), unit) : CA.rootOf(n, unit));
    const sum2 = (...xs) => xs.map(x => `${x}^2`).join('+');
    const sqs = (...xs) => xs.map(x => x * x).join('+');
    const T = CA.tex;

    // Pythagorean triples (legs a < b) and "quadruples" a² + b² + c² = d², found by search, never typed.
    const TRIPLES = [];
    for (let a = 3; a <= 24; a++) for (let b = a + 1; b <= 40; b++) if (CA.isSquare(a * a + b * b)) TRIPLES.push([a, b, Math.sqrt(a * a + b * b)]);
    const SMALL = TRIPLES.filter(t => t[2] <= 26 && t[1] <= 3 * t[0]);          // comfortable to draw
    const QUADS = [];
    for (let a = 1; a <= 16; a++) for (let b = a; b <= 20; b++) for (let c = b; c <= 24; c++) {
        const d = Math.sqrt(a * a + b * b + c * c);
        if (Number.isInteger(d) && c <= 6 * a && d <= 30) QUADS.push([a, b, c, d]);
    }
    /**
     * Boxes p ≤ q ≤ c whose shortest surface route between opposite vertices is a whole number:
     * (p + q)² + c² is a perfect square.
     */
    const ROUTES = [];
    for (let c = 2; c <= 20; c++) for (let p = 1; p <= c; p++) for (let q = p; q <= c; q++) {
        if (p === c || c > 6 * p) continue;
        const s = (p + q) ** 2 + c * c;
        if (CA.isSquare(s)) ROUTES.push([p, q, c, Math.sqrt(s)]);
    }
    /** The three unfoldings of an l × w × h box between opposite vertices (squared lengths). */
    const unfoldings = (a, b, c) => [[a, b, c], [a, c, b], [b, c, a]].map(([x, y, z]) => ({ x, y, z, s: (x + y) ** 2 + z * z }));

    // ── Figure helpers ───────────────────────────────────────────────────
    const HOT = { stroke: ACCENT, width: 2 }, HID = { stroke: ACCENT, width: 1.3, dash: '5 3' }, THIN = { width: 1, dash: true };
    /**
     * A box with extra lines and points.  Points are [along the length, towards the back, up].
     * o.segs = [[P, Q, style]], o.dots = [[P, name, dx, dy]], o.polys = [[[P, Q, …], style]].
     */
    function boxFig(l, w, h, o = {}) {
        return F.box(l, w, h, {
            labels: o.labels || [`${l}`, `${w}`, `${h}`], max: o.max || 135,
            extra: g => {
                const P = ([u, t, v]) => [g.x + u * g.s + t * g.s * 0.5, g.y - v * g.s - t * g.s * 0.36];
                let b = '';
                for (const [pts, st] of o.polys || []) b += F.poly(pts.map(P), st);
                for (const [p, q, st] of o.segs || []) { const [x1, y1] = P(p), [x2, y2] = P(q); b += F.line(x1, y1, x2, y2, st || HOT); }
                for (const [p, name, dx = 0, dy = 0] of o.dots || []) { const [x1, y1] = P(p); b += F.dot(x1, y1, { fill: ACCENT, r: 3 }) + (name ? F.text(x1 + dx, y1 + dy, name, { bold: true }) : ''); }
                return b;
            },
        });
    }
    /** The box with its space diagonal AB and the floor diagonal under it. */
    const diagBox = (l, w, h, labels) => boxFig(l, w, h, {
        labels, segs: [[[0, 0, 0], [l, w, 0], THIN], [[l, w, 0], [l, w, h], { stroke: INK, width: 1.5 }], [[0, 0, 0], [l, w, h], HOT]],
        dots: [[[0, 0, 0], 'A', -9, 5], [[l, w, h], 'B', 10, 5]],
    });
    /** The book's picture: the diagonal cross-section through two opposite vertical edges, with its two diagonals. */
    const sectionBox = (l, w, h, labels, max) => boxFig(l, w, h, {
        labels, max,
        polys: [[[[0, 0, 0], [l, w, 0], [l, w, h], [0, 0, h]], { fill: '#9fb4f5', opacity: 0.45, stroke: 'none' }]],
        segs: [[[0, 0, 0], [l, w, 0], THIN], [[0, 0, 0], [l, w, h], HOT], [[l, w, 0], [0, 0, h], HOT]],
    });
    /** A box with A at the front bottom left corner and B at the opposite (back top right) vertex. */
    const abBox = (l, w, h, segs = [], labels) => boxFig(l, w, h, { segs, labels, dots: [[[0, 0, 0], 'A', -9, 5], [[l, w, h], 'B', 10, 5]] });
    const faceSeg = (l, w, h) => ({ front: [[0, 0, 0], [l, 0, h]], top: [[0, 0, h], [l, w, h]], right: [[l, 0, 0], [l, w, h]] });

    /**
     * A vertical segment of height v standing on the ground, and a straight line from its top down to the
     * ground d away (broken bamboo, a rope from a flagpole, a ladder against a wall).  lab = {v, d, h}.
     */
    function groundTri(v, d, lab = {}, o = {}) {
        const s = Math.min(130 / v, 170 / d), V = v * s, Dd = d * s;
        const x0 = o.wall ? 50 : 40, y0 = 12 + V;
        let b = F.line(x0 - 18, y0, x0 + Dd + 18, y0, { width: 1.2 });
        if (o.wall) b += F.rect(x0 - 9, y0 - V - 8, 9, V + 8, { fill: SIDE, width: 1 });
        b += F.line(x0, y0, x0, y0 - V, { width: o.wall ? 1.5 : 3 });
        b += F.line(x0, y0 - V, x0 + Dd, y0, { stroke: ACCENT, width: 2.4 });
        b += F.rightAngle(x0, y0, 1, 0, 0, -1, 8);
        if (lab.v != null) b += F.text(x0 - (o.wall ? 13 : 7), y0 - V / 2 + 4, lab.v, { anchor: 'end' });
        if (lab.d != null) b += F.text(x0 + Dd / 2, y0 + 16, lab.d);
        if (lab.h != null) b += F.text(x0 + Dd / 2 + 7, y0 - V / 2 - 3, lab.h, { anchor: 'start', fill: ACCENT, bold: true });
        const W = Math.max(x0 + Dd + 24, x0 + Dd / 2 + 14 + 7.5 * String(lab.h || '').length);
        return F.svg(W, y0 + 22, b, { label: o.label || 'right triangle' });
    }
    /** A reed in a pond: depth x, sticking out a above the water; pushed over, its tip reaches the surface d away. */
    function pondFig(x, a, d, lab = {}) {
        const s = Math.min(130 / (x + a), 160 / d), X = x * s, A = a * s, Dd = d * s;
        const x0 = 46, ys = 10 + A, yb = ys + X;
        let b = F.rect(x0 - 26, ys, Dd + 52, X, { fill: WATER, stroke: 'none' });
        b += F.line(x0 - 26, ys, x0 + Dd + 26, ys, { stroke: '#4a90d9', width: 1.3 }) + F.line(x0 - 26, yb, x0 + Dd + 26, yb, { width: 1.3 });
        b += F.line(x0, yb, x0, ys - A, { dash: '5 3', width: 1.6 });
        b += F.line(x0, yb, x0 + Dd, ys, { stroke: ACCENT, width: 2.4 });
        b += F.rightAngle(x0, ys, 0, 1, 1, 0, 7) + F.dot(x0 + Dd, ys, { fill: ACCENT, r: 3 });
        if (lab.v != null) b += F.text(x0 - 6, ys + X / 2 + 4, lab.v, { anchor: 'end' });
        if (lab.a != null) b += F.text(x0 - 6, ys - A / 2 + 4, lab.a, { anchor: 'end' });
        if (lab.d != null) b += F.text(x0 + Dd / 2, ys - 5, lab.d);
        if (lab.h != null) b += F.text(x0 + Dd / 2 + 8, ys + X / 2 + 12, lab.h, { anchor: 'start', fill: ACCENT, bold: true });
        return F.svg(x0 + Dd + 30 + (lab.h ? 26 : 0), yb + 8, b, { label: 'reed in a pond' });
    }
    /** Rectangle ABCD (AB = h upright, BC = w) folded along AE so that D lands on F on BC.  BF = f, DE = x. */
    function foldCornerFig(h, w, f, x, lab = {}) {
        const s = Math.min(180 / w, 120 / h), x0 = 30, y0 = 24 + h * s;
        const P = (u, v) => [x0 + u * s, y0 - v * s];
        const A = P(0, h), B = P(0, 0), C = P(w, 0), D = P(w, h), E = P(w, h - x), Fp = P(f, 0);
        let b = F.poly([A, B, C, E], { fill: FILL }) + F.poly([A, Fp, E], { fill: SIDE });
        b += F.poly([A, D, E], { open: true, dash: '5 3', width: 1.1 });
        const t = (p, s2, dx, dy) => F.text(p[0] + dx, p[1] + dy, s2, { bold: true });
        b += t(A, 'A', -9, -4) + t(B, 'B', -9, 13) + t(C, 'C', 9, 13) + t(D, 'D', 9, -4) + t(E, 'E', 11, 5) + t(Fp, 'F', 0, 15);
        if (lab.h != null) b += F.text(x0 - 8, (A[1] + B[1]) / 2 + 4, lab.h, { anchor: 'end' });
        if (lab.w != null) b += F.text((A[0] + D[0]) / 2, A[1] - 7, lab.w);
        return F.svg(C[0] + 28, y0 + 22, b, { label: 'folded rectangle' });
    }
    /** Rectangle ABCD (AD = L along the top, AB = W) folded along the diagonal BD; C lands at C′ and BC′ meets AD at E. */
    function foldDiagFig(L, W, x, lab = {}) {
        const t = L * L / (L * L + W * W), Cx = 2 * t * L - L, Cy = 2 * t * W;
        const s = Math.min(190 / L, 115 / Math.max(W, Cy)), x0 = 34, y0 = 24 + Math.max(W, Cy) * s;
        const P = (u, v) => [x0 + u * s, y0 - v * s];
        const A = P(0, W), B = P(0, 0), C = P(L, 0), D = P(L, W), C1 = P(Cx, Cy), E = P(L - x, W);
        let b = F.poly([A, B, D], { fill: FILL }) + F.poly([B, C, D], { open: true, dash: '5 3', width: 1.1 }) + F.poly([B, C1, D], { fill: SIDE, opacity: 0.9 }) + F.poly([B, C1, D]);
        b += F.line(A[0], A[1], D[0], D[1]) + F.dot(E[0], E[1], { fill: ACCENT, r: 3 });
        const tx = (p, s2, dx, dy) => F.text(p[0] + dx, p[1] + dy, s2, { bold: true });
        b += tx(A, 'A', -9, -3) + tx(B, 'B', -9, 13) + tx(C, 'C', 9, 13) + tx(D, 'D', 10, 4) + tx(C1, 'C′', 0, -6) + tx(E, 'E', -10, -5);
        if (lab.W != null) b += F.text(x0 - 9, (A[1] + B[1]) / 2 + 4, lab.W, { anchor: 'end' });
        if (lab.L != null) b += F.text((B[0] + C[0]) / 2, B[1] + 16, lab.L);
        return F.svg(C[0] + 28, y0 + 22, b, { label: 'rectangle folded along a diagonal' });
    }
    /** A ladder c long, foot b from the wall, top h up; then the top slides down p and the foot out p (dashed). */
    function ladderFig(b, h, p, lab = {}) {
        const s = Math.min(130 / h, 170 / (b + p)), x0 = 40, y0 = 14 + h * s;
        let g = F.line(x0 - 12, y0, x0 + (b + p) * s + 20, y0, { width: 1.2 }) + F.rect(x0 - 9, y0 - h * s - 10, 9, h * s + 10, { fill: SIDE, width: 1 });
        g += F.line(x0 + b * s, y0, x0, y0 - h * s, { stroke: INK, width: 2.4 });
        g += F.line(x0 + (b + p) * s, y0, x0, y0 - (h - p) * s, { stroke: ACCENT, width: 2, dash: '6 3' });
        g += F.rightAngle(x0, y0, 1, 0, 0, -1, 8);
        if (lab.c != null) g += F.text(x0 + b * s / 2 + 7, y0 - h * s / 2 - 5, lab.c, { anchor: 'start', bold: true });
        if (lab.b != null) g += F.text(x0 + b * s / 2, y0 + 16, lab.b);
        return F.svg(x0 + (b + p) * s + 26, y0 + 22, g, { label: 'sliding ladder' });
    }
    /** Two poles p and q tall, D apart, and the point P on the ground x from the first. */
    function polesFig(p, q, D, x, lab = {}) {
        const s = Math.min(120 / Math.max(p, q), 220 / D), x0 = 34, y0 = 14 + Math.max(p, q) * s, X1 = x0 + D * s, Px = x0 + x * s;
        let g = F.line(x0 - 14, y0, X1 + 14, y0, { width: 1.2 });
        g += F.line(x0, y0, x0, y0 - p * s, { width: 3 }) + F.line(X1, y0, X1, y0 - q * s, { width: 3 });
        g += F.line(x0, y0 - p * s, Px, y0, HOT) + F.line(X1, y0 - q * s, Px, y0, HOT) + F.dot(Px, y0, { fill: ACCENT, r: 3 });
        g += F.text(x0 - 6, y0 - p * s / 2 + 4, lab.p, { anchor: 'end' }) + F.text(X1 + 6, y0 - q * s / 2 + 4, lab.q, { anchor: 'start' });
        g += F.text(Px, y0 - 6, 'P', { bold: true }) + F.text((x0 + Px) / 2, y0 + 16, lab.x) + F.text((Px + X1) / 2, y0 + 16, lab.y);
        return F.svg(X1 + 40, y0 + 22, g, { label: 'two poles' });
    }

    /** A square pyramid, base edge a, height h, with the slant height drawn. lab {a, h, s, half}. */
    function pyrFig(a, h, lab = {}) {
        const s = Math.min(150 / (1.5 * a), 120 / (h + 0.36 * a));
        const x0 = 28, up = Math.max(h * s + a * s * 0.18, a * s * 0.36), y0 = 12 + up;
        const P = (u, t, v) => [x0 + u * s + t * s * 0.5, y0 - v * s - t * s * 0.36];
        const A = P(0, 0, 0), B = P(a, 0, 0), C = P(a, a, 0), D = P(0, a, 0), Tp = P(a / 2, a / 2, h), O = P(a / 2, a / 2, 0), M = P(a / 2, 0, 0);
        const ln = (p, q, st) => F.line(p[0], p[1], q[0], q[1], st);
        let b = ln(A, D, THIN) + ln(D, C, THIN) + ln(D, Tp, THIN);
        b += F.poly([B, C, Tp], { fill: SIDE }) + F.poly([A, B, Tp], { fill: FILL, opacity: 0.85 }) + F.poly([A, B, Tp]);
        b += ln(Tp, O, THIN) + ln(O, M, THIN) + ln(Tp, M, { stroke: ACCENT, width: 1.6 }) + F.rightAngle(O[0], O[1], 0, -1, M[0] - O[0], M[1] - O[1], 6);
        if (lab.a != null) b += F.text((A[0] + B[0]) / 2, A[1] + 16, lab.a);
        if (lab.h != null) b += F.text(O[0] + 5, (Tp[1] + O[1]) / 2 + 4, lab.h, { anchor: 'start', size: 12 });
        if (lab.s != null) b += F.text((Tp[0] + M[0]) / 2 - 6, (Tp[1] + M[1]) / 2 + 2, lab.s, { anchor: 'end', size: 12, fill: ACCENT, bold: true });
        if (lab.half != null) b += F.text((O[0] + M[0]) / 2 + 9, (O[1] + M[1]) / 2 + 9, lab.half, { size: 11 });
        return F.svg(C[0] + 44, A[1] + 22, b, { label: 'square pyramid' });
    }

    /** A flat rectangle made of strips (bottom to top) with a straight path corner to corner: an unfolded box or unrolled cylinder. */
    function flatFig(wd, parts, lab = {}) {
        const tot = parts.reduce((x, y) => x + y, 0), s = Math.min(150 / wd, 120 / tot);
        const x = 22, y = 12 + tot * s, W = wd * s;
        let b = F.rect(x, y - tot * s, W, tot * s, { fill: FILL }), acc = 0;
        parts.forEach((p, i) => {
            if (i) b += F.line(x, y - acc * s, x + W, y - acc * s, THIN);
            if (lab.parts) b += F.text(x + W + 6, y - (acc + p / 2) * s + 4, lab.parts[i], { anchor: 'start' });
            acc += p;
        });
        b += F.line(x, y, x + W, y - tot * s, HOT) + F.dot(x, y, { fill: ACCENT, r: 3 }) + F.dot(x + W, y - tot * s, { fill: ACCENT, r: 3 });
        b += F.text(x - 9, y + 5, 'A', { bold: true }) + F.text(x + W + 10, y - tot * s + 3, 'B', { bold: true });
        if (lab.w != null) b += F.text(x + W / 2, y + 16, lab.w);
        return F.svg(x + W + (lab.parts ? 70 : 24), y + 22, b, { label: 'unfolded surface' });
    }

    /** A cylinder with a path winding from A (bottom) up to B (top). turns = 0.5 for half-way round. */
    function cylAnt(C, h, turns, lab = {}) {
        const r = C / (2 * Math.PI), s = Math.min(96 / (2 * r), 125 / h);
        const rx = r * s, ry = rx * 0.28, Ht = h * s, cx = 30 + rx, top = 22 + ry, bot = top + Ht;
        let b = F.path(`M${q2(cx - rx)} ${q2(top)}L${q2(cx - rx)} ${q2(bot)}A${q2(rx)} ${q2(ry)} 0 0 0 ${q2(cx + rx)} ${q2(bot)}L${q2(cx + rx)} ${q2(top)}Z`, { fill: FILL });
        b += F.path(`M${q2(cx - rx)} ${q2(bot)}A${q2(rx)} ${q2(ry)} 0 0 1 ${q2(cx + rx)} ${q2(bot)}`, THIN) + F.ellipse(cx, top, rx, ry, { fill: PALE });
        const N = Math.round(120 * turns), pt = i => { const th = 2 * Math.PI * turns * i / N; return [cx + rx * Math.sin(th), bot - Ht * i / N + ry * Math.cos(th), Math.cos(th) >= -1e-9]; };
        let run = [pt(0)];
        const flush = () => { if (run.length > 1) b += F.poly(run, { open: true, ...(run[1][2] ? HOT : HID) }); };
        for (let i = 1; i <= N; i++) {
            const p = pt(i);
            if (p[2] !== run[run.length - 1][2] && run.length > 1) { run.push(p); flush(); run = [p]; } else run.push(p);
        }
        flush();
        const a = pt(0), e = pt(N);
        b += F.dot(a[0], a[1], { fill: ACCENT, r: 3 }) + F.dot(e[0], e[1], { fill: ACCENT, r: 3 });
        b += F.text(a[0] - 9, a[1] + 13, 'A', { bold: true }) + F.text(e[0] + (turns === 0.5 ? 0 : 10), e[1] + (turns === 0.5 ? -6 : -5), 'B', { bold: true });
        if (lab.h != null) b += F.text(cx + rx + 7, (top + bot) / 2 + 4, lab.h, { anchor: 'start' });
        return F.svg(cx + rx + 40, bot + ry + 20, b, { label: 'path round a cylinder' });
    }

    const cm = 'cm';

    CA.register({
        id: 11,

        tutorial: [
            {
                h: 'Using the Pythagorean Theorem to set up an equation',
                html: R`
                <p>In a right triangle with legs \(a\), \(b\) and hypotenuse \(c\),</p>
                <div class="ca-formula">\[ a^2 + b^2 = c^2 \]</div>
                <p>Usually two sides are known and you find the third. But sometimes <strong>two sides are unknown</strong> —
                   all you know is how they are related, such as “the hypotenuse and one leg add up to 9”.</p>
                <div class="ca-key"><strong>The method.</strong> Use \(x\) to represent one unknown, write the other unknown
                   in terms of \(x\), and set up an equation with the Pythagorean Theorem. Then solve it.</div>
                ${F.row(F.rightTriangle(3, 4, { a: '3', b: 'x', c: '9 − x' }, { max: 110 }))}
                <p>Here the legs are \(3\) and \(x\), and the hypotenuse is \(9 - x\). The hypotenuse is the longest side, so
                   it goes on its own:</p>
                <div class="ca-formula">\[ (9-x)^2 - x^2 = 3^2 \]</div>
                <p>The left side is a <strong>difference of squares</strong>, \(p^2 - q^2 = (p+q)(p-q)\), and the \(x^2\) terms vanish:</p>
                <div class="ca-formula">\[ (9-x+x)(9-x-x) = 9 \;\Rightarrow\; 9(9-2x) = 9 \]
                   \[ 81 - 18x = 9 \;\Rightarrow\; x = 4 \]</div>
                <p>So the sides are 3, 4 and 5. (Expanding works too: \(81 - 18x + x^2 - x^2 = 9\).)</p>
                <div class="ca-tip"><strong>Why does it come out so neatly?</strong> Whenever the unknown leg and the hypotenuse
                   are written as \(x\) and \(x + k\) (or \(x\) and \(S - x\)), the \(x^2\) cancels and you are left with an
                   ordinary one-step equation. Always check your answer in \(a^2+b^2=c^2\).</div>
                <div class="ca-warn"><strong>Which side is the hypotenuse?</strong> It is the side opposite the right angle and
                   the longest side. Put it alone on one side of the equation: \(c^2 = a^2 + b^2\), or \(c^2 - b^2 = a^2\).</div>`,
            },
            {
                h: 'Setting up equations: classic problems',
                html: R`
                <p>These old puzzles (some are 2000 years old, from the Chinese <em>Nine Chapters</em>) all hide a right triangle
                   in which two sides are unknown but related. Name the unknown \(x\), label every side, then use Pythagoras.</p>
                ${F.row(F.cap(groundTri(3, 4, { v: 'x', d: '4', h: '8 − x' }), 'Broken bamboo'), F.cap(pondFig(12, 1, 5, { v: 'x', a: '1', d: '5', h: 'x + 1' }), 'Reed in a pond'))}
                <ul>
                    <li><strong>Broken bamboo.</strong> A bamboo 8 m tall snaps; the top stays attached and touches the ground
                        4 m from the foot. If it snapped \(x\) m up, the broken part is \(8 - x\):
                        \(x^2 + 4^2 = (8-x)^2\), so \(16 = 64 - 16x\) and \(x = 3\) m.</li>
                    <li><strong>Reed in a pond.</strong> A reed sticks out 1 ft above the water. Pushed sideways, its tip reaches
                        the surface 5 ft away. If the pond is \(x\) deep, the reed is \(x + 1\):
                        \(x^2 + 5^2 = (x+1)^2\), so \(25 = 2x + 1\) and \(x = 12\) ft.</li>
                    <li><strong>Rope on a flagpole.</strong> A rope from the top of a pole is 1 m longer than the pole. Pulled
                        tight, it reaches the ground 5 m from the foot: the same equation, pole \(= 12\) m.</li>
                </ul>
                ${F.row(F.cap(foldCornerFig(8, 10, 6, 5, { h: '8', w: '10' }), 'Fold D onto BC'))}
                <p><strong>Folding.</strong> Rectangle \(ABCD\) has \(AB = 8\) and \(BC = 10\). Fold along \(AE\) so that \(D\)
                   lands at \(F\) on \(BC\). Folding does not change lengths: \(AF = AD = 10\), so \(BF = \sqrt{10^2-8^2} = 6\)
                   and \(FC = 4\). Let \(DE = EF = x\); then \(EC = 8 - x\), and in triangle \(ECF\):
                   \(x^2 = (8-x)^2 + 4^2\), so \(16x = 80\) and \(x = 5\).</p>
                <div class="ca-tip"><strong>Folding = equal lengths.</strong> The folded part lands exactly on a copy of
                   itself, so every folded segment equals the one it came from. That gives you the “\(x\) and \(8-x\)”.</div>`,
            },
            {
                h: 'Space diagonals of a rectangular prism',
                html: R`
                <p>A rectangular prism (a box) has two kinds of diagonal. A <strong>face diagonal</strong> crosses one rectangular
                   face. A <strong>space diagonal</strong> goes through the inside, from one vertex to the opposite vertex — it
                   is the longest straight line that fits in the box.</p>
                ${F.row(F.cap(sectionBox(8, 5, 4, ['l', 'w', 'h'], 160), 'The two space diagonals of the shaded section'), boxFig(8, 5, 4, { labels: ['l', 'w', 'h'], max: 150, segs: [[[0, 0, 0], [8, 5, 0], THIN], [[0, 0, 0], [8, 5, 4], HOT], [[8, 5, 0], [8, 5, 4], { stroke: INK, width: 1.5 }]], dots: [[[0, 0, 0], 'A', -9, 5], [[8, 5, 4], 'B', 10, 5], [[8, 5, 0], 'C', 10, 8]] }))}
                <p>The shaded rectangle stands upright inside the box: its bottom is the floor diagonal \(AC\) and its side is a
                   vertical edge \(h\). Use Pythagoras <strong>twice</strong>:</p>
                <ul>
                    <li>On the floor, \(AC\) is the diagonal of an \(l\) by \(w\) rectangle: \(AC^2=l^2+w^2\).</li>
                    <li>Triangle \(ACB\) has its right angle at \(C\): \(AB^2=AC^2+h^2=l^2+w^2+h^2\).</li>
                </ul>
                <div class="ca-formula">\[ \text{length of a space diagonal} = \sqrt{l^2+w^2+h^2} \]</div>
                <p>For a 2 by 3 by 6 box, \(\sqrt{4+9+36}=\sqrt{49}=7\). Boxes where the diagonal is a whole number are worth
                   recognising:</p>
                <table>
                    <tr><th>Edges</th><td>1, 2, 2</td><td>2, 3, 6</td><td>1, 4, 8</td><td>4, 4, 7</td><td>2, 6, 9</td><td>3, 4, 12</td></tr>
                    <tr><th>Space diagonal</th><td>${[[1, 2, 2], [2, 3, 6], [1, 4, 8], [4, 4, 7], [2, 6, 9], [3, 4, 12]].map(e => Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2)).join('</td><td>')}</td></tr>
                </table>
                <div class="ca-key"><strong>A cube with edge \(a\).</strong> Face diagonal \(=\sqrt{a^2+a^2}=a\sqrt2\).
                   Space diagonal \(=\sqrt{a^2+a^2+a^2}=a\sqrt3\).</div>
                <div class="ca-warn"><strong>Do not add the edges first.</strong> \(\sqrt{l^2+w^2+h^2}\) is not
                   \(l+w+h\). Square each edge, add, <em>then</em> take the root.</div>`,
            },
            {
                h: 'The shortest route on the surface between two opposite vertices',
                html: R`
                <p>An ant at vertex \(A\) of a box wants to reach the opposite vertex \(B\). It cannot go through the box, so it
                   walks over two faces. On a <em>flat</em> sheet the shortest route is a straight line — so we unfold.</p>
                <div class="ca-key"><strong>Step ①</strong> Unfold the two faces that include the two vertices.<br>
                   <strong>Step ②</strong> Connect the two vertices on the unfolded net with a straight line.<br>
                   <strong>Step ③</strong> Use the Pythagorean Theorem to find the length of the route.<br>
                   <strong>Step ④</strong> Compare the different ways of unfolding to find the shortest route.</div>
                ${F.row(abBox(5, 3, 4, [[[0, 0, 0], [5 * 4 / 7, 0, 4], HOT], [[5 * 4 / 7, 0, 4], [5, 3, 4], HOT]]), F.cap(flatFig(5, [4, 3], { w: '5', parts: ['4 (front)', '3 (top)'] }), 'Front and top faces unfolded'))}
                <p>For a 5 by 3 by 4 box, the front and top faces unfold into one rectangle 5 wide and \(4+3=7\) tall, so this
                   route is \(\sqrt{5^2+7^2}=\sqrt{74}\). There are <strong>three</strong> different unfoldings; each puts two
                   edges end to end:</p>
                <table>
                    <tr><th>Edges added</th><th>Legs</th><th>Route</th></tr>
                    ${unfoldings(3, 4, 5).map(u => `<tr><td>\\(${u.x}+${u.y}\\)</td><td>\\(${u.x + u.y}\\) and \\(${u.z}\\)</td><td>\\(\\sqrt{${(u.x + u.y) ** 2}+${u.z * u.z}}=\\sqrt{${u.s}}\\)</td></tr>`).join('')}
                </table>
                <div class="ca-formula"><strong>Rule.</strong> Use the <strong>longest edge</strong> and the <strong>sum of the
                   other two edges</strong> as the legs of a right triangle. The hypotenuse is the shortest route:
                   \[ \text{edges } a \le b \le c: \qquad \text{shortest route} = \sqrt{(a+b)^2 + c^2} \]</div>
                <p><strong>Why?</strong> Compare putting \(a+b\) against \(c\) with putting \(a+c\) against \(b\):
                   \((a+b)^2+c^2 - \big((a+c)^2+b^2\big) = 2ab - 2ac = 2a(b-c) \le 0\), because \(b \le c\). The same works for
                   \(b+c\) against \(a\).</p>
                <div class="ca-warn"><strong>Walking is not flying.</strong> The space diagonal \(\sqrt{9+16+25}=\sqrt{50}\) goes
                   <em>through</em> the box. A route on the surface is always longer.</div>`,
            },
            {
                h: 'Going further: cones and square pyramids',
                html: R`
                <p>Slice a cone straight down through its apex. Half of the slice is a right triangle: the legs are the
                   <strong>radius</strong> \(r\) and the <strong>height</strong> \(h\), and the hypotenuse is the
                   <strong>slant height</strong> \(s\).</p>
                ${F.row(F.cone(5, 12, { labels: { r: 'r', h: 'h', l: 's' }, max: 120 }), pyrFig(10, 12, { a: 'a', h: 'h', s: 's', half: 'a/2' }))}
                <div class="ca-formula">\[ \text{cone: } r^2 + h^2 = s^2 \qquad\qquad \text{square pyramid: } h^2 + \left(\tfrac a2\right)^2 = s^2 \]</div>
                <p>A square pyramid has its apex straight above the centre of its base. The height, half a base edge and the
                   slant height (up the middle of a triangular face) make a right triangle. Its four faces have area
                   \(4\times\frac12 as = 2as\).</p>
                <div class="ca-tip"><strong>Which one do I need?</strong> Volume \(\tfrac13\pi r^2h\) needs the
                   <em>height</em>; surface area needs the <em>slant height</em>. When finding \(h\) or \(r\), subtract:
                   \(h^2 = s^2 - r^2\).</div>`,
            },
            {
                h: 'Going further: winding round a cylinder',
                html: R`
                <p>The curved side of a cylinder unrolls into a rectangle: its width is the <strong>circumference</strong> and
                   its height is the height of the cylinder. A path that winds round becomes a straight line.</p>
                ${F.row(cylAnt(24, 5, 0.5, { h: '5' }), F.cap(flatFig(12, [5], { w: 'half the circumference = 12', parts: ['5'] }), 'Unrolled half-way'))}
                <p>With circumference 24 cm and height 5 cm, going half-way round to the opposite side of the top rim is
                   \(\sqrt{12^2 + 5^2} = 13\) cm. Once round is the full circumference sideways; \(n\) times round is \(n\) times it.</p>
                <div class="ca-warn"><strong>Circumference, not diameter.</strong> The ant walks on the surface, round the curve.</div>`,
            },
        ],

        // Mirrors the textbook's own summary page for this lesson.
        summary: [
            {
                topic: 'Use the Pythagorean Theorem to Set Up an Equation',
                points: [
                    R`In a right triangle, when two sides are unknown, use \(x\) to represent the unknowns and set up an equation using the Pythagorean Theorem.`,
                    R`e.g. legs \(3\) and \(x\), hypotenuse \(9-x\): \((9-x)^2-x^2=9\), \((9-x+x)(9-x-x)=9\), \(9(9-2x)=9\), \(81-18x=9\), \(x=4\).`,
                ],
            },
            {
                topic: 'Space Diagonals of a Rectangular Prism',
                points: [
                    sectionBox(8, 5, 4, ['l', 'w', 'h'], 110),
                    R`The length of a space diagonal: \(\sqrt{l^2+w^2+h^2}\).`,
                ],
            },
            {
                topic: 'The Shortest Route on the Surface of a Rectangular Prism Between Two Opposite Vertices',
                points: [
                    R`Step ①: unfold the two faces that include the two vertices. Step ②: connect the two vertices on the unfolded net. Step ③: use the Pythagorean Theorem to find the length of the route. Step ④: find the length of the shortest route.`,
                    R`For a rectangular prism, use the longest edge and the sum of the other two edges as legs to form a right triangle; the hypotenuse is the shortest route.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Two unknown sides',
                q: R`A right triangle has legs \(3\) and \(x\), and its hypotenuse is \(9-x\). Find \(x\).`,
                fig: F.row(F.rightTriangle(3, 4, { a: '3', b: 'x', c: '9 − x' }, { max: 110 })),
                steps: [
                    R`The hypotenuse goes alone: \((9-x)^2 - x^2 = 3^2\).`,
                    R`Difference of squares: \((9-x+x)(9-x-x) = 9\), that is \(9(9-2x) = 9\).`,
                    R`\(81 - 18x = 9\), so \(18x = 72\) and \(x = 4\).`,
                    R`Check: the sides are 3, 4 and \(9-4 = 5\), and \(3^2+4^2 = 5^2\). ✓`,
                ],
                answer: R`\(x = 4\)`,
            },
            {
                title: 'A broken bamboo',
                q: R`A bamboo 8 m tall snaps in the wind. The top part stays attached, and its tip touches the ground 4 m from the foot of the bamboo. At what height did it snap?`,
                fig: F.row(groundTri(3, 4, { v: 'x', d: '4', h: '8 − x' })),
                steps: [
                    R`Let the snap be \(x\) m above the ground. The broken part is then \(8 - x\) m long, and it is the hypotenuse.`,
                    R`\(x^2 + 4^2 = (8-x)^2\), so \(x^2 + 16 = 64 - 16x + x^2\).`,
                    R`The \(x^2\) cancels: \(16x = 48\), so \(x = 3\).`,
                ],
                answer: R`3 m above the ground`,
            },
            {
                title: 'A reed in a pond',
                q: R`A reed grows straight up from the bottom of a pond and sticks out 20 cm above the water. The wind pushes it over (keeping it straight) until its tip just touches the surface, 60 cm from where the reed came out of the water. How deep is the pond?`,
                fig: F.row(pondFig(80, 20, 60, { v: 'x', a: '20', d: '60', h: 'x + 20' })),
                steps: [
                    R`Let the depth be \(x\) cm. The reed is \(x + 20\) cm long, and when pushed over it is the hypotenuse.`,
                    R`\(x^2 + 60^2 = (x+20)^2\), so \(x^2 + 3600 = x^2 + 40x + 400\).`,
                    R`\(40x = 3200\), so \(x = 80\).`,
                ],
                answer: R`80 cm`,
            },
            {
                title: 'The space diagonal of a box',
                q: R`A box is 6 cm long, 3 cm wide and 2 cm high. Find the length of the diagonal of its base, and the length of its space diagonal \(AB\).`,
                fig: F.row(diagBox(6, 3, 2)),
                steps: [
                    R`The base is a 6 by 3 rectangle. Its diagonal is \(\sqrt{6^2+3^2}=\sqrt{45}=3\sqrt5\) cm.`,
                    R`The base diagonal, the vertical edge and \(AB\) make a right triangle: \(AB^2=45+2^2=49\).`,
                    R`So \(AB=7\) cm. In one step: \(\sqrt{l^2+w^2+h^2}=\sqrt{36+9+4}=\sqrt{49}=7\).`,
                ],
                answer: R`\(3\sqrt5\) cm and 7 cm`,
            },
            {
                title: 'The shortest route over a box',
                q: R`A box is 6 cm long, 2 cm wide and 4 cm high. An ant walks on the surface from vertex \(A\) to the opposite vertex \(B\). How long is the shortest route?`,
                fig: F.row(abBox(6, 2, 4, [[[0, 0, 0], [4, 0, 4], HOT], [[4, 0, 4], [6, 2, 4], HOT]]), flatFig(6, [4, 2], { w: '6', parts: ['4 (front)', '2 (top)'] })),
                steps: [
                    R`Steps ①–③: unfold two faces and connect \(A\) to \(B\). The three unfoldings give \(\sqrt{(2+4)^2+6^2}=\sqrt{72}\), \(\sqrt{(2+6)^2+4^2}=\sqrt{80}\) and \(\sqrt{(4+6)^2+2^2}=\sqrt{104}\).`,
                    R`Step ④: the smallest is \(\sqrt{72}\). This is the rule: the longest edge (6) and the sum of the other two (\(2+4\)) are the legs.`,
                    R`\(\sqrt{72}=\sqrt{36\times2}=6\sqrt2\) cm.`,
                ],
                answer: R`\(6\sqrt2\) cm`,
            },
            {
                title: 'Folding a rectangle',
                q: R`Rectangle \(ABCD\) has \(AB = 8\) cm and \(BC = 10\) cm. It is folded along \(AE\) (with \(E\) on \(CD\)) so that \(D\) lands at a point \(F\) on \(BC\). Find \(DE\).`,
                fig: F.row(foldCornerFig(8, 10, 6, 5, { h: '8', w: '10' })),
                steps: [
                    R`Folding keeps lengths: \(AF = AD = 10\). In right triangle \(ABF\): \(BF = \sqrt{10^2-8^2} = 6\), so \(FC = 10 - 6 = 4\).`,
                    R`Let \(DE = x\). Then \(EF = x\) and \(EC = 8 - x\).`,
                    R`In right triangle \(ECF\): \(x^2 = (8-x)^2 + 4^2 = 64 - 16x + x^2 + 16\), so \(16x = 80\) and \(x = 5\).`,
                ],
                answer: R`\(DE = 5\) cm`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'equation-triangle', name: 'Two unknown sides: set up an equation', level: 1,
                gen(rng) {
                    const t = rng.pick(TRIPLES.filter(u => u[2] <= 30 && u[1] <= 4 * u[0])), [a, x] = rng.shuffle([t[0], t[1]]), c = t[2];
                    const S = x + c, k = c - x, v = rng.int(0, 3);
                    const fig = F.row(F.rightTriangle(a, x, { a: `${a}`, b: 'x', c: v < 2 ? `${S} − x` : `x + ${k}` }, { max: 115 }));
                    if (v < 2) {
                        const solve = R`The hypotenuse is \(${S}-x\): \((${S}-x)^2-x^2=${a}^2\). Difference of squares: \(${S}(${S}-2x)=${a * a}\), so \(${S * S}-${2 * S}x=${a * a}\) and \(x=${x}\).`;
                        return v === 0
                            ? { q: R`A right triangle has legs \(${a}\) and \(x\), and its hypotenuse is \(${S}-x\). Find \(x\).`, fig, ans: CA.num(x), sol: solve }
                            : { q: `In a right triangle, one leg is ${a} cm. The other leg and the hypotenuse add up to ${S} cm. How long is the hypotenuse?`, fig, ans: CA.num(c, cm), sol: R`Let the other leg be \(x\). ` + solve.replace(/\.$/, '') + R`, so the hypotenuse is \(${S}-${x}=${c}\) cm.` };
                    }
                    const solve = R`Let the other leg be \(x\); the hypotenuse is \(x+${k}\). \((x+${k})^2-x^2=${a}^2\), so \(${2 * k}x+${k * k}=${a * a}\) and \(x=${x}\)`;
                    return v === 2
                        ? { q: `In a right triangle, one leg is ${a} cm, and the hypotenuse is ${k} cm longer than the other leg. How long is the other leg?`, fig, ans: CA.num(x, cm), sol: solve + ' cm.' }
                        : { q: `In a right triangle, one leg is ${a} cm, and the hypotenuse is ${k} cm longer than the other leg. How long is the hypotenuse?`, fig, ans: CA.num(c, cm), sol: solve + R`. The hypotenuse is \(${x}+${k}=${c}\) cm.` };
                },
            },
            {
                id: 'face-diagonal', name: 'Diagonal of a face', level: 1,
                gen(rng) {
                    const face = rng.pick(['front', 'top', 'right']);
                    let p, q, o;
                    if (rng.bool(0.6)) { const t = rng.pick(SMALL.filter(x => x[2] <= 20)); [p, q] = rng.shuffle([t[0], t[1]]); } else { do { p = rng.int(2, 9); q = rng.int(2, 9); } while (CA.isSquare(p * p + q * q)); }
                    do { o = rng.int(2, 10); } while (o === p || o === q);
                    const [l, w, h] = face === 'front' ? [p, o, q] : face === 'top' ? [p, q, o] : [o, p, q];
                    const d2 = p * p + q * q, name = { front: 'front', top: 'top', right: 'right-hand' }[face];
                    return {
                        q: `A box is ${l} cm long, ${w} cm wide and ${h} cm high. Find the length of the diagonal of its ${name} face (shown in the figure). Give your answer in simplest radical form if it is not a whole number.`,
                        fig: F.row(boxFig(l, w, h, { segs: [faceSeg(l, w, h)[face]] })),
                        ans: rootAns(d2, cm),
                        sol: R`The ${name} face is a ${p} by ${q} rectangle: ${m(R`\sqrt{${sum2(p, q)}}=${rtEq(d2)}`)} cm.`,
                    };
                },
            },
            {
                id: 'space-diagonal', name: 'Space diagonal of a rectangular prism', level: 1,
                gen(rng) {
                    const quad = rng.pick(QUADS), [l, w, h] = rng.shuffle(quad.slice(0, 3)), d = quad[3];
                    return {
                        q: `A rectangular prism is ${l} cm long, ${w} cm wide and ${h} cm high. Find the length of its space diagonal AB.`,
                        fig: F.row(diagBox(l, w, h)),
                        ans: CA.num(d, cm),
                        sol: R`${m(R`AB=\sqrt{l^2+w^2+h^2}=\sqrt{${sum2(l, w, h)}}=\sqrt{${sqs(l, w, h)}}=\sqrt{${d * d}}=${d}`)} cm.`,
                    };
                },
            },
            {
                id: 'cube-diagonal', name: 'Diagonals of a cube', level: 1,
                gen(rng) {
                    const a = rng.int(2, 15), v = rng.int(0, 3);
                    if (v === 0) return { q: `A cube has edges ${a} cm long. Find the length of its space diagonal in simplest radical form.`, ans: CA.root(a, 3, cm), sol: R`${m(R`\sqrt{${sum2(a, a, a)}}=\sqrt{3\times${a}^2}=${troot(a, 3)}`)} cm.` };
                    if (v === 1) return { q: `A cube has edges ${a} cm long. Find the length of a diagonal of one of its faces in simplest radical form.`, ans: CA.root(a, 2, cm), sol: R`A face is a square of side ${a}: ${m(R`\sqrt{${sum2(a, a)}}=\sqrt{2\times${a}^2}=${troot(a, 2)}`)} cm.` };
                    if (v === 2) return { q: R`The space diagonal of a cube is \(${troot(a, 3)}\) cm long. How long is an edge of the cube?`, ans: CA.num(a, cm), sol: R`The space diagonal of a cube with edge \(a\) is \(\sqrt{a^2+a^2+a^2}=a\sqrt3\). So \(a\sqrt3=${troot(a, 3)}\) and \(a=${a}\) cm.` };
                    return { q: R`The space diagonal of a cube is \(\sqrt{${3 * a * a}}\) cm long. What is the volume of the cube?`, ans: CA.num(a ** 3, 'cm³'), sol: R`\(a^2+a^2+a^2=${3 * a * a}\), so \(a^2=${a * a}\) and \(a=${a}\). Volume \(=${a}^3=${a ** 3}\) cm³.` };
                },
            },
            {
                id: 'cone-slant', name: 'Cone: radius, height and slant height', level: 1,
                gen(rng) {
                    const t = rng.pick(SMALL), [r, h] = rng.shuffle([t[0], t[1]]), s = t[2], v = rng.int(0, 3);
                    const [q, lab, ans, sol] = [
                        [`A cone has base radius ${r} cm and height ${h} cm. Find its slant height.`, { r: `${r}`, h: `${h}`, l: 's = ?' }, s,
                            R`${m(R`s^2=${sum2(r, h)}=${r * r + h * h}`)}, so ${m(`s=${s}`)} cm.`],
                        [`A cone has base radius ${r} cm and slant height ${s} cm. Find its height.`, { r: `${r}`, h: '?', l: `${s}` }, h,
                            R`The slant height is the hypotenuse: ${m(R`h^2=${s}^2-${r}^2=${s * s - r * r}`)}, so ${m(`h=${h}`)} cm.`],
                        [`A cone has height ${h} cm and slant height ${s} cm. Find the radius of its base.`, { r: '?', h: `${h}`, l: `${s}` }, r,
                            R`The slant height is the hypotenuse: ${m(R`r^2=${s}^2-${h}^2=${s * s - h * h}`)}, so ${m(`r=${r}`)} cm.`],
                        [`A cone has base diameter ${2 * r} cm and height ${h} cm. Find its slant height.`, { h: `${h}`, l: 's = ?' }, s,
                            R`The radius is ${m(R`${2 * r}\div2=${r}`)}. ${m(R`s^2=${sum2(r, h)}=${r * r + h * h}`)}, so ${m(`s=${s}`)} cm.`],
                    ][v];
                    return { q, fig: F.row(F.cone(r, h, { labels: lab, max: 105 })), ans: CA.num(ans, cm), sol };
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'broken-pole', name: 'Broken bamboo and snapped poles', level: 2,
                gen(rng) {
                    const [what, unit] = rng.pick([['bamboo', 'm'], ['bamboo', 'ft'], ['tree', 'm'], ['flagpole', 'm'], ['telephone pole', 'm'], ['young pine tree', 'ft']]);
                    let x, d, H;
                    if (rng.bool(0.7)) {
                        for (;;) { const t = rng.pick(SMALL), k = rng.pick([1, 1, 1, 2]); [x, d] = rng.shuffle([t[0] * k, t[1] * k]); H = x + t[2] * k; if (H <= (unit === 'm' ? 30 : 45)) break; }
                    } else {
                        for (;;) { H = rng.int(6, 20); d = rng.int(2, H - 2); x = (H * H - d * d) / (2 * H); if (Number.isInteger(CA.round(x * 10, 6)) && !Number.isInteger(x) && x >= 1 && d <= 3 * x && x <= 3 * d) break; }
                        x = CA.round(x, 1);
                    }
                    const top = CA.round(H - x, 1), askTop = rng.bool(0.35);
                    const work = R`Let it snap \(x\) ${unit} above the ground; the broken part is \(${H}-x\) and is the hypotenuse. \(x^2+${d}^2=(${H}-x)^2\), so \(x^2+${d * d}=${H * H}-${2 * H}x+x^2\), \(${2 * H}x=${H * H - d * d}\) and \(x=${tnum(x)}\)`;
                    return {
                        q: `A ${what} ${H} ${unit} tall stands straight up on level ground. A storm snaps it, but the top part stays attached, and its tip touches the ground ${d} ${unit} from the foot of the ${what}. ${askTop ? 'How long is the broken-off top part?' : 'At what height above the ground did it snap?'}`,
                        fig: F.row(groundTri(x, d, { v: 'x', d: `${d}`, h: `${H} − x` })),
                        ans: CA.num(askTop ? top : x, unit),
                        sol: askTop ? work + R`. The top part is \(${H}-${tnum(x)}=${tnum(top)}\) ${unit}.` : work + ` ${unit}.`,
                    };
                },
            },
            {
                id: 'reed-pond', name: 'Reeds, ropes and ladders: x and x + a', level: 2,
                gen(rng) {
                    const kind = rng.pick(['reed', 'lotus', 'rope', 'ladder']);
                    const maxX = { reed: 24, lotus: 20, rope: 24, ladder: 15 }[kind];
                    let a, d, x;
                    for (;;) {
                        a = rng.int(1, 6); d = rng.int(a + 1, 24); x = (d * d - a * a) / (2 * a);
                        if (Number.isInteger(x) && x >= 3 && x <= maxX && x <= 5 * d && d <= 4 * x) break;
                    }
                    const eq = R`\(x^2+${d}^2=(x+${a})^2\), so \(${d * d}=${2 * a}x+${a * a}\) and \(x=${x}\)`;
                    if (kind === 'reed' || kind === 'lotus') {
                        const k = kind === 'lotus' ? 10 : 1, unit = kind === 'lotus' ? 'cm' : 'ft', A = a * k, Dd = d * k, X = x * k;
                        const askLen = rng.bool(0.3);
                        const thing = kind === 'lotus' ? 'A lotus flower on a straight stem' : 'A reed';
                        const ask = askLen ? `How long is the ${kind === 'lotus' ? 'stem' : 'reed'}, from the bottom of the pond to its tip?` : 'How deep is the pond?';
                        return {
                            q: `${thing} grows straight up from the bottom of a pond, and its tip is ${A} ${unit} above the water. The wind pushes it over (it stays straight and its root stays put) until its tip just touches the water, ${Dd} ${unit} from where it used to come out of the water. ${ask}`,
                            fig: F.row(pondFig(X, A, Dd, { v: 'x', a: `${A}`, d: `${Dd}`, h: `x + ${A}` })),
                            ans: CA.num(askLen ? X + A : X, unit),
                            sol: R`Let the depth be \(x\) ${unit}; the ${kind === 'lotus' ? 'stem' : 'reed'} is \(x+${A}\) and is the hypotenuse. ` + (k === 1 ? eq : R`\(x^2+${Dd}^2=(x+${A})^2\), so \(${Dd * Dd}=${2 * A}x+${A * A}\) and \(x=${X}\)`) + (askLen ? R`. The length is \(${X}+${A}=${X + A}\) ${unit}.` : ` ${unit}.`),
                        };
                    }
                    if (kind === 'rope') return {
                        q: `A rope hangs from the top of a flagpole. It is ${a} m longer than the pole, so ${a} m of it lies on the ground. When the rope is pulled tight, its end just touches the ground ${d} m from the foot of the pole. How tall is the flagpole?`,
                        fig: F.row(groundTri(x, d, { v: 'x', d: `${d}`, h: `x + ${a}` })),
                        ans: CA.num(x, 'm'),
                        sol: R`Let the pole be \(x\) m; the rope is \(x+${a}\) and is the hypotenuse. ` + eq + ' m.',
                    };
                    return {
                        q: `A ladder leans against a vertical wall with its foot ${d} m from the wall. The ladder is ${a} m longer than the height its top reaches up the wall. How long is the ladder?`,
                        fig: F.row(groundTri(x, d, { v: 'x', d: `${d}`, h: `x + ${a}` }, { wall: true })),
                        ans: CA.num(x + a, 'm'),
                        sol: R`Let the top be \(x\) m up the wall; the ladder is \(x+${a}\). ` + eq + R`. The ladder is \(${x}+${a}=${x + a}\) m.`,
                    };
                },
            },
            {
                id: 'missing-edge', name: 'Space diagonal backwards: the missing edge', level: 2,
                gen(rng) {
                    const quad = rng.pick(QUADS), [l, w, h] = rng.shuffle(quad.slice(0, 3)), d = quad[3];
                    const which = rng.int(0, 2), name = ['length', 'width', 'height'][which], x = [l, w, h][which];
                    const known = [`${l} cm long`, `${w} cm wide`, `${h} cm high`].filter((_, i) => i !== which).join(' and ');
                    const [a, b] = [l, w, h].filter((_, i) => i !== which);
                    const labels = [`${l}`, `${w}`, `${h}`].map((s, i) => (i === which ? '?' : s));
                    // the wording follows from the numbers, so the same box never appears twice in different words
                    const intro = [`The space diagonal AB of a rectangular prism is ${d} cm long. The prism is ${known}.`,
                        `A straight rod ${d} cm long fits exactly from vertex A to the opposite vertex B of a box. The box is ${known}.`][(l + w + h + which) % 2];
                    return {
                        q: `${intro} What is the ${name}?`,
                        fig: F.row(diagBox(l, w, h, labels)),
                        ans: CA.num(x, cm),
                        sol: R`${m(R`${d}^2=${a}^2+${b}^2+x^2`)}, so ${m(R`x^2=${d * d}-${a * a}-${b * b}=${x * x}`)} and ${m(`x=${x}`)} cm.`,
                    };
                },
            },
            {
                id: 'longest-rod', name: 'Space diagonals in real life', level: 2,
                gen(rng) {
                    if (rng.bool(0.5)) {
                        let l, w, h, d2;
                        do { [l, w, h] = [rng.int(2, 12), rng.int(1, 8), rng.int(1, 9)]; d2 = l * l + w * w + h * h; } while (CA.isSquare(d2) || Math.max(l, w, h) > 6 * Math.min(l, w, h));
                        const [thing, box] = rng.pick([['straight rod', 'a box'], ['pencil', 'a pencil case shaped like a box'], ['straight straw', 'a lunch box'], ['knitting needle', 'a drawer'], ['thin straight stick', 'a crate'], ['wand', 'a gift box']]);
                        return {
                            q: `What is the length of the longest ${thing} that fits inside ${box} ${l} cm long, ${w} cm wide and ${h} cm high? Ignore the thickness of the ${thing} and give your answer in simplest radical form.`,
                            ans: CA.rootOf(d2, cm),
                            sol: R`The longest straight line in a box is its space diagonal: ${m(R`\sqrt{${sum2(l, w, h)}}=\sqrt{${sqs(l, w, h)}}=${rtEq(d2)}`)} cm.`,
                        };
                    }
                    const quad = rng.pick(QUADS.filter(x => x[2] <= 4 * x[0])), [a, b, c] = rng.shuffle(quad.slice(0, 3)), d = quad[3];
                    const work = R`${m(R`\sqrt{${sum2(a, b, c)}}=\sqrt{${a * a + b * b + c * c}}=${d}`)} m.`;
                    const v = rng.int(0, 2);
                    if (v === 0) {
                        const [bug, prey] = rng.pick([['spider', 'fly'], ['gecko', 'moth'], ['frog', 'beetle']]);
                        return {
                            q: `A room is ${a} m long, ${b} m wide and ${c} m high. A ${prey} sits in a top corner of the room (B) and a ${bug} sits in the opposite bottom corner (A). How far apart are they in a straight line through the air?`,
                            fig: F.row(diagBox(a, b, c)),
                            ans: CA.num(d, 'm'),
                            sol: R`This is the space diagonal of the room: ` + work,
                        };
                    }
                    if (v === 1) {
                        const [thing, verb] = rng.pick([['drone', 'hovers'], ['kite', 'flies'], ['balloon', 'floats'], ['bird', 'hovers']]);
                        return {
                            q: `A ${thing} ${verb} at a point that is ${a} m east and ${b} m north of where Mia is standing, and ${c} m above the ground at her feet. How far is the ${thing} from Mia's feet, in a straight line?`,
                            ans: CA.num(d, 'm'),
                            sol: R`East, north and up are three directions at right angles, like the edges of a box: ` + work,
                        };
                    }
                    return {
                        q: `A flagpole ${c} m tall stands at one corner of a flat rectangular field ${a} m long and ${b} m wide. A rope is stretched tight from the top of the pole to the opposite corner of the field. How long is the rope?`,
                        ans: CA.num(d, 'm'),
                        sol: R`The rope is the space diagonal of a box ${a} by ${b} by ${c}: ` + work,
                    };
                },
            },
            {
                id: 'shortest-route', name: 'Shortest route between opposite vertices', level: 2,
                gen(rng) {
                    const v = rng.int(0, 3);
                    if (v === 3) {
                        // a route of one given kind: the ant must cross a named pair of faces
                        let l, w, h;
                        do { [l, w, h] = [rng.int(2, 10), rng.int(1, 8), rng.int(1, 9)]; } while (Math.max(l, w, h) > 5 * Math.min(l, w, h));
                        const [faces, s2, how] = rng.pick([
                            ['the front face and then the top face', l * l + (h + w) ** 2, R`these unfold into a rectangle \(${l}\) by \(${h}+${w}=${h + w}\): \(\sqrt{${l}^2+${h + w}^2}\)`],
                            ['the front face and then the right-hand face', (l + w) ** 2 + h * h, R`these unfold into a rectangle \(${l}+${w}=${l + w}\) by \(${h}\): \(\sqrt{${l + w}^2+${h}^2}\)`],
                        ]);
                        return {
                            q: `A box is ${l} cm long, ${w} cm wide and ${h} cm high. An ant walks from vertex A to the opposite vertex B, crossing ${faces} (see the figure). What is the length of the shortest route of this kind? Give your answer in simplest radical form if it is not a whole number.`,
                            fig: F.row(abBox(l, w, h)),
                            ans: rootAns(s2, cm),
                            sol: R`Unfold the two faces it crosses: ${how}${m(R`=${rtEq(s2)}`)} cm.`,
                        };
                    }
                    const [p, q, c, Rr] = rng.pick(ROUTES), [l, w, h] = rng.shuffle([p, q, c]);
                    const us = unfoldings(p, q, c), list = us.map(u => m(R`\sqrt{(${u.x}+${u.y})^2+${u.z}^2}=\sqrt{${u.s}}`)).join(', ');
                    const bug = rng.pick(['An ant', 'A ladybird', 'A beetle', 'A spider']);
                    const fig = F.row(abBox(l, w, h));
                    if (v === 2) {
                        const sd = p * p + q * q + c * c;
                        const opts = [...new Set([...us.map(u => u.s), sd])];
                        return {
                            q: `${bug} walks on the surface of a box ${l} cm long, ${w} cm wide and ${h} cm high, from vertex A to the opposite vertex B. Which of these is the length of the shortest route?`,
                            fig,
                            ans: CA.mc(rng, m(R`\sqrt{${Rr * Rr}}`), opts.filter(s => s !== Rr * Rr).map(s => m(R`\sqrt{${s}}`))),
                            sol: R`The three unfoldings give ${list}. (\(\sqrt{${sd}}\) is the space diagonal: it goes through the box, not over it.) The shortest is \(\sqrt{${Rr * Rr}}=${Rr}\) cm.`,
                        };
                    }
                    return {
                        q: `${bug} walks on the surface of a closed box ${l} cm long, ${w} cm wide and ${h} cm high, from vertex A to the opposite vertex B. How long is the shortest route?`,
                        fig,
                        ans: CA.num(Rr, cm),
                        sol: R`Use the longest edge (${c}) and the sum of the other two (\(${p}+${q}=${p + q}\)) as legs: \(\sqrt{${p + q}^2+${c}^2}=\sqrt{${Rr * Rr}}=${Rr}\) cm. (All three unfoldings: ${list}.)`,
                    };
                },
            },
            {
                id: 'pyramid-slant', name: 'Square pyramid: height and slant height', level: 2,
                gen(rng) {
                    const t = rng.pick(SMALL), [x, h] = rng.bool(0.7) ? [t[0], t[1]] : [t[1], t[0]], s = t[2], a = 2 * x, v = rng.int(0, 3);
                    const half = R`From the centre of the base to the middle of an edge is ${m(R`${a}\div2=${x}`)}. `;
                    const slant = half + R`${m(R`s^2=${sum2(h, x)}=${s * s}`)}, so the slant height is ${s}`;
                    const [q, lab, ans, sol] = [
                        [`A square pyramid has base edges of ${a} cm and height ${h} cm. Find its slant height.`, { a: `${a}`, h: `${h}`, s: '?' }, CA.num(s, cm), slant + ' cm.'],
                        [`A square pyramid has base edges of ${a} cm and slant height ${s} cm. Find its height.`, { a: `${a}`, h: '?', s: `${s}` }, CA.num(h, cm),
                            half + R`${m(R`h^2=${s}^2-${x}^2=${h * h}`)}, so ${m(`h=${h}`)} cm.`],
                        [`A square pyramid has base edges of ${a} cm and height ${h} cm. Find the total area of its four triangular faces.`, { a: `${a}`, h: `${h}` }, CA.num(2 * a * s, 'cm²'),
                            slant + R`. Four triangles: ${m(R`4\times\tfrac12\times${a}\times${s}=${2 * a * s}`)} cm².`],
                        [`A solid square pyramid has base edges of ${a} cm and height ${h} cm. Find its total surface area, including the base.`, { a: `${a}`, h: `${h}` }, CA.num(a * a + 2 * a * s, 'cm²'),
                            slant + R`. Four triangles: ${m(R`4\times\tfrac12\times${a}\times${s}=${2 * a * s}`)}. Base: ${m(R`${a}^2=${a * a}`)}. Total ${a * a + 2 * a * s} cm².`],
                    ][v];
                    return { q, fig: F.row(pyrFig(a, h, lab)), ans, sol };
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'fold-rectangle', name: 'Folding a rectangle', level: 3,
                gen(rng) {
                    for (;;) {
                        if (rng.bool()) {
                            // fold corner D onto side BC
                            const t = rng.pick(TRIPLES.filter(u => u[2] <= 30 && u[1] <= 3 * u[0])), [h, f] = rng.shuffle([t[0], t[1]]), w = t[2], fc = w - f;
                            const num = h * h + fc * fc, den = 2 * h, [n, dn] = CA.reduce(num, den);
                            if (dn > 6) continue;
                            const x = num / den, askCE = rng.bool(0.4);
                            const work = R`Folding keeps lengths: \(AF=AD=${w}\), so \(BF=\sqrt{${w}^2-${h}^2}=${f}\) and \(FC=${w}-${f}=${fc}\). Let \(DE=EF=x\); then \(EC=${h}-x\). In right triangle \(ECF\): \(x^2=(${h}-x)^2+${fc}^2\), so \(${2 * h}x=${num}\) and \(x=${T.frac(n, dn)}\)`;
                            return {
                                q: R`Rectangle \(ABCD\) has \(AB=${h}\) cm and \(BC=${w}\) cm. It is folded along \(AE\), with \(E\) on side \(CD\), so that vertex \(D\) lands on a point \(F\) on side \(BC\). Find the length of \(${askCE ? 'CE' : 'DE'}\). (Give a fraction if the answer is not a whole number.)`,
                                fig: F.row(foldCornerFig(h, w, f, x, { h: `${h}`, w: `${w}` })),
                                ans: askCE ? CA.frac(h * den - num, den, cm) : CA.frac(num, den, cm),
                                sol: askCE ? work + R`. So \(CE=${h}-${T.frac(n, dn)}=${T.frac(h * den - num, den)}\) cm.` : work + ' cm.',
                            };
                        }
                        // fold along the diagonal BD
                        const L = rng.int(4, 16), W = rng.int(2, L - 2);
                        const num = L * L + W * W, den = 2 * L, [n, dn] = CA.reduce(num, den);
                        if (dn > 6 || W > 0.75 * L) continue;
                        const x = num / den, ask = rng.pick(['BE', 'AE', 'area']);
                        const work = R`\(\angle EDB=\angle DBC=\angle DBE\) (alternate angles, and the fold), so triangle \(EBD\) is isosceles: \(EB=ED=x\) and \(AE=${L}-x\). In right triangle \(ABE\): \(x^2=(${L}-x)^2+${W}^2\), so \(${2 * L}x=${num}\) and \(x=${T.frac(n, dn)}\)`;
                        const [qtext, ans, tail] = {
                            BE: [R`the length of \(BE\)`, CA.frac(num, den, cm), ' cm.'],
                            AE: [R`the length of \(AE\)`, CA.frac(L * den - num, den, cm), R`. So \(AE=${L}-${T.frac(n, dn)}=${T.frac(L * den - num, den)}\) cm.`],
                            area: [R`the area of the overlapping triangle \(EBD\)`, CA.frac(num * W, 2 * den, 'cm²'), R`. Area \(=\tfrac12\times ED\times AB=\tfrac12\times${T.frac(n, dn)}\times${W}=${T.frac(num * W, 2 * den)}\) cm².`],
                        }[ask];
                        return {
                            q: R`Rectangle \(ABCD\) has \(AD=${L}\) cm and \(AB=${W}\) cm. It is folded along the diagonal \(BD\), so that \(C\) lands at \(C'\), and \(BC'\) crosses \(AD\) at \(E\). Find ${qtext}. (Give a fraction if the answer is not a whole number.)`,
                            fig: F.row(foldDiagFig(L, W, x, { L: `${L}`, W: `${W}` })),
                            ans, sol: work + tail,
                        };
                    }
                },
            },
            {
                id: 'equation-stories', name: 'Ladders, poles and perimeters', level: 3,
                gen(rng) {
                    const v = rng.int(0, 2);
                    if (v === 0) {
                        const t = rng.pick(TRIPLES.filter(u => u[2] <= 26 && u[1] <= 4 * u[0])), [b, h, c] = t, p = h - b;
                        return {
                            q: `A ladder ${c} ft long leans against a vertical wall, with its foot ${b} ft from the wall. The top of the ladder slides down the wall, and at the same time the foot slides away from the wall by exactly the same distance. How far did the top slide down?`,
                            fig: F.row(ladderFig(b, h, p, { c: `${c}`, b: `${b}` })),
                            ans: CA.num(p, 'ft'),
                            sol: R`First the top: \(\sqrt{${c}^2-${b}^2}=${h}\) ft up. Let both move \(p\): \((${h}-p)^2+(${b}+p)^2=${c}^2\). Expanding, \(${h * h + b * b}-${2 * h}p+${2 * b}p+2p^2=${c * c}\), so \(2p^2=${2 * (h - b)}p\) and \(p=${p}\) ft.`,
                        };
                    }
                    if (v === 1) {
                        let p, q, D, x;
                        for (;;) {
                            p = rng.int(3, 20); q = rng.int(3, 20); D = rng.int(8, 40);
                            x = (D * D + q * q - p * p) / (2 * D);
                            if (p !== q && Number.isInteger(x) && x >= 2 && D - x >= 2 && D <= 4 * Math.max(p, q) && D >= Math.max(p, q)) break;
                        }
                        return {
                            q: `Two vertical poles stand ${D} m apart on level ground: one is ${p} m tall and the other is ${q} m tall. A point P on the ground between them is the same distance from the tops of both poles. How far is P from the foot of the ${p} m pole?`,
                            fig: F.row(polesFig(p, q, D, x, { p: `${p}`, q: `${q}`, x: 'x', y: `${D} − x` })),
                            ans: CA.num(x, 'm'),
                            sol: R`Let the distance be \(x\). Then \(x^2+${p}^2=(${D}-x)^2+${q}^2\), so \(x^2+${p * p}=${D * D}-${2 * D}x+x^2+${q * q}\). Hence \(${2 * D}x=${D * D + q * q - p * p}\) and \(x=${x}\) m.`,
                        };
                    }
                    const t = rng.pick(TRIPLES.filter(u => u[2] <= 41)), [a, x] = rng.shuffle([t[0], t[1]]), c = t[2], P = a + x + c, S = P - a;
                    return {
                        q: `A right triangle has a perimeter of ${P} cm, and one of its legs is ${a} cm long. How long is its hypotenuse?`,
                        ans: CA.num(c, cm),
                        sol: R`The other leg and the hypotenuse add up to \(${P}-${a}=${S}\). Let the other leg be \(x\); the hypotenuse is \(${S}-x\). \((${S}-x)^2-x^2=${a}^2\) gives \(${S}(${S}-2x)=${a * a}\), so \(x=${x}\) and the hypotenuse is \(${S}-${x}=${c}\) cm.`,
                    };
                },
            },
            {
                id: 'ant-box', name: 'Shortest route: radicals and backwards', level: 3,
                gen(rng) {
                    const v = rng.int(0, 3);
                    if (v === 2) {
                        const a = rng.int(2, 12);
                        return {
                            q: `An ant walks on the surface of a cube with edges ${a} cm long, from vertex A to the opposite vertex B. What is the length of the shortest route? Give your answer in simplest radical form.`,
                            fig: F.row(abBox(3, 3, 3, [], [`${a}`, `${a}`, `${a}`])),
                            ans: CA.root(a, 5, cm),
                            sol: R`All edges are equal, so any pair of faces unfolds into a rectangle \(${a}\) by \(${2 * a}\): \(\sqrt{${2 * a}^2+${a}^2}=\sqrt{5\times${a}^2}=${troot(a, 5)}\) cm.`,
                        };
                    }
                    if (v === 3) {
                        const [p, q, c, Rr] = rng.pick(ROUTES.filter(r => r[2] > r[1])), [known, missing] = rng.shuffle([p, q]);
                        return {
                            q: `A box has edges of ${c} cm (its longest edge), ${known} cm and an unknown length. The shortest route on its surface between two opposite vertices is ${Rr} cm. How long is the unknown edge?`,
                            ans: CA.num(missing, cm),
                            sol: R`The shortest route has legs \(${c}\) (the longest edge) and \(${known}+y\). So \(${c}^2+(${known}+y)^2=${Rr}^2\), \((${known}+y)^2=${Rr * Rr - c * c}\), \(${known}+y=${p + q}\) and \(y=${missing}\) cm.`,
                        };
                    }
                    let l, w, h;
                    do { [l, w, h] = [rng.int(2, 12), rng.int(1, 9), rng.int(1, 10)]; } while ((l === w && w === h) || Math.max(l, w, h) > 6 * Math.min(l, w, h) || CA.isSquare(Math.min(...unfoldings(l, w, h).map(u => u.s))));
                    const [p, q, r] = [l, w, h].sort((x, y) => x - y), best = (p + q) ** 2 + r * r;
                    const cand = unfoldings(p, q, r).map(u => R`\sqrt{(${u.x}+${u.y})^2+${u.z}^2}=\sqrt{${u.s}}`);
                    const bug = rng.pick(['An ant', 'A ladybird', 'A beetle', 'A spider', 'A snail']);
                    return {
                        q: `${bug} walks on the outside of a closed box ${l} cm long, ${w} cm wide and ${h} cm high, from vertex A to the opposite vertex B. What is the length of the shortest possible route? Give your answer in simplest radical form.`,
                        fig: F.row(abBox(l, w, h)),
                        ans: CA.rootOf(best, cm),
                        sol: R`The three unfoldings give ${cand.map(m).join(', ')}. The shortest uses the longest edge (${r}) and the sum of the other two (${p + q}): ${m(rtEq(best))} cm.`,
                    };
                },
            },
            {
                id: 'ant-cylinder', name: 'Shortest path round a cylinder', level: 3,
                gen(rng) {
                    const v = rng.int(0, 2);
                    if (v === 0) {
                        let t, half, h;
                        do { t = rng.pick(TRIPLES); [half, h] = rng.shuffle([t[0], t[1]]); } while (half > 3 * h || h > 3.2 * half);
                        const bug = rng.pick(['An ant', 'A ladybird', 'A caterpillar', 'A beetle']);
                        return {
                            q: `A tin can is a cylinder ${h} cm tall with circumference ${2 * half} cm. ${bug} at point A on the bottom rim wants to reach point B on the top rim, exactly on the opposite side of the can. It walks only on the curved surface. What is the length of the shortest path?`,
                            fig: F.row(cylAnt(2 * half, h, 0.5, { h: `${h}` })),
                            ans: CA.num(t[2], cm),
                            sol: R`Unroll the curved surface. B is half-way round: ${m(R`${2 * half}\div2=${half}`)} cm sideways and ${h} cm up. ${m(R`\sqrt{${sum2(half, h)}}=\sqrt{${t[2] * t[2]}}=${t[2]}`)} cm.`,
                        };
                    }
                    if (v === 1) {
                        let t, C, h;
                        do { t = rng.pick(TRIPLES); [C, h] = rng.shuffle([t[0], t[1]]); } while (C > 2.2 * h || h > 6 * C);
                        const [thing, what] = rng.pick([['A cardboard tube', 'A line is drawn'], ['A round pillar', 'A string of lights runs'], ['A glass jar', 'A stripe is painted'], ['A tree trunk shaped like a cylinder', 'A vine grows']]);
                        return {
                            q: `${thing} is ${h} cm tall and has circumference ${C} cm. ${what} on its curved surface from point A at the bottom, exactly once round, to point B at the top directly above A. What is the shortest possible length of this path?`,
                            fig: F.row(cylAnt(C, h, 1, { h: `${h}` })),
                            ans: CA.num(t[2], cm),
                            sol: R`Unroll the curved surface into a rectangle ${C} cm wide and ${h} cm tall. Once round is the full width, so the path is the diagonal: ${m(R`\sqrt{${sum2(C, h)}}=\sqrt{${t[2] * t[2]}}=${t[2]}`)} cm.`,
                        };
                    }
                    let t, n, C, h, side;
                    do { t = rng.pick(TRIPLES); n = rng.int(2, 6); [side, h] = rng.shuffle([t[0], t[1]]); C = side / n; } while (!Number.isInteger(C) || C < 2 || h < 2.5 * C || h > 8 * C);
                    const thing = rng.pick(['ribbon', 'string', 'strip of tape', 'wire']);
                    return {
                        q: `A cylindrical pole is ${h} cm tall and has circumference ${C} cm. A ${thing} starts at point A at the bottom, winds evenly round the pole exactly ${n} times, and ends at point B at the top, directly above A. How long is the ${thing}?`,
                        fig: F.row(cylAnt(C, h, n, { h: `${h}` })),
                        ans: CA.num(t[2], cm),
                        sol: R`Unrolled, ${n} turns carry the ${thing} ${m(R`${n}\times${C}=${side}`)} cm sideways while it climbs ${h} cm. ${m(R`\sqrt{${sum2(side, h)}}=\sqrt{${t[2] * t[2]}}=${t[2]}`)} cm.`,
                    };
                },
            },
        ],

        assignment: [
            ['equation-triangle', 4], ['face-diagonal', 3], ['space-diagonal', 3], ['cube-diagonal', 3], ['cone-slant', 2],
            ['broken-pole', 4], ['reed-pond', 4], ['missing-edge', 3], ['longest-rod', 3], ['shortest-route', 5], ['pyramid-slant', 4],
            ['fold-rectangle', 3], ['equation-stories', 3], ['ant-box', 3], ['ant-cylinder', 3],
        ],
    });
})();
