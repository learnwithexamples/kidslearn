/* ============================================================
   maze-steps.js - the 5 steps of "Build Maze Runner"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const MAZE_STEPS = [
    {
        "id": "is_wall",
        "fnName": "isWall",
        "title": "Solid rock",
        "adds": "The maze knows where you can walk.",
        "intro": "<p>The maze is one long list of true/false: is this square solid rock?</p><p>And the same rule as always — anything <em>outside</em> the maze counts as rock too. One line here, and no other function ever has to worry about walking off the edge of the world.</p>",
        "spec": {
            "input": "maze, x, y",
            "output": "True if you cannot walk there",
            "algorithm": [
                "If x or y is outside the maze, return True.",
                "Otherwise look the square up in the maze list."
            ]
        },
        "starter": "function isWall(maze, x, y) {\n    // outside the maze is solid too\n}\n",
        "answer": "function isWall(maze, x, y) {\n    if (!isInsideMaze(x, y)) {\n        return true;\n    }\n    return maze[mazeIndex(x, y)];\n}\n",
        "hints": [
            "isInsideMaze(x, y) is written for you.",
            "mazeIndex(x, y) turns a pair into a place in the list.",
            "Outside the maze returns true — not false."
        ],
        "tests": [
            {
                "name": "Solid rock is wall",
                "code": "assert(isWall(solidMaze(), 5, 5) === true);"
            },
            {
                "name": "A dug-out square is not",
                "code": "const maze = solidMaze();\nmaze[mazeIndex(5, 5)] = false;\nassert(isWall(maze, 5, 5) === false);"
            },
            {
                "name": "Outside the maze counts as wall",
                "code": "const maze = solidMaze();\nassert(isWall(maze, -1, 5) === true);\nassert(isWall(maze, MAZE_WIDTH, 5) === true);\nassert(isWall(maze, 5, -1) === true);\nassert(isWall(maze, 5, MAZE_HEIGHT) === true);"
            },
            {
                "name": "A real maze has open corridors",
                "code": "const maze = carveMaze();\nassert(isWall(maze, 1, 1) === false, 'the starting room must be dug out');"
            },
            {
                "name": "A real maze has a solid border",
                "code": "const maze = carveMaze();\nfor (let x = 0; x < MAZE_WIDTH; x++) {\n    assert(isWall(maze, x, 0) && isWall(maze, x, MAZE_HEIGHT - 1), 'there is a hole in the top or bottom wall');\n}\nfor (let y = 0; y < MAZE_HEIGHT; y++) {\n    assert(isWall(maze, 0, y) && isWall(maze, MAZE_WIDTH - 1, y), 'there is a hole in the side wall');\n}"
            }
        ],
        "demo": {
            "kind": "rock",
            "caption": "Move the dashed box around a tiny hand-dug maze."
        }
    },
    {
        "id": "room_neighbours",
        "fnName": "roomNeighbours",
        "title": "Rooms and the walls between",
        "adds": "The digger knows where it could go next.",
        "intro": "<p>Here is the idea that makes maze-digging easy. The maze is stored so that <strong>rooms sit at odd coordinates</strong> — (1,1), (1,3), (3,1) and so on — and the square between two rooms is the wall that separates them.</p><p>So a neighbouring room is <em>two</em> squares away, and the wall to knock through is the <em>one</em> square in between. This function returns both, so the digger has everything it needs.</p>",
        "spec": {
            "input": "x, y — a room",
            "output": "a list of the neighbouring rooms and the wall between each",
            "algorithm": [
                "Try all four steps: up two, right two, down two, left two.",
                "Skip any that would land outside the maze.",
                "For each one that fits, give back the room's x and y, and the wall's x and y — which is halfway there."
            ]
        },
        "starter": "function roomNeighbours(x, y) {\n    const steps = [[0, -2], [2, 0], [0, 2], [-2, 0]];\n    const found = [];\n    // the room two away, and the wall one away\n    return found;\n}\n",
        "answer": "function roomNeighbours(x, y) {\n    const steps = [[0, -2], [2, 0], [0, 2], [-2, 0]];\n    const found = [];\n    for (let i = 0; i < steps.length; i++) {\n        const nx = x + steps[i][0];\n        const ny = y + steps[i][1];\n        if (isInsideMaze(nx, ny)) {\n            found.push({\n                x: nx, y: ny,\n                wallX: x + steps[i][0] / 2,\n                wallY: y + steps[i][1] / 2\n            });\n        }\n    }\n    return found;\n}\n",
        "hints": [
            "The wall is exactly halfway, so divide the step by 2.",
            "isInsideMaze(nx, ny) keeps you on the board.",
            "wallX: x + steps[i][0] / 2"
        ],
        "tests": [
            {
                "name": "A room in the middle has four neighbours",
                "code": "assert(roomNeighbours(5, 5).length === 4, 'gave ' + roomNeighbours(5, 5).length);"
            },
            {
                "name": "The top-left room has only two",
                "code": "assert(roomNeighbours(1, 1).length === 2, 'gave ' + roomNeighbours(1, 1).length + ' — two of its neighbours are off the maze');"
            },
            {
                "name": "Neighbours really are two squares away",
                "code": "roomNeighbours(5, 5).forEach(function (n) {\n    const distance = Math.abs(n.x - 5) + Math.abs(n.y - 5);\n    assert(distance === 2, 'that neighbour is ' + distance + ' away, not 2');\n});"
            },
            {
                "name": "The wall is halfway between",
                "code": "roomNeighbours(5, 5).forEach(function (n) {\n    assert(n.wallX === (5 + n.x) / 2, 'the wall x should be halfway');\n    assert(n.wallY === (5 + n.y) / 2, 'the wall y should be halfway');\n});"
            },
            {
                "name": "Every neighbour it names is on the maze",
                "code": "for (let y = 1; y < MAZE_HEIGHT; y += 2) {\n    for (let x = 1; x < MAZE_WIDTH; x += 2) {\n        roomNeighbours(x, y).forEach(function (n) {\n            assert(isInsideMaze(n.x, n.y), '(' + n.x + ',' + n.y + ') is off the maze');\n        });\n    }\n}"
            },
            {
                "name": "Every neighbour is a room, not a wall square",
                "code": "roomNeighbours(5, 5).forEach(function (n) {\n    assert(n.x % 2 === 1 && n.y % 2 === 1, 'rooms live at ODD coordinates');\n});"
            }
        ],
        "demo": {
            "kind": "rock",
            "caption": "The rooms are at odd coordinates — walk the box along row 1 and see."
        }
    },
    {
        "id": "carve_maze",
        "fnName": "carveMaze",
        "title": "Dig the maze",
        "adds": "A brand-new maze, every game.",
        "intro": "<p>The big one. This is the <strong>recursive backtracker</strong>, and it is the algorithm behind most of the mazes you have ever played.</p><p>It works exactly like walking through solid rock with a pick and a piece of string:</p><ol><li>Dig out the first room and hold on to it (that is the stack).</li><li>Look at the room you are standing in. Are any of its neighbours still solid?</li><li>If yes: pick one at random, knock through the wall between, dig it out, and walk in. Hold on to that room too.</li><li>If no: walk back one room along your string, and look again.</li><li>When your string runs out, every room has been dug and the maze is finished.</li></ol><p>What you get is a <em>perfect</em> maze: every room reachable, exactly one route between any two of them, no loops.</p>",
        "spec": {
            "input": "nothing",
            "output": "a maze — a list where True means wall",
            "algorithm": [
                "Start with solid rock. Dig out room (1, 1) and put it on the stack.",
                "While the stack is not empty, look at the room on TOP of it.",
                "Shuffle its neighbours, and look for the first one that is still solid rock.",
                "If you find one: knock out the wall between, dig out the room, and push the room onto the stack.",
                "If there is none: pop the top room off the stack.",
                "When the stack is empty, return the maze."
            ]
        },
        "starter": "function carveMaze() {\n    const maze = solidMaze();\n    // dig (1,1), then walk with a stack until it is empty\n    return maze;\n}\n",
        "answer": "function carveMaze() {\n    const maze = solidMaze();\n    const start = { x: 1, y: 1 };\n    maze[mazeIndex(start.x, start.y)] = false;\n\n    const stack = [start];\n    while (stack.length > 0) {\n        const here = stack[stack.length - 1];\n        const options = shuffle(roomNeighbours(here.x, here.y));\n\n        let dug = false;\n        for (let i = 0; i < options.length; i++) {\n            const next = options[i];\n            if (isWall(maze, next.x, next.y)) {\n                maze[mazeIndex(next.wallX, next.wallY)] = false;\n                maze[mazeIndex(next.x, next.y)] = false;\n                stack.push({ x: next.x, y: next.y });\n                dug = true;\n                break;\n            }\n        }\n\n        if (!dug) {\n            stack.pop();\n        }\n    }\n    return maze;\n}\n",
        "hints": [
            "stack[stack.length - 1] is the room you are standing in — LOOK at it, do not remove it yet.",
            "shuffle(list) is written for you; so are roomNeighbours and isWall.",
            "Knock out TWO squares: the wall between, and the room itself.",
            "Only pop when there was nowhere new to dig."
        ],
        "tests": [
            {
                "name": "The starting room is dug out",
                "code": "const maze = carveMaze();\nassert(isWall(maze, 1, 1) === false);"
            },
            {
                "name": "Every room gets dug out",
                "code": "const maze = carveMaze();\nfor (let y = 1; y < MAZE_HEIGHT; y += 2) {\n    for (let x = 1; x < MAZE_WIDTH; x += 2) {\n        assert(isWall(maze, x, y) === false, 'room (' + x + ',' + y + ') was never dug');\n    }\n}"
            },
            {
                "name": "The border stays solid",
                "code": "const maze = carveMaze();\nfor (let x = 0; x < MAZE_WIDTH; x++) {\n    assert(isWall(maze, x, 0) && isWall(maze, x, MAZE_HEIGHT - 1));\n}\nfor (let y = 0; y < MAZE_HEIGHT; y++) {\n    assert(isWall(maze, 0, y) && isWall(maze, MAZE_WIDTH - 1, y));\n}"
            },
            {
                "name": "Every room can be reached from the start",
                "code": "const maze = carveMaze();\nfor (let y = 1; y < MAZE_HEIGHT; y += 2) {\n    for (let x = 1; x < MAZE_WIDTH; x += 2) {\n        assert(findPath(maze, { x: 1, y: 1 }, { x: x, y: y }).length > 0, 'room (' + x + ',' + y + ') is walled off');\n    }\n}"
            },
            {
                "name": "The exit can be reached",
                "code": "for (let trial = 0; trial < 12; trial++) {\n    const maze = carveMaze();\n    assert(shortestFromStart(maze) > 0, 'there is no way out of this maze');\n}"
            },
            {
                "name": "Corners of the wall grid stay solid",
                "code": "const maze = carveMaze();\nassert(isWall(maze, 2, 2) === true, 'the square where four walls meet can never be dug');\nassert(isWall(maze, 4, 6) === true);"
            },
            {
                "name": "Two mazes in a row are different",
                "code": "const a = carveMaze().join('');\nconst b = carveMaze().join('');\nassert(a !== b, 'each game should get its own maze');"
            }
        ],
        "demo": {
            "kind": "carve",
            "caption": "Press the button and watch a brand-new maze appear, every time."
        },
        "warning": "LOOK at the top of the stack, do not pop it, until you are sure there is nowhere new to dig. Pop too early and the digger never walks back — leaving most of the maze solid rock."
    },
    {
        "id": "find_path",
        "fnName": "findPath",
        "title": "Find the way out",
        "adds": "The maze can show you the shortest route.",
        "intro": "<p>The most useful algorithm in this whole collection: <strong>breadth-first search</strong>. It finds the shortest way through anything — a maze, a road map, a chess position, six degrees of separation.</p><p>It works by spreading out evenly, like a ripple:</p><ol><li>Put the starting square in a <strong>queue</strong>, and remember that you came to it from nowhere.</li><li>Take the square at the FRONT of the queue.</li><li>For each open neighbour you have never seen: remember which square you came from, and add it to the BACK of the queue.</li><li>When you take the target off the queue, follow the 'came from' trail backwards to build the route.</li></ol><p>The queue is the whole trick. Front in, back out means you always look at the nearest squares first — so the first time you arrive anywhere is by the shortest possible route.</p>",
        "spec": {
            "input": "maze. from, to — two squares.",
            "output": "a list of squares from start to finish, or an empty list",
            "algorithm": [
                "Remember where you came from for each square. The start came from nowhere: -1.",
                "Keep a queue, starting with the first square, and take squares from the FRONT.",
                "If this square is the target, build the path and return it.",
                "Otherwise look at the four squares around it. If one is open and you have never seen it, note where it came from and add it to the BACK of the queue.",
                "If the queue empties out, there is no way through: return an empty list."
            ]
        },
        "starter": "function findPath(maze, from, to) {\n    // breadth-first search: a queue, and a trail of where you came from\n    return [];\n}\n",
        "answer": "function findPath(maze, from, to) {\n    const cameFrom = {};\n    const startKey = mazeIndex(from.x, from.y);\n    cameFrom[startKey] = -1;\n\n    const queue = [from];\n    let head = 0;\n\n    while (head < queue.length) {\n        const here = queue[head];\n        head = head + 1;\n\n        if (here.x === to.x && here.y === to.y) {\n            return buildPath(cameFrom, from, to);\n        }\n\n        const steps = [[0, -1], [1, 0], [0, 1], [-1, 0]];\n        for (let i = 0; i < steps.length; i++) {\n            const nx = here.x + steps[i][0];\n            const ny = here.y + steps[i][1];\n            const key = mazeIndex(nx, ny);\n            if (!isWall(maze, nx, ny) && cameFrom[key] === undefined) {\n                cameFrom[key] = mazeIndex(here.x, here.y);\n                queue.push({ x: nx, y: ny });\n            }\n        }\n    }\n    return [];\n}\n",
        "hints": [
            "Walking the list forwards with a `head` counter is a queue: push on the end, read from the front.",
            "buildPath(cameFrom, from, to) is written for you.",
            "Check 'have I seen this square?' with cameFrom[key] === undefined — that is what stops it going round for ever."
        ],
        "tests": [
            {
                "name": "It finds a way through a real maze",
                "code": "const maze = carveMaze();\nconst path = findPath(maze, { x: 1, y: 1 }, exitSquare());\nassert(path.length > 0, 'every maze has a way out');"
            },
            {
                "name": "The path starts where you asked",
                "code": "const maze = carveMaze();\nconst path = findPath(maze, { x: 1, y: 1 }, exitSquare());\nassert(path[0].x === 1 && path[0].y === 1, 'the route must start at the start');"
            },
            {
                "name": "The path ends where you asked",
                "code": "const maze = carveMaze();\nconst exit = exitSquare();\nconst path = findPath(maze, { x: 1, y: 1 }, exit);\nconst last = path[path.length - 1];\nassert(last.x === exit.x && last.y === exit.y);"
            },
            {
                "name": "Every step of the path is one square",
                "code": "const maze = carveMaze();\nconst path = findPath(maze, { x: 1, y: 1 }, exitSquare());\nfor (let i = 1; i < path.length; i++) {\n    const distance = Math.abs(path[i].x - path[i - 1].x) + Math.abs(path[i].y - path[i - 1].y);\n    assert(distance === 1, 'step ' + i + ' jumps ' + distance + ' squares');\n}"
            },
            {
                "name": "The path never goes through rock",
                "code": "const maze = carveMaze();\nconst path = findPath(maze, { x: 1, y: 1 }, exitSquare());\npath.forEach(function (square) {\n    assert(isWall(maze, square.x, square.y) === false, 'the route walks through a wall!');\n});"
            },
            {
                "name": "Standing on the target gives a path of one",
                "code": "const maze = carveMaze();\nconst path = findPath(maze, { x: 1, y: 1 }, { x: 1, y: 1 });\nassert(path.length === 1, 'gave ' + path.length);"
            },
            {
                "name": "It really is the SHORTEST route",
                "code": "const maze = solidMaze();\n/* dig a long way round and a short way through */\nfor (let x = 1; x <= 5; x++) { maze[mazeIndex(x, 1)] = false; }\nfor (let y = 1; y <= 5; y++) { maze[mazeIndex(1, y)] = false; maze[mazeIndex(5, y)] = false; }\nfor (let x = 1; x <= 5; x++) { maze[mazeIndex(x, 5)] = false; }\nmaze[mazeIndex(3, 1)] = false;\nfor (let y = 1; y <= 5; y++) { maze[mazeIndex(3, y)] = false; }\nconst path = findPath(maze, { x: 1, y: 1 }, { x: 3, y: 5 });\nassert(path.length === 7, 'the shortest way is 7 squares, but it found ' + path.length + ' — is your queue really a queue?');"
            },
            {
                "name": "A walled-off square gives nothing",
                "code": "const maze = solidMaze();\nmaze[mazeIndex(1, 1)] = false;\nmaze[mazeIndex(9, 9)] = false;\nassert(findPath(maze, { x: 1, y: 1 }, { x: 9, y: 9 }).length === 0, 'there is no way through solid rock');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Press Hint and the shortest way out lights up as a trail of dots."
        },
        "warning": "Take from the FRONT of the queue, not the back. Take from the back and you have a stack, not a queue — it still finds a way out, but a wandering one, not the shortest."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function. Four directions, a hint, and a new maze.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "The arrows or WASD walk.",
                "H or space → 'hint'. N or Enter → 'new'. P → 'pause'.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // walk, hint, new, pause\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === 'h' || k === ' ' || k === 'spacebar') { return 'hint'; }\n    if (k === 'n' || k === 'enter') { return 'new'; }\n    if (k === 'p') { return 'pause'; }\n\n    return null;\n}\n",
        "hints": [
            "H for hint, and the space bar as well since it is the easiest key to hit.",
            "toLowerCase() up front means capitals work too.",
            "Seven ifs and a return null;"
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
                "name": "H and space both ask for a hint",
                "code": "assert(actionForKey('h') === 'hint');\nassert(actionForKey(' ') === 'hint');"
            },
            {
                "name": "N and Enter both dig a new maze",
                "code": "assert(actionForKey('n') === 'new');\nassert(actionForKey('Enter') === 'new');"
            },
            {
                "name": "Capital letters work",
                "code": "assert(actionForKey('H') === 'hint');\nassert(actionForKey('N') === 'new');"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert(actionForKey('q') === null);\nassert(actionForKey('Tab') === null);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then find your way out with the arrow keys. H if you get lost."
        }
    }
];
