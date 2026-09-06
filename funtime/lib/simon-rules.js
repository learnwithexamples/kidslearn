/* ============================================================
   simon-rules.js — the rules of Simon Says

   Four pads. The game flashes a sequence, then you play it back. Every round
   the sequence grows by one, so it is really a test of your memory — and the
   flashes get quicker as you go.

   The game is always in one of three PHASES:
       'watch'  — the game is flashing the sequence at you
       'play'   — your turn to repeat it
       'over'   — you got one wrong
   ============================================================ */

const PAD_COUNT = 4;

/**
 * randomPad — pick one of the four pads.
 * INPUT: none. OUTPUT: 0, 1, 2 or 3.
 */
function randomPad() {
    return Math.floor(Math.random() * PAD_COUNT);
}

/**
 * addStep — make the sequence one longer.
 *
 * INPUT:  sequence — the pads so far
 * OUTPUT: a NEW list with one more random pad on the end
 *
 * ALGORITHM: copy the list and push a random pad onto it. The old sequence is
 *            left alone, which makes this easy to test.
 */
function addStep(sequence) {
    const longer = sequence.slice();
    longer.push(randomPad());
    return longer;
}

/**
 * isCorrectSoFar — is the player's answer still right?
 *
 * INPUT:  sequence — what the game flashed. input — what the player has pressed.
 * OUTPUT: true while every pad pressed so far matches the sequence
 *
 * ALGORITHM: the input must not be longer than the sequence, and every pad in
 *            it must match the pad at the same place. An empty input is fine —
 *            the player has not gone wrong yet.
 */
function isCorrectSoFar(sequence, input) {
    if (input.length > sequence.length) {
        return false;
    }
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== sequence[i]) {
            return false;
        }
    }
    return true;
}

/**
 * isRoundComplete — has the player repeated the whole sequence?
 * INPUT: sequence, input. OUTPUT: true when the input matches it exactly.
 * ALGORITHM: it must be right so far AND the same length.
 */
function isRoundComplete(sequence, input) {
    return isCorrectSoFar(sequence, input) && input.length === sequence.length;
}

/**
 * flashInterval — how long each flash lasts, in milliseconds.
 *
 * INPUT:  round — which round you are on (1, 2, 3, …)
 * OUTPUT: milliseconds
 *
 * ALGORITHM: 620 ms in round 1, 25 ms quicker each round, never below 260 —
 *            fast enough to be exciting, slow enough to follow.
 */
function flashInterval(round) {
    const milliseconds = 620 - (round - 1) * 25;
    if (milliseconds < 260) {
        return 260;
    }
    return milliseconds;
}

/**
 * scoreForRound — how many points is finishing a round worth?
 * INPUT: round. OUTPUT: the points to add.
 * ALGORITHM: 10 points per pad you had to remember, so later rounds pay more.
 */
function scoreForRound(round) {
    return 10 * round;
}

/** createGame — start a brand-new game, already flashing the first pad. */
function createGame() {
    return {
        sequence: addStep([]),
        input: [],
        round: 1,
        score: 0,
        phase: 'watch',
        flashIndex: 0,
        flashOn: true,
        flashTimer: 0,
        lit: -1,
        isOver: false,
        isPaused: false
    };
}

/**
 * pressPad — the player presses one pad.
 *
 * INPUT:  state — the game. pad — 0 to 3.
 * OUTPUT: true if the press counted
 *
 * ALGORITHM:
 *   1. Ignore presses unless it is the player's turn.
 *   2. Add the pad to the input and light it up.
 *   3. If the answer has gone wrong, the game is over.
 *   4. If the round is complete, score it, grow the sequence and start
 *      flashing again.
 */
function pressPad(state, pad) {
    if (state.phase !== 'play' || state.isOver || state.isPaused) {
        return false;
    }

    state.input.push(pad);
    state.lit = pad;
    state.flashTimer = 0;

    if (!isCorrectSoFar(state.sequence, state.input)) {
        state.phase = 'over';
        state.isOver = true;
        return true;
    }

    if (isRoundComplete(state.sequence, state.input)) {
        state.score = state.score + scoreForRound(state.round);
        state.round = state.round + 1;
        state.sequence = addStep(state.sequence);
        state.input = [];
        state.phase = 'watch';
        state.flashIndex = 0;
        state.flashOn = true;
        state.lit = state.sequence[0];
    }
    return true;
}

/**
 * updateGame — let time pass (called about 60 times a second).
 *
 * INPUT:  state, elapsedMs
 * OUTPUT: nothing
 *
 * ALGORITHM: while the game is flashing, count the timer up; each time it
 *            passes this round's interval, either turn the pad off (a gap) or
 *            move on to the next pad. When the last flash is done it becomes
 *            the player's turn.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }

    if (state.phase === 'watch') {
        state.flashTimer = state.flashTimer + elapsedMs;
        const interval = flashInterval(state.round);
        if (state.flashTimer >= interval) {
            state.flashTimer = 0;
            if (state.flashOn) {
                state.flashOn = false;
                state.lit = -1;
            } else {
                state.flashOn = true;
                state.flashIndex = state.flashIndex + 1;
                if (state.flashIndex >= state.sequence.length) {
                    state.phase = 'play';
                    state.lit = -1;
                } else {
                    state.lit = state.sequence[state.flashIndex];
                }
            }
        }
        if (state.phase === 'watch' && state.flashOn) {
            state.lit = state.sequence[state.flashIndex];
        }
    } else if (state.lit !== -1) {
        state.flashTimer = state.flashTimer + elapsedMs;
        if (state.flashTimer > 220) {
            state.lit = -1;
            state.flashTimer = 0;
        }
    }
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    if (!state.isOver) { state.isPaused = !state.isPaused; }
}

/**
 * actionForKey — turn a keyboard key into an action name, or null.
 * The four pads are also the keys 1, 2, 3 and 4.
 */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === '1' || k === 'q' || k === 'arrowleft') { return 'pad0'; }
    if (k === '2' || k === 'w' || k === 'arrowup') { return 'pad1'; }
    if (k === '3' || k === 'a' || k === 'arrowdown') { return 'pad2'; }
    if (k === '4' || k === 's' || k === 'arrowright') { return 'pad3'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
