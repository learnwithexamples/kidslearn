/* Challenge Academy — Lesson 4: Efficiency Word Problems */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, T = CA.tex;

    // ── Small helpers ────────────────────────────────────────────────────
    const pl = (n, u) => R`${n} ${u}${n === 1 ? '' : 's'}`;                             // "1 day", "6 days"
    const time = (n, d, u) => CA.frac(n, d, n === d ? u : u + 's', { mixed: true });    // an answer such as 2 2/5 hours
    const fr = T.frac, mx = T.mixed;
    const one = a => R`\frac{1}{${a}}`;
    const lcm3 = (a, b, c) => CA.lcm(CA.lcm(a, b), c);
    const cap = s => s[0].toUpperCase() + s.slice(1);

    const NAMES = ['Ava', 'Ben', 'Cara', 'Dan', 'Eli', 'Faye', 'Gus', 'Hana', 'Ivan', 'Jade', 'Kai', 'Lena', 'Milo', 'Nora', 'Omar', 'Priya', 'Quinn', 'Rosa', 'Sam', 'Tara'];
    const JOBS = [
        ['paint a fence', 'hour'], ['build a garden wall', 'day'], ['dig a trench', 'day'], ['mow the school field', 'hour'],
        ['type up a long report', 'hour'], ['harvest a field of wheat', 'day'], ['tile a kitchen floor', 'hour'], ['clean the sports hall', 'hour'],
        ['plant a new garden', 'day'], ['paint a classroom', 'hour'], ['lay a garden path', 'day'], ['pack a big order of books', 'hour'],
        ['weed the vegetable beds', 'hour'], ['build a shed', 'day'], ['repair a stretch of road', 'day'], ['decorate the hall', 'hour'],
    ];
    const MACHINES = [
        ['Printer', 'print the school newsletter', 'hour'], ['Pump', 'empty a flooded cellar', 'hour'], ['Tractor', 'plough a large field', 'hour'],
        ['Machine', 'make an order of bolts', 'day'], ['Digger', 'dig out the foundations', 'day'], ['Robot', 'sort a warehouse of parcels', 'hour'],
    ];
    /** People or machines, a job and a time unit. */
    function ctx(rng, k = 2, machines = 0.25) {
        if (rng.bool(machines)) {
            const [thing, job, u] = rng.pick(MACHINES);
            return { who: ['A', 'B', 'C'].slice(0, k).map(x => R`${thing} ${x}`), job, u };
        }
        const [job, u] = rng.pick(JOBS);
        return { who: rng.sample(NAMES, k), job, u };
    }

    // ── Number lists built once (answers are always recomputed in the generators) ──
    const PAIRS = [], FRACPAIRS = [], TRIPLES = [], JOIN = [], LEAVE = [], FILLDRAIN = [], PIPE3 = [], ALT = [], STAGE = [], STAGE3 = [];
    for (let a = 2; a <= 60; a++) for (let b = a + 1; b <= 60; b++) {
        if ((a * b) % (a + b) === 0) PAIRS.push([a, b]);                      // together: a whole number
        else if (b <= 15 && CA.reduce(a * b, a + b)[1] <= 9) FRACPAIRS.push([a, b]);
        if ((a * b) % (b - a) === 0 && a * b / (b - a) <= 72) FILLDRAIN.push([a, b]);   // fill in a, drain in b
    }
    for (let a = 3; a <= 30; a++) for (let b = a + 1; b <= 40; b++) for (let c = b + 1; c <= 60; c++) {
        const s = a * b + b * c + c * a;
        if ((a * b * c) % s === 0) TRIPLES.push([a, b, c]);
    }
    for (let a = 4; a <= 30; a++) for (let b = 4; b <= 30; b++) {
        if (a === b) continue;
        for (let k = 1; k <= a - 2; k++) {
            if (((a - k) * b) % (a + b) === 0) JOIN.push([a, b, k]);          // A alone k, then both
            if ((k * b) % a === 0 && b - k * (a + b) / a >= 1 && k >= 2) LEAVE.push([a, b, k]);   // both for k, then B alone
        }
        // working on alternate days, A first: job = a·b units, A does b a day, B does a
        const n = Math.floor(a * b / (a + b)), rem = a * b - n * (a + b);
        const last = rem === 0 ? 1 : rem <= b ? CA.reduce(rem, b)[1] : CA.reduce(rem - b, a)[1];
        if (a >= 5 && b >= 5 && last <= 4) ALT.push([a, b]);
        for (let k1 = 1; k1 <= 6; k1++) for (let k2 = 1; k2 <= 6; k2++) {
            if ((b * (k1 + k2)) % a !== 0) continue;
            const y = b - b * (k1 + k2) / a - k2;
            if (y >= 1 && a >= 6 && b >= 6) STAGE.push([a, b, k1, k2]);
        }
    }
    for (let a = 4; a <= 30; a++) for (let b = a + 1; b <= 40; b++) for (let c = 6; c <= 60; c++) {
        const d = b * c + a * c - a * b;           // 1/a + 1/b − 1/c = d / abc
        if (d > 0 && (a * b * c) % d === 0 && a * b * c / d <= 60 && c !== a && c !== b) PIPE3.push([a, b, c]);
    }
    {
        const S = [6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30, 36, 40, 45, 48, 60];
        for (const a of S) for (const b of S) for (const c of S) {
            if (a === b || b === c || a === c) continue;
            for (let k1 = 1; k1 <= 4; k1++) for (let k2 = 1; k2 <= 4; k2++) {
                const num = c * (a * b - k1 * b - (k1 + k2) * a);         // total days T = num / ab
                if (num % (a * b) === 0 && num / (a * b) >= k1 + k2 + 1 && num / (a * b) <= 30) STAGE3.push([a, b, c, k1, k2]);
            }
        }
    }

    // ── Figure: a job drawn as a bar of equal units ──────────────────────
    function jobBar(units, segs, opt = {}) {
        const W = opt.w || 300, x0 = 4, y0 = 20, h = 26, cell = (W - 8) / units;
        let body = '', x = x0;
        for (const s of segs) {
            body += F.rect(x, y0, s.n * cell, h, { fill: s.fill || F.colors.FILL, stroke: 'none' });
            if (s.label) body += F.text(x + s.n * cell / 2, y0 + h / 2 + 4.5, s.label, { size: 12, bold: true });
            if (s.top) body += F.text(x + s.n * cell / 2, y0 - 6, s.top, { size: 12 });
            x += s.n * cell;
        }
        for (let i = 0; i <= units; i++) body += F.line(x0 + i * cell, y0, x0 + i * cell, y0 + h, { width: 1 });
        body += F.rect(x0, y0, units * cell, h);
        for (const g of opt.groups || []) body += F.text(x0 + (g.from + g.n / 2) * cell, y0 + h + 15, g.label, { size: 12 });
        return F.svg(W, y0 + h + (opt.groups ? 22 : 6), body, { label: 'job bar' });
    }
    const C = F.colors;

    // ── Figure: scatter plot of work time (across) against workload (up) ──
    function scatter(pts, o) {
        const W = 292, H = 218, L = 50, B = 36, Tp = 24, Rt = 16, pw = W - L - Rt, ph = H - Tp - B;
        const xstep = o.xstep || 1, X = x => L + x / o.xmax * pw, Y = y => Tp + ph - y / o.ymax * ph;
        let b = '';
        for (let x = xstep; x <= o.xmax; x += xstep) b += F.line(X(x), Tp, X(x), Tp + ph, { stroke: '#dde3ee', width: 1 }) + F.text(X(x), Tp + ph + 13, x, { size: 11 });
        for (let y = o.ystep; y <= o.ymax; y += o.ystep) b += F.line(L, Y(y), L + pw, Y(y), { stroke: '#dde3ee', width: 1 }) + F.text(L - 5, Y(y) + 4, y, { size: 11, anchor: 'end' });
        b += F.text(L - 5, Y(0) + 13, '0', { size: 11, anchor: 'end' });
        b += F.line(L, Tp, L, Tp + ph) + F.line(L, Tp + ph, L + pw, Tp + ph);
        b += F.text(L + pw / 2, H - 5, o.xlabel, { size: 12 });
        b += R`<text x="12" y="${Tp + ph / 2}" text-anchor="middle" fill="${F.colors.INK}" stroke="none" font-size="12" transform="rotate(-90 12 ${Tp + ph / 2})">${o.ylabel}</text>`;
        if (o.lines !== false) for (const p of pts) b += F.line(X(0), Y(0), X(p.x), Y(p.y), { stroke: F.colors.DARK, width: 1.5 });
        for (const p of pts) {
            const edge = X(p.x) > L + pw - 18;          // keep the label inside the frame
            b += F.dot(X(p.x), Y(p.y), { r: 3.5, fill: F.colors.ACCENT });
            b += F.text(X(p.x) + (edge ? 5 : 0), Y(p.y) - 8, p.label, { size: 12, bold: true, anchor: edge ? 'end' : 'middle' });
        }
        return F.svg(W, H, b, { label: 'scatter plot of work time and workload' });
    }

    CA.register({
        id: 4,

        tutorial: [
            {
                h: 'Workload, work efficiency and work time',
                html: R`
                <p>Every problem in this lesson is about three quantities:</p>
                <ul>
                    <li><strong>Workload</strong> — how much work there is: 240 bottles to fill, 600 pages to print, or
                        simply "one fence to paint".</li>
                    <li><strong>Work time</strong> — how long the work takes.</li>
                    <li><strong>Work efficiency</strong> — how much work is done in <em>one unit of time</em>
                        (one minute, one hour, one day). It is the worker's speed, also called the rate of work.</li>
                </ul>
                <div class="ca-formula">\[ \text{workload} = \text{work efficiency} \times \text{work time} \]
                    \[ \text{work efficiency} = \text{workload} \div \text{work time} \qquad\quad
                       \text{work time} = \text{workload} \div \text{work efficiency} \]</div>
                <p>If a machine fills 240 bottles in 6 minutes, its work efficiency is \(240\div6=40\) bottles per
                   minute. A workload of 1000 bottles then needs a work time of \(1000\div40=25\) minutes, and in
                   15 minutes the machine gets through a workload of \(40\times15=600\) bottles.</p>
                <div class="ca-tip"><strong>It is the same triangle as speed.</strong> Distance = speed × time has
                   exactly this shape: workload plays the part of distance and work efficiency plays the part of
                   speed.</div>
                <div class="ca-warn"><strong>More efficient means less time.</strong> For a fixed workload, doubling
                   the efficiency <em>halves</em> the time. Efficiency and time move in opposite directions.</div>`,
            },
            {
                h: 'Reading efficiency from a scatter plot',
                html: R`
                <p>A <strong>scatter plot</strong> can show several workers at once. Each worker is one point: the
                   point's position across is the <em>work time</em> and its height is the <em>workload</em> finished
                   in that time.</p>
                ${F.row(F.cap(scatter([{ x: 4, y: 60, label: 'Ava' }, { x: 6, y: 60, label: 'Ben' }, { x: 6, y: 30, label: 'Cara' }],
                    { xmax: 8, ymax: 80, ystep: 10, xlabel: 'work time (hours)', ylabel: 'workload (boxes)' }), 'Boxes packed by three workers'))}
                <div class="ca-key"><strong>Draw a line from the origin to each point.</strong> The
                   <strong>steeper</strong> the line, the <strong>faster</strong> the rate (the higher the work
                   efficiency). The less steep the line, the slower the rate.</div>
                <p>Why? The steepness of the line is "height ÷ distance across" — and that is
                   workload ÷ work time, the efficiency itself.</p>
                <table>
                    <tr><th>Worker</th><th>Point</th><th>Work efficiency</th><th>Line</th></tr>
                    <tr><td>Ava</td><td>60 boxes in 4 h</td><td>\(60\div4=15\) boxes per hour</td><td>steepest</td></tr>
                    <tr><td>Ben</td><td>60 boxes in 6 h</td><td>\(60\div6=10\) boxes per hour</td><td>in between</td></tr>
                    <tr><td>Cara</td><td>30 boxes in 6 h</td><td>\(30\div6=5\) boxes per hour</td><td>least steep</td></tr>
                </table>
                <ul>
                    <li>Ava and Ben did the <em>same workload</em>, but Ava took less time — her point is further
                        left, so her line is steeper.</li>
                    <li>Ben and Cara worked for the <em>same time</em>, but Ben did more — his point is higher, so his
                        line is steeper.</li>
                </ul>
                <div class="ca-tip"><strong>Higher is not always faster.</strong> A point high up on the right may
                   belong to a slow worker who simply worked for a long time. Compare the <em>lines</em>, not the
                   heights.</div>`,
            },
            {
                h: 'Collaborative problems: the workload is "1"',
                html: R`
                <p>Often the workload is not counted in boxes at all — it is simply <em>one job</em>. Then we
                   <strong>consider the workload as "1"</strong> and measure efficiency in <em>fractions of the job</em>
                   per unit of time.</p>
                <div class="ca-key">If Ava can paint a fence in 6 hours, her work efficiency is \(1\div6=\frac16\) of the
                   fence per hour. <br>Work time \(=t\) &nbsp;⟺&nbsp; work efficiency \(=\dfrac1t\): the two are
                   <strong>reciprocals</strong>.</div>
                <p>Now let Ava (3 hours alone) and Ben (6 hours alone) paint the same fence <em>together</em>.</p>
                <div class="ca-warn"><strong>Never add or average the times.</strong> "3 + 6 = 9 hours" is silly —
                   two people cannot be slower than one. Times do not add. <strong>Efficiencies</strong> add.</div>
                <div class="ca-formula">\[ \text{efficiency of working together} = \text{sum of the individual efficiencies} \]</div>
                <p>In one hour Ava paints \(\frac13\) and Ben paints \(\frac16\), so together they paint
                   \(\frac13+\frac16=\frac36=\frac12\) of the fence. The work time is workload ÷ efficiency:
                   \(1\div\frac12=2\) hours.</p>
                ${F.row(F.cap(jobBar(6, [{ n: 2, label: 'Ava' }, { n: 1, label: 'Ben', fill: C.SHADE }, { n: 2, label: 'Ava' }, { n: 1, label: 'Ben', fill: C.SHADE }],
                    { groups: [{ from: 0, n: 3, label: 'hour 1' }, { from: 3, n: 3, label: 'hour 2' }] }), 'The fence cut into 6 equal strips'))}
                <div class="ca-formula">\[ \text{time together} = 1\div\left(\frac1a+\frac1b\right) = \frac{ab}{a+b} \]</div>
                <p>Run the same idea backwards to find a missing worker:</p>
                <div class="ca-formula">\[ \text{an individual's efficiency} = \text{group efficiency} - \text{efficiency of the others} \]</div>
                <p>If two people together take 4 days and one of them alone takes 6 days, the other's efficiency is
                   \(\frac14-\frac16=\frac1{12}\), so the other would take 12 days alone. With three workers, add three
                   efficiencies — or subtract two from the group's.</p>`,
            },
            {
                h: 'The "units of work" trick',
                html: R`
                <p>If you would rather not juggle fractions, <em>choose</em> a size for the job. Pick a number that
                   all the times divide into — the <strong>least common multiple</strong> is best.</p>
                <p>Instead of calling the workload 1, you may call it any convenient number. Ava takes 3 hours and Ben takes 6 hours. Say the fence has \(6\) strips (the LCM of 3 and 6).</p>
                <table>
                    <tr><th></th><th>Work time alone</th><th>Work efficiency (strips per hour)</th></tr>
                    <tr><td>Ava</td><td>3 h</td><td>\(6\div3=2\)</td></tr>
                    <tr><td>Ben</td><td>6 h</td><td>\(6\div6=1\)</td></tr>
                    <tr><td>Together</td><td>\(6\div3=2\) h</td><td>\(2+1=3\)</td></tr>
                </table>
                <p>It is exactly the same calculation as before — the picture in the last section shows it — but every
                   number is a whole number. Use whichever method you like; the answers always agree.</p>
                <div class="ca-key"><strong>Efficiency ratios.</strong> Efficiencies and times are reciprocals, so their ratios
                   are <em>upside down</em>. Ava is twice as efficient as Ben (2 strips to 1), so she needs
                   <em>half</em> the time (3 h to 6 h). If the efficiencies are in the ratio \(3:2\), the times are
                   in the ratio \(2:3\).</div>
                <p>Example: A is three times as efficient as B, and together they finish in 6 days. Give B an efficiency of
                   1 unit a day and A an efficiency of 3. Together they do 4 units a day, so the job is \(4\times6=24\) units.
                   B alone needs \(24\div1=24\) days and A alone needs \(24\div3=8\) days.</p>`,
            },
            {
                h: 'Jobs done in stages',
                html: R`
                <p>In harder problems the team changes: one person starts and another joins later, or somebody leaves
                   part-way. The whole job is still 1, so:</p>
                <div class="ca-formula">\[ \text{(work in stage 1)} + \text{(work in stage 2)} + \cdots = 1 \]</div>
                <p><strong>One starts, the other joins.</strong> Ava (10 days alone) works for 4 days, then Ben (15 days
                   alone) joins her.</p>
                <ul>
                    <li>Stage 1: Ava does \(4\times\frac1{10}=\frac25\). Left: \(\frac35\).</li>
                    <li>Stage 2: together they do \(\frac1{10}+\frac1{15}=\frac16\) a day, so \(\frac35\div\frac16=\frac{18}{5}=3\frac35\) more days.</li>
                </ul>
                <p><strong>One leaves.</strong> Both work for 3 days, then Ava leaves. Together they have done
                   \(3\times\frac16=\frac12\); Ben finishes the other half in \(\frac12\div\frac1{15}=7\frac12\) days.</p>
                <div class="ca-tip"><strong>Count each person's own days.</strong> Often the quickest way is to ask
                   "how long did <em>each</em> person work altogether?" If Ava worked 6 days in total, she did
                   \(\frac6{10}\) of the job no matter when those days were, and Ben must have done the other
                   \(\frac4{10}\).</div>
                <div class="ca-warn"><strong>Divide the workload that is <em>left</em></strong> by the new efficiency — not the
                   whole job. Forgetting to subtract the work already done is the classic slip.</div>`,
            },
            {
                h: 'Inlet and outlet water',
                html: R`
                <p>A pipe is a "worker" too, and the workload is one full tank, "1". An <strong>inlet pipe</strong> that
                   fills the tank in 4 hours has an inflow efficiency of \(\frac14\) of the tank per hour. An
                   <strong>outlet pipe</strong> (a drain) that empties the full tank in 12 hours has an outflow
                   efficiency of \(\frac1{12}\). There are three cases.</p>
                <table>
                    <tr><th>Pipes open</th><th>Overall efficiency</th><th>Example (inlets 4 h and 6 h; outlets 12 h)</th></tr>
                    <tr><td><strong>(1)</strong> Two inlet pipes</td><td>total inflow = sum of the two</td>
                        <td>\(\frac14+\frac16=\frac5{12}\): fills in \(\frac{12}5=2\frac25\) h</td></tr>
                    <tr><td><strong>(2)</strong> Two outlet pipes</td><td>total outflow = sum of the two</td>
                        <td>\(\frac1{12}+\frac1{12}=\frac16\): a full tank empties in 6 h</td></tr>
                    <tr><td><strong>(3)</strong> One inlet, one outlet</td><td>they work against each other: subtract</td>
                        <td>\(\frac14-\frac1{12}=\frac16\): fills in 6 h</td></tr>
                </table>
                <div class="ca-formula">\[ \text{overall inflow efficiency} = \text{inlet} - \text{outlet} \quad(\text{inlet faster: the tank fills}) \]
                    \[ \text{overall outflow efficiency} = \text{outlet} - \text{inlet} \quad(\text{outlet faster: the tank empties}) \]</div>
                <p>In case (3), compare the two efficiencies first. If the inlet is the faster one, an empty tank slowly
                   fills. If the outlet is faster, a full tank slowly empties: with an inlet of \(\frac1{12}\) and an
                   outlet of \(\frac14\), the tank loses \(\frac14-\frac1{12}=\frac16\) each hour and is empty after 6 hours.</p>
                <ul>
                    <li><strong>A leak</strong> is an outlet you did not ask for. If an inlet pipe normally fills a tank in
                        4 hours but takes 6 hours because of a leak, the leak's efficiency is
                        \(\frac14-\frac16=\frac1{12}\): it alone would empty the full tank in 12 hours.</li>
                    <li>With more pipes, add all the inlets and subtract all the outlets.</li>
                </ul>`,
            },
            {
                h: 'Pairs of workers, taking turns and fair pay',
                html: R`
                <p><strong>Pairs → everyone.</strong> A and B together take 12 days, B and C take 15 days, A and C take
                   20 days. How long do all three take? Add the three pair-efficiencies. Each person appears in exactly
                   <em>two</em> of the pairs, so the total is <em>twice</em> the efficiency of all three:</p>
                <div class="ca-formula">\[ 2\times(A+B+C)=\frac1{12}+\frac1{15}+\frac1{20}=\frac{5+4+3}{60}=\frac15
                    \quad\Longrightarrow\quad A+B+C=\frac1{10} \]</div>
                <p>All three together take 10 days. And now each person can be found too: C's efficiency (group − the others) is
                   \(\frac1{10}-\frac1{12}=\frac1{60}\), so C alone would need 60 days.</p>
                <p><strong>Taking turns.</strong> If A and B work on alternate days, treat two days as one "cycle" in
                   which they do \(\frac1a+\frac1b\). Count whole cycles until less than one cycle of work is left,
                   then finish the last day or two by hand — the last day may be only part of a day.</p>
                <div class="ca-tip"><strong>Sharing the pay.</strong> When a team is paid for a job, a fair share is
                   in proportion to the <em>workload each person did</em>: work efficiency × the time that person worked.</div>`,
            },
        ],

        summary: [
            {
                topic: 'Basic formulas and applications',
                points: [
                    R`Workload = work efficiency × work time. &nbsp; Work efficiency = workload ÷ work time. &nbsp; Work time = workload ÷ work efficiency.`,
                    R`On a scatter plot (work time across, workload up), draw a line from the origin to each point. The steeper the line, the faster the rate; the less steep, the slower.`,
                ],
            },
            {
                topic: 'Collaborative problems',
                points: [
                    R`Consider the workload as "1". A job that takes \(t\) days alone means an efficiency of \(\frac1t\) per day.`,
                    R`Efficiency of working together = sum of the individual efficiencies.`,
                    R`An individual's efficiency = group efficiency − efficiency of the others.`,
                ],
            },
            {
                topic: 'Inlet and outlet water',
                points: [
                    R`Two inlet pipes: add the efficiencies to get the total inflow efficiency.`,
                    R`Two outlet pipes: add the efficiencies to get the total outflow efficiency.`,
                    R`One inlet and one outlet: overall inflow efficiency = inlet − outlet (the tank fills); overall outflow efficiency = outlet − inlet (the tank empties).`,
                ],
            },
        ],

        examples: [
            {
                title: 'Efficiency from a scatter plot',
                q: R`The scatter plot shows how many pages three printers printed and how long each one ran. Which printer has the highest work efficiency, and how long would it take to print 900 pages?`,
                fig: F.row(scatter([{ x: 3, y: 120, label: 'P' }, { x: 5, y: 100, label: 'Q' }, { x: 8, y: 240, label: 'R' }], { xmax: 8, ymax: 320, ystep: 40, xlabel: 'work time (minutes)', ylabel: 'workload (pages)' })),
                steps: [
                    R`Draw a line from the origin to each point. The steepest line belongs to P — even though R's point is the highest.`,
                    R`Check with the formula, work efficiency = workload ÷ work time: P: \(120\div3=40\); Q: \(100\div5=20\); R: \(240\div8=30\) pages per minute.`,
                    R`P is the most efficient, at 40 pages per minute.`,
                    R`Work time = workload ÷ work efficiency: \(900\div40=22\frac12\) minutes.`,
                ],
                answer: R`Printer P; \(22\frac12\) minutes`,
            },
            {
                title: 'Two workers together',
                q: R`Maya can clean the sports hall in 4 hours. Leo can clean it in 6 hours. How long do they take working together?`,
                fig: F.row(jobBar(12, [{ n: 3, label: 'Maya' }, { n: 2, label: 'Leo', fill: C.SHADE }, { n: 7, label: '', fill: '#fff' }], { groups: [{ from: 0, n: 5, label: 'done in 1 hour' }] })),
                steps: [
                    R`Take the workload as 1. Efficiencies: Maya does \(\frac14\) of the job per hour, Leo does \(\frac16\).`,
                    R`Efficiency together = sum of the individual efficiencies: \(\frac14+\frac16=\frac3{12}+\frac2{12}=\frac5{12}\).`,
                    R`Work time = workload ÷ efficiency: \(1\div\frac5{12}=\frac{12}{5}=2\frac25\) hours.`,
                    R`Check with units: call the job 12 units. Maya does 3 an hour, Leo 2, together 5. \(12\div5=2\frac25\). ✓ (That is 2 hours 24 minutes.)`,
                ],
                answer: R`\(2\frac25\) hours`,
            },
            {
                title: 'Finding the other worker',
                q: R`Two printers together finish a print run in 6 hours. The faster printer alone would take 10 hours. How long would the slower printer take alone?`,
                steps: [
                    R`Together they do \(\frac16\) of the run per hour; the faster printer does \(\frac1{10}\).`,
                    R`An individual's efficiency = group efficiency − efficiency of the others: \(\frac16-\frac1{10}=\frac5{30}-\frac3{30}=\frac2{30}=\frac1{15}\).`,
                    R`An efficiency of \(\frac1{15}\) per hour means 15 hours for the whole run.`,
                ],
                answer: R`15 hours`,
            },
            {
                title: 'One inlet and one outlet',
                q: R`An inlet pipe fills a tank in 6 hours. An outlet pipe empties the full tank in 9 hours. The tank is empty and both pipes are opened. How long until the tank is full?`,
                steps: [
                    R`Inflow efficiency \(\frac16\) of a tank per hour; outflow efficiency \(\frac19\). The inlet is faster, so the tank fills.`,
                    R`Overall inflow efficiency = inlet − outlet: \(\frac16-\frac19=\frac3{18}-\frac2{18}=\frac1{18}\).`,
                    R`So the tank fills in 18 hours.`,
                ],
                answer: R`18 hours`,
            },
            {
                title: 'Pairs of workers',
                q: R`A and B together can do a job in 10 days. B and C together take 15 days. A and C together take 12 days. How long would all three take working together?`,
                steps: [
                    R`Add the three pair-efficiencies: \(\frac1{10}+\frac1{15}+\frac1{12}=\frac{6+4+5}{60}=\frac{15}{60}=\frac14\).`,
                    R`Each person was counted twice, so this is twice the efficiency of all three together.`,
                    R`Efficiency of A, B and C together: \(\frac14\div2=\frac18\).`,
                    R`So all three take 8 days.`,
                ],
                answer: R`8 days`,
            },
            {
                title: 'Taking turns',
                q: R`Pia could do a job alone in 6 days and Raj could do it alone in 12 days. They work on alternate days, one full day each, and Pia starts. How many days does the job take?`,
                steps: [
                    R`One cycle of 2 days (Pia, then Raj) does \(\frac16+\frac1{12}=\frac3{12}=\frac14\) of the job.`,
                    R`After 3 cycles (6 days), \(\frac34\) is done and \(\frac14\) is left — exactly one more cycle would finish it, but let us look closely at who works when.`,
                    R`Day 7 is Pia's: she does \(\frac16\), leaving \(\frac14-\frac16=\frac1{12}\).`,
                    R`Day 8 is Raj's: he does \(\frac1{12}\) in a day — exactly what is left. The job ends at the end of day 8.`,
                ],
                answer: R`8 days`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'job-fractions', name: 'Fractions of a job', level: 1,
                gen(rng) {
                    const { who: [A], job, u } = ctx(rng, 1, 0), form = rng.int(0, 4);
                    if (form <= 1) {
                        const a = rng.int(4, 24), k = rng.int(1, a - 1);
                        return form === 0 ? {
                            q: R`${A} can ${job} in ${pl(a, u)}, working at a steady rate. What fraction of the job does ${A} do in ${pl(k, u)}? Give a fraction in lowest terms.`,
                            ans: CA.frac(k, a),
                            sol: R`Each ${u} ${A} does ${m(one(a))} of the job. In ${pl(k, u)}: ${m(R`${k}\times${one(a)}=${fr(k, a)}`)}.`,
                        } : {
                            q: R`${A} can ${job} in ${pl(a, u)}, working at a steady rate. After ${A} has worked for ${pl(k, u)}, what fraction of the job is still left? Give a fraction in lowest terms.`,
                            ans: CA.frac(a - k, a),
                            sol: R`In ${pl(k, u)} ${A} does ${m(R`${k}\times${one(a)}=${fr(k, a)}`)} of the job. Left: ${m(R`1-${fr(k, a)}=${fr(a - k, a)}`)}.`,
                        };
                    }
                    let p, q; do { q = rng.int(3, 8); p = rng.int(1, q - 1); } while (CA.gcd(p, q) !== 1);
                    const j = rng.int(1, 6), part = R`\frac{${p}}{${q}}`;
                    if (form === 2) return {
                        q: R`${A} takes ${pl(p * j, u)} to do ${m(part)} of a job. Working at the same rate, how long does the whole job take ${A}?`,
                        ans: time(q * j, 1, u),
                        sol: R`Work efficiency: ${m(R`${part}\div${p * j}=${fr(1, q * j)}`)} of the job per ${u}. So the whole job takes ${pl(q * j, u)}.`,
                    };
                    if (form === 3) return {
                        q: R`After working for ${pl(p * j, u)}, ${A} has finished ${m(part)} of a job. At the same rate, how much longer will ${A} need to finish it?`,
                        ans: time((q - p) * j, 1, u),
                        sol: R`${m(part)} takes ${pl(p * j, u)}, so ${m(one(q))} takes ${m(R`${p * j}\div${p}=${j}`)} ${u}${j === 1 ? '' : 's'}. The remaining ${m(fr(q - p, q))} takes ${m(R`${q - p}\times${j}=${(q - p) * j}`)} ${u}${(q - p) * j === 1 ? '' : 's'}.`,
                    };
                    return {
                        q: R`${A} can ${job} in ${pl(q * j, u)}, working at a steady rate. How long does ${A} take to do ${m(part)} of the job?`,
                        ans: time(p * j, 1, u),
                        sol: R`${m(R`${part}\times${q * j}=${p * j}`)} ${u}${p * j === 1 ? '' : 's'}.`,
                    };
                },
            },
            {
                id: 'together-two', name: 'Two working together', level: 1,
                gen(rng) {
                    const [a, b] = rng.shuffle(rng.pick(PAIRS)), { who: [A, B], job, u } = ctx(rng);
                    const t = a * b / (a + b);
                    const q = rng.pick([
                        R`${A} can ${job} in ${pl(a, u)}. ${B} can do the same job in ${pl(b, u)}. How long will the job take if they work together?`,
                        R`Working alone, ${A} would take ${pl(a, u)} to ${job} and ${B} would take ${pl(b, u)}. How long do they take working together?`,
                        R`${A} needs ${pl(a, u)} to ${job}; ${B} needs ${pl(b, u)} for the same job. If both work at the same time, how long does the job take?`,
                    ]);
                    return {
                        q, ans: time(t, 1, u),
                        sol: R`Take the workload as 1 and add the efficiencies: ${m(R`${one(a)}+${one(b)}=\frac{${a + b}}{${a * b}}=${fr(a + b, a * b)}`)} of the job per ${u}. Work time = ${m(R`1\div${fr(a + b, a * b)}`)}: ${pl(t, u)}.`,
                    };
                },
            },
            {
                id: 'rate-from-work', name: 'Workload = efficiency × time', level: 1,
                gen(rng) {
                    const [noun, verbs, verb, items, u] = rng.pick([
                        ['printer', 'prints', 'print', 'pages', 'minute'], ['bottling machine', 'fills', 'fill', 'bottles', 'minute'],
                        ['baker', 'bakes', 'bake', 'loaves', 'hour'], ['packer', 'packs', 'pack', 'boxes', 'hour'],
                        ['pump', 'moves', 'move', 'litres of water', 'minute'], ['typist', 'types', 'type', 'words', 'minute'],
                        ['robot', 'welds', 'weld', 'car doors', 'hour'], ['weaver', 'weaves', 'weave', 'scarves', 'day'],
                    ]);
                    const r = rng.pick([6, 8, 12, 15, 20, 24, 25, 30, 36, 40, 45, 60]), h = rng.int(3, 9), form = rng.int(0, 3);
                    let h2; do { h2 = rng.int(2, 15); } while (h2 === h);
                    const given = R`${cap(noun.match(/^[aeiou]/) ? 'an ' : 'a ')}${noun} ${verbs} ${r * h} ${items} in ${pl(h, u)}, working at a steady rate.`;
                    if (form === 0) return {
                        q: R`${given} What is the ${noun}'s work efficiency, in ${items} per ${u}?`,
                        ans: CA.num(r, R`${items} per ${u}`),
                        sol: R`Work efficiency = workload ÷ work time: ${m(R`${r * h}\div${h}=${r}`)} ${items} per ${u}.`,
                    };
                    if (form === 1) return {
                        q: R`${given} At the same rate, how long does it take to ${verb} ${r * h2} ${items}?`,
                        ans: time(h2, 1, u),
                        sol: R`Work efficiency: ${m(R`${r * h}\div${h}=${r}`)} ${items} per ${u}. Work time = workload ÷ efficiency: ${m(R`${r * h2}\div${r}=${h2}`)} ${u}s.`,
                    };
                    if (form === 2) return {
                        q: R`${given} At the same rate, how many ${items} does the ${noun} ${verb} in ${pl(h2, u)}?`,
                        ans: CA.num(r * h2, items),
                        sol: R`Work efficiency: ${m(R`${r * h}\div${h}=${r}`)} ${items} per ${u}. Workload = efficiency × time: ${m(R`${r}\times${h2}=${r * h2}`)} ${items}.`,
                    };
                    let r2; do { r2 = rng.pick([5, 10, 15, 20, 30, 40, 50]); } while (r2 === r);
                    return {
                        q: R`One ${noun} ${verbs} ${r} ${items} per ${u}. Another ${verbs} ${r2} ${items} per ${u}. Working at the same time, how long do they take to ${verb} ${(r + r2) * h2} ${items} altogether?`,
                        ans: time(h2, 1, u),
                        sol: R`Add the efficiencies: ${m(R`${r}+${r2}=${r + r2}`)} ${items} per ${u}. Work time = workload ÷ efficiency: ${m(R`${(r + r2) * h2}\div${r + r2}=${h2}`)} ${u}s.`,
                    };
                },
            },

            {
                id: 'scatter-efficiency', name: 'Efficiency on a scatter plot', level: 1,
                gen(rng) {
                    const [who, items, done, u, people] = rng.pick([
                        ['workers', 'boxes', 'packed', 'hour', 1], ['printers', 'pages', 'printed', 'minute', 0], ['machines', 'bottles', 'filled', 'minute', 0],
                        ['bakers', 'loaves', 'baked', 'hour', 1], ['typists', 'pages', 'typed', 'hour', 1], ['robots', 'parts', 'made', 'hour', 0],
                        ['painters', 'fence panels', 'painted', 'hour', 1], ['pickers', 'baskets', 'picked', 'hour', 1], ['pumps', 'litres', 'pumped', 'minute', 0],
                    ]);
                    const k = rng.int(3, 4), ystep = rng.pick([5, 10, 10, 20, 50]), form = rng.int(0, 3);
                    const labels = people ? rng.sample(['Ava', 'Ben', 'Cara', 'Dan', 'Eli', 'Faye', 'Gus', 'Hana', 'Ivan', 'Jade', 'Kai', 'Lena'], k).sort() : ['A', 'B', 'C', 'D'].slice(0, k);
                    let pts;
                    for (;;) {
                        pts = labels.map(label => ({ label, x: rng.int(2, 8), y: ystep * rng.int(1, 8) }));
                        let ok = pts.some(p => p.y % p.x === 0);
                        for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) {
                            const p = pts[i], q = pts[j];
                            if (p.y * q.x === q.y * p.x) ok = false;                                   // same efficiency: no single answer
                            if (Math.hypot((p.x - q.x) * 28, (p.y - q.y) / ystep * 20) < 44) ok = false;   // labels would collide
                            const ang = Math.abs(Math.atan2(p.y / ystep * 20, p.x * 28) - Math.atan2(q.y / ystep * 20, q.x * 28));
                            if (ang < 0.07) ok = false;                                               // lines too close to tell apart
                        }
                        if (ok) break;
                    }
                    const fig = F.row(scatter(pts, { xmax: 8, ymax: 8 * ystep, ystep, xlabel: R`work time (${u}s)`, ylabel: R`workload (${items})` }));
                    const intro = R`The scatter plot shows how many ${items} each of ${k} ${who} ${done}, and the work time each one took.`;
                    const effs = pts.map(p => R`${p.label}: ${m(R`${p.y}\div${p.x}=${mx(p.y, p.x)}`)}`).join('; ');
                    if (form <= 1) {
                        const best = pts.slice().sort((p, q) => (form === 0 ? q.y * p.x - p.y * q.x : p.y * q.x - q.y * p.x))[0];
                        return {
                            q: R`${intro} Which one has the <strong>${form === 0 ? 'highest' : 'lowest'}</strong> work efficiency?`,
                            fig, ans: CA.mc(rng, best.label, labels, { keepOrder: true }),
                            sol: R`Draw a line from the origin to each point: the ${form === 0 ? 'steepest' : 'least steep'} line goes to ${best.label}. Check with efficiency = workload ÷ time (${items} per ${u}) — ${effs}.`,
                        };
                    }
                    const p = rng.pick(pts.filter(p => p.y % p.x === 0)), e = p.y / p.x, t2 = rng.int(9, 20);
                    const name = people ? p.label : R`${who.slice(0, -1)} ${p.label}`;
                    if (form === 2) return {
                        q: R`${intro} What is the work efficiency of ${name}, in ${items} per ${u}?`,
                        fig, ans: CA.num(e, R`${items} per ${u}`),
                        sol: R`The point for ${p.label} is at ${p.x} ${u}s and ${p.y} ${items}. Work efficiency = workload ÷ work time: ${m(R`${p.y}\div${p.x}=${e}`)} ${items} per ${u}.`,
                    };
                    return {
                        q: R`${intro} Working at the same efficiency, how long would ${name} need for a workload of ${e * t2} ${items}?`,
                        fig, ans: time(t2, 1, u),
                        sol: R`${p.label}'s point is at ${p.x} ${u}s and ${p.y} ${items}, so the work efficiency is ${m(R`${p.y}\div${p.x}=${e}`)} ${items} per ${u}. Work time = workload ÷ efficiency: ${m(R`${e * t2}\div${e}=${t2}`)} ${u}s.`,
                    };
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'together-harder', name: 'Working together — fractions and three workers', level: 2,
                gen(rng) {
                    if (rng.bool()) {
                        const [a, b] = rng.shuffle(rng.pick(FRACPAIRS)), { who: [A, B], job, u } = ctx(rng);
                        return {
                            q: R`${A} can ${job} in ${pl(a, u)} and ${B} can do it in ${pl(b, u)}. How long do they take if they work together? Give your answer as a mixed number or a fraction.`,
                            ans: time(a * b, a + b, u),
                            sol: R`Take the workload as 1. Efficiency together: ${m(R`${one(a)}+${one(b)}=${fr(a + b, a * b)}`)} of the job per ${u}. Time: ${m(R`1\div${fr(a + b, a * b)}=${fr(a * b, a + b)}=${mx(a * b, a + b)}`)} ${u}s.`,
                        };
                    }
                    const [a, b, c] = rng.shuffle(rng.pick(TRIPLES)), { who: [A, B, D], job, u } = ctx(rng, 3);
                    const L = lcm3(a, b, c), t = a * b * c / (a * b + b * c + c * a);
                    return {
                        q: R`${A} can ${job} in ${pl(a, u)}, ${B} in ${pl(b, u)} and ${D} in ${pl(c, u)}. How long does the job take if all three work together?`,
                        ans: time(t, 1, u),
                        sol: R`Add the three efficiencies: ${m(R`${one(a)}+${one(b)}+${one(c)}=\frac{${L / a}+${L / b}+${L / c}}{${L}}=${fr(L / a + L / b + L / c, L)}`)} of the job per ${u}. So together they take ${pl(t, u)}.`,
                    };
                },
            },
            {
                id: 'find-other', name: 'Find one worker from the group', level: 2,
                gen(rng) {
                    if (rng.bool(0.35)) {
                        const [a, b, c] = rng.shuffle(rng.pick(TRIPLES)), { who: [A, B, D], job, u } = ctx(rng, 3);
                        const t = a * b * c / (a * b + b * c + c * a);
                        return {
                            q: R`Working together, ${A}, ${B} and ${D} can ${job} in ${pl(t, u)}. Alone, ${A} would take ${pl(a, u)} and ${B} would take ${pl(b, u)}. How long would ${D} take alone?`,
                            ans: time(c, 1, u),
                            sol: R`An individual's efficiency = group efficiency − efficiency of the others: ${m(R`${one(t)}-${one(a)}-${one(b)}=${fr(1, c)}`)} of the job per ${u}. So ${D} takes ${pl(c, u)} alone.`,
                        };
                    }
                    const [a, b] = rng.shuffle(rng.pick(PAIRS)), { who: [A, B], job, u } = ctx(rng);
                    const t = a * b / (a + b);
                    const q = rng.pick([
                        R`Working together, ${A} and ${B} can ${job} in ${pl(t, u)}. ${A} alone would take ${pl(a, u)}. How long would ${B} take alone?`,
                        R`${A} can ${job} in ${pl(a, u)}. With ${B} helping, the job takes only ${pl(t, u)}. How long would ${B} take to do the whole job alone?`,
                        R`${A} and ${B} together take ${pl(t, u)} to ${job}. If ${A} alone takes ${pl(a, u)}, how long does ${B} alone take?`,
                    ]);
                    return {
                        q, ans: time(b, 1, u),
                        sol: R`${B}'s efficiency = group efficiency − ${A}'s efficiency: ${m(R`${one(t)}-${one(a)}=\frac{${a - t}}{${a * t}}=${fr(a - t, a * t)}`)} of the job per ${u}. So ${B} takes ${pl(b, u)} alone.`,
                    };
                },
            },
            {
                id: 'start-then-join', name: 'One starts, the other joins', level: 2,
                gen(rng) {
                    const [a, b, k] = rng.pick(JOIN), { who: [A, B], job, u } = ctx(rng), total = rng.bool();
                    const x = (a - k) * b / (a + b);
                    return {
                        q: R`${A} can ${job} in ${pl(a, u)}; ${B} can do it in ${pl(b, u)}. ${A} starts alone and works for ${pl(k, u)}. Then ${B} joins and they finish the job together. ` +
                            (total ? R`How long does the whole job take from start to finish?` : R`For how long do they work together?`),
                        ans: time(total ? k + x : x, 1, u),
                        sol: R`${A} alone does ${m(R`${k}\times${one(a)}=${fr(k, a)}`)}, leaving ${m(fr(a - k, a))}. Together they do ${m(R`${one(a)}+${one(b)}=${fr(a + b, a * b)}`)} per ${u}, so the rest takes ${m(R`${fr(a - k, a)}\div${fr(a + b, a * b)}=${x}`)} ${u}${x === 1 ? '' : 's'}.` +
                            (total ? R` Total: ${m(R`${k}+${x}=${k + x}`)} ${u}s.` : ''),
                    };
                },
            },
            {
                id: 'one-leaves', name: 'One leaves part-way', level: 2,
                gen(rng) {
                    const [a, b, k] = rng.pick(LEAVE), { who: [A, B], job, u } = ctx(rng), total = rng.bool();
                    const y = b - k * (a + b) / a;
                    return {
                        q: R`${A} can ${job} in ${pl(a, u)}; ${B} can do it in ${pl(b, u)}. They start together, but after ${pl(k, u)} ${A} leaves and ${B} finishes the job alone. ` +
                            (total ? R`How long does the whole job take from start to finish?` : R`How long does ${B} work alone?`),
                        ans: time(total ? k + y : y, 1, u),
                        sol: R`Together for ${pl(k, u)}: ${m(R`${k}\times\left(${one(a)}+${one(b)}\right)=${fr(k * (a + b), a * b)}`)}. Left: ${m(fr(a * b - k * (a + b), a * b))}. ${B} needs ${m(R`${fr(a * b - k * (a + b), a * b)}\div${one(b)}=${y}`)} ${u}${y === 1 ? '' : 's'} alone.` +
                            (total ? R` Total: ${m(R`${k}+${y}=${k + y}`)} ${u}s.` : ''),
                    };
                },
            },
            {
                id: 'pipes', name: 'Inlet and outlet water', level: 2,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 1, 2, 2, 3, 3, 4, 5]);
                    const [thing, u] = rng.pick([['tank', 'hour'], ['swimming pool', 'hour'], ['water trough', 'minute'], ['bathtub', 'minute'], ['reservoir', 'day'], ['fish pond', 'hour'], ['rain barrel', 'minute']]);
                    if (form === 0) {               // case 3: one inlet, one outlet, filling
                        const [a, b] = rng.pick(FILLDRAIN), t = a * b / (b - a);
                        return {
                            q: R`An inlet pipe can fill an empty ${thing} in ${pl(a, u)}. An outlet pipe can empty the full ${thing} in ${pl(b, u)}. The ${thing} is empty and both pipes are opened. How long does it take to fill?`,
                            ans: time(t, 1, u),
                            sol: R`Overall inflow efficiency = inlet − outlet: ${m(R`${one(a)}-${one(b)}=\frac{${b - a}}{${a * b}}=${fr(b - a, a * b)}`)} of the ${thing} per ${u}. So it fills in ${pl(t, u)}.`,
                        };
                    }
                    if (form === 1 || form === 2) { // cases 1 and 2: two inlets, or two outlets
                        const inlet = form === 1, whole = rng.bool(0.5);
                        const [a, b] = rng.shuffle(rng.pick(whole ? PAIRS.filter(([x, y]) => y <= 40) : FRACPAIRS));
                        return {
                            q: (inlet ? R`Inlet pipe A can fill an empty ${thing} in ${pl(a, u)}. Inlet pipe B can fill it in ${pl(b, u)}. The ${thing} is empty and both inlet pipes are opened. How long does it take to fill?`
                                : R`Outlet pipe A can empty a full ${thing} in ${pl(a, u)}. Outlet pipe B can empty it in ${pl(b, u)}. The ${thing} is full and both outlet pipes are opened. How long does it take to empty?`) +
                                (whole ? '' : ' Give your answer as a mixed number or a fraction.'),
                            ans: time(a * b, a + b, u),
                            sol: R`Two ${inlet ? 'inlet' : 'outlet'} pipes: add the efficiencies. Total ${inlet ? 'inflow' : 'outflow'} efficiency: ${m(R`${one(a)}+${one(b)}=${fr(a + b, a * b)}`)} of the ${thing} per ${u}. Time: ${m(R`1\div${fr(a + b, a * b)}=${mx(a * b, a + b)}`)} ${u}s.`,
                        };
                    }
                    if (form === 3) {               // case 3: one inlet, one outlet, emptying
                        const [b, a] = rng.pick(FILLDRAIN), t = a * b / (a - b);      // the outlet (b) is faster than the inlet (a)
                        return {
                            q: R`An inlet pipe can fill an empty ${thing} in ${pl(a, u)}. An outlet pipe can empty the full ${thing} in ${pl(b, u)}. The ${thing} is full, and both pipes are opened. How long does it take to empty?`,
                            ans: time(t, 1, u),
                            sol: R`The outlet is faster, so the ${thing} empties. Overall outflow efficiency = outlet − inlet: ${m(R`${one(b)}-${one(a)}=\frac{${a - b}}{${a * b}}=${fr(a - b, a * b)}`)} of the ${thing} per ${u}. It is empty after ${pl(t, u)}.`,
                        };
                    }
                    if (form === 4) {               // a leak
                        const [a, b] = rng.pick(FILLDRAIN), t = a * b / (b - a);
                        return {
                            q: R`An inlet pipe normally fills a ${thing} in ${pl(a, u)}. Because of a leak, it takes ${pl(t, u)} instead. If the inlet pipe were turned off, how long would the leak take to empty the full ${thing}?`,
                            ans: time(b, 1, u),
                            sol: R`The leak is an outlet. Inlet − leak = overall inflow, so the leak's efficiency is ${m(R`${one(a)}-${one(t)}=\frac{${t - a}}{${a * t}}=${fr(t - a, a * t)}`)} of the ${thing} per ${u}. The leak alone empties it in ${pl(b, u)}.`,
                        };
                    }
                    const [a, b, c] = rng.pick(PIPE3), d = b * c + a * c - a * b, t = a * b * c / d, L = lcm3(a, b, c);
                    return {
                        q: R`Inlet pipe A fills a ${thing} in ${pl(a, u)} and inlet pipe B fills it in ${pl(b, u)}. An outlet pipe empties the full ${thing} in ${pl(c, u)}. Starting with the ${thing} empty, all three pipes are opened. How long does the ${thing} take to fill?`,
                        ans: time(t, 1, u),
                        sol: R`Add the inlets and subtract the outlet: ${m(R`${one(a)}+${one(b)}-${one(c)}=\frac{${L / a}+${L / b}-${L / c}}{${L}}=${fr(d, a * b * c)}`)} of the ${thing} per ${u}. So it fills in ${pl(t, u)}.`,
                    };
                },
            },
            {
                id: 'efficiency-ratio', name: 'Efficiency ratios', level: 2,
                gen(rng) {
                    const { who: [A, B], job, u } = ctx(rng), form = rng.int(0, 3);
                    const times = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times' };
                    if (form === 0) {               // A is k times as fast; together t
                        const k = rng.int(2, 5), t = k * rng.int(1, 6), wantA = rng.bool();
                        return {
                            q: R`${A} works ${times[k]} as fast as ${B}. Together they can ${job} in ${pl(t, u)}. How long would ${wantA ? A : B} take alone?`,
                            ans: time(wantA ? (k + 1) * t / k : (k + 1) * t, 1, u),
                            sol: R`Let ${B} do 1 unit per ${u}; then ${A} does ${k}. Together: ${k + 1} units per ${u}, so the job is ${m(R`${k + 1}\times${t}=${(k + 1) * t}`)} units. ` +
                                (wantA ? R`${A} alone: ${m(R`${(k + 1) * t}\div${k}=${(k + 1) * t / k}`)} ${u}s.` : R`${B} alone: ${m(R`${(k + 1) * t}\div1=${(k + 1) * t}`)} ${u}s.`),
                        };
                    }
                    if (form === 1) {               // efficiencies p : q; together t
                        const [p, q] = rng.pick([[3, 2], [4, 3], [5, 3], [5, 2], [5, 4], [4, 1], [3, 1], [7, 3]]), t = p * q * rng.int(1, 3), wantA = rng.bool();
                        return {
                            q: R`The efficiencies of ${A} and ${B} are in the ratio ${m(R`${p}:${q}`)}. Working together they can ${job} in ${pl(t, u)}. How long would ${wantA ? A : B} take alone?`,
                            ans: time(wantA ? (p + q) * t / p : (p + q) * t / q, 1, u),
                            sol: R`Let ${A} do ${p} units per ${u} and ${B} do ${q}. The job is ${m(R`(${p}+${q})\times${t}=${(p + q) * t}`)} units. ${wantA ? A : B} alone: ${m(R`${(p + q) * t}\div${wantA ? p : q}=${(p + q) * t / (wantA ? p : q)}`)} ${u}s.`,
                        };
                    }
                    if (form === 2) {               // A alone a; B is k times as fast
                        const k = rng.int(2, 4), a = (k + 1) * rng.int(2, 8);
                        return {
                            q: R`${A} can ${job} in ${pl(a, u)}. ${B} works ${times[k]} as fast as ${A}. How long do they take working together?`,
                            ans: time(a / (k + 1), 1, u),
                            sol: R`${A}'s efficiency is ${m(one(a))} and ${B}'s is ${m(R`\frac{${k}}{${a}}`)}. Together: ${m(R`\frac{${k + 1}}{${a}}=${fr(k + 1, a)}`)} per ${u}, so the job takes ${pl(a / (k + 1), u)}.`,
                        };
                    }
                    // A is x% more efficient than B
                    const [pc, p, q] = rng.pick([[50, 3, 2], [25, 5, 4], [100, 2, 1], [20, 6, 5], [60, 8, 5]]), b = p * rng.int(2, 8);
                    return {
                        q: R`${B} can ${job} in ${pl(b, u)}. ${A} is ${pc}% more efficient than ${B} (does ${pc}% more work in the same time). How long would ${A} take to do the job alone?`,
                        ans: time(b * q / p, 1, u),
                        sol: R`${pc}% more efficient means the efficiencies are in the ratio ${m(R`${100 + pc}:100=${p}:${q}`)}, so the times are in the ratio ${m(R`${q}:${p}`)}. ${A} takes ${m(R`${b}\times${fr(q, p)}=${b * q / p}`)} ${u}s.`,
                    };
                },
            },
            {
                id: 'part-then-finish', name: 'Part done, then finished', level: 2,
                gen(rng) {
                    const { who: [A, B], job, u } = ctx(rng), form = rng.int(0, 1);
                    if (form === 0) {               // A does k/a, B finishes the rest in j: B alone?
                        let a, k, j, b;
                        do { a = rng.int(5, 30); k = rng.int(1, a - 1); j = rng.int(2, 20); b = j * a / (a - k); } while (!Number.isInteger(b) || b === a || b > 60);
                        return {
                            q: R`${A} can ${job} in ${pl(a, u)}. ${A} works alone for ${pl(k, u)} and then stops. ${B} takes over and finishes the rest of the job alone in ${pl(j, u)}. How long would ${B} take to do the whole job alone?`,
                            ans: time(b, 1, u),
                            sol: R`${A} does ${m(R`${fr(k, a)}`)} of the job, so ${B} does ${m(fr(a - k, a))} in ${pl(j, u)}. Whole job for ${B}: ${m(R`${j}\div${fr(a - k, a)}=${b}`)} ${u}s.`,
                        };
                    }
                    // A does p/q in k, B does the rest in j: how long together from the start?
                    let a, b, p, q;
                    do { [a, b] = rng.shuffle(rng.pick(PAIRS)); q = rng.int(2, 6); p = rng.int(1, q - 1); } while (CA.gcd(p, q) !== 1 || (a * p) % q || (b * (q - p)) % q || a > 40 || b > 40);
                    const k = a * p / q, j = b * (q - p) / q, t = a * b / (a + b);
                    return {
                        q: R`${A} did ${m(R`\frac{${p}}{${q}}`)} of a job in ${pl(k, u)}. Then ${B} did the rest of the job alone in ${pl(j, u)}. How long would the job have taken if they had worked together from the start?`,
                        ans: time(t, 1, u),
                        sol: R`${A} alone: ${m(R`${k}\div\frac{${p}}{${q}}=${a}`)} ${u}s. ${B} alone: ${m(R`${j}\div${fr(q - p, q)}=${b}`)} ${u}s. Together: ${m(R`${one(a)}+${one(b)}=${fr(a + b, a * b)}`)} per ${u}, so ${pl(t, u)}.`,
                    };
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'pairs-to-all', name: 'Pairs of workers', level: 3,
                gen(rng) {
                    let r, L;
                    for (;;) {
                        r = rng.sample([1, 2, 3, 4, 5, 6, 7], 3);
                        const s = [r[0] + r[1], r[1] + r[2], r[0] + r[2]];
                        L = lcm3(...s) * rng.pick([1, 1, 2]);
                        if (L / Math.min(...s) <= 60 && L / Math.max(...s) >= 3) break;
                    }
                    const { who: [A, B, D], job, u } = ctx(rng, 3);
                    const [x, y, z] = [L / (r[0] + r[1]), L / (r[1] + r[2]), L / (r[0] + r[2])], S = r[0] + r[1] + r[2];
                    const form = rng.pick([0, 0, 1]);
                    const given = R`${A} and ${B} together can ${job} in ${pl(x, u)}. ${B} and ${D} together would take ${pl(y, u)}, and ${A} and ${D} together would take ${pl(z, u)}.`;
                    const all = R`Add the three pair-efficiencies: ${m(R`${one(x)}+${one(y)}+${one(z)}=${fr(2 * S, L)}`)}. Everyone is counted twice, so all three together do ${m(R`${fr(2 * S, L)}\div2=${fr(S, L)}`)} per ${u}`;
                    if (form === 0) return {
                        q: R`${given} How long would the job take if all three worked together? Give a mixed number or fraction if the answer is not whole.`,
                        ans: time(L, S, u),
                        sol: R`${all} and take ${m(mx(L, S))} ${u}s.`,
                    };
                    return {
                        q: R`${given} How long would ${D} take to do the job alone? Give a mixed number or fraction if the answer is not whole.`,
                        ans: time(L, r[2], u),
                        sol: R`${all}. Take away the efficiency of ${A} and ${B} together: ${m(R`${fr(S, L)}-${one(x)}=${fr(r[2], L)}`)}. So ${D} alone takes ${m(mx(L, r[2]))} ${u}s.`,
                    };
                },
            },
            {
                id: 'alternate-days', name: 'Taking turns', level: 3,
                gen(rng) {
                    const [a, b] = rng.pick(ALT), { who: [A, B], job, u } = ctx(rng, 2, 0);
                    const n = Math.floor(a * b / (a + b)), rem = a * b - n * (a + b);     // in units of 1/(ab) of the job
                    let num, den, tail;
                    const start = n === 1 ? R`After 1 cycle (2 ${u}s)` : R`After ${n} cycles (${2 * n} ${u}s)`;
                    const cyc = R`One cycle of 2 ${u}s does ${m(R`${one(a)}+${one(b)}=${fr(a + b, a * b)}`)} of the job.`;
                    if (rem === 0) {
                        num = 2 * n; den = 1;
                        tail = R`${start} the job is exactly finished: ${m(R`${n}\times${fr(a + b, a * b)}=1`)}.`;
                    } else if (rem <= b) {
                        num = 2 * n * b + rem; den = b;
                        tail = R`${start}, ${m(R`${n}\times${fr(a + b, a * b)}=${fr(n * (a + b), a * b)}`)} is done and ${m(fr(rem, a * b))} is left. ${A} is next and needs ${m(R`${fr(rem, a * b)}\div${one(a)}=${fr(rem, b)}`)} of a ${u}. Total: ${m(R`${2 * n}+${fr(rem, b)}=${mx(num, den)}`)} ${u}s.`;
                    } else {
                        num = (2 * n + 1) * a + (rem - b); den = a;
                        tail = R`${start}, ${m(R`${n}\times${fr(a + b, a * b)}=${fr(n * (a + b), a * b)}`)} is done and ${m(fr(rem, a * b))} is left. ${A} works a full ${u}, leaving ${m(R`${fr(rem, a * b)}-${one(a)}=${fr(rem - b, a * b)}`)}. Then ${B} needs ${m(R`${fr(rem - b, a * b)}\div${one(b)}=${fr(rem - b, a)}`)} of a ${u}. Total: ${m(R`${2 * n}+1+${fr(rem - b, a)}=${mx(num, den)}`)} ${u}s.`;
                    }
                    return {
                        q: R`Working alone, ${A} could ${job} in ${pl(a, u)} and ${B} could do it in ${pl(b, u)}. They take turns: ${A} works for the first ${u}, ${B} for the second, ${A} for the third, and so on, until the job is done. How long does the job take from start to finish? (The last turn may be only part of ${u === 'hour' ? 'an' : 'a'} ${u}. Give a mixed number or fraction if the answer is not whole.)`,
                        ans: time(num, den, u),
                        sol: R`${cyc} ${tail}`,
                    };
                },
            },
            {
                id: 'three-stage', name: 'Jobs in three stages', level: 3,
                gen(rng) {
                    if (rng.bool(0.6)) {
                        const [a, b, k1, k2] = rng.pick(STAGE), { who: [A, B], job, u } = ctx(rng), total = rng.bool();
                        const y = b - b * (k1 + k2) / a - k2;
                        return {
                            q: R`${A} can ${job} in ${pl(a, u)}; ${B} can do it in ${pl(b, u)}. ${A} works alone for ${pl(k1, u)}. Then ${B} joins and they work together for ${pl(k2, u)}. Then ${A} leaves and ${B} finishes the job alone. ` +
                                (total ? R`How long does the whole job take from start to finish?` : R`How long does ${B} work alone at the end?`),
                            ans: time(total ? k1 + k2 + y : y, 1, u),
                            sol: R`${A} works ${m(R`${k1}+${k2}=${k1 + k2}`)} ${u}s in all and does ${m(fr(k1 + k2, a))} of the job. ${B} must do the other ${m(fr(a - k1 - k2, a))}, which takes ${m(R`${fr(a - k1 - k2, a)}\times${b}=${k2 + y}`)} ${u}s. Of these, ${k2} ${k2 === 1 ? 'was' : 'were'} with ${A}, so ${B} works ${m(R`${k2 + y}-${k2}=${y}`)} ${u}${y === 1 ? '' : 's'} alone.` +
                                (total ? R` Total: ${m(R`${k1}+${k2}+${y}=${k1 + k2 + y}`)} ${u}s.` : ''),
                        };
                    }
                    const [a, b, c, k1, k2] = rng.pick(STAGE3), { who: [A, B, D], job, u } = ctx(rng, 3);
                    const Tt = c * (a * b - k1 * b - (k1 + k2) * a) / (a * b);
                    return {
                        q: R`Working alone, ${A} could ${job} in ${pl(a, u)}, ${B} in ${pl(b, u)} and ${D} in ${pl(c, u)}. All three start the job together. After ${pl(k1, u)} ${A} leaves. After ${pl(k2, u)} more, ${B} leaves too, and ${D} finishes the job alone. How long does the whole job take from start to finish?`,
                        ans: time(Tt, 1, u),
                        sol: R`Count each one's own time. ${A} works ${pl(k1, u)}: ${m(fr(k1, a))} of the job. ${B} works ${m(R`${k1}+${k2}=${k1 + k2}`)} ${u}s: ${m(fr(k1 + k2, b))}. ${D} must do ${m(R`1-${fr(k1, a)}-${fr(k1 + k2, b)}=${fr(a * b - k1 * b - (k1 + k2) * a, a * b)}`)}, which takes ${m(R`${fr(a * b - k1 * b - (k1 + k2) * a, a * b)}\times${c}=${Tt}`)} ${u}s — and ${D} works the whole time.`,
                    };
                },
            },
            {
                id: 'share-pay', name: 'Sharing the pay', level: 3,
                gen(rng) {
                    let a, b, t, D;
                    for (;;) {
                        [a, b] = rng.sample([6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30], 2); t = rng.int(2, 8);
                        if (t * (a + b) >= a * b) continue;
                        D = CA.lcm(a / CA.gcd(t, a), b / CA.gcd(t, b));
                        if (D <= 60) break;
                    }
                    const { who: [A, B, H], job, u } = ctx(rng, 3, 0);
                    const P = D * rng.pick([10, 20, 30, 40, 50, 60].filter(x => D * x >= 100 && D * x <= 1500).concat(D >= 30 ? [20] : [])) ;
                    const pa = P * t / a, pb = P * t / b, pc = P - pa - pb;
                    const cNum = a * b - t * (a + b);       // helper's share = cNum / ab
                    const cTime = CA.reduce(t * a * b, cNum);
                    const form = cTime[1] === 1 && rng.bool(0.4) ? 3 : rng.int(0, 2);
                    const given = R`${A} could ${job} alone in ${pl(a, u)}, and ${B} could do it alone in ${pl(b, u)}. With ${H} helping, the three of them finish the job in ${pl(t, u)}.`;
                    const shares = R`In ${pl(t, u)} ${A} does ${m(fr(t, a))} of the job and ${B} does ${m(fr(t, b))}, so ${H} does ${m(R`1-${fr(t, a)}-${fr(t, b)}=${fr(cNum, a * b)}`)}.`;
                    if (form === 3) return {
                        q: R`${given} How long would ${H} take to do the whole job alone?`,
                        ans: time(cTime[0], 1, u),
                        sol: R`${shares} ${H}'s efficiency is ${m(R`${fr(cNum, a * b)}\div${t}=${fr(cNum, a * b * t)}`)} per ${u}, so ${H} alone takes ${pl(cTime[0], u)}.`,
                    };
                    const [name, pay, f] = [[A, pa, fr(t, a)], [B, pb, fr(t, b)], [H, pc, fr(cNum, a * b)]][form];
                    return {
                        q: R`${given} They are paid $${P} for the job and share it in proportion to the work each one did. How much does ${name} get?`,
                        ans: CA.num(pay, '$'),
                        sol: R`${shares} ${name}'s share: ${m(R`${f}\times${P}=${pay}`)} dollars.`,
                    };
                },
            },
        ],

        assignment: [
            ['rate-from-work', 4], ['scatter-efficiency', 4], ['job-fractions', 3], ['together-two', 4],
            ['together-harder', 4], ['find-other', 4], ['pipes', 6], ['start-then-join', 2], ['one-leaves', 2], ['efficiency-ratio', 3], ['part-then-finish', 2],
            ['pairs-to-all', 3], ['alternate-days', 3], ['three-stage', 3], ['share-pay', 3],
        ],
    });
})();
