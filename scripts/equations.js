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
            document.getElementById('expand-section').style.display =
                which === 'expand' ? 'block' : 'none';
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

// ─────────────────────────────────────────────────────────────
// Expand & Factor practice
//   Built from (x + a)(x + b) = x² + (a + b)x + ab.
//   Expand mode – show the brackets, ask for the coefficient & constant.
//   Factor mode – show the quadratic, ask for the two brackets.
// ─────────────────────────────────────────────────────────────

let efMode = 'expand';       // 'expand' | 'factor'
let efDifficulty = 'easy';
let efCurrent = null;        // { mode, a, b, sumB, prodC }
let efScore = 0;
let efTotal = 0;

function efRange() {
    if (efDifficulty === 'medium') return [-9, 9];
    if (efDifficulty === 'hard') return [-13, 13];
    return [1, 7];           // easy: small positive numbers only
}

// Positive value of a used by the identity expansions (signs come from the form).
function efIdentityA() {
    if (efDifficulty === 'medium') return randInt(2, 9);
    if (efDifficulty === 'hard') return randInt(2, 12);
    return randInt(2, 6);
}

function efGenerate() {
    if (efMode === 'identity') {
        efGenerateIdentity();
    } else {
        const [lo, hi] = efRange();
        const a = nonZero(lo, hi);
        const b = nonZero(lo, hi);
        efCurrent = { mode: efMode, a, b, sumB: a + b, prodC: a * b };
    }
    efRenderEquation();
    efClear();
}

// Build a special-product identity to expand. Every form expands to a
// polynomial whose coefficients (highest power first) we store in `poly`.
function efGenerateIdentity() {
    const a = efIdentityA();
    const types = ['sq+', 'sq-', 'diff', 'cube+', 'cube-'];
    const t = types[randInt(0, types.length - 1)];

    let question, poly;
    switch (t) {
        case 'sq+':
            question = `(x + ${a})^2`;
            poly = [{ pow: 2, coef: 1 }, { pow: 1, coef: 2 * a }, { pow: 0, coef: a * a }];
            break;
        case 'sq-':
            question = `(x - ${a})^2`;
            poly = [{ pow: 2, coef: 1 }, { pow: 1, coef: -2 * a }, { pow: 0, coef: a * a }];
            break;
        case 'diff':
            question = `(x + ${a})(x - ${a})`;
            poly = [{ pow: 2, coef: 1 }, { pow: 1, coef: 0 }, { pow: 0, coef: -a * a }];
            break;
        case 'cube+':
            question = `(x + ${a})^3`;
            poly = [{ pow: 3, coef: 1 }, { pow: 2, coef: 3 * a },
                    { pow: 1, coef: 3 * a * a }, { pow: 0, coef: a * a * a }];
            break;
        default: // 'cube-'
            question = `(x - ${a})^3`;
            poly = [{ pow: 3, coef: 1 }, { pow: 2, coef: -3 * a },
                    { pow: 1, coef: 3 * a * a }, { pow: 0, coef: -a * a * a }];
            break;
    }
    efCurrent = { mode: 'identity', a, question, poly };
    efBuildIdentityForm();
}

// The visible part of a term: "x³", "x²", "x", or "" for the constant.
function efVarText(pow) {
    if (pow === 0) return '';
    if (pow === 1) return ' x';
    if (pow === 2) return ' x²';
    if (pow === 3) return ' x³';
    return ` x^${pow}`;
}

// Build the fill-in answer row for the current identity: a fixed leading term
// followed by an input box for every remaining coefficient.
function efBuildIdentityForm() {
    const poly = efCurrent.poly;
    const lead = poly[0];
    let html = `x${lead.pow === 3 ? '³' : lead.pow === 2 ? '²' : ''}`;
    for (let i = 1; i < poly.length; i++) {
        html += ` + <input type="text" id="ident-${i}" class="ef-input" placeholder="?" autocomplete="off">`;
        html += efVarText(poly[i].pow);
    }
    const form = document.getElementById('ident-form');
    form.innerHTML = html;
    for (let i = 1; i < poly.length; i++) {
        document.getElementById(`ident-${i}`).addEventListener('keydown', e => {
            if (e.key === 'Enter') efCheck();
        });
    }
}

// LaTeX for a bracket "(x + n)" / "(x - |n|)".
function efBracket(n) {
    return n < 0 ? `(x - ${Math.abs(n)})` : `(x + ${n})`;
}

