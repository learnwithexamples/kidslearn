/* Worksheet: Number Theory — factors, multiples, primes, prime factorisation,
   GCF, LCM and divisibility rules. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, gcd = CA.gcd, lcm = CA.lcm;

    // ── Number helpers ───────────────────────────────────────────────────
    const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
    const factorsOf = n => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
    /** [[p, e], …] for n ≥ 2. */
    const pf = n => { const out = []; for (let p = 2; n > 1; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) out.push([p, e]); } return out; };
    /** TeX for a list of [base, exponent]. */
    const pfTex = parts => parts.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(R` \times `);
    const digitSum = n => String(n).split('').reduce((s, c) => s + Number(c), 0);
    const sorted = arr => arr.slice().sort((a, b) => a - b).map(String);
    const listOr = arr => { const s = sorted(arr); return s.slice(0, -1).join(', ') + ' or ' + s[s.length - 1]; };
    const listAnd = arr => arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
    const lcmAll = arr => arr.reduce((a, b) => lcm(a, b));
    const gcdAll = arr => arr.reduce((a, b) => gcd(a, b));
    const NAMES = ['Maya', 'Liam', 'Sofia', 'Noah', 'Ava', 'Ethan', 'Mia', 'Lucas', 'Zara', 'Kai'];
    const LOOKS_PRIME = [1, 9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 77, 81, 85, 87, 91, 93, 95];
    const PRIMES = []; for (let i = 2; i < 100; i++) if (isPrime(i)) PRIMES.push(i);

    /** Number built from small primes, with at least `kinds` different primes, in [lo, hi]. */
    function composite(rng, lo, hi, kinds = 2, minPrimeFactors = 3) {
        for (;;) {
            let n = 1;
            for (const p of [2, 3, 5, 7, 11]) n *= p ** rng.int(0, p === 2 ? 4 : p === 3 ? 3 : p <= 7 ? 2 : 1);
            const parts = pf(n);
            if (n >= lo && n <= hi && parts.length >= kinds && parts.reduce((s, [, e]) => s + e, 0) >= minPrimeFactors) return n;
        }
    }
    /** Two different coprime multipliers in [min, max]. */
    function coprimePair(rng, max, min = 2) { for (;;) { const x = rng.int(min, max), y = rng.int(min, max); if (x !== y && gcd(x, y) === 1) return [x, y]; } }

    CA.register({
        id: 'number-theory',
        title: 'Number Theory',
        page: 'number-theory.html',
        assignmentNote: 'Write whole-number answers. For multiple-choice questions, circle the letter of the correct answer. Remember: 1 is neither prime nor composite.',

        practice: [
            // ── Part A ──────────────────────────────────────────────────
            {
                id: 'prime-or-not', name: 'Prime or not', level: 1,
                gen(rng) {
                    if (rng.bool(0.65)) {
                        const p = rng.pick(PRIMES.filter(x => x > 10)), others = rng.sample(LOOKS_PRIME, 3);
                        return {
                            q: `Which of the numbers ${listOr([p, ...others])} is prime?`,
                            ans: CA.mc(rng, String(p), sorted([p, ...others]), { keepOrder: true }),
                            sol: `${p} has only the factors 1 and ${p}. ${others.map(c => c === 1 ? '1 is not prime' : `${c} = ${pf(c).map(([q, e]) => Array(e).fill(q).join(' × ')).join(' × ')}`).join('; ')}.`,
                        };
                    }
                    const c = rng.pick(LOOKS_PRIME), ps = rng.sample(PRIMES.filter(x => x > 2 && x < 98), 3);
                    return {
                        q: `Which of the numbers ${listOr([c, ...ps])} is <b>not</b> prime?`,
                        ans: CA.mc(rng, String(c), sorted([c, ...ps]), { keepOrder: true }),
                        sol: c === 1 ? `1 has only one factor, so it is not prime. ${listAnd(ps)} are prime.` : `${c} = ${pf(c).map(([q, e]) => Array(e).fill(q).join(' × ')).join(' × ')}, so it is composite. ${listAnd(ps)} are prime.`,
                    };
                },
            },
            {
                id: 'factors', name: 'Factors', level: 1,
                gen(rng) {
                    let n; do n = rng.int(12, 100); while (factorsOf(n).length < 6);
                    const f = factorsOf(n);
                    if (rng.bool(0.5)) return {
                        q: `How many factors does ${n} have?`,
                        ans: CA.num(f.length),
                        sol: `Find them in pairs: ${f.slice(0, Math.ceil(f.length / 2)).map(a => `${a} × ${n / a}`).join(', ')}. That is ${f.length} factors: ${f.join(', ')}.`,
                    };
                    const missing = f.filter(x => x !== 1 && x !== n), drop = rng.pick(missing);
                    let extra; do extra = rng.int(2, n - 1); while (n % extra === 0);
                    const show = arr => arr.slice().sort((a, b) => a - b).join(', ');
                    return {
                        q: `Which list shows <b>all</b> the factors of ${n}?`,
                        ans: CA.mc(rng, show(f), [show(f.filter(x => x !== drop)), show([...f, extra]), show(f.filter(x => x !== 1 && x !== n))]),
                        sol: `Pair them up: ${f.slice(0, Math.ceil(f.length / 2)).map(a => `${a} × ${n / a}`).join(', ')}. So the factors are ${f.join(', ')}.`,
                    };
                },
            },
            {
                id: 'multiples', name: 'Multiples', level: 1,
                gen(rng) {
                    const n = rng.int(3, 15), kind = rng.int(0, 3);
                    if (kind === 0) {
                        const k = rng.int(6, 15);
                        return { q: `What is the ${k}th multiple of ${n}?`, ans: CA.num(k * n), sol: R`\(${k} \times ${n} = ${k * n}\).` };
                    }
                    let X; do X = rng.int(50, 200); while (X % n === 0);
                    const below = Math.floor(X / n) * n;
                    if (kind === 1) return { q: `What is the smallest multiple of ${n} that is greater than ${X}?`, ans: CA.num(below + n), sol: R`\(${X} \div ${n} = ${Math.floor(X / n)}\) remainder ${X % n}, so the next multiple is \(${Math.floor(X / n) + 1} \times ${n} = ${below + n}\).` };
                    if (kind === 2) return { q: `What is the largest multiple of ${n} that is less than ${X}?`, ans: CA.num(below), sol: R`\(${X} \div ${n} = ${Math.floor(X / n)}\) remainder ${X % n}, so \(${Math.floor(X / n)} \times ${n} = ${below}\).` };
                    return { q: `How many multiples of ${n} are there from 1 to ${X}?`, ans: CA.num(Math.floor(X / n)), sol: R`\(${X} \div ${n} = ${Math.floor(X / n)}\) remainder ${X % n}, so ${Math.floor(X / n)} multiples (${n}, ${2 * n}, …, ${below}).` };
                },
            },
            {
                id: 'divisible-by', name: 'Divisibility rules', level: 1,
                gen(rng) {
                    const D = rng.pick([3, 4, 5, 6, 9]);
                    const rule = {
                        3: 'its digit sum is divisible by 3', 4: 'its last two digits make a number divisible by 4', 5: 'it ends in 0 or 5',
                        6: 'it is even and its digit sum is divisible by 3', 9: 'its digit sum is divisible by 9',
                    }[D];
                    // Wrong choices that fail the rule in a tempting way.
                    const tempting = {
                        3: x => x % 3 !== 0 && x % 2 === 1, 4: x => x % 2 === 0 && x % 4 !== 0, 5: x => x % 10 === 2 || x % 10 === 8 || x % 10 === 6,
                        6: x => x % 6 !== 0 && (x % 3 === 0 || x % 2 === 0), 9: x => x % 3 === 0 && x % 9 !== 0,
                    }[D];
                    let c; do c = rng.int(100, 9999); while (c % D !== 0);
                    const wrong = new Set();
                    while (wrong.size < 3) { const x = rng.int(100, 9999); if (tempting(x)) wrong.add(x); }
                    return {
                        q: `Which of the numbers ${listOr([c, ...wrong])} is divisible by ${D}?`,
                        ans: CA.mc(rng, String(c), sorted([c, ...wrong]), { keepOrder: true }),
                        sol: D === 3 || D === 9 || D === 6
                            ? `A number is divisible by ${D} if ${rule}. ${c} has digit sum ${digitSum(c)}, so ${c} ÷ ${D} = ${c / D}.`
                            : `A number is divisible by ${D} if ${rule}. ${c} ÷ ${D} = ${c / D}.`,
                    };
                },
            },

            // ── Part B ──────────────────────────────────────────────────
            {
                id: 'gcf', name: 'Greatest common factor', level: 2,
                gen(rng) {
                    if (rng.bool(0.25)) {                                       // three numbers
                        const g = rng.int(2, 12);
                        let xs; do xs = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 3); while (gcdAll(xs) !== 1 || g * Math.max(...xs) > 120);
                        const nums = xs.map(x => g * x).sort((a, b) => a - b);
                        return { q: `Find the GCF of ${listAnd(nums)}.`, ans: CA.num(g), sol: R`\(${nums.map(v => R`${v} = ${g} \times ${v / g}`).join(R`,\quad `)}\), and ${listAnd(xs.slice().sort((a, b) => a - b))} have no common factor, so the GCF is ${g}.` };
                    }
                    const g = rng.int(2, 15), [x, y] = coprimePair(rng, 9);
                    const a = g * x, b = g * y;
                    if (a < 4 || b < 4 || Math.max(a, b) > 120) return this.gen(rng);
                    return {
                        q: rng.pick([`Find the GCF of ${a} and ${b}.`, `What is the greatest common factor of ${a} and ${b}?`]),
                        ans: CA.num(g),
                        sol: R`\(${a} = ${pfTex(pf(a))}\), \(${b} = ${pfTex(pf(b))}\). Shared primes: \(${g === 1 ? '1' : pfTex(pf(g))} = ${g}\).`,
                    };
                },
            },
            {
                id: 'lcm', name: 'Least common multiple', level: 2,
                gen(rng) {
                    if (rng.bool(0.25)) {                                       // three numbers
                        let nums; do nums = rng.sample([2, 3, 4, 5, 6, 8, 9, 10, 12, 15], 3).sort((a, b) => a - b); while (lcmAll(nums) > 180 || lcmAll(nums) === nums[2]);
                        const L = lcmAll(nums);
                        return { q: `Find the LCM of ${listAnd(nums)}.`, ans: CA.num(L), sol: R`Take each prime to its highest power: \(${nums.map(v => `${v} = ${pfTex(pf(v))}`).join(R`,\quad `)}\), so the LCM is \(${pfTex(pf(L))} = ${L}\).` };
                    }
                    const shared = rng.bool(0.7);                              // mostly pairs that share a factor
                    let a, b;
                    do { a = rng.int(4, 30); b = rng.int(4, 30); } while (a === b || a % b === 0 || b % a === 0 || (gcd(a, b) > 1) !== shared);
                    const L = lcm(a, b), g = gcd(a, b);
                    return {
                        q: rng.pick([`Find the LCM of ${a} and ${b}.`, `What is the least common multiple of ${a} and ${b}?`]),
                        ans: CA.num(L),
                        sol: g === 1 ? R`${a} and ${b} share no factor, so LCM \(= ${a} \times ${b} = ${L}\).` : R`GCF is ${g}, so LCM \(= ${a} \times ${b} \div ${g} = ${L}\).`,
                    };
                },
            },
            {
                id: 'prime-factorisation', name: 'Prime factorisation', level: 2,
                gen(rng) {
                    const n = composite(rng, 24, 600), parts = pf(n), good = pfTex(parts);
                    if (rng.bool(0.3)) return {
                        q: R`Which number has the prime factorisation \(${good}\)?`,
                        ans: CA.num(n),
                        sol: R`\(${parts.map(([p, e]) => Array(e).fill(p).join(R` \times `)).join(R` \times `)} = ${n}\).`,
                    };
                    const wrong = [];
                    // a wrong exponent
                    const i = rng.int(0, parts.length - 1);
                    wrong.push(pfTex(parts.map(([p, e], k) => [p, k === i ? e + 1 : e])));
                    // right value, but a composite factor (not a PRIME factorisation)
                    const [[p, e], [q, f]] = parts;
                    const merged = [[p, e - 1], [q, f - 1]].filter(([, x]) => x > 0).concat([[p * q, 1]], parts.slice(2)).sort((u, v) => u[0] - v[0]);
                    wrong.push(pfTex(merged));
                    // exponents swapped, or one dropped
                    const swapped = parts.map(([b], k) => [b, parts[(k + 1) % parts.length][1]]);
                    const s = pfTex(swapped);
                    wrong.push(s !== good ? s : pfTex(parts.map(([b, x], k) => [b, k === i && x > 1 ? x - 1 : x]).concat([[rng.pick([13, 17]), 1]])));
                    return {
                        q: R`Which is the prime factorisation of ${n}?`,
                        ans: CA.mc(rng, m(good), wrong.filter(w => w !== good).map(m)),
                        sol: R`Keep dividing by primes: ${parts.map(([p2, e2]) => `${p2} goes in ${e2} time${e2 > 1 ? 's' : ''}`).join(', ')}. So \(${n} = ${good}\).`,
                    };
                },
            },
            {
                id: 'missing-digit', name: 'Missing digits and divisibility', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {                                           // ■ for 9 (unique)
                        const len = rng.int(3, 4), digits = [rng.int(1, 9), ...Array.from({ length: len - 1 }, () => rng.int(0, 9))];
                        const pos = rng.int(1, len - 1), rest = digits.reduce((s, d, k) => (k === pos ? s : s + d), 0);
                        if (rest % 9 === 0) return this.gen(rng);
                        const x = (9 - rest % 9) % 9, shown = digits.map((d, k) => (k === pos ? R`\square ` : d)).join('');
                        return { q: R`The number \(${shown}\) is divisible by 9. What digit is in the box?`, ans: CA.num(x), sol: R`The other digits add to ${rest}. The next multiple of 9 is ${rest + x}, so the digit is ${x}.` };
                    }
                    if (kind === 1) {                                           // smallest ■ for 3 or 6
                        const D = rng.pick([3, 6]), len = rng.int(3, 4);
                        const digits = [rng.int(1, 9), ...Array.from({ length: len - 1 }, () => rng.int(0, 9))];
                        if (D === 6) digits[len - 1] = rng.pick([0, 2, 4, 6, 8]);
                        const pos = rng.int(1, len - 2), rest = digits.reduce((s, d, k) => (k === pos ? s : s + d), 0);
                        const x = (3 - rest % 3) % 3, shown = digits.map((d, k) => (k === pos ? R`\square ` : d)).join('');
                        return { q: R`What is the smallest digit that can go in the box to make \(${shown}\) divisible by ${D}?`, ans: CA.num(x), sol: R`${D === 6 ? 'It is already even, so it needs a digit sum divisible by 3. ' : ''}The other digits add to ${rest}; adding ${x} gives ${rest + x}, a multiple of 3.` };
                    }
                    if (kind === 2) {                                           // largest ■ for 4 (tens digit)
                        const front = rng.int(1, 99), last = rng.pick([0, 2, 4, 6, 8, 1, 3]);
                        const ok = []; for (let t = 0; t <= 9; t++) if ((10 * t + last) % 4 === 0) ok.push(t);
                        if (!ok.length) return this.gen(rng);
                        const x = Math.max(...ok);
                        return { q: R`What is the largest digit that can go in the box to make \(${front}\square ${last}\) divisible by 4?`, ans: CA.num(x), sol: R`Only the last two digits matter: \(${x}${last} \div 4 = ${(10 * x + last) / 4}\), and no larger tens digit works (${ok.map(t => `${t}${last}`).join(', ')} are the multiples of 4 ending in ${last}).` };
                    }
                    const n = rng.int(100, 999) * rng.pick([1, 2, 3, 6]);
                    const divs = [2, 3, 4, 5, 6, 9, 10].filter(d => n % d === 0);
                    return { q: `How many of the numbers 2, 3, 4, 5, 6, 9 and 10 divide ${n} exactly?`, ans: CA.num(divs.length), sol: `Use the rules (digit sum ${digitSum(n)}, last two digits ${String(n).slice(-2)}, last digit ${n % 10}). ${divs.length === 0 ? 'None of them divide it' : divs.length === 1 ? `Only ${divs[0]} divides it` : `${listAnd(divs)} divide it`}, so the answer is ${divs.length}.` };
                },
            },
            {
                id: 'primes-in-range', name: 'Finding primes', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const a = rng.int(1, 8) * 10, b = a + rng.pick([10, 20]);
                        const ps = PRIMES.filter(p => p > a && p < b);
                        return { q: `How many prime numbers are there between ${a} and ${b}?`, ans: CA.num(ps.length), sol: `They are ${ps.length > 1 ? listAnd(ps) : ps[0]}, so ${ps.length}.` };
                    }
                    if (kind === 1) {
                        const n = rng.int(20, 95), p = PRIMES.concat([101, 103]).find(x => x > n);
                        return { q: `What is the smallest prime number greater than ${n}?`, ans: CA.num(p), sol: `${n + 1 === p ? '' : `Every number from ${n + 1} to ${p - 1} has a factor other than 1 and itself; `}${p} is prime.` };
                    }
                    if (kind === 2) {
                        const n = rng.int(20, 99), p = PRIMES.filter(x => x < n).pop();
                        return { q: `What is the largest prime number less than ${n}?`, ans: CA.num(p), sol: `${p + 1 === n ? '' : `Every number from ${p + 1} to ${n - 1} is composite; `}${p} is prime.` };
                    }
                    const a = rng.int(1, 6) * 10, b = a + 10, ps = PRIMES.filter(p => p > a && p < b);
                    return { q: `What is the sum of all the prime numbers between ${a} and ${b}?`, ans: CA.num(ps.reduce((s, x) => s + x, 0)), sol: R`The primes are ${listAnd(ps)}: \(${ps.join(' + ')} = ${ps.reduce((s, x) => s + x, 0)}\).` };
                },
            },

            // ── Part C ──────────────────────────────────────────────────
            {
                id: 'gcf-lcm-stories', name: 'GCF and LCM in stories', level: 3,
                gen(rng) {
                    const who = rng.pick(NAMES), kind = rng.int(0, 5);
                    if (kind === 0 || kind === 1) {                             // equal pieces, no waste
                        const g = rng.pick([4, 5, 6, 8, 10, 12, 15, 20]), [x, y] = coprimePair(rng, 9), a = g * x, b = g * y;
                        if (kind === 0) return { q: `${who} has two ribbons, ${a} cm and ${b} cm long. ${who} cuts both into pieces that are all the same length, with nothing left over. What is the longest the pieces can be?`, ans: CA.num(g, 'cm'), sol: `The length must divide both ${a} and ${b}; the largest is GCF(${a}, ${b}) = ${g} cm.` };
                        return { q: `Two ribbons, ${a} cm and ${b} cm long, are cut into equal pieces that are as long as possible, with nothing left over. How many pieces are there altogether?`, ans: CA.num(x + y, 'pieces'), sol: R`Piece length = GCF(${a}, ${b}) = ${g} cm. Pieces: \(${a} \div ${g} + ${b} \div ${g} = ${x} + ${y} = ${x + y}\).` };
                    }
                    if (kind === 2) {                                           // identical goody bags
                        const g = rng.int(3, 12), [x, y] = coprimePair(rng, 8), a = g * x, b = g * y;
                        return { q: `${who} has ${a} pencils and ${b} erasers to put into identical party bags, using all of them. What is the greatest number of bags ${who} can make?`, ans: CA.num(g, 'bags'), sol: `The number of bags must divide both ${a} and ${b}: GCF(${a}, ${b}) = ${g} bags (each gets ${x} pencils and ${y} erasers).` };
                    }
                    if (kind === 3) {                                           // buses
                        const [a, b] = rng.sample([6, 8, 9, 10, 12, 15, 18, 20, 24, 25, 30], 2);
                        if (a % b === 0 || b % a === 0 || lcm(a, b) > 150) return this.gen(rng);
                        return { q: `One bus leaves the station every ${a} minutes and another every ${b} minutes. Both leave together at 8:00. How many minutes later do they next leave together?`, ans: CA.num(lcm(a, b), 'minutes'), sol: `They meet again at the first common multiple: LCM(${a}, ${b}) = ${lcm(a, b)} minutes.` };
                    }
                    if (kind === 4) {                                           // hot dogs and buns
                        const [a, b] = rng.sample([6, 8, 10, 12, 15], 2);
                        if (a % b === 0 || b % a === 0) return this.gen(rng);
                        const L = lcm(a, b);
                        return { q: `Sausages come in packs of ${a} and rolls come in packs of ${b}. ${who} wants exactly the same number of each. What is the smallest number of packs of sausages ${who} must buy?`, ans: CA.num(L / a, 'packs'), sol: R`Smallest equal amount: LCM(${a}, ${b}) = ${L}. That is \(${L} \div ${a} = ${L / a}\) packs of sausages.` };
                    }
                    const g = rng.pick([10, 12, 15, 20, 25, 30, 40]), [x, y] = coprimePair(rng, 6), a = g * x, b = g * y;
                    return { q: `A floor measures ${a} cm by ${b} cm. It is covered exactly by square tiles, all the same size and as large as possible. How many tiles are needed?`, ans: CA.num(x * y, 'tiles'), sol: R`Tile side = GCF(${a}, ${b}) = ${g} cm. Tiles: \(${x} \times ${y} = ${x * y}\).` };
                },
            },
            {
                id: 'gcf-times-lcm', name: 'GCF × LCM = product', level: 3,
                gen(rng) {
                    const g = rng.int(2, 12), [x, y] = coprimePair(rng, 9);
                    if (x === 1 && y === 1) return this.gen(rng);
                    const a = g * x, b = g * y, L = g * x * y, kind = rng.int(0, 1);
                    if (kind === 0) return { q: `Two numbers have a GCF of ${g} and an LCM of ${L}. One of the numbers is ${a}. What is the other number?`, ans: CA.num(b), sol: R`GCF × LCM = product of the numbers: \(${g} \times ${L} = ${g * L}\), and \(${g * L} \div ${a} = ${b}\).` };
                    return { q: `The product of two numbers is ${a * b} and their GCF is ${g}. What is their LCM?`, ans: CA.num(L), sol: R`GCF × LCM = product, so LCM \(= ${a * b} \div ${g} = ${L}\).` };
                },
            },
            {
                id: 'count-factors', name: 'Counting factors', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 2) {
                        const k = rng.pick([4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20]);
                        let n = 1; while (factorsOf(n).length !== k) n++;
                        return { q: `What is the smallest whole number that has exactly ${k} factors?`, ans: CA.num(n), sol: R`\(${n} = ${pfTex(pf(n))}\) has \(${pf(n).map(([, e]) => `(${e}+1)`).join(R` \times `)} = ${k}\) factors, and no smaller number has ${k}.` };
                    }
                    const n = composite(rng, 60, 1000, 2), parts = pf(n), cnt = parts.reduce((s, [, e]) => s * (e + 1), 1);
                    const shown = kind === 0 ? `${n}` : R`\(${pfTex(parts)}\)`;
                    return { q: `How many factors does ${shown} have?`, ans: CA.num(cnt), sol: R`${kind === 0 ? R`\(${n} = ${pfTex(parts)}\). ` : ''}Add 1 to each power and multiply: \(${parts.map(([, e]) => `(${e}+1)`).join(R` \times `)} = ${cnt}\).` };
                },
            },
            {
                id: 'remainder-puzzles', name: 'Remainder puzzles', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                           // same remainder r
                        const divs = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10], rng.int(2, 3)).sort((a, b) => a - b), r = rng.int(1, divs[0] - 1 || 1);
                        if (r >= divs[0]) return this.gen(rng);
                        const L = lcmAll(divs);
                        return { q: `What is the smallest whole number greater than ${r} that leaves a remainder of ${r} when divided by ${listAnd(divs)}?`, ans: CA.num(L + r), sol: `It is ${r} more than a common multiple: LCM(${divs.join(', ')}) = ${L}, so ${L} + ${r} = ${L + r}.` };
                    }
                    if (kind === 1) {                                           // remainder one less than each divisor
                        const divs = rng.sample([2, 3, 4, 5, 6, 7], 3).sort((a, b) => a - b), L = lcmAll(divs);
                        return { q: `A number leaves remainder ${divs[0] - 1} when divided by ${divs[0]}, remainder ${divs[1] - 1} when divided by ${divs[1]}, and remainder ${divs[2] - 1} when divided by ${divs[2]}. What is the smallest such positive number?`, ans: CA.num(L - 1), sol: `Adding 1 makes it divisible by all three, so it is one less than LCM(${divs.join(', ')}) = ${L}: the answer is ${L - 1}.` };
                    }
                    const k = rng.int(4, 12), L = lcmAll(Array.from({ length: k }, (_, i) => i + 1));
                    return { q: `What is the smallest whole number that is divisible by every whole number from 1 to ${k}?`, ans: CA.num(L), sol: R`Take the highest prime powers up to ${k}: \(${pfTex(pf(L))} = ${L}\).` };
                },
            },
        ],

        assignment: [
            ['prime-or-not', 4], ['factors', 4], ['multiples', 4], ['divisible-by', 3],
            ['gcf', 5], ['lcm', 5], ['prime-factorisation', 5], ['missing-digit', 4], ['primes-in-range', 4],
            ['gcf-lcm-stories', 4], ['gcf-times-lcm', 3], ['count-factors', 3], ['remainder-puzzles', 2],
        ],
    });
})();
