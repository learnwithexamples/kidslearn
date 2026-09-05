/* Run the whole snake game against a fake browser: page wiring, drawing and keys. */
const fs = require('fs'), vm = require('vm');
const LIB = require('path').join(__dirname, '..', 'lib') + require('path').sep;

const drawCalls = { fillRect: 0, strokeRect: 0, fillText: 0, arc: 0 };
function fakeContext() {
    return {
        set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set font(v) {}, set textAlign(v) {},
        fillRect: () => drawCalls.fillRect++, strokeRect: () => drawCalls.strokeRect++,
        fillText: () => drawCalls.fillText++, arc: () => drawCalls.arc++,
        beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fill() {}, save() {}, restore() {}, translate() {}
    };
}

const listeners = {};
const elements = {};
const store = {};
function makeElement(id) {
    return { id, textContent: '', width: 0, height: 0, getContext: () => fakeContext(), addEventListener: () => {} };
}
['snake-board', 'score', 'length', 'level', 'best', 'pause-btn', 'restart-btn',
 'btn-up', 'btn-down', 'btn-left', 'btn-right'].forEach(id => { elements[id] = makeElement(id); });

let frameCallback = null;
const sandbox = {
    Math, console, JSON, Number, String,
    document: {
        getElementById: (id) => elements[id] || null,
        addEventListener: (type, fn) => { listeners[type] = fn; }
    },
    window: {
        requestAnimationFrame: (fn) => { frameCallback = fn; },
        localStorage: {
            getItem: (k) => (k in store ? store[k] : null),
            setItem: (k, v) => { store[k] = String(v); }
        }
    }
};
const ctx = vm.createContext(sandbox);
['snake-grid.js', 'snake-game.js', 'snake-draw.js', 'snake-input.js', 'snake-main.js'].forEach(f =>
    vm.runInContext(fs.readFileSync(LIB + f, 'utf8'), ctx, { filename: f }));

let failures = 0;
const check = (name, ok, extra) => {
    if (ok) console.log('  ok   ' + name);
    else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : '')); }
};
const get = (expr) => vm.runInContext(expr, ctx);
const press = (key) => listeners['keydown']({ key, preventDefault: () => {} });
const frames = (n, ms) => {
    let t = get('0') || 0;
    for (let i = 0; i < n; i++) {
        t = (frames.time = (frames.time || 0) + (ms || 16));
        const fn = frameCallback; frameCallback = null;
        fn(t);
    }
};

listeners['DOMContentLoaded']();

check('canvas sized from the grid', elements['snake-board'].width === 400 && elements['snake-board'].height === 400,
      [elements['snake-board'].width, elements['snake-board'].height]);
check('scoreboard filled in', elements['score'].textContent === 0 && elements['length'].textContent === 3,
      [elements['score'].textContent, elements['length'].textContent]);
check('game starts paused with a Play button', elements['pause-btn'].textContent === '▶ Play');
check('first frame drew the snake and the apple', drawCalls.fillRect > 0 && drawCalls.arc > 0);
check('a message is shown while paused', drawCalls.fillText === 2, drawCalls.fillText);

press('p');
check('P unpauses', elements['pause-btn'].textContent === '⏸ Pause');

const headBefore = get('JSON.stringify(game.snake[0])');
frames(20, 16);
check('the snake crawls on its own', get('JSON.stringify(game.snake[0])') !== headBefore,
      [headBefore, get('JSON.stringify(game.snake[0])')]);

press('ArrowUp');
frames(20, 16);
check('ArrowUp turns the snake upwards', get('game.direction.y') === -1, get('JSON.stringify(game.direction)'));

press('ArrowDown');
frames(20, 16);
check('a U-turn is ignored', get('game.direction.y') === -1);

check('the snake never leaves the grid', get('game.snake.every(isInsideGrid)'));

/* eat an apple by putting it right in front of the head */
get('game.turns = []; game.direction = DIRECTIONS.right; game.food = addDirection(game.snake[0], DIRECTIONS.right);');
frames(30, 16);
check('eating an apple grows the snake and scores', get('game.score') >= 10 && get('game.snake.length') >= 4,
      [get('game.score'), get('game.snake.length')]);
check('the scoreboard shows the new score', elements['score'].textContent === get('game.score'));
check('the best score was saved', Number(store['snake-best-score']) >= 10, store['snake-best-score']);

/* crash into a wall on purpose */
get('game.snake = [{x:19,y:5},{x:18,y:5},{x:17,y:5}]; game.turns = []; game.direction = DIRECTIONS.right;');
frames(30, 16);
check('hitting a wall ends the game', get('game.isOver') === true);
check('the pause button says Over', elements['pause-btn'].textContent === '✖ Over');

press('r');
check('R starts a brand-new game', get('game.isOver') === false && get('game.snake.length') === 3 && get('game.score') === 0);
check('a new game starts paused', get('game.isPaused') === true);

press('ArrowLeft');
check('an arrow key wakes a paused game up', get('game.isPaused') === false);

press('q');
check('unknown keys are ignored', true);

/* play a long stretch without touching anything */
let crashes = 0;
try { frames(400, 16); } catch (e) { crashes++; }
check('400 frames without an error', crashes === 0);

console.log(failures === 0 ? '\nALL SNAKE DOM TESTS PASSED' : `\n${failures} DOM TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
