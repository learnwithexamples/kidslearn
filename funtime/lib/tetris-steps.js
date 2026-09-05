/* ============================================================
   tetris-steps.js — the twelve steps of "Build Tetris Yourself"

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

/** Helper for the tests: a row of `count` copies of `value`. */
function rowOf(count, value) {
    const row = [];
    for (let i = 0; i < count; i++) {
        row.push(value);
    }
    return row;
}

/** Helper for the tests: a small board with the given rows of 1s and 0s. */
function boardFrom(rows) {
    const board = [];
    for (let i = 0; i < rows.length; i++) {
        board.push(rows[i].slice());
    }
    return board;
}

const TETRIS_STEPS = [

/* ---------------------------------------------------------- 1 */
{
    id: 'createEmptyBoard',
    fnName: 'createEmptyBoard',
    title: 'Build the empty field',
    adds: 'The playing field appears.',
    intro: '<p>Every game of Tetris starts with an empty field: <strong>10 columns across and 20 rows down</strong>. In code that is just a grid of numbers — <code>0</code> means "empty square" and <code>1</code> means "there is a block here".</p>' +
           '<p>We store it as an <strong>array of rows</strong>, so <code>board[row][column]</code> is one square. Row <code>0</code> is the top of the screen and row <code>19</code> is the floor.</p>',
    spec: {
        input: 'width — how many columns (10). height — how many rows (20).',
        output: 'An array of <code>height</code> rows. Every row is an array of <code>width</code> zeros.',
        algorithm: [
            'Make an empty array called board.',
            'Repeat height times: build one row of <code>width</code> zeros and push it onto board.',
            'Return board.'
        ]
    },
    warning: 'Careful: each row must be its OWN array. If you build one row and push the same one twice, changing one row changes them all!',
    starter: 'function createEmptyBoard(width, height) {\n' +
             '    // 1. make an empty array\n' +
             '    // 2. add `height` rows, each with `width` zeros\n' +
             '    // 3. return it\n' +
             '}\n',
    answer: 'function createEmptyBoard(width, height) {\n' +
            '    const board = [];\n' +
            '    for (let row = 0; row < height; row++) {\n' +
            '        const newRow = [];\n' +
            '        for (let column = 0; column < width; column++) {\n' +
            '            newRow.push(0);\n' +
            '        }\n' +
            '        board.push(newRow);\n' +
            '    }\n' +
            '    return board;\n' +
            '}\n',
    hints: [
        'You need two loops: an outer one for the rows, an inner one for the columns.',
        'Build the inner row first, fill it with zeros, then push that row onto the board.',
        'Start the inner row as a fresh <code>const newRow = [];</code> INSIDE the outer loop — that is what makes every row its own array.'
    ],
    tests: [
        { name: 'A 3 x 2 board has 2 rows', args: [3, 2], check: function (fn) {
            const b = fn(3, 2);
            return { ok: Array.isArray(b) && b.length === 2, detail: 'got ' + JSON.stringify(b) };
        } },
        { name: 'A 3 x 2 board is [[0,0,0],[0,0,0]]', args: [3, 2], expect: [[0, 0, 0], [0, 0, 0]] },
        { name: 'The real board is 10 wide and 20 tall', check: function (fn) {
            const b = fn(10, 20);
            const ok = b.length === 20 && b[0].length === 10 && b[19].length === 10;
            return { ok: ok, detail: 'rows: ' + b.length + ', columns in row 0: ' + (b[0] ? b[0].length : '?') };
        } },
        { name: 'Every square starts empty (0)', check: function (fn) {
            const b = fn(10, 20);
            let bad = 0;
            for (let y = 0; y < b.length; y++) {
                for (let x = 0; x < b[y].length; x++) {
                    if (b[y][x] !== 0) { bad++; }
                }
            }
            return { ok: bad === 0, detail: bad + ' square(s) were not 0' };
        } },
        { name: 'Each row is its own array (a classic bug!)', check: function (fn) {
            const b = fn(4, 3);
            b[0][0] = 1;
            const ok = b[1][0] === 0 && b[2][0] === 0;
            return { ok: ok, detail: ok ? '' : 'changing row 0 also changed the other rows' };
        } }
    ],
    demo: { kind: 'board', caption: 'Your board, drawn on the canvas. 10 columns x 20 rows.' }
},

/* ---------------------------------------------------------- 2 */
{
    id: 'isRowFull',
    fnName: 'isRowFull',
    title: 'Spot a completed row',
    adds: 'The game can see which rows are ready to clear.',
    intro: '<p>The whole point of Tetris is filling a row all the way across. So the game needs to look at one row and answer a simple question: <strong>is every square full?</strong></p>' +
           '<p>This is the smallest function in the game — and one of the most important.</p>',
    spec: {
        input: 'row — one row of the board, an array like [1, 1, 0, 1]',
        output: 'true if every number in the row is 1, otherwise false',
        algorithm: [
            'Walk along the row from left to right.',
            'The moment you meet a 0, answer false — you can stop looking.',
            'If you reach the end without meeting a 0, answer true.'
        ]
    },
    starter: 'function isRowFull(row) {\n' +
             '    // look at every square; a single 0 means "not full"\n' +
             '}\n',
    answer: 'function isRowFull(row) {\n' +
            '    for (let column = 0; column < row.length; column++) {\n' +
            '        if (row[column] === 0) {\n' +
            '            return false;\n' +
            '        }\n' +
            '    }\n' +
            '    return true;\n' +
            '}\n',
    hints: [
        'Loop over the row with a for loop.',
        'Inside the loop, <code>if (row[column] === 0) { return false; }</code>',
        'The <code>return true;</code> goes AFTER the loop — you only know it is full once you have checked everything.'
    ],
    tests: [
        { name: 'A row of four 1s is full', args: [[1, 1, 1, 1]], expect: true },
        { name: 'One gap means not full', args: [[1, 1, 0, 1]], expect: false },
        { name: 'An empty row is not full', args: [[0, 0, 0, 0]], expect: false },
        { name: 'A gap at the very start is spotted', args: [[0, 1, 1, 1]], expect: false },
        { name: 'A gap at the very end is spotted', args: [[1, 1, 1, 0]], expect: false },
        { name: 'A full 10-wide row works too', args: [rowOf(10, 1)], expect: true }
    ],
    demo: { kind: 'rows', caption: 'Rows your function calls FULL are drawn inverted (white blocks on black).' }
},

/* ---------------------------------------------------------- 3 */
{
    id: 'findFullRows',
    fnName: 'findFullRows',
    title: 'Find every completed row',
    adds: 'The game knows exactly which rows to delete.',
    intro: '<p>One piece can complete <strong>up to four rows at once</strong>. So instead of asking about a single row, the game collects the row numbers of every completed row.</p>' +
           '<p>Notice how this function <em>reuses</em> the one you just wrote. Small functions build bigger ones — that is the whole trick of programming.</p>',
    spec: {
        input: 'board — the whole field',
        output: 'An array of row numbers, e.g. [17, 19]. An empty array [] if no row is complete.',
        algorithm: [
            'Start with an empty list.',
            'For every row number y from 0 to the last row:',
            '    if isRowFull(board[y]) then push y onto the list.',
            'Return the list.'
        ]
    },
    starter: 'function findFullRows(board) {\n' +
             '    // collect the numbers of the rows that are full\n' +
             '    // hint: you already have isRowFull(row)\n' +
             '}\n',
    answer: 'function findFullRows(board) {\n' +
            '    const fullRows = [];\n' +
            '    for (let y = 0; y < board.length; y++) {\n' +
            '        if (isRowFull(board[y])) {\n' +
            '            fullRows.push(y);\n' +
            '        }\n' +
            '    }\n' +
            '    return fullRows;\n' +
            '}\n',
    hints: [
        'Make an empty array first — that is where the answers go.',
        'Loop with <code>for (let y = 0; y < board.length; y++)</code> so you have the row NUMBER, not just the row.',
        'Push <code>y</code> (the number), not <code>board[y]</code> (the row itself).'
    ],
    tests: [
        { name: 'Rows 1 and 3 are full', args: [boardFrom([[1, 0, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], [1, 1, 1, 1]])], expect: [1, 3] },
        { name: 'Nothing full gives an empty list', args: [boardFrom([[1, 0], [0, 0]])], expect: [] },
        { name: 'Everything full gives every row', args: [boardFrom([[1, 1], [1, 1], [1, 1]])], expect: [0, 1, 2] },
        { name: 'The numbers come back in order, top row first', args: [boardFrom([[1, 1], [0, 1], [1, 1], [1, 1]])], expect: [0, 2, 3] }
    ],
    demo: { kind: 'rows', caption: 'The rows your function returns are listed below and drawn inverted.' }
},

/* ---------------------------------------------------------- 4 */
{
    id: 'removeRows',
    fnName: 'removeRows',
    title: 'Clear the rows and drop the stack',
    adds: 'Completed rows now vanish and everything above falls down.',
    intro: '<p>This is the moment every Tetris player plays for. Delete the completed rows, let everything above slide down, and add fresh empty rows at the top so the field stays exactly 20 rows tall.</p>' +
           '<p>The clever version does not "move" anything at all: it simply builds a new board out of the rows we are <strong>keeping</strong>.</p>',
    spec: {
        input: 'board — the field. rowNumbers — an array of row numbers to delete, e.g. [18, 19]',
        output: 'A NEW board, the same size, with those rows gone, the rows above shifted down and empty rows on top',
        algorithm: [
            'Make an empty list called kept.',
            'For every row number y: if y is NOT in rowNumbers, push a copy of that row onto kept.',
            'While kept is shorter than the original height, unshift (add at the FRONT) a new empty row.',
            'Return kept.'
        ]
    },
    warning: 'Use <code>rowNumbers.indexOf(y) === -1</code> to ask "is this row number missing from the list?".',
    starter: 'function removeRows(board, rowNumbers) {\n' +
             '    const height = board.length;\n' +
             '    const width = board[0].length;\n' +
             '    // 1. keep the rows that are not being deleted\n' +
             '    // 2. add empty rows at the front until the height is right again\n' +
             '}\n',
    answer: 'function removeRows(board, rowNumbers) {\n' +
            '    const height = board.length;\n' +
            '    const width = board[0].length;\n' +
            '    const kept = [];\n' +
            '\n' +
            '    for (let y = 0; y < height; y++) {\n' +
            '        if (rowNumbers.indexOf(y) === -1) {\n' +
            '            kept.push(board[y].slice());\n' +
            '        }\n' +
            '    }\n' +
            '\n' +
            '    while (kept.length < height) {\n' +
            '        const emptyRow = [];\n' +
            '        for (let column = 0; column < width; column++) {\n' +
            '            emptyRow.push(0);\n' +
            '        }\n' +
            '        kept.unshift(emptyRow);\n' +
            '    }\n' +
            '\n' +
            '    return kept;\n' +
            '}\n',
    hints: [
        'First loop: copy across every row whose number is NOT in rowNumbers.',
        'Then a while loop: while there are too few rows, add an empty one at the front with unshift.',
        'You already know how to build an empty row — it is the inner loop from step 1.'
    ],
    tests: [
        { name: 'Deleting row 1 of a 3-row board', args: [boardFrom([[1, 1], [0, 1], [1, 0]]), [1]], expect: [[0, 0], [1, 1], [1, 0]] },
        { name: 'The board keeps its height', check: function (fn) {
            const b = fn(boardFrom([[1, 1], [1, 1], [1, 1], [1, 1]]), [1, 2]);
            return { ok: b.length === 4, detail: 'got ' + b.length + ' rows, expected 4' };
        } },
        { name: 'The new top row is empty', check: function (fn) {
            const b = fn(boardFrom([[1, 1], [1, 1], [1, 1]]), [2]);
            const ok = b[0][0] === 0 && b[0][1] === 0;
            return { ok: ok, detail: 'top row is ' + JSON.stringify(b[0]) };
        } },
        { name: 'Deleting nothing changes nothing', args: [boardFrom([[1, 0], [0, 1]]), []], expect: [[1, 0], [0, 1]] },
        { name: 'Deleting the bottom row drops the stack down', args: [boardFrom([[0, 0], [1, 0], [1, 1]]), [2]], expect: [[0, 0], [0, 0], [1, 0]] },
        { name: 'The original board is not damaged', check: function (fn) {
            const original = boardFrom([[1, 1], [0, 1]]);
            fn(original, [0]);
            const ok = JSON.stringify(original) === '[[1,1],[0,1]]';
            return { ok: ok, detail: ok ? '' : 'the board you were given became ' + JSON.stringify(original) };
        } }
    ],
    demo: { kind: 'game', flags: { gravity: true, lock: true, clear: true }, caption: 'Fill a row across and watch your removeRows do its job.' }
},

/* ---------------------------------------------------------- 5 */
{
    id: 'rotateMatrixClockwise',
    fnName: 'rotateMatrixClockwise',
    title: 'Turn a piece',
    adds: 'Pieces can spin!',
    intro: '<p>A piece is a little square grid. Turning it is pure maths: every square moves to a new place, and one line of code describes all of it.</p>' +
           '<pre class="mini-code">[0,1,0]        [0,1,0]\n[1,1,1]  -->   [0,1,1]\n[0,0,0]        [0,1,0]</pre>' +
           '<p>The T piece pointing up becomes a T piece pointing right.</p>' +
           '<p>🤔 <strong>A puzzle for later:</strong> a 3 x 3 piece spins neatly around its middle square — but the long I piece lives in a 4 x 4 box, which has no middle square, so its bar lands one row lower every quarter turn. Your formula here is still exactly right; the game fixes the wobble afterwards, in <code>centerLongBar</code> in <code>tetris-shapes.js</code>. Go and read it once you have finished this step!</p>',
    spec: {
        input: 'matrix — a square grid of 0s and 1s, size N x N',
        output: 'A NEW N x N grid, turned a quarter turn to the right. The original must not change.',
        algorithm: [
            'Let N be matrix.length.',
            'For every row r and column c of the ANSWER:',
            '    answer[r][c] = matrix[N - 1 - c][r]',
            'Return the answer.'
        ]
    },
    warning: 'Build a brand-new array and fill it in. Do not try to move squares around inside the original — that way lies madness.',
    starter: 'function rotateMatrixClockwise(matrix) {\n' +
             '    const size = matrix.length;\n' +
             '    // build a new grid where answer[r][c] = matrix[size - 1 - c][r]\n' +
             '}\n',
    answer: 'function rotateMatrixClockwise(matrix) {\n' +
            '    const size = matrix.length;\n' +
            '    const result = [];\n' +
            '    for (let r = 0; r < size; r++) {\n' +
            '        const newRow = [];\n' +
            '        for (let c = 0; c < size; c++) {\n' +
            '            newRow.push(matrix[size - 1 - c][r]);\n' +
            '        }\n' +
            '        result.push(newRow);\n' +
            '    }\n' +
            '    return result;\n' +
            '}\n',
    hints: [
        'Two loops again: r for the rows of the answer, c for the columns.',
        'Push <code>matrix[size - 1 - c][r]</code> into the new row. Read that carefully — the row index uses c!',
        'If your piece comes out mirrored, you probably wrote matrix[c][size - 1 - r] — that is the anti-clockwise turn.'
    ],
    tests: [
        { name: 'The T piece turns to point right', args: [[[0, 1, 0], [1, 1, 1], [0, 0, 0]]], expect: [[0, 1, 0], [0, 1, 1], [0, 1, 0]] },
        { name: 'A 2 x 2 square looks the same', args: [[[1, 1], [1, 1]]], expect: [[1, 1], [1, 1]] },
        { name: 'The L piece turns correctly', args: [[[0, 0, 1], [1, 1, 1], [0, 0, 0]]], expect: [[0, 1, 0], [0, 1, 0], [0, 1, 1]] },
        { name: 'Turning four times comes back to the start', check: function (fn) {
            const start = [[0, 1, 0], [1, 1, 1], [0, 0, 0]];
            let m = start;
            for (let i = 0; i < 4; i++) { m = fn(m); }
            const ok = JSON.stringify(m) === JSON.stringify(start);
            return { ok: ok, detail: 'after 4 turns: ' + JSON.stringify(m) };
        } },
        { name: 'The original piece is not changed', check: function (fn) {
            const start = [[0, 1, 0], [1, 1, 1], [0, 0, 0]];
            fn(start);
            const ok = JSON.stringify(start) === '[[0,1,0],[1,1,1],[0,0,0]]';
            return { ok: ok, detail: ok ? '' : 'the input became ' + JSON.stringify(start) };
        } },
        { name: 'It works on the 4 x 4 I piece', args: [[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]],
          expect: [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]] }
    ],
    demo: { kind: 'spin', caption: 'Press the buttons to turn each of the seven pieces with YOUR function.' }
},

