// Linear Equations Practice
// Builds ax + b = cx + d with clean integer solutions across three levels:
//   easy   – one step      (x + b = d  or  a·x = d)
//   medium – two steps     (a·x + b = d)
//   hard   – both sides    (a·x + b = c·x + d)

let difficulty = 'easy';
let current = null;          // { a, b, c, d, solution }
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

// Trim floating-point noise for display.
function fmt(val) {
    return parseFloat(val.toFixed(4)).toString();
}

// Accepts plain numbers or simple fractions like "3/2" or "-1/4".
function parseValue(raw) {
    if (raw == null) return null;
    const s = String(raw).trim().replace(/−/g, '-'); // normalise unicode minus
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

// ─────────────────────────────────────────────────────────────
// Problem generation
// Pick the solution first, then build coefficients so it stays clean.
// ─────────────────────────────────────────────────────────────

function generate() {
    const s = nonZero(-9, 9);   // the solution we want
    let a, b, c, d;

    if (difficulty === 'easy') {
        // One step: either  x + b = d   or   a·x = d
        if (Math.random() < 0.5) {
            a = 1; c = 0;
            b = nonZero(-9, 9);
            d = a * s + b;          // x + b = s + b
        } else {
            a = randInt(2, 5); c = 0; b = 0;
            d = a * s;              // a·x = a·s
        }
    } else if (difficulty === 'medium') {
        // Two steps:  a·x + b = d
        a = randInt(2, 6); c = 0;
        b = nonZero(-9, 9);
        d = a * s + b;
    } else {
        // Both sides:  a·x + b = c·x + d   (a ≠ c so it solves uniquely)
        do {
            a = nonZero(-6, 6);
            c = nonZero(-6, 6);
        } while (a === c);
        b = nonZero(-9, 9);
        d = (a - c) * s + b;        // a·s + b = c·s + d  →  d = (a−c)s + b
    }

    current = { a, b, c, d, solution: s };
    renderEquation();
    clearAnswer();
}

// ─────────────────────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────────────────────

// LaTeX for a single "p·x" term (handles 1, -1, 0).
function xTerm(coef) {
    if (coef === 1) return 'x';
    if (coef === -1) return '-x';
    return `${coef}x`;
}

// LaTeX for one side of the form p·x + q.
function sideLatex(p, q) {
    if (p === 0) return `${q}`;
    let s = xTerm(p);
    if (q > 0) s += ` + ${q}`;
    else if (q < 0) s += ` - ${Math.abs(q)}`;
    return s;
}

function renderEquation() {
    const { a, b, c, d } = current;
    const latex = `${sideLatex(a, b)} = ${sideLatex(c, d)}`;
    const el = document.getElementById('equation-display');
    el.innerHTML = `\\(${latex}\\)`;
    renderMath(el);
}

function clearAnswer() {
    document.getElementById('answer').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback-message';
    document.getElementById('steps').style.display = 'none';
    document.getElementById('answer').focus();
}

// ─────────────────────────────────────────────────────────────
// Answer checking
// ─────────────────────────────────────────────────────────────

function checkAnswer() {
    if (!current) return;

    const val = parseValue(document.getElementById('answer').value);
    const feedback = document.getElementById('feedback');

    if (val === null) {
        feedback.textContent = 'Please enter a number or fraction (e.g. 4 or 3/2).';
        feedback.className = 'feedback-message incorrect';
        return;
    }

    total++;
    if (Math.abs(val - current.solution) < 0.01) {
        score++;
        feedback.textContent = '🎉 Correct! Well done.';
        feedback.className = 'feedback-message correct';
    } else {
        feedback.textContent =
            `Not quite. The solution is x = ${fmt(current.solution)}.`;
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
    const { a, b, c, d, solution } = current;
    const box = document.getElementById('steps');

    const lines = [];
    lines.push(`<div>1. Start: \\(${sideLatex(a, b)} = ${sideLatex(c, d)}\\)</div>`);

    let n = 2;
    let leftA = a, leftB = b, rightD = d;

    // Move the variable term off the right side (only when both sides have x).
    if (c !== 0) {
        leftA = a - c;
        const verb = c > 0 ? `Subtract \\(${xTerm(c)}\\)` : `Add \\(${xTerm(-c)}\\)`;
        lines.push(`<div>${n++}. ${verb} from both sides: ` +
            `\\(${sideLatex(leftA, leftB)} = ${rightD}\\)</div>`);
    }

    // Move the constant off the left side.
    if (leftB !== 0) {
        const verb = leftB > 0 ? `Subtract \\(${leftB}\\)` : `Add \\(${Math.abs(leftB)}\\)`;
        rightD = rightD - leftB;
        lines.push(`<div>${n++}. ${verb} from both sides: ` +
            `\\(${xTerm(leftA)} = ${rightD}\\)</div>`);
    }

    // Divide by the coefficient of x.
    if (leftA !== 1) {
        lines.push(`<div>${n++}. Divide both sides by \\(${leftA}\\): ` +
            `\\(x = \\dfrac{${rightD}}{${leftA}} = ${fmt(solution)}\\)</div>`);
    } else {
        lines.push(`<div>${n++}. So \\(x = ${fmt(solution)}\\)</div>`);
    }

    box.innerHTML = lines.join('');
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
        if (current) showSteps();
    });

    document.getElementById('answer').addEventListener('keydown', e => {
        if (e.key === 'Enter') checkAnswer();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupEvents();
    generate();
});
