/* Run the whole tetris game (all six files) against a fake browser. */
const fs = require('fs'), vm = require('vm');
const LIB = require('path').join(__dirname, '..', 'lib') + require('path').sep;

const drawCalls = { fillRect: 0, strokeRect: 0, fillText: 0, stroke: 0 };
function fakeContext() {
    return {
        set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set font(v) {}, set textAlign(v) {},
        fillRect: () => drawCalls.fillRect++, strokeRect: () => drawCalls.strokeRect++,
        fillText: () => drawCalls.fillText++, beginPath() {}, moveTo() {}, lineTo() {},
        stroke: () => drawCalls.stroke++, save() {}, restore() {}, translate() {}
    };
}

const listeners = {};
const elements = {};
function makeElement(id) {
    return { id, textContent: '', width: 0, height: 0, getContext: () => fakeContext(), addEventListener: () => {} };
}
['tetris-board', 'tetris-next', 'score', 'lines', 'level', 'pause-btn', 'restart-btn',
 'btn-left', 'btn-right', 'btn-down', 'btn-rotate', 'btn-drop'].forEach(id => { elements[id] = makeElement(id); });

let frameCallback = null;
const sandbox = {
    Math, console, JSON,
    document: {
        getElementById: (id) => elements[id] || null,
        addEventListener: (type, fn) => { listeners[type] = fn; }
    },
    window: { requestAnimationFrame: (fn) => { frameCallback = fn; } }
};
const ctx = vm.createContext(sandbox);
['tetris-shapes.js', 'tetris-board.js', 'tetris-game.js', 'tetris-draw.js',
 'tetris-input.js', 'tetris-main.js'].forEach(f =>
    vm.runInContext(fs.readFileSync(LIB + f, 'utf8'), ctx, { filename: f }));

let failures = 0;
const check = (name, ok, extra) => {
    if (ok) console.log('  ok   ' + name);
    else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : '')); }
};
const get = (expr) => vm.runInContext(expr, ctx);
const press = (key) => listeners['keydown']({ key, preventDefault: () => {} });
const release = (key) => listeners['keyup']({ key });

listeners['DOMContentLoaded']();

check('canvas sized from the board', elements['tetris-board'].width === 300 && elements['tetris-board'].height === 600,
      [elements['tetris-board'].width, elements['tetris-board'].height]);
check('scoreboard filled in', elements['score'].textContent === 0 && elements['level'].textContent === 1);
check('game starts paused with a Play button', elements['pause-btn'].textContent === '▶ Play');
check('first frame was drawn', drawCalls.fillRect > 0 && drawCalls.strokeRect > 0);
check('a message is shown while paused', drawCalls.fillText === 2, drawCalls.fillText);
check('the loop asked for the next frame', typeof frameCallback === 'function');

press('p');
check('P unpauses and the button flips', elements['pause-btn'].textContent === '⏸ Pause');

const xBefore = get('game.piece.x');
press('ArrowLeft'); release('ArrowLeft');
check('ArrowLeft moves the piece left', get('game.piece.x') === xBefore - 1);
press('ArrowRight'); release('ArrowRight');
check('ArrowRight moves it back', get('game.piece.x') === xBefore);

const cellsBefore = JSON.stringify(get('game.piece.cells'));
press('ArrowUp'); release('ArrowUp');
check('ArrowUp rotates the piece',
      JSON.stringify(get('game.piece.cells')) !== cellsBefore || get('game.piece.type') === 'O');

press(' ');
check('space hard-drops and locks a piece', get('game.board.flat().filter(v => v === 1).length') === 4);
check('hard drop scored points', get('game.score') > 0);

let time = 0;
for (let i = 0; i < 200; i++) { time += 16; const fn = frameCallback; frameCallback = null; fn(time); }
check('game survives 200 frames', get('game.board.length === 20 && game.piece !== null'));
check('gravity pulled pieces down', get('game.board.flat().filter(v => v === 1).length') >= 4);

press('ArrowLeft');
const xHeld = get('game.piece.x');
for (let i = 0; i < 40; i++) { time += 16; const fn = frameCallback; frameCallback = null; fn(time); }
release('ArrowLeft');
check('holding left keeps sliding', get('game.piece.x') < xHeld, [xHeld, get('game.piece.x')]);

press('r');
check('R restarts (board empty, paused again)',
      get('game.board.flat().every(v => v === 0) && game.isPaused && game.score === 0'));

press('q');
check('unknown keys are ignored', true);

console.log(failures === 0 ? '\nALL DOM TESTS PASSED' : `\n${failures} DOM TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
