const fs = require('fs'), vm = require('vm'), path = require('path');
const LIB = require('path').join(__dirname, '..', 'lib') + require('path').sep;
const ctx = vm.createContext({ Math, console, JSON });
['race-road.js', 'race-game.js', 'race-input.js'].forEach(f =>
    vm.runInContext(fs.readFileSync(path.join(LIB, f), 'utf8'), ctx, { filename: f }));
const run = (code) => vm.runInContext(code, ctx);

let failures = 0;
function check(name, condition, extra) {
    if (condition) { console.log('  ok   ' + name); }
    else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + JSON.stringify(extra) : '')); }
}

console.log('road and shapes:');
check('three lanes fit exactly between the verges', run('EDGE_WIDTH * 2 + LANE_COUNT * LANE_WIDTH') === run('ROAD_WIDTH'));
check('a car fits inside a lane with room to spare', run('CAR_WIDTH < LANE_WIDTH'));
check('lane centres are 60, 150 and 240', run('[laneCenterX(0), laneCenterX(1), laneCenterX(2)].join(",")') === '60,150,240');
check('clamp leaves a number that is already in range', run('clamp(50, 0, 100)') === 50);
check('clamp pulls a small number up', run('clamp(-30, 0, 100)') === 0);
check('clamp pulls a big number down', run('clamp(300, 0, 100)') === 100);
check('clamp works on the limits themselves', run('clamp(0, 0, 100) === 0 && clamp(100, 0, 100) === 100'));
check('a new car sits in the middle of its lane', run(`
  (() => { const car = createCar(0, 100);
           return car.x + car.width / 2 === laneCenterX(0) && car.y === 100 &&
                  car.width === CAR_WIDTH && car.height === CAR_HEIGHT && car.lane === 0; })()`));
check('every lane keeps its car between the verges', run(`
  [0,1,2].every(lane => { const car = createCar(lane, 0);
    return car.x >= EDGE_WIDTH && car.x + car.width <= ROAD_WIDTH - EDGE_WIDTH; })`));

console.log('rectangle overlap (every crash depends on this):');
check('two rectangles on top of each other overlap', run(`
  overlaps({x:0,y:0,width:10,height:10}, {x:0,y:0,width:10,height:10})`));
check('rectangles side by side with a gap do not', run(`
  !overlaps({x:0,y:0,width:10,height:10}, {x:20,y:0,width:10,height:10})`));
check('rectangles just touching edge-to-edge do not count', run(`
  !overlaps({x:0,y:0,width:10,height:10}, {x:10,y:0,width:10,height:10})`));
check('one pixel of shared space does count', run(`
  overlaps({x:0,y:0,width:10,height:10}, {x:9,y:0,width:10,height:10})`));
check('same lane but far apart vertically do not overlap', run(`
  !overlaps({x:0,y:0,width:10,height:10}, {x:0,y:200,width:10,height:10})`));
check('a small rectangle completely inside a big one overlaps', run(`
  overlaps({x:2,y:2,width:2,height:2}, {x:0,y:0,width:10,height:10})`));
check('corner-to-corner touching does not count', run(`
  !overlaps({x:0,y:0,width:10,height:10}, {x:10,y:10,width:10,height:10})`));
check('it does not care which rectangle comes first', run(`
  (() => { const a = {x:0,y:0,width:10,height:10}, b = {x:5,y:5,width:10,height:10};
           return overlaps(a,b) === overlaps(b,a); })()`));

console.log('driving:');
check('a new race has your car in the middle lane, road empty', run(`
  (() => { const g = createGame();
           return g.cars.length === 0 && g.player.y === PLAYER_Y &&
                  g.player.x + g.player.width / 2 === laneCenterX(1) &&
                  g.score === 0 && g.level === 1 && !g.isOver; })()`));
check('steering right moves the car right', run(`
  (() => { const g = createGame(); const startX = g.player.x;
           g.steering = 1; steerPlayer(g, 0.1);
           return g.player.x > startX; })()`));
check('steering left moves the car left', run(`
  (() => { const g = createGame(); const startX = g.player.x;
           g.steering = -1; steerPlayer(g, 0.1);
           return g.player.x < startX; })()`));
check('not steering keeps the car exactly where it is', run(`
  (() => { const g = createGame(); const startX = g.player.x;
           g.steering = 0; steerPlayer(g, 0.5);
           return g.player.x === startX; })()`));
check('the car can never drive onto the left verge', run(`
  (() => { const g = createGame(); g.steering = -1;
           for (let i = 0; i < 100; i++) { steerPlayer(g, 0.1); }
           return g.player.x === PLAYER_MIN_X; })()`));
check('the car can never drive onto the right verge', run(`
  (() => { const g = createGame(); g.steering = 1;
           for (let i = 0; i < 100; i++) { steerPlayer(g, 0.1); }
           return g.player.x === PLAYER_MAX_X && g.player.x + CAR_WIDTH === ROAD_WIDTH - EDGE_WIDTH; })()`));

