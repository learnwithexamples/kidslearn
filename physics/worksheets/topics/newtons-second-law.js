/* Worksheet: Newton's Second Law — F = m × a, net force, weight, and two-step motion problems. */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, F = CA.fig, C = F.colors;

    // ── Numbers ──────────────────────────────────────────────────────────
    const G = 9.8;                                                   // m/s², as on the Acceleration page
    const rd = x => CA.round(x, 3);
    /** Plain-text number: 1200 → "1,200", 0.5 → "0.5". */
    const nf = x => {
        x = rd(x);
        const [i, d] = String(Math.abs(x)).split('.');
        return (x < 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : '');
    };
    /** The same number for TeX (KaTeX needs {,} so the comma gets no space after it). */
    const tn = x => nf(x).replace(/,/g, '{,}');
    const ans = (v, unit) => CA.num(rd(v), unit, { show: m(tn(v)) });
    const N = R`\text{ N}`, KG = R`\text{ kg}`, MS2 = R`\text{ m/s}^2`, MS = R`\text{ m/s}`, S = R`\text{ s}`;
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    /** "a" or "an" before a number said aloud: an 8 kg, an 18 kg, an 11,000 kg. */
    const art = x => (/^(8|1[18](\D|$))/.test(nf(x)) ? 'an' : 'a');
    /** Is x a "clean" number: at most `dp` decimal places? */
    const clean = (x, dp = 2) => Math.abs(rd(x) * 10 ** dp - Math.round(rd(x) * 10 ** dp)) < 1e-6;

    // ── Force-diagram figures ────────────────────────────────────────────
    const RED = '#c92a2a', BLUE = '#1c63c9', GREEN = '#2b8a3e';
    function arrow(x1, y1, x2, y2, color) {
        const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = 9, w = 5;
        const bx = x2 - ux * h, by = y2 - uy * h;
        return F.line(x1, y1, bx, by, { stroke: color, width: 2.6 })
            + F.poly([[x2, y2], [bx - uy * w, by + ux * w], [bx + uy * w, by - ux * w]], { fill: color, stroke: color, width: 1 });
    }
    /**
     * A box on the ground with horizontal force arrows. forces: [{ dir: 1 (right) | -1 (left), mag, label, name? }],
     * at most two per side. Arrow lengths are proportional to the forces.
     */
    function hForces(forces, boxLabel) {
        const max = Math.max(...forces.map(f => f.mag));
        const len = f => 22 + 48 * f.mag / max;
        const bw = 66, bh = 50, labW = 46;
        const side = Math.max(...forces.map(len)) + labW + 6;
        const W = bw + 2 * side, top = 22, bx = side, ground = top + bh;
        let b = '';
        b += F.line(4, ground, W - 4, ground, { width: 1.5 });
        for (let x = 10; x < W - 4; x += 12) b += F.line(x, ground, x - 7, ground + 7, { width: 1, stroke: '#8a94a6' });
        b += F.rect(bx, top, bw, bh, { fill: C.FILL });
        b += F.text(bx + bw / 2, top + bh / 2 + 5, boxLabel, { bold: true });
        for (const dir of [1, -1]) {
            const fs = forces.filter(f => f.dir === dir);
            fs.forEach((f, i) => {
                const y = fs.length === 1 ? top + bh / 2 : top + 14 + i * (bh - 28);
                const x0 = dir > 0 ? bx + bw : bx, x1 = x0 + dir * len(f);
                b += arrow(x0, y, x1, y, dir > 0 ? BLUE : RED);
                b += F.text(x1 + dir * 5, y + 4.5, f.label, { anchor: dir > 0 ? 'start' : 'end', bold: true, fill: dir > 0 ? BLUE : RED });
                if (f.name) b += F.text(x0 + dir * 4, y - 9, f.name, { size: 11, anchor: dir > 0 ? 'start' : 'end', fill: dir > 0 ? BLUE : RED });
            });
        }
        return F.svg(W, ground + 12, b, { label: 'force diagram' });
    }
    /**
     * An object with one upward and one downward force. kind: 'rocket' | 'lift'.
     * up/down: { mag, label }. accel: optional label for an acceleration arrow.
     */
    function vForces(kind, up, down, bodyLabel, accel) {
        const max = Math.max(up.mag, down.mag), len = mag => 22 + 34 * mag / max;
        const ow = kind === 'rocket' ? 30 : 64, oh = kind === 'rocket' ? 70 : 58;
        const W = 250, cx = 92, topY = 8 + len(up.mag) + (kind === 'rocket' ? 0 : 0), H = topY + oh + len(down.mag) + 10;
        let b = '';
        if (kind === 'rocket') {
            const x = cx - ow / 2;
            b += F.path(`M${x} ${topY + 18}Q${cx} ${topY - 8} ${x + ow} ${topY + 18}L${x + ow} ${topY + oh - 6}L${x + ow + 9} ${topY + oh}L${x - 9} ${topY + oh}L${x} ${topY + oh - 6}Z`, { fill: C.FILL });
            b += F.circle(cx, topY + 28, 5, { fill: '#ffffff' });
        } else {
            b += F.line(cx, 0, cx, topY, { width: 1, stroke: '#8a94a6' });
            b += F.rect(cx - ow / 2, topY, ow, oh, { fill: C.FILL });
            b += F.line(cx, topY + 6, cx, topY + oh - 6, { width: 1, stroke: C.DARK });
        }
        b += F.text(cx - ow / 2 - 8, topY + oh / 2 + 4, bodyLabel, { anchor: 'end', bold: true });
        const upY0 = kind === 'rocket' ? topY + 2 : topY;
        b += arrow(cx, upY0, cx, upY0 - len(up.mag), BLUE);
        b += F.text(cx + 10, upY0 - len(up.mag) / 2 + 4, up.label, { anchor: 'start', bold: true, fill: BLUE });
        b += arrow(cx, topY + oh, cx, topY + oh + len(down.mag), RED);
        b += F.text(cx + 10, topY + oh + len(down.mag) / 2 + 4, down.label, { anchor: 'start', bold: true, fill: RED });
        if (accel) {
            const ax = cx + ow / 2 + 22;
            b += arrow(ax, topY + oh - 6, ax, topY + 10, GREEN);
            b += F.text(ax + 8, topY + oh / 2 + 4, accel, { anchor: 'start', size: 12, fill: GREEN });
        }
        return F.svg(W, H, b, { label: 'force diagram' });
    }

    // ── Contexts for the one-step problems ───────────────────────────────
    const THINGS = [
        { n: 'a toy car', m: [0.5, 1, 1.5, 2], a: [2, 3, 4, 5, 6] },
        { n: 'a full shopping cart', m: [20, 25, 30, 40], a: [0.5, 1, 1.5, 2] },
        { n: 'a skateboarder', m: [40, 45, 50, 55, 60], a: [1, 1.5, 2, 3] },
        { n: 'a car', m: [900, 1000, 1200, 1500], a: [1.5, 2, 3, 4] },
        { n: 'a hockey puck', m: [0.2], a: [10, 20, 30, 40, 50] },
        { n: 'a bowling ball', m: [5, 6, 7], a: [1, 2, 3, 4] },
        { n: 'a sled with a child on it', m: [30, 35, 40, 45], a: [0.5, 1, 1.5, 2] },
        { n: 'a delivery truck', m: [3000, 4000, 5000], a: [0.5, 1, 1.5, 2] },
        { n: 'a soccer ball', m: [0.4, 0.5], a: [20, 30, 40, 60] },
        { n: 'a cyclist and her bike', m: [60, 70, 80], a: [0.5, 1, 1.5, 2] },
        { n: 'a wagon', m: [10, 12, 15, 20], a: [1, 2, 3] },
        { n: 'a motorbike with its rider', m: [250, 300, 350], a: [2, 3, 4, 5] },
    ];
    const pickThing = rng => { const t = rng.pick(THINGS); return { n: t.n, mass: rng.pick(t.m), a: rng.pick(t.a) }; };
    const BOXES = ['crate', 'box', 'sled', 'cart', 'trolley', 'wagon'];

    CA.register({
        id: 'newtons-second-law',
        title: "Newton's Second Law",
        page: 'newtons-second-law.html',
        subject: 'Physics',
        assignmentNote: 'Use F = m × a and its rearrangements a = F ÷ m and m = F ÷ a. Force is in newtons (N), mass in kilograms (kg), acceleration in m/s². Weight W = m × g with g = 9.8 m/s². Give each answer in the unit asked for; if it is not a whole number, write it as a decimal (they all come out exactly, so no rounding is needed).',

        practice: [
            // ── Level 1: one step ─────────────────────────────────────────
            {
                id: 'find-force', name: 'Find the force', level: 1,
                gen(rng) {
                    const t = pickThing(rng), f = rd(t.mass * t.a);
                    const q = rng.pick([
                        `${cap(t.n)} has a mass of ${nf(t.mass)} kg. What force is needed to make it accelerate at ${nf(t.a)} m/s²?`,
                        `What force gives ${t.n} of mass ${nf(t.mass)} kg an acceleration of ${nf(t.a)} m/s²?`,
                        `${cap(t.n)} of mass ${nf(t.mass)} kg speeds up with an acceleration of ${nf(t.a)} m/s². What is the net force on it?`,
                    ]);
                    return { q, ans: ans(f, 'N'), sol: R`\(F = m \times a = ${tn(t.mass)} \times ${tn(t.a)} = ${tn(f)}${N}\).` };
                },
            },
            {
                id: 'find-accel', name: 'Find the acceleration', level: 1,
                gen(rng) {
                    const t = pickThing(rng), f = rd(t.mass * t.a);
                    const q = rng.pick([
                        `A net force of ${nf(f)} N acts on ${t.n} of mass ${nf(t.mass)} kg. What is its acceleration?`,
                        `${cap(t.n)} has a mass of ${nf(t.mass)} kg. A force of ${nf(f)} N pushes it forward. How fast does it accelerate?`,
                        `What acceleration does a force of ${nf(f)} N give ${t.n} with a mass of ${nf(t.mass)} kg?`,
                    ]);
                    return { q, ans: ans(t.a, 'm/s²'), sol: R`\(a = \dfrac{F}{m} = \dfrac{${tn(f)}}{${tn(t.mass)}} = ${tn(t.a)}${MS2}\).` };
                },
            },
            {
                id: 'find-mass', name: 'Find the mass', level: 1,
                gen(rng) {
                    const t = pickThing(rng), f = rd(t.mass * t.a);
                    const q = rng.pick([
                        `A net force of ${nf(f)} N makes ${t.n} accelerate at ${nf(t.a)} m/s². What is its mass?`,
                        `${cap(t.n)} accelerates at ${nf(t.a)} m/s² when a force of ${nf(f)} N acts on it. Find its mass.`,
                        `A force of ${nf(f)} N gives ${t.n} an acceleration of ${nf(t.a)} m/s². How much mass does it have?`,
                    ]);
                    return { q, ans: ans(t.mass, 'kg'), sol: R`\(m = \dfrac{F}{a} = \dfrac{${tn(f)}}{${tn(t.a)}} = ${tn(t.mass)}${KG}\).` };
                },
            },

            // ── Level 2: core ─────────────────────────────────────────────
            {
                id: 'net-force-diagram', name: 'Net force from a force diagram', level: 2,
                gen(rng) {
                    for (;;) {
                        const mass = rng.pick([2, 4, 5, 8, 10, 12, 15, 20, 25, 40, 50]);
                        const a = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
                        const net = mass * a;
                        if (!Number.isInteger(net) || net % 5 !== 0 || net < 5 || net > 200) continue;
                        const nWith = rng.int(1, 2), nAgainst = rng.int(1, 2);
                        const against = Array.from({ length: nAgainst }, () => 5 * rng.int(2, 20));
                        const sumAgainst = against.reduce((s, x) => s + x, 0);
                        const total = net + sumAgainst;
                        let withF;
                        if (nWith === 1) withF = [total];
                        else { const p = 5 * rng.int(1, total / 5 - 1); withF = [p, total - p]; }
                        if (withF.some(x => x > 300)) continue;
                        const dir = rng.bool() ? 1 : -1, way = dir > 0 ? 'right' : 'left', other = dir > 0 ? 'left' : 'right';
                        const forces = withF.map(x => ({ dir, mag: x, label: `${x} N` })).concat(against.map(x => ({ dir: -dir, mag: x, label: `${x} N` })));
                        const obj = rng.pick(BOXES);
                        const fig = hForces(rng.shuffle(forces), `${mass} kg`);
                        const grp = xs => (xs.length > 1 ? `(${xs.join(' + ')})` : String(xs[0])), sumW = grp(withF), sumA = grp(against);
                        return {
                            q: `The diagram shows all the horizontal forces on ${art(mass)} ${mass} kg ${obj}. Find the size of its acceleration.`,
                            fig,
                            ans: ans(a, 'm/s²'),
                            sol: R`Net force \(= ${sumW} - ${sumA} = ${net}${N}\) to the ${way}, so \(a = F \div m = ${net} \div ${mass} = ${tn(a)}${MS2}\).`,
                        };
                    }
                },
            },
            {
                id: 'friction-push', name: 'Pushing against friction', level: 2,
                gen(rng) {
                    for (;;) {
                        const mass = rng.pick([10, 12, 15, 20, 25, 30, 40, 50, 60]);
                        const a = rng.pick([0.5, 1, 1.5, 2, 2.5, 3]);
                        const fr = 5 * rng.int(2, 20), P = mass * a + fr;
                        if (!Number.isInteger(P) || P > 260) continue;
                        const thing = rng.pick(['crate', 'box of books', 'sofa', 'filing cabinet', 'washing machine', 'sled', 'large plant pot']);
                        const who = rng.pick(['Maya', 'Leo', 'Sam', 'Priya', 'Omar', 'Zoe', 'Ben', 'Ana']);
                        const fig = hForces([{ dir: 1, mag: P, label: `${P} N`, name: 'push' }, { dir: -1, mag: fr, label: `${fr} N`, name: 'friction' }], `${mass} kg`);
                        if (rng.bool()) {
                            return {
                                q: `${who} pushes ${art(mass)} ${mass} kg ${thing} across the floor with a force of ${P} N. Friction of ${fr} N acts against the motion. What is the acceleration of the ${thing}?`,
                                fig,
                                ans: ans(a, 'm/s²'),
                                sol: R`Net force \(= ${P} - ${fr} = ${tn(P - fr)}${N}\). \(a = \dfrac{F}{m} = \dfrac{${tn(P - fr)}}{${mass}} = ${tn(a)}${MS2}\).`,
                            };
                        }
                        const fig2 = hForces([{ dir: 1, mag: P, label: '? N', name: 'push' }, { dir: -1, mag: fr, label: `${fr} N`, name: 'friction' }], `${mass} kg`);
                        return {
                            q: `${who} wants ${art(mass)} ${mass} kg ${thing} to accelerate at ${nf(a)} m/s². Friction on it is ${fr} N. How hard must ${who} push?`,
                            fig: fig2,
                            ans: ans(P, 'N'),
                            sol: R`The net force needed is \(m \times a = ${mass} \times ${tn(a)} = ${tn(mass * a)}${N}\). The push must also beat friction: \(${tn(mass * a)} + ${fr} = ${P}${N}\).`,
                        };
                    }
                },
            },
            {
                id: 'weight-lift', name: 'Weight and lifting', level: 2,
                gen(rng) {
                    const item = rng.pick([
                        ['a school backpack', [4, 5, 6, 8]], ['a bag of rice', [5, 10, 20, 25]], ['a watermelon', [3, 4, 5, 6]],
                        ['a dog', [12, 15, 20, 30]], ['a sack of potatoes', [10, 15, 20, 25]], ['a suitcase', [15, 18, 20, 23]],
                        ['a bucket of water', [8, 10, 12]], ['a box of tiles', [25, 30, 35]], ['a car engine', [150, 180, 200]],
                    ]);
                    const name = item[0], mass = rng.pick(item[1]), W = rd(mass * G), kind = rng.int(0, 2);
                    if (kind === 0) return {
                        q: `What is the weight of ${name} with a mass of ${mass} kg? (Use g = 9.8 m/s².)`,
                        ans: ans(W, 'N'),
                        sol: R`\(W = m \times g = ${mass} \times 9.8 = ${tn(W)}${N}\).`,
                    };
                    if (kind === 1) return {
                        q: `${cap(name)} weighs ${nf(W)} N. What is its mass? (Use g = 9.8 m/s².)`,
                        ans: ans(mass, 'kg'),
                        sol: R`\(W = m \times g\), so \(m = \dfrac{W}{g} = \dfrac{${tn(W)}}{9.8} = ${mass}${KG}\).`,
                    };
                    return {
                        q: mass > 100
                            ? `A crane lifts ${name} of mass ${mass} kg straight up at a steady speed. How big is the upward force from the crane? (Use g = 9.8 m/s².)`
                            : `You lift ${name} of mass ${mass} kg straight up at a steady speed. How big an upward force must you use? (Use g = 9.8 m/s².)`,
                        ans: ans(W, 'N'),
                        sol: R`Steady speed: \(a = 0\), so lifting force = weight \(= ${mass} \times 9.8 = ${tn(W)}${N}\).`,
                    };
                },
            },
            {
                id: 'proportional', name: 'Doubling the force or the mass', level: 2,
                gen(rng) {
                    const thing = rng.pick(['cart', 'toy car', 'skateboard', 'sled', 'go-kart', 'trolley']);
                    const kind = rng.int(0, 4);
                    const word = { 2: 'doubled', 3: 'tripled', 4: 'made 4 times as big' };
                    const opt = v => m(tn(v)) + ' m/s²';
                    const optN = v => m(tn(v)) + ' N';
                    if (kind === 4) {                                   // force needed for a heavier object
                        const f = rng.pick([6, 8, 10, 12, 15, 20, 24, 30]), k = rng.pick([2, 3, 4]), a = rng.pick([1, 2, 3]);
                        return {
                            q: `A force of ${f} N gives a ${thing} an acceleration of ${a} m/s². A second ${thing} has ${k === 2 ? 'twice' : k === 3 ? 'three times' : 'four times'} the mass. What force gives the second ${thing} the same acceleration?`,
                            ans: CA.mc(rng, optN(f * k), [optN(f), optN(rd(f / k)), optN(f * k * k), optN(f + k)]),
                            sol: R`Same acceleration with ${k} times the mass needs ${k} times the force (\(F = m \times a\)): \(${f} \times ${k} = ${f * k}${N}\).`,
                        };
                    }
                    for (;;) {
                        const a = rng.pick([1, 2, 3, 4, 6, 8, 12]);
                        let k = 1, j = 1;                               // force × k, mass × j
                        if (kind === 0) k = rng.pick([2, 3, 4]);
                        else if (kind === 1) j = rng.pick([2, 3, 4]);
                        else if (kind === 2) { k = rng.pick([2, 3, 4]); j = rng.pick([2, 3, 4]); }
                        else { k = 0.5; }
                        const res = a * k / j;
                        const wrong = [a * k * j, a * j / k, a, a * k, a / j, a * k * k, a / (k * j), a / (j * j)].map(rd).filter(v => v !== rd(res) && clean(v));
                        if (!clean(res) || new Set(wrong).size < 3) continue;
                        const change = kind === 0 ? `the force is ${word[k]} and the mass stays the same`
                            : kind === 1 ? `the mass is ${word[j]} and the force stays the same`
                                : kind === 2 ? (k === j ? `both the force and the mass are ${word[k]}` : `the force is ${word[k]} and the mass is ${word[j]}`)
                                    : 'the force is halved and the mass stays the same';
                        const why = kind === 0 ? `\\(a = F \\div m\\): ${k} times the force gives ${k} times the acceleration`
                            : kind === 1 ? `\\(a = F \\div m\\): ${j} times the mass gives 1/${j} of the acceleration`
                                : kind === 2 ? `\\(a = F \\div m\\): multiply by ${k} for the force and divide by ${j} for the mass`
                                    : `\\(a = F \\div m\\): half the force gives half the acceleration`;
                        return {
                            q: `A force gives a ${thing} an acceleration of ${a} m/s². What is the acceleration if ${change}?`,
                            ans: CA.mc(rng, opt(res), rng.shuffle([...new Set(wrong)]).map(opt)),
                            sol: why + R`, so the new acceleration is \(${tn(res)}${MS2}\).`,
                        };
                    }
                },
            },
            {
                id: 'dv-force', name: 'Acceleration from a change in speed, then the force', level: 2,
                gen(rng) {
                    for (;;) {
                        const ctx = rng.pick([
                            { n: 'car', m: [900, 1000, 1200, 1500], a: [1.5, 2, 2.5, 3, 4], t: [4, 5, 6, 8, 10] },
                            { n: 'cyclist and bike', m: [60, 70, 80, 90], a: [0.5, 1, 1.5, 2], t: [2, 3, 4, 5, 6] },
                            { n: 'sprinter', m: [50, 55, 60, 65, 70], a: [2, 2.5, 3, 4], t: [2, 3] },
                            { n: 'bus', m: [8000, 10000, 12000], a: [0.5, 1, 1.5], t: [6, 8, 10, 12] },
                            { n: 'electric scooter and rider', m: [70, 80, 90], a: [1, 1.5, 2, 2.5], t: [2, 3, 4, 5] },
                        ]);
                        const mass = rng.pick(ctx.m), a = rng.pick(ctx.a), t = rng.pick(ctx.t), dv = rd(a * t);
                        const brake = rng.bool(0.35);
                        const u = brake ? dv : (rng.bool(0.7) ? 0 : rng.int(1, 5)), v = brake ? 0 : rd(u + dv);
                        if (!clean(dv, 1) || v > 40) continue;
                        const Fv = rd(mass * a);
                        const q = brake
                            ? `${cap(art(mass))} ${nf(mass)} kg ${ctx.n} moving at ${nf(u)} m/s slows down steadily and stops in ${t} s. What is the size of the force that stops it?`
                            : u === 0
                                ? `${cap(art(mass))} ${nf(mass)} kg ${ctx.n} starts from rest and reaches ${nf(v)} m/s in ${t} s. What net force speeds it up?`
                                : `${cap(art(mass))} ${nf(mass)} kg ${ctx.n} speeds up steadily from ${nf(u)} m/s to ${nf(v)} m/s in ${t} s. What net force acts on it?`;
                        return {
                            q,
                            ans: ans(Fv, 'N'),
                            sol: R`\(a = \text{change in speed} \div \text{time} = ${tn(dv)} \div ${t} = ${tn(a)}${MS2}\), then \(F = m \times a = ${tn(mass)} \times ${tn(a)} = ${tn(Fv)}${N}\).`,
                        };
                    }
                },
            },

            // ── Level 3: two steps ────────────────────────────────────────
            {
                id: 'force-then-speed', name: 'Force → acceleration → speed', level: 3,
                gen(rng) {
                    for (;;) {
                        const ctx = rng.pick([
                            { n: 'go-kart', m: [80, 100, 120, 150] }, { n: 'bobsled with its crew', m: [300, 400, 500] },
                            { n: 'small boat', m: [200, 250, 300, 400], r: 'water resistance', push: 'Its engine pushes it forward' }, { n: 'sled', m: [20, 25, 30, 40] },
                            { n: 'model car', m: [2, 4, 5] }, { n: 'canoe with two people', m: [150, 160, 180], r: 'water resistance', push: 'The paddlers push it forward' },
                        ]);
                        const mass = rng.pick(ctx.m), a = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), t = rng.int(2, 10);
                        const u = rng.bool(0.6) ? 0 : rng.int(1, 6), v = rd(u + a * t), net = rd(mass * a);
                        if (!Number.isInteger(net) || v > 30) continue;
                        const start = u === 0 ? 'starts from rest' : `is already moving at ${u} m/s`;
                        if (rng.bool(0.6)) return {
                            q: `${cap(art(mass))} ${mass} kg ${ctx.n} ${start}. A steady net force of ${nf(net)} N pushes it forward for ${t} s. How fast is it moving at the end?`,
                            ans: ans(v, 'm/s'),
                            sol: R`\(a = \dfrac{F}{m} = \dfrac{${tn(net)}}{${mass}} = ${tn(a)}${MS2}\). Speed gained \(= a \times t = ${tn(a)} \times ${t} = ${tn(a * t)}${MS}\), so the speed is \(${u} + ${tn(a * t)} = ${tn(v)}${MS}\).`,
                        };
                        const fr = 5 * Math.max(1, Math.round(mass * rng.pick([0.2, 0.5, 1, 1.5]) / 5)), P = net + fr;
                        if (mass < 20) continue;
                        return {
                            q: `${cap(art(mass))} ${mass} kg ${ctx.n} ${start}. ${ctx.push || 'It is pushed forward'} with a force of ${nf(P)} N while ${nf(fr)} N of ${ctx.r || 'friction'} acts against it. What is its speed after ${t} s?`,
                            ans: ans(v, 'm/s'),
                            sol: R`Net force \(= ${tn(P)} - ${tn(fr)} = ${tn(net)}${N}\), so \(a = \dfrac{${tn(net)}}{${mass}} = ${tn(a)}${MS2}\). Speed \(= ${u} + ${tn(a)} \times ${t} = ${tn(v)}${MS}\).`,
                        };
                    }
                },
            },
            {
                id: 'find-friction', name: 'Finding friction from the acceleration', level: 3,
                gen(rng) {
                    for (;;) {
                        const ctx = rng.pick([
                            { s: 'A team pushes {a} {m} kg broken-down car with a total force of {P} N', r: 'friction', m: [800, 900, 1000] },
                            { s: 'A dog pulls {a} {m} kg sled with a force of {P} N', r: 'friction', m: [20, 25, 30, 40] },
                            { s: 'The engine of {a} {m} kg boat gives a forward thrust of {P} N', r: 'water resistance', m: [300, 400, 500, 600] },
                            { s: 'A cyclist and bike of total mass {m} kg push forward with a force of {P} N', r: 'air resistance', m: [60, 70, 75, 80] },
                            { s: 'A worker pushes {a} {m} kg crate with a force of {P} N', r: 'friction', m: [30, 40, 50, 60] },
                            { s: 'The engine of {a} {m} kg car gives a driving force of {P} N', r: 'air resistance and friction', m: [1000, 1200, 1500] },
                        ]);
                        const mass = rng.pick(ctx.m), a = rng.pick([0.2, 0.5, 1, 1.5, 2]), net = rd(mass * a);
                        if (!Number.isInteger(net) || net % 5 !== 0) continue;
                        const fr = Math.round(net * rng.pick([0.25, 0.4, 0.5, 0.6, 0.8, 1, 1.5]) / 5) * 5;
                        if (fr < 5) continue;
                        const P = net + fr, lead = ctx.s.replace('{a}', art(mass)).replace('{m}', nf(mass)).replace('{P}', nf(P));
                        if (rng.bool(0.5)) return {
                            q: `${lead}, and it accelerates at ${nf(a)} m/s². How big is the ${ctx.r} acting against it?`,
                            ans: ans(fr, 'N'),
                            sol: R`Net force \(= m \times a = ${tn(mass)} \times ${tn(a)} = ${tn(net)}${N}\). So \(\text{resistance} = ${tn(P)} - ${tn(net)} = ${tn(fr)}${N}\).`,
                        };
                        const t = rng.pick([2, 4, 5, 10]), u = rng.int(0, 3), v = rd(u + a * t);
                        if (!clean(v, 1)) continue;
                        return {
                            q: `${lead}. Its speed goes up steadily from ${u === 0 ? 'rest' : `${u} m/s`} to ${nf(v)} m/s in ${t} s. How big is the ${ctx.r} acting against it?`,
                            ans: ans(fr, 'N'),
                            sol: R`\(a = \dfrac{${tn(v)} - ${u}}{${t}} = ${tn(a)}${MS2}\), so the net force is \(${tn(mass)} \times ${tn(a)} = ${tn(net)}${N}\). Resistance \(= ${tn(P)} - ${tn(net)} = ${tn(fr)}${N}\).`,
                        };
                    }
                },
            },
            {
                id: 'compare', name: 'Comparing two objects', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    const pair = rng.pick([
                        { p: ['an empty shopping cart', 'a full shopping cart'], m: [10, 15, 20], r: [2, 3, 4] },
                        { p: ['an empty wagon', 'a loaded wagon'], m: [5, 8, 10], r: [2, 3, 4, 5] },
                        { p: ['a toy car', 'a toy truck'], m: [0.5, 1, 2], r: [1.5, 2, 3] },
                        { p: ['an empty sled', 'a sled with a child on it'], m: [5, 6, 8, 10], r: [3, 4, 5] },
                        { p: ['a small car', 'a pickup truck'], m: [800, 1000, 1200], r: [1.5, 2, 2.5] },
                    ]);
                    if (kind === 0) {                                   // same force, find the other acceleration
                        for (;;) {
                            const m1 = rng.pick(pair.m), r = rng.pick(pair.r), a2 = rng.pick([0.5, 1, 1.5, 2, 3, 4]);
                            const m2 = rd(m1 * r), a1 = rd(a2 * r);
                            if (!clean(m2, 1) || a1 > 30) continue;
                            return {
                                q: `The same force acts on ${pair.p[0]} of mass ${nf(m1)} kg and on ${pair.p[1]} of mass ${nf(m2)} kg. The first accelerates at ${nf(a1)} m/s². What is the acceleration of the second?`,
                                ans: ans(a2, 'm/s²'),
                                sol: R`The force is \(F = ${tn(m1)} \times ${tn(a1)} = ${tn(m1 * a1)}${N}\). For the second: \(a = \dfrac{${tn(m1 * a1)}}{${tn(m2)}} = ${tn(a2)}${MS2}\).`,
                            };
                        }
                    }
                    if (kind === 1) {                                   // how many times bigger
                        let m1, r, m2, f;
                        do {
                            m1 = rng.pick([2, 3, 4, 5, 6, 8]); r = rng.pick([2, 3, 4, 5, 1.5, 2.5]); m2 = rd(m1 * r);
                            f = rng.pick([12, 20, 24, 30, 40, 60]);
                        } while (!clean(f / m1) || !clean(f / m2) || !clean(m2, 1));
                        return {
                            q: `Cart A has a mass of ${m1} kg and cart B has a mass of ${nf(m2)} kg. Each is pushed with the same force of ${f} N. How many times bigger is cart A's acceleration than cart B's?`,
                            ans: ans(r, ''),
                            sol: R`\(a_A = \dfrac{${f}}{${m1}} = ${tn(f / m1)}${MS2}\) and \(a_B = \dfrac{${f}}{${tn(m2)}} = ${tn(f / m2)}${MS2}\); \(${tn(f / m1)} \div ${tn(f / m2)} = ${tn(r)}\). (Or: B has ${tn(r)} times the mass.)`,
                        };
                    }
                    for (;;) {                                          // which accelerates more
                        const mA = rng.pick([2, 4, 5, 8, 10, 20]), mB = rng.pick([2, 4, 5, 8, 10, 20]);
                        const aA = rng.pick([1, 1.5, 2, 2.5, 3, 4]), aB = rng.bool(0.2) ? aA : rng.pick([1, 1.5, 2, 2.5, 3, 4]);
                        const fA = rd(mA * aA), fB = rd(mB * aB);
                        if (mA === mB || fA === fB || !Number.isInteger(fA) || !Number.isInteger(fB)) continue;
                        if ((fA > fB) === (aA > aB) && aA !== aB) continue;   // make it a trap: the bigger force is not the bigger acceleration
                        const choices = ['Object A', 'Object B', 'Both have the same acceleration'];
                        const correct = aA > aB ? choices[0] : aB > aA ? choices[1] : choices[2];
                        return {
                            q: `Object A has a mass of ${mA} kg and a net force of ${fA} N acts on it. Object B has a mass of ${mB} kg and a net force of ${fB} N acts on it. Which one has the bigger acceleration?`,
                            ans: CA.mc(rng, correct, choices, { keepOrder: true }),
                            sol: R`\(a_A = \dfrac{${fA}}{${mA}} = ${tn(aA)}${MS2}\) and \(a_B = \dfrac{${fB}}{${mB}} = ${tn(aB)}${MS2}\), so ${aA === aB ? 'they are the same' : `${aA > aB ? 'A' : 'B'} accelerates more`}.`,
                        };
                    }
                },
            },
            {
                id: 'rocket', name: 'Rocket: thrust minus weight', level: 3,
                gen(rng) {
                    const ctx = rng.pick([
                        { n: 'model rocket', m: [0.5, 1, 1.5, 2], a: [10, 15, 20, 25, 30] },
                        { n: 'rocket', m: [20000, 50000, 80000, 100000], a: [2, 3, 5, 8, 10] },
                        { n: 'water rocket', m: [0.5, 1], a: [20, 30, 40] },
                    ]);
                    const mass = ctx.m[rng.int(0, ctx.m.length - 1)], a = rng.pick(ctx.a);
                    const W = rd(mass * G), T = rd(mass * (a + G)), net = rd(T - W);
                    if (rng.bool()) return {
                        q: `${cap(art(mass))} ${nf(mass)} kg ${ctx.n} lifts off straight up. Its engine gives a thrust of ${nf(T)} N. What is its upward acceleration? (Use g = 9.8 m/s².)`,
                        fig: vForces('rocket', { mag: T, label: `thrust ${nf(T)} N` }, { mag: W, label: 'weight' }, `${nf(mass)} kg`),
                        ans: ans(a, 'm/s²'),
                        sol: R`Weight \(= ${tn(mass)} \times 9.8 = ${tn(W)}${N}\). Net force \(= ${tn(T)} - ${tn(W)} = ${tn(net)}${N}\), so \(a = \dfrac{${tn(net)}}{${tn(mass)}} = ${tn(a)}${MS2}\).`,
                    };
                    return {
                        q: `${cap(art(mass))} ${nf(mass)} kg ${ctx.n} must accelerate straight up at ${a} m/s². What thrust must its engine give? (Use g = 9.8 m/s².)`,
                        fig: vForces('rocket', { mag: T, label: 'thrust = ?' }, { mag: W, label: 'weight' }, `${nf(mass)} kg`, `a = ${a} m/s²`),
                        ans: ans(T, 'N'),
                        sol: R`Net force needed \(= ${tn(mass)} \times ${a} = ${tn(net)}${N}\). Weight \(= ${tn(mass)} \times 9.8 = ${tn(W)}${N}\). Thrust \(= ${tn(net)} + ${tn(W)} = ${tn(T)}${N}\).`,
                    };
                },
            },
            {
                id: 'lift', name: 'A lift (elevator) going up', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 1) {                                   // bathroom scales in a lift
                        const mass = rng.pick([30, 35, 40, 45, 50, 55, 60, 70]), a = rng.pick([0.2, 0.5, 1, 1.2, 1.5, 2, 2.2]);
                        const Nf = rd(mass * (G + a)), W = rd(mass * G);
                        return {
                            q: `${cap(art(mass))} ${mass} kg student stands on bathroom scales in a lift. The lift starts going up with an acceleration of ${nf(a)} m/s². What upward force do the scales push on the student with? (Use g = 9.8 m/s².)`,
                            ans: ans(Nf, 'N'),
                            sol: R`Weight \(= ${mass} \times 9.8 = ${tn(W)}${N}\). Net upward force needed \(= ${mass} \times ${tn(a)} = ${tn(mass * a)}${N}\). Scales push \(${tn(W)} + ${tn(mass * a)} = ${tn(Nf)}${N}\).`,
                        };
                    }
                    const M = rng.pick([500, 600, 800, 1000, 1200, 1500]), a = rng.pick([0.5, 1, 1.2, 1.5, 2]);
                    const W = rd(M * G), T = rd(M * (G + a)), net = rd(M * a);
                    if (kind === 0) return {
                        q: `A lift and its passengers have a total mass of ${nf(M)} kg. It accelerates upward at ${nf(a)} m/s². What is the pulling force (tension) in the cable? (Use g = 9.8 m/s².)`,
                        fig: vForces('lift', { mag: T, label: 'tension = ?' }, { mag: W, label: 'weight' }, `${nf(M)} kg`, `a = ${nf(a)} m/s²`),
                        ans: ans(T, 'N'),
                        sol: R`Weight \(= ${tn(M)} \times 9.8 = ${tn(W)}${N}\). Net force \(= ${tn(M)} \times ${tn(a)} = ${tn(net)}${N}\) upward. Tension \(= ${tn(W)} + ${tn(net)} = ${tn(T)}${N}\).`,
                    };
                    return {
                        q: `A lift and its passengers have a total mass of ${nf(M)} kg. The cable pulls up with a force of ${nf(T)} N. What is the lift's upward acceleration? (Use g = 9.8 m/s².)`,
                        fig: vForces('lift', { mag: T, label: `tension ${nf(T)} N` }, { mag: W, label: 'weight' }, `${nf(M)} kg`),
                        ans: ans(a, 'm/s²'),
                        sol: R`Weight \(= ${tn(M)} \times 9.8 = ${tn(W)}${N}\). Net force \(= ${tn(T)} - ${tn(W)} = ${tn(net)}${N}\), so \(a = \dfrac{${tn(net)}}{${tn(M)}} = ${tn(a)}${MS2}\).`,
                    };
                },
            },
        ],

        assignment: [
            ['find-force', 5], ['find-accel', 5], ['find-mass', 5],
            ['net-force-diagram', 5], ['friction-push', 5], ['weight-lift', 4], ['proportional', 5], ['dv-force', 4],
            ['force-then-speed', 3], ['find-friction', 3], ['compare', 2], ['rocket', 2], ['lift', 2],
        ],
    });
})();
