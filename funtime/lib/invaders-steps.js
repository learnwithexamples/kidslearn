/* ============================================================
   invaders-steps.js - the 7 steps of "Build Space Invaders"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const INVADERS_STEPS = [
    {
        "id": "alien_rect",
        "fnName": "alienRect",
        "title": "Where is each alien?",
        "adds": "The fleet appears.",
        "intro": "<p>There are 24 aliens, but they do <strong>not</strong> each remember where they are. The whole fleet has one <code>fleetX</code> and one <code>fleetY</code>, and every alien works out its own place from its column and row.</p><p>That is the trick that made this game possible on a 1978 computer, and it is still a good idea: change one number and all 24 move together.</p>",
        "spec": {
            "input": "alien — { column, row }. state — the game.",
            "output": "a rectangle: x, y, width, height",
            "algorithm": [
                "x starts at the fleet's x, then add column × (ALIEN_WIDTH + ALIEN_GAP_X).",
                "y starts at the fleet's y, then add row × (ALIEN_HEIGHT + ALIEN_GAP_Y).",
                "Every alien is ALIEN_WIDTH by ALIEN_HEIGHT."
            ]
        },
        "starter": "function alienRect(alien, state) {\n    return {\n        x: state.fleetX,\n        y: state.fleetY,\n        width: ALIEN_WIDTH,\n        height: ALIEN_HEIGHT\n    };\n}\n",
        "answer": "function alienRect(alien, state) {\n    return {\n        x: state.fleetX + alien.column * (ALIEN_WIDTH + ALIEN_GAP_X),\n        y: state.fleetY + alien.row * (ALIEN_HEIGHT + ALIEN_GAP_Y),\n        width: ALIEN_WIDTH,\n        height: ALIEN_HEIGHT\n    };\n}\n",
        "hints": [
            "Column 0 must sit exactly at the fleet's x.",
            "A whole alien AND a gap have to be skipped for each column.",
            "x: state.fleetX + alien.column * (ALIEN_WIDTH + ALIEN_GAP_X)"
        ],
        "tests": [
            {
                "name": "The first alien sits at the fleet's own corner",
                "code": "const state = createGame();\nconst r = alienRect({ column: 0, row: 0 }, state);\nassert(r.x === state.fleetX, 'x is ' + r.x);\nassert(r.y === state.fleetY);"
            },
            {
                "name": "Every alien is the same size",
                "code": "const state = createGame();\nconst r = alienRect({ column: 3, row: 2 }, state);\nassert(r.width === ALIEN_WIDTH && r.height === ALIEN_HEIGHT);"
            },
            {
                "name": "The next column is one alien and one gap across",
                "code": "const state = createGame();\nconst gap = alienRect({ column: 1, row: 0 }, state).x - alienRect({ column: 0, row: 0 }, state).x;\nassert(gap === ALIEN_WIDTH + ALIEN_GAP_X, 'the gap between columns is ' + gap);"
            },
            {
                "name": "The next row is one alien and one gap down",
                "code": "const state = createGame();\nconst gap = alienRect({ column: 0, row: 1 }, state).y - alienRect({ column: 0, row: 0 }, state).y;\nassert(gap === ALIEN_HEIGHT + ALIEN_GAP_Y);"
            },
            {
                "name": "Moving the fleet moves every alien",
                "code": "const state = createGame();\nconst before = alienRect({ column: 4, row: 2 }, state).x;\nstate.fleetX = state.fleetX + 30;\nconst after = alienRect({ column: 4, row: 2 }, state).x;\nassert(after - before === 30, 'one number should move the whole fleet');"
            },
            {
                "name": "A whole fleet fits on the field",
                "code": "const state = createGame();\nconst last = alienRect({ column: ALIEN_COLUMNS - 1, row: 0 }, state);\nassert(last.x + last.width <= FIELD_WIDTH, 'the right-hand alien is off the field');"
            }
        ],
        "demo": {
            "kind": "fleet",
            "caption": "Move the dashed box around the fleet and read the numbers underneath."
        }
    },
    {
        "id": "fleet_speed",
        "fnName": "fleetSpeed",
        "title": "The aliens speed up",
        "adds": "The fleet gets faster as it thins out.",
        "intro": "<p>Everyone remembers this from the arcade: the fewer aliens are left, the faster they come. In 1978 that happened by accident — the computer simply had fewer aliens to draw, so it drew them more often.</p><p>It turned out to be brilliant game design, so now everybody does it on purpose.</p>",
        "spec": {
            "input": "state",
            "output": "pixels per second",
            "algorithm": [
                "Work out how many have been shot: all of them minus aliens-left.",
                "Start at 22, add 5 for every alien shot, and 12 for every wave after the first.",
                "Never go above 260."
            ]
        },
        "starter": "function fleetSpeed(state) {\n    // faster with every alien you shoot\n}\n",
        "answer": "function fleetSpeed(state) {\n    const shot = ALIEN_COLUMNS * ALIEN_ROWS - aliensLeft(state);\n    const speed = 22 + shot * 5 + (state.wave - 1) * 12;\n    return speed > 260 ? 260 : speed;\n}\n",
        "hints": [
            "aliensLeft(state) is written for you — count backwards from the full fleet.",
            "Wave 1 must add nothing, so use (state.wave - 1).",
            "Math.min(260, speed) is the short way to write the cap."
        ],
        "tests": [
            {
                "name": "A full fleet crawls",
                "code": "const state = createGame();\nassert(fleetSpeed(state) === 22, 'gave ' + fleetSpeed(state));"
            },
            {
                "name": "Shooting one speeds them up",
                "code": "const state = createGame();\nstate.aliens[0].alive = false;\nassert(fleetSpeed(state) === 27, 'gave ' + fleetSpeed(state));"
            },
            {
                "name": "The last alien is fast",
                "code": "const state = createGame();\nfor (let i = 1; i < state.aliens.length; i++) { state.aliens[i].alive = false; }\nassert(fleetSpeed(state) > 100, 'gave ' + fleetSpeed(state) + ' — the last one should be sprinting');"
            },
            {
                "name": "A later wave starts faster",
                "code": "const a = createGame();\nconst b = createGame();\nb.wave = 4;\nassert(fleetSpeed(b) > fleetSpeed(a));"
            },
            {
                "name": "It never goes above 260",
                "code": "const state = createGame();\nstate.wave = 30;\nstate.aliens.forEach(a => { a.alive = false; });\nassert(fleetSpeed(state) === 260, 'gave ' + fleetSpeed(state));"
            },
            {
                "name": "The speed only ever goes up as aliens die",
                "code": "const state = createGame();\nlet last = fleetSpeed(state);\nfor (let i = 0; i < state.aliens.length; i++) {\n    state.aliens[i].alive = false;\n    const now = fleetSpeed(state);\n    assert(now >= last, 'shooting an alien must never slow the fleet down');\n    last = now;\n}"
            }
        ],
        "demo": {
            "kind": "march",
            "caption": "Press Shoot some and watch what happens to the marching speed."
        }
    },
    {
        "id": "move_fleet",
        "fnName": "moveFleet",
        "title": "March!",
        "adds": "The fleet advances.",
        "intro": "<p>The whole fleet slides sideways together. When it touches a wall it turns round <em>and drops a row</em> — that drop is what eventually brings the aliens down onto you.</p><p>One subtlety: measure the fleet by the aliens still <strong>alive</strong>. Shoot out the left-hand column and the fleet should be able to march further left, not keep bouncing off an invisible wall.</p>",
        "spec": {
            "input": "state, seconds",
            "output": "nothing; it moves the fleet",
            "algorithm": [
                "Move fleetX by direction × fleet-speed × seconds.",
                "Ask fleet-edges where the living aliens now reach. If there are none, stop.",
                "If the right edge is past FIELD_WIDTH - 6 and we are going right: turn around and add FLEET_DROP to fleetY.",
                "If the left edge is before 6 and we are going left: turn around and drop."
            ]
        },
        "starter": "function moveFleet(state, seconds) {\n    // slide sideways; at a wall, turn round AND drop\n}\n",
        "answer": "function moveFleet(state, seconds) {\n    state.fleetX = state.fleetX + state.fleetDirection * fleetSpeed(state) * seconds;\n\n    const edges = fleetEdges(state);\n    if (edges === null) {\n        return;\n    }\n    if (edges.right > FIELD_WIDTH - 6 && state.fleetDirection === 1) {\n        state.fleetDirection = -1;\n        state.fleetY = state.fleetY + FLEET_DROP;\n    } else if (edges.left < 6 && state.fleetDirection === -1) {\n        state.fleetDirection = 1;\n        state.fleetY = state.fleetY + FLEET_DROP;\n    }\n}\n",
        "hints": [
            "fleetEdges(state) is written for you — it only measures living aliens.",
            "Check the direction as well as the edge, or the fleet will get stuck flipping at the wall.",
            "Turning round and dropping always happen together."
        ],
        "tests": [
            {
                "name": "The fleet slides sideways",
                "code": "const state = createGame();\nconst before = state.fleetX;\nmoveFleet(state, 0.5);\nassert(state.fleetX > before, 'it should have moved right');"
            },
            {
                "name": "It turns round at the right-hand wall",
                "code": "const state = createGame();\nstate.fleetX = FIELD_WIDTH - FLEET_WIDTH;\nstate.fleetDirection = 1;\nmoveFleet(state, 0.5);\nassert(state.fleetDirection === -1, 'it should be heading back');"
            },
            {
                "name": "Turning round drops it a row",
                "code": "const state = createGame();\nconst before = state.fleetY;\nstate.fleetX = FIELD_WIDTH - FLEET_WIDTH;\nstate.fleetDirection = 1;\nmoveFleet(state, 0.5);\nassert(state.fleetY === before + FLEET_DROP, 'y is ' + state.fleetY);"
            },
            {
                "name": "It turns round at the left-hand wall too",
                "code": "const state = createGame();\nstate.fleetX = 0;\nstate.fleetDirection = -1;\nmoveFleet(state, 0.5);\nassert(state.fleetDirection === 1);"
            },
            {
                "name": "It does not flip twice at the same wall",
                "code": "const state = createGame();\nstate.fleetX = FIELD_WIDTH - FLEET_WIDTH;\nstate.fleetDirection = 1;\nmoveFleet(state, 0.5);\nconst afterFirst = state.fleetY;\nmoveFleet(state, 0.01);\nassert(state.fleetY === afterFirst, 'it dropped twice at one wall — check the direction as well as the edge');"
            },
            {
                "name": "Dead columns let the fleet go further",
                "code": "const state = createGame();\nstate.aliens.forEach(a => { if (a.column >= 3) { a.alive = false; } });\nstate.fleetX = FIELD_WIDTH - FLEET_WIDTH;\nstate.fleetDirection = 1;\nmoveFleet(state, 0.1);\nassert(state.fleetDirection === 1, 'only half the fleet is left — there is plenty of room still');"
            },
            {
                "name": "A whole game of marching never leaves the field",
                "code": "const state = createGame();\nfor (let frame = 0; frame < 3000; frame++) {\n    moveFleet(state, 0.016);\n    const edges = fleetEdges(state);\n    assert(edges.left > -20 && edges.right < FIELD_WIDTH + 20, 'the fleet marched off the field at frame ' + frame);\n}"
            }
        ],
        "demo": {
            "kind": "march",
            "caption": "The fleet marches by itself. Shoot some columns out and watch it use the extra room."
        },
        "warning": "Check the DIRECTION as well as the edge. Without that the fleet flips back and forth at the wall, dropping a row every frame, and the game is over in a second."
    },
    {
        "id": "fire_bullet",
        "fnName": "fireBullet",
        "title": "Shoot back",
        "adds": "You can fight.",
        "intro": "<p>The famous rule of Space Invaders: <strong>one bullet at a time</strong>. You cannot fire again until your shot has hit something or left the screen.</p><p>That one restriction is the entire game. Take it away and you would just hold the fire button down and win. With it, every shot is a decision.</p>",
        "spec": {
            "input": "state",
            "output": "True if a shot was fired",
            "algorithm": [
                "Refuse if the game is over, paused, or a bullet is already in the air.",
                "Add a bullet just above the middle of the ship.",
                "Count the shot, and return True."
            ]
        },
        "starter": "function fireBullet(state) {\n    // only one bullet in the air at a time!\n}\n",
        "answer": "function fireBullet(state) {\n    if (state.isOver || state.isPaused || state.bullets.length > 0) {\n        return false;\n    }\n    state.bullets.push({\n        x: state.shipX + SHIP_WIDTH / 2 - BULLET_WIDTH / 2,\n        y: SHIP_Y - BULLET_HEIGHT\n    });\n    state.shots = state.shots + 1;\n    return true;\n}\n",
        "hints": [
            "state.bullets.length > 0 means a shot is already flying.",
            "The middle of the ship is shipX + SHIP_WIDTH / 2.",
            "Start the bullet just ABOVE the ship: SHIP_Y - BULLET_HEIGHT."
        ],
        "tests": [
            {
                "name": "Firing puts a bullet in the air",
                "code": "const state = createGame();\nassert(fireBullet(state) === true);\nassert(state.bullets.length === 1);"
            },
            {
                "name": "You cannot fire twice at once",
                "code": "const state = createGame();\nfireBullet(state);\nassert(fireBullet(state) === false, 'one bullet at a time is the whole game');\nassert(state.bullets.length === 1);"
            },
            {
                "name": "Once the shot has gone you may fire again",
                "code": "const state = createGame();\nfireBullet(state);\nstate.bullets = [];\nassert(fireBullet(state) === true);"
            },
            {
                "name": "The bullet starts at the middle of the ship",
                "code": "const state = createGame();\nstate.shipX = 100;\nfireBullet(state);\nconst middle = state.bullets[0].x + BULLET_WIDTH / 2;\nassert(Math.abs(middle - (100 + SHIP_WIDTH / 2)) < 0.001, 'the shot came out at ' + middle);"
            },
            {
                "name": "The bullet starts above the ship, not inside it",
                "code": "const state = createGame();\nfireBullet(state);\nassert(state.bullets[0].y + BULLET_HEIGHT <= SHIP_Y);"
            },
            {
                "name": "Shots are counted",
                "code": "const state = createGame();\nfireBullet(state);\nstate.bullets = [];\nfireBullet(state);\nassert(state.shots === 2, 'shots is ' + state.shots);"
            },
            {
                "name": "A finished game cannot fire",
                "code": "const state = createGame();\nstate.isOver = true;\nassert(fireBullet(state) === false);"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Move and fire. Notice you cannot shoot again until the last shot has gone."
        }
    },
    {
        "id": "move_bullets",
        "fnName": "moveBullets",
        "title": "Move the shots",
        "adds": "Bullets fly.",
        "intro": "<p>The same function moves your bullets <em>and</em> the aliens' bombs — the only difference is which way you tell it to go. Pass a negative distance and things fly up; pass a positive one and they fall.</p><p>One function, two jobs. That is what well-chosen inputs buy you.</p>",
        "spec": {
            "input": "bullets — the list. distance — how far to move them (negative is up).",
            "output": "a NEW list, without the shots that have left the field",
            "algorithm": [
                "Make an empty list for the answer.",
                "For each shot, make a copy whose y has moved by distance.",
                "Keep it only if it is still on the field: its bottom is below 0 and its top is above FIELD_HEIGHT.",
                "Return the new list."
            ]
        },
        "starter": "function moveBullets(bullets, distance) {\n    // move them, and forget the ones that have left\n}\n",
        "answer": "function moveBullets(bullets, distance) {\n    const moved = [];\n    for (let i = 0; i < bullets.length; i++) {\n        const bullet = { x: bullets[i].x, y: bullets[i].y + distance };\n        if (bullet.y + BULLET_HEIGHT > 0 && bullet.y < FIELD_HEIGHT) {\n            moved.push(bullet);\n        }\n    }\n    return moved;\n}\n",
        "hints": [
            "Make a copy of each bullet rather than editing the old one.",
            "A shot has gone off the top when y + BULLET_HEIGHT is no longer above 0.",
            "The same test, the other way round, catches the ones off the bottom."
        ],
        "tests": [
            {
                "name": "A negative distance sends shots up",
                "code": "const moved = moveBullets([{ x: 10, y: 200 }], -50);\nassert(moved[0].y === 150, 'y is ' + moved[0].y);"
            },
            {
                "name": "A positive distance sends them down",
                "code": "const moved = moveBullets([{ x: 10, y: 200 }], 50);\nassert(moved[0].y === 250);"
            },
            {
                "name": "Shots off the top are forgotten",
                "code": "const moved = moveBullets([{ x: 10, y: 5 }], -50);\nassert(moved.length === 0, 'that one has left the screen');"
            },
            {
                "name": "Shots off the bottom are forgotten too",
                "code": "const moved = moveBullets([{ x: 10, y: FIELD_HEIGHT - 2 }], 50);\nassert(moved.length === 0);"
            },
            {
                "name": "A shot still on screen is kept",
                "code": "const moved = moveBullets([{ x: 10, y: 200 }], -50);\nassert(moved.length === 1);"
            },
            {
                "name": "The x never changes",
                "code": "const moved = moveBullets([{ x: 137, y: 200 }], -50);\nassert(moved[0].x === 137, 'bullets go straight up and down');"
            },
            {
                "name": "Several shots all move",
                "code": "const moved = moveBullets([{ x: 1, y: 100 }, { x: 2, y: 200 }], -10);\nassert(moved.length === 2 && moved[0].y === 90 && moved[1].y === 190);"
            },
            {
                "name": "The list you were given is left alone",
                "code": "const before = [{ x: 10, y: 200 }];\nmoveBullets(before, -50);\nassert(before[0].y === 200, 'make copies — do not edit the list you were handed');"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Fire away — the shots fly up and vanish off the top."
        }
    },
    {
        "id": "hit_aliens",
        "fnName": "hitAliens",
        "title": "Shoot them down",
        "adds": "The whole game works!",
        "intro": "<p>The moment the game has been building to. Every bullet is checked against every alien; the first one it touches dies, the bullet disappears, and the score goes up.</p><p>Two details make this feel right. A bullet may only kill <em>one</em> alien — stop looking after the first. And the bullet must be removed, or it would keep flying and mow down the whole column.</p>",
        "spec": {
            "input": "state",
            "output": "how many aliens were shot this frame",
            "algorithm": [
                "Start a count at 0 and an empty list of surviving bullets.",
                "For each bullet, look through the aliens for the first LIVING one it overlaps.",
                "If it finds one: kill the alien, add score-for-row points, count the hit, and stop looking.",
                "If it hit nothing, keep the bullet.",
                "Put the surviving bullets back into the state and return the count."
            ]
        },
        "starter": "function hitAliens(state) {\n    // every bullet against every alien — one kill each\n}\n",
        "answer": "function hitAliens(state) {\n    let hits = 0;\n    const survivors = [];\n\n    for (let b = 0; b < state.bullets.length; b++) {\n        const bullet = state.bullets[b];\n        let hitSomething = false;\n\n        for (let a = 0; a < state.aliens.length; a++) {\n            const alien = state.aliens[a];\n            if (alien.alive && overlaps(bulletRect(bullet), alienRect(alien, state))) {\n                alien.alive = false;\n                state.score = state.score + scoreForRow(alien.row);\n                hits = hits + 1;\n                hitSomething = true;\n                break;\n            }\n        }\n\n        if (!hitSomething) {\n            survivors.push(bullet);\n        }\n    }\n\n    state.bullets = survivors;\n    return hits;\n}\n",
        "hints": [
            "Two loops: bullets on the outside, aliens on the inside.",
            "break; stops the inner loop as soon as one alien has been hit.",
            "Only keep a bullet if it hit nothing at all."
        ],
        "tests": [
            {
                "name": "A bullet on an alien kills it",
                "code": "const state = createGame();\nconst rect = alienRect(state.aliens[7], state);\nstate.bullets = [{ x: rect.x + 10, y: rect.y + 5 }];\nassert(hitAliens(state) === 1);\nassert(state.aliens[7].alive === false);"
            },
            {
                "name": "The bullet is used up",
                "code": "const state = createGame();\nconst rect = alienRect(state.aliens[7], state);\nstate.bullets = [{ x: rect.x + 10, y: rect.y + 5 }];\nhitAliens(state);\nassert(state.bullets.length === 0, 'the bullet has to disappear, or it will mow down the whole column');"
            },
            {
                "name": "A hit scores",
                "code": "const state = createGame();\nconst alien = state.aliens[0];\nconst rect = alienRect(alien, state);\nstate.bullets = [{ x: rect.x + 10, y: rect.y + 5 }];\nhitAliens(state);\nassert(state.score === scoreForRow(alien.row), 'score is ' + state.score);"
            },
            {
                "name": "A bullet in empty space hits nothing",
                "code": "const state = createGame();\nstate.bullets = [{ x: 10, y: 300 }];\nassert(hitAliens(state) === 0);\nassert(state.bullets.length === 1, 'that bullet is still flying');"
            },
            {
                "name": "A dead alien cannot be shot again",
                "code": "const state = createGame();\nconst rect = alienRect(state.aliens[7], state);\nstate.aliens[7].alive = false;\nstate.bullets = [{ x: rect.x + 10, y: rect.y + 5 }];\nassert(hitAliens(state) === 0);"
            },
            {
                "name": "One bullet kills one alien, not two",
                "code": "const state = createGame();\nconst rect = alienRect(state.aliens[0], state);\nstate.bullets = [{ x: rect.x + 10, y: rect.y + 5 }];\nhitAliens(state);\nassert(aliensLeft(state) === ALIEN_COLUMNS * ALIEN_ROWS - 1, 'exactly one alien should be gone');"
            },
            {
                "name": "The back row is worth more than the front",
                "code": "assert(scoreForRow(0) > scoreForRow(ALIEN_ROWS - 1));"
            }
        ],
        "demo": {
            "kind": "game",
            "flags": {
                "robot": true
            },
            "caption": "A robot gunner clears the fleet — every function you have written is running here."
        },
        "warning": "Remove the bullet when it hits. Leave it in and one shot will wipe out an entire column on its way up."
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Take command",
        "adds": "The game is yours.",
        "intro": "<p>The last function: two directions and a fire button.</p><p>The arrows are held down to steer, but firing happens once per press — the page handles that difference. All this function has to do is name the action.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Left or A → 'left'. Right or D → 'right'.",
                "Space, up or W → 'fire'.",
                "P → 'pause'. R → 'restart'.",
                "Anything else → null / None."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // steer, fire, pause, restart\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === ' ' || k === 'spacebar' || k === 'arrowup' || k === 'w') { return 'fire'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "The space bar's key is a single space: ' '.",
            "Both space and the up arrow should fire — players expect either.",
            "Five ifs and a return null;"
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
                "name": "Space fires",
                "code": "assert(actionForKey(' ') === 'fire');"
            },
            {
                "name": "The up arrow fires too",
                "code": "assert(actionForKey('ArrowUp') === 'fire');"
            },
            {
                "name": "Capital letters work",
                "code": "assert(actionForKey('A') === 'left');\nassert(actionForKey('R') === 'restart');"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert(actionForKey('p') === 'pause');\nassert(actionForKey('r') === 'restart');"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert(actionForKey('z') === null);\nassert(actionForKey('ArrowDown') === null, 'there is nowhere to go downwards');"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then defend the Earth with the arrow keys and space."
        }
    }
];
