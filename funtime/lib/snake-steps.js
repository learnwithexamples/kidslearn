/* ============================================================
   snake-steps.js — the twelve steps of "Build Snake Yourself"

   Each step describes ONE function from the real game:

     id       — a short name, also used to save your work in the browser
     fnName   — the exact function name you must write
     title    — what this step adds to the game
     intro    — why the game needs it
     spec     — INPUT / OUTPUT / ALGORITHM, the same style as the game's own
                comments
     starter  — the empty function you begin with
     answer   — one correct version (try hard before you look!)
     hints    — small nudges, shown one at a time
     tests    — the checks the Test button runs
     demo     — which live demo to show beside the editor

   A test is either:
     { name, args: [...], expect: value }        call the function and compare
     { name, check: function (fn) { ... } }      a custom check, returns
                                                 { ok: true/false, detail: '...' }
   ============================================================ */

const SNAKE_STEPS = [

/* ---------------------------------------------------------- 1 */
{
    id: 'createStartingSnake',
    fnName: 'createStartingSnake',
    title: 'Put a snake on the field',
    adds: 'The snake appears.',
    intro: '<p>The field is 20 squares across and 20 squares down. A square is written as an object with two numbers:</p>' +
           '<pre class="mini-code">{ x: 3, y: 7 }     x = column (0 is the left wall)\n' +
           '                   y = row    (0 is the TOP row)</pre>' +
           '<p>And here is the big idea of the whole game: <strong>a snake is just a list of squares</strong>. The first one in the list is the head, and the rest trail behind it.</p>' +
           '<p>A new snake is three squares long, sitting in the middle of the field, lying flat so it can set off to the right.</p>',
    spec: {
        input: 'nothing',
        output: 'An array of three positions, head first. The head is in the middle of the grid, and the other two squares are to its LEFT.',
        algorithm: [
            'Work out the middle column: GRID_WIDTH divided by 2, rounded down.',
            'Work out the middle row the same way with GRID_HEIGHT.',
            'Return an array of three positions: the middle square, then one square left of it, then one more square left again.'
        ]
    },
    warning: 'The head must be FIRST in the list. Everything else in the game — moving, growing, drawing the eyes — expects snake[0] to be the head.',
    starter: 'function createStartingSnake() {\n' +
             '    // the middle of the grid, plus two squares trailing to the left\n' +
             '}\n',
    answer: 'function createStartingSnake() {\n' +
            '    const middleX = Math.floor(GRID_WIDTH / 2);\n' +
            '    const middleY = Math.floor(GRID_HEIGHT / 2);\n' +
            '    return [\n' +
            '        createPosition(middleX, middleY),\n' +
            '        createPosition(middleX - 1, middleY),\n' +
            '        createPosition(middleX - 2, middleY)\n' +
            '    ];\n' +
            '}\n',
    hints: [
        'Math.floor(20 / 2) is 10 — that is the middle of a 20-wide grid.',
        'createPosition(x, y) builds one square for you; it is already written.',
        'All three squares share the same y (the same row); only the x changes: middleX, middleX - 1, middleX - 2.'
    ],
    tests: [
        { name: 'The snake is three squares long', check: function (fn) {
            const snake = fn();
            return { ok: Array.isArray(snake) && snake.length === 3, detail: 'got ' + JSON.stringify(snake) };
        } },
        { name: 'The head is in the middle of the grid', check: function (fn) {
            const head = fn()[0];
            const ok = head && head.x === 10 && head.y === 10;
            return { ok: ok, detail: 'head is at ' + JSON.stringify(head) + ', expected {"x":10,"y":10}' };
        } },
        { name: 'The body trails to the LEFT of the head', check: function (fn) {
            const snake = fn();
            const ok = snake[1].x === 9 && snake[1].y === 10 && snake[2].x === 8 && snake[2].y === 10;
            return { ok: ok, detail: 'got ' + JSON.stringify(snake) };
        } },
        { name: 'Every square is a real position with x and y', check: function (fn) {
            const snake = fn();
            const ok = snake.every(function (p) { return typeof p.x === 'number' && typeof p.y === 'number'; });
            return { ok: ok, detail: 'got ' + JSON.stringify(snake) };
        } },
        { name: 'The whole snake is on the field', check: function (fn) {
            const snake = fn();
            return { ok: snake.every(isInsideGrid), detail: 'part of the snake is off the grid' };
        } }
    ],
    demo: { kind: 'still', caption: 'Your snake, drawn on the 20 x 20 field. The head has eyes!' }
},

/* ---------------------------------------------------------- 2 */
{
    id: 'samePosition',
    fnName: 'samePosition',
    title: 'Are these two squares the same?',
    adds: 'The game can tell when the head reaches the apple.',
    intro: '<p>The game asks this question constantly: <em>is the head on the apple?</em> <em>Is the head on its own body?</em> Both are really the same tiny question — are these two squares the same square?</p>' +
           '<p>You cannot answer it with <code>===</code>. In JavaScript, two <em>different</em> objects that both say <code>{x: 3, y: 7}</code> are not <code>===</code> each other — so you must compare the numbers inside.</p>' +
           '<pre class="mini-code">{x:3, y:7} === {x:3, y:7}     // false! two different objects\nsamePosition({x:3,y:7}, {x:3,y:7})  // true — your job</pre>',
    spec: {
        input: 'a, b — two positions',
        output: 'true if both the x values and the y values match, otherwise false',
        algorithm: [
            'Check that a.x is the same as b.x.',
            'AND that a.y is the same as b.y.',
            'Return that answer — no if statement needed!'
        ]
    },
    starter: 'function samePosition(a, b) {\n' +
             '    // compare the numbers inside, not the objects themselves\n' +
             '}\n',
    answer: 'function samePosition(a, b) {\n' +
            '    return a.x === b.x && a.y === b.y;\n' +
            '}\n',
    hints: [
        'The whole function is one line beginning with return.',
        '&& means "and": both halves must be true.',
        'return a.x === b.x && a.y === b.y;'
    ],
    tests: [
        { name: 'The same square is the same square', args: [{ x: 3, y: 7 }, { x: 3, y: 7 }], expect: true },
        { name: 'A different column is not', args: [{ x: 3, y: 7 }, { x: 4, y: 7 }], expect: false },
        { name: 'A different row is not either', args: [{ x: 3, y: 7 }, { x: 3, y: 8 }], expect: false },
        { name: 'Swapped numbers are not the same square', args: [{ x: 3, y: 7 }, { x: 7, y: 3 }], expect: false },
        { name: 'The corner square works', args: [{ x: 0, y: 0 }, { x: 0, y: 0 }], expect: true },
        { name: 'It answers true or false, not something else', check: function (fn) {
            const value = fn({ x: 1, y: 1 }, { x: 1, y: 1 });
            return { ok: value === true, detail: 'got ' + JSON.stringify(value) + ' — use === so you get a real true' };
        } }
    ],
    demo: { kind: 'compare', caption: 'Move the head onto the apple and watch your function answer true.' }
},

/* ---------------------------------------------------------- 3 */
{
    id: 'addDirection',
    fnName: 'addDirection',
    title: 'Take one step',
    adds: 'The head can move one square in any direction.',
    intro: '<p>A direction is just a small step written as numbers:</p>' +
           '<pre class="mini-code">DIRECTIONS.right = { x:  1, y:  0 }\n' +
           'DIRECTIONS.left  = { x: -1, y:  0 }\n' +
           'DIRECTIONS.up    = { x:  0, y: -1 }   ← up is MINUS one\n' +
           'DIRECTIONS.down  = { x:  0, y:  1 }</pre>' +
           '<p>Up is <code>-1</code> because row 0 is at the top of the screen: going up means the row number gets smaller.</p>' +
           '<p>To take a step you add the direction to the position. That one idea makes the snake move.</p>',
    spec: {
        input: 'position — where you are now. direction — the step to take.',
        output: 'A NEW position, one square along. The old one must not change.',
        algorithm: [
            'Add direction.x to position.x — that is the new x.',
            'Add direction.y to position.y — that is the new y.',
            'Return a new object with those two numbers.'
        ]
    },
    warning: 'Build and return a NEW object. If you write position.x = position.x + direction.x you have changed a square the snake is still using, and strange things will happen.',
    starter: 'function addDirection(position, direction) {\n' +
             '    // return a NEW position, one step along\n' +
             '}\n',
    answer: 'function addDirection(position, direction) {\n' +
            '    return { x: position.x + direction.x, y: position.y + direction.y };\n' +
            '}\n',
    hints: [
        'You can build an object straight inside the return: return { x: ..., y: ... };',
        'The new x is position.x + direction.x.',
        'return { x: position.x + direction.x, y: position.y + direction.y };'
    ],
    tests: [
        { name: 'Stepping right adds 1 to x', args: [{ x: 5, y: 5 }, { x: 1, y: 0 }], expect: { x: 6, y: 5 } },
        { name: 'Stepping left takes 1 off x', args: [{ x: 5, y: 5 }, { x: -1, y: 0 }], expect: { x: 4, y: 5 } },
        { name: 'Stepping up takes 1 off y', args: [{ x: 5, y: 5 }, { x: 0, y: -1 }], expect: { x: 5, y: 4 } },
        { name: 'Stepping down adds 1 to y', args: [{ x: 5, y: 5 }, { x: 0, y: 1 }], expect: { x: 5, y: 6 } },
        { name: 'It works from the corner too', args: [{ x: 0, y: 0 }, { x: 0, y: -1 }], expect: { x: 0, y: -1 } },
        { name: 'The old position is left alone', check: function (fn) {
            const start = { x: 5, y: 5 };
            fn(start, { x: 1, y: 0 });
            const ok = start.x === 5 && start.y === 5;
            return { ok: ok, detail: ok ? '' : 'the position you were given became ' + JSON.stringify(start) };
        } },
        { name: 'It really is a new object', check: function (fn) {
            const start = { x: 2, y: 2 };
            const result = fn(start, { x: 0, y: 0 });
            return { ok: result !== start, detail: 'you returned the same object instead of a new one' };
        } }
    ],
    demo: { kind: 'head', caption: 'Steer the head with the buttons. Nothing stops it yet — the walls come in step 5!' }
},

/* ---------------------------------------------------------- 4 */
{
    id: 'moveSnake',
    fnName: 'moveSnake',
    title: 'Make the snake crawl',
    adds: 'The snake slithers around the field.',
    intro: '<p>Here is the trick that makes Snake work, and it surprises almost everybody: <strong>the snake does not really move</strong>. You add a new head at the front and drop the tail off the back. Do that fast enough and it looks like slithering.</p>' +
           '<pre class="mini-code">before:  [head] [body] [tail]\nafter:   [NEW ] [head] [body]     ← tail dropped</pre>' +
           '<p>And growing? Exactly the same, except you <em>keep</em> the tail. That is the entire difference between walking and eating.</p>',
    spec: {
        input: 'snake — the array of positions. newHead — where the head is going. grow — true if it just ate.',
        output: 'A NEW array of positions',
        algorithm: [
            'Start a new array with newHead as its only item.',
            'Add every square of the old snake after it, in order.',
            'If grow is NOT true, remove the last square (pop).',
            'Return the new array.'
        ]
    },
    starter: 'function moveSnake(snake, newHead, grow) {\n' +
             '    // 1. a new list that starts with newHead\n' +
             '    // 2. then all the old squares\n' +
             '    // 3. drop the last one unless the snake is growing\n' +
             '}\n',
    answer: 'function moveSnake(snake, newHead, grow) {\n' +
            '    const moved = [newHead];\n' +
            '    for (let i = 0; i < snake.length; i++) {\n' +
            '        moved.push(snake[i]);\n' +
            '    }\n' +
            '    if (!grow) {\n' +
            '        moved.pop();\n' +
            '    }\n' +
            '    return moved;\n' +
            '}\n',
    hints: [
        'const moved = [newHead];  starts the list with the head already in it.',
        'A for loop then pushes every old square onto the end.',
        'moved.pop() removes the last item — do that only when grow is false.'
    ],
    tests: [
        { name: 'The new head goes on the front', check: function (fn) {
            const out = fn([{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }], { x: 3, y: 0 }, false);
            return { ok: out[0].x === 3 && out[0].y === 0, detail: 'the first square is ' + JSON.stringify(out[0]) };
        } },
        { name: 'Walking keeps the same length', args: [[{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }], { x: 3, y: 0 }, false],
          expect: [{ x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }] },
        { name: 'Growing makes it one square longer', args: [[{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }], { x: 3, y: 0 }, true],
          expect: [{ x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }] },
        { name: 'A one-square snake still works', args: [[{ x: 5, y: 5 }], { x: 6, y: 5 }, false], expect: [{ x: 6, y: 5 }] },
        { name: 'The old snake is not damaged', check: function (fn) {
            const snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }];
            fn(snake, { x: 3, y: 0 }, false);
            return { ok: snake.length === 2, detail: 'the snake you were given is now ' + snake.length + ' squares long' };
        } },
        { name: 'It returns a new array, not the old one', check: function (fn) {
            const snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }];
            const out = fn(snake, { x: 3, y: 0 }, false);
            return { ok: out !== snake, detail: 'you returned the same array instead of a new one' };
        } }
    ],
    demo: { kind: 'mini', flags: {}, caption: 'It crawls! There are no walls yet, so it wraps around the edges for now.' }
},