/* ---------------------------------------------------------- 6 */
{
    id: 'canPlacePiece',
    fnName: 'canPlacePiece',
    title: 'The referee',
    adds: 'Pieces stop at the walls, the floor and the pile.',
    intro: '<p>This is the most important function in the whole game. Every move, every rotation and every drop asks it the same question: <strong>may this piece sit exactly here?</strong></p>' +
           '<p>You are given a helper called <code>forEachBlock(piece, callback)</code>. It visits the four blocks of the piece and hands you each block\'s position on the board:</p>' +
           '<pre class="mini-code">forEachBlock(piece, function (bx, by) {\n    // bx = column on the board, by = row on the board\n});</pre>',
    spec: {
        input: 'board — the field. piece — an object { cells, x, y }.',
        output: 'true if all four blocks land on free squares; false if any block is outside a wall, below the floor, or on top of an existing block',
        algorithm: [
            'Start by assuming the answer is true.',
            'For every block of the piece at board position (bx, by):',
            '    if bx < 0 or bx is past the last column -> answer is false',
            '    if by is past the last row (below the floor) -> answer is false',
            '    if the board already has a block at (bx, by) -> answer is false',
            'Return the answer.'
        ]
    },
    warning: 'A piece is allowed to poke ABOVE the top of the board (by < 0) while it is being born — so do not fail on that. <code>isCellFilled(board, x, y)</code> already handles it for you.',
    starter: 'function canPlacePiece(board, piece) {\n' +
             '    let allowed = true;\n' +
             '    forEachBlock(piece, function (bx, by) {\n' +
             '        // check the walls, the floor, and blocks already on the board\n' +
             '    });\n' +
             '    return allowed;\n' +
             '}\n',
    answer: 'function canPlacePiece(board, piece) {\n' +
            '    let allowed = true;\n' +
            '    forEachBlock(piece, function (bx, by) {\n' +
            '        if (bx < 0 || bx >= boardWidth(board)) {\n' +
            '            allowed = false;\n' +
            '        } else if (by >= boardHeight(board)) {\n' +
            '            allowed = false;\n' +
            '        } else if (isCellFilled(board, bx, by)) {\n' +
            '            allowed = false;\n' +
            '        }\n' +
            '    });\n' +
            '    return allowed;\n' +
            '}\n',
    hints: [
        'You may use boardWidth(board), boardHeight(board) and isCellFilled(board, x, y) — they are already written for you.',
        'Inside the callback you cannot <code>return</code> an answer for the whole function. Set <code>allowed = false;</code> instead.',
        'Three checks in order: past a side wall, past the floor, or landing on a block that is already there.'
    ],
    tests: [
        { name: 'A piece in the middle of an empty board fits', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            const piece = createPiece('T');
            piece.x = 4; piece.y = 5;
            return { ok: fn(board, piece) === true, detail: '' };
        } },
        { name: 'A piece pushed through the left wall does not fit', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            const piece = createPiece('O');
            piece.x = -1; piece.y = 5;
            return { ok: fn(board, piece) === false, detail: '' };
        } },
        { name: 'A piece pushed through the right wall does not fit', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            const piece = createPiece('O');
            piece.x = 9; piece.y = 5;
            return { ok: fn(board, piece) === false, detail: 'the O piece is 2 wide, so x = 9 hangs over the edge' };
        } },
        { name: 'A piece cannot go below the floor', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            const piece = createPiece('O');
            piece.x = 4; piece.y = 19;
            return { ok: fn(board, piece) === false, detail: '' };
        } },
        { name: 'A piece may still be above the ceiling', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            const piece = createPiece('I');
            piece.x = 3; piece.y = -1;
            return { ok: fn(board, piece) === true, detail: 'new pieces start partly above the board' };
        } },
        { name: 'A piece cannot sit on top of another block', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            board[6][4] = 1;
            const piece = createPiece('O');
            piece.x = 4; piece.y = 6;
            return { ok: fn(board, piece) === false, detail: '' };
        } },
        { name: 'It fits right next to a block without touching it', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            board[6][0] = 1;
            const piece = createPiece('O');
            piece.x = 4; piece.y = 6;
            return { ok: fn(board, piece) === true, detail: '' };
        } }
    ],
    demo: { kind: 'game', flags: { move: true }, caption: 'Slide the piece around — your referee decides where it may go.' }
},

