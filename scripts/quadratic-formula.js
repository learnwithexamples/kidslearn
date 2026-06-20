// Quadratic Formula Practice
// Generates ax² + bx + c = 0 with rational roots so answers are clean.

let difficulty = 'easy';
let current = null;          // { a, b, c, roots: [r1, r2] }
let score = 0;
let total = 0;

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nonZero(min, max) {
    let v = 0;
    while (v === 0) v = randInt(min, max);
    return v;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
}

// Format a number, trimming floating point noise.
function fmt(val) {
    return parseFloat(val.toFixed(4)).toString();
}

// ─────────────────────────────────────────────────────────────
// Problem generation
// Build from factored form a(x − r1)(x − r2) = 0 so roots are tidy.
// ─────────────────────────────────────────────────────────────

function rootRange() {
    if (difficulty === 'medium') return [-8, 8];
    if (difficulty === 'hard')   return [-12, 12];
    return [-6, 6];
}

function generate() {
    const [lo, hi] = rootRange();
    let a, r1, r2, b, c;

    do {
        // Leading coefficient: 1 for easy, small for harder levels.
        if (difficulty === 'easy') {
            a = 1;
        } else if (difficulty === 'medium') {
            a = randInt(1, 3);
        } else {
            a = nonZero(-3, 3);
        }

        r1 = randInt(lo, hi);
        r2 = randInt(lo, hi);

        // a(x - r1)(x - r2) = a x² - a(r1 + r2) x + a r1 r2
        b = -a * (r1 + r2);
        c = a * r1 * r2;
    } while (b === 0 && c === 0); // avoid the trivial a x² = 0 every time

    current = { a, b, c, roots: [r1, r2] };
    renderEquation();
    clearAnswer();
}

// ─────────────────────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────────────────────

function term(coef, variable) {
    // Returns a signed term like " + 3x", " - x", "" (when coef is 0).
    if (coef === 0) return '';
    const sign = coef > 0 ? ' + ' : ' − ';
    let mag = Math.abs(coef);
    let magStr;
    if (variable && mag === 1) magStr = '';
    else magStr = String(mag);
    return `${sign}${magStr}${variable}`;
}

function leadingTerm(coef, variable) {
    if (coef === 0) return '';
    const sign = coef < 0 ? '−' : '';
    let mag = Math.abs(coef);
    let magStr = (variable && mag === 1) ? '' : String(mag);
    return `${sign}${magStr}${variable}`;
}

function renderEquation() {
    const { a, b, c } = current;
    let eq = leadingTerm(a, 'x²');
    eq += term(b, 'x');
    eq += term(c, '');
    eq += ' = 0';
    document.getElementById('equation-display').textContent = eq;
}

function clearAnswer() {
    document.getElementById('x1').value = '';
    document.getElementById('x2').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback-message';
    document.getElementById('steps').style.display = 'none';
    document.getElementById('x1').focus();
}

// ─────────────────────────────────────────────────────────────
// Answer checking
// Accepts plain numbers or simple fractions like "3/2" or "-1/4".
// ─────────────────────────────────────────────────────────────

function parseValue(raw) {
    if (raw == null) return null;
    let s = raw.trim().replace(/−/g, '-'); // normalise unicode minus
    if (s === '') return null;
    if (s.includes('/')) {
        const parts = s.split('/');
        if (parts.length !== 2) return null;
        const n = parseFloat(parts[0]);
        const d = parseFloat(parts[1]);
        if (isNaN(n) || isNaN(d) || d === 0) return null;
        return n / d;
    }
    const v = parseFloat(s);
    return isNaN(v) ? null : v;
}

function checkAnswer() {
    if (!current) return;

    const a1 = parseValue(document.getElementById('x1').value);
    const a2 = parseValue(document.getElementById('x2').value);
    const feedback = document.getElementById('feedback');

    if (a1 === null || a2 === null) {
        feedback.textContent = 'Please enter both solutions (a number or fraction).';
        feedback.className = 'feedback-message incorrect';
        return;
    }

    const [r1, r2] = current.roots;
    const tol = 0.01;
    const matchA = (Math.abs(a1 - r1) < tol && Math.abs(a2 - r2) < tol);
    const matchB = (Math.abs(a1 - r2) < tol && Math.abs(a2 - r1) < tol);

    total++;
    if (matchA || matchB) {
        score++;
        feedback.textContent = '🎉 Correct! Well done.';
        feedback.className = 'feedback-message correct';
    } else {
        const sorted = [r1, r2].sort((p, q) => p - q);
        feedback.textContent =
            `Not quite. The solutions are x = ${fmt(sorted[0])} and x = ${fmt(sorted[1])}.`;
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
    const { a, b, c, roots } = current;
    const disc = b * b - 4 * a * c;
    const sqrt = Math.sqrt(disc);
    const sorted = [...roots].sort((p, q) => p - q);

    const box = document.getElementById('steps');
    box.innerHTML = `
        <div>1. Coefficients: <code>a = ${a}</code>, <code>b = ${b}</code>, <code>c = ${c}</code></div>
        <div>2. Discriminant: <code>Δ = b² − 4ac = (${b})² − 4(${a})(${c}) = ${disc}</code></div>
        <div>3. Square root: <code>√${disc} = ${fmt(sqrt)}</code></div>
        <div>4. Formula: <code>x = (−(${b}) ± ${fmt(sqrt)}) / (2 × ${a})</code></div>
        <div>5. Solutions: <code>x = ${fmt(sorted[0])}</code> and <code>x = ${fmt(sorted[1])}</code></div>
    `;
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
        });
    });
}

function setupEvents() {
    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.operation-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.difficulty;
            generate();
        });
    });

    document.getElementById('generate-btn').addEventListener('click', generate);
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('steps-btn').addEventListener('click', () => {
        if (!current) return;
        showSteps();
    });

    ['x1', 'x2'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', e => {
            if (e.key === 'Enter') checkAnswer();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupEvents();
    generate();
});
