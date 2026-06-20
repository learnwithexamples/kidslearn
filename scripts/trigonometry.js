// Trigonometry Practice
// Right-triangle problems: find a missing side (SOH-CAH-TOA) or a missing angle.

let problemType = 'side';   // 'side' | 'angle'
let current = null;
let score = 0;
let total = 0;

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function round1(v) {
    return Math.round(v * 10) / 10;
}

function round2(v) {
    return Math.round(v * 100) / 100;
}

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
}

function simplify(n, d) {
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
}

// Parse a decimal or a simple fraction like "3/5" or "-1/4".
function parseNum(raw) {
    if (raw == null) return null;
    const s = String(raw).trim().replace(/−/g, '-');
    if (s === '') return null;
    if (s.includes('/')) {
        const p = s.split('/');
        if (p.length !== 2) return null;
        const n = parseFloat(p[0]);
        const d = parseFloat(p[1]);
        if (isNaN(n) || isNaN(d) || d === 0) return null;
        return n / d;
    }
    const v = parseFloat(s);
    return isNaN(v) ? null : v;
}

const ANGLES = [25, 30, 35, 40, 45, 50, 55, 60, 65];

// "Nice" angles used to build "Find an Angle" problems so answers stay clean.
const TABLE_ANGLES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

// Primitive Pythagorean triples (opp = a, adj = b, hyp = c) for an acute angle.
const TRIPLES = [
    { a: 3, b: 4, c: 5 },
    { a: 4, b: 3, c: 5 },
    { a: 5, b: 12, c: 13 },
    { a: 12, b: 5, c: 13 },
    { a: 8, b: 15, c: 17 },
    { a: 15, b: 8, c: 17 },
    { a: 7, b: 24, c: 25 },
    { a: 20, b: 21, c: 29 },
];

// ─────────────────────────────────────────────────────────────
// Problem generation
// Triangle layout: right angle at B (bottom-right).
//   A = bottom-left  (angle θ lives here)
//   B = bottom-right (right angle)
//   C = top-right
//   AB = adjacent to θ,  BC = opposite to θ,  AC = hypotenuse
// ─────────────────────────────────────────────────────────────

function generate() {
    const generators = {
        side: generateSide,
        angle: generateAngle,
        ratio: generateRatio,
        special: generateSpecial,
        double: generateDouble,
        sum: generateSum,
    };
    (generators[problemType] || generateSide)();

    const showTriangle = current.kind === 'side' || current.kind === 'angle';
    document.getElementById('practice-triangle').style.display =
        showTriangle ? 'flex' : 'none';
    if (showTriangle) drawTriangle();

    renderQuestion();
    clearAnswer();
}

function generateSide() {
    const theta = choice(ANGLES);
    const rad = theta * Math.PI / 180;

    // Pick which side is given and which is the unknown.
    // ratio key tells us which trig ratio links them; op is how the kid
    // uses the (rounded) trig value: multiply or divide.
    const setups = [
        // given hypotenuse, find opposite  -> opp = hyp · sin
        { given: 'hyp', find: 'opp', ratio: 'sin', op: 'mul' },
        // given hypotenuse, find adjacent  -> adj = hyp · cos
        { given: 'hyp', find: 'adj', ratio: 'cos', op: 'mul' },
        // given adjacent,  find opposite   -> opp = adj · tan
        { given: 'adj', find: 'opp', ratio: 'tan', op: 'mul' },
        // given opposite,  find adjacent   -> adj = opp ÷ tan
        { given: 'opp', find: 'adj', ratio: 'tan', op: 'div' },
        // given adjacent,  find hypotenuse -> hyp = adj ÷ cos
        { given: 'adj', find: 'hyp', ratio: 'cos', op: 'div' },
        // given opposite,  find hypotenuse -> hyp = opp ÷ sin
        { given: 'opp', find: 'hyp', ratio: 'sin', op: 'div' },
    ];
    const setup = choice(setups);

    const givenLen = randInt(5, 20);

    // The trig value we hand the kid, rounded for friendliness. Compute the
    // expected answer from THIS value so their arithmetic matches ours.
    const ratioVal = round2(Math[setup.ratio](rad));
    const answer = round1(
        setup.op === 'mul' ? givenLen * ratioVal : givenLen / ratioVal
    );

    // True side lengths (for the diagram, drawn from the real angle).
    let hyp, opp, adj;
    if (setup.given === 'hyp') {
        hyp = givenLen;
        opp = hyp * Math.sin(rad);
        adj = hyp * Math.cos(rad);
    } else if (setup.given === 'adj') {
        adj = givenLen;
        opp = adj * Math.tan(rad);
        hyp = adj / Math.cos(rad);
    } else { // opp
        opp = givenLen;
        adj = opp / Math.tan(rad);
        hyp = opp / Math.sin(rad);
    }

    current = {
        kind: 'side',
        theta,
        sides: { hyp: round1(hyp), opp: round1(opp), adj: round1(adj) },
        given: setup.given,
        givenLen,
        find: setup.find,
        ratio: setup.ratio,
        ratioVal,
        op: setup.op,
        answer,
        tol: 0.15,
    };
}

