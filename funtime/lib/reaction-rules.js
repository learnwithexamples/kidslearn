/* ============================================================
   reaction-rules.js — the rules of Reaction Test

   Wait for the signal, then press as fast as you can. Press too early and it
   does not count.

   This is the smallest game in the collection, and it is built entirely out
   of one idea: a PHASE. The game is always in exactly one of five states, and
   every rule begins by asking which.

       ready    — press to begin
       waiting  — the signal has not come yet. DO NOT PRESS.
       go       — press NOW
       result   — here is how fast you were
       toosoon  — you jumped the gun
   ============================================================ */

const SHORTEST_WAIT = 1500;     /* milliseconds */
const LONGEST_WAIT = 4500;
const HISTORY_LENGTH = 8;

/**
 * randomDelay — how long to wait before the signal.
 *
 * INPUT:  nothing
 * OUTPUT: milliseconds, somewhere between the shortest and longest wait
 *
 * ALGORITHM: a random amount between the two. It has to be random, or after
 *            three goes the player would simply learn the rhythm and press on
 *            the beat without ever looking.
 */
function randomDelay() {
    return SHORTEST_WAIT + Math.random() * (LONGEST_WAIT - SHORTEST_WAIT);
}

/**
 * rating — a friendly word for how fast that was.
 * INPUT: milliseconds. OUTPUT: a short description.
 * ALGORITHM: bands, from fastest to slowest. The order matters: the first one
 *            that matches wins, so they must go quickest first.
 */
function rating(milliseconds) {
    if (milliseconds < 200) { return 'lightning!'; }
    if (milliseconds < 250) { return 'very quick'; }
    if (milliseconds < 320) { return 'quick'; }
    if (milliseconds < 400) { return 'not bad'; }
    if (milliseconds < 550) { return 'a bit slow'; }
    return 'were you asleep?';
}

/**
 * averageTime — the average of the recent goes.
 *
 * INPUT:  state
 * OUTPUT: the average in milliseconds, or 0 if there are none yet
 *
 * ALGORITHM: add the times up and divide by how many there are — but check
 *            for an empty list FIRST, or you are dividing by zero.
 */
function averageTime(state) {
    if (state.times.length === 0) {
        return 0;
    }
    let total = 0;
    for (let i = 0; i < state.times.length; i++) {
        total = total + state.times[i];
    }
    return Math.round(total / state.times.length);
}

/** bestTime — the fastest go so far, or 0 if there are none. */
function bestTime(state) {
    if (state.times.length === 0) {
        return 0;
    }
    let best = state.times[0];
    for (let i = 1; i < state.times.length; i++) {
        if (state.times[i] < best) { best = state.times[i]; }
    }
    return best;
}

/** startWaiting — arm the test and pick a fresh delay. */
function startWaiting(state) {
    state.phase = 'waiting';
    state.waitFor = randomDelay();
    state.elapsed = 0;
    state.lastTime = 0;
}

/**
 * press — the only thing the player can do.
 *
 * INPUT:  state
 * OUTPUT: the phase the game has moved into
 *
 * ALGORITHM: what a press means depends entirely on the phase.
 *   ready    → start waiting
 *   waiting  → too soon! this does not count
 *   go       → stop the clock, remember the time, show the result
 *   anything else → go again
 */
function press(state) {
    if (state.isPaused) {
        return state.phase;
    }

    if (state.phase === 'ready') {
        startWaiting(state);
    } else if (state.phase === 'waiting') {
        state.phase = 'toosoon';
        state.falseStarts = state.falseStarts + 1;
    } else if (state.phase === 'go') {
        state.lastTime = Math.round(state.elapsed);
        state.times.push(state.lastTime);
        if (state.times.length > HISTORY_LENGTH) {
            state.times.shift();
        }
        state.attempts = state.attempts + 1;
        state.phase = 'result';
    } else {
        startWaiting(state);
    }
    return state.phase;
}

/**
 * updateGame — the clock, which does two quite different jobs.
 *
 * INPUT:  state, elapsedMs
 * OUTPUT: nothing
 *
 * ALGORITHM: while waiting, count up to the delay and then give the signal —
 *            resetting the clock so it can start timing the player. Once on
 *            'go', the same clock is measuring how long they are taking.
 */
function updateGame(state, elapsedMs) {
    if (state.isPaused) {
        return;
    }

    if (state.phase === 'waiting') {
        state.elapsed = state.elapsed + elapsedMs;
        if (state.elapsed >= state.waitFor) {
            state.phase = 'go';
            state.elapsed = 0;
        }
    } else if (state.phase === 'go') {
        state.elapsed = state.elapsed + elapsedMs;
    }
}

/** createGame — start a brand-new game. */
function createGame() {
    return {
        phase: 'ready',
        waitFor: 0,
        elapsed: 0,
        lastTime: 0,
        times: [],
        attempts: 0,
        falseStarts: 0,
        isPaused: false
    };
}

/** newGame — clear the scores and start again. */
function newGame(state) {
    const fresh = createGame();
    state.phase = fresh.phase;
    state.waitFor = 0;
    state.elapsed = 0;
    state.lastTime = 0;
    state.times = [];
    state.attempts = 0;
    state.falseStarts = 0;
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    state.isPaused = !state.isPaused;
}

/** actionForKey — turn a keyboard key into an action name, or null. */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'press'; }
    if (k === 'r') { return 'new'; }
    if (k === 'p') { return 'pause'; }

    return null;
}
