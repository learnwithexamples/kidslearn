/* Worksheet: Combinations & Permutations.
 * Also drives the Practice tab of math/combinations-permutations.html. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m;
    const fact = CA.fact, P = CA.nPr, C = CA.nCr;

    const NAMES = ['Ava', 'Ben', 'Cara', 'Dan', 'Eli', 'Fay', 'Gus', 'Hana', 'Ivan', 'Jade', 'Kai', 'Lena', 'Milo', 'Nora', 'Omar', 'Priya'];
    const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    const word = n => (n <= 12 ? NUM[n] : String(n));
    /** "6 × 5 × 4" — the first r factors of n! */
    const fall = (n, r) => Array.from({ length: r }, (_, i) => n - i).join(R` \times `);
    /** Letter counts of a word: { B: 1, A: 3, N: 2 } */
    const counts = w => [...w].reduce((o, ch) => ((o[ch] = (o[ch] || 0) + 1), o), {});
    /** Arrangements of a word's letters: n! / (a! b! …) */
    function wordArrangements(w) {
        const reps = Object.entries(counts(w)).filter(([, k]) => k > 1);
        const value = fact(w.length) / reps.reduce((p, [, k]) => p * fact(k), 1);
        const tex = reps.length ? R`\dfrac{${w.length}!}{${reps.map(([, k]) => `${k}!`).join(R`\,`)}}` : `${w.length}!`;
        return { value, reps, tex };
    }
    /** Count by listing: how many r-digit numbers from these digits (no repeats, no leading zero) pass test(n). */
    function countNumbers(digits, r, test) {
        let total = 0;
        const go = (used, s) => {
            if (s.length === r) { if (s[0] !== '0' && test(Number(s))) total++; return; }
            digits.forEach((d, i) => { if (!used[i]) { used[i] = true; go(used, s + d); used[i] = false; } });
        };
        go([], '');
        return total;
    }

    const DISTINCT = ['MATH', 'CODE', 'STAR', 'PLANET', 'FRIEND', 'NUMBER', 'BRICK', 'CHAIR', 'GHOST', 'TIGER', 'JUMP', 'WORLD', 'TRIANGLE', 'DOLPHIN'];
    const REPEATED = ['BANANA', 'APPLE', 'LETTER', 'COFFEE', 'PEPPER', 'BALLOON', 'TOOTH', 'LEVEL', 'PUZZLE', 'GOOGLE', 'STATS', 'BUBBLE', 'ACADEMY', 'MISSISSIPPI', 'COOKBOOK', 'TATTOO'];

    CA.register({
        id: 'combinations-permutations',
        title: 'Combinations & Permutations',
        page: 'combinations-permutations.html',
        assignmentNote: 'Write each answer as a whole number. For each word problem, first decide: does the order matter?',

        practice: [
            {
                id: 'counting-principle', name: 'The counting principle', level: 1, group: 'basics',
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const a = rng.int(2, 7), b = rng.int(2, 6), c = rng.int(2, 5);
                        return { q: `A café offers ${a} sandwiches, ${b} drinks and ${c} desserts. A meal is one of each. How many different meals are there?`, ans: CA.num(a * b * c), sol: R`One choice from each list: \(${a}\times${b}\times${c}=${a * b * c}\).` };
                    }
                    if (kind === 1) {
                        const s = rng.int(3, 8), t = rng.int(2, 6);
                        return { q: `${rng.pick(NAMES)} has ${s} T-shirts and ${t} pairs of shorts. How many different outfits of one T-shirt and one pair of shorts can be made?`, ans: CA.num(s * t), sol: R`\(${s}\times${t}=${s * t}\) outfits.` };
                    }
                    if (kind === 2) {
                        const n = rng.int(2, 5);
                        return { q: `A coin is tossed ${word(n)} times. How many different sequences of heads and tails are possible?`, ans: CA.num(2 ** n), sol: R`Each toss has 2 outcomes: \(${Array(n).fill(2).join(R`\times`)}=${2 ** n}\).` };
                    }
                    const d = rng.int(2, 4), k = rng.pick([4, 5, 10]);
                    return { q: `A lock has ${word(d)} dials, each showing the digits ${k === 10 ? '0 to 9' : `1 to ${k}`}. How many different codes are possible?`, ans: CA.num(k ** d), sol: R`Digits may repeat, so each dial has ${k} choices: \(${k}^{${d}}=${k ** d}\).` };
                },
            },
            {
                id: 'factorial', name: 'Factorials', level: 1, group: 'factorial',
                gen(rng) {
                    if (rng.bool(0.45)) {
                        const n = rng.int(0, 8);
                        return { q: R`Evaluate \(${n}!\).`, ans: CA.num(fact(n)), sol: n === 0 ? R`By definition \(0! = 1\).` : n === 1 ? R`\(1! = 1\).` : R`\(${n}! = ${fall(n, n)} = ${fact(n)}\).` };
                    }
                    const n = rng.int(5, 12), k = rng.int(2, Math.min(4, n - 1)), r = n - k;
                    return { q: R`Evaluate \(\dfrac{${n}!}{${r}!}\) without a calculator.`, ans: CA.num(fact(n) / fact(r)), sol: R`Everything from \(${r}\) down cancels: \(${fall(n, k)} = ${fact(n) / fact(r)}\).` };
                },
            },
            {
                id: 'npr-eval', name: 'Evaluate nPr', level: 1, group: 'perm',
                gen(rng) {
                    const n = rng.int(4, 12), r = rng.int(1, Math.min(4, n));
                    return { q: R`Evaluate \({}_{${n}}P_{${r}}\).`, ans: CA.num(P(n, r)), sol: R`\({}_{${n}}P_{${r}} = \dfrac{${n}!}{${n - r}!} = ${fall(n, r)} = ${P(n, r)}\).` };
                },
            },
            {
                id: 'ncr-eval', name: 'Evaluate nCr', level: 1, group: 'comb',
                gen(rng) {
                    const n = rng.int(4, 12), r = rng.int(1, Math.min(4, n - 1));
                    return { q: R`Evaluate \({}_{${n}}C_{${r}}\).`, ans: CA.num(C(n, r)), sol: R`\({}_{${n}}C_{${r}} = \dfrac{${n}!}{${r}!\,${n - r}!} = \dfrac{${fall(n, r)}}{${fall(r, r) || 1}} = ${C(n, r)}\).` };
                },
            },
            {
                id: 'order-matters', name: 'Does order matter?', level: 1, group: 'basics',
                gen(rng) {
                    const n = rng.int(6, 15), r = rng.int(2, 4);
                    const [story, perm] = rng.pick([
                        [`choose ${word(r)} of ${n} students to be captain, vice-captain${r > 2 ? ' and so on' : ''}`, true],
                        [`choose ${word(r)} of ${n} students to go on a trip`, false],
                        [`award gold, silver${r > 2 ? ' and bronze' : ''} medals to ${word(Math.min(r, 3))} of ${n} runners`, true],
                        [`pick ${word(r)} toppings from ${n} for a pizza`, false],
                        [`arrange ${word(r)} of ${n} books in a row on a shelf`, true],
                        [`choose a team of ${word(r)} from ${n} players`, false],
                        [`make a ${r}-letter code from ${n} different letters with no letter used twice`, true],
                        [`pick ${word(r)} cards from ${n} different cards to hold in your hand`, false],
                    ]);
                    const correct = perm ? 'Permutation — order matters' : 'Combination — order does not matter';
                    return {
                        q: `You want to ${story}. Is this a permutation or a combination?`,
                        ans: CA.mc(rng, correct, ['Permutation — order matters', 'Combination — order does not matter'], { keepOrder: true }),
                        sol: perm ? 'Swapping two of the chosen gives a different result (different roles, places or order), so order matters: a permutation.'
                            : 'Swapping two of the chosen gives the same group, so order does not matter: a combination.',
                    };
                },
            },
            {
                id: 'arrange-all', name: 'Arranging everything', level: 2, group: 'perm',
                gen(rng) {
                    const n = rng.int(3, 8);
                    const what = rng.pick([`${word(n)} friends stand in a line for a photo`, `${word(n)} different books are put in a row on a shelf`, `${word(n)} runners finish a race (no ties)`, `${word(n)} children sit on a row of ${word(n)} chairs`]);
                    return { q: `In how many different orders can ${what}?`, ans: CA.num(fact(n)), sol: R`${n} choices for the first place, ${n - 1} for the next, and so on: \(${n}! = ${fall(n, n)} = ${fact(n)}\).` };
                },
            },
            {
                id: 'podium', name: 'Places and positions', level: 2, group: 'perm',
                gen(rng) {
                    const n = rng.int(5, 15), r = rng.int(2, 3);
                    const q = rng.pick([
                        `${n} swimmers are in a final. In how many ways can the ${r === 3 ? 'gold, silver and bronze' : 'gold and silver'} medals be awarded?`,
                        `A club of ${n} members elects a president${r === 3 ? ', a secretary and a treasurer' : ' and a secretary'}. No one can hold two posts. In how many ways can this be done?`,
                        `In how many ways can ${word(r)} of ${n} different pictures be hung in a row on a wall?`,
                    ]);
                    return { q, ans: CA.num(P(n, r)), sol: R`Order matters: \({}_{${n}}P_{${r}} = ${fall(n, r)} = ${P(n, r)}\).` };
                },
            },
            {
                id: 'committee', name: 'Choosing a group', level: 2, group: 'comb',
                gen(rng) {
                    const n = rng.int(5, 15), r = rng.int(2, Math.min(5, n - 2));
                    const q = rng.pick([
                        `A team of ${word(r)} is chosen from ${n} students. How many different teams are possible?`,
                        `${rng.pick(NAMES)} picks ${word(r)} books to borrow from a shelf of ${n}. How many different sets of books could be borrowed?`,
                        `A pizza can have any ${word(r)} different toppings from a list of ${n}. How many different pizzas are possible?`,
                        `In how many ways can ${word(r)} of ${n} classmates be invited to a party?`,
                    ]);
                    return { q, ans: CA.num(C(n, r)), sol: R`Order does not matter: \({}_{${n}}C_{${r}} = \dfrac{${fall(n, r)}}{${r}!} = \dfrac{${P(n, r)}}{${fact(r)}} = ${C(n, r)}\).` };
                },
            },
            {
                id: 'handshakes', name: 'Handshakes, games and lines', level: 2, group: 'comb',
                gen(rng) {
                    const n = rng.int(4, 20), kind = rng.int(0, 3);
                    if (kind === 0) return { q: `${n} people meet and every person shakes hands with every other person once. How many handshakes are there?`, ans: CA.num(C(n, 2)), sol: R`Each handshake is a pair of people: \({}_{${n}}C_{2} = \dfrac{${n}\times${n - 1}}{2} = ${C(n, 2)}\).` };
                    if (kind === 1) return { q: `In a league of ${n} teams, every team plays every other team once. How many games are played?`, ans: CA.num(C(n, 2)), sol: R`Each game is a pair of teams: \({}_{${n}}C_{2} = ${C(n, 2)}\).` };
                    if (kind === 2) return { q: `In a league of ${n} teams, every team plays every other team twice, once at home and once away. How many games are played?`, ans: CA.num(P(n, 2)), sol: R`Home and away are different games, so order matters: \({}_{${n}}P_{2} = ${n}\times${n - 1} = ${P(n, 2)}\).` };
                    const k = Math.max(5, Math.min(n, 12));
                    return { q: `${k} points lie on a circle. How many straight lines can be drawn through two of the points?`, ans: CA.num(C(k, 2)), sol: R`Each line joins a pair of points: \({}_{${k}}C_{2} = ${C(k, 2)}\).` };
                },
            },
            {
                id: 'codes', name: 'Codes with and without repeats', level: 2, group: 'perm',
                gen(rng) {
                    const len = rng.int(3, 4), letters = rng.bool();
                    const k = letters ? rng.pick([5, 6, 8, 26]) : 10;
                    const pool = letters ? (k === 26 ? 'the 26 letters of the alphabet' : `the letters ${'ABCDEFGH'.slice(0, k).split('').join(', ')}`) : 'the digits 0 to 9';
                    if (rng.bool()) return { q: `A ${len}-character code uses ${pool}. Characters may be repeated. How many codes are possible?`, ans: CA.num(k ** len), sol: R`Each place has ${k} choices: \(${k}^{${len}} = ${k ** len}\).` };
                    return { q: `A ${len}-character code uses ${pool}, and no character may be used twice. How many codes are possible?`, ans: CA.num(P(k, len)), sol: R`Order matters, no repeats: \({}_{${k}}P_{${len}} = ${fall(k, len)} = ${P(k, len)}\).` };
                },
            },
            {
                id: 'words-distinct', name: 'Arranging letters', level: 2, group: 'perm',
                gen(rng) {
                    const w = rng.pick(DISTINCT);
                    if (rng.bool(0.6) || w.length < 5) return { q: `How many different arrangements of all the letters of the word ${w} are there?`, ans: CA.num(fact(w.length)), sol: R`${w.length} different letters: \(${w.length}! = ${fact(w.length)}\).` };
                    const r = 3;
                    return { q: `How many 3-letter "words" (any order of letters, real words or not) can be made from the letters of ${w}, using each letter at most once?`, ans: CA.num(P(w.length, r)), sol: R`\({}_{${w.length}}P_{3} = ${fall(w.length, 3)} = ${P(w.length, 3)}\).` };
                },
            },
            {
                id: 'symmetry', name: 'Patterns in nCr', level: 2, group: 'comb',
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const n = rng.int(8, 30), r = rng.int(n - 3, n - 1);
                        return { q: R`Evaluate \({}_{${n}}C_{${r}}\). (Hint: choosing ${r} to take is the same as choosing ${n - r} to leave.)`, ans: CA.num(C(n, r)), sol: R`\({}_{${n}}C_{${r}} = {}_{${n}}C_{${n - r}} = ${C(n, n - r)}\).` };
                    }
                    if (kind === 1) {
                        const n = rng.int(7, 20), r = rng.int(2, Math.floor(n / 2) - 1);
                        return { q: R`\({}_{${n}}C_{${r}} = {}_{${n}}C_{k}\) and \(k \ne ${r}\). What is \(k\)?`, ans: CA.num(n - r), sol: R`\({}_{n}C_{r} = {}_{n}C_{n-r}\), so \(k = ${n} - ${r} = ${n - r}\).` };
                    }
                    const n = rng.int(4, 9);
                    return { q: `A shop has ${n} different flavours. You may take any number of them, from none to all ${n}. How many different selections are possible?`, ans: CA.num(2 ** n), sol: R`Each flavour is either in or out: \(2^{${n}} = ${2 ** n}\). (This is also \({}_{${n}}C_0 + {}_{${n}}C_1 + \cdots + {}_{${n}}C_{${n}}\).)` };
                },
            },
            {
                id: 'repeated-letters', name: 'Letters that repeat', level: 3, group: 'perm',
                gen(rng) {
                    const w = rng.pick(REPEATED), a = wordArrangements(w);
                    return {
                        q: `How many different arrangements of all the letters of the word ${w} are there?`,
                        ans: CA.num(a.value),
                        sol: R`${w.length} letters, with ${a.reps.map(([ch, k]) => `${k} ${ch}s`).join(' and ')}. Swapping identical letters changes nothing, so divide: \(${a.tex} = ${a.value}\).`,
                    };
                },
            },
            {
                id: 'two-groups', name: 'Boys and girls', level: 3, group: 'comb',
                gen(rng) {
                    const b = rng.int(4, 9), g = rng.int(4, 9);
                    if (rng.bool()) {
                        const x = rng.int(1, 3), y = rng.int(1, 3);
                        return { q: `A class has ${b} boys and ${g} girls. A committee of ${word(x)} boy${x > 1 ? 's' : ''} and ${word(y)} girl${y > 1 ? 's' : ''} is chosen. How many different committees are possible?`, ans: CA.num(C(b, x) * C(g, y)), sol: R`Choose the boys and the girls separately, then multiply: \({}_{${b}}C_{${x}}\times{}_{${g}}C_{${y}} = ${C(b, x)}\times${C(g, y)} = ${C(b, x) * C(g, y)}\).` };
                    }
                    const r = rng.int(3, 4);
                    const all = C(b + g, r), none = C(b, r);
                    return { q: `A class has ${b} boys and ${g} girls. A team of ${word(r)} is chosen. How many teams include <strong>at least one girl</strong>?`, ans: CA.num(all - none), sol: R`All teams minus the all-boy teams: \({}_{${b + g}}C_{${r}} - {}_{${b}}C_{${r}} = ${all} - ${none} = ${all - none}\).` };
                },
            },
            {
                id: 'together-apart', name: 'Together or apart', level: 3, group: 'perm',
                gen(rng) {
                    const n = rng.int(4, 7), [A, B] = rng.sample(NAMES, 2), kind = rng.int(0, 2);
                    if (kind === 0) return { q: `${word(n)[0].toUpperCase() + word(n).slice(1)} friends, including ${A} and ${B}, stand in a row. In how many ways can they stand if ${A} and ${B} must be <strong>next to each other</strong>?`, ans: CA.num(2 * fact(n - 1)), sol: R`Bind ${A} and ${B} into one block: arrange ${n - 1} things in \(${n - 1}!\) ways, and the pair inside the block in \(2!\) ways: \(${fact(n - 1)}\times2 = ${2 * fact(n - 1)}\).` };
                    if (kind === 1) return { q: `${word(n)[0].toUpperCase() + word(n).slice(1)} friends, including ${A} and ${B}, stand in a row. In how many ways can they stand if ${A} and ${B} must <strong>not</strong> stand next to each other?`, ans: CA.num(fact(n) - 2 * fact(n - 1)), sol: R`All orders minus those with them together: \(${n}! - 2\times${n - 1}! = ${fact(n)} - ${2 * fact(n - 1)} = ${fact(n) - 2 * fact(n - 1)}\).` };
                    return { q: `${word(n)[0].toUpperCase() + word(n).slice(1)} friends, including ${A}, stand in a row. In how many ways can they stand if ${A} must be at one of the two ends?`, ans: CA.num(2 * fact(n - 1)), sol: R`${A} has 2 places; the other ${n - 1} fill the rest in \(${n - 1}!\) ways: \(2\times${fact(n - 1)} = ${2 * fact(n - 1)}\).` };
                },
            },
            {
                id: 'digits', name: 'Making numbers', level: 3, group: 'perm',
                gen(rng) {
                    const withZero = rng.bool(0.5), k = rng.int(4, 6);
                    const digits = (withZero ? ['0'] : []).concat(rng.sample(['1', '2', '3', '4', '5', '6', '7', '8', '9'], withZero ? k - 1 : k)).sort();
                    const r = 3, kind = rng.int(0, 2);
                    const list = digits.join(', ');
                    if (kind === 0) {
                        const n = countNumbers(digits, r, () => true);
                        return { q: `How many 3-digit numbers can be made from the digits ${list}, using each digit at most once?`, ans: CA.num(n), sol: withZero ? R`The first digit cannot be 0: \(${k - 1}\) choices, then \(${k - 1}\) and \(${k - 2}\) for the others: \(${k - 1}\times${k - 1}\times${k - 2} = ${n}\).` : R`\({}_{${k}}P_{3} = ${fall(k, 3)} = ${n}\).` };
                    }
                    const n = countNumbers(digits, r, v => v % 2 === 0);
                    if (n === 0) return this.gen(rng);
                    const evens = digits.filter(d => +d % 2 === 0);
                    return { q: `How many <strong>even</strong> 3-digit numbers can be made from the digits ${list}, using each digit at most once?`, ans: CA.num(n), sol: withZero ? R`Fill the last digit first (it must be even, from ${evens.join(', ')}), then the first digit (not 0), then the middle. Ending in 0: \(${k - 1}\times${k - 2}\); ending in another even digit: \(${evens.length - 1}\times${k - 2}\times${k - 2}\). Total ${n}.` : R`Last digit even: ${evens.length} choices; then \(${k - 1}\times${k - 2}\) for the first two: \(${evens.length}\times${k - 1}\times${k - 2} = ${n}\).` };
                },
            },
        ],

        assignment: [
            ['counting-principle', 4], ['factorial', 4], ['npr-eval', 3], ['ncr-eval', 3], ['order-matters', 2],
            ['arrange-all', 3], ['podium', 4], ['committee', 4], ['handshakes', 3], ['codes', 3], ['words-distinct', 3], ['symmetry', 3],
            ['repeated-letters', 3], ['two-groups', 3], ['together-apart', 3], ['digits', 2],
        ],
    });
})();