function generateAngle() {
    // Pick a "nice" angle that appears in the lookup table, then build two
    // sides consistent with it. The kid computes the ratio and reads the
    // angle off the table (no calculator / inverse-trig button needed).
    const theta = choice(TABLE_ANGLES);
    const rad = theta * Math.PI / 180;

    // Choose which pair of sides we reveal -> determines which ratio to use.
    const setups = [
        { shown: ['opp', 'hyp'], ratio: 'sin' },
        { shown: ['adj', 'hyp'], ratio: 'cos' },
        { shown: ['opp', 'adj'], ratio: 'tan' },
    ];
    const setup = choice(setups);

    // Keep the denominator (integer side) exact so the kid's ratio rounds
    // cleanly to the table value.
    let hyp, opp, adj;
    if (setup.ratio === 'sin') {
        hyp = randInt(8, 20);
        opp = round1(hyp * Math.sin(rad));
        adj = round1(hyp * Math.cos(rad));
    } else if (setup.ratio === 'cos') {
        hyp = randInt(8, 20);
        adj = round1(hyp * Math.cos(rad));
        opp = round1(hyp * Math.sin(rad));
    } else { // tan
        adj = randInt(5, 15);
        opp = round1(adj * Math.tan(rad));
        hyp = round1(adj / Math.cos(rad));
    }

    current = {
        kind: 'angle',
        theta,
        answer: theta,
        sides: { hyp, opp, adj },
        shown: setup.shown,
        ratio: setup.ratio,
        tol: 1.0,
    };
}

// ── Basics: given one ratio, find another (uses identities) ──
function generateRatio() {
    const t = choice(TRIPLES);
    // Acute angle: sin = a/c, cos = b/c, tan = a/b (all positive).
    const ratios = {
        sin: simplify(t.a, t.c),
        cos: simplify(t.b, t.c),
        tan: simplify(t.a, t.b),
    };
    const names = ['sin', 'cos', 'tan'];
    const givenName = choice(names);
    const targetName = choice(names.filter(n => n !== givenName));

    current = {
        kind: 'ratio',
        givenName,
        targetName,
        givenFrac: ratios[givenName],
        targetFrac: ratios[targetName],
        answer: round2(ratios[targetName].n / ratios[targetName].d),
        tol: 0.02,
    };
}

// ── Basics: exact value at a special angle ──
function generateSpecial() {
    const angle = choice([0, 30, 45, 60, 90]);
    let funcs = ['sin', 'cos', 'tan'];
    if (angle === 90) funcs = ['sin', 'cos']; // tan 90° is undefined
    const fn = choice(funcs);
    const val = Math[fn](angle * Math.PI / 180);

    current = {
        kind: 'special',
        angle,
        fn,
        answer: round2(val),
        tol: 0.02,
    };
}

