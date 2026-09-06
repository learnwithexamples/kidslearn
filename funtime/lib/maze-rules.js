/* ============================================================
   maze-rules.js — the rules of Maze Runner

   A maze is dug out fresh every game, and you have to find your way from the
   top-left corner to the bottom-right.

   Two famous algorithms live in this file, and they are worth more than the
   game itself:
     • the RECURSIVE BACKTRACKER, which digs a perfect maze with a stack
     • BREADTH-FIRST SEARCH, which finds the shortest way through anything
   ============================================================ */

const MAZE_WIDTH = 21;         /* always odd: walls and corridors alternate */
const MAZE_HEIGHT = 15;

/**
 * mazeIndex — turn an x and y into a place in the list.
 * INPUT: x, y. OUTPUT: the position in a flat list.
 */
function mazeIndex(x, y) {
    return y * MAZE_WIDTH + x;
}

/** isInsideMaze — is this square inside the maze at all? */
function isInsideMaze(x, y) {
    return x >= 0 && x < MAZE_WIDTH && y >= 0 && y < MAZE_HEIGHT;
}

/**
 * isWall — is this square solid rock?
 * INPUT: maze, x, y. OUTPUT: true if you cannot walk there.
 * ALGORITHM: anything outside the maze is solid too, so nothing can escape.
 */
function isWall(maze, x, y) {
    if (!isInsideMaze(x, y)) {
        return true;
    }
    return maze[mazeIndex(x, y)];
}

/** solidMaze — every square filled in, ready to be dug out. */
function solidMaze() {
    const maze = [];
    for (let i = 0; i < MAZE_WIDTH * MAZE_HEIGHT; i++) {
        maze.push(true);
    }
    return maze;
}

/**
 * roomNeighbours — the four rooms around this one, two squares away.
 *
 * INPUT:  x, y — a room (both odd numbers)
 * OUTPUT: a list of { x, y, wallX, wallY } — the room, and the wall between
 *
 * ALGORITHM: rooms sit at odd coordinates and the wall between two rooms is
 *            the single square in the middle. So a neighbour is TWO squares
 *            away, and the wall to knock through is ONE square away.
 */
function roomNeighbours(x, y) {
    const steps = [[0, -2], [2, 0], [0, 2], [-2, 0]];
    const found = [];
    for (let i = 0; i < steps.length; i++) {
        const nx = x + steps[i][0];
        const ny = y + steps[i][1];
        if (isInsideMaze(nx, ny)) {
            found.push({
                x: nx, y: ny,
                wallX: x + steps[i][0] / 2,
                wallY: y + steps[i][1] / 2
            });
        }
    }
    return found;
}

/**
 * shuffle — put a list in a random order.
 * INPUT: list. OUTPUT: the same list, shuffled (this changes it).
 */
function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const swap = list[i];
        list[i] = list[j];
        list[j] = swap;
    }
    return list;
}

/**
 * carveMaze — dig a whole maze out of solid rock.
 *
 * INPUT:  nothing
 * OUTPUT: a maze: a list where true means wall
 *
 * ALGORITHM — the RECURSIVE BACKTRACKER, done with a stack:
 *   1. Start in one room and dig it out. Put it on the stack.
 *   2. Look at the room on top of the stack. Shuffle its neighbours.
 *   3. If any neighbour is still solid rock, knock through the wall between,
 *      dig the neighbour out, and put IT on the stack. (Walk further.)
 *   4. If every neighbour has already been dug, take the top room off the
 *      stack. (Walk back until there is somewhere new to go.)
 *   5. Stop when the stack is empty.
 *
 * What you get is a "perfect" maze: exactly one route between any two rooms,
 * with no loops and nothing walled off.
 */
function carveMaze() {
    const maze = solidMaze();
    const start = { x: 1, y: 1 };
    maze[mazeIndex(start.x, start.y)] = false;

    const stack = [start];
    while (stack.length > 0) {
        const here = stack[stack.length - 1];
        const options = shuffle(roomNeighbours(here.x, here.y));

        let dug = false;
        for (let i = 0; i < options.length; i++) {
            const next = options[i];
            if (isWall(maze, next.x, next.y)) {
                maze[mazeIndex(next.wallX, next.wallY)] = false;
                maze[mazeIndex(next.x, next.y)] = false;
                stack.push({ x: next.x, y: next.y });
                dug = true;
                break;
            }
        }

        if (!dug) {
            stack.pop();
        }
    }
    return maze;
}

