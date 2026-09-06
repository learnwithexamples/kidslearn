/* ============================================================
   sokoban-rules.js — the rules of Sokoban

   Push every box onto a target. You can only PUSH, never pull, so one careless
   shove into a corner and the level is unwinnable — which is why this game has
   an UNDO button, and why building one is one of the steps.

   The levels are written as pictures made of characters:
       #  wall        .  target        $  box
       @  you         *  box on a target
   That is the real Sokoban file format, used since 1982.
   ============================================================ */

const LEVEL_WIDTH = 10;
const LEVEL_HEIGHT = 7;

const LEVELS = [
    /* 1 — one push */
    '##########' +
    '#        #' +
    '#        #' +
    '#  .$@   #' +
    '#        #' +
    '#        #' +
    '##########',

    /* 2 — push upwards */
    '##########' +
    '#        #' +
    '#    .   #' +
    '#    $   #' +
    '#    @   #' +
    '#        #' +
    '##########',

    /* 3 — two boxes, one at a time */
    '##########' +
    '#        #' +
    '#   ..   #' +
    '#   $$   #' +
    '#   @    #' +
    '#        #' +
    '##########',

    /* 4 — a wall in the way, so you must go round */
    '##########' +
    '#        #' +
    '#   # .  #' +
    '#   $    #' +
    '#  @     #' +
    '#        #' +
    '##########',

    /* 5 — three in a row */
    '##########' +
    '#        #' +
    '#  ...   #' +
    '#  $$$   #' +
    '#   @    #' +
    '#        #' +
    '##########',

    /* 6 — from both ends */
    '##########' +
    '#        #' +
    '# $ .. $ #' +
    '#        #' +
    '#   @    #' +
    '#        #' +
    '##########'
];

/**
 * cellIndex — turn an x and y into a place in the lists.
 * INPUT: x, y. OUTPUT: the position in a flat list.
 */
function cellIndex(x, y) {
    return y * LEVEL_WIDTH + x;
}

/**
 * parseLevel — turn a picture into a game.
 *
 * INPUT:  text — the level as one long string of characters
 * OUTPUT: a fresh game
 *
 * ALGORITHM: walk the characters. '#' becomes a wall, '.' and '*' mark a
 *            target, '$' and '*' start a box, '@' is where you begin.
 */
function parseLevel(text) {
    const walls = [];
    const goals = [];
    const boxes = [];
    let player = { x: 1, y: 1 };

    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        for (let x = 0; x < LEVEL_WIDTH; x++) {
            const symbol = text.charAt(cellIndex(x, y));
            walls.push(symbol === '#');
            goals.push(symbol === '.' || symbol === '*');
            if (symbol === '$' || symbol === '*') {
                boxes.push({ x: x, y: y });
            }
            if (symbol === '@') {
                player = { x: x, y: y };
            }
        }
    }
    return { walls: walls, goals: goals, boxes: boxes, player: player };
}

/**
 * isWall — is this square a wall?
 * INPUT: state, x, y. OUTPUT: true if you cannot walk there.
 * ALGORITHM: anything outside the level counts as a wall too, so nothing can
 *            ever escape the picture.
 */
function isWall(state, x, y) {
    if (x < 0 || x >= LEVEL_WIDTH || y < 0 || y >= LEVEL_HEIGHT) {
        return true;
    }
    return state.walls[cellIndex(x, y)];
}

/** isGoal — is this square a target? */
function isGoal(state, x, y) {
    if (x < 0 || x >= LEVEL_WIDTH || y < 0 || y >= LEVEL_HEIGHT) {
        return false;
    }
    return state.goals[cellIndex(x, y)];
}

/**
 * boxAt — is there a box on this square?
 *
 * INPUT:  state, x, y
 * OUTPUT: which box it is (0, 1, 2 …), or -1 for none
 *
 * ALGORITHM: look through the boxes for one standing exactly here.
 *
 * WHY a number and not just true/false: the move function needs to know WHICH
 *      box it is about to push, so it can move that one.
 */
function boxAt(state, x, y) {
    for (let i = 0; i < state.boxes.length; i++) {
        if (state.boxes[i].x === x && state.boxes[i].y === y) {
            return i;
        }
    }
    return -1;
}

/**
 * boxesOnGoals — how many boxes are already home?
 * INPUT: state. OUTPUT: a count.
 */
function boxesOnGoals(state) {
    let count = 0;
    for (let i = 0; i < state.boxes.length; i++) {
        if (isGoal(state, state.boxes[i].x, state.boxes[i].y)) {
            count = count + 1;
        }
    }
    return count;
}

