/* Worksheet: Statistics — mean, median, mode, range, and reading bar charts, dot plots, line graphs and pie charts. */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, C = F.colors;

    // ── Statistics ───────────────────────────────────────────────────────
    const sum = a => a.reduce((s, x) => s + x, 0);
    const mean = a => sum(a) / a.length;
    const sorted = a => a.slice().sort((x, y) => x - y);
    const median = a => { const s = sorted(a), n = s.length, k = Math.floor(n / 2); return n % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
    const counts = a => { const c = new Map(); a.forEach(x => c.set(x, (c.get(x) || 0) + 1)); return c; };
    /** The modes of a list (empty when every value appears once). */
    const modes = a => { const c = counts(a), mx = Math.max(...c.values()); return mx === 1 ? [] : [...c.keys()].filter(k => c.get(k) === mx).sort((x, y) => x - y); };
    const range = a => Math.max(...a) - Math.min(...a);
    const list = a => a.join(', ');
    const num = x => CA.tex.num(x);
    /** n whole numbers in [lo, hi] whose sum is exactly n × m. */
    function withMean(rng, n, m, lo, hi) {
        for (;;) {
            const a = Array.from({ length: n - 1 }, () => rng.int(lo, hi));
            const last = n * m - sum(a);
            if (last >= lo && last <= hi) return rng.shuffle(a.concat([last]));
        }
    }

    // ── Charts ───────────────────────────────────────────────────────────
    const PAL = ['#9fb4f5', '#f4b6a6', '#a5d9c3', '#f3d58a', '#cdb4ef', '#b6d6ef'];
    function axes(W, H, x0, y0, top, maxV, step) {
        let g = '';
        for (let v = 0; v <= maxV + 1e-9; v += step) {
            const y = y0 - (v / maxV) * (y0 - top);
            g += F.line(x0, y, W - 8, y, { stroke: v ? '#d5dbe8' : C.INK, width: v ? 0.8 : 1.2 });
            if (maxV / step <= 8 || Math.round(v / step) % 2 === 0) g += F.text(x0 - 5, y + 4, String(v), { anchor: 'end', size: 11 });
        }
        return g + F.line(x0, y0, x0, top - 4, { width: 1.2 });
    }
    /** Vertical bar chart. Values should be multiples of step/2 so they can be read from the grid. */
    function barChart(labels, values, step, yName = '') {
        const W = 290, H = 178, x0 = 34, y0 = H - 24, top = yName ? 22 : 10;
        const maxV = Math.ceil(Math.max(...values) / step) * step + (Math.max(...values) % step === 0 ? step : 0);
        const slot = (W - 8 - x0) / labels.length, bw = slot * 0.58;
        let g = axes(W, H, x0, y0, top, maxV, step);
        values.forEach((v, i) => {
            const x = x0 + slot * i + (slot - bw) / 2, h = (v / maxV) * (y0 - top);
            g += F.rect(x, y0 - h, bw, h, { fill: PAL[i % PAL.length], width: 1 });
            g += F.text(x + bw / 2, y0 + 15, labels[i], { size: 11 });
        });
        if (yName) g += F.text(x0 - 30, 12, yName, { anchor: 'start', size: 11, italic: true });
        return F.svg(W, H, g, { label: 'bar chart' });
    }
    function lineGraph(labels, values, step, yName = '') {
        const W = 290, H = 178, x0 = 34, y0 = H - 24, top = yName ? 22 : 10;
        const maxV = Math.ceil(Math.max(...values) / step) * step + (Math.max(...values) % step === 0 ? step : 0);
        const slot = (W - 8 - x0) / labels.length;
        const P = values.map((v, i) => [x0 + slot * (i + 0.5), y0 - (v / maxV) * (y0 - top)]);
        let g = axes(W, H, x0, y0, top, maxV, step) + F.poly(P, { open: true, stroke: C.DARK, width: 2 });
        P.forEach(([x, y], i) => { g += F.dot(x, y, { r: 3.5, fill: C.DARK }) + F.text(x, y0 + 15, labels[i], { size: 11 }); });
        if (yName) g += F.text(x0 - 30, 12, yName, { anchor: 'start', size: 11, italic: true });
        return F.svg(W, H, g, { label: 'line graph' });
    }
    function dotPlot(values, lo, hi, name = '') {
        const c = counts(values), mx = Math.max(...c.values());
        const W = 290, x0 = 18, sx = (W - 2 * x0) / (hi - lo), H = 46 + mx * 12 + (name ? 16 : 0), y0 = H - 30 - (name ? 16 : 0);
        let g = F.line(x0 - 6, y0, W - x0 + 6, y0, { width: 1.2 });
        for (let v = lo; v <= hi; v++) g += F.line(x0 + (v - lo) * sx, y0 - 4, x0 + (v - lo) * sx, y0 + 4, { width: 1 }) + F.text(x0 + (v - lo) * sx, y0 + 17, String(v), { size: 11 });
        for (const [v, k] of c) for (let i = 0; i < k; i++) g += F.circle(x0 + (v - lo) * sx, y0 - 10 - i * 12, 4.5, { fill: C.DARK, stroke: C.INK, width: 1 });
        if (name) g += F.text(W / 2, H - 6, name, { size: 11, italic: true });
        return F.svg(W, H, g, { label: 'dot plot' });
    }
    /** Pie chart; parts are percentages (adding to 100). A label of null hides that slice's percentage. */
    function pieChart(labels, parts, shown) {
        const W = 290, H = 170, cx = 145, cy = 85, r = 66;
        let g = '', a0 = 90;
        parts.forEach((p, i) => {
            const a1 = a0 - p * 3.6;                                     // clockwise from 12 o'clock
            g += F.sector(cx, cy, r, a1, a0, { fill: PAL[i % PAL.length], stroke: C.INK, width: 1 });
            const mid = (a0 + a1) / 2, [lx, ly] = F.polar(cx, cy, r * 0.62, mid), [ox, oy] = F.polar(cx, cy, r + 8, mid);
            g += F.text(lx, ly + 4, shown[i], { size: 11, bold: true, ...(shown[i] === '?' ? { fill: C.ACCENT } : {}) });
            const cs = Math.cos(mid * Math.PI / 180);
            g += F.text(ox + (cs > 0.2 ? 2 : cs < -0.2 ? -2 : 0), oy + 4 + (Math.sin(mid * Math.PI / 180) < -0.5 ? 6 : 0), labels[i], { size: 11, anchor: cs > 0.2 ? 'start' : cs < -0.2 ? 'end' : 'middle' });
            a0 = a1;
        });
        return F.svg(W, H, g, { label: 'pie chart' });
    }

    // ── Contexts ─────────────────────────────────────────────────────────
    const CTX = [
        { what: 'test scores', unit: '', lo: 55, hi: 100 },
        { what: 'goals scored in each match', unit: '', lo: 0, hi: 7 },
        { what: 'daily high temperatures (°C)', unit: '°C', lo: 12, hi: 34 },
        { what: 'ages of the children at a party', unit: '', lo: 6, hi: 14 },
        { what: 'heights of some plants (cm)', unit: 'cm', lo: 10, hi: 45 },
        { what: 'numbers of pages read each day', unit: '', lo: 8, hi: 40 },
        { what: 'prices of some books ($)', unit: '$', lo: 4, hi: 20 },
        { what: 'numbers of push-ups done', unit: '', lo: 10, hi: 35 },
    ];
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const BARS = [
        { cats: ['Apple', 'Banana', 'Cherry', 'Grape', 'Kiwi'], q: 'The bar chart shows the favourite fruit of some pupils.', noun: 'pupils', y: 'pupils', ask: c => `How many pupils chose ${c}?` },
        { cats: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'], q: 'The bar chart shows the favourite colour of some children.', noun: 'children', y: 'children', ask: c => `How many children chose ${c}?` },
        { cats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], q: 'The bar chart shows how many books a library lent each day.', noun: 'books', y: 'books', ask: c => `How many books were lent on ${c}?` },
        { cats: ['Dog', 'Cat', 'Fish', 'Bird', 'None'], q: 'The bar chart shows the main pet of each pupil in a year group.', noun: 'pupils', y: 'pupils', ask: c => (c === 'None' ? 'How many pupils have no pet?' : `How many pupils have a ${c.toLowerCase()}?`) },
        { cats: ['Bus', 'Car', 'Walk', 'Bike'], q: 'The bar chart shows how some pupils travel to school.', noun: 'pupils', y: 'pupils', ask: c => (c === 'Walk' ? 'How many pupils walk?' : `How many pupils come by ${c.toLowerCase()}?`) },
    ];
    const LINES = [
        { cats: DAYS, q: 'The line graph shows the noon temperature (°C) each day.', unit: '°C', noun: 'temperature' },
        { cats: MONTHS, q: 'The line graph shows how many centimetres of rain fell each month.', unit: 'cm', noun: 'rainfall' },
        { cats: DAYS, q: 'The line graph shows how many visitors a museum had each day (in hundreds).', unit: 'hundred', noun: 'visitors' },
        { cats: MONTHS, q: 'The line graph shows how many bikes a shop sold each month.', unit: '', noun: 'bikes sold' },
    ];
    const cap = s => s[0].toUpperCase() + s.slice(1);

    CA.register({
        id: 'statistics',
        title: 'Statistics',
        page: 'statistics.html',
        assignmentNote: 'Mean = sum ÷ count. Median = the middle value once the data are sorted (average the two middle values if there is an even number). Mode = the most common value. Range = largest − smallest. Read chart scales carefully.',

        practice: [
            {
                id: 'mean', name: 'Find the mean', level: 1,
                gen(rng) {
                    const c = rng.pick(CTX), n = rng.int(4, 7), m = rng.int(c.lo + 2, c.hi - 2);
                    const a = withMean(rng, n, m, c.lo, c.hi);
                    return {
                        q: `Find the mean of these ${c.what}: ${list(a)}.`, ans: CA.num(m, c.unit),
                        sol: R`Sum \(= ${sum(a)}\), count \(= ${n}\). Mean \(= ${sum(a)} \div ${n} = ${m}\).`,
                    };
                },
            },
            {
                id: 'median', name: 'Find the median', level: 1,
                gen(rng) {
                    const c = rng.pick(CTX), n = rng.int(5, 8);
                    const a = Array.from({ length: n }, () => rng.int(c.lo, c.hi)), s = sorted(a), md = median(a);
                    const k = Math.floor(n / 2);
                    return {
                        q: `Find the median of these ${c.what}: ${list(a)}.`, ans: CA.num(md, c.unit),
                        sol: n % 2 ? R`Sorted: ${list(s)}. The middle (${k + 1}th) value is ${md}.` : R`Sorted: ${list(s)}. The two middle values are ${s[k - 1]} and ${s[k]}, so the median is \((${s[k - 1]} + ${s[k]}) \div 2 = ${num(md)}\).`,
                    };
                },
            },
            {
                id: 'mode-range', name: 'Mode and range', level: 1,
                gen(rng) {
                    const c = rng.pick(CTX), n = rng.int(6, 9);
                    if (rng.bool()) {
                        for (;;) {
                            const a = Array.from({ length: n }, () => rng.int(c.lo, c.hi));
                            const md = modes(a);
                            if (md.length !== 1) continue;
                            return { q: `Find the mode of these ${c.what}: ${list(a)}.`, ans: CA.num(md[0], c.unit), sol: `${md[0]} appears ${counts(a).get(md[0])} times, more than any other value.` };
                        }
                    }
                    const a = Array.from({ length: n }, () => rng.int(c.lo, c.hi));
                    return { q: `Find the range of these ${c.what}: ${list(a)}.`, ans: CA.num(range(a), c.unit), sol: R`Largest \(-\) smallest \(= ${Math.max(...a)} - ${Math.min(...a)} = ${range(a)}\).` };
                },
            },
            {
                id: 'read-bar', name: 'Read a bar chart', level: 1,
                gen(rng) {
                    const B = rng.pick(BARS), step = rng.pick([2, 5]), vals = B.cats.map(() => step * rng.int(1, step === 2 ? 9 : 6));
                    if (new Set(vals).size < vals.length - 1) return this.gen(rng);
                    const fig = barChart(B.cats, vals, step, B.y), i = rng.int(0, B.cats.length - 1);
                    const kind = rng.int(0, 2);
                    if (kind === 0) return { q: `${B.q} ${B.ask(B.cats[i])}`, fig, ans: CA.num(vals[i]), sol: `The ${B.cats[i]} bar reaches ${vals[i]} on the scale (each gridline is ${step}).` };
                    const top = vals.indexOf(Math.max(...vals));
                    if (kind === 1 && vals.filter(v => v === vals[top]).length === 1) return { q: `${B.q} What value does the tallest bar show?`, fig, ans: CA.num(vals[top]), sol: `The tallest bar is ${B.cats[top]}, at ${vals[top]}.` };
                    let j; do j = rng.int(0, B.cats.length - 1); while (j === i || vals[j] === vals[i]);
                    const [hi, lo] = vals[i] > vals[j] ? [i, j] : [j, i];
                    return { q: `${B.q} How many more ${B.noun} does the ${B.cats[hi]} bar show than the ${B.cats[lo]} bar?`, fig, ans: CA.num(vals[hi] - vals[lo]), sol: R`\(${vals[hi]} - ${vals[lo]} = ${vals[hi] - vals[lo]}\).` };
                },
            },
            {
                id: 'mean-decimal', name: 'Mean and median with decimals', level: 2,
                gen(rng) {
                    for (;;) {
                        const c = rng.pick(CTX), n = rng.pick([4, 5, 8, 10]);
                        const a = Array.from({ length: n }, () => rng.int(c.lo, c.hi)), mu = mean(a);
                        if (Number.isInteger(mu)) continue;
                        const u = c.unit;
                        if (rng.bool(0.3)) {
                            const md = median(a), diff = Math.abs(mu - md);
                            return { q: `For these ${c.what}: ${list(a)}, what is the difference between the mean and the median?`, ans: CA.num(CA.round(diff, 4), u), sol: R`Mean \(= ${sum(a)} \div ${n} = ${num(mu)}\). Sorted: ${list(sorted(a))}, so the median is ${num(md)}. Difference \(= ${num(CA.round(diff, 4))}\).` };
                        }
                        return { q: `Find the mean of these ${c.what}: ${list(a)}.`, ans: CA.num(mu, u), sol: R`Sum \(= ${sum(a)}\), count \(= ${n}\). Mean \(= ${sum(a)} \div ${n} = ${num(mu)}\).` };
                    }
                },
            },
            {
                id: 'bar-questions', name: 'Questions about a bar chart', level: 2,
                gen(rng) {
                    const B = rng.pick(BARS), step = rng.pick([2, 5, 10]), vals = B.cats.map(() => step * rng.int(1, step === 2 ? 9 : 6));
                    const fig = barChart(B.cats, vals, step, B.y), kind = rng.int(0, 3), tot = sum(vals);
                    if (kind === 0) return { q: `${B.q} How many ${B.noun} are shown altogether?`, fig, ans: CA.num(tot), sol: R`Add the bars: \(${vals.join(' + ')} = ${tot}\).` };
                    if (kind === 1) {
                        if (tot % vals.length) return this.gen(rng);
                        return { q: `${B.q} What is the mean number of ${B.noun} per bar?`, fig, ans: CA.num(tot / vals.length), sol: R`Total \(= ${tot}\), and there are ${vals.length} bars: \(${tot} \div ${vals.length} = ${tot / vals.length}\).` };
                    }
                    if (kind === 2) {
                        const i = rng.int(0, vals.length - 1), pct = 100 * vals[i] / tot;
                        if (!Number.isInteger(pct)) return this.gen(rng);
                        return { q: `${B.q} What percentage of all the ${B.noun} are for ${B.cats[i]}?`, fig, ans: CA.num(pct, '%'), sol: R`\(${vals[i]} \div ${tot} \times 100 = ${pct}\%\).` };
                    }
                    return { q: `${B.q} What is the range of the values shown?`, fig, ans: CA.num(range(vals)), sol: R`Tallest \(-\) shortest \(= ${Math.max(...vals)} - ${Math.min(...vals)} = ${range(vals)}\).` };
                },
            },
            {
                id: 'dot-plot', name: 'Dot plots', level: 2,
                gen(rng) {
                    const [what, name, lo, one] = rng.pick([['goals scored by a team in each match', 'goals per match', 0, 'match'], ['number of pets owned by each pupil', 'pets per pupil', 0, 'pupil'], ['number of siblings each child has', 'siblings', 0, 'child'], ['shoe sizes of a group of children', 'shoe size', 3, 'child'], ['number of books each pupil read last month', 'books read', 1, 'pupil'], ['scores (out of 10) on a quiz', 'quiz score', 2, 'pupil']]);
                    const hi = lo + rng.int(6, 8), n = rng.int(10, 16);
                    const a = Array.from({ length: n }, () => Math.min(hi, lo + Math.floor(rng.next() * rng.next() * (hi - lo + 2))));
                    const c = counts(a);
                    if (Math.max(...c.values()) > 7) return this.gen(rng);
                    const fig = dotPlot(a, lo, hi, name), kind = rng.pick(['mode', 'median', 'range', 'count', 'atleast']);
                    const intro = `The dot plot shows the ${what}. Each dot is one ${one}.`;
                    if (kind === 'mode') { const md = modes(a); if (md.length !== 1) return this.gen(rng); return { q: `${intro} What is the mode?`, fig, ans: CA.num(md[0]), sol: `The tallest column of dots is at ${md[0]}.` }; }
                    if (kind === 'median') { const md = median(a); return { q: `${intro} What is the median?`, fig, ans: CA.num(md), sol: R`There are ${n} dots. ${n % 2 ? `The middle one is the ${(n + 1) / 2}th` : `The middle two are the ${n / 2}th and ${n / 2 + 1}th`}, counting from the left: median \(= ${num(md)}\).` }; }
                    if (kind === 'range') return { q: `${intro} What is the range?`, fig, ans: CA.num(range(a)), sol: R`\(${Math.max(...a)} - ${Math.min(...a)} = ${range(a)}\).` };
                    if (kind === 'count') return { q: `${intro} How many dots are there in total?`, fig, ans: CA.num(n), sol: `Count every dot: ${[...c.entries()].sort((x, y) => x[0] - y[0]).map(([, k]) => k).join(' + ')} = ${n}.` };
                    const t = rng.int(lo + 2, hi - 1), k = a.filter(x => x >= t).length;
                    return { q: `${intro} How many have a value of ${t} or more?`, fig, ans: CA.num(k), sol: `Count the dots at ${t} and above: ${k}.` };
                },
            },
            {
                id: 'line-graph', name: 'Line graphs', level: 2,
                gen(rng) {
                    const Lg = rng.pick(LINES), step = rng.pick([2, 5]), vals = Lg.cats.map(() => step * rng.int(1, 7));
                    const fig = lineGraph(Lg.cats, vals, step), kind = rng.int(0, 3);
                    const u = Lg.unit === 'hundred' ? '' : Lg.unit;
                    if (kind === 0) {
                        const diffs = vals.slice(1).map((v, i) => v - vals[i]), best = Math.max(...diffs);
                        if (best <= 0 || diffs.filter(d => d === best).length > 1) return this.gen(rng);
                        const i = diffs.indexOf(best);
                        return { q: `${Lg.q} What was the biggest increase from one ${Lg.cats === DAYS ? 'day' : 'month'} to the next?`, fig, ans: CA.num(best, u), sol: `The steepest rise is from ${Lg.cats[i]} to ${Lg.cats[i + 1]}: ${vals[i + 1]} − ${vals[i]} = ${best}.` };
                    }
                    if (kind === 1) {
                        const i = rng.int(0, vals.length - 1);
                        return { q: `${Lg.q} What was the value for ${Lg.cats[i]}?`, fig, ans: CA.num(vals[i], u), sol: `The point above ${Lg.cats[i]} is at ${vals[i]} on the scale.` };
                    }
                    if (kind === 2) {
                        let i, j; do { i = rng.int(0, vals.length - 1); j = rng.int(0, vals.length - 1); } while (i >= j || vals[i] === vals[j]);
                        return { q: `${Lg.q} By how much did the value change from ${Lg.cats[i]} to ${Lg.cats[j]}? (Give the size of the change.)`, fig, ans: CA.num(Math.abs(vals[j] - vals[i]), u), sol: R`\(${vals[j]}\) and \(${vals[i]}\): the change is \(${Math.abs(vals[j] - vals[i])}\) (${vals[j] > vals[i] ? 'up' : 'down'}).` };
                    }
                    return { q: `${Lg.q} What is the range of the values shown?`, fig, ans: CA.num(range(vals), u), sol: R`Highest \(-\) lowest \(= ${Math.max(...vals)} - ${Math.min(...vals)} = ${range(vals)}\).` };
                },
            },
            {
                id: 'pie-chart', name: 'Pie charts', level: 2,
                gen(rng) {
                    const [topic, cats] = rng.pick([['favourite sport', ['Football', 'Tennis', 'Swimming', 'Netball', 'Golf']], ['favourite season', ['Spring', 'Summer', 'Autumn', 'Winter']], ['way to get to work', ['Car', 'Train', 'Bus', 'Walk', 'Bike']], ['favourite ice-cream flavour', ['Vanilla', 'Chocolate', 'Strawberry', 'Mint']]]);
                    const k = rng.int(3, cats.length), labels = cats.slice(0, k);
                    let parts;
                    for (;;) { const p = Array.from({ length: k - 1 }, () => 5 * rng.int(2, 8)); const last = 100 - sum(p); if (last >= 10 && last <= 60) { parts = p.concat([last]); break; } }
                    const kind = rng.int(0, 2), i = rng.int(0, k - 1);
                    if (kind === 0) {
                        const N = rng.pick([20, 40, 60, 80, 120, 200, 300, 400, 500]);
                        if ((N * parts[i]) % 100) return this.gen(rng);
                        return { q: `${N} people were asked their ${topic}. How many chose ${labels[i]}?`, fig: pieChart(labels, parts, parts.map(p => `${p}%`)), ans: CA.num(N * parts[i] / 100), sol: R`\(${parts[i]}\%\) of ${N} \(= ${parts[i] / 100}\times${N} = ${N * parts[i] / 100}\).` };
                    }
                    if (kind === 1) {
                        const others = parts.filter((_, j) => j !== i);
                        return { q: `The pie chart shows people's ${topic}. What percentage chose ${labels[i]}?`, fig: pieChart(labels, parts, parts.map((p, j) => (j === i ? '?' : `${p}%`))), ans: CA.num(parts[i], '%'), sol: R`The whole pie is 100%: \(100 - ${others.join(' - ')} = ${parts[i]}\%\).` };
                    }
                    let j; do j = rng.int(0, k - 1); while (j === i || parts[j] === parts[i]);
                    const N = rng.pick([20, 40, 60, 80, 100, 200, 300]);
                    if ((N * Math.abs(parts[i] - parts[j])) % 100) return this.gen(rng);
                    const [a, b] = parts[i] > parts[j] ? [i, j] : [j, i];
                    return { q: `${N} people were asked their ${topic}. How many more chose ${labels[a]} than ${labels[b]}?`, fig: pieChart(labels, parts, parts.map(p => `${p}%`)), ans: CA.num(N * (parts[a] - parts[b]) / 100), sol: R`The difference is \(${parts[a]}\% - ${parts[b]}\% = ${parts[a] - parts[b]}\%\) of ${N}, which is \(${N * (parts[a] - parts[b]) / 100}\).` };
                },
            },
            {
                id: 'outliers', name: 'Outliers and choosing a measure', level: 2,
                gen(rng) {
                    {
                        const [what, lo, hi, olo, ohi] = rng.pick([['minutes spent on homework', 20, 45, 110, 150], ['test scores', 68, 96, 12, 30], ['prices of lunch ($)', 5, 12, 38, 60], ['times to run 100 m (seconds)', 14, 21, 40, 55], ['texts sent in a day', 8, 30, 140, 200], ['heights of some plants (cm)', 20, 40, 2, 6]]);
                        const c = { what }, n = rng.int(5, 7);
                        const a = Array.from({ length: n }, () => rng.int(lo, hi)), out = rng.int(olo, ohi);
                        const all = rng.shuffle(a.concat([out]));
                        const which = rng.pick(['mean', 'mean', 'median']);
                        const before = which === 'mean' ? mean(all) : median(all), after = which === 'mean' ? mean(a) : median(a);
                        const eff = Math.abs(before - after) < 1e-9 ? 'It stays the same' : after > before ? 'It goes up' : 'It goes down';
                        return {
                            q: `These are ${c.what}: ${list(all)}. The value ${out} is an outlier. What happens to the ${which} if ${out} is removed?`,
                            ans: CA.mc(rng, eff, ['It goes up', 'It goes down', 'It stays the same'].filter(e => e !== eff)),
                            sol: R`${cap(which)} with it: \(${num(CA.round(before, 2))}\); without it: \(${num(CA.round(after, 2))}\). ${which === 'mean' ? 'An outlier pulls the mean towards it.' : 'The median hardly moves — it is not affected much by outliers.'}`,
                        };
                    }
                },
            },
            {
                id: 'missing-value', name: 'Find a missing value', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        const n = rng.int(4, 7), m = rng.int(8, 40), a = withMean(rng, n, m, Math.max(1, m - 12), m + 12), x = a[n - 1], known = a.slice(0, n - 1);
                        return { q: `The mean of ${n} numbers is ${m}. ${n - 1} of them are ${list(known)}. What is the other number?`, ans: CA.num(x), sol: R`Total \(= ${n}\times${m} = ${n * m}\). Known numbers add to ${sum(known)}, so the other is \(${n * m} - ${sum(known)} = ${x}\).` };
                    }
                    if (kind === 1) {
                        const n = rng.int(3, 5), target = rng.int(70, 92), tests = Array.from({ length: n }, () => rng.int(target - 15, target + 8));
                        const need = target * (n + 1) - sum(tests);
                        if (need > 100 || need < 40) return this.gen(rng);
                        return { q: `Mia's first ${n} test scores are ${list(tests)}. What must she score on the next test to make her mean exactly ${target}?`, ans: CA.num(need), sol: R`She needs a total of \(${n + 1}\times${target} = ${target * (n + 1)}\). She has ${sum(tests)}, so she needs \(${target * (n + 1)} - ${sum(tests)} = ${need}\).` };
                    }
                    const n = rng.int(5, 8), m1 = rng.int(10, 30), out = rng.int(1, 3 * m1);
                    const rest = n * m1 - out;
                    if (rest % (n - 1)) return this.gen(rng);
                    return { q: `The mean of ${n} numbers is ${m1}. When one number is removed, the mean of the other ${n - 1} is ${rest / (n - 1)}. Which number was removed?`, ans: CA.num(out), sol: R`Total before: \(${n}\times${m1} = ${n * m1}\). Total after: \(${n - 1}\times${rest / (n - 1)} = ${rest}\). Removed: \(${n * m1} - ${rest} = ${out}\).` };
                },
            },
            {
                id: 'combined-mean', name: 'Combining groups', level: 3,
                gen(rng) {
                    for (;;) {
                        const n1 = rng.int(5, 30), n2 = rng.int(5, 30), m1 = rng.int(50, 95), m2 = rng.int(50, 95);
                        if (m1 === m2 || n1 === n2) continue;
                        const tot = n1 * m1 + n2 * m2, N = n1 + n2;
                        if (tot % N) continue;
                        const [g1, g2] = rng.pick([['Class A', 'Class B'], ['the boys', 'the girls'], ['Team Red', 'Team Blue']]);
                        if (rng.bool(0.7)) return { q: `${cap(g1)} has ${n1} pupils with a mean test score of ${m1}. ${cap(g2)} has ${n2} pupils with a mean score of ${m2}. What is the mean score of all ${N} pupils together?`, ans: CA.num(tot / N), sol: R`Totals: \(${n1}\times${m1} = ${n1 * m1}\) and \(${n2}\times${m2} = ${n2 * m2}\). Mean \(= ${tot} \div ${N} = ${tot / N}\). (Not just the average of ${m1} and ${m2}!)` };
                        return { q: `The mean score of all ${N} pupils is ${tot / N}. ${cap(g1)} (${n1} pupils) had a mean of ${m1}. What was the mean of the other ${n2} pupils?`, ans: CA.num(m2), sol: R`All together: \(${N}\times${tot / N} = ${tot}\). ${cap(g1)}: \(${n1}\times${m1} = ${n1 * m1}\). The rest: \((${tot} - ${n1 * m1}) \div ${n2} = ${m2}\).` };
                    }
                },
            },
            {
                id: 'build-a-set', name: 'Which data set fits?', level: 3,
                gen(rng) {
                    // A list of 5 whole numbers with a given mean, median and mode; wrong choices each break one condition.
                    const mk = () => { for (;;) { const a = sorted(Array.from({ length: 5 }, () => rng.int(1, 15))); if (modes(a).length === 1 && Number.isInteger(mean(a))) return a; } };
                    const good = mk(), M = mean(good), Md = median(good), Mo = modes(good)[0];
                    const fits = a => modes(a).length === 1 && mean(a) === M && median(a) === Md && modes(a)[0] === Mo;
                    const wrong = new Set();
                    for (let t = 0; t < 4000 && wrong.size < 3; t++) {
                        const a = sorted(good.map(x => x + (rng.bool(0.4) ? rng.int(-3, 3) : 0)).map(x => Math.max(0, x)));
                        if (fits(a) || a.join() === good.join()) continue;
                        const ok = [Number.isInteger(mean(a)) ? mean(a) === M : false, median(a) === Md, modes(a).length === 1 && modes(a)[0] === Mo].filter(Boolean).length;
                        if (ok === 2) wrong.add(list(a));
                    }
                    if (wrong.size < 3) return this.gen(rng);
                    const shuffledGood = list(good);
                    return {
                        q: `Which set of numbers has a mean of ${M}, a median of ${Md} and a mode of ${Mo}?`,
                        ans: CA.mc(rng, shuffledGood, [...wrong]), sol: R`For ${shuffledGood}: sum \(= ${sum(good)}\), mean \(= ${sum(good)} \div 5 = ${M}\); the middle value is ${Md}; ${Mo} appears most often. Each other set breaks one of the three conditions.`,
                    };
                },
            },
        ],

        assignment: [
            ['mean', 4], ['median', 4], ['mode-range', 4], ['read-bar', 3],
            ['mean-decimal', 4], ['bar-questions', 4], ['dot-plot', 4], ['line-graph', 4], ['pie-chart', 4], ['outliers', 3],
            ['missing-value', 4], ['combined-mean', 4], ['build-a-set', 4],
        ],
    });
})();
