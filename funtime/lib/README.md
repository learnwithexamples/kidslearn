# Game libraries

All the JavaScript for the three games lives in this folder — Tetris, then
Snake, then Car Racing, then the shared workshop engine. (The Python versions
of the same games live in `../pylib/`.)

# Tetris

`../tetris.html` is only a page with a canvas and some buttons — it loads these
six files in order:

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
| `tetris-shapes.js` | the seven tetrominoes and turning them | `copyMatrix`, `rotateMatrixClockwise`, `rotateMatrixCounterClockwise`, `createPiece`, `copyPiece`, `movePiece`, `rotatePiece`, `centerLongBar`, `forEachBlock`, `randomShapeType`, `createShuffledBag` |
| `tetris-board.js` | the grid, collisions and line clearing | `createEmptyBoard`, `copyBoard`, `boardWidth`, `boardHeight`, `isInsideBoard`, `isCellFilled`, `canPlacePiece`, `mergePieceIntoBoard`, `isRowFull`, `findFullRows`, `removeRows`, `dropDistance`, `highestFilledRow` |
| `tetris-game.js` | the rules: falling, scoring, levels | `createGame`, `takeFromBag`, `startingColumn`, `spawnPiece`, `tryMove`, `tryRotate`, `softDrop`, `hardDrop`, `scoreForLines`, `levelForLines`, `dropIntervalForLevel`, `lockPiece`, `updateGame`, `getGhostPiece`, `togglePause` |
| `tetris-draw.js` | painting the black-and-white picture | `clearCanvas`, `drawGrid`, `drawBlock`, `drawGhostBlock`, `drawBoardBlocks`, `drawPiece`, `drawGhost`, `drawFrame`, `drawMessage`, `renderGame`, `renderNextPiece` |
| `tetris-input.js` | keyboard and touch buttons | `actionForKey`, `isHoldableAction`, `createInputState`, `pressKey`, `releaseKey`, `updateHeldKey`, `shouldBlockBrowserKey`, `connectButton` |
| `tetris-main.js` | the glue between the page and the rules | `getElement`, `updateScoreboard`, `updatePauseButton`, `drawEverything`, `buildActions`, `startNewGame`, `gameLoop`, `connectKeyboard`, `connectTouchButtons`, `setUpGame` |

## The guided version

`../tetris-build.html` ("Build Tetris Yourself") walks through twelve of these
functions one at a time: it explains each one, lets you write it, runs real
tests on your version, and shows the game growing beside the editor. Its steps
live in `tetris-steps.js` and its demos in `tetris-build.js`.

Prefer to work straight in the files? Use the ladder below.

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


# Snake

`../snake.html` loads five files in order:

```
snake-grid.js  →  snake-game.js  →  snake-draw.js  →  snake-input.js  →  snake-main.js
```

## How the data is shaped

**A position** is one square of the field. **A direction** is a step to take.

```js
{ x: 3, y: 7 }             // x = column (0 = left wall), y = row (0 = TOP)
DIRECTIONS.up              // { x: 0, y: -1 } — up is MINUS, row 0 is the top
```

**A snake** is simply a list of positions, head first:

```js
[ {x:10,y:10}, {x:9,y:10}, {x:8,y:10} ]      // head, body, tail
```

Moving is "add a head, drop a tail". Eating is "add a head, keep the tail".
That one sentence is the whole game.

## The files

| File | Job | Functions |
|---|---|---|
| `snake-grid.js` | squares, directions, and what is where | `createPosition`, `samePosition`, `addDirection`, `isInsideGrid`, `containsPosition`, `isOppositeDirection`, `emptyCells`, `randomEmptyCell` |
| `snake-game.js` | the rules: crawling, eating, growing, dying | `createStartingSnake`, `createGame`, `moveSnake`, `turnSnake`, `scoreForFood`, `levelForFood`, `stepIntervalForLevel`, `stepGame`, `updateGame`, `togglePause`, `snakeLength` |
| `snake-draw.js` | painting the black-and-white picture | `clearCanvas`, `drawGrid`, `drawSegment`, `drawHead`, `drawFood`, `drawFrame`, `drawMessage`, `renderGame` |
| `snake-input.js` | keyboard and touch buttons | `actionForKey`, `directionForAction`, `shouldBlockBrowserKey`, `connectButton` |
| `snake-main.js` | the glue between the page and the rules | `getElement`, `loadBestScore`, `saveBestScore`, `updateScoreboard`, `updatePauseButton`, `drawEverything`, `buildActions`, `startNewGame`, `gameLoop`, `connectKeyboard`, `connectTouchButtons`, `setUpGame` |

