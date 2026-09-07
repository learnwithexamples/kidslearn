/* ============================================================
   asteroids-steps.js - the 20 steps of "Build Asteroids"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const ASTEROIDS_STEPS = [
    {
        "id": "point_from",
        "fnName": "pointFrom",
        "title": "Which way is forward?",
        "adds": "The ship knows where its nose is.",
        "intro": "<p>The ship points somewhere &mdash; an <strong>angle</strong> &mdash; and the game constantly needs to turn that into an actual place: where is the nose? which way does a shot fly? where does a rock drift?</p><p>That is what <code>cos</code> and <code>sin</code> are for, and you only need to learn them once. <code>cos(angle)</code> is how much of the direction is sideways, and <code>sin(angle)</code> is how much is up and down. Multiply each by the distance and add them on.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><path d=\"M20,152 L20,186\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><text x=\"26\" y=\"184\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">y</text><path d=\"M20,152 L52,152\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><text x=\"36\" y=\"147\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">x</text><path d=\"M55,45 L250,45\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\"/><path d=\"M250,45 L250,145\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\"/><path d=\"M55,45 L245,142\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M95,45 A40,40 0 0 1 90.6,63.2\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"100\" y=\"63\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">angle</text><text x=\"156\" y=\"30\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">cos(angle) x distance</text><text x=\"256\" y=\"96\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">sin(angle)</text><text x=\"256\" y=\"110\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">x distance</text><text x=\"108\" y=\"118\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">distance</text><circle cx=\"55\" cy=\"45\" r=\"4\" fill=\"#111\"/><text x=\"18\" y=\"36\" font-family=\"monospace\" font-size=\"13\" fill=\"#111\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">(x, y)</text><circle cx=\"250\" cy=\"145\" r=\"4\" fill=\"#111\"/><text x=\"196\" y=\"172\" font-family=\"monospace\" font-size=\"13\" fill=\"#111\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">{ x, y }</text></svg><figcaption>Angle 0 points right. A quarter turn points DOWN, because y grows downwards.</figcaption></figure><p>This one function gets used <strong>eight</strong> times before the game is finished. Get it right now and a lot of later steps become one line.</p>",
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
        "id": "distance_between",
        "fnName": "distanceBetween",
        "title": "How far apart?",
        "adds": "The game can measure a gap.",
        "intro": "<p>Every collision in this game &mdash; bullet against rock, rock against ship &mdash; comes down to one question: <em>how far apart are these two things?</em></p><p>Draw the two dots, then draw a right triangle between them. One short side is the sideways gap, the other is the up-and-down gap, and the distance is the long side. That is Pythagoras, and it is the single most useful piece of maths in games.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><path d=\"M70,155 L280,155\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\"/><path d=\"M280,155 L280,55\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\"/><path d=\"M70,155 L276,57\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M264,155 L264,141 L280,141\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><circle cx=\"70\" cy=\"155\" r=\"4.5\" fill=\"#111\"/><text x=\"46\" y=\"150\" font-family=\"monospace\" font-size=\"13\" fill=\"#111\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">a</text><circle cx=\"280\" cy=\"55\" r=\"4.5\" fill=\"#111\"/><text x=\"292\" y=\"50\" font-family=\"monospace\" font-size=\"13\" fill=\"#111\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">b</text><text x=\"175\" y=\"176\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">across = a.x - b.x</text><text x=\"290\" y=\"104\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">down =</text><text x=\"290\" y=\"118\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">a.y - b.y</text><text x=\"64\" y=\"62\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">sqrt(across x across</text><text x=\"64\" y=\"76\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">&#160;&#160;&#160;&#160; + down x down)</text></svg><figcaption>Two dots make a right triangle. The distance is the long side.</figcaption></figure><p>Notice you can subtract in either order. <code>a.x - b.x</code> and <code>b.x - a.x</code> only differ by a minus sign, and squaring throws the sign away.</p>",
        "spec": {
            "input": "a, b — two things, each with an x and a y",
            "output": "one number: how far apart they are",
            "algorithm": [
                "Work out the sideways gap: a.x − b.x.",
                "Work out the up-and-down gap: a.y − b.y.",
                "Give back the square root of (across × across + down × down)."
            ]
        },
        "starter": "function distanceBetween(a, b) {\n    return 0;\n}\n",
        "answer": "function distanceBetween(a, b) {\n    const across = a.x - b.x;\n    const down = a.y - b.y;\n    return Math.sqrt(across * across + down * down);\n}\n",
        "hints": [
            "Two subtractions, then Math.sqrt of the two squares added up.",
            "across * across is the same as squaring it. So is Math.pow(across, 2).",
            "return Math.sqrt(across * across + down * down);"
        ],
        "tests": [
            {
                "name": "A thing is no distance from itself",
                "code": "assert(distanceBetween({ x: 40, y: 90 }, { x: 40, y: 90 }) === 0);"
            },
            {
                "name": "Straight across",
                "code": "assert(distanceBetween({ x: 0, y: 0 }, { x: 7, y: 0 }) === 7);"
            },
            {
                "name": "Straight down",
                "code": "assert(distanceBetween({ x: 5, y: 2 }, { x: 5, y: 11 }) === 9);"
            },
            {
                "name": "The 3-4-5 triangle every builder knows",
                "code": "const d = distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 });\nassert(Math.abs(d - 5) < 0.001, 'got ' + d + ', expected 5');"
            },
            {
                "name": "It never comes back negative",
                "code": "const d = distanceBetween({ x: 10, y: 10 }, { x: 4, y: 2 });\nassert(d > 0, 'got ' + d);\nassert(Math.abs(d - 10) < 0.001);"
            },
            {
                "name": "Which way round you ask makes no difference",
                "code": "const a = { x: 12, y: -5 };\nconst b = { x: -3, y: 9 };\nassert(Math.abs(distanceBetween(a, b) - distanceBetween(b, a)) < 0.001);"
            },
            {
                "name": "It agrees with pointFrom",
                "code": "for (let step = 0; step < 12; step++) {\n    const angle = step / 12 * Math.PI * 2;\n    const there = pointFrom(170, 170, angle, 44);\n    const d = distanceBetween({ x: 170, y: 170 }, there);\n    assert(Math.abs(d - 44) < 0.001, 'pointFrom went 44 away but distanceBetween says ' + d.toFixed(2));\n}"
            }
        ],
        "demo": {
            "kind": "measure",
            "caption": "Drag the ship about with the buttons — the number is distanceBetween, live."
        }
    },
    {
        "id": "touches",
        "fnName": "touches",
        "title": "Are they overlapping?",
        "adds": "The game can spot a collision.",
        "intro": "<p>Now use the gap. Two round things are overlapping when they are <strong>closer than their two radii added together</strong>. Any further apart and there is still clear space between them.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><circle cx=\"132\" cy=\"96\" r=\"58\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"236\" cy=\"96\" r=\"42\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><path d=\"M132,96 L236,96\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\"/><path d=\"M132,96 L132,38\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><path d=\"M236,96 L236,54\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><circle cx=\"132\" cy=\"96\" r=\"3.5\" fill=\"#111\"/><circle cx=\"236\" cy=\"96\" r=\"3.5\" fill=\"#111\"/><text x=\"184\" y=\"88\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">distance</text><text x=\"96\" y=\"32\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">radiusA</text><text x=\"244\" y=\"50\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">radiusB</text><text x=\"180\" y=\"186\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">touching when distance &lt; radiusA + radiusB</text></svg><figcaption>Two circles overlap when the gap between their middles is smaller than their two radii added together.</figcaption></figure><p>This is why space games use circles. Testing two rectangles takes four comparisons and a headache; testing two circles takes one line &mdash; and you already wrote the hard half of it in the last step.</p><p><strong>Reuse it.</strong> Do not write Pythagoras again here. Call <code>distanceBetween</code>. Every function you have already built is a tool you are allowed to pick up.</p>",
        "spec": {
            "input": "a, b — two things with an x and a y. radiusA, radiusB — how big each one is.",
            "output": "true if they overlap, false if they do not",
            "algorithm": [
                "Ask distanceBetween how far apart a and b are.",
                "Add radiusA and radiusB together.",
                "Give back true when the distance is the smaller of the two."
            ]
        },
        "starter": "function touches(a, b, radiusA, radiusB) {\n    return false;\n}\n",
        "answer": "function touches(a, b, radiusA, radiusB) {\n    return distanceBetween(a, b) < radiusA + radiusB;\n}\n",
        "hints": [
            "You do not need an if. A comparison is already true or false.",
            "distanceBetween(a, b) is the gap. radiusA + radiusB is how close is too close.",
            "return distanceBetween(a, b) < radiusA + radiusB;"
        ],
        "tests": [
            {
                "name": "Two things in the same place definitely touch",
                "code": "assert(touches({ x: 50, y: 50 }, { x: 50, y: 50 }, 5, 5) === true);"
            },
            {
                "name": "Far apart is a miss",
                "code": "assert(touches({ x: 0, y: 0 }, { x: 300, y: 0 }, 10, 10) === false);"
            },
            {
                "name": "Just close enough",
                "code": "assert(touches({ x: 0, y: 0 }, { x: 19, y: 0 }, 10, 10) === true, '19 apart with radii of 10 and 10 is an overlap');"
            },
            {
                "name": "Just too far",
                "code": "assert(touches({ x: 0, y: 0 }, { x: 21, y: 0 }, 10, 10) === false, '21 apart with radii of 10 and 10 is clear space');"
            },
            {
                "name": "Exactly touching does not count as a hit",
                "code": "assert(touches({ x: 0, y: 0 }, { x: 20, y: 0 }, 10, 10) === false, 'use < rather than <=, so a graze is not a hit');"
            },
            {
                "name": "A bigger rock is easier to hit",
                "code": "const bullet = { x: 0, y: 0 };\nconst rock = { x: 24, y: 0 };\nassert(touches(bullet, rock, 1, ROCK_RADIUS[3]) === true, 'a big rock has radius ' + ROCK_RADIUS[3]);\nassert(touches(bullet, rock, 1, ROCK_RADIUS[1]) === false, 'a small rock has radius ' + ROCK_RADIUS[1]);"
            },
            {
                "name": "It works diagonally too, not just in a straight line",
                "code": "assert(touches({ x: 0, y: 0 }, { x: 3, y: 4 }, 3, 3) === true, '3-4-5 makes a gap of 5, and 3 + 3 is 6');\nassert(touches({ x: 0, y: 0 }, { x: 3, y: 4 }, 2, 2) === false);"
            },
            {
                "name": "Order does not matter",
                "code": "const a = { x: 10, y: 20 };\nconst b = { x: 25, y: 20 };\nassert(touches(a, b, 8, 9) === touches(b, a, 9, 8));"
            }
        ],
        "demo": {
            "kind": "measure",
            "caption": "Fly the ship at the rock. The word underneath flips the instant touches says true."
        }
    },
    {
        "id": "wrap_position",
        "fnName": "wrapPosition",
        "title": "Space has no edges",
        "adds": "Fly off one side, come back on the other.",
        "intro": "<p>There are no walls out here. Fly off the right and you appear on the left; off the top and you come back at the bottom. The field is a loop in both directions.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><rect x=\"62\" y=\"46\" width=\"238\" height=\"102\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><path d=\"M330,86 Q350,178 181,181 Q12,178 32,86\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\"/><path d=\"M210,86 L328,86\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M34,86 L120,86\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><circle cx=\"210\" cy=\"86\" r=\"4\" fill=\"#111\"/><text x=\"62\" y=\"38\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">x = 0</text><text x=\"298\" y=\"38\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"end\">x = FIELD_WIDTH</text></svg><figcaption>The field is a loop. Leave by the right edge and you are back at the left edge, at the very same height.</figcaption></figure><p>Use <code>while</code> rather than <code>if</code>. A rock nudged just past the edge only needs one wrap, but something that has jumped a long way in one frame might need several &mdash; and <code>while</code> handles both without you having to think about it.</p>",
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
            "caption": "Push the ship at a wall. It slides straight through and reappears opposite."
        }
    },
    {
        "id": "speed_of",
        "fnName": "speedOf",
        "title": "How fast, in total?",
        "adds": "The game can measure a speed.",
        "intro": "<p>The ship carries two numbers for how it is moving: <code>dx</code> is how fast it slides sideways each second, <code>dy</code> is how fast it slides up or down. Neither one on its own tells you how fast the ship is <em>really</em> going.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><path d=\"M80,150 L246,150\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#tip)\"/><path d=\"M250,150 L250,74\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#tip)\"/><path d=\"M80,150 L246,76\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M234,150 L234,136 L250,136\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><path d=\"M80,150 m-9,-9 l18,0 l0,18 l-18,0 z\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"163\" y=\"172\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">dx</text><text x=\"260\" y=\"116\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">dy</text><text x=\"120\" y=\"98\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">speed</text><text x=\"180\" y=\"34\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">sqrt(dx x dx + dy x dy)</text></svg><figcaption>The same right triangle as before — but the sides are speeds now, not gaps.</figcaption></figure><p>A ship going 100 sideways and 100 downwards is not going 100, and it is not going 200 &mdash; it is going about 141. Pythagoras again, on exactly the same triangle you drew for <code>distanceBetween</code>. The only difference is what the numbers mean.</p>",
        "spec": {
            "input": "thing — anything with a dx and a dy",
            "output": "one number: its total speed",
            "algorithm": [
                "Square dx and square dy.",
                "Add them.",
                "Give back the square root."
            ]
        },
        "starter": "function speedOf(thing) {\n    return 0;\n}\n",
        "answer": "function speedOf(thing) {\n    return Math.sqrt(thing.dx * thing.dx + thing.dy * thing.dy);\n}\n",
        "hints": [
            "It is the same sum as distanceBetween, with dx and dy instead of the two gaps.",
            "Math.sqrt(a * a + b * b)",
            "return Math.sqrt(thing.dx * thing.dx + thing.dy * thing.dy);"
        ],
        "tests": [
            {
                "name": "Standing still is a speed of zero",
                "code": "assert(speedOf({ dx: 0, dy: 0 }) === 0);"
            },
            {
                "name": "Sliding straight sideways",
                "code": "assert(speedOf({ dx: 12, dy: 0 }) === 12);"
            },
            {
                "name": "Sliding straight down",
                "code": "assert(speedOf({ dx: 0, dy: 9 }) === 9);"
            },
            {
                "name": "Going backwards is still a positive speed",
                "code": "assert(speedOf({ dx: -12, dy: 0 }) === 12, 'speed has no direction — it can never be negative');"
            },
            {
                "name": "The 3-4-5 triangle again",
                "code": "assert(Math.abs(speedOf({ dx: 3, dy: 4 }) - 5) < 0.001);"
            },
            {
                "name": "Diagonal is more than either side, less than both added up",
                "code": "const s = speedOf({ dx: 100, dy: 100 });\nassert(s > 100 && s < 200, 'got ' + s);\nassert(Math.abs(s - 141.42) < 0.01, 'got ' + s.toFixed(2) + ', expected about 141.42');"
            },
            {
                "name": "It matches pointFrom's distance, whatever the direction",
                "code": "for (let step = 0; step < 12; step++) {\n    const angle = step / 12 * Math.PI * 2;\n    const flight = pointFrom(0, 0, angle, 250);\n    const s = speedOf({ dx: flight.x, dy: flight.y });\n    assert(Math.abs(s - 250) < 0.001, 'angle ' + angle.toFixed(2) + ' gave a speed of ' + s.toFixed(2));\n}"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "The number under the field is speedOf(ship). Hold thrust and watch it climb."
        }
    },
    {
        "id": "clamp_speed",
        "fnName": "clampSpeed",
        "title": "Not TOO fast",
        "adds": "The ship has a top speed.",
        "intro": "<p>Hold the engine down long enough and the ship would eventually be crossing the whole field in a single frame &mdash; through rocks, past bullets, impossible to fly. So there is a ceiling.</p><p>The trick is slowing it down <strong>without turning it</strong>. If you simply chopped <code>dx</code> down to the limit and left <code>dy</code> alone, the ship would swing sideways every time it hit top speed. Instead, scale <em>both</em> numbers by the same fraction: <code>limit / speed</code>.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><circle cx=\"90\" cy=\"120\" r=\"76\" stroke=\"#bbb\" stroke-width=\"1\" fill=\"none\"/><path d=\"M90,120 L306,47\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#tip)\"/><path d=\"M90,120 L158,97\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><circle cx=\"90\" cy=\"120\" r=\"4\" fill=\"#111\"/><text x=\"90\" y=\"34\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">the limit</text><path d=\"M90,44 L90,120\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\" stroke-dasharray=\"3 3\"/><text x=\"252\" y=\"40\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">asked for</text><text x=\"150\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">given</text></svg><figcaption>Same direction, shorter arrow. Scaling both dx and dy by one fraction is what keeps the course.</figcaption></figure><p>It gives back <code>true</code> when it actually had to slow something down. That is useful: a function that quietly reports what it did is easier to test and easier to trust.</p>",
        "spec": {
            "input": "thing — anything with a dx and a dy. limit — the fastest it may go.",
            "output": "true if it had to be slowed down, false if it was already fine",
            "algorithm": [
                "Ask speedOf how fast it is going.",
                "If that is not over the limit, give back false and change nothing.",
                "Otherwise scale BOTH dx and dy by limit ÷ speed, and give back true."
            ]
        },
        "starter": "function clampSpeed(thing, limit) {\n    return false;\n}\n",
        "answer": "function clampSpeed(thing, limit) {\n    const speed = speedOf(thing);\n    if (speed <= limit) {\n        return false;\n    }\n    thing.dx = thing.dx / speed * limit;\n    thing.dy = thing.dy / speed * limit;\n    return true;\n}\n",
        "hints": [
            "Work the speed out ONCE and keep it in a variable — you need it twice.",
            "Leaving early when it is already slow enough saves you an else.",
            "thing.dx = thing.dx / speed * limit;  — and the same line for dy."
        ],
        "tests": [
            {
                "name": "Something slow is left completely alone",
                "code": "const thing = { dx: 3, dy: 4 };\nassert(clampSpeed(thing, 100) === false);\nassert(thing.dx === 3 && thing.dy === 4, 'it should not have been touched');"
            },
            {
                "name": "Exactly at the limit is fine",
                "code": "const thing = { dx: 5, dy: 0 };\nassert(clampSpeed(thing, 5) === false, 'use <= so sitting exactly on the limit is allowed');"
            },
            {
                "name": "Too fast gets slowed down",
                "code": "const thing = { dx: 300, dy: 0 };\nassert(clampSpeed(thing, 100) === true);\nassert(Math.abs(thing.dx - 100) < 0.001, 'dx is ' + thing.dx);"
            },
            {
                "name": "It ends up at exactly the limit",
                "code": "const thing = { dx: 300, dy: 400 };\nclampSpeed(thing, 50);\nassert(Math.abs(speedOf(thing) - 50) < 0.001, 'speed is now ' + speedOf(thing));"
            },
            {
                "name": "The direction does not change",
                "code": "const thing = { dx: 300, dy: 400 };\nclampSpeed(thing, 50);\nassert(Math.abs(thing.dx - 30) < 0.001, 'dx is ' + thing.dx + ' — 300 and 400 shrink to 30 and 40');\nassert(Math.abs(thing.dy - 40) < 0.001, 'dy is ' + thing.dy);"
            },
            {
                "name": "Negative speeds keep their sign",
                "code": "const thing = { dx: -300, dy: -400 };\nclampSpeed(thing, 50);\nassert(thing.dx < 0 && thing.dy < 0, 'it turned the ship right round!');\nassert(Math.abs(speedOf(thing) - 50) < 0.001);"
            },
            {
                "name": "Nothing ever creeps over the limit",
                "code": "const thing = { dx: 0, dy: 0 };\nfor (let frame = 0; frame < 500; frame++) {\n    thing.dx = thing.dx + 40;\n    thing.dy = thing.dy - 25;\n    clampSpeed(thing, MAX_SPEED);\n    assert(speedOf(thing) <= MAX_SPEED + 0.001, 'frame ' + frame + ' reached ' + speedOf(thing).toFixed(1));\n}"
            },
            {
                "name": "Standing perfectly still does not break it",
                "code": "const thing = { dx: 0, dy: 0 };\nassert(clampSpeed(thing, 100) === false, 'a speed of 0 is under any limit — you must not divide by it');"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Hold thrust. The speed climbs, then stops dead at MAX_SPEED — and the ship keeps its heading."
        }
    },
    {
        "id": "turn_ship",
        "fnName": "turnShip",
        "title": "Swing the nose round",
        "adds": "Left and right steer the ship.",
        "intro": "<p>Holding left or right sets <code>turning</code> to &minus;1 or 1, and this function does the actual swinging: add <code>turning × TURN_SPEED × seconds</code> to the angle.</p><p>Then comes the interesting half. Spin one way for five minutes and the angle would climb past 1000 radians. <code>cos</code> and <code>sin</code> would still work perfectly &mdash; but every number you printed while hunting a bug would be meaningless. So fold the answer back into the range &minus;&pi; to &pi;.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><path d=\"M40,116 L320,116\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><path d=\"M40,110 L40,122\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"40\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">-pi</text><path d=\"M110,111 L110,121\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><text x=\"110\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">-pi/2</text><path d=\"M180,110 L180,122\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"180\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">0</text><path d=\"M250,111 L250,121\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><text x=\"250\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">pi/2</text><path d=\"M320,110 L320,122\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"320\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">pi</text><path d=\"M265,94 L336,94\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M24,94 L86,94\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M338,88 Q336,42 180,40 Q24,42 22,88\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#tip)\"/><text x=\"180\" y=\"30\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">turning right, past pi</text><text x=\"180\" y=\"176\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">the angle always stays inside this line</text></svg><figcaption>Keep turning right and the angle folds back round to -pi, instead of climbing for ever.</figcaption></figure><p>The fold is one line: add &pi;, take the remainder when divided by a whole turn, take &pi; back off.</p><p><strong>In JavaScript:</strong> <code>%</code> keeps the sign of the left-hand number, so <code>-1 % 5</code> is <code>-1</code>, not <code>4</code>. Doing the remainder twice with a <code>+ whole</code> in between fixes it.</p>",
        "spec": {
            "input": "ship — the ship. turning — −1, 0 or 1. seconds — how long this frame lasted.",
            "output": "nothing; it changes the ship's angle",
            "algorithm": [
                "Add turning × TURN_SPEED × seconds to the ship's angle.",
                "Add π, then take the remainder when divided by a whole turn (2π).",
                "Take π back off, and store the result."
            ]
        },
        "starter": "function turnShip(ship, turning, seconds) {\n    // swing the nose\n}\n",
        "answer": "function turnShip(ship, turning, seconds) {\n    const whole = Math.PI * 2;\n    let angle = ship.angle + turning * TURN_SPEED * seconds;\n    angle = ((angle + Math.PI) % whole + whole) % whole - Math.PI;\n    ship.angle = angle;\n}\n",
        "hints": [
            "First the easy part: ship.angle + turning * TURN_SPEED * seconds.",
            "Then fold it: add Math.PI, remainder by 2π, subtract Math.PI.",
            "((angle + Math.PI) % whole + whole) % whole - Math.PI — the extra + whole is what handles JavaScript's negative remainders."
        ],
        "tests": [
            {
                "name": "Not turning leaves the angle alone",
                "code": "const ship = { angle: 1 };\nturnShip(ship, 0, 0.5);\nassert(Math.abs(ship.angle - 1) < 0.0001, 'angle is ' + ship.angle);"
            },
            {
                "name": "Turning right makes the angle bigger",
                "code": "const ship = { angle: 0 };\nturnShip(ship, 1, 0.1);\nassert(Math.abs(ship.angle - TURN_SPEED * 0.1) < 0.0001, 'angle is ' + ship.angle);"
            },
            {
                "name": "Turning left makes it smaller",
                "code": "const ship = { angle: 0 };\nturnShip(ship, -1, 0.1);\nassert(ship.angle < 0, 'angle is ' + ship.angle);"
            },
            {
                "name": "A long frame turns further than a short one",
                "code": "const slow = { angle: 0 };\nconst fast = { angle: 0 };\nturnShip(slow, 1, 0.05);\nturnShip(fast, 1, 0.10);\nassert(Math.abs(fast.angle - slow.angle * 2) < 0.0001, 'twice the time should be twice the turn');"
            },
            {
                "name": "Turning past π wraps round to the other end",
                "code": "const ship = { angle: 3.1 };\nturnShip(ship, 1, 0.2);\nassert(ship.angle < 0, 'angle is ' + ship.angle + ' — past π it should come out negative');\nassert(ship.angle >= -Math.PI, 'angle is ' + ship.angle);"
            },
            {
                "name": "Turning past −π wraps the other way",
                "code": "const ship = { angle: -3.1 };\nturnShip(ship, -1, 0.2);\nassert(ship.angle > 0, 'angle is ' + ship.angle + ' — this is where JavaScript\\'s negative % bites');"
            },
            {
                "name": "The angle never runs away, however long you spin",
                "code": "const ship = { angle: 0 };\nfor (let frame = 0; frame < 4000; frame++) {\n    turnShip(ship, 1, 0.05);\n    assert(ship.angle >= -Math.PI && ship.angle <= Math.PI, 'frame ' + frame + ': angle escaped to ' + ship.angle.toFixed(2));\n}"
            },
            {
                "name": "Wrapping does not change where the nose actually points",
                "code": "const spun = { angle: 3.1 };\nturnShip(spun, 1, 0.2);\nconst raw = 3.1 + TURN_SPEED * 0.2;\nassert(Math.abs(Math.cos(spun.angle) - Math.cos(raw)) < 0.0001, 'the fold moved the nose — it should only tidy the number');\nassert(Math.abs(Math.sin(spun.angle) - Math.sin(raw)) < 0.0001);"
            }
        ],
        "demo": {
            "kind": "angles",
            "caption": "Hold a turn button. The angle under the field spins — and never leaves -3.14 … 3.14."
        },
        "warning": "A remainder can come out NEGATIVE in JavaScript, but never in Python. That one difference is why this step's two answers do not quite match — see the note for your language."
    },
    {
        "id": "thrust_ship",
        "fnName": "thrustShip",
        "title": "Fire the engine",
        "adds": "The ship can accelerate.",
        "intro": "<p>Here is the thing that makes Asteroids feel like Asteroids: <strong>the engine does not move the ship</strong>. It changes the ship's <em>speed</em>, and the speed moves the ship next frame. Exactly the way gravity worked in Flappy Bird.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><path d=\"M60,158 L186,112\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M190,110 L246,58\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M60,158 L244,54\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#tip)\"/><circle cx=\"60\" cy=\"158\" r=\"4\" fill=\"#111\"/><text x=\"78\" y=\"178\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">speed it had</text><text x=\"214\" y=\"116\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">engine push</text><text x=\"66\" y=\"70\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">the new speed</text></svg><figcaption>The new speed is the old speed PLUS the push. The ship does not forget where it was already going.</figcaption></figure><p>Which is why turning round and thrusting does not stop you. It slows you, then eventually pushes you back the other way &mdash; and learning to fly with that is the whole game.</p><p>Finish by calling <code>clampSpeed(ship, MAX_SPEED)</code>. You wrote it two steps ago; use it.</p>",
        "spec": {
            "input": "ship — the ship. seconds — how long this frame lasted.",
            "output": "nothing; it changes the ship's dx and dy",
            "algorithm": [
                "Add cos(angle) × THRUST × seconds to dx.",
                "Add sin(angle) × THRUST × seconds to dy.",
                "Call clampSpeed to keep it under MAX_SPEED."
            ]
        },
        "starter": "function thrustShip(ship, seconds) {\n    // push the ship along its nose\n}\n",
        "answer": "function thrustShip(ship, seconds) {\n    ship.dx = ship.dx + Math.cos(ship.angle) * THRUST * seconds;\n    ship.dy = ship.dy + Math.sin(ship.angle) * THRUST * seconds;\n    clampSpeed(ship, MAX_SPEED);\n}\n",
        "hints": [
            "ADD to dx and dy. Do not replace them — that is what makes it drift.",
            "Same cos/sin pairing as pointFrom: cos with x, sin with y.",
            "Last line: clampSpeed(ship, MAX_SPEED);"
        ],
        "tests": [
            {
                "name": "A ship pointing right speeds up to the right",
                "code": "const ship = { angle: 0, dx: 0, dy: 0 };\nthrustShip(ship, 0.1);\nassert(Math.abs(ship.dx - THRUST * 0.1) < 0.001, 'dx is ' + ship.dx);\nassert(Math.abs(ship.dy) < 0.001, 'dy is ' + ship.dy);"
            },
            {
                "name": "A ship pointing up speeds up upwards",
                "code": "const ship = { angle: -Math.PI / 2, dx: 0, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dy < 0, 'dy is ' + ship.dy + ' — up the screen is negative');\nassert(Math.abs(ship.dx) < 0.001);"
            },
            {
                "name": "It ADDS to the speed the ship already had",
                "code": "const ship = { angle: 0, dx: 50, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dx > 50, 'dx is ' + ship.dx + ' — did you replace dx instead of adding to it?');"
            },
            {
                "name": "Thrusting backwards slows you down before it turns you round",
                "code": "const ship = { angle: Math.PI, dx: 100, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dx < 100 && ship.dx > 0, 'dx is ' + ship.dx + ' — one short burst should slow it, not reverse it');"
            },
            {
                "name": "A longer frame pushes harder",
                "code": "const slow = { angle: 0, dx: 0, dy: 0 };\nconst fast = { angle: 0, dx: 0, dy: 0 };\nthrustShip(slow, 0.05);\nthrustShip(fast, 0.10);\nassert(Math.abs(fast.dx - slow.dx * 2) < 0.001);"
            },
            {
                "name": "You can never break the speed limit",
                "code": "const ship = { angle: 0.7, dx: 0, dy: 0 };\nfor (let frame = 0; frame < 400; frame++) {\n    thrustShip(ship, 0.05);\n    assert(speedOf(ship) <= MAX_SPEED + 0.001, 'frame ' + frame + ' reached ' + speedOf(ship).toFixed(1) + ' — did you call clampSpeed?');\n}"
            },
            {
                "name": "Held down long enough, it does reach the limit",
                "code": "const ship = { angle: 0.7, dx: 0, dy: 0 };\nfor (let frame = 0; frame < 400; frame++) { thrustShip(ship, 0.05); }\nassert(Math.abs(speedOf(ship) - MAX_SPEED) < 0.001, 'speed settled at ' + speedOf(ship).toFixed(1));"
            },
            {
                "name": "The push always goes where the nose points",
                "code": "for (let step = 0; step < 8; step++) {\n    const angle = step / 8 * Math.PI * 2;\n    const ship = { angle: angle, dx: 0, dy: 0 };\n    thrustShip(ship, 0.1);\n    const wanted = pointFrom(0, 0, angle, THRUST * 0.1);\n    assert(Math.abs(ship.dx - wanted.x) < 0.001 && Math.abs(ship.dy - wanted.y) < 0.001, 'angle ' + angle.toFixed(2) + ' pushed the wrong way');\n}"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Thrust, then let go. The ship keeps going — that is the speed it kept."
        }
    },
    {
        "id": "drift_ship",
        "fnName": "driftShip",
        "title": "Space is not quite empty",
        "adds": "The ship slows down when you let go.",
        "intro": "<p>Real space would let the ship coast for ever. This game does not, because a ship that never slows down is exhausting to fly. So when the engine is off, the speed is multiplied by a shade less than 1 every frame.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><path d=\"M30,110 L118,110\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M30,140 L100,140\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M30,170 L86,170\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M30,80 L142,80\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M30,50 L170,50\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><text x=\"184\" y=\"55\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">frame 1</text><text x=\"184\" y=\"175\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">frame 5</text><text x=\"184\" y=\"115\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">...</text></svg><figcaption>Each frame keeps most of the speed and loses a little. It fades rather than stopping dead.</figcaption></figure><p>Notice the shape of the sum: <code>1 - DRIFT_SLOWDOWN * seconds</code>, not a flat <code>0.99</code>. Tie the slowdown to <em>time</em> and the ship drifts identically on a fast computer and a slow one. A flat number would make the game feel different on every machine.</p>",
        "spec": {
            "input": "ship — the ship. seconds — how long this frame lasted.",
            "output": "nothing; it changes the ship's dx and dy",
            "algorithm": [
                "Work out slow = 1 − DRIFT_SLOWDOWN × seconds.",
                "Multiply dx by it.",
                "Multiply dy by the same thing."
            ]
        },
        "starter": "function driftShip(ship, seconds) {\n    // let the speed fade\n}\n",
        "answer": "function driftShip(ship, seconds) {\n    const slow = 1 - DRIFT_SLOWDOWN * seconds;\n    ship.dx = ship.dx * slow;\n    ship.dy = ship.dy * slow;\n}\n",
        "hints": [
            "Work the fraction out once, then use it on both dx and dy.",
            "It must be just UNDER 1 — that is what makes it fade slowly.",
            "const slow = 1 - DRIFT_SLOWDOWN * seconds;"
        ],
        "tests": [
            {
                "name": "A ship at rest stays at rest",
                "code": "const ship = { dx: 0, dy: 0 };\ndriftShip(ship, 0.1);\nassert(ship.dx === 0 && ship.dy === 0);"
            },
            {
                "name": "A moving ship slows a little",
                "code": "const ship = { dx: 100, dy: 0 };\ndriftShip(ship, 0.1);\nassert(ship.dx < 100, 'dx is ' + ship.dx);\nassert(ship.dx > 90, 'dx is ' + ship.dx + ' — one frame should barely change it');"
            },
            {
                "name": "Both directions fade together",
                "code": "const ship = { dx: 100, dy: 200 };\ndriftShip(ship, 0.1);\nassert(Math.abs(ship.dy / ship.dx - 2) < 0.0001, 'the ship changed course — both must shrink by the same fraction');"
            },
            {
                "name": "Going backwards slows down too",
                "code": "const ship = { dx: -100, dy: 0 };\ndriftShip(ship, 0.1);\nassert(ship.dx > -100 && ship.dx < 0, 'dx is ' + ship.dx);"
            },
            {
                "name": "A longer frame fades more",
                "code": "const brief = { dx: 100, dy: 0 };\nconst longer = { dx: 100, dy: 0 };\ndriftShip(brief, 0.02);\ndriftShip(longer, 0.20);\nassert(longer.dx < brief.dx, 'a longer frame should slow the ship more');"
            },
            {
                "name": "Two short frames match one long one, near enough",
                "code": "const twice = { dx: 100, dy: 0 };\ndriftShip(twice, 0.05);\ndriftShip(twice, 0.05);\nconst once = { dx: 100, dy: 0 };\ndriftShip(once, 0.10);\nassert(Math.abs(twice.dx - once.dx) < 0.5, 'the frame rate should barely matter: ' + twice.dx.toFixed(2) + ' vs ' + once.dx.toFixed(2));"
            },
            {
                "name": "Left alone, the ship coasts almost to a stop",
                "code": "const ship = { dx: 200, dy: 150 };\nfor (let frame = 0; frame < 600; frame++) { driftShip(ship, 0.05); }\nassert(speedOf(ship) < 1, 'after 30 seconds it is still going ' + speedOf(ship).toFixed(1));"
            },
            {
                "name": "But it never turns round",
                "code": "const ship = { dx: 200, dy: -150 };\nfor (let frame = 0; frame < 600; frame++) {\n    driftShip(ship, 0.05);\n    assert(ship.dx > 0 && ship.dy < 0, 'frame ' + frame + ': the drift reversed the ship');\n}"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Give it one burst then let go. Watch the speed number fall away by itself."
        }
    },
    {
        "id": "move_thing",
        "fnName": "moveThing",
        "title": "Everything moves the same way",
        "adds": "One function carries the whole game along.",
        "intro": "<p>The ship, every rock and every bullet all move by exactly the same rule: <strong>new position = old position + speed × time</strong>, then wrap round the edges.</p><p>So write it <em>once</em>. Not one function for the ship, one for rocks and one for bullets &mdash; one function that takes anything with an <code>x</code>, a <code>y</code>, a <code>dx</code> and a <code>dy</code>. This is the habit that keeps a game small: spot the thing three parts have in common and give it a name.</p><p>Multiplying by <code>seconds</code> is what makes <code>dx</code> mean &ldquo;pixels per <em>second</em>&rdquo; rather than &ldquo;pixels per frame&rdquo;. Speeds you can read out loud, and a game that runs the same on any computer.</p>",
        "spec": {
            "input": "thing — anything with x, y, dx and dy. seconds — how long this frame lasted.",
            "output": "nothing; it moves the thing",
            "algorithm": [
                "Add dx × seconds to x.",
                "Add dy × seconds to y.",
                "Call wrapPosition so it cannot leave the field."
            ]
        },
        "starter": "function moveThing(thing, seconds) {\n    // carry it along\n}\n",
        "answer": "function moveThing(thing, seconds) {\n    thing.x = thing.x + thing.dx * seconds;\n    thing.y = thing.y + thing.dy * seconds;\n    wrapPosition(thing);\n}\n",
        "hints": [
            "Two lines of adding, then one call.",
            "Do not forget to multiply by seconds, or the speed will depend on the frame rate.",
            "wrapPosition(thing); goes last, after both moves."
        ],
        "tests": [
            {
                "name": "Something standing still does not move",
                "code": "const thing = { x: 100, y: 100, dx: 0, dy: 0 };\nmoveThing(thing, 0.1);\nassert(thing.x === 100 && thing.y === 100);"
            },
            {
                "name": "It moves by speed times time",
                "code": "const thing = { x: 100, y: 100, dx: 60, dy: 0 };\nmoveThing(thing, 0.5);\nassert(Math.abs(thing.x - 130) < 0.001, 'x is ' + thing.x + ' — 60 per second for half a second is 30');"
            },
            {
                "name": "Both directions at once",
                "code": "const thing = { x: 100, y: 100, dx: 40, dy: -20 };\nmoveThing(thing, 1);\nassert(Math.abs(thing.x - 140) < 0.001);\nassert(Math.abs(thing.y - 80) < 0.001, 'y is ' + thing.y);"
            },
            {
                "name": "Time really matters",
                "code": "const brief = { x: 0, y: 0, dx: 100, dy: 0 };\nconst longer = { x: 0, y: 0, dx: 100, dy: 0 };\nmoveThing(brief, 0.01);\nmoveThing(longer, 0.02);\nassert(Math.abs(longer.x - brief.x * 2) < 0.001, 'twice the time should be twice the distance — did you multiply by seconds?');"
            },
            {
                "name": "It wraps at the edge",
                "code": "const thing = { x: FIELD_WIDTH - 5, y: 100, dx: 100, dy: 0 };\nmoveThing(thing, 0.5);\nassert(thing.x < 100, 'x is ' + thing.x + ' — it should have come back on the left');"
            },
            {
                "name": "It works on a rock just as well as a ship",
                "code": "const rock = { x: 10, y: 10, dx: -50, dy: -50, size: 3 };\nmoveThing(rock, 1);\nassert(rock.x > 200 && rock.y > 200, 'a rock is just a thing with x, y, dx and dy');\nassert(rock.size === 3, 'it should not have disturbed anything else on the rock');"
            },
            {
                "name": "A hundred frames go exactly as far as you would expect",
                "code": "const thing = { x: 0, y: 170, dx: 50, dy: 0 };\nlet travelled = 0;\nfor (let frame = 0; frame < 100; frame++) {\n    const before = thing.x;\n    moveThing(thing, 0.02);\n    let step = thing.x - before;\n    if (step < 0) { step = step + FIELD_WIDTH; }\n    travelled = travelled + step;\n}\nassert(Math.abs(travelled - 100) < 0.01, 'it covered ' + travelled.toFixed(2) + ' pixels, expected 100');"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Everything you can see is being carried along by this one function."
        }
    },
    {
        "id": "make_bullet",
        "fnName": "makeBullet",
        "title": "One shot",
        "adds": "The ship can build a bullet.",
        "intro": "<p>A bullet is just a small object: where it is, how fast it is going, and how long it has left to live. Two details make it feel right.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><circle cx=\"110\" cy=\"108\" r=\"42\" stroke=\"#bbb\" stroke-width=\"1\" fill=\"none\" stroke-dasharray=\"4 4\"/><path d=\"M152,108 L82,84 L82,132 z\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"110\" cy=\"108\" r=\"3\" fill=\"#111\"/><circle cx=\"166\" cy=\"108\" r=\"5\" fill=\"#111\"/><path d=\"M178,108 L300,108\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M110,108 L110,66\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><text x=\"118\" y=\"62\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">SHIP_RADIUS + 3</text><text x=\"186\" y=\"98\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">BULLET_SPEED</text><text x=\"186\" y=\"132\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">+ the ship's own speed</text><text x=\"60\" y=\"176\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">the middle</text><path d=\"M96,166 L108,116\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\" marker-end=\"url(#tip)\"/></svg><figcaption>The shot leaves the NOSE. Start it in the middle and the ship shoots itself.</figcaption></figure><p>First, it starts at the <strong>nose</strong>, a little way in front of the middle &mdash; otherwise the ship would be sitting inside its own shot. Second, the bullet inherits <strong>the ship's velocity</strong>, so firing while racing forwards really does throw the shot faster. Both are one call to <code>pointFrom</code> each.</p>",
        "spec": {
            "input": "ship — the ship firing it",
            "output": "a new bullet: { x, y, dx, dy, life }",
            "algorithm": [
                "Use pointFrom from the ship, along its angle, SHIP_RADIUS + 3 away — that is the nose.",
                "Use pointFrom from 0, 0 along the same angle, BULLET_SPEED away — that is the flight.",
                "Give back an object at the nose, moving at the flight PLUS the ship's own dx and dy, with life set to BULLET_LIFE."
            ]
        },
        "starter": "function makeBullet(ship) {\n    return { x: 0, y: 0, dx: 0, dy: 0, life: 0 };\n}\n",
        "answer": "function makeBullet(ship) {\n    const nose = pointFrom(ship.x, ship.y, ship.angle, SHIP_RADIUS + 3);\n    const flight = pointFrom(0, 0, ship.angle, BULLET_SPEED);\n\n    return {\n        x: nose.x,\n        y: nose.y,\n        dx: flight.x + ship.dx,\n        dy: flight.y + ship.dy,\n        life: BULLET_LIFE\n    };\n}\n",
        "hints": [
            "Two calls to pointFrom: one for where it starts, one for how fast it flies.",
            "Starting pointFrom at 0, 0 turns an angle and a speed into a dx and a dy.",
            "dx: flight.x + ship.dx — do not forget to add the ship's own speed."
        ],
        "tests": [
            {
                "name": "It starts in front of the ship, not on it",
                "code": "const ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nconst bullet = makeBullet(ship);\nassert(bullet.x > 100, 'x is ' + bullet.x + ' — a ship pointing right should fire to its right');\nassert(Math.abs(bullet.x - (100 + SHIP_RADIUS + 3)) < 0.001, 'x is ' + bullet.x);"
            },
            {
                "name": "It flies the way the ship points",
                "code": "const ship = { x: 100, y: 100, angle: -Math.PI / 2, dx: 0, dy: 0 };\nconst bullet = makeBullet(ship);\nassert(bullet.dy < 0, 'dy is ' + bullet.dy + ' — a ship pointing up should shoot upwards');\nassert(bullet.y < 100, 'it should start above the ship too');"
            },
            {
                "name": "It flies at BULLET_SPEED when the ship is still",
                "code": "const ship = { x: 100, y: 100, angle: 1.2, dx: 0, dy: 0 };\nconst bullet = makeBullet(ship);\nassert(Math.abs(speedOf(bullet) - BULLET_SPEED) < 0.001, 'speed is ' + speedOf(bullet).toFixed(1));"
            },
            {
                "name": "Firing while racing forwards throws it faster",
                "code": "const still = makeBullet({ x: 0, y: 0, angle: 0, dx: 0, dy: 0 });\nconst racing = makeBullet({ x: 0, y: 0, angle: 0, dx: 200, dy: 0 });\nassert(racing.dx > still.dx, 'the bullet should inherit the ship\\'s speed');\nassert(Math.abs(racing.dx - (still.dx + 200)) < 0.001);"
            },
            {
                "name": "Firing while flying backwards throws it slower",
                "code": "const bullet = makeBullet({ x: 0, y: 0, angle: 0, dx: -100, dy: 0 });\nassert(Math.abs(bullet.dx - (BULLET_SPEED - 100)) < 0.001, 'dx is ' + bullet.dx);"
            },
            {
                "name": "It has a life to run down",
                "code": "const bullet = makeBullet({ x: 0, y: 0, angle: 0, dx: 0, dy: 0 });\nassert(bullet.life === BULLET_LIFE, 'life is ' + bullet.life);"
            },
            {
                "name": "It fires correctly whichever way the ship faces",
                "code": "for (let step = 0; step < 12; step++) {\n    const angle = step / 12 * Math.PI * 2;\n    const ship = { x: 170, y: 170, angle: angle, dx: 0, dy: 0 };\n    const bullet = makeBullet(ship);\n    assert(Math.abs(distanceBetween(ship, bullet) - (SHIP_RADIUS + 3)) < 0.001, 'angle ' + angle.toFixed(2) + ' started the shot in the wrong place');\n    assert(Math.abs(speedOf(bullet) - BULLET_SPEED) < 0.001);\n}"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Press Fire. Every shot leaves the nose, pointing wherever you are."
        }
    },
    {
        "id": "fire_bullet",
        "fnName": "fireBullet",
        "title": "Shoot — if you may",
        "adds": "The fire button works, within limits.",
        "intro": "<p>Making a bullet and being <em>allowed</em> to fire one are different questions, so they are different functions. This one is about the rules: there are three reasons to refuse.</p><p>The game is over. The game is paused. Or there are already <code>MAX_BULLETS</code> in the air &mdash; without that last one you could hold the fire button and sweep the field clean without ever aiming.</p><p>Three refusals, one <code>if</code>, joined with <em>or</em>. Getting the awkward cases out of the way at the top &mdash; a <strong>guard clause</strong> &mdash; leaves the real work as three plain lines with nothing indented around them.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "true if a shot was actually fired, false if it was refused",
            "algorithm": [
                "If the game is over, or paused, or there are already MAX_BULLETS flying, give back false.",
                "Otherwise add makeBullet(state.ship) to the bullet list.",
                "Count the shot, and give back true."
            ]
        },
        "starter": "function fireBullet(state) {\n    return false;\n}\n",
        "answer": "function fireBullet(state) {\n    if (state.isOver || state.isPaused || state.bullets.length >= MAX_BULLETS) {\n        return false;\n    }\n    state.bullets.push(makeBullet(state.ship));\n    state.shots = state.shots + 1;\n    return true;\n}\n",
        "hints": [
            "One if with three tests joined by || — the JavaScript word for 'or'.",
            "state.bullets.length >= MAX_BULLETS is the 'too many in the air' test.",
            "After the guard: push, count, return true."
        ],
        "tests": [
            {
                "name": "A fresh game can fire",
                "code": "const state = createGame();\nassert(fireBullet(state) === true);\nassert(state.bullets.length === 1);"
            },
            {
                "name": "The shot counter goes up",
                "code": "const state = createGame();\nfireBullet(state);\nassert(state.shots === 1, 'shots is ' + state.shots);"
            },
            {
                "name": "A finished game cannot fire",
                "code": "const state = createGame();\nstate.isOver = true;\nassert(fireBullet(state) === false);\nassert(state.bullets.length === 0, 'it fired anyway');"
            },
            {
                "name": "A paused game cannot fire",
                "code": "const state = createGame();\nstate.isPaused = true;\nassert(fireBullet(state) === false);\nassert(state.bullets.length === 0);"
            },
            {
                "name": "Only MAX_BULLETS may be in the air",
                "code": "const state = createGame();\nfor (let i = 0; i < MAX_BULLETS; i++) {\n    assert(fireBullet(state) === true, 'shot ' + (i + 1) + ' should have been allowed');\n}\nassert(fireBullet(state) === false, 'the ' + (MAX_BULLETS + 1) + 'th shot should be refused');\nassert(state.bullets.length === MAX_BULLETS, 'there are ' + state.bullets.length + ' bullets flying');"
            },
            {
                "name": "A refused shot is not counted",
                "code": "const state = createGame();\nstate.isPaused = true;\nfireBullet(state);\nassert(state.shots === 0, 'shots is ' + state.shots + ' — a refused shot is not a shot');"
            },
            {
                "name": "Once a bullet clears, you may fire again",
                "code": "const state = createGame();\nfor (let i = 0; i < MAX_BULLETS; i++) { fireBullet(state); }\nstate.bullets.pop();\nassert(fireBullet(state) === true, 'making room should let the next shot through');"
            },
            {
                "name": "Holding the button down never floods the field",
                "code": "const state = createGame();\nfor (let press = 0; press < 500; press++) {\n    fireBullet(state);\n    assert(state.bullets.length <= MAX_BULLETS, 'press ' + press + ': ' + state.bullets.length + ' bullets are flying');\n}"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Hammer the Fire button. Only four shots are ever in the air at once."
        }
    },
    {
        "id": "age_bullets",
        "fnName": "ageBullets",
        "title": "Shots run out",
        "adds": "Bullets fade instead of flying for ever.",
        "intro": "<p>Every bullet carries a <code>life</code>, counting down in seconds. Take this frame's time off each one and keep only the survivors.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><text x=\"30\" y=\"42\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">bullet 1</text><rect x=\"106\" y=\"30\" width=\"180\" height=\"15\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><rect x=\"106\" y=\"30\" width=\"150\" height=\"15\" fill=\"#111\"/><text x=\"30\" y=\"82\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">bullet 2</text><rect x=\"106\" y=\"70\" width=\"180\" height=\"15\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><rect x=\"106\" y=\"70\" width=\"86\" height=\"15\" fill=\"#111\"/><text x=\"30\" y=\"122\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">bullet 3</text><rect x=\"106\" y=\"110\" width=\"180\" height=\"15\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><rect x=\"106\" y=\"110\" width=\"22\" height=\"15\" fill=\"#111\"/><text x=\"30\" y=\"162\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">bullet 4</text><rect x=\"106\" y=\"150\" width=\"180\" height=\"15\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><path d=\"M106,150 L286,165 M106,165 L286,150\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><text x=\"296\" y=\"162\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">gone</text><text x=\"296\" y=\"42\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">kept</text></svg><figcaption>Each frame takes a slice off every bullet's life. At zero it is gone.</figcaption></figure><p>Build a <strong>new list</strong> rather than deleting from the old one. Removing items from a list while you are still walking along it is one of the classic ways to skip an item by accident &mdash; the list gets shorter under your feet. Collecting the keepers into a fresh list simply cannot go wrong.</p>",
        "spec": {
            "input": "bullets — the list of bullets. seconds — how long this frame lasted.",
            "output": "a NEW list, holding only the bullets still alive",
            "algorithm": [
                "Start an empty list.",
                "For each bullet, take seconds off its life.",
                "If it still has life left, put it in the new list.",
                "Give the new list back."
            ]
        },
        "starter": "function ageBullets(bullets, seconds) {\n    return bullets;\n}\n",
        "answer": "function ageBullets(bullets, seconds) {\n    const flying = [];\n    for (let i = 0; i < bullets.length; i++) {\n        bullets[i].life = bullets[i].life - seconds;\n        if (bullets[i].life > 0) {\n            flying.push(bullets[i]);\n        }\n    }\n    return flying;\n}\n",
        "hints": [
            "Make an empty array first, and push the survivors into it.",
            "Take the time off EVERY bullet, then decide whether to keep it.",
            "return flying; — the caller does state.bullets = ageBullets(...)."
        ],
        "tests": [
            {
                "name": "An empty list stays empty",
                "code": "assert(ageBullets([], 0.1).length === 0);"
            },
            {
                "name": "A young bullet survives",
                "code": "const flying = ageBullets([{ life: 1.0 }], 0.1);\nassert(flying.length === 1);"
            },
            {
                "name": "Its life really does go down",
                "code": "const bullets = [{ life: 1.0 }];\nconst flying = ageBullets(bullets, 0.25);\nassert(Math.abs(flying[0].life - 0.75) < 0.001, 'life is ' + flying[0].life);"
            },
            {
                "name": "A spent bullet is dropped",
                "code": "const flying = ageBullets([{ life: 0.05 }], 0.1);\nassert(flying.length === 0, 'a bullet with 0.05 left cannot survive a 0.1 second frame');"
            },
            {
                "name": "It keeps the living and drops the dead, in one pass",
                "code": "const flying = ageBullets([{ life: 0.05 }, { life: 1.0 }, { life: 0.02 }, { life: 0.5 }], 0.1);\nassert(flying.length === 2, 'kept ' + flying.length + ', expected 2');"
            },
            {
                "name": "The survivors keep their order",
                "code": "const flying = ageBullets([{ life: 1.0, tag: 'a' }, { life: 0.01, tag: 'b' }, { life: 1.0, tag: 'c' }], 0.1);\nassert(flying[0].tag === 'a' && flying[1].tag === 'c', 'got ' + flying.map(function (b) { return b.tag; }).join(','));"
            },
            {
                "name": "Nothing is ever skipped",
                "code": "const bullets = [];\nfor (let i = 0; i < 6; i++) { bullets.push({ life: 0.05, tag: i }); }\nconst flying = ageBullets(bullets, 0.1);\nassert(flying.length === 0, 'six spent bullets should all go — ' + flying.length + ' survived. Deleting from a list while looping over it skips items.');"
            },
            {
                "name": "A bullet lives for about BULLET_LIFE seconds",
                "code": "let bullets = [makeBullet({ x: 0, y: 0, angle: 0, dx: 0, dy: 0 })];\nlet frames = 0;\nfor (let i = 0; i < 1000 && bullets.length > 0; i++) {\n    bullets = ageBullets(bullets, 0.02);\n    frames = frames + 1;\n}\nconst lasted = frames * 0.02;\nassert(Math.abs(lasted - BULLET_LIFE) < 0.05, 'it lasted ' + lasted.toFixed(2) + ' seconds, expected about ' + BULLET_LIFE);"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Fire and watch. Each shot fades out after about a second — that is its life running down."
        }
    },
    {
        "id": "make_rock",
        "fnName": "makeRock",
        "title": "One rock",
        "adds": "Rocks appear, each drifting its own way.",
        "intro": "<p>A rock needs a place, a size, and a direction to drift &mdash; and the drift should be <strong>random</strong>, so no two games are the same.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><circle cx=\"180\" cy=\"100\" r=\"20\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><path d=\"M180,100 L300,100\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M180,100 L262,34\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M180,100 L180,22\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M180,100 L92,42\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M180,100 L64,116\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M180,100 L124,172\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><text x=\"180\" y=\"196\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">a random angle, but always ROCK_SPEED[size] fast</text></svg><figcaption>Same spot, same speed, a different random angle each time.</figcaption></figure><p>Pick a random angle anywhere round the circle, then hand it to <code>pointFrom</code> starting at 0, 0 with the speed for that size &mdash; the same trick that turned the ship's angle into a <code>dx</code> and <code>dy</code>. Random <em>direction</em>, fixed <em>speed</em>: that is how you keep a game unpredictable without making it unfair.</p><p>Two more numbers: <code>spin</code>, how fast it tumbles, and <code>wobble</code>, which decides the shape of its lumpy outline in the next step.</p>",
        "spec": {
            "input": "x, y — where it starts. size — 3, 2 or 1.",
            "output": "a new rock: { x, y, size, dx, dy, spin, wobble }",
            "algorithm": [
                "Pick a random angle anywhere from 0 to a whole turn.",
                "Use pointFrom from 0, 0 along that angle, ROCK_SPEED[size] away — that gives dx and dy.",
                "Give back the rock, with a random spin between −1 and 1 and a random wobble."
            ]
        },
        "starter": "function makeRock(x, y, size) {\n    return { x: x, y: y, size: size, dx: 0, dy: 0, spin: 0, wobble: 0 };\n}\n",
        "answer": "function makeRock(x, y, size) {\n    const angle = Math.random() * Math.PI * 2;\n    const drift = pointFrom(0, 0, angle, ROCK_SPEED[size]);\n\n    return {\n        x: x, y: y, size: size,\n        dx: drift.x, dy: drift.y,\n        spin: Math.random() * 2 - 1,\n        wobble: Math.floor(Math.random() * 1000)\n    };\n}\n",
        "hints": [
            "Math.random() gives a number from 0 up to 1. Times 2π covers every direction.",
            "pointFrom(0, 0, angle, ROCK_SPEED[size]) turns that into dx and dy.",
            "Math.random() * 2 - 1 gives a number between −1 and 1, for the spin."
        ],
        "tests": [
            {
                "name": "It starts where you put it",
                "code": "const rock = makeRock(50, 70, 3);\nassert(rock.x === 50 && rock.y === 70);"
            },
            {
                "name": "It remembers its size",
                "code": "assert(makeRock(0, 0, 2).size === 2);"
            },
            {
                "name": "It is always moving",
                "code": "for (let i = 0; i < 30; i++) {\n    const rock = makeRock(0, 0, 3);\n    assert(speedOf(rock) > 0, 'a rock that does not drift is no fun');\n}"
            },
            {
                "name": "It drifts at exactly the speed for its size",
                "code": "for (const size of [1, 2, 3]) {\n    for (let i = 0; i < 20; i++) {\n        const rock = makeRock(0, 0, size);\n        assert(Math.abs(speedOf(rock) - ROCK_SPEED[size]) < 0.001, 'size ' + size + ' drifted at ' + speedOf(rock).toFixed(1) + ', expected ' + ROCK_SPEED[size]);\n    }\n}"
            },
            {
                "name": "Small rocks are faster than big ones",
                "code": "assert(ROCK_SPEED[1] > ROCK_SPEED[3], 'that is what makes the last few rocks the hard part');"
            },
            {
                "name": "Two rocks made the same way still go different ways",
                "code": "let different = 0;\nconst first = makeRock(0, 0, 3);\nfor (let i = 0; i < 20; i++) {\n    const other = makeRock(0, 0, 3);\n    if (Math.abs(other.dx - first.dx) > 0.001) { different = different + 1; }\n}\nassert(different > 15, 'only ' + different + ' of 20 drifted differently — is the angle really random?');"
            },
            {
                "name": "Over many rocks, every direction turns up",
                "code": "let left = 0, right = 0, up = 0, down = 0;\nfor (let i = 0; i < 400; i++) {\n    const rock = makeRock(0, 0, 3);\n    if (rock.dx < 0) { left++; } else { right++; }\n    if (rock.dy < 0) { up++; } else { down++; }\n}\nassert(left > 100 && right > 100, 'sideways split was ' + left + '/' + right);\nassert(up > 100 && down > 100, 'up-down split was ' + up + '/' + down);"
            },
            {
                "name": "The spin stays between −1 and 1",
                "code": "for (let i = 0; i < 100; i++) {\n    const rock = makeRock(0, 0, 3);\n    assert(rock.spin >= -1 && rock.spin <= 1, 'spin is ' + rock.spin);\n}"
            }
        ],
        "demo": {
            "kind": "rock",
            "caption": "Press New Rock a few times. Same spot, same speed — a different heading every time."
        }
    },
    {
        "id": "rock_points",
        "fnName": "rockPoints",
        "title": "The shape of a rock",
        "adds": "Rocks stop being circles.",
        "intro": "<p>A rock drawn as a plain circle looks like a bubble. A rock drawn as a lumpy nine-sided shape looks like a rock. The difference is one loop.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><circle cx=\"180\" cy=\"100\" r=\"62\" stroke=\"#bbb\" stroke-width=\"1\" fill=\"none\" stroke-dasharray=\"4 4\"/><path d=\"M180,100 L228.4,100 M180,100 L224.8,137.6 M180,100 L190.7,161 M180,100 L151.9,148.7 M180,100 L131.7,117.6 M180,100 L123.7,79.5 M180,100 L149.3,46.9 M180,100 L189.3,47.3 M180,100 L221.6,65.1\" stroke=\"#bbb\" stroke-width=\"1\" fill=\"none\"/><polygon points=\"228.4,100 224.8,137.6 190.7,161 151.9,148.7 131.7,117.6 123.7,79.5 149.3,46.9 189.3,47.3 221.6,65.1\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"180\" cy=\"100\" r=\"3\" fill=\"#111\"/><text x=\"238\" y=\"92\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">corner 0</text><text x=\"96\" y=\"192\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">ROCK_CORNERS = 9</text></svg><figcaption>Walk round the circle in nine equal steps. Push each corner in or out a little, then join them up.</figcaption></figure><p>Here is the idea worth taking away: <strong>the shape is data, not a drawing</strong>. This function hands back a list of points and never touches the canvas. The drawing code becomes &ldquo;join these up&rdquo; &mdash; and a list of points is something you can test, while a picture is not.</p><p>The <code>wobble</code> number is what makes each rock its own shape. Feed the same wobble in and you get the same rock back every time, which is why a rock does not shimmer as it drifts.</p>",
        "spec": {
            "input": "rock — a rock, with an x, a y, a size and a wobble",
            "output": "a list of ROCK_CORNERS points, all the way round",
            "algorithm": [
                "Look up the radius for this rock's size.",
                "For each corner from 0 to ROCK_CORNERS: work out its angle round the circle, plus the wobble.",
                "Work out a lumpy radius: radius × (0.78 + 0.22 × |sin(i × 2.3 + wobble)|).",
                "Use pointFrom to turn that angle and radius into a point, and collect them all."
            ]
        },
        "starter": "function rockPoints(rock) {\n    return [];\n}\n",
        "answer": "function rockPoints(rock) {\n    const radius = ROCK_RADIUS[rock.size];\n    const points = [];\n\n    for (let i = 0; i < ROCK_CORNERS; i++) {\n        const angle = i / ROCK_CORNERS * Math.PI * 2 + rock.wobble;\n        const lumpy = radius * (0.78 + 0.22 * Math.abs(Math.sin(i * 2.3 + rock.wobble)));\n        points.push(pointFrom(rock.x, rock.y, angle, lumpy));\n    }\n    return points;\n}\n",
        "hints": [
            "i / ROCK_CORNERS * Math.PI * 2 spreads the corners evenly round the circle.",
            "Adding rock.wobble to the angle is what makes the rock tumble as it spins.",
            "points.push(pointFrom(rock.x, rock.y, angle, lumpy));"
        ],
        "tests": [
            {
                "name": "It gives back the right number of corners",
                "code": "const points = rockPoints({ x: 100, y: 100, size: 3, wobble: 0 });\nassert(points.length === ROCK_CORNERS, 'got ' + points.length + ', expected ' + ROCK_CORNERS);"
            },
            {
                "name": "Every corner is a proper point",
                "code": "const points = rockPoints({ x: 100, y: 100, size: 3, wobble: 0 });\nfor (const p of points) {\n    assert(typeof p.x === 'number' && typeof p.y === 'number', 'a corner came back as ' + JSON.stringify(p));\n}"
            },
            {
                "name": "The corners sit around the rock, not somewhere else",
                "code": "const rock = { x: 200, y: 150, size: 3, wobble: 0 };\nfor (const p of rockPoints(rock)) {\n    assert(distanceBetween(rock, p) <= ROCK_RADIUS[3] + 0.001, 'a corner was ' + distanceBetween(rock, p).toFixed(1) + ' from the middle, but the radius is only ' + ROCK_RADIUS[3]);\n}"
            },
            {
                "name": "It is lumpy, not a perfect circle",
                "code": "const rock = { x: 100, y: 100, size: 3, wobble: 0 };\nconst aways = rockPoints(rock).map(function (p) { return distanceBetween(rock, p); });\nconst near = Math.min.apply(null, aways);\nconst far = Math.max.apply(null, aways);\nassert(far - near > 2, 'every corner is the same distance out — that is a circle, not a rock');"
            },
            {
                "name": "But not TOO lumpy",
                "code": "const rock = { x: 100, y: 100, size: 3, wobble: 0 };\nfor (const p of rockPoints(rock)) {\n    assert(distanceBetween(rock, p) > ROCK_RADIUS[3] * 0.7, 'a corner collapsed almost into the middle');\n}"
            },
            {
                "name": "A small rock makes a small shape",
                "code": "const big = rockPoints({ x: 0, y: 0, size: 3, wobble: 4 });\nconst small = rockPoints({ x: 0, y: 0, size: 1, wobble: 4 });\nconst reach = function (points) { return Math.max.apply(null, points.map(function (p) { return Math.sqrt(p.x * p.x + p.y * p.y); })); };\nassert(reach(small) < reach(big), 'a size 1 rock should be smaller than a size 3 one');"
            },
            {
                "name": "Two rocks with different wobbles are different shapes",
                "code": "const a = rockPoints({ x: 0, y: 0, size: 3, wobble: 0 });\nconst b = rockPoints({ x: 0, y: 0, size: 3, wobble: 7 });\nlet moved = 0;\nfor (let i = 0; i < a.length; i++) {\n    if (Math.abs(a[i].x - b[i].x) > 0.5) { moved = moved + 1; }\n}\nassert(moved > 5, 'only ' + moved + ' corners differ — is the wobble really in the sum?');"
            },
            {
                "name": "The same rock always gives the same shape",
                "code": "const rock = { x: 30, y: 40, size: 2, wobble: 3.7 };\nconst first = rockPoints(rock);\nconst again = rockPoints(rock);\nfor (let i = 0; i < first.length; i++) {\n    assert(first[i].x === again[i].x && first[i].y === again[i].y, 'corner ' + i + ' moved between two calls — a rock must not shimmer');\n}"
            },
            {
                "name": "Moving the rock moves every corner with it",
                "code": "const here = rockPoints({ x: 0, y: 0, size: 3, wobble: 2 });\nconst there = rockPoints({ x: 50, y: 20, size: 3, wobble: 2 });\nfor (let i = 0; i < here.length; i++) {\n    assert(Math.abs(there[i].x - here[i].x - 50) < 0.001 && Math.abs(there[i].y - here[i].y - 20) < 0.001, 'corner ' + i + ' did not travel with the rock');\n}"
            }
        ],
        "demo": {
            "kind": "rock",
            "caption": "The corners are marked. Press Spin and watch the wobble carry them round."
        }
    },
    {
        "id": "split_rock",
        "fnName": "splitRock",
        "title": "Break it in two",
        "adds": "Shooting a big rock makes two smaller ones.",
        "intro": "<p>This is the rule the whole game is built on: shooting a rock makes the screen <strong>busier</strong>, not emptier. A big rock becomes two mediums; each medium becomes two smalls; a small is gone for good.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><text x=\"55\" y=\"15\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">size 3</text><text x=\"175\" y=\"15\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">size 2</text><text x=\"305\" y=\"15\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">size 1</text><circle cx=\"55\" cy=\"100\" r=\"26\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"175\" cy=\"58\" r=\"16\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"175\" cy=\"142\" r=\"16\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"305\" cy=\"32\" r=\"9\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"305\" cy=\"84\" r=\"9\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"305\" cy=\"116\" r=\"9\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"305\" cy=\"168\" r=\"9\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><path d=\"M84,90 L154,66\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M84,110 L154,134\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M192,50 L292,36\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M192,66 L292,80\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M192,134 L292,120\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M192,150 L292,164\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><text x=\"55\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">20 pts</text><text x=\"175\" y=\"192\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">50 pts each</text><text x=\"330\" y=\"196\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"end\">100 pts each</text></svg><figcaption>One big rock is really seven rocks — and eight shots — waiting to happen.</figcaption></figure><p>Notice the scoring runs the other way round: the <em>smallest</em> rocks are worth the most, because they are fast and tiny and genuinely hard to hit.</p><p>Give back a <strong>list</strong>, even when it is empty. A function that sometimes returns a list and sometimes returns nothing forces every caller to check; one that always returns a list &mdash; possibly an empty one &mdash; can just be added on.</p>",
        "spec": {
            "input": "rock — the rock that was shot",
            "output": "a list of the smaller rocks it leaves behind — empty if it was the smallest",
            "algorithm": [
                "If the rock's size is 1 or less, give back an empty list.",
                "Otherwise give back a list of TWO new rocks, one size smaller.",
                "Both start where the old rock was — makeRock gives them their own directions."
            ]
        },
        "starter": "function splitRock(rock) {\n    return [];\n}\n",
        "answer": "function splitRock(rock) {\n    if (rock.size <= 1) {\n        return [];\n    }\n    return [makeRock(rock.x, rock.y, rock.size - 1),\n            makeRock(rock.x, rock.y, rock.size - 1)];\n}\n",
        "hints": [
            "A guard clause first: the smallest rocks leave nothing behind.",
            "Two calls to makeRock, both at the old rock's x and y.",
            "rock.size - 1 is the size of the pieces."
        ],
        "tests": [
            {
                "name": "The smallest rock leaves nothing",
                "code": "assert(splitRock({ x: 10, y: 10, size: 1 }).length === 0);"
            },
            {
                "name": "A big rock leaves exactly two",
                "code": "assert(splitRock({ x: 10, y: 10, size: 3 }).length === 2);"
            },
            {
                "name": "A medium rock leaves exactly two as well",
                "code": "assert(splitRock({ x: 10, y: 10, size: 2 }).length === 2);"
            },
            {
                "name": "The pieces are one size smaller",
                "code": "const pieces = splitRock({ x: 10, y: 10, size: 3 });\nassert(pieces[0].size === 2 && pieces[1].size === 2, 'got sizes ' + pieces[0].size + ' and ' + pieces[1].size);"
            },
            {
                "name": "They start where the old rock was",
                "code": "const pieces = splitRock({ x: 123, y: 45, size: 2 });\nfor (const piece of pieces) {\n    assert(piece.x === 123 && piece.y === 45, 'a piece appeared at ' + piece.x + ',' + piece.y);\n}"
            },
            {
                "name": "The two pieces drift apart",
                "code": "let apart = 0;\nfor (let i = 0; i < 20; i++) {\n    const pieces = splitRock({ x: 10, y: 10, size: 3 });\n    if (Math.abs(pieces[0].dx - pieces[1].dx) > 0.001) { apart = apart + 1; }\n}\nassert(apart > 15, 'only ' + apart + ' of 20 splits sent the pieces different ways');"
            },
            {
                "name": "One big rock is really seven rocks",
                "code": "let all = [{ x: 0, y: 0, size: 3 }];\nlet total = 0;\nwhile (all.length > 0) {\n    const rock = all.pop();\n    total = total + 1;\n    const pieces = splitRock(rock);\n    for (const piece of pieces) { all.push(piece); }\n}\nassert(total === 7, 'a big rock took ' + total + ' shots to clear, expected 7');"
            },
            {
                "name": "It never touches the rock it was given",
                "code": "const rock = { x: 10, y: 10, size: 3 };\nsplitRock(rock);\nassert(rock.size === 3, 'the old rock is thrown away by the caller — splitRock should not change it');"
            }
        ],
        "demo": {
            "kind": "split",
            "caption": "Shoot the big rock. Two mediums appear in its place, then four smalls."
        }
    },
    {
        "id": "hit_rocks",
        "fnName": "hitRocks",
        "title": "Did anything get hit?",
        "adds": "Shooting a rock actually breaks it.",
        "intro": "<p>Now put the last four steps together. Every bullet has to be checked against every rock &mdash; a loop inside a loop.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 175\" width=\"360\" height=\"175\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><circle cx=\"32\" cy=\"100\" r=\"5\" fill=\"#111\"/><circle cx=\"105\" cy=\"100\" r=\"20\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"180\" cy=\"100\" r=\"20\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"255\" cy=\"100\" r=\"20\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"330\" cy=\"100\" r=\"20\" stroke=\"#bbb\" stroke-width=\"1\" fill=\"none\"/><path d=\"M40,100 L80,100\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#tip)\"/><path d=\"M128,100 L155,100\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#tip)\"/><path d=\"M203,100 L230,100\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><text x=\"105\" y=\"146\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">miss</text><text x=\"180\" y=\"146\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">miss</text><text x=\"255\" y=\"146\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">HIT</text><text x=\"330\" y=\"146\" font-family=\"monospace\" font-size=\"11\" fill=\"#999\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">skipped</text><text x=\"180\" y=\"36\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">for each bullet: check rocks in order</text></svg><figcaption>Check the rocks in order and stop at the FIRST hit. One bullet cannot break two rocks.</figcaption></figure><p>Two details make it correct. First, <code>break</code> out of the inner loop the moment a bullet hits something &mdash; one bullet destroys one rock, and without the break it could clear a whole line. Second, build a <strong>new</strong> bullet list of the ones that missed, for the same reason as in <code>ageBullets</code>: changing a list while you are walking along it goes wrong quietly.</p><p>A hit takes the rock out, adds whatever <code>splitRock</code> gives back, and adds its score.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "how many rocks were hit this frame",
            "algorithm": [
                "Start an empty list for the bullets that missed, and a count of 0.",
                "For each bullet, walk the rocks looking for the first one it touches — then stop.",
                "If it missed everything, keep the bullet.",
                "If it hit, remove that rock, add its score, add the pieces from splitRock, and count the hit.",
                "Put the surviving bullets back on the state and give back the count."
            ]
        },
        "starter": "function hitRocks(state) {\n    return 0;\n}\n",
        "answer": "function hitRocks(state) {\n    const surviving = [];\n    let hits = 0;\n\n    for (const bullet of state.bullets) {\n        let hitIndex = -1;\n        for (let r = 0; r < state.rocks.length; r++) {\n            if (touches(bullet, state.rocks[r], 1, ROCK_RADIUS[state.rocks[r].size])) {\n                hitIndex = r;\n                break;\n            }\n        }\n\n        if (hitIndex === -1) {\n            surviving.push(bullet);\n        } else {\n            const rock = state.rocks.splice(hitIndex, 1)[0];\n            state.score = state.score + ROCK_SCORE[rock.size];\n            for (const piece of splitRock(rock)) { state.rocks.push(piece); }\n            hits = hits + 1;\n        }\n    }\n\n    state.bullets = surviving;\n    return hits;\n}\n",
        "hints": [
            "Remember which rock was hit as an index, starting at -1 for 'nothing yet'.",
            "break as soon as you find a hit — one bullet, one rock.",
            "state.rocks.splice(hitIndex, 1)[0] takes the rock out and hands it to you."
        ],
        "tests": [
            {
                "name": "Nothing happens when the bullets are nowhere near",
                "code": "const state = createGame();\nstate.rocks = [{ x: 300, y: 300, size: 3, wobble: 0 }];\nstate.bullets = [{ x: 10, y: 10, life: 1 }];\nassert(hitRocks(state) === 0);\nassert(state.bullets.length === 1, 'a bullet that missed should still be flying');\nassert(state.rocks.length === 1);"
            },
            {
                "name": "A hit is counted",
                "code": "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 3, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nassert(hitRocks(state) === 1);"
            },
            {
                "name": "The bullet is used up",
                "code": "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 3, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nhitRocks(state);\nassert(state.bullets.length === 0, 'the bullet should be gone');"
            },
            {
                "name": "A big rock becomes two mediums",
                "code": "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 3, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nhitRocks(state);\nassert(state.rocks.length === 2, 'there are ' + state.rocks.length + ' rocks, expected 2');\nassert(state.rocks[0].size === 2);"
            },
            {
                "name": "A small rock just disappears",
                "code": "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 1, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nhitRocks(state);\nassert(state.rocks.length === 0);"
            },
            {
                "name": "The score goes up by the right amount",
                "code": "const state = createGame();\nstate.score = 0;\nstate.rocks = [{ x: 100, y: 100, size: 1, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nhitRocks(state);\nassert(state.score === ROCK_SCORE[1], 'score is ' + state.score + ', expected ' + ROCK_SCORE[1]);"
            },
            {
                "name": "One bullet can only break ONE rock",
                "code": "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 1, wobble: 0 }, { x: 102, y: 100, size: 1, wobble: 0 }];\nstate.bullets = [{ x: 101, y: 100, life: 1 }];\nassert(hitRocks(state) === 1, 'one bullet must not clear two rocks — did you break out of the inner loop?');\nassert(state.rocks.length === 1);"
            },
            {
                "name": "Two bullets can break two rocks",
                "code": "const state = createGame();\nstate.rocks = [{ x: 40, y: 40, size: 1, wobble: 0 }, { x: 200, y: 200, size: 1, wobble: 0 }];\nstate.bullets = [{ x: 40, y: 40, life: 1 }, { x: 200, y: 200, life: 1 }];\nassert(hitRocks(state) === 2);\nassert(state.rocks.length === 0);"
            },
            {
                "name": "A patient player can always clear the field",
                "code": "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 3, wobble: 0 }];\nfor (let shot = 0; shot < 40 && state.rocks.length > 0; shot++) {\n    state.bullets = [{ x: state.rocks[0].x, y: state.rocks[0].y, life: 1 }];\n    hitRocks(state);\n}\nassert(state.rocks.length === 0, state.rocks.length + ' rocks are still up there after 40 point-blank shots');"
            }
        ],
        "demo": {
            "kind": "split",
            "caption": "Fire away. Every hit splits a rock and pushes the score up."
        }
    },
    {
        "id": "ship_is_hit",
        "fnName": "shipIsHit",
        "title": "Has the ship been caught?",
        "adds": "Rocks are dangerous again.",
        "intro": "<p>The other collision. Ask whether <em>any</em> rock is touching the ship &mdash; and both languages have a word for that exact question, so you do not need a loop with a flag in it.</p><p>But before you check anything: if the shield is still up, the answer is <code>false</code> whatever the rocks are doing. That is what stops you dying instantly on a respawn, with a rock sitting where the ship reappears. Another guard clause, and the most important one in the game.</p><p><strong>In JavaScript:</strong> <code>list.some(test)</code> is true when the test passes for at least one item.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "true if a rock has caught the ship",
            "algorithm": [
                "If the shield is still running, give back false straight away.",
                "Otherwise ask whether ANY rock touches the ship.",
                "Use each rock's own radius — a big rock is a bigger target."
            ]
        },
        "starter": "function shipIsHit(state) {\n    return false;\n}\n",
        "answer": "function shipIsHit(state) {\n    if (state.shield > 0) {\n        return false;\n    }\n    return state.rocks.some(function (rock) {\n        return touches(state.ship, rock, SHIP_RADIUS, ROCK_RADIUS[rock.size]);\n    });\n}\n",
        "hints": [
            "The shield guard goes first, before you look at a single rock.",
            "state.rocks.some(...) is true when at least one rock passes the test.",
            "touches(state.ship, rock, SHIP_RADIUS, ROCK_RADIUS[rock.size])"
        ],
        "tests": [
            {
                "name": "An empty sky is safe",
                "code": "const state = createGame();\nstate.shield = 0;\nstate.rocks = [];\nassert(shipIsHit(state) === false);"
            },
            {
                "name": "A distant rock is safe",
                "code": "const state = createGame();\nstate.shield = 0;\nstate.ship = { x: 20, y: 20, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 300, y: 300, size: 3 }];\nassert(shipIsHit(state) === false);"
            },
            {
                "name": "A rock on top of the ship is a hit",
                "code": "const state = createGame();\nstate.shield = 0;\nstate.ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 100, y: 100, size: 3 }];\nassert(shipIsHit(state) === true);"
            },
            {
                "name": "The shield saves you",
                "code": "const state = createGame();\nstate.shield = 1.5;\nstate.ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 100, y: 100, size: 3 }];\nassert(shipIsHit(state) === false, 'the shield must beat every rock, or you would die the moment you respawn');"
            },
            {
                "name": "Any one of many rocks is enough",
                "code": "const state = createGame();\nstate.shield = 0;\nstate.ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 10, y: 10, size: 1 }, { x: 300, y: 300, size: 1 }, { x: 100, y: 100, size: 1 }];\nassert(shipIsHit(state) === true);"
            },
            {
                "name": "A big rock is a bigger target",
                "code": "const state = createGame();\nstate.shield = 0;\nstate.ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 100 + SHIP_RADIUS + 20, y: 100, size: 3 }];\nassert(shipIsHit(state) === true, 'a big rock has radius ' + ROCK_RADIUS[3]);\nstate.rocks = [{ x: 100 + SHIP_RADIUS + 20, y: 100, size: 1 }];\nassert(shipIsHit(state) === false, 'a small rock has radius ' + ROCK_RADIUS[1]);"
            },
            {
                "name": "It does not disturb anything",
                "code": "const state = createGame();\nstate.shield = 0;\nconst before = state.rocks.length;\nshipIsHit(state);\nassert(state.rocks.length === before, 'a question should not change the game');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "A robot flies this one. Watch the lives fall when it gets careless."
        }
    },
    {
        "id": "start_wave",
        "fnName": "startWave",
        "title": "A ring of rocks",
        "adds": "Clear the field and a harder wave arrives.",
        "intro": "<p>Almost there. A new wave is <code>3 + wave</code> big rocks, spaced evenly round a ring &mdash; well away from the middle, so the ship is never crushed the instant a wave begins.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><circle cx=\"180\" cy=\"101\" r=\"71\" stroke=\"#bbb\" stroke-width=\"1\" fill=\"none\" stroke-dasharray=\"5 4\"/><path d=\"M192,100 L168,88 L168,112 z\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"251\" cy=\"101\" r=\"16\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"180\" cy=\"172\" r=\"16\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"109\" cy=\"101\" r=\"16\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"180\" cy=\"30\" r=\"16\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"282\" y=\"104\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">i = 0</text><text x=\"202\" y=\"176\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">i = 1</text><text x=\"88\" y=\"104\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"end\">i = 2</text><text x=\"202\" y=\"34\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\">i = 3</text></svg><figcaption>Spread the rocks evenly: rock i sits at i/count of the way round.</figcaption></figure><p>Evenly spaced means rock <code>i</code> of <code>count</code> goes at <code>i / count</code> of a whole turn. That fraction-of-a-circle trick is the same one you used for the corners of a rock &mdash; it turns up everywhere once you have seen it.</p><p>Clear the old bullets too. A shot left over from the last wave, still flying, would be a strange little gift.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "nothing; it fills state.rocks with a new wave",
            "algorithm": [
                "Empty the rock list.",
                "Work out how many: 3 + the wave number.",
                "For each one, put it at i / count of the way round a circle, 130 pixels out from the middle.",
                "Empty the bullet list too."
            ]
        },
        "starter": "function startWave(state) {\n    // a ring of rocks\n}\n",
        "answer": "function startWave(state) {\n    state.rocks = [];\n    const count = 3 + state.wave;\n\n    for (let i = 0; i < count; i++) {\n        const angle = i / count * Math.PI * 2;\n        const spot = pointFrom(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, angle, 130);\n        state.rocks.push(makeRock(spot.x, spot.y, BIG_ROCK));\n    }\n    state.bullets = [];\n}\n",
        "hints": [
            "i / count * Math.PI * 2 spreads them evenly round the circle.",
            "pointFrom from the middle of the field, 130 pixels out.",
            "Every rock in a new wave is a BIG_ROCK."
        ],
        "tests": [
            {
                "name": "Wave 1 has four rocks",
                "code": "const state = createGame();\nstate.wave = 1;\nstartWave(state);\nassert(state.rocks.length === 4, 'got ' + state.rocks.length);"
            },
            {
                "name": "Later waves have more",
                "code": "const state = createGame();\nstate.wave = 5;\nstartWave(state);\nassert(state.rocks.length === 8, 'got ' + state.rocks.length + ' — 3 + 5 is 8');"
            },
            {
                "name": "They are all big ones",
                "code": "const state = createGame();\nstate.wave = 2;\nstartWave(state);\nfor (const rock of state.rocks) {\n    assert(rock.size === BIG_ROCK, 'a wave should start with big rocks only');\n}"
            },
            {
                "name": "Old bullets are cleared away",
                "code": "const state = createGame();\nstate.bullets = [{ x: 1, y: 1, life: 1 }];\nstartWave(state);\nassert(state.bullets.length === 0, 'a shot from the last wave should not survive');"
            },
            {
                "name": "They start well away from the middle",
                "code": "const state = createGame();\nstate.wave = 3;\nstartWave(state);\nconst middle = { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2 };\nfor (const rock of state.rocks) {\n    assert(distanceBetween(middle, rock) > 100, 'a rock started ' + distanceBetween(middle, rock).toFixed(0) + ' from the ship — that is instant death');\n}"
            },
            {
                "name": "They are spread out, not stacked up",
                "code": "const state = createGame();\nstate.wave = 3;\nstartWave(state);\nfor (let i = 0; i < state.rocks.length; i++) {\n    for (let j = i + 1; j < state.rocks.length; j++) {\n        assert(distanceBetween(state.rocks[i], state.rocks[j]) > 40, 'rocks ' + i + ' and ' + j + ' started on top of each other');\n    }\n}"
            },
            {
                "name": "A new wave replaces the old rocks, it does not add to them",
                "code": "const state = createGame();\nstate.wave = 1;\nstartWave(state);\nstartWave(state);\nassert(state.rocks.length === 4, 'there are ' + state.rocks.length + ' rocks — did you forget to empty the list first?');"
            },
            {
                "name": "Every wave is harder than the one before",
                "code": "let last = 0;\nfor (let wave = 1; wave <= 6; wave++) {\n    const state = createGame();\n    state.wave = wave;\n    startWave(state);\n    assert(state.rocks.length > last, 'wave ' + wave + ' was no harder than wave ' + (wave - 1));\n    last = state.rocks.length;\n}"
            }
        ],
        "demo": {
            "kind": "wave",
            "caption": "Press Next Wave. Each one is a bigger ring than the last."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "The controls",
        "adds": "Asteroids is finished. Go and fly it.",
        "intro": "<p>One last function, and the easiest of the twenty: turn a key into the <em>name</em> of an action.</p><p>Note what it does not do. It does not turn the ship or fire a shot &mdash; it just says <code>'left'</code>, or <code>'fire'</code>, or nothing at all. That one layer of indirection is why the on-screen buttons, the keyboard and an Xbox controller can all drive the same game without any of them knowing about the others.</p><p>Arrow keys and WASD both work, because different people reach for different keys. Anything else gives back nothing, and nothing happens.</p>",
        "spec": {
            "input": "key — the key that was pressed, like 'ArrowLeft' or 'w'",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Put the key in lower case first, so 'W' and 'w' both work.",
                "Left or A → 'left'. Right or D → 'right'. Up or W → 'thrust'.",
                "Space → 'fire'. P → 'pause'. R → 'restart'.",
                "Anything else → nothing."
            ]
        },
        "starter": "function actionForKey(key) {\n    return null;\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === 'arrowup' || k === 'w') { return 'thrust'; }\n    if (k === ' ' || k === 'spacebar') { return 'fire'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "String(key).toLowerCase() once, at the top, saves six comparisons.",
            "The arrow keys arrive as 'ArrowLeft', 'ArrowRight' and 'ArrowUp'.",
            "return null; at the end, for every key you do not care about."
        ],
        "tests": [
            {
                "name": "The arrow keys steer",
                "code": "assert(actionForKey('ArrowLeft') === 'left');\nassert(actionForKey('ArrowRight') === 'right');\nassert(actionForKey('ArrowUp') === 'thrust');"
            },
            {
                "name": "WASD works too",
                "code": "assert(actionForKey('a') === 'left');\nassert(actionForKey('d') === 'right');\nassert(actionForKey('w') === 'thrust');"
            },
            {
                "name": "Capitals work as well",
                "code": "assert(actionForKey('W') === 'thrust', 'Caps Lock should not break the game');\nassert(actionForKey('ArrowLEFT') === 'left');"
            },
            {
                "name": "Space fires",
                "code": "assert(actionForKey(' ') === 'fire');\nassert(actionForKey('Spacebar') === 'fire', 'some older browsers send Spacebar');"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert(actionForKey('p') === 'pause');\nassert(actionForKey('r') === 'restart');"
            },
            {
                "name": "Everything else does nothing",
                "code": "for (const key of ['q', 'z', 'Enter', 'Shift', '7', 'ArrowDown']) {\n    assert(!actionForKey(key), key + ' should not do anything');\n}"
            },
            {
                "name": "Every action the game knows about has a key",
                "code": "const wanted = ['left', 'right', 'thrust', 'fire', 'pause', 'restart'];\nconst found = [];\nfor (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'p', 'r']) {\n    found.push(actionForKey(key));\n}\nfor (const action of wanted) {\n    assert(found.indexOf(action) !== -1, 'nothing is wired up to ' + action);\n}"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Twenty functions, one game. Arrows or WASD to fly, space to shoot."
        }
    }
];