/* ---------------------------------------------------------- 7 */
{
    id: 'mergePieceIntoBoard',
    fnName: 'mergePieceIntoBoard',
    title: 'Make a piece land',
    adds: 'Pieces stop falling and become part of the pile.',
    intro: '<p>When a piece can fall no further it stops being "the falling piece" and becomes part of the field forever. We stamp its four blocks onto the board.</p>' +
           '<p>Notice that we build a <strong>new</strong> board rather than scribbling on the old one. Functions that never damage what you give them are much easier to trust.</p>',
    spec: {
        input: 'board — the field. piece — the piece that just landed.',
        output: 'A NEW board with the piece\'s four blocks turned into 1s',
        algorithm: [
            'Copy the board (copyBoard is written for you).',
            'For every block of the piece at (bx, by):',
            '    if that square is on the board, set copy[by][bx] = 1',
            'Return the copy.'
        ]
    },
    starter: 'function mergePieceIntoBoard(board, piece) {\n' +
             '    const result = copyBoard(board);\n' +
             '    forEachBlock(piece, function (bx, by) {\n' +
             '        // stamp this block onto result\n' +
             '    });\n' +
             '    return result;\n' +
             '}\n',
    answer: 'function mergePieceIntoBoard(board, piece) {\n' +
            '    const result = copyBoard(board);\n' +
            '    forEachBlock(piece, function (bx, by) {\n' +
            '        if (isInsideBoard(result, bx, by)) {\n' +
            '            result[by][bx] = 1;\n' +
            '        }\n' +
            '    });\n' +
            '    return result;\n' +
            '}\n',
    hints: [
        'Inside the callback, set <code>result[by][bx] = 1;</code>.',
        'Guard it with isInsideBoard(result, bx, by) so a block hanging above the top does not crash the game.',
        'Remember: row first, column second — result[by][bx], not result[bx][by].'
    ],
    tests: [
        { name: 'Exactly four squares become 1', check: function (fn) {
            const piece = createPiece('T');
            piece.x = 4; piece.y = 5;
            const out = fn(createEmptyBoard(10, 20), piece);
            let count = 0;
            for (let y = 0; y < out.length; y++) {
                for (let x = 0; x < out[y].length; x++) { if (out[y][x] === 1) { count++; } }
            }
            return { ok: count === 4, detail: 'found ' + count + ' filled squares' };
        } },
        { name: 'The blocks land in the right places', check: function (fn) {
            const piece = createPiece('O');
            piece.x = 0; piece.y = 0;
            const out = fn(createEmptyBoard(4, 3), piece);
            const ok = JSON.stringify(out) === JSON.stringify([[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]]);
            return { ok: ok, detail: 'got ' + JSON.stringify(out) };
        } },
        { name: 'Blocks already on the board stay there', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            board[19][0] = 1;
            const piece = createPiece('O');
            piece.x = 4; piece.y = 18;
            const out = fn(board, piece);
            return { ok: out[19][0] === 1, detail: 'the old block was lost' };
        } },
        { name: 'The original board is not changed', check: function (fn) {
            const board = createEmptyBoard(4, 4);
            const piece = createPiece('O');
            piece.x = 0; piece.y = 0;
            fn(board, piece);
            const ok = board[0][0] === 0;
            return { ok: ok, detail: ok ? '' : 'you drew on the board you were given instead of a copy' };
        } },
        { name: 'A piece hanging above the top does not crash', check: function (fn) {
            const piece = createPiece('I');
            piece.x = 3; piece.y = -1;
            try {
                fn(createEmptyBoard(10, 20), piece);
                return { ok: true, detail: '' };
            } catch (e) {
                return { ok: false, detail: 'it crashed: ' + e.message };
            }
        } }
    ],
    demo: { kind: 'game', flags: { gravity: true, lock: true, clear: true }, caption: 'Pieces land AND completed rows disappear — your step 4 and step 7 functions working together.' }
},

