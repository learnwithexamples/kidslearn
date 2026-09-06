/* ============================================================
   flappy-steps.js - the 8 steps of "Build Flappy"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const FLAPPY_STEPS = [
    {
        "id": "apply_gravity",
        "fnName": "applyGravity",
        "title": "Make the bird fall",
        "adds": "Gravity! The bird drops out of the sky.",
        "intro": "<p>Here is the idea that makes every falling thing in every game work.</p><p>Gravity does not move the bird. It changes the bird's <strong>speed</strong>. Each frame the bird falls a little faster than the frame before, which is exactly what real falling looks like.</p><p>So there are two sums, in this order: first speed changes, then position changes.</p>",
        "spec": {
            "input": "bird — something with y and dy. seconds — how long this frame took.",
            "output": "nothing; it changes the bird",
            "algorithm": [
                "Add GRAVITY × seconds to the bird's dy.",
                "If dy is now bigger than MAX_FALL_SPEED, hold it there.",
                "Move the bird: add dy × seconds to its y."
            ]
        },
        "starter": "function applyGravity(bird, seconds) {\n    // 1. speed up\n    // 2. don't fall TOO fast\n    // 3. move\n}\n",
        "answer": "function applyGravity(bird, seconds) {\n    bird.dy = bird.dy + GRAVITY * seconds;\n    if (bird.dy > MAX_FALL_SPEED) {\n        bird.dy = MAX_FALL_SPEED;\n    }\n    bird.y = bird.y + bird.dy * seconds;\n}\n",
        "hints": [
            "dy is the speed; y is the place. Gravity changes the speed.",
            "The order matters: change dy first, then use it to move y.",
            "bird.dy = bird.dy + GRAVITY * seconds;"
        ],
        "tests": [
            {
                "name": "Gravity speeds the bird up",
                "code": "const bird = { y: 100, dy: 0 };\napplyGravity(bird, 0.1);\nassert(Math.abs(bird.dy - 90) < 0.001, 'dy is ' + bird.dy);"
            },
            {
                "name": "A falling bird moves down",
                "code": "const bird = { y: 100, dy: 200 };\napplyGravity(bird, 0.1);\nassert(bird.y > 100, 'the bird should have fallen');"
            },
            {
                "name": "A flapping bird still rises for a moment",
                "code": "const bird = { y: 100, dy: -300 };\napplyGravity(bird, 0.1);\nassert(bird.y < 100, 'y is ' + bird.y + ' — a bird moving upwards should go UP');"
            },
            {
                "name": "It falls further every frame",
                "code": "const bird = { y: 0, dy: 0 };\nconst before = bird.y;\napplyGravity(bird, 0.1);\nconst first = bird.y - before;\nconst mid = bird.y;\napplyGravity(bird, 0.1);\nconst second = bird.y - mid;\nassert(second > first, 'each frame should be a bigger drop than the last — that is what gravity means');"
            },
            {
                "name": "It never falls faster than MAX_FALL_SPEED",
                "code": "const bird = { y: 0, dy: 0 };\nfor (let i = 0; i < 200; i++) { applyGravity(bird, 0.1); }\nassert(bird.dy <= MAX_FALL_SPEED, 'dy reached ' + bird.dy);"
            },
            {
                "name": "A longer frame falls further",
                "code": "const slow = { y: 0, dy: 0 };\nconst fast = { y: 0, dy: 0 };\napplyGravity(slow, 0.05);\napplyGravity(fast, 0.1);\nassert(fast.y > slow.y, 'the time has to be part of both sums');"
            }
        ],
        "demo": {
            "kind": "fall",
            "caption": "The bird falls faster and faster, then starts again from the top."
        },
        "warning": "Speed first, then position. Move the bird before changing dy and the fall is subtly wrong — and much harder to debug than to get right."
    },
    {
        "id": "flap",
        "fnName": "flap",
        "title": "Flap!",
        "adds": "The bird can fly.",
        "intro": "<p>The player has exactly one control in this whole game.</p><p>The important word here is <strong>set</strong>, not add. <code>dy = FLAP_SPEED</code> means every flap feels identical whether the bird was climbing or plummeting. If you added to dy instead, a bird that had been falling for a while would barely respond — and the game would feel broken without anyone being able to say why.</p>",
        "spec": {
            "input": "bird",
            "output": "nothing; it changes bird.dy",
            "algorithm": [
                "Set the bird's dy to FLAP_SPEED. One line."
            ]
        },
        "starter": "function flap(bird) {\n    // straight up, every time\n}\n",
        "answer": "function flap(bird) {\n    bird.dy = FLAP_SPEED;\n}\n",
        "hints": [
            "FLAP_SPEED is already a negative number — on a canvas, up is negative.",
            "One line, one equals sign.",
            "bird.dy = FLAP_SPEED;"
        ],
        "tests": [
            {
                "name": "A flap sends the bird upwards",
                "code": "const bird = { y: 100, dy: 0 };\nflap(bird);\nassert(bird.dy < 0, 'dy is ' + bird.dy + ' — up is NEGATIVE on a canvas');"
            },
            {
                "name": "A flap sets the speed exactly",
                "code": "const bird = { y: 100, dy: 0 };\nflap(bird);\nassert(bird.dy === FLAP_SPEED, 'dy is ' + bird.dy);"
            },
            {
                "name": "It works just as well on a plummeting bird",
                "code": "const bird = { y: 100, dy: 400 };\nflap(bird);\nassert(bird.dy === FLAP_SPEED, 'dy is ' + bird.dy + ' — did you ADD to dy instead of setting it?');"
            },
            {
                "name": "Two flaps in a row are not twice as strong",
                "code": "const bird = { y: 100, dy: 0 };\nflap(bird);\nflap(bird);\nassert(bird.dy === FLAP_SPEED, 'every flap is the same size');"
            },
            {
                "name": "It does not teleport the bird",
                "code": "const bird = { y: 100, dy: 0 };\nflap(bird);\nassert(bird.y === 100, 'a flap changes the SPEED — gravity does the moving');"
            }
        ],
        "demo": {
            "kind": "fly",
            "caption": "Press FLAP! and keep the bird in the air as long as you can."
        }
    },
    {
        "id": "pipe_rects",
        "fnName": "pipeRects",
        "title": "Build a pipe",
        "adds": "Pipes appear in the sky.",
        "intro": "<p>A pipe is stored as just two numbers: its <code>x</code>, and <code>gapY</code> — the top of the hole you fly through.</p><p>Everything else is worked out from those. The top half runs from the ceiling down to the gap. The bottom half starts where the gap ends and runs to the ground.</p>",
        "spec": {
            "input": "pipe — x and gapY",
            "output": "an object with a top rectangle and a bottom rectangle",
            "algorithm": [
                "The top piece starts at y 0 and its height is gapY.",
                "The bottom piece starts at gapY + GAP_HEIGHT.",
                "Its height reaches down to GROUND_Y.",
                "Both are PIPE_WIDTH wide and both start at the pipe's x."
            ]
        },
        "starter": "function pipeRects(pipe) {\n    return {\n        top: { x: pipe.x, y: 0, width: PIPE_WIDTH, height: 0 },\n        bottom: { x: pipe.x, y: 0, width: PIPE_WIDTH, height: 0 }\n    };\n}\n",
        "answer": "function pipeRects(pipe) {\n    return {\n        top: { x: pipe.x, y: 0, width: PIPE_WIDTH, height: pipe.gapY },\n        bottom: {\n            x: pipe.x,\n            y: pipe.gapY + GAP_HEIGHT,\n            width: PIPE_WIDTH,\n            height: GROUND_Y - (pipe.gapY + GAP_HEIGHT)\n        }\n    };\n}\n",
        "hints": [
            "The top piece's height IS gapY — it fills everything above the gap.",
            "The bottom piece begins at gapY + GAP_HEIGHT.",
            "Its height is GROUND_Y minus where it begins."
        ],
        "tests": [
            {
                "name": "The top piece starts at the ceiling",
                "code": "const r = pipeRects({ x: 100, gapY: 150 });\nassert(r.top.y === 0, 'the top piece hangs from the ceiling');"
            },
            {
                "name": "The top piece reaches the gap",
                "code": "const r = pipeRects({ x: 100, gapY: 150 });\nassert(r.top.height === 150, 'height is ' + r.top.height);"
            },
            {
                "name": "The bottom piece starts below the gap",
                "code": "const r = pipeRects({ x: 100, gapY: 150 });\nassert(r.bottom.y === 150 + GAP_HEIGHT, 'y is ' + r.bottom.y);"
            },
            {
                "name": "The bottom piece reaches the ground",
                "code": "const r = pipeRects({ x: 100, gapY: 150 });\nassert(Math.abs(r.bottom.y + r.bottom.height - GROUND_Y) < 0.001, 'it should stop exactly at the ground');"
            },
            {
                "name": "Both halves are at the pipe's x",
                "code": "const r = pipeRects({ x: 100, gapY: 150 });\nassert(r.top.x === 100 && r.bottom.x === 100);"
            },
            {
                "name": "Both halves are PIPE_WIDTH wide",
                "code": "const r = pipeRects({ x: 100, gapY: 150 });\nassert(r.top.width === PIPE_WIDTH && r.bottom.width === PIPE_WIDTH);"
            },
            {
                "name": "The gap really is GAP_HEIGHT tall",
                "code": "const r = pipeRects({ x: 100, gapY: 90 });\nassert(r.bottom.y - (r.top.y + r.top.height) === GAP_HEIGHT, 'the hole must be exactly GAP_HEIGHT — otherwise the game is unplayable');"
            }
        ],
        "demo": {
            "kind": "pipe",
            "caption": "Slide the gap up and down and watch both halves resize themselves."
        }
    },
    {
        "id": "overlaps",
        "fnName": "overlaps",
        "title": "Do two boxes touch?",
        "adds": "The game can tell when you have crashed.",
        "intro": "<p>This one function is the crash test for the whole game, and it is used in almost every game ever written.</p><p>Rather than working out when two boxes DO touch, it is far easier to list the four ways they can MISS: one is entirely left of the other, entirely right, entirely above, or entirely below. If none of those escapes is true, they must be touching.</p>",
        "spec": {
            "input": "a, b — two rectangles with x, y, width, height",
            "output": "True if they overlap",
            "algorithm": [
                "a is left of b if a.x + a.width is not past b.x.",
                "a is right of b if a.x is not before b.x + b.width.",
                "The same two tests again with y and height.",
                "They touch when none of those four is true."
            ]
        },
        "starter": "function overlaps(a, b) {\n    // they touch unless one is completely past the other\n}\n",
        "answer": "function overlaps(a, b) {\n    return a.x < b.x + b.width &&\n           a.x + a.width > b.x &&\n           a.y < b.y + b.height &&\n           a.y + a.height > b.y;\n}\n",
        "hints": [
            "Four comparisons joined with &&.",
            "a.x < b.x + b.width means 'a starts before b ends'.",
            "Do the same pair of tests for y that you did for x."
        ],
        "tests": [
            {
                "name": "Two boxes on top of each other overlap",
                "code": "assert(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }) === true);"
            },
            {
                "name": "Boxes far apart do not",
                "code": "assert(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 100, y: 100, width: 10, height: 10 }) === false);"
            },
            {
                "name": "Side by side but not touching",
                "code": "assert(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 0, width: 10, height: 10 }) === false);"
            },
            {
                "name": "One above the other does not count",
                "code": "assert(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 40, width: 10, height: 10 }) === false, 'they line up across, but not down');"
            },
            {
                "name": "Lined up across but apart down is still a miss",
                "code": "assert(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 40, width: 10, height: 10 }) === false, 'you must check BOTH directions');"
            },
            {
                "name": "Just touching edges does not count",
                "code": "assert(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }) === false, 'edge to edge is a squeak past, not a crash');"
            },
            {
                "name": "A tiny overlap does count",
                "code": "assert(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 9, y: 0, width: 10, height: 10 }) === true);"
            },
            {
                "name": "The real bird and a real pipe agree",
                "code": "const bird = { y: 10, dy: 0 };\nassert(hitsPipe(bird, { x: BIRD_X, gapY: 200 }) === true, 'the bird is high up and the pipe is tall');\nassert(hitsPipe({ y: 220, dy: 0 }, { x: BIRD_X, gapY: 200 }) === false, 'this bird is in the gap');"
            }
        ],
        "demo": {
            "kind": "overlap",
            "caption": "Move the bird and the pipe around each other and watch the answer flip."
        },
        "warning": "Both directions matter. A test that only looks at x would say a bird at the top of the sky has crashed into a pipe way below it."
    },
    {
        "id": "move_pipes",
        "fnName": "movePipes",
        "title": "Slide the pipes past",
        "adds": "The world starts moving.",
        "intro": "<p>The bird never actually goes anywhere — it only goes up and down. It is the <em>pipes</em> that move, and that is what makes it feel like flying.</p><p>This function does two jobs at once: move everything left, and throw away anything that has gone off the left-hand edge. Forget the second job and the list grows for ever until the game slows to a crawl.</p>",
        "spec": {
            "input": "pipes — the list. distance — how far to move them.",
            "output": "a NEW list, moved, without the pipes that have gone",
            "algorithm": [
                "Make an empty list for the answer.",
                "For each pipe, make a copy whose x is distance smaller. Keep gapY and passed.",
                "Only add it to the answer if its right-hand edge (x + PIPE_WIDTH) is still above 0.",
                "Return the new list."
            ]
        },
        "starter": "function movePipes(pipes, distance) {\n    // move them all left, drop the ones that have gone\n}\n",
        "answer": "function movePipes(pipes, distance) {\n    const moved = [];\n    for (let i = 0; i < pipes.length; i++) {\n        const pipe = pipes[i];\n        const shifted = { x: pipe.x - distance, gapY: pipe.gapY, passed: pipe.passed };\n        if (shifted.x + PIPE_WIDTH > 0) {\n            moved.push(shifted);\n        }\n    }\n    return moved;\n}\n",
        "hints": [
            "Moving left means SUBTRACTING from x.",
            "Copy gapY and passed too, or the pipe forgets where its hole is.",
            "A pipe is gone when x + PIPE_WIDTH is no longer above 0."
        ],
        "tests": [
            {
                "name": "Pipes move to the left",
                "code": "const moved = movePipes([{ x: 200, gapY: 100, passed: false }], 50);\nassert(moved[0].x === 150, 'x is ' + moved[0].x);"
            },
            {
                "name": "The gap goes with the pipe",
                "code": "const moved = movePipes([{ x: 200, gapY: 137, passed: false }], 50);\nassert(moved[0].gapY === 137, 'the hole has to move with the pipe');"
            },
            {
                "name": "Pipes that have scrolled away are dropped",
                "code": "const moved = movePipes([{ x: 10, gapY: 100, passed: true }], 100);\nassert(moved.length === 0, 'that pipe is off the left of the screen');"
            },
            {
                "name": "A pipe still half on screen is kept",
                "code": "const moved = movePipes([{ x: 10, gapY: 100, passed: true }], 30);\nassert(moved.length === 1, 'part of it is still visible');"
            },
            {
                "name": "Several pipes all move",
                "code": "const moved = movePipes([{ x: 100, gapY: 1, passed: false }, { x: 300, gapY: 2, passed: false }], 40);\nassert(moved.length === 2);\nassert(moved[0].x === 60 && moved[1].x === 260);"
            },
            {
                "name": "The 'passed' flag is not forgotten",
                "code": "const moved = movePipes([{ x: 200, gapY: 100, passed: true }], 10);\nassert(moved[0].passed === true, 'lose this and the pipe scores over and over');"
            },
            {
                "name": "The list you were given is left alone",
                "code": "const before = [{ x: 200, gapY: 100, passed: false }];\nmovePipes(before, 50);\nassert(before[0].x === 200, 'make copies — do not edit the list you were handed');"
            }
        ],
        "demo": {
            "kind": "scroll",
            "caption": "Pipes stream past for ever, but the list never grows past a few."
        },
        "warning": "Throw away the pipes that have scrolled off. A list that only ever grows is the classic way to make a game get slower the longer it is played."
    },
    {
        "id": "is_crashed",
        "fnName": "isCrashed",
        "title": "Have we crashed?",
        "adds": "The game can end.",
        "intro": "<p>Three ways to lose: hit the ground, hit the ceiling, or hit a pipe.</p><p>Notice that this function only <em>answers a question</em> — it does not end the game itself. Keeping the question and the consequence apart is what lets the same function be used by the game, by the demo beside you, and by the tests.</p>",
        "spec": {
            "input": "state",
            "output": "True if the bird has hit anything",
            "algorithm": [
                "The ground: the bird's y plus BIRD_SIZE has reached GROUND_Y.",
                "The ceiling: the bird's y is above 0.",
                "The pipes: hits-pipe says yes for any pipe in the list.",
                "Otherwise, False."
            ]
        },
        "starter": "function isCrashed(state) {\n    // ground, ceiling, pipes\n}\n",
        "answer": "function isCrashed(state) {\n    if (state.bird.y + BIRD_SIZE >= GROUND_Y) {\n        return true;\n    }\n    if (state.bird.y < 0) {\n        return true;\n    }\n    for (let i = 0; i < state.pipes.length; i++) {\n        if (hitsPipe(state.bird, state.pipes[i])) {\n            return true;\n        }\n    }\n    return false;\n}\n",
        "hints": [
            "The bird's y is its TOP, so the ground test needs + BIRD_SIZE.",
            "hitsPipe is already written for you — just call it in a loop.",
            "return false; at the very end, once nothing has hit."
        ],
        "tests": [
            {
                "name": "A bird in clear sky is fine",
                "code": "assert(isCrashed({ bird: { y: 200, dy: 0 }, pipes: [] }) === false);"
            },
            {
                "name": "Hitting the ground is a crash",
                "code": "assert(isCrashed({ bird: { y: GROUND_Y - BIRD_SIZE + 1, dy: 0 }, pipes: [] }) === true, 'the bird has touched the floor');"
            },
            {
                "name": "Flying off the top is a crash",
                "code": "assert(isCrashed({ bird: { y: -2, dy: 0 }, pipes: [] }) === true);"
            },
            {
                "name": "Just above the ground is not",
                "code": "assert(isCrashed({ bird: { y: GROUND_Y - BIRD_SIZE - 5, dy: 0 }, pipes: [] }) === false);"
            },
            {
                "name": "Flying into a pipe is a crash",
                "code": "assert(isCrashed({ bird: { y: 10, dy: 0 }, pipes: [{ x: BIRD_X, gapY: 200, passed: false }] }) === true);"
            },
            {
                "name": "Flying through the gap is safe",
                "code": "assert(isCrashed({ bird: { y: 220, dy: 0 }, pipes: [{ x: BIRD_X, gapY: 200, passed: false }] }) === false, 'the bird is right in the middle of the hole');"
            },
            {
                "name": "Every pipe is checked, not just the first",
                "code": "const state = { bird: { y: 10, dy: 0 }, pipes: [{ x: 250, gapY: 200, passed: false }, { x: BIRD_X, gapY: 200, passed: false }] };\nassert(isCrashed(state) === true, 'the second pipe is the one it hit');"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "robot": true
            },
            "caption": "A robot pilot flies the practice sky — it starts again whenever it crashes."
        }
    },
    {
        "id": "score_passed_pipes",
        "fnName": "scorePassedPipes",
        "title": "Count the pipes",
        "adds": "The whole game works!",
        "intro": "<p>The score goes up by one for every pipe the bird gets past. The problem is that the game asks this question sixty times a second, and the pipe stays behind the bird for a long time.</p><p>The answer is the <code>passed</code> flag: score the pipe once, then mark it, and never score it again. That little flag is the difference between a score of 1 and a score of 200.</p>",
        "spec": {
            "input": "state",
            "output": "nothing; it changes the score",
            "algorithm": [
                "Look at every pipe.",
                "Skip any that are already marked passed.",
                "A pipe is behind the bird when its x plus PIPE_WIDTH is less than BIRD_X.",
                "When it is: mark it passed and add 1 to the score."
            ]
        },
        "starter": "function scorePassedPipes(state) {\n    // one point per pipe — but only once each!\n}\n",
        "answer": "function scorePassedPipes(state) {\n    for (let i = 0; i < state.pipes.length; i++) {\n        const pipe = state.pipes[i];\n        if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {\n            pipe.passed = true;\n            state.score = state.score + 1;\n        }\n    }\n}\n",
        "hints": [
            "Two things have to be true: not already passed, AND behind the bird.",
            "Set pipe.passed = true BEFORE or after the score — but do set it.",
            "The right-hand edge of the pipe is pipe.x + PIPE_WIDTH."
        ],
        "tests": [
            {
                "name": "Getting past a pipe scores a point",
                "code": "const state = { score: 0, bird: { y: 200, dy: 0 }, pipes: [{ x: 10, gapY: 100, passed: false }] };\nscorePassedPipes(state);\nassert(state.score === 1, 'score is ' + state.score);"
            },
            {
                "name": "A pipe still ahead scores nothing",
                "code": "const state = { score: 0, bird: { y: 200, dy: 0 }, pipes: [{ x: 200, gapY: 100, passed: false }] };\nscorePassedPipes(state);\nassert(state.score === 0);"
            },
            {
                "name": "The pipe is marked as counted",
                "code": "const state = { score: 0, bird: { y: 200, dy: 0 }, pipes: [{ x: 10, gapY: 100, passed: false }] };\nscorePassedPipes(state);\nassert(state.pipes[0].passed === true);"
            },
            {
                "name": "The same pipe never scores twice",
                "code": "const state = { score: 0, bird: { y: 200, dy: 0 }, pipes: [{ x: 10, gapY: 100, passed: false }] };\nfor (let i = 0; i < 60; i++) { scorePassedPipes(state); }\nassert(state.score === 1, 'score is ' + state.score + ' — one pipe is worth ONE point, however many frames go by');"
            },
            {
                "name": "Two pipes are worth two points",
                "code": "const state = { score: 0, bird: { y: 200, dy: 0 }, pipes: [{ x: 5, gapY: 100, passed: false }, { x: 12, gapY: 100, passed: false }] };\nscorePassedPipes(state);\nassert(state.score === 2);"
            },
            {
                "name": "A pipe already marked is left alone",
                "code": "const state = { score: 7, bird: { y: 200, dy: 0 }, pipes: [{ x: 10, gapY: 100, passed: true }] };\nscorePassedPipes(state);\nassert(state.score === 7);"
            }
        ],
        "demo": {
            "kind": "game",
            "flags": {
                "robot": true
            },
            "caption": "The robot flies the real game and the score climbs — every function you wrote is running here."
        },
        "warning": "Without the `passed` flag the score jumps by sixty a second. With it, one pipe is one point."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take the controls",
        "adds": "You can play it yourself.",
        "intro": "<p>One function left, and it is the shortest in the game — because there is only one thing a player can do.</p>",
        "spec": {
            "input": "key — the name of the key that was pressed",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Space, the up arrow or W → 'flap'.",
                "P → 'pause'.",
                "R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // space, up, w, p, r\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === ' ' || k === 'spacebar' || k === 'arrowup' || k === 'w') { return 'flap'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "The space bar's key is a single space: ' '.",
            "The up arrow is called 'ArrowUp' — toLowerCase() makes it 'arrowup'.",
            "Three ifs and a return null;"
        ],
        "tests": [
            {
                "name": "Space flaps",
                "code": "assert(actionForKey(' ') === 'flap');"
            },
            {
                "name": "The up arrow flaps",
                "code": "assert(actionForKey('ArrowUp') === 'flap');"
            },
            {
                "name": "W flaps too",
                "code": "assert(actionForKey('w') === 'flap');"
            },
            {
                "name": "Capital letters work",
                "code": "assert(actionForKey('W') === 'flap');\nassert(actionForKey('R') === 'restart');"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert(actionForKey('p') === 'pause');\nassert(actionForKey('r') === 'restart');"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert(actionForKey('z') === null, 'gave ' + actionForKey('z'));\nassert(actionForKey('ArrowDown') === null, 'there is no way to make the bird dive');"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then press SPACE. How many pipes can you get through?"
        }
    }
];
