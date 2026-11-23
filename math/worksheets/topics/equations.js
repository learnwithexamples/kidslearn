/* Worksheet: Equations — solving equations, and expanding and factoring with the identities. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, T = CA.tex;

    // ── Writing algebra ──────────────────────────────────────────────────
    /** "3x", "-x", "x" for a coefficient of x (or of another variable). */
    const xt = (c, v = 'x') => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);
    /** Join signed terms: terms([[2,'x^2'],[-3,'x'],[5,'']]) → "2x^2 - 3x + 5". */
    function terms(list) {
        let s = '';
        for (const [c, v] of list) {
            if (c === 0) continue;
            const abs = Math.abs(c), body = v ? (abs === 1 ? v : `${abs}${v}`) : String(abs);
            s += s ? (c < 0 ? ` - ${body}` : ` + ${body}`) : (c < 0 ? `-${body}` : body);
        }
        return s || '0';
    }
    const lin = (a, b, v = 'x') => terms([[a, v], [b, '']]);           // ax + b
    const quad = (a, b, c, v = 'x') => terms([[a, `${v}^2`], [b, v], [c, '']]);
    const br = (a, b, v = 'x') => `(${lin(a, b, v)})`;                   // (ax + b)
    const par = n => (n < 0 ? `(${n})` : String(n));
    const nz = (rng, lo, hi) => { let v; do v = rng.int(lo, hi); while (v === 0); return v; };
    /** A value of x as an answer: whole number or fraction. */
    const xAns = (n, d = 1) => CA.frac(n, d);
    const xTex = (n, d = 1) => T.frac(n, d);

    CA.register({
        id: 'equations',
        title: 'Equations',
        page: 'equations.html',
        assignmentNote: 'Solve each equation for the letter shown, or expand / factor as asked. Give answers that are not whole numbers as fractions in lowest terms.',

        practice: [
            {
                id: 'one-step', name: 'One-step equations', level: 1,
                gen(rng) {
                    const x = rng.int(-12, 15), k = rng.int(0, 3);
                    if (k === 0) { const a = nz(rng, -15, 20); return { q: R`Solve \(x ${a < 0 ? '-' : '+'} ${Math.abs(a)} = ${x + a}\).`, ans: xAns(x), sol: R`${a < 0 ? 'Add' : 'Subtract'} ${Math.abs(a)} on both sides: \(x = ${x + a} ${a < 0 ? '+' : '-'} ${Math.abs(a)} = ${x}\).` }; }
                    if (k === 1) { const a = rng.int(2, 12) * (rng.bool(0.25) ? -1 : 1); return { q: R`Solve \(${a}x = ${a * x}\).`, ans: xAns(x), sol: R`Divide both sides by ${par(a)}: \(x = ${a * x} \div ${par(a)} = ${x}\).` }; }
                    if (k === 2) { const a = rng.int(2, 9); return { q: R`Solve \(\dfrac{x}{${a}} = ${x}\).`, ans: xAns(a * x), sol: R`Multiply both sides by ${a}: \(x = ${x}\times ${a} = ${a * x}\).` }; }
                    const a = rng.int(5, 30); return { q: R`Solve \(${a} - x = ${a - x}\).`, ans: xAns(x), sol: R`Add \(x\) to both sides: \(${a} = ${a - x} + x\). So \(x = ${a} - ${par(a - x)} = ${x}\).` };
                },
            },
            {
                id: 'two-step', name: 'Two-step equations', level: 1,
                gen(rng) {
                    const x = rng.int(-9, 12), a = nz(rng, -9, 9), b = nz(rng, -20, 20);
                    if (Math.abs(a) === 1) return this.gen(rng);
                    const c = a * x + b;
                    return {
                        q: R`Solve \(${lin(a, b)} = ${c}\).`,
                        ans: xAns(x),
                        sol: R`${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: \(${xt(a)} = ${c - b}\). Divide by ${par(a)}: \(x = ${x}\).`,
                    };
                },
            },
            {
                id: 'expand-pair', name: 'Expand two brackets', level: 1,
                gen(rng) {
                    const a = nz(rng, -9, 9), b = nz(rng, -9, 9);
                    const correct = quad(1, a + b, a * b), wrong = [quad(1, a * b, a + b), quad(1, a + b, -(a * b)), quad(1, a - b, a * b), quad(1, 0, a * b)];
                    return {
                        q: R`Expand \((x ${a < 0 ? '-' : '+'} ${Math.abs(a)})(x ${b < 0 ? '-' : '+'} ${Math.abs(b)})\).`,
                        ans: CA.mc(rng, m(correct), wrong.map(m)),
                        sol: R`Add for the middle term, multiply for the last: \(${par(a)} + ${par(b)} = ${a + b}\) and \(${par(a)}\times${par(b)} = ${a * b}\), so \(${correct}\).`,
                    };
                },
            },
            {
                id: 'distribute', name: 'Brackets first', level: 1,
                gen(rng) {
                    const x = rng.int(-8, 10), a = rng.int(2, 9), b = nz(rng, -9, 9);
                    return {
                        q: R`Solve \(${a}${br(1, b)} = ${a * (x + b)}\).`,
                        ans: xAns(x),
                        sol: R`Divide both sides by ${a}: \(${lin(1, b)} = ${x + b}\), so \(x = ${x}\). (Or expand: \(${lin(a, a * b)} = ${a * (x + b)}\).)`,
                    };
                },
            },
            {
                id: 'both-sides', name: 'Letters on both sides', level: 2,
                gen(rng) {
                    for (;;) {
                        const a = nz(rng, -9, 12), c = nz(rng, -9, 12);
                        if (a === c) continue;
                        const d0 = a - c, num = rng.int(-30, 30);                        // (a - c)x = d - b
                        const whole = rng.bool(0.75);
                        const xn = whole ? rng.int(-10, 12) : num, xd = whole ? 1 : d0;
                        if (!whole && (CA.reduce(xn, xd)[1] === 1 || Math.abs(xd) > 9)) continue;
                        const b = rng.int(-20, 20), dd = b + (whole ? d0 * xn : xn);       // d - b = (a - c)·x
                        return {
                            q: R`Solve \(${lin(a, b)} = ${lin(c, dd)}\).`,
                            ans: xAns(xn, xd),
                            sol: R`Move the \(x\) terms to the left and the numbers to the right: \(${xt(a - c)} = ${dd - b}\). So \(x = ${xTex(dd - b, a - c)}\).`,
                        };
                    }
                },
            },
            {
                id: 'brackets-both', name: 'Brackets on both sides', level: 2,
                gen(rng) {
                    for (;;) {
                        const p = rng.int(2, 6), q = nz(rng, -6, 6), r = rng.int(2, 6), s = nz(rng, -6, 6), x = rng.int(-6, 9);
                        if (p === r) continue;
                        const k = p * (x + q) - r * (x + s);                              // p(x+q) = r(x+s) + k
                        return {
                            q: R`Solve \(${p}${br(1, q)} = ${r}${br(1, s)}${k === 0 ? '' : k < 0 ? ` - ${-k}` : ` + ${k}`}\).`,
                            ans: xAns(x),
                            sol: R`Expand: \(${lin(p, p * q)} = ${lin(r, r * s + k)}\). Collect: \(${xt(p - r)} = ${r * s + k - p * q}\), so \(x = ${x}\).`,
                        };
                    }
                },
            },
            {
                id: 'fraction-eq', name: 'Equations with fractions', level: 2,
                gen(rng) {
                    const [a, b] = rng.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [4, 6], [2, 6], [3, 6], [5, 6]]);
                    const L = CA.lcm(a, b), x = L * rng.int(1, 6) * (rng.bool(0.2) ? -1 : 1);
                    if (rng.bool()) {
                        const c = x / a + x / b;
                        return {
                            q: R`Solve \(\dfrac{x}{${a}} + \dfrac{x}{${b}} = ${c}\).`,
                            ans: xAns(x),
                            sol: R`Multiply every term by ${L}: \(${xt(L / a)} + ${xt(L / b)} = ${c * L}\), so \(${xt(L / a + L / b)} = ${c * L}\) and \(x = ${x}\).`,
                        };
                    }
                    const c = x / a - x / b;
                    if (c === 0) return this.gen(rng);
                    return {
                        q: R`Solve \(\dfrac{x}{${a}} - \dfrac{x}{${b}} = ${c}\).`,
                        ans: xAns(x),
                        sol: R`Multiply every term by ${L}: \(${xt(L / a)} - ${xt(L / b)} = ${c * L}\), so \(${xt(L / a - L / b)} = ${c * L}\) and \(x = ${x}\).`,
                    };
                },
            },
            {
                id: 'perfect-square', name: 'Perfect squares', level: 2,
                gen(rng) {
                    const a = rng.int(1, 5), b = nz(rng, -9, 9), v = rng.pick(['x', 'y', 'n']);
                    const correct = quad(a * a, 2 * a * b, b * b, v);
                    const wrong = [quad(a * a, 0, b * b, v), quad(a * a, a * b, b * b, v), quad(a * a, 2 * a * b, -(b * b), v), quad(a, 2 * a * b, b * b, v), quad(a * a, -2 * a * b, b * b, v)];
                    return {
                        q: R`Expand \(${br(a, b, v)}^2\).`,
                        ans: CA.mc(rng, m(correct), wrong.filter(w => w !== correct).map(m)),
                        sol: R`Use \((p ${b < 0 ? '-' : '+'} q)^2 = p^2 ${b < 0 ? '-' : '+'} 2pq + q^2\) with \(p = ${xt(a, v)}\), \(q = ${Math.abs(b)}\): \(${correct}\). Don't forget the middle term!`,
                    };
                },
            },
            {
                id: 'factor', name: 'Factoring', level: 2,
                gen(rng) {
                    const kind = rng.pick(['trinomial', 'trinomial', 'diff', 'square']);
                    if (kind === 'diff') {
                        const a = rng.int(1, 5), b = rng.int(1, 12), v = rng.pick(['x', 'y', 'm']);
                        const correct = `(${lin(a, b, v)})(${lin(a, -b, v)})`;
                        return {
                            q: R`Factor \(${quad(a * a, 0, -(b * b), v)}\).`,
                            ans: CA.mc(rng, m(correct), [`(${lin(a, -b, v)})^2`, `(${lin(a, b, v)})^2`, `(${lin(a * a, b, v)})(${lin(1, -b, v)})`, `(${lin(a, b * b, v)})(${lin(a, -1, v)})`].map(m)),
                            sol: R`Difference of squares: \(p^2 - q^2 = (p + q)(p - q)\) with \(p = ${xt(a, v)}\), \(q = ${b}\).`,
                        };
                    }
                    if (kind === 'square') {
                        const b = nz(rng, -10, 10);
                        const correct = `${br(1, b)}^2`;
                        return {
                            q: R`Factor \(${quad(1, 2 * b, b * b)}\).`,
                            ans: CA.mc(rng, m(correct), [`${br(1, -b)}^2`, `${br(1, b)}${br(1, -b)}`, `${br(1, 2 * b)}${br(1, b / 2 === Math.round(b / 2) ? b / 2 : -b)}`].map(m)),
                            sol: R`\(${b * b} = ${Math.abs(b)}^2\) and \(${2 * b} = 2\times${par(b)}\): a perfect square, \(${correct}\).`,
                        };
                    }
                    let p, q;
                    do { p = nz(rng, -9, 9); q = nz(rng, -9, 9); } while (p === q || p === -q);
                    const correct = `${br(1, p)}${br(1, q)}`;
                    return {
                        q: R`Factor \(${quad(1, p + q, p * q)}\).`,
                        ans: CA.mc(rng, m(correct), [`${br(1, -p)}${br(1, -q)}`, `${br(1, p)}${br(1, -q)}`, `${br(1, -p)}${br(1, q)}`].map(m)),
                        sol: R`Find two numbers that multiply to ${p * q} and add to ${p + q}: ${p} and ${q}. So \(${correct}\).`,
                    };
                },
            },
            {
                id: 'identity-arith', name: 'Mental maths with identities', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {                                             // 103 × 97
                        const n = rng.pick([20, 30, 40, 50, 60, 70, 80, 100, 200]), d = rng.int(1, 9);
                        return { q: R`Use \((a+b)(a-b) = a^2 - b^2\) to work out \(${n + d}\times${n - d}\).`, ans: CA.num(n * n - d * d), sol: R`\(${n + d}\times${n - d} = (${n}+${d})(${n}-${d}) = ${n}^2 - ${d}^2 = ${n * n} - ${d * d} = ${n * n - d * d}\).` };
                    }
                    if (kind === 1) {                                             // 51² − 49²
                        const a = rng.int(20, 120), b = a - rng.int(1, 9);
                        return { q: R`Work out \(${a}^2 - ${b}^2\) without squaring either number.`, ans: CA.num(a * a - b * b), sol: R`\(${a}^2 - ${b}^2 = (${a}+${b})(${a}-${b}) = ${a + b}\times${a - b} = ${a * a - b * b}\).` };
                    }
                    const n = rng.pick([20, 30, 40, 50, 60, 70, 100, 200]), d = rng.int(1, 4), plus = kind === 2;
                    const v = plus ? n + d : n - d;
                    return { q: R`Use \((a ${plus ? '+' : '-'} b)^2 = a^2 ${plus ? '+' : '-'} 2ab + b^2\) to work out \(${v}^2\).`, ans: CA.num(v * v), sol: R`\(${v}^2 = (${n} ${plus ? '+' : '-'} ${d})^2 = ${n * n} ${plus ? '+' : '-'} ${2 * n * d} + ${d * d} = ${v * v}\).` };
                },
            },
            {
                id: 'sum-product', name: 'Using a + b and ab', level: 3,
                gen(rng) {
                    const a = rng.int(-6, 9), b = rng.int(-6, 9);
                    if (a === b || a + b === 0) return this.gen(rng);
                    const s = a + b, p = a * b, kind = rng.int(0, 2);
                    if (kind === 0) return { q: R`If \(a + b = ${s}\) and \(ab = ${p}\), find \(a^2 + b^2\).`, ans: CA.num(a * a + b * b), sol: R`\((a+b)^2 = a^2 + 2ab + b^2\), so \(a^2 + b^2 = ${par(s)}^2 - 2\times${par(p)} = ${s * s} ${p < 0 ? '+' : '-'} ${Math.abs(2 * p)} = ${a * a + b * b}\).` };
                    if (kind === 1) return { q: R`If \(a + b = ${s}\) and \(ab = ${p}\), find \((a - b)^2\).`, ans: CA.num((a - b) ** 2), sol: R`\((a-b)^2 = (a+b)^2 - 4ab = ${s * s} ${p < 0 ? '+' : '-'} ${Math.abs(4 * p)} = ${(a - b) ** 2}\).` };
                    const d = a - b;
                    return { q: R`If \(a + b = ${s}\) and \(a - b = ${d}\), find \(a^2 - b^2\).`, ans: CA.num(s * d), sol: R`\(a^2 - b^2 = (a+b)(a-b) = ${par(s)}\times${par(d)} = ${s * d}\).` };
                },
            },
            {
                id: 'word-equation', name: 'Write and solve an equation', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const n = rng.int(3, 60), k = rng.pick([3, 4, 5]), sum = k * n + (k * (k - 1)) / 2;
                        return { q: `The sum of ${['', '', '', 'three', 'four', 'five'][k]} consecutive whole numbers is ${sum}. What is the smallest of them?`, ans: CA.num(n), sol: R`Call them \(n, n+1, \ldots\): \(${k}n + ${(k * (k - 1)) / 2} = ${sum}\), so \(${k}n = ${sum - (k * (k - 1)) / 2}\) and \(n = ${n}\).` };
                    }
                    if (kind === 1) {
                        let x, a, b, c;
                        do { x = rng.int(3, 25); a = rng.int(3, 6); b = rng.int(1, 20); c = a * x - b - x; } while (c <= 0);
                        return { q: `I think of a number, multiply it by ${a} and then subtract ${b}. I get ${c} more than the number I first thought of. What was my number?`, ans: CA.num(x), sol: R`Call the number \(n\): \(${a}n - ${b} = n + ${c}\). So \(${a - 1}n = ${b + c}\) and \(n = ${x}\).` };
                    }
                    if (kind === 2) {
                        const w = rng.int(3, 20), d = rng.int(2, 12);
                        return { q: `A rectangle is ${d} cm longer than it is wide. Its perimeter is ${2 * (2 * w + d)} cm. How wide is it?`, ans: CA.num(w, 'cm'), sol: R`Width \(w\), length \(w + ${d}\): \(2(2w + ${d}) = ${2 * (2 * w + d)}\), so \(2w + ${d} = ${2 * w + d}\) and \(w = ${w}\).` };
                    }
                    const child = rng.int(4, 14), k = rng.pick([3, 4, 5]), parent = k * child;
                    return { q: `A mother is ${k} times as old as her son. Together their ages add up to ${parent + child}. How old is the son?`, ans: CA.num(child), sol: R`Son \(s\), mother \(${k}s\): \(${k + 1}s = ${parent + child}\), so \(s = ${child}\).` };
                },
            },
        ],

        assignment: [
            ['one-step', 5], ['two-step', 5], ['expand-pair', 3], ['distribute', 3],
            ['both-sides', 5], ['brackets-both', 4], ['fraction-eq', 4], ['perfect-square', 4], ['factor', 5],
            ['identity-arith', 5], ['sum-product', 4], ['word-equation', 3],
        ],
    });
})();