/* ---------------------------------------------------------- 5 */
{
    id: 'isInsideGrid',
    fnName: 'isInsideGrid',
    title: 'Build the walls',
    adds: 'Leaving the field is fatal.',
    intro: '<p>Right now the snake can crawl straight off the edge of the world. Time to put the walls up.</p>' +
           '<p>The field is <code>GRID_WIDTH</code> squares across and <code>GRID_HEIGHT</code> squares down — 20 each. So the columns run from 0 to 19, and so do the rows. Anything else is outside.</p>',
    spec: {
        input: 'position — a position',
        output: 'true if the square is on the field, false if it has gone through a wall',
        algorithm: [
            'x must be 0 or more, AND less than GRID_WIDTH.',
            'y must be 0 or more, AND less than GRID_HEIGHT.',
            'Return true only when all four of those are true.'
        ]
    },
    warning: 'Watch the last square! The grid is 20 wide, so column 19 is the last one INSIDE and column 20 is already through the wall. That is why it is < GRID_WIDTH and not <= .',
    starter: 'function isInsideGrid(position) {\n' +
             '    // four checks joined with &&\n' +
             '}\n',
    answer: 'function isInsideGrid(position) {\n' +
            '    return position.x >= 0 && position.x < GRID_WIDTH &&\n' +
            '           position.y >= 0 && position.y < GRID_HEIGHT;\n' +
            '}\n',
    hints: [
        'You can join as many checks as you like with &&.',
        'The left wall is position.x >= 0; the right wall is position.x < GRID_WIDTH.',
        'Then do exactly the same for y with GRID_HEIGHT.'
    ],
    tests: [
        { name: 'The middle of the field is inside', args: [{ x: 10, y: 10 }], expect: true },
        { name: 'The top-left corner is inside', args: [{ x: 0, y: 0 }], expect: true },
        { name: 'The bottom-right corner is inside', args: [{ x: 19, y: 19 }], expect: true },
        { name: 'Through the left wall is outside', args: [{ x: -1, y: 5 }], expect: false },
        { name: 'Through the right wall is outside', args: [{ x: 20, y: 5 }], expect: false },
        { name: 'Above the top is outside', args: [{ x: 5, y: -1 }], expect: false },
        { name: 'Below the bottom is outside', args: [{ x: 5, y: 20 }], expect: false },
        { name: 'A long way out is outside', args: [{ x: 99, y: 99 }], expect: false }
    ],
    demo: { kind: 'mini', flags: { walls: true }, caption: 'Crash into a wall on purpose — your function is the wall.' }
},

