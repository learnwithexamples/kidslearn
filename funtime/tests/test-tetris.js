const fs = require('fs'), vm = require('vm'), path = require('path');
const LIB = require('path').join(__dirname, '..', 'lib') + require('path').sep;
const ctx = vm.createContext({ Math, console, JSON });
for (const f of ['tetris-shapes.js', 'tetris-board.js', 'tetris-game.js']) {
    vm.runInContext(fs.readFileSync(path.join(LIB, f), 'utf8'), ctx, { filename: f });
}
const run = (code) => vm.runInContext(code, ctx);

let failures = 0;
function check(name, condition, extra) {
    if (condition) { console.log('  ok   ' + name); }
    else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + JSON.stringify(extra) : '')); }
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('shapes:');
check('7 shapes exist', run('SHAPE_TYPES.length') === 7);
check('every shape has exactly 4 blocks', run(`
  SHAPE_TYPES.every(t => SHAPES[t].flat().filter(v => v === 1).length === 4)`));
check('every shape matrix is square', run(`
  SHAPE_TYPES.every(t => SHAPES[t].every(row => row.length === SHAPES[t].length))`));
check('rotate T clockwise', eq(run('rotateMatrixClockwise(SHAPES.T)'),
      [[0,1,0],[0,1,1],[0,1,0]]), run('rotateMatrixClockwise(SHAPES.T)'));
check('rotate 4x = original', run(`
  (() => { let m = SHAPES.J; for (let i=0;i<4;i++) m = rotateMatrixClockwise(m);
           return JSON.stringify(m) === JSON.stringify(SHAPES.J); })()`));
check('CCW undoes CW', run(`
  (() => { const m = rotateMatrixCounterClockwise(rotateMatrixClockwise(SHAPES.L));
           return JSON.stringify(m) === JSON.stringify(SHAPES.L); })()`));
check('O piece unchanged by rotation', run(`
  JSON.stringify(rotateMatrixClockwise(SHAPES.O)) === JSON.stringify(SHAPES.O)`));
check('copyMatrix is a deep copy', run(`
  (() => { const a = [[1,0],[0,1]]; const b = copyMatrix(a); b[0][0] = 9; return a[0][0] === 1; })()`));
check('movePiece does not change the original', run(`
  (() => { const p = createPiece('T'); p.x = 4; const m = movePiece(p, -1, 1);
           return p.x === 4 && p.y === 0 && m.x === 3 && m.y === 1; })()`));
check('forEachBlock visits 4 blocks', run(`
  (() => { const p = createPiece('S'); p.x = 2; p.y = 3; let n = 0;
           forEachBlock(p, () => n++); return n; })()`) === 4);
check('shuffled bag holds all 7 once', run(`
  (() => { const bag = createShuffledBag();
           return bag.length === 7 && SHAPE_TYPES.every(t => bag.indexOf(t) !== -1); })()`));

console.log('rotation of whole pieces (the I-piece drift bug):');
check('the I piece looks the same after two turns', run(`
  (() => { let p = createPiece('I'); p.x = 3; p.y = 5;
           const spots = q => { const s = []; forEachBlock(q, (x, y) => s.push(x + ',' + y)); return s.join(' '); };
           const start = spots(p);
           p = rotatePiece(p, true); p = rotatePiece(p, true);
           return spots(p) === start; })()`));
check('the I piece looks the same after two turns the other way', run(`
  (() => { let p = createPiece('I'); p.x = 3; p.y = 5;
           const spots = q => { const s = []; forEachBlock(q, (x, y) => s.push(x + ',' + y)); return s.join(' '); };
           const start = spots(p);
           p = rotatePiece(p, false); p = rotatePiece(p, false);
           return spots(p) === start; })()`));
check('the I piece has only two positions, flat and upright', run(`
  (() => { let p = createPiece('I'); p.x = 3; p.y = 5;
           const seen = {};
           for (let i = 0; i < 8; i++) { seen[JSON.stringify(p.cells)] = true; p = rotatePiece(p, true); }
           return Object.keys(seen).length; })()`) === 2);
check('every piece returns to its exact spot after four turns', run(`
  SHAPE_TYPES.every(t => {
    let p = createPiece(t); p.x = 3; p.y = 5;
    const spots = q => { const s = []; forEachBlock(q, (x, y) => s.push(x + ',' + y)); return s.sort().join(' '); };
    const start = spots(p);
    for (let i = 0; i < 4; i++) { p = rotatePiece(p, true); }
    return spots(p) === start;
  })`));
check('turning right then left undoes itself, from every position', run(`
  SHAPE_TYPES.every(t => {
    let p = createPiece(t); p.x = 3; p.y = 5;
    const spots = q => { const s = []; forEachBlock(q, (x, y) => s.push(x + ',' + y)); return s.sort().join(' '); };
    for (let turn = 0; turn < 4; turn++) {
      const before = spots(p);
      const there = rotatePiece(p, true);
      const back = rotatePiece(there, false);
      if (spots(back) !== before) { return false; }
      p = there;
    }
    return true;
  })`));
