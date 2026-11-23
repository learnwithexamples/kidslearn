/* Challenge Academy — Lesson 8: Cylinders and Cones */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, tp = CA.tex.pi;
    const { FILL, DARK, ACCENT } = F.colors;
    const PALE = '#f5f7ff', WATER = '#d5e9fb', WATERTOP = '#aed3f5', STONE = '#a0aec0', HOLE = '#7f90d6';
    const q2 = x => Math.round(x * 100) / 100;
    const THIN = { dash: true, width: 1 };

    // ── Figure helpers ───────────────────────────────────────────────────
    // An upright round solid is drawn with ellipses for its circles.
    const side = (cx, top, bot, rx, ry) =>
        `M${q2(cx - rx)} ${q2(top)}L${q2(cx - rx)} ${q2(bot)}A${q2(rx)} ${q2(ry)} 0 0 0 ${q2(cx + rx)} ${q2(bot)}L${q2(cx + rx)} ${q2(top)}`;
    /** Half an ellipse from the left point to the right point: back = the far (upper) half. */
    const half = (cx, y, rx, ry, back) => `M${q2(cx - rx)} ${q2(y)}A${q2(rx)} ${q2(ry)} 0 0 ${back ? 1 : 0} ${q2(cx + rx)} ${q2(y)}`;
    const coneD = (cx, apex, base, rx, ry) => `M${q2(cx)} ${q2(apex)}L${q2(cx - rx)} ${q2(base)}A${q2(rx)} ${q2(ry)} 0 0 0 ${q2(cx + rx)} ${q2(base)}Z`;
    const textW = s => String(s).length * 6.6;

    /** Text with a soft halo, so a label stays readable where it crosses a line. */
    const halo = (x, y, t, anchor) => `<text x="${q2(x)}" y="${q2(y)}" text-anchor="${anchor}" font-size="12" fill="${F.colors.INK}" stroke="${FILL}" stroke-width="4" paint-order="stroke">${t}</text>`;

    /** A cylinder; labels {r, d, h}. Like F.cylinder, but the radius or diameter is written above the rim. */
    function cylFig(r, h, opt = {}) {
        const lab = opt.labels || {}, max = opt.max || 130;
        const s = Math.min(max / (2 * r), max / (h + 0.6 * r));
        const rx = r * s, ry = rx * 0.3, Ht = h * s, W = 2 * rx + 80, cx = W / 2, top = 20 + ry, bot = top + Ht;
        let b = F.path(side(cx, top, bot, rx, ry) + 'Z', { fill: FILL }) + F.path(half(cx, bot, rx, ry, true), THIN) + F.ellipse(cx, top, rx, ry, { fill: PALE });
        if (lab.r != null) b += F.line(cx, top, cx + rx, top, { width: 1 }) + F.dot(cx, top, { r: 2 }) + F.text(cx + rx / 2, top - ry - 5, lab.r, { size: 12 });
        if (lab.d != null) b += F.line(cx - rx, top, cx + rx, top, { width: 1 }) + F.text(cx, top - ry - 5, lab.d, { size: 12 });
        if (lab.h != null) b += F.text(cx + rx + 6, (top + bot) / 2 + 4, lab.h, { anchor: 'start' });
        return F.svg(W, bot + ry + 8, b, { label: 'cylinder' });
    }

    /** A cone; labels {r, d, h, s} (s = slant height). Like F.cone, but can show a diameter. */
    function coneFig(r, h, lab = {}, opt = {}) {
        const max = opt.max || 120;
        const s = Math.min(max / (2 * r), max / (h + 0.3 * r));
        const rx = r * s, ry = rx * 0.3, Ht = h * s;
        const W = 2 * rx + 80, HH = Ht + ry + (lab.d != null || lab.r != null ? 30 : 18), narrow = rx < 34;
        const cx = W / 2, top = 8, bot = top + Ht;
        let b = F.path(coneD(cx, top, bot, rx, ry), { fill: FILL });
        b += F.path(half(cx, bot, rx, ry, true), THIN);
        if (lab.h != null) b += F.line(cx, top, cx, bot, THIN) + F.rightAngle(cx, bot, 0, -1, 1, 0, narrow ? 5 : 7) + (narrow ? F.text(cx - rx / 2 - 7, (top + bot) / 2 + 8, lab.h, { anchor: 'end', size: 12 }) : halo(cx - 5, (top + bot) / 2 + (Ht < 50 ? 3 : 8), lab.h, 'end'));
        if (lab.r != null) b += F.line(cx, bot, cx + rx, bot, THIN) + F.text(cx + rx / 2, bot + ry + 15, lab.r, { size: 12 });
        if (lab.d != null) b += F.line(cx - rx, bot, cx + rx, bot, THIN) + F.text(cx, bot + ry + 15, lab.d, { size: 12 });
        if (lab.s != null) b += F.text(cx + rx / 2 + 7, (top + bot) / 2, lab.s, { anchor: 'start', size: 12 });
        return F.svg(W, HH, b, { label: 'cone' });
    }

    /**
     * Solids stacked on a common axis, bottom first.  Each tier is { r, h, cone?, label }:
     * a cylinder, or a cone (point up) when cone is true.  Labels are written beside each tier.
     */
    function stackFig(tiers, opt = {}) {
        const rmax = Math.max(...tiers.map(t => t.r)), tot = tiers.reduce((a, t) => a + t.h, 0);
        const s = Math.min((opt.maxW || 96) / (2 * rmax), (opt.maxH || 135) / tot);
        const last = tiers[tiers.length - 1];
        const cx = 12 + rmax * s, topY = last.cone ? 8 : 8 + last.r * s * 0.28;
        let y = topY + tot * s, b = '', labels = '', wide = 0, lastY = Infinity;
        tiers.forEach((t, i) => {
            const rx = t.r * s, ry = rx * 0.28, yt = y - t.h * s;
            if (t.cone) b += F.path(coneD(cx, yt, y, rx, ry), { fill: PALE });
            else b += F.path(side(cx, yt, y, rx, ry) + 'Z', { fill: FILL }) + F.ellipse(cx, yt, rx, ry, { fill: PALE });
            if (i === 0 || t.r > tiers[i - 1].r) b += F.path(half(cx, y, rx, ry, true), THIN);
            if (t.label) { lastY = Math.min((y + yt) / 2 + 4, lastY - 14); labels += F.text(cx + rmax * s + 10, lastY, t.label, { anchor: 'start', size: 12 }); wide = Math.max(wide, textW(t.label)); }
            y = yt;
        });
        return F.svg(cx + rmax * s + 14 + wide, topY + tot * s + tiers[0].r * s * 0.28 + 8, b + labels, { label: 'stacked solids' });
    }

    /**
     * A cylinder (radius Rr, height H) with something removed from the top, on its axis:
     * a cylindrical hole (radius a, depth d; d = H goes right through) or, with o.cone, a cone-shaped hollow.
     * o.lines = up to two captions written beside the figure.
     */
    function drillFig(Rr, H, a, d, o = {}) {
        const s = Math.min(90 / (2 * Rr), 115 / H);
        const rx = Rr * s, ry = rx * 0.28, ax = a * s, ay = ax * 0.28, cx = 12 + rx, top = 8 + ry, bot = top + H * s, deep = top + d * s;
        let b = F.path(side(cx, top, bot, rx, ry) + 'Z', { fill: FILL });
        b += F.path(half(cx, bot, rx, ry, true), THIN) + F.ellipse(cx, top, rx, ry, { fill: PALE }) + F.ellipse(cx, top, ax, ay, { fill: HOLE });
        if (o.cone) b += F.line(cx - ax, top, cx, deep, THIN) + F.line(cx + ax, top, cx, deep, THIN);
        else b += F.line(cx - ax, top, cx - ax, deep, THIN) + F.line(cx + ax, top, cx + ax, deep, THIN) + F.ellipse(cx, deep, ax, ay, THIN);
        const lines = o.lines || [];
        if (lines[0]) b += F.text(cx + rx + 10, top + 4, lines[0], { anchor: 'start', size: 12 });
        if (lines[1]) b += F.text(cx + rx + 10, (top + bot) / 2 + 14, lines[1], { anchor: 'start', size: 12 });
        return F.svg(cx + rx + 14 + Math.max(0, ...lines.map(textW)), bot + ry + 8, b, { label: o.cone ? 'cylinder with a cone-shaped hollow' : 'cylinder with a hole' });
    }

    /** A cylindrical tank with water. o.level / o.old are water depths; o.thing draws something on the bottom. */
    function tank(r, h, o = {}) {
        const lab = o.labels || {};
        const s = Math.min((o.maxW || 100) / (2 * r), (o.maxH || 120) / h);
        const rx = r * s, ry = rx * 0.28, Ht = h * s, padL = 14, padR = 64;
        const W = 2 * rx + padL + padR, HH = Ht + 2 * ry + 26, cx = padL + rx, top = 18 + ry, bot = top + Ht;
        const yl = o.level != null ? bot - o.level * s : null, yo = o.old != null ? bot - o.old * s : null;
        let b = F.path(side(cx, top, bot, rx, ry) + 'Z', { fill: '#fbfcff', stroke: 'none' });
        if (yl != null) b += F.path(side(cx, yl, bot, rx, ry) + 'Z', { fill: WATER, stroke: 'none' });
        if (o.thing) b += o.thing(cx, bot, s);
        if (yl != null) b += F.ellipse(cx, yl, rx, ry, { fill: WATERTOP, stroke: DARK, width: 1, opacity: 0.8 });
        if (yo != null) b += F.path(half(cx, yo, rx, ry, false), { stroke: ACCENT, width: 1.3, dash: '4 3' });
        b += F.path(side(cx, top, bot, rx, ry)) + F.path(half(cx, bot, rx, ry, true), THIN) + F.ellipse(cx, top, rx, ry);
        if (lab.r != null) b += F.line(cx, top, cx + rx, top, { width: 1 }) + F.dot(cx, top, { r: 2 }) + F.text(cx - 6, top + 4, lab.r, { size: 12, anchor: 'end' });
        const xr = cx + rx + 7;
        if (lab.rise != null && yo != null && yl != null) {
            b += F.line(xr, yl, xr, yo, { stroke: ACCENT, width: 1 }) + F.line(xr - 3, yl, xr + 3, yl, { stroke: ACCENT, width: 1 }) + F.line(xr - 3, yo, xr + 3, yo, { stroke: ACCENT, width: 1 });
            b += F.text(xr + 6, (yl + yo) / 2 + 4, lab.rise, { anchor: 'start', size: 12, fill: ACCENT });
        }
        return F.svg(W, HH, b, { label: 'tank of water' });
    }
    const stone = (cx, bot, size) => F.poly([[-0.55, 0.05], [-0.35, -0.5], [0.1, -0.68], [0.5, -0.4], [0.6, 0.02], [0.05, 0.18]].map(([x, y]) => [cx + x * size, bot + y * size]), { fill: STONE, width: 1 });
    const sunkCone = (r, h) => (cx, bot, s) => F.path(coneD(cx, bot - h * s, bot, r * s, r * s * 0.28), { fill: STONE, width: 1 });

    /** A log lying on its side, cut into n pieces. labels {len, r}. */
    function logFig(n, lab = {}) {
        const Lp = 190, ry = 26, rx = 8, x0 = 14, x1 = x0 + Lp, cy = ry + 8;
        let b = F.path(`M${x0} ${cy - ry}L${x1} ${cy - ry}L${x1} ${cy + ry}L${x0} ${cy + ry}A${rx} ${ry} 0 0 1 ${x0} ${cy - ry}Z`, { fill: FILL });
        for (let i = 1; i < n; i++) {
            const x = q2(x0 + i * Lp / n);
            b += F.path(`M${x} ${cy - ry}A${rx} ${ry} 0 0 0 ${x} ${cy + ry}`, { stroke: ACCENT, width: 1.5, dash: '5 3' });
        }
        b += F.ellipse(x1, cy, rx, ry, { fill: PALE });
        if (lab.r != null) b += F.line(x1, cy, x1, cy - ry, { width: 1 }) + F.dot(x1, cy, { r: 2 }) + F.text(x1 + rx + 6, cy - ry / 2 + 4, lab.r, { anchor: 'start', size: 12 });
        if (lab.len != null) b += F.text((x0 + x1) / 2, cy + ry + 16, lab.len);
        return F.svg(x1 + rx + 44, cy + ry + (lab.len != null ? 22 : 8), b, { label: 'cylinder cut into pieces' });
    }

    /** A cylinder sliced from top to bottom through its axis; the cut is shaded. labels {r, d, h}. */
    function axisFig(r, h, lab = {}) {
        const s = Math.min(100 / (2 * r), 115 / h);
        const rx = r * s, ry = rx * 0.28, W = 2 * rx + 90, cx = W / 2, top = 20 + ry, bot = top + h * s;
        let b = F.path(side(cx, top, bot, rx, ry) + 'Z', { fill: FILL });
        b += F.path(half(cx, bot, rx, ry, true), THIN);
        b += F.ellipse(cx, top, rx, ry, { fill: PALE });
        b += F.rect(cx - rx, top, 2 * rx, bot - top, { fill: ACCENT, stroke: 'none', opacity: 0.25 });
        b += F.rect(cx - rx, top, 2 * rx, bot - top, { stroke: ACCENT, width: 1.2, dash: '5 3' });
        if (lab.r != null) b += F.dot(cx, top, { r: 2 }) + F.text(cx + rx / 2, top - ry - 5, lab.r, { size: 12 });
        if (lab.d != null) b += F.text(cx, top - ry - 5, lab.d, { size: 12 });
        if (lab.h != null) b += F.text(cx + rx + 7, (top + bot) / 2 + 4, lab.h, { anchor: 'start' });
        return F.svg(W, bot + ry + 8, b, { label: 'cylinder cut through its axis' });
    }

    /**
     * A flat shape about to be spun round the dash-dot line.  a runs along the axis, b sticks out.
     * kind: 'rect', 'tri' (right angle at the bottom of the axis), or 'trap' (a right trapezoid whose
     * shorter parallel side p is on the outside).  Labels la (axis side), lb (bottom), lc (hypotenuse or outer side).
     */
    function spinFig(kind, a, b, la, lb, lc, p, max = 110) {
        const s = Math.min(max / a, max / b, 18);
        const A = a * s, B = b * s, x0 = 34, top = 26, bot = top + A;
        const pts = kind === 'rect' ? [[x0, top], [x0 + B, top], [x0 + B, bot], [x0, bot]]
            : kind === 'tri' ? [[x0, top], [x0 + B, bot], [x0, bot]]
            : [[x0, top], [x0 + B, bot - p * s], [x0 + B, bot], [x0, bot]];
        let g = F.poly(pts, { fill: FILL }) + F.rightAngle(x0, bot, 1, 0, 0, -1, 7);
        if (kind === 'trap') g += F.rightAngle(x0 + B, bot, -1, 0, 0, -1, 7);
        g += F.line(x0, 4, x0, bot + 14, { stroke: ACCENT, width: 1.3, dash: '9 3 2 3' });
        g += F.path(`M${x0 - 12} 13A12 4.5 0 1 0 ${x0 + 12} 11`, { stroke: ACCENT, width: 1.3 });
        g += F.poly([[x0 + 12, 11], [x0 + 5, 8.5], [x0 + 9.5, 16]], { fill: ACCENT, stroke: ACCENT, width: 1 });
        g += F.text(x0 - 7, (top + bot) / 2 + 4, la, { anchor: 'end' }) + F.text(x0 + B / 2, bot + 16, lb);
        if (lc != null) g += kind === 'trap' ? F.text(x0 + B + 6, bot - p * s / 2 + 4, lc, { anchor: 'start' }) : F.text(x0 + B / 2 + 8, (top + bot) / 2 - 3, lc, { anchor: 'start' });
        return F.svg(x0 + B + (lc != null ? 34 : 16), bot + 22, g, { label: 'shape rotated about a side' });
    }

    /** The net of a cylinder: a rectangle and two circles. */
    function netFig() {
        const r = 17, w = q2(2 * Math.PI * r), h = 52, x = 12, y = 2 * r + 8;
        let b = F.circle(x + w / 2, y - r, r, { fill: PALE }) + F.rect(x, y, w, h, { fill: FILL }) + F.circle(x + w / 2, y + h + r, r, { fill: PALE });
        b += F.line(x + w / 2, y - r, x + w / 2 + r, y - r, { width: 1 }) + F.dot(x + w / 2, y - r, { r: 2 }) + F.text(x + w / 2 + r / 2, y - r - 3, 'r', { size: 12, italic: true });
        b += F.text(x + w / 2, y + h / 2 + 4, 'curved side', { size: 12 }) + F.text(x + w + 6, y + h / 2 + 4, 'h', { anchor: 'start', italic: true }) + F.text(x, y - 5, '2πr', { size: 12, italic: true, anchor: 'start' });
        return F.svg(x + w + 24, y + h + 2 * r + 6, b, { label: 'net of a cylinder' });
    }

    // ── Maths helpers ────────────────────────────────────────────────────
    const P = (n, d = 1) => m(tp(n, d));
    const sq = u => `${u}²`, cu = u => `${u}³`;
    /** "radius 3 cm" or "diameter 6 cm", plus the sentence that turns a diameter into a radius. */
    function baseSize(rng, r, u, p = 0.4) {
        const useD = rng.bool(p);
        return { useD, text: useD ? `diameter ${2 * r} ${u}` : `radius ${r} ${u}`, fix: useD ? R`The radius is half the diameter: ${m(R`r=${2 * r}\div2=${r}`)}. ` : '' };
    }
    // [radius, height, slant height] of cones with whole-number sides.
    const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [8, 15, 17], [15, 8, 17], [12, 16, 20]];
    const SMALLT = TRIPLES.filter(t => t[0] <= 9 && t[1] <= 12);

    // Surface areas as multiples of π.  A tier is { r, h } (cylinder) or { r, s } (cone with slant height s).
    const cylSA = (r, h) => 2 * r * r + 2 * r * h;
    const coneSA = (r, s) => r * r + r * s;
    const ownSA = t => (t.s != null ? coneSA(t.r, t.s) : cylSA(t.r, t.h));
    /** Stack the tiers on one axis: every join hides the smaller circle twice. */
    function stackSA(tiers) {
        let total = 0, hidden = 0;
        tiers.forEach((t, i) => { total += ownSA(t); if (i) hidden += Math.min(t.r, tiers[i - 1].r) ** 2; });
        return { total, hidden, sa: total - 2 * hidden };
    }
    const cylTex = (r, h) => R`2\pi\times${r}^2+2\pi\times${r}\times${h}=${tp(cylSA(r, h))}`;
    const coneTex = (r, s) => R`\pi\times${r}^2+\pi\times${r}\times${s}=${tp(coneSA(r, s))}`;

    // Numbers used in the tutorial and the worked examples.
    const T1 = [{ r: 5, h: 4 }, { r: 2, h: 6 }], S1 = stackSA(T1);
    const T2 = [{ r: 3, h: 6 }, { r: 3, s: 5 }], S2 = stackSA(T2);

    CA.register({
        id: 8,

        tutorial: [
            {
                h: 'The cylinder: volume and surface area',
                html: R`
                <p>A <strong>cylinder</strong> has two equal circles for its top and bottom (the <strong>bases</strong>)
                   and one curved side. Its size is fixed by two numbers: the <strong>radius</strong> \(r\) of the base
                   and the <strong>height</strong> \(h\).</p>
                <p><strong>Volume.</strong> The volume of a box is <em>base area × height</em>, because a box is a stack
                   of layers. A cylinder is a stack of circles in exactly the same way — like a pile of coins.</p>
                <p><strong>Surface area.</strong> Peel the label off a can and lay it flat: it is a
                   <strong>rectangle</strong>. Its height is the height of the can, and its length went exactly once
                   round the can, so it is the <strong>circumference</strong> \(2\pi r\). Add the two circles and you
                   have the whole surface.</p>
                ${F.row(F.cap(cylFig(3, 5, { labels: { r: 'r', h: 'h' }, max: 105 }), 'The cylinder'), F.cap(netFig(), 'Unrolled: its net'))}
                <div class="ca-formula">\[ V = \pi r^2 h \] \[ \text{Surface area} = \underbrace{2\pi r^2}_{\text{two circles}} + \underbrace{2\pi r h}_{\text{curved side}} \]</div>
                <p>A cylinder with radius 3 cm and height 10 cm has volume \(\pi\times3^2\times10=90\pi\) cm³ and surface
                   area \(2\pi\times3^2+2\pi\times3\times10=18\pi+60\pi=78\pi\) cm². We leave \(\pi\) in the answer:
                   \(90\pi\) is exact, while \(282.6\) is only an estimate.</p>
                <div class="ca-warn"><strong>Radius or diameter?</strong> Problems love to give the
                   <em>diameter</em>. Halve it before you do anything else. A can 10 cm across has \(r=5\), and
                   \(r^2=25\), not 100.</div>
                <div class="ca-tip"><strong>Count the circles.</strong> The formula is for a closed cylinder. A bucket
                   or a glass has only 1 circle; a pipe or a label has none. Ask what the object really has.</div>`,
            },
            {
                h: 'The cone: volume and surface area',
                html: R`
                <p>A <strong>cone</strong> has one circular base and a point (the <strong>apex</strong>) straight above
                   the centre of the base. It has <em>two</em> different "heights":</p>
                <ul>
                    <li>the <strong>height</strong> \(h\), measured straight up the middle;</li>
                    <li>the <strong>slant height</strong> \(s\), measured from the apex down the sloping side to the
                        edge of the base.</li>
                </ul>
                ${F.row(F.cap(coneFig(3, 4, { r: 'r', h: 'h', s: 's' }), 'Cone'), F.cap(cylFig(3, 4, { labels: { r: 'r', h: 'h' }, max: 110 }), 'Cylinder: 3 times the volume'))}
                <p><strong>Volume.</strong> Fill a cone with water and pour it into a cylinder with the <em>same base
                   and the same height</em>: it takes exactly <strong>three</strong> conefuls to fill the cylinder.</p>
                <p><strong>Surface area.</strong> A cone has one circle, \(\pi r^2\), and one curved surface. Cut the
                   curved surface along a slant line and it opens into a sector of a circle of radius \(s\), with
                   area \(\pi r s\).</p>
                <div class="ca-formula">\[ V = \tfrac13 \pi r^2 h \] \[ \text{Surface area} = \underbrace{\pi r^2}_{\text{base}} + \underbrace{\pi r s}_{\text{curved side}} \]</div>
                <div class="ca-warn"><strong>Do not mix up \(h\) and \(s\).</strong> Volume uses the height \(h\).
                   Surface area uses the slant height \(s\).</div>
                <p>The three lengths \(r\), \(h\), \(s\) form a right triangle inside the cone, with \(s\) as the
                   longest side, so \(r^2+h^2=s^2\). If a problem gives \(r\) and \(h\) but you need \(s\), look for a
                   familiar triple: 3-4-5, 6-8-10, 5-12-13, 8-15-17.</p>
                <p>A cone with \(r=3\) and \(h=4\) has \(s=5\) (because \(9+16=25\)). Its volume is
                   \(\tfrac13\pi\times9\times4=12\pi\) and its surface area is \(\pi\times9+\pi\times3\times5=24\pi\).</p>`,
            },
            {
                h: 'Stacking solids: two faces overlap',
                html: R`
                <p>Glue two solids together and their <strong>volumes simply add</strong>. Their surface areas do
                   <em>not</em>: where they touch, a patch of each solid is hidden inside.</p>
                ${F.row(F.cap(stackFig([{ ...T1[0], label: 'r = 5, h = 4' }, { ...T1[1], label: 'r = 2, h = 6' }]), 'A small cylinder on a big one'), F.cap(stackFig([{ r: 3, h: 6, label: 'r = 3, h = 6' }, { r: 3, h: 4, cone: true, label: 'r = 3, s = 5' }]), 'A cone on a cylinder'))}
                <div class="ca-key"><strong>Key idea.</strong> Each time two solids are stacked, <strong>two faces
                   overlap</strong>: one patch on each solid. So
                   \[ \text{SA of the stack} = \text{sum of separate SAs} - 2 \times \text{overlap} \]
                   The overlapping area is the <em>smaller</em> of the two circles that meet.</div>
                <p><strong>Small cylinder on a big cylinder.</strong> Separately: ${m(cylTex(5, 4))} and
                   ${m(cylTex(2, 6))}. They overlap in a circle of radius 2, area \(4\pi\). So the stack has
                   ${m(R`${tp(S1.total)}-2\times4\pi=${tp(S1.sa)}`)}.</p>
                <p><strong>Cone on a cylinder with the same base.</strong> Separately: ${m(cylTex(3, 6))} and
                   ${m(coneTex(3, 5))}. They overlap in a circle of radius 3, area \(9\pi\):
                   ${m(R`${tp(S2.total)}-2\times9\pi=${tp(S2.sa)}`)}.</p>
                <div class="ca-tip"><strong>A quick check.</strong> Look straight down on the first stack. The ring of
                   the big top that you can still see, plus the small top, makes exactly one big circle. So a tower of
                   cylinders has surface area
                   <em>two big circles + all the curved sides</em>: \(2\times25\pi+40\pi+24\pi=114\pi\). Same
                   answer.</div>`,
            },
            {
                h: 'Removing a cylinder or a cone',
                html: R`
                <p>Drill a hole into a solid and the volume goes <em>down</em> by the volume of the hole. The surface
                   area is more interesting: you <strong>lose</strong> the patch of surface where the drill went in,
                   but you <strong>gain</strong> the new surface inside the hole.</p>
                <div class="ca-formula">\[ \text{SA after removing} = \text{original SA} + \text{added area} - \text{lost area} \]</div>
                ${F.row(F.cap(drillFig(5, 8, 2, 5), 'A hole part-way'), F.cap(drillFig(5, 8, 2, 8), 'A hole right through'), F.cap(drillFig(3, 4, 3, 4, { cone: true }), 'A cone hollowed out'))}
                <table>
                    <tr><th>Removed from a cylinder</th><th>Lost</th><th>Added</th></tr>
                    <tr><td>cylindrical hole, radius \(a\), depth \(d\), <strong>part-way</strong></td><td>circle \(\pi a^2\) (the opening)</td><td>wall \(2\pi a d\) and floor \(\pi a^2\)</td></tr>
                    <tr><td>cylindrical hole, radius \(a\), <strong>right through</strong> height \(h\)</td><td>two circles \(2\pi a^2\)</td><td>wall \(2\pi a h\)</td></tr>
                    <tr><td>cone-shaped hollow, radius \(a\), slant height \(s\)</td><td>circle \(\pi a^2\)</td><td>cone's curved surface \(\pi a s\)</td></tr>
                </table>
                <p>Take a cylinder with \(r=5\), \(h=8\): its surface area is \(2\pi\times25+2\pi\times5\times8=130\pi\).</p>
                <ul>
                    <li>Hole of radius 2, depth 5: the floor replaces the opening, so only the wall is extra.
                        \(130\pi+2\pi\times2\times5=150\pi\).</li>
                    <li>Hole of radius 2 right through: \(130\pi+2\pi\times2\times8-2\times4\pi=154\pi\).</li>
                </ul>
                <div class="ca-warn"><strong>Surface area can go up when volume goes down.</strong> Removing material
                   always shrinks the volume, but it usually <em>adds</em> surface.</div>
                <div class="ca-key"><strong>A cone out of a cylinder.</strong> If the cone has the same base and the same
                   height as the cylinder, its volume is \(\tfrac13\) of the cylinder's, so \(\tfrac23\) of the cylinder
                   is left.</div>`,
            },
            {
                h: 'Rotating a plane figure',
                html: R`
                <p>Spin a rectangle about one of its sides, like a revolving door, and it sweeps out a
                   <strong>cylinder</strong>. Spin a right triangle about one of its legs and it sweeps out a
                   <strong>cone</strong>.</p>
                ${F.row(spinFig('rect', 4, 3, '4', '3'), cylFig(3, 4, { labels: { r: '3', h: '4' }, max: 90 }))}
                ${F.row(spinFig('tri', 4, 3, '4', '3', '5'), coneFig(3, 4, { r: '3', h: '4', s: '5' }, { max: 90 }))}
                <div class="ca-key"><strong>Key idea.</strong> The side you spin <em>about</em> (the axis) stays still:
                   it becomes the <strong>height</strong>. The side sticking out sweeps a circle: it becomes the
                   <strong>radius</strong>. For a triangle, the hypotenuse becomes the <strong>slant height</strong>.</div>
                <p><strong>Rotating about different axes produces different solids.</strong> Take a 3-by-4 rectangle:</p>
                <table>
                    <tr><th>Axis</th><th>Radius</th><th>Height</th><th>Volume</th><th>Surface area</th></tr>
                    <tr><td>a side of length 4</td><td>3</td><td>4</td><td>\(\pi\times3^2\times4=36\pi\)</td><td>\(18\pi+24\pi=42\pi\)</td></tr>
                    <tr><td>a side of length 3</td><td>4</td><td>3</td><td>\(\pi\times4^2\times3=48\pi\)</td><td>\(32\pi+24\pi=56\pi\)</td></tr>
                </table>
                <p>The radius is squared, so making the <em>longer</em> side the radius gives the bigger solid.</p>
                ${F.row(spinFig('trap', 7, 3, '7', '3', '3', 3), stackFig([{ r: 3, h: 3 }, { r: 3, h: 4, cone: true }], { maxH: 100, maxW: 70 }))}
                <div class="ca-tip"><strong>Other shapes.</strong> Cut the shape into rectangles and right triangles.
                   This trapezoid is a 3-by-3 square with a right triangle on top, so it sweeps out a cylinder with a
                   cone on it: \(\pi\times3^2\times3+\tfrac13\pi\times3^2\times4=27\pi+12\pi=39\pi\).</div>`,
            },
            {
                h: 'Volume never changes: water and melting',
                html: R`
                <p>Water changes shape but keeps its <strong>volume</strong>. So does metal or wax when it is melted
                   and cast into a new mould. That one idea solves every pouring and melting problem: write the volume
                   before, write the volume after, and set them equal.</p>
                ${F.row(tank(5, 11, { level: 7.5, old: 5, labels: { r: 'R', rise: 'rise' }, thing: (cx, bot) => stone(cx, bot - 4, 30) }))}
                <div class="ca-key"><strong>Sinking an object.</strong> When something is pushed completely under
                   water, the water level rises to make room for it. The extra space is a thin cylinder with the
                   tank's base:
                   \[ \text{volume of the object} = \pi R^2 \times (\text{rise in level}) \]</div>
                <p>A stone dropped into a tank of radius 10 cm lifts the water by 3 cm, so its volume is
                   \(\pi\times10^2\times3=300\pi\) cm³ — and we never needed to know the stone's shape.</p>
                <div class="ca-tip"><strong>The \(\pi\) usually cancels.</strong> Pour water 12 cm deep from a glass
                   of radius 3 into a glass of radius 6: \(\pi\times3^2\times12=\pi\times6^2\times h\), so
                   \(108=36h\) and \(h=3\) cm. To find <em>how many</em> small cones can be cast from a cylinder,
                   divide the volumes, cancelling \(\pi\) first.</div>`,
            },
            {
                h: 'Cutting and scaling',
                html: R`
                <p><strong>Cutting is stacking in reverse.</strong> Stacking hides two faces; a cut <em>uncovers</em>
                   two new faces. The volume does not change, but the surface area goes up.</p>
                ${F.row(F.cap(logFig(3, { r: 'r' }), '2 cuts → 3 pieces → 4 new circles'), F.cap(axisFig(3, 5, { d: '2r', h: 'h' }), 'Cut through the axis → 2 new rectangles'))}
                <table>
                    <tr><th>Cut</th><th>New faces</th><th>Surface area goes up by</th></tr>
                    <tr><td>across, into \(n\) pieces (\(n-1\) cuts)</td><td>\(2(n-1)\) circles</td><td>\(2(n-1)\pi r^2\)</td></tr>
                    <tr><td>from top to bottom through the axis</td><td>2 rectangles, each \(2r\) by \(h\)</td><td>\(2\times 2r\times h=4rh\)</td></tr>
                </table>
                <div class="ca-warn"><strong>Pieces and cuts.</strong> Cutting into 4 pieces needs 3 cuts, not 4.</div>
                <p><strong>Scaling.</strong> In \(V=\pi r^2h\) the radius is squared but the height is not. Doubling the
                   height doubles the volume; doubling the radius multiplies it by \(2^2=4\). The same is true for
                   cones, because \(\tfrac13\pi r^2h\) has the same \(r^2h\) in it. When <em>every</em> length is
                   multiplied by \(k\), every area is multiplied by \(k^2\) and the volume by \(k^3\).</p>`,
            },
        ],

        summary: [
            {
                topic: 'Surface area and volume of a cylinder',
                points: [
                    R`Surface area \(=2\pi r^2+2\pi rh\) (two circles + the curved side, which unrolls into a rectangle).`,
                    R`Volume \(=\pi r^2h\) (base area × height).`,
                ],
            },
            {
                topic: 'Surface area and volume of a cone',
                points: [
                    R`Surface area \(=\pi r^2+\pi rs\), where \(s\) is the <strong>slant height</strong> and \(r^2+h^2=s^2\).`,
                    R`Volume \(=\tfrac13\pi r^2h\): one third of the cylinder with the same base and height.`,
                ],
            },
            {
                topic: 'Combination of cylinder and cone',
                points: [
                    R`<strong>Stacking:</strong> each time two solids are stacked, two faces overlap. Surface area = sum of the separate surface areas − 2 × overlapping area.`,
                    R`<strong>Removing</strong> a cylinder or cone from a cylinder: surface area after removing = original surface area + added area − lost area.`,
                    R`<strong>Rotating a plane figure:</strong> a rectangle gives a cylinder, a right triangle gives a cone. Rotating about different axes produces different solids.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Volume and surface area of a can',
                q: R`A closed can is a cylinder 12 cm across and 10 cm tall. Find its volume and its surface area in terms of \(\pi\).`,
                fig: F.row(cylFig(6, 10, { labels: { d: '12', h: '10' } })),
                steps: [
                    R`"12 cm across" is the diameter, so \(r=6\).`,
                    R`Volume: \(\pi r^2h=\pi\times6^2\times10=360\pi\) cm³.`,
                    R`Two circles: \(2\pi r^2=2\times\pi\times6^2=72\pi\) cm². Curved side: \(2\pi rh=2\pi\times6\times10=120\pi\) cm².`,
                    R`Surface area: \(72\pi+120\pi=192\pi\) cm².`,
                ],
                answer: R`\(360\pi\) cm³ and \(192\pi\) cm²`,
            },
            {
                title: 'A cone and its slant height',
                q: R`A cone has base radius 6 cm and height 8 cm. Find its volume, its slant height and its surface area.`,
                fig: F.row(coneFig(6, 8, { r: '6', h: '8', s: 's' })),
                steps: [
                    R`Volume: \(\tfrac13\pi r^2h=\tfrac13\times\pi\times36\times8=96\pi\) cm³.`,
                    R`The radius, height and slant height make a right triangle: \(s^2=6^2+8^2=100\), so \(s=10\) cm.`,
                    R`Surface area: \(\pi r^2+\pi rs=\pi\times36+\pi\times6\times10=36\pi+60\pi=96\pi\) cm².`,
                ],
                answer: R`\(96\pi\) cm³, slant height 10 cm, \(96\pi\) cm²`,
            },
            {
                title: 'Stacking: a tower',
                q: R`A cylinder with radius 2 cm and height 5 cm stands on the centre of a cylinder with radius 4 cm and height 3 cm. A cone with base radius 2 cm and slant height 6 cm is placed on top, exactly covering the top of the small cylinder. Find the surface area of the whole solid.`,
                fig: F.row(stackFig([{ r: 4, h: 3, label: 'r = 4, h = 3' }, { r: 2, h: 5, label: 'r = 2, h = 5' }, { r: 2, h: Math.sqrt(32), cone: true, label: 'r = 2, s = 6' }])),
                steps: [
                    R`Separate surface areas. Big cylinder: ${m(cylTex(4, 3))}. Small cylinder: ${m(cylTex(2, 5))}. Cone: ${m(coneTex(2, 6))}.`,
                    R`Sum: \(56\pi+28\pi+16\pi=100\pi\).`,
                    R`There are two joins. At each, two faces overlap in a circle of radius 2, area \(4\pi\). Hidden: \(2\times4\pi+2\times4\pi=16\pi\).`,
                    R`Surface area: \(100\pi-16\pi=84\pi\) cm².`,
                ],
                answer: R`\(84\pi\) cm²`,
            },
            {
                title: 'Removing: a drilled cylinder',
                q: R`A solid cylinder has radius 6 cm and height 10 cm. A cylindrical hole of radius 2 cm is drilled down its axis. Find the surface area of the solid if the hole is (a) 4 cm deep, (b) drilled right through.`,
                fig: F.row(drillFig(6, 10, 2, 4), drillFig(6, 10, 2, 10)),
                steps: [
                    R`Original surface area: \(2\pi\times6^2+2\pi\times6\times10=72\pi+120\pi=192\pi\) cm².`,
                    R`(a) Lost: the opening, \(\pi\times2^2=4\pi\). Added: the floor of the hole, \(4\pi\), and its wall, \(2\pi\times2\times4=16\pi\).`,
                    R`(a) \(192\pi+(4\pi+16\pi)-4\pi=208\pi\) cm².`,
                    R`(b) Lost: an opening at each end, \(2\times4\pi=8\pi\). Added: the wall, \(2\pi\times2\times10=40\pi\). So \(192\pi+40\pi-8\pi=224\pi\) cm².`,
                ],
                answer: R`(a) \(208\pi\) cm², (b) \(224\pi\) cm²`,
            },
            {
                title: 'Rotating a triangle two ways',
                q: R`A right triangle has legs 3 cm and 4 cm and hypotenuse 5 cm. It is rotated about one of its legs to make a cone. Compare the volume and the surface area of the two possible cones.`,
                fig: F.row(spinFig('tri', 4, 3, '4', '3', '5'), spinFig('tri', 3, 4, '3', '4', '5')),
                steps: [
                    R`About the 4 cm leg: \(h=4\), \(r=3\), \(s=5\). \(V=\tfrac13\pi\times3^2\times4=12\pi\). Surface area \(=\pi\times9+\pi\times3\times5=24\pi\).`,
                    R`About the 3 cm leg: \(h=3\), \(r=4\), \(s=5\). \(V=\tfrac13\pi\times4^2\times3=16\pi\). Surface area \(=\pi\times16+\pi\times4\times5=36\pi\).`,
                    R`Different axes, different solids: rotating about the shorter leg gives the bigger cone, by \(4\pi\) cm³ of volume and \(12\pi\) cm² of surface.`,
                ],
                answer: R`\(12\pi\) cm³ and \(24\pi\) cm²; or \(16\pi\) cm³ and \(36\pi\) cm²`,
            },
            {
                title: 'A sunken cone',
                q: R`A cylindrical tank has radius 6 cm and holds some water. A solid metal cone with base radius 3 cm and height 12 cm is put in and is completely covered. No water spills. How far does the water level rise?`,
                fig: F.row(tank(6, 17, { level: 14, old: 13, labels: { r: '6', rise: '?' }, thing: sunkCone(3, 12), maxH: 140 })),
                steps: [
                    R`Volume of the cone: \(\tfrac13\pi\times3^2\times12=36\pi\) cm³.`,
                    R`The water must rise to make room for \(36\pi\) cm³. The risen water is a thin cylinder with the tank's base, \(\pi\times6^2=36\pi\) cm².`,
                    R`Rise \(=36\pi\div36\pi=1\) cm.`,
                ],
                answer: R`1 cm`,
            },
        ],

        practice: [
            {
                id: 'cyl-volume', name: 'Volume of a cylinder', level: 1,
                gen(rng) {
                    const r = rng.int(2, 9), h = rng.int(3, 15);
                    const [u, thing, what] = rng.pick([
                        ['cm', 'A cylinder has', 'its volume'],
                        ['cm', 'A can of soup is a cylinder with', 'the volume of the can'],
                        ['m', 'A cylindrical water tank has', 'the volume of the tank'],
                        ['cm', 'A candle is a cylinder with', 'the volume of wax in the candle'],
                        ['cm', 'A stack of coins makes a cylinder with', 'the volume of the stack'],
                    ]);
                    const bs = baseSize(rng, r, u);
                    return {
                        q: `${thing} ${bs.text} and height ${h} ${u}. Find ${what} in terms of π.`,
                        fig: F.row(cylFig(r, h, { labels: bs.useD ? { d: `${2 * r}`, h: `${h}` } : { r: `${r}`, h: `${h}` }, max: 110 })),
                        ans: CA.pi(r * r * h, 1, cu(u)),
                        sol: bs.fix + R`${m(R`V=\pi r^2h=\pi\times${r}^2\times${h}=${tp(r * r * h)}`)} ${cu(u)}.`,
                    };
                },
            },
            {
                id: 'cyl-surface', name: 'Surface area of a cylinder', level: 1,
                gen(rng) {
                    const r = rng.int(2, 8), h = rng.int(3, 12);
                    const [u, text, what, circles] = rng.pick([
                        ['cm', `A cylinder has radius ${r} cm and height ${h} cm.`, 'its surface area', 2],
                        ['cm', `A closed tin can is a cylinder with radius ${r} cm and height ${h} cm.`, 'its surface area', 2],
                        ['cm', `A solid wooden cylinder has radius ${r} cm and height ${h} cm.`, 'its surface area', 2],
                        ['m', `A closed oil drum is a cylinder with radius ${r} m and height ${h} m.`, 'its surface area', 2],
                        ['cm', `A bucket is a cylinder with radius ${r} cm and height ${h} cm. It has a bottom but no lid.`, 'the area of metal on the outside of the bucket, including the bottom', 1],
                        ['cm', `A paper label covers the curved side of a can with radius ${r} cm and height ${h} cm exactly, with no overlap.`, 'the area of the label', 0],
                    ]);
                    const coef = circles * r * r + 2 * r * h;
                    const curved = R`Curved side: ${m(R`2\pi rh=2\pi\times${r}\times${h}=${tp(2 * r * h)}`)}`;
                    return {
                        q: `${text} Find ${what} in terms of π.`,
                        fig: F.row(cylFig(r, h, { labels: { r: `${r}`, h: `${h}` }, max: 105 })),
                        ans: CA.pi(coef, 1, sq(u)),
                        sol: circles === 0 ? R`The label is only the curved side, a rectangle ${m(R`2\pi r`)} by ${m('h')}: ${m(R`2\pi\times${r}\times${h}=${tp(coef)}`)} ${sq(u)}.`
                            : R`${circles === 2 ? 'Two circles' : 'Only one circle'}: ${m(R`${circles === 2 ? '2' : ''}\pi r^2=${circles === 2 ? R`2\times` : ''}\pi\times${r}^2=${tp(circles * r * r)}`)}. ${curved}. Total: ${m(R`${tp(circles * r * r)}+${tp(2 * r * h)}=${tp(coef)}`)} ${sq(u)}.`,
                    };
                },
            },
            {
                id: 'cone-volume', name: 'Volume of a cone', level: 1,
                gen(rng) {
                    let r, h;
                    do { r = rng.int(2, 9); h = r % 3 === 0 ? rng.int(2, 13) : 3 * rng.int(1, 5); } while (h > 3 * r || 2 * h < r);
                    const [u, thing, what] = rng.pick([
                        ['cm', 'A cone has base', 'its volume'],
                        ['cm', 'An ice-cream cone has', 'the volume it can hold when filled level with the top'],
                        ['m', 'A pile of sand is a cone with base', 'the volume of sand'],
                        ['cm', 'A paper cup is a cone with', 'the volume of water it holds when full'],
                    ]);
                    const bs = baseSize(rng, r, u);
                    return {
                        q: `${thing} ${bs.text} and height ${h} ${u}. Find ${what} in terms of π.`,
                        fig: F.row(coneFig(r, h, bs.useD ? { d: `${2 * r}`, h: `${h}` } : { r: `${r}`, h: `${h}` }, { max: 105 })),
                        ans: CA.pi(r * r * h, 3, cu(u)),
                        sol: bs.fix + R`${m(R`V=\tfrac13\pi r^2h=\tfrac13\times\pi\times${r}^2\times${h}=${tp(r * r * h, 3)}`)} ${cu(u)}.`,
                    };
                },
            },
            {
                id: 'cone-surface', name: 'Surface area of a cone', level: 1,
                gen(rng) {
                    let r, s;
                    do { r = rng.int(2, 9); s = rng.int(3, 15); } while (s <= r || s > 3.2 * r);
                    const h = Math.sqrt(s * s - r * r), v = rng.int(0, 3);
                    const [q, ans, sol] = [
                        [`A cone has base radius ${r} cm and slant height ${s} cm. Find its surface area (including the base) in terms of π.`, coneSA(r, s),
                            R`${m(R`\pi r^2+\pi rs=${coneTex(r, s)}`)} cm².`],
                        [`A solid wooden cone has base radius ${r} cm and slant height ${s} cm. Find its surface area in terms of π.`, coneSA(r, s),
                            R`Base ${m(R`\pi\times${r}^2=${tp(r * r)}`)}, curved side ${m(R`\pi\times${r}\times${s}=${tp(r * s)}`)}. Total ${m(tp(coneSA(r, s)))} cm².`],
                        [`A party hat is a cone with no base. Its radius is ${r} cm and its slant height is ${s} cm. Find the area of card in the hat in terms of π.`, r * s,
                            R`There is no base, so only the curved side counts: ${m(R`\pi rs=\pi\times${r}\times${s}=${tp(r * s)}`)} cm².`],
                        [`A cone has base diameter ${2 * r} cm and slant height ${s} cm. Find its surface area (including the base) in terms of π.`, coneSA(r, s),
                            R`The radius is ${m(R`${2 * r}\div2=${r}`)}. ${m(R`\pi r^2+\pi rs=${coneTex(r, s)}`)} cm².`],
                    ][v];
                    return { q, fig: F.row(coneFig(r, h, v === 3 ? { d: `${2 * r}`, s: `${s}` } : { r: `${r}`, s: `${s}` }, { max: 105 })), ans: CA.pi(ans, 1, 'cm²'), sol };
                },
            },
            {
                id: 'cone-slant', name: 'Cone: find the slant height first', level: 2,
                gen(rng) {
                    const [r, h, s] = rng.pick(TRIPLES.filter(t => t[1] >= 0.7 * t[0])), v = rng.int(0, 3);
                    const pyth = R`The radius, height and slant height make a right triangle: ${m(R`s^2=${r}^2+${h}^2=${s * s}`)}, so ${m(`s=${s}`)}. `;
                    const [q, lab, ans, sol] = [
                        [`A cone has base radius ${r} cm and height ${h} cm. Find its surface area (including the base) in terms of π.`, { r: `${r}`, h: `${h}`, s: 's' }, CA.pi(coneSA(r, s), 1, 'cm²'),
                            pyth + R`Surface area ${m(R`=${coneTex(r, s)}`)} cm².`],
                        [`A tent is a cone with no floor. Its radius is ${r} m and its height (measured straight up the middle) is ${h} m. Find the area of canvas in the tent in terms of π.`, { r: `${r}`, h: `${h}`, s: 's' }, CA.pi(r * s, 1, 'm²'),
                            pyth + R`Curved side only: ${m(R`\pi rs=\pi\times${r}\times${s}=${tp(r * s)}`)} m².`],
                        [R`A cone has base radius ${r} cm and surface area ${P(coneSA(r, s))} cm² (including the base). What is its slant height?`, { r: `${r}`, s: '?' }, CA.num(s, 'cm'),
                            R`${m(R`\pi\times${r}^2+\pi\times${r}\times s=${tp(coneSA(r, s))}`)}, so ${m(R`${r}s=${coneSA(r, s)}-${r * r}=${r * s}`)} and ${m(`s=${s}`)} cm.`],
                        [`A cone has base radius ${r} cm and slant height ${s} cm. Find its volume in terms of π.`, { r: `${r}`, h: 'h', s: `${s}` }, CA.pi(r * r * h, 3, 'cm³'),
                            R`Volume needs the height: ${m(R`h^2=${s}^2-${r}^2=${h * h}`)}, so ${m(`h=${h}`)}. ${m(R`V=\tfrac13\pi\times${r}^2\times${h}=${tp(r * r * h, 3)}`)} cm³.`],
                    ][v];
                    return { q, fig: F.row(coneFig(r, h, lab, { max: 105 })), ans, sol };
                },
            },
            {
                id: 'find-missing', name: 'Formulas backwards and scaled', level: 2,
                gen(rng) {
                    const v = rng.int(0, 8), r = rng.int(2, 9);
                    const h = v === 2 || v === 4 ? (r % 3 === 0 ? rng.int(2, 12) : 3 * rng.int(1, 4)) : rng.int(2, 12);
                    const cyl = r * r * h, cone = r * r * h / 3;
                    const k = rng.int(4, 40), a = rng.int(2, 4), V = 12 * rng.int(1, 6), shape = rng.pick(['cylinder', 'cone']);
                    const times = x => (x === 2 ? 'twice' : `${x} times`);
                    const [q, ans, sol] = [
                        [R`A cylinder has volume ${P(cyl)} cm³ and base radius ${r} cm. What is its height?`, CA.num(h, 'cm'),
                            R`${m(R`\pi\times${r}^2\times h=${tp(cyl)}`)}, so ${m(R`h=${cyl}\div${r * r}=${h}`)} cm.`],
                        [R`A cylinder has volume ${P(cyl)} cm³ and height ${h} cm. What is its radius?`, CA.num(r, 'cm'),
                            R`${m(R`\pi r^2\times${h}=${tp(cyl)}`)}, so ${m(R`r^2=${cyl}\div${h}=${r * r}`)} and ${m(`r=${r}`)} cm.`],
                        [R`A cone has volume ${P(cone)} cm³ and base radius ${r} cm. What is its height?`, CA.num(h, 'cm'),
                            R`${m(R`\tfrac13\pi\times${r}^2\times h=${tp(cone)}`)}, so ${m(R`${r * r}h=3\times${cone}=${3 * cone}`)} and ${m(`h=${h}`)} cm.`],
                        [R`A closed cylinder has radius ${r} cm and surface area ${P(cylSA(r, h))} cm². What is its height?`, CA.num(h, 'cm'),
                            R`The two circles take ${m(R`2\pi\times${r}^2=${tp(2 * r * r)}`)}, leaving ${m(R`${tp(cylSA(r, h))}-${tp(2 * r * r)}=${tp(2 * r * h)}`)} for the curved side ${m(R`2\pi\times${r}\times h`)}. So ${m(R`h=${2 * r * h}\div${2 * r}=${h}`)} cm.`],
                        [R`A cone has volume ${P(cone)} cm³ and height ${h} cm. What is the radius of its base?`, CA.num(r, 'cm'),
                            R`${m(R`\tfrac13\pi r^2\times${h}=${tp(cone)}`)}, so ${m(R`r^2=3\times${cone}\div${h}=${r * r}`)} and ${m(`r=${r}`)} cm.`],
                        [`A cone and a cylinder have the same base and the same height. The cylinder holds ${2 * k} cm³ more than the cone. What is the volume of the cylinder?`, CA.num(3 * k, 'cm³'),
                            R`The cylinder is 3 cones, so the difference is 2 cones: one cone is ${m(R`${2 * k}\div2=${k}`)} cm³ and the cylinder is ${m(R`3\times${k}=${3 * k}`)} cm³.`],
                        [`A cone and a cylinder have the same base and the same volume. The cylinder is ${h} cm tall. How tall is the cone?`, CA.num(3 * h, 'cm'),
                            R`With the same base, a cone needs 3 times the height to hold as much: ${m(R`3\times${h}=${3 * h}`)} cm.`],
                        [`A ${shape} has volume ${V} cm³. A second ${shape} has the same height but ${times(a)} the radius. What is the volume of the second ${shape}?`, CA.num(V * a * a, 'cm³'),
                            R`The volume depends on ${m('r^2')}, so it is multiplied by ${m(R`${a}^2=${a * a}`)}: ${m(R`${V}\times${a * a}=${V * a * a}`)} cm³.`],
                        [`A ${shape} has volume ${V} cm³. A second ${shape} has ${times(a)} the radius but only half the height. What is the volume of the second ${shape}?`, CA.num(V * a * a / 2, 'cm³'),
                            R`The radius is squared, the height is not: the volume is multiplied by ${m(R`${a}^2\times\tfrac12=${CA.tex.frac(a * a, 2)}`)}. ${m(R`${V}\times${CA.tex.frac(a * a, 2)}=${V * a * a / 2}`)} cm³.`],
                    ][v];
                    return { q, ans, sol };
                },
            },
            {
                id: 'stack-cylinders', name: 'Stacking cylinders', level: 2,
                gen(rng) {
                    const v = rng.int(0, 2);
                    if (v === 2) {
                        const r = rng.int(2, 6), h = rng.int(2, 5), n = rng.int(2, 4), dec = rng.bool();
                        const one = cylSA(r, h), tiers = Array.from({ length: n }, () => ({ r, h })), S = stackSA(tiers);
                        const thing = rng.pick(['wooden discs', 'tins', 'cheeses', 'toy drums']);
                        return {
                            q: dec ? `${n} identical ${thing}, each a cylinder with radius ${r} cm and height ${h} cm, are glued together in a stack to make one tall cylinder. By how much is the surface area of the stack less than the total surface area of the separate cylinders? Give your answer in terms of π.`
                                : `${n} identical ${thing}, each a cylinder with radius ${r} cm and height ${h} cm, are glued together in a stack to make one tall cylinder. Find the surface area of the stack in terms of π.`,
                            fig: F.row(stackFig(tiers.map((t, i) => ({ ...t, label: i === 0 ? `r = ${r}, h = ${h} each` : '' })))),
                            ans: CA.pi(dec ? 2 * S.hidden : S.sa, 1, 'cm²'),
                            sol: R`There ${n === 2 ? 'is 1 join' : `are ${n - 1} joins`}, and each hides two circles of area ${m(R`\pi\times${r}^2=${tp(r * r)}`)}: ${m(R`${2 * (n - 1)}\times${tp(r * r)}=${tp(2 * S.hidden)}`)} cm² is lost.` +
                                (dec ? '' : R` One cylinder: ${m(cylTex(r, h))}. Stack: ${m(R`${n}\times${tp(one)}-${tp(2 * S.hidden)}=${tp(S.sa)}`)} cm². (Check: it is one cylinder of height ${n * h}.)`),
                        };
                    }
                    const r1 = rng.int(3, 8), r2 = rng.int(1, r1 - 1), h1 = rng.int(2, 8), h2 = rng.int(2, 8);
                    const big = { r: r1, h: h1, label: `r = ${r1}, h = ${h1}` }, small = { r: r2, h: h2, label: `r = ${r2}, h = ${h2}` };
                    const tiers = v === 0 ? [big, small] : [small, big], S = stackSA(tiers);
                    const text = v === 0
                        ? rng.pick([`A cylinder with radius ${r2} cm and height ${h2} cm stands on the centre of a larger cylinder with radius ${r1} cm and height ${h1} cm.`,
                            `A two-tier cake is made of two cylinders. The bottom tier has radius ${r1} cm and height ${h1} cm; the top tier has radius ${r2} cm and height ${h2} cm.`])
                        : rng.pick([`A toy mushroom is made of two solid cylinders: a stalk with radius ${r2} cm and height ${h2} cm, and on top of it a cap with radius ${r1} cm and height ${h1} cm.`,
                            `A small table is made of two solid cylinders: a leg with radius ${r2} cm and height ${h2} cm, and on top of it a round top with radius ${r1} cm and height ${h1} cm.`]);
                    return {
                        q: `${text} The two are glued together. Find the surface area of the whole solid (including its underside) in terms of π.`,
                        fig: F.row(stackFig(tiers)),
                        ans: CA.pi(S.sa, 1, 'cm²'),
                        sol: R`Separately: ${m(cylTex(r1, h1))} and ${m(cylTex(r2, h2))}. Two faces overlap in a circle of radius ${r2}, area ${m(tp(r2 * r2))}. ${m(R`${tp(cylSA(r1, h1))}+${tp(cylSA(r2, h2))}-2\times${tp(r2 * r2)}=${tp(S.sa)}`)} cm².`,
                    };
                },
            },
            {
                id: 'stack-cone', name: 'A cone on a cylinder', level: 2,
                gen(rng) {
                    const v = rng.int(0, 2), [r2, hc, s] = rng.pick(SMALLT);
                    const r1 = v === 1 ? r2 + rng.int(1, 3) : r2, H = rng.int(Math.max(3, Math.ceil(hc / 2)), 12);
                    const [u, thing] = rng.pick([['m', 'A grain silo'], ['cm', 'A toy rocket'], ['m', 'A model tower'], ['cm', 'A wooden peg'], ['cm', 'A chess piece']]);
                    if (v === 2) return {
                        q: `${thing} is a cylinder with a cone on top. Both have radius ${r1} ${u}. The cylinder is ${H} ${u} tall and the cone is ${hc} ${u} tall. Find the total volume in terms of π.`,
                        fig: F.row(stackFig([{ r: r1, h: H, label: `r = ${r1}, h = ${H}` }, { r: r2, h: hc, cone: true, label: `r = ${r2}, h = ${hc}` }])),
                        ans: CA.pi(3 * r1 * r1 * H + r1 * r1 * hc, 3, cu(u)),
                        sol: R`Volumes add. Cylinder: ${m(R`\pi\times${r1}^2\times${H}=${tp(r1 * r1 * H)}`)}. Cone: ${m(R`\tfrac13\pi\times${r1}^2\times${hc}=${tp(r1 * r1 * hc, 3)}`)}. Total: ${m(tp(3 * r1 * r1 * H + r1 * r1 * hc, 3))} ${cu(u)}.`,
                    };
                    const tiers = [{ r: r1, h: H }, { r: r2, s }], S = stackSA(tiers);
                    return {
                        q: v === 0
                            ? `${thing} is a solid cylinder with a cone on top. Both have radius ${r1} ${u}. The cylinder is ${H} ${u} tall and the cone has slant height ${s} ${u}. Find the surface area of the whole solid (including its flat bottom) in terms of π.`
                            : `${thing} is a solid cylinder with radius ${r1} ${u} and height ${H} ${u}, with a cone standing on the centre of its top. The cone has base radius ${r2} ${u} and slant height ${s} ${u}. Find the surface area of the whole solid (including its flat bottom) in terms of π.`,
                        fig: F.row(stackFig([{ r: r1, h: H, label: `r = ${r1}, h = ${H}` }, { r: r2, h: hc, cone: true, label: `r = ${r2}, s = ${s}` }])),
                        ans: CA.pi(S.sa, 1, sq(u)),
                        sol: R`Separately: cylinder ${m(cylTex(r1, H))}, cone ${m(coneTex(r2, s))}. Two faces overlap in a circle of radius ${r2}, area ${m(tp(r2 * r2))}. ${m(R`${tp(cylSA(r1, H))}+${tp(coneSA(r2, s))}-2\times${tp(r2 * r2)}=${tp(S.sa)}`)} ${sq(u)}.`,
                    };
                },
            },
            {
                id: 'drill-hole', name: 'Drilling a hole in a cylinder', level: 2,
                gen(rng) {
                    const Rr = rng.int(3, 9), a = rng.int(1, Rr - 1), H = rng.int(4, 12), v = rng.int(0, 3);
                    const through = v === 1 || v === 3 || (v === 2 && rng.bool()), d = through ? H : rng.int(1, H - 1);
                    const orig = cylSA(Rr, H), added = through ? 2 * a * H : 2 * a * d + a * a, lost = through ? 2 * a * a : a * a, sa = orig + added - lost;
                    const hole = through ? `A cylindrical hole of radius ${a} cm is drilled along its axis, right through from top to bottom.`
                        : `A cylindrical hole of radius ${a} cm and depth ${d} cm is drilled into the centre of its top.`;
                    const intro = `A solid cylinder has radius ${Rr} cm and height ${H} cm. ${hole}`;
                    const fig = F.row(drillFig(Rr, H, a, d, { lines: [through ? `hole: r = ${a}, right through` : `hole: r = ${a}, depth ${d}`, `cylinder: r = ${Rr}, h = ${H}`] }));
                    const change = through
                        ? R`Lost: two openings, ${m(R`2\times\pi\times${a}^2=${tp(lost)}`)}. Added: the wall of the hole, ${m(R`2\pi\times${a}\times${H}=${tp(added)}`)}. `
                        : R`Lost: the opening, ${m(R`\pi\times${a}^2=${tp(lost)}`)}. Added: the floor of the hole, ${m(tp(a * a))}, and its wall, ${m(R`2\pi\times${a}\times${d}=${tp(2 * a * d)}`)}. `;
                    if (v <= 1) return {
                        q: `${intro} Find the surface area of the solid that is left, including the inside of the hole, in terms of π.`, fig,
                        ans: CA.pi(sa, 1, 'cm²'),
                        sol: R`Original: ${m(cylTex(Rr, H))}. ` + change + R`New surface area: ${m(R`${tp(orig)}+${tp(added)}-${tp(lost)}=${tp(sa)}`)} cm².`,
                    };
                    if (v === 2) return {
                        q: `${intro} By how much does the surface area of the solid increase? Give your answer in terms of π.`, fig,
                        ans: CA.pi(added - lost, 1, 'cm²'),
                        sol: change + R`Increase: ${m(R`${tp(added)}-${tp(lost)}=${tp(added - lost)}`)} cm².`,
                    };
                    return {
                        q: `${intro} Find the volume of the solid that is left, in terms of π.`, fig,
                        ans: CA.pi((Rr * Rr - a * a) * H, 1, 'cm³'),
                        sol: R`Whole cylinder ${m(R`\pi\times${Rr}^2\times${H}=${tp(Rr * Rr * H)}`)}, hole ${m(R`\pi\times${a}^2\times${H}=${tp(a * a * H)}`)}. Left: ${m(R`${tp(Rr * Rr * H)}-${tp(a * a * H)}=${tp((Rr * Rr - a * a) * H)}`)} cm³.`,
                    };
                },
            },
            {
                id: 'rotate', name: 'Rotate a rectangle or a triangle', level: 2,
                gen(rng) {
                    const v = rng.int(0, 3);
                    if (v === 0 || v === 2) {
                        const a = rng.int(2, 9); let b = rng.int(2, 8); if (b === a) b++;
                        const start = `A rectangle is ${a} cm by ${b} cm. It is rotated one full turn about a side of length ${a} cm.`;
                        const fig = F.row(spinFig('rect', a, b, `${a}`, `${b}`));
                        const what = R`It sweeps out a cylinder. The side it turns about is the height, ${a}; the other side is the radius, ${b}. `;
                        return v === 0 ? {
                            q: `${start} Find the volume of the solid it sweeps out, in terms of π.`, fig,
                            ans: CA.pi(b * b * a, 1, 'cm³'),
                            sol: what + R`${m(R`V=\pi\times${b}^2\times${a}=${tp(b * b * a)}`)} cm³.`,
                        } : {
                            q: `${start} Find the surface area of the solid it sweeps out, in terms of π.`, fig,
                            ans: CA.pi(cylSA(b, a), 1, 'cm²'),
                            sol: what + R`Surface area ${m(R`=${cylTex(b, a)}`)} cm².`,
                        };
                    }
                    if (v === 1) {
                        let a, b;
                        do { a = rng.int(2, 10); b = rng.int(2, 9); } while (a === b || (a * b * b) % 3);
                        return {
                            q: `A right triangle has legs ${a} cm and ${b} cm. It is rotated one full turn about the leg of length ${a} cm. Find the volume of the solid it sweeps out, in terms of π.`,
                            fig: F.row(spinFig('tri', a, b, `${a}`, `${b}`)),
                            ans: CA.pi(b * b * a, 3, 'cm³'),
                            sol: R`It sweeps out a cone. The leg it turns about is the height, ${a}; the other leg is the radius, ${b}. ${m(R`V=\tfrac13\pi\times${b}^2\times${a}=${tp(b * b * a, 3)}`)} cm³.`,
                        };
                    }
                    const [b, a, c] = rng.pick(TRIPLES);
                    return {
                        q: `A right triangle has legs ${a} cm and ${b} cm and hypotenuse ${c} cm. It is rotated one full turn about the leg of length ${a} cm. Find the surface area of the solid it sweeps out (including its base), in terms of π.`,
                        fig: F.row(spinFig('tri', a, b, `${a}`, `${b}`, `${c}`)),
                        ans: CA.pi(coneSA(b, c), 1, 'cm²'),
                        sol: R`It sweeps out a cone with radius ${b} (the leg sticking out) and slant height ${c} (the hypotenuse). Surface area ${m(R`=${coneTex(b, c)}`)} cm².`,
                    };
                },
            },
            {
                id: 'cut-cylinder', name: 'Cutting a cylinder', level: 2,
                gen(rng) {
                    const v = rng.int(0, 3);
                    if (v >= 2) {
                        const r = rng.int(2, 8), h = rng.int(3, 14), inc = 4 * r * h;
                        const how = 'cut into two equal halves by a straight cut from top to bottom through the centres of both bases';
                        const why = R`The cut makes two new flat faces, each a rectangle as wide as the diameter and as tall as the cylinder`;
                        return v === 2 ? {
                            q: `A solid cylinder with radius ${r} cm and height ${h} cm is ${how}. By how many square centimetres does the total surface area increase?`,
                            fig: F.row(axisFig(r, h, { r: `${r}`, h: `${h}` })),
                            ans: CA.num(inc, 'cm²'),
                            sol: R`${why}: ${m(R`${2 * r}\times${h}=${2 * r * h}`)} cm². Two of them: ${m(R`2\times${2 * r * h}=${inc}`)} cm². (No π — the new faces are flat rectangles.)`,
                        } : {
                            q: `A solid cylinder of height ${h} cm is ${how}. The total surface area increases by ${inc} cm². Find the volume of the original cylinder in terms of π.`,
                            fig: F.row(axisFig(r, h, { h: `${h}` })),
                            ans: CA.pi(r * r * h, 1, 'cm³'),
                            sol: R`${why}, so each has area ${m(R`${inc}\div2=${inc / 2}`)} cm². Diameter ${m(R`=${inc / 2}\div${h}=${2 * r}`)}, so ${m(`r=${r}`)}. ${m(R`V=\pi\times${r}^2\times${h}=${tp(r * r * h)}`)} cm³.`,
                        };
                    }
                    const r = rng.int(2, 7), n = rng.int(2, 6), len = n * rng.int(3, 8) + rng.pick([0, 0, 10]);
                    const thing = rng.pick(['wooden log', 'steel bar', 'stick of rock candy', 'salami', 'wax rod', 'roll of clay']);
                    const circles = 2 * (n - 1), inc = circles * r * r;
                    const cutsText = `cut straight across into ${n} shorter cylinders`;
                    if (v === 0) return {
                        q: `A ${thing} is a cylinder with radius ${r} cm and length ${len} cm. It is ${cutsText}. By how much does the total surface area increase? Give your answer in terms of π.`,
                        fig: F.row(logFig(n, { len: `${len}`, r: `${r}` })),
                        ans: CA.pi(inc, 1, 'cm²'),
                        sol: R`${n} pieces need ${n - 1} cut${n > 2 ? 's' : ''}; each cut shows 2 new circles, so there are ${circles} new circles of area ${m(R`\pi\times${r}^2=${tp(r * r)}`)}. Increase: ${m(R`${circles}\times${tp(r * r)}=${tp(inc)}`)} cm².`,
                    };
                    return {
                        q: R`A ${thing} is a cylinder ${len} cm long. When it is ${cutsText}, its total surface area increases by ${P(inc)} cm². Find the volume of the ${thing} in terms of π.`,
                        fig: F.row(logFig(n, { len: `${len}` })),
                        ans: CA.pi(r * r * len, 1, 'cm³'),
                        sol: R`${n - 1} cut${n > 2 ? 's make' : ' makes'} ${circles} new circles, so one circle is ${m(R`${tp(inc)}\div${circles}=${tp(r * r)}`)} cm²: that is the base area. Volume ${m(R`=${tp(r * r)}\times${len}=${tp(r * r * len)}`)} cm³.`,
                    };
                },
            },
            {
                id: 'cone-hollow', name: 'Hollowing a cone out of a cylinder', level: 3,
                gen(rng) {
                    const v = rng.int(0, 3);
                    if (v === 0 || v === 2) {
                        const [r, H, s] = rng.pick(TRIPLES.filter(t => t[1] >= t[0] / 2));
                        const intro = `A solid wooden cylinder has radius ${r} cm and height ${H} cm. A cone-shaped hollow with the same base and the same height as the cylinder is carved out of it, starting from the top face.`;
                        const orig = cylSA(r, H), sa = orig + r * s - r * r;
                        return v === 0 ? {
                            q: `${intro} The slant height of the hollow is ${s} cm. Find the surface area of the solid that is left, including the inside of the hollow, in terms of π.`,
                            fig: F.row(drillFig(r, H, r, H, { cone: true, lines: [`hollow: r = ${r}, s = ${s}`, `cylinder: r = ${r}, h = ${H}`] })),
                            ans: CA.pi(sa, 1, 'cm²'),
                            sol: R`Original: ${m(cylTex(r, H))}. Lost: the whole top circle, ${m(R`\pi\times${r}^2=${tp(r * r)}`)}. Added: the curved surface of the cone, ${m(R`\pi\times${r}\times${s}=${tp(r * s)}`)}. New surface area: ${m(R`${tp(orig)}+${tp(r * s)}-${tp(r * r)}=${tp(sa)}`)} cm².`,
                        } : {
                            q: `${intro} Find the volume of wood that is left, in terms of π.`,
                            fig: F.row(drillFig(r, H, r, H, { cone: true, lines: ['', `cylinder: r = ${r}, h = ${H}`] })),
                            ans: CA.pi(2 * r * r * H, 3, 'cm³'),
                            sol: R`The cone is ${m(R`\tfrac13`)} of the cylinder, so ${m(R`\tfrac23`)} is left: ${m(R`\tfrac23\times\pi\times${r}^2\times${H}=${tp(2 * r * r * H, 3)}`)} cm³.`,
                        };
                    }
                    const [a, hc, s] = rng.pick(SMALLT), Rr = a + rng.int(1, 3), H = hc + rng.int(1, 4);
                    const intro = `A solid cylinder has radius ${Rr} cm and height ${H} cm. A cone-shaped hollow is carved into the centre of its top face. The hollow has radius ${a} cm, depth ${hc} cm and slant height ${s} cm.`;
                    const fig = F.row(drillFig(Rr, H, a, hc, { cone: true, lines: [`hollow: r = ${a}, depth ${hc}, s = ${s}`, `cylinder: r = ${Rr}, h = ${H}`] }));
                    const orig = cylSA(Rr, H), sa = orig + a * s - a * a;
                    return v === 1 ? {
                        q: `${intro} Find the surface area of the solid that is left, including the inside of the hollow, in terms of π.`, fig,
                        ans: CA.pi(sa, 1, 'cm²'),
                        sol: R`Original: ${m(cylTex(Rr, H))}. Lost: a circle of radius ${a}, ${m(tp(a * a))}. Added: the curved surface of the cone, ${m(R`\pi\times${a}\times${s}=${tp(a * s)}`)}. New surface area: ${m(R`${tp(orig)}+${tp(a * s)}-${tp(a * a)}=${tp(sa)}`)} cm².`,
                    } : {
                        q: `${intro} Find the volume of the solid that is left, in terms of π.`, fig,
                        ans: CA.pi(3 * Rr * Rr * H - a * a * hc, 3, 'cm³'),
                        sol: R`Cylinder: ${m(R`\pi\times${Rr}^2\times${H}=${tp(Rr * Rr * H)}`)}. Cone (use its depth, not its slant height): ${m(R`\tfrac13\pi\times${a}^2\times${hc}=${tp(a * a * hc, 3)}`)}. Left: ${m(R`${tp(Rr * Rr * H)}-${tp(a * a * hc, 3)}=${tp(3 * Rr * Rr * H - a * a * hc, 3)}`)} cm³.`,
                    };
                },
            },
            {
                id: 'rotate-compare', name: 'Different axes, different solids', level: 3,
                gen(rng) {
                    const v = rng.int(0, 3);
                    if (v === 0 || v === 1) {
                        let a, b;
                        do { a = rng.int(2, 10); b = rng.int(2, 9); } while (a <= b);
                        const fig = F.row(spinFig('rect', a, b, `${a}`, `${b}`, null, 0, 84), spinFig('rect', b, a, `${b}`, `${a}`, null, 0, 84));
                        const start = `A rectangle is ${a} cm long and ${b} cm wide. Rotating it about its length makes one cylinder; rotating it about its width makes a different cylinder.`;
                        if (v === 0) {
                            const v1 = b * b * a, v2 = a * a * b;
                            return {
                                q: `${start} Find the difference between the volumes of the two cylinders, in terms of π.`, fig,
                                ans: CA.pi(v2 - v1, 1, 'cm³'),
                                sol: R`About the length: ${m(R`r=${b},\ h=${a}`)}, ${m(R`V=\pi\times${b}^2\times${a}=${tp(v1)}`)}. About the width: ${m(R`r=${a},\ h=${b}`)}, ${m(R`V=\pi\times${a}^2\times${b}=${tp(v2)}`)}. Difference: ${m(R`${tp(v2)}-${tp(v1)}=${tp(v2 - v1)}`)} cm³.`,
                            };
                        }
                        const s1 = cylSA(b, a), s2 = cylSA(a, b);
                        return {
                            q: `${start} Find the difference between the surface areas of the two cylinders, in terms of π.`, fig,
                            ans: CA.pi(s2 - s1, 1, 'cm²'),
                            sol: R`About the length (${m(R`r=${b},\ h=${a}`)}): ${m(cylTex(b, a))}. About the width (${m(R`r=${a},\ h=${b}`)}): ${m(cylTex(a, b))}. Difference: ${m(R`${tp(s2)}-${tp(s1)}=${tp(s2 - s1)}`)} cm².`,
                        };
                    }
                    if (v === 2) {
                        let a, b;
                        do { a = rng.int(2, 10); b = rng.int(2, 9); } while (a === b || (a * b * b) % 3 || (a * a * b) % 3);
                        const v1 = b * b * a / 3, v2 = a * a * b / 3;
                        return {
                            q: `A right triangle has legs ${a} cm and ${b} cm. Rotating it about one leg makes a cone; rotating it about the other leg makes a different cone. Find the difference between the volumes of the two cones, in terms of π.`,
                            fig: F.row(spinFig('tri', a, b, `${a}`, `${b}`, null, 0, 84), spinFig('tri', b, a, `${b}`, `${a}`, null, 0, 84)),
                            ans: CA.pi(Math.abs(v1 - v2), 1, 'cm³'),
                            sol: R`About the ${a} cm leg: ${m(R`\tfrac13\pi\times${b}^2\times${a}=${tp(v1)}`)}. About the ${b} cm leg: ${m(R`\tfrac13\pi\times${a}^2\times${b}=${tp(v2)}`)}. Difference: ${m(R`${tp(Math.max(v1, v2))}-${tp(Math.min(v1, v2))}=${tp(Math.abs(v1 - v2))}`)} cm³.`,
                        };
                    }
                    let p, k, b;
                    do { p = rng.int(2, 7); k = rng.int(2, 6); b = rng.int(2, 6); } while ((b * b * k) % 3);
                    const vol = b * b * p + b * b * k / 3;
                    return {
                        q: `A trapezoid has two right angles. Its parallel sides are ${p + k} cm and ${p} cm long, and the side joining them at right angles is ${b} cm long. It is rotated one full turn about its longer parallel side. Find the volume of the solid it sweeps out, in terms of π.`,
                        fig: F.row(spinFig('trap', p + k, b, `${p + k}`, `${b}`, `${p}`, p)),
                        ans: CA.pi(vol, 1, 'cm³'),
                        sol: R`Split the trapezoid into a ${p} by ${b} rectangle and a right triangle with legs ${m(R`${p + k}-${p}=${k}`)} and ${b}. The rectangle sweeps out a cylinder: ${m(R`\pi\times${b}^2\times${p}=${tp(b * b * p)}`)}. The triangle sweeps out a cone: ${m(R`\tfrac13\pi\times${b}^2\times${k}=${tp(b * b * k, 3)}`)}. Total: ${m(tp(vol))} cm³.`,
                    };
                },
            },
            {
                id: 'stack-tower', name: 'Towers of three solids', level: 3,
                gen(rng) {
                    const v = rng.int(0, 2), lab = t => (t.s != null ? `r = ${t.r}, s = ${t.s}` : `r = ${t.r}, h = ${t.h}`);
                    let tiers, text;
                    if (v === 0) {
                        const r1 = rng.int(5, 9), r2 = rng.int(3, r1 - 1), r3 = rng.int(1, r2 - 1);
                        tiers = [{ r: r1, h: rng.int(2, 5) }, { r: r2, h: rng.int(2, 5) }, { r: r3, h: rng.int(2, 5) }];
                        text = `A three-tier cake is made of three cylinders stacked with their centres in line. From the bottom up, the tiers have radius ${tiers[0].r} cm and height ${tiers[0].h} cm, radius ${tiers[1].r} cm and height ${tiers[1].h} cm, and radius ${tiers[2].r} cm and height ${tiers[2].h} cm.`;
                    } else if (v === 1) {
                        const [r3, hc, s] = rng.pick(SMALLT.filter(t => t[0] <= 6)), r2 = r3 + rng.int(0, 2), r1 = r2 + rng.int(1, 3);
                        tiers = [{ r: r1, h: rng.int(2, 5) }, { r: r2, h: rng.int(3, 7) }, { r: r3, s, hc }];
                        text = `A model lighthouse is made of three solids stacked with their centres in line: a cylinder with radius ${r1} cm and height ${tiers[0].h} cm at the bottom, on it a cylinder with radius ${r2} cm and height ${tiers[1].h} cm, and on top a cone with base radius ${r3} cm and slant height ${s} cm.`;
                    } else {
                        const r1 = rng.int(3, 8), r2 = rng.int(1, r1 - 1), h1 = rng.int(1, 3), h2 = rng.int(3, 8);
                        tiers = [{ r: r1, h: h1 }, { r: r2, h: h2 }, { r: r1, h: h1 }];
                        text = `A cotton reel is made of three cylinders with their centres in line: two identical end discs with radius ${r1} cm and height ${h1} cm, joined by a middle cylinder with radius ${r2} cm and height ${h2} cm.`;
                    }
                    const S = stackSA(tiers);
                    const joins = [1, 2].map(i => Math.min(tiers[i].r, tiers[i - 1].r));
                    return {
                        q: `${text} Find the surface area of the whole solid (including its underside) in terms of π.`,
                        fig: F.row(stackFig(tiers.map(t => ({ r: t.r, h: t.s != null ? t.hc : t.h, cone: t.s != null, label: lab(t) })))),
                        ans: CA.pi(S.sa, 1, 'cm²'),
                        sol: R`Separate surface areas: ${tiers.map(t => m(t.s != null ? coneTex(t.r, t.s) : cylTex(t.r, t.h))).join(', ')}; sum ${m(tp(S.total))}. Two joins, each hiding two circles: radius ${joins[0]} (${m(R`2\times${tp(joins[0] ** 2)}`)}) and radius ${joins[1]} (${m(R`2\times${tp(joins[1] ** 2)}`)}). ${m(R`${tp(S.total)}-${tp(2 * joins[0] ** 2)}-${tp(2 * joins[1] ** 2)}=${tp(S.sa)}`)} cm².`,
                    };
                },
            },
            {
                id: 'same-volume', name: 'Pouring, sinking and melting', level: 3,
                gen(rng) {
                    const v = rng.int(0, 4);
                    if (v <= 1) {
                        let Rr, r, d, h;
                        do { Rr = rng.int(3, 12); r = rng.int(2, Rr - 1); d = rng.int(1, 4); h = 3 * Rr * Rr * d / (r * r); } while (!Number.isInteger(h) || h > 3 * Rr);
                        const start = `A cylindrical tank of radius ${Rr} cm holds some water. A solid metal cone`;
                        const end = 'is placed in the tank and is completely covered by the water. No water spills.';
                        const fig = lab => F.row(tank(Rr, h + d + Rr * 0.7, { level: h + Rr * 0.3, old: h + Rr * 0.3 - d, labels: { r: `${Rr}`, rise: lab }, thing: sunkCone(r, h), maxH: 140 }));
                        return v === 0 ? {
                            q: `${start} with base radius ${r} cm and height ${h} cm ${end} By how many centimetres does the water level rise?`,
                            fig: fig('?'),
                            ans: CA.num(d, 'cm'),
                            sol: R`Cone: ${m(R`\tfrac13\pi\times${r}^2\times${h}=${tp(r * r * h, 3)}`)} cm³. Base of the tank: ${m(R`\pi\times${Rr}^2=${tp(Rr * Rr)}`)} cm². Rise ${m(R`=${r * r * h / 3}\div${Rr * Rr}=${d}`)} cm.`,
                        } : {
                            q: `${start} with base radius ${r} cm ${end} The water level rises by ${d} cm. What is the height of the cone?`,
                            fig: fig(`${d}`),
                            ans: CA.num(h, 'cm'),
                            sol: R`Volume of the cone = volume of risen water ${m(R`=\pi\times${Rr}^2\times${d}=${tp(Rr * Rr * d)}`)} cm³. So ${m(R`\tfrac13\times${r}^2\times h=${Rr * Rr * d}`)}, giving ${m(R`h=3\times${Rr * Rr * d}\div${r * r}=${h}`)} cm.`,
                        };
                    }
                    if (v === 2) {
                        let r, h, Rr;
                        do { r = rng.int(2, 9); h = rng.int(2, 18); Rr = rng.int(2, 9); } while (Rr === r || (r * r * h) % (3 * Rr * Rr) || r * r * h / (3 * Rr * Rr) > 20);
                        const d = r * r * h / (3 * Rr * Rr);
                        return {
                            q: `A cone-shaped paper cup has radius ${r} cm and height ${h} cm. It is filled to the brim with water, and the water is poured into an empty cylindrical glass of radius ${Rr} cm. How deep is the water in the glass?`,
                            ans: CA.num(d, 'cm'),
                            sol: R`Water: ${m(R`\tfrac13\pi\times${r}^2\times${h}=${tp(r * r * h, 3)}`)} cm³. In the glass: ${m(R`\pi\times${Rr}^2\times d=${tp(r * r * h, 3)}`)}, so ${m(R`d=${r * r * h / 3}\div${Rr * Rr}=${d}`)} cm.`,
                        };
                    }
                    const metal = rng.pick(['metal', 'wax', 'gold', 'chocolate', 'lead']);
                    if (v === 3) {
                        let r, h, Rr, H, N;
                        do { r = rng.int(1, 4); h = rng.int(2, 6); Rr = rng.int(r + 1, 10); H = rng.int(2, 12); N = 3 * Rr * Rr * H / (r * r * h); } while (!Number.isInteger(N) || N < 4 || N > 96);
                        return {
                            q: `A solid ${metal} cylinder with radius ${Rr} cm and height ${H} cm is melted and cast into identical cones, each with base radius ${r} cm and height ${h} cm. How many cones can be made?`,
                            ans: CA.num(N, 'cones'),
                            sol: R`Cylinder: ${m(R`\pi\times${Rr}^2\times${H}=${tp(Rr * Rr * H)}`)}. One cone: ${m(R`\tfrac13\pi\times${r}^2\times${h}=${tp(r * r * h, 3)}`)}. Number ${m(R`=${Rr * Rr * H}\div${CA.tex.frac(r * r * h, 3)}=${N}`)}.`,
                        };
                    }
                    let r, h, Rr, N, H;
                    do { r = rng.int(2, 9); h = rng.int(2, 15); Rr = rng.int(2, 9); N = rng.int(1, 9); H = N * r * r * h / (3 * Rr * Rr); } while (!Number.isInteger(H) || H > 40 || (N === 1 && r === Rr));
                    return {
                        q: N === 1
                            ? `A solid ${metal} cone with base radius ${r} cm and height ${h} cm is melted and cast into a cylinder with radius ${Rr} cm. What is the height of the cylinder?`
                            : `${N} identical solid ${metal} cones, each with base radius ${r} cm and height ${h} cm, are melted together and cast into one cylinder with radius ${Rr} cm. What is the height of the cylinder?`,
                        ans: CA.num(H, 'cm'),
                        sol: R`${N === 1 ? 'Cone' : `${N} cones`}: ${m(R`${N === 1 ? '' : R`${N}\times`}\tfrac13\pi\times${r}^2\times${h}=${tp(N * r * r * h, 3)}`)}. Cylinder: ${m(R`\pi\times${Rr}^2\times H=${tp(Rr * Rr)} H`)}. So ${m(R`H=${CA.tex.frac(N * r * r * h, 3)}\div${Rr * Rr}=${H}`)} cm.`,
                    };
                },
            },
        ],

        assignment: [
            ['cyl-volume', 4], ['cyl-surface', 4], ['cone-volume', 3], ['cone-surface', 4],
            ['cone-slant', 3], ['find-missing', 3], ['stack-cylinders', 4], ['stack-cone', 3], ['drill-hole', 4], ['rotate', 4], ['cut-cylinder', 2],
            ['cone-hollow', 3], ['rotate-compare', 3], ['stack-tower', 3], ['same-volume', 3],
        ],
    });
})();