/* ---------------------------------------------------------- 6 */
{
    id: 'containsPosition',
    fnName: 'containsPosition',
    title: 'Do not bite yourself',
    adds: 'Running into your own body ends the game.',
    intro: '<p>The other way to die is to bite yourself. To spot that, the game needs to ask: <em>is this square anywhere in that list of squares?</em></p>' +
           '<p>Notice that this reuses <code>samePosition</code> from step 2. Small functions build bigger ones — that is the whole craft.</p>',
    spec: {
        input: 'list — an array of positions (usually the snake). position — one square.',
        output: 'true if the list holds a square with the same x and y, otherwise false',
        algorithm: [
            'Walk through the list one square at a time.',
            'If samePosition says this one matches, answer true straight away.',
            'If you reach the end without a match, answer false.'
        ]
    },
    starter: 'function containsPosition(list, position) {\n' +
             '    // look through the list; you already have samePosition(a, b)\n' +
             '}\n',
    answer: 'function containsPosition(list, position) {\n' +
            '    for (let i = 0; i < list.length; i++) {\n' +
            '        if (samePosition(list[i], position)) {\n' +
            '            return true;\n' +
            '        }\n' +
            '    }\n' +
            '    return false;\n' +
            '}\n',
    hints: [
        'A for loop over the list, exactly like isRowFull in the Tetris course.',
        'Inside the loop: if (samePosition(list[i], position)) { return true; }',
        'return false; goes AFTER the loop — you only know it is missing once you have checked every square.'
    ],
    tests: [
        { name: 'It finds a square that is there', args: [[{ x: 1, y: 1 }, { x: 2, y: 2 }], { x: 2, y: 2 }], expect: true },
        { name: 'It finds the first square', args: [[{ x: 1, y: 1 }, { x: 2, y: 2 }], { x: 1, y: 1 }], expect: true },
        { name: 'It says false for a square that is missing', args: [[{ x: 1, y: 1 }, { x: 2, y: 2 }], { x: 3, y: 3 }], expect: false },
        { name: 'An empty list holds nothing', args: [[], { x: 0, y: 0 }], expect: false },
        { name: 'It compares the numbers, not the objects', check: function (fn) {
            const snake = [{ x: 4, y: 4 }];
            const otherObject = { x: 4, y: 4 };
            return { ok: fn(snake, otherObject) === true, detail: 'a different object with the same x and y must still count as found' };
        } },
        { name: 'It works on a long snake', check: function (fn) {
            const snake = [];
            for (let i = 0; i < 50; i++) { snake.push({ x: i, y: 3 }); }
            const ok = fn(snake, { x: 49, y: 3 }) === true && fn(snake, { x: 49, y: 4 }) === false;
            return { ok: ok, detail: '' };
        } }
    ],
    demo: { kind: 'mini', flags: { walls: true, self: true }, caption: 'Turn back on yourself and the game ends. (Step 8 stops you doing it by accident.)' }
},

