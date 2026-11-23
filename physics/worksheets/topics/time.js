/* Worksheet: Time — t = d ÷ s, units of time, journeys, clock times, graphs, light and sound. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, F = CA.fig, C = F.colors;

    // ── Numbers, units and clock times ───────────────────────────────────
    /** Plain number: 1200 → "1,200", 1.5 → "1.5". */
    const fx = x => CA.round(x, 4).toLocaleString('en-US', { maximumFractionDigits: 4 });
    /** The same number for TeX (commas in braces). */
    const tx = x => fx(x).replace(/,/g, '{,}');
    /** A TeX quantity: qty(20, 's') → "20\text{ s}". */
    const qty = (x, u) => R`${tx(x)}\text{ ${u}}`;
    /** t = d / s, worked: "\(t = \dfrac{120\text{ m}}{6\text{ m/s}} = 20\text{ s}\)". */
    const tWork = (d, du, s, su, t, tu) => m(R`t = \dfrac{d}{s} = \dfrac{${qty(d, du)}}{${qty(s, su)}} = ${qty(t, tu)}`);
    /** Hours as a fraction, then minutes: "\(\dfrac{6}{18}\text{ h} = 20\text{ min}\)". */
    const hMin = (d, s, t) => m(R`\tfrac{${tx(d)}}{${tx(s)}}\text{ h} = ${tx(t)}\text{ min}`);
    const plural = (x, w) => `${fx(x)} ${w}${x === 1 ? '' : 's'}`;
    /** 95 → "1 h 35 min". */
    const hm = min => {
        const h = Math.floor(min / 60), r = min % 60;
        return h ? (r ? `${h} h ${r} min` : `${h} h`) : `${r} min`;
    };
    /** Minutes after midnight → "9:05 a.m.". */
    const clock = t => {
        t = ((t % 1440) + 1440) % 1440;
        const h = Math.floor(t / 60), mm = t % 60;
        return `${h % 12 || 12}:${String(mm).padStart(2, '0')} ${h < 12 ? 'a.m.' : 'p.m.'}`;
    };
    const NAMES = ['Maya', 'Leo', 'Aisha', 'Ben', 'Sofia', 'Kenji', 'Zara', 'Omar', 'Lily', 'Diego', 'Priya', 'Noah', 'Hana', 'Sam', 'Elena', 'Jamal'];
    const two = rng => rng.sample(NAMES, 2);
    /** Pick a time in whole minutes so that speed (per hour) × minutes / 60 is a whole number (or ends in .5). */
    function minutesFor(rng, s, lo, hi, half = false) {
        for (let k = 0; k < 200; k++) {
            const t = rng.int(lo, hi), d = s * t / 60;
            if (Number.isInteger(d) || (half && Number.isInteger(2 * d))) return t;
        }
        return 60;
    }

    // ── Figures ──────────────────────────────────────────────────────────
    const GRID = '#cbd5e0';
    /** Arrow from (x1, y) to (x2, y). */
    function arrow(x1, y, x2, opt = {}) {
        const dir = x2 > x1 ? 1 : -1, st = opt.stroke || C.ACCENT;
        return F.line(x1, y, x2 - dir * 2, y, { stroke: st, width: 2 })
            + F.poly([[x2, y], [x2 - dir * 8, y - 4], [x2 - dir * 8, y + 4]], { fill: st, stroke: st, width: 1 });
    }
    /** Two travellers on a straight road: 'toward' each other, or 'same' way (one behind). */
    function roadFig(mode, nameA, nameB, labA, labB, gapLabel) {
        const W = 290, H = 92, x0 = 30, x1 = 260, y = 50;
        let b = F.line(x0 - 14, y, x1 + 14, y, { stroke: '#a0aec0', width: 6 });
        b += F.dot(x0, y, { r: 5 }) + F.text(x0, y + 20, nameA, { size: 12 });
        if (mode === 'toward') {
            b += F.dot(x1, y, { r: 5 }) + F.text(x1, y + 20, nameB, { size: 12 });
            b += arrow(x0 + 6, y - 14, x0 + 56) + F.text(x0 + 2, y - 22, labA, { size: 12, anchor: 'start' });
            b += arrow(x1 - 6, y - 14, x1 - 56) + F.text(x1 - 2, y - 22, labB, { size: 12, anchor: 'end' });
            b += F.line(x0, y + 30, x1, y + 30, { width: 1 }) + F.line(x0, y + 26, x0, y + 34, { width: 1 }) + F.line(x1, y + 26, x1, y + 34, { width: 1 });
            b += F.text((x0 + x1) / 2, y + 26, gapLabel, { size: 12 });
        }
        return F.svg(W, H, b, { label: 'road diagram' });
    }
    /**
     * Distance–time graph.  pts are [t, d] corners (in grid units × step); the axes run to
     * nT × tStep and nD × dStep.
     */
    function dtGraph(pts, nT, tStep, tu, nD, dStep, du) {
        const W = 290, H = 186, L = 48, Rr = 278, T = 18, B = 146;
        const X = t => L + (Rr - L) * t / (nT * tStep), Y = d => B - (B - T) * d / (nD * dStep);
        let b = '';
        for (let i = 0; i <= nT; i++) {
            b += F.line(X(i * tStep), T, X(i * tStep), B, { stroke: GRID, width: 0.7 });
            b += F.text(X(i * tStep), B + 13, fx(i * tStep), { size: 10 });
        }
        for (let j = 0; j <= nD; j++) {
            b += F.line(L, Y(j * dStep), Rr, Y(j * dStep), { stroke: GRID, width: 0.7 });
            b += F.text(L - 4, Y(j * dStep) + 3.5, fx(j * dStep), { size: 10, anchor: 'end' });
        }
        b += F.line(L, B, Rr + 4, B, { width: 1.3 }) + F.line(L, B, L, T - 6, { width: 1.3 });
        b += F.text((L + Rr) / 2, B + 30, `time (${tu})`, { size: 11 });
        b += F.text(L - 40, T - 8, `distance (${du})`, { size: 11, anchor: 'start' });
        b += F.poly(pts.map(([t, d]) => [X(t), Y(d)]), { open: true, stroke: C.ACCENT, width: 2.2 });
        for (const [t, d] of pts) b += F.dot(X(t), Y(d), { r: 2.6, fill: C.ACCENT });
        return F.svg(W, H, b, { label: 'distance-time graph' });
    }

    /** A distance–time graph problem: v = 0 time stopped, 1 time after the stop, 2 time moving, 3 time at the first part's speed. */
    function graphGen(rng, v) {
        const name = rng.pick(NAMES);
        const c = rng.pick([
            { txt: `${name} walks to the library`, who: name, tu: 'min', tStep: 1, du: 'm', dStep: 100, v: [50, 110] },
            { txt: `${name} walks to the library`, who: name, tu: 'min', tStep: 2, du: 'm', dStep: 200, v: [50, 110] },
            { txt: `${name} cycles to a friend's house`, who: name, tu: 'min', tStep: rng.pick([1, 2]), du: 'km', dStep: 1, v: [0.2, 0.5] },
            { txt: 'a robot vacuum crosses a hall', who: 'the robot', tu: 's', tStep: rng.pick([5, 10]), du: 'm', dStep: 2, v: [0.1, 0.5] },
            { txt: 'a bus drives from one town to the next', who: 'the bus', tu: 'min', tStep: 5, du: 'km', dStep: rng.pick([2, 5]), v: [0.3, 1.2] },
        ]);
        const T = c.tStep, D = c.dStep, ok = x => x >= c.v[0] && x <= c.v[1];
        let nD, a, d1, stop, b, d2;
        do {
            nD = rng.int(4, 7); a = rng.int(2, 4); d1 = rng.int(1, nD - 1); stop = rng.int(1, 3); b = rng.int(2, 5); d2 = rng.int(d1 + 1, nD);
        } while (CA.round(d1 * D / (a * T), 2) !== d1 * D / (a * T) || !ok(d1 * D / (a * T)) || !ok((d2 - d1) * D / (b * T)) || a + stop + b > 12);
        const nT = Math.max(8, a + stop + b + rng.int(0, 2));
        const pts = [[0, 0], [a * T, d1 * D], [(a + stop) * T, d1 * D], [(a + stop + b) * T, d2 * D]];
        const fig = dtGraph(pts, nT, T, c.tu, nD, D, c.du);
        const uw = c.tu === 's' ? 'seconds' : 'minutes';
        if (v === 0) return {
            q: `The graph shows how ${c.txt}. For how many ${uw} is ${c.who} stopped?`, fig,
            ans: CA.num(stop * T, c.tu),
            sol: `The flat part (distance not changing) runs from ${a * T} to ${(a + stop) * T} ${c.tu}: ${(a + stop) * T} − ${a * T} = ${stop * T} ${c.tu}.`,
        };
        if (v === 1) return {
            q: `The graph shows how ${c.txt}. How many ${uw} does the part of the trip after the stop take?`, fig,
            ans: CA.num(b * T, c.tu),
            sol: `After the stop, ${c.who} moves again from ${(a + stop) * T} to ${(a + stop + b) * T} ${c.tu}: ${b * T} ${c.tu}.`,
        };
        if (v === 2) return {
            q: `The graph shows how ${c.txt}. For how many ${uw} altogether is ${c.who} actually moving?`, fig,
            ans: CA.num((a + b) * T, c.tu),
            sol: `Moving: 0 to ${a * T} ${c.tu} (${a * T}) and ${(a + stop) * T} to ${(a + stop + b) * T} ${c.tu} (${b * T}). Total ${(a + b) * T} ${c.tu}; the flat part is the stop.`,
        };
        // At the speed of the first part, how long for a longer distance?
        const sp = d1 * D / (a * T);                     // per tu
        let k = rng.int(2, 5), dist = sp * a * T * k;
        const spU = `${c.du}/${c.tu}`;
        return {
            q: `The graph shows how ${c.txt}. At the same steady speed as in the first part, how many ${uw} would it take to travel ${fx(dist)} ${c.du}?`, fig,
            ans: CA.num(a * T * k, c.tu),
            sol: `First part: ${fx(d1 * D)} ${c.du} in ${a * T} ${c.tu}, so speed = ${fx(sp)} ${spU}. ${tWork(dist, c.du, sp, spU, a * T * k, c.tu)}.`,
        };
    }

    CA.register({
        id: 'time',
        title: 'Time',
        page: 'time.html',
        subject: 'Physics',
        assignmentNote: R`Use \(t = \dfrac{d}{s}\) (time = distance ÷ speed). 1 min = 60 s, 1 h = 60 min = 3,600 s. Give each answer in the unit the question asks for (s, min or h). Answers come out exact — no rounding is needed. Write clock times like 9:05 a.m.`,

        practice: [
            // ── Level 1 ─────────────────────────────────────────────────
            {
                id: 'find-time', name: 'Find the time: t = d ÷ s', level: 1,
                gen(rng) {
                    const name = rng.pick(NAMES);
                    const C1 = [
                        { s: [3, 8, 1], t: [8, 40], du: 'm', su: 'm/s', tu: 's', w: 'seconds', txt: (d, s) => `${name} runs ${fx(d)} m at a steady speed of ${s} m/s.` },
                        { s: [24, 30, 1], t: [3, 9], du: 'm', su: 'm/s', tu: 's', w: 'seconds', txt: (d, s) => `A cheetah sprints ${fx(d)} m at ${s} m/s.` },
                        { s: [1, 2, 0.5], t: [20, 90], du: 'm', su: 'm/s', tu: 's', w: 'seconds', txt: (d, s) => `${name} swims ${fx(d)} m at a steady ${s} m/s.` },
                        { s: [1, 3, 1], t: [20, 90], du: 'mm', su: 'mm/s', tu: 's', w: 'seconds', txt: (d, s) => `A snail crawls ${fx(d)} mm along a leaf at ${s} mm/s.` },
                        { s: [2, 6, 1], t: [5, 25], du: 'm', su: 'm/s', tu: 's', w: 'seconds', txt: (d, s) => `An elevator rises ${fx(d)} m at a steady ${s} m/s.` },
                        { s: [40, 110, 10], t: [1, 5], half: true, du: 'km', su: 'km/h', tu: 'h', w: 'hours', txt: (d, s) => `A car drives ${fx(d)} km along a highway at ${s} km/h.` },
                        { s: [80, 200, 20], t: [1, 5], half: true, du: 'km', su: 'km/h', tu: 'h', w: 'hours', txt: (d, s) => `A train travels ${fx(d)} km at an average speed of ${s} km/h.` },
                        { s: [600, 900, 50], t: [2, 9], du: 'km', su: 'km/h', tu: 'h', w: 'hours', txt: (d, s) => `A plane flies ${fx(d)} km at ${s} km/h.` },
                        { s: [12, 24, 2], t: [1, 4], half: true, du: 'km', su: 'km/h', tu: 'h', w: 'hours', txt: (d, s) => `${name} cycles ${fx(d)} km at a steady ${s} km/h.` },
                    ];
                    const c = rng.pick(C1);
                    let s, t, d;
                    do {
                        s = c.s[0] + c.s[2] * rng.int(0, Math.round((c.s[1] - c.s[0]) / c.s[2]));
                        t = rng.int(c.t[0], c.t[1]) + (c.half && rng.bool(0.35) ? 0.5 : 0);
                        d = CA.round(s * t, 4);
                    } while (!Number.isInteger(d));
                    return {
                        q: `${c.txt(d, s)} How long does it take? Give your answer in ${c.w}.`,
                        ans: CA.num(t, c.tu),
                        sol: `Time = distance ÷ speed: ${tWork(d, c.du, s, c.su, t, c.tu)}.`,
                    };
                },
            },
            {
                id: 'convert-units', name: 'Converting seconds, minutes and hours', level: 1,
                gen(rng) {
                    const v = rng.int(0, 6);
                    if (v === 0) {                                   // min → s
                        const a = rng.int(2, 15) + (rng.bool(0.3) ? 0.5 : 0);
                        return { q: `A song lasts ${fx(a)} minutes. How many seconds is that?`, ans: CA.num(a * 60, 's'), sol: m(R`${tx(a)} \times 60 = ${tx(a * 60)}`) + ' s, because 1 min = 60 s.' };
                    }
                    if (v === 1) {                                   // s → min
                        const a = rng.int(3, 24) / 2, s = a * 60;
                        const what = rng.pick(['A microwave timer is set to', 'A plank exercise lasts', 'A video is', 'A pizza bakes for']);
                        return { q: `${what} ${fx(s)} seconds. How many minutes is that?`, ans: CA.num(a, 'min'), sol: m(R`${tx(s)} \div 60 = ${tx(a)}`) + ' min, because 60 s make 1 min.' };
                    }
                    if (v === 2) {                                   // h → min
                        const a = rng.pick([0.25, 0.5, 0.75, 1.25, 1.5, 1.75, 2.25, 2.5, 3.5, 4.5]);
                        const what = rng.pick(['A movie lasts', 'A bus ride takes', 'A football match lasts', 'A hike takes']);
                        return { q: `${what} ${fx(a)} hours. How many minutes is that?`, ans: CA.num(a * 60, 'min'), sol: m(R`${tx(a)} \times 60 = ${tx(a * 60)}`) + ' min, because 1 h = 60 min.' };
                    }
                    if (v === 3) {                                   // min → h
                        const mm = rng.pick([15, 30, 45, 75, 90, 105, 135, 150, 165, 210, 270]);
                        const what = rng.pick(['A ferry crossing takes', 'A car journey takes', 'A school trip by coach takes', 'A bike ride takes']);
                        return { q: `${what} ${mm} minutes. How many hours is that? Give a decimal.`, ans: CA.num(mm / 60, 'h'), sol: m(R`${mm} \div 60 = ${tx(mm / 60)}`) + ' h, because 60 min make 1 h.' };
                    }
                    if (v === 4) {                                   // h → s
                        const a = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 0.25]);
                        return { q: `How many seconds are there in ${plural(a, 'hour')}?`, ans: CA.num(a * 3600, 's'), sol: `1 h = 3,600 s, so ` + m(R`${tx(a)} \times 3600 = ${tx(a * 3600)}`) + ' s.' };
                    }
                    if (v === 5) {                                   // min + s → s
                        const a = rng.int(1, 9), b = rng.int(1, 11) * 5;
                        const what = rng.pick(['finishes a race in', 'solves a puzzle cube in', 'holds a plank for', 'swims a race in']);
                        return { q: `${rng.pick(NAMES)} ${what} ${a} min ${b} s. How many seconds is that altogether?`, ans: CA.num(a * 60 + b, 's'), sol: m(R`${a} \times 60 + ${b} = ${a * 60 + b}`) + ' s.' };
                    }
                    const a = rng.int(1, 6), b = rng.int(1, 11) * 5;  // h + min → min
                    const what = rng.pick(['A train journey takes', 'A flight lasts', 'A road trip takes', 'A boat tour lasts']);
                    return { q: `${what} ${a} h ${b} min. How many minutes is that altogether?`, ans: CA.num(a * 60 + b, 'min'), sol: m(R`${a} \times 60 + ${b} = ${a * 60 + b}`) + ' min.' };
                },
            },
            {
                id: 'time-ideas', name: 'Time ideas (multiple choice)', level: 1,
                gen(rng) {
                    const v = rng.pick([0, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5]);
                    if (v === 0) {
                        return {
                            q: R`Distance, speed and time are linked. Which formula gives the time \(t\) for a journey of distance \(d\) at speed \(s\)?`,
                            ans: CA.mc(rng, m(R`t = \dfrac{d}{s}`), [m(R`t = \dfrac{s}{d}`), m(R`t = d \times s`), m(R`t = d - s`)]),
                            sol: R`Time = distance ÷ speed, so \(t = \dfrac{d}{s}\). (Check: 100 m at 5 m/s takes 100 ÷ 5 = 20 s.)`,
                        };
                    }
                    if (v === 1) {                                   // faster → less time
                        const [A, B] = two(rng), k = rng.int(2, 4), sp = rng.pick([8, 10, 12, 15]);
                        const part = ['', '', 'half', 'one third', 'one quarter'][k], kw = ['', '', 'twice', 'three times', 'four times'][k];
                        const route = rng.pick(['the same 12 km route', 'the same trail', 'the same distance to school']);
                        return {
                            q: `${A} and ${B} cycle ${route}. ${A} rides at ${sp} km/h and ${B} rides at ${k * sp} km/h. Compared with ${A}, how long does ${B} take?`,
                            ans: CA.mc(rng, `${part} as long`, [`${kw} as long`, 'the same time, because the distance is the same', `${k} hours less`]),
                            sol: `${B} is ${k} times as fast. For the same distance, time = distance ÷ speed, so ${B} needs ${part} of ${A}'s time.`,
                        };
                    }
                    if (v === 2) {                                   // longer distance at the same speed
                        const k = rng.int(2, 5), t = rng.pick([6, 8, 10, 12, 15, 20]);
                        const who = rng.pick(['A bus', 'A delivery van', 'A tram', 'A cyclist']);
                        return {
                            q: `${who} takes ${t} min to cover a stretch of road. At the same speed, how long will it take to cover ${k} times that distance?`,
                            ans: CA.mc(rng, `${k * t} min`, [`${t} min`, `${t + k} min`, `${CA.round(t / k, 2)} min`]),
                            sol: `At the same speed, time grows with distance: ${k} times as far takes ${k} × ${t} = ${k * t} min.`,
                        };
                    }
                    if (v === 3) {                                   // which time is longest?
                        let opts;
                        for (;;) {
                            const s1 = rng.int(70, 190);
                            const m1 = rng.pick([1.25, 1.5, 1.75, 2, 2.25, 2.5, 3]);
                            const a = rng.int(1, 2), b = rng.int(1, 11) * 5;
                            const h = rng.pick([0.02, 0.025, 0.03, 0.04, 0.05]);
                            opts = [[s1, `${s1} s`], [m1 * 60, `${m1} min`], [a * 60 + b, `${a} min ${b} s`], [CA.round(h * 3600, 4), `${h} h`]];
                            const secs = opts.map(o => o[0]);
                            if (new Set(secs).size === 4 && Math.min(...secs.map((x, i) => Math.min(...secs.filter((y, j) => j !== i).map(y => Math.abs(x - y))))) >= 6) break;
                        }
                        const best = opts.reduce((p, o) => (o[0] > p[0] ? o : p));
                        return {
                            q: `Which of these times is the longest?`,
                            ans: CA.mc(rng, best[1], opts.filter(o => o !== best).map(o => o[1])),
                            sol: `Change all to seconds: ${opts.map(o => `${o[1]} = ${fx(o[0])} s`).join('; ')}. The longest is ${best[1]}.`,
                        };
                    }
                    if (v === 4) {                                   // decimal hours/minutes misread
                        const big = rng.int(1, 4), fr = rng.pick([0.25, 0.5, 0.75]), unit = rng.pick(['h', 'min']);
                        const sub = unit === 'h' ? 'min' : 's', x = big + fr, part = fr * 60;
                        const wrongMis = `${big} ${unit} ${Math.round(fr * 100)} ${sub}`;
                        const wrong2 = `${big} ${unit} ${60 - part} ${sub}`;
                        const what = unit === 'h' ? rng.pick(['A car trip took', 'A train ride took', 'A concert lasted']) : rng.pick(['A stopwatch reads', 'An egg boiled for', 'A sprint workout lasted']);
                        return {
                            q: `${what} ${fx(x)} ${unit}. Which of these is the same length of time?`,
                            ans: CA.mc(rng, `${big} ${unit} ${part} ${sub}`, [wrongMis, `${fx(x * 100)} ${sub}`, wrong2, `${big * 60 + Math.round(fr * 100)} ${sub}`]),
                            sol: `${fx(fr)} of 60 ${sub} is ${part} ${sub}, so ${fx(x)} ${unit} = ${big} ${unit} ${part} ${sub}. (The digits after the point are not ${sub}.)`,
                        };
                    }
                    return {
                        q: 'Which unit do scientists use as the basic unit of time when they study motion?',
                        ans: CA.mc(rng, 'the second (s)', ['the minute (min)', 'the hour (h)', 'the metre per second (m/s)']),
                        sol: 'The second (s) is the basic scientific unit of time; m/s is a unit of speed, not time.',
                    };
                },
            },

            // ── Level 2 ─────────────────────────────────────────────────
            {
                id: 'time-in-minutes', name: 'Find the time, then change units', level: 2,
                gen(rng) {
                    const v = rng.int(0, 2), name = rng.pick(NAMES);
                    if (v === 0) {                                   // km at km/h → min
                        const c = rng.pick([
                            { s: [30, 36, 40, 45, 48, 60], txt: (d, s) => `A bus travels ${fx(d)} km at an average speed of ${s} km/h.` },
                            { s: [12, 15, 16, 18, 20, 24], txt: (d, s) => `${name} cycles ${fx(d)} km at ${s} km/h.` },
                            { s: [4, 5, 6], txt: (d, s) => `${name} walks ${fx(d)} km at ${s} km/h.` },
                            { s: [72, 80, 90, 100, 120], txt: (d, s) => `A train covers ${fx(d)} km at ${s} km/h.` },
                        ]);
                        const s = rng.pick(c.s), t = minutesFor(rng, s, 10, 100, true), d = s * t / 60;
                        return {
                            q: `${c.txt(d, s)} How many minutes does it take?`,
                            ans: CA.num(t, 'min'),
                            sol: m(R`t = \dfrac{d}{s} = \dfrac{${qty(d, 'km')}}{${qty(s, 'km/h')}} = \dfrac{${tx(d)}}{${s}}\text{ h} = ${t}\text{ min}`) + ` (an hour is 60 min, so ${fx(d)}/${s} of an hour is ${t} min).`,
                        };
                    }
                    if (v === 1) {                                   // m at m/s → min
                        const c = rng.pick([
                            { s: [1, 1.5, 2], txt: (d, s) => `${name} walks ${fx(d)} m to the park at ${s} m/s.` },
                            { s: [3, 4, 5], txt: (d, s) => `${name} jogs ${fx(d)} m at a steady ${s} m/s.` },
                            { s: [5, 6, 8, 10], txt: (d, s) => `A delivery drone flies ${fx(d)} m at ${s} m/s.` },
                            { s: [0.5, 1], txt: (d, s) => `A moving walkway at an airport carries ${name} ${fx(d)} m at ${s} m/s.` },
                        ]);
                        const s = rng.pick(c.s), t = rng.int(2, 15), d = s * 60 * t;
                        return {
                            q: `${c.txt(d, s)} How many minutes does it take?`,
                            ans: CA.num(t, 'min'),
                            sol: `${tWork(d, 'm', s, 'm/s', d / s, 's')}, and ` + m(R`${tx(d / s)} \div 60 = ${t}`) + ' min.',
                        };
                    }
                    // km at m/s → min (change km to m first)
                    let s, t, dm;
                    do { s = rng.pick([2, 4, 5, 8, 10, 15, 20, 25]); t = rng.int(2, 30); dm = s * 60 * t; } while (dm % 500 !== 0 || dm > 30000);
                    const who = s <= 5 ? `${name} runs` : s <= 10 ? `${name} rides an e-scooter` : 'A car drives';
                    return {
                        q: `${who} ${fx(dm / 1000)} km at ${s} m/s. How many minutes does it take?`,
                        ans: CA.num(t, 'min'),
                        sol: `${fx(dm / 1000)} km = ${fx(dm)} m. ${tWork(dm, 'm', s, 'm/s', dm / s, 's')} = ${t} min.`,
                    };
                },
            },
            {
                id: 'journey-stop', name: 'Journeys with a stop', level: 2,
                gen(rng) {
                    const name = rng.pick(NAMES);
                    if (rng.bool(0.6)) {                             // km/h legs, answer in minutes
                        const c = rng.pick([
                            { s: [12, 15, 16, 18, 20, 24], go: 'cycles', stop: ['stops at a café for', 'fixes a flat tyre for', 'rests at a lake for'] },
                            { s: [40, 45, 48, 50, 60, 72, 80, 90], go: 'drives', stop: ['stops for fuel for', 'waits at road works for', 'takes a break for'] },
                            { s: [4, 5, 6], go: 'walks', stop: ['stops for a picnic for', 'waits for a friend for', 'rests at a viewpoint for'] },
                        ]);
                        let s1, s2, t1, t2;
                        do {
                            s1 = rng.pick(c.s); s2 = rng.pick(c.s);
                            t1 = minutesFor(rng, s1, 10, 60); t2 = minutesFor(rng, s2, 10, 60);
                        } while (s1 === s2);
                        const d1 = s1 * t1 / 60, d2 = s2 * t2 / 60, w = rng.pick([5, 10, 15, 20, 25, 30]);
                        return {
                            q: `${name} ${c.go} ${fx(d1)} km at ${s1} km/h, ${rng.pick(c.stop)} ${w} min, then ${c.go} another ${fx(d2)} km at ${s2} km/h. How many minutes does the whole trip take, including the stop?`,
                            ans: CA.num(t1 + w + t2, 'min'),
                            sol: `First part: ${hMin(d1, s1, t1)}. Second part: ${hMin(d2, s2, t2)}. Total ${t1} + ${w} + ${t2} = ${t1 + w + t2} min.`,
                        };
                    }
                    const c = rng.pick([
                        { who: 'A delivery robot', s: [1, 2, 3], stop: 'waits at a crossing for' },
                        { who: `${name}`, s: [3, 4, 5, 6], stop: 'stops to tie a shoelace for' },
                        { who: 'A toy train', s: [1, 2], stop: 'pauses at a station for' },
                    ]);
                    let s1, s2;
                    do { s1 = rng.pick(c.s); s2 = rng.pick(c.s); } while (s1 === s2);
                    const t1 = rng.int(6, 40), t2 = rng.int(6, 40), w = rng.int(2, 9) * 5;
                    return {
                        q: `${c.who} moves ${s1 * t1} m at ${s1} m/s, ${c.stop} ${w} s, then moves ${s2 * t2} m at ${s2} m/s. How many seconds does the whole trip take?`,
                        ans: CA.num(t1 + w + t2, 's'),
                        sol: `${s1 * t1} ÷ ${s1} = ${t1} s, then the ${w} s stop, then ${s2 * t2} ÷ ${s2} = ${t2} s. Total ${t1 + w + t2} s.`,
                    };
                },
            },
            {
                id: 'clock-times', name: 'Departure and arrival times', level: 2,
                gen(rng) {
                    const v = rng.int(0, 2);
                    if (v === 0) {                                   // elapsed time from a timetable
                        const dep = rng.int(6 * 12, 17 * 12) * 5 + rng.pick([0, 2, 3]), dur = rng.int(5, 48) * 5 - rng.pick([0, 2]);
                        const [what, arr] = rng.pick([['A train leaves the station', 'arrives at the next city'], ['A ferry leaves the port', 'docks on the island'], ['A school bus leaves the school', 'reaches the museum'], ['A flight takes off', 'lands'], ['A coach leaves the bus station', 'arrives at the seaside']]);
                        const toNext = 60 - dep % 60, fullH = Math.floor((dur - toNext) / 60), rest = dur - toNext - 60 * fullH;
                        return {
                            q: `${what} at ${clock(dep)} and ${arr} at ${clock(dep + dur)} the same day. How many minutes does the journey take?`,
                            ans: CA.num(dur, 'min'),
                            sol: dur >= toNext
                                ? `From ${clock(dep)} to ${clock(dep + toNext)} is ${toNext} min, then ${fullH ? `${fullH} h (${60 * fullH} min) and ` : ''}${rest} min more: ${toNext}${fullH ? ` + ${60 * fullH}` : ''} + ${rest} = ${dur} min.`
                                : `From ${clock(dep)} to ${clock(dep + dur)} is ${dur} min.`,
                        };
                    }
                    // arrival (v = 1) or latest departure (v = 2), from distance and speed
                    let s, hrs, d;
                    do { s = rng.pick([40, 48, 60, 80, 90, 100, 120]); hrs = rng.pick([1.25, 1.5, 1.75, 2.25, 2.5, 2.75, 3.5]); d = s * hrs; } while (!Number.isInteger(d));
                    const dur = hrs * 60;
                    const big = Math.floor(hrs), misread = big * 60 + Math.round((hrs - big) * 100);
                    const who = s <= 60 ? 'A coach' : s <= 100 ? 'A car' : 'A train';
                    const misl = `${big} h ${Math.round((hrs - big) * 100)} min`;
                    if (v === 1) {
                        const dep = rng.int(7 * 12, 16 * 12) * 5;
                        return {
                            q: `${who} leaves at ${clock(dep)} and travels ${d} km at an average speed of ${s} km/h. At what time does it arrive?`,
                            ans: CA.mc(rng, clock(dep + dur), [clock(dep + misread), clock(dep + 60 * big), clock(dep + dur + 60)]),
                            sol: `${tWork(d, 'km', s, 'km/h', hrs, 'h')} = ${hm(dur)} (not ${misl}). ${clock(dep)} + ${hm(dur)} = ${clock(dep + dur)}`,
                        };
                    }
                    const arrive = rng.int(10 * 12, 20 * 12) * 5;
                    const event = rng.pick(['a concert that starts', 'a football match that kicks off', 'a wedding that begins', 'a meeting that starts']);
                    return {
                        q: `A family drives ${d} km at an average speed of ${s} km/h to ${event} at ${clock(arrive)}. What is the latest time they can leave home?`,
                        ans: CA.mc(rng, clock(arrive - dur), [clock(arrive - misread), clock(arrive - 60 * big), clock(arrive + dur)]),
                        sol: `${tWork(d, 'km', s, 'km/h', hrs, 'h')} = ${hm(dur)}. Count back: ${clock(arrive)} − ${hm(dur)} = ${clock(arrive - dur)}`,
                    };
                },
            },
            {
                id: 'compare-journeys', name: 'Which way is quicker?', level: 2,
                gen(rng) {
                    const name = rng.pick(NAMES);
                    if (rng.bool(0.5)) {                             // two routes
                        let sA, sB, tA, tB;
                        do {
                            sA = rng.pick([80, 90, 100, 110, 120]); sB = rng.pick([30, 40, 45, 50, 60]);
                            tA = minutesFor(rng, sA, 12, 50); tB = minutesFor(rng, sB, 12, 50);
                        } while (Math.abs(tA - tB) < 3 || sA * tA <= sB * tB);
                        const dA = sA * tA / 60, dB = sB * tB / 60;
                        return {
                            q: `${name} can drive to the beach two ways. The highway route is ${fx(dA)} km at ${sA} km/h. The shorter town route is ${fx(dB)} km at ${sB} km/h. How many minutes faster is the quicker route?`,
                            ans: CA.num(Math.abs(tA - tB), 'min'),
                            sol: `Highway: ${hMin(dA, sA, tA)}. Town: ${hMin(dB, sB, tB)}. The ${tA < tB ? 'highway' : 'town route'} is ${Math.abs(tA - tB)} min faster.`,
                        };
                    }
                    let w, b, d, tw, tb, wait, tot;
                    do {
                        w = rng.pick([4, 5, 6]); b = rng.pick([20, 24, 30, 36, 40]);
                        d = rng.int(4, 8) / 2;
                        tw = d / w * 60; tb = d / b * 60; wait = rng.int(1, 6) * 5;
                        tot = tb + wait;
                    } while (!Number.isInteger(tw) || !Number.isInteger(tb) || Math.abs(tw - tot) < 3);
                    return {
                        q: `${name} lives ${fx(d)} km from school. Walking at ${w} km/h, or waiting ${wait} min for a bus that then travels at ${b} km/h — which is quicker, and by how many minutes? Give the number of minutes.`,
                        ans: CA.num(Math.abs(tw - tot), 'min'),
                        sol: `Walk: ${hMin(d, w, tw)}. Bus: ${hMin(d, b, tb)}, plus the ${wait} min wait = ${tot} min. ${tw < tot ? 'Walking' : 'The bus'} is quicker by ${Math.abs(tw - tot)} min.`,
                    };
                },
            },
            {
                id: 'graph-read', name: 'Reading times off a distance–time graph', level: 2,
                gen(rng) { return graphGen(rng, rng.int(0, 2)); },
            },
            {
                id: 'graph-speed', name: 'Speed from a graph, then a new time', level: 2,
                gen(rng) { return graphGen(rng, 3); },
            },
            {
                id: 'light-sound', name: 'Time for sound and light to travel', level: 2,
                gen(rng) {
                    const v = rng.pick([0, 0, 1, 1, 2, 2, 3, 4]);
                    if (v === 0) {                                   // sound in air
                        const t = rng.int(1, 12) / 2, d = 340 * t;
                        const c = rng.pick([
                            `A starting pistol is fired ${fx(d)} m away from a spectator.`,
                            `A quarry blast goes off ${fx(d)} m from a farmhouse.`,
                            `A ship's horn sounds ${fx(d)} m from the beach.`,
                            `A church bell rings ${fx(d)} m from ${rng.pick(NAMES)}'s house.`,
                        ]);
                        return { q: `${c} Sound travels at 340 m/s. How many seconds does the sound take to arrive?`, ans: CA.num(t, 's'), sol: `${tWork(d, 'm', 340, 'm/s', t, 's')}.` };
                    }
                    if (v === 1) {                                   // echo
                        const t = rng.int(2, 12) / 2, d = 170 * t;
                        const c = rng.pick(['shouts towards a cliff', 'claps facing a tall wall', 'yells across a canyon at the rock face']);
                        return {
                            q: `${rng.pick(NAMES)} ${c} ${fx(d)} m away. Sound travels at 340 m/s. How many seconds after the sound is made is the echo heard?`,
                            ans: CA.num(t, 's'),
                            sol: `The sound goes there and back: ${fx(d)} × 2 = ${fx(2 * d)} m. ${tWork(2 * d, 'm', 340, 'm/s', t, 's')}.`,
                        };
                    }
                    if (v === 2) {                                   // light from planets
                        const p = rng.pick([
                            { n: 'the Sun' },
                            { n: 'Mars', mins: [4, 5, 6, 8, 10, 12, 15, 20] },
                            { n: 'Venus', mins: [3, 4, 5, 6, 8, 10, 12, 14] },
                            { n: 'Jupiter', mins: [35, 36, 40, 42, 45, 48, 50] },
                        ]);
                        if (p.n === 'the Sun') {
                            return {
                                q: `The Sun is about 150,000,000 km from Earth. Light travels at 300,000 km/s. How many seconds does sunlight take to reach Earth?`,
                                ans: CA.num(500, 's'),
                                sol: `${tWork(150000000, 'km', 300000, 'km/s', 500, 's')} (8 min 20 s).`,
                            };
                        }
                        const mins = rng.pick(p.mins), secs = mins * 60, d = 300000 * secs;
                        const inMin = rng.bool(0.6);
                        return {
                            q: `${p.n} is ${fx(d / 1e6)} million km from Earth. Light travels at 300,000 km/s. How many ${inMin ? 'minutes' : 'seconds'} does light from ${p.n} take to reach Earth?`,
                            ans: CA.num(inMin ? mins : secs, inMin ? 'min' : 's'),
                            sol: `${fx(d / 1e6)} million km = ${fx(d)} km. ${tWork(d, 'km', 300000, 'km/s', secs, 's')}${inMin ? ` = ${mins} min` : ''}.`,
                        };
                    }
                    if (v === 3) {                                   // sound in water
                        const t = rng.int(1, 12), d = 1500 * t;
                        const c = rng.pick(['A whale call travels', 'A sonar ping travels', 'The sound of a ship\'s engine travels']);
                        return { q: `${c} ${fx(d / 1000)} km through sea water, where sound travels at 1,500 m/s. How many seconds does it take?`, ans: CA.num(t, 's'), sol: `${fx(d / 1000)} km = ${fx(d)} m. ${tWork(d, 'm', 1500, 'm/s', t, 's')}.` };
                    }
                    const nm = rng.pick(NAMES), c = rng.pick([                // see it first, hear it later
                        { t: [1, 3], txt: d => `At an outdoor concert ${nm} sits ${fx(d)} m from the stage.`, see: 'seeing the drummer hit the drum' },
                        { t: [2, 8], txt: d => `${nm} watches a fireworks display from ${fx(d)} m away.`, see: 'seeing a rocket burst' },
                        { t: [1, 2], txt: d => `${nm} sits in a stadium ${fx(d)} m from the batter.`, see: 'seeing the bat hit the ball' },
                        { t: [2, 6], txt: d => `${nm} watches a woodcutter chopping a tree ${fx(d)} m away across a valley.`, see: 'seeing the axe strike' },
                    ]);
                    const t = rng.int(c.t[0], c.t[1]) * 0.5, d = 340 * t;
                    return {
                        q: `${c.txt(d)} Light arrives almost instantly; sound travels at 340 m/s. How many seconds after ${c.see} does ${nm} hear it?`,
                        ans: CA.num(t, 's'),
                        sol: `Light takes almost no time, so the delay is the sound's time: ${tWork(d, 'm', 340, 'm/s', t, 's')}.`,
                    };
                },
            },

            // ── Level 3 ─────────────────────────────────────────────────
            {
                id: 'meeting', name: 'Travelling towards each other', level: 3,
                gen(rng) {
                    const [A, B] = two(rng);
                    if (rng.bool(0.75)) {
                        const c = rng.pick([
                            { go: 'cycle', s: [10, 12, 14, 15, 16, 18, 20], place: 'two villages' },
                            { go: 'walk', s: [3, 4, 5, 6], place: 'two campsites' },
                            { go: 'drive', s: [40, 50, 60, 70, 80, 90], place: 'two towns' },
                        ]);
                        let s1, s2, t, d;
                        do {
                            s1 = rng.pick(c.s); s2 = rng.pick(c.s); t = rng.int(2, 18) * 5;
                            d = (s1 + s2) * t / 60;
                        } while (s1 === s2 || !Number.isInteger(d));
                        return {
                            q: `${A} and ${B} live in ${c.place} ${d} km apart. At the same moment they set off along the same road towards each other: ${A} at ${s1} km/h and ${B} at ${s2} km/h. How many minutes later do they meet?`,
                            fig: roadFig('toward', A, B, `${s1} km/h`, `${s2} km/h`, `${d} km`),
                            ans: CA.num(t, 'min'),
                            sol: `Together they close the gap at ${s1} + ${s2} = ${s1 + s2} km/h. ` + m(R`t = \dfrac{${d}}{${s1 + s2}}\text{ h} = ${t}\text{ min}`) + '.',
                        };
                    }
                    let s1, s2;
                    do { s1 = rng.pick([3, 3.5, 4, 4.5, 5, 6, 7]); s2 = rng.pick([3, 3.5, 4, 4.5, 5, 6, 7, 8]); } while (s1 === s2 || !Number.isInteger(400 / (s1 + s2)));
                    const t = 400 / (s1 + s2);
                    return {
                        q: `${A} and ${B} start at the same point on a 400 m running track and run in opposite directions, ${A} at ${s1} m/s and ${B} at ${s2} m/s. After how many seconds do they first meet?`,
                        ans: CA.num(t, 's'),
                        sol: `Between them they must cover the whole 400 m lap, closing at ${s1} + ${s2} = ${s1 + s2} m/s. ${m(R`t = \dfrac{400}{${tx(s1 + s2)}} = ${tx(t)}`)} s.`,
                    };
                },
            },
            {
                id: 'catch-up', name: 'Catching up', level: 3,
                gen(rng) {
                    const [A, B] = two(rng);
                    const v = rng.int(0, 2);
                    if (v < 2) {
                        const c = v === 0
                            ? { a: [4, 5, 6], b: [10, 12, 15, 16, 18, 20], goA: 'walks', goB: 'cycles along the same path' }
                            : { a: [60, 70, 80, 90], b: [90, 100, 110, 120], goA: 'drives along a highway', goB: 'follows in a second car on the same road' };
                        let sa, sb, k, t;
                        do { sa = rng.pick(c.a); sb = rng.pick(c.b); k = rng.int(1, 8) * 5; t = sa * k / (sb - sa); } while (sb <= sa || !Number.isInteger(t) || t < 5 || t > 150 || !Number.isInteger(sa * k / 60 * 4));
                        const gap = sa * k / 60;
                        return {
                            q: `${A} ${c.goA} at ${sa} km/h. ${k} min later, ${B} ${c.goB} from the same starting point at ${sb} km/h. How many minutes after ${B} sets off does ${B} catch up with ${A}?`,
                            ans: CA.num(t, 'min'),
                            sol: `In ${k} min ${A} gets ${sa} × ${k}/60 = ${fx(gap)} km ahead. ${B} gains ${sb} − ${sa} = ${sb - sa} km/h, so ` + m(R`t = \dfrac{${tx(gap)}}{${sb - sa}}\text{ h} = ${t}\text{ min}`) + '.',
                        };
                    }
                    let s1, s2;
                    do { s1 = rng.pick([4, 4.5, 5, 5.5, 6]); s2 = rng.pick([5, 5.5, 6, 6.5, 7, 8]); } while (s2 <= s1 || !Number.isInteger(400 / (s2 - s1)));
                    const t = 400 / (s2 - s1);
                    return {
                        q: `${A} and ${B} start together on a 400 m track and run the same way, ${A} at ${s1} m/s and ${B} at ${s2} m/s. After how many seconds does ${B} first lap ${A} (get a whole lap ahead)?`,
                        ans: CA.num(t, 's'),
                        sol: `${B} gains ${s2} − ${s1} = ${fx(s2 - s1)} m every second and must gain 400 m: ${m(R`t = \dfrac{400}{${tx(s2 - s1)}} = ${tx(t)}`)} s.`,
                    };
                },
            },
            {
                id: 'round-trip', name: 'There and back at different speeds', level: 3,
                gen(rng) {
                    const name = rng.pick(NAMES);
                    const c = rng.pick([
                        { txt: (d, a, b) => `${name} cycles ${d} km up a hill at ${a} km/h and comes straight back down the same road at ${b} km/h.`, a: [6, 8, 9, 10, 12], b: [18, 20, 24, 30, 36] },
                        { txt: (d, a, b) => `A truck carries a heavy load ${d} km to a farm at ${a} km/h, then drives back empty along the same road at ${b} km/h.`, a: [40, 45, 48, 50], b: [60, 72, 75, 80, 90] },
                        { txt: (d, a, b) => `${name} jogs ${d} km out along a trail at ${a} km/h and walks back the same way at ${b} km/h.`, a: [8, 9, 10, 12], b: [4, 5, 6] },
                        { txt: (d, a, b) => `A rowing team rows ${d} km to an island at ${a} km/h and, tired, rows back at ${b} km/h.`, a: [8, 9, 10, 12], b: [5, 6] },
                    ]);
                    let a, b, d, t1, t2;
                    do {
                        a = rng.pick(c.a); b = rng.pick(c.b); d = rng.int(2, a > 30 ? 60 : 18);
                        t1 = d * 60 / a; t2 = d * 60 / b;
                    } while (!Number.isInteger(t1) || !Number.isInteger(t2) || t1 + t2 > 240);
                    const askDiff = rng.bool(0.35);
                    return {
                        q: `${c.txt(d, a, b)} ${askDiff ? 'How many minutes longer does the slower direction take?' : 'How many minutes does the round trip take?'}`,
                        ans: CA.num(askDiff ? Math.abs(t1 - t2) : t1 + t2, 'min'),
                        sol: `Out: ${hMin(d, a, t1)}. Back: ${hMin(d, b, t2)}. ` + (askDiff ? `Difference ${Math.max(t1, t2)} − ${Math.min(t1, t2)} = ${Math.abs(t1 - t2)} min.` : `Total ${t1} + ${t2} = ${t1 + t2} min.`),
                    };
                },
            },
            {
                id: 'wind-current', name: 'With and against a current or wind', level: 3,
                gen(rng) {
                    const v = rng.int(0, 2), name = rng.pick(NAMES);
                    let sp, w, d, up, dn;
                    const askDiff = rng.bool(0.4);
                    if (v === 0) {                                   // boat on a river, km/h
                        do { sp = rng.int(8, 20); w = rng.int(2, 6); d = rng.int(4, 30); up = d * 60 / (sp - w); dn = d * 60 / (sp + w); } while (3 * w > sp || !Number.isInteger(up) || !Number.isInteger(dn));
                        const q0 = `A boat moves at ${sp} km/h in still water. It goes ${d} km up a river against a ${w} km/h current, then ${d} km back down with the current.`;
                        return {
                            q: `${q0} ${askDiff ? 'How many minutes longer does the upstream part take?' : 'How many minutes does the whole trip take?'}`,
                            ans: CA.num(askDiff ? up - dn : up + dn, 'min'),
                            sol: `Upstream speed ${sp} − ${w} = ${sp - w} km/h: ${hMin(d, sp - w, up)}. Downstream ${sp} + ${w} = ${sp + w} km/h: ${hMin(d, sp + w, dn)}. ` + (askDiff ? `Difference ${up - dn} min.` : `Total ${up + dn} min.`),
                        };
                    }
                    if (v === 1) {                                   // plane with wind, km/h
                        do { sp = rng.int(10, 18) * 50; w = rng.int(2, 8) * 25; d = rng.int(4, 40) * 100; up = d * 60 / (sp - w); dn = d * 60 / (sp + w); } while (!Number.isInteger(up) || !Number.isInteger(dn) || up > 360);
                        const q0 = `A plane flies at ${sp} km/h in still air. It flies ${fx(d)} km into a ${w} km/h headwind, then ${fx(d)} km back with the wind behind it (a tailwind).`;
                        return {
                            q: `${q0} ${askDiff ? 'How many minutes longer is the flight into the headwind?' : 'How many minutes of flying is that altogether?'}`,
                            ans: CA.num(askDiff ? up - dn : up + dn, 'min'),
                            sol: `Headwind: ${sp} − ${w} = ${sp - w} km/h, ${hMin(d, sp - w, up)}. Tailwind: ${sp} + ${w} = ${sp + w} km/h, ${hMin(d, sp + w, dn)}. ` + (askDiff ? `Difference ${up - dn} min.` : `Total ${up + dn} min.`),
                        };
                    }
                    // swimmer in a river, m/s
                    do { sp = rng.pick([1, 1.2, 1.5, 2]); w = rng.pick([0.2, 0.3, 0.4, 0.5]); d = rng.int(2, 12) * 30; up = CA.round(d / (sp - w), 6); dn = CA.round(d / (sp + w), 6); } while (w >= sp - 0.4 || !Number.isInteger(up) || !Number.isInteger(dn));
                    return {
                        q: `${name} swims at ${sp} m/s in still water. In a river with a ${w} m/s current, ${name} swims ${d} m upstream to a buoy and ${d} m back. How many seconds does the whole swim take?`,
                        ans: CA.num(up + dn, 's'),
                        sol: `Upstream ${fx(sp)} − ${fx(w)} = ${fx(sp - w)} m/s: ${d} ÷ ${fx(sp - w)} = ${up} s. Downstream ${fx(sp + w)} m/s: ${d} ÷ ${fx(sp + w)} = ${dn} s. Total ${up + dn} s.`,
                    };
                },
            },
            {
                id: 'thunder', name: 'Lightning and thunder', level: 3,
                gen(rng) {
                    const v = rng.pick([0, 0, 1, 1, 2, 2, 3, 3, 4]), name = rng.pick(NAMES);
                    if (v === 0) {                                   // count → distance
                        const t = rng.int(2, 15), inKm = rng.bool(0.4);
                        return {
                            q: `${name} sees a flash of lightning and counts ${t} seconds before hearing the thunder. Sound travels at 340 m/s, and the light arrives almost instantly. How far away is the lightning, in ${inKm ? 'kilometres' : 'metres'}?`,
                            ans: CA.num(inKm ? 340 * t / 1000 : 340 * t, inKm ? 'km' : 'm'),
                            sol: `The ${t} s is the sound's travel time, so d = s × t = 340 × ${t} = ${fx(340 * t)} m${inKm ? ` = ${fx(340 * t / 1000)} km` : ''}.`,
                        };
                    }
                    if (v === 1) {                                   // distance → count
                        const t = rng.int(2, 24) / 2, d = 340 * t, inKm = rng.bool(0.5) && Number.isInteger(d / 10);
                        return {
                            q: `Lightning strikes ${inKm ? `${fx(d / 1000)} km` : `${fx(d)} m`} from ${name}. Sound travels at 340 m/s. How many seconds after the flash does ${name} hear the thunder?`,
                            ans: CA.num(t, 's'),
                            sol: (inKm ? `${fx(d / 1000)} km = ${fx(d)} m. ` : '') + `${tWork(d, 'm', 340, 'm/s', t, 's')}.`,
                        };
                    }
                    if (v === 2) {                                   // approaching storm, one count
                        let t, sp, tt;
                        do { t = rng.int(3, 15); sp = rng.pick([5, 8, 10, 12, 15, 17, 20]); tt = 340 * t / sp; } while (!Number.isInteger(tt));
                        return {
                            q: `${name} counts ${t} s between a lightning flash and its thunder (sound travels at 340 m/s). The storm is moving straight towards ${name} at ${sp} m/s. How many seconds until the storm is overhead?`,
                            ans: CA.num(tt, 's'),
                            sol: `Distance = 340 × ${t} = ${fx(340 * t)} m. ${tWork(340 * t, 'm', sp, 'm/s', tt, 's')}.`,
                        };
                    }
                    if (v === 3) {                                   // two counts some minutes apart
                        let t1, t2, gap, rest;
                        do { t1 = rng.int(6, 18); t2 = rng.int(2, t1 - 2); gap = rng.int(2, 10); rest = gap * t2 / (t1 - t2); } while (!Number.isInteger(rest) || rest > 40);
                        return {
                            q: `During a storm ${name} counts ${t1} s between a flash and its thunder. Exactly ${gap} min later the count is only ${t2} s. If the storm keeps moving straight towards ${name} at the same speed, how many more minutes until it is overhead?`,
                            ans: CA.num(rest, 'min'),
                            sol: `Each second of count is 340 m. In ${gap} min the storm came ${t1} − ${t2} = ${t1 - t2} "seconds" closer (${fx(340 * (t1 - t2))} m). It still has ${t2} "seconds" (${fx(340 * t2)} m) to go, which takes ${m(R`${gap}\times\dfrac{${t2}}{${t1 - t2}} = ${rest}`)} min.`,
                        };
                    }
                    return {
                        q: 'Why do we see a lightning flash before we hear its thunder?',
                        ans: CA.mc(rng, 'Light travels much faster than sound.', ['The thunder is made a few seconds after the flash.', 'Light and sound travel at the same speed, but eyes react faster than ears.', 'Sound slows down in the rain.']),
                        sol: 'The flash and thunder happen together. Light (300,000 km/s) arrives almost instantly; sound (about 340 m/s) takes about 3 s for every kilometre.',
                    };
                },
            },
        ],

        assignment: [
            ['find-time', 6], ['convert-units', 5], ['time-ideas', 4],
            ['time-in-minutes', 4], ['journey-stop', 4], ['clock-times', 4], ['compare-journeys', 3], ['graph-read', 2], ['graph-speed', 2], ['light-sound', 4],
            ['meeting', 2], ['catch-up', 3], ['round-trip', 2], ['wind-current', 2], ['thunder', 3],
        ],
    });
})();
