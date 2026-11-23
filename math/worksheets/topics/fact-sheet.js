/* Worksheet: Math Fact Sheet — a speed drill of +, −, ×, ÷ facts, from table facts up to 2-digit and decimal facts. */
(function () {
    'use strict';
    const R = String.raw;

    // ── Helpers ──────────────────────────────────────────────────────────
    /** A decimal written from an integer count of 10^-dp: dec(275, 2) → "2.75". */
    const dec = (k, dp) => (k / 10 ** dp).toFixed(dp);
    /** An integer k with a non-zero last digit (so a decimal never ends in 0). */
    const nz10 = (rng, lo, hi) => { let k; do k = rng.int(lo, hi); while (k % 10 === 0); return k; };
    /** The answer to a decimal fact: k units of 10^-dp, as a plain number. */
    const decAns = (k, dp) => CA.num(Math.round(k) / 10 ** dp);
    const fact = (a, op, b) => R`\(${a} ${op} ${b} = \)`;
    /** "Tens then ones" (or hundreds first): a ± b by taking the big part of b first. */
    function bigFirst(a, b, sign, unit, word) {
        const big = b - (b % unit), small = b % unit, r = sign === '+' ? a + b : a - b, mid = sign === '+' ? a + big : a - big;
        if (!small || !big) return R`\(${a} ${sign} ${b} = ${r}\).`;
        return R`${word}: \(${a} ${sign} ${big} = ${mid}\), then \(${sign}\,${small}\) gives \(${r}\).`;
    }

    CA.register({
        id: 'fact-sheet',
        title: 'Math Fact Sheet',
        page: 'fact-sheet.html',
        compact: true,   // short problems: three columns, small answer space
        assignmentNote: 'A speed drill: time yourself and write each answer as fast as you can. Part A is table facts, Part B two-digit facts, Part C bigger numbers and decimals.',

        practice: [
            // ── Part A: single-digit and table facts ──────────────────────
            {
                id: 'add-facts', name: 'Addition facts', level: 1,
                gen(rng) {
                    const a = rng.int(2, 12), b = rng.int(2, 12), s = a + b;
                    const sol = a + b > 10 && a < 10 && b < 10
                        ? R`Make a ten: \(${a} + ${10 - a} = 10\), then \(10 + ${b - (10 - a)} = ${s}\).`
                        : R`\(${a} + ${b} = ${s}\).`;
                    return { q: fact(a, '+', b), ans: CA.num(s), sol };
                },
            },
            {
                id: 'sub-facts', name: 'Subtraction facts', level: 1,
                gen(rng) {
                    const b = rng.int(2, 12), d = rng.int(1, 12), a = b + d;
                    return { q: fact(a, '-', b), ans: CA.num(d), sol: R`Think addition: \(${b} + {?} = ${a}\). So \(${a} - ${b} = ${d}\).` };
                },
            },
            {
                id: 'times-facts', name: 'Times tables', level: 1,
                gen(rng) {
                    const a = rng.int(2, 12), b = rng.int(2, 12), p = a * b;
                    let sol = R`\(${a} \times ${b} = ${p}\).`;
                    if (b % 2 === 0 && b > 2) sol = R`Double a half: \(${a} \times ${b / 2} = ${a * b / 2}\), and double that is \(${p}\).`;
                    else if (b === 9) sol = R`Ten lots take away one lot: \(${a} \times 10 - ${a} = ${10 * a} - ${a} = ${p}\).`;
                    return { q: fact(a, R`\times`, b), ans: CA.num(p), sol };
                },
            },
            {
                id: 'div-facts', name: 'Division facts', level: 1,
                gen(rng) {
                    const b = rng.int(2, 12), c = rng.int(2, 12), a = b * c;
                    return { q: fact(a, R`\div`, b), ans: CA.num(c), sol: R`Which number times ${b} makes ${a}? \(${b} \times ${c} = ${a}\), so the answer is ${c}.` };
                },
            },

            // ── Part B: two-digit facts ───────────────────────────────────
            {
                id: 'add-2digit', name: 'Add two 2-digit numbers', level: 2,
                gen(rng) {
                    const a = rng.int(11, 89), b = rng.int(11, 99 - Math.min(a, 60)), s = a + b;
                    return { q: fact(a, '+', b), ans: CA.num(s), sol: bigFirst(a, b, '+', 10, 'Tens then ones') };
                },
            },
            {
                id: 'sub-2digit', name: 'Subtract 2-digit numbers', level: 2,
                gen(rng) {
                    const b = rng.int(11, 79), a = rng.int(b + 3, 99), d = a - b;
                    return { q: fact(a, '-', b), ans: CA.num(d), sol: bigFirst(a, b, '-', 10, 'Tens then ones') };
                },
            },
            {
                id: 'mult-2by1', name: '2-digit × 1-digit', level: 2,
                gen(rng) {
                    const a = nz10(rng, 13, 99), b = rng.int(3, 9), t = a - (a % 10), u = a % 10;
                    const [x, y] = rng.bool() ? [a, b] : [b, a];
                    return { q: fact(x, R`\times`, y), ans: CA.num(a * b), sol: R`Split ${a} into ${t} and ${u}: \(${t} \times ${b} + ${u} \times ${b} = ${t * b} + ${u * b} = ${a * b}\).` };
                },
            },
            {
                id: 'div-2digit', name: 'Divide into a 2-digit quotient', level: 2,
                gen(rng) {
                    const b = rng.int(3, 9), c = nz10(rng, 11, Math.floor(198 / b)), a = b * c;
                    const t = c - (c % 10);
                    return { q: fact(a, R`\div`, b), ans: CA.num(c), sol: R`Split ${a} into \(${b * t} + ${a - b * t}\): \(${b * t} \div ${b} = ${t}\) and \(${a - b * t} \div ${b} = ${c - t}\), so \(${c}\).` };
                },
            },
            {
                id: 'mixed-2digit', name: 'Mixed facts', level: 2,
                gen(rng) {
                    const op = rng.pick(['+', '-', '×', '÷']);
                    if (op === '+') {
                        const a = rng.int(25, 99), b = rng.int(25, 99), u = b % 10;
                        const sol = u >= 7 ? R`Round ${b} up to ${b + 10 - u}: \(${a} + ${b + 10 - u} = ${a + b + 10 - u}\), then take away ${10 - u}: \(${a + b}\).`
                            : bigFirst(a, b, '+', 10, 'Tens then ones');
                        return { q: fact(a, '+', b), ans: CA.num(a + b), sol };
                    }
                    if (op === '-') { const a = rng.int(50, 99), b = rng.int(12, a - 5); return { q: fact(a, '-', b), ans: CA.num(a - b), sol: R`Count up from ${b} to ${a}: \(${a} - ${b} = ${a - b}\).` }; }
                    if (op === '×') { const a = rng.int(11, 15), b = rng.int(4, 12); return { q: fact(a, R`\times`, b), ans: CA.num(a * b), sol: R`\(10 \times ${b} + ${a - 10} \times ${b} = ${10 * b} + ${(a - 10) * b} = ${a * b}\).` }; }
                    const b = rng.int(11, 15), c = rng.int(3, 9);
                    return { q: fact(b * c, R`\div`, b), ans: CA.num(c), sol: R`\(${b} \times ${c} = ${b * c}\), so \(${b * c} \div ${b} = ${c}\).` };
                },
            },

            // ── Part C: bigger numbers and decimals ───────────────────────
            {
                id: 'add-sub-3digit', name: '3-digit addition and subtraction', level: 3,
                gen(rng) {
                    if (rng.bool()) {
                        const a = rng.int(120, 899), b = rng.int(110, 999 - a + 99), s = a + b;
                        return { q: fact(a, '+', b), ans: CA.num(s), sol: bigFirst(a, b, '+', 100, 'Hundreds first') };
                    }
                    const a = rng.int(300, 999), b = rng.int(110, a - 50), d = a - b;
                    return { q: fact(a, '-', b), ans: CA.num(d), sol: bigFirst(a, b, '-', 100, 'Hundreds first') };
                },
            },
            {
                id: 'mult-2by2', name: '2-digit × 2-digit', level: 3,
                gen(rng) {
                    const a = nz10(rng, 12, 49), b = nz10(rng, 12, 29), t = b - (b % 10), u = b % 10;
                    return { q: fact(a, R`\times`, b), ans: CA.num(a * b), sol: R`Split ${b} into ${t} and ${u}: \(${a} \times ${t} + ${a} \times ${u} = ${a * t} + ${a * u} = ${a * b}\).` };
                },
            },
            {
                id: 'decimal-add-sub', name: 'Decimal addition and subtraction', level: 3,
                gen(rng) {
                    const da = rng.int(1, 2), db = rng.int(1, 2), dp = Math.max(da, db);
                    const a = nz10(rng, da === 1 ? 11 : 101, da === 1 ? 99 : 999), b = nz10(rng, db === 1 ? 11 : 101, db === 1 ? 99 : 999);
                    const A = a * 10 ** (dp - da), B = b * 10 ** (dp - db);           // both in units of 10^-dp
                    if (rng.bool()) return { q: fact(dec(a, da), '+', dec(b, db)), ans: decAns(A + B, dp), sol: R`Line up the decimal points: \(${dec(A, dp)} + ${dec(B, dp)} = ${dec(A + B, dp)}\).` };
                    const [hi, lo, dhi, dlo, Hi, Lo] = A >= B ? [a, b, da, db, A, B] : [b, a, db, da, B, A];
                    if (Hi === Lo) return this.gen(rng);
                    return { q: fact(dec(hi, dhi), '-', dec(lo, dlo)), ans: decAns(Hi - Lo, dp), sol: R`Line up the decimal points: \(${dec(Hi, dp)} - ${dec(Lo, dp)} = ${dec(Hi - Lo, dp)}\).` };
                },
            },
            {
                id: 'decimal-mult-div', name: 'Decimal multiplication and division', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                     // 0.7 × 8 or 1.2 × 6
                        const a = nz10(rng, 2, 39), b = rng.int(2, 9);
                        return { q: fact(dec(a, 1), R`\times`, b), ans: decAns(a * b, 1), sol: R`\(${a} \times ${b} = ${a * b}\), and one decimal place gives \(${dec(a * b, 1)}\).` };
                    }
                    if (kind === 1) {                                     // 0.3 × 0.4
                        const a = rng.int(2, 9), b = nz10(rng, 2, 15);
                        return { q: fact(dec(a, 1), R`\times`, dec(b, 1)), ans: decAns(a * b, 2), sol: R`\(${a} \times ${b} = ${a * b}\), and two decimal places gives \(${dec(a * b, 2)}\).` };
                    }
                    const b = rng.int(2, 9), c = nz10(rng, 2, 19), a = b * c;      // 4.8 ÷ 6
                    if (a % 10 === 0) return this.gen(rng);
                    return { q: fact(dec(a, 1), R`\div`, b), ans: decAns(c, 1), sol: R`\(${a} \div ${b} = ${c}\), so \(${dec(a, 1)} \div ${b} = ${dec(c, 1)}\).` };
                },
            },
        ],

        assignment: [
            ['add-facts', 4], ['sub-facts', 4], ['times-facts', 4], ['div-facts', 3],
            ['add-2digit', 5], ['sub-2digit', 5], ['mult-2by1', 5], ['div-2digit', 4], ['mixed-2digit', 4],
            ['add-sub-3digit', 3], ['mult-2by2', 3], ['decimal-add-sub', 3], ['decimal-mult-div', 3],
        ],
    });
})();
