/* Challenge Academy — Lesson 14: Digging Holes in Solid Figures */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m;
    const sum = a => a.reduce((x, y) => x + y, 0);
    const TIMES = R`\times `;
    const prod = (...a) => a.join(TIMES);

    // ── Voxel solids: every answer is counted from these ─────────────────
    // V.a[...] = 1 where a unit cube is present.
    //   x = column, left → right (0 … A−1);  y = row, back → front (0 … B−1);  z = layer, bottom → top (0 … C−1).
    function solid(A, B, C) { return { A, B, C, a: new Array(A * B * C).fill(1) }; }
    const at = (V, x, y, z) => (z * V.B + y) * V.A + x;
    const has = (V, x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < V.A && y < V.B && z < V.C && V.a[at(V, x, y, z)] === 1;
    /** Remove every cube with x0 ≤ x < x1, y0 ≤ y < y1, z0 ≤ z < z1. */
    function cut(V, [x0, x1], [y0, y1], [z0, z1]) {
        for (let z = z0; z < z1; z++) for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) V.a[at(V, x, y, z)] = 0;
        return V;
    }
    const volume = V => sum(V.a);
    const DIRS6 = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    /** Exposed unit faces, counted one cube at a time (outside and inside walls). */
    function surface(V) {
        let s = 0;
        for (let z = 0; z < V.C; z++) for (let y = 0; y < V.B; y++) for (let x = 0; x < V.A; x++) {
            if (!has(V, x, y, z)) continue;
            for (const [a, b, c] of DIRS6) if (!has(V, x + a, y + b, z + c)) s++;
        }
        return s;
    }
    /** Number of separate pieces along a line = number of exposed faces that point at you. */
    const runs = line => line.reduce((n, v, i) => n + (v && !line[i - 1] ? 1 : 0), 0);
    const range = n => Array.from({ length: n }, (_, i) => i);
    /** The line of sight through one square of a view, near end first. */
    function sight(V, which, r, c) {
        const { A, B, C } = V;
        if (which === 'front') return range(B).map(i => has(V, c, B - 1 - i, C - 1 - r));
        if (which === 'left') return range(A).map(i => has(V, i, c, C - 1 - r));
        return range(C).map(i => has(V, c, r, C - 1 - i));
    }
    /**
     * A view with the number of exposed faces written in each square.
     * front: rows = layers top → bottom, columns left → right.
     * left:  rows = layers top → bottom, columns back → front (stand on the left: the back is on your left).
     * top:   rows back → front, columns left → right.
     */
    function viewNums(V, which) {
        const rows = which === 'top' ? V.B : V.C, cols = which === 'front' || which === 'top' ? V.A : V.B;
        return range(rows).map(r => range(cols).map(c => runs(sight(V, which, r, c))));
    }
    const viewSum = (V, w) => sum(viewNums(V, w).flat());
    /** The book's method, checked against the cube-by-cube count. */
    function viewSA(V) {
        const f = viewSum(V, 'front'), l = viewSum(V, 'left'), t = viewSum(V, 'top'), s = 2 * (f + l + t);
        if (s !== surface(V)) throw new Error(`lesson 14: views give ${s} but the surface is ${surface(V)}`);
        return { f, l, t, s };
    }
    /** Horizontal layers from the TOP down: cells[y][x] (back row first) and the number of cubes. */
    function layers(V) {
        return range(V.C).map(i => {
            const z = V.C - 1 - i;
            const cells = range(V.B).map(y => range(V.A).map(x => (has(V, x, y, z) ? 1 : 0)));
            return { cells, n: sum(cells.flat()) };
        });
    }
    function layerTotal(V) {
        const L = layers(V).map(l => l.n);
        if (sum(L) !== volume(V)) throw new Error('lesson 14: layers do not add up');
        return L;
    }

    // ── Drawing a voxel solid (seen from the front, the LEFT and above, as in Lesson 1) ──
    const OUT = { front: F.colors.FILL, top: '#f5f7ff', side: F.colors.SHADE };
    const IN = { front: '#a7b1c2', top: '#cfd6e1', side: '#7f8ba0' };     // walls inside holes and dents
    /** opt.size px per cube; opt.grid=false hides the lines between cubes; opt.color(x,y,z) → {front, top, side}. */
    function drawSolid(V, opt = {}) {
        const { A, B, C } = V;
        const s = opt.size || Math.max(9, Math.min(26, Math.floor((opt.maxW || 170) / (A + 0.62 * B)), Math.floor((opt.maxH || 125) / (C + 0.42 * B))));
        const dx = s * 0.62, dy = s * 0.42, pad = 4;
        const W = A * s + B * dx + 2 * pad, H = C * s + B * dy + 2 * pad;
        const grid = opt.grid !== false;
        const group = (x, y, z) => (opt.color ? opt.color(x, y, z) : OUT);
        const pal = (x, y, z, inner) => (opt.color ? opt.color(x, y, z) || OUT : inner ? IN : OUT);
        // Does the face with normal n of cube q continue the face being drawn (same plane, same colour)?
        const cont = (g, q, n) => has(V, ...q) && !has(V, q[0] + n[0], q[1] + n[1], q[2] + n[2]) && group(...q) === g;
        let body = '';
        const face = (pts, fill, edges, g, n) => {
            if (grid) { body += F.poly(pts, { fill }); return; }
            body += F.poly(pts, { fill, stroke: fill, width: 0.8 });
            edges.forEach(([i, q]) => { if (!cont(g, q, n)) body += F.line(...pts[i], ...pts[(i + 1) % 4], { width: 1.7 }); });
        };
        for (let y = 0; y < B; y++) for (let x = A - 1; x >= 0; x--) for (let z = 0; z < C; z++) {
            if (!has(V, x, y, z)) continue;
            const d = B - 1 - y, X = pad + B * dx + x * s - d * dx, Y = H - pad - z * s - d * dy;
            const g = group(x, y, z);
            if (!has(V, x - 1, y, z)) {
                const p = pal(x, y, z, x > 0);
                face([[X, Y], [X - dx, Y - dy], [X - dx, Y - s - dy], [X, Y - s]], p.side,
                    [[0, [x, y, z - 1]], [1, [x, y - 1, z]], [2, [x, y, z + 1]], [3, [x, y + 1, z]]], g, [-1, 0, 0]);
            }
            if (!has(V, x, y, z + 1)) {
                const p = pal(x, y, z, z < C - 1);
                face([[X, Y - s], [X + s, Y - s], [X + s - dx, Y - s - dy], [X - dx, Y - s - dy]], p.top,
                    [[0, [x, y + 1, z]], [1, [x + 1, y, z]], [2, [x, y - 1, z]], [3, [x - 1, y, z]]], g, [0, 0, 1]);
            }
            if (!has(V, x, y + 1, z)) {
                const p = pal(x, y, z, y < B - 1);
                face([[X, Y], [X + s, Y], [X + s, Y - s], [X, Y - s]], p.front,
                    [[0, [x, y, z - 1]], [1, [x + 1, y, z]], [2, [x, y, z + 1]], [3, [x - 1, y, z]]], g, [0, 1, 0]);
            }
        }
        return F.svg(W, H, body, { label: 'solid made of cubes' });
    }
    /** A view as a grid with numbers written in. opt.mark = [r, c] puts a ? there; opt.blank hides the numbers. */
    function numGrid(cells, opt = {}) {
        const s = opt.cell || 18, pad = 3, Rr = cells.length, Cc = cells[0].length;
        const labelH = opt.label ? 17 : 0;
        const W = Math.max(Cc * s + 2 * pad, opt.label ? opt.label.length * 6.6 + 6 : 0), H = Rr * s + 2 * pad + labelH;
        const x0 = (W - Cc * s) / 2, fs = Math.round(s * 0.58);
        let b = '';
        cells.forEach((row, r) => row.forEach((v, c) => {
            const mk = opt.mark && opt.mark[0] === r && opt.mark[1] === c;
            const x = x0 + c * s, y = pad + r * s;
            b += F.rect(x, y, s, s, { fill: mk ? '#ffd8a8' : v ? F.colors.FILL : '#ffffff', width: 1 });
            const t = mk ? '?' : opt.blank ? '' : String(v);
            if (t) b += F.text(x + s / 2, y + s / 2 + fs * 0.36, t, { size: fs, bold: mk || v > 1, fill: !mk && v === 0 ? '#a0aec0' : F.colors.INK });
        }));
        if (opt.label) b += F.text(W / 2, H - 4, opt.label, { size: 12 });
        return F.svg(W, H, b, { label: opt.label || 'view' });
    }
    const layerFig = (cells, label, cell = 13) => F.grid(cells, { ghost: true, cell, label });
    const viewFigs = (V, cell = 15) => F.row(...['front', 'left', 'top'].map(w => numGrid(viewNums(V, w), { cell, label: `${w[0].toUpperCase() + w.slice(1)} view` })));
    const layerFigs = (V, cell = 12) => F.row(...layers(V).map((l, i) => layerFig(l.cells, `Layer ${i + 1}: ${l.n}`, cell)));
    const pieces = line => line.map(v => (v ? '■' : '□')).join(' ');

    // ── Drilling ─────────────────────────────────────────────────────────
    // A hole is drilled into the front, left or top face (the three faces the pictures show).
    // (u, v) is the lower corner of its opening on that face, w × h its size, depth how far it goes in.
    //   front: u = x (left → right), v = z (bottom → top)     left: u = y (back → front), v = z     top: u = x, v = y (back → front)
    function drill(V, face, u, v, w, h, depth) {
        const { A, B, C } = V;
        if (face === 'front') return cut(V, [u, u + w], [B - (depth || B), B], [v, v + h]);
        if (face === 'left') return cut(V, [0, depth || A], [u, u + w], [v, v + h]);
        return cut(V, [u, u + w], [v, v + h], [C - (depth || C), C]);
    }
    const THROUGH = {
        front: 'from the front face straight through to the back face',
        left: 'from the left face straight through to the right face',
        top: 'from the top face straight down through to the bottom face',
    };
    const DIR = { front: 'front to back', left: 'left to right', top: 'top to bottom' };
    const FACES = ['front', 'left', 'top'];
    /** Square tunnels of side k through the centres of the given faces of an n-cube. */
    function centred(n, k, faces) {
        const V = solid(n, n, n), o = (n - k) / 2;
        faces.forEach(f => drill(V, f, o, o, k, k));
        return V;
    }
    const PAIRS = [[3, 1], [4, 2], [5, 1], [5, 3], [6, 2], [6, 4], [7, 1], [7, 3]];
    /** A cube with 2–3 random 1×1 (or 2×2) tunnels, none touching the outer edges. */
    function randomDrilled(rng, o = {}) {
        for (;;) {
            const n = o.n || rng.pick([4, 5, 5]), count = o.count || rng.pick([2, 2, 3]);
            const V = solid(n, n, n), used = new Set();
            const faces = rng.shuffle(FACES.concat(FACES)).slice(0, count);
            for (const f of faces) {
                const k = n >= 5 && rng.bool(0.25) ? 2 : 1;
                const u = rng.int(1, n - 1 - k), v = rng.int(1, n - 1 - k);
                used.add(`${f}${u}${v}${k}`);
                drill(V, f, u, v, k, k);
            }
            if (used.size < count || new Set(faces).size < 2) continue;
            if (!o.ok || o.ok(V)) return V;
        }
    }
    const word = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    const ordinal = k => ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'][k - 1];

    /** Patterns of 1×1 holes on a 5×5 face (positions u, v, all away from the edges). */
    const PATTERNS = [
        { name: 'one hole in the centre', cells: [[2, 2]] },
        { name: 'four holes', cells: [[1, 1], [1, 3], [3, 1], [3, 3]] },
        { name: 'five holes', cells: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]] },
        { name: 'a plus-shaped hole', cells: [[2, 1], [1, 2], [2, 2], [3, 2], [2, 3]] },
        { name: 'a slot', cells: [[1, 2], [2, 2], [3, 2]] },
        { name: 'a vertical slot', cells: [[2, 1], [2, 2], [2, 3]] },
        { name: 'three holes in a diagonal', cells: [[1, 1], [2, 2], [3, 3]] },
        { name: 'two holes', cells: [[1, 2], [3, 2]] },
    ];
    function patterned(rng) {
        for (;;) {
            const faces = rng.bool(0.6) ? FACES.slice() : rng.sample(FACES, 2);
            const pats = faces.map(() => rng.pick(PATTERNS));
            const V = solid(5, 5, 5);
            faces.forEach((f, i) => pats[i].cells.forEach(([u, v]) => drill(V, f, u, v, 1, 1)));
            if (volume(V) >= 60) return { V, faces, pats };
        }
    }

    // ── Words and short solutions ────────────────────────────────────────
    const cubeWords = (rng, n) => rng.pick([
        `A ${n} × ${n} × ${n} cube is built from ${n ** 3} small cubes.`,
        `${n ** 3} small cubes are glued together into one big cube, ${n} cubes along each edge.`,
        `A big cube is made of ${n ** 3} unit cubes (${n} along each edge).`,
    ]);
    function layerSol(V) {
        const L = layerTotal(V);
        return R`Split the solid into ${L.length} horizontal layers and count each layer's top view, from the top down: ${m(L.join('+') + '=' + sum(L))}.`;
    }
    function viewSol(V, e = 1) {
        const v = viewSA(V);
        return R`Add up the numbers in each view: front ${v.f}, left ${v.l}, top ${v.t}. Then ${m(`2${TIMES}(${v.f}+${v.l}+${v.t})=${v.s}`)}` +
            (e === 1 ? '.' : R` squares, each ${m(`${e}${TIMES}${e}=${e * e}`)} cm²: ${m(`${v.s}${TIMES}${e * e}=${v.s * e * e}`)}.`);
    }
    /** How the numbers in a view are made up: "12 squares show 1, 4 show 2 and 4 show 0". */
    function viewMakeup(cells) {
        const c = [0, 1, 2, 3, 4, 5].map(k => cells.flat().filter(v => v === k).length);
        const parts = [1, 2, 3, 4, 5].filter(k => c[k]).map(k => `${c[k]} square${c[k] === 1 ? '' : 's'} show${c[k] === 1 ? 's' : ''} ${k}`);
        if (c[0]) parts.push(`${c[0]} show${c[0] === 1 ? 's' : ''} 0 (you can see right through)`);
        const s = sum(cells.flat());
        return { text: parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0], tex: [1, 2, 3, 4, 5].filter(k => c[k]).map(k => (k === 1 ? String(c[k]) : `${k}${TIMES}${c[k]}`)).join('+') + '=' + s, s };
    }

    // ── Solids used in the tutorial and the examples ─────────────────────
    const T1 = centred(4, 2, ['front']);
    const T3 = centred(5, 1, FACES);
    const T3L = layerTotal(T3), T3V = viewSA(T3);
    const T1L = layerTotal(T1), T1V = viewSA(T1);
    const DENT = drill(solid(4, 4, 4), 'top', 1, 1, 2, 2, 2);
    const DENTL = layerTotal(DENT), DENTV = viewSA(DENT);
    const COL = cut(solid(4, 4, 4), [0, 2], [2, 4], [2, 4]);
    const GROOVE = cut(solid(4, 4, 4), [1, 2], [3, 4], [0, 4]);
    const COLV = viewSA(COL), GROOVEV = viewSA(GROOVE);
    const E5 = solid(5, 5, 5); drill(E5, 'front', 1, 1, 1, 1); drill(E5, 'front', 3, 3, 1, 1); drill(E5, 'top', 2, 2, 1, 1, 3);
    const E5L = layerTotal(E5), E5V = viewSA(E5);
    const E6 = centred(3, 1, FACES), E6V = viewSA(E6);
    const one = (n, k) => ({ V: n ** 3 - k * k * n, S: 6 * n * n - 2 * k * k + 4 * k * n });
    if (volume(T1) !== one(4, 2).V || surface(T1) !== one(4, 2).S) throw new Error('lesson 14: one-tunnel formula');
    if (volume(T3) !== 125 - 3 * 5 + 2) throw new Error('lesson 14: three-tunnel formula');
    const markLine = sight(T3, 'left', 2, 1);

    CA.register({
        id: 14,

        tutorial: [
            {
                h: 'Drilling holes through a cube',
                html: R`
                <p>Take a big cube built from small cubes and drill a square <strong>tunnel</strong> straight through
                   it: the small cubes in the way are taken out. Two questions always follow — how many small cubes are
                   left (the <strong>volume</strong>), and how big is the <strong>surface area</strong> now, counting
                   the walls inside the tunnel as well?</p>
                ${F.row(F.cap(drawSolid(T1, { size: 30 }), 'A 4 × 4 × 4 cube with a 2 × 2 tunnel from front to back'))}
                <p>The pictures in this lesson look at a solid from the <strong>front</strong>, the
                   <strong>left</strong> and <strong>above</strong>, just like in Lesson 1. A grey square is the
                   opening of a hole or a wall inside it. A tunnel always runs straight through to the
                   <em>opposite</em> face, so a hole you see on the front comes out at the back.</p>
                <div class="ca-key"><strong>Key idea.</strong> Never try to imagine the whole solid at once. Slice
                   it into <strong>layers</strong> to count cubes, and <strong>look through it</strong> from three sides
                   to count faces.</div>
                <div class="ca-warn"><strong>Digging can make the surface bigger.</strong> The surface
                   of a ${m(prod(4, 4, 4))} cube loses the two openings, but gains the four walls of the tunnel. Here the
                   surface grows from ${6 * 16} to ${surface(T1)} squares, while the volume falls from 64 to ${volume(T1)}.</div>`,
            },
            {
                h: 'Volume: slice the solid into layers',
                html: R`
                <p>Here is a ${m(prod(5, 5, 5))} cube with a ${m(prod(1, 1))} tunnel through the centre of each pair of
                   opposite faces: front to back, left to right and top to bottom.</p>
                ${F.row(F.cap(drawSolid(T3, { size: 26 }), 'Three tunnels through the centre'))}
                <div class="ca-key"><strong>Step 1.</strong> Split the solid into horizontal layers and draw the
                   <strong>top view of each layer</strong>.<br>
                   <strong>Step 2.</strong> Count the cubes in each layer and <strong>add</strong> the layers up.</div>
                ${layerFigs(T3, 14)}
                <p>The tunnel from top to bottom makes a one-square hole in <em>every</em> layer. The two
                   horizontal tunnels only cut the middle layer, where they remove a whole cross-shaped strip.
                   So the layers hold ${T3L.join(', ')} cubes: ${m(T3L.join('+') + '=' + sum(T3L))}.</p>
                <div class="ca-warn"><strong>Do not take a cube away twice.</strong> The quick guess
                   ${m(`125-3${TIMES}5=110`)} is wrong: the centre cube lies in all three tunnels, and the cubes next
                   to it lie in two. The layer pictures make every cube appear exactly once, so no cube is counted
                   twice or forgotten.</div>`,
            },
            {
                h: 'Surface area: look through every square',
                html: R`
                <p>To find the surface area of a drilled solid, look at it from the front, the left and the top, as in
                   Lesson 1 — but now write a number in every square of each view.</p>
                <div class="ca-key"><strong>Step 1.</strong> In each view, look through each square along your line of
                   sight and record the <strong>number of exposed faces</strong> that point at you (walls inside the
                   tunnels count too).<br>
                   <strong>Step 2.</strong> Add up the numbers in all three views and <strong>multiply by 2</strong>.</div>
                ${viewFigs(T3)}
                <p>Why does this work? Along one line of sight the cubes form one or more separate
                   <em>pieces</em>. Each piece has exactly one face pointing at you and one pointing away. For example,
                   looking from the left through the middle of the middle layer you meet ${pieces(markLine)}
                   (■ = cube, □ = tunnel): ${runs(markLine)} pieces, so ${runs(markLine)} faces point at you. A line
                   that runs straight along a tunnel meets no cube at all and gets a 0.</p>
                <p>Every face points one of six ways, and the faces pointing away from you are counted when you
                   look from the opposite side — the same numbers again. That is the ×2:</p>
                <div class="ca-formula">\[ S = 2\times(${T3V.f}+${T3V.l}+${T3V.t}) = ${T3V.s} \]</div>
                <div class="ca-tip"><strong>Check by counting.</strong> The outside lost 6 openings:
                   ${m(`150-6=144`)}. Each tunnel has 4 walls, each 2 squares long (the middle cube is missing):
                   ${m(`3${TIMES}4${TIMES}2=24`)}. And ${m(`144+24=${surface(T3)}`)}. ✓</div>`,
            },
            {
                h: 'One tunnel: quick formulas',
                html: R`
                <p>For a single ${m('k\\times k')} tunnel straight through an ${m('n\\times n\\times n')} cube (not
                   touching the edges), the two steps give a formula you can remember.</p>
                ${F.row(F.cap(drawSolid(T1, { size: 24 }), 'n = 4, k = 2'), layerFigs(T1, 13))}
                <ul>
                    <li><strong>Volume.</strong> The tunnel removes a ${m('k\\times k\\times n')} rod:
                        \(V = n^3 - k^2 n\). Here \(64-4\times4=${volume(T1)}\), and the layers agree:
                        ${m(T1L.join('+') + '=' + sum(T1L))}.</li>
                    <li><strong>Surface area.</strong> In the view along the tunnel, \(k^2\) squares show 0. In each of the
                        other two views, the \(k\times n\) squares that look <em>across</em> the tunnel show 2.
                        \[ S = 2\left[(n^2-k^2) + 2(n^2+kn)\right] = 6n^2 - 2k^2 + 4kn \]
                        Here the views add up to ${T1V.f}, ${T1V.l} and ${T1V.t}:
                        ${m(`2${TIMES}(${T1V.f}+${T1V.l}+${T1V.t})=${T1V.s}`)}.</li>
                </ul>
                ${viewFigs(T1)}
                <div class="ca-warn"><strong>Only for one tunnel.</strong> As soon as two tunnels cross, some cubes
                   and some walls are shared. Go back to layers and views.</div>`,
            },
            {
                h: 'Holes that stop part-way, and notches',
                html: R`
                <p>Not every hole goes all the way through. A <strong>dent</strong> stops inside the cube; a
                   <strong>notch</strong> takes a piece off an edge or a corner. The same two methods still work.</p>
                ${F.row(F.cap(drawSolid(DENT, { size: 26 }), 'A 2 × 2 hole, 2 deep, from the top'), layerFigs(DENT, 13))}
                <ul>
                    <li><strong>Volume:</strong> the hole reaches only the top ${2} layers: ${m(DENTL.join('+') + '=' + sum(DENTL))}.</li>
                    <li><strong>Surface:</strong> looking down a dent you still meet one face (its floor), so the top
                        view is all 1s. The side views gain 2s where they look across the hole:
                        ${m(`2${TIMES}(${DENTV.f}+${DENTV.l}+${DENTV.t})=${DENTV.s}`)}. A dent of depth \(d\) adds its
                        four walls, \(4kd\), and loses nothing (the opening is replaced by the floor).</li>
                </ul>
                ${F.row(F.cap(drawSolid(COL, { size: 22 }), 'A 2 × 2 × 2 corner block removed'), F.cap(drawSolid(GROOVE, { size: 22 }), 'A groove in the front face'))}
                <div class="ca-tip"><strong>Corners cost nothing.</strong> Cutting a block off a corner leaves all three
                   views unchanged, so the surface area stays ${COLV.s} — although ${64 - volume(COL)} cubes are gone.
                   A groove from top to bottom is different: the top view loses the groove's square, but the left view
                   gets 2s where it looks across the groove: ${m(`2${TIMES}(${GROOVEV.f}+${GROOVEV.l}+${GROOVEV.t})=${GROOVEV.s}`)} instead of 96.
                   (Lesson 15 looks at this in detail.)</div>`,
            },
            {
                h: 'Patterns of holes, prisms and real units',
                html: R`
                <p>Contest problems often drill several small holes in a pattern. Do not panic: the more holes there are,
                   the more you need the two methods.</p>
                ${F.row(F.cap(drawSolid(E5, { size: 24 }), 'Two tunnels and one dent'), layerFigs(E5, 11))}
                <div class="ca-tip"><strong>Layers make the hard part easy.</strong> Each layer is just a flat
                   picture: shade what is left and count. Here ${m(E5L.join('+') + '=' + sum(E5L))}.</div>
                <p>A <strong>rectangular prism</strong> works exactly the same way; only the layers are rectangles.
                   And when each small cube has edge \(e\) cm, count in small cubes first and then convert:</p>
                <div class="ca-formula">\[ V = (\text{cubes}) \times e^3 \qquad S = (\text{squares}) \times e^2 \]</div>
                <div class="ca-warn"><strong>Check that holes stay holes.</strong> A tunnel that runs along the edge of
                   the cube is not a tunnel at all: it is a groove, open on one side. Read the picture carefully.</div>`,
            },
        ],

        summary: [
            { topic: 'Find the volume after removing some parts from a rectangular prism or cube', points: [
                'Step 1: split the solid figure into layers, and draw the top view of each layer.',
                'Step 2: add the volumes of the layers to get the volume of the entire solid figure.',
            ] },
            { topic: 'Find the surface area after removing some parts from a rectangular prism or cube', points: [
                'Step 1: in each view, look through each square and record the number of exposed faces on that line (walls inside holes count).',
                R`Step 2: multiply the sum of the three views by 2: \(S = 2\times(\text{front} + \text{left} + \text{top})\).`,
            ] },
        ],

        examples: [
            {
                title: 'Volume with one tunnel',
                q: R`A ${m(prod(4, 4, 4))} cube is built from 64 small cubes. A ${m(prod(2, 2))} square tunnel is drilled through the centre from the front face to the back face. How many small cubes are left?`,
                fig: F.row(drawSolid(T1, { size: 26 })),
                steps: [
                    R`Split the cube into 4 horizontal layers and draw the top view of each.${layerFigs(T1, 12)}`,
                    R`The top and bottom layers are untouched: 16 cubes each. The middle two layers have a strip 2 wide and 4 long missing: ${m('16-8=8')} each.`,
                    R`Add the layers: ${m(T1L.join('+') + '=' + sum(T1L))}.`,
                ],
                answer: R`${volume(T1)} small cubes`,
            },
            {
                title: 'Volume with three tunnels',
                q: R`A ${m(prod(5, 5, 5))} cube is built from 125 small cubes. A ${m(prod(1, 1))} tunnel is drilled through the centre of each pair of opposite faces. How many small cubes are left?`,
                fig: F.row(drawSolid(T3, { size: 24 })),
                steps: [
                    R`Draw the top view of each of the 5 layers.${layerFigs(T3, 12)}`,
                    R`The vertical tunnel removes 1 cube from every layer. The two horizontal tunnels cut only the middle layer: a cross of ${m('5+5-1=9')} squares.`,
                    R`Layers: ${T3L.join(', ')}. Total: ${m(T3L.join('+') + '=' + sum(T3L))}.`,
                ],
                answer: R`${volume(T3)} small cubes`,
            },
            {
                title: 'Surface area with one tunnel',
                q: R`The small cubes of Example 1 have edges of 1 cm. What is the surface area of the drilled solid, including the walls inside the tunnel?`,
                fig: F.row(drawSolid(T1, { size: 26 })),
                steps: [
                    R`Front view: the 4 squares over the tunnel show 0 (you see straight through); the other 12 show 1. Sum ${T1V.f}.`,
                    R`Left view: the 8 squares in the two middle layers look across the tunnel and meet 2 pieces, so they show 2. Sum ${m(`8+2${TIMES}8=${T1V.l}`)}. The top view is the same: ${T1V.t}.${viewFigs(T1, 14)}`,
                    R`Multiply by 2: ${m(`2${TIMES}(${T1V.f}+${T1V.l}+${T1V.t})=${T1V.s}`)}.`,
                ],
                answer: R`${T1V.s} cm²`,
            },
            {
                title: 'Surface area with three tunnels',
                q: R`Find the surface area of the solid in Example 2 (small cubes with 1 cm edges).`,
                fig: F.row(drawSolid(T3, { size: 24 })),
                steps: [
                    R`Look through every square of each view and write down the number of exposed faces.${viewFigs(T3, 14)}`,
                    R`Front view: ${viewMakeup(viewNums(T3, 'front')).text}. Sum ${viewMakeup(viewNums(T3, 'front')).s}. The three views are alike, so each sums to ${T3V.f}.`,
                    R`${m(`2${TIMES}(${T3V.f}+${T3V.l}+${T3V.t})=${T3V.s}`)}.`,
                ],
                answer: R`${T3V.s} cm²`,
            },
            {
                title: 'Tunnels and a dent',
                q: R`Two ${m(prod(1, 1))} tunnels are drilled from the front face to the back face of a ${m(prod(5, 5, 5))} cube, and a ${m(prod(1, 1))} hole 3 cubes deep is drilled into the centre of the top face, as shown. Find the number of small cubes left and the surface area (1 cm cubes).`,
                fig: F.row(drawSolid(E5, { size: 24 })),
                steps: [
                    R`Layers from the top: the dent takes 1 cube from each of the top 3 layers, and each tunnel takes a strip of 5 from the layer it runs through.${layerFigs(E5, 11)}`,
                    R`Volume: ${m(E5L.join('+') + '=' + sum(E5L))} cubes.`,
                    R`Views: front ${E5V.f}, left ${E5V.l}, top ${E5V.t}.${viewFigs(E5, 13)}`,
                    R`Surface area: ${m(`2${TIMES}(${E5V.f}+${E5V.l}+${E5V.t})=${E5V.s}`)} cm².`,
                ],
                answer: R`${volume(E5)} cubes; ${E5V.s} cm²`,
            },
            {
                title: 'Real units',
                q: R`A solid wooden cube has edges of 6 cm. A square hole with sides of 2 cm is drilled through the centre of each pair of opposite faces. Find the volume and the surface area of what is left.`,
                fig: F.row(drawSolid(E6, { size: 40, grid: false })),
                steps: [
                    R`Think of the cube as ${m(prod(3, 3, 3))} blocks with 2 cm edges. The holes remove the centre block and the 6 blocks in the middle of the faces: ${m(`27-7=${volume(E6)}`)} blocks are left.`,
                    R`Volume: each block is ${m(`2^3=8`)} cm³, so ${m(`${volume(E6)}${TIMES}8=${volume(E6) * 8}`)} cm³.`,
                    R`Views (in 2 cm squares): front ${E6V.f}, left ${E6V.l}, top ${E6V.t}. ${m(`2${TIMES}(${E6V.f}+${E6V.l}+${E6V.t})=${E6V.s}`)} squares.`,
                    R`Each square is ${m(`2${TIMES}2=4`)} cm²: ${m(`${E6V.s}${TIMES}4=${E6V.s * 4}`)} cm².`,
                ],
                answer: R`${volume(E6) * 8} cm³ and ${E6V.s * 4} cm²`,
            },
        ],

        practice: [
            {
                id: 'one-tunnel-volume', name: 'One tunnel: cubes left', level: 1,
                gen(rng) {
                    const n = rng.int(3, 7), k = rng.int(1, Math.min(3, n - 2)), face = rng.pick(FACES);
                    const centre = (n - k) % 2 === 0 && rng.bool(0.5);
                    const u = centre ? (n - k) / 2 : rng.int(1, n - 1 - k), v = centre ? (n - k) / 2 : rng.int(1, n - 1 - k);
                    const V = drill(solid(n, n, n), face, u, v, k, k);
                    const left = volume(V), removed = n ** 3 - left, askRemoved = rng.bool(0.3);
                    const f = one(n, k);
                    if (left !== f.V) throw new Error('one-tunnel-volume');
                    const why = face === 'top'
                        ? R`Every one of the ${n} layers is a ${m(prod(n, n))} square with a ${m(prod(k, k))} hole: ${m(`${n}${TIMES}(${n * n}-${k * k})=${left}`)}`
                        : R`The tunnel runs through ${word(k, 'layer', 'layers')}; each of ${k === 1 ? 'it' : 'them'} loses a strip of ${m(prod(k, n) + '=' + k * n)} cubes, and the other ${n - k} layers are full: ${m(`${n - k}${TIMES}${n * n}+${k}${TIMES}${n * n - k * n}=${left}`)}`;
                    return {
                        q: `${cubeWords(rng, n)} A ${k} × ${k} square tunnel is drilled ${THROUGH[face]}, as shown. How many small cubes ${askRemoved ? 'are removed' : 'are left'}?`,
                        fig: F.row(drawSolid(V)),
                        ans: CA.num(askRemoved ? removed : left, 'cubes'),
                        sol: askRemoved ? R`The tunnel is ${k} × ${k} and goes through all ${n} cubes of its length: ${m(`${k}${TIMES}${k}${TIMES}${n}=${removed}`)}.`
                            : why + '.',
                    };
                },
            },
            {
                id: 'layer-count', name: 'Count one layer', level: 1,
                gen(rng) {
                    const V = randomDrilled(rng), n = V.A, L = layers(V);
                    const i = rng.int(0, n - 1), c = L[i].n;
                    return {
                        q: `Square tunnels are drilled straight through this ${n} × ${n} × ${n} cube of small cubes, as shown. Split it into ${n} horizontal layers. How many small cubes are in the <strong>${ordinal(i + 1)} layer from the top</strong>?`,
                        fig: F.row(drawSolid(V)),
                        ans: CA.num(c, 'cubes'),
                        sol: R`Draw the top view of that layer: of its ${m(prod(n, n) + '=' + n * n)} squares, ${n * n - c === 1 ? '1 is a hole' : `${n * n - c} are holes`} — a vertical tunnel makes a hole in every layer, and a horizontal tunnel removes a whole strip from the layers it passes through. ${m(`${n * n}-${n * n - c}=${c}`)}.`,
                    };
                },
            },
            {
                id: 'which-layer', name: 'Pick the layer picture', level: 1,
                gen(rng) {
                    for (;;) {
                        const V = randomDrilled(rng), n = V.A, L = layers(V), i = rng.int(0, n - 1);
                        const pic = cells => F.grid(cells, { ghost: true, cell: 12 });
                        const correct = pic(L[i].cells);
                        const wrong = [...L.map(l => pic(l.cells)), pic(L[i].cells.map(r => r.slice().reverse())), pic(L[i].cells.slice().reverse()),
                            pic(L[i].cells[0].map((_, c) => L[i].cells.map(r => r[c])))];
                        const distinct = [...new Set(wrong)].filter(w => w !== correct);
                        if (distinct.length < 3) continue;
                        return {
                            q: `Square tunnels go straight through this cube, as shown. Which picture is the top view of the <strong>${ordinal(i + 1)} layer from the top</strong>? (Shaded squares still hold a cube; the bottom edge of each picture is the front.)`,
                            fig: F.row(drawSolid(V)),
                            ans: CA.mc(rng, correct, distinct),
                            sol: `That layer keeps ${L[i].n} of its ${n * n} cubes. A tunnel from top to bottom shows as a hole in every layer; a tunnel from front to back removes a column of squares (front to back), and one from left to right removes a row — but only in the layers it passes through.`,
                        };
                    }
                },
            },
            {
                id: 'view-cell', name: 'Faces along one line of sight', level: 1,
                gen(rng) {
                    const V = randomDrilled(rng), w = rng.pick(['front', 'front', 'top', 'left']);
                    const nums = viewNums(V, w), cells = [];
                    nums.forEach((row, r) => row.forEach((v, c) => cells.push([r, c, v])));
                    const pool = rng.bool(0.75) ? cells.filter(x => x[2] !== 1) : cells;
                    const [r, c, v] = rng.pick(pool.length ? pool : cells);
                    const line = sight(V, w, r, c), far = { front: 'back', left: 'right', top: 'bottom' }[w];
                    return {
                        q: `Look at the solid from the <strong>${w}</strong>. Along the line of sight through the square marked ? in the ${w} view, how many exposed faces of cubes point towards you? (Count walls inside tunnels; write 0 if you can see straight through.)`,
                        fig: F.row(drawSolid(V), numGrid(nums, { mark: [r, c], blank: true, cell: 16, label: `${w[0].toUpperCase() + w.slice(1)} view` })),
                        ans: CA.num(v, v === 1 ? 'face' : 'faces'),
                        sol: `Going from the ${w} to the ${far}, the line meets ${pieces(line)} (■ cube, □ empty). ` +
                            (v === 0 ? 'It runs right along a tunnel, so no face points at you: 0.' : `The cubes form ${v} separate piece${v === 1 ? '' : 's'}, and each piece has one face towards you: ${v}.`),
                    };
                },
            },
            {
                id: 'one-tunnel-sa', name: 'One tunnel: surface area', level: 1,
                gen(rng) {
                    const n = rng.int(3, 6), k = rng.int(1, Math.min(2, n - 2)), face = rng.pick(FACES), e = rng.pick([1, 1, 1, 2]);
                    const centre = (n - k) % 2 === 0 && rng.bool(0.5);
                    const u = centre ? (n - k) / 2 : rng.int(1, n - 1 - k), v = centre ? (n - k) / 2 : rng.int(1, n - 1 - k);
                    const V = drill(solid(n, n, n), face, u, v, k, k), S = viewSA(V).s;
                    if (S !== one(n, k).S) throw new Error('one-tunnel-sa');
                    const vs = viewSA(V);
                    return {
                        q: `A ${n} × ${n} × ${n} cube is built from small cubes with ${e} cm edges. A ${k} × ${k} square tunnel is drilled ${THROUGH[face]}, as shown. What is the surface area of the solid, including the walls inside the tunnel?`,
                        fig: F.row(drawSolid(V)),
                        ans: CA.num(S * e * e, 'cm²'),
                        sol: R`Along the tunnel ${k * k} square${k * k === 1 ? '' : 's'} of that view show 0; in the other two views the ${k * n} squares looking across the tunnel show 2. ` + viewSol(V, e),
                    };
                },
            },
            {
                id: 'cross-volume', name: 'Crossing tunnels: cubes left', level: 2,
                gen(rng) {
                    const [n, k] = rng.pick(PAIRS), faces = rng.bool(0.55) ? FACES.slice() : rng.sample(FACES, 2);
                    const V = centred(n, k, faces), left = volume(V);
                    const list = faces.map(f => DIR[f]);
                    const e = rng.pick([1, 1, 1, 2]);
                    return {
                        q: `A ${n} × ${n} × ${n} cube is built from ${n ** 3} small cubes${e === 1 ? '' : ` with ${e} cm edges`}. A ${k} × ${k} square tunnel is drilled straight through the centre ${list.length === 3 ? 'of each pair of opposite faces' : `from ${list[0]} and another from ${list[1]}`}. ${e === 1 ? 'How many small cubes are left?' : 'What is the volume of the solid that is left?'}`,
                        fig: F.row(drawSolid(V)),
                        ans: e === 1 ? CA.num(left, 'cubes') : CA.num(left * e ** 3, 'cm³'),
                        sol: layerSol(V) + (e === 1 ? '' : R` Each cube is ${m(`${e}^3=${e ** 3}`)} cm³: ${m(`${left}${TIMES}${e ** 3}=${left * e ** 3}`)}.`),
                    };
                },
            },
            {
                id: 'cross-sa', name: 'Crossing tunnels: surface area', level: 2,
                gen(rng) {
                    const [n, k] = rng.pick(PAIRS.filter(p => p[0] <= 6)), faces = rng.bool(0.55) ? FACES.slice() : rng.sample(FACES, 2);
                    const V = centred(n, k, faces), list = faces.map(f => DIR[f]);
                    return {
                        q: `A ${n} × ${n} × ${n} cube is built from small cubes with 1 cm edges. A ${k} × ${k} square tunnel is drilled straight through the centre ${list.length === 3 ? 'of each pair of opposite faces' : `from ${list[0]} and another from ${list[1]}`}. What is the surface area of the solid, including the walls inside the tunnels?`,
                        fig: F.row(drawSolid(V)),
                        ans: CA.num(viewSA(V).s, 'cm²'),
                        sol: viewSol(V),
                    };
                },
            },
            {
                id: 'view-total', name: 'Add up one view', level: 2,
                gen(rng) {
                    const V = randomDrilled(rng), w = rng.pick(FACES);
                    const mk = viewMakeup(viewNums(V, w));
                    return {
                        q: `Square tunnels go straight through this cube, as shown. In the <strong>${w} view</strong>, every square is labelled with the number of exposed faces along its line of sight (walls inside tunnels included). What is the sum of all the numbers in the ${w} view?`,
                        fig: F.row(drawSolid(V)),
                        ans: CA.num(mk.s),
                        sol: R`In the ${w} view, ${mk.text}. A line that crosses a tunnel meets two separate pieces, and a line that crosses two tunnels meets three. Sum: ${m(mk.tex)}.`,
                    };
                },
            },
            {
                id: 'dents', name: 'Holes that stop part-way', level: 2,
                gen(rng) {
                    for (;;) {
                        const n = rng.int(4, 6), count = rng.pick([1, 2, 2]);
                        const V = solid(n, n, n), faces = rng.sample(FACES, count), parts = [];
                        for (const f of faces) {
                            const k = rng.int(1, Math.min(2, n - 2)), d = rng.int(1, n - 2);
                            const u = rng.int(1, n - 1 - k), v = rng.int(1, n - 1 - k);
                            drill(V, f, u, v, k, k, d);
                            parts.push(`a ${k} × ${k} hole ${word(d, 'cube', 'cubes')} deep into the ${f} face`);
                        }
                        const askV = rng.bool(0.45);
                        return {
                            q: `${cubeWords(rng, n)} ${count === 1 ? 'A square hole is' : 'Square holes are'} drilled straight in, but not all the way through: ${parts.join(' and ')}, as shown. ${askV ? 'How many small cubes are left?' : 'The small cubes have 1 cm edges. What is the surface area of the solid, including the inside of the holes?'}`,
                            fig: F.row(drawSolid(V)),
                            ans: askV ? CA.num(volume(V), 'cubes') : CA.num(viewSA(V).s, 'cm²'),
                            sol: askV ? layerSol(V) : R`Looking into a dent you still meet one face (its floor), so that view is unchanged; the views from the side get 2s where they look across a hole. ` + viewSol(V),
                        };
                    }
                },
            },
            {
                id: 'notches', name: 'Notches, grooves and missing columns', level: 2,
                gen(rng) {
                    const [a, b, c] = rng.bool(0.5) ? Array(3).fill(rng.int(4, 6)) : [rng.int(4, 7), rng.int(3, 5), rng.int(3, 5)];
                    const V = solid(a, b, c);
                    const kind = rng.pick(['corner', 'column', 'groove', 'trench', 'step']);
                    let what;
                    if (kind === 'corner') {
                        const p = rng.int(1, a - 2), q = rng.int(1, b - 2), r = rng.int(1, c - 2);
                        cut(V, [0, p], [b - q, b], [c - r, c]);
                        what = `a block ${p} cube${p > 1 ? 's' : ''} long, ${q} deep and ${r} high is cut out of the top front left corner`;
                    } else if (kind === 'column') {
                        const k = rng.int(1, 2);
                        cut(V, [0, k], [b - k, b], [0, c]);
                        what = `a ${k} × ${k} column is removed along the whole front left edge, from top to bottom`;
                    } else if (kind === 'groove') {
                        const k = rng.int(1, 2), u = rng.int(1, a - 1 - k), d = rng.int(1, b - 2);
                        cut(V, [u, u + k], [b - d, b], [0, c]);
                        what = `a groove ${k} cube${k > 1 ? 's' : ''} wide and ${d} deep is cut into the front face, from top to bottom`;
                    } else if (kind === 'trench') {
                        const k = rng.int(1, 2), u = rng.int(1, a - 1 - k), d = rng.int(1, c - 2);
                        cut(V, [u, u + k], [0, b], [c - d, c]);
                        what = `a trench ${k} cube${k > 1 ? 's' : ''} wide and ${d} deep is cut across the top, from the front face to the back face`;
                    } else {
                        const d = rng.int(1, b - 2), h = rng.int(1, c - 2);
                        cut(V, [0, a], [b - d, b], [c - h, c]);
                        what = `a step is cut along the whole top front edge, ${d} cube${d > 1 ? 's' : ''} deep and ${h} high`;
                    }
                    const askV = rng.bool(0.35), before = 2 * (a * b + a * c + b * c), S = viewSA(V).s;
                    const shape = a === b && b === c ? `A ${a} × ${a} × ${a} cube` : `A block ${a} cubes long, ${b} deep and ${c} high`;
                    return {
                        q: `${shape} is built from small cubes with 1 cm edges. Then ${what}, as shown. ${askV ? 'How many small cubes are left?' : 'What is the surface area of the solid now?'}`,
                        fig: F.row(drawSolid(V)),
                        ans: askV ? CA.num(volume(V), 'cubes') : CA.num(S, 'cm²'),
                        sol: askV ? layerSol(V)
                            : viewSol(V) + (S === before ? ` The three views are the same as for the whole block, so nothing changed: still ${before}.` : ` (The whole block had ${before}.)`),
                    };
                },
            },
            {
                id: 'pattern-volume', name: 'Patterns of holes: cubes left', level: 3,
                gen(rng) {
                    const { V, faces, pats } = patterned(rng);
                    const desc = faces.map((f, i) => `${pats[i].name} on the ${f}`).join(', ');
                    return {
                        q: `A 5 × 5 × 5 cube is built from 125 small cubes. Holes are drilled straight through to the opposite faces — ${desc} — as shown. How many small cubes are left?`,
                        fig: F.row(drawSolid(V, { size: 24 })),
                        ans: CA.num(volume(V), 'cubes'),
                        sol: layerSol(V) + ' Draw each layer: vertical holes show up in every layer, horizontal ones only in the layers they pass through.',
                    };
                },
            },
            {
                id: 'pattern-sa', name: 'Patterns of holes: surface area', level: 3,
                gen(rng) {
                    const { V, faces, pats } = patterned(rng);
                    const desc = faces.map((f, i) => `${pats[i].name} on the ${f}`).join(', ');
                    return {
                        q: `A 5 × 5 × 5 cube is built from small cubes with 1 cm edges. Holes are drilled straight through to the opposite faces — ${desc} — as shown. What is the surface area of the solid, including all the walls inside the holes?`,
                        fig: F.row(drawSolid(V, { size: 24 })),
                        ans: CA.num(viewSA(V).s, 'cm²'),
                        sol: viewSol(V),
                    };
                },
            },
            {
                id: 'prism-holes', name: 'Wooden blocks with holes (cm)', level: 3,
                gen(rng) {
                    for (;;) {
                        const k = rng.pick([1, 1, 2]), e = rng.pick([1, 2, 3]);
                        const dims = [0, 0, 0].map(() => k + 2 * rng.int(1, 2));
                        const [a, b, c] = dims;
                        if (a === b && b === c && rng.bool(0.5)) continue;
                        const faces = rng.bool(0.6) ? FACES.slice() : rng.sample(FACES, 2);
                        const V = solid(a, b, c);
                        faces.forEach(f => {
                            const [U, W] = f === 'front' ? [a, c] : f === 'left' ? [b, c] : [a, b];
                            drill(V, f, (U - k) / 2, (W - k) / 2, k, k);
                        });
                        const askV = rng.bool(0.4), cubes = volume(V), sq = viewSA(V).s;
                        const where = faces.length === 3 ? 'through the centre of each pair of opposite faces' : `through the centres from ${DIR[faces[0]]} and from ${DIR[faces[1]]}`;
                        return {
                            q: `A solid wooden block is ${a * e} cm long, ${b * e} cm wide and ${c * e} cm high. A square hole with sides of ${k * e} cm is drilled straight ${where}, as shown. What is the ${askV ? 'volume' : 'surface area (inside and outside)'} of what is left?`,
                            fig: F.row(drawSolid(V, { grid: false })),
                            ans: askV ? CA.num(cubes * e ** 3, 'cm³') : CA.num(sq * e * e, 'cm²'),
                            sol: (e === 1 ? 'Think of the block as 1 cm cubes. ' : R`Think of the block as cubes with ${e} cm edges: ${m(prod(a, b, c))} of them. `) +
                                (askV ? layerSol(V) + (e === 1 ? '' : R` Each is ${m(`${e}^3=${e ** 3}`)} cm³: ${m(`${cubes}${TIMES}${e ** 3}=${cubes * e ** 3}`)}.`) : viewSol(V, e)),
                        };
                    }
                },
            },
        ],

        assignment: [
            ['one-tunnel-volume', 4], ['layer-count', 3], ['which-layer', 3], ['view-cell', 2], ['one-tunnel-sa', 3],
            ['cross-volume', 5], ['cross-sa', 5], ['view-total', 3], ['dents', 5], ['notches', 5],
            ['pattern-volume', 4], ['pattern-sa', 4], ['prism-holes', 4],
        ],
    });
})();
