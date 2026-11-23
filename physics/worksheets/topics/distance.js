/* Worksheet: Distance — units, d = s × t, distance vs displacement, graphs, laps and chases. */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, C = F.colors;

    // ── Small helpers ────────────────────────────────────────────────────
    const fx = x => CA.tex.num(CA.round(x, 6));                 // 2.5, 1080 — no float noise
    const r6 = x => CA.round(x, 6);
    const NAMES = ['Maya', 'Leo', 'Aisha', 'Ben', 'Sofia', 'Kenji', 'Priya', 'Omar', 'Lena', 'Diego', 'Zoe', 'Sam', 'Noah', 'Ivy', 'Raj', 'Elena'];
    const range = (lo, hi, step = 1) => { const a = []; for (let v = lo; v <= hi + 1e-9; v += step) a.push(r6(v)); return a; };
    const plural = (n, w) => `${fx(n)} ${w}${n === 1 ? '' : 's'}`;
    /** Line with a filled arrowhead at (x2, y2). */
    function arrow(x1, y1, x2, y2, opt = {}) {
        const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = opt.head || 7;
        const bx = x2 - ux * h, by = y2 - uy * h, px = -uy * h * 0.45, py = ux * h * 0.45;
        const col = opt.stroke || C.INK;
        return F.line(x1, y1, bx, by, { stroke: col, width: opt.width || 1.8, dash: opt.dash })
            + F.poly([[x2, y2], [bx + px, by + py], [bx - px, by - py]], { fill: col, stroke: col, width: 1 });
    }
    /** Text with a white halo so it stays readable on top of lines. */
    const htext = (x, y, s, opt = {}) => F.text(x, y, s, opt).replace('stroke="none"', 'stroke="#ffffff" stroke-width="3" paint-order="stroke"');

    /**
     * Axes with a grid. xs/ys: {max, step, label}. Returns {svg(body), X(v), Y(v)}.
     */
    function axes(xa, ya, W = 270, H = 175) {
        const L = 44, B = 32, T = 22, Rt = 16, pw = W - L - Rt, ph = H - B - T;
        const X = v => L + v / xa.max * pw, Y = v => T + ph - v / ya.max * ph;
        let g = '';
        const nx = Math.round(xa.max / xa.step), ny = Math.round(ya.max / ya.step);
        const xEvery = nx > 8 ? 2 : 1, yEvery = ny > 7 ? 2 : 1;
        for (let i = 0; i <= nx; i++) {
            const v = r6(i * xa.step);
            g += F.line(X(v), T, X(v), T + ph, { stroke: '#d5dbe8', width: 0.8 });
            if (i % xEvery === 0) g += F.text(X(v), T + ph + 14, fx(v), { size: 11 });
        }
        for (let j = 0; j <= ny; j++) {
            const v = r6(j * ya.step);
            g += F.line(L, Y(v), L + pw, Y(v), { stroke: '#d5dbe8', width: 0.8 });
            if (j % yEvery === 0) g += F.text(L - 5, Y(v) + 4, fx(v), { size: 11, anchor: 'end' });
        }
        g += F.line(L, T + ph, L + pw + 6, T + ph) + F.line(L, T + ph, L, T - 6);
        g += F.text(L + pw + Rt - 2, T + ph + 28, xa.label, { size: 11, anchor: 'end' });
        g += F.text(L - 30, T - 9, ya.label, { size: 11, anchor: 'start' });
        return { X, Y, svg: (body, label) => F.svg(W, H, g + body, { label }) };
    }

    // ── 1. d = s × t ─────────────────────────────────────────────────────
    const DST = [
        { who: 'A cyclist rides', s: range(4, 9), sU: 'm/s', t: range(20, 120, 10), tU: 's', tW: 'seconds', dU: 'm' },
        { who: 'A cheetah sprints', s: range(25, 30), sU: 'm/s', t: range(4, 12), tU: 's', tW: 'seconds', dU: 'm' },
        { who: 'A car drives', s: range(15, 30), sU: 'm/s', t: range(10, 60, 5), tU: 's', tW: 'seconds', dU: 'm' },
        { who: 'A train travels', s: range(60, 150, 10), sU: 'km/h', t: [0.5, 1.5, 2, 2.5, 3, 4], tU: 'h', tW: 'hours', dU: 'km' },
        { who: 'A plane flies', s: range(600, 900, 50), sU: 'km/h', t: [2, 3, 4, 5, 1.5], tU: 'h', tW: 'hours', dU: 'km' },
        { who: 'A hiker walks', s: [3, 4, 5], sU: 'km/h', t: [2, 3, 4, 5, 6, 1.5, 2.5], tU: 'h', tW: 'hours', dU: 'km' },
        { who: 'A snail crawls', s: range(2, 8), sU: 'cm/min', t: range(5, 30, 5), tU: 'min', tW: 'minutes', dU: 'cm' },
        { who: 'A tortoise walks', s: range(3, 6), sU: 'm/min', t: range(10, 40, 5), tU: 'min', tW: 'minutes', dU: 'm' },
        { who: 'A swimmer swims', s: [1.2, 1.5, 2], sU: 'm/s', t: range(20, 200, 20), tU: 's', tW: 'seconds', dU: 'm' },
        { who: 'A rowing boat moves', s: [2, 3, 4, 5], sU: 'm/s', t: range(30, 180, 30), tU: 's', tW: 'seconds', dU: 'm' },
    ];

    // ── 4. Best unit ─────────────────────────────────────────────────────
    const UNIT_ITEMS = [
        ['the width of a fingernail', 'mm'], ['the length of an ant', 'mm'], ['the thickness of a coin', 'mm'], ['the length of a grain of rice', 'mm'], ['the thickness of a phone', 'mm'],
        ['the length of a pencil', 'cm'], ['the width of a book', 'cm'], ['the length of a shoe', 'cm'], ['the width of your hand', 'cm'], ['the length of a crayon', 'cm'],
        ['the height of a door', 'm'], ['the length of a swimming pool', 'm'], ['the height of a classroom', 'm'], ['the length of a soccer field', 'm'], ['the height of a giraffe', 'm'],
        ['the distance between two cities', 'km'], ['the length of a marathon race', 'km'], ['a flight from London to Paris', 'km'], ['a bike ride across town', 'km'], ['the distance from Earth to the Moon', 'km'],
    ];
    const UNIT_NAME = { mm: 'millimeters (mm)', cm: 'centimeters (cm)', m: 'meters (m)', km: 'kilometers (km)' };

    // ── Number line figure (6) ───────────────────────────────────────────
    function lineFig(stops, step, max) {
        const W = 300, x0 = 22, x1 = 282, n = stops.length - 1, base = 40 + 17 * n;
        const X = v => x0 + v / max * (x1 - x0);
        let b = F.line(x0 - 8, base, x1 + 8, base);
        for (let v = 0; v <= max + 1e-9; v += step) {
            b += F.line(X(v), base - 4, X(v), base + 4, { width: 1 });
            if (Math.round(v / step) % (max / step > 10 ? 2 : 1) === 0) b += F.text(X(v), base + 18, fx(v), { size: 11 });
        }
        for (let i = 0; i < n; i++) {
            const y = base - 14 - 17 * i, a = X(stops[i]), c = X(stops[i + 1]);
            b += F.line(a, y, a, i === 0 ? base : y + 17, { dash: '2 3', width: 0.8, stroke: '#a0aec0' });
            b += arrow(a, y, c, y, { stroke: C.ACCENT });
        }
        b += F.dot(X(stops[0]), base, { r: 4 }) + F.text(X(stops[0]), base + 34, 'start', { size: 11, bold: true });
        b += F.text(W - 4, 14, 'position (m), east →', { size: 11, anchor: 'end' });
        return F.svg(W, base + 40, b, { label: 'number line' });
    }

    // ── City grid figure (12) ────────────────────────────────────────────
    function gridFig(pts, nx, ny, cell = 32) {
        const px = 30, py = 22, W = nx * cell + 2 * px + 10, H = ny * cell + 2 * py;
        const P = ([x, y]) => [px + x * cell, py + (ny - y) * cell];
        let b = '';
        for (let i = 0; i <= nx; i++) b += F.line(px + i * cell, py, px + i * cell, py + ny * cell, { stroke: '#cbd5e0', width: 3 });
        for (let j = 0; j <= ny; j++) b += F.line(px, py + j * cell, px + nx * cell, py + j * cell, { stroke: '#cbd5e0', width: 3 });
        for (let i = 0; i < pts.length - 1; i++) { const [a, c] = [P(pts[i]), P(pts[i + 1])]; b += arrow(a[0], a[1], c[0], c[1], { stroke: C.ACCENT, width: 2.2 }); }
        const s = P(pts[0]), e = P(pts[pts.length - 1]);
        b += F.dot(s[0], s[1], { r: 4.5 }) + htext(s[0] - 7, s[1] - 7, 'S', { bold: true, anchor: 'end' });
        b += F.circle(e[0], e[1], 5, { fill: '#fff', stroke: C.ACCENT, width: 2 }) + htext(e[0] + 7, e[1] - 7, 'F', { bold: true, anchor: 'start' });
        const cx = W - 10;
        b += arrow(cx, py + 26, cx, py + 4, { width: 1.4, head: 6 }) + F.text(cx, py + 40, 'N', { size: 11, bold: true });
        return F.svg(W, H, b, { label: 'map' });
    }

    // ── Route figure with legs and a dashed straight line (13) ───────────
    function routeFig(pts, legLabels, dashLabel) {
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        const xa = Math.min(...xs), xb = Math.max(...xs), ya = Math.min(...ys), yb = Math.max(...ys);
        const s = Math.min(190 / Math.max(xb - xa, 1e-9), 110 / Math.max(yb - ya, 1e-9));
        const pad = 46, W = (xb - xa) * s + 2 * pad, H = (yb - ya) * s + 2 * 26;
        const P = p => [pad + (p[0] - xa) * s, 26 + (yb - p[1]) * s];
        const Q = pts.map(P);
        let b = '';
        const A = Q[0], Z = Q[Q.length - 1];
        b += F.line(A[0], A[1], Z[0], Z[1], { dash: true, width: 1.4, stroke: C.DARK });
        for (let i = 0; i < Q.length - 1; i++) {
            b += arrow(Q[i][0], Q[i][1], Q[i + 1][0], Q[i + 1][1], { stroke: C.ACCENT, width: 2 });
            if (i > 0) {
                const u = [Q[i - 1][0] - Q[i][0], Q[i - 1][1] - Q[i][1]], v = [Q[i + 1][0] - Q[i][0], Q[i + 1][1] - Q[i][1]];
                b += F.rightAngle(Q[i][0], Q[i][1], u[0], u[1], v[0], v[1], 8);
            }
        }
        const cen = [(A[0] + Z[0]) / 2, (A[1] + Z[1]) / 2];
        const mid = Q.reduce((a, q) => [a[0] + q[0] / Q.length, a[1] + q[1] / Q.length], [0, 0]);
        for (let i = 0; i < Q.length - 1; i++) {
            const mx = (Q[i][0] + Q[i + 1][0]) / 2, my = (Q[i][1] + Q[i + 1][1]) / 2;
            const horiz = Math.abs(Q[i][1] - Q[i + 1][1]) < 1;
            if (horiz) { const dn = my >= mid[1] ? 1 : -1; b += htext(mx, my + (dn > 0 ? 16 : -7), legLabels[i], { size: 12 }); }
            else { const rt = mx >= mid[0]; b += htext(mx + (rt ? 7 : -7), my + 4, legLabels[i], { size: 12, anchor: rt ? 'start' : 'end' }); }
        }
        // label of the dashed line: off its middle, away from the route
        let nx = -(Z[1] - A[1]), ny = Z[0] - A[0]; const ln = Math.hypot(nx, ny) || 1; nx /= ln; ny /= ln;
        if ((mid[0] - cen[0]) * nx + (mid[1] - cen[1]) * ny > 0) { nx = -nx; ny = -ny; }
        b += htext(cen[0] + nx * 12, cen[1] + ny * 12 + 4, dashLabel, { size: 12, bold: true, fill: C.DARK, anchor: nx > 0.4 ? 'start' : nx < -0.4 ? 'end' : 'middle' });
        {
            const ux = Q[1][0] - A[0], uy = Q[1][1] - A[1], ul = Math.hypot(ux, uy), vx = ux / ul, vy = uy / ul;
            b += F.dot(A[0], A[1], { r: 4 }) + htext(A[0] - vx * 9, A[1] - vy * 12 + 4, 'start', { size: 11, anchor: vx > 0.5 ? 'end' : vx < -0.5 ? 'start' : 'middle' });
        }
        return F.svg(W, H, b, { label: 'route' });
    }

    const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [20, 21, 29], [12, 5, 13], [4, 3, 5], [8, 6, 10], [15, 8, 17], [24, 7, 25]];

    CA.register({
        id: 'distance',
        title: 'Distance',
        page: 'distance.html',
        subject: 'Physics',
        assignmentNote: 'Use d = s × t (distance = speed × time) and keep the units matching (change minutes to hours or seconds first when needed). Give every answer with its unit, in the unit the question asks for. Answers that are not whole numbers: give exact decimals, or round to 1 decimal place when the question says so.',

        practice: [
            // ═══════════════ Level 1 ═══════════════
            {
                id: 'd-from-st', name: 'Distance = speed × time', level: 1,
                gen(rng) {
                    const c = rng.pick(DST), s = rng.pick(c.s), t = rng.pick(c.t), d = r6(s * t);
                    const q = rng.bool()
                        ? `${c.who} at ${fx(s)} ${c.sU} for ${fx(t)} ${c.tW}. How far does it go, in ${c.dU}?`
                        : `${c.who} for ${fx(t)} ${c.tW} at a steady speed of ${fx(s)} ${c.sU}. What distance does it cover, in ${c.dU}?`;
                    return {
                        q, ans: CA.num(d, c.dU),
                        sol: R`\(d = s \times t = ${fx(s)}\ \text{${c.sU}} \times ${fx(t)}\ \text{${c.tU}} = ${fx(d)}\ \text{${c.dU}}\).`,
                    };
                },
            },
            {
                id: 'missing-st', name: 'Find the time or the speed', level: 1,
                gen(rng) {
                    const c = rng.pick(DST), s = rng.pick(c.s), t = rng.pick(c.t), d = r6(s * t);
                    if (rng.bool(0.65)) {
                        return {
                            q: `${c.who} ${fx(d)} ${c.dU} at a steady ${fx(s)} ${c.sU}. How long does it take, in ${c.tW}?`,
                            ans: CA.num(t, c.tU === 'h' ? 'hours' : c.tU),
                            sol: R`\(t = d \div s = ${fx(d)} \div ${fx(s)} = ${fx(t)}\) ${c.tW}.`,
                        };
                    }
                    return {
                        q: `${c.who} ${fx(d)} ${c.dU} in ${fx(t)} ${c.tW} at a steady speed. What is its speed, in ${c.sU}?`,
                        ans: CA.num(s, c.sU),
                        sol: R`\(s = d \div t = ${fx(d)} \div ${fx(t)} = ${fx(s)}\ \text{${c.sU}}\).`,
                    };
                },
            },
            {
                id: 'unit-convert', name: 'Changing units of distance', level: 1,
                gen(rng) {
                    const K = [
                        { from: 'km', to: 'm', f: 1000, v: () => rng.int(5, 95) / 10, q: v => `The walk to the library is ${fx(v)} km. How many meters is that?` },
                        { from: 'm', to: 'km', f: 1 / 1000, v: () => rng.int(8, 200) * 100, q: v => `A bike ride is ${fx(v)} m long. How many kilometers is that?` },
                        { from: 'cm', to: 'm', f: 1 / 100, v: () => rng.int(12, 50) * 5, q: v => `A desk is ${fx(v)} cm long. How long is it in meters?` },
                        { from: 'm', to: 'cm', f: 100, v: () => rng.int(60, 170) / 20, q: v => `A long jump measures ${fx(v)} m. How many centimeters is that?` },
                        { from: 'mm', to: 'cm', f: 1 / 10, v: () => rng.int(5, 80), q: v => `A beetle is ${fx(v)} mm long. How long is it in centimeters?` },
                        { from: 'cm', to: 'mm', f: 10, v: () => rng.int(12, 45) / 10, q: v => `A coin is ${fx(v)} cm across. How many millimeters is that?` },
                        { from: 'm', to: 'mm', f: 1000, v: () => rng.int(30, 250) / 100, q: v => `A shelf is ${fx(v)} m long. How long is it in millimeters?` },
                        { from: 'km', to: 'cm', f: 100000, v: () => rng.int(1, 9) / 10, q: v => `A running path is ${fx(v)} km long. How many centimeters is that?` },
                        { from: 'mm', to: 'm', f: 1 / 1000, v: () => rng.int(15, 300) * 10, q: v => `A plank is ${fx(v)} mm long. How long is it in meters?` },
                    ];
                    const k = rng.pick(K), v = k.v(), a = r6(v * k.f);
                    const big = k.f > 1;
                    const how = big ? `multiply by ${fx(k.f)}` : `divide by ${fx(1 / k.f)}`;
                    const fact = { 'km-m': '1 km = 1000 m', 'm-km': '1 km = 1000 m', 'cm-m': '1 m = 100 cm', 'm-cm': '1 m = 100 cm', 'mm-cm': '1 cm = 10 mm', 'cm-mm': '1 cm = 10 mm', 'm-mm': '1 m = 1000 mm', 'km-cm': '1 km = 1000 m = 100 000 cm', 'mm-m': '1 m = 1000 mm' }[`${k.from}-${k.to}`];
                    return {
                        q: k.q(v), ans: CA.num(a, k.to),
                        sol: R`${fact}, so ${how}: \(${fx(v)}\ \text{${k.from}} = ${fx(a)}\ \text{${k.to}}\).`,
                    };
                },
            },
            {
                id: 'best-unit', name: 'Choosing a unit', level: 1,
                gen(rng) {
                    const [thing, u] = rng.pick(UNIT_ITEMS);
                    const order = ['mm', 'cm', 'm', 'km'];
                    return {
                        q: `Which unit is the best one for measuring ${thing}?`,
                        ans: CA.mc(rng, UNIT_NAME[u], order.map(x => UNIT_NAME[x]), { keepOrder: true }),
                        sol: `Pick the unit that gives a sensible number: ${thing} is best measured in ${UNIT_NAME[u]}. (mm for tiny things, cm for small things, m for everyday sizes, km for long trips.)`,
                    };
                },
            },
            {
                id: 'disp-concept', name: 'Distance or displacement?', level: 1,
                gen(rng) {
                    const k = rng.int(0, 4), who = rng.pick(NAMES);
                    if (k === 0) {
                        const a = rng.int(4, 40) * 5, thing = rng.pick(['a tree', 'the mailbox', 'the gate', 'a bench', 'the corner shop', 'the bus stop']);
                        return {
                            q: `${who} walks ${a} m in a straight line to ${thing} and then walks straight back to the start. What is the total distance walked?`,
                            ans: CA.num(2 * a, 'm'),
                            sol: `Distance counts the whole path: ${a} m there + ${a} m back = ${2 * a} m. (The displacement is 0 m, because ${who} ends at the start.)`,
                        };
                    }
                    if (k === 1) {
                        const a = rng.int(4, 40) * 5, thing = rng.pick(['a tree', 'the mailbox', 'the gate', 'a bench', 'the corner shop', 'the bus stop']);
                        return {
                            q: `${who} walks ${a} m in a straight line to ${thing} and then walks straight back to the start. What is ${who}'s displacement at the end?`,
                            ans: CA.mc(rng, '0 m', [`${2 * a} m`, `${a} m`, `${a / 2} m`]),
                            sol: `Displacement is how far you end up from the start. ${who} is back at the start, so it is 0 m (even though the distance walked is ${2 * a} m).`,
                        };
                    }
                    if (k === 2) {
                        const L = rng.pick([200, 250, 400, 400, 500]), n = rng.int(1, 6);
                        const what = rng.bool() ? 'distance' : 'displacement';
                        const q = `${who} runs exactly ${plural(n, 'full lap')} of a ${L} m track, starting and finishing at the same line. What is ${who}'s ${what}?`;
                        return what === 'distance'
                            ? { q, ans: CA.num(n * L, 'm'), sol: `Distance is the whole path: ${n} × ${L} m = ${n * L} m.` }
                            : { q, ans: CA.mc(rng, '0 m', [`${n * L} m`, `${L} m`, `${n} m`]), sol: `${who} finishes where ${who} started, so the displacement is 0 m. (The distance is ${n * L} m.)` };
                    }
                    if (k === 3) {
                        const d = rng.int(2, 9) * 100, dir = rng.pick(['north', 'south', 'east', 'west']);
                        return {
                            q: 'Which of these is a displacement?',
                            ans: CA.mc(rng, `${d} m ${dir} of the start`, [`${d} m walked in total`, `${d} s of walking`, `${d / 100} m/s`]),
                            sol: 'A displacement says how far you are from the start AND in which direction. Only one choice gives a direction.',
                        };
                    }
                    const pet = rng.pick(['A dog runs all around the yard', 'A bee flies from flower to flower', 'A toy car zooms around the room', 'A cat chases a ball around the garden', 'A robot vacuum cleans the whole floor']);
                    const end = rng.pick(['and ends up back where it started', 'and finishes exactly at its starting point']);
                    return {
                        q: `${pet} ${end}. Which quantity must be zero?`,
                        ans: CA.mc(rng, 'its displacement', ['the distance it moved', 'the time it took', 'its speed while moving']),
                        sol: 'It finishes at the start, so how far it is from the start — the displacement — is 0. The distance it moved is not 0: it counts the whole path.',
                    };
                },
            },

            // ═══════════════ Level 2 ═══════════════
            {
                id: 'number-line', name: 'Distance and displacement on a line', level: 2,
                gen(rng) {
                    for (;;) {
                        const [step, max] = rng.pick([[10, 100], [5, 50], [2, 20], [20, 200]]);
                        const n = rng.int(2, 3), stops = [rng.int(0, max / step) * step];
                        for (let i = 0; i < n; i++) stops.push(rng.int(0, max / step) * step);
                        let ok = true, total = 0;
                        for (let i = 0; i < n; i++) { const d = stops[i + 1] - stops[i]; if (d === 0) ok = false; total += Math.abs(d); if (i > 0 && Math.sign(d) === Math.sign(stops[i] - stops[i - 1])) ok = false; }
                        const D = stops[n] - stops[0];
                        if (!ok || D === 0) continue;
                        const who = rng.pick(['A dog on a straight path', 'A delivery robot in a long hallway', 'A cyclist on a straight road', 'A runner on a straight track', 'A toy train on a straight rail']);
                        const fig = lineFig(stops, step, max);
                        const legs = stops.slice(1).map((p, i) => Math.abs(p - stops[i]));
                        if (rng.bool(0.5)) {
                            return {
                                q: `${who} starts at the dot and makes the moves shown by the arrows. What total distance does it travel?`, fig,
                                ans: CA.num(total, 'm'),
                                sol: `Add the lengths of all the moves: ${legs.join(' + ')} = ${total} m. Distance does not care about direction.`,
                            };
                        }
                        const dir = D > 0 ? 'east' : 'west', opp = D > 0 ? 'west' : 'east';
                        const wrong = [`${Math.abs(D)} m ${opp}`, `${total} m ${dir}`];
                        if (stops[n] !== Math.abs(D)) wrong.push(`${stops[n]} m ${dir}`);
                        wrong.push(`${total} m ${opp}`);
                        return {
                            q: `${who} starts at the dot and makes the moves shown by the arrows. What is its displacement at the end? (East is to the right.)`, fig,
                            ans: CA.mc(rng, `${Math.abs(D)} m ${dir}`, wrong),
                            sol: `It starts at ${stops[0]} m and ends at ${stops[n]} m, so it finishes ${Math.abs(D)} m to the ${dir} of the start. (The distance traveled is ${total} m.)`,
                        };
                    }
                },
            },
            {
                id: 'multi-leg', name: 'Trips in stages', level: 2,
                gen(rng) {
                    const who = rng.pick(NAMES), k = rng.int(0, 2);
                    if (k === 0) {                                                       // m/s and seconds
                        const a = rng.pick([2, 3, 4, 5]), ta = rng.int(3, 12) * 10, b = rng.pick([1, 1.5, 2]), tb = rng.int(2, 10) * 10;
                        const d1 = r6(a * ta), d2 = r6(b * tb);
                        return {
                            q: `${who} jogs at ${a} m/s for ${ta} s, then walks at ${fx(b)} m/s for ${tb} s. What total distance does ${who} cover, in meters?`,
                            ans: CA.num(d1 + d2, 'm'),
                            sol: R`Jog: \(${a}\times${ta} = ${d1}\) m. Walk: \(${fx(b)}\times${tb} = ${fx(d2)}\) m. Total \(= ${fx(d1 + d2)}\) m.`,
                        };
                    }
                    if (k === 1) {                                                       // km/h and minutes
                        const v = rng.pick(['A bus drives', 'A car drives', 'A train runs']);
                        let s1, m1, s2, m2;
                        do { s1 = rng.int(3, 12) * 10; m1 = rng.pick([15, 20, 30, 45, 90]); s2 = rng.int(3, 12) * 10; m2 = rng.pick([12, 15, 20, 30, 40, 45]); } while ((s1 * m1) % 60 || (s2 * m2) % 60 || s1 === s2);
                        const d1 = s1 * m1 / 60, d2 = s2 * m2 / 60;
                        return {
                            q: `${v} at ${s1} km/h for ${m1} minutes, then at ${s2} km/h for ${m2} minutes. How many kilometers does it travel altogether?`,
                            ans: CA.num(d1 + d2, 'km'),
                            sol: R`Change minutes to hours: \(${s1}\times\frac{${m1}}{60} = ${d1}\) km and \(${s2}\times\frac{${m2}}{60} = ${d2}\) km. Total \(= ${d1 + d2}\) km.`,
                        };
                    }
                    const walkMin = rng.int(2, 8), ws = rng.pick([1, 1.5, 2]), busS = rng.pick([8, 10, 12, 15]), busMin = rng.int(5, 15), extra = rng.int(1, 6) * 100;
                    const dw = r6(ws * walkMin * 60), db = busS * busMin * 60, tot = r6(dw + db + extra);
                    return {
                        q: `On the way to school ${who} walks for ${walkMin} minutes at ${fx(ws)} m/s, rides a bus for ${busMin} minutes at ${busS} m/s, and then walks the last ${extra} m. How far is the whole trip, in meters?`,
                        ans: CA.num(tot, 'm'),
                        sol: R`Use seconds: walk \(${fx(ws)}\times${walkMin * 60} = ${fx(dw)}\) m, bus \(${busS}\times${busMin * 60} = ${db}\) m. Total \(= ${fx(dw)} + ${db} + ${extra} = ${fx(tot)}\) m.`,
                    };
                },
            },
            {
                id: 'speed-time-area', name: 'Distance from a speed–time graph', level: 2,
                gen(rng) {
                    for (;;) {
                        const ts = rng.pick([5, 10]), nT = rng.int(5, 8), Tm = ts * nT;
                        const ys = rng.pick([1, 2]), yMax = ys * 6;
                        const n = rng.int(2, 3), cuts = rng.sample(range(1, nT - 1), n - 1).sort((a, b) => a - b);
                        const bounds = [0, ...cuts, nT].map(c => c * ts);
                        const speeds = [];
                        for (let i = 0; i < n; i++) speeds.push(rng.int(i > 0 && rng.bool(0.2) ? 0 : 1, 6) * ys);
                        if (speeds.some((s, i) => i > 0 && s === speeds[i - 1])) continue;
                        if (speeds[0] === 0) continue;
                        const who = rng.pick(['a cyclist', 'a runner', 'a toy train', 'a delivery drone', 'a scooter rider', 'a rowing boat']);
                        const ax = axes({ max: Tm, step: ts, label: 'time (s)' }, { max: yMax, step: ys, label: 'speed (m/s)' });
                        let body = '', line = [];
                        for (let i = 0; i < n; i++) {
                            const x0 = ax.X(bounds[i]), x1 = ax.X(bounds[i + 1]), y = ax.Y(speeds[i]);
                            if (speeds[i] > 0) body += F.rect(x0, y, x1 - x0, ax.Y(0) - y, { fill: C.FILL, stroke: 'none', opacity: 0.8 });
                            line.push([x0, y], [x1, y]);
                        }
                        body += F.poly(line, { open: true, stroke: C.ACCENT, width: 2.5 });
                        const fig = ax.svg(body, 'speed-time graph');
                        const parts = speeds.map((s, i) => [s, bounds[i + 1] - bounds[i]]);
                        const total = parts.reduce((a, [s, t]) => a + s * t, 0);
                        const k = rng.int(0, 2);
                        if (k === 0) {
                            return {
                                q: `The speed–time graph shows a trip by ${who}. How far does it travel in the ${Tm} seconds?`, fig,
                                ans: CA.num(total, 'm'),
                                sol: `Distance = area under the graph = ${parts.map(([s, t]) => `${s} × ${t}`).join(' + ')} = ${total} m.`,
                            };
                        }
                        if (k === 1) {
                            const i = rng.int(0, n - 1);
                            if (speeds[i] === 0) continue;
                            return {
                                q: `The speed–time graph shows a trip by ${who}. How far does it travel between ${bounds[i]} s and ${bounds[i + 1]} s?`, fig,
                                ans: CA.num(speeds[i] * (bounds[i + 1] - bounds[i]), 'm'),
                                sol: `In that part the speed is a steady ${speeds[i]} m/s for ${bounds[i + 1] - bounds[i]} s, so d = ${speeds[i]} × ${bounds[i + 1] - bounds[i]} = ${speeds[i] * (bounds[i + 1] - bounds[i])} m (the area of that rectangle).`,
                            };
                        }
                        const tN = rng.int(1, nT - 1) * ts;
                        if (cuts.includes(tN / ts)) continue;                               // make it cut a stage in two
                        let dN = 0; const bits = [];
                        for (let i = 0; i < n; i++) { const t = Math.max(0, Math.min(tN, bounds[i + 1]) - bounds[i]); if (t > 0) { dN += speeds[i] * t; bits.push(`${speeds[i]} × ${t}`); } }
                        return {
                            q: `The speed–time graph shows a trip by ${who}. How far has it gone after the first ${tN} seconds?`, fig,
                            ans: CA.num(dN, 'm'),
                            sol: `Area under the graph from 0 to ${tN} s: ${bits.join(' + ')} = ${dN} m.`,
                        };
                    }
                },
            },
            {
                id: 'dt-graph', name: 'Reading a distance–time graph', level: 2,
                gen(rng) {
                    const SET = [
                        { who: 'a cyclist', tU: 'min', tW: 'minutes', ts: 10, nT: 6, dU: 'km', ds: 2, nD: 6, sp: 'km/h', spF: 60 },
                        { who: 'a family on a walk', tU: 'min', tW: 'minutes', ts: 20, nT: 6, dU: 'km', ds: 1, nD: 5, sp: 'km/h', spF: 60 },
                        { who: 'a jogger', tU: 'min', tW: 'minutes', ts: 10, nT: 6, dU: 'm', ds: 500, nD: 6, sp: 'm/min', spF: 1 },
                        { who: 'a remote-control car', tU: 's', tW: 'seconds', ts: 2, nT: 6, dU: 'm', ds: 4, nD: 6, sp: 'm/s', spF: 1 },
                        { who: 'a delivery van', tU: 'h', tW: 'hours', ts: 1, nT: 6, dU: 'km', ds: 40, nD: 6, sp: 'km/h', spF: 1 },
                    ];
                    for (;;) {
                        const c = rng.pick(SET);
                        const cuts = rng.sample(range(1, c.nT - 1), 2).sort((a, b) => a - b);
                        const tb = [0, ...cuts, c.nT];
                        const inc = [rng.int(1, 3), rng.int(0, 2), rng.int(1, 3)];
                        if (rng.bool(0.5)) [inc[1], inc[2]] = [inc[2], inc[1]];
                        const db = [0]; inc.forEach(v => db.push(db[db.length - 1] + v));
                        if (db[3] > c.nD) continue;
                        const nD = Math.min(c.nD, Math.max(db[3] + 1, 3));
                        const ax = axes({ max: c.nT * c.ts, step: c.ts, label: `time (${c.tU})` }, { max: nD * c.ds, step: c.ds, label: `distance (${c.dU})` });
                        const pts = tb.map((t, i) => [ax.X(t * c.ts), ax.Y(db[i] * c.ds)]);
                        const fig = ax.svg(F.poly(pts, { open: true, stroke: C.ACCENT, width: 2.5 }) + pts.map(p => F.dot(p[0], p[1], { r: 3, fill: C.ACCENT })).join(''), 'distance-time graph');
                        const T = i => tb[i] * c.ts, D = i => db[i] * c.ds;
                        const k = rng.int(0, 3), intro = `The distance–time graph shows a trip by ${c.who}.`;
                        if (k === 0) return { q: `${intro} How far does it travel in the whole trip?`, fig, ans: CA.num(D(3), c.dU), sol: `Read the end of the graph: at ${T(3)} ${c.tU} the distance is ${D(3)} ${c.dU}.` };
                        if (k === 1) {
                            const [i, j] = rng.pick([[0, 2], [1, 3], [1, 2], [2, 3], [0, 1]]);
                            if (D(j) - D(i) === 0) continue;
                            return { q: `${intro} How far does it travel between ${T(i)} ${c.tU} and ${T(j)} ${c.tU}?`, fig, ans: CA.num(D(j) - D(i), c.dU), sol: `At ${T(i)} ${c.tU} it has gone ${D(i)} ${c.dU}; at ${T(j)} ${c.tU} it has gone ${D(j)} ${c.dU}. Subtract: ${D(j)} − ${D(i)} = ${D(j) - D(i)} ${c.dU}.` };
                        }
                        if (k === 2) {
                            const f = inc.indexOf(0);
                            if (f < 0) continue;
                            return { q: `${intro} For how many ${c.tW} does it stop?`, fig, ans: CA.num(T(f + 1) - T(f), c.tU === 'h' ? 'hours' : c.tU), sol: `The flat part of the graph means the distance is not changing: from ${T(f)} to ${T(f + 1)} ${c.tU}, which is ${T(f + 1) - T(f)} ${c.tW}.` };
                        }
                        const i = rng.int(0, 2), dd = D(i + 1) - D(i), dt = T(i + 1) - T(i), spd = r6(dd / dt * c.spF);
                        if (dd === 0 || !Number.isInteger(spd)) continue;
                        const tTex = c.spF === 60 ? R`\(${dt}\) min \(= ${fx(dt / 60)}\) h` : R`\(${dt}\) ${c.tU}`;
                        return { q: `${intro} What is its speed between ${T(i)} ${c.tU} and ${T(i + 1)} ${c.tU}, in ${c.sp}?`, fig, ans: CA.num(spd, c.sp), sol: R`It goes \(${dd}\) ${c.dU} in ${tTex}, so \(s = d \div t = ${spd}\) ${c.sp}.` };
                    }
                },
            },
            {
                id: 'laps', name: 'Laps of a track', level: 2,
                gen(rng) {
                    const who = rng.pick(NAMES), k = rng.int(0, 2);
                    const [L, s] = rng.pick([[400, rng.int(3, 8)], [200, rng.int(3, 7)], [250, rng.int(10, 15)], [300, rng.int(4, 8)], [500, rng.int(8, 12)]]);
                    const sport = L === 250 ? 'cycles' : L === 500 ? 'skates' : 'runs', track = L === 250 ? 'cycling track' : L === 500 ? 'skating oval' : 'track';
                    if (k === 0) {
                        const t = rng.int(4, 30) * 10;
                        return { q: `${who} ${sport} at ${s} m/s for ${t} s around a ${L} m ${track}. What total distance is that?`, ans: CA.num(s * t, 'm'), sol: R`\(d = s\times t = ${s}\times${t} = ${s * t}\) m.` };
                    }
                    if (k === 1) {
                        let t; do t = rng.int(6, 40) * 10; while ((s * t) % L === 0);
                        const d = s * t, n = Math.floor(d / L);
                        return { q: `${who} ${sport} at ${s} m/s for ${t} s around a ${L} m ${track}. How many full laps is that?`, ans: CA.num(n), sol: `Distance = ${s} × ${t} = ${d} m. Laps = ${d} ÷ ${L} ≈ ${fx(CA.round(d / L, 2))}, so ${n} full laps (and ${d - n * L} m more).` };
                    }
                    const ns = range(2, 12).filter(v => (v * L) % s === 0);
                    if (!ns.length) return this.gen(rng);
                    const n = rng.pick(ns);
                    return { q: `${who} ${sport} ${n} laps of a ${L} m ${track} at a steady ${s} m/s. How long does it take, in seconds?`, ans: CA.num(n * L / s, 's'), sol: R`Distance \(= ${n}\times${L} = ${n * L}\) m, so \(t = d \div s = ${n * L}\div${s} = ${n * L / s}\) s.` };
                },
            },
            {
                id: 'round-trip', name: 'The round trip', level: 2,
                gen(rng) {
                    const who = rng.pick(NAMES), k = rng.int(0, 2);
                    if (k < 2) {
                        let a, b, d;
                        do { a = rng.int(2, 6); b = rng.int(2, 6); d = rng.int(4, 40) * 30; } while (a === b || d % a || d % b);
                        const place = rng.pick(['the park', 'the shop', 'a friend\'s house', 'the pool', 'the library']);
                        const ta = d / a, tb = d / b;
                        const q0 = `${who} jogs from home to ${place}, ${d} m away, at ${a} m/s, and then jogs straight back home at ${b} m/s.`;
                        if (k === 0) return { q: `${q0} How long does the whole round trip take, in seconds?`, ans: CA.num(ta + tb, 's'), sol: `There: ${d} ÷ ${a} = ${ta} s. Back: ${d} ÷ ${b} = ${tb} s. Total ${ta + tb} s.` };
                        return {
                            q: `${q0} What are ${who}'s total distance and displacement at the end?`,
                            ans: CA.mc(rng, `distance ${2 * d} m, displacement 0 m`, [`distance ${d} m, displacement 0 m`, `distance ${2 * d} m, displacement ${2 * d} m`, `distance 0 m, displacement ${2 * d} m`, `distance ${2 * d} m, displacement ${d} m`]),
                            sol: `The path is ${d} m there plus ${d} m back = ${2 * d} m. ${who} ends at home, so the displacement is 0 m.`,
                        };
                    }
                    for (;;) {
                        const a = rng.pick([30, 40, 45, 50, 60, 80, 90, 100]), b = rng.pick([30, 40, 45, 50, 60, 80, 90, 100, 120]);
                        const d = rng.pick([60, 90, 120, 180, 240, 360]);
                        if (a === b || d % a || d % b) continue;
                        const tt = d / a + d / b, avg = r6(2 * d / tt);
                        if (!Number.isInteger(avg) || avg === (a + b) / 2) continue;
                        return {
                            q: `A family drives ${d} km to visit their grandparents at ${a} km/h and drives back the same way at ${b} km/h. What is their average speed for the whole round trip? (average speed = total distance ÷ total time)`,
                            ans: CA.mc(rng, `${avg} km/h`, [`${fx((a + b) / 2)} km/h`, '0 km/h', `${fx(d / tt)} km/h`]),
                            sol: `Times: ${d} ÷ ${a} = ${fx(d / a)} h and ${d} ÷ ${b} = ${fx(d / b)} h, total ${fx(tt)} h. Average speed = ${2 * d} km ÷ ${fx(tt)} h = ${avg} km/h — not the average of the two speeds, because more time is spent at the slower speed.`,
                        };
                    }
                },
            },
            {
                id: 'grid-route', name: 'Routes on a street map', level: 2,
                gen(rng) {
                    const nx = 6, ny = 4, DIRS = { E: [1, 0], W: [-1, 0], N: [0, 1], S: [0, -1] }, NAME = { E: 'east', W: 'west', N: 'north', S: 'south' };
                    for (;;) {
                        const block = rng.pick([50, 80, 100, 100, 120, 150, 200]), wantDisp = rng.bool(0.45);
                        const nLeg = rng.int(3, 4);
                        let p = [rng.int(0, nx), rng.int(0, ny)], pts = [p], dirs = [], ok = true, horiz = rng.bool();
                        for (let i = 0; i < nLeg; i++) {
                            const opts = horiz ? ['E', 'W'] : ['N', 'S'];
                            const d = rng.pick(opts), len = rng.int(1, horiz ? 4 : 3);
                            const q = [p[0] + DIRS[d][0] * len, p[1] + DIRS[d][1] * len];
                            if (q[0] < 0 || q[0] > nx || q[1] < 0 || q[1] > ny) { ok = false; break; }
                            pts.push(q); dirs.push([d, len]); p = q; horiz = !horiz;
                        }
                        if (!ok) continue;
                        const keys = new Set(pts.map(q => q.join(',')));
                        if (keys.size !== pts.length) continue;                         // never visits a corner twice
                        const blocks = dirs.reduce((a, [, l]) => a + l, 0), total = blocks * block;
                        const s = pts[0], e = p, dx = e[0] - s[0], dy = e[1] - s[1];
                        const who = rng.pick(NAMES), fig = gridFig(pts, nx, ny);
                        const intro = `${who} walks from S to F along the streets as shown. Each block is ${block} m long.`;
                        if (!wantDisp) {
                            return { q: `${intro} How far does ${who} walk?`, fig, ans: CA.num(total, 'm'), sol: `Count the blocks along the route: ${dirs.map(([, l]) => l).join(' + ')} = ${blocks} blocks, so ${blocks} × ${block} = ${total} m.` };
                        }
                        if ((dx !== 0 && dy !== 0) || (dx === 0 && dy === 0)) continue;
                        const D = Math.abs(dx + dy) * block, dir = dx > 0 ? 'east' : dx < 0 ? 'west' : dy > 0 ? 'north' : 'south';
                        const opp = { east: 'west', west: 'east', north: 'south', south: 'north' }[dir], side = { east: 'north', west: 'south', north: 'east', south: 'west' }[dir];
                        if (D === total) continue;
                        return {
                            q: `${intro} What is ${who}'s displacement from S at the end?`, fig,
                            ans: CA.mc(rng, `${D} m ${dir}`, [`${D} m ${opp}`, `${total} m ${dir}`, `${D} m ${side}`, `${total} m ${opp}`]),
                            sol: `F is on the same street as S, ${Math.abs(dx + dy)} block${Math.abs(dx + dy) === 1 ? '' : 's'} to the ${dir}: ${Math.abs(dx + dy)} × ${block} = ${D} m ${dir}. (The distance walked is ${total} m.)`,
                        };
                    }
                },
            },

            // ═══════════════ Level 3 ═══════════════
            {
                id: 'pythag-disp', name: 'Displacement with right angles', level: 3,
                gen(rng) {
                    const who = rng.pick(NAMES);
                    const [unit, sc, ctx] = rng.pick([['m', 10, 'walks'], ['m', 100, 'cycles'], ['km', 1, 'sails a boat'], ['km', 10, 'flies a small plane'], ['m', 1, 'walks across a field']]);
                    const ew = rng.pick(['east', 'west']), ns = rng.pick(['north', 'south']), sx = ew === 'east' ? 1 : -1, sy = ns === 'north' ? 1 : -1;
                    const k = rng.int(0, 3);
                    if (k === 3) {                                                     // not a triple: round to 1 dp
                        let a, b; do { a = rng.int(2, 9); b = rng.int(2, 9); } while (a === b || CA.isSquare(a * a + b * b));
                        const c = Math.sqrt(a * a + b * b), cr = CA.round(c, 1);
                        return {
                            q: `${who} ${ctx}: ${a} ${unit} ${ew}, then ${b} ${unit} ${ns}. How far is ${who} from the start, in a straight line? Round to 1 decimal place.`,
                            fig: routeFig([[0, 0], [sx * a, 0], [sx * a, sy * b]], [`${a} ${unit}`, `${b} ${unit}`], '?'),
                            ans: CA.num(cr, unit, { tol: 0.06 }),
                            sol: R`The legs meet at a right angle, so use Pythagoras: \(\sqrt{${a}^2 + ${b}^2} = \sqrt{${a * a + b * b}} \approx ${fx(cr)}\) ${unit}.`,
                        };
                    }
                    const [p, q0, h] = rng.pick(TRIPLES), a = p * sc, b = q0 * sc, c = h * sc;
                    if (k === 0) {
                        return {
                            q: `${who} ${ctx}: ${a} ${unit} ${ew}, then ${b} ${unit} ${ns}. What is the size of ${who}'s displacement (the straight-line distance from the start)?`,
                            fig: routeFig([[0, 0], [sx * a, 0], [sx * a, sy * b]], [`${a} ${unit}`, `${b} ${unit}`], '?'),
                            ans: CA.num(c, unit),
                            sol: R`Right angle, so Pythagoras: \(\sqrt{${a}^2 + ${b}^2} = \sqrt{${a * a + b * b}} = ${c}\) ${unit}. (The distance traveled is ${a + b} ${unit}.)`,
                        };
                    }
                    if (k === 1) {                                                     // three legs: split the first direction
                        if (p < 2) return this.gen(rng);
                        const a1 = rng.int(Math.ceil(p / 4), p - Math.ceil(p / 4)) * sc, a2 = a - a1;
                        return {
                            q: `${who} ${ctx}: ${a1} ${unit} ${ew}, then ${b} ${unit} ${ns}, then ${a2} ${unit} ${ew}. How far is ${who} from the start, in a straight line?`,
                            fig: routeFig([[0, 0], [sx * a1, 0], [sx * a1, sy * b], [sx * a, sy * b]], [`${a1} ${unit}`, `${b} ${unit}`, `${a2} ${unit}`], '?'),
                            ans: CA.num(c, unit),
                            sol: R`Altogether ${a1} + ${a2} = ${a} ${unit} ${ew} and ${b} ${unit} ${ns}. Pythagoras: \(\sqrt{${a}^2 + ${b}^2} = ${c}\) ${unit}.`,
                        };
                    }
                    return {
                        q: `${who} ${ctx}: ${a} ${unit} ${ew}, then ${b} ${unit} ${ns}. How much longer is the distance traveled than the straight-line distance back to the start?`,
                        fig: routeFig([[0, 0], [sx * a, 0], [sx * a, sy * b]], [`${a} ${unit}`, `${b} ${unit}`], '?'),
                        ans: CA.num(a + b - c, unit),
                        sol: R`Distance traveled \(= ${a} + ${b} = ${a + b}\) ${unit}. Straight line \(= \sqrt{${a}^2 + ${b}^2} = ${c}\) ${unit}. Difference \(= ${a + b - c}\) ${unit}.`,
                    };
                },
            },
            {
                id: 'chase-meet', name: 'Catching up and meeting', level: 3,
                gen(rng) {
                    const k = rng.int(0, 4), A = rng.pick(NAMES); let B; do B = rng.pick(NAMES); while (B === A);
                    if (k === 0) {                                                     // lapping
                        const a = rng.int(3, 6), b = a + rng.pick([1, 2]), L = rng.pick([200, 300, 400]), t = L / (b - a);
                        return { q: `${A} and ${B} start together on a ${L} m track and run the same way. ${A} runs at ${a} m/s and ${B} at ${b} m/s. How many seconds until ${B} laps ${A} (is exactly one lap ahead)?`, ans: CA.num(t, 's'), sol: `${B} gains ${b} − ${a} = ${b - a} m every second. One lap is ${L} m, so t = ${L} ÷ ${b - a} = ${t} s.` };
                    }
                    if (k === 1) {                                                     // head-on on a circular track
                        let a, b, L; do { a = rng.int(2, 6); b = rng.int(3, 8); L = rng.pick([200, 300, 400, 500]); } while (a === b || L % (a + b));
                        const t = L / (a + b), who = rng.bool() ? [A, a] : [B, b];
                        if (rng.bool()) return { q: `${A} and ${B} start at the same spot on a ${L} m circular track and run in opposite directions, ${A} at ${a} m/s and ${B} at ${b} m/s. After how many seconds do they first meet?`, ans: CA.num(t, 's'), sol: `Together they close the gap at ${a} + ${b} = ${a + b} m/s and must cover one lap: t = ${L} ÷ ${a + b} = ${t} s.` };
                        return { q: `${A} and ${B} start at the same spot on a ${L} m circular track and run in opposite directions, ${A} at ${a} m/s and ${B} at ${b} m/s. How far has ${who[0]} run when they first meet?`, ans: CA.num(who[1] * t, 'm'), sol: `They meet after ${L} ÷ (${a} + ${b}) = ${t} s. ${who[0]} runs ${who[1]} × ${t} = ${who[1] * t} m.` };
                    }
                    if (k === 2) {                                                     // head start
                        const a = rng.int(2, 5), b = a + rng.int(1, 3), t = rng.int(4, 30) * 5, d = (b - a) * t;
                        if (rng.bool()) return { q: `${A} has a ${d} m head start and jogs at ${a} m/s. ${B} chases at ${b} m/s. How many seconds does ${B} take to catch up?`, ans: CA.num(t, 's'), sol: `${B} closes the gap at ${b} − ${a} = ${b - a} m/s: t = ${d} ÷ ${b - a} = ${t} s.` };
                        return { q: `${A} has a ${d} m head start and jogs at ${a} m/s. ${B} chases at ${b} m/s. How far does ${B} run before catching ${A}?`, ans: CA.num(b * t, 'm'), sol: `Gap closes at ${b - a} m/s, so t = ${d} ÷ ${b - a} = ${t} s. ${B} runs ${b} × ${t} = ${b * t} m.` };
                    }
                    if (k === 3) {                                                     // two towns
                        let a, b, t; do { a = rng.int(4, 12) * 10; b = rng.int(4, 12) * 10; t = rng.pick([0.5, 1, 1.5, 2, 2.5, 3]); } while (a === b || !Number.isInteger(a * t) || !Number.isInteger(b * t));
                        const D = (a + b) * t, [t1, t2] = rng.sample(['Ashford', 'Brookville', 'Cedar Falls', 'Dunmore', 'Elmwood'], 2);
                        return { q: `${t1} and ${t2} are ${D} km apart on a straight road. A car leaves ${t1} at ${a} km/h and a truck leaves ${t2} at ${b} km/h at the same time, driving toward each other. How far from ${t1} do they meet, in km?`, ans: CA.num(a * t, 'km'), sol: `The gap closes at ${a} + ${b} = ${a + b} km/h, so they meet after ${D} ÷ ${a + b} = ${fx(t)} h. The car has gone ${a} × ${fx(t)} = ${a * t} km from ${t1}.` };
                    }
                    const L = rng.pick([200, 250, 400]), a = rng.int(3, 6), b = a + rng.int(1, 3), t = rng.int(3, 12) * 60, gained = (b - a) * t, n = Math.floor(gained / L);
                    if (n < 1) return this.gen(rng);
                    return { q: `On a ${L} m track ${A} runs at ${a} m/s and ${B} at ${b} m/s, starting together and running the same way for ${t} s. How many full times does ${B} lap ${A}?`, ans: CA.num(n), sol: `${B} gets ahead by (${b} − ${a}) × ${t} = ${gained} m. ${gained} ÷ ${L} ≈ ${fx(CA.round(gained / L, 2))} laps, so ${n} full time${n === 1 ? '' : 's'}.` };
                },
            },
            {
                id: 'story', name: 'Multi-step distance problems', level: 3,
                gen(rng) {
                    const who = rng.pick(NAMES), k = rng.int(0, 4);
                    if (k === 0) {                                                     // thunder
                        const t = rng.int(2, 15), d = 343 * t, km = CA.round(d / 1000, 1);
                        return { q: `${who} sees a flash of lightning and hears the thunder ${t} seconds later. Sound travels at about 343 m/s (the light arrives almost instantly). How far away is the storm, in kilometers? Round to 1 decimal place.`, ans: CA.num(km, 'km', { tol: 0.06 }), sol: R`\(d = 343 \times ${t} = ${d}\) m \(= ${fx(d / 1000)}\) km \(\approx ${fx(km)}\) km.` };
                    }
                    if (k === 1) {                                                     // weekly walk to school
                        const s = rng.pick([1, 1.2, 1.5, 2]), m = rng.int(6, 20), days = 5, one = r6(s * m * 60), wk = r6(one * 2 * days);
                        return { q: `${who} walks to school at ${fx(s)} m/s and the walk takes ${m} minutes. ${who} walks there and back every school day. How many kilometers does ${who} walk in a 5-day week?`, ans: CA.num(r6(wk / 1000), 'km'), sol: R`One way: \(${fx(s)} \times ${m * 60}\ \text{s} = ${fx(one)}\) m. A week: \(${fx(one)} \times 2 \times 5 = ${fx(wk)}\) m \(= ${fx(wk / 1000)}\) km.` };
                    }
                    if (k === 2) {                                                     // steps
                        const step = rng.pick([50, 60, 65, 70, 75, 80]), n = rng.int(4, 40) * 100, m = step * n / 100;
                        return { q: `Each of ${who}'s steps is ${step} cm long. ${who}'s step counter shows ${n} steps. How far has ${who} walked, in kilometers?`, ans: CA.num(r6(m / 1000), 'km'), sol: `${n} × ${step} cm = ${step * n} cm = ${fx(m)} m = ${fx(m / 1000)} km (100 cm = 1 m, 1000 m = 1 km).` };
                    }
                    if (k === 3) {                                                     // plane, h and min
                        let s, h, mm; do { s = rng.int(12, 18) * 50; h = rng.int(1, 4); mm = rng.pick([12, 15, 20, 24, 30, 36, 40, 45]); } while ((s * mm) % 60);
                        const d = s * h + s * mm / 60;
                        return { q: `A plane flies at a steady ${s} km/h for ${h} h ${mm} min. How far does it fly, in kilometers?`, ans: CA.num(d, 'km'), sol: R`\(${mm}\) min \(= ${fx(mm / 60)}\) h, so \(t = ${fx(h + mm / 60)}\) h and \(d = ${s} \times ${fx(h + mm / 60)} = ${d}\) km.` };
                    }
                    // trip with a stop: total distance and then distance left
                    let s1, t1, s2, t2, D; do { s1 = rng.int(6, 12) * 10; t1 = rng.pick([1, 1.5, 2, 2.5]); s2 = rng.int(6, 12) * 10; t2 = rng.pick([0.5, 1, 1.5, 2]); D = rng.int(30, 80) * 10; } while (s1 * t1 + s2 * t2 >= D || !Number.isInteger(s1 * t1 + s2 * t2));
                    const done = s1 * t1 + s2 * t2;
                    return { q: `A family is driving to a beach ${D} km away. They drive ${fx(t1)} h at ${s1} km/h, stop for lunch, then drive ${fx(t2)} h at ${s2} km/h. How many kilometers do they still have to go?`, ans: CA.num(D - done, 'km'), sol: R`Driven: \(${s1}\times${fx(t1)} + ${s2}\times${fx(t2)} = ${fx(s1 * t1)} + ${fx(s2 * t2)} = ${done}\) km. Left: \(${D} - ${done} = ${D - done}\) km.` };
                },
            },
            {
                id: 'compare-routes', name: 'Comparing routes', level: 3,
                gen(rng) {
                    const who = rng.pick(NAMES), k = rng.int(0, 2);
                    if (k === 0) {                                                     // two routes, minutes saved
                        for (;;) {
                            const d1 = rng.int(4, 12), s1 = rng.pick([12, 15, 20, 24]), d2 = d1 + rng.int(2, 10), s2 = rng.pick([30, 40, 45, 60]);
                            const m1 = d1 * 60 / s1, m2 = d2 * 60 / s2;
                            if (!Number.isInteger(m1) || !Number.isInteger(m2) || m1 === m2) continue;
                            const fast = m1 < m2 ? 'the bike path' : 'the main road';
                            return {
                                q: `${who} can get to the lake by two routes: the bike path, ${d1} km long, cycling at ${s1} km/h, or the main road, ${d2} km long, in a car at ${s2} km/h. How many minutes faster is ${fast}?`,
                                ans: CA.num(Math.abs(m1 - m2), 'min'),
                                sol: R`Bike path: \(${d1} \div ${s1}\) h \(= ${m1}\) min. Main road: \(${d2} \div ${s2}\) h \(= ${m2}\) min. Difference \(= ${Math.abs(m1 - m2)}\) min.`,
                            };
                        }
                    }
                    const [p, q0, h] = rng.pick(TRIPLES), sc = rng.pick([10, 20, 5]), a = p * sc, b = q0 * sc, c = h * sc;
                    const scl = Math.min(190 / a, 110 / b), Wd = a * scl, H = b * scl, x0 = 50, y0 = 22;
                    const fig = F.svg(Wd + 2 * x0, H + 2 * y0,
                        F.rect(x0, y0, Wd, H, { fill: '#e6f4ea', stroke: C.INK })
                        + F.line(x0, y0 + H, x0 + Wd, y0, { dash: true, stroke: C.ACCENT, width: 2 })
                        + F.text(x0 + Wd / 2, y0 + H + 16, `${a} m`) + F.text(x0 + Wd + 6, y0 + H / 2 + 4, `${b} m`, { anchor: 'start' })
                        + F.dot(x0, y0 + H, { r: 4 }) + F.text(x0 - 6, y0 + H + 4, 'A', { anchor: 'end', bold: true })
                        + F.dot(x0 + Wd, y0, { r: 4 }) + F.text(x0 + Wd + 6, y0 - 4, 'B', { anchor: 'start', bold: true })
                        + F.rightAngle(x0 + Wd, y0 + H, -1, 0, 0, -1, 8), { label: 'park' });
                    const intro = `A rectangular park is ${a} m by ${b} m. ${who} goes from corner A to corner B either along two edges of the park or straight across on the diagonal path.`;
                    if (k === 1) return { q: `${intro} How many meters shorter is the diagonal path?`, fig, ans: CA.num(a + b - c, 'm'), sol: R`Edges: \(${a} + ${b} = ${a + b}\) m. Diagonal: \(\sqrt{${a}^2 + ${b}^2} = ${c}\) m. Shorter by \(${a + b - c}\) m.` };
                    for (let tries = 0; tries < 50; tries++) {
                        const s = rng.pick([1, 1.5, 2, 2.5, 4, 5]), t1 = r6((a + b) / s), t2 = r6(c / s);
                        if (!Number.isInteger(t1) || !Number.isInteger(t2)) continue;
                        return { q: `${intro} ${who} ${s >= 4 ? 'jogs' : 'walks'} at ${fx(s)} m/s. How many seconds does the diagonal path save?`, fig, ans: CA.num(t1 - t2, 's'), sol: R`Edges: \(${a + b} \div ${fx(s)} = ${t1}\) s. Diagonal \(\sqrt{${a}^2+${b}^2} = ${c}\) m: \(${c} \div ${fx(s)} = ${t2}\) s. Saves \(${t1 - t2}\) s.` };
                    }
                    return { q: `${intro} How many meters shorter is the diagonal path?`, fig, ans: CA.num(a + b - c, 'm'), sol: R`Edges: \(${a} + ${b} = ${a + b}\) m. Diagonal: \(\sqrt{${a}^2 + ${b}^2} = ${c}\) m. Shorter by \(${a + b - c}\) m.` };
                },
            },
        ],

        assignment: [
            ['d-from-st', 4], ['missing-st', 3], ['unit-convert', 3], ['best-unit', 2], ['disp-concept', 3],
            ['number-line', 4], ['multi-leg', 3], ['speed-time-area', 4], ['dt-graph', 4], ['laps', 3], ['round-trip', 2], ['grid-route', 3],
            ['pythag-disp', 3], ['chase-meet', 3], ['story', 3], ['compare-routes', 3],
        ],
    });
})();
