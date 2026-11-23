/* Worksheet: Electricity & Circuits — open and closed circuits, conductors and insulators,
 * Ohm's law, series and parallel circuits, meters, power and energy. */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, C = F.colors;

    // ── Numbers ──────────────────────────────────────────────────────────
    const SUB = ['₀', '₁', '₂', '₃', '₄', '₅'];
    const fmt = x => String(CA.round(x, 4));
    const ok2 = x => isFinite(x) && Math.abs(Math.round(x * 100) - x * 100) < 1e-7;   // at most 2 decimal places
    const cap = s => s[0].toUpperCase() + s.slice(1);
    /** "a" or "an" before a number as it is read aloud: an 8 V battery, an 11 Ω resistor, a 12 V battery. */
    const an = x => (/^(8|11(\D|$)|18(\D|$))/.test(String(x)) ? 'an' : 'a');
    const An = x => cap(an(x));
    const SUBS = '₀₁₂₃₄₅₆₇₈₉';
    /** Names with subscripts in maths: "R₂" → \(R_2\). Used on question and solution text. */
    const tn = s => s.replace(/([A-Za-z])([₀-₉]+)/g, (m, a, d) => R`\(${a}_{${[...d].map(c => SUBS.indexOf(c)).join('')}}\)`);
    /** SVG text with real subscripts (the Unicode ones print tiny): "R₁ = 6 Ω". */
    function svgSub(s) {
        let open = 0;
        const out = String(s).replace(/[₀-₉]+/g, d => { open++; return `<tspan dy="3" font-size="0.75em">${[...d].map(c => SUBS.indexOf(c)).join('')}</tspan><tspan dy="-3">`; });
        return out + '</tspan>'.repeat(open);
    }
    const txt = (x, y, s, opt) => F.text(x, y, svgSub(s), opt);
    const NAMES = ['Maya', 'Leo', 'Priya', 'Sam', 'Aiden', 'Zoe', 'Omar', 'Lily', 'Ken', 'Ava'];

    // ── Circuit model ────────────────────────────────────────────────────
    // A circuit is a battery on the left, `top` and `bottom` parts in the main line,
    // and `rungs`: branches in parallel between the top and bottom wires (the last
    // rung is the right-hand side of the loop). Every part has a type t:
    //   'R' resistor, 'bulb', 'sw' switch, 'A' ammeter, 'V' voltmeter (as a branch),
    //   'gap' broken wire, 'mat' an object clipped into a gap.
    // A part in `top` with vm: true has a voltmeter (vmName) connected across it.
    const res = (name, val, o = {}) => ({ t: 'R', name, val, ...o });
    const bulb = (name, val, o = {}) => ({ t: 'bulb', name, val, ...o });
    const sw = (name, closed) => ({ t: 'sw', name, closed });
    const amm = name => ({ t: 'A', name });
    const vm = name => ({ t: 'V', name });

    /** Resistance of one part (wires, ammeters and closed switches are 0, gaps and open switches infinite). */
    function rOf(c) {
        switch (c.t) {
            case 'R': case 'bulb': return c.broken ? Infinity : (c.val == null ? 1 : c.val);
            case 'sw': return c.closed ? 0 : Infinity;
            case 'mat': return c.cond ? 0 : Infinity;
            case 'A': return 0;
            default: return Infinity;                                   // 'V', 'gap'
        }
    }
    const sumR = parts => parts.reduce((s, c) => s + rOf(c), 0);
    /** Current and voltage of every named part, by series–parallel reduction. */
    function solve(spec) {
        const main = [...(spec.top || []), ...(spec.bottom || [])];
        const Rm = sumR(main), Rk = spec.rungs.map(sumR);
        const g = Rk.reduce((s, r) => s + (r === Infinity ? 0 : 1 / r), 0);
        const Rp = g === 0 ? Infinity : 1 / g, Rt = Rm + Rp;
        const V = spec.noBattery ? 0 : spec.V;
        const I = Rt === Infinity ? 0 : V / Rt, Vp = Rp === Infinity ? (Rm === Infinity ? 0 : V) : I * Rp;
        const out = { Rt, Rp, I, Vp, part: {} };
        const put = (c, i) => { if (c.name) out.part[c.name] = { I: i, V: c.t === 'V' ? Vp : (rOf(c) === Infinity ? 0 : i * rOf(c)), P: i * i * (isFinite(rOf(c)) ? rOf(c) : 0) }; };
        main.forEach(c => put(c, I));
        spec.rungs.forEach((rung, k) => rung.forEach(c => put(c, Rk[k] === Infinity ? 0 : Vp / Rk[k])));
        for (const c of spec.top || []) if (c.vm) out.part[c.vmName || 'V'] = { V: I * rOf(c) };
        return out;
    }

    // ── Circuit diagrams ─────────────────────────────────────────────────
    const HALF = { R: 15, bulb: 10, A: 10, V: 10, sw: 13, gap: 9, mat: 16 };
    const WHITE = '#ffffff';
    function drawPart(c, x, y, dir) {
        const h = dir === 'h';
        switch (c.t) {
            case 'R': return h ? F.rect(x - 15, y - 6, 30, 12, { fill: WHITE }) : F.rect(x - 6, y - 15, 12, 30, { fill: WHITE });
            case 'bulb': {
                const d = 7.07;
                return F.circle(x, y, 10, { fill: WHITE }) + F.line(x - d, y - d, x + d, y + d, { width: 1.2 }) + F.line(x - d, y + d, x + d, y - d, { width: 1.2 });
            }
            case 'A': case 'V':
                return F.circle(x, y, 10, { fill: WHITE }) + txt(x, y + 4, c.name || c.t, { size: 12, bold: true });
            case 'sw': {
                const s = 13;
                let b = h ? F.dot(x - s, y) + F.dot(x + s, y) : F.dot(x, y - s) + F.dot(x, y + s);
                if (c.closed) b += h ? F.line(x - s, y, x + s, y) : F.line(x, y - s, x, y + s);
                else b += h ? F.line(x - s, y, x + s - 3, y - 13) : F.line(x, y + s, x - 13, y - s + 3);
                return b;
            }
            case 'gap': return h ? F.circle(x - 9, y, 2.5, { fill: WHITE }) + F.circle(x + 9, y, 2.5, { fill: WHITE }) : F.circle(x, y - 9, 2.5, { fill: WHITE }) + F.circle(x, y + 9, 2.5, { fill: WHITE });
            case 'mat': return F.rect(x - 13, y - 4, 26, 8, { fill: C.SHADE, width: 1 }) + F.dot(x - 16, y, { r: 3 }) + F.dot(x + 16, y, { r: 3 });
        }
        return '';
    }
    /** Wire from a to b (horizontal or vertical) with parts centred at the given positions along it. */
    function wire(x1, y1, x2, y2, parts, centers) {
        const h = y1 === y2;
        let b = '', at = h ? x1 : y1;
        parts.forEach((c, i) => {
            const m = centers[i], hl = c.t === 'cell' ? 3 : HALF[c.t];
            b += h ? F.line(at, y1, m - hl, y1) : F.line(x1, at, x1, m - hl);
            b += c.t === 'cell' ? '' : drawPart(c, h ? m : x1, h ? y1 : m, h ? 'h' : 'v');
            at = m + hl;
        });
        b += h ? F.line(at, y1, x2, y2) : F.line(x1, at, x2, y2);
        return b;
    }
    /** Label lines for a part: [name, value] (value may be ''). */
    function labelOf(c) {
        if (c.label) return c.label;
        if (c.t === 'R') return [c.name, c.unknown ? '= ?' : c.val == null ? '' : `${fmt(c.val)} Ω`];
        if (c.t === 'bulb') return [c.name || '', c.val == null || c.hideVal ? '' : `${fmt(c.val)} Ω`];
        if (c.t === 'sw') return [c.name || '', ''];
        if (c.t === 'mat') return [c.name, ''];
        return ['', ''];
    }
    function circuit(spec) {
        const top = spec.top || [], bot = spec.bottom || [], rungs = spec.rungs;
        const hasVm = top.some(c => c.vm);
        const nMain = Math.max(top.length, bot.length);
        const slot = spec.slot || 58;
        const x0 = 48, y0 = hasVm ? 64 : 34, hh = spec.h || (rungs.some(r => r.length > 1) ? 124 : 100), y1 = y0 + hh, ym = (y0 + y1) / 2;
        const xr0 = nMain ? x0 + nMain * slot + 6 : x0 + 70, gapR = spec.gapR || 72;
        const xr = rungs.map((_, k) => xr0 + gapR * k);
        const xl = xr[xr.length - 1];
        const lastLab = rungs[rungs.length - 1].some(c => labelOf(c).join('') !== '');
        const W = xl + (lastLab ? 50 : 18), H = y1 + (bot.length ? 30 : 14);
        let b = '';
        // left side: battery
        if (spec.noBattery) b += F.line(x0, y1, x0, y0);
        else {
            b += F.line(x0, y1, x0, ym + 3) + F.line(x0, ym - 3, x0, y0);
            b += F.line(x0 - 13, ym - 3, x0 + 13, ym - 3, { width: 1.6 }) + F.line(x0 - 6, ym + 3, x0 + 6, ym + 3, { width: 4 });
            b += F.text(x0 - 17, ym + 4, spec.vLabel || `${fmt(spec.V)} V`, { anchor: 'end', size: 12 });
        }
        // main line, top and bottom
        const centers = n => Array.from({ length: n }, (_, i) => x0 + (xr0 - x0) * (i + 0.5) / n);
        const ct = centers(top.length), cb = centers(bot.length), w = top.length ? (xr0 - x0) / top.length : 0;
        b += wire(x0, y0, xr0, y0, top, ct) + wire(x0, y1, xr0, y1, bot, cb);
        if (xl > xr0) b += F.line(xr0, y0, xl, y0) + F.line(xr0, y1, xl, y1);
        top.forEach((c, i) => {
            const [a, v] = labelOf(c), s = a && v ? (c.t === 'R' && !c.unknown ? `${a} = ${v}` : c.t === 'R' ? `${a} ${v}` : `${a} (${v})`) : a || v;
            if (c.vm) {
                const off = Math.min(HALF[c.t] + 8, w / 2 - 4), L = ct[i] - off, Rr = ct[i] + off, yv = y0 - 30;
                b += F.line(L, y0, L, yv) + F.line(L, yv, ct[i] - 10, yv) + F.line(ct[i] + 10, yv, Rr, yv) + F.line(Rr, yv, Rr, y0);
                b += drawPart({ t: 'V', name: c.vmName || 'V' }, ct[i], yv, 'h') + F.dot(L, y0) + F.dot(Rr, y0);
                if (s) b += txt(ct[i], y0 + 24, s, { size: 11 });
            } else if (s) b += txt(ct[i], y0 - (c.t === 'sw' ? 19 : c.t === 'R' ? 11 : 15), s, { size: 11 });
        });
        bot.forEach((c, i) => { const s = labelOf(c).filter(Boolean).join(' '); if (s) b += txt(cb[i], y1 + 21, s, { size: 11 }); });
        // branches
        rungs.forEach((rung, k) => {
            const ys = rung.map((_, j) => y0 + hh * (j + 1) / (rung.length + 1));
            b += wire(xr[k], y0, xr[k], y1, rung, ys);
            rung.forEach((c, j) => {
                const [a, v] = labelOf(c), dx = c.t === 'sw' ? 8 : c.t === 'R' ? 11 : 14;
                if (a && v) b += txt(xr[k] + dx, ys[j] - 2, a, { anchor: 'start', size: 11 }) + txt(xr[k] + dx, ys[j] + 12, v, { anchor: 'start', size: 11 });
                else if (a || v) b += txt(xr[k] + dx, ys[j] + 4, a || v, { anchor: 'start', size: 11 });
            });
            if (k < rungs.length - 1) b += F.dot(xr[k], y0) + F.dot(xr[k], y1);
        });
        return F.svg(W, H, b, { label: 'circuit diagram' });
    }
    /** Two resistors in parallel between terminals X and Y. */
    function pairFig(a, b) {
        const yA = 26, yB = 94, ym = 60, xa = 60, xb = 190;
        let s = F.circle(18, ym, 3.5, { fill: WHITE }) + F.line(21.5, ym, xa, ym) + F.line(xb, ym, 228.5, ym) + F.circle(232, ym, 3.5, { fill: WHITE });
        s += F.line(xa, yA, xa, yB) + F.line(xb, yA, xb, yB) + F.dot(xa, ym) + F.dot(xb, ym);
        s += wire(xa, yA, xb, yA, [{ t: 'R' }], [125]) + wire(xa, yB, xb, yB, [{ t: 'R' }], [125]);
        s += txt(125, yA - 11, `R₁ = ${a} Ω`, { size: 11 }) + txt(125, yB + 22, `R₂ = ${b} Ω`, { size: 11 });
        s += F.text(18, ym - 9, 'X', { size: 12, bold: true }) + F.text(232, ym - 9, 'Y', { size: 12, bold: true });
        return F.svg(250, 124, s, { label: 'two resistors in parallel' });
    }

    /** Pairs (a, b) whose parallel combination ab/(a+b) is a whole number. */
    const PAIRS = [];
    for (let a = 2; a <= 60; a++) for (let b = a; b <= 60; b++) if ((a * b) % (a + b) === 0) PAIRS.push([a, b]);
    const rpar = (a, b) => a * b / (a + b);
    const DISTINCT = PAIRS.filter(([a, b]) => a !== b);
    const pickPair = rng => { const [a, b] = rng.pick(rng.bool(0.8) ? DISTINCT : PAIRS); return rng.bool() ? [a, b] : [b, a]; };

    // ── Bulb sets ────────────────────────────────────────────────────────
    const B = k => `B${SUB[k]}`;
    function setStr(list, n) {
        if (!list.length) return 'None of the bulbs';
        if (list.length === n) return n === 2 ? 'Both bulbs' : `All ${n} bulbs`;
        if (list.length === 1) return `${list[0]} only`;
        return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]} only`;
    }
    function bulbsOf(spec) {
        const all = [...(spec.top || []), ...(spec.bottom || []), ...spec.rungs.flat()].filter(c => c.t === 'bulb');
        return all.map(c => c.name).sort();
    }
    function litOf(spec) { const s = solve(spec); return bulbsOf(spec).filter(n => s.part[n].I > 1e-9); }
    /** Wrong answers for a "which bulbs" question: other subsets of the bulbs. */
    function subsetChoices(rng, names, correct) {
        const n = names.length, subsets = [];
        for (let m = 0; m < (1 << n); m++) subsets.push(names.filter((_, i) => m & (1 << i)));
        const corr = tn(setStr(correct, n));
        const near = subsets.filter(s => Math.abs(s.length - correct.length) <= 1 || s.length === 0 || s.length === n);
        const wrong = rng.shuffle(near).map(s => tn(setStr(s, n))).filter(s => s !== corr);
        return CA.mc(rng, corr, [...new Set(wrong)].slice(0, 3));
    }

    // ── Materials ────────────────────────────────────────────────────────
    const CONDUCTORS = [['a copper wire', 'copper wire'], ['an iron nail', 'iron nail'], ['a steel paper clip', 'paper clip'], ['a strip of aluminum foil', 'aluminum foil'],
        ['a silver spoon', 'silver spoon'], ['a gold ring', 'gold ring'], ['a steel key', 'steel key'], ['a steel fork', 'steel fork']];
    const INSULATORS = [['a rubber band', 'rubber band'], ['a plastic ruler', 'plastic ruler'], ['a wooden craft stick', 'wooden stick'], ['a glass marble', 'glass marble'],
        ['a plastic straw', 'plastic straw'], ['a rubber eraser', 'rubber eraser'], ['a glass rod', 'glass rod'], ['a wooden spoon', 'wooden spoon']];

    const lesson = {
        id: 'circuits',
        title: 'Electricity & Circuits',
        page: 'circuits.html',
        subject: 'Physics',
        assignmentNote: 'Use V = I × R, P = V × I and E = P × t. Give each answer with its unit: volts (V), amps (A), ohms (Ω), watts (W), or the energy unit asked for. All answers are whole numbers or short decimals, so no rounding is needed. Wires, closed switches and ammeters have no resistance; voltmeters let no current through.',

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'ohm-voltage', name: "Ohm's law: find the voltage", level: 1,
                gen(rng) {
                    const I = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6]), r = rng.int(2, 24), V = CA.round(I * r, 4);
                    if (V > 60) return this.gen(rng);
                    const sol = R`\(V = I \times R = ${fmt(I)} \times ${r} = ${fmt(V)}\) V.`;
                    const k = rng.int(0, 4);
                    if (k === 3) {
                        const spec = { V, vLabel: '? V', top: [amm('A')], rungs: [[res('R', r)]] };
                        return { q: `The ammeter in this circuit reads ${fmt(I)} A. What is the voltage of the battery?`, fig: circuit(spec), ans: CA.num(V, 'V'), sol, chk: { spec, ask: 'Vbat', given: { A: I } } };
                    }
                    const q = [
                        `A current of ${fmt(I)} A flows through ${an(r)} ${r} Ω resistor. What is the voltage across the resistor?`,
                        `A flashlight bulb has a resistance of ${r} Ω. When it is on, a current of ${fmt(I)} A flows through it. What is the voltage across the bulb?`,
                        `A toy motor has a resistance of ${r} Ω and needs a current of ${fmt(I)} A to spin. What voltage must the battery supply?`,
                        null,
                        `A heating coil with a resistance of ${r} Ω carries a current of ${fmt(I)} A. Find the voltage across the coil.`,
                    ][k];
                    return { q, ans: CA.num(V, 'V'), sol };
                },
            },
            {
                id: 'ohm-rearrange', name: "Ohm's law: find the current or the resistance", level: 1,
                gen(rng) {
                    let I, r, V;
                    do { I = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8]); r = rng.int(2, 30); V = CA.round(I * r, 4); } while ((!Number.isInteger(V) && rng.bool(0.7)) || V > 48);
                    const findI = rng.bool(), k = rng.int(0, 2);
                    const solI = R`\(I = \dfrac{V}{R} = \dfrac{${fmt(V)}}{${r}} = ${fmt(I)}\) A.`, solR = R`\(R = \dfrac{V}{I} = \dfrac{${fmt(V)}}{${fmt(I)}} = ${r}\) Ω.`;
                    if (k === 2) {
                        if (findI) {
                            const spec = { V, top: [amm('A')], rungs: [[res('R', r)]] };
                            return { q: 'What does the ammeter in this circuit read?', fig: circuit(spec), ans: CA.num(I, 'A'), sol: solI, chk: { spec, ask: 'I', of: 'A' } };
                        }
                        const spec = { V, top: [amm('A')], rungs: [[res('R', r, { unknown: true })]] };
                        return { q: `The ammeter reads ${fmt(I)} A. What is the resistance of R?`, fig: circuit(spec), ans: CA.num(r, 'Ω'), sol: solR, chk: { spec, ask: 'Rval', of: 'R', given: { A: I } } };
                    }
                    if (findI) {
                        const q = [`${An(fmt(V))} ${fmt(V)} V battery is connected to ${an(r)} ${r} Ω resistor. What current flows through the resistor?`,
                            `A bulb with a resistance of ${r} Ω is connected to ${an(fmt(V))} ${fmt(V)} V battery. How much current flows through the bulb?`][k];
                        return { q, ans: CA.num(I, 'A'), sol: solI };
                    }
                    const q = [`${An(fmt(V))} ${fmt(V)} V battery pushes a current of ${fmt(I)} A through a bulb. What is the resistance of the bulb?`,
                        `When a voltage of ${fmt(V)} V is put across a coil of wire, a current of ${fmt(I)} A flows. What is the resistance of the coil?`][k];
                    return { q, ans: CA.num(r, 'Ω'), sol: solR };
                },
            },
            {
                id: 'power-basic', name: 'Power: P = V × I', level: 1,
                gen(rng) {
                    const dev = rng.pick([
                        ['phone charger', [5, 9], [1, 1.5, 2, 3]], ['car headlight', [12], [4, 5, 6, 8]], ['laptop charger', [19, 20], [2, 3, 4]],
                        ['lamp plugged into a 120 V wall outlet', [120], [0.25, 0.5, 1]], ['electric kettle plugged into a 120 V outlet', [120], [10, 12, 15]],
                        ['toy car motor', [3, 4.5, 6], [0.5, 1, 2]], ['flashlight bulb', [3, 4.5, 6], [0.2, 0.5, 1]], ['electric fan', [12, 24], [2, 2.5, 3]]]);
                    const [name, Vs, Is] = dev, V = rng.pick(Vs), I = rng.pick(Is), P = CA.round(V * I, 4);
                    const wall = /120 V/.test(name), k = rng.int(0, 4);
                    const an = /^[aeiou]/.test(name) ? 'An' : 'A';
                    if (k <= 2) return {
                        q: wall ? `${an} ${name} draws a current of ${fmt(I)} A. How much power does it use?` : `${an} ${name} works at ${fmt(V)} V and draws a current of ${fmt(I)} A. How much power does it use?`,
                        ans: CA.num(P, 'W'), sol: R`\(P = V \times I = ${fmt(V)} \times ${fmt(I)} = ${fmt(P)}\) W.`,
                    };
                    if (k === 3) return {
                        q: wall ? `${an} ${name} uses ${fmt(P)} W of power. What current does it draw?` : `${an} ${name} works at ${fmt(V)} V and uses ${fmt(P)} W of power. What current does it draw?`,
                        ans: CA.num(I, 'A'), sol: R`\(I = \dfrac{P}{V} = \dfrac{${fmt(P)}}{${fmt(V)}} = ${fmt(I)}\) A.`,
                    };
                    if (wall) return this.gen(rng);
                    return {
                        q: `${an} ${name} uses ${fmt(P)} W of power and draws a current of ${fmt(I)} A. What voltage does it work at?`,
                        ans: CA.num(V, 'V'), sol: R`\(V = \dfrac{P}{I} = \dfrac{${fmt(P)}}{${fmt(I)}} = ${fmt(V)}\) V.`,
                    };
                },
            },
            {
                id: 'open-closed', name: 'Will the bulb light? Open and closed circuits', level: 1,
                gen(rng) {
                    const fault = rng.pick(['none', 'none', 'open', 'open', 'gap', 'nobat', 'two']);
                    const V = rng.pick([1.5, 3, 4.5, 6, 9]);
                    const spec = { V, rungs: [[bulb('b1', null, { label: ['', ''] })]], top: [], bottom: [] };
                    if (fault === 'two') {
                        const which = rng.int(0, 1);
                        spec.top = [sw('S₁', which !== 0)]; spec.bottom = [sw('S₂', which !== 1)];
                    } else {
                        spec.top = [sw('S', fault !== 'open')];
                        if (fault === 'gap') spec.bottom = [{ t: 'gap' }];
                        if (fault === 'nobat') spec.noBattery = true;
                        if (rng.bool(0.4) && fault !== 'gap') spec.top.push(bulb('b2', null, { label: ['', ''] }));
                    }
                    const two = spec.top.some(c => c.t === 'bulb');
                    const C4 = {
                        none: 'Yes — it is a closed circuit', open: 'No — a switch is open',
                        gap: 'No — there is a gap in the wire', nobat: 'No — there is no battery',
                    };
                    const key = fault === 'two' ? 'open' : fault;
                    const nm = rng.pick(NAMES);
                    const q = rng.pick(two
                        ? [`Will the bulbs in this circuit light? Choose the best answer.`, `${nm} builds this circuit with two bulbs. Do the bulbs glow?`, `Look at the circuit diagram. Will the two bulbs light up?`]
                        : [`Will the bulb in this circuit light? Choose the best answer.`, `${nm} builds this circuit. Does the bulb glow?`, `Look at the circuit diagram. Will the bulb light up?`]);
                    const lit = litOf(spec).length > 0;
                    if (lit !== (key === 'none')) throw new Error('open-closed: picture and answer disagree');
                    const sol = {
                        none: 'Every switch is closed and there is a battery, so there is a complete path: current flows and the bulb lights.',
                        open: 'An open switch breaks the loop. With an open circuit no current flows, so the bulb stays dark.',
                        gap: 'The gap breaks the loop. With an open circuit no current flows, so the bulb stays dark.',
                        nobat: 'The loop is complete, but nothing provides a voltage (the push), so no current flows.',
                    }[key];
                    return { q, fig: circuit(spec), ans: CA.mc(rng, C4[key], Object.values(C4).filter(s => s !== C4[key])), sol, chk: { spec, ask: 'lit-any', yes: key === 'none' } };
                },
            },
            {
                id: 'conductors', name: 'Conductors and insulators', level: 1,
                gen(rng) {
                    const k = rng.int(0, 2);
                    if (k === 0) {
                        const cond = rng.bool(), [full, short] = rng.pick(cond ? CONDUCTORS : INSULATORS), nm = rng.pick(NAMES);
                        const spec = { V: rng.pick([3, 4.5, 6]), top: [{ t: 'mat', name: short, cond }], rungs: [[bulb('b1', null, { label: ['', ''] })]], slot: 92 };
                        const yes = `Yes — ${short} is a conductor`, no = `No — ${short} is an insulator`;
                        return {
                            q: `${nm} clips ${full} into the gap in this circuit. Will the bulb light?`, fig: circuit(spec),
                            ans: CA.mc(rng, cond ? yes : no, [cond ? no : yes, `Yes — ${short} is an insulator`, `No — ${short} is a conductor`]),
                            sol: cond ? `${cap(short)} is a metal, so it is a conductor (low resistance). The loop is complete and the bulb lights.` : `${cap(short)} is an insulator (very high resistance), so the circuit stays open and the bulb does not light.`,
                            chk: { spec, ask: 'lit-any', yes: cond },
                        };
                    }
                    const wantIns = k === 1;
                    const one = rng.pick(wantIns ? INSULATORS : CONDUCTORS)[0], others = rng.sample(wantIns ? CONDUCTORS : INSULATORS, 3).map(x => x[0]);
                    return {
                        q: wantIns ? 'Which of these is an insulator (it does not let electricity flow through it)?' : 'Which of these would make a bulb light if it were clipped into a gap in a circuit?',
                        ans: CA.mc(rng, one, others),
                        sol: wantIns ? `Rubber, plastic, wood and glass are insulators; metals are conductors. So the answer is ${one}.` : `Only a conductor completes the circuit. Metals conduct; rubber, plastic, wood and glass do not. So the answer is ${one}.`,
                    };
                },
            },
            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'series-circuit', name: 'Series circuits: total resistance, current, voltages', level: 2,
                gen(rng) {
                    const n = rng.bool(0.6) ? 2 : 3;
                    let rs, rt, I, V;
                    do {
                        rs = Array.from({ length: n }, () => rng.int(1, 12)); rt = rs.reduce((a, b) => a + b, 0);
                        I = rng.pick([0.5, 1, 1.5, 2, 2.5, 3]); V = CA.round(I * rt, 4);
                    } while (!Number.isInteger(V) || V > 48 || V < 3);
                    const ask = rng.pick(['Rt', 'I', 'I', 'Vk', 'Vk']);
                    const parts = rs.map((r, i) => res(`R${SUB[i + 1]}`, r));
                    const top = ask === 'I' ? [amm('A'), ...parts.slice(0, -1)] : parts.slice(0, -1);
                    const spec = { V, top, rungs: [[parts[n - 1]]] };
                    const sumTex = rs.join(' + ');
                    const solRt = R`In series the resistances add: \(R_T = ${sumTex} = ${rt}\) Ω.`;
                    const intro = `${n === 2 ? 'Two' : 'Three'} resistors are connected in series with ${an(V)} ${V} V battery.`;
                    if (ask === 'Rt') return { q: `${intro} What is the total resistance of the circuit?`, fig: circuit(spec), ans: CA.num(rt, 'Ω'), sol: solRt, chk: { spec, ask: 'Rt' } };
                    if (ask === 'I') return {
                        q: `${intro} What does the ammeter read?`, fig: circuit(spec), ans: CA.num(I, 'A'),
                        sol: R`${solRt} \(I = \dfrac{V}{R_T} = \dfrac{${V}}{${rt}} = ${fmt(I)}\) A.`, chk: { spec, ask: 'I', of: 'A' },
                    };
                    const j = rng.int(1, n), vj = CA.round(I * rs[j - 1], 4);
                    return {
                        q: R`${intro} What is the voltage across \(R_${j}\)?`, fig: circuit(spec), ans: CA.num(vj, 'V'),
                        sol: R`\(R_T = ${sumTex} = ${rt}\) Ω, so \(I = ${V} \div ${rt} = ${fmt(I)}\) A. Then \(V_${j} = I \times R_${j} = ${fmt(I)} \times ${rs[j - 1]} = ${fmt(vj)}\) V.`,
                        chk: { spec, ask: 'V', of: `R${SUB[j]}` },
                    };
                },
            },
            {
                id: 'series-share', name: 'Series circuits: voltmeter and ammeter readings', level: 2,
                gen(rng) {
                    const k = rng.int(0, 2);
                    if (k === 0) {                                           // voltages add up to the battery voltage
                        const V = rng.pick([6, 9, 12, 4.5, 24, 18]), v1 = CA.round(rng.int(1, 2 * V - 1) / 2, 2), v2 = CA.round(V - v1, 2);
                        if (v1 === v2 && rng.bool(0.7)) return this.gen(rng);
                        const bulbs = rng.bool();
                        const c1 = bulbs ? bulb('B₁', null) : res('R₁', null), c2 = bulbs ? bulb('B₂', null) : res('R₂', null);
                        // choose resistances that really give these voltages, for the checker
                        c1.val = v1 * 2; c2.val = v2 * 2; c1.hideVal = c2.hideVal = true;
                        if (!bulbs) { c1.label = ['R₁', '']; c2.label = ['R₂', '']; }
                        const spec = { V, top: [{ ...c1, vm: true, vmName: 'V₁' }, { ...c2, vm: true, vmName: 'V₂' }], rungs: [[]] };
                        return {
                            q: `Voltmeter V₁ reads ${fmt(v1)} V. What does voltmeter V₂ read?`, fig: circuit(spec), ans: CA.num(v2, 'V'),
                            sol: R`In series the battery voltage is shared: \(V_1 + V_2 = ${fmt(V)}\), so \(V_2 = ${fmt(V)} - ${fmt(v1)} = ${fmt(v2)}\) V.`,
                            chk: { spec, ask: 'V', of: 'V₂', given: { 'V₁': v1 } },
                        };
                    }
                    let r1, r2, I, V;
                    do { r1 = rng.int(2, 15); r2 = rng.int(2, 15); I = rng.pick([0.5, 1, 1.5, 2, 3]); V = I * (r1 + r2); } while (!Number.isInteger(V) || V > 36);
                    if (k === 1) {                                           // voltmeter across R2
                        const spec = { V, top: [res('R₁', r1), res('R₂', r2, { vm: true })], rungs: [[]] };
                        const v2 = CA.round(I * r2, 4);
                        return {
                            q: `What does the voltmeter read?`, fig: circuit(spec), ans: CA.num(v2, 'V'),
                            sol: R`\(R_T = ${r1} + ${r2} = ${r1 + r2}\) Ω, \(I = ${V} \div ${r1 + r2} = ${fmt(I)}\) A, so the voltmeter reads \(${fmt(I)} \times ${r2} = ${fmt(v2)}\) V.`,
                            chk: { spec, ask: 'V', of: 'V' },
                        };
                    }
                    const v1 = CA.round(I * r1, 4);                         // voltmeter across R1 gives the current
                    const spec = { V, top: [res('R₁', r1, { vm: true }), amm('A')], rungs: [[res('R₂', r2, { label: ['R₂', ''] })]] };
                    return {
                        q: `The voltmeter across R₁ reads ${fmt(v1)} V. What does the ammeter read?`, fig: circuit(spec), ans: CA.num(I, 'A'),
                        sol: R`The current through \(R_1\) is \(I = \dfrac{V}{R} = \dfrac{${fmt(v1)}}{${r1}} = ${fmt(I)}\) A. In series the current is the same everywhere, so the ammeter reads ${fmt(I)} A.`,
                        chk: { spec, ask: 'I', of: 'A', given: { V: v1 } },
                    };
                },
            },
            {
                id: 'parallel-circuit', name: 'Parallel circuits: branch currents and total current', level: 2,
                gen(rng) {
                    const nb = rng.bool(0.6) ? 2 : 3, V = rng.pick([6, 8, 9, 12, 18, 24, 30, 36]);
                    const cand = []; for (let r = 2; r <= 48; r++) if (ok2(V / r) && V / r <= 12) cand.push(r);
                    const rs = rng.sample(cand, nb), Is = rs.map(r => CA.round(V / r, 4)), tot = CA.round(Is.reduce((a, b) => a + b, 0), 4);
                    const ask = rng.pick(['branch', 'branch', 'total', 'total', 'volt']);
                    const j = rng.int(1, nb);
                    const rungs = rs.map((r, i) => (ask === 'branch' && i === j - 1 ? [amm('A₁'), res(`R${SUB[i + 1]}`, r)] : [res(`R${SUB[i + 1]}`, r)]));
                    const spec = { V, top: ask === 'total' ? [amm('A')] : [], rungs, slot: 52, gapR: nb === 3 ? 66 : 72 };
                    const intro = `${nb === 2 ? 'Two' : 'Three'} resistors are connected in parallel to ${an(V)} ${V} V battery.`;
                    if (ask === 'volt') return {
                        q: R`${intro} What is the voltage across \(R_${j}\)?`, fig: circuit(spec), ans: CA.num(V, 'V'),
                        sol: `Each branch of a parallel circuit is connected straight across the battery, so every branch gets the full ${V} V.`, chk: { spec, ask: 'V', of: `R${SUB[j]}` },
                    };
                    if (ask === 'branch') return {
                        q: `${intro} What does ammeter A₁ read?`, fig: circuit(spec), ans: CA.num(Is[j - 1], 'A'),
                        sol: R`\(R_${j}\) has the full ${V} V across it, so \(I = \dfrac{${V}}{${rs[j - 1]}} = ${fmt(Is[j - 1])}\) A.`, chk: { spec, ask: 'I', of: 'A₁' },
                    };
                    return {
                        q: `${intro} What does the ammeter in the main wire read?`, fig: circuit(spec), ans: CA.num(tot, 'A'),
                        sol: R`Each branch has ${V} V across it: ${rs.map((r, i) => R`\(${V} \div ${r} = ${fmt(Is[i])}\) A`).join(', ')}. The main current is the sum: \(${Is.map(fmt).join(' + ')} = ${fmt(tot)}\) A.`,
                        chk: { spec, ask: 'I', of: 'A' },
                    };
                },
            },
            {
                id: 'parallel-resistance', name: 'Total resistance of resistors in parallel', level: 2,
                gen(rng) {
                    const k = rng.pick([0, 0, 1, 2, 2]);
                    const formula = R`\(R_T = \dfrac{R_1 \times R_2}{R_1 + R_2}\)`;
                    if (k === 1) {
                        const n = rng.int(2, 4), r = n * rng.int(2, 15), thing = rng.pick(['identical resistors', 'identical bulbs']);
                        return {
                            q: `${['', '', 'Two', 'Three', 'Four'][n]} ${thing}, each of ${r} Ω, are connected in parallel. What is their total resistance?`,
                            ans: CA.num(r / n, 'Ω'), sol: R`For \(n\) identical resistances in parallel, \(R_T = \dfrac{R}{n} = \dfrac{${r}}{${n}} = ${r / n}\) Ω — less than any one of them.`,
                        };
                    }
                    const [a, b] = pickPair(rng), rp = rpar(a, b);
                    const solRp = R`\(R_T = \dfrac{${a} \times ${b}}{${a} + ${b}} = \dfrac{${a * b}}{${a + b}} = ${rp}\) Ω.`;
                    if (k === 0) return {
                        q: R`Find the total resistance between X and Y. Use ${formula}.`, fig: pairFig(a, b), ans: CA.num(rp, 'Ω'), sol: solRp,
                        chk: { spec: { V: 1, rungs: [[res('R₁', a)], [res('R₂', b)]] }, ask: 'Rt' },
                    };
                    let V, I;
                    do { V = rp * rng.int(1, 6); I = V / rp; } while (V > 48 || V < 3);
                    const spec = { V, top: [amm('A')], rungs: [[res('R₁', a)], [res('R₂', b)]], slot: 52 };
                    return {
                        q: R`Use ${formula} to find the total resistance, then find the reading on the ammeter.`, fig: circuit(spec), ans: CA.num(I, 'A'),
                        sol: R`${solRp} Then \(I = \dfrac{V}{R_T} = \dfrac{${V}}{${rp}} = ${fmt(I)}\) A.`, chk: { spec, ask: 'I', of: 'A' },
                    };
                },
            },
            {
                id: 'which-bulbs', name: 'Which bulbs light? Series and parallel', level: 2,
                gen(rng) {
                    const blow = rng.bool(0.45), cfg = blow ? rng.pick([0, 1, 1, 2, 3, 3]) : rng.int(0, 3);
                    let spec;
                    const c1 = rng.bool(0.75), c2 = rng.bool(0.5);
                    const V = rng.pick([3, 6, 9, 12]);
                    if (cfg === 0) spec = { V, top: [bulb(B(1), null), bulb(B(2), null)], rungs: [[bulb(B(3), null)]], bottom: [sw('S', c1)] };
                    else if (cfg === 1) spec = { V, top: [sw('S₁', c1)], rungs: [[bulb(B(1), null)], [sw('S₂', c2), bulb(B(2), null)], [bulb(B(3), null)]], slot: 52, gapR: 66, h: 130 };
                    else if (cfg === 2) spec = { V, top: [sw('S₁', c1), bulb(B(1), null)], rungs: [[bulb(B(2), null)], [sw('S₂', c2), bulb(B(3), null)]], h: 130 };
                    else spec = { V, top: [sw('S₁', c1)], rungs: [[bulb(B(1), null), bulb(B(2), null)], [bulb(B(3), null), bulb(B(4), null)]], slot: 52, h: 130 };
                    const allSw = [...spec.top, ...(spec.bottom || []), ...spec.rungs.flat()].filter(c => c.t === 'sw');
                    const names = bulbsOf(spec);
                    let q;
                    if (blow) {                                                 // a bulb blows
                        allSw.forEach(s => { s.closed = true; });
                        const blown = rng.pick(names);
                        const fig = circuit(spec);
                        const after = JSON.parse(JSON.stringify(spec));
                        [...(after.top || []), ...(after.bottom || []), ...after.rungs.flat()].forEach(c => { if (c.name === blown) c.broken = true; });
                        const lit = litOf(after);
                        q = `All the switches are closed. Then bulb ${blown} blows (its filament breaks). Which bulbs stay lit?`;
                        return { q, fig, ans: subsetChoices(rng, names, lit), sol: whySol(after, lit, blown), chk: { spec: after, ask: 'lit' } };
                    }
                    const st = c => (c.closed ? 'closed' : 'open');
                    const state = allSw.length === 1 ? `switch ${allSw[0].name} is ${st(allSw[0])}`
                        : allSw[0].closed === allSw[1].closed ? `switches ${allSw[0].name} and ${allSw[1].name} are both ${st(allSw[0])}`
                            : `switch ${allSw[0].name} is ${st(allSw[0])} and switch ${allSw[1].name} is ${st(allSw[1])}`;
                    q = `In this circuit ${state}, as shown. Which bulbs are lit?`;
                    const lit = litOf(spec);
                    return { q, fig: circuit(spec), ans: subsetChoices(rng, names, lit), sol: whySol(spec, lit, null), chk: { spec, ask: 'lit' } };
                },
            },
            {
                id: 'power-energy', name: 'Power and energy', level: 2,
                gen(rng) {
                    const k = rng.int(0, 4);
                    if (k === 0) {
                        let V, r, I, P;
                        do { V = rng.pick([3, 6, 9, 12, 18, 24]); r = rng.int(2, 24); I = V / r; P = V * I; } while (!ok2(I) || !ok2(P));
                        const spec = { V, rungs: [[res('R', r)]] };
                        return {
                            q: `${An(V)} ${V} V battery is connected to ${an(r)} ${r} Ω resistor. How much power does the resistor use?`, ans: CA.num(CA.round(P, 4), 'W'),
                            sol: R`First \(I = \dfrac{V}{R} = \dfrac{${V}}{${r}} = ${fmt(I)}\) A. Then \(P = V \times I = ${V} \times ${fmt(I)} = ${fmt(P)}\) W.`, chk: { spec, ask: 'P', of: 'R' },
                        };
                    }
                    if (k === 1) {
                        const P = rng.pick([5, 9, 10, 15, 40, 60, 75, 100]), t = rng.int(2, 12), dev = rng.pick(['lamp', 'light bulb', 'desk lamp']);
                        return {
                            q: `${An(P)} ${P} W ${dev} is left on for ${t} hours. How much energy does it use, in watt-hours (Wh)?`, ans: CA.num(P * t, 'Wh'),
                            sol: R`\(E = P \times t = ${P} \times ${t} = ${P * t}\) Wh.`,
                        };
                    }
                    if (k === 2) {
                        let P, t;
                        do { P = rng.pick([500, 800, 1000, 1200, 1500, 2000, 2500]); t = rng.int(1, 8); } while (!ok2(P * t / 1000));
                        const dev = rng.pick(['space heater', 'oven', 'air conditioner', 'clothes dryer']);
                        return {
                            q: `${An(P)} ${P} W ${dev} runs for ${t} hour${t > 1 ? 's' : ''}. How much energy does it use, in kilowatt-hours (kWh)?`, ans: CA.num(CA.round(P * t / 1000, 4), 'kWh'),
                            sol: R`\(${P}\) W \(= ${fmt(P / 1000)}\) kW, so \(E = P \times t = ${fmt(P / 1000)} \times ${t} = ${fmt(P * t / 1000)}\) kWh.`,
                        };
                    }
                    if (k === 3) {
                        const P = rng.pick([5, 10, 20, 40, 60, 100, 1000]), mins = rng.int(1, 10), s = 60 * mins;
                        return {
                            q: `${An(P)} ${P} W device is switched on for ${mins} minute${mins > 1 ? 's' : ''}. How much energy does it use, in joules (J)? (1 W = 1 J each second.)`, ans: CA.num(P * s, 'J'),
                            sol: R`\(t = ${mins} \times 60 = ${s}\) s, so \(E = P \times t = ${P} \times ${s} = ${P * s}\) J.`,
                        };
                    }
                    const [dev, P] = rng.pick([['hair dryer', [1200, 1500, 1800]], ['toaster', [840, 900, 1200]], ['microwave oven', [960, 1080, 1200]], ['vacuum cleaner', [600, 900, 1080]],
                        ['blender', [360, 480, 600]], ['TV', [60, 120, 180]], ['desk fan', [30, 48, 60]]].map(([d, ps]) => [d, rng.pick(ps)]));
                    return {
                        q: `${An(P)} ${P} W ${dev} is plugged into a 120 V wall outlet. What current does it draw?`, ans: CA.num(CA.round(P / 120, 4), 'A'),
                        sol: R`\(P = V \times I\), so \(I = \dfrac{P}{V} = \dfrac{${P}}{120} = ${fmt(P / 120)}\) A.`,
                    };
                },
            },
            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'mixed-circuit', name: 'Series and parallel together', level: 3,
                gen(rng) {
                    let a, b, rp, r1, I, V, I2;
                    do {
                        [a, b] = pickPair(rng); rp = rpar(a, b); r1 = rng.int(1, 20);
                        I = rng.pick([0.5, 1, 1.5, 2, 3]); V = I * (r1 + rp); I2 = I * rp / a;
                    } while (!Number.isInteger(V) || V > 60 || V < 4 || !ok2(I2) || a > 40 || b > 40);
                    const ask = rng.pick(['Rt', 'A', 'V1', 'I2', 'Vp']);
                    const R1 = res('R₁', r1, ask === 'V1' ? { vm: true } : {}), R2 = res('R₂', a), R3 = res('R₃', b);
                    const spec = { V, top: ask === 'A' ? [amm('A'), R1] : [R1], rungs: [ask === 'I2' ? [amm('A₂'), R2] : [R2], [R3]], slot: ask === 'A' ? 58 : 64 };
                    if (ask === 'Vp') spec.rungs.push([vm('V')]), spec.gapR = 64;
                    const solRp = R`\(R_2\) and \(R_3\) in parallel: \(\dfrac{${a}\times${b}}{${a}+${b}} = ${rp}\) Ω. Total \(R_T = ${r1} + ${rp} = ${r1 + rp}\) Ω`;
                    const solI = R`${solRp}, so \(I = ${V} \div ${r1 + rp} = ${fmt(I)}\) A.`;
                    const intro = `${R2.name} and ${R3.name} are in parallel, and this pair is in series with ${R1.name}.`;
                    if (ask === 'Rt') return { q: `${intro} What is the total resistance of the circuit?`, fig: circuit(spec), ans: CA.num(r1 + rp, 'Ω'), sol: `${solRp}.`, chk: { spec, ask: 'Rt' } };
                    if (ask === 'A') return { q: `${intro} What does the ammeter read?`, fig: circuit(spec), ans: CA.num(I, 'A'), sol: solI, chk: { spec, ask: 'I', of: 'A' } };
                    if (ask === 'V1') return {
                        q: `${intro} What does the voltmeter across R₁ read?`, fig: circuit(spec), ans: CA.num(CA.round(I * r1, 4), 'V'),
                        sol: R`${solI} The voltmeter reads \(${fmt(I)} \times ${r1} = ${fmt(I * r1)}\) V.`, chk: { spec, ask: 'V', of: 'V' },
                    };
                    const vp = CA.round(I * rp, 4);
                    if (ask === 'Vp') return {
                        q: `${intro} What does the voltmeter read?`, fig: circuit(spec), ans: CA.num(vp, 'V'),
                        sol: R`${solI} The voltmeter is across the parallel pair: \(${fmt(I)} \times ${rp} = ${fmt(vp)}\) V (or \(${V} - ${fmt(I * r1)}\)).`, chk: { spec, ask: 'V', of: 'V' },
                    };
                    return {
                        q: `${intro} What does ammeter A₂ read?`, fig: circuit(spec), ans: CA.num(CA.round(I2, 4), 'A'),
                        sol: R`${solI} The pair has \(${fmt(I)} \times ${rp} = ${fmt(vp)}\) V across it, so \(I_2 = ${fmt(vp)} \div ${a} = ${fmt(I2)}\) A.`, chk: { spec, ask: 'I', of: 'A₂' },
                    };
                },
            },
            {
                id: 'brightness', name: 'Comparing bulb brightness', level: 3,
                gen(rng) {
                    const cfg = rng.int(0, 2);
                    let spec, s;
                    for (;;) {
                        if (cfg === 0) {
                            const r1 = rng.int(2, 12), r2 = rng.bool(0.15) ? r1 : rng.int(2, 12), I = rng.pick([0.5, 1, 1.5, 2]), V = I * (r1 + r2);
                            if (!Number.isInteger(V) || V > 36) continue;
                            spec = { V, top: [bulb(B(1), r1)], rungs: [[bulb(B(2), r2)]], slot: 70 };
                        } else if (cfg === 1) {
                            const V = rng.pick([6, 12, 18, 24]), r1 = rng.int(2, 24), r2 = rng.bool(0.15) ? r1 : rng.int(2, 24);
                            if (!ok2(V / r1) || !ok2(V / r2)) continue;
                            spec = { V, rungs: [[bulb(B(1), r1)], [bulb(B(2), r2)]] };
                        } else {
                            const [a, b] = rng.bool(0.4) ? (x => [x, x])(rng.int(1, 6) * 2) : pickPair(rng), rp = rpar(a, b), r1 = rng.int(2, 12), I = rng.pick([1, 2, 3]), V = I * (r1 + rp);
                            if (!Number.isInteger(V) || V > 48 || a > 24 || b > 24) continue;
                            spec = { V, top: [bulb(B(1), r1)], rungs: [[bulb(B(2), a)], [bulb(B(3), b)]], slot: 70 };
                        }
                        s = solve(spec);
                        const names = bulbsOf(spec), Ps = names.map(n => CA.round(s.part[n].P, 6));
                        if (!Ps.every(ok2)) continue;
                        const mx = Math.max(...Ps), top = names.filter((_, i) => Ps[i] === mx);
                        if (top.length !== 1 && top.length !== names.length) continue;
                        const lines = names.map((n, i) => R`${n}: \(${fmt(s.part[n].V)} \times ${fmt(s.part[n].I)} = ${fmt(Ps[i])}\) W`).join('; ');
                        const how = cfg === 0 ? 'Both bulbs carry the same current' : cfg === 1 ? 'Both bulbs have the full battery voltage' : `${B(1)} carries the whole current of ${fmt(s.I)} A`;
                        if (rng.bool(0.5)) {
                            const j = rng.int(0, names.length - 1);
                            return {
                                q: R`How much power does bulb ${names[j]} use? (Find its current and voltage first, then use \(P = V \times I\).)`, fig: circuit(spec), ans: CA.num(Ps[j], 'W'),
                                sol: R`${how}. Power \(P = V \times I\): ${lines}.`, chk: { spec, ask: 'P', of: names[j] },
                            };
                        }
                        const eq = names.length === 2 ? 'Both are equally bright' : 'All are equally bright';
                        const correct = top.length === 1 ? top[0] : eq;
                        return {
                            q: 'The more power a bulb uses, the brighter it glows. Which bulb is the brightest?', fig: circuit(spec),
                            ans: CA.mc(rng, tn(correct), [...names, eq].filter(x => x !== correct).map(tn)),
                            sol: R`${how}. Power \(P = V \times I\): ${lines}. ${top.length === 1 ? `So ${top[0]} is the brightest.` : 'They are equally bright.'}`,
                            chk: { spec, ask: 'bright', correct },
                        };
                    }
                },
            },
            {
                id: 'unknown-resistor', name: 'Finding an unknown resistor from meter readings', level: 3,
                gen(rng) {
                    const k = rng.int(0, 2);
                    if (k < 2) {
                        let r1, r2, I, V;
                        do { r1 = rng.int(2, 15); r2 = rng.int(2, 20); I = rng.pick([0.5, 1, 1.5, 2, 3]); V = I * (r1 + r2); } while (!Number.isInteger(V) || V > 48 || r1 === r2);
                        if (k === 0) {
                            const spec = { V, top: [amm('A'), res('R₁', r1)], rungs: [[res('R₂', r2, { unknown: true })]] };
                            return {
                                q: `The ammeter reads ${fmt(I)} A. Find the resistance of R₂.`, fig: circuit(spec), ans: CA.num(r2, 'Ω'),
                                sol: R`Total \(R_T = \dfrac{V}{I} = \dfrac{${V}}{${fmt(I)}} = ${r1 + r2}\) Ω. In series, \(R_2 = ${r1 + r2} - ${r1} = ${r2}\) Ω.`,
                                chk: { spec, ask: 'Rval', of: 'R₂', given: { A: I } },
                            };
                        }
                        const v1 = CA.round(I * r1, 4), v2 = CA.round(V - v1, 4);
                        const spec = { V, top: [res('R₁', r1, { vm: true })], rungs: [[res('R₂', r2, { unknown: true })]], slot: 70 };
                        return {
                            q: `The voltmeter reads ${fmt(v1)} V. Find the resistance of R₂.`, fig: circuit(spec), ans: CA.num(r2, 'Ω'),
                            sol: R`Current: \(I = ${fmt(v1)} \div ${r1} = ${fmt(I)}\) A. \(R_2\) gets \(${V} - ${fmt(v1)} = ${fmt(v2)}\) V, so \(R_2 = ${fmt(v2)} \div ${fmt(I)} = ${r2}\) Ω.`,
                            chk: { spec, ask: 'Rval', of: 'R₂', given: { V: v1 } },
                        };
                    }
                    let V, r1, r2, I1, I2;
                    do { V = rng.pick([6, 12, 18, 24, 30, 36]); r1 = rng.int(2, 30); r2 = rng.int(2, 30); I1 = V / r1; I2 = V / r2; } while (!ok2(I1) || !ok2(I2) || r1 === r2 || I1 + I2 > 15);
                    const tot = CA.round(I1 + I2, 4);
                    const spec = { V, top: [amm('A')], rungs: [[res('R₁', r1)], [res('R₂', r2, { unknown: true })]], slot: 52 };
                    return {
                        q: `The ammeter in the main wire reads ${fmt(tot)} A. Find the resistance of R₂.`, fig: circuit(spec), ans: CA.num(r2, 'Ω'),
                        sol: R`\(R_1\) takes \(${V} \div ${r1} = ${fmt(I1)}\) A, so \(R_2\) takes \(${fmt(tot)} - ${fmt(I1)} = ${fmt(I2)}\) A. Then \(R_2 = ${V} \div ${fmt(I2)} = ${r2}\) Ω.`,
                        chk: { spec, ask: 'Rval', of: 'R₂', given: { A: tot } },
                    };
                },
            },
            {
                id: 'switch-change', name: 'What happens when a switch opens or closes', level: 3,
                gen(rng) {
                    const nb = rng.bool(0.5) ? 2 : 3, V = rng.pick([6, 12, 18, 24]);
                    const cand = []; for (let r = 2; r <= 36; r++) if (ok2(V / r) && V / r <= 8) cand.push(r);
                    const rs = rng.sample(cand, nb), j = rng.int(0, nb - 1), closedNow = rng.bool();
                    const mk = closed => ({ V, top: [amm('A')], rungs: rs.map((r, i) => (i === j ? [sw('S', closed), res(`R${SUB[i + 1]}`, r)] : [res(`R${SUB[i + 1]}`, r)])), slot: 52, gapR: nb === 3 ? 68 : 74, h: 130 });
                    const before = mk(closedNow), after = mk(!closedNow);
                    const Is = rs.map(r => CA.round(V / r, 4)), others = CA.round(Is.reduce((s2, x, i) => s2 + (i === j ? 0 : x), 0), 4), all = CA.round(others + Is[j], 4);
                    const ask = rng.pick(['after', 'after', 'change']);
                    const list = Is.map((x, i) => R`\(R_${i + 1}\): \(${V} \div ${rs[i]} = ${fmt(x)}\) A`).join(', ');
                    if (ask === 'change') return {
                        q: `Switch S is ${closedNow ? 'closed' : 'open'}, as shown. By how many amps does the ammeter reading change when S is ${closedNow ? 'opened' : 'closed'}?`,
                        fig: circuit(before), ans: CA.num(Is[j], 'A'),
                        sol: R`Only the branch with S (the \(R_${j + 1}\) branch) changes. It carries \(${V} \div ${rs[j]} = ${fmt(Is[j])}\) A when S is closed; the other branches still get the full ${V} V. So the reading changes by ${fmt(Is[j])} A.`,
                        chk: { spec: after, ask: 'dI', of: 'A', before },
                    };
                    return {
                        q: `Switch S is ${closedNow ? 'closed' : 'open'}, as shown. What does the ammeter read after S is ${closedNow ? 'opened' : 'closed'}?`,
                        fig: circuit(before), ans: CA.num(closedNow ? others : all, 'A'),
                        sol: R`Every branch has ${V} V across it: ${list}. S is in the \(R_${j + 1}\) branch. With S ${closedNow ? 'open, that branch carries nothing' : 'closed, all branches carry current'}, so the ammeter reads ${fmt(closedNow ? others : all)} A.`,
                        chk: { spec: after, ask: 'I', of: 'A' },
                    };
                },
            },
        ],

        assignment: [
            ['ohm-voltage', 3], ['ohm-rearrange', 4], ['power-basic', 3], ['open-closed', 3], ['conductors', 2],
            ['series-circuit', 4], ['series-share', 4], ['parallel-circuit', 4], ['parallel-resistance', 3], ['which-bulbs', 4], ['power-energy', 4],
            ['mixed-circuit', 4], ['brightness', 3], ['unknown-resistor', 3], ['switch-change', 2],
        ],
    };
    for (const g of lesson.practice) {
        const make = g.gen;
        g.gen = function (rng) { const p = make.call(this, rng); p.q = tn(p.q); p.sol = tn(p.sol); return p; };
    }
    CA.register(lesson);

    /** A short reason for which bulbs light. */
    function whySol(spec, lit, blown) {
        const names = bulbsOf(spec), dark = names.filter(n => !lit.includes(n) && n !== blown);
        const list = l => (l.length > 1 ? `${l.slice(0, -1).join(', ')} and ${l[l.length - 1]}` : l[0]);
        let s = blown ? `${blown} is broken, so its path is open. ` : '';
        if (!lit.length) return s + 'Now there is no complete loop through the battery, so no bulb lights.';
        if (lit.length === names.length) return 'Every bulb is on a complete loop through the battery, so all of them light.';
        if (dark.length) s += `${list(dark)} ${dark.length > 1 ? 'are' : 'is'} cut off from the battery too. `;
        return s + `${list(lit)} ${lit.length > 1 ? 'are' : 'is'} still on a complete loop through the battery, so ${lit.length > 1 ? 'they stay' : 'it stays'} lit — parallel branches work on their own.`;
    }
})();