/* ---------------------------------------------------------- 7 */
{
    id: 'randomEmptyCell',
    fnName: 'randomEmptyCell',
    title: 'Drop the apples',
    adds: 'Apples appear — and the snake grows.',
    intro: '<p>Every apple must land on a free square. Never under the snake, never outside the field.</p>' +
           '<p>The tempting way is to guess random squares until you hit a free one. That works at first, but as the snake fills the board it takes longer and longer — and when the board is completely full it <em>never stops</em>. So we do it the safe way: list every free square, then pick one.</p>' +
           '<p>You already have <code>emptyCells(occupied)</code>, which gives you that list.</p>',
    spec: {
        input: 'occupied — an array of positions (the snake)',
        output: 'one free position picked at random, or null when there are no free squares left',
        algorithm: [
            'Ask emptyCells(occupied) for every free square.',
            'If the list is empty, return null — the player has filled the whole board!',
            'Pick a random index: Math.floor(Math.random() * free.length).',
            'Return the square at that index.'
        ]
    },
    warning: 'Math.random() gives a number from 0 up to (but never quite) 1. Multiply it by the length and round DOWN with Math.floor to get a real index.',
    starter: 'function randomEmptyCell(occupied) {\n' +
             '    const free = emptyCells(occupied);\n' +
             '    // no free squares? return null. Otherwise pick one at random.\n' +
             '}\n',
    answer: 'function randomEmptyCell(occupied) {\n' +
            '    const free = emptyCells(occupied);\n' +
            '    if (free.length === 0) {\n' +
            '        return null;\n' +
            '    }\n' +
            '    const index = Math.floor(Math.random() * free.length);\n' +
            '    return free[index];\n' +
            '}\n',
    hints: [
        'Deal with the empty case first: if (free.length === 0) { return null; }',
        'Math.floor(Math.random() * free.length) is a random position in the list.',
        'Return free[index] — the square itself, not the index.'
    ],
    tests: [
        { name: 'It gives back a real square', check: function (fn) {
            const cell = fn(createStartingSnake());
            const ok = cell !== null && typeof cell.x === 'number' && typeof cell.y === 'number';
            return { ok: ok, detail: 'got ' + JSON.stringify(cell) };
        } },
        { name: 'The square is always on the field', check: function (fn) {
            const snake = createStartingSnake();
            for (let i = 0; i < 100; i++) {
                const cell = fn(snake);
                if (!isInsideGrid(cell)) { return { ok: false, detail: 'got ' + JSON.stringify(cell) }; }
            }
            return { ok: true, detail: '' };
        } },
        { name: 'It never lands on the snake (100 tries)', check: function (fn) {
            const snake = createStartingSnake();
            for (let i = 0; i < 100; i++) {
                const cell = fn(snake);
                if (containsPosition(snake, cell)) { return { ok: false, detail: 'it put the apple on the snake at ' + JSON.stringify(cell) }; }
            }
            return { ok: true, detail: '' };
        } },
        { name: 'With one free square, it finds that square', check: function (fn) {
            const everywhere = [];
            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    if (!(x === 7 && y === 12)) { everywhere.push({ x: x, y: y }); }
                }
            }
            const cell = fn(everywhere);
            const ok = cell !== null && cell.x === 7 && cell.y === 12;
            return { ok: ok, detail: 'got ' + JSON.stringify(cell) + ', expected {"x":7,"y":12}' };
        } },
        { name: 'A completely full board gives null', check: function (fn) {
            const everywhere = [];
            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) { everywhere.push({ x: x, y: y }); }
            }
            const cell = fn(everywhere);
            return { ok: cell === null, detail: 'got ' + JSON.stringify(cell) + ' — this must be null, or the game can never be won' };
        } },
        { name: 'It really is random (not always the same square)', check: function (fn) {
            const snake = createStartingSnake();
            const seen = {};
            for (let i = 0; i < 60; i++) {
                const cell = fn(snake);
                seen[cell.x + ',' + cell.y] = true;
            }
            const count = Object.keys(seen).length;
            return { ok: count > 5, detail: 'in 60 tries it only ever picked ' + count + ' different square(s)' };
        } }
    ],
    demo: { kind: 'mini', flags: { walls: true, self: true, eat: true }, caption: 'Steer onto an apple: the snake grows and a new apple appears somewhere free.' }
},

