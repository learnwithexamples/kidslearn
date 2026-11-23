/* Worksheet: Mental Math Practice — +, −, ×, ÷, squares, percentages and estimation, each with a trick to do it in your head. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m;

    // ── Helpers ──────────────────────────────────────────────────────────
    /** An integer in [lo, hi] whose last digit is one of `units`. */
    const withUnits = (rng, lo, hi, units) => { let k; do k = rng.int(lo, hi); while (!units.includes(k % 10)); return k; };
    const up10 = n => n + (10 - (n % 10)) % 10;                   // round up to a ten
    /** Pick one of several phrasings of the same calculation. */
    const say = (rng, list) => rng.pick(list);

    CA.register({
        id: 'mental-math',
        title: 'Mental Math Practice',
        page: 'mental-math.html',
        compact: true,   // short problems: three columns, small answer space
        assignmentNote: 'Work every problem in your head — no written column sums. Write only the answer. Each answer in the key shows a trick that makes it quick.',

        practice: [
            // ── Part A: warm-up (easy / medium) ───────────────────────────
            {
                id: 'add-round', name: 'Add by rounding', level: 1,
                gen(rng) {
                    const b = withUnits(rng, 18, 69, [7, 8, 9]), a = rng.int(14, 89), up = up10(b), k = up - b, s = a + b;
                    const q = say(rng, [R`\(${a} + ${b}\)`, `Add ${a} and ${b}.`, `What is ${b} more than ${a}?`, `What is the total of ${a} and ${b}?`]);
                    return { q, ans: CA.num(s), sol: R`${b} is ${k} less than ${up}: \(${a} + ${up} = ${a + up}\), then take away ${k} to get \(${s}\).` };
                },
            },
            {
                id: 'sub-round', name: 'Subtract by rounding', level: 1,
                gen(rng) {
                    const b = withUnits(rng, 17, 69, [7, 8, 9]), a = rng.int(b + 5, 99), up = up10(b), k = up - b, d = a - b;
                    const q = say(rng, [R`\(${a} - ${b}\)`, `Take ${b} away from ${a}.`, `What is ${b} less than ${a}?`, `What is the difference between ${a} and ${b}?`]);
                    return { q, ans: CA.num(d), sol: R`Take away ${up} instead, then add back the extra ${k}: \(${a} - ${up} = ${a - up}\), \(${a - up} + ${k} = ${d}\).` };
                },
            },
            {
                id: 'times-shortcut', name: 'Multiply by 4, 5, 9 and 20', level: 1,
                gen(rng) {
                    const k = rng.int(0, 3);
                    if (k === 0) {
                        const n = 2 * rng.int(7, 49);
                        return { q: say(rng, [R`\(${n} \times 5\)`, R`\(5 \times ${n}\)`, `How much do ${n} stamps cost at 5 cents each, in cents?`]), ans: CA.num(5 * n), sol: R`Times 5 is times 10, then halve: \(${n} \times 10 = ${10 * n}\), half of that is \(${5 * n}\).` };
                    }
                    if (k === 1) {
                        const n = rng.int(13, 49);
                        const q = say(rng, [R`\(${n} \times 4\)`, R`\(4 \times ${n}\)`, `A square has sides of ${n} cm. What is its perimeter?`]);
                        return { q, ans: CA.num(4 * n, /square/.test(q) ? 'cm' : ''), sol: R`Double, then double again: \(${n} \to ${2 * n} \to ${4 * n}\).` };
                    }
                    if (k === 2) {
                        const n = rng.int(12, 35);
                        return { q: say(rng, [R`\(${n} \times 9\)`, R`\(9 \times ${n}\)`]), ans: CA.num(9 * n), sol: R`Ten lots take away one lot: \(${n} \times 10 - ${n} = ${10 * n} - ${n} = ${9 * n}\).` };
                    }
                    const n = rng.int(12, 45);
                    return { q: say(rng, [R`\(${n} \times 20\)`, R`\(20 \times ${n}\)`]), ans: CA.num(20 * n), sol: R`Double, then times 10: \(${n} \times 2 = ${2 * n}\), \(${2 * n} \times 10 = ${20 * n}\).` };
                },
            },
            {
                id: 'percent-easy', name: '10%, 25%, 50% and 75%', level: 1,
                gen(rng) {
                    const p = rng.pick([10, 25, 50, 75]);
                    const n = p === 10 ? 10 * rng.int(3, 40) : p === 50 ? 2 * rng.int(9, 60) : 4 * rng.int(5, 30);
                    const v = (p * n) / 100;
                    const q = rng.bool(0.65) ? `What is ${p}% of ${n}?` : `A $${n} game is ${p}% off. How many dollars do you save?`;
                    const sol = p === 10 ? R`10% is one tenth: \(${n} \div 10 = ${v}\).`
                        : p === 50 ? R`50% is a half: \(${n} \div 2 = ${v}\).`
                        : p === 25 ? R`25% is a quarter: halve twice, \(${n} \to ${n / 2} \to ${v}\).`
                        : R`A quarter of ${n} is ${n / 4}; three quarters is \(3 \times ${n / 4} = ${v}\).`;
                    return { q, ans: /\$/.test(q) ? CA.num(v, '$') : CA.num(v), sol };
                },
            },

            // ── Part B: core (medium / hard) ──────────────────────────────
            {
                id: 'add-big', name: 'Add 3- and 4-digit numbers', level: 2,
                gen(rng) {
                    const big = rng.bool(0.35), H = big ? 1000 : 100;
                    const k = rng.int(1, big ? 9 : 5), hund = H === 1000 ? rng.int(2, 6) * 1000 : rng.int(2, 8) * 100;
                    const b = hund - k, a = big ? rng.int(1100, 4999) : rng.int(120, 899), s = a + b;
                    const q = say(rng, [R`\(${a} + ${b}\)`, R`\(${b} + ${a}\)`, `Add ${b} to ${a}.`]);
                    return { q, ans: CA.num(s), sol: R`${b} is ${k} less than ${hund}: \(${a} + ${hund} = ${a + hund}\), then take away ${k} to get \(${s}\).` };
                },
            },
            {
                id: 'sub-big', name: 'Subtract 3-digit numbers', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                    // 1000 − 467: make 999, then add 1
                        const top = rng.pick([1000, 1000, 500, 2000]), b = rng.int(top === 500 ? 123 : 213, top - 11);
                        if (b % 10 === 0) return this.gen(rng);
                        const q = say(rng, [R`\(${top} - ${b}\)`, `You pay for a $${b} bike with $${top}. How much change do you get?`]);
                        return { q, ans: /change/.test(q) ? CA.num(top - b, '$') : CA.num(top - b), sol: R`\(${top - 1} - ${b} = ${top - 1 - b}\) (no borrowing), then add 1: \(${top - b}\).` };
                    }
                    if (kind === 1) {                                    // 702 − 389: count up
                        const b = rng.int(213, 689), a = rng.int(Math.ceil((b + 1) / 100) * 100 + 1, Math.ceil((b + 1) / 100) * 100 + 260);
                        const h = Math.ceil(b / 100) * 100;
                        if (h === b || a % 100 === 0) return this.gen(rng);
                        return { q: say(rng, [R`\(${a} - ${b}\)`, `How far is it from ${b} up to ${a}?`, `What must be added to ${b} to make ${a}?`]), ans: CA.num(a - b), sol: R`Count up from ${b}: \(+${h - b}\) reaches ${h}, \(+${a - h}\) reaches ${a}. Total \(${h - b} + ${a - h} = ${a - b}\).` };
                    }
                    const k = rng.int(1, 4), b = rng.int(2, 7) * 100 - k, a = rng.int(b + 50, 999), d = a - b;     // 645 − 298
                    return { q: R`\(${a} - ${b}\)`, ans: CA.num(d), sol: R`Take away ${b + k}, then add back ${k}: \(${a} - ${b + k} = ${a - b - k}\), \(${a - b - k} + ${k} = ${d}\).` };
                },
            },
            {
                id: 'mult-split', name: 'Multiply by splitting', level: 2,
                gen(rng) {
                    const a = withUnits(rng, 12, 25, [1, 2, 3, 4, 5, 6, 7, 8, 9]), b = rng.bool(0.5) ? rng.int(3, 9) : rng.int(11, 19);
                    const t = a - (a % 10), u = a % 10, p = a * b;
                    const q = say(rng, [R`\(${a} \times ${b}\)`, R`\(${b} \times ${a}\)`, `What is ${a} times ${b}?`]);
                    return { q, ans: CA.num(p), sol: R`Split ${a} into ${t} + ${u}: \(${t} \times ${b} + ${u} \times ${b} = ${t * b} + ${u * b} = ${p}\).` };
                },
            },
            {
                id: 'div-split', name: 'Divide by splitting', level: 2,
                gen(rng) {
                    const b = rng.int(4, 25), c = withUnits(rng, 12, 25, [1, 2, 3, 4, 5, 6, 7, 8, 9]), a = b * c;
                    const t = c - (c % 10), first = b * t, rest = a - first;
                    const q = say(rng, [R`\(${a} \div ${b}\)`, `Share ${a} sweets equally among ${b} children. How many does each child get?`, `How many teams of ${b} can you make from ${a} players?`]);
                    return { q, ans: CA.num(c), sol: R`Split ${a} into \(${first} + ${rest}\): \(${first} \div ${b} = ${t}\) and \(${rest} \div ${b} = ${c - t}\), so \(${c}\).` };
                },
            },
            {
                id: 'squares', name: 'Squares', level: 2,
                gen(rng) {
                    const n = withUnits(rng, 11, 25, [1, 2, 3, 4, 5, 6, 7, 8, 9]), t = n - (n % 10), u = n % 10, sq = n * n;
                    const k = rng.int(0, 2);
                    const q = k === 0 ? R`\(${n}^2\)` : k === 1 ? `What is ${n} squared?` : `A square tile is ${n} cm on each side. What is its area?`;
                    return { q, ans: CA.num(sq, k === 2 ? 'cm²' : ''), sol: R`\(${n}^2 = (${t} + ${u})^2\) \(= ${t}^2 + 2 \times ${t} \times ${u} + ${u}^2\) \(= ${t * t} + ${2 * t * u} + ${u * u} = ${sq}\).` };
                },
            },
            {
                id: 'percent-mid', name: 'Percentages from 10%', level: 2,
                gen(rng) {
                    const p = rng.pick([5, 15, 20, 30, 40, 60]);
                    const n = 20 * rng.int(2, 25), ten = n / 10, v = (p * n) / 100;
                    const ctx = rng.int(0, 2);
                    const q = ctx === 0 ? `What is ${p}% of ${n}?`
                        : ctx === 1 ? `A bike costs $${n}. It is on sale at ${p}% off. How many dollars are taken off?`
                        : `${p}% of the ${n} students in a school walk to school. How many students is that?`;
                    const sol = p === 5 ? R`10% is ${ten}, so 5% is half of that: \(${v}\).`
                        : p === 15 ? R`10% is ${ten} and 5% is ${ten / 2}: \(${ten} + ${ten / 2} = ${v}\).`
                        : R`10% is ${ten}, so ${p}% is \(${p / 10} \times ${ten} = ${v}\).`;
                    return { q, ans: ctx === 1 ? CA.num(v, '$') : CA.num(v), sol };
                },
            },

            // ── Part C: challenge (expert) ────────────────────────────────
            {
                id: 'mult-tricks', name: 'Multiplication tricks', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {                                     // 25 × 48 = 100 × 12
                        const n = 4 * rng.int(4, 39);
                        return { q: rng.bool() ? R`\(25 \times ${n}\)` : R`\(${n} \times 25\)`, ans: CA.num(25 * n), sol: R`\(25 \times 4 = 100\), so \(25 \times ${n} = 100 \times ${n / 4} = ${25 * n}\).` };
                    }
                    if (kind === 1) {                                     // 99 × 37
                        const n = rng.int(12, 89), nine = rng.pick([99, 999]);
                        return { q: R`\(${nine} \times ${n}\)`, ans: CA.num(nine * n), sol: R`\(${nine} \times ${n} = ${nine + 1} \times ${n} - ${n} = ${(nine + 1) * n} - ${n} = ${nine * n}\).` };
                    }
                    if (kind === 2) {                                     // 11 × 68
                        const n = rng.int(23, 98);
                        if (n % 10 === 0) return this.gen(rng);
                        const t = Math.floor(n / 10), u = n % 10;
                        return { q: R`\(11 \times ${n}\)`, ans: CA.num(11 * n), sol: R`Add the digits and put the sum in the middle: \(${t} + ${u} = ${t + u}\)${t + u >= 10 ? R`, carry the 1` : ''}, so \(11 \times ${n} = ${11 * n}\).` };
                    }
                    const [x, y] = rng.pick([[4, 25], [2, 50], [5, 20], [8, 125], [2, 5]]), n = rng.int(13, 89);
                    const xy = x * y;
                    return { q: R`\(${x} \times ${n} \times ${y}\)`, ans: CA.num(x * n * y), sol: R`Change the order: \(${x} \times ${y} = ${xy}\), then \(${xy} \times ${n} = ${xy * n}\).` };
                },
            },
            {
                id: 'squares-big', name: 'Squares of bigger numbers', level: 3,
                gen(rng) {
                    if (rng.bool()) {                                     // 65² = 6 × 7 then 25
                        const t = rng.int(2, 9), n = 10 * t + 5;
                        return { q: rng.bool() ? R`\(${n}^2\)` : `What is ${n} squared?`, ans: CA.num(n * n), sol: R`For a number ending in 5: \(${t} \times ${t + 1} = ${t * (t + 1)}\), then write 25 after it: \(${n * n}\).` };
                    }
                    const d = rng.int(1, 9), plus = rng.bool(), n = plus ? 50 + d : 50 - d;          // (50 ± d)²
                    return { q: rng.bool() ? R`\(${n}^2\)` : `What is ${n} squared?`, ans: CA.num(n * n), sol: R`\((50 ${plus ? '+' : '-'} ${d})^2 = 2500 ${plus ? '+' : '-'} ${100 * d} + ${d * d} = ${n * n}\).` };
                },
            },
            {
                id: 'percent-hard', name: 'Harder percentages', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                     // 18% of 50 = 50% of 18
                        const n = rng.pick([50, 50, 25]), p = rng.pick([12, 16, 18, 22, 28, 36, 44, 48, 64, 84, 92].filter(x => (x * n) % 100 === 0));
                        if (p === undefined) return this.gen(rng);
                        return { q: `What is ${p}% of ${n}?`, ans: CA.num((p * n) / 100), sol: R`Swap them: ${p}% of ${n} is the same as ${n}% of ${p}, and ${n}% of ${p} is \(${(p * n) / 100}\).` };
                    }
                    if (kind === 1) {                                     // 12% of 350
                        const p = rng.pick([12, 15, 18, 22, 35, 45, 85]), n = 50 * rng.int(2, 18);
                        if ((p * n) % 100 !== 0) return this.gen(rng);
                        const ten = n / 10, one = n / 100, tens = Math.floor(p / 10), units = p % 10;
                        return { q: `What is ${p}% of ${n}?`, ans: CA.num((p * n) / 100), sol: R`10% is ${ten} and 1% is ${one}: \(${tens} \times ${ten} + ${units} \times ${one} = ${tens * ten} + ${CA.round(units * one, 2)} = ${(p * n) / 100}\).` };
                    }
                    const p = rng.pick([15, 20, 25, 30, 40, 60, 75]), whole = 20 * rng.int(2, 20), part = (p * whole) / 100;   // 15% of ? is 12
                    if (!Number.isInteger(part)) return this.gen(rng);
                    const g = CA.gcd(p, 100), top = p / g, bot = 100 / g;              // p% = top/bot
                    const sol = top === 1
                        ? R`${p}% is \(\frac{1}{${bot}}\), so the number is \(${part} \times ${bot} = ${whole}\).`
                        : R`${p}% is \(\frac{${top}}{${bot}}\). So \(\frac{1}{${bot}}\) of the number is \(${part} \div ${top} = ${part / top}\), and the number is \(${part / top} \times ${bot} = ${whole}\).`;
                    return { q: `${p}% of a number is ${part}. What is the number?`, ans: CA.num(whole), sol };
                },
            },
            {
                id: 'estimate', name: 'Estimation', level: 3,
                gen(rng) {
                    const fmt = x => x.toLocaleString('en-US');
                    const r1 = (x, to) => Math.round(x / to) * to;
                    const kind = rng.int(0, 2);
                    let q, actual, est, sol;
                    if (kind === 0) {                                     // 487 × 21
                        const a = rng.int(120, 980), b = rng.int(12, 89);
                        const ra = r1(a, 100), rb = r1(b, 10);
                        q = R`Which is the best estimate of \(${a} \times ${b}\)?`; actual = a * b; est = ra * rb;
                        sol = R`Round: \(${ra} \times ${rb} = ${est}\). (Exactly, it is ${actual}.)`;
                    } else if (kind === 1) {                              // 4872 + 3190
                        const a = rng.int(1100, 8900), b = rng.int(1100, 8900);
                        const ra = r1(a, 1000), rb = r1(b, 1000);
                        q = R`Which is the best estimate of \(${a} + ${b}\)?`; actual = a + b; est = ra + rb;
                        sol = R`Round to thousands: \(${ra} + ${rb} = ${est}\). (Exactly, it is ${actual}.)`;
                    } else {                                              // classes of students
                        const c = rng.int(12, 48), s = rng.int(21, 34);
                        const rc = r1(c, 10), rs = r1(s, 10);
                        q = `A school has ${c} classes with ${s} students in each. About how many students is that?`; actual = c * s; est = rc * rs;
                        sol = R`Round: \(${rc} \times ${rs} = ${est}\). (Exactly, it is ${actual}.)`;
                    }
                    // the choices differ by powers of ten, and the rounded estimate must be within 30% of the truth
                    if (est <= 0 || est % 10 !== 0 || Math.abs(est - actual) > 0.3 * actual) return this.gen(rng);
                    const wrong = [est * 10, est / 10, rng.bool() ? est * 100 : est * 1000];
                    return { q, ans: CA.mc(rng, fmt(est), wrong.map(fmt)), sol };
                },
            },
        ],

        assignment: [
            ['add-round', 4], ['sub-round', 4], ['times-shortcut', 4], ['percent-easy', 3],
            ['add-big', 4], ['sub-big', 4], ['mult-split', 4], ['div-split', 4], ['squares', 3], ['percent-mid', 4],
            ['mult-tricks', 3], ['squares-big', 3], ['percent-hard', 3], ['estimate', 3],
        ],
    });
})();