/* ---------------------------------------------------------- 8 */
{
    id: 'dropDistance',
    fnName: 'dropDistance',
    title: 'How far can it fall?',
    adds: 'The landing shadow appears and the hard drop works.',
    intro: '<p>Good players want to see where a piece will land <em>before</em> they let go. And the space bar needs to slam a piece all the way down in one go.</p>' +
           '<p>Both need the same number: how many rows can this piece still fall?</p>',
    spec: {
        input: 'board — the field. piece — the falling piece.',
        output: 'A whole number. 0 means the piece is already resting on something.',
        algorithm: [
            'Start with distance = 0.',
            'While the piece moved down (distance + 1) rows can still be placed:',
            '    add 1 to distance.',
            'Return distance.'
        ]
    },
    warning: 'movePiece(piece, dx, dy) gives you a moved COPY, and canPlacePiece is the referee you wrote in step 6. You need nothing else.',
    starter: 'function dropDistance(board, piece) {\n' +
             '    let distance = 0;\n' +
             '    // keep testing one row lower while it still fits\n' +
             '    return distance;\n' +
             '}\n',
    answer: 'function dropDistance(board, piece) {\n' +
            '    let distance = 0;\n' +
            '    while (canPlacePiece(board, movePiece(piece, 0, distance + 1))) {\n' +
            '        distance = distance + 1;\n' +
            '    }\n' +
            '    return distance;\n' +
            '}\n',
    hints: [
        'Use a while loop, not a for loop — you do not know how many rows there will be.',
        'The test inside the while is: canPlacePiece(board, movePiece(piece, 0, distance + 1))',
        'Careful: check distance + 1 (the NEXT row down). Checking distance alone loops forever!'
    ],
    tests: [
        { name: 'From the top of an empty board an O piece falls 18 rows', check: function (fn) {
            const piece = createPiece('O');
            piece.x = 4; piece.y = 0;
            const d = fn(createEmptyBoard(10, 20), piece);
            return { ok: d === 18, detail: 'got ' + d };
        } },
        { name: 'A piece already on the floor cannot fall', check: function (fn) {
            const piece = createPiece('O');
            piece.x = 4; piece.y = 18;
            const d = fn(createEmptyBoard(10, 20), piece);
            return { ok: d === 0, detail: 'got ' + d };
        } },
        { name: 'It stops on top of the pile', check: function (fn) {
            const board = createEmptyBoard(10, 20);
            board[19][4] = 1; board[19][5] = 1;
            const piece = createPiece('O');
            piece.x = 4; piece.y = 0;
            const d = fn(board, piece);
            return { ok: d === 17, detail: 'got ' + d + ', expected 17' };
        } },
        { name: 'The piece itself is not moved', check: function (fn) {
            const piece = createPiece('O');
            piece.x = 4; piece.y = 0;
            fn(createEmptyBoard(10, 20), piece);
            return { ok: piece.y === 0, detail: 'the piece jumped to row ' + piece.y };
        } }
    ],
    demo: { kind: 'game', flags: { gravity: true, lock: true, clear: true, ghost: true, hardDrop: true },
            caption: 'See the grey landing shadow? That is your function. Press DROP to slam the piece down.' }
},

