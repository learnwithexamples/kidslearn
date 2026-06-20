// Quadratic Formula Practice
// Generates ax² + bx + c = 0 with rational roots so answers are clean.
// Two practice methods: "solve" (enter the roots) and "factor" (fill brackets).

let method = 'solve';        // 'solve' | 'factor'
let difficulty = 'easy';
let current = null;          // { mode, a, b, c, roots:[r1,r2], p?, q? }
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

// Format a root as a tidy fraction when it isn't a whole number
// (hard problems have denominators 2, 3 or 4).
function fmtRoot(val) {
    if (Math.abs(val - Math.round(val)) < 1e-9) return String(Math.round(val));
    for (const d of [2, 3, 4]) {
        const n = val * d;
        if (Math.abs(n - Math.round(n)) < 1e-9) {
            return `${Math.round(n)}/${d}`;
        }
    }
    return fmt(val);
}

// ─────────────────────────────────────────────────────────────
// Problem generation
// ─────────────────────────────────────────────────────────────

function generate() {
    if (method === 'factor') {
        generateFactor();
    } else {
        generateSolve();
    }
    renderEquation();
    clearAnswer();
}

// Build  a·x² + b·x + c = 0  with rational roots.
//   easy   – monic, small integer roots
//   medium – non-monic (a ≥ 2), larger integer roots
//   hard   – non-monic with at least one fractional root
function generateSolve() {
    let a, b, c, roots;

    if (difficulty === 'easy') {
        a = 1;
        let r1, r2;
        do {
            r1 = nonZero(-6, 6);
            r2 = nonZero(-6, 6);
        } while (r1 === 0 && r2 === 0);
        b = -(r1 + r2);
        c = r1 * r2;
        roots = [r1, r2];
    } else if (difficulty === 'medium') {
        a = randInt(2, 4);
        const r1 = nonZero(-9, 9);
        const r2 = nonZero(-9, 9);
        b = -a * (r1 + r2);
        c = a * r1 * r2;
        roots = [r1, r2];
    } else {
        // Hard: roots m/a and n, where m is NOT a multiple of a → a real fraction.
        a = randInt(2, 4);
        let m;
        do { m = nonZero(-9, 9); } while (m % a === 0);
        const n = nonZero(-7, 7);
        // (a·x − m)(x − n) = a·x² − (a·n + m)·x + m·n
        b = -(a * n + m);
        c = m * n;
        roots = [m / a, n];
    }

    current = { mode: 'solve', a, b, c, roots };
}

// Build a monic factorable quadratic  x² + bx + c = (x + p)(x + q) = 0.
//   easy   – small positive bracket numbers
//   medium – mixed signs, medium range
//   hard   – mixed signs, larger range
function generateFactor() {
    let lo, hi;
    if (difficulty === 'easy')      { lo = 1;   hi = 7; }
    else if (difficulty === 'medium') { lo = -9; hi = 9; }
    else                            { lo = -13; hi = 13; }

    const p = nonZero(lo, hi);
    const q = nonZero(lo, hi);
    const b = p + q;          // (x + p)(x + q) = x² + (p+q)x + pq
    const c = p * q;

    current = { mode: 'factor', a: 1, b, c, p, q, roots: [-p, -q] };
}

// ─────────────────────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────────────────────

// Build the LaTeX for a quadratic term with the right sign and coefficient.
function latexTerm(coef, variable, leading) {
    if (coef === 0) return '';
    const mag = Math.abs(coef);
    const magStr = (variable && mag === 1) ? '' : String(mag);
    if (leading) {
        return `${coef < 0 ? '-' : ''}${magStr}${variable}`;
    }
    const sign = coef > 0 ? '+' : '-';
    return ` ${sign} ${magStr}${variable}`;
}

function renderEquation() {
    const { a, b, c } = current;
    let latex = latexTerm(a, 'x^2', true);
    latex += latexTerm(b, 'x', false);
    latex += latexTerm(c, '', false);
    latex += ' = 0';
    const el = document.getElementById('equation-display');
    el.innerHTML = `\\(${latex}\\)`;
    renderMath(el);
}