// LaTeX for x² + Bx + C.
function efQuadLatex(B, C) {
    let s = 'x^2';
    if (B === 1) s += ' + x';
    else if (B === -1) s += ' - x';
    else if (B > 0) s += ` + ${B}x`;
    else if (B < 0) s += ` - ${Math.abs(B)}x`;
    if (C > 0) s += ` + ${C}`;
    else if (C < 0) s += ` - ${Math.abs(C)}`;
    return s;
}

function efRenderEquation() {
    const { mode, a, b, sumB, prodC } = efCurrent;
    let latex;
    if (mode === 'identity') {
        latex = efCurrent.question;
    } else if (mode === 'expand') {
        latex = `${efBracket(a)}${efBracket(b)}`;
    } else {
        latex = efQuadLatex(sumB, prodC);
    }
    const el = document.getElementById('ef-equation');
    el.innerHTML = `\\(${latex}\\)`;
    renderMath(el);
}

function efClear() {
    ['exp-b', 'exp-c', 'fac-p', 'fac-q'].forEach(id => {
        document.getElementById(id).value = '';
    });
    const feedback = document.getElementById('ef-feedback');
    feedback.textContent = '';
    feedback.className = 'feedback-message';
    document.getElementById('ef-steps').style.display = 'none';

    const mode = efCurrent ? efCurrent.mode : 'expand';
    document.getElementById('ef-expand-answer').style.display = mode === 'expand' ? 'block' : 'none';
    document.getElementById('ef-factor-answer').style.display = mode === 'factor' ? 'block' : 'none';
    document.getElementById('ef-identity-answer').style.display = mode === 'identity' ? 'block' : 'none';

    if (mode === 'factor') {
        document.getElementById('fac-p').focus();
    } else if (mode === 'identity') {
        const first = document.getElementById('ident-1');
        if (first) first.focus();
    } else {
        document.getElementById('exp-b').focus();
    }
}

function efCheck() {
    if (!efCurrent) return;
    if (efCurrent.mode === 'factor') efCheckFactor();
    else if (efCurrent.mode === 'identity') efCheckIdentity();
    else efCheckExpand();
}

function efCheckExpand() {
    const vb = parseValue(document.getElementById('exp-b').value);
    const vc = parseValue(document.getElementById('exp-c').value);
    const feedback = document.getElementById('ef-feedback');

    if (vb === null || vc === null) {
        feedback.textContent = 'Fill in both the coefficient and the constant.';
        feedback.className = 'feedback-message incorrect';
        return;
    }

    const { sumB, prodC } = efCurrent;
    const ok = Math.abs(vb - sumB) < 0.01 && Math.abs(vc - prodC) < 0.01;

    efTotal++;
    if (ok) {
        efScore++;
        feedback.textContent = '🎉 Correct! Nicely expanded.';
        feedback.className = 'feedback-message correct';
    } else {
        feedback.innerHTML =
            `Not quite. It expands to ${efQuadLatexPlain(sumB, prodC)}.`;
        feedback.className = 'feedback-message incorrect';
        renderMath(feedback);
        efShowSteps();
    }
    efUpdateScore();
}

function efCheckFactor() {
    const p = parseValue(document.getElementById('fac-p').value);
    const q = parseValue(document.getElementById('fac-q').value);
    const feedback = document.getElementById('ef-feedback');

    if (p === null || q === null) {
        feedback.textContent = 'Fill in both brackets with a number.';
        feedback.className = 'feedback-message incorrect';
        return;
    }

    const { sumB, prodC } = efCurrent;
    const ok = Math.abs(p + q - sumB) < 0.01 && Math.abs(p * q - prodC) < 0.01;

    efTotal++;
    if (ok) {
        efScore++;
        feedback.textContent = '🎉 Correct! Nicely factored.';
        feedback.className = 'feedback-message correct';
    } else {
        feedback.textContent =
            `Not quite. Look for two numbers that add to ${sumB} and multiply to ${prodC}.`;
        feedback.className = 'feedback-message incorrect';
        efShowSteps();
    }
    efUpdateScore();
}

// Plain-text version of x² + Bx + C for feedback messages.
function efQuadLatexPlain(B, C) {
    return `\\(${efQuadLatex(B, C)}\\)`;
}

