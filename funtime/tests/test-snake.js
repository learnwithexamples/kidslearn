const fs = require('fs'), vm = require('vm'), path = require('path');
const LIB = require('path').join(__dirname, '..', 'lib') + require('path').sep;
const ctx = vm.createContext({ Math, console, JSON });
['snake-grid.js', 'snake-game.js'].forEach(f =>
    vm.runInContext(fs.readFileSync(path.join(LIB, f), 'utf8'), ctx, { filename: f }));
const run = (code) => vm.runInContext(code, ctx);

let failures = 0;
function check(name, condition, extra) {
    if (condition) { console.log('  ok   ' + name); }
    else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + JSON.stringify(extra) : '')); }
}

console.log('grid:');
check('the grid is 20 x 20', run('GRID_WIDTH') === 20 && run('GRID_HEIGHT') === 20);
check('four directions, each one square long', run(`
  ['up','down','left','right'].every(d => Math.abs(DIRECTIONS[d].x) + Math.abs(DIRECTIONS[d].y) === 1)`));
check('up means y goes down (row 0 is the top)', run('DIRECTIONS.up.y') === -1);
check('samePosition compares the numbers, not the objects', run(`
  samePosition({x:3,y:7}, {x:3,y:7}) && !samePosition({x:3,y:7}, {x:7,y:3})`));
check('addDirection steps one square', run(`
  JSON.stringify(addDirection({x:5,y:5}, DIRECTIONS.up))`) === '{"x":5,"y":4}');
check('addDirection does not change the old position', run(`
  (() => { const p = {x:5,y:5}; addDirection(p, DIRECTIONS.left); return p.x === 5 && p.y === 5; })()`));
check('isInsideGrid knows all four walls', run(`
  isInsideGrid({x:0,y:0}) && isInsideGrid({x:19,y:19}) &&
  !isInsideGrid({x:-1,y:5}) && !isInsideGrid({x:20,y:5}) &&
  !isInsideGrid({x:5,y:-1}) && !isInsideGrid({x:5,y:20})`));
check('containsPosition finds a square in a list', run(`
  containsPosition([{x:1,y:1},{x:2,y:2}], {x:2,y:2}) &&
  !containsPosition([{x:1,y:1},{x:2,y:2}], {x:3,y:3}) &&
  !containsPosition([], {x:0,y:0})`));
check('isOppositeDirection spots U-turns only', run(`
  isOppositeDirection(DIRECTIONS.up, DIRECTIONS.down) &&
  isOppositeDirection(DIRECTIONS.left, DIRECTIONS.right) &&
  !isOppositeDirection(DIRECTIONS.up, DIRECTIONS.left) &&
  !isOppositeDirection(DIRECTIONS.up, DIRECTIONS.up)`));
check('emptyCells leaves out the snake', run(`
  (() => { const snake = [{x:0,y:0},{x:1,y:0}];
           const free = emptyCells(snake);
           return free.length === 400 - 2 && !containsPosition(free, {x:1,y:0}); })()`));
check('randomEmptyCell never lands on the snake', run(`
  (() => { const snake = createStartingSnake();
           for (let i = 0; i < 200; i++) {
             const cell = randomEmptyCell(snake);
             if (containsPosition(snake, cell)) return false;
             if (!isInsideGrid(cell)) return false;
           }
           return true; })()`));
check('randomEmptyCell returns null when the board is full', run(`
  (() => { const all = [];
           for (let y = 0; y < GRID_HEIGHT; y++) for (let x = 0; x < GRID_WIDTH; x++) all.push({x:x,y:y});
           return randomEmptyCell(all) === null; })()`));

console.log('snake rules:');
check('a new snake is 3 squares long, in the middle', run(`
  (() => { const s = createStartingSnake();
           return s.length === 3 && s[0].x === 10 && s[0].y === 10 &&
                  s[1].x === 9 && s[2].x === 8; })()`));
check('moveSnake adds a head and drops the tail', run(`
  JSON.stringify(moveSnake([{x:2,y:0},{x:1,y:0},{x:0,y:0}], {x:3,y:0}, false))`)
  === '[{"x":3,"y":0},{"x":2,"y":0},{"x":1,"y":0}]');
check('moveSnake keeps the tail when growing', run(`
  moveSnake([{x:2,y:0},{x:1,y:0},{x:0,y:0}], {x:3,y:0}, true).length`) === 4);
