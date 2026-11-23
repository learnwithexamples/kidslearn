/* Challenge Academy — Lesson 13: Fun Word Problems */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, T = CA.tex;
    const { FILL, SHADE, ACCENT, INK } = F.colors;

    // ── Small helpers ────────────────────────────────────────────────────
    const n = x => T.num(x);                                                     // 2.25 → "2.25"
    const money = c => (c % 100 ? `$${(c / 100).toFixed(2)}` : `$${c / 100}`);  // cents → "$2.40" / "$18"
    const D = c => R`\$${c % 100 ? (c / 100).toFixed(2) : c / 100}`;            // cents → dollars inside maths
    const usd = c => CA.num(c / 100, '$');                                       // cents → dollar answer
    const cap = s => s.replace(/^./, ch => ch.toUpperCase());
    const NAMES = ['Mia', 'Leo', 'Ava', 'Sam', 'Noah', 'Zara', 'Ken', 'Priya', 'Omar', 'Lily', 'Ethan', 'Chloe', 'Ravi', 'Grace', 'Tom', 'Aisha'];
    const co = c => (c === 1 ? '' : c);                                         // 1x → x
    const pl = (k, w) => `${k} ${k === 1 ? w.replace(/s$/, '') : w}`;            // 1 bucket, 2 buckets
    const lin = (c, d = 0) => R`${c === 1 ? '' : c}x${d > 0 ? '+' + d : d < 0 ? d : ''}`;   // 3x+6, x-2
    const clock = mins => { const h = Math.floor(mins / 60), mm = mins % 60; return `${h}:${String(mm).padStart(2, '0')} am`; };
    /** Minutes from one clock time to another, split at the next full hour. */
    const clockSol = (s, e) => {
        const h1 = Math.ceil(s / 60) * 60;
        if (h1 === s || e <= h1) return `From ${clock(s)} to ${clock(e)} is ${hm(e - s)}${e - s >= 60 ? ` = ${e - s} min` : ''}.`;
        return `From ${clock(s)} to ${clock(h1)} is ${h1 - s} min, and from ${clock(h1)} to ${clock(e)} is ${hm(e - h1)}${e - h1 >= 60 ? ` = ${e - h1} min` : ''}. Total: ${h1 - s} + ${e - h1} = ${e - s} min.`;
    };
    const hm = mins => { const h = Math.floor(mins / 60), mm = mins % 60; return mm ? (h ? `${h} h ${mm} min` : `${mm} min`) : `${h} h`; };

    /** A problem.  `chk` holds the givens for the independent checker outside the repo; it never reaches a page. */
    function mk(q, ans, sol, chk, fig) {
        const o = fig ? { q, fig, ans, sol } : { q, ans, sol };
        Object.defineProperty(o, 'chk', { value: chk });
        return o;
    }

    // ── Figures ──────────────────────────────────────────────────────────
    /** The metric staircase: km → m → cm → mm. */
    function stairsFig() {
        const steps = [['km', ''], ['m', '× 1000'], ['cm', '× 100'], ['mm', '× 10']];
        let b = '';
        steps.forEach(([u, f], i) => {
            const x = 10 + i * 70, y = 12 + i * 26;
            b += F.rect(x, y, 54, 24, { fill: i % 2 ? FILL : SHADE }) + F.text(x + 27, y + 17, u, { bold: true });
            if (i) b += F.path(`M${x - 16} ${y - 14}Q${x - 6} ${y - 12} ${x - 2} ${y + 6}`, { stroke: ACCENT, width: 1.3 })
                + F.text(x - 14, y + 18, f, { size: 11, fill: ACCENT, anchor: 'end' });
        });
        b += F.text(150, 136, 'big unit → small unit: multiply', { size: 11 }) + F.text(150, 152, 'small unit → big unit: divide', { size: 11 });
        return F.svg(300, 160, b, { label: 'unit staircase' });
    }
    /** Buses: n students, s seats per bus.  Full buses shaded, the last one partly. */
    function busFig(N, S) {
        const k = Math.ceil(N / S), w = Math.min(44, 280 / k - 6);
        let b = '';
        for (let i = 0; i < k; i++) {
            const x = 6 + i * (w + 6), full = i < k - 1 ? 1 : (N - S * (k - 1)) / S;
            b += F.rect(x, 14, w, 34, { fill: '#ffffff' }) + F.rect(x, 14 + 34 * (1 - full), w, 34 * full, { fill: i < k - 1 ? SHADE : ACCENT, opacity: i < k - 1 ? 1 : 0.6 });
            b += F.circle(x + w * 0.25, 52, 4, { fill: INK }) + F.circle(x + w * 0.75, 52, 4, { fill: INK });
            b += F.text(x + w / 2, 72, i < k - 1 ? `${S}` : `${N - S * (k - 1)}`, { size: 11 });
        }
        return F.svg(12 + k * (w + 6), 80, b, { label: 'buses' });
    }
    const tankFig = (l, w, h, labels) => F.row(F.cap(F.box(l, w, h, { labels: labels || [`${l}`, `${w}`, `${h}`], max: 130 }), 'lengths in cm'));

    // ── Unit tables ──────────────────────────────────────────────────────
    const CONV = [
        { big: 'h', small: 'min', f: 60, step: 15, max: 8, rule: '1 h = 60 min', mixed: true },
        { big: 'h', small: 's', f: 3600, step: 900, max: 4, rule: '1 h = 60 min = 3600 s' },
        { big: 'kg', small: 'g', f: 1000, step: 50, max: 9, rule: '1 kg = 1000 g', mixed: true },
        { big: 'km', small: 'm', f: 1000, step: 50, max: 9, rule: '1 km = 1000 m', mixed: true },
        { big: 'm', small: 'cm', f: 100, step: 5, max: 9, rule: '1 m = 100 cm', mixed: true },
        { big: 'cm', small: 'mm', f: 10, step: 1, max: 40, rule: '1 cm = 10 mm', mixed: true },
        { big: 'm', small: 'mm', f: 1000, step: 10, max: 4, rule: '1 m = 100 cm = 1000 mm' },
        { big: 'km', small: 'cm', f: 100000, step: 5000, max: 3, rule: '1 km = 1000 m = 100000 cm' },
        { big: 'L', small: 'mL', f: 1000, step: 50, max: 9, rule: '1 L = 1000 mL', mixed: true },
        { big: 'L', small: 'cm³', f: 1000, step: 100, max: 9, rule: '1 L = 1000 cm³' },
    ];

    CA.register({
        id: 13,
        assignmentNote: 'Show your working in the space under each problem. Check the unit each answer asks for.',

        tutorial: [
            {
                h: 'Common unit conversions',
                html: R`
                <p>Word problems mix units all the time: a speed in km/h and a time in seconds, a price per kg and a bag
                   weighed in grams, a tank measured in cm and filled in litres. Before you calculate anything, put every
                   quantity into the <strong>same unit</strong>. These are the conversions to know by heart:</p>
                <table>
                    <tr><th>Time</th><td>1 h = 60 min = 3600 s</td></tr>
                    <tr><th>Money</th><td>1 dollar = 100 cents</td></tr>
                    <tr><th>Mass</th><td>1 kg = 1000 g</td></tr>
                    <tr><th>Length</th><td>1 km = 1000 m, &nbsp;1 m = 100 cm, &nbsp;1 cm = 10 mm</td></tr>
                    <tr><th>Capacity and volume</th><td>1 L = 1000 mL = 1000 cm³</td></tr>
                </table>
                ${F.row(stairsFig())}
                <div class="ca-key"><strong>Big unit → small unit: multiply.</strong> 3.75 kg = \(3.75\times1000=3750\) g.
                   <strong>Small unit → big unit: divide.</strong> 4250 mL = \(4250\div1000=4.25\) L.
                   A quick check: there are always <em>more</em> of the small units.</div>
                <div class="ca-warn"><strong>Mixed units.</strong> 3 kg 80 g is 3080 g, not 380 g. And 2 h 15 min is
                   \(2\frac{15}{60}=2.25\) h — <em>not</em> 2.15 h, because an hour has 60 minutes, not 100.</div>
                <div class="ca-tip"><strong>1 L = 1000 cm³</strong> joins volume to capacity: a box-shaped tank that measures
                   \(50\times40\times30=60\,000\) cm³ holds 60 L of water.</div>`,
            },
            {
                h: 'Converting inside a problem',
                html: R`
                <p><strong>Speeds.</strong> 1 km/h means 1000 m in 3600 s, which is \(\frac{1000}{3600}=\frac{5}{18}\) m/s. So</p>
                <div class="ca-formula">\[ \text{km/h} \xrightarrow{\ \div 3.6\ } \text{m/s} \qquad\qquad \text{m/s} \xrightarrow{\ \times 3.6\ } \text{km/h} \]</div>
                <p>A car at 72 km/h covers \(72\div3.6=20\) m every second; in 45 s that is \(20\times45=900\) m.</p>
                <p><strong>Prices.</strong> “$2.40 per 100 g” and “$24 per kg” are the same price, because 1 kg is ten lots of
                   100 g. To compare packs of different sizes, change every price to the price of the <em>same</em> amount.</p>
                <p><strong>Volumes.</strong> Work in cm³, then divide by 1000 to get litres (or the other way round).</p>
                <p><strong>Mixed times.</strong> Change 2 h 15 min to 135 min, or to 2.25 h — whichever matches the other numbers.
                   With a speed in km/h, use hours: at 60 km/h, 2 h 15 min covers \(60\times2.25=135\) km.</p>
                <div class="ca-warn"><strong>Write the unit after every number</strong> in your working. If a line says
                   “\(90\times45\)” where 90 is km/h and 45 is seconds, the units are telling you something is wrong.</div>`,
            },
            {
                h: 'Multi-step word problems',
                html: R`
                <div class="ca-key"><strong>Make good use of what is already known and analyse it step by step.</strong>
                   Ask: what do I know? What is asked? Which quantity links the two? Find that link first.</div>
                <p><strong>Example.</strong> A runner keeps up a speed of 1.5 m/s and takes 2 steps every second. How many steps
                   does she take in 3 km?</p>
                <ul>
                    <li>Known: 1.5 m each second, 2 steps each second, 3 km. Asked: steps. Link: the <em>time</em>.</li>
                    <li>Step 1: 3 km = 3000 m. Step 2: time \(=3000\div1.5=2000\) s. Step 3: steps \(=2000\times2=4000\).</li>
                </ul>
                <p>Many problems are chains like this: <strong>rate × amount</strong> gives a total, a total split into parts
                   gives a rate, and stages are added one after another.</p>
                <div class="ca-tip"><strong>Trees and intervals.</strong> Trees every 5 m along a 100 m path make
                   \(100\div5=20\) gaps. With a tree at both ends there are \(20+1=21\) trees; around a closed loop (a pond)
                   there are exactly 20. Count the <em>gaps</em> first, then think about the ends.</div>`,
            },
            {
                h: 'Word problems with equations: the equal relationship',
                html: R`
                <p>Some problems are hard to do step by step because the unknown is tangled up in the story. Then let
                   \(x\) stand for it and write an equation.</p>
                <div class="ca-key"><strong>The key point is the equal relationship</strong>: one quantity described in two
                   different ways. Write both descriptions in terms of \(x\) and set them equal.</div>
                <ol>
                    <li>Let \(x\) be one unknown (often the one asked for).</li>
                    <li>Write every other unknown in terms of \(x\).</li>
                    <li>Find the equal relationship and write the equation.</li>
                    <li>Solve, then check the answer in the <em>story</em>, not just in the equation.</li>
                </ol>
                <p><strong>Example.</strong> A theatre sells 40 tickets for $380. Adult tickets cost $12 and child tickets $7.
                   Let \(x\) be the number of adult tickets; then there are \(40-x\) child tickets. The money is the equal
                   relationship: \(12x+7(40-x)=380\), so \(5x+280=380\) and \(x=20\). Check: \(20\times12+20\times7=380\). ✓</p>`,
            },
            {
                h: 'Classics: chickens and rabbits, ages, surplus and shortage',
                html: R`
                <p><strong>Chickens and rabbits.</strong> A farmyard has 35 heads and 94 legs. Let \(x\) be the rabbits, so
                   there are \(35-x\) chickens. Legs: \(4x+2(35-x)=94\), so \(2x=24\), \(x=12\) rabbits and 23 chickens.</p>
                <div class="ca-tip"><strong>Without \(x\):</strong> pretend all 35 are chickens: 70 legs, which is 24 too few.
                   Each rabbit adds 2 legs, so there are \(24\div2=12\) rabbits. The same idea solves bikes and tricycles,
                   cars and motorbikes, 2-point and 3-point questions…</div>
                <p><strong>Ages.</strong> The <em>difference</em> between two people's ages never changes. A mother is 36 and her
                   son is 8. In how many years will she be 3 times as old? Let it be \(x\) years: \(36+x=3(8+x)\), so
                   \(2x=12\) and \(x=6\) (then 42 and 14 ✓).</p>
                <p><strong>Surplus and shortage.</strong> If each child gets 5 sweets, 12 are left; if each gets 7, 8 more are
                   needed. The number of sweets is the same both ways: \(5x+12=7x-8\), so \(x=10\) children and 62 sweets.</p>`,
            },
            {
                h: 'Rounding word problems: up or down?',
                html: R`
                <p>Division often gives a decimal, but you cannot hire 5.1 buses or buy 7.14 tickets. The story decides
                   which way to round.</p>
                ${F.row(F.cap(busFig(230, 45), '230 students, 45 per bus: 5 full buses + 5 students'))}
                <table>
                    <tr><th>Round UP</th><td>a <em>minimum</em> must be met — everyone needs a seat, every egg needs a box</td><td>\(230\div45\approx5.1\) → 6 buses</td></tr>
                    <tr><th>Round DOWN</th><td>you cannot <em>exceed</em> what is available — money, ribbon, flour, full shelves</td><td>\(50\div7\approx7.14\) → 7 tickets</td></tr>
                </table>
                <div class="ca-key"><strong>Try the two whole numbers next to the exact answer</strong> and check which one meets
                   the requirement. 5 buses seat \(5\times45=225&lt;230\) ✗; 6 buses seat 270 ✓. 8 tickets cost $56 &gt; $50 ✗;
                   7 tickets cost $49 ✓.</div>
                <div class="ca-warn">Rounding to the <em>nearest</em> whole number is usually wrong here: \(230\div45\approx5.1\)
                   rounds to 5, which leaves 5 students behind.</div>`,
            },
        ],

        // Mirrors the textbook's own summary page for this lesson.
        summary: [
            {
                topic: 'Common unit conversions',
                points: [
                    R`1 h = 60 min = 3600 s; &nbsp;1 dollar = 100 cents; &nbsp;1 kg = 1000 g`,
                    R`1 km = 1000 m, &nbsp;1 m = 100 cm, &nbsp;1 cm = 10 mm; &nbsp;1 L = 1000 mL = 1000 cm³`,
                ],
            },
            {
                topic: 'Solving word problems: multi-step',
                points: [R`Make good use of what is already known and analyse it step by step.`],
            },
            {
                topic: 'Solving word problems: with equations',
                points: [R`Key point: the <strong>equal relationship</strong>. Let \(x\) be the unknown, describe one quantity in two ways, and set them equal.`],
            },
            {
                topic: 'Solving word problems: rounding',
                points: [
                    R`Rounding <strong>up</strong> makes sure a minimum requirement is met without falling short; rounding <strong>down</strong> avoids exceeding the available amount.`,
                    R`Try the two whole numbers next to the answer and check which one meets the requirement.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Steps on a run',
                q: 'A runner keeps up a speed of 1.5 m/s, taking 2 steps every second. How many steps does she take to run 3 km?',
                steps: [
                    R`Same units first: 3 km \(=3\times1000=${3 * 1000}\) m.`,
                    R`Time: \(${3000}\div1.5=${3000 / 1.5}\) s.`,
                    R`Steps: \(${3000 / 1.5}\times2=${3000 / 1.5 * 2}\).`,
                ],
                answer: R`${3000 / 1.5 * 2} steps`,
            },
            {
                title: 'Filling a tank',
                q: 'A fish tank is 50 cm long, 40 cm wide and 30 cm high. A tap pours in 2 L of water per minute. How long does it take to fill the empty tank?',
                fig: tankFig(50, 40, 30),
                steps: [
                    R`Volume: \(50\times40\times30=${50 * 40 * 30}\) cm³.`,
                    R`1 L = 1000 cm³, so the tank holds \(${50 * 40 * 30}\div1000=${50 * 40 * 30 / 1000}\) L.`,
                    R`Time: \(${50 * 40 * 30 / 1000}\div2=${50 * 40 * 30 / 2000}\) minutes.`,
                ],
                answer: R`${50 * 40 * 30 / 2000} minutes`,
            },
            {
                title: 'Fuel for a trip',
                q: 'A car uses 7.5 L of fuel for every 100 km. Fuel costs $1.80 per litre. How much does the fuel cost for a 240 km trip?',
                steps: [
                    R`Fuel per km: \(7.5\div100=0.075\) L. For 240 km: \(240\times0.075=${n(240 * 0.075)}\) L.`,
                    R`(Or: 240 km is 2.4 lots of 100 km, and \(2.4\times7.5=${n(2.4 * 7.5)}\) L.)`,
                    R`Cost: \(${n(240 * 0.075)}\times1.80=${D(18 * 180)}\).`,
                ],
                answer: R`${money(18 * 180)}`,
            },
            {
                title: 'Adult and child tickets',
                q: 'A theatre sells 40 tickets for $380 altogether. Adult tickets cost $12 and child tickets cost $7. How many adult tickets were sold?',
                steps: [
                    R`Let \(x\) be the number of adult tickets. Then there are \(40-x\) child tickets.`,
                    R`Equal relationship — the money: \(12x+7(40-x)=380\).`,
                    R`\(12x+280-7x=380\), so \(5x=100\) and \(x=20\).`,
                    R`Check: \(20\times12+20\times7=240+140=380\). ✓`,
                ],
                answer: R`20 adult tickets`,
            },
            {
                title: 'Chickens and rabbits',
                q: 'A farmyard has chickens and rabbits. Altogether there are 35 heads and 94 legs. How many rabbits and how many chickens are there?',
                steps: [
                    R`Let \(x\) be the number of rabbits; there are \(35-x\) chickens.`,
                    R`Legs: \(4x+2(35-x)=94\), so \(2x+70=94\).`,
                    R`\(2x=24\), \(x=12\) rabbits, and \(35-12=23\) chickens.`,
                    R`Check: \(12\times4+23\times2=48+46=94\). ✓`,
                ],
                answer: R`12 rabbits and 23 chickens`,
            },
            {
                title: 'Up or down?',
                q: '(a) 230 students go on a trip. Each bus holds 45 students. How many buses are needed? (b) Concert tickets cost $7 each. How many can you buy with $50?',
                fig: F.row(busFig(230, 45)),
                steps: [
                    R`(a) \(230\div45\approx${n(CA.round(230 / 45, 2))}\). Try 5 and 6: 5 buses seat 225 — 5 students left behind ✗; 6 buses seat 270 ✓. Round <strong>up</strong>.`,
                    R`(b) \(50\div7\approx${n(CA.round(50 / 7, 2))}\). Try 7 and 8: 7 tickets cost $49 ✓; 8 tickets cost $56, more than you have ✗. Round <strong>down</strong>.`,
                ],
                answer: R`(a) 6 buses &nbsp; (b) 7 tickets`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'convert-units', name: 'Common unit conversions', level: 1,
                gen(rng) {
                    const t = rng.int(0, 3);
                    if (t === 3) {
                        const c = rng.pick([rng.int(1, 99) * 5, rng.int(101, 9999), rng.int(1, 30) * 100 + rng.int(1, 9)]);
                        if (rng.bool()) return mk(`Fill in the blank: ${money(c)} = ____ cents.`, CA.num(c, 'cents'),
                            R`1 dollar = 100 cents, so multiply by 100: \(${(c / 100).toFixed(2)}\times100=${c}\) cents.`, { t: 'conv', v: c / 100, f: 100, ans: c });
                        return mk(`Fill in the blank: ${c} cents = $____.`, usd(c),
                            R`100 cents = 1 dollar, so divide by 100: \(${c}\div100=${n(c / 100)}\) dollars.`, { t: 'conv', v: c, f: 1 / 100, ans: c / 100 });
                    }
                    const u = rng.pick(t === 2 ? CONV.filter(x => x.mixed) : CONV);
                    if (t === 2) {
                        // b is sometimes small (3 kg 80 g) — the classic place to slip
                        const a = rng.int(1, Math.min(u.max, 9)), small = Math.max(1, u.f / 100);
                        const b = rng.bool(0.35) && u.f >= 100 ? small * rng.int(1, 9) : u.step * rng.int(1, u.f / u.step - 1);
                        const tot = a * u.f + b;
                        return mk(`Fill in the blank: ${a} ${u.big} ${b} ${u.small} = ____ ${u.small}.`, CA.num(tot, u.small),
                            R`${u.rule}, so ${a} ${u.big} \(=${a}\times${u.f}=${a * u.f}\) ${u.small}. Add the ${b} ${u.small}: \(${a * u.f}+${b}=${tot}\) ${u.small}.`, { t: 'mixed', a, b, f: u.f, ans: tot });
                    }
                    const N = u.step * rng.int(1, u.max * u.f / u.step), big = N / u.f;
                    if (t === 0) return mk(`Fill in the blank: ${n(big)} ${u.big} = ____ ${u.small}.`, CA.num(N, u.small),
                        R`${u.rule}. Big unit to small unit: multiply. \(${n(big)}\times${u.f}=${N}\) ${u.small}.`, { t: 'conv', v: big, f: u.f, ans: N });
                    return mk(`Fill in the blank: ${N} ${u.small} = ____ ${u.big}.`, CA.num(big, u.big),
                        R`${u.rule}. Small unit to big unit: divide. \(${N}\div${u.f}=${n(big)}\) ${u.big}.`, { t: 'conv', v: N, f: 1 / u.f, ans: big });
                },
            },
            {
                id: 'mixed-units', name: 'Adding and subtracting mixed units', level: 1,
                gen(rng) {
                    const t = rng.int(0, 6), who = rng.pick(NAMES);
                    if (t === 0) {
                        const s = rng.int(7 * 12, 9 * 12) * 5, d = rng.int(7, 35) * 5;
                        const what = rng.pick(['A lesson', 'A football match', 'A school concert', 'A swimming class', 'A film']);
                        return mk(`${what} starts at ${clock(s)} and ends at ${clock(s + d)}. How many minutes does it last?`, CA.num(d, 'min'),
                            clockSol(s, s + d), { t: 'clock', s, e: s + d, ans: d });
                    }
                    if (t === 1) {
                        const a = rng.int(2, 60) * 50, b = rng.int(1, 19) * 50;
                        return mk(`${who} runs ${n(a / 1000)} km and then walks ${b} m. How many metres is that altogether?`, CA.num(a + b, 'm'),
                            R`${n(a / 1000)} km \(=${n(a / 1000)}\times1000=${a}\) m, and \(${a}+${b}=${a + b}\) m.`, { t: 'sum', a: a / 1000, fa: 1000, b, fb: 1, ans: a + b });
                    }
                    if (t === 2) {
                        const T0 = rng.pick([1, 1.5, 2, 2.5, 3]) * 1000, p = rng.int(1, T0 / 50 - 1) * 50;
                        return mk(`A jug holds ${n(T0 / 1000)} L of juice. ${who} pours out ${p} mL. How many millilitres are left?`, CA.num(T0 - p, 'mL'),
                            R`${n(T0 / 1000)} L \(=${T0}\) mL, and \(${T0}-${p}=${T0 - p}\) mL.`, { t: 'diff', a: T0 / 1000, fa: 1000, b: p, fb: 1, ans: T0 - p });
                    }
                    if (t === 3) {
                        const c = rng.int(6, 99) * 5, k = rng.int(3, 12), thing = rng.pick(['apples', 'pencils', 'stickers', 'bread rolls', 'erasers', 'postcards']);
                        return mk(`${cap(thing)} cost ${c} cents each. How much do ${k} ${thing} cost, in dollars?`, usd(c * k),
                            R`\(${k}\times${c}=${c * k}\) cents, and \(${c * k}\div100=${n(c * k / 100)}\) dollars.`, { t: 'prod', c, k, ans: c * k / 100 });
                    }
                    if (t === 4) {
                        const L = rng.int(2, 5), a = rng.int(1, L - 1), b = rng.int(1, 19) * 5;
                        return mk(`A ribbon is ${L} m long. ${who} cuts off ${a} m ${b} cm. How many centimetres of ribbon are left?`, CA.num(L * 100 - a * 100 - b, 'cm'),
                            R`${L} m \(=${L * 100}\) cm and ${a} m ${b} cm \(=${a * 100 + b}\) cm. \(${L * 100}-${a * 100 + b}=${L * 100 - a * 100 - b}\) cm.`, { t: 'diff', a: L, fa: 100, b: a * 100 + b, fb: 1, ans: L * 100 - a * 100 - b });
                    }
                    if (t === 5) {
                        const a = rng.int(1, 3) * 60 + rng.int(1, 11) * 5, b = rng.int(0, 2) * 60 + rng.int(1, 11) * 5;
                        return mk(`A train journey takes ${hm(a)} and the bus ride after it takes ${hm(b)}. How many minutes does the whole trip take?`, CA.num(a + b, 'min'),
                            R`${hm(a)} \(=${a}\) min and ${hm(b)} \(=${b}\) min. Total \(${a}+${b}=${a + b}\) min.`, { t: 'sum', a, fa: 1, b, fb: 1, ans: a + b });
                    }
                    const W = rng.pick([2, 2.5, 3, 5]) * 1000, a = rng.int(1, Math.floor(W / 1000) - 1), b = rng.int(1, 19) * 50;
                    return mk(`A bag of flour weighs ${n(W / 1000)} kg. A baker uses ${a} kg ${b} g of it. How many grams are left?`, CA.num(W - a * 1000 - b, 'g'),
                        R`${n(W / 1000)} kg \(=${W}\) g and ${a} kg ${b} g \(=${a * 1000 + b}\) g. \(${W}-${a * 1000 + b}=${W - a * 1000 - b}\) g.`, { t: 'diff', a: W / 1000, fa: 1000, b: a * 1000 + b, fb: 1, ans: W - a * 1000 - b });
                },
            },
            {
                id: 'round-basic', name: 'Round up or round down?', level: 1,
                gen(rng) {
                    const up = rng.bool();
                    const ctx = up ? rng.pick([
                        [(N, S) => `${N} students are going on a school trip. Each bus holds ${S} students. How many buses are needed?`, 'buses', [20, 60], [100, 400]],
                        [(N, S) => `A farm collects ${N} eggs. Each carton holds ${S} eggs. How many cartons are needed to pack all the eggs?`, 'cartons', [[6, 10, 12, 30]], [50, 300]],
                        [(N, S) => `${N} people want to cross a lake. A boat can carry ${S} people on each trip. How many trips are needed?`, 'trips', [5, 12], [30, 120]],
                        [(N, S) => `${N} guests come to a wedding. Each table seats ${S} guests. How many tables are needed so that every guest has a seat?`, 'tables', [6, 12], [40, 200]],
                        [(N, S) => `A library packs ${N} books into boxes. Each box holds ${S} books. How many boxes are needed?`, 'boxes', [15, 40], [100, 600]],
                    ]) : rng.pick([
                        [(N, S) => `Cinema tickets cost $${S} each. How many tickets can you buy with $${N}?`, 'tickets', [6, 15], [30, 150]],
                        [(N, S) => `A ribbon is ${N} cm long. How many pieces ${S} cm long can be cut from it?`, 'pieces', [12, 40], [100, 500]],
                        [(N, S) => `There are ${N} books. Each shelf holds ${S} books. How many shelves can be completely filled?`, 'shelves', [20, 40], [100, 500]],
                        [(N, S) => `A baker has ${N} g of flour. Each loaf needs ${S} g. How many loaves can she bake?`, 'loaves', [300, 600], [2000, 6000]],
                        [(N, S) => `${N} sweets are packed into bags of ${S}. How many full bags can be made?`, 'bags', [8, 25], [100, 400]],
                    ]);
                    const [text, unit, [slo, shi], [nlo, nhi]] = ctx;
                    let S, N;
                    do { S = Array.isArray(slo) ? rng.pick(slo) : rng.int(slo, shi); N = rng.int(nlo, nhi); } while (N % S === 0 || N < 2 * S);
                    const q = Math.floor(N / S), ans = up ? q + 1 : q;
                    const sol = up
                        ? R`\(${N}\div${S}=${q}\) remainder ${N - q * S}. ${q} ${unit} are not enough (${N - q * S} left over), so round <strong>up</strong>: ${q + 1}.`
                        : R`\(${N}\div${S}=${q}\) remainder ${N - q * S}. ${q + 1} would need \(${(q + 1) * S}&gt;${N}\), so round <strong>down</strong>: ${q}.`;
                    return mk(text(N, S), CA.num(ans, unit), sol, { t: up ? 'up' : 'down', N, S, ans });
                },
            },
            {
                id: 'equation-basic', name: 'Set up a simple equation', level: 1,
                gen(rng) {
                    const t = rng.int(0, 5), [A, B] = rng.sample(NAMES, 2);
                    if (t === 0) {
                        const x = rng.int(2, 30), a = rng.int(2, 9), b = rng.int(1, 40);
                        if (rng.bool()) return mk(`${A} thinks of a number, multiplies it by ${a} and then adds ${b}. The result is ${a * x + b}. What was the number?`, CA.num(x),
                            R`Let the number be \(x\): \(${a}x+${b}=${a * x + b}\), so \(${a}x=${a * x}\) and \(x=${x}\).`, { t: 'lin', a, b, c: a * x + b, ans: x });
                        return mk(`${A} thinks of a number, subtracts ${b} and then multiplies by ${a}. The result is ${a * x}. What was the number?`, CA.num(x + b),
                            R`Let the number be \(x\): \(${a}(x-${b})=${a * x}\), so \(x-${b}=${x}\) and \(x=${x + b}\).`, { t: 'lin2', a, b, c: a * x, ans: x + b });
                    }
                    if (t === 1) {
                        const x = rng.int(4, 40), k = rng.int(2, 6), thing = rng.pick(['stickers', 'marbles', 'stamps', 'shells', 'cards']), big = rng.bool();
                        return mk(`${A} has ${k} times as many ${thing} as ${B}. Together they have ${(k + 1) * x}. How many ${thing} does ${big ? A : B} have?`, CA.num(big ? k * x : x),
                            R`Let ${B} have \(x\); ${A} has \(${k}x\). \(x+${k}x=${(k + 1) * x}\), so \(${k + 1}x=${(k + 1) * x}\) and \(x=${x}\). ${big ? R`${A}: \(${k}\times${x}=${k * x}\).` : ''}`, { t: 'times', k, T: (k + 1) * x, ans: big ? k * x : x });
                    }
                    if (t === 2) {
                        const x = rng.int(5, 60), d = rng.int(2, 30), thing = rng.pick(['books', 'points', 'shells', 'coins', 'stickers']);
                        return mk(`${A} has ${d} more ${thing} than ${B}. Together they have ${2 * x + d}. How many ${thing} does ${B} have?`, CA.num(x),
                            R`Let ${B} have \(x\); ${A} has \(x+${d}\). \(x+x+${d}=${2 * x + d}\), so \(2x=${2 * x}\) and \(x=${x}\).`, { t: 'more', d, T: 2 * x + d, ans: x });
                    }
                    if (t === 3) {
                        const x = rng.int(5, 90), big = rng.bool();
                        return mk(`The sum of three consecutive whole numbers is ${3 * x + 3}. What is the ${big ? 'largest' : 'smallest'} of them?`, CA.num(big ? x + 2 : x),
                            R`Let them be \(x\), \(x+1\), \(x+2\): \(3x+3=${3 * x + 3}\), so \(x=${x}\). The numbers are ${x}, ${x + 1}, ${x + 2}.`, { t: 'consec', S: 3 * x + 3, ans: big ? x + 2 : x });
                    }
                    if (t === 4) {
                        const w = rng.int(3, 25), d = rng.int(1, 12);
                        return mk(`A rectangle is ${d} cm longer than it is wide. Its perimeter is ${4 * w + 2 * d} cm. How wide is it?`, CA.num(w, 'cm'),
                            R`Let the width be \(x\); the length is \(x+${d}\). \(2(x+x+${d})=${4 * w + 2 * d}\), so \(2x+${d}=${2 * w + d}\) and \(x=${w}\) cm.`, { t: 'rect', d, P: 4 * w + 2 * d, ans: w });
                    }
                    const x = rng.int(2, 15), k = rng.int(3, 8), r = rng.int(1, 9), [it1, it2] = rng.pick([['pens', 'ruler'], ['notebooks', 'pencil case'], ['tennis balls', 'water bottle'], ['cupcakes', 'cake box']]);
                    return mk(`${A} buys ${k} ${it1} and a $${r} ${it2}, and pays $${k * x + r} altogether. How much does one of the ${it1} cost?`, CA.num(x, '$'),
                        R`Let one cost \(x\) dollars: \(${k}x+${r}=${k * x + r}\), so \(${k}x=${k * x}\) and \(x=${x}\).`, { t: 'lin', a: k, b: r, c: k * x + r, ans: x });
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'speed-convert', name: 'Speeds: km/h and m/s', level: 2,
                gen(rng) {
                    const t = rng.int(0, 6);
                    if (t === 0) {
                        const v = 18 * rng.int(1, 8), what = rng.pick(['A car', 'A train', 'A cyclist', 'A horse', 'A speedboat']);
                        return mk(`${what} travels at ${v} km/h. What is this speed in metres per second?`, CA.num(v / 3.6, 'm/s'),
                            R`${v} km/h is ${v * 1000} m in 3600 s: \(${v * 1000}\div3600=${v / 3.6}\) m/s (divide by 3.6).`, { t: 'kmh2ms', v, ans: v / 3.6 });
                    }
                    if (t === 1) {
                        const [what, lo, hi] = rng.pick([['A sprinter', 6, 11], ['A cheetah', 20, 30], ['A swift', 15, 30], ['A skier', 10, 35], ['A greyhound', 12, 18], ['A swimmer', 1, 2], ['A train', 20, 80]]), s = rng.int(lo, hi);
                        return mk(`${what} moves at ${s} m/s. What is this speed in kilometres per hour?`, CA.num(s * 36 / 10, 'km/h'),
                            R`In 1 h = 3600 s it goes \(${s}\times3600=${s * 3600}\) m \(=${n(s * 3.6)}\) km. So ${n(s * 36 / 10)} km/h (multiply by 3.6).`, { t: 'ms2kmh', s, ans: s * 3.6 });
                    }
                    if (t === 2) {
                        const v = 18 * rng.int(2, 7), sec = 5 * rng.int(2, 18);
                        return mk(`A car travels at ${v} km/h. How many metres does it travel in ${sec} seconds?`, CA.num(v / 3.6 * sec, 'm'),
                            R`\(${v}\div3.6=${v / 3.6}\) m/s, and \(${v / 3.6}\times${sec}=${v / 3.6 * sec}\) m.`, { t: 'dist', v, sec, ans: v / 3.6 * sec });
                    }
                    if (t === 3) {
                        for (;;) {
                            const v = rng.pick([2, 2.5, 3, 4, 5]), f = rng.pick([2, 3]), d = rng.pick([1, 1.5, 2, 3, 4, 5]);
                            const time = d * 1000 / v;
                            if (!Number.isInteger(time)) continue;
                            return mk(`A runner keeps up a speed of ${v} m/s, taking ${f} steps every second. How many steps does the runner take to run ${d} km?`, CA.num(time * f, 'steps'),
                                R`${d} km \(=${d * 1000}\) m. Time: \(${d * 1000}\div${v}=${time}\) s. Steps: \(${time}\times${f}=${time * f}\).`, { t: 'steps', v, f, d, ans: time * f });
                        }
                    }
                    if (t === 4) {
                        for (;;) {
                            const v = rng.pick([3, 4, 5, 6]), mins = rng.int(2, 18) * 5, d = v * mins / 60;
                            if (!Number.isInteger(d * 100)) continue;
                            return mk(`${rng.pick(NAMES)} walks at ${v} km/h. How many minutes does it take to walk ${n(d)} km?`, CA.num(mins, 'min'),
                                R`Time \(=${n(d)}\div${v}\) h; in minutes \(${n(d)}\div${v}\times60=${mins}\) min.`, { t: 'walk', v, d, ans: mins });
                        }
                    }
                    if (t === 5) {
                        const sec = rng.int(2, 12);
                        return mk(`Sound travels at about 340 m/s. ${rng.pick(['Kai', 'Lena', 'Omar', 'Rosa'])} hears thunder ${sec} seconds after seeing the lightning. About how many kilometres away is the storm?`, CA.num(340 * sec / 1000, 'km'),
                            R`\(340\times${sec}=${340 * sec}\) m, and \(${340 * sec}\div1000=${n(340 * sec / 1000)}\) km. (The light arrives almost instantly.)`, { t: 'sound', sec, ans: 0.34 * sec });
                    }
                    for (;;) {
                        const s = rng.int(3, 15), v = Math.round(s * 3.6) + rng.int(-6, 6);
                        if (s * 36 === v * 10) continue;
                        const [a, b] = rng.pick([['a cyclist', 'a scooter'], ['a dog', 'a rabbit'], ['a skater', 'a jogger'], ['a horse', 'a bus']]);
                        const fast = s * 3.6 > v ? cap(a) : cap(b);
                        return mk(`Which is faster: ${a} at ${s} m/s or ${b} at ${v} km/h?`, CA.mc(rng, fast, [cap(a), cap(b), 'They are equally fast'], { keepOrder: true }),
                            R`\(${s}\times3.6=${n(s * 3.6)}\) km/h, compared with ${v} km/h. ${fast} is faster.`, { t: 'cmp', s, v, ans: fast });
                    }
                },
            },
            {
                id: 'unit-price', name: 'Prices per 100 g, per kg, per litre', level: 2,
                gen(rng) {
                    const t = rng.int(0, 4);
                    if (t === 0) {
                        const c = rng.int(8, 60) * 10, w = rng.pick([150, 250, 300, 350, 450, 600, 750, 850, 1200, 1500]), food = rng.pick(['Cheese', 'Ham', 'Smoked salmon', 'Olives', 'Dried mango', 'Chocolate']);
                        return mk(`${food} costs ${money(c)} per 100 g. How much do ${w} g cost?`, usd(c * w / 100),
                            R`${w} g is \(${w}\div100=${n(w / 100)}\) lots of 100 g: \(${n(w / 100)}\times${D(c)}=${D(c * w / 100)}\).`, { t: 'per100', c, w, ans: c * w / 10000 });
                    }
                    if (t === 1) {
                        const P = rng.int(6, 60), w = rng.pick([100, 200, 250, 300, 400, 500, 750, 1500, 2500]), food = rng.pick(['Coffee beans', 'Cherries', 'Mince', 'Walnuts', 'Prawns', 'Tea leaves']);
                        return mk(`${food} cost $${P} per kg. How much do ${w} g cost?`, usd(P * w / 10),
                            R`${w} g \(=${n(w / 1000)}\) kg, and \(${n(w / 1000)}\times${D(P * 100)}=${D(P * w / 10)}\).`, { t: 'perkg', P, w, ans: P * w / 1000 });
                    }
                    if (t === 2) {
                        for (;;) {
                            const liquid = rng.bool(), w = rng.pick([200, 250, 400, 500, 750, 1000, 1500, 2000]), c = rng.int(15, 300);
                            const price = c * w / 100;
                            if (!Number.isInteger(price)) continue;
                            const what = liquid ? rng.pick(['A bottle of juice', 'A carton of milk', 'A bottle of olive oil', 'A tub of yoghurt drink']) : rng.pick(['A bag of rice', 'A box of cereal', 'A bag of pasta', 'A jar of honey']);
                            const size = liquid ? (w >= 1000 ? `${n(w / 1000)} L` : `${w} mL`) : (w >= 1000 ? `${n(w / 1000)} kg` : `${w} g`);
                            const per = liquid ? '100 mL' : '100 g';
                            return mk(`${what} holds ${size} and costs ${money(price)}. What is the price per ${per}, in cents?`, CA.num(c, 'cents'),
                                R`${size} \(=${w}\) ${liquid ? 'mL' : 'g'}, which is \(${n(w / 100)}\) lots of ${per}. \(${price}\) cents \(\div${n(w / 100)}=${c}\) cents.`, { t: 'unit', price, w, ans: c });
                        }
                    }
                    if (t === 3) {
                        for (;;) {
                            const sizes = rng.sample([200, 250, 400, 500, 750, 1000, 1500, 2000], 3), pers = rng.sample([60, 64, 68, 70, 72, 75, 80, 84, 85, 88, 90, 95, 96, 100], 3);
                            const prices = sizes.map((w, i) => pers[i] * w / 100);
                            if (!prices.every(Number.isInteger)) continue;
                            const best = 'ABC'[pers.indexOf(Math.min(...pers))];
                            const sz = w => (w >= 1000 ? `${n(w / 1000)} kg` : `${w} g`);
                            const thing = rng.pick(['oats', 'flour', 'washing powder', 'dog biscuits', 'brown sugar']);
                            return mk(`Three packs of ${thing}: Pack A is ${sz(sizes[0])} for ${money(prices[0])}, Pack B is ${sz(sizes[1])} for ${money(prices[1])}, and Pack C is ${sz(sizes[2])} for ${money(prices[2])}. Which pack is the best buy (cheapest per 100 g)?`,
                                CA.mc(rng, `Pack ${best}`, ['Pack A', 'Pack B', 'Pack C'], { keepOrder: true }),
                                R`Price per 100 g: A ${pers[0]} cents, B ${pers[1]} cents, C ${pers[2]} cents (price ÷ number of 100 g lots). Pack ${best} is cheapest.`, { t: 'best', sizes, prices, ans: `Pack ${best}` });
                        }
                    }
                    for (;;) {
                        const P = rng.int(18, 60) * 10, w = rng.pick([500, 750, 1200, 1500, 2000, 2500]), M = rng.pick([5, 10, 20]);
                        const cost = P * w / 1000;
                        if (!Number.isInteger(cost) || cost >= M * 100) continue;
                        const fruit = rng.pick(['apples', 'grapes', 'tomatoes', 'pears', 'plums']);
                        return mk(`${cap(fruit)} cost ${money(P)} per kg. ${rng.pick(NAMES)} buys ${w} g and pays with a $${M} note. How much change should there be?`, usd(M * 100 - cost),
                            R`${w} g \(=${n(w / 1000)}\) kg, costing \(${n(w / 1000)}\times${D(P)}=${D(cost)}\). Change: \(${D(M * 100)}-${D(cost)}=${D(M * 100 - cost)}\).`, { t: 'change', P, w, M, ans: (M * 100 - cost) / 100 });
                    }
                },
            },
            {
                id: 'tank-volume', name: 'Tanks: cm³ and litres', level: 2,
                gen(rng) {
                    const t = rng.int(0, 4);
                    const l = rng.int(3, 10) * 10, w = rng.int(2, 6) * 10, h = rng.int(2, 6) * 10;
                    const V = l * w * h / 1000;
                    if (t === 0) return mk(`A fish tank is ${l} cm long, ${w} cm wide and ${h} cm high. How many litres of water does it hold when full?`, CA.num(V, 'L'),
                        R`\(${l}\times${w}\times${h}=${l * w * h}\) cm³, and 1 L = 1000 cm³: \(${l * w * h}\div1000=${V}\) L.`, { t: 'vol', l, w, h, ans: V }, tankFig(l, w, h));
                    if (t === 1) {
                        const rs = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15].filter(r => V % r === 0 && V / r >= 3);
                        if (!rs.length) return this.gen(rng);
                        const r = rng.pick(rs);
                        return mk(`An empty tank is ${l} cm long, ${w} cm wide and ${h} cm high. A tap fills it at ${r} L per minute. How many minutes does it take to fill the tank?`, CA.num(V / r, 'min'),
                            R`Volume \(=${l}\times${w}\times${h}=${l * w * h}\) cm³ \(=${V}\) L. Time \(=${V}\div${r}=${V / r}\) min.`, { t: 'fill', l, w, h, r, ans: V / r }, tankFig(l, w, h));
                    }
                    if (t === 2) {
                        for (;;) {
                            const d = rng.int(5, 30), X = l * w * d / 1000;
                            if (!Number.isInteger(X * 2) || d >= h * 2) continue;
                            return mk(`A box-shaped tank has a base ${l} cm long and ${w} cm wide. ${n(X)} L of water is poured into it. How deep is the water, in cm?`, CA.num(d, 'cm'),
                                R`${n(X)} L \(=${l * w * d}\) cm³. Depth \(=${l * w * d}\div(${l}\times${w})=${l * w * d}\div${l * w}=${d}\) cm.`, { t: 'depth', l, w, X, ans: d });
                        }
                    }
                    if (t === 3) {
                        const r = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), vol = l * w * r, inL = rng.bool() && vol % 100 === 0;
                        const what = rng.pick(['A stone', 'A metal ball', 'A toy castle', 'An iron weight']);
                        return mk(`A tank has a base ${l} cm long and ${w} cm wide and holds some water. ${what} is put in and sinks completely, and the water level rises by ${r} cm. What is the volume of the ${what.split(' ').slice(1).join(' ')}${inL ? ', in litres' : ', in cm³'}?`, CA.num(inL ? vol / 1000 : vol, inL ? 'L' : 'cm³'),
                            R`The water pushed up has the same volume: \(${l}\times${w}\times${r}=${vol}\) cm³${inL ? R` \(=${n(vol / 1000)}\) L` : ''}.`, { t: 'rise', l, w, r, inL, ans: inL ? vol / 1000 : vol }, tankFig(l, w, h, [`${l}`, `${w}`, '']));
                    }
                    for (;;) {
                        const b = rng.pick([200, 250, 300, 400, 500, 600, 750, 1500]), Lt = rng.int(3, 60);
                        if ((Lt * 1000) % b) continue;
                        return mk(`A water cooler holds ${Lt} L. How many bottles of ${b >= 1000 ? `${n(b / 1000)} L` : `${b} mL`} can be filled from a full cooler?`, CA.num(Lt * 1000 / b, 'bottles'),
                            R`${Lt} L \(=${Lt * 1000}\) mL, and \(${Lt * 1000}\div${b}=${Lt * 1000 / b}\).`, { t: 'bottles', Lt, b, ans: Lt * 1000 / b });
                    }
                },
            },
            {
                id: 'multi-step', name: 'Multi-step word problems', level: 2,
                gen(rng) {
                    const t = rng.int(0, 5), who = rng.pick(NAMES);
                    if (t === 0) {
                        const a = rng.int(10, 30), d = rng.int(3, 10), b = a + rng.int(5, 20), e = rng.int(2, 10);
                        return mk(`A book has ${a * d + b * e} pages. ${who} reads ${a} pages a day for ${d} days, and then ${b} pages a day. How many more days does ${who} need to finish the book?`, CA.num(e, 'days'),
                            R`First ${d} days: \(${a}\times${d}=${a * d}\) pages. Left: \(${a * d + b * e}-${a * d}=${b * e}\). Days: \(${b * e}\div${b}=${e}\).`, { t: 'book', P: a * d + b * e, a, d, b, ans: e });
                    }
                    if (t === 1) {
                        for (;;) {
                            const p = rng.pick([12, 15, 20, 24, 25, 30, 40]), c = rng.int(2, 30) * 10, k = rng.pick([4, 6, 8, 12, 16, 20, 24]);
                            if ((c * k) % p) continue;
                            return mk(`A printer prints ${p} pages per minute. How many minutes does it take to print ${c} copies of a ${k}-page booklet?`, CA.num(c * k / p, 'min'),
                                R`Pages: \(${c}\times${k}=${c * k}\). Time: \(${c * k}\div${p}=${c * k / p}\) min.`, { t: 'print', p, c, k, ans: c * k / p });
                        }
                    }
                    if (t === 2) {
                        const d = rng.pick([4, 5, 6, 8, 10, 12, 15, 20]), g = rng.int(8, 40), L = d * g, k = rng.int(0, 2);
                        const q = [`Trees are planted along one side of a straight path ${L} m long, one every ${d} m, with a tree at each end. How many trees are planted?`,
                            `Trees are planted along both sides of a straight road ${L} m long, one every ${d} m, with a tree at each end of each side. How many trees are planted?`,
                            `Trees are planted around a circular pond ${L} m round, one every ${d} m. How many trees are planted?`][k];
                        const ans = [g + 1, 2 * (g + 1), g][k];
                        return mk(q, CA.num(ans, 'trees'), R`Gaps: \(${L}\div${d}=${g}\). ` + [R`With trees at both ends there is one more tree than gaps: ${g + 1}.`, R`Each side has \(${g}+1=${g + 1}\) trees; both sides: \(2\times${g + 1}=${2 * (g + 1)}\).`, R`On a closed loop there are as many trees as gaps: ${g}.`][k], { t: 'trees', L, d, k, ans });
                    }
                    if (t === 3) {
                        for (;;) {
                            const n1 = rng.int(2, 6), x = rng.int(12, 60) * 5, n2 = rng.int(2, 8), y = rng.int(6, 40) * 5, M = rng.pick([20, 50]);
                            const cost = n1 * x + n2 * y;
                            if (cost >= M * 100) continue;
                            const [i1, i2] = rng.pick([['notebooks', 'pens'], ['sandwiches', 'apples'], ['magazines', 'stickers'], ['folders', 'erasers']]);
                            return mk(`${who} buys ${n1} ${i1} at ${money(x)} each and ${n2} ${i2} at ${money(y)} each, and pays with a $${M} note. How much change does ${who} get?`, usd(M * 100 - cost),
                                R`Cost: \(${n1}\times${D(x)}+${n2}\times${D(y)}=${D(n1 * x)}+${D(n2 * y)}=${D(cost)}\). Change: \(${D(M * 100)}-${D(cost)}=${D(M * 100 - cost)}\).`, { t: 'shop', n1, x, n2, y, M, ans: (M * 100 - cost) / 100 });
                        }
                    }
                    if (t === 4) {
                        for (;;) {
                            const v1 = rng.int(8, 25) * 2, t1 = rng.int(1, 3), t2 = rng.pick([15, 20, 30, 40, 45]), v2 = rng.int(6, 30) * 4;
                            if ((v2 * t2) % 60) continue;
                            const veh = rng.pick([['A cyclist rides', 'rides'], ['A bus drives', 'drives'], ['A rower rows', 'rows']]);
                            if (veh[0].startsWith('A cyclist') && (v1 > 30 || v2 > 30)) continue;
                            if (veh[0].startsWith('A rower') && (v1 > 16 || v2 > 16)) continue;
                            return mk(`${veh[0]} for ${t1} h at ${v1} km/h and then ${veh[1]} for ${t2} min at ${v2} km/h. How many kilometres is that altogether?`, CA.num(v1 * t1 + v2 * t2 / 60, 'km'),
                                R`First part: \(${v1}\times${t1}=${v1 * t1}\) km. ${t2} min \(=\frac{${t2}}{60}\) h, so the second part is \(${v2}\times\frac{${t2}}{60}=${v2 * t2 / 60}\) km. Total \(${v1 * t1 + v2 * t2 / 60}\) km.`, { t: 'trip', v1, t1, v2, t2, ans: v1 * t1 + v2 * t2 / 60 });
                        }
                    }
                    const r = rng.int(1, 8) * 5, dpm = 20;
                    return mk(`A leaking tap drips ${r} drops every minute, and ${dpm} drops make 1 mL. How many millilitres of water does it waste in one day?`, CA.num(r * 1440 / dpm, 'mL'),
                        R`One day \(=24\times60=1440\) min. Drops: \(${r}\times1440=${r * 1440}\). Millilitres: \(${r * 1440}\div${dpm}=${r * 1440 / dpm}\) mL.`, { t: 'drip', r, ans: r * 72 });
                },
            },
            {
                id: 'equation-tickets', name: 'Two kinds: tickets, coins, stamps', level: 2,
                gen(rng) {
                    for (;;) {
                        const k = rng.int(0, 3);
                        const N = rng.int(12, 80), x = rng.int(3, N - 3);
                        let a, b, q, unitA, unitB, V;
                        const ask = rng.bool();
                        if (k === 0) {
                            a = rng.int(9, 25); b = rng.int(4, a - 2); V = a * x + b * (N - x);
                            q = `A theatre sells ${N} tickets and takes $${V} altogether. Adult tickets cost $${a} and child tickets cost $${b}. How many ${ask ? 'adult' : 'child'} tickets were sold?`;
                            unitA = 'adult tickets'; unitB = 'child tickets';
                        } else if (k === 1) {
                            [a, b] = rng.pick([[50, 20], [50, 10], [20, 5], [20, 10], [50, 5]]); V = a * x + b * (N - x);
                            q = `A jar holds ${N} coins, all ${a}-cent and ${b}-cent coins, worth ${money(V)} altogether. How many ${ask ? a : b}-cent coins are there?`;
                            unitA = `${a}-cent coins`; unitB = `${b}-cent coins`;
                        } else if (k === 2) {
                            [a, b] = rng.pick([[80, 50], [75, 45], [120, 80], [95, 60], [60, 40]]); V = a * x + b * (N - x);
                            q = `${rng.pick(NAMES)} buys ${N} stamps, some at ${a} cents and the rest at ${b} cents, and pays ${money(V)}. How many ${ask ? a : b}-cent stamps are there?`;
                            unitA = `${a}-cent stamps`; unitB = `${b}-cent stamps`;
                        } else {
                            [a, b] = rng.pick([[6, 4], [8, 5], [10, 6], [5, 3], [12, 8]]); V = a * x + b * (N - x);
                            if (N > 30) continue;
                            q = `A class of ${V} students goes boating. They take ${N} boats, some big boats that hold ${a} students and some small boats that hold ${b}. Every boat is full. How many ${ask ? 'big' : 'small'} boats do they take?`;
                            unitA = 'big boats'; unitB = 'small boats';
                        }
                        const money1 = k === 1 || k === 2;
                        const sol0 = R`Let \(x\) be the number of ${unitA}; there are \(${N}-x\) ${unitB}. ${money1 ? `In cents, ` : ''}\(${a}x+${b}(${N}-x)=${V}\), so \(${co(a - b)}x+${b * N}=${V}\), \(${co(a - b)}x=${V - b * N}\) and \(x=${x}\).` + (ask ? '' : R` ${cap(unitB)}: \(${N}-${x}=${N - x}\).`);
                        return mk(q, CA.num(ask ? x : N - x), sol0, { t: 'two', N, a, b, V, ask, ans: ask ? x : N - x });
                    }
                },
            },
            {
                id: 'chickens-rabbits', name: 'Chickens and rabbits', level: 2,
                gen(rng) {
                    const [place, A, a, B, b, heads, legs] = rng.pick([
                        ['A farmyard has', 'chickens', 2, 'rabbits', 4, 'heads', 'legs'],
                        ['A bike shop has', 'bicycles', 2, 'tricycles', 3, 'cycles', 'wheels'],
                        ['A car park has', 'motorbikes', 2, 'cars', 4, 'vehicles', 'wheels'],
                        ['A tank at the zoo has', 'beetles', 6, 'spiders', 8, 'creatures', 'legs'],
                        ['A café has', 'stools', 3, 'chairs', 4, 'seats', 'legs'],
                        ['A pond has', 'ducks', 2, 'frogs', 4, 'animals', 'legs'],
                    ]);
                    const H = rng.int(12, 60), x = rng.int(2, H - 2), L = a * (H - x) + b * x, askB = rng.bool();
                    const q = `${place} ${A} and ${B}. There are ${H} ${heads} and ${L} ${legs} altogether. How many ${askB ? B : A} are there?`;
                    const sol = R`Let \(x\) be the ${B}; there are \(${H}-x\) ${A}. \(${b}x+${a}(${H}-x)=${L}\), so \(${co(b - a)}x=${L}-${a * H}=${L - a * H}\) and \(x=${x}\)${askB ? '' : R`; ${A}: \(${H}-${x}=${H - x}\)`}. (Or: if all were ${A} there would be ${a * H} ${legs}, ${L - a * H} too few; each of the ${B} adds ${b - a}.)`;
                    return mk(q, CA.num(askB ? x : H - x, askB ? B : A), sol, { t: 'cr', H, L, a, b, askB, ans: askB ? x : H - x });
                },
            },
            {
                id: 'ages', name: 'Age problems', level: 2,
                gen(rng) {
                    const t = rng.int(0, 4);
                    const [role, C] = rng.pick([['father', 'his son'], ['mother', 'her daughter'], ['aunt', 'her nephew'], ['grandfather', 'his granddaughter'], ['coach', 'her son']]);
                    const P = (/^[aeiou]/.test(role) ? 'An ' : 'A ') + role, lower = () => 'the ' + role;
                    for (;;) {
                        if (t === 0) {
                            const k = rng.int(2, 4), y = rng.int(5, 30), nn = rng.int(2, 20), s = y - nn, Fa = k * y - nn;
                            if (s < 1 || (k - 1) * y < 20 || (k - 1) * y > 45 || Fa > 80) continue;
                            return mk(`${P} is ${Fa} years old and ${C} is ${s}. In how many years will ${lower(P)} be ${k} times as old as ${C}?`, CA.num(nn, 'years'),
                                R`Let it be \(x\) years: \(${Fa}+x=${k}(${s}+x)\), so \(${Fa}+x=${k * s}+${k}x\), \(${co(k - 1)}x=${Fa - k * s}\) and \(x=${nn}\). Check: ${Fa + nn} and ${s + nn}.`, { t: 'future', F: Fa, s, k, ans: nn });
                        }
                        if (t === 1) {
                            const k = rng.int(3, 7), mm = rng.int(2, k - 1), x = rng.int(3, 15), nn = (k - mm) * x / (mm - 1);
                            if (!Number.isInteger(nn) || nn < 1 || nn > 30 || (k - 1) * x < 20 || (k - 1) * x > 45) continue;
                            return mk(`${P} is ${k} times as old as ${C}. In ${nn} years, ${lower(P)} will be ${mm} times as old as ${C}. How old is ${C} now?`, CA.num(x, 'years'),
                                R`Let ${C} be \(x\) now, so ${lower(P)} is \(${k}x\). In ${nn} years: \(${k}x+${nn}=${mm}(x+${nn})\), so \(${co(k - mm)}x=${mm * nn - nn}\) and \(x=${x}\).`, { t: 'times', k, mm, nn, ans: x });
                        }
                        if (t === 2) {
                            const x = rng.int(5, 40), d = rng.int(2, 30), [A, B] = rng.sample(NAMES, 2);
                            return mk(`The sum of ${A}'s and ${B}'s ages is ${2 * x + d}. ${A} is ${d} years older than ${B}. How old is ${B}?`, CA.num(x, 'years'),
                                R`Let ${B} be \(x\); ${A} is \(x+${d}\). \(2x+${d}=${2 * x + d}\), so \(x=${x}\).`, { t: 'sum', S: 2 * x + d, d, ans: x });
                        }
                        if (t === 3) {
                            const k = rng.int(3, 7), y = rng.int(2, 12), nn = rng.int(2, 15), s = y + nn, Fa = k * y + nn;
                            if ((k - 1) * y < 20 || (k - 1) * y > 45 || Fa > 80) continue;
                            return mk(`${P} is ${Fa} years old and ${C} is ${s}. How many years ago was ${lower(P)} ${k} times as old as ${C}?`, CA.num(nn, 'years'),
                                R`Let it be \(x\) years ago: \(${Fa}-x=${k}(${s}-x)\), so \(${co(k - 1)}x=${k * s - Fa}\) and \(x=${nn}\). Check: ${Fa - nn} \(=${k}\times${s - nn}\).`, { t: 'past', F: Fa, s, k, ans: nn });
                        }
                        const ages = [rng.int(1, 14), rng.int(1, 14), rng.int(1, 14)], G = rng.int(55, 85), S = ages[0] + ages[1] + ages[2];
                        if ((G - S) % 2 || G - S < 4) continue;
                        return mk(`Grandma is ${G}. Her three grandchildren are ${ages[0]}, ${ages[1]} and ${ages[2]} years old. In how many years will Grandma's age equal the sum of the three grandchildren's ages?`, CA.num((G - S) / 2, 'years'),
                            R`Let it be \(x\) years. Grandma gains \(x\) years but the three grandchildren gain \(3x\) together: \(${G}+x=${S}+3x\), so \(2x=${G - S}\) and \(x=${(G - S) / 2}\).`, { t: 'grandma', G, ages, ans: (G - S) / 2 });
                    }
                },
            },
            {
                id: 'rounding-real', name: 'Rounding with units', level: 2,
                gen(rng) {
                    const t = rng.int(0, 5), who = rng.pick(NAMES);
                    for (;;) {
                        if (t === 0) {
                            const L = rng.pick([1.5, 2, 2.5, 3, 4, 5]), p = rng.int(15, 60);
                            if ((L * 100) % p === 0) continue;
                            return mk(`${who} has ${L} m of ribbon. Each bow needs ${p} cm. How many bows can ${who} make?`, CA.num(Math.floor(L * 100 / p), 'bows'),
                                R`${L} m \(=${L * 100}\) cm. \(${L * 100}\div${p}\approx${n(CA.round(L * 100 / p, 2))}\). ${Math.floor(L * 100 / p) + 1} bows would need ${(Math.floor(L * 100 / p) + 1) * p} cm — too much — so round down: ${Math.floor(L * 100 / p)}.`, { t: 'down', N: L * 100, S: p, ans: Math.floor(L * 100 / p) });
                        }
                        if (t === 1) {
                            const c = rng.int(15, 40), v = rng.pick([150, 200, 250, 300]), B = rng.pick([1, 1.5, 2]), tot = c * v;
                            if (tot % (B * 1000) === 0) continue;
                            return mk(`${c} children each get one cup of juice holding ${v} mL. Juice comes in ${B} L bottles. How many bottles must be bought?`, CA.num(Math.ceil(tot / (B * 1000)), 'bottles'),
                                R`Juice needed: \(${c}\times${v}=${tot}\) mL \(=${n(tot / 1000)}\) L. \(${n(tot / 1000)}\div${B}\approx${n(CA.round(tot / (B * 1000), 2))}\). ${pl(Math.floor(tot / (B * 1000)), 'bottles')} ${Math.floor(tot / (B * 1000)) === 1 ? 'is' : 'are'} not enough, so round up: ${Math.ceil(tot / (B * 1000))}.`, { t: 'up', N: tot, S: B * 1000, ans: Math.ceil(tot / (B * 1000)) });
                        }
                        if (t === 2) {
                            const M = rng.pick([5, 10, 20]), c = rng.int(15, 95);
                            if ((M * 100) % c === 0) continue;
                            const thing = rng.pick(['stickers', 'postcards', 'pencils', 'badges']);
                            return mk(`${cap(thing)} cost ${c} cents each. How many can ${who} buy with $${M}?`, CA.num(Math.floor(M * 100 / c), thing),
                                R`$${M} \(=${M * 100}\) cents. \(${M * 100}\div${c}\approx${n(CA.round(M * 100 / c, 2))}\). ${Math.floor(M * 100 / c) + 1} would cost ${(Math.floor(M * 100 / c) + 1) * c} cents — too much — so round down: ${Math.floor(M * 100 / c)}.`, { t: 'down', N: M * 100, S: c, ans: Math.floor(M * 100 / c) });
                        }
                        if (t === 3) {
                            const A = rng.int(20, 90), k = rng.pick([6, 8, 10, 12]);
                            if (A % k === 0) continue;
                            return mk(`One litre of paint covers ${k} m². How many 1-litre tins are needed to paint ${A} m² of wall?`, CA.num(Math.ceil(A / k), 'tins'),
                                R`\(${A}\div${k}\approx${n(CA.round(A / k, 2))}\) L. ${pl(Math.floor(A / k), 'tins')} ${Math.floor(A / k) === 1 ? 'covers' : 'cover'} only ${Math.floor(A / k) * k} m², so round up: ${Math.ceil(A / k)}.`, { t: 'up', N: A, S: k, ans: Math.ceil(A / k) });
                        }
                        if (t === 4) {
                            const W = rng.pick([450, 500, 600, 630, 800, 1000]), p = rng.int(60, 90), b = rng.int(18, 45);
                            if ((W - p) % b === 0) continue;
                            return mk(`A lift can carry at most ${W} kg. A ${p} kg worker rides in it with boxes that weigh ${b} kg each. At most how many boxes can go in one trip?`, CA.num(Math.floor((W - p) / b), 'boxes'),
                                R`Room for boxes: \(${W}-${p}=${W - p}\) kg. \(${W - p}\div${b}\approx${n(CA.round((W - p) / b, 2))}\). ${Math.floor((W - p) / b) + 1} boxes would weigh ${(Math.floor((W - p) / b) + 1) * b} kg — too much — so round down: ${Math.floor((W - p) / b)}.`, { t: 'down', N: W - p, S: b, ans: Math.floor((W - p) / b) });
                        }
                        const V = rng.int(20, 120), b = rng.pick([6, 8, 9, 12, 15]);
                        if (V % b === 0 || V < 2 * b) continue;
                        return mk(`A garden tank holds ${V} L. ${who} fills it with a ${b} L bucket. How many buckets does it take to fill the empty tank completely?`, CA.num(Math.ceil(V / b), 'buckets'),
                            R`\(${V}\div${b}\approx${n(CA.round(V / b, 2))}\). ${pl(Math.floor(V / b), 'buckets')} ${Math.floor(V / b) === 1 ? 'gives' : 'give'} only ${Math.floor(V / b) * b} L, so round up: ${Math.ceil(V / b)}.`, { t: 'up', N: V, S: b, ans: Math.ceil(V / b) });
                    }
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'equation-hard', name: 'Equations: transfers, scores, surplus and shortage', level: 3,
                gen(rng) {
                    const t = rng.int(0, 4), [A, B] = rng.sample(NAMES, 2);
                    for (;;) {
                        if (t === 0) {
                            const k = rng.int(2, 6), mm = rng.int(1, k - 1), tt = rng.int(2, 20), x = tt * (mm + 1) / (k - mm);
                            if (!Number.isInteger(x) || x < 3 || x > 60) continue;
                            const thing = rng.pick(['marbles', 'stickers', 'football cards', 'stamps', 'shells']), askA = rng.bool();
                            const after = mm === 1 ? 'they have the same number' : `${A} has ${mm} times as many as ${B}`;
                            return mk(`${A} has ${k} times as many ${thing} as ${B}. After ${A} gives ${B} ${tt} ${thing}, ${after}. How many ${thing} did ${askA ? A : B} have at first?`, CA.num(askA ? k * x : x, thing),
                                R`Let ${B} have \(x\) at first, so ${A} had \(${k}x\). After: ${A} \(${lin(k, -tt)}\), ${B} \(${lin(1, tt)}\). Equal relationship: \(${lin(k, -tt)}=${mm === 1 ? '' : mm}(${lin(1, tt)})\), so \(${co(k - mm)}x=${tt * (mm + 1)}\) and \(x=${x}\)${askA ? R`; ${A} had \(${k * x}\)` : ''}.`, { t: 'transfer', k, mm, tt, askA, ans: askA ? k * x : x });
                        }
                        if (t === 1) {
                            const N = rng.pick([10, 15, 20, 25, 30]), p = rng.pick([3, 4, 5, 6, 10]), q = rng.int(1, 3), x = rng.int(Math.ceil(N / 2), N - 1), S = p * x - q * (N - x);
                            if (S <= 0) continue;
                            return mk(`A quiz has ${N} questions. Each correct answer scores ${p} points and each wrong answer loses ${q} point${q > 1 ? 's' : ''}. ${A} answers every question and scores ${S} points. How many did ${A} get right?`, CA.num(x),
                                R`Let \(x\) be right; \(${N}-x\) are wrong. \(${p}x-${q}(${N}-x)=${S}\), so \(${p + q}x=${S + q * N}\) and \(x=${x}\).`, { t: 'quiz', N, p, q, S, ans: x });
                        }
                        if (t === 2) {
                            const c = rng.int(6, 30), a = rng.int(3, 6), b = a + rng.int(1, 3), r = rng.int(1, (b - a) * c - 1), Tt = a * c + r, s = b * c - Tt, askC = rng.bool();
                            const [items, people] = rng.pick([['sweets', 'child'], ['pencils', 'student'], ['apples', 'camper'], ['stickers', 'player']]);
                            return mk(`A teacher shares some ${items}. If each ${people} gets ${a}, there are ${r} left over. If each ${people} gets ${b}, she is ${s} short. How many ${askC ? people + 's are there' : items + ' are there'}?`, CA.num(askC ? c : Tt),
                                R`Let there be \(x\) ${people}s. The number of ${items} is the same both ways: \(${a}x+${r}=${b}x-${s}\), so \(${co(b - a)}x=${r + s}\) and \(x=${c}\).${askC ? '' : R` ${cap(items)}: \(${a}\times${c}+${r}=${Tt}\).`}`, { t: 'surplus', a, r, b, s, askC, ans: askC ? c : Tt });
                        }
                        if (t === 3) {
                            const N = rng.pick([200, 300, 400, 500, 600, 800, 1000]), p = rng.int(2, 5), q = rng.int(5, 20), x = rng.int(2, N / 20), V = p * (N - x) - q * x;
                            const goods = rng.pick(['glass vases', 'mirrors', 'lamps', 'plates']);
                            return mk(`A company delivers ${N} ${goods}. It is paid $${p} for each one that arrives safely, but must pay $${q} for each one that breaks. It receives $${V} in total. How many ${goods} broke?`, CA.num(x),
                                R`Let \(x\) break; \(${N}-x\) arrive safely. \(${p}(${N}-x)-${q}x=${V}\), so \(${p * N}-${p + q}x=${V}\), \(${p + q}x=${p * N - V}\) and \(x=${x}\).`, { t: 'vases', N, p, q, V, ans: x });
                        }
                        const r = rng.int(5, 40), d = rng.int(2, 25), moreCh = rng.bool(), c = moreCh ? r + d : r - d;
                        if (c < 3) continue;
                        const L = 2 * c + 4 * r;
                        return mk(`A farm has ${d} ${moreCh ? 'more chickens than rabbits' : 'fewer chickens than rabbits'}. Together they have ${L} legs. How many rabbits are there?`, CA.num(r, 'rabbits'),
                            R`Let there be \(x\) rabbits and \(x${moreCh ? '+' : '-'}${d}\) chickens. \(4x+2(x${moreCh ? '+' : '-'}${d})=${L}\), so \(6x=${L}${moreCh ? '-' : '+'}${2 * d}=${6 * r}\) and \(x=${r}\).`, { t: 'crd', d, moreCh, L, ans: r });
                    }
                },
            },
            {
                id: 'rounding-hard', name: 'Rounding: try the neighbours', level: 3,
                gen(rng) {
                    const t = rng.int(0, 4), who = rng.pick(NAMES);
                    for (;;) {
                        if (t === 0) {
                            const C = rng.int(8, 60) * 5, s = rng.int(0, 10) * 5, w = rng.int(4, 25);
                            if (s >= C || (C - s) % w === 0 || (C - s) / w > 40) continue;
                            const k = Math.ceil((C - s) / w);
                            const thing = rng.pick(['a bike', 'a guitar', 'a tablet', 'a pair of skates', 'a telescope']);
                            return mk(`${who} has $${s} and saves $${w} every week. ${who} wants to buy ${thing} costing $${C}. After at least how many weeks can ${who} buy it?`, CA.num(k, 'weeks'),
                                R`Still needed: \(${C}-${s}=${C - s}\) dollars; \(${C - s}\div${w}\approx${n(CA.round((C - s) / w, 2))}\). After ${k - 1} weeks: \(${s}+${(k - 1) * w}=${s + (k - 1) * w}&lt;${C}\) ✗. After ${k} weeks: \(${s + k * w}\ge${C}\) ✓.`, { t: 'save', C, s, w, ans: k });
                        }
                        if (t === 1) {
                            const P = rng.pick([2, 2.4, 2.5, 3, 3.6, 4]), p = rng.int(25, 70), per = Math.floor(P * 100 / p), Np = rng.int(15, 80);
                            if ((P * 100) % p === 0 || per < 2 || Np % per === 0) continue;
                            return mk(`A carpenter cuts planks ${P} m long into pieces ${p} cm long. She needs ${Np} pieces. How many planks must she cut up?`, CA.num(Math.ceil(Np / per), 'planks'),
                                R`One plank: \(${P * 100}\div${p}\approx${n(CA.round(P * 100 / p, 2))}\), so ${per} pieces (round <strong>down</strong> — a short leftover is no use). Planks: \(${Np}\div${per}\approx${n(CA.round(Np / per, 2))}\); ${pl(Math.floor(Np / per), 'planks')} ${Math.floor(Np / per) === 1 ? 'gives' : 'give'} only ${Math.floor(Np / per) * per} pieces, so round <strong>up</strong>: ${Math.ceil(Np / per)}.`, { t: 'planks', P, p, Np, ans: Math.ceil(Np / per) });
                        }
                        if (t === 2) {
                            const b = rng.int(5, 10) * 50, r = rng.int(12, 28) * 10, M = rng.int(15, 60), rest = M * 100 - b;
                            if (rest % r === 0) continue;
                            const k = Math.floor(rest / r);
                            return mk(`A taxi charges ${money(b)} to start plus ${money(r)} for every kilometre. ${who} has $${M}. What is the greatest whole number of kilometres ${who} can travel?`, CA.num(k, 'km'),
                                R`After the start charge: \(${D(M * 100)}-${D(b)}=${D(rest)}\). \(${n(rest / 100)}\div${n(r / 100)}\approx${n(CA.round(rest / r, 2))}\). ${k} km cost \(${D(b + k * r)}\le${D(M * 100)}\) ✓; ${k + 1} km cost ${D(b + (k + 1) * r)} ✗.`, { t: 'taxi', b, r, M, ans: k });
                        }
                        if (t === 3) {
                            const Cc = rng.int(20, 120), p = rng.pick([150, 200, 250, 300, 350, 400]), X = rng.int(2, 20) * 5, need = (Cc + X) * 100;
                            if (need % p === 0) continue;
                            const k = Math.ceil(need / p);
                            const thing = rng.pick(['cupcakes', 'cups of lemonade', 'bracelets', 'cookies']);
                            return mk(`${who} spends $${Cc} on ingredients and sells ${thing} for ${money(p)} each. At least how many must ${who} sell to make a profit of at least $${X}?`, CA.num(k, thing),
                                R`Money needed: \(${Cc}+${X}=${Cc + X}\) dollars. \(${Cc + X}\div${n(p / 100)}\approx${n(CA.round(need / p, 2))}\). ${k - 1} bring in ${D((k - 1) * p)} ✗; ${k} bring in ${D(k * p)} ✓.`, { t: 'profit', Cc, p, X, ans: k });
                        }
                        const B = rng.int(40, 250), k = rng.pick([8, 12, 16, 20, 24, 28, 32, 36, 40]), sheets = B * k / 2;
                        if (sheets % 500 === 0) continue;
                        return mk(`A school prints ${B} booklets of ${k} pages each, double-sided (2 pages on each sheet of paper). Paper comes in packs of 500 sheets. How many packs are needed?`, CA.num(Math.ceil(sheets / 500), 'packs'),
                            R`Sheets: \(${B}\times${k}\div2=${sheets}\). \(${sheets}\div500=${n(sheets / 500)}\). ${pl(Math.floor(sheets / 500), 'packs')} ${Math.floor(sheets / 500) === 1 ? 'gives' : 'give'} only ${Math.floor(sheets / 500) * 500} sheets, so round up: ${Math.ceil(sheets / 500)}.`, { t: 'packs', B, k, ans: Math.ceil(sheets / 500) });
                    }
                },
            },
            {
                id: 'multi-step-hard', name: 'Multi-step problems with conversions', level: 3,
                gen(rng) {
                    const t = rng.int(0, 4), who = rng.pick(NAMES);
                    for (;;) {
                        if (t === 0) {
                            const f = rng.pick([5, 6, 6.5, 7, 7.5, 8, 9, 10]), Dk = rng.int(2, 16) * 50, pc = rng.int(80, 125) * 2, Lt = f * Dk / 100, cost = Lt * pc;
                            if (!Number.isInteger(cost)) continue;
                            return mk(`A car uses ${f} L of fuel for every 100 km. Fuel costs ${money(pc)} per litre. How much does the fuel cost for a ${Dk} km trip?`, usd(cost),
                                R`Fuel: \(${Dk}\div100\times${f}=${n(Lt)}\) L. Cost: \(${n(Lt)}\times${D(pc)}=${D(cost)}\).`, { t: 'fuel', f, Dk, pc, ans: cost / 100 });
                        }
                        if (t === 1) {
                            const l = rng.int(4, 25), w = rng.int(3, 12), d = rng.pick([1, 1.2, 1.5, 2]), r = rng.pick([200, 250, 300, 400, 500, 600, 800, 1000]);
                            const Lt = l * w * d * 1000, mins = Lt / r;
                            if (!Number.isInteger(mins) || mins % 15 || mins > 720 || w > l) continue;
                            return mk(`A swimming pool is ${l} m long, ${w} m wide and ${d} m deep. A pump fills it at ${r} L per minute. How many hours does it take to fill the empty pool?`, CA.num(mins / 60, 'h'),
                                R`Volume: \(${l}\times${w}\times${d}=${n(l * w * d)}\) m³. 1 m³ \(=100\times100\times100\) cm³ \(=1000\) L, so ${n(Lt)} L. Time: \(${Lt}\div${r}=${mins}\) min \(=${n(mins / 60)}\) h.`, { t: 'pool', l, w, d, r, ans: mins / 60 });
                        }
                        if (t === 2) {
                            const r = rng.int(6, 16) * 2, e = rng.int(1, 14) * 15, tot = 8 * 60 + e, pay = 8 * r * 100 + e / 60 * 1.5 * r * 100;
                            if (!Number.isInteger(pay)) continue;
                            return mk(`${who} is paid $${r} an hour for the first 8 hours of a day, and 1.5 times as much for every hour after that. One day ${who} works ${hm(tot)}. How much does ${who} earn that day?`, usd(pay),
                                R`Normal: \(8\times${D(r * 100)}=${D(8 * r * 100)}\). Extra time ${hm(e)} \(=${n(e / 60)}\) h at \(1.5\times${D(r * 100)}=${D(1.5 * r * 100)}\): \(${n(e / 60)}\times${D(1.5 * r * 100)}=${D(pay - 8 * r * 100)}\). Total ${D(pay)}.`, { t: 'pay', r, e, ans: pay / 100 });
                        }
                        if (t === 3) {
                            const v1 = rng.int(4, 12) * 10, t1 = rng.int(2, 12) * 15, v2 = rng.int(4, 12) * 10, t2 = rng.int(2, 12) * 15;
                            const d1 = v1 * t1 / 60, d2 = v2 * t2 / 60, avg = (d1 + d2) * 60 / (t1 + t2);
                            if (v1 === v2 || !Number.isInteger(d1) || !Number.isInteger(d2) || !Number.isInteger(avg) || avg === (v1 + v2) / 2) continue;
                            return mk(`A driver goes ${d1} km at ${v1} km/h and then ${d2} km at ${v2} km/h. What is the average speed for the whole journey, in km/h?`, CA.num(avg, 'km/h'),
                                R`Times: \(${d1}\div${v1}=${n(d1 / v1)}\) h and \(${d2}\div${v2}=${n(d2 / v2)}\) h, total ${n((t1 + t2) / 60)} h. Average speed \(=${d1 + d2}\div${n((t1 + t2) / 60)}=${avg}\) km/h — not the average of the two speeds.`, { t: 'avg', d1, v1, d2, v2, ans: avg });
                        }
                        const s = rng.pick([50, 60, 65, 70, 75, 80]), f = rng.pick([1, 2]), Dk = rng.pick([0.6, 0.9, 1.2, 1.5, 1.8, 2, 2.4, 3, 3.6, 4.2, 4.5]);
                        const steps = Dk * 100000 / s, mins = steps / f / 60;
                        if (!Number.isInteger(steps) || !Number.isInteger(mins)) continue;
                        return mk(`Each of ${who}'s steps is ${s} cm long, and ${who} takes ${f === 1 ? 'one step' : `${f} steps`} every second. How many minutes does it take ${who} to walk ${Dk} km?`, CA.num(mins, 'min'),
                            R`${Dk} km \(=${n(Dk * 100000)}\) cm. Steps: \(${n(Dk * 100000)}\div${s}=${steps}\). Seconds: \(${steps}\div${f}=${steps / f}\). Minutes: \(${steps / f}\div60=${mins}\).`, { t: 'stride', s, f, Dk, ans: mins });
                    }
                },
            },
        ],

        assignment: [
            ['convert-units', 4], ['mixed-units', 3], ['round-basic', 4], ['equation-basic', 4],
            ['speed-convert', 3], ['unit-price', 3], ['tank-volume', 3], ['multi-step', 3], ['equation-tickets', 3], ['chickens-rabbits', 3], ['ages', 3], ['rounding-real', 2],
            ['equation-hard', 4], ['rounding-hard', 4], ['multi-step-hard', 4],
        ],
    });
})();
