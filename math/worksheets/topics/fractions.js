/* Worksheet: Fractions Practice — simplify, equivalent fractions, mixed numbers,
   decimals, the four operations and comparing. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, T = CA.tex, gcd = CA.gcd, lcm = CA.lcm;

    // ── Writing fractions ────────────────────────────────────────────────
    /** a/b exactly as given (not reduced) — for the question text. */
    const fr = (n, d) => R`\dfrac{${n}}{${d}}`;
    /** w n/d as a mixed number, exactly as given. */
    const mx = (w, n, d) => R`${w}\dfrac{${n}}{${d}}`;
    /** Reduced TeX of n/d, with " = reduced" appended only when it changes. */
    const thenReduce = (n, d) => (gcd(n, d) === 1 ? '' : ` = ${T.frac(n, d)}`);
    const thenMixed = (n, d) => { const [a, b] = CA.reduce(n, d); return a > b && b > 1 ? ` = ${T.mixed(a, b)}` : ''; };
    /** A proper fraction n/d in lowest terms with d in [lo, hi]. */
    function proper(rng, lo, hi) {
        for (;;) { const d = rng.int(lo, hi), n = rng.int(1, d - 1); if (gcd(n, d) === 1) return [n, d]; }
    }
    /** A mixed number [w, n, d] with n/d proper and in lowest terms. */
    function mixedNum(rng, wlo, whi, dlo, dhi) { const [n, d] = proper(rng, dlo, dhi); return [rng.int(wlo, whi), n, d]; }
    const improper = (w, n, d) => w * d + n;
    const LT = m(R`\lt`), GT = m(R`\gt`), EQ = m('=');

    /** Worked solutions use text-size fractions so the answer-key lines stay compact. */
    const keySize = gens => gens.map(g => ({
        ...g,
        gen(rng) { const p = g.gen.call(this, rng); return { ...p, sol: p.sol.replace(/\\dfrac/g, R`\frac`) }; },
    }));

    CA.register({
        id: 'fractions',
        title: 'Fractions Practice',
        page: 'fractions.html',
        assignmentNote: 'Give every fraction answer in its simplest form. Improper fractions such as 7/4 are fine unless a mixed number is asked for. Show your working.',

        practice: keySize([
            // ── Part A ──────────────────────────────────────────────────
            {
                id: 'simplify', name: 'Simplify a fraction', level: 1,
                gen(rng) {
                    let n, d;
                    if (rng.bool(0.2)) { const [p, q] = proper(rng, 2, 6); n = p + q; d = q; }   // a few improper ones
                    else [n, d] = proper(rng, 2, 12);
                    const k = rng.int(2, Math.max(2, Math.min(9, Math.floor(72 / d))));
                    const N = k * n, D = k * d;
                    const ask = rng.pick([
                        R`Simplify \(${fr(N, D)}\).`,
                        R`Write \(${fr(N, D)}\) in its simplest form.`,
                        R`Reduce \(${fr(N, D)}\) to lowest terms.`,
                    ]);
                    return {
                        q: ask, ans: CA.frac(n, d),
                        sol: R`The GCF of ${N} and ${D} is ${k}. Divide both by ${k}: \(${fr(N, D)} = ${fr(n, d)}\).`,
                    };
                },
            },
            {
                id: 'equivalent', name: 'Equivalent fractions', level: 1,
                gen(rng) {
                    const [n, d] = proper(rng, 2, 10), k = rng.int(2, 8), kind = rng.int(0, 2);
                    if (kind === 0) return {
                        q: R`Find the missing number: \(${fr(n, d)} = \dfrac{\square}{${k * d}}\).`,
                        ans: CA.num(k * n),
                        sol: R`\(${d} \times ${k} = ${k * d}\), so multiply the top by ${k} too: \(${n} \times ${k} = ${k * n}\).`,
                    };
                    if (kind === 1) return {
                        q: R`Find the missing number: \(${fr(n, d)} = \dfrac{${k * n}}{\square}\).`,
                        ans: CA.num(k * d),
                        sol: R`\(${n} \times ${k} = ${k * n}\), so multiply the bottom by ${k} too: \(${d} \times ${k} = ${k * d}\).`,
                    };
                    return {
                        q: R`Find the missing number: \(${fr(k * n, k * d)} = \dfrac{\square}{${d}}\).`,
                        ans: CA.num(n),
                        sol: R`\(${k * d} \div ${k} = ${d}\), so divide the top by ${k} too: \(${k * n} \div ${k} = ${n}\).`,
                    };
                },
            },
            {
                id: 'mixed-improper', name: 'Mixed numbers and improper fractions', level: 1,
                gen(rng) {
                    const [w, n, d] = mixedNum(rng, 1, 7, 2, 12), N = improper(w, n, d);
                    if (rng.bool()) return {
                        q: R`Write \(${fr(N, d)}\) as a mixed number.`,
                        ans: CA.frac(N, d, '', { mixed: true }),
                        sol: R`\(${N} \div ${d} = ${w}\) remainder ${n}, so \(${fr(N, d)} = ${mx(w, n, d)}\).`,
                    };
                    return {
                        q: R`Write \(${mx(w, n, d)}\) as an improper fraction.`,
                        ans: CA.frac(N, d),
                        sol: R`\(${w} \times ${d} + ${n} = ${N}\), so \(${mx(w, n, d)} = ${fr(N, d)}\).`,
                    };
                },
            },
            {
                id: 'to-decimal', name: 'Fraction to decimal', level: 1,
                gen(rng) {
                    if (rng.bool(0.7)) {
                        let n, d;
                        do { d = rng.pick([2, 4, 5, 8, 10, 20, 25, 50]); n = rng.int(1, d - 1); } while (gcd(n, d) !== 1);
                        const v = CA.round(n / d, 4);
                        const tidy = 100 % d === 0
                            ? R`\(${fr(n, d)} = ${fr(n * 100 / d, 100)} = ${v}\).`
                            : R`\(${n} \div ${d} = ${v}\).`;
                        return { q: R`Write \(${fr(n, d)}\) as a decimal.`, ans: CA.num(v), sol: tidy };
                    }
                    let n, d;
                    do { d = rng.pick([3, 6, 7, 9, 11, 12]); n = rng.int(1, d - 1); } while (gcd(n, d) !== 1);
                    const v = CA.round(n / d, 2);
                    return {
                        q: R`Write \(${fr(n, d)}\) as a decimal, rounded to 2 decimal places.`,
                        ans: CA.num(v),
                        sol: R`\(${n} \div ${d} = ${(n / d).toFixed(4)}\ldots \approx ${v.toFixed(2)}\).`,
                    };
                },
            },

            // ── Part B ──────────────────────────────────────────────────
            {
                id: 'add', name: 'Add fractions', level: 2,
                gen(rng) {
                    const [a, b] = proper(rng, 2, 12), [c, d] = proper(rng, 2, 12);
                    if (b === d) return this.gen(rng);
                    const L = lcm(b, d), A = a * L / b, C = c * L / d, S = A + C;
                    if (L > 60) return this.gen(rng);
                    return {
                        q: rng.pick([R`Work out \(${fr(a, b)} + ${fr(c, d)}\).`, R`Add: \(${fr(a, b)} + ${fr(c, d)}\).`, R`Find the sum \(${fr(a, b)} + ${fr(c, d)}\).`]),
                        ans: CA.frac(S, L),
                        sol: R`Common denominator ${L}: \(${fr(A, L)} + ${fr(C, L)} = ${fr(S, L)}${thenReduce(S, L)}\).`,
                    };
                },
            },
            {
                id: 'subtract', name: 'Subtract fractions', level: 2,
                gen(rng) {
                    let [a, b] = proper(rng, 2, 12), [c, d] = proper(rng, 2, 12);
                    if (b === d || a * d === c * b) return this.gen(rng);
                    if (a * d < c * b) [a, b, c, d] = [c, d, a, b];
                    const L = lcm(b, d), A = a * L / b, C = c * L / d, S = A - C;
                    if (L > 60) return this.gen(rng);
                    return {
                        q: rng.pick([R`Work out \(${fr(a, b)} - ${fr(c, d)}\).`, R`Subtract: \(${fr(a, b)} - ${fr(c, d)}\).`, R`Find the difference \(${fr(a, b)} - ${fr(c, d)}\).`]),
                        ans: CA.frac(S, L),
                        sol: R`Common denominator ${L}: \(${fr(A, L)} - ${fr(C, L)} = ${fr(S, L)}${thenReduce(S, L)}\).`,
                    };
                },
            },
            {
                id: 'multiply', name: 'Multiply fractions', level: 2,
                gen(rng) {
                    if (rng.bool(0.25)) {                                       // whole number × fraction
                        const [a, b] = proper(rng, 3, 12), w = rng.int(2, 12);
                        return {
                            q: R`Work out \(${w} \times ${fr(a, b)}\).`,
                            ans: CA.frac(w * a, b),
                            sol: R`\(${w} \times ${fr(a, b)} = ${fr(w * a, b)}${thenReduce(w * a, b)}\).`,
                        };
                    }
                    const [a, b] = proper(rng, 2, 12), [c, d] = proper(rng, 2, 12);
                    const N = a * c, D = b * d;
                    return {
                        q: rng.pick([R`Work out \(${fr(a, b)} \times ${fr(c, d)}\).`, R`Multiply: \(${fr(a, b)} \times ${fr(c, d)}\).`]),
                        ans: CA.frac(N, D),
                        sol: R`Multiply the tops and the bottoms: \(\dfrac{${a} \times ${c}}{${b} \times ${d}} = ${fr(N, D)}${thenReduce(N, D)}\).`,
                    };
                },
            },
            {
                id: 'divide', name: 'Divide fractions', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 5);
                    if (kind === 0) {                                           // whole ÷ fraction
                        const [a, b] = proper(rng, 2, 10), w = rng.int(2, 9);
                        return {
                            q: R`Work out \(${w} \div ${fr(a, b)}\).`,
                            ans: CA.frac(w * b, a),
                            sol: R`Flip the divisor and multiply: \(${w} \times ${fr(b, a)} = ${fr(w * b, a)}${thenReduce(w * b, a)}\).`,
                        };
                    }
                    if (kind === 1) {                                           // fraction ÷ whole
                        const [a, b] = proper(rng, 2, 10), w = rng.int(2, 9);
                        return {
                            q: R`Work out \(${fr(a, b)} \div ${w}\).`,
                            ans: CA.frac(a, b * w),
                            sol: R`Dividing by ${w} is multiplying by \(${fr(1, w)}\): \(${fr(a, b)} \times ${fr(1, w)} = ${fr(a, b * w)}${thenReduce(a, b * w)}\).`,
                        };
                    }
                    const [a, b] = proper(rng, 2, 12), [c, d] = proper(rng, 2, 12);
                    if (a === c && b === d) return this.gen(rng);
                    const N = a * d, D = b * c;
                    return {
                        q: rng.pick([R`Work out \(${fr(a, b)} \div ${fr(c, d)}\).`, R`Divide: \(${fr(a, b)} \div ${fr(c, d)}\).`]),
                        ans: CA.frac(N, D),
                        sol: R`Keep, change, flip: \(${fr(a, b)} \times ${fr(d, c)} = ${fr(N, D)}${thenReduce(N, D)}\).`,
                    };
                },
            },
            {
                id: 'compare', name: 'Compare fractions', level: 2,
                gen(rng) {
                    if (rng.bool(0.35)) {                                       // largest / smallest of four
                        const vals = [];
                        while (vals.length < 4) {
                            const [n, d] = proper(rng, 3, 12);
                            if (!vals.some(([p, q]) => p * d === n * q)) vals.push([n, d]);
                        }
                        const big = rng.bool(), byVal = vals.slice().sort((x, y) => x[0] * y[1] - y[0] * x[1]);
                        const best = big ? byVal[3] : byVal[0];
                        const others = vals.filter(v => v !== best);
                        return {
                            q: R`Which fraction is the ${big ? 'largest' : 'smallest'}: ${vals.slice(0, 3).map(v => m(fr(...v))).join(', ')} or ${m(fr(...vals[3]))}?`,
                            ans: CA.mc(rng, m(fr(...best)), others.map(v => m(fr(...v)))),
                            sol: R`Over the common denominator ${vals.reduce((L, v) => lcm(L, v[1]), 1)}, the numerators are ${vals.map(([n, d]) => n * vals.reduce((L, v) => lcm(L, v[1]), 1) / d).join(', ')}; the ${big ? 'largest' : 'smallest'} is \(${fr(...best)}\).`,
                        };
                    }
                    let a, b, c, d;
                    if (rng.bool(0.2)) {                                       // equal pair
                        [a, b] = proper(rng, 2, 6); const k = rng.int(2, 4); [c, d] = [a * k, b * k];
                        if (rng.bool()) [a, b, c, d] = [c, d, a, b];
                    } else {
                        do { [a, b] = proper(rng, 2, 12); [c, d] = proper(rng, 2, 12); } while (a * d === b * c);
                    }
                    const x = a * d, y = c * b;
                    const sym = x < y ? LT : x > y ? GT : EQ, sTex = x < y ? '<' : x > y ? '>' : '=';
                    return {
                        q: R`Which symbol goes in the box? \(${fr(a, b)} \;\square\; ${fr(c, d)}\)`,
                        ans: CA.mc(rng, sym, [LT, GT, EQ], { keepOrder: true }),
                        sol: x === y
                            ? R`Cross-multiply: \(${a} \times ${d}\) and \(${c} \times ${b}\) are both ${x}, so the fractions are equal: \(${fr(a, b)} = ${fr(c, d)}\).`
                            : R`Cross-multiply: \(${a} \times ${d} = ${x}\) and \(${c} \times ${b} = ${y}\). Since \(${x} ${sTex} ${y}\), \(${fr(a, b)} ${sTex} ${fr(c, d)}\).`,
                    };
                },
            },

            // ── Part C ──────────────────────────────────────────────────
            {
                id: 'mixed-add-sub', name: 'Add and subtract mixed numbers', level: 3,
                gen(rng) {
                    const p = mixedNum(rng, 1, 5, 2, 8), q2 = mixedNum(rng, 1, 4, 2, 8);
                    if (p[2] === q2[2]) return this.gen(rng);
                    const plus = rng.bool();
                    let [A, B] = [p, q2];
                    const P = improper(...A), Q = improper(...B);
                    if (!plus && P * B[2] <= Q * A[2]) [A, B] = [B, A];
                    const N1 = improper(...A), N2 = improper(...B), L = lcm(A[2], B[2]);
                    const X = N1 * L / A[2], Y = N2 * L / B[2], S = plus ? X + Y : X - Y;
                    const op = plus ? '+' : '-';
                    return {
                        q: R`Work out \(${mx(...A)} ${op} ${mx(...B)}\). Give your answer as a mixed number${S < L ? ' or fraction' : ''}.`,
                        ans: CA.frac(S, L, '', { mixed: true }),
                        sol: R`As improper fractions: \(${fr(N1, A[2])} ${op} ${fr(N2, B[2])} = ${fr(X, L)} ${op} ${fr(Y, L)} = ${fr(S, L)}${thenReduce(S, L)}${thenMixed(S, L)}\).`,
                    };
                },
            },
            {
                id: 'mixed-mul-div', name: 'Multiply and divide mixed numbers', level: 3,
                gen(rng) {
                    const A = mixedNum(rng, 1, 4, 2, 6), N1 = improper(...A);
                    const useMixed = rng.bool(0.6);
                    const B = useMixed ? mixedNum(rng, 1, 3, 2, 6) : [0, ...proper(rng, 2, 9)];
                    const N2 = improper(...B), d1 = A[2], d2 = B[2];
                    const bTex = useMixed ? mx(...B) : fr(B[1], B[2]);
                    const times = rng.bool();
                    const N = times ? N1 * N2 : N1 * d2, D = times ? d1 * d2 : d1 * N2;
                    return {
                        q: R`Work out \(${mx(...A)} ${times ? R`\times` : R`\div`} ${bTex}\). Give your answer as a mixed number if it is more than 1.`,
                        ans: CA.frac(N, D, '', { mixed: true }),
                        sol: times
                            ? R`\(${fr(N1, d1)} \times ${fr(N2, d2)} = ${fr(N, D)}${thenReduce(N, D)}${thenMixed(N, D)}\).`
                            : R`\(${fr(N1, d1)} \div ${fr(N2, d2)} = ${fr(N1, d1)} \times ${fr(d2, N2)} = ${fr(N, D)}${thenReduce(N, D)}${thenMixed(N, D)}\).`,
                    };
                },
            },
            {
                id: 'multi-step', name: 'Several operations', level: 3,
                gen(rng) {
                    const [a, b] = proper(rng, 2, 8), [c, d] = proper(rng, 2, 8), [e, f] = proper(rng, 2, 8);
                    if ((a === c && b === d) || (c === e && d === f) || (a === e && b === f)) return this.gen(rng);
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                           // (a/b + c/d) × e/f
                        if (b === d) return this.gen(rng);
                        const L = lcm(b, d), S = a * L / b + c * L / d, N = S * e, D = L * f;
                        return {
                            q: R`Work out \(\left(${fr(a, b)} + ${fr(c, d)}\right) \times ${fr(e, f)}\).`,
                            ans: CA.frac(N, D),
                            sol: R`Bracket first: \(${fr(a, b)} + ${fr(c, d)} = ${T.frac(S, L)}\). Then \(${T.frac(S, L)} \times ${fr(e, f)} = ${T.frac(N, D)}\).`,
                        };
                    }
                    if (kind === 1) {                                           // a/b + c/d ÷ e/f  (divide first)
                        const qn = c * f, qd = d * e;                         // c/d ÷ e/f
                        const N = a * qd + qn * b, D = b * qd;
                        return {
                            q: R`Work out \(${fr(a, b)} + ${fr(c, d)} \div ${fr(e, f)}\).`,
                            ans: CA.frac(N, D),
                            sol: R`Divide first: \(${fr(c, d)} \div ${fr(e, f)} = ${fr(c, d)} \times ${fr(f, e)} = ${T.frac(qn, qd)}\). Then \(${fr(a, b)} + ${T.frac(qn, qd)} = ${T.frac(N, D)}\).`,
                        };
                    }
                    // a/b − c/d × e/f  (multiply first), must stay positive
                    const pn = c * e, pd = d * f, N = a * pd - pn * b, D = b * pd;
                    if (N <= 0) return this.gen(rng);
                    return {
                        q: R`Work out \(${fr(a, b)} - ${fr(c, d)} \times ${fr(e, f)}\).`,
                        ans: CA.frac(N, D),
                        sol: R`Multiply first: \(${fr(c, d)} \times ${fr(e, f)} = ${T.frac(pn, pd)}\). Then \(${fr(a, b)} - ${T.frac(pn, pd)} = ${T.frac(N, D)}\).`,
                    };
                },
            },
            {
                id: 'fraction-story', name: 'Fraction word problems', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 5);
                    const who = rng.pick(['Maya', 'Liam', 'Sofia', 'Noah', 'Ava', 'Ethan', 'Zara', 'Kai']);
                    if (kind === 0) {                                           // what fraction is left
                        const [a, b] = proper(rng, 2, 6), [c, d] = proper(rng, 2, 8);
                        const L = lcm(b, d), U = a * L / b + c * L / d;
                        if (b === d || U >= L) return this.gen(rng);
                        const thing = rng.pick(['pizza', 'cake', 'pie', 'chocolate bar']);
                        return {
                            q: R`${who} eats \(${fr(a, b)}\) of a ${thing} and a friend eats \(${fr(c, d)}\) of it. What fraction of the ${thing} is left?`,
                            ans: CA.frac(L - U, L),
                            sol: R`Eaten: \(${fr(a, b)} + ${fr(c, d)} = ${fr(U, L)}\). Left: \(1 - ${fr(U, L)} = ${fr(L - U, L)}${thenReduce(L - U, L)}\).`,
                        };
                    }
                    if (kind === 1) {                                           // how many pieces
                        const [a, b] = proper(rng, 2, 5), k = rng.int(3, 12);
                        if ((k * a) % b !== 0) return this.gen(rng);
                        const total = k * a / b, unit = rng.pick([['metres of ribbon', 'm'], ['litres of juice', 'L'], ['kilograms of rice', 'kg']]);
                        const piece = unit[1] === 'm' ? 'pieces' : unit[1] === 'L' ? 'glasses' : 'bags';
                        return {
                            q: R`${who} has ${total} ${unit[0]}. How many ${piece} of \(${fr(a, b)}\) ${unit[1]} can be made from it?`,
                            ans: CA.num(k, piece),
                            sol: R`\(${total} \div ${fr(a, b)} = ${total} \times ${fr(b, a)} = ${k}\).`,
                        };
                    }
                    if (kind === 2) {                                           // recipe scaled
                        const [a, b] = proper(rng, 2, 4), [w, n, d] = rng.pick([[1, 1, 2], [2, 1, 2], [1, 1, 3], [2, 1, 4]]);
                        const N = a * improper(w, n, d), D = b * d;
                        const ing = rng.pick(['sugar', 'flour', 'milk', 'oats']);
                        return {
                            q: R`A recipe needs \(${fr(a, b)}\) cup of ${ing}. ${who} makes \(${mx(w, n, d)}\) times the recipe. How many cups of ${ing} are needed?`,
                            ans: CA.frac(N, D, 'cups', { mixed: true }),
                            sol: R`\(${fr(a, b)} \times ${fr(improper(w, n, d), d)} = ${fr(N, D)}${thenReduce(N, D)}${thenMixed(N, D)}\) cups.`,
                        };
                    }
                    if (kind === 3) {                                           // fraction of what is left
                        const [a, b] = proper(rng, 3, 5), [c, d] = proper(rng, 2, 4);
                        const N = a * (d - c), D = b * d;
                        return {
                            q: R`A water tank is \(${fr(a, b)}\) full. ${who} uses \(${fr(c, d)}\) of the water in it. What fraction of the tank is full now?`,
                            ans: CA.frac(N, D),
                            sol: R`\(${fr(d - c, d)}\) of the water is left: \(${fr(d - c, d)} \times ${fr(a, b)} = ${fr(N, D)}${thenReduce(N, D)}\) of the tank.`,
                        };
                    }
                    if (kind === 4) {                                           // total distance, mixed numbers
                        const A = mixedNum(rng, 1, 4, 2, 4), B = mixedNum(rng, 1, 3, 2, 5);
                        if (A[2] === B[2]) return this.gen(rng);
                        const L = lcm(A[2], B[2]), S = improper(...A) * L / A[2] + improper(...B) * L / B[2];
                        return {
                            q: R`${who} walks \(${mx(...A)}\) km to the park and then \(${mx(...B)}\) km to the shops. How far is that altogether?`,
                            ans: CA.frac(S, L, 'km', { mixed: true }),
                            sol: R`Whole numbers: \(${A[0]} + ${B[0]} = ${A[0] + B[0]}\). Fractions: \(${fr(A[1], A[2])} + ${fr(B[1], B[2])} = ${T.frac(A[1] * L / A[2] + B[1] * L / B[2], L)}\). Total \(${T.mixed(S, L)}\) km.`,
                        };
                    }
                    // money spent in two fractions
                    const [a, b] = proper(rng, 2, 6), [c, d] = proper(rng, 2, 8);
                    if (b === d || a * d + c * b >= b * d) return this.gen(rng);
                    const L = lcm(b, d), total = L * rng.int(1, Math.max(1, Math.floor(120 / L)));
                    if (total < 12) return this.gen(rng);
                    const spentA = total * a / b, spentC = total * c / d, left = total - spentA - spentC;
                    const [x, y] = rng.sample(['a game', 'a book', 'a T-shirt', 'a concert ticket', 'a skateboard', 'a present'], 2);
                    return {
                        q: R`${who} had $${total}, spent \(${fr(a, b)}\) of it on ${x} and \(${fr(c, d)}\) of it on ${y}. How much money is left?`,
                        ans: CA.num(left, '$'),
                        sol: R`\(${fr(a, b)}\) of ${total} is ${spentA} and \(${fr(c, d)}\) of ${total} is ${spentC}. Left: \(${total} - ${spentA} - ${spentC} = ${left}\), so $${left}.`,
                    };
                },
            },
        ]),

        assignment: [
            ['simplify', 4], ['equivalent', 4], ['mixed-improper', 4], ['to-decimal', 3],
            ['add', 5], ['subtract', 5], ['multiply', 5], ['divide', 5], ['compare', 3],
            ['mixed-add-sub', 3], ['mixed-mul-div', 3], ['multi-step', 3], ['fraction-story', 3],
        ],
    });
})();
