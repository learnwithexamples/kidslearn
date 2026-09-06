/* ============================================================
   reaction-draw.js — everything you can see in Reaction Test

   Black and white, and the whole screen IS the signal: hatched means wait,
   solid black means GO. You cannot mistake one for the other out of the
   corner of your eye, which is exactly what this game needs.
   ============================================================ */

const FIELD_WIDTH = 320;
const FIELD_HEIGHT = 300;

const PANEL_TOP = 40;
const PANEL_HEIGHT = 150;

const COLOR_INK = '#111111';
const COLOR_PAPER = '#ffffff';
const COLOR_FAINT = '#cfcfcf';

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
 * panelWords — what the big panel should say, and how it should look.
 *
 * INPUT:  state
 * OUTPUT: { title, subtitle, solid }
 *
 * ALGORITHM: one branch per phase. Keeping the words in their own function
 *            means the drawing below never has to know the rules.
 */
function panelWords(state) {
    if (state.phase === 'ready') {
        return { title: 'READY?', subtitle: 'press SPACE to begin', solid: false };
    }
    if (state.phase === 'waiting') {
        return { title: 'WAIT…', subtitle: 'do NOT press yet', solid: false };
    }
    if (state.phase === 'go') {
        return { title: 'PRESS!', subtitle: 'now now now', solid: true };
    }
    if (state.phase === 'toosoon') {
        return { title: 'TOO SOON', subtitle: 'press SPACE to try again', solid: false };
    }
    return {
        title: state.lastTime + ' ms',
        subtitle: rating(state.lastTime) + ' — press SPACE to go again',
        solid: false
    };
}

/** drawHatching — the diagonal lines that mean "not yet". */
function drawHatching(ctx) {
    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 2;
    for (let x = -PANEL_HEIGHT; x < FIELD_WIDTH; x += 12) {
        ctx.beginPath();
        ctx.moveTo(16 + x, PANEL_TOP + PANEL_HEIGHT);
        ctx.lineTo(16 + x + PANEL_HEIGHT, PANEL_TOP);
        ctx.stroke();
    }
}

/** drawPanel — the big signal square. */
function drawPanel(ctx, state) {
    const look = panelWords(state);
    const left = 16;
    const width = FIELD_WIDTH - 32;

    ctx.save();
    ctx.beginPath();
    ctx.rect(left, PANEL_TOP, width, PANEL_HEIGHT);
    ctx.clip();

    if (look.solid) {
        ctx.fillStyle = COLOR_INK;
        ctx.fillRect(left, PANEL_TOP, width, PANEL_HEIGHT);
    } else {
        ctx.fillStyle = COLOR_PAPER;
        ctx.fillRect(left, PANEL_TOP, width, PANEL_HEIGHT);
        if (state.phase === 'waiting') {
            drawHatching(ctx);
        }
    }
    ctx.restore();

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(left, PANEL_TOP, width, PANEL_HEIGHT);

    ctx.fillStyle = look.solid ? COLOR_PAPER : COLOR_INK;
    ctx.textAlign = 'center';
    ctx.font = 'bold 34px monospace';
    ctx.fillText(look.title, FIELD_WIDTH / 2, PANEL_TOP + 82);
    ctx.font = '13px monospace';
    ctx.fillText(look.subtitle, FIELD_WIDTH / 2, PANEL_TOP + 112);
    ctx.textAlign = 'left';
}

/**
 * drawHistory — a little bar chart of the recent goes.
 * ALGORITHM: every bar is drawn against the slowest go so far, so the chart
 *            always fills its space whatever the times happen to be.
 */
function drawHistory(ctx, state) {
    const left = 16;
    const bottom = 268;
    const height = 52;
    const width = FIELD_WIDTH - 32;

    ctx.strokeStyle = COLOR_FAINT;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(left + width, bottom);
    ctx.stroke();

    if (state.times.length === 0) {
        ctx.fillStyle = COLOR_FAINT;
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('your last eight goes will appear here', FIELD_WIDTH / 2, bottom - 18);
        ctx.textAlign = 'left';
        return;
    }

    let slowest = state.times[0];
    for (let i = 1; i < state.times.length; i++) {
        if (state.times[i] > slowest) { slowest = state.times[i]; }
    }

    const barWidth = width / HISTORY_LENGTH;
    for (let i = 0; i < state.times.length; i++) {
        const tall = Math.max(4, height * state.times[i] / slowest);
        ctx.fillStyle = state.times[i] === bestTime(state) ? COLOR_INK : COLOR_FAINT;
        ctx.fillRect(left + i * barWidth + 3, bottom - tall, barWidth - 6, tall);
    }

    ctx.fillStyle = COLOR_INK;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < state.times.length; i++) {
        ctx.fillText(String(state.times[i]), left + i * barWidth + barWidth / 2, bottom + 12);
    }
    ctx.textAlign = 'left';
}

/** drawStats — the line of numbers under the panel. */
function drawStats(ctx, state) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('best ' + (bestTime(state) || '—') + '   •   average ' +
                 (averageTime(state) || '—') + '   •   ' + state.attempts + ' goes',
                 FIELD_WIDTH / 2, 210);
    ctx.textAlign = 'left';
}

/** drawTitle — a line of instructions across the top. */
function drawTitle(ctx, state) {
    ctx.fillStyle = COLOR_FAINT;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.falseStarts > 0 ? state.falseStarts + ' false start(s)' : 'wait for the black',
                 FIELD_WIDTH / 2, 24);
    ctx.textAlign = 'left';
}

/** renderGame — draw one complete frame. */
function renderGame(ctx, state) {
    clearCanvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER);

    drawTitle(ctx, state);
    drawPanel(ctx, state);
    drawStats(ctx, state);
    drawHistory(ctx, state);
    drawFrame(ctx, FIELD_WIDTH, FIELD_HEIGHT);

    if (state.isPaused) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
        ctx.fillRect(0, 120, FIELD_WIDTH, 60);
        ctx.fillStyle = COLOR_INK;
        ctx.font = 'bold 26px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', FIELD_WIDTH / 2, 158);
        ctx.textAlign = 'left';
    }
}