function clearAnswer() {
    document.getElementById('x1').value = '';
    document.getElementById('x2').value = '';
    document.getElementById('fact-p').value = '';
    document.getElementById('fact-q').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback-message';
    document.getElementById('steps').style.display = 'none';

    const factoring = current && current.mode === 'factor';
    document.getElementById('solve-answer').style.display = factoring ? 'none' : 'block';
    document.getElementById('factor-answer').style.display = factoring ? 'block' : 'none';
    document.getElementById(factoring ? 'fact-p' : 'x1').focus();
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
    if (current.mode === 'factor') {
        checkFactor();
    } else {
        checkSolve();
    }
}

function checkSolve() {
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
            `Not quite. The solutions are x = ${fmtRoot(sorted[0])} and x = ${fmtRoot(sorted[1])}.`;
        feedback.className = 'feedback-message incorrect';
        showSteps();
    }
    updateScore();
}

function checkFactor() {
    const a1 = parseValue(document.getElementById('fact-p').value);
    const a2 = parseValue(document.getElementById('fact-q').value);
    const feedback = document.getElementById('feedback');

    if (a1 === null || a2 === null) {
        feedback.textContent = 'Fill in both brackets with a number.';
        feedback.className = 'feedback-message incorrect';
        return;
    }

    // Correct when the two numbers add to b and multiply to c (any order).
    const { b, c } = current;
    const ok = Math.abs(a1 + a2 - b) < 0.01 && Math.abs(a1 * a2 - c) < 0.01;

    total++;
    if (ok) {
        score++;
        feedback.textContent = '🎉 Correct! Nicely factored.';
        feedback.className = 'feedback-message correct';
    } else {
        feedback.textContent =
            `Not quite. Look for two numbers that add to ${b} and multiply to ${c}.`;
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
    if (current.mode === 'factor') {
        showFactorSteps();
    } else {
        showSolveSteps();
    }
}

function showSolveSteps() {
    const { a, b, c, roots } = current;
    const disc = b * b - 4 * a * c;
    const sqrt = Math.sqrt(disc);
    const sorted = [...roots].sort((p, q) => p - q);

    const box = document.getElementById('steps');
    box.innerHTML = `
        <div>1. Coefficients: \\(a = ${a}\\), \\(b = ${b}\\), \\(c = ${c}\\)</div>
        <div>2. Discriminant: \\(\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${disc}\\)</div>
        <div>3. Square root: \\(\\sqrt{${disc}} = ${fmt(sqrt)}\\)</div>
        <div>4. Formula: \\(x = \\dfrac{-(${b}) \\pm ${fmt(sqrt)}}{2 \\times ${a}}\\)</div>
        <div>5. Solutions: \(x = ${fmtRoot(sorted[0])}\) and \(x = ${fmtRoot(sorted[1])}\)</div>
    `;
    box.style.display = 'block';
    renderMath(box);
}

function showFactorSteps() {
    const { b, c, p, q } = current;
    const box = document.getElementById('steps');
    box.innerHTML = `
        <div>1. We need two numbers that multiply to \\(${c}\\) and add to \\(${b}\\).</div>
        <div>2. Those numbers are \\(${p}\\) and \\(${q}\\).</div>
        <div>3. Factor: \\((x ${p < 0 ? '-' : '+'} ${Math.abs(p)})(x ${q < 0 ? '-' : '+'} ${Math.abs(q)}) = 0\\)</div>
        <div>4. Set each factor to zero: \\(x = ${-p}\\) or \\(x = ${-q}\\)</div>
    `;
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
            document.getElementById('factoring-section').style.display =
                which === 'factoring' ? 'block' : 'none';
        });
    });
}

function setupEvents() {
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            method = btn.dataset.method;
            generate();
        });
    });

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
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

    ['x1', 'x2', 'fact-p', 'fact-q'].forEach(id => {
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
