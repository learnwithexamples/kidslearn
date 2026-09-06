/* ============================================================
   breakout-steps.js - the 7 steps of "Build Breakout"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const BREAKOUT_STEPS = [
    {
        "id": "brick_rect",
        "fnName": "brickRect",
        "title": "Where does a brick go?",
        "adds": "The wall of bricks appears.",
        "intro": "<p>Every game so far has put things on a grid of squares. Breakout is different: the ball can be <em>anywhere</em>, so everything has to know its exact place in pixels.</p><p>Start with the bricks. Brick (0, 0) is the top-left one. Each step right adds one brick width plus one gap; each step down adds one brick height plus one gap.</p>",
        "spec": {
            "input": "column, row",
            "output": "a rectangle: x, y, width, height",
            "algorithm": [
                "x starts at BRICK_SIDE_MARGIN, then add column × (BRICK_WIDTH + BRICK_GAP).",
                "y starts at BRICK_TOP, then add row × (BRICK_HEIGHT + BRICK_GAP).",
                "width is BRICK_WIDTH and height is BRICK_HEIGHT — every brick is the same size."
            ]
        },
        "starter": "function brickRect(column, row) {\n    return {\n        x: 0,\n        y: 0,\n        width: BRICK_WIDTH,\n        height: BRICK_HEIGHT\n    };\n}\n",
        "answer": "function brickRect(column, row) {\n    return {\n        x: BRICK_SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_GAP),\n        y: BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP),\n        width: BRICK_WIDTH,\n        height: BRICK_HEIGHT\n    };\n}\n",
        "hints": [
            "Column 0 must give exactly BRICK_SIDE_MARGIN — so the margin comes first, then the columns.",
            "A whole brick AND a gap have to be skipped for each column.",
            "x: BRICK_SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_GAP)"
        ],
        "tests": [
            {
                "name": "The first brick sits in the top-left corner",
                "code": "const r = brickRect(0, 0);\nassert(r.x === BRICK_SIDE_MARGIN, 'x is ' + r.x);\nassert(r.y === BRICK_TOP, 'y is ' + r.y);"
            },
            {
                "name": "Every brick is the same size",
                "code": "const r = brickRect(4, 3);\nassert(r.width === BRICK_WIDTH && r.height === BRICK_HEIGHT);"
            },
            {
                "name": "The next column is one brick and one gap to the right",
                "code": "assert(brickRect(1, 0).x - brickRect(0, 0).x === BRICK_WIDTH + BRICK_GAP, 'the gap between columns is wrong');"
            },
            {
                "name": "The next row is one brick and one gap further down",
                "code": "assert(brickRect(0, 1).y - brickRect(0, 0).y === BRICK_HEIGHT + BRICK_GAP, 'the gap between rows is wrong');"
            },
            {
                "name": "The bricks stay in the same row as you go across",
                "code": "assert(brickRect(5, 2).y === brickRect(0, 2).y, 'a row must be level');"
            },
            {
                "name": "The last brick still fits on the field",
                "code": "const r = brickRect(BRICK_COLUMNS - 1, BRICK_ROWS - 1);\nassert(r.x + r.width <= FIELD_WIDTH, 'the right-hand brick hangs off the field');"
            }
        ],
        "demo": {
            "kind": "bricks",
            "caption": "Move the dashed box around the wall and read the numbers underneath."
        }
    },
    {
        "id": "hits_rect",
        "fnName": "hitsRect",
        "title": "Is the ball touching it?",
        "adds": "The game can tell when the ball hits something.",
        "intro": "<p>This is the most useful function in the whole game. It is used for the bricks <em>and</em> the paddle — anything shaped like a rectangle.</p><p>The trick is called <strong>closest point</strong>. Squash the middle of the ball onto the rectangle: if the ball is to the left of it, the nearest point is on the left edge; if it is inside, the nearest point is the ball itself. Then just ask whether that point is within one radius.</p>",
        "spec": {
            "input": "ball — something with x and y. rect — x, y, width, height.",
            "output": "True if they overlap",
            "algorithm": [
                "Clamp the ball's x between rect.x and rect.x + width — that is the nearest x.",
                "Do the same with y.",
                "Measure the gap from the ball to that point.",
                "They touch if the gap is no bigger than BALL_RADIUS."
            ]
        },
        "starter": "function hitsRect(ball, rect) {\n    // find the nearest point of the rectangle, then measure\n}\n",
        "answer": "function hitsRect(ball, rect) {\n    const nearestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));\n    const nearestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));\n    const gapX = ball.x - nearestX;\n    const gapY = ball.y - nearestY;\n    return gapX * gapX + gapY * gapY <= BALL_RADIUS * BALL_RADIUS;\n}\n",
        "hints": [
            "Math.max(low, Math.min(value, high)) squeezes a number between two others.",
            "The distance between two points is √(gapX² + gapY²).",
            "You can skip the square root: compare gapX*gapX + gapY*gapY with BALL_RADIUS*BALL_RADIUS."
        ],
        "tests": [
            {
                "name": "A ball in the middle of a brick is touching it",
                "code": "assert(hitsRect({ x: 50, y: 50 }, { x: 40, y: 40, width: 40, height: 20 }) === true);"
            },
            {
                "name": "A ball far away is not",
                "code": "assert(hitsRect({ x: 300, y: 300 }, { x: 40, y: 40, width: 40, height: 20 }) === false);"
            },
            {
                "name": "A ball just above the top edge is touching",
                "code": "assert(hitsRect({ x: 60, y: 36 }, { x: 40, y: 40, width: 40, height: 20 }) === true, 'it is only 4 pixels away — closer than the radius');"
            },
            {
                "name": "A ball a long way above is not",
                "code": "assert(hitsRect({ x: 60, y: 20 }, { x: 40, y: 40, width: 40, height: 20 }) === false, 'it is 20 pixels away');"
            },
            {
                "name": "It works off the left edge too",
                "code": "assert(hitsRect({ x: 36, y: 50 }, { x: 40, y: 40, width: 40, height: 20 }) === true);"
            },
            {
                "name": "The corners work as well",
                "code": "assert(hitsRect({ x: 38, y: 38 }, { x: 40, y: 40, width: 40, height: 20 }) === true, 'a diagonal corner hit');\nassert(hitsRect({ x: 34, y: 34 }, { x: 40, y: 40, width: 40, height: 20 }) === false, 'the corner is further away than it looks — measure both directions');"
            },
            {
                "name": "It works on the paddle, not just bricks",
                "code": "const state = createGame();\nstate.paddleX = 100;\nassert(hitsRect({ x: 130, y: PADDLE_Y + 4 }, paddleRect(state)) === true);"
            }
        ],
        "demo": {
            "kind": "hit",
            "caption": "Walk the ball into the brick with the arrows and watch the answer flip."
        },
        "warning": "Measure the gap in BOTH directions. Checking only x would say a ball at the top of the field is touching a brick at the bottom."
    },
    {
        "id": "bounce_off_walls",
        "fnName": "bounceOffWalls",
        "title": "Bounce off the walls",
        "adds": "The ball stays in the box.",
        "intro": "<p>A bounce is far simpler than it looks: <strong>flip the direction</strong>. Hit the left or right wall and dx becomes -dx; hit the ceiling and dy becomes -dy.</p><p>Push the ball back to the edge first. Without that it can end up slightly inside the wall, flip, and get stuck flipping for ever — a bug that looks like the ball is vibrating in the corner.</p>",
        "spec": {
            "input": "ball — x, y, dx, dy",
            "output": "nothing; it changes the ball",
            "algorithm": [
                "If x is less than BALL_RADIUS: put x back to BALL_RADIUS and flip dx.",
                "If x is more than FIELD_WIDTH - BALL_RADIUS: put it back and flip dx.",
                "If y is less than BALL_RADIUS: put it back and flip dy.",
                "Do NOTHING at the bottom — that is where a life is lost."
            ]
        },
        "starter": "function bounceOffWalls(ball) {\n    // left wall, right wall, ceiling — but not the floor\n}\n",
        "answer": "function bounceOffWalls(ball) {\n    if (ball.x < BALL_RADIUS) {\n        ball.x = BALL_RADIUS;\n        ball.dx = -ball.dx;\n    }\n    if (ball.x > FIELD_WIDTH - BALL_RADIUS) {\n        ball.x = FIELD_WIDTH - BALL_RADIUS;\n        ball.dx = -ball.dx;\n    }\n    if (ball.y < BALL_RADIUS) {\n        ball.y = BALL_RADIUS;\n        ball.dy = -ball.dy;\n    }\n}\n",
        "hints": [
            "Flipping a direction is just ball.dx = -ball.dx;",
            "Move the ball back onto the edge BEFORE you flip it.",
            "Three separate ifs — a ball in a corner can hit two walls at once."
        ],
        "tests": [
            {
                "name": "A ball in the middle is left alone",
                "code": "const ball = { x: 160, y: 200, dx: 100, dy: -100 };\nbounceOffWalls(ball);\nassert(ball.x === 160 && ball.dx === 100, 'nothing should have changed');"
            },
            {
                "name": "The left wall sends it right",
                "code": "const ball = { x: 1, y: 200, dx: -100, dy: 50 };\nbounceOffWalls(ball);\nassert(ball.dx === 100, 'dx is ' + ball.dx);\nassert(ball.x === BALL_RADIUS, 'the ball should be pushed back to the edge');"
            },
            {
                "name": "The right wall sends it left",
                "code": "const ball = { x: FIELD_WIDTH - 1, y: 200, dx: 100, dy: 50 };\nbounceOffWalls(ball);\nassert(ball.dx === -100, 'dx is ' + ball.dx);"
            },
            {
                "name": "The ceiling sends it down",
                "code": "const ball = { x: 160, y: 1, dx: 100, dy: -100 };\nbounceOffWalls(ball);\nassert(ball.dy === 100, 'dy is ' + ball.dy);\nassert(ball.y === BALL_RADIUS);"
            },
            {
                "name": "The floor is NOT a wall",
                "code": "const ball = { x: 160, y: FIELD_HEIGHT + 5, dx: 100, dy: 100 };\nbounceOffWalls(ball);\nassert(ball.dy === 100, 'the ball must be allowed to fall off the bottom');"
            },
            {
                "name": "A ball loose in the box never escapes",
                "code": "const ball = { x: 160, y: 200, dx: 411, dy: -389 };\nfor (let i = 0; i < 4000; i++) {\n    ball.x += ball.dx * 0.016;\n    ball.y += ball.dy * 0.016;\n    if (ball.y > FIELD_HEIGHT - BALL_RADIUS) { ball.y = FIELD_HEIGHT - BALL_RADIUS; ball.dy = -Math.abs(ball.dy); }\n    bounceOffWalls(ball);\n    assert(ball.x >= 0 && ball.x <= FIELD_WIDTH, 'it escaped sideways at frame ' + i);\n    assert(ball.y >= 0, 'it escaped through the ceiling at frame ' + i);\n}"
            }
        ],
        "demo": {
            "kind": "walls",
            "caption": "The ball is loose in an empty box. Speed it up and see if it can escape."
        },
        "warning": "Push the ball back onto the edge before flipping it. Otherwise it can flip again next frame while still inside the wall — and get stuck buzzing there."
    },
    {
        "id": "move_paddle",
        "fnName": "movePaddle",
        "title": "Slide the paddle",
        "adds": "You can move!",
        "intro": "<p><code>state.steering</code> is -1, 0 or 1: the keyboard sets it while a key is held down.</p><p>Distance = speed × time, as always. Then keep the paddle on the field: not past 0 on the left, and not past FIELD_WIDTH - PADDLE_WIDTH on the right (that is the x of its LEFT edge when its RIGHT edge is against the wall).</p>",
        "spec": {
            "input": "state, seconds",
            "output": "nothing; it changes state.paddleX",
            "algorithm": [
                "Work out the new x: paddleX + steering × PADDLE_SPEED × seconds.",
                "Never let it go below 0.",
                "Never let it go above FIELD_WIDTH - PADDLE_WIDTH.",
                "Save it back into state.paddleX."
            ]
        },
        "starter": "function movePaddle(state, seconds) {\n    // move by steering × speed × time, then stay on the field\n}\n",
        "answer": "function movePaddle(state, seconds) {\n    let x = state.paddleX + state.steering * PADDLE_SPEED * seconds;\n    x = Math.max(0, Math.min(FIELD_WIDTH - PADDLE_WIDTH, x));\n    state.paddleX = x;\n}\n",
        "hints": [
            "Multiplying by steering handles all three cases at once: -1, 0 and 1.",
            "Math.max(0, Math.min(limit, x)) keeps x between 0 and limit.",
            "The right-hand limit is FIELD_WIDTH - PADDLE_WIDTH, not FIELD_WIDTH."
        ],
        "tests": [
            {
                "name": "Steering right moves it right",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.steering = 1;\nmovePaddle(state, 0.1);\nassert(Math.abs(state.paddleX - 134) < 0.001, 'gave ' + state.paddleX);"
            },
            {
                "name": "Steering left moves it left",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.steering = -1;\nmovePaddle(state, 0.1);\nassert(Math.abs(state.paddleX - 66) < 0.001, 'gave ' + state.paddleX);"
            },
            {
                "name": "Not steering leaves it alone",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.steering = 0;\nmovePaddle(state, 0.1);\nassert(state.paddleX === 100);"
            },
            {
                "name": "A longer frame moves it further",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.steering = 1;\nmovePaddle(state, 0.2);\nassert(Math.abs(state.paddleX - 168) < 0.001, 'the time must be part of the sum');"
            },
            {
                "name": "It cannot slide off the left",
                "code": "const state = createGame();\nstate.paddleX = 5;\nstate.steering = -1;\nmovePaddle(state, 1);\nassert(state.paddleX === 0, 'gave ' + state.paddleX);"
            },
            {
                "name": "It cannot slide off the right",
                "code": "const state = createGame();\nstate.paddleX = FIELD_WIDTH - PADDLE_WIDTH - 5;\nstate.steering = 1;\nmovePaddle(state, 1);\nassert(state.paddleX === FIELD_WIDTH - PADDLE_WIDTH, 'the WHOLE paddle has to stay on the field');"
            }
        ],
        "demo": {
            "kind": "paddle",
            "caption": "Steer the paddle and try to shove it off either side."
        }
    },
    {
        "id": "bounce_off_paddle",
        "fnName": "bounceOffPaddle",
        "title": "Bat the ball back",
        "adds": "Now it is a game and not a screensaver.",
        "intro": "<p>Bouncing off the paddle could be one line — flip dy. But then every game would be identical and the player would have nothing to do.</p><p>So the bounce depends on <em>where</em> the ball lands. Hit the middle and it goes straight up; hit near an edge and it flies off at an angle. That one idea is what turns Breakout from luck into skill.</p>",
        "spec": {
            "input": "state",
            "output": "True if the paddle hit the ball",
            "algorithm": [
                "Do nothing unless the ball is falling (dy is more than 0) AND hits-rect says it touches the paddle.",
                "Work out the offset: how far the ball is from the middle of the paddle, divided by half the paddle's width. That gives -1 at the left edge, 0 in the middle, +1 at the right.",
                "Send the ball upwards: dy becomes minus its size.",
                "Set dx to offset × 240, and put the ball on top of the paddle.",
                "Return True."
            ]
        },
        "starter": "function bounceOffPaddle(state) {\n    // only when falling and touching\n    // the angle comes from where it hit\n}\n",
        "answer": "function bounceOffPaddle(state) {\n    if (state.ball.dy <= 0 || !hitsRect(state.ball, paddleRect(state))) {\n        return false;\n    }\n    const middle = state.paddleX + PADDLE_WIDTH / 2;\n    const offset = (state.ball.x - middle) / (PADDLE_WIDTH / 2);\n    state.ball.dy = -Math.abs(state.ball.dy);\n    state.ball.dx = offset * 240;\n    state.ball.y = PADDLE_Y - BALL_RADIUS;\n    return true;\n}\n",
        "hints": [
            "Use the hitsRect you already wrote, with paddleRect(state).",
            "-Math.abs(dy) always means 'upwards', even if dy was already negative.",
            "offset = (ball.x - middle) / (PADDLE_WIDTH / 2)"
        ],
        "tests": [
            {
                "name": "A falling ball on the paddle is sent back up",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.ball = { x: 137, y: PADDLE_Y + 2, dx: 0, dy: 200 };\nassert(bounceOffPaddle(state) === true, 'the ball is right on the paddle');\nassert(state.ball.dy < 0, 'dy is ' + state.ball.dy + ' — it should be going up');"
            },
            {
                "name": "A ball already going up is left alone",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.ball = { x: 137, y: PADDLE_Y + 2, dx: 0, dy: -200 };\nassert(bounceOffPaddle(state) === false, 'it is already heading away — bouncing it again would trap it');"
            },
            {
                "name": "A ball nowhere near the paddle is left alone",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.ball = { x: 20, y: 100, dx: 0, dy: 200 };\nassert(bounceOffPaddle(state) === false);"
            },
            {
                "name": "The middle sends it straight up",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.ball = { x: 100 + PADDLE_WIDTH / 2, y: PADDLE_Y + 2, dx: 90, dy: 200 };\nbounceOffPaddle(state);\nassert(Math.abs(state.ball.dx) < 1, 'dx is ' + state.ball.dx + ' — a middle hit should go straight up');"
            },
            {
                "name": "The right-hand edge sends it right",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.ball = { x: 100 + PADDLE_WIDTH - 2, y: PADDLE_Y + 2, dx: 0, dy: 200 };\nbounceOffPaddle(state);\nassert(state.ball.dx > 100, 'dx is ' + state.ball.dx);"
            },
            {
                "name": "The left-hand edge sends it left",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.ball = { x: 102, y: PADDLE_Y + 2, dx: 0, dy: 200 };\nbounceOffPaddle(state);\nassert(state.ball.dx < -100, 'dx is ' + state.ball.dx);"
            },
            {
                "name": "The ball is lifted clear of the paddle",
                "code": "const state = createGame();\nstate.paddleX = 100;\nstate.ball = { x: 137, y: PADDLE_Y + 6, dx: 0, dy: 200 };\nbounceOffPaddle(state);\nassert(state.ball.y <= PADDLE_Y, 'leave it inside the paddle and it will bounce again next frame');"
            }
        ],
        "demo": {
            "kind": "mini",
            "flags": {
                "robot": true
            },
            "caption": "A robot hand keeps the paddle under the ball so you can watch the angles."
        },
        "warning": "Only bounce a ball that is FALLING. A ball that is already going up would be flipped again and again and stick to the paddle."
    },
    {
        "id": "break_bricks",
        "fnName": "breakBricks",
        "title": "Break the bricks",
        "adds": "The whole game works!",
        "intro": "<p>The last rule: find the brick the ball is touching, take it out of the wall, bounce, and score.</p><p>Stop after the <em>first</em> brick you find. Without that a fast ball could clear a whole row in one frame, which looks like a glitch and makes the game far too easy.</p>",
        "spec": {
            "input": "state",
            "output": "True if a brick was broken",
            "algorithm": [
                "Look at every row and column.",
                "Skip bricks that are already gone.",
                "If hits-rect says the ball touches this brick's rectangle: set it to false, flip the ball's dy, and add score-for-brick(row) points.",
                "If no bricks are left, the game is won and over.",
                "Return True straight away — one brick per frame."
            ]
        },
        "starter": "function breakBricks(state) {\n    // find the first brick the ball touches, and knock it out\n}\n",
        "answer": "function breakBricks(state) {\n    for (let row = 0; row < BRICK_ROWS; row++) {\n        for (let column = 0; column < BRICK_COLUMNS; column++) {\n            const index = brickIndex(column, row);\n            if (state.bricks[index] && hitsRect(state.ball, brickRect(column, row))) {\n                state.bricks[index] = false;\n                state.ball.dy = -state.ball.dy;\n                state.score = state.score + scoreForBrick(row);\n                if (bricksLeft(state) === 0) {\n                    state.isWon = true;\n                    state.isOver = true;\n                }\n                return true;\n            }\n        }\n    }\n    return false;\n}\n",
        "hints": [
            "Two loops: one for the rows, one for the columns inside it.",
            "brickIndex(column, row) finds the brick's place in state.bricks.",
            "return true; inside the if — that is what stops it at one brick."
        ],
        "tests": [
            {
                "name": "A ball inside a brick breaks it",
                "code": "const state = createGame();\nconst r = brickRect(2, 1);\nstate.ball = { x: r.x + r.width / 2, y: r.y + r.height / 2, dx: 0, dy: -100 };\nassert(breakBricks(state) === true);\nassert(state.bricks[brickIndex(2, 1)] === false, 'that brick should be gone');"
            },
            {
                "name": "The ball bounces back",
                "code": "const state = createGame();\nconst r = brickRect(2, 1);\nstate.ball = { x: r.x + r.width / 2, y: r.y + r.height / 2, dx: 0, dy: -100 };\nbreakBricks(state);\nassert(state.ball.dy === 100, 'dy is ' + state.ball.dy);"
            },
            {
                "name": "Breaking a brick scores",
                "code": "const state = createGame();\nconst r = brickRect(0, 0);\nstate.ball = { x: r.x + r.width / 2, y: r.y + r.height / 2, dx: 0, dy: -100 };\nbreakBricks(state);\nassert(state.score === scoreForBrick(0), 'score is ' + state.score);"
            },
            {
                "name": "A ball in open space breaks nothing",
                "code": "const state = createGame();\nstate.ball = { x: 160, y: 300, dx: 0, dy: -100 };\nassert(breakBricks(state) === false);\nassert(bricksLeft(state) === BRICK_COLUMNS * BRICK_ROWS);"
            },
            {
                "name": "Only ONE brick goes per frame",
                "code": "const state = createGame();\nstate.ball = { x: 160, y: BRICK_TOP + 40, dx: 0, dy: -100 };\nbreakBricks(state);\nconst gone = BRICK_COLUMNS * BRICK_ROWS - bricksLeft(state);\nassert(gone <= 1, 'it took out ' + gone + ' bricks in one frame');"
            },
            {
                "name": "A brick already broken is not broken again",
                "code": "const state = createGame();\nconst r = brickRect(2, 1);\nstate.bricks[brickIndex(2, 1)] = false;\nstate.ball = { x: r.x + r.width / 2, y: r.y + r.height / 2, dx: 0, dy: -100 };\nassert(breakBricks(state) === false, 'there is nothing there any more');"
            },
            {
                "name": "The last brick wins the game",
                "code": "const state = createGame();\nfor (let i = 0; i < state.bricks.length; i++) { state.bricks[i] = false; }\nstate.bricks[brickIndex(2, 1)] = true;\nconst r = brickRect(2, 1);\nstate.ball = { x: r.x + r.width / 2, y: r.y + r.height / 2, dx: 0, dy: -100 };\nbreakBricks(state);\nassert(state.isWon === true, 'clearing the wall should win');\nassert(state.isOver === true);"
            }
        ],
        "demo": {
            "kind": "game",
            "flags": {
                "robot": true
            },
            "caption": "A robot player clears the wall — every function you have written is running here."
        },
        "warning": "Return as soon as you break one brick. A ball that clears a whole row in one frame is the classic Breakout bug."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take control",
        "adds": "You can play it yourself.",
        "intro": "<p>One last function to hand the keyboard over to a human.</p><p>Notice how this one does not touch the game at all: it only turns a key into a WORD. The page then decides what that word means. Keeping the two apart is why the buttons, the mouse and the keyboard can all drive the same game.</p>",
        "spec": {
            "input": "key — the name of the key that was pressed",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Left arrow or A → 'left'.",
                "Right arrow or D → 'right'.",
                "Space or P → 'pause'.",
                "R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // arrows, space, r\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === ' ' || k === 'spacebar' || k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "The arrow keys are called 'ArrowLeft' and 'ArrowRight'.",
            "toLowerCase() means R and r both work.",
            "The space bar's key is a single space: ' '."
        ],
        "tests": [
            {
                "name": "The arrows steer",
                "code": "assert(actionForKey('ArrowLeft') === 'left');\nassert(actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "A and D steer too",
                "code": "assert(actionForKey('a') === 'left');\nassert(actionForKey('d') === 'right');"
            },
            {
                "name": "Capital letters work",
                "code": "assert(actionForKey('A') === 'left', 'a kid with caps lock on still deserves to play');\nassert(actionForKey('R') === 'restart');"
            },
            {
                "name": "Space launches the ball",
                "code": "assert(actionForKey(' ') === 'pause');"
            },
            {
                "name": "R starts a new game",
                "code": "assert(actionForKey('r') === 'restart');"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert(actionForKey('z') === null, 'gave ' + actionForKey('z'));\nassert(actionForKey('Enter') === null);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then play it with the arrow keys — the game is entirely yours now."
        }
    }
];
