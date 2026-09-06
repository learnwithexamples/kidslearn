/* ============================================================
   sokoban-steps.js - the 6 steps of "Build Sokoban"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const SOKOBAN_STEPS = [
    {
        "id": "is_wall",
        "fnName": "isWall",
        "title": "What can you walk on?",
        "adds": "The walls become solid.",
        "intro": "<p>The level is stored as a list of true/false: is this square a wall?</p><p>There is one extra rule worth copying into every grid game you ever write: anything <em>outside</em> the level counts as a wall too. Get that right here and no other function ever has to worry about walking off the edge of the world.</p>",
        "spec": {
            "input": "state, x, y",
            "output": "True if you cannot walk there",
            "algorithm": [
                "If x or y is outside the level, return True.",
                "Otherwise look the square up in state.walls."
            ]
        },
        "starter": "function isWall(state, x, y) {\n    // outside the level counts as a wall too\n}\n",
        "answer": "function isWall(state, x, y) {\n    if (x < 0 || x >= LEVEL_WIDTH || y < 0 || y >= LEVEL_HEIGHT) {\n        return true;\n    }\n    return state.walls[cellIndex(x, y)];\n}\n",
        "hints": [
            "Check the edges FIRST, before looking anything up in the list.",
            "cellIndex(x, y) turns a pair into a place in the list.",
            "Outside the level returns true — not false."
        ],
        "tests": [
            {
                "name": "The border of every level is wall",
                "code": "const state = createGame();\nassert(isWall(state, 0, 0) === true);\nassert(isWall(state, 0, 3) === true);"
            },
            {
                "name": "Open floor is not",
                "code": "const state = createGame();\nassert(isWall(state, 4, 3) === false, 'the player is standing there');"
            },
            {
                "name": "Outside the level counts as wall",
                "code": "const state = createGame();\nassert(isWall(state, -1, 3) === true, 'off the left edge');\nassert(isWall(state, LEVEL_WIDTH, 3) === true, 'off the right edge');\nassert(isWall(state, 4, -1) === true);\nassert(isWall(state, 4, LEVEL_HEIGHT) === true);"
            },
            {
                "name": "The level with a wall in the middle knows about it",
                "code": "const state = createGame();\nloadLevel(state, 3);\nassert(isWall(state, 4, 2) === true, 'level 4 has a wall standing in the way');"
            },
            {
                "name": "You can never walk off any level",
                "code": "const state = createGame();\nfor (let level = 0; level < LEVELS.length; level++) {\n    loadLevel(state, level);\n    for (let x = 0; x < LEVEL_WIDTH; x++) {\n        assert(isWall(state, x, 0) && isWall(state, x, LEVEL_HEIGHT - 1), 'level ' + level + ' has a hole in its top or bottom wall');\n    }\n}"
            }
        ],
        "demo": {
            "kind": "walls",
            "caption": "Move the dashed box around and see which squares are wall."
        }
    },
    {
        "id": "box_at",
        "fnName": "boxAt",
        "title": "Which box is that?",
        "adds": "The game can find its boxes.",
        "intro": "<p>The boxes are a list of positions, and the move function needs to know not just <em>whether</em> there is a box in the way, but <strong>which one</strong> — so it can move that one.</p><p>So this returns a number: 0, 1, 2 … or -1 for none. Using -1 to mean 'not found' is an old convention you will meet everywhere.</p>",
        "spec": {
            "input": "state, x, y",
            "output": "which box it is, or -1 for none",
            "algorithm": [
                "Look through the boxes one at a time.",
                "If a box's x and y both match, return its position in the list.",
                "If you get all the way through, return -1."
            ]
        },
        "starter": "function boxAt(state, x, y) {\n    // which box is standing here? -1 for none\n}\n",
        "answer": "function boxAt(state, x, y) {\n    for (let i = 0; i < state.boxes.length; i++) {\n        if (state.boxes[i].x === x && state.boxes[i].y === y) {\n            return i;\n        }\n    }\n    return -1;\n}\n",
        "hints": [
            "A for loop with the counter i, so you can return i itself.",
            "BOTH the x and the y have to match.",
            "return -1; goes after the loop, not inside it."
        ],
        "tests": [
            {
                "name": "It finds a box that is there",
                "code": "const state = createGame();\nconst box = state.boxes[0];\nassert(boxAt(state, box.x, box.y) === 0);"
            },
            {
                "name": "Empty floor gives -1",
                "code": "const state = createGame();\nassert(boxAt(state, 1, 1) === -1, 'gave ' + boxAt(state, 1, 1));"
            },
            {
                "name": "It finds the SECOND box too",
                "code": "const state = createGame();\nloadLevel(state, 2);\nconst box = state.boxes[1];\nassert(boxAt(state, box.x, box.y) === 1, 'gave ' + boxAt(state, box.x, box.y) + ' — the answer must say WHICH box');"
            },
            {
                "name": "Both the x and the y have to match",
                "code": "const state = createGame();\nconst box = state.boxes[0];\nassert(boxAt(state, box.x, box.y + 1) === -1, 'the square below the box is empty');\nassert(boxAt(state, box.x + 1, box.y) === -1);"
            },
            {
                "name": "Every box can be found where it stands",
                "code": "const state = createGame();\nloadLevel(state, 4);\nfor (let i = 0; i < state.boxes.length; i++) {\n    assert(boxAt(state, state.boxes[i].x, state.boxes[i].y) === i, 'box ' + i + ' was not found at its own position');\n}"
            }
        ],
        "demo": {
            "kind": "boxes",
            "caption": "Move the dashed box onto a crate and watch the number change."
        }
    },
    {
        "id": "boxes_on_goals",
        "fnName": "boxesOnGoals",
        "title": "How many are home?",
        "adds": "The game can tell how you are doing.",
        "intro": "<p>A short one that does two jobs: it fills in the scoreboard, and the next function is built entirely out of it.</p>",
        "spec": {
            "input": "state",
            "output": "how many boxes are standing on a target",
            "algorithm": [
                "Start a count at 0.",
                "For each box, ask is-goal whether it is standing on a target.",
                "Add 1 if it is."
            ]
        },
        "starter": "function boxesOnGoals(state) {\n    // count the boxes standing on a target\n}\n",
        "answer": "function boxesOnGoals(state) {\n    let count = 0;\n    for (let i = 0; i < state.boxes.length; i++) {\n        if (isGoal(state, state.boxes[i].x, state.boxes[i].y)) {\n            count = count + 1;\n        }\n    }\n    return count;\n}\n",
        "hints": [
            "isGoal(state, x, y) is written for you.",
            "Walk the BOXES, not the whole level.",
            "One loop, one if, one count."
        ],
        "tests": [
            {
                "name": "A fresh level has nothing home",
                "code": "const state = createGame();\nassert(boxesOnGoals(state) === 0);"
            },
            {
                "name": "Pushing a box home counts it",
                "code": "const state = createGame();\nmovePlayer(state, -1, 0);\nassert(boxesOnGoals(state) === 1, 'that push put the box on the target');"
            },
            {
                "name": "It counts every box, not just the first",
                "code": "const state = createGame();\nloadLevel(state, 2);\nstate.boxes[0] = { x: 4, y: 2 };\nstate.boxes[1] = { x: 5, y: 2 };\nassert(boxesOnGoals(state) === 2, 'gave ' + boxesOnGoals(state));"
            },
            {
                "name": "A box on plain floor does not count",
                "code": "const state = createGame();\nloadLevel(state, 2);\nstate.boxes[0] = { x: 1, y: 1 };\nassert(boxesOnGoals(state) < state.boxes.length);"
            },
            {
                "name": "It never counts more boxes than there are",
                "code": "const state = createGame();\nfor (let level = 0; level < LEVELS.length; level++) {\n    loadLevel(state, level);\n    assert(boxesOnGoals(state) <= state.boxes.length);\n}"
            }
        ],
        "demo": {
            "kind": "push",
            "caption": "Push the boxes about and watch the count."
        }
    },
    {
        "id": "move_player",
        "fnName": "movePlayer",
        "title": "Walk and push",
        "adds": "The game can be played!",
        "intro": "<p>The heart of Sokoban, and it is all about looking <em>two</em> squares ahead.</p><p>Step into a wall and nothing happens. Step into a box and you have to check the square <strong>behind the box</strong> as well — because that is where the box is going. If a wall or another box is there, nothing moves at all: not the box, and not you.</p><p>Save a snapshot for undo <em>before</em> you change anything, or the undo will remember the move you just made instead of the one before it.</p>",
        "spec": {
            "input": "state. dx, dy — the step, e.g. 1 and 0 for 'right'.",
            "output": "True if anything moved",
            "algorithm": [
                "Work out the square you are stepping into. If it is a wall, stop.",
                "Ask box-at whether a box is there.",
                "If it is: work out where the box would go. If that square is a wall or holds another box, stop.",
                "Save a snapshot onto the history, then move the box and count the push.",
                "If there was no box, just save the snapshot.",
                "Move yourself, count the move, and see whether the level is solved."
            ]
        },
        "starter": "function movePlayer(state, dx, dy) {\n    // 1. wall? stop\n    // 2. box? check BEHIND the box too\n    // 3. save for undo, then move\n}\n",
        "answer": "function movePlayer(state, dx, dy) {\n    if (state.isSolved || state.isPaused) {\n        return false;\n    }\n    const toX = state.player.x + dx;\n    const toY = state.player.y + dy;\n\n    if (isWall(state, toX, toY)) {\n        return false;\n    }\n\n    const box = boxAt(state, toX, toY);\n    if (box !== -1) {\n        const boxToX = toX + dx;\n        const boxToY = toY + dy;\n        if (isWall(state, boxToX, boxToY) || boxAt(state, boxToX, boxToY) !== -1) {\n            return false;\n        }\n        state.history.push(snapshot(state));\n        state.boxes[box] = { x: boxToX, y: boxToY };\n        state.pushes = state.pushes + 1;\n    } else {\n        state.history.push(snapshot(state));\n    }\n\n    state.player = { x: toX, y: toY };\n    state.moves = state.moves + 1;\n\n    if (isSolved(state)) {\n        state.isSolved = true;\n    }\n    return true;\n}\n",
        "hints": [
            "The box goes one step FURTHER in the same direction: toX + dx.",
            "Two things can block a box: a wall, and another box.",
            "snapshot(state) and state.history.push(...) do the undo bookkeeping."
        ],
        "tests": [
            {
                "name": "Walking on empty floor works",
                "code": "const state = createGame();\nconst before = state.player.x;\nmovePlayer(state, 1, 0);\nassert(state.player.x === before + 1);"
            },
            {
                "name": "A wall stops you dead",
                "code": "const state = createGame();\nstate.player = { x: 1, y: 1 };\nassert(movePlayer(state, -1, 0) === false);\nassert(state.player.x === 1, 'you should not have moved');"
            },
            {
                "name": "Walking into a box pushes it",
                "code": "const state = createGame();\nconst box = { x: state.boxes[0].x, y: state.boxes[0].y };\nmovePlayer(state, -1, 0);\nassert(state.boxes[0].x === box.x - 1, 'the box should have been pushed along');"
            },
            {
                "name": "Pushing a box into a wall does nothing at all",
                "code": "const state = createGame();\nloadLevel(state, 1);\nstate.player = { x: 5, y: 2 };\nstate.boxes[0] = { x: 5, y: 1 };\nassert(movePlayer(state, 0, -1) === false, 'there is a wall behind that box');\nassert(state.player.y === 2, 'you must not move either');"
            },
            {
                "name": "A box cannot be pushed into another box",
                "code": "const state = createGame();\nloadLevel(state, 2);\nstate.player = { x: 2, y: 3 };\nstate.boxes[0] = { x: 3, y: 3 };\nstate.boxes[1] = { x: 4, y: 3 };\nassert(movePlayer(state, 1, 0) === false, 'the second box is in the way');"
            },
            {
                "name": "A push is counted",
                "code": "const state = createGame();\nmovePlayer(state, -1, 0);\nassert(state.pushes === 1, 'pushes is ' + state.pushes);"
            },
            {
                "name": "Walking without pushing does not count as a push",
                "code": "const state = createGame();\nmovePlayer(state, 1, 0);\nassert(state.pushes === 0);"
            },
            {
                "name": "Every move is remembered for undo",
                "code": "const state = createGame();\nmovePlayer(state, 1, 0);\nmovePlayer(state, 0, 1);\nassert(state.history.length === 2, 'history has ' + state.history.length + ' snapshots');"
            },
            {
                "name": "Getting the box home solves the level",
                "code": "const state = createGame();\nmovePlayer(state, -1, 0);\nassert(state.isSolved === true, 'that push finished level 1');"
            },
            {
                "name": "Level 1 can really be solved",
                "code": "const state = createGame();\nassert(movePlayer(state, -1, 0) === true);\nassert(boxesOnGoals(state) === state.boxes.length);"
            }
        ],
        "demo": {
            "kind": "push",
            "caption": "Walk around and push the boxes onto the rings."
        },
        "warning": "Check the square BEHIND the box as well. Miss that and boxes will happily slide into walls and through each other."
    },
    {
        "id": "undo_move",
        "fnName": "undoMove",
        "title": "Undo",
        "adds": "You can take a move back.",
        "intro": "<p>Sokoban only lets you push, never pull. Shove a box into a corner and the level is finished — not lost, just impossible. Without undo that would be miserable.</p><p>The history is a <strong>stack</strong>: snapshots piled up, newest on top. Undo takes the top one off and puts it back. Because every move added exactly one, undo can walk all the way to the start of the level.</p>",
        "spec": {
            "input": "state",
            "output": "True if there was anything to undo",
            "algorithm": [
                "If the history is empty, there is nothing to undo.",
                "Take the newest snapshot off the top.",
                "Put its player and boxes back into the state.",
                "Count it as a move, and work out whether the level is still solved."
            ]
        },
        "starter": "function undoMove(state) {\n    // take the newest snapshot off the stack and put it back\n}\n",
        "answer": "function undoMove(state) {\n    if (state.history.length === 0) {\n        return false;\n    }\n    const past = state.history.pop();\n    state.player = past.player;\n    state.boxes = past.boxes;\n    state.moves = state.moves + 1;\n    state.isSolved = isSolved(state);\n    return true;\n}\n",
        "hints": [
            "pop() takes the LAST thing off a list — the newest snapshot.",
            "Put back both the player and the boxes.",
            "Work out isSolved again — undoing can un-solve a level."
        ],
        "tests": [
            {
                "name": "Undo puts the player back",
                "code": "const state = createGame();\nconst before = state.player.x;\nmovePlayer(state, 1, 0);\nundoMove(state);\nassert(state.player.x === before, 'x is ' + state.player.x);"
            },
            {
                "name": "Undo puts a pushed box back",
                "code": "const state = createGame();\nconst before = state.boxes[0].x;\nmovePlayer(state, -1, 0);\nundoMove(state);\nassert(state.boxes[0].x === before, 'the box should be back where it was');"
            },
            {
                "name": "Undo with nothing to undo does nothing",
                "code": "const state = createGame();\nassert(undoMove(state) === false);"
            },
            {
                "name": "Undo can walk all the way back",
                "code": "const state = createGame();\nconst startX = state.player.x;\nconst startY = state.player.y;\nmovePlayer(state, 1, 0);\nmovePlayer(state, 0, 1);\nmovePlayer(state, 1, 0);\nwhile (undoMove(state)) { /* keep going */ }\nassert(state.player.x === startX && state.player.y === startY, 'undo should reach the very start');"
            },
            {
                "name": "Undo un-solves a solved level",
                "code": "const state = createGame();\nmovePlayer(state, -1, 0);\nassert(state.isSolved === true);\nundoMove(state);\nassert(state.isSolved === false, 'taking the winning push back must un-win the level');"
            },
            {
                "name": "The snapshots really are separate copies",
                "code": "const state = createGame();\nmovePlayer(state, -1, 0);\nstate.boxes[0].x = 99;\nundoMove(state);\nassert(state.boxes[0].x !== 99, 'the saved snapshot must be a COPY — changing a box afterwards must not change history');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Push a box somewhere silly, then press Undo until you are back at the start."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function. Four directions, plus undo, reset and next.</p><p>Notice that undo has three keys — U, Z and Backspace. Different people reach for different ones, and letting all three work costs nothing.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "The arrows or WASD walk.",
                "U, Z or Backspace → 'undo'. R → 'reset'. N or Enter → 'next'. P → 'pause'.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // walk, undo, reset, next, pause\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === 'u' || k === 'z' || k === 'backspace') { return 'undo'; }\n    if (k === 'r') { return 'reset'; }\n    if (k === 'n' || k === 'enter') { return 'next'; }\n    if (k === 'p') { return 'pause'; }\n\n    return null;\n}\n",
        "hints": [
            "Backspace's key name is exactly 'Backspace'.",
            "Three keys can all return 'undo' — just list them in one if.",
            "toLowerCase() up front means capitals work too."
        ],
        "tests": [
            {
                "name": "The arrows walk",
                "code": "assert(actionForKey('ArrowUp') === 'up');\nassert(actionForKey('ArrowDown') === 'down');\nassert(actionForKey('ArrowLeft') === 'left');\nassert(actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "WASD walks too",
                "code": "assert(actionForKey('w') === 'up');\nassert(actionForKey('s') === 'down');\nassert(actionForKey('a') === 'left');\nassert(actionForKey('d') === 'right');"
            },
            {
                "name": "All three undo keys work",
                "code": "assert(actionForKey('u') === 'undo');\nassert(actionForKey('z') === 'undo');\nassert(actionForKey('Backspace') === 'undo');"
            },
            {
                "name": "R resets and N moves on",
                "code": "assert(actionForKey('r') === 'reset');\nassert(actionForKey('n') === 'next');\nassert(actionForKey('Enter') === 'next');"
            },
            {
                "name": "Capital letters work",
                "code": "assert(actionForKey('U') === 'undo');\nassert(actionForKey('R') === 'reset');"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert(actionForKey('q') === null);\nassert(actionForKey('Tab') === null);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then solve all six levels with the arrow keys. U undoes."
        }
    }
];
