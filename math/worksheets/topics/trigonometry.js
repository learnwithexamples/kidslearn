/* Worksheet: Trigonometry — SOH-CAH-TOA, special angles, identities, and the laws of sines and cosines. */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, C = F.colors, T = CA.tex;

    // ── Figure helpers ───────────────────────────────────────────────────
    const deg = x => x * 180 / Math.PI, rad = x => x * Math.PI / 180;
    const norm = a => ((a % 360) + 360) % 360;
    const sin = d => Math.sin(rad(d)), cos = d => Math.cos(rad(d)), tan = d => Math.tan(rad(d));
    function fit(pts, maxW = 180, maxH = 110, padX = 46, padY = 24) {
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const s = Math.min(maxW / Math.max(x1 - x0, 1e-9), maxH / Math.max(y1 - y0, 1e-9));
        const map = p => [padX + (p[0] - x0) * s, padY + (y1 - p[1]) * s];
        return { map, P: pts.map(map), W: (x1 - x0) * s + 2 * padX, H: (y1 - y0) * s + 2 * padY };
    }
    const htext = (x, y, s, opt = {}) => F.text(x, y, s, opt).replace('stroke="none"', 'stroke="#ffffff" stroke-width="3" paint-order="stroke"');
    const centroid = P => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
    const hot = t => /^(x|\?|θ|h|d)$/.test(t) ? { fill: C.ACCENT, bold: true } : {};
    function edgeLabel(P, i, j, text, cen = centroid(P), off = 7) {
        if (text == null || text === '') return '';
        const [x1, y1] = P[i], [x2, y2] = P[j], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        let nx = -(y2 - y1), ny = x2 - x1; const L = Math.hypot(nx, ny); nx /= L; ny /= L;
        if ((mx - cen[0]) * nx + (my - cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
        const anchor = nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle';
        return F.text(mx + nx * off, my + ny * off + 4.5 + ny * 3, text, { anchor, ...hot(text) });
    }
    function angleMark(V, A, B, label, r = 16) {
        const a1 = deg(Math.atan2(-(A[1] - V[1]), A[0] - V[0])), a2 = deg(Math.atan2(-(B[1] - V[1]), B[0] - V[0]));
        let s = norm(a1), d = norm(a2 - a1);
        if (d > 180) { s = norm(a2); d = 360 - d; }
        let out = F.arc(V[0], V[1], r, s, s + d, { width: 1.2 });
        if (label) {
            const dist = Math.min(60, Math.max(r + 12, 14 / Math.sin(rad(Math.max(d, 8)) / 2), label.length > 3 ? 12 + 3.2 * label.length : 0));
            const [x, y] = F.polar(V[0], V[1], dist, s + d / 2);
            out += htext(x, y + 4.5, label, { size: 12, ...hot(label) });
        }
        return out;
    }
    const vname = (P, i, text, cen = centroid(P)) => { let nx = P[i][0] - cen[0], ny = P[i][1] - cen[1]; const L = Math.hypot(nx, ny); return F.text(P[i][0] + nx / L * 11, P[i][1] + ny / L * 11 + 4.5, text, { bold: true, italic: true }); };
    /**
     * Right triangle with the marked angle θ at A, right angle at B:
     * AB = adjacent, BC = opposite, AC = hypotenuse. labs = { opp, adj, hyp, ang }.
     */
    function trigFig(theta, labs = {}, opt = {}) {
        let pts = [[0, 0], [1, 0], [1, tan(theta)]];
        if (opt.flip) pts = pts.map(([x, y]) => [-x, y]);
        const f = fit(pts, 170, 105), P = f.P;
        let g = F.poly(P, { fill: C.FILL }) + F.rightAngle(P[1][0], P[1][1], P[0][0] - P[1][0], 0, 0, -1, 9);
        g += edgeLabel(P, 0, 1, labs.adj) + edgeLabel(P, 1, 2, labs.opp) + edgeLabel(P, 0, 2, labs.hyp);
        if (labs.ang) g += angleMark(P[0], P[1], P[2], labs.ang, 18);
        if (opt.names) opt.names.forEach((n, i) => { g += vname(P, i, n); });
        return F.svg(f.W, f.H, g, { label: 'right triangle' });
    }
    /** Any triangle through three points with optional side labels [AB, BC, CA], angle labels, vertex names. */
    function triFig(pts, sides = [], angs = [], names = null) {
        const f = fit(pts, 180, 105, 40, 22), P = f.P;
        let g = F.poly(P, { fill: C.FILL });
        [[0, 1], [1, 2], [2, 0]].forEach(([i, j], k) => { g += edgeLabel(P, i, j, sides[k]); });
        angs.forEach((a, i) => { if (a) g += angleMark(P[i], P[(i + 2) % 3], P[(i + 1) % 3], a, 15); });
        if (names) names.forEach((n, i) => { g += vname(P, i, n); });
        return F.svg(f.W, f.H, g, { label: 'triangle' });
    }
    /** Angle of depression from the top of a cliff (left) down to a boat (right). */
    function depressionFig(theta, labs) {
        const w = 160, h = Math.min(110, w * tan(theta)), ww = h / tan(theta), x0 = 76, y0 = 14;
        const top = [x0, y0], foot = [x0, y0 + h], boat = [x0 + ww, y0 + h];
        let g = F.rect(x0 - 26, y0, 26, h, { fill: C.SHADE, width: 1 }) + F.line(x0 - 30, y0 + h, x0 + ww + 24, y0 + h);
        g += F.line(top[0], top[1], boat[0], boat[1], { stroke: C.ACCENT, width: 1.5 }) + F.line(top[0], top[1], boat[0] + 10, top[1], { dash: true, width: 1 });
        g += F.rightAngle(foot[0], foot[1], 1, 0, 0, -1, 8) + angleMark(top, [boat[0], top[1]], boat, labs.ang, 22) + F.dot(boat[0], boat[1], { r: 3.5 });
        if (labs.h) g += F.text(x0 - 30, y0 + h / 2 + 4, labs.h, { anchor: 'end', ...hot(labs.h) });
        if (labs.d) g += F.text(x0 + ww / 2, y0 + h + 16, labs.d, hot(labs.d));
        return F.svg(x0 + ww + 34, y0 + h + 24, g, { label: 'angle of depression' });
    }

    // ── Numbers ──────────────────────────────────────────────────────────
    const PRIM = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41]];
    const r1 = x => CA.round(x, 1);
    /** True when x is safely away from a rounding boundary at 1 dp (or whole numbers with dp 0). */
    const safe = (x, dp = 1) => { const t = x * 10 ** dp; return Math.abs(t - Math.floor(t) - 0.5) > 0.08; };
    const fn = n => ({ sin: R`\sin`, cos: R`\cos`, tan: R`\tan` })[n];
    const UNITS = ['cm', 'm', 'ft', 'in'];
    // Exact special values, as TeX. Each is checked against Math.sin/cos/tan in the verifier.
    const EXACT = {
        sin: { 0: '0', 30: R`\frac{1}{2}`, 45: R`\frac{\sqrt{2}}{2}`, 60: R`\frac{\sqrt{3}}{2}`, 90: '1' },
        cos: { 0: '1', 30: R`\frac{\sqrt{3}}{2}`, 45: R`\frac{\sqrt{2}}{2}`, 60: R`\frac{1}{2}`, 90: '0' },
        tan: { 0: '0', 30: R`\frac{\sqrt{3}}{3}`, 45: '1', 60: R`\sqrt{3}` },
    };
    const ALLV = ['0', R`\frac{1}{2}`, R`\frac{\sqrt{2}}{2}`, R`\frac{\sqrt{3}}{2}`, '1', R`\sqrt{3}`, R`\frac{\sqrt{3}}{3}`];
    const mm = s => CA.m(s);

    /** Which side is opposite / adjacent / the hypotenuse — or (ratioOnly) which fraction is sin, cos or tan. */
    function labelSides(rng, ratioOnly) {
        const kind = ratioOnly ? 'ratio' : rng.pick(['opp', 'adj', 'hyp', 'opp', 'adj']);
        const names = rng.pick([['A', 'B', 'C'], ['P', 'Q', 'R'], ['X', 'Y', 'Z'], ['D', 'E', 'F'], ['K', 'L', 'M']]);
        const theta = rng.pick([30, 35, 40, 50, 55, 60]), flip = rng.bool();
        // θ at names[0], right angle at names[1]
        const [a, b, c] = names, side = (x, y) => [x, y].sort().join('');
        const sides = { opp: side(b, c), adj: side(a, b), hyp: side(a, c) };
        const fig = trigFig(theta, { ang: 'θ' }, { flip, names });
        if (kind === 'ratio') {
            const which = rng.pick(['sin', 'cos', 'tan']);
            const frac = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] }[which];
            const opts = ['sin', 'cos', 'tan'].map(w => { const fr = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] }[w]; return mm(R`\dfrac{${sides[fr[0]]}}{${sides[fr[1]]}}`); });
            const wrong = opts.filter((_, i) => ['sin', 'cos', 'tan'][i] !== which).concat([mm(R`\dfrac{${sides[frac[1]]}}{${sides[frac[0]]}}`)]);
            return { q: R`The right angle is at ${b}. Which fraction equals \(${fn(which)}\theta\)?`, fig, ans: CA.mc(rng, opts[['sin', 'cos', 'tan'].indexOf(which)], wrong), sol: R`\(${fn(which)}\theta = \dfrac{\text{${frac[0] === 'opp' ? 'opposite' : 'adjacent'}}}{\text{${frac[1] === 'hyp' ? 'hypotenuse' : 'adjacent'}}} = \dfrac{${sides[frac[0]]}}{${sides[frac[1]]}}\).` };
        }
        const word = { opp: 'opposite', adj: 'adjacent to', hyp: 'the hypotenuse' }[kind];
        const q = kind === 'hyp' ? `The right angle is at ${b}. Which side is the hypotenuse?` : R`The right angle is at ${b}. Which side is ${word} angle \(\theta\)?`;
        const why = { opp: R`${sides.opp} is across from \(\theta\) — it does not touch ${a}.`, adj: R`${sides.adj} touches \(\theta\) (at ${a}) and is not the hypotenuse.`, hyp: `${sides.hyp} is opposite the right angle at ${b}.` }[kind];
        return { q, fig, ans: CA.mc(rng, sides[kind], Object.values(sides).filter(s => s !== sides[kind])), sol: why };
    }

    CA.register({
        id: 'trigonometry',
        title: 'Trigonometry',
        page: 'trigonometry.html',
        assignmentNote: R`SOH-CAH-TOA: \(\sin\theta = \tfrac{\text{opp}}{\text{hyp}}\), \(\cos\theta = \tfrac{\text{adj}}{\text{hyp}}\), \(\tan\theta = \tfrac{\text{opp}}{\text{adj}}\). Use a calculator in degree mode where needed and round as each question says. Give exact values as fractions or roots.`,

        practice: [
            {
                id: 'label-sides', name: 'Opposite, adjacent, hypotenuse', level: 1,
                gen(rng) { return labelSides(rng, false); },
            },
            {
                id: 'name-ratio', name: 'SOH-CAH-TOA with letters', level: 1,
                gen(rng) { return labelSides(rng, true); },
            },
            {
                id: 'write-ratio', name: 'Write a trig ratio', level: 1,
                gen(rng) {
                    const [p, q0, h] = rng.pick(PRIM), k = rng.pick([1, 1, 2]), [o, a] = rng.bool() ? [p * k, q0 * k] : [q0 * k, p * k], hy = h * k;
                    const theta = deg(Math.atan2(o, a)), which = rng.pick(['sin', 'cos', 'tan']);
                    const [n, d] = { sin: [o, hy], cos: [a, hy], tan: [o, a] }[which];
                    const u = rng.pick(UNITS);
                    return {
                        q: R`Find \(${fn(which)}\theta\) as a fraction in lowest terms.`, fig: trigFig(theta, { opp: `${o} ${u}`, adj: `${a} ${u}`, hyp: `${hy} ${u}`, ang: 'θ' }, { flip: rng.bool() }),
                        ans: CA.frac(n, d), sol: R`\(${fn(which)}\theta = \dfrac{\text{${{ sin: 'opp', cos: 'adj', tan: 'opp' }[which]}}}{\text{${{ sin: 'hyp', cos: 'hyp', tan: 'adj' }[which]}}} = \dfrac{${n}}{${d}}${CA.gcd(n, d) > 1 ? ` = ${T.frac(n, d)}` : ''}\).`,
                    };
                },
            },
            {
                id: 'special-values', name: 'Special angles', level: 1,
                gen(rng) {
                    if (rng.bool(0.3)) {                                          // reverse: which angle?
                        const f = rng.pick(['sin', 'cos', 'tan']), ang = rng.pick(f === 'tan' ? [30, 45, 60] : [30, 45, 60]);
                        return { q: R`\(\theta\) is an acute angle and \(${fn(f)}\theta = ${EXACT[f][ang]}\). Find \(\theta\).`, ans: CA.num(ang, '°'), sol: R`From the special-angle table, \(${fn(f)} ${ang}^\circ = ${EXACT[f][ang]}\), so \(\theta = ${ang}^\circ\).` };
                    }
                    const f = rng.pick(['sin', 'cos', 'tan']), ang = rng.pick(f === 'tan' ? [0, 30, 45, 60] : [0, 30, 45, 60, 90]);
                    const right = EXACT[f][ang], wrong = rng.shuffle(ALLV.filter(v => v !== right));
                    const other = f === 'sin' ? EXACT.cos[ang] : f === 'cos' ? EXACT.sin[ang] : null;   // the classic mix-up first
                    const ws = (other && other !== right ? [other] : []).concat(wrong.filter(w => w !== other));
                    return { q: R`What is the exact value of \(${fn(f)} ${ang}^\circ\)?`, ans: CA.mc(rng, mm(right), ws.map(mm)), sol: R`\(${fn(f)} ${ang}^\circ = ${right}\)${ang === 30 || ang === 60 ? ' (use the 30-60-90 triangle with sides 1, √3, 2)' : ang === 45 ? ' (use the 45-45-90 triangle with sides 1, 1, √2)' : ''}.` };
                },
            },
            {
                id: 'special-side', name: 'Sides from special angles', level: 1,
                gen(rng) {
                    const u = rng.pick(UNITS), kind = rng.int(0, 3);
                    if (kind === 0) {                                             // 30°, hyp → opp
                        const h = 2 * rng.int(2, 12);
                        return { q: R`Find \(x\).`, fig: trigFig(30, { hyp: `${h} ${u}`, opp: 'x', ang: '30°' }, { flip: rng.bool() }), ans: CA.num(h / 2, u), sol: R`\(x = ${h}\sin 30^\circ = ${h}\times\tfrac12 = ${h / 2}\) ${u}.` };
                    }
                    if (kind === 1) {                                             // 60°, hyp → adj
                        const h = 2 * rng.int(2, 12);
                        return { q: R`Find \(x\).`, fig: trigFig(60, { hyp: `${h} ${u}`, adj: 'x', ang: '60°' }, { flip: rng.bool() }), ans: CA.num(h / 2, u), sol: R`\(x = ${h}\cos 60^\circ = ${h}\times\tfrac12 = ${h / 2}\) ${u}.` };
                    }
                    if (kind === 2) {                                             // 45°, adj → opp
                        const a = rng.int(3, 20);
                        return { q: R`Find \(x\).`, fig: trigFig(45, { adj: `${a} ${u}`, opp: 'x', ang: '45°' }, { flip: rng.bool() }), ans: CA.num(a, u), sol: R`\(x = ${a}\tan 45^\circ = ${a}\times 1 = ${a}\) ${u}.` };
                    }
                    const h = 2 * rng.int(2, 10);                                // 60°, hyp → opp = (h/2)√3
                    return { q: R`Find \(x\) in simplest radical form.`, fig: trigFig(60, { hyp: `${h} ${u}`, opp: 'x', ang: '60°' }, { flip: rng.bool() }), ans: CA.root(h / 2, 3, u), sol: R`\(x = ${h}\sin 60^\circ = ${h}\times\dfrac{\sqrt{3}}{2} = ${T.root(h / 2, 3)}\) ${u}.` };
                },
            },
            {
                id: 'find-side', name: 'Find a side (multiply)', level: 2,
                gen(rng) {
                    for (;;) {
                        const theta = rng.int(20, 70), g = rng.int(5, 30), u = rng.pick(UNITS), kind = rng.pick(['sin', 'cos', 'tan']);
                        const v = g * { sin: sin(theta), cos: cos(theta), tan: tan(theta) }[kind];
                        if (!safe(v)) continue;
                        const labs = kind === 'sin' ? { hyp: `${g} ${u}`, opp: 'x' } : kind === 'cos' ? { hyp: `${g} ${u}`, adj: 'x' } : { adj: `${g} ${u}`, opp: 'x' };
                        const rule = { sin: R`\sin ${theta}^\circ = \dfrac{x}{${g}}`, cos: R`\cos ${theta}^\circ = \dfrac{x}{${g}}`, tan: R`\tan ${theta}^\circ = \dfrac{x}{${g}}` }[kind];
                        return {
                            q: R`Find \(x\), to 1 decimal place.`, fig: trigFig(theta, { ...labs, ang: `${theta}°` }, { flip: rng.bool() }), ans: CA.num(r1(v), u, { tol: 0.06 }),
                            sol: R`${kind === 'sin' ? 'SOH' : kind === 'cos' ? 'CAH' : 'TOA'}: \(${rule}\), so \(x = ${g}${fn(kind)} ${theta}^\circ \approx ${r1(v)}\) ${u}.`,
                        };
                    }
                },
            },
            {
                id: 'find-side-div', name: 'Find a side (divide)', level: 2,
                gen(rng) {
                    for (;;) {
                        const theta = rng.int(20, 70), g = rng.int(4, 25), u = rng.pick(UNITS), kind = rng.pick(['sin', 'cos', 'tan']);
                        const v = g / { sin: sin(theta), cos: cos(theta), tan: tan(theta) }[kind];
                        if (!safe(v) || v > 80) continue;
                        const labs = kind === 'sin' ? { opp: `${g} ${u}`, hyp: 'x' } : kind === 'cos' ? { adj: `${g} ${u}`, hyp: 'x' } : { opp: `${g} ${u}`, adj: 'x' };
                        const rule = { sin: R`\sin ${theta}^\circ = \dfrac{${g}}{x}`, cos: R`\cos ${theta}^\circ = \dfrac{${g}}{x}`, tan: R`\tan ${theta}^\circ = \dfrac{${g}}{x}` }[kind];
                        return {
                            q: R`Find \(x\), to 1 decimal place.`, fig: trigFig(theta, { ...labs, ang: `${theta}°` }, { flip: rng.bool() }), ans: CA.num(r1(v), u, { tol: 0.06 }),
                            sol: R`\(${rule}\), so \(x = \dfrac{${g}}{${fn(kind)} ${theta}^\circ} \approx ${r1(v)}\) ${u}. (The unknown is on the bottom, so divide.)`,
                        };
                    }
                },
            },
            {
                id: 'find-angle', name: 'Find an angle', level: 2,
                gen(rng) {
                    for (;;) {
                        const kind = rng.pick(['sin', 'cos', 'tan']), u = rng.pick(UNITS);
                        let p, q, theta, labs;
                        if (kind === 'tan') { p = rng.int(3, 20); q = rng.int(3, 20); theta = deg(Math.atan(p / q)); labs = { opp: `${p} ${u}`, adj: `${q} ${u}` }; }
                        else { q = rng.int(6, 25); p = rng.int(2, q - 1); theta = deg(kind === 'sin' ? Math.asin(p / q) : Math.acos(p / q)); labs = kind === 'sin' ? { opp: `${p} ${u}`, hyp: `${q} ${u}` } : { adj: `${p} ${u}`, hyp: `${q} ${u}` }; }
                        if (theta < 15 || theta > 75 || !safe(theta, 0)) continue;
                        const t = Math.round(theta), inv = { sin: R`\sin^{-1}`, cos: R`\cos^{-1}`, tan: R`\tan^{-1}` }[kind];
                        return {
                            q: R`Find the angle \(\theta\), to the nearest degree.`, fig: trigFig(theta, { ...labs, ang: 'θ' }, { flip: rng.bool() }), ans: CA.num(t, '°'),
                            sol: R`\(${fn(kind)}\theta = \dfrac{${p}}{${q}}\), so \(\theta = ${inv}\!\left(\dfrac{${p}}{${q}}\right) \approx ${CA.round(theta, 2)}^\circ \approx ${t}^\circ\).`,
                        };
                    }
                },
            },
            {
                id: 'from-one-ratio', name: 'From one ratio to another', level: 2,
                gen(rng) {
                    const [o, a, h] = rng.pick(PRIM), [O, A] = rng.bool() ? [o, a] : [a, o];
                    const val = { sin: [O, h], cos: [A, h], tan: [O, A] };
                    const g = rng.pick(['sin', 'cos', 'tan']), t = rng.pick(['sin', 'cos', 'tan'].filter(x => x !== g));
                    const known = g === 'sin' ? R`opposite \(${O}\), hypotenuse \(${h}\), so adjacent \(= \sqrt{${h}^2 - ${O}^2} = ${A}\)` : g === 'cos' ? R`adjacent \(${A}\), hypotenuse \(${h}\), so opposite \(= \sqrt{${h}^2 - ${A}^2} = ${O}\)` : R`opposite \(${O}\), adjacent \(${A}\), so hypotenuse \(= \sqrt{${O}^2 + ${A}^2} = ${h}\)`;
                    if (h === 5 && Number.isInteger(100 * val[t][0] / val[t][1]) && rng.bool(0.5)) {                               // decimals: sin θ = 0.6 etc.
                        return { q: R`\(\theta\) is acute and \(${fn(g)}\theta = ${val[g][0] / val[g][1]}\). Find \(${fn(t)}\theta\).`, ans: CA.num(val[t][0] / val[t][1]), sol: R`\(${val[g][0] / val[g][1]} = ${T.frac(val[g][0], val[g][1])}\). Draw a right triangle with ${known}. Then \(${fn(t)}\theta = ${T.frac(...val[t])} = ${val[t][0] / val[t][1]}\).` };
                    }
                    return { q: R`\(\theta\) is acute and \(${fn(g)}\theta = ${T.frac(...val[g])}\). Find \(${fn(t)}\theta\) as a fraction.`, ans: CA.frac(...val[t]), sol: R`Draw a right triangle with ${known}. Then \(${fn(t)}\theta = ${T.frac(...val[t])}\).` };
                },
            },
            {
                id: 'elevation', name: 'Angles of elevation and depression', level: 2,
                gen(rng) {
                    for (;;) {
                        const kind = rng.int(0, 5), theta = rng.int(20, 70);
                        if (kind === 0) {                                         // tree / building height from distance
                            const d = rng.int(8, 60), v = d * tan(theta), obj = rng.pick(['tree', 'flagpole', 'building', 'tower']);
                            if (!safe(v) || v > 120) continue;
                            return {
                                q: `From a point ${d} m from the foot of a ${obj}, the angle of elevation to its top is ${theta}°. How tall is the ${obj}, to 1 decimal place?`,
                                fig: trigFig(theta, { adj: `${d} m`, opp: 'h', ang: `${theta}°` }), ans: CA.num(r1(v), 'm', { tol: 0.06 }),
                                sol: R`\(\tan ${theta}^\circ = \dfrac{h}{${d}}\), so \(h = ${d}\tan ${theta}^\circ \approx ${r1(v)}\) m.`,
                            };
                        }
                        if (kind === 1) {                                         // ladder
                            const L = rng.int(3, 12), th = rng.int(55, 80), v = L * sin(th);
                            if (!safe(v)) continue;
                            return {
                                q: `A ${L} m ladder leans against a wall, making an angle of ${th}° with the ground. How high up the wall does it reach, to 1 decimal place?`,
                                fig: trigFig(th, { hyp: `${L} m`, opp: 'h', ang: `${th}°` }, { flip: true }), ans: CA.num(r1(v), 'm', { tol: 0.06 }),
                                sol: R`\(\sin ${th}^\circ = \dfrac{h}{${L}}\), so \(h = ${L}\sin ${th}^\circ \approx ${r1(v)}\) m.`,
                            };
                        }
                        if (kind === 2) {                                         // depression from a cliff
                            const h = rng.int(20, 120), th = rng.int(15, 50), v = h / tan(th);
                            if (!safe(v) || v > 300) continue;
                            const what = rng.pick(['cliff', 'lighthouse']);
                            return {
                                q: `From the top of a ${h} m ${what}, the angle of depression to a boat is ${th}°. How far is the boat from the foot of the ${what}, to 1 decimal place?`,
                                fig: depressionFig(th, { h: `${h} m`, d: 'd', ang: `${th}°` }), ans: CA.num(r1(v), 'm', { tol: 0.06 }),
                                sol: R`The angle at the boat is also ${th}° (alternate angles). \(\tan ${th}^\circ = \dfrac{${h}}{d}\), so \(d = \dfrac{${h}}{\tan ${th}^\circ} \approx ${r1(v)}\) m.`,
                            };
                        }
                        if (kind === 3) {                                         // kite
                            const L = rng.int(15, 80), v = L * sin(theta);
                            if (!safe(v)) continue;
                            return {
                                q: `A kite string ${L} m long is pulled tight and makes an angle of ${theta}° with the ground. How high is the kite above the hand holding the string, to 1 decimal place?`,
                                fig: trigFig(theta, { hyp: `${L} m`, opp: 'h', ang: `${theta}°` }), ans: CA.num(r1(v), 'm', { tol: 0.06 }),
                                sol: R`\(h = ${L}\sin ${theta}^\circ \approx ${r1(v)}\) m.`,
                            };
                        }
                        if (kind === 4) {                                         // sun angle from a shadow
                            const h = rng.int(2, 30), s = rng.int(2, 40), t = deg(Math.atan(h / s));
                            if (t < 15 || t > 75 || !safe(t, 0)) continue;
                            return {
                                q: `${/^(8|11|18|8\d)$/.test(String(h)) ? 'An' : 'A'} ${h} m pole casts a shadow ${s} m long on flat ground. What is the angle of elevation of the sun, to the nearest degree?`,
                                fig: trigFig(t, { adj: `${s} m`, opp: `${h} m`, ang: 'θ' }, { flip: true }), ans: CA.num(Math.round(t), '°'),
                                sol: R`\(\tan\theta = \dfrac{${h}}{${s}}\), so \(\theta = \tan^{-1}\!\left(\dfrac{${h}}{${s}}\right) \approx ${Math.round(t)}^\circ\).`,
                            };
                        }
                        const L = rng.int(4, 20), rise = rng.int(1, Math.floor(L / 2)), t = deg(Math.asin(rise / L));     // ramp
                        if (t < 10 || !safe(t, 0)) continue;
                        return {
                            q: `A straight ramp ${L} m long rises ${rise} m. What angle does it make with the ground, to the nearest degree?`,
                            fig: trigFig(t, { hyp: `${L} m`, opp: `${rise} m`, ang: 'θ' }), ans: CA.num(Math.round(t), '°'),
                            sol: R`\(\sin\theta = \dfrac{${rise}}{${L}}\), so \(\theta = \sin^{-1}\!\left(\dfrac{${rise}}{${L}}\right) \approx ${Math.round(t)}^\circ\).`,
                        };
                    }
                },
            },
            {
                id: 'double-angle', name: 'Double-angle formulas', level: 3,
                gen(rng) {
                    const kind = rng.pick(['sin2', 'cos2', 'tan2']);
                    const [o0, a0, h] = rng.pick(PRIM), [s, c] = rng.bool() ? [o0, a0] : [a0, o0], H2 = h * h;
                    const given = R`\(\theta\) is acute with \(\sin\theta = ${T.frac(s, h)}\) and \(\cos\theta = ${T.frac(c, h)}\).`;
                    if (kind === 'sin2') return { q: R`${given} Find \(\sin 2\theta\) as a fraction.`, ans: CA.frac(2 * s * c, H2), sol: R`\(\sin 2\theta = 2\sin\theta\cos\theta = 2\times\dfrac{${s}}{${h}}\times\dfrac{${c}}{${h}} = ${T.frac(2 * s * c, H2)}\).` };
                    if (kind === 'cos2') return { q: R`${given} Find \(\cos 2\theta\) as a fraction.`, ans: CA.frac(c * c - s * s, H2), sol: R`\(\cos 2\theta = \cos^2\theta - \sin^2\theta = \dfrac{${c * c}}{${H2}} - \dfrac{${s * s}}{${H2}} = ${T.frac(c * c - s * s, H2)}\).` };
                    const t = T.frac(s, c);
                    return { q: R`\(\theta\) is acute and \(\tan\theta = ${t}\). Find \(\tan 2\theta\) as a fraction.`, ans: CA.frac(2 * s * c, c * c - s * s), sol: R`\(\tan 2\theta = \dfrac{2\tan\theta}{1 - \tan^2\theta} = \dfrac{2\cdot ${t}}{1 - ${T.frac(s * s, c * c)}} = ${T.frac(2 * s * c, c * c - s * s)}\).` };
                },
            },
            {
                id: 'sum-difference', name: 'Angle sum and difference', level: 3,
                gen(rng) {
                    // sin / cos of A ± B where one angle is 45° and the other is 30° or 60°: the answer is (p√6 + q√2)/4.
                    const other = rng.pick([30, 60]), plus = rng.bool();
                    let A = 45, B = other;
                    if (rng.bool()) [A, B] = [B, A];
                    if (!plus && A < B) [A, B] = [B, A];
                    const f = rng.pick(['sin', 'cos']), sgn = plus ? 1 : -1, ang = A + sgn * B;
                    const v = f === 'sin' ? sin(A) * cos(B) + sgn * cos(A) * sin(B) : cos(A) * cos(B) - sgn * sin(A) * sin(B);
                    let p = 0, q = 0;
                    for (const pp of [1, -1]) for (const qq of [1, -1]) if (Math.abs((pp * Math.sqrt(6) + qq * Math.sqrt(2)) / 4 - v) < 1e-9) { p = pp; q = qq; }
                    const form = (pp, qq) => mm(pp > 0 ? R`\dfrac{\sqrt{6} ${qq > 0 ? '+' : '-'} \sqrt{2}}{4}` : R`\dfrac{${qq > 0 ? '' : '-'}\sqrt{2} - \sqrt{6}}{4}`);
                    const right = form(p, q), wrongs = [form(p, -q), form(-p, -q), form(-p, q), mm(R`\dfrac{\sqrt{3} + 1}{2}`), mm(R`\dfrac{\sqrt{6} + \sqrt{2}}{2}`)];
                    const sA = { 30: R`\tfrac12`, 45: R`\tfrac{\sqrt2}{2}`, 60: R`\tfrac{\sqrt3}{2}` }, cA = { 30: R`\tfrac{\sqrt3}{2}`, 45: R`\tfrac{\sqrt2}{2}`, 60: R`\tfrac12` };
                    const op = plus ? '+' : '-';
                    const expand = f === 'sin' ? R`\sin ${A}^\circ\cos ${B}^\circ ${op} \cos ${A}^\circ\sin ${B}^\circ = ${sA[A]}\cdot${cA[B]} ${op} ${cA[A]}\cdot${sA[B]}`
                        : R`\cos ${A}^\circ\cos ${B}^\circ ${plus ? '-' : '+'} \sin ${A}^\circ\sin ${B}^\circ = ${cA[A]}\cdot${cA[B]} ${plus ? '-' : '+'} ${sA[A]}\cdot${sA[B]}`;
                    return {
                        q: R`Use an angle ${plus ? 'sum' : 'difference'} formula to find the exact value of \(${fn(f)}(${A}^\circ ${op} ${B}^\circ) = ${fn(f)} ${ang}^\circ\).`,
                        ans: CA.mc(rng, right, wrongs.filter(w => w !== right)), sol: R`\(${expand}\), which simplifies to ${right}.`,
                    };
                },
            },
            {
                id: 'identities', name: 'Using identities', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                             // 1 + tan² = 1/cos²
                        const [o0, a0, h] = rng.pick(PRIM), [o, a] = rng.bool() ? [o0, a0] : [a0, o0];
                        return { q: R`\(\theta\) is acute and \(\tan\theta = ${T.frac(o, a)}\). Use \(1 + \tan^2\theta = \dfrac{1}{\cos^2\theta}\) to find \(\cos^2\theta\) as a fraction.`, ans: CA.frac(a * a, h * h), sol: R`\(1 + \dfrac{${o * o}}{${a * a}} = \dfrac{${h * h}}{${a * a}} = \dfrac{1}{\cos^2\theta}\), so \(\cos^2\theta = ${T.frac(a * a, h * h)}\).` };
                    }
                    if (kind === 1) {                                             // sin² + cos² = 1 → cot
                        const [o0, a0, h] = rng.pick(PRIM), [o, a] = rng.bool() ? [o0, a0] : [a0, o0];
                        return { q: R`\(\theta\) is acute and \(\sin\theta = ${T.frac(o, h)}\). Find \(\cot\theta = \dfrac{\cos\theta}{\sin\theta}\) as a fraction.`, ans: CA.frac(a, o), sol: R`\(\cos\theta = \sqrt{1 - \dfrac{${o * o}}{${h * h}}} = \dfrac{${a}}{${h}}\), so \(\cot\theta = \dfrac{${a}/${h}}{${o}/${h}} = ${T.frac(a, o)}\).` };
                    }
                    const t = rng.int(10, 80), f = rng.pick(['sin', 'cos']), g = f === 'sin' ? 'cos' : 'sin';   // co-function
                    if (t === 45) return this.gen(rng);
                    const right = mm(R`${fn(g)} ${90 - t}^\circ`);
                    return { q: R`Which of these is equal to \(${fn(f)} ${t}^\circ\)?`, ans: CA.mc(rng, right, [mm(R`${fn(g)} ${t}^\circ`), mm(R`${fn(f)} ${90 - t}^\circ`), mm(R`${fn(g)} ${180 - t}^\circ`), mm(R`\tan ${90 - t}^\circ`)]), sol: R`Co-functions: \(${fn(f)}\theta = ${fn(g)}(90^\circ - \theta)\), so \(${fn(f)} ${t}^\circ = ${fn(g)} ${90 - t}^\circ\).` };
                },
            },
            {
                id: 'any-triangle', name: 'Laws of sines and cosines', level: 3,
                gen(rng) {
                    for (;;) {
                        const u = rng.pick(['cm', 'm']);
                        if (rng.bool()) {                                         // law of cosines
                            const a = rng.int(4, 15), b = rng.int(4, 15), Cg = rng.int(30, 130);
                            const c2 = a * a + b * b - 2 * a * b * cos(Cg), c = Math.sqrt(c2);
                            if (!safe(c)) continue;
                            const pts = [[b * cos(Cg), b * sin(Cg)], [a, 0], [0, 0]];   // A, B, C
                            return {
                                q: R`Use the law of cosines to find \(x\), to 1 decimal place.`, fig: triFig(pts, ['x', `${a} ${u}`, `${b} ${u}`], [null, null, `${Cg}°`]),
                                ans: CA.num(r1(c), u, { tol: 0.06 }), sol: R`\(x^2 = ${a}^2 + ${b}^2 - 2(${a})(${b})\cos ${Cg}^\circ \approx ${CA.round(c2, 2)}\), so \(x \approx ${r1(c)}\) ${u}.`,
                            };
                        }
                        const A = rng.int(30, 80), B = rng.int(30, 80), a = rng.int(5, 20);       // law of sines
                        if (A + B > 150 || A === B) continue;
                        const b = a * sin(B) / sin(A);
                        if (!safe(b)) continue;
                        const Cg = 180 - A - B, cc = a * sin(Cg) / sin(A);
                        const pts = [[0, 0], [cc, 0], [b * cos(A), b * sin(A)]];                 // A, B, C
                        return {
                            q: R`Use the law of sines to find \(x\), to 1 decimal place.`, fig: triFig(pts, [null, `${a} ${u}`, 'x'], [`${A}°`, `${B}°`, null]),
                            ans: CA.num(r1(b), u, { tol: 0.06 }), sol: R`\(\dfrac{x}{\sin ${B}^\circ} = \dfrac{${a}}{\sin ${A}^\circ}\), so \(x = \dfrac{${a}\sin ${B}^\circ}{\sin ${A}^\circ} \approx ${r1(b)}\) ${u}.`,
                        };
                    }
                },
            },
        ],

        assignment: [
            ['label-sides', 2], ['name-ratio', 2], ['write-ratio', 4], ['special-values', 4], ['special-side', 3],
            ['find-side', 5], ['find-side-div', 4], ['find-angle', 5], ['from-one-ratio', 4], ['elevation', 5],
            ['double-angle', 3], ['sum-difference', 3], ['identities', 3], ['any-triangle', 3],
        ],
    });
})();