/* ---------------------------------------------------------- 9 */
{
    id: 'scoreForLines',
    fnName: 'scoreForLines',
    title: 'Count the points',
    adds: 'Clearing rows finally scores!',
    intro: '<p>Tetris rewards greed. One row at a time is worth very little; four rows in one go is worth <strong>eight times</strong> as much as one. That single rule is what makes the game exciting.</p>' +
           '<table class="score-table"><tr><th>Rows</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>' +
           '<tr><th>Points</th><td>0</td><td>100</td><td>300</td><td>500</td><td>800</td></tr></table>' +
           '<p>…and then everything is multiplied by the level you are on.</p>',
    spec: {
        input: 'lineCount — how many rows were cleared at once (0 to 4). level — the current level.',
        output: 'The number of points to add',
        algorithm: [
            'Keep the five base scores in an array: [0, 100, 300, 500, 800].',
            'Look up the one at position lineCount.',
            'Multiply it by level and return it.'
        ]
    },
    starter: 'function scoreForLines(lineCount, level) {\n' +
             '    // use a lookup table, then multiply by the level\n' +
             '}\n',
    answer: 'function scoreForLines(lineCount, level) {\n' +
            '    const table = [0, 100, 300, 500, 800];\n' +
            '    return table[lineCount] * level;\n' +
            '}\n',
    hints: [
        'An array is a lookup table: <code>const table = [0, 100, 300, 500, 800];</code>',
        'The number of lines IS the index: table[2] is 300.',
        'Do not forget <code>* level</code> at the end.'
    ],
    tests: [
        { name: 'No lines, no points', args: [0, 1], expect: 0 },
        { name: 'One line on level 1 = 100', args: [1, 1], expect: 100 },
        { name: 'Two lines on level 1 = 300', args: [2, 1], expect: 300 },
        { name: 'Three lines on level 1 = 500', args: [3, 1], expect: 500 },
        { name: 'Four lines on level 1 = 800', args: [4, 1], expect: 800 },
        { name: 'Four lines on level 3 = 2400', args: [4, 3], expect: 2400 },
        { name: 'One line on level 7 = 700', args: [1, 7], expect: 700 }
    ],
    demo: { kind: 'game', flags: { gravity: true, lock: true, clear: true, ghost: true, hardDrop: true, hud: true },
            caption: 'Clear a row and watch the score climb. Try clearing two at once!' }
},