// ── Advanced: double-angle from sin θ and cos θ ──
function generateDouble() {
    const t = choice(TRIPLES);
    const s = t.a / t.c;
    const c = t.b / t.c;
    const target = choice(['sin2', 'cos2']);
    const val = target === 'sin2' ? 2 * s * c : c * c - s * s;

    current = {
        kind: 'double',
        sinFrac: simplify(t.a, t.c),
        cosFrac: simplify(t.b, t.c),
        target,
        s,
        c,
        answer: round2(val),
        tol: 0.02,
    };
}

// ── Advanced: angle sum / difference with special angles ──
function generateSum() {
    const specials = [30, 45, 60];
    let A = choice(specials);
    let B = choice(specials);
    const op = choice(['+', '-']);
    if (op === '-' && A < B) { [A, B] = [B, A]; } // keep the angle non-negative
    const fn = choice(['sin', 'cos']);

    // Hand the kid the sin/cos of A and B (rounded), and compute the answer
    // from those same rounded values so their arithmetic matches ours.
    const sinA = round2(Math.sin(A * Math.PI / 180));
    const cosA = round2(Math.cos(A * Math.PI / 180));
    const sinB = round2(Math.sin(B * Math.PI / 180));
    const cosB = round2(Math.cos(B * Math.PI / 180));
    const sign = op === '+' ? 1 : -1;
    const val = fn === 'sin'
        ? sinA * cosB + sign * cosA * sinB
        : cosA * cosB - sign * sinA * sinB;

    current = {
        kind: 'sum',
        A,
        B,
        op,
        fn,
        sinA, cosA, sinB, cosB,
        answer: round2(val),
        tol: 0.03,
    };
}

// ─────────────────────────────────────────────────────────────
// Question text & answer field
// ─────────────────────────────────────────────────────────────

const SIDE_NAME = { hyp: 'hypotenuse', opp: 'opposite side', adj: 'adjacent side' };

function renderQuestion() {
    const q = document.getElementById('question-info');
    const label = document.getElementById('answer-label');
    const unit = document.getElementById('answer-unit');
    let html = '';

    switch (current.kind) {
        case 'side': {
            html = `Angle θ = ${current.theta}°. The ${SIDE_NAME[current.given]} is ` +
                `${current.givenLen}. Find the ${SIDE_NAME[current.find]} (1 decimal place).` +
                `<br><span class="trig-hint">Helpful value: \\(\\${current.ratio} ${current.theta}^\\circ \\approx ${current.ratioVal}\\)</span>`;
            label.textContent = 'Length =';
            unit.textContent = 'units';
            break;
        }

        case 'angle': {
            const [s1, s2] = current.shown;
            html = `The ${SIDE_NAME[s1]} is ${current.sides[s1]} and the ${SIDE_NAME[s2]} is ` +
                `${current.sides[s2]}. Find angle θ (nearest whole degree).` +
                `<div class="trig-table-hint">Work out the ratio, then use the ` +
                `<strong>🧮 Helper Calculator</strong> (sin⁻¹ / cos⁻¹ / tan⁻¹) to turn it into an angle.</div>`;
            label.textContent = 'Angle θ =';
            unit.textContent = 'degrees';
            break;
        }

        case 'ratio': {
            const g = current.givenFrac;
            html = `θ is an acute angle and \\(\\${current.givenName}\\theta = \\dfrac{${g.n}}{${g.d}}\\). ` +
                `Find \\(\\${current.targetName}\\theta\\) (2 decimal places).`;
            label.textContent = `${current.targetName} θ =`;
            unit.textContent = '';
            break;
        }

        case 'special':
            html = `Find the exact value of \\(\\${current.fn} ${current.angle}^\\circ\\) ` +
                `(2 decimal places).`;
            label.textContent = 'Value =';
            unit.textContent = '';
            break;

        case 'double': {
            const fnTex = current.target === 'sin2' ? '\\sin' : '\\cos';
            html = `θ is acute with \\(\\sin\\theta = \\dfrac{${current.sinFrac.n}}{${current.sinFrac.d}}\\) ` +
                `and \\(\\cos\\theta = \\dfrac{${current.cosFrac.n}}{${current.cosFrac.d}}\\). ` +
                `Find \\(${fnTex} 2\\theta\\) (2 decimal places).`;
            label.textContent = current.target === 'sin2' ? 'sin 2θ =' : 'cos 2θ =';
            unit.textContent = '';
            break;
        }

        case 'sum':
            html = `Use the sum &amp; difference formula to find ` +
                `\\(\\${current.fn}(${current.A}^\\circ ${current.op} ${current.B}^\\circ)\\) ` +
                `(2 decimal places).` +
                `<div class="trig-hint">Helpful values: ` +
                `\\(\\sin ${current.A}^\\circ \\approx ${current.sinA}\\), ` +
                `\\(\\cos ${current.A}^\\circ \\approx ${current.cosA}\\), ` +
                `\\(\\sin ${current.B}^\\circ \\approx ${current.sinB}\\), ` +
                `\\(\\cos ${current.B}^\\circ \\approx ${current.cosB}\\)</div>`;
            label.textContent = 'Value =';
            unit.textContent = '';
            break;
    }

    q.innerHTML = html;
    renderMath(q);
}

