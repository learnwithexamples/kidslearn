/* ============================================================
   typing-draw.js — everything you can see in Typing Race

   Black and white: words you have finished go grey, the word you are on gets
   a box round it, and what you have typed is shown underneath — correct so
   far in solid black, and struck through the moment it goes wrong.
   ============================================================ */

const FIELD_WIDTH = 340;
const FIELD_HEIGHT = 250;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_DONE = '#c4c4c4';
const COLOR_FAINT = '#e4e4e4';

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
 * layoutWords — work out where each word goes, wrapping onto new lines.
 *
 * INPUT:  ctx (for measuring), words, startIndex — the first word to show
 * OUTPUT: a list of { word, index, x, y, width }
 *
 * ALGORITHM: put words along a line until the next one would not fit, then
 *            start a new line. Three lines is all that fits on the page, so
 *            the list starts from the word being typed and looks forward.
 */
function layoutWords(ctx, words, startIndex) {
    const laid = [];
    const left = 16;
    const right = FIELD_WIDTH - 16;
    let x = left;
    let y = 44;

    ctx.font = '17px monospace';
    for (let i = startIndex; i < words.length; i++) {
        const width = ctx.measureText(words[i]).width;
        if (x + width > right) {
            x = left;
            y = y + 26;
            if (y > 96) {
                break;
            }
        }
        laid.push({ word: words[i], index: i, x: x, y: y, width: width });
        x = x + width + 10;
    }
    return laid;
}

/** drawWords — the line of words, with the current one boxed. */
function drawWords(ctx, state) {
    const laid = layoutWords(ctx, state.words, state.index);

    ctx.font = '17px monospace';
    ctx.textAlign = 'left';
    for (let i = 0; i < laid.length; i++) {
        const item = laid[i];
        if (item.index === state.index) {
            ctx.fillStyle = COLOR_FAINT;
            ctx.fillRect(item.x - 4, item.y - 15, item.width + 8, 21);
            ctx.strokeStyle = COLOR_INK;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(item.x - 4, item.y - 15, item.width + 8, 21);
            ctx.fillStyle = COLOR_INK;
        } else {
            ctx.fillStyle = COLOR_DONE;
        }
        ctx.fillText(item.word, item.x, item.y);
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
    const y = 150;

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
    ctx.strokeRect(16, 178, width, 14);
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(18, 180, (width - 4) * fraction, 10);
}

/** drawStats — the numbers along the bottom. */
function drawStats(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(wordsPerMinute(state) + ' WPM   •   ' + accuracy(state) + '% right   •   ' +
                 Math.ceil(timeLeft(state)) + 's left',
                 FIELD_WIDTH / 2, 214);
    ctx.font = '11px monospace';
    ctx.fillStyle = COLOR_DONE;
    ctx.fillText(state.correct + ' of ' + state.words.length + ' words',
                 FIELD_WIDTH / 2, 232);
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
