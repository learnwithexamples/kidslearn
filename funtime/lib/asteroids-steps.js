/* ============================================================
   asteroids-steps.js - the 5 steps of "Build Asteroids"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const ASTEROIDS_STEPS = [
    {
        "id": "point_from",
        "fnName": "pointFrom",
        "title": "Which way is forward?",
        "adds": "The ship knows where its nose is.",
        "intro": "<p>The ship points somewhere — an <strong>angle</strong> — and the game constantly needs to turn that into an actual place: where is the nose? which way does a shot fly? where does a rock drift?</p><p>That is what <code>cos</code> and <code>sin</code> are for, and you only need to learn them once. <code>cos(angle)</code> is how much of the direction is sideways, and <code>sin(angle)</code> is how much is up and down. Multiply each by the distance and add them on.</p><p>One thing to hold on to: angle 0 points <strong>right</strong>, and a quarter turn points <strong>down</strong> — because y grows downwards on a canvas.</p>",
        "spec": {
            "input": "x, y — where you start. angle — which way, in radians. distance — how far.",
            "output": "a point: { x, y }",
            "algorithm": [
                "The new x is x + cos(angle) × distance.",
                "The new y is y + sin(angle) × distance.",
                "Give both back together."
            ]
        },
        "starter": "function pointFrom(x, y, angle, distance) {\n    return { x: x, y: y };\n}\n",
        "answer": "function pointFrom(x, y, angle, distance) {\n    return {\n        x: x + Math.cos(angle) * distance,\n        y: y + Math.sin(angle) * distance\n    };\n}\n",
        "hints": [
            "Math.cos and Math.sin both want the angle in radians, which is what we have.",
            "cos goes with x, sin goes with y. Always that way round.",
            "x: x + Math.cos(angle) * distance"
        ],
        "tests": [
            {
                "name": "Angle 0 goes to the right",
                "code": "const p = pointFrom(0, 0, 0, 10);\nassert(Math.abs(p.x - 10) < 0.001, 'x is ' + p.x);\nassert(Math.abs(p.y) < 0.001, 'y is ' + p.y + ' — angle 0 should not move up or down at all');"
            },
            {
                "name": "A quarter turn goes DOWN",
                "code": "const p = pointFrom(0, 0, Math.PI / 2, 10);\nassert(Math.abs(p.x) < 0.001);\nassert(Math.abs(p.y - 10) < 0.001, 'y is ' + p.y + ' — on a canvas, y grows downwards');"
            },
            {
                "name": "Half a turn goes left",
                "code": "const p = pointFrom(0, 0, Math.PI, 10);\nassert(Math.abs(p.x + 10) < 0.001, 'x is ' + p.x);"
            },
            {
                "name": "Three quarters goes UP",
                "code": "const p = pointFrom(0, 0, -Math.PI / 2, 10);\nassert(Math.abs(p.y + 10) < 0.001, 'y is ' + p.y);"
            },
            {
                "name": "It starts from where you tell it",
                "code": "const p = pointFrom(100, 50, 0, 10);\nassert(Math.abs(p.x - 110) < 0.001);\nassert(Math.abs(p.y - 50) < 0.001);"
            },
            {
                "name": "Twice the distance is twice as far",
                "code": "const near = pointFrom(0, 0, 1, 10);\nconst far = pointFrom(0, 0, 1, 20);\nassert(Math.abs(far.x - near.x * 2) < 0.001);\nassert(Math.abs(far.y - near.y * 2) < 0.001);"
            },
            {
                "name": "Every angle lands the right distance away",
                "code": "for (let step = 0; step < 16; step++) {\n    const angle = step / 16 * Math.PI * 2;\n    const p = pointFrom(0, 0, angle, 25);\n    const away = Math.sqrt(p.x * p.x + p.y * p.y);\n    assert(Math.abs(away - 25) < 0.001, 'angle ' + angle.toFixed(2) + ' landed ' + away.toFixed(1) + ' away, not 25');\n}"
            },
            {
                "name": "Zero distance does not move at all",
                "code": "const p = pointFrom(30, 40, 2.1, 0);\nassert(Math.abs(p.x - 30) < 0.001 && Math.abs(p.y - 40) < 0.001);"
            }
        ],
        "demo": {
            "kind": "angles",
            "caption": "Turn the ship and watch the dashed line — that is pointFrom drawing 60 pixels ahead."
        }
    },
    {
        "id": "wrap_position",
        "fnName": "wrapPosition",
        "title": "Space has no edges",
        "adds": "Fly off one side, come back on the other.",
        "intro": "<p>There are no walls out here. Fly off the right and you appear on the left; off the top and you come back at the bottom. The field is a loop in both directions.</p><p>Use <code>while</code> rather than <code>if</code>. A rock nudged just past the edge only needs one wrap, but something that has jumped a long way in one frame might need more — and <code>while</code> handles both without you having to think about it.</p>",
        "spec": {
            "input": "thing — anything with an x and a y",
            "output": "nothing; it changes the thing",
            "algorithm": [
                "While x is below 0, add FIELD_WIDTH.",
                "While x has reached FIELD_WIDTH, take FIELD_WIDTH off.",
                "Do the same for y with FIELD_HEIGHT."
            ]
        },
        "starter": "function wrapPosition(thing) {\n    // off one edge, back on the other\n}\n",
        "answer": "function wrapPosition(thing) {\n    while (thing.x < 0) { thing.x = thing.x + FIELD_WIDTH; }\n    while (thing.x >= FIELD_WIDTH) { thing.x = thing.x - FIELD_WIDTH; }\n    while (thing.y < 0) { thing.y = thing.y + FIELD_HEIGHT; }\n    while (thing.y >= FIELD_HEIGHT) { thing.y = thing.y - FIELD_HEIGHT; }\n}\n",
        "hints": [
            "Four while loops, two for x and two for y.",
            "Going off the left means ADDING the width.",
            "Use >= for the far edge, so exactly FIELD_WIDTH wraps to 0."
        ],
        "tests": [
            {
                "name": "Something in the middle is left alone",
                "code": "const thing = { x: 100, y: 100 };\nwrapPosition(thing);\nassert(thing.x === 100 && thing.y === 100);"
            },
            {
                "name": "Off the left comes back on the right",
                "code": "const thing = { x: -5, y: 100 };\nwrapPosition(thing);\nassert(thing.x === FIELD_WIDTH - 5, 'x is ' + thing.x);"
            },
            {
                "name": "Off the right comes back on the left",
                "code": "const thing = { x: FIELD_WIDTH + 5, y: 100 };\nwrapPosition(thing);\nassert(thing.x === 5, 'x is ' + thing.x);"
            },
            {
                "name": "Off the top comes back at the bottom",
                "code": "const thing = { x: 100, y: -5 };\nwrapPosition(thing);\nassert(thing.y === FIELD_HEIGHT - 5);"
            },
            {
                "name": "Off the bottom comes back at the top",
                "code": "const thing = { x: 100, y: FIELD_HEIGHT + 5 };\nwrapPosition(thing);\nassert(thing.y === 5);"
            },
            {
                "name": "A corner wraps in both directions at once",
                "code": "const thing = { x: -5, y: -5 };\nwrapPosition(thing);\nassert(thing.x === FIELD_WIDTH - 5 && thing.y === FIELD_HEIGHT - 5);"
            },
            {
                "name": "A huge jump still lands on the field",
                "code": "const thing = { x: FIELD_WIDTH * 3 + 7, y: -FIELD_HEIGHT * 2 - 3 };\nwrapPosition(thing);\nassert(thing.x >= 0 && thing.x < FIELD_WIDTH, 'x is ' + thing.x + ' — did you use while rather than if?');\nassert(thing.y >= 0 && thing.y < FIELD_HEIGHT, 'y is ' + thing.y);"
            },
            {
                "name": "Nothing can ever escape",
                "code": "const thing = { x: 10, y: 10, dx: 411, dy: -389 };\nfor (let frame = 0; frame < 3000; frame++) {\n    thing.x = thing.x + thing.dx * 0.05;\n    thing.y = thing.y + thing.dy * 0.05;\n    wrapPosition(thing);\n    assert(thing.x >= 0 && thing.x < FIELD_WIDTH, 'it escaped sideways at frame ' + frame);\n    assert(thing.y >= 0 && thing.y < FIELD_HEIGHT, 'it escaped up or down at frame ' + frame);\n}"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Thrust a few times and fly off an edge — you come straight back on the other side."
        },
        "warning": "Use while, not if. A single if handles a small nudge but not a big jump, and the bug only shows up when something is moving fast."
    },
    {
        "id": "thrust_ship",
        "fnName": "thrustShip",
        "title": "Fire the engine",
        "adds": "The ship really flies.",
        "intro": "<p>The engine does not move the ship. It changes the ship's <strong>speed</strong> — exactly like gravity in Flappy, but pointing wherever the nose is.</p><p>And crucially, the old speed stays. Turn around and thrust and you do not stop dead: you slow down, stop, and then start going the other way. Everyone's first go at Asteroids ends in a wall because of that, and it is the whole character of the game.</p><p>Then cap the total speed, or holding the key down for ten seconds sends the ship across the screen faster than the eye can follow.</p>",
        "spec": {
            "input": "ship, seconds",
            "output": "nothing; it changes the ship's dx and dy",
            "algorithm": [
                "Add cos(angle) × THRUST × seconds to dx.",
                "Add sin(angle) × THRUST × seconds to dy.",
                "Work out the total speed with Pythagoras: √(dx² + dy²).",
                "If that is over MAX_SPEED, scale BOTH dx and dy down so the total is exactly MAX_SPEED."
            ]
        },
        "starter": "function thrustShip(ship, seconds) {\n    // push along the angle, then cap the total speed\n}\n",
        "answer": "function thrustShip(ship, seconds) {\n    ship.dx = ship.dx + Math.cos(ship.angle) * THRUST * seconds;\n    ship.dy = ship.dy + Math.sin(ship.angle) * THRUST * seconds;\n\n    const speed = Math.sqrt(ship.dx * ship.dx + ship.dy * ship.dy);\n    if (speed > MAX_SPEED) {\n        ship.dx = ship.dx / speed * MAX_SPEED;\n        ship.dy = ship.dy / speed * MAX_SPEED;\n    }\n}\n",
        "hints": [
            "ADD to dx and dy — never set them. The old speed has to survive.",
            "The total speed is √(dx² + dy²), just like the distance between two points.",
            "To cap it, divide each by the speed (making the total 1) and multiply by MAX_SPEED."
        ],
        "tests": [
            {
                "name": "Thrusting to the right speeds up sideways",
                "code": "const ship = { x: 0, y: 0, angle: 0, dx: 0, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dx > 0, 'dx is ' + ship.dx);\nassert(Math.abs(ship.dy) < 0.001, 'pointing right should not move it up or down');"
            },
            {
                "name": "Thrusting down speeds up downwards",
                "code": "const ship = { x: 0, y: 0, angle: Math.PI / 2, dx: 0, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dy > 0);"
            },
            {
                "name": "The old speed is kept",
                "code": "const ship = { x: 0, y: 0, angle: 0, dx: 50, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dx > 50, 'dx is ' + ship.dx + ' — thrusting ADDS to the speed you already had');"
            },
            {
                "name": "Thrusting backwards slows you down first",
                "code": "const ship = { x: 0, y: 0, angle: Math.PI, dx: 100, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dx < 100 && ship.dx > 0, 'dx is ' + ship.dx + ' — you should be slowing, not stopped or reversed yet');"
            },
            {
                "name": "Longer thrust means more speed",
                "code": "const quick = { x: 0, y: 0, angle: 0, dx: 0, dy: 0 };\nconst slow = { x: 0, y: 0, angle: 0, dx: 0, dy: 0 };\nthrustShip(quick, 0.2);\nthrustShip(slow, 0.1);\nassert(quick.dx > slow.dx);"
            },
            {
                "name": "The speed is capped",
                "code": "const ship = { x: 0, y: 0, angle: 0, dx: 0, dy: 0 };\nfor (let i = 0; i < 200; i++) { thrustShip(ship, 0.1); }\nconst speed = Math.sqrt(ship.dx * ship.dx + ship.dy * ship.dy);\nassert(speed <= MAX_SPEED + 0.001, 'reached ' + Math.round(speed));"
            },
            {
                "name": "Capping keeps the direction",
                "code": "const ship = { x: 0, y: 0, angle: 0.7, dx: 0, dy: 0 };\nfor (let i = 0; i < 200; i++) { thrustShip(ship, 0.1); }\nconst angle = Math.atan2(ship.dy, ship.dx);\nassert(Math.abs(angle - 0.7) < 0.01, 'the ship is capped but now flying at ' + angle.toFixed(2) + ' instead of 0.7 — scale BOTH dx and dy by the same amount');"
            },
            {
                "name": "It is capped in every direction",
                "code": "for (let step = 0; step < 8; step++) {\n    const ship = { x: 0, y: 0, angle: step / 8 * Math.PI * 2, dx: 0, dy: 0 };\n    for (let i = 0; i < 100; i++) { thrustShip(ship, 0.1); }\n    const speed = Math.sqrt(ship.dx * ship.dx + ship.dy * ship.dy);\n    assert(speed <= MAX_SPEED + 0.001);\n}"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Turn, thrust, and try to stop again. It is harder than it looks."
        },
        "warning": "Scale dx and dy by the SAME amount when you cap the speed. Cap them one at a time and the ship quietly turns as it speeds up."
    },
    {
        "id": "split_rock",
        "fnName": "splitRock",
        "title": "Break the rocks",
        "adds": "Shooting makes more rocks, not fewer.",
        "intro": "<p>Here is the idea that makes Asteroids a game rather than a shooting gallery: hitting a rock does not remove it, it <strong>divides</strong> it.</p><p>A big rock becomes two mediums, a medium becomes two smalls, and only the smallest ones actually disappear. So clearing a wave means firing at least fourteen times for four rocks — and the screen gets busier and faster before it gets emptier.</p>",
        "spec": {
            "input": "rock",
            "output": "a list of the smaller rocks it leaves behind",
            "algorithm": [
                "If the rock is already the smallest size, it leaves nothing: an empty list.",
                "Otherwise make TWO rocks, one size smaller, both in the same place.",
                "make-rock gives each its own random direction."
            ]
        },
        "starter": "function splitRock(rock) {\n    // two of the next size down — or nothing at all\n}\n",
        "answer": "function splitRock(rock) {\n    if (rock.size <= 1) {\n        return [];\n    }\n    return [\n        makeRock(rock.x, rock.y, rock.size - 1),\n        makeRock(rock.x, rock.y, rock.size - 1)\n    ];\n}\n",
        "hints": [
            "Deal with the smallest size first: return an empty list.",
            "makeRock(x, y, size) is written for you and picks a random direction.",
            "Both new rocks start where the old one was."
        ],
        "tests": [
            {
                "name": "A big rock becomes two",
                "code": "const rock = makeRock(100, 100, 3);\nassert(splitRock(rock).length === 2, 'gave ' + splitRock(rock).length);"
            },
            {
                "name": "They are one size smaller",
                "code": "const pieces = splitRock(makeRock(100, 100, 3));\nassert(pieces[0].size === 2 && pieces[1].size === 2);"
            },
            {
                "name": "A medium rock becomes two smalls",
                "code": "const pieces = splitRock(makeRock(100, 100, 2));\nassert(pieces.length === 2);\nassert(pieces[0].size === 1);"
            },
            {
                "name": "The smallest rock leaves nothing",
                "code": "assert(splitRock(makeRock(100, 100, 1)).length === 0, 'the little ones just disappear');"
            },
            {
                "name": "The pieces start where the rock was",
                "code": "const pieces = splitRock(makeRock(137, 42, 3));\nassert(pieces[0].x === 137 && pieces[0].y === 42);"
            },
            {
                "name": "The pieces drift their own ways",
                "code": "const pieces = splitRock(makeRock(100, 100, 3));\nassert(pieces[0].dx !== pieces[1].dx || pieces[0].dy !== pieces[1].dy, 'two pieces flying in exactly the same direction would look like one');"
            },
            {
                "name": "Smaller rocks move faster",
                "code": "const big = makeRock(0, 0, 3);\nconst small = makeRock(0, 0, 1);\nconst bigSpeed = Math.sqrt(big.dx * big.dx + big.dy * big.dy);\nconst smallSpeed = Math.sqrt(small.dx * small.dx + small.dy * small.dy);\nassert(smallSpeed > bigSpeed, 'the little ones are meant to be the hard ones');"
            },
            {
                "name": "Breaking one big rock all the way down takes seven shots",
                "code": "let toBreak = [makeRock(100, 100, 3)];\nlet shots = 0;\nwhile (toBreak.length > 0 && shots < 50) {\n    const rock = toBreak.pop();\n    shots = shots + 1;\n    toBreak = toBreak.concat(splitRock(rock));\n}\nassert(shots === 7, 'it took ' + shots + ' shots — one big, two medium and four small is seven');"
            }
        ],
        "demo": {
            "kind": "split",
            "caption": "Press Shoot it and watch one rock become two — then shoot those."
        }
    },
    {
        "id": "hit_rocks",
        "fnName": "hitRocks",
        "title": "Shoot them down",
        "adds": "The whole game works!",
        "intro": "<p>Every shot against every rock. The first rock a bullet touches is replaced by whatever it splits into, the bullet is used up, and the score goes up.</p><p>Note the scoring: the <em>smallest</em> rocks are worth the most. A big slow rock is 20 points; a little fast one is 100. That is the game telling you where the skill is.</p>",
        "spec": {
            "input": "state",
            "output": "how many rocks were hit this frame",
            "algorithm": [
                "Keep a list of the bullets that survive, and a count of hits.",
                "For each bullet, look for the first rock it touches — touches(bullet, rock, 1, ROCK_RADIUS[rock.size]).",
                "If it hit nothing, the bullet carries on.",
                "If it hit something: score ROCK_SCORE for that rock's size, take the rock out of the list, and add whatever it splits into.",
                "Put the surviving bullets back and return the count."
            ]
        },
        "starter": "function hitRocks(state) {\n    // every bullet against every rock — one rock each\n}\n",
        "answer": "function hitRocks(state) {\n    const survivingBullets = [];\n    let hits = 0;\n\n    for (let b = 0; b < state.bullets.length; b++) {\n        const bullet = state.bullets[b];\n        let hitIndex = -1;\n\n        for (let r = 0; r < state.rocks.length; r++) {\n            if (touches(bullet, state.rocks[r], 1, ROCK_RADIUS[state.rocks[r].size])) {\n                hitIndex = r;\n                break;\n            }\n        }\n\n        if (hitIndex === -1) {\n            survivingBullets.push(bullet);\n        } else {\n            const rock = state.rocks[hitIndex];\n            state.score = state.score + ROCK_SCORE[rock.size];\n            state.rocks.splice(hitIndex, 1);\n            state.rocks = state.rocks.concat(splitRock(rock));\n            hits = hits + 1;\n        }\n    }\n\n    state.bullets = survivingBullets;\n    return hits;\n}\n",
        "hints": [
            "Two loops: bullets on the outside, rocks on the inside.",
            "touches(a, b, radiusA, radiusB) is written for you — a bullet's radius is 1.",
            "splice(index, 1) takes one rock out of the list."
        ],
        "tests": [
            {
                "name": "A bullet on a rock breaks it",
                "code": "const state = createGame();\nstate.rocks = [makeRock(100, 100, 3)];\nstate.bullets = [{ x: 100, y: 100, dx: 0, dy: 0, life: 1 }];\nassert(hitRocks(state) === 1);"
            },
            {
                "name": "The rock is replaced by its pieces",
                "code": "const state = createGame();\nstate.rocks = [makeRock(100, 100, 3)];\nstate.bullets = [{ x: 100, y: 100, dx: 0, dy: 0, life: 1 }];\nhitRocks(state);\nassert(state.rocks.length === 2, 'there are ' + state.rocks.length + ' rocks — one big should become two medium');\nassert(state.rocks[0].size === 2);"
            },
            {
                "name": "The bullet is used up",
                "code": "const state = createGame();\nstate.rocks = [makeRock(100, 100, 3)];\nstate.bullets = [{ x: 100, y: 100, dx: 0, dy: 0, life: 1 }];\nhitRocks(state);\nassert(state.bullets.length === 0, 'the bullet must disappear, or it will shred the whole wave');"
            },
            {
                "name": "A hit scores",
                "code": "const state = createGame();\nstate.score = 0;\nstate.rocks = [makeRock(100, 100, 3)];\nstate.bullets = [{ x: 100, y: 100, dx: 0, dy: 0, life: 1 }];\nhitRocks(state);\nassert(state.score === ROCK_SCORE[3], 'score is ' + state.score);"
            },
            {
                "name": "Small rocks are worth more than big ones",
                "code": "assert(ROCK_SCORE[1] > ROCK_SCORE[3], 'the little ones are harder to hit');"
            },
            {
                "name": "Shooting the smallest rock leaves nothing behind",
                "code": "const state = createGame();\nstate.rocks = [makeRock(100, 100, 1)];\nstate.bullets = [{ x: 100, y: 100, dx: 0, dy: 0, life: 1 }];\nhitRocks(state);\nassert(state.rocks.length === 0);"
            },
            {
                "name": "A bullet in empty space hits nothing",
                "code": "const state = createGame();\nstate.rocks = [makeRock(300, 300, 3)];\nstate.bullets = [{ x: 20, y: 20, dx: 0, dy: 0, life: 1 }];\nassert(hitRocks(state) === 0);\nassert(state.bullets.length === 1, 'that bullet is still flying');"
            },
            {
                "name": "One bullet breaks one rock, not two",
                "code": "const state = createGame();\nstate.rocks = [makeRock(100, 100, 1), makeRock(102, 100, 1)];\nstate.bullets = [{ x: 101, y: 100, dx: 0, dy: 0, life: 1 }];\nhitRocks(state);\nassert(state.rocks.length === 1, 'one shot should only ever break one rock');"
            },
            {
                "name": "A whole wave can be cleared",
                "code": "const state = createGame();\nlet shots = 0;\nwhile (state.rocks.length > 0 && shots < 200) {\n    const rock = state.rocks[0];\n    state.bullets = [{ x: rock.x, y: rock.y, dx: 0, dy: 0, life: 1 }];\n    hitRocks(state);\n    shots = shots + 1;\n}\nassert(state.rocks.length === 0, 'the wave should be clearable');\nassert(state.score > 0);"
            }
        ],
        "demo": {
            "kind": "final",
            "flags": {
                "robot": true
            },
            "caption": "A robot pilot flies the finished game. Click the page to take over with the arrows and SPACE."
        },
        "warning": "Remove the bullet as soon as it hits. Leave it in and one shot will chew straight through the whole wave."
    }
];
