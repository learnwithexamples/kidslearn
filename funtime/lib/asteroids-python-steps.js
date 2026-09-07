/* ============================================================
   asteroids-python-steps.js - the 20 steps of "Build Asteroids in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const ASTEROIDS_PYTHON_STEPS = [
    {
        "id": "point_from",
        "fnName": "point_from",
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
        "starter": "def point_from(x, y, angle, distance):\n    return {\"x\": x, \"y\": y}\n",
        "answer": "def point_from(x, y, angle, distance):\n    return {\n        \"x\": x + math.cos(angle) * distance,\n        \"y\": y + math.sin(angle) * distance,\n    }\n",
        "hints": [
            "math.cos and math.sin both want the angle in radians, which is what we have.",
            "cos goes with x, sin goes with y. Always that way round.",
            "\"x\": x + math.cos(angle) * distance"
        ],
        "tests": [
            {
                "name": "Angle 0 goes to the right",
                "code": "p = point_from(0, 0, 0, 10)\nassert abs(p['x'] - 10) < 0.001\nassert abs(p['y']) < 0.001"
            },
            {
                "name": "A quarter turn goes DOWN",
                "code": "p = point_from(0, 0, math.pi / 2, 10)\nassert abs(p['x']) < 0.001\nassert abs(p['y'] - 10) < 0.001, 'on a canvas, y grows downwards'"
            },
            {
                "name": "Half a turn goes left",
                "code": "p = point_from(0, 0, math.pi, 10)\nassert abs(p['x'] + 10) < 0.001"
            },
            {
                "name": "Three quarters goes UP",
                "code": "p = point_from(0, 0, -math.pi / 2, 10)\nassert abs(p['y'] + 10) < 0.001"
            },
            {
                "name": "It starts from where you tell it",
                "code": "p = point_from(100, 50, 0, 10)\nassert abs(p['x'] - 110) < 0.001 and abs(p['y'] - 50) < 0.001"
            },
            {
                "name": "Twice the distance is twice as far",
                "code": "near = point_from(0, 0, 1, 10)\nfar = point_from(0, 0, 1, 20)\nassert abs(far['x'] - near['x'] * 2) < 0.001"
            },
            {
                "name": "Every angle lands the right distance away",
                "code": "for step in range(16):\n    angle = step / 16 * math.pi * 2\n    p = point_from(0, 0, angle, 25)\n    away = math.sqrt(p['x'] ** 2 + p['y'] ** 2)\n    assert abs(away - 25) < 0.001, f'angle {angle:.2f} landed {away:.1f} away'"
            },
            {
                "name": "Zero distance does not move at all",
                "code": "p = point_from(30, 40, 2.1, 0)\nassert abs(p['x'] - 30) < 0.001 and abs(p['y'] - 40) < 0.001"
            }
        ],
        "demo": {
            "kind": "angles",
            "caption": "Turn the ship and watch the dashed line — that is pointFrom drawing 60 pixels ahead."
        }
    },
    {
        "id": "distance_between",
        "fnName": "distance_between",
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
        "starter": "def distance_between(a, b):\n    return 0\n",
        "answer": "def distance_between(a, b):\n    across = a[\"x\"] - b[\"x\"]\n    down = a[\"y\"] - b[\"y\"]\n    return math.sqrt(across * across + down * down)\n",
        "hints": [
            "Two subtractions, then math.sqrt of the two squares added up.",
            "In Python, across ** 2 squares a number.",
            "return math.sqrt(across * across + down * down)"
        ],
        "tests": [
            {
                "name": "A thing is no distance from itself",
                "code": "assert distance_between({'x': 40, 'y': 90}, {'x': 40, 'y': 90}) == 0"
            },
            {
                "name": "Straight across",
                "code": "assert distance_between({'x': 0, 'y': 0}, {'x': 7, 'y': 0}) == 7"
            },
            {
                "name": "Straight down",
                "code": "assert distance_between({'x': 5, 'y': 2}, {'x': 5, 'y': 11}) == 9"
            },
            {
                "name": "The 3-4-5 triangle every builder knows",
                "code": "d = distance_between({'x': 0, 'y': 0}, {'x': 3, 'y': 4})\nassert abs(d - 5) < 0.001, f'got {d}, expected 5'"
            },
            {
                "name": "It never comes back negative",
                "code": "d = distance_between({'x': 10, 'y': 10}, {'x': 4, 'y': 2})\nassert d > 0 and abs(d - 10) < 0.001"
            },
            {
                "name": "Which way round you ask makes no difference",
                "code": "a = {'x': 12, 'y': -5}\nb = {'x': -3, 'y': 9}\nassert abs(distance_between(a, b) - distance_between(b, a)) < 0.001"
            },
            {
                "name": "It agrees with point_from",
                "code": "for step in range(12):\n    angle = step / 12 * math.pi * 2\n    there = point_from(170, 170, angle, 44)\n    d = distance_between({'x': 170, 'y': 170}, there)\n    assert abs(d - 44) < 0.001, f'point_from went 44 away but distance_between says {d:.2f}'"
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
        "starter": "def touches(a, b, radius_a, radius_b):\n    return False\n",
        "answer": "def touches(a, b, radius_a, radius_b):\n    return distance_between(a, b) < radius_a + radius_b\n",
        "hints": [
            "You do not need an if. A comparison is already True or False.",
            "distance_between(a, b) is the gap. radius_a + radius_b is how close is too close.",
            "return distance_between(a, b) < radius_a + radius_b"
        ],
        "tests": [
            {
                "name": "Two things in the same place definitely touch",
                "code": "assert touches({'x': 50, 'y': 50}, {'x': 50, 'y': 50}, 5, 5) is True"
            },
            {
                "name": "Far apart is a miss",
                "code": "assert touches({'x': 0, 'y': 0}, {'x': 300, 'y': 0}, 10, 10) is False"
            },
            {
                "name": "Just close enough",
                "code": "assert touches({'x': 0, 'y': 0}, {'x': 19, 'y': 0}, 10, 10) is True"
            },
            {
                "name": "Just too far",
                "code": "assert touches({'x': 0, 'y': 0}, {'x': 21, 'y': 0}, 10, 10) is False"
            },
            {
                "name": "Exactly touching does not count as a hit",
                "code": "assert touches({'x': 0, 'y': 0}, {'x': 20, 'y': 0}, 10, 10) is False, 'use < rather than <=, so a graze is not a hit'"
            },
            {
                "name": "A bigger rock is easier to hit",
                "code": "bullet = {'x': 0, 'y': 0}\nrock = {'x': 24, 'y': 0}\nassert touches(bullet, rock, 1, ROCK_RADIUS[3]) is True\nassert touches(bullet, rock, 1, ROCK_RADIUS[1]) is False"
            },
            {
                "name": "It works diagonally too, not just in a straight line",
                "code": "assert touches({'x': 0, 'y': 0}, {'x': 3, 'y': 4}, 3, 3) is True\nassert touches({'x': 0, 'y': 0}, {'x': 3, 'y': 4}, 2, 2) is False"
            },
            {
                "name": "Order does not matter",
                "code": "a = {'x': 10, 'y': 20}\nb = {'x': 25, 'y': 20}\nassert touches(a, b, 8, 9) == touches(b, a, 9, 8)"
            }
        ],
        "demo": {
            "kind": "measure",
            "caption": "Fly the ship at the rock. The word underneath flips the instant touches says true."
        }
    },
    {
        "id": "wrap_position",
        "fnName": "wrap_position",
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
        "starter": "def wrap_position(thing):\n    # off one edge, back on the other\n    pass\n",
        "answer": "def wrap_position(thing):\n    while thing[\"x\"] < 0:\n        thing[\"x\"] += FIELD_WIDTH\n    while thing[\"x\"] >= FIELD_WIDTH:\n        thing[\"x\"] -= FIELD_WIDTH\n    while thing[\"y\"] < 0:\n        thing[\"y\"] += FIELD_HEIGHT\n    while thing[\"y\"] >= FIELD_HEIGHT:\n        thing[\"y\"] -= FIELD_HEIGHT\n",
        "hints": [
            "Four while loops, two for x and two for y.",
            "Going off the left means ADDING the width.",
            "Use >= for the far edge, so exactly FIELD_WIDTH wraps to 0."
        ],
        "tests": [
            {
                "name": "Something in the middle is left alone",
                "code": "thing = {'x': 100, 'y': 100}\nwrap_position(thing)\nassert thing == {'x': 100, 'y': 100}"
            },
            {
                "name": "Off the left comes back on the right",
                "code": "thing = {'x': -5, 'y': 100}\nwrap_position(thing)\nassert thing['x'] == FIELD_WIDTH - 5"
            },
            {
                "name": "Off the right comes back on the left",
                "code": "thing = {'x': FIELD_WIDTH + 5, 'y': 100}\nwrap_position(thing)\nassert thing['x'] == 5"
            },
            {
                "name": "Off the top comes back at the bottom",
                "code": "thing = {'x': 100, 'y': -5}\nwrap_position(thing)\nassert thing['y'] == FIELD_HEIGHT - 5"
            },
            {
                "name": "Off the bottom comes back at the top",
                "code": "thing = {'x': 100, 'y': FIELD_HEIGHT + 5}\nwrap_position(thing)\nassert thing['y'] == 5"
            },
            {
                "name": "A corner wraps in both directions at once",
                "code": "thing = {'x': -5, 'y': -5}\nwrap_position(thing)\nassert thing['x'] == FIELD_WIDTH - 5 and thing['y'] == FIELD_HEIGHT - 5"
            },
            {
                "name": "A huge jump still lands on the field",
                "code": "thing = {'x': FIELD_WIDTH * 3 + 7, 'y': -FIELD_HEIGHT * 2 - 3}\nwrap_position(thing)\nassert 0 <= thing['x'] < FIELD_WIDTH, 'did you use while rather than if?'\nassert 0 <= thing['y'] < FIELD_HEIGHT"
            },
            {
                "name": "Nothing can ever escape",
                "code": "thing = {'x': 10, 'y': 10, 'dx': 411, 'dy': -389}\nfor frame in range(3000):\n    thing['x'] += thing['dx'] * 0.05\n    thing['y'] += thing['dy'] * 0.05\n    wrap_position(thing)\n    assert 0 <= thing['x'] < FIELD_WIDTH, f'it escaped sideways at frame {frame}'\n    assert 0 <= thing['y'] < FIELD_HEIGHT, f'it escaped up or down at frame {frame}'"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Push the ship at a wall. It slides straight through and reappears opposite."
        }
    },
    {
        "id": "speed_of",
        "fnName": "speed_of",
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
        "starter": "def speed_of(thing):\n    return 0\n",
        "answer": "def speed_of(thing):\n    return math.sqrt(thing[\"dx\"] ** 2 + thing[\"dy\"] ** 2)\n",
        "hints": [
            "It is the same sum as distance_between, with dx and dy instead of the two gaps.",
            "math.sqrt(a ** 2 + b ** 2)",
            "return math.sqrt(thing['dx'] ** 2 + thing['dy'] ** 2)"
        ],
        "tests": [
            {
                "name": "Standing still is a speed of zero",
                "code": "assert speed_of({'dx': 0, 'dy': 0}) == 0"
            },
            {
                "name": "Sliding straight sideways",
                "code": "assert speed_of({'dx': 12, 'dy': 0}) == 12"
            },
            {
                "name": "Sliding straight down",
                "code": "assert speed_of({'dx': 0, 'dy': 9}) == 9"
            },
            {
                "name": "Going backwards is still a positive speed",
                "code": "assert speed_of({'dx': -12, 'dy': 0}) == 12, 'speed has no direction'"
            },
            {
                "name": "The 3-4-5 triangle again",
                "code": "assert abs(speed_of({'dx': 3, 'dy': 4}) - 5) < 0.001"
            },
            {
                "name": "Diagonal is more than either side, less than both added up",
                "code": "s = speed_of({'dx': 100, 'dy': 100})\nassert 100 < s < 200, f'got {s}'\nassert abs(s - 141.42) < 0.01, f'got {s:.2f}, expected about 141.42'"
            },
            {
                "name": "It matches point_from's distance, whatever the direction",
                "code": "for step in range(12):\n    angle = step / 12 * math.pi * 2\n    flight = point_from(0, 0, angle, 250)\n    s = speed_of({'dx': flight['x'], 'dy': flight['y']})\n    assert abs(s - 250) < 0.001, f'angle {angle:.2f} gave a speed of {s:.2f}'"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "The number under the field is speedOf(ship). Hold thrust and watch it climb."
        }
    },
    {
        "id": "clamp_speed",
        "fnName": "clamp_speed",
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
        "starter": "def clamp_speed(thing, limit):\n    return False\n",
        "answer": "def clamp_speed(thing, limit):\n    speed = speed_of(thing)\n    if speed <= limit:\n        return False\n    thing[\"dx\"] = thing[\"dx\"] / speed * limit\n    thing[\"dy\"] = thing[\"dy\"] / speed * limit\n    return True\n",
        "hints": [
            "Work the speed out ONCE and keep it in a variable — you need it twice.",
            "Returning early when it is already slow enough saves you an else.",
            "thing['dx'] = thing['dx'] / speed * limit  — and the same line for dy."
        ],
        "tests": [
            {
                "name": "Something slow is left completely alone",
                "code": "thing = {'dx': 3, 'dy': 4}\nassert clamp_speed(thing, 100) is False\nassert thing == {'dx': 3, 'dy': 4}"
            },
            {
                "name": "Exactly at the limit is fine",
                "code": "thing = {'dx': 5, 'dy': 0}\nassert clamp_speed(thing, 5) is False, 'use <= so sitting exactly on the limit is allowed'"
            },
            {
                "name": "Too fast gets slowed down",
                "code": "thing = {'dx': 300, 'dy': 0}\nassert clamp_speed(thing, 100) is True\nassert abs(thing['dx'] - 100) < 0.001"
            },
            {
                "name": "It ends up at exactly the limit",
                "code": "thing = {'dx': 300, 'dy': 400}\nclamp_speed(thing, 50)\nassert abs(speed_of(thing) - 50) < 0.001"
            },
            {
                "name": "The direction does not change",
                "code": "thing = {'dx': 300, 'dy': 400}\nclamp_speed(thing, 50)\nassert abs(thing['dx'] - 30) < 0.001, '300 and 400 shrink to 30 and 40'\nassert abs(thing['dy'] - 40) < 0.001"
            },
            {
                "name": "Negative speeds keep their sign",
                "code": "thing = {'dx': -300, 'dy': -400}\nclamp_speed(thing, 50)\nassert thing['dx'] < 0 and thing['dy'] < 0, 'it turned the ship right round!'\nassert abs(speed_of(thing) - 50) < 0.001"
            },
            {
                "name": "Nothing ever creeps over the limit",
                "code": "thing = {'dx': 0, 'dy': 0}\nfor frame in range(500):\n    thing['dx'] += 40\n    thing['dy'] -= 25\n    clamp_speed(thing, MAX_SPEED)\n    assert speed_of(thing) <= MAX_SPEED + 0.001, f'frame {frame} reached {speed_of(thing):.1f}'"
            },
            {
                "name": "Standing perfectly still does not break it",
                "code": "thing = {'dx': 0, 'dy': 0}\nassert clamp_speed(thing, 100) is False, 'a speed of 0 is under any limit — you must not divide by it'"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Hold thrust. The speed climbs, then stops dead at MAX_SPEED — and the ship keeps its heading."
        }
    },
    {
        "id": "turn_ship",
        "fnName": "turn_ship",
        "title": "Swing the nose round",
        "adds": "Left and right steer the ship.",
        "intro": "<p>Holding left or right sets <code>turning</code> to &minus;1 or 1, and this function does the actual swinging: add <code>turning × TURN_SPEED × seconds</code> to the angle.</p><p>Then comes the interesting half. Spin one way for five minutes and the angle would climb past 1000 radians. <code>cos</code> and <code>sin</code> would still work perfectly &mdash; but every number you printed while hunting a bug would be meaningless. So fold the answer back into the range &minus;&pi; to &pi;.</p><figure class=\"step-figure\"><svg viewBox=\"0 0 360 200\" width=\"360\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><defs><marker id=\"tip\" markerWidth=\"9\" markerHeight=\"9\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L8,3 z\" fill=\"#111\"/></marker></defs><path d=\"M40,116 L320,116\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><path d=\"M40,110 L40,122\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"40\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">-pi</text><path d=\"M110,111 L110,121\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><text x=\"110\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">-pi/2</text><path d=\"M180,110 L180,122\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"180\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">0</text><path d=\"M250,111 L250,121\" stroke=\"#111\" stroke-width=\"1\" fill=\"none\"/><text x=\"250\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">pi/2</text><path d=\"M320,110 L320,122\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\"/><text x=\"320\" y=\"140\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">pi</text><path d=\"M265,94 L336,94\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M24,94 L86,94\" stroke=\"#111\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#tip)\"/><path d=\"M338,88 Q336,42 180,40 Q24,42 22,88\" stroke=\"#111\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\" marker-end=\"url(#tip)\"/><text x=\"180\" y=\"30\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">turning right, past pi</text><text x=\"180\" y=\"176\" font-family=\"monospace\" font-size=\"11\" fill=\"#555\" stroke=\"#ffffff\" stroke-width=\"3.5\" paint-order=\"stroke\" stroke-linejoin=\"round\" text-anchor=\"middle\">the angle always stays inside this line</text></svg><figcaption>Keep turning right and the angle folds back round to -pi, instead of climbing for ever.</figcaption></figure><p>The fold is one line: add &pi;, take the remainder when divided by a whole turn, take &pi; back off.</p><p><strong>In Python:</strong> <code>%</code> always gives a positive answer, so <code>-1 % 5</code> is <code>4</code>. That makes this tidier here than it is in JavaScript — one remainder is enough.</p>",
        "spec": {
            "input": "ship — the ship. turning — −1, 0 or 1. seconds — how long this frame lasted.",
            "output": "nothing; it changes the ship's angle",
            "algorithm": [
                "Add turning × TURN_SPEED × seconds to the ship's angle.",
                "Add π, then take the remainder when divided by a whole turn (2π).",
                "Take π back off, and store the result."
            ]
        },
        "starter": "def turn_ship(ship, turning, seconds):\n    # swing the nose\n    pass\n",
        "answer": "def turn_ship(ship, turning, seconds):\n    whole = math.pi * 2\n    angle = ship[\"angle\"] + turning * TURN_SPEED * seconds\n    ship[\"angle\"] = (angle + math.pi) % whole - math.pi\n",
        "hints": [
            "First the easy part: ship['angle'] + turning * TURN_SPEED * seconds.",
            "Then fold it: add math.pi, % a whole turn, subtract math.pi.",
            "(angle + math.pi) % whole - math.pi — Python's % is always positive, so one is enough."
        ],
        "tests": [
            {
                "name": "Not turning leaves the angle alone",
                "code": "ship = {'angle': 1}\nturn_ship(ship, 0, 0.5)\nassert abs(ship['angle'] - 1) < 0.0001"
            },
            {
                "name": "Turning right makes the angle bigger",
                "code": "ship = {'angle': 0}\nturn_ship(ship, 1, 0.1)\nassert abs(ship['angle'] - TURN_SPEED * 0.1) < 0.0001"
            },
            {
                "name": "Turning left makes it smaller",
                "code": "ship = {'angle': 0}\nturn_ship(ship, -1, 0.1)\nassert ship['angle'] < 0"
            },
            {
                "name": "A long frame turns further than a short one",
                "code": "slow = {'angle': 0}\nfast = {'angle': 0}\nturn_ship(slow, 1, 0.05)\nturn_ship(fast, 1, 0.10)\nassert abs(fast['angle'] - slow['angle'] * 2) < 0.0001"
            },
            {
                "name": "Turning past pi wraps round to the other end",
                "code": "ship = {'angle': 3.1}\nturn_ship(ship, 1, 0.2)\nassert ship['angle'] < 0, f\"angle is {ship['angle']}\"\nassert ship['angle'] >= -math.pi"
            },
            {
                "name": "Turning past -pi wraps the other way",
                "code": "ship = {'angle': -3.1}\nturn_ship(ship, -1, 0.2)\nassert ship['angle'] > 0, f\"angle is {ship['angle']}\""
            },
            {
                "name": "The angle never runs away, however long you spin",
                "code": "ship = {'angle': 0}\nfor frame in range(4000):\n    turn_ship(ship, 1, 0.05)\n    assert -math.pi <= ship['angle'] <= math.pi, f\"frame {frame}: angle escaped to {ship['angle']:.2f}\""
            },
            {
                "name": "Wrapping does not change where the nose actually points",
                "code": "spun = {'angle': 3.1}\nturn_ship(spun, 1, 0.2)\nraw = 3.1 + TURN_SPEED * 0.2\nassert abs(math.cos(spun['angle']) - math.cos(raw)) < 0.0001, 'the fold moved the nose'\nassert abs(math.sin(spun['angle']) - math.sin(raw)) < 0.0001"
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
        "fnName": "thrust_ship",
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
        "starter": "def thrust_ship(ship, seconds):\n    # push the ship along its nose\n    pass\n",
        "answer": "def thrust_ship(ship, seconds):\n    ship[\"dx\"] += math.cos(ship[\"angle\"]) * THRUST * seconds\n    ship[\"dy\"] += math.sin(ship[\"angle\"]) * THRUST * seconds\n\n    clamp_speed(ship, MAX_SPEED)\n",
        "hints": [
            "Use += so you ADD to dx and dy rather than replacing them.",
            "Same cos/sin pairing as point_from: cos with x, sin with y.",
            "Last line: clamp_speed(ship, MAX_SPEED)"
        ],
        "tests": [
            {
                "name": "A ship pointing right speeds up to the right",
                "code": "ship = {'angle': 0, 'dx': 0, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert abs(ship['dx'] - THRUST * 0.1) < 0.001\nassert abs(ship['dy']) < 0.001"
            },
            {
                "name": "A ship pointing up speeds up upwards",
                "code": "ship = {'angle': -math.pi / 2, 'dx': 0, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert ship['dy'] < 0, 'up the screen is negative'\nassert abs(ship['dx']) < 0.001"
            },
            {
                "name": "It ADDS to the speed the ship already had",
                "code": "ship = {'angle': 0, 'dx': 50, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert ship['dx'] > 50, 'did you replace dx instead of adding to it?'"
            },
            {
                "name": "Thrusting backwards slows you down before it turns you round",
                "code": "ship = {'angle': math.pi, 'dx': 100, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert 0 < ship['dx'] < 100, 'one short burst should slow it, not reverse it'"
            },
            {
                "name": "A longer frame pushes harder",
                "code": "slow = {'angle': 0, 'dx': 0, 'dy': 0}\nfast = {'angle': 0, 'dx': 0, 'dy': 0}\nthrust_ship(slow, 0.05)\nthrust_ship(fast, 0.10)\nassert abs(fast['dx'] - slow['dx'] * 2) < 0.001"
            },
            {
                "name": "You can never break the speed limit",
                "code": "ship = {'angle': 0.7, 'dx': 0, 'dy': 0}\nfor frame in range(400):\n    thrust_ship(ship, 0.05)\n    assert speed_of(ship) <= MAX_SPEED + 0.001, f'frame {frame} reached {speed_of(ship):.1f} — did you call clamp_speed?'"
            },
            {
                "name": "Held down long enough, it does reach the limit",
                "code": "ship = {'angle': 0.7, 'dx': 0, 'dy': 0}\nfor frame in range(400):\n    thrust_ship(ship, 0.05)\nassert abs(speed_of(ship) - MAX_SPEED) < 0.001"
            },
            {
                "name": "The push always goes where the nose points",
                "code": "for step in range(8):\n    angle = step / 8 * math.pi * 2\n    ship = {'angle': angle, 'dx': 0, 'dy': 0}\n    thrust_ship(ship, 0.1)\n    wanted = point_from(0, 0, angle, THRUST * 0.1)\n    assert abs(ship['dx'] - wanted['x']) < 0.001 and abs(ship['dy'] - wanted['y']) < 0.001, f'angle {angle:.2f} pushed the wrong way'"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Thrust, then let go. The ship keeps going — that is the speed it kept."
        }
    },
    {
        "id": "drift_ship",
        "fnName": "drift_ship",
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
        "starter": "def drift_ship(ship, seconds):\n    # let the speed fade\n    pass\n",
        "answer": "def drift_ship(ship, seconds):\n    slow = 1 - DRIFT_SLOWDOWN * seconds\n    ship[\"dx\"] *= slow\n    ship[\"dy\"] *= slow\n",
        "hints": [
            "Work the fraction out once, then use it on both dx and dy.",
            "It must be just UNDER 1 — that is what makes it fade slowly.",
            "slow = 1 - DRIFT_SLOWDOWN * seconds"
        ],
        "tests": [
            {
                "name": "A ship at rest stays at rest",
                "code": "ship = {'dx': 0, 'dy': 0}\ndrift_ship(ship, 0.1)\nassert ship == {'dx': 0, 'dy': 0}"
            },
            {
                "name": "A moving ship slows a little",
                "code": "ship = {'dx': 100, 'dy': 0}\ndrift_ship(ship, 0.1)\nassert 90 < ship['dx'] < 100, f\"dx is {ship['dx']}\""
            },
            {
                "name": "Both directions fade together",
                "code": "ship = {'dx': 100, 'dy': 200}\ndrift_ship(ship, 0.1)\nassert abs(ship['dy'] / ship['dx'] - 2) < 0.0001, 'the ship changed course'"
            },
            {
                "name": "Going backwards slows down too",
                "code": "ship = {'dx': -100, 'dy': 0}\ndrift_ship(ship, 0.1)\nassert -100 < ship['dx'] < 0"
            },
            {
                "name": "A longer frame fades more",
                "code": "brief = {'dx': 100, 'dy': 0}\nlonger = {'dx': 100, 'dy': 0}\ndrift_ship(brief, 0.02)\ndrift_ship(longer, 0.20)\nassert longer['dx'] < brief['dx']"
            },
            {
                "name": "Two short frames match one long one, near enough",
                "code": "twice = {'dx': 100, 'dy': 0}\ndrift_ship(twice, 0.05)\ndrift_ship(twice, 0.05)\nonce = {'dx': 100, 'dy': 0}\ndrift_ship(once, 0.10)\nassert abs(twice['dx'] - once['dx']) < 0.5, 'the frame rate should barely matter'"
            },
            {
                "name": "Left alone, the ship coasts almost to a stop",
                "code": "ship = {'dx': 200, 'dy': 150}\nfor frame in range(600):\n    drift_ship(ship, 0.05)\nassert speed_of(ship) < 1, f'after 30 seconds it is still going {speed_of(ship):.1f}'"
            },
            {
                "name": "But it never turns round",
                "code": "ship = {'dx': 200, 'dy': -150}\nfor frame in range(600):\n    drift_ship(ship, 0.05)\n    assert ship['dx'] > 0 and ship['dy'] < 0, f'frame {frame}: the drift reversed the ship'"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Give it one burst then let go. Watch the speed number fall away by itself."
        }
    },
    {
        "id": "move_thing",
        "fnName": "move_thing",
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
        "starter": "def move_thing(thing, seconds):\n    # carry it along\n    pass\n",
        "answer": "def move_thing(thing, seconds):\n    thing[\"x\"] += thing[\"dx\"] * seconds\n    thing[\"y\"] += thing[\"dy\"] * seconds\n    wrap_position(thing)\n",
        "hints": [
            "Two lines of adding, then one call.",
            "Do not forget to multiply by seconds, or the speed will depend on the frame rate.",
            "wrap_position(thing) goes last, after both moves."
        ],
        "tests": [
            {
                "name": "Something standing still does not move",
                "code": "thing = {'x': 100, 'y': 100, 'dx': 0, 'dy': 0}\nmove_thing(thing, 0.1)\nassert thing['x'] == 100 and thing['y'] == 100"
            },
            {
                "name": "It moves by speed times time",
                "code": "thing = {'x': 100, 'y': 100, 'dx': 60, 'dy': 0}\nmove_thing(thing, 0.5)\nassert abs(thing['x'] - 130) < 0.001, '60 per second for half a second is 30'"
            },
            {
                "name": "Both directions at once",
                "code": "thing = {'x': 100, 'y': 100, 'dx': 40, 'dy': -20}\nmove_thing(thing, 1)\nassert abs(thing['x'] - 140) < 0.001\nassert abs(thing['y'] - 80) < 0.001"
            },
            {
                "name": "Time really matters",
                "code": "brief = {'x': 0, 'y': 0, 'dx': 100, 'dy': 0}\nlonger = {'x': 0, 'y': 0, 'dx': 100, 'dy': 0}\nmove_thing(brief, 0.01)\nmove_thing(longer, 0.02)\nassert abs(longer['x'] - brief['x'] * 2) < 0.001, 'did you multiply by seconds?'"
            },
            {
                "name": "It wraps at the edge",
                "code": "thing = {'x': FIELD_WIDTH - 5, 'y': 100, 'dx': 100, 'dy': 0}\nmove_thing(thing, 0.5)\nassert thing['x'] < 100, 'it should have come back on the left'"
            },
            {
                "name": "It works on a rock just as well as a ship",
                "code": "rock = {'x': 10, 'y': 10, 'dx': -50, 'dy': -50, 'size': 3}\nmove_thing(rock, 1)\nassert rock['x'] > 200 and rock['y'] > 200\nassert rock['size'] == 3, 'it should not have disturbed anything else on the rock'"
            },
            {
                "name": "A hundred frames go exactly as far as you would expect",
                "code": "thing = {'x': 0, 'y': 170, 'dx': 50, 'dy': 0}\ntravelled = 0\nfor frame in range(100):\n    before = thing['x']\n    move_thing(thing, 0.02)\n    step = thing['x'] - before\n    if step < 0:\n        step += FIELD_WIDTH\n    travelled += step\nassert abs(travelled - 100) < 0.01, f'it covered {travelled:.2f} pixels, expected 100'"
            }
        ],
        "demo": {
            "kind": "drift",
            "caption": "Everything you can see is being carried along by this one function."
        }
    },
    {
        "id": "make_bullet",
        "fnName": "make_bullet",
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
        "starter": "def make_bullet(ship):\n    return {\"x\": 0, \"y\": 0, \"dx\": 0, \"dy\": 0, \"life\": 0}\n",
        "answer": "def make_bullet(ship):\n    nose = point_from(ship[\"x\"], ship[\"y\"], ship[\"angle\"], SHIP_RADIUS + 3)\n    flight = point_from(0, 0, ship[\"angle\"], BULLET_SPEED)\n\n    return {\n        \"x\": nose[\"x\"],\n        \"y\": nose[\"y\"],\n        \"dx\": flight[\"x\"] + ship[\"dx\"],\n        \"dy\": flight[\"y\"] + ship[\"dy\"],\n        \"life\": BULLET_LIFE,\n    }\n",
        "hints": [
            "Two calls to point_from: one for where it starts, one for how fast it flies.",
            "Starting point_from at 0, 0 turns an angle and a speed into a dx and a dy.",
            "'dx': flight['x'] + ship['dx'] — do not forget to add the ship's own speed."
        ],
        "tests": [
            {
                "name": "It starts in front of the ship, not on it",
                "code": "ship = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nbullet = make_bullet(ship)\nassert bullet['x'] > 100\nassert abs(bullet['x'] - (100 + SHIP_RADIUS + 3)) < 0.001"
            },
            {
                "name": "It flies the way the ship points",
                "code": "ship = {'x': 100, 'y': 100, 'angle': -math.pi / 2, 'dx': 0, 'dy': 0}\nbullet = make_bullet(ship)\nassert bullet['dy'] < 0, 'a ship pointing up should shoot upwards'\nassert bullet['y'] < 100"
            },
            {
                "name": "It flies at BULLET_SPEED when the ship is still",
                "code": "ship = {'x': 100, 'y': 100, 'angle': 1.2, 'dx': 0, 'dy': 0}\nbullet = make_bullet(ship)\nassert abs(speed_of(bullet) - BULLET_SPEED) < 0.001"
            },
            {
                "name": "Firing while racing forwards throws it faster",
                "code": "still = make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0})\nracing = make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': 200, 'dy': 0})\nassert racing['dx'] > still['dx']\nassert abs(racing['dx'] - (still['dx'] + 200)) < 0.001"
            },
            {
                "name": "Firing while flying backwards throws it slower",
                "code": "bullet = make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': -100, 'dy': 0})\nassert abs(bullet['dx'] - (BULLET_SPEED - 100)) < 0.001"
            },
            {
                "name": "It has a life to run down",
                "code": "bullet = make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0})\nassert bullet['life'] == BULLET_LIFE"
            },
            {
                "name": "It fires correctly whichever way the ship faces",
                "code": "for step in range(12):\n    angle = step / 12 * math.pi * 2\n    ship = {'x': 170, 'y': 170, 'angle': angle, 'dx': 0, 'dy': 0}\n    bullet = make_bullet(ship)\n    assert abs(distance_between(ship, bullet) - (SHIP_RADIUS + 3)) < 0.001, f'angle {angle:.2f} started the shot in the wrong place'\n    assert abs(speed_of(bullet) - BULLET_SPEED) < 0.001"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Press Fire. Every shot leaves the nose, pointing wherever you are."
        }
    },
    {
        "id": "fire_bullet",
        "fnName": "fire_bullet",
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
        "starter": "def fire_bullet(state):\n    return False\n",
        "answer": "def fire_bullet(state):\n    if state[\"is_over\"] or state[\"is_paused\"] or len(state[\"bullets\"]) >= MAX_BULLETS:\n        return False\n    state[\"bullets\"].append(make_bullet(state[\"ship\"]))\n    state[\"shots\"] += 1\n    return True\n",
        "hints": [
            "One if with three tests joined by or.",
            "len(state['bullets']) >= MAX_BULLETS is the 'too many in the air' test.",
            "After the guard: append, count, return True."
        ],
        "tests": [
            {
                "name": "A fresh game can fire",
                "code": "state = create_game()\nassert fire_bullet(state) is True\nassert len(state['bullets']) == 1"
            },
            {
                "name": "The shot counter goes up",
                "code": "state = create_game()\nfire_bullet(state)\nassert state['shots'] == 1"
            },
            {
                "name": "A finished game cannot fire",
                "code": "state = create_game()\nstate['is_over'] = True\nassert fire_bullet(state) is False\nassert state['bullets'] == []"
            },
            {
                "name": "A paused game cannot fire",
                "code": "state = create_game()\nstate['is_paused'] = True\nassert fire_bullet(state) is False\nassert state['bullets'] == []"
            },
            {
                "name": "Only MAX_BULLETS may be in the air",
                "code": "state = create_game()\nfor i in range(MAX_BULLETS):\n    assert fire_bullet(state) is True, f'shot {i + 1} should have been allowed'\nassert fire_bullet(state) is False\nassert len(state['bullets']) == MAX_BULLETS"
            },
            {
                "name": "A refused shot is not counted",
                "code": "state = create_game()\nstate['is_paused'] = True\nfire_bullet(state)\nassert state['shots'] == 0, 'a refused shot is not a shot'"
            },
            {
                "name": "Once a bullet clears, you may fire again",
                "code": "state = create_game()\nfor i in range(MAX_BULLETS):\n    fire_bullet(state)\nstate['bullets'].pop()\nassert fire_bullet(state) is True"
            },
            {
                "name": "Holding the button down never floods the field",
                "code": "state = create_game()\nfor press in range(500):\n    fire_bullet(state)\n    assert len(state['bullets']) <= MAX_BULLETS, f\"press {press}: {len(state['bullets'])} bullets are flying\""
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Hammer the Fire button. Only four shots are ever in the air at once."
        }
    },
    {
        "id": "age_bullets",
        "fnName": "age_bullets",
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
        "starter": "def age_bullets(bullets, seconds):\n    return bullets\n",
        "answer": "def age_bullets(bullets, seconds):\n    flying = []\n    for bullet in bullets:\n        bullet[\"life\"] -= seconds\n        if bullet[\"life\"] > 0:\n            flying.append(bullet)\n    return flying\n",
        "hints": [
            "Make an empty list first, and append the survivors to it.",
            "Take the time off EVERY bullet, then decide whether to keep it.",
            "return flying — the caller does state['bullets'] = age_bullets(...)."
        ],
        "tests": [
            {
                "name": "An empty list stays empty",
                "code": "assert age_bullets([], 0.1) == []"
            },
            {
                "name": "A young bullet survives",
                "code": "flying = age_bullets([{'life': 1.0}], 0.1)\nassert len(flying) == 1"
            },
            {
                "name": "Its life really does go down",
                "code": "flying = age_bullets([{'life': 1.0}], 0.25)\nassert abs(flying[0]['life'] - 0.75) < 0.001"
            },
            {
                "name": "A spent bullet is dropped",
                "code": "flying = age_bullets([{'life': 0.05}], 0.1)\nassert flying == []"
            },
            {
                "name": "It keeps the living and drops the dead, in one pass",
                "code": "flying = age_bullets([{'life': 0.05}, {'life': 1.0}, {'life': 0.02}, {'life': 0.5}], 0.1)\nassert len(flying) == 2, f'kept {len(flying)}, expected 2'"
            },
            {
                "name": "The survivors keep their order",
                "code": "flying = age_bullets([{'life': 1.0, 'tag': 'a'}, {'life': 0.01, 'tag': 'b'}, {'life': 1.0, 'tag': 'c'}], 0.1)\nassert [b['tag'] for b in flying] == ['a', 'c']"
            },
            {
                "name": "Nothing is ever skipped",
                "code": "bullets = [{'life': 0.05, 'tag': i} for i in range(6)]\nflying = age_bullets(bullets, 0.1)\nassert flying == [], f'six spent bullets should all go — {len(flying)} survived'"
            },
            {
                "name": "A bullet lives for about BULLET_LIFE seconds",
                "code": "bullets = [make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0})]\nframes = 0\nfor i in range(1000):\n    if not bullets:\n        break\n    bullets = age_bullets(bullets, 0.02)\n    frames += 1\nlasted = frames * 0.02\nassert abs(lasted - BULLET_LIFE) < 0.05, f'it lasted {lasted:.2f} seconds, expected about {BULLET_LIFE}'"
            }
        ],
        "demo": {
            "kind": "shoot",
            "caption": "Fire and watch. Each shot fades out after about a second — that is its life running down."
        }
    },
    {
        "id": "make_rock",
        "fnName": "make_rock",
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
        "starter": "def make_rock(x, y, size):\n    return {\"x\": x, \"y\": y, \"size\": size, \"dx\": 0, \"dy\": 0, \"spin\": 0, \"wobble\": 0}\n",
        "answer": "def make_rock(x, y, size):\n    angle = random.uniform(0, math.pi * 2)\n    drift = point_from(0, 0, angle, ROCK_SPEED[size])\n    return {\n        \"x\": x, \"y\": y, \"size\": size,\n        \"dx\": drift[\"x\"], \"dy\": drift[\"y\"],\n        \"spin\": random.uniform(-1, 1),\n        \"wobble\": random.randrange(1000),\n    }\n",
        "hints": [
            "random.uniform(0, math.pi * 2) picks any direction at all.",
            "point_from(0, 0, angle, ROCK_SPEED[size]) turns that into dx and dy.",
            "random.uniform(-1, 1) is the tidy way to get the spin."
        ],
        "tests": [
            {
                "name": "It starts where you put it",
                "code": "rock = make_rock(50, 70, 3)\nassert rock['x'] == 50 and rock['y'] == 70"
            },
            {
                "name": "It remembers its size",
                "code": "assert make_rock(0, 0, 2)['size'] == 2"
            },
            {
                "name": "It is always moving",
                "code": "for i in range(30):\n    assert speed_of(make_rock(0, 0, 3)) > 0, 'a rock that does not drift is no fun'"
            },
            {
                "name": "It drifts at exactly the speed for its size",
                "code": "for size in (1, 2, 3):\n    for i in range(20):\n        rock = make_rock(0, 0, size)\n        assert abs(speed_of(rock) - ROCK_SPEED[size]) < 0.001, f'size {size} drifted at {speed_of(rock):.1f}'"
            },
            {
                "name": "Small rocks are faster than big ones",
                "code": "assert ROCK_SPEED[1] > ROCK_SPEED[3], 'that is what makes the last few rocks the hard part'"
            },
            {
                "name": "Two rocks made the same way still go different ways",
                "code": "first = make_rock(0, 0, 3)\ndifferent = sum(1 for i in range(20) if abs(make_rock(0, 0, 3)['dx'] - first['dx']) > 0.001)\nassert different > 15, f'only {different} of 20 drifted differently — is the angle really random?'"
            },
            {
                "name": "Over many rocks, every direction turns up",
                "code": "rocks = [make_rock(0, 0, 3) for i in range(400)]\nleft = sum(1 for r in rocks if r['dx'] < 0)\nup = sum(1 for r in rocks if r['dy'] < 0)\nassert 100 < left < 300, f'sideways split was {left}/400'\nassert 100 < up < 300, f'up-down split was {up}/400'"
            },
            {
                "name": "The spin stays between -1 and 1",
                "code": "for i in range(100):\n    rock = make_rock(0, 0, 3)\n    assert -1 <= rock['spin'] <= 1, f\"spin is {rock['spin']}\""
            }
        ],
        "demo": {
            "kind": "rock",
            "caption": "Press New Rock a few times. Same spot, same speed — a different heading every time."
        }
    },
    {
        "id": "rock_points",
        "fnName": "rock_points",
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
        "starter": "def rock_points(rock):\n    return []\n",
        "answer": "def rock_points(rock):\n    radius = ROCK_RADIUS[rock[\"size\"]]\n    points = []\n\n    for i in range(ROCK_CORNERS):\n        angle = i / ROCK_CORNERS * math.pi * 2 + rock[\"wobble\"]\n        lumpy = radius * (0.78 + 0.22 * abs(math.sin(i * 2.3 + rock[\"wobble\"])))\n        points.append(point_from(rock[\"x\"], rock[\"y\"], angle, lumpy))\n    return points\n",
        "hints": [
            "i / ROCK_CORNERS * math.pi * 2 spreads the corners evenly round the circle.",
            "Adding rock['wobble'] to the angle is what makes the rock tumble as it spins.",
            "points.append(point_from(rock['x'], rock['y'], angle, lumpy))"
        ],
        "tests": [
            {
                "name": "It gives back the right number of corners",
                "code": "points = rock_points({'x': 100, 'y': 100, 'size': 3, 'wobble': 0})\nassert len(points) == ROCK_CORNERS, f'got {len(points)}, expected {ROCK_CORNERS}'"
            },
            {
                "name": "Every corner is a proper point",
                "code": "for p in rock_points({'x': 100, 'y': 100, 'size': 3, 'wobble': 0}):\n    assert 'x' in p and 'y' in p, f'a corner came back as {p}'"
            },
            {
                "name": "The corners sit around the rock, not somewhere else",
                "code": "rock = {'x': 200, 'y': 150, 'size': 3, 'wobble': 0}\nfor p in rock_points(rock):\n    assert distance_between(rock, p) <= ROCK_RADIUS[3] + 0.001, 'a corner escaped the radius'"
            },
            {
                "name": "It is lumpy, not a perfect circle",
                "code": "rock = {'x': 100, 'y': 100, 'size': 3, 'wobble': 0}\naways = [distance_between(rock, p) for p in rock_points(rock)]\nassert max(aways) - min(aways) > 2, 'every corner is the same distance out — that is a circle, not a rock'"
            },
            {
                "name": "But not TOO lumpy",
                "code": "rock = {'x': 100, 'y': 100, 'size': 3, 'wobble': 0}\nfor p in rock_points(rock):\n    assert distance_between(rock, p) > ROCK_RADIUS[3] * 0.7, 'a corner collapsed almost into the middle'"
            },
            {
                "name": "A small rock makes a small shape",
                "code": "reach = lambda pts: max(math.sqrt(p['x'] ** 2 + p['y'] ** 2) for p in pts)\nbig = rock_points({'x': 0, 'y': 0, 'size': 3, 'wobble': 4})\nsmall = rock_points({'x': 0, 'y': 0, 'size': 1, 'wobble': 4})\nassert reach(small) < reach(big)"
            },
            {
                "name": "Two rocks with different wobbles are different shapes",
                "code": "a = rock_points({'x': 0, 'y': 0, 'size': 3, 'wobble': 0})\nb = rock_points({'x': 0, 'y': 0, 'size': 3, 'wobble': 7})\nmoved = sum(1 for i in range(len(a)) if abs(a[i]['x'] - b[i]['x']) > 0.5)\nassert moved > 5, f'only {moved} corners differ — is the wobble really in the sum?'"
            },
            {
                "name": "The same rock always gives the same shape",
                "code": "rock = {'x': 30, 'y': 40, 'size': 2, 'wobble': 3.7}\nassert rock_points(rock) == rock_points(rock), 'a rock must not shimmer'"
            },
            {
                "name": "Moving the rock moves every corner with it",
                "code": "here = rock_points({'x': 0, 'y': 0, 'size': 3, 'wobble': 2})\nthere = rock_points({'x': 50, 'y': 20, 'size': 3, 'wobble': 2})\nfor i in range(len(here)):\n    assert abs(there[i]['x'] - here[i]['x'] - 50) < 0.001, f'corner {i} did not travel with the rock'\n    assert abs(there[i]['y'] - here[i]['y'] - 20) < 0.001"
            }
        ],
        "demo": {
            "kind": "rock",
            "caption": "The corners are marked. Press Spin and watch the wobble carry them round."
        }
    },
    {
        "id": "split_rock",
        "fnName": "split_rock",
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
        "starter": "def split_rock(rock):\n    return []\n",
        "answer": "def split_rock(rock):\n    if rock[\"size\"] <= 1:\n        return []\n    return [make_rock(rock[\"x\"], rock[\"y\"], rock[\"size\"] - 1),\n            make_rock(rock[\"x\"], rock[\"y\"], rock[\"size\"] - 1)]\n",
        "hints": [
            "A guard clause first: the smallest rocks leave nothing behind.",
            "Two calls to make_rock, both at the old rock's x and y.",
            "rock['size'] - 1 is the size of the pieces."
        ],
        "tests": [
            {
                "name": "The smallest rock leaves nothing",
                "code": "assert split_rock({'x': 10, 'y': 10, 'size': 1}) == []"
            },
            {
                "name": "A big rock leaves exactly two",
                "code": "assert len(split_rock({'x': 10, 'y': 10, 'size': 3})) == 2"
            },
            {
                "name": "A medium rock leaves exactly two as well",
                "code": "assert len(split_rock({'x': 10, 'y': 10, 'size': 2})) == 2"
            },
            {
                "name": "The pieces are one size smaller",
                "code": "pieces = split_rock({'x': 10, 'y': 10, 'size': 3})\nassert [p['size'] for p in pieces] == [2, 2]"
            },
            {
                "name": "They start where the old rock was",
                "code": "pieces = split_rock({'x': 123, 'y': 45, 'size': 2})\nfor piece in pieces:\n    assert piece['x'] == 123 and piece['y'] == 45"
            },
            {
                "name": "The two pieces drift apart",
                "code": "apart = 0\nfor i in range(20):\n    pieces = split_rock({'x': 10, 'y': 10, 'size': 3})\n    if abs(pieces[0]['dx'] - pieces[1]['dx']) > 0.001:\n        apart += 1\nassert apart > 15, f'only {apart} of 20 splits sent the pieces different ways'"
            },
            {
                "name": "One big rock is really seven rocks",
                "code": "all_rocks = [{'x': 0, 'y': 0, 'size': 3}]\ntotal = 0\nwhile all_rocks:\n    rock = all_rocks.pop()\n    total += 1\n    all_rocks.extend(split_rock(rock))\nassert total == 7, f'a big rock took {total} shots to clear, expected 7'"
            },
            {
                "name": "It never touches the rock it was given",
                "code": "rock = {'x': 10, 'y': 10, 'size': 3}\nsplit_rock(rock)\nassert rock['size'] == 3, 'split_rock should not change the old rock'"
            }
        ],
        "demo": {
            "kind": "split",
            "caption": "Shoot the big rock. Two mediums appear in its place, then four smalls."
        }
    },
    {
        "id": "hit_rocks",
        "fnName": "hit_rocks",
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
        "starter": "def hit_rocks(state):\n    return 0\n",
        "answer": "def hit_rocks(state):\n    surviving = []\n    hits = 0\n\n    for bullet in state[\"bullets\"]:\n        hit_index = -1\n        for r, rock in enumerate(state[\"rocks\"]):\n            if touches(bullet, rock, 1, ROCK_RADIUS[rock[\"size\"]]):\n                hit_index = r\n                break\n\n        if hit_index == -1:\n            surviving.append(bullet)\n        else:\n            rock = state[\"rocks\"].pop(hit_index)\n            state[\"score\"] += ROCK_SCORE[rock[\"size\"]]\n            state[\"rocks\"].extend(split_rock(rock))\n            hits += 1\n\n    state[\"bullets\"] = surviving\n    return hits\n",
        "hints": [
            "enumerate gives you the index and the rock together.",
            "break as soon as you find a hit — one bullet, one rock.",
            "state['rocks'].pop(hit_index) takes the rock out and hands it to you."
        ],
        "tests": [
            {
                "name": "Nothing happens when the bullets are nowhere near",
                "code": "state = create_game()\nstate['rocks'] = [{'x': 300, 'y': 300, 'size': 3, 'wobble': 0}]\nstate['bullets'] = [{'x': 10, 'y': 10, 'life': 1}]\nassert hit_rocks(state) == 0\nassert len(state['bullets']) == 1, 'a bullet that missed should still be flying'"
            },
            {
                "name": "A hit is counted",
                "code": "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nassert hit_rocks(state) == 1"
            },
            {
                "name": "The bullet is used up",
                "code": "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nhit_rocks(state)\nassert state['bullets'] == []"
            },
            {
                "name": "A big rock becomes two mediums",
                "code": "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nhit_rocks(state)\nassert len(state['rocks']) == 2\nassert state['rocks'][0]['size'] == 2"
            },
            {
                "name": "A small rock just disappears",
                "code": "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 1, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nhit_rocks(state)\nassert state['rocks'] == []"
            },
            {
                "name": "The score goes up by the right amount",
                "code": "state = create_game()\nstate['score'] = 0\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 1, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nhit_rocks(state)\nassert state['score'] == ROCK_SCORE[1]"
            },
            {
                "name": "One bullet can only break ONE rock",
                "code": "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 1, 'wobble': 0}, {'x': 102, 'y': 100, 'size': 1, 'wobble': 0}]\nstate['bullets'] = [{'x': 101, 'y': 100, 'life': 1}]\nassert hit_rocks(state) == 1, 'did you break out of the inner loop?'\nassert len(state['rocks']) == 1"
            },
            {
                "name": "Two bullets can break two rocks",
                "code": "state = create_game()\nstate['rocks'] = [{'x': 40, 'y': 40, 'size': 1, 'wobble': 0}, {'x': 200, 'y': 200, 'size': 1, 'wobble': 0}]\nstate['bullets'] = [{'x': 40, 'y': 40, 'life': 1}, {'x': 200, 'y': 200, 'life': 1}]\nassert hit_rocks(state) == 2\nassert state['rocks'] == []"
            },
            {
                "name": "A patient player can always clear the field",
                "code": "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3, 'wobble': 0}]\nfor shot in range(40):\n    if not state['rocks']:\n        break\n    state['bullets'] = [{'x': state['rocks'][0]['x'], 'y': state['rocks'][0]['y'], 'life': 1}]\n    hit_rocks(state)\nassert state['rocks'] == [], 'rocks are still up there after 40 point-blank shots'"
            }
        ],
        "demo": {
            "kind": "split",
            "caption": "Fire away. Every hit splits a rock and pushes the score up."
        }
    },
    {
        "id": "ship_is_hit",
        "fnName": "ship_is_hit",
        "title": "Has the ship been caught?",
        "adds": "Rocks are dangerous again.",
        "intro": "<p>The other collision. Ask whether <em>any</em> rock is touching the ship &mdash; and both languages have a word for that exact question, so you do not need a loop with a flag in it.</p><p>But before you check anything: if the shield is still up, the answer is <code>false</code> whatever the rocks are doing. That is what stops you dying instantly on a respawn, with a rock sitting where the ship reappears. Another guard clause, and the most important one in the game.</p><p><strong>In Python:</strong> <code>any(test for item in list)</code> reads almost exactly like the sentence you would say out loud.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "true if a rock has caught the ship",
            "algorithm": [
                "If the shield is still running, give back false straight away.",
                "Otherwise ask whether ANY rock touches the ship.",
                "Use each rock's own radius — a big rock is a bigger target."
            ]
        },
        "starter": "def ship_is_hit(state):\n    return False\n",
        "answer": "def ship_is_hit(state):\n    if state[\"shield\"] > 0:\n        return False\n    return any(touches(state[\"ship\"], rock, SHIP_RADIUS, ROCK_RADIUS[rock[\"size\"]])\n               for rock in state[\"rocks\"])\n",
        "hints": [
            "The shield guard goes first, before you look at a single rock.",
            "any(... for rock in state['rocks']) is true when at least one passes.",
            "touches(state['ship'], rock, SHIP_RADIUS, ROCK_RADIUS[rock['size']])"
        ],
        "tests": [
            {
                "name": "An empty sky is safe",
                "code": "state = create_game()\nstate['shield'] = 0\nstate['rocks'] = []\nassert ship_is_hit(state) is False"
            },
            {
                "name": "A distant rock is safe",
                "code": "state = create_game()\nstate['shield'] = 0\nstate['ship'] = {'x': 20, 'y': 20, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 300, 'y': 300, 'size': 3}]\nassert ship_is_hit(state) is False"
            },
            {
                "name": "A rock on top of the ship is a hit",
                "code": "state = create_game()\nstate['shield'] = 0\nstate['ship'] = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3}]\nassert ship_is_hit(state) is True"
            },
            {
                "name": "The shield saves you",
                "code": "state = create_game()\nstate['shield'] = 1.5\nstate['ship'] = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3}]\nassert ship_is_hit(state) is False, 'the shield must beat every rock'"
            },
            {
                "name": "Any one of many rocks is enough",
                "code": "state = create_game()\nstate['shield'] = 0\nstate['ship'] = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 10, 'y': 10, 'size': 1}, {'x': 300, 'y': 300, 'size': 1}, {'x': 100, 'y': 100, 'size': 1}]\nassert ship_is_hit(state) is True"
            },
            {
                "name": "A big rock is a bigger target",
                "code": "state = create_game()\nstate['shield'] = 0\nstate['ship'] = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 100 + SHIP_RADIUS + 20, 'y': 100, 'size': 3}]\nassert ship_is_hit(state) is True\nstate['rocks'] = [{'x': 100 + SHIP_RADIUS + 20, 'y': 100, 'size': 1}]\nassert ship_is_hit(state) is False"
            },
            {
                "name": "It does not disturb anything",
                "code": "state = create_game()\nstate['shield'] = 0\nbefore = len(state['rocks'])\nship_is_hit(state)\nassert len(state['rocks']) == before, 'a question should not change the game'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "A robot flies this one. Watch the lives fall when it gets careless."
        }
    },
    {
        "id": "start_wave",
        "fnName": "start_wave",
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
        "starter": "def start_wave(state):\n    # a ring of rocks\n    pass\n",
        "answer": "def start_wave(state):\n    state[\"rocks\"] = []\n    count = 3 + state[\"wave\"]\n    for i in range(count):\n        angle = i / count * math.pi * 2\n        spot = point_from(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, angle, 130)\n        state[\"rocks\"].append(make_rock(spot[\"x\"], spot[\"y\"], BIG_ROCK))\n    state[\"bullets\"] = []\n",
        "hints": [
            "i / count * math.pi * 2 spreads them evenly round the circle.",
            "point_from from the middle of the field, 130 pixels out.",
            "Every rock in a new wave is a BIG_ROCK."
        ],
        "tests": [
            {
                "name": "Wave 1 has four rocks",
                "code": "state = create_game()\nstate['wave'] = 1\nstart_wave(state)\nassert len(state['rocks']) == 4"
            },
            {
                "name": "Later waves have more",
                "code": "state = create_game()\nstate['wave'] = 5\nstart_wave(state)\nassert len(state['rocks']) == 8, '3 + 5 is 8'"
            },
            {
                "name": "They are all big ones",
                "code": "state = create_game()\nstate['wave'] = 2\nstart_wave(state)\nassert all(r['size'] == BIG_ROCK for r in state['rocks'])"
            },
            {
                "name": "Old bullets are cleared away",
                "code": "state = create_game()\nstate['bullets'] = [{'x': 1, 'y': 1, 'life': 1}]\nstart_wave(state)\nassert state['bullets'] == []"
            },
            {
                "name": "They start well away from the middle",
                "code": "state = create_game()\nstate['wave'] = 3\nstart_wave(state)\nmiddle = {'x': FIELD_WIDTH / 2, 'y': FIELD_HEIGHT / 2}\nfor rock in state['rocks']:\n    assert distance_between(middle, rock) > 100, 'a rock started too close to the ship'"
            },
            {
                "name": "They are spread out, not stacked up",
                "code": "state = create_game()\nstate['wave'] = 3\nstart_wave(state)\nrocks = state['rocks']\nfor i in range(len(rocks)):\n    for j in range(i + 1, len(rocks)):\n        assert distance_between(rocks[i], rocks[j]) > 40, f'rocks {i} and {j} started on top of each other'"
            },
            {
                "name": "A new wave replaces the old rocks, it does not add to them",
                "code": "state = create_game()\nstate['wave'] = 1\nstart_wave(state)\nstart_wave(state)\nassert len(state['rocks']) == 4, 'did you forget to empty the list first?'"
            },
            {
                "name": "Every wave is harder than the one before",
                "code": "last = 0\nfor wave in range(1, 7):\n    state = create_game()\n    state['wave'] = wave\n    start_wave(state)\n    assert len(state['rocks']) > last, f'wave {wave} was no harder than wave {wave - 1}'\n    last = len(state['rocks'])"
            }
        ],
        "demo": {
            "kind": "wave",
            "caption": "Press Next Wave. Each one is a bigger ring than the last."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "The controls",
        "adds": "Asteroids is finished. Go and fly it.",
        "intro": "<p>One last function, and the easiest of the twenty: turn a key into the <em>name</em> of an action.</p><p>Note what it does not do. It does not turn the ship or fire a shot &mdash; it just says <code>'left'</code>, or <code>'fire'</code>, or nothing at all. That one layer of indirection is why the on-screen buttons, the keyboard and an Xbox controller can all drive the same game without any of them knowing about the others.</p><p>Arrow keys and WASD both work, because different people reach for different keys. Anything else gives back nothing, and nothing happens.</p>",
        "spec": {
            "input": "key — the key that was pressed, like 'ArrowLeft' or 'w'",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "Make a dictionary from lower-case key names to action names.",
                "Look the key up with .get, which gives back None when it is not there.",
                "That is the whole function - a table instead of six ifs."
            ]
        },
        "starter": "def action_for_key(key):\n    return None\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"arrowup\": \"thrust\", \"w\": \"thrust\",\n        \" \": \"fire\", \"spacebar\": \"fire\",\n        \"p\": \"pause\", \"r\": \"restart\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "A dictionary is much tidier than six ifs here.",
            "keys.get(name) gives back None when the name is not in the dictionary.",
            "Remember str(key).lower() so 'W' and 'w' both work."
        ],
        "tests": [
            {
                "name": "The arrow keys steer",
                "code": "assert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'\nassert action_for_key('ArrowUp') == 'thrust'"
            },
            {
                "name": "WASD works too",
                "code": "assert action_for_key('a') == 'left'\nassert action_for_key('d') == 'right'\nassert action_for_key('w') == 'thrust'"
            },
            {
                "name": "Capitals work as well",
                "code": "assert action_for_key('W') == 'thrust', 'Caps Lock should not break the game'\nassert action_for_key('ArrowLEFT') == 'left'"
            },
            {
                "name": "Space fires",
                "code": "assert action_for_key(' ') == 'fire'\nassert action_for_key('Spacebar') == 'fire'"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert action_for_key('p') == 'pause'\nassert action_for_key('r') == 'restart'"
            },
            {
                "name": "Everything else does nothing",
                "code": "for key in ['q', 'z', 'Enter', 'Shift', '7', 'ArrowDown']:\n    assert action_for_key(key) is None, f'{key} should not do anything'"
            },
            {
                "name": "Every action the game knows about has a key",
                "code": "found = [action_for_key(k) for k in ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'p', 'r']]\nfor action in ['left', 'right', 'thrust', 'fire', 'pause', 'restart']:\n    assert action in found, f'nothing is wired up to {action}'"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Twenty functions, one game. Arrows or WASD to fly, space to shoot."
        }
    }
];
