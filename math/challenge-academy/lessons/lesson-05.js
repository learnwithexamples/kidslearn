/* Challenge Academy — Lesson 5: Ratios, Rates, & Proportions */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, T = CA.tex;

    // ── Small helpers ────────────────────────────────────────────────────
    const fr = T.frac;
    const coprime = (a, b) => CA.gcd(a, b) === 1;
    const red = parts => { const g = parts.reduce((a, b) => CA.gcd(a, b)); return parts.map(x => x / g); };
    const rt = parts => parts.join(':');                                            // TeX for a ratio
    const lin = (c, d = 0) => R`${c === 1 ? '' : c}x${d > 0 ? '+' + d : d < 0 ? d : ''}`;      // 3x+6, 5x, x-2
    const plin = (c, d = 0) => (d ? R`(${lin(c, d)})` : lin(c, d));                   // brackets only when needed
    const sc = d => (d > 0 ? '+' + d : d < 0 ? String(d) : '');                      // signed constant, '' for 0
    const money = v => (Number.isInteger(v) ? R`$${v}` : R`$${v.toFixed(2)}`);
    const dec = (n, places) => String(Number((n / 10 ** places).toFixed(places)));  // 15, 1 → "1.5"
    const NAMES = ['Ava', 'Ben', 'Cara', 'Dan', 'Eli', 'Faye', 'Gus', 'Hana', 'Ivan', 'Jade', 'Kai', 'Lena', 'Milo', 'Nora', 'Omar', 'Priya', 'Rosa', 'Sam', 'Tara', 'Zoe'];
    /** A random ratio p : q in lowest terms with different terms. */
    function pq(rng, max = 9, min = 1) {
        for (;;) { const p = rng.int(min, max), q = rng.int(min, max); if (p !== q && coprime(p, q)) return [p, q]; }
    }
    // Two kinds of thing found together: [place, first, second, all of them].
    const GROUPS = [
        ['In a class', 'boys', 'girls', 'students'], ['In a bag', 'red marbles', 'blue marbles', 'marbles'], ['In a car park', 'cars', 'vans', 'vehicles'],
        ['On a farm', 'sheep', 'goats', 'animals'], ['In a fruit bowl', 'apples', 'oranges', 'pieces of fruit'], ['On a shelf', 'story books', 'fact books', 'books'],
        ['In a pencil case', 'pens', 'pencils', 'items'], ['In a pond', 'ducks', 'swans', 'birds'], ['In a choir', 'adults', 'children', 'singers'],
    ];

    // ── Combining A : B with B : C through the least common multiple ─────
    function twoRatios(rng) {
        for (;;) {
            const [p, q] = pq(rng), [r, s] = pq(rng), L = CA.lcm(q, r);
            if (q === r || L > 36) continue;
            return { p, q, r, s, L, abc: [p * L / q, L, s * L / r] };
        }
    }
    const tx = n => (n.length === 1 ? n : R`\text{${n}}`);                          // a name inside maths
    const unify = (c, [A, B, C]) => R`The common quantity is ${B}. Unify it to the least common multiple of ${c.q} and ${c.r}, which is ${c.L}: ${m(R`${tx(A)}:${tx(B)}=${c.p}:${c.q}=${c.abc[0]}:${c.L}`)} and ${m(R`${tx(B)}:${tx(C)}=${c.r}:${c.s}=${c.L}:${c.abc[2]}`)}. So ${m(R`${tx(A)}:${tx(B)}:${tx(C)}=${rt(c.abc)}`)}.`;

    // ── Word problems in which a ratio changes ───────────────────────────
    // Before: X = p·x, Y = q·x.  After: X + d1 and Y + d2 are in the ratio r : s.
    function ratioChange(rng, hard) {
        const kind = rng.pick(hard ? ['transfer', 'transfer', 'bothAdd', 'bothSub', 'diff', 'ages'] : ['addX', 'addX', 'subX', 'addY', 'subY']);
        for (;;) {
            let [p, q] = pq(rng, 9);
            if (kind === 'ages' && p > q) [p, q] = [q, p];
            const x0 = rng.int(2, 12), k = rng.int(2, 30), k2 = rng.int(2, 30);
            const X = p * x0, Y = q * x0;
            const [d1, d2] = { addX: [k, 0], subX: [-k, 0], addY: [0, k], subY: [0, -k], transfer: [-k, k], bothAdd: [k, k], ages: [k, k], bothSub: [-k, -k], diff: rng.pick([[k, -k2], [-k, k2], [k, k2], [-k, -k2]]) }[kind];
            if (kind === 'diff' && Math.abs(d1) === Math.abs(d2)) continue;
            const X2 = X + d1, Y2 = Y + d2;
            if (X2 < 2 || Y2 < 2) continue;
            const [r, s] = red([X2, Y2]);
            if (r > 12 || s > 12 || r === s || (r === p && s === q) || X2 === r) continue;
            if (kind === 'ages' && (X < 4 || Y - X < 18 || Y > 60 || k > 20)) continue;
            if ((r * d2 - s * d1) / (s * p - r * q) !== x0) throw new Error('ratio change: the equation does not give back x');

            // The story
            let before, change, after, askList, nameX, nameY, unit = '';
            const A = rng.sample(NAMES, 2);
            if (kind === 'ages') {
                const [older] = rng.pick([['mother'], ['father'], ['aunt'], ['uncle'], ['teacher']]);
                nameX = R`${A[0]}'s age`; nameY = R`the ${older}'s age`;
                before = R`The ratio of ${A[0]}'s age to the age of ${A[0]}'s ${older} is ${m(rt([p, q]))}.`;
                change = R`In ${k} years' time`; after = R`the ratio will be ${m(rt([r, s]))}.`;
                askList = [[R`How old is ${A[0]} now?`, X, 'years', R`${A[0]} is ${m(R`${p}\times${x0}=${X}`)} years old`], [R`How old is ${A[0]}'s ${older} now?`, Y, 'years', R`the ${older} is ${m(R`${q}\times${x0}=${Y}`)} years old`]];
            } else if (!hard) {
                const [place, gx, gy] = rng.pick(GROUPS.concat([['In a club', 'boys', 'girls'], ['At a party', 'adults', 'children'], ['In a jar', 'toffees', 'mints'], ['In a field', 'cows', 'horses']]));
                const [moved, n] = d1 ? [gx, Math.abs(d1)] : [gy, Math.abs(d2)];
                nameX = R`the number of ${gx}`; nameY = R`the number of ${gy}`;
                before = R`${place}, the ratio of ${gx} to ${gy} is ${m(rt([p, q]))}.`;
                change = d1 + d2 > 0 ? R`Then ${n} more ${moved} arrive, and` : R`Then ${n} of the ${moved} are taken away, and`;
                after = R`the ratio of ${gx} to ${gy} becomes ${m(rt([r, s]))}.`;
                askList = [[R`How many ${gx} were there at first?`, X, gx, R`there were ${m(R`${p}\times${x0}=${X}`)} ${gx} at first`], [R`How many ${gy} were there at first?`, Y, gy, R`there were ${m(R`${q}\times${x0}=${Y}`)} ${gy} at first`],
                    [R`How many ${gx} and ${gy} were there altogether at first?`, X + Y, '', R`there were ${m(R`${p + q}\times${x0}=${X + Y}`)} altogether at first`]];
            } else {
                const [thing, pre] = rng.pick([['stickers', ''], ['marbles', ''], ['cards', ''], ['dollars', '$'], ['beads', '']]);
                const has = thing === 'dollars' ? 'amounts of money' : R`numbers of ${thing}`;
                const amt = n => (pre ? R`$${n}` : R`${n} ${thing}`);
                unit = pre ? '$' : thing;
                nameX = R`${A[0]}'s amount`; nameY = R`${A[1]}'s amount`;
                before = R`${A[0]} and ${A[1]} have ${has} in the ratio ${m(rt([p, q]))}.`;
                const verb = d => (d > 0 ? (pre ? 'is given' : 'gets') + R` ${amt(d)} more` : (pre ? 'spends' : 'gives away') + R` ${amt(-d)}`);
                change = kind === 'transfer' ? R`${A[0]} gives ${amt(k)} to ${A[1]}, and now`
                    : kind === 'bothAdd' ? R`Each of them ${pre ? 'is given' : 'gets'} ${amt(k)} more, and now`
                    : kind === 'bothSub' ? R`Each of them ${pre ? 'spends' : 'gives away'} ${amt(k)}, and now`
                    : R`${A[0]} ${verb(d1)} and ${A[1]} ${verb(d2)}, and now`;
                after = R`the ratio is ${m(rt([r, s]))}.`;
                askList = [[R`How ${pre ? 'much' : 'many ' + thing} did ${A[0]} have at first?`, X, unit, R`${A[0]} had ${m(R`${p}\times${x0}=${X}`)}${pre ? ' dollars' : ' ' + thing} at first`],
                    [R`How ${pre ? 'much' : 'many ' + thing} did ${A[1]} have at first?`, Y, unit, R`${A[1]} had ${m(R`${q}\times${x0}=${Y}`)}${pre ? ' dollars' : ' ' + thing} at first`],
                    [R`How ${pre ? 'much' : 'many ' + thing} does ${A[1]} have now?`, Y2, unit, R`${A[1]} now has ${m(R`${q}\times${x0}${sc(d2)}=${Y2}`)}${pre ? ' dollars' : ' ' + thing}`]];
            }
            const [ask, value, u, last] = rng.pick(askList);
            const sol = R`<strong>Step 1</strong> (before): let ${nameX} be ${m(lin(p))} and ${nameY} be ${m(lin(q))}. ` +
                R`<strong>Step 2</strong> (after): they are ${m(lin(p, d1))} and ${m(lin(q, d2))}. ` +
                R`<strong>Step 3</strong>: ${m(R`${plin(p, d1)}:${plin(q, d2)}=${r}:${s}`)}, so ${m(R`${s === 1 ? '' : s}${s === 1 ? lin(p, d1) : R`(${lin(p, d1)})`}=${r === 1 ? '' : r}${r === 1 ? lin(q, d2) : R`(${lin(q, d2)})`}`)}, ` +
                R`that is ${m(R`${lin(s * p, s * d1)}=${lin(r * q, r * d2)}`)}, giving ${m(R`x=${x0}`)}. So ${last}.`;
            return { q: R`${before} ${change} ${after} ${ask}`, ans: CA.num(value, u === 'dollars' ? '$' : u), sol };
        }
    }

    // ── Figure: a bar model for sharing in a ratio ───────────────────────
    function bars(rows, opt = {}) {
        const cell = opt.cell || 30, h = 22, gap = 10, x0 = 62, max = Math.max(...rows.map(r => r.n));
        const W = x0 + max * cell + (opt.brace ? 8 + opt.brace.length * 6.6 : 8), H = rows.length * (h + gap) + 6;
        let b = '';
        rows.forEach((r, i) => {
            const y = 4 + i * (h + gap);
            b += F.text(x0 - 8, y + h / 2 + 4.5, r.label, { anchor: 'end', size: 12, bold: true });
            for (let k = 0; k < r.n; k++) b += F.rect(x0 + k * cell, y, cell, h, { fill: r.fill || F.colors.FILL }) + (r.unit ? F.text(x0 + k * cell + cell / 2, y + h / 2 + 4, r.unit, { size: 11 }) : '');
        });
        if (opt.brace) b += F.text(x0 + max * cell + 8, H / 2 + 4, opt.brace, { anchor: 'start', size: 12 });
        return F.svg(W, H, b, { label: 'bar model' });
    }

    CA.register({
        id: 5,

        tutorial: [
            {
                h: 'Ratios and simplest form',
                html: R`
                <p>A <strong>ratio</strong> compares two (or more) quantities by saying how many times as big one is as
                   another. If a class has 12 boys and 18 girls, the ratio of boys to girls is \(12:18\).</p>
                <p><strong>The property of ratios:</strong> multiplying or dividing <em>every</em> term by the same
                   non-zero number does not change the ratio — just like equivalent fractions. Dividing by the
                   greatest common factor gives the <strong>simplest form</strong>:</p>
                <div class="ca-formula">\[ 12:18 \;=\; (12\div6):(18\div6) \;=\; 2:3 \]</div>
                <div class="ca-warn"><strong>Order matters.</strong> Boys to girls is \(2:3\); girls to boys is
                   \(3:2\); boys to the <em>whole class</em> is \(12:30=2:5\). Read the question twice.</div>
                <p>A ratio in simplest form uses whole numbers with no common factor. So first get rid of units,
                   fractions and decimals:</p>
                <table>
                    <tr><th>Ratio</th><th>What to do</th><th>Simplest form</th></tr>
                    <tr><td>40 cm : 2 m</td><td>same unit: \(40:200\)</td><td>\(1:5\)</td></tr>
                    <tr><td>\(\frac12:\frac34\)</td><td>multiply both by 4 (the LCM of the denominators)</td><td>\(2:3\)</td></tr>
                    <tr><td>\(1.5:2.5\)</td><td>multiply both by 10: \(15:25\)</td><td>\(3:5\)</td></tr>
                    <tr><td>40% boys, the rest girls</td><td>\(40:60\)</td><td>\(2:3\)</td></tr>
                </table>
                <div class="ca-tip"><strong>Percent is a ratio out of 100.</strong> "A is 25% more than B" means
                   \(A:B=125:100=5:4\).</div>`,
            },
            {
                h: 'Ratio of three quantities',
                html: R`
                <p>Three quantities can be compared in one ratio, \(A:B:C\). The catch is that you are often given
                   only <em>two</em> separate ratios that share a quantity:</p>
                <div class="ca-formula">\[ A:B=2:3 \qquad\text{and}\qquad B:C=4:5 \]</div>
                <p>\(B\) is the <strong>common quantity</strong> — but it is 3 parts in one ratio and 4 parts in the
                   other, and those "parts" are different sizes. Use the property of ratios to
                   <strong>unify the common quantity to the least common multiple</strong>: the LCM of 3 and 4 is 12.</p>
                <table>
                    <tr><th></th><th>\(A\)</th><th>\(B\)</th><th>\(C\)</th><th></th></tr>
                    <tr><td>\(A:B\)</td><td>2</td><td>3</td><td></td><td>multiply by 4</td></tr>
                    <tr><td>\(B:C\)</td><td></td><td>4</td><td>5</td><td>multiply by 3</td></tr>
                    <tr><td>\(A:B:C\)</td><td><strong>8</strong></td><td><strong>12</strong></td><td><strong>15</strong></td><td>\(B\) is now 12 in both</td></tr>
                </table>
                <div class="ca-key">\(A:B=2:3=8:12\) and \(B:C=4:5=12:15\), so \(A:B:C=8:12:15\).
                   From this you can read off any pair, for example \(A:C=8:15\).</div>
                <div class="ca-warn"><strong>Do not just write the numbers side by side.</strong> \(2:3\) and \(4:5\)
                   do <em>not</em> give \(2:3:5\) or \(2:4:5\). The common quantity must be the same number in both
                   ratios before you join them.</div>`,
            },
            {
                h: 'Sharing in a ratio',
                html: R`
                <p>A ratio tells you how many equal <strong>parts</strong> each share is made of. Find the size of one
                   part, and every question becomes easy.</p>
                <p>Ann and Ben share $120 in the ratio \(3:5\).</p>
                ${F.row(bars([{ label: 'Ann', n: 3, unit: '15' }, { label: 'Ben', n: 5, unit: '15', fill: F.colors.SHADE }], { brace: '8 parts = $120' }))}
                <ul>
                    <li>Total parts: \(3+5=8\). One part: \(120\div8=15\).</li>
                    <li>Ann gets \(3\times15=45\) dollars and Ben gets \(5\times15=75\) dollars.</li>
                </ul>
                <p>The same picture answers other questions. If you are told instead that Ben gets $30 <em>more</em>
                   than Ann, then the <em>difference</em>, \(5-3=2\) parts, is $30: one part is $15 again.</p>
                <div class="ca-key"><strong>Match what you know to a number of parts.</strong><br>
                   a total ↔ the sum of the parts &nbsp;·&nbsp; a difference ↔ the difference of the parts &nbsp;·&nbsp;
                   one share ↔ its own parts.</div>
                <p>With three quantities it is the same: angles in the ratio \(2:3:4\) in a triangle make \(9\) parts
                   \(=180^\circ\), so one part is \(20^\circ\) and the angles are \(40^\circ, 60^\circ, 80^\circ\).</p>`,
            },
            {
                h: 'Rates and unit rates',
                html: R`
                <p>A <strong>rate</strong> is a ratio that compares two <em>different kinds</em> of quantity:
                   kilometres with hours, dollars with kilograms, grams with cubic centimetres. A
                   <strong>unit rate</strong> says how much of the first goes with <em>one</em> of the second.</p>
                <table>
                    <tr><th>Rate</th><th>Unit rate</th><th>Name</th></tr>
                    <tr><td>180 km in 3 hours</td><td>\(180\div3=60\) km per hour</td><td>speed</td></tr>
                    <tr><td>$7.50 for 3 kg</td><td>\(7.50\div3=2.50\) dollars per kg</td><td>unit price</td></tr>
                    <tr><td>54 g for 20 cm³</td><td>\(54\div20=2.7\) g per cm³</td><td>density</td></tr>
                </table>
                <div class="ca-tip"><strong>Best buy.</strong> To compare packs of different sizes, compare unit prices.
                   6 for $4.50 is 75 cents each; 10 for $7.20 is 72 cents each — the bigger pack is the better
                   value here, but not always!</div>
                <p>"Per" means "divide by". Speed is distance <em>per</em> time, so speed = distance ÷ time; turn it
                   round to get distance = speed × time and time = distance ÷ speed.</p>`,
            },
            {
                h: 'Proportional equations',
                html: R`
                <p>A <strong>proportion</strong> (a proportional equation) says that two ratios are equal:</p>
                <div class="ca-formula">\[ a:b=c:d \]</div>
                <p>The two outside terms, \(a\) and \(d\), are called the <strong>extremes</strong>. The two inside
                   terms, \(b\) and \(c\), are called the <strong>means</strong>.</p>
                <div class="ca-key"><strong>Product of means = product of extremes.</strong>
                   \[ a:b=c:d \quad\Longrightarrow\quad b\times c = a\times d \]</div>
                <p>Why? \(a:b=c:d\) means \(\dfrac ab=\dfrac cd\). Multiply both sides by \(bd\) and you get \(ad=bc\).
                   (With fractions this is called cross-multiplying.)</p>
                <p>So a proportional equation is solved in two steps:</p>
                <ul>
                    <li><strong>Step 1.</strong> Change the proportional equation into an ordinary equation, using
                        product of means = product of extremes.</li>
                    <li><strong>Step 2.</strong> Solve the ordinary equation.</li>
                </ul>
                <table>
                    <tr><th>Proportional equation</th><th>Step 1</th><th>Step 2</th></tr>
                    <tr><td>\(3:5=x:20\)</td><td>\(5x=3\times20\)</td><td>\(x=12\)</td></tr>
                    <tr><td>\((x+2):5=6:10\)</td><td>\(5\times6=10(x+2)\)</td><td>\(30=10x+20\), so \(x=1\)</td></tr>
                    <tr><td>\((x+1):(x+7)=2:5\)</td><td>\(2(x+7)=5(x+1)\)</td><td>\(2x+14=5x+5\), so \(x=3\)</td></tr>
                </table>
                <div class="ca-warn"><strong>Keep the brackets.</strong> A term such as \(x+2\) is one whole term of
                   the ratio. When it is multiplied, <em>all</em> of it is multiplied: \(10(x+2)=10x+20\), not
                   \(10x+2\).</div>`,
            },
            {
                h: 'Direct and inverse proportion',
                html: R`
                <p><strong>Direct proportion.</strong> Two quantities are in direct proportion when their
                   <em>ratio</em> stays the same: double one and the other doubles. Cost and number of items;
                   distance and time at a steady speed; a map distance and the real distance.</p>
                <p>If 6 notebooks cost $15, what do 10 cost? Write the proportion with matching quantities in matching
                   places, then use means and extremes:</p>
                <div class="ca-formula">\[ 6:15=10:x \quad\Longrightarrow\quad 6x=15\times10 \quad\Longrightarrow\quad x=25 \]</div>
                <p><strong>Scale.</strong> A map scale of \(1:50\,000\) means 1 cm on the map stands for 50 000 cm
                   \(=500\) m \(=0.5\) km on the ground. Lengths are in direct proportion — but areas are multiplied
                   by the scale factor <em>twice</em>.</p>
                <p><strong>Inverse proportion.</strong> Two quantities are in inverse proportion when their
                   <em>product</em> stays the same: double one and the other halves. More workers, fewer days; higher
                   speed, less time.</p>
                <div class="ca-key">If 6 workers need 10 days, the job is \(6\times10=60\) worker-days. 4 workers need
                   \(60\div4=15\) days. (Check: fewer workers, more days. ✓)</div>
                <div class="ca-tip"><strong>Which kind?</strong> Ask: "If this doubles, does that double, or halve?"
                   Always sense-check your answer against that.</div>`,
            },
            {
                h: 'Word problems in which a ratio changes',
                html: R`
                <p>In the hardest ratio problems something is added, taken away or moved, and the ratio
                   <em>changes</em>. A proportional equation handles every one of them with the same three steps.</p>
                <p><em>In a club the ratio of boys to girls is \(3:5\). After 6 more boys join, the ratio is \(3:4\).
                   How many girls are in the club?</em></p>
                <div class="ca-key">
                    <strong>Step 1. Set \(x\) based on the ratio before the change.</strong> Boys \(=3x\), girls \(=5x\).<br>
                    <strong>Step 2. Represent both quantities after the change using \(x\).</strong> Boys \(=3x+6\), girls \(=5x\).<br>
                    <strong>Step 3. Set up the equation using the ratio after the change.</strong> \((3x+6):5x=3:4\).
                </div>
                <p>Now solve it: product of means = product of extremes gives \(5x\times3=4(3x+6)\), so
                   \(15x=12x+24\) and \(x=8\). There are \(5\times8=40\) girls (and there were \(24\) boys, now \(30\);
                   check: \(30:40=3:4\) ✓).</p>
                <div class="ca-warn"><strong>The 3 in \(3:5\) and the 3 in \(3:4\) are not the same "3 parts".</strong>
                   Never compare the two ratios directly. That is exactly why we name one part \(x\)
                   <em>before</em> the change and build everything from it.</div>
                <table>
                    <tr><th>What happens</th><th>After the change</th></tr>
                    <tr><td>\(k\) is added to the first quantity</td><td>\(3x+k\) and \(5x\)</td></tr>
                    <tr><td>\(k\) moves from the first to the second</td><td>\(3x-k\) and \(5x+k\)</td></tr>
                    <tr><td>both grow by \(k\) (ages after \(k\) years)</td><td>\(3x+k\) and \(5x+k\)</td></tr>
                </table>`,
            },
        ],

        summary: [
            {
                topic: 'Ratio of three quantities',
                points: [
                    R`Use the property of ratios to unify the common quantity to the least common multiple.`,
                    R`\(A:B=2:3\) and \(B:C=4:5\): make \(B\) equal to 12 in both, so \(A:B:C=8:12:15\).`,
                ],
            },
            {
                topic: 'Proportional equation',
                points: [
                    R`Step 1: change the proportional equation into an ordinary equation, using <strong>product of means = product of extremes</strong>: \(a:b=c:d \Rightarrow bc=ad\).`,
                    R`Step 2: solve the ordinary equation.`,
                ],
            },
            {
                topic: 'Solve word problems with proportional equations',
                points: [
                    R`Step 1: set \(x\) based on the ratio before the change (\(3:5\) becomes \(3x\) and \(5x\)).`,
                    R`Step 2: represent both quantities after the change using \(x\).`,
                    R`Step 3: set up the equation using the ratio after the change.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Ratio of three quantities',
                q: R`In a box of beads, red : blue \(=2:3\) and blue : green \(=4:5\). Find red : blue : green, and red : green.`,
                steps: [
                    R`Blue is the common quantity. It is 3 in one ratio and 4 in the other; the least common multiple of 3 and 4 is 12.`,
                    R`Red : blue \(=2:3=8:12\) (multiply both terms by 4).`,
                    R`Blue : green \(=4:5=12:15\) (multiply both terms by 3).`,
                    R`Blue is now 12 in both, so red : blue : green \(=8:12:15\), and red : green \(=8:15\).`,
                ],
                answer: R`\(8:12:15\) and \(8:15\)`,
            },
            {
                title: 'Sharing with a three-part ratio',
                q: R`Three friends share 140 stickers. Amy's and Bo's shares are in the ratio \(2:3\), and Bo's and Cy's are in the ratio \(4:5\). How many stickers does Cy get?`,
                fig: F.row(bars([{ label: 'Amy', n: 8 }, { label: 'Bo', n: 12, fill: F.colors.SHADE }, { label: 'Cy', n: 15 }], { cell: 13 })),
                steps: [
                    R`Unify the common quantity, Bo, to the LCM 12: Amy : Bo : Cy \(=8:12:15\).`,
                    R`Total parts: \(8+12+15=35\).`,
                    R`One part: \(140\div35=4\) stickers.`,
                    R`Cy has 15 parts: \(15\times4=60\) stickers.`,
                ],
                answer: R`60 stickers`,
            },
            {
                title: 'A proportional equation',
                q: R`Solve \((x+2):5=6:10\).`,
                steps: [
                    R`The extremes are \(x+2\) and \(10\); the means are \(5\) and \(6\).`,
                    R`Step 1 — product of means = product of extremes: \(5\times6=10(x+2)\).`,
                    R`Step 2 — solve: \(30=10x+20\), so \(10x=10\) and \(x=1\).`,
                    R`Check: \((1+2):5=3:5\) and \(6:10=3:5\). ✓`,
                ],
                answer: R`\(x=1\)`,
            },
            {
                title: 'A ratio that changes',
                q: R`A bag holds red and blue marbles in the ratio \(5:3\). After 12 red marbles are taken out, the ratio of red to blue is \(7:6\). How many blue marbles are in the bag?`,
                steps: [
                    R`Step 1 — set \(x\) from the ratio before the change: red \(=5x\), blue \(=3x\).`,
                    R`Step 2 — after the change: red \(=5x-12\), blue \(=3x\).`,
                    R`Step 3 — use the ratio after the change: \((5x-12):3x=7:6\).`,
                    R`Product of means = product of extremes: \(3x\times7=6(5x-12)\), so \(21x=30x-72\), \(9x=72\), \(x=8\).`,
                    R`Blue marbles: \(3\times8=24\). (Red: 40, then 28; and \(28:24=7:6\) ✓)`,
                ],
                answer: R`24 blue marbles`,
            },
            {
                title: 'Moving from one to the other',
                q: R`Maya and Noah have money in the ratio \(7:3\). After Maya gives Noah $10, the ratio is \(3:2\). How much did Maya have at first?`,
                steps: [
                    R`Step 1 — before: Maya \(=7x\), Noah \(=3x\).`,
                    R`Step 2 — after: Maya \(=7x-10\), Noah \(=3x+10\). (What one loses, the other gains.)`,
                    R`Step 3 — \((7x-10):(3x+10)=3:2\), so \(3(3x+10)=2(7x-10)\).`,
                    R`\(9x+30=14x-20\), so \(5x=50\) and \(x=10\).`,
                    R`Maya had \(7\times10=70\) dollars. (Check: 70 and 30 become 60 and 40, and \(60:40=3:2\) ✓)`,
                ],
                answer: R`$70`,
            },
            {
                title: 'Direct or inverse?',
                q: R`(a) 8 pumps empty a flooded field in 15 hours. How long would 12 pumps take? &nbsp; (b) 8 pumps move 600 litres in a minute. How much do 12 pumps move in a minute?`,
                steps: [
                    R`(a) More pumps, <em>less</em> time: inverse proportion. The product stays the same: \(8\times15=120\) pump-hours.`,
                    R`(a) \(120\div12=10\) hours.`,
                    R`(b) More pumps, <em>more</em> water: direct proportion. \(8:600=12:x\).`,
                    R`(b) Product of means = product of extremes: \(8x=600\times12=7200\), so \(x=900\) litres.`,
                ],
                answer: R`(a) 10 hours &nbsp; (b) 900 litres`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'simplify-ratio', name: 'Simplest form', level: 1,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 2, 2, 3]);
                    if (form === 1) {
                        let p; do { p = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)]; } while (red(p).join() !== p.join() || new Set(p).size < 3);
                        const g = rng.int(2, 9), a = p.map(x => x * g);
                        return { q: R`Write the ratio ${m(rt(a))} in simplest form.`, ans: CA.ratio(a), sol: R`Divide every term by the greatest common factor, ${g}: ${m(R`${rt(a)}=${rt(p)}`)}.` };
                    }
                    const [p, q] = pq(rng), g = rng.int(2, 12), a = p * g, b = q * g;
                    if (form === 0) return { q: R`Write the ratio ${m(rt([a, b]))} in simplest form.`, ans: CA.ratio([a, b]), sol: R`Divide both terms by the greatest common factor, ${g}: ${m(R`${a}:${b}=${p}:${q}`)}.` };
                    const [place, gx, gy, all] = rng.pick(GROUPS);
                    if (form === 2) {
                        const flip = rng.bool();
                        return {
                            q: R`${place} there are ${a} ${gx} and ${b} ${gy}. Write the ratio of ${flip ? gy : gx} to ${flip ? gx : gy} in simplest form.`,
                            ans: CA.ratio(flip ? [b, a] : [a, b]),
                            sol: R`Keep the order asked for: ${m(flip ? R`${b}:${a}=${q}:${p}` : R`${a}:${b}=${p}:${q}`)} (divide both by ${g}).`,
                        };
                    }
                    const first = rng.bool(), part = first ? a : b, w = red([part, a + b]);
                    return {
                        q: R`${place} there are ${a} ${gx} and ${b} ${gy}. Write the ratio of ${first ? gx : gy} to all the ${all} in simplest form.`,
                        ans: CA.ratio([part, a + b]),
                        sol: R`There are ${m(R`${a}+${b}=${a + b}`)} ${all} altogether. ${m(R`${part}:${a + b}=${w[0]}:${w[1]}`)}.`,
                    };
                },
            },
            {
                id: 'proportion-basic', name: 'Means and extremes', level: 1,
                gen(rng) {
                    let p, q, k1, k2;
                    do { [p, q] = pq(rng); k1 = rng.int(1, 9); k2 = rng.int(2, 12); } while (k1 === k2);
                    const t = [p * k1, q * k1, p * k2, q * k2], pos = rng.int(0, 3), x = t[pos];
                    const s = t.map((v, i) => (i === pos ? 'x' : v));
                    const eq = R`${s[0]}:${s[1]}=${s[2]}:${s[3]}`;
                    const extreme = pos === 0 || pos === 3;
                    const other = t[3 - pos];                                     // the partner of x (0↔3, 1↔2)
                    const prod = extreme ? t[1] * t[2] : t[0] * t[3];
                    const [f1, f2] = extreme ? [t[1], t[2]] : [t[0], t[3]];
                    return {
                        q: R`Solve the proportional equation ${m(eq)}.`,
                        ans: CA.num(x),
                        sol: R`Product of means = product of extremes: ${m(R`${other}x=${f1}\times${f2}`)}, so ${m(R`${other}x=${prod}`)} and ${m(R`x=${prod}\div${other}=${x}`)}.`,
                    };
                },
            },
            {
                id: 'unit-rate', name: 'Unit rates and best buys', level: 1,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 2, 3, 4, 4]);
                    if (form === 0) {
                        const [who, lo, hi, step, du, tu] = rng.pick([['A cyclist rides', 12, 28, 1, 'km', 'hour'], ['A car travels', 50, 110, 5, 'km', 'hour'], ['A sprinter runs', 6, 10, 1, 'm', 'second'], ['A train travels', 80, 240, 10, 'km', 'hour'], ['A snail crawls', 4, 15, 1, 'cm', 'minute'], ['A plane flies', 600, 900, 50, 'km', 'hour']]);
                        const v = lo + step * rng.int(0, (hi - lo) / step), t = rng.int(2, 9);
                        return {
                            q: R`${who} ${v * t} ${du} in ${t} ${tu}s at a steady speed. What is the speed, in ${du} per ${tu}?`,
                            ans: CA.num(v, R`${du} per ${tu}`),
                            sol: R`Speed = distance ÷ time: ${m(R`${v * t}\div${t}=${v}`)} ${du} per ${tu}.`,
                        };
                    }
                    if (form === 1) {
                        const [thing, unit] = rng.pick([['apples', 'kg'], ['rice', 'kg'], ['cheese', 'kg'], ['ribbon', 'metre'], ['petrol', 'litre'], ['rope', 'metre'], ['cherries', 'kg']]);
                        const cents = 25 * rng.int(3, 24), w = rng.int(2, 9);
                        return {
                            q: R`${w} ${unit}${unit === 'kg' ? '' : 's'} of ${thing} cost $${(cents * w / 100).toFixed(2)}. What is the price per ${unit}?`,
                            ans: CA.num(cents / 100, '$'),
                            sol: R`Unit price = cost ÷ amount: ${m(R`${(cents * w / 100).toFixed(2)}\div${w}=${(cents / 100).toFixed(2)}`)} dollars per ${unit}.`,
                        };
                    }
                    if (form === 2) {
                        const [stuff, d] = rng.pick([['aluminium', 27], ['iron', 78], ['copper', 89], ['silver', 105], ['lead', 113], ['gold', 193], ['ice', 9], ['glass', 25], ['oak wood', 7], ['granite', 27]]);
                        const V = rng.pick([10, 20, 30, 40, 50, 100, 200]), M = d * V / 10;
                        return {
                            q: R`A piece of ${stuff} has a mass of ${M} g and a volume of ${V} cm³. What is its density, in grams per cm³?`,
                            ans: CA.num(d / 10, 'g/cm³'),
                            sol: R`Density = mass ÷ volume: ${m(R`${M}\div${V}=${dec(d, 1)}`)} g per cm³.`,
                        };
                    }
                    if (form === 3) {
                        const [who, items, tu] = rng.pick([['A typist types', 'words', 'minute'], ['A tap delivers', 'litres of water', 'minute'], ['A heart beats', 'times', 'minute'], ['A factory makes', 'toys', 'hour'], ['A reader reads', 'pages', 'hour'], ['A printer prints', 'pages', 'minute']]);
                        const r = rng.int(12, 75), t = rng.int(3, 12);
                        return {
                            q: R`${who} ${r * t} ${items} in ${t} ${tu}s at a steady rate. What is the unit rate, in ${items} per ${tu}?`,
                            ans: CA.num(r, R`per ${tu}`),
                            sol: R`Divide by the number of ${tu}s: ${m(R`${r * t}\div${t}=${r}`)} ${items} per ${tu}.`,
                        };
                    }
                    // best buy
                    const [items, single] = rng.pick([['pencils', 'pencil'], ['eggs', 'egg'], ['bottles of water', 'bottle'], ['tennis balls', 'ball'], ['notebooks', 'notebook'], ['bread rolls', 'roll'], ['batteries', 'battery'], ['yoghurts', 'yoghurt']]);
                    const base = rng.pick([20, 25, 30, 40, 50, 60, 75, 90]);
                    const ns = rng.sample([4, 5, 6, 8, 10, 12, 15, 20], 3).sort((a, b) => a - b), us = rng.sample([0, 2, 4, 5, 6, 8, 10], 3).map(x => base + x);
                    const price = i => (ns[i] * us[i] / 100).toFixed(2), best = us.indexOf(Math.min(...us));
                    const packs = ['Pack A', 'Pack B', 'Pack C'];
                    return {
                        q: R`A shop sells the same ${items} in three packs. Pack A: ${ns[0]} for $${price(0)}. Pack B: ${ns[1]} for $${price(1)}. Pack C: ${ns[2]} for $${price(2)}. Which pack has the lowest price per ${single}?`,
                        ans: CA.mc(rng, packs[best], packs, { keepOrder: true }),
                        sol: R`Compare unit prices (dollars per ${single}). ` + [0, 1, 2].map(i => R`${packs[i].slice(5)}: ${m(R`${price(i)}\div${ns[i]}=${(us[i] / 100).toFixed(2)}`)}`).join('; ') + R`. ${packs[best]} is the cheapest per ${single}.`,
                    };
                },
            },
            {
                id: 'share-simple', name: 'Share in a ratio', level: 1,
                gen(rng) {
                    const three = rng.bool(0.35), n = three ? 3 : 2, names = rng.sample(NAMES, n);
                    let parts; do { parts = Array.from({ length: n }, () => rng.int(1, 9)); } while (red(parts).join() !== parts.join() || new Set(parts).size < n);
                    const tot = parts.reduce((a, b) => a + b), u = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]), N = tot * u, who = rng.int(0, n - 1);
                    const [thing, unit] = rng.pick([['$' + N, '$'], [R`${N} stickers`, 'stickers'], [R`${N} sweets`, 'sweets'], [R`${N} marbles`, 'marbles'], [R`${N} mL of juice`, 'mL'], [R`${N} trading cards`, 'cards']]);
                    const list = n === 2 ? R`${names[0]} and ${names[1]}` : R`${names[0]}, ${names[1]} and ${names[2]}`;
                    return {
                        q: R`${list} share ${thing} in the ratio ${m(rt(parts))}. ${unit === '$' ? 'How much money' : unit === 'mL' ? 'How much juice' : 'How many ' + unit} does ${names[who]} get?`,
                        ans: CA.num(parts[who] * u, unit),
                        sol: R`Total parts: ${m(R`${parts.join('+')}=${tot}`)}. One part: ${m(R`${N}\div${tot}=${u}`)}. ${names[who]} has ${parts[who]} part${parts[who] === 1 ? '' : 's'}: ${m(R`${parts[who]}\times${u}=${parts[who] * u}`)}.`,
                    };
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'ratio-in-disguise', name: 'Ratios with units, fractions, decimals and percents', level: 2,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 2, 3, 3]);
                    if (form === 0) {
                        const [su, bu, f, Ss, Bs] = rng.pick([
                            ['cm', 'm', 100, [20, 25, 40, 50, 60, 75, 80, 120, 150], [1, 2, 3, 4, 5]], ['g', 'kg', 1000, [200, 250, 400, 500, 600, 750, 800, 1200, 1500], [1, 2, 3, 4, 5]],
                            ['minutes', 'hours', 60, [15, 20, 24, 30, 36, 40, 45, 48, 50, 90], [1, 2, 3]], ['mL', 'L', 1000, [200, 250, 300, 400, 500, 600, 750, 1500], [1, 2, 3, 4]],
                            ['mm', 'cm', 10, [4, 5, 6, 8, 15, 25, 35], [1, 2, 3, 4, 5, 6]], ['m', 'km', 1000, [200, 250, 400, 500, 600, 750, 800], [1, 2, 3, 4, 5]],
                            ['seconds', 'minutes', 60, [10, 15, 20, 24, 36, 40, 45, 50, 90], [1, 2, 3, 4]], ['cents', 'dollars', 100, [20, 25, 40, 50, 60, 75, 80, 120, 150], [1, 2, 3, 4, 5]],
                        ]);
                        let S, B; do { S = rng.pick(Ss); B = rng.pick(Bs); } while (S === B * f);
                        const smallFirst = rng.bool(), pair = smallFirst ? [S, B * f] : [B * f, S], rr = red(pair);
                        const sText = R`${S} ${su}`, bText = B === 1 ? R`1 ${bu.replace(/s$/, '')}` : R`${B} ${bu}`;
                        return {
                            q: R`Write the ratio ${smallFirst ? R`${sText} : ${bText}` : R`${bText} : ${sText}`} in simplest form.`,
                            ans: CA.ratio(pair),
                            sol: R`Use the same unit: ${bText} = ${B * f} ${su}. Then ${m(R`${rt(pair)}=${rt(rr)}`)}.`,
                        };
                    }
                    if (form === 1) {
                        let p1, q1, p2, q2;
                        do { q1 = rng.int(2, 8); p1 = rng.int(1, q1 - 1); q2 = rng.int(2, 8); p2 = rng.int(1, q2 - 1); } while (!coprime(p1, q1) || !coprime(p2, q2) || p1 * q2 === p2 * q1);
                        const L = CA.lcm(q1, q2), pair = [p1 * L / q1, p2 * L / q2];
                        return {
                            q: R`Write the ratio ${m(R`\frac{${p1}}{${q1}}:\frac{${p2}}{${q2}}`)} in simplest form, using whole numbers.`,
                            ans: CA.ratio(pair),
                            sol: R`Multiply both terms by ${L}, the least common multiple of the denominators: ${m(R`${rt(pair)}`)}` + (red(pair).join() === pair.join() ? '.' : R`, which simplifies to ${m(rt(red(pair)))}.`),
                        };
                    }
                    if (form === 2) {
                        let x, y; do { x = rng.int(2, 48); y = rng.int(2, 48); } while (x === y || (x % 10 === 0 && y % 10 === 0) || Math.max(...red([x, y])) > 20);
                        return {
                            q: R`Write the ratio ${m(R`${dec(x, 1)}:${dec(y, 1)}`)} in simplest form, using whole numbers.`,
                            ans: CA.ratio([x, y]),
                            sol: R`Multiply both terms by 10: ${m(R`${x}:${y}`)}` + (red([x, y]).join() === [x, y].join() ? '.' : R`, which simplifies to ${m(rt(red([x, y])))}.`),
                        };
                    }
                    const pc = rng.pick([10, 15, 20, 25, 30, 35, 40, 45, 60, 65, 70, 75, 80, 12, 36, 55, 85]);
                    const sub = rng.int(0, 2), [place, gx, gy, all] = rng.pick(GROUPS), [A, B] = rng.sample(NAMES, 2);
                    if (sub === 0) return {
                        q: R`${place}, ${pc}% of the ${all} are ${gx} and the rest are ${gy}. Write the ratio of ${gx} to ${gy} in simplest form.`,
                        ans: CA.ratio([pc, 100 - pc]),
                        sol: R`The rest is ${m(R`100-${pc}=${100 - pc}`)} percent. ${m(R`${pc}:${100 - pc}=${rt(red([pc, 100 - pc]))}`)}.`,
                    };
                    const more = sub === 1, top = more ? 100 + pc : 100 - pc;
                    return {
                        q: R`${A} has ${pc}% ${more ? 'more' : 'less'} money than ${B}. Write the ratio of ${A}'s money to ${B}'s money in simplest form.`,
                        ans: CA.ratio([top, 100]),
                        sol: R`Call ${B}'s money 100. Then ${A} has ${m(R`100${more ? '+' : '-'}${pc}=${top}`)}. ${m(R`${top}:100=${rt(red([top, 100]))}`)}.`,
                    };
                },
            },
            {
                id: 'combine-ratios', name: 'Ratio of three quantities', level: 2,
                gen(rng) {
                    const c = twoRatios(rng), form = rng.pick([0, 0, 0, 1]);
                    const [intro, N] = [
                        [(a, b) => R`${m(R`A:B=${a}`)} and ${m(R`B:C=${b}`)}.`, ['A', 'B', 'C']],
                        [(a, b) => R`In a box of beads, red : blue ${m('=' + a)} and blue : green ${m('=' + b)}.`, ['red', 'blue', 'green']],
                        [(a, b) => R`The ages of Xan and Yuki are in the ratio ${m(a)}, and the ages of Yuki and Zed are in the ratio ${m(b)}.`, ['Xan', 'Yuki', 'Zed']],
                        [(a, b) => R`A fruit stall has apples and pears in the ratio ${m(a)}, and pears and plums in the ratio ${m(b)}.`, ['apples', 'pears', 'plums']],
                        [(a, b) => R`In an alloy, the masses of copper and zinc are in the ratio ${m(a)}, and the masses of zinc and tin are in the ratio ${m(b)}.`, ['copper', 'zinc', 'tin']],
                        [(a, b) => R`The lengths of three ribbons satisfy ${m(R`P:Q=${a}`)} and ${m(R`Q:R=${b}`)}.`, ['P', 'Q', 'R']],
                    ][(c.p + 2 * c.q + 3 * c.r + 5 * c.s + rng.int(0, 1)) % 6];
                    const given = intro(rt([c.p, c.q]), rt([c.r, c.s]));
                    if (form === 0) return {
                        q: R`${given} Find the ratio ${N.join(' : ')} in simplest form.`,
                        ans: CA.ratio(c.abc),
                        sol: unify(c, N),
                    };
                    const ac = red([c.abc[0], c.abc[2]]);
                    return {
                        q: R`${given} Find the ratio ${N[0]} : ${N[2]} in simplest form.`,
                        ans: CA.ratio([c.abc[0], c.abc[2]]),
                        sol: R`${unify(c, N)} Reading off the two outside terms, ${m(R`${c.abc[0]}:${c.abc[2]}`)}` + (ac[0] === c.abc[0] ? '.' : R`, which simplifies to ${m(rt(ac))}.`),
                    };
                },
            },
            {
                id: 'proportion-equation', name: 'Proportional equations', level: 2,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 2, 2, 3, 4, 5]);
                    const pm = 'Product of means = product of extremes:';
                    if (form <= 2) {                // a term such as x + p, or 2x + p
                        for (;;) {
                            const [u, v] = pq(rng, 7), k = rng.int(1, 6), j = rng.int(1, 6), c = form === 2 ? rng.int(2, 4) : 1, x = rng.int(1, 12);
                            const pcon = u * k - c * x;      // cx + pcon = u·k
                            if (k === j || pcon === 0 || Math.abs(pcon) > 12) continue;
                            const term = R`(${lin(c, pcon)})`, q = v * k, r = u * j, s = v * j;
                            const flip = form === 1;          // q : (x+p) = s : r
                            const eq = flip ? R`${q}:${term}=${s}:${r}` : R`${term}:${q}=${r}:${s}`;
                            return {
                                q: R`Solve the proportional equation ${m(eq)}.`,
                                ans: CA.num(x),
                                sol: R`${pm} ${m(R`${s === 1 ? lin(c, pcon) : s + term}=${q}\times${r}`)}, so ${m(R`${lin(s * c, s * pcon)}=${q * r}`)}` + (s * c === 1 ? '' : R`, ${m(R`${s * c}x=${q * r - s * pcon}`)}`) + R` and ${m(R`x=${x}`)}.`,
                            };
                        }
                    }
                    if (form === 3) {               // a fraction answer
                        let a, b, c; do { a = rng.int(2, 9); b = rng.int(2, 9); c = rng.int(2, 9); } while ((a * b) % c === 0 || !coprime(b, c));
                        const flip = rng.bool();
                        return {
                            q: R`Solve the proportional equation ${m(flip ? R`${b}:${c}=x:${a}` : R`x:${a}=${b}:${c}`)}. Give ${m('x')} as a fraction in lowest terms.`,
                            ans: CA.frac(a * b, c),
                            sol: R`${pm} ${m(R`${c}x=${a}\times${b}=${a * b}`)}, so ${m(R`x=${fr(a * b, c)}`)}.`,
                        };
                    }
                    if (form === 4) {               // unit fractions as terms
                        let a, b; do { a = rng.int(2, 6); b = rng.int(2, 9); } while (a === b);
                        const k = rng.int(1, 6), d = b * k;
                        return {
                            q: R`Solve the proportional equation ${m(R`\frac{1}{${a}}:\frac{1}{${b}}=${d}:x`)}.`,
                            ans: CA.num(a * k),
                            sol: R`${pm} ${m(R`\frac{1}{${b}}\times${d}=\frac{1}{${a}}\times x`)}, so ${m(R`${k}=\frac{x}{${a}}`)} and ${m(R`x=${a * k}`)}.`,
                        };
                    }
                    // decimals as terms
                    for (;;) {
                        const a = rng.int(2, 25), r = rng.int(2, 9), s = rng.int(2, 12), x10 = a * s / r;      // a/10 : x = r : s
                        if (!Number.isInteger(x10) || r === s || a % 10 === 0) continue;
                        return {
                            q: R`Solve the proportional equation ${m(R`${dec(a, 1)}:x=${r}:${s}`)}.`,
                            ans: CA.num(x10 / 10, '', { tol: 1e-9, show: m(dec(x10, 1)) }),
                            sol: R`${pm} ${m(R`${r}x=${dec(a, 1)}\times${s}=${dec(a * s, 1)}`)}, so ${m(R`x=${dec(a * s, 1)}\div${r}=${dec(x10, 1)}`)}.`,
                        };
                    }
                },
            },
            {
                id: 'ratio-change', name: 'A ratio that changes', level: 2,
                gen(rng) { return ratioChange(rng, false); },
            },
            {
                id: 'ratio-parts', name: 'Totals, differences and parts', level: 2,
                gen(rng) {
                    const form = rng.int(0, 4);
                    if (form <= 1) {
                        const [p, q] = pq(rng), u = rng.int(2, 15), [place, gx, gy, all] = rng.pick(GROUPS);
                        if (form === 0) return {
                            q: R`${place}, the ratio of ${gx} to ${gy} is ${m(rt([p, q]))}. There are ${p * u} ${gx}. How many ${gy} are there?`,
                            ans: CA.num(q * u, gy),
                            sol: R`${p} parts are ${p * u}, so one part is ${m(R`${p * u}\div${p}=${u}`)}. ${cap(gy)}: ${m(R`${q}\times${u}=${q * u}`)}.`,
                        };
                        const big = p > q ? gx : gy, small = p > q ? gy : gx, d = Math.abs(p - q);
                        return {
                            q: R`${place}, the ratio of ${gx} to ${gy} is ${m(rt([p, q]))}. There are ${d * u} more ${big} than ${small}. How many ${all} are there altogether?`,
                            ans: CA.num((p + q) * u, all),
                            sol: R`The difference is ${m(R`${Math.max(p, q)}-${Math.min(p, q)}=${d}`)} part${d === 1 ? '' : 's'}, so one part is ${m(R`${d * u}\div${d}=${u}`)}. Altogether there are ${m(R`${p}+${q}=${p + q}`)} parts: ${m(R`${p + q}\times${u}=${(p + q) * u}`)}.`,
                        };
                    }
                    if (form === 2) {
                        let a; do { a = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)]; } while (180 % (a[0] + a[1] + a[2]) !== 0 || red(a).join() !== a.join() || new Set(a).size < 2);
                        const tot = a[0] + a[1] + a[2], u = 180 / tot, big = rng.bool(), pick = big ? Math.max(...a) : Math.min(...a);
                        return {
                            q: R`The three angles of a triangle are in the ratio ${m(rt(a))}. What is the size of the ${big ? 'largest' : 'smallest'} angle?`,
                            ans: CA.num(pick * u, '°'),
                            sol: R`The angles add up to 180°, which is ${m(R`${a.join('+')}=${tot}`)} parts. One part: ${m(R`180\div${tot}=${u}`)}. The ${big ? 'largest' : 'smallest'} angle has ${pick} part${pick === 1 ? '' : 's'}: ${m(R`${pick}\times${u}=${pick * u}`)} degrees.`,
                        };
                    }
                    if (form === 3) {
                        let p, q; do { [p, q] = pq(rng, 7); } while (p < q);
                        const u = rng.int(2, 9), P = 2 * (p + q) * u;
                        return {
                            q: R`The length and width of a rectangle are in the ratio ${m(rt([p, q]))}. Its perimeter is ${P} cm. What is its area?`,
                            ans: CA.num(p * q * u * u, 'cm²'),
                            sol: R`Length + width is half the perimeter, ${P / 2} cm, which is ${m(R`${p}+${q}=${p + q}`)} parts. One part: ${m(R`${P / 2}\div${p + q}=${u}`)} cm. The sides are ${p * u} cm and ${q * u} cm, so the area is ${m(R`${p * u}\times${q * u}=${p * q * u * u}`)} cm².`,
                        };
                    }
                    let a; do { a = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)]; } while (red(a).join() !== a.join() || new Set(a).size < 3);
                    const tot = a[0] + a[1] + a[2], u = rng.int(2, 12), names = rng.sample(NAMES, 3), d = Math.max(...a) - Math.min(...a);
                    return {
                        q: R`${names[0]}, ${names[1]} and ${names[2]} share ${tot * u} stickers in the ratio ${m(rt(a))}. How many more stickers does the largest share have than the smallest share?`,
                        ans: CA.num(d * u, 'stickers'),
                        sol: R`Total parts: ${m(R`${a.join('+')}=${tot}`)}. One part: ${m(R`${tot * u}\div${tot}=${u}`)}. The largest and smallest shares differ by ${m(R`${Math.max(...a)}-${Math.min(...a)}=${d}`)} part${d === 1 ? '' : 's'}: ${m(R`${d}\times${u}=${d * u}`)}.`,
                    };
                },
            },
            {
                id: 'direct-inverse', name: 'Direct and inverse proportion', level: 2,
                gen(rng) {
                    if (rng.bool()) {               // direct: j·x of one thing goes with k·x of another
                        let j, k, x, y; do { [j, k] = pq(rng, 9, 2); x = rng.int(2, 9); y = rng.int(2, 12); } while (x === y);
                        const [q, a1, b1, a2, ans, unit, b2] = rng.pick([
                            [R`${j * x} notebooks cost $${k * x}. At the same price each, how much do ${j * y} notebooks cost?`, j * x, k * x, j * y, CA.num(k * y, '$'), 'dollars', k * y],
                            [R`A car uses ${k * x} litres of petrol to travel ${j * x * 10} km. At the same rate, how many litres does it need for ${j * y * 10} km?`, j * x * 10, k * x, j * y * 10, CA.num(k * y, 'litres'), 'litres', k * y],
                            [R`A recipe for ${j * x} pancakes uses ${k * x * 10} g of flour. How much flour is needed for ${j * y} pancakes?`, j * x, k * x * 10, j * y, CA.num(k * y * 10, 'g'), 'g', k * y * 10],
                            [R`A printer prints ${k * x * 5} pages in ${j * x} minutes. At the same rate, how many pages does it print in ${j * y} minutes?`, j * x, k * x * 5, j * y, CA.num(k * y * 5, 'pages'), 'pages', k * y * 5],
                            [R`A ${j * x} m length of cable has a mass of ${k * x} kg. What is the mass of ${j * y} m of the same cable?`, j * x, k * x, j * y, CA.num(k * y, 'kg'), 'kg', k * y],
                            [R`On a plan, ${j * x} cm stands for ${k * x} m. What real length does ${j * y} cm on the plan stand for?`, j * x, k * x, j * y, CA.num(k * y, 'm'), 'm', k * y],
                        ]);
                        return {
                            q, ans,
                            sol: R`Direct proportion: the ratio stays the same. ${m(R`${a1}:${b1}=${a2}:x`)}, so (product of means = product of extremes) ${m(R`${a1}x=${b1}\times${a2}=${b1 * a2}`)} and ${m(R`x=${b2}`)} ${unit}.`,
                        };
                    }
                    let n1, d1, n2, P;
                    do { n1 = rng.int(3, 12); d1 = rng.int(4, 20); P = n1 * d1; n2 = rng.int(2, 30); } while (n2 === n1 || P % n2 !== 0 || P / n2 < 2);
                    const d2 = P / n2;
                    const [q, unit, what] = rng.pick([
                        [R`${n1} workers can build a wall in ${d1} days. Working at the same rate, how many days would ${n2} workers take?`, 'days', 'worker-days'],
                        [R`${n1} identical taps fill a pool in ${d1} hours. How many hours would ${n2} of these taps take?`, 'hours', 'tap-hours'],
                        [R`A bag of feed lasts ${n1} horses for ${d1} days. How many days would the same bag last ${n2} horses?`, 'days', 'horse-days of feed'],
                        [R`A hall's chairs are set out in ${n1} equal rows of ${d1}. If the same chairs are set out in ${n2} equal rows instead, how many chairs are in each row?`, 'chairs', 'chairs in all'],
                        [R`Travelling at ${n1 * 5} km/h, a journey takes ${d1} hours. How many hours would the same journey take at ${n2 * 5} km/h?`, 'hours', ''],
                        [R`A book has ${d1 * 10} pages when printed with ${n1 * 5} lines on each page. How many pages would it have with ${n2 * 5} lines on each page?`, 'pages', ''],
                    ]);
                    const speed = /km\/h/.test(q), book = /lines/.test(q);
                    return {
                        q, ans: CA.num(book ? d2 * 10 : d2, unit),
                        sol: speed ? R`Inverse proportion: speed × time stays the same (it is the distance). ${m(R`${n1 * 5}\times${d1}=${n1 * 5 * d1}`)} km, and ${m(R`${n1 * 5 * d1}\div${n2 * 5}=${d2}`)} hours.`
                            : book ? R`Inverse proportion: lines per page × pages stays the same. ${m(R`${n1 * 5}\times${d1 * 10}=${n1 * d1 * 50}`)} lines, and ${m(R`${n1 * d1 * 50}\div${n2 * 5}=${d2 * 10}`)} pages.`
                            : R`Inverse proportion: the product stays the same. ${m(R`${n1}\times${d1}=${P}`)} ${what}, and ${m(R`${P}\div${n2}=${d2}`)} ${unit}.`,
                    };
                },
            },
            {
                id: 'scale-map', name: 'Scale drawings and maps', level: 2,
                gen(rng) {
                    const form = rng.int(0, 4);
                    if (form <= 2) {
                        const n = rng.pick([20000, 25000, 50000, 100000, 200000, 250000, 500000]);
                        let cm; do { cm = rng.int(2, 24); } while (!Number.isInteger(cm * n / 100000 * 2));
                        const km = cm * n / 100000;
                        const nice = n.toLocaleString('en-US').replace(/,/g, R`\,`);
                        if (form === 0) return {
                            q: R`A map has a scale of ${m(R`1:${nice}`)}. Two towns are ${cm} cm apart on the map. What is the real distance between them, in kilometres?`,
                            ans: CA.num(km, 'km'),
                            sol: R`Real distance: ${m(R`${cm}\times${n}=${cm * n}`)} cm. There are 100 000 cm in a kilometre, so this is ${m(R`${cm * n}\div100000=${km}`)} km.`,
                        };
                        if (form === 1) return {
                            q: R`A map has a scale of ${m(R`1:${nice}`)}. Two villages are really ${km} km apart. How far apart are they on the map, in centimetres?`,
                            ans: CA.num(cm, 'cm'),
                            sol: R`${km} km is ${m(R`${km}\times100000=${km * 100000}`)} cm. On the map: ${m(R`${km * 100000}\div${n}=${cm}`)} cm.`,
                        };
                        return {
                            q: R`On a map, ${cm} cm stands for a real distance of ${km} km. Write the scale of the map as a ratio in the form 1 : n.`,
                            ans: CA.ratio([1, n]),
                            sol: R`Use the same unit: ${km} km is ${m(R`${km}\times100000=${km * 100000}`)} cm. ${m(R`${cm}:${km * 100000}=1:${n}`)}.`,
                        };
                    }
                    const n = rng.pick([50, 100, 200, 250, 500]), a = rng.int(2, 12), b = rng.int(2, 12);
                    if (form === 3) {
                        const [what, model] = rng.pick([['The plan of a house', 'plan'], ['A scale drawing of a garden', 'drawing'], ['The plan of a sports field', 'plan']]);
                        return {
                            q: R`${what} uses a scale of ${m(R`1:${n}`)}. A wall is ${a} cm long on the ${model}. How long is the real wall, in metres?`,
                            ans: CA.num(a * n / 100, 'm'),
                            sol: R`Real length: ${m(R`${a}\times${n}=${a * n}`)} cm, which is ${m(R`${a * n}\div100=${a * n / 100}`)} m.`,
                        };
                    }
                    const [A, B] = [a * n / 100, b * n / 100];
                    return {
                        q: R`A plan is drawn to a scale of ${m(R`1:${n}`)}. On the plan, a rectangular garden measures ${a} cm by ${b} cm. What is the real area of the garden, in square metres?`,
                        ans: CA.num(A * B, 'm²'),
                        sol: R`Scale each length first: ${m(R`${a}\times${n}=${a * n}`)} cm = ${A} m, and ${m(R`${b}\times${n}=${b * n}`)} cm = ${B} m. Area: ${m(R`${A}\times${B}=${A * B}`)} m².`,
                    };
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'combined-share', name: 'Three quantities: sharing problems', level: 3,
                gen(rng) {
                    let c; do { c = twoRatios(rng); } while (new Set(c.abc).size < 3 || c.abc[0] + c.abc[1] + c.abc[2] > 60);
                    const [a, b, d] = c.abc, tot = a + b + d, u = rng.int(2, 12), form = rng.int(0, 2), who = rng.int(0, 2);
                    const [N, thing, pre, setup] = rng.pick([
                        [rng.sample(NAMES, 3), 'dollars', '$', n => R`${n[0]}, ${n[1]} and ${n[2]} share some money. The ratio of ${n[0]}'s share to ${n[1]}'s is ${m(rt([c.p, c.q]))}, and the ratio of ${n[1]}'s share to ${n[2]}'s is ${m(rt([c.r, c.s]))}.`],
                        [rng.sample(NAMES, 3), 'stamps', '', n => R`${n[0]}, ${n[1]} and ${n[2]} collect stamps. ${n[0]}'s and ${n[1]}'s collections are in the ratio ${m(rt([c.p, c.q]))}; ${n[1]}'s and ${n[2]}'s are in the ratio ${m(rt([c.r, c.s]))}.`],
                        [['the oaks', 'the pines', 'the birches'], 'trees', '', () => R`A park has oak, pine and birch trees. The ratio of oaks to pines is ${m(rt([c.p, c.q]))} and the ratio of pines to birches is ${m(rt([c.r, c.s]))}.`],
                        [['Class A', 'Class B', 'Class C'], 'students', '', () => R`In a school, the numbers of students in Class A and Class B are in the ratio ${m(rt([c.p, c.q]))}, and those in Class B and Class C are in the ratio ${m(rt([c.r, c.s]))}.`],
                    ]);
                    const short = N.map(x => x.replace(/^the /, ''));
                    const amt = v => (pre ? R`$${v}` : R`${v} ${thing}`);
                    const uni = unify(c, short.map(x => cap(x)));
                    const unit = pre ? '$' : thing;
                    const isPeople = /^[A-Z][a-z]+$/.test(N[0]);
                    const askOne = i => (isPeople ? R`How ${pre ? 'much does' : 'many ' + thing + ' does'} ${N[i]} ${pre ? 'get' : 'have'}?` : thing === 'trees' ? R`How many ${short[i]} are there?` : R`How many students are in ${N[i]}?`);
                    if (form === 0) return {
                        q: R`${setup(N)} Altogether there are ${amt(tot * u)}. ${askOne(who)}`,
                        ans: CA.num(c.abc[who] * u, unit),
                        sol: R`${uni} Total parts: ${m(R`${a}+${b}+${d}=${tot}`)}; one part is ${m(R`${tot * u}\div${tot}=${u}`)}. ${cap(short[who])}: ${m(R`${c.abc[who]}\times${u}=${c.abc[who] * u}`)}.`,
                    };
                    // a difference between the first and the third is given
                    const diff = Math.abs(a - d), hi = a > d ? 0 : 2, lo = 2 - hi;
                    const more = isPeople ? R`${N[hi]} ${pre ? 'gets' : 'has'} ${amt(diff * u)} more than ${N[lo]}.` : thing === 'trees' ? R`There are ${diff * u} more ${short[hi]} than ${short[lo]}.` : R`${N[hi]} has ${diff * u} more students than ${N[lo]}.`;
                    const base = R`${uni} The difference is ${m(R`${Math.max(a, d)}-${Math.min(a, d)}=${diff}`)} part${diff === 1 ? '' : 's'}, so one part is ${m(R`${diff * u}\div${diff}=${u}`)}.`;
                    if (form === 1) return {
                        q: R`${setup(N)} ${more} ${askOne(1)}`,
                        ans: CA.num(b * u, unit),
                        sol: R`${base} ${cap(short[1])}: ${m(R`${b}\times${u}=${b * u}`)}.`,
                    };
                    return {
                        q: R`${setup(N)} ${more} ${isPeople ? (pre ? 'How much money do they share altogether?' : R`How many ${thing} do they have altogether?`) : R`How many ${thing} are there altogether?`}`,
                        ans: CA.num(tot * u, unit),
                        sol: R`${base} Altogether there are ${m(R`${a}+${b}+${d}=${tot}`)} parts: ${m(R`${tot}\times${u}=${tot * u}`)}.`,
                    };
                },
            },
            {
                id: 'ratio-change-hard', name: 'Ratio changes: transfers, ages and more', level: 3,
                gen(rng) { return ratioChange(rng, true); },
            },
            {
                id: 'proportion-hard', name: 'Harder proportional equations', level: 3,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 1, 2]);
                    const pm = 'Product of means = product of extremes:';
                    if (form === 0) {               // (x + a) : (x + b) = p : q
                        for (;;) {
                            const x = rng.int(1, 15), a = rng.int(-9, 12), b = rng.int(-9, 12);
                            if (a === b || x + a < 1 || x + b < 1 || (a === 0 && b === 0)) continue;
                            const [p, q] = red([x + a, x + b]);
                            if (p > 12 || q > 12 || (p === x + a && a !== 0 && b !== 0 && rng.bool(0.7))) continue;
                            return {
                                q: R`Solve the proportional equation ${m(R`${plin(1, a)}:${plin(1, b)}=${p}:${q}`)}.`,
                                ans: CA.num(x),
                                sol: R`${pm} ${m(R`${p}${R`(${lin(1, b)})`}=${q}${R`(${lin(1, a)})`}`)}, so ${m(R`${lin(p, p * b)}=${lin(q, q * a)}`)}. Collect the terms: ${m(p > q ? R`${p - q}x=${q * a - p * b}` : R`${q - p}x=${p * b - q * a}`)}, so ${m(R`x=${x}`)}.`,
                            };
                        }
                    }
                    if (form === 1) {               // (cx + a) : u = (x + b) : v
                        for (;;) {
                            const x = rng.int(1, 12), c = rng.int(2, 4), a = rng.int(-9, 9), b = rng.int(-6, 9), u = rng.int(2, 9), v = rng.int(2, 9);
                            if (a === 0 || c * x + a < 1 || x + b < 1 || u === v || !coprime(u, v) || v * (c * x + a) !== u * (x + b) || v * c === u) continue;
                            const left = v * c - u;      // (vc − u) x = ub − va
                            return {
                                q: R`Solve the proportional equation ${m(R`(${lin(c, a)}):${u}=${plin(1, b)}:${v}`)}.`,
                                ans: CA.num(x),
                                sol: R`${pm} ${m(R`${u}${R`(${lin(1, b)})`}=${v}(${lin(c, a)})`)}, so ${m(R`${lin(u, u * b)}=${lin(v * c, v * a)}`)}. Collect the terms: ${m(left > 0 ? R`${left}x=${u * b - v * a}` : R`${-left}x=${v * a - u * b}`)}, so ${m(R`x=${x}`)}.`,
                            };
                        }
                    }
                    // a : x = x : b  with x positive
                    let x, a; do { x = rng.int(4, 24); a = rng.int(2, x - 1); } while ((x * x) % a !== 0);
                    const b = x * x / a, flip = rng.bool();
                    return {
                        q: R`The positive number ${m('x')} satisfies ${m(flip ? R`${b}:x=x:${a}` : R`${a}:x=x:${b}`)}. Find ${m('x')}.`,
                        ans: CA.num(x),
                        sol: R`${pm} ${m(R`x\times x=${a}\times${b}`)}, so ${m(R`x^2=${a * b}`)}. Since ${m('x')} is positive, ${m(R`x=${x}`)}.`,
                    };
                },
            },
            {
                id: 'compound-proportion', name: 'Two things change at once', level: 3,
                gen(rng) {
                    const form = rng.int(0, 2);
                    if (form <= 1) {
                        let r, w1, d1, w2, d2;
                        do { r = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15]); w1 = rng.int(2, 9); d1 = rng.int(2, 9); w2 = rng.int(2, 12); d2 = rng.int(2, 12); } while (w1 === w2 || d1 === d2);
                        const [who, items, made, tu] = rng.pick([['workers', 'toys', 'make', 'day'], ['machines', 'bottles', 'fill', 'minute'], ['bakers', 'loaves', 'bake', 'hour'], ['painters', 'fence panels', 'paint', 'hour'], ['printers', 'posters', 'print', 'minute'], ['pickers', 'crates of apples', 'pick', 'day']]);
                        const n1 = r * w1 * d1, n2 = r * w2 * d2;
                        const rate = R`One of the ${who} in one ${tu}: ${m(R`${n1}\div(${w1}\times${d1})=${r}`)} ${items}.`;
                        return form === 0 ? {
                            q: R`${w1} ${who} ${made} ${n1} ${items} in ${d1} ${tu}s. Working at the same rate, how many ${tu}s do ${w2} ${who} need to ${made} ${n2} ${items}?`,
                            ans: CA.num(d2, tu + 's'),
                            sol: R`${rate} So ${w2} ${who} ${made} ${m(R`${w2}\times${r}=${w2 * r}`)} each ${tu}, and need ${m(R`${n2}\div${w2 * r}=${d2}`)} ${tu}s.`,
                        } : {
                            q: R`${w1} ${who} ${made} ${n1} ${items} in ${d1} ${tu}s. Working at the same rate, how many ${items} do ${w2} ${who} ${made} in ${d2} ${tu}s?`,
                            ans: CA.num(n2, items),
                            sol: R`${rate} So ${w2} ${who} in ${d2} ${tu}s ${made} ${m(R`${w2}\times${d2}\times${r}=${n2}`)} ${items}.`,
                        };
                    }
                    let w1, d1, h1, w2, h2, tot;
                    do { w1 = rng.int(3, 12); d1 = rng.int(3, 15); h1 = rng.int(4, 9); w2 = rng.int(3, 15); h2 = rng.int(4, 10); tot = w1 * d1 * h1; } while (w1 === w2 || h1 === h2 || tot % (w2 * h2) !== 0 || tot / (w2 * h2) < 2 || tot / (w2 * h2) === d1);
                    const d2 = tot / (w2 * h2);
                    return {
                        q: R`${w1} workers, each working ${h1} hours a day, finish a job in ${d1} days. How many days would ${w2} workers need for the same job if each works ${h2} hours a day?`,
                        ans: CA.num(d2, 'days'),
                        sol: R`The job is ${m(R`${w1}\times${h1}\times${d1}=${tot}`)} worker-hours. ${w2} workers at ${h2} hours a day do ${m(R`${w2}\times${h2}=${w2 * h2}`)} worker-hours a day: ${m(R`${tot}\div${w2 * h2}=${d2}`)} days.`,
                    };
                },
            },
        ],

        assignment: [
            ['simplify-ratio', 3], ['proportion-basic', 5], ['unit-rate', 3], ['share-simple', 4],
            ['ratio-in-disguise', 2], ['combine-ratios', 6], ['proportion-equation', 5], ['ratio-change', 5], ['ratio-parts', 2], ['direct-inverse', 2], ['scale-map', 1],
            ['combined-share', 3], ['ratio-change-hard', 4], ['proportion-hard', 3], ['compound-proportion', 2],
        ],
    });

    function cap(s) { return s[0].toUpperCase() + s.slice(1); }
})();
