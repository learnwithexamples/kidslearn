/* Challenge Academy — Lesson 17: Similarity Model */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, T = CA.tex;
    const { FILL, SHADE, ACCENT, INK } = F.colors;
    const WARM = '#ffd8a8', PALE = '#f5f7ff', GREY = '#718096', LAMP = '#ffd43b', MINT = '#b2f2bb';
    const QM = `<tspan fill="${ACCENT}" font-weight="bold">?</tspan>`;

    // ── Geometry helpers ─────────────────────────────────────────────────
    // Every figure is drawn from real coordinates, so it is true to the numbers.
    const lerp = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
    /** The angle (degrees) opposite side a in a triangle with sides a, b, c. */
    const angleOpp = (a, b, c) => Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)))) * 180 / Math.PI;
    const isTri = (a, b, c) => a < b + c && b < a + c && c < a + b;
    /** Corners A, B, C of the triangle with AB = c, BC = a, CA = b: B at the origin, C along the x-axis, A above. */
    function corners(c, a, b) {
        const x = (c * c + a * a - b * b) / (2 * a);
        return [[x, Math.sqrt(Math.max(0, c * c - x * x))], [0, 0], [a, 0]];
    }
    /** Fill in the unknown (null) values so that ok(...values) holds; null if impossible. */
    const MULTS = [1, 0.9, 1.12, 0.8, 1.25, 0.7, 1.4, 0.62, 1.55, 0.95, 1.06, 0.85, 1.18, 0.75, 1.32];
    function fit(vals, ok, rng) {
        const known = vals.filter(v => v != null);
        const base = known.length ? known.reduce((s, x) => s + x, 0) / known.length : 10;
        const free = [];
        vals.forEach((v, i) => { if (v == null) free.push(i); });
        const lists = free.map(() => (rng ? rng.shuffle(MULTS) : MULTS).map(t => t * base));
        const cur = vals.slice();
        const rec = k => {
            if (k === free.length) return ok(...cur) ? cur.slice() : null;
            for (const x of lists[k]) { cur[free[k]] = x; const r = rec(k + 1); if (r) return r; }
            return null;
        };
        return rec(0);
    }
    /** A pleasant pyramid: base BC flat, both base angles between 36° and 82°. */
    const pyrOK = (AB, BC, AC) => {
        if (!isTri(AB, BC, AC)) return false;
        const B = angleOpp(AC, AB, BC), C = angleOpp(AB, AC, BC), A = 180 - B - C;
        return B >= 36 && B <= 82 && C >= 36 && C <= 82 && A >= 28 && A <= 92;
    };
    const fitPyr = (AB, BC, AC, rng) => fit([AB, BC, AC], pyrOK, rng);
    /** A pleasant top triangle OAB for an hourglass: the angles at A and B between 45° and 67°. */
    const hgOK = (OA, AB, OB) => {
        if (!isTri(OA, AB, OB)) return false;
        const A = angleOpp(OB, OA, AB), B = angleOpp(OA, OB, AB);
        return A >= 45 && A <= 67 && B >= 45 && B <= 67;
    };
    const fitHg = (OA, AB, OB, rng) => fit([OA, AB, OB], hgOK, rng);

    /**
     * A drawing board: give it named points in ordinary (x, y) coordinates (y up) and it
     * scales them into the picture.  Lengths are written beside segments, on the side away
     * from a reference point.  '?' is drawn in orange.  done(label, legend) can add a key
     * under the picture: [{ fill | line, text }].
     */
    function board(pts, o = {}) {
        const names = Object.keys(pts);
        const xs = names.map(n => pts[n][0]), ys = names.map(n => pts[n][1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const s = o.scale || Math.min((o.w || 190) / (x1 - x0 || 1), (o.h || 120) / (y1 - y0 || 1));
        const [pl, pt, pr, pb] = o.pad || [30, 22, 30, 24];
        const W = (x1 - x0) * s + pl + pr, H = (y1 - y0) * s + pt + pb;
        const P = n => { const p = typeof n === 'string' ? pts[n] : n; return [pl + (p[0] - x0) * s, pt + (y1 - p[1]) * s]; };
        const unit = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
        const away = (a, c, ref) => {                   // unit normal of segment ac, pointing away from ref
            const A = P(a), C = P(c), M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], Rf = P(ref);
            let n = unit(-(C[1] - A[1]), C[0] - A[0]);
            if (n[0] * (Rf[0] - M[0]) + n[1] * (Rf[1] - M[1]) > 0) n = [-n[0], -n[1]];
            return { A, C, M, n };
        };
        const val = (x, y, t) => F.text(x, y + 4.5, t, String(t) === '?' ? { fill: ACCENT, bold: true, size: 15 } : { size: 12.5 });
        const reach = (t, n) => 7 + 3.4 * String(t).length * Math.abs(n[0]) + 5 * Math.abs(n[1]);
        let body = '';
        const b = {
            P,
            poly(ns, opt) { body += F.poly(ns.map(P), opt); return b; },
            seg(a, c, opt) { const A = P(a), C = P(c); body += F.line(A[0], A[1], C[0], C[1], opt); return b; },
            raw(fn) { body += fn(P); return b; },
            /** Name a point; dir is a direction on the page (x right, y down). */
            pt(name, dir, text) { const p = P(name), d = unit(dir[0], dir[1]); body += F.text(p[0] + d[0] * 12, p[1] + d[1] * 12 + 4.5, text || name, { bold: true }); return b; },
            /** Name a point that lies on segment ac, on the side away from ref. */
            ptOn(name, a, c, ref) { return b.pt(name, away(a, c, ref).n); },
            /** Name a point inside the angle between the directions to points n1 and n2. */
            ptIn(name, n1, n2, text) { const p = P(name), a = P(n1), c = P(n2), u1 = unit(a[0] - p[0], a[1] - p[1]), u2 = unit(c[0] - p[0], c[1] - p[1]); return b.pt(name, [u1[0] + u2[0], u1[1] + u2[1]], text); },
            /** Write a length beside segment ac, on the side away from ref. */
            len(a, c, t, ref) { const { M, n } = away(a, c, ref), d = reach(t, n); body += val(M[0] + n[0] * d, M[1] + n[1] * d, t); return b; },
            /** A dimension line for the whole of ac, set off on the side away from ref. */
            dim(a, c, t, ref) {
                const { A, C, M, n } = away(a, c, ref), d = 24, e = d + reach(t, n);
                const sh = (Q, k) => [Q[0] + n[0] * k, Q[1] + n[1] * k];
                const [A1, C1] = [sh(A, d), sh(C, d)];
                body += F.line(A1[0], A1[1], C1[0], C1[1], { stroke: GREY, width: 0.9 });
                for (const Q of [A, C]) { const u = sh(Q, d - 4), v = sh(Q, d + 4); body += F.line(u[0], u[1], v[0], v[1], { stroke: GREY, width: 0.9 }); }
                body += val(M[0] + n[0] * e, M[1] + n[1] * e, t);
                return b;
            },
            done(label, legend) {
                let W2 = W, extra = '', LH = 0;
                if (legend && legend.length) {
                    const items = legend.map(it => ({ ...it, w: (it.fill || it.line ? 17 : 0) + it.text.length * 6.6 }));
                    const maxW = Math.max(W - 12, 170), rows = [];
                    let row = [], rw = 0;
                    for (const it of items) {
                        if (row.length && rw + 16 + it.w > maxW) { rows.push({ row, rw }); row = []; rw = 0; }
                        rw += (row.length ? 16 : 0) + it.w; row.push(it);
                    }
                    rows.push({ row, rw });
                    W2 = Math.max(W, ...rows.map(r => r.rw + 12));
                    rows.forEach(({ row: rr, rw: w }, i) => {
                        let x = (W2 - w) / 2;
                        const y = H + 2 + i * 19 + 10;
                        rr.forEach(it => {
                            if (it.fill) { extra += F.rect(x, y - 9.5, 11, 11, { fill: it.fill, width: 0.9 }); x += 17; }
                            else if (it.line) { extra += F.line(x, y - 4, x + 12, y - 4, { stroke: it.line, width: 3 }); x += 17; }
                            extra += F.text(x, y, it.text.replace('?', QM), { anchor: 'start', size: 12 });
                            x += it.text.length * 6.6 + 16;
                        });
                    });
                    LH = rows.length * 19 + 6;
                }
                return F.svg(W2, H + LH, body + extra, { label });
            },
        };
        return b;
    }

    /**
     * The pyramid model.  Triangle ABC with sides [AB, BC, AC]; D on AB and E on AC with AD/AB = t,
     * so DE ∥ BC.  Pass two values of t for two parallels (DE and FG).
     * lab: lengths to write, keyed by segment (AD, DB, AB, AE, EC, AC, DE, BC, DF, FB …); AB and AC get dimension lines.
     */
    const A_REF = { AD: 'C', DB: 'C', DF: 'C', FB: 'C', AE: 'B', EC: 'B', EG: 'B', GC: 'B', DE: 'A', FG: 'A', BC: 'A' };
    function aFig(sides, t, lab = {}, o = {}) {
        const [A, B, C] = corners(sides[0], sides[1], sides[2]);
        const pts = { A, B, C }, ts = [].concat(t);
        ts.forEach((tt, i) => { pts['DF'[i]] = lerp(A, B, tt); pts['EG'[i]] = lerp(A, C, tt); });
        const b = board(pts, { pad: [lab.AB != null ? 56 : 32, 22, lab.AC != null ? 56 : 32, 26], w: o.w || 190, h: o.h || 125 });
        b.poly(['A', 'B', 'C'], { fill: FILL });
        (o.shade || []).forEach(([ns, col]) => b.poly(ns, { fill: col, stroke: 'none' }));
        b.poly(['A', 'B', 'C']);
        ts.forEach((_, i) => b.seg('DF'[i], 'EG'[i]));
        b.pt('A', [0, -1]).pt('B', [-1, 0.5]).pt('C', [1, 0.5]);
        ts.forEach((_, i) => b.ptOn('DF'[i], 'A', 'B', 'C').ptOn('EG'[i], 'A', 'C', 'B'));
        for (const [key, v] of Object.entries(lab)) {
            if (key === 'AB') b.dim('A', 'B', v, 'C');
            else if (key === 'AC') b.dim('A', 'C', v, 'B');
            else b.len(key[0], key[1], v, A_REF[key]);
        }
        return b.done('pyramid model', o.legend);
    }

    /**
     * The hourglass model.  AB ∥ DC; AC and BD cross at O.  sides = [OA, AB, OB] fixes the top
     * triangle and k = DC/AB the bottom one (OC = k·OA, OD = k·OB).  o.trap draws AD and BC too.
     * lab: AB, DC, AO, OC, BO, OD.
     */
    const H_REF = { AB: 'O', DC: 'O', AO: 'B', BO: 'A', OC: 'D', OD: 'C' };
    const H_TRI = { top: ['A', 'O', 'B'], right: ['B', 'O', 'C'], bottom: ['C', 'O', 'D'], left: ['A', 'O', 'D'] };
    function hgFig(sides, k, lab = {}, o = {}) {
        const [OA, AB, OB] = sides;
        const x = (OA * OA + AB * AB - OB * OB) / (2 * AB), y = Math.sqrt(Math.max(0, OA * OA - x * x));
        const A = [0, 0], B = [AB, 0], O = [x, -y], C = lerp(A, O, 1 + k), D = lerp(B, O, 1 + k);
        const b = board({ A, B, C, D, O }, { pad: [30, 24, 30, 26], w: o.w || 180, h: o.h || 125 });
        if (o.trap) b.poly(['A', 'B', 'C', 'D'], { fill: PALE, stroke: 'none' });
        (o.shade || []).forEach(([part, col]) => b.poly(H_TRI[part], { fill: col, stroke: 'none' }));
        b.seg('A', 'B').seg('D', 'C').seg('A', 'C').seg('B', 'D');
        if (o.trap) b.seg('A', 'D').seg('B', 'C');
        b.pt('A', [-1, -0.7]).pt('B', [1, -0.7]).pt('C', [1, 0.7]).pt('D', [-1, 0.7]);
        if (o.trap) b.ptIn('O', 'A', 'D', 'O'); else b.pt('O', [-1, 0], 'O');
        for (const [key, v] of Object.entries(lab)) b.len(key[0], key[1], v, H_REF[key]);
        return b.done('hourglass model', o.legend);
    }

    /** One labelled triangle (for pairs of similar triangles). lab[i] labels side i of [XY, YZ, ZX]. */
    function triFig(sides, names, lab, scale) {
        const [X, Y, Z] = corners(sides[0], sides[1], sides[2]);
        const b = board({ [names[0]]: X, [names[1]]: Y, [names[2]]: Z }, { scale, pad: [28, 22, 28, 24] });
        b.poly(names, { fill: FILL }).pt(names[0], [0, -1]).pt(names[1], [-1, 0.5]).pt(names[2], [1, 0.5]);
        const seg = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
        Object.entries(lab).forEach(([i, v]) => b.len(names[seg[i][0]], names[seg[i][1]], v, names[seg[i][2]]));
        return b.done('triangle');
    }
    function triPair(small, big, labS, labB) {
        const [X, , Z] = corners(big[0], big[1], big[2]);
        const scale = Math.min(140 / (Math.max(Z[0], X[0]) - Math.min(0, X[0])), 105 / X[1]);
        return F.row(triFig(small, ['A', 'B', 'C'], labS, scale), triFig(big, ['P', 'Q', 'R'], labB, scale));
    }

    /** A triangle cut into k² copies of the shaded small triangle at the top. */
    function tileFig(k) {
        const A = [80, 10], B = [12, 118], C = [148, 118];
        let body = F.poly([A, B, C], { fill: FILL }) + F.poly([A, lerp(A, B, 1 / k), lerp(A, C, 1 / k)], { fill: SHADE });
        for (let i = 1; i < k; i++) {
            const pairs = [[lerp(A, B, i / k), lerp(A, C, i / k)], [lerp(B, A, i / k), lerp(B, C, i / k)], [lerp(C, A, i / k), lerp(C, B, i / k)]];
            pairs.forEach(([P, Q]) => { body += F.line(P[0], P[1], Q[0], Q[1], { width: 1 }); });
        }
        return F.svg(160, 126, body + F.poly([A, B, C]), { label: `triangle cut into ${k * k} copies` });
    }

    /**
     * Two pyramids sharing a side: triangle ABC, D on AB and E on AC with DE ∥ BC, F on BC with EF ∥ AB.
     * AD/AB = AE/AC = BF/BC = t.  Regions for shading: ADE, EFC, DBFE.
     */
    const C_REF = { AD: 'C', DB: 'C', AE: 'B', EC: 'B', DE: 'A', BF: 'A', FC: 'A', EF: 'C' };
    function chainTriFig(sides, t, lab = {}, o = {}) {
        const [A, B, C] = corners(sides[0], sides[1], sides[2]);
        const pts = { A, B, C, D: lerp(A, B, t), E: lerp(A, C, t), F: lerp(B, C, t) };
        const b = board(pts, { pad: [lab.AB != null ? 56 : 32, 22, lab.AC != null ? 56 : 32, lab.BC != null ? 52 : 28], w: 190, h: 125 });
        b.poly(['A', 'B', 'C'], { fill: FILL });
        (o.shade || []).forEach(([ns, col]) => b.poly(ns, { fill: col, stroke: 'none' }));
        b.poly(['A', 'B', 'C']).seg('D', 'E').seg('E', 'F');
        b.pt('A', [0, -1]).pt('B', [-1, 0.5]).pt('C', [1, 0.5]).ptOn('D', 'A', 'B', 'C').ptOn('E', 'A', 'C', 'B').pt('F', [0, 1.1]);
        for (const [key, v] of Object.entries(lab)) {
            if (key === 'AB') b.dim('A', 'B', v, 'C');
            else if (key === 'AC') b.dim('A', 'C', v, 'B');
            else if (key === 'BC') b.dim('B', 'C', v, 'A');
            else b.len(key[0], key[1], v, C_REF[key]);
        }
        return b.done('triangle with two parallel lines', o.legend);
    }

    /**
     * Trapezoid ABCD (AB on top, DC at the bottom, AB ∥ DC) with diagonals crossing at O and the
     * line EF through O parallel to AB.  D = (0, 0), A = (s, h).
     */
    const T_REF = { AB: 'D', DC: 'A', AE: 'C', ED: 'C', BF: 'D', FC: 'D', EO: 'D', OF: 'C' };
    function trapFig(a, bb, s, h, lab = {}, o = {}) {
        const D = [0, 0], C = [bb, 0], A = [s, h], B = [s + a, h], k = a / (a + bb);
        const pts = { A, B, C, D, O: lerp(A, C, k), E: lerp(A, D, k), F: lerp(B, C, k) };
        const b = board(pts, { pad: [lab.AD != null ? 56 : 32, 24, lab.BC != null ? 56 : 32, 26], w: 200, h: 112 });
        b.poly(['A', 'B', 'C', 'D'], { fill: PALE });
        (o.shade || []).forEach(([ns, col]) => b.poly(ns, { fill: col, stroke: 'none' }));
        b.poly(['A', 'B', 'C', 'D']).seg('A', 'C').seg('B', 'D');
        if (o.ef !== false) b.seg('E', 'F', o.hlEF ? { stroke: ACCENT, width: 2.6 } : {});
        b.pt('A', [-0.5, -1]).pt('B', [0.5, -1]).pt('C', [1, 0.6]).pt('D', [-1, 0.6]).pt('O', [0, 1.15]);
        if (o.ef !== false) b.pt('E', [-1, 0.1]).pt('F', [1, 0.1]);
        for (const [key, v] of Object.entries(lab)) {
            if (key === 'AD') b.dim('A', 'D', v, 'C');
            else if (key === 'BC') b.dim('B', 'C', v, 'D');
            else b.len(key[0], key[1], v, T_REF[key]);
        }
        return b.done('trapezoid with its diagonals', o.legend);
    }

    /**
     * Parallelogram ABCD (B = (0,0), C on the x-axis, A at the top left) with E on BC.
     * AE crosses the diagonal BD at F and meets DC extended at G.  be, ec: the lengths BE, EC.
     * Regions for shading: BEF, AFD, ABE, CEG, ABF.
     */
    const P_REF = { BE: 'A', EC: 'G', AB: 'C', AF: 'D', FE: 'B', EG: 'C' };
    function pgcFig(be, ec, A, lab = {}, o = {}) {
        const n = be + ec, B = [0, 0], C = [n, 0], E = [be, 0], D = [A[0] + n, A[1]];
        const pts = { A, B, C, D, E, F: lerp(B, D, be / (n + be)), G: [E[0] + (E[0] - A[0]) * ec / be, E[1] + (E[1] - A[1]) * ec / be] };
        const reg = { BEF: ['B', 'E', 'F'], AFD: ['A', 'F', 'D'], ABE: ['A', 'B', 'E'], CEG: ['C', 'E', 'G'], ABF: ['A', 'B', 'F'] };
        const b = board(pts, { pad: [lab.AB != null ? 40 : 32, 22, lab.DG != null ? 58 : 32, 24], w: 190, h: 150 });
        b.poly(['A', 'B', 'C', 'D'], { fill: PALE });
        (o.shade || []).forEach(([name, col]) => b.poly(reg[name], { fill: col, stroke: 'none' }));
        b.poly(['A', 'B', 'C', 'D']).seg('B', 'D').seg('A', 'G').seg('C', 'G', { dash: true, width: 1.2 });
        b.pt('A', [-0.6, -1]).pt('B', [-1, 0.4]).pt('C', [1, -0.1]).pt('D', [0.6, -1]).ptIn('E', 'B', 'G').ptIn('F', 'A', 'D').pt('G', [0, 1.1]);
        for (const [key, v] of Object.entries(lab)) {
            if (key === 'DG') b.dim('D', 'G', v, 'A');
            else b.len(key[0], key[1], v, P_REF[key]);
        }
        return b.done('parallelogram with a line through E', o.legend);
    }

    /** Sun shadows: a short thing (height h1, shadow s1) and a tall thing (H, S), drawn to scale. */
    function sunFig(h1, s1, H, S, lab, names) {
        const rough = Math.min(190 / (s1 + S), 105 / H), gap = s1 + 50 / rough;
        const pts = { a0: [0, 0], a1: [0, h1], a2: [s1, 0], b0: [gap, 0], b1: [gap, H], b2: [gap + S, 0] };
        const b = board(pts, { w: 250, h: 105, pad: [40, 26, 14, 24] });
        b.seg('a0', 'b2', { stroke: GREY, width: 1 })
            .seg('a0', 'a2', { stroke: GREY, width: 4 }).seg('b0', 'b2', { stroke: GREY, width: 4 })
            .seg('a1', 'a2', { dash: true, width: 1 }).seg('b1', 'b2', { dash: true, width: 1 })
            .seg('a0', 'a1', { width: 3.5 }).seg('b0', 'b1', { width: 3.5 })
            .len('a0', 'a1', lab.h1, 'a2').len('a0', 'a2', lab.s1, 'a1').len('b0', 'b1', lab.H, 'b2').len('b0', 'b2', lab.S, 'b1')
            .raw(P => F.text(P('a1')[0], P('a1')[1] - 8, names[0], { size: 11, italic: true }) + F.text(P('b1')[0], P('b1')[1] - 8, names[1], { size: 11, italic: true }));
        return b.done('two shadows');
    }

    /** Lamp post (height H), a person (height h) standing d from it, and the shadow s. */
    function lampFig(H, h, d, s, lab) {
        const pts = { L0: [0, 0], L1: [0, H], P0: [d, 0], P1: [d, h], T: [d + s, 0] };
        const b = board(pts, { w: 215, h: 110, pad: [42, 18, 18, 26] });
        b.seg('L0', 'T', { stroke: GREY, width: 1 }).seg('P0', 'T', { stroke: GREY, width: 4 })
            .seg('L1', 'T', { dash: true, width: 1 })
            .seg('L0', 'L1', { width: 3.5 }).seg('P0', 'P1', { width: 3.5 })
            .raw(P => F.circle(P('L1')[0], P('L1')[1], 5, { fill: LAMP }) + F.circle(P('P1')[0], P('P1')[1] + 4, 4, { fill: PALE }))
            .len('L0', 'L1', lab.H, 'T').len('P0', 'P1', lab.h, 'T').len('L0', 'P0', lab.d, 'L1').len('P0', 'T', lab.s, 'P1');
        return b.done('lamp post, person and shadow');
    }

    /** A square in the right-angled corner of a right triangle with legs a (up) and b (across). */
    function sqRightFig(a, b0, lab) {
        const s = a * b0 / (a + b0);
        const b = board({ C: [0, 0], A: [0, a], B: [b0, 0], S1: [s, 0], S2: [s, s], S3: [0, s] }, { w: 175, h: 125, pad: [34, 20, 26, 24] });
        b.poly(['A', 'C', 'B'], { fill: FILL }).poly(['C', 'S1', 'S2', 'S3'], { fill: WARM })
            .pt('A', [-0.3, -1]).pt('B', [1, 0.3]).pt('C', [-1, 0.8])
            .len('C', 'A', lab.a, 'B').len('C', 'B', lab.b, 'A');
        if (lab.s) b.len('S1', 'S2', lab.s, 'C');
        return b.done('square in a right triangle');
    }
    /** A square standing on the base of a triangle with base b0 and height h. */
    function sqTriFig(b0, h, lab, lean = 0.4) {
        const s = b0 * h / (b0 + h), ax = lean * b0, xl = ax * s / h;
        const b = board({ B: [0, 0], C: [b0, 0], A: [ax, h], S0: [xl, 0], S1: [xl + s, 0], S2: [xl + s, s], S3: [xl, s] }, { w: 175, h: 120, pad: [26, 20, 56, 24] });
        b.poly(['A', 'B', 'C'], { fill: FILL }).poly(['S0', 'S1', 'S2', 'S3'], { fill: WARM })
            .pt('A', [0, -1]).pt('B', [-1, 0.5]).pt('C', [1, 0.5]).len('B', 'C', lab.b, 'A')
            .raw(P => {
                const top = P('A'), base = P('C'), x = base[0] + 22;
                return F.line(top[0] + 6, top[1], x + 4, top[1], { stroke: GREY, width: 0.9, dash: '3 3' })
                    + F.line(x, top[1], x, base[1], { stroke: GREY, width: 0.9 }) + F.line(x - 4, base[1], x + 4, base[1], { stroke: GREY, width: 0.9 })
                    + F.text(x + 6, (top[1] + base[1]) / 2 + 4.5, lab.h, { anchor: 'start', size: 12.5 });
            });
        if (lab.s) b.len('S1', 'S2', lab.s, 'S0');
        return b.done('square in a triangle');
    }

    // ── Number choices and text ──────────────────────────────────────────
    /** AD : DB = p : q, so that AD/AB stays between 1/3 and 2/3 (figures stay readable). */
    const PQ = [[1, 2], [2, 1], [2, 3], [3, 2], [3, 4], [4, 3], [3, 5], [5, 3], [4, 5], [5, 4]];
    /** AB : DC = a : b in an hourglass (between 1 : 2 and 2 : 1). */
    const HG = [[1, 2], [2, 1], [2, 3], [3, 2], [3, 4], [4, 3], [3, 5], [5, 3], [4, 5], [5, 4]];
    /** TeX for a/b, followed by its lowest terms when that looks different. */
    const fr = (a, b) => { const raw = R`\frac{${a}}{${b}}`, low = T.frac(a, b); return raw === low ? raw : `${raw}=${low}`; };
    /** TeX for a ratio, followed by its simplest form when that looks different. */
    const rat = xs => { const g = xs.reduce((a, b) => CA.gcd(a, b)); return xs.join(':') + (g > 1 ? '=' + xs.map(x => x / g).join(':') : ''); };
    const cap = s => s[0].toUpperCase() + s.slice(1);
    const parts = k => `${k} ${k === 1 ? 'part' : 'parts'}`;
    const tenth = x => String(x / 10);      // lengths kept as whole tenths of a metre
    const PYR = 'In the figure, D is on AB and E is on AC, and DE is parallel to BC.';
    const HGS = 'In the figure, AB is parallel to DC, and AC and BD cross at O.';
    const TRAP = 'ABCD is a trapezoid with AB parallel to DC. Its diagonals AC and BD cross at O.';
    const TWO = 'In triangle ABC, D is on AB, E is on AC and F is on BC. DE is parallel to BC and EF is parallel to AB.';
    const TRO = 'ABCD is a trapezoid with AB parallel to DC. Its diagonals AC and BD cross at O, and the line through O parallel to AB meets AD at E and BC at F.';
    const PGC = 'ABCD is a parallelogram and E is on BC. The line AE crosses the diagonal BD at F and meets DC extended at G.';
    const S1P = 'Step 1: \\(DE\\parallel BC\\), so triangles ADE and ABC form a pyramid.';
    const S1H = 'Step 1: \\(AB\\parallel DC\\), so triangles OAB and OCD form an hourglass (A matches C, B matches D).';

    // ── Fixed numbers for the tutorial and examples (answers computed, never typed) ──
    const E1 = { AD: 4, DB: 6, DE: 6 }; E1.AB = E1.AD + E1.DB; E1.BC = E1.DE * E1.AB / E1.AD;
    const E2 = { AB: 8, DC: 12, AC: 20 }; E2.AO = E2.AC * E2.AB / (E2.AB + E2.DC); E2.OC = E2.AC - E2.AO;
    const E3 = { AD: 4, DB: 6, S: 8 }; E3.AB = E3.AD + E3.DB; E3.ABC = E3.S * E3.AB ** 2 / E3.AD ** 2;
    const E4 = { AB: 4, DC: 6, top: 8 }; E4.part = E4.top / 4; E4.side = 6 * E4.part; E4.bottom = 9 * E4.part; E4.all = 25 * E4.part;
    const E5 = { AD: 6, DB: 3, S: 45 }; E5.AB = E5.AD + E5.DB; E5.ADE = E5.S * E5.AD ** 2 / E5.AB ** 2; E5.EFC = E5.S * E5.DB ** 2 / E5.AB ** 2; E5.par = E5.S - E5.ADE - E5.EFC;
    const E6 = { AB: 6, DC: 12 }; E6.EO = E6.DC * E6.AB / (E6.AB + E6.DC); E6.EF = 2 * E6.EO;
    const E7 = { BE: 6, EC: 3 }; E7.BC = E7.BE + E7.EC;
    E7.AF = E7.BC * E7.BE; E7.FE = E7.BE * E7.BE; E7.EG = (E7.AF + E7.FE) * E7.EC / E7.BE;     // AF : FE = BC : BE, then AE : EG = BE : EC
    E7.g = [E7.AF, E7.FE, E7.EG].reduce((a, b) => CA.gcd(a, b)); E7.r = [E7.AF, E7.FE, E7.EG].map(x => x / E7.g);
    const E8 = { H: 6, h: 1.5, d: 6 }; E8.k = E8.H / E8.h; E8.s = E8.d / (E8.k - 1);
    const E9 = { a: 6, b: 12 }; E9.s = E9.a * E9.b / (E9.a + E9.b);
    const TT = { AB: 6, DC: 9, AC: 15 }; TT.AO = TT.AC * TT.AB / (TT.AB + TT.DC); TT.OC = TT.AC - TT.AO;
    const W6 = { AD: 6, DB: 4, BC: 15 }; W6.AB = W6.AD + W6.DB; W6.FC = W6.BC * W6.DB / W6.AB;

    CA.register({
        id: 17,

        tutorial: [
            {
                h: 'Feature 1: corresponding sides are in the same ratio',
                html: R`
                <p>Enlarge a photo and everything in it gets bigger by the same factor: the shape does not change,
                   only the size. Two figures with the same shape are called <strong>similar</strong>.</p>
                ${triPair([4, 6, 5], [6, 9, 7.5], { 0: 4, 1: 6, 2: 5 }, { 0: 6, 1: 9, 2: 7.5 })}
                <p>Triangle PQR above is triangle ABC enlarged. Compare the sides that match
                   (<strong>corresponding sides</strong>):</p>
                <div class="ca-formula">\[ \frac{PQ}{AB}=\frac{6}{4}=\frac32, \qquad \frac{QR}{BC}=\frac{9}{6}=\frac32, \qquad \frac{RP}{CA}=\frac{7.5}{5}=\frac32 \]</div>
                <p>The three ratios are equal. That common ratio is the <strong>scale factor</strong> \(k\). Here
                   \(k=\frac32\): every length in the big triangle is \(\frac32\) of the matching length in the small one.</p>
                <div class="ca-key"><strong>Feature 1.</strong> In similar triangles, the ratios of the corresponding
                   sides are equal. Similar triangles also have equal angles — and two pairs of equal angles are
                   already enough to make two triangles similar.</div>
                <div class="ca-tip"><strong>Match the corners first.</strong> Write the triangles with matching
                   corners in the same order — ABC and PQR — and the matching sides can be read straight off:
                   AB with PQ, BC with QR, CA with RP.</div>`,
            },
            {
                h: 'Feature 2: areas go by the square of the ratio',
                html: R`
                <p>If every side of a triangle is multiplied by \(k\), its perimeter — a sum of sides — is
                   multiplied by \(k\) too. Area is different. Double every side of a triangle and four copies of the
                   old triangle fit inside the new one; triple every side and nine copies fit.</p>
                ${F.row(F.cap(tileFig(2), 'sides × 2: area × 4'), F.cap(tileFig(3), 'sides × 3: area × 9'))}
                <p>The reason: area is <em>base × height ÷ 2</em>, and the base and the height are <em>both</em>
                   multiplied by \(k\). So the area is multiplied by \(k\times k=k^2\).</p>
                <div class="ca-formula">\[ \frac{\text{perimeter}_2}{\text{perimeter}_1}=k \qquad\qquad \frac{\text{area}_2}{\text{area}_1}=k^2 \]</div>
                <div class="ca-key"><strong>Feature 2.</strong> For similar triangles, the ratio of the areas equals the
                   square of the ratio of corresponding sides. Sides \(2:3\) mean areas \(4:9\).</div>
                <div class="ca-warn"><strong>Going backwards needs a square root.</strong> If two similar triangles
                   have areas in the ratio \(4:9\), their sides are in the ratio \(\sqrt4:\sqrt9=2:3\) —
                   <strong>not</strong> \(4:9\).</div>`,
            },
            {
                h: 'Model 1: the pyramid model',
                html: R`
                <p>Competition problems rarely hand you two similar triangles side by side. The similar triangles
                   are hidden inside one figure, in one of two shapes. The first is made by <strong>one line parallel
                   to a side</strong> of a triangle. In triangle ABC draw DE parallel to BC, with D on AB and E on AC.
                   The small triangle sits on top of the big one like the tip of a pyramid (it also looks like a
                   letter A).</p>
                ${F.row(aFig([10, 12, 11], 0.45, {}, { shade: [[['A', 'D', 'E'], SHADE]] }))}
                <p>Because \(DE\parallel BC\), the angle at D equals the angle at B and the angle at E equals the angle at C
                   (corresponding angles). Both triangles share the angle at A. So the small triangle ADE is similar
                   to the whole triangle ABC, with D matching B and E matching C:</p>
                <div class="ca-formula">\[ \frac{AD}{AB}=\frac{AE}{AC}=\frac{DE}{BC} \]</div>
                <div class="ca-warn"><strong>The classic trap.</strong> The ratio for DE and BC uses the
                   <em>whole</em> side AB, not the piece DB. If AD = 4 and DB = 6, then
                   \(\frac{DE}{BC}=\frac{AD}{AB}=\frac{4}{10}\) — <strong>not</strong> \(\frac46\). Always add the
                   pieces first.</div>
                <div class="ca-tip"><strong>Pieces go with pieces.</strong> The parallel line also cuts the two
                   sides in the same ratio: \(\frac{AD}{DB}=\frac{AE}{EC}\). That is fine — it compares pieces of
                   one side with pieces of the other. Just never mix DB with DE or BC.</div>
                <p><strong>Midpoints.</strong> If D and E are the <em>midpoints</em> of AB and AC, then DE is parallel
                   to BC and the ratio is \(\frac12\): DE is exactly half as long as BC.</p>`,
            },
            {
                h: 'Model 2: the hourglass model',
                html: R`
                <p>In the second model the two triangles are on <em>opposite</em> sides of a crossing point. Let AB be
                   parallel to DC, and let AC and BD cross at O. The picture looks like an hourglass.</p>
                ${F.row(hgFig([5, 6, 5.5], 1.5, {}, { shade: [['top', SHADE], ['bottom', WARM]] }))}
                <p>The angles at O are equal (vertically opposite). Because \(AB\parallel DC\), the angle at A equals the angle
                   at C and the angle at B equals the angle at D (alternate angles). So triangle OAB is similar to
                   triangle OCD, with A matching C and B matching D:</p>
                <div class="ca-formula">\[ \frac{AO}{OC}=\frac{BO}{OD}=\frac{AB}{DC} \]</div>
                <div class="ca-key"><strong>Key idea.</strong> In the hourglass, matching corners are at
                   <em>opposite ends of the same crossing line</em>: A and C are on one line through O, B and D on
                   the other. Each crossing line is cut at O in the ratio of the parallel sides.</div>
                <p>So if AB = 6 and DC = 9, then O cuts both AC and BD in the ratio \(6:9=2:3\). If the whole
                   of AC is 20, then \(AO=20\times\frac25=8\) and \(OC=20\times\frac35=12\).</p>
                <div class="ca-tip"><strong>Which model is it?</strong> Find the pair of parallel lines. Two lines that
                   meet <em>outside</em> the parallels (at the tip) give a pyramid; two lines that cross
                   <em>between</em> the parallels give an hourglass.</div>`,
            },
            {
                h: 'Key steps 1 and 2: the parallel lines, then one ratio',
                html: R`
                <p>Every question on similarity models can be attacked with the same three steps.</p>
                <div class="ca-key"><ol>
                    <li><strong>Step 1: focus on the pair of parallel lines.</strong> The pyramid model and the hourglass
                        model cannot live without them! Find them first, then decide which model they make.</li>
                    <li><strong>Step 2: find the ratio of at least one pair of corresponding sides.</strong> One known
                        ratio unlocks every other length in the model.</li>
                    <li><strong>Step 3: observe the connection between corresponding sides across different
                        models</strong> (next section).</li>
                </ol></div>
                <p><strong>Step 1 — where the parallel lines hide.</strong> Sometimes the question says "DE is parallel
                   to BC". Often it does not: the two bases of a <strong>trapezoid</strong> are parallel, both pairs of
                   opposite sides of a <strong>parallelogram</strong>, rectangle or square are parallel, and the sun’s
                   rays are parallel.</p>
                ${F.row(hgFig(fitHg(TT.AO, TT.AB, null), TT.DC / TT.AB, { AB: TT.AB, DC: TT.DC, AO: '?' }, { trap: true, legend: [{ text: `AC = ${TT.AC} cm` }] }))}
                <p>Here ABCD is a trapezoid with AB = ${TT.AB}, DC = ${TT.DC} and diagonal AC = ${TT.AC}. Find AO.</p>
                <ul>
                    <li><strong>Step 1.</strong> No line is called "parallel", but \(AB\parallel DC\) because they are the bases of
                        the trapezoid. The diagonals cross between them: an hourglass, triangles OAB and OCD.</li>
                    <li><strong>Step 2.</strong> One pair of corresponding sides is known: \(AB:DC=${rat([TT.AB, TT.DC])}\).
                        So \(AO:OC=${CA.reduce(TT.AB, TT.DC).join(':')}\), and \(AO=${TT.AC}\times${T.frac(TT.AB, TT.AB + TT.DC)}=${TT.AO}\).</li>
                </ul>
                <div class="ca-tip"><strong>Step 2 from areas.</strong> If you know the areas of two similar triangles
                   instead of two sides, take square roots: areas \(9:25\) give sides \(3:5\).</div>`,
            },
            {
                h: 'Key step 3: chain two models through a shared side',
                html: R`
                <p>In harder problems one model is not enough. The ratio you find in the first model lands on a side
                   that also belongs to a <strong>second</strong> model. That shared side is the bridge: carry the
                   ratio across it and finish the job in the second model.</p>
                ${F.row(chainTriFig(fitPyr(W6.AB, W6.BC, null), W6.AD / W6.AB, { AD: W6.AD, DB: W6.DB, BC: W6.BC, FC: '?' }, { shade: [[['A', 'D', 'E'], SHADE], [['E', 'F', 'C'], WARM]] }))}
                <p>In triangle ABC, \(DE\parallel BC\) and \(EF\parallel AB\), with AD = ${W6.AD}, DB = ${W6.DB} and BC = ${W6.BC}. Find FC.</p>
                <ul>
                    <li><strong>Step 1.</strong> Two pairs of parallel lines, so two pyramids: \(DE\parallel BC\) gives triangle
                        ADE inside ABC (tip A), and \(EF\parallel AB\) gives triangle EFC inside ABC (tip C, E matching A, F matching B).</li>
                    <li><strong>Step 2.</strong> In the first pyramid \(AD:DB=${rat([W6.AD, W6.DB])}\), so E cuts AC in the
                        same ratio: \(AE:EC=${CA.reduce(W6.AD, W6.DB).join(':')}\).</li>
                    <li><strong>Step 3.</strong> AC belongs to both pyramids. In the second one the matching sides are
                        EC and AC: \(\frac{FC}{BC}=\frac{EC}{AC}=${T.frac(W6.DB, W6.AB)}\), so
                        \(FC=${W6.BC}\times${T.frac(W6.DB, W6.AB)}=${W6.FC}\).</li>
                </ul>
                <p>Two more bridges appear again and again:</p>
                ${F.row(F.cap(trapFig(6, 12, 2.6, 6.2), 'Trapezoid: hourglass + pyramids'), F.cap(pgcFig(2, 1, [0.8, 2.1]), 'Parallelogram: two hourglasses'))}
                <ul>
                    <li><strong>Trapezoid.</strong> The diagonals make an hourglass, so \(AO:OC=AB:DC\). The diagonal AC
                        is also a side of the pyramid ADC cut by \(EO\parallel DC\) — so the hourglass ratio tells you
                        \(\frac{EO}{DC}=\frac{AO}{AC}\). A pyramid and an hourglass share a side.</li>
                    <li><strong>Parallelogram.</strong> \(BE\parallel AD\) gives the hourglass BEF and DAF; \(AB\parallel CG\) gives the
                        hourglass EBA and ECG. Both lie on the line AG, so AE is the bridge between them.</li>
                </ul>
                <div class="ca-tip"><strong>Write the shared side in parts.</strong> Turn the first ratio into
                   "parts" of the shared side (AE is 3 parts, EC is 2 parts, AC is 5 parts). The second model then
                   reads the parts it needs.</div>`,
            },
            {
                h: 'Areas in the hourglass: the butterfly',
                html: R`
                <p>Draw both diagonals of a trapezoid ABCD (\(AB\parallel DC\)). They make an hourglass — and they cut the
                   trapezoid into four triangles whose areas follow a beautiful pattern. Suppose AB = \(a\) and
                   DC = \(b\).</p>
                ${F.row(hgFig([5, 6, 5.5], 1.5, { AB: 'a', DC: 'b' }, { trap: true, shade: [['left', SHADE], ['right', SHADE]], legend: [{ text: 'AOB : BOC : AOD : COD = a² : ab : ab : b²' }] }))}
                <ul>
                    <li><strong>Top and bottom</strong> (AOB and COD) are similar with sides \(a:b\), so their areas
                        are in the ratio \(a^2:b^2\) (Feature 2).</li>
                    <li><strong>Top and side</strong> (AOB and BOC) both have their bases on AC and share the corner B,
                        so they have the same height. Their bases are AO and OC, in the ratio \(a:b\). So their
                        areas are in the ratio \(a:b\), which is \(a^2:ab\).</li>
                    <li>The same argument works for the other side, AOD.</li>
                </ul>
                <div class="ca-formula">\[ \text{AOB} : \text{BOC} : \text{AOD} : \text{COD} \;=\; a^2 : ab : ab : b^2 \]</div>
                <div class="ca-key"><strong>Two facts worth remembering.</strong> The two side triangles (the
                   butterfly’s wings) always have <em>equal</em> areas. And the whole trapezoid is
                   \(a^2+2ab+b^2=(a+b)^2\) parts.</div>`,
            },
            {
                h: 'More uses: shadows and heights',
                html: R`
                <p>Similar triangles let you measure things you cannot reach. The sun is so far away that its rays
                   are parallel (Step 1!), so at the same moment every upright object and its shadow make triangles of the
                   same shape:</p>
                <div class="ca-formula">\[ \frac{\text{height of tree}}{\text{shadow of tree}}=\frac{\text{height of stick}}{\text{shadow of stick}} \]</div>
                ${F.row(sunFig(2, 3, 6, 9, { h1: '2 m', s1: '3 m', H: '?', S: '9 m' }, ['stick', 'tree']))}
                <p>A 2 m stick casts a 3 m shadow while a tree casts a 9 m shadow. The tree’s shadow is 3 times as
                   long, so the tree is 3 times as tall: 6 m.</p>
                <p>A <strong>street lamp</strong> is different: the light comes from one point, so the picture is a
                   pyramid. The person stands upright, parallel to the lamp post.</p>
                ${F.row(lampFig(6, 1.5, 6, 2, { H: 'H', h: 'h', d: 'd', s: 's' }))}
                <div class="ca-formula">\[ \frac{h}{H}=\frac{s}{s+d} \]</div>
                <div class="ca-warn"><strong>The trap again.</strong> The big triangle’s base is the
                   <em>whole</em> distance from the lamp post to the tip of the shadow, \(s+d\) — not just \(d\).</div>`,
            },
            {
                h: 'More uses: a square inside a triangle',
                html: R`
                <p>A favourite contest problem: fit a square into the corner of a right triangle with legs
                   \(a\) and \(b\), so that one corner of the square lies on the hypotenuse. How big is the square?</p>
                ${F.row(sqRightFig(6, 12, { a: 'a', b: 'b', s: 'x' }), sqTriFig(12, 8, { b: 'b', h: 'h', s: 'x' }))}
                <p>Call the side of the square \(x\). The top of the square is parallel to the base (Step 1), so the
                   little triangle above the square and the whole triangle form a pyramid. Its legs are \(a-x\) and \(x\):</p>
                <div class="ca-formula">\[ \frac{a-x}{a}=\frac{x}{b} \quad\Longrightarrow\quad x=\frac{ab}{a+b} \]</div>
                <p>The second figure shows a square standing on the base of any triangle with base \(b\) and
                   height \(h\). The triangle above the square has base \(x\) and height \(h-x\), and it is similar
                   to the whole triangle — heights scale just like sides:</p>
                <div class="ca-formula">\[ \frac{x}{b}=\frac{h-x}{h} \quad\Longrightarrow\quad x=\frac{bh}{b+h} \]</div>
                <div class="ca-tip"><strong>Do not memorise — rebuild.</strong> Name the unknown \(x\), find the
                   parallel lines and the small triangle they cut off, and write one equation of ratios.</div>`,
            },
        ],

        // Mirrors the textbook's own summary page for this lesson.
        summary: [
            {
                topic: 'Features of similarity models',
                points: [
                    R`In similar triangles, the ratios of the corresponding sides are equal: \(\frac{AD}{AB}=\frac{AE}{AC}=\frac{DE}{BC}\).`,
                    R`For similar triangles, the ratio of areas equals the square of the ratio of corresponding sides: sides \(2:3\) give areas \(4:9\).`,
                ],
            },
            {
                topic: 'Two types of similarity models',
                points: [
                    R`<strong>Pyramid model</strong>: a line parallel to one side cuts a small triangle off the tip; use the <em>whole</em> side, \(\frac{AD}{AB}\), not \(\frac{AD}{DB}\).`,
                    R`<strong>Hourglass model</strong>: two lines cross between two parallel lines; \(\frac{AO}{OC}=\frac{BO}{OD}=\frac{AB}{DC}\).`,
                ],
            },
            {
                topic: 'Key steps of questions on similarity models',
                points: [
                    'Step 1: focus on the pair of parallel lines. The pyramid model and the hourglass model cannot live without those parallel lines!',
                    'Step 2: find the ratio of at least one pair of corresponding sides.',
                    'Step 3: observe the connection between corresponding sides across different models — a shared side carries the ratio from one model to the next.',
                ],
            },
        ],

        examples: [
            {
                title: 'The pyramid model, and its trap',
                q: `${PYR} AD = ${E1.AD} cm, DB = ${E1.DB} cm and DE = ${E1.DE} cm. Find BC.`,
                fig: aFig(fitPyr(E1.AB, E1.BC, null), E1.AD / E1.AB, { AD: E1.AD, DB: E1.DB, DE: E1.DE, BC: '?' }),
                steps: [
                    '<em>Parallel lines:</em> \\(DE\\parallel BC\\), so triangle ADE and triangle ABC form a pyramid.',
                    R`<em>One ratio:</em> the side that matches AD is the <em>whole</em> side AB: \(AB=${E1.AD}+${E1.DB}=${E1.AB}\), so \(\frac{AD}{AB}=${fr(E1.AD, E1.AB)}\).`,
                    R`DE and BC are corresponding sides, so \(\frac{DE}{BC}=${T.frac(E1.AD, E1.AB)}\) too.`,
                    R`\(BC=${E1.DE}\div${T.frac(E1.AD, E1.AB)}=${E1.BC}\).`,
                ],
                answer: R`BC = ${E1.BC} cm (not ${E1.DE * E1.DB / E1.AD} cm, which is what the wrong ratio \(\frac{AD}{DB}\) would give)`,
            },
            {
                title: 'The hourglass model cuts a diagonal',
                q: `${HGS} AB = ${E2.AB} cm, DC = ${E2.DC} cm and the whole of AC is ${E2.AC} cm. Find AO and OC.`,
                fig: hgFig(fitHg(E2.AO, E2.AB, null), E2.DC / E2.AB, { AB: E2.AB, DC: E2.DC, AO: '?', OC: '?' }, { legend: [{ text: `AC = ${E2.AC} cm` }] }),
                steps: [
                    '<em>Parallel lines:</em> \\(AB\\parallel DC\\) and AC, BD cross between them, so triangles OAB and OCD form an hourglass (A matches C, B matches D).',
                    R`<em>One ratio:</em> \(\frac{AO}{OC}=\frac{AB}{DC}=${fr(E2.AB, E2.DC)}\). So O cuts AC into ${CA.reduce(E2.AB, E2.DC).join(' parts and ')} parts — ${CA.reduce(E2.AB, E2.DC).reduce((a, b) => a + b)} parts in all.`,
                    R`One part is \(${E2.AC}\div${CA.reduce(E2.AB, E2.DC).reduce((a, b) => a + b)}=${E2.AC / CA.reduce(E2.AB, E2.DC).reduce((a, b) => a + b)}\) cm.`,
                    R`\(AO=${E2.AO}\) cm and \(OC=${E2.OC}\) cm.`,
                ],
                answer: `AO = ${E2.AO} cm, OC = ${E2.OC} cm`,
            },
            {
                title: 'Areas in a pyramid',
                q: `${PYR} AD = ${E3.AD} cm and DB = ${E3.DB} cm. The area of triangle ADE is ${E3.S} cm². Find the area of the trapezoid DBCE.`,
                fig: aFig(fitPyr(E3.AB, null, null), E3.AD / E3.AB, { AD: E3.AD, DB: E3.DB }, { shade: [[['A', 'D', 'E'], SHADE], [['D', 'B', 'C', 'E'], WARM]], legend: [{ fill: SHADE, text: `ADE: ${E3.S} cm²` }, { fill: WARM, text: 'DBCE: ?' }] }),
                steps: [
                    '<em>Parallel lines:</em> \\(DE\\parallel BC\\), so triangles ADE and ABC form a pyramid.',
                    R`<em>One ratio:</em> \(\frac{AB}{AD}=${fr(E3.AB, E3.AD)}\) (whole side AB!).`,
                    R`Areas go by the <em>square</em>: \(\left(${T.frac(E3.AB, E3.AD)}\right)^2=${T.frac(E3.AB ** 2, E3.AD ** 2)}\), so ABC \(=${E3.S}\times${T.frac(E3.AB ** 2, E3.AD ** 2)}=${E3.ABC}\) cm².`,
                    R`The trapezoid is what is left: \(${E3.ABC}-${E3.S}=${E3.ABC - E3.S}\) cm².`,
                ],
                answer: `${E3.ABC - E3.S} cm²`,
            },
            {
                title: 'The butterfly',
                q: `${TRAP} AB = ${E4.AB} cm, DC = ${E4.DC} cm, and the area of triangle AOB is ${E4.top} cm². Find the area of the trapezoid.`,
                fig: hgFig([4.6, 5.5, 5], E4.DC / E4.AB, { AB: E4.AB, DC: E4.DC }, { trap: true, shade: [['top', SHADE]], legend: [{ fill: SHADE, text: `AOB: ${E4.top} cm²` }, { text: 'ABCD: ?' }] }),
                steps: [
                    '<em>Parallel lines:</em> \\(AB\\parallel DC\\) (the bases of the trapezoid), and the diagonals cross between them: an hourglass.',
                    R`<em>One ratio:</em> \(AB:DC=${rat([E4.AB, E4.DC])}\), so the four triangles are in the ratio \(2^2 : 2\times3 : 2\times3 : 3^2 = 4:6:6:9\).`,
                    R`The top triangle AOB is 4 parts and has area ${E4.top} cm², so one part is \(${E4.top}\div4=${E4.part}\) cm².`,
                    R`The trapezoid is \(4+6+6+9=25\) parts: \(25\times${E4.part}=${E4.all}\) cm².`,
                ],
                answer: `${E4.all} cm²`,
            },
            {
                title: '<em>Across models:</em> two pyramids share a side',
                q: `${TWO} AD = ${E5.AD} cm and DB = ${E5.DB} cm. The area of triangle ABC is ${E5.S} cm². Find the area of the parallelogram DBFE.`,
                fig: chainTriFig(fitPyr(E5.AB, null, null), E5.AD / E5.AB, { AD: E5.AD, DB: E5.DB }, { shade: [[['D', 'B', 'F', 'E'], WARM]], legend: [{ text: `ABC: ${E5.S} cm²` }, { fill: WARM, text: 'DBFE: ?' }] }),
                steps: [
                    '<em>Parallel lines:</em> \\(DE\\parallel BC\\) gives the pyramid ADE inside ABC; \\(EF\\parallel AB\\) gives the pyramid EFC inside ABC (E matches A).',
                    R`<em>One ratio:</em> \(\frac{AD}{AB}=${fr(E5.AD, E5.AB)}\), so the area of ADE is \(${E5.S}\times\left(${T.frac(E5.AD, E5.AB)}\right)^2=${E5.ADE}\) cm².`,
                    R`<em>Across models:</em> AC is shared. DE cuts it like AB, \(AE:EC=${rat([E5.AD, E5.DB])}\), so \(\frac{EC}{AC}=${T.frac(E5.DB, E5.AB)}\) and EFC is \(${E5.S}\times\left(${T.frac(E5.DB, E5.AB)}\right)^2=${E5.EFC}\) cm².`,
                    R`The parallelogram is the rest: \(${E5.S}-${E5.ADE}-${E5.EFC}=${E5.par}\) cm².`,
                ],
                answer: `${E5.par} cm²`,
            },
            {
                title: '<em>Across models:</em> an hourglass and a pyramid in a trapezoid',
                q: `${TRO} AB = ${E6.AB} cm and DC = ${E6.DC} cm. Find the length of EF.`,
                fig: trapFig(E6.AB, E6.DC, 2.6, 6.2, { AB: E6.AB, DC: E6.DC }, { hlEF: true, legend: [{ line: ACCENT, text: 'EF = ?' }] }),
                steps: [
                    '<em>Parallel lines:</em> \\(AB\\parallel DC\\) gives the hourglass AOB and COD; \\(EO\\parallel DC\\) gives the pyramid AEO inside ADC, and \\(OF\\parallel DC\\) the pyramid BOF inside BDC.',
                    R`<em>One ratio:</em> \(AO:OC=AB:DC=${rat([E6.AB, E6.DC])}\), so \(AO:AC=1:3\). In the same way \(BO:BD=1:3\).`,
                    R`<em>Across models:</em> AC is shared by the hourglass and the pyramid ADC: \(\frac{EO}{DC}=\frac{AO}{AC}=\frac13\), so \(EO=${E6.DC}\times\frac13=${E6.EO}\). BD is shared with the pyramid BDC, so \(OF=${E6.EO}\) as well.`,
                    R`\(EF=${E6.EO}+${E6.EO}=${E6.EF}\) cm.`,
                ],
                answer: `${E6.EF} cm`,
            },
            {
                title: '<em>Across models:</em> two hourglasses in a parallelogram',
                q: `${PGC} BE = ${E7.BE} cm and EC = ${E7.EC} cm. Find the ratio AF : FE : EG in simplest form.`,
                fig: pgcFig(E7.BE, E7.EC, [2.6, 6.4], { BE: E7.BE, EC: E7.EC }),
                steps: [
                    '<em>Parallel lines:</em> \\(BE\\parallel AD\\) gives the hourglass BEF and DAF; \\(AB\\parallel CG\\) (DC extended) gives the hourglass EBA and ECG.',
                    R`<em>One ratio:</em> AD = BC = ${E7.BC}, so \(AF:FE=AD:BE=${rat([E7.BC, E7.BE])}\): AE is ${(E7.BC + E7.BE) / CA.gcd(E7.BC, E7.BE)} parts.`,
                    R`<em>Across models:</em> AE is shared with the second hourglass, where \(AE:EG=BE:EC=${rat([E7.BE, E7.EC])}\). So EG is \(${T.frac(E7.EC, E7.BE)}\) of AE: \(${(E7.BC + E7.BE) / CA.gcd(E7.BC, E7.BE)}\times${T.frac(E7.EC, E7.BE)}=${T.frac((E7.BC + E7.BE) / CA.gcd(E7.BC, E7.BE) * E7.EC, E7.BE)}\) parts, and \(AF:FE:EG=${E7.BC / CA.gcd(E7.BC, E7.BE)}:${E7.BE / CA.gcd(E7.BC, E7.BE)}:${T.frac((E7.BC + E7.BE) / CA.gcd(E7.BC, E7.BE) * E7.EC, E7.BE)}\).`,
                    R`Multiply by 2 to clear the fraction: \(AF:FE:EG=${E7.r.join(':')}\).`,
                ],
                answer: R`\(${E7.r.join(':')}\)`,
            },
            {
                title: 'Shadow under a street lamp',
                q: `A street lamp is ${E8.H} m high. Mia, who is ${E8.h} m tall, stands ${E8.d} m from the foot of the lamp post. How long is her shadow?`,
                fig: lampFig(E8.H, E8.h, E8.d, E8.s, { H: `${E8.H} m`, h: `${E8.h} m`, d: `${E8.d} m`, s: '?' }),
                steps: [
                    '<em>Parallel lines:</em> Mia is parallel to the lamp post, so the small triangle (Mia and her shadow) and the big triangle (the lamp post and the ground up to the tip of the shadow) form a pyramid.',
                    R`<em>One ratio:</em> the ratio is \(\frac{${E8.H}}{${E8.h}}=${E8.k}\): the big base is ${E8.k} times the shadow.`,
                    R`Call the shadow \(s\). The big base is \(s+${E8.d}\), so \(s+${E8.d}=${E8.k}s\), which gives \(${E8.k - 1}s=${E8.d}\).`,
                    R`\(s=${E8.d}\div${E8.k - 1}=${E8.s}\).`,
                ],
                answer: `${E8.s} m`,
            },
            {
                title: 'A square in a right triangle',
                q: `Triangle ABC has a right angle at C, with AC = ${E9.a} cm and BC = ${E9.b} cm. A square is drawn with one corner at C, two sides along the legs and the opposite corner on AB. Find the side of the square.`,
                fig: sqRightFig(E9.a, E9.b, { a: E9.a, b: E9.b, s: '?' }),
                steps: [
                    R`<em>Parallel lines:</em> let the side of the square be \(x\). The top side of the square is parallel to CB, so the small triangle above the square and triangle ABC form a pyramid.`,
                    R`<em>One ratio:</em> the small triangle has legs \(${E9.a}-x\) and \(x\); ABC has legs ${E9.a} and ${E9.b}. So \(\frac{${E9.a}-x}{${E9.a}}=\frac{x}{${E9.b}}\).`,
                    R`Multiply both sides by ${CA.lcm(E9.a, E9.b)}: \(${CA.lcm(E9.a, E9.b) / E9.a}(${E9.a}-x)=${CA.lcm(E9.a, E9.b) / E9.b}x\).`,
                    R`\(${CA.lcm(E9.a, E9.b)}=${CA.lcm(E9.a, E9.b) / E9.a + CA.lcm(E9.a, E9.b) / E9.b}x\), so \(x=${E9.s}\). (Check with the formula: \(\frac{${E9.a}\times${E9.b}}{${E9.a}+${E9.b}}=${E9.s}\).)`,
                ],
                answer: `${E9.s} cm`,
            },
        ],

        practice: [
            {
                id: 'corresponding', name: 'Corresponding sides in the two models', level: 1,
                gen(rng) {
                    const v = rng.int(0, 3);
                    const fx = s => { const [x, y] = s.split('/'); return m(R`\frac{${x}}{${y}}`); };
                    if (v <= 1) {
                        const pyr = v === 0;
                        const classes = pyr ? [['AD/AB', 'AE/AC', 'DE/BC'], ['DB/AB', 'EC/AC'], ['AD/DB', 'AE/EC']]
                            : [['AO/OC', 'BO/OD', 'AB/DC'], ['AO/AC', 'BO/BD'], ['OC/AC', 'OD/BD']];
                        const traps = pyr ? ['DE/DB', 'AD/EC', 'AE/AB', 'DB/DE', 'AB/AD'] : ['AO/OD', 'BO/OC', 'OC/AO', 'AB/AC', 'DC/AB'];
                        const ci = rng.pick([0, 0, 1, 2]);
                        const [X, Y] = rng.sample(classes[ci], 2);
                        const wrong = rng.sample(classes.filter((_, i) => i !== ci).flat().concat(traps), 3);
                        const why = pyr ? [
                            R`corresponding sides are in the same ratio: ${m(R`\frac{AD}{AB}=\frac{AE}{AC}=\frac{DE}{BC}`)}.`,
                            R`${m(R`\frac{AD}{AB}=\frac{AE}{AC}`)}, so the pieces left over are the same fraction of each side too: ${m(R`\frac{DB}{AB}=\frac{EC}{AC}`)}.`,
                            R`${m(R`\frac{AD}{AB}=\frac{AE}{AC}`)} means D and E cut AB and AC in the same ratio: ${m(R`\frac{AD}{DB}=\frac{AE}{EC}`)}.`,
                        ][ci] : [
                            R`corresponding sides are in the same ratio: ${m(R`\frac{AO}{OC}=\frac{BO}{OD}=\frac{AB}{DC}`)}.`,
                            R`${m(R`\frac{AO}{OC}=\frac{BO}{OD}`)}, so O cuts both diagonals in the same ratio and ${m(R`\frac{AO}{AC}=\frac{BO}{BD}`)}.`,
                            R`${m(R`\frac{AO}{OC}=\frac{BO}{OD}`)}, so O cuts both diagonals in the same ratio and ${m(R`\frac{OC}{AC}=\frac{OD}{BD}`)}.`,
                        ][ci];
                        return {
                            q: `${pyr ? PYR : HGS} Which ratio is always equal to ${fx(X)}?`,
                            fig: pyr ? aFig([10, 12, 11], 0.45) : hgFig([5, 6, 5.5], 1.5),
                            ans: CA.mc(rng, fx(Y), wrong.map(fx)),
                            sol: `${pyr ? 'Step 1: \\(DE\\parallel BC\\), so triangles ADE and ABC form a pyramid, with D matching B and E matching C.' : S1H} Step 2: ${why}`,
                        };
                    }
                    if (v === 2) {
                        for (;;) {
                            const [p, q] = rng.pick(PQ), n = p + q, u = rng.int(1, 4);
                            const sides = fitPyr(n * u, null, null, rng);
                            if (!sides) continue;
                            const [ask, r] = rng.pick([['DE : BC', [p, n]], ['AE : AC', [p, n]], ['AE : EC', [p, q]], ['DE : BC', [p, n]]]);
                            const end = ask === 'AE : EC' ? R`DE cuts AC in the same ratio as AB: ${m(`AE:EC=AD:DB=${rat([p * u, q * u])}`)}.`
                                : R`${ask.replace(' : ', ' and ')} are corresponding sides, so ${m(`${ask.replace(/ /g, '')}=${p}:${n}`)}.`;
                            return {
                                q: `${PYR} AD = ${p * u} cm and DB = ${q * u} cm. Find the ratio ${ask} in simplest form.`,
                                fig: aFig(sides, p / n, { AD: p * u, DB: q * u }), ans: CA.ratio(r),
                                sol: R`${S1P} Step 2: ${m(`AB=${p * u}+${q * u}=${n * u}`)}, so ${m('AD:AB=' + rat([p * u, n * u]))}. ${end}`,
                            };
                        }
                    }
                    for (;;) {
                        const [a, b] = rng.pick(HG), u = rng.int(1, 4);
                        const sides = fitHg(null, a * u, null, rng);
                        if (!sides) continue;
                        const [ask, r] = rng.pick([['AO : OC', [a, b]], ['BO : OD', [a, b]], ['OD : BO', [b, a]], ['AO : AC', [a, a + b]], ['OC : AO', [b, a]]]);
                        const end = ask === 'AO : AC' ? R` AC is ${a}+${b}=${a + b} parts, so ${m(`AO:AC=${a}:${a + b}`)}.`
                            : ask === 'OD : BO' || ask === 'OC : AO' ? R` Turned round, ${m(`${ask.replace(/ /g, '')}=${b}:${a}`)}.` : '';
                        return {
                            q: `${HGS} AB = ${a * u} cm and DC = ${b * u} cm. Find the ratio ${ask} in simplest form.`,
                            fig: hgFig(sides, b / a, { AB: a * u, DC: b * u }), ans: CA.ratio(r),
                            sol: R`${S1H} Step 2: ${m('AB:DC=' + rat([a * u, b * u]))}, so ${m(`AO:OC=BO:OD=${a}:${b}`)}.${end}`,
                        };
                    }
                },
            },
            {
                id: 'perimeter-area', name: 'Perimeter and area ratios in the models', level: 1,
                gen(rng) {
                    const v = rng.int(0, 4);
                    if (v <= 1) {
                        for (;;) {
                            const [p, q] = rng.pick(PQ), n = p + q, u = rng.int(1, 3);
                            const sides = fitPyr(n * u, null, null, rng);
                            if (!sides) continue;
                            const s12 = R`${S1P} Step 2: ${m(`AB=${p * u}+${q * u}=${n * u}`)}, so the ratio of corresponding sides is ${m('AD:AB=' + rat([p * u, n * u]))}.`;
                            if (v === 0) return {
                                q: `${PYR} AD = ${p * u} cm and DB = ${q * u} cm. Find the ratio of the area of triangle ADE to the area of triangle ABC, in simplest form.`,
                                fig: aFig(sides, p / n, { AD: p * u, DB: q * u }, { shade: [[['A', 'D', 'E'], SHADE]] }), ans: CA.ratio([p * p, n * n]),
                                sol: R`${s12} Areas go by the square: ${m(`${p}^2:${n}^2=${p * p}:${n * n}`)}.`,
                            };
                            const w = rng.int(2, 9);
                            return {
                                q: `${PYR} AD = ${p * u} cm and DB = ${q * u} cm. The perimeter of triangle ABC is ${n * w} cm. Find the perimeter of triangle ADE.`,
                                fig: aFig(sides, p / n, { AD: p * u, DB: q * u }, { shade: [[['A', 'D', 'E'], WARM]] }), ans: CA.num(p * w, 'cm'),
                                sol: R`${s12} Perimeters go by the same ratio: ${m(R`${n * w}\times${T.frac(p, n)}=${p * w}`)} cm.`,
                            };
                        }
                    }
                    for (;;) {
                        const [a, b] = rng.pick(HG), u = rng.int(1, 4);
                        const sides = fitHg(null, a * u, null, rng);
                        if (!sides) continue;
                        const s12 = R`${S1H} Step 2: the ratio of corresponding sides is ${m('AB:DC=' + rat([a * u, b * u]))}.`;
                        const lab = { AB: a * u, DC: b * u };
                        if (v === 2) {
                            const t = rng.int(1, 4);
                            return {
                                q: `${HGS} AB = ${a * u} cm and DC = ${b * u} cm. The area of triangle OAB is ${a * a * t} cm². Find the area of triangle OCD.`,
                                fig: hgFig(sides, b / a, lab, { shade: [['top', SHADE], ['bottom', WARM]], legend: [{ fill: SHADE, text: `OAB: ${a * a * t} cm²` }, { fill: WARM, text: 'OCD: ?' }] }),
                                ans: CA.num(b * b * t, 'cm²'),
                                sol: R`${s12} Areas go by the square, ${m(`${a}^2:${b}^2=${a * a}:${b * b}`)}. One part is ${m(R`${a * a * t}\div${a * a}=${t}`)} cm², so OCD is ${m(R`${b * b}\times${t}=${b * b * t}`)} cm².`,
                            };
                        }
                        if (v === 3) {
                            const w = rng.int(3, 9);
                            return {
                                q: `${HGS} AB = ${a * u} cm and DC = ${b * u} cm. The perimeter of triangle OCD is ${b * w} cm. Find the perimeter of triangle OAB.`,
                                fig: hgFig(sides, b / a, lab, { shade: [['top', WARM]] }), ans: CA.num(a * w, 'cm'),
                                sol: R`${s12} Perimeters go by the same ratio: ${m(R`${b * w}\times${T.frac(a, b)}=${a * w}`)} cm.`,
                            };
                        }
                        return {
                            q: `${HGS} AB = ${a * u} cm and DC = ${b * u} cm. Find the ratio of the area of triangle OAB to the area of triangle OCD, in simplest form.`,
                            fig: hgFig(sides, b / a, lab, { shade: [['top', SHADE], ['bottom', SHADE]] }), ans: CA.ratio([a * a, b * b]),
                            sol: R`${s12} Areas go by the square: ${m(`${a}^2:${b}^2=${a * a}:${b * b}`)}.`,
                        };
                    }
                },
            },
            {
                id: 'pyramid-basic', name: 'The pyramid model', level: 1,
                gen(rng) {
                    if (rng.bool(0.2)) {
                        for (;;) {
                            const x = rng.int(3, 16), findDE = rng.bool();
                            const sides = fitPyr(null, 2 * x, null, rng);
                            if (!sides) continue;
                            return {
                                q: `In the figure, D is the midpoint of AB and E is the midpoint of AC. ${findDE ? `BC = ${2 * x} cm. Find the length of DE.` : `DE = ${x} cm. Find the length of BC.`}`,
                                fig: aFig(sides, 0.5, findDE ? { DE: '?', BC: 2 * x } : { DE: x, BC: '?' }), ans: CA.num(findDE ? x : 2 * x, 'cm'),
                                sol: R`Step 1: joining the midpoints makes \(DE\parallel BC\), so triangles ADE and ABC form a pyramid. Step 2: ${m(R`\frac{AD}{AB}=\frac12`)}, so DE is half of BC: ${m(findDE ? R`DE=${2 * x}\div2=${x}` : R`BC=2\times${x}=${2 * x}`)} cm.`,
                            };
                        }
                    }
                    for (;;) {
                        const [p, q] = rng.pick(PQ), n = p + q, u = rng.int(1, 4), v = rng.int(1, 4), w = rng.int(1, 4);
                        const L = { AD: p * u, AB: n * u, DE: p * v, BC: n * v, AE: p * w, AC: n * w };
                        const [rs, rb, given, find] = rng.pick([['AD', 'AB', 'BC', 'DE'], ['AD', 'AB', 'DE', 'BC'], ['AD', 'AB', 'AC', 'AE'], ['DE', 'BC', 'AB', 'AD'], ['DE', 'BC', 'AE', 'AC'], ['AE', 'AC', 'BC', 'DE'], ['AE', 'AC', 'DE', 'BC'], ['AE', 'AC', 'AB', 'AD']]);
                        const used = [rs, rb, given, find], has = (...ks) => ks.some(x => used.includes(x));
                        const sides = fitPyr(has('AD', 'AB') ? L.AB : null, has('DE', 'BC') ? L.BC : null, has('AE', 'AC') ? L.AC : null, rng);
                        if (!sides) continue;
                        const up = ['AB', 'BC', 'AC'].includes(find), k = T.frac(p, n);
                        const [fs, fb] = up ? [given, find] : [find, given];
                        return {
                            q: `${PYR} ${rs} = ${L[rs]} cm, ${rb} = ${L[rb]} cm and ${given} = ${L[given]} cm. Find the length of ${find}.`,
                            fig: aFig(sides, p / n, { [rs]: L[rs], [rb]: L[rb], [given]: L[given], [find]: '?' }), ans: CA.num(L[find], 'cm'),
                            sol: R`${S1P} Step 2: ${m(R`\frac{${rs}}{${rb}}=${fr(L[rs], L[rb])}`)}; ${fs} and ${fb} are corresponding sides, so ${m(R`\frac{${fs}}{${fb}}=${k}`)} too. So ${m(up ? R`${find}=${L[given]}\div${k}=${L[find]}` : R`${find}=${L[given]}\times${k}=${L[find]}`)} cm.`,
                        };
                    }
                },
            },
            {
                id: 'hourglass-basic', name: 'The hourglass model', level: 1,
                gen(rng) {
                    for (;;) {
                        const [a, b] = rng.pick(HG), u = rng.int(1, 4), v = rng.int(1, 4), w = rng.int(1, 4);
                        const L = { AB: a * u, DC: b * u, AO: a * v, OC: b * v, BO: a * w, OD: b * w };
                        const pairs = rng.sample([['AB', 'DC'], ['AO', 'OC'], ['BO', 'OD']], 2), [rt, rbm] = pairs[0];
                        const findTop = rng.bool(), find = pairs[1][findTop ? 0 : 1], given = pairs[1][findTop ? 1 : 0];
                        const used = [...pairs[0], ...pairs[1]], has = k => used.includes(k);
                        const sides = fitHg(has('AO') ? L.AO : null, has('AB') ? L.AB : null, has('BO') ? L.BO : null, rng);
                        if (!sides) continue;
                        return {
                            q: `${HGS} ${rt} = ${L[rt]} cm, ${rbm} = ${L[rbm]} cm and ${given} = ${L[given]} cm. Find the length of ${find}.`,
                            fig: hgFig(sides, b / a, { [rt]: L[rt], [rbm]: L[rbm], [given]: L[given], [find]: '?' }), ans: CA.num(L[find], 'cm'),
                            sol: R`${S1H} Step 2: ${m(R`\frac{${rt}}{${rbm}}=${fr(L[rt], L[rbm])}`)}, and ${pairs[1][0]}, ${pairs[1][1]} are corresponding sides, so ${m(R`\frac{${pairs[1][0]}}{${pairs[1][1]}}=${T.frac(a, b)}`)}. So ${m(findTop ? R`${find}=${L[given]}\times${T.frac(a, b)}=${L[find]}` : R`${find}=${L[given]}\div${T.frac(a, b)}=${L[find]}`)} cm.`,
                        };
                    }
                },
            },
            {
                id: 'pyramid-pieces', name: 'Pyramid model: pieces and wholes', level: 2,
                gen(rng) {
                    for (;;) {
                        const [p, q] = rng.pick(PQ), n = p + q, u = rng.int(1, 4), v = rng.int(1, 4), w = rng.int(1, 4);
                        const L = { AD: p * u, DB: q * u, AB: n * u, DE: p * v, BC: n * v, AE: p * w, EC: q * w, AC: n * w };
                        const kind = rng.pick(['BC', 'BC', 'DE', 'DE', 'EC', 'AE', 'AC', 'DB']);
                        const onBase = ['BC', 'DE', 'DB'].includes(kind);
                        const sides = fitPyr(L.AB, onBase ? L.BC : null, onBase ? null : L.AC, rng);
                        if (!sides) continue;
                        const kw = T.frac(p, n), kp = T.frac(p, q), whole = m(`AB=${L.AD}+${L.DB}=${L.AB}`);
                        const G = { BC: ['AD', 'DB', 'DE'], DE: ['AD', 'DB', 'BC'], EC: ['AD', 'DB', 'AE'], AE: ['AD', 'DB', 'EC'], AC: ['AD', 'DB', 'AE'], DB: ['DE', 'BC', 'AD'] }[kind];
                        const lab = { [kind]: '?' }; G.forEach(g => { lab[g] = L[g]; });
                        const sol = {
                            BC: R`Step 2: DE goes with the <em>whole</em> side: ${whole}, so ${m(R`\frac{DE}{BC}=\frac{AD}{AB}=${fr(L.AD, L.AB)}`)}. So ${m(R`BC=${L.DE}\div${kw}=${L.BC}`)} cm.`,
                            DE: R`Step 2: DE goes with the <em>whole</em> side: ${whole}, so ${m(R`\frac{DE}{BC}=\frac{AD}{AB}=${fr(L.AD, L.AB)}`)}. So ${m(R`DE=${L.BC}\times${kw}=${L.DE}`)} cm.`,
                            EC: R`Step 2: the parallel line cuts both sides in the same ratio: ${m(R`\frac{AE}{EC}=\frac{AD}{DB}=${fr(L.AD, L.DB)}`)}. So ${m(R`EC=${L.AE}\div${kp}=${L.EC}`)} cm.`,
                            AE: R`Step 2: the parallel line cuts both sides in the same ratio: ${m(R`\frac{AE}{EC}=\frac{AD}{DB}=${fr(L.AD, L.DB)}`)}. So ${m(R`AE=${L.EC}\times${kp}=${L.AE}`)} cm.`,
                            AC: R`Step 2: ${whole}, so ${m(R`\frac{AE}{AC}=\frac{AD}{AB}=${fr(L.AD, L.AB)}`)}. So ${m(R`AC=${L.AE}\div${kw}=${L.AC}`)} cm.`,
                            DB: R`Step 2: ${m(R`\frac{AD}{AB}=\frac{DE}{BC}=${fr(L.DE, L.BC)}`)}, so ${m(R`AB=${L.AD}\div${kw}=${L.AB}`)} cm and ${m(`DB=${L.AB}-${L.AD}=${L.DB}`)} cm.`,
                        }[kind];
                        return {
                            q: `${PYR} ${G[0]} = ${L[G[0]]} cm, ${G[1]} = ${L[G[1]]} cm and ${G[2]} = ${L[G[2]]} cm. Find the length of ${kind}.`,
                            fig: aFig(sides, p / n, lab), ans: CA.num(L[kind], 'cm'), sol: `${S1P} ${sol}`,
                        };
                    }
                },
            },
            {
                id: 'hourglass-whole', name: 'Hourglass model: cutting a whole line', level: 2,
                gen(rng) {
                    for (;;) {
                        const [a, b] = rng.pick(HG), n = a + b, u = rng.int(1, 4), v = rng.int(1, 4);
                        const AB = a * u, DC = b * u, kind = rng.pick(['AO', 'OC', 'BO', 'OD', 'DC', 'AC']);
                        const onBD = kind === 'BO' || kind === 'OD', [top, bot, whole] = onBD ? ['BO', 'OD', 'BD'] : ['AO', 'OC', 'AC'];
                        const sides = fitHg(onBD ? null : a * v, AB, onBD ? a * v : null, rng);
                        if (!sides) continue;
                        if (kind === 'DC') return {
                            q: `${HGS} AO = ${a * v} cm, the whole of AC is ${n * v} cm, and AB = ${AB} cm. Find the length of DC.`,
                            fig: hgFig(sides, b / a, { AO: a * v, AB, DC: '?' }, { legend: [{ text: `AC = ${n * v} cm` }] }), ans: CA.num(DC, 'cm'),
                            sol: R`${S1H} Step 2: ${m(`OC=${n * v}-${a * v}=${b * v}`)}, so ${m(R`\frac{DC}{AB}=\frac{OC}{AO}=${fr(b * v, a * v)}`)} and ${m(R`DC=${AB}\times${T.frac(b, a)}=${DC}`)} cm.`,
                        };
                        if (kind === 'AC') return {
                            q: `${HGS} AB = ${AB} cm, DC = ${DC} cm and AO = ${a * v} cm. Find the length of the whole of AC.`,
                            fig: hgFig(sides, b / a, { AB, DC, AO: a * v }, { legend: [{ text: 'AC = ?' }] }), ans: CA.num(n * v, 'cm'),
                            sol: R`${S1H} Step 2: ${m(R`\frac{OC}{AO}=\frac{DC}{AB}=${fr(DC, AB)}`)}, so ${m(R`OC=${a * v}\times${T.frac(b, a)}=${b * v}`)} cm and ${m(`AC=${a * v}+${b * v}=${n * v}`)} cm.`,
                        };
                        const isTop = kind === top, x = (isTop ? a : b) * v;
                        return {
                            q: `${HGS} AB = ${AB} cm, DC = ${DC} cm and the whole of ${whole} is ${n * v} cm. Find the length of ${kind}.`,
                            fig: hgFig(sides, b / a, { AB, DC, [kind]: '?' }, { legend: [{ text: `${whole} = ${n * v} cm` }] }), ans: CA.num(x, 'cm'),
                            sol: R`${S1H} Step 2: ${whole} is cut at O in the ratio ${m(`${top}:${bot}=AB:DC=` + rat([AB, DC]))}, that is ${n} parts in all. ${kind} is ${isTop ? a : b} of them: ${m(R`${n * v}\times${T.frac(isTop ? a : b, n)}=${x}`)} cm.`,
                        };
                    }
                },
            },
            {
                id: 'pyramid-area', name: 'Areas in the pyramid model', level: 2,
                gen(rng) {
                    for (;;) {
                        const [p, q] = rng.pick(PQ.filter(([x, y]) => x + y <= 7)), n = p + q, u = rng.int(1, 3), t = rng.int(1, 4);
                        const sides = fitPyr(n * u, null, null, rng);
                        if (!sides) continue;
                        const P = { ADE: p * p, ABC: n * n, DBCE: n * n - p * p };
                        const name = { ADE: 'triangle ADE', ABC: 'triangle ABC', DBCE: 'the trapezoid DBCE' };
                        const [g, f] = rng.sample(['ADE', 'ABC', 'DBCE'], 2);
                        const col = k => (k === g ? SHADE : k === f ? WARM : FILL);
                        const shade = [[['A', 'D', 'E'], col('ADE')], [['D', 'B', 'C', 'E'], col('DBCE')]];
                        const item = (k, txt) => (k === 'ABC' ? { text: `ABC: ${txt}` } : { fill: col(k), text: `${k}: ${txt}` });
                        return {
                            q: `${PYR} AD = ${p * u} cm and DB = ${q * u} cm. The area of ${name[g]} is ${P[g] * t} cm². Find the area of ${name[f]}.`,
                            fig: aFig(sides, p / n, { AD: p * u, DB: q * u }, { shade, legend: [item(g, `${P[g] * t} cm²`), item(f, '?')] }), ans: CA.num(P[f] * t, 'cm²'),
                            sol: R`${S1P} Step 2: ${m(R`\frac{AD}{AB}=${fr(p * u, n * u)}`)}, so the areas of ADE and ABC are in the ratio ${m(`${p}^2:${n}^2=${p * p}:${n * n}`)}, leaving ${n * n - p * p} parts for the trapezoid. ${cap(name[g])} is ${parts(P[g])}, so one part is ${m(R`${P[g] * t}\div${P[g]}=${t}`)} cm², and ${name[f]} is ${m(R`${P[f]}\times${t}=${P[f] * t}`)} cm².`,
                        };
                    }
                },
            },
            {
                id: 'area-to-length', name: 'From areas back to lengths', level: 2,
                gen(rng) {
                    for (;;) {
                        if (rng.bool(0.55)) {
                            const [p, q] = rng.pick(PQ.filter(([x, y]) => x + y <= 7)), n = p + q, t = rng.int(1, 3), u = rng.int(1, 4), whole = rng.bool();
                            const L = { AD: p * u, AB: n * u, DB: q * u, DE: p * u, BC: n * u, AE: p * u, AC: n * u, EC: q * u };
                            const [g, f] = rng.pick([['AD', 'AB'], ['AD', 'DB'], ['AB', 'AD'], ['AB', 'DB'], ['DE', 'BC'], ['BC', 'DE'], ['AE', 'EC'], ['AC', 'AE']]);
                            const line = k => ({ AD: 0, AB: 0, DB: 0, DE: 1, BC: 1, AE: 2, AC: 2, EC: 2 })[k];
                            const sides = fitPyr(line(g) === 0 ? L.AB : null, line(g) === 1 ? L.BC : null, line(g) === 2 ? L.AC : null, rng);
                            if (!sides) continue;
                            const S = { ADE: p * p * t, ABC: n * n * t, DBCE: (n * n - p * p) * t };
                            const shade = [[['A', 'D', 'E'], SHADE]];
                            if (!whole) shade.push([['D', 'B', 'C', 'E'], MINT]);
                            const legend = [{ fill: SHADE, text: `ADE: ${S.ADE} cm²` }, whole ? { text: `ABC: ${S.ABC} cm²` } : { fill: MINT, text: `DBCE: ${S.DBCE} cm²` }];
                            const pre = whole ? '' : R`the area of ABC is ${m(`${S.ADE}+${S.DBCE}=${S.ABC}`)} cm², so `;
                            const big = { AD: 'AB', AE: 'AC', DE: 'BC' }, small = { AB: 'AD', AC: 'AE', BC: 'DE' };
                            let fin;
                            if (big[g]) {
                                const W = big[g];
                                fin = R`${m(R`${W}=${L[g]}\times${T.frac(n, p)}=${L[W]}`)} cm` + (f === W ? '.' : R`, and ${m(`${f}=${L[W]}-${L[g]}=${L[f]}`)} cm.`);
                            } else {
                                const s = small[g];
                                fin = R`${m(R`${s}=${L[g]}\times${T.frac(p, n)}=${L[s]}`)} cm` + (f === s ? '.' : R`, and ${m(`${f}=${L[g]}-${L[s]}=${L[f]}`)} cm.`);
                            }
                            return {
                                q: `${PYR} The area of triangle ADE is ${S.ADE} cm² and the area of ${whole ? 'triangle ABC' : 'the trapezoid DBCE'} is ${whole ? S.ABC : S.DBCE} cm². ${g} = ${L[g]} cm. Find the length of ${f}.`,
                                fig: aFig(sides, p / n, { [g]: L[g], [f]: '?' }, { shade, legend }), ans: CA.num(L[f], 'cm'),
                                sol: R`${S1P} Step 2: ${pre}the areas of ADE and ABC are in the ratio ${m(rat([S.ADE, S.ABC]) + `=${p}^2:${n}^2`)}, so corresponding sides are in the ratio ${m(`${p}:${n}`)}. ${fin}`,
                            };
                        }
                        const [a, b] = rng.pick(HG.filter(([x, y]) => x <= 4 && y <= 4)), t = rng.int(1, 4), u = rng.int(1, 4);
                        const [g, f] = rng.pick([['AB', 'DC'], ['DC', 'AB'], ['AO', 'OC'], ['OC', 'AO'], ['BO', 'OD'], ['OD', 'BO']]);
                        const L = { AB: a * u, DC: b * u, AO: a * u, OC: b * u, BO: a * u, OD: b * u };
                        const used = [g, f];
                        const sides = fitHg(used.includes('AO') ? a * u : null, used.includes('AB') ? a * u : null, used.includes('BO') ? a * u : null, rng);
                        if (!sides) continue;
                        const up = ['AB', 'AO', 'BO'].includes(g);
                        return {
                            q: `${HGS} The area of triangle OAB is ${a * a * t} cm² and the area of triangle OCD is ${b * b * t} cm². ${g} = ${L[g]} cm. Find the length of ${f}.`,
                            fig: hgFig(sides, b / a, { [g]: L[g], [f]: '?' }, { shade: [['top', SHADE], ['bottom', MINT]], legend: [{ fill: SHADE, text: `OAB: ${a * a * t} cm²` }, { fill: MINT, text: `OCD: ${b * b * t} cm²` }] }),
                            ans: CA.num(L[f], 'cm'),
                            sol: R`${S1H} Step 2: the areas are in the ratio ${m(rat([a * a * t, b * b * t]) + `=${a}^2:${b}^2`)}, so corresponding sides are in the ratio ${m(`${a}:${b}`)}. ${g} and ${f} correspond: ${m(R`${f}=${L[g]}\times${up ? T.frac(b, a) : T.frac(a, b)}=${L[f]}`)} cm.`,
                        };
                    }
                },
            },
            {
                id: 'butterfly', name: 'The butterfly in a trapezoid', level: 2,
                gen(rng) {
                    for (;;) {
                        const [a, b] = rng.pick(HG.filter(([x, y]) => x + y <= 7)), u = rng.int(1, 3), t = rng.int(1, 4), v = rng.int(0, 5);
                        const side = rng.pick(['right', 'left']), sName = side === 'right' ? 'BOC' : 'AOD';
                        const A = { top: a * a * t, bottom: b * b * t, side: a * b * t, all: (a + b) ** 2 * t };
                        const PP = { top: a * a, bottom: b * b, side: a * b, all: (a + b) ** 2 };
                        const name = { top: 'triangle AOB', bottom: 'triangle COD', side: `triangle ${sName}`, all: 'the trapezoid ABCD' };
                        const tag = { top: 'AOB', bottom: 'COD', side: sName, all: 'ABCD' };
                        const part = { top: 'top', bottom: 'bottom', side };
                        const four = m(`${a * a}:${a * b}:${a * b}:${b * b}`);
                        const fig = (gs, f, lab) => {
                            const shade = [], legend = [];
                            [...[].concat(gs).map(g => [g, SHADE, `${A[g]} cm²`]), [f, WARM, '?']].forEach(([k, col, txt]) => {
                                if (k === 'all') legend.push({ text: `ABCD: ${txt}` });
                                else { shade.push([part[k], col]); legend.push({ fill: col, text: `${tag[k]}: ${txt}` }); }
                            });
                            return hgFig(fitHg(null, lab ? a * u : 6, null, rng), b / a, lab ? { AB: a * u, DC: b * u } : {}, { trap: true, shade, legend });
                        };
                        if (v <= 1) {
                            const [g, f] = rng.sample(['top', 'bottom', 'side', 'all'], 2);
                            if (g === 'all') continue;
                            return {
                                q: `${TRAP} AB = ${a * u} cm and DC = ${b * u} cm. The area of ${name[g]} is ${A[g]} cm². Find the area of ${name[f]}.`,
                                fig: fig(g, f, true), ans: CA.num(A[f], 'cm²'),
                                sol: R`Step 1: \(AB\parallel DC\), so AOB and COD form an hourglass. Step 2: ${m('AB:DC=' + rat([a * u, b * u]))}, so ${m(`AO:OC=${a}:${b}`)}; triangles with the same height have areas in the ratio of their bases, so AOB, BOC, AOD, COD are in the ratio ${four} — ${PP.all} parts. ${cap(name[g])} is ${parts(PP[g])}, so one part is ${m(R`${A[g]}\div${PP[g]}=${t}`)} cm², and ${name[f]} is ${m(R`${PP[f]}\times${t}=${A[f]}`)} cm².`,
                            };
                        }
                        if (v <= 3) {
                            const f = v === 2 ? 'side' : 'all';
                            return {
                                q: `${TRAP} The area of triangle AOB is ${A.top} cm² and the area of triangle COD is ${A.bottom} cm². Find the area of ${name[f]}.`,
                                fig: fig(['top', 'bottom'], f, false), ans: CA.num(A[f], 'cm²'),
                                sol: R`Step 1: \(AB\parallel DC\), so AOB and COD form an hourglass. Step 2: their areas are ${m(rat([A.top, A.bottom]) + `=${a}^2:${b}^2`)}, so ${m(`AB:DC=${a}:${b}`)} and the four triangles are in the ratio ${four}. One part is ${m(R`${A.top}\div${a * a}=${t}`)} cm², so ${name[f]} is ${m(R`${PP[f]}\times${t}=${A[f]}`)} cm².`,
                            };
                        }
                        if (v === 4) {
                            const f = rng.pick(['bottom', 'all']);
                            return {
                                q: `${TRAP} The area of triangle AOB is ${A.top} cm² and the area of triangle ${sName} is ${A.side} cm². Find the area of ${name[f]}.`,
                                fig: fig(['top', 'side'], f, false), ans: CA.num(A[f], 'cm²'),
                                sol: R`Step 1: \(AB\parallel DC\), so AOB and COD form an hourglass. Step 2: triangles AOB and ${sName} have the same height, so their areas give the ratio of their bases on the diagonal: ${m(rat([A.top, A.side]))}, which is also ${m('AB:DC')}. So the four triangles are in the ratio ${four} and one part is ${t} cm²; ${name[f]} is ${m(R`${PP[f]}\times${t}=${A[f]}`)} cm².`,
                            };
                        }
                        const f = rng.pick(['top', 'bottom', 'side']);
                        return {
                            q: R`${TRAP} ${m(`AB:DC=${a}:${b}`)} and the area of the trapezoid ABCD is ${A.all} cm². Find the area of ${name[f]}.`,
                            fig: fig('all', f, false), ans: CA.num(A[f], 'cm²'),
                            sol: R`Step 1: \(AB\parallel DC\), so AOB and COD form an hourglass. Step 2: ${m(`AB:DC=${a}:${b}`)}, so AOB, BOC, AOD, COD are in the ratio ${four}, ${PP.all} parts in all. One part is ${m(R`${A.all}\div${PP.all}=${t}`)} cm², so ${name[f]} is ${m(R`${PP[f]}\times${t}=${A[f]}`)} cm².`,
                        };
                    }
                },
            },
            {
                id: 'chain-two-pyramids', name: 'Step 3: two pyramids share a side', level: 2,
                gen(rng) {
                    for (;;) {
                        const [p, q] = rng.pick(PQ), n = p + q, u = rng.int(1, 4), v = rng.int(1, 4), w = rng.int(1, 4), kind = rng.int(0, 4);
                        const s1 = 'Step 1: \\(DE\\parallel BC\\) gives the pyramid ADE inside ABC; \\(EF\\parallel AB\\) gives the pyramid EFC inside ABC (E matches A, F matches B).';
                        const s2 = R`Step 2: DE cuts AB and AC in the same ratio, so ${m(`AE:EC=AD:DB=${rat([p * u, q * u])}`)}.`;
                        const s3 = R`Step 3: AC is shared, and ${m(`EC:AC=${q}:${n}`)}.`;
                        if (kind <= 1) {
                            if (u / v < 0.75 || u / v > 1.35) continue;
                            const sides = fitPyr(n * u, n * v, null, rng);
                            if (!sides) continue;
                            const find = kind === 0 ? 'FC' : 'BF';
                            const fc = R`In the second pyramid ${m(R`\frac{FC}{BC}=\frac{EC}{AC}=${T.frac(q, n)}`)}, so ${m(R`FC=${n * v}\times${T.frac(q, n)}=${q * v}`)} cm`;
                            return {
                                q: `${TWO} AD = ${p * u} cm, DB = ${q * u} cm and BC = ${n * v} cm. Find the length of ${find}.`,
                                fig: chainTriFig(sides, p / n, { AD: p * u, DB: q * u, BC: n * v, [find]: '?' }), ans: CA.num((kind === 0 ? q : p) * v, 'cm'),
                                sol: R`${s1} ${s2} ${s3} ${fc}${kind === 0 ? '.' : R`, and ${m(`BF=${n * v}-${q * v}=${p * v}`)} cm.`}`,
                            };
                        }
                        if (kind === 2) {
                            if (u / w < 0.75 || u / w > 1.35) continue;
                            const sides = fitPyr(n * u, null, n * w, rng);
                            if (!sides) continue;
                            return {
                                q: `${TWO} AE = ${p * w} cm, EC = ${q * w} cm and AB = ${n * u} cm. Find the length of EF.`,
                                fig: chainTriFig(sides, p / n, { AE: p * w, EC: q * w, AB: n * u, EF: '?' }), ans: CA.num(q * u, 'cm'),
                                sol: R`${s1} Step 2: ${m(`AC=${p * w}+${q * w}=${n * w}`)}, so ${m('EC:AC=' + rat([q * w, n * w]))}. Step 3: EC is the side of the second pyramid that matches AC, and EF matches AB: ${m(R`EF=${n * u}\times${T.frac(q, n)}=${q * u}`)} cm.`,
                            };
                        }
                        if (kind === 3) {
                            const sides = fitPyr(null, n * v, null, rng);
                            if (!sides) continue;
                            return {
                                q: `${TWO} DE = ${p * v} cm and FC = ${q * v} cm. Find the ratio AD : DB in simplest form.`,
                                fig: chainTriFig(sides, p / n, { DE: p * v, FC: q * v }), ans: CA.ratio([p, q]),
                                sol: R`${s1} Step 2: in the first pyramid ${m(R`\frac{AE}{AC}=\frac{DE}{BC}`)}; in the second ${m(R`\frac{EC}{AC}=\frac{FC}{BC}`)}. Step 3: both use the shared side AC, so ${m(`AE:EC=DE:FC=${rat([p * v, q * v])}`)}, and DE cuts AB in the same ratio: ${m(`AD:DB=${p}:${q}`)}.`,
                            };
                        }
                        const sides = fitPyr(n * u, null, null, rng);
                        if (!sides) continue;
                        const t = rng.int(1, 3), want = rng.pick(['EFC', 'DBFE', 'ABC']);
                        const P = { EFC: q * q, DBFE: 2 * p * q, ABC: n * n };
                        const reg = { EFC: ['E', 'F', 'C'], DBFE: ['D', 'B', 'F', 'E'] };
                        const shade = [[['A', 'D', 'E'], SHADE]];
                        if (reg[want]) shade.push([reg[want], WARM]);
                        const label = { EFC: 'triangle EFC', DBFE: 'the parallelogram DBFE', ABC: 'triangle ABC' }[want];
                        return {
                            q: `${TWO} AD = ${p * u} cm and DB = ${q * u} cm. The area of triangle ADE is ${p * p * t} cm². Find the area of ${label}.`,
                            fig: chainTriFig(sides, p / n, { AD: p * u, DB: q * u }, { shade, legend: [{ fill: SHADE, text: `ADE: ${p * p * t} cm²` }, reg[want] ? { fill: WARM, text: `${want}: ?` } : { text: 'ABC: ?' }] }),
                            ans: CA.num(P[want] * t, 'cm²'),
                            sol: R`${s1} Step 2: ${m(`AD:AB=${p}:${n}`)}, so ADE and ABC have areas ${m(`${p * p}:${n * n}`)}. Step 3: AC is shared, ${m(`EC:AC=${q}:${n}`)}, so EFC and ABC have areas ${m(`${q * q}:${n * n}`)}. With one part ${m(R`${p * p * t}\div${p * p}=${t}`)} cm²: ADE, EFC, the parallelogram and ABC are ${m(`${p * p}, ${q * q}, ${n * n}-${p * p}-${q * q}=${2 * p * q}`)} and ${n * n} parts, so ${label} is ${m(R`${P[want]}\times${t}=${P[want] * t}`)} cm².`,
                        };
                    }
                },
            },
            {
                id: 'shadows', name: 'Shadows and heights', level: 2,
                gen(rng) {
                    if (rng.bool(0.5)) {
                        for (;;) {
                            const h1 = rng.pick([10, 12, 15, 16, 18, 20]), r2 = rng.pick([1, 2, 3, 4, 5]), k2 = rng.pick([4, 5, 6, 7, 8, 10]);   // shadow = height × r2/2, tall = short × k2/2
                            if ((h1 * r2) % 2 || (h1 * k2) % 2 || (h1 * r2 * k2) % 4) continue;
                            const s1 = h1 * r2 / 2, H = h1 * k2 / 2, S = s1 * k2 / 2;
                            if (S > 300 || s1 === h1) continue;
                            const tall = rng.pick(['tree', 'flagpole', 'tower', 'pylon', 'lighthouse', 'statue']);
                            const [short, sName] = rng.pick([[`a ${tenth(h1)} m stick held upright`, 'stick'], [`a ${tenth(h1)} m fence post`, 'post'], [`Sam, who is ${tenth(h1)} m tall,`, 'Sam'], [`a ${tenth(h1)} m pole`, 'pole']]);
                            const findH = rng.bool(0.6);
                            const lab = { h1: `${tenth(h1)} m`, s1: `${tenth(s1)} m`, H: findH ? '?' : `${tenth(H)} m`, S: findH ? `${tenth(S)} m` : '?' };
                            const st1 = 'Step 1: the sun’s rays are parallel and both stand upright, so the two triangles are similar.';
                            return {
                                q: findH ? `On a sunny day ${short} casts a shadow ${tenth(s1)} m long. At the same moment a ${tall} casts a shadow ${tenth(S)} m long. How tall is the ${tall}?`
                                    : `On a sunny day ${short} casts a shadow ${tenth(s1)} m long. At the same moment a ${tall} that is ${tenth(H)} m tall also casts a shadow. How long is the ${tall}’s shadow?`,
                                fig: sunFig(h1, s1, H, S, lab, [sName, tall]), ans: CA.num((findH ? H : S) / 10, 'm'),
                                sol: findH ? R`${st1} Step 2: the ${tall}’s shadow is ${m(`${tenth(S)}\\div${tenth(s1)}=${tenth(k2 * 5)}`)} times as long, so the ${tall} is ${tenth(k2 * 5)} times as tall: ${m(`${tenth(h1)}\\times${tenth(k2 * 5)}=${tenth(H)}`)} m.`
                                    : R`${st1} Step 2: the ${tall} is ${m(`${tenth(H)}\\div${tenth(h1)}=${tenth(k2 * 5)}`)} times as tall, so its shadow is ${tenth(k2 * 5)} times as long: ${m(`${tenth(s1)}\\times${tenth(k2 * 5)}=${tenth(S)}`)} m.`,
                            };
                        }
                    }
                    for (;;) {
                        const h = rng.pick([12, 15, 16, 18, 20]), k2 = rng.pick([4, 5, 6, 8, 10]), s = rng.pick([10, 20, 30, 40, 15, 25]);   // lamp = person × k2/2
                        if ((h * k2) % 2 || (s * (k2 - 2)) % 2) continue;
                        const H = h * k2 / 2, d = s * (k2 - 2) / 2, k = tenth(k2 * 5);
                        if ((d + s) / H > 3.2 || (d + s) / H < 0.6) continue;
                        const who = rng.pick(['Ali', 'Bea', 'Chen', 'Dina', 'Eli', 'Fay']), v = rng.int(0, 2);
                        const base = `${who}, who is ${tenth(h)} m tall, stands ${v === 2 ? 'near' : `${tenth(d)} m from the foot of`} a street lamp`;
                        const fig = lab => lampFig(H, h, d, s, { H: `${tenth(H)} m`, h: `${tenth(h)} m`, d: `${tenth(d)} m`, s: `${tenth(s)} m`, ...lab });
                        const sim = `Step 1: ${who} stands upright, parallel to the lamp post, so the triangle made by ${who} and the shadow and the triangle made by the lamp post and the ground up to the tip of the shadow form a pyramid.`;
                        if (v === 0) return { q: `${base} and casts a shadow ${tenth(s)} m long. How high is the lamp?`, fig: fig({ H: '?' }), ans: CA.num(H / 10, 'm'),
                            sol: R`${sim} Step 2: the big base is ${m(`${tenth(d)}+${tenth(s)}=${tenth(d + s)}`)} m, which is ${m(`${tenth(d + s)}\\div${tenth(s)}=${k}`)} times the shadow. So the lamp is ${k} times ${who}’s height: ${m(`${tenth(h)}\\times${k}=${tenth(H)}`)} m.` };
                        if (v === 1) return { q: `${base} that is ${tenth(H)} m high. How long is ${who}’s shadow?`, fig: fig({ s: '?' }), ans: CA.num(s / 10, 'm'),
                            sol: R`${sim} Step 2: the lamp is ${m(`${tenth(H)}\\div${tenth(h)}=${k}`)} times as high as ${who}, so the big base is ${k} times the shadow: shadow + ${tenth(d)} = ${k} × shadow. So ${tenth(d)} m is ${tenth(k2 * 5 - 10)} times the shadow, and the shadow is ${m(`${tenth(d)}\\div${tenth(k2 * 5 - 10)}=${tenth(s)}`)} m.` };
                        return { q: `${base} that is ${tenth(H)} m high, and casts a shadow ${tenth(s)} m long. How far is ${who} from the foot of the lamp post?`, fig: fig({ d: '?' }), ans: CA.num(d / 10, 'm'),
                            sol: R`${sim} Step 2: the lamp is ${m(`${tenth(H)}\\div${tenth(h)}=${k}`)} times as high as ${who}, so the big base is ${m(`${k}\\times${tenth(s)}=${tenth(d + s)}`)} m. Take away the shadow: ${m(`${tenth(d + s)}-${tenth(s)}=${tenth(d)}`)} m.` };
                    }
                },
            },
            {
                id: 'chain-trapezoid', name: 'Step 3: an hourglass and a pyramid in a trapezoid', level: 3,
                gen(rng) {
                    for (;;) {
                        const [p, q] = rng.pick([[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5], [2, 1], [3, 2], [1, 2], [2, 3]]), n = p + q;
                        const w = rng.int(1, Math.max(1, Math.floor(40 / (Math.max(p, q) * n))));
                        const a = p * n * w, b = q * n * w, EO = p * q * w, EF = 2 * EO;
                        const lam = rng.pick([0.3, 0.4, 0.5, 0.6]), s = (b - a) * lam, kind = rng.int(0, 4);
                        const hy = s1 => `Step 1: \\(AB\\parallel DC\\) gives the hourglass AOB/COD; ${s1}.`;
                        const ratio = R`${m('AO:OC=AB:DC=' + rat([a, b]))}`, ratioBD = R`${m('BO:OD=AB:DC=' + rat([a, b]))}`;
                        if (kind <= 2) {
                            const h = Math.max(a, b) * rng.pick([0.45, 0.55, 0.65]);
                            if (kind === 0) {
                                const which = rng.pick(['EO', 'OF']);
                                const [tri, sh, piece] = which === 'EO' ? ['AEO inside ADC', 'AC', 'AO:AC'] : ['BOF inside BDC', 'BD', 'BO:BD'];
                                return {
                                    q: `${TRO} AB = ${a} cm and DC = ${b} cm. Find the length of ${which}.`,
                                    fig: trapFig(a, b, s, h, { AB: a, DC: b, [which]: '?' }), ans: CA.num(EO, 'cm'),
                                    sol: R`${hy(R`\(${which}\parallel DC\) gives the pyramid ${tri}`)} Step 2: ${which === 'EO' ? ratio : ratioBD}, so ${m(`${piece}=${p}:${n}`)}. Step 3: ${sh} is shared by the two models, so ${m(R`${which}=DC\times${T.frac(p, n)}=${b}\times${T.frac(p, n)}=${EO}`)} cm.`,
                                };
                            }
                            if (kind === 1) return {
                                q: `${TRO} AB = ${a} cm and DC = ${b} cm. Find the length of EF.`,
                                fig: trapFig(a, b, s, h, { AB: a, DC: b }, { hlEF: true, legend: [{ line: ACCENT, text: 'EF = ?' }] }), ans: CA.num(EF, 'cm'),
                                sol: R`${hy(R`\(EO\parallel DC\) gives the pyramids AEO/ADC and BOF/BDC`)} Step 2: ${ratio} (and the same for BO : OD), so ${m(`AO:AC=BO:BD=${p}:${n}`)}. Step 3: the diagonals are shared, so ${m(R`EO=OF=${b}\times${T.frac(p, n)}=${EO}`)} and ${m(`EF=2\\times${EO}=${EF}`)} cm.`,
                            };
                            return {
                                q: `${TRO} AB = ${a} cm and EF = ${EF} cm. Find the length of DC.`,
                                fig: trapFig(a, b, s, h, { AB: a, DC: '?' }, { legend: [{ line: INK, text: `EF = ${EF} cm` }] }), ans: CA.num(b, 'cm'),
                                sol: R`${hy(R`\(EO\parallel AB\) gives the pyramid DEO inside DAB`)} Step 2: O is the midpoint of EF, so ${m(R`EO=${EF}\div2=${EO}`)}, and in the pyramid ${m(R`\frac{DO}{DB}=\frac{EO}{AB}=${fr(EO, a)}`)}, so ${m(`DO:OB=${q}:${p}`)}. Step 3: BD is shared with the hourglass, so ${m(`DC:AB=DO:OB=${q}:${p}`)} and ${m(R`DC=${a}\times${T.frac(q, p)}=${b}`)} cm.`,
                            };
                        }
                        // A leg is given: E (or F) cuts it like O cuts the diagonal.
                        const leftLeg = kind === 3, dx = leftLeg ? s : b - s - a, M = Math.max(a, b);
                        const rs = [];
                        for (let r = 1; r <= 20; r++) { const L = n * r, hh = L * L - dx * dx; if (L <= 60 && hh > 0 && Math.sqrt(hh) >= 0.35 * M && Math.sqrt(hh) <= 0.8 * M) rs.push(r); }
                        if (!rs.length) continue;
                        const r = rng.pick(rs), L = n * r, h = Math.sqrt(L * L - dx * dx);
                        const [leg, top, bot, tri, sh] = leftLeg ? ['AD', 'AE', 'ED', 'AEO/ADC', 'AC'] : ['BC', 'BF', 'FC', 'BOF/BDC', 'BD'];
                        const find = rng.pick([top, bot]), val = find === top ? p * r : q * r;
                        return {
                            q: `${TRO} AB = ${a} cm, DC = ${b} cm and ${leg} = ${L} cm. Find the length of ${find}.`,
                            fig: trapFig(a, b, s, h, { AB: a, DC: b, [leg]: L, [find]: '?' }), ans: CA.num(val, 'cm'),
                            sol: R`${hy(R`\(${leftLeg ? 'EO' : 'OF'}\parallel DC\) gives the pyramid ${tri}`)} Step 2: ${leftLeg ? ratio : ratioBD}. Step 3: ${sh} is shared, so the parallel line cuts ${leg} in the same ratio: ${m(`${top}:${bot}=${p}:${q}`)}, and ${m(R`${find}=${L}\times${T.frac(find === top ? p : q, n)}=${val}`)} cm.`,
                        };
                    }
                },
            },
            {
                id: 'chain-parallelogram', name: 'Step 3: two hourglasses in a parallelogram', level: 3,
                gen(rng) {
                    for (;;) {
                        const [p, q] = rng.pick([[1, 1], [2, 1], [3, 1], [3, 2], [2, 3], [4, 3], [3, 4], [5, 3], [4, 5], [5, 2]]), n = p + q;
                        const kind = rng.int(0, 4), u = rng.int(1, 3), BE = p * u, EC = q * u, BC = n * u;
                        const s1 = 'Step 1: \\(BE\\parallel AD\\) gives the hourglass BEF/DAF; \\(AB\\parallel CG\\) (DC extended) gives the hourglass EBA/ECG.';
                        const lab = { BE, EC };
                        if (kind === 0 || kind === 2) {
                            const z = rng.int(1, 3), AF = n * p * z, FE = p * p * z, AE = AF + FE, EG = (n + p) * q * z;
                            if (AF > 60 || EG > 60) continue;
                            // Put A so that AE has its true length compared with BC.
                            const opts = [];
                            for (const hf of [0.5, 0.6, 0.7, 0.8]) {
                                const hh = hf * BC, dx2 = AE * AE - hh * hh;
                                if (dx2 <= 0) continue;
                                for (const sg of [-1, 1]) { const ax = BE + sg * Math.sqrt(dx2); if (ax >= -0.15 * BC && ax <= 0.55 * BC) opts.push([ax, hh]); }
                            }
                            if (!opts.length) continue;
                            const A = rng.pick(opts);
                            const s2 = R`Step 2: ${m(`AD=BC=${BE}+${EC}=${BC}`)}, so ${m('FE:AF=BE:AD=' + rat([BE, BC]))}`;
                            if (kind === 0) return {
                                q: `${PGC} BE = ${BE} cm, EC = ${EC} cm and AF = ${AF} cm. Find the length of EG.`,
                                fig: pgcFig(BE, EC, A, { ...lab, AF, EG: '?' }), ans: CA.num(EG, 'cm'),
                                sol: R`${s1} ${s2}: ${m(R`FE=${AF}\times${T.frac(p, n)}=${FE}`)} and ${m(`AE=${AF}+${FE}=${AE}`)} cm. Step 3: AE is shared with the second hourglass, where ${m('EG:AE=EC:BE=' + rat([EC, BE]))}, so ${m(R`EG=${AE}\times${T.frac(q, p)}=${EG}`)} cm.`,
                            };
                            return {
                                q: `${PGC} BE = ${BE} cm, EC = ${EC} cm and EG = ${EG} cm. Find the length of AF.`,
                                fig: pgcFig(BE, EC, A, { ...lab, EG, AF: '?' }), ans: CA.num(AF, 'cm'),
                                sol: R`${s1} Step 2: in the hourglass EBA/ECG, ${m('AE:EG=BE:EC=' + rat([BE, EC]))}, so ${m(R`AE=${EG}\times${T.frac(p, q)}=${AE}`)} cm. Step 3: AE is shared with the hourglass BEF/DAF, where ${m(`AF:FE=AD:BE=${rat([BC, BE])}`)} (AD = BC = ${BC}), so ${m(R`AF=${AE}\times${T.frac(n, n + p)}=${AF}`)} cm.`,
                            };
                        }
                        if (kind === 1) {
                            const r = [n * p, p * p, (n + p) * q], g = r.reduce((x, y) => CA.gcd(x, y));
                            return {
                                q: `${PGC} BE = ${BE} cm and EC = ${EC} cm. Find the ratio AF : FE : EG in simplest form.`,
                                fig: pgcFig(BE, EC, [0.3 * BC, 0.62 * BC], lab), ans: CA.ratio(r),
                                sol: R`${s1} Step 2: AD = BC, so ${m(`AF:FE=AD:BE=${n}:${p}`)} and AE is ${n + p} parts. Step 3: AE is shared with the second hourglass, where ${m(`AE:EG=BE:EC=${p}:${q}`)}. Make AE ${p * (n + p)} parts in both: ${m(`AF:FE:EG=${r.join(':')}`)}${g > 1 ? R`${m('=' + r.map(x => x / g).join(':'))}` : ''}.`,
                            };
                        }
                        if (kind === 3) {
                            const y = rng.int(1, 4), AB = p * y, CG = q * y, DG = n * y;
                            const opts = [];
                            for (const phi of [55, 62, 70, 78]) { const A = [AB * Math.cos(phi * Math.PI / 180), AB * Math.sin(phi * Math.PI / 180)]; if (A[1] >= 0.35 * BC && A[1] <= 0.9 * BC) opts.push(A); }
                            if (!opts.length || DG > 40) continue;
                            return {
                                q: `${PGC} BE = ${BE} cm, EC = ${EC} cm and AB = ${AB} cm. Find the length of DG.`,
                                fig: pgcFig(BE, EC, rng.pick(opts), { ...lab, AB, DG: '?' }), ans: CA.num(DG, 'cm'),
                                sol: R`Step 1: \(AB\parallel CG\) (DC extended), and AG, BC cross at E: the hourglass EBA/ECG. Step 2: ${m('CG:AB=EC:BE=' + rat([EC, BE]))}, so ${m(R`CG=${AB}\times${T.frac(q, p)}=${CG}`)} cm. Step 3: DC is the side of the parallelogram opposite AB, so DC = ${AB} cm and ${m(`DG=${AB}+${CG}=${DG}`)} cm. (The pyramid GCE/GDA agrees: ${m(`GC:GD=CE:DA=${q}:${n}`)}.)`,
                            };
                        }
                        if (p > 3) continue;
                        const t = rng.int(1, 2), S = p * p * p * t, ABE = p * p * (n + p) * t, CEG = (n + p) * q * q * t;
                        return {
                            q: `${PGC} BE = ${BE} cm and EC = ${EC} cm. The area of triangle BEF is ${S} cm². Find the area of triangle CEG.`,
                            fig: pgcFig(BE, EC, [0.3 * BC, 0.62 * BC], lab, { shade: [['BEF', SHADE], ['CEG', WARM]], legend: [{ fill: SHADE, text: `BEF: ${S} cm²` }, { fill: WARM, text: 'CEG: ?' }] }),
                            ans: CA.num(CEG, 'cm²'),
                            sol: R`${s1} Step 2: AD = BC, so ${m(`FE:AF=BE:AD=${p}:${n}`)}; triangles BFE and BFA have the same height from B, so ${m(R`\text{ABE}=${S}\times${T.frac(n + p, p)}=${ABE}`)} cm². Step 3: AE is shared with the hourglass EBA/ECG, whose sides are in the ratio ${m(`EC:EB=${q}:${p}`)}, so ${m(R`\text{CEG}=${ABE}\times\left(${T.frac(q, p)}\right)^2=${CEG}`)} cm².`,
                        };
                    }
                },
            },
            {
                id: 'parallel-cuts', name: 'Pyramids sharing a side: cutting off areas', level: 3,
                gen(rng) {
                    for (;;) {
                        const v = rng.int(0, 3);
                        if (v <= 1) {
                            const [p, q] = rng.pick(PQ.filter(([x, y]) => x + y <= 7)), n = p + q, u = rng.int(1, 4), t = rng.int(1, 4);
                            const sides = fitPyr(n * u, null, null, rng);
                            if (!sides) continue;
                            if (v === 0) {
                                const want = rng.pick(['AD', 'DB']);
                                return {
                                    q: R`${PYR} The area of triangle ADE is ${m(T.frac(p * p, n * n))} of the area of triangle ABC, and AB = ${n * u} cm. Find the length of ${want}.`,
                                    fig: aFig(sides, p / n, { AB: n * u, [want]: '?' }, { shade: [[['A', 'D', 'E'], SHADE]] }), ans: CA.num((want === 'AD' ? p : q) * u, 'cm'),
                                    sol: R`${S1P} Step 2: the areas are in the ratio ${m(`${p * p}:${n * n}=${p}^2:${n}^2`)}, so the ratio of corresponding sides is ${m(R`\frac{AD}{AB}=${T.frac(p, n)}`)} and ${m(R`AD=${n * u}\times${T.frac(p, n)}=${p * u}`)} cm.` + (want === 'DB' ? R` Then ${m(`DB=${n * u}-${p * u}=${q * u}`)} cm.` : ''),
                                };
                            }
                            return {
                                q: `${PYR} The area of triangle ADE is ${p * p * t} cm² and the area of the trapezoid DBCE is ${(n * n - p * p) * t} cm². Find the ratio AD : DB in simplest form.`,
                                fig: aFig(sides, p / n, {}, { shade: [[['A', 'D', 'E'], SHADE], [['D', 'B', 'C', 'E'], MINT]], legend: [{ fill: SHADE, text: `ADE: ${p * p * t} cm²` }, { fill: MINT, text: `DBCE: ${(n * n - p * p) * t} cm²` }] }),
                                ans: CA.ratio([p, q]),
                                sol: R`${S1P} Step 2: triangle ABC has area ${m(`${p * p * t}+${(n * n - p * p) * t}=${n * n * t}`)} cm², so the areas of ADE and ABC are ${m(rat([p * p * t, n * n * t]))} and the sides ${m(`AD:AB=${p}:${n}`)}. So ${m(`AD:DB=${p}:(${n}-${p})=${p}:${q}`)}.`,
                            };
                        }
                        const [p, q, r] = rng.pick([[1, 1, 1], [1, 2, 1], [1, 1, 2], [2, 1, 1], [1, 2, 2], [2, 1, 2], [2, 2, 1], [2, 3, 2], [3, 2, 2], [2, 2, 3], [3, 2, 3]]);
                        const N = p + q + r, u = rng.int(1, 3), t = rng.int(1, 3), sides = fitPyr(N * u, null, null, rng);
                        if (!sides) continue;
                        const P = { top: p * p, mid: (p + q) ** 2 - p * p, low: N * N - (p + q) ** 2, all: N * N };
                        const name = { top: 'triangle ADE', mid: 'the middle strip DFGE', low: 'the bottom strip FBCG', all: 'triangle ABC' };
                        const tag = { top: 'ADE', mid: 'DFGE', low: 'FBCG', all: 'ABC' };
                        const reg = { top: ['A', 'D', 'E'], mid: ['D', 'F', 'G', 'E'], low: ['F', 'B', 'C', 'G'] };
                        const [g, f] = rng.sample(['top', 'mid', 'low', 'all'], 2);
                        const shade = [], legend = [];
                        [[g, SHADE, `${P[g] * t} cm²`], [f, WARM, '?']].forEach(([k, col, txt]) => {
                            if (k === 'all') legend.push({ text: `ABC: ${txt}` });
                            else { shade.push([reg[k], col]); legend.push({ fill: col, text: `${tag[k]}: ${txt}` }); }
                        });
                        return {
                            q: `In the figure, D and F are on AB, E and G are on AC, and DE and FG are both parallel to BC. AD = ${p * u} cm, DF = ${q * u} cm and FB = ${r * u} cm. The area of ${name[g]} is ${P[g] * t} cm². Find the area of ${name[f]}.`,
                            fig: aFig(sides, [p / N, (p + q) / N], { AD: p * u, DF: q * u, FB: r * u }, { shade, legend }), ans: CA.num(P[f] * t, 'cm²'),
                            sol: R`Step 1: \(DE\parallel BC\) and \(FG\parallel BC\) give two pyramids, ADE and AFG, inside ABC. Step 2: ${m('AD:AF:AB=' + rat([p * u, (p + q) * u, N * u]))}. Step 3: the pyramids share the side AB, so ADE, AFG, ABC have areas ${m(`${p * p}:${(p + q) ** 2}:${N * N}`)} and the three bands are ${m(`${P.top}:${P.mid}:${P.low}`)} parts. ${cap(name[g])} is ${parts(P[g])}, so one part is ${t} cm² and ${name[f]} is ${m(R`${P[f]}\times${t}=${P[f] * t}`)} cm².`,
                        };
                    }
                },
            },
            {
                id: 'inscribed-square', name: 'A square inside a triangle', level: 3,
                gen(rng) {
                    for (;;) {
                        const a = rng.int(3, 20), b = rng.int(3, 24);
                        if (Math.max(a, b) / Math.min(a, b) > 2.6) continue;
                        const whole = (a * b) % (a + b) === 0, [sn, sd] = CA.reduce(a * b, a + b);
                        if (!whole && (sd > 9 || rng.bool(0.5))) continue;
                        const form = whole ? '' : ' Give your answer as a fraction.';
                        const wantArea = whole && rng.bool(0.3), s = a * b / (a + b);
                        const end = wantArea ? R` Its area is ${m(`${s}^2=${s * s}`)} cm².` : '';
                        if (rng.bool(0.5)) return {
                            q: `Triangle ABC has a right angle at C, with AC = ${a} cm and BC = ${b} cm. The shaded square has one corner at C, two sides along CA and CB, and its opposite corner on AB. Find the ${wantArea ? 'area' : 'side length'} of the square.${form}`,
                            fig: sqRightFig(a, b, { a, b }), ans: wantArea ? CA.num(s * s, 'cm²') : CA.frac(sn, sd, 'cm'),
                            sol: R`Step 1: let the side be ${m('x')}. The top of the square is parallel to CB, so the small triangle above it and ABC form a pyramid. Step 2: its legs ${m(`${a}-x`)} and ${m('x')} match ${a} and ${b}: ${m(R`\frac{${a}-x}{${a}}=\frac{x}{${b}}`)}. So ${m(`${b}(${a}-x)=${a}x`)}, ${m(`${a * b}=${a + b}x`)} and ${m(`x=${T.frac(a * b, a + b)}`)} cm.${end}`,
                        };
                        return {
                            q: `Triangle ABC has base BC = ${b} cm and height ${a} cm (measured from A down to BC). The shaded square has one side on BC and its two top corners on AB and AC. Find the ${wantArea ? 'area' : 'side length'} of the square.${form}`,
                            fig: sqTriFig(b, a, { b, h: `${a}` }, rng.pick([0.3, 0.4, 0.5, 0.6])), ans: wantArea ? CA.num(s * s, 'cm²') : CA.frac(sn, sd, 'cm'),
                            sol: R`Step 1: let the side be ${m('x')}. The top of the square is parallel to BC, so the triangle above it and ABC form a pyramid. Step 2: its base ${m('x')} and height ${m(`${a}-x`)} match ${b} and ${a}: ${m(R`\frac{x}{${b}}=\frac{${a}-x}{${a}}`)}. So ${m(`${a}x=${b}(${a}-x)`)}, ${m(`${a + b}x=${a * b}`)} and ${m(`x=${T.frac(a * b, a + b)}`)} cm.${end}`,
                        };
                    }
                },
            },
        ],

        assignment: [
            ['corresponding', 3], ['perimeter-area', 4], ['pyramid-basic', 4], ['hourglass-basic', 4],
            ['pyramid-pieces', 4], ['hourglass-whole', 3], ['pyramid-area', 3], ['area-to-length', 3], ['butterfly', 3], ['chain-two-pyramids', 4], ['shadows', 3],
            ['chain-trapezoid', 3], ['chain-parallelogram', 3], ['parallel-cuts', 3], ['inscribed-square', 3],
        ],
    });
})();
