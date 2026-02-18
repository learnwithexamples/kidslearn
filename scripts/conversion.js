// Fraction ↔ Percentage ↔ Decimal Conversion Practice

let givenType  = 'fraction';
let difficulty = 'easy';
let questions  = [];
let startTime     = null;
let timerInterval = null;
let isPaused   = false;
let elapsedTime = 0;

// ─────────────────────────────────────────────────────────────
// Math Utilities
// ─────────────────────────────────────────────────────────────

function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
}

function simplify(n, d) {
    if (!d) return { n: 0, d: 1 };
    if (!n)  return { n: 0, d: 1 };
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
}

/**
 * Convert a decimal to its simplest fraction using the
 * multiply-by-power-of-10 approach (handles terminating decimals
 * and rounds off floating-point noise for repeating ones).
 */
function decToFrac(decimal) {
    if (!isFinite(decimal) || isNaN(decimal)) return null;
    // Strip floating-point noise beyond 9 significant digits
    const cleaned = Math.round(decimal * 1e9) / 1e9;
    const str = cleaned.toString();
    const dot = str.indexOf('.');
    if (dot < 0) return simplify(cleaned, 1);
    const places = str.length - dot - 1;
    const denom  = Math.pow(10, places);
    const numer  = Math.round(cleaned * denom);
    return simplify(numer, denom);
}

/** Format decimal: max 4 decimal places, trailing zeros stripped. */
function fmtDec(val) {
    return parseFloat(val.toFixed(4)).toString();
}

/** Format percentage: max 2 decimal places, trailing zeros stripped. */
function fmtPct(val) {
    return parseFloat(val.toFixed(2)).toString();
}

// ─────────────────────────────────────────────────────────────
// Fraction Pools
// ─────────────────────────────────────────────────────────────

const POOL_EASY = [
    // halves, quarters
    {n:1,d:2},  {n:1,d:4},  {n:3,d:4},
    // fifths
    {n:1,d:5},  {n:2,d:5},  {n:3,d:5},  {n:4,d:5},
    // eighths
    {n:1,d:8},  {n:3,d:8},  {n:5,d:8},  {n:7,d:8},
    // tenths
    {n:1,d:10}, {n:3,d:10}, {n:7,d:10}, {n:9,d:10},
    // twentieths / twenty-fifths
    {n:1,d:20}, {n:3,d:20}, {n:7,d:20}, {n:9,d:20},
    {n:1,d:25}, {n:2,d:25}, {n:4,d:25},
];

const POOL_MEDIUM = [
    ...POOL_EASY,
    // thirds
    {n:1,d:3},  {n:2,d:3},
    // sixths
    {n:1,d:6},  {n:5,d:6},
    // ninths
    {n:1,d:9},  {n:2,d:9},  {n:4,d:9},  {n:5,d:9},  {n:7,d:9},  {n:8,d:9},
    // twelfths
    {n:1,d:12}, {n:5,d:12}, {n:7,d:12}, {n:11,d:12},
    // sevenths
    {n:1,d:7},  {n:2,d:7},  {n:3,d:7},  {n:4,d:7},  {n:5,d:7},
    // elevenths
    {n:1,d:11}, {n:2,d:11}, {n:3,d:11},
    // fifteenths
    {n:1,d:15}, {n:2,d:15}, {n:4,d:15}, {n:7,d:15},
];

let POOL_HARD = [];

function buildHardPool() {
    POOL_HARD = [];
    for (let d = 2; d <= 20; d++) {
        for (let n = 1; n < d; n++) {
            if (gcd(n, d) === 1) POOL_HARD.push({ n, d });
        }
    }
}

function getPool() {
    if (difficulty === 'medium') return POOL_MEDIUM;
    if (difficulty === 'hard')   return POOL_HARD;
    return POOL_EASY;
}

// ─────────────────────────────────────────────────────────────
// Initialisation
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    buildHardPool();
    setupEvents();
    setupCalculator();
    generateQuestions();
});

