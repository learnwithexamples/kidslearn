/* Challenge Academy — Lesson 6: Complicated Permutations & Combinations */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m;
    const fact = CA.fact, nPr = CA.nPr, nCr = CA.nCr;

    // ── Small helpers ────────────────────────────────────────────────────
    const Pt = (n, r) => R`{}_{${n}}P_{${r}}`;            // TeX for nPr
    const Ct = (n, r) => R`{}_{${n}}C_{${r}}`;            // TeX for nCr
    const list = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
    const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    const word = n => WORDS[n] || String(n);
    const cap = s => s.replace(/^./, c => c.toUpperCase());
    const Word = n => cap(word(n));
    const NAMES = ['Ava', 'Ben', 'Cara', 'Dan', 'Eve', 'Finn', 'Gus', 'Hana', 'Ivy', 'Jack', 'Kai', 'Lily', 'Max', 'Nina', 'Omar', 'Zoe'];

    /** A problem.  `chk` describes the count for the independent brute-force checker
     *  (tools outside the repo read it); it is non-enumerable so it never reaches a page. */
    function mk(q, ans, sol, chk, fig) {
        const o = { q, ans, sol };
        if (fig) o.fig = fig;
        Object.defineProperty(o, 'chk', { value: chk });
        return o;
    }
    const ways = v => CA.num(v, 'ways');

    /** n named people and an opening sentence that ends just before the condition. */
    function crowd(rng, n) {
        const names = rng.sample(NAMES, n).sort();
        const scene = rng.pick([
            `${Word(n)} friends — ${list(names)} — line up in a row for a photo.`,
            `${Word(n)} children — ${list(names)} — sit in a row of ${n} seats at the cinema.`,
            `${Word(n)} pupils — ${list(names)} — stand in a row on stage.`,
            `${Word(n)} cousins — ${list(names)} — sit side by side on a long bench.`,
        ]);
        return { names: rng.shuffle(names), scene };
    }

    // ── Figures ──────────────────────────────────────────────────────────
    /** An a-by-b street grid, A bottom-left, B top-right; opt.pt = [x, y] marks P, opt.path = list of 'R'/'U'. */
    function gridFig(a, b, opt = {}) {
        const s = Math.min(36, 190 / a, 130 / b), L = 24, T = 20;
        const W = L + a * s + 26, H = T + b * s + 22;
        const X = i => L + i * s, Y = j => T + (b - j) * s;
        let body = '';
        for (let i = 0; i <= a; i++) body += F.line(X(i), Y(0), X(i), Y(b), { width: 1.2 });
        for (let j = 0; j <= b; j++) body += F.line(X(0), Y(j), X(a), Y(j), { width: 1.2 });
        if (opt.path) {
            let x = 0, y = 0;
            const pts = [[X(0), Y(0)]];
            for (const c of opt.path) { if (c === 'R') x++; else y++; pts.push([X(x), Y(y)]); }
            body += F.poly(pts, { open: true, stroke: F.colors.ACCENT, width: 3.5 });
        }
        body += F.dot(X(0), Y(0), { r: 3.5 }) + F.dot(X(a), Y(b), { r: 3.5 });
        body += F.text(X(0) - 11, Y(0) + 14, 'A', { bold: true }) + F.text(X(a) + 12, Y(b) - 5, 'B', { bold: true });
        if (opt.pt) {
            body += F.dot(X(opt.pt[0]), Y(opt.pt[1]), { r: 4.5, fill: F.colors.ACCENT });
            body += F.text(X(opt.pt[0]) + 9, Y(opt.pt[1]) - 6, 'P', { bold: true, fill: F.colors.ACCENT });
        }
        return F.svg(W, H, body, { label: 'street grid' });
    }

    /** The gap method: boxes for the people already placed, arrows for the gaps. */
    function gapFig(labels) {
        const s = 34, g = 26, T = 8, n = labels.length;
        const W = 10 + (n + 1) * g + n * s + 10;
        let body = '';
        for (let i = 0; i <= n; i++) {
            const x = 10 + i * (s + g) + g / 2;
            body += F.path(`M${x} ${T + s + 20}L${x} ${T + s - 4}M${x - 5} ${T + s + 3}L${x} ${T + s - 4}L${x + 5} ${T + s + 3}`, { stroke: F.colors.ACCENT, width: 2 });
            body += F.text(x, T + s + 34, `gap ${i + 1}`, { size: 10, fill: F.colors.ACCENT });
        }
        labels.forEach((t, i) => {
            const x = 10 + g + i * (s + g);
            body += F.rect(x, T, s, s, { fill: F.colors.FILL }) + F.text(x + s / 2, T + s / 2 + 5, t, { bold: true });
        });
        return F.svg(W, T + s + 40, body, { label: 'gaps between people' });
    }

    /** Stars and bars: counts = sweets each child gets. */
    function starsFig(counts) {
        const d = 20, T = 10;
        let x = 14, body = '';
        const mids = [];
        counts.forEach((c, i) => {
            const x0 = x;
            for (let k = 0; k < c; k++) { body += F.circle(x + 7, T + 12, 7, { fill: F.colors.SHADE }); x += d; }
            mids.push([(x0 + x - d + 14) / 2, c]);
            if (i < counts.length - 1) { body += F.line(x + 2, T - 2, x + 2, T + 26, { stroke: F.colors.ACCENT, width: 3 }); x += 12; }
        });
        mids.forEach(([mx, c], i) => { body += F.text(mx, T + 46, `child ${i + 1}: ${c}`, { size: 11 }); });
        return F.svg(x + 8, T + 54, body, { label: 'sweets separated by dividers' });
    }

    /** A bundle drawn as one block among single people. */
    function bundleFig() {
        const s = 34, g = 8, T = 6;
        let body = '', x = 8;
        const single = t => { body += F.rect(x, T + 4, s, s, { fill: F.colors.FILL }) + F.text(x + s / 2, T + s / 2 + 9, t, { bold: true }); x += s + g; };
        single('C');
        body += F.rect(x, T, 2 * s + 10, s + 8, { fill: '#fff3e6', stroke: F.colors.ACCENT, width: 2.5 });
        body += F.rect(x + 4, T + 4, s, s, { fill: F.colors.FILL }) + F.text(x + 4 + s / 2, T + s / 2 + 9, 'A', { bold: true });
        body += F.rect(x + 6 + s, T + 4, s, s, { fill: F.colors.FILL }) + F.text(x + 6 + s + s / 2, T + s / 2 + 9, 'B', { bold: true });
        x += 2 * s + 10 + g;
        single('D'); single('E'); single('F');
        return F.svg(x, T + s + 14, body, { label: 'two people tied into one block' });
    }

    /** A row of balls: pattern like 'RBRRB'. */
    function ballsFig(pattern, opt = {}) {
        const d = 34, T = 6;
        let body = '';
        pattern.split('').forEach((c, i) => {
            const red = c === 'R';
            body += F.circle(12 + i * d + 13, T + 13, 13, { fill: red ? '#ffd8c2' : F.colors.SHADE, stroke: red ? F.colors.ACCENT : F.colors.INK });
            body += F.text(12 + i * d + 13, T + 18, c, { bold: true });
            if (opt.numbers) body += F.text(12 + i * d + 13, T + 44, String(i + 1), { size: 11 });
        });
        return F.svg(24 + pattern.length * d - 8, T + (opt.numbers ? 50 : 32), body, { label: 'row of balls' });
    }

    /** Arrangements of a multiset given the size of each group of identical things, and the TeX that shows it. */
    const multi = counts => counts.reduce((t, k) => t / fact(k), fact(counts.reduce((x, y) => x + y, 0)));
    function multiTex(counts) {
        const n = counts.reduce((x, y) => x + y, 0), reps = counts.filter(k => k > 1);
        return reps.length ? R`\frac{${n}!}{${reps.map(k => `${k}!`).join(R`\times `)}}=${multi(counts)}` : `${n}!=${multi(counts)}`;
    }
    const letterCounts = w => { const c = {}; for (const ch of w) c[ch] = (c[ch] || 0) + 1; return c; };

    // ── Counting used by more than one generator ─────────────────────────
    /** k-digit numbers with different digits from the set D whose last digit is in `last` (null = any). */
    function digitCount(D, k, last) {
        const s = D.length, z = D.includes(0);
        if (!last) return z ? (s - 1) * nPr(s - 1, k - 1) : nPr(s, k);
        let t = 0;
        for (const d of last) t += (d === 0 || !z) ? nPr(s - 1, k - 1) : (s - 2) * nPr(s - 2, k - 2);
        return t;
    }
    /** Arrangements of the letters of a word, and the TeX that shows the division. */
    function wordCount(w) {
        const c = {};
        for (const ch of w) c[ch] = (c[ch] || 0) + 1;
        const rep = Object.entries(c).filter(e => e[1] > 1).sort((x, y) => (x[0] < y[0] ? -1 : 1));
        const v = rep.reduce((t, e) => t / fact(e[1]), fact(w.length));
        const tex = R`\frac{${w.length}!}{${rep.map(e => `${e[1]}!`).join(R`\times `)}}=\frac{${fact(w.length)}}{${rep.reduce((t, e) => t * fact(e[1]), 1)}}=${v}`;
        const say = list(rep.map(e => `${e[0]} appears ${e[1]} times`.replace('2 times', 'twice')));
        // The book's way: choose the positions for each set of identical letters, then arrange the rest.
        let r = w.length;
        const fs = [], vals = [], pl = [];
        rep.forEach(([ch, k], i) => { fs.push(Ct(r, k)); vals.push(nCr(r, k)); pl.push(`${k} of the ${i ? 'remaining ' : ''}${r} places for the ${ch}s`); r -= k; });
        if (r > 1) { fs.push(`${r}!`); vals.push(fact(r)); }
        const chooseTex = fs.join(R`\times `) + (vals.length > 1 ? '=' + vals.join(R`\times `) : '') + '=' + v;
        const places = list(pl) + (r > 1 ? `; the ${r} different letters left fill the last ${r} places in ${r}! ways` : r === 1 ? '; the last letter takes the last place' : '');
        return { v, tex, say, rep, chooseTex, places };
    }

    // Numbers used in the tutorial and examples (all computed, never typed).
    const EX1 = { D: [0, 1, 2, 3, 4, 5], k: 3 };
    const ex1zero = nPr(5, 2), ex1other = 4 * nPr(4, 1), ex1 = digitCount(EX1.D, EX1.k, [0, 2, 4]);
    const LETTER = wordCount('LETTER'), BANANA = wordCount('BANANA');
    const lettersNoT = multi([1, 2, 1]);                 // L, E, E, R
    const EXG = { a: 4, b: 3, p: [2, 1] };
    const exgTo = nCr(EXG.p[0] + EXG.p[1], EXG.p[0]), exgFrom = nCr(EXG.a - EXG.p[0] + EXG.b - EXG.p[1], EXG.a - EXG.p[0]);
    const exgAll = nCr(EXG.a + EXG.b, EXG.a);

    // ── Building blocks: generators that the practice list below uses or mixes ──
    const POOL = [
        // ── Level 1 ──────────────────────────────────────────────────
        {
            id: 'counting-basics', name: 'Multiply the choices; arrange in order', level: 1,
            gen(rng) {
                const t = rng.int(0, 3);
                if (t === 0) {
                    const [a, b, c] = [rng.int(3, 6), rng.int(2, 5), rng.int(2, 4)];
                    const [who, x, y, z, what] = rng.pick([
                        ['Mia has', 'T-shirts', 'pairs of shorts', 'caps', 'outfits (one T-shirt, one pair of shorts and one cap)'],
                        ['A café offers', 'starters', 'main courses', 'desserts', 'three-course meals (one starter, one main course and one dessert)'],
                        ['A toy robot kit has', 'heads', 'bodies', 'pairs of legs', 'robots (one head, one body and one pair of legs)'],
                        ['An ice-cream stall has', 'flavours', 'sauces', 'kinds of sprinkles', 'sundaes (one flavour, one sauce and one kind of sprinkles)'],
                        ['A bike shop offers', 'frame colours', 'kinds of saddle', 'kinds of bell', 'bikes (one frame colour, one saddle and one bell)'],
                    ]);
                    return mk(`${who} ${a} different ${x}, ${b} different ${y} and ${c} different ${z}. How many different ${what} are possible?`,
                        CA.num(a * b * c), R`Multiply the choices: ${m(R`${a}\times${b}\times${c}=${a * b * c}`)}.`, { t: 'prod', f: [a, b, c] });
                }
                if (t === 1) {
                    const n = rng.int(5, 9), r = rng.int(2, 4);
                    const jobs = [['a captain', 'a vice-captain'], ['a president', 'a secretary', 'a treasurer'], ['a president', 'a vice-president', 'a secretary', 'a treasurer']][r - 2];
                    const prizes = [['first and second'], ['gold, silver and bronze'], ['first, second, third and fourth']][r - 2][0];
                    const q = rng.pick([
                        `A club has ${n} members. In how many ways can it choose ${list(jobs)} (${r} different people)?`,
                        `${Word(n)} runners are in a race with no ties. In how many different ways can the ${prizes} places be filled?`,
                        `There are ${n} different books. In how many ways can ${r} of them be put in a row on a shelf?`,
                        `${Word(n)} pupils want to sit on a bench that has only ${r} seats. In how many ways can the ${r} seats be filled?`,
                    ]);
                    return mk(q, ways(nPr(n, r)), R`Order matters: ${m(R`${Pt(n, r)}=${Array.from({ length: r }, (_, i) => n - i).join(R`\times `)}=${nPr(n, r)}`)}.`, { t: 'perm', n, r });
                }
                if (t === 2) {
                    const n = rng.int(4, 7);
                    const q = rng.pick([
                        `In how many different orders can ${n} different trophies be arranged in a row on a shelf?`,
                        `In how many different orders can ${n} children stand one behind another in a single queue?`,
                        `A playlist has ${n} different songs. In how many different orders can all ${n} be played, each once?`,
                        `In how many ways can the letters of a ${n}-letter word be rearranged if all ${n} letters are different? (Count the original order too.)`,
                    ]);
                    return mk(q, ways(fact(n)), R`${m(R`${n}!=${Array.from({ length: n }, (_, i) => n - i).join(R`\times `)}=${fact(n)}`)}.`, { t: 'perm', n, r: n });
                }
                const L = rng.int(3, 6), d = rng.int(2, 3), letters = 'ABCDEF'.slice(0, L);
                if (rng.bool()) {
                    return mk(`A locker code is one of the letters ${letters.split('').join(', ')} followed by ${d} digits. Each digit can be anything from 0 to 9, and digits may repeat. How many codes are possible?`,
                        CA.num(L * 10 ** d, 'codes'), R`${m(R`${L}\times${Array(d).fill(10).join(R`\times `)}=${L * 10 ** d}`)}.`, { t: 'prod', f: [L, ...Array(d).fill(10)] });
                }
                const k = rng.int(4, 8);
                return mk(`A ${d + 1}-digit code uses only the digits 1 to ${k}. Digits may repeat. How many codes are possible?`,
                    CA.num(k ** (d + 1), 'codes'), R`Each of the ${d + 1} places has ${k} choices: ${m(R`${Array(d + 1).fill(k).join(R`\times `)}=${k ** (d + 1)}`)}.`, { t: 'prod', f: Array(d + 1).fill(k) });
            },
        },
        {
            id: 'basic-comb', name: 'Choosing a group', level: 1,
            gen(rng) {
                const n = rng.int(5, 10), r = rng.int(2, Math.min(4, n - 2));
                const q = rng.pick([
                    `A class has ${n} volunteers. In how many ways can the teacher choose ${r} of them to hand out books?`,
                    `A pizza shop has ${n} different toppings. How many different pizzas with exactly ${r} different toppings can be ordered?`,
                    `Leo has ${n} different books and may take ${r} of them on holiday. In how many ways can he choose?`,
                    `A team of ${r} is picked from ${n} players. How many different teams are possible?`,
                    `A test has ${n} questions and you must answer any ${r} of them. In how many ways can you choose which questions to answer?`,
                    `From ${n} different colours of paint, ${r} are chosen to be mixed. How many different choices of ${r} colours are there?`,
                ]);
                const top = Array.from({ length: r }, (_, i) => n - i).join(R`\times `), bot = Array.from({ length: r }, (_, i) => r - i).join(R`\times `);
                return mk(q, ways(nCr(n, r)), R`Order does not matter: ${m(R`${Ct(n, r)}=\frac{${top}}{${bot}}=${nCr(n, r)}`)}.`, { t: 'comb', n, r });
            },
        },
        {
            id: 'handshakes', name: 'Handshakes, lines and diagonals', level: 1,
            gen(rng) {
                const t = rng.int(0, 6), n = rng.int(5, 12);
                const c2 = nCr(n, 2), pair = m(R`${Ct(n, 2)}=\frac{${n}\times${n - 1}}{2}=${c2}`);
                if (t === 0) return mk(`At a party ${n} people each shake hands exactly once with every other person. How many handshakes take place?`,
                    CA.num(c2, 'handshakes'), R`Each handshake is a pair of people: ${pair}.`, { t: 'hand', kind: 'pairs', n });
                if (t === 1) return mk(`In a chess tournament ${n} players each play one game against every other player. How many games are played?`,
                    CA.num(c2, 'games'), R`Each game is a pair of players: ${pair}.`, { t: 'hand', kind: 'pairs', n });
                if (t === 2) return mk(`${Word(n)} points are marked on a circle. How many straight line segments can be drawn joining two of the points?`,
                    CA.num(c2, 'segments'), R`Each segment is a pair of points: ${pair}.`, { t: 'hand', kind: 'pairs', n });
                if (t === 3) {
                    const k = rng.int(5, 9), v = nCr(k, 3);
                    return mk(`${Word(k)} points are marked on a circle. How many triangles can be drawn with corners at three of the points?`,
                        CA.num(v, 'triangles'), R`Any 3 points on a circle make a triangle: ${m(R`${Ct(k, 3)}=\frac{${k}\times${k - 1}\times${k - 2}}{3\times2\times1}=${v}`)}.`, { t: 'hand', kind: 'triples', n: k });
                }
                if (t === 4) return mk(`How many diagonals does a convex polygon with ${n} sides have?`,
                    CA.num(c2 - n, 'diagonals'), R`There are ${pair} joins between two corners; ${n} of them are sides. ${m(`${c2}-${n}=${c2 - n}`)}.`, { t: 'hand', kind: 'diag', n });
                if (t === 5) return mk(`${Word(n)} points are drawn on a page so that no three of them lie in a straight line. How many different straight lines pass through two of the points?`,
                    CA.num(c2, 'lines'), R`Every pair of points gives a different line: ${pair}.`, { t: 'hand', kind: 'pairs', n });
                return mk(`Everyone at a meeting shook hands exactly once with everyone else. There were ${c2} handshakes. How many people were at the meeting?`,
                    CA.num(n, 'people'), R`With ${m('n')} people there are ${m(R`\frac{n(n-1)}{2}`)} handshakes, so ${m(R`n(n-1)=${2 * c2}=${n}\times${n - 1}`)} and ${m(`n=${n}`)}.`, { t: 'hand', kind: 'inverse', n, c2 });
            },
        },

        // ── Level 2 ──────────────────────────────────────────────────
        {
            id: 'special-position', name: 'Special places in a row', level: 2,
            gen(rng) {
                const n = rng.int(5, 7), { names, scene } = crowd(rng, n), [A, B] = names;
                const f = k => `${k}!`;
                const all = [
                    ['first', `${A} must be at the left end`, fact(n - 1), R`Place ${A} (1 way), then arrange the other ${n - 1}: ${m(`${f(n - 1)}=${fact(n - 1)}`)}.`],
                    ['ends', `${A} must be at one of the two ends`, 2 * fact(n - 1), R`${A} has 2 places; the other ${n - 1} people fill the rest: ${m(R`2\times${f(n - 1)}=${2 * fact(n - 1)}`)}.`],
                    ['notEnds', `${A} must not be at either end`, (n - 2) * fact(n - 1), R`${A} has ${n - 2} allowed places; then arrange the other ${n - 1}: ${m(R`${n - 2}\times${f(n - 1)}=${(n - 2) * fact(n - 1)}`)}.`],
                    ['notFirst', `${A} must not be at the left end`, (n - 1) * fact(n - 1), R`${A} has ${n - 1} allowed places; then arrange the other ${n - 1}: ${m(R`${n - 1}\times${f(n - 1)}=${(n - 1) * fact(n - 1)}`)}.`],
                    ['firstLast', `${A} must be at the left end and ${B} at the right end`, fact(n - 2), R`${A} and ${B} are fixed; arrange the other ${n - 2}: ${m(`${f(n - 2)}=${fact(n - 2)}`)}.`],
                    ['bothEnds', `${A} and ${B} must take the two end places (one at each end)`, 2 * fact(n - 2), R`${A} and ${B} take the ends in 2 ways; arrange the other ${n - 2} between them: ${m(R`2\times${f(n - 2)}=${2 * fact(n - 2)}`)}.`],
                    ['neitherEnd', `neither ${A} nor ${B} may be at an end`, (n - 2) * (n - 3) * fact(n - 2), R`${A} has ${n - 2} inside places, then ${B} has ${n - 3}; arrange the other ${n - 2}: ${m(R`${n - 2}\times${n - 3}\times${f(n - 2)}=${(n - 2) * (n - 3) * fact(n - 2)}`)}.`],
                ];
                if (n % 2) all.push(['middle', `${A} must be exactly in the middle`, fact(n - 1), R`${A} has 1 place; arrange the other ${n - 1}: ${m(`${f(n - 1)}=${fact(n - 1)}`)}.`]);
                const [cond, text, v, sol] = rng.pick(all);
                return mk(`${scene} In how many ways can they be arranged if ${text}?`, ways(v), sol, { t: 'row', n, cond });
            },
        },
        {
            id: 'digit-numbers', name: 'Numbers from digits', level: 2,
            gen(rng) {
                const D = rng.pick([[0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], [0, 2, 3, 5, 7], [0, 1, 3, 5, 6, 8], [0, 1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 7], [0, 4, 5, 6, 7, 9]]);
                const s = D.length, z = D.includes(0), k = rng.pick(s >= 6 ? [3, 4] : [3, 3, 4]);
                const kinds = ['even', 'odd'];
                if (z) kinds.push('any', 'any');
                if (D.includes(5)) kinds.push('five');
                const kind = rng.pick(kinds);
                const last = kind === 'any' ? null : D.filter(d => (kind === 'even' ? d % 2 === 0 : kind === 'odd' ? d % 2 === 1 : d % 5 === 0));
                const v = digitCount(D, k, last);
                const what = { any: `${k}-digit numbers`, even: `<strong>even</strong> ${k}-digit numbers`, odd: `<strong>odd</strong> ${k}-digit numbers`, five: `${k}-digit <strong>multiples of 5</strong>` }[kind];
                const q = `How many ${what} can be made from the digits ${list(D.map(String))} if no digit may be used more than once in a number?`;
                let sol;
                if (kind === 'any') {
                    sol = R`The first digit cannot be 0: ${s - 1} ways. The other ${k - 1} places take any of the ${s - 1} digits left, in order: ${m(R`${s - 1}\times${Pt(s - 1, k - 1)}=${s - 1}\times${nPr(s - 1, k - 1)}=${v}`)}.`;
                } else if (!z) {
                    sol = R`Last digit first: it must be ${list(last.map(String)).replace(' and ', ' or ')} (${last.length} way${last.length > 1 ? 's' : ''}). The other ${k - 1} places take any of the ${s - 1} digits left, in order: ${m(R`${last.length}\times${Pt(s - 1, k - 1)}=${last.length}\times${nPr(s - 1, k - 1)}=${v}`)}.`;
                } else {
                    const nz = last.filter(d => d !== 0), parts = [], nums = [];
                    const mid = k > 2 ? R`\times${Pt(s - 2, k - 2)}` : '';
                    if (last.includes(0)) { parts.push(R`Ends in 0: the other ${k - 1} places take any of the other ${s - 1} digits, ${m(R`${Pt(s - 1, k - 1)}=${nPr(s - 1, k - 1)}`)}.`); nums.push(nPr(s - 1, k - 1)); }
                    if (nz.length) {
                        const each = (s - 2) * nPr(s - 2, k - 2);
                        parts.push(R`Ends in ${list(nz.map(String)).replace(' and ', ' or ')} (${nz.length} way${nz.length > 1 ? 's' : ''}): the first digit is not 0 and not the last digit, ${s - 2} ways; then fill the middle: ${m(R`${nz.length}\times${s - 2}${mid}=${nz.length * each}`)}.`);
                        nums.push(nz.length * each);
                    }
                    sol = parts.join(' ') + (nums.length > 1 ? R` Total ${m(`${nums.join('+')}=${v}`)}.` : '');
                }
                return mk(q, CA.num(v, 'numbers'), sol, { t: 'digits', D, k, kind });
            },
        },
        {
            id: 'bundling', name: 'Must stand together (bind)', level: 2,
            gen(rng) {
                const t = rng.int(0, 3);
                if (t <= 1) {
                    const k = t + 2, n = rng.int(5, 7), { names, scene } = crowd(rng, n);
                    const pals = names.slice(0, k);
                    const v = fact(n - k + 1) * fact(k);
                    const text = k === 2 ? `${pals[0]} and ${pals[1]} must be next to each other` : `${list(pals)} must all be together (three in a row, in any order)`;
                    return mk(`${scene} In how many ways can they be arranged if ${text}?`, ways(v),
                        R`Bind the ${k} into one thing: ${n - k + 1} things to arrange, and ${k}! orders inside the bound group. ${m(R`${n - k + 1}!\times${k}!=${fact(n - k + 1)}\times${fact(k)}=${v}`)}.`,
                        { t: 'groups', n, sizes: [k] });
                }
                const [x, y, where, ex1, exs] = rng.pick([
                    ['maths books', 'story books', 'placed in a row on a shelf', 'dictionary', 'dictionaries'],
                    ['red cars', 'blue cars', 'parked in a row', 'white van', 'white vans'],
                    ['photos of cats', 'photos of dogs', 'hung in a row on a wall', 'painting', 'paintings'],
                    ['science books', 'comics', 'placed in a row on a shelf', 'atlas', 'atlases'],
                ]);
                if (t === 2) {
                    const a = rng.int(2, 4), b = rng.int(2, 8 - a - 1);
                    const v = fact(a) * fact(b + 1);
                    return mk(`${Word(a)} different ${x} and ${word(b)} different ${y} are ${where}. In how many ways can this be done if all the ${x} must be next to each other?`, ways(v),
                        R`Bind the ${a} ${x} into one thing: with the ${b} ${y} that makes ${b + 1} things, and the bound group has ${a}! inside orders. ${m(R`${b + 1}!\times${a}!=${fact(b + 1)}\times${fact(a)}=${v}`)}.`,
                        { t: 'groups', n: a + b, sizes: [a] });
                }
                const a = rng.int(2, 4), b = rng.int(2, 4), c = rng.int(0, 8 - a - b > 2 ? 2 : Math.max(0, 8 - a - b));
                const v = fact(c + 2) * fact(a) * fact(b);
                const extra = c ? (c > 1 ? ` and two different ${exs}` : ` and one ${ex1}`) : '';
                const things = c ? `${c + 2} things (two bound groups and ${c > 1 ? `2 ${exs}` : `the ${ex1}`})` : 'the 2 bound groups';
                return mk(`${Word(a)} different ${x}${c ? ',' : ' and'} ${word(b)} different ${y}${extra} are ${where}. In how many ways can this be done if all the ${x} must be together and all the ${y} must be together?`, ways(v),
                    R`Bind the ${x} into one thing and the ${y} into another. Arrange ${things}: ${c + 2}!. Inside the bound groups: ${a}! and ${b}!. ${m(R`${c + 2}!\times${a}!\times${b}!=${fact(c + 2)}\times${fact(a)}\times${fact(b)}=${v}`)}.`,
                    { t: 'groups', n: a + b + c, sizes: [a, b] });
            },
        },
        {
            id: 'gaps', name: 'Must be apart (insert)', level: 2,
            gen(rng) {
                const t = rng.int(0, 4);
                if (t === 0) {
                    const n = rng.int(5, 7), { names, scene } = crowd(rng, n);
                    const v = fact(n) - 2 * fact(n - 1);
                    return mk(`${scene} In how many ways can they be arranged if ${names[0]} and ${names[1]} must <strong>not</strong> be next to each other?`, ways(v),
                        R`All arrangements minus those with the two together: ${m(R`${n}!-2\times${n - 1}!=${fact(n)}-${2 * fact(n - 1)}=${v}`)}. (Inserting gives the same: ${m(R`${n - 2}!\times${Pt(n - 1, 2)}=${fact(n - 2)}\times${nPr(n - 1, 2)}`)}.)`,
                        { t: 'apart', n, k: 2 });
                }
                if (t === 1) {
                    const n = rng.int(5, 7), { names, scene } = crowd(rng, n);
                    const v = fact(n - 3) * nPr(n - 2, 3);
                    return mk(`${scene} In how many ways can they be arranged if no two of ${list(names.slice(0, 3))} are next to each other?`, ways(v),
                        R`Arrange the other ${n - 3} first: ${n - 3}!. They make ${n - 2} intervals; insert the three into different intervals, in order: ${m(R`${n - 3}!\times${Pt(n - 2, 3)}=${fact(n - 3)}\times${nPr(n - 2, 3)}=${v}`)}.`,
                        { t: 'apart', n, k: 3 });
                }
                if (t === 4) {
                    const [b, g] = rng.pick([[3, 3], [4, 4], [4, 3], [3, 2], [5, 4]]);
                    const v = (b === g ? 2 : 1) * fact(b) * fact(g);
                    return mk(`${Word(b)} boys and ${word(g)} girls stand in a row so that boys and girls alternate (no two boys are next to each other and no two girls are next to each other). In how many ways can they stand?`, ways(v),
                        b === g ? R`The pattern is BGBG… or GBGB…: 2 patterns. Arrange the boys in their places and the girls in theirs: ${m(R`2\times${b}!\times${g}!=2\times${fact(b)}\times${fact(g)}=${v}`)}.`
                            : R`There is one more boy than girls, so the row must start and end with a boy: BGB…B. Arrange the boys in their places and the girls in theirs: ${m(R`${b}!\times${g}!=${fact(b)}\times${fact(g)}=${v}`)}.`,
                        { t: 'alt', b, g });
                }
                const [b, g] = rng.pick([[3, 2], [4, 2], [3, 3], [4, 3], [5, 2], [5, 3], [4, 4]]);
                const v = fact(b) * nPr(b + 1, g);
                const [X, Y, verb, dif] = t === 2 ? ['boys', 'girls', 'stand in a row', ''] : rng.pick([['story books', 'comics', 'are placed in a row on a shelf', 'different '], ['adults', 'children', 'sit in a row at the theatre', ''], ['teachers', 'pupils', 'stand in a row for a photo', ''], ['mugs', 'glasses', 'are lined up on a shelf', 'different ']]);
                return mk(`${Word(b)} ${dif}${X} and ${word(g)} ${dif}${Y} ${verb}. In how many ways can this be done if no two ${Y} are next to each other?`, ways(v),
                    R`Arrange the ${b} ${X}: ${b}!. They make ${b + 1} intervals; insert the ${g} ${Y} into different intervals, in order: ${m(R`${b}!\times${Pt(b + 1, g)}=${fact(b)}\times${nPr(b + 1, g)}=${v}`)}.`,
                    { t: 'apart', n: b + g, k: g });
            },
        },
        {
            id: 'repeated-letters', name: 'Words with repeated letters', level: 2,
            gen(rng) {
                const w = rng.pick(['LETTER', 'BANANA', 'LEVEL', 'PEPPER', 'COOKIE', 'BALLOON', 'SUCCESS', 'COFFEE', 'MISSISSIPPI', 'APPLE', 'GEESE',
                    'PUZZLE', 'RABBIT', 'CHEESE', 'PUPPY', 'MAMMAL', 'TOMORROW', 'ADDITION', 'DIVISION', 'PARALLEL', 'ALGEBRA', 'CIRCLE', 'PATTERN',
                    'SUMMER', 'BUBBLE', 'KAYAK', 'MINIMUM', 'STATISTICS', 'COMMITTEE', 'TENNESSEE']);
                const c = wordCount(w);
                const q = rng.pick([
                    `How many different arrangements are there of the letters of the word ${w}?`,
                    `The letters of the word ${w} are written on cards, one letter per card, and the cards are laid in a row. How many different letter strings can be made using all the cards?`,
                ]);
                return mk(q, CA.num(c.v, 'arrangements'), R`${w} has ${w.length} letters; ${c.say}. Choose ${c.places}. ${m(c.chooseTex)}.`, { t: 'word', w });
            },
        },
        {
            id: 'committee', name: 'Committees with conditions', level: 2,
            gen(rng) {
                const t = rng.int(0, 5);
                if (t >= 4) {
                    const n = rng.int(7, 10), k = rng.int(3, 4), [A, B] = rng.sample(NAMES, 2);
                    const all = nCr(n, k), both = nCr(n - 2, k - 2);
                    if (t === 4) {
                        return mk(`A team of ${k} is chosen from ${n} pupils, two of whom are ${A} and ${B}. How many teams are possible if ${A} and ${B} must <strong>both</strong> be on the team?`, CA.num(both, 'teams'),
                            R`Put ${A} and ${B} on the team and choose the other ${k - 2} from the remaining ${n - 2}: ${m(`${Ct(n - 2, k - 2)}=${both}`)}.`, { t: 'commPair', n, k, cond: 'both' });
                    }
                    return mk(`A team of ${k} is chosen from ${n} pupils, two of whom are ${A} and ${B}. ${A} and ${B} refuse to be on the team together. How many teams are possible?`, CA.num(all - both, 'teams'),
                        R`All teams: ${m(`${Ct(n, k)}=${all}`)}. Teams with both: ${m(`${Ct(n - 2, k - 2)}=${both}`)}. ${m(`${all}-${both}=${all - both}`)}.`, { t: 'commPair', n, k, cond: 'notBoth' });
                }
                const [X, Y, grp] = rng.pick([['boys', 'girls', 'A class has'], ['teachers', 'pupils', 'A school council has'], ['adults', 'children', 'A sailing club has'], ['violinists', 'drummers', 'A music club has']]);
                const one = s => (s === 'children' ? 'child' : s.slice(0, -1));
                const k = rng.int(3, 4), b = rng.int(k, 6), g = rng.int(k, 6), all = nCr(b + g, k);
                const lead = `${grp} ${b} ${X} and ${g} ${Y}. A committee of ${k} is chosen. How many different committees `;
                if (t === 0) {
                    const j = rng.int(1, k - 1), v = nCr(b, j) * nCr(g, k - j);
                    return mk(`${lead}have exactly ${j} ${j === 1 ? one(X) : X}?`, CA.num(v, 'committees'),
                        R`Choose ${j} of the ${b} ${X} and ${k - j} of the ${g} ${Y}: ${m(R`${Ct(b, j)}\times${Ct(g, k - j)}=${nCr(b, j)}\times${nCr(g, k - j)}=${v}`)}.`, { t: 'comm', b, g, k, cond: 'exactB', j });
                }
                if (t === 1) {
                    const v = all - nCr(b, k);
                    return mk(`${lead}have at least one ${one(Y)}?`, CA.num(v, 'committees'),
                        R`All committees: ${m(`${Ct(b + g, k)}=${all}`)}. With no ${one(Y)} (all ${X}): ${m(`${Ct(b, k)}=${nCr(b, k)}`)}. ${m(`${all}-${nCr(b, k)}=${v}`)}.`, { t: 'comm', b, g, k, cond: 'minG', j: 1 });
                }
                if (t === 2) {
                    const v = all - nCr(b, k) - nCr(g, k);
                    return mk(`${lead}have at least one ${one(X)} and at least one ${one(Y)}?`, CA.num(v, 'committees'),
                        R`All committees: ${m(`${Ct(b + g, k)}=${all}`)}. Remove the all-${X} ones, ${m(`${Ct(b, k)}=${nCr(b, k)}`)}, and the all-${Y} ones, ${m(`${Ct(g, k)}=${nCr(g, k)}`)}: ${m(`${all}-${nCr(b, k)}-${nCr(g, k)}=${v}`)}.`, { t: 'comm', b, g, k, cond: 'mixed' });
                }
                const none = nCr(b, k), oneG = g * nCr(b, k - 1), v = all - none - oneG;
                return mk(`${lead}have at least two ${Y}?`, CA.num(v, 'committees'),
                    R`All: ${m(`${Ct(b + g, k)}=${all}`)}. No ${one(Y)}: ${m(`${Ct(b, k)}=${none}`)}. Exactly one ${one(Y)}: ${m(R`${g}\times${Ct(b, k - 1)}=${oneG}`)}. ${m(`${all}-${none}-${oneG}=${v}`)}.`, { t: 'comm', b, g, k, cond: 'minG', j: 2 });
            },
        },
        {
            id: 'choose-arrange', name: 'Choose, then arrange', level: 2,
            gen(rng) {
                const t = rng.int(0, 4);
                if (t === 0) {
                    const b = rng.int(3, 5), g = rng.int(3, 5), j = rng.int(1, 2), i = rng.int(1, 2), ch = nCr(b, j) * nCr(g, i), v = ch * fact(i + j);
                    const nb = j === 1 ? 'one boy' : 'two boys', ng = i === 1 ? 'one girl' : 'two girls';
                    return mk(`From ${b} boys and ${g} girls, ${nb} and ${ng} are chosen, and the ${word(i + j)} chosen children then stand in a row for a photo. How many different photos are possible?`, CA.num(v, 'photos'),
                        R`Choose: ${m(R`${Ct(b, j)}\times${Ct(g, i)}=${ch}`)}. Arrange the ${i + j} chosen: ${m(`${i + j}!=${fact(i + j)}`)}. ${m(R`${ch}\times${fact(i + j)}=${v}`)}.`, { t: 'chArr', b, g, j, i });
                }
                if (t === 1 || t === 2) {
                    const n = rng.int(6, 9), k = rng.int(3, 5), two = t === 2, c = nCr(n, k), v = c * (two ? k * (k - 1) : k);
                    return mk(`A team of ${k} is chosen from ${n} players, and then one of the ${k} is named captain${two ? ' and another is named vice-captain' : ''}. In how many ways can this be done? (Teams with the same players but ${two ? 'different captains or vice-captains' : 'a different captain'} count as different.)`, ways(v),
                        two ? R`Choose the team: ${m(`${Ct(n, k)}=${c}`)}. Then captain and vice-captain, in order: ${m(R`${k}\times${k - 1}=${k * (k - 1)}`)}. ${m(R`${c}\times${k * (k - 1)}=${v}`)}.`
                            : R`Choose the team: ${m(`${Ct(n, k)}=${c}`)}. Then the captain: ${k} ways. ${m(R`${c}\times${k}=${v}`)}.`, { t: 'captain', n, k, two });
                }
                if (t === 3) {
                    const V = rng.sample(['A', 'E', 'I', 'O', 'U'], rng.int(3, 4)).sort(), C = rng.sample(['B', 'C', 'D', 'F', 'G', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T'], rng.int(3, 5)).sort();
                    const nv = rng.int(1, 2), nc = 4 - nv - rng.int(0, 1), len = nv + nc, ch = nCr(V.length, nv) * nCr(C.length, nc), v = ch * fact(len);
                    return mk(`A ${len}-letter code is made using ${nv === 1 ? 'one' : 'two different'} of the vowels ${V.join(', ')} and ${word(nc)} different letters from the consonants ${C.join(', ')}, in any order. How many codes are possible?`, CA.num(v, 'codes'),
                        R`Choose the letters: ${m(R`${Ct(V.length, nv)}\times${Ct(C.length, nc)}=${ch}`)}. Arrange the ${len} chosen letters: ${m(`${len}!=${fact(len)}`)}. ${m(R`${ch}\times${fact(len)}=${v}`)}.`, { t: 'chArr', b: V.length, g: C.length, j: nv, i: nc });
                }
                const n = rng.int(6, 8), k = rng.int(3, 4), A = rng.pick(NAMES), c = nCr(n - 1, k - 1), v = c * fact(k);
                return mk(`${Word(k)} of the ${n} members of a quiz club will sit in a row of ${k} chairs on stage. ${A}, one of the members, must be one of the ${word(k)}. In how many ways can the chairs be filled?`, ways(v),
                    R`${A} is in; choose the other ${k - 1} from ${n - 1}: ${m(`${Ct(n - 1, k - 1)}=${c}`)}. Arrange the ${k} in the chairs: ${m(`${k}!=${fact(k)}`)}. ${m(R`${c}\times${fact(k)}=${v}`)}.`, { t: 'mustSit', n, k });
            },
        },

        // ── Level 3 ──────────────────────────────────────────────────
        {
            id: 'grid-paths', name: 'Shortest routes on a grid', level: 3,
            gen(rng) {
                const a = rng.int(3, 5), b = rng.int(2, 4), t = rng.pick([0, 1, 1, 2, 2]);
                const all = nCr(a + b, a);
                const lead = 'The lines are streets. Moving only <strong>right</strong> or <strong>up</strong> along the streets, how many different shortest routes ';
                if (t === 0) {
                    return mk(`${lead}go from A to B?`, CA.num(all, 'routes'),
                        R`Every route has ${a} steps right and ${b} steps up, ${a + b} in all. Choose which ${b} are “up”: ${m(`${Ct(a + b, b)}=${all}`)}.`, { t: 'grid', a, b, mode: 'all' }, gridFig(a, b));
                }
                const p = rng.int(1, a - 1), q = rng.int(1, b - 1);
                const to = nCr(p + q, p), from = nCr(a - p + b - q, a - p), thru = to * from;
                const work = R`A to P (${p} right, ${q} up): ${m(`${Ct(p + q, p)}=${to}`)}. P to B (${a - p} right, ${b - q} up): ${m(`${Ct(a - p + b - q, a - p)}=${from}`)}. Through P: ${m(R`${to}\times${from}=${thru}`)}.`;
                if (t === 1) return mk(`${lead}go from A to B <strong>passing through P</strong>?`, CA.num(thru, 'routes'), work, { t: 'grid', a, b, p, q, mode: 'thru' }, gridFig(a, b, { pt: [p, q] }));
                return mk(`The crossing at P is closed. ${lead}go from A to B <strong>without passing through P</strong>?`, CA.num(all - thru, 'routes'),
                    R`All routes: ${m(`${Ct(a + b, a)}=${all}`)}. ${work} Avoiding P: ${m(`${all}-${thru}=${all - thru}`)}.`, { t: 'grid', a, b, p, q, mode: 'avoid' }, gridFig(a, b, { pt: [p, q] }));
            },
        },
        {
            id: 'circular', name: 'Round the table', level: 3,
            gen(rng) {
                const same = ' (Two seatings are the same if one can be turned into the other by rotating the table.)';
                const t = rng.int(0, 4);
                if (t === 4) {
                    const b = rng.int(3, 4), v = fact(b - 1) * fact(b);
                    return mk(`${Word(b)} boys and ${word(b)} girls sit at a round table so that boys and girls alternate. In how many ways can they be seated?${same}`, ways(v),
                        R`Seat the boys round the table first: ${m(`${b - 1}!=${fact(b - 1)}`)}. The ${b} gaps between them are now all different, so the girls fill them in ${m(`${b}!=${fact(b)}`)} ways. ${m(R`${fact(b - 1)}\times${fact(b)}=${v}`)}.`, { t: 'circAlt', b });
                }
                const n = t === 3 ? rng.pick([6, 8]) : rng.int(5, 8), names = rng.sample(NAMES, n).sort(), [A, B] = rng.sample(names, 2);
                const lead = `${Word(n)} friends — ${list(names)} — sit at a round table. In how many ways can they be seated`;
                if (t === 0) return mk(`${lead}?${same}`, ways(fact(n - 1)),
                    R`Seat one person anywhere (the table is round), then arrange the other ${n - 1}: ${m(`${n - 1}!=${fact(n - 1)}`)}.`, { t: 'circ', n, cond: 'any' });
                if (t === 1) return mk(`${lead} if ${A} and ${B} must sit next to each other?${same}`, ways(2 * fact(n - 2)),
                    R`Bind ${A} and ${B} into one thing: ${n - 1} things round the table, ${m(`${n - 2}!`)} ways, and 2 orders inside. ${m(R`2\times${n - 2}!=${2 * fact(n - 2)}`)}.`, { t: 'circ', n, cond: 'adj' });
                if (t === 2) return mk(`${lead} if ${A} and ${B} must <strong>not</strong> sit next to each other?${same}`, ways(fact(n - 1) - 2 * fact(n - 2)),
                    R`All seatings: ${m(`${n - 1}!=${fact(n - 1)}`)}. With ${A} and ${B} together: ${m(R`2\times${n - 2}!=${2 * fact(n - 2)}`)}. ${m(`${fact(n - 1)}-${2 * fact(n - 2)}=${fact(n - 1) - 2 * fact(n - 2)}`)}.`, { t: 'circ', n, cond: 'notAdj' });
                return mk(`${lead} if ${A} must sit directly opposite ${B}? (The ${n} seats are evenly spaced.)${same}`, ways(fact(n - 2)),
                    R`Seat ${A} anywhere; ${B}'s seat is then fixed. Arrange the other ${n - 2}: ${m(`${n - 2}!=${fact(n - 2)}`)}.`, { t: 'circ', n, cond: 'opp' });
            },
        },
        {
            id: 'complement', name: '“At least one” — count the opposite', level: 3,
            gen(rng) {
                const t = rng.int(0, 6);
                if (t === 0) {
                    const k = rng.pick([3, 3, 4]), d = rng.int(0, 9), all = 9 * 10 ** (k - 1), none = d === 0 ? 9 ** k : 8 * 9 ** (k - 1);
                    return mk(`How many ${k}-digit whole numbers contain the digit ${d} at least once?`, CA.num(all - none, 'numbers'),
                        R`All ${k}-digit numbers: ${m(R`9\times${Array(k - 1).fill(10).join(R`\times `)}=${all}`)}. With no ${d}: ${m(R`${d === 0 ? 9 : 8}\times${Array(k - 1).fill(9).join(R`\times `)}=${none}`)}. ${m(`${all}-${none}=${all - none}`)}.`, { t: 'hasDigit', k, d });
                }
                if (t === 1) {
                    const k = rng.int(3, 5), all = 10 ** k, diff = nPr(10, k);
                    return mk(`A padlock code has ${k} digits, each from 0 to 9 (codes may start with 0). How many codes have at least one digit that appears more than once?`, CA.num(all - diff, 'codes'),
                        R`All codes: ${m(`10^{${k}}=${all}`)}. Codes with all digits different: ${m(`${Pt(10, k)}=${diff}`)}. ${m(`${all}-${diff}=${all - diff}`)}.`, { t: 'repeatCode', k });
                }
                if (t === 2) {
                    const n = rng.int(2, 4), f = rng.int(1, 6), cols = ['a red', 'a blue', 'a green', 'a yellow'].slice(0, n);
                    return mk(`${Word(n)} dice — ${list(cols)} one — are rolled. In how many of the ${m(`6^{${n}}=${6 ** n}`)} possible results does at least one die show a ${f}?`, CA.num(6 ** n - 5 ** n, 'results'),
                        R`Results with no ${f} at all: ${m(`5^{${n}}=${5 ** n}`)}. ${m(`${6 ** n}-${5 ** n}=${6 ** n - 5 ** n}`)}.`, { t: 'dice', n });
                }
                if (t === 3) {
                    const n = rng.int(4, 8), two = rng.bool(), v = 2 ** n - 1 - (two ? n : 0);
                    return mk(`A coin is tossed ${n} times and the results are written down in order, for example ${rng.shuffle('HTHTHTHT'.slice(0, n).split('')).join('')}. How many of the possible records contain at least ${two ? 'two heads' : 'one head'}?`, CA.num(v, 'records'),
                        two ? R`All records: ${m(`2^{${n}}=${2 ** n}`)}. No heads: 1. Exactly one head: ${n}. ${m(`${2 ** n}-1-${n}=${v}`)}.`
                            : R`All records: ${m(`2^{${n}}=${2 ** n}`)}. Only one record has no head (all tails). ${m(`${2 ** n}-1=${v}`)}.`, { t: 'coins', n, min: two ? 2 : 1 });
                }
                if (t === 4) {
                    const s = rng.int(5, 7), letters = 'ABCDEFG'.slice(0, s).split(''), vow = letters.filter(c => 'AE'.includes(c)).length, k = rng.int(3, 4);
                    const all = s ** k, none = (s - vow) ** k;
                    return mk(`A ${k}-letter password uses only the letters ${letters.join(', ')}; letters may repeat. How many passwords contain at least one vowel (A or E)?`, CA.num(all - none, 'passwords'),
                        R`All passwords: ${m(`${s}^{${k}}=${all}`)}. With no vowel (only ${s - vow} letters allowed): ${m(`${s - vow}^{${k}}=${none}`)}. ${m(`${all}-${none}=${all - none}`)}.`, { t: 'vowel', s, k });
                }
                if (t === 5) {
                    const k = rng.pick([3, 4]), even = rng.bool(), all = 9 * 10 ** (k - 1), none = even ? 5 ** k : 4 * 5 ** (k - 1);
                    return mk(`How many ${k}-digit whole numbers have at least one ${even ? 'even' : 'odd'} digit? (0 is an even digit.)`, CA.num(all - none, 'numbers'),
                        even ? R`All: ${all}. Numbers whose digits are all odd (1, 3, 5, 7, 9): ${m(`5^{${k}}=${none}`)}. ${m(`${all}-${none}=${all - none}`)}.`
                            : R`All: ${all}. Numbers whose digits are all even: the first digit is 2, 4, 6 or 8 and the others are 0, 2, 4, 6 or 8, ${m(R`4\times5^{${k - 1}}=${none}`)}. ${m(`${all}-${none}=${all - none}`)}.`, { t: 'parityDigit', k, even });
                }
                const k = rng.pick([3, 4]), all = 9 * 10 ** (k - 1), diff = 9 * nPr(9, k - 1);
                return mk(`How many ${k}-digit whole numbers have at least two digits the same (for example ${k === 3 ? 707 : 3031})?`, CA.num(all - diff, 'numbers'),
                    R`All: ${all}. Numbers with all digits different: 9 choices for the first digit, then ${m(Pt(9, k - 1))} for the rest, ${m(R`9\times${nPr(9, k - 1)}=${diff}`)}. ${m(`${all}-${diff}=${all - diff}`)}.`, { t: 'repeatNum', k });
            },
        },
        {
            id: 'stars-bars', name: 'Sharing identical things', level: 3,
            gen(rng) {
                const k = rng.int(3, 4), t = rng.int(0, 3);
                const kids = rng.sample(NAMES, k).sort();
                const [thing, cont] = rng.pick([['identical sweets', 'shared among'], ['identical stickers', 'given out to'], ['identical marbles', 'shared among'], ['identical gold coins', 'divided among'], ['identical balloons', 'handed out to']]);
                if (t === 0) {
                    const n = rng.int(k + 3, 12), v = nCr(n - 1, k - 1);
                    return mk(`${Word(n)} ${thing} are ${cont} ${list(kids)}. Every child must get at least one. In how many ways can this be done?`, ways(v),
                        R`Lay the ${n} in a row: ${n - 1} gaps between them. Choose ${k - 1} gaps for dividers: ${m(`${Ct(n - 1, k - 1)}=${v}`)}.`, { t: 'stars', n, k, min: 1 });
                }
                if (t === 1) {
                    const n = rng.int(4, 10), v = nCr(n + k - 1, k - 1);
                    return mk(`${Word(n)} ${thing} are ${cont} ${list(kids)}. Some children may get none. In how many ways can this be done?`, ways(v),
                        R`Lend each child one extra: now share ${n + k} with at least one each. ${n + k - 1} gaps, ${k - 1} dividers: ${m(`${Ct(n + k - 1, k - 1)}=${v}`)}.`, { t: 'stars', n, k, min: 0 });
                }
                if (t === 2) {
                    const n = rng.int(2 * k + 2, 2 * k + 7), v = nCr(n - k - 1, k - 1);
                    return mk(`${Word(n)} ${thing} are ${cont} ${list(kids)}. Every child must get at least two. In how many ways can this be done?`, ways(v),
                        R`Give every child one first; ${n - k} are left and each child still needs at least one more. ${n - k - 1} gaps, ${k - 1} dividers: ${m(`${Ct(n - k - 1, k - 1)}=${v}`)}.`, { t: 'stars', n, k, min: 2 });
                }
                const n = rng.int(7, 13), pos = rng.bool(), vars = ['a', 'b', 'c', 'd'].slice(0, k).join('+');
                const v = pos ? nCr(n - 1, k - 1) : nCr(n + k - 1, k - 1);
                return mk(R`How many solutions does ${m(`${vars}=${n}`)} have in which ${list(['a', 'b', 'c', 'd'].slice(0, k).map(x => m(x)))} are ${pos ? 'positive whole numbers' : 'whole numbers that may be 0'}? (Different orders count as different: ${m(`a=1, b=2`)} is not the same as ${m(`a=2, b=1`)}.)`, CA.num(v, 'solutions'),
                    pos ? R`Think of ${n} ones in a row and ${k - 1} dividers in the ${n - 1} gaps: ${m(`${Ct(n - 1, k - 1)}=${v}`)}.`
                        : R`Add 1 to every letter: the sum becomes ${n + k} with every part at least 1. ${m(`${Ct(n + k - 1, k - 1)}=${v}`)}.`, { t: 'stars', n, k, min: pos ? 1 : 0 });
            },
        },
        {
            id: 'row-challenge', name: 'Rows with tricky conditions', level: 3,
            gen(rng) {
                const n = rng.int(5, 7), { names, scene } = crowd(rng, n), [A, B, C, D] = names;
                const all = fact(n);
                const opts = [
                    ['leftOf', `${A} must stand somewhere to the left of ${B} (not necessarily next to ${B})`, all / 2,
                        R`Pair up every arrangement with the one where ${A} and ${B} swap places: in exactly one of each pair ${A} is on the left. ${m(R`${n}!\div2=${all / 2}`)}.`],
                    ['order3', `${A}, ${B} and ${C} must appear in that order from left to right (not necessarily next to each other)`, all / 6,
                        R`The three can occupy their places in ${m('3!=6')} orders and only one is allowed: ${m(R`${n}!\div6=${all / 6}`)}. (Or: choose their 3 places, ${m(`${Ct(n, 3)}=${nCr(n, 3)}`)}, then arrange the others, ${m(`${n - 3}!`)}.)`],
                    ['twoPairs', `${A} and ${B} must be next to each other, and ${C} and ${D} must also be next to each other`, 4 * fact(n - 2),
                        R`Bind each pair into one thing: ${n - 2} things to arrange, and each pair has 2 inside orders. ${m(R`${n - 2}!\times2\times2=${4 * fact(n - 2)}`)}.`],
                    ['oneBetween', `there must be exactly one person between ${A} and ${B}`, 2 * (n - 2) * fact(n - 2),
                        R`The pair of places (1st & 3rd, 2nd & 4th, …) can be chosen in ${n - 2} ways, ${A} and ${B} fill them in 2 ways, and the others fill the rest in ${m(`${n - 2}!`)} ways: ${m(R`${n - 2}\times2\times${fact(n - 2)}=${2 * (n - 2) * fact(n - 2)}`)}.`],
                    ['notFirstNotLast', `${A} must not be at the left end and ${B} must not be at the right end`, all - 2 * fact(n - 1) + fact(n - 2),
                        R`All: ${all}. Remove “${A} at the left end” (${fact(n - 1)}) and “${B} at the right end” (${fact(n - 1)}); arrangements with both (${fact(n - 2)}) were removed twice, so add them back: ${m(`${all}-${fact(n - 1)}-${fact(n - 1)}+${fact(n - 2)}=${all - 2 * fact(n - 1) + fact(n - 2)}`)}.`],
                    ['endAndApart', `${C} must be at the left end, and ${A} and ${B} must not be next to each other`, fact(n - 1) - 2 * fact(n - 2),
                        R`Fix ${C}. The other ${n - 1} fill the remaining places: ${m(`${n - 1}!=${fact(n - 1)}`)} ways, of which ${m(R`2\times${n - 2}!=${2 * fact(n - 2)}`)} have ${A} and ${B} together. ${m(`${fact(n - 1)}-${2 * fact(n - 2)}=${fact(n - 1) - 2 * fact(n - 2)}`)}.`],
                    ['togetherNotEnd', `${A} and ${B} must be next to each other, and ${C} must not be at either end`, 2 * (n - 3) * fact(n - 2),
                        R`Bind ${A} and ${B} into one thing: ${n - 1} things in a row. ${C} takes one of the ${n - 3} inside places, the other ${n - 2} things are arranged in ${m(`${n - 2}!`)} ways, and the pair has 2 inside orders: ${m(R`${n - 3}\times${fact(n - 2)}\times2=${2 * (n - 3) * fact(n - 2)}`)}.`],
                ];
                const [cond, text, v, sol] = rng.pick(opts);
                return mk(`${scene} In how many ways can they be arranged if ${text}?`, ways(v), sol, { t: 'row', n, cond });
            },
        },
    ];
    const old = id => POOL.find(g => g.id === id).gen;
    /** A generator that picks one of several building blocks each time. */
    const either = (...ids) => rng => old(rng.pick(ids))(rng);

    CA.register({
        id: 6,
        assignmentNote: 'Show your working in the space under each problem. Every answer is a whole number — write it out in full, not as a factorial.',

        tutorial: [
            {
                h: 'The three counting tools',
                html: R`
                <p>Every problem in this lesson is built from three tools you have met before. Make sure they are sharp.</p>
                <div class="ca-key"><strong>Multiplication principle.</strong> If a job is done in steps, with \(a\) ways to do
                   step 1, then \(b\) ways to do step 2, then \(c\) ways to do step 3, the whole job can be done in
                   \(a\times b\times c\) ways.</div>
                <p><strong>Permutations — order matters.</strong> Choosing \(r\) things from \(n\) different things
                   <em>and putting them in order</em> (1st, 2nd, 3rd…; president, secretary…; the digits of a number):</p>
                <div class="ca-formula">\[ {}_nP_r = \underbrace{n\times(n-1)\times(n-2)\times\cdots}_{r\ \text{factors}} \qquad\qquad {}_nP_n = n! \]</div>
                <p><strong>Combinations — order does not matter.</strong> Choosing a <em>group</em> of \(r\) things from \(n\)
                   (a team, a committee, a handful of sweets). Every group of \(r\) could be put in order in \(r!\) ways, so
                   the permutations count each group \(r!\) times:</p>
                <div class="ca-formula">\[ {}_nC_r = \frac{{}_nP_r}{r!} \qquad\text{for example}\qquad {}_7C_3=\frac{7\times6\times5}{3\times2\times1}=${nCr(7, 3)} \]</div>
                <table>
                    <tr><th>Question</th><th>Order matters?</th><th>Count</th></tr>
                    <tr><td>Gold, silver and bronze among 7 runners</td><td>Yes</td><td>\({}_7P_3=${nPr(7, 3)}\)</td></tr>
                    <tr><td>A team of 3 chosen from 7 runners</td><td>No</td><td>\({}_7C_3=${nCr(7, 3)}\)</td></tr>
                    <tr><td>7 runners standing in a row</td><td>Yes</td><td>\(7!=${fact(7)}\)</td></tr>
                </table>
                <div class="ca-tip"><strong>The swap test.</strong> Swap two of the things you chose. If you now have a
                   <em>different</em> result (Ava gold, Ben silver ≠ Ben gold, Ava silver) order matters: permutation. If
                   it is the same result (the same team), order does not matter: combination.</div>
                <p>Two shortcuts worth remembering: \({}_nC_r={}_nC_{n-r}\) (choosing 3 to take is choosing 4 to leave
                   behind), and \(0!=1\).</p>`,
            },
            {
                h: 'Arranging identical objects: choose the positions',
                html: R`
                <p>Three <em>identical</em> red balls and two <em>identical</em> blue balls are placed in a row. How many
                   different rows can you see?</p>
                ${F.row(ballsFig('RBRRB', { numbers: true }))}
                <p>If all five balls were different there would be \(5!=${fact(5)}\) rows. But swapping two red balls
                   changes nothing you can see. All that matters is <strong>which places are blue</strong> — in the picture,
                   places 2 and 5. So a row is simply a choice of 2 places out of 5:</p>
                <div class="ca-formula">\[ {}_5C_2=${nCr(5, 2)} \text{ rows} \]</div>
                <div class="ca-key"><strong>Identical objects → choose the positions.</strong> Identical objects have no
                   order among themselves, so do not arrange them: just <em>choose which positions they take</em>
                   (a combination). Then arrange any <em>different</em> objects in the places that are left.</div>
                <p><strong>More than two kinds.</strong> Choose positions one kind at a time. For the letters of LETTER
                   (${LETTER.say}): choose ${LETTER.places}.</p>
                <div class="ca-formula">\[ ${LETTER.chooseTex} \]</div>
                <p>For BANANA: choose ${BANANA.places}: \(${BANANA.chooseTex}\).</p>
                <div class="ca-tip"><strong>A shortcut that gives the same answer.</strong> Arrange the letters as if they
                   were all different, then divide by (number of copies)! for each repeated letter:
                   \(${LETTER.tex}\).</div>
                <p><strong>Routes on a grid are the same problem.</strong> How many shortest routes go from A to B along the
                   lines, moving only right or up?</p>
                ${F.row(gridFig(4, 3, { path: ['R', 'U', 'R', 'R', 'U', 'U', 'R'] }))}
                <p>Every shortest route is a row of 7 steps: 4 identical R's and 3 identical U's (the one shown is RURRUUR).
                   Choose which 3 of the 7 positions are U: \({}_7C_3=${nCr(7, 3)}\) routes. To go <em>through</em> a point P,
                   multiply (routes from A to P) × (routes from P to B); to <em>avoid</em> P, subtract those from all the
                   routes.</p>`,
            },
            {
                h: 'Things that must be together: bind them',
                html: R`
                <p>Six friends A, B, C, D, E, F stand in a row, and A and B insist on standing next to each other.
                   <strong>Bind</strong> A and B together with string and treat them as <strong>“one thing”</strong>:</p>
                ${F.row(bundleFig())}
                <p>Now there are only 5 things to arrange — the bound pair and the 4 other friends: \(5!\) ways.</p>
                <p>But inside the “one thing” the friends <strong>still have an order</strong>: A–B or B–A, \(2!\) ways.
                   Altogether \(5!\times2!=${fact(5) * 2}\).</p>
                <div class="ca-key"><strong>Must be together → bind.</strong>
                   <ol><li>Bind them into “one thing” and arrange this one thing with everything else.</li>
                       <li>Multiply by the number of orders <em>inside</em> the one thing.</li></ol>
                   \[ k \text{ of } n \text{ different people together:}\qquad (n-k+1)!\times k! \]</div>
                <p><strong>Two groups.</strong> Three different maths books and two different story books go on a shelf,
                   with the maths books together and the story books together. That is 2 “things” — \(2!\) orders — with
                   \(3!\) and \(2!\) orders inside them: \(2!\times3!\times2!=${2 * 6 * 2}\).</p>
                <div class="ca-warn"><strong>Do not forget the inside order</strong> — and do not invent one that is not
                   there. If the bound objects are <em>identical</em> (the two Ts of LETTER), swapping them changes nothing,
                   so the inside order counts only once.</div>`,
            },
            {
                h: 'Things that cannot be together: insert them into the intervals',
                html: R`
                <p>Four boys and three girls stand in a row, and no two girls may be next to each other. Start with the
                   people who have <em>no</em> restriction — the boys — and arrange them: \(4!\) ways. They create 5
                   <strong>intervals</strong> (gaps), counting the two ends:</p>
                ${F.row(gapFig(['B', 'B', 'B', 'B']))}
                <p>Now <strong>insert</strong> the girls into <em>different</em> intervals, at most one girl per interval —
                   then no two girls can touch. The girls are different people, so order matters:
                   \({}_5P_3=${nPr(5, 3)}\) ways. Altogether \(4!\times{}_5P_3=${fact(4) * nPr(5, 3)}\).</p>
                <div class="ca-key"><strong>Cannot be together → insert.</strong>
                   <ol><li>Arrange the other things first.</li>
                       <li>Insert the things that cannot be together into the intervals, one per interval
                           (\(m\) things in a row make \(m+1\) intervals).</li></ol>
                   If the inserted things are different, use a permutation; if they are <em>identical</em>, just choose the
                   intervals with a combination.</div>
                <p><strong>Both rules at once.</strong> Six friends A, B, C, D, E, F stand in a row. A and B must be
                   together; C and D must <em>not</em> be next to each other.</p>
                <div class="ca-key"><strong>Bind the adjacent ones first, insert the non-adjacent ones last.</strong></div>
                <ul>
                    <li><strong>Bind</strong> A and B (2 inside orders). Leave C and D out for now.</li>
                    <li><strong>Arrange</strong> the rest — the bound pair, E and F: \(3!\) ways. They make 4 intervals.</li>
                    <li><strong>Insert</strong> C and D into two different intervals: \({}_4P_2=${nPr(4, 2)}\) ways.</li>
                </ul>
                <p>Total: \(2\times3!\times{}_4P_2=${2 * 6 * nPr(4, 2)}\).</p>
                <div class="ca-warn"><strong>“All − together” only works for two.</strong> If just <em>two</em> people must
                   be apart you may also do (all arrangements) − (arrangements with them together). But with three people,
                   “not all three together” is <em>not</em> the same as “no two next to each other”. For three or more,
                   insert.</div>`,
            },
            {
                h: 'Extra tool: fussy places first',
                html: R`
                <p>Real problems come with conditions: “Ava must be at the left end”, “the number must be even”, “the first
                   digit cannot be 0”. The golden rule:</p>
                <div class="ca-key"><strong>Deal with the fussiest place (or the fussiest person) first.</strong> Fill the
                   restricted positions while you still have a free choice, then arrange everything else.</div>
                <p><strong>People.</strong> Six friends stand in a row and Ava refuses to stand at either end. Ava is the
                   fussy one: she has 4 allowed places. The other 5 friends then fill the other 5 places in \(5!\) ways:
                   \(4\times5!=${4 * fact(5)}\).</p>
                <p><strong>Numbers.</strong> How many 3-digit <em>even</em> numbers with three different digits can be made
                   from 0, 1, 2, 3, 4, 5? Two places are fussy: the last digit must be 0, 2 or 4, and the first digit
                   cannot be 0. The trouble is that 0 is involved in <em>both</em> rules, so split into cases:</p>
                <ul>
                    <li><strong>Last digit 0.</strong> The first two digits are any 2 of the other 5, in order:
                        \({}_5P_2=${ex1zero}\).</li>
                    <li><strong>Last digit 2 or 4</strong> (2 ways). The first digit is not 0 and not the last digit: 4 ways.
                        The middle digit is any of the 4 digits left: \(2\times4\times4=${2 * ex1other}\).</li>
                </ul>
                <p>Total: \(${ex1zero}+${2 * ex1other}=${ex1}\).</p>
                <div class="ca-warn"><strong>The zero trap.</strong> A number cannot start with 0 (012 is just 12). Whenever
                   0 is one of the digits, fill the first digit carefully — and if the last digit is also restricted, split
                   into “ends in 0” and “does not end in 0”.</div>`,
            },
            {
                h: 'Extra tool: count what you do not want',
                html: R`
                <p>Some conditions are painful to count directly but have a simple opposite. The words to look for are
                   <strong>“at least one”</strong>.</p>
                <div class="ca-key"><strong>Complementary counting.</strong>
                   \[ \text{at least one} \;=\; \text{everything} \;-\; \text{none at all} \]</div>
                <p><strong>Example.</strong> How many 3-digit numbers contain at least one 7? Counting “exactly one 7”,
                   “exactly two 7s” and “three 7s” separately is slow. Instead:</p>
                <ul>
                    <li>All 3-digit numbers: \(9\times10\times10=900\).</li>
                    <li>3-digit numbers with <em>no</em> 7: \(8\times9\times9=${8 * 81}\) (the first digit avoids 0 and 7; the
                        others avoid 7).</li>
                    <li>At least one 7: \(900-${8 * 81}=${900 - 8 * 81}\).</li>
                </ul>
                <p><strong>Committees.</strong> A committee of 3 is chosen from 5 boys and 4 girls. How many committees have
                   at least one girl? All committees: \({}_9C_3=${nCr(9, 3)}\). All-boy committees: \({}_5C_3=${nCr(5, 3)}\).
                   So \(${nCr(9, 3)}-${nCr(5, 3)}=${nCr(9, 3) - nCr(5, 3)}\).</p>
                <div class="ca-warn"><strong>A tempting wrong method.</strong> “Pick one girl first (4 ways), then any 2 of
                   the other 8 people (\({}_8C_2=${nCr(8, 2)}\) ways): \(4\times${nCr(8, 2)}=${4 * nCr(8, 2)}\).” This is far
                   too big, because a committee with two girls is counted twice — once for each girl who could be the
                   “first” one. Use the complement, or split into exact cases (1 girl, 2 girls, 3 girls).</div>
                <p><strong>Exact numbers of each kind.</strong> Choose each kind separately, then multiply: a team of 4
                   with exactly 2 boys from 6 boys and 5 girls is
                   \({}_6C_2\times{}_5C_2=${nCr(6, 2)}\times${nCr(5, 2)}=${nCr(6, 2) * nCr(5, 2)}\).
                   <strong>Choose, then arrange:</strong> if the 4 chosen children then stand in a row, multiply by
                   \(4!\): \(${nCr(6, 2) * nCr(5, 2)}\times24=${nCr(6, 2) * nCr(5, 2) * 24}\).</p>`,
            },
            {
                h: 'More extras: round tables, handshakes and sharing',
                html: R`
                <p><strong>Round tables.</strong> Five people sit at a round table. Only who sits next to whom matters, so
                   turning the whole table gives the <em>same</em> seating. Sit one person down first — it does not matter
                   where — and the other 4 seats are now all different: \(4!=${fact(4)}\) ways. In general \(n\) people can
                   sit round a table in \((n-1)!\) ways. Binding still works: with two friends together, there are
                   4 things round the table, \(3!\times2=${fact(3) * 2}\) ways.</p>
                <p><strong>Handshakes and lines.</strong> If 8 people all shake hands with each other, each handshake is a
                   <em>pair</em> of people: \({}_8C_2=${nCr(8, 2)}\). The same idea counts matches in a league, lines through
                   points (2 points make a line) and triangles (3 points, no three in a straight line). A polygon with
                   \(n\) corners has \({}_nC_2\) joins between corners; \(n\) of them are sides, so it has
                   \({}_nC_2-n\) diagonals.</p>
                <p><strong>Sharing identical things.</strong> In how many ways can 7 identical sweets be shared among 3
                   children so that every child gets at least one? Lay the sweets in a row and <em>insert</em> 2 dividers
                   into different intervals <em>between</em> sweets:</p>
                ${F.row(starsFig([2, 4, 1]))}
                <p>There are 6 intervals between the 7 sweets, and the dividers are identical, so we choose 2 of them:
                   \({}_6C_2=${nCr(6, 2)}\) ways. With \(n\) identical things and \(k\) people it is
                   \({}_{n-1}C_{k-1}\).</p>
                <div class="ca-tip"><strong>If someone may get nothing</strong>, first <em>lend</em> every child one extra
                   sweet. Sharing 7 sweets among 3 children with zeros allowed is the same as sharing \(7+3=10\) sweets
                   with at least one each: \({}_9C_2=${nCr(9, 2)}\).</div>`,
            },
        ],

        // Mirrors the textbook's own summary page for this lesson.
        summary: [
            {
                topic: 'Arranging problems with identical objects',
                points: [
                    R`Identical objects have no order among themselves, so <strong>choose the positions</strong> for them: 3 identical red and 2 identical blue balls in a row give \({}_5C_2=${nCr(5, 2)}\) rows.`,
                    R`Several kinds: choose positions one kind at a time, then arrange the different objects in the places left. LETTER: \(${LETTER.chooseTex}\).`,
                ],
            },
            {
                topic: 'Arranging problems where something must be placed together',
                points: [
                    R`<strong>Bind</strong> them into “one thing”, and arrange this one thing with everything else.`,
                    R`Inside the “one thing” they still have an order — multiply by it. Two of six friends together: \(5!\times2!=${fact(5) * 2}\).`,
                ],
            },
            {
                topic: 'Arranging problems where something cannot be placed together',
                points: [
                    R`Arrange the other things first, then <strong>insert</strong> the things that cannot be together into the intervals (\(m\) things make \(m+1\) intervals). 4 boys, 3 girls, no two girls together: \(4!\times{}_5P_3=${fact(4) * nPr(5, 3)}\).`,
                    R`With both “adjacent” and “non-adjacent” requirements, always <strong>bind the adjacent ones first</strong> and <strong>insert the non-adjacent ones last</strong>.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Identical objects: choose the positions',
                q: R`(a) Four identical red flags and three identical blue flags are hung in a row. How many different rows are possible? (b) One yellow flag and one green flag are added, making nine flags. How many rows are possible now?`,
                steps: [
                    R`(a) Only the positions matter. There are 7 places; choose which 3 are blue: \(${Ct(7, 3)}=${nCr(7, 3)}\). The red flags fill the rest in just 1 way.`,
                    R`(b) Now 9 places. Choose 4 for the red flags: \(${Ct(9, 4)}=${nCr(9, 4)}\).`,
                    R`Choose 3 of the remaining 5 places for the blue flags: \(${Ct(5, 3)}=${nCr(5, 3)}\).`,
                    R`The yellow and green flags are <em>different</em>, so arrange them in the last 2 places: \(2!=2\). Total \(${nCr(9, 4)}\times${nCr(5, 3)}\times2=${nCr(9, 4) * nCr(5, 3) * 2}\).`,
                ],
                answer: R`(a) ${nCr(7, 3)} &nbsp; (b) ${nCr(9, 4) * nCr(5, 3) * 2}`,
            },
            {
                title: 'Must be together: bind',
                q: R`Seven pupils stand in a row. Three of them — Ava, Ben and Cara — are best friends and want to stand together (all three next to each other, in any order). In how many ways can the row be formed?`,
                steps: [
                    R`Bind Ava, Ben and Cara into “one thing”. There are now \(7-3+1=5\) things to arrange: the bound group and the 4 other pupils.`,
                    R`Arrange the 5 things: \(5!=${fact(5)}\).`,
                    R`Inside the “one thing” the three friends still have an order: \(3!=6\) ways.`,
                    R`Multiply: \(${fact(5)}\times6=${fact(5) * 6}\).`,
                ],
                answer: R`${fact(5) * 6} ways`,
            },
            {
                title: 'Cannot be together: insert',
                q: R`Five story books and three comics, all different, are put in a row on a shelf. No two comics may be next to each other. How many arrangements are possible?`,
                steps: [
                    R`Arrange the unrestricted things first — the 5 story books: \(5!=${fact(5)}\).`,
                    R`The 5 books make 6 intervals (4 between books and 1 at each end).`,
                    R`Insert the 3 comics into 3 <em>different</em> intervals. The comics are different, so order matters: \(${Pt(6, 3)}=${nPr(6, 3)}\).`,
                    R`Multiply: \(${fact(5)}\times${nPr(6, 3)}=${fact(5) * nPr(6, 3)}\).`,
                ],
                answer: R`${fact(5) * nPr(6, 3)} arrangements`,
            },
            {
                title: 'Bind first, insert last',
                q: R`Seven pupils stand in a row. Ava and Ben must stand next to each other, but Cara and Dan must <strong>not</strong> stand next to each other. In how many ways can the row be formed?`,
                steps: [
                    R`There is an “adjacent” rule and a “non-adjacent” rule: bind first, insert last. Bind Ava and Ben into one thing (2 inside orders) and take Cara and Dan out of the row for now.`,
                    R`Arrange what is left: the bound pair and the 3 other pupils — 4 things: \(4!=${fact(4)}\).`,
                    R`These 4 things make 5 intervals. Insert Cara and Dan into two different intervals: \(${Pt(5, 2)}=${nPr(5, 2)}\).`,
                    R`Multiply: \(2\times${fact(4)}\times${nPr(5, 2)}=${2 * fact(4) * nPr(5, 2)}\).`,
                ],
                answer: R`${2 * fact(4) * nPr(5, 2)} ways`,
            },
            {
                title: 'Identical letters, together and apart',
                q: R`For the letters of the word LETTER, how many different arrangements (a) are there altogether, (b) have the two Ts next to each other, (c) have the two Ts <strong>not</strong> next to each other?`,
                steps: [
                    R`(a) Choose ${LETTER.places}: \(${LETTER.chooseTex}\).`,
                    R`(b) Bind the two Ts into one thing “TT”. They are identical, so there is only 1 inside order. Now arrange TT, L, E, E, R — 5 things with E twice: choose 2 of the 5 places for the Es, then arrange the 3 different things: \(${Ct(5, 2)}\times3!=${nCr(5, 2) * 6}\).`,
                    R`(c) Insert. Arrange the other letters L, E, E, R first: \(${Ct(4, 2)}\times2!=${lettersNoT}\) ways. They make 5 intervals; the Ts are identical, so <em>choose</em> 2 intervals: \(${Ct(5, 2)}=${nCr(5, 2)}\). Total \(${lettersNoT}\times${nCr(5, 2)}=${lettersNoT * nCr(5, 2)}\).`,
                    R`Check: (b) + (c) should give (a): \(${nCr(5, 2) * 6}+${lettersNoT * nCr(5, 2)}=${nCr(5, 2) * 6 + lettersNoT * nCr(5, 2)}\). ✓`,
                ],
                answer: R`(a) ${LETTER.v} &nbsp; (b) ${nCr(5, 2) * 6} &nbsp; (c) ${lettersNoT * nCr(5, 2)}`,
            },
            {
                title: 'Routes through a point',
                q: R`Moving only right or up along the lines, how many shortest routes go from A to B (a) in total, (b) passing through P, (c) avoiding P?`,
                fig: F.row(gridFig(EXG.a, EXG.b, { pt: EXG.p })),
                steps: [
                    R`(a) Every route has ${EXG.a} steps right and ${EXG.b} steps up — ${EXG.a + EXG.b} steps. The R's are identical and so are the U's, so choose which ${EXG.a} positions are R: \(${Ct(EXG.a + EXG.b, EXG.a)}=${exgAll}\).`,
                    R`(b) From A to P: ${EXG.p[0]} right and ${EXG.p[1]} up, \(${Ct(EXG.p[0] + EXG.p[1], EXG.p[0])}=${exgTo}\) routes. From P to B: ${EXG.a - EXG.p[0]} right and ${EXG.b - EXG.p[1]} up, \(${Ct(EXG.a - EXG.p[0] + EXG.b - EXG.p[1], EXG.a - EXG.p[0])}=${exgFrom}\) routes.`,
                    R`Through P: \(${exgTo}\times${exgFrom}=${exgTo * exgFrom}\).`,
                    R`(c) Avoiding P = all − through P: \(${exgAll}-${exgTo * exgFrom}=${exgAll - exgTo * exgFrom}\).`,
                ],
                answer: R`(a) ${exgAll} &nbsp; (b) ${exgTo * exgFrom} &nbsp; (c) ${exgAll - exgTo * exgFrom}`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            { id: 'counting-basics', name: 'Multiply the choices; arrange in order', level: 1, gen: old('counting-basics') },
            { id: 'choosing', name: 'Choosing a group; handshakes and lines', level: 1, gen: either('basic-comb', 'handshakes') },
            {
                id: 'identical-objects', name: 'Identical objects: choose the positions', level: 1,
                gen(rng) {
                    const t = rng.int(0, 3);
                    if (t <= 1) {
                        const a = rng.int(2, 5), b = rng.int(2, 4), n = a + b, v = nCr(n, b);
                        const [X, Y, things, verb] = rng.pick([['red', 'blue', 'balls', 'placed in a row'], ['white', 'black', 'counters', 'laid in a row'], ['yellow', 'green', 'flags', 'hung in a row'],
                            ['red', 'yellow', 'tulips', 'planted in a row'], ['silver', 'gold', 'stars', 'stuck in a row on a card'], ['orange', 'purple', 'tiles', 'laid in a row']]);
                        return mk(`${Word(a)} identical ${X} ${things} and ${word(b)} identical ${Y} ${things} are ${verb}. How many different rows are possible?`, CA.num(v, 'rows'),
                            R`Only the positions matter. Choose which ${b} of the ${n} places are ${Y}: ${m(`${Ct(n, b)}=${v}`)}. The ${X} ${things} fill the rest in 1 way.`, { t: 'multiset', counts: [a, b] });
                    }
                    const n = rng.int(5, 9), k = rng.int(2, Math.min(4, n - 2)), v = nCr(n, k);
                    const q = t === 2
                        ? `A coin is tossed ${n} times and the results are written in order (for example ${'H'.repeat(k)}${'T'.repeat(n - k)}). How many different records have exactly ${k} heads?`
                        : rng.pick([
                            `A row of ${n} lockers is to be painted so that exactly ${k} are red and the rest are grey. In how many ways can this be done?`,
                            `A house has ${n} windows in a row. Exactly ${k} of them have a light on. How many different patterns of lit windows are possible?`,
                            `A true/false quiz has ${n} questions. In how many ways can the answer sheet be filled in so that exactly ${k} answers are “True” and the rest are “False”?`,
                            `${Word(k)} identical cushions are put on a row of ${n} chairs, at most one cushion on a chair. In how many ways can this be done?`,
                        ]);
                    return mk(q, ways(v), R`The ${k} are identical, so just choose their positions: ${k} places out of ${n}, ${m(`${Ct(n, k)}=${v}`)}.`, { t: 'multiset', counts: [k, n - k] });
                },
            },
            {
                id: 'bind-pair', name: 'Bind two that must be together', level: 1,
                gen(rng) {
                    const t = rng.int(0, 2);
                    if (t === 0) {
                        const n = rng.int(4, 6), { names, scene } = crowd(rng, n), v = 2 * fact(n - 1);
                        return mk(`${scene} In how many ways can they be arranged if ${names[0]} and ${names[1]} must be next to each other?`, ways(v),
                            R`Bind ${names[0]} and ${names[1]} into one thing: ${n - 1} things to arrange, and 2 orders inside the pair. ${m(R`${n - 1}!\times2=${fact(n - 1)}\times2=${v}`)}.`, { t: 'groups', n, sizes: [2] });
                    }
                    if (t === 1) {
                        const w = rng.pick(['MATHS', 'PLANET', 'TIGER', 'NUMBER', 'FRIEND', 'CANDLE', 'SQUARE', 'POCKET', 'BRIGHT', 'ORANGE', 'ZEBRA', 'WINTER']);
                        const [x, y] = rng.sample(w.split(''), 2), n = w.length, v = 2 * fact(n - 1);
                        return mk(`The ${n} letters of the word ${w} are all different. In how many ways can they be arranged in a row so that ${x} and ${y} are next to each other?`, ways(v),
                            R`Bind ${x} and ${y} into one thing: ${n - 1} things to arrange, and 2 orders inside (${x}${y} or ${y}${x}). ${m(R`${n - 1}!\times2=${fact(n - 1)}\times2=${v}`)}.`, { t: 'groups', n, sizes: [2] });
                    }
                    const n = rng.int(4, 6), v = 2 * fact(n - 1);
                    const [things, a, b, verb] = rng.pick([['books', 'the atlas', 'the dictionary', 'stood in a row on a shelf'], ['toy animals', 'the lion', 'the tiger', 'lined up on a windowsill'],
                        ['photos', 'the photo of Grandma', 'the photo of Grandpa', 'hung in a row on a wall'], ['model cars', 'the police car', 'the fire engine', 'parked in a row']]);
                    return mk(`${Word(n)} different ${things}, including ${a} and ${b}, are ${verb}. In how many ways can this be done if ${a} and ${b} must be next to each other?`, ways(v),
                        R`Bind the two into one thing: ${n - 1} things to arrange, and 2 orders inside the pair. ${m(R`${n - 1}!\times2=${fact(n - 1)}\times2=${v}`)}.`, { t: 'groups', n, sizes: [2] });
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'identical-mixed', name: 'Identical and different objects together', level: 2,
                gen(rng) {
                    const t = rng.int(0, 2);
                    if (t === 0) {
                        const [a, b, c] = [rng.int(2, 4), rng.int(2, 3), rng.int(1, 3)], n = a + b + c, v = nCr(n, a) * nCr(n - a, b);
                        const [things, verb] = rng.pick([['balls', 'placed in a row'], ['flags', 'hung in a row'], ['beads', 'glued in a row on a card'], ['tiles', 'laid in a row'], ['toy bricks', 'stacked in a tower (the order from bottom to top matters)']]);
                        const last = c === 1 ? `one green ${things.replace(/s$/, '')}` : `${word(c)} identical green ${things}`;
                        return mk(`${Word(a)} identical red ${things}, ${word(b)} identical blue ${things} and ${last} are ${verb}. How many different arrangements are possible?`, CA.num(v, 'arrangements'),
                            R`Choose ${a} of the ${n} places for red, then ${b} of the remaining ${n - a} for blue; green takes what is left: ${m(R`${Ct(n, a)}\times${Ct(n - a, b)}=${nCr(n, a)}\times${nCr(n - a, b)}=${v}`)}.`, { t: 'multiset', counts: [a, b, c] });
                    }
                    if (t === 1) {
                        const a = rng.int(2, 4), d = rng.int(2, 3), n = a + d, v = nCr(n, a) * fact(d);
                        const [same, diff, verb] = rng.pick([['identical copies of a dictionary', 'different novels', 'stood in a row on a shelf'], ['identical gold medals', 'different trophies', 'displayed in a row'],
                            ['identical red tiles', 'tiles of other, different colours', 'laid in a row'], ['identical blank cards', 'different picture cards', 'laid in a row'], ['identical white mugs', 'different patterned mugs', 'lined up on a shelf']]);
                        return mk(`${Word(a)} ${same} and ${word(d)} ${diff} are ${verb}. How many different arrangements are possible?`, CA.num(v, 'arrangements'),
                            R`Choose ${a} of the ${n} places for the identical ones: ${m(`${Ct(n, a)}=${nCr(n, a)}`)}. Arrange the ${d} different ones in the places left: ${m(`${d}!=${fact(d)}`)}. ${m(R`${nCr(n, a)}\times${fact(d)}=${v}`)}.`, { t: 'multiset', counts: [a, ...Array(d).fill(1)] });
                    }
                    const a = rng.int(2, 3), b = rng.int(2, 3), d = rng.int(1, 2), n = a + b + d, v = nCr(n, a) * nCr(n - a, b) * fact(d);
                    const extra = d === 1 ? 'one white flag' : 'one white flag and one green flag';
                    return mk(`${Word(a)} identical red flags, ${word(b)} identical blue flags and ${extra} are hung in a row. How many different signals (rows of flags) are possible?`, CA.num(v, 'signals'),
                        R`Choose ${a} of the ${n} places for red and ${b} of the remaining ${n - a} for blue: ${m(R`${Ct(n, a)}\times${Ct(n - a, b)}=${nCr(n, a) * nCr(n - a, b)}`)}. ` +
                        (d === 1 ? R`The white flag takes the last place: ${v}.` : R`The 2 different flags fill the last 2 places in ${m('2!=2')} ways: ${m(R`${nCr(n, a) * nCr(n - a, b)}\times2=${v}`)}.`), { t: 'multiset', counts: [a, b, ...Array(d).fill(1)] });
                },
            },
            { id: 'repeated-letters', name: 'Words with repeated letters', level: 2, gen: old('repeated-letters') },
            {
                id: 'bind-together', name: 'Must be together: bind', level: 2,
                gen(rng) {
                    if (rng.bool(0.8)) return old('bundling')(rng);
                    const w = rng.pick(['ORANGE', 'PLANET', 'CANDLE', 'SQUARE', 'FRIEND', 'NUMBER', 'POCKET', 'ISLAND', 'MOTHER', 'DOLPHIN']);
                    const vow = w.split('').filter(c => 'AEIOU'.includes(c)), n = w.length, k = vow.length, v = fact(n - k + 1) * fact(k);
                    return mk(`The ${n} letters of the word ${w} are all different. In how many ways can they be arranged in a row so that the vowels (${list(vow)}) are all next to each other?`, ways(v),
                        R`Bind the ${k} vowels into one thing: with the ${n - k} consonants that makes ${n - k + 1} things, and the vowels have ${k}! orders inside. ${m(R`${n - k + 1}!\times${k}!=${fact(n - k + 1)}\times${fact(k)}=${v}`)}.`, { t: 'groups', n, sizes: [k] });
                },
            },
            {
                id: 'insert-gaps', name: 'Cannot be together: insert', level: 2,
                gen(rng) {
                    if (rng.bool(0.75)) return old('gaps')(rng);
                    const b = rng.int(2, 4), a = rng.int(Math.max(3, b), 6), v = nCr(a + 1, b);
                    if (rng.bool(0.3)) {
                        return mk(`A coin is tossed ${a + b} times and the results are written in order. How many records have exactly ${b} heads, with no two heads next to each other?`, CA.num(v, 'records'),
                            R`Write the ${a} tails first: they make ${a + 1} intervals. The heads are identical, so choose ${b} different intervals for them: ${m(`${Ct(a + 1, b)}=${v}`)}.`, { t: 'identApart', a, b });
                    }
                    const [X, Y, things, verb] = rng.pick([['red', 'blue', 'balls', 'placed in a row'], ['green', 'white', 'chairs', 'put in a row'], ['oak', 'pine', 'trees', 'planted in a row (trees of the same kind look identical)'], ['black', 'white', 'counters', 'laid in a row']]);
                    return mk(`${Word(a)} identical ${X} ${things} and ${word(b)} identical ${Y} ${things} are ${verb} so that no two ${Y} ${things} are next to each other. How many different rows are possible?`, CA.num(v, 'rows'),
                        R`Put the ${a} ${X} ${things} down first (1 way, they are identical): they make ${a + 1} intervals. The ${Y} ${things} are identical too, so choose ${b} different intervals: ${m(`${Ct(a + 1, b)}=${v}`)}.`, { t: 'identApart', a, b });
                },
            },
            { id: 'special-places', name: 'Fussy places: ends, first digits, even numbers', level: 2, gen: either('special-position', 'digit-numbers') },
            { id: 'committee', name: 'Committees with conditions; choose, then arrange', level: 2, gen: either('committee', 'committee', 'choose-arrange') },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'bind-and-insert', name: 'Bind first, insert last', level: 3,
                gen(rng) {
                    const t = rng.int(0, 3);
                    if (t === 3) {
                        const [X, Y, Z, verb] = rng.pick([['maths books', 'science books', 'novels', 'stood in a row on a shelf'], ['songs', 'dances', 'magic tricks', 'put in order for a school show'],
                            ['oil paintings', 'photographs', 'posters', 'hung in a row on a wall']]);
                        const a = rng.int(2, 3), b = rng.int(2, 3), o = rng.int(Math.max(1, b - 2), 8 - a - b);
                        const v = fact(o + 1) * fact(a) * nPr(o + 2, b);
                        return mk(`${Word(a)} different ${X}, ${word(b)} different ${Y} and ${word(o)} different ${Z} are ${verb}. All the ${X} must be next to each other, and no two ${Y} may be next to each other. How many arrangements are possible?`, CA.num(v, 'arrangements'),
                            R`Bind the ${X} into one thing (${a}! inside orders). Arrange it with the ${o} ${Z}: ${m(`${o + 1}!`)}. These ${o + 1} things make ${o + 2} intervals; insert the ${b} ${Y} into different intervals: ${m(Pt(o + 2, b))}. ${m(R`${a}!\times${o + 1}!\times${Pt(o + 2, b)}=${fact(a)}\times${fact(o + 1)}\times${nPr(o + 2, b)}=${v}`)}.`,
                            { t: 'bindInsert', n: a + b + o, bind: a, apart: b });
                    }
                    const k = t === 1 ? 3 : 2, j = t === 2 ? 3 : 2;              // k bound together, j kept apart
                    const n = rng.int(k + j + 1, 8), { names, scene } = crowd(rng, n);
                    const pals = names.slice(0, k), foes = names.slice(k, k + j), rest = n - k - j;
                    const v = fact(k) * fact(rest + 1) * nPr(rest + 2, j);
                    const together = k === 2 ? `${pals[0]} and ${pals[1]} must be next to each other` : `${list(pals)} must all be together`;
                    const apart = j === 2 ? `${foes[0]} and ${foes[1]} must <strong>not</strong> be next to each other` : `no two of ${list(foes)} may be next to each other`;
                    return mk(`${scene} ${cap(together)}, but ${apart}. In how many ways can they be arranged?`, ways(v),
                        R`Bind ${list(pals)} into one thing (${k}! inside orders). Arrange it with the other ${rest}: ${m(`${rest + 1}!`)}. These ${rest + 1} things make ${rest + 2} intervals; insert ${list(foes)} into different intervals: ${m(Pt(rest + 2, j))}. ${m(R`${k}!\times${rest + 1}!\times${Pt(rest + 2, j)}=${fact(k)}\times${fact(rest + 1)}\times${nPr(rest + 2, j)}=${v}`)}.`,
                        { t: 'bindInsert', n, bind: k, apart: j });
                },
            },
            {
                id: 'letters-conditions', name: 'Repeated letters, together or apart', level: 3,
                gen(rng) {
                    for (;;) {
                        const w = rng.pick(['LETTER', 'BANANA', 'PEPPER', 'COOKIE', 'BALLOON', 'SUCCESS', 'COFFEE', 'PUZZLE', 'RABBIT', 'CHEESE', 'MAMMAL', 'PATTERN', 'SUMMER', 'BUBBLE',
                            'ALGEBRA', 'CIRCLE', 'ADDITION', 'PARALLEL', 'TOMORROW', 'GIRAFFE', 'BUTTER', 'KITTEN', 'HOLLOW', 'CARROT', 'BOTTLE']);
                        const c = letterCounts(w), L = w.length, t = rng.int(0, 2);
                        const lead = `The letters of the word ${w} are arranged in a row. In how many different arrangements `;
                        if (t === 2) {
                            const vc = {}, cc = {};
                            for (const [ch, k] of Object.entries(c)) ('AEIOU'.includes(ch) ? vc : cc)[ch] = k;
                            const nv = Object.values(vc).reduce((x, y) => x + y, 0);
                            if (nv < 2 || nv > L - 2 || Object.keys(vc).length < 2) continue;      // identical vowels only: that is the 'together' question
                            const outer = multi([...Object.values(cc), 1]), inner = multi(Object.values(vc)), v = outer * inner;
                            const vs = w.split('').filter(ch => 'AEIOU'.includes(ch)).sort().join(', ');
                            return mk(`${lead}are all the vowels (${vs}) next to each other?`, CA.num(v, 'arrangements'),
                                R`Bind the ${nv} vowels into one thing. Arrange it with the ${L - nv} consonants: ${m(multiTex([...Object.values(cc), 1]))} ways. Orders of the vowels inside the bound group: ${m(multiTex(Object.values(vc)))}. ${m(R`${outer}\times${inner}=${v}`)}.`, { t: 'wordCond', w, cond: 'vowels' });
                        }
                        const x = rng.pick(Object.keys(c).filter(ch => c[ch] >= 2)), k = c[x];
                        const others = Object.entries(c).filter(e => e[0] !== x).map(e => e[1]);
                        const nk = k === 2 ? 'two' : 'three';
                        if (t === 0) {
                            const v = multi([...others, 1]);
                            return mk(`${lead}are the ${nk} ${x}s ${k === 2 ? 'next to each other' : 'all next to each other'}?`, CA.num(v, 'arrangements'),
                                R`Bind the ${nk} ${x}s into one thing; they are identical, so there is only 1 inside order. Now arrange ${L - k + 1} things` +
                                (others.some(o => o > 1) ? R` (some letters are still identical): ${m(multiTex([...others, 1]))}.` : R`, all different: ${m(multiTex([...others, 1]))}.`), { t: 'wordCond', w, cond: 'together', x });
                        }
                        if (L - k + 1 < k) continue;
                        const base = multi(others), v = base * nCr(L - k + 1, k);
                        return mk(`${lead}${k === 2 ? `are the two ${x}s <strong>not</strong> next to each other` : `are no two of the three ${x}s next to each other`}?`, CA.num(v, 'arrangements'),
                            R`Arrange the other ${L - k} letters first: ${m(multiTex(others))} ways. They make ${L - k + 1} intervals. The ${x}s are identical, so choose ${k} different intervals for them: ${m(`${Ct(L - k + 1, k)}=${nCr(L - k + 1, k)}`)}. ${m(R`${base}\times${nCr(L - k + 1, k)}=${v}`)}.`, { t: 'wordCond', w, cond: 'apart', x });
                    }
                },
            },
            { id: 'grid-paths', name: 'Shortest routes on a grid', level: 3, gen: old('grid-paths') },
            { id: 'row-challenge', name: 'Rows and round tables with tricky conditions', level: 3, gen: either('row-challenge', 'row-challenge', 'circular') },
            { id: 'opposite-share', name: 'Count the opposite; share identical things', level: 3, gen: either('complement', 'stars-bars') },
        ],

        assignment: [
            ['counting-basics', 3], ['choosing', 3], ['identical-objects', 5], ['bind-pair', 4],
            ['identical-mixed', 4], ['repeated-letters', 4], ['bind-together', 5], ['insert-gaps', 5], ['special-places', 3], ['committee', 2],
            ['bind-and-insert', 4], ['letters-conditions', 3], ['grid-paths', 2], ['row-challenge', 2], ['opposite-share', 1],
        ],
    });
})();