/* ---------------------------------------------------------- 10 */
{
    id: 'levelForLines',
    fnName: 'levelForLines',
    title: 'Level up',
    adds: 'Every 10 lines the level goes up.',
    intro: '<p>Tetris gets harder the better you play. The rule is simple: <strong>every 10 cleared rows, the level goes up by one</strong>. The game starts on level 1.</p>' +
           '<p>Rows 0–9 are level 1, rows 10–19 are level 2, rows 20–29 are level 3…</p>',
    spec: {
        input: 'totalLines — how many rows have been cleared in the whole game',
        output: 'The level number, starting at 1',
        algorithm: [
            'Divide totalLines by 10 and round DOWN (Math.floor).',
            'Add 1.',
            'Return it.'
        ]
    },
    starter: 'function levelForLines(totalLines) {\n' +
             '    // every 10 lines is one level, and we start at level 1\n' +
             '}\n',
    answer: 'function levelForLines(totalLines) {\n' +
            '    return Math.floor(totalLines / 10) + 1;\n' +
            '}\n',
    hints: [
        'Math.floor(7 / 10) is 0, and Math.floor(23 / 10) is 2.',
        'The whole function is one line: Math.floor(totalLines / 10) + 1',
        'If you forget the + 1 the game starts on level 0 and never moves.'
    ],
    tests: [
        { name: 'No lines cleared yet = level 1', args: [0], expect: 1 },
        { name: '9 lines is still level 1', args: [9], expect: 1 },
        { name: '10 lines becomes level 2', args: [10], expect: 2 },
        { name: '19 lines is still level 2', args: [19], expect: 2 },
        { name: '35 lines is level 4', args: [35], expect: 4 },
        { name: '100 lines is level 11', args: [100], expect: 11 }
    ],
    demo: { kind: 'game', flags: { gravity: true, lock: true, clear: true, ghost: true, hardDrop: true, hud: true },
            caption: 'The LEVEL box now works. (Clearing 10 rows here takes a while — the next step lets you test it faster.)' }
},