function setupEvents() {
    // Given-type buttons
    document.querySelectorAll('[data-given]').forEach(btn =>
        btn.addEventListener('click', function () {
            document.querySelectorAll('[data-given]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            givenType = this.dataset.given;
        })
    );

    // Difficulty buttons
    document.querySelectorAll('[data-diff]').forEach(btn =>
        btn.addEventListener('click', function () {
            document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            difficulty = this.dataset.diff;
        })
    );

    document.getElementById('generate-btn').addEventListener('click', () => {
        generateQuestions();
        resetTimer();
    });

    document.getElementById('check-btn').addEventListener('click', () => {
        checkAnswers();
        stopTimer();
    });

    document.getElementById('timer-btn').addEventListener('click', toggleTimer);
    document.getElementById('calc-clear-btn').addEventListener('click', clearCalc);
}

// ─────────────────────────────────────────────────────────────
// Calculator
// ─────────────────────────────────────────────────────────────

function setupCalculator() {
    const cNum = document.getElementById('calc-num');
    const cDen = document.getElementById('calc-den');
    const cPct = document.getElementById('calc-pct');
    const cDec = document.getElementById('calc-dec');
    let lock = false;

    const fromFrac = () => {
        if (lock) return;
        const n = parseFloat(cNum.value), d = parseFloat(cDen.value);
        if (isFinite(n) && isFinite(d) && d !== 0) {
            lock = true;
            const dec = n / d;
            cDec.value = fmtDec(dec);
            cPct.value = fmtPct(dec * 100);
            lock = false;
        }
    };

    const fromPct = () => {
        if (lock) return;
        const pct = parseFloat(cPct.value);
        if (isFinite(pct)) {
            lock = true;
            const dec = pct / 100;
            cDec.value = fmtDec(dec);
            const f = decToFrac(dec);
            if (f) { cNum.value = f.n; cDen.value = f.d; }
            lock = false;
        }
    };

    const fromDec = () => {
        if (lock) return;
        const dec = parseFloat(cDec.value);
        if (isFinite(dec)) {
            lock = true;
            cPct.value = fmtPct(dec * 100);
            const f = decToFrac(dec);
            if (f) { cNum.value = f.n; cDen.value = f.d; }
            lock = false;
        }
    };

    cNum.addEventListener('input', fromFrac);
    cDen.addEventListener('input', fromFrac);
    cPct.addEventListener('input', fromPct);
    cDec.addEventListener('input', fromDec);
}

function clearCalc() {
    ['calc-num', 'calc-den', 'calc-pct', 'calc-dec']
        .forEach(id => { document.getElementById(id).value = ''; });
}

// ─────────────────────────────────────────────────────────────
// Question Generation
// ─────────────────────────────────────────────────────────────

function generateQuestions() {
    const count   = Math.max(1, parseInt(document.getElementById('num-questions').value) || 10);
    const pool    = getPool();
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    questions = [];

    for (let i = 0; i < count; i++) {
        const f   = shuffled[i % shuffled.length];
        const dec = f.n / f.d;
        const pct = dec * 100;
        let given = givenType;
        if (given === 'random') {
            given = ['fraction', 'percent', 'decimal'][Math.floor(Math.random() * 3)];
        }
        questions.push({ n: f.n, d: f.d, dec, pct, given });
    }

    renderTable();
    hideScore();
    updateTimerBtn();
}

// ─────────────────────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────────────────────

function fracHTML(n, d) {
    return `<div class="frac-disp"><div class="fn">${n}</div><div class="fd">${d}</div></div>`;
}

function renderTable() {
    const tbody = document.getElementById('quiz-body');
    tbody.innerHTML = '';

    questions.forEach((q, i) => {
        const tr = document.createElement('tr');
        tr.dataset.index = i;

        // Row number
        const tdNum = document.createElement('td');
        tdNum.textContent = i + 1;
        tr.appendChild(tdNum);

        // ── Fraction column ──
        const tdF = document.createElement('td');
        tdF.id = `cell-frac-${i}`;
        if (q.given === 'fraction') {
            tdF.className = 'given-cell';
            tdF.innerHTML = fracHTML(q.n, q.d);
        } else {
            tdF.innerHTML = `
                <div class="frac-input-wrap">
                    <input type="number" data-type="fn" data-index="${i}" placeholder="num" autocomplete="off">
                    <span class="fi-slash">/</span>
                    <input type="number" data-type="fd" data-index="${i}" placeholder="den" autocomplete="off">
                </div>`;
        }
        tr.appendChild(tdF);

        // ── Percentage column ──
        const tdP = document.createElement('td');
        tdP.id = `cell-pct-${i}`;
        if (q.given === 'percent') {
            tdP.className = 'given-cell';
            tdP.textContent = fmtPct(q.pct) + '%';
        } else {
            tdP.innerHTML = `
                <div class="pct-input-wrap">
                    <input type="text" data-type="pct" data-index="${i}" placeholder="%" autocomplete="off">
                    <span class="pct-sym">%</span>
                </div>`;
        }
        tr.appendChild(tdP);

        // ── Decimal column ──
        const tdD = document.createElement('td');
        tdD.id = `cell-dec-${i}`;
        if (q.given === 'decimal') {
            tdD.className = 'given-cell';
            tdD.textContent = fmtDec(q.dec);
        } else {
            tdD.innerHTML = `
                <div class="dec-input-wrap">
                    <input type="text" data-type="dec" data-index="${i}" placeholder="0.000" autocomplete="off">
                </div>`;
        }
        tr.appendChild(tdD);

        // ── Result column ──
        const tdR = document.createElement('td');
        tdR.className = 'result-col';
        tdR.id = `cell-res-${i}`;
        tr.appendChild(tdR);

        tbody.appendChild(tr);
    });

    // Focus the first blank input
    const first = tbody.querySelector('input');
    if (first) first.focus();
}

// ─────────────────────────────────────────────────────────────
// Answer Checking
// ─────────────────────────────────────────────────────────────

function checkAnswers() {
    hideScore();
    let correct = 0;

    questions.forEach((q, i) => {
        let rowOk = true;

        // ── Check fraction ──
        if (q.given !== 'fraction') {
            const inpN = document.querySelector(`input[data-type="fn"][data-index="${i}"]`);
            const inpD = document.querySelector(`input[data-type="fd"][data-index="${i}"]`);
            const userN = parseInt(inpN ? inpN.value.trim() : '');
            const userD = parseInt(inpD ? inpD.value.trim() : '');
            let fracOk = false;
            if (!isNaN(userN) && !isNaN(userD) && userD !== 0) {
                const s = simplify(userN, userD);
                fracOk = (s.n === q.n && s.d === q.d);
            }
            markCell(`cell-frac-${i}`, fracOk, fracHTML(q.n, q.d));
            if (!fracOk) rowOk = false;
        }

        // ── Check percentage ──
        if (q.given !== 'percent') {
            const inp = document.querySelector(`input[data-type="pct"][data-index="${i}"]`);
            const raw = inp ? inp.value.trim() : '';
            const userPct = parseFloat(raw);
            const pctOk = raw !== '' && isFinite(userPct) &&
                Math.round(userPct * 100) === Math.round(q.pct * 100);
            markCell(`cell-pct-${i}`, pctOk, fmtPct(q.pct) + '%');
            if (!pctOk) rowOk = false;
        }

        // ── Check decimal ──
        if (q.given !== 'decimal') {
            const inp = document.querySelector(`input[data-type="dec"][data-index="${i}"]`);
            const raw = inp ? inp.value.trim() : '';
            const userDec = parseFloat(raw);
            const decOk = raw !== '' && isFinite(userDec) &&
                Math.round(userDec * 10000) === Math.round(q.dec * 10000);
            markCell(`cell-dec-${i}`, decOk, fmtDec(q.dec));
            if (!decOk) rowOk = false;
        }

        // Row result icon
        const resCell = document.getElementById(`cell-res-${i}`);
        resCell.textContent = rowOk ? '✓' : '✗';
        resCell.style.color = rowOk ? '#4caf50' : '#f44336';
        if (rowOk) correct++;
    });

    showScore(correct, questions.length);
}

/**
 * Apply correct/incorrect styling to a cell and, if wrong,
 * append a hint showing the correct answer.
 */
function markCell(cellId, ok, correctHTML) {
    const cell = document.getElementById(cellId);
    if (!cell) return;
    if (ok) {
        cell.classList.add('cell-ok');
        cell.classList.remove('cell-err');
    } else {
        cell.classList.add('cell-err');
        cell.classList.remove('cell-ok');
        const hint = document.createElement('div');
        hint.className = 'correct-hint';
        hint.innerHTML = '→ ' + correctHTML;
        cell.appendChild(hint);
    }
}

// ─────────────────────────────────────────────────────────────
// Score
// ─────────────────────────────────────────────────────────────

function showScore(correct, total) {
    const pct = Math.round((correct / total) * 100);
    document.getElementById('final-score').textContent = `${correct}/${total}`;
    document.getElementById('score-pct').textContent   = `${pct}%`;
    document.getElementById('final-time').textContent  = document.getElementById('timer').textContent;
    document.getElementById('score-display').style.display = 'block';
}

function hideScore() {
    document.getElementById('score-display').style.display = 'none';
    document.querySelectorAll('.cell-ok, .cell-err').forEach(el => {
        el.classList.remove('cell-ok', 'cell-err');
    });
    document.querySelectorAll('.correct-hint').forEach(el => el.remove());
    document.querySelectorAll('.result-col').forEach(el => { el.textContent = ''; });
}

// ─────────────────────────────────────────────────────────────
// Timer
// ─────────────────────────────────────────────────────────────

function startTimer() {
    if (isPaused) {
        startTime  = Date.now() - elapsedTime;
        isPaused   = false;
    } else {
        elapsedTime = 0;
        startTime   = Date.now();
    }
    if (!timerInterval) timerInterval = setInterval(updateTimer, 1000);
    updateTimerBtn();
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        elapsedTime   = Date.now() - startTime;
        isPaused      = true;
    }
    updateTimerBtn();
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startTime     = null;
    elapsedTime   = 0;
    isPaused      = false;
    document.getElementById('timer').textContent = '00:00';
    updateTimerBtn();
}

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const s = Math.floor(elapsed / 1000) % 60;
    const m = Math.floor(elapsed / 60000);
    document.getElementById('timer').textContent =
        `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function toggleTimer() { timerInterval ? stopTimer() : startTimer(); }

function updateTimerBtn() {
    document.getElementById('timer-btn').textContent = timerInterval ? '⏸️' : '▶️';
}
