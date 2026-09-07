/* ============================================================
   test-bubbles.js — the rules of Bubble Shooter

       node funtime/tests/test-bubbles.js

   The workshop teaches five of this game's functions, so those five were the
   only ones any suite ever ran. Two real bugs lived in the others:

     * a shot could stop in a cell touching nothing at all and hang there in
       mid-air — and, belonging to no group, it could never be popped;
     * those strays then vanished all at once the next time anything popped,
       which looked like unconnected bubbles being wiped out for no reason.

   So this file plays the game properly and checks the things that must be
   true after EVERY shot, whatever the player does.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sandbox = { Math, console, JSON };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'lib', 'bubbles-rules.js'), 'utf8'),
                sandbox);
const G = name => vm.runInContext(name, sandbox);

const createGame = G('createGame'), updateGame = G('updateGame'), shootBubble = G('shootBubble');
const bubbleIndex = G('bubbleIndex'), bubbleCentre = G('bubbleCentre'), neighbours = G('neighbours');
const sameGroup = G('sameGroup'), popGroup = G('popGroup'), dropFloaters = G('dropFloaters');
const canStickHere = G('canStickHere'), randomKind = G('randomKind');
const COLUMNS = G('COLUMNS'), ROWS = G('ROWS'), EMPTY = G('EMPTY'), CELL = G('CELL');
const MIN_POP = G('MIN_POP'), MIN_ANGLE = G('MIN_ANGLE'), MAX_ANGLE = G('MAX_ANGLE');
const FIELD_WIDTH = G('FIELD_WIDTH');

let failures = 0;
let checks = 0;

function check(name, ok, extra) {
    checks++;
    if (!ok) {
        failures++;
        console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : ''));
    }
}

/** heldByCeiling — every bubble that can be reached from the top row. */
function heldByCeiling(grid) {
    const held = new Set();
    const todo = [];
    for (let column = 0; column < COLUMNS; column++) {
        if (grid[bubbleIndex(column, 0)] !== EMPTY) { todo.push([column, 0]); }
    }
    while (todo.length > 0) {
        const [column, row] = todo.pop();
        const index = bubbleIndex(column, row);
        if (held.has(index) || grid[index] === EMPTY) { continue; }
        held.add(index);
        neighbours(column, row).forEach(n => todo.push([n.column, n.row]));
    }
    return held;
}

/** touchesSomething — does this cell have a bubble next to it? */
function touchesSomething(grid, column, row) {
    return neighbours(column, row)
        .some(n => grid[bubbleIndex(n.column, n.row)] !== EMPTY);
}

/* ------------------------------------------------- canStickHere on its own */

console.log('where a bubble may stop');

(function () {
    const state = createGame();          /* rows 0-3 are full */
    check('an occupied cell is not free', canStickHere(state, 0, 0) === false);
    check('the ceiling row is always allowed', canStickHere({ grid: state.grid.map(() => EMPTY) }, 3, 0) === true);
    check('the cell under a bubble will do', canStickHere(state, 3, 4) === true);
    check('a cell touching nothing will NOT do', canStickHere(state, 3, 8) === false,
          'row 8 is far below the bubbles — nothing to hold on to');
    check('nor will a cell that is only DIAGONAL to a bubble', (function () {
        const grid = [];
        for (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }
        grid[bubbleIndex(4, 5)] = 0;
        return canStickHere({ grid: grid }, 5, 6) === false;
    })(), 'a diagonal is not a neighbour, so it cannot hold a bubble up');
})();

/* -------------------------------------------------- the two searches, again */

console.log('the two searches');

(function () {
    let groupFaults = 0;
    let dropFaults = 0;

    for (let trial = 0; trial < 600; trial++) {
        const grid = [];
        for (let i = 0; i < COLUMNS * ROWS; i++) {
            const row = Math.floor(i / COLUMNS);
            grid.push(Math.random() < 0.85 - row * 0.06 ? randomKind() : EMPTY);
        }

        /* sameGroup must hand back one joined-up blob, all of one kind */
        for (let k = 0; k < 4; k++) {
            const column = Math.floor(Math.random() * COLUMNS);
            const row = Math.floor(Math.random() * ROWS);
            if (grid[bubbleIndex(column, row)] === EMPTY) { continue; }
            const group = sameGroup(grid, column, row);
            const kind = grid[bubbleIndex(column, row)];
            const wanted = new Set(group.map(cell => bubbleIndex(cell.column, cell.row)));

            if (!group.every(cell => grid[bubbleIndex(cell.column, cell.row)] === kind)) {
                groupFaults++;
                continue;
            }
            const seen = new Set();
            const todo = [group[0]];
            while (todo.length > 0) {
                const cell = todo.pop();
                const index = bubbleIndex(cell.column, cell.row);
                if (seen.has(index) || !wanted.has(index)) { continue; }
                seen.add(index);
                neighbours(cell.column, cell.row).forEach(n => todo.push(n));
            }
            if (seen.size !== wanted.size) { groupFaults++; }
        }

        /* dropFloaters must take exactly the ones that cannot reach the top */
        const state = { grid: grid.slice(), score: 0, dropped: 0 };
        const before = grid.slice();
        const held = heldByCeiling(before);
        dropFloaters(state);
        for (let i = 0; i < before.length; i++) {
            if (before[i] === EMPTY) { continue; }
            const kept = state.grid[i] !== EMPTY;
            if (kept !== held.has(i)) { dropFaults++; break; }
        }
    }

    check('sameGroup always returns one joined-up blob of a single kind', groupFaults === 0, groupFaults);
    check('dropFloaters takes exactly what cannot reach the ceiling', dropFaults === 0, dropFaults);
})();

