/* Worksheet: Geometry Practice — area, perimeter, volume, angles and naming shapes. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, F = CA.fig, C = F.colors;

    // ── Figure helpers ───────────────────────────────────────────────────
    const deg = x => x * 180 / Math.PI, rad = x => x * Math.PI / 180;
    const norm = a => ((a % 360) + 360) % 360;
    /** Fit maths points (y up) into a box. Returns pixel points and the svg size. */
    function fit(pts, maxW = 190, maxH = 115, padX = 44, padY = 24, squash = 0) {
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        let sx = maxW / Math.max(x1 - x0, 1e-9), sy = maxH / Math.max(y1 - y0, 1e-9);
        if (squash) { sx = Math.min(sx, sy * squash); sy = Math.min(sy, sx * squash); }   // not to scale, but never too thin
        else sx = sy = Math.min(sx, sy);
        const map = p => [padX + (p[0] - x0) * sx, padY + (y1 - p[1]) * sy];
        return { map, P: pts.map(map), W: (x1 - x0) * sx + 2 * padX, H: (y1 - y0) * sy + 2 * padY, s: sx };
    }
    /** Text with a white halo, readable on top of lines. */
    const htext = (x, y, s, opt = {}) => F.text(x, y, s, opt).replace('stroke="none"', 'stroke="#ffffff" stroke-width="3" paint-order="stroke"');
    /** Text placed just off a point in the direction (nx, ny) (pixels, y down). */
    function lab(x, y, nx, ny, text, off = 7, opt = {}) {
        const anchor = nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle';
        return F.text(x + nx * off, y + ny * off + 4.5 + ny * 3, text, { anchor, ...opt });
    }
    const centroid = P => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
    /** Label the edge P[i]–P[j] on the outside of the shape. */
    function edgeLabel(P, i, j, text, cen = centroid(P), off = 7) {
        const [x1, y1] = P[i], [x2, y2] = P[j], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        let nx = -(y2 - y1), ny = x2 - x1; const L = Math.hypot(nx, ny); nx /= L; ny /= L;
        if ((mx - cen[0]) * nx + (my - cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
        return lab(mx, my, nx, ny, text, off);
    }
    /** Arc marking the angle at V between rays to A and B, with a label. */
    function angleMark(V, A, B, label, r = 15, opt = {}) {
        const a1 = deg(Math.atan2(-(A[1] - V[1]), A[0] - V[0])), a2 = deg(Math.atan2(-(B[1] - V[1]), B[0] - V[0]));
        let s = norm(a1), d = norm(a2 - a1);
        if (d > 180) { s = norm(a2); d = 360 - d; }
        let out = Math.abs(d - 90) < 0.01 && !opt.arc
            ? F.rightAngle(V[0], V[1], A[0] - V[0], A[1] - V[1], B[0] - V[0], B[1] - V[1], 10)
            : F.arc(V[0], V[1], r, s, s + d, { width: 1.2, stroke: opt.stroke || C.INK });
        if (label) {
            const dist = Math.min(opt.max || 48, Math.max(r + 13, 15 / Math.sin(rad(Math.max(d, 8)) / 2), label.length > 4 ? 14 + 3.4 * label.length : 0));
            const [x, y] = F.polar(V[0], V[1], dist, s + d / 2);
            out += htext(x, y + 4.5, label, { size: 12, fill: opt.fill || C.INK, bold: !!opt.bold });
        }
        return out;
    }
    /** Small tick marks across the middle of a side (n = 1, 2) to show equal sides. */
    function ticks(A, B, n = 1) {
        const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, L = Math.hypot(B[0] - A[0], B[1] - A[1]);
        const ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L, px = -uy * 5, py = ux * 5;
        let s = '';
        for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * 4; s += F.line(mx + ux * o - px, my + uy * o - py, mx + ux * o + px, my + uy * o + py, { width: 1.2 }); }
        return s;
    }
    /**
     * A convex polygon with the given interior angles (degrees, in order A, B, C, …).
     * The first sides have the given lengths; the last two are solved so the shape closes.
     */
    function polyFromAngles(angles, sides) {
        const n = angles.length, dirs = [0];
        for (let i = 1; i < n; i++) dirs.push(dirs[i - 1] + 180 - angles[i]);
        const u = dirs.map(d => [Math.cos(rad(d)), Math.sin(rad(d))]);
        let px = 0, py = 0;
        for (let i = 0; i < n - 2; i++) { px += sides[i] * u[i][0]; py += sides[i] * u[i][1]; }
        // s_{n-2} u_{n-2} + s_{n-1} u_{n-1} = -(px, py)
        const [a, b] = u[n - 2], [c, d] = u[n - 1], det = a * d - b * c;
        const sA = (-px * d + py * c) / det, sB = (-a * py + b * px) / det;
        if (!(sA > 0 && sB > 0)) return null;
        const all = sides.slice(0, n - 2).concat([sA, sB]);
        const pts = [[0, 0]];
        for (let i = 0; i < n - 1; i++) pts.push([pts[i][0] + all[i] * u[i][0], pts[i][1] + all[i] * u[i][1]]);
        return { pts, sides: all };
    }
    /** Polygon figure with angle labels at each vertex (labels[i] may be null). */
    function anglePolyFig(pts, labels, extra = '') {
        const f = fit(pts, 190, 115, 30, 22), P = f.P, n = P.length;
        let b = F.poly(P, { fill: C.FILL });
        for (let i = 0; i < n; i++) if (labels[i]) b += angleMark(P[i], P[(i + n - 1) % n], P[(i + 1) % n], labels[i], 14, labels[i].includes('x') ? { fill: C.ACCENT, bold: true } : {});
        return F.svg(f.W, f.H, b + extra, { label: 'polygon' });
    }
    /** Rays from a centre point: dirs in degrees (ascending); labels for the gaps between consecutive rays. */
    function raysFig(dirs, labels, opt = {}) {
        const W = 230, H = opt.line ? 110 : 170, cx = W / 2, cy = opt.line ? 85 : H / 2, L = opt.line ? 95 : 72;
        let b = '';
        if (opt.line) b += F.line(cx - L - 10, cy, cx + L + 10, cy);
        for (const d of dirs) { if (opt.line && (d === 0 || d === 180)) continue; const [x, y] = F.polar(cx, cy, L, d); b += F.line(cx, cy, x, y); }
        const n = dirs.length;
        for (let i = 0; i < labels.length; i++) {
            if (!labels[i]) continue;
            const a0 = dirs[i], a1 = i + 1 < n ? dirs[i + 1] : dirs[0] + 360;
            const A = F.polar(cx, cy, 10, a0), B = F.polar(cx, cy, 10, a1);
            b += angleMark([cx, cy], A, B, labels[i], 14 + (i % 2) * 5, { arc: true, max: 60, ...(labels[i].includes('x') ? { fill: C.ACCENT, bold: true } : {}) });
        }
        b += F.dot(cx, cy);
        return F.svg(W, H, b, { label: 'angles' });
    }
    const regular = (n, r = 1, start = 90) => Array.from({ length: n }, (_, i) => [r * Math.cos(rad(start + 360 * i / n)), r * Math.sin(rad(start + 360 * i / n))]);

    // ── Shapes with labelled sides ───────────────────────────────────────
    const UNITS = ['cm', 'm', 'in', 'ft', 'mm'];
    function rectFig(l, w, labL, labW, opt = {}) {
        const f = fit([[0, 0], [l, 0], [l, w], [0, w]], 170, 100, 44, 24, 3.5), P = f.P;
        let b = F.poly(P, { fill: C.FILL }) + F.rightAngle(P[0][0], P[0][1], 1, 0, 0, -1, 8);
        if (labL) b += edgeLabel(P, 0, 1, labL);
        if (labW) b += edgeLabel(P, 1, 2, labW);
        if (opt.square) for (let i = 0; i < 4; i++) b += ticks(P[i], P[(i + 1) % 4]);
        return F.svg(f.W, f.H, b, { label: 'rectangle' });
    }
    /** Triangle (0,0)-(b,0)-(o,h) with a dashed height. */
    function triFig(bse, h, o, labB, labH, extra = {}) {
        const pts = [[0, 0], [bse, 0], [o, h]];
        const xs = [0, bse, o];
        const f = fit(pts.concat([[Math.min(...xs), 0], [Math.max(...xs), 0]]), 170, 100, 44, 24, 1.5), P = [f.map(pts[0]), f.map(pts[1]), f.map(pts[2])];
        const foot = f.map([o, 0]);
        let b = F.poly(P, { fill: C.FILL });
        if (o < 0 || o > bse) b += F.line(o < 0 ? foot[0] : P[1][0], P[0][1], o < 0 ? P[0][0] : foot[0], P[0][1], { dash: true, width: 1 });
        if (o !== 0 && o !== bse) b += F.line(P[2][0], P[2][1], foot[0], foot[1], { dash: true, width: 1.2 }) + F.rightAngle(foot[0], foot[1], o > bse / 2 ? -1 : 1, 0, 0, -1, 7);
        else b += F.rightAngle(foot[0], foot[1], o === 0 ? 1 : -1, 0, 0, -1, 8);
        b += edgeLabel(P, 0, 1, labB);
        const hx = foot[0] + (o === 0 ? -6 : o === bse ? 6 : (o > bse / 2 ? -5 : 5));
        b += htext(hx, (P[2][1] + foot[1]) / 2 + 4, labH, { anchor: o === 0 ? 'end' : o === bse ? 'start' : (o > bse / 2 ? 'end' : 'start') });
        if (extra.slant) b += edgeLabel(P, extra.slant[0], extra.slant[1], extra.slant[2]);
        return F.svg(f.W, f.H, b, { label: 'triangle' });
    }
    /** Triangle from three side lengths a (BC), b (CA), c (AB) with AB on the bottom. */
    function sssPts(a, b, c) { const x = (b * b + c * c - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(b * b - x * x)]]; }
    function sphereFig(label) {
        const r = 58, cx = 95, cy = 70;
        return F.svg(190, 140, F.circle(cx, cy, r, { fill: C.FILL })
            + F.path(`M${cx - r} ${cy}A${r} ${r * 0.28} 0 0 0 ${cx + r} ${cy}`, { width: 1 })
            + F.path(`M${cx - r} ${cy}A${r} ${r * 0.28} 0 0 1 ${cx + r} ${cy}`, { width: 1, dash: true })
            + F.line(cx, cy, cx + r * Math.cos(rad(35)), cy - r * Math.sin(rad(35)), { width: 1.2 }) + F.dot(cx, cy)
            + F.text(cx + 20, cy - 26, label, { anchor: 'end', size: 12 }), { label: 'sphere' });
    }
    function circleFig(r, label, diameter) {
        const R0 = 52, cx = 90, cy = 64;
        let b = F.circle(cx, cy, R0, { fill: C.FILL }) + F.dot(cx, cy);
        if (diameter) b += F.line(cx - R0, cy, cx + R0, cy, { width: 1.2 }) + F.text(cx, cy - 6, label, { size: 12 });
        else { const [x, y] = F.polar(cx, cy, R0, 30); b += F.line(cx, cy, x, y, { width: 1.2 }) + F.text((cx + x) / 2 - 4, (cy + y) / 2 - 6, label, { size: 12, anchor: 'end' }); }
        return F.svg(180, 128, b, { label: 'circle' });
    }
    function pyramidFig(sLab, hLab) {
        const L = 110, D = 50, Dy = 34, Hp = 110, x0 = 30, y0 = 150;
        const A = [x0, y0], B = [x0 + L, y0], Cc = [x0 + L + D, y0 - Dy], Dd = [x0 + D, y0 - Dy];
        const O = [x0 + (L + D) / 2, y0 - Dy / 2], T = [O[0], O[1] - Hp];
        let b = F.poly([A, B, T], { fill: C.FILL }) + F.poly([B, Cc, T], { fill: C.SHADE });
        b += F.line(A[0], A[1], Dd[0], Dd[1], { dash: true, width: 1 }) + F.line(Dd[0], Dd[1], Cc[0], Cc[1], { dash: true, width: 1 }) + F.line(Dd[0], Dd[1], T[0], T[1], { dash: true, width: 1 });
        b += F.line(T[0], T[1], O[0], O[1], { dash: true, width: 1.2, stroke: C.ACCENT }) + F.rightAngle(O[0], O[1], 1, 0, 0, -1, 6) + F.dot(O[0], O[1], { r: 2 });
        b += F.text((A[0] + B[0]) / 2, y0 + 16, sLab) + htext(O[0] + 5, O[1] - Hp * 0.3, hLab, { anchor: 'start', size: 12 });
        return F.svg(x0 + L + D + 24, y0 + 22, b, { label: 'square pyramid' });
    }
    const an = n => (/^(8|11|18|8\d)$/.test(String(n)) ? 'An' : 'A');
    /** Cylinder and cone with labels kept off the outline. */
    function cylFig(r, h, lab) {
        const s = Math.min(110 / (2 * r), 120 / h, 14), rx = r * s, ry = Math.max(rx * 0.28, 4), Ht = h * s;
        const W = 2 * rx + 100, cx = W / 2, top = ry + 22, bot = top + Ht, HH = bot + ry + 8;
        let b = F.path(`M${cx - rx} ${top}L${cx - rx} ${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}L${cx + rx} ${top}Z`, { fill: C.FILL });
        b += F.path(`M${cx - rx} ${bot}A${rx} ${ry} 0 0 1 ${cx + rx} ${bot}`, { dash: true, width: 1 }) + F.ellipse(cx, top, rx, ry, { fill: '#f5f7ff' });
        if (lab.d) b += F.line(cx - rx, top, cx + rx, top, { width: 1.2 }) + F.text(cx, top - ry - 5, lab.d, { size: 12 });
        else b += F.line(cx, top, cx + rx, top, { width: 1.2 }) + F.dot(cx, top, { r: 2 }) + F.text(cx + rx / 2, top - ry - 5, lab.r, { size: 12 });
        b += F.text(cx + rx + 6, (top + bot) / 2 + 4, lab.h, { anchor: 'start', size: 12 });
        return F.svg(W, HH, b, { label: 'cylinder' });
    }
    function coneFig(r, h, lab) {
        const s = Math.min(130 / (2 * r), 115 / h, 14), rx = r * s, ry = Math.max(rx * 0.28, 4), Ht = h * s;
        const W = 2 * rx + 110, cx = W / 2, top = 10, bot = top + Ht, HH = bot + ry + 22;
        let b = F.path(`M${cx} ${top}L${cx - rx} ${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}Z`, { fill: C.FILL });
        b += F.path(`M${cx - rx} ${bot}A${rx} ${ry} 0 0 1 ${cx + rx} ${bot}`, { dash: true, width: 1 });
        b += F.line(cx, top, cx, bot, { dash: true, width: 1 }) + F.rightAngle(cx, bot, 0, -1, 1, 0, 6) + F.line(cx, bot, cx + rx, bot, { width: 1.2 }) + F.dot(cx, bot, { r: 2 });
        b += F.text(cx - rx * (1 - 0.5) - 8, top + Ht * 0.5 + 4, lab.h, { anchor: 'end', size: 12 });
        b += F.line(cx - rx * 0.5 - 6, top + Ht * 0.5, cx - 2, top + Ht * 0.5, { width: 0.8, dash: '2 2' });
        b += F.text(cx + rx / 2, bot + ry + 15, lab.r, { size: 12 });
        if (lab.l) b += F.text(cx + rx * 0.5 + 8, top + Ht * 0.5, lab.l, { anchor: 'start', size: 12 });
        return F.svg(W, HH, b, { label: 'cone' });
    }
    const pi314 = x => Math.round(x * 314) / 100;   // x × 3.14, exact to 2 dp

    CA.register({
        id: 'geometry',
        title: 'Geometry Practice',
        page: 'geometry.html',
        assignmentNote: 'Give each answer with its unit. Leave answers "in terms of π" as a multiple of π; when told to use π ≈ 3.14, give the decimal. Figures are not drawn to scale unless the question says so.',

        practice: [
            {
                id: 'rect-square', name: 'Rectangles and squares', level: 1,
                gen(rng) {
                    const u = rng.pick(UNITS), sq = rng.bool(0.35), area = rng.bool();
                    const l = rng.int(3, 15), w = sq ? l : rng.int(2, 12);
                    if (!sq && w === l) return this.gen(rng);
                    const val = area ? l * w : 2 * (l + w), unit = area ? `${u}²` : u;
                    const ctx = rng.int(0, 2);
                    let q, fig = null;
                    if (ctx === 0) {
                        q = `Find the ${area ? 'area' : 'perimeter'} of the ${sq ? 'square' : 'rectangle'}.`;
                        fig = sq ? rectFig(l, l, `${l} ${u}`, '', { square: true }) : rectFig(l, w, `${l} ${u}`, `${w} ${u}`);
                    } else if (sq) {
                        const thing = rng.pick(['square garden', 'square tile', 'square photo', 'square playground']);
                        q = area ? `A ${thing} has sides of ${l} ${u}. What is its area?` : `A ${thing} has sides of ${l} ${u}. How far is it all the way around the edge?`;
                    } else {
                        const thing = rng.pick(['rug', 'garden bed', 'poster', 'swimming pool', 'table top', 'field']);
                        q = area ? `A rectangular ${thing} is ${l} ${u} long and ${w} ${u} wide. What is its area?` : `A rectangular ${thing} is ${l} ${u} long and ${w} ${u} wide. What is its perimeter?`;
                    }
                    const sol = area ? (sq ? R`Area \(= s^2 = ${l}^2 = ${val}\) ${unit}.` : R`Area \(= l \times w = ${l}\times${w} = ${val}\) ${unit}.`)
                        : (sq ? R`Perimeter \(= 4s = 4\times${l} = ${val}\) ${unit}.` : R`Perimeter \(= 2(l + w) = 2(${l}+${w}) = ${val}\) ${unit}.`);
                    return { q, fig, ans: CA.num(val, unit), sol };
                },
            },
            {
                id: 'triangle-area', name: 'Area of a triangle', level: 1,
                gen(rng) {
                    const u = rng.pick(UNITS);
                    if (rng.bool(0.3)) {                                         // right triangle with all three sides shown
                        const [p, q2, r] = rng.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [9, 12, 15], [8, 15, 17]]);
                        const fig = (() => {
                            const f = fit([[0, 0], [p, 0], [0, q2]], 150, 100), P = f.P;
                            return F.svg(f.W, f.H, F.poly(P, { fill: C.FILL }) + F.rightAngle(P[0][0], P[0][1], 1, 0, 0, -1, 8)
                                + edgeLabel(P, 0, 1, `${p} ${u}`) + edgeLabel(P, 0, 2, `${q2} ${u}`) + edgeLabel(P, 1, 2, `${r} ${u}`), { label: 'right triangle' });
                        })();
                        return {
                            q: 'Find the area of the right triangle.', fig, ans: CA.num(p * q2 / 2, `${u}²`),
                            sol: R`The two sides at the right angle are the base and height: \(\tfrac12\times${p}\times${q2} = ${p * q2 / 2}\) ${u}². The ${r} ${u} side is not needed.`,
                        };
                    }
                    const b = rng.int(4, 16), h = rng.int(3, 12), o = rng.pick([0.25, 0.4, 0.6, 0.75]) * b;
                    const word = rng.bool(0.3);
                    return {
                        q: word ? `A triangle has a base of ${b} ${u} and a height of ${h} ${u}. What is its area?` : 'Find the area of the triangle.',
                        fig: word ? null : triFig(b, h, o, `${b} ${u}`, `${h} ${u}`),
                        ans: CA.num(b * h / 2, `${u}²`),
                        sol: R`Area \(= \tfrac12 \times b \times h = \tfrac12\times${b}\times${h} = ${b * h / 2}\) ${u}².`,
                    };
                },
            },
            {
                id: 'angle-basics', name: 'Missing angles: triangle and straight line', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const a = rng.int(30, 80), b = rng.int(30, 80), x = 180 - a - b;
                        const pos = rng.int(0, 2), angs = [a, b, x];
                        // rotate so the unknown sits at a random corner
                        const order = [[0, 1, 2], [2, 0, 1], [1, 2, 0]][pos], A3 = order.map(i => angs[i]);
                        const sh = polyFromAngles(A3, [1]);
                        const labels = order.map(i => (i === 2 ? 'x' : `${angs[i]}°`));
                        return {
                            q: R`Find the missing angle \(x\) in the triangle.`, fig: anglePolyFig(sh.pts, labels),
                            ans: CA.num(x, '°'), sol: R`Angles in a triangle add to 180°: \(x = 180 - ${a} - ${b} = ${x}\)°.`,
                        };
                    }
                    if (kind === 1) {
                        const a = rng.int(35, 145), x = 180 - a, left = rng.bool();
                        const fig = raysFig([0, left ? x : a, 180], left ? ['x', `${a}°`] : [`${a}°`, 'x'], { line: true });
                        return { q: R`The angles lie on a straight line. Find \(x\).`, fig, ans: CA.num(x, '°'), sol: R`Angles on a straight line add to 180°: \(x = 180 - ${a} = ${x}\)°.` };
                    }
                    let a, b, x;
                    do { a = rng.int(30, 80); b = rng.int(30, 80); x = 180 - a - b; } while (x < 30);
                    const labels = rng.shuffle([`${a}°`, `${b}°`, 'x']), vals = labels.map(l => (l === 'x' ? x : Number(l.slice(0, -1))));
                    const dirs = [0, vals[0], vals[0] + vals[1], 180];
                    return { q: R`Three angles lie on a straight line. Find \(x\).`, fig: raysFig(dirs, labels, { line: true }), ans: CA.num(x, '°'), sol: R`They add to 180°: \(x = 180 - ${a} - ${b} = ${x}\)°.` };
                },
            },
            {
                id: 'identify-shape', name: 'Naming shapes', level: 1,
                gen(rng) {
                    const SH = {
                        Square: () => { const P = fit([[0, 0], [1, 0], [1, 1], [0, 1]], 90, 90, 20, 14); let b = F.poly(P.P, { fill: C.FILL }); for (let i = 0; i < 4; i++) b += ticks(P.P[i], P.P[(i + 1) % 4]) + F.rightAngle(P.P[i][0], P.P[i][1], P.P[(i + 1) % 4][0] - P.P[i][0], P.P[(i + 1) % 4][1] - P.P[i][1], P.P[(i + 3) % 4][0] - P.P[i][0], P.P[(i + 3) % 4][1] - P.P[i][1], 7); return F.svg(P.W, P.H, b); },
                        Rectangle: () => { const P = fit([[0, 0], [1.9, 0], [1.9, 1], [0, 1]], 150, 80, 20, 14); let b = F.poly(P.P, { fill: C.FILL }); for (let i = 0; i < 4; i++) b += F.rightAngle(P.P[i][0], P.P[i][1], P.P[(i + 1) % 4][0] - P.P[i][0], P.P[(i + 1) % 4][1] - P.P[i][1], P.P[(i + 3) % 4][0] - P.P[i][0], P.P[(i + 3) % 4][1] - P.P[i][1], 7); return F.svg(P.W, P.H, b); },
                        Triangle: () => { const P = fit([[0, 0], [1.6, 0], [0.6, 1.2]], 120, 90, 20, 14); return F.svg(P.W, P.H, F.poly(P.P, { fill: C.FILL })); },
                        Pentagon: () => { const P = fit(regular(5), 100, 100, 20, 14); return F.svg(P.W, P.H, F.poly(P.P, { fill: C.FILL })); },
                        Hexagon: () => { const P = fit(regular(6, 1, 0), 110, 100, 20, 14); return F.svg(P.W, P.H, F.poly(P.P, { fill: C.FILL })); },
                        Octagon: () => { const P = fit(regular(8, 1, 22.5), 100, 100, 20, 14); return F.svg(P.W, P.H, F.poly(P.P, { fill: C.FILL })); },
                        Parallelogram: () => { const P = fit([[0, 0], [1.6, 0], [2.2, 0.9], [0.6, 0.9]], 150, 80, 20, 14); let b = F.poly(P.P, { fill: C.FILL }) + ticks(P.P[0], P.P[1], 1) + ticks(P.P[3], P.P[2], 1) + ticks(P.P[1], P.P[2], 2) + ticks(P.P[0], P.P[3], 2); return F.svg(P.W, P.H, b); },
                        Trapezoid: () => { const P = fit([[0, 0], [2.2, 0], [1.6, 1], [0.5, 1]], 150, 80, 20, 14); return F.svg(P.W, P.H, F.poly(P.P, { fill: C.FILL })); },
                        Rhombus: () => { const P = fit([[0, 0], [1.2, 0], [1.92, 0.96], [0.72, 0.96]], 140, 90, 20, 14); let b = F.poly(P.P, { fill: C.FILL }); for (let i = 0; i < 4; i++) b += ticks(P.P[i], P.P[(i + 1) % 4]); return F.svg(P.W, P.H, b); },
                        Circle: () => F.svg(110, 100, F.circle(55, 50, 40, { fill: C.FILL })),
                    };
                    const names = Object.keys(SH);
                    const quads = ['Square', 'Rectangle', 'Parallelogram', 'Trapezoid', 'Rhombus'];
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const name = rng.pick(names);
                        const pool = quads.includes(name) ? quads : names;
                        const wrong = rng.sample(pool.filter(n => n !== name), 3);
                        if (wrong.length < 3) wrong.push(...rng.sample(names.filter(n => n !== name && !wrong.includes(n)), 3 - wrong.length));
                        return { q: 'What is the name of this shape?', fig: SH[name](), ans: CA.mc(rng, name, wrong), sol: `It is a ${name.toLowerCase()}.` + ({ Square: ' Four equal sides and four right angles.', Rectangle: ' Four right angles, opposite sides equal.', Parallelogram: ' Two pairs of parallel sides; the side lengths are not all equal and there are no right angles.', Trapezoid: ' Exactly one pair of parallel sides.', Rhombus: ' Four equal sides but no right angles.', Pentagon: ' It has 5 sides.', Hexagon: ' It has 6 sides.', Octagon: ' It has 8 sides.', Triangle: ' It has 3 sides.', Circle: ' Round, with no corners.' })[name] };
                    }
                    if (kind === 1) {
                        const props = [
                            ['Trapezoid', 'has exactly one pair of parallel sides', ['Parallelogram', 'Rectangle', 'Rhombus']],
                            ['Rhombus', 'has four equal sides but no right angles', ['Square', 'Rectangle', 'Trapezoid']],
                            ['Square', 'has four equal sides and four right angles', ['Rhombus', 'Rectangle', 'Parallelogram']],
                            ['Rectangle', 'has four right angles but not all four sides equal', ['Square', 'Rhombus', 'Trapezoid']],
                            ['Circle', 'is round and has no corners', ['Hexagon', 'Octagon', 'Pentagon']],
                            ['Hexagon', 'has six straight sides', ['Pentagon', 'Octagon', 'Triangle']],
                            ['Pentagon', 'has five straight sides', ['Hexagon', 'Octagon', 'Rectangle']],
                            ['Octagon', 'has eight straight sides', ['Hexagon', 'Pentagon', 'Circle']],
                            ['Parallelogram', 'has two pairs of parallel sides, no right angles, and two different side lengths', ['Rhombus', 'Trapezoid', 'Rectangle']],
                        ];
                        const [name, text, wrong] = rng.pick(props);
                        return { q: `Which shape ${text}?`, ans: CA.mc(rng, name, wrong), sol: `A ${name.toLowerCase()} ${text}.` };
                    }
                    const [name, n] = rng.pick([['quadrilateral', 4], ['pentagon', 5], ['hexagon', 6], ['heptagon', 7], ['octagon', 8], ['decagon', 10]]);
                    const what = rng.pick(['sides', 'corners (vertices)']);
                    if (rng.bool(0.4)) {
                        const k = rng.int(2, 5);
                        return { q: `How many ${what} do ${k} ${name}s have altogether?`, ans: CA.num(k * n), sol: `A ${name} has ${n} ${what}, so ${k} of them have \\(${k}\\times${n} = ${k * n}\\).` };
                    }
                    return { q: `How many ${what} does a ${name} have?`, ans: CA.num(n), sol: `A ${name} has ${n} sides and ${n} corners.` };
                },
            },
            {
                id: 'para-trap', name: 'Parallelograms and trapezoids', level: 2,
                gen(rng) {
                    const u = rng.pick(UNITS);
                    if (rng.bool()) {
                        const k = rng.pick([1, 1, 2, 3]), [o0, h0, s0] = rng.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [6, 8, 10]]);
                        const o = o0 * k, h = h0 * k, s = s0 * k;
                        if (h > 24) return this.gen(rng);
                        const b = rng.int(Math.max(o, 5), Math.max(o, 5) + 12);
                        const f = fit([[0, 0], [b, 0], [b + o, h], [o, h]], 190, 100, 44, 24, 1.6), P = f.P, foot = f.map([o, 0]);
                        let g = F.poly(P, { fill: C.FILL }) + F.line(P[3][0], P[3][1], foot[0], foot[1], { dash: true, width: 1.2 }) + F.rightAngle(foot[0], foot[1], 1, 0, 0, -1, 7);
                        g += edgeLabel(P, 0, 1, `${b} ${u}`) + edgeLabel(P, 3, 0, `${s} ${u}`) + htext(foot[0] + 5, (P[3][1] + foot[1]) / 2 + 4, `${h} ${u}`, { anchor: 'start' });
                        return {
                            q: 'Find the area of the parallelogram.', fig: F.svg(f.W, f.H, g, { label: 'parallelogram' }), ans: CA.num(b * h, `${u}²`),
                            sol: R`Area \(= \text{base}\times\text{height} = ${b}\times${h} = ${b * h}\) ${u}². Use the dashed (perpendicular) height, not the slanted ${s} ${u} side.`,
                        };
                    }
                    const b1 = rng.int(8, 20), b2 = rng.int(3, b1 - 3), h = rng.int(3, 12);
                    const o1 = (b1 - b2) * rng.pick([0.25, 0.4, 0.5, 0.65]);
                    const f = fit([[0, 0], [b1, 0], [o1 + b2, h], [o1, h]], 190, 100, 44, 24, 1.6), P = f.P, foot = f.map([o1, 0]);
                    let g = F.poly(P, { fill: C.FILL }) + F.line(P[3][0], P[3][1], foot[0], foot[1], { dash: true, width: 1.2 }) + F.rightAngle(foot[0], foot[1], 1, 0, 0, -1, 7);
                    g += edgeLabel(P, 0, 1, `${b1} ${u}`) + edgeLabel(P, 2, 3, `${b2} ${u}`) + htext(foot[0] + 5, (P[3][1] + foot[1]) / 2 + 4, `${h} ${u}`, { anchor: 'start' });
                    const area = (b1 + b2) * h / 2;
                    return {
                        q: 'The top and bottom sides are parallel. Find the area of the trapezoid.', fig: F.svg(f.W, f.H, g, { label: 'trapezoid' }), ans: CA.num(area, `${u}²`),
                        sol: R`Area \(= \tfrac12(b_1 + b_2)h = \tfrac12(${b1}+${b2})\times${h} = ${area}\) ${u}².`,
                    };
                },
            },
            {
                id: 'circle', name: 'Circles: area and circumference', level: 2,
                gen(rng) {
                    const u = rng.pick(['cm', 'm', 'in', 'mm']), r = rng.int(2, 12), useD = rng.bool(0.4), area = rng.bool(), exact = rng.bool();
                    const given = useD ? `a diameter of ${2 * r} ${u}` : `a radius of ${r} ${u}`;
                    const fig = rng.bool(0.6) ? circleFig(r, useD ? `${2 * r} ${u}` : `${r} ${u}`, useD) : null;
                    const thing = rng.pick(['A circle', 'A round pizza', 'A circular pond', 'A round table top', 'A circular flower bed']);
                    const q0 = fig ? `The circle has ${given}.` : `${thing} has ${given}.`;
                    const how = exact ? R`Give your answer in terms of \(\pi\).` : R`Use \(\pi \approx 3.14\).`;
                    const half = useD ? R`The radius is \(${2 * r} \div 2 = ${r}\). ` : '';
                    if (area) {
                        return {
                            q: `${q0} Find its area. ${how}`, fig,
                            ans: exact ? CA.pi(r * r, 1, `${u}²`) : CA.num(pi314(r * r), `${u}²`, { tol: 0.01 }),
                            sol: half + (exact ? R`\(A = \pi r^2 = \pi\times${r}^2 = ${r * r}\pi\) ${u}².` : R`\(A = \pi r^2 \approx 3.14\times${r * r} = ${pi314(r * r)}\) ${u}².`),
                        };
                    }
                    return {
                        q: `${q0} Find its circumference. ${how}`, fig,
                        ans: exact ? CA.pi(2 * r, 1, u) : CA.num(pi314(2 * r), u, { tol: 0.01 }),
                        sol: exact ? R`\(C = 2\pi r = ${useD ? R`\pi d = \pi\times${2 * r}` : R`2\pi\times${r}`} = ${2 * r}\pi\) ${u}.` : R`\(C = 2\pi r \approx 2\times3.14\times${r} = ${pi314(2 * r)}\) ${u}.`,
                    };
                },
            },
            {
                id: 'prism-cube', name: 'Cubes and rectangular prisms', level: 2,
                gen(rng) {
                    const u = rng.pick(['cm', 'm', 'in', 'ft']), cube = rng.bool(0.35), vol = rng.bool(0.6);
                    const l = rng.int(3, 12), w = cube ? l : rng.int(2, 10), h = cube ? l : rng.int(2, 10);
                    const V = l * w * h, S = 2 * (l * w + l * h + w * h);
                    const fig = F.box(l, w, h, { labels: cube ? [`${l} ${u}`, '', ''] : [`${l} ${u}`, `${w} ${u}`, `${h} ${u}`], max: 120 });
                    const name = cube ? 'cube' : 'rectangular prism';
                    if (vol) {
                        const ctx = !cube && rng.bool(0.4) ? rng.pick(['fish tank', 'shoe box', 'sandpit', 'storage chest']) : null;
                        return {
                            q: ctx ? `A ${ctx} is a rectangular prism ${l} ${u} long, ${w} ${u} wide and ${h} ${u} high. Find its volume.` : `Find the volume of the ${name}.`,
                            fig: ctx ? null : fig, ans: CA.num(V, `${u}³`),
                            sol: cube ? R`\(V = s^3 = ${l}^3 = ${V}\) ${u}³.` : R`\(V = l\times w\times h = ${l}\times${w}\times${h} = ${V}\) ${u}³.`,
                        };
                    }
                    return {
                        q: `Find the total surface area of the ${name}.`, fig, ans: CA.num(S, `${u}²`),
                        sol: cube ? R`Six square faces: \(6s^2 = 6\times${l * l} = ${S}\) ${u}².` : R`\(2(lw + lh + wh) = 2(${l * w} + ${l * h} + ${w * h}) = ${S}\) ${u}².`,
                    };
                },
            },
            {
                id: 'cyl-sphere', name: 'Cylinders and spheres', level: 2,
                gen(rng) {
                    const u = rng.pick(['cm', 'm', 'in']), kind = rng.int(0, 2);
                    if (kind === 2) {
                        const r = rng.int(1, 9);
                        return {
                            q: R`Find the volume of the sphere. Give your answer in terms of \(\pi\).`, fig: sphereFig(`${r} ${u}`), ans: CA.pi(4 * r ** 3, 3, `${u}³`),
                            sol: R`\(V = \tfrac43\pi r^3 = \tfrac43\pi\times${r ** 3} = ${CA.tex.pi(4 * r ** 3, 3)}\) ${u}³.`,
                        };
                    }
                    const r = rng.int(2, 8), h = rng.int(Math.max(3, r), Math.min(15, 3 * r)), useD = rng.bool(0.3);
                    const fig = cylFig(r, h, useD ? { d: `${2 * r} ${u}`, h: `${h} ${u}` } : { r: `${r} ${u}`, h: `${h} ${u}` });
                    const pre = useD ? R`The radius is \(${2 * r}\div 2 = ${r}\). ` : '';
                    if (kind === 0) return {
                        q: R`Find the volume of the cylinder. Give your answer in terms of \(\pi\).`, fig, ans: CA.pi(r * r * h, 1, `${u}³`),
                        sol: pre + R`\(V = \pi r^2 h = \pi\times${r * r}\times${h} = ${r * r * h}\pi\) ${u}³.`,
                    };
                    const V = pi314(r * r * h);
                    return {
                        q: R`Find the volume of the cylinder. Use \(\pi \approx 3.14\).`, fig, ans: CA.num(V, `${u}³`, { tol: 0.01 }),
                        sol: pre + R`\(V = \pi r^2 h \approx 3.14\times${r * r}\times${h} = ${V}\) ${u}³.`,
                    };
                },
            },
            {
                id: 'angles-point-quad', name: 'Angles at a point and in a quadrilateral', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        let a;
                        do { a = [rng.int(40, 130), rng.int(40, 130), rng.int(40, 120)]; } while (360 - a[0] - a[1] - a[2] < 40);
                        const x = 360 - a[0] - a[1] - a[2], idx = rng.shuffle([0, 1, 2, 3]), all = [...a, x], vals = idx.map(i => all[i]);
                        const start = rng.int(0, 40), dirs = [start];
                        for (let i = 0; i < 3; i++) dirs.push(dirs[i] + vals[i]);
                        return {
                            q: R`Four angles meet at a point. Find \(x\).`, fig: raysFig(dirs, idx.map(i => (i === 3 ? 'x' : `${all[i]}°`)), {}),
                            ans: CA.num(x, '°'), sol: R`Angles around a point add to 360°: \(x = 360 - ${a[0]} - ${a[1]} - ${a[2]} = ${x}\)°.`,
                        };
                    }
                    if (kind === 1) {
                        for (;;) {
                            const A = rng.int(60, 130), B = rng.int(60, 130), Cc = rng.int(60, 130), D = 360 - A - B - Cc;
                            if (D < 60 || D > 135) continue;
                            const sh = polyFromAngles([A, B, Cc, D], [rng.int(10, 16), rng.int(8, 14)]);
                            if (!sh || Math.max(...sh.sides) / Math.min(...sh.sides) > 1.7) continue;
                            const xi = rng.int(0, 3), vals = [A, B, Cc, D], given = vals.filter((_, i) => i !== xi);
                            return {
                                q: R`Find the missing angle \(x\) in the quadrilateral.`, fig: anglePolyFig(sh.pts, vals.map((v, i) => (i === xi ? 'x' : `${v}°`))),
                                ans: CA.num(vals[xi], '°'), sol: R`Angles in a quadrilateral add to 360°: \(x = 360 - ${given.join(' - ')} = ${vals[xi]}\)°.`,
                            };
                        }
                    }
                    // vertically opposite / adjacent angles at a crossing
                    const a = rng.int(35, 80) + (rng.bool() ? 60 : 0), opp = rng.bool();
                    const start = rng.int(-10, 15);
                    const dirs = [start, start + a, start + 180, start + 180 + a];
                    const labels = opp ? [`${a}°`, null, 'x', null] : [`${a}°`, 'x', null, null];
                    const x = opp ? a : 180 - a;
                    return {
                        q: R`Two straight lines cross. Find \(x\).`, fig: raysFig(dirs, labels, {}), ans: CA.num(x, '°'),
                        sol: opp ? R`\(x\) and ${a}° are vertically opposite, so they are equal: \(x = ${a}\)°.` : R`\(x\) and ${a}° lie on a straight line: \(x = 180 - ${a} = ${x}\)°.`,
                    };
                },
            },
            {
                id: 'perimeter-poly', name: 'Perimeter of triangles and polygons', level: 2,
                gen(rng) {
                    const u = rng.pick(UNITS), kind = rng.int(0, 3);
                    if (kind === 0) {
                        let a, b, c;
                        do { a = rng.int(5, 20); b = rng.int(5, 20); c = rng.int(6, 20); } while (a + b <= c + 2 || a + c <= b + 2 || b + c <= a + 2);
                        const f = fit(sssPts(a, b, c), 180, 100), P = f.P;
                        const fig = F.svg(f.W, f.H, F.poly(P, { fill: C.FILL }) + edgeLabel(P, 0, 1, `${c} ${u}`) + edgeLabel(P, 1, 2, `${a} ${u}`) + edgeLabel(P, 2, 0, `${b} ${u}`), { label: 'triangle' });
                        return { q: 'Find the perimeter of the triangle.', fig, ans: CA.num(a + b + c, u), sol: R`Add the three sides: \(${c} + ${a} + ${b} = ${a + b + c}\) ${u}.` };
                    }
                    const [nm, n] = rng.pick([['equilateral triangle', 3], ['regular pentagon', 5], ['regular hexagon', 6], ['regular octagon', 8]]);
                    if (kind === 1) {
                        const s = rng.int(3, 25);
                        const f = fit(regular(n, 1, n % 2 ? 90 : 90 + 180 / n), 110, 100, 30, 22), P = f.P;
                        let g = F.poly(P, { fill: C.FILL }) + edgeLabel(P, n % 2 ? (n - 1) / 2 : n / 2 - 1, n % 2 ? (n + 1) / 2 : n / 2, `${s} ${u}`);
                        return { q: `Find the perimeter of the ${nm}.`, fig: F.svg(f.W, f.H, g, { label: nm }), ans: CA.num(n * s, u), sol: R`A ${nm} has ${n} equal sides: \(${n}\times${s} = ${n * s}\) ${u}.` };
                    }
                    if (kind === 2) {
                        const s = rng.int(3, 25), shape = rng.pick([['square', 4], [nm, n]]);
                        return { q: `${/^[aeiou]/.test(shape[0]) ? 'An' : 'A'} ${shape[0]} has a perimeter of ${shape[1] * s} ${u}. How long is each side?`, ans: CA.num(s, u), sol: R`It has ${shape[1]} equal sides: \(${shape[1] * s} \div ${shape[1]} = ${s}\) ${u}.` };
                    }
                    const l = rng.int(6, 20), w = rng.int(2, l - 1), P = 2 * (l + w);
                    return { q: `A rectangle has a perimeter of ${P} ${u} and a length of ${l} ${u}. What is its width?`, ans: CA.num(w, u), sol: R`Length + width \(= ${P}\div 2 = ${l + w}\), so the width is \(${l + w} - ${l} = ${w}\) ${u}.` };
                },
            },
            {
                id: 'composite', name: 'Composite shapes', level: 3,
                gen(rng) {
                    const u = rng.pick(['cm', 'm', 'ft']), k4 = rng.int(0, 3), kind = Math.max(0, k4 - 1), wantArea = k4 === 0;
                    if (kind === 0) {                                             // L-shape
                        const W = rng.int(8, 18), H = rng.int(7, 15), w = rng.int(2, W - 3), h = rng.int(2, H - 3);
                        const pts = [[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]];
                        const f = fit(pts, 170, 110), P = f.P, cen = f.map([W * 0.35, H * 0.4]);
                        let g = F.poly(P, { fill: C.FILL });
                        g += edgeLabel(P, 0, 1, `${W} ${u}`, cen) + edgeLabel(P, 5, 0, `${H} ${u}`, cen) + edgeLabel(P, 4, 5, `${W - w} ${u}`, cen) + edgeLabel(P, 1, 2, `${H - h} ${u}`, cen);
                        const fig = F.svg(f.W, f.H, g, { label: 'L-shape' });
                        if (wantArea) return {
                            q: 'All corners are right angles. Find the area of the shape.', fig, ans: CA.num(W * H - w * h, `${u}²`),
                            sol: R`Big rectangle minus the missing corner: the corner is \(${W} - ${W - w} = ${w}\) by \(${H} - ${H - h} = ${h}\). Area \(= ${W}\times${H} - ${w}\times${h} = ${W * H - w * h}\) ${u}².`,
                        };
                        return {
                            q: 'All corners are right angles. Find the perimeter of the shape.', fig, ans: CA.num(2 * (W + H), u),
                            sol: R`The two missing sides are \(${w}\) and \(${h}\) ${u}. Perimeter \(= ${W} + ${H - h} + ${w} + ${h} + ${W - w} + ${H} = ${2 * (W + H)}\) ${u} (the same as a ${W} by ${H} rectangle).`,
                        };
                    }
                    if (kind === 1) {                                             // house: rectangle + triangle
                        const W = rng.int(3, 7) * 2, H = rng.int(4, 12), t = rng.int(2, 8);
                        const pts = [[0, 0], [W, 0], [W, H], [W / 2, H + t], [0, H]];
                        const f = fit(pts, 150, 120), P = f.P, top = f.map([W / 2, H]), Hm = f.map([0, H]), Hr = f.map([W, H]);
                        let g = F.poly(P, { fill: C.FILL }) + F.line(Hm[0], Hm[1], Hr[0], Hr[1], { dash: true, width: 1 }) + F.line(P[3][0], P[3][1], top[0], top[1], { dash: true, width: 1 });
                        g += edgeLabel(P, 0, 1, `${W} ${u}`) + edgeLabel(P, 1, 2, `${H} ${u}`) + htext(top[0] + 4, top[1] - 5, `${t} ${u}`, { anchor: 'start', size: 12 });
                        const A = W * H + W * t / 2;
                        return {
                            q: 'The shape is a rectangle with a triangle on top. Find its total area.', fig: F.svg(f.W, f.H, g, { label: 'house shape' }), ans: CA.num(A, `${u}²`),
                            sol: R`Rectangle \(${W}\times${H} = ${W * H}\); triangle \(\tfrac12\times${W}\times${t} = ${W * t / 2}\). Total \(${A}\) ${u}².`,
                        };
                    }
                    const A = rng.int(8, 16), B = rng.int(7, 12), k = rng.int(1, 2), a = A - 2 * k, b = B - 2 * k;   // frame
                    const f = fit([[0, 0], [A, 0], [A, B], [0, B]], 160, 110), P = f.P, Q = [[k, k], [A - k, k], [A - k, B - k], [k, B - k]].map(f.map);
                    let g = F.poly(P, { fill: C.SHADE }) + F.poly(Q, { fill: '#ffffff' });
                    g += edgeLabel(P, 0, 1, `${A} ${u}`) + edgeLabel(P, 1, 2, `${B} ${u}`) + F.text((Q[0][0] + Q[2][0]) / 2, (Q[0][1] + Q[2][1]) / 2 + 4, 'hole', { size: 11, italic: true });
                    return {
                        q: `${an(A)} ${A} ${u} by ${B} ${u} rectangular picture frame has a ${a} ${u} by ${b} ${u} rectangular hole in the middle. Find the area of the shaded frame.`,
                        fig: F.svg(f.W, f.H, g, { label: 'frame' }), ans: CA.num(A * B - a * b, `${u}²`),
                        sol: R`Outer minus inner: \(${A}\times${B} - ${a}\times${b} = ${A * B} - ${a * b} = ${A * B - a * b}\) ${u}².`,
                    };
                },
            },
            {
                id: 'reverse-measure', name: 'Working backwards', level: 3,
                gen(rng) {
                    const u = rng.pick(['cm', 'm', 'in']), kind = rng.int(0, 5);
                    if (kind === 0) {
                        const l = rng.int(5, 20), w = rng.int(2, 15);
                        if (l === w) return this.gen(rng);
                        return { q: `A rectangle has an area of ${l * w} ${u}² and a length of ${l} ${u}. Find its width.`, fig: rectFig(l, w, `${l} ${u}`, '?'), ans: CA.num(w, u), sol: R`\(w = \text{area} \div l = ${l * w}\div${l} = ${w}\) ${u}.` };
                    }
                    if (kind === 1) {
                        const s = rng.int(4, 15), cube = rng.bool();
                        if (cube) return { q: `A cube has a volume of ${s ** 3} ${u}³. How long is each edge?`, ans: CA.num(s, u), sol: R`\(s^3 = ${s ** 3}\), so \(s = ${s}\) because \(${s}\times${s}\times${s} = ${s ** 3}\).` };
                        return { q: `A square has an area of ${s * s} ${u}². What is its perimeter?`, ans: CA.num(4 * s, u), sol: R`Side \(= \sqrt{${s * s}} = ${s}\), so the perimeter is \(4\times${s} = ${4 * s}\) ${u}.` };
                    }
                    if (kind === 2) {
                        const b = rng.int(4, 20), h = rng.int(3, 16), A = b * h / 2;
                        return { q: `A triangle has an area of ${A} ${u}² and a base of ${b} ${u}. What is its height?`, ans: CA.num(h, u), sol: R`\(\tfrac12\times${b}\times h = ${A}\), so \(h = ${2 * A}\div${b} = ${h}\) ${u}.` };
                    }
                    if (kind === 3) {
                        const l = rng.int(3, 12), w = rng.int(2, 10), h = rng.int(2, 12);
                        return { q: `The box has a volume of ${l * w * h} ${u}³. Find its height \\(h\\).`, fig: F.box(l, w, h, { labels: [`${l} ${u}`, `${w} ${u}`, 'h'], max: 115 }), ans: CA.num(h, u), sol: R`\(${l}\times${w}\times h = ${l * w * h}\), so \(h = ${l * w * h}\div${l * w} = ${h}\) ${u}.` };
                    }
                    const r = rng.int(2, 15);
                    if (kind === 4) return { q: R`A circle has a circumference of \(${2 * r}\pi\) ${u}. What is its radius?`, ans: CA.num(r, u), sol: R`\(2\pi r = ${2 * r}\pi\), so \(r = ${2 * r}\div 2 = ${r}\) ${u}.` };
                    return { q: R`A circle has an area of \(${r * r}\pi\) ${u}². What is its diameter?`, ans: CA.num(2 * r, u), sol: R`\(\pi r^2 = ${r * r}\pi\), so \(r = ${r}\) and the diameter is \(2r = ${2 * r}\) ${u}.` };
                },
            },
            {
                id: 'angle-algebra', name: 'Angle puzzles', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {                                             // x, x + p, x + q
                        for (;;) {
                            const x = rng.int(36, 56), p = rng.int(4, 40), q = 180 - 3 * x - p;
                            const angs = [x, x + p, x + q];
                            if (q === 0 || q === p || q < -12 || angs.some(a => a < 36)) continue;
                            const sh = polyFromAngles(angs, [1]);
                            const texs = ['x', `x + ${p}°`, q > 0 ? `x + ${q}°` : `x − ${-q}°`];
                            return {
                                q: R`The angles of a triangle are \(x\), \(x + ${p}^\circ\) and \(x ${q > 0 ? '+' : '-'} ${Math.abs(q)}^\circ\). Find \(x\).`, fig: anglePolyFig(sh.pts, texs),
                                ans: CA.num(x, '°'), sol: R`\(3x ${p + q >= 0 ? '+' : '-'} ${Math.abs(p + q)} = 180\), so \(3x = ${180 - p - q}\) and \(x = ${x}\)°.`,
                            };
                        }
                    }
                    if (kind === 1) {                                             // ratio of angles
                        const ks = rng.pick([[1, 2, 3], [2, 3, 4], [1, 1, 2], [1, 2, 6], [3, 4, 5], [1, 3, 5], [2, 3, 5], [1, 4, 5], [4, 5, 9]]);
                        const s = ks[0] + ks[1] + ks[2]; if (180 % s) return this.gen(rng);
                        const x = 180 / s, angs = ks.map(k => k * x), ask = rng.pick(['largest', 'smallest']);
                        const val = ask === 'largest' ? Math.max(...angs) : Math.min(...angs);
                        return { q: `The angles of a triangle are in the ratio ${ks.join(' : ')}. What is the ${ask} angle?`, ans: CA.num(val, '°'), sol: R`${s} parts make 180°, so one part is \(180\div${s} = ${x}\)°. The ${ask} angle is \(${ask === 'largest' ? Math.max(...ks) : Math.min(...ks)}\times${x} = ${val}\)°.` };
                    }
                    if (kind === 2) {                                             // isosceles
                        const apexGiven = rng.bool(), apex = rng.int(10, 70) * 2, base = (180 - apex) / 2;
                        const sh = polyFromAngles([base, base, apex], [1]);
                        const f = fit(sh.pts, 150, 110, 30, 22), P = f.P;
                        let g = F.poly(P, { fill: C.FILL }) + ticks(P[0], P[2]) + ticks(P[1], P[2]);
                        g += apexGiven ? angleMark(P[2], P[0], P[1], `${apex}°`, 14) + angleMark(P[0], P[1], P[2], 'x', 14, { fill: C.ACCENT, bold: true })
                            : angleMark(P[0], P[1], P[2], `${base}°`, 14) + angleMark(P[2], P[0], P[1], 'x', 14, { fill: C.ACCENT, bold: true });
                        return {
                            q: R`The triangle is isosceles (the marked sides are equal). Find \(x\).`, fig: F.svg(f.W, f.H, g, { label: 'isosceles triangle' }),
                            ans: CA.num(apexGiven ? base : apex, '°'),
                            sol: apexGiven ? R`The two base angles are equal: \(x = (180 - ${apex})\div 2 = ${base}\)°.` : R`Both base angles are ${base}°: \(x = 180 - 2\times${base} = ${apex}\)°.`,
                        };
                    }
                    // exterior angle of a triangle
                    let a, b;
                    do { a = rng.int(30, 80); b = rng.int(30, 80); } while (a + b > 150);
                    const sh = polyFromAngles([180 - a - b, a, b], [1]);           // A (the exterior vertex), B, C
                    const pts = sh.pts, ext = [pts[0][0] - 0.45, 0];
                    const f = fit(pts.concat([ext]), 200, 100, 30, 22), P = f.P;
                    let g = F.poly(P.slice(0, 3), { fill: C.FILL }) + F.line(P[0][0], P[0][1], P[3][0], P[3][1]);
                    g += angleMark(P[1], P[2], P[0], `${a}°`, 14) + angleMark(P[2], P[0], P[1], `${b}°`, 14) + angleMark(P[0], P[3], P[2], 'x', 14, { fill: C.ACCENT, bold: true });
                    return {
                        q: R`One side of the triangle is extended. Find the exterior angle \(x\).`, fig: F.svg(f.W, f.H, g, { label: 'exterior angle' }),
                        ans: CA.num(a + b, '°'), sol: R`The inside angle next to \(x\) is \(180 - ${a} - ${b} = ${180 - a - b}\)°, so \(x = 180 - ${180 - a - b} = ${a + b}\)°. (An exterior angle equals the sum of the two opposite inside angles.)`,
                    };
                },
            },
            {
                id: 'cone-pyramid', name: 'Cones, pyramids and surface area', level: 3,
                gen(rng) {
                    const u = rng.pick(['cm', 'm', 'in']), kind = rng.int(0, 4);
                    if (kind === 0) {
                        const r = rng.int(2, 9), h = rng.int(3, 15);
                        return {
                            q: R`Find the volume of the cone. Give your answer in terms of \(\pi\).`, fig: coneFig(r, h, { r: `${r} ${u}`, h: `${h} ${u}` }),
                            ans: CA.pi(r * r * h, 3, `${u}³`), sol: R`\(V = \tfrac13\pi r^2 h = \tfrac13\pi\times${r * r}\times${h} = ${CA.tex.pi(r * r * h, 3)}\) ${u}³.`,
                        };
                    }
                    if (kind === 1) {
                        let s, h; do { s = rng.int(3, 12); h = rng.int(3, 15); } while ((s * s * h) % 3);
                        return {
                            q: 'The pyramid has a square base. Find its volume.', fig: pyramidFig(`${s} ${u}`, `${h} ${u}`), ans: CA.num(s * s * h / 3, `${u}³`),
                            sol: R`\(V = \tfrac13\times\text{base area}\times h = \tfrac13\times${s * s}\times${h} = ${s * s * h / 3}\) ${u}³.`,
                        };
                    }
                    if (kind === 2) {
                        const r = rng.int(2, 8), h = rng.int(3, 12);
                        return {
                            q: R`Find the total surface area of the closed cylinder. Give your answer in terms of \(\pi\).`, fig: cylFig(r, h, { r: `${r} ${u}`, h: `${h} ${u}` }),
                            ans: CA.pi(2 * r * r + 2 * r * h, 1, `${u}²`), sol: R`Two circles \(2\pi r^2 = ${2 * r * r}\pi\) plus the curved side \(2\pi r h = ${2 * r * h}\pi\): total \(${2 * r * r + 2 * r * h}\pi\) ${u}².`,
                        };
                    }
                    if (kind === 3) {
                        const r = rng.int(1, 12);
                        return { q: R`Find the surface area of a sphere with radius ${r} ${u}. Give your answer in terms of \(\pi\).`, ans: CA.pi(4 * r * r, 1, `${u}²`), sol: R`\(A = 4\pi r^2 = 4\pi\times${r * r} = ${4 * r * r}\pi\) ${u}².` };
                    }
                    const [r0, h0, l0] = rng.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [8, 6, 10], [12, 5, 13]]);
                    const k = r0 > 6 ? 1 : rng.pick([1, 1, 2]), r = r0 * k, h = h0 * k, l = l0 * k;
                    return {
                        q: R`A cone has radius ${r} ${u} and height ${h} ${u}. Find its slant height, then its total surface area (base included). Give the area in terms of \(\pi\).`,
                        fig: coneFig(r, h, { r: `${r} ${u}`, h: `${h} ${u}`, l: 'l = ?' }), ans: CA.pi(r * r + r * l, 1, `${u}²`),
                        sol: R`Slant \(l = \sqrt{${r}^2 + ${h}^2} = ${l}\). Area \(= \pi r^2 + \pi r l = ${r * r}\pi + ${r * l}\pi = ${r * r + r * l}\pi\) ${u}².`,
                    };
                },
            },
        ],

        assignment: [
            ['rect-square', 4], ['triangle-area', 3], ['angle-basics', 4], ['identify-shape', 4],
            ['para-trap', 4], ['circle', 4], ['prism-cube', 4], ['cyl-sphere', 4], ['angles-point-quad', 4], ['perimeter-poly', 3],
            ['composite', 3], ['reverse-measure', 3], ['angle-algebra', 3], ['cone-pyramid', 3],
        ],
    });
})();
