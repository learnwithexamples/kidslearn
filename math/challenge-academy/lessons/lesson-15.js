/* Challenge Academy — Lesson 15: Coloring Solid Figures */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m;
    const sum = a => a.reduce((x, y) => x + y, 0);
    const TIMES = R`\times `;
    const prod = (...a) => a.join(TIMES);

    // ── Voxel solids: every surface area is counted face by face from these ──
    //   x = column, left → right;  y = row, back → front;  z = layer, bottom → top.
    function solid(A, B, C, full = 1) { return { A, B, C, a: new Array(A * B * C).fill(full), g: new Array(A * B * C).fill(0) }; }
    const at = (V, x, y, z) => (z * V.B + y) * V.A + x;
    const has = (V, x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < V.A && y < V.B && z < V.C && V.a[at(V, x, y, z)] === 1;
    /** Set every cube with x0 ≤ x < x1, y0 ≤ y < y1, z0 ≤ z < z1 to `val` (0 removes), in colour group g. */
    function fill(V, [x0, x1], [y0, y1], [z0, z1], val = 0, g = 0) {
        for (let z = z0; z < z1; z++) for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { V.a[at(V, x, y, z)] = val; V.g[at(V, x, y, z)] = g; }
        return V;
    }
    const DIRS6 = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    function surface(V) {
        let s = 0;
        for (let z = 0; z < V.C; z++) for (let y = 0; y < V.B; y++) for (let x = 0; x < V.A; x++) {
            if (!has(V, x, y, z)) continue;
            for (const [a, b, c] of DIRS6) if (!has(V, x + a, y + b, z + c)) s++;
        }
        return s;
    }
    /** The rule must agree with the face-by-face count, or the problem is not used. */
    function same(model, formula, tag) {
        if (model !== formula) throw new Error(`lesson 15 ${tag}: model ${model} but formula ${formula}`);
        return model;
    }

    // ── Drawing a voxel solid (seen from the front, the left and above, as in Lesson 1) ──
    const OUT = { front: F.colors.FILL, top: '#f5f7ff', side: F.colors.SHADE };
    const IN = { front: '#a7b1c2', top: '#cfd6e1', side: '#7f8ba0' };       // walls of a notch
    const ORANGE = { front: '#ffd8a8', top: '#ffe8cc', side: '#f4a261' };   // a stuck-on cube
    const GROUPS = [OUT, ORANGE, { front: '#b2f2bb', top: '#d3f9d8', side: '#69db7c' }, { front: '#ffc9c9', top: '#ffe3e3', side: '#ff8787' }];
    /** opt.size px per cube; opt.grid=false hides the lines between cubes; opt.groups colours each cube by its group. */
    function drawSolid(V, opt = {}) {
        const { A, B, C } = V;
        const s = opt.size || Math.max(8, Math.min(26, Math.floor((opt.maxW || 170) / (A + 0.62 * B)), Math.floor((opt.maxH || 125) / (C + 0.42 * B))));
        const dx = s * 0.62, dy = s * 0.42, pad = 4;
        const W = A * s + B * dx + 2 * pad, H = C * s + B * dy + 2 * pad;
        const grid = opt.grid !== false;
        const group = (x, y, z) => (opt.groups ? GROUPS[V.g[at(V, x, y, z)]] : OUT);
        const pal = (x, y, z, inner) => (opt.groups ? group(x, y, z) : inner ? IN : OUT);
        const cont = (g, q, n) => has(V, ...q) && !has(V, q[0] + n[0], q[1] + n[1], q[2] + n[2]) && group(...q) === g;
        let body = '';
        const face = (pts, fillc, edges, g, n) => {
            if (grid) { body += F.poly(pts, { fill: fillc }); return; }
            body += F.poly(pts, { fill: fillc, stroke: fillc, width: 0.8 });
            edges.forEach(([i, q]) => { if (!cont(g, q, n)) body += F.line(...pts[i], ...pts[(i + 1) % 4], { width: 1.7 }); });
        };
        for (let y = 0; y < B; y++) for (let x = A - 1; x >= 0; x--) for (let z = 0; z < C; z++) {
            if (!has(V, x, y, z)) continue;
            const d = B - 1 - y, X = pad + B * dx + x * s - d * dx, Y = H - pad - z * s - d * dy;
            const g = group(x, y, z);
            if (!has(V, x - 1, y, z)) face([[X, Y], [X - dx, Y - dy], [X - dx, Y - s - dy], [X, Y - s]], pal(x, y, z, x > 0).side,
                [[0, [x, y, z - 1]], [1, [x, y - 1, z]], [2, [x, y, z + 1]], [3, [x, y + 1, z]]], g, [-1, 0, 0]);
            if (!has(V, x, y, z + 1)) face([[X, Y - s], [X + s, Y - s], [X + s - dx, Y - s - dy], [X - dx, Y - s - dy]], pal(x, y, z, z < C - 1).top,
                [[0, [x, y + 1, z]], [1, [x + 1, y, z]], [2, [x, y - 1, z]], [3, [x - 1, y, z]]], g, [0, 0, 1]);
            if (!has(V, x, y + 1, z)) face([[X, Y], [X + s, Y], [X + s, Y - s], [X, Y - s]], pal(x, y, z, y < B - 1).front,
                [[0, [x, y, z - 1]], [1, [x + 1, y, z]], [2, [x, y, z + 1]], [3, [x - 1, y, z]]], g, [0, 1, 0]);
        }
        return F.svg(W, H, body, { label: 'solid made of cubes' });
    }

    // ── Removing a small cube from a large cube ──────────────────────────
    // Along each axis the small cube sits at the low end, the high end, or strictly in between.
    // Corner: 3 ends.  Edge: 2 ends.  Face: 1 end.  It must touch the front, the left or the top so the picture shows it.
    const KIND_ENDS = { corner: 3, edge: 2, face: 1 };
    const EXTRA = { corner: 0, edge: 2, face: 4 };
    const WHERE = {
        corner: 'from a corner',
        edge: 'from an edge (not touching a corner)',
        face: 'from the middle of a face (not touching an edge)',
    };
    /** A random visible position [x, y, z] for a k-cube of the given kind in an N-cube, avoiding cells in `avoid`. */
    function spot(rng, N, k, kind) {
        for (;;) {
            const ends = rng.shuffle([1, 1, 1].map((_, i) => i < KIND_ENDS[kind]));
            const p = ends.map((e, i) => (e ? (rng.bool(0.8) === (i === 0) ? 0 : N - k) : rng.int(1, N - k - 1)));   // mostly on the sides you can see
            if (p[0] === 0 || p[1] === N - k || p[2] === N - k) return p;
        }
    }
    const remove = (V, [x, y, z], k) => fill(V, [x, x + k], [y, y + k], [z, z + k], 0);
    /** Do two k-cubes at p and q touch (share at least part of a face, an edge or a corner)? */
    const near = (p, kp, q, kq) => [0, 1, 2].every(i => p[i] <= q[i] + kq && q[i] <= p[i] + kp);

    // ── Sticking cubes together ──────────────────────────────────────────
    /** Build a solid from boxes {p:[x,y,z], k (edge), g (colour)}; coordinates may be negative. */
    function build(boxes) {
        const lo = [0, 1, 2].map(i => Math.min(...boxes.map(b => b.p[i]))), hi = [0, 1, 2].map(i => Math.max(...boxes.map(b => b.p[i] + b.k)));
        const V = solid(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2], 0);
        boxes.forEach(b => { const p = b.p.map((v, i) => v - lo[i]); fill(V, [p[0], p[0] + b.k], [p[1], p[1] + b.k], [p[2], p[2] + b.k], 1, b.g || 0); });
        return V;
    }
    /** Where a k-cube goes when stuck flat onto the given face of an N-cube at the origin (fully on the face). */
    function stickSpot(rng, N, k, face, centre) {
        const off = () => (centre && (N - k) % 2 === 0 ? (N - k) / 2 : rng.int(0, N - k));
        const a = off(), b = off();
        if (face === 'top') return [a, b, N];
        if (face === 'front') return [a, N, b];
        if (face === 'left') return [-k, a, b];
        return [N, N - k, b];   // right: flush with the front face, so the picture shows it
    }
    const STICK_FACES = ['top', 'front', 'left', 'right'];

    // ── Painting: a solid is a list of unit cubes [x, y, z] ──────────────
    const DIRS = { left: [-1, 0, 0], right: [1, 0, 0], back: [0, -1, 0], front: [0, 1, 0], bottom: [0, 0, -1], top: [0, 0, 1] };
    const ALL = Object.keys(DIRS);
    const NO_BOTTOM = ALL.filter(f => f !== 'bottom');
    const key = (x, y, z) => `${x},${y},${z}`;
    function blockCells(a, b, c) {
        const cells = [];
        for (let y = 0; y < b; y++) for (let x = 0; x < a; x++) for (let z = 0; z < c; z++) cells.push([x, y, z]);
        return cells;
    }
    /** Painted faces of each cube: a face gets paint if it points in one of `faces` and no cube covers it. */
    function paint(cells, faces = ALL) {
        const set = new Set(cells.map(c => key(...c)));
        return cells.map(([x, y, z]) => faces.reduce((t, f) => {
            const d = DIRS[f];
            return t + (set.has(key(x + d[0], y + d[1], z + d[2])) ? 0 : 1);
        }, 0));
    }
    function tally(cells, faces = ALL) {
        const per = paint(cells, faces), n = [0, 0, 0, 0, 0, 0, 0];
        per.forEach(v => n[v]++);
        return { n, per, faces: sum(per), cubes: cells.length };
    }
    const blockTally = (a, b, c, faces = ALL) => tally(blockCells(a, b, c), faces);
    /** The book's formulas for a fully painted a×b×c block (a, b, c > 1): [0 faces, 1 face, 2 faces, 3 faces]. */
    const formula = (a, b, c) => [
        (a - 2) * (b - 2) * (c - 2),
        2 * (a - 2) * (b - 2) + 2 * (a - 2) * (c - 2) + 2 * (b - 2) * (c - 2),
        4 * (a - 2) + 4 * (b - 2) + 4 * (c - 2),
        8,
    ];
    // "Positions" method for a block with only some faces painted.
    const axisPaint = faces => [['left', 'right'], ['front', 'back'], ['top', 'bottom']].map(pair => pair.filter(f => faces.includes(f)).length);
    function positions(dims, P, k) {
        const terms = [];
        let value = 0;
        for (let mask = 0; mask < 8; mask++) {
            const on = [0, 1, 2].map(i => (mask >> i) & 1);
            if (sum(on) !== k) continue;
            const fs = [0, 1, 2].map(i => (on[i] ? P[i] : dims[i] - P[i]));
            const v = fs[0] * fs[1] * fs[2];
            if (v > 0) { terms.push(prod(...fs)); value += v; }
        }
        return { value, tex: terms.length ? terms.join('+') + '=' + value : '0' };
    }

    // Figures for painted blocks (F.cubes with a colour per cube).
    const KIND = {
        3: { front: '#fc8181', top: '#fed7d7', side: '#e53e3e' },     // corner cubes
        2: { front: '#f6e05e', top: '#fefcbf', side: '#d69e2e' },     // edge cubes
        1: { front: '#9ae6b4', top: '#c6f6d5', side: '#48bb78' },     // face cubes
        0: { front: '#e2e8f0', top: '#f7fafc', side: '#a0aec0' },     // inside cubes
    };
    const WOOD = { front: '#f7fafc', top: '#ffffff', side: '#e2e8f0' };
    const PAINT = { front: '#f6ad55', top: '#fbd38d', side: '#dd6b20' };
    const MARK = { front: '#e8590c', top: '#f08c4a', side: '#b8440a' };
    const swatch = c => `<span style="display:inline-block;width:12px;height:12px;vertical-align:-1px;background:${c};border:1px solid #2d3748"></span>`;
    const autoSize = (a, b, c) => Math.max(11, Math.min(24, Math.floor(150 / (a + b * 0.5)), Math.floor(130 / (c + b * 0.36))));
    /** An a (long) × b (deep) × c (high) block of unit cubes, seen from the front, the left and above. */
    function blockFig(a, b, c, opt = {}) {
        const heights = Array.from({ length: b }, () => Array(a).fill(c));
        return F.cubes(heights, { side: 'left', size: opt.size || autoSize(a, b, c), color: opt.color ? (r, col, k) => opt.color(col, r, k) : null });
    }
    function kindFig(a, b, c, opt = {}) {
        const on = (v, n) => (v === 0 ? 1 : 0) + (v === n - 1 ? 1 : 0);
        return blockFig(a, b, c, { ...opt, color: (x, y, z) => KIND[Math.min(3, on(x, a) + on(y, b) + on(z, c))] });
    }
    /** Painted faces (of those you can see) in orange, bare wood in white. */
    function paintFig(a, b, c, faces, opt = {}) {
        return blockFig(a, b, c, {
            ...opt, color: (x, y, z) => ({
                front: faces.includes('front') && y === b - 1 ? PAINT.front : WOOD.front,
                top: faces.includes('top') && z === c - 1 ? PAINT.top : WOOD.top,
                side: faces.includes('left') && x === 0 ? PAINT.side : WOOD.side,
            }),
        });
    }
    const markFig = (a, b, c, cell) => blockFig(a, b, c, { color: (x, y, z) => (x === cell[0] && y === cell[1] && z === cell[2] ? MARK : null) });

    // ── Words ────────────────────────────────────────────────────────────
    const kWords = k => (k === 0 ? 'no paint at all' : `exactly ${k} painted face${k === 1 ? '' : 's'}`);
    const cubeIntro = (rng, n) => rng.pick([
        R`A wooden cube with edges of ${n} cm is painted red on all six faces and then sawn into ${n ** 3} small cubes with edges of 1 cm.`,
        R`A ${m(prod(n, n, n))} cube is built from ${n ** 3} small white cubes. The whole outside of the big cube (all six faces) is painted blue, and then it is taken apart.`,
        R`A cube of clay is dipped in red paint so that all six faces are painted. It is then cut into ${m(prod(n, n, n) + '=' + n ** 3)} equal small cubes.`,
    ]);
    const cubesAns = v => CA.num(v, v === 1 ? 'cube' : 'cubes');
    const facesAns = v => CA.num(v, v === 1 ? 'face' : 'faces');
    const blockIntro = (rng, a, b, c) => rng.pick([
        R`A block ${a} cubes long, ${b} cubes deep and ${c} cubes high is built from ${a * b * c} small cubes. All six faces of the block are painted, and then it is taken apart.`,
        R`A wooden block measuring ${a} cm by ${b} cm by ${c} cm is painted green on all six faces and then sawn into ${a * b * c} cubes with edges of 1 cm.`,
        R`A ${m(prod(a, b, c))} rectangular block made of ${a * b * c} unit cubes is dipped in paint, so every outside face is coloured. Then the unit cubes are separated.`,
    ]);
    const list = a => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

    function blockSol(a, b, c, k) {
        const f = formula(a, b, c)[k];
        if (k === 3) return R`Only the 8 corner cubes have 3 painted faces.`;
        if (k === 2) return R`These are the edge cubes that are not corners: ${m(`(${a}-2)${TIMES}4+(${b}-2)${TIMES}4+(${c}-2)${TIMES}4=${f}`)}.`;
        if (k === 1) return R`These lie in the middle of a face: ${m(`2${TIMES}${a - 2}${TIMES}${b - 2}+2${TIMES}${a - 2}${TIMES}${c - 2}+2${TIMES}${b - 2}${TIMES}${c - 2}=${f}`)}.`;
        return R`Peel off the painted outer layer: every dimension loses 2. ${m(`(${a}-2)(${b}-2)(${c}-2)=${prod(a - 2, b - 2, c - 2)}=${f}`)}.`;
    }
    function cubeSol(n, k) {
        const f = formula(n, n, n)[k], e = n - 2;
        if (k === 3) return R`Only the 8 corner cubes have 3 painted faces — whatever the size of the cube.`;
        if (k === 2) return R`These lie along the 12 edges, between the corners: ${m(`${n}-2=${e}`)} on each edge. ${m(prod(12, e) + '=' + f)}.`;
        if (k === 1) return R`These are in the middle of a face: a ${m(prod(e, e))} square on each of the 6 faces. ${m(prod(6, e, e) + '=' + f)}.`;
        return R`Peel off the painted outer layer. A cube with edge ${m(`${n}-2=${e}`)} is left: ${m(prod(e, e, e) + '=' + f)}.`;
    }

    // Painted on only some faces.
    const SOME = [
        { name: 'every face except the bottom', f: NO_BOTTOM },
        { name: 'the top and the bottom only', f: ['top', 'bottom'] },
        { name: 'the four side faces (front, back, left and right), but not the top or the bottom', f: ['front', 'back', 'left', 'right'] },
        { name: 'the top and the front only', f: ['top', 'front'] },
        { name: 'the front and the back only', f: ['front', 'back'] },
        { name: 'the top, the front and the left-hand side only', f: ['top', 'front', 'left'] },
        { name: 'the top, the front and the back only', f: ['top', 'front', 'back'] },
        { name: 'every face except the front', f: ALL.filter(x => x !== 'front') },
        { name: 'the front and the left-hand side only', f: ['front', 'left'] },
    ];
    const someIntro = (a, b, c, s) => R`A block ${a} cubes long, ${b} cubes deep and ${c} cubes high is built from ${a * b * c} small cubes. It is painted on <strong>${s.name}</strong>, and then taken apart. (Orange shows the painted faces that you can see in the picture.)`;
    const layersText = (dims, P) => R`Count positions: along the length ${P[0]} of the ${dims[0]} positions touch a painted face, along the depth ${P[1]} of ${dims[1]}, and along the height ${P[2]} of ${dims[2]}.`;

    // Reverse problems with a ratio between two kinds of cube (m = n − 2).
    const KINDS = {
        none: { f: e => e ** 3, tex: 'm^3', words: 'no paint at all' },
        one: { f: e => 6 * e * e, tex: '6m^2', words: 'exactly 1 painted face' },
        two: { f: e => 12 * e, tex: '12m', words: 'exactly 2 painted faces' },
        three: { f: () => 8, tex: '8', words: 'exactly 3 painted faces' },
    };
    const RATIOS = [];
    for (let n = 3; n <= 10; n++) for (const x of Object.keys(KINDS)) for (const y of Object.keys(KINDS)) {
        if (x === y) continue;
        const e = n - 2, cx = KINDS[x].f(e), cy = KINDS[y].f(e);
        if (cx % cy !== 0) continue;
        const r = cx / cy;
        if (r > 12) continue;
        let hits = 0;
        for (let t = 1; t <= 80; t++) if (KINDS[x].f(t) === r * KINDS[y].f(t)) hits++;
        if (hits === 1) RATIOS.push({ n, x, y, r });
    }

    // ── Solids and numbers used in the tutorial and the examples ─────────
    const N4 = () => solid(4, 4, 4);
    const R_CORNER = remove(N4(), [0, 3, 3], 1), R_EDGE = remove(N4(), [1, 3, 3], 1), R_FACE = remove(N4(), [1, 3, 1], 1);
    [[R_CORNER, 0], [R_EDGE, 2], [R_FACE, 4]].forEach(([V, d], i) => same(surface(V), 96 + d, `tutorial removal ${i}`));
    const B6 = [remove(solid(6, 6, 6), [0, 4, 4], 2), remove(solid(6, 6, 6), [2, 4, 4], 2), remove(solid(6, 6, 6), [2, 4, 2], 2)];
    B6.forEach((V, i) => same(surface(V), 216 + [0, 8, 16][i], `tutorial big removal ${i}`));
    const ST1 = build([{ p: [0, 0, 0], k: 4 }, { p: [1, 1, 4], k: 2, g: 1 }]);
    same(surface(ST1), 96 + 16, 'tutorial stick');
    const TOWER = build([{ p: [0, 0, 0], k: 3 }, { p: [0, 1, 3], k: 2, g: 1 }, { p: [1, 2, 5], k: 1, g: 2 }]);
    same(surface(TOWER), 54 + 16 + 4, 'tutorial tower');
    const ROW = build([{ p: [0, 0, 0], k: 3 }, { p: [3, 1, 0], k: 2, g: 1 }, { p: [5, 2, 0], k: 1, g: 2 }]);
    same(surface(ROW), 54 + 16 + 4, 'tutorial row');
    const T3 = blockTally(3, 3, 3).n;
    const TB = blockTally(5, 3, 4), FB = formula(5, 3, 4);
    const E1 = blockTally(5, 5, 5).n;
    const E2 = { a: 6, b: 4, c: 3 }, E2T = blockTally(6, 4, 3), E2F = formula(6, 4, 3);
    const SF = { a: 4, b: 3, c: 3, f: ['top', 'front'] };
    const SFP = axisPaint(SF.f), SFD = [SF.a, SF.b, SF.c], SFT = blockTally(SF.a, SF.b, SF.c, SF.f).n;
    [0, 1, 2, 3].forEach(k => { same(TB.n[k], FB[k], 'tutorial block'); same(E2T.n[k], E2F[k], 'example block'); same(SFT[k], positions(SFD, SFP, k).value, 'tutorial some'); });
    const EX1 = remove(solid(5, 5, 5), [2, 4, 4], 1);
    const EX2 = B6[2];
    const EX3 = build([{ p: [0, 0, 0], k: 4 }, { p: [1, 1, 4], k: 2, g: 1 }, { p: [4, 1, 1], k: 2, g: 1 }]);
    same(surface(EX3), 96 + 32, 'example sticks');

    CA.register({
        id: 15,

        tutorial: [
            {
                h: 'Taking one small cube away',
                html: R`
                <p>A ${m(prod(4, 4, 4))} cube built from small cubes with 1 cm edges has surface area
                   ${m(`6${TIMES}4${TIMES}4=96`)} cm². What happens when one small cube is pulled out? It depends on
                   <strong>where</strong> it comes from.</p>
                ${F.row(F.cap(drawSolid(R_CORNER, { size: 17 }), 'corner: 96'), F.cap(drawSolid(R_EDGE, { size: 17 }), 'edge: 98'), F.cap(drawSolid(R_FACE, { size: 17 }), 'face: 100'))}
                <p>Removing a cube takes away the faces it showed on the outside, and uncovers the faces of its
                   neighbours that it used to hide (the grey walls of the hole).</p>
                <table>
                    <tr><th>Removed from…</th><th>Outside faces lost</th><th>Hidden faces uncovered</th><th>Change</th></tr>
                    <tr><td>a corner</td><td>3</td><td>3</td><td>no change</td></tr>
                    <tr><td>an edge</td><td>2</td><td>4</td><td>2 extra small faces</td></tr>
                    <tr><td>a face</td><td>1</td><td>5</td><td>4 extra small faces</td></tr>
                </table>
                <div class="ca-key"><strong>Key idea.</strong> Corner: the surface area is not changed. Edge: the area of
                   2 small faces is added. Face: the area of 4 small faces is added.</div>
                <div class="ca-tip"><strong>See it with views (Lessons 1 and 14).</strong> Pulling out a corner cube
                   leaves the front, left and top views unchanged, so \(S=2\times(\text{front}+\text{left}+\text{top})\)
                   cannot change. From an edge, one view gets a square with a 2 in it; from a face, two views do.</div>`,
            },
            {
                h: 'Bigger pieces, and several at once',
                html: R`
                <p>The same reasoning works when the piece removed is a whole cube of edge \(k\). Each of its faces is now
                   a \(k\times k\) square, so every "small face" in the rule has area \(k^2\).</p>
                ${F.row(F.cap(drawSolid(B6[0], { size: 13, grid: false }), 'corner: 216'), F.cap(drawSolid(B6[1], { size: 13, grid: false }), 'edge: 216 + 8'), F.cap(drawSolid(B6[2], { size: 13, grid: false }), 'face: 216 + 16'))}
                <div class="ca-formula">\[ \text{corner: } S \qquad \text{edge: } S + 2k^2 \qquad \text{face: } S + 4k^2 \]</div>
                <p>For a ${m(prod(6, 6, 6))} cm cube (\(S=216\) cm²) and a 2 cm cube removed: corner 216 cm²,
                   edge ${m(`216+2${TIMES}4=${surface(B6[1])}`)} cm², face ${m(`216+4${TIMES}4=${surface(B6[2])}`)} cm².</p>
                <p><strong>Several pieces?</strong> If the holes do not touch each other, add up the changes one hole at
                   a time. Taking a cube from each of the 8 corners changes nothing; taking one from the middle of each of
                   the 6 faces adds \(6\times4k^2=24k^2\).</p>
                <div class="ca-warn"><strong>Read "edge" and "face" carefully.</strong> The rule for an edge needs the
                   piece to stay away from the corners, and the rule for a face needs it to stay away from the edges. A
                   piece that reaches a corner is a corner piece, whatever the question calls it.</div>`,
            },
            {
                h: 'Sticking a small cube on',
                html: R`
                <p>Now go the other way: glue a small cube of edge \(k\) onto a face of a big cube, so that one of its
                   faces lies flat on the big face.</p>
                ${F.row(F.cap(drawSolid(ST1, { size: 18, grid: false, groups: true }), '4 cm cube + 2 cm cube'))}
                <p>The small cube's bottom face is glued down and hidden, and it hides a ${m('k\\times k')} square of
                   the big cube. But its own top face is exactly the same size, so it "replaces" the square that was hidden.
                   What is really new is its <strong>four side faces</strong>.</p>
                <div class="ca-key"><strong>Key idea.</strong> Each time a small cube is stuck onto a large one with
                   one face overlapping, the area of <strong>4 faces of the small cube</strong> is added:
                   \(S_{\text{new}} = S_{\text{big}} + 4k^2\). Here \(96+4\times4=${surface(ST1)}\) cm².</div>
                ${F.row(F.cap(drawSolid(TOWER, { size: 16, grid: false, groups: true }), 'A tower: 3, 2, 1'), F.cap(drawSolid(ROW, { size: 16, grid: false, groups: true }), 'A row: 3, 2, 1'))}
                <p>Stack cubes with edges 3, 2 and 1 cm: start with the biggest and add 4 faces of each smaller one:
                   ${m(`6${TIMES}9+4${TIMES}4+4${TIMES}1=${surface(TOWER)}`)} cm². Standing them in a row on the table
                   gives the same answer, as long as each small cube touches a bigger one with a whole face.</p>
                <div class="ca-tip"><strong>Quick check for a tower.</strong> From above, a tower looks like its bottom
                   cube; from the front or the left it looks like the cubes side by side. With views:
                   \(2\times(9+14+14)=74\). ✓</div>`,
            },
            {
                h: 'Paint the big cube, then cut it up',
                html: R`
                <p>Take a big cube made of 27 small cubes, ${m(prod(3, 3, 3))}. Paint the whole outside and pull it
                   apart. Some small cubes have paint on three faces, some on two, some on one, and one has none.</p>
                ${F.row(F.cap(kindFig(3, 3, 3, { size: 30 }), 'Coloured by the number of painted faces'), F.cap(kindFig(5, 5, 5, { size: 18 }), '5 × 5 × 5'))}
                <table>
                    <tr><th>Kind of small cube</th><th>Where it sits</th><th>Painted faces</th><th>${m(prod(3, 3, 3))}</th><th>\(n\times n\times n\)</th></tr>
                    <tr><td>${swatch(KIND[3].front)} corner cube</td><td>at a corner</td><td>3</td><td>${T3[3]}</td><td>\(8\)</td></tr>
                    <tr><td>${swatch(KIND[2].front)} edge cube</td><td>on an edge, not a corner</td><td>2</td><td>${T3[2]}</td><td>\(12(n-2)\)</td></tr>
                    <tr><td>${swatch(KIND[1].front)} face cube</td><td>in the middle of a face</td><td>1</td><td>${T3[1]}</td><td>\(6(n-2)^2\)</td></tr>
                    <tr><td>${swatch(KIND[0].front)} inside cube</td><td>hidden inside</td><td>0</td><td>${T3[0]}</td><td>\((n-2)^3\)</td></tr>
                </table>
                <div class="ca-key"><strong>Why.</strong> A cube has 8 corners, 12 edges and 6 faces. Each edge holds
                   \(n\) small cubes, but its two ends are corners, so \(n-2\) are left. Each face is an \(n\times n\)
                   square; take off its rim and an \((n-2)\times(n-2)\) square is left. Peel off the whole painted skin
                   and a cube of edge \(n-2\) is left.</div>
                <div class="ca-tip"><strong>Always check.</strong> The four counts must add up to \(n^3\). For \(n=5\):
                   ${m(`${E1[3]}+${E1[2]}+${E1[1]}+${E1[0]}=${sum(E1)}`)}.</div>`,
            },
            {
                h: 'Painting an a × b × c block',
                html: R`
                <p>A block \(a\) cubes long, \(b\) deep and \(c\) high (all bigger than 1) works the same way, but its 12
                   edges come in three lengths (four of each) and its 6 faces in three sizes (two of each).</p>
                ${F.row(F.cap(kindFig(5, 3, 4, { size: 22 }), 'A 5 × 3 × 4 block'))}
                <table>
                    <tr><th>Painted faces</th><th>Number of small cubes</th></tr>
                    <tr><td>3</td><td>\(8\)</td></tr>
                    <tr><td>2</td><td>\((a-2)\times4+(b-2)\times4+(c-2)\times4\)</td></tr>
                    <tr><td>1</td><td>\(2(a-2)(b-2)+2(a-2)(c-2)+2(b-2)(c-2)\)</td></tr>
                    <tr><td>0</td><td>\((a-2)(b-2)(c-2)\)</td></tr>
                </table>
                <p>For the ${m(prod(5, 3, 4))} block, \(a-2=3\), \(b-2=1\), \(c-2=2\): 8 cubes with three painted faces,
                   ${m(`3${TIMES}4+1${TIMES}4+2${TIMES}4=${TB.n[2]}`)} with two, ${m(`2${TIMES}3+2${TIMES}6+2${TIMES}2=${TB.n[1]}`)} with one
                   and ${m(prod(3, 1, 2) + '=' + TB.n[0])} with none. Check: ${m(`8+${TB.n[2]}+${TB.n[1]}+${TB.n[0]}=${TB.cubes}`)}. ✓</p>
                <div class="ca-warn"><strong>A side of length 2.</strong> Then \(a-2=0\) and the block has no inside cubes
                   and no face cubes on the narrow faces — the formulas still give the right answer, because the zeros
                   take care of it. (A side of length 1 is different: every cube is then painted on both big faces.)</div>`,
            },
            {
                h: 'Working backwards and reading the words',
                html: R`
                <p>If you are told how many cubes of one kind there are, find \(n\) first. Write \(m=n-2\) and the four
                   kinds are \(8,\ 12m,\ 6m^2,\ m^3\).</p>
                <table>
                    <tr><th>You are told</th><th>So</th></tr>
                    <tr><td>64 small cubes have no paint</td><td>\(m^3=64\), so \(m=4\) and \(n=6\)</td></tr>
                    <tr><td>54 small cubes have exactly 1 painted face</td><td>\(6m^2=54\), so \(m=3\) and \(n=5\)</td></tr>
                    <tr><td>60 small cubes have exactly 2 painted faces</td><td>\(12m=60\), so \(m=5\) and \(n=7\)</td></tr>
                </table>
                <div class="ca-warn"><strong>"Exactly", "at least", "at most".</strong> These are three different questions.
                   "At least one painted face" means every cube that is not inside: \(n^3-(n-2)^3\). "At least two" means
                   the edge cubes and the corner cubes together.</div>`,
            },
            {
                h: 'When only some faces are painted',
                html: R`
                <p>A block standing on a table cannot be painted underneath; sometimes only the top and the front are
                   painted. Then count positions, one direction at a time.</p>
                ${F.row(F.cap(paintFig(SF.a, SF.b, SF.c, SF.f, { size: 26 }), 'Painted on the top and the front only'))}
                <div class="ca-key"><strong>Count positions.</strong> For each direction (length, depth, height) ask how
                   many positions touch a painted face. A small cube's number of painted faces is the number of directions
                   in which it touches paint.</div>
                <p>Here: length ${SFP[0]} of ${SFD[0]} (left and right not painted), depth ${SFP[1]} of ${SFD[1]} (the front),
                   height ${SFP[2]} of ${SFD[2]} (the top). Two painted faces: ${m(positions(SFD, SFP, 2).tex)}; one:
                   ${m(positions(SFD, SFP, 1).tex)}; none: ${m(positions(SFD, SFP, 0).tex)}. Check:
                   ${m(`${SFT[2]}+${SFT[1]}+${SFT[0]}=${SF.a * SF.b * SF.c}`)}. ✓</p>`,
            },
        ],

        summary: [
            { topic: 'Find the surface area after removing a small cube from a large cube', points: [
                'Removing from a corner: the surface area is not changed.',
                'Removing from an edge: the area of 2 extra small faces is added.',
                'Removing from a face: the area of 4 extra small faces is added.',
            ] },
            { topic: 'Find the surface area after sticking a small cube to a large cube', points: [
                'Each time a small cube is stuck to a large one with an overlapping face, the area of 4 faces of the small cube is newly added.',
            ] },
            { topic: 'Count the cubes after coloring an a × b × c rectangular prism (a, b, c > 1)', points: [
                '3 faces colored: 8',
                R`2 faces colored: \((a-2)\times4+(b-2)\times4+(c-2)\times4\)`,
                R`1 face colored: \(2(a-2)(b-2)+2(a-2)(c-2)+2(b-2)(c-2)\)`,
                R`0 faces colored: \((a-2)(b-2)(c-2)\)`,
            ] },
        ],

        examples: [
            {
                title: 'One small cube from an edge',
                q: R`A ${m(prod(5, 5, 5))} cube is built from small cubes with 1 cm edges. One small cube is removed from the middle of the top front edge, as shown. What is the surface area now?`,
                fig: F.row(drawSolid(EX1, { size: 20 })),
                steps: [
                    R`Before: ${m(`6${TIMES}5${TIMES}5=150`)} cm².`,
                    R`The cube came from an edge: it showed 2 faces on the outside (top and front) and hid 4 faces of its neighbours.`,
                    R`So 2 extra small faces are added: ${m(`150-2+4=150+2=${surface(EX1)}`)} cm².`,
                ],
                answer: R`${surface(EX1)} cm²`,
            },
            {
                title: 'A bigger cube from a face',
                q: R`A cube with edges of 6 cm has a cube with edges of 2 cm cut out of the middle of its front face, as shown. What is the surface area of what is left?`,
                fig: F.row(drawSolid(EX2, { size: 20, grid: false })),
                steps: [
                    R`Before: ${m(`6${TIMES}6${TIMES}6=216`)} cm².`,
                    R`Cut from a face: the area of 4 faces of the small cube is added. Each face is ${m(`2${TIMES}2=4`)} cm².`,
                    R`${m(`216+4${TIMES}4=${surface(EX2)}`)} cm².`,
                ],
                answer: R`${surface(EX2)} cm²`,
            },
            {
                title: 'Sticking cubes on',
                q: R`Two cubes with edges of 2 cm are glued onto a cube with edges of 4 cm — one on the top, one on the right-hand face — as shown. What is the total surface area?`,
                fig: F.row(drawSolid(EX3, { size: 20, grid: false, groups: true })),
                steps: [
                    R`The big cube: ${m(`6${TIMES}4${TIMES}4=96`)} cm².`,
                    R`Each small cube adds 4 of its faces: ${m(`4${TIMES}2${TIMES}2=16`)} cm².`,
                    R`${m(`96+16+16=${surface(EX3)}`)} cm².`,
                ],
                answer: R`${surface(EX3)} cm²`,
            },
            {
                title: 'A tower of three cubes',
                q: R`Cubes with edges of 3 cm, 2 cm and 1 cm are stacked into a tower, each standing completely on the one below, as shown. Find the surface area of the tower (including the bottom).`,
                fig: F.row(drawSolid(TOWER, { size: 18, grid: false, groups: true })),
                steps: [
                    R`Start with the biggest cube: ${m(`6${TIMES}3^2=54`)} cm².`,
                    R`The 2 cm cube adds 4 faces: ${m(`4${TIMES}2^2=16`)}. The 1 cm cube adds ${m(`4${TIMES}1^2=4`)}.`,
                    R`${m(`54+16+4=${surface(TOWER)}`)} cm².`,
                ],
                answer: R`${surface(TOWER)} cm²`,
            },
            {
                title: 'A painted 5 × 5 × 5 cube',
                q: R`A cube with edges of 5 cm is painted on all six faces and then cut into 125 cubes with edges of 1 cm. How many small cubes have 3, 2, 1 and 0 painted faces?`,
                fig: F.row(kindFig(5, 5, 5, { size: 20 })),
                steps: [
                    R`Here \(n=5\), so \(n-2=3\). 3 painted faces: the ${E1[3]} corners.`,
                    R`2 painted faces: 3 on each of the 12 edges: ${m(prod(12, 3) + '=' + E1[2])}.`,
                    R`1 painted face: a ${m(prod(3, 3))} square on each of the 6 faces: ${m(prod(6, 9) + '=' + E1[1])}.`,
                    R`No paint: the ${m(prod(3, 3, 3))} cube inside: ${m('3^3=' + E1[0])}. Check: ${m(`${E1[3]}+${E1[2]}+${E1[1]}+${E1[0]}=${sum(E1)}`)}. ✓`,
                ],
                answer: R`${E1[3]}, ${E1[2]}, ${E1[1]} and ${E1[0]}`,
            },
            {
                title: 'A painted rectangular block',
                q: R`A block ${E2.a} cubes long, ${E2.b} cubes deep and ${E2.c} cubes high is painted on all six faces and taken apart. How many small cubes have exactly 2 painted faces? Exactly 1? None?`,
                fig: F.row(kindFig(E2.a, E2.b, E2.c, { size: 20 })),
                steps: [
                    R`Take 2 off each dimension: ${E2.a - 2}, ${E2.b - 2} and ${E2.c - 2}.`,
                    R`2 painted faces: ${m(`${E2.a - 2}${TIMES}4+${E2.b - 2}${TIMES}4+${E2.c - 2}${TIMES}4=${E2T.n[2]}`)}.`,
                    R`1 painted face: ${m(`2${TIMES}${E2.a - 2}${TIMES}${E2.b - 2}+2${TIMES}${E2.a - 2}${TIMES}${E2.c - 2}+2${TIMES}${E2.b - 2}${TIMES}${E2.c - 2}=${E2T.n[1]}`)}.`,
                    R`No paint: ${m(prod(E2.a - 2, E2.b - 2, E2.c - 2) + '=' + E2T.n[0])}. Check: ${m(`8+${E2T.n[2]}+${E2T.n[1]}+${E2T.n[0]}=${E2T.cubes}`)}. ✓`,
                ],
                answer: R`${E2T.n[2]}, ${E2T.n[1]} and ${E2T.n[0]}`,
            },
        ],

        practice: [
            // ── Removing cubes ──
            {
                id: 'remove-one', name: 'Remove one small cube', level: 1,
                gen(rng) {
                    const n = rng.int(3, 7), kind = rng.pick(['corner', 'edge', 'edge', 'face', 'face']);
                    const V = remove(solid(n, n, n), spot(rng, n, 1, kind), 1);
                    const before = 6 * n * n, S = same(surface(V), before + EXTRA[kind], 'remove-one');
                    const askChange = rng.bool(0.3);
                    return {
                        q: `A ${n} × ${n} × ${n} cube is built from ${n ** 3} small cubes with 1 cm edges. One small cube is removed ${WHERE[kind]}, as shown. ${askChange ? 'By how many square centimetres does the surface area increase? (Write 0 if it does not change.)' : 'What is the surface area of the solid now?'}`,
                        fig: F.row(drawSolid(V)),
                        ans: CA.num(askChange ? S - before : S, 'cm²'),
                        sol: `Before: ${m(`6${TIMES}${n}${TIMES}${n}=${before}`)} cm². ` + (kind === 'corner' ? 'From a corner the cube loses 3 outside faces and uncovers 3: no change.'
                            : kind === 'edge' ? 'From an edge it loses 2 outside faces and uncovers 4: 2 extra small faces.'
                                : 'From a face it loses 1 outside face and uncovers 5: 4 extra small faces.') +
                            (askChange ? ` The increase is ${S - before} cm².` : ` ${m(`${before}+${S - before}=${S}`)} cm².`),
                    };
                },
            },
            {
                id: 'remove-big', name: 'Cut a smaller cube out', level: 2,
                gen(rng) {
                    const k = rng.int(1, 3), N = rng.int(k + 2, Math.min(10, 3 * k + 3)), kind = rng.pick(['corner', 'edge', 'edge', 'face', 'face']);
                    const V = remove(solid(N, N, N), spot(rng, N, k, kind), k);
                    const before = 6 * N * N, S = same(surface(V), before + EXTRA[kind] * k * k, 'remove-big');
                    return {
                        q: `A solid cube has edges of ${N} cm. A cube with edges of ${k} cm is cut out ${WHERE[kind]}, as shown. What is the surface area of what is left?`,
                        fig: F.row(drawSolid(V, { grid: false })),
                        ans: CA.num(S, 'cm²'),
                        sol: `Before: ${m(`6${TIMES}${N}^2=${before}`)} cm². ` + (kind === 'corner' ? 'Cut from a corner: no change.'
                            : R`Cut from ${kind === 'edge' ? 'an edge: 2' : 'a face: 4'} faces of the small cube are added, each ${m(`${k}^2=${k * k}`)} cm²: ${m(`${before}+${EXTRA[kind]}${TIMES}${k * k}=${S}`)}.`),
                    };
                },
            },
            {
                id: 'remove-several', name: 'Remove several cubes', level: 2,
                gen(rng) {
                    for (;;) {
                        const n = rng.int(4, 6), count = rng.int(2, 4), V = solid(n, n, n), kinds = [], ps = [];
                        for (let i = 0; i < count; i++) {
                            const kind = rng.pick(['corner', 'edge', 'face']), p = spot(rng, n, 1, kind);
                            if (ps.some(q => near(p, 1, q, 1))) break;
                            ps.push(p); kinds.push(kind); remove(V, p, 1);
                        }
                        if (ps.length < count || new Set(kinds).size < 2) continue;
                        const before = 6 * n * n, extra = sum(kinds.map(k => EXTRA[k])), S = same(surface(V), before + extra, 'remove-several');
                        const cnt = k => kinds.filter(x => x === k).length;
                        const parts = ['corner', 'edge', 'face'].filter(k => cnt(k)).map(k => `${cnt(k)} from ${k === 'corner' ? (cnt(k) > 1 ? 'corners' : 'a corner') : k === 'edge' ? (cnt(k) > 1 ? 'edges (not at corners)' : 'an edge (not at a corner)') : (cnt(k) > 1 ? 'faces (not on edges)' : 'a face (not on an edge)')}`);
                        return {
                            q: `A ${n} × ${n} × ${n} cube is built from small cubes with 1 cm edges. ${['', '', 'Two', 'Three', 'Four'][count]} small cubes are removed — ${list(parts)} — as shown. No two of the holes touch. What is the surface area now?`,
                            fig: F.row(drawSolid(V)),
                            ans: CA.num(S, 'cm²'),
                            sol: R`Before: ${m(`6${TIMES}${n}^2=${before}`)}. Each corner adds 0, each edge 2 and each face 4: ${m(`${before}+${cnt('edge')}${TIMES}2+${cnt('face')}${TIMES}4=${S}`)} cm².`,
                        };
                    }
                },
            },
            {
                id: 'remove-challenge', name: 'Removing cubes: challenge', level: 3,
                gen(rng) {
                    const type = rng.pick(['reverse', 'reverse', 'all', 'all', 'all']);
                    if (type === 'reverse') {
                        const k = rng.int(1, 4), kind = rng.pick(['edge', 'face']), N = rng.int(k + 2, k + 6);
                        const V = remove(solid(N, N, N), spot(rng, N, k, kind), k), S = same(surface(V), 6 * N * N + EXTRA[kind] * k * k, 'remove-challenge reverse');
                        return {
                            q: `A small cube is cut out ${WHERE[kind]} of a solid cube with edges of ${N} cm. The surface area of what is left is ${S} cm². What is the edge length of the small cube?`,
                            ans: CA.num(k, 'cm'),
                            sol: R`The big cube had ${m(`6${TIMES}${N}^2=${6 * N * N}`)} cm². From ${kind === 'edge' ? 'an edge the area of 2' : 'a face the area of 4'} small faces is added: ${m(`${EXTRA[kind]}k^2=${S}-${6 * N * N}=${S - 6 * N * N}`)}, so ${m(`k^2=${k * k}`)} and \(k=${k}\).`,
                        };
                    }
                    const n = rng.pick([5, 7]), V = solid(n, n, n), mid = (n - 1) / 2;
                    const sets = rng.pick([['corner', 'face'], ['corner', 'edge'], ['edge', 'face'], ['corner', 'edge', 'face'], ['face'], ['edge']]);
                    const cells = [];
                    for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) {
                        const ends = [x, y, z].filter(v => v === 0 || v === n - 1).length, mids = [x, y, z].filter(v => v === mid).length;
                        if ((ends === 3 && sets.includes('corner')) || (ends === 2 && mids === 1 && sets.includes('edge')) || (ends === 1 && mids === 2 && sets.includes('face'))) cells.push([x, y, z]);
                    }
                    cells.forEach(p => remove(V, p, 1));
                    const add = (sets.includes('edge') ? 12 * 2 : 0) + (sets.includes('face') ? 6 * 4 : 0);
                    const S = same(surface(V), 6 * n * n + add, 'remove-challenge all');
                    const words = { corner: 'each of the 8 corners', edge: 'the middle of each of the 12 edges', face: 'the centre of each of the 6 faces' };
                    return {
                        q: `A ${n} × ${n} × ${n} cube is built from small cubes with 1 cm edges. One small cube is removed from ${list(sets.map(s => words[s]))}. (The picture shows the parts you can see.) What is the surface area of the solid now?`,
                        fig: F.row(drawSolid(V)),
                        ans: CA.num(S, 'cm²'),
                        sol: R`Before: ${m(`6${TIMES}${n}^2=${6 * n * n}`)}. The holes do not touch. ` + sets.map(s => (s === 'corner' ? 'Corners add nothing.' : s === 'edge' ? R`Edges add ${m(`12${TIMES}2=24`)}.` : R`Faces add ${m(`6${TIMES}4=24`)}.`)).join(' ') + ` Total ${m(`${6 * n * n}+${add}=${S}`)} cm².`,
                    };
                },
            },
            // ── Sticking cubes ──
            {
                id: 'stick-one', name: 'Stick one small cube on', level: 1,
                gen(rng) {
                    const N = rng.int(3, 8), k = rng.int(1, N - 1), face = rng.pick(STICK_FACES);
                    const V = build([{ p: [0, 0, 0], k: N }, { p: stickSpot(rng, N, k, face, rng.bool()), k, g: 1 }]);
                    const S = same(surface(V), 6 * N * N + 4 * k * k, 'stick-one'), askChange = rng.bool(0.3);
                    const fname = face === 'right' ? 'right-hand' : face;
                    return {
                        q: `A cube with edges of ${k} cm is glued onto the ${fname} face of a cube with edges of ${N} cm, as shown, so that one whole face of the small cube touches the big cube. ${askChange ? 'By how much is the total surface area bigger than the surface area of the big cube alone?' : 'What is the surface area of the new solid?'}`,
                        fig: F.row(drawSolid(V, { grid: false, groups: true })),
                        ans: CA.num(askChange ? 4 * k * k : S, 'cm²'),
                        sol: R`Sticking on a small cube adds the area of 4 of its faces: ${m(`4${TIMES}${k}^2=${4 * k * k}`)} cm².` + (askChange ? '' : R` ${m(`6${TIMES}${N}^2+${4 * k * k}=${6 * N * N}+${4 * k * k}=${S}`)} cm².`),
                    };
                },
            },
            {
                id: 'stick-tower', name: 'Towers and rows of cubes', level: 2,
                gen(rng) {
                    for (;;) {
                        const count = rng.pick([2, 3, 3, 3, 4]);
                        const edges = rng.sample([1, 2, 3, 4, 5, 6], count).sort((x, y) => y - x);
                        const row = rng.bool(0.35);
                        if (sum(edges) > (row ? 12 : 11)) continue;
                        const boxes = [];
                        let base = [0, 0, 0];
                        edges.forEach((k, i) => {
                            if (i === 0) { boxes.push({ p: [0, 0, 0], k }); return; }
                            const prev = boxes[i - 1], P = prev.k;
                            const off = () => ((P - k) % 2 === 0 && rng.bool(0.6) ? (P - k) / 2 : rng.int(0, P - k));
                            base = row ? [prev.p[0] + P, prev.p[1] + P - k, 0] : [prev.p[0] + off(), prev.p[1] + off(), prev.p[2] + P];
                            boxes.push({ p: base, k, g: i });
                        });
                        const V = build(boxes);
                        const S = same(surface(V), 6 * edges[0] ** 2 + 4 * sum(edges.slice(1).map(k => k * k)), 'stick-tower');
                        const ed = list(edges.map(k => `${k} cm`));
                        return {
                            q: row ? `Cubes with edges of ${ed} stand in a row on a table, from biggest to smallest, each one pushed against the one before so that a whole face of the smaller cube touches it, as shown. What is the total surface area of the solid (including the bottom)?`
                                : `Cubes with edges of ${ed} are stacked into a tower, each standing completely on the one below, as shown. What is the total surface area of the tower (including the bottom)?`,
                            fig: F.row(drawSolid(V, { grid: false, groups: true })),
                            ans: CA.num(S, 'cm²'),
                            sol: R`Start with the biggest cube, ${m(`6${TIMES}${edges[0]}^2=${6 * edges[0] ** 2}`)}; each smaller cube adds 4 of its faces: ${m(`${6 * edges[0] ** 2}+` + edges.slice(1).map(k => `4${TIMES}${k * k}`).join('+') + `=${S}`)} cm².`,
                        };
                    }
                },
            },
            {
                id: 'stick-several', name: 'Several cubes stuck on', level: 2,
                gen(rng) {
                    const N = rng.int(3, 7), k = rng.int(1, Math.min(3, N - 1)), count = rng.int(2, 4);
                    const faces = rng.sample(STICK_FACES, count);
                    const V = build([{ p: [0, 0, 0], k: N }, ...faces.map(f => ({ p: stickSpot(rng, N, k, f, true), k, g: 1 }))]);
                    const S = same(surface(V), 6 * N * N + count * 4 * k * k, 'stick-several');
                    const fn = faces.map(f => (f === 'right' ? 'right-hand' : f));
                    return {
                        q: `${count === 2 ? 'Two' : count === 3 ? 'Three' : 'Four'} cubes with edges of ${k} cm are glued onto a cube with edges of ${N} cm — one on each of the ${list(fn)} faces — as shown. What is the total surface area?`,
                        fig: F.row(drawSolid(V, { grid: false, groups: true })),
                        ans: CA.num(S, 'cm²'),
                        sol: R`The big cube: ${m(`6${TIMES}${N}^2=${6 * N * N}`)}. Each small cube adds 4 faces, ${m(`4${TIMES}${k * k}=${4 * k * k}`)}: ${m(`${6 * N * N}+${count}${TIMES}${4 * k * k}=${S}`)} cm².`,
                    };
                },
            },
            {
                id: 'stick-challenge', name: 'Cut, stick and work backwards', level: 3,
                gen(rng) {
                    const type = rng.pick(['move', 'move', 'reverse', 'staircase']);
                    if (type === 'move') {
                        const k = rng.int(1, 2), N = k + 2 * rng.int(2, 3), kind = rng.pick(['corner', 'edge', 'face']);
                        let p;
                        do { p = spot(rng, N, k, kind); } while (p[2] === N - k);   // not on the top face, so the two changes do not meet
                        const W = solid(N, N, N + k, 0), o = (N - k) / 2;
                        fill(W, [0, N], [0, N], [0, N], 1, 0);
                        fill(W, [p[0], p[0] + k], [p[1], p[1] + k], [p[2], p[2] + k], 0);
                        fill(W, [o, o + k], [o, o + k], [N, N + k], 1, 1);
                        const S = same(surface(W), 6 * N * N + EXTRA[kind] * k * k + 4 * k * k, 'stick-challenge move');
                        return {
                            q: `A cube with edges of ${k} cm is cut out ${WHERE[kind]} of a cube with edges of ${N} cm, and then glued onto the middle of the top face, as shown. What is the surface area of the new solid?`,
                            fig: F.row(drawSolid(W, { grid: false, groups: true })),
                            ans: CA.num(S, 'cm²'),
                            sol: R`Start: ${m(`6${TIMES}${N}^2=${6 * N * N}`)}. Cutting from ${kind === 'corner' ? 'a corner adds nothing' : kind === 'edge' ? R`an edge adds ${m(`2${TIMES}${k * k}`)}` : R`a face adds ${m(`4${TIMES}${k * k}`)}`}; sticking it on adds ${m(`4${TIMES}${k * k}`)}. ${m(`${6 * N * N}+${EXTRA[kind] * k * k}+${4 * k * k}=${S}`)} cm².`,
                        };
                    }
                    if (type === 'reverse') {
                        const N = rng.int(5, 10), k = rng.int(1, N - 2);
                        const V = build([{ p: [0, 0, 0], k: N }, { p: stickSpot(rng, N, k, 'top', true), k, g: 1 }]);
                        const S = same(surface(V), 6 * N * N + 4 * k * k, 'stick-challenge reverse');
                        return {
                            q: `A small cube is glued onto the top of a cube with edges of ${N} cm (a whole face of the small cube touches the big one). The new solid has a surface area of ${S} cm². What is the edge length of the small cube?`,
                            ans: CA.num(k, 'cm'),
                            sol: R`The big cube alone: ${m(`6${TIMES}${N}^2=${6 * N * N}`)}. The small cube adds 4 faces: ${m(`4k^2=${S}-${6 * N * N}=${4 * k * k}`)}, so ${m(`k^2=${k * k}`)} and \(k=${k}\) cm.`,
                        };
                    }
                    const top = rng.int(3, 5), edges = range(top).map(i => top - i);
                    const boxes = edges.map((k, i) => ({ p: [0, 0, sum(edges.slice(0, i))], k, g: i % 4 }));
                    const V = build(boxes), rest = edges.slice(1);
                    const S = same(surface(V), 6 * top * top + 4 * sum(rest.map(k => k * k)), 'stick-challenge staircase');
                    return {
                        q: `Cubes with edges of ${list(edges.slice().reverse().map(k => `${k}`))} cm are stacked into a tower, biggest at the bottom, with their back left edges lined up, as shown. What is the surface area of the tower?`,
                        fig: F.row(drawSolid(V, { grid: false, groups: true })),
                        ans: CA.num(S, 'cm²'),
                        sol: R`Biggest cube: ${m(`6${TIMES}${top}^2=${6 * top * top}`)}. Each of the others adds 4 faces: ${m(`4${TIMES}(${rest.map(k => `${k}^2`).join('+')})=4${TIMES}${sum(rest.map(k => k * k))}=${4 * sum(rest.map(k => k * k))}`)}. Total ${m(`${6 * top * top}+${4 * sum(rest.map(k => k * k))}=${S}`)} cm².`,
                    };
                },
            },
            // ── Painted cubes ──
            {
                id: 'cube-count-k', name: 'Painted cube: count one kind', level: 1,
                gen(rng) {
                    const n = rng.int(3, 10), k = rng.pick([0, 0, 1, 1, 1, 2, 2, 2, 3]);
                    const t = blockTally(n, n, n).n;
                    const p = {
                        q: `${cubeIntro(rng, n)} How many of the small cubes have <strong>${kWords(k)}</strong>?`,
                        ans: cubesAns(same(t[k], formula(n, n, n)[k], 'cube-count-k')),
                        sol: cubeSol(n, k),
                    };
                    if (n <= 6) p.fig = F.row(blockFig(n, n, n));
                    return p;
                },
            },
            {
                id: 'marked-cube', name: 'How many faces of this cube are painted?', level: 1,
                gen(rng) {
                    const a = rng.int(3, 5), b = rng.int(2, 4), c = rng.int(2, 4);
                    const cells = blockCells(a, b, c), per = paint(cells);
                    const visible = cells.map((cell, i) => i).filter(i => cells[i][0] === 0 || cells[i][1] === b - 1 || cells[i][2] === c - 1);
                    const i = rng.pick(visible), [x, y, z] = cells[i];
                    const on = [];
                    if (z === c - 1) on.push('top');
                    if (z === 0) on.push('bottom');
                    if (y === b - 1) on.push('front');
                    if (y === 0) on.push('back');
                    if (x === 0) on.push('left');
                    if (x === a - 1) on.push('right');
                    const hidden = on.filter(f => ['bottom', 'back', 'right'].includes(f));
                    return {
                        q: `A block ${a} cubes long, ${b} cubes deep and ${c} cubes high is painted on all six faces — including the back, the right side and the bottom, which you cannot see. How many faces of the <strong>orange</strong> small cube are painted?`,
                        fig: F.row(markFig(a, b, c, [x, y, z])),
                        ans: facesAns(same(per[i], on.length, 'marked-cube')),
                        sol: `The marked cube lies on the ${list(on)} face${on.length === 1 ? '' : 's'} of the block, so ${on.length} of its faces ${on.length === 1 ? 'is' : 'are'} painted.` +
                            (hidden.length ? ` (Do not forget the ${list(hidden)} of the block, even though it cannot be seen in the picture.)` : ''),
                    };
                },
            },
            {
                id: 'block-count-k', name: 'Painted block: count one kind', level: 2,
                gen(rng) {
                    let a, b, c;
                    do { [a, b, c] = [rng.int(3, 8), rng.int(2, 6), rng.int(2, 7)]; } while (a === b && b === c);
                    const k = rng.pick([0, 1, 1, 2, 2]);
                    const t = blockTally(a, b, c).n;
                    const p = {
                        q: `${blockIntro(rng, a, b, c)} How many of the small cubes have <strong>${kWords(k)}</strong>?`,
                        ans: cubesAns(same(t[k], formula(a, b, c)[k], 'block-count-k')),
                        sol: blockSol(a, b, c, k),
                    };
                    if (a + b * 0.5 <= 9 && c <= 6) p.fig = F.row(blockFig(a, b, c));
                    return p;
                },
            },
            {
                id: 'reverse-cube', name: 'Working backwards', level: 2,
                gen(rng) {
                    const n = rng.int(3, 9), e = n - 2, t = blockTally(n, n, n).n;
                    const given = rng.pick(['none', 'one', 'two']);
                    const asked = rng.pick(['none', 'one', 'two', 'total', 'some'].filter(x => x !== given));
                    const idx = { none: 0, one: 1, two: 2 };
                    const g = same(t[idx[given]], KINDS[given].f(e), 'reverse-cube');
                    const find = given === 'none' ? R`The unpainted cubes form a cube: ${m(`(n-2)^3=${g}`)}, so ${m(`n-2=${e}`)}`
                        : given === 'one' ? R`${m(`6(n-2)^2=${g}`)}, so ${m(`(n-2)^2=${g / 6}`)} and ${m(`n-2=${e}`)}`
                            : R`${m(`12(n-2)=${g}`)}, so ${m(`n-2=${e}`)}`;
                    const value = asked === 'total' ? n ** 3 : asked === 'some' ? n ** 3 - t[0] : t[idx[asked]];
                    const want = asked === 'total' ? 'How many small cubes are there altogether?'
                        : asked === 'some' ? 'How many small cubes have <strong>at least one</strong> painted face?'
                            : `How many small cubes have <strong>${KINDS[asked].words}</strong>?`;
                    const then = asked === 'total' ? m(`${n}^3=${value}`)
                        : asked === 'some' ? m(`${n}^3-${e}^3=${n ** 3}-${e ** 3}=${value}`)
                            : asked === 'none' ? m(`${e}^3=${value}`)
                                : asked === 'one' ? m(`6${TIMES}${e}^2=${value}`)
                                    : m(prod(12, e) + '=' + value);
                    if (asked !== 'total' && asked !== 'some') same(value, KINDS[asked].f(e), 'reverse-cube asked');
                    return {
                        q: `A cube is painted on all six faces and then cut into equal small cubes, the same number along every edge. Exactly ${g} of the small cubes ${g === 1 ? 'has' : 'have'} <strong>${KINDS[given].words}</strong>. ${want}`,
                        ans: cubesAns(value),
                        sol: `${find} and ${m(`n=${n}`)}. Then ${then}.`,
                    };
                },
            },
            {
                id: 'at-least', name: 'At least one, at least two', level: 2,
                gen(rng) {
                    const cube = rng.bool(0.35);
                    const [a, b, c] = cube ? Array(3).fill(rng.int(3, 8)) : [rng.int(4, 8), rng.int(3, 6), rng.int(3, 6)];
                    const t = blockTally(a, b, c).n, two = rng.bool(0.4), N = a * b * c;
                    const value = two ? t[2] + t[3] : N - t[0];
                    const f = two ? 8 + 4 * (a + b + c - 6) : N - (a - 2) * (b - 2) * (c - 2);
                    return {
                        q: `${cube ? cubeIntro(rng, a) : blockIntro(rng, a, b, c)} How many of the small cubes have <strong>at least ${two ? 'two painted faces' : 'one painted face'}</strong>?`,
                        ans: cubesAns(same(value, f, 'at-least')),
                        sol: two ? R`At least two means two or three: the edge cubes and the corner cubes. ${m(`(${a - 2}+${b - 2}+${c - 2})${TIMES}4+8=${f}`)}.`
                            : R`Take the cubes with no paint away from the total: ${m(`${prod(a, b, c)}-${prod(a - 2, b - 2, c - 2)}=${N}-${(a - 2) * (b - 2) * (c - 2)}=${f}`)}.`,
                    };
                },
            },
            {
                id: 'ratio-reverse', name: 'Comparing two kinds of cube', level: 3,
                gen(rng) {
                    const { n, x, y, r } = rng.pick(RATIOS), e = n - 2, t = blockTally(n, n, n).n;
                    const idx = { none: 0, one: 1, two: 2, three: 3 };
                    if (t[idx[x]] !== r * t[idx[y]]) throw new Error('lesson 15 ratio-reverse: ratio fails in the model');
                    const asked = rng.pick(['total', 'total', ...['none', 'one', 'two'].filter(z => z !== x && z !== y)]);
                    const value = asked === 'total' ? n ** 3 : t[idx[asked]];
                    const rel = r === 1 ? 'equal to' : r === 2 ? 'twice' : `${r} times`;
                    const then = asked === 'total' ? m(`${n}^3=${value}`) : m(`${KINDS[asked].tex}=${value}`);
                    return {
                        q: `A cube is painted on all six faces and then cut into more than 8 equal small cubes, the same number along every edge. The number of small cubes with <strong>${KINDS[x].words}</strong> is ${rel} the number with <strong>${KINDS[y].words}</strong>. ` +
                            (asked === 'total' ? 'How many small cubes are there altogether?' : `How many small cubes have <strong>${KINDS[asked].words}</strong>?`),
                        ans: cubesAns(value),
                        sol: R`Cut each edge into \(n\) parts and write \(m=n-2\). The condition says ${m(`${KINDS[x].tex}=${r === 1 ? '' : r + TIMES}${KINDS[y].tex}`)}, which is true only for ${m(`m=${e}`)}, so ${m(`n=${n}`)}. Then ${then}.`,
                    };
                },
            },
            {
                id: 'some-faces-exact', name: 'Only some faces painted', level: 3,
                gen(rng) {
                    const s = rng.pick(SOME), a = rng.int(3, 6), b = rng.int(3, 5), c = rng.int(3, 5);
                    const dims = [a, b, c], P = axisPaint(s.f), t = blockTally(a, b, c, s.f).n;
                    const k = rng.pick([0, 1, 2, 2, 3].filter(x => t[x] > 0));
                    const pos = positions(dims, P, k);
                    return {
                        q: `${someIntro(a, b, c, s)} How many small cubes have <strong>${kWords(k)}</strong>?`,
                        fig: F.row(paintFig(a, b, c, s.f)),
                        ans: cubesAns(same(t[k], pos.value, 'some-faces-exact')),
                        sol: `${layersText(dims, P)} A cube with ${kWords(k)} touches paint in exactly ${k} of the three directions: ${m(pos.tex)}.`,
                    };
                },
            },
        ],

        assignment: [
            ['remove-one', 4], ['stick-one', 4], ['cube-count-k', 4], ['marked-cube', 3],
            ['remove-big', 4], ['remove-several', 3], ['stick-tower', 4], ['stick-several', 3], ['block-count-k', 4], ['reverse-cube', 3], ['at-least', 2],
            ['remove-challenge', 3], ['stick-challenge', 3], ['ratio-reverse', 3], ['some-faces-exact', 3],
        ],
    });
    function range(n) { return Array.from({ length: n }, (_, i) => i); }
})();