(function () {
    const grid = [];
    for (let i = 0; i < COLUMNS * ROWS; i++) { grid.push(EMPTY); }
    grid[bubbleIndex(0, 0)] = 2;
    grid[bubbleIndex(1, 0)] = 2;
    const state = { grid: grid.slice(), score: 0, popped: 0 };
    check('two of a kind is not enough to pop',
          popGroup(state, sameGroup(state.grid, 0, 0)) === 0, MIN_POP);

    grid[bubbleIndex(2, 0)] = 2;
    const three = { grid: grid.slice(), score: 0, popped: 0 };
    check('three of a kind pops', popGroup(three, sameGroup(three.grid, 0, 0)) === 3);
    check('and the cells really are emptied',
          three.grid[bubbleIndex(0, 0)] === EMPTY && three.grid[bubbleIndex(2, 0)] === EMPTY);
})();

/* ------------------------------------------ playing, with the rules watched */

console.log('playing 150 games, watching every shot');

(function () {
    let shots = 0;
    let stranded = 0;
    let landedNowhere = 0;
    let farSnaps = 0;
    let escaped = 0;
    let neverLanded = 0;
    let worstSnap = 0;

    /* Watch the real landing: a top-level function declaration lives on the
       vm's global, so replacing it here is seen by landBubble itself. */
    const realNearest = sandbox.nearestFreeCell;
    let lastSnap = 0;
    let lastCell = null;
    sandbox.nearestFreeCell = function (state, x, y) {
        const cell = realNearest(state, x, y);
        lastCell = cell;
        if (cell) {
            const centre = bubbleCentre(cell.column, cell.row);
            lastSnap = Math.sqrt((centre.x - x) * (centre.x - x) + (centre.y - y) * (centre.y - y));
            /* the cell it picked has to be one a bubble could really hold on to */
            if (!canStickHere(state, cell.column, cell.row)) { landedNowhere++; }
        }
        return cell;
    };

    for (let game = 0; game < 150; game++) {
        const state = createGame();

        for (let shot = 0; shot < 60 && !state.isOver; shot++) {
            state.angle = MIN_ANGLE + Math.random() * (MAX_ANGLE - MIN_ANGLE);
            if (!shootBubble(state)) { break; }
            shots++;
            lastCell = null;

            let frames = 0;
            while (state.flying !== null && frames < 900) {
                /* the spread of frame times a real browser actually produces */
                updateGame(state, 16 + Math.random() * 24);
                frames++;
                if (state.flying !== null) {
                    if (state.flying.x < 0 || state.flying.x > FIELD_WIDTH) { escaped++; }
                }
            }
            if (state.flying !== null) { neverLanded++; state.flying = null; }

            if (lastCell !== null) {
                worstSnap = Math.max(worstSnap, lastSnap);
                if (lastSnap > CELL) { farSnaps++; }
            }

            /* THE invariant: nothing may be left hanging in mid-air. */
            const held = heldByCeiling(state.grid);
            for (let i = 0; i < state.grid.length; i++) {
                if (state.grid[i] !== EMPTY && !held.has(i)) {
                    stranded++;
                    state.grid[i] = EMPTY;   /* count each stray once */
                }
            }
        }
    }

    sandbox.nearestFreeCell = realNearest;

    check(shots + ' shots fired', shots > 4000, shots);
    check('no bubble is ever left hanging in mid-air', stranded === 0, stranded);
    check('every shot lands somewhere a bubble can hold on', landedNowhere === 0, landedNowhere);
    check('every shot lands within one cell of where it stopped', farSnaps === 0,
          farSnaps + ' shots snapped further, worst ' + worstSnap.toFixed(0) + 'px');
    check('no shot escapes through a side wall', escaped === 0, escaped);
    check('every shot finishes its flight', neverLanded === 0, neverLanded);
})();

console.log('\n' + checks + ' checks run');
if (failures) {
    console.log(failures + ' PROBLEM(S)');
    process.exit(1);
}
console.log('ALL BUBBLE SHOOTER TESTS PASSED');
