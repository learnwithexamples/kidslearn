/* Worksheet: Order of Operations — brackets, powers, × ÷ left to right, then + − left to right (PEMDAS / BODMAS). */
(function () {
    'use strict';
    const R = String.raw, m = CA.m;

    // ── Helpers ──────────────────────────────────────────────────────────
    const X = R`\times`, D = R`\div`;
    /** "Work out" phrasings for a bare expression. */
    const ask = (rng, e) => rng.pick([R`Work out \(${e}\).`, R`Evaluate \(${e}\).`, R`\(${e} = \;?\)`, R`Find the value of \(${e}\).`]);
    /** Steps shown as "\(a\) → \(b\) → …": each line is the whole expression rewritten. */
    const chainSol = (lines, note) => (note ? note + ' ' : '') + lines.map(l => R`\(${l}\)`).join(R` \(\to\) `) + '.';
    /** Run `make` until it returns something (it returns null when the numbers are not nice). */
    const until = make => { for (;;) { const r = make(); if (r) return r; } };

    CA.register({
        id: 'order-of-operations',
        title: 'Order of Operations',
        page: 'order-of-operations.html',
        assignmentNote: 'Brackets first, then powers, then × and ÷ from left to right, then + and − from left to right. Rewrite the expression after each step so you don’t lose track.',

        practice: [
            // ── Part A: warm-up (easy) ────────────────────────────────────
            {
                id: 'times-first', name: 'Multiply before you add', level: 1,
                gen(rng) {
                    const a = rng.int(2, 20), b = rng.int(2, 9), c = rng.int(2, 9), p = b * c;
                    const k = rng.int(0, 2);
                    if (k === 0) return { q: ask(rng, R`${a} + ${b} ${X} ${c}`), ans: CA.num(a + p), sol: chainSol([R`${a} + ${b} ${X} ${c}`, R`${a} + ${p}`, `${a + p}`], 'Multiply first.') };
                    if (k === 1) return { q: ask(rng, R`${b} ${X} ${c} + ${a}`), ans: CA.num(p + a), sol: chainSol([R`${b} ${X} ${c} + ${a}`, R`${p} + ${a}`, `${a + p}`], 'Multiply first.') };
                    const big = p + rng.int(1, 40);
                    return { q: ask(rng, R`${big} - ${b} ${X} ${c}`), ans: CA.num(big - p), sol: chainSol([R`${big} - ${b} ${X} ${c}`, R`${big} - ${p}`, `${big - p}`], 'Multiply first, then subtract.') };
                },
            },
            {
                id: 'two-products', name: 'Products and a sum', level: 1,
                gen(rng) {
                    const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 9), d = rng.int(2, 9);
                    if (rng.bool()) {
                        const e = rng.int(1, a * b - 1);
                        return { q: ask(rng, R`${a} ${X} ${b} - ${e}`), ans: CA.num(a * b - e), sol: chainSol([R`${a} ${X} ${b} - ${e}`, R`${a * b} - ${e}`, `${a * b - e}`], 'Multiply first.') };
                    }
                    const minus = rng.bool() && a * b > c * d;
                    const s = minus ? '-' : '+', v = minus ? a * b - c * d : a * b + c * d;
                    return { q: ask(rng, R`${a} ${X} ${b} ${s} ${c} ${X} ${d}`), ans: CA.num(v), sol: chainSol([R`${a} ${X} ${b} ${s} ${c} ${X} ${d}`, R`${a * b} ${s} ${c * d}`, `${v}`], 'Do both multiplications first.') };
                },
            },
            {
                id: 'left-to-right', name: 'Equal rank: left to right', level: 1,
                gen(rng) {
                    const k = rng.int(0, 2);
                    if (k === 0) {                                        // a − b + c
                        const b = rng.int(3, 20), a = b + rng.int(1, 30), c = rng.int(2, 20);
                        return { q: ask(rng, R`${a} - ${b} + ${c}`), ans: CA.num(a - b + c), sol: chainSol([R`${a} - ${b} + ${c}`, R`${a - b} + ${c}`, `${a - b + c}`], R`\(+\) and \(-\) are equal rank, so go left to right (not \(${a} - (${b} + ${c})\)).`) };
                    }
                    if (k === 1) {                                        // a ÷ b × c
                        const b = rng.int(2, 9), q0 = rng.int(2, 9), c = rng.int(2, 9), a = b * q0;
                        if (c === b) return this.gen(rng);
                        return { q: ask(rng, R`${a} ${D} ${b} ${X} ${c}`), ans: CA.num(q0 * c), sol: chainSol([R`${a} ${D} ${b} ${X} ${c}`, R`${q0} ${X} ${c}`, `${q0 * c}`], R`\(\times\) and \(\div\) are equal rank, so divide first because it comes first.`) };
                    }
                    const a = rng.int(2, 12), b = rng.int(2, 12), c = rng.pick([2, 3, 4, 6].filter(x => (a * b) % x === 0 && x !== b));    // a × b ÷ c
                    if (!c) return this.gen(rng);
                    return { q: ask(rng, R`${a} ${X} ${b} ${D} ${c}`), ans: CA.num((a * b) / c), sol: chainSol([R`${a} ${X} ${b} ${D} ${c}`, R`${a * b} ${D} ${c}`, `${(a * b) / c}`], 'Left to right.') };
                },
            },
            {
                id: 'brackets-first', name: 'Brackets first', level: 1,
                gen(rng) {
                    const a = rng.int(2, 12), b = rng.int(2, 12), c = rng.int(2, 9), k = rng.int(0, 2);
                    if (k === 0) return { q: ask(rng, R`(${a} + ${b}) ${X} ${c}`), ans: CA.num((a + b) * c), sol: chainSol([R`(${a} + ${b}) ${X} ${c}`, R`${a + b} ${X} ${c}`, `${(a + b) * c}`], 'Brackets first.') };
                    if (k === 1) {
                        const hi = Math.max(a, b) + rng.int(1, 9), lo = Math.min(a, b);
                        return { q: ask(rng, R`${c} ${X} (${hi} - ${lo})`), ans: CA.num(c * (hi - lo)), sol: chainSol([R`${c} ${X} (${hi} - ${lo})`, R`${c} ${X} ${hi - lo}`, `${c * (hi - lo)}`], 'Brackets first.') };
                    }
                    const s = c * rng.int(2, 9), x = rng.int(1, s - 1);
                    return { q: ask(rng, R`(${x} + ${s - x}) ${D} ${c}`), ans: CA.num(s / c), sol: chainSol([R`(${x} + ${s - x}) ${D} ${c}`, R`${s} ${D} ${c}`, `${s / c}`], 'Brackets first.') };
                },
            },

            // ── Part B: core (medium) ─────────────────────────────────────
            {
                id: 'four-ops', name: 'Three operations', level: 2,
                gen(rng) {
                    return until(() => {
                        const a = rng.int(2, 20), b = rng.int(2, 9), c = rng.int(2, 9), d = rng.int(2, 15), k = rng.int(0, 2);
                        if (k === 0) {                                    // a + b × c − d
                            const v = a + b * c - d;
                            return v < 0 ? null : { q: ask(rng, R`${a} + ${b} ${X} ${c} - ${d}`), ans: CA.num(v), sol: chainSol([R`${a} + ${b} ${X} ${c} - ${d}`, R`${a} + ${b * c} - ${d}`, R`${a + b * c} - ${d}`, `${v}`], 'Multiply first, then add and subtract from left to right.') };
                        }
                        if (k === 1) {                                    // a × b − c + d
                            const v = a * b - c + d;
                            return a * b - c < 0 || a > 12 ? null : { q: ask(rng, R`${a} ${X} ${b} - ${c} + ${d}`), ans: CA.num(v), sol: chainSol([R`${a} ${X} ${b} - ${c} + ${d}`, R`${a * b} - ${c} + ${d}`, R`${a * b - c} + ${d}`, `${v}`], 'Multiply first, then left to right.') };
                        }
                        const v = a - b + c * d;                          // a − b + c × d
                        return a - b < 0 ? null : { q: ask(rng, R`${a} - ${b} + ${c} ${X} ${d}`), ans: CA.num(v), sol: chainSol([R`${a} - ${b} + ${c} ${X} ${d}`, R`${a} - ${b} + ${c * d}`, R`${a - b} + ${c * d}`, `${v}`], 'Multiply first, then left to right.') };
                    });
                },
            },
            {
                id: 'with-division', name: 'Mixing in division', level: 2,
                gen(rng) {
                    return until(() => {
                        const b = rng.int(2, 9), q0 = rng.int(2, 12), a = b * q0, c = rng.int(2, 9), d = rng.int(2, 9), k = rng.int(0, 2);
                        if (k === 0) {                                    // c + a ÷ b
                            const e = rng.int(2, 30);
                            return { q: ask(rng, R`${e} + ${a} ${D} ${b}`), ans: CA.num(e + q0), sol: chainSol([R`${e} + ${a} ${D} ${b}`, R`${e} + ${q0}`, `${e + q0}`], 'Divide before you add.') };
                        }
                        if (k === 1) {                                    // c × d − a ÷ b
                            const v = c * d - q0;
                            return v < 0 ? null : { q: ask(rng, R`${c} ${X} ${d} - ${a} ${D} ${b}`), ans: CA.num(v), sol: chainSol([R`${c} ${X} ${d} - ${a} ${D} ${b}`, R`${c * d} - ${q0}`, `${v}`], R`Do the \(\times\) and the \(\div\) first.`) };
                        }
                        const v = q0 + c * d;                             // a ÷ b + c × d
                        return { q: ask(rng, R`${a} ${D} ${b} + ${c} ${X} ${d}`), ans: CA.num(v), sol: chainSol([R`${a} ${D} ${b} + ${c} ${X} ${d}`, R`${q0} + ${c * d}`, `${v}`], R`Do the \(\div\) and the \(\times\) first.`) };
                    });
                },
            },
            {
                id: 'brackets-mixed', name: 'Brackets in longer expressions', level: 2,
                gen(rng) {
                    return until(() => {
                        const a = rng.int(2, 9), b = rng.int(2, 12), c = rng.int(2, 12), d = rng.int(2, 20), k = rng.int(0, 2);
                        if (k === 0) {                                    // a × (b + c) − d
                            const v = a * (b + c) - d;
                            return v < 0 ? null : { q: ask(rng, R`${a} ${X} (${b} + ${c}) - ${d}`), ans: CA.num(v), sol: chainSol([R`${a} ${X} (${b} + ${c}) - ${d}`, R`${a} ${X} ${b + c} - ${d}`, R`${a * (b + c)} - ${d}`, `${v}`], 'Brackets, then multiply, then subtract.') };
                        }
                        if (k === 1) {                                    // (b + c) ÷ a + d
                            if ((b + c) % a) return null;
                            const v = (b + c) / a + d;
                            return { q: ask(rng, R`(${b} + ${c}) ${D} ${a} + ${d}`), ans: CA.num(v), sol: chainSol([R`(${b} + ${c}) ${D} ${a} + ${d}`, R`${b + c} ${D} ${a} + ${d}`, R`${(b + c) / a} + ${d}`, `${v}`], 'Brackets, then divide, then add.') };
                        }
                        if (b <= c) return null;                           // d + (b − c) × a
                        const v = d + (b - c) * a;
                        return { q: ask(rng, R`${d} + (${b} - ${c}) ${X} ${a}`), ans: CA.num(v), sol: chainSol([R`${d} + (${b} - ${c}) ${X} ${a}`, R`${d} + ${b - c} ${X} ${a}`, R`${d} + ${(b - c) * a}`, `${v}`], 'Brackets, then multiply, then add.') };
                    });
                },
            },
            {
                id: 'powers', name: 'Powers', level: 2,
                gen(rng) {
                    return until(() => {
                        const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 12), k = rng.int(0, 3);
                        if (k === 0) return { q: ask(rng, R`${c} + ${a}^2`), ans: CA.num(c + a * a), sol: chainSol([R`${c} + ${a}^2`, R`${c} + ${a * a}`, `${c + a * a}`], 'Power first.') };
                        if (k === 1) {                                    // b × a² (not (ba)²)
                            if (b > 5) return null;
                            return { q: ask(rng, R`${b} ${X} ${a}^2`), ans: CA.num(b * a * a), sol: chainSol([R`${b} ${X} ${a}^2`, R`${b} ${X} ${a * a}`, `${b * a * a}`], R`Only the ${a} is squared, so square first (not \(${b * a}^2\)).`) };
                        }
                        if (k === 2) {                                    // (a + b)² − c
                            const s = a + b;
                            if (s > 12) return null;
                            return { q: ask(rng, R`(${a} + ${b})^2 - ${c}`), ans: CA.num(s * s - c), sol: chainSol([R`(${a} + ${b})^2 - ${c}`, R`${s}^2 - ${c}`, R`${s * s} - ${c}`, `${s * s - c}`], R`Brackets, then the power (not \(${a}^2 + ${b}^2\)).`) };
                        }
                        const e = rng.pick([2, 3]), base = e === 3 ? rng.int(2, 5) : rng.int(3, 10), p = base ** e, f = rng.int(2, 6);   // base^e − f × b
                        if (p - f * b < 0) return null;
                        return { q: ask(rng, R`${base}^${e} - ${f} ${X} ${b}`), ans: CA.num(p - f * b), sol: chainSol([R`${base}^${e} - ${f} ${X} ${b}`, R`${p} - ${f * b}`, `${p - f * b}`], 'Power and multiplication first, then subtract.') };
                    });
                },
            },
            {
                id: 'fix-mistake', name: 'Spot the mistake', level: 2,
                gen(rng) {
                    return until(() => {
                        const a = rng.int(2, 15), b = rng.int(2, 9), c = rng.int(2, 9);
                        const [name, he] = rng.pick([['Zoe', 'she'], ['Sam', 'he'], ['Ali', 'he'], ['Mia', 'she'], ['Leo', 'he'], ['Ava', 'she']]);
                        const k = rng.int(0, 2);
                        if (k === 0) {                                    // a + b × c done left to right
                            const wrong = (a + b) * c, right = a + b * c;
                            return { q: R`${name} worked out \(${a} + ${b} ${X} ${c}\) from left to right and got ${wrong}. What is the correct answer?`, ans: CA.num(right), sol: R`Multiply first: \(${b} ${X} ${c} = ${b * c}\), then \(${a} + ${b * c} = ${right}\).` };
                        }
                        if (k === 1) {                                    // a − b + c done as a − (b + c)
                            const A = a + b + c + rng.int(0, 20), wrong = A - (b + c), right = A - b + c;
                            return { q: R`${name} says \(${A} - ${b} + ${c} = ${wrong}\) because ${he} added first. What is the correct answer?`, ans: CA.num(right), sol: R`\(+\) and \(-\) go left to right: \(${A} - ${b} = ${A - b}\), then \(${A - b} + ${c} = ${right}\).` };
                        }
                        // how much bigger is (a + b) × c than a + b × c
                        const v1 = (a + b) * c, v2 = a + b * c;
                        if (v1 === v2) return null;
                        return { q: R`How much bigger is \((${a} + ${b}) ${X} ${c}\) than \(${a} + ${b} ${X} ${c}\)?`, ans: CA.num(v1 - v2), sol: R`\((${a} + ${b}) ${X} ${c} = ${a + b} ${X} ${c} = ${v1}\) and \(${a} + ${b} ${X} ${c} = ${a} + ${b * c} = ${v2}\). Difference \(${v1} - ${v2} = ${v1 - v2}\).` };
                    });
                },
            },

            // ── Part C: challenge (hard) ──────────────────────────────────
            {
                id: 'hard-mix', name: 'Brackets, powers and all four', level: 3,
                gen(rng) {
                    return until(() => {
                        const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 9), d = rng.int(2, 6);
                        if (rng.bool()) {                                 // a + b × (c² − d)   (the page's hard question)
                            const inner = c * c - d;
                            if (inner <= 0) return null;
                            const v = a + b * inner;
                            return { q: ask(rng, R`${a} + ${b} ${X} (${c}^2 - ${d})`), ans: CA.num(v), sol: chainSol([R`${a} + ${b} ${X} (${c}^2 - ${d})`, R`${a} + ${b} ${X} (${c * c} - ${d})`, R`${a} + ${b} ${X} ${inner}`, R`${a} + ${b * inner}`, `${v}`]) };
                        }
                        const s = a + b;                                  // (a + b)² ÷ a + c
                        if ((s * s) % a) return null;
                        const v = (s * s) / a + c;
                        return { q: ask(rng, R`(${a} + ${b})^2 ${D} ${a} + ${c}`), ans: CA.num(v), sol: chainSol([R`(${a} + ${b})^2 ${D} ${a} + ${c}`, R`${s}^2 ${D} ${a} + ${c}`, R`${s * s} ${D} ${a} + ${c}`, R`${(s * s) / a} + ${c}`, `${v}`]) };
                    });
                },
            },
            {
                id: 'nested', name: 'Brackets inside brackets', level: 3,
                gen(rng) {
                    return until(() => {
                        const a = rng.int(2, 6), b = rng.int(2, 15), c = rng.int(3, 12), d = rng.int(1, 9);
                        if (c <= d) return null;
                        if (rng.bool()) {                                 // a × [b + (c − d)²]
                            const e = c - d;
                            if (e > 9) return null;
                            const inner = b + e * e, v = a * inner;
                            return { q: ask(rng, R`${a} ${X} [${b} + (${c} - ${d})^2]`), ans: CA.num(v), sol: chainSol([R`${a} ${X} [${b} + (${c} - ${d})^2]`, R`${a} ${X} [${b} + ${e}^2]`, R`${a} ${X} [${b} + ${e * e}]`, R`${a} ${X} ${inner}`, `${v}`], 'Innermost brackets first.') };
                        }
                        const f = rng.int(2, 9), top = (a + b) * f - c;   // [(a + b) × f − c] ÷ d
                        if (top <= 0 || d < 2 || top % d) return null;
                        return { q: ask(rng, R`[(${a} + ${b}) ${X} ${f} - ${c}] ${D} ${d}`), ans: CA.num(top / d), sol: chainSol([R`[(${a} + ${b}) ${X} ${f} - ${c}] ${D} ${d}`, R`[${a + b} ${X} ${f} - ${c}] ${D} ${d}`, R`[${(a + b) * f} - ${c}] ${D} ${d}`, R`${top} ${D} ${d}`, `${top / d}`], 'Innermost brackets first.') };
                    });
                },
            },
            {
                id: 'bar-and-root', name: 'Fraction bars and roots', level: 3,
                gen(rng) {
                    return until(() => {
                        if (rng.bool()) {                                 // (a × b + c) / d − e
                            const a = rng.int(2, 9), b = rng.int(2, 9), d = rng.int(2, 9), c = rng.int(1, 20), e = rng.int(1, 9);
                            const top = a * b + c;
                            if (top % d || top / d - e < 0) return null;
                            return { q: R`The fraction bar works like brackets. Work out \(\dfrac{${a} ${X} ${b} + ${c}}{${d}} - ${e}\).`, ans: CA.num(top / d - e), sol: R`Top first: \(${a} ${X} ${b} + ${c} = ${top}\). Then \(${top} ${D} ${d} = ${top / d}\) and \(${top / d} - ${e} = ${top / d - e}\).` };
                        }
                        const [p, q0, r] = rng.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);   // k × √(p² + q²) − m
                        const k = rng.int(2, 5), mm = rng.int(1, 20);
                        if (k * r - mm < 0) return null;
                        return { q: R`A root works like brackets. Work out \(${k} ${X} \sqrt{${p}^2 + ${q0}^2} - ${mm}\).`, ans: CA.num(k * r - mm), sol: R`Under the root first: \(${p * p} + ${q0 * q0} = ${r * r}\), so \(\sqrt{${r * r}} = ${r}\). Then \(${k} ${X} ${r} - ${mm} = ${k * r} - ${mm} = ${k * r - mm}\).` };
                    });
                },
            },
            {
                id: 'place-brackets', name: 'Where do the brackets go?', level: 3,
                gen(rng) {
                    return until(() => {
                        const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(3, 9), d = rng.int(1, c - 1);
                        const opts = [
                            [R`(${a} + ${b}) ${X} ${c} - ${d}`, (a + b) * c - d],
                            [R`${a} + ${b} ${X} (${c} - ${d})`, a + b * (c - d)],
                            [R`(${a} + ${b}) ${X} (${c} - ${d})`, (a + b) * (c - d)],
                            [R`(${a} + ${b} ${X} ${c}) - ${d}`, a + b * c - d],
                        ];
                        if (new Set(opts.map(o => o[1])).size !== 4) return null;
                        const [tex, target] = opts[rng.int(0, 2)];
                        return {
                            q: R`Which placing of brackets makes \(${a} + ${b} ${X} ${c} - ${d} = ${target}\) true?`,
                            ans: CA.mc(rng, m(tex), opts.filter(o => o[0] !== tex).map(o => m(o[0]))),
                            sol: R`Try each one: ${opts.map(o => R`\(${o[0]} = ${o[1]}\)`).join('; ')}. Only \(${tex}\) gives ${target}.`,
                        };
                    });
                },
            },
        ],

        assignment: [
            ['times-first', 4], ['two-products', 4], ['left-to-right', 4], ['brackets-first', 3],
            ['four-ops', 5], ['with-division', 4], ['brackets-mixed', 5], ['powers', 5], ['fix-mistake', 4],
            ['hard-mix', 4], ['nested', 3], ['bar-and-root', 3], ['place-brackets', 2],
        ],
    });
})();
