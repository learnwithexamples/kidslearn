/* ============================================================
   race-steps.js — the twelve steps of "Build Car Racing Yourself"

   Each step describes ONE function from the real game:

     id       — a short name, also used to save your work in the browser
     fnName   — the exact function name you must write
     title    — what this step adds to the game
     intro    — why the game needs it
     spec     — INPUT / OUTPUT / ALGORITHM, the same style as the game's own
                comments
     starter  — the empty function you begin with
     answer   — one correct version (try hard before you look!)
     hints    — small nudges, shown one at a time
     tests    — the checks the Test button runs
     demo     — which live demo to show beside the editor

   A test is either:
     { name, args: [...], expect: value }        call the function and compare
     { name, check: function (fn) { ... } }      a custom check, returns
                                                 { ok: true/false, detail: '...' }
   ============================================================ */

const RACE_STEPS = [

/* ---------------------------------------------------------- 1 */
{
    id: 'laneCenterX',
    fnName: 'laneCenterX',
    title: 'Mark out the lanes',
    adds: 'The road gets three lanes.',
    intro: '<p>Snake and Tetris lived on a grid of squares. A racing game does not: cars slide smoothly, so everything here is measured in <strong>pixels</strong>.</p>' +
           '<p>The road is <code>ROAD_WIDTH</code> = 300 pixels wide. Down each side is a black verge <code>EDGE_WIDTH</code> = 15 pixels wide, and the tarmac in between is split into <code>LANE_COUNT</code> = 3 lanes, each <code>LANE_WIDTH</code> = 90 pixels across.</p>' +
           '<pre class="mini-code">|edge|   lane 0   |   lane 1   |   lane 2   |edge|\n' +
           '0   15           105          195          285  300</pre>' +
           '<p>Your job: given a lane number, where is the middle of it?</p>',
    spec: {
        input: 'lane — 0 (left), 1 (middle) or 2 (right)',
        output: 'the x position, in pixels, of the middle of that lane',
        algorithm: [
            'Start at EDGE_WIDTH — that is where the tarmac begins.',
            'Skip over the lanes before this one: add lane × LANE_WIDTH.',
            'Add half a lane (LANE_WIDTH / 2) to land in the middle.'
        ]
    },
    warning: 'Use the names EDGE_WIDTH, LANE_WIDTH and LANE_COUNT rather than typing 15, 90 and 3. If somebody widens the road later, your function still works.',
    starter: 'function laneCenterX(lane) {\n' +
             '    // the verge, then the lanes before this one, then half a lane\n' +
             '}\n',
    answer: 'function laneCenterX(lane) {\n' +
            '    return EDGE_WIDTH + lane * LANE_WIDTH + LANE_WIDTH / 2;\n' +
            '}\n',
    hints: [
        'The answer is one line: three things added together.',
        'The lanes before this one take up lane * LANE_WIDTH pixels.',
        'return EDGE_WIDTH + lane * LANE_WIDTH + LANE_WIDTH / 2;'
    ],
    tests: [
        { name: 'Lane 0 is at 60', args: [0], expect: 60 },
        { name: 'Lane 1 is at 150 — the middle of the road', args: [1], expect: 150 },
        { name: 'Lane 2 is at 240', args: [2], expect: 240 },
        { name: 'The lanes are one LANE_WIDTH apart', check: function (fn) {
            const ok = fn(1) - fn(0) === LANE_WIDTH && fn(2) - fn(1) === LANE_WIDTH;
            return { ok: ok, detail: 'got ' + fn(0) + ', ' + fn(1) + ', ' + fn(2) };
        } },
        { name: 'Every lane leaves room for a whole car', check: function (fn) {
            for (let lane = 0; lane < LANE_COUNT; lane++) {
                const left = fn(lane) - CAR_WIDTH / 2;
                if (left < EDGE_WIDTH || left + CAR_WIDTH > ROAD_WIDTH - EDGE_WIDTH) {
                    return { ok: false, detail: 'a car in lane ' + lane + ' would hang over a verge' };
                }
            }
            return { ok: true, detail: '' };
        } }
    ],
    demo: { kind: 'lanes', caption: 'A car parked in the middle of each lane, using your function.' }
},

/* ---------------------------------------------------------- 2 */
{
    id: 'clamp',
    fnName: 'clamp',
    title: 'Keep the car on the road',
    adds: 'The car can no longer drive onto the verge.',
    intro: '<p>Steering just adds to the car\'s <code>x</code>. Nothing stops it adding for ever and driving off the picture — unless we squeeze the answer back between two limits.</p>' +
           '<p>That squeeze is called <strong>clamping</strong>, and once you know it you will spot it everywhere: health bars, volume sliders, zoom levels, scroll positions.</p>',
    spec: {
        input: 'value — the number. low — the smallest allowed. high — the largest allowed.',
        output: 'value if it is already between the limits, otherwise the limit it went past',
        algorithm: [
            'If value is less than low, return low.',
            'If value is greater than high, return high.',
            'Otherwise return value unchanged.'
        ]
    },
    starter: 'function clamp(value, low, high) {\n' +
             '    // squeeze value between low and high\n' +
             '}\n',
    answer: 'function clamp(value, low, high) {\n' +
            '    if (value < low) {\n' +
            '        return low;\n' +
            '    }\n' +
            '    if (value > high) {\n' +
            '        return high;\n' +
            '    }\n' +
            '    return value;\n' +
            '}\n',
    hints: [
        'Two ifs and a return — no else needed, because return leaves the function straight away.',
        'Check the low limit first, then the high one, then hand back the value itself.',
        'Math.min(high, Math.max(low, value)) does the same job in one line, once you are comfortable.'
    ],
    tests: [
        { name: 'A number already in range is left alone', args: [50, 0, 100], expect: 50 },
        { name: 'A number below the bottom is pulled up', args: [-30, 0, 100], expect: 0 },
        { name: 'A number above the top is pulled down', args: [300, 0, 100], expect: 100 },
        { name: 'The bottom limit itself is allowed', args: [0, 0, 100], expect: 0 },
        { name: 'The top limit itself is allowed', args: [100, 0, 100], expect: 100 },
        { name: 'It works with the road\'s real limits', args: [999, 15, 241], expect: 241 },
        { name: 'It works with decimals', args: [7.5, 0, 10], expect: 7.5 },
        { name: 'It works with negative limits', args: [-99, -20, 20], expect: -20 }
    ],
    demo: { kind: 'clamp', caption: 'Push the car past the verge and watch your clamp refuse to let it through.' }
},

/* ---------------------------------------------------------- 3 */
{
    id: 'createCar',
    fnName: 'createCar',
    title: 'Build a car',
    adds: 'Cars can be put on the road.',
    intro: '<p>Every car in this game — yours and the traffic — is the same thing: a <strong>rectangle</strong>.</p>' +
           '<pre class="mini-code">{ x: 38, y: 120, width: 44, height: 74, lane: 0 }</pre>' +
           '<p><code>x</code> and <code>y</code> are the <strong>top-left corner</strong>, not the middle. That is the usual way to describe a rectangle in a computer, and it makes the crash test in step 4 much easier.</p>' +
           '<p>But lanes are measured from their middle. So to put a car in a lane you take the lane\'s middle and step back half a car.</p>',
    spec: {
        input: 'lane — 0, 1 or 2. y — how far down the road the car\'s top edge is.',
        output: 'a car object with x, y, width, height and lane',
        algorithm: [
            'Find the middle of the lane with laneCenterX(lane).',
            'The left edge is that middle minus CAR_WIDTH / 2.',
            'Return { x: …, y: y, width: CAR_WIDTH, height: CAR_HEIGHT, lane: lane }.'
        ]
    },
    warning: 'Remember to store the lane number in the car. The game uses it later to make sure two cars are never sent down the same lane one after the other.',
    starter: 'function createCar(lane, y) {\n' +
             '    // a rectangle, centred in its lane\n' +
             '}\n',
    answer: 'function createCar(lane, y) {\n' +
            '    return {\n' +
            '        x: laneCenterX(lane) - CAR_WIDTH / 2,\n' +
            '        y: y,\n' +
            '        width: CAR_WIDTH,\n' +
            '        height: CAR_HEIGHT,\n' +
            '        lane: lane\n' +
            '    };\n' +
            '}\n',
    hints: [
        'You already wrote laneCenterX — use it.',
        'The left edge is laneCenterX(lane) - CAR_WIDTH / 2.',
        'Return an object with all five keys: x, y, width, height and lane.'
    ],
    tests: [
        { name: 'The car sits in the middle of its lane', check: function (fn) {
            const car = fn(0, 100);
            const ok = car.x + car.width / 2 === laneCenterX(0);
            return { ok: ok, detail: 'the car spans ' + car.x + ' to ' + (car.x + car.width) + ', lane middle is ' + laneCenterX(0) };
        } },
        { name: 'It uses the y you asked for', check: function (fn) {
            return { ok: fn(1, 123).y === 123, detail: 'got y = ' + fn(1, 123).y };
        } },
        { name: 'Every car is CAR_WIDTH by CAR_HEIGHT', check: function (fn) {
            const car = fn(2, 0);
            const ok = car.width === CAR_WIDTH && car.height === CAR_HEIGHT;
            return { ok: ok, detail: 'got ' + car.width + ' x ' + car.height };
        } },
        { name: 'It remembers which lane it is in', check: function (fn) {
            const ok = fn(0, 0).lane === 0 && fn(2, 0).lane === 2;
            return { ok: ok, detail: 'got lane ' + fn(2, 0).lane + ' for lane 2' };
        } },
        { name: 'No lane lets a car hang over a verge', check: function (fn) {
            for (let lane = 0; lane < LANE_COUNT; lane++) {
                const car = fn(lane, 0);
                if (car.x < EDGE_WIDTH || car.x + car.width > ROAD_WIDTH - EDGE_WIDTH) {
                    return { ok: false, detail: 'lane ' + lane + ' put a car at x = ' + car.x };
                }
            }
            return { ok: true, detail: '' };
        } },
        { name: 'A car can start above the road (that is how traffic arrives)', check: function (fn) {
            return { ok: fn(1, -74).y === -74, detail: '' };
        } }
    ],
    demo: { kind: 'cars', caption: 'Press the button to drop cars onto the road with your function.' }
},

/* ---------------------------------------------------------- 4 */
{
    id: 'overlaps',
    fnName: 'overlaps',
    title: 'Do two cars touch?',
    adds: 'The game can tell when two cars are in the same place.',
    intro: '<p>This is the most useful function in all of game programming: <strong>do two rectangles overlap?</strong> Every crash, every bullet hit, every button click is this same test.</p>' +
           '<p>The trick is to think backwards. Instead of asking "do they touch?", ask "is there a <strong>gap</strong>?" There are only four ways two rectangles can miss each other:</p>' +
           '<pre class="mini-code">a is fully left of b:    a.x + a.width  &lt;= b.x\n' +
           'a is fully right of b:   a.x            &gt;= b.x + b.width\n' +
           'a is fully above b:      a.y + a.height &lt;= b.y\n' +
           'a is fully below b:      a.y            &gt;= b.y + b.height</pre>' +
           '<p>If not one of those gaps exists, the rectangles must be touching. Flip all four round and join them with <code>&amp;&amp;</code>.</p>',
    spec: {
        input: 'a, b — two rectangles, each { x, y, width, height }',
        output: 'true if they overlap, false if there is any gap between them',
        algorithm: [
            'a.x is less than b.x + b.width      (a starts before b ends)',
            'AND a.x + a.width is more than b.x  (a ends after b starts)',
            'AND a.y is less than b.y + b.height (the same again, up and down)',
            'AND a.y + a.height is more than b.y',
            'Return all four joined with &&.'
        ]
    },
    warning: 'Use < and > , not <= and >= . Two cars whose edges exactly touch are driving alongside each other, not crashing — and a game that kills you for that is not much fun.',
    starter: 'function overlaps(a, b) {\n' +
             '    // four checks joined with &&\n' +
             '}\n',
    answer: 'function overlaps(a, b) {\n' +
            '    return a.x < b.x + b.width &&\n' +
            '           a.x + a.width > b.x &&\n' +
            '           a.y < b.y + b.height &&\n' +
            '           a.y + a.height > b.y;\n' +
            '}\n',
    hints: [
        'Start with the sideways half: a.x < b.x + b.width && a.x + a.width > b.x',
        'Then write exactly the same two lines again with y and height instead of x and width.',
        'All four joined with && — if any one of them is false, the rectangles miss each other.'
    ],
    tests: [
        { name: 'Two rectangles in the same place overlap',
          args: [{ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 0, width: 10, height: 10 }], expect: true },
        { name: 'A gap to the side means no overlap',
          args: [{ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 0, width: 10, height: 10 }], expect: false },
        { name: 'A gap above means no overlap',
          args: [{ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 50, width: 10, height: 10 }], expect: false },
        { name: 'Edges exactly touching do NOT count',
          args: [{ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }], expect: false },
        { name: 'One pixel of shared space DOES count',
          args: [{ x: 0, y: 0, width: 10, height: 10 }, { x: 9, y: 0, width: 10, height: 10 }], expect: true },
        { name: 'A small rectangle inside a big one overlaps',
          args: [{ x: 2, y: 2, width: 2, height: 2 }, { x: 0, y: 0, width: 10, height: 10 }], expect: true },
        { name: 'Corner to corner does not count',
          args: [{ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 10, width: 10, height: 10 }], expect: false },
        { name: 'Overlapping sideways but not up-and-down is still a miss',
          args: [{ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 30, width: 10, height: 10 }], expect: false },
        { name: 'It gives the same answer whichever rectangle comes first', check: function (fn) {
            const a = { x: 0, y: 0, width: 10, height: 10 };
            const b = { x: 5, y: 5, width: 10, height: 10 };
            return { ok: fn(a, b) === fn(b, a) && fn(a, b) === true, detail: 'fn(a,b) = ' + fn(a, b) + ', fn(b,a) = ' + fn(b, a) };
        } },
        { name: 'Two real cars in different lanes never touch', check: function (fn) {
            const ok = fn(createCar(0, 100), createCar(1, 100)) === false &&
                       fn(createCar(0, 100), createCar(2, 100)) === false;
            return { ok: ok, detail: 'lanes are wider than cars, so this must be false' };
        } },
        { name: 'Two real cars in the same lane, one on top of the other, do', check: function (fn) {
            return { ok: fn(createCar(1, 100), createCar(1, 140)) === true, detail: '' };
        } }
    ],
    demo: { kind: 'overlap', caption: 'Drive the black car into the other one and watch your function notice.' }
},

/* ---------------------------------------------------------- 5 */
{
    id: 'steerPlayer',
    fnName: 'steerPlayer',
    title: 'Steer the car',
    adds: 'You can drive!',
    intro: '<p>Time to put clamping to work. The state holds <code>steering</code>: <code>-1</code> when the player is holding left, <code>1</code> for right, and <code>0</code> when they are not steering at all.</p>' +
           '<p>Notice the <code>seconds</code> input. Frames do not all take the same time, so movement is always <strong>speed × time</strong>, never just "add 5 pixels". That way the car drives at the same speed on a fast computer and a slow one.</p>',
    spec: {
        input: 'state — the game state. seconds — how much time this frame took.',
        output: 'nothing; it changes state.player.x',
        algorithm: [
            'Work out where the car wants to go: state.player.x + state.steering × STEER_SPEED × seconds.',
            'Squeeze that between PLAYER_MIN_X and PLAYER_MAX_X with clamp.',
            'Store the answer back in state.player.x.'
        ]
    },
    warning: 'STEER_SPEED is measured in pixels per SECOND, and seconds is a small decimal like 0.016. Multiplying them gives the handful of pixels to move this frame.',
    starter: 'function steerPlayer(state, seconds) {\n' +
             '    // move by steering x STEER_SPEED x seconds, then clamp\n' +
             '}\n',
    answer: 'function steerPlayer(state, seconds) {\n' +
            '    const moved = state.player.x + state.steering * STEER_SPEED * seconds;\n' +
            '    state.player.x = clamp(moved, PLAYER_MIN_X, PLAYER_MAX_X);\n' +
            '}\n',
    hints: [
        'Work the new position out into a variable first — it is easier to read that way.',
        'The distance to move is state.steering * STEER_SPEED * seconds. When steering is 0 that is 0, so a car nobody is steering stays put all by itself.',
        'state.player.x = clamp(moved, PLAYER_MIN_X, PLAYER_MAX_X);'
    ],
    tests: [
        { name: 'Steering right moves the car right', check: function (fn) {
            const state = createGame();
            const startX = state.player.x;
            state.steering = 1;
            fn(state, 0.1);
            return { ok: state.player.x > startX, detail: 'x went from ' + startX + ' to ' + state.player.x };
        } },
        { name: 'Steering left moves the car left', check: function (fn) {
            const state = createGame();
            const startX = state.player.x;
            state.steering = -1;
            fn(state, 0.1);
            return { ok: state.player.x < startX, detail: 'x went from ' + startX + ' to ' + state.player.x };
        } },
        { name: 'Not steering leaves the car exactly where it was', check: function (fn) {
            const state = createGame();
            const startX = state.player.x;
            state.steering = 0;
            fn(state, 0.5);
            return { ok: state.player.x === startX, detail: 'the car drifted to ' + state.player.x };
        } },
        { name: 'The distance depends on the time', check: function (fn) {
            const slow = createGame();
            const fast = createGame();
            slow.steering = 1;
            fast.steering = 1;
            fn(slow, 0.1);
            fn(fast, 0.2);
            const slowMoved = slow.player.x - createGame().player.x;
            const fastMoved = fast.player.x - createGame().player.x;
            const ok = Math.abs(fastMoved - slowMoved * 2) < 0.001;
            return { ok: ok, detail: '0.1s moved ' + slowMoved + ', 0.2s moved ' + fastMoved + ' (it should be exactly twice)' };
        } },
        { name: 'It moves STEER_SPEED pixels in a whole second', check: function (fn) {
            const state = createGame();
            const startX = state.player.x;
            state.steering = 1;
            fn(state, 0.1);
            const ok = Math.abs((state.player.x - startX) - STEER_SPEED * 0.1) < 0.001;
            return { ok: ok, detail: 'moved ' + (state.player.x - startX) + ' in 0.1s, expected ' + STEER_SPEED * 0.1 };
        } },
        { name: 'The car stops at the left verge', check: function (fn) {
            const state = createGame();
            state.steering = -1;
            for (let i = 0; i < 100; i++) { fn(state, 0.1); }
            return { ok: state.player.x === PLAYER_MIN_X, detail: 'the car ended at x = ' + state.player.x + ', the verge is at ' + PLAYER_MIN_X };
        } },
        { name: 'The car stops at the right verge', check: function (fn) {
            const state = createGame();
            state.steering = 1;
            for (let i = 0; i < 100; i++) { fn(state, 0.1); }
            return { ok: state.player.x === PLAYER_MAX_X, detail: 'the car ended at x = ' + state.player.x + ', the verge is at ' + PLAYER_MAX_X };
        } }
    ],
    demo: { kind: 'mini', flags: {}, caption: 'An empty road to practise on. The traffic arrives in step 6.' }
},

/* ---------------------------------------------------------- 6 */
{
    id: 'moveCars',
    fnName: 'moveCars',
    title: 'Make the traffic flow',
    adds: 'The other cars come down the road.',
    intro: '<p>Here is the illusion at the heart of every racing game: <strong>your car never actually moves forward</strong>. It sits at the bottom of the screen all race long. What moves is everything else — the traffic slides <em>down</em> and the road markings scroll.</p>' +
           '<p>Adding to a car\'s <code>y</code> moves it down the screen, which looks exactly like you driving past it.</p>',
    spec: {
        input: 'cars — an array of cars. distance — how many pixels to move them down.',
        output: 'a NEW array of cars, each one further down the road',
        algorithm: [
            'Start an empty array.',
            'For every car in the list, push a new car with the same x, width, height and lane, but with y + distance.',
            'Return the new array.'
        ]
    },
    warning: 'Build new car objects rather than changing the old ones. Functions that never damage what you hand them are far easier to trust — and much easier to test.',
    starter: 'function moveCars(cars, distance) {\n' +
             '    // a new list, every car pushed further down the road\n' +
             '}\n',
    answer: 'function moveCars(cars, distance) {\n' +
            '    const moved = [];\n' +
            '    for (let i = 0; i < cars.length; i++) {\n' +
            '        const car = cars[i];\n' +
            '        moved.push({\n' +
            '            x: car.x,\n' +
            '            y: car.y + distance,\n' +
            '            width: car.width,\n' +
            '            height: car.height,\n' +
            '            lane: car.lane\n' +
            '        });\n' +
            '    }\n' +
            '    return moved;\n' +
            '}\n',
    hints: [
        'A for loop over cars, pushing one new object per car.',
        'Copy x, width, height and lane straight across; only y changes.',
        'Do not forget to return the new array at the end.'
    ],
    tests: [
        { name: 'One car moves down by the distance',
          args: [[{ x: 1, y: 10, width: 44, height: 74, lane: 0 }], 25],
          expect: [{ x: 1, y: 35, width: 44, height: 74, lane: 0 }] },
        { name: 'Every car in the list moves', check: function (fn) {
            const out = fn([createCar(0, 0), createCar(1, 100), createCar(2, 200)], 10);
            const ok = out.length === 3 && out[0].y === 10 && out[1].y === 110 && out[2].y === 210;
            return { ok: ok, detail: 'got ' + out.map(function (c) { return c.y; }).join(', ') };
        } },
        { name: 'An empty road stays empty', args: [[], 20], expect: [] },
        { name: 'The lane number is kept', check: function (fn) {
            return { ok: fn([createCar(2, 0)], 5)[0].lane === 2, detail: 'the lane was lost' };
        } },
        { name: 'The old cars are not damaged', check: function (fn) {
            const cars = [createCar(0, 10)];
            fn(cars, 50);
            return { ok: cars[0].y === 10, detail: 'the car you were given moved to y = ' + cars[0].y };
        } },
        { name: 'It returns a new array, not the old one', check: function (fn) {
            const cars = [createCar(0, 10)];
            return { ok: fn(cars, 5) !== cars, detail: 'you returned the same array' };
        } },
        { name: 'Decimal distances work too (frames are not whole numbers)', check: function (fn) {
            const out = fn([createCar(0, 0)], 2.5);
            return { ok: out[0].y === 2.5, detail: 'got y = ' + out[0].y };
        } }
    ],
    demo: { kind: 'mini', flags: { traffic: true }, caption: 'Traffic! It never disappears yet, though — that is step 7.' }
},

/* ---------------------------------------------------------- 7 */
{
    id: 'keepCarsOnScreen',
    fnName: 'keepCarsOnScreen',
    title: 'Tidy up behind you',
    adds: 'Cars you have overtaken are forgotten.',
    intro: '<p>Right now every car ever created stays in the list for ever, crawling further and further below the screen. After a few minutes the game would be checking thousands of invisible cars every frame and would crawl to a halt.</p>' +
           '<p>So each frame we build a new list of only the cars still worth thinking about. And there is a bonus: the number of cars we <em>drop</em> is exactly the number you have just overtaken, which is how the game scores you.</p>',
    spec: {
        input: 'cars — an array of cars',
        output: 'a NEW array holding only the cars still on the road',
        algorithm: [
            'Start an empty array.',
            'For every car, ask isOnScreen(car); if it says true, push that car.',
            'Return the kept cars.'
        ]
    },
    warning: 'isOnScreen is already written for you: a car counts as gone once its TOP edge is past the bottom of the road, which means the whole car has left the picture.',
    starter: 'function keepCarsOnScreen(cars) {\n' +
             '    // keep only the cars isOnScreen still likes\n' +
             '}\n',
    answer: 'function keepCarsOnScreen(cars) {\n' +
            '    const kept = [];\n' +
            '    for (let i = 0; i < cars.length; i++) {\n' +
            '        if (isOnScreen(cars[i])) {\n' +
            '            kept.push(cars[i]);\n' +
            '        }\n' +
            '    }\n' +
            '    return kept;\n' +
            '}\n',
    hints: [
        'This is the same shape as moveCars, but with an if inside the loop.',
        'if (isOnScreen(cars[i])) { kept.push(cars[i]); }',
        'cars.filter(isOnScreen) does the whole job in one line, once you are comfortable with filter.'
    ],
    tests: [
        { name: 'A car in the middle of the road is kept', check: function (fn) {
            return { ok: fn([createCar(0, 100)]).length === 1, detail: '' };
        } },
        { name: 'A car past the bottom is dropped', check: function (fn) {
            return { ok: fn([createCar(0, ROAD_HEIGHT + 5)]).length === 0, detail: '' };
        } },
        { name: 'A car half off the bottom is still kept', check: function (fn) {
            return { ok: fn([createCar(0, ROAD_HEIGHT - 10)]).length === 1, detail: 'part of it is still visible' };
        } },
        { name: 'A car still above the top is kept', check: function (fn) {
            return { ok: fn([createCar(0, -70)]).length === 1, detail: 'it is about to drive into view' };
        } },
        { name: 'It keeps the right ones out of a mixed list', check: function (fn) {
            const out = fn([createCar(0, 100), createCar(1, ROAD_HEIGHT + 1), createCar(2, 300)]);
            const ok = out.length === 2 && out[0].y === 100 && out[1].y === 300;
            return { ok: ok, detail: 'kept ' + out.length + ' car(s)' };
        } },
        { name: 'An empty road stays empty', args: [[]], expect: [] },
        { name: 'The order is not shuffled', check: function (fn) {
            const out = fn([createCar(0, 10), createCar(1, 20), createCar(2, 30)]);
            const ok = out[0].y === 10 && out[1].y === 20 && out[2].y === 30;
            return { ok: ok, detail: 'got ' + out.map(function (c) { return c.y; }).join(', ') };
        } }
    ],
    demo: { kind: 'mini', flags: { traffic: true, remove: true }, caption: 'Cars now vanish at the bottom — but nothing new arrives until step 8.' }
},

/* ---------------------------------------------------------- 8 */
{
    id: 'spawnCar',
    fnName: 'spawnCar',
    title: 'Send in the traffic',
    adds: 'The traffic never stops coming.',
    intro: '<p>New cars appear just above the top of the screen, at <code>y = -CAR_HEIGHT</code>, so they slide smoothly into view instead of popping into existence.</p>' +
           '<p>There is one rule: <strong>never use the same lane as the car before</strong>. Two cars nose to tail in one lane are no fun to dodge, and skipping that lane guarantees there is always a way through.</p>' +
           '<p>Notice how we pick the lane: list the allowed ones, then choose from that list. That is the same trick the Snake game uses for its apples — and it is much safer than guessing at random until you get lucky.</p>',
    spec: {
        input: 'state — the game state',
        output: 'nothing; it adds one car to state.cars',
        algorithm: [
            'Look at the last car in state.cars (there may not be one yet).',
            'Build a list of allowed lanes: every lane from 0 to LANE_COUNT - 1, except the lane that last car used.',
            'Pick one of the allowed lanes at random with Math.floor(Math.random() * choices.length).',
            'Push createCar(lane, -CAR_HEIGHT) onto state.cars.'
        ]
    },
    warning: 'On the very first car there is nothing to compare with, so every lane is allowed. Check for that before reading the last car, or your code will crash on an empty road.',
    starter: 'function spawnCar(state) {\n' +
             '    // 1. which lane did the last car use? (there may not be one)\n' +
             '    // 2. list every OTHER lane\n' +
             '    // 3. pick one at random and add a car just above the road\n' +
             '}\n',
    answer: 'function spawnCar(state) {\n' +
            '    const choices = [];\n' +
            '    const lastCar = state.cars.length > 0 ? state.cars[state.cars.length - 1] : null;\n' +
            '\n' +
            '    for (let lane = 0; lane < LANE_COUNT; lane++) {\n' +
            '        if (lastCar === null || lane !== lastCar.lane) {\n' +
            '            choices.push(lane);\n' +
            '        }\n' +
            '    }\n' +
            '\n' +
            '    const lane = choices[Math.floor(Math.random() * choices.length)];\n' +
            '    state.cars.push(createCar(lane, -CAR_HEIGHT));\n' +
            '}\n',
    hints: [
        'The last car is state.cars[state.cars.length - 1] — but only when state.cars.length is more than 0.',
        'Loop lane from 0 to LANE_COUNT - 1 and push it into choices unless it matches the last car\'s lane.',
        'state.cars.push(createCar(lane, -CAR_HEIGHT)); puts the new car just above the top edge.'
    ],
    tests: [
        { name: 'It adds exactly one car', check: function (fn) {
            const state = createGame();
            fn(state);
            return { ok: state.cars.length === 1, detail: 'the road now has ' + state.cars.length + ' car(s)' };
        } },
        { name: 'The new car starts just above the road', check: function (fn) {
            const state = createGame();
            fn(state);
            return { ok: state.cars[0].y === -CAR_HEIGHT, detail: 'it appeared at y = ' + state.cars[0].y + ', expected ' + (-CAR_HEIGHT) };
        } },
        { name: 'It works on an empty road (no car to compare with)', check: function (fn) {
            const state = createGame();
            try {
                fn(state);
                return { ok: state.cars.length === 1, detail: '' };
            } catch (e) {
                return { ok: false, detail: 'it crashed on the very first car: ' + e.message };
            }
        } },
        { name: 'The new car is in a real lane', check: function (fn) {
            const state = createGame();
            for (let i = 0; i < 20; i++) { fn(state); }
            const ok = state.cars.every(function (car) { return car.lane >= 0 && car.lane < LANE_COUNT; });
            return { ok: ok, detail: 'a car was sent to a lane that does not exist' };
        } },
        { name: 'It never uses the same lane twice in a row', check: function (fn) {
            const state = createGame();
            for (let i = 0; i < 200; i++) { fn(state); }
            for (let i = 1; i < state.cars.length; i++) {
                if (state.cars[i].lane === state.cars[i - 1].lane) {
                    return { ok: false, detail: 'cars ' + (i - 1) + ' and ' + i + ' were both sent down lane ' + state.cars[i].lane };
                }
            }
            return { ok: true, detail: '' };
        } },
        { name: 'But it does use all three lanes over time', check: function (fn) {
            const state = createGame();
            for (let i = 0; i < 200; i++) { fn(state); }
            const seen = {};
            state.cars.forEach(function (car) { seen[car.lane] = true; });
            const count = Object.keys(seen).length;
            return { ok: count === 3, detail: 'in 200 cars it only ever used ' + count + ' lane(s)' };
        } },
        { name: 'The cars it makes are proper rectangles', check: function (fn) {
            const state = createGame();
            fn(state);
            const car = state.cars[0];
            const ok = car.width === CAR_WIDTH && car.height === CAR_HEIGHT && typeof car.x === 'number';
            return { ok: ok, detail: 'got ' + JSON.stringify(car) };
        } }
    ],
    demo: { kind: 'mini', flags: { traffic: true, remove: true, spawn: true },
            caption: 'Endless traffic — and you can drive straight through it. Step 9 fixes that!' }
},

/* ---------------------------------------------------------- 9 */
{
    id: 'hasCrashed',
    fnName: 'hasCrashed',
    title: 'Crash!',
    adds: 'Hitting a car ends the race.',
    intro: '<p>You wrote the hard part in step 4. Now use it: the player has crashed if their car overlaps <em>any</em> of the traffic.</p>' +
           '<p>This is a pattern you will write hundreds of times — "is this true of any item in the list?" — and the trick is always the same: answer <code>true</code> the moment you find one, and only answer <code>false</code> once you have checked them all.</p>',
    spec: {
        input: 'state — the game state',
        output: 'true if state.player overlaps any car in state.cars, otherwise false',
        algorithm: [
            'Walk through state.cars one car at a time.',
            'If overlaps(state.player, car) is true, return true straight away.',
            'If the loop finishes without finding one, return false.'
        ]
    },
    starter: 'function hasCrashed(state) {\n' +
             '    // does the player touch any of the traffic?\n' +
             '}\n',
    answer: 'function hasCrashed(state) {\n' +
            '    for (let i = 0; i < state.cars.length; i++) {\n' +
            '        if (overlaps(state.player, state.cars[i])) {\n' +
            '            return true;\n' +
            '        }\n' +
            '    }\n' +
            '    return false;\n' +
            '}\n',
    hints: [
        'Loop over state.cars with a for loop.',
        'Inside: if (overlaps(state.player, state.cars[i])) { return true; }',
        'return false; goes AFTER the loop — one car at a time is not enough to say the road is clear.'
    ],
    tests: [
        { name: 'An empty road is never a crash', check: function (fn) {
            const state = createGame();
            return { ok: fn(state) === false, detail: '' };
        } },
        { name: 'A car right on top of the player is a crash', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(1, PLAYER_Y)];
            return { ok: fn(state) === true, detail: 'the player starts in lane 1' };
        } },
        { name: 'A car in another lane is not', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(0, PLAYER_Y), createCar(2, PLAYER_Y)];
            return { ok: fn(state) === false, detail: 'lanes are wider than cars' };
        } },
        { name: 'A car far up the road is not', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(1, 0)];
            return { ok: fn(state) === false, detail: '' };
        } },
        { name: 'A car overlapping by just a few pixels is a crash', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(1, PLAYER_Y - CAR_HEIGHT + 4)];
            return { ok: fn(state) === true, detail: 'a near miss with 4 pixels of overlap still counts' };
        } },
        { name: 'A car exactly touching bumper to bumper is not', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(1, PLAYER_Y - CAR_HEIGHT)];
            return { ok: fn(state) === false, detail: 'touching edges are not an overlap' };
        } },
        { name: 'It finds a crash anywhere in a long list', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(0, 10), createCar(2, 80), createCar(0, 150), createCar(1, PLAYER_Y)];
            return { ok: fn(state) === true, detail: 'the crashing car was last in the list' };
        } }
    ],
    demo: { kind: 'mini', flags: { traffic: true, remove: true, spawn: true, crash: true },
            caption: 'Now it matters. Steer with the buttons and try to survive.' }
},

