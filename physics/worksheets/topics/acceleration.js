/* Worksheet: Acceleration — a = (v − v₀) / t, speeding up and slowing down, speed–time graphs, distance and falling objects. */
(function () {
    'use strict';
    const R = String.raw, T = CA.tex, F = CA.fig, C = CA.fig.colors;

    // ── Numbers ──────────────────────────────────────────────────────────
    const rd = x => CA.round(x, 4);
    /** A number for TeX. */
    const N = x => T.num(rd(x));
    /** A number for TeX, in brackets when negative: 5 − (−3). */
    const P = x => (rd(x) < 0 ? `(${N(x)})` : N(x));
    /** A number for plain text (Unicode minus). */
    const tx = x => (rd(x) < 0 ? `−${rd(-x)}` : String(rd(x)));
    /** Is x a whole multiple of 1/k? */
    const clean = (x, k = 2) => Math.abs(x * k - Math.round(x * k)) < 1e-9;
    const accel = x => CA.num(rd(x), 'm/s²');
    const speed = x => CA.num(rd(x), 'm/s');
    const secs = x => CA.num(rd(x), 's');
    const metres = x => CA.num(rd(x), 'm');
    /** 'A car' → 'the car'. */
    const the = who => who.replace(/^An? /, 'the ');
    const range = (lo, hi, step = 1) => { const a = []; for (let x = lo; x <= hi + 1e-9; x += step) a.push(rd(x)); return a; };

    // ── Things that speed up ─────────────────────────────────────────────
    // a: accelerations to pick from, v0: starting speeds, t: [lo, hi] seconds, vmax: top speed that is realistic.
    // say(v0, v, t) is the sentence for "find the acceleration".
    const UP = [
        { who: 'A car', a: [1, 1.5, 2, 2.5, 3, 4, 5], v0: [0, 5, 8, 10, 12, 15], t: [2, 10], vmax: 35,
            say: (v0, v, t) => (v0 === 0 ? `A car pulls away from a traffic light and reaches ${v} m/s in ${t} s.` : `A car on a highway on-ramp speeds up from ${v0} m/s to ${v} m/s in ${t} s.`) },
        { who: 'A sprinter', a: [2, 2.5, 3, 4, 5], v0: [0], t: [2, 4], vmax: 11,
            say: (v0, v, t) => `A sprinter starts from rest and reaches ${v} m/s after ${t} s.` },
        { who: 'A cyclist', a: [0.5, 1, 1.5, 2], v0: [2, 3, 4, 5, 6], t: [2, 8], vmax: 15,
            say: (v0, v, t) => `A cyclist pedals harder and goes from ${v0} m/s to ${v} m/s in ${t} s.` },
        { who: 'A train', a: [0.5, 1, 1.5], v0: [0, 4, 6, 10], t: [4, 20], vmax: 40,
            say: (v0, v, t) => (v0 === 0 ? `A train leaves a station from rest and reaches ${v} m/s in ${t} s.` : `A train speeds up from ${v0} m/s to ${v} m/s in ${t} s.`) },
        { who: 'A plane', a: [2, 2.5, 3, 4], v0: [0, 10, 20], t: [10, 20], vmax: 80,
            say: (v0, v, t) => `A plane on the runway speeds up from ${v0} m/s to ${v} m/s in ${t} s.` },
        { who: 'A skateboarder', a: [1, 1.5, 2, 3], v0: [1, 2, 3, 4], t: [2, 5], vmax: 15,
            say: (v0, v, t) => `A skateboarder rolls down a ramp, going from ${v0} m/s to ${v} m/s in ${t} s.` },
        { who: 'A ball', a: [0.5, 1, 2], v0: [0, 1, 2], t: [2, 8], vmax: 12,
            say: (v0, v, t) => (v0 === 0 ? `A ball is let go at the top of a hill and rolls down, reaching ${v} m/s after ${t} s.` : `A ball rolling down a hill speeds up from ${v0} m/s to ${v} m/s in ${t} s.`) },
        { who: 'A motorbike', a: [2, 3, 4, 5, 6], v0: [0, 5, 10], t: [2, 6], vmax: 40,
            say: (v0, v, t) => `A motorbike accelerates from ${v0 === 0 ? 'rest' : `${v0} m/s`} to ${v} m/s in ${t} s.` },
        { who: 'A rocket', a: [10, 15, 20, 25, 30], v0: [0], t: [2, 8], vmax: 240,
            say: (v0, v, t) => `A rocket lifts off from rest and is moving at ${v} m/s after ${t} s.` },
    ];
    /** Things that slow down. a is negative. */
    const DOWN = [
        { who: 'A car', a: [-2, -3, -4, -5, -6, -8], v0: [12, 15, 16, 20, 24, 25, 30], t: [2, 8],
            say: (v0, v, t) => (v === 0 ? `A car travelling at ${v0} m/s brakes and stops in ${t} s.` : `A car slows from ${v0} m/s to ${v} m/s in ${t} s as it nears a junction.`) },
        { who: 'A cyclist', a: [-1, -1.5, -2, -3], v0: [6, 8, 9, 10, 12], t: [2, 6],
            say: (v0, v, t) => (v === 0 ? `A cyclist going at ${v0} m/s squeezes the brakes and stops in ${t} s.` : `A cyclist brakes from ${v0} m/s to ${v} m/s in ${t} s.`) },
        { who: 'A train', a: [-0.5, -1], v0: [10, 15, 20, 25, 30], t: [5, 30],
            say: (v0, v, t) => (v === 0 ? `A train pulling into a station slows from ${v0} m/s to a stop in ${t} s.` : `A train slows from ${v0} m/s to ${v} m/s in ${t} s.`) },
        { who: 'A plane', a: [-2, -2.5, -3, -4, -5], v0: [40, 50, 60, 70, 80], t: [5, 20],
            say: (v0, v, t) => `A plane lands at ${v0} m/s and slows to ${v} m/s in ${t} s.` },
        { who: 'A ball', a: [-0.5, -1, -2], v0: [2, 3, 4, 5, 6, 8], t: [2, 8],
            say: (v0, v, t) => (v === 0 ? `A ball rolling across the grass at ${v0} m/s comes to a stop in ${t} s.` : `A ball rolling on grass slows from ${v0} m/s to ${v} m/s in ${t} s.`) },
        { who: 'A skier', a: [-0.5, -1, -1.5], v0: [6, 8, 10, 12], t: [2, 8],
            say: (v0, v, t) => `A skier reaches flat snow at ${v0} m/s and slows to ${v} m/s in ${t} s.` },
        { who: 'A sprinter', a: [-1, -2], v0: [8, 9, 10], t: [2, 4],
            say: (v0, v, t) => `After the finish line, a sprinter slows from ${v0} m/s to ${v} m/s in ${t} s.` },
    ];
    /** Pick v₀, a, t from a context so that the final speed v is a sensible whole number. */
    function motion(rng, c) {
        for (;;) {
            const v0 = rng.pick(c.v0), a = rng.pick(c.a), t = rng.int(c.t[0], c.t[1]), v = rd(v0 + a * t);
            if (!Number.isInteger(v)) continue;
            if (a > 0 && v > c.vmax) continue;
            if (a < 0 && v < 0) continue;
            return { v0, a, t, v };
        }
    }
    const fracTeX = (top, bot) => R`\dfrac{${top}}{${bot}}`;
    /** "a = (v − v₀)/t = (12 − 4)/4 = 8/4 = 2" */
    const aWork = (v0, v, t) => R`\(a = \dfrac{v - v_0}{t} = ${fracTeX(R`${N(v)} - ${N(v0)}`, N(t))} = ${fracTeX(N(v - v0), N(t))} = ${N((v - v0) / t)}\) m/s²`;

    // ── Speed–time graphs ────────────────────────────────────────────────
    /** A speed–time graph through the points [[t, v], …] on a labelled grid. */
    function vtGraph(pts, o) {
        const { tMax, vMax, tStep, vStep } = o;
        const W = 290, H = 186, x0 = 40, top = 24, y0 = H - 36, right = W - 14;
        const sx = (right - x0) / tMax, sy = (y0 - top) / vMax;
        const X = t => x0 + t * sx, Y = v => y0 - v * sy;
        let g = '';
        const nV = Math.round(vMax / vStep), nT = Math.round(tMax / tStep);
        for (let i = 0; i <= nV; i++) {
            const y = Y(i * vStep);
            if (i) g += F.line(x0, y, right, y, { stroke: '#d5dbe8', width: 0.8 });
            if (nV <= 8 || i % 2 === 0) g += F.text(x0 - 5, y + 4, String(rd(i * vStep)), { anchor: 'end', size: 11 });
        }
        for (let i = 0; i <= nT; i++) {
            const x = X(i * tStep);
            if (i) g += F.line(x, y0, x, top, { stroke: '#d5dbe8', width: 0.8 });
            if (nT <= 12 || i % 2 === 0) g += F.text(x, y0 + 14, String(rd(i * tStep)), { size: 11 });
        }
        g += F.line(x0, y0, right + 4, y0, { width: 1.2 }) + F.line(x0, y0, x0, top - 8, { width: 1.2 });
        const Q = pts.map(([t, v]) => [X(t), Y(v)]);
        g += F.poly(Q, { open: true, stroke: C.ACCENT, width: 2.4 });
        Q.forEach(([x, y]) => { g += F.dot(x, y, { r: 3, fill: C.ACCENT }); });
        g += F.text(4, 13, 'speed (m/s)', { anchor: 'start', size: 11, italic: true });
        g += F.text((x0 + right) / 2, H - 5, 'time (s)', { size: 11, italic: true });
        return F.svg(W, H, g, { label: 'speed–time graph' });
    }
    /** Grid step for a speed axis that goes up to (at least) top: 3 to 8 gridlines. */
    function vScale(top) {
        for (const s of [1, 2, 4, 5, 10, 20, 25, 50]) {
            const n = Math.ceil(top / s);
            if (top % s === 0 && n <= 7) return { vStep: s, vMax: n * s };
        }
        return { vStep: 50, vMax: Math.ceil(top / 50) * 50 };
    }
    /** A small sketch of a speed–time graph for multiple choice. kind: up | down | flat | rest. */
    function mini(kind) {
        const W = 100, H = 74, x0 = 14, y0 = 58, r = 92, top = 12;
        let g = F.line(x0, y0, r, y0, { width: 1.2 }) + F.line(x0, y0, x0, top - 4, { width: 1.2 });
        g += F.text(x0 + 3, 10, 'speed', { anchor: 'start', size: 9, italic: true });
        g += F.text(r, y0 + 13, 'time', { anchor: 'end', size: 9, italic: true });
        const L = {
            up: [x0, y0, r - 6, top + 4],
            down: [x0, top + 4, r - 6, y0],
            flat: [x0, (y0 + top) / 2, r - 6, (y0 + top) / 2],
            rest: [x0, y0 - 1.5, r - 6, y0 - 1.5],
        }[kind];
        g += F.line(...L, { stroke: C.ACCENT, width: 2.6 });
        return F.svg(W, H, g, { label: 'speed–time sketch' });
    }

    /** A two-row table of time and speed, drawn as SVG so it prints cleanly. */
    function speedTable(times, speeds) {
        const cw = 38, lw = 86, rh = 22, W = lw + cw * times.length + 2, H = rh * 2 + 2;
        let g = F.rect(1, 1, W - 2, H - 2, { width: 1 }) + F.line(1, 1 + rh, W - 1, 1 + rh, { width: 1 });
        g += F.rect(1, 1, lw, H - 2, { fill: C.FILL, width: 1 });
        g += F.text(8, 1 + rh / 2 + 4, 'time (s)', { anchor: 'start', size: 12 }) + F.text(8, 1 + rh * 1.5 + 4, 'speed (m/s)', { anchor: 'start', size: 12 });
        times.forEach((t, i) => {
            const x = 1 + lw + cw * i;
            g += F.line(x, 1, x, H - 1, { width: 1 });
            g += F.text(x + cw / 2, 1 + rh / 2 + 4, String(t), { size: 12 }) + F.text(x + cw / 2, 1 + rh * 1.5 + 4, String(speeds[i]), { size: 12 });
        });
        return F.svg(W, H, g, { label: 'table of speeds' });
    }

    // ── Is it accelerating? ──────────────────────────────────────────────
    const ACC_CHOICES = [
        'Yes, speeding up',
        'Yes, slowing down',
        'Yes, changing direction',
        'No',
    ];
    const ACC_CASES = [
        ['A rocket lifts off and goes faster and faster.', 0],
        ['A ball rolls down a hill, picking up speed.', 0],
        ['A sprinter bursts out of the starting blocks.', 0],
        ['An apple falls from a branch toward the ground.', 0],
        ['A car pulls away when the traffic light turns green.', 0],
        ['A skier glides down a steep slope, getting faster.', 0],
        ['A car brakes as it comes up to a red light.', 1],
        ['A cyclist squeezes the brakes before a corner.', 1],
        ['A ball rolling across the grass gradually comes to a stop.', 1],
        ['A plane touches down and slows along the runway.', 1],
        ['A ball thrown straight up is on its way up.', 1],
        ['A train pulls into a station and slows to a stop.', 1],
        ['A car drives around a roundabout at a steady 30 km/h.', 2],
        ['A child rides a merry-go-round turning at a steady speed.', 2],
        ['The Moon travels around the Earth at a steady speed.', 2],
        ['A runner jogs around a circular track at a steady 4 m/s.', 2],
        ['A car on cruise control drives along a straight highway at a steady 100 km/h.', 3],
        ['A train runs along a straight track at a constant 40 m/s.', 3],
        ['A book lies still on a desk.', 3],
        ['An elevator moves straight up at a steady 2 m/s.', 3],
        ['A plane cruises in a straight line at a steady 250 m/s.', 3],
        ['A skydiver falls straight down at a constant speed of 55 m/s.', 3],
    ];
    const ACC_WHY = [
        'Its speed is increasing, so it is accelerating.',
        'Its speed is decreasing, so it has a negative acceleration (deceleration).',
        'Its speed stays the same, but its direction keeps changing, and a change of direction is also acceleration.',
        'Its speed does not change and it moves in a straight line (or stays still), so its acceleration is zero.',
    ];

    // ── Which graph? ─────────────────────────────────────────────────────
    const GRAPH_CASES = [
        ['up', 'a sprinter speeding up steadily from the start'],
        ['up', 'a rocket gaining speed at a steady rate'],
        ['up', 'a car speeding up steadily from a traffic light'],
        ['up', 'a ball rolling faster and faster down a ramp'],
        ['down', 'a car braking steadily to a stop'],
        ['down', 'a bike slowing down steadily until it stops'],
        ['down', 'a train slowing down as it pulls into a station'],
        ['down', 'a sledge sliding to a stop on flat snow'],
        ['flat', 'a train cruising at a steady speed on a straight track'],
        ['flat', 'a car on cruise control on a straight road'],
        ['flat', 'a plane flying in a straight line at constant speed'],
        ['rest', 'a parked car'],
        ['rest', 'a bike leaning against a wall'],
        ['down', 'an object with a negative acceleration'],
        ['flat', 'an object that is moving but not accelerating'],
        ['up', 'an object with a positive acceleration'],
    ];
    const GRAPH_WHY = {
        up: 'The line goes up steadily: the speed increases by the same amount each second (positive acceleration).',
        down: 'The line goes down to zero: the speed decreases steadily (negative acceleration).',
        flat: 'A flat line above zero means a steady speed: the object is moving, and its acceleration is zero.',
        rest: 'A line along the time axis means the speed is always 0: the object is not moving.',
    };

    CA.register({
        id: 'acceleration',
        title: 'Acceleration',
        page: 'acceleration.html',
        subject: 'Physics',
        assignmentNote: 'Use a = (v − v₀) ÷ t, v = v₀ + a × t and d = v₀ × t + ½ × a × t². Speeds are in m/s, times in s, distances in m and accelerations in m/s². Take the direction of motion as positive, so slowing down gives a negative acceleration — include the sign. For falling objects use g = 9.8 m/s² and ignore air resistance. Answers come out exact; if you get a long decimal, check your working.',

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'find-accel', name: 'Find the acceleration', level: 1,
                gen(rng) {
                    const c = rng.pick(UP), { v0, a, t, v } = motion(rng, c);
                    return {
                        q: `${c.say(v0, v, t)} What is its acceleration?`,
                        ans: accel(a),
                        sol: R`${aWork(v0, v, t)}. Its speed goes up by ${tx(a)} m/s every second.`,
                    };
                },
            },
            {
                id: 'speed-table', name: 'Acceleration from a table', level: 1,
                gen(rng) {
                    const slow = rng.bool(0.35);
                    const step = rng.pick([1, 1, 2]), times = [0, 1, 2, 3, 4].map(i => i * step);
                    for (;;) {
                        const a = slow ? -rng.pick([1, 2, 3, 4]) / (step === 2 ? 2 : 1) : rng.pick([1, 2, 3, 4, 5]) / (step === 2 ? rng.pick([1, 2]) : 1);
                        const v0 = slow ? rng.int(4, 12) * 2 : rng.int(0, 8);
                        const speeds = times.map(t => rd(v0 + a * t));
                        if (speeds.some(s => s < 0 || !Number.isInteger(s))) continue;
                        const who = slow ? rng.pick(['a car braking', 'a ball rolling to a stop', 'a cyclist slowing down', 'a sledge sliding on flat snow'])
                            : rng.pick(['a skateboarder rolling down a ramp', 'a toy car rolling down a slope', 'a cyclist leaving a junction', 'a car pulling away', 'a runner starting a race']);
                        const dv = speeds[1] - speeds[0];
                        return {
                            q: `The table shows the speed of ${who} every ${step === 1 ? 'second' : '2 seconds'}. What is its acceleration?`,
                            fig: speedTable(times, speeds),
                            ans: accel(a),
                            sol: R`The speed changes by ${tx(dv)} m/s every ${step === 1 ? 'second' : '2 seconds'}${step === 2 ? R`, so \(a = ${fracTeX(N(dv), 2)} = ${N(a)}\) m/s²` : R`, so \(a = ${N(a)}\) m/s²`}. (Or: \(a = ${fracTeX(R`${N(speeds[4])} - ${N(speeds[0])}`, N(times[4]))} = ${N(a)}\) m/s².)`,
                        };
                    }
                },
            },
            {
                id: 'is-accelerating', name: 'Is it accelerating?', level: 1,
                gen(rng) {
                    const [s, k] = rng.pick(ACC_CASES);
                    return {
                        q: `${s} Is it accelerating?`,
                        ans: CA.mc(rng, ACC_CHOICES[k], ACC_CHOICES, { keepOrder: true }),
                        sol: ACC_WHY[k],
                    };
                },
            },
            {
                id: 'final-speed', name: 'Find the final speed', level: 1,
                gen(rng) {
                    const c = rng.pick(UP), { v0, a, t, v } = motion(rng, c);
                    return {
                        q: `${c.who} ${v0 === 0 ? 'starts from rest' : `is moving at ${v0} m/s`} and accelerates at ${a} m/s² for ${t} s. What is ${the(c.who)}'s speed at the end?`,
                        ans: speed(v),
                        sol: R`\(v = v_0 + a \times t = ${N(v0)} + ${N(a)} \times ${N(t)} = ${N(v0)} + ${N(a * t)} = ${N(v)}\) m/s.`,
                    };
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'slowing-down', name: 'Slowing down: negative acceleration', level: 2,
                gen(rng) {
                    const c = rng.pick(DOWN), { v0, a, t, v } = motion(rng, c);
                    if (v === v0) return this.gen(rng);
                    return {
                        q: `${c.say(v0, v, t)} What is its acceleration? (Include the sign.)`,
                        ans: accel(a),
                        sol: R`${aWork(v0, v, t)}. It is negative because the speed is going down by ${tx(-a)} m/s every second.`,
                    };
                },
            },
            {
                id: 'find-time', name: 'How long does it take?', level: 2,
                gen(rng) {
                    if (rng.bool(0.55)) {
                        const c = rng.pick(UP), { v0, a, t, v } = motion(rng, c);
                        return {
                            q: `${c.who} accelerates at ${a} m/s² from ${v0 === 0 ? 'rest' : `${v0} m/s`}. How long does it take to reach ${v} m/s?`,
                            ans: secs(t),
                            sol: R`\(t = \dfrac{v - v_0}{a} = ${fracTeX(R`${N(v)} - ${N(v0)}`, N(a))} = ${fracTeX(N(v - v0), N(a))} = ${N(t)}\) s.`,
                        };
                    }
                    const c = rng.pick(DOWN), { v0, a, t, v } = motion(rng, c);
                    return {
                        q: `${c.who} moving at ${v0} m/s slows down with an acceleration of ${tx(a)} m/s². How long does it take ${v === 0 ? 'to stop' : `to slow to ${v} m/s`}?`,
                        ans: secs(t),
                        sol: R`\(t = \dfrac{v - v_0}{a} = ${fracTeX(R`${N(v)} - ${N(v0)}`, P(a))} = ${fracTeX(N(v - v0), P(a))} = ${N(t)}\) s. (The two minus signs cancel; a time is always positive.)`,
                    };
                },
            },
            {
                id: 'find-start-speed', name: 'Find the starting speed', level: 2,
                gen(rng) {
                    if (rng.bool(0.6)) {
                        const c = rng.pick(UP), { v0, a, t, v } = motion(rng, c);
                        if (v0 === 0) return this.gen(rng);
                        return {
                            q: `${c.who} accelerates at ${a} m/s² for ${t} s and reaches ${v} m/s. How fast was it going at the start?`,
                            ans: speed(v0),
                            sol: R`It gained \(a \times t = ${N(a)} \times ${N(t)} = ${N(a * t)}\) m/s, so \(v_0 = v - a t = ${N(v)} - ${N(a * t)} = ${N(v0)}\) m/s.`,
                        };
                    }
                    const c = rng.pick(DOWN), { v0, a, t, v } = motion(rng, c);
                    return {
                        q: `${c.who} slows down with an acceleration of ${tx(a)} m/s² for ${t} s and ${v === 0 ? 'comes to a stop' : `ends up at ${v} m/s`}. How fast was it going at the start?`,
                        ans: speed(v0),
                        sol: R`It lost \(${N(-a)} \times ${N(t)} = ${N(-a * t)}\) m/s, so \(v_0 = v - a t = ${N(v)} - ${P(a)} \times ${N(t)} = ${N(v)} + ${N(-a * t)} = ${N(v0)}\) m/s.`,
                    };
                },
            },
            {
                id: 'kmh', name: 'Change km/h to m/s first', level: 2,
                gen(rng) {
                    
                    const ctx = [
                        { up: true, who: 'A sports car', s: (a, b, t) => `A sports car goes from ${a === 0 ? '0' : a} to ${b} km/h in ${t} s.`, from: [0], to: [90, 108], t: [3, 6] },
                        { up: true, who: 'A family car', s: (a, b, t) => `A family car speeds up from ${a} km/h to ${b} km/h in ${t} s.`, from: [0, 18, 36], to: [54, 72, 90], t: [4, 12] },
                        { up: true, who: 'A bus', s: (a, b, t) => `A bus pulls away from a stop and reaches ${b} km/h in ${t} s.`, from: [0], to: [36, 54], t: [5, 20] },
                        { up: true, who: 'A cheetah', s: (a, b, t) => `A cheetah starts from rest and reaches ${b} km/h in ${t} s.`, from: [0], to: [72, 90, 108], t: [3, 5] },
                        { up: false, who: 'A car', s: (a, b, t) => `A car brakes from ${a} km/h to ${b === 0 ? 'a stop' : `${b} km/h`} in ${t} s.`, from: [54, 72, 90, 108], to: [0, 18, 36], t: [2, 8] },
                        { up: false, who: 'A cyclist', s: (a, b, t) => `A cyclist slows from ${a} km/h to ${b === 0 ? 'a stop' : `${b} km/h`} in ${t} s.`, from: [18, 36], to: [0, 18], t: [2, 10] },
                    ];
                    const c = rng.pick(ctx);
                    for (;;) {
                        const ka = rng.pick(c.from), kb = rng.pick(c.to), t = rng.int(c.t[0], c.t[1]);
                        if (ka === kb) continue;
                        const v0 = ka / 18 * 5, v = kb / 18 * 5, a = (v - v0) / t;
                        if (!clean(a, 2) || Math.abs(a) > 10 || Math.abs(a) < 0.5) continue;
                        return {
                            q: `${c.s(ka, kb, t)} Change the speeds to m/s, then find the acceleration in m/s²${c.up ? '' : ' (include the sign)'}.`,
                            ans: accel(a),
                            sol: R`Divide by 3.6: ${ka} km/h = ${N(v0)} m/s and ${kb} km/h = ${N(v)} m/s. Then ${aWork(v0, v, t)}.`,
                        };
                    }
                },
            },
            {
                id: 'graph-slope', name: 'Acceleration from a speed–time graph', level: 2,
                gen(rng) {
                    // [who, top speed (m/s), largest believable |a| (m/s²), grid steps for speed, grid steps for time]
                    const [who, vTop, aTop, vSteps, tSteps] = rng.pick([
                        ['car', 30, 4, [2, 5], [1, 2]],
                        ['cyclist', 12, 2, [1, 2], [1, 2]],
                        ['train', 40, 1.5, [5], [5, 10]],
                        ['skateboarder', 10, 2, [1, 2], [1]],
                        ['motorbike', 35, 6, [5], [1, 2]],
                        ['bus', 20, 2, [2, 5], [2, 5]],
                        ['runner', 10, 4, [1, 2], [1]],
                    ]);
                    for (;;) {
                        const tStep = rng.pick(tSteps), nT = rng.int(3, tStep === 1 ? 10 : 8), T1 = tStep * nT;
                        const vStep = rng.pick(vSteps), v0 = vStep * rng.int(0, 7), v1 = vStep * rng.int(0, 7);
                        if (v0 === v1 && !rng.bool(0.15)) continue;
                        if (Math.max(v0, v1) > vTop) continue;
                        const a = (v1 - v0) / T1;
                        if (!clean(a, 2) || Math.abs(a) > aTop) continue;
                        const top = Math.max(v0, v1), nV = Math.max(Math.ceil(top / vStep) + 1, 4);
                        if (nV > 8) continue;
                        const fig = vtGraph([[0, v0], [T1, v1]], { tMax: T1, vMax: nV * vStep, tStep, vStep });
                        return {
                            q: `The speed–time graph shows a ${who} moving in a straight line. What is its acceleration?${v1 < v0 ? ' (Include the sign.)' : ''}`,
                            fig,
                            ans: accel(a),
                            sol: v0 === v1
                                ? R`The line is flat: the speed stays at ${v0} m/s, so the acceleration is \(0\) m/s².`
                                : R`Acceleration is the slope: the speed goes from ${v0} m/s to ${v1} m/s in ${T1} s, so ${aWork(v0, v1, T1)}.`,
                        };
                    }
                },
            },
            {
                id: 'compare', name: 'Which accelerates fastest?', level: 2,
                gen(rng) {
                    const NAMES = ['car', 'bus', 'motorbike', 'truck', 'van', 'taxi', 'sports car', 'pickup'];
                    const most = rng.bool(0.65);
                    for (;;) {
                        const names = rng.sample(NAMES, 3);
                        const as = rng.sample([0.5, 1, 1.5, 2, 2.5, 3, 4, 5], 3);
                        const rows = as.map(a => { const t = rng.int(2, 10), v0 = rng.pick([0, 0, 2, 4, 5, 6, 8, 10]); return { a, t, v0, v: v0 + a * t }; });
                        if (rows.some(r => !Number.isInteger(r.v) || r.v > 30)) continue;
                        const pick = (f, best) => rows.reduce((bi, r, i) => (best(f(r), f(rows[bi])) ? i : bi), 0);
                        const k = most ? pick(r => r.a, (x, y) => x > y) : pick(r => r.a, (x, y) => x < y);
                        // The tempting wrong answers must point somewhere else.
                        const bigV = pick(r => r.v, (x, y) => x > y), bigDv = pick(r => r.v - r.v0, (x, y) => x > y);
                        const smallDv = pick(r => r.v - r.v0, (x, y) => x < y), smallV = pick(r => r.v, (x, y) => x < y);
                        if (most && (bigV === k || bigDv === k)) continue;
                        if (!most && (smallV === k || smallDv === k)) continue;
                        const lines = rows.map((r, i) => `The ${names[i]} goes from ${r.v0 === 0 ? 'rest' : `${r.v0} m/s`} to ${r.v} m/s in ${r.t} s.`).join('<br>');
                        const choice = i => `The ${names[i]}`;
                        return {
                            q: `${lines}<br>Which one has the ${most ? 'greatest' : 'smallest'} acceleration?`,
                            ans: CA.mc(rng, choice(k), [0, 1, 2].filter(i => i !== k).map(choice).concat(['All three have the same acceleration'])),
                            sol: rows.map((r, i) => R`${names[i]}: \(${fracTeX(N(r.v - r.v0), N(r.t))} = ${N(r.a)}\) m/s²`).join('; ') + `. The ${names[k]} has the ${most ? 'greatest' : 'smallest'}. (The biggest speed or speed change is not what counts; it is the change per second.)`,
                        };
                    }
                },
            },
            {
                id: 'distance', name: 'How far does it go?', level: 2,
                gen(rng) {
                    for (;;) {
                        const c = rng.pick(UP), { v0, a, t, v } = motion(rng, c);
                        const d = v0 * t + 0.5 * a * t * t;
                        if (!clean(d, 2) || t > 12) continue;
                        return {
                            q: `${c.who} ${v0 === 0 ? 'starts from rest' : `moving at ${v0} m/s`} ${v0 === 0 ? 'and accelerates' : 'accelerates'} at ${a} m/s² for ${t} s. How far does ${the(c.who)} travel in that time?`,
                            ans: metres(d),
                            sol: R`\(d = v_0 t + \tfrac12 a t^2 = ${N(v0)} \times ${N(t)} + \tfrac12 \times ${N(a)} \times ${N(t)}^2 = ${N(v0 * t)} + ${N(0.5 * a * t * t)} = ${N(d)}\) m.`,
                        };
                    }
                },
            },
            {
                id: 'which-graph', name: 'Pick the speed–time graph', level: 2,
                gen(rng) {
                    const [kind, desc] = rng.pick(GRAPH_CASES);
                    return {
                        q: `Which speed–time graph shows ${desc}?`,
                        ans: CA.mc(rng, mini(kind), ['up', 'down', 'flat', 'rest'].filter(k => k !== kind).map(mini)),
                        sol: GRAPH_WHY[kind],
                    };
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'graph-journey', name: 'A journey on a speed–time graph', level: 3,
                gen(rng) {
                    const ctx = rng.pick([
                        // aTop: the largest believable acceleration (braking may be up to 1.5 times harder).
                        { who: 'a bus travelling between two stops', V: [8, 10, 12, 15, 16, 20], aTop: 2, tSteps: [2, 5] },
                        { who: 'a train travelling between two stations', V: [15, 20, 24, 25, 30], aTop: 1.5, tSteps: [5, 10] },
                        { who: 'a tram travelling between two stops', V: [8, 10, 12, 15], aTop: 1.5, tSteps: [2, 5] },
                        { who: 'a cyclist riding between two junctions', V: [4, 5, 6, 8, 10], aTop: 2, tSteps: [1, 2] },
                        { who: 'a car driving between two traffic lights', V: [10, 12, 15, 16, 20], aTop: 4, tSteps: [1, 2, 5] },
                        { who: 'an elevator going up between two floors', V: [2, 3, 4], aTop: 1.5, tSteps: [1, 2] },
                    ]);
                    for (;;) {
                        const V = rng.pick(ctx.V), tStep = rng.pick(ctx.tSteps);
                        const t1 = tStep * rng.int(1, 5), d2 = tStep * rng.int(1, 5), d3 = tStep * rng.int(1, 4), Tend = t1 + d2 + d3;
                        if (Tend / tStep > 12 || Tend / tStep < 5) continue;
                        const a1 = V / t1, a3 = -V / d3;
                        if (a1 > ctx.aTop || -a3 > 1.5 * ctx.aTop || a1 < ctx.aTop / 8) continue;
                        const s1 = 0.5 * V * t1, s2 = V * d2, s3 = 0.5 * V * d3, total = s1 + s2 + s3;
                        const kind = rng.int(0, 3);
                        if ((kind === 0 && !clean(a1, 2)) || (kind === 1 && !clean(a3, 2)) || !clean(total, 2)) continue;
                        const { vStep, vMax } = vScale(V);
                        const fig = vtGraph([[0, 0], [t1, V], [t1 + d2, V], [Tend, 0]], { tMax: Tend, vMax: vMax === V ? vMax + vStep : vMax, tStep, vStep });
                        const intro = `The speed–time graph shows ${ctx.who}.`;
                        if (kind === 0) return {
                            q: `${intro} What is its acceleration during the first ${t1} s?`, fig, ans: accel(a1),
                            sol: R`In the first ${t1} s the speed goes from 0 to ${V} m/s, so ${aWork(0, V, t1)}.`,
                        };
                        if (kind === 1) return {
                            q: `${intro} What is its acceleration during the last part, while it slows to a stop? (Include the sign.)`, fig, ans: accel(a3),
                            sol: R`From ${t1 + d2} s to ${Tend} s the speed drops from ${V} m/s to 0 in ${d3} s, so ${aWork(V, 0, d3)}.`,
                        };
                        if (kind === 2) return {
                            q: `${intro} How far does it travel during the part where it is speeding up? (Hint: distance is the area under a speed–time graph.)`, fig, ans: metres(s1),
                            sol: R`The area under the first part is a triangle: \(\tfrac12 \times ${t1} \times ${V} = ${N(s1)}\) m.${clean(a1, 4) ? R` (Same as \(d = \tfrac12 a t^2 = \tfrac12 \times ${N(a1)} \times ${t1}^2\).)` : ''}`,
                        };
                        return {
                            q: `${intro} How far does it travel in total? (Hint: distance is the area under a speed–time graph.)`, fig, ans: metres(total),
                            sol: R`Area = triangle + rectangle + triangle \(= \tfrac12 \times ${t1} \times ${V} + ${d2} \times ${V} + \tfrac12 \times ${d3} \times ${V} = ${N(s1)} + ${N(s2)} + ${N(s3)} = ${N(total)}\) m.`,
                        };
                    }
                },
            },
            {
                id: 'free-fall', name: 'Falling objects', level: 3,
                gen(rng) {
                    const g = 9.8, kind = rng.int(0, 5);
                    if (kind === 0) {
                        const [s, ts] = rng.pick([
                            ['A stone is dropped from a bridge.', [1, 1.5, 2, 2.5]],
                            ['An apple falls from a high branch.', [0.5, 1]],
                            ['A ball is dropped from the top of a tall tower.', [1, 2, 3, 4, 5]],
                            ['A diver steps off a 10 m high board.', [0.5, 1]],
                            ['A coin is dropped down a deep well.', [1, 1.5, 2, 2.5, 3]],
                        ]);
                        const t = rng.pick(ts), v = g * t;
                        return { q: `${s} How fast is it falling after ${t} s?`, ans: speed(v), sol: R`It starts from rest and gains 9.8 m/s every second: \(v = 0 + 9.8 \times ${N(t)} = ${N(v)}\) m/s.` };
                    }
                    if (kind === 1) {
                        const [s, ts] = rng.pick([
                            ['A pebble dropped down a well hits the water after', [1, 2, 3]],
                            ['A stone dropped from a cliff lands in the sea after', [2, 3, 4]],
                            ['A ball dropped from a balcony hits the ground after', [1, 2]],
                            ['A rock dropped into a canyon hits the bottom after', [3, 4, 5]],
                        ]);
                        const t = rng.pick(ts), d = 0.5 * g * t * t;
                        return { q: `${s} ${t} s. How far did it fall?`, ans: metres(d), sol: R`From rest, \(d = \tfrac12 g t^2 = \tfrac12 \times 9.8 \times ${t}^2 = 4.9 \times ${t * t} = ${N(d)}\) m.` };
                    }
                    if (kind === 2) {
                        const k = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), v = g * k;
                        return { q: `A stone is dropped from a hot-air balloon high above the ground. How long after it is let go is it falling at ${N(v)} m/s?`, ans: secs(k), sol: R`\(t = \dfrac{v - v_0}{g} = \dfrac{${N(v)} - 0}{9.8} = ${N(k)}\) s.` };
                    }
                    if (kind === 3) {
                        const v0 = rng.pick([2, 3, 4, 5, 6, 10]), t = rng.pick([1, 2, 3]), v = v0 + g * t;
                        const who = rng.pick(['A ball is thrown straight down from a tower', 'A stone is thrown straight down from a cliff', 'A parcel is thrown straight down from a helicopter hovering high up']);
                        return { q: `${who} at ${v0} m/s. How fast is it moving ${t} s later?`, ans: speed(v), sol: R`\(v = v_0 + g t = ${v0} + 9.8 \times ${t} = ${v0} + ${N(g * t)} = ${N(v)}\) m/s.` };
                    }
                    if (kind === 4) {
                        const k = rng.pick([0.5, 1, 1.5, 2, 2.5, 3]), v0 = g * k;
                        const who = rng.pick(['A ball', 'A tennis ball', 'A stone', 'A beanbag']);
                        return {
                            q: `${who} is thrown straight up at ${N(v0)} m/s. On the way up it slows down with an acceleration of −9.8 m/s². How long does it take to reach the top, where its speed is 0?`,
                            ans: secs(k),
                            sol: R`\(t = \dfrac{v - v_0}{a} = \dfrac{0 - ${N(v0)}}{-9.8} = ${N(k)}\) s.`,
                        };
                    }
                    const gm = 1.6, t = rng.int(2, 10);
                    if (rng.bool()) return {
                        q: `On the Moon, gravity makes falling things accelerate at only 1.6 m/s². An astronaut drops a hammer. How fast is it falling after ${t} s?`,
                        ans: speed(gm * t), sol: R`\(v = 0 + 1.6 \times ${t} = ${N(gm * t)}\) m/s. (On Earth it would be \(9.8 \times ${t} = ${N(g * t)}\) m/s.)`,
                    };
                    const tt = rng.int(1, 5);
                    return {
                        q: `On the Moon, gravity makes falling things accelerate at only 1.6 m/s². An astronaut drops a rock from rest and it lands ${tt} s later. How far did it fall?`,
                        ans: metres(0.5 * gm * tt * tt), sol: R`\(d = \tfrac12 \times 1.6 \times ${tt}^2 = 0.8 \times ${tt * tt} = ${N(0.5 * gm * tt * tt)}\) m.`,
                    };
                },
            },
            {
                id: 'multi-step', name: 'Multi-step motion', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 4);
                    for (;;) {
                        if (kind === 0 || kind === 1) {
                            const [who, A1, B, T1, vTop] = rng.pick([
                                ['A car', [2, 2.5, 3, 4], [4, 5, 6, 8], [4, 10], 30],
                                ['A go-kart', [2, 3, 4], [3, 4, 5, 6], [2, 6], 20],
                                ['A cyclist', [0.5, 1, 1.5, 2], [1, 2, 3], [3, 8], 10],
                                ['A motorbike', [3, 4, 5], [5, 6, 8], [3, 6], 35],
                            ]);
                            const a1 = rng.pick(A1), b = rng.pick(B), t1 = rng.int(T1[0], T1[1]), v = a1 * t1, t2 = v / b;
                            if (!Number.isInteger(v) || v > vTop || !clean(t2, 2)) continue;
                            const intro = `${who} starts from rest and accelerates at ${a1} m/s² for ${t1} s. Then ${the(who)} brakes with an acceleration of −${b} m/s² until it stops.`;
                            if (kind === 0) return {
                                q: `${intro} How long does the braking take?`, ans: secs(t2),
                                sol: R`Top speed \(= ${a1} \times ${t1} = ${N(v)}\) m/s. Braking time \(t = \dfrac{0 - ${N(v)}}{-${b}} = ${N(t2)}\) s.`,
                            };
                            const d1 = 0.5 * a1 * t1 * t1, d2 = v * t2 - 0.5 * b * t2 * t2, d = d1 + d2;
                            if (!clean(d, 2)) continue;
                            return {
                                q: `${intro} How far does it travel altogether?`, ans: metres(d),
                                sol: R`Top speed \(= ${N(v)}\) m/s. Speeding up: \(\tfrac12 \times ${a1} \times ${t1}^2 = ${N(d1)}\) m. Braking takes \(${N(v)} \div ${b} = ${N(t2)}\) s: \(${N(v)} \times ${N(t2)} - \tfrac12 \times ${b} \times ${N(t2)}^2 = ${N(d2)}\) m. Total \(= ${N(d)}\) m.`,
                            };
                        }
                        if (kind === 2) {
                            const a1 = rng.pick([10, 15, 20, 25]), t1 = rng.int(3, 8), a2 = rng.pick([5, 10, 30, 40]), t2 = rng.int(2, 6);
                            if (a1 === a2) continue;
                            const v1 = a1 * t1, v2 = v1 + a2 * t2;
                            return {
                                q: `A two-stage rocket lifts off from rest. The first stage gives it an acceleration of ${a1} m/s² for ${t1} s. The second stage then gives it ${a2} m/s² for ${t2} s. How fast is it going at the end?`,
                                ans: speed(v2),
                                sol: R`After stage 1: \(${a1} \times ${t1} = ${v1}\) m/s. After stage 2: \(${v1} + ${a2} \times ${t2} = ${v1} + ${a2 * t2} = ${v2}\) m/s.`,
                            };
                        }
                        if (kind === 3) {
                            const [who, V0, B] = rng.pick([
                                ['A car travelling at', [12, 15, 16, 20, 24, 25, 30], [4, 5, 6, 8]],
                                ['A train travelling at', [10, 15, 20, 30], [0.5, 1, 2]],
                                ['A cyclist riding at', [6, 8, 9, 10], [1, 2, 3]],
                                ['A plane landing at', [50, 60, 70, 80], [2, 4, 5]],
                            ]);
                            const v0 = rng.pick(V0), b = rng.pick(B), t = v0 / b, d = v0 * t - 0.5 * b * t * t;
                            if (!clean(t, 2) || !clean(d, 2)) continue;
                            return {
                                q: `${who} ${v0} m/s brakes with an acceleration of −${b} m/s² until it stops. How far does it travel while braking?`,
                                ans: metres(d),
                                sol: R`Time to stop: \(t = \dfrac{0 - ${v0}}{-${b}} = ${N(t)}\) s. Then \(d = v_0 t + \tfrac12 a t^2 = ${v0} \times ${N(t)} + \tfrac12 \times (-${b}) \times ${N(t)}^2 = ${N(v0 * t)} - ${N(0.5 * b * t * t)} = ${N(d)}\) m.`,
                            };
                        }
                        const [who, A, T2] = rng.pick([
                            ['A car', [2, 2.5, 3, 4], [5, 20]],
                            ['A train', [0.5, 1, 1.5], [20, 60]],
                            ['A runner', [2, 2.5, 3, 4], [3, 10]],
                            ['A cyclist', [1, 1.5, 2], [5, 30]],
                        ]);
                        const a = rng.pick(A), t1 = rng.int(2, who === 'A train' ? 20 : 6), t2 = rng.int(T2[0], T2[1]), v = a * t1;
                        if (!Number.isInteger(v) || (who === 'A runner' && v > 10) || (who === 'A cyclist' && (v > 12 || v < 4)) || (who === 'A car' && v > 30) || (who === 'A train' && v > 30)) continue;
                        const d1 = 0.5 * a * t1 * t1, d2 = v * t2;
                        if (!clean(d1, 2)) continue;
                        return {
                            q: `${who} starts from rest and accelerates at ${a} m/s² for ${t1} s. Then ${the(who)} keeps going at that speed for another ${t2} s. How far does it travel altogether?`,
                            ans: metres(d1 + d2),
                            sol: R`Speeding up: \(\tfrac12 \times ${a} \times ${t1}^2 = ${N(d1)}\) m, reaching \(${a} \times ${t1} = ${v}\) m/s. Steady part: \(${v} \times ${t2} = ${N(d2)}\) m. Total \(= ${N(d1 + d2)}\) m.`,
                        };
                    }
                },
            },
        ],

        assignment: [
            ['find-accel', 4], ['speed-table', 4], ['is-accelerating', 3], ['final-speed', 4],
            ['slowing-down', 4], ['find-time', 3], ['find-start-speed', 2], ['kmh', 3], ['graph-slope', 4], ['compare', 2], ['distance', 3], ['which-graph', 2],
            ['graph-journey', 4], ['free-fall', 4], ['multi-step', 4],
        ],
    });
})();
