/* Worksheet: Newton's Third Law — action–reaction pairs, why they don't cancel, and F = ma on both objects. */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, C = F.colors;

    // ── Small helpers ────────────────────────────────────────────────────
    const fmt = x => String(CA.round(x, 4));
    /** Is x a number with at most dp decimal places? */
    const nice = (x, dp = 2) => isFinite(x) && Math.abs(x * 10 ** dp - Math.round(x * 10 ** dp)) < 1e-7;
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    /** 'a cat' → 'the cat' (for the second mention). */
    const the = s => s.replace(/^an? /, 'the ');
    /** CA.mc from a bank item [question-ish, correct, wrong, wrong, wrong]: capitalise the choices. */
    const mcBank = (rng, item) => CA.mc(rng, cap(item[1]), item.slice(2).map(cap));

    // ── Figures ──────────────────────────────────────────────────────────
    /** An arrow from (x1, y1) to (x2, y2) with a filled head. */
    function arrow(x1, y1, x2, y2, opt = {}) {
        const col = opt.stroke || C.ACCENT, L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = 9, w = 4.5;
        const bx = x2 - ux * h, by = y2 - uy * h;
        return F.line(x1, y1, bx, by, { stroke: col, width: 2.2 })
            + F.poly([[x2, y2], [bx - uy * w, by + ux * w], [bx + uy * w, by - ux * w]], { fill: col, stroke: col, width: 1 });
    }
    /**
     * Two objects side by side on the ground (or floating), pushing on each other.
     * L, R = { name, sub, m }; fL, fR = labels of the force ON the left / right object.
     * opt.wheels draws carts; opt.spring puts a compressed spring between them; opt.space hides the ground.
     */
    function pairFig(Lo, Ro, fL, fR, opt = {}) {
        const W = 300, H = 140, ground = 102, cx = 150;
        const mmax = Math.max(Lo.m, Ro.m);
        const size = m => 26 + 46 * Math.sqrt(m / mmax);
        const wL = size(Lo.m) * 1.15, hL = size(Lo.m) * 0.8, wR = size(Ro.m) * 1.15, hR = size(Ro.m) * 0.8;
        const gap = opt.spring ? 26 : 0, bottom = opt.wheels ? ground - 9 : ground;
        const xL = cx - gap / 2 - wL, xR = cx + gap / 2;
        let b = '';
        if (!opt.space) b += F.line(10, ground, W - 10, ground, { width: 1.2 });
        b += F.rect(xL, bottom - hL, wL, hL, { fill: C.FILL }) + F.rect(xR, bottom - hR, wR, hR, { fill: C.SHADE });
        if (opt.wheels) for (const [x, w] of [[xL, wL], [xR, wR]]) b += F.circle(x + w * 0.25, ground - 4.5, 4.5, { fill: '#ffffff' }) + F.circle(x + w * 0.75, ground - 4.5, 4.5, { fill: '#ffffff' });
        if (opt.spring) {
            const y = bottom - Math.min(hL, hR) / 2, x0 = cx - gap / 2, step = gap / 6;
            let d = `M${x0} ${y}`;
            for (let i = 1; i <= 5; i++) d += ` L${x0 + i * step} ${y + (i % 2 ? -6 : 6)}`;
            d += ` L${x0 + gap} ${y}`;
            b += F.path(d, { width: 1.3 });
        }
        const ay = bottom - Math.max(hL, hR) - 16;
        b += arrow(cx - gap / 2 - 4, ay, cx - gap / 2 - 70, ay) + arrow(cx + gap / 2 + 4, ay, cx + gap / 2 + 70, ay);
        b += F.text(cx - gap / 2 - 37, ay - 7, fL, { size: 12, fill: C.ACCENT, bold: true }) + F.text(cx + gap / 2 + 37, ay - 7, fR, { size: 12, fill: C.ACCENT, bold: true });
        b += F.text(cx - gap / 2 - 6, ground + 16, Lo.name, { anchor: 'end', size: 12 }) + F.text(cx + gap / 2 + 6, ground + 16, Ro.name, { anchor: 'start', size: 12 });
        if (Lo.sub) b += F.text(cx - gap / 2 - 6, ground + 31, Lo.sub, { anchor: 'end', size: 12 });
        if (Ro.sub) b += F.text(cx + gap / 2 + 6, ground + 31, Ro.sub, { anchor: 'start', size: 12 });
        return F.svg(W, H, b, { label: 'two objects pushing apart' });
    }
    /** A rocket with its thrust arrow (up, two-line label) and weight arrow (down). */
    function rocketFig(thrust, weight) {
        const W = 220, H = 170, cx = 80;
        let b = F.poly([[cx, 18], [cx + 16, 44], [cx + 16, 112], [cx - 16, 112], [cx - 16, 44]], { fill: C.FILL })
            + F.poly([[cx - 16, 92], [cx - 28, 118], [cx - 16, 112]], { fill: C.SHADE }) + F.poly([[cx + 16, 92], [cx + 28, 118], [cx + 16, 112]], { fill: C.SHADE })
            + F.poly([[cx - 10, 114], [cx, 150], [cx + 10, 114]], { fill: '#ffd8a8', stroke: C.ACCENT, width: 1 })
            + F.text(cx - 22, 150, 'exhaust gas', { anchor: 'end', size: 11 });
        const [t1, t2] = thrust;
        b += arrow(cx + 40, 90, cx + 40, 30) + F.text(cx + 48, 44, t1, { anchor: 'start', size: 12, fill: C.ACCENT, bold: true }) + F.text(cx + 48, 60, t2, { anchor: 'start', size: 12, fill: C.ACCENT, bold: true });
        b += arrow(cx + 40, 100, cx + 40, 156, { stroke: C.INK }) + F.text(cx + 48, 146, weight, { anchor: 'start', size: 12, bold: true });
        return F.svg(W, H, b, { label: 'rocket' });
    }

    // ── Level 1 banks ────────────────────────────────────────────────────
    // [action, the reaction, three wrong answers]
    const REACTIONS = [
        ['your feet push backward on the ground as you walk', 'the ground pushes your feet forward', 'the ground pushes your feet backward', 'your feet push the ground forward', 'Earth’s gravity pulls you down'],
        ['a swimmer’s hands push the water backward', 'the water pushes the swimmer’s hands forward', 'the water pushes the swimmer’s hands backward', 'the swimmer’s hands push the water forward', 'Earth’s gravity pulls the swimmer down'],
        ['a rocket engine pushes hot exhaust gas downward', 'the exhaust gas pushes the rocket upward', 'the exhaust gas pushes the rocket downward', 'Earth’s gravity pulls the rocket downward', 'the air pushes the exhaust gas upward'],
        ['a hammer pushes a nail down into a board', 'the nail pushes the hammer up', 'the board pushes the nail up', 'the hammer pushes the board down', 'Earth’s gravity pulls the hammer down'],
        ['a bat pushes a baseball toward the outfield', 'the baseball pushes the bat back toward the catcher', 'the baseball pushes the bat toward the outfield', 'the air pushes back on the baseball', 'Earth’s gravity pulls the baseball down'],
        ['Earth’s gravity pulls a falling apple downward', 'the apple’s gravity pulls Earth upward', 'the air pushes the apple upward', 'the apple’s gravity pulls Earth downward', 'the apple tree pulls the apple upward'],
        ['a book pushes down on a table', 'the table pushes up on the book', 'Earth’s gravity pulls the book down', 'the table pushes down on the floor', 'the book pulls Earth up'],
        ['a balloon squeezes air out of its open end, backward', 'the escaping air pushes the balloon forward', 'the escaping air pushes the balloon backward', 'the still air in the room pushes the balloon forward', 'the balloon pulls the escaping air forward'],
        ['a girl on a skateboard pushes on a wall in front of her', 'the wall pushes the girl backward, away from the wall', 'the wall pulls the girl toward the wall', 'the girl’s feet push the skateboard toward the wall', 'the ground pushes the wall away from the girl'],
        ['a magnet pulls a paper clip toward the magnet', 'the paper clip pulls the magnet toward the paper clip', 'the paper clip pushes the magnet away', 'the magnet pushes the paper clip away', 'Earth’s gravity pulls the paper clip down'],
        ['a player’s foot pushes a soccer ball forward', 'the soccer ball pushes the foot backward', 'the soccer ball pushes the foot forward', 'the ground pushes the soccer ball up', 'the air pushes the soccer ball backward'],
        ['a car’s tires push backward on the road', 'the road pushes the tires forward', 'the road pushes the tires backward', 'the engine pushes the car forward', 'the air pushes the car backward'],
        ['a rower’s oar pushes the water backward', 'the water pushes the oar forward', 'the water pushes the oar backward', 'the oar pushes the boat forward', 'the boat pushes the water down'],
        ['a boy jumping off a small boat pushes the boat backward', 'the boat pushes the boy forward', 'the boat pushes the boy backward', 'the water pushes the boat forward', 'the boy pushes the water backward'],
        ['a rifle pushes a bullet forward when it fires', 'the bullet pushes the rifle backward', 'the bullet pushes the rifle forward', 'the air pushes the bullet backward', 'the shooter’s shoulder pushes the rifle forward'],
        ['a helicopter’s spinning blades push air downward', 'the air pushes the blades upward', 'the air pushes the blades downward', 'Earth’s gravity pulls the helicopter downward', 'the ground pushes the air upward'],
        ['a bird’s wings push air downward', 'the air pushes the bird’s wings upward', 'Earth’s gravity pulls the bird downward', 'the air pushes the bird’s wings downward', 'the bird’s wings push the air upward'],
        ['a squid squirts a jet of water backward', 'the water jet pushes the squid forward', 'the water jet pushes the squid backward', 'the squid pulls the water forward', 'the sea floor pushes the squid forward'],
        ['a fire hose pushes a stream of water forward', 'the water pushes the hose backward', 'the water pushes the hose forward', 'the firefighter pushes the hose forward', 'the air pushes the water backward'],
        ['a gymnast’s feet push down on a trampoline', 'the trampoline pushes the gymnast’s feet up', 'Earth’s gravity pulls the gymnast down', 'the trampoline pushes the gymnast’s feet down', 'the ground pushes the trampoline up'],
        ['Earth’s gravity pulls the Moon toward Earth', 'the Moon’s gravity pulls Earth toward the Moon', 'the Moon’s gravity pulls Earth away from the Moon', 'the Sun’s gravity pulls the Moon away from Earth', 'Earth’s gravity pushes the Moon away from Earth'],
        ['a tennis racket pushes a tennis ball forward', 'the tennis ball pushes the racket backward', 'the tennis ball pushes the racket forward', 'the player’s arm pushes the racket forward', 'the net pushes the tennis ball backward'],
        ['you pull on a rope tied to a post', 'the rope pulls you toward the post', 'the rope pulls you away from the post', 'the post pulls the rope toward the post', 'you pull the post away from the rope'],
        ['your finger presses down on an elevator button', 'the button pushes up on your finger', 'the button pushes down on your finger', 'the wall pushes on the button', 'your finger pulls up on the button'],
        ['a fan’s blades push air forward', 'the air pushes the fan’s blades backward', 'the air pushes the fan’s blades forward', 'the motor pushes the blades forward', 'the fan pushes the table down'],
        ['a cue stick pushes a pool ball forward', 'the pool ball pushes the cue stick backward', 'the pool ball pushes the cue stick forward', 'the table pushes the pool ball up', 'the player pushes the cue stick forward'],
        ['a jet engine pushes hot gases backward', 'the hot gases push the engine forward', 'the hot gases push the engine backward', 'the air in front pushes the jet backward', 'the wings push the air down'],
        ['a person sitting on a chair pushes down on the seat', 'the seat pushes up on the person', 'Earth’s gravity pulls the person down', 'the seat pushes down on the floor', 'the person pulls Earth up'],
        ['a pitcher’s hand pushes a baseball forward', 'the baseball pushes the pitcher’s hand backward', 'the baseball pushes the pitcher’s hand forward', 'the air pushes the baseball backward', 'the ground pushes the pitcher forward'],
        ['a hockey stick pushes a puck across the ice', 'the puck pushes back on the hockey stick', 'the ice pushes the puck back', 'the puck pushes the hockey stick forward', 'the ice pushes the puck up'],
    ];

    // Contexts for "how big is the reaction?" — each gives the action force F and asks for its partner.
    const SIZES = [
        f => `A hammer hits a nail with a force of ${f} N. How big is the force of the nail on the hammer?`,
        f => `A large truck (8000 kg) crashes into a small car (1000 kg). During the crash the truck pushes on the car with a force of ${f} N. How big is the force of the car on the truck?`,
        f => `A tiny bug hits a car windshield. The windshield pushes on the bug with a force of ${f} N. How big is the force of the bug on the windshield?`,
        f => `A swimmer pushes the water backward with a force of ${f} N. How big is the force of the water on the swimmer?`,
        f => `A rocket engine pushes its exhaust gas downward with a force of ${f} N. How big is the upward force of the gas on the rocket?`,
        f => `You push on a solid brick wall with a force of ${f} N. The wall does not move. How hard does the wall push back on you?`,
        f => `A soccer player kicks a ball with a force of ${f} N. How big is the force of the ball on the player’s foot?`,
        f => `A 70 kg adult and a 35 kg child stand on ice. The adult pushes the child with a force of ${f} N. How big is the force of the child on the adult?`,
        f => `A tow truck pulls a car with a force of ${f} N. How big is the force of the car on the tow truck?`,
        f => `Earth pulls a falling rock downward with a force of ${f} N. How big is the force of the rock on Earth?`,
        f => `A girl jumps off a small boat, pushing it backward with a force of ${f} N. How big is the force of the boat on the girl?`,
        f => `A runner’s shoes push backward on the track with a force of ${f} N. How big is the forward force of the track on the runner?`,
        f => `A cannon pushes a cannonball forward with a force of ${f} N. How big is the backward force of the cannonball on the cannon?`,
        f => `A bowling ball hits a single pin with a force of ${f} N. How big is the force of the pin on the bowling ball?`,
        f => `A magnet pulls on an iron nail with a force of ${f} N. How big is the force of the nail on the magnet?`,
        f => `A helicopter’s blades push air downward with a force of ${f} N. How big is the upward force of the air on the blades?`,
        f => `A book pushes down on a shelf with a force of ${f} N. How big is the force of the shelf on the book?`,
    ];

    // Contexts for "describe the reaction": [first mention, later mention] of the actor and target, verb, allowed directions.
    const HDIR = ['east', 'west', 'north', 'south', 'left', 'right'];
    const DIRS = {
        east: ['to the east', 'west'], west: ['to the west', 'east'], north: ['to the north', 'south'], south: ['to the south', 'north'],
        left: ['to the left', 'right'], right: ['to the right', 'left'], up: ['upward', 'down'], down: ['downward', 'up'],
    };
    const SHORT = { east: 'east', west: 'west', north: 'north', south: 'south', left: 'left', right: 'right', up: 'up', down: 'down' };
    const DIRCTX = [
        [['Maya', 'Maya'], ['a box', 'the box'], 'pushes', HDIR],
        [['Leo', 'Leo'], ['a wagon', 'the wagon'], 'pulls', HDIR],
        [['A tow truck', 'the tow truck'], ['a car', 'the car'], 'pulls', HDIR],
        [['A bulldozer', 'the bulldozer'], ['a pile of dirt', 'the dirt'], 'pushes', HDIR],
        [['Ravi', 'Ravi'], ['a heavy door', 'the door'], 'pushes', HDIR],
        [['A train engine', 'the engine'], ['a freight car', 'the freight car'], 'pulls', HDIR],
        [['A hockey stick', 'the stick'], ['a puck', 'the puck'], 'pushes', HDIR],
        [['Zoe', 'Zoe'], ['a shopping cart', 'the cart'], 'pushes', HDIR],
        [['A tractor', 'the tractor'], ['a plow', 'the plow'], 'pulls', HDIR],
        [['A weightlifter', 'the weightlifter'], ['a barbell', 'the barbell'], 'pushes', ['up']],
        [['A crane cable', 'the cable'], ['a crate', 'the crate'], 'pulls', ['up']],
        [['Earth', 'Earth'], ['a falling rock', 'the rock'], 'pulls', ['down']],
        [['A child', 'the child'], ['a spring', 'the spring'], 'pushes', ['down']],
        [['A helicopter’s rotor', 'the rotor'], ['the air', 'the air'], 'pushes', ['down']],
    ];

    // ── Level 2 banks ────────────────────────────────────────────────────
    // [force 1, force 2, category]  P = action–reaction pair, S = two forces on the same object, N = neither
    const PAIRS = [
        ['Earth pulls a book on a table down.', 'The table pushes the book up.', 'S'],
        ['A book pushes down on a table.', 'The table pushes up on the book.', 'P'],
        ['Earth pulls a book down.', 'The book pulls Earth up.', 'P'],
        ['Earth pulls a book down.', 'The book pushes down on the table under it.', 'N'],
        ['A rope pulls a hanging bucket up.', 'Earth pulls the bucket down.', 'S'],
        ['A rope pulls a hanging bucket up.', 'The bucket pulls the rope down.', 'P'],
        ['A horse pulls a cart forward.', 'The cart pulls the horse backward.', 'P'],
        ['A horse pulls a cart forward.', 'Friction from the road pushes the cart backward.', 'S'],
        ['A horse’s hooves push the ground backward.', 'The ground pushes the horse’s hooves forward.', 'P'],
        ['Your hand pushes on a wall.', 'The wall pushes on your hand.', 'P'],
        ['Ann pushes a box to the east.', 'Friction from the floor pushes the box to the west.', 'S'],
        ['A rocket pushes its exhaust gas down.', 'The exhaust gas pushes the rocket up.', 'P'],
        ['The exhaust gas pushes a rocket up.', 'Earth pulls the rocket down.', 'S'],
        ['Earth pulls the Moon.', 'The Moon pulls Earth.', 'P'],
        ['Earth pulls the Moon.', 'The Sun pulls the Moon.', 'S'],
        ['A magnet pulls a paper clip.', 'The paper clip pulls the magnet.', 'P'],
        ['A magnet held above a paper clip pulls the clip up.', 'Earth pulls the paper clip down.', 'S'],
        ['A swimmer’s hands push the water backward.', 'The water pushes the swimmer’s hands forward.', 'P'],
        ['Earth pulls a floating boat down.', 'The water pushes the boat up.', 'S'],
        ['A floating boat pushes down on the water.', 'The water pushes up on the boat.', 'P'],
        ['A cord pulls a hanging lamp up.', 'Earth pulls the lamp down.', 'S'],
        ['A cord pulls a hanging lamp up.', 'The lamp pulls the cord down.', 'P'],
        ['The ceiling pulls a lamp’s cord up.', 'The cord pulls the lamp up.', 'N'],
        ['A bat pushes a ball forward.', 'The ball pushes the bat backward.', 'P'],
        ['A ball pushes a bat backward.', 'Earth pulls the ball down.', 'N'],
        ['In a tug-of-war, Team A pulls the rope to the left.', 'Team B pulls the rope to the right.', 'S'],
        ['In a tug-of-war, Team A pulls the rope to the left.', 'The rope pulls Team A to the right.', 'P'],
        ['A car’s tires push the road backward.', 'The road pushes the car’s tires forward.', 'P'],
        ['The road pushes a car forward.', 'The air pushes the car backward.', 'S'],
        ['A girl standing on a scale pushes down on the scale.', 'Earth pulls the girl down.', 'N'],
        ['A boy pushes down on the floor.', 'The floor pushes up on the boy.', 'P'],
        ['The floor pushes a standing boy up.', 'Earth pulls the boy down.', 'S'],
        ['A kicker’s foot pushes a ball forward.', 'The ball pushes the kicker’s foot backward.', 'P'],
        ['A hammer pushes a nail down.', 'The wood pushes the nail up.', 'S'],
        ['A hammer pushes a nail down.', 'The nail pushes the hammer up.', 'P'],
        ['The road pushes a car’s tires forward.', 'The car pushes the air forward.', 'N'],
    ];
    const PAIR_CHOICES = {
        P: 'An action–reaction pair',
        C: 'An action–reaction pair, so they cancel each other out',
        S: 'Two forces on the same object, not an action–reaction pair',
        N: 'Forces on two different objects, but not an action–reaction pair',
    };

    // Classic misconceptions: [question, correct, wrong, wrong, wrong]
    const MYTHS = [
        ['A big truck crashes head-on into a small car. During the crash, which statement is true?', 'the truck pushes on the car exactly as hard as the car pushes on the truck', 'the truck pushes harder, because it is heavier', 'the car pushes harder, because it is smaller', 'the truck pushes on the car, but the car does not push on the truck'],
        ['A big truck crashes head-on into a small car. Which one has the bigger acceleration during the crash?', 'the car, because the same size force acts on a smaller mass', 'the truck, because it pushes harder', 'neither: equal forces always give equal accelerations', 'the truck, because it has more mass'],
        ['A bug splats on the windshield of a fast car. Compare the force of the windshield on the bug with the force of the bug on the windshield.', 'they are exactly equal in size', 'the force on the bug is much bigger', 'the force on the windshield is much bigger', 'only the windshield exerts a force'],
        ['A bug splats on a car’s windshield, but the windshield is not damaged. Why?', 'both feel the same size force, but the tiny, fragile bug is affected far more', 'the windshield pushes harder on the bug than the bug pushes on the windshield', 'the bug exerts no force on the windshield', 'the car’s speed cancels the bug’s force'],
        ['A horse pulls a cart. The cart pulls back on the horse just as hard. How can they move forward?', 'the two forces act on different objects, so they do not cancel; the ground pushes the horse forward harder than the cart pulls it back', 'the horse pulls a little harder than the cart pulls back', 'they cannot move: the forces cancel', 'the cart only pulls back when it is standing still'],
        ['A book rests on a table. What is the reaction force to Earth’s gravity pulling the book down?', 'the book’s gravity pulling Earth up', 'the table pushing the book up', 'the book pushing down on the table', 'there is none, because the book is not moving'],
        ['Why don’t the two forces of an action–reaction pair cancel each other out?', 'they act on two different objects', 'they are not quite equal in size', 'they point in the same direction', 'they are different types of force'],
        ['You push hard on a brick wall and it does not move. Which statement is true?', 'the wall pushes back on you just as hard as you push on it', 'the wall does not push on you, because it is not moving', 'the wall pushes back on you less than you push on it', 'the wall pushes back on you harder than you push on it'],
        ['How can a rocket speed up in empty space, where there is no air?', 'it pushes exhaust gas backward, and the gas pushes the rocket forward', 'it cannot: it needs air to push against', 'its exhaust pushes on the air behind it', 'the Sun’s gravity pulls it forward'],
        ['A heavy adult and a light child stand on smooth ice and push each other apart. Which statement is true?', 'both feel the same size force, but the child gets the bigger acceleration', 'the adult pushes harder, so only the child moves', 'the child feels the bigger force, so the child moves faster', 'both get the same acceleration, because the forces are equal'],
        ['When you jump, you push down on Earth. Why doesn’t Earth move noticeably?', 'Earth’s mass is so huge that the same size force gives it a tiny acceleration', 'you do not push on Earth at all', 'your push on Earth is much smaller than Earth’s push on you', 'Earth’s gravity cancels your push'],
        ['A ping-pong ball hits a heavy bowling ball. During the hit, which ball pushes harder on the other?', 'neither: the forces are equal in size', 'the bowling ball pushes harder', 'the ping-pong ball pushes harder', 'only the bowling ball pushes'],
        ['When you walk, which force actually pushes you forward?', 'the ground pushing forward on your feet', 'your feet pushing backward on the ground', 'your leg muscles pushing your body forward', 'your inertia carrying you forward'],
        ['Why is it hard to start walking on very slippery ice?', 'your feet cannot push backward on the ice very hard, so the ice cannot push you forward very hard', 'the ice pushes you forward too hard', 'Newton’s third law does not work on ice', 'there is no gravity on ice'],
        ['A cannon fires a cannonball. Why does the ball fly off much faster than the cannon recoils?', 'they feel the same size force, but the ball has much less mass, so it accelerates much more', 'the cannon pushes on the ball harder than the ball pushes on the cannon', 'the ball does not push back on the cannon', 'the cannon is held still by gravity, so it feels no force'],
        ['Why can’t you lift yourself off the floor by pulling up on your own belt?', 'your hands pull the belt up and the belt pulls your hands down: both forces act on you, so they add up to zero', 'your belt is not strong enough', 'the belt does not pull back on your hands', 'your arms are not strong enough to beat gravity'],
        ['Which statement about an action–reaction pair is FALSE?', 'the two forces act on the same object', 'the two forces are equal in size', 'the two forces point in opposite directions', 'the two forces are the same type of force'],
        ['The action force is Earth’s gravity pulling on you. What type of force is the reaction?', 'also a gravity pull (you pulling on Earth)', 'a push from the ground', 'a friction force', 'a magnetic force'],
        ['The action force is friction from your shoe on the floor. What type of force is the reaction?', 'friction from the floor on your shoe', 'gravity pulling your shoe down', 'the floor pushing straight up on your shoe', 'air resistance on your shoe'],
        ['A helicopter hovers in the air. What holds it up?', 'its blades push air down, so the air pushes the blades up', 'the air under it is lighter than the helicopter', 'Earth’s gravity pushes it up', 'nothing: hovering needs no force'],
        ['Ava and Ben sit on rolling chairs facing each other. Ava pushes Ben’s shoulders; Ben keeps his arms still. What happens?', 'both chairs roll apart, because Ben pushes back on Ava as hard as she pushes him', 'only Ben rolls, because only Ava pushed', 'only Ava rolls, because she did the pushing', 'neither rolls, because the forces cancel'],
        ['When does the reaction force start?', 'at exactly the same moment as the action force', 'a moment after the action force', 'only once the objects start moving', 'only if the second object is heavier'],
        ['A rifle recoils (kicks back) when it fires. Why?', 'the rifle pushes the bullet forward, so the bullet pushes the rifle backward', 'the air in front of the bullet pushes the rifle back', 'the shooter pulls the rifle back', 'the bullet’s weight pulls the rifle back'],
        ['A swimmer pushes off the wall of a pool. What pushes the swimmer away from the wall?', 'the wall pushing on the swimmer’s feet', 'the swimmer’s legs pushing on the swimmer', 'the water flowing away from the wall', 'the swimmer’s feet pushing on the wall'],
        ['A blown-up balloon is let go and zooms across the room. What pushes it forward?', 'the air rushing out of the back pushes the balloon forward', 'the still air in the room pushes on the back of the balloon', 'the stretchy rubber pulls the balloon forward', 'gravity pulls the balloon forward'],
        ['Two people push each other apart on ice. Which pair of words describes the two forces?', 'equal in size, opposite in direction', 'equal in size, same direction', 'different in size, opposite in direction', 'different in size, same direction'],
        ['A moving bowling ball knocks over a light pin. During the hit, how does the force on the pin compare with the force on the ball?', 'they are equal in size and opposite in direction', 'the force on the pin is bigger, because the pin falls over', 'the force on the ball is bigger, because it is heavier', 'the ball pushes the pin, but the pin does not push the ball'],
    ];

    // Things that fall or sit on Earth (name, mass in kg)
    const EARTHLY = [['an apple', 0.2], ['a soccer ball', 0.4], ['a cat', 4], ['a bowling ball', 6], ['a dog', 20], ['a student', 45], ['a teacher', 70], ['a skydiver', 80], ['a bag of rice', 10], ['a watermelon', 5], ['a backpack', 3], ['a tennis ball', 0.06]];

    // ── Level 3 banks ────────────────────────────────────────────────────
    // Scenes with forces; partner[i] = index of i's third-law partner (or -1 if it is not in the list).
    const SCENES = [
        ['A book rests on a table.', ['Earth pulls the book down', 'the table pushes the book up', 'the book pushes the table down', 'the book pulls Earth up'], [3, 2, 1, 0]],
        ['A lamp hangs from a cord.', ['Earth pulls the lamp down', 'the cord pulls the lamp up', 'the lamp pulls the cord down', 'the lamp pulls Earth up'], [3, 2, 1, 0]],
        ['A horse pulls a cart along a road.', ['the horse pulls the cart forward', 'the ground pushes the horse’s hooves forward', 'the cart pulls the horse backward', 'the hooves push the ground backward'], [2, 3, 0, 1]],
        ['A man walks, pushing a stroller.', ['the stroller pushes the man’s hands backward', 'the man’s hands push the stroller forward', 'the ground pushes the man’s feet forward', 'the man’s feet push the ground backward'], [1, 0, 3, 2]],
        ['A rocket lifts off from the launch pad.', ['the rocket pushes its exhaust gas down', 'Earth pulls the rocket down', 'the exhaust gas pushes the rocket up', 'the rocket pulls Earth up'], [2, 3, 0, 1]],
        ['A swimmer swims across a pool.', ['the swimmer’s hands push the water backward', 'Earth pulls the swimmer down', 'the water pushes the swimmer’s hands forward', 'the water pushes the swimmer up', 'the swimmer pulls Earth up'], [2, 4, 0, -1, 1]],
        ['An apple hangs from a branch.', ['the stem pulls the apple up', 'Earth pulls the apple down', 'the apple pulls the stem down', 'the apple pulls Earth up'], [2, 3, 0, 1]],
        ['A car speeds up along a road.', ['the tires push the road backward', 'the air pushes the car backward', 'the road pushes the tires forward', 'the car pushes the air forward'], [2, 3, 0, 1]],
        ['A boat floats on a lake.', ['Earth pulls the boat down', 'the water pushes the boat up', 'the boat pushes the water down', 'the boat pulls Earth up'], [3, 2, 1, 0]],
        ['A girl stands on a bathroom scale.', ['the scale pushes the girl up', 'Earth pulls the girl down', 'the girl pulls Earth up', 'the girl pushes the scale down'], [3, 2, 1, 0]],
        ['A kicker’s foot hits a soccer ball lying on the grass.', ['the foot pushes the ball forward', 'the grass pushes the ball up', 'the ball pushes the foot backward', 'the ball pushes the grass down', 'Earth pulls the ball down'], [2, 3, 0, 1, -1]],
        ['A magnet holds a paper clip up off the table (the clip does not touch the table).', ['the magnet pulls the clip up', 'Earth pulls the clip down', 'the clip pulls the magnet down', 'the clip pulls Earth up'], [2, 3, 0, 1]],
    ];
    const ROMAN = ['1', '2', '3', '4', '5'];

    // Tug-of-war ideas: [question, correct, wrong, wrong, wrong]
    const TUG = [
        ['In a tug-of-war with a light rope, the Red team wins. Why?', 'Red’s feet push on the ground harder, so the ground pushes Red (away from the middle) harder than it pushes Blue', 'Red pulls on the rope harder than the rope pulls on Red', 'the rope pulls on Blue with more force than it pulls on Red', 'Red’s pull on the rope does not have a reaction force'],
        ['A tug-of-war is played on a slippery floor in socks. One team wears grippy shoes instead. What is most likely?', 'the team with grippy shoes wins, because the floor can push them back with more friction', 'neither team can win, because action and reaction are equal', 'the team in socks wins, because they slide more easily', 'the rope pulls harder on the team with shoes'],
        ['In a tug-of-war with a light rope, nobody is moving. Which forces on the Blue team are balanced?', 'the rope pulling Blue toward the middle and the ground pushing Blue’s feet away from the middle', 'Blue pulling the rope and the rope pulling Blue', 'Blue pulling the rope and Red pulling the rope', 'the rope pulling Blue and the rope pulling Red'],
        ['A light rope is tied to a tree. Sam pulls the rope with all his strength. How hard does the rope pull Sam?', 'just as hard as Sam pulls the rope', 'not at all, because the tree does not pull', 'twice as hard as Sam pulls, because the tree pulls too', 'less hard than Sam pulls, because the tree is fixed'],
        ['Two teams in a tug-of-war each pull the rope as hard as they can, and Team A starts winning. Which statement is TRUE?', 'the rope still pulls Team A as hard as Team A pulls the rope', 'Team A now pulls the rope harder than the rope pulls Team A', 'the action–reaction pairs no longer have equal forces', 'the rope pulls Team B harder than Team B pulls the rope'],
    ];

    CA.register({
        id: 'newtons-third-law',
        title: 'Newton’s Third Law',
        page: 'newtons-third-law.html',
        subject: 'Physics',
        assignmentNote: 'For multiple-choice questions, circle the best answer. For calculations, show your working and give the unit. Ignore friction and air resistance unless a problem says otherwise, and use g = 10 N/kg (Earth pulls each kilogram with 10 N).',

        practice: [
            // ─────────────── Level 1 ───────────────
            {
                id: 'name-reaction', name: 'Name the reaction force', level: 1,
                gen(rng) {
                    const it = rng.pick(REACTIONS);
                    return {
                        q: `Action force: ${it[0]}. Which force is the reaction force?`,
                        ans: mcBank(rng, it),
                        sol: `The reaction swaps the two objects and flips the direction: ${it[1]}. It is the same size as the action and acts on the other object.`,
                    };
                },
            },
            {
                id: 'reaction-size', name: 'How big is the reaction?', level: 1,
                gen(rng) {
                    const t = rng.pick(SIZES), f = rng.pick([2, 5, 8, 12, 15, 20, 25, 40, 50, 60, 75, 90, 120, 150, 200, 250, 300, 450, 500, 600, 800, 1200, 1500, 2500, 5000]);
                    return {
                        q: t(f),
                        ans: CA.num(f, 'N'),
                        sol: `Action and reaction are always equal in size, no matter how big, heavy or fast the objects are. The reaction is ${f} N, in the opposite direction.`,
                    };
                },
            },
            {
                id: 'reaction-direction', name: 'Size, direction and object of the reaction', level: 1,
                gen(rng) {
                    const [A, B, verb, dirs] = rng.pick(DIRCTX), d = rng.pick(dirs), f = rng.pick([10, 20, 30, 40, 50, 60, 80, 100, 120, 150, 200, 300, 400, 500]);
                    const opp = DIRS[d][1];
                    const back = verb === 'pushes' ? 'pushes' : 'pulls';
                    const correct = `${f} N ${SHORT[opp]}, exerted by ${B[1]} on ${A[1]}`;
                    const wrong = [
                        `${f} N ${SHORT[d]}, exerted by ${B[1]} on ${A[1]}`,
                        `${f} N ${SHORT[opp]}, exerted by ${A[1]} on ${B[1]}`,
                        `${rng.bool() ? f / 2 : 2 * f} N ${SHORT[opp]}, exerted by ${B[1]} on ${A[1]}`,
                    ];
                    return {
                        q: `${A[0]} ${verb} ${B[0]} with a force of ${f} N ${DIRS[d][0]}. Which describes the reaction force?`,
                        ans: CA.mc(rng, cap(correct), wrong.map(cap)),
                        sol: `Swap the objects and flip the direction: ${B[1]} ${back} ${A[1]} with ${f} N ${SHORT[opp]}. Same size, opposite direction, on the other object.`,
                    };
                },
            },

            // ─────────────── Level 2 ───────────────
            {
                id: 'pair-or-balanced', name: 'Action–reaction pair or balanced forces?', level: 2,
                gen(rng) {
                    const [a, b, cat] = rng.pick(PAIRS);
                    const choices = [PAIR_CHOICES.P, PAIR_CHOICES.C, PAIR_CHOICES.S, PAIR_CHOICES.N];
                    const why = cat === 'P' ? 'The two forces are the same interaction seen from each side: the objects swap places and the direction flips. They act on different objects, so they never cancel.'
                        : cat === 'S' ? 'Both forces act on the same object, so they are not a third-law pair (a third-law pair always acts on two different objects). Forces on one object can balance.'
                            : 'The forces act on different objects, but they come from different interactions, so they are not partners of each other.';
                    return {
                        q: `Force 1: ${a}<br>Force 2: ${b}<br>What are these two forces?`,
                        ans: CA.mc(rng, PAIR_CHOICES[cat], choices, { keepOrder: true }),
                        sol: why,
                    };
                },
            },
            {
                id: 'misconceptions', name: 'Third-law traps', level: 2,
                gen(rng) {
                    const it = rng.pick(MYTHS);
                    return { q: it[0], ans: mcBank(rng, it), sol: `${cap(it[1])}. Action and reaction are always equal in size, opposite in direction and act on different objects; the effect depends on each object’s mass (a = F/m).` };
                },
            },
            {
                id: 'push-apart', name: 'Pushing apart: a = F/m for each object', level: 2,
                gen(rng) {
                    const ctx = rng.pick([
                        { a: 'Ana', b: 'Ben', where: 'stand at rest on smooth ice', lo: 30, hi: 90, step: 5, unitA: 'skater' },
                        { a: 'Kai', b: 'Mia', where: 'float at rest in a space station', lo: 50, hi: 120, step: 5, unitA: 'astronaut' },
                        { a: 'Omar', b: 'Lily', where: 'sit on wheeled office chairs on a smooth floor', lo: 30, hi: 80, step: 5, unitA: 'student' },
                        { a: 'Jo', b: 'Sam', where: 'stand on skateboards', lo: 35, hi: 80, step: 5, unitA: 'skater' },
                    ]);
                    for (;;) {
                        const mA = ctx.lo + ctx.step * rng.int(0, (ctx.hi - ctx.lo) / ctx.step), mB = ctx.lo + ctx.step * rng.int(0, (ctx.hi - ctx.lo) / ctx.step);
                        if (mA === mB) continue;
                        const kind = rng.int(0, 2);
                        const intro = `${ctx.a} (${mA} kg) and ${ctx.b} (${mB} kg) ${ctx.where}.`;
                        if (kind === 0) {
                            // ctx.a pushes ctx.b with force f; ask for either acceleration
                            const askA = rng.bool(0.6), m = askA ? mA : mB, acc = rng.pick([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4]), f = acc * m;
                            if (!Number.isInteger(f) || f > 300) continue;
                            return {
                                q: `${intro} ${ctx.a} pushes ${ctx.b} with a force of ${f} N. What is the size of ${askA ? ctx.a : ctx.b}’s acceleration?`,
                                fig: pairFig({ name: ctx.a, sub: `${mA} kg`, m: mA }, { name: ctx.b, sub: `${mB} kg`, m: mB }, `${f} N`, `${f} N`, { space: ctx.unitA === 'astronaut' }),
                                ans: CA.num(acc, 'm/s²'),
                                sol: askA ? R`${ctx.b} pushes back on ${ctx.a} with the same ${f} N. \(a = \dfrac{F}{m} = \dfrac{${f}}{${mA}} = ${fmt(acc)}\) m/s².`
                                    : R`\(a = \dfrac{F}{m} = \dfrac{${f}}{${mB}} = ${fmt(acc)}\) m/s².`,
                            };
                        }
                        if (kind === 1) {
                            const aA = rng.pick([0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.4, 3]), f = aA * mA, aB = f / mB;
                            if (!nice(f, 0) || !nice(aB, 2) || f > 300) continue;
                            return {
                                q: `${intro} They push each other apart. ${ctx.a}’s acceleration is ${fmt(aA)} m/s². What is ${ctx.b}’s acceleration?`,
                                fig: pairFig({ name: ctx.a, sub: `${mA} kg`, m: mA }, { name: ctx.b, sub: `${mB} kg`, m: mB }, 'F', 'F', { space: ctx.unitA === 'astronaut' }),
                                ans: CA.num(CA.round(aB, 4), 'm/s²'),
                                sol: R`The force on ${ctx.a}: \(F = ma = ${mA}\times ${fmt(aA)} = ${fmt(f)}\) N. ${ctx.b} feels the same ${fmt(f)} N, so \(a = \dfrac{${fmt(f)}}{${mB}} = ${fmt(aB)}\) m/s².`,
                            };
                        }
                        const aB = rng.pick([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4]), f = aB * mB;
                        if (!Number.isInteger(f) || f > 300) continue;
                        return {
                            q: `${ctx.a} and ${ctx.b} ${ctx.where}. ${ctx.a} (${mA} kg) pushes ${ctx.b} with a force of ${f} N, and ${ctx.b} accelerates at ${fmt(aB)} m/s². What is ${ctx.b}’s mass?`,
                            fig: pairFig({ name: ctx.a, sub: `${mA} kg`, m: mA }, { name: ctx.b, sub: '? kg', m: mB }, `${f} N`, `${f} N`, { space: ctx.unitA === 'astronaut' }),
                            ans: CA.num(mB, 'kg'),
                            sol: R`\(m = \dfrac{F}{a} = \dfrac{${f}}{${fmt(aB)}} = ${mB}\) kg.`,
                        };
                    }
                },
            },
            {
                id: 'recoil', name: 'Recoil: cannons, boats and throws', level: 2,
                gen(rng) {
                    const ctx = rng.pick([
                        { big: 'cannon', small: 'cannonball', M: [200, 250, 300, 400, 500, 600, 800, 1000], m: [2, 4, 5, 8, 10], act: 'fires a', fw: 'forward', bw: 'backward', A: [0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2, 2.5], as: [100, 150, 200, 250, 400, 500, 800, 1000] },
                        { big: 'boat', small: 'boy', M: [80, 100, 120, 150, 160, 200], m: [40, 45, 50, 60], act: 'has a', fw: 'forward onto the dock', bw: 'backward', jump: true, A: [0.5, 0.8, 1, 1.2, 1.5, 2], as: [2, 3, 4, 5, 6] },
                        { big: 'skateboarder', small: 'medicine ball', M: [40, 45, 50, 60, 64, 75, 80], m: [2, 3, 4, 5, 6], act: 'throws a', fw: 'forward', bw: 'backward', thrower: true, A: [0.2, 0.25, 0.4, 0.5, 0.6, 0.8, 1], as: [10, 12, 15, 20, 24, 25, 30, 40] },
                        { big: 'astronaut', small: 'toolbox', M: [80, 90, 100, 120], m: [2, 4, 5, 8, 10], act: 'throws a', fw: 'away', bw: 'the other way', thrower: true, A: [0.1, 0.2, 0.25, 0.4, 0.5], as: [5, 8, 10, 12, 15, 20] },
                        { big: 'toy cannon', small: 'rubber ball', M: [2, 3, 4, 5], m: [0.1, 0.2, 0.25, 0.5], act: 'fires a', fw: 'forward', bw: 'backward', A: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5], as: [20, 30, 40, 50, 60, 80, 100] },
                    ]);
                    for (;;) {
                        const M = rng.pick(ctx.M), m = rng.pick(ctx.m), kind = rng.int(0, 2);
                        const desc = ctx.jump ? `A ${m} kg boy jumps ${ctx.fw} from a ${M} kg boat that was at rest.`
                            : ctx.thrower ? `A ${M} kg ${ctx.big} at rest ${ctx.act} ${m} kg ${ctx.small} ${ctx.fw}.`
                                : `A ${M} kg ${ctx.big} on smooth wheels ${ctx.act} ${m} kg ${ctx.small} ${ctx.fw}.`;
                        const fig = f => pairFig({ name: ctx.big, sub: `${M} kg`, m: M }, { name: ctx.small, sub: `${m} kg`, m }, f, f, { space: ctx.big === 'astronaut' });
                        if (kind === 0) {
                            const A = rng.pick(ctx.A), f = A * M;
                            if (!nice(f, 0)) continue;
                            return {
                                q: `${desc} During the ${ctx.jump ? 'jump' : ctx.thrower ? 'throw' : 'shot'}, the ${ctx.small} is pushed with a force of ${fmt(f)} N. What is the acceleration of the ${ctx.big}?`,
                                fig: fig(`${fmt(f)} N`),
                                ans: CA.num(A, 'm/s²'),
                                sol: R`The ${ctx.small} pushes back on the ${ctx.big} with the same ${fmt(f)} N, ${ctx.bw}. \(a = \dfrac{F}{m} = \dfrac{${fmt(f)}}{${M}} = ${fmt(A)}\) m/s².`,
                            };
                        }
                        if (kind === 1) {
                            const a = rng.pick(ctx.as), f = m * a, A = f / M;
                            if (!nice(f, 2) || !nice(A, 2) || A < 0.05) continue;
                            return {
                                q: `${desc} During the ${ctx.jump ? 'jump' : ctx.thrower ? 'throw' : 'shot'}, the ${ctx.small} accelerates at ${a} m/s². What is the acceleration of the ${ctx.big}?`,
                                fig: fig('F'),
                                ans: CA.num(CA.round(A, 4), 'm/s²'),
                                sol: R`Force on the ${ctx.small}: \(F = ma = ${fmt(m)}\times ${a} = ${fmt(f)}\) N. The ${ctx.big} feels the same force, so \(a = \dfrac{${fmt(f)}}{${M}} = ${fmt(A)}\) m/s².`,
                            };
                        }
                        const A = rng.pick(ctx.A), f = CA.round(A * M, 6);
                        if (!nice(f, 2)) continue;
                        return {
                            q: `${desc} During the ${ctx.jump ? 'jump' : ctx.thrower ? 'throw' : 'shot'}, the ${ctx.big} accelerates ${ctx.bw} at ${fmt(A)} m/s². How big is the force on the ${ctx.small}?`,
                            fig: fig('F'),
                            ans: CA.num(f, 'N'),
                            sol: R`Force on the ${ctx.big}: \(F = ma = ${M}\times ${fmt(A)} = ${fmt(f)}\) N. By the third law the ${ctx.small} feels the same ${fmt(f)} N (in the opposite direction).`,
                        };
                    }
                },
            },
            {
                id: 'which-more', name: 'Same force, different masses', level: 2,
                gen(rng) {
                    const ctx = rng.pick([
                        ['a truck', 'a car', 'crash into each other', [[6000, 1500], [8000, 1000], [9000, 1500], [6000, 1200], [10000, 2000], [4500, 1500]]],
                        ['an adult', 'a child', 'push each other apart on ice', [[80, 40], [90, 30], [75, 25], [72, 36], [84, 28], [100, 50]]],
                        ['a bowling ball', 'a tennis ball', 'collide', [[6, 0.06], [7.2, 0.06], [4.8, 0.06], [3, 0.06]]],
                        ['a cannon', 'a cannonball', 'push on each other as the cannon fires', [[400, 5], [600, 4], [500, 10], [900, 6], [800, 8]]],
                        ['a rowing boat', 'a girl', 'push on each other as she jumps off the boat', [[150, 50], [120, 40], [180, 45], [200, 40]]],
                        ['a loaded cart', 'an empty cart', 'are pushed apart by a spring', [[6, 2], [9, 3], [8, 2], [10, 2], [12, 4], [15, 3]]],
                    ]);
                    const [big0, small0, how, list] = ctx, [M, m] = rng.pick(list);
                    const big = the(big0), small = the(small0);
                    const ratio = CA.round(M / m, 6);
                    const askForce = rng.bool(0.25);
                    if (askForce) return {
                        q: `${cap(big0)} (${M} kg) and ${small0} (${m} kg) ${how}. How many times bigger is the force on ${small} than the force on ${big}?`,
                        ans: CA.num(1),
                        sol: `Trick question! The forces are an action–reaction pair, so they are equal: the force on ${small} is 1 times the force on ${big}. Only the accelerations differ.`,
                    };
                    return {
                        q: `${cap(big0)} (${M} kg) and ${small0} (${m} kg) ${how}. How many times bigger is the acceleration of ${small} than the acceleration of ${big}?`,
                        ans: CA.num(ratio),
                        sol: R`Both feel the same force \(F\). \(a = \dfrac{F}{m}\), so the accelerations are in the inverse ratio of the masses: \(\dfrac{${M}}{${m}} = ${fmt(ratio)}\).`,
                    };
                },
            },
            {
                id: 'earth-and-you', name: 'You and the Earth', level: 2,
                gen(rng) {
                    const [obj, m] = rng.pick(EARTHLY), W = CA.round(10 * m, 4), kind = rng.int(0, 2);
                    if (kind === 0) return {
                        q: `Earth pulls ${obj} (${m} kg) downward with a force of ${fmt(W)} N. Which describes the force of ${the(obj)} on Earth?`,
                        ans: CA.mc(rng, `${fmt(W)} N upward`, [`${fmt(W)} N downward`, '0 N: small things do not pull on Earth', `Much less than ${fmt(W)} N, upward`]),
                        sol: `Gravity is an action–reaction pair: ${the(obj)} pulls Earth upward with the same ${fmt(W)} N.`,
                    };
                    if (kind === 1) return {
                        q: `${cap(obj)} has a mass of ${m} kg. How big is the gravity force with which it pulls on Earth? (Use g = 10 N/kg.)`,
                        ans: CA.num(W, 'N'),
                        sol: R`Earth pulls on it with \(W = mg = ${m}\times 10 = ${fmt(W)}\) N, so by the third law ${the(obj)} pulls on Earth with ${fmt(W)} N (upward).`,
                    };
                    if (/student|teacher|cat|dog|skydiver/.test(obj)) return this.gen(rng);     // things that can be dropped
                    return {
                        q: `${cap(obj)} (${m} kg) is dropped and falls toward the ground. Earth pulls it with ${fmt(W)} N and it pulls Earth with ${fmt(W)} N. Which statement is true?`,
                        ans: CA.mc(rng, `${cap(the(obj))} accelerates much more, because Earth’s mass is huge`, ['Earth accelerates more, because it is bigger', 'They have the same acceleration, because the forces are equal', 'Neither accelerates, because the forces cancel']),
                        sol: R`Same force, but \(a = F/m\): ${the(obj)} has a tiny mass compared with Earth, so it gets a big acceleration (10 m/s²) and Earth gets an unnoticeably tiny one.`,
                    };
                },
            },

            // ─────────────── Level 3 ───────────────
            {
                id: 'carts-speeds', name: 'Spring between two carts: speeds after the push', level: 3,
                gen(rng) {
                    for (;;) {
                        const mA = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), mB = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), f = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]), t = rng.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
                        if (mA === mB) continue;
                        const aA = f / mA, aB = f / mB, vA = aA * t, vB = aB * t, kind = rng.int(0, 2);
                        const intro = `Two carts, A (${fmt(mA)} kg) and B (${fmt(mB)} kg), sit at rest on a smooth track with a compressed spring between them. When released, the spring pushes each cart with a force of ${f} N for ${fmt(t)} s.`;
                        const fig = pairFig({ name: 'A', sub: `${fmt(mA)} kg`, m: mA }, { name: 'B', sub: `${fmt(mB)} kg`, m: mB }, `${f} N`, `${f} N`, { wheels: true, spring: true });
                        if (kind === 0) {
                            const askA = rng.bool(), v = askA ? vA : vB, a = askA ? aA : aB, m = askA ? mA : mB;
                            if (!nice(v, 2) || !nice(a, 2)) continue;
                            return {
                                q: `${intro} How fast is cart ${askA ? 'A' : 'B'} moving when the push ends?`, fig,
                                ans: CA.num(CA.round(v, 4), 'm/s'),
                                sol: R`\(a = \dfrac{${f}}{${fmt(m)}} = ${fmt(a)}\) m/s², so \(v = at = ${fmt(a)}\times ${fmt(t)} = ${fmt(v)}\) m/s.`,
                            };
                        }
                        if (kind === 1) {
                            if (!nice(vA, 2) || !nice(vB, 2) || !nice(aA, 2) || !nice(aB, 2)) continue;
                            return {
                                q: `${intro} When the push ends, how fast are the carts moving apart (the sum of their speeds)?`, fig,
                                ans: CA.num(CA.round(vA + vB, 4), 'm/s'),
                                sol: R`\(a_A = ${fmt(aA)}\), \(a_B = ${fmt(aB)}\) m/s². After ${fmt(t)} s: \(v_A = ${fmt(vA)}\), \(v_B = ${fmt(vB)}\) m/s in opposite directions, so they separate at \(${fmt(vA)} + ${fmt(vB)} = ${fmt(vA + vB)}\) m/s.`,
                            };
                        }
                        // given A's final speed, find B's (same force for the same time)
                        if (!nice(vA, 2) || !nice(vB, 2)) continue;
                        return {
                            q: `Two carts, A (${fmt(mA)} kg) and B (${fmt(mB)} kg), sit at rest on a smooth track with a compressed spring between them. The spring is released and pushes them apart. Afterwards cart A moves at ${fmt(vA)} m/s. How fast does cart B move?`,
                            fig: pairFig({ name: 'A', sub: `${fmt(mA)} kg`, m: mA }, { name: 'B', sub: `${fmt(mB)} kg`, m: mB }, 'F', 'F', { wheels: true, spring: true }),
                            ans: CA.num(CA.round(vB, 4), 'm/s'),
                            sol: R`The spring pushes both carts with the same force for the same time, so \(m_A v_A = m_B v_B\) (since \(F = ma = m\,v/t\)). \(v_B = \dfrac{${fmt(mA)}\times ${fmt(vA)}}{${fmt(mB)}} = ${fmt(vB)}\) m/s.`,
                        };
                    }
                },
            },
            {
                id: 'rocket', name: 'Rockets: thrust from the exhaust', level: 3,
                gen(rng) {
                    for (;;) {
                        const kind = rng.int(0, 3);
                        if (kind === 0) {
                            // in deep space: v = F t / M
                            const M = rng.pick([200, 400, 500, 800, 1000, 1200, 2000, 2500]), a = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), t = rng.pick([4, 5, 6, 8, 10, 12, 20, 30]), f = M * a;
                            if (!Number.isInteger(f)) continue;
                            return {
                                q: `A ${M} kg space probe floats at rest in deep space, far from any planet. Its engine pushes exhaust gas backward with a force of ${f} N for ${t} s. How fast is the probe moving at the end? (Ignore the small mass of gas used.)`,
                                ans: CA.num(CA.round(a * t, 4), 'm/s'),
                                sol: R`The gas pushes the probe forward with ${f} N (reaction). \(a = \dfrac{${f}}{${M}} = ${fmt(a)}\) m/s², so \(v = at = ${fmt(a)}\times ${t} = ${fmt(a * t)}\) m/s.`,
                            };
                        }
                        const model = rng.bool(0.5);
                        const M = model ? rng.pick([0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2]) : rng.pick([500, 800, 1000, 1200, 1500, 2000, 3000]);
                        const a = rng.pick([2, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30]), Wt = CA.round(10 * M, 6), f = CA.round(M * (a + 10), 6);
                        if (!nice(f, 2) || !nice(Wt, 2)) continue;
                        const what = model ? `model rocket` : `rocket`;
                        if (kind === 1) return {
                            q: `A ${fmt(M)} kg ${what} sits on the launch pad. Its engine pushes exhaust gas downward with a force of ${fmt(f)} N. What is the rocket’s acceleration as it lifts off? (g = 10 N/kg; ignore air resistance.)`,
                            fig: rocketFig(['gas on rocket', `${fmt(f)} N`], 'weight'),
                            ans: CA.num(a, 'm/s²'),
                            sol: R`The gas pushes the rocket up with ${fmt(f)} N. Weight \(= ${fmt(M)}\times 10 = ${fmt(Wt)}\) N. Net force \(= ${fmt(f)} - ${fmt(Wt)} = ${fmt(f - Wt)}\) N up, so \(a = \dfrac{${fmt(f - Wt)}}{${fmt(M)}} = ${a}\) m/s².`,
                        };
                        if (kind === 2) return {
                            q: `A ${fmt(M)} kg ${what} must lift off with an upward acceleration of ${a} m/s². How hard must its engine push the exhaust gas downward? (g = 10 N/kg; ignore air resistance.)`,
                            fig: rocketFig(['gas on rocket', '? N'], 'weight'),
                            ans: CA.num(f, 'N'),
                            sol: R`Net force needed \(= ma = ${fmt(M)}\times ${a} = ${fmt(M * a)}\) N. Weight \(= ${fmt(Wt)}\) N. The gas must push up with \(${fmt(M * a)} + ${fmt(Wt)} = ${fmt(f)}\) N, so the engine pushes the gas down with ${fmt(f)} N.`,
                        };
                        const t = rng.pick([2, 3, 4, 5]);
                        return {
                            q: `A ${fmt(M)} kg ${what} starts from rest. The exhaust gas pushes it upward with a force of ${fmt(f)} N. How fast is it moving after ${t} s? (g = 10 N/kg; ignore air resistance and the mass of fuel used.)`,
                            fig: rocketFig(['gas on rocket', `${fmt(f)} N`], 'weight'),
                            ans: CA.num(a * t, 'm/s'),
                            sol: R`Net force \(= ${fmt(f)} - ${fmt(Wt)} = ${fmt(f - Wt)}\) N, so \(a = \dfrac{${fmt(f - Wt)}}{${fmt(M)}} = ${a}\) m/s². Then \(v = at = ${a}\times ${t} = ${a * t}\) m/s.`,
                        };
                    }
                },
            },
            {
                id: 'tug-of-war', name: 'Tug-of-war: friction from the ground', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    if (kind === 0) {
                        const it = rng.pick(TUG);
                        return { q: it[0], ans: mcBank(rng, it), sol: `${cap(it[1])}. The rope pulls each team with the same force; what decides the winner is how hard the ground pushes each team’s feet.` };
                    }
                    if (kind === 1) {
                        const f = rng.pick([20, 30, 40, 50, 60, 80, 100, 150]);
                        return {
                            q: `Two students hold the two ends of a spring scale and pull in opposite directions, each with ${f} N. Nothing moves. What does the scale read?`,
                            ans: CA.mc(rng, `${f} N`, [`${2 * f} N`, '0 N', `${f / 2} N`]),
                            sol: `A scale reads the pull on its hook, which is ${f} N. The other student’s ${f} N just holds the scale still (like tying it to a wall); the forces do not add.`,
                        };
                    }
                    for (;;) {
                        const mA = rng.pick([150, 180, 200, 240, 250, 300]), mB = rng.pick([150, 180, 200, 240, 250, 300]);
                        const fA = rng.pick([1500, 1600, 1800, 2000, 2200, 2400]), fB = rng.pick([1200, 1400, 1500, 1600, 1800, 2000]);
                        if (fA <= fB) continue;
                        const a = (fA - fB) / (mA + mB);
                        if (!nice(a, 2)) continue;
                        const intro = `In a tug-of-war, the ground pushes Team A’s feet with a friction force of ${fA} N and Team B’s feet with ${fB} N (each away from the middle). Team A has mass ${mA} kg and Team B ${mB} kg; the rope is light.`;
                        if (kind === 2) return {
                            q: `${intro} What is the acceleration of the two teams (toward Team A’s side)?`,
                            ans: CA.num(CA.round(a, 4), 'm/s²'),
                            sol: R`Treat both teams and the rope as one object: the rope forces are inside it and cancel. Net force \(= ${fA} - ${fB} = ${fA - fB}\) N on \(${mA} + ${mB} = ${mA + mB}\) kg, so \(a = ${fmt(a)}\) m/s².`,
                        };
                        const T = fB + mB * a;
                        if (!nice(T, 1)) continue;
                        return {
                            q: `${intro} The teams accelerate toward Team A at ${fmt(a)} m/s². What is the force of the rope on Team B?`,
                            ans: CA.num(CA.round(T, 4), 'N'),
                            sol: R`On Team B: rope pulls toward A with \(T\), ground pushes back with ${fB} N. \(T - ${fB} = ${mB}\times ${fmt(a)}\), so \(T = ${fmt(T)}\) N. (The rope pulls Team A back with the same ${fmt(T)} N.)`,
                        };
                    }
                },
            },
            {
                id: 'find-pairs', name: 'Find the partner in a scene', level: 3,
                gen(rng) {
                    const [scene, forces, partner] = rng.pick(SCENES);
                    const askable = forces.map((_, i) => i).filter(i => partner[i] >= 0);
                    const k = rng.pick(askable), p = partner[k];
                    const list = forces.map((f, i) => `${ROMAN[i]}. ${cap(f)}`).join('<br>');
                    const others = forces.map((_, i) => i).filter(i => i !== k && i !== p);
                    return {
                        q: `${scene} Some of the forces involved:<br>${list}<br>Which force is the action–reaction partner of force ${ROMAN[k]}?`,
                        ans: CA.mc(rng, `Force ${ROMAN[p]}`, others.map(i => `Force ${ROMAN[i]}`), { max: 4 }),
                        sol: `Force ${ROMAN[k]} (${forces[k]}) and force ${ROMAN[p]} (${forces[p]}) are the same interaction from each side: the two objects swap places and the direction flips.`,
                    };
                },
            },
        ],

        assignment: [
            ['name-reaction', 6], ['reaction-size', 4], ['reaction-direction', 5],
            ['pair-or-balanced', 5], ['misconceptions', 5], ['push-apart', 4], ['recoil', 4], ['which-more', 3], ['earth-and-you', 2],
            ['carts-speeds', 4], ['rocket', 3], ['tug-of-war', 2], ['find-pairs', 3],
        ],
    });
})();