function clearAnswer() {
    document.getElementById('answer').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback-message';
    document.getElementById('steps').style.display = 'none';
    document.getElementById('answer').focus();
}

// ─────────────────────────────────────────────────────────────
// Canvas drawing
// ─────────────────────────────────────────────────────────────

function drawTriangle() {
    const canvas = document.getElementById('triangle-canvas');
    const ctx = canvas.getContext('2d');

    // Match internal resolution to displayed size for crisp lines.
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 400;
    canvas.height = rect.height || 320;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pad = 55;
    // Use the true angle so the picture matches the numbers,
    // but cap leg ratio so it always fits nicely.
    const theta = current.theta * Math.PI / 180;
    const maxBase = W - pad * 2;
    const maxHeight = H - pad * 2;

    let base = maxBase;
    let height = base * Math.tan(theta);
    if (height > maxHeight) {
        height = maxHeight;
        base = height / Math.tan(theta);
    }

    const A = { x: pad, y: H - pad };              // bottom-left (θ)
    const B = { x: pad + base, y: H - pad };       // bottom-right (right angle)
    const C = { x: pad + base, y: H - pad - height }; // top-right

    // Triangle
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.fillStyle = '#e8ecff';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#667eea';
    ctx.stroke();

    // Right-angle marker at B
    const m = 14;
    ctx.beginPath();
    ctx.moveTo(B.x - m, B.y);
    ctx.lineTo(B.x - m, B.y - m);
    ctx.lineTo(B.x, B.y - m);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Angle θ arc at A
    ctx.beginPath();
    ctx.arc(A.x, A.y, 26, -theta, 0);
    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const sides = current.sides;
    const labelFor = (key) => {
        if (current.kind === 'side') {
            if (key === current.given) return String(current.givenLen);
            if (key === current.find) return '?';
            return '';   // hide the third side to keep the problem focused
        }
        // angle problem: show the two revealed sides only
        if (current.shown.includes(key)) return String(sides[key]);
        return '';
    };

    // Adjacent (AB) — bottom
    const adjLabel = labelFor('adj');
    if (adjLabel) ctx.fillText(adjLabel, (A.x + B.x) / 2, A.y + 20);
    // Opposite (BC) — right
    const oppLabel = labelFor('opp');
    if (oppLabel) ctx.fillText(oppLabel, B.x + 22, (B.y + C.y) / 2);
    // Hypotenuse (AC) — slanted
    const hypLabel = labelFor('hyp');
    if (hypLabel) {
        const mx = (A.x + C.x) / 2;
        const my = (A.y + C.y) / 2 - 14;
        ctx.fillStyle = '#667eea';
        ctx.fillText(hypLabel, mx, my);
        ctx.fillStyle = '#333';
    }

    // θ label
    ctx.fillStyle = '#c62828';
    const thetaText = current.kind === 'side' ? current.theta + '°' : 'θ';
    ctx.fillText(thetaText, A.x + 42, A.y - 16);
}

