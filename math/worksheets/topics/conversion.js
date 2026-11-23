/* Worksheet: Fraction · % · Decimal — converting between the three forms. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, T = CA.tex, gcd = CA.gcd;

    const fr = (n, d) => R`\dfrac{${n}}{${d}}`;
    const mx = (w, n, d) => R`${w}\dfrac{${n}}{${d}}`;
    /** Tidy number text: no float noise, no trailing zeros. */
    const num = (x, dp = 6) => String(CA.round(x, dp));
    const pct = (n, d) => CA.round(100 * n / d, 6);
    const dec = (n, d) => CA.round(n / d, 6);
    const thenReduce = (n, d) => (gcd(n, d) === 1 ? '' : ` = ${T.frac(n, d)}`);

    // The page's fraction pools.
    const POOL_EASY = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8],
        [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [7, 20], [9, 20], [1, 25], [2, 25], [4, 25],
        [11, 20], [13, 20], [17, 20], [19, 20], [6, 25], [12, 25], [16, 25], [21, 25]];
    const POOL_RECUR = [[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9],
        [1, 12], [5, 12], [7, 12], [11, 12], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
        [1, 11], [2, 11], [3, 11], [1, 15], [2, 15], [4, 15], [7, 15]];
    const POOL_HARD = [];
    for (let d = 11; d <= 20; d++) for (let n = 1; n < d; n++) if (gcd(n, d) === 1) POOL_HARD.push([n, d]);
    /** Does n/d have a terminating decimal? */
    const terminates = d => { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };

    /** A terminating decimal string as [top, power of ten]: "0.375" → [375, 1000]. */
    const decFrac = s => { const P = 10 ** (s.includes('.') ? s.split('.')[1].length : 0); return [Math.round(Number(s) * P), P]; };

    /** Worked step fraction → percent. */
    function fracToPctSol(n, d) {
        if (100 % d === 0) return R`\(${fr(n, d)} = ${fr(n * 100 / d, 100)}\), which is ${n * 100 / d}%.`;
        return R`\(${n} \div ${d} = ${num(n / d)}\), and \(${num(n / d)} \times 100 = ${num(100 * n / d)}\), so ${num(100 * n / d)}%.`;
    }

    /** Worked solutions use text-size fractions so the answer-key lines stay compact. */
    const keySize = gens => gens.map(g => ({
        ...g,
        gen(rng) { const p = g.gen.call(this, rng); return { ...p, sol: p.sol.replace(/\\dfrac/g, R`\frac`) }; },
    }));

    CA.register({
        id: 'conversion',
        title: 'Fraction · % · Decimal',
        page: 'conversion.html',
        assignmentNote: 'Give fractions in simplest form. Round percentages to 2 decimal places and decimals to 3 decimal places only when a question asks you to round.',

        practice: keySize([
            // ── Part A ──────────────────────────────────────────────────
            {
                id: 'frac-to-pct', name: 'Fraction to percent', level: 1,
                gen(rng) {
                    const [n, d] = rng.pick(POOL_EASY);
                    return {
                        q: rng.pick([R`Write \(${fr(n, d)}\) as a percentage.`, R`Convert \(${fr(n, d)}\) to a percent.`, R`What percent is \(${fr(n, d)}\)?`]),
                        ans: CA.num(pct(n, d), '%'),
                        sol: fracToPctSol(n, d),
                    };
                },
            },
            {
                id: 'frac-to-dec', name: 'Fraction to decimal', level: 1,
                gen(rng) {
                    const [n, d] = rng.pick(POOL_EASY), v = dec(n, d);
                    return {
                        q: rng.pick([R`Write \(${fr(n, d)}\) as a decimal.`, R`Convert \(${fr(n, d)}\) to a decimal.`]),
                        ans: CA.num(v),
                        sol: 100 % d === 0 ? R`\(${fr(n, d)} = ${fr(n * 100 / d, 100)} = ${num(v)}\).` : R`\(${n} \div ${d} = ${num(v)}\).`,
                    };
                },
            },
            {
                id: 'pct-dec', name: 'Percent ↔ decimal', level: 1,
                gen(rng) {
                    const p = rng.bool(0.8) ? rng.int(1, 99) : rng.pick([2.5, 7.5, 12.5, 17.5, 33.5, 62.5, 0.5, 120, 150, 105]);
                    if (rng.bool()) return {
                        q: `Write ${num(p)}% as a decimal.`,
                        ans: CA.num(CA.round(p / 100, 6)),
                        sol: R`Divide by 100 (move the point two places left): ${num(p)}% = \(${num(p)} \div 100 = ${num(p / 100)}\).`,
                    };
                    return {
                        q: `Write ${num(p / 100)} as a percentage.`,
                        ans: CA.num(p, '%'),
                        sol: R`Multiply by 100 (move the point two places right): \(${num(p / 100)} \times 100 = ${num(p)}\), so ${num(p)}%.`,
                    };
                },
            },
            {
                id: 'pct-to-frac', name: 'Percent to fraction', level: 1,
                gen(rng) {
                    const [n, d] = rng.pick(POOL_EASY.filter(([, d]) => 100 % d === 0)), p = n * 100 / d;
                    return {
                        q: rng.pick([`Write ${p}% as a fraction in its simplest form.`, `Convert ${p}% to a fraction in lowest terms.`]),
                        ans: CA.frac(n, d),
                        sol: R`${p}% \(= ${fr(p, 100)} = ${fr(n, d)}\) (divide top and bottom by ${100 / d}).`,
                    };
                },
            },

            // ── Part B ──────────────────────────────────────────────────
            {
                id: 'dec-to-frac', name: 'Decimal to fraction', level: 2,
                gen(rng) {
                    let n, d;
                    const w = rng.bool(0.25) ? rng.int(1, 3) : 0;
                    do { d = rng.pick(w ? [4, 5, 8, 20, 25] : [4, 5, 8, 20, 25, 40, 50, 125, 200, 250]); n = rng.int(1, d - 1); } while (gcd(n, d) !== 1);
                    const v = w + n / d, s = num(v), places = s.split('.')[1].length, P = 10 ** places;
                    const top = Math.round(v * P);
                    return {
                        q: rng.pick([`Write ${s} as a fraction in its simplest form.`, `Convert ${s} to a fraction in lowest terms.`]) + (w ? ' You may give a mixed number.' : ''),
                        ans: CA.frac(w * d + n, d, '', { mixed: w > 0 }),
                        sol: R`\(${s} = ${fr(top, P)} = ${fr(w * d + n, d)}\)${w ? R` \(= ${mx(w, n, d)}\)` : ''} (divide top and bottom by ${P / d}).`,
                    };
                },
            },
            {
                id: 'tricky-pct-to-frac', name: 'Percents with decimals to fractions', level: 2,
                gen(rng) {
                    let n, d;
                    do { d = rng.pick([8, 8, 16, 40, 40, 200, 400, 80]); n = rng.int(1, d - 1); } while (gcd(n, d) !== 1 || 100 % d === 0);
                    if (rng.bool(0.2)) n += d;                                  // over 100%
                    const p = num(100 * n / d), scale = 10 ** (p.includes('.') ? p.split('.')[1].length : 0);
                    const top = Math.round(Number(p) * scale), bot = 100 * scale;
                    return {
                        q: `Write ${p}% as a fraction in its simplest form.` + (n > d ? ' You may give a mixed number.' : ''),
                        ans: CA.frac(n, d, '', { mixed: n > d }),
                        sol: R`${p}% \(= ${fr(p, 100)} = ${fr(top, bot)} = ${T.frac(n, d)}\)${n > d ? R` \(= ${T.mixed(n, d)}\)` : ''}.`,
                    };
                },
            },
            {
                id: 'recur-to-pct', name: 'Fraction to percent (rounding)', level: 2,
                gen(rng) {
                    const [n, d] = rng.pick(POOL_RECUR), v = CA.round(100 * n / d, 2);
                    return {
                        q: R`Write \(${fr(n, d)}\) as a percentage, rounded to 2 decimal places.`,
                        ans: CA.num(v, '%'),
                        sol: R`\(${n} \div ${d} = ${(n / d).toFixed(6)}\ldots\), times 100 is \(${(100 * n / d).toFixed(4)}\ldots\), so ${v.toFixed(2)}%.`,
                    };
                },
            },
            {
                id: 'recur-to-dec', name: 'Fraction to decimal (rounding)', level: 2,
                gen(rng) {
                    const [n, d] = rng.pick(POOL_RECUR), dp = rng.bool(0.3) ? 2 : 3;
                    const r = CA.round(n / d, dp);
                    return {
                        q: R`Write \(${fr(n, d)}\) as a decimal, rounded to ${dp} decimal places.`,
                        ans: CA.num(r),
                        sol: R`\(${n} \div ${d} = ${(n / d).toFixed(5)}\ldots \approx ${r.toFixed(dp)}\).`,
                    };
                },
            },
            {
                id: 'which-largest', name: 'Compare mixed forms', level: 2,
                gen(rng) {
                    // Four different values, each shown in one of the three forms.
                    const vals = [];
                    while (vals.length < 4) {
                        const [n, d] = rng.pick(rng.bool(0.7) ? POOL_EASY : POOL_RECUR);
                        if (!vals.some(([a, b]) => a * d === n * b)) vals.push([n, d]);
                    }
                    const forms = rng.shuffle(['f', 'p', 'd', rng.pick(['f', 'p', 'd'])]);
                    const show = vals.map(([n, d], i) => {
                        const f = terminates(d) ? forms[i] : 'f';                 // only exact values as % or decimal
                        return f === 'f' ? m(fr(n, d)) : f === 'p' ? `${num(pct(n, d))}%` : num(dec(n, d));
                    });
                    const big = rng.bool(), order = vals.map((v, i) => i).sort((i, j) => vals[i][0] / vals[i][1] - vals[j][0] / vals[j][1]);
                    const best = big ? order[3] : order[0];
                    return {
                        q: `Which is the ${big ? 'largest' : 'smallest'}: ${show.slice(0, 3).join(', ')} or ${show[3]}?`,
                        ans: CA.mc(rng, show[best], show.filter((s, i) => i !== best)),
                        sol: `As decimals: ${vals.map(([n, d], i) => `${show[i]} = ${terminates(d) ? num(n / d) : num(CA.round(n / d, 3)) + '…'}`).join(', ')}. The ${big ? 'largest' : 'smallest'} is ${show[best]}.`,
                    };
                },
            },
            {
                id: 'not-equal', name: 'Spot the odd one out', level: 2,
                gen(rng) {
                    const [n, d] = rng.pick(POOL_EASY.filter(([n, d]) => n * 100 % d === 0 && d > 2));
                    const k = rng.int(2, 5), v = n / d, p = n * 100 / d;
                    const equal = [m(fr(n * k, d * k)), `${p}%`, num(v)];
                    const mistakes = [...(n < 10 && d < 10 ? [`0.${n}${d}`] : []), `${num(p / 10)}%`, `${num(v)}%`, m(fr(d, n)), m(fr(n + 1, d + 1))]
                        .filter(s => !equal.includes(s));
                    const wrong = rng.pick(mistakes);
                    // make sure the wrong one really is a different value
                    const valueOf = s => (s.startsWith('\\(') ? null : s.endsWith('%') ? Number(s.slice(0, -1)) / 100 : Number(s));
                    const wv = valueOf(wrong);
                    if (wv !== null && Math.abs(wv - v) < 1e-9) return this.gen(rng);
                    return {
                        q: R`Which of these is <b>not</b> equal to \(${fr(n, d)}\)?`,
                        ans: CA.mc(rng, wrong, equal),
                        sol: R`\(${fr(n, d)} = ${num(v)} = ${p}\%\), and \(${fr(n * k, d * k)}\) is the same fraction (×${k}). So ${wrong} is the odd one out.`,
                    };
                },
            },

            // ── Part C ──────────────────────────────────────────────────
            {
                id: 'hard-fractions', name: 'Awkward denominators', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    let n, d;
                    if (kind < 2) do { d = rng.pick([16, 16, 32, 40, 80]); n = rng.int(1, d - 1); } while (gcd(n, d) !== 1);
                    else [n, d] = rng.pick(POOL_HARD.filter(([, q]) => !terminates(q)));
                    if (kind === 0) return {
                        q: R`Write \(${fr(n, d)}\) as a percentage.`,
                        ans: CA.num(pct(n, d), '%'),
                        sol: fracToPctSol(n, d),
                    };
                    if (kind === 1) return {
                        q: `Write ${num(pct(n, d))}% as a fraction in its simplest form.`,
                        ans: CA.frac(n, d),
                        sol: R`${num(pct(n, d))}% \(= ${fr(num(pct(n, d)), 100)} = ${fr(...decFrac(num(dec(n, d))))} = ${fr(n, d)}\).`,
                    };
                    const v = CA.round(100 * n / d, 2);
                    return {
                        q: R`Write \(${fr(n, d)}\) as a percentage, rounded to 2 decimal places.`,
                        ans: CA.num(v, '%'),
                        sol: R`\(${n} \div ${d} = ${(n / d).toFixed(6)}\ldots\), so about ${v.toFixed(2)}%.`,
                    };
                },
            },
            {
                id: 'over-one', name: 'Numbers bigger than 1', level: 3,
                gen(rng) {
                    const [n, d] = rng.pick(POOL_EASY), w = rng.int(1, 3), N = w * d + n, kind = rng.int(0, 2);
                    const p = num(pct(N, d)), s = num(dec(N, d));
                    if (kind === 0) return {
                        q: R`Write \(${mx(w, n, d)}\) as a percentage.`,
                        ans: CA.num(pct(N, d), '%'),
                        sol: R`\(${mx(w, n, d)} = ${w} + ${num(dec(n, d))} = ${s}\), and \(${s} \times 100 = ${p}\), so ${p}%.`,
                    };
                    if (kind === 1) return {
                        q: `Write ${p}% as a mixed number in its simplest form.`,
                        ans: CA.frac(N, d, '', { mixed: true }),
                        sol: R`${p}% \(= ${s} = ${w} + ${num(dec(n, d))} = ${mx(w, n, d)}\).`,
                    };
                    return {
                        q: `Write ${s} as a mixed number in its simplest form.`,
                        ans: CA.frac(N, d, '', { mixed: true }),
                        sol: R`\(${s} = ${w} + ${num(dec(n, d))}\) and \(${num(dec(n, d))} = ${fr(n, d)}\), so \(${mx(w, n, d)}\).`,
                    };
                },
            },
            {
                id: 'repeating', name: 'Repeating decimals to fractions', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                           // 0.aaa… = a/9
                        const a = rng.int(1, 8);
                        return {
                            q: R`Write \(0.\overline{${a}}\) (that is, \(0.${a}${a}${a}\ldots\)) as a fraction in its simplest form.`,
                            ans: CA.frac(a, 9),
                            sol: R`One repeating digit goes over 9: \(0.\overline{${a}} = ${fr(a, 9)}${thenReduce(a, 9)}\).`,
                        };
                    }
                    if (kind === 1) {                                           // 0.ababab… = ab/99
                        let ab; do ab = rng.int(1, 98); while (ab % 11 === 0);
                        const s = String(ab).padStart(2, '0');
                        return {
                            q: R`Write \(0.\overline{${s}}\) (that is, \(0.${s}${s}\ldots\)) as a fraction in its simplest form.`,
                            ans: CA.frac(ab, 99),
                            sol: R`Let \(x = 0.\overline{${s}}\). Then \(100x - x = ${ab}\), so \(x = ${fr(ab, 99)}${thenReduce(ab, 99)}\).`,
                        };
                    }
                    const a = rng.int(1, 9), b = rng.int(1, 9);                 // 0.abbb… = (10a + b − a)/90
                    if (a === b) return this.gen(rng);
                    const top = 10 * a + b - a;
                    return {
                        q: R`Write \(0.${a}\overline{${b}}\) (that is, \(0.${a}${b}${b}${b}\ldots\)) as a fraction in its simplest form.`,
                        ans: CA.frac(top, 90),
                        sol: R`Let \(x = 0.${a}\overline{${b}}\). Then \(100x - 10x = ${10 * a + b}.\overline{${b}} - ${a}.\overline{${b}} = ${top}\), so \(x = ${fr(top, 90)}${thenReduce(top, 90)}\).`,
                    };
                },
            },
            {
                id: 'in-context', name: 'Conversions in real life', level: 3,
                gen(rng) {
                    const who = rng.pick(['Maya', 'Liam', 'Sofia', 'Noah', 'Ava', 'Ethan', 'Zara', 'Kai']);
                    const kind = rng.int(0, 3);
                    if (kind === 0) {                                           // part of a class as a percent
                        const total = rng.pick([20, 25, 40, 50]), part = rng.int(3, total - 3);
                        const what = rng.pick(['walk to school', 'have a pet', 'play an instrument', 'wear glasses']);
                        return {
                            q: `In a class of ${total} students, ${part} ${what}. What percentage of the class is that?`,
                            ans: CA.num(pct(part, total), '%'),
                            sol: fracToPctSol(part, total),
                        };
                    }
                    if (kind === 1) {                                           // which test score is better
                        const out = rng.pick([20, 25, 40, 50]), got = rng.int(Math.ceil(out * 0.6), out - 1);
                        let other; do other = rng.int(60, 98); while (Math.abs(other - pct(got, out)) < 1);
                        const better = Math.max(other, pct(got, out));
                        return {
                            q: `${who} scored ${got} out of ${out} on one test and ${other}% on another. What is the better score, as a percentage?`,
                            ans: CA.num(better, '%'),
                            sol: R`\(${fr(got, out)} = ${num(pct(got, out))}\%\), which is ${pct(got, out) > other ? 'more' : 'less'} than ${other}%. The better score is ${num(better)}%.`,
                        };
                    }
                    if (kind === 2) {                                           // decimal share → fraction
                        const [n, d] = rng.pick(POOL_EASY.filter(([, d]) => d !== 2));
                        return {
                            q: `${who} has read ${num(dec(n, d))} of a book. What fraction of the book is that, in simplest form?`,
                            ans: CA.frac(n, d),
                            sol: R`\(${num(dec(n, d))} = ${fr(...decFrac(num(dec(n, d))))} = ${fr(n, d)}\).`,
                        };
                    }
                    // discount: percent → fraction of the price
                    const [n, d] = rng.pick([[1, 4], [1, 5], [3, 10], [2, 5], [1, 10], [3, 20], [1, 8], [3, 8], [1, 20], [7, 20]]);
                    const p = num(pct(n, d));
                    return {
                        q: `A shop takes ${p}% off every price. What fraction of the price is taken off? Give it in simplest form.`,
                        ans: CA.frac(n, d),
                        sol: R`${p}% \(= ${fr(p, 100)} = ${fr(n, d)}\).`,
                    };
                },
            },
        ]),

        assignment: [
            ['frac-to-pct', 4], ['frac-to-dec', 4], ['pct-dec', 4], ['pct-to-frac', 3],
            ['dec-to-frac', 4], ['tricky-pct-to-frac', 4], ['recur-to-pct', 4], ['recur-to-dec', 4], ['which-largest', 4], ['not-equal', 3],
            ['hard-fractions', 3], ['over-one', 3], ['repeating', 3], ['in-context', 3],
        ],
    });
})();
