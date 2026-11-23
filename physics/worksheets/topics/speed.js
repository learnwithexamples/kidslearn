/* Worksheet: Speed — s = d/t, rearranging it, unit changes (× 3.6), average speed,
 * comparing speeds, distance–time graphs, and catching-up / meeting problems. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, F = CA.fig, C = F.colors;

    // ── Small helpers ────────────────────────────────────────────────────
    /** A number for TeX: 150000000 → 150{,}000{,}000, 2.5 → 2.5. */
    const tn = x => {
        const s = CA.tex.num(x), [i, f] = s.split('.');
        const g = Math.abs(x) >= 10000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '{,}') : i;
        return f ? `${g}.${f}` : g;
    };
    /** A number for plain text: 150000000 → 150,000,000. */
    const tx = x => { const s = CA.tex.num(x), [i, f] = s.split('.'); const g = Math.abs(x) >= 10000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : i; return f ? `${g}.${f}` : g; };
    /** A number answer that shows big numbers with commas. */
    const ansN = (x, unit, opts = {}) => CA.num(x, unit, { ...opts, show: m(tn(x)) });
    /** Integer from lo to hi in steps. */
    const step = (rng, lo, hi, s = 1) => lo + s * rng.int(0, Math.round((hi - lo) / s));
    const isInt = x => Math.abs(x - Math.round(x)) < 1e-9;
    const isNice = (x, dp) => isInt(x * 10 ** dp);
    const fix = x => CA.round(x, 6);                     // kill floating-point dust
    const hrs = h => (h === 1 ? '1 hour' : `${tx(h)} hours`);
    const mins = n => (n === 1 ? '1 minute' : `${tx(n)} minutes`);
    const NAMES = ['Ava', 'Ben', 'Chloe', 'Dev', 'Ella', 'Finn', 'Grace', 'Hugo', 'Isla', 'Jack', 'Kai', 'Lily', 'Maya', 'Noah', 'Omar', 'Priya', 'Sam', 'Tara', 'Leo', 'Zoe'];
    /** 12-hour clock from minutes after midnight. */
    const clock = t => { const h = Math.floor(t / 60) % 24, mm = t % 60; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'a.m.' : 'p.m.'}`; };

    // Movers for the one-step formula problems: speed range (step), time range (step), units.
    const MOVERS = [
        { a: 'A cyclist', the: 'the cyclist', verb: 'rides', s: [4, 12, 1], t: [20, 120, 10], u: 'ms' },
        { a: 'A sprinter', the: 'the sprinter', verb: 'runs', s: [6, 10, 1], t: [5, 20, 1], u: 'ms' },
        { a: 'A cheetah', the: 'the cheetah', verb: 'runs', s: [20, 30, 1], t: [3, 12, 1], u: 'ms' },
        { a: 'A swimmer', the: 'the swimmer', verb: 'swims', s: [1, 2, 1], t: [25, 200, 5], u: 'ms' },
        { a: 'A skateboarder', the: 'the skateboarder', verb: 'rolls', s: [3, 7, 1], t: [10, 60, 5], u: 'ms' },
        { a: 'A galloping horse', the: 'the horse', verb: 'covers', s: [10, 18, 1], t: [10, 60, 5], u: 'ms' },
        { a: 'An eagle', the: 'the eagle', verb: 'flies', s: [15, 30, 1], t: [5, 30, 1], u: 'ms' },
        { a: 'A car', the: 'the car', verb: 'drives', s: [40, 110, 5], t: [2, 5, 1], u: 'kmh' },
        { a: 'A train', the: 'the train', verb: 'travels', s: [80, 200, 10], t: [2, 6, 1], u: 'kmh' },
        { a: 'A plane', the: 'the plane', verb: 'flies', s: [600, 900, 50], t: [2, 9, 1], u: 'kmh' },
        { a: 'A ferry', the: 'the ferry', verb: 'sails', s: [20, 40, 2], t: [2, 8, 1], u: 'kmh' },
        { a: 'A truck', the: 'the truck', verb: 'drives', s: [50, 90, 5], t: [2, 6, 1], u: 'kmh' },
    ];
    const U = { ms: { d: 'm', t: 's', s: 'm/s', tw: n => (n === 1 ? '1 second' : `${tx(n)} seconds`) }, kmh: { d: 'km', t: 'h', s: 'km/h', tw: hrs } };

    // ── Distance–time graph ──────────────────────────────────────────────
    const GRID = '#cbd5e0';
    /** Text with a white halo, readable on top of lines. */
    const htext = (x, y, s, opt = {}) => F.text(x, y, s, opt).replace('stroke="none"', 'stroke="#ffffff" stroke-width="3" paint-order="stroke"');
    /**
     * o: { nT, tc, nD, dc, tU, dU, lines: [{ pts: [[t, d], …], color, label?, segs?: ['A', …] }] }
     * Every corner of every line is a grid point so values can be read exactly.
     */
    function dtGraph(o) {
        const W = 290, H = 206, L = 50, Rt = 14, Tp = 20, B = 38;
        const pw = W - L - Rt, ph = H - Tp - B, cw = pw / o.nT, chh = ph / o.nD;
        const X = t => L + (t / o.tc) * cw, Y = d => Tp + ph - (d / o.dc) * chh;
        let b = '';
        for (let i = 0; i <= o.nT; i++) {
            const x = L + i * cw;
            if (i) b += F.line(x, Tp, x, Tp + ph, { stroke: GRID, width: 0.8 });
            b += F.text(x, Tp + ph + 13, tx(i * o.tc), { size: 10 });
        }
        for (let j = 0; j <= o.nD; j++) {
            const y = Tp + ph - j * chh;
            if (j) b += F.line(L, y, L + pw, y, { stroke: GRID, width: 0.8 });
            b += F.text(L - 5, y + 3.5, tx(j * o.dc), { size: 10, anchor: 'end' });
        }
        b += F.line(L, Tp + ph, L + pw, Tp + ph) + F.line(L, Tp, L, Tp + ph);
        b += F.text(L + pw / 2, H - 6, `Time (${o.tU})`, { size: 11 });
        const yx = 11, yy = Tp + ph / 2;
        b += `<text x="${yx}" y="${yy}" transform="rotate(-90 ${yx} ${yy})" text-anchor="middle" fill="${C.INK}" stroke="none" font-size="11">Distance (${o.dU})</text>`;
        for (const ln of o.lines) {
            const P = ln.pts.map(([t, d]) => [X(t), Y(d)]);
            b += F.poly(P, { open: true, stroke: ln.color, width: 2.2 });
            ln.pts.forEach(([t, d], i) => { if (ln.dots !== false && (i < ln.pts.length - 1 || !ln.openEnd)) b += F.dot(X(t), Y(d), { r: 2.6, fill: ln.color }); });
            if (ln.segs) for (let i = 0; i + 1 < P.length; i++) {
                const [x1, y1] = P[i], [x2, y2] = P[i + 1], dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
                const nx = dy / len, ny = -dx / len;   // up-left side of the line
                b += htext((x1 + x2) / 2 + nx * 10, (y1 + y2) / 2 + ny * 10 + 4, ln.segs[i], { size: 12, bold: true, fill: ln.color });
            }
            if (ln.label) {
                const [lx, ly] = P[ln.labelAt != null ? ln.labelAt : P.length - 1];
                const right = lx > L + pw - 40;
                b += htext(lx + (right ? -6 : 6), ly + (ln.labelBelow ? 14 : -6), ln.label, { size: 11, bold: true, fill: ln.color, anchor: right ? 'end' : 'start' });
            }
        }
        return F.svg(W, H, b, { label: 'distance–time graph' });
    }
    // Unit systems for graphs. factor turns (distance unit ÷ time unit) into the speed unit.
    const GU = {
        ms: { tU: 's', dU: 'm', sU: 'm/s', tcs: [1, 2, 5, 10], dcs: [5, 10, 20, 25, 50, 100], factor: 1,
            ctx: [['a runner', 2, 9], ['a cyclist', 3, 12], ['a dog', 3, 15], ['a horse', 5, 18], ['a skateboarder', 2, 8], ['a remote-control car', 2, 10]] },
        kmh: { tU: 'h', dU: 'km', sU: 'km/h', tcs: [1], dcs: [10, 20, 25, 30, 40, 50, 100], factor: 1,
            ctx: [['a car', 40, 120], ['a train', 60, 200], ['a bus', 30, 80], ['a truck', 40, 100]] },
        kmmin: { tU: 'min', dU: 'km', sU: 'km/h', tcs: [5, 10, 15], dcs: [1, 2, 5], factor: 60,
            ctx: [['a cyclist', 10, 30], ['a jogger', 6, 15], ['a bus', 20, 60], ['a tram', 15, 40]] },
    };
    const spd = (g, dd, dt) => fix(dd / dt * g.factor);
    /** Sol text for a speed read from a graph. */
    const solSpeed = (g, dd, dt) => g.factor === 60
        ? R`\(s = \dfrac{d}{t} = \dfrac{${tn(dd)}\text{ km}}{${tn(dt)}\text{ min}}\); there are 60 minutes in an hour, so \(s = \dfrac{${tn(dd)}}{${tn(dt)}}\times 60 = ${tn(spd(g, dd, dt))}\) km/h`
        : R`\(s = \dfrac{d}{t} = \dfrac{${tn(dd)}}{${tn(dt)}} = ${tn(spd(g, dd, dt))}\) ${g.sU}`;

    CA.register({
        id: 'speed',
        title: 'Speed',
        page: 'speed.html',
        subject: 'Physics',
        assignmentNote: 'Use speed = distance ÷ time, s = d/t (so d = s × t and t = d ÷ s). Give every answer in the unit the question asks for. m/s × 3.6 = km/h and km/h ÷ 3.6 = m/s. Round only when the question says so. Sound in air travels at 340 m/s and light at 300,000 km/s.',

        practice: [
            // ── Level 1: the formula ─────────────────────────────────────
            {
                id: 'find-speed', name: 'Find the speed', level: 1,
                gen(rng) {
                    const M = rng.pick(MOVERS), u = U[M.u];
                    const s = step(rng, ...M.s), t = step(rng, ...M.t), d = s * t;
                    const q = rng.bool()
                        ? `${M.a} ${M.verb} ${tx(d)} ${u.d} in ${u.tw(t)}. What is ${M.the}'s speed in ${u.s}?`
                        : `It takes ${M.the} ${u.tw(t)} to cover ${tx(d)} ${u.d}. Find the average speed in ${u.s}.`;
                    return { q, ans: ansN(s, u.s), sol: R`\(s = \dfrac{d}{t} = \dfrac{${tn(d)}}{${t}} = ${s}\) ${u.s}.` };
                },
            },
            {
                id: 'find-distance', name: 'Find the distance', level: 1,
                gen(rng) {
                    const M = rng.pick(MOVERS), u = U[M.u];
                    let s = step(rng, ...M.s), t = step(rng, ...M.t);
                    if (M.u === 'kmh' && rng.bool(0.3) && s % 2 === 0) t += 0.5;        // half hours
                    const d = fix(s * t);
                    const q = rng.bool()
                        ? `${M.a} ${M.verb} at a steady ${s} ${u.s} for ${u.tw(t)}. How far does ${M.the} go, in ${u.d}?`
                        : `${M.the[0].toUpperCase() + M.the.slice(1)} keeps a constant speed of ${s} ${u.s}. What distance is covered in ${u.tw(t)}? Answer in ${u.d}.`;
                    return { q, ans: ansN(d, u.d), sol: R`\(d = s\times t = ${s}\times ${tn(t)} = ${tn(d)}\) ${u.d}.` };
                },
            },
            {
                id: 'find-time', name: 'Find the time', level: 1,
                gen(rng) {
                    const M = rng.pick(MOVERS), u = U[M.u];
                    const s = step(rng, ...M.s), t = step(rng, ...M.t), d = s * t;
                    const unitT = M.u === 'ms' ? 'seconds' : 'hours';
                    const q = rng.bool()
                        ? `${M.a} ${M.verb} at ${s} ${u.s}. How long, in ${unitT}, does ${M.the} take to cover ${tx(d)} ${u.d}?`
                        : `How many ${unitT} does it take ${M.the} to travel ${tx(d)} ${u.d} at a steady ${s} ${u.s}?`;
                    return { q, ans: ansN(t, u.t), sol: R`\(t = \dfrac{d}{s} = \dfrac{${tn(d)}}{${s}} = ${t}\) ${u.t}.` };
                },
            },
            {
                id: 'speed-ideas', name: 'Speed ideas', level: 1,
                gen(rng) {
                    const k = rng.int(0, 6);
                    const [p1, p2] = rng.sample(NAMES, 2);
                    if (k === 0) {
                        const good = rng.pick(['m/s', 'km/h']);
                        const pool = ['m', 'km', 's', 'h', 'kg', 'm × s', 'km × h', 'min'];
                        return {
                            q: `Which of these units could be used to measure a speed?`,
                            ans: CA.mc(rng, good, rng.sample(pool, 3)),
                            sol: `Speed is distance ÷ time, so its unit is a distance unit divided by a time unit, such as ${good}.`,
                        };
                    }
                    if (k === 1) {
                        const dist = rng.pick([60, 80, 100, 150, 200, 400]), ta = Math.round(dist / rng.int(4, 8)), tb = ta + rng.int(1, 6);
                        const [fast, slow] = rng.bool() ? [p1, p2] : [p2, p1];
                        const tf = ta, ts = tb;
                        return {
                            q: `${p1} and ${p2} race ${dist} m to the same tree. ${fast} takes ${tf} s and ${slow} takes ${ts} s. Who had the higher average speed?`,
                            ans: CA.mc(rng, fast, [slow, 'They had the same speed', 'You cannot tell without knowing their sizes']),
                            sol: `They ran the same distance, so the one who took less time (${fast}, ${tf} s) was faster.`,
                        };
                    }
                    if (k === 2) {
                        const v = rng.int(2, 30), dir = rng.pick(['north', 'south', 'east', 'west']);
                        return {
                            q: `Which of these is a velocity, not just a speed?`,
                            ans: CA.mc(rng, `${v} m/s toward the ${dir}`, [`${v} m/s`, `${v} m toward the ${dir}`, `${v} km/h`]),
                            sol: `A velocity gives how fast and which way: ${v} m/s toward the ${dir}. "${v} m toward the ${dir}" is a distance, not a speed.`,
                        };
                    }
                    if (k === 3) {
                        const v = rng.int(2, 25), u = rng.pick(['m/s', 'km/h']), [dU, tU] = u === 'm/s' ? ['metres', 'second'] : ['kilometres', 'hour'];
                        return {
                            q: `A scooter moves at a steady ${v} ${u}. What does this mean?`,
                            ans: CA.mc(rng, `It moves ${v} ${dU} every ${tU}`, [`It moves 1 ${dU.slice(0, -1)} every ${v} ${tU}s`, `It moves ${v} ${dU} in total`, `It takes ${v} ${tU}s to start`]),
                            sol: `Speed is distance per unit of time: ${v} ${u} means ${v} ${dU} are covered in each ${tU}.`,
                        };
                    }
                    if (k === 4) {
                        const f = rng.pick([['twice', 'doubles', 'halves'], ['three times', 'triples', 'becomes a third']]);
                        const v = rng.int(3, 20);
                        return {
                            q: `${p1} cycles at a steady ${v} km/h. If ${p1} keeps the same speed but rides for ${f[0]} as long, the distance covered…`,
                            ans: CA.mc(rng, f[1], [f[2], 'stays the same', 'goes up by 1 km']),
                            sol: `\\(d = s\\times t\\): with the same speed, ${f[0]} the time gives ${f[0]} the distance.`,
                        };
                    }
                    if (k === 5) {
                        const d = rng.pick([60, 100, 120, 200, 240, 300, 400]), t = d / rng.pick([1, 1.5, 2, 2.5]);
                        if (!isInt(t / 2)) return this.gen(rng);
                        return {
                            q: `${p1} walks ${d} m in ${t} s. ${p2} jogs the same ${d} m in ${t / 2} s. Compared with ${p1}, ${p2}'s speed is…`,
                            ans: CA.mc(rng, 'twice as fast', ['half as fast', 'the same', 'four times as fast']),
                            sol: `Same distance in half the time, so \\(s = \\frac{d}{t}\\) is twice as big: ${CA.round(d / t, 2)} m/s vs ${CA.round(2 * d / t, 2)} m/s.`,
                        };
                    }
                    const v = rng.int(2, 30);
                    const what = rng.pick(['a parked bicycle', 'a sleeping cat', 'a car waiting at a red light', 'a statue']);
                    return {
                        q: `What is the speed of ${what}? (${p1} says it is ${v} m/s because it is ${v} m from the door.)`,
                        ans: CA.mc(rng, '0 m/s', [`${v} m/s`, `${v * 2} m/s`, '1 m/s']),
                        sol: `It is not moving, so it covers no distance: speed \\(= 0 \\div t = 0\\) m/s. Its position does not change its speed.`,
                    };
                },
            },

            // ── Level 2: core ────────────────────────────────────────────
            {
                id: 'convert-units', name: 'm/s ↔ km/h', level: 2,
                gen(rng) {
                    const k = rng.int(0, 2);
                    if (k === 0) {
                        const [what, verb, lo, hi, st] = rng.pick([['A sprinter', 'runs at', 7, 11, 0.5], ['A cheetah', 'runs at', 20, 30, 1], ['A hawk', 'dives at', 30, 60, 5], ['A cyclist', 'rides at', 4, 12, 0.5], ['A racing car', 'drives at', 60, 90, 5], ['A swimmer', 'swims at', 1, 2.5, 0.5], ['A hurricane wind', 'blows at', 35, 70, 5], ['A walker', 'walks at', 1, 2, 0.5]]);
                        const v = lo + st * rng.int(0, Math.round((hi - lo) / st)), kk = fix(v * 3.6);
                        return { q: `${what} ${verb} ${tn(v)} m/s. What is this speed in km/h?`, ans: CA.num(kk, 'km/h'), sol: R`1 m/s = 3600 m per hour = 3.6 km/h, so multiply by 3.6: \(${tn(v)}\times 3.6 = ${tn(kk)}\) km/h.` };
                    }
                    if (k === 1) {
                        const [what, verb, opts] = rng.pick([['A car', 'drives at', [36, 54, 72, 90, 108]], ['A train', 'travels at', [108, 144, 180, 216, 252, 288]], ['A cyclist', 'rides at', [18, 27, 36]], ['A horse', 'gallops at', [36, 45, 54, 63]], ['A plane', 'cruises at', [720, 792, 864, 900]], ['A scooter', 'goes at', [18, 27, 36, 45]], ['A dolphin', 'swims at', [18, 27, 36, 54]]]);
                        const kk = rng.pick(opts), v = fix(kk / 3.6);
                        return { q: `${what} ${verb} ${kk} km/h. What is this speed in m/s?`, ans: CA.num(v, 'm/s'), sol: R`Divide by 3.6: \(${kk}\div 3.6 = ${tn(v)}\) m/s.` };
                    }
                    const [what, verb, opts] = rng.pick([['A car on the highway', 'drives at', [100, 110, 120, 80, 60, 50]], ['A bus', 'drives at', [40, 50, 60, 70]], ['A high-speed train', 'travels at', [250, 300, 320, 350]], ['A person', 'walks at', [4, 5, 6]], ['A runner', 'runs at', [10, 12, 15, 20]], ['A jet plane', 'flies at', [800, 850, 900, 950]]]);
                    const kk = rng.pick(opts), v = CA.round(kk / 3.6, 1);
                    return { q: `${what} ${verb} ${kk} km/h. What is this in m/s? Give your answer to 1 decimal place.`, ans: CA.num(v, 'm/s', { tol: 0.06 }), sol: R`Divide by 3.6: \(${kk}\div 3.6 = ${tn(CA.round(kk / 3.6, 3))}\ldots \approx ${tn(v)}\) m/s.` };
                },
            },
            {
                id: 'minutes-hours', name: 'Minutes and hours', level: 2,
                gen(rng) {
                    const [who, lo, hi] = rng.pick([['A bus', 24, 60], ['A cyclist', 12, 30], ['A ferry', 18, 40], ['A jogger', 6, 12], ['A train', 60, 150], ['A horse rider', 10, 24], ['A delivery van', 30, 72]]);
                    const k = rng.int(0, 2);
                    for (;;) {
                        const s = rng.int(lo, hi), t = rng.pick([10, 12, 15, 20, 24, 30, 36, 40, 45, 48, 50, 75, 90]), d = fix(s * t / 60);
                        if (!isNice(d, 1) || d < 1) continue;
                        if (k === 0) return { q: `${who} travels ${tn(d)} km in ${t} minutes. What is its average speed in km/h?`, ans: CA.num(s, 'km/h'), sol: R`${t} min \(= \dfrac{${t}}{60}\) h, so \(s = ${tn(d)}\div\dfrac{${t}}{60} = \dfrac{${tn(d)}\times 60}{${t}} = ${s}\) km/h.` };
                        if (k === 1) return { q: `${who} moves at a steady ${s} km/h for ${t} minutes. How many kilometres does it travel?`, ans: CA.num(d, 'km'), sol: R`${t} min \(= \dfrac{${t}}{60}\) h, so \(d = ${s}\times\dfrac{${t}}{60} = ${tn(d)}\) km.` };
                        return { q: `${who} travels ${tn(d)} km at a steady ${s} km/h. How many minutes does the trip take?`, ans: CA.num(t, 'min'), sol: R`\(t = \dfrac{d}{s} = \dfrac{${tn(d)}}{${s}}\) h; times 60 gives \(${tn(fix(d / s))}\times 60 = ${t}\) minutes.` };
                    }
                },
            },
            {
                id: 'mixed-units', name: 'Mixed units to m/s', level: 2,
                gen(rng) {
                    const [who, verb, lo, hi] = rng.pick([['A runner', 'runs', 3, 6], ['A cyclist', 'rides', 4, 10], ['A rowing boat', 'rows', 2, 5], ['A rollerblader', 'skates', 3, 7], ['A drone', 'flies', 5, 15], ['A cross-country skier', 'skis', 3, 7]]);
                    const k = rng.int(0, 2);
                    for (;;) {
                        const s = rng.int(lo, hi), mn = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30]), dm = s * 60 * mn, dk = dm / 1000;
                        if (k === 0) {
                            if (!isNice(dk, 1)) continue;
                            return { q: `${who} ${verb} ${tn(dk)} km in ${mins(mn)}. What is the average speed in m/s?`, ans: CA.num(s, 'm/s'), sol: R`Change to metres and seconds: \(${tn(dk)}\) km \(= ${tn(dm)}\) m and ${mn} min \(= ${mn * 60}\) s. So \(s = \dfrac{${tn(dm)}}{${mn * 60}} = ${s}\) m/s.` };
                        }
                        if (k === 1) {
                            if (dm > 9000) continue;
                            return { q: `${who} ${verb} ${tx(dm)} m in ${mins(mn)}. What is the average speed in m/s?`, ans: CA.num(s, 'm/s'), sol: R`${mn} min \(= ${mn * 60}\) s, so \(s = \dfrac{${tn(dm)}}{${mn * 60}} = ${s}\) m/s.` };
                        }
                        if (!isNice(dk, 2)) continue;
                        return { q: `${who} keeps a steady ${s} m/s for ${mins(mn)}. How far is that in kilometres?`, ans: CA.num(dk, 'km'), sol: R`${mn} min \(= ${mn * 60}\) s, so \(d = ${s}\times ${mn * 60} = ${tn(dm)}\) m \(= ${tn(dk)}\) km.` };
                    }
                },
            },
            {
                id: 'average-two-parts', name: 'Average speed of a trip', level: 2,
                gen(rng) {
                    const k = rng.int(0, 2);
                    const [who, u] = rng.pick([['A car', 'kmh'], ['A coach', 'kmh'], ['A family on a road trip', 'kmh'], ['A cyclist', 'ms'], ['A runner', 'ms'], ['A rower', 'ms']]);
                    const uu = U[u];
                    for (;;) {
                        if (k === 0) {
                            const t1 = u === 'kmh' ? rng.int(1, 4) : rng.int(2, 12) * 10, t2 = u === 'kmh' ? rng.int(1, 4) : rng.int(2, 12) * 10;
                            const v1 = u === 'kmh' ? step(rng, 30, 110, 10) : rng.int(2, 9), v2 = u === 'kmh' ? step(rng, 30, 110, 10) : rng.int(2, 9);
                            const d1 = v1 * t1, d2 = v2 * t2, avg = fix((d1 + d2) / (t1 + t2));
                            if (v1 === v2 || !isInt(avg)) continue;
                            return { q: `${who} goes ${tx(d1)} ${uu.d} in ${uu.tw(t1)}, then ${tx(d2)} ${uu.d} in ${uu.tw(t2)}. What is its average speed for the whole trip, in ${uu.s}?`, ans: CA.num(avg, uu.s), sol: R`Average speed \(= \dfrac{\text{total distance}}{\text{total time}} = \dfrac{${d1} + ${d2}}{${t1} + ${t2}} = \dfrac{${d1 + d2}}{${t1 + t2}} = ${avg}\) ${uu.s}.` };
                        }
                        if (k === 1) {
                            const t1 = u === 'kmh' ? rng.int(1, 4) : rng.int(2, 12) * 10, t2 = u === 'kmh' ? rng.int(1, 4) : rng.int(2, 12) * 10;
                            const v1 = u === 'kmh' ? step(rng, 30, 110, 10) : rng.int(2, 9), v2 = u === 'kmh' ? step(rng, 30, 110, 10) : rng.int(2, 9);
                            const avg = fix((v1 * t1 + v2 * t2) / (t1 + t2));
                            if (v1 === v2 || t1 === t2 || !isInt(avg)) continue;
                            return { q: `${who} travels at ${v1} ${uu.s} for ${uu.tw(t1)}, then at ${v2} ${uu.s} for ${uu.tw(t2)}. What is its average speed for the whole trip, in ${uu.s}?`, ans: CA.num(avg, uu.s), sol: R`Distances: \(${v1}\times${t1} = ${v1 * t1}\) and \(${v2}\times${t2} = ${v2 * t2}\). Average \(= \dfrac{${v1 * t1 + v2 * t2}}{${t1 + t2}} = ${avg}\) ${uu.s}.` };
                        }
                        // with a stop
                        const t1 = u === 'kmh' ? rng.int(1, 3) : rng.int(2, 10) * 10, t2 = u === 'kmh' ? rng.int(1, 3) : rng.int(2, 10) * 10, t0 = u === 'kmh' ? rng.int(1, 2) : rng.int(1, 6) * 10;
                        const v1 = u === 'kmh' ? step(rng, 40, 120, 10) : rng.int(3, 10), v2 = u === 'kmh' ? step(rng, 40, 120, 10) : rng.int(3, 10);
                        const d1 = v1 * t1, d2 = v2 * t2, T = t1 + t0 + t2, avg = fix((d1 + d2) / T);
                        if (!isInt(avg)) continue;
                        const stop = u === 'kmh' ? `stops for ${hrs(t0)}` : `rests for ${t0} seconds`;
                        return { q: `${who} goes ${tx(d1)} ${uu.d} in ${uu.tw(t1)}, ${stop}, then goes ${tx(d2)} ${uu.d} in ${uu.tw(t2)}. What is the average speed for the whole trip (including the stop), in ${uu.s}?`, ans: CA.num(avg, uu.s), sol: R`The stop counts as time: total time \(= ${t1} + ${t0} + ${t2} = ${T}\). Average \(= \dfrac{${d1} + ${d2}}{${T}} = \dfrac{${d1 + d2}}{${T}} = ${avg}\) ${uu.s}.` };
                    }
                },
            },
            {
                id: 'compare-speeds', name: 'Comparing speeds', level: 2,
                gen(rng) {
                    const SETS = [
                        [['cheetah', 25, 31], ['racehorse', 15, 19], ['greyhound', 16, 19], ['ostrich', 17, 20], ['lion', 20, 23], ['kangaroo', 12, 15]],
                        [['scooter', 5, 8], ['cyclist', 6, 10], ['skateboarder', 3, 6], ['runner', 4, 7], ['rollerblader', 4, 7], ['horse and cart', 3, 5]],
                        [['car', 20, 33], ['train', 30, 50], ['bus', 12, 20], ['motorbike', 22, 34], ['speedboat', 15, 25], ['truck', 18, 27]],
                    ];
                    const set = rng.pick(SETS);
                    if (rng.bool(0.35)) {
                        // How much faster: A in m/s, B in km/h (a multiple of 18 so it converts exactly)
                        for (;;) {
                            const [a, b] = rng.sample(set, 2);
                            const va = rng.int(a[1], a[2]), vb5 = 5 * rng.int(Math.ceil(b[1] / 5), Math.floor(b[2] / 5));
                            if (vb5 <= 0 || va <= vb5) continue;
                            const kb = fix(vb5 * 3.6);
                            return { q: `A ${a[0]} moves at ${va} m/s and a ${b[0]} moves at ${tn(kb)} km/h. How many m/s faster is the ${a[0]}?`, ans: CA.num(va - vb5, 'm/s'), sol: R`Same units first: \(${tn(kb)}\div 3.6 = ${vb5}\) m/s. Difference \(= ${va} - ${vb5} = ${va - vb5}\) m/s.` };
                        }
                    }
                    for (;;) {
                        const items = rng.sample(set, 3);
                        const fmts = rng.shuffle(['ms', 'kmh', 'dt']);
                        const shown = [], v = [];
                        items.forEach((it, i) => {
                            const f = fmts[i];
                            if (f === 'ms') { const x = rng.int(it[1], it[2]); v.push(x); shown.push(`the ${it[0]} moves at ${x} m/s`); }
                            else if (f === 'kmh') { const kk = rng.int(Math.ceil(it[1] * 3.6), Math.floor(it[2] * 3.6)); v.push(kk / 3.6); shown.push(`the ${it[0]} moves at ${kk} km/h`); }
                            else { const t = rng.pick([4, 5, 8, 10, 20, 25, 40, 50]), x = rng.int(it[1], it[2]), d = x * t; v.push(x); shown.push(`the ${it[0]} covers ${d} m in ${t} s`); }
                        });
                        const order = v.map((x, i) => i).sort((i, j) => v[j] - v[i]);
                        if (v[order[0]] < v[order[1]] * 1.04) continue;
                        const best = items[order[0]][0];
                        const kmIdx = fmts.indexOf('kmh');
                        if (order[0] === kmIdx && rng.bool(0.7)) continue;            // usually make the big km/h number a trap
                        const list = 'Compare these speeds: ' + shown.join('; ');
                        const ms = v.map(x => tn(CA.round(x, 1)));
                        return {
                            q: `${list}. Which one is fastest?`,
                            ans: CA.mc(rng, `the ${best}`, items.filter(it => it[0] !== best).map(it => `the ${it[0]}`).concat(['they all have the same speed'])),
                            sol: `Change all to m/s (km/h ÷ 3.6, or distance ÷ time): ${items.map((it, i) => `${it[0]} ≈ ${ms[i]} m/s`).join(', ')}. The ${best} is fastest.`,
                        };
                    }
                },
            },
            {
                id: 'graph-speed', name: 'Speed from a distance–time graph', level: 2,
                gen(rng) {
                    const g = GU[rng.pick(['ms', 'ms', 'kmh', 'kmmin'])];
                    const [who, lo, hi] = rng.pick(g.ctx);
                    const k = rng.int(0, 2);
                    for (;;) {
                        const tc = rng.pick(g.tcs), dc = rng.pick(g.dcs), ki = rng.int(3, 6), ji = rng.int(3, 6);
                        const T = ki * tc, D = ji * dc, v = spd(g, D, T);
                        if (!isInt(v) || v < lo || v > hi) continue;
                        const fig = dtGraph({ nT: 6, tc, nD: 6, dc, tU: g.tU, dU: g.dU, lines: [{ pts: [[0, 0], [T, D]], color: C.ACCENT }] });
                        const intro = `The graph shows ${who} moving at a steady speed.`;
                        if (k === 0) return { q: `${intro} What is its speed in ${g.sU}?`, fig, ans: CA.num(v, g.sU), sol: `Read a point on the line: ${tx(D)} ${g.dU} at ${tx(T)} ${g.tU}. ${solSpeed(g, D, T)}.` };
                        if (k === 1) {
                            const T2 = g.tU === 's' ? rng.pick([30, 45, 60, 90, 120]) : g.tU === 'h' ? rng.pick([7, 8, 9, 10]) : rng.pick([90, 120, 150, 180]);
                            const d2 = fix(v / g.factor * T2);
                            if (!isNice(d2, 1) || T2 <= T) continue;
                            return { q: `${intro} If it kept going at the same speed, how far would it travel in ${g.tU === 's' ? `${T2} seconds` : g.tU === 'h' ? hrs(T2) : mins(T2)}? Answer in ${g.dU}.`, fig, ans: CA.num(d2, g.dU), sol: `${solSpeed(g, D, T)}. ${g.factor === 60 ? R`In ${T2} min \(= ${tn(T2 / 60)}\) h it goes \(${v}\times ${tn(T2 / 60)} = ${tn(d2)}\) km.` : R`\(d = s\times t = ${v}\times ${T2} = ${tn(d2)}\) ${g.dU}.`}` };
                        }
                        const D2 = g.dU === 'm' ? rng.pick([300, 400, 500, 600, 800, 1000, 1200]) : g.tU === 'h' ? rng.pick([240, 300, 360, 400, 450, 480, 600]) : rng.pick([10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60]);
                        if (D2 <= D) continue;
                        const t2 = fix(D2 / v * g.factor);
                        if (!isInt(t2) || (g.tU === 'min' && t2 > 240) || (g.tU === 'h' && t2 > 12)) continue;
                        const tUw = g.tU === 's' ? 'seconds' : g.tU === 'h' ? 'hours' : 'minutes';
                        return { q: `${intro} At the same speed, how many ${tUw} would it take to travel ${tx(D2)} ${g.dU}?`, fig, ans: CA.num(t2, g.tU), sol: `${solSpeed(g, D, T)}. ${g.factor === 60 ? R`\(t = \dfrac{${D2}}{${v}}\) h \(= ${tn(t2)}\) min.` : R`\(t = \dfrac{d}{s} = \dfrac{${D2}}{${v}} = ${tn(t2)}\) ${g.tU}.`}` };
                    }
                },
            },
            {
                id: 'graph-parts', name: 'Graphs with stops', level: 2,
                gen(rng) {
                    const g = GU[rng.pick(['ms', 'kmh', 'kmmin'])];
                    const [who, lo, hi] = rng.pick(g.ctx);
                    const k = rng.int(0, 3);
                    for (;;) {
                        const tc = rng.pick(g.tcs), dc = rng.pick(g.dcs);
                        const dur = [rng.int(1, 3), rng.int(1, 2), rng.int(1, 3)];
                        const flat = rng.bool(0.75) ? 1 : 2;
                        const rise = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)]; rise[flat] = 0;
                        const nT = dur[0] + dur[1] + dur[2], nD = rise[0] + rise[1] + rise[2];
                        if (nT > 6 || nT < 4 || nD > 6 || nD < 3) continue;
                        const v = dur.map((dd, i) => spd(g, rise[i] * dc, dd * tc));
                        const mv = [0, 1, 2].filter(i => i !== flat);
                        if (!mv.every(i => isInt(v[i]) && v[i] >= lo && v[i] <= hi) || v[mv[0]] === v[mv[1]]) continue;
                        const pts = [[0, 0]];
                        for (let i = 0; i < 3; i++) pts.push([pts[i][0] + dur[i] * tc, pts[i][1] + rise[i] * dc]);
                        const fig = dtGraph({ nT: 6, tc, nD: Math.max(nD, 4), dc, tU: g.tU, dU: g.dU, lines: [{ pts, color: C.ACCENT, segs: ['A', 'B', 'C'] }] });
                        const intro = `The graph shows a journey by ${who} in three parts, A, B and C.`;
                        const P = 'ABC';
                        if (k === 0) {
                            const i = rng.pick(mv);
                            return { q: `${intro} What is the speed during part ${P[i]}, in ${g.sU}?`, fig, ans: CA.num(v[i], g.sU), sol: `Part ${P[i]}: ${tx(rise[i] * dc)} ${g.dU} in ${tx(dur[i] * tc)} ${g.tU}. ${solSpeed(g, rise[i] * dc, dur[i] * tc)}.` };
                        }
                        if (k === 1) {
                            return { q: `${intro} For how long, in ${g.tU === 's' ? 'seconds' : g.tU === 'h' ? 'hours' : 'minutes'}, was it not moving?`, fig, ans: CA.num(dur[flat] * tc, g.tU), sol: `It is stopped where the line is flat (part ${P[flat]}): the distance stays at ${tx(pts[flat][1])} ${g.dU} from ${tx(pts[flat][0])} to ${tx(pts[flat + 1][0])} ${g.tU}, which is ${tx(dur[flat] * tc)} ${g.tU}.` };
                        }
                        if (k === 2) {
                            const Dt = nD * dc, Tt = nT * tc, av = spd(g, Dt, Tt);
                            if (!isInt(av)) continue;
                            return { q: `${intro} What is the average speed for the whole journey (including any stop), in ${g.sU}?`, fig, ans: CA.num(av, g.sU), sol: `Total: ${tx(Dt)} ${g.dU} in ${tx(Tt)} ${g.tU}. ${solSpeed(g, Dt, Tt)}.` };
                        }
                        const fast = v[mv[0]] > v[mv[1]] ? mv[0] : mv[1];
                        return { q: `${intro} During which part was it moving fastest?`, fig, ans: CA.mc(rng, `Part ${P[fast]}`, [0, 1, 2].filter(i => i !== fast).map(i => `Part ${P[i]}`)), sol: `The steepest part is the fastest. Speeds: ${mv.map(i => `${P[i]} = ${v[i]} ${g.sU}`).join(', ')}; part ${P[flat]} is flat (stopped, 0 ${g.sU}).` };
                    }
                },
            },
            {
                id: 'sound-light', name: 'Sound and light', level: 2,
                gen(rng) {
                    const k = rng.int(0, 3);
                    if (k === 0) {
                        const t = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 1.5, 2.5, 3.5, 4.5]), d = fix(340 * t);
                        const who = rng.pick(NAMES);
                        return { q: `${who} sees a flash of lightning and hears the thunder ${tn(t)} s later. Sound travels at 340 m/s (the light arrives almost instantly). How far away was the lightning, in metres?`, ans: CA.num(d, 'm'), sol: R`\(d = s\times t = 340\times ${tn(t)} = ${tn(d)}\) m.` };
                    }
                    if (k === 1) {
                        const t = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6]), d = fix(170 * t);
                        const place = rng.pick(['cliff', 'tall building', 'canyon wall', 'mountain side']);
                        return { q: `${rng.pick(NAMES)} shouts toward a ${place} and hears the echo ${tn(t)} s later. Sound travels at 340 m/s. How far away is the ${place}, in metres?`, ans: CA.num(d, 'm'), sol: R`The sound goes there and back: \(340\times ${tn(t)} = ${tn(2 * d)}\) m in total, so the ${place} is \(${tn(2 * d)}\div 2 = ${tn(d)}\) m away.` };
                    }
                    if (k === 2) {
                        const t = rng.pick([0.4, 0.6, 0.8, 1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6]), d = fix(750 * t);
                        return { q: `A ship's sonar sends a sound pulse straight down. The echo from the sea floor returns after ${tn(t)} s. Sound travels at 1,500 m/s in sea water. How deep is the sea, in metres?`, ans: CA.num(d, 'm'), sol: R`The pulse goes down and back up: \(1500\times ${tn(t)} = ${tn(2 * d)}\) m, so the depth is \(${tn(2 * d)}\div 2 = ${tn(d)}\) m.` };
                    }
                    const [planet, dk] = rng.pick([['Mercury', 57900000], ['Venus', 108000000], ['Earth', 150000000], ['Mars', 228000000], ['Jupiter', 778500000], ['Saturn', 1434000000]]);
                    const t = Math.round(dk / 300000), exact = Number.isInteger(dk / 300000);
                    return { q: `${planet} is about ${tx(dk)} km from the Sun. Light travels at 300,000 km/s. How many seconds does sunlight take to reach ${planet}?${exact ? '' : ' Round to the nearest second.'}`, ans: CA.num(t, 's', exact ? {} : { tol: 0.6 }), sol: R`\(t = \dfrac{d}{s} = \dfrac{${tn(dk)}}{300{,}000} ${exact ? '=' : '\approx'} ${tn(t)}\) s${t >= 120 ? ` (about ${Math.round(t / 60)} minutes)` : ''}.` };
                },
            },

            // ── Level 3: challenge ───────────────────────────────────────
            {
                id: 'catch-up', name: 'Catching up and meeting', level: 3,
                gen(rng) {
                    const k = rng.pick([0, 0, 1, 1, 2, 2, 3]);
                    const [p1, p2] = rng.sample(NAMES, 2);
                    for (;;) {
                        if (k === 0) {
                            const [mode, lo, hi] = rng.pick([['cycling', 10, 24], ['driving', 40, 100], ['jogging', 6, 12], ['riding a scooter', 12, 25]]);
                            const v1 = rng.int(lo, hi), v2 = rng.int(lo, hi), t0 = rng.pick([5, 10, 12, 15, 20, 30]);
                            if (v2 <= v1) continue;
                            const t = fix(v1 * t0 / (v2 - v1));
                            if (!isInt(t) || t > 90) continue;
                            const head = fix(v1 * t0 / 60);
                            return { q: `${p1} sets off ${mode} at ${v1} km/h. ${p2} leaves the same place ${t0} minutes later and follows the same route at ${v2} km/h. How many minutes after setting off does ${p2} catch up with ${p1}?`, ans: CA.num(t, 'min'), sol: R`In ${t0} min ${p1} gets \(${v1}\times\dfrac{${t0}}{60} = ${tn(head)}\) km ahead. ${p2} closes the gap at \(${v2} - ${v1} = ${v2 - v1}\) km/h, taking \(${tn(head)}\div ${v2 - v1} = ${tn(fix(head / (v2 - v1)))}\) h \(= ${t}\) min.` };
                        }
                        if (k === 1) {
                            const [chaser, prey, lo2, hi2, lo1, hi1] = rng.pick([['A cheetah', 'a gazelle', 26, 31, 18, 24], ['A dog', 'a cat', 9, 14, 5, 8], ['A police car', 'a speeding car', 36, 45, 28, 35], ['A cyclist', 'a jogger', 7, 11, 3, 5], ['A lion', 'a zebra', 19, 22, 14, 17]]);
                            const v2 = rng.int(lo2, hi2), v1 = rng.int(lo1, hi1), t = rng.int(3, 30), D = (v2 - v1) * t;
                            if (v2 <= v1 || D > 400) continue;
                            return { q: `${chaser} running at ${v2} m/s chases ${prey} that is ${D} m ahead and moving at ${v1} m/s in the same direction. How many seconds does it take to catch up?`, ans: CA.num(t, 's'), sol: R`The gap shrinks by \(${v2} - ${v1} = ${v2 - v1}\) m every second, so \(t = \dfrac{${D}}{${v2 - v1}} = ${t}\) s.` };
                        }
                        if (k === 2) {
                            const ms = rng.bool();
                            const v1 = ms ? rng.int(1, 3) : step(rng, 60, 150, 10), v2 = ms ? rng.int(1, 3) : step(rng, 60, 150, 10);
                            const t = ms ? rng.int(4, 30) * 10 : rng.pick([0.5, 1, 1.5, 2, 2.5, 3]);
                            const D = fix((v1 + v2) * t);
                            const askDist = rng.bool();
                            if (ms) {
                                if (askDist) return { q: `${p1} and ${p2} are ${D} m apart and walk toward each other, ${p1} at ${v1} m/s and ${p2} at ${v2} m/s. How far from ${p1}'s starting point do they meet, in metres?`, ans: CA.num(v1 * t, 'm'), sol: R`They close the gap at \(${v1} + ${v2} = ${v1 + v2}\) m/s, so they meet after \(\dfrac{${D}}{${v1 + v2}} = ${t}\) s. ${p1} walks \(${v1}\times${t} = ${v1 * t}\) m.` };
                                return { q: `${p1} and ${p2} are ${D} m apart and walk toward each other, ${p1} at ${v1} m/s and ${p2} at ${v2} m/s. After how many seconds do they meet?`, ans: CA.num(t, 's'), sol: R`They close the gap at \(${v1} + ${v2} = ${v1 + v2}\) m/s, so \(t = \dfrac{${D}}{${v1 + v2}} = ${t}\) s.` };
                            }
                            if (v1 === v2) continue;
                            if (askDist) return { q: `Two trains start ${tx(D)} km apart and travel toward each other on parallel tracks, one at ${v1} km/h and the other at ${v2} km/h. How far does the ${v1} km/h train travel before they meet, in km?`, ans: CA.num(fix(v1 * t), 'km'), sol: R`Closing speed \(${v1} + ${v2} = ${v1 + v2}\) km/h, so they meet after \(\dfrac{${tn(D)}}{${v1 + v2}} = ${tn(t)}\) h. The first train goes \(${v1}\times ${tn(t)} = ${tn(fix(v1 * t))}\) km.` };
                            return { q: `Two trains start ${tx(D)} km apart and travel toward each other on parallel tracks, one at ${v1} km/h and the other at ${v2} km/h. After how many minutes do they meet?`, ans: CA.num(t * 60, 'min'), sol: R`Closing speed \(${v1} + ${v2} = ${v1 + v2}\) km/h, so \(t = \dfrac{${tn(D)}}{${v1 + v2}} = ${tn(t)}\) h \(= ${t * 60}\) min.` };
                        }
                        const v1 = rng.int(15, 30), v2 = rng.int(15, 35), G = rng.pick([50, 60, 80, 100, 120, 150, 200, 240, 300]);
                        if (v2 <= v1) continue;
                        const t = fix(G / (v2 - v1));
                        if (!isInt(t)) continue;
                        return { q: `Two cars start side by side and drive along the same straight road, one at ${v1} m/s and the other at ${v2} m/s. How many seconds pass before the faster car is ${G} m ahead?`, ans: CA.num(t, 's'), sol: R`The faster car gains \(${v2} - ${v1} = ${v2 - v1}\) m every second, so \(t = \dfrac{${G}}{${v2 - v1}} = ${t}\) s.` };
                    }
                },
            },
            {
                id: 'average-trap', name: 'Average speed is not the average of the speeds', level: 3,
                gen(rng) {
                    const k = rng.int(0, 2);
                    const who = rng.pick(NAMES);
                    for (;;) {
                        const ms = rng.bool(0.35);
                        const v1 = ms ? rng.int(2, 10) : step(rng, 20, 120, 5), v2 = ms ? rng.int(2, 10) : step(rng, 20, 120, 5);
                        if (v1 === v2) continue;
                        const H = fix(2 * v1 * v2 / (v1 + v2));
                        if (!isInt(H)) continue;
                        const L = ms ? CA.lcm(CA.lcm(v1, v2), 20) : CA.lcm(v1, v2), D = ms ? L * rng.int(1, Math.max(1, Math.floor(800 / L))) : L;
                        if (D > (ms ? 1200 : 360)) continue;
                        const u = ms ? U.ms : U.kmh, t1 = D / v1, t2 = D / v2;
                        const trip = ms ? `${who} runs ${D} m along a track at ${v1} m/s, then runs straight back at ${v2} m/s.` : `${who}'s family drives ${D} km to a lake at ${v1} km/h and comes back along the same road at ${v2} km/h.`;
                        const sol = R`Times: \(\dfrac{${D}}{${v1}} = ${t1}\) and \(\dfrac{${D}}{${v2}} = ${t2}\) ${u.t}. Average \(= \dfrac{2\times${D}}{${t1} + ${t2}} = \dfrac{${2 * D}}{${t1 + t2}} = ${H}\) ${u.s}`;
                        if (k === 0) return { q: `${trip} What is the average speed for the whole round trip, in ${u.s}?`, ans: CA.num(H, u.s), sol: sol + ' — less than the average of the two speeds, because more time is spent going slowly.' };
                        if (k === 1) {
                            const A = fix((v1 + v2) / 2), Cm = CA.round((v1 * v1 + v2 * v2) / (v1 + v2), 1);
                            const wrong = [A, v1 + v2, Cm, Math.max(v1, v2)].filter(x => Math.abs(x - H) > 1e-9).map(x => `${tn(x)} ${u.s}`);
                            return { q: `${trip} ${rng.pick(NAMES.filter(n => n !== who))} says the average speed is \\(\\frac{${v1} + ${v2}}{2} = ${tn(A)}\\) ${u.s}. What is the correct average speed for the round trip?`, ans: CA.mc(rng, `${H} ${u.s}`, wrong), sol: sol + '. Averaging the speeds is wrong because the two halves take different times.' };
                        }
                        // required return speed for a target average
                        return { q: ms ? `${who} runs ${D} m along a track at ${v1} m/s and then runs straight back. How fast must ${who} run back so that the average speed for the round trip is ${H} m/s?` : `${who}'s family drives ${D} km to a lake at ${v1} km/h. How fast must they drive back along the same road so that the average speed for the round trip is ${H} km/h?`, ans: CA.num(v2, u.s), sol: R`Round trip \(${2 * D}\) ${u.d} at ${H} ${u.s} takes \(\dfrac{${2 * D}}{${H}} = ${t1 + t2}\) ${u.t}. The way there took \(\dfrac{${D}}{${v1}} = ${t1}\) ${u.t}, leaving ${t2} ${u.t} for ${D} ${u.d}: \(${D}\div ${t2} = ${v2}\) ${u.s}.` };
                    }
                },
            },
            {
                id: 'multi-step', name: 'Multi-step stories', level: 3,
                gen(rng) {
                    const k = rng.int(0, 3);
                    const who = rng.pick(NAMES);
                    for (;;) {
                        if (k === 0) {
                            const Dk = rng.pick([3, 5, 10]), r = rng.int(1, Dk - 1), vr = rng.int(8, 16), tr = fix(60 * r / vr);
                            if (!isInt(tr)) continue;
                            const d1 = Dk - r, t1 = rng.int(Math.ceil(60 * d1 / 16), Math.floor(60 * d1 / 7));
                            if (t1 < 1) continue;
                            const T = t1 + tr;
                            return { q: `${who} wants to finish a ${Dk} km race in ${T} minutes. ${who} runs the first ${d1} km in ${t1} minutes. What average speed, in km/h, must ${who} keep for the rest of the race?`, ans: CA.num(vr, 'km/h'), sol: R`Left: \(${Dk} - ${d1} = ${r}\) km in \(${T} - ${t1} = ${tr}\) min \(= \dfrac{${tr}}{60}\) h. Speed \(= \dfrac{${r}\times 60}{${tr}} = ${vr}\) km/h.` };
                        }
                        if (k === 1) {
                            const v = step(rng, 60, 160, 10), D = v * rng.pick([1, 1.5, 2, 2.5, 3, 1.25, 1.75, 2.25, 0.75]), trav = fix(60 * D / v), stop = rng.pick([5, 10, 12, 15, 20]);
                            if (!isInt(D) || !isInt(trav)) continue;
                            const dep = 60 * rng.int(6, 15) + 5 * rng.int(0, 11), arr = dep + trav + stop;
                            const hm = Math.floor(trav / 100) * 60 + (trav % 100);             // reading e.g. 150 min as 1 h 50
                            const wrong = [dep + trav, dep + trav - stop, dep + hm + stop, arr + 60].filter((x, i, a) => x !== arr && a.indexOf(x) === i).map(clock);
                            return { q: `A train leaves at ${clock(dep)} and travels ${D} km at an average speed of ${v} km/h while moving. On the way it stops at a station for ${stop} minutes. At what time does it arrive?`, ans: CA.mc(rng, clock(arr), wrong), sol: R`Moving time \(= \dfrac{${D}}{${v}}\) h \(= ${trav}\) min. Add the ${stop} min stop: ${trav + stop} min after ${clock(dep)} is ${clock(arr)}` };
                        }
                        if (k === 2) {
                            const w = rng.pick([4, 5, 6]), c = rng.pick([12, 15, 18, 20]), d = rng.pick([1, 1.5, 2, 2.5, 3, 4]);
                            const tw = fix(60 * d / w), tc = fix(60 * d / c);
                            if (!isInt(tw) || !isInt(tc)) continue;
                            return { q: `${who} lives ${tn(d)} km from school. Walking, ${who} goes at ${w} km/h; cycling, at ${c} km/h. How many minutes does ${who} save by cycling instead of walking?`, ans: CA.num(tw - tc, 'min'), sol: R`Walking: \(\dfrac{${tn(d)}}{${w}}\times 60 = ${tw}\) min. Cycling: \(\dfrac{${tn(d)}}{${c}}\times 60 = ${tc}\) min. Saved: \(${tw} - ${tc} = ${tw - tc}\) min.` };
                        }
                        const s = rng.int(4, 15), M = rng.pick([2, 3, 4, 5, 10]), kk = step(rng, 18, 72, 6), N = rng.pick([5, 10, 15, 20, 30]);
                        const d1 = s * 60 * M / 1000, d2 = fix(kk * N / 60), tot = fix(d1 + d2);
                        if (!isNice(tot, 2)) continue;
                        return { q: `A delivery drone flies at ${s} m/s for ${mins(M)}, then at ${kk} km/h for ${mins(N)}. How far does it fly altogether, in kilometres?`, ans: CA.num(tot, 'km'), sol: R`Part 1: \(${s}\times ${M * 60} = ${s * 60 * M}\) m \(= ${tn(d1)}\) km. Part 2: \(${kk}\times\dfrac{${N}}{60} = ${tn(d2)}\) km. Total \(= ${tn(tot)}\) km.` };
                    }
                },
            },
            {
                id: 'graph-two', name: 'Two journeys on one graph', level: 3,
                gen(rng) {
                    const g = GU[rng.pick(['ms', 'kmh'])];
                    const k = rng.int(0, 3);
                    const [p1, p2] = rng.sample(NAMES, 2);
                    for (;;) {
                        const tc = rng.pick(g.tcs), dc = rng.pick(g.dcs);
                        const km = rng.int(3, 5), jm = rng.int(3, 6), tm = km * tc, dm = jm * dc;
                        const late = rng.bool();
                        // A: from the origin. B: starts late from 0 (faster), or starts ahead at d0 (slower).
                        const kb = rng.int(1, km - 1), jb = rng.int(1, jm - 1);
                        const vA = spd(g, dm, tm);
                        const vB = late ? spd(g, dm, tm - kb * tc) : spd(g, dm - jb * dc, tm);
                        const [lo, hi] = g.tU === 's' ? [2, 9] : [40, 120];          // people running; cars driving
                        if (!isInt(vA) || !isInt(vB) || vA < lo || vB < lo || vA > hi || vB > hi || Math.max(vA, vB) < 1.5 * Math.min(vA, vB)) continue;
                        const tEnd = 6 * tc, dMax = 6 * dc;
                        const endA = Math.min(tEnd, dMax / vA * g.factor);
                        const bStart = late ? [kb * tc, 0] : [0, jb * dc];
                        const endB = Math.min(tEnd, bStart[0] + (dMax - bStart[1]) / vB * g.factor);
                        const pA = [[0, 0], [tm, dm], [endA, vA * endA / g.factor]], pB = [bStart, [tm, dm], [endB, bStart[1] + vB * (endB - bStart[0]) / g.factor]];
                        const eA = pA[2], eB = pB[2];                                   // keep the two name labels apart
                        if (Math.abs(eA[0] - eB[0]) < 0.9 * tc && Math.abs(eA[1] - eB[1]) < 0.9 * dc) continue;
                        const fig = dtGraph({ nT: 6, tc, nD: 6, dc, tU: g.tU, dU: g.dU, lines: [
                            { pts: pA, color: C.DARK, label: p1, openEnd: true, labelAt: 2, labelBelow: eA[1] < eB[1] },
                            { pts: pB, color: C.ACCENT, label: p2, openEnd: true, labelAt: 2, labelBelow: eB[1] <= eA[1] },
                        ] });
                        const mode = g.tU === 's' ? 'run' : 'drive';
                        const intro = late
                            ? `The graph shows ${p1} and ${p2}, who ${mode} along the same road from the same starting point. ${p2} sets off later.`
                            : `The graph shows ${p1} and ${p2}, who ${mode} along the same road. ${p2} starts ${tx(jb * dc)} ${g.dU} ahead of ${p1}.`;
                        const catcher = late ? p2 : p1, caught = late ? p1 : p2;
                        const tUw = g.tU === 's' ? 'seconds' : 'hours';
                        if (k === 0) return { q: `${intro} At what time, in ${tUw}, does ${catcher} catch up with ${caught}?`, fig, ans: CA.num(tm, g.tU), sol: `They are at the same place where the lines cross: at ${tx(tm)} ${g.tU}, both are ${tx(dm)} ${g.dU} from the start.` };
                        if (k === 1) {
                            const fast = vA > vB ? p1 : p2, slow = vA > vB ? p2 : p1;
                            return { q: `${intro} How much faster than ${slow} does ${fast} go, in ${g.sU}?`, fig, ans: CA.num(Math.abs(vA - vB), g.sU), sol: `${p1}: ${tx(dm)} ${g.dU} in ${tx(tm)} ${g.tU}, so ${vA} ${g.sU}. ${p2}: ${tx(late ? dm : dm - jb * dc)} ${g.dU} in ${tx(late ? tm - kb * tc : tm)} ${g.tU}, so ${vB} ${g.sU}. Difference ${Math.abs(vA - vB)} ${g.sU}.` };
                        }
                        if (k === 2) {
                            const ts = rng.int(late ? kb : 0, km - 1) * tc;
                            if (ts === 0 && late) continue;
                            const dA = vA * ts / g.factor, dB = late ? vB * Math.max(0, ts - kb * tc) / g.factor : jb * dc + vB * ts / g.factor, gap = Math.abs(dA - dB);
                            if (!isInt(dA) || !isInt(dB) || gap === 0) continue;
                            return { q: `${intro} How far apart are they at ${tx(ts)} ${g.tU}, in ${g.dU}?`, fig, ans: CA.num(gap, g.dU), sol: `At ${tx(ts)} ${g.tU}: ${p1} is at ${tx(dA)} ${g.dU} and ${p2} is at ${tx(dB)} ${g.dU}, so they are ${tx(gap)} ${g.dU} apart.` };
                        }
                        const right = late ? `${p2} started later but is faster` : `${p1} is faster but started behind`;
                        const wrong = late
                            ? [`${p1} is faster as ${p1} started first`, 'Both go at the same speed', `${p2} stops when they meet`]
                            : [`${p2} is faster as ${p2} starts ahead`, 'Both go at the same speed', `${p1} stops when they meet`];
                        return { q: `${intro} Which statement is true?`, fig, ans: CA.mc(rng, right, wrong), sol: `The steeper line is faster: ${p1} ${vA} ${g.sU}, ${p2} ${vB} ${g.sU}. ${late ? `${p2}'s line starts at ${tx(kb * tc)} ${g.tU}` : `${p2}'s line starts at ${tx(jb * dc)} ${g.dU}`} and the lines cross at ${tx(tm)} ${g.tU}; both keep going after that.` };
                    }
                },
            },
        ],

        assignment: [
            ['find-speed', 4], ['find-distance', 4], ['find-time', 4], ['speed-ideas', 3],
            ['convert-units', 3], ['minutes-hours', 3], ['mixed-units', 3], ['average-two-parts', 3], ['compare-speeds', 3], ['graph-speed', 3], ['graph-parts', 3], ['sound-light', 2],
            ['catch-up', 3], ['average-trap', 3], ['multi-step', 3], ['graph-two', 3],
        ],
    });
})();