/* ---------------------------------------------------------- 8 */
{
    id: 'isOppositeDirection',
    fnName: 'isOppositeDirection',
    title: 'No U-turns',
    adds: 'The snake can no longer turn back into its own neck.',
    intro: '<p>Try this in the demo: while the snake is heading right, press ←. It instantly eats itself — because its neck is right there. Real Snake simply refuses that turn.</p>' +
           '<p>Two directions are opposites when they cancel each other out. Add them up: right <code>{x:1}</code> plus left <code>{x:-1}</code> is <code>0</code>, and their y values are both 0 too. Two zeros means opposite.</p>',
    spec: {
        input: 'a, b — two directions',
        output: 'true for up/down or left/right, false for anything else (including two identical directions)',
        algorithm: [
            'Add the two x values together.',
            'Add the two y values together.',
            'Return true only if BOTH sums are 0.'
        ]
    },
    starter: 'function isOppositeDirection(a, b) {\n' +
             '    // opposite steps cancel out: both sums are zero\n' +
             '}\n',
    answer: 'function isOppositeDirection(a, b) {\n' +
            '    return a.x + b.x === 0 && a.y + b.y === 0;\n' +
            '}\n',
    hints: [
        'This is one line, like samePosition — but with + instead of ===.',
        'a.x + b.x === 0 checks the sideways halves cancel out.',
        'return a.x + b.x === 0 && a.y + b.y === 0;'
    ],
    tests: [
        { name: 'Up and down are opposites', args: [{ x: 0, y: -1 }, { x: 0, y: 1 }], expect: true },
        { name: 'Left and right are opposites', args: [{ x: -1, y: 0 }, { x: 1, y: 0 }], expect: true },
        { name: 'Right and left are opposites the other way round', args: [{ x: 1, y: 0 }, { x: -1, y: 0 }], expect: true },
        { name: 'Up and left are not opposites', args: [{ x: 0, y: -1 }, { x: -1, y: 0 }], expect: false },
        { name: 'Up and right are not opposites', args: [{ x: 0, y: -1 }, { x: 1, y: 0 }], expect: false },
        { name: 'The same direction is not its own opposite', args: [{ x: 0, y: -1 }, { x: 0, y: -1 }], expect: false },
        { name: 'It works on the real DIRECTIONS', check: function (fn) {
            const ok = fn(DIRECTIONS.up, DIRECTIONS.down) === true &&
                       fn(DIRECTIONS.left, DIRECTIONS.right) === true &&
                       fn(DIRECTIONS.up, DIRECTIONS.right) === false &&
                       fn(DIRECTIONS.down, DIRECTIONS.down) === false;
            return { ok: ok, detail: '' };
        } }
    ],
    demo: { kind: 'mini', flags: { walls: true, self: true, eat: true, noReverse: true },
            caption: 'Now try turning back on yourself — the game politely ignores you.' }
},

