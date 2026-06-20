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

const ANGLES = [25, 30, 35, 40, 45, 50, 55, 60, 65];

// ─────────────────────────────────────────────────────────────
// Problem generation
// Triangle layout: right angle at B (bottom-right).
//   A = bottom-left  (angle θ lives here)
//   B = bottom-right (right angle)
//   C = top-right
//   AB = adjacent to θ,  BC = opposite to θ,  AC = hypotenuse
// ─────────────────────────────────────────────────────────────

function generate() {
    if (problemType === 'side') generateSide();
    else generateAngle();

    drawTriangle();
    renderQuestion();
    clearAnswer();
}

function generateSide() {
    const theta = choice(ANGLES);
    const rad = theta * Math.PI / 180;

    // Pick which side is given and which is the unknown.
    // ratio key tells us which trig ratio links them.
    const setups = [
        // given hypotenuse, find opposite  -> sin
        { given: 'hyp', find: 'opp', ratio: 'sin' },
        // given hypotenuse, find adjacent  -> cos
        { given: 'hyp', find: 'adj', ratio: 'cos' },
        // given adjacent,  find opposite   -> tan
        { given: 'adj', find: 'opp', ratio: 'tan' },
        // given opposite,  find adjacent   -> tan
        { given: 'opp', find: 'adj', ratio: 'tan' },
        // given adjacent,  find hypotenuse -> cos
        { given: 'adj', find: 'hyp', ratio: 'cos' },
        // given opposite,  find hypotenuse -> sin
        { given: 'opp', find: 'hyp', ratio: 'sin' },
    ];
    const setup = choice(setups);

    const givenLen = randInt(5, 20);

    // Compute all three true side lengths from one given length + angle.
    // Use the given side to fix a scale, then derive the rest.
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

    const answer = round1({ hyp, opp, adj }[setup.find]);

    current = {
        kind: 'side',
        theta,
        sides: { hyp: round1(hyp), opp: round1(opp), adj: round1(adj) },
        given: setup.given,
        givenLen,
        find: setup.find,
        ratio: setup.ratio,
        answer,
    };
}

function generateAngle() {
    // Give two sides, ask for angle θ at A (rounded to nearest degree).
    const opp = randInt(3, 12);
    const adj = randInt(3, 12);
    const hyp = Math.sqrt(opp * opp + adj * adj);
    const theta = Math.atan2(opp, adj) * 180 / Math.PI;

    // Choose which pair of sides we reveal -> determines inverse ratio.
    const setups = [
        { shown: ['opp', 'hyp'], ratio: 'sin' },
        { shown: ['adj', 'hyp'], ratio: 'cos' },
        { shown: ['opp', 'adj'], ratio: 'tan' },
    ];
    const setup = choice(setups);

    current = {
        kind: 'angle',
        theta,
        answer: Math.round(theta),
        sides: { hyp: round1(hyp), opp, adj },
        shown: setup.shown,
        ratio: setup.ratio,
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

    if (current.kind === 'side') {
        q.textContent =
            `Angle θ = ${current.theta}°. The ${SIDE_NAME[current.given]} is ` +
            `${current.givenLen}. Find the ${SIDE_NAME[current.find]} (1 decimal place).`;
        label.textContent = 'Length =';
        unit.textContent = 'units';
    } else {
        const [s1, s2] = current.shown;
        q.textContent =
            `The ${SIDE_NAME[s1]} is ${current.sides[s1]} and the ${SIDE_NAME[s2]} is ` +
            `${current.sides[s2]}. Find angle θ (nearest whole degree).`;
        label.textContent = 'Angle θ =';
        unit.textContent = 'degrees';
    }
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

// ─────────────────────────────────────────────────────────────
// Answer checking
// ─────────────────────────────────────────────────────────────

function checkAnswer() {
    if (!current) return;
    const raw = document.getElementById('answer').value.trim().replace(/−/g, '-');
    const feedback = document.getElementById('feedback');

    if (raw === '' || isNaN(parseFloat(raw))) {
        feedback.textContent = 'Please enter a number.';
        feedback.className = 'feedback-message incorrect';
        return;
    }

    const val = parseFloat(raw);
    const tol = current.kind === 'angle' ? 1.0 : 0.2;

    total++;
    if (Math.abs(val - current.answer) <= tol) {
        score++;
        feedback.textContent = '🎉 Correct! Great work.';
        feedback.className = 'feedback-message correct';
    } else {
        const unit = current.kind === 'angle' ? '°' : '';
        feedback.textContent = `Not quite. The answer is ${current.answer}${unit}.`;
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

    if (current.kind === 'side') {
        const { ratio, theta, given, givenLen, find, answer } = current;
        const ratioName = { sin: 'SOH (sine)', cos: 'CAH (cosine)', tan: 'TOA (tangent)' }[ratio];
        html += `<div>1. We know the ${SIDE_NAME[given]} and want the ${SIDE_NAME[find]} → use ${ratioName}.</div>`;
        html += `<div>2. Ratio: <code>${ratio} ${theta}° = ${round1(Math[ratio](theta * Math.PI / 180))}</code></div>`;
        html += `<div>3. Rearrange and solve with the known side (${givenLen}).</div>`;
        html += `<div>4. Answer: <code>${answer} units</code></div>`;
    } else {
        const { ratio, shown, sides, answer } = current;
        const inv = { sin: 'sin⁻¹', cos: 'cos⁻¹', tan: 'tan⁻¹' }[ratio];
        const [s1, s2] = shown;
        const frac = ratio === 'tan'
            ? `${sides.opp} ÷ ${sides.adj}`
            : ratio === 'sin'
                ? `${sides.opp} ÷ ${sides.hyp}`
                : `${sides.adj} ÷ ${sides.hyp}`;
        html += `<div>1. We know the ${SIDE_NAME[s1]} and ${SIDE_NAME[s2]} → use ${ratio.toUpperCase()}.</div>`;
        html += `<div>2. <code>${ratio} θ = ${frac}</code></div>`;
        html += `<div>3. <code>θ = ${inv}(${frac})</code></div>`;
        html += `<div>4. Answer: <code>θ ≈ ${answer}°</code></div>`;
    }

    box.innerHTML = html;
    box.style.display = 'block';
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
            if (which === 'practice') drawTriangle();
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
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupEvents();
    generate();
});
