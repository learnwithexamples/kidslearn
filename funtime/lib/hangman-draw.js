/* ============================================================
   hangman-draw.js — everything you can see in Hangman

   Black and white throughout, which suits this game perfectly: it is a pencil
   drawing that grows one line at a time.
   ============================================================ */

const FIELD_WIDTH = 320;
const FIELD_HEIGHT = 330;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#c8c8c8';

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

/** drawGallows — the frame the poor fellow hangs from. */
function drawGallows(ctx) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(30, 190);       /* the base */
    ctx.lineTo(110, 190);
    ctx.moveTo(60, 190);       /* the post */
    ctx.lineTo(60, 30);
    ctx.moveTo(60, 30);        /* the beam */
    ctx.lineTo(140, 30);
    ctx.moveTo(140, 30);       /* the rope */
    ctx.lineTo(140, 50);
    ctx.stroke();
    ctx.lineCap = 'butt';
}

/**
 * drawParts — the drawing grows with every wrong guess.
 * INPUT: ctx, wrong — how many mistakes have been made.
 * ALGORITHM: six pieces, one per life. Each `if` adds the next one, so the
 *            whole picture is just six ifs stacked up.
 */
function drawParts(ctx, wrong) {
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    if (wrong >= 1) {                       /* head */
        ctx.beginPath();
        ctx.arc(140, 66, 16, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (wrong >= 2) {                       /* body */
        ctx.beginPath();
        ctx.moveTo(140, 82);
        ctx.lineTo(140, 132);
        ctx.stroke();
    }
    if (wrong >= 3) {                       /* left arm */
        ctx.beginPath();
        ctx.moveTo(140, 95);
        ctx.lineTo(118, 115);
        ctx.stroke();
    }
    if (wrong >= 4) {                       /* right arm */
        ctx.beginPath();
        ctx.moveTo(140, 95);
        ctx.lineTo(162, 115);
        ctx.stroke();
    }
    if (wrong >= 5) {                       /* left leg */
        ctx.beginPath();
        ctx.moveTo(140, 132);
        ctx.lineTo(122, 165);
        ctx.stroke();
    }
    if (wrong >= 6) {                       /* right leg, and a sad face */
        ctx.beginPath();
        ctx.moveTo(140, 132);
        ctx.lineTo(158, 165);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(134, 62);
        ctx.lineTo(138, 66);
        ctx.moveTo(138, 62);
        ctx.lineTo(134, 66);
        ctx.moveTo(142, 62);
        ctx.lineTo(146, 66);
        ctx.moveTo(146, 62);
        ctx.lineTo(142, 66);
        ctx.moveTo(133, 76);
        ctx.quadraticCurveTo(140, 69, 147, 76);
        ctx.stroke();
    }
    ctx.lineCap = 'butt';
}

/** drawLives — a row of small marks, crossed off as they are used. */
function drawLives(ctx, state) {
    const used = wrongCount(state);
    for (let i = 0; i < MAX_WRONG; i++) {
        const x = 210 + (i % 3) * 30;
        const y = 60 + Math.floor(i / 3) * 30;
        ctx.strokeStyle = i < used ? COLOR_FAINT : COLOR_INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 20, 20);
        if (i < used) {
            ctx.beginPath();
            ctx.moveTo(x + 4, y + 4);
            ctx.lineTo(x + 16, y + 16);
            ctx.moveTo(x + 16, y + 4);
            ctx.lineTo(x + 4, y + 16);
            ctx.stroke();
        }
    }
    ctx.fillStyle = COLOR_INK;
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('LIVES', 210, 48);
}

/** drawWord — the masked word, big, across the bottom. */
function drawWord(ctx, state) {
    const text = maskedWord(state.word, state.guessed);
    const size = text.length > 24 ? 18 : 24;

    ctx.fillStyle = COLOR_INK;
    ctx.font = 'bold ' + size + 'px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, FIELD_WIDTH / 2, 232);
    ctx.textAlign = 'left';
}

/** drawWrong — the letters that were not in the word. */
function drawWrong(ctx, state) {
    const wrong = wrongLetters(state);
    ctx.fillStyle = COLOR_INK;
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('WRONG:  ' + (wrong === '' ? '—' : wrong.split('').join(' ')),
                 FIELD_WIDTH / 2, 262);
    ctx.textAlign = 'left';
}

/**
 * drawAlphabet — every letter, with the used ones faded out.
 * ALGORITHM: two rows of thirteen. A letter you have already tried is drawn
 *            grey, so you can see at a glance what is left.
 */
function drawAlphabet(ctx, state) {
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < LETTERS.length; i++) {
        const letter = LETTERS.charAt(i);
        const x = 22 + (i % 13) * 22;
        const y = 292 + Math.floor(i / 13) * 22;
        ctx.fillStyle = state.guessed.indexOf(letter) === -1 ? COLOR_INK : COLOR_FAINT;
        ctx.fillText(letter, x, y);
    }
    ctx.textAlign = 'left';
}

/** letterAtPixel — which letter of the alphabet row was clicked? */
function letterAtPixel(x, y) {
    for (let i = 0; i < LETTERS.length; i++) {
        const letterX = 22 + (i % 13) * 22;
        const letterY = 292 + Math.floor(i / 13) * 22;
        if (Math.abs(x - letterX) < 11 && y > letterY - 14 && y < letterY + 6) {
            return LETTERS.charAt(i);
        }
    }
    return null;
}

/** drawMessage — big centred words across the page. */
function drawMessage(ctx, width, height, title, subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    ctx.fillRect(0, 100, width, 76);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';

    const scale = width / FIELD_WIDTH;
    const titleSize = Math.max(14, Math.round(26 * scale));
    const subtitleSize = Math.max(9, Math.round(13 * scale));

    ctx.font = 'bold ' + titleSize + 'px monospace';
    ctx.fillText(title, width / 2, 136);
    ctx.font = subtitleSize + 'px monospace';
    ctx.fillText(subtitle, width / 2, 136 + titleSize * 0.8);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);

    drawGallows(ctx);
    drawParts(ctx, wrongCount(state));
    drawLives(ctx, state);
    drawWord(ctx, state);
    drawWrong(ctx, state);
    drawAlphabet(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isWon) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'YOU GOT IT!', 'Press ENTER for a new word');
    } else if (state.isOver) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'IT WAS ' + state.word, 'Press ENTER to try again');
    } else if (state.isPaused) {
        drawMessage(ctx, FIELD_WIDTH, FIELD_HEIGHT, 'PAUSED', 'Press ESC to carry on');
    }
}