/* ---------------------------------------------------------- 11 */
{
    id: 'dropIntervalForLevel',
    fnName: 'dropIntervalForLevel',
    title: 'Make it faster',
    adds: 'Higher levels really do fall faster.',
    intro: '<p>The level has to <em>mean</em> something. It sets how long the game waits between automatic steps down: 800 milliseconds on level 1, less on every level after that — but never so fast that the game is impossible.</p>',
    spec: {
        input: 'level — the level number (1, 2, 3, …)',
        output: 'How many milliseconds to wait between steps down',
        algorithm: [
            'Work out 800 - (level - 1) * 65.',
            'If that is less than 90, return 90 instead.',
            'Otherwise return it.'
        ]
    },
    warning: 'The floor of 90 matters: without it, level 15 would give a negative wait and the piece would teleport to the bottom.',
    starter: 'function dropIntervalForLevel(level) {\n' +
             '    // 800 ms on level 1, 65 ms faster each level, never below 90 ms\n' +
             '}\n',
    answer: 'function dropIntervalForLevel(level) {\n' +
            '    const interval = 800 - (level - 1) * 65;\n' +
            '    if (interval < 90) {\n' +
            '        return 90;\n' +
            '    }\n' +
            '    return interval;\n' +
            '}\n',
    hints: [
        'Work the number out into a variable first, then decide whether to give it back.',
        'Level 1 must give exactly 800, so the sum uses (level - 1).',
        'Math.max(90, interval) does the same job as the if — either is fine.'
    ],
    tests: [
        { name: 'Level 1 waits 800 ms', args: [1], expect: 800 },
        { name: 'Level 2 waits 735 ms', args: [2], expect: 735 },
        { name: 'Level 5 waits 540 ms', args: [5], expect: 540 },
        { name: 'Level 12 has hit the floor of 90 ms', args: [12], expect: 90 },
        { name: 'Level 30 never goes below 90 ms', args: [30], expect: 90 },
        { name: 'It never returns a negative number', check: function (fn) {
            let worst = null;
            for (let level = 1; level <= 50; level++) {
                const value = fn(level);
                if (value < 90) { worst = level; }
            }
            return { ok: worst === null, detail: worst === null ? '' : 'level ' + worst + ' gave ' + fn(worst) };
        } }
    ],
    demo: { kind: 'game', flags: { gravity: true, lock: true, clear: true, ghost: true, hardDrop: true, hud: true, levelPicker: true },
            caption: 'Use the level buttons to feel your speed curve. Level 12 is properly scary.' }
},

