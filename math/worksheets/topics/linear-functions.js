/* Worksheet: Linear Functions — the coordinate plane, slope, y = mx + b and graphing lines. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, T = CA.tex, F = CA.fig;
    const { INK, ACCENT } = F.colors;

    const nz = (rng, lo, hi) => { let v; do v = rng.int(lo, hi); while (v === 0); return v; };
    const par = n => (n < 0 ? `(${n})` : String(n));
    const pt = (x, y) => `(${x}, ${y})`;
    /** "y = -\frac{2}{3}x + 4" for slope mn/md and intercept b. */
    function lineTex(mn, md, b, v = 'y') {
        [mn, md] = CA.reduce(mn, md);
        let mx = '';
        if (mn !== 0) mx = md === 1 ? (mn === 1 ? 'x' : mn === -1 ? '-x' : `${mn}x`) : `${mn < 0 ? '-' : ''}\\frac{${Math.abs(mn)}}{${md}}x`;
        if (!mx) return `${v} = ${b}`;
        return `${v} = ${mx}${b > 0 ? ` + ${b}` : b < 0 ? ` - ${-b}` : ''}`;
    }
    /** "3x + 2y = 12"-style standard form. */
    function stdTex(a, b, c) {
        const t = (k, v, first) => (k === 0 ? '' : `${first ? (k < 0 ? '-' : '') : (k < 0 ? ' - ' : ' + ')}${Math.abs(k) === 1 ? '' : Math.abs(k)}${v}`);
        return `${t(a, 'x', true)}${t(b, 'y', a === 0)} = ${c}`;
    }
    const SLOPES = [[1, 1], [-1, 1], [2, 1], [-2, 1], [3, 1], [-3, 1], [1, 2], [-1, 2], [1, 3], [-1, 3], [2, 3], [-2, 3], [3, 2], [-3, 2]];

    // ── Coordinate grid ──────────────────────────────────────────────────
    /**
     * A coordinate plane from -n to n on both axes.
     * opt.points: [{x, y, label}], opt.lines: [{x1, y1, x2, y2}] (drawn edge to edge through both points).
     */
    function plane(opt = {}) {
        const n = opt.n || 6, s = opt.cell || 17, pad = 20, W = 2 * n * s + 2 * pad;
        const X = x => pad + (x + n) * s, Y = y => pad + (n - y) * s;
        let g = '';
        for (let i = -n; i <= n; i++) {
            g += F.line(X(i), Y(-n), X(i), Y(n), { stroke: '#cfd6e4', width: 0.7 });
            g += F.line(X(-n), Y(i), X(n), Y(i), { stroke: '#cfd6e4', width: 0.7 });
        }
        g += F.line(X(-n) - 6, Y(0), X(n) + 8, Y(0), { width: 1.3 }) + F.line(X(0), Y(-n) + 6, X(0), Y(n) - 8, { width: 1.3 });
        g += F.poly([[X(n) + 10, Y(0)], [X(n) + 3, Y(0) - 3.5], [X(n) + 3, Y(0) + 3.5]], { fill: INK, stroke: 'none' });
        g += F.poly([[X(0), Y(n) - 10], [X(0) - 3.5, Y(n) - 3], [X(0) + 3.5, Y(n) - 3]], { fill: INK, stroke: 'none' });
        g += F.text(X(n) + 12, Y(0) - 6, 'x', { italic: true, size: 12 }) + F.text(X(0) + 10, Y(n) - 8, 'y', { italic: true, size: 12 });
        for (let i = -n; i <= n; i++) {
            if (i === 0 || i % 2) continue;
            g += F.text(X(i), Y(0) + 12, String(i).replace('-', '−'), { size: 9 });
            g += F.text(X(0) - 4, Y(i) + 3, String(i).replace('-', '−'), { size: 9, anchor: 'end' });
        }
        g += F.text(X(0) - 4, Y(0) + 12, '0', { size: 9, anchor: 'end' });
        for (const L of opt.lines || []) {
            const seg = clip(L, n);
            if (seg) g += F.line(X(seg[0]), Y(seg[1]), X(seg[2]), Y(seg[3]), { stroke: ACCENT, width: 2 });
        }
        for (const P of opt.points || []) {
            g += F.dot(X(P.x), Y(P.y), { r: 3.2, fill: P.label ? INK : ACCENT });
            if (P.label) {
                const dx = P.x < 0 ? -9 : 9, dy = P.y < 0 ? 15 : -6;      // outward, away from the axis numbers
                g += `<rect x="${X(P.x) + dx - 6}" y="${Y(P.y) + dy - 10}" width="12" height="13" fill="white" stroke="none" opacity="0.85"/>`;
                g += F.text(X(P.x) + dx, Y(P.y) + dy, P.label, { bold: true, size: 12 });
            }
        }
        return F.svg(W, W, g, { label: 'coordinate grid' });
    }
    /** Clip the line through (x1,y1),(x2,y2) to the square [-n, n]². */
    function clip({ x1, y1, x2, y2 }, n) {
        const dx = x2 - x1, dy = y2 - y1;
        let t0 = -Infinity, t1 = Infinity;
        for (const [p, q] of [[-dx, x1 + n], [dx, n - x1], [-dy, y1 + n], [dy, n - y1]]) {
            if (p === 0) { if (q < 0) return null; continue; }
            const t = q / p;
            if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
        }
        if (t0 > t1) return null;
        return [x1 + t0 * dx, y1 + t0 * dy, x1 + t1 * dx, y1 + t1 * dy];
    }
    /** k points with integer coordinates in [-lim, lim], at least 2 apart from each other. */
    function spreadPoints(rng, k, lim) {
        for (;;) {
            const pts = [];
            for (let i = 0; i < 40 && pts.length < k; i++) {
                const x = rng.int(-lim, lim), y = rng.int(-lim, lim);
                if (x === 0 || y === 0) continue;
                if (pts.every(p => Math.max(Math.abs(p.x - x), Math.abs(p.y - y)) >= 2)) pts.push({ x, y });
            }
            if (pts.length === k) return pts;
        }
    }

    const QUAD = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'];
    const quadOf = (x, y) => QUAD[x > 0 ? (y > 0 ? 0 : 3) : (y > 0 ? 1 : 2)];
    const KINDS = ['Positive', 'Negative', 'Zero', 'Undefined'];
    const kindOf = (rise, run) => (run === 0 ? 'Undefined' : rise === 0 ? 'Zero' : rise * run > 0 ? 'Positive' : 'Negative');

    CA.register({
        id: 'linear-functions',
        title: 'Linear Functions',
        page: 'linear-functions.html',
        assignmentNote: R`A line \(y = mx + b\) has slope \(m = \dfrac{\text{rise}}{\text{run}} = \dfrac{y_2 - y_1}{x_2 - x_1}\) and \(y\)-intercept \(b\). Give answers that are not whole numbers as fractions in lowest terms.`,

        practice: [
            {
                id: 'read-point', name: 'Read points on the grid', level: 1,
                gen(rng) {
                    const pts = spreadPoints(rng, 4, 5), labels = ['A', 'B', 'C', 'D'];
                    pts.forEach((p, i) => { p.label = labels[i]; });
                    const fig = plane({ points: pts });
                    const i = rng.int(0, 3), P = pts[i];
                    if (P.x === 0 && P.y === 0) return this.gen(rng);
                    if (rng.bool()) {
                        return {
                            q: `Which point is at ${m(pt(P.x, P.y))}?`, fig,
                            ans: CA.mc(rng, labels[i], labels, { keepOrder: true }),
                            sol: R`Start at the origin, move ${Math.abs(P.x)} ${P.x < 0 ? 'left' : 'right'} and ${Math.abs(P.y)} ${P.y < 0 ? 'down' : 'up'}: that is point ${labels[i]}.`,
                        };
                    }
                    return {
                        q: `What are the coordinates of point ${P.label}?`, fig,
                        ans: CA.mc(rng, m(pt(P.x, P.y)), [pt(P.y, P.x), pt(-P.x, P.y), pt(P.x, -P.y), pt(-P.y, -P.x), pt(-P.x, -P.y)].map(m)),
                        sol: R`Point ${P.label} is ${Math.abs(P.x)} ${P.x < 0 ? 'left of' : 'right of'} the \(y\)-axis and ${Math.abs(P.y)} ${P.y < 0 ? 'below' : 'above'} the \(x\)-axis: \(${pt(P.x, P.y)}\). The \(x\)-coordinate always comes first.`,
                    };
                },
            },
            {
                id: 'quadrant', name: 'Quadrants', level: 1,
                gen(rng) {
                    const x = nz(rng, -12, 12), y = nz(rng, -12, 12);
                    if (rng.bool(0.6)) {
                        return {
                            q: R`In which quadrant is the point \(${pt(x, y)}\)?`,
                            ans: CA.mc(rng, quadOf(x, y), QUAD, { keepOrder: true }),
                            sol: R`\(x\) is ${x > 0 ? 'positive (right)' : 'negative (left)'} and \(y\) is ${y > 0 ? 'positive (up)' : 'negative (down)'}, so it is in ${quadOf(x, y)}.`,
                        };
                    }
                    const dx = nz(rng, -9, 9), dy = nz(rng, -9, 9), X = x + dx, Y = y + dy;
                    if (X === 0 || Y === 0) return this.gen(rng);
                    return {
                        q: R`The point \(${pt(x, y)}\) moves ${Math.abs(dx)} unit${Math.abs(dx) === 1 ? '' : 's'} ${dx < 0 ? 'left' : 'right'} and ${Math.abs(dy)} unit${Math.abs(dy) === 1 ? '' : 's'} ${dy < 0 ? 'down' : 'up'}. In which quadrant does it end up?`,
                        ans: CA.mc(rng, quadOf(X, Y), QUAD, { keepOrder: true }),
                        sol: R`New point: \((${x} ${dx < 0 ? '-' : '+'} ${Math.abs(dx)},\ ${y} ${dy < 0 ? '-' : '+'} ${Math.abs(dy)}) = ${pt(X, Y)}\), which is in ${quadOf(X, Y)}.`,
                    };
                },
            },
            {
                id: 'evaluate', name: 'Find y from x', level: 1,
                gen(rng) {
                    const mm = nz(rng, -5, 5), b = rng.int(-8, 8), x = rng.int(-6, 6), y = mm * x + b;
                    const kind = rng.int(0, 2);
                    const work = R`\(y = ${mm}(${x}) ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${mm * x} ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${y}\)`;
                    if (kind === 2 && mm > 0 && b > 0 && x > 0) {
                        const [thing, unit] = rng.pick([['A plant', 'cm'], ['A stack of books', 'cm'], ['A pile of sand', 'kg']]);
                        return { q: R`${thing} measures \(${lineTex(mm, 1, b)}\) ${unit} after \(x\) weeks. What does it measure after ${x} week${x === 1 ? '' : 's'}?`, ans: CA.num(y, unit), sol: work + '.' };
                    }
                    return { q: kind === 1 ? R`A line has equation \(${lineTex(mm, 1, b)}\). The point \((${x}, y)\) is on the line. Find \(y\).` : R`For \(${lineTex(mm, 1, b)}\), find \(y\) when \(x = ${x}\).`, ans: CA.num(y), sol: work + '.' };
                },
            },
            {
                id: 'read-slope-intercept', name: 'Slope and y-intercept from the equation', level: 1,
                gen(rng) {
                    const [mn, md] = rng.bool(0.3) ? rng.pick(SLOPES) : [nz(rng, -7, 7), 1];
                    const b = rng.int(-9, 9), form = rng.int(0, 3), askSlope = rng.bool();
                    let eq = lineTex(mn, md, b);
                    if (form === 1 && md === 1 && b !== 0) eq = `y = ${b} ${mn < 0 ? '-' : '+'} ${Math.abs(mn) === 1 ? '' : Math.abs(mn)}x`;
                    if (form === 3 && rng.bool(0.5)) {
                        return { q: R`What is the slope of the line \(y = ${b}\)?`, ans: CA.num(0), sol: R`\(y = ${b}\) is a horizontal line (\(y = 0x + ${b}\)), so its slope is 0.` };
                    }
                    return askSlope
                        ? { q: R`What is the slope of \(${eq}\)?`, ans: CA.frac(mn, md), sol: R`In \(y = mx + b\) the slope is the number multiplying \(x\): \(m = ${T.frac(mn, md)}\).` }
                        : { q: R`What is the \(y\)-intercept of \(${eq}\)?`, ans: CA.num(b), sol: R`The \(y\)-intercept is the value of \(y\) when \(x = 0\): \(b = ${b}\).` };
                },
            },
            {
                id: 'kind-of-slope', name: 'Positive, negative, zero or undefined', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    const x1 = rng.int(-5, 5), y1 = rng.int(-5, 5);
                    const type = rng.int(0, 3);
                    const x2 = type === 3 ? x1 : x1 + nz(rng, -4, 4), y2 = type === 2 ? y1 : y1 + nz(rng, -4, 4);
                    if (Math.abs(x2) > 5 || Math.abs(y2) > 5) return this.gen(rng);
                    const correct = kindOf(y2 - y1, x2 - x1);
                    const ans = CA.mc(rng, correct, KINDS, { keepOrder: true });
                    if (kind === 0) return { q: R`What kind of slope does the line through \(${pt(x1, y1)}\) and \(${pt(x2, y2)}\) have?`, ans, sol: R`Rise \(= ${y2 - y1}\), run \(= ${x2 - x1}\). ${correct === 'Undefined' ? 'The run is 0 (a vertical line), and you cannot divide by 0: the slope is not defined.' : correct === 'Zero' ? 'The rise is 0 (a horizontal line), so the slope is 0.' : `Rise ÷ run is ${correct.toLowerCase()}.`}` };
                    if (kind === 1) {
                        const fig = plane({ lines: [{ x1, y1, x2, y2 }], n: 5, cell: 19 });
                        return { q: 'What kind of slope does this line have?', fig, ans, sol: correct === 'Undefined' ? 'The line is vertical: the run is 0, and you cannot divide by 0, so the slope is not defined.' : correct === 'Zero' ? 'The line is flat (horizontal): slope 0.' : `Reading left to right, the line goes ${correct === 'Positive' ? 'up' : 'down'}, so the slope is ${correct.toLowerCase()}.` };
                    }
                    const eq = type === 3 ? `x = ${x1}` : type === 2 ? `y = ${y1}` : lineTex(y2 - y1, x2 - x1, rng.int(-6, 6));
                    return { q: R`What kind of slope does the line \(${eq}\) have?`, ans, sol: type === 3 ? R`\(${eq}\) is a vertical line (run 0), so its slope is not defined.` : type === 2 ? R`\(${eq}\) is a horizontal line, so its slope is 0.` : R`The slope is \(${T.frac(y2 - y1, x2 - x1)}\), which is ${correct.toLowerCase()}.` };
                },
            },
            {
                id: 'slope-two-points', name: 'Slope from two points', level: 2,
                gen(rng) {
                    const x1 = rng.int(-6, 6), y1 = rng.int(-6, 6), x2 = rng.int(-6, 6), y2 = rng.int(-6, 6);
                    if (x1 === x2 || (y1 === y2 && rng.bool(0.8))) return this.gen(rng);
                    return {
                        q: R`Find the slope of the line through \(${pt(x1, y1)}\) and \(${pt(x2, y2)}\).`,
                        ans: CA.frac(y2 - y1, x2 - x1),
                        sol: R`\(m = \dfrac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = \dfrac{${y2 - y1}}{${x2 - x1}} = ${T.frac(y2 - y1, x2 - x1)}\).`,
                    };
                },
            },
            {
                id: 'slope-from-graph', name: 'Slope from a graph', level: 2,
                gen(rng) {
                    const run = rng.int(1, 5), rise = rng.int(-5, 5);
                    if (rise === 0 && rng.bool(0.7)) return this.gen(rng);
                    if (run + Math.abs(rise) < 3) return this.gen(rng);
                    const x1 = rng.int(-5, 5 - run), y1 = rise >= 0 ? rng.int(-5, 5 - rise) : rng.int(-5 - rise, 5);
                    const x2 = x1 + run, y2 = y1 + rise;
                    if (!x1 || !y1 || !x2 || !y2) return this.gen(rng);
                    const fig = plane({ lines: [{ x1, y1, x2, y2 }], points: [{ x: x1, y: y1 }, { x: x2, y: y2 }] });
                    return {
                        q: 'Find the slope of the line. The two marked points are on grid corners.',
                        fig,
                        ans: CA.frac(rise, run),
                        sol: R`From \(${pt(x1, y1)}\) to \(${pt(x2, y2)}\): run \(${run}\) right, rise \(${rise}\)${rise < 0 ? ' (down)' : ''}. Slope \(= ${T.frac(rise, run)}\).`,
                    };
                },
            },
            {
                id: 'intercepts', name: 'x- and y-intercepts', level: 2,
                gen(rng) {
                    if (rng.bool(0.6)) {
                        const [mn, md] = rng.bool(0.3) ? rng.pick(SLOPES) : [nz(rng, -6, 6), 1], b = nz(rng, -12, 12);
                        const xi = CA.reduce(-b * md, mn);
                        if (xi[1] > 6) return this.gen(rng);
                        return {
                            q: R`Find the \(x\)-intercept of \(${lineTex(mn, md, b)}\) (the \(x\)-value where it crosses the \(x\)-axis).`,
                            ans: CA.frac(...xi),
                            sol: R`Set \(y = 0\): \(0 = ${lineTex(mn, md, b).slice(4)}\), so \(x = ${T.frac(...xi)}\).`,
                        };
                    }
                    const a = nz(rng, -6, 6), b = nz(rng, -6, 6), xi = nz(rng, -6, 6), c = a * xi;
                    const askX = rng.bool();
                    const val = askX ? CA.reduce(c, a) : CA.reduce(c, b);
                    return {
                        q: R`Find the ${askX ? R`\(x\)` : R`\(y\)`}-intercept of the line \(${stdTex(a, b, c)}\).`,
                        ans: CA.frac(...val),
                        sol: askX ? R`Set \(y = 0\): \(${a}x = ${c}\), so \(x = ${T.frac(...val)}\).` : R`Set \(x = 0\): \(${b}y = ${c}\), so \(y = ${T.frac(...val)}\).`,
                    };
                },
            },
            {
                id: 'equation-from-graph', name: 'Equation from a graph', level: 2,
                gen(rng) {
                    const [mn, md] = rng.pick(SLOPES), b = rng.int(-4, 4);
                    let x2 = md * (rng.bool() ? 1 : 2) * (rng.bool() ? 1 : -1), y2 = b + (mn * x2) / md;
                    if (Math.abs(y2) > 6) { x2 = -x2; y2 = b + (mn * x2) / md; }
                    if (Math.abs(y2) > 6 || Math.abs(x2) > 6) return this.gen(rng);
                    const fig = plane({ lines: [{ x1: 0, y1: b, x2, y2 }], points: [{ x: 0, y: b }, { x: x2, y: y2 }] });
                    const correct = lineTex(mn, md, b);
                    const wrong = [lineTex(-mn, md, b), lineTex(md, mn, b), lineTex(mn, md, -b), lineTex(mn, md, b + (b >= 0 ? 1 : -1)), lineTex(-md, mn, b)];
                    return {
                        q: 'Which equation describes this line?', fig,
                        ans: CA.mc(rng, m(correct), wrong.filter(w => w !== correct).map(m)),
                        sol: R`It crosses the \(y\)-axis at \(${pt(0, b)}\), so \(b = ${b}\). From there to \(${pt(x2, y2)}\): rise \(${y2 - b}\) over run \(${x2}\), so \(m = ${T.frac(mn, md)}\). Equation: \(${correct}\).`,
                    };
                },
            },
            {
                id: 'line-through-points', name: 'Equation through two points', level: 2,
                gen(rng) {
                    const [mn, md] = rng.bool(0.6) ? [nz(rng, -4, 4), 1] : rng.pick(SLOPES.slice(6)), b = rng.int(-8, 8);
                    const xs = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter(x => x % md === 0);
                    const [x1, x2] = rng.sample(xs, 2).sort((p, q) => p - q);
                    const y1 = b + (mn * x1) / md, y2 = b + (mn * x2) / md;
                    const work = R`Slope: \(m = \dfrac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = ${T.frac(mn, md)}\). Then \(${y1} = ${T.frac(mn, md)}\times${par(x1)} + b\)`;
                    if (rng.bool(0.65)) {
                        return { q: R`A line passes through \(${pt(x1, y1)}\) and \(${pt(x2, y2)}\). Its equation is \(y = mx + b\). Find \(b\).`, ans: CA.num(b), sol: work + R`, so \(b = ${b}\).` };
                    }
                    const correct = lineTex(mn, md, b);
                    return {
                        q: R`Which is the equation of the line through \(${pt(x1, y1)}\) and \(${pt(x2, y2)}\)?`,
                        ans: CA.mc(rng, m(correct), [lineTex(md, mn, b), lineTex(-mn, md, b), lineTex(mn, md, y1), lineTex(mn, md, -b), lineTex(mn, md, b + 1)].filter(w => w !== correct).map(m)),
                        sol: work + R`, so \(b = ${b}\) and the line is \(${correct}\).`,
                    };
                },
            },
            {
                id: 'point-on-line', name: 'Points on a line', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const mm = nz(rng, -5, 5), b = rng.int(-9, 9), k = rng.int(-8, 8), y0 = mm * k + b;
                        return { q: R`The point \((k, ${y0})\) lies on the line \(${lineTex(mm, 1, b)}\). Find \(k\).`, ans: CA.num(k), sol: R`Substitute \(y = ${y0}\): \(${y0} = ${lineTex(mm, 1, b).slice(4).replace('x', 'k')}\), so \(${mm === 1 ? '' : mm === -1 ? '-' : mm}k = ${y0 - b}\) and \(k = ${k}\).` };
                    }
                    if (kind === 1) {
                        const mm = nz(rng, -5, 5), p = nz(rng, -6, 6), c = rng.int(-9, 9), q = mm * p + c;
                        return { q: R`The line \(y = ${mm === 1 ? '' : mm === -1 ? '-' : mm}x + c\) passes through \(${pt(p, q)}\). Find \(c\).`, ans: CA.num(c), sol: R`Substitute: \(${q} = ${mm}\times${par(p)} + c = ${mm * p} + c\), so \(c = ${c}\).` };
                    }
                    const k = nz(rng, -5, 5), b = rng.int(-9, 9), p = nz(rng, -6, 6), q = k * p + b;
                    return { q: R`The line \(y = kx ${b < 0 ? '-' : '+'} ${Math.abs(b)}\) passes through \(${pt(p, q)}\). Find \(k\).`, ans: CA.num(k), sol: R`Substitute: \(${q} = ${p}k ${b < 0 ? '-' : '+'} ${Math.abs(b)}\), so \(${p}k = ${q - b}\) and \(k = ${k}\).` };
                },
            },
            {
                id: 'parallel-perpendicular', name: 'Parallel and perpendicular lines', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2), perp = rng.bool();
                    if (kind === 0) {
                        const [mn, md] = rng.bool(0.5) ? rng.pick(SLOPES) : [nz(rng, -6, 6), 1], b = rng.int(-9, 9);
                        const ans = perp ? [-md, mn] : [mn, md];
                        return { q: R`What is the slope of a line ${perp ? 'perpendicular' : 'parallel'} to \(${lineTex(mn, md, b)}\)?`, ans: CA.frac(...ans), sol: perp ? R`Perpendicular slopes multiply to \(-1\): flip \(${T.frac(mn, md)}\) and change its sign to get \(${T.frac(...ans)}\).` : R`Parallel lines have the same slope: \(${T.frac(mn, md)}\).` };
                    }
                    if (kind === 1) {
                        const a = nz(rng, -6, 6), b = nz(rng, -6, 6), c = nz(rng, -12, 12);
                        if (CA.gcd(CA.gcd(a, b), c) !== 1 || b < 0) return this.gen(rng);
                        const slope = CA.reduce(-a, b), ans = perp ? CA.reduce(b, a) : slope;
                        return { q: R`What is the slope of a line ${perp ? 'perpendicular' : 'parallel'} to \(${stdTex(a, b, c)}\)?`, ans: CA.frac(...ans), sol: R`Solve for \(y\): \(${b === 1 ? '' : b}y = ${-a === 1 ? '' : -a === -1 ? '-' : -a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}\), so the slope is \(${T.frac(...slope)}\).${perp ? R` A perpendicular slope is the negative reciprocal: \(${T.frac(...ans)}\).` : ' A parallel line has the same slope.'}` };
                    }
                    const [mn, md] = rng.pick(SLOPES), b1 = rng.int(-9, 9), b2 = rng.int(-9, 9);
                    const ans = perp ? [-md, mn] : [mn, md];
                    return { q: R`The lines \(${lineTex(mn, md, b1)}\) and \(y = kx ${b2 < 0 ? '-' : '+'} ${Math.abs(b2)}\) are ${perp ? 'perpendicular' : 'parallel'}. Find \(k\).`, ans: CA.frac(...ans), sol: perp ? R`\(${T.frac(mn, md)} \times k = -1\), so \(k = ${T.frac(...ans)}\).` : R`Parallel lines have equal slopes: \(k = ${T.frac(mn, md)}\).` };
                },
            },
            {
                id: 'intersection', name: 'Where two lines meet', level: 3,
                gen(rng) {
                    const x0 = rng.int(-6, 6), y0 = rng.int(-8, 8), m1 = rng.int(-4, 4), m2 = rng.int(-4, 4);
                    if (m1 === m2) return this.gen(rng);
                    const b1 = y0 - m1 * x0, b2 = y0 - m2 * x0, askX = rng.bool();
                    return {
                        q: R`The lines \(${lineTex(m1, 1, b1)}\) and \(${lineTex(m2, 1, b2)}\) cross at one point. What is its ${askX ? R`\(x\)` : R`\(y\)`}-coordinate?`,
                        ans: CA.num(askX ? x0 : y0),
                        sol: R`Set the right-hand sides equal: \(${lineTex(m1, 1, b1).slice(4)} = ${lineTex(m2, 1, b2).slice(4)}\), so \(${m1 - m2 === 1 ? '' : m1 - m2 === -1 ? '-' : m1 - m2}x = ${b2 - b1}\) and \(x = ${x0}\). Then \(y = ${m1}\times${par(x0)} ${b1 < 0 ? '-' : '+'} ${Math.abs(b1)} = ${y0}\). They meet at \(${pt(x0, y0)}\).`,
                    };
                },
            },
            {
                id: 'linear-model', name: 'Lines in real life', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    const money = v => (Number.isInteger(v) ? String(v) : v.toFixed(2));
                    if (kind === 0) {
                        const F0 = rng.int(2, 6), r = rng.pick([1.5, 2, 2.5, 3]), d = rng.int(3, 20), C = F0 + r * d;
                        return { q: `A taxi charges $${F0} plus $${money(r)} per kilometre. A ride cost $${money(C)}. How many kilometres long was it?`, ans: CA.num(d, 'km'), sol: R`Cost \(C = ${r}d + ${F0}\). So \(${r}d = ${money(C)} - ${F0} = ${money(C - F0)}\) and \(d = ${d}\) km.` };
                    }
                    if (kind === 1) {
                        const fee = rng.pick([10, 12, 15, 20, 25]), r = rng.pick([2, 3, 4, 5]), g = rng.int(2, 15), C = fee + r * g;
                        return { q: `A phone plan costs $${fee} a month plus $${r} for each gigabyte of data used. One month the bill was $${C}. How many gigabytes were used?`, ans: CA.num(g, 'GB'), sol: R`Bill \(= ${r}g + ${fee}\). So \(${r}g = ${C} - ${fee} = ${C - fee}\) and \(g = ${g}\) GB.` };
                    }
                    if (kind === 2) {
                        const start = rng.int(0, 6) * 10, r = rng.pick([5, 8, 10, 12, 15, 20]), t = rng.int(3, 12), V = start + r * t;
                        return { q: `A tank already holds ${start} litres of water, and a hose adds ${r} litres every minute. After how many minutes does the tank hold ${V} litres?`, ans: CA.num(t, 'min'), sol: R`Volume \(V = ${r}t${start ? ` + ${start}` : ''}\). So \(${r}t = ${V - start}\) and \(t = ${t}\) minutes.` };
                    }
                    const H = rng.int(15, 40), r = rng.int(2, 5), t = rng.int(2, Math.floor((H - 1) / r)), h = H - r * t;
                    return { q: R`A candle is ${H} cm tall and burns down ${r} cm every hour, so its height is \(h = ${H} - ${r}t\). After how many hours is it ${h} cm tall?`, ans: CA.num(t, 'h'), sol: R`\(${H} - ${r}t = ${h}\), so \(${r}t = ${H - h}\) and \(t = ${t}\) hours.` };
                },
            },
            {
                id: 'table-and-area', name: 'Tables of values and triangles', level: 3,
                gen(rng) {
                    if (rng.bool()) {
                        const mm = nz(rng, -6, 6), b = rng.int(-10, 10), x0 = rng.int(1, 3), step = rng.pick([1, 1, 2]), N = rng.int(8, 20);
                        const xs = [0, 1, 2, 3].map(i => x0 + i * step), ys = xs.map(x => mm * x + b);
                        return { q: R`The table shows points on a straight line. What is \(y\) when \(x = ${N}\)?\[\begin{array}{c|cccc} x & ${xs.join(' & ')} \\ \hline y & ${ys.join(' & ')} \end{array}\]`, ans: CA.num(mm * N + b), sol: R`\(y\) changes by \(${mm * step}\) each time \(x\) goes up by ${step}, so \(m = ${mm}\). Going back from \(x = ${xs[0]}\) to \(x = 0\) gives \(b = ${b}\), so \(y = ${lineTex(mm, 1, b).slice(4)}\). At \(x = ${N}\): \(y = ${mm * N + b}\).` };
                    }
                    const [mn, md] = rng.bool(0.5) ? [nz(rng, -4, 4), 1] : rng.pick(SLOPES), b = nz(rng, -8, 8);
                    const xi = CA.reduce(-b * md, mn), area = CA.reduce(Math.abs(b) * Math.abs(xi[0]), 2 * xi[1]);
                    return { q: R`The line \(${lineTex(mn, md, b)}\) and the two axes form a triangle. Find its area.`, ans: CA.frac(...area), sol: R`It crosses the \(y\)-axis at \(${pt(0, b)}\) and the \(x\)-axis at \((${T.frac(...xi)}, 0)\). Area \(= \tfrac12 \times ${Math.abs(b)} \times ${T.frac(Math.abs(xi[0]), xi[1])} = ${T.frac(...area)}\).` };
                },
            },
        ],

        assignment: [
            ['read-point', 3], ['quadrant', 3], ['evaluate', 3], ['read-slope-intercept', 3], ['kind-of-slope', 3],
            ['slope-two-points', 4], ['slope-from-graph', 4], ['intercepts', 4], ['equation-from-graph', 4], ['line-through-points', 4], ['point-on-line', 3],
            ['parallel-perpendicular', 3], ['intersection', 3], ['linear-model', 3], ['table-and-area', 3],
        ],
    });
})();