check('a rotated piece still has exactly four blocks', run(`
  SHAPE_TYPES.every(t => {
    let p = createPiece(t);
    for (let i = 0; i < 6; i++) {
      p = rotatePiece(p, true);
      let n = 0; forEachBlock(p, () => n++);
      if (n !== 4) { return false; }
    }
    return true;
  })`));
check('centerLongBar leaves 3x3 pieces alone', run(`
  ['T','S','Z','J','L'].every(t => {
    const cells = createPiece(t).cells;
    return JSON.stringify(centerLongBar(cells)) === JSON.stringify(cells);
  })`));
check('the flat and upright I pieces cross at the same square', run(`
  (() => { let flat = createPiece('I'); flat.x = 3; flat.y = 5;
           const upright = rotatePiece(flat, true);
           const cells = q => { const s = []; forEachBlock(q, (x, y) => s.push(x + ',' + y)); return s; };
           const shared = cells(flat).filter(v => cells(upright).indexOf(v) !== -1);
           return shared.length === 1; })()`));

console.log('board:');
check('empty board is 10x20 of zeros', run(`
  (() => { const b = createEmptyBoard(10, 20);
           return b.length === 20 && b[0].length === 10 && b.flat().every(v => v === 0); })()`));
check('isInsideBoard edges', run(`
  (() => { const b = createEmptyBoard(10, 20);
    return isInsideBoard(b,0,0) && isInsideBoard(b,9,19) && !isInsideBoard(b,10,0)
        && !isInsideBoard(b,-1,0) && !isInsideBoard(b,0,20); })()`));
check('piece cannot go through the left wall', run(`
  (() => { const b = createEmptyBoard(10, 20); const p = createPiece('O'); p.x = -1; p.y = 0;
           return !canPlacePiece(b, p); })()`));
check('piece cannot go through the right wall', run(`
  (() => { const b = createEmptyBoard(10, 20); const p = createPiece('O'); p.x = 9; p.y = 0;
           return !canPlacePiece(b, p); })()`));
check('piece cannot go through the floor', run(`
  (() => { const b = createEmptyBoard(10, 20); const p = createPiece('O'); p.x = 4; p.y = 19;
           return !canPlacePiece(b, p); })()`));
check('piece may hang above the ceiling', run(`
  (() => { const b = createEmptyBoard(10, 20); const p = createPiece('I'); p.x = 3; p.y = -1;
           return canPlacePiece(b, p); })()`));
check('merge stamps exactly 4 blocks', run(`
  (() => { const b = createEmptyBoard(10, 20); const p = createPiece('T'); p.x = 4; p.y = 5;
           const merged = mergePieceIntoBoard(b, p);
           return merged.flat().filter(v => v === 1).length === 4
               && b.flat().every(v => v === 0); })()`));
check('overlapping a locked block is refused', run(`
  (() => { let b = createEmptyBoard(10, 20); const p = createPiece('O'); p.x = 4; p.y = 18;
           b = mergePieceIntoBoard(b, p); return !canPlacePiece(b, p); })()`));
check('isRowFull', run('isRowFull([1,1,1,1]) && !isRowFull([1,1,0,1]) '));
check('findFullRows finds the right rows', run(`
  (() => { const b = createEmptyBoard(4, 4);
           b[1] = [1,1,1,1]; b[3] = [1,1,1,1]; b[2] = [1,0,1,1];
           return JSON.stringify(findFullRows(b)); })()`) === '[1,3]');
check('removeRows keeps the height and pushes rows down', run(`
  (() => { const b = createEmptyBoard(4, 4);
           b[2] = [1,1,1,1]; b[3] = [1,0,0,0];
           const out = removeRows(b, [2]);
           return out.length === 4 && out[0].every(v => v === 0)
               && JSON.stringify(out[3]) === '[1,0,0,0]'; })()`));
check('dropDistance to an empty floor', run(`
  (() => { const b = createEmptyBoard(10, 20); const p = createPiece('O'); p.x = 4; p.y = 0;
           return dropDistance(b, p); })()`) === 18);
check('dropDistance stops on a pile', run(`
  (() => { let b = createEmptyBoard(10, 20);
           b[19][4] = 1; b[19][5] = 1;
           const p = createPiece('O'); p.x = 4; p.y = 0;
           return dropDistance(b, p); })()`) === 17);

console.log('game rules:');
check('scoreForLines table', run(`
  [scoreForLines(0,1),scoreForLines(1,1),scoreForLines(2,1),scoreForLines(3,1),
   scoreForLines(4,1),scoreForLines(4,3)].join(',')`) === '0,100,300,500,800,2400');
