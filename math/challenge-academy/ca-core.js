/* Challenge Academy — shared core.
 *
 * Runs in the browser (lesson, assignment and hub pages) and in Node (the tools
 * that validate lessons and build the assignment PDFs), so nothing in here may
 * touch the DOM.  Lesson files call CA.register({...}); see lessons/README.md.
 */
(function (root) {
    'use strict';

    const CA = { lessons: {} };

    // ── Catalog ──────────────────────────────────────────────────────────
    // The hub page needs titles without loading all 18 lesson files.
    CA.catalog = [
        { id: 1, book: 'A', slug: 'three-views', icon: '🧊', title: 'Three Views of Rectangular Prisms and Cubes', blurb: 'Front, left and top views of cube solids — and the surface area and volume they reveal.' },
        { id: 2, book: 'A', slug: 'circles-sectors', icon: '🥧', title: 'Circles & Sectors with Magic Shapes', blurb: 'Arcs, sectors and irregular shaded shapes: subtract, subtract twice, and compare areas.' },
        { id: 3, book: 'A', slug: 'exponents-negative-numbers', icon: '➖', title: 'Exponents of Negative Numbers', blurb: 'Signs of long products, powers with a negative base, and multiplying and dividing those powers.' },
        { id: 4, book: 'A', slug: 'efficiency-word-problems', icon: '⚙️', title: 'Efficiency Word Problems', blurb: 'Workload, work efficiency and work time: working together, and pipes filling and draining.' },
        { id: 5, book: 'A', slug: 'ratios-rates-proportions', icon: '⚖️', title: 'Ratios, Rates, & Proportions', blurb: 'Three-quantity ratios, proportional equations, and word problems where a ratio changes.' },
        { id: 6, book: 'A', slug: 'permutations-combinations', icon: '🔀', title: 'Complicated Permutations & Combinations', blurb: 'Arranging with identical objects, things that must be together (bind) and things that must be apart (insert).' },
        { id: 7, book: 'A', slug: 'benefits-costs', icon: '💰', title: 'Understanding Benefits and Costs', blurb: 'Cost, price, profit and profit percentage, and how discounts work.' },
        { id: 8, book: 'A', slug: 'cylinders-cones', icon: '🥫', title: 'Cylinders and Cones', blurb: 'Surface area and volume of cylinders and cones, and solids made by stacking, removing and rotating.' },
        { id: 9, book: 'A', slug: 'basic-square-roots', icon: '√', title: 'Basic Square Roots and Irrational Numbers', blurb: 'Square roots, rational and irrational numbers, and estimating and comparing roots.' },
        { id: 10, book: 'B', slug: 'advanced-square-roots', icon: '🌱', title: 'Advanced Square Roots and Irrational Numbers', blurb: 'Multiplying, dividing, adding and subtracting radical expressions.' },
        { id: 11, book: 'B', slug: 'pythagorean-solid-figures', icon: '📐', title: 'Pythagorean Theorem in Solid Figures', blurb: 'Pythagoras equations with x, space diagonals, and the shortest route over a box.' },
        { id: 12, book: 'B', slug: 'mid-term-review', icon: '📝', title: 'Mid-term Review', blurb: 'A mixed check-up on lessons 1–11.' },
        { id: 13, book: 'B', slug: 'fun-word-problems', icon: '🐇', title: 'Fun Word Problems', blurb: 'Unit conversions, multi-step problems, equations, and when to round up or down.' },
        { id: 14, book: 'B', slug: 'digging-holes', icon: '🕳️', title: 'Digging Holes in Solid Figures', blurb: 'Volume layer by layer and surface area view by view after holes are dug.' },
        { id: 15, book: 'B', slug: 'coloring-solid-figures', icon: '🎨', title: 'Coloring Solid Figures', blurb: 'Removing and sticking cubes, and counting painted small cubes.' },
        { id: 16, book: 'B', slug: 'mixture-concentration', icon: '🧪', title: 'Understanding Mixture Concentration', blurb: 'Solute, solvent and solution: changing and mixing concentrations.' },
        { id: 17, book: 'B', slug: 'similarity-model', icon: '🔺', title: 'Similarity Model', blurb: 'The pyramid and hourglass models of similar triangles.' },
        { id: 18, book: 'B', slug: 'chinese-remainder-theorem', icon: '🏮', title: 'Chinese Remainder Theorem', blurb: 'Same remainder, same "complement", and step-by-step satisfaction.' },
    ];
    /** Lessons 1 … AVAILABLE are published; later ones are listed on the hub as "coming soon". */
    CA.AVAILABLE = 18;
    CA.isAvailable = id => Number(id) >= 1 && Number(id) <= CA.AVAILABLE;
    CA.info = id => CA.catalog.find(l => l.id === Number(id));
    CA.pad2 = n => String(n).padStart(2, '0');
    CA.lessonFile = id => `lessons/lesson-${CA.pad2(id)}.js`;
    CA.pdfFile = id => `assignments/lesson-${CA.pad2(id)}-${CA.info(id).slug}-assignment.pdf`;

    CA.register = function (lesson) {
        CA.lessons[lesson.id] = lesson;
        if (typeof CA.onregister === 'function') CA.onregister(lesson);
    };

    // ── Seeded random numbers (mulberry32) ───────────────────────────────
    CA.rng = function (seed) {
        let a = seed >>> 0;
        const next = () => {
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        const r = {
            next,
            int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
            pick: arr => arr[Math.floor(next() * arr.length)],
            bool: (p = 0.5) => next() < p,
            shuffle(arr) {
                const s = arr.slice();
                for (let i = s.length - 1; i > 0; i--) {
                    const j = Math.floor(next() * (i + 1));
                    [s[i], s[j]] = [s[j], s[i]];
                }
                return s;
            },
            sample: (arr, k) => r.shuffle(arr).slice(0, k),
        };
        return r;
    };

    // ── Number helpers ───────────────────────────────────────────────────
    CA.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
    CA.lcm = (a, b) => Math.abs(a * b) / CA.gcd(a, b);
    CA.fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
    CA.nPr = (n, r) => { let p = 1; for (let i = 0; i < r; i++) p *= n - i; return p; };
    CA.nCr = (n, r) => { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); let c = 1; for (let i = 1; i <= r; i++) c = c * (n - r + i) / i; return Math.round(c); };
    CA.isSquare = n => Number.isInteger(n) && n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
    CA.round = (x, dp = 2) => { const p = 10 ** dp; return Math.round((x + Number.EPSILON) * p) / p; };
    /** √n = c√r with r square-free: simplifyRoot(72) → [6, 2]. */
    CA.simplifyRoot = n => {
        let c = 1, r = n;
        for (let k = 2; k * k <= r; k++) while (r % (k * k) === 0) { r /= k * k; c *= k; }
        return [c, r];
    };
    /** Reduce n/d to lowest terms with a positive denominator. */
    CA.reduce = (n, d) => { const g = CA.gcd(n, d) || 1; const s = d < 0 ? -1 : 1; return [s * n / g, s * d / g]; };

    // ── TeX formatting (no delimiters; wrap with CA.m) ───────────────────
    const tex = CA.tex = {};
    tex.num = x => {
        if (Number.isInteger(x)) return String(x);
        return String(CA.round(x, 4));
    };
    tex.frac = (n, d = 1) => {
        [n, d] = CA.reduce(n, d);
        if (d === 1) return String(n);
        return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
    };
    tex.mixed = (n, d = 1) => {
        [n, d] = CA.reduce(n, d);
        if (d === 1 || Math.abs(n) < d) return tex.frac(n, d);
        const w = Math.trunc(Math.abs(n) / d), rem = Math.abs(n) % d;
        return `${n < 0 ? '-' : ''}${w}\\frac{${rem}}{${d}}`;
    };
    tex.pi = (n, d = 1) => {
        [n, d] = CA.reduce(n, d);
        if (n === 0) return '0';
        if (d === 1) return `${n === 1 ? '' : n === -1 ? '-' : n}\\pi`;
        return `${tex.frac(n, d)}\\pi`;
    };
    tex.root = (c, r) => {
        if (r === 1) return String(c);
        if (r === 0 || c === 0) return '0';
        return `${c === 1 ? '' : c === -1 ? '-' : c}\\sqrt{${r}}`;
    };
    /** Inline math: CA.m('x^2') → "\(x^2\)". */
    CA.m = s => `\\(${s}\\)`;

    // ── Answers ──────────────────────────────────────────────────────────
    // Every problem carries one of these.  They know how to display themselves
    // in an answer key and how to check what a student typed.
    const unitHTML = (body, unit) => {
        if (!unit) return body;
        if (unit === '$') return `$${body}`;
        if (unit === '%' || unit === '°') return `${body}${unit}`;
        return `${body} ${unit}`;
    };

    /** A plain number.  CA.num(24, 'cm²'), CA.num(12.5, '$'), CA.num(0.25, '', {tol: 0.001}). */
    CA.num = (value, unit = '', opts = {}) => {
        if (typeof value !== 'number' || !isFinite(value)) throw new Error(`CA.num: bad value ${value}`);
        const shown = opts.show || CA.m(unit === '$' && !Number.isInteger(value) ? value.toFixed(2) : tex.num(value));
        return {
            kind: 'num', value, unit,
            tol: opts.tol != null ? opts.tol : (Number.isInteger(value) ? 1e-6 : 0.006),
            html: unitHTML(shown, unit),
            canon: String(value),
        };
    };
    /** A fraction n/d (shown reduced; any equal value is accepted). opts.mixed shows a mixed number. */
    CA.frac = (n, d, unit = '', opts = {}) => {
        if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) throw new Error(`CA.frac: bad fraction ${n}/${d}`);
        [n, d] = CA.reduce(n, d);
        return {
            kind: 'num', value: n / d, unit, tol: opts.tol != null ? opts.tol : (d === 1 ? 1e-6 : 0.006),
            html: unitHTML(CA.m(opts.mixed ? tex.mixed(n, d) : tex.frac(n, d)), unit),
            canon: d === 1 ? String(n) : `${n}/${d}`,
        };
    };
    /** A multiple of π: CA.pi(12, 1, 'cm²') is 12π cm²; CA.pi(9, 2) is (9/2)π. The student types the coefficient. */
    CA.pi = (n, d = 1, unit = '') => {
        if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) throw new Error(`CA.pi: bad coefficient ${n}/${d}`);
        [n, d] = CA.reduce(n, d);
        return { kind: 'pi', value: n / d, unit, tol: d === 1 ? 1e-6 : 0.006, html: unitHTML(CA.m(tex.pi(n, d)), unit), canon: d === 1 ? String(n) : `${n}/${d}` };
    };
    /** A radical c√r in simplest form: CA.root(3, 2) is 3√2.  CA.rootOf(72) simplifies √72 for you. */
    CA.root = (c, r, unit = '') => {
        if (!Number.isInteger(c) || !Number.isInteger(r) || r < 1) throw new Error(`CA.root: bad radical ${c}√${r}`);
        const [k, rr] = CA.simplifyRoot(r);
        c *= k; r = rr;
        return { kind: 'root', c, r, unit, html: unitHTML(CA.m(tex.root(c, r)), unit), canon: [String(c), String(r)] };
    };
    CA.rootOf = (n, unit = '') => CA.root(1, n, unit);
    /** A ratio in simplest form: CA.ratio([6, 4]) is 3 : 2. */
    CA.ratio = parts => {
        if (!parts.every(p => Number.isInteger(p) && p > 0)) throw new Error(`CA.ratio: bad parts ${parts}`);
        const g = parts.reduce((a, b) => CA.gcd(a, b));
        const p = parts.map(x => x / g);
        return { kind: 'ratio', parts: p, html: CA.m(p.join(' : ')), canon: p.join(':') };
    };
    /** Free text, compared without case, spaces or punctuation. `accept` lists every spelling that counts. */
    CA.text = (display, accept) => ({ kind: 'text', accept: (accept || [display]).map(normText), html: display, canon: (accept || [display])[0] });
    /**
     * Multiple choice.  `correct` and `distractors` are HTML strings (figures are fine).
     * Choices are shuffled with the problem's rng unless opts.keepOrder is set, in
     * which case pass the full list as `distractors` and the correct one as `correct`.
     */
    CA.mc = (rng, correct, distractors, opts = {}) => {
        let choices;
        if (opts.keepOrder) {
            choices = distractors.slice();
            if (!choices.includes(correct)) throw new Error('CA.mc keepOrder: the correct choice must be in the list');
        } else {
            const seen = new Set([correct]);
            const wrong = [];
            for (const d of distractors) if (!seen.has(d)) { seen.add(d); wrong.push(d); }
            if (wrong.length < 2) throw new Error('CA.mc: need at least 2 distinct distractors');
            choices = rng.shuffle([correct, ...wrong.slice(0, opts.max ? opts.max - 1 : 3)]);
        }
        const index = choices.indexOf(correct);
        return { kind: 'mc', choices, index, html: `(${'ABCDEF'[index]})${/<svg/.test(correct) ? '' : ' ' + correct}`, canon: index };
    };

    function normText(s) { return String(s).toLowerCase().replace(/[\s.,;:!?'"()]/g, ''); }

    /** Parse what a student typed: 12, -3.5, 3/4, 1 1/2, $12.50, 45%, 1,200, 30 cm. NaN if not a number. */
    CA.parseNumber = function (raw) {
        let s = String(raw == null ? '' : raw).trim().replace(/[−–]/g, '-').replace(/[$,%°]/g, '').replace(/\s*[a-zA-Zµ²³]+\.?\s*$/, '').trim();
        if (!s) return NaN;
        let m;
        if ((m = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/))) {
            const v = Number(m[2]) + Number(m[3]) / Number(m[4]);
            return m[1] ? -v : v;
        }
        if ((m = s.match(/^(-?\d*\.?\d+)\s*\/\s*(-?\d*\.?\d+)$/))) return Number(m[1]) / Number(m[2]);
        if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return Number(s);
        return NaN;
    };

    /** Is `input` right?  input is a string, [coef, radicand] for 'root', or a choice index for 'mc'. */
    CA.check = function (ans, input) {
        switch (ans.kind) {
            case 'num':
            case 'pi': {
                const v = CA.parseNumber(String(input).replace(/π|pi/gi, ''));
                return !isNaN(v) && Math.abs(v - ans.value) <= ans.tol;
            }
            case 'root': {
                const [ci, ri] = input;
                const c = String(ci).trim() === '' ? 1 : CA.parseNumber(ci);
                const r = String(ri).trim() === '' ? 1 : CA.parseNumber(ri);
                return c === ans.c && r === ans.r;
            }
            case 'ratio': {
                const parts = String(input).split(/:|\bto\b/i).map(s => CA.parseNumber(s));
                return parts.length === ans.parts.length && parts.every((p, i) => p === ans.parts[i]);
            }
            case 'text': return ans.accept.includes(normText(input));
            case 'mc': return Number(input) === ans.index;
        }
        return false;
    };

    // ── Assignments ──────────────────────────────────────────────────────
    CA.ASSIGNMENT_SIZE = 50;
    CA.levelNames = { 1: 'Part A — Warm-up', 2: 'Part B — Core practice', 3: 'Part C — Challenge' };

    /** How many problems each generator contributes: lesson.assignment, or an even split. */
    CA.assignmentPlan = function (lesson) {
        const gens = lesson.practice;
        let plan;
        if (lesson.assignment) {
            plan = lesson.assignment.map(([id, count]) => {
                const g = gens.find(x => x.id === id);
                if (!g) throw new Error(`Lesson ${lesson.id}: assignment names unknown generator "${id}"`);
                return { g, count };
            });
        } else {
            const base = Math.floor(CA.ASSIGNMENT_SIZE / gens.length);
            let extra = CA.ASSIGNMENT_SIZE - base * gens.length;
            plan = gens.map(g => ({ g, count: base + (extra-- > 0 ? 1 : 0) }));
        }
        const total = plan.reduce((s, p) => s + p.count, 0);
        if (total !== CA.ASSIGNMENT_SIZE) throw new Error(`Lesson ${lesson.id}: assignment has ${total} problems, needs ${CA.ASSIGNMENT_SIZE}`);
        return plan.slice().sort((a, b) => (a.g.level || 2) - (b.g.level || 2));
    };

    /**
     * The 50 assignment problems.  Deterministic: the same lesson file always
     * gives the same sheet, so the printed PDF and its answer key cannot drift.
     */
    CA.buildAssignment = function (lesson) {
        const seed = typeof lesson.id === 'number' ? lesson.id * 977
            : [...String(lesson.id)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 1000003;
        const rng = CA.rng(20260000 + seed);
        const seen = new Set();
        const out = [];
        for (const { g, count } of CA.assignmentPlan(lesson)) {
            for (let i = 0; i < count; i++) {
                let p = null;
                for (let tries = 0; tries < 400; tries++) {
                    const cand = g.gen(rng);
                    // Same text and figure is a repeat; so is the same text with the same
                    // answer (only the picture moved), which would feel like a repeat.
                    const key = cand.q + '|' + (cand.fig || ''), key2 = cand.q + '|=' + JSON.stringify(cand.ans.canon);
                    if (!seen.has(key) && !seen.has(key2)) { seen.add(key); seen.add(key2); p = cand; break; }
                }
                if (!p) throw new Error(`Lesson ${lesson.id}: generator "${g.id}" cannot make ${count} different problems`);
                out.push({ n: out.length + 1, level: g.level || 2, skill: g.id, ...p });
            }
        }
        return out;
    };

    // ── Figures (SVG strings) ────────────────────────────────────────────
    const F = CA.fig = {};
    const INK = '#2d3748', FILL = '#e3e9ff', SHADE = '#9fb4f5', DARK = '#7c93e8', ACCENT = '#e8590c';
    F.colors = { INK, FILL, SHADE, DARK, ACCENT };
    const n2 = x => Math.round(x * 100) / 100;
    const attrs = (o, d = {}) => {
        const a = { ...d, ...o };
        let s = '';
        if (a.fill) s += ` fill="${a.fill}"`;
        if (a.stroke) s += ` stroke="${a.stroke}"`;
        if (a.width) s += ` stroke-width="${a.width}"`;
        if (a.dash) s += ` stroke-dasharray="${a.dash === true ? '5 4' : a.dash}"`;
        if (a.opacity != null) s += ` opacity="${a.opacity}"`;
        return s;
    };

    /** Wrap SVG markup. Everything inside inherits a dark 1.5px outline and no fill. */
    F.svg = (w, h, body, opt = {}) =>
        `<svg class="ca-fig" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n2(w)} ${n2(h)}" width="${n2(w)}" height="${n2(h)}" role="img" aria-label="${opt.label || 'figure'}" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
    /** Text. opt: anchor ('start'|'middle'|'end'), fill, size, bold, italic. Use Unicode (π √ ² ³ °), not TeX. */
    F.text = (x, y, s, opt = {}) =>
        `<text x="${n2(x)}" y="${n2(y)}" text-anchor="${opt.anchor || 'middle'}" fill="${opt.fill || INK}" stroke="none"${opt.size ? ` font-size="${opt.size}"` : ''}${opt.bold ? ' font-weight="bold"' : ''}${opt.italic ? ' font-style="italic"' : ''}>${s}</text>`;
    F.line = (x1, y1, x2, y2, opt = {}) => `<line x1="${n2(x1)}" y1="${n2(y1)}" x2="${n2(x2)}" y2="${n2(y2)}"${attrs(opt)}/>`;
    /** Polygon through [[x,y],…]. opt.open draws a polyline instead. */
    F.poly = (pts, opt = {}) => `<${opt.open ? 'polyline' : 'polygon'} points="${pts.map(p => `${n2(p[0])},${n2(p[1])}`).join(' ')}"${attrs(opt)}/>`;
    F.rect = (x, y, w, h, opt = {}) => `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}"${attrs(opt)}/>`;
    F.circle = (cx, cy, r, opt = {}) => `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}"${attrs(opt)}/>`;
    F.ellipse = (cx, cy, rx, ry, opt = {}) => `<ellipse cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(rx)}" ry="${n2(ry)}"${attrs(opt)}/>`;
    F.path = (d, opt = {}) => `<path d="${d}"${attrs(opt)}/>`;
    F.dot = (x, y, opt = {}) => `<circle cx="${n2(x)}" cy="${n2(y)}" r="${opt.r || 2.5}" fill="${opt.fill || INK}" stroke="none"/>`;
    /** Point on a circle. Angles are in degrees, anticlockwise from "east", like in maths class. */
    F.polar = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];
    /** Path data for the arc from angle a0 anticlockwise to a1 (degrees, a1 > a0, at most 360). */
    F.arcD = (cx, cy, r, a0, a1, move = true) => {
        const [x0, y0] = F.polar(cx, cy, r, a0), [x1, y1] = F.polar(cx, cy, r, a1);
        if (a1 - a0 >= 360) { // a full turn needs two half arcs
            const [xm, ym] = F.polar(cx, cy, r, a0 + 180);
            return `${move ? `M${n2(x0)} ${n2(y0)}` : ''}A${n2(r)} ${n2(r)} 0 1 0 ${n2(xm)} ${n2(ym)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(x0)} ${n2(y0)}`;
        }
        return `${move ? `M${n2(x0)} ${n2(y0)}` : ''}A${n2(r)} ${n2(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${n2(x1)} ${n2(y1)}`;
    };
    F.arc = (cx, cy, r, a0, a1, opt = {}) => F.path(F.arcD(cx, cy, r, a0, a1), opt);
    /** A pie slice from angle a0 anticlockwise to a1. */
    F.sector = (cx, cy, r, a0, a1, opt = {}) => F.path(`M${n2(cx)} ${n2(cy)}L${F.arcD(cx, cy, r, a0, a1).slice(1)}Z`, { fill: FILL, ...opt });
    /** Little square marking a right angle at (x,y); (ux,uy) and (vx,vy) point along the two arms. */
    F.rightAngle = (x, y, ux, uy, vx, vy, s = 9) => {
        const lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy);
        ux = ux / lu * s; uy = uy / lu * s; vx = vx / lv * s; vy = vy / lv * s;
        return F.poly([[x + ux, y + uy], [x + ux + vx, y + uy + vy], [x + vx, y + vy]], { open: true, width: 1 });
    };
    /** Put figures side by side. */
    F.row = (...figs) => `<div class="ca-figrow">${figs.flat().join('')}</div>`;
    /** A figure with a caption underneath. */
    F.cap = (fig, caption) => `<figure class="ca-figcap">${fig}<figcaption>${caption}</figcaption></figure>`;

    // Cube stacks.  heights[r][c] = number of cubes stacked on that square of the
    // floor plan; row 0 is the BACK row, the last row is the FRONT row, column 0
    // is on the LEFT.  The drawing looks from the front, slightly right and above.
    F.cubes = function (heights, opt = {}) {
        const s = opt.size || 26, dx = s * 0.5, dy = s * 0.36;
        const R = heights.length, C = heights[0].length;
        const H = Math.max(1, ...heights.flat());
        const pad = 4;
        const W = C * s + R * dx + pad * 2, Ht = H * s + R * dy + pad * 2;
        const ox = pad, oy = Ht - pad;
        const left = opt.side === 'left';        // show the left-hand faces instead of the right-hand ones
        let body = '';
        for (let r = 0; r < R; r++) {            // back row first
            const d = R - 1 - r;                 // how far back this row is
            for (let i = 0; i < C; i++) {
                const c = left ? C - 1 - i : i;  // far column first
                for (let k = 0; k < heights[r][c]; k++) {
                    const col = opt.color ? opt.color(r, c, k) : null;
                    if (left) {
                        const x = ox + R * dx + c * s - d * dx, y = oy - k * s - d * dy;
                        body += F.poly([[x, y], [x - dx, y - dy], [x - dx, y - s - dy], [x, y - s]], { fill: (col && col.side) || SHADE });
                        body += F.poly([[x, y - s], [x + s, y - s], [x + s - dx, y - s - dy], [x - dx, y - s - dy]], { fill: (col && col.top) || '#f5f7ff' });
                        body += F.poly([[x, y], [x + s, y], [x + s, y - s], [x, y - s]], { fill: (col && col.front) || FILL });
                        continue;
                    }
                    const x = ox + c * s + d * dx, y = oy - k * s - d * dy;
                    body += F.poly([[x, y], [x + s, y], [x + s, y - s], [x, y - s]], { fill: (col && col.front) || FILL });
                    body += F.poly([[x, y - s], [x + s, y - s], [x + s + dx, y - s - dy], [x + dx, y - s - dy]], { fill: (col && col.top) || '#f5f7ff' });
                    body += F.poly([[x + s, y], [x + s + dx, y - dy], [x + s + dx, y - s - dy], [x + s, y - s]], { fill: (col && col.side) || SHADE });
                }
            }
        }
        return F.svg(W, Ht, body, { label: 'stack of cubes' });
    };
    /**
     * A flat grid of squares.  cells[row][col], row 0 at the top; a truthy cell is
     * drawn.  opt.numbers writes the cell's value in it (for floor plans),
     * opt.label puts a caption under the grid, opt.ghost draws empty cells faintly.
     */
    F.grid = function (cells, opt = {}) {
        const s = opt.cell || 22, pad = 3;
        const R = cells.length, C = Math.max(...cells.map(r => r.length));
        const labelH = opt.label ? 18 : 0;
        const W = Math.max(C * s + pad * 2, opt.label ? opt.label.length * 7 : 0), Ht = R * s + pad * 2 + labelH;
        const x0 = (W - C * s) / 2;
        let body = '';
        for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
            const v = cells[r][c];
            if (!v) { if (opt.ghost) body += F.rect(x0 + c * s, pad + r * s, s, s, { stroke: '#cbd5e0', width: 1, dash: '3 3' }); continue; }
            body += F.rect(x0 + c * s, pad + r * s, s, s, { fill: opt.fill || FILL });
            if (opt.numbers) body += F.text(x0 + c * s + s / 2, pad + r * s + s / 2 + 4.5, v, { bold: true });
        }
        if (opt.label) body += F.text(W / 2, Ht - 3, opt.label, { size: 12 });
        return F.svg(W, Ht, body, { label: opt.label || 'grid' });
    };
    /** The view of a cube stack as grid cells: which = 'front' | 'top' | 'right' | 'left'. */
    F.viewCells = function (heights, which) {
        const R = heights.length, C = heights[0].length, H = Math.max(1, ...heights.flat());
        if (which === 'top') return heights.map(row => row.map(h => (h > 0 ? 1 : 0)));
        let cols; // height of each column of the view, left to right
        if (which === 'front') cols = Array.from({ length: C }, (_, c) => Math.max(...heights.map(row => row[c])));
        else {
            const rowMax = heights.map(row => Math.max(...row));     // back … front
            cols = which === 'right' ? rowMax.slice().reverse() : rowMax; // from the right, the front row is on the left
        }
        return Array.from({ length: H }, (_, i) => cols.map(h => (h >= H - i ? 1 : 0)));
    };
    /** Number of squares in a view. */
    F.viewCount = (heights, which) => F.viewCells(heights, which).flat().reduce((a, b) => a + b, 0);
    /** Front, left and top views side by side, each labelled. opt.side: 'right' shows the right-side view instead. */
    F.threeViews = (heights, opt = {}) => F.row(
        F.grid(F.viewCells(heights, 'front'), { label: 'Front view', ...opt }),
        opt.side === 'right' ? F.grid(F.viewCells(heights, 'right'), { label: 'Right view', ...opt })
            : F.grid(F.viewCells(heights, 'left'), { label: 'Left view', ...opt }),
        F.grid(F.viewCells(heights, 'top'), { label: 'Top view', ...opt }));
    /** The floor plan: the top view with the height of each stack written in. */
    F.plan = (heights, opt = {}) => F.grid(heights, { numbers: true, label: 'Top view (heights)', ...opt });

    /**
     * A rectangular box, length × width(depth) × height.  opt.labels = [length, width, height]
     * strings (any may be '' to hide); opt.max is the largest drawn size in px.
     */
    F.box = function (l, w, h, opt = {}) {
        const labels = opt.labels || [l, w, h];
        const k = 0.5, ky = 0.36;
        const max = opt.max || 150;
        const s = Math.min(max / (l + w * k), max / (h + w * ky));
        const L = l * s, D = w * s * k, Dy = w * s * ky, Ht = h * s;
        const padL = labels[2] !== '' ? 34 : 8, padB = labels[0] !== '' ? 22 : 8, padR = labels[1] !== '' ? 34 : 8, padT = 8;
        const W = padL + L + D + padR, HH = padT + Dy + Ht + padB;
        const x = padL, y = padT + Dy + Ht; // front bottom-left corner
        let b = '';
        b += F.poly([[x, y - Ht], [x + L, y - Ht], [x + L + D, y - Ht - Dy], [x + D, y - Ht - Dy]], { fill: '#f5f7ff' });
        b += F.poly([[x + L, y], [x + L + D, y - Dy], [x + L + D, y - Ht - Dy], [x + L, y - Ht]], { fill: opt.shade || SHADE });
        b += F.rect(x, y - Ht, L, Ht, { fill: opt.fill || FILL });
        b += F.line(x, y, x + D, y - Dy, { dash: true, width: 1 }) + F.line(x + D, y - Dy, x + L + D, y - Dy, { dash: true, width: 1 }) + F.line(x + D, y - Dy, x + D, y - Ht - Dy, { dash: true, width: 1 });
        if (labels[0] !== '') b += F.text(x + L / 2, y + 16, labels[0]);
        if (labels[1] !== '') b += F.text(x + L + D / 2 + 6, y - Dy / 2 + 12, labels[1], { anchor: 'start' });
        if (labels[2] !== '') b += F.text(x - 6, y - Ht / 2 + 4, labels[2], { anchor: 'end' });
        return F.svg(W, HH, b + (opt.extra ? opt.extra({ x, y, L, D, Dy, Ht, s }) : ''), { label: 'rectangular prism' });
    };
    /** A cylinder. opt.labels = { r, h, d } strings; opt.max px. */
    F.cylinder = function (r, h, opt = {}) {
        const lab = opt.labels || {};
        const max = opt.max || 130;
        const s = Math.min(max / (2 * r), max / (h + 0.6 * r));
        const rx = r * s, ry = rx * 0.3, Ht = h * s;
        const padX = 40, W = 2 * rx + padX * 2, HH = Ht + 2 * ry + 16;
        const cx = W / 2, top = 8 + ry, bot = top + Ht;
        let b = '';
        b += F.path(`M${n2(cx - rx)} ${n2(top)}L${n2(cx - rx)} ${n2(bot)}A${n2(rx)} ${n2(ry)} 0 0 0 ${n2(cx + rx)} ${n2(bot)}L${n2(cx + rx)} ${n2(top)}Z`, { fill: opt.fill || FILL });
        b += F.path(`M${n2(cx - rx)} ${n2(bot)}A${n2(rx)} ${n2(ry)} 0 0 1 ${n2(cx + rx)} ${n2(bot)}`, { dash: true, width: 1 });
        b += F.ellipse(cx, top, rx, ry, { fill: '#f5f7ff' });
        if (lab.r != null) b += F.line(cx, top, cx + rx, top, { width: 1 }) + F.dot(cx, top, { r: 2 }) + F.text(cx + rx / 2, top - 4, lab.r, { size: 12 });
        if (lab.d != null) b += F.line(cx - rx, top, cx + rx, top, { width: 1 }) + F.text(cx, top - 4, lab.d, { size: 12 });
        if (lab.h != null) b += F.text(cx + rx + 6, (top + bot) / 2 + 4, lab.h, { anchor: 'start' });
        return F.svg(W, HH, b, { label: 'cylinder' });
    };
    /** A cone. opt.labels = { r, h, l } strings (l = slant height); opt.max px. */
    F.cone = function (r, h, opt = {}) {
        const lab = opt.labels || {};
        const max = opt.max || 130;
        const s = Math.min(max / (2 * r), max / (h + 0.3 * r));
        const rx = r * s, ry = rx * 0.3, Ht = h * s;
        const padX = 40, W = 2 * rx + padX * 2, HH = Ht + ry + 16;
        const cx = W / 2, top = 8, bot = top + Ht;
        let b = '';
        b += F.path(`M${n2(cx)} ${n2(top)}L${n2(cx - rx)} ${n2(bot)}A${n2(rx)} ${n2(ry)} 0 0 0 ${n2(cx + rx)} ${n2(bot)}Z`, { fill: opt.fill || FILL });
        b += F.path(`M${n2(cx - rx)} ${n2(bot)}A${n2(rx)} ${n2(ry)} 0 0 1 ${n2(cx + rx)} ${n2(bot)}`, { dash: true, width: 1 });
        if (lab.h != null) b += F.line(cx, top, cx, bot, { dash: true, width: 1 }) + F.rightAngle(cx, bot, 0, -1, 1, 0, 7) + F.text(cx - 5, (top + bot) / 2 + 8, lab.h, { anchor: 'end', size: 12 });
        if (lab.r != null) b += F.line(cx, bot, cx + rx, bot, { dash: true, width: 1 }) + F.text(cx + rx / 2, bot + 13, lab.r, { size: 12 });
        if (lab.l != null) b += F.text(cx + rx / 2 + 8, (top + bot) / 2, lab.l, { anchor: 'start', size: 12 });
        return F.svg(W, HH, b, { label: 'cone' });
    };
    /** A right triangle with legs a (vertical) and b (horizontal); labels = { a, b, c } strings. */
    F.rightTriangle = function (a, b, labels = {}, opt = {}) {
        const max = opt.max || 130;
        const s = Math.min(max / a, max / b);
        const A = a * s, B = b * s, padL = 36, padB = 22;
        const W = padL + B + 40, HH = A + padB + 10;
        const x = padL, y = 10 + A;
        let body = F.poly([[x, y], [x + B, y], [x, y - A]], { fill: FILL }) + F.rightAngle(x, y, 1, 0, 0, -1);
        if (labels.b != null) body += F.text(x + B / 2, y + 16, labels.b);
        if (labels.a != null) body += F.text(x - 6, y - A / 2 + 4, labels.a, { anchor: 'end' });
        if (labels.c != null) body += F.text(x + B / 2 + 8, y - A / 2 - 4, labels.c, { anchor: 'start' });
        return F.svg(W, HH, body, { label: 'right triangle' });
    };

    // ── Browser only: typeset the maths inside an element ────────────────
    CA.typeset = function (el) {
        if (typeof window === 'undefined' || !window.renderMathInElement) return;
        window.renderMathInElement(el, {
            delimiters: [{ left: '\\(', right: '\\)', display: false }, { left: '\\[', right: '\\]', display: true }],
            throwOnError: false,
        });
        // Keep "π." together: without this a line can break between a formula and
        // the full stop after it, leaving the full stop alone on the next line.
        el.querySelectorAll('span.katex').forEach(k => {
            if (k.parentNode.classList && k.parentNode.classList.contains('katex-display')) return;
            // auto-render may wrap each formula in a bare <span>: work on the outermost one.
            while (!k.nextSibling && k.parentNode !== el && k.parentNode.tagName === 'SPAN' && k.parentNode.childNodes.length === 1) k = k.parentNode;
            const next = k.nextSibling;
            if (!next || next.nodeType !== 3) return;
            const mm = next.nodeValue.match(/^[.,;:!?)]+/);
            if (!mm) return;
            const wrap = document.createElement('span');
            wrap.style.whiteSpace = 'nowrap';
            k.parentNode.insertBefore(wrap, k);
            wrap.appendChild(k);
            wrap.appendChild(document.createTextNode(mm[0]));
            next.nodeValue = next.nodeValue.slice(mm[0].length);
        });
    };

    root.CA = CA;
    if (typeof module !== 'undefined' && module.exports) module.exports = CA;
})(typeof window !== 'undefined' ? window : globalThis);