/**
 * isSolved — is the level finished?
 * INPUT: state. OUTPUT: true when every box is on a target.
 */
function isSolved(state) {
    return boxesOnGoals(state) === state.boxes.length;
}

/**
 * snapshot — remember exactly where everything is.
 *
 * INPUT:  state
 * OUTPUT: a copy of the player and the boxes
 *
 * ALGORITHM: copy the boxes one at a time. Copying the LIST alone is not
 *            enough — the copies would still point at the same boxes, and
 *            moving one would change your saved picture too.
 */
function snapshot(state) {
    const boxes = [];
    for (let i = 0; i < state.boxes.length; i++) {
        boxes.push({ x: state.boxes[i].x, y: state.boxes[i].y });
    }
    return { player: { x: state.player.x, y: state.player.y }, boxes: boxes };
}

/**
 * movePlayer — one step, pushing a box if one is in the way.
 *
 * INPUT:  state. dx, dy — the step, e.g. 1 and 0 for "right".
 * OUTPUT: true if anything moved
 *
 * ALGORITHM:
 *   1. Work out the square you are stepping into. A wall stops you.
 *   2. If there is a box there, work out where THAT box would go. If it would
 *      land on a wall or on another box, nothing moves at all.
 *   3. Save a snapshot for undo, then move the box, then move yourself.
 *
 * The order matters: save first, or the undo remembers the move you just made.
 */
function movePlayer(state, dx, dy) {
    if (state.isSolved || state.isPaused) {
        return false;
    }
    const toX = state.player.x + dx;
    const toY = state.player.y + dy;

    if (isWall(state, toX, toY)) {
        return false;
    }

    const box = boxAt(state, toX, toY);
    if (box !== -1) {
        const boxToX = toX + dx;
        const boxToY = toY + dy;
        if (isWall(state, boxToX, boxToY) || boxAt(state, boxToX, boxToY) !== -1) {
            return false;
        }
        state.history.push(snapshot(state));
        state.boxes[box] = { x: boxToX, y: boxToY };
        state.pushes = state.pushes + 1;
    } else {
        state.history.push(snapshot(state));
    }

    state.player = { x: toX, y: toY };
    state.moves = state.moves + 1;

    if (isSolved(state)) {
        state.isSolved = true;
    }
    return true;
}

/**
 * undoMove — step back in time.
 *
 * INPUT:  state
 * OUTPUT: true if there was anything to undo
 *
 * ALGORITHM: the history is a STACK — the newest snapshot is on top. Take the
 *            top one off and put its player and boxes back. Because every move
 *            pushed one on, undo can walk all the way back to the start.
 */
function undoMove(state) {
    if (state.history.length === 0) {
        return false;
    }
    const past = state.history.pop();
    state.player = past.player;
    state.boxes = past.boxes;
    state.moves = state.moves + 1;
    state.isSolved = isSolved(state);
    return true;
}

/** loadLevel — start one of the levels. */
function loadLevel(state, number) {
    const level = parseLevel(LEVELS[number % LEVELS.length]);
    state.walls = level.walls;
    state.goals = level.goals;
    state.boxes = level.boxes;
    state.player = level.player;
    state.history = [];
    state.moves = 0;
    state.pushes = 0;
    state.level = number % LEVELS.length;
    state.isSolved = false;
}

/** resetLevel — put the level back exactly as it started. */
function resetLevel(state) {
    loadLevel(state, state.level);
}

/** nextLevel — move on to the next puzzle. */
function nextLevel(state) {
    const solved = state.solved + (state.isSolved ? 1 : 0);
    loadLevel(state, state.level + 1);
    state.solved = solved;
}

/** createGame — start at level 1. */
function createGame() {
    const state = { solved: 0, isPaused: false };
    loadLevel(state, 0);
    return state;
}

/** togglePause — freeze or unfreeze the game. */
function togglePause(state) {
    state.isPaused = !state.isPaused;
}

/** updateGame — Sokoban has no clock, so a frame changes nothing. */
function updateGame(state, elapsedMs) {
    return;
}

/** actionForKey — turn a keyboard key into an action name, or null. */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowup' || k === 'w') { return 'up'; }
    if (k === 'arrowdown' || k === 's') { return 'down'; }
    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === 'u' || k === 'z' || k === 'backspace') { return 'undo'; }
    if (k === 'r') { return 'reset'; }
    if (k === 'n' || k === 'enter') { return 'next'; }
    if (k === 'p') { return 'pause'; }

    return null;
}