// Static labelled triangle for the "Learn the Basics" tab.
function drawReferenceTriangle() {
    const canvas = document.getElementById('reference-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 440;
    canvas.height = rect.height || 340;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padX = 70;
    const padY = 55;
    const theta = 35 * Math.PI / 180; // fixed, just for a clear picture

    let base = W - padX * 2;
    let height = base * Math.tan(theta);
    const maxHeight = H - padY * 2;
    if (height > maxHeight) {
        height = maxHeight;
        base = height / Math.tan(theta);
    }

    const A = { x: padX, y: H - padY };               // bottom-left (θ)
    const B = { x: padX + base, y: H - padY };        // bottom-right (right angle)
    const C = { x: padX + base, y: H - padY - height }; // top-right

    // Triangle
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.fillStyle = '#e8ecff';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#667eea';
    ctx.stroke();

    // Right-angle marker at B
    const m = 14;
    ctx.beginPath();
    ctx.moveTo(B.x - m, B.y);
    ctx.lineTo(B.x - m, B.y - m);
    ctx.lineTo(B.x, B.y - m);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Angle θ arc at A
    ctx.beginPath();
    ctx.arc(A.x, A.y, 28, -theta, 0);
    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Adjacent (AB) — bottom, next to θ
    ctx.fillStyle = '#333';
    ctx.fillText('Adjacent', (A.x + B.x) / 2, A.y + 22);

    // Opposite (BC) — right, across from θ
    ctx.save();
    ctx.translate(B.x + 18, (B.y + C.y) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Opposite', 0, 0);
    ctx.restore();

    // Hypotenuse (AC) — slanted, longest side
    const angle = Math.atan2(C.y - A.y, C.x - A.x);
    ctx.save();
    ctx.translate((A.x + C.x) / 2, (A.y + C.y) / 2 - 14);
    ctx.rotate(angle);
    ctx.fillStyle = '#667eea';
    ctx.fillText('Hypotenuse', 0, 0);
    ctx.restore();

    // θ label and right-angle note
    ctx.fillStyle = '#c62828';
    ctx.fillText('θ', A.x + 46, A.y - 16);
    ctx.fillStyle = '#333';
    ctx.font = '13px sans-serif';
    ctx.fillText('90°', B.x - 24, B.y - 24);
}

// ─────────────────────────────────────────────────────────────
// Answer checking
// ─────────────────────────────────────────────────────────────

function checkAnswer() {
    if (!current) return;
    const feedback = document.getElementById('feedback');
    const val = parseNum(document.getElementById('answer').value);

    if (val === null) {
        feedback.textContent = 'Please enter a number (a decimal or a fraction like 3/5).';
        feedback.className = 'feedback-message incorrect';
        return;
    }

    const tol = current.tol != null ? current.tol : 0.2;

    total++;
    if (Math.abs(val - current.answer) <= tol) {
        score++;
        feedback.textContent = '🎉 Correct! Great work.';
        feedback.className = 'feedback-message correct';
    } else {
        const unitTxt = current.kind === 'angle'
            ? '°'
            : current.kind === 'side' ? ' units' : '';
        feedback.textContent = `Not quite. The answer is ${current.answer}${unitTxt}.`;
        feedback.className = 'feedback-message incorrect';
        showSteps();
    }
    updateScore();
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = total;
}

// ─────────────────────────────────────────────────────────────
// Step-by-step solution
// ─────────────────────────────────────────────────────────────

function showSteps() {
    if (!current) return;
    const box = document.getElementById('steps');
    let html = '';

    switch (current.kind) {
        case 'side': {
            const { ratio, theta, given, find, givenLen, answer, ratioVal, op } = current;
            const ratioName = { sin: 'SOH (sine)', cos: 'CAH (cosine)', tan: 'TOA (tangent)' }[ratio];
            const calc = op === 'mul'
                ? `${givenLen} \\times ${ratioVal}`
                : `\\dfrac{${givenLen}}{${ratioVal}}`;
            html += `<div>1. We know the ${SIDE_NAME[given]} and want the ${SIDE_NAME[find]} → use ${ratioName}.</div>`;
            html += `<div>2. Ratio: \\(\\${ratio} ${theta}^\\circ \\approx ${ratioVal}\\)</div>`;
            html += `<div>3. ${op === 'mul' ? 'Multiply' : 'Divide'}: \\(${calc} \\approx ${answer}\\)</div>`;
            html += `<div>4. Answer: \\(${answer}\\) units</div>`;
            break;
        }

        case 'angle': {
            const { ratio, shown, sides, answer } = current;
            const [s1, s2] = shown;
            const num = ratio === 'cos' ? sides.adj : sides.opp;
            const den = ratio === 'tan' ? sides.adj : sides.hyp;
            const val = round2(num / den);
            const frac = `\\dfrac{${num}}{${den}}`;
            html += `<div>1. We know the ${SIDE_NAME[s1]} and ${SIDE_NAME[s2]} → use ${ratio.toUpperCase()}.</div>`;
            html += `<div>2. \\(\\${ratio}\\,\\theta = ${frac} \\approx ${val}\\)</div>`;
            html += `<div>3. Use the Helper Calculator: \\(\\${ratio}^{-1}(${val})\\).</div>`;
            html += `<div>4. Answer: \\(\\theta = ${answer}^\\circ\\)</div>`;
            break;
        }

        case 'ratio': {
            const g = current.givenFrac;
            const t = current.targetFrac;
            html += `<div>1. θ is acute, so sin, cos and tan are all positive.</div>`;
            html += `<div>2. Use \\(\\sin^2\\theta + \\cos^2\\theta = 1\\) and \\(\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}\\).</div>`;
            html += `<div>3. Given \\(\\${current.givenName}\\theta = \\dfrac{${g.n}}{${g.d}}\\).</div>`;
            html += `<div>4. So \\(\\${current.targetName}\\theta = \\dfrac{${t.n}}{${t.d}} \\approx ${current.answer}\\).</div>`;
            break;
        }

        case 'special': {
            html += `<div>1. Recall the special-angle values from the table.</div>`;
            html += `<div>2. \\(\\${current.fn} ${current.angle}^\\circ \\approx ${current.answer}\\)</div>`;
            break;
        }

        case 'double': {
            const formula = current.target === 'sin2'
                ? `\\sin 2\\theta = 2\\sin\\theta\\cos\\theta`
                : `\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta`;
            const sub = current.target === 'sin2'
                ? `2 \\times ${round2(current.s)} \\times ${round2(current.c)}`
                : `(${round2(current.c)})^2 - (${round2(current.s)})^2`;
            html += `<div>1. Formula: \\(${formula}\\)</div>`;
            html += `<div>2. Substitute: \\(${sub}\\)</div>`;
            html += `<div>3. Answer: \\(\\approx ${current.answer}\\)</div>`;
            break;
        }

        case 'sum': {
            const fnTex = current.fn === 'sin' ? '\\sin' : '\\cos';
            let formula;
            if (current.fn === 'sin') {
                formula = current.op === '+'
                    ? `\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B`
                    : `\\sin(A-B) = \\sin A\\cos B - \\cos A\\sin B`;
            } else {
                formula = current.op === '+'
                    ? `\\cos(A+B) = \\cos A\\cos B - \\sin A\\sin B`
                    : `\\cos(A-B) = \\cos A\\cos B + \\sin A\\sin B`;
            }
            html += `<div>1. Let \\(A = ${current.A}^\\circ\\) and \\(B = ${current.B}^\\circ\\).</div>`;
            html += `<div>2. Formula: \\(${formula}\\)</div>`;
            const { sinA, cosA, sinB, cosB, op } = current;
            const sub = current.fn === 'sin'
                ? `(${sinA})(${cosB}) ${op} (${cosA})(${sinB})`
                : `(${cosA})(${cosB}) ${op === '+' ? '-' : '+'} (${sinA})(${sinB})`;
            html += `<div>3. Substitute: \\(${sub}\\)</div>`;
            html += `<div>4. Answer: \\(${fnTex}(${current.A}^\\circ ${current.op} ${current.B}^\\circ) \\approx ${current.answer}\\)</div>`;
            break;
        }
    }

    box.innerHTML = html;
    box.style.display = 'block';
    renderMath(box);
}

// Render any KaTeX math inside an element (auto-render loads via CDN, deferred).
function renderMath(el) {
    if (window.renderMathInElement) {
        renderMathInElement(el, {
            delimiters: [
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true },
            ],
            ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'option'],
            throwOnError: false,
        });
    }
}

