'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// Challenger Mental Math
// ─────────────────────────────────────────────────────────────────────────────

// ── State ─────────────────────────────────────────────────────────────────────
let equation   = null;   // { nums: number[], ops: string[], answer: number }
let stepIdx    = 0;
let stopFlag   = false;
let sessionId  = 0;      // increment to invalidate stale setTimeout callbacks
let currentCfg = { min: 1, max: 50, count: 5, interval: 1.5 };

const hasSpeech = typeof speechSynthesis !== 'undefined';

const OP_SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const OP_WORD   = { '+': 'plus', '-': 'minus', '*': 'times', '/': 'divided by' };

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (!hasSpeech) {
        document.getElementById('no-speech-warn').style.display = 'block';
    }

    document.getElementById('btn-start').addEventListener('click', handleStart);
    document.getElementById('btn-stop') .addEventListener('click', handleStop);
    document.getElementById('btn-check').addEventListener('click', checkAnswer);
    document.getElementById('btn-redo') .addEventListener('click', handleRedo);
    document.getElementById('btn-new')  .addEventListener('click', handleStart);
    document.getElementById('answer-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') checkAnswer();
    });
});

// ── Config ────────────────────────────────────────────────────────────────────
function readCfg() {
    const min      = Math.max(1,       parseInt(document.getElementById('cfg-min').value)      || 1);
    const max      = Math.max(min + 1, parseInt(document.getElementById('cfg-max').value)      || 50);
    const count    = Math.max(2, Math.min(10, parseInt(document.getElementById('cfg-count').value)   || 5));
    const interval = Math.max(0.5,     parseFloat(document.getElementById('cfg-interval').value) || 1.5);
    return { min, max, count, interval };
}

// ── Math helpers ──────────────────────────────────────────────────────────────
function randInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
 * Attempt to apply `op` to `curr` using a number in [min, max].
 * Returns { n, result } or null if not feasible.
 * All results are guaranteed to be integers.
 */
function tryOp(op, curr, min, max) {
    switch (op) {
        case '+': {
            const n = randInt(min, max);
            return { n, result: curr + n };
        }
        case '-': {
            // Keep result >= 0 to avoid negative running totals
            if (curr <= 0) return null;
            const hi = Math.min(max, curr);
            if (hi < min) return null;
            const n = randInt(min, hi);
            return { n, result: curr - n };
        }
        case '*': {
            // Cap so running total stays below 9999
            const capHi = Math.min(max, Math.floor(9999 / Math.max(1, curr)));
            if (capHi < min) return null;
            const n = randInt(min, capHi);
            return { n, result: curr * n };
        }
        case '/': {
            // Only divide when result is a whole number.
            // Avoid dividing by 1 (trivial) — require divisor >= max(2, min).
            const lo = Math.max(2, min);
            const divs = [];
            for (let d = lo; d <= Math.min(max, Math.abs(curr)); d++) {
                if (curr !== 0 && curr % d === 0) divs.push(d);
            }
            if (!divs.length) return null;
            const n = divs[Math.floor(Math.random() * divs.length)];
            return { n, result: curr / n };
        }
    }
    return null;
}

function genEquation(cfg) {
    const { min, max, count } = cfg;
    const nums = [];
    const ops  = [];
    const opPool = ['+', '-', '*', '/'];

    let curr = randInt(min, max);
    nums.push(curr);

    for (let i = 1; i < count; i++) {
        // Try each operation in random order; pick first valid one
        const shuffled = [...opPool].sort(() => Math.random() - 0.5);
        let chosen = null;

        for (const op of shuffled) {
            const r = tryOp(op, curr, min, max);
            if (r) { chosen = { op, n: r.n, result: r.result }; break; }
        }

        // Guaranteed fallback: addition always works
        if (!chosen) {
            const n = randInt(min, max);
            chosen = { op: '+', n, result: curr + n };
        }

        ops.push(chosen.op);
        nums.push(chosen.n);
        curr = chosen.result;
    }

    return { nums, ops, answer: curr };
}

// ── Board rendering ───────────────────────────────────────────────────────────
function clearBoard() {
    document.getElementById('eq-board').innerHTML = '';
}

function addStepEl(text, extraClasses) {
    const board = document.getElementById('eq-board');
    const div   = document.createElement('div');
    div.className   = `eq-step ${extraClasses}`;
    div.textContent = text;
    board.appendChild(div);
    return div;
}

function buildDots(count) {
    const container = document.getElementById('progress-dots');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const d = document.createElement('div');
        d.className = 'dot';
        d.id = `dot-${i}`;
        container.appendChild(d);
    }
}

