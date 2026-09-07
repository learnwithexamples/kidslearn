/* ============================================================
   typing-draw.js — everything you can see in Typing Race

   Black and white: the word you are on is black and underlined, every other
   word is grey, and a word you got wrong is grey with a line through it.
   Nothing is ever taken away — see drawWords for why that matters.
   ============================================================ */

const FIELD_WIDTH = 340;
const FIELD_HEIGHT = 278;

/* The whole race is on the page at once, so the words need room: 24 of them
   wrap onto five lines at this size, worst case. */
const WORD_FONT = '15px monospace';
const WORD_LEFT = 16;
const WORD_TOP = 46;
const WORD_LINE = 24;
const WORD_GAP = 10;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_DONE = '#c4c4c4';

/** clearCanvas — paint the whole canvas one flat colour. */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/** drawFrame — the thin border round the page. */
function drawFrame(ctx, width, height) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
}

/**
 * layoutWords — work out where every word goes, wrapping onto new lines.
 *
 * INPUT:  ctx (for measuring), words — ALL of them
 * OUTPUT: a list of { word, index, x, y, width }
 *
 * ALGORITHM: put words along a line until the next one would not fit, then
 *            start a new line.
 *
 * WHY it lays out the whole race, every frame: the answer then never changes
 *      while you type. Laying out from the word you are ON would shuffle
 *      every remaining word one place along each time you pressed space, and
 *      text that jumps about is horrible to read from.
 */
function layoutWords(ctx, words) {
    const laid = [];
    const right = FIELD_WIDTH - WORD_LEFT;
    let x = WORD_LEFT;
    let y = WORD_TOP;

    ctx.font = WORD_FONT;
    for (let i = 0; i < words.length; i++) {
        const width = ctx.measureText(words[i]).width;
        /* the x > WORD_LEFT part stops a word too long for one line looping */
        if (x > WORD_LEFT && x + width > right) {
            x = WORD_LEFT;
            y = y + WORD_LINE;
        }
        laid.push({ word: words[i], index: i, x: x, y: y, width: width });
        x = x + width + WORD_GAP;
    }
    return laid;
}

/** drawLineThrough — a rule across a word, at a given height. */
function drawLineThrough(ctx, item, offset, color, thickness) {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(item.x, item.y + offset);
    ctx.lineTo(item.x + item.width, item.y + offset);
    ctx.stroke();
}

/**
 * drawWords — every word of the race, all the time.
 *
 * ALGORITHM: one rule per word, from how far the race has got:
 *              • the word being typed — BLACK, with a line under it
 *              • a word typed wrongly — grey, with a line through it
 *              • everything else      — grey
 *
 *            Words already done and words still to come look the same, and
 *            that is on purpose: the only thing worth your eye is where you
 *            are now.
 */
function drawWords(ctx, state) {
    const laid = layoutWords(ctx, state.words);
    const results = state.results || [];

    ctx.font = WORD_FONT;
    ctx.textAlign = 'left';

    for (let i = 0; i < laid.length; i++) {
        const item = laid[i];
        const current = item.index === state.index;

        ctx.fillStyle = current ? COLOR_INK : COLOR_DONE;
        ctx.fillText(item.word, item.x, item.y);

        if (current) {
            drawLineThrough(ctx, item, 4, COLOR_INK, 2);
        } else if (results[item.index] === false) {
            drawLineThrough(ctx, item, -5, COLOR_DONE, 1.5);
        }
    }
}

/**
 * drawTyped — what the player has typed, big.
 * ALGORITHM: the part that still matches the word is drawn solid; anything
 *            after the first mistake is struck through, so a wrong letter is
 *            obvious without stopping to read.
 */
function drawTyped(ctx, state) {
    const word = currentWord(state);
    const good = matchingLetters(word, state.typed);
    const rightPart = state.typed.slice(0, good);
    const wrongPart = state.typed.slice(good);

    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'left';

    const totalWidth = ctx.measureText(state.typed).width;
    let x = FIELD_WIDTH / 2 - totalWidth / 2;
    const y = 190;

    ctx.fillStyle = COLOR_INK;
    ctx.fillText(rightPart, x, y);
    const rightWidth = ctx.measureText(rightPart).width;
    x = x + rightWidth;

    if (wrongPart.length > 0) {
        ctx.fillStyle = COLOR_INK;
        ctx.fillText(wrongPart, x, y);
        const wrongWidth = ctx.measureText(wrongPart).width;
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOR_INK;
        ctx.beginPath();
        ctx.moveTo(x, y - 9);
        ctx.lineTo(x + wrongWidth, y - 9);
        ctx.stroke();
    }

    /* the cursor */
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(x + ctx.measureText(wrongPart).width + 2, y - 20, 2, 24);
}

/** drawTimeBar — how much of the minute is left. */
function drawTimeBar(ctx, state) {
    const fraction = timeLeft(state) / SECONDS_PER_RACE;
    const width = FIELD_WIDTH - 32;

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 208, width, 14);
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(18, 210, (width - 4) * fraction, 10);
}

/** drawStats — the numbers along the bottom. */
function drawStats(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(wordsPerMinute(state) + ' WPM   •   ' + accuracy(state) + '% right   •   ' +
                 Math.ceil(timeLeft(state)) + 's left',
                 FIELD_WIDTH / 2, 244);
    ctx.font = '11px monospace';
    ctx.fillStyle = COLOR_DONE;
    ctx.fillText(state.correct + ' of ' + state.words.length + ' words',
                 FIELD_WIDTH / 2, 262);
    ctx.textAlign = 'left';
}

/** drawTitle — a line of instructions across the top. */
function drawTitle(ctx, state) {
    ctx.fillStyle = COLOR_DONE;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.hasStarted ? 'SPACE after each word' : 'just start typing…',
                 FIELD_WIDTH / 2, 22);
    ctx.textAlign = 'left';
}

/** drawMessage — big centred words across the page. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    ctx.fillRect(0, height / 2 - 44, width, 88);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / FIELD_WIDTH;
    const titleSize = Math.max(14, Math.round(28 * scale));
    const subtitleSize = Math.max(9, Math.round(13 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, height / 2 - 2);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, height / 2 + titleSize * 0.8);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);

    drawTitle(ctx, state);
    drawWords(ctx, state);
    drawTyped(ctx, state);
    drawTimeBar(ctx, state);
    drawStats(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT,
                    wordsPerMinute(state) + ' WPM',
                    accuracy(state) + '% right — press ENTER to race again');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'PAUSED', 'Press ESC to carry on');
    }
}