/* ---------------------------------------------------------- 9 */
{
    id: 'stepGame',
    fnName: 'stepGame',
    title: 'One whole turn of the game',
    adds: 'Every piece you have written now works together.',
    intro: '<p>This is the boss step. Everything you have built so far — stepping, walls, biting, apples — comes together in one function that plays a single turn of Snake.</p>' +
           '<p>It changes the state instead of returning something. The state holds <code>snake</code>, <code>direction</code>, <code>turns</code> (turns the player has asked for), <code>food</code>, <code>score</code>, <code>eaten</code>, <code>level</code> and <code>isOver</code>.</p>' +
           '<p>Take it one line at a time. You already have every tool you need.</p>',
    spec: {
        input: 'state — the game state',
        output: 'nothing; it changes the state',
        algorithm: [
            'If state.isOver or state.isPaused, do nothing at all.',
            'If state.turns has a turn waiting, shift() it off and make it the new state.direction.',
            'Work out the new head: addDirection(state.snake[0], state.direction).',
            'The body that stays put is state.snake.slice(0, state.snake.length - 1) — the last square is about to move away, so it does not count.',
            'If the head is NOT inside the grid, or the staying body contains it: set state.isOver = true and return.',
            'eating = the food is not null AND samePosition(head, state.food).',
            'state.snake = moveSnake(state.snake, head, eating).',
            'If eating: add 1 to state.eaten, add scoreForFood(state.level) to state.score, set state.level = levelForFood(state.eaten), and put the next apple at randomEmptyCell(state.snake). If that comes back null, set state.isWon and state.isOver to true.'
        ]
    },
    warning: 'The order matters! Check for death BEFORE moving the snake, and work out "eating" BEFORE the snake moves, while the head and the apple can still be compared.',
    starter: 'function stepGame(state) {\n' +
             '    // 1. nothing to do if the game is over or paused\n' +
             '    // 2. take the next turn the player asked for\n' +
             '    // 3. work out the new head square\n' +
             '    // 4. wall or body? then the game is over\n' +
             '    // 5. is the head landing on the apple?\n' +
             '    // 6. move the snake (growing only if it ate)\n' +
             '    // 7. if it ate: count it, score it, level up, new apple\n' +
             '}\n',
    answer: 'function stepGame(state) {\n' +
            '    if (state.isOver || state.isPaused) {\n' +
            '        return;\n' +
            '    }\n' +
            '\n' +
            '    if (state.turns.length > 0) {\n' +
            '        state.direction = state.turns.shift();\n' +
            '    }\n' +
            '\n' +
            '    const head = addDirection(state.snake[0], state.direction);\n' +
            '    const bodyThatStays = state.snake.slice(0, state.snake.length - 1);\n' +
            '\n' +
            '    if (!isInsideGrid(head) || containsPosition(bodyThatStays, head)) {\n' +
            '        state.isOver = true;\n' +
            '        return;\n' +
            '    }\n' +
            '\n' +
            '    const eating = state.food !== null && samePosition(head, state.food);\n' +
            '    state.snake = moveSnake(state.snake, head, eating);\n' +
            '\n' +
            '    if (eating) {\n' +
            '        state.eaten = state.eaten + 1;\n' +
            '        state.score = state.score + scoreForFood(state.level);\n' +
            '        state.level = levelForFood(state.eaten);\n' +
            '        state.food = randomEmptyCell(state.snake);\n' +
            '        if (state.food === null) {\n' +
            '            state.isWon = true;\n' +
            '            state.isOver = true;\n' +
            '        }\n' +
            '    }\n' +
            '}\n',
    hints: [
        'Start with the two easy guards: the over/paused return, and taking a turn off state.turns with shift().',
        'Death check: if (!isInsideGrid(head) || containsPosition(bodyThatStays, head)) { state.isOver = true; return; }',
        'Do not forget to actually store the new snake: state.snake = moveSnake(state.snake, head, eating);'
    ],
    tests: [
        { name: 'The snake moves one square forward', check: function (fn) {
            const state = createGame();
            state.food = { x: 0, y: 0 };
            const startX = state.snake[0].x;
            fn(state);
            const ok = state.snake[0].x === startX + 1 && state.snake.length === 3;
            return { ok: ok, detail: 'head is now at ' + JSON.stringify(state.snake[0]) };
        } },
        { name: 'A waiting turn is taken', check: function (fn) {
            const state = createGame();
            state.food = { x: 0, y: 0 };
            state.turns = [DIRECTIONS.up];
            fn(state);
            const ok = state.direction === DIRECTIONS.up && state.turns.length === 0;
            return { ok: ok, detail: 'direction is ' + JSON.stringify(state.direction) };
        } },
        { name: 'Hitting a wall ends the game', check: function (fn) {
            const state = createGame();
            state.food = { x: 0, y: 0 };
            state.snake = [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }];
            fn(state);
            return { ok: state.isOver === true, detail: 'the snake walked through the right wall' };
        } },
        { name: 'Biting your own body ends the game', check: function (fn) {
            const state = createGame();
            state.food = { x: 0, y: 0 };
            state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 6, y: 5 }];
            state.direction = DIRECTIONS.up;
            fn(state);
            return { ok: state.isOver === true, detail: 'the head went into its own body and survived' };
        } },
        { name: 'The square the tail is leaving is safe', check: function (fn) {
            const state = createGame();
            state.food = { x: 0, y: 0 };
            state.snake = [{ x: 5, y: 5 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 6, y: 5 }];
            state.direction = DIRECTIONS.right;
            fn(state);
            return { ok: state.isOver === false, detail: 'the tail moves out of the way this turn, so this must not be a crash' };
        } },
        { name: 'Eating grows the snake', check: function (fn) {
            const state = createGame();
            state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
            state.direction = DIRECTIONS.right;
            state.food = { x: 6, y: 5 };
            fn(state);
            return { ok: state.snake.length === 4, detail: 'the snake is ' + state.snake.length + ' squares long, expected 4' };
        } },
        { name: 'Eating scores points and counts the apple', check: function (fn) {
            const state = createGame();
            state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
            state.direction = DIRECTIONS.right;
            state.food = { x: 6, y: 5 };
            fn(state);
            const ok = state.score === 10 && state.eaten === 1;
            return { ok: ok, detail: 'score ' + state.score + ', apples ' + state.eaten + ' (expected 10 and 1)' };
        } },
        { name: 'A new apple appears somewhere free', check: function (fn) {
            const state = createGame();
            state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
            state.direction = DIRECTIONS.right;
            state.food = { x: 6, y: 5 };
            fn(state);
            const ok = state.food !== null && !containsPosition(state.snake, state.food);
            return { ok: ok, detail: 'the new apple is at ' + JSON.stringify(state.food) };
        } },
        { name: 'Walking past an apple does not grow the snake', check: function (fn) {
            const state = createGame();
            state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
            state.direction = DIRECTIONS.right;
            state.food = { x: 12, y: 12 };
            fn(state);
            return { ok: state.snake.length === 3 && state.score === 0, detail: 'length ' + state.snake.length + ', score ' + state.score };
        } },
        { name: 'A paused game does not move', check: function (fn) {
            const state = createGame();
            state.isPaused = true;
            const before = JSON.stringify(state.snake);
            fn(state);
            return { ok: JSON.stringify(state.snake) === before, detail: 'the snake moved while the game was paused' };
        } },
        { name: 'A finished game does not move either', check: function (fn) {
            const state = createGame();
            state.isOver = true;
            const before = JSON.stringify(state.snake);
            fn(state);
            return { ok: JSON.stringify(state.snake) === before, detail: 'the snake moved after the game had ended' };
        } }
    ],
    demo: { kind: 'game', caption: 'The real game, played by your stepGame. Steer with the buttons.' }
},

