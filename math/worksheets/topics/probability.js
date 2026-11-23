/* Worksheet: Probability — single events, complements, AND / OR, dice, cards, expected results. */
(function () {
    'use strict';
    const R = String.raw, T = CA.tex, F = CA.fig;
    const { INK } = F.colors;

    const fr = (n, d) => T.frac(n, d);
    /** "\dfrac{4}{12} = \dfrac{1}{3}" — the raw count and, if it reduces, the lowest terms. */
    const frWork = (n, d) => (CA.reduce(n, d)[1] === d ? R`\dfrac{${n}}{${d}}` : R`\dfrac{${n}}{${d}} = ${fr(n, d)}`);
    const count = (arr, pred) => arr.filter(pred).length;
    const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
    const isPrime = n => n > 1 && range(2, Math.floor(Math.sqrt(n))).every(k => n % k);
    const listJoin = a => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
    const plural = (k, w) => `${k} ${w}${k === 1 ? '' : 's'}`;
    const numWord = n => ['zero', 'one', 'two', 'three', 'four', 'five', 'six'][n] || String(n);

    // ── Events on the numbers 1..n ───────────────────────────────────────
    /** Events for a die / number cards / spinner numbered 1..n: [text, predicate]. */
    function numberEvents(n) {
        const ev = [['an even number', x => x % 2 === 0], ['an odd number', x => x % 2 === 1], ['a prime number', isPrime],
            ['a multiple of 3', x => x % 3 === 0], ['a square number', x => CA.isSquare(x)]];
        if (n >= 8) ev.push(['a multiple of 4', x => x % 4 === 0], ['a multiple of 5', x => x % 5 === 0]);
        if (n >= 10) ev.push([`a factor of ${n}`, x => n % x === 0]);
        for (let k = 2; k <= n - 1; k++) ev.push([`a number greater than ${k}`, x => x > k], [`a number less than ${k}`, x => x < k]);
        return ev;
    }

    // ── Figures ──────────────────────────────────────────────────────────
    const SHADES = { Red: '#f6b0b0', Blue: '#b3c5f7', Green: '#b5e3bf', Yellow: '#fbe6a0', Purple: '#d8c0ee', Orange: '#fbcda4' };
    /** A spinner with equal sections, labelled clockwise from the top. */
    function spinner(labels, opt = {}) {
        const n = labels.length, r = opt.r || 66, cx = r + 6, cy = r + 6;
        let g = '';
        labels.forEach((lab, i) => {
            const a1 = 90 - (360 * i) / n, a0 = a1 - 360 / n;
            g += F.sector(cx, cy, r, a0, a1, { fill: SHADES[lab] || (i % 2 ? '#eef1fb' : '#dde4fa'), stroke: INK, width: 1.2 });
            const [tx, ty] = F.polar(cx, cy, r * (n > 8 ? 0.7 : 0.63), (a0 + a1) / 2);
            g += F.text(tx, ty + 4, lab, { size: n > 8 || String(lab).length > 4 ? 9.5 : 11, bold: true });
        });
        const [px, py] = F.polar(cx, cy, r * 0.42, 60);
        g += F.line(cx, cy, px, py, { width: 2.2 }) + F.circle(cx, cy, 4, { fill: INK });
        const [hx, hy] = F.polar(cx, cy, r * 0.5, 60), [lx, ly] = F.polar(px, py, 6, 150), [rx, ry] = F.polar(px, py, 6, -30);
        g += F.poly([[hx, hy], [lx, ly], [rx, ry]], { fill: INK, stroke: 'none' });
        return F.svg(2 * cx, 2 * cy, g, { label: 'spinner' });
    }
    /** The 6 × 6 table of sums for two dice. */
    function diceSums() {
        const s = 22, pad = 4, W = 7 * s + 2 * pad;
        let g = '';
        for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
            const x = pad + c * s, y = pad + r * s, head = r === 0 || c === 0;
            g += F.rect(x, y, s, s, { fill: head ? '#dde4fa' : 'white', width: 0.8 });
            const t = r === 0 && c === 0 ? '+' : r === 0 ? String(c) : c === 0 ? String(r) : String(r + c);
            g += F.text(x + s / 2, y + s / 2 + 4, t, { size: 11, bold: head });
        }
        return F.svg(W, W, g, { label: 'table of sums for two dice' });
    }

    // ── A deck of cards ──────────────────────────────────────────────────
    const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const DECK = [];
    for (const suit of ['hearts', 'diamonds', 'clubs', 'spades']) for (const rank of RANKS) DECK.push({ suit, rank, red: suit === 'hearts' || suit === 'diamonds' });
    const face = c => ['J', 'Q', 'K'].includes(c.rank), numCard = c => !face(c) && c.rank !== 'A';
    /** [what is drawn, test, the matching cards as a plural phrase]. */
    const CARD_EVENTS = [
        ['a heart', c => c.suit === 'hearts', 'hearts'], ['a red card', c => c.red, 'red'], ['a black card', c => !c.red, 'black'], ['a king', c => c.rank === 'K', 'kings'],
        ['a picture card (jack, queen or king)', face, 'picture cards'], ['a red king', c => c.red && c.rank === 'K', 'red kings'], ['an ace or a king', c => c.rank === 'A' || c.rank === 'K', 'aces or kings'],
        ['a numbered card (2 to 10)', numCard, 'numbered cards'], ['the queen of spades', c => c.rank === 'Q' && c.suit === 'spades', 'the queen of spades'], ['a club or a diamond', c => c.suit === 'clubs' || c.suit === 'diamonds', 'clubs or diamonds'],
        ['an even-numbered card (2, 4, 6, 8 or 10)', c => ['2', '4', '6', '8', '10'].includes(c.rank), 'even-numbered cards'], ['a red picture card', c => c.red && face(c), 'red picture cards'],
        ['not a heart', c => c.suit !== 'hearts', 'not hearts'], ['a black ace', c => !c.red && c.rank === 'A', 'black aces'], ['a 7 or an 8', c => c.rank === '7' || c.rank === '8', '7s or 8s'],
        ['a heart or a king', c => c.suit === 'hearts' || c.rank === 'K', 'hearts or kings (13 hearts plus the 3 other kings — don\'t count the king of hearts twice)'], ['a spade picture card', c => c.suit === 'spades' && face(c), 'spade picture cards'],
    ];

    const COLOURS = ['red', 'blue', 'green', 'yellow', 'purple', 'white', 'black', 'orange'];
    const CONTAINERS = [['bag', 'marbles', 'marble'], ['jar', 'sweets', 'sweet'], ['box', 'crayons', 'crayon'], ['drawer', 'socks', 'sock'], ['tin', 'buttons', 'button'], ['bag', 'counters', 'counter']];
    /** Random bag: {where, things, thing, cols: [[colour, count], …], total, text}. */
    function makeBag(rng, k, lo = 1, hi = 9) {
        const [where, things, thing] = rng.pick(CONTAINERS);
        const cols = rng.sample(COLOURS, k).map(c => [c, rng.int(lo, hi)]);
        const total = cols.reduce((s, c) => s + c[1], 0);
        return { where, things, thing, cols, total, text: listJoin(cols.map(c => `${c[1]} ${c[0]}`)) };
    }

    CA.register({
        id: 'probability',
        title: 'Probability',
        page: 'probability.html',
        assignmentNote: R`\(P(\text{event}) = \dfrac{\text{favourable outcomes}}{\text{total outcomes}}\). Dice, coins and spinners are fair, and every choice is made at random. Give probabilities as fractions in lowest terms.`,

        practice: [
            {
                id: 'bag', name: 'Picking from a bag', level: 1,
                gen(rng) {
                    const B = makeBag(rng, rng.int(2, 4)), [col, k] = rng.pick(B.cols);
                    return {
                        q: `A ${B.where} holds ${B.text} ${B.things}. One ${B.thing} is taken out without looking. What is the probability that it is ${col}?`,
                        ans: CA.frac(k, B.total),
                        sol: R`There are ${k} ${col} out of \(${B.cols.map(c => c[1]).join(' + ')} = ${B.total}\) ${B.things}: \(P(\text{${col}}) = ${frWork(k, B.total)}\).`,
                    };
                },
            },
            {
                id: 'numbers', name: 'Dice and number cards', level: 1,
                gen(rng) {
                    const cards = rng.bool(0.35), n = cards ? rng.int(10, 30) : rng.pick([6, 6, 6, 8, 10, 12, 20]);
                    const [text, pred] = rng.pick(numberEvents(n)), all = range(1, n), fav = all.filter(pred);
                    if (fav.length === 0 || fav.length === n || (text.includes('than') && rng.bool(0.5))) return this.gen(rng);
                    const setup = cards ? `Cards numbered 1 to ${n} are shuffled and one is picked.` : n === 6 ? 'A fair six-sided die is rolled.' : `A fair ${n}-sided die, numbered 1 to ${n}, is rolled.`;
                    return {
                        q: `${setup} What is the probability of getting ${text}?`,
                        ans: CA.frac(fav.length, n),
                        sol: R`${fav.length <= 12 ? `The favourable outcomes are ${listJoin(fav.map(String))}: ` : ''}${fav.length} out of ${n}, so \(P = ${frWork(fav.length, n)}\).`,
                    };
                },
            },
            {
                id: 'complement', name: 'The probability of NOT', level: 1,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const d = rng.int(3, 15), n = rng.int(1, d - 1);
                        if (CA.gcd(n, d) !== 1) return this.gen(rng);
                        const [ev, not] = rng.pick([['the bus is late', 'the bus is not late'], ['our team wins', 'our team does not win'], ['it snows tomorrow', 'it does not snow tomorrow'], ['a seed sprouts', 'the seed does not sprout'], ['the phone battery lasts all day', 'it does not last all day']]);
                        return { q: R`The probability that ${ev} is \(${fr(n, d)}\). What is the probability that ${not}?`, ans: CA.frac(d - n, d), sol: R`\(P(\text{not } A) = 1 - P(A) = 1 - ${fr(n, d)} = ${fr(d - n, d)}\).` };
                    }
                    if (kind === 1) {
                        const p = rng.int(1, 19) * 5;
                        const dec = rng.bool();
                        return { q: dec ? R`The probability of rain tomorrow is \(${(p / 100).toFixed(2).replace(/0$/, '')}\). What is the probability that it does not rain? Give a fraction.` : `There is a ${p}% chance that a light bulb is faulty. What is the probability that it is not faulty? Give a fraction.`, ans: CA.frac(100 - p, 100), sol: R`\(1 - ${dec ? (p / 100).toFixed(2).replace(/0$/, '') : R`${p}\%`} = ${dec ? ((100 - p) / 100).toFixed(2).replace(/0$/, '') : R`${100 - p}\%`} = ${frWork(100 - p, 100)}\).` };
                    }
                    if (kind === 2) {
                        const B = makeBag(rng, rng.int(2, 4)), [col, k] = rng.pick(B.cols);
                        return { q: `A ${B.where} holds ${B.text} ${B.things}. One is picked at random. What is the probability that it is not ${col}?`, ans: CA.frac(B.total - k, B.total), sol: R`\(${B.total - k}\) of the \(${B.total}\) ${B.things} are not ${col}: \(P = ${frWork(B.total - k, B.total)}\). (Or \(1 - ${fr(k, B.total)}\).)` };
                    }
                    const n = rng.pick([6, 8, 10, 12]), k = rng.int(1, n);
                    return { q: `A fair ${n === 6 ? 'six' : n}-sided die numbered 1 to ${n} is rolled. What is the probability of not rolling a ${k}?`, ans: CA.frac(n - 1, n), sol: R`\(P(\text{${k}}) = \tfrac1{${n}}\), so \(P(\text{not ${k}}) = 1 - \tfrac1{${n}} = ${fr(n - 1, n)}\).` };
                },
            },
            {
                id: 'spinner', name: 'Spinners', level: 1,
                gen(rng) {
                    const n = rng.pick([4, 5, 6, 8, 10]);
                    if (n <= 6 && rng.bool(0.75)) {          // words fit in up to 6 sections
                        const cols = rng.sample(['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'], rng.int(2, 3));
                        const labels = range(1, n).map(() => rng.pick(cols));
                        const target = rng.pick(labels), k = count(labels, l => l === target);
                        return { q: `This spinner has ${n} equal sections. What is the probability that it lands on ${target.toLowerCase()}?`, fig: spinner(labels), ans: CA.frac(k, n), sol: R`${plural(k, 'section')} out of ${n} ${k === 1 ? 'is' : 'are'} ${target.toLowerCase()}: \(P = ${frWork(k, n)}\).` };
                    }
                    const labels = rng.shuffle(range(1, n)), [text, pred] = rng.pick(numberEvents(n)), k = count(labels, pred);
                    if (k === 0 || k === n) return this.gen(rng);
                    return { q: `This spinner has ${n} equal sections. What is the probability that it lands on ${text}?`, fig: spinner(labels.map(String)), ans: CA.frac(k, n), sol: R`${k === 1 ? 'Only section' : 'The sections'} ${listJoin(labels.filter(pred).sort((a, b) => a - b).map(String))} ${k === 1 ? 'works' : 'work'}: ${k} out of ${n}, so \(P = ${frWork(k, n)}\).` };
                },
            },
            {
                id: 'cards', name: 'A deck of cards', level: 2,
                gen(rng) {
                    const [text, pred, many] = rng.pick(CARD_EVENTS), k = count(DECK, pred);
                    return {
                        q: `One card is drawn from a well-shuffled standard deck of 52 playing cards. What is the probability that it is ${text}?`,
                        ans: CA.frac(k, 52),
                        sol: R`${k === 1 ? 'Only 1 of the 52 cards is' : `${k} of the 52 cards are`} ${many}: \(P = ${frWork(k, 52)}\).`,
                    };
                },
            },
            {
                id: 'and', name: 'Independent events (AND)', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const [text, pred] = rng.pick(numberEvents(6)), k = count(range(1, 6), pred), side = rng.pick(['heads', 'tails']);
                        if (k === 0 || k === 6) return this.gen(rng);
                        return { q: `A coin is flipped and a die is rolled. What is the probability of ${side} and ${text}?`, ans: CA.frac(k, 12), sol: R`\(P(\text{${side}}) \times P(\text{${text.replace(/^an? /, '')}}) = \tfrac12 \times ${fr(k, 6)} = ${fr(k, 12)}\).` };
                    }
                    if (kind === 1) {
                        const n = rng.int(2, 5), heads = rng.bool(), all = rng.bool(0.6);
                        if (all) return { q: `${n === 2 ? 'Two' : n === 3 ? 'Three' : n === 4 ? 'Four' : 'Five'} coins are flipped. What is the probability that they all land ${heads ? 'heads' : 'tails'}?`, ans: CA.frac(1, 2 ** n), sol: R`Multiply: \(${Array(n).fill(R`\tfrac12`).join(R` \times `)} = ${fr(1, 2 ** n)}\).` };
                        const first = rng.pick(['heads', 'tails']), second = rng.pick(['heads', 'tails']);
                        return { q: `A coin is flipped twice. What is the probability of ${first} on the first flip and ${second} on the second?`, ans: CA.frac(1, 4), sol: R`\(\tfrac12 \times \tfrac12 = \tfrac14\). Each of HH, HT, TH, TT is equally likely.` };
                    }
                    if (kind === 2) {
                        const evs = numberEvents(6).filter(([t]) => !t.includes('less'));
                        const [t1, p1] = rng.pick(evs), [t2, p2] = rng.pick(evs), k1 = count(range(1, 6), p1), k2 = count(range(1, 6), p2);
                        if (!k1 || !k2 || k1 === 6 || k2 === 6) return this.gen(rng);
                        return { q: `A die is rolled twice. What is the probability that the first roll is ${t1} and the second roll is ${t2}?`, ans: CA.frac(k1 * k2, 36), sol: R`\(${fr(k1, 6)} \times ${fr(k2, 6)} = ${frWork(k1 * k2, 36)}\).` };
                    }
                    const n = rng.pick([3, 4, 5, 6]), cols = rng.sample(['Red', 'Blue', 'Green', 'Yellow'], 2);
                    const labels = range(1, n).map(() => rng.pick(cols));
                    const target = rng.pick(labels), k = count(labels, l => l === target), side = rng.pick(['heads', 'tails']);
                    return { q: `This spinner is spun and a coin is flipped. What is the probability of ${target.toLowerCase()} and ${side}?`, fig: spinner(labels), ans: CA.frac(k, 2 * n), sol: R`\(P(\text{${target.toLowerCase()}}) \times P(\text{${side}}) = ${fr(k, n)} \times \tfrac12 = ${fr(k, 2 * n)}\).` };
                },
            },
            {
                id: 'or', name: 'Either / or (OR)', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const B = makeBag(rng, rng.int(3, 4)), [[c1, k1], [c2, k2]] = rng.sample(B.cols, 2);
                        return { q: `A ${B.where} holds ${B.text} ${B.things}. One is picked at random. What is the probability that it is ${c1} or ${c2}?`, ans: CA.frac(k1 + k2, B.total), sol: R`A ${B.thing} cannot be both colours, so add: \(${fr(k1, B.total)} + ${fr(k2, B.total)}\) — that is \(${frWork(k1 + k2, B.total)}\).` };
                    }
                    if (kind === 1) {
                        const n = rng.pick([6, 6, 8, 10, 12]), picks = rng.sample(range(1, n), rng.int(2, 3)).sort((a, b) => a - b);
                        return { q: `A fair ${n === 6 ? 'six' : n}-sided die${n === 6 ? '' : ` numbered 1 to ${n}`} is rolled. What is the probability of rolling ${listJoin(picks.map(String)).replace(/ and /, ' or ')}?`, ans: CA.frac(picks.length, n), sol: R`These outcomes cannot happen together, so add: \(${picks.map(() => R`\tfrac1{${n}}`).join(' + ')} = ${frWork(picks.length, n)}\).` };
                    }
                    const pairs = [['a king', 'a queen', 4, 4], ['an ace', 'a picture card', 4, 12], ['a heart', 'a black 7', 13, 2], ['a 2', 'a 3', 4, 4], ['a red ace', 'a black king', 2, 2], ['a club', 'a red picture card', 13, 6], ['a jack', 'a 10', 4, 4], ['a diamond', 'the ace of spades', 13, 1]];
                    const [a, b, ka, kb] = rng.pick(pairs);
                    return { q: `A card is drawn from a standard deck of 52 cards. What is the probability that it is ${a} or ${b}?`, ans: CA.frac(ka + kb, 52), sol: R`No card is both, so add: \(\dfrac{${ka}}{52} + \dfrac{${kb}}{52} = ${frWork(ka + kb, 52)}\).` };
                },
            },
            {
                id: 'two-dice', name: 'Two dice', level: 2,
                gen(rng) {
                    const out = [];
                    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) out.push([a, b]);
                    const s = rng.int(3, 11);
                    const evs = [
                        [`the total is ${s}`, ([a, b]) => a + b === s], [`the total is more than ${s}`, ([a, b]) => a + b > s], [`the total is less than ${s}`, ([a, b]) => a + b < s],
                        ['a double (both dice the same)', ([a, b]) => a === b], ['the total is even', ([a, b]) => (a + b) % 2 === 0], ['the total is a prime number', ([a, b]) => isPrime(a + b)],
                        ['the total is a multiple of 3', ([a, b]) => (a + b) % 3 === 0], ['the total is a multiple of 4', ([a, b]) => (a + b) % 4 === 0], [`the total is at least ${s}`, ([a, b]) => a + b >= s],
                        ['the two numbers differ by 1', ([a, b]) => Math.abs(a - b) === 1], ['the total is 7 or 11', ([a, b]) => a + b === 7 || a + b === 11],
                    ];
                    const [text, pred] = rng.pick(evs), k = count(out, pred);
                    return {
                        q: `Two dice are rolled and the numbers are added. The table shows all 36 equally likely results. What is the probability that ${text}?`,
                        fig: diceSums(),
                        ans: CA.frac(k, 36),
                        sol: R`Count the cells in the table: ${k} of the 36 results work, so \(P = ${frWork(k, 36)}\).`,
                    };
                },
            },
            {
                id: 'expected', name: 'Theory and experiment', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const [text, pred] = rng.pick(numberEvents(6).filter(([t]) => !t.includes('less'))), k = count(range(1, 6), pred);
                        if (!k || k === 6) return this.gen(rng);
                        const N = 6 * rng.int(5, 50);
                        return { q: `A fair die is rolled ${N} times. About how many times would you expect to roll ${text}?`, ans: CA.num((N * k) / 6), sol: R`\(P = ${fr(k, 6)}\), so expect \(${fr(k, 6)} \times ${N} = ${(N * k) / 6}\) times.` };
                    }
                    if (kind === 1) {
                        const N = 10 * rng.int(3, 60);
                        return { q: `A coin is flipped ${N} times. About how many heads would you expect?`, ans: CA.num(N / 2), sol: R`\(\tfrac12 \times ${N} = ${N / 2}\).` };
                    }
                    if (kind === 2) {
                        const N = rng.pick([20, 25, 40, 50, 60, 80, 100, 120, 200]), H = rng.int(1, N - 1);
                        const thing = rng.pick([['a drawing pin', 'landed point up', 'drops'], ['a spinner', 'landed on red', 'spins'], ['a paper cup', 'landed on its side', 'throws'], ['a basketball player', 'scored', 'shots']]);
                        return { q: `In ${N} ${thing[2]}, ${thing[0]} ${thing[1]} ${H} times. What is the experimental probability that it ${thing[1]}?`, ans: CA.frac(H, N), sol: R`Experimental probability \(= \dfrac{\text{times it happened}}{\text{trials}} = ${frWork(H, N)}\).` };
                    }
                    const N = rng.pick([20, 25, 40, 50]), M = N * rng.int(2, 10), H = rng.int(1, N - 1);
                    return { q: `A spinner landed on blue ${H} times in ${N} spins. Using this result, how many times would you expect blue in ${M} spins?`, ans: CA.num((H * M) / N), sol: R`Experimental probability \(${frWork(H, N)}\), so expect \(${fr(H, N)} \times ${M} = ${(H * M) / N}\).` };
                },
            },
            {
                id: 'missing', name: 'Probabilities add up to 1', level: 2,
                gen(rng) {
                    if (rng.bool(0.6)) {
                        const d = rng.pick([10, 20, 100, 8, 12]), k = rng.int(3, 4), dec = d === 10 || d === 20 || d === 100;
                        const parts = range(1, k).map(() => rng.int(1, Math.floor(d / k)));
                        const last = d - parts.slice(0, -1).reduce((s, x) => s + x, 0);
                        if (last <= 0) return this.gen(rng);
                        parts[k - 1] = last;
                        const cols = rng.sample(['Red', 'Blue', 'Green', 'Yellow', 'Purple'], k), hide = rng.int(0, k - 1);
                        const show = x => (dec ? (x / d).toFixed(2).replace(/0$/, '') : fr(x, d));
                        const row = parts.map((x, i) => (i === hide ? '?' : show(x)));
                        return {
                            q: R`A spinner lands on one of ${numWord(k)} colours. The table shows the probabilities. Find the missing probability.\[\begin{array}{c|${'c'.repeat(k)}} \text{Colour} & ${cols.map(c => R`\text{${c}}`).join(' & ')} \\ \hline P & ${row.join(' & ')} \end{array}\]`,
                            ans: CA.frac(parts[hide], d),
                            sol: R`All the probabilities add up to 1: \(1 - (${parts.filter((_, i) => i !== hide).map(show).join(' + ')}) = ${dec ? show(parts[hide]) + ' = ' : ''}${fr(parts[hide], d)}\).`,
                        };
                    }
                    const [p, q] = rng.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6], [5, 6], [3, 8], [2, 7]]);
                    const k = p * rng.int(1, 6), total = (k / p) * q, col = rng.pick(COLOURS);
                    return { q: R`The probability of picking a ${col} marble from a bag is \(${fr(p, q)}\). There are ${k} ${col} marbles. How many marbles are in the bag?`, ans: CA.num(total), sol: R`\(${fr(p, q)}\) of the marbles is ${k}, so \(${fr(1, q)}\) is \(${k / p}\) and the whole bag is \(${k / p} \times ${q} = ${total}\).` };
                },
            },
            {
                id: 'two-picks', name: 'Two picks, with and without replacement', level: 3,
                gen(rng) {
                    const r = rng.int(2, 7), b = rng.int(2, 7), n = r + b, back = rng.bool(0.3);
                    const [c1, c2] = rng.sample(['red', 'blue', 'green', 'yellow'], 2);
                    const ask = rng.pick(['both1', 'both2', 'same', 'mixed']);
                    let fav = 0, tot = 0;
                    const balls = [...Array(r).fill(c1), ...Array(b).fill(c2)];
                    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
                        if (!back && i === j) continue;
                        tot++;
                        const x = balls[i], y = balls[j];
                        if (ask === 'both1' ? x === c1 && y === c1 : ask === 'both2' ? x === c2 && y === c2 : ask === 'same' ? x === y : x !== y) fav++;
                    }
                    const what = ask === 'both1' ? `both are ${c1}` : ask === 'both2' ? `both are ${c2}` : ask === 'same' ? 'they are the same colour' : 'they are different colours';
                    const n2 = back ? n : n - 1, rr = back ? r : r - 1, bb = back ? b : b - 1;
                    const work = ask === 'both1' ? R`\(\dfrac{${r}}{${n}} \times \dfrac{${rr}}{${n2}}\)` : ask === 'both2' ? R`\(\dfrac{${b}}{${n}} \times \dfrac{${bb}}{${n2}}\)`
                        : ask === 'same' ? R`\(\dfrac{${r}}{${n}}\times\dfrac{${rr}}{${n2}} + \dfrac{${b}}{${n}}\times\dfrac{${bb}}{${n2}}\)` : R`\(\dfrac{${r}}{${n}}\times\dfrac{${b}}{${n2}} + \dfrac{${b}}{${n}}\times\dfrac{${r}}{${n2}}\)`;
                    return {
                        q: `A bag holds ${r} ${c1} and ${b} ${c2} balls. One ball is taken out at random${back ? ', put back,' : ' and not put back,'} and then a second ball is taken. What is the probability that ${what}?`,
                        ans: CA.frac(fav, tot),
                        sol: R`${work} \(= ${fr(fav, tot)}\).${back ? '' : ` After the first pick there are only ${n - 1} balls left.`}`,
                    };
                },
            },
            {
                id: 'at-least-one', name: 'At least one', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const n = rng.int(2, 5), side = rng.pick(['head', 'tail']);
                        return { q: `A coin is flipped ${n} times. What is the probability of getting at least one ${side}?`, ans: CA.frac(2 ** n - 1, 2 ** n), sol: R`The only way to get no ${side}s is ${n} ${side === 'head' ? 'tails' : 'heads'} in a row: \(\left(\tfrac12\right)^{${n}} = ${fr(1, 2 ** n)}\). So \(P = 1 - ${fr(1, 2 ** n)} = ${fr(2 ** n - 1, 2 ** n)}\).` };
                    }
                    if (kind === 1) {
                        const n = rng.int(2, 3), k = rng.int(1, 6);
                        return { q: `A die is rolled ${n === 2 ? 'twice' : 'three times'}. What is the probability of getting at least one ${k}?`, ans: CA.frac(6 ** n - 5 ** n, 6 ** n), sol: R`\(P(\text{no ${k}}) = \left(\tfrac56\right)^{${n}} = ${fr(5 ** n, 6 ** n)}\), so \(P(\text{at least one}) = 1 - ${fr(5 ** n, 6 ** n)} = ${fr(6 ** n - 5 ** n, 6 ** n)}\).` };
                    }
                    if (kind === 2) {
                        const n = rng.int(3, 4), k = rng.int(1, n - 1);
                        const ways = CA.nCr(n, k);
                        return { q: `A coin is flipped ${n} times. What is the probability of getting exactly ${k} head${k === 1 ? '' : 's'}?`, ans: CA.frac(ways, 2 ** n), sol: R`There are \(2^{${n}} = ${2 ** n}\) equally likely results, and ${ways} of them have exactly ${k} head${k === 1 ? '' : 's'}: \(P = ${frWork(ways, 2 ** n)}\).` };
                    }
                    const [p, q] = rng.pick([[1, 3], [1, 4], [2, 5], [1, 5], [3, 4], [2, 3], [3, 8], [1, 6]]);
                    const n = 2, miss = (q - p) ** n;
                    return { q: R`The probability that a basketball player scores a free throw is \(${fr(p, q)}\). She takes two shots (they are independent). What is the probability that she scores at least once?`, ans: CA.frac(q ** n - miss, q ** n), sol: R`\(P(\text{miss both}) = \left(${fr(q - p, q)}\right)^2 = ${fr(miss, q * q)}\), so \(P(\text{at least one}) = 1 - ${fr(miss, q * q)} = ${fr(q * q - miss, q * q)}\).` };
                },
            },
            {
                id: 'reasoning', name: 'Working backwards', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {                                   // add x red so P(red) = p/q
                        const [p, q] = rng.pick([[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [1, 3], [4, 5]]);
                        const r = rng.int(1, 8), b = rng.int(2, 12);
                        const xNum = p * (r + b) - q * r, xDen = q - p;
                        if (xNum <= 0 || xNum % xDen !== 0) return this.gen(rng);
                        const x = xNum / xDen;
                        if (x > 30) return this.gen(rng);
                        return { q: R`A bag holds ${r} red and ${b} blue marbles. How many more red marbles must be added so that the probability of picking red is \(${fr(p, q)}\)?`, ans: CA.num(x), sol: R`Add \(x\) red: \(\dfrac{${r} + x}{${r + b} + x} = ${fr(p, q)}\). Cross-multiply: \(${q}(${r} + x) = ${p}(${r + b} + x)\), so \(${q * r} + ${q}x = ${p * (r + b)} + ${p === 1 ? '' : p}x\) and \(x = ${x}\).` };
                    }
                    if (kind === 1) {                                   // P(red) = p/q, k others → red?
                        const [p, q] = rng.pick([[1, 3], [2, 5], [3, 5], [1, 4], [3, 8], [2, 7], [5, 8], [3, 7]]);
                        const t = rng.int(1, 5), red = p * t, other = (q - p) * t, col = rng.pick(['blue', 'green', 'yellow']);
                        return { q: R`A jar has only red and ${col} sweets. There are ${other} ${col} sweets, and the probability of picking a red one is \(${fr(p, q)}\). How many red sweets are there?`, ans: CA.num(red), sol: R`\(P(\text{${col}}) = 1 - ${fr(p, q)} = ${fr(q - p, q)}\), so \(${fr(q - p, q)}\) of the jar is ${other} sweets: the jar has \(${(q * t)}\) sweets, and \(${q * t} - ${other} = ${red}\) are red.` };
                    }
                    const N = rng.pick([20, 24, 30, 36, 40, 50, 60]), [a, b] = rng.pick([[2, 3], [3, 5], [2, 5], [3, 4], [4, 6], [2, 7]]);
                    const k = count(range(1, N), x => x % a === 0 || x % b === 0), ka = Math.floor(N / a), kb = Math.floor(N / b), kab = Math.floor(N / CA.lcm(a, b));
                    return { q: `A whole number from 1 to ${N} is chosen at random. What is the probability that it is a multiple of ${a} or a multiple of ${b} (or both)?`, ans: CA.frac(k, N), sol: R`Multiples of ${a}: ${ka}. Multiples of ${b}: ${kb}. Multiples of both (of ${CA.lcm(a, b)}): ${kab}, counted twice. So \(${ka} + ${kb} - ${kab} = ${k}\) numbers, and \(P = ${frWork(k, N)}\).` };
                },
            },
        ],

        assignment: [
            ['bag', 4], ['numbers', 4], ['complement', 4], ['spinner', 3],
            ['cards', 4], ['and', 4], ['or', 4], ['two-dice', 4], ['expected', 3], ['missing', 4],
            ['two-picks', 4], ['at-least-one', 4], ['reasoning', 4],
        ],
    });
})();