/* ---------------------------------------------------------- 12 */
{
    id: 'actionForKey',
    fnName: 'actionForKey',
    title: 'Wire up the keyboard',
    adds: 'You can play with the keyboard — the game is finished!',
    intro: '<p>Last piece of the puzzle. The browser tells us which key was pressed, as a piece of text like <code>"ArrowLeft"</code> or <code>"a"</code>. The game needs the <em>name of the action</em> instead.</p>' +
           '<p>Turning one kind of value into another is called <strong>mapping</strong>, and it is everywhere in programming.</p>',
    spec: {
        input: 'key — the key name from the browser, e.g. "ArrowLeft", "A", " "',
        output: 'One of: "left", "right", "softDrop", "rotateRight", "rotateLeft", "hardDrop", "pause", "restart" — or null for any other key',
        algorithm: [
            'Make the key lowercase first, so "A" and "a" behave the same.',
            'ArrowLeft or a -> "left"        ArrowRight or d -> "right"',
            'ArrowDown or s -> "softDrop"    ArrowUp, w or x -> "rotateRight"',
            'z -> "rotateLeft"               a space " " -> "hardDrop"',
            'p -> "pause"                    r -> "restart"',
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
            '    if (k === \'arrowleft\' || k === \'a\') { return \'left\'; }\n' +
            '    if (k === \'arrowright\' || k === \'d\') { return \'right\'; }\n' +
            '    if (k === \'arrowdown\' || k === \'s\') { return \'softDrop\'; }\n' +
            '    if (k === \'arrowup\' || k === \'w\' || k === \'x\') { return \'rotateRight\'; }\n' +
            '    if (k === \'z\') { return \'rotateLeft\'; }\n' +
            '    if (k === \' \' || k === \'spacebar\') { return \'hardDrop\'; }\n' +
            '    if (k === \'p\') { return \'pause\'; }\n' +
            '    if (k === \'r\') { return \'restart\'; }\n' +
            '\n' +
            '    return null;\n' +
            '}\n',
    hints: [
        'String(key).toLowerCase() turns "ArrowLeft" into "arrowleft" — compare against the lowercase spelling.',
        'One <code>if</code> per action, each returning straight away. The last line of the function is <code>return null;</code>.',
        'Two keys can share an action: <code>if (k === \'arrowleft\' || k === \'a\')</code>.'
    ],
    tests: [
        { name: 'ArrowLeft moves left', args: ['ArrowLeft'], expect: 'left' },
        { name: 'The letter A also moves left', args: ['a'], expect: 'left' },
        { name: 'A capital A works too', args: ['A'], expect: 'left' },
        { name: 'ArrowRight moves right', args: ['ArrowRight'], expect: 'right' },
        { name: 'ArrowDown is the soft drop', args: ['ArrowDown'], expect: 'softDrop' },
        { name: 'ArrowUp rotates right', args: ['ArrowUp'], expect: 'rotateRight' },
        { name: 'Z rotates the other way', args: ['z'], expect: 'rotateLeft' },
        { name: 'The space bar hard drops', args: [' '], expect: 'hardDrop' },
        { name: 'P pauses', args: ['p'], expect: 'pause' },
        { name: 'R restarts', args: ['r'], expect: 'restart' },
        { name: 'An unused key gives null', args: ['q'], expect: null },
        { name: 'Enter is not one of ours either', args: ['Enter'], expect: null }
    ],
    demo: { kind: 'final', caption: 'Click the board, then play with the keyboard. Every function running here is yours.' }
}

];