// ─────────────────────────────────────────────────────────────
// Tabs & events
// ─────────────────────────────────────────────────────────────

function setupTabs() {
    document.querySelectorAll('.topic-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.topic-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const which = tab.dataset.tab;
            document.getElementById('practice-section').style.display =
                which === 'practice' ? 'block' : 'none';
            document.getElementById('reference-section').style.display =
                which === 'reference' ? 'block' : 'none';
            document.getElementById('advanced-section').style.display =
                which === 'advanced' ? 'block' : 'none';
            if (which === 'practice') drawTriangle();
            if (which === 'reference') drawReferenceTriangle();
        });
    });
}

function setupEvents() {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            problemType = btn.dataset.type;
            generate();
        });
    });

    document.getElementById('generate-btn').addEventListener('click', generate);
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('steps-btn').addEventListener('click', () => {
        if (current) showSteps();
    });

    document.getElementById('answer').addEventListener('keydown', e => {
        if (e.key === 'Enter') checkAnswer();
    });

    window.addEventListener('resize', () => {
        if (current) drawTriangle();
        if (document.getElementById('reference-section').style.display !== 'none') {
            drawReferenceTriangle();
        }
    });
}

// ─────────────────────────────────────────────────────────────
// Helper calculator (√, x², sin/cos/tan, inverse trig)
// ─────────────────────────────────────────────────────────────

