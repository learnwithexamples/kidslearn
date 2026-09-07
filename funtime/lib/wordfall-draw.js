/* ============================================================
   wordfall-draw.js — everything you can see in Word Rain

   Black and white: the sky is empty paper, the ground is a hatched band at
   the bottom, and the words fall in between. The part of a word you have
   already typed is solid black; the rest is grey — so a half-typed word shows
   you exactly how far you have got without your eyes leaving the sky.
   ============================================================ */

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_GREY = '#b4b4b4';
const COLOR_FAINT = '#e8e8e8';

const WORD_FONT = '18px monospace';

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawFrame — the thin border round the sky. */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
}

/**
 * drawGround — the hatched band a word must not reach.
 * ALGORITHM: one thick line, then diagonal strokes below it. The hatching is
 *            what makes it read as solid ground rather than just a rule.
 */
function drawGround(ctx) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(FIELD_WIDTH, GROUND_Y);
    ctx.stroke();

    ctx.lineWidth = 1;
    for (let x = -14; x < FIELD_WIDTH; x = x + 12) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_Y + 14);
        ctx.lineTo(x + 14, GROUND_Y);
        ctx.stroke();
    }
}

/**
 * drawWord — one falling word.
 *
 * INPUT:  ctx, word, done — how many letters are already typed
 *         target — true if this is the word the next letter will go to
 *
 * ALGORITHM: draw the finished letters in black, then carry on where they
 *            ended and draw the rest in grey. A monospace font means the two
 *            halves line up exactly, with no gap to work out.
 *
 *            A word is drawn with its FEET on its y, so the moment it lands is
 *            the moment it touches the ground line.
 */
function drawWord(ctx, word, done, target) {
    const black = word.text.slice(0, done);
    const grey = word.text.slice(done);

    ctx.font = WORD_FONT;
    ctx.textAlign = 'left';

    if (target) {
        ctx.fillStyle = COLOR_FAINT;
        ctx.fillRect(word.x - 4, word.y - 16, wordWidth(word.text) + 8, 21);
    }

    ctx.fillStyle = COLOR_INK;
    ctx.fillText(black, word.x, word.y);
    ctx.fillStyle = COLOR_GREY;
    ctx.fillText(grey, word.x + ctx.measureText(black).width, word.y);

    if (target) {
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(word.x - 4, word.y + 5);
        ctx.lineTo(word.x + wordWidth(word.text) + 4, word.y + 5);
        ctx.stroke();
    }
}

/** drawWords — every word in the sky, with your progress shown on each. */
function drawWords(ctx, state) {
    const target = matchingWord(state, state.typed);

    for (let i = 0; i < state.words.length; i++) {
        const word = state.words[i];
        const matches = state.typed.length > 0 && word.text.indexOf(state.typed) === 0;
        drawWord(ctx, word, matches ? state.typed.length : 0, word === target);
    }
}

/** drawTyped — the letters you have typed, big, down on the ground. */
function drawTyped(ctx, state) {
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = state.typed.length > 0 ? COLOR_INK : COLOR_GREY;
    ctx.fillText(state.typed.length > 0 ? state.typed : 'type a word…',
                 FIELD_WIDTH / 2, FIELD_HEIGHT - 16);
    ctx.textAlign = 'left';
}

/**
 * drawLives — one square for each life left, and a hollow one for each lost.
 * ALGORITHM: draw ALL of them, filled or hollow. Showing only what is left
 *            would hide how close you are to the end.
 */
function drawLives(ctx, state) {
    for (let i = 0; i < START_LIVES; i++) {
        const x = FIELD_WIDTH - 20 - i * 16;
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, 12, 11, 11);
        if (i < state.lives) {
            ctx.fillStyle = COLOR_INK;
            ctx.fillRect(x + 2, 14, 7, 7);
        }
    }
}

/** drawLevel — which level you have reached, up in the corner. */
function drawLevel(ctx, state) {
    ctx.fillStyle = COLOR_GREY;
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('LEVEL ' + state.level, 12, 22);
}

/** drawMessage — big centred words across the sky. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    ctx.fillRect(0, height / 2 - 46, width, 92);
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, height / 2 - 46, width, 92);

    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';
    const scale = width / FIELD_WIDTH;
    const titleSize = Math.max(14, Math.round(28 * scale));
    const subtitleSize = Math.max(9, Math.round(13 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 2);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.85);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);

    drawLevel(ctx, state);
    drawLives(ctx, state);
    drawWords(ctx, state);
    drawGround(ctx);
    drawTyped(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'THE RAIN WON',
                    state.score + ' points — press ENTER to try again');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'PAUSED', 'Press ESC to carry on');
    }
}
