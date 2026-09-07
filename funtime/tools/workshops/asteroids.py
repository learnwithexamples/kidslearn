"""The twenty steps of "Build Asteroids", in both languages.

This is the longest workshop in the collection, and deliberately so. Asteroids
touches more different kinds of programming than any other game here:
trigonometry, vectors, angles that wrap round, lists that are filtered and
rebuilt, nested loops, lookup tables and random numbers. Twenty small steps
give each of those a turn, instead of hiding four ideas inside one big
function.

Several steps come with a drawing. They are inline SVG - no image files, no
downloads - and they are there because a sentence about cos and sin is much
harder work than a picture of a triangle.
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
from steps import step, write_workshop


def fig(caption, svg):
    """Wrap a drawing and its caption so every figure looks the same."""
    return ('<figure class="step-figure">' + svg
            + '<figcaption>' + caption + '</figcaption></figure>')


# A few pieces every drawing uses, so they all match: thin black lines, a
# monospace label, and a dashed line for "this is a measurement, not a thing".
SVG_OPEN = ('<svg viewBox="0 0 360 200" width="360" height="200" '
            'xmlns="http://www.w3.org/2000/svg" role="img">'
            '<defs><marker id="tip" markerWidth="9" markerHeight="9" refX="7" refY="3" '
            'orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#111"/></marker></defs>')
SVG_CLOSE = '</svg>'


def svg(body, height=200):
    """One drawing, at the standard size."""
    return (SVG_OPEN.replace('0 0 360 200', '0 0 360 %d' % height)
                    .replace('height="200"', 'height="%d"' % height)
            + body + SVG_CLOSE)


ARROW = ' stroke="#111" stroke-width="2" fill="none" marker-end="url(#tip)"'
LINE = ' stroke="#111" stroke-width="2" fill="none"'
THIN = ' stroke="#111" stroke-width="1" fill="none"'
DASH = ' stroke="#111" stroke-width="1.5" fill="none" stroke-dasharray="5 4"'
FAINT = ' stroke="#bbb" stroke-width="1" fill="none"'
HALO = ' stroke="#ffffff" stroke-width="3.5" paint-order="stroke" stroke-linejoin="round"'
LABEL = ' font-family="monospace" font-size="13" fill="#111"' + HALO
SMALL = ' font-family="monospace" font-size="11" fill="#555"' + HALO


# ------------------------------------------------------------------ drawings

FIG_POINT_FROM = fig(
  "Angle 0 points right. A quarter turn points DOWN, because y grows downwards.",
  svg('<path d="M20,152 L20,186"' + ARROW + '/><text x="26" y="184"' + SMALL + '>y</text>'
      '<path d="M20,152 L52,152"' + ARROW + '/><text x="36" y="147"' + SMALL + '>x</text>'
      '<path d="M55,45 L250,45"' + DASH + '/>'
      '<path d="M250,45 L250,145"' + DASH + '/>'
      '<path d="M55,45 L245,142"' + ARROW + '/>'
      '<path d="M95,45 A40,40 0 0 1 90.6,63.2"' + LINE + '/>'
      '<text x="100" y="63"' + SMALL + '>angle</text>'
      '<text x="156" y="30"' + SMALL + ' text-anchor="middle">cos(angle) x distance</text>'
      '<text x="256" y="96"' + SMALL + '>sin(angle)</text>'
      '<text x="256" y="110"' + SMALL + '>x distance</text>'
      '<text x="108" y="118"' + SMALL + '>distance</text>'
      '<circle cx="55" cy="45" r="4" fill="#111"/>'
      '<text x="18" y="36"' + LABEL + '>(x, y)</text>'
      '<circle cx="250" cy="145" r="4" fill="#111"/>'
      '<text x="196" y="172"' + LABEL + '>{ x, y }</text>'))

FIG_DISTANCE = fig(
  "Two dots make a right triangle. The distance is the long side.",
  svg('<path d="M70,155 L280,155"' + DASH + '/>'
      '<path d="M280,155 L280,55"' + DASH + '/>'
      '<path d="M70,155 L276,57"' + ARROW + '/>'
      '<path d="M264,155 L264,141 L280,141"' + THIN + '/>'
      '<circle cx="70" cy="155" r="4.5" fill="#111"/>'
      '<text x="46" y="150"' + LABEL + '>a</text>'
      '<circle cx="280" cy="55" r="4.5" fill="#111"/>'
      '<text x="292" y="50"' + LABEL + '>b</text>'
      '<text x="175" y="176"' + SMALL + ' text-anchor="middle">across = a.x - b.x</text>'
      '<text x="290" y="104"' + SMALL + '>down =</text>'
      '<text x="290" y="118"' + SMALL + '>a.y - b.y</text>'
      '<text x="64" y="62"' + SMALL + '>sqrt(across x across</text>'
      '<text x="64" y="76"' + SMALL + '>&#160;&#160;&#160;&#160; + down x down)</text>'))

FIG_TOUCHES = fig(
  "Two circles overlap when the gap between their middles is smaller than "
  "their two radii added together.",
  svg('<circle cx="132" cy="96" r="58"' + LINE + '/>'
      '<circle cx="236" cy="96" r="42"' + LINE + '/>'
      '<path d="M132,96 L236,96"' + DASH + '/>'
      '<path d="M132,96 L132,38"' + THIN + '/>'
      '<path d="M236,96 L236,54"' + THIN + '/>'
      '<circle cx="132" cy="96" r="3.5" fill="#111"/>'
      '<circle cx="236" cy="96" r="3.5" fill="#111"/>'
      '<text x="184" y="88"' + SMALL + ' text-anchor="middle">distance</text>'
      '<text x="96" y="32"' + SMALL + '>radiusA</text>'
      '<text x="244" y="50"' + SMALL + '>radiusB</text>'
      '<text x="180" y="186"' + SMALL + ' text-anchor="middle">'
      'touching when distance &lt; radiusA + radiusB</text>'))

FIG_WRAP = fig(
  "The field is a loop. Leave by the right edge and you are back at the left "
  "edge, at the very same height.",
  svg('<rect x="62" y="46" width="238" height="102"' + LINE + '/>'
      '<path d="M330,86 Q350,178 181,181 Q12,178 32,86"' + DASH + '/>'
      '<path d="M210,86 L328,86"' + ARROW + '/>'
      '<path d="M34,86 L120,86"' + ARROW + '/>'
      '<circle cx="210" cy="86" r="4" fill="#111"/>'
      '<text x="62" y="38"' + SMALL + '>x = 0</text>'
      '<text x="298" y="38"' + SMALL + ' text-anchor="end">x = FIELD_WIDTH</text>'))


STEPS = [

step("point_from", "pointFrom", "point_from",
  "Which way is forward?", "The ship knows where its nose is.",
  "<p>The ship points somewhere &mdash; an <strong>angle</strong> &mdash; and the game constantly needs to turn that into an actual place: where is the nose? which way does a shot fly? where does a rock drift?</p>"
  "<p>That is what <code>cos</code> and <code>sin</code> are for, and you only need to learn them once. <code>cos(angle)</code> is how much of the direction is sideways, and <code>sin(angle)</code> is how much is up and down. Multiply each by the distance and add them on.</p>"
  + FIG_POINT_FROM +
  "<p>This one function gets used <strong>eight</strong> times before the game is finished. Get it right now and a lot of later steps become one line.</p>",
  "x, y — where you start. angle — which way, in radians. distance — how far.",
  "a point: { x, y }",
  ["The new x is x + cos(angle) × distance.",
   "The new y is y + sin(angle) × distance.",
   "Give both back together."],
  js=dict(starter="function pointFrom(x, y, angle, distance) {\n    return { x: x, y: y };\n}\n",
    answer="function pointFrom(x, y, angle, distance) {\n    return {\n        x: x + Math.cos(angle) * distance,\n        y: y + Math.sin(angle) * distance\n    };\n}\n",
    hints=["Math.cos and Math.sin both want the angle in radians, which is what we have.",
           "cos goes with x, sin goes with y. Always that way round.",
           "x: x + Math.cos(angle) * distance"],
    tests=[("Angle 0 goes to the right",
            "const p = pointFrom(0, 0, 0, 10);\nassert(Math.abs(p.x - 10) < 0.001, 'x is ' + p.x);\nassert(Math.abs(p.y) < 0.001, 'y is ' + p.y + ' — angle 0 should not move up or down at all');"),
           ("A quarter turn goes DOWN",
            "const p = pointFrom(0, 0, Math.PI / 2, 10);\nassert(Math.abs(p.x) < 0.001);\nassert(Math.abs(p.y - 10) < 0.001, 'y is ' + p.y + ' — on a canvas, y grows downwards');"),
           ("Half a turn goes left",
            "const p = pointFrom(0, 0, Math.PI, 10);\nassert(Math.abs(p.x + 10) < 0.001, 'x is ' + p.x);"),
           ("Three quarters goes UP",
            "const p = pointFrom(0, 0, -Math.PI / 2, 10);\nassert(Math.abs(p.y + 10) < 0.001, 'y is ' + p.y);"),
           ("It starts from where you tell it",
            "const p = pointFrom(100, 50, 0, 10);\nassert(Math.abs(p.x - 110) < 0.001);\nassert(Math.abs(p.y - 50) < 0.001);"),
           ("Twice the distance is twice as far",
            "const near = pointFrom(0, 0, 1, 10);\nconst far = pointFrom(0, 0, 1, 20);\nassert(Math.abs(far.x - near.x * 2) < 0.001);\nassert(Math.abs(far.y - near.y * 2) < 0.001);"),
           ("Every angle lands the right distance away",
            "for (let step = 0; step < 16; step++) {\n    const angle = step / 16 * Math.PI * 2;\n    const p = pointFrom(0, 0, angle, 25);\n    const away = Math.sqrt(p.x * p.x + p.y * p.y);\n    assert(Math.abs(away - 25) < 0.001, 'angle ' + angle.toFixed(2) + ' landed ' + away.toFixed(1) + ' away, not 25');\n}"),
           ("Zero distance does not move at all",
            "const p = pointFrom(30, 40, 2.1, 0);\nassert(Math.abs(p.x - 30) < 0.001 && Math.abs(p.y - 40) < 0.001);")]),
  py=dict(starter="def point_from(x, y, angle, distance):\n    return {\"x\": x, \"y\": y}\n",
    answer="def point_from(x, y, angle, distance):\n    return {\n        \"x\": x + math.cos(angle) * distance,\n        \"y\": y + math.sin(angle) * distance,\n    }\n",
    hints=["math.cos and math.sin both want the angle in radians, which is what we have.",
           "cos goes with x, sin goes with y. Always that way round.",
           "\"x\": x + math.cos(angle) * distance"],
    tests=[("Angle 0 goes to the right",
            "p = point_from(0, 0, 0, 10)\nassert abs(p['x'] - 10) < 0.001\nassert abs(p['y']) < 0.001"),
           ("A quarter turn goes DOWN",
            "p = point_from(0, 0, math.pi / 2, 10)\nassert abs(p['x']) < 0.001\nassert abs(p['y'] - 10) < 0.001, 'on a canvas, y grows downwards'"),
           ("Half a turn goes left",
            "p = point_from(0, 0, math.pi, 10)\nassert abs(p['x'] + 10) < 0.001"),
           ("Three quarters goes UP",
            "p = point_from(0, 0, -math.pi / 2, 10)\nassert abs(p['y'] + 10) < 0.001"),
           ("It starts from where you tell it",
            "p = point_from(100, 50, 0, 10)\nassert abs(p['x'] - 110) < 0.001 and abs(p['y'] - 50) < 0.001"),
           ("Twice the distance is twice as far",
            "near = point_from(0, 0, 1, 10)\nfar = point_from(0, 0, 1, 20)\nassert abs(far['x'] - near['x'] * 2) < 0.001"),
           ("Every angle lands the right distance away",
            "for step in range(16):\n    angle = step / 16 * math.pi * 2\n    p = point_from(0, 0, angle, 25)\n    away = math.sqrt(p['x'] ** 2 + p['y'] ** 2)\n    assert abs(away - 25) < 0.001, f'angle {angle:.2f} landed {away:.1f} away'"),
           ("Zero distance does not move at all",
            "p = point_from(30, 40, 2.1, 0)\nassert abs(p['x'] - 30) < 0.001 and abs(p['y'] - 40) < 0.001")]),
  demo=dict(kind="angles", caption="Turn the ship and watch the dashed line — that is pointFrom drawing 60 pixels ahead.")),

step("distance_between", "distanceBetween", "distance_between",
  "How far apart?", "The game can measure a gap.",
  "<p>Every collision in this game &mdash; bullet against rock, rock against ship &mdash; comes down to one question: <em>how far apart are these two things?</em></p>"
  "<p>Draw the two dots, then draw a right triangle between them. One short side is the sideways gap, the other is the up-and-down gap, and the distance is the long side. That is Pythagoras, and it is the single most useful piece of maths in games.</p>"
  + FIG_DISTANCE +
  "<p>Notice you can subtract in either order. <code>a.x - b.x</code> and <code>b.x - a.x</code> only differ by a minus sign, and squaring throws the sign away.</p>",
  "a, b — two things, each with an x and a y",
  "one number: how far apart they are",
  ["Work out the sideways gap: a.x − b.x.",
   "Work out the up-and-down gap: a.y − b.y.",
   "Give back the square root of (across × across + down × down)."],
  js=dict(starter="function distanceBetween(a, b) {\n    return 0;\n}\n",
    answer="function distanceBetween(a, b) {\n    const across = a.x - b.x;\n    const down = a.y - b.y;\n    return Math.sqrt(across * across + down * down);\n}\n",
    hints=["Two subtractions, then Math.sqrt of the two squares added up.",
           "across * across is the same as squaring it. So is Math.pow(across, 2).",
           "return Math.sqrt(across * across + down * down);"],
    tests=[("A thing is no distance from itself",
            "assert(distanceBetween({ x: 40, y: 90 }, { x: 40, y: 90 }) === 0);"),
           ("Straight across",
            "assert(distanceBetween({ x: 0, y: 0 }, { x: 7, y: 0 }) === 7);"),
           ("Straight down",
            "assert(distanceBetween({ x: 5, y: 2 }, { x: 5, y: 11 }) === 9);"),
           ("The 3-4-5 triangle every builder knows",
            "const d = distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 });\nassert(Math.abs(d - 5) < 0.001, 'got ' + d + ', expected 5');"),
           ("It never comes back negative",
            "const d = distanceBetween({ x: 10, y: 10 }, { x: 4, y: 2 });\nassert(d > 0, 'got ' + d);\nassert(Math.abs(d - 10) < 0.001);"),
           ("Which way round you ask makes no difference",
            "const a = { x: 12, y: -5 };\nconst b = { x: -3, y: 9 };\nassert(Math.abs(distanceBetween(a, b) - distanceBetween(b, a)) < 0.001);"),
           ("It agrees with pointFrom",
            "for (let step = 0; step < 12; step++) {\n    const angle = step / 12 * Math.PI * 2;\n    const there = pointFrom(170, 170, angle, 44);\n    const d = distanceBetween({ x: 170, y: 170 }, there);\n    assert(Math.abs(d - 44) < 0.001, 'pointFrom went 44 away but distanceBetween says ' + d.toFixed(2));\n}")]),
  py=dict(starter="def distance_between(a, b):\n    return 0\n",
    answer="def distance_between(a, b):\n    across = a[\"x\"] - b[\"x\"]\n    down = a[\"y\"] - b[\"y\"]\n    return math.sqrt(across * across + down * down)\n",
    hints=["Two subtractions, then math.sqrt of the two squares added up.",
           "In Python, across ** 2 squares a number.",
           "return math.sqrt(across * across + down * down)"],
    tests=[("A thing is no distance from itself",
            "assert distance_between({'x': 40, 'y': 90}, {'x': 40, 'y': 90}) == 0"),
           ("Straight across",
            "assert distance_between({'x': 0, 'y': 0}, {'x': 7, 'y': 0}) == 7"),
           ("Straight down",
            "assert distance_between({'x': 5, 'y': 2}, {'x': 5, 'y': 11}) == 9"),
           ("The 3-4-5 triangle every builder knows",
            "d = distance_between({'x': 0, 'y': 0}, {'x': 3, 'y': 4})\nassert abs(d - 5) < 0.001, f'got {d}, expected 5'"),
           ("It never comes back negative",
            "d = distance_between({'x': 10, 'y': 10}, {'x': 4, 'y': 2})\nassert d > 0 and abs(d - 10) < 0.001"),
           ("Which way round you ask makes no difference",
            "a = {'x': 12, 'y': -5}\nb = {'x': -3, 'y': 9}\nassert abs(distance_between(a, b) - distance_between(b, a)) < 0.001"),
           ("It agrees with point_from",
            "for step in range(12):\n    angle = step / 12 * math.pi * 2\n    there = point_from(170, 170, angle, 44)\n    d = distance_between({'x': 170, 'y': 170}, there)\n    assert abs(d - 44) < 0.001, f'point_from went 44 away but distance_between says {d:.2f}'")]),
  demo=dict(kind="measure", caption="Drag the ship about with the buttons — the number is distanceBetween, live.")),

step("touches", "touches", "touches",
  "Are they overlapping?", "The game can spot a collision.",
  "<p>Now use the gap. Two round things are overlapping when they are <strong>closer than their two radii added together</strong>. Any further apart and there is still clear space between them.</p>"
  + FIG_TOUCHES +
  "<p>This is why space games use circles. Testing two rectangles takes four comparisons and a headache; testing two circles takes one line &mdash; and you already wrote the hard half of it in the last step.</p>"
  "<p><strong>Reuse it.</strong> Do not write Pythagoras again here. Call <code>distanceBetween</code>. Every function you have already built is a tool you are allowed to pick up.</p>",
  "a, b — two things with an x and a y. radiusA, radiusB — how big each one is.",
  "true if they overlap, false if they do not",
  ["Ask distanceBetween how far apart a and b are.",
   "Add radiusA and radiusB together.",
   "Give back true when the distance is the smaller of the two."],
  js=dict(starter="function touches(a, b, radiusA, radiusB) {\n    return false;\n}\n",
    answer="function touches(a, b, radiusA, radiusB) {\n    return distanceBetween(a, b) < radiusA + radiusB;\n}\n",
    hints=["You do not need an if. A comparison is already true or false.",
           "distanceBetween(a, b) is the gap. radiusA + radiusB is how close is too close.",
           "return distanceBetween(a, b) < radiusA + radiusB;"],
    tests=[("Two things in the same place definitely touch",
            "assert(touches({ x: 50, y: 50 }, { x: 50, y: 50 }, 5, 5) === true);"),
           ("Far apart is a miss",
            "assert(touches({ x: 0, y: 0 }, { x: 300, y: 0 }, 10, 10) === false);"),
           ("Just close enough",
            "assert(touches({ x: 0, y: 0 }, { x: 19, y: 0 }, 10, 10) === true, '19 apart with radii of 10 and 10 is an overlap');"),
           ("Just too far",
            "assert(touches({ x: 0, y: 0 }, { x: 21, y: 0 }, 10, 10) === false, '21 apart with radii of 10 and 10 is clear space');"),
           ("Exactly touching does not count as a hit",
            "assert(touches({ x: 0, y: 0 }, { x: 20, y: 0 }, 10, 10) === false, 'use < rather than <=, so a graze is not a hit');"),
           ("A bigger rock is easier to hit",
            "const bullet = { x: 0, y: 0 };\nconst rock = { x: 24, y: 0 };\nassert(touches(bullet, rock, 1, ROCK_RADIUS[3]) === true, 'a big rock has radius ' + ROCK_RADIUS[3]);\nassert(touches(bullet, rock, 1, ROCK_RADIUS[1]) === false, 'a small rock has radius ' + ROCK_RADIUS[1]);"),
           ("It works diagonally too, not just in a straight line",
            "assert(touches({ x: 0, y: 0 }, { x: 3, y: 4 }, 3, 3) === true, '3-4-5 makes a gap of 5, and 3 + 3 is 6');\nassert(touches({ x: 0, y: 0 }, { x: 3, y: 4 }, 2, 2) === false);"),
           ("Order does not matter",
            "const a = { x: 10, y: 20 };\nconst b = { x: 25, y: 20 };\nassert(touches(a, b, 8, 9) === touches(b, a, 9, 8));")]),
  py=dict(starter="def touches(a, b, radius_a, radius_b):\n    return False\n",
    answer="def touches(a, b, radius_a, radius_b):\n    return distance_between(a, b) < radius_a + radius_b\n",
    hints=["You do not need an if. A comparison is already True or False.",
           "distance_between(a, b) is the gap. radius_a + radius_b is how close is too close.",
           "return distance_between(a, b) < radius_a + radius_b"],
    tests=[("Two things in the same place definitely touch",
            "assert touches({'x': 50, 'y': 50}, {'x': 50, 'y': 50}, 5, 5) is True"),
           ("Far apart is a miss",
            "assert touches({'x': 0, 'y': 0}, {'x': 300, 'y': 0}, 10, 10) is False"),
           ("Just close enough",
            "assert touches({'x': 0, 'y': 0}, {'x': 19, 'y': 0}, 10, 10) is True"),
           ("Just too far",
            "assert touches({'x': 0, 'y': 0}, {'x': 21, 'y': 0}, 10, 10) is False"),
           ("Exactly touching does not count as a hit",
            "assert touches({'x': 0, 'y': 0}, {'x': 20, 'y': 0}, 10, 10) is False, 'use < rather than <=, so a graze is not a hit'"),
           ("A bigger rock is easier to hit",
            "bullet = {'x': 0, 'y': 0}\nrock = {'x': 24, 'y': 0}\nassert touches(bullet, rock, 1, ROCK_RADIUS[3]) is True\nassert touches(bullet, rock, 1, ROCK_RADIUS[1]) is False"),
           ("It works diagonally too, not just in a straight line",
            "assert touches({'x': 0, 'y': 0}, {'x': 3, 'y': 4}, 3, 3) is True\nassert touches({'x': 0, 'y': 0}, {'x': 3, 'y': 4}, 2, 2) is False"),
           ("Order does not matter",
            "a = {'x': 10, 'y': 20}\nb = {'x': 25, 'y': 20}\nassert touches(a, b, 8, 9) == touches(b, a, 9, 8)")]),
  demo=dict(kind="measure", caption="Fly the ship at the rock. The word underneath flips the instant touches says true.")),

step("wrap_position", "wrapPosition", "wrap_position",
  "Space has no edges", "Fly off one side, come back on the other.",
  "<p>There are no walls out here. Fly off the right and you appear on the left; off the top and you come back at the bottom. The field is a loop in both directions.</p>"
  + FIG_WRAP +
  "<p>Use <code>while</code> rather than <code>if</code>. A rock nudged just past the edge only needs one wrap, but something that has jumped a long way in one frame might need several &mdash; and <code>while</code> handles both without you having to think about it.</p>",
  "thing — anything with an x and a y",
  "nothing; it changes the thing",
  ["While x is below 0, add FIELD_WIDTH.",
   "While x has reached FIELD_WIDTH, take FIELD_WIDTH off.",
   "Do the same for y with FIELD_HEIGHT."],
  js=dict(starter="function wrapPosition(thing) {\n    // off one edge, back on the other\n}\n",
    answer="function wrapPosition(thing) {\n    while (thing.x < 0) { thing.x = thing.x + FIELD_WIDTH; }\n    while (thing.x >= FIELD_WIDTH) { thing.x = thing.x - FIELD_WIDTH; }\n    while (thing.y < 0) { thing.y = thing.y + FIELD_HEIGHT; }\n    while (thing.y >= FIELD_HEIGHT) { thing.y = thing.y - FIELD_HEIGHT; }\n}\n",
    hints=["Four while loops, two for x and two for y.",
           "Going off the left means ADDING the width.",
           "Use >= for the far edge, so exactly FIELD_WIDTH wraps to 0."],
    tests=[("Something in the middle is left alone",
            "const thing = { x: 100, y: 100 };\nwrapPosition(thing);\nassert(thing.x === 100 && thing.y === 100);"),
           ("Off the left comes back on the right",
            "const thing = { x: -5, y: 100 };\nwrapPosition(thing);\nassert(thing.x === FIELD_WIDTH - 5, 'x is ' + thing.x);"),
           ("Off the right comes back on the left",
            "const thing = { x: FIELD_WIDTH + 5, y: 100 };\nwrapPosition(thing);\nassert(thing.x === 5, 'x is ' + thing.x);"),
           ("Off the top comes back at the bottom",
            "const thing = { x: 100, y: -5 };\nwrapPosition(thing);\nassert(thing.y === FIELD_HEIGHT - 5);"),
           ("Off the bottom comes back at the top",
            "const thing = { x: 100, y: FIELD_HEIGHT + 5 };\nwrapPosition(thing);\nassert(thing.y === 5);"),
           ("A corner wraps in both directions at once",
            "const thing = { x: -5, y: -5 };\nwrapPosition(thing);\nassert(thing.x === FIELD_WIDTH - 5 && thing.y === FIELD_HEIGHT - 5);"),
           ("A huge jump still lands on the field",
            "const thing = { x: FIELD_WIDTH * 3 + 7, y: -FIELD_HEIGHT * 2 - 3 };\nwrapPosition(thing);\nassert(thing.x >= 0 && thing.x < FIELD_WIDTH, 'x is ' + thing.x + ' — did you use while rather than if?');\nassert(thing.y >= 0 && thing.y < FIELD_HEIGHT, 'y is ' + thing.y);"),
           ("Nothing can ever escape",
            "const thing = { x: 10, y: 10, dx: 411, dy: -389 };\nfor (let frame = 0; frame < 3000; frame++) {\n    thing.x = thing.x + thing.dx * 0.05;\n    thing.y = thing.y + thing.dy * 0.05;\n    wrapPosition(thing);\n    assert(thing.x >= 0 && thing.x < FIELD_WIDTH, 'it escaped sideways at frame ' + frame);\n    assert(thing.y >= 0 && thing.y < FIELD_HEIGHT, 'it escaped up or down at frame ' + frame);\n}")]),
  py=dict(starter="def wrap_position(thing):\n    # off one edge, back on the other\n    pass\n",
    answer="def wrap_position(thing):\n    while thing[\"x\"] < 0:\n        thing[\"x\"] += FIELD_WIDTH\n    while thing[\"x\"] >= FIELD_WIDTH:\n        thing[\"x\"] -= FIELD_WIDTH\n    while thing[\"y\"] < 0:\n        thing[\"y\"] += FIELD_HEIGHT\n    while thing[\"y\"] >= FIELD_HEIGHT:\n        thing[\"y\"] -= FIELD_HEIGHT\n",
    hints=["Four while loops, two for x and two for y.",
           "Going off the left means ADDING the width.",
           "Use >= for the far edge, so exactly FIELD_WIDTH wraps to 0."],
    tests=[("Something in the middle is left alone",
            "thing = {'x': 100, 'y': 100}\nwrap_position(thing)\nassert thing == {'x': 100, 'y': 100}"),
           ("Off the left comes back on the right",
            "thing = {'x': -5, 'y': 100}\nwrap_position(thing)\nassert thing['x'] == FIELD_WIDTH - 5"),
           ("Off the right comes back on the left",
            "thing = {'x': FIELD_WIDTH + 5, 'y': 100}\nwrap_position(thing)\nassert thing['x'] == 5"),
           ("Off the top comes back at the bottom",
            "thing = {'x': 100, 'y': -5}\nwrap_position(thing)\nassert thing['y'] == FIELD_HEIGHT - 5"),
           ("Off the bottom comes back at the top",
            "thing = {'x': 100, 'y': FIELD_HEIGHT + 5}\nwrap_position(thing)\nassert thing['y'] == 5"),
           ("A corner wraps in both directions at once",
            "thing = {'x': -5, 'y': -5}\nwrap_position(thing)\nassert thing['x'] == FIELD_WIDTH - 5 and thing['y'] == FIELD_HEIGHT - 5"),
           ("A huge jump still lands on the field",
            "thing = {'x': FIELD_WIDTH * 3 + 7, 'y': -FIELD_HEIGHT * 2 - 3}\nwrap_position(thing)\nassert 0 <= thing['x'] < FIELD_WIDTH, 'did you use while rather than if?'\nassert 0 <= thing['y'] < FIELD_HEIGHT"),
           ("Nothing can ever escape",
            "thing = {'x': 10, 'y': 10, 'dx': 411, 'dy': -389}\nfor frame in range(3000):\n    thing['x'] += thing['dx'] * 0.05\n    thing['y'] += thing['dy'] * 0.05\n    wrap_position(thing)\n    assert 0 <= thing['x'] < FIELD_WIDTH, f'it escaped sideways at frame {frame}'\n    assert 0 <= thing['y'] < FIELD_HEIGHT, f'it escaped up or down at frame {frame}'")]),
  demo=dict(kind="drift", caption="Push the ship at a wall. It slides straight through and reappears opposite.")),

step("speed_of", "speedOf", "speed_of",
  "How fast, in total?", "The game can measure a speed.",
  "<p>The ship carries two numbers for how it is moving: <code>dx</code> is how fast it slides sideways each second, <code>dy</code> is how fast it slides up or down. Neither one on its own tells you how fast the ship is <em>really</em> going.</p>"
  + fig("The same right triangle as before — but the sides are speeds now, not gaps.",
        svg('<path d="M80,150 L246,150"' + DASH + ' marker-end="url(#tip)"/>'
            '<path d="M250,150 L250,74"' + DASH + ' marker-end="url(#tip)"/>'
            '<path d="M80,150 L246,76"' + ARROW + '/>'
            '<path d="M234,150 L234,136 L250,136"' + THIN + '/>'
            '<path d="M80,150 m-9,-9 l18,0 l0,18 l-18,0 z"' + LINE + '/>'
            '<text x="163" y="172"' + SMALL + ' text-anchor="middle">dx</text>'
            '<text x="260" y="116"' + SMALL + '>dy</text>'
            '<text x="120" y="98"' + SMALL + '>speed</text>'
            '<text x="180" y="34"' + SMALL + ' text-anchor="middle">'
            'sqrt(dx x dx + dy x dy)</text>')) +
  "<p>A ship going 100 sideways and 100 downwards is not going 100, and it is not going 200 &mdash; it is going about 141. Pythagoras again, on exactly the same triangle you drew for <code>distanceBetween</code>. The only difference is what the numbers mean.</p>",
  "thing — anything with a dx and a dy",
  "one number: its total speed",
  ["Square dx and square dy.",
   "Add them.",
   "Give back the square root."],
  js=dict(starter="function speedOf(thing) {\n    return 0;\n}\n",
    answer="function speedOf(thing) {\n    return Math.sqrt(thing.dx * thing.dx + thing.dy * thing.dy);\n}\n",
    hints=["It is the same sum as distanceBetween, with dx and dy instead of the two gaps.",
           "Math.sqrt(a * a + b * b)",
           "return Math.sqrt(thing.dx * thing.dx + thing.dy * thing.dy);"],
    tests=[("Standing still is a speed of zero",
            "assert(speedOf({ dx: 0, dy: 0 }) === 0);"),
           ("Sliding straight sideways",
            "assert(speedOf({ dx: 12, dy: 0 }) === 12);"),
           ("Sliding straight down",
            "assert(speedOf({ dx: 0, dy: 9 }) === 9);"),
           ("Going backwards is still a positive speed",
            "assert(speedOf({ dx: -12, dy: 0 }) === 12, 'speed has no direction — it can never be negative');"),
           ("The 3-4-5 triangle again",
            "assert(Math.abs(speedOf({ dx: 3, dy: 4 }) - 5) < 0.001);"),
           ("Diagonal is more than either side, less than both added up",
            "const s = speedOf({ dx: 100, dy: 100 });\nassert(s > 100 && s < 200, 'got ' + s);\nassert(Math.abs(s - 141.42) < 0.01, 'got ' + s.toFixed(2) + ', expected about 141.42');"),
           ("It matches pointFrom's distance, whatever the direction",
            "for (let step = 0; step < 12; step++) {\n    const angle = step / 12 * Math.PI * 2;\n    const flight = pointFrom(0, 0, angle, 250);\n    const s = speedOf({ dx: flight.x, dy: flight.y });\n    assert(Math.abs(s - 250) < 0.001, 'angle ' + angle.toFixed(2) + ' gave a speed of ' + s.toFixed(2));\n}")]),
  py=dict(starter="def speed_of(thing):\n    return 0\n",
    answer="def speed_of(thing):\n    return math.sqrt(thing[\"dx\"] ** 2 + thing[\"dy\"] ** 2)\n",
    hints=["It is the same sum as distance_between, with dx and dy instead of the two gaps.",
           "math.sqrt(a ** 2 + b ** 2)",
           "return math.sqrt(thing['dx'] ** 2 + thing['dy'] ** 2)"],
    tests=[("Standing still is a speed of zero",
            "assert speed_of({'dx': 0, 'dy': 0}) == 0"),
           ("Sliding straight sideways",
            "assert speed_of({'dx': 12, 'dy': 0}) == 12"),
           ("Sliding straight down",
            "assert speed_of({'dx': 0, 'dy': 9}) == 9"),
           ("Going backwards is still a positive speed",
            "assert speed_of({'dx': -12, 'dy': 0}) == 12, 'speed has no direction'"),
           ("The 3-4-5 triangle again",
            "assert abs(speed_of({'dx': 3, 'dy': 4}) - 5) < 0.001"),
           ("Diagonal is more than either side, less than both added up",
            "s = speed_of({'dx': 100, 'dy': 100})\nassert 100 < s < 200, f'got {s}'\nassert abs(s - 141.42) < 0.01, f'got {s:.2f}, expected about 141.42'"),
           ("It matches point_from's distance, whatever the direction",
            "for step in range(12):\n    angle = step / 12 * math.pi * 2\n    flight = point_from(0, 0, angle, 250)\n    s = speed_of({'dx': flight['x'], 'dy': flight['y']})\n    assert abs(s - 250) < 0.001, f'angle {angle:.2f} gave a speed of {s:.2f}'")]),
  demo=dict(kind="drift", caption="The number under the field is speedOf(ship). Hold thrust and watch it climb.")),

step("clamp_speed", "clampSpeed", "clamp_speed",
  "Not TOO fast", "The ship has a top speed.",
  "<p>Hold the engine down long enough and the ship would eventually be crossing the whole field in a single frame &mdash; through rocks, past bullets, impossible to fly. So there is a ceiling.</p>"
  "<p>The trick is slowing it down <strong>without turning it</strong>. If you simply chopped <code>dx</code> down to the limit and left <code>dy</code> alone, the ship would swing sideways every time it hit top speed. Instead, scale <em>both</em> numbers by the same fraction: <code>limit / speed</code>.</p>"
  + fig("Same direction, shorter arrow. Scaling both dx and dy by one fraction is what keeps the course.",
        svg('<circle cx="90" cy="120" r="76"' + FAINT + '/>'
            '<path d="M90,120 L306,47"' + DASH + ' marker-end="url(#tip)"/>'
            '<path d="M90,120 L158,97"' + ARROW + '/>'
            '<circle cx="90" cy="120" r="4" fill="#111"/>'
            '<text x="90" y="34"' + SMALL + ' text-anchor="middle">the limit</text>'
            '<path d="M90,44 L90,120"' + THIN + ' stroke-dasharray="3 3"/>'
            '<text x="252" y="40"' + SMALL + '>asked for</text>'
            '<text x="150" y="140"' + SMALL + '>given</text>')) +
  "<p>It gives back <code>true</code> when it actually had to slow something down. That is useful: a function that quietly reports what it did is easier to test and easier to trust.</p>",
  "thing — anything with a dx and a dy. limit — the fastest it may go.",
  "true if it had to be slowed down, false if it was already fine",
  ["Ask speedOf how fast it is going.",
   "If that is not over the limit, give back false and change nothing.",
   "Otherwise scale BOTH dx and dy by limit ÷ speed, and give back true."],
  js=dict(starter="function clampSpeed(thing, limit) {\n    return false;\n}\n",
    answer="function clampSpeed(thing, limit) {\n    const speed = speedOf(thing);\n    if (speed <= limit) {\n        return false;\n    }\n    thing.dx = thing.dx / speed * limit;\n    thing.dy = thing.dy / speed * limit;\n    return true;\n}\n",
    hints=["Work the speed out ONCE and keep it in a variable — you need it twice.",
           "Leaving early when it is already slow enough saves you an else.",
           "thing.dx = thing.dx / speed * limit;  — and the same line for dy."],
    tests=[("Something slow is left completely alone",
            "const thing = { dx: 3, dy: 4 };\nassert(clampSpeed(thing, 100) === false);\nassert(thing.dx === 3 && thing.dy === 4, 'it should not have been touched');"),
           ("Exactly at the limit is fine",
            "const thing = { dx: 5, dy: 0 };\nassert(clampSpeed(thing, 5) === false, 'use <= so sitting exactly on the limit is allowed');"),
           ("Too fast gets slowed down",
            "const thing = { dx: 300, dy: 0 };\nassert(clampSpeed(thing, 100) === true);\nassert(Math.abs(thing.dx - 100) < 0.001, 'dx is ' + thing.dx);"),
           ("It ends up at exactly the limit",
            "const thing = { dx: 300, dy: 400 };\nclampSpeed(thing, 50);\nassert(Math.abs(speedOf(thing) - 50) < 0.001, 'speed is now ' + speedOf(thing));"),
           ("The direction does not change",
            "const thing = { dx: 300, dy: 400 };\nclampSpeed(thing, 50);\nassert(Math.abs(thing.dx - 30) < 0.001, 'dx is ' + thing.dx + ' — 300 and 400 shrink to 30 and 40');\nassert(Math.abs(thing.dy - 40) < 0.001, 'dy is ' + thing.dy);"),
           ("Negative speeds keep their sign",
            "const thing = { dx: -300, dy: -400 };\nclampSpeed(thing, 50);\nassert(thing.dx < 0 && thing.dy < 0, 'it turned the ship right round!');\nassert(Math.abs(speedOf(thing) - 50) < 0.001);"),
           ("Nothing ever creeps over the limit",
            "const thing = { dx: 0, dy: 0 };\nfor (let frame = 0; frame < 500; frame++) {\n    thing.dx = thing.dx + 40;\n    thing.dy = thing.dy - 25;\n    clampSpeed(thing, MAX_SPEED);\n    assert(speedOf(thing) <= MAX_SPEED + 0.001, 'frame ' + frame + ' reached ' + speedOf(thing).toFixed(1));\n}"),
           ("Standing perfectly still does not break it",
            "const thing = { dx: 0, dy: 0 };\nassert(clampSpeed(thing, 100) === false, 'a speed of 0 is under any limit — you must not divide by it');")]),
  py=dict(starter="def clamp_speed(thing, limit):\n    return False\n",
    answer="def clamp_speed(thing, limit):\n    speed = speed_of(thing)\n    if speed <= limit:\n        return False\n    thing[\"dx\"] = thing[\"dx\"] / speed * limit\n    thing[\"dy\"] = thing[\"dy\"] / speed * limit\n    return True\n",
    hints=["Work the speed out ONCE and keep it in a variable — you need it twice.",
           "Returning early when it is already slow enough saves you an else.",
           "thing['dx'] = thing['dx'] / speed * limit  — and the same line for dy."],
    tests=[("Something slow is left completely alone",
            "thing = {'dx': 3, 'dy': 4}\nassert clamp_speed(thing, 100) is False\nassert thing == {'dx': 3, 'dy': 4}"),
           ("Exactly at the limit is fine",
            "thing = {'dx': 5, 'dy': 0}\nassert clamp_speed(thing, 5) is False, 'use <= so sitting exactly on the limit is allowed'"),
           ("Too fast gets slowed down",
            "thing = {'dx': 300, 'dy': 0}\nassert clamp_speed(thing, 100) is True\nassert abs(thing['dx'] - 100) < 0.001"),
           ("It ends up at exactly the limit",
            "thing = {'dx': 300, 'dy': 400}\nclamp_speed(thing, 50)\nassert abs(speed_of(thing) - 50) < 0.001"),
           ("The direction does not change",
            "thing = {'dx': 300, 'dy': 400}\nclamp_speed(thing, 50)\nassert abs(thing['dx'] - 30) < 0.001, '300 and 400 shrink to 30 and 40'\nassert abs(thing['dy'] - 40) < 0.001"),
           ("Negative speeds keep their sign",
            "thing = {'dx': -300, 'dy': -400}\nclamp_speed(thing, 50)\nassert thing['dx'] < 0 and thing['dy'] < 0, 'it turned the ship right round!'\nassert abs(speed_of(thing) - 50) < 0.001"),
           ("Nothing ever creeps over the limit",
            "thing = {'dx': 0, 'dy': 0}\nfor frame in range(500):\n    thing['dx'] += 40\n    thing['dy'] -= 25\n    clamp_speed(thing, MAX_SPEED)\n    assert speed_of(thing) <= MAX_SPEED + 0.001, f'frame {frame} reached {speed_of(thing):.1f}'"),
           ("Standing perfectly still does not break it",
            "thing = {'dx': 0, 'dy': 0}\nassert clamp_speed(thing, 100) is False, 'a speed of 0 is under any limit — you must not divide by it'")]),
  demo=dict(kind="drift", caption="Hold thrust. The speed climbs, then stops dead at MAX_SPEED — and the ship keeps its heading.")),

step("turn_ship", "turnShip", "turn_ship",
  "Swing the nose round", "Left and right steer the ship.",
  "<p>Holding left or right sets <code>turning</code> to &minus;1 or 1, and this function does the actual swinging: add <code>turning × TURN_SPEED × seconds</code> to the angle.</p>"
  "<p>Then comes the interesting half. Spin one way for five minutes and the angle would climb past 1000 radians. <code>cos</code> and <code>sin</code> would still work perfectly &mdash; but every number you printed while hunting a bug would be meaningless. So fold the answer back into the range &minus;&pi; to &pi;.</p>"
  + fig("Keep turning right and the angle folds back round to -pi, instead of climbing for ever.",
        svg('<path d="M40,116 L320,116"' + LINE + '/>'
            '<path d="M40,110 L40,122"' + LINE + '/><text x="40" y="140"' + SMALL + ' text-anchor="middle">-pi</text>'
            '<path d="M110,111 L110,121"' + THIN + '/><text x="110" y="140"' + SMALL + ' text-anchor="middle">-pi/2</text>'
            '<path d="M180,110 L180,122"' + LINE + '/><text x="180" y="140"' + SMALL + ' text-anchor="middle">0</text>'
            '<path d="M250,111 L250,121"' + THIN + '/><text x="250" y="140"' + SMALL + ' text-anchor="middle">pi/2</text>'
            '<path d="M320,110 L320,122"' + LINE + '/><text x="320" y="140"' + SMALL + ' text-anchor="middle">pi</text>'
            '<path d="M265,94 L336,94"' + ARROW + '/>'
            '<path d="M24,94 L86,94"' + ARROW + '/>'
            '<path d="M338,88 Q336,42 180,40 Q24,42 22,88"' + DASH + ' marker-end="url(#tip)"/>'
            '<text x="180" y="30"' + SMALL + ' text-anchor="middle">turning right, past pi</text>'
            '<text x="180" y="176"' + SMALL + ' text-anchor="middle">'
            'the angle always stays inside this line</text>')) +
  "<p>The fold is one line: add &pi;, take the remainder when divided by a whole turn, take &pi; back off.</p>",
  "ship — the ship. turning — −1, 0 or 1. seconds — how long this frame lasted.",
  "nothing; it changes the ship's angle",
  ["Add turning × TURN_SPEED × seconds to the ship's angle.",
   "Add π, then take the remainder when divided by a whole turn (2π).",
   "Take π back off, and store the result."],
  warning="A remainder can come out NEGATIVE in JavaScript, but never in Python. That one difference is why this step's two answers do not quite match — see the note for your language.",
  intro_js="<p><strong>In JavaScript:</strong> <code>%</code> keeps the sign of the left-hand number, so <code>-1 % 5</code> is <code>-1</code>, not <code>4</code>. Doing the remainder twice with a <code>+ whole</code> in between fixes it.</p>",
  intro_py="<p><strong>In Python:</strong> <code>%</code> always gives a positive answer, so <code>-1 % 5</code> is <code>4</code>. That makes this tidier here than it is in JavaScript — one remainder is enough.</p>",
  js=dict(starter="function turnShip(ship, turning, seconds) {\n    // swing the nose\n}\n",
    answer="function turnShip(ship, turning, seconds) {\n    const whole = Math.PI * 2;\n    let angle = ship.angle + turning * TURN_SPEED * seconds;\n    angle = ((angle + Math.PI) % whole + whole) % whole - Math.PI;\n    ship.angle = angle;\n}\n",
    hints=["First the easy part: ship.angle + turning * TURN_SPEED * seconds.",
           "Then fold it: add Math.PI, remainder by 2π, subtract Math.PI.",
           "((angle + Math.PI) % whole + whole) % whole - Math.PI — the extra + whole is what handles JavaScript's negative remainders."],
    tests=[("Not turning leaves the angle alone",
            "const ship = { angle: 1 };\nturnShip(ship, 0, 0.5);\nassert(Math.abs(ship.angle - 1) < 0.0001, 'angle is ' + ship.angle);"),
           ("Turning right makes the angle bigger",
            "const ship = { angle: 0 };\nturnShip(ship, 1, 0.1);\nassert(Math.abs(ship.angle - TURN_SPEED * 0.1) < 0.0001, 'angle is ' + ship.angle);"),
           ("Turning left makes it smaller",
            "const ship = { angle: 0 };\nturnShip(ship, -1, 0.1);\nassert(ship.angle < 0, 'angle is ' + ship.angle);"),
           ("A long frame turns further than a short one",
            "const slow = { angle: 0 };\nconst fast = { angle: 0 };\nturnShip(slow, 1, 0.05);\nturnShip(fast, 1, 0.10);\nassert(Math.abs(fast.angle - slow.angle * 2) < 0.0001, 'twice the time should be twice the turn');"),
           ("Turning past π wraps round to the other end",
            "const ship = { angle: 3.1 };\nturnShip(ship, 1, 0.2);\nassert(ship.angle < 0, 'angle is ' + ship.angle + ' — past π it should come out negative');\nassert(ship.angle >= -Math.PI, 'angle is ' + ship.angle);"),
           ("Turning past −π wraps the other way",
            "const ship = { angle: -3.1 };\nturnShip(ship, -1, 0.2);\nassert(ship.angle > 0, 'angle is ' + ship.angle + ' — this is where JavaScript\\'s negative % bites');"),
           ("The angle never runs away, however long you spin",
            "const ship = { angle: 0 };\nfor (let frame = 0; frame < 4000; frame++) {\n    turnShip(ship, 1, 0.05);\n    assert(ship.angle >= -Math.PI && ship.angle <= Math.PI, 'frame ' + frame + ': angle escaped to ' + ship.angle.toFixed(2));\n}"),
           ("Wrapping does not change where the nose actually points",
            "const spun = { angle: 3.1 };\nturnShip(spun, 1, 0.2);\nconst raw = 3.1 + TURN_SPEED * 0.2;\nassert(Math.abs(Math.cos(spun.angle) - Math.cos(raw)) < 0.0001, 'the fold moved the nose — it should only tidy the number');\nassert(Math.abs(Math.sin(spun.angle) - Math.sin(raw)) < 0.0001);")]),
  py=dict(starter="def turn_ship(ship, turning, seconds):\n    # swing the nose\n    pass\n",
    answer="def turn_ship(ship, turning, seconds):\n    whole = math.pi * 2\n    angle = ship[\"angle\"] + turning * TURN_SPEED * seconds\n    ship[\"angle\"] = (angle + math.pi) % whole - math.pi\n",
    hints=["First the easy part: ship['angle'] + turning * TURN_SPEED * seconds.",
           "Then fold it: add math.pi, % a whole turn, subtract math.pi.",
           "(angle + math.pi) % whole - math.pi — Python's % is always positive, so one is enough."],
    tests=[("Not turning leaves the angle alone",
            "ship = {'angle': 1}\nturn_ship(ship, 0, 0.5)\nassert abs(ship['angle'] - 1) < 0.0001"),
           ("Turning right makes the angle bigger",
            "ship = {'angle': 0}\nturn_ship(ship, 1, 0.1)\nassert abs(ship['angle'] - TURN_SPEED * 0.1) < 0.0001"),
           ("Turning left makes it smaller",
            "ship = {'angle': 0}\nturn_ship(ship, -1, 0.1)\nassert ship['angle'] < 0"),
           ("A long frame turns further than a short one",
            "slow = {'angle': 0}\nfast = {'angle': 0}\nturn_ship(slow, 1, 0.05)\nturn_ship(fast, 1, 0.10)\nassert abs(fast['angle'] - slow['angle'] * 2) < 0.0001"),
           ("Turning past pi wraps round to the other end",
            "ship = {'angle': 3.1}\nturn_ship(ship, 1, 0.2)\nassert ship['angle'] < 0, f\"angle is {ship['angle']}\"\nassert ship['angle'] >= -math.pi"),
           ("Turning past -pi wraps the other way",
            "ship = {'angle': -3.1}\nturn_ship(ship, -1, 0.2)\nassert ship['angle'] > 0, f\"angle is {ship['angle']}\""),
           ("The angle never runs away, however long you spin",
            "ship = {'angle': 0}\nfor frame in range(4000):\n    turn_ship(ship, 1, 0.05)\n    assert -math.pi <= ship['angle'] <= math.pi, f\"frame {frame}: angle escaped to {ship['angle']:.2f}\""),
           ("Wrapping does not change where the nose actually points",
            "spun = {'angle': 3.1}\nturn_ship(spun, 1, 0.2)\nraw = 3.1 + TURN_SPEED * 0.2\nassert abs(math.cos(spun['angle']) - math.cos(raw)) < 0.0001, 'the fold moved the nose'\nassert abs(math.sin(spun['angle']) - math.sin(raw)) < 0.0001")]),
  demo=dict(kind="angles", caption="Hold a turn button. The angle under the field spins — and never leaves -3.14 … 3.14.")),

step("thrust_ship", "thrustShip", "thrust_ship",
  "Fire the engine", "The ship can accelerate.",
  "<p>Here is the thing that makes Asteroids feel like Asteroids: <strong>the engine does not move the ship</strong>. It changes the ship's <em>speed</em>, and the speed moves the ship next frame. Exactly the way gravity worked in Flappy Bird.</p>"
  + fig("The new speed is the old speed PLUS the push. The ship does not forget where it was already going.",
        svg('<path d="M60,158 L186,112"' + ARROW + '/>'
            '<path d="M190,110 L246,58"' + ARROW + '/>'
            '<path d="M60,158 L244,54"' + DASH + ' marker-end="url(#tip)"/>'
            '<circle cx="60" cy="158" r="4" fill="#111"/>'
            '<text x="78" y="178"' + SMALL + '>speed it had</text>'
            '<text x="214" y="116"' + SMALL + '>engine push</text>'
            '<text x="66" y="70"' + SMALL + '>the new speed</text>')) +
  "<p>Which is why turning round and thrusting does not stop you. It slows you, then eventually pushes you back the other way &mdash; and learning to fly with that is the whole game.</p>"
  "<p>Finish by calling <code>clampSpeed(ship, MAX_SPEED)</code>. You wrote it two steps ago; use it.</p>",
  "ship — the ship. seconds — how long this frame lasted.",
  "nothing; it changes the ship's dx and dy",
  ["Add cos(angle) × THRUST × seconds to dx.",
   "Add sin(angle) × THRUST × seconds to dy.",
   "Call clampSpeed to keep it under MAX_SPEED."],
  js=dict(starter="function thrustShip(ship, seconds) {\n    // push the ship along its nose\n}\n",
    answer="function thrustShip(ship, seconds) {\n    ship.dx = ship.dx + Math.cos(ship.angle) * THRUST * seconds;\n    ship.dy = ship.dy + Math.sin(ship.angle) * THRUST * seconds;\n    clampSpeed(ship, MAX_SPEED);\n}\n",
    hints=["ADD to dx and dy. Do not replace them — that is what makes it drift.",
           "Same cos/sin pairing as pointFrom: cos with x, sin with y.",
           "Last line: clampSpeed(ship, MAX_SPEED);"],
    tests=[("A ship pointing right speeds up to the right",
            "const ship = { angle: 0, dx: 0, dy: 0 };\nthrustShip(ship, 0.1);\nassert(Math.abs(ship.dx - THRUST * 0.1) < 0.001, 'dx is ' + ship.dx);\nassert(Math.abs(ship.dy) < 0.001, 'dy is ' + ship.dy);"),
           ("A ship pointing up speeds up upwards",
            "const ship = { angle: -Math.PI / 2, dx: 0, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dy < 0, 'dy is ' + ship.dy + ' — up the screen is negative');\nassert(Math.abs(ship.dx) < 0.001);"),
           ("It ADDS to the speed the ship already had",
            "const ship = { angle: 0, dx: 50, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dx > 50, 'dx is ' + ship.dx + ' — did you replace dx instead of adding to it?');"),
           ("Thrusting backwards slows you down before it turns you round",
            "const ship = { angle: Math.PI, dx: 100, dy: 0 };\nthrustShip(ship, 0.1);\nassert(ship.dx < 100 && ship.dx > 0, 'dx is ' + ship.dx + ' — one short burst should slow it, not reverse it');"),
           ("A longer frame pushes harder",
            "const slow = { angle: 0, dx: 0, dy: 0 };\nconst fast = { angle: 0, dx: 0, dy: 0 };\nthrustShip(slow, 0.05);\nthrustShip(fast, 0.10);\nassert(Math.abs(fast.dx - slow.dx * 2) < 0.001);"),
           ("You can never break the speed limit",
            "const ship = { angle: 0.7, dx: 0, dy: 0 };\nfor (let frame = 0; frame < 400; frame++) {\n    thrustShip(ship, 0.05);\n    assert(speedOf(ship) <= MAX_SPEED + 0.001, 'frame ' + frame + ' reached ' + speedOf(ship).toFixed(1) + ' — did you call clampSpeed?');\n}"),
           ("Held down long enough, it does reach the limit",
            "const ship = { angle: 0.7, dx: 0, dy: 0 };\nfor (let frame = 0; frame < 400; frame++) { thrustShip(ship, 0.05); }\nassert(Math.abs(speedOf(ship) - MAX_SPEED) < 0.001, 'speed settled at ' + speedOf(ship).toFixed(1));"),
           ("The push always goes where the nose points",
            "for (let step = 0; step < 8; step++) {\n    const angle = step / 8 * Math.PI * 2;\n    const ship = { angle: angle, dx: 0, dy: 0 };\n    thrustShip(ship, 0.1);\n    const wanted = pointFrom(0, 0, angle, THRUST * 0.1);\n    assert(Math.abs(ship.dx - wanted.x) < 0.001 && Math.abs(ship.dy - wanted.y) < 0.001, 'angle ' + angle.toFixed(2) + ' pushed the wrong way');\n}")]),
  py=dict(starter="def thrust_ship(ship, seconds):\n    # push the ship along its nose\n    pass\n",
    answer="def thrust_ship(ship, seconds):\n    ship[\"dx\"] += math.cos(ship[\"angle\"]) * THRUST * seconds\n    ship[\"dy\"] += math.sin(ship[\"angle\"]) * THRUST * seconds\n\n    clamp_speed(ship, MAX_SPEED)\n",
    hints=["Use += so you ADD to dx and dy rather than replacing them.",
           "Same cos/sin pairing as point_from: cos with x, sin with y.",
           "Last line: clamp_speed(ship, MAX_SPEED)"],
    tests=[("A ship pointing right speeds up to the right",
            "ship = {'angle': 0, 'dx': 0, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert abs(ship['dx'] - THRUST * 0.1) < 0.001\nassert abs(ship['dy']) < 0.001"),
           ("A ship pointing up speeds up upwards",
            "ship = {'angle': -math.pi / 2, 'dx': 0, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert ship['dy'] < 0, 'up the screen is negative'\nassert abs(ship['dx']) < 0.001"),
           ("It ADDS to the speed the ship already had",
            "ship = {'angle': 0, 'dx': 50, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert ship['dx'] > 50, 'did you replace dx instead of adding to it?'"),
           ("Thrusting backwards slows you down before it turns you round",
            "ship = {'angle': math.pi, 'dx': 100, 'dy': 0}\nthrust_ship(ship, 0.1)\nassert 0 < ship['dx'] < 100, 'one short burst should slow it, not reverse it'"),
           ("A longer frame pushes harder",
            "slow = {'angle': 0, 'dx': 0, 'dy': 0}\nfast = {'angle': 0, 'dx': 0, 'dy': 0}\nthrust_ship(slow, 0.05)\nthrust_ship(fast, 0.10)\nassert abs(fast['dx'] - slow['dx'] * 2) < 0.001"),
           ("You can never break the speed limit",
            "ship = {'angle': 0.7, 'dx': 0, 'dy': 0}\nfor frame in range(400):\n    thrust_ship(ship, 0.05)\n    assert speed_of(ship) <= MAX_SPEED + 0.001, f'frame {frame} reached {speed_of(ship):.1f} — did you call clamp_speed?'"),
           ("Held down long enough, it does reach the limit",
            "ship = {'angle': 0.7, 'dx': 0, 'dy': 0}\nfor frame in range(400):\n    thrust_ship(ship, 0.05)\nassert abs(speed_of(ship) - MAX_SPEED) < 0.001"),
           ("The push always goes where the nose points",
            "for step in range(8):\n    angle = step / 8 * math.pi * 2\n    ship = {'angle': angle, 'dx': 0, 'dy': 0}\n    thrust_ship(ship, 0.1)\n    wanted = point_from(0, 0, angle, THRUST * 0.1)\n    assert abs(ship['dx'] - wanted['x']) < 0.001 and abs(ship['dy'] - wanted['y']) < 0.001, f'angle {angle:.2f} pushed the wrong way'")]),
  demo=dict(kind="drift", caption="Thrust, then let go. The ship keeps going — that is the speed it kept.")),

step("drift_ship", "driftShip", "drift_ship",
  "Space is not quite empty", "The ship slows down when you let go.",
  "<p>Real space would let the ship coast for ever. This game does not, because a ship that never slows down is exhausting to fly. So when the engine is off, the speed is multiplied by a shade less than 1 every frame.</p>"
  + fig("Each frame keeps most of the speed and loses a little. It fades rather than stopping dead.",
        svg('<path d="M30,110 L118,110"' + ARROW + '/>'
            '<path d="M30,140 L100,140"' + ARROW + '/>'
            '<path d="M30,170 L86,170"' + ARROW + '/>'
            '<path d="M30,80 L142,80"' + ARROW + '/>'
            '<path d="M30,50 L170,50"' + ARROW + '/>'
            '<text x="184" y="55"' + SMALL + '>frame 1</text>'
            '<text x="184" y="175"' + SMALL + '>frame 5</text>'
            '<text x="184" y="115"' + SMALL + '>...</text>')) +
  "<p>Notice the shape of the sum: <code>1 - DRIFT_SLOWDOWN * seconds</code>, not a flat <code>0.99</code>. Tie the slowdown to <em>time</em> and the ship drifts identically on a fast computer and a slow one. A flat number would make the game feel different on every machine.</p>",
  "ship — the ship. seconds — how long this frame lasted.",
  "nothing; it changes the ship's dx and dy",
  ["Work out slow = 1 − DRIFT_SLOWDOWN × seconds.",
   "Multiply dx by it.",
   "Multiply dy by the same thing."],
  js=dict(starter="function driftShip(ship, seconds) {\n    // let the speed fade\n}\n",
    answer="function driftShip(ship, seconds) {\n    const slow = 1 - DRIFT_SLOWDOWN * seconds;\n    ship.dx = ship.dx * slow;\n    ship.dy = ship.dy * slow;\n}\n",
    hints=["Work the fraction out once, then use it on both dx and dy.",
           "It must be just UNDER 1 — that is what makes it fade slowly.",
           "const slow = 1 - DRIFT_SLOWDOWN * seconds;"],
    tests=[("A ship at rest stays at rest",
            "const ship = { dx: 0, dy: 0 };\ndriftShip(ship, 0.1);\nassert(ship.dx === 0 && ship.dy === 0);"),
           ("A moving ship slows a little",
            "const ship = { dx: 100, dy: 0 };\ndriftShip(ship, 0.1);\nassert(ship.dx < 100, 'dx is ' + ship.dx);\nassert(ship.dx > 90, 'dx is ' + ship.dx + ' — one frame should barely change it');"),
           ("Both directions fade together",
            "const ship = { dx: 100, dy: 200 };\ndriftShip(ship, 0.1);\nassert(Math.abs(ship.dy / ship.dx - 2) < 0.0001, 'the ship changed course — both must shrink by the same fraction');"),
           ("Going backwards slows down too",
            "const ship = { dx: -100, dy: 0 };\ndriftShip(ship, 0.1);\nassert(ship.dx > -100 && ship.dx < 0, 'dx is ' + ship.dx);"),
           ("A longer frame fades more",
            "const brief = { dx: 100, dy: 0 };\nconst longer = { dx: 100, dy: 0 };\ndriftShip(brief, 0.02);\ndriftShip(longer, 0.20);\nassert(longer.dx < brief.dx, 'a longer frame should slow the ship more');"),
           ("Two short frames match one long one, near enough",
            "const twice = { dx: 100, dy: 0 };\ndriftShip(twice, 0.05);\ndriftShip(twice, 0.05);\nconst once = { dx: 100, dy: 0 };\ndriftShip(once, 0.10);\nassert(Math.abs(twice.dx - once.dx) < 0.5, 'the frame rate should barely matter: ' + twice.dx.toFixed(2) + ' vs ' + once.dx.toFixed(2));"),
           ("Left alone, the ship coasts almost to a stop",
            "const ship = { dx: 200, dy: 150 };\nfor (let frame = 0; frame < 600; frame++) { driftShip(ship, 0.05); }\nassert(speedOf(ship) < 1, 'after 30 seconds it is still going ' + speedOf(ship).toFixed(1));"),
           ("But it never turns round",
            "const ship = { dx: 200, dy: -150 };\nfor (let frame = 0; frame < 600; frame++) {\n    driftShip(ship, 0.05);\n    assert(ship.dx > 0 && ship.dy < 0, 'frame ' + frame + ': the drift reversed the ship');\n}")]),
  py=dict(starter="def drift_ship(ship, seconds):\n    # let the speed fade\n    pass\n",
    answer="def drift_ship(ship, seconds):\n    slow = 1 - DRIFT_SLOWDOWN * seconds\n    ship[\"dx\"] *= slow\n    ship[\"dy\"] *= slow\n",
    hints=["Work the fraction out once, then use it on both dx and dy.",
           "It must be just UNDER 1 — that is what makes it fade slowly.",
           "slow = 1 - DRIFT_SLOWDOWN * seconds"],
    tests=[("A ship at rest stays at rest",
            "ship = {'dx': 0, 'dy': 0}\ndrift_ship(ship, 0.1)\nassert ship == {'dx': 0, 'dy': 0}"),
           ("A moving ship slows a little",
            "ship = {'dx': 100, 'dy': 0}\ndrift_ship(ship, 0.1)\nassert 90 < ship['dx'] < 100, f\"dx is {ship['dx']}\""),
           ("Both directions fade together",
            "ship = {'dx': 100, 'dy': 200}\ndrift_ship(ship, 0.1)\nassert abs(ship['dy'] / ship['dx'] - 2) < 0.0001, 'the ship changed course'"),
           ("Going backwards slows down too",
            "ship = {'dx': -100, 'dy': 0}\ndrift_ship(ship, 0.1)\nassert -100 < ship['dx'] < 0"),
           ("A longer frame fades more",
            "brief = {'dx': 100, 'dy': 0}\nlonger = {'dx': 100, 'dy': 0}\ndrift_ship(brief, 0.02)\ndrift_ship(longer, 0.20)\nassert longer['dx'] < brief['dx']"),
           ("Two short frames match one long one, near enough",
            "twice = {'dx': 100, 'dy': 0}\ndrift_ship(twice, 0.05)\ndrift_ship(twice, 0.05)\nonce = {'dx': 100, 'dy': 0}\ndrift_ship(once, 0.10)\nassert abs(twice['dx'] - once['dx']) < 0.5, 'the frame rate should barely matter'"),
           ("Left alone, the ship coasts almost to a stop",
            "ship = {'dx': 200, 'dy': 150}\nfor frame in range(600):\n    drift_ship(ship, 0.05)\nassert speed_of(ship) < 1, f'after 30 seconds it is still going {speed_of(ship):.1f}'"),
           ("But it never turns round",
            "ship = {'dx': 200, 'dy': -150}\nfor frame in range(600):\n    drift_ship(ship, 0.05)\n    assert ship['dx'] > 0 and ship['dy'] < 0, f'frame {frame}: the drift reversed the ship'")]),
  demo=dict(kind="drift", caption="Give it one burst then let go. Watch the speed number fall away by itself.")),

step("move_thing", "moveThing", "move_thing",
  "Everything moves the same way", "One function carries the whole game along.",
  "<p>The ship, every rock and every bullet all move by exactly the same rule: <strong>new position = old position + speed × time</strong>, then wrap round the edges.</p>"
  "<p>So write it <em>once</em>. Not one function for the ship, one for rocks and one for bullets &mdash; one function that takes anything with an <code>x</code>, a <code>y</code>, a <code>dx</code> and a <code>dy</code>. This is the habit that keeps a game small: spot the thing three parts have in common and give it a name.</p>"
  "<p>Multiplying by <code>seconds</code> is what makes <code>dx</code> mean &ldquo;pixels per <em>second</em>&rdquo; rather than &ldquo;pixels per frame&rdquo;. Speeds you can read out loud, and a game that runs the same on any computer.</p>",
  "thing — anything with x, y, dx and dy. seconds — how long this frame lasted.",
  "nothing; it moves the thing",
  ["Add dx × seconds to x.",
   "Add dy × seconds to y.",
   "Call wrapPosition so it cannot leave the field."],
  js=dict(starter="function moveThing(thing, seconds) {\n    // carry it along\n}\n",
    answer="function moveThing(thing, seconds) {\n    thing.x = thing.x + thing.dx * seconds;\n    thing.y = thing.y + thing.dy * seconds;\n    wrapPosition(thing);\n}\n",
    hints=["Two lines of adding, then one call.",
           "Do not forget to multiply by seconds, or the speed will depend on the frame rate.",
           "wrapPosition(thing); goes last, after both moves."],
    tests=[("Something standing still does not move",
            "const thing = { x: 100, y: 100, dx: 0, dy: 0 };\nmoveThing(thing, 0.1);\nassert(thing.x === 100 && thing.y === 100);"),
           ("It moves by speed times time",
            "const thing = { x: 100, y: 100, dx: 60, dy: 0 };\nmoveThing(thing, 0.5);\nassert(Math.abs(thing.x - 130) < 0.001, 'x is ' + thing.x + ' — 60 per second for half a second is 30');"),
           ("Both directions at once",
            "const thing = { x: 100, y: 100, dx: 40, dy: -20 };\nmoveThing(thing, 1);\nassert(Math.abs(thing.x - 140) < 0.001);\nassert(Math.abs(thing.y - 80) < 0.001, 'y is ' + thing.y);"),
           ("Time really matters",
            "const brief = { x: 0, y: 0, dx: 100, dy: 0 };\nconst longer = { x: 0, y: 0, dx: 100, dy: 0 };\nmoveThing(brief, 0.01);\nmoveThing(longer, 0.02);\nassert(Math.abs(longer.x - brief.x * 2) < 0.001, 'twice the time should be twice the distance — did you multiply by seconds?');"),
           ("It wraps at the edge",
            "const thing = { x: FIELD_WIDTH - 5, y: 100, dx: 100, dy: 0 };\nmoveThing(thing, 0.5);\nassert(thing.x < 100, 'x is ' + thing.x + ' — it should have come back on the left');"),
           ("It works on a rock just as well as a ship",
            "const rock = { x: 10, y: 10, dx: -50, dy: -50, size: 3 };\nmoveThing(rock, 1);\nassert(rock.x > 200 && rock.y > 200, 'a rock is just a thing with x, y, dx and dy');\nassert(rock.size === 3, 'it should not have disturbed anything else on the rock');"),
           ("A hundred frames go exactly as far as you would expect",
            "const thing = { x: 0, y: 170, dx: 50, dy: 0 };\nlet travelled = 0;\nfor (let frame = 0; frame < 100; frame++) {\n    const before = thing.x;\n    moveThing(thing, 0.02);\n    let step = thing.x - before;\n    if (step < 0) { step = step + FIELD_WIDTH; }\n    travelled = travelled + step;\n}\nassert(Math.abs(travelled - 100) < 0.01, 'it covered ' + travelled.toFixed(2) + ' pixels, expected 100');")]),
  py=dict(starter="def move_thing(thing, seconds):\n    # carry it along\n    pass\n",
    answer="def move_thing(thing, seconds):\n    thing[\"x\"] += thing[\"dx\"] * seconds\n    thing[\"y\"] += thing[\"dy\"] * seconds\n    wrap_position(thing)\n",
    hints=["Two lines of adding, then one call.",
           "Do not forget to multiply by seconds, or the speed will depend on the frame rate.",
           "wrap_position(thing) goes last, after both moves."],
    tests=[("Something standing still does not move",
            "thing = {'x': 100, 'y': 100, 'dx': 0, 'dy': 0}\nmove_thing(thing, 0.1)\nassert thing['x'] == 100 and thing['y'] == 100"),
           ("It moves by speed times time",
            "thing = {'x': 100, 'y': 100, 'dx': 60, 'dy': 0}\nmove_thing(thing, 0.5)\nassert abs(thing['x'] - 130) < 0.001, '60 per second for half a second is 30'"),
           ("Both directions at once",
            "thing = {'x': 100, 'y': 100, 'dx': 40, 'dy': -20}\nmove_thing(thing, 1)\nassert abs(thing['x'] - 140) < 0.001\nassert abs(thing['y'] - 80) < 0.001"),
           ("Time really matters",
            "brief = {'x': 0, 'y': 0, 'dx': 100, 'dy': 0}\nlonger = {'x': 0, 'y': 0, 'dx': 100, 'dy': 0}\nmove_thing(brief, 0.01)\nmove_thing(longer, 0.02)\nassert abs(longer['x'] - brief['x'] * 2) < 0.001, 'did you multiply by seconds?'"),
           ("It wraps at the edge",
            "thing = {'x': FIELD_WIDTH - 5, 'y': 100, 'dx': 100, 'dy': 0}\nmove_thing(thing, 0.5)\nassert thing['x'] < 100, 'it should have come back on the left'"),
           ("It works on a rock just as well as a ship",
            "rock = {'x': 10, 'y': 10, 'dx': -50, 'dy': -50, 'size': 3}\nmove_thing(rock, 1)\nassert rock['x'] > 200 and rock['y'] > 200\nassert rock['size'] == 3, 'it should not have disturbed anything else on the rock'"),
           ("A hundred frames go exactly as far as you would expect",
            "thing = {'x': 0, 'y': 170, 'dx': 50, 'dy': 0}\ntravelled = 0\nfor frame in range(100):\n    before = thing['x']\n    move_thing(thing, 0.02)\n    step = thing['x'] - before\n    if step < 0:\n        step += FIELD_WIDTH\n    travelled += step\nassert abs(travelled - 100) < 0.01, f'it covered {travelled:.2f} pixels, expected 100'")]),
  demo=dict(kind="drift", caption="Everything you can see is being carried along by this one function.")),

step("make_bullet", "makeBullet", "make_bullet",
  "One shot", "The ship can build a bullet.",
  "<p>A bullet is just a small object: where it is, how fast it is going, and how long it has left to live. Two details make it feel right.</p>"
  + fig("The shot leaves the NOSE. Start it in the middle and the ship shoots itself.",
        svg('<circle cx="110" cy="108" r="42"' + FAINT + ' stroke-dasharray="4 4"/>'
            '<path d="M152,108 L82,84 L82,132 z"' + LINE + '/>'
            '<circle cx="110" cy="108" r="3" fill="#111"/>'
            '<circle cx="166" cy="108" r="5" fill="#111"/>'
            '<path d="M178,108 L300,108"' + ARROW + '/>'
            '<path d="M110,108 L110,66"' + THIN + '/>'
            '<text x="118" y="62"' + SMALL + '>SHIP_RADIUS + 3</text>'
            '<text x="186" y="98"' + SMALL + '>BULLET_SPEED</text>'
            '<text x="186" y="132"' + SMALL + '>+ the ship\'s own speed</text>'
            '<text x="60" y="176"' + SMALL + '>the middle</text>'
            '<path d="M96,166 L108,116"' + THIN + ' marker-end="url(#tip)"/>')) +
  "<p>First, it starts at the <strong>nose</strong>, a little way in front of the middle &mdash; otherwise the ship would be sitting inside its own shot. Second, the bullet inherits <strong>the ship's velocity</strong>, so firing while racing forwards really does throw the shot faster. Both are one call to <code>pointFrom</code> each.</p>",
  "ship — the ship firing it",
  "a new bullet: { x, y, dx, dy, life }",
  ["Use pointFrom from the ship, along its angle, SHIP_RADIUS + 3 away — that is the nose.",
   "Use pointFrom from 0, 0 along the same angle, BULLET_SPEED away — that is the flight.",
   "Give back an object at the nose, moving at the flight PLUS the ship's own dx and dy, with life set to BULLET_LIFE."],
  js=dict(starter="function makeBullet(ship) {\n    return { x: 0, y: 0, dx: 0, dy: 0, life: 0 };\n}\n",
    answer="function makeBullet(ship) {\n    const nose = pointFrom(ship.x, ship.y, ship.angle, SHIP_RADIUS + 3);\n    const flight = pointFrom(0, 0, ship.angle, BULLET_SPEED);\n\n    return {\n        x: nose.x,\n        y: nose.y,\n        dx: flight.x + ship.dx,\n        dy: flight.y + ship.dy,\n        life: BULLET_LIFE\n    };\n}\n",
    hints=["Two calls to pointFrom: one for where it starts, one for how fast it flies.",
           "Starting pointFrom at 0, 0 turns an angle and a speed into a dx and a dy.",
           "dx: flight.x + ship.dx — do not forget to add the ship's own speed."],
    tests=[("It starts in front of the ship, not on it",
            "const ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nconst bullet = makeBullet(ship);\nassert(bullet.x > 100, 'x is ' + bullet.x + ' — a ship pointing right should fire to its right');\nassert(Math.abs(bullet.x - (100 + SHIP_RADIUS + 3)) < 0.001, 'x is ' + bullet.x);"),
           ("It flies the way the ship points",
            "const ship = { x: 100, y: 100, angle: -Math.PI / 2, dx: 0, dy: 0 };\nconst bullet = makeBullet(ship);\nassert(bullet.dy < 0, 'dy is ' + bullet.dy + ' — a ship pointing up should shoot upwards');\nassert(bullet.y < 100, 'it should start above the ship too');"),
           ("It flies at BULLET_SPEED when the ship is still",
            "const ship = { x: 100, y: 100, angle: 1.2, dx: 0, dy: 0 };\nconst bullet = makeBullet(ship);\nassert(Math.abs(speedOf(bullet) - BULLET_SPEED) < 0.001, 'speed is ' + speedOf(bullet).toFixed(1));"),
           ("Firing while racing forwards throws it faster",
            "const still = makeBullet({ x: 0, y: 0, angle: 0, dx: 0, dy: 0 });\nconst racing = makeBullet({ x: 0, y: 0, angle: 0, dx: 200, dy: 0 });\nassert(racing.dx > still.dx, 'the bullet should inherit the ship\\'s speed');\nassert(Math.abs(racing.dx - (still.dx + 200)) < 0.001);"),
           ("Firing while flying backwards throws it slower",
            "const bullet = makeBullet({ x: 0, y: 0, angle: 0, dx: -100, dy: 0 });\nassert(Math.abs(bullet.dx - (BULLET_SPEED - 100)) < 0.001, 'dx is ' + bullet.dx);"),
           ("It has a life to run down",
            "const bullet = makeBullet({ x: 0, y: 0, angle: 0, dx: 0, dy: 0 });\nassert(bullet.life === BULLET_LIFE, 'life is ' + bullet.life);"),
           ("It fires correctly whichever way the ship faces",
            "for (let step = 0; step < 12; step++) {\n    const angle = step / 12 * Math.PI * 2;\n    const ship = { x: 170, y: 170, angle: angle, dx: 0, dy: 0 };\n    const bullet = makeBullet(ship);\n    assert(Math.abs(distanceBetween(ship, bullet) - (SHIP_RADIUS + 3)) < 0.001, 'angle ' + angle.toFixed(2) + ' started the shot in the wrong place');\n    assert(Math.abs(speedOf(bullet) - BULLET_SPEED) < 0.001);\n}")]),
  py=dict(starter="def make_bullet(ship):\n    return {\"x\": 0, \"y\": 0, \"dx\": 0, \"dy\": 0, \"life\": 0}\n",
    answer="def make_bullet(ship):\n    nose = point_from(ship[\"x\"], ship[\"y\"], ship[\"angle\"], SHIP_RADIUS + 3)\n    flight = point_from(0, 0, ship[\"angle\"], BULLET_SPEED)\n\n    return {\n        \"x\": nose[\"x\"],\n        \"y\": nose[\"y\"],\n        \"dx\": flight[\"x\"] + ship[\"dx\"],\n        \"dy\": flight[\"y\"] + ship[\"dy\"],\n        \"life\": BULLET_LIFE,\n    }\n",
    hints=["Two calls to point_from: one for where it starts, one for how fast it flies.",
           "Starting point_from at 0, 0 turns an angle and a speed into a dx and a dy.",
           "'dx': flight['x'] + ship['dx'] — do not forget to add the ship's own speed."],
    tests=[("It starts in front of the ship, not on it",
            "ship = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nbullet = make_bullet(ship)\nassert bullet['x'] > 100\nassert abs(bullet['x'] - (100 + SHIP_RADIUS + 3)) < 0.001"),
           ("It flies the way the ship points",
            "ship = {'x': 100, 'y': 100, 'angle': -math.pi / 2, 'dx': 0, 'dy': 0}\nbullet = make_bullet(ship)\nassert bullet['dy'] < 0, 'a ship pointing up should shoot upwards'\nassert bullet['y'] < 100"),
           ("It flies at BULLET_SPEED when the ship is still",
            "ship = {'x': 100, 'y': 100, 'angle': 1.2, 'dx': 0, 'dy': 0}\nbullet = make_bullet(ship)\nassert abs(speed_of(bullet) - BULLET_SPEED) < 0.001"),
           ("Firing while racing forwards throws it faster",
            "still = make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0})\nracing = make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': 200, 'dy': 0})\nassert racing['dx'] > still['dx']\nassert abs(racing['dx'] - (still['dx'] + 200)) < 0.001"),
           ("Firing while flying backwards throws it slower",
            "bullet = make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': -100, 'dy': 0})\nassert abs(bullet['dx'] - (BULLET_SPEED - 100)) < 0.001"),
           ("It has a life to run down",
            "bullet = make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0})\nassert bullet['life'] == BULLET_LIFE"),
           ("It fires correctly whichever way the ship faces",
            "for step in range(12):\n    angle = step / 12 * math.pi * 2\n    ship = {'x': 170, 'y': 170, 'angle': angle, 'dx': 0, 'dy': 0}\n    bullet = make_bullet(ship)\n    assert abs(distance_between(ship, bullet) - (SHIP_RADIUS + 3)) < 0.001, f'angle {angle:.2f} started the shot in the wrong place'\n    assert abs(speed_of(bullet) - BULLET_SPEED) < 0.001")]),
  demo=dict(kind="shoot", caption="Press Fire. Every shot leaves the nose, pointing wherever you are.")),

step("fire_bullet", "fireBullet", "fire_bullet",
  "Shoot — if you may", "The fire button works, within limits.",
  "<p>Making a bullet and being <em>allowed</em> to fire one are different questions, so they are different functions. This one is about the rules: there are three reasons to refuse.</p>"
  "<p>The game is over. The game is paused. Or there are already <code>MAX_BULLETS</code> in the air &mdash; without that last one you could hold the fire button and sweep the field clean without ever aiming.</p>"
  "<p>Three refusals, one <code>if</code>, joined with <em>or</em>. Getting the awkward cases out of the way at the top &mdash; a <strong>guard clause</strong> &mdash; leaves the real work as three plain lines with nothing indented around them.</p>",
  "state — the whole game",
  "true if a shot was actually fired, false if it was refused",
  ["If the game is over, or paused, or there are already MAX_BULLETS flying, give back false.",
   "Otherwise add makeBullet(state.ship) to the bullet list.",
   "Count the shot, and give back true."],
  js=dict(starter="function fireBullet(state) {\n    return false;\n}\n",
    answer="function fireBullet(state) {\n    if (state.isOver || state.isPaused || state.bullets.length >= MAX_BULLETS) {\n        return false;\n    }\n    state.bullets.push(makeBullet(state.ship));\n    state.shots = state.shots + 1;\n    return true;\n}\n",
    hints=["One if with three tests joined by || — the JavaScript word for 'or'.",
           "state.bullets.length >= MAX_BULLETS is the 'too many in the air' test.",
           "After the guard: push, count, return true."],
    tests=[("A fresh game can fire",
            "const state = createGame();\nassert(fireBullet(state) === true);\nassert(state.bullets.length === 1);"),
           ("The shot counter goes up",
            "const state = createGame();\nfireBullet(state);\nassert(state.shots === 1, 'shots is ' + state.shots);"),
           ("A finished game cannot fire",
            "const state = createGame();\nstate.isOver = true;\nassert(fireBullet(state) === false);\nassert(state.bullets.length === 0, 'it fired anyway');"),
           ("A paused game cannot fire",
            "const state = createGame();\nstate.isPaused = true;\nassert(fireBullet(state) === false);\nassert(state.bullets.length === 0);"),
           ("Only MAX_BULLETS may be in the air",
            "const state = createGame();\nfor (let i = 0; i < MAX_BULLETS; i++) {\n    assert(fireBullet(state) === true, 'shot ' + (i + 1) + ' should have been allowed');\n}\nassert(fireBullet(state) === false, 'the ' + (MAX_BULLETS + 1) + 'th shot should be refused');\nassert(state.bullets.length === MAX_BULLETS, 'there are ' + state.bullets.length + ' bullets flying');"),
           ("A refused shot is not counted",
            "const state = createGame();\nstate.isPaused = true;\nfireBullet(state);\nassert(state.shots === 0, 'shots is ' + state.shots + ' — a refused shot is not a shot');"),
           ("Once a bullet clears, you may fire again",
            "const state = createGame();\nfor (let i = 0; i < MAX_BULLETS; i++) { fireBullet(state); }\nstate.bullets.pop();\nassert(fireBullet(state) === true, 'making room should let the next shot through');"),
           ("Holding the button down never floods the field",
            "const state = createGame();\nfor (let press = 0; press < 500; press++) {\n    fireBullet(state);\n    assert(state.bullets.length <= MAX_BULLETS, 'press ' + press + ': ' + state.bullets.length + ' bullets are flying');\n}")]),
  py=dict(starter="def fire_bullet(state):\n    return False\n",
    answer="def fire_bullet(state):\n    if state[\"is_over\"] or state[\"is_paused\"] or len(state[\"bullets\"]) >= MAX_BULLETS:\n        return False\n    state[\"bullets\"].append(make_bullet(state[\"ship\"]))\n    state[\"shots\"] += 1\n    return True\n",
    hints=["One if with three tests joined by or.",
           "len(state['bullets']) >= MAX_BULLETS is the 'too many in the air' test.",
           "After the guard: append, count, return True."],
    tests=[("A fresh game can fire",
            "state = create_game()\nassert fire_bullet(state) is True\nassert len(state['bullets']) == 1"),
           ("The shot counter goes up",
            "state = create_game()\nfire_bullet(state)\nassert state['shots'] == 1"),
           ("A finished game cannot fire",
            "state = create_game()\nstate['is_over'] = True\nassert fire_bullet(state) is False\nassert state['bullets'] == []"),
           ("A paused game cannot fire",
            "state = create_game()\nstate['is_paused'] = True\nassert fire_bullet(state) is False\nassert state['bullets'] == []"),
           ("Only MAX_BULLETS may be in the air",
            "state = create_game()\nfor i in range(MAX_BULLETS):\n    assert fire_bullet(state) is True, f'shot {i + 1} should have been allowed'\nassert fire_bullet(state) is False\nassert len(state['bullets']) == MAX_BULLETS"),
           ("A refused shot is not counted",
            "state = create_game()\nstate['is_paused'] = True\nfire_bullet(state)\nassert state['shots'] == 0, 'a refused shot is not a shot'"),
           ("Once a bullet clears, you may fire again",
            "state = create_game()\nfor i in range(MAX_BULLETS):\n    fire_bullet(state)\nstate['bullets'].pop()\nassert fire_bullet(state) is True"),
           ("Holding the button down never floods the field",
            "state = create_game()\nfor press in range(500):\n    fire_bullet(state)\n    assert len(state['bullets']) <= MAX_BULLETS, f\"press {press}: {len(state['bullets'])} bullets are flying\"")]),
  demo=dict(kind="shoot", caption="Hammer the Fire button. Only four shots are ever in the air at once.")),

step("age_bullets", "ageBullets", "age_bullets",
  "Shots run out", "Bullets fade instead of flying for ever.",
  "<p>Every bullet carries a <code>life</code>, counting down in seconds. Take this frame's time off each one and keep only the survivors.</p>"
  + fig("Each frame takes a slice off every bullet's life. At zero it is gone.",
        svg('<text x="30" y="42"' + SMALL + '>bullet 1</text>'
            '<rect x="106" y="30" width="180" height="15"' + THIN + '/>'
            '<rect x="106" y="30" width="150" height="15" fill="#111"/>'
            '<text x="30" y="82"' + SMALL + '>bullet 2</text>'
            '<rect x="106" y="70" width="180" height="15"' + THIN + '/>'
            '<rect x="106" y="70" width="86" height="15" fill="#111"/>'
            '<text x="30" y="122"' + SMALL + '>bullet 3</text>'
            '<rect x="106" y="110" width="180" height="15"' + THIN + '/>'
            '<rect x="106" y="110" width="22" height="15" fill="#111"/>'
            '<text x="30" y="162"' + SMALL + '>bullet 4</text>'
            '<rect x="106" y="150" width="180" height="15"' + THIN + '/>'
            '<path d="M106,150 L286,165 M106,165 L286,150"' + THIN + '/>'
            '<text x="296" y="162"' + SMALL + '>gone</text>'
            '<text x="296" y="42"' + SMALL + '>kept</text>')) +
  "<p>Build a <strong>new list</strong> rather than deleting from the old one. Removing items from a list while you are still walking along it is one of the classic ways to skip an item by accident &mdash; the list gets shorter under your feet. Collecting the keepers into a fresh list simply cannot go wrong.</p>",
  "bullets — the list of bullets. seconds — how long this frame lasted.",
  "a NEW list, holding only the bullets still alive",
  ["Start an empty list.",
   "For each bullet, take seconds off its life.",
   "If it still has life left, put it in the new list.",
   "Give the new list back."],
  js=dict(starter="function ageBullets(bullets, seconds) {\n    return bullets;\n}\n",
    answer="function ageBullets(bullets, seconds) {\n    const flying = [];\n    for (let i = 0; i < bullets.length; i++) {\n        bullets[i].life = bullets[i].life - seconds;\n        if (bullets[i].life > 0) {\n            flying.push(bullets[i]);\n        }\n    }\n    return flying;\n}\n",
    hints=["Make an empty array first, and push the survivors into it.",
           "Take the time off EVERY bullet, then decide whether to keep it.",
           "return flying; — the caller does state.bullets = ageBullets(...)."],
    tests=[("An empty list stays empty",
            "assert(ageBullets([], 0.1).length === 0);"),
           ("A young bullet survives",
            "const flying = ageBullets([{ life: 1.0 }], 0.1);\nassert(flying.length === 1);"),
           ("Its life really does go down",
            "const bullets = [{ life: 1.0 }];\nconst flying = ageBullets(bullets, 0.25);\nassert(Math.abs(flying[0].life - 0.75) < 0.001, 'life is ' + flying[0].life);"),
           ("A spent bullet is dropped",
            "const flying = ageBullets([{ life: 0.05 }], 0.1);\nassert(flying.length === 0, 'a bullet with 0.05 left cannot survive a 0.1 second frame');"),
           ("It keeps the living and drops the dead, in one pass",
            "const flying = ageBullets([{ life: 0.05 }, { life: 1.0 }, { life: 0.02 }, { life: 0.5 }], 0.1);\nassert(flying.length === 2, 'kept ' + flying.length + ', expected 2');"),
           ("The survivors keep their order",
            "const flying = ageBullets([{ life: 1.0, tag: 'a' }, { life: 0.01, tag: 'b' }, { life: 1.0, tag: 'c' }], 0.1);\nassert(flying[0].tag === 'a' && flying[1].tag === 'c', 'got ' + flying.map(function (b) { return b.tag; }).join(','));"),
           ("Nothing is ever skipped",
            "const bullets = [];\nfor (let i = 0; i < 6; i++) { bullets.push({ life: 0.05, tag: i }); }\nconst flying = ageBullets(bullets, 0.1);\nassert(flying.length === 0, 'six spent bullets should all go — ' + flying.length + ' survived. Deleting from a list while looping over it skips items.');"),
           ("A bullet lives for about BULLET_LIFE seconds",
            "let bullets = [makeBullet({ x: 0, y: 0, angle: 0, dx: 0, dy: 0 })];\nlet frames = 0;\nfor (let i = 0; i < 1000 && bullets.length > 0; i++) {\n    bullets = ageBullets(bullets, 0.02);\n    frames = frames + 1;\n}\nconst lasted = frames * 0.02;\nassert(Math.abs(lasted - BULLET_LIFE) < 0.05, 'it lasted ' + lasted.toFixed(2) + ' seconds, expected about ' + BULLET_LIFE);")]),
  py=dict(starter="def age_bullets(bullets, seconds):\n    return bullets\n",
    answer="def age_bullets(bullets, seconds):\n    flying = []\n    for bullet in bullets:\n        bullet[\"life\"] -= seconds\n        if bullet[\"life\"] > 0:\n            flying.append(bullet)\n    return flying\n",
    hints=["Make an empty list first, and append the survivors to it.",
           "Take the time off EVERY bullet, then decide whether to keep it.",
           "return flying — the caller does state['bullets'] = age_bullets(...)."],
    tests=[("An empty list stays empty",
            "assert age_bullets([], 0.1) == []"),
           ("A young bullet survives",
            "flying = age_bullets([{'life': 1.0}], 0.1)\nassert len(flying) == 1"),
           ("Its life really does go down",
            "flying = age_bullets([{'life': 1.0}], 0.25)\nassert abs(flying[0]['life'] - 0.75) < 0.001"),
           ("A spent bullet is dropped",
            "flying = age_bullets([{'life': 0.05}], 0.1)\nassert flying == []"),
           ("It keeps the living and drops the dead, in one pass",
            "flying = age_bullets([{'life': 0.05}, {'life': 1.0}, {'life': 0.02}, {'life': 0.5}], 0.1)\nassert len(flying) == 2, f'kept {len(flying)}, expected 2'"),
           ("The survivors keep their order",
            "flying = age_bullets([{'life': 1.0, 'tag': 'a'}, {'life': 0.01, 'tag': 'b'}, {'life': 1.0, 'tag': 'c'}], 0.1)\nassert [b['tag'] for b in flying] == ['a', 'c']"),
           ("Nothing is ever skipped",
            "bullets = [{'life': 0.05, 'tag': i} for i in range(6)]\nflying = age_bullets(bullets, 0.1)\nassert flying == [], f'six spent bullets should all go — {len(flying)} survived'"),
           ("A bullet lives for about BULLET_LIFE seconds",
            "bullets = [make_bullet({'x': 0, 'y': 0, 'angle': 0, 'dx': 0, 'dy': 0})]\nframes = 0\nfor i in range(1000):\n    if not bullets:\n        break\n    bullets = age_bullets(bullets, 0.02)\n    frames += 1\nlasted = frames * 0.02\nassert abs(lasted - BULLET_LIFE) < 0.05, f'it lasted {lasted:.2f} seconds, expected about {BULLET_LIFE}'")]),
  demo=dict(kind="shoot", caption="Fire and watch. Each shot fades out after about a second — that is its life running down.")),

step("make_rock", "makeRock", "make_rock",
  "One rock", "Rocks appear, each drifting its own way.",
  "<p>A rock needs a place, a size, and a direction to drift &mdash; and the drift should be <strong>random</strong>, so no two games are the same.</p>"
  + fig("Same spot, same speed, a different random angle each time.",
        svg('<circle cx="180" cy="100" r="20"' + LINE + '/>'
            '<path d="M180,100 L300,100"' + ARROW + '/>'
            '<path d="M180,100 L262,34"' + ARROW + '/>'
            '<path d="M180,100 L180,22"' + ARROW + '/>'
            '<path d="M180,100 L92,42"' + ARROW + '/>'
            '<path d="M180,100 L64,116"' + ARROW + '/>'
            '<path d="M180,100 L124,172"' + ARROW + '/>'
            '<text x="180" y="196"' + SMALL + ' text-anchor="middle">'
            'a random angle, but always ROCK_SPEED[size] fast</text>')) +
  "<p>Pick a random angle anywhere round the circle, then hand it to <code>pointFrom</code> starting at 0, 0 with the speed for that size &mdash; the same trick that turned the ship's angle into a <code>dx</code> and <code>dy</code>. Random <em>direction</em>, fixed <em>speed</em>: that is how you keep a game unpredictable without making it unfair.</p>"
  "<p>Two more numbers: <code>spin</code>, how fast it tumbles, and <code>wobble</code>, which decides the shape of its lumpy outline in the next step.</p>",
  "x, y — where it starts. size — 3, 2 or 1.",
  "a new rock: { x, y, size, dx, dy, spin, wobble }",
  ["Pick a random angle anywhere from 0 to a whole turn.",
   "Use pointFrom from 0, 0 along that angle, ROCK_SPEED[size] away — that gives dx and dy.",
   "Give back the rock, with a random spin between −1 and 1 and a random wobble."],
  js=dict(starter="function makeRock(x, y, size) {\n    return { x: x, y: y, size: size, dx: 0, dy: 0, spin: 0, wobble: 0 };\n}\n",
    answer="function makeRock(x, y, size) {\n    const angle = Math.random() * Math.PI * 2;\n    const drift = pointFrom(0, 0, angle, ROCK_SPEED[size]);\n\n    return {\n        x: x, y: y, size: size,\n        dx: drift.x, dy: drift.y,\n        spin: Math.random() * 2 - 1,\n        wobble: Math.floor(Math.random() * 1000)\n    };\n}\n",
    hints=["Math.random() gives a number from 0 up to 1. Times 2π covers every direction.",
           "pointFrom(0, 0, angle, ROCK_SPEED[size]) turns that into dx and dy.",
           "Math.random() * 2 - 1 gives a number between −1 and 1, for the spin."],
    tests=[("It starts where you put it",
            "const rock = makeRock(50, 70, 3);\nassert(rock.x === 50 && rock.y === 70);"),
           ("It remembers its size",
            "assert(makeRock(0, 0, 2).size === 2);"),
           ("It is always moving",
            "for (let i = 0; i < 30; i++) {\n    const rock = makeRock(0, 0, 3);\n    assert(speedOf(rock) > 0, 'a rock that does not drift is no fun');\n}"),
           ("It drifts at exactly the speed for its size",
            "for (const size of [1, 2, 3]) {\n    for (let i = 0; i < 20; i++) {\n        const rock = makeRock(0, 0, size);\n        assert(Math.abs(speedOf(rock) - ROCK_SPEED[size]) < 0.001, 'size ' + size + ' drifted at ' + speedOf(rock).toFixed(1) + ', expected ' + ROCK_SPEED[size]);\n    }\n}"),
           ("Small rocks are faster than big ones",
            "assert(ROCK_SPEED[1] > ROCK_SPEED[3], 'that is what makes the last few rocks the hard part');"),
           ("Two rocks made the same way still go different ways",
            "let different = 0;\nconst first = makeRock(0, 0, 3);\nfor (let i = 0; i < 20; i++) {\n    const other = makeRock(0, 0, 3);\n    if (Math.abs(other.dx - first.dx) > 0.001) { different = different + 1; }\n}\nassert(different > 15, 'only ' + different + ' of 20 drifted differently — is the angle really random?');"),
           ("Over many rocks, every direction turns up",
            "let left = 0, right = 0, up = 0, down = 0;\nfor (let i = 0; i < 400; i++) {\n    const rock = makeRock(0, 0, 3);\n    if (rock.dx < 0) { left++; } else { right++; }\n    if (rock.dy < 0) { up++; } else { down++; }\n}\nassert(left > 100 && right > 100, 'sideways split was ' + left + '/' + right);\nassert(up > 100 && down > 100, 'up-down split was ' + up + '/' + down);"),
           ("The spin stays between −1 and 1",
            "for (let i = 0; i < 100; i++) {\n    const rock = makeRock(0, 0, 3);\n    assert(rock.spin >= -1 && rock.spin <= 1, 'spin is ' + rock.spin);\n}")]),
  py=dict(starter="def make_rock(x, y, size):\n    return {\"x\": x, \"y\": y, \"size\": size, \"dx\": 0, \"dy\": 0, \"spin\": 0, \"wobble\": 0}\n",
    answer="def make_rock(x, y, size):\n    angle = random.uniform(0, math.pi * 2)\n    drift = point_from(0, 0, angle, ROCK_SPEED[size])\n    return {\n        \"x\": x, \"y\": y, \"size\": size,\n        \"dx\": drift[\"x\"], \"dy\": drift[\"y\"],\n        \"spin\": random.uniform(-1, 1),\n        \"wobble\": random.randrange(1000),\n    }\n",
    hints=["random.uniform(0, math.pi * 2) picks any direction at all.",
           "point_from(0, 0, angle, ROCK_SPEED[size]) turns that into dx and dy.",
           "random.uniform(-1, 1) is the tidy way to get the spin."],
    tests=[("It starts where you put it",
            "rock = make_rock(50, 70, 3)\nassert rock['x'] == 50 and rock['y'] == 70"),
           ("It remembers its size",
            "assert make_rock(0, 0, 2)['size'] == 2"),
           ("It is always moving",
            "for i in range(30):\n    assert speed_of(make_rock(0, 0, 3)) > 0, 'a rock that does not drift is no fun'"),
           ("It drifts at exactly the speed for its size",
            "for size in (1, 2, 3):\n    for i in range(20):\n        rock = make_rock(0, 0, size)\n        assert abs(speed_of(rock) - ROCK_SPEED[size]) < 0.001, f'size {size} drifted at {speed_of(rock):.1f}'"),
           ("Small rocks are faster than big ones",
            "assert ROCK_SPEED[1] > ROCK_SPEED[3], 'that is what makes the last few rocks the hard part'"),
           ("Two rocks made the same way still go different ways",
            "first = make_rock(0, 0, 3)\ndifferent = sum(1 for i in range(20) if abs(make_rock(0, 0, 3)['dx'] - first['dx']) > 0.001)\nassert different > 15, f'only {different} of 20 drifted differently — is the angle really random?'"),
           ("Over many rocks, every direction turns up",
            "rocks = [make_rock(0, 0, 3) for i in range(400)]\nleft = sum(1 for r in rocks if r['dx'] < 0)\nup = sum(1 for r in rocks if r['dy'] < 0)\nassert 100 < left < 300, f'sideways split was {left}/400'\nassert 100 < up < 300, f'up-down split was {up}/400'"),
           ("The spin stays between -1 and 1",
            "for i in range(100):\n    rock = make_rock(0, 0, 3)\n    assert -1 <= rock['spin'] <= 1, f\"spin is {rock['spin']}\"")]),
  demo=dict(kind="rock", caption="Press New Rock a few times. Same spot, same speed — a different heading every time.")),

step("rock_points", "rockPoints", "rock_points",
  "The shape of a rock", "Rocks stop being circles.",
  "<p>A rock drawn as a plain circle looks like a bubble. A rock drawn as a lumpy nine-sided shape looks like a rock. The difference is one loop.</p>"
  + fig("Walk round the circle in nine equal steps. Push each corner in or out a little, then join them up.",
        svg('<circle cx="180" cy="100" r="62"' + FAINT + ' stroke-dasharray="4 4"/>'
            '<path d="M180,100 L228.4,100 M180,100 L224.8,137.6 M180,100 L190.7,161 '
            'M180,100 L151.9,148.7 M180,100 L131.7,117.6 M180,100 L123.7,79.5 '
            'M180,100 L149.3,46.9 M180,100 L189.3,47.3 M180,100 L221.6,65.1"' + FAINT + '/>'
            '<polygon points="228.4,100 224.8,137.6 190.7,161 151.9,148.7 131.7,117.6 '
            '123.7,79.5 149.3,46.9 189.3,47.3 221.6,65.1"' + LINE + '/>'
            '<circle cx="180" cy="100" r="3" fill="#111"/>'
            '<text x="238" y="92"' + SMALL + '>corner 0</text>'
            '<text x="96" y="192"' + SMALL + '>ROCK_CORNERS = 9</text>')) +
  "<p>Here is the idea worth taking away: <strong>the shape is data, not a drawing</strong>. This function hands back a list of points and never touches the canvas. The drawing code becomes &ldquo;join these up&rdquo; &mdash; and a list of points is something you can test, while a picture is not.</p>"
  "<p>The <code>wobble</code> number is what makes each rock its own shape. Feed the same wobble in and you get the same rock back every time, which is why a rock does not shimmer as it drifts.</p>",
  "rock — a rock, with an x, a y, a size and a wobble",
  "a list of ROCK_CORNERS points, all the way round",
  ["Look up the radius for this rock's size.",
   "For each corner from 0 to ROCK_CORNERS: work out its angle round the circle, plus the wobble.",
   "Work out a lumpy radius: radius × (0.78 + 0.22 × |sin(i × 2.3 + wobble)|).",
   "Use pointFrom to turn that angle and radius into a point, and collect them all."],
  js=dict(starter="function rockPoints(rock) {\n    return [];\n}\n",
    answer="function rockPoints(rock) {\n    const radius = ROCK_RADIUS[rock.size];\n    const points = [];\n\n    for (let i = 0; i < ROCK_CORNERS; i++) {\n        const angle = i / ROCK_CORNERS * Math.PI * 2 + rock.wobble;\n        const lumpy = radius * (0.78 + 0.22 * Math.abs(Math.sin(i * 2.3 + rock.wobble)));\n        points.push(pointFrom(rock.x, rock.y, angle, lumpy));\n    }\n    return points;\n}\n",
    hints=["i / ROCK_CORNERS * Math.PI * 2 spreads the corners evenly round the circle.",
           "Adding rock.wobble to the angle is what makes the rock tumble as it spins.",
           "points.push(pointFrom(rock.x, rock.y, angle, lumpy));"],
    tests=[("It gives back the right number of corners",
            "const points = rockPoints({ x: 100, y: 100, size: 3, wobble: 0 });\nassert(points.length === ROCK_CORNERS, 'got ' + points.length + ', expected ' + ROCK_CORNERS);"),
           ("Every corner is a proper point",
            "const points = rockPoints({ x: 100, y: 100, size: 3, wobble: 0 });\nfor (const p of points) {\n    assert(typeof p.x === 'number' && typeof p.y === 'number', 'a corner came back as ' + JSON.stringify(p));\n}"),
           ("The corners sit around the rock, not somewhere else",
            "const rock = { x: 200, y: 150, size: 3, wobble: 0 };\nfor (const p of rockPoints(rock)) {\n    assert(distanceBetween(rock, p) <= ROCK_RADIUS[3] + 0.001, 'a corner was ' + distanceBetween(rock, p).toFixed(1) + ' from the middle, but the radius is only ' + ROCK_RADIUS[3]);\n}"),
           ("It is lumpy, not a perfect circle",
            "const rock = { x: 100, y: 100, size: 3, wobble: 0 };\nconst aways = rockPoints(rock).map(function (p) { return distanceBetween(rock, p); });\nconst near = Math.min.apply(null, aways);\nconst far = Math.max.apply(null, aways);\nassert(far - near > 2, 'every corner is the same distance out — that is a circle, not a rock');"),
           ("But not TOO lumpy",
            "const rock = { x: 100, y: 100, size: 3, wobble: 0 };\nfor (const p of rockPoints(rock)) {\n    assert(distanceBetween(rock, p) > ROCK_RADIUS[3] * 0.7, 'a corner collapsed almost into the middle');\n}"),
           ("A small rock makes a small shape",
            "const big = rockPoints({ x: 0, y: 0, size: 3, wobble: 4 });\nconst small = rockPoints({ x: 0, y: 0, size: 1, wobble: 4 });\nconst reach = function (points) { return Math.max.apply(null, points.map(function (p) { return Math.sqrt(p.x * p.x + p.y * p.y); })); };\nassert(reach(small) < reach(big), 'a size 1 rock should be smaller than a size 3 one');"),
           ("Two rocks with different wobbles are different shapes",
            "const a = rockPoints({ x: 0, y: 0, size: 3, wobble: 0 });\nconst b = rockPoints({ x: 0, y: 0, size: 3, wobble: 7 });\nlet moved = 0;\nfor (let i = 0; i < a.length; i++) {\n    if (Math.abs(a[i].x - b[i].x) > 0.5) { moved = moved + 1; }\n}\nassert(moved > 5, 'only ' + moved + ' corners differ — is the wobble really in the sum?');"),
           ("The same rock always gives the same shape",
            "const rock = { x: 30, y: 40, size: 2, wobble: 3.7 };\nconst first = rockPoints(rock);\nconst again = rockPoints(rock);\nfor (let i = 0; i < first.length; i++) {\n    assert(first[i].x === again[i].x && first[i].y === again[i].y, 'corner ' + i + ' moved between two calls — a rock must not shimmer');\n}"),
           ("Moving the rock moves every corner with it",
            "const here = rockPoints({ x: 0, y: 0, size: 3, wobble: 2 });\nconst there = rockPoints({ x: 50, y: 20, size: 3, wobble: 2 });\nfor (let i = 0; i < here.length; i++) {\n    assert(Math.abs(there[i].x - here[i].x - 50) < 0.001 && Math.abs(there[i].y - here[i].y - 20) < 0.001, 'corner ' + i + ' did not travel with the rock');\n}")]),
  py=dict(starter="def rock_points(rock):\n    return []\n",
    answer="def rock_points(rock):\n    radius = ROCK_RADIUS[rock[\"size\"]]\n    points = []\n\n    for i in range(ROCK_CORNERS):\n        angle = i / ROCK_CORNERS * math.pi * 2 + rock[\"wobble\"]\n        lumpy = radius * (0.78 + 0.22 * abs(math.sin(i * 2.3 + rock[\"wobble\"])))\n        points.append(point_from(rock[\"x\"], rock[\"y\"], angle, lumpy))\n    return points\n",
    hints=["i / ROCK_CORNERS * math.pi * 2 spreads the corners evenly round the circle.",
           "Adding rock['wobble'] to the angle is what makes the rock tumble as it spins.",
           "points.append(point_from(rock['x'], rock['y'], angle, lumpy))"],
    tests=[("It gives back the right number of corners",
            "points = rock_points({'x': 100, 'y': 100, 'size': 3, 'wobble': 0})\nassert len(points) == ROCK_CORNERS, f'got {len(points)}, expected {ROCK_CORNERS}'"),
           ("Every corner is a proper point",
            "for p in rock_points({'x': 100, 'y': 100, 'size': 3, 'wobble': 0}):\n    assert 'x' in p and 'y' in p, f'a corner came back as {p}'"),
           ("The corners sit around the rock, not somewhere else",
            "rock = {'x': 200, 'y': 150, 'size': 3, 'wobble': 0}\nfor p in rock_points(rock):\n    assert distance_between(rock, p) <= ROCK_RADIUS[3] + 0.001, 'a corner escaped the radius'"),
           ("It is lumpy, not a perfect circle",
            "rock = {'x': 100, 'y': 100, 'size': 3, 'wobble': 0}\naways = [distance_between(rock, p) for p in rock_points(rock)]\nassert max(aways) - min(aways) > 2, 'every corner is the same distance out — that is a circle, not a rock'"),
           ("But not TOO lumpy",
            "rock = {'x': 100, 'y': 100, 'size': 3, 'wobble': 0}\nfor p in rock_points(rock):\n    assert distance_between(rock, p) > ROCK_RADIUS[3] * 0.7, 'a corner collapsed almost into the middle'"),
           ("A small rock makes a small shape",
            "reach = lambda pts: max(math.sqrt(p['x'] ** 2 + p['y'] ** 2) for p in pts)\nbig = rock_points({'x': 0, 'y': 0, 'size': 3, 'wobble': 4})\nsmall = rock_points({'x': 0, 'y': 0, 'size': 1, 'wobble': 4})\nassert reach(small) < reach(big)"),
           ("Two rocks with different wobbles are different shapes",
            "a = rock_points({'x': 0, 'y': 0, 'size': 3, 'wobble': 0})\nb = rock_points({'x': 0, 'y': 0, 'size': 3, 'wobble': 7})\nmoved = sum(1 for i in range(len(a)) if abs(a[i]['x'] - b[i]['x']) > 0.5)\nassert moved > 5, f'only {moved} corners differ — is the wobble really in the sum?'"),
           ("The same rock always gives the same shape",
            "rock = {'x': 30, 'y': 40, 'size': 2, 'wobble': 3.7}\nassert rock_points(rock) == rock_points(rock), 'a rock must not shimmer'"),
           ("Moving the rock moves every corner with it",
            "here = rock_points({'x': 0, 'y': 0, 'size': 3, 'wobble': 2})\nthere = rock_points({'x': 50, 'y': 20, 'size': 3, 'wobble': 2})\nfor i in range(len(here)):\n    assert abs(there[i]['x'] - here[i]['x'] - 50) < 0.001, f'corner {i} did not travel with the rock'\n    assert abs(there[i]['y'] - here[i]['y'] - 20) < 0.001")]),
  demo=dict(kind="rock", caption="The corners are marked. Press Spin and watch the wobble carry them round.")),

step("split_rock", "splitRock", "split_rock",
  "Break it in two", "Shooting a big rock makes two smaller ones.",
  "<p>This is the rule the whole game is built on: shooting a rock makes the screen <strong>busier</strong>, not emptier. A big rock becomes two mediums; each medium becomes two smalls; a small is gone for good.</p>"
  + fig("One big rock is really seven rocks — and eight shots — waiting to happen.",
        svg('<text x="55" y="15"' + SMALL + ' text-anchor="middle">size 3</text>'
            '<text x="175" y="15"' + SMALL + ' text-anchor="middle">size 2</text>'
            '<text x="305" y="15"' + SMALL + ' text-anchor="middle">size 1</text>'
            '<circle cx="55" cy="100" r="26"' + LINE + '/>'
            '<circle cx="175" cy="58" r="16"' + LINE + '/>'
            '<circle cx="175" cy="142" r="16"' + LINE + '/>'
            '<circle cx="305" cy="32" r="9"' + LINE + '/>'
            '<circle cx="305" cy="84" r="9"' + LINE + '/>'
            '<circle cx="305" cy="116" r="9"' + LINE + '/>'
            '<circle cx="305" cy="168" r="9"' + LINE + '/>'
            '<path d="M84,90 L154,66"' + ARROW + '/>'
            '<path d="M84,110 L154,134"' + ARROW + '/>'
            '<path d="M192,50 L292,36"' + ARROW + '/>'
            '<path d="M192,66 L292,80"' + ARROW + '/>'
            '<path d="M192,134 L292,120"' + ARROW + '/>'
            '<path d="M192,150 L292,164"' + ARROW + '/>'
            '<text x="55" y="140"' + SMALL + ' text-anchor="middle">20 pts</text>'
            '<text x="175" y="192"' + SMALL + ' text-anchor="middle">50 pts each</text>'
            '<text x="330" y="196"' + SMALL + ' text-anchor="end">100 pts each</text>')) +
  "<p>Notice the scoring runs the other way round: the <em>smallest</em> rocks are worth the most, because they are fast and tiny and genuinely hard to hit.</p>"
  "<p>Give back a <strong>list</strong>, even when it is empty. A function that sometimes returns a list and sometimes returns nothing forces every caller to check; one that always returns a list &mdash; possibly an empty one &mdash; can just be added on.</p>",
  "rock — the rock that was shot",
  "a list of the smaller rocks it leaves behind — empty if it was the smallest",
  ["If the rock's size is 1 or less, give back an empty list.",
   "Otherwise give back a list of TWO new rocks, one size smaller.",
   "Both start where the old rock was — makeRock gives them their own directions."],
  js=dict(starter="function splitRock(rock) {\n    return [];\n}\n",
    answer="function splitRock(rock) {\n    if (rock.size <= 1) {\n        return [];\n    }\n    return [makeRock(rock.x, rock.y, rock.size - 1),\n            makeRock(rock.x, rock.y, rock.size - 1)];\n}\n",
    hints=["A guard clause first: the smallest rocks leave nothing behind.",
           "Two calls to makeRock, both at the old rock's x and y.",
           "rock.size - 1 is the size of the pieces."],
    tests=[("The smallest rock leaves nothing",
            "assert(splitRock({ x: 10, y: 10, size: 1 }).length === 0);"),
           ("A big rock leaves exactly two",
            "assert(splitRock({ x: 10, y: 10, size: 3 }).length === 2);"),
           ("A medium rock leaves exactly two as well",
            "assert(splitRock({ x: 10, y: 10, size: 2 }).length === 2);"),
           ("The pieces are one size smaller",
            "const pieces = splitRock({ x: 10, y: 10, size: 3 });\nassert(pieces[0].size === 2 && pieces[1].size === 2, 'got sizes ' + pieces[0].size + ' and ' + pieces[1].size);"),
           ("They start where the old rock was",
            "const pieces = splitRock({ x: 123, y: 45, size: 2 });\nfor (const piece of pieces) {\n    assert(piece.x === 123 && piece.y === 45, 'a piece appeared at ' + piece.x + ',' + piece.y);\n}"),
           ("The two pieces drift apart",
            "let apart = 0;\nfor (let i = 0; i < 20; i++) {\n    const pieces = splitRock({ x: 10, y: 10, size: 3 });\n    if (Math.abs(pieces[0].dx - pieces[1].dx) > 0.001) { apart = apart + 1; }\n}\nassert(apart > 15, 'only ' + apart + ' of 20 splits sent the pieces different ways');"),
           ("One big rock is really seven rocks",
            "let all = [{ x: 0, y: 0, size: 3 }];\nlet total = 0;\nwhile (all.length > 0) {\n    const rock = all.pop();\n    total = total + 1;\n    const pieces = splitRock(rock);\n    for (const piece of pieces) { all.push(piece); }\n}\nassert(total === 7, 'a big rock took ' + total + ' shots to clear, expected 7');"),
           ("It never touches the rock it was given",
            "const rock = { x: 10, y: 10, size: 3 };\nsplitRock(rock);\nassert(rock.size === 3, 'the old rock is thrown away by the caller — splitRock should not change it');")]),
  py=dict(starter="def split_rock(rock):\n    return []\n",
    answer="def split_rock(rock):\n    if rock[\"size\"] <= 1:\n        return []\n    return [make_rock(rock[\"x\"], rock[\"y\"], rock[\"size\"] - 1),\n            make_rock(rock[\"x\"], rock[\"y\"], rock[\"size\"] - 1)]\n",
    hints=["A guard clause first: the smallest rocks leave nothing behind.",
           "Two calls to make_rock, both at the old rock's x and y.",
           "rock['size'] - 1 is the size of the pieces."],
    tests=[("The smallest rock leaves nothing",
            "assert split_rock({'x': 10, 'y': 10, 'size': 1}) == []"),
           ("A big rock leaves exactly two",
            "assert len(split_rock({'x': 10, 'y': 10, 'size': 3})) == 2"),
           ("A medium rock leaves exactly two as well",
            "assert len(split_rock({'x': 10, 'y': 10, 'size': 2})) == 2"),
           ("The pieces are one size smaller",
            "pieces = split_rock({'x': 10, 'y': 10, 'size': 3})\nassert [p['size'] for p in pieces] == [2, 2]"),
           ("They start where the old rock was",
            "pieces = split_rock({'x': 123, 'y': 45, 'size': 2})\nfor piece in pieces:\n    assert piece['x'] == 123 and piece['y'] == 45"),
           ("The two pieces drift apart",
            "apart = 0\nfor i in range(20):\n    pieces = split_rock({'x': 10, 'y': 10, 'size': 3})\n    if abs(pieces[0]['dx'] - pieces[1]['dx']) > 0.001:\n        apart += 1\nassert apart > 15, f'only {apart} of 20 splits sent the pieces different ways'"),
           ("One big rock is really seven rocks",
            "all_rocks = [{'x': 0, 'y': 0, 'size': 3}]\ntotal = 0\nwhile all_rocks:\n    rock = all_rocks.pop()\n    total += 1\n    all_rocks.extend(split_rock(rock))\nassert total == 7, f'a big rock took {total} shots to clear, expected 7'"),
           ("It never touches the rock it was given",
            "rock = {'x': 10, 'y': 10, 'size': 3}\nsplit_rock(rock)\nassert rock['size'] == 3, 'split_rock should not change the old rock'")]),
  demo=dict(kind="split", caption="Shoot the big rock. Two mediums appear in its place, then four smalls.")),

step("hit_rocks", "hitRocks", "hit_rocks",
  "Did anything get hit?", "Shooting a rock actually breaks it.",
  "<p>Now put the last four steps together. Every bullet has to be checked against every rock &mdash; a loop inside a loop.</p>"
  + fig("Check the rocks in order and stop at the FIRST hit. One bullet cannot break two rocks.",
        svg('<circle cx="32" cy="100" r="5" fill="#111"/>'
            '<circle cx="105" cy="100" r="20"' + LINE + '/>'
            '<circle cx="180" cy="100" r="20"' + LINE + '/>'
            '<circle cx="255" cy="100" r="20"' + LINE + '/>'
            '<circle cx="330" cy="100" r="20"' + FAINT + '/>'
            '<path d="M40,100 L80,100"' + DASH + ' marker-end="url(#tip)"/>'
            '<path d="M128,100 L155,100"' + DASH + ' marker-end="url(#tip)"/>'
            '<path d="M203,100 L230,100"' + ARROW + '/>'
            '<text x="105" y="146"' + SMALL + ' text-anchor="middle">miss</text>'
            '<text x="180" y="146"' + SMALL + ' text-anchor="middle">miss</text>'
            '<text x="255" y="146"' + SMALL + ' text-anchor="middle">HIT</text>'
            '<text x="330" y="146" font-family="monospace" font-size="11" fill="#999"'
            + HALO + ' text-anchor="middle">skipped</text>'
            '<text x="180" y="36"' + SMALL + ' text-anchor="middle">'
            'for each bullet: check rocks in order</text>', 175)) +
  "<p>Two details make it correct. First, <code>break</code> out of the inner loop the moment a bullet hits something &mdash; one bullet destroys one rock, and without the break it could clear a whole line. Second, build a <strong>new</strong> bullet list of the ones that missed, for the same reason as in <code>ageBullets</code>: changing a list while you are walking along it goes wrong quietly.</p>"
  "<p>A hit takes the rock out, adds whatever <code>splitRock</code> gives back, and adds its score.</p>",
  "state — the whole game",
  "how many rocks were hit this frame",
  ["Start an empty list for the bullets that missed, and a count of 0.",
   "For each bullet, walk the rocks looking for the first one it touches — then stop.",
   "If it missed everything, keep the bullet.",
   "If it hit, remove that rock, add its score, add the pieces from splitRock, and count the hit.",
   "Put the surviving bullets back on the state and give back the count."],
  js=dict(starter="function hitRocks(state) {\n    return 0;\n}\n",
    answer="function hitRocks(state) {\n    const surviving = [];\n    let hits = 0;\n\n    for (const bullet of state.bullets) {\n        let hitIndex = -1;\n        for (let r = 0; r < state.rocks.length; r++) {\n            if (touches(bullet, state.rocks[r], 1, ROCK_RADIUS[state.rocks[r].size])) {\n                hitIndex = r;\n                break;\n            }\n        }\n\n        if (hitIndex === -1) {\n            surviving.push(bullet);\n        } else {\n            const rock = state.rocks.splice(hitIndex, 1)[0];\n            state.score = state.score + ROCK_SCORE[rock.size];\n            for (const piece of splitRock(rock)) { state.rocks.push(piece); }\n            hits = hits + 1;\n        }\n    }\n\n    state.bullets = surviving;\n    return hits;\n}\n",
    hints=["Remember which rock was hit as an index, starting at -1 for 'nothing yet'.",
           "break as soon as you find a hit — one bullet, one rock.",
           "state.rocks.splice(hitIndex, 1)[0] takes the rock out and hands it to you."],
    tests=[("Nothing happens when the bullets are nowhere near",
            "const state = createGame();\nstate.rocks = [{ x: 300, y: 300, size: 3, wobble: 0 }];\nstate.bullets = [{ x: 10, y: 10, life: 1 }];\nassert(hitRocks(state) === 0);\nassert(state.bullets.length === 1, 'a bullet that missed should still be flying');\nassert(state.rocks.length === 1);"),
           ("A hit is counted",
            "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 3, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nassert(hitRocks(state) === 1);"),
           ("The bullet is used up",
            "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 3, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nhitRocks(state);\nassert(state.bullets.length === 0, 'the bullet should be gone');"),
           ("A big rock becomes two mediums",
            "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 3, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nhitRocks(state);\nassert(state.rocks.length === 2, 'there are ' + state.rocks.length + ' rocks, expected 2');\nassert(state.rocks[0].size === 2);"),
           ("A small rock just disappears",
            "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 1, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nhitRocks(state);\nassert(state.rocks.length === 0);"),
           ("The score goes up by the right amount",
            "const state = createGame();\nstate.score = 0;\nstate.rocks = [{ x: 100, y: 100, size: 1, wobble: 0 }];\nstate.bullets = [{ x: 100, y: 100, life: 1 }];\nhitRocks(state);\nassert(state.score === ROCK_SCORE[1], 'score is ' + state.score + ', expected ' + ROCK_SCORE[1]);"),
           ("One bullet can only break ONE rock",
            "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 1, wobble: 0 }, { x: 102, y: 100, size: 1, wobble: 0 }];\nstate.bullets = [{ x: 101, y: 100, life: 1 }];\nassert(hitRocks(state) === 1, 'one bullet must not clear two rocks — did you break out of the inner loop?');\nassert(state.rocks.length === 1);"),
           ("Two bullets can break two rocks",
            "const state = createGame();\nstate.rocks = [{ x: 40, y: 40, size: 1, wobble: 0 }, { x: 200, y: 200, size: 1, wobble: 0 }];\nstate.bullets = [{ x: 40, y: 40, life: 1 }, { x: 200, y: 200, life: 1 }];\nassert(hitRocks(state) === 2);\nassert(state.rocks.length === 0);"),
           ("A patient player can always clear the field",
            "const state = createGame();\nstate.rocks = [{ x: 100, y: 100, size: 3, wobble: 0 }];\nfor (let shot = 0; shot < 40 && state.rocks.length > 0; shot++) {\n    state.bullets = [{ x: state.rocks[0].x, y: state.rocks[0].y, life: 1 }];\n    hitRocks(state);\n}\nassert(state.rocks.length === 0, state.rocks.length + ' rocks are still up there after 40 point-blank shots');")]),
  py=dict(starter="def hit_rocks(state):\n    return 0\n",
    answer="def hit_rocks(state):\n    surviving = []\n    hits = 0\n\n    for bullet in state[\"bullets\"]:\n        hit_index = -1\n        for r, rock in enumerate(state[\"rocks\"]):\n            if touches(bullet, rock, 1, ROCK_RADIUS[rock[\"size\"]]):\n                hit_index = r\n                break\n\n        if hit_index == -1:\n            surviving.append(bullet)\n        else:\n            rock = state[\"rocks\"].pop(hit_index)\n            state[\"score\"] += ROCK_SCORE[rock[\"size\"]]\n            state[\"rocks\"].extend(split_rock(rock))\n            hits += 1\n\n    state[\"bullets\"] = surviving\n    return hits\n",
    hints=["enumerate gives you the index and the rock together.",
           "break as soon as you find a hit — one bullet, one rock.",
           "state['rocks'].pop(hit_index) takes the rock out and hands it to you."],
    tests=[("Nothing happens when the bullets are nowhere near",
            "state = create_game()\nstate['rocks'] = [{'x': 300, 'y': 300, 'size': 3, 'wobble': 0}]\nstate['bullets'] = [{'x': 10, 'y': 10, 'life': 1}]\nassert hit_rocks(state) == 0\nassert len(state['bullets']) == 1, 'a bullet that missed should still be flying'"),
           ("A hit is counted",
            "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nassert hit_rocks(state) == 1"),
           ("The bullet is used up",
            "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nhit_rocks(state)\nassert state['bullets'] == []"),
           ("A big rock becomes two mediums",
            "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nhit_rocks(state)\nassert len(state['rocks']) == 2\nassert state['rocks'][0]['size'] == 2"),
           ("A small rock just disappears",
            "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 1, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nhit_rocks(state)\nassert state['rocks'] == []"),
           ("The score goes up by the right amount",
            "state = create_game()\nstate['score'] = 0\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 1, 'wobble': 0}]\nstate['bullets'] = [{'x': 100, 'y': 100, 'life': 1}]\nhit_rocks(state)\nassert state['score'] == ROCK_SCORE[1]"),
           ("One bullet can only break ONE rock",
            "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 1, 'wobble': 0}, {'x': 102, 'y': 100, 'size': 1, 'wobble': 0}]\nstate['bullets'] = [{'x': 101, 'y': 100, 'life': 1}]\nassert hit_rocks(state) == 1, 'did you break out of the inner loop?'\nassert len(state['rocks']) == 1"),
           ("Two bullets can break two rocks",
            "state = create_game()\nstate['rocks'] = [{'x': 40, 'y': 40, 'size': 1, 'wobble': 0}, {'x': 200, 'y': 200, 'size': 1, 'wobble': 0}]\nstate['bullets'] = [{'x': 40, 'y': 40, 'life': 1}, {'x': 200, 'y': 200, 'life': 1}]\nassert hit_rocks(state) == 2\nassert state['rocks'] == []"),
           ("A patient player can always clear the field",
            "state = create_game()\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3, 'wobble': 0}]\nfor shot in range(40):\n    if not state['rocks']:\n        break\n    state['bullets'] = [{'x': state['rocks'][0]['x'], 'y': state['rocks'][0]['y'], 'life': 1}]\n    hit_rocks(state)\nassert state['rocks'] == [], 'rocks are still up there after 40 point-blank shots'")]),
  demo=dict(kind="split", caption="Fire away. Every hit splits a rock and pushes the score up.")),

step("ship_is_hit", "shipIsHit", "ship_is_hit",
  "Has the ship been caught?", "Rocks are dangerous again.",
  "<p>The other collision. Ask whether <em>any</em> rock is touching the ship &mdash; and both languages have a word for that exact question, so you do not need a loop with a flag in it.</p>"
  "<p>But before you check anything: if the shield is still up, the answer is <code>false</code> whatever the rocks are doing. That is what stops you dying instantly on a respawn, with a rock sitting where the ship reappears. Another guard clause, and the most important one in the game.</p>",
  "state — the whole game",
  "true if a rock has caught the ship",
  ["If the shield is still running, give back false straight away.",
   "Otherwise ask whether ANY rock touches the ship.",
   "Use each rock's own radius — a big rock is a bigger target."],
  intro_js="<p><strong>In JavaScript:</strong> <code>list.some(test)</code> is true when the test passes for at least one item.</p>",
  intro_py="<p><strong>In Python:</strong> <code>any(test for item in list)</code> reads almost exactly like the sentence you would say out loud.</p>",
  js=dict(starter="function shipIsHit(state) {\n    return false;\n}\n",
    answer="function shipIsHit(state) {\n    if (state.shield > 0) {\n        return false;\n    }\n    return state.rocks.some(function (rock) {\n        return touches(state.ship, rock, SHIP_RADIUS, ROCK_RADIUS[rock.size]);\n    });\n}\n",
    hints=["The shield guard goes first, before you look at a single rock.",
           "state.rocks.some(...) is true when at least one rock passes the test.",
           "touches(state.ship, rock, SHIP_RADIUS, ROCK_RADIUS[rock.size])"],
    tests=[("An empty sky is safe",
            "const state = createGame();\nstate.shield = 0;\nstate.rocks = [];\nassert(shipIsHit(state) === false);"),
           ("A distant rock is safe",
            "const state = createGame();\nstate.shield = 0;\nstate.ship = { x: 20, y: 20, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 300, y: 300, size: 3 }];\nassert(shipIsHit(state) === false);"),
           ("A rock on top of the ship is a hit",
            "const state = createGame();\nstate.shield = 0;\nstate.ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 100, y: 100, size: 3 }];\nassert(shipIsHit(state) === true);"),
           ("The shield saves you",
            "const state = createGame();\nstate.shield = 1.5;\nstate.ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 100, y: 100, size: 3 }];\nassert(shipIsHit(state) === false, 'the shield must beat every rock, or you would die the moment you respawn');"),
           ("Any one of many rocks is enough",
            "const state = createGame();\nstate.shield = 0;\nstate.ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 10, y: 10, size: 1 }, { x: 300, y: 300, size: 1 }, { x: 100, y: 100, size: 1 }];\nassert(shipIsHit(state) === true);"),
           ("A big rock is a bigger target",
            "const state = createGame();\nstate.shield = 0;\nstate.ship = { x: 100, y: 100, angle: 0, dx: 0, dy: 0 };\nstate.rocks = [{ x: 100 + SHIP_RADIUS + 20, y: 100, size: 3 }];\nassert(shipIsHit(state) === true, 'a big rock has radius ' + ROCK_RADIUS[3]);\nstate.rocks = [{ x: 100 + SHIP_RADIUS + 20, y: 100, size: 1 }];\nassert(shipIsHit(state) === false, 'a small rock has radius ' + ROCK_RADIUS[1]);"),
           ("It does not disturb anything",
            "const state = createGame();\nstate.shield = 0;\nconst before = state.rocks.length;\nshipIsHit(state);\nassert(state.rocks.length === before, 'a question should not change the game');")]),
  py=dict(starter="def ship_is_hit(state):\n    return False\n",
    answer="def ship_is_hit(state):\n    if state[\"shield\"] > 0:\n        return False\n    return any(touches(state[\"ship\"], rock, SHIP_RADIUS, ROCK_RADIUS[rock[\"size\"]])\n               for rock in state[\"rocks\"])\n",
    hints=["The shield guard goes first, before you look at a single rock.",
           "any(... for rock in state['rocks']) is true when at least one passes.",
           "touches(state['ship'], rock, SHIP_RADIUS, ROCK_RADIUS[rock['size']])"],
    tests=[("An empty sky is safe",
            "state = create_game()\nstate['shield'] = 0\nstate['rocks'] = []\nassert ship_is_hit(state) is False"),
           ("A distant rock is safe",
            "state = create_game()\nstate['shield'] = 0\nstate['ship'] = {'x': 20, 'y': 20, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 300, 'y': 300, 'size': 3}]\nassert ship_is_hit(state) is False"),
           ("A rock on top of the ship is a hit",
            "state = create_game()\nstate['shield'] = 0\nstate['ship'] = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3}]\nassert ship_is_hit(state) is True"),
           ("The shield saves you",
            "state = create_game()\nstate['shield'] = 1.5\nstate['ship'] = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 100, 'y': 100, 'size': 3}]\nassert ship_is_hit(state) is False, 'the shield must beat every rock'"),
           ("Any one of many rocks is enough",
            "state = create_game()\nstate['shield'] = 0\nstate['ship'] = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 10, 'y': 10, 'size': 1}, {'x': 300, 'y': 300, 'size': 1}, {'x': 100, 'y': 100, 'size': 1}]\nassert ship_is_hit(state) is True"),
           ("A big rock is a bigger target",
            "state = create_game()\nstate['shield'] = 0\nstate['ship'] = {'x': 100, 'y': 100, 'angle': 0, 'dx': 0, 'dy': 0}\nstate['rocks'] = [{'x': 100 + SHIP_RADIUS + 20, 'y': 100, 'size': 3}]\nassert ship_is_hit(state) is True\nstate['rocks'] = [{'x': 100 + SHIP_RADIUS + 20, 'y': 100, 'size': 1}]\nassert ship_is_hit(state) is False"),
           ("It does not disturb anything",
            "state = create_game()\nstate['shield'] = 0\nbefore = len(state['rocks'])\nship_is_hit(state)\nassert len(state['rocks']) == before, 'a question should not change the game'")]),
  demo=dict(kind="game", caption="A robot flies this one. Watch the lives fall when it gets careless.")),

step("start_wave", "startWave", "start_wave",
  "A ring of rocks", "Clear the field and a harder wave arrives.",
  "<p>Almost there. A new wave is <code>3 + wave</code> big rocks, spaced evenly round a ring &mdash; well away from the middle, so the ship is never crushed the instant a wave begins.</p>"
  + fig("Spread the rocks evenly: rock i sits at i/count of the way round.",
        svg('<circle cx="180" cy="101" r="71"' + FAINT + ' stroke-dasharray="5 4"/>'
            '<path d="M192,100 L168,88 L168,112 z"' + LINE + '/>'
            '<circle cx="251" cy="101" r="16"' + LINE + '/>'
            '<circle cx="180" cy="172" r="16"' + LINE + '/>'
            '<circle cx="109" cy="101" r="16"' + LINE + '/>'
            '<circle cx="180" cy="30" r="16"' + LINE + '/>'
            '<text x="282" y="104"' + SMALL + '>i = 0</text>'
            '<text x="202" y="176"' + SMALL + '>i = 1</text>'
            '<text x="88" y="104"' + SMALL + ' text-anchor="end">i = 2</text>'
            '<text x="202" y="34"' + SMALL + '>i = 3</text>')) +
  "<p>Evenly spaced means rock <code>i</code> of <code>count</code> goes at <code>i / count</code> of a whole turn. That fraction-of-a-circle trick is the same one you used for the corners of a rock &mdash; it turns up everywhere once you have seen it.</p>"
  "<p>Clear the old bullets too. A shot left over from the last wave, still flying, would be a strange little gift.</p>",
  "state — the whole game",
  "nothing; it fills state.rocks with a new wave",
  ["Empty the rock list.",
   "Work out how many: 3 + the wave number.",
   "For each one, put it at i / count of the way round a circle, 130 pixels out from the middle.",
   "Empty the bullet list too."],
  js=dict(starter="function startWave(state) {\n    // a ring of rocks\n}\n",
    answer="function startWave(state) {\n    state.rocks = [];\n    const count = 3 + state.wave;\n\n    for (let i = 0; i < count; i++) {\n        const angle = i / count * Math.PI * 2;\n        const spot = pointFrom(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, angle, 130);\n        state.rocks.push(makeRock(spot.x, spot.y, BIG_ROCK));\n    }\n    state.bullets = [];\n}\n",
    hints=["i / count * Math.PI * 2 spreads them evenly round the circle.",
           "pointFrom from the middle of the field, 130 pixels out.",
           "Every rock in a new wave is a BIG_ROCK."],
    tests=[("Wave 1 has four rocks",
            "const state = createGame();\nstate.wave = 1;\nstartWave(state);\nassert(state.rocks.length === 4, 'got ' + state.rocks.length);"),
           ("Later waves have more",
            "const state = createGame();\nstate.wave = 5;\nstartWave(state);\nassert(state.rocks.length === 8, 'got ' + state.rocks.length + ' — 3 + 5 is 8');"),
           ("They are all big ones",
            "const state = createGame();\nstate.wave = 2;\nstartWave(state);\nfor (const rock of state.rocks) {\n    assert(rock.size === BIG_ROCK, 'a wave should start with big rocks only');\n}"),
           ("Old bullets are cleared away",
            "const state = createGame();\nstate.bullets = [{ x: 1, y: 1, life: 1 }];\nstartWave(state);\nassert(state.bullets.length === 0, 'a shot from the last wave should not survive');"),
           ("They start well away from the middle",
            "const state = createGame();\nstate.wave = 3;\nstartWave(state);\nconst middle = { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2 };\nfor (const rock of state.rocks) {\n    assert(distanceBetween(middle, rock) > 100, 'a rock started ' + distanceBetween(middle, rock).toFixed(0) + ' from the ship — that is instant death');\n}"),
           ("They are spread out, not stacked up",
            "const state = createGame();\nstate.wave = 3;\nstartWave(state);\nfor (let i = 0; i < state.rocks.length; i++) {\n    for (let j = i + 1; j < state.rocks.length; j++) {\n        assert(distanceBetween(state.rocks[i], state.rocks[j]) > 40, 'rocks ' + i + ' and ' + j + ' started on top of each other');\n    }\n}"),
           ("A new wave replaces the old rocks, it does not add to them",
            "const state = createGame();\nstate.wave = 1;\nstartWave(state);\nstartWave(state);\nassert(state.rocks.length === 4, 'there are ' + state.rocks.length + ' rocks — did you forget to empty the list first?');"),
           ("Every wave is harder than the one before",
            "let last = 0;\nfor (let wave = 1; wave <= 6; wave++) {\n    const state = createGame();\n    state.wave = wave;\n    startWave(state);\n    assert(state.rocks.length > last, 'wave ' + wave + ' was no harder than wave ' + (wave - 1));\n    last = state.rocks.length;\n}")]),
  py=dict(starter="def start_wave(state):\n    # a ring of rocks\n    pass\n",
    answer="def start_wave(state):\n    state[\"rocks\"] = []\n    count = 3 + state[\"wave\"]\n    for i in range(count):\n        angle = i / count * math.pi * 2\n        spot = point_from(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, angle, 130)\n        state[\"rocks\"].append(make_rock(spot[\"x\"], spot[\"y\"], BIG_ROCK))\n    state[\"bullets\"] = []\n",
    hints=["i / count * math.pi * 2 spreads them evenly round the circle.",
           "point_from from the middle of the field, 130 pixels out.",
           "Every rock in a new wave is a BIG_ROCK."],
    tests=[("Wave 1 has four rocks",
            "state = create_game()\nstate['wave'] = 1\nstart_wave(state)\nassert len(state['rocks']) == 4"),
           ("Later waves have more",
            "state = create_game()\nstate['wave'] = 5\nstart_wave(state)\nassert len(state['rocks']) == 8, '3 + 5 is 8'"),
           ("They are all big ones",
            "state = create_game()\nstate['wave'] = 2\nstart_wave(state)\nassert all(r['size'] == BIG_ROCK for r in state['rocks'])"),
           ("Old bullets are cleared away",
            "state = create_game()\nstate['bullets'] = [{'x': 1, 'y': 1, 'life': 1}]\nstart_wave(state)\nassert state['bullets'] == []"),
           ("They start well away from the middle",
            "state = create_game()\nstate['wave'] = 3\nstart_wave(state)\nmiddle = {'x': FIELD_WIDTH / 2, 'y': FIELD_HEIGHT / 2}\nfor rock in state['rocks']:\n    assert distance_between(middle, rock) > 100, 'a rock started too close to the ship'"),
           ("They are spread out, not stacked up",
            "state = create_game()\nstate['wave'] = 3\nstart_wave(state)\nrocks = state['rocks']\nfor i in range(len(rocks)):\n    for j in range(i + 1, len(rocks)):\n        assert distance_between(rocks[i], rocks[j]) > 40, f'rocks {i} and {j} started on top of each other'"),
           ("A new wave replaces the old rocks, it does not add to them",
            "state = create_game()\nstate['wave'] = 1\nstart_wave(state)\nstart_wave(state)\nassert len(state['rocks']) == 4, 'did you forget to empty the list first?'"),
           ("Every wave is harder than the one before",
            "last = 0\nfor wave in range(1, 7):\n    state = create_game()\n    state['wave'] = wave\n    start_wave(state)\n    assert len(state['rocks']) > last, f'wave {wave} was no harder than wave {wave - 1}'\n    last = len(state['rocks'])")]),
  demo=dict(kind="wave", caption="Press Next Wave. Each one is a bigger ring than the last.")),

step("action_for_key", "actionForKey", "action_for_key",
  "The controls", "Asteroids is finished. Go and fly it.",
  "<p>One last function, and the easiest of the twenty: turn a key into the <em>name</em> of an action.</p>"
  "<p>Note what it does not do. It does not turn the ship or fire a shot &mdash; it just says <code>'left'</code>, or <code>'fire'</code>, or nothing at all. That one layer of indirection is why the on-screen buttons, the keyboard and an Xbox controller can all drive the same game without any of them knowing about the others.</p>"
  "<p>Arrow keys and WASD both work, because different people reach for different keys. Anything else gives back nothing, and nothing happens.</p>",
  "key — the key that was pressed, like 'ArrowLeft' or 'w'",
  "an action name, or nothing at all",
  ["Put the key in lower case first, so 'W' and 'w' both work.",
   "Left or A → 'left'. Right or D → 'right'. Up or W → 'thrust'.",
   "Space → 'fire'. P → 'pause'. R → 'restart'.",
   "Anything else → nothing."],
  js=dict(starter="function actionForKey(key) {\n    return null;\n}\n",
    answer="function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === 'arrowup' || k === 'w') { return 'thrust'; }\n    if (k === ' ' || k === 'spacebar') { return 'fire'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
    hints=["String(key).toLowerCase() once, at the top, saves six comparisons.",
           "The arrow keys arrive as 'ArrowLeft', 'ArrowRight' and 'ArrowUp'.",
           "return null; at the end, for every key you do not care about."],
    tests=[("The arrow keys steer",
            "assert(actionForKey('ArrowLeft') === 'left');\nassert(actionForKey('ArrowRight') === 'right');\nassert(actionForKey('ArrowUp') === 'thrust');"),
           ("WASD works too",
            "assert(actionForKey('a') === 'left');\nassert(actionForKey('d') === 'right');\nassert(actionForKey('w') === 'thrust');"),
           ("Capitals work as well",
            "assert(actionForKey('W') === 'thrust', 'Caps Lock should not break the game');\nassert(actionForKey('ArrowLEFT') === 'left');"),
           ("Space fires",
            "assert(actionForKey(' ') === 'fire');\nassert(actionForKey('Spacebar') === 'fire', 'some older browsers send Spacebar');"),
           ("P pauses and R restarts",
            "assert(actionForKey('p') === 'pause');\nassert(actionForKey('r') === 'restart');"),
           ("Everything else does nothing",
            "for (const key of ['q', 'z', 'Enter', 'Shift', '7', 'ArrowDown']) {\n    assert(!actionForKey(key), key + ' should not do anything');\n}"),
           ("Every action the game knows about has a key",
            "const wanted = ['left', 'right', 'thrust', 'fire', 'pause', 'restart'];\nconst found = [];\nfor (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'p', 'r']) {\n    found.push(actionForKey(key));\n}\nfor (const action of wanted) {\n    assert(found.indexOf(action) !== -1, 'nothing is wired up to ' + action);\n}")]),
  py=dict(starter="def action_for_key(key):\n    return None\n",
    answer="def action_for_key(key):\n    keys = {\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"arrowup\": \"thrust\", \"w\": \"thrust\",\n        \" \": \"fire\", \"spacebar\": \"fire\",\n        \"p\": \"pause\", \"r\": \"restart\",\n    }\n    return keys.get(str(key).lower())\n",
    algorithm=["Make a dictionary from lower-case key names to action names.",
               "Look the key up with .get, which gives back None when it is not there.",
               "That is the whole function - a table instead of six ifs."],
    hints=["A dictionary is much tidier than six ifs here.",
           "keys.get(name) gives back None when the name is not in the dictionary.",
           "Remember str(key).lower() so 'W' and 'w' both work."],
    tests=[("The arrow keys steer",
            "assert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'\nassert action_for_key('ArrowUp') == 'thrust'"),
           ("WASD works too",
            "assert action_for_key('a') == 'left'\nassert action_for_key('d') == 'right'\nassert action_for_key('w') == 'thrust'"),
           ("Capitals work as well",
            "assert action_for_key('W') == 'thrust', 'Caps Lock should not break the game'\nassert action_for_key('ArrowLEFT') == 'left'"),
           ("Space fires",
            "assert action_for_key(' ') == 'fire'\nassert action_for_key('Spacebar') == 'fire'"),
           ("P pauses and R restarts",
            "assert action_for_key('p') == 'pause'\nassert action_for_key('r') == 'restart'"),
           ("Everything else does nothing",
            "for key in ['q', 'z', 'Enter', 'Shift', '7', 'ArrowDown']:\n    assert action_for_key(key) is None, f'{key} should not do anything'"),
           ("Every action the game knows about has a key",
            "found = [action_for_key(k) for k in ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'p', 'r']]\nfor action in ['left', 'right', 'thrust', 'fire', 'pause', 'restart']:\n    assert action in found, f'nothing is wired up to {action}'")]),
  demo=dict(kind="final", caption="Twenty functions, one game. Arrows or WASD to fly, space to shoot.")),
]

write_workshop("asteroids", "Asteroids", STEPS)
