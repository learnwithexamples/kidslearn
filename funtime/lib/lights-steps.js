/* ============================================================
   lights-steps.js - the 7 steps of "Build Lights Out"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const LIGHTS_STEPS = [
    {
        "id": "light_index",
        "fnName": "lightIndex",
        "title": "Number the squares",
        "adds": "The board has places to put lights.",
        "intro": "<p>Twenty-five lights sit in a 5 x 5 grid, but they are stored as one flat <strong>list</strong> of 25 true/false values. So the game needs to turn \"column 2, row 1\" into \"light number 7\".</p><pre class=\"mini-code\"> 0  1  2  3  4\n 5  6  7  8  9\n10 11 12 13 14\n15 16 17 18 19\n20 21 22 23 24</pre>",
        "spec": {
            "input": "column, row - each 0 to GRID_SIZE - 1",
            "output": "the position of that light in the flat list of 25",
            "algorithm": [
                "Skip a whole row of lights for every row above this one: row * GRID_SIZE.",
                "Add the column.",
                "Return the answer."
            ]
        },
        "starter": "function lightIndex(column, row) {\n    // skip whole rows, then add the column\n}\n",
        "answer": "function lightIndex(column, row) {\n    return row * GRID_SIZE + column;\n}\n",
        "hints": [
            "One line.",
            "Skipping `row` rows means skipping row * GRID_SIZE lights.",
            "return row * GRID_SIZE + column;"
        ],
        "tests": [
            {
                "name": "The first light is number 0",
                "code": "assert(lightIndex(0, 0) === 0, 'gave ' + lightIndex(0, 0));"
            },
            {
                "name": "Column 2 of row 1 is number 7",
                "code": "assert(lightIndex(2, 1) === 7, 'gave ' + lightIndex(2, 1) + ', expected 7');"
            },
            {
                "name": "The last light is number 24",
                "code": "assert(lightIndex(4, 4) === 24, 'gave ' + lightIndex(4, 4));"
            },
            {
                "name": "One step down adds a whole row",
                "code": "assert(lightIndex(1, 3) - lightIndex(1, 2) === GRID_SIZE);"
            },
            {
                "name": "All 25 squares get different numbers",
                "code": "const seen = {};\nfor (let r = 0; r < GRID_SIZE; r++) { for (let c = 0; c < GRID_SIZE; c++) { seen[lightIndex(c, r)] = true; } }\nassert(Object.keys(seen).length === 25, 'only ' + Object.keys(seen).length + ' different numbers');"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers every square on the board."
        }
    },
    {
        "id": "is_on_board",
        "fnName": "isOnBoard",
        "title": "Stay on the board",
        "adds": "The game knows where the edges are.",
        "intro": "<p>A light in the middle has four neighbours, but a corner light has only two. Before the game touches a square it has to ask whether that square exists at all.</p>",
        "spec": {
            "input": "column, row",
            "output": "True if both are between 0 and GRID_SIZE - 1",
            "algorithm": [
                "column must be 0 or more, and less than GRID_SIZE.",
                "row must be the same.",
                "Return True only when both are."
            ]
        },
        "starter": "function isOnBoard(column, row) {\n    // four checks joined with &&\n}\n",
        "answer": "function isOnBoard(column, row) {\n    return column >= 0 && column < GRID_SIZE && row >= 0 && row < GRID_SIZE;\n}\n",
        "hints": [
            "Join the checks with &&.",
            "The last column is GRID_SIZE - 1, so use < and not <=.",
            "return column >= 0 && column < GRID_SIZE && row >= 0 && row < GRID_SIZE;"
        ],
        "tests": [
            {
                "name": "The middle is on the board",
                "code": "assert(isOnBoard(2, 2) === true);"
            },
            {
                "name": "Every corner is on the board",
                "code": "assert(isOnBoard(0, 0) && isOnBoard(4, 0) && isOnBoard(0, 4) && isOnBoard(4, 4));"
            },
            {
                "name": "One step left of the board is off it",
                "code": "assert(isOnBoard(-1, 2) === false, 'gave ' + isOnBoard(-1, 2));"
            },
            {
                "name": "One step right of the board is off it",
                "code": "assert(isOnBoard(5, 2) === false, 'column 4 is the last one INSIDE');"
            },
            {
                "name": "Above the top and below the bottom are off it",
                "code": "assert(isOnBoard(2, -1) === false && isOnBoard(2, 5) === false);"
            }
        ],
        "demo": {
            "kind": "cross",
            "caption": "Move the cursor into a corner — the cross gets smaller at the edges."
        }
    },
    {
        "id": "neighbours",
        "fnName": "neighbours",
        "title": "Find the cross",
        "adds": "Pressing a light knows what it touches.",
        "intro": "<p>Pressing a square flips <strong>five</strong> lights: the one you pressed, and the four around it. At the edges some of those five do not exist, so the list is shorter.</p><pre class=\"mini-code\">    .  #  .\n    #  #  #        pressing the middle\n    .  #  .        flips this cross</pre>",
        "spec": {
            "input": "column, row - the square that was pressed",
            "output": "a list of the squares to flip: the square itself, plus the up, down, left and right neighbours that are still on the board",
            "algorithm": [
                "Write down the five steps: no step at all, then up, down, left and right.",
                "For each step, work out the square it lands on.",
                "Keep it only if is-on-board says it exists.",
                "Return the list of squares."
            ]
        },
        "starter": "function neighbours(column, row) {\n    const steps = [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]];\n    // keep the steps that stay on the board\n}\n",
        "answer": "function neighbours(column, row) {\n    const steps = [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]];\n    const found = [];\n    steps.forEach(function (step) {\n        const c = column + step[0];\n        const r = row + step[1];\n        if (isOnBoard(c, r)) {\n            found.push([c, r]);\n        }\n    });\n    return found;\n}\n",
        "hints": [
            "Loop over the five steps.",
            "Add the step to the column and row, then check isOnBoard.",
            "Push [c, r] — a little array holding the column and the row."
        ],
        "tests": [
            {
                "name": "The middle of the board flips five lights",
                "code": "assert(neighbours(2, 2).length === 5, 'gave ' + neighbours(2, 2).length + ' squares');"
            },
            {
                "name": "A corner flips only three",
                "code": "assert(neighbours(0, 0).length === 3, 'a corner has two neighbours plus itself, so 3 — gave ' + neighbours(0, 0).length);"
            },
            {
                "name": "An edge flips four",
                "code": "assert(neighbours(2, 0).length === 4, 'gave ' + neighbours(2, 0).length);"
            },
            {
                "name": "The pressed square is always included",
                "code": "const found = neighbours(3, 1).map(s => s.join(','));\nassert(found.indexOf('3,1') !== -1, 'the square you pressed must be in the list');"
            },
            {
                "name": "Every square it returns is on the board",
                "code": "for (let r = 0; r < GRID_SIZE; r++) { for (let c = 0; c < GRID_SIZE; c++) {\n    neighbours(c, r).forEach(s => assert(isOnBoard(s[0], s[1]), 'returned ' + s + ' which is off the board'));\n} }"
            },
            {
                "name": "It returns the four true neighbours of the middle",
                "code": "const found = neighbours(2, 2).map(s => s.join(',')).sort().join(' ');\nassert(found === '1,2 2,1 2,2 2,3 3,2', 'gave ' + found);"
            }
        ],
        "demo": {
            "kind": "cross",
            "caption": "The lit cross IS your function's answer. Move it to an edge and watch it shrink."
        }
    },
    {
        "id": "press_light",
        "fnName": "pressLight",
        "title": "Flip the cross",
        "adds": "Pressing a square changes the board.",
        "intro": "<p>Now put the two together: press a square, and every light in its cross swaps over — on becomes off and off becomes on.</p><p>Notice something lovely about this game: pressing the same square twice puts everything back. Every move is its own undo.</p>",
        "spec": {
            "input": "lights - the list of 25 values. column, row - the square pressed.",
            "output": "a NEW list with those lights flipped",
            "algorithm": [
                "Copy the list.",
                "For every square in the cross, work out its index and flip the value there.",
                "Return the copy."
            ]
        },
        "starter": "function pressLight(lights, column, row) {\n    const changed = lights.slice();\n    // flip every light in the cross\n}\n",
        "answer": "function pressLight(lights, column, row) {\n    const changed = lights.slice();\n    neighbours(column, row).forEach(function (square) {\n        const index = lightIndex(square[0], square[1]);\n        changed[index] = !changed[index];\n    });\n    return changed;\n}\n",
        "hints": [
            "lights.slice() gives you a copy to work on.",
            "neighbours(column, row) gives the squares; lightIndex turns each into a place in the list.",
            "!value flips true to false and false to true."
        ],
        "tests": [
            {
                "name": "Pressing the middle flips five lights",
                "code": "const before = new Array(LIGHT_COUNT).fill(false);\nconst after = pressLight(before, 2, 2);\nassert(after.filter(v => v).length === 5, 'gave ' + after.filter(v => v).length + ' lights on');"
            },
            {
                "name": "Pressing a corner flips three",
                "code": "const after = pressLight(new Array(LIGHT_COUNT).fill(false), 0, 0);\nassert(after.filter(v => v).length === 3, 'gave ' + after.filter(v => v).length);"
            },
            {
                "name": "It flips the right squares",
                "code": "const after = pressLight(new Array(LIGHT_COUNT).fill(false), 2, 2);\n[[2,2],[2,1],[2,3],[1,2],[3,2]].forEach(s => assert(after[lightIndex(s[0], s[1])] === true, 'square ' + s + ' should be on'));"
            },
            {
                "name": "Pressing twice puts everything back",
                "code": "const before = new Array(LIGHT_COUNT).fill(false);\nbefore[7] = true;\nconst twice = pressLight(pressLight(before, 1, 1), 1, 1);\nassert(JSON.stringify(twice) === JSON.stringify(before), 'pressing the same square twice must undo itself');"
            },
            {
                "name": "Lights already on are turned off",
                "code": "const before = new Array(LIGHT_COUNT).fill(true);\nconst after = pressLight(before, 2, 2);\nassert(after[lightIndex(2, 2)] === false, 'a lit square should go out');"
            },
            {
                "name": "The list you were given is not changed",
                "code": "const before = new Array(LIGHT_COUNT).fill(false);\npressLight(before, 2, 2);\nassert(before.every(v => v === false), 'you changed the list you were given instead of a copy');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Press squares and watch the crosses flip. (Nothing checks for a win yet.)"
        }
    },
    {
        "id": "is_solved",
        "fnName": "isSolved",
        "title": "Have you won?",
        "adds": "Turning every light off wins the game.",
        "intro": "<p>The puzzle is solved when not one light is left on.</p>",
        "spec": {
            "input": "lights - the list of 25 values",
            "output": "True if every one is off",
            "algorithm": [
                "Look at every light.",
                "A single one still on means not solved.",
                "If you get through them all, it is solved."
            ]
        },
        "starter": "function isSolved(lights) {\n    // is every light off?\n}\n",
        "answer": "function isSolved(lights) {\n    for (let i = 0; i < lights.length; i++) {\n        if (lights[i]) {\n            return false;\n        }\n    }\n    return true;\n}\n",
        "hints": [
            "A for loop that returns false the moment it finds a lit one.",
            "return true; goes AFTER the loop.",
            "lights.every(light => !light) does the same in one line."
        ],
        "tests": [
            {
                "name": "A dark board is solved",
                "code": "assert(isSolved(new Array(LIGHT_COUNT).fill(false)) === true);"
            },
            {
                "name": "A board with one light on is not",
                "code": "const lights = new Array(LIGHT_COUNT).fill(false);\nlights[12] = true;\nassert(isSolved(lights) === false, 'light 12 is still on');"
            },
            {
                "name": "A fully lit board is not solved",
                "code": "assert(isSolved(new Array(LIGHT_COUNT).fill(true)) === false);"
            },
            {
                "name": "The very last light counts too",
                "code": "const lights = new Array(LIGHT_COUNT).fill(false);\nlights[LIGHT_COUNT - 1] = true;\nassert(isSolved(lights) === false, 'do not stop looking before the end');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Turn every light off and your function ends the game."
        }
    },
    {
        "id": "create_puzzle",
        "fnName": "createPuzzle",
        "title": "Scramble a puzzle",
        "adds": "Every new game is solvable.",
        "intro": "<p>Here is the clever bit. You could turn random lights on to make a puzzle — but then some puzzles would be <strong>impossible</strong>, because not every pattern of lights can be switched off.</p><p>Instead, start with the board already solved and press random squares. Since pressing is its own undo, whatever you press can always be pressed back. Every puzzle built this way can be solved.</p>",
        "spec": {
            "input": "presses - how many random presses to scramble with",
            "output": "a list of 25 lights",
            "algorithm": [
                "Start with a list of LIGHT_COUNT lights, all off.",
                "Repeat `presses` times: pick a random column and row, and press there.",
                "Return the scrambled lights."
            ]
        },
        "starter": "function createPuzzle(presses) {\n    // start dark, then press random squares\n}\n",
        "answer": "function createPuzzle(presses) {\n    let lights = [];\n    for (let i = 0; i < LIGHT_COUNT; i++) {\n        lights.push(false);\n    }\n    for (let press = 0; press < presses; press++) {\n        const column = Math.floor(Math.random() * GRID_SIZE);\n        const row = Math.floor(Math.random() * GRID_SIZE);\n        lights = pressLight(lights, column, row);\n    }\n    return lights;\n}\n",
        "hints": [
            "Build the dark board first: a list of LIGHT_COUNT falses.",
            "Math.floor(Math.random() * GRID_SIZE) picks a random column.",
            "pressLight returns a NEW list, so remember to store it: lights = pressLight(...)"
        ],
        "tests": [
            {
                "name": "It gives back 25 lights",
                "code": "assert(createPuzzle(5).length === LIGHT_COUNT, 'gave ' + createPuzzle(5).length);"
            },
            {
                "name": "Every value is true or false",
                "code": "assert(createPuzzle(5).every(v => v === true || v === false), 'a light was neither on nor off');"
            },
            {
                "name": "Pressing nothing leaves the board dark",
                "code": "assert(createPuzzle(0).every(v => v === false), 'with no presses every light should be off');"
            },
            {
                "name": "One press lights a cross",
                "code": "const lit = createPuzzle(1).filter(v => v).length;\nassert(lit === 3 || lit === 4 || lit === 5, 'one press should light 3, 4 or 5 squares, not ' + lit);"
            },
            {
                "name": "Different puzzles come out different",
                "code": "const first = createPuzzle(8).join('');\nlet different = false;\nfor (let i = 0; i < 20; i++) { if (createPuzzle(8).join('') !== first) { different = true; } }\nassert(different, 'twenty puzzles came out the same — are you pressing random squares?');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Press New a few times — every puzzle your function makes can be solved."
        },
        "warning": "Build the puzzle by PRESSING, never by turning random lights on. That is what makes it solvable."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Wire up the keyboard",
        "adds": "You can play without a mouse — the game is finished!",
        "intro": "<p>Arrows move a dashed cursor and the space bar presses. The browser gives us a key name; the game needs an action name.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"up\", \"down\", \"left\", \"right\", \"press\", \"pause\", \"restart\" - or nothing",
            "algorithm": [
                "Lowercase the key first.",
                "Arrows or WASD move the cursor.",
                "Space or Enter presses; p pauses; r restarts; anything else is nothing."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // return the action name, or null\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'press'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "One if per action.",
            "Keys can share an action with ||.",
            "The last line is: return null;"
        ],
        "tests": [
            {
                "name": "The arrows move the cursor",
                "code": "assert(actionForKey('ArrowUp') === 'up' && actionForKey('ArrowDown') === 'down' && actionForKey('ArrowLeft') === 'left' && actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "WASD works too",
                "code": "assert(actionForKey('w') === 'up' && actionForKey('d') === 'right');"
            },
            {
                "name": "Capitals still work",
                "code": "assert(actionForKey('W') === 'up', 'did you lowercase the key?');"
            },
            {
                "name": "Space presses the square",
                "code": "assert(actionForKey(' ') === 'press', 'gave ' + actionForKey(' '));"
            },
            {
                "name": "Enter presses too",
                "code": "assert(actionForKey('Enter') === 'press');"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert(actionForKey('p') === 'pause' && actionForKey('r') === 'restart');"
            },
            {
                "name": "An unused key gives null",
                "code": "assert(actionForKey('q') === null, 'gave ' + actionForKey('q'));"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then play with the arrow keys and space."
        },
        "warning": "Return null (JavaScript) or None (Python) for keys the game does not use."
    }
];
