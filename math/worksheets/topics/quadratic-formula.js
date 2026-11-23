/* Worksheet: Quadratic Formula — coefficients, the discriminant, factoring, and solving ax² + bx + c = 0. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, T = CA.tex;

    // ── Writing algebra ──────────────────────────────────────────────────
    function terms(list) {
        let s = '';
        for (const [c, v] of list) {
            if (c === 0) continue;
            const abs = Math.abs(c), body = v ? (abs === 1 ? v : `${abs}${v}`) : String(abs);
            s += s ? (c < 0 ? ` - ${body}` : ` + ${body}`) : (c < 0 ? `-${body}` : body);
        }
        return s || '0';
    }
    const lin = (a, b, v = 'x') => terms([[a, v], [b, '']]);
    const quad = (a, b, c, v = 'x') => terms([[a, `${v}^2`], [b, v], [c, '']]);
    const br = (a, b, v = 'x') => `(${lin(a, b, v)})`;
    const par = n => (n < 0 ? `(${n})` : String(n));
    const nz = (rng, lo, hi) => { let v; do v = rng.int(lo, hi); while (v === 0); return v; };
    const disc = (a, b, c) => b * b - 4 * a * c;
    /** "Δ = b² − 4ac = (−5)² − 4(1)(6) = 1" */
    // (Split into two maths pieces so a narrow answer-key column can wrap between them.)
    const discWork = (a, b, c) => R`\Delta = ${par(b)}^2 - 4(${a})(${c})\) \(= ${b * b} ${-4 * a * c < 0 ? '-' : '+'} ${Math.abs(4 * a * c)} = ${disc(a, b, c)}`;
    /** The formula with numbers in it, for a perfect-square discriminant. */
    const formulaWork = (a, b, c) => {
        const D = disc(a, b, c), s = Math.round(Math.sqrt(D));
        const r1 = CA.reduce(-b + s, 2 * a), r2 = CA.reduce(-b - s, 2 * a);
        return R`\(x = \dfrac{${-b} \pm ${s}}{${2 * a}}\), so \(x = ${T.frac(...r1)}\) or \(x = ${T.frac(...r2)}\)`;
    };

    // ── Factoring choices ────────────────────────────────────────────────
    /** Multiple choice for x² + (p+q)x + pq: the right brackets and brackets real slips give. */
    function factorMC(rng, p, q) {
        const key = (u, v) => [u, v].sort((s, t) => s - t).join(',');
        const right = key(p, q), seen = new Set([right]);
        const show = (u, v) => m(u === v ? `${br(1, u)}^2` : `${br(1, u)}${br(1, v)}`);
        const cands = [[-p, -q], [p, -q], [-p, q], [p + q, 1], [p * q, 1], [p + 1, q - 1], [p - 1, q + 1], [-p - 1, -q + 1]];
        const wrong = [];
        for (const [u, v] of cands) {
            if (u === 0 || v === 0) continue;
            const k = key(u, v);
            if (seen.has(k)) continue;
            seen.add(k); wrong.push(show(u, v));
        }
        return CA.mc(rng, show(p, q), wrong);
    }

    // ── Roots in simplest radical form ───────────────────────────────────
    /** TeX for (B ± K√S) / A2 after cancelling a common factor; S is square-free and > 1. */
    function surd(B, K, S, A2) {
        let g = CA.gcd(CA.gcd(Math.abs(B), K), Math.abs(A2));
        if (A2 < 0) g = -g;
        B /= g; K /= g; A2 /= g;
        const top = `${B === 0 ? '' : `${B} `}\\pm ${K === 1 ? '' : Math.abs(K)}\\sqrt{${S}}`;
        return { tex: A2 === 1 ? top : R`\dfrac{${top}}{${A2}}`, vals: [(B + Math.abs(K) * Math.sqrt(S)) / A2, (B - Math.abs(K) * Math.sqrt(S)) / A2].sort((x, y) => x - y) };
    }
    /** Roots of ax² + bx + c = 0 as surd(), or null if the discriminant is not a positive non-square. */
    function surdRoots(a, b, c) {
        const D = disc(a, b, c);
        if (D <= 0) return null;
        const [k, s] = CA.simplifyRoot(D);
        if (s === 1) return null;
        return surd(-b, k, s, 2 * a);
    }

    CA.register({
        id: 'quadratic-formula',
        title: 'Quadratic Formula',
        page: 'quadratic-formula.html',
        assignmentNote: R`For \(ax^2 + bx + c = 0\): \(x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}\) and \(\Delta = b^2 - 4ac\). Give answers that are not whole numbers as fractions in lowest terms.`,

        practice: [
            {
                id: 'coefficients', name: 'Find a, b and c', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 3), which = rng.pick(['a', 'b', 'c']);
                    const a = nz(rng, -5, 7), b = nz(rng, -12, 12), c = nz(rng, -15, 15);
                    const val = { a, b, c };
                    if (kind === 0) return { q: R`Compare \(${quad(a, b, c)} = 0\) with \(ax^2 + bx + c = 0\). What is \(${which}\)?`, ans: CA.num(val[which]), sol: R`\(${which}\) is ${which === 'a' ? R`the number in front of \(x^2\)` : which === 'b' ? R`the number in front of \(x\)` : 'the constant term'}, sign included: \(${which} = ${val[which]}\).` };
                    if (kind === 1) {
                        const noB = rng.bool();
                        const eq = noB ? quad(a, 0, c) : quad(a, b, 0), ask = noB ? 'b' : 'c';
                        return { q: R`Compare \(${eq} = 0\) with \(ax^2 + bx + c = 0\). What is \(${ask}\)?`, ans: CA.num(0), sol: R`There is no ${noB ? R`\(x\)` : 'constant'} term, so \(${ask} = 0\).` };
                    }
                    if (kind === 2) {
                        const eq = terms([[c, ''], [b, 'x'], [a, 'x^2']]);
                        return { q: R`The equation \(${eq} = 0\) is written as \(ax^2 + bx + c = 0\). What is \(${which}\)?`, ans: CA.num(val[which]), sol: R`Reorder it: \(${quad(a, b, c)} = 0\). So \(${which} = ${val[which]}\).` };
                    }
                    const k = nz(rng, -15, 15), A = Math.abs(a);
                    return { q: R`Rearrange \(${quad(A, b, 0)} = ${k}\) into the form \(ax^2 + bx + c = 0\) with \(a = ${A}\). What is \(c\)?`, ans: CA.num(-k), sol: R`${k > 0 ? 'Subtract' : 'Add'} ${Math.abs(k)} on both sides: \(${quad(A, b, -k)} = 0\), so \(c = ${-k}\).` };
                },
            },
            {
                id: 'discriminant', name: 'The discriminant', level: 1,
                gen(rng) {
                    const a = nz(rng, -4, 5), b = rng.int(-10, 10), c = nz(rng, -12, 12);
                    if (b === 0 && rng.bool(0.7)) return this.gen(rng);
                    return {
                        q: R`Find the discriminant \(\Delta = b^2 - 4ac\) of \(${quad(a, b, c)} = 0\).`,
                        ans: CA.num(disc(a, b, c)),
                        sol: R`\(a = ${a}\), \(b = ${b}\), \(c = ${c}\): \(${discWork(a, b, c)}\).`,
                    };
                },
            },
            {
                id: 'factor-easy', name: 'Factor (positive numbers)', level: 1,
                gen(rng) {
                    const p = rng.int(1, 7), q = rng.int(1, 7);
                    return {
                        q: R`Factor \(${quad(1, p + q, p * q)}\).`,
                        ans: factorMC(rng, p, q),
                        sol: R`Find two numbers that add to \(${p + q}\) and multiply to \(${p * q}\): \(${p}\) and \(${q}\). So \(${quad(1, p + q, p * q)} = ${p === q ? `${br(1, p)}^2` : br(1, p) + br(1, q)}\).`,
                    };
                },
            },
            {
                id: 'solve-monic', name: 'Solve with a = 1', level: 1,
                gen(rng) {
                    const r1 = nz(rng, -6, 6), r2 = nz(rng, -6, 6);
                    const b = -(r1 + r2), c = r1 * r2;
                    const eq = R`\(${quad(1, b, c)} = 0\)`;
                    if (r1 === r2) return { q: R`Solve ${eq}. (It has one repeated solution.)`, ans: CA.num(r1), sol: R`\(\Delta = ${par(b)}^2 - 4(${c}) = 0\); \(x = \dfrac{-b}{2a} = ${r1}\). Or factor: \(${br(1, -r1)}^2 = 0\).` };
                    const big = rng.bool();
                    return {
                        q: R`Solve ${eq}. Give the ${big ? 'larger' : 'smaller'} solution.`,
                        ans: CA.num(big ? Math.max(r1, r2) : Math.min(r1, r2)),
                        sol: R`Factor: \(${br(1, -r1)}${br(1, -r2)} = 0\), so \(x = ${r1}\) or \(x = ${r2}\). The ${big ? 'larger' : 'smaller'} is \(${big ? Math.max(r1, r2) : Math.min(r1, r2)}\).`,
                    };
                },
            },
            {
                id: 'how-many', name: 'How many solutions?', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    let a, b, c;
                    if (kind === 0) {                                  // repeated root: (px + r)^2 times k
                        const p = rng.int(1, 3), r = nz(rng, -7, 7), k = rng.pick([1, 1, 2, -1]);
                        a = k * p * p; b = k * 2 * p * r; c = k * r * r;
                    } else {
                        do { a = nz(rng, -3, 4); b = rng.int(-9, 9); c = nz(rng, -12, 12); } while (kind === 1 ? disc(a, b, c) <= 0 : disc(a, b, c) >= 0);
                    }
                    const D = disc(a, b, c), opts = ['Two different real solutions', 'Exactly one (repeated) real solution', 'No real solutions'];
                    const correct = opts[D > 0 ? 0 : D === 0 ? 1 : 2];
                    return {
                        q: R`How many real solutions does \(${quad(a, b, c)} = 0\) have?`,
                        ans: CA.mc(rng, correct, opts, { keepOrder: true }),
                        sol: R`\(${discWork(a, b, c)}\), which is ${D > 0 ? 'positive: two solutions' : D === 0 ? 'zero: one repeated solution' : 'negative: no real solutions'}.`,
                    };
                },
            },
            {
                id: 'factor-signs', name: 'Factor (negative numbers too)', level: 2,
                gen(rng) {
                    const big = rng.bool(0.4), p = nz(rng, big ? -13 : -9, big ? 13 : 9), q = nz(rng, big ? -13 : -9, big ? 13 : 9);
                    if (p > 0 && q > 0) return this.gen(rng);
                    return {
                        q: R`Factor \(${quad(1, p + q, p * q)}\).`,
                        ans: factorMC(rng, p, q),
                        sol: R`Find two numbers that add to \(${p + q}\) and multiply to \(${p * q}\): \(${p}\) and \(${q}\). So \(${p === q ? `${br(1, p)}^2` : br(1, p) + br(1, q)}\).`,
                    };
                },
            },
            {
                id: 'solve-formula', name: 'Solve with a > 1', level: 2,
                gen(rng) {
                    const a = rng.int(2, 4), r1 = nz(rng, -9, 9), r2 = nz(rng, -9, 9);
                    if (r1 === r2) return this.gen(rng);
                    const b = -a * (r1 + r2), c = a * r1 * r2, ask = rng.pick(['larger', 'larger', 'smaller', 'smaller', 'sum', 'product']);
                    const val = ask === 'larger' ? Math.max(r1, r2) : ask === 'smaller' ? Math.min(r1, r2) : ask === 'sum' ? r1 + r2 : r1 * r2;
                    const what = ask === 'sum' ? 'What is the sum of its two solutions?' : ask === 'product' ? 'What is the product of its two solutions?' : `Give the ${ask} solution.`;
                    return {
                        q: R`Solve \(${quad(a, b, c)} = 0\). ${what}`,
                        ans: CA.num(val),
                        sol: R`\(${discWork(a, b, c)}\), \(\sqrt{\Delta} = ${Math.abs(a * (r1 - r2))}\). ${formulaWork(a, b, c)}.${ask === 'sum' || ask === 'product' ? R` The ${ask} is \(${val}\).` : ''}`,
                    };
                },
            },
            {
                id: 'fraction-root', name: 'Solutions that are fractions', level: 2,
                gen(rng) {
                    const a = rng.int(2, 4); let mm;
                    do mm = nz(rng, -9, 9); while (mm % a === 0);
                    const n = nz(rng, -7, 7);
                    const b = -(a * n + mm), c = mm * n;                       // (ax − m)(x − n)
                    const ask = rng.pick(['fraction', 'fraction', 'larger', 'smaller']);
                    const f = mm / a, val = ask === 'fraction' ? [mm, a] : (ask === 'larger') === (f > n) ? [mm, a] : [n, 1];
                    return {
                        q: R`Solve \(${quad(a, b, c)} = 0\). ${ask === 'fraction' ? 'Give the solution that is not a whole number.' : `Give the ${ask} solution.`}`,
                        ans: CA.frac(...val),
                        sol: R`\(${discWork(a, b, c)}\). ${formulaWork(a, b, c)}.`,
                    };
                },
            },
            {
                id: 'vertex', name: 'The turning point', level: 2,
                gen(rng) {
                    const a = nz(rng, -3, 4), b = nz(rng, -10, 10), c = rng.int(-9, 9);
                    const kind = rng.int(0, 2);
                    const xv = CA.reduce(-b, 2 * a), yv = CA.reduce(4 * a * c - b * b, 4 * a);
                    if (kind === 0) return { q: R`Find the \(x\)-coordinate of the vertex (turning point) of \(y = ${quad(a, b, c)}\).`, ans: CA.frac(...xv), sol: R`\(x = \dfrac{-b}{2a} = \dfrac{-${par(b)}}{2\times${par(a)}} = ${T.frac(...xv)}\).` };
                    if (kind === 1) return { q: R`The parabola \(y = ${quad(a, b, c)}\) is symmetric about a vertical line \(x = k\). Find \(k\).`, ans: CA.frac(...xv), sol: R`The axis of symmetry passes through the vertex: \(k = \dfrac{-b}{2a} = \dfrac{-${par(b)}}{2\times${par(a)}} = ${T.frac(...xv)}\).` };
                    const x0 = nz(rng, -4, 4), bb = -2 * a * x0, y0 = a * x0 * x0 + bb * x0 + c;
                    return { q: R`Find the ${a > 0 ? 'smallest' : 'largest'} value of \(y = ${quad(a, bb, c)}\).`, ans: CA.num(y0), sol: R`The ${a > 0 ? 'minimum' : 'maximum'} is at the vertex, \(x = \dfrac{-b}{2a} = ${x0}\): \(y = ${a}(${x0})^2 ${bb < 0 ? '-' : '+'} ${Math.abs(bb)}(${x0}) ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${y0}\).` };
                },
            },
            {
                id: 'rearrange', name: 'Rearrange first', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                       // x² = px + q
                        const r1 = nz(rng, -8, 9), r2 = nz(rng, -8, 9);
                        if (r1 === r2 || r1 + r2 === 0) return this.gen(rng);
                        const p = r1 + r2, q = -r1 * r2;
                        return { q: R`Solve \(x^2 = ${lin(p, q)}\). Give the larger solution.`, ans: CA.num(Math.max(r1, r2)), sol: R`Make one side zero: \(${quad(1, -p, -q)} = 0\), so \(${br(1, -r1)}${br(1, -r2)} = 0\) and \(x = ${r1}\) or \(x = ${r2}\).` };
                    }
                    if (kind === 1) {                                       // x(x + k) = N, one positive root
                        const r1 = rng.int(1, 10), r2 = -rng.int(1, 10);
                        const k = -(r1 + r2), N = -r1 * r2;
                        if (k === 0) return this.gen(rng);
                        return { q: R`Solve \(x${br(1, k)} = ${N}\). Give the positive solution.`, ans: CA.num(r1), sol: R`Expand and make one side zero: \(${quad(1, k, -N)} = 0\), so \(${br(1, -r1)}${br(1, -r2)} = 0\) and \(x = ${r1}\) or \(x = ${r2}\).` };
                    }
                    const h = nz(rng, -8, 8), s = rng.int(1, 9), big = rng.bool();
                    return { q: R`Solve \(${br(1, h)}^2 = ${s * s}\). Give the ${big ? 'larger' : 'smaller'} solution.`, ans: CA.num(big ? -h + s : -h - s), sol: R`Square-root both sides: \(${lin(1, h)} = \pm ${s}\), so \(x = ${-h} \pm ${s}\), that is \(x = ${-h + s}\) or \(x = ${-h - s}\).` };
                },
            },
            {
                id: 'surd-roots', name: 'Solutions with square roots', level: 3,
                gen(rng) {
                    for (;;) {
                        const a = rng.pick([1, 1, 1, 2, 3]), b = rng.int(-8, 8), c = nz(rng, -9, 9);
                        const right = surdRoots(a, b, c);
                        if (!right) continue;
                        const D = disc(a, b, c), [k, s] = CA.simplifyRoot(D);
                        const cands = [surdRoots(a, -b, c), surd(-b, k, s, a), surdRoots(a, b, -c), k > 1 ? surd(-b, k * k, s, 2 * a) : null, surd(b, k, s, 2 * a)];
                        const same = (u, v) => Math.abs(u.vals[0] - v.vals[0]) < 1e-9 && Math.abs(u.vals[1] - v.vals[1]) < 1e-9;
                        const wrong = [];
                        for (const w of cands) if (w && !same(w, right) && !wrong.some(x => same(x, w) || x.tex === w.tex)) wrong.push(w);
                        if (wrong.length < 3) continue;
                        return {
                            q: R`Solve \(${quad(a, b, c)} = 0\). Give the solutions in simplest radical form.`,
                            ans: CA.mc(rng, m(R`x = ${right.tex}`), wrong.map(w => m(R`x = ${w.tex}`))),
                            sol: R`\(${discWork(a, b, c)}\) and \(\sqrt{${D}} = ${T.root(k, s)}\). So \(x = \dfrac{${-b} \pm ${T.root(k, s)}}{${2 * a}} = ${right.tex}\).`,
                        };
                    }
                },
            },
            {
                id: 'find-k', name: 'Find the missing number', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {                                      // x² + bx + k = 0 has a repeated root
                        const a = rng.pick([1, 1, 2, 3]), r = nz(rng, -7, 7), b = -2 * a * r, k = a * r * r;
                        return { q: R`For what value of \(k\) does \(${quad(a, b, 0)} + k = 0\) have exactly one solution?`, ans: CA.num(k), sol: R`One solution means \(\Delta = 0\): \(${par(b)}^2 - 4(${a})k = 0\), so \(${4 * a}k = ${b * b}\) and \(k = ${k}\).` };
                    }
                    if (kind === 1) {                                      // x² + kx + c = 0, k > 0, one solution
                        const r = rng.int(1, 10), c = r * r;
                        return { q: R`The equation \(x^2 + kx + ${c} = 0\) has exactly one solution, and \(k > 0\). Find \(k\).`, ans: CA.num(2 * r), sol: R`\(\Delta = k^2 - 4(${c}) = 0\), so \(k^2 = ${4 * c}\) and \(k = ${2 * r}\) (taking the positive value).` };
                    }
                    if (kind === 2) {                                      // one root given, find the other
                        const r1 = nz(rng, -9, 9), r2 = nz(rng, -9, 9);
                        if (r1 === r2) return this.gen(rng);
                        const b = -(r1 + r2), c = r1 * r2;
                        return { q: R`One solution of \(${quad(1, b, c)} = 0\) is \(x = ${r1}\). Find the other solution.`, ans: CA.num(r2), sol: R`The equation factors with \(${br(1, -r1)}\) as one bracket: \(${br(1, -r1)}${br(1, -r2)} = 0\), so the other solution is \(x = ${r2}\). (Check: \(${r1} + ${par(r2)} = ${-b} = -b\).)` };
                    }
                    const r1 = nz(rng, -8, 8), b = nz(rng, -9, 9), k = -(r1 * r1 + b * r1);
                    if (k === 0) return this.gen(rng);
                    return { q: R`\(x = ${r1}\) is a solution of \(${quad(1, b, 0)} + k = 0\). Find \(k\).`, ans: CA.num(k), sol: R`Substitute \(x = ${r1}\): \(${r1 * r1} ${b * r1 < 0 ? '-' : '+'} ${Math.abs(b * r1)} + k = 0\), so \(k = ${k}\).` };
                },
            },
            {
                id: 'word-quadratic', name: 'Quadratic word problems', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const w = rng.int(3, 15), d = rng.int(2, 9), A = w * (w + d);
                        return { q: `A rectangle is ${d} cm longer than it is wide, and its area is ${A} cm². How wide is it?`, ans: CA.num(w, 'cm'), sol: R`Width \(w\): \(w(w + ${d}) = ${A}\), so \(${quad(1, d, -A, 'w')} = 0\), which factors as \(${br(1, -w, 'w')}${br(1, w + d, 'w')} = 0\). The width is positive: \(w = ${w}\) cm.` };
                    }
                    if (kind === 1) {
                        const n = rng.int(4, 25), even = rng.bool(0.4), step = even ? 2 : 1, x = even ? 2 * n : n, N = x * (x + step);
                        return { q: `The product of two consecutive ${even ? 'even ' : ''}positive whole numbers is ${N}. What is the smaller number?`, ans: CA.num(x), sol: R`\(n(n + ${step}) = ${N}\) gives \(${quad(1, step, -N, 'n')} = 0\), that is \(${br(1, -x, 'n')}${br(1, x + step, 'n')} = 0\). The positive solution is \(n = ${x}\).` };
                    }
                    if (kind === 2) {
                        const t = rng.int(2, 6), s = rng.int(1, t - 1), v = 5 * (t - s), h0 = 5 * t * s;
                        return { q: R`A ball is thrown upward from a cliff. Its height above the sea after \(t\) seconds is \(h = ${quad(-5, v, h0, 't')}\) metres. After how many seconds does it hit the water?`, ans: CA.num(t, 's'), sol: R`Set \(h = 0\) and divide by \(-5\): \(${quad(1, -(t - s), -t * s, 't')} = 0\), so \(${br(1, -t, 't')}${br(1, s, 't')} = 0\). Time is positive, so \(t = ${t}\) s.` };
                    }
                    const n = rng.int(3, 20), N = n * n + n;
                    return { q: `A positive number added to its own square gives ${N}. What is the number?`, ans: CA.num(n), sol: R`\(n^2 + n = ${N}\), so \(${quad(1, 1, -N, 'n')} = 0\), which factors as \(${br(1, -n, 'n')}${br(1, n + 1, 'n')} = 0\). The positive solution is \(n = ${n}\).` };
                },
            },
        ],

        assignment: [
            ['coefficients', 3], ['discriminant', 4], ['factor-easy', 4], ['solve-monic', 4],
            ['how-many', 4], ['factor-signs', 4], ['solve-formula', 4], ['fraction-root', 4], ['vertex', 4], ['rearrange', 3],
            ['surd-roots', 4], ['find-k', 4], ['word-quadratic', 4],
        ],
    });
})();