check('moveSnake does not damage the old snake', run(`
  (() => { const snake = [{x:2,y:0},{x:1,y:0}];
           moveSnake(snake, {x:3,y:0}, false);
           return snake.length === 2; })()`));
check('a new game is ready to play', run(`
  (() => { const g = createGame();
           return g.snake.length === 3 && g.food !== null && g.score === 0 &&
                  g.level === 1 && !g.isOver && !g.isPaused; })()`));
check('the first apple is never under the snake', run(`
  (() => { for (let i = 0; i < 100; i++) {
             const g = createGame();
             if (containsPosition(g.snake, g.food)) return false;
           } return true; })()`));
check('one step moves the whole snake forward', run(`
  (() => { const g = createGame(); g.food = {x:0,y:0};
           stepGame(g);
           return g.snake[0].x === 11 && g.snake[0].y === 10 && g.snake.length === 3; })()`));
check('the snake dies against a wall', run(`
  (() => { const g = createGame(); g.food = {x:0,y:0};
           g.snake = [{x:19,y:10},{x:18,y:10},{x:17,y:10}];
           stepGame(g);
           return g.isOver === true; })()`));
check('the snake dies biting its own body', run(`
  (() => { const g = createGame(); g.food = {x:0,y:0};
           /* a coiled snake: moving up from (5,5) lands on its own body */
           g.snake = [{x:5,y:5},{x:4,y:5},{x:4,y:4},{x:5,y:4},{x:6,y:4},{x:6,y:5}];
           g.direction = DIRECTIONS.up;
           stepGame(g);
           return g.isOver === true; })()`));
check('the square the tail is leaving is safe to enter', run(`
  (() => { const g = createGame(); g.food = {x:0,y:0};
           g.snake = [{x:5,y:5},{x:5,y:4},{x:6,y:4},{x:6,y:5}];
           g.direction = DIRECTIONS.right;
           stepGame(g);
           return g.isOver === false; })()`));
check('eating grows the snake, scores, and moves the apple', run(`
  (() => { const g = createGame();
           g.snake = [{x:5,y:5},{x:4,y:5},{x:3,y:5}];
           g.direction = DIRECTIONS.right;
           g.food = {x:6,y:5};
           stepGame(g);
           return g.snake.length === 4 && g.score === 10 && g.eaten === 1 &&
                  !samePosition(g.food, {x:6,y:5}); })()`));
check('a U-turn is refused', run(`
  (() => { const g = createGame();          /* facing right */
           return turnSnake(g, DIRECTIONS.left) === false && g.turns.length === 0; })()`));
check('turning the same way again is refused (it would do nothing)', run(`
  (() => { const g = createGame();
           return turnSnake(g, DIRECTIONS.right) === false; })()`));
check('a real turn is accepted and queued', run(`
  (() => { const g = createGame();
           return turnSnake(g, DIRECTIONS.up) === true && g.turns.length === 1; })()`));
check('after queueing up, left becomes legal but down does not', run(`
  (() => { const g = createGame();
           turnSnake(g, DIRECTIONS.up);
           const left = turnSnake(g, DIRECTIONS.left);
           const g2 = createGame();
           turnSnake(g2, DIRECTIONS.up);
           const down = turnSnake(g2, DIRECTIONS.down);
           return left === true && down === false; })()`));
check('the turn queue holds at most two turns', run(`
  (() => { const g = createGame();
           turnSnake(g, DIRECTIONS.up); turnSnake(g, DIRECTIONS.left);
           const third = turnSnake(g, DIRECTIONS.down);
           return g.turns.length === 2 && third === false; })()`));
check('two quick turns both happen, one per step', run(`
  (() => { const g = createGame(); g.food = {x:0,y:0};
           turnSnake(g, DIRECTIONS.up); turnSnake(g, DIRECTIONS.left);
           stepGame(g);
           const afterFirst = g.direction === DIRECTIONS.up;
           stepGame(g);
           return afterFirst && g.direction === DIRECTIONS.left; })()`));
check('scoreForFood is 10 times the level', run(`
  [scoreForFood(1), scoreForFood(3), scoreForFood(7)].join(',')`) === '10,30,70');
check('levelForFood goes up every 5 apples', run(`
  [levelForFood(0), levelForFood(4), levelForFood(5), levelForFood(23)].join(',')`) === '1,1,2,5');