check('levelForLines', run(`
  [levelForLines(0),levelForLines(9),levelForLines(10),levelForLines(35)].join(',')`) === '1,1,2,4');
check('dropIntervalForLevel gets faster and has a floor', run(`
  dropIntervalForLevel(1) === 800 && dropIntervalForLevel(2) === 735
  && dropIntervalForLevel(30) === 90`));
check('new game is ready to play', run(`
  (() => { const g = createGame();
           return g.piece !== null && g.nextType !== null && g.score === 0
               && g.level === 1 && !g.isOver; })()`));
check('new piece is centred at the top', run(`
  (() => { const g = createGame();
           return g.piece.y === 0 && g.piece.x === Math.floor((10 - g.piece.cells.length)/2); })()`));
check('tryMove sideways works and is blocked by walls', run(`
  (() => { const g = createGame(); const startX = g.piece.x;
           const moved = tryMove(g, -1, 0);
           let blocked = 0;
           for (let i = 0; i < 20; i++) { if (!tryMove(g, -1, 0)) blocked++; }
           return moved && g.piece.x < startX && blocked > 0; })()`));
check('rotation keeps the piece on the board', run(`
  (() => { const g = createGame();
           for (let i = 0; i < 30; i++) { tryMove(g, -1, 0); }
           for (let i = 0; i < 4; i++) { tryRotate(g, true); }
           return canPlacePiece(g.board, g.piece); })()`));
check('hard drop lands the piece and spawns a new one', run(`
  (() => { const g = createGame(); const before = g.piece.type;
           hardDrop(g);
           const filled = g.board.flat().filter(v => v === 1).length;
           return filled === 4 && g.piece !== null && g.score > 0; })()`));
check('a full row is cleared and scored', run(`
  (() => { const g = createGame();
           /* fill row 19 except columns 4 and 5 */
           for (let x = 0; x < 10; x++) { if (x !== 4 && x !== 5) g.board[19][x] = 1; }
           g.piece = createPiece('O'); g.piece.x = 4; g.piece.y = 0;
           g.nextType = 'T';
           hardDrop(g);
           return g.lines === 1 && g.score >= 100
               && g.board[19].filter(v => v === 1).length === 2; })()`));
check('four rows at once scores 800', run(`
  (() => { const g = createGame(); g.score = 0;
           for (let y = 16; y <= 19; y++) {
             for (let x = 0; x < 10; x++) { if (x !== 0) g.board[y][x] = 1; }
           }
           g.piece = createPiece('I');
           g.piece.cells = rotateMatrixClockwise(g.piece.cells);
           g.piece.x = -2; g.piece.y = 16;
           const scoreBefore = g.score;
           hardDrop(g);
           return g.lines === 4 && (g.score - scoreBefore) >= 800; })()`));
check('game ends when the pile reaches the top', run(`
  (() => { const g = createGame();
           for (let y = 0; y < 20; y++) { for (let x = 0; x < 10; x++) { g.board[y][x] = 1; } }
           spawnPiece(g);
           return g.isOver; })()`));
check('gravity moves the piece down over time', run(`
  (() => { const g = createGame(); const y0 = g.piece.y;
           updateGame(g, 900);
           return g.piece.y === y0 + 1; })()`));
check('pause freezes gravity', run(`
  (() => { const g = createGame(); g.isPaused = true; const y0 = g.piece.y;
           updateGame(g, 5000);
           return g.piece.y === y0; })()`));
check('ghost piece rests on the floor', run(`
  (() => { const g = createGame(); const ghost = getGhostPiece(g);
           return !canPlacePiece(g.board, movePiece(ghost, 0, 1)); })()`));

console.log('long random game (2000 moves):');
const sim = run(`
  (() => {
    const g = createGame();
    let steps = 0, locked = 0;
    while (!g.isOver && steps < 2000) {
      const r = Math.random();
      if (r < 0.25) { tryMove(g, -1, 0); }
      else if (r < 0.5) { tryMove(g, 1, 0); }
      else if (r < 0.65) { tryRotate(g, true); }
      else if (r < 0.7) { tryRotate(g, false); }
      else if (r < 0.9) { softDrop(g); }
      else { hardDrop(g); locked++; }
      updateGame(g, 120);
      if (g.board.length !== 20) { return 'BAD HEIGHT'; }
      if (g.board.some(row => row.length !== 10)) { return 'BAD WIDTH'; }
      if (g.board.flat().some(v => v !== 0 && v !== 1)) { return 'BAD CELL'; }
      if (g.piece && !g.isOver && !canPlacePiece(g.board, g.piece)) { return 'PIECE OVERLAPS'; }
      steps++;
    }
    return { over: g.isOver, steps, score: g.score, lines: g.lines, level: g.level };
  })()`);
check('random play stays legal', typeof sim === 'object', sim);
console.log('   result:', JSON.stringify(sim));

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