// Full LaTeX for a polynomial given as [{pow, coef}, ...] (highest power first).
// Zero coefficients are skipped, except a lone constant.
function efPolyLatex(poly) {
    let s = '';
    poly.forEach((term, i) => {
        const { pow, coef } = term;
        if (coef === 0) return;
        const mag = Math.abs(coef);
        const varPart = pow === 0 ? '' : (pow === 1 ? 'x' : `x^${pow}`);
        const num = (mag === 1 && pow > 0) ? '' : String(mag);
        if (s === '') {
            s = (coef < 0 ? '-' : '') + num + varPart;
        } else {
            s += (coef < 0 ? ' - ' : ' + ') + num + varPart;
        }
    });
    return s === '' ? '0' : s;
}

function efCheckIdentity() {
    const poly = efCurrent.poly;
    const feedback = document.getElementById('ef-feedback');

    let allCorrect = true;
    for (let i = 1; i < poly.length; i++) {
        const v = parseValue(document.getElementById(`ident-${i}`).value);
        if (v === null) {
            feedback.textContent = 'Fill in every coefficient (use 0 if a term disappears).';
            feedback.className = 'feedback-message incorrect';
            return;
        }
        if (Math.abs(v - poly[i].coef) >= 0.01) allCorrect = false;
    }

    efTotal++;
    if (allCorrect) {
        efScore++;
        feedback.textContent = '🎉 Correct! Nicely expanded.';
        feedback.className = 'feedback-message correct';
    } else {
        feedback.innerHTML = `Not quite. It expands to \\(${efPolyLatex(poly)}\\).`;
        feedback.className = 'feedback-message incorrect';
        renderMath(feedback);
        efShowSteps();
    }
    efUpdateScore();
}

function efUpdateScore() {
    document.getElementById('ef-score').textContent = efScore;
    document.getElementById('ef-total').textContent = efTotal;
}

function efShowSteps() {
    if (!efCurrent) return;
    const { mode, a, b, sumB, prodC } = efCurrent;
    const box = document.getElementById('ef-steps');

    if (mode === 'identity') {
        const rule = efIdentityRule(efCurrent.question);
        box.innerHTML = `
            <div>1. Use the identity \\(${rule}\\)</div>
            <div>2. With \\(a = ${a}\\): \\(${efCurrent.question} = ${efPolyLatex(efCurrent.poly)}\\)</div>
        `;
    } else if (mode === 'expand') {
        box.innerHTML = `
            <div>1. Use \\((x + a)(x + b) = x^2 + (a + b)x + ab\\)</div>
            <div>2. Middle term: \\(a + b = (${a}) + (${b}) = ${sumB}\\)</div>
            <div>3. Last term: \\(a \\times b = (${a})(${b}) = ${prodC}\\)</div>
            <div>4. \\(${efBracket(a)}${efBracket(b)} = ${efQuadLatex(sumB, prodC)}\\)</div>
        `;
    } else {
        box.innerHTML = `
            <div>1. Find two numbers that multiply to \\(${prodC}\\) and add to \\(${sumB}\\).</div>
            <div>2. Those numbers are \\(${a}\\) and \\(${b}\\).</div>
            <div>3. \\(${efQuadLatex(sumB, prodC)} = ${efBracket(a)}${efBracket(b)}\\)</div>
        `;
    }
    box.style.display = 'block';
    renderMath(box);
}

// The general identity that matches the shape of the current question.
function efIdentityRule(question) {
    if (question.includes(')(')) return '(x + a)(x - a) = x^2 - a^2';
    if (question.includes('^3')) {
        return question.includes('-')
            ? '(x - a)^3 = x^3 - 3a x^2 + 3a^2 x - a^3'
            : '(x + a)^3 = x^3 + 3a x^2 + 3a^2 x + a^3';
    }
    return question.includes('-')
        ? '(x - a)^2 = x^2 - 2a x + a^2'
        : '(x + a)^2 = x^2 + 2a x + a^2';
}


function setupExpandFactor() {
    document.querySelectorAll('.ef-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.ef-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            efMode = btn.dataset.mode;
            efGenerate();
        });
    });

    document.querySelectorAll('.ef-difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.ef-difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            efDifficulty = btn.dataset.difficulty;
            efGenerate();
        });
    });

    document.getElementById('ef-generate-btn').addEventListener('click', efGenerate);
    document.getElementById('ef-check-btn').addEventListener('click', efCheck);
    document.getElementById('ef-steps-btn').addEventListener('click', () => {
        if (efCurrent) efShowSteps();
    });

    ['exp-b', 'exp-c', 'fac-p', 'fac-q'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', e => {
            if (e.key === 'Enter') efCheck();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupEvents();
    setupExpandFactor();
    generate();
    efGenerate();
});
