# Tetris libraries

All the JavaScript for the Tetris game lives in this folder. `../tetris.html` is
only a page with a canvas and some buttons — it loads these six files in order:

```
tetris-shapes.js  →  tetris-board.js  →  tetris-game.js
                  →  tetris-draw.js   →  tetris-input.js  →  tetris-main.js
```

Each file has one job, and every function has a comment above it saying:

* **INPUT** — what you give it
* **OUTPUT** — what it gives back
* **ALGORITHM** — the steps, in plain English

That means any function can be emptied out and re-written from its comment. The
rest of the game keeps working the moment your version is correct.

## How the data is shaped

Only two shapes of data exist in the whole game.

**A board** is an array of rows of numbers. `0` is empty, `1` is a locked block.

```js
board[row][column]        // row 0 = top, row 19 = bottom
                          // column 0 = left wall, column 9 = right wall
```

**A piece** is an object holding a small square matrix and where its top-left
corner sits on the board.

```js
{ type: 'T', cells: [[0,1,0],
                     [1,1,1],
                     [0,0,0]], x: 4, y: 0 }
```

## The files

| File | Job | Functions |
|---|---|---|
| `tetris-shapes.js` | the seven tetrominoes and turning them | `copyMatrix`, `rotateMatrixClockwise`, `rotateMatrixCounterClockwise`, `createPiece`, `copyPiece`, `movePiece`, `rotatePiece`, `forEachBlock`, `randomShapeType`, `createShuffledBag` |
| `tetris-board.js` | the grid, collisions and line clearing | `createEmptyBoard`, `copyBoard`, `boardWidth`, `boardHeight`, `isInsideBoard`, `isCellFilled`, `canPlacePiece`, `mergePieceIntoBoard`, `isRowFull`, `findFullRows`, `removeRows`, `dropDistance`, `highestFilledRow` |
| `tetris-game.js` | the rules: falling, scoring, levels | `createGame`, `takeFromBag`, `startingColumn`, `spawnPiece`, `tryMove`, `tryRotate`, `softDrop`, `hardDrop`, `scoreForLines`, `levelForLines`, `dropIntervalForLevel`, `lockPiece`, `updateGame`, `getGhostPiece`, `togglePause` |
| `tetris-draw.js` | painting the black-and-white picture | `clearCanvas`, `drawGrid`, `drawBlock`, `drawGhostBlock`, `drawBoardBlocks`, `drawPiece`, `drawGhost`, `drawFrame`, `drawMessage`, `renderGame`, `renderNextPiece` |
| `tetris-input.js` | keyboard and touch buttons | `actionForKey`, `isHoldableAction`, `createInputState`, `pressKey`, `releaseKey`, `updateHeldKey`, `shouldBlockBrowserKey`, `connectButton` |
| `tetris-main.js` | the glue between the page and the rules | `getElement`, `updateScoreboard`, `updatePauseButton`, `drawEverything`, `buildActions`, `startNewGame`, `gameLoop`, `connectKeyboard`, `connectTouchButtons`, `setUpGame` |

## A practice ladder

Re-write these in order. Empty the function body, keep the comment, and reload
`tetris.html` — the game itself is the test.

**Warm up (a few lines each)**

1. `isRowFull(row)` → `true` when every number in the row is `1`
2. `copyMatrix(matrix)` → a deep copy, so changing the copy never touches the original
3. `boardWidth(board)` / `boardHeight(board)` → the size of the grid
4. `isInsideBoard(board, x, y)` → is this square on the field?
5. `levelForLines(totalLines)` → `1` for 0–9 lines, `2` for 10–19, …
6. `scoreForLines(lineCount, level)` → the 0 / 100 / 300 / 500 / 800 table, times the level

**Real algorithms**

7. `findFullRows(board)` → the list of complete row numbers
8. `rotateMatrixClockwise(matrix)` → `answer[r][c] = matrix[N-1-c][r]`
9. `removeRows(board, rowNumbers)` → keep the other rows, add empty rows on top
10. `canPlacePiece(board, piece)` → the referee for every move in the game
11. `dropDistance(board, piece)` → how far down the piece can still go
12. `createShuffledBag()` → the Fisher–Yates shuffle

**Putting it together**

13. `tryMove(state, dx, dy)` → try the move on a copy, keep it only if it is legal
14. `tryRotate(state, clockwise)` → rotation plus the sideways "wall kick" nudges
15. `lockPiece(state)` → merge, clear, score, level up, spawn the next piece
16. `updateGame(state, elapsedMs)` → gravity, driven by a timer
17. `updateHeldKey(input, elapsedMs, actions)` → the delay-then-repeat rule for held keys

## Ideas to build on top

* Show the piece count, or a timer.
* Add a "hold piece" box (press C to store a piece for later).
* Award bonus points for clearing lines twice in a row.
* Write your own `randomShapeType` — it is already in the file but the game
  prefers `createShuffledBag`, which is fairer. Try both and feel the difference.
* Make a wider or taller board: `BOARD_WIDTH` and `BOARD_HEIGHT` in
  `tetris-board.js` are the only two numbers you need to change.
