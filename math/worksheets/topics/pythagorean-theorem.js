/* Worksheet: Pythagorean Theorem — finding sides of right triangles, the converse, and word problems. */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, C = F.colors;

    // ── Figure helpers ───────────────────────────────────────────────────
    const rad = x => x * Math.PI / 180;
    function fit(pts, maxW = 180, maxH = 110, padX = 44, padY = 24, squash = 0) {
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        let sx = maxW / Math.max(x1 - x0, 1e-9), sy = maxH / Math.max(y1 - y0, 1e-9);
        if (squash) { sx = Math.min(sx, sy * squash); sy = Math.min(sy, sx * squash); } else sx = sy = Math.min(sx, sy);
        const map = p => [padX + (p[0] - x0) * sx, padY + (y1 - p[1]) * sy];
        return { map, P: pts.map(map), W: (x1 - x0) * sx + 2 * padX, H: (y1 - y0) * sy + 2 * padY };
    }
    const htext = (x, y, s, opt = {}) => F.text(x, y, s, opt).replace('stroke="none"', 'stroke="#ffffff" stroke-width="3" paint-order="stroke"');
    const centroid = P => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
    const unknown = t => /\?|x/.test(t);
    function lab(x, y, nx, ny, text, off = 7) {
        const anchor = nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle';
        const o = unknown(text) ? { fill: C.ACCENT, bold: true } : {};
        return F.text(x + nx * off, y + ny * off + 4.5 + ny * 3, text, { anchor, ...o });
    }
    function edgeLabel(P, i, j, text, cen = centroid(P), off = 7) {
        if (text == null || text === '') return '';
        const [x1, y1] = P[i], [x2, y2] = P[j], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        let nx = -(y2 - y1), ny = x2 - x1; const L = Math.hypot(nx, ny); nx /= L; ny /= L;
        if ((mx - cen[0]) * nx + (my - cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
        return lab(mx, my, nx, ny, text, off);
    }
    function vertexLabel(P, i, text, cen = centroid(P)) {
        let nx = P[i][0] - cen[0], ny = P[i][1] - cen[1]; const L = Math.hypot(nx, ny); nx /= L; ny /= L;
        return F.text(P[i][0] + nx * 11, P[i][1] + ny * 11 + 4.5, text, { bold: true, italic: true });
    }
    const raMark = (P, i, j, k) => F.rightAngle(P[i][0], P[i][1], P[j][0] - P[i][0], P[j][1] - P[i][1], P[k][0] - P[i][0], P[k][1] - P[i][1], 9);
    /**
     * Right triangle with legs a and b; labels {a, b, c}. The right angle is at vertex 0.
     * opt.turn rotates the drawing (degrees); opt.flip mirrors it; opt.names labels the vertices.
     */
    function rtFig(a, b, labs, opt = {}) {
        let pts = [[0, 0], [b, 0], [0, a]];
        if (opt.flip) pts = pts.map(([x, y]) => [-x, y]);
        if (opt.turn) { const t = rad(opt.turn), c = Math.cos(t), s = Math.sin(t); pts = pts.map(([x, y]) => [x * c - y * s, x * s + y * c]); }
        const f = fit(pts, 170, 105, 46, 24, 2.2), P = f.P;
        let g = F.poly(P, { fill: C.FILL }) + raMark(P, 0, 1, 2);
        g += edgeLabel(P, 0, 1, labs.b) + edgeLabel(P, 0, 2, labs.a) + edgeLabel(P, 1, 2, labs.c);
        if (opt.names) opt.names.forEach((n, i) => { g += vertexLabel(P, i, n); });
        return F.svg(f.W, f.H, g, { label: 'right triangle' });
    }
    /** A ladder (or plank, slide) leaning on a wall. */
    function ladderFig(foot, up, labs) {
        const s = Math.min(120 / up, 150 / foot, 12), X = 40 + foot * s, Y = 14 + up * s;
        let g = F.line(16, Y, X + 30, Y) + F.rect(X, 6, 12, Y - 6, { fill: C.SHADE, width: 1 });
        g += F.line(40, Y, X, Y - up * s, { width: 3, stroke: C.ACCENT }) + F.rightAngle(X, Y, -1, 0, 0, -1, 8);
        if (labs.foot) g += F.text((40 + X) / 2, Y + 16, labs.foot, unknown(labs.foot) ? { fill: C.ACCENT, bold: true } : {});
        if (labs.up) g += F.text(X + 16, Y - up * s / 2 + 4, labs.up, { anchor: 'start', ...(unknown(labs.up) ? { fill: C.ACCENT, bold: true } : {}) });
        if (labs.len) g += htext((40 + X) / 2 - 8, Y - up * s / 2 - 4, labs.len, { anchor: 'end', ...(unknown(labs.len) ? { fill: C.ACCENT, bold: true } : {}) });
        return F.svg(X + 70, Y + 22, g, { label: 'ladder against a wall' });
    }
    function rectDiagFig(w, h, labs) {
        const f = fit([[0, 0], [w, 0], [w, h], [0, h]], 160, 100, 44, 24, 2.5), P = f.P;
        let g = F.poly(P, { fill: C.FILL }) + F.line(P[0][0], P[0][1], P[2][0], P[2][1], { dash: true, stroke: C.ACCENT }) + raMark(P, 1, 0, 2);
        g += edgeLabel(P, 0, 1, labs.w) + edgeLabel(P, 1, 2, labs.h);
        if (labs.d) { const mx = (P[0][0] + P[2][0]) / 2, my = (P[0][1] + P[2][1]) / 2; g += htext(mx - 4, my - 4, labs.d, { anchor: 'end', ...(unknown(labs.d) ? { fill: C.ACCENT, bold: true } : {}) }); }
        return F.svg(f.W, f.H, g, { label: 'rectangle with a diagonal' });
    }
    function gridFig(A, B) {
        const lo = Math.min(0, A[0], B[0], A[1], B[1]), hi = Math.max(A[0], B[0], A[1], B[1]) + 1, n = hi - lo, s = Math.min(14, 160 / n);
        const X = x => 22 + (x - lo) * s, Y = y => 10 + (hi - y) * s;
        let g = '';
        for (let i = lo; i <= hi; i++) g += F.line(X(i), Y(lo), X(i), Y(hi), { stroke: '#d5dbe8', width: 0.8 }) + F.line(X(lo), Y(i), X(hi), Y(i), { stroke: '#d5dbe8', width: 0.8 });
        g += F.line(X(lo), Y(0), X(hi), Y(0), { width: 1.2 }) + F.line(X(0), Y(lo), X(0), Y(hi), { width: 1.2 });
        g += F.line(X(A[0]), Y(A[1]), X(B[0]), Y(B[1]), { stroke: C.ACCENT, width: 2 });
        g += F.line(X(A[0]), Y(A[1]), X(B[0]), Y(A[1]), { dash: true, width: 1 }) + F.line(X(B[0]), Y(A[1]), X(B[0]), Y(B[1]), { dash: true, width: 1 });
        g += F.dot(X(A[0]), Y(A[1]), { r: 3.5 }) + F.dot(X(B[0]), Y(B[1]), { r: 3.5 });
        const off = (P, Q) => (P[0] <= Q[0] ? -9 : 9);
        g += htext(X(A[0]) + off(A, B), Y(A[1]) - 6, 'A', { bold: true }) + htext(X(B[0]) + off(B, A), Y(B[1]) - 6, 'B', { bold: true });
        g += F.text(X(0) - 4, Y(0) + 12, '0', { size: 10, anchor: 'end' });
        return F.svg(X(hi) + 12, Y(lo) + 14, g, { label: 'coordinate grid' });
    }
    const ticks = (A, B) => { const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, L = Math.hypot(B[0] - A[0], B[1] - A[1]); const px = -(B[1] - A[1]) / L * 5, py = (B[0] - A[0]) / L * 5; return F.line(mx - px, my - py, mx + px, my + py, { width: 1.2 }); };

    // ── Triples ──────────────────────────────────────────────────────────
    const PRIM = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [11, 60, 61]];
    /** A random Pythagorean triple (a, b, c) with c at most maxC; legs in random order. */
    function triple(rng, maxC = 60) {
        for (;;) {
            const [a, b, c] = rng.pick(PRIM), k = rng.int(1, Math.max(1, Math.floor(maxC / c)));
            if (c * k > maxC) continue;
            return rng.bool() ? [a * k, b * k, c * k] : [b * k, a * k, c * k];
        }
    }
    const UNITS = ['cm', 'm', 'in', 'ft'];
    const sq = x => x * x;
    const rootAns = (n, unit = '') => (CA.isSquare(n) ? CA.num(Math.sqrt(n), unit) : CA.rootOf(n, unit));
    const rootTex = n => { const [c, r] = CA.simplifyRoot(n); return CA.tex.root(c, r); };
    /** " = 3\sqrt{5}" when √n simplifies (or is whole), otherwise nothing. */
    const rootEq = n => (CA.simplifyRoot(n)[0] === 1 ? '' : ` = ${rootTex(n)}`);

    CA.register({
        id: 'pythagorean-theorem',
        title: 'Pythagorean Theorem',
        page: 'pythagorean-theorem.html',
        assignmentNote: R`Use \(a^2 + b^2 = c^2\), where \(c\) is the hypotenuse (the side opposite the right angle). Give each answer with its unit. When asked for "simplest radical form", write a root like \(3\sqrt{5}\); otherwise round as the question says.`,

        practice: [
            {
                id: 'find-hyp', name: 'Find the hypotenuse', level: 1,
                gen(rng) {
                    const [a, b, c] = triple(rng, 40), u = rng.pick(UNITS);
                    const sol = R`\(c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}\), so \(c = \sqrt{${c * c}} = ${c}\) ${u}.`;
                    if (rng.bool(0.7)) {
                        const v = rng.pick(['c', '?', 'x']);
                        return { q: `Find the length of the hypotenuse${v === '?' ? '' : ` ${CA.m(v)}`}.`, fig: rtFig(a, b, { a: `${a} ${u}`, b: `${b} ${u}`, c: v }, { flip: rng.bool(0.3) }), ans: CA.num(c, u), sol };
                    }
                    return { q: `A right triangle has legs of ${a} ${u} and ${b} ${u}. How long is its hypotenuse?`, ans: CA.num(c, u), sol };
                },
            },
            {
                id: 'find-leg', name: 'Find a leg', level: 1,
                gen(rng) {
                    const [a, b, c] = triple(rng, 40), u = rng.pick(UNITS);
                    const sol = R`\(a^2 = c^2 - b^2 = ${c}^2 - ${b}^2 = ${c * c} - ${b * b} = ${a * a}\), so \(a = \sqrt{${a * a}} = ${a}\) ${u}.`;
                    if (rng.bool(0.7)) {
                        const v = rng.pick(['a', '?', 'x']);
                        return { q: `Find the length of the missing side${v === '?' ? '' : ` ${CA.m(v)}`}.`, fig: rtFig(a, b, { a: v, b: `${b} ${u}`, c: `${c} ${u}` }, { flip: rng.bool(0.3) }), ans: CA.num(a, u), sol };
                    }
                    return { q: `A right triangle has a hypotenuse of ${c} ${u} and one leg of ${b} ${u}. How long is the other leg?`, ans: CA.num(a, u), sol };
                },
            },
            {
                id: 'hyp-basics', name: 'The hypotenuse and the squares', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const names = rng.pick([['B', 'A', 'C'], ['Q', 'P', 'R'], ['Y', 'X', 'Z'], ['M', 'L', 'N'], ['E', 'D', 'F'], ['K', 'J', 'L']]);
                        const [r, p, q] = names;                         // right angle at r
                        const s = (x, y) => [x, y].sort().join('');
                        const a = rng.int(3, 7), b = rng.int(3, 8);
                        const fig = rtFig(a, b, {}, { names, turn: rng.pick([0, 0, 90, 180, 200, 135, 300]), flip: rng.bool() });
                        return {
                            q: `Triangle ${[...names].sort().join('')} has a right angle at ${r}. Which side is the hypotenuse?`, fig,
                            ans: CA.mc(rng, s(p, q), [s(r, p), s(r, q)]), sol: `The hypotenuse is the side opposite the right angle at ${r}, which is ${s(p, q)}. It is the longest side.`,
                        };
                    }
                    if (kind === 1) {
                        const [a, b, c] = triple(rng, 30), u = rng.pick(UNITS);
                        if (rng.bool()) return { q: `The squares on the two legs of a right triangle have areas ${a * a} ${u}² and ${b * b} ${u}². What is the area of the square on the hypotenuse?`, ans: CA.num(c * c, `${u}²`), sol: R`\(a^2 + b^2 = c^2\): the two small squares add up to the big one, \(${a * a} + ${b * b} = ${c * c}\) ${u}².` };
                        return { q: `The square on the hypotenuse of a right triangle has area ${c * c} ${u}², and the square on one leg has area ${a * a} ${u}². What is the area of the square on the other leg?`, ans: CA.num(b * b, `${u}²`), sol: R`\(c^2 - a^2 = ${c * c} - ${a * a} = ${b * b}\) ${u}².` };
                    }
                    const a = rng.int(2, 12), b = rng.int(2, 12);
                    return { q: R`A right triangle has legs \(a = ${a}\) and \(b = ${b}\). What is \(c^2\)?`, ans: CA.num(a * a + b * b), sol: R`\(c^2 = a^2 + b^2 = ${a * a} + ${b * b} = ${a * a + b * b}\).` };
                },
            },
            {
                id: 'is-right', name: 'Is it a right triangle?', level: 2,
                gen(rng) {
                    const near = () => { const [a, b, c] = triple(rng, 45).sort((x, y) => x - y); const d = rng.pick([-2, -1, 1, 2]); const v = rng.int(0, 2); const t = [a, b, c]; t[v] += d; t.sort((x, y) => x - y); return t[0] + t[1] > t[2] && t[0] * t[0] + t[1] * t[1] !== t[2] * t[2] && t[0] > 0 ? t : near(); };
                    const fmt = t => `${t[0]}, ${t[1]}, ${t[2]}`;
                    const why = t => { const [a, b, c] = t; const l = a * a + b * b, r = c * c; return R`\(${a}^2 + ${b}^2 = ${l}\) and \(${c}^2 = ${r}\)${l === r ? ' — equal, so it is a right triangle' : ' — not equal, so it is not a right triangle'}.`; };
                    if (rng.bool(0.6)) {
                        const right = rng.bool(), t = right ? triple(rng, 45).sort((x, y) => x - y) : near();
                        const shown = rng.shuffle(t);
                        return {
                            q: `A triangle has sides ${shown[0]}, ${shown[1]} and ${shown[2]} cm. Is it a right triangle?`,
                            ans: CA.mc(rng, right ? 'Yes' : 'No', ['Yes', 'No'], { keepOrder: true }), sol: why(t),
                        };
                    }
                    const good = triple(rng, 45).sort((x, y) => x - y), bads = [near(), near(), near()];
                    if (new Set(bads.map(fmt)).size < 3) return this.gen(rng);
                    return { q: 'Which set of side lengths makes a right triangle?', ans: CA.mc(rng, fmt(good), bads.map(fmt)), sol: why(good) };
                },
            },
            {
                id: 'hyp-root', name: 'Hypotenuse that is not a whole number', level: 2,
                gen(rng) {
                    let a, b; do { a = rng.int(1, 12); b = rng.int(2, 14); } while (CA.isSquare(a * a + b * b) || Math.max(a, b) > 4 * Math.min(a, b) || a === b && rng.bool(0.7));
                    const n = a * a + b * b, u = rng.pick(UNITS), exact = rng.bool();
                    const fig = rtFig(a, b, { a: `${a} ${u}`, b: `${b} ${u}`, c: 'c' }, { flip: rng.bool(0.3) });
                    if (exact) return { q: R`Find \(c\). Give your answer in simplest radical form.`, fig, ans: CA.rootOf(n, u), sol: R`\(c = \sqrt{${a}^2 + ${b}^2} = \sqrt{${n}}${rootEq(n)}\) ${u}.` };
                    const v = CA.round(Math.sqrt(n), 1);
                    return { q: R`Find \(c\), to 1 decimal place.`, fig, ans: CA.num(v, u, { tol: 0.06 }), sol: R`\(c = \sqrt{${a * a} + ${b * b}} = \sqrt{${n}} \approx ${v}\) ${u}.` };
                },
            },
            {
                id: 'leg-root', name: 'Leg that is not a whole number', level: 2,
                gen(rng) {
                    let c, b; do { c = rng.int(4, 16); b = rng.int(Math.ceil(c / 4), c - 1); } while (CA.isSquare(c * c - b * b) || Math.sqrt(c * c - b * b) < c / 4);
                    const n = c * c - b * b, a = Math.sqrt(n), u = rng.pick(UNITS), exact = rng.bool();
                    const fig = rtFig(a, b, { a: 'x', b: `${b} ${u}`, c: `${c} ${u}` }, { flip: rng.bool(0.3) });
                    if (exact) return { q: R`Find \(x\). Give your answer in simplest radical form.`, fig, ans: CA.rootOf(n, u), sol: R`\(x = \sqrt{${c}^2 - ${b}^2} = \sqrt{${c * c} - ${b * b}} = \sqrt{${n}}${rootEq(n)}\) ${u}.` };
                    const v = CA.round(a, 1);
                    return { q: R`Find \(x\), to 1 decimal place.`, fig, ans: CA.num(v, u, { tol: 0.06 }), sol: R`\(x = \sqrt{${c * c} - ${b * b}} = \sqrt{${n}} \approx ${v}\) ${u}.` };
                },
            },
            {
                id: 'word-problems', name: 'Word problems', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 5);
                    if (kind === 0) {                                             // ladder
                        const [f, h, L] = (() => { for (;;) { const t = triple(rng, 30); if (t[1] > t[0]) return t; } })();
                        const ask = rng.pick(['len', 'up', 'foot']);
                        const labs = { foot: ask === 'foot' ? '?' : `${f} m`, up: ask === 'up' ? '?' : `${h} m`, len: ask === 'len' ? '?' : `${L} m` };
                        const q = ask === 'len' ? `A ladder leans against a wall. Its foot is ${f} m from the wall and its top reaches ${h} m up the wall. How long is the ladder?`
                            : ask === 'up' ? `A ${L} m ladder leans against a wall with its foot ${f} m from the wall. How high up the wall does it reach?`
                                : `A ${L} m ladder reaches ${h} m up a wall. How far is its foot from the wall?`;
                        const val = { len: L, up: h, foot: f }[ask];
                        return { q, fig: ladderFig(f, h, labs), ans: CA.num(val, 'm'), sol: ask === 'len' ? R`\(\sqrt{${f}^2 + ${h}^2} = \sqrt{${f * f + h * h}} = ${L}\) m.` : R`\(\sqrt{${L}^2 - ${ask === 'up' ? f : h}^2} = \sqrt{${L * L - sq(ask === 'up' ? f : h)}} = ${val}\) m.` };
                    }
                    if (kind === 1) {                                             // TV screen
                        const [w, h, d] = rng.pick([[16, 12, 20], [32, 24, 40], [40, 30, 50], [48, 36, 60], [24, 18, 30], [36, 15, 39], [48, 20, 52], [24, 10, 26]]);
                        if (rng.bool()) return { q: `A TV screen is ${w} inches wide and ${h} inches tall. Screens are measured along the diagonal. What size is this TV?`, ans: CA.num(d, 'in'), sol: R`\(\sqrt{${w}^2 + ${h}^2} = \sqrt{${w * w + h * h}} = ${d}\) inches.` };
                        return { q: `A ${d}-inch TV screen (measured along the diagonal) is ${w} inches wide. How tall is it?`, ans: CA.num(h, 'in'), sol: R`\(\sqrt{${d}^2 - ${w}^2} = \sqrt{${d * d - w * w}} = ${h}\) inches.` };
                    }
                    if (kind === 2) {                                             // walk north then east
                        const [n, e, d] = triple(rng, 60), who = rng.pick(['A ship sails', 'A hiker walks', 'A plane flies', 'A cyclist rides']);
                        const [d1, d2] = rng.pick([['north', 'east'], ['south', 'west'], ['east', 'north'], ['west', 'south']]);
                        const unit = 'km';
                        return { q: `${who} ${n} ${unit} ${d1} and then ${e} ${unit} ${d2}. How far is it from its starting point in a straight line?`, ans: CA.num(d, unit), sol: R`The two legs meet at a right angle: \(\sqrt{${n}^2 + ${e}^2} = \sqrt{${n * n + e * e}} = ${d}\) ${unit}.` };
                    }
                    if (kind === 3) {                                             // shortcut across a field
                        const [a, b, c] = triple(rng, 60), u = 'm';
                        return { q: `A rectangular field is ${a} m by ${b} m. Instead of walking along two sides to the opposite corner, Sam walks straight across the diagonal. How many metres shorter is Sam's walk?`, ans: CA.num(a + b - c, u), sol: R`Diagonal \(= \sqrt{${a}^2 + ${b}^2} = ${c}\) m. Along the sides is \(${a} + ${b} = ${a + b}\) m, so the saving is \(${a + b} - ${c} = ${a + b - c}\) m.` };
                    }
                    if (kind === 4) {                                             // kite
                        const [h, g, s] = (() => { for (;;) { const t = triple(rng, 60); if (t[0] > 5) return t; } })();
                        return { q: `A kite string is ${s} m long and pulled tight. The kite is directly above a point ${g} m away from the person holding the string (along the ground). How high is the kite? (Ignore the person's height.)`, ans: CA.num(h, 'm'), sol: R`\(\sqrt{${s}^2 - ${g}^2} = \sqrt{${s * s - g * g}} = ${h}\) m.` };
                    }
                    const [r, l, ramp] = (() => { for (;;) { const t = triple(rng, 30); if (t[1] > 2 * t[0]) return t; } })();   // ramp
                    return { q: `A ramp rises ${r} ft over a horizontal distance of ${l} ft. How long is the sloping surface of the ramp?`, ans: CA.num(ramp, 'ft'), sol: R`\(\sqrt{${r}^2 + ${l}^2} = \sqrt{${r * r + l * l}} = ${ramp}\) ft.` };
                },
            },
            {
                id: 'rect-diagonal', name: 'Diagonals of rectangles', level: 2,
                gen(rng) {
                    const [w, h, d] = (() => { for (;;) { const t = triple(rng, 50); if (t[0] > t[1] && t[0] / t[1] < 3) return t; } })(), u = rng.pick(UNITS);
                    const kind = rng.int(0, 2);
                    if (kind === 0) return { q: 'Find the length of the diagonal of the rectangle.', fig: rectDiagFig(w, h, { w: `${w} ${u}`, h: `${h} ${u}`, d: '?' }), ans: CA.num(d, u), sol: R`The diagonal is the hypotenuse: \(\sqrt{${w}^2 + ${h}^2} = \sqrt{${w * w + h * h}} = ${d}\) ${u}.` };
                    if (kind === 1) return { q: `A rectangle is ${w} ${u} long and its diagonal is ${d} ${u}. Find its area.`, fig: rectDiagFig(w, h, { w: `${w} ${u}`, h: '', d: `${d} ${u}` }), ans: CA.num(w * h, `${u}²`), sol: R`Width \(= \sqrt{${d}^2 - ${w}^2} = \sqrt{${d * d - w * w}} = ${h}\), so area \(= ${w}\times${h} = ${w * h}\) ${u}².` };
                    return { q: `A rectangle has a diagonal of ${d} ${u} and a width of ${h} ${u}. Find its perimeter.`, ans: CA.num(2 * (w + h), u), sol: R`Length \(= \sqrt{${d}^2 - ${h}^2} = \sqrt{${d * d - h * h}} = ${w}\), so perimeter \(= 2(${w} + ${h}) = ${2 * (w + h)}\) ${u}.` };
                },
            },
            {
                id: 'distance', name: 'Distance between two points', level: 2,
                gen(rng) {
                    const exact = rng.bool(0.65);
                    let dx, dy;
                    if (exact) { for (;;) { const t = triple(rng, 13); if (t[0] <= 12 && t[1] <= 12) { [dx, dy] = t; break; } } }
                    else { do { dx = rng.int(1, 7); dy = rng.int(1, 7); } while (CA.isSquare(dx * dx + dy * dy)); }
                    const x1 = rng.int(0, Math.max(0, 12 - dx)), y1 = rng.int(0, Math.max(0, 12 - dy));
                    const sx = rng.bool() ? 1 : -1;
                    const A = sx > 0 ? [x1, y1] : [x1 + dx, y1], B = sx > 0 ? [x1 + dx, y1 + dy] : [x1, y1 + dy];
                    const n = dx * dx + dy * dy;
                    const q = R`Find the distance between \(A(${A[0]}, ${A[1]})\) and \(B(${B[0]}, ${B[1]})\)${exact ? '' : ' in simplest radical form'}.`;
                    return {
                        q, fig: rng.bool(0.7) ? gridFig(A, B) : null, ans: rootAns(n),
                        sol: R`Across \(${dx}\), up \(${dy}\): \(AB = \sqrt{${dx}^2 + ${dy}^2} = \sqrt{${n}}${rootEq(n)}\).`,
                    };
                },
            },
            {
                id: 'isosceles', name: 'Height of an isosceles triangle', level: 3,
                gen(rng) {
                    const [hb, h, s] = (() => { for (;;) { const t = triple(rng, 30); if (t[1] >= 0.6 * t[0] && t[1] <= 3 * t[0]) return t; } })(), u = rng.pick(UNITS);
                    const b = 2 * hb;
                    const f = fit([[0, 0], [b, 0], [hb, h]], 160, 105, 40, 22, 1.6), P = f.P, M = f.map([hb, 0]);
                    let g = F.poly(P, { fill: C.FILL }) + F.line(P[2][0], P[2][1], M[0], M[1], { dash: true, stroke: C.ACCENT }) + F.rightAngle(M[0], M[1], 1, 0, 0, -1, 7);
                    g += ticks(P[0], P[2]) + ticks(P[1], P[2]) + edgeLabel(P, 0, 1, `${b} ${u}`) + edgeLabel(P, 0, 2, `${s} ${u}`) + edgeLabel(P, 1, 2, `${s} ${u}`) + htext(M[0] + 5, (P[2][1] + M[1]) / 2 + 4, 'h', { anchor: 'start', fill: C.ACCENT, bold: true });
                    const fig = F.svg(f.W, f.H, g, { label: 'isosceles triangle' });
                    const step = R`The height cuts the base in half (\(${hb}\)), so \(h = \sqrt{${s}^2 - ${hb}^2} = \sqrt{${s * s - hb * hb}} = ${h}\)`;
                    if (rng.bool()) return { q: R`An isosceles triangle has two sides of ${s} ${u} and a base of ${b} ${u}. Find its height \(h\).`, fig, ans: CA.num(h, u), sol: step + R` ${u}.` };
                    return { q: `An isosceles triangle has two sides of ${s} ${u} and a base of ${b} ${u}. Find its area.`, fig, ans: CA.num(hb * h, `${u}²`), sol: step + R`. Area \(= \tfrac12\times${b}\times${h} = ${hb * h}\) ${u}².` };
                },
            },
            {
                id: 'two-triangles', name: 'Two right triangles', level: 3,
                gen(rng) {
                    const SHARED = { 12: [[9, 15], [5, 13], [16, 20], [35, 37]], 24: [[7, 25], [10, 26], [18, 30], [32, 40]], 8: [[6, 10], [15, 17]], 15: [[8, 17], [20, 25], [36, 39]], 20: [[15, 25], [21, 29], [48, 52]], 16: [[12, 20], [30, 34]] };
                    const ad = rng.pick([12, 24, 8, 15, 20, 12, 16]);
                    const [[bd, ab], [dc, ac]] = rng.sample(SHARED[ad], 2);
                    if (Math.max(bd, dc) / ad > 2.4) return this.gen(rng);
                    const u = rng.pick(['cm', 'm']);
                    const f = fit([[-bd, 0], [0, 0], [dc, 0], [0, ad]], 200, 110, 34, 22), [B, D, Cc, A] = f.P;
                    let g = F.poly([B, Cc, A], { fill: C.FILL }) + F.line(A[0], A[1], D[0], D[1]) + F.rightAngle(D[0], D[1], 1, 0, 0, -1, 8);
                    const cen = [(B[0] + Cc[0] + A[0]) / 3, (B[1] + Cc[1] + A[1]) / 3];
                    g += edgeLabel([B, A], 0, 1, `${ab} ${u}`, cen) + edgeLabel([B, D], 0, 1, `${bd} ${u}`, cen) + edgeLabel([D, Cc], 0, 1, `${dc} ${u}`, cen) + edgeLabel([A, Cc], 0, 1, 'x', cen);
                    g += F.text(B[0] - 8, B[1] + 4, 'B', { bold: true, italic: true, anchor: 'end' }) + F.text(Cc[0] + 8, Cc[1] + 4, 'C', { bold: true, italic: true, anchor: 'start' }) + F.text(A[0], A[1] - 7, 'A', { bold: true, italic: true }) + F.text(D[0] + 4, D[1] + 30, 'D', { bold: true, italic: true });
                    return {
                        q: R`\(AD\) is perpendicular to \(BC\). Find \(x = AC\).`, fig: F.svg(f.W, f.H + 16, g, { label: 'two right triangles' }), ans: CA.num(ac, u),
                        sol: R`In triangle \(ABD\): \(AD = \sqrt{${ab}^2 - ${bd}^2} = \sqrt{${ab * ab - bd * bd}} = ${ad}\). In triangle \(ADC\): \(x = \sqrt{${ad}^2 + ${dc}^2} = \sqrt{${ad * ad + dc * dc}} = ${ac}\) ${u}.`,
                    };
                },
            },
            {
                id: 'area-perimeter', name: 'Area and perimeter of right triangles', level: 3,
                gen(rng) {
                    const [a, b, c] = triple(rng, 50), u = rng.pick(UNITS), kind = rng.int(0, 2);
                    if (kind === 0) return { q: `A right triangle has a hypotenuse of ${c} ${u} and one leg of ${a} ${u}. Find its area.`, ans: CA.num(a * b / 2, `${u}²`), sol: R`Other leg \(= \sqrt{${c}^2 - ${a}^2} = \sqrt{${c * c - a * a}} = ${b}\). Area \(= \tfrac12\times${a}\times${b} = ${a * b / 2}\) ${u}².` };
                    if (kind === 1) return { q: `A right triangle has a hypotenuse of ${c} ${u} and one leg of ${b} ${u}. Find its perimeter.`, ans: CA.num(a + b + c, u), sol: R`Other leg \(= \sqrt{${c * c} - ${b * b}} = ${a}\). Perimeter \(= ${a} + ${b} + ${c} = ${a + b + c}\) ${u}.` };
                    return { q: `A right triangle has an area of ${a * b / 2} ${u}² and one leg of ${a} ${u}. How long is its hypotenuse?`, ans: CA.num(c, u), sol: R`\(\tfrac12\times${a}\times b = ${a * b / 2}\), so \(b = ${b}\). Then \(c = \sqrt{${a}^2 + ${b}^2} = \sqrt{${c * c}} = ${c}\) ${u}.` };
                },
            },
            {
                id: 'stretch', name: 'Stretch: algebra, boxes and sliding ladders', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const [a, b, c] = (() => { for (;;) { const t = triple(rng, 45).sort((x, y) => x - y); if (t[1] > t[0]) return t; } })(), k = b - a;
                        return {
                            q: R`The legs of a right triangle are \(x\) and \(x + ${k}\), and the hypotenuse is ${c}. Find \(x\).`, fig: rtFig(b, a, { a: R`x + ${k}`, b: 'x', c: `${c}` }),
                            ans: CA.num(a), sol: R`\(x^2 + (x + ${k})^2 = ${c * c}\), so \(2x^2 + ${2 * k}x + ${k * k} = ${c * c}\). Try values (or solve): \(x = ${a}\), since \(${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}\).`,
                        };
                    }
                    if (kind === 1) {
                        const [l0, w0, h0, d0] = rng.pick([[2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 5, 14, 15], [8, 9, 12, 17], [6, 2, 3, 7], [12, 4, 3, 13], [4, 8, 1, 9], [9, 6, 2, 11]]);
                        const k = d0 > 11 ? 1 : rng.pick([1, 2]), [l, w, h, d] = [l0 * k, w0 * k, h0 * k, d0 * k], u = rng.pick(['cm', 'in']);
                        const fig = F.box(l, w, h, { labels: [`${l} ${u}`, `${w} ${u}`, `${h} ${u}`], max: 120, extra: g => F.line(g.x, g.y, g.x + g.L + g.D, g.y - g.Ht - g.Dy, { stroke: C.ACCENT, width: 2 }) });
                        return {
                            q: 'Find the length of the space diagonal of the box (the red line from one corner to the opposite corner).', fig, ans: CA.num(d, u),
                            sol: R`Floor diagonal\(^2 = ${l}^2 + ${w}^2 = ${l * l + w * w}\). Space diagonal \(= \sqrt{${l * l + w * w} + ${h}^2} = \sqrt{${d * d}} = ${d}\) ${u}.`,
                        };
                    }
                    const SAME = [[25, [7, 24], [15, 20], [20, 15], [24, 7]], [10, [6, 8], [8, 6]], [13, [5, 12], [12, 5]], [5, [3, 4], [4, 3]], [15, [9, 12], [12, 9]], [20, [12, 16], [16, 12]], [50, [14, 48], [30, 40], [40, 30], [48, 14]]];
                    const [L, ...opts] = rng.pick(SAME);
                    const i = rng.int(0, opts.length - 2), j = rng.int(i + 1, opts.length - 1);
                    const [f1, h1] = opts[i], [f2, h2] = opts[j];
                    return {
                        q: `A ${L} m ladder leans against a wall with its foot ${f1} m from the wall. The top slides down the wall by ${h1 - h2} m. How far does the foot of the ladder move away from the wall?`,
                        ans: CA.num(f2 - f1, 'm'), fig: ladderFig(f1, h1, { foot: `${f1} m`, len: `${L} m` }),
                        sol: R`At first the top is \(\sqrt{${L}^2 - ${f1}^2} = ${h1}\) m high; after sliding it is \(${h2}\) m. The foot is then \(\sqrt{${L}^2 - ${h2}^2} = ${f2}\) m out, so it moves \(${f2} - ${f1} = ${f2 - f1}\) m.`,
                    };
                },
            },
        ],

        assignment: [
            ['find-hyp', 5], ['find-leg', 5], ['hyp-basics', 5],
            ['is-right', 4], ['hyp-root', 4], ['leg-root', 4], ['word-problems', 5], ['rect-diagonal', 3], ['distance', 3],
            ['isosceles', 3], ['two-triangles', 3], ['area-perimeter', 3], ['stretch', 3],
        ],
    });
})();