function round4(v) {
    return Math.round(v * 10000) / 10000;
}

function runHelper() {
    const op = document.getElementById('helper-op').value;
    const result = document.getElementById('helper-result');
    const raw = document.getElementById('helper-input').value.trim();
    const x = parseNum(raw);

    if (x === null) {
        result.style.color = '#c62828';
        result.textContent = 'Please enter a number (e.g. 25 or 4/3).';
        return;
    }

    result.style.color = '#2e7d32';
    let text;
    switch (op) {
        case 'sqrt':
            if (x < 0) { text = '√ of a negative number is undefined.'; }
            else { text = `√(${raw}) ≈ ${round4(Math.sqrt(x))}`; }
            break;
        case 'square':
            text = `(${raw})² = ${round4(x * x)}`;
            break;
        case 'sin':
            text = `sin(${raw}°) ≈ ${round4(Math.sin(x * Math.PI / 180))}`;
            break;
        case 'cos':
            text = `cos(${raw}°) ≈ ${round4(Math.cos(x * Math.PI / 180))}`;
            break;
        case 'tan':
            text = `tan(${raw}°) ≈ ${round4(Math.tan(x * Math.PI / 180))}`;
            break;
        case 'asin':
            if (x < -1 || x > 1) { text = 'sin⁻¹ needs a value between -1 and 1.'; }
            else { text = `sin⁻¹(${raw}) ≈ ${round1(Math.asin(x) * 180 / Math.PI)}°`; }
            break;
        case 'acos':
            if (x < -1 || x > 1) { text = 'cos⁻¹ needs a value between -1 and 1.'; }
            else { text = `cos⁻¹(${raw}) ≈ ${round1(Math.acos(x) * 180 / Math.PI)}°`; }
            break;
        case 'atan':
            text = `tan⁻¹(${raw}) ≈ ${round1(Math.atan(x) * 180 / Math.PI)}°`;
            break;
        default:
            text = '';
    }
    result.textContent = text;
}

function setupHelper() {
    const toggle = document.getElementById('helper-toggle');
    const body = document.getElementById('helper-body');
    toggle.addEventListener('click', () => {
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('helper-calc').addEventListener('click', runHelper);
    document.getElementById('helper-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') runHelper();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupEvents();
    setupHelper();
    generate();
});
