'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// Challenger Mental Math
// ─────────────────────────────────────────────────────────────────────────────

// ── State ─────────────────────────────────────────────────────────────────────
let equation   = null;   // { nums: number[], ops: string[], answer: number }
let stepIdx    = 0;
let stopFlag   = false;
let sessionId  = 0;      // increment to invalidate stale setTimeout callbacks
let difficulty = 'simple';
let currentCfg = { min: 1, max: 50, count: 5, interval: 1.5 };

const hasSpeech = typeof speechSynthesis !== 'undefined';

const OP_SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const OP_WORD   = { '+': 'plus', '-': 'minus', '*': 'times', '/': 'divided by' };

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (!hasSpeech) {
        document.getElementById('no-speech-warn').style.display = 'block';
    } else {
        // Voices may already be available (Firefox) or load async (Chrome)
        loadVoices();
        speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    // Difficulty buttons
    document.querySelectorAll('[data-diff]').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            difficulty = this.dataset.diff;
            applyDifficultyPreset(difficulty);
        });
    });

    document.getElementById('btn-start').addEventListener('click', handleStart);
    document.getElementById('btn-stop') .addEventListener('click', handleStop);
    document.getElementById('btn-check').addEventListener('click', checkAnswer);
    document.getElementById('btn-redo') .addEventListener('click', handleRedo);
    document.getElementById('btn-new')  .addEventListener('click', handleStart);
    document.getElementById('answer-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') checkAnswer();
    });
});

// Preset defaults per difficulty
function applyDifficultyPreset(diff) {
    const presets = {
        simple: { min: 1, max: 20,  count: 4, interval: 2.0 },
        medium: { min: 1, max: 50,  count: 5, interval: 1.5 },
        hard:   { min: 5, max: 100, count: 6, interval: 1.0 },
    };
    const p = presets[diff];
    if (!p) return;
    document.getElementById('cfg-min').value      = p.min;
    document.getElementById('cfg-max').value      = p.max;
    document.getElementById('cfg-count').value    = p.count;
    document.getElementById('cfg-interval').value = p.interval;
}