/* ---------------------------------------------------------- 10 */
{
    id: 'updateRace',
    fnName: 'updateRace',
    title: 'One frame of the race',
    adds: 'Everything you have written now works together.',
    intro: '<p>The boss step. Sixty times a second the browser hands the game a small number of milliseconds and asks "what happens next?". This function answers, using almost everything you have built.</p>' +
           '<p>Two useful helpers are already written: <code>scoreForPass(level)</code> gives 10 × level, and <code>levelForPassed(passed)</code> goes up every 5 cars.</p>',
    spec: {
        input: 'state — the game state. elapsedMs — milliseconds since the last frame.',
        output: 'nothing; it changes the state',
        algorithm: [
            'If state.isOver or state.isPaused, do nothing at all.',
            'seconds = elapsedMs / 1000, and travelled = speedForLevel(state.level) × state.boost × seconds.',
            'steerPlayer(state, seconds).',
            'state.cars = moveCars(state.cars, travelled).',
            'Remember how many cars there were, call keepCarsOnScreen, and the difference is how many you have overtaken.',
            'For each one overtaken: add to state.passed, add scoreForPass(state.level) to state.score, then state.level = levelForPassed(state.passed).',
            'Add travelled to state.distance, and scroll the markings: state.stripeOffset = (state.stripeOffset + travelled) % STRIPE_PERIOD.',
            'Add travelled to state.sinceSpawn; once it reaches spawnGapForLevel(state.level), call spawnCar(state) and set sinceSpawn back to 0.',
            'Finally, if hasCrashed(state) then state.isOver = true.'
        ]
    },
    warning: 'Score the overtaken cars BEFORE you work out the new level, or the very car that pushes you up a level would be paid at the higher rate.',
    starter: 'function updateRace(state, elapsedMs) {\n' +
             '    // 1. nothing to do if the race is over or paused\n' +
             '    // 2. how far does the road move this frame?\n' +
             '    // 3. steer, move the traffic, tidy up behind you\n' +
             '    // 4. score the cars you passed and work out the level\n' +
             '    // 5. distance, road markings, and the next car\n' +
             '    // 6. did you crash?\n' +
             '}\n',
    answer: 'function updateRace(state, elapsedMs) {\n' +
            '    if (state.isOver || state.isPaused) {\n' +
            '        return;\n' +
            '    }\n' +
            '\n' +
            '    const seconds = elapsedMs / 1000;\n' +
            '    const travelled = speedForLevel(state.level) * state.boost * seconds;\n' +
            '\n' +
            '    steerPlayer(state, seconds);\n' +
            '    state.cars = moveCars(state.cars, travelled);\n' +
            '\n' +
            '    const before = state.cars.length;\n' +
            '    state.cars = keepCarsOnScreen(state.cars);\n' +
            '    const overtaken = before - state.cars.length;\n' +
            '    if (overtaken > 0) {\n' +
            '        state.passed = state.passed + overtaken;\n' +
            '        state.score = state.score + scoreForPass(state.level) * overtaken;\n' +
            '        state.level = levelForPassed(state.passed);\n' +
            '    }\n' +
            '\n' +
            '    state.distance = state.distance + travelled;\n' +
            '    state.stripeOffset = (state.stripeOffset + travelled) % STRIPE_PERIOD;\n' +
            '\n' +
            '    state.sinceSpawn = state.sinceSpawn + travelled;\n' +
            '    if (state.sinceSpawn >= spawnGapForLevel(state.level)) {\n' +
            '        spawnCar(state);\n' +
            '        state.sinceSpawn = 0;\n' +
            '    }\n' +
            '\n' +
            '    if (hasCrashed(state)) {\n' +
            '        state.isOver = true;\n' +
            '    }\n' +
            '}\n',
    hints: [
        'Build it up one line at a time and press Test after each — the messages will tell you which part is still missing.',
        'The number of cars overtaken is simply how many keepCarsOnScreen threw away: before - state.cars.length.',
        'The % in the stripe line keeps the markings scrolling round and round instead of running away to a huge number.'
    ],
    tests: [
        { name: 'The road moves and the distance grows', check: function (fn) {
            const state = createGame();
            fn(state, 100);
            return { ok: state.distance > 0, detail: 'distance is still ' + state.distance };
        } },
        { name: 'The road markings scroll', check: function (fn) {
            const state = createGame();
            fn(state, 100);
            return { ok: state.stripeOffset > 0 && state.stripeOffset < STRIPE_PERIOD,
                     detail: 'stripeOffset is ' + state.stripeOffset + ' (it must stay under ' + STRIPE_PERIOD + ')' };
        } },
        { name: 'The player is steered', check: function (fn) {
            const state = createGame();
            const startX = state.player.x;
            state.steering = 1;
            fn(state, 100);
            return { ok: state.player.x > startX, detail: 'the car did not move' };
        } },
        { name: 'Traffic moves down the road', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(0, 0)];
            fn(state, 100);
            return { ok: state.cars[0].y > 0, detail: 'the car is still at y = ' + state.cars[0].y };
        } },
        { name: 'A car that leaves the screen is dropped', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(0, ROAD_HEIGHT - 1)];
            fn(state, 100);
            return { ok: state.cars.length === 0, detail: 'it is still in the list' };
        } },
        { name: 'Overtaking scores 10 points on level 1', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(0, ROAD_HEIGHT - 1)];
            fn(state, 100);
            const ok = state.passed === 1 && state.score === 10;
            return { ok: ok, detail: 'passed ' + state.passed + ', score ' + state.score };
        } },
        { name: 'Five overtakes reach level 2', check: function (fn) {
            const state = createGame();
            for (let i = 0; i < 5; i++) {
                state.cars = [createCar(0, ROAD_HEIGHT - 1)];
                fn(state, 16);
            }
            const ok = state.passed === 5 && state.level === 2;
            return { ok: ok, detail: 'passed ' + state.passed + ', level ' + state.level };
        } },
        { name: 'The fifth car is still paid at the old level', check: function (fn) {
            const state = createGame();
            for (let i = 0; i < 5; i++) {
                state.cars = [createCar(0, ROAD_HEIGHT - 1)];
                fn(state, 16);
            }
            return { ok: state.score === 50, detail: 'score is ' + state.score + ', expected 50 (5 cars at 10 points)' };
        } },
        { name: 'New traffic appears after enough road', check: function (fn) {
            const state = createGame();
            for (let i = 0; i < 40; i++) { fn(state, 100); }
            return { ok: state.cars.length >= 1, detail: 'no car has appeared after 4 seconds of driving' };
        } },
        { name: 'Hitting a car ends the race', check: function (fn) {
            const state = createGame();
            state.cars = [createCar(1, PLAYER_Y - 5)];
            fn(state, 16);
            return { ok: state.isOver === true, detail: 'the player drove through it' };
        } },
        { name: 'A paused race does not move', check: function (fn) {
            const state = createGame();
            state.isPaused = true;
            fn(state, 500);
            return { ok: state.distance === 0 && state.cars.length === 0, detail: 'the race carried on while paused' };
        } },
        { name: 'A finished race does not move either', check: function (fn) {
            const state = createGame();
            state.isOver = true;
            fn(state, 500);
            return { ok: state.distance === 0, detail: 'the race carried on after the crash' };
        } },
        { name: 'Accelerating covers more road', check: function (fn) {
            const slow = createGame();
            const fast = createGame();
            fast.boost = 2;
            fn(slow, 100);
            fn(fast, 100);
            return { ok: fast.distance > slow.distance, detail: 'boost made no difference — did you multiply by state.boost?' };
        } }
    ],
    demo: { kind: 'game', caption: 'The real game, run by your updateRace. Steer with the buttons.' }
},