/* ---------------------------------------------------------- 10 */
{
    id: 'scoreForFood',
    fnName: 'scoreForFood',
    title: 'Count the points',
    adds: 'Apples are finally worth something.',
    intro: '<p>An apple is worth <strong>10 points, multiplied by the level</strong> you are on. Apples on level 5 are worth five times as much as apples on level 1 — which is fair, because the snake is much faster and much longer by then.</p>' +
           '<table class="score-table"><tr><th>Level</th><th>1</th><th>2</th><th>3</th><th>7</th></tr>' +
           '<tr><th>Apple</th><td>10</td><td>20</td><td>30</td><td>70</td></tr></table>',
    spec: {
        input: 'level — the level the player is on',
        output: 'the number of points that apple is worth',
        algorithm: [
            'Multiply 10 by the level.',
            'Return it.'
        ]
    },
    starter: 'function scoreForFood(level) {\n' +
             '    // ten points per level\n' +
             '}\n',
    answer: 'function scoreForFood(level) {\n' +
            '    return 10 * level;\n' +
            '}\n',
    hints: [
        'This really is a one-line function.',
        'return 10 * level;'
    ],
    tests: [
        { name: 'Level 1 apples are worth 10', args: [1], expect: 10 },
        { name: 'Level 2 apples are worth 20', args: [2], expect: 20 },
        { name: 'Level 5 apples are worth 50', args: [5], expect: 50 },
        { name: 'Level 12 apples are worth 120', args: [12], expect: 120 },
        { name: 'It returns a number, not text', check: function (fn) {
            const value = fn(3);
            return { ok: typeof value === 'number' && value === 30, detail: 'got ' + JSON.stringify(value) };
        } }
    ],
    demo: { kind: 'game', flags: { hud: true }, caption: 'Eat an apple and watch the score climb. Every 5 apples is a new level.' }
},

