/* Challenge Academy — Lesson 18: Chinese Remainder Theorem */
(function () {
    'use strict';
    const R = String.raw, m = CA.m;

    // ── Maths: every answer is found by search, never by formula ─────────
    // A condition is [divisor, remainder].
    const lcmAll = ds => ds.reduce((a, b) => CA.lcm(a, b), 1);
    const fits = (n, conds) => conds.every(([d, r]) => n % d === r);
    /** Smallest whole number ≥ from that meets every condition; null if there is none. */
    function search(conds, from = 1) {
        const stop = from + lcmAll(conds.map(c => c[0]));
        for (let n = from; n <= stop; n++) if (fits(n, conds)) return n;
        return null;
    }
    /** Largest whole number ≤ from that meets every condition; null if there is none. */
    function searchDown(conds, from) {
        for (let n = from; n >= 1; n--) if (fits(n, conds)) return n;
        return null;
    }
    /** Every solution from 1 to N, by search. */
    const allUpTo = (conds, N) => { const a = []; for (let n = 1; n <= N; n++) if (fits(n, conds)) a.push(n); return a; };
    /** How far apart two neighbouring solutions are (found by search). */
    const gap = conds => { const x = search(conds); return search(conds, x + 1) - x; };
    function must(ok, tag) { if (!ok) throw new Error(`lesson 18 ${tag}: the answer does not check out`); }

    /** A problem.  `chk` holds the givens for an independent checker outside the repo; it never reaches a page. */
    function prob(q, ans, sol, chk) {
        const o = { q, ans, sol };
        Object.defineProperty(o, 'chk', { value: chk });
        return o;
    }

    /**
     * Step-by-step satisfaction, written out with the actual numbers: list the
     * solutions of the condition with the greatest divisor, then select by
     * adding the other conditions one at a time.
     */
    function steps(conds) {
        const cs = conds.slice().sort((a, b) => b[0] - a[0]);
        let x = cs[0][1] || cs[0][0], step = cs[0][0], text = '';
        for (let i = 1; i < cs.length; i++) {
            const [d, r] = cs[i], seen = [x];
            while (x % d !== r) { x += step; seen.push(x); if (seen.length > d + 1) return null; }
            const list = seen.length > 9 ? [...seen.slice(0, 3), '…', ...seen.slice(-2)] : seen;
            const shown = list.map((v, j) => (j === list.length - 1 ? `<strong>${v}</strong>` : v)).join(', ');
            if (i > 1 && seen.length === 1) text += ` And ${x} already leaves remainder ${r} on division by ${d}.`;
            else text += (i === 1
                ? `Start with the greatest divisor: the numbers with remainder ${cs[0][1]} on division by ${cs[0][0]} are ${shown}`
                : ` Now go up in ${step}s, which keeps the earlier conditions true: ${shown}`)
                + ` — ${x} is the first that also leaves remainder ${r} on division by ${d}.`;
            step = CA.lcm(step, d);
        }
        return { x, step, text };
    }

    // ── Wording ──────────────────────────────────────────────────────────
    const and = a => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
    const or = a => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]);
    const over = r => (r === 0 ? 'none are left over' : r === 1 ? '1 is left over' : `${r} are left over`);
    const pl = (k, one, many) => (k === 1 ? one : many);
    const STORIES = [
        { thing: 'apples', intro: 'A crate holds some apples.', cl: (d, r) => `Packed ${d} to a box, ${over(r)}.`,
          short: (d, c) => `Packed ${d} to a box, the last box needs ${c} more ${pl(c, 'apple', 'apples')} to be full.` },
        { thing: 'students', intro: 'The students of a school line up for a parade.', cl: (d, r) => `In rows of ${d}, ${over(r)}.`,
          short: (d, c) => `In rows of ${d}, the last row has ${c} empty ${pl(c, 'place', 'places')}.` },
        { thing: 'soldiers', intro: 'General Han Xin lines up his soldiers.', cl: (d, r) => `In rows of ${d}, ${over(r)}.`,
          short: (d, c) => `In rows of ${d}, the last row is ${c} ${pl(c, 'soldier', 'soldiers')} short of being full.` },
        { thing: 'eggs', intro: 'A farmer counts the eggs in a basket.', cl: (d, r) => `Counting them ${d} at a time, ${over(r)}.`,
          short: (d, c) => `Counting them ${d} at a time, the last group is ${c} short.` },
        { thing: 'sweets', intro: 'A jar of sweets is to be shared out equally.', cl: (d, r) => `Shared among ${d} children, ${over(r)}.`,
          short: (d, c) => `To share them equally among ${d} children, ${c} more ${pl(c, 'sweet is', 'sweets are')} needed.` },
        { thing: 'books', intro: 'A librarian packs books into boxes.', cl: (d, r) => `With ${d} books in every box, ${over(r)}.`,
          short: (d, c) => `With ${d} books in every box, the last box has room for ${c} more.` },
        { thing: 'marbles', intro: 'Mei sorts her marbles into equal piles.', cl: (d, r) => `In piles of ${d}, ${over(r)}.`,
          short: (d, c) => `In piles of ${d}, the last pile is ${c} short.` },
        { thing: 'pencils', intro: 'A teacher puts pencils into packs.', cl: (d, r) => `With ${d} pencils in each pack, ${over(r)}.`,
          short: (d, c) => `With ${d} pencils in each pack, the last pack needs ${c} more.` },
    ];
    const plain = conds => and(conds.map(([d, r]) => (r === 0 ? `is exactly divisible by ${d}` : `leaves a remainder of ${r} when divided by ${d}`)));
    const plainPl = conds => plain(conds).replace(/leaves/g, 'leave').replace(/is exactly/g, 'are exactly');
    /** A story (or, sometimes, a bare number statement) for the conditions. */
    function story(rng, conds, pPlain = 0.3) {
        if (rng.bool(pPlain)) return { text: `A positive whole number ${plain(conds)}.`, thing: null };
        const s = rng.pick(STORIES);
        return { text: s.intro + ' ' + conds.map(([d, r]) => s.cl(d, r)).join(' '), thing: s.thing };
    }
    const askSmallest = st => (st.thing ? `What is the smallest possible number of ${st.thing}?` : 'What is the smallest such number?');
    /** A list of solutions; `hl` are shown in bold; `more` adds a trailing "…". */
    const fmt = (arr, hl = [], lead = false, more = true) => (lead ? '…, ' : '') + arr.map(v => (hl.includes(v) ? `<strong>${v}</strong>` : v)).join(', ') + (more ? ', …' : '');

    /**
     * A question about the solutions in a range.  `head` is the method so far (it ends
     * by saying how the solutions go); every answer comes from searching.
     */
    function rangeAsk(rng, conds, st, kinds) {
        const sols = allUpTo(conds, 12000);
        const idx = v => sols.indexOf(v);
        for (let tries = 0; tries < 400; tries++) {
            const kind = rng.pick(kinds);
            if (kind === 'one') {
                const w = rng.pick([50, 100, 100, 200]), lo = w * rng.int(1, Math.floor(1600 / w)), hi = lo + w;
                const inside = sols.filter(v => v > lo && v < hi);
                if (inside.length !== 1 || fits(lo, conds) || fits(hi, conds)) continue;
                const x = inside[0], i = idx(x);
                const q = st.thing ? `${st.text} There are more than ${lo} but fewer than ${hi} ${st.thing}. Exactly how many ${st.thing} are there?`
                    : `A whole number between ${lo} and ${hi} ${plain(conds)}. What is the number?`;
                return { q, x, chk: { kind, lo, hi }, tail: `The solutions are ${fmt(sols.slice(Math.max(0, i - 1), i + 2), [x], i > 1)} Only ${x} is between ${lo} and ${hi}.` };
            }
            if (kind === 'count') {
                const lo = 50 * rng.int(1, 20), hi = lo + 50 * rng.int(2, 12);
                const inside = sols.filter(v => v > lo && v < hi);
                if (inside.length < 2 || inside.length > 10 || fits(lo, conds) || fits(hi, conds)) continue;
                const i = idx(inside[0]);
                const shown = inside.length > 6 ? `${inside.slice(0, 3).join(', ')}, …, ${inside[inside.length - 1]}` : inside.join(', ');
                return { q: `How many whole numbers between ${lo} and ${hi} ${plainPl(conds)}?`, x: inside.length, chk: { kind, lo, hi },
                    tail: `The solutions between ${lo} and ${hi} are ${shown} (the ones on either side${i > 0 ? `, ${sols[i - 1]} and` : ' are'} ${sols[i + inside.length]}${i > 0 ? ', are' : ''} outside). That is ${inside.length} numbers.` };
            }
            if (kind === 'below') {
                const N = rng.pick([100, 150, 200, 250, 300, 400, 500, 1000]);
                const inside = sols.filter(v => v < N);
                if (inside.length < 2 || inside.length > 15) continue;
                const shown = inside.length > 6 ? `${inside.slice(0, 3).join(', ')}, …, ${inside[inside.length - 1]}` : inside.join(', ');
                return { q: `How many positive whole numbers less than ${N} ${plainPl(conds)}?`, x: inside.length, chk: { kind, N },
                    tail: `Below ${N}: ${shown}; the next one, ${sols[inside.length]}, is too big. That is ${inside.length} numbers.` };
            }
            if (kind === 'largest3' || kind === 'smallest3') {
                const big = kind === 'largest3', inside = sols.filter(v => v >= 100 && v <= 999);
                if (!inside.length) continue;
                const x = big ? inside[inside.length - 1] : inside[0], i = idx(x);
                const q = `What is the ${big ? 'largest' : 'smallest'} three-digit number that ${plain(conds)}?`;
                return { q, x, chk: { kind },
                    tail: big ? `Near 1000 the solutions are ${fmt([x, sols[i + 1]], [x], true, false)}: ${sols[i + 1]} has four digits, so the largest is ${x}.`
                        : `The solutions are ${fmt(sols.slice(Math.max(0, i - 1), i + 1), [x], i > 1)}: ${i > 0 ? `${sols[i - 1]} has only ${String(sols[i - 1]).length} ${pl(String(sols[i - 1]).length, 'digit', 'digits')}, so ` : ''}the smallest three-digit one is ${x}.` };
            }
            // 'greater'
            const N = rng.pick([50, 100, 150, 200, 250, 300, 400, 500]), x = sols.find(v => v > N), i = idx(x);
            if (i < 1) continue;
            const q = st.thing ? `${st.text} There are more than ${N} ${st.thing}. What is the smallest possible number of ${st.thing}?`
                : `What is the smallest whole number greater than ${N} that ${plain(conds)}?`;
            return { q, x, chk: { kind, N }, tail: `The solutions are ${fmt(sols.slice(Math.max(0, i - 1), i + 2), [x], i > 1)} The first one greater than ${N} is ${x}.` };
        }
        throw new Error('lesson 18 rangeAsk: no suitable range');
    }

    // ── Number choices ───────────────────────────────────────────────────
    const TRIPLES = [[3, 5, 7], [3, 4, 5], [2, 5, 7], [3, 4, 7], [4, 5, 7], [3, 5, 8], [2, 7, 9], [3, 7, 8], [4, 5, 9], [5, 6, 7], [3, 5, 11], [2, 3, 7], [4, 7, 9], [2, 5, 9]];
    const BIG_TRIPLES = [[3, 5, 7], [4, 5, 7], [3, 7, 8], [5, 7, 9], [5, 6, 7], [3, 5, 11], [4, 7, 9], [5, 7, 8], [7, 8, 9], [3, 7, 11]];
    const SHARED = [[4, 6], [6, 8], [6, 9], [8, 12], [6, 10], [9, 12], [10, 15], [8, 10], [4, 10], [9, 15], [12, 15], [10, 12]];
    const SAME_SETS = [[3, 4], [2, 5], [3, 5], [4, 5], [4, 6], [3, 7], [5, 6], [6, 8], [4, 7], [5, 7], [6, 9], [2, 3, 5], [3, 4, 5], [2, 3, 7], [3, 4, 6], [4, 5, 6], [2, 5, 7], [3, 5, 6], [4, 6, 9], [5, 6, 8], [3, 5, 7], [4, 5, 7], [6, 8, 9], [3, 4, 5, 6]];
    const coprimePair = (rng, lo, hi) => { for (;;) { const a = rng.int(lo, hi), b = rng.int(lo, hi); if (a < b && CA.gcd(a, b) === 1) return [a, b]; } };
    const sameRem = conds => conds.every(c => c[1] === conds[0][1]);
    const sameComp = conds => conds.every(c => c[0] - c[1] === conds[0][0] - conds[0][1]);
    /** Random remainders (1 … d−1) for the divisors, avoiding the two shortcut patterns and tiny answers. */
    function mixed(rng, ds, zero = 0) {
        for (;;) {
            const conds = ds.map(d => [d, rng.int(1, d - 1)]);
            if (zero && rng.bool(zero)) conds[rng.int(0, conds.length - 1)][1] = 0;
            if (sameRem(conds) || sameComp(conds)) continue;
            if (search(conds) > Math.max(...ds)) return conds;
        }
    }
    /** Conditions with one shared remainder r (pattern 'rem') or one shared complement c (pattern 'comp'). */
    function patterned(rng, sets, pattern) {
        for (;;) {
            const ds = rng.pick(sets), k = rng.int(1, Math.min(...ds) - 1);
            const conds = ds.map(d => [d, pattern === 'rem' ? k : d - k]);
            if (pattern === 'comp' && sameRem(conds)) continue;
            if (pattern === 'rem' && sameComp(conds)) continue;
            return { ds, k, conds, L: lcmAll(ds) };
        }
    }
    /** The method sentence for the two patterns, with the numbers. */
    const remHead = (ds, r, L) => R`Same remainder: dividend − ${r} is a common multiple of ${and(ds)}. Their LCM is ${L}, so the number is ${m(`${L}k+${r}`)}.`;
    const compHead = (ds, c, L) => R`Same “complement”: ${ds.map(d => `${d} − ${d - c}`).join(', ')} all equal ${c}. So dividend + ${c} is a common multiple of ${and(ds)}. Their LCM is ${L}, so the number is ${m(`${L}k-${c}`)}.`;

    // ── Numbers used in the tutorial and examples ────────────────────────
    const listOf = ([d, r], upTo) => { const a = []; for (let n = 1; n <= upTo; n++) if (n % d === r) a.push(n); return a; };
    const bold = (arr, x) => arr.map(v => (v === x ? `<strong>${v}</strong>` : v)).join(', ');

    const SR = [[4, 1], [5, 1], [6, 1]], srL = lcmAll([4, 5, 6]), srSols = allUpTo(SR, 250);
    must(srSols.every(v => (v - 1) % srL === 0) && gap(SR) === srL, 'tutorial same remainder');
    const SC = [[4, 3], [5, 4], [6, 5]], scSols = allUpTo(SC, 200);
    must(scSols.every(v => (v + 1) % srL === 0), 'tutorial same complement');
    const SC2 = [[5, 3], [7, 5]], sc2 = search(SC2);
    must(sc2 === 35 - 2, 'tutorial complement 2');
    const SUNZI = [[3, 2], [5, 3], [7, 2]];
    const sunzi = search(SUNZI), sunziGap = gap(SUNZI), sunziSteps = steps(SUNZI);
    must(sunziSteps.x === sunzi, 'sunzi');
    const T4 = [[4, 1], [5, 2], [7, 4]], t4 = steps(T4);
    must(t4.x === search(T4), 'tutorial step 2');
    function block(mult, d) { for (let n = mult; n <= mult * d; n += mult) if (n % d === 1) return n; return null; }
    const blocksFor = ds => ds.map((d, i) => block(lcmAll(ds.filter((_, j) => j !== i)), d));
    const B357 = blocksFor([3, 5, 7]);
    const sunziSum = B357[0] * 2 + B357[1] * 3 + B357[2] * 2;
    const NOPE = [[4, 1], [6, 2]], YES = [[4, 3], [6, 5]], yes = search(YES), yesGap = gap(YES);
    must(search(NOPE) === null, 'no solution');

    const EX1 = [[4, 1], [5, 1], [6, 1]], ex1Sols = allUpTo(EX1, 200).filter(v => v > 100 && v < 150);
    must(ex1Sols.length === 1, 'example 1');
    const EX2 = [[6, 4], [8, 6], [9, 7]], ex2L = lcmAll([6, 8, 9]), ex2All = allUpTo(EX2, 300), ex2Sols = ex2All.filter(v => v > 100 && v < 200);
    must(ex2Sols.length === 1 && ex2All.every(v => (v + 2) % ex2L === 0), 'example 2');
    const EX3 = [[5, 2], [7, 3]], ex3 = search(EX3);
    const HAN = [[3, 2], [5, 3], [7, 2]], hanAns = allUpTo(HAN, 1100).filter(v => v > 1000), hanStep = steps(HAN);
    must(hanAns.length === 1, 'han xin');
    const EX5 = [[4, 3], [9, 2]], ex5 = steps(EX5), ex5Top = searchDown(EX5, 999), ex5Three = allUpTo(EX5, 999).filter(v => v >= 100);
    const ex5First = ex5Three[0], ex5Count = ex5Three.length;
    const EGG = [[2, 1], [3, 1], [4, 1], [5, 1], [6, 1]], eggL = lcmAll(EGG.map(c => c[0]));
    const eggAns = search([...EGG, [7, 0]]);
    const eggList = []; for (let n = 1; n <= eggAns; n += eggL) eggList.push(n);

    CA.register({
        id: 18,

        tutorial: [
            {
                h: 'Remainders: a quick reminder',
                html: R`
                <p>Divide 23 by 5: \(23 = 5\times4+3\). Here 23 is the <strong>dividend</strong>, 5 the
                   <strong>divisor</strong>, 4 the quotient and 3 the <strong>remainder</strong>. When you divide by 5 the
                   remainder can only be 0, 1, 2, 3 or 4 — never 5 or more, because then another five would fit.</p>
                <p>Remainders go round in a cycle. Count upwards and watch the remainder on division by 5:</p>
                <table>
                    <tr><th>Number</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td></tr>
                    <tr><th>Remainder</th><td>1</td><td>2</td><td>3</td><td>4</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>0</td><td>1</td><td>2</td><td>3</td></tr>
                </table>
                <div class="ca-key"><strong>Key idea.</strong> All the numbers that leave remainder 3 on division by 5 are
                   <strong>5 apart</strong>: 3, 8, 13, 18, 23, … Adding or taking away a multiple of 5 never changes the remainder.</div>
                <p>This lesson is about the reverse question, first asked by the Chinese mathematician Sun Zi about 1,600
                   years ago: <em>knowing the remainders for several divisors, find the dividend.</em> The book gives three
                   ways in — two shortcuts and one method that always works.</p>
                <div class="ca-tip"><strong>A short way to write it.</strong> Mathematicians write
                   \(23 \equiv 3 \pmod 5\): “23 is congruent to 3 modulo 5”. You can solve everything here without it.</div>`,
            },
            {
                h: 'Same remainder',
                html: R`
                <p>A number leaves remainder 1 when divided by 4, by 5 and by 6. The <em>same</em> remainder every time.</p>
                <p>Take the 1 away. What is left divides exactly by 4, by 5 and by 6 — it is a <strong>common multiple</strong>
                   of the divisors. The common multiples of 4, 5 and 6 are the multiples of their LCM, ${srL}.</p>
                <div class="ca-formula">\[ \text{dividend} - \text{remainder} = \text{common multiple} \]
                   \[ \text{so} \quad \text{dividend} = \text{LCM}\times k + \text{remainder} \]</div>
                <p>Here the numbers are \(${srL}k+1\): ${srSols.join(', ')}, … The smallest one greater than 1 is ${srSols[1]};
                   the ones between 100 and 200 are ${srSols.filter(v => v > 100 && v < 200).join(' and ')}.</p>
                <div class="ca-warn"><strong>Use the LCM, not the product.</strong> \(4\times5\times6=120\), but the LCM is ${srL}.
                   The product gives <em>a</em> solution, but you would miss ${srSols[1]}.</div>
                <div class="ca-tip">The shared remainder itself (here 1) also fits, with \(k=0\) — nothing is grouped at all.
                   That is why questions usually say “more than …”.</div>`,
            },
            {
                h: 'Same “complement”',
                html: R`
                <p>A number leaves remainder 3 when divided by 4, remainder 4 when divided by 5 and remainder 5 when
                   divided by 6. The remainders are different — but look at <strong>divisor − remainder</strong>:</p>
                <table>
                    <tr><th>divisor</th><td>4</td><td>5</td><td>6</td></tr>
                    <tr><th>remainder</th><td>3</td><td>4</td><td>5</td></tr>
                    <tr><th>divisor − remainder</th><td>1</td><td>1</td><td>1</td></tr>
                </table>
                <p>The book calls this difference the <strong>“complement”</strong>: how many more would make another full group.
                   Here every complement is 1, so with <em>1 more</em> the number would divide exactly by 4, 5 and 6.</p>
                <div class="ca-formula">\[ \text{dividend} + \text{complement} = \text{common multiple} \]
                   \[ \text{so} \quad \text{dividend} = \text{LCM}\times k - \text{complement} \]</div>
                <p>So the number is \(${srL}k-1\): ${scSols.join(', ')}, … Another one: remainder 3 on division by 5 and remainder 5
                   on division by 7. The complements are \(5-3=2\) and \(7-5=2\), so the smallest number is \(35-2=${sc2}\).</p>
                <div class="ca-tip"><strong>Stories often give the complement directly.</strong> “In rows of 6, the last row has
                   2 empty places” means the complement for 6 is 2 (the remainder is 4).</div>
                <div class="ca-key"><strong>Check both shortcuts first.</strong> Before anything else, write down the remainders
                   and the complements. If either row is all the same, you are done in one line.</div>`,
            },
            {
                h: 'Step-by-step satisfaction',
                html: R`
                <p>Most problems have neither shortcut. Sun Zi’s own problem: a number leaves remainder 2 when divided by 3,
                   remainder 3 when divided by 5, and remainder 2 when divided by 7. Then satisfy the conditions one at a time:</p>
                <ol>
                    <li><strong>List</strong> all the numbers that satisfy one condition — usually the one with the
                        <strong>greatest divisor</strong>, because its list is the shortest.</li>
                    <li><strong>Select</strong> from that list the numbers that also satisfy the next condition.</li>
                    <li>Repeat with each remaining condition until all are satisfied.</li>
                </ol>
                <ul>
                    <li>Remainder 2 on division by 7: ${bold(listOf(SUNZI[2], 40), sunzi)}, …</li>
                    <li>Select those with remainder 3 on division by 5: 23 (next 58, …).</li>
                    <li>Select those with remainder 2 on division by 3: 23 leaves \(23=3\times7+2\). ✓</li>
                </ul>
                <p>So the answer is <strong>${sunzi}</strong>. Written as one line: ${sunziSteps.text}</p>
                <p>Here is one with more work: remainder 1 on division by 4, remainder 2 on division by 5 and remainder 4 on division
                   by 7. ${t4.text} So the answer is ${t4.x}.</p>
                <div class="ca-key"><strong>Why you may jump.</strong> Once a number satisfies the 7-condition, adding 7 keeps it
                   satisfied. Once it satisfies both the 7- and the 5-condition, adding \(\text{LCM}(5,7)=35\) keeps both. So each
                   stage keeps what you have won and only tests the new condition.</div>`,
            },
            {
                h: 'All the solutions: ranges and counting',
                html: R`
                <p>Sun Zi’s problem does not have just one answer. Once you have ${sunzi}, add \(\text{LCM}(3,5,7)=${sunziGap}\):
                   no remainder changes. So</p>
                <div class="ca-formula">${sunzi}, &nbsp; ${sunzi + sunziGap}, &nbsp; ${sunzi + 2 * sunziGap}, &nbsp; ${sunzi + 3 * sunziGap}, &nbsp; … &nbsp; all work, and nothing in between does.</div>
                <div class="ca-key"><strong>Whatever the method, the solutions are (smallest one) + (a multiple of the LCM).</strong>
                   Questions then ask you to pick:
                   <ul>
                       <li><strong>the one in a range</strong> — “between 1000 and 1100 soldiers”;</li>
                       <li><strong>the largest (or smallest) three-digit one</strong>;</li>
                       <li><strong>how many there are</strong> below a number or between two numbers — list them and count.</li>
                   </ul></div>
                <p>The three-digit solutions of Sun Zi’s problem are
                   ${allUpTo(SUNZI, 999).filter(v => v >= 100).join(', ')}: ${allUpTo(SUNZI, 999).filter(v => v >= 100).length} of them.</p>
                <p>This is how, in the old story, General <strong>Han Xin</strong> counted his army without counting it: the
                   soldiers lined up in rows of 3, then 5, then 7; he looked only at the soldiers left over each time and, knowing
                   roughly how big his army was, worked out the exact number.</p>`,
            },
            {
                h: 'Extra: the classical recipe 70, 21, 15',
                html: R`
                <p>For the divisors 3, 5 and 7 there is an old recipe with three <strong>building blocks</strong>:</p>
                <table>
                    <tr><th>Block</th><th>It is a multiple of…</th><th>…and leaves remainder 1 on division by</th></tr>
                    <tr><td>${B357[0]}</td><td>5 and 7</td><td>3</td></tr>
                    <tr><td>${B357[1]}</td><td>3 and 7</td><td>5</td></tr>
                    <tr><td>${B357[2]}</td><td>3 and 5</td><td>7</td></tr>
                </table>
                <p>Multiply each block by the remainder you want and add. For remainders 2, 3 and 2:</p>
                <div class="ca-formula">\(${B357[0]}\times2+${B357[1]}\times3+${B357[2]}\times2=${sunziSum}\), &nbsp; and &nbsp; \(${sunziSum}-${sunziGap}\times${(sunziSum - sunzi) / sunziGap}=${sunzi}\)</div>
                <p><strong>Why it works.</strong> On division by 3, the blocks ${B357[1]} and ${B357[2]} add nothing (they are multiples
                   of 3) and \(${B357[0]}\times2\) leaves 2. The same happens for 5 and for 7. Finally take away ${sunziGap} as often as you can.</p>`,
            },
            {
                h: 'Extra: when the divisors share a factor',
                html: R`
                <p><strong>There may be no solution.</strong> Can a number leave remainder ${NOPE[0][1]} on division by
                   ${NOPE[0][0]} and remainder ${NOPE[1][1]} on division by ${NOPE[1][0]}? The first condition says the number is
                   odd; the second says it is even. Impossible.</p>
                <div class="ca-key"><strong>The test.</strong> If both divisors are multiples of \(g\), the two remainders must
                   leave the <em>same</em> remainder when divided by \(g\). If they do not, no number fits.</div>
                <p><strong>If there is a solution, the solutions repeat every LCM.</strong> Remainder ${YES[0][1]} on division by
                   ${YES[0][0]} and ${YES[1][1]} on division by ${YES[1][0]}: ${steps(YES).text} The solutions are
                   ${yes}, ${yes + yesGap}, ${yes + 2 * yesGap}, … in steps of ${yesGap}, not ${YES[0][0] * YES[1][0]}.
                   (Spot the shortcut? Both complements are 1.)</p>`,
            },
        ],

        // Mirrors the textbook's own summary page for this lesson.
        summary: [
            {
                topic: 'Same remainder',
                points: [
                    R`Different divisors divide a dividend and leave the same remainder: dividend − remainder = a common multiple of these divisors.`,
                    R`So \(\text{dividend} = \text{LCM}\times k + \text{remainder}\).`,
                ],
            },
            {
                topic: 'Same “complement”',
                points: [
                    R`The differences between each divisor and its remainder are equal; call this difference the “complement”.`,
                    R`Different divisors divide a dividend and leave the same “complement”: dividend + complement = a common multiple of these divisors, so \(\text{dividend} = \text{LCM}\times k - \text{complement}\).`,
                ],
            },
            {
                topic: 'Step-by-step satisfaction',
                points: [
                    R`List all possible solutions to one condition (usually starting with the greater divisor), then select the final solutions by adding the other conditions.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Same remainder',
                q: 'A crate holds more than 100 but fewer than 150 apples. Packed 4, 5 or 6 to a box, there is always 1 apple left over. How many apples are in the crate?',
                steps: [
                    'The remainder is 1 every time, so (number of apples − 1) is a common multiple of 4, 5 and 6.',
                    R`The LCM of 4, 5 and 6 is ${srL}, so the number is \(${srL}k+1\): ${allUpTo(EX1, 250).join(', ')}, …`,
                    `Only ${ex1Sols[0]} is between 100 and 150.`,
                ],
                answer: `${ex1Sols[0]} apples`,
            },
            {
                title: 'Same “complement”',
                q: 'There are between 100 and 200 students. In rows of 6, 4 are left over; in rows of 8, 6 are left over; in rows of 9, 7 are left over. How many students are there?',
                steps: [
                    R`The remainders differ, but the complements do not: \(6-4=2\), \(8-6=2\), \(9-7=2\).`,
                    `So (number of students + 2) is a common multiple of 6, 8 and 9, whose LCM is ${ex2L}.`,
                    R`The number is \(${ex2L}k-2\): ${ex2All.join(', ')}, …`,
                    `Only ${ex2Sols[0]} is between 100 and 200.`,
                ],
                answer: `${ex2Sols[0]} students`,
            },
            {
                title: 'Step by step: two conditions',
                q: `A number leaves a remainder of ${EX3[0][1]} when divided by ${EX3[0][0]} and a remainder of ${EX3[1][1]} when divided by ${EX3[1][0]}. What is the smallest such number?`,
                steps: [
                    `Remainders ${EX3[0][1]} and ${EX3[1][1]}, complements ${EX3[0][0] - EX3[0][1]} and ${EX3[1][0] - EX3[1][1]}: no shortcut.`,
                    `List the solutions of the condition with the greater divisor, ${EX3[1][0]}: ${listOf(EX3[1], ex3 + 14).join(', ')}, …`,
                    `Select the first with remainder ${EX3[0][1]} on division by ${EX3[0][0]}: ${listOf(EX3[1], ex3).map(v => `${v} leaves ${v % EX3[0][0]}`).join(', ')}.`,
                    R`So the number is ${ex3}. Check: \(${ex3}=${EX3[0][0]}\times${Math.floor(ex3 / EX3[0][0])}+${EX3[0][1]}\) and \(${ex3}=${EX3[1][0]}\times${Math.floor(ex3 / EX3[1][0])}+${EX3[1][1]}\).`,
                ],
                answer: `${ex3}`,
            },
            {
                title: 'Han Xin counts his soldiers',
                q: 'Han Xin has more than 1000 but fewer than 1100 soldiers. In rows of 3, 2 are left over; in rows of 5, 3 are left over; in rows of 7, 2 are left over. Exactly how many soldiers are there?',
                steps: [
                    hanStep.text,
                    R`So ${hanStep.x} is the smallest solution, and the solutions repeat every \(\text{LCM}(3,5,7)=${hanStep.step}\).`,
                    R`\(${hanStep.x}+${hanStep.step}\times${(hanAns[0] - hanStep.x) / hanStep.step}=${hanAns[0]}\). The solutions on either side, ${hanAns[0] - hanStep.step} and ${hanAns[0] + hanStep.step}, are outside the range.`,
                ],
                answer: `${hanAns[0]} soldiers`,
            },
            {
                title: 'Largest three-digit solution, and how many',
                q: `Think about the three-digit numbers that leave a remainder of ${EX5[0][1]} when divided by ${EX5[0][0]} and a remainder of ${EX5[1][1]} when divided by ${EX5[1][0]}. (a) Which is the largest? (b) How many are there?`,
                steps: [
                    ex5.text,
                    `The solutions go up in ${ex5.step}s (the LCM of ${EX5[0][0]} and ${EX5[1][0]}): ${ex5.x}, ${ex5.x + ex5.step}, ${ex5.x + 2 * ex5.step}, …`,
                    R`(a) \(${ex5.x}+${ex5.step}\times${(ex5Top - ex5.x) / ex5.step}=${ex5Top}\); one more step gives ${ex5Top + ex5.step}, which has four digits.`,
                    R`(b) The first three-digit one is ${ex5First}. From ${ex5First} to ${ex5Top} in steps of ${ex5.step}: \((${ex5Top}-${ex5First})\div${ex5.step}+1=${ex5Count}\).`,
                ],
                answer: `(a) ${ex5Top} &nbsp; (b) ${ex5Count}`,
            },
            {
                title: 'A shortcut, then step by step',
                q: 'Counting the eggs in a basket 2, 3, 4, 5 or 6 at a time always leaves 1 egg over. Counting them 7 at a time leaves none. What is the smallest possible number of eggs?',
                steps: [
                    `Same remainder for 2, 3, 4, 5 and 6: (eggs − 1) is a common multiple, and the LCM is ${eggL}.`,
                    `So list the solutions of those five conditions: ${eggList.join(', ')}, …`,
                    `Select by the last condition: ` + eggList.map(v => `${v} leaves ${v % 7}`).join(', ') + ' on division by 7.',
                    `The first multiple of 7 is ${eggAns}.`,
                ],
                answer: `${eggAns} eggs`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'same-remainder', name: 'Same remainder: the smallest', level: 1,
                gen(rng) {
                    const { ds, k: r, conds, L } = patterned(rng, SAME_SETS, 'rem'), mx = Math.max(...ds);
                    const x = search(conds, mx + 1);
                    must(x === L + r, 'same-remainder');
                    const s = rng.pick(STORIES), usePlain = rng.bool(0.35);
                    const q = usePlain
                        ? `What is the smallest whole number greater than ${mx} that leaves a remainder of ${r} when divided by each of ${and(ds)}?`
                        : `${s.intro} ${conds.map(([d, rr]) => s.cl(d, rr)).join(' ')} There are more than ${mx} ${s.thing}. What is the smallest possible number of ${s.thing}?`;
                    return prob(q, CA.num(x), R`${remHead(ds, r, L)} The smallest one greater than ${mx}: ${m(`${L}+${r}=${x}`)}.`, { conds, kind: 'greater', N: mx });
                },
            },
            {
                id: 'same-complement', name: 'Same “complement”: the smallest', level: 1,
                gen(rng) {
                    const { ds, k: c, conds, L } = patterned(rng, SAME_SETS, 'comp');
                    const x = search(conds);
                    must(x === L - c, 'same-complement');
                    const v = rng.int(0, 2), s = rng.pick(STORIES);
                    const q = v === 0 ? `A positive whole number ${plain(conds)}. What is the smallest such number?`
                        : v === 1 ? `${s.intro} ${conds.map(([d, rr]) => s.cl(d, rr)).join(' ')} What is the smallest possible number of ${s.thing}?`
                            : `${s.intro} ${ds.map(d => s.short(d, c)).join(' ')} What is the smallest possible number of ${s.thing}?`;
                    return prob(q, CA.num(x), R`${compHead(ds, c, L)} The smallest is ${m(`${L}-${c}=${x}`)}.`, { conds, kind: 'smallest' });
                },
            },
            {
                id: 'spot-pattern', name: 'Which is a common multiple?', level: 1,
                gen(rng) {
                    for (;;) {
                        const pattern = rng.pick(['rem', 'comp']), { ds, k, conds } = patterned(rng, SAME_SETS, pattern);
                        const right = pattern === 'rem' ? -k : k;
                        const sols = allUpTo(conds, 3 * lcmAll(ds) + 1).filter(v => v + right >= 0);
                        const isCM = off => sols.every(v => ds.every(d => (v + off) % d === 0));
                        must(isCM(right), 'spot-pattern');
                        const r0 = conds[0][1];
                        const offs = [...new Set([-right, right + 1, right - 1, pattern === 'rem' ? ds[0] - r0 : r0, pattern === 'rem' ? -(ds[0] - r0) : -r0])]
                            .filter(o => o !== right && o !== 0 && !isCM(o));
                        if (offs.length < 3) continue;
                        const show = o => (o < 0 ? R`\(n-${-o}\)` : R`\(n+${o}\)`);
                        return prob(`Call a whole number \\(n\\). It ${plain(conds)}. Which of these must be a common multiple of ${and(ds)}?`,
                            CA.mc(rng, show(right), rng.shuffle(offs).slice(0, 3).map(show)),
                            pattern === 'rem'
                                ? R`The remainder is ${k} every time, so taking ${k} away makes every division exact: ${m(`n-${k}`)} is a common multiple.`
                                : R`The “complement” (divisor − remainder) is ${ds.map(d => `${d} − ${d - k}`).join(' = ')} = ${k} every time, so ${k} more makes every division exact: ${m(`n+${k}`)} is a common multiple.`,
                            { conds, kind: 'spot', right });
                    }
                },
            },
            {
                id: 'list-select', name: 'Step by step: list and select', level: 1,
                gen(rng) {
                    for (;;) {
                        const [a, b] = coprimePair(rng, 2, 8), conds = [[a, rng.int(1, a - 1)], [b, rng.int(1, b - 1)]];
                        if (sameRem(conds) || sameComp(conds)) continue;
                        const x = search(conds);
                        if (x <= b || x > 45) continue;
                        const st = story(rng, conds, 0.5);
                        return prob(`${st.text} ${askSmallest(st)}`, CA.num(x),
                            `Start with the greater divisor. Remainder ${conds[1][1]} on division by ${b}: ${bold(listOf(conds[1], x), x)}. Select the first that leaves remainder ${conds[0][1]} on division by ${a}: ${x}.`,
                            { conds, kind: 'smallest' });
                    }
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'same-remainder-range', name: 'Same remainder: ranges and counting', level: 2,
                gen(rng) {
                    const { ds, k: r, conds, L } = patterned(rng, SAME_SETS, 'rem');
                    must(gap(conds) === L && allUpTo(conds, 3000).every(v => (v - r) % L === 0), 'same-remainder-range');
                    const st = story(rng, conds, 0.3), a = rangeAsk(rng, conds, st, ['one', 'one', 'count', 'below', 'largest3', 'smallest3']);
                    return prob(a.q, CA.num(a.x), `${remHead(ds, r, L)} ${a.tail}`, { conds, ...a.chk });
                },
            },
            {
                id: 'same-complement-range', name: 'Same “complement”: ranges and counting', level: 2,
                gen(rng) {
                    const { ds, k: c, conds, L } = patterned(rng, SAME_SETS, 'comp');
                    must(gap(conds) === L && allUpTo(conds, 3000).every(v => (v + c) % L === 0), 'same-complement-range');
                    let st = story(rng, conds, 0.3);
                    if (st.thing && rng.bool(0.4)) { const s = STORIES.find(t => t.thing === st.thing); st = { thing: st.thing, text: `${s.intro} ${ds.map(d => s.short(d, c)).join(' ')}` }; }
                    const a = rangeAsk(rng, conds, st, ['one', 'one', 'count', 'below', 'largest3', 'smallest3', 'greater']);
                    return prob(a.q, CA.num(a.x), `${compHead(ds, c, L)} ${a.tail}`, { conds, ...a.chk });
                },
            },
            {
                id: 'step-two', name: 'Step by step: two conditions', level: 2,
                gen(rng) {
                    const ds = coprimePair(rng, 5, 13), conds = mixed(rng, ds), st = story(rng, conds, 0.25), w = steps(conds), x = search(conds);
                    must(w.x === x, 'step-two');
                    return prob(`${st.text} ${askSmallest(st)}`, CA.num(x), w.text, { conds, kind: 'smallest' });
                },
            },
            {
                id: 'step-three', name: 'Step by step: three conditions', level: 2,
                gen(rng) {
                    const conds = mixed(rng, rng.pick(TRIPLES), 0.2), st = story(rng, conds, 0.3), w = steps(conds), x = search(conds);
                    must(w.x === x, 'step-three');
                    return prob(`${st.text} ${askSmallest(st)}`, CA.num(x), w.text, { conds, kind: 'smallest' });
                },
            },
            {
                id: 'step-range', name: 'Step by step: ranges and counting', level: 2,
                gen(rng) {
                    const ds = rng.bool(0.6) ? coprimePair(rng, 3, 11) : rng.pick(TRIPLES.filter(t => lcmAll(t) <= 120));
                    const conds = mixed(rng, ds), w = steps(conds), L = gap(conds);
                    must(w.x === search(conds) && L === lcmAll(ds), 'step-range');
                    const st = story(rng, conds, 0.3), a = rangeAsk(rng, conds, st, ['one', 'count', 'below', 'largest3', 'smallest3', 'greater']);
                    return prob(a.q, CA.num(a.x), `${w.text} The solutions repeat every ${L} (the LCM). ${a.tail}`, { conds, ...a.chk });
                },
            },
            {
                id: 'shortcut-then-step', name: 'A shortcut, then step by step', level: 2,
                gen(rng) {
                    for (;;) {
                        const pair = rng.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [4, 6], [5, 6], [3, 8], [4, 9], [2, 3, 4], [3, 4, 6], [2, 3, 5]]);
                        const c = rng.pick([5, 7, 9, 11, 13].filter(d => pair.every(e => CA.gcd(d, e) === 1)));
                        const pattern = rng.pick(['rem', 'comp']), k = rng.int(1, Math.min(...pair) - 1);
                        const first = pair.map(d => [d, pattern === 'rem' ? k : d - k]);
                        if (pattern === 'comp' && sameRem(first)) continue;
                        const last = [c, rng.int(0, c - 1)], conds = [...first, last];
                        if (sameRem(conds) || sameComp(conds)) continue;
                        const L = lcmAll(pair), x = search(conds);
                        if (x <= L) continue;
                        const list = []; for (let n = pattern === 'rem' ? k : L - k; n <= x; n += L) list.push(n);
                        must(list[list.length - 1] === x && list.slice(0, -1).every(v => v % c !== last[1]) && list.every(v => fits(v, first)), 'shortcut-then-step');
                        const st = story(rng, conds, 0.3);
                        const head = pattern === 'rem' ? remHead(pair, k, L) : compHead(pair, k, L);
                        return prob(`${st.text} ${askSmallest(st)}`, CA.num(x),
                            `Look at the first ${pair.length === 2 ? 'two' : 'three'} conditions. ${head} List them: ${fmt(list.slice(0, -1).concat([x]), [x], false, false)}. Select by the last condition: ${list.map(v => `${v} leaves ${v % c}`).join(', ')} on division by ${c}, so the answer is ${x}.`,
                            { conds, kind: 'smallest' });
                    }
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'han-xin', name: 'Han Xin counts his soldiers', level: 3,
                gen(rng) {
                    for (;;) {
                        const ds = rng.pick(BIG_TRIPLES), conds = mixed(rng, ds, 0.15), w = steps(conds), L = gap(conds);
                        const y = search(conds) + L * rng.int(1, Math.max(1, Math.floor(1900 / L))), lo = Math.floor(y / 100) * 100, hi = lo + 100;
                        if (y === lo || y < 150) continue;
                        const found = []; for (let n = lo + 1; n < hi; n++) if (fits(n, conds)) found.push(n);
                        if (found.length !== 1 || w.x !== search(conds)) continue;
                        const s = rng.pick(STORIES), k = (found[0] - w.x) / L;
                        return prob(`${s.intro} ${conds.map(([d, r]) => s.cl(d, r)).join(' ')} There are more than ${lo} but fewer than ${hi} ${s.thing}. Exactly how many ${s.thing} are there?`,
                            CA.num(found[0], s.thing),
                            R`${w.text} The solutions repeat every ${L} (the LCM of ${and(ds)}): ${m(`${w.x}+${L}\\times${k}=${found[0]}`)} is the only one between ${lo} and ${hi}.`,
                            { conds, kind: 'one', lo, hi });
                    }
                },
            },
            {
                id: 'over-and-short', name: 'Some left over, some short', level: 3,
                gen(rng) {
                    for (;;) {
                        const ds = rng.pick(TRIPLES.filter(t => t[0] > 2)), conds = mixed(rng, ds);
                        const asShort = conds.map(([d, r]) => d - r >= 1 && d - r <= 4 && rng.bool(0.55));
                        const nShort = asShort.filter(Boolean).length;
                        if (nShort < 1 || nShort > 2) continue;
                        const usePlain = rng.bool(0.25), s = rng.pick(STORIES);
                        const text = usePlain
                            ? 'A positive whole number ' + and(conds.map(([d, r], i) => (asShort[i] ? `is ${d - r} less than a multiple of ${d}` : `leaves a remainder of ${r} when divided by ${d}`))) + '.'
                            : s.intro + ' ' + conds.map(([d, r], i) => (asShort[i] ? s.short(d, d - r) : s.cl(d, r))).join(' ');
                        const w = steps(conds), x = search(conds);
                        must(w.x === x, 'over-and-short');
                        const turn = conds.filter((_, i) => asShort[i]).map(([d, r]) => `a “complement” of ${d - r} for ${d} means remainder ${d} − ${d - r} = ${r}`).join('; ');
                        return prob(`${text} ${usePlain ? 'What is the smallest such number?' : `What is the smallest possible number of ${s.thing}?`}`, CA.num(x),
                            `Turn each complement into a remainder: ${turn}. ${w.text}`, { conds, kind: 'smallest' });
                    }
                },
            },
            {
                id: 'shared-factor', name: 'Divisors that share a factor', level: 3,
                gen(rng) {
                    for (;;) {
                        const ds = rng.pick(SHARED).slice();
                        if (rng.bool(0.3)) { const extra = rng.pick([5, 7, 11]); if (ds.every(d => CA.gcd(d, extra) === 1)) ds.push(extra); }
                        const n0 = rng.int(10, 400), conds = ds.map(d => [d, n0 % d]);
                        if (conds.some(c => c[1] === 0) || sameRem(conds) || sameComp(conds)) continue;
                        const x = search(conds), L = gap(conds), w = steps(conds);
                        if (x <= Math.max(...ds) || w.x !== x) continue;
                        const second = rng.bool(0.5), y = second ? search(conds, x + 1) : x;
                        must(L === lcmAll(ds), 'shared-factor');
                        const st = second ? { text: `A positive whole number ${plain(conds)}.`, thing: null } : story(rng, conds, 0.4);
                        return prob(`${st.text} ${second ? 'What is the second smallest such number?' : askSmallest(st)}`, CA.num(y),
                            `${w.text}` + (second ? ` The solutions repeat every ${L} — the LCM of ${and(ds)}, not their product ${ds.reduce((a, b) => a * b, 1)} — so the second smallest is ${x} + ${L} = ${y}.`
                                : ` (The solutions then repeat every ${L}, the LCM of ${and(ds)}.)`),
                            { conds, kind: second ? 'second' : 'smallest' });
                    }
                },
            },
            {
                id: 'exists-or-not', name: 'Is there such a number?', level: 3,
                gen(rng) {
                    const say = c => `remainder ${c[0][1]} when divided by ${c[0][0]}, and remainder ${c[1][1]} when divided by ${c[1][0]}`;
                    const pair = want => {
                        for (;;) {
                            const [a, b] = rng.pick(SHARED), c = [[a, rng.int(1, a - 1)], [b, rng.int(1, b - 1)]];
                            if (c[0][1] === c[1][1]) continue;
                            if ((search(c) !== null) === want) return c;
                        }
                    };
                    const why = c => { const g = CA.gcd(c[0][0], c[1][0]); return `${c[0][0]} and ${c[1][0]} are both multiples of ${g}. Remainder ${c[0][1]} on division by ${c[0][0]} means remainder ${c[0][1] % g} on division by ${g}, but remainder ${c[1][1]} on division by ${c[1][0]} means remainder ${c[1][1] % g} on division by ${g}. Both cannot be true.`; };
                    if (rng.bool(0.5)) {
                        let bad, good, texts;
                        do {
                            bad = pair(false); good = [pair(true), pair(true), mixed(rng, coprimePair(rng, 4, 11))];
                            texts = good.map(say);
                        } while (new Set([say(bad), ...texts]).size < 4);
                        return prob('Exactly one of these descriptions fits no whole number at all. Which one?',
                            CA.mc(rng, say(bad), texts),
                            `${why(bad)} The other three are possible: their smallest solutions are ${good.map(c => search(c)).join(', ')} (in that order).`,
                            { kind: 'whichNone', bad, good });
                    }
                    const none = 'There is no such number', exists = rng.bool(0.5), c = pair(exists), x = search(c);
                    const mx = Math.max(c[0][0], c[1][0]);
                    const wrong = exists ? [none, x + c[0][0], x + c[1][0], x + gap(c)] : [search([c[0]], mx + 1), search([c[1]], mx + 1), c[0][0] * c[1][0] + c[0][1], CA.lcm(c[0][0], c[1][0]) + c[1][1]];
                    return prob(`A positive whole number leaves ${say(c)}. What is the smallest such number?`,
                        CA.mc(rng, exists ? String(x) : none, wrong.map(String)),
                        exists ? `${steps(c).text} (It exists because both remainders leave ${c[0][1] % CA.gcd(c[0][0], c[1][0])} on division by ${CA.gcd(c[0][0], c[1][0])}, the common factor of the divisors.)` : `${why(c)} So there is no such number.`,
                        { kind: 'exists', conds: c, answer: exists ? String(x) : none });
                },
            },
            {
                id: 'building-blocks', name: 'Building blocks (70, 21, 15)', level: 3,
                gen(rng) {
                    const v = rng.int(0, 2);
                    if (v <= 1) {
                        for (;;) {
                            const [a, b, c] = rng.shuffle(rng.pick(TRIPLES)), mult = CA.lcm(a, b), r = v === 0 ? 1 : rng.int(2, Math.max(2, c - 1));
                            if (c < 3) continue;
                            let x = mult; const tried = [];
                            while (x % c !== r) { tried.push(`${x} leaves ${x % c}`); x += mult; }
                            if (!tried.length) continue;
                            must(x === search([[a, 0], [b, 0], [c, r]]), 'building-blocks');
                            const q = v === 0 ? R`Find the smallest multiple of ${m(`${a}\\times${b}=${mult}`)} that leaves a remainder of 1 when divided by ${c}.`
                                : `What is the smallest positive whole number that is a multiple of both ${a} and ${b} and leaves a remainder of ${r} when divided by ${c}?`;
                            return prob(q, CA.num(x), `List the multiples of ${mult} and select by the remainder on division by ${c}: ${tried.join(', ')}, <strong>${x}</strong> leaves ${r}.`,
                                { conds: [[a, 0], [b, 0], [c, r]], kind: 'smallest' });
                        }
                    }
                    for (;;) {
                        const ds = rng.pick([[3, 5, 7], [3, 5, 7], [3, 4, 5], [2, 3, 5], [3, 4, 7], [2, 5, 7], [4, 5, 7], [3, 5, 8]]);
                        const bl = blocksFor(ds), conds = mixed(rng, ds), rs = conds.map(c => c[1]);
                        const L = gap(conds), x = search(conds), total = bl.reduce((s, b, i) => s + b * rs[i], 0), k = (total - x) / L;
                        if (k < 1) continue;
                        must(fits(total, conds), 'building-blocks total');
                        return prob(`For the divisors ${and(ds)} the building blocks are ${and(bl)} (each is a multiple of the other two divisors and leaves remainder 1 on division by its own). Use them to find the smallest positive number that ${plain(conds)}.`,
                            CA.num(x),
                            R`${m(bl.map((b, i) => `${b}\\times${rs[i]}`).join('+') + '=' + total)}. Take away ${L} (the LCM) as often as possible: ${m(`${total}-${L}\\times${k}=${x}`)}.`,
                            { conds, kind: 'smallest' });
                    }
                },
            },
        ],

        assignment: [
            ['same-remainder', 4], ['same-complement', 4], ['spot-pattern', 3], ['list-select', 4],
            ['same-remainder-range', 4], ['same-complement-range', 4], ['step-two', 4], ['step-three', 4], ['step-range', 4], ['shortcut-then-step', 3],
            ['han-xin', 3], ['over-and-short', 3], ['shared-factor', 2], ['exists-or-not', 2], ['building-blocks', 2],
        ],
    });
})();