function setDot(i, state) {
    const d = document.getElementById(`dot-${i}`);
    if (d) d.className = `dot ${state}`;
}

function setStatus(html) {
    document.getElementById('eq-status').innerHTML = html;
}

// ── Speech ────────────────────────────────────────────────────────────────────
function say(text, onDone) {
    if (!hasSpeech) {
        // No TTS: just show visually with a brief delay so the animation is visible
        setTimeout(onDone, 600);
        return;
    }
    speechSynthesis.cancel();
    const u   = new SpeechSynthesisUtterance(text);
    u.rate    = 0.92;
    u.pitch   = 1.0;
    u.onend   = onDone;
    u.onerror = onDone;
    speechSynthesis.speak(u);
}

// ── Handlers ──────────────────────────────────────────────────────────────────
function handleStart() {
    currentCfg = readCfg();
    equation   = genEquation(currentCfg);
    beginPlay();
}

function handleRedo() {
    if (!equation) return;
    currentCfg = readCfg();   // allow interval change on redo
    beginPlay();
}

function handleStop() {
    stopFlag = true;
    sessionId++;                               // invalidate all pending callbacks
    if (hasSpeech) speechSynthesis.cancel();

    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-stop') .style.display = 'none';
    setStatus('⏹ Stopped. Press <strong>Start</strong> for a new equation.');
}

// ── Play flow ─────────────────────────────────────────────────────────────────
function beginPlay() {
    stopFlag  = false;
    sessionId++;                               // invalidate any leftover callbacks
    const sid = sessionId;
    stepIdx   = 0;

    // Reset answer area
    document.getElementById('answer-section').style.display = 'none';
    document.getElementById('result-display').innerHTML     = '';
    document.getElementById('result-btns')   .style.display = 'none';
    document.getElementById('answer-input')  .value        = '';

    clearBoard();
    buildDots(equation.nums.length);

    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop') .style.display = 'inline-block';
    setStatus('<span class="speaking-pulse"></span> Listening…');

    speakStep(sid);
}

function speakStep(sid) {
    if (sid !== sessionId || stopFlag) return;

    const { nums, ops } = equation;
    const intervalMs    = currentCfg.interval * 1000;
    const isFirst       = stepIdx === 0;

    let displayText, spokenText;

    if (isFirst) {
        const n     = nums[0];
        displayText = n.toString();
        spokenText  = n.toString();
        setDot(0, 'active');
    } else {
        const op    = ops[stepIdx - 1];
        const n     = nums[stepIdx];
        displayText = `${OP_SYMBOL[op]}  ${n}`;
        spokenText  = `${OP_WORD[op]} ${n}`;
        setDot(stepIdx, 'active');
    }

    const el = addStepEl(displayText, isFirst ? 'first-num current' : 'current');

    say(spokenText, () => {
        if (sid !== sessionId) return;  // stale: a new session started

        // Demote to "past" style
        el.className = `eq-step ${isFirst ? 'first-num ' : ''}past`;
        setDot(stepIdx, 'done');
        stepIdx++;

        if (stepIdx < nums.length) {
            setTimeout(() => speakStep(sid), intervalMs);
        } else {
            setTimeout(() => finishEquation(sid), intervalMs);
        }
    });
}

function finishEquation(sid) {
    if (sid !== sessionId) return;

    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop') .style.display = 'none';
    setStatus('✅ Done — what\'s your answer?');

    say('What is the answer?', () => {});

    document.getElementById('answer-section').style.display = 'block';
    setTimeout(() => document.getElementById('answer-input').focus(), 150);
}

// ── Check answer ──────────────────────────────────────────────────────────────
function checkAnswer() {
    if (!equation) return;

    const raw = document.getElementById('answer-input').value.trim();
    if (raw === '') { document.getElementById('answer-input').focus(); return; }

    const user    = parseFloat(raw);
    const correct = equation.answer;

    if (isNaN(user)) {
        document.getElementById('answer-input').select();
        return;
    }

    const resultEl = document.getElementById('result-display');

    if (user === correct) {
        resultEl.innerHTML =
            `<div class="result-correct">🎉 Correct! The answer is <strong>${correct}</strong>.</div>`;
        say('Correct! Well done!', () => {});
    } else {
        resultEl.innerHTML = `
            <div class="result-wrong">
                ❌ Not quite!
                <div class="hint">The correct answer is <strong>${correct}</strong>.</div>
            </div>`;
        say(`Not quite. The answer is ${correct}.`, () => {});
    }

    document.getElementById('result-btns').style.display = 'flex';
}