/* ---------------------------------------------------------- 11 */
{
    id: 'stepIntervalForLevel',
    fnName: 'stepIntervalForLevel',
    title: 'Make it faster',
    adds: 'Higher levels really are faster.',
    intro: '<p>The level has to <em>mean</em> something, and in Snake it means speed: how long the game waits between steps. Level 1 waits 200 milliseconds; every level after that is 15 ms quicker.</p>' +
           '<p>But there has to be a floor. Without one, level 20 would wait <em>minus</em> 85 milliseconds and the snake would take every step at once.</p>',
    spec: {
        input: 'level — the level number (1, 2, 3, …)',
        output: 'how many milliseconds to wait before the snake moves again',
        algorithm: [
            'Work out 200 - (level - 1) * 15.',
            'If that is less than 70, return 70 instead.',
            'Otherwise return it.'
        ]
    },
    warning: 'Level 1 must come out at exactly 200, which is why the sum uses (level - 1) and not level.',
    starter: 'function stepIntervalForLevel(level) {\n' +
             '    // 200 ms on level 1, 15 ms faster each level, never below 70 ms\n' +
             '}\n',
    answer: 'function stepIntervalForLevel(level) {\n' +
            '    const interval = 200 - (level - 1) * 15;\n' +
            '    if (interval < 70) {\n' +
            '        return 70;\n' +
            '    }\n' +
            '    return interval;\n' +
            '}\n',
    hints: [
        'Work the number out into a variable first, then decide whether to hand it back.',
        'Check the floor with an if: if (interval < 70) { return 70; }',
        'Math.max(70, interval) does the same job in one line, if you prefer.'
    ],
    tests: [
        { name: 'Level 1 waits 200 ms', args: [1], expect: 200 },
        { name: 'Level 2 waits 185 ms', args: [2], expect: 185 },
        { name: 'Level 5 waits 140 ms', args: [5], expect: 140 },
        { name: 'Level 10 has reached the floor of 70 ms', args: [10], expect: 70 },
        { name: 'Level 50 is still 70 ms', args: [50], expect: 70 },
        { name: 'It never returns less than 70', check: function (fn) {
            for (let level = 1; level <= 60; level++) {
                if (fn(level) < 70) { return { ok: false, detail: 'level ' + level + ' gave ' + fn(level) }; }
            }
            return { ok: true, detail: '' };
        } }
    ],
    demo: { kind: 'game', flags: { hud: true, levelPicker: true }, caption: 'Use the level buttons to feel your speed curve. Level 10 is properly frightening.' }
},

/* ---------------------------------------------------------- 12 */
{
    id: 'actionForKey',
    fnName: 'actionForKey',
    title: 'Wire up the keyboard',
    adds: 'You can play with the keyboard — the game is finished!',
    intro: '<p>Last piece of the puzzle. The browser tells us which key was pressed, as a piece of text like <code>"ArrowLeft"</code> or <code>"w"</code>. The game needs the <em>name of the action</em> instead.</p>' +
           '<p>Turning one kind of value into another is called <strong>mapping</strong>, and it is everywhere in programming.</p>',
    spec: {
        input: 'key — the key name from the browser, e.g. "ArrowUp", "W", " "',
        output: 'one of "up", "down", "left", "right", "pause", "restart" — or null for any other key',
        algorithm: [
            'Make the key lowercase first, so "W" and "w" behave the same.',
            'ArrowUp or w -> "up"           ArrowDown or s -> "down"',
            'ArrowLeft or a -> "left"       ArrowRight or d -> "right"',
            'p or a space " " -> "pause"    r -> "restart"',
            'Anything else -> null.'
        ]
    },
    warning: 'Return null (not false, not "none") for keys the game does not use. The rest of the game checks for exactly null.',
    starter: 'function actionForKey(key) {\n' +
             '    const k = String(key).toLowerCase();\n' +
             '    // return the action name for this key, or null\n' +
             '}\n',
    answer: 'function actionForKey(key) {\n' +
            '    const k = String(key).toLowerCase();\n' +
            '\n' +
            '    if (k === \'arrowup\' || k === \'w\') { return \'up\'; }\n' +
            '    if (k === \'arrowdown\' || k === \'s\') { return \'down\'; }\n' +
            '    if (k === \'arrowleft\' || k === \'a\') { return \'left\'; }\n' +
            '    if (k === \'arrowright\' || k === \'d\') { return \'right\'; }\n' +
            '    if (k === \'p\' || k === \' \' || k === \'spacebar\') { return \'pause\'; }\n' +
            '    if (k === \'r\') { return \'restart\'; }\n' +
            '\n' +
            '    return null;\n' +
            '}\n',
    hints: [
        'String(key).toLowerCase() turns "ArrowUp" into "arrowup" — compare against the lowercase spelling.',
        'One if per action, each returning straight away. The last line of the function is return null;',
        'Two keys can share an action: if (k === \'arrowup\' || k === \'w\')'
    ],
    tests: [
        { name: 'ArrowUp goes up', args: ['ArrowUp'], expect: 'up' },
        { name: 'The letter W goes up too', args: ['w'], expect: 'up' },
        { name: 'A capital W still works', args: ['W'], expect: 'up' },
        { name: 'ArrowDown goes down', args: ['ArrowDown'], expect: 'down' },
        { name: 'ArrowLeft goes left', args: ['ArrowLeft'], expect: 'left' },
        { name: 'The letter A goes left', args: ['a'], expect: 'left' },
        { name: 'ArrowRight goes right', args: ['ArrowRight'], expect: 'right' },
        { name: 'The letter D goes right', args: ['d'], expect: 'right' },
        { name: 'P pauses', args: ['p'], expect: 'pause' },
        { name: 'The space bar pauses too', args: [' '], expect: 'pause' },
        { name: 'R restarts', args: ['r'], expect: 'restart' },
        { name: 'An unused key gives null', args: ['q'], expect: null },
        { name: 'Enter is not one of ours either', args: ['Enter'], expect: null }
    ],
    demo: { kind: 'final', flags: { hud: true }, caption: 'Click the page, then play with the keyboard. Every function running here is yours.' }
}

];