/* ---------------------------------------------------------- 11 */
{
    id: 'speedForLevel',
    fnName: 'speedForLevel',
    title: 'Put your foot down',
    adds: 'Every level really is faster.',
    intro: '<p>The level has to mean something, and in a racing game it means speed: how many pixels of road rush past every second.</p>' +
           '<p>Level 1 rolls along at 180. Each level adds 35 — and then it stops at 520, because past that a car can cross more than its own length between two frames and the crash test would start missing things.</p>',
    spec: {
        input: 'level — the level number (1, 2, 3, …)',
        output: 'the speed in pixels per second',
        algorithm: [
            'Work out 180 + (level - 1) × 35.',
            'If that is more than 520, return 520 instead.',
            'Otherwise return it.'
        ]
    },
    warning: 'Level 1 must come out at exactly 180, which is why the sum uses (level - 1) and not level.',
    starter: 'function speedForLevel(level) {\n' +
             '    // 180 at level 1, 35 faster each level, never above 520\n' +
             '}\n',
    answer: 'function speedForLevel(level) {\n' +
            '    const speed = 180 + (level - 1) * 35;\n' +
            '    if (speed > 520) {\n' +
            '        return 520;\n' +
            '    }\n' +
            '    return speed;\n' +
            '}\n',
    hints: [
        'Work the speed out into a variable first, then decide whether to hand it back.',
        'The ceiling is an if: if (speed > 520) { return 520; }',
        'Math.min(520, speed) does the same job in one line, if you prefer.'
    ],
    tests: [
        { name: 'Level 1 runs at 180', args: [1], expect: 180 },
        { name: 'Level 2 runs at 215', args: [2], expect: 215 },
        { name: 'Level 5 runs at 320', args: [5], expect: 320 },
        { name: 'Level 10 runs at 495', args: [10], expect: 495 },
        { name: 'Level 11 has hit the ceiling of 520', args: [11], expect: 520 },
        { name: 'Level 40 is still 520', args: [40], expect: 520 },
        { name: 'It never returns more than 520', check: function (fn) {
            for (let level = 1; level <= 100; level++) {
                if (fn(level) > 520) { return { ok: false, detail: 'level ' + level + ' gave ' + fn(level) }; }
            }
            return { ok: true, detail: '' };
        } },
        { name: 'It never gets slower as the level goes up', check: function (fn) {
            for (let level = 2; level <= 40; level++) {
                if (fn(level) < fn(level - 1)) {
                    return { ok: false, detail: 'level ' + level + ' is slower than level ' + (level - 1) };
                }
            }
            return { ok: true, detail: '' };
        } }
    ],
    demo: { kind: 'game', flags: { levelPicker: true }, caption: 'Use the level buttons to feel your speed curve. Level 11 is not for beginners.' }
},

