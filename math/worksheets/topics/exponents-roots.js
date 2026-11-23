/* Worksheet: Exponents, Powers & Roots — powers, the laws of indices, square and cube roots. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, T = CA.tex;

    /** "a^{n}" with brackets round a negative or fractional base. */
    const pw = (b, e) => `${b < 0 ? `(${b})` : b}^{${e}}`;
    /** x^n written the way a teacher would: x for n = 1, nothing silly. */
    const xp = (e, v = 'x') => (e === 1 ? v : `${v}^{${e}}`);
    /** Coefficient times x^n: 12x^{7}. */
    const cx = (c, e, v = 'x') => `${c === 1 ? '' : c === -1 ? '-' : c}${xp(e, v)}`;
    const times = (b, e) => Array(e).fill(b < 0 ? `(${b})` : b).join(R` \times `);
    const ROOT_WORD = { 2: 'square', 3: 'cube', 4: 'fourth', 5: 'fifth' };
    const nthRoot = (n, x) => (n === 2 ? R`\sqrt{${x}}` : R`\sqrt[${n}]{${x}}`);

    CA.register({
        id: 'exponents-roots',
        title: 'Exponents, Powers & Roots',
        page: 'exponents-roots.html',
        assignmentNote: 'Work without a calculator. Give answers that are not whole numbers as fractions in lowest terms, and roots in simplest radical form when asked.',

        practice: [
            {
                id: 'evaluate-power', name: 'Evaluate a power', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    let b, e;
                    if (kind === 0) { b = rng.int(2, 12); e = 2; }
                    else if (kind === 1) { b = rng.int(2, 10); e = 3; }
                    else if (kind === 2) { [b, e] = rng.pick([[2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [3, 4], [3, 5], [4, 4], [5, 4], [10, 4], [10, 5], [10, 6]]); }
                    else { b = -rng.int(2, 6); e = rng.int(2, 4); if (Math.abs(b) ** e > 700) e = 2; }
                    const v = b ** e;
                    return {
                        q: rng.bool(0.3) && b > 0 ? R`What is ${b} to the power ${e}? (Work out \(${pw(b, e)}\).)` : R`Evaluate \(${pw(b, e)}\).`,
                        ans: CA.num(v),
                        sol: R`\(${pw(b, e)} = ${times(b, e)} = ${v}\).${b < 0 ? (e % 2 ? ' An odd number of negative factors gives a negative answer.' : ' An even number of negative factors gives a positive answer.') : ''}`,
                    };
                },
            },
            {
                id: 'exponent-meaning', name: 'What an exponent means', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const b = rng.int(2, 25), z = rng.bool();
                        if (rng.bool(0.4)) return { q: R`Evaluate \(${b}^{0} + ${b}^{1}\).`, ans: CA.num(1 + b), sol: R`Any non-zero number to the power 0 is 1, and to the power 1 is itself: \(1 + ${b} = ${1 + b}\).` };
                        return { q: R`Evaluate \(${b}^{${z ? 0 : 1}}\).`, ans: CA.num(z ? 1 : b), sol: z ? R`Any non-zero number to the power 0 equals 1.` : R`Any number to the power 1 is itself: \(${b}^{1} = ${b}\).` };
                    }
                    if (kind === 1) {
                        const b = rng.int(2, 12), e = rng.int(3, 7), v = rng.pick(['', 'x', 'a']);
                        const base = v || String(b);
                        return { q: R`Write \(${Array(e).fill(base).join(R` \times `)}\) as a power of \(${base}\). What is the exponent?`, ans: CA.num(e), sol: R`\(${base}\) is multiplied by itself ${e} times, so it is \(${base}^{${e}}\).` };
                    }
                    if (kind === 2) {
                        const [b, e] = rng.pick([[2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 3], [3, 4], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [10, 3], [10, 4], [9, 2], [8, 2]]);
                        return { q: R`Find the missing exponent: \(${b}^{\square} = ${b ** e}\).`, ans: CA.num(e), sol: R`\(${times(b, e)} = ${b ** e}\), so the exponent is ${e}.` };
                    }
                    let a, b;
                    do { a = rng.int(2, 6); b = rng.int(2, 6); } while (a === b);
                    const A = a ** b, B = b ** a;
                    const choices = [m(pw(a, b)), m(pw(b, a)), 'They are equal'];
                    const correct = A > B ? choices[0] : A < B ? choices[1] : choices[2];
                    return {
                        q: R`Which is larger: \(${pw(a, b)}\) or \(${pw(b, a)}\)?`,
                        ans: CA.mc(rng, correct, choices, { keepOrder: true }),
                        sol: R`\(${pw(a, b)} = ${A}\) and \(${pw(b, a)} = ${B}\).${A === B ? ' They are equal!' : ''} An exponent is not multiplication — \(${a}\times${b}\) and \(${b}\times${a}\) would be equal, but powers usually are not.`,
                    };
                },
            },
            {
                id: 'square-root', name: 'Square roots', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 3), r = rng.int(2, 15);
                    if (kind === 0) return { q: R`Find \(\sqrt{${r * r}}\).`, ans: CA.num(r), sol: R`\(${r}^2 = ${r * r}\), so \(\sqrt{${r * r}} = ${r}\).` };
                    if (kind === 1) {
                        const [thing, unit] = rng.pick([['square garden', 'm'], ['square tile', 'cm'], ['square photo', 'cm'], ['square field', 'm'], ['square rug', 'dm']]);
                        return { q: `A ${thing} has an area of ${r * r} ${unit}². How long is each side?`, ans: CA.num(r, unit), sol: R`Side \(= \sqrt{${r * r}} = ${r}\) ${unit}, because \(${r}^2 = ${r * r}\).` };
                    }
                    if (kind === 2) {
                        let s; do s = rng.int(2, 12); while (s === r);
                        return { q: R`Evaluate \(\sqrt{${r * r}} + \sqrt{${s * s}}\).`, ans: CA.num(r + s), sol: R`\(\sqrt{${r * r}} = ${r}\) and \(\sqrt{${s * s}} = ${s}\), so the sum is \(${r + s}\). (It is not \(\sqrt{${r * r + s * s}}\).)` };
                    }
                    return { q: `Which positive whole number, multiplied by itself, gives ${r * r}?`, ans: CA.num(r), sol: R`\(${r}\times${r} = ${r * r}\), so the answer is \(\sqrt{${r * r}} = ${r}\).` };
                },
            },
            {
                id: 'cube-root', name: 'Cube roots', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 3), r = rng.int(2, 10);
                    if (kind === 0) return { q: R`Find \(\sqrt[3]{${r ** 3}}\).`, ans: CA.num(r), sol: R`\(${r}^3 = ${times(r, 3)} = ${r ** 3}\), so \(\sqrt[3]{${r ** 3}} = ${r}\).` };
                    if (kind === 1) {
                        const [thing, unit] = rng.pick([['cube-shaped box', 'cm'], ['cube of cheese', 'cm'], ['cube-shaped tank', 'm'], ['wooden cube', 'cm']]);
                        return { q: `A ${thing} has a volume of ${r ** 3} ${unit}³. How long is each edge?`, ans: CA.num(r, unit), sol: R`Edge \(= \sqrt[3]{${r ** 3}} = ${r}\) ${unit}, because \(${r}^3 = ${r ** 3}\).` };
                    }
                    if (kind === 2) return { q: R`Find \(\sqrt[3]{-${r ** 3}}\).`, ans: CA.num(-r), sol: R`\((-${r})^3 = -${r ** 3}\), so \(\sqrt[3]{-${r ** 3}} = -${r}\). A cube root of a negative number is negative.` };
                    let s; do s = rng.int(1, 6); while (s === r);
                    return { q: R`Evaluate \(\sqrt[3]{${r ** 3}} - \sqrt[3]{${s ** 3}}\).`, ans: CA.num(r - s), sol: R`\(\sqrt[3]{${r ** 3}} = ${r}\) and \(\sqrt[3]{${s ** 3}} = ${s}\), so the answer is \(${r} - ${s} = ${r - s}\).` };
                },
            },
            {
                id: 'product-rule', name: 'Product rule', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const b = rng.int(2, 9), p = rng.int(2, 9), q = rng.int(2, 9);
                        return { q: R`Write \(${b}^{${p}} \times ${b}^{${q}}\) as a single power of ${b}. What is the exponent?`, ans: CA.num(p + q), sol: R`Same base, so add the exponents: \(${b}^{${p}+${q}} = ${b}^{${p + q}}\).` };
                    }
                    if (kind === 1) {
                        const b = rng.int(2, 5), p = rng.int(2, b === 2 ? 3 : 2), q = rng.int(2, b === 2 ? 4 : b === 3 ? 3 : 2);
                        return { q: R`Evaluate \(${b}^{${p}} \times ${b}^{${q}}\).`, ans: CA.num(b ** (p + q)), sol: R`\(${b}^{${p}} \times ${b}^{${q}} = ${b}^{${p + q}} = ${b ** (p + q)}\).` };
                    }
                    if (kind === 2) {
                        const b = rng.pick([2, 3, 5, 7, 10]), p = rng.int(2, 8), t = p + rng.int(2, 9);
                        return { q: R`Find the missing exponent: \(${b}^{${p}} \times ${b}^{\square} = ${b}^{${t}}\).`, ans: CA.num(t - p), sol: R`Exponents add: \(${p} + \square = ${t}\), so \(\square = ${t - p}\).` };
                    }
                    const a = rng.int(2, 7), c = rng.int(2, 6), p = rng.int(1, 6), q = rng.int(2, 6), v = rng.pick(['x', 'a', 'y', 'n']);
                    const correct = cx(a * c, p + q, v);
                    return {
                        q: R`Simplify \(${cx(a, p, v)} \times ${cx(c, q, v)}\).`,
                        ans: CA.mc(rng, m(correct), [cx(a + c, p + q, v), cx(a * c, p * q, v), cx(a + c, p * q, v), cx(a * c, p + q + 1, v), cx(a * c, p + q - 1, v)].map(m)),
                        sol: R`Multiply the numbers and add the exponents: \(${a}\times${c} = ${a * c}\) and \(${v}^{${p}+${q}} = ${xp(p + q, v)}\). So \(${correct}\).`,
                    };
                },
            },
            {
                id: 'quotient-rule', name: 'Quotient rule', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const b = rng.int(2, 9), q = rng.int(2, 8), p = q + rng.int(1, 9);
                        return { q: R`Write \(${b}^{${p}} \div ${b}^{${q}}\) as a single power of ${b}. What is the exponent?`, ans: CA.num(p - q), sol: R`Same base, so subtract the exponents: \(${b}^{${p}-${q}} = ${b}^{${p - q}}\).` };
                    }
                    if (kind === 1) {
                        const b = rng.int(2, 6), d = rng.int(1, b <= 3 ? 4 : 2), q = rng.int(2, 9), p = q + d;
                        return { q: rng.bool() ? R`Evaluate \(${b}^{${p}} \div ${b}^{${q}}\).` : R`Evaluate \(\dfrac{${b}^{${p}}}{${b}^{${q}}}\).`, ans: CA.num(b ** d), sol: R`Subtract the exponents: \(${b}^{${p}-${q}} = ${b}^{${d}} = ${b ** d}\).` };
                    }
                    if (kind === 2) {
                        const b = rng.pick([2, 3, 5, 7, 10]), t = rng.int(1, 6), q = rng.int(2, 8), p = t + q;
                        return { q: R`Find the missing exponent: \(${b}^{\square} \div ${b}^{${q}} = ${b}^{${t}}\).`, ans: CA.num(p), sol: R`Exponents subtract: \(\square - ${q} = ${t}\), so \(\square = ${p}\).` };
                    }
                    const c = rng.int(2, 6), k = rng.int(2, 5), a = c * k, q = rng.int(2, 5), p = q + rng.int(1, 6), v = rng.pick(['x', 'a', 'y', 'm']);
                    const correct = cx(k, p - q, v);
                    return {
                        q: R`Simplify \(\dfrac{${cx(a, p, v)}}{${cx(c, q, v)}}\).`,
                        ans: CA.mc(rng, m(correct), [cx(a - c, p - q, v), cx(k, p + q, v), cx(a * c, p - q, v), cx(k, p - q + 1, v)].map(m)),
                        sol: R`Divide the numbers and subtract the exponents: \(${a}\div${c} = ${k}\) and \(${v}^{${p}-${q}} = ${xp(p - q, v)}\). So \(${correct}\).`,
                    };
                },
            },
            {
                id: 'power-of-power', name: 'Power of a power, power of a product', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 4);
                    if (kind === 0) {
                        const b = rng.int(2, 9), p = rng.int(2, 6), q = rng.int(2, 5);
                        return { q: R`Write \((${b}^{${p}})^{${q}}\) as a single power of ${b}. What is the exponent?`, ans: CA.num(p * q), sol: R`Multiply the exponents: \(${p}\times${q} = ${p * q}\), so \(${b}^{${p * q}}\).` };
                    }
                    if (kind === 1) {
                        const [b, p, q] = rng.pick([[2, 2, 2], [2, 2, 3], [2, 3, 2], [2, 2, 4], [2, 4, 2], [3, 2, 2], [3, 2, 3], [3, 3, 2], [5, 2, 2], [10, 2, 2], [10, 3, 2], [4, 2, 2]]);
                        return { q: R`Evaluate \((${b}^{${p}})^{${q}}\).`, ans: CA.num(b ** (p * q)), sol: R`\((${b}^{${p}})^{${q}} = ${b}^{${p * q}} = ${b ** (p * q)}\).` };
                    }
                    if (kind === 2) {
                        const [a, b] = rng.pick([[2, 5], [4, 25], [2, 50], [4, 5], [3, 2], [5, 20], [2, 3]]), n = rng.int(2, a * b >= 50 ? 2 : 3);
                        return { q: R`Evaluate \(${a}^{${n}} \times ${b}^{${n}}\) by first writing it as \((${a}\times${b})^{${n}}\).`, ans: CA.num((a * b) ** n), sol: R`\(${a}^{${n}}\times${b}^{${n}} = (${a}\times${b})^{${n}} = ${a * b}^{${n}} = ${(a * b) ** n}\).` };
                    }
                    if (kind === 3) {
                        const q = rng.int(2, 5), num = rng.int(1, 4), d = rng.int(2, 5);
                        if (CA.gcd(num, d) !== 1 || d ** q > 1000) return this.gen(rng);
                        return { q: R`Evaluate \(\left(\dfrac{${num}}{${d}}\right)^{${q}}\).`, ans: CA.frac(num ** q, d ** q), sol: R`Raise top and bottom to the power ${q}: \(\dfrac{${num}^{${q}}}{${d}^{${q}}} = ${T.frac(num ** q, d ** q)}\).` };
                    }
                    const a = rng.int(2, 5), p = rng.int(2, 5), n = rng.int(2, a === 2 ? 5 : 3), v = rng.pick(['x', 'y', 'a']);
                    const correct = cx(a ** n, p * n, v);
                    return {
                        q: R`Simplify \((${cx(a, p, v)})^{${n}}\).`,
                        ans: CA.mc(rng, m(correct), [cx(a * n, p * n, v), cx(a, p * n, v), cx(a ** n, p + n, v), cx(a * n, p + n, v), cx(a, p + n, v), cx(a ** n, p * n + 1, v)].map(m)),
                        sol: R`Every factor inside is raised to the power ${n}: \(${a}^{${n}} = ${a ** n}\) and \((${xp(p, v)})^{${n}} = ${xp(p * n, v)}\). So \(${correct}\).`,
                    };
                },
            },
            {
                id: 'negative-exponent', name: 'Negative exponents', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 4);
                    if (kind === 0) {
                        const [b, n] = rng.pick([[2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [3, 1], [3, 2], [3, 3], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [8, 2], [9, 2]]);
                        return { q: R`Evaluate \(${b}^{-${n}}\). Give your answer as a fraction.`, ans: CA.frac(1, b ** n), sol: R`A negative exponent means "one over": \(${b}^{-${n}} = \dfrac{1}{${b}^{${n}}} = ${T.frac(1, b ** n)}\).` };
                    }
                    if (kind === 1) {
                        const n = rng.int(1, 4);
                        return { q: R`Evaluate \(10^{-${n}}\) as a fraction or decimal.`, ans: CA.frac(1, 10 ** n), sol: R`\(10^{-${n}} = \dfrac{1}{10^{${n}}} = ${T.frac(1, 10 ** n)} = ${(1 / 10 ** n).toFixed(n)}\).` };
                    }
                    if (kind === 2) {
                        let p, q, n;
                        do { p = rng.int(1, 5); q = rng.int(2, 6); n = rng.int(1, 3); } while (CA.gcd(p, q) !== 1 || q ** n > 250 || p ** n > 250 || (p === 1 && n === 1));
                        return { q: R`Evaluate \(\left(${T.frac(p, q)}\right)^{-${n}}\).`, ans: CA.frac(q ** n, p ** n), sol: R`Flip the fraction and make the exponent positive: \(${n === 1 ? T.frac(q, p) : R`\left(${T.frac(q, p)}\right)^{${n}} = ${T.frac(q ** n, p ** n)}`}\).` };
                    }
                    if (kind === 3) {
                        const b = rng.int(2, 5), p = rng.int(2, 6), q = -(p + rng.int(1, b === 2 ? 3 : 2));
                        const e = p + q;
                        return { q: R`Evaluate \(${b}^{${p}} \times ${b}^{${q}}\).`, ans: CA.frac(1, b ** -e), sol: R`Add the exponents: \(${p} + (${q}) = ${e}\), so \(${b}^{${e}} = \dfrac{1}{${b}^{${-e}}} = ${T.frac(1, b ** -e)}\).` };
                    }
                    const n = rng.int(2, 5), v = rng.pick(['x', 'y', 'a']);
                    return {
                        q: R`Which expression is equal to \(${v}^{-${n}}\)?`,
                        ans: CA.mc(rng, m(R`\dfrac{1}{${v}^{${n}}}`), [m(`-${v}^{${n}}`), m(`-${n}${v}`), m(R`\dfrac{1}{${n}${v}}`)]),
                        sol: R`A negative exponent is a reciprocal, not a negative number: \(${v}^{-${n}} = \dfrac{1}{${v}^{${n}}}\).`,
                    };
                },
            },
            {
                id: 'fractional-exponent', name: 'Fractional exponents', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 3) {
                        const n = rng.int(2, 5), v = rng.pick(['x', 'y', 'a']);
                        return {
                            q: R`Which expression is equal to \(${v}^{1/${n}}\)?`,
                            ans: CA.mc(rng, m(nthRoot(n, v)), [m(R`\dfrac{${v}}{${n}}`), m(`${v}^{-${n}}`), m(R`\dfrac{1}{${v}^{${n}}}`), m(`${n}${v}`)]),
                            sol: R`A power of \(\tfrac1{${n}}\) is the ${ROOT_WORD[n]} root: \(${v}^{1/${n}} = ${nthRoot(n, v)}\).`,
                        };
                    }
                    const n = kind === 0 ? 2 : kind === 1 ? 3 : rng.pick([4, 5]);
                    const r = n === 2 ? rng.int(2, 15) : n === 3 ? rng.int(2, 10) : n === 4 ? rng.int(2, 5) : rng.int(2, 3);
                    const a = r ** n;
                    return {
                        q: R`Evaluate \(${a}^{1/${n}}\).`,
                        ans: CA.num(r),
                        sol: R`\(${a}^{1/${n}} = ${nthRoot(n, a)} = ${r}\), because \(${r}^{${n}} = ${a}\).`,
                    };
                },
            },
            {
                id: 'index-laws', name: 'Use the index laws', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const b = rng.pick([2, 2, 3, 3, 5, 10]), e = rng.int(1, b === 2 ? 6 : b === 10 ? 4 : 3);
                        const p = rng.int(2, 9), r = rng.int(2, 9), q = e + r - p;
                        if (q < 2) return this.gen(rng);
                        return { q: R`Evaluate \(\dfrac{${b}^{${p}} \times ${b}^{${q}}}{${b}^{${r}}}\).`, ans: CA.num(b ** e), sol: R`Add then subtract the exponents: \(${p} + ${q} - ${r} = ${e}\), so the answer is \(${b}^{${e}} = ${b ** e}\).` };
                    }
                    if (kind === 1) {
                        const n = rng.int(2, 6);
                        return { q: R`Evaluate \(2^{${n}} \times 5^{${n}}\).`, ans: CA.num(10 ** n), sol: R`\(2^{${n}} \times 5^{${n}} = (2\times5)^{${n}} = 10^{${n}} = ${10 ** n}\).` };
                    }
                    if (kind === 2) {
                        const b = rng.pick([2, 3, 5]), p = rng.int(2, 4), q = rng.int(2, 3), e = rng.int(1, b === 2 ? 5 : 3), k = p * q - e;
                        return { q: R`Evaluate \((${b}^{${p}})^{${q}} \div ${b}^{${k}}\).`, ans: CA.num(b ** e), sol: R`\((${b}^{${p}})^{${q}} = ${b}^{${p * q}}\), and \(${b}^{${p * q}} \div ${b}^{${k}} = ${b}^{${e}} = ${b ** e}\).` };
                    }
                    const b = rng.pick([2, 3, 5, 10]), p = rng.int(2, 7), q = rng.int(2, 7), r = rng.int(2, 7);
                    return { q: R`Write \(${b}^{${p}} \times ${b}^{${q}} \times ${b}^{${r}}\) as a single power of ${b}. What is the exponent?`, ans: CA.num(p + q + r), sol: R`Add all the exponents: \(${p} + ${q} + ${r} = ${p + q + r}\).` };
                },
            },
            {
                id: 'simplify-root', name: 'Simplify square roots', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2), s = rng.pick([2, 3, 5, 6, 7, 10, 11]);
                    if (kind === 0) {
                        const k = rng.int(2, s <= 3 ? 10 : 6), N = k * k * s;
                        return { q: R`Write \(\sqrt{${N}}\) in simplest radical form.`, ans: CA.rootOf(N), sol: R`\(${N} = ${k * k}\times${s}\), so \(\sqrt{${N}} = \sqrt{${k * k}}\times\sqrt{${s}} = ${T.root(k, s)}\).` };
                    }
                    if (kind === 1) {
                        let p, q;
                        do { p = rng.int(2, 6); q = rng.int(2, 6); } while (p === q);
                        const A = p * p * s, B = q * q * s;
                        const op = rng.bool(0.7) ? '+' : '-';
                        const c = op === '+' ? p + q : p - q;
                        return { q: R`Simplify \(\sqrt{${A}} ${op} \sqrt{${B}}\).`, ans: CA.root(c, s), sol: R`\(\sqrt{${A}} = ${T.root(p, s)}\) and \(\sqrt{${B}} = ${T.root(q, s)}\), so the answer is \(${T.root(c, s)}\).` };
                    }
                    for (;;) {
                        const a = rng.int(2, 15), b = rng.int(2, 15);
                        if (a >= b || CA.isSquare(a) || CA.isSquare(b)) continue;
                        const [k, r] = CA.simplifyRoot(a * b);
                        if (k === 1 || a * b > 300) continue;
                        return { q: R`Simplify \(\sqrt{${a}} \times \sqrt{${b}}\).`, ans: CA.rootOf(a * b), sol: R`\(\sqrt{${a}}\times\sqrt{${b}} = \sqrt{${a * b}} = \sqrt{${k * k}\times${r}} = ${T.root(k, r)}\).` };
                    }
                },
            },
            {
                id: 'solve-exponent', name: 'Find the unknown exponent', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const b = rng.int(2, 5), k = rng.int(3, b === 2 ? 9 : 5), c = rng.int(1, 4) * (rng.bool() ? 1 : -1);
                        return { q: R`Solve \(${b}^{x ${c < 0 ? '-' : '+'} ${Math.abs(c)}} = ${b ** k}\).`, ans: CA.num(k - c), sol: R`\(${b ** k} = ${b}^{${k}}\), so \(x ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${k}\) and \(x = ${k - c}\).` };
                    }
                    if (kind === 1) {
                        const b = rng.int(2, 6), k = rng.int(1, b === 2 ? 6 : 3);
                        return { q: R`Solve \(${b}^{x} = \dfrac{1}{${b ** k}}\).`, ans: CA.num(-k), sol: R`\(\dfrac{1}{${b ** k}} = \dfrac{1}{${b}^{${k}}} = ${b}^{-${k}}\), so \(x = -${k}\).` };
                    }
                    if (kind === 2) {
                        const [p, u, v] = rng.pick([[2, 2, 1], [2, 3, 1], [2, 1, 2], [2, 1, 3], [2, 2, 3], [2, 3, 2], [3, 2, 1], [3, 1, 2], [3, 2, 3], [3, 3, 2], [5, 2, 1], [5, 1, 2]]);
                        const w = rng.int(1, 6), A = p ** u, B = p ** v;
                        if ((v * w) % u === 0 && rng.bool(0.6)) return this.gen(rng);
                        if (B ** w > 1e6) return this.gen(rng);
                        return { q: R`Solve \(${A}^{x} = ${B}^{${w}}\).`, ans: CA.frac(v * w, u), sol: R`Write both sides as powers of ${p}: \(${p}^{${u === 1 ? '' : u}x} = ${p}^{${v * w}}\). So \(${u === 1 ? '' : u}x = ${v * w}\) and \(x = ${T.frac(v * w, u)}\).` };
                    }
                    const b = rng.int(2, 4), k = rng.int(2, b === 2 ? 6 : 4), a = rng.int(2, 3), c = a * k;
                    return { q: R`Solve \(${b}^{${a}x} = ${b ** c}\).`, ans: CA.num(k), sol: R`\(${b ** c} = ${b}^{${c}}\), so \(${a}x = ${c}\) and \(x = ${k}\).` };
                },
            },
            {
                id: 'rational-exponent', name: 'Harder fractional exponents', level: 3,
                gen(rng) {
                    for (;;) {
                        const q = rng.pick([2, 2, 3, 3, 4]), r = rng.int(2, q === 2 ? 6 : q === 3 ? 5 : 3), p = rng.int(2, 4);
                        if (CA.gcd(p, q) !== 1 || r ** p > 1000) continue;
                        const a = r ** q, v = r ** p, neg = rng.bool(0.35), fracBase = !neg && rng.bool(0.2);
                        if (fracBase) {
                            const s = rng.int(2, 5);
                            if (s === r || CA.gcd(s, r) !== 1 || s ** p > 1000) continue;
                            return { q: R`Evaluate \(\left(\dfrac{${a}}{${s ** q}}\right)^{${p}/${q}}\).`, ans: CA.frac(v, s ** p), sol: R`Take the ${ROOT_WORD[q]} root first, then the power: \(\left(${T.frac(r, s)}\right)^{${p}} = ${T.frac(v, s ** p)}\).` };
                        }
                        return {
                            q: R`Evaluate \(${a}^{${neg ? '-' : ''}${p}/${q}}\).`,
                            ans: neg ? CA.frac(1, v) : CA.num(v),
                            sol: R`Take the ${ROOT_WORD[q]} root first: \(${nthRoot(q, a)} = ${r}\). Then \(${r}^{${p}} = ${v}\)${neg ? R`, and the minus sign flips it: \(${T.frac(1, v)}\)` : ''}.`,
                        };
                    }
                },
            },
        ],

        assignment: [
            ['evaluate-power', 4], ['exponent-meaning', 3], ['square-root', 4], ['cube-root', 4],
            ['product-rule', 4], ['quotient-rule', 4], ['power-of-power', 4], ['negative-exponent', 4], ['fractional-exponent', 3], ['index-laws', 4],
            ['simplify-root', 4], ['solve-exponent', 4], ['rational-exponent', 4],
        ],
    });
})();