check('stepIntervalForLevel gets faster with a floor', run(`
  stepIntervalForLevel(1) === 200 && stepIntervalForLevel(2) === 185 &&
  stepIntervalForLevel(20) === 70`));
check('gravity: the snake crawls on its own over time', run(`
  (() => { const g = createGame(); g.food = {x:0,y:0};
           const startX = g.snake[0].x;
           updateGame(g, 210);
           return g.snake[0].x === startX + 1; })()`));
check('pause freezes the snake', run(`
  (() => { const g = createGame(); g.isPaused = true;
           const startX = g.snake[0].x;
           updateGame(g, 5000);
           return g.snake[0].x === startX; })()`));
check('filling the whole board wins the game', run(`
  (() => { const g = createGame();
           /* snake covers every square but one, and the apple is on it */
           const all = [];
           for (let y = 0; y < GRID_HEIGHT; y++) for (let x = 0; x < GRID_WIDTH; x++) all.push({x:x,y:y});
           g.snake = all.slice(1);              /* everything except (0,0) */
           g.snake.unshift({x:1,y:0});          /* head next to the free square */
           g.direction = DIRECTIONS.left;
           g.food = {x:0,y:0};
           stepGame(g);
           return g.isWon === true && g.isOver === true; })()`));

console.log('long random game (never crashes, always legal):');
const sim = run(`
  (() => {
    let games = 0, totalEaten = 0, longest = 0;
    for (let round = 0; round < 40; round++) {
      const g = createGame();
      let steps = 0;
      while (!g.isOver && steps < 4000) {
        if (Math.random() < 0.25) {
          const names = ['up','down','left','right'];
          turnSnake(g, DIRECTIONS[names[Math.floor(Math.random() * 4)]]);
        }
        stepGame(g);
        for (let i = 0; i < g.snake.length; i++) {
          if (!isInsideGrid(g.snake[i])) return 'SNAKE LEFT THE GRID';
        }
        if (g.food !== null && containsPosition(g.snake, g.food)) return 'APPLE UNDER THE SNAKE';
        if (g.snake.length !== 3 + g.eaten) return 'LENGTH DOES NOT MATCH APPLES EATEN';
        steps++;
      }
      games++; totalEaten += g.eaten; longest = Math.max(longest, g.snake.length);
    }
    return { games, totalEaten, longest };
  })()`);
check('40 random games stay legal', typeof sim === 'object', sim);
console.log('   ' + JSON.stringify(sim));

console.log('a greedy player (proves eating and growing really work):');
const smart = run(`
  (() => {
    const g = createGame();
    let steps = 0, hadSafeMoveWhenItDied = null;
    const safeFrom = (head, snake, d) => {
      const next = addDirection(head, d);
      return isInsideGrid(next) && !containsPosition(snake.slice(0, snake.length - 1), next);
    };
    while (!g.isOver && steps < 6000) {
      const head = g.snake[0];
      const all = [DIRECTIONS.up, DIRECTIONS.down, DIRECTIONS.left, DIRECTIONS.right];
      /* directions the snake is allowed to take this turn */
      const legal = all.filter(d => !isOppositeDirection(d, g.direction));
      const safe = legal.filter(d => safeFrom(head, g.snake, d));
      const wants = [];
      if (g.food.x > head.x) wants.push(DIRECTIONS.right);
      if (g.food.x < head.x) wants.push(DIRECTIONS.left);
      if (g.food.y > head.y) wants.push(DIRECTIONS.down);
      if (g.food.y < head.y) wants.push(DIRECTIONS.up);
      const choice = wants.filter(d => safe.indexOf(d) !== -1)[0] || safe[0];
      if (choice) { g.turns = []; turnSnake(g, choice); }
      const safeCount = safe.length;
      stepGame(g);
      steps++;
      if (g.isOver) { hadSafeMoveWhenItDied = safeCount; }
    }
    return { eaten: g.eaten, score: g.score, level: g.level, length: g.snake.length,
             steps, won: g.isWon, safeMovesAtDeath: hadSafeMoveWhenItDied };
  })()`);
check('a greedy player eats plenty of apples', smart.eaten > 10, smart);
check('length always matches apples eaten', smart.length === 3 + smart.eaten, smart);
check('it only ever died because it was truly trapped',
      smart.safeMovesAtDeath === null || smart.safeMovesAtDeath === 0, smart);
console.log('   ' + JSON.stringify(smart));

console.log(failures === 0 ? '\nALL SNAKE TESTS PASSED' : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