/* ---------------------------------------------------------- 12 */
{
    id: 'actionForKey',
    fnName: 'actionForKey',
    title: 'Wire up the keyboard',
    adds: 'You can drive with the keyboard — the game is finished!',
    intro: '<p>Last piece. The browser tells us which key was pressed, as a piece of text like <code>"ArrowLeft"</code> or <code>"w"</code>. The game needs the <em>name of the action</em> instead.</p>' +
           '<p>Steering is different from Tetris and Snake in one important way: you <strong>hold</strong> these keys. That is handled elsewhere, in <code>setHeld</code> and <code>steeringFromInput</code> — all you have to do here is give each key its name.</p>',
    spec: {
        input: 'key — the key name from the browser, e.g. "ArrowLeft", "W", " "',
        output: 'one of "left", "right", "faster", "slower", "pause", "restart" — or null for any other key',
        algorithm: [
            'Make the key lowercase first, so "W" and "w" behave the same.',
            'ArrowLeft or a -> "left"        ArrowRight or d -> "right"',
            'ArrowUp or w -> "faster"        ArrowDown or s -> "slower"',
            'p or a space " " -> "pause"     r -> "restart"',
            'Anything else -> null.'
        ]
    },
    warning: 'Return null (not false, not "none") for keys the game does not use. The rest of the game checks for exactly null.',
    starter: 'function actionForKey(key) {\n' +
             '    const k = String(key).toLowerCase();\n' +
             '    // return the action name for this key, or null\n' +
             '}\n',
    answer: 'function actionForKey(key) {\n' +
            '    const k = String(key).toLowerCase();\n' +
            '\n' +
            '    if (k === \'arrowleft\' || k === \'a\') { return \'left\'; }\n' +
            '    if (k === \'arrowright\' || k === \'d\') { return \'right\'; }\n' +
            '    if (k === \'arrowup\' || k === \'w\') { return \'faster\'; }\n' +
            '    if (k === \'arrowdown\' || k === \'s\') { return \'slower\'; }\n' +
            '    if (k === \'p\' || k === \' \' || k === \'spacebar\') { return \'pause\'; }\n' +
            '    if (k === \'r\') { return \'restart\'; }\n' +
            '\n' +
            '    return null;\n' +
            '}\n',
    hints: [
        'String(key).toLowerCase() turns "ArrowLeft" into "arrowleft" — compare against the lowercase spelling.',
        'One if per action, each returning straight away. The last line of the function is return null;',
        'Two keys can share an action: if (k === \'arrowleft\' || k === \'a\')'
    ],
    tests: [
        { name: 'ArrowLeft steers left', args: ['ArrowLeft'], expect: 'left' },
        { name: 'The letter A steers left too', args: ['a'], expect: 'left' },
        { name: 'A capital A still works', args: ['A'], expect: 'left' },
        { name: 'ArrowRight steers right', args: ['ArrowRight'], expect: 'right' },
        { name: 'The letter D steers right', args: ['d'], expect: 'right' },
        { name: 'ArrowUp accelerates', args: ['ArrowUp'], expect: 'faster' },
        { name: 'W accelerates too', args: ['w'], expect: 'faster' },
        { name: 'ArrowDown brakes', args: ['ArrowDown'], expect: 'slower' },
        { name: 'S brakes too', args: ['s'], expect: 'slower' },
        { name: 'P pauses', args: ['p'], expect: 'pause' },
        { name: 'The space bar pauses as well', args: [' '], expect: 'pause' },
        { name: 'R starts a new race', args: ['r'], expect: 'restart' },
        { name: 'An unused key gives null', args: ['q'], expect: null },
        { name: 'Enter is not one of ours either', args: ['Enter'], expect: null }
    ],
    demo: { kind: 'final', caption: 'Click the page, then drive with the arrow keys. Every function here is yours.' }
}

];