console.log('traffic:');
check('moveCars slides every car down the road', run(`
  JSON.stringify(moveCars([{x:1,y:10,width:2,height:3,lane:0}], 25))`)
  === '[{"x":1,"y":35,"width":2,"height":3,"lane":0}]');
check('moveCars leaves the old cars untouched', run(`
  (() => { const cars = [createCar(0, 10)];
           moveCars(cars, 50);
           return cars[0].y === 10; })()`));
check('moveCars on an empty road gives an empty road', run('moveCars([], 20).length') === 0);
check('keepCarsOnScreen drops the cars past the bottom', run(`
  (() => { const cars = [createCar(0, 100), createCar(1, ROAD_HEIGHT + 5), createCar(2, ROAD_HEIGHT - 1)];
           const kept = keepCarsOnScreen(cars);
           return kept.length === 2; })()`));
check('keepCarsOnScreen keeps a car that is only half off the top', run(`
  keepCarsOnScreen([createCar(0, -40)]).length`) === 1);
check('spawnCar puts a new car just above the road', run(`
  (() => { const g = createGame(); spawnCar(g);
           return g.cars.length === 1 && g.cars[0].y === -CAR_HEIGHT; })()`));
check('spawnCar never uses the same lane twice in a row', run(`
  (() => { const g = createGame();
           for (let i = 0; i < 200; i++) { spawnCar(g); }
           for (let i = 1; i < g.cars.length; i++) {
             if (g.cars[i].lane === g.cars[i-1].lane) return false;
           }
           return true; })()`));
check('spawnCar still uses every lane over time', run(`
  (() => { const g = createGame();
           for (let i = 0; i < 200; i++) { spawnCar(g); }
           const seen = {}; g.cars.forEach(c => { seen[c.lane] = true; });
           return Object.keys(seen).length === 3; })()`));

console.log('crashing and scoring:');
check('driving into a car in your lane is a crash', run(`
  (() => { const g = createGame();
           g.cars = [createCar(1, PLAYER_Y)];
           return hasCrashed(g) === true; })()`));
check('a car in another lane is not a crash', run(`
  (() => { const g = createGame();
           g.cars = [createCar(0, PLAYER_Y), createCar(2, PLAYER_Y)];
           return hasCrashed(g) === false; })()`));
check('a car far up the road is not a crash', run(`
  (() => { const g = createGame();
           g.cars = [createCar(1, 0)];
           return hasCrashed(g) === false; })()`));
check('an empty road is never a crash', run(`
  (() => { const g = createGame(); return hasCrashed(g) === false; })()`));
check('scoreForPass is 10 times the level', run('[scoreForPass(1), scoreForPass(4)].join(",")') === '10,40');
check('levelForPassed goes up every 5 cars', run(`
  [levelForPassed(0), levelForPassed(4), levelForPassed(5), levelForPassed(22)].join(",")`) === '1,1,2,5');
check('speedForLevel rises then stops at 520', run(`
  speedForLevel(1) === 180 && speedForLevel(2) === 215 && speedForLevel(11) === 520 && speedForLevel(40) === 520`));
check('secondsBetweenCars shrinks but never below 0.8', run(`
  secondsBetweenCars(1) === 1.6 && Math.abs(secondsBetweenCars(5) - 1.2) < 0.001 &&
  secondsBetweenCars(20) === 0.8`));
check('the spawn gap is speed x time', run(`
  Math.abs(spawnGapForLevel(4) - speedForLevel(4) * secondsBetweenCars(4)) < 0.001`));
check('every level leaves time to change lanes', run(`
  (() => { const laneChange = LANE_WIDTH / STEER_SPEED;
           for (let level = 1; level <= 40; level++) {
             if (secondsBetweenCars(level) < laneChange * 2) { return false; }
           }
           return true; })()`));

console.log('one frame of the race:');
check('the road scrolls and the distance grows', run(`
  (() => { const g = createGame();
           updateRace(g, 100);
           return g.distance > 0 && g.stripeOffset > 0; })()`));
check('a car appears once you have driven far enough', run(`
  (() => { const g = createGame();
           for (let i = 0; i < 40; i++) { updateRace(g, 100); }
           return g.cars.length >= 1; })()`));
check('overtaking a car scores points and counts up', run(`
  (() => { const g = createGame();
           g.cars = [createCar(0, ROAD_HEIGHT - 1)];
           updateRace(g, 100);
           return g.passed === 1 && g.score === 10 && g.cars.length === 0; })()`));
check('five overtakes reach level 2', run(`
  (() => { const g = createGame();
           for (let i = 0; i < 5; i++) { g.cars = [createCar(0, ROAD_HEIGHT - 1)]; updateRace(g, 16); }
           return g.passed === 5 && g.level === 2; })()`));