/**
 * findPath — the shortest way from one square to another.
 *
 * INPUT:  maze. from, to — { x, y }
 * OUTPUT: a list of squares from start to finish, or an empty list
 *
 * ALGORITHM — BREADTH-FIRST SEARCH, the shortest-path algorithm:
 *   1. Keep a QUEUE of squares to look at, starting with the first one.
 *   2. Take the square at the FRONT of the queue. For each open neighbour you
 *      have not seen before, remember which square you came from and put it
 *      at the BACK of the queue.
 *   3. When you reach the target, walk the "came from" trail backwards to
 *      build the route, then turn it round.
 *
 * The queue is what makes it shortest. Because you always look at the nearest
 * squares first, the very first time you reach a square is by the shortest
 * possible route. Swap the queue for a stack and you still find a way — just
 * not the best one.
 */
function findPath(maze, from, to) {
    const cameFrom = {};
    const startKey = mazeIndex(from.x, from.y);
    cameFrom[startKey] = -1;

    const queue = [from];
    let head = 0;

    while (head < queue.length) {
        const here = queue[head];
        head = head + 1;

        if (here.x === to.x && here.y === to.y) {
            return buildPath(cameFrom, from, to);
        }

        const steps = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        for (let i = 0; i < steps.length; i++) {
            const nx = here.x + steps[i][0];
            const ny = here.y + steps[i][1];
            const key = mazeIndex(nx, ny);
            if (!isWall(maze, nx, ny) && cameFrom[key] === undefined) {
                cameFrom[key] = mazeIndex(here.x, here.y);
                queue.push({ x: nx, y: ny });
            }
        }
    }
    return [];
}

/**
 * buildPath — turn the "came from" trail into a route.
 * INPUT: cameFrom, from, to. OUTPUT: the squares in order, start first.
 */
function buildPath(cameFrom, from, to) {
    const path = [];
    let key = mazeIndex(to.x, to.y);

    while (key !== -1 && key !== undefined) {
        path.push({ x: key % MAZE_WIDTH, y: Math.floor(key / MAZE_WIDTH) });
        key = cameFrom[key];
    }
    path.reverse();
    return path;
}

/** exitSquare — the square you are trying to reach. */
function exitSquare() {
    return { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };
}

/**
 * movePlayer — one step, if there is no wall in the way.
 * INPUT: state. dx, dy. OUTPUT: true if you moved.
 */
function movePlayer(state, dx, dy) {
    if (state.isSolved || state.isPaused) {
        return false;
    }
    const toX = state.player.x + dx;
    const toY = state.player.y + dy;

    if (isWall(state.maze, toX, toY)) {
        return false;
    }

    state.player = { x: toX, y: toY };
    state.steps = state.steps + 1;
    state.hint = [];

    const exit = exitSquare();
    if (toX === exit.x && toY === exit.y) {
        state.isSolved = true;
        state.solved = state.solved + 1;
    }
    return true;
}

/**
 * showHint — light up the shortest way from here to the exit.
 * INPUT: state. OUTPUT: how many steps are left.
 */
function showHint(state) {
    state.hint = findPath(state.maze, state.player, exitSquare());
    state.hintsUsed = state.hintsUsed + 1;
    return state.hint.length;
}

/** shortestFromStart — how many steps a perfect run would take. */
function shortestFromStart(maze) {
    const path = findPath(maze, { x: 1, y: 1 }, exitSquare());
    return path.length === 0 ? 0 : path.length - 1;
}

/** newMaze — dig a fresh maze and stand at the start of it. */
function newMaze(state) {
    state.maze = carveMaze();
    state.player = { x: 1, y: 1 };
    state.steps = 0;
    state.seconds = 0;
    state.hint = [];
    state.shortest = shortestFromStart(state.maze);
    state.isSolved = false;
}

/** createGame — start a brand-new game. */
function createGame() {
    const state = { solved: 0, hintsUsed: 0, isPaused: false };
    newMaze(state);
    return state;
}

/** updateGame — the only moving part is the clock. */
function updateGame(state, elapsedMs) {
    if (state.isSolved || state.isPaused) {
        return;
    }
    state.seconds = state.seconds + elapsedMs / 1000;
}

/** togglePause — freeze or unfreeze the clock. */
function togglePause(state) {
    if (!state.isSolved) { state.isPaused = !state.isPaused; }
}

/** actionForKey — turn a keyboard key into an action name, or null. */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowup' || k === 'w') { return 'up'; }
    if (k === 'arrowdown' || k === 's') { return 'down'; }
    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === 'h' || k === ' ' || k === 'spacebar') { return 'hint'; }
    if (k === 'n' || k === 'enter') { return 'new'; }
    if (k === 'p') { return 'pause'; }

    return null;
}