// ── Config ────────────────────────────────────────────────────────────────────
function readCfg() {
    const min      = Math.max(1,       parseInt(document.getElementById('cfg-min').value)      || 1);
    const max      = Math.max(min + 1, parseInt(document.getElementById('cfg-max').value)      || 50);
    const count    = Math.max(2, Math.min(10, parseInt(document.getElementById('cfg-count').value)   || 5));
    const interval = Math.max(0.5,     parseFloat(document.getElementById('cfg-interval').value) || 1.5);
    return { min, max, count, interval, difficulty };
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
function tryOp(op, curr, min, max, cfg) {
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
            let capHi = Math.min(max, Math.floor(9999 / Math.max(1, curr)));
            // Simple mode: both operands must be ≤ 12 (stay in 12×12 table).
            // genEquation guarantees curr ≤ 12 before calling tryOp('*') in simple mode.
            if (cfg && cfg.difficulty === 'simple') {
                capHi = Math.min(capHi, 12);
            }
            if (capHi < min) return null;
            const n = randInt(min, capHi);
            return { n, result: curr * n };
        }
        case '/': {
            // Only divide when result is a whole number and > 1.
            // - require divisor >= max(2, min)
            // - exclude d === curr (which gives x/x = 1)
            // - prefer larger divisors: pick from the top half of valid ones
            const lo = Math.max(2, min);
            const divs = [];
            for (let d = lo; d <= Math.min(max, curr - 1); d++) {
                if (curr !== 0 && curr % d === 0) divs.push(d);
            }
            if (!divs.length) return null;
            // Bias towards larger divisors (harder division, result is smaller)
            const startIdx = Math.floor(divs.length / 2);
            const n = divs[startIdx + Math.floor(Math.random() * (divs.length - startIdx))];
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
        let chosen  = null;
        let preStep = null; // optional extra step inserted before chosen

        for (const op of shuffled) {
            // Simple mode: if curr > 12 and we want ×, first subtract to bring curr ≤ 12
            if (op === '*' && cfg.difficulty === 'simple' && curr > 12) {
                const target = randInt(Math.max(min, 1), 12);
                const subN   = curr - target;
                if (subN >= 1) {
                    const r = tryOp('*', target, min, max, cfg);
                    if (r) {
                        preStep = { op: '-', n: subN, tempCurr: target };
                        chosen  = { op: '*', n: r.n, result: r.result };
                        break;
                    }
                }
                continue; // couldn't set up ×, try next op
            }
            const r = tryOp(op, curr, min, max, cfg);
            if (r) { chosen = { op, n: r.n, result: r.result }; break; }
        }

        // Guaranteed fallback: addition always works
        if (!chosen) {
            const n = randInt(min, max);
            chosen = { op: '+', n, result: curr + n };
        }

        // Insert the pre-subtraction step if one was generated
        if (preStep) {
            ops.push(preStep.op);
            nums.push(preStep.n);
            curr = preStep.tempCurr;
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

// ── Board show/hide ───────────────────────────────────────────────────────────
function toggleBoard() {
    const wrap = document.getElementById('board-collapsible');
    const btn  = document.getElementById('btn-toggle-board');
    const hidden = wrap.classList.toggle('hidden');
    btn.textContent = hidden ? '👁️ Show' : '👁️ Hide';
}

// ── Speech engine ─────────────────────────────────────────────────────────────

let selectedVoice   = null;
let keepAliveTimer  = null;

/**
 * Voice quality priority list (tested highest → lowest quality).
 * Prefers Google Neural / Apple Enhanced / Microsoft Neural over default TTS.
 */
const VOICE_PRIORITY = [
    v => v.name === 'Google US English',
    v => v.name === 'Samantha',                                 // macOS default, excellent
    v => v.name === 'Alex',                                     // macOS
    v => /enhanced/i.test(v.name) && /en.US/i.test(v.lang),
    v => /premium/i.test(v.name)  && /en.US/i.test(v.lang),
    v => /enhanced/i.test(v.name) && /en/i.test(v.lang),
    v => /premium/i.test(v.name)  && /en/i.test(v.lang),
    v => /google/i.test(v.name)   && /en.US/i.test(v.lang),
    v => /google/i.test(v.name)   && /en/i.test(v.lang),
    v => /microsoft/i.test(v.name)&& /en.US/i.test(v.lang),
    v => /en.US/i.test(v.lang),
    v => /en/i.test(v.lang),
];

function loadVoices() {
    if (!hasSpeech) return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;

    // Auto-select best voice
    if (!selectedVoice) {
        for (const test of VOICE_PRIORITY) {
            const found = voices.find(test);
            if (found) { selectedVoice = found; break; }
        }
    }

    // Populate the selector
    const sel = document.getElementById('voice-select');
    sel.innerHTML = '';
    voices
        .filter(v => /en/i.test(v.lang))    // English voices only
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(v => {
            const opt  = document.createElement('option');
            opt.value  = v.name;
            opt.text   = `${v.name} (${v.lang})`;
            if (selectedVoice && v.name === selectedVoice.name) opt.selected = true;
            sel.appendChild(opt);
        });

    sel.addEventListener('change', () => {
        selectedVoice = speechSynthesis.getVoices().find(v => v.name === sel.value) || null;
    });
}

// Chrome stops TTS after ~15s unless we tickle it.
function startKeepAlive() {
    stopKeepAlive();
    keepAliveTimer = setInterval(() => {
        if (hasSpeech && !speechSynthesis.speaking) return;
        // Pause + resume to prevent Chrome's 15-second cut-off
        speechSynthesis.pause();
        speechSynthesis.resume();
    }, 12000);
}
function stopKeepAlive() {
    if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
}

/**
 * Speak `text` and call `onDone` when finished.
 * Does NOT cancel previous speech — call cancelSpeech() explicitly when needed.
 */
function say(text, onDone) {
    if (!hasSpeech) { setTimeout(onDone, 500); return; }

    const rate = Math.max(0.5, Math.min(1.5, parseFloat(document.getElementById('cfg-rate').value) || 0.85));

    const u   = new SpeechSynthesisUtterance(text);
    u.rate    = rate;
    u.pitch   = 1.0;
    u.volume  = 1.0;
    if (selectedVoice) u.voice = selectedVoice;

    u.onend   = () => { if (onDone) onDone(); };
    u.onerror = (e) => {
        // 'interrupted' fires when we cancel deliberately — don't call onDone
        if (e.error !== 'interrupted' && e.error !== 'canceled') { if (onDone) onDone(); }
    };

    speechSynthesis.speak(u);
}

function cancelSpeech() {
    if (hasSpeech) speechSynthesis.cancel();
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
    cancelSpeech();
    stopKeepAlive();

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

    cancelSpeech();
    startKeepAlive();

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
    stopKeepAlive();    document.getElementById('btn-start').style.display = 'none';
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
