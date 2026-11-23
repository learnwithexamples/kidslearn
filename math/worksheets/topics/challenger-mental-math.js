/* Worksheet: Challenger Mental Math — chains of +, −, ×, ÷ worked one step at a time, left to right, in your head. */
(function () {
    'use strict';
    const R = String.raw;

    // ── Chains ───────────────────────────────────────────────────────────
    // A chain is a start number and steps { op, n }, worked strictly left to
    // right, like the voice on the page.  Every running total is a whole
    // number of at least 1, and every division comes out exactly.
    const SYM = { '+': '+', '-': '-', '*': R`\times`, '/': R`\div` };
    const apply = (x, { op, n }) => (op === '+' ? x + n : op === '-' ? x - n : op === '*' ? x * n : x / n);
    const run = (start, steps) => steps.reduce(apply, start);

    /**
     * One step from `cur`, or null.  o = { min, max, multMax, cap }:
     * cap is the largest running total allowed after ×, multMax the largest multiplier.
     */
    function tryOp(rng, op, cur, o) {
        if (op === '+') { const hi = Math.min(o.max, o.cap - cur); return hi >= o.min ? { op, n: rng.int(o.min, hi) } : null; }
        if (op === '-') { const hi = Math.min(o.max, cur - 1); return hi >= o.min ? { op, n: rng.int(o.min, hi) } : null; }
        if (op === '*') {
            if (o.multCur && cur > o.multCur) return null;                        // simple: stay inside the 12 × 12 table
            const lo = Math.max(2, o.min), hi = Math.min(o.max, o.multMax, Math.floor(o.cap / cur));
            return hi >= lo ? { op, n: rng.int(lo, hi) } : null;
        }
        const divs = [];
        for (let d = Math.max(2, o.min); d <= Math.min(o.max, cur - 1); d++) if (cur % d === 0) divs.push(d);
        if (!divs.length) return null;
        return { op, n: rng.pick(divs.slice(Math.floor(divs.length / 2))) };     // bigger divisors, like the page
    }
    /** A random chain of `count` numbers. ok(start, steps) filters it. */
    function chain(rng, o) {
        for (;;) {
            const start = rng.int(o.startMin || o.min, o.startMax || o.max);
            let cur = start;
            const steps = [];
            for (let i = 1; i < o.count; i++) {
                let st = null;
                for (const op of rng.shuffle(o.ops)) if ((st = tryOp(rng, op, cur, o))) break;
                if (!st) break;
                steps.push(st);
                cur = apply(cur, st);
            }
            if (steps.length !== o.count - 1) continue;
            // no step that just undoes the one before (× 6 then ÷ 6), and no running total below o.floor
            if (steps.some((s, i) => i && s.n === steps[i - 1].n && INV[s.op] === steps[i - 1].op)) continue;
            if (o.floor && steps.some((s, i) => run(start, steps.slice(0, i + 1)) < o.floor)) continue;
            const kinds = new Set(steps.map(s => s.op));
            if (kinds.size < (o.distinct || 1)) continue;
            if (o.need && !o.need.every(op => kinds.has(op))) continue;
            return { start, steps, end: cur };
        }
    }
    /** "\(14 + 9 = 23\), \(23 \times 2 = 46\), …" — the running total, step by step. */
    function working(start, steps) {
        const out = [];
        let cur = start;
        for (const s of steps) { const nx = apply(cur, s); out.push(R`\(${cur} ${SYM[s.op]} ${s.n} = ${nx}\)`); cur = nx; }
        return out.join(', ');
    }
    const IMPERATIVE = {
        '+': [n => `add ${n}`, n => `add on ${n}`],
        '-': [n => `subtract ${n}`, n => `take away ${n}`],
        '*': [n => `multiply by ${n}`],
        '/': [n => `divide by ${n}`],
    };
    const SPOKEN = { '+': 'plus', '-': 'minus', '*': 'times', '/': 'divided by' };
    const list = parts => (parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')}, then ${parts[parts.length - 1]}`);
    /** "Start with 14, add 9, multiply by 2, then divide by 3." */
    function sayChain(rng, start, steps) {
        const parts = steps.map(s => rng.pick(IMPERATIVE[s.op])(s.n));
        return rng.bool() ? `Start with ${start}, ${list(parts)}.` : `Start with ${start}. ${list(parts).replace(/^./, c => c.toUpperCase())}.`;
    }
    /** Numbers in words, 1–100: 42 → "forty-two". */
    const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const words = n => (n === 100 ? 'one hundred' : n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''));

    const SIMPLE = { min: 1, max: 20, floor: 2, multMax: 12, multCur: 12, cap: 144, count: 4 };
    /** The first step of "I think of a number …", where the number is "it". */
    const FIRST = { '+': n => `add ${n} to it`, '-': n => `subtract ${n} from it`, '*': n => `multiply it by ${n}`, '/': n => `divide it by ${n}` };
    const INV = { '+': '-', '-': '+', '*': '/', '/': '*' };
    const undo = steps => steps.slice().reverse().map(s => ({ op: INV[s.op], n: s.n }));
    /** "14 plus 9, times 2, minus 17" */
    const spoken = (start, steps, w = String) => `${w(start)} ${steps.map(s => `${SPOKEN[s.op]} ${w(s.n)}`).join(', ')}`;
    const MEDIUM = { min: 1, max: 50, floor: 2, multMax: 12, cap: 500, count: 5 };
    const HARD = { min: 5, max: 100, floor: 2, multMax: 12, cap: 1000, count: 6 };

    CA.register({
        id: 'challenger-mental-math',
        title: 'Challenger Mental Math',
        page: 'challenger-mental-math.html',
        compact: true,   // short problems: three columns, small answer space
        assignmentNote: 'Work every chain in your head, one step at a time from left to right, just as you hear it on the page: do each step to the answer so far. Write only the final answer.',

        practice: [
            // ── Part A: simple chains (1–20, four numbers) ────────────────
            {
                id: 'add-sub-chain', name: 'Adding and taking away', level: 1,
                gen(rng) {
                    const c = chain(rng, { ...SIMPLE, cap: 60, ops: ['+', '-'], need: ['+', '-'] });
                    const q = rng.bool() ? sayChain(rng, c.start, c.steps)
                        : `Work out from left to right: ${spoken(c.start, c.steps)}.`;
                    return { q, ans: CA.num(c.end), sol: `${working(c.start, c.steps)}.` };
                },
            },
            {
                id: 'simple-chain', name: 'Simple chains with × and ÷', level: 1,
                gen(rng) {
                    const c = chain(rng, { ...SIMPLE, ops: ['+', '-', '*', '/'], distinct: 3 });
                    if (!c.steps.some(s => s.op === '*' || s.op === '/')) return this.gen(rng);
                    return { q: sayChain(rng, c.start, c.steps), ans: CA.num(c.end), sol: `${working(c.start, c.steps)}.` };
                },
            },
            {
                id: 'double-halve', name: 'Double and halve', level: 1,
                gen(rng) {
                    for (;;) {
                        const start = rng.int(3, 20), steps = [], said = [];
                        let cur = start;
                        for (let i = 0; i < 4; i++) {
                            const choice = rng.pick(['double', 'halve', 'add', 'sub']);
                            if (choice === 'double' && cur <= 50) { steps.push({ op: '*', n: 2 }); said.push('double it'); }
                            else if (choice === 'halve' && cur % 2 === 0 && cur > 2) { steps.push({ op: '/', n: 2 }); said.push('halve it'); }
                            else if (choice === 'add') { const n = rng.int(2, 15); steps.push({ op: '+', n }); said.push(`add ${n}`); }
                            else if (choice === 'sub' && cur > 3) { const n = rng.int(1, Math.min(15, cur - 1)); steps.push({ op: '-', n }); said.push(`take away ${n}`); }
                            else { i--; continue; }
                            cur = apply(cur, steps[steps.length - 1]);
                        }
                        const ops = steps.map(s => s.op);
                        if (!ops.includes('*') || !ops.includes('/')) continue;
                        if (steps.some((s, i) => i && s.n === steps[i - 1].n && INV[s.op] === steps[i - 1].op)) continue;   // "double it, halve it"
                        return { q: `Start with ${start}, ${list(said)}. What do you get?`, ans: CA.num(cur), sol: `${working(start, steps)}.` };
                    }
                },
            },
            {
                id: 'story-simple', name: 'Short stories', level: 1,
                gen(rng) {
                    const k = rng.int(0, 3);
                    if (k === 0) {
                        const a = rng.int(12, 30), b = rng.int(2, a - 2), c = rng.int(2, 15), d = rng.int(2, a - b + c - 1);
                        return { q: `A bus leaves the station with ${a} people on board. At the first stop ${b} get off and ${c} get on. At the next stop ${d} get off. How many people are on the bus now?`, ans: CA.num(a - b + c - d), sol: R`\(${a} - ${b} = ${a - b}\), \(${a - b} + ${c} = ${a - b + c}\), \(${a - b + c} - ${d} = ${a - b + c - d}\).` };
                    }
                    if (k === 1) {
                        const c = rng.int(2, 6), bags = rng.int(2, 6), b = rng.int(1, 9), a = c * bags + b;
                        return { q: `Nina picks ${a} apples. She eats ${b} of them, then puts the rest into bags of ${c}. How many bags does she fill?`, ans: CA.num(bags), sol: R`\(${a} - ${b} = ${a - b}\), then \(${a - b} \div ${c} = ${bags}\).` };
                    }
                    if (k === 2) {
                        const a = rng.int(3, 9), b = rng.int(3, 9), c = rng.int(2, a * b - 2);
                        return { q: `Some children stand in ${a} rows of ${b}. Then ${c} children go back inside. How many are still standing in the rows?`, ans: CA.num(a * b - c), sol: R`\(${a} \times ${b} = ${a * b}\), then \(${a * b} - ${c} = ${a * b - c}\).` };
                    }
                    const a = rng.int(2, 10), b = rng.int(3, 12), c = rng.int(1, a + b - 1), d = rng.int(2, 9);
                    return { q: `A frog sits on step ${a} of a long staircase. It hops up ${b} steps, back down ${c} steps, then up ${d} more. Which step is it on now?`, ans: CA.num(a + b - c + d), sol: R`\(${a} + ${b} = ${a + b}\), \(${a + b} - ${c} = ${a + b - c}\), \(${a + b - c} + ${d} = ${a + b - c + d}\).` };
                },
            },

            // ── Part B: medium chains (1–50, five numbers) ────────────────
            {
                id: 'medium-chain', name: 'Five-number chains', level: 2,
                gen(rng) {
                    const c = chain(rng, { ...MEDIUM, ops: ['+', '-', '*', '/'], distinct: 3 });
                    return { q: sayChain(rng, c.start, c.steps), ans: CA.num(c.end), sol: `${working(c.start, c.steps)}.` };
                },
            },
            {
                id: 'spoken-chain', name: 'Chains in words', level: 2,
                gen(rng) {
                    const c = chain(rng, { ...MEDIUM, count: rng.int(4, 5), ops: ['+', '-', '*', '/'], distinct: 3 });
                    const said = spoken(c.start, c.steps, words);
                    return { q: `You hear: “${said.replace(/^./, ch => ch.toUpperCase())}.” Work it out step by step. What is the answer?`, ans: CA.num(c.end), sol: `${working(c.start, c.steps)}.` };
                },
            },
            {
                id: 'arrow-chain', name: 'Number machines', level: 2,
                gen(rng) {
                    const c = chain(rng, { ...MEDIUM, count: 4, ops: ['+', '-', '*', '/'], distinct: 3 });
                    const arrows = c.steps.map((s, i) => R`\xrightarrow{\;${SYM[s.op]}${s.n}\;} ${i === c.steps.length - 1 ? '\\;?' : R`\square`}`).join(' ');
                    return { q: R`Follow the arrows. What number comes out at the end? \[${c.start} ${arrows}\]`, ans: CA.num(c.end), sol: `${working(c.start, c.steps)}.` };
                },
            },
            {
                id: 'missing-number', name: 'The missing number', level: 2,
                gen(rng) {
                    const c = chain(rng, { ...MEDIUM, max: 30, count: 4, ops: ['+', '-', '*', '/'], distinct: 3 });
                    const h = rng.int(0, c.steps.length - 1), hid = c.steps[h];
                    const parts = c.steps.map((s, i) => (i === h ? R`${IMPERATIVE[s.op][0]('\\(\\square\\)')}` : IMPERATIVE[s.op][0](s.n)));
                    const before = run(c.start, c.steps.slice(0, h)), after = apply(before, hid);
                    const rest = c.steps.slice(h + 1);
                    const fwd = h ? `Forwards: ${working(c.start, c.steps.slice(0, h))}. ` : '';
                    const back = rest.length ? `Backwards from ${c.end}: ${working(c.end, undo(rest))}. ` : '';
                    const how = hid.op === '+' ? R`\(${after} - ${before} = ${hid.n}\)` : hid.op === '-' ? R`\(${before} - ${after} = ${hid.n}\)`
                        : hid.op === '*' ? R`\(${after} \div ${before} = ${hid.n}\)` : R`\(${before} \div ${after} = ${hid.n}\)`;
                    return { q: `Start with ${c.start}, ${list(parts)}. The answer is ${c.end}. What number goes in the box?`, ans: CA.num(hid.n), sol: `${fwd}${back}The box turns ${before} into ${after}, so it is ${how}.` };
                },
            },
            {
                id: 'story-chain', name: 'Stories in steps', level: 2,
                gen(rng) {
                    const k = rng.int(0, 3);
                    if (k === 0) {
                        const a = rng.int(3, 8), b = rng.pick([6, 8, 10, 12]), d = rng.int(4, 8), boxes = rng.int(2, Math.floor((a * b - 1) / d));
                        const c = a * b - d * boxes;
                        if (c < 2) return this.gen(rng);
                        return { q: `A baker makes ${a} trays of ${b} muffins. She sells ${c} muffins and packs the rest into boxes of ${d}. How many boxes does she fill?`, ans: CA.num(boxes), sol: R`\(${a} \times ${b} = ${a * b}\), \(${a * b} - ${c} = ${a * b - c}\), \(${a * b - c} \div ${d} = ${boxes}\).` };
                    }
                    if (k === 1) {
                        const a = rng.int(3, 15), b = rng.int(3, 10), c = rng.int(5, a * b - 1), d = rng.int(5, 40);
                        return { q: `Lily saves $${a} every week for ${b} weeks. She spends $${c} on a game, then gets $${d} for her birthday. How much money does she have now?`, ans: CA.num(a * b - c + d, '$'), sol: R`\(${a} \times ${b} = ${a * b}\), \(${a * b} - ${c} = ${a * b - c}\), \(${a * b - c} + ${d} = ${a * b - c + d}\) dollars.` };
                    }
                    if (k === 2) {
                        const b = rng.int(3, 6), teams = rng.int(3, 8), a = b * teams, c = rng.int(2, 6), d = rng.int(1, teams * c - 1);
                        return { q: `A class of ${a} students splits into teams of ${b}. Each team gets ${c} balls. Then ${d} balls go missing. How many balls are left?`, ans: CA.num(teams * c - d), sol: R`\(${a} \div ${b} = ${teams}\) teams, \(${teams} \times ${c} = ${teams * c}\) balls, \(${teams * c} - ${d} = ${teams * c - d}\).` };
                    }
                    const a = rng.int(8, 20), b = rng.int(10, 25), d = rng.pick([2, 3, 4, 5]);
                    const c = rng.pick([...Array(39)].map((_, i) => i + 2).filter(x => (a * b - x) % d === 0)), each = (a * b - c) / d;
                    return { q: `A hall has ${a} rows of ${b} seats. ${c} seats are broken, and the rest are shared equally between ${d} schools. How many seats does each school get?`, ans: CA.num(each), sol: R`\(${a} \times ${b} = ${a * b}\), \(${a * b} - ${c} = ${a * b - c}\), \(${a * b - c} \div ${d} = ${each}\).` };
                },
            },

            // ── Part C: hard chains (5–100, six numbers and more) ─────────
            {
                id: 'hard-chain', name: 'Six-number chains', level: 3,
                gen(rng) {
                    const c = chain(rng, { ...HARD, ops: ['+', '-', '*', '/'], distinct: 4 });
                    return { q: sayChain(rng, c.start, c.steps), ans: CA.num(c.end), sol: `${working(c.start, c.steps)}.` };
                },
            },
            {
                id: 'long-chain', name: 'Long chains', level: 3,
                gen(rng) {
                    const c = chain(rng, { min: 2, max: 30, floor: 2, multMax: 9, cap: 400, count: 8, ops: ['+', '-', '*', '/'], distinct: 4 });
                    return { q: `A stretch — keep the running total in your head: ${spoken(c.start, c.steps)}. What is the answer?`, ans: CA.num(c.end), sol: `${working(c.start, c.steps)}.` };
                },
            },
            {
                id: 'reverse-chain', name: 'Work backwards', level: 3,
                gen(rng) {
                    const c = chain(rng, { ...MEDIUM, startMin: 3, startMax: 30, max: 20, count: rng.int(4, 5), ops: ['+', '-', '*', '/'], distinct: 3, need: ['*'] });
                    const parts = c.steps.map((s, i) => (i === 0 ? FIRST[s.op](s.n) : rng.pick(IMPERATIVE[s.op])(s.n)));
                    return { q: `I think of a number. I ${list(parts)}. My answer is ${c.end}. What number did I start with?`, ans: CA.num(c.start), sol: `Undo each step, last one first: ${working(c.end, undo(c.steps))}.` };
                },
            },
        ],

        assignment: [
            ['add-sub-chain', 4], ['simple-chain', 4], ['double-halve', 3], ['story-simple', 4],
            ['medium-chain', 6], ['spoken-chain', 4], ['arrow-chain', 4], ['missing-number', 4], ['story-chain', 5],
            ['hard-chain', 5], ['long-chain', 3], ['reverse-chain', 4],
        ],
    });
})();