## The guided version

`../snake-build.html` ("Build Snake Yourself") walks through twelve of these
functions one step at a time, in this order:

1. `createStartingSnake` — a snake appears
2. `samePosition` — the game can compare two squares
3. `addDirection` — the head takes a step
4. `moveSnake` — it crawls
5. `isInsideGrid` — walls kill
6. `containsPosition` — biting yourself kills
7. `randomEmptyCell` — apples appear and the snake grows
8. `isOppositeDirection` — no U-turns
9. `stepGame` — one whole turn of the game (the boss step)
10. `scoreForFood` — points
11. `stepIntervalForLevel` — speed by level
12. `actionForKey` — the keyboard, and the game is finished

## Ideas to build on top

* Make the walls wrap around instead of killing you.
* Put two apples on the board at once, or a rotten one to avoid.
* Add a wall of blocks in the middle for a harder field.
* Slow the snake down for one second after it eats, as a reward.
* Change `GRID_WIDTH` and `GRID_HEIGHT` in `snake-grid.js` — everything else
  works those out for itself.

# The workshop engine

`workshop.js` runs BOTH "Build it yourself" pages: it handles the steps, the
editor, the tests, the progress dots, the saved work and the demo panel, and it
knows nothing about either game. Each game supplies its own steps
(`*-steps.js`) and its own demos (`*-build.js`), and calls `startWorkshop(...)`.
`../../styles/workshop.css` gives both pages their look.


# Car Racing

`../race.html` loads five files in order:

```
race-road.js  →  race-game.js  →  race-draw.js  →  race-input.js  →  race-main.js
```

## How the data is shaped

There is no grid here: cars sit at real **pixel** positions, and every car —
yours and the traffic — is the same thing, a rectangle:

```js
{ x: 38, y: 120, width: 44, height: 74, lane: 0 }   // x, y = TOP-LEFT corner
```

Your car never moves forward. The traffic slides *down* and the road markings
scroll — that is the whole illusion of speed, and it lives in `moveCars`.

## The files

| File | Job | Functions |
|---|---|---|
| `race-road.js` | the road, the lanes and the shape of a car | `laneCenterX`, `clamp`, `createCar`, `overlaps`, `isOnScreen`, `randomLane` |
| `race-game.js` | the rules: steering, traffic, crashing, scoring | `createGame`, `steerPlayer`, `moveCars`, `keepCarsOnScreen`, `spawnCar`, `hasCrashed`, `scoreForPass`, `levelForPassed`, `speedForLevel`, `secondsBetweenCars`, `spawnGapForLevel`, `updateRace`, `togglePause`, `metresDriven` |
| `race-draw.js` | painting the black-and-white picture | `clearCanvas`, `drawDashedLine`, `drawRoad`, `drawCar`, `drawFrame`, `drawMessage`, `renderGame` |
| `race-input.js` | keys you HOLD, and touch buttons | `actionForKey`, `isHeldAction`, `createInputState`, `setHeld`, `releaseAll`, `steeringFromInput`, `boostFromInput`, `connectButton`, `connectHoldButton` |
| `race-main.js` | the glue between the page and the rules | `loadBestScore`, `updateScoreboard`, `startNewGame`, `gameLoop`, `connectKeyboard`, `connectTouchButtons`, `setUpGame` |

## The guided version

`../race-build.html` ("Build Car Racing Yourself") walks through twelve of
these functions one step at a time, in this order:

1. `laneCenterX` — the road gets lanes
2. `clamp` — the car stops at the verge
3. `createCar` — cars can be built
4. `overlaps` — the rectangle crash test every game needs
5. `steerPlayer` — you can drive
6. `moveCars` — the traffic flows
7. `keepCarsOnScreen` — cars you have passed are forgotten
8. `spawnCar` — the traffic never stops
9. `hasCrashed` — crashing ends the race
10. `updateRace` — one whole frame (the boss step)
11. `speedForLevel` — every level is faster
12. `actionForKey` — the keyboard, and the game is finished

## One design rule worth knowing

`spawnGapForLevel` works in **time**, not pixels: however fast the road gets,
there is always at least 0.8 seconds between cars, and a lane change takes
about 0.3. A game you cannot possibly survive is not a game — the gap is what
keeps every level hard but fair.

# Tests

Every game and every workshop is covered by a test suite that loads the real
library files. Nothing needs installing:

```bash
node funtime/tests/run-all.js
```

It runs twelve JavaScript suites (game rules, page wiring, workshop steps and
a full workshop walkthrough for each game, all driven against a pretend
browser) and the two Python suites in `../tests/`.