check('hitting a car ends the race', run(`
  (() => { const g = createGame();
           g.cars = [createCar(1, PLAYER_Y - 5)];
           updateRace(g, 16);
           return g.isOver === true; })()`));
check('a paused race does not move', run(`
  (() => { const g = createGame(); g.isPaused = true;
           updateRace(g, 500);
           return g.distance === 0 && g.cars.length === 0; })()`));
check('a finished race does not move either', run(`
  (() => { const g = createGame(); g.isOver = true;
           updateRace(g, 500);
           return g.distance === 0; })()`));
check('accelerating really does cover more road', run(`
  (() => { const slow = createGame(); const fast = createGame();
           slow.boost = 1; fast.boost = BOOST_FAST;
           updateRace(slow, 100); updateRace(fast, 100);
           return fast.distance > slow.distance; })()`));
check('metres are pixels divided by ten', run(`
  (() => { const g = createGame(); g.distance = 1234; return metresDriven(g); })()`) === 123);

console.log('input:');
check('the arrow keys map to driving actions', run(`
  [actionForKey('ArrowLeft'), actionForKey('ArrowRight'), actionForKey('ArrowUp'),
   actionForKey('ArrowDown'), actionForKey('p'), actionForKey('r'), actionForKey('q')].join(",")`)
  === 'left,right,faster,slower,pause,restart,');
check('WASD works too', run(`
  [actionForKey('a'), actionForKey('D'), actionForKey('w'), actionForKey('s')].join(",")`)
  === 'left,right,faster,slower');
check('an unknown key is null', run('actionForKey("Enter") === null'));
check('holding right steers right, holding both cancels out', run(`
  (() => { const input = createInputState();
           setHeld(input, 'right', true);
           const right = steeringFromInput(input);
           setHeld(input, 'left', true);
           const both = steeringFromInput(input);
           return right === 1 && both === 0; })()`));
check('braking beats accelerating', run(`
  (() => { const input = createInputState();
           setHeld(input, 'faster', true);
           setHeld(input, 'slower', true);
           return boostFromInput(input) === BOOST_SLOW; })()`));
check('releaseAll forgets every key', run(`
  (() => { const input = createInputState();
           setHeld(input, 'left', true); setHeld(input, 'faster', true);
           releaseAll(input);
           return steeringFromInput(input) === 0 && boostFromInput(input) === 1; })()`));
check('pause and restart are not held actions', run(`
  !isHeldAction('pause') && !isHeldAction('restart') && isHeldAction('left')`));

console.log('a long race (a robot driver that dodges):');
const drive = run(`
  (() => {
    const g = createGame();
    let frames = 0;

    /* Is any car sitting in the stretch of road this lane needs to be clear? */
    const laneBusy = (lane) => {
      const lookAhead = speedForLevel(g.level) * 0.9;   /* about a second of road */
      return g.cars.some(car =>
        car.lane === lane &&
        car.y + car.height > g.player.y - lookAhead &&
        car.y < g.player.y + g.player.height + 20);
    };

    while (!g.isOver && frames < 12000) {
      const playerLane = Math.round((g.player.x + g.player.width / 2 - EDGE_WIDTH - LANE_WIDTH / 2) / LANE_WIDTH);
      let target = playerLane;
      if (laneBusy(playerLane)) {
        /* only ever move to a NEIGHBOURING free lane — never cross a blocked one */
        if (playerLane - 1 >= 0 && !laneBusy(playerLane - 1)) { target = playerLane - 1; }
        else if (playerLane + 1 < LANE_COUNT && !laneBusy(playerLane + 1)) { target = playerLane + 1; }
      }
      const wantX = laneCenterX(target) - CAR_WIDTH / 2;
      g.steering = Math.abs(wantX - g.player.x) < 4 ? 0 : (wantX > g.player.x ? 1 : -1);

      updateRace(g, 16);
      frames++;

      if (g.player.x < PLAYER_MIN_X || g.player.x > PLAYER_MAX_X) { return 'DROVE OFF THE ROAD'; }
      if (g.cars.some(c => c.y > ROAD_HEIGHT)) { return 'A CAR WAS LEFT BEHIND OFF-SCREEN'; }
      if (g.cars.length > 12) { return 'TRAFFIC PILED UP: ' + g.cars.length; }
    }
    return { frames, passed: g.passed, score: g.score, level: g.level,
             metres: Math.floor(g.distance / 10), crashed: g.isOver };
  })()`);
check('a careful driver can keep going', typeof drive === 'object' && drive.crashed === false, drive);
check('and overtakes plenty of cars', typeof drive === 'object' && drive.passed > 50, drive);
check('the level climbs as cars are passed', typeof drive === 'object' && drive.level >= 5, drive);
console.log('   ' + JSON.stringify(drive));

console.log(failures === 0 ? '\nALL RACE TESTS PASSED' : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
