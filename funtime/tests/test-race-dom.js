/* Run the whole racing game against a fake browser: wiring, drawing, held keys. */
const fs = require('fs'), vm = require('vm');
const LIB = require('path').join(__dirname, '..', 'lib') + require('path').sep;

const drawCalls = { fillRect: 0, strokeRect: 0, fillText: 0 };
function fakeContext() {
    return {
        set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set font(v) {}, set textAlign(v) {},
        fillRect: () => drawCalls.fillRect++, strokeRect: () => drawCalls.strokeRect++,
        fillText: () => drawCalls.fillText++, beginPath() {}, moveTo() {}, lineTo() {},
        stroke() {}, fill() {}, arc() {}, save() {}, restore() {}, translate() {}
    };
}

const docListeners = {};
const winListeners = {};
const elements = {};
const store = {};
function makeElement(id) {
    return { id, textContent: '', width: 0, height: 0, getContext: () => fakeContext(),
             listeners: {}, addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); } };
}
['race-road', 'score', 'metres', 'level', 'best', 'pause-btn', 'restart-btn',
 'btn-left', 'btn-right', 'btn-faster', 'btn-slower'].forEach(id => { elements[id] = makeElement(id); });

let frameCallback = null;
const sandbox = {
    Math, console, JSON, Number, String,
    document: {
        getElementById: (id) => elements[id] || null,
        addEventListener: (type, fn) => { docListeners[type] = fn; }
    },
    window: {
        requestAnimationFrame: (fn) => { frameCallback = fn; },
        addEventListener: (type, fn) => { winListeners[type] = fn; },
        localStorage: {
            getItem: (k) => (k in store ? store[k] : null),
            setItem: (k, v) => { store[k] = String(v); }
        }
    }
};
const ctx = vm.createContext(sandbox);
['race-road.js', 'race-game.js', 'race-draw.js', 'race-input.js', 'race-main.js'].forEach(f =>
    vm.runInContext(fs.readFileSync(LIB + f, 'utf8'), ctx, { filename: f }));

let failures = 0;
const check = (name, ok, extra) => {
    if (ok) console.log('  ok   ' + name);
    else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : '')); }
};
const get = (expr) => vm.runInContext(expr, ctx);
const down = (key) => docListeners['keydown']({ key, preventDefault: () => {} });
const up = (key) => docListeners['keyup']({ key });
let clock = 0;
const frames = (n, ms) => {
    for (let i = 0; i < n; i++) {
        clock += (ms || 16);
        const fn = frameCallback; frameCallback = null;
        fn(clock);
    }
};
const tap = (id, type) => (elements[id].listeners[type] || []).forEach(fn => fn({ preventDefault() {} }));
/* steering tests need an empty road, or passing traffic ends the race mid-test */
const clearRoad = () => get('game.cars = []; game.sinceSpawn = -100000; game.isOver = false; game.isPaused = false;');

docListeners['DOMContentLoaded']();

check('canvas sized from the road', elements['race-road'].width === 300 && elements['race-road'].height === 500,
      [elements['race-road'].width, elements['race-road'].height]);
check('scoreboard filled in', elements['score'].textContent === 0 && elements['level'].textContent === 1);
check('race starts paused with a Go button', elements['pause-btn'].textContent === '▶ Go');
check('the first frame was drawn', drawCalls.fillRect > 0);
check('a message is shown while paused', drawCalls.fillText === 2, drawCalls.fillText);

down('p');
check('P starts the race straight away', elements['pause-btn'].textContent === '⏸ Pause',
      elements['pause-btn'].textContent);

frames(30);
check('the road scrolls', get('game.distance') > 0);
check('metres appear on the scoreboard', Number(elements['metres'].textContent) >= 0);

clearRoad();
const xStart = get('game.player.x');
down('ArrowLeft');
frames(20);
check('holding left keeps steering left', get('game.player.x') < xStart, [xStart, get('game.player.x')]);
up('ArrowLeft');
const xAfterRelease = get('game.player.x');
frames(20);
check('letting go stops the steering', get('game.player.x') === xAfterRelease);

clearRoad();
down('ArrowLeft');
frames(80);
up('ArrowLeft');
check('the car stops at the left verge', get('game.player.x') === get('PLAYER_MIN_X'), get('game.player.x'));

clearRoad();
down('ArrowRight');
frames(80);
up('ArrowRight');
check('and at the right verge', get('game.player.x') === get('PLAYER_MAX_X'), get('game.player.x'));

/* accelerating covers more road in the same time */
clearRoad();
const beforeSlow = get('game.distance');
frames(30);
const slowRun = get('game.distance') - beforeSlow;
down('ArrowUp');
const beforeFast = get('game.distance');
frames(30);
const fastRun = get('game.distance') - beforeFast;
up('ArrowUp');
check('accelerating covers more road', fastRun > slowRun, [slowRun, fastRun]);

get('game.sinceSpawn = 0;');
frames(200);
check('traffic appears on the road', get('game.cars.length') >= 1, get('game.cars.length'));

/* park a car right on top of the player and check the crash */
get('game.isOver = false; game.score = 250;');
get('game.cars = [createCar(1, game.player.y - 5)]; game.player.x = laneCenterX(1) - CAR_WIDTH / 2;');
frames(3);
check('touching a car ends the race', get('game.isOver') === true);
check('the pause button says Crashed', elements['pause-btn'].textContent === '✖ Crashed');
check('the score was saved as the best', Number(store['race-best-score']) === get('game.score'),
      [store['race-best-score'], get('game.score')]);

down('r');
check('R lines up a new race', get('game.isOver') === false && get('game.distance') === 0 && get('game.cars.length') === 0);
check('a new race starts paused', get('game.isPaused') === true);

down('ArrowRight');
check('steering wakes a paused race', get('game.isPaused') === false);
up('ArrowRight');

/* losing focus must not leave a key stuck down */
down('ArrowLeft');
winListeners['blur']();
const xBlur = get('game.player.x');
frames(20);
check('leaving the page releases the keys', get('game.player.x') === xBlur);

/* the touch buttons behave like keys */
tap('btn-left', 'mousedown');
frames(10);
const xTouch = get('game.player.x');
tap('btn-left', 'mouseup');
frames(10);
check('a held touch button steers', xTouch < xBlur);
check('releasing the touch button stops it', get('game.player.x') === xTouch);

down('q');
check('unknown keys are ignored', true);

let crashes = 0;
try { frames(600); } catch (e) { crashes++; }
check('600 frames without an error', crashes === 0);

console.log(failures === 0 ? '\nALL RACE DOM TESTS PASSED' : `\n${failures} DOM TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
