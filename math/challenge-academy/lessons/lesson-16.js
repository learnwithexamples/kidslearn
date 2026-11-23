/* Challenge Academy — Lesson 16: Understanding Mixture Concentration */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m;
    const X = R`\times `, DIV = R`\div`, PC = R`\%`;

    // ── The model: a solution is { m: mass of solution, s: mass of solute } ──
    // Every "find the amount" answer is put back through these operations and
    // must reproduce the target, or the generator throws.
    const mk = (mass, percent) => ({ m: mass, s: mass * percent / 100 });
    const water = mass => ({ m: mass, s: 0 });
    const solute = mass => ({ m: mass, s: mass });
    const conc = a => a.s / a.m * 100;
    const plus = (...a) => ({ m: a.reduce((t, x) => t + x.m, 0), s: a.reduce((t, x) => t + x.s, 0) });
    const part = (a, mass) => ({ m: mass, s: a.s * mass / a.m });           // a portion of a well-stirred solution
    const minus = (a, b) => ({ m: a.m - b.m, s: a.s - b.s });
    const near = (a, b) => Math.abs(a - b) < 1e-7;
    const isInt = x => near(x, Math.round(x));
    const oneDp = x => isInt(x * 10);
    const tidy = x => Math.round(x * 1e6) / 1e6;
    const n = x => CA.tex.num(tidy(x));
    const cap = s => s.replace(/^./, c => c.toUpperCase());
    function must(ok, tag) { if (!ok) throw new Error(`lesson 16 ${tag}: the answer does not check out`); }

    /** A problem.  `chk` holds the givens for an independent checker outside the repo; it never reaches a page. */
    function prob(q, ans, sol, chk, fig) {
        const o = { q, ans, sol };
        if (fig) o.fig = fig;
        Object.defineProperty(o, 'chk', { value: chk });
        return o;
    }
    const g = x => CA.num(x, 'g'), pct = x => CA.num(tidy(x), '%');

    // Salt water cannot really be 50% salt, so strong solutions are sugar or honey.
    const SOLUTES = [
        { s: 'salt', w: 'salt water', max: 25 },
        { s: 'sugar', w: 'sugar water', max: 60 },
        { s: 'honey', w: 'honey water', max: 100 },
    ];
    const pickK = (rng, ...percents) => rng.pick(SOLUTES.filter(k => Math.max(...percents) <= k.max));
    /** Only salt and sugar come out of a solution as crystals. */
    const pickCrystal = (rng, p) => rng.pick(SOLUTES.filter(k => k.s !== 'honey' && p <= k.max));

    // ── Figures ──────────────────────────────────────────────────────────
    /** A row of beakers. Items: strings (drawn as + = →) or { name, conc, mass, level 0–1, tint 0–1, solid }. */
    function beakers(items, opt = {}) {
        const bw = opt.bw || 56, bh = opt.bh || 60, opw = opt.opw || 22, top = 20, pad = 8;
        let x = pad, body = '';
        for (const it of items) {
            if (typeof it === 'string') {
                if (it.trim()) body += F.text(x + opw / 2, top + bh / 2 + 7, it, { size: 19, bold: true });
                x += opw;
                continue;
            }
            const y0 = top, y1 = top + bh, level = it.level == null ? 0.65 : it.level, ly = y1 - level * (bh - 8), r = 6;
            const tint = it.tint == null ? 0.25 : it.tint;
            body += F.path(`M${x} ${ly}L${x} ${y1 - r}Q${x} ${y1} ${x + r} ${y1}L${x + bw - r} ${y1}Q${x + bw} ${y1} ${x + bw} ${y1 - r}L${x + bw} ${ly}Z`,
                { fill: it.solid ? '#cbd5e0' : '#3b5bdb', stroke: 'none', opacity: it.solid ? 1 : tint });
            body += F.path(`M${x - 4} ${y0}L${x} ${y0}L${x} ${y1 - r}Q${x} ${y1} ${x + r} ${y1}L${x + bw - r} ${y1}Q${x + bw} ${y1} ${x + bw} ${y1 - r}L${x + bw} ${y0}L${x + bw + 4} ${y0}`);
            if (!it.solid) body += F.line(x, ly, x + bw, ly, { width: 1 });
            if (it.conc) body += F.text(x + bw / 2, Math.max(ly + 16, (ly + y1) / 2 + 5), it.conc, { bold: true, size: 13 });
            if (it.name) body += F.text(x + bw / 2, y0 - 7, it.name, { size: 12 });
            if (it.mass) body += F.text(x + bw / 2, y1 + 15, it.mass, { size: 12 });
            x += bw + 8;
        }
        return F.svg(x - 8 + pad, top + bh + 22, body, { label: 'beakers' });
    }
    const tintOf = p => 0.1 + Math.min(0.55, p / 100 * 0.9);
    /** A beaker of `mass` g at p% (p null → "?"); `big` is the largest mass in the row. */
    const bk = (mass, p, big, name) => ({
        mass: mass == null ? '? g' : `${n(mass)} g`, conc: p == null ? '?' : `${n(p)}%`, name,
        tint: p == null ? 0.25 : tintOf(p), level: mass == null ? 0.6 : 0.38 + 0.45 * Math.min(1, mass / big),
    });

    /** The see-saw: concentrations p < t < q along the beam, masses hanging at the ends. */
    function seesaw(p, t, q, leftMass, rightMass) {
        const W = 300, x0 = 46, x1 = 254, y = 62;
        const xt = x0 + (t - p) / (q - p) * (x1 - x0);
        let b = '';
        for (const [x, label] of [[x0, leftMass], [x1, rightMass]]) {
            b += F.rect(x - 34, y - 30, 68, 28, { fill: F.colors.FILL });
            b += F.text(x, y - 11, label, { bold: true, size: 13 });
        }
        b += F.line(x0 - 40, y, x1 + 40, y, { width: 3 });
        b += F.poly([[xt, y + 2], [xt - 11, y + 22], [xt + 11, y + 22]], { fill: F.colors.SHADE });
        for (const x of [x0, x1]) b += F.line(x, y + 2, x, y + 8, { width: 1 });
        b += F.text(x0, y + 40, `${n(p)}%`) + F.text(x1, y + 40, `${n(q)}%`);
        b += F.text(xt, y + 40, `${n(t)}%`, { bold: true, fill: F.colors.ACCENT });
        b += F.text((x0 + xt - 11) / 2, y + 16, `${n(t - p)} away`, { size: 11, fill: '#4a5568' });
        b += F.text((x1 + xt + 11) / 2, y + 16, `${n(q - t)} away`, { size: 11, fill: '#4a5568' });
        return F.svg(W, y + 48, b, { label: 'see-saw of concentrations' });
    }

    // ── Clean number sets, worked out once ───────────────────────────────
    const BASIC = [];        // [M, p]: M g of p% holds a whole number of grams of solute
    for (const M of [40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800])
        for (const p of [2, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 25, 30, 35, 40, 45])
            if (isInt(M * p / 100) && M * p / 100 >= 2) BASIC.push([M, p]);

    const MASSES = [100, 120, 150, 160, 200, 240, 250, 300, 400, 450, 500, 600, 750, 800];
    const DILUTE = [], EVAP = [], ADD = [], REMOVE = [];
    for (const M of MASSES) {
        for (const p of [10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 60]) for (let q = 4; q < p; q++) {
            const M2 = M * p / q, w = M2 - M;
            if (isInt(M * p / 100) && isInt(M2) && w % 10 === 0 && w <= 3 * M) DILUTE.push({ M, p, q, w, M2 });
        }
        for (const p of [4, 5, 6, 8, 10, 12, 15, 16, 18, 20, 24, 25, 30]) for (let q = p + 1; q <= 60; q++) {
            const M2 = M * p / q, w = M - M2;
            if (isInt(M * p / 100) && isInt(M2) && w % 10 === 0 && M2 >= M / 4) EVAP.push({ M, p, q, w, M2 });
        }
        for (const p of [4, 5, 10, 12, 15, 16, 20, 25, 28, 30, 36, 40]) for (let q = p + 1; q <= 70; q++) {
            const W = M * (100 - p) / 100, M2 = 100 * W / (100 - q), x = M2 - M;
            if (isInt(W) && isInt(M2) && x % 5 === 0 && x <= M) ADD.push({ M, p, q, x, M2, W });
        }
        for (const p of [12, 15, 20, 24, 25, 28, 30, 36, 40, 44, 50, 52, 60]) for (let q = 4; q < p; q++) {
            const W = M * (100 - p) / 100, M2 = 100 * W / (100 - q), x = M - M2;
            if (isInt(W) && isInt(M2) && x % 5 === 0 && x > 0 && x <= M * p / 100 / 2 + 1e-9) REMOVE.push({ M, p, q, x, M2, W });
        }
    }

    const TWICE = [];        // the same mass of water added twice: p1% then p2%; the third time gives p3%
    for (const s of [6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30, 36, 40, 45, 48, 60, 72, 90, 120])
        for (let p1 = 6; p1 <= 50; p1++) for (let p2 = 3; p2 < p1; p2++) {
            const S1 = s * 100 / p1, S2 = s * 100 / p2, w = S2 - S1, M0 = S1 - w;
            if (!isInt(S1) || !isInt(S2) || M0 <= s) continue;
            const p0 = s / M0 * 100, p3 = s / (S2 + w) * 100;
            if (oneDp(p0) && oneDp(p3) && (isInt(p0) || isInt(p3)) && p0 <= 60) TWICE.push({ s, p1, p2, w, M0, p0: tidy(p0), p3: tidy(p3), S1, S2 });
        }
    // Keep each (p1, p2) once, with the smallest solute that makes every mass whole.
    const TWICE1 = TWICE.filter((t, i) => TWICE.findIndex(u => u.p1 === t.p1 && u.p2 === t.p2) === i);

    const POUR = [];         // pour out a fraction, top up with water, k times
    for (const [num, den] of [[1, 2], [3, 4], [4, 5], [2, 3], [3, 5], [9, 10], [1, 4], [1, 3]]) for (const k of [2, 3]) for (let p = 8; p <= 90; p++) {
        const c = p * num ** k / den ** k;
        if (!oneDp(c) || !(p % 5 === 0 || isInt(c)) || c < 1) continue;
        for (const unit of [20, 30, 50, 60, 100, 120, 150, 200]) {
            const M = den * unit;
            if (M >= 100 && M <= 1000) POUR.push({ M, x: M * (den - num) / den, num, den, k, p, c });
        }
    }

    const SWAP = [];         // pour x from A (M g, p%) into B (M2 g water), then x back
    for (const M of [200, 300, 400, 500, 600]) for (const M2 of [100, 200, 300, 400, 500, 600]) for (const x of [50, 100, 150, 200, 300]) for (let p = 10; p <= 60; p += 2) {
        if (x >= M) continue;
        const s1 = x * p / 100, cB = s1 / (M2 + x) * 100, sA = (M - x) * p / 100, s2 = x * cB / 100, cA = (sA + s2) / M * 100;
        if (isInt(s1) && isInt(cB) && isInt(sA) && oneDp(s2) && oneDp(cA)) SWAP.push({ M, M2, x, p, s1, cB, sA, s2, cA });
    }

    const EQUAL = [];        // swap the same mass between cups of A g and B g so they end up equal
    for (const A of [100, 120, 150, 200, 240, 300, 400, 450, 600, 800, 900, 1200]) for (const B of [100, 120, 150, 200, 240, 300, 400, 450, 600, 800, 900, 1200])
        if (A !== B && isInt(A * B / (A + B))) EQUAL.push({ A, B, x: A * B / (A + B) });

    const DRY = [];          // fresh mass M (kg) with w1% water dries until w2% water
    for (const M of [10, 20, 30, 40, 50, 60, 80, 100, 120, 150, 200, 300, 400, 500, 1000])
        for (const [w1, w2] of [[99, 98], [99, 96], [99, 95], [98, 96], [98, 95], [96, 95], [96, 92], [95, 90], [90, 80], [90, 85], [90, 75], [80, 75], [80, 60], [85, 80], [84, 80], [92, 90], [94, 92]]) {
            const solid = M * (100 - w1) / 100, M2 = solid * 100 / (100 - w2);
            if (oneDp(solid) && isInt(M2)) DRY.push({ M, w1, w2, solid: tidy(solid), M2: Math.round(M2) });
        }

    const MIXM = [100, 150, 200, 250, 300, 400, 500, 600];
    const MIXP = [5, 8, 10, 12, 15, 16, 20, 24, 25, 30, 35, 36, 40, 45, 50, 60, 70, 80];
    /** Two solutions with whole grams of solute whose mixture is a whole percent. */
    function mixPair(rng) {
        for (;;) {
            const A = rng.pick(MIXM), B = rng.pick(MIXM), p = rng.pick(MIXP), q = rng.pick(MIXP);
            const t = (A * p + B * q) / (A + B);
            if (Math.abs(p - q) >= 6 && isInt(t) && isInt(A * p / 100) && isInt(B * q / 100) && (A !== B || rng.bool(0.25))) return { A, B, p, q, t: Math.round(t), sa: A * p / 100, sb: B * q / 100 };
        }
    }
    function mixTriple(rng) {
        for (;;) {
            const [A, B, C] = [rng.pick(MIXM), rng.pick(MIXM), rng.pick(MIXM)], [p, q, r] = rng.sample(MIXP, 3);
            const t = (A * p + B * q + C * r) / (A + B + C);
            if (isInt(t) && Math.round(t) !== r && [A * p, B * q, C * r].every(v => v % 100 === 0) && !(A === B && B === C)) return { A, B, C, p, q, r, t: Math.round(t), s: [A * p / 100, B * q / 100, C * r / 100] };
        }
    }

    // ── Numbers used in the tutorial and the examples ────────────────────
    const T2 = { W: 240, p: 20 }, T2M = T2.W / (100 - T2.p) * 100;
    must(near(conc({ m: T2M, s: T2M - T2.W }), T2.p), 'tutorial solvent formula');
    const T3a = { M: 200, p: 10, q: 20 }, T3aW = T3a.M * (100 - T3a.p) / 100, T3aM2 = T3aW / (100 - T3a.q) * 100;
    must(near(conc(plus(mk(T3a.M, T3a.p), solute(T3aM2 - T3a.M))), T3a.q), 'tutorial add salt');
    const T3r = { M: 400, p: 40, q: 25 }, T3rW = T3r.M * (100 - T3r.p) / 100, T3rM2 = T3rW / (100 - T3r.q) * 100;
    must(near(conc(minus(mk(T3r.M, T3r.p), solute(T3r.M - T3rM2))), T3r.q), 'tutorial remove sugar');
    const T3 = { M: 200, p: 20, q: 10 }, T3s = T3.M * T3.p / 100, T3M2 = T3s / T3.q * 100;
    must(near(conc(plus(mk(T3.M, T3.p), water(T3M2 - T3.M))), T3.q), 'tutorial dilute');
    const T3e = { M: 300, p: 10, q: 15 }, T3es = T3e.M * T3e.p / 100, T3eM2 = T3es / T3e.q * 100;
    must(near(conc(minus(mk(T3e.M, T3e.p), water(T3e.M - T3eM2))), T3e.q), 'tutorial evaporate');
    const T4 = { A: 100, p: 10, B: 300, q: 30 }, T4mix = plus(mk(T4.A, T4.p), mk(T4.B, T4.q)), T4t = conc(T4mix);
    const T6 = { M: 100, p: 40, x: 25 }, T6c = [T6.p];
    { let a = mk(T6.M, T6.p); for (let i = 0; i < 2; i++) { a = plus(minus(a, part(a, T6.x)), water(T6.x)); T6c.push(tidy(conc(a))); } }
    const T7 = { M: 100, w1: 99, w2: 98 }, T7solid = T7.M * (100 - T7.w1) / 100, T7M2 = T7solid / (100 - T7.w2) * 100;

    const E1 = { s: 30, w: 170 }, E1c = conc({ m: E1.s + E1.w, s: E1.s });
    const E2 = { W: 340, p: 15 }, E2M = E2.W / (100 - E2.p) * 100, E2s = E2M - E2.W;
    must(near(conc({ m: E2M, s: E2s }), E2.p), 'example 2');
    const E3 = { M: 400, p: 10, q: 25 }, E3W = E3.M * (100 - E3.p) / 100, E3M2 = E3W / (100 - E3.q) * 100;
    must(near(conc(plus(mk(E3.M, E3.p), solute(E3M2 - E3.M))), E3.q), 'example 3');
    const E4 = { M: 300, p: 20, q: 12 }, E4s = E4.M * E4.p / 100, E4M2 = E4s / E4.q * 100;
    must(near(conc(plus(mk(E4.M, E4.p), water(E4M2 - E4.M))), E4.q), 'example 4');
    const E5 = { A: 200, p: 15, B: 300, q: 40 }, E5mix = plus(mk(E5.A, E5.p), mk(E5.B, E5.q));
    const E6 = { A: 300, p: 20, q: 50, t: 30 }, E6x = E6.A * (E6.t - E6.p) / (E6.q - E6.t);
    must(near(conc(plus(mk(E6.A, E6.p), mk(E6x, E6.q))), E6.t), 'example 6');

    const MASS_WORDS = K => ({
        solute: `the mass of solute (the ${K.s})`,
        solvent: 'the mass of solvent (the water)',
        solution: `the mass of solution (the ${K.w})`,
        conc: 'the concentration',
    });

    CA.register({
        id: 16,

        tutorial: [
            {
                h: 'New concepts: solvent, solute, solution, concentration',
                html: R`
                <p>Stir some salt into water and you get <strong>salt water</strong>. Four words describe what is in the glass:</p>
                <ul>
                    <li><strong>Solvent</strong> — the liquid that does the dissolving. In this lesson it is almost always water.</li>
                    <li><strong>Solute</strong> — the material that gets dissolved (salt, sugar, honey, …).</li>
                    <li><strong>Solution</strong> — the mixture of a solute and a solvent (the salt water itself).</li>
                    <li><strong>Concentration</strong> — how much solute is in the solution, usually shown as a percentage.</li>
                </ul>
                ${F.row(beakers([{ mass: '80 g water', conc: '0%', tint: 0.08, level: 0.75 }, '+', { mass: '20 g salt', solid: true, level: 0.2 }, '=', { mass: '100 g salt water', conc: '20%', tint: tintOf(20), level: 0.85 }], { bw: 66, opw: 26 }))}
                <p>Here the solvent is 80 g of water, the solute is 20 g of salt, and the solution is
                   \(80+20=100\) g of salt water. 20 g of the 100 g is salt, so the concentration is
                   \(\frac{20}{100}=20\%\). We say “20% salt water”.</p>
                <div class="ca-warn"><strong>The classic mistake:</strong> dividing by the solvent. \(\frac{20}{80}=25\%\) is
                   <em>not</em> the concentration. The concentration compares the solute with the <em>whole solution</em> —
                   add the solute and the solvent first.</div>
                <div class="ca-tip"><strong>Two special cases.</strong> Pure water has concentration 0%; pure salt has
                   concentration 100%. Keep these in mind — they will let one method handle many problems later.</div>
                <p>Every amount in this lesson is a mass (grams or kilograms), and “a 15% solution” means 15% of its mass is solute.</p>`,
            },
            {
                h: 'The formulas: know two, find the third',
                html: R`
                <p>The book sums the concepts up in a handful of formulas. The first two come straight from the definitions:</p>
                <div class="ca-formula">
                    \[ \text{mass of solution} = \text{mass of solute} + \text{mass of solvent} \]
                    \[ \text{concentration} = \frac{\text{mass of solute}}{\text{mass of solution}} = \frac{\text{mass of solute}}{\text{mass of solute} + \text{mass of solvent}} \]
                </div>
                <p>Turning the concentration formula round gives the rest:</p>
                <div class="ca-formula">
                    \[ \text{mass of solute} = \text{mass of solution} \times \text{concentration} \]
                    \[ \text{mass of solution} = \text{mass of solute} \div \text{concentration} \]
                    \[ \text{mass of solution} = \text{mass of solvent} \div (1 - \text{concentration}) \]
                </div>
                <table>
                    <tr><th>You know</th><th>You want</th><th>Example</th></tr>
                    <tr><td>solute, solvent</td><td>concentration</td><td>15 g of sugar in 285 g of water: \(15\div(15+285)=15\div300=5\%\)</td></tr>
                    <tr><td>solution, concentration</td><td>solute</td><td>250 g of 8% salt water: \(250\times8\%=20\) g of salt</td></tr>
                    <tr><td>solute, concentration</td><td>solution</td><td>12 g of salt makes 4% salt water: \(12\div4\%=300\) g</td></tr>
                    <tr><td>solvent, concentration</td><td>solution</td><td>${T2.W} g of water makes ${T2.p}% sugar water: \(${T2.W}\div(1-${T2.p}\%)=${T2.W}\div${100 - T2.p}\%=${T2M}\) g</td></tr>
                </table>
                <p><strong>Why \(1-\text{concentration}\)?</strong> If ${T2.p}% of the solution is solute, the other
                   \(100\%-${T2.p}\%=${100 - T2.p}\%\) is solvent. So the ${T2.W} g of water is ${100 - T2.p}% of the solution, and the
                   solution is \(${T2.W}\div${100 - T2.p}\%=${T2M}\) g. The sugar needed is \(${T2M}-${T2.W}=${T2M - T2.W}\) g.</p>
                <div class="ca-tip"><strong>Dividing by a percentage.</strong> \(12\div4\%\) means \(12\div\frac{4}{100}=12\times\frac{100}{4}=300\).
                   Or think: 4% is 12 g, so 1% is 3 g, so 100% is 300 g.</div>
                <div class="ca-key"><strong>Organise every problem in a small table</strong> with rows for solute, solvent,
                   solution and concentration, and one column for each stage of the story. Fill in what you know; two numbers in a
                   column always give the others.</div>`,
            },
            {
                h: 'Change the concentration: add or remove solute',
                html: R`
                <p>Most problems change a solution and ask about the result. The secret is always the same:
                   <strong>find the quantity that does not change</strong> and work it out first.</p>
                <div class="ca-key"><strong>Add or remove solute → the mass of solvent stays the same.</strong></div>
                <p><strong>Adding salt.</strong> How much salt turns ${T3a.M} g of ${T3a.p}% salt water into ${T3a.q}% salt water?</p>
                <table>
                    <tr><th></th><th>Before</th><th>After</th></tr>
                    <tr><td>solvent (water)</td><td>\(${T3a.M}\times(1-${T3a.p}\%)=${T3aW}\) g</td><td><strong>${T3aW} g</strong> (unchanged)</td></tr>
                    <tr><td>concentration</td><td>${T3a.p}%</td><td>${T3a.q}%</td></tr>
                    <tr><td>solution</td><td>${T3a.M} g</td><td>\(${T3aW}\div(1-${T3a.q}\%)=${T3aM2}\) g</td></tr>
                </table>
                <p>The solution grows from ${T3a.M} g to ${T3aM2} g, and only salt was added, so \(${T3aM2}-${T3a.M}=${T3aM2 - T3a.M}\) g of salt is needed.</p>
                <div class="ca-warn"><strong>Not ${T3a.M * (T3a.q - T3a.p) / 100} g!</strong> It is tempting to say “the concentration must rise by
                   ${T3a.q - T3a.p} percentage points, and ${T3a.q - T3a.p}% of ${T3a.M} g is ${T3a.M * (T3a.q - T3a.p) / 100} g”. But adding salt also makes the
                   solution heavier, so more is needed.</div>
                <p><strong>Removing solute.</strong> ${T3r.M} g of ${T3r.p}% sugar water cools, and some sugar comes out as crystals,
                   which are lifted out. The sugar water left is ${T3r.q}%. The water is still
                   \(${T3r.M}\times(1-${T3r.p}\%)=${T3rW}\) g, so the solution left is \(${T3rW}\div(1-${T3r.q}\%)=${T3rM2}\) g, and
                   \(${T3r.M}-${T3rM2}=${T3r.M - T3rM2}\) g of sugar crystals were removed.</p>`,
            },
            {
                h: 'Change the concentration: add or remove solvent',
                html: R`
                <div class="ca-key"><strong>Add or remove solvent → the mass of solute stays the same.</strong>
                   Adding water dilutes the solution; evaporating water (boiling, drying in the sun) makes it stronger.</div>
                <p><strong>Adding water.</strong> How much water turns ${T3.M} g of ${T3.p}% salt water into ${T3.q}% salt water?</p>
                <table>
                    <tr><th></th><th>Before</th><th>After</th></tr>
                    <tr><td>solute (salt)</td><td>\(${T3.M}\times${T3.p}\%=${T3s}\) g</td><td><strong>${T3s} g</strong> (unchanged)</td></tr>
                    <tr><td>concentration</td><td>${T3.p}%</td><td>${T3.q}%</td></tr>
                    <tr><td>solution</td><td>${T3.M} g</td><td>\(${T3s}\div${T3.q}\%=${T3M2}\) g</td></tr>
                </table>
                <p>The solution grows from ${T3.M} g to ${T3M2} g, so \(${T3M2}-${T3.M}=${T3M2 - T3.M}\) g of water is added.</p>
                <p><strong>Evaporating water.</strong> ${T3e.M} g of ${T3e.p}% salt water is boiled until it is ${T3e.q}% salt water.
                   The salt, \(${T3e.M}\times${T3e.p}\%=${T3es}\) g, stays in the pan. Afterwards it is ${T3e.q}% of the solution, so
                   the solution is \(${T3es}\div${T3e.q}\%=${T3eM2}\) g, and \(${T3e.M}-${T3eM2}=${T3e.M - T3eM2}\) g of water has gone.</p>
                <table>
                    <tr><th>What happens</th><th>What stays the same</th><th>Concentration</th></tr>
                    <tr><td>solute is added</td><td>the solvent</td><td>goes up</td></tr>
                    <tr><td>solute is removed</td><td>the solvent</td><td>goes down</td></tr>
                    <tr><td>solvent (water) is added</td><td>the solute</td><td>goes down</td></tr>
                    <tr><td>solvent (water) evaporates</td><td>the solute</td><td>goes up</td></tr>
                    <tr><td>some solution is poured out</td><td>the concentration</td><td>stays the same</td></tr>
                </table>
                <div class="ca-tip"><strong>Halving the concentration</strong> means doubling the solution (same solute), not adding
                   as much water as there was solute.</div>`,
            },
            {
                h: 'Find the concentration of the mixed solution',
                html: R`
                <p>When two solutions are poured together, nothing is lost: the solutes add up and the masses add up.</p>
                <div class="ca-formula">\[ \text{concentration of the mixture} = \frac{\text{mass of A}\times\text{conc. of A} + \text{mass of B}\times\text{conc. of B}}{\text{mass of A} + \text{mass of B}} \]</div>
                <p>The top line is the total solute; the bottom line is the total mass of solution.</p>
                ${F.row(beakers([bk(T4.A, T4.p, T4.A + T4.B, 'A'), '+', bk(T4.B, T4.q, T4.A + T4.B, 'B'), '=', bk(T4.A + T4.B, T4t, T4.A + T4.B)], { bw: 62, opw: 26 }))}
                <table style="white-space:nowrap">
                    <tr><th></th><th>A</th><th>B</th><th>Mixture</th></tr>
                    <tr><td>solute</td><td>\(${T4.A}\times${T4.p}\%=${T4.A * T4.p / 100}\) g</td><td>\(${T4.B}\times${T4.q}\%=${T4.B * T4.q / 100}\) g</td><td>${T4mix.s} g</td></tr>
                    <tr><td>solution</td><td>${T4.A} g</td><td>${T4.B} g</td><td>${T4mix.m} g</td></tr>
                    <tr><td>concentration</td><td>${T4.p}%</td><td>${T4.q}%</td><td>\(${T4mix.s}\div${T4mix.m}=${n(T4t)}\%\)</td></tr>
                </table>
                <div class="ca-warn"><strong>Do not just average the percentages.</strong> The average of ${T4.p}% and ${T4.q}% is
                   ${(T4.p + T4.q) / 2}%, but the mixture is ${n(T4t)}% because there is more of the stronger solution. Averaging
                   only works when the two masses are equal.</div>
                <div class="ca-tip"><strong>Sanity check.</strong> The mixture is always <em>between</em> the two concentrations,
                   and closer to the one there is more of. The formula works for three or more solutions too: add up all the
                   solute, and divide by all the solution.</div>`,
            },
            {
                h: 'How much to mix? The see-saw',
                html: R`
                <p>Now turn the question round: <em>how much</em> of each solution gives a wanted concentration? Picture the
                   concentrations along a see-saw, with the target as the pivot.</p>
                ${F.row(seesaw(T4.p, T4t, T4.q, `${T4.A} g`, `${T4.B} g`))}
                <p>The ${T4.p}% solution is ${n(T4t - T4.p)} points below the target; the ${T4.q}% solution is ${n(T4.q - T4t)} points above.
                   The see-saw balances when</p>
                <div class="ca-formula">\[ \text{mass}_{\text{left}} \times \text{distance}_{\text{left}} = \text{mass}_{\text{right}} \times \text{distance}_{\text{right}} \]</div>
                <p>Check: \(${T4.A}\times${n(T4t - T4.p)}=${T4.B}\times${n(T4.q - T4t)}\). ✓ The solution that is <em>further</em> from the
                   target needs <em>less</em> mass.</p>
                <p><strong>Why it works.</strong> Put the masses into the mixture formula: compared with the target, each gram of the
                   weak solution is short of solute and each gram of the strong one has extra. The total shortage must cancel the total
                   extra — that is exactly the balance equation.</p>
                <div class="ca-key"><strong>Inverse ratio.</strong> To mix a \(p\%\) and a \(q\%\) solution into a \(t\%\) solution,
                   \[ \frac{\text{mass of the } p\% \text{ solution}}{\text{mass of the } q\% \text{ solution}} = \frac{\text{distance from } q \text{ to } t}{\text{distance from } p \text{ to } t} \]</div>
                <div class="ca-tip"><strong>Water and pure solute fit too.</strong> Adding water is mixing with a 0% solution; adding
                   salt is mixing with a 100% solution. Diluting ${T3.M} g of ${T3.p}% to ${T3.q}%: the distances are ${T3.p - T3.q} (from ${T3.p}%)
                   and ${T3.q} (from 0%), so \(${T3.M}\times${T3.p - T3.q}=\text{water}\times${T3.q}\) and the water is ${T3.M * (T3.p - T3.q) / T3.q} g — the same
                   answer as before.</div>`,
            },
            {
                h: 'More challenges: refilling and drying',
                html: R`
                <p><strong>Pour out, top up, repeat.</strong> A jug holds ${T6.M} g of ${T6.p}% syrup. You pour out ${T6.x} g, fill the jug
                   back up with ${T6.x} g of water and stir. Then you do it all again. Pouring out ${T6.x} g of ${T6.M} g removes
                   \(${CA.tex.frac(T6.x, T6.M)}\) of the solute, so \(${CA.tex.frac(T6.M - T6.x, T6.M)}\) of it stays, and the jug is back to ${T6.M} g.
                   Each round multiplies the concentration by \(${CA.tex.frac(T6.M - T6.x, T6.M)}\):</p>
                <div class="ca-formula">\[ ${T6c[0]}\% \;\xrightarrow{\times ${CA.tex.frac(T6.M - T6.x, T6.M)}}\; ${n(T6c[1])}\% \;\xrightarrow{\times ${CA.tex.frac(T6.M - T6.x, T6.M)}}\; ${n(T6c[2])}\% \]</div>
                <div class="ca-warn"><strong>It is not subtraction.</strong> The second round drops the concentration by only
                   ${n(T6c[1] - T6c[2])} points, not ${n(T6c[0] - T6c[1])}, because the liquid poured out is weaker.</div>
                <p><strong>Pouring between two cups.</strong> Make a table, and after <em>each</em> pour write the solute and the
                   solution in both cups. A portion poured from a stirred cup has the same concentration as that cup.</p>
                <p><strong>Drying fruit.</strong> ${T7.M} kg of fresh grapes are ${T7.w1}% water. After drying they are ${T7.w2}% water.
                   Think of the solid part as the “solute” — it does not change: \(${T7.M}\times${100 - T7.w1}\%=${n(T7solid)}\) kg. Afterwards it is
                   ${100 - T7.w2}% of the mass, so the grapes weigh \(${n(T7solid)}\div${100 - T7.w2}\%=${n(T7M2)}\) kg — half as much, not
                   “about ${T7.M - 1} kg”!</p>`,
            },
        ],

        // Mirrors the textbook's own summary page for this lesson.
        summary: [
            {
                topic: 'New concepts and formulas',
                points: [
                    R`<strong>Solvent</strong>: the liquid that does the dissolving. <strong>Solute</strong>: the material that gets dissolved. <strong>Solution</strong>: a mixture of a solute and a solvent. <strong>Concentration</strong>: how much solute is in the solution, often shown as a percentage.`,
                    R`\(\text{Mass of solution} = \text{mass of solute} + \text{mass of solvent}\)`,
                    R`\(\text{Concentration} = \text{mass of solute} \div \text{mass of solution} = \text{mass of solute} \div (\text{mass of solute} + \text{mass of solvent})\)`,
                    R`\(\text{Mass of solute} = \text{mass of solution} \times \text{concentration}\); &nbsp;\(\text{mass of solution} = \text{mass of solute} \div \text{concentration}\); &nbsp;\(\text{mass of solution} = \text{mass of solvent} \div (1 - \text{concentration})\)`,
                ],
            },
            {
                topic: 'Change the concentration',
                points: [
                    R`Add or remove solute: the mass of solvent remains unchanged.`,
                    R`Add or remove solvent (add water, evaporate water): the mass of solute remains unchanged.`,
                ],
            },
            {
                topic: 'Find the concentration of the mixed solution',
                points: [
                    R`\(\text{Concentration of a mixture of A and B} = \dfrac{\text{mass of A} \times \text{conc. of A} + \text{mass of B} \times \text{conc. of B}}{\text{mass of A} + \text{mass of B}}\)`,
                ],
            },
        ],

        examples: [
            {
                title: 'Finding a concentration',
                q: R`${E1.s} g of sugar is dissolved in ${E1.w} g of water. What is the concentration of the sugar water?`,
                steps: [
                    R`Solute: ${E1.s} g of sugar. Solvent: ${E1.w} g of water. Solution: \(${E1.s}+${E1.w}=${E1.s + E1.w}\) g.`,
                    R`Concentration = solute ÷ solution \(=\frac{${E1.s}}{${E1.s + E1.w}}\).`,
                    R`\(\frac{${E1.s}}{${E1.s + E1.w}}=${n(E1c / 100)}=${n(E1c)}\%\). (Not \(${E1.s}\div${E1.w}\) — that divides by the solvent only.)`,
                ],
                answer: R`${n(E1c)}%`,
            },
            {
                title: 'Solution from the solvent',
                q: R`A cook has ${E2.W} g of water and wants to make ${E2.p}% salt water with all of it. How many grams of salt water will there be, and how much salt must be dissolved?`,
                steps: [
                    R`If ${E2.p}% of the solution is salt, the other \(100\%-${E2.p}\%=${100 - E2.p}\%\) is water (the solvent).`,
                    R`Mass of solution = mass of solvent ÷ (1 − concentration): \(${E2.W}\div${100 - E2.p}\%=${E2M}\) g.`,
                    R`Salt: \(${E2M}-${E2.W}=${E2s}\) g. Check: \(${E2s}\div${E2M}=${E2.p}\%\). ✓`,
                ],
                answer: R`${E2M} g of salt water, with ${E2s} g of salt`,
            },
            {
                title: 'Adding more solute',
                q: R`How many grams of salt must be added to ${E3.M} g of ${E3.p}% salt water to make ${E3.q}% salt water?`,
                steps: [
                    R`Adding solute does not change the <em>solvent</em>: \(${E3.M}\times(1-${E3.p}\%)=${E3W}\) g of water.`,
                    R`Afterwards the water is \(100\%-${E3.q}\%=${100 - E3.q}\%\) of the solution.`,
                    R`So the solution is \(${E3W}\div${100 - E3.q}\%=${E3M2}\) g.`,
                    R`Salt added: \(${E3M2}-${E3.M}=${E3M2 - E3.M}\) g. Check: salt \(=${E3.M * E3.p / 100}+${E3M2 - E3.M}=${E3.M * E3.p / 100 + E3M2 - E3.M}\) g and \(${E3.M * E3.p / 100 + E3M2 - E3.M}\div${E3M2}=${E3.q}\%\). ✓`,
                ],
                answer: R`${E3M2 - E3.M} g`,
            },
            {
                title: 'Adding solvent: diluting with water',
                q: R`How many grams of water must be added to ${E4.M} g of ${E4.p}% salt water to make ${E4.q}% salt water?`,
                steps: [
                    R`Adding solvent does not change the solute: \(${E4.M}\times${E4.p}\%=${E4s}\) g of salt.`,
                    R`Afterwards this ${E4s} g is ${E4.q}% of the solution, so the solution is \(${E4s}\div${E4.q}\%=${E4M2}\) g.`,
                    R`Water added: \(${E4M2}-${E4.M}=${E4M2 - E4.M}\) g.`,
                    R`Check: \(${E4s}\div${E4M2}=${E4.q}\%\). ✓`,
                ],
                answer: R`${E4M2 - E4.M} g`,
            },
            {
                title: 'The concentration of a mixed solution',
                q: R`${E5.A} g of ${E5.p}% salt water (A) is mixed with ${E5.B} g of ${E5.q}% salt water (B). What is the concentration of the mixture?`,
                fig: F.row(beakers([bk(E5.A, E5.p, E5.A + E5.B, 'A'), '+', bk(E5.B, E5.q, E5.A + E5.B, 'B'), '=', bk(E5.A + E5.B, null, E5.A + E5.B)])),
                steps: [
                    R`Solute in A: \(${E5.A}\times${E5.p}\%=${E5.A * E5.p / 100}\) g. Solute in B: \(${E5.B}\times${E5.q}\%=${E5.B * E5.q / 100}\) g.`,
                    R`Concentration of the mixture \(=\dfrac{${E5.A}\times${E5.p}\%+${E5.B}\times${E5.q}\%}{${E5.A}+${E5.B}}=\dfrac{${E5mix.s}}{${E5mix.m}}\).`,
                    R`\(${E5mix.s}\div${E5mix.m}=${n(conc(E5mix))}\%\).`,
                    R`Sanity check: ${n(conc(E5mix))}% is between ${E5.p}% and ${E5.q}%, and nearer ${E5.q}% because there is more of B. ✓`,
                ],
                answer: R`${n(conc(E5mix))}%`,
            },
            {
                title: 'How much to mix in?',
                q: R`How many grams of ${E6.q}% sugar water must be mixed with ${E6.A} g of ${E6.p}% sugar water to make ${E6.t}% sugar water?`,
                fig: F.row(seesaw(E6.p, E6.t, E6.q, `${E6.A} g`, '? g')),
                steps: [
                    R`Distances from the target: ${E6.p}% is \(${E6.t}-${E6.p}=${E6.t - E6.p}\) away; ${E6.q}% is \(${E6.q}-${E6.t}=${E6.q - E6.t}\) away.`,
                    R`Balance: \(${E6.A}\times${E6.t - E6.p}=\text{?}\times${E6.q - E6.t}\).`,
                    R`\(\text{?}=${E6.A * (E6.t - E6.p)}\div${E6.q - E6.t}=${E6x}\) g.`,
                    R`Check with the mixture formula: \(\dfrac{${E6.A}\times${E6.p}\%+${E6x}\times${E6.q}\%}{${E6.A}+${E6x}}=\dfrac{${E6.A * E6.p / 100 + E6x * E6.q / 100}}{${E6.A + E6x}}=${E6.t}\%\). ✓`,
                ],
                answer: R`${E6x} g`,
            },
        ],

        practice: [
            // ── Level 1: new concepts and formulas ───────────────────────
            {
                id: 'find-concentration', name: 'Concentration = solute ÷ solution', level: 1,
                gen(rng) {
                    const [M, p] = rng.pick(BASIC), K = pickK(rng, p), s = M * p / 100, v = rng.int(0, 3);
                    must(near(conc({ m: M, s }), p), 'find-concentration');
                    const q = [
                        `${s} g of ${K.s} is dissolved in ${M - s} g of water. What is the concentration of the ${K.w}?`,
                        `${M} g of ${K.w} contains ${s} g of ${K.s}. What is its concentration?`,
                        `A cook stirs ${s} g of ${K.s} into some water and gets ${M} g of ${K.w}. What is the concentration of the ${K.w}?`,
                        `${M} g of ${K.w} contains ${M - s} g of water; the rest is ${K.s}. What is the concentration of the ${K.w}?`,
                    ][v];
                    const sol = [
                        R`Solution = solute + solvent: ${m(`${s}+${M - s}=${M}`)} g. Concentration: ${m(R`${s}${DIV}${M}=${n(p / 100)}=${p}${PC}`)}.`,
                        R`Solute ÷ solution: ${m(R`${s}${DIV}${M}=${n(p / 100)}=${p}${PC}`)}.`,
                        R`Solute ÷ solution: ${m(R`${s}${DIV}${M}=${n(p / 100)}=${p}${PC}`)}.`,
                        R`Solute: ${m(`${M}-${M - s}=${s}`)} g of ${K.s}. Concentration: ${m(R`${s}${DIV}${M}=${n(p / 100)}=${p}${PC}`)}.`,
                    ][v];
                    return prob(q, pct(p), sol, { t: 'conc', s, M });
                },
            },
            {
                id: 'find-solute', name: 'Solute = solution × concentration', level: 1,
                gen(rng) {
                    const [M, p] = rng.pick(BASIC), K = pickK(rng, p), s = M * p / 100, wantWater = rng.bool(0.4);
                    must(near(mk(M, p).s, s), 'find-solute');
                    const intro = rng.pick([`A jar holds ${M} g of ${p}% ${K.w}.`, `A recipe needs ${M} g of ${p}% ${K.w}.`, `A scientist prepares ${M} g of ${K.w} with a concentration of ${p}%.`]);
                    return prob(`${intro} How many grams of ${wantWater ? 'water (solvent)' : `${K.s} (solute)`} does it contain?`,
                        g(wantWater ? M - s : s),
                        R`Solute = solution × concentration: ${m(R`${M}${X}${p}${PC}=${s}`)} g of ${K.s}.` + (wantWater ? R` Solvent = solution − solute: ${m(`${M}-${s}=${M - s}`)} g of water.` : ''),
                        { t: 'solute', M, p, want: wantWater ? 'w' : 's' });
                },
            },
            {
                id: 'find-solution', name: 'Solution = solute ÷ concentration', level: 1,
                gen(rng) {
                    const [M, p] = rng.pick(BASIC), K = pickK(rng, p), s = M * p / 100, wantWater = rng.bool(0.45);
                    must(near(conc(plus(solute(s), water(M - s))), p), 'find-solution');
                    return prob(wantWater
                        ? `${s} g of ${K.s} is to be dissolved in water to make ${p}% ${K.w}. How many grams of water are needed?`
                        : rng.pick([`${s} g of ${K.s} is dissolved in water to make ${p}% ${K.w}. How many grams of ${K.w} are made?`,
                            `A jug of ${p}% ${K.w} contains ${s} g of ${K.s}. What is the mass of the ${K.w} in the jug?`]),
                        g(wantWater ? M - s : M),
                        R`Solution = solute ÷ concentration: ${m(R`${s}${DIV}${p}${PC}=${M}`)} g.` + (wantWater ? R` Solvent = solution − solute: ${m(`${M}-${s}=${M - s}`)} g of water.` : ''),
                        { t: 'solution', s, p, want: wantWater ? 'w' : 'M' });
                },
            },
            {
                id: 'what-stays', name: 'What stays the same?', level: 1,
                gen(rng) {
                    const [M, p] = rng.pick(BASIC.filter(([M, p]) => M >= 100 && p >= 5));
                    const act = rng.pick(['water', 'evap', 'solute', 'remove', 'pour']);
                    const K = act === 'remove' ? pickCrystal(rng, p) : pickK(rng, p), Wd = MASS_WORDS(K);
                    const a = act === 'remove' ? Math.max(1, Math.floor(M * p / 100 / 4)) * rng.int(1, 2) : rng.pick([10, 20, 25, 30, 40, 50]);
                    const text = {
                        water: `${a} g of water is added to ${M} g of ${p}% ${K.w}.`,
                        evap: `${M} g of ${p}% ${K.w} is heated until ${a} g of water has evaporated.`,
                        solute: `${a} g of ${K.s} is stirred into ${M} g of ${p}% ${K.w} and dissolves completely.`,
                        remove: `As ${M} g of ${p}% ${K.w} cools, ${a} g of ${K.s} comes out as crystals, which are lifted out.`,
                        pour: `${a} g is poured out of a jug holding ${M} g of ${p}% ${K.w}.`,
                    }[act];
                    const same = { water: 'solute', evap: 'solute', solute: 'solvent', remove: 'solvent', pour: 'conc' }[act];
                    const dir = { water: 'goes down', evap: 'goes up', solute: 'goes up', remove: 'goes down', pour: 'stays the same' }[act];
                    const why = {
                        water: 'Only solvent is added, so the solute is unchanged; the concentration goes down.',
                        evap: 'Only solvent leaves, so the solute is unchanged; the concentration goes up.',
                        solute: 'Only solute is added, so the solvent (water) is unchanged; the concentration goes up.',
                        remove: 'Only solute leaves, so the solvent (water) is unchanged; the concentration goes down.',
                        pour: 'The part poured out has the same make-up as the rest: solute, solvent and solution all get smaller, but the concentration stays the same.',
                    }[act];
                    if (rng.bool(0.6)) return prob(`${text} Which of these stays the same?`,
                        CA.mc(rng, Wd[same], ['solute', 'solvent', 'solution', 'conc'].filter(k => k !== same).map(k => Wd[k])),
                        why, { t: 'stays', act, ask: 'same', answer: Wd[same], Wd });
                    return prob(`${text} What happens to the concentration?`,
                        CA.mc(rng, `It ${dir}.`, ['It goes up.', 'It goes down.', 'It stays the same.'].filter(c => c !== `It ${dir}.`)),
                        why, { t: 'stays', act, ask: 'dir', answer: `It ${dir}.` });
                },
            },

            // ── Level 2: the solvent formula, changing the concentration, mixing ──
            {
                id: 'solution-from-solvent', name: 'Solution = solvent ÷ (1 − concentration)', level: 2,
                gen(rng) {
                    const [M, p] = rng.pick(BASIC.filter(([, p]) => p >= 4)), K = pickK(rng, p), s = M * p / 100, W = M - s, v = rng.int(0, 2);
                    must(near(conc({ m: W / (1 - p / 100), s: W / (1 - p / 100) - W }), p) && near(W / (1 - p / 100), M), 'solution-from-solvent');
                    const head = R`The water is ${m(R`100${PC}-${p}${PC}=${100 - p}${PC}`)} of the solution, so the solution is ${m(R`${W}${DIV}${100 - p}${PC}=${M}`)} g.`;
                    if (v === 0) return prob(`Some ${K.s} is dissolved in ${W} g of water to make ${p}% ${K.w}. How many grams of ${K.w} are made?`, g(M), head, { t: 'solvent', W, p, want: 'M' });
                    if (v === 1) return prob(`How many grams of ${K.s} must be dissolved in ${W} g of water to make ${p}% ${K.w}?`, g(s),
                        head + R` ${cap(K.s)}: ${m(`${M}-${W}=${s}`)} g.`, { t: 'solvent', W, p, want: 's' });
                    return prob(`A bowl of ${p}% ${K.w} contains ${W} g of water. How many grams of ${K.s} does it contain?`, g(s),
                        head + R` ${cap(K.s)}: ${m(`${M}-${W}=${s}`)} g.`, { t: 'solvent', W, p, want: 's' });
                },
            },
            {
                id: 'add-solute', name: 'Add or remove solute', level: 2,
                gen(rng) {
                    const v = rng.pick([0, 0, 1, 1, 2, 3]);
                    if (v <= 1) {
                        const { M, p, q, x, M2, W } = rng.pick(ADD), K = pickK(rng, q);
                        must(near(conc(plus(mk(M, p), solute(x))), q) && near(mk(M, p).m - mk(M, p).s, W), 'add-solute');
                        if (v === 0) return prob(`How many grams of ${K.s} must be added to ${M} g of ${p}% ${K.w} to raise its concentration to ${q}%?`, g(x),
                            R`The solvent does not change: ${m(R`${M}${X}(1-${p}${PC})=${W}`)} g of water. Afterwards the solution is ${m(R`${W}${DIV}(1-${q}${PC})=${M2}`)} g. Add ${m(`${M2}-${M}=${x}`)} g of ${K.s}.`,
                            { t: 'find', M, p, op: 'solute', target: q });
                        return prob(`${x} g of ${K.s} is stirred into ${M} g of ${p}% ${K.w} and dissolves completely. What is the concentration now?`, pct(q),
                            R`${cap(K.s)}: ${m(R`${M}${X}${p}${PC}+${x}=${M * p / 100}+${x}=${M * p / 100 + x}`)} g. Solution: ${m(`${M}+${x}=${M2}`)} g. ${m(R`${M * p / 100 + x}${DIV}${M2}=${q}${PC}`)}.`,
                            { t: 'sim', M, p, steps: [['solute', x]] });
                    }
                    const { M, p, q, x, M2, W } = rng.pick(REMOVE), K = pickCrystal(rng, p);
                    must(near(conc(minus(mk(M, p), solute(x))), q) && near(M - M * p / 100, W), 'remove-solute');
                    const lead = `${M} g of ${p}% ${K.w} is cooled, and some ${K.s} comes out as crystals, which are lifted out.`;
                    if (v === 2) return prob(`${lead} The ${K.w} left is ${q}%. How many grams of ${K.s} crystals were removed?`, g(x),
                        R`The solvent does not change: ${m(R`${M}${X}(1-${p}${PC})=${W}`)} g of water. Afterwards the solution is ${m(R`${W}${DIV}(1-${q}${PC})=${M2}`)} g. Removed: ${m(`${M}-${M2}=${x}`)} g.`,
                        { t: 'find', M, p, op: 'remove', target: q });
                    return prob(`${M} g of ${p}% ${K.w} is cooled, and ${x} g of ${K.s} comes out as crystals, which are lifted out. What is the concentration of the ${K.w} left?`, pct(q),
                        R`${cap(K.s)} left: ${m(R`${M}${X}${p}${PC}-${x}=${M * p / 100 - x}`)} g. Solution left: ${m(`${M}-${x}=${M2}`)} g. ${m(R`${M * p / 100 - x}${DIV}${M2}=${q}${PC}`)}.`,
                        { t: 'sim', M, p, steps: [['remove', x]] });
                },
            },
            {
                id: 'add-water', name: 'Add solvent: diluting with water', level: 2,
                gen(rng) {
                    const { M, p, q, w, M2 } = rng.pick(DILUTE), K = pickK(rng, p), s = M * p / 100, v = rng.int(0, 2);
                    must(near(conc(plus(mk(M, p), water(w))), q) && near(M + w, M2), 'add-water');
                    const head = R`The solute does not change: ${m(R`${M}${X}${p}${PC}=${s}`)} g of ${K.s}.`;
                    if (v === 0) return prob(`How many grams of water must be added to ${M} g of ${p}% ${K.w} to dilute it to ${q}%?`, g(w),
                        head + R` At ${q}% the solution must be ${m(R`${s}${DIV}${q}${PC}=${M2}`)} g, so add ${m(`${M2}-${M}=${w}`)} g of water.`,
                        { t: 'find', M, p, op: 'water', target: q });
                    if (v === 1) return prob(`${w} g of water is added to ${M} g of ${p}% ${K.w}. What is the concentration now?`, pct(q),
                        head + R` The solution is now ${m(`${M}+${w}=${M2}`)} g: ${m(R`${s}${DIV}${M2}=${q}${PC}`)}.`,
                        { t: 'sim', M, p, steps: [['water', w]] });
                    return prob(`Water is added to ${M} g of ${p}% ${K.w} until the concentration is ${q}%. How many grams of ${K.w} are there now?`, g(M2),
                        head + R` At ${q}% the solution is ${m(R`${s}${DIV}${q}${PC}=${M2}`)} g.`,
                        { t: 'findMass', M, p, op: 'water', target: q });
                },
            },
            {
                id: 'evaporate', name: 'Remove solvent: evaporating water', level: 2,
                gen(rng) {
                    const { M, p, q, w, M2 } = rng.pick(EVAP), K = pickK(rng, q), s = M * p / 100, v = rng.int(0, 2);
                    must(near(conc(minus(mk(M, p), water(w))), q) && near(M - w, M2), 'evaporate');
                    const how = rng.pick(['is boiled', 'is left in the sun', 'is gently heated']);
                    const head = R`Only solvent leaves; the solute stays: ${m(R`${M}${X}${p}${PC}=${s}`)} g of ${K.s}.`;
                    if (v === 0) return prob(`${M} g of ${p}% ${K.w} ${how} until its concentration is ${q}%. How many grams of water have evaporated?`, g(w),
                        head + R` At ${q}% the solution is ${m(R`${s}${DIV}${q}${PC}=${M2}`)} g, so ${m(`${M}-${M2}=${w}`)} g of water has gone.`,
                        { t: 'find', M, p, op: 'evap', target: q });
                    if (v === 1) return prob(`${M} g of ${p}% ${K.w} ${how} until ${w} g of water has evaporated. What is the concentration now?`, pct(q),
                        head + R` The solution is now ${m(`${M}-${w}=${M2}`)} g: ${m(R`${s}${DIV}${M2}=${q}${PC}`)}.`,
                        { t: 'sim', M, p, steps: [['evap', w]] });
                    return prob(`${M} g of ${p}% ${K.w} ${how} until its concentration is ${q}%. How many grams of ${K.w} are left?`, g(M2),
                        head + R` At ${q}% the solution is ${m(R`${s}${DIV}${q}${PC}=${M2}`)} g.`,
                        { t: 'findMass', M, p, op: 'evap', target: q });
                },
            },
            {
                id: 'mix-two', name: 'Concentration of a mixed solution', level: 2,
                gen(rng) {
                    const { A, B, p, q, t, sa, sb } = mixPair(rng), K = pickK(rng, p, q), big = Math.max(A, B, (A + B) * 0.8);
                    must(near(conc(plus(mk(A, p), mk(B, q))), t), 'mix-two');
                    const lead = rng.pick([`${A} g of ${p}% ${K.w} is mixed with ${B} g of ${q}% ${K.w}.`,
                        `Jar A holds ${A} g of ${p}% ${K.w} and jar B holds ${B} g of ${q}% ${K.w}. Both are poured into one bowl.`]);
                    return prob(`${lead} What is the concentration of the mixture?`, pct(t),
                        R`Total solute: ${m(R`${A}${X}${p}${PC}+${B}${X}${q}${PC}=${sa}+${sb}=${sa + sb}`)} g. Total solution: ${m(`${A}+${B}=${A + B}`)} g. Concentration: ${m(R`${sa + sb}${DIV}${A + B}=${t}${PC}`)}.`,
                        { t: 'mix', parts: [[A, p], [B, q]] },
                        F.row(beakers([bk(A, p, big), '+', bk(B, q, big), '=', bk(A + B, null, big)])));
                },
            },
            {
                id: 'mix-target', name: 'How much to mix for a target?', level: 2,
                gen(rng) {
                    for (;;) {
                        const [p, q] = rng.sample(MIXP, 2), lo = Math.min(p, q), hi = Math.max(p, q);
                        if (hi - lo < 8) continue;
                        const t = rng.int(lo + 2, hi - 2), dp = Math.abs(t - p), dq = Math.abs(q - t), K = pickK(rng, p, q);
                        if (rng.bool(0.6)) {
                            const A = rng.pick(MIXM), x = A * dp / dq;
                            if (!isInt(x) || x % 10 !== 0 || x < 40 || x > 1200 || !isInt(A * p / 100)) continue;
                            must(near(conc(plus(mk(A, p), mk(x, q))), t), 'mix-target');
                            return prob(`How many grams of ${q}% ${K.w} must be mixed with ${A} g of ${p}% ${K.w} to make ${t}% ${K.w}?`, g(x),
                                R`See-saw: ${p}% is ${dp} away from the target ${t}% and ${q}% is ${dq} away. Balance: ${m(R`${A}${X}${dp}=x${X}${dq}`)}, so ${m(R`x=${A * dp}${DIV}${dq}=${x}`)} g.`,
                                { t: 'mixFind', A, p, q, target: t },
                                F.row(beakers([bk(A, p, Math.max(A, x)), '+', bk(null, q, 1), '=', bk(null, t, 1)])));
                        }
                        const M = rng.pick([200, 300, 400, 500, 600, 800, 900, 1000, 1200]), a = M * dq / (dp + dq), askP = rng.bool(0.6);
                        if (!isInt(a) || a % 10 !== 0) continue;
                        must(near(conc(plus(mk(a, p), mk(M - a, q))), t), 'mix-target total');
                        const [wp, wq] = askP ? [p, q] : [q, p], ans = askP ? a : M - a, mine = askP ? dq : dp;
                        return prob(`${p}% ${K.w} and ${q}% ${K.w} are mixed to make ${M} g of ${t}% ${K.w}. How many grams of the ${wp}% ${K.w} are used?`, g(ans),
                            R`Distances from the target: ${p}% is ${dp} away, ${q}% is ${dq} away, so (mass of ${p}%) : (mass of ${q}%) ${m(`=${dq}:${dp}`)}. The ${wp}% part is ${m(R`${M}${X}\frac{${mine}}{${dq + dp}}=${ans}`)} g.`,
                            { t: 'mixTotal', p: wp, q: wq, M, target: t });
                    }
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'change-twice', name: 'Changing the concentration step by step', level: 3,
                gen(rng) {
                    for (;;) {
                        if (rng.bool(0.5)) {
                            const T = rng.pick(TWICE1), K = pickK(rng, T.p0), askThird = rng.bool(0.55);
                            const sp = T.s;
                            must(near(conc(plus(mk(T.M0, T.p0), water(T.w))), T.p1) && near(conc(plus(mk(T.M0, T.p0), water(2 * T.w))), T.p2) && near(conc(plus(mk(T.M0, T.p0), water(3 * T.w))), T.p3), 'change-twice water');
                            const lead = `Some water is added to a jar of ${K.w}, and its concentration becomes ${T.p1}%. Then the same amount of water is added again, and the concentration becomes ${T.p2}%.`;
                            const pre = R`The solute never changes, and the answer does not depend on how much there is, so pretend there is ${sp} g of ${K.s}. At ${T.p1}% the solution is ${m(R`${sp}${DIV}${T.p1}${PC}=${T.S1}`)} g; at ${T.p2}% it is ${m(R`${sp}${DIV}${T.p2}${PC}=${T.S2}`)} g. So each lot of water is ${m(`${T.S2}-${T.S1}=${T.w}`)} g.`;
                            if (askThird) return prob(`${lead} What will the concentration be if the same amount of water is added a third time?`, pct(T.p3),
                                pre + R` A third lot gives ${m(`${T.S2}+${T.w}=${T.S2 + T.w}`)} g: ${m(R`${sp}${DIV}${T.S2 + T.w}=${n(T.p3)}${PC}`)}.`,
                                { t: 'twice', p1: T.p1, p2: T.p2, ask: 'third' });
                            return prob(`${lead} What was the concentration at the start?`, pct(T.p0),
                                pre + R` At the start: ${m(`${T.S1}-${T.w}=${T.M0}`)} g, so ${m(R`${sp}${DIV}${T.M0}=${n(T.p0)}${PC}`)}.`,
                                { t: 'twice', p1: T.p1, p2: T.p2, ask: 'start' });
                        }
                        // From M g of p% make M2 g of q% by adding both solute and water.
                        const M = rng.pick([100, 150, 200, 250, 300, 400, 500]), p = rng.pick([5, 8, 10, 12, 15, 20, 25]), q = rng.pick([10, 12, 15, 16, 20, 24, 25, 30, 40]);
                        const M2 = M + rng.pick([50, 100, 150, 200, 250, 300, 400, 500]);
                        const s1 = M * p / 100, s2 = M2 * q / 100, x = s2 - s1, w = M2 - M - x;
                        if (!isInt(s1) || !isInt(s2) || x <= 0 || w <= 0 || q <= p) continue;
                        must(near(conc(plus(mk(M, p), solute(x), water(w))), q) && near(M + x + w, M2), 'change-twice make');
                        const K = pickK(rng, q), wantWater = rng.bool(0.5);
                        return prob(`A cook has ${M} g of ${p}% ${K.w}. By adding some ${K.s} and some water, she wants to end up with ${M2} g of ${q}% ${K.w}. How many grams of ${wantWater ? 'water' : K.s} must she add?`,
                            g(wantWater ? w : x),
                            R`${cap(K.s)} needed at the end: ${m(R`${M2}${X}${q}${PC}=${s2}`)} g; she has ${m(R`${M}${X}${p}${PC}=${s1}`)} g, so add ${m(`${s2}-${s1}=${x}`)} g of ${K.s}.` +
                                (wantWater ? R` Everything added weighs ${m(`${M2}-${M}=${M2 - M}`)} g, so the water is ${m(`${M2 - M}-${x}=${w}`)} g.` : ''),
                            { t: 'make', M, p, M2, q, want: wantWater ? 'w' : 's' });
                    }
                },
            },
            {
                id: 'mix-three', name: 'Mixing three solutions', level: 3,
                gen(rng) {
                    const { A, B, C, p, q, r, t, s } = mixTriple(rng), K = pickK(rng, p, q, r), big = Math.max(A, B, C);
                    must(near(conc(plus(mk(A, p), mk(B, q), mk(C, r))), t), 'mix-three');
                    if (rng.bool(0.5)) return prob(`Three jars of ${K.w} are poured together: ${A} g at ${p}%, ${B} g at ${q}% and ${C} g at ${r}%. What is the concentration of the mixture?`, pct(t),
                        R`Total solute: ${m(R`${A}${X}${p}${PC}+${B}${X}${q}${PC}+${C}${X}${r}${PC}=${s[0]}+${s[1]}+${s[2]}=${s[0] + s[1] + s[2]}`)} g. Total solution: ${m(`${A}+${B}+${C}=${A + B + C}`)} g. ${m(R`${s[0] + s[1] + s[2]}${DIV}${A + B + C}=${t}${PC}`)}.`,
                        { t: 'mix', parts: [[A, p], [B, q], [C, r]] },
                        F.row(beakers([bk(A, p, big), '+', bk(B, q, big), '+', bk(C, r, big)], { bw: 52 })));
                    const gap = (A * (p - t) + B * (q - t)) / 100;       // solute above (+) or below (−) the target in the first two
                    must(near(gap * 100 / (t - r), C), 'mix-three mass');
                    return prob(`${A} g of ${p}% ${K.w} and ${B} g of ${q}% ${K.w} are poured into a bowl. How many grams of ${r}% ${K.w} must be added to make the whole mixture ${t}%?`, g(C),
                        R`Compare everything with the target ${t}%. The first two hold ${m(R`${A}${X}${p}${PC}+${B}${X}${q}${PC}=${s[0] + s[1]}`)} g of ${K.s}, but ${A + B} g at ${t}% would hold ${n((A + B) * t / 100)} g: ${n(Math.abs(gap))} g too ${gap > 0 ? 'much' : 'little'}. Each gram of the ${r}% solution is ${Math.abs(t - r)}% ${gap > 0 ? 'short' : 'over'}, so ${m(R`${n(Math.abs(gap))}${DIV}${Math.abs(t - r)}${PC}=${C}`)} g.`,
                        { t: 'mixFind3', A, p, B, q, r, target: t },
                        F.row(beakers([bk(A, p, big), '+', bk(B, q, big), '+', bk(null, r, 1)], { bw: 52 })));
                },
            },
            {
                id: 'mix-unknown', name: 'Mixing: the unknown concentration or ratio', level: 3,
                gen(rng) {
                    if (rng.bool(0.5)) {
                        const { A, B, p, q, t, sa, sb } = mixPair(rng), K = pickK(rng, p, q), big = Math.max(A, B, (A + B) * 0.8);
                        must(near((mk(A + B, t).s - mk(A, p).s) / B * 100, q), 'mix-unknown conc');
                        const total = (A + B) * t / 100;
                        return prob(`${A} g of ${p}% ${K.w} is mixed with ${B} g of ${K.w} from a second jar. The mixture is ${t}% ${K.w}. What was the concentration in the second jar?`, pct(q),
                            R`The mixture holds ${m(R`${A + B}${X}${t}${PC}=${n(total)}`)} g of ${K.s}. The first jar gave ${m(R`${A}${X}${p}${PC}=${sa}`)} g, so the second gave ${m(`${n(total)}-${sa}=${sb}`)} g: ${m(R`${sb}${DIV}${B}=${q}${PC}`)}.`,
                            { t: 'mixUnknown', A, p, B, target: t },
                            F.row(beakers([bk(A, p, big), '+', bk(B, null, big), '=', bk(A + B, t, big)])));
                    }
                    for (;;) {
                        const [p, q] = rng.sample(MIXP, 2), lo = Math.min(p, q), hi = Math.max(p, q);
                        if (hi - lo < 6) continue;
                        const t = rng.int(lo + 1, hi - 1), dp = Math.abs(t - p), dq = Math.abs(q - t), K = pickK(rng, p, q);
                        if (dp === dq && rng.bool(0.8)) continue;
                        must(near(conc(plus(mk(dq, p), mk(dp, q))), t), 'mix-unknown ratio');
                        const gg = CA.gcd(dq, dp);
                        return prob(`${p}% ${K.w} and ${q}% ${K.w} are mixed to make ${t}% ${K.w}. Find the ratio (mass of the ${p}% solution) : (mass of the ${q}% solution), in simplest form.`,
                            CA.ratio([dq, dp]),
                            R`Distances from the target: ${p}% is ${dp} away, ${q}% is ${dq} away. The masses are in the inverse ratio: ${m(`${dq}:${dp}` + (gg > 1 ? `=${dq / gg}:${dp / gg}` : ''))}.`,
                            { t: 'mixRatio', p, q, target: t });
                    }
                },
            },
            {
                id: 'pouring', name: 'Pouring: refill and swap', level: 3,
                gen(rng) {
                    const v = rng.pick([0, 0, 1, 2]);
                    if (v === 0) {
                        const { M, x, num, den, k, p, c } = rng.pick(POUR), K = pickK(rng, p);
                        let a = mk(M, p);
                        for (let i = 0; i < k; i++) a = plus(minus(a, part(a, x)), water(x));
                        must(near(conc(a), c) && near(a.m, M), 'pour-and-refill');
                        const times = k === 2 ? 'This is then done a second time.' : 'This is then done a second time and a third time.';
                        const story = `${x} g is poured out and replaced by ${x} g of water, and the bottle is shaken. ${times}`;
                        const keep = CA.tex.frac(num, den), chain = Array.from({ length: k }, () => keep).join(X);
                        if (isInt(c) && rng.bool(0.35)) return prob(`A bottle holds ${M} g of ${K.w}. ${story} The concentration is now ${n(c)}%. What was the concentration at the start?`, pct(p),
                            R`Each round keeps ${m(R`\frac{${M - x}}{${M}}=${keep}`)} of the ${K.s}, and the bottle is back to ${M} g. So ${m(R`\text{start}${X}${chain}=${n(c)}${PC}`)}, and the start was ${m(R`${n(c)}${PC}${DIV}${CA.tex.frac(num ** k, den ** k)}=${p}${PC}`)}.`,
                            { t: 'pourBack', M, x, k, c });
                        return prob(`A bottle holds ${M} g of ${p}% ${K.w}. ${story} What is the concentration now?`, pct(c),
                            R`Each round keeps ${m(R`\frac{${M - x}}{${M}}=${keep}`)} of the ${K.s}, and the bottle is back to ${M} g. ${m(R`${p}${PC}${X}${chain}=${n(c)}${PC}`)}.`,
                            { t: 'pour', M, x, k, p });
                    }
                    if (v === 1) {
                        const { M, M2, x, p, s1, cB, sA, s2, cA } = rng.pick(SWAP), K = pickK(rng, p), askA = rng.bool(0.7);
                        let a = mk(M, p), b = water(M2);
                        let move = part(a, x); a = minus(a, move); b = plus(b, move);
                        must(near(conc(b), cB), 'swap-cups B');
                        move = part(b, x); b = minus(b, move); a = plus(a, move);
                        must(near(conc(a), cA) && near(conc(b), cB) && near(a.m, M), 'swap-cups A');
                        const step1 = R`First pour: ${x} g carries ${m(R`${x}${X}${p}${PC}=${s1}`)} g of ${K.s} into B, which now holds ${M2 + x} g at ${m(R`${s1}${DIV}${M2 + x}=${n(cB)}${PC}`)}.`;
                        return prob(`Cup A holds ${M} g of ${p}% ${K.w} and cup B holds ${M2} g of pure water. First ${x} g is poured from A into B and stirred. Then ${x} g of the mixture is poured from B back into A and stirred. What is the concentration in cup ${askA ? 'A' : 'B'} now?`,
                            pct(askA ? cA : cB),
                            askA
                                ? step1 + R` Second pour: A has ${m(R`${M - x}${X}${p}${PC}=${sA}`)} g left and gets back ${m(R`${x}${X}${n(cB)}${PC}=${n(s2)}`)} g, in ${M} g again: ${m(R`${n(sA + s2)}${DIV}${M}=${n(cA)}${PC}`)}.`
                                : step1 + ` Pouring some of B back into A does not change how strong B is: it stays ${n(cB)}%.`,
                            { t: 'swap', M, M2, x, p, cup: askA ? 'A' : 'B' },
                            F.row(beakers([bk(M, p, Math.max(M, M2), 'A'), ' ', bk(M2, 0, Math.max(M, M2), 'B')])));
                    }
                    const { A, B, x } = rng.pick(EQUAL);
                    let p, q;
                    do { [p, q] = rng.sample([5, 10, 12, 15, 20, 24, 25, 30, 36, 40, 45, 50, 60], 2); } while (Math.abs(p - q) < 5);
                    const K = pickK(rng, p, q);
                    const a0 = mk(A, p), b0 = mk(B, q);
                    const a1 = plus(minus(a0, part(a0, x)), part(b0, x)), b1 = plus(minus(b0, part(b0, x)), part(a0, x));
                    must(near(conc(a1), conc(b1)) && near(a1.m, A) && near(b1.m, B), 'equal-swap');
                    return prob(`Cup A holds ${A} g of ${p}% ${K.w} and cup B holds ${B} g of ${q}% ${K.w}. The same mass is scooped out of each cup, and each scoop is poured into the other cup. After stirring, the two cups have exactly the same concentration. How many grams were scooped out of each cup?`,
                        g(x),
                        R`Equal concentrations means each cup now holds the two original liquids in the same ratio as the whole lot, ${m(`${A}:${B}`)}. Cup A still holds ${A} g, so the part that came from B is ${m(R`${A}${X}\frac{${B}}{${A + B}}=${x}`)} g — that is the scoop.`,
                        { t: 'equal', A, B, p, q },
                        F.row(beakers([bk(A, p, Math.max(A, B), 'A'), ' ', bk(B, q, Math.max(A, B), 'B')])));
                },
            },
            {
                id: 'dried-fruit', name: 'Drying out', level: 3,
                gen(rng) {
                    const { M, w1, w2, solid, M2 } = rng.pick(DRY), wantLost = rng.bool(0.4);
                    const fresh = { m: M, s: M * (100 - w1) / 100 }, dried = minus(fresh, water(M - M2));
                    must(near(100 - conc(dried), w2) && near(dried.s, solid), 'dried-fruit');
                    const [thing, verb] = rng.pick([['fresh grapes', 'are'], ['fresh mushrooms', 'are'], ['watermelon', 'is'], ['cucumbers', 'are'], ['fresh seaweed', 'is'], ['tomatoes', 'are'], ['fresh apricots', 'are']]);
                    return prob(`${M} kg of ${thing} ${verb} ${w1}% water. After drying in the sun for a while, ${verb === 'is' ? 'it is' : 'they are'} ${w2}% water. ` +
                            (wantLost ? 'How many kilograms of water have evaporated?' : `How many kilograms ${verb === 'is' ? 'does it' : 'do they'} weigh now?`),
                        CA.num(wantLost ? M - M2 : M2, 'kg'),
                        R`Only water (the solvent) leaves, so the solid part does not change: ${m(R`${M}${X}${100 - w1}${PC}=${n(solid)}`)} kg. Afterwards it is ${m(R`${100 - w2}${PC}`)} of the mass, so the mass is ${m(R`${n(solid)}${DIV}${100 - w2}${PC}=${M2}`)} kg.` + (wantLost ? R` Water lost: ${m(`${M}-${M2}=${M - M2}`)} kg.` : ''),
                        { t: 'dry', M, w1, w2, want: wantLost ? 'lost' : 'M2' });
                },
            },
        ],

        assignment: [
            ['find-concentration', 4], ['find-solute', 4], ['find-solution', 4], ['what-stays', 3],
            ['solution-from-solvent', 4], ['add-solute', 4], ['add-water', 4], ['evaporate', 4], ['mix-two', 4], ['mix-target', 3],
            ['change-twice', 3], ['mix-three', 2], ['mix-unknown', 2], ['pouring', 3], ['dried-fruit', 2],
        ],
    });
})();
