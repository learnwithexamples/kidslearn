/* Worksheet: Newton's First Law — inertia, balanced and unbalanced forces, net force. */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, C = F.colors;

    // ── Force diagrams ───────────────────────────────────────────────────
    /** Arrow from (x1, y1) to the tip (x2, y2). */
    function arrow(x1, y1, x2, y2, color = C.INK) {
        const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = 9, w = 4.5;
        const bx = x2 - ux * h, by = y2 - uy * h;
        return F.line(x1, y1, bx, by, { stroke: color, width: 2.2 })
            + F.poly([[x2, y2], [bx - uy * w, by + ux * w], [bx + uy * w, by - ux * w]], { fill: color, stroke: color, width: 1 });
    }
    const labW = s => 7 * s.length + 2;
    /**
     * A free-body diagram. f = { right: [force…], left, up, down } where a force is
     * { v: newtons (true size, used for the arrow length), label?: 'F = ?' }.
     * Arrows start at the edge of the object and point the way the force acts.
     * Lengths are proportional to the forces (never shorter than 16 px).
     */
    function forceFig(name, f, opt = {}) {
        const right = f.right || [], left = f.left || [], up = f.up || [], down = f.down || [];
        const all = [...right, ...left, ...up, ...down];
        const maxV = Math.max(...all.map(a => a.v), 1);
        const hasV = up.length + down.length > 0;
        const maxLen = opt.maxLen || (hasV ? 62 : 74), sc = maxLen / maxV;
        const len = a => Math.max(16, a.v * sc);
        const lab = a => a.label || `${a.v} N`;
        const nH = Math.max(right.length, left.length, 1);
        const bw = 60, bh = Math.max(hasV ? 44 : 40, 17 * nH + 10);
        const side = arr => arr.length ? Math.max(...arr.map(a => len(a) + 6 + labW(lab(a)))) : 10;
        const padL = Math.max(side(left), hasV ? 40 : 10) + 6, padR = Math.max(side(right), hasV ? 40 : 10) + 6;
        const vLen = arr => arr.length ? Math.max(...arr.map(len)) + 8 : 0;
        const padT = hasV ? Math.max(vLen(up), 14) + 6 : 14, padB = hasV ? Math.max(vLen(down), 14) + 6 : 14;
        const W = padL + bw + padR, H = padT + bh + padB;
        const x0 = padL, y0 = padT, cx = x0 + bw / 2, cy = y0 + bh / 2;
        let b = '';
        if (!hasV) b += F.line(4, y0 + bh, W - 4, y0 + bh, { width: 1.2 });
        b += F.rect(x0, y0, bw, bh, { fill: C.FILL });
        b += F.text(cx, cy + 4, name, { size: name.length > 7 ? 10 : 11 });
        const isUnk = a => !!a.label && a.label.includes('?');
        const col = a => (isUnk(a) ? C.ACCENT : C.INK);
        const tOpt = a => ({ size: 12, fill: col(a), bold: isUnk(a) });
        const offs = n => Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * 17);
        offs(right.length).forEach((o, i) => { const a = right[i], y = cy + o; b += arrow(x0 + bw, y, x0 + bw + len(a), y, col(a)) + F.text(x0 + bw + len(a) + 5, y + 4, lab(a), { anchor: 'start', ...tOpt(a) }); });
        offs(left.length).forEach((o, i) => { const a = left[i], y = cy + o; b += arrow(x0, y, x0 - len(a), y, col(a)) + F.text(x0 - len(a) - 5, y + 4, lab(a), { anchor: 'end', ...tOpt(a) }); });
        const vx = n => [[], [0], [-14, 14]][n];
        vx(up.length).forEach((o, i) => { const a = up[i], x = cx + o; b += arrow(x, y0, x, y0 - len(a), col(a)) + F.text(x + (o < 0 ? -6 : 6), y0 - len(a) / 2 - 2, lab(a), { anchor: o < 0 ? 'end' : 'start', ...tOpt(a) }); });
        vx(down.length).forEach((o, i) => { const a = down[i], x = cx + o; b += arrow(x, y0 + bh, x, y0 + bh + len(a), col(a)) + F.text(x + (o < 0 ? -6 : 6), y0 + bh + len(a) / 2 + 8, lab(a), { anchor: o < 0 ? 'end' : 'start', ...tOpt(a) }); });
        return F.svg(W, H, b, { label: 'force diagram' });
    }
    const sum = arr => arr.reduce((s, a) => s + a, 0);
    const forces = vals => vals.map(v => ({ v }));
    /** n different multiples of `step` between lo and hi. */
    const mults = (rng, n, lo, hi, step = 5) => rng.sample(Array.from({ length: Math.floor(hi / step) - Math.ceil(lo / step) + 1 }, (_, i) => (Math.ceil(lo / step) + i) * step), n);
    const plusList = arr => arr.join(' + ');
    /** "\(30 + 20 = 50\) N" for several forces, "50 N" for one. */
    const total = arr => (arr.length > 1 ? R`\(${plusList(arr)} = ${sum(arr)}\) N` : `${sum(arr)} N`);
    /** "A" or "An" before a word or a number. */
    const art = x => (/^[aeiou]/i.test(String(x)) || /^8/.test(String(x)) || /^1[18](\.|$)/.test(String(x)) ? 'An' : 'A');

    const OBJECTS = ['box', 'crate', 'cart', 'sled', 'desk', 'trolley', 'wagon', 'piano', 'fridge', 'boat'];

    /** Multiple choice from a bank of { q, a, w: [wrong…], sol }. */
    const fromBank = (rng, bank) => { const it = rng.pick(bank); return { q: it.q, ans: CA.mc(rng, it.a, it.w), sol: it.sol }; };

    // ── Banks of conceptual questions ────────────────────────────────────
    const BASICS = [
        { q: R`A ball is sitting still on the grass and no unbalanced force acts on it. What does Newton's First Law say will happen?`, a: 'It stays at rest.', w: ['It slowly starts to roll by itself.', 'It sinks into the grass.', 'It rolls away if it is heavy.'], sol: R`An object at rest stays at rest unless a force acts on it to change its motion.` },
        { q: R`What is the name for an object's tendency to resist changes in its motion?`, a: 'Inertia', w: ['Gravity', 'Friction', 'Speed'], sol: R`Inertia is the resistance of an object to any change in its motion.` },
        { q: R`What is needed to change the motion of an object?`, a: 'A force (a push or a pull)', w: ['Nothing — motion changes by itself', 'More inertia', 'Time'], sol: R`Only a force can start, stop, speed up, slow down or turn a moving object.` },
        { q: R`A moving object has no forces acting on it at all. What does it do?`, a: 'Keeps going straight at the same speed', w: ['Slows down and stops', 'Speeds up', 'Moves in a circle'], sol: R`An object in motion stays in motion — same speed, same direction — unless a force acts on it.` },
        { q: R`What does the amount of inertia an object has depend on?`, a: 'Its mass', w: ['Its speed', 'Its colour', 'How high up it is'], sol: R`More mass means more inertia. A fast object and a slow object of the same mass have the same inertia.` },
        { q: R`Newton's First Law is also called…`, a: 'the law of inertia', w: ['the law of gravity', 'the law of action and reaction', 'the law of friction'], sol: R`The First Law is about inertia: objects keep doing what they are already doing.` },
        { q: R`What is a force?`, a: 'A push or a pull', w: ['The speed of an object', 'The mass of an object', 'The distance an object moves'], sol: R`A force is a push or a pull. Forces are measured in newtons (N).` },
        { q: R`Which force slows down objects that slide across a surface?`, a: 'Friction', w: ['Inertia', 'Magnetism', 'Thrust'], sol: R`Friction between the object and the surface acts against the sliding and slows it down.` },
        { q: R`The forces on an object are balanced. What is the net force on it?`, a: 'Zero', w: ['Equal to the biggest force', 'The sum of all the forces', 'It depends on how fast it moves'], sol: R`Balanced forces cancel each other out, so the net (total) force is zero.` },
        { q: R`Which force pulls things toward the ground?`, a: 'Gravity', w: ['Friction', 'Inertia', 'Air resistance'], sol: R`Gravity pulls objects toward the Earth.` },
        { q: R`A ball rolling across a lawn slows down and stops. Why?`, a: 'Friction and air resistance act on it.', w: ['It runs out of force from the kick.', 'Its inertia wears off.', 'All moving things stop by themselves.'], sol: R`Moving objects only slow down when a force acts against them — here, friction from the grass and air resistance.` },
        { q: R`What do unbalanced forces do to an object?`, a: 'Change its speed or direction', w: ['Nothing — its motion stays the same', 'Always make it stop', 'Give it a constant speed'], sol: R`Unbalanced forces give a net force, and a net force changes the motion of the object.` },
        { q: R`An object moves in a straight line at a constant speed. What is the net force on it?`, a: 'Zero', w: ['A force in the direction it moves', 'A force against its motion', 'Its weight'], sol: R`Constant speed in a straight line means the motion is not changing, so the forces are balanced and the net force is zero.` },
        { q: R`What unit are forces measured in?`, a: 'Newtons (N)', w: ['Kilograms (kg)', 'Metres per second (m/s)', 'Metres (m)'], sol: R`Forces are measured in newtons, named after Isaac Newton.` },
    ];

    const EVERYDAY = [
        { q: R`A car stops suddenly and a passenger is thrown forward against the seatbelt. Why?`, a: 'Inertia keeps their body moving.', w: ['The brakes push them forward.', 'Gravity pulls them forward.', 'The seat pushes them forward.'], sol: R`The brakes stop the car, but nothing stops the passenger's body except the seatbelt. Inertia keeps the body moving forward; the seatbelt supplies the force that stops it.` },
        { q: R`A magician pulls a tablecloth away very quickly and the dishes stay on the table. Why?`, a: "The dishes' inertia keeps them still.", w: ['The dishes are too light to feel forces.', 'Gravity gets stronger during the pull.', 'The cloth pushes the dishes down.'], sol: R`Objects at rest stay at rest. The quick pull means the small friction force from the cloth acts for only a moment, so the dishes barely move.` },
        { q: R`A bus starts moving suddenly and the standing passengers lurch backward. Why?`, a: 'Their bodies tend to stay at rest.', w: ['The engine pushes them backward.', 'Air in the bus pushes them back.', 'The bus pulls them backward.'], sol: R`Because of inertia the passengers' bodies stay where they were while the floor moves forward, so they seem to fall back.` },
        { q: R`A cyclist brakes hard and slides forward on the seat. Why?`, a: 'Inertia keeps the rider moving.', w: ['The brakes push the rider forward.', 'The bike speeds up when braking.', 'Gravity pulls the rider forward.'], sol: R`The braking force acts on the bike, not directly on the rider, so the rider's body carries on moving forward.` },
        { q: R`A hockey puck slides a long way on ice but stops quickly on carpet. Why?`, a: 'There is much less friction on ice.', w: ['The ice gives the puck extra pushes.', 'The puck has more inertia on ice.', 'Gravity is weaker on ice.'], sol: R`Friction is the force that slows the puck. Smooth ice gives very little friction, so the puck keeps moving for longer.` },
        { q: R`You shake a ketchup bottle downward and then stop it suddenly. Ketchup comes out. Why?`, a: 'Inertia keeps the ketchup moving.', w: ['The bottle pushes the ketchup out.', 'Shaking makes the ketchup heavier.', 'Gravity is stronger when it stops.'], sol: R`Your hand stops the bottle; nothing stops the ketchup inside, so it carries on moving down and out.` },
        { q: R`A hammer head is loose. You bang the end of the handle down on the floor and the head moves further down onto the handle. Why?`, a: 'Inertia keeps the head moving down.', w: ['The floor pushes the head down.', 'The handle stretches when it hits.', 'Gravity acts only on the head.'], sol: R`The floor puts a force on the handle and stops it. The head keeps moving and slides further onto the handle.` },
        { q: R`A coin sits on a card on top of a glass. You flick the card away quickly and the coin drops into the glass. Why?`, a: 'It stays put (inertia), then falls.', w: ['The card pushes it into the glass.', 'It is too heavy to move sideways.', 'Air pushes it down into the glass.'], sol: R`The flick acts on the card. The coin stays at rest (inertia), and once the card is gone, gravity is an unbalanced force that pulls it down.` },
        { q: R`A parked car is hit from behind and jolted forward. Its headrests protect the people inside. How?`, a: 'They push the heads forward too.', w: ['They pull the heads backward.', 'They make the car lighter.', 'They stop gravity acting on heads.'], sol: R`The seat pushes the body forward, but the head has inertia and would be left behind. The headrest gives the force that moves the head along with the body.` },
        { q: R`You hang a dusty rug on a line and hit it hard with a stick. Dust falls out. Why?`, a: 'The dust tends to stay at rest.', w: ['The stick pushes dust through.', 'Hitting makes the dust heavier.', 'The dust is attracted to the stick.'], sol: R`The force acts on the rug. The dust has inertia and stays where it is, so the rug moves away from the dust.` },
        { q: R`A sprinter cannot stop exactly at the finish line and runs on a few more metres. Why?`, a: 'Friction takes time to stop them.', w: ['The finish line pushes them on.', 'Their legs store a force inside.', 'Air pushes them forward.'], sol: R`A moving body keeps moving (inertia) unless a force slows it. Friction from the ground needs some time and distance to bring the sprinter to rest.` },
        { q: R`A truck carrying loose boxes brakes hard. The boxes slide toward the front. Why?`, a: 'Inertia keeps the boxes moving.', w: ['The brakes push the boxes forward.', 'The engine pulls the boxes forward.', 'The boxes speed up as it brakes.'], sol: R`The braking force acts on the truck. The boxes keep their motion until straps or the front wall provide a force to stop them.` },
        { q: R`A soccer ball lies still on the field. Which statement is true?`, a: "Gravity and the ground's push balance.", w: ['No forces act on it at all.', 'Only gravity acts on it.', 'It has no inertia while still.'], sol: R`Gravity pulls it down and the ground pushes it up equally, so the net force is zero and the ball stays at rest. It still has inertia — it has mass.` },
        { q: R`The space probe Voyager has travelled through space for decades with its engines off. Why does it keep moving?`, a: 'Almost nothing slows it down.', w: ['A hidden engine keeps pushing it.', 'Its launch force is still inside it.', 'Inertia is a force pushing it on.'], sol: R`In space there is almost no friction or air resistance. A moving object needs no force to keep moving — only to change its motion.` },
        { q: R`A car turns sharply to the left. The passengers slide toward the right-hand side of the car. Why?`, a: 'Their bodies tend to go straight on.', w: ['A force pushes them outward.', 'The steering pushes them right.', 'Gravity pulls them to the right.'], sol: R`Because of inertia the passengers keep moving in a straight line while the car turns left under them, so they slide right until the door pushes them round.` },
        { q: R`It is much harder to get a full shopping cart moving than an empty one. Why?`, a: 'It has more mass, so more inertia.', w: ['The empty cart has more inertia.', 'Only moving carts have inertia.', 'Gravity pushes the full cart back.'], sol: R`More mass means more inertia, so a bigger force is needed to change the full cart's motion.` },
        { q: R`You pull a tablecloth slowly instead of quickly. The dishes slide along with it. Why?`, a: 'Friction acts on them for longer.', w: ['The dishes lose their inertia.', 'Gravity pulls them with the cloth.', 'A slow pull makes them lighter.'], sol: R`Friction from the cloth is a force on the dishes. Acting for a long time, it is enough to change their motion.` },
        { q: R`You slide a book across a table and it stops. A friend says "it ran out of force". What really stopped it?`, a: 'Friction from the table', w: ['It ran out of force', 'Gravity pushing it backward', 'Its inertia being used up'], sol: R`A moving object does not carry a "force" with it. Friction is a force that acts against the sliding and stops the book.` },
        { q: R`You walk with a full bucket of water and stop suddenly. The water sloshes forward over the front edge. Why?`, a: 'Inertia keeps the water moving.', w: ['Stopping pushes the water forward.', 'Water has no inertia.', 'Gravity pulls the water forward.'], sol: R`The force from your arm stops the bucket. The water is free to keep moving, so it carries on forward.` },
    ];

    const SITUATIONS = [
        [true, R`A book lies still on a table.`, R`It is at rest and stays at rest: gravity down is balanced by the table pushing up.`],
        [true, R`A car drives along a straight, flat road at a steady 60 km/h.`, R`Its speed and direction do not change, so the driving force is balanced by friction and air resistance.`],
        [true, R`A skydiver with an open parachute falls at a constant speed.`, R`Constant speed in a straight line: air resistance up balances gravity down.`],
        [true, R`A lamp hangs still from the ceiling on a cord.`, R`It stays at rest: the pull of the cord up balances gravity down.`],
        [true, R`An elevator moves upward at a constant speed.`, R`Constant speed in a straight line means no change in motion; the cable's pull balances gravity.`],
        [true, R`In a tug of war, both teams pull hard and the rope does not move.`, R`The rope stays at rest, so the two teams' pulls are equal and opposite.`],
        [true, R`A plane flies level in a straight line at a constant speed.`, R`No change in speed or direction: thrust balances drag, lift balances gravity.`],
        [true, R`A boat crosses a calm lake in a straight line at a constant speed with its engine running.`, R`The engine's push is balanced by the drag of the water, so the motion does not change.`],
        [true, R`A cyclist pedals along a straight, flat path at a steady 15 km/h.`, R`Steady speed in a straight line: the pedalling force balances friction and air resistance.`],
        [true, R`A box is pushed across the floor at a steady speed in a straight line.`, R`The motion is not changing, so the push exactly balances friction.`],
        [false, R`A car pulls away from a traffic light, going faster and faster.`, R`It is speeding up, so its motion is changing: there is a net force forward.`],
        [false, R`A cyclist brakes and slows down to a stop.`, R`It is slowing down, so there is a net force backward.`],
        [false, R`An apple falls from a tree, going faster as it falls.`, R`It speeds up, so gravity down is bigger than air resistance up.`],
        [false, R`A rocket lifts off from the launch pad and speeds up.`, R`It speeds up, so the thrust up is bigger than gravity down.`],
        [false, R`A sled slides down a snowy hill, going faster and faster.`, R`Its speed is changing, so the forces cannot be balanced.`],
        [false, R`A hockey puck slides across rough concrete and slows down.`, R`It is slowing down: friction is an unbalanced force against its motion.`],
        [false, R`A train slows down as it comes into a station.`, R`Its speed is decreasing, so there is a net force backward.`],
        [false, R`A ball is thrown straight up and is still rising, getting slower.`, R`It is slowing down, so the forces are unbalanced: gravity pulls it down.`],
    ];
    const SIT_CHOICES = ['Balanced — net force is zero', 'Unbalanced — net force is not zero', 'No forces act on it at all', 'It depends on its mass'];

    const REASONING = [
        { q: R`An astronaut far out in space lets go of a wrench that is moving at 3 m/s. No forces act on it. What happens to the wrench?`, a: 'It goes straight on at 3 m/s.', w: ['It slows down and stops.', 'It floats back to the astronaut.', 'It speeds up, as nothing holds it.'], sol: R`With no force there is no change in motion: the same speed in the same direction, forever.` },
        { q: R`A spacecraft in deep space fires its engine for 10 seconds, getting faster, then switches the engine off. What happens after the engine is switched off?`, a: 'It keeps the speed it had.', w: ['It slows down and stops.', 'It keeps getting faster.', 'It starts to drift backward.'], sol: R`While the engine fires there is a net force and it speeds up. After that the net force is zero, so its speed stays the same.` },
        { q: R`A puck is hit across a perfectly frictionless ice rink. After it leaves the stick, what does it do?`, a: 'Goes straight at a constant speed', w: ['Slows as the push runs out', 'Speeds up', 'Curves and slows down'], sol: R`After it leaves the stick no horizontal force acts on it, so its motion does not change.` },
        { q: R`A ball rests on the floor of a bus moving at a steady speed. The bus brakes suddenly. Which way does the ball roll, compared with the bus?`, a: 'Toward the front of the bus', w: ['Toward the back of the bus', 'It stays where it is', 'Toward the side of the bus'], sol: R`The bus slows down, but the ball keeps moving forward at its old speed (inertia), so it rolls toward the front.` },
        { q: R`A handle hangs from a strap in a bus that is standing still. The bus starts forward suddenly. Which way does the handle swing?`, a: 'Toward the back of the bus', w: ['Toward the front of the bus', 'It stays hanging straight down', 'Toward the side of the bus'], sol: R`The handle tends to stay at rest while the bus moves forward, so it swings back compared with the bus.` },
        { q: R`A bus moves in a straight line at a steady speed. A passenger drops her keys. Where do they land?`, a: 'Straight below her hand', w: ['Behind her, toward the back', 'In front of her', 'They float in the air'], sol: R`The keys are already moving forward with the bus, at the same speed. Nothing changes that, so they keep up with the bus and land below her hand.` },
        { q: R`A bus turns right. A ball on the floor of the bus rolls. Which side of the bus does it roll toward?`, a: 'The left side', w: ['The right side', 'It stays where it is', 'The back of the bus'], sol: R`The ball keeps going straight (inertia) while the bus turns right underneath it, so it ends up toward the left side.` },
        { q: R`A car drives around a curve at a steady 30 km/h. Are the forces on it balanced?`, a: 'No — its direction is changing.', w: ['Yes — its speed is constant.', 'Yes — no forces act on it.', 'No — moving cars need a net force.'], sol: R`A change in direction is a change in motion, so there must be a net force: friction from the road pushes the car toward the inside of the curve.` },
        { q: R`A skater glides on very smooth ice at a steady 4 m/s without pushing. What forward force keeps her moving?`, a: 'None is needed', w: ['Her first push, still inside her', 'Her inertia, pushing her forward', 'Gravity'], sol: R`Inertia is not a force. With (almost) no friction, nothing changes her motion, so she keeps gliding without any forward force.` },
        { q: R`A ball whirled in a circle on a string is moving north when the string breaks. Which way does it go next (seen from above)?`, a: 'North, in a straight line', w: ['Round in the same circle', 'Straight out from the centre', 'In a slow outward spiral'], sol: R`The string was the force turning the ball. Without it, the ball keeps going in the direction it was moving at that moment: straight on, north.` },
        { q: R`A cart rolls along a frictionless track at 2 m/s. All the forces on it are balanced. What happens next?`, a: 'It keeps rolling at 2 m/s.', w: ['It slows down, as nothing pushes it.', 'It speeds up.', 'It stops at once.'], sol: R`Balanced forces mean zero net force, so the motion does not change.` },
        { q: R`A passenger holds a full cup of hot chocolate in a car. The driver brakes suddenly. Which way does the drink spill?`, a: 'Forward, toward the front', w: ['Backward, toward the passenger', 'Straight up out of the cup', 'It does not spill at all'], sol: R`The cup is slowed with the car, but the liquid keeps moving forward because of inertia, so it spills forward.` },
        { q: R`Two pucks slide on frictionless ice at 2 m/s: a light 1 kg puck and a heavy 5 kg puck. To stop each one in the same time, which needs the bigger force?`, a: 'The 5 kg puck', w: ['The 1 kg puck', 'Both need the same force', 'Neither — they stop by themselves'], sol: R`The heavier puck has more inertia, so a bigger force is needed to change its motion in the same time.` },
        { q: R`You ride in an elevator that moves upward at a constant speed. How does the upward push of the floor on you compare with your weight?`, a: 'It is equal to your weight.', w: ['Bigger, as you are moving up', 'Smaller than your weight', 'It is zero.'], sol: R`Constant speed in a straight line means balanced forces, so the floor's push up equals gravity down — whether you are moving or not.` },
        { q: R`You are on a train moving at a steady speed in a straight line. You jump straight up. Where do you land?`, a: 'On the spot you jumped from', w: ['Behind it — the train moves on', 'In front of the spot', 'It depends on the train speed'], sol: R`You were already moving forward with the train. In the air nothing changes your forward motion, so you keep up with the train.` },
        { q: R`A plane flies level at a constant speed and drops a package. Ignoring air resistance, where is the package as it falls, compared with the plane?`, a: 'Directly below the plane', w: ['Further and further behind it', 'In front of the plane', 'Below the point of release'], sol: R`The package keeps the plane's forward speed (inertia); gravity only changes its up–down motion. So it stays under the plane while falling.` },
    ];

    // ── Inertia comparisons ──────────────────────────────────────────────
    const THINGS = [
        ['tennis ball', 0.06, 0.06], ['soccer ball', 0.45, 0.45], ['bowling ball', 5, 7], ['bicycle', 10, 15], ['scooter', 4, 8],
        ['child', 30, 40], ['shopping cart', 20, 60], ['motorbike', 150, 250], ['car', 1000, 1500], ['truck', 6000, 12000],
        ['skateboard', 2, 4], ['horse', 400, 600], ['piano', 200, 350],
    ];

    CA.register({
        id: 'newtons-first-law',
        title: "Newton's First Law",
        page: 'newtons-first-law.html',
        subject: 'Physics',
        assignmentNote: 'Give forces in newtons (N). In each force diagram the arrows show the forces on the object and point the way each force acts; longer arrows mean bigger forces. For multiple choice, circle the best answer.',

        practice: [
            // ── Level 1 ──
            {
                id: 'net-two', name: 'Net force of two forces', level: 1,
                gen(rng) {
                    const obj = rng.pick(OBJECTS), kind = rng.pick(['opp', 'opp', 'same', 'equal']);
                    if (kind === 'same') {
                        const [a, b] = mults(rng, 2, 10, 90), dir = rng.pick(['right', 'left']);
                        return {
                            q: `Two forces act on a ${obj}, as shown. What is the size of the net force on the ${obj}?`,
                            fig: forceFig(obj, { [dir]: forces([a, b]) }),
                            ans: CA.num(a + b, 'N'),
                            sol: R`Both forces act to the ${dir}, so add them: \(${a} + ${b} = ${a + b}\) N to the ${dir}.`,
                        };
                    }
                    if (kind === 'equal') {
                        const a = rng.int(2, 24) * 5;
                        return {
                            q: `Two forces act on a ${obj}, as shown. What is the size of the net force on the ${obj}?`,
                            fig: forceFig(obj, { right: forces([a]), left: forces([a]) }),
                            ans: CA.num(0, 'N'),
                            sol: R`The forces are equal and opposite: \(${a} - ${a} = 0\). The forces are balanced.`,
                        };
                    }
                    const [a, b] = mults(rng, 2, 10, 120), big = a > b ? 'right' : 'left';
                    return {
                        q: `Two forces act on a ${obj}, as shown. What is the size of the net force on the ${obj}?`,
                        fig: forceFig(obj, { right: forces([a]), left: forces([b]) }),
                        ans: CA.num(Math.abs(a - b), 'N'),
                        sol: R`The forces act in opposite directions, so subtract: \(${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}\) N, to the ${big}.`,
                    };
                },
            },
            {
                id: 'net-words', name: 'Net force from a description', level: 1,
                gen(rng) {
                    const k = rng.int(0, 5);
                    if (k === 0) {
                        const [a, b] = mults(rng, 2, 20, 90), [n1, n2] = rng.sample(['Ava', 'Ben', 'Chloe', 'Dev', 'Eli', 'Mia', 'Sam', 'Zoe'], 2);
                        return { q: `${n1} and ${n2} push a heavy box in the same direction. ${n1} pushes with ${a} N and ${n2} pushes with ${b} N. Ignoring friction, what is the size of the net force on the box?`, ans: CA.num(a + b, 'N'), sol: R`Same direction, so add: \(${a} + ${b} = ${a + b}\) N.` };
                    }
                    if (k === 1) {
                        const [a, b] = mults(rng, 2, 300, 900, 10);
                        return { q: `In a tug of war, the red team pulls the rope with ${a} N to the left and the blue team pulls with ${b} N to the right. What is the size of the net force on the rope?`, ans: CA.num(Math.abs(a - b), 'N'), sol: R`Opposite directions, so subtract: \(${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}\) N toward the ${a > b ? 'red team (left)' : 'blue team (right)'}.` };
                    }
                    if (k === 2) {
                        const b = rng.int(3, 10) * 5, a = b + rng.int(2, 14) * 5;
                        return { q: `A team of dogs pulls a sled forward with a force of ${a} N. Friction from the snow acts backward with ${b} N. What is the size of the net force on the sled?`, ans: CA.num(a - b, 'N'), sol: R`\(${a} - ${b} = ${a - b}\) N forward. The forces are unbalanced, so the sled speeds up.` };
                    }
                    if (k === 3) {
                        const [a, b] = mults(rng, 2, 15, 60);
                        return { q: `One child pulls a wagon forward with ${a} N while another pushes it from behind, also forward, with ${b} N. Ignoring friction, what is the size of the net force on the wagon?`, ans: CA.num(a + b, 'N'), sol: R`Pulling from the front and pushing from behind both act forward: \(${a} + ${b} = ${a + b}\) N.` };
                    }
                    if (k === 4) {
                        const b = rng.int(5, 20) * 10, a = b + rng.int(3, 25) * 10;
                        return { q: `The wind pushes a sailboat east with a force of ${a} N. The water drags on the boat toward the west with ${b} N. What is the size of the net force on the boat?`, ans: CA.num(a - b, 'N'), sol: R`Opposite directions: \(${a} - ${b} = ${a - b}\) N to the east.` };
                    }
                    const b = rng.int(2, 6) * 5, a = b + rng.int(1, 8) * 5;
                    return { q: `You push a shopping cart forward with ${a} N. Friction acts backward on it with ${b} N. What is the size of the net force on the cart?`, ans: CA.num(a - b, 'N'), sol: R`\(${a} - ${b} = ${a - b}\) N forward, so the cart speeds up.` };
                },
            },
            {
                id: 'what-next', name: 'What happens next?', level: 1,
                gen(rng) {
                    const obj = rng.pick(OBJECTS), state = rng.pick(['rest', 'rest', 'right', 'left']);
                    const nR = rng.int(1, 2), nL = rng.int(1, 2);
                    let R1 = mults(rng, nR, 10, 80), L1 = mults(rng, nL, 10, 80);
                    const pick = rng.pick(['bal', 'R', 'L']);
                    if (pick === 'bal') { const d = sum(R1) - sum(L1); if (d >= 0) L1[L1.length - 1] += d; else R1[R1.length - 1] -= d; }
                    if (new Set(R1).size < R1.length || new Set(L1).size < L1.length) return this.gen(rng);
                    const net = sum(R1) - sum(L1), fig = forceFig(obj, { right: forces(R1), left: forces(L1) });
                    const sumTxt = `Right: ${total(R1)}; left: ${total(L1)}.`;
                    if (state === 'rest') {
                        const ch = ['It stays at rest.', 'It starts moving to the right.', 'It starts moving to the left.', 'It depends on its mass.'];
                        const a = net === 0 ? ch[0] : net > 0 ? ch[1] : ch[2];
                        return {
                            q: `The ${obj} is at rest. The forces on it are shown. What happens next?`, fig,
                            ans: CA.mc(rng, a, ch.filter(c => c !== a)),
                            sol: sumTxt + (net === 0 ? ' The forces are balanced, so the object stays at rest (First Law).' : ` The forces are unbalanced: a net force of ${Math.abs(net)} N to the ${net > 0 ? 'right' : 'left'}, so it starts to move that way.`),
                        };
                    }
                    const ch = ['It speeds up.', 'It slows down.', 'It keeps moving at the same speed.', 'It stops at once.'];
                    const same = (net > 0) === (state === 'right');
                    const a = net === 0 ? ch[2] : same ? ch[0] : ch[1];
                    return {
                        q: `The ${obj} is moving to the ${state}. The forces on it are shown. What happens to its speed?`, fig,
                        ans: CA.mc(rng, a, ch.filter(c => c !== a)),
                        sol: sumTxt + (net === 0 ? ' The forces are balanced, so nothing changes its motion: it keeps the same speed.'
                            : ` Net force ${Math.abs(net)} N to the ${net > 0 ? 'right' : 'left'}, ${same ? 'the same way it moves, so it speeds up' : 'against its motion, so it slows down'}.`),
                    };
                },
            },
            {
                id: 'basics', name: 'First Law facts', level: 1,
                gen(rng) { return fromBank(rng, BASICS); },
            },
            // ── Level 2 ──
            {
                id: 'net-many', name: 'Net force of several forces', level: 2,
                gen(rng) {
                    const obj = rng.pick(OBJECTS);
                    let nR = rng.int(1, 3), nL = rng.int(1, 3);
                    if (nR + nL < 3) nR++;
                    if (nR + nL > 5) nL--;
                    const Rv = mults(rng, nR, 10, 120), Lv = mults(rng, nL, 10, 120);
                    if (rng.bool(0.2)) { const d = sum(Rv) - sum(Lv); if (d > 0) Lv[0] += d; else Rv[0] -= d; }
                    if (new Set(Rv).size < Rv.length || new Set(Lv).size < Lv.length || Math.max(...Rv, ...Lv) > 150) return this.gen(rng);
                    const sR = sum(Rv), sL = sum(Lv), net = sR - sL, dir = net > 0 ? 'right' : 'left', opp = net > 0 ? 'left' : 'right';
                    const bal = '0 N — the forces are balanced';
                    const a = net === 0 ? bal : `${Math.abs(net)} N to the ${dir}`;
                    const wrong = net === 0 ? [`${sR} N to the right`, `${sL} N to the left`, `${sR + sL} N to the right`]
                        : [`${Math.abs(net)} N to the ${opp}`, `${sR + sL} N to the ${dir}`, bal, `${Math.max(sR, sL)} N to the ${dir}`];
                    return {
                        q: `Find the net force on the ${obj}.`,
                        fig: forceFig(obj, { right: forces(Rv), left: forces(Lv) }),
                        ans: CA.mc(rng, a, wrong),
                        sol: `Right: ${total(Rv)}. Left: ${total(Lv)}. ` + (net === 0 ? 'They are equal, so the net force is 0 N.' : R`Net force \(${Math.max(sR, sL)} - ${Math.min(sR, sL)} = ${Math.abs(net)}\) N to the ${dir}.`),
                    };
                },
            },
            {
                id: 'missing-force', name: 'The force that balances', level: 2,
                gen(rng) {
                    const obj = rng.pick(OBJECTS);
                    if (rng.bool(0.65)) {
                        const state = rng.pick(['stays at rest', 'moves to the right at a constant speed', 'moves to the left at a constant speed', 'slides along at a steady speed in a straight line']);
                        const unkRight = rng.bool();
                        const nKnownSame = rng.int(0, 1), nOther = rng.int(1, 2);
                        const other = mults(rng, nOther, 20, 110), same = mults(rng, nKnownSame, 10, 40);
                        const x = sum(other) - sum(same);
                        if (x < 10 || same.includes(x) || x > 150) return this.gen(rng);
                        const unk = { v: x, label: 'F = ?' };
                        const sameSide = [...forces(same), unk], otherSide = forces(other);
                        const f = unkRight ? { right: sameSide, left: otherSide } : { right: otherSide, left: sameSide };
                        return {
                            q: `The ${obj} ${state}. The horizontal forces on it are shown. What is the size of force F?`,
                            fig: forceFig(obj, f),
                            ans: CA.num(x, 'N'),
                            sol: R`At rest or at constant speed in a straight line, the forces are balanced. ` + (same.length
                                ? R`\(F + ${same[0]} = ${plusList(other)}\), so \(F = ${sum(other)} - ${same[0]} = ${x}\) N.`
                                : (other.length > 1 ? R`\(F = ${plusList(other)} = ${x}\) N.` : R`\(F = ${x}\) N, equal to the force on the other side.`)),
                        };
                    }
                    const nR = rng.int(1, 2), nL = rng.int(1, 2);
                    const Rv = mults(rng, nR, 10, 100), Lv = mults(rng, nL, 10, 100);
                    const net = sum(Rv) - sum(Lv);
                    if (net === 0) return this.gen(rng);
                    const opp = net > 0 ? 'left' : 'right', dir = net > 0 ? 'right' : 'left';
                    const a = `${Math.abs(net)} N to the ${opp}`;
                    return {
                        q: `What single extra force would make the forces on the ${obj} balanced?`,
                        fig: forceFig(obj, { right: forces(Rv), left: forces(Lv) }),
                        ans: CA.mc(rng, a, [`${Math.abs(net)} N to the ${dir}`, `${sum(Rv) + sum(Lv)} N to the ${opp}`, 'None — they are already balanced']),
                        sol: R`Right: ${sum(Rv)} N, left: ${sum(Lv)} N, so the net force is ${Math.abs(net)} N to the ${dir}. To cancel it, add ${Math.abs(net)} N to the ${opp}.`,
                    };
                },
            },
            {
                id: 'steady-words', name: 'Steady motion means balanced forces', level: 2,
                gen(rng) {
                    const k = rng.int(0, 7);
                    if (k === 0) {
                        const air = rng.int(30, 90) * 10, fr = rng.int(10, 40) * 10, v = rng.pick([50, 60, 80, 90, 100]);
                        return { q: `A car travels along a straight, flat road at a steady ${v} km/h. The engine's driving force is ${air + fr} N and the air resistance is ${air} N. What is the friction force from the road?`, ans: CA.num(fr, 'N'), sol: R`Steady speed in a straight line, so the forces are balanced: \(${air + fr} = ${air} + \text{friction}\), so friction \(= ${fr}\) N. (The speed does not matter.)` };
                    }
                    if (k === 1) {
                        const p = rng.int(45, 85) * 10, e = rng.int(8, 25) * 10;
                        return { q: `A skydiver who weighs ${p} N carries equipment that weighs ${e} N. With the parachute open, they fall at a constant speed. What is the force of air resistance on them?`, ans: CA.num(p + e, 'N'), sol: R`Constant speed means balanced forces: air resistance = total weight \(= ${p} + ${e} = ${p + e}\) N.` };
                    }
                    if (k === 2) {
                        const w = rng.int(40, 90) * 100, ppl = rng.int(3, 15) * 100, dir = rng.pick(['up', 'down']);
                        return { q: `An elevator weighing ${w} N carries people weighing ${ppl} N in total. It moves ${dir} at a constant speed. What is the upward pull of the cable?`, ans: CA.num(w + ppl, 'N'), sol: R`Constant speed means balanced forces, whether it moves up or down: cable pull \(= ${w} + ${ppl} = ${w + ppl}\) N.` };
                    }
                    if (k === 3) {
                        const fr = rng.int(16, 40) * 10, a = rng.int(5, Math.floor(fr / 10) - 5) * 10;
                        return { q: `Two movers push a heavy box across the floor in the same direction. It slides at a steady speed. Friction on the box is ${fr} N. One mover pushes with ${a} N. How hard does the other mover push?`, ans: CA.num(fr - a, 'N'), sol: R`Steady speed means the pushes balance friction: \(${a} + x = ${fr}\), so \(x = ${fr - a}\) N.` };
                    }
                    if (k === 4) {
                        const wind = rng.int(5, 30) * 10, drag = rng.int(20, 80) * 10;
                        return { q: `A motorboat moves in a straight line at a steady speed. Its engine pushes it forward with ${wind + drag} N. A wind pushes it backward with ${wind} N. What is the drag force of the water on the boat?`, ans: CA.num(drag, 'N'), sol: R`Balanced forces: \(${wind + drag} = ${wind} + \text{drag}\), so drag \(= ${drag}\) N.` };
                    }
                    if (k === 5) {
                        const w = rng.int(6, 40) * 20;
                        return { q: `A shop sign weighing ${w} N hangs still from two vertical chains that pull up equally. What is the pull of each chain?`, ans: CA.num(w / 2, 'N'), sol: R`The sign is at rest, so the two pulls balance its weight: each chain pulls \(${w} \div 2 = ${w / 2}\) N.` };
                    }
                    if (k === 6) {
                        const A = mults(rng, 3, 100, 250, 10), d = rng.int(15, 25) * 10, x = sum(A) - d;
                        if (x < 100 || x > 400) return this.gen(rng);
                        return { q: `In a tug of war the rope does not move. Team A has three pullers: ${A[0]} N, ${A[1]} N and ${A[2]} N. Team B has two pullers; one pulls with ${d} N. How hard does the other Team B puller pull?`, ans: CA.num(x, 'N'), sol: R`The rope stays at rest, so the teams balance: \(${plusList(A)} = ${sum(A)}\) N, and \(${sum(A)} - ${d} = ${x}\) N.` };
                    }
                    const air = rng.int(4, 15) * 5, fr = rng.int(2, 6) * 5;
                    return { q: `A cyclist rides along a straight, flat road at a steady speed, pedalling with a forward force of ${air + fr} N. Friction on the tyres is ${fr} N. What is the air resistance on the cyclist?`, ans: CA.num(air, 'N'), sol: R`Steady speed, so the forces balance: \(${air + fr} - ${fr} = ${air}\) N.` };
                },
            },
            {
                id: 'balanced-or-not', name: 'Balanced or unbalanced?', level: 2,
                gen(rng) {
                    const [bal, text, why] = rng.pick(SITUATIONS), still = /still|does not move/.test(text);
                    return {
                        q: `${text} Are the forces on it balanced or unbalanced?`,
                        ans: CA.mc(rng, SIT_CHOICES[bal ? 0 : 1], SIT_CHOICES, { keepOrder: true }),
                        sol: why + (bal ? (still ? ' Balanced forces keep an object at rest.' : ' Balanced forces do not mean "not moving" — a moving object needs no net force to keep moving.') : ' A change in motion always needs an unbalanced force.'),
                    };
                },
            },
            {
                id: 'everyday', name: 'Inertia in everyday life', level: 2,
                gen(rng) { return fromBank(rng, EVERYDAY); },
            },
            {
                id: 'inertia-mass', name: 'More mass, more inertia', level: 2,
                gen(rng) {
                    const k = rng.int(0, 2);
                    const mass = t => { const [, lo, hi] = t; if (hi >= 1000) return rng.int(lo / 100, hi / 100) * 100; if (hi >= 10) return rng.int(lo, hi); return lo === hi ? lo : rng.int(lo * 10, hi * 10) / 10; };
                    if (k === 0) {
                        let a, b; do { [a, b] = rng.sample(THINGS, 2); } while (a[2] >= b[1] && b[2] >= a[1]);
                        const ma = mass(a), mb = mass(b), [heavy, light] = ma > mb ? [a[0], b[0]] : [b[0], a[0]];
                        const [mh, ml] = [Math.max(ma, mb), Math.min(ma, mb)];
                        const vl = rng.int(8, 20), vh = rng.int(1, vl - 3);
                        return {
                            q: `${art(ml)} ${ml} kg ${light} moves at ${vl} m/s. ${art(mh)} ${mh} kg ${heavy} moves at ${vh} m/s. Which has more inertia?`,
                            ans: CA.mc(rng, `The ${heavy}`, [`The ${light} — it is faster`, 'The same — both are moving', 'Neither — only still things have it']),
                            sol: R`Inertia depends on mass, not speed. The ${heavy} has more mass (${mh} kg > ${ml} kg), so it has more inertia.`,
                        };
                    }
                    if (k === 1) {
                        const pairs = [['empty shopping cart', 'full shopping cart', 12, 3, 5], ['small car', 'loaded truck', 1000, 6, 12], ['child', 'adult', 30, 2, 3], ['soccer ball', 'medicine ball', 0.5, 6, 10], ['empty wheelbarrow', 'wheelbarrow full of bricks', 15, 4, 8], ['canoe', 'motorboat', 30, 10, 20]];
                        const [s, h, m0, r0, r1] = rng.pick(pairs), r = rng.int(r0, r1), ms = m0, mh = CA.round(m0 * r, 2);
                        return {
                            q: `${art(s)} ${s} has a mass of ${ms} kg and ${art(h).toLowerCase()} ${h} has a mass of ${mh} kg. Mass is a measure of inertia. How many times as much inertia does the ${h} have?`,
                            ans: CA.num(r),
                            sol: R`Inertia is proportional to mass: \(${mh} \div ${ms} = ${r}\). The ${h} has ${r} times as much inertia, so it is ${r} times as hard to start or stop.`,
                        };
                    }
                    let tri; do { tri = rng.sample(THINGS, 3); } while (!(tri.every((t, i) => tri.every((u, j) => i === j || t[2] < u[1] || u[2] < t[1]))));
                    const ms = tri.map(mass), order = [0, 1, 2].sort((i, j) => ms[j] - ms[i]);
                    const L3 = ['P', 'Q', 'R'], name = i => `${L3[i]}: a ${tri[i][0]} of ${ms[i]} kg`;
                    const lst = o => o.map(i => L3[i]).join(', ');
                    const a = lst(order), w = [lst([...order].reverse()), lst([order[1], order[0], order[2]]), lst([order[0], order[2], order[1]])];
                    return {
                        q: `Put these in order from MOST inertia to LEAST inertia. ${name(0)}; ${name(1)}; ${name(2)}.`,
                        ans: CA.mc(rng, a, w),
                        sol: `More mass means more inertia, so order by mass: ${order.map(i => `${L3[i]} (${ms[i]} kg)`).join(' > ')}.`,
                    };
                },
            },
            // ── Level 3 ──
            {
                id: 'fbd-net', name: 'Free-body diagrams: net force', level: 3,
                gen(rng) {
                    if (rng.bool(0.5)) {
                        // vertical forces balance, horizontal do not
                        const obj = rng.pick(['crate', 'box', 'sled', 'cart', 'desk']);
                        const W = rng.int(8, 20) * 10, [a, b] = mults(rng, 2, 20, 140);
                        return {
                            q: `The diagram shows all the forces on a ${obj}. What is the size of the net force on it?`,
                            fig: forceFig(obj, { up: forces([W]), down: forces([W]), right: forces([a]), left: forces([b]) }),
                            ans: CA.num(Math.abs(a - b), 'N'),
                            sol: R`Up and down: \(${W} - ${W} = 0\), balanced. Left and right: \(${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}\) N to the ${a > b ? 'right' : 'left'}. So the net force is ${Math.abs(a - b)} N.`,
                        };
                    }
                    // both directions unbalanced: Pythagoras
                    const [p, q0] = rng.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [9, 12], [12, 9]]), k = rng.pick([5, 10]);
                    const h = p * k, v = q0 * k, r = Math.hypot(h, v);
                    if (h > 120 || v > 120) return this.gen(rng);
                    const left = rng.int(1, 8) * 10, down = rng.int(5, 20) * 10, upNet = rng.bool(0.7);
                    const right = left + h, up = upNet ? down + v : down - v;
                    if (up < 10) return this.gen(rng);
                    const obj = rng.pick(['drone', 'balloon', 'glider']);
                    return {
                        q: `Four forces act on a ${obj}, as shown. Find the size of the net force on it.`,
                        fig: forceFig(obj, rng.bool() ? { up: forces([up]), down: forces([down]), right: forces([right]), left: forces([left]) } : { up: forces([up]), down: forces([down]), left: forces([right]), right: forces([left]) }),
                        ans: CA.num(r, 'N'),
                        sol: R`Horizontal: \(${right} - ${left} = ${h}\) N. Vertical: \(${Math.max(up, down)} - ${Math.min(up, down)} = ${v}\) N ${upNet ? 'up' : 'down'}. These are at right angles, so use Pythagoras: \(\sqrt{${h}^2 + ${v}^2} = \sqrt{${h * h + v * v}} = ${r}\) N.`,
                    };
                },
            },
            {
                id: 'fbd-missing', name: 'Free-body diagrams: missing forces', level: 3,
                gen(rng) {
                    const kind = rng.int(0, 2);
                    if (kind === 0) {
                        // sled with a rider pulled at constant velocity; ask friction or the ground's push
                        const sled = rng.int(4, 10) * 10, rider = rng.int(20, 35) * 10, pull = rng.int(8, 15) * 10, push = rng.int(2, 6) * 10;
                        const fr = pull + push, N = sled + rider, askN = rng.bool();
                        return {
                            q: `A sled carrying a rider is pulled by a rope and pushed by a friend, and moves at a constant velocity. The sled weighs ${sled} N and the rider weighs ${rider} N. Find the ${askN ? 'upward push P of the ground' : 'friction force f'}.`,
                            fig: forceFig('sled', { right: forces([pull, push]), left: [{ v: fr, label: askN ? `${fr} N` : 'f = ?' }], down: forces([sled, rider]), up: [{ v: N, label: askN ? 'P = ?' : `${N} N` }] }),
                            ans: CA.num(askN ? N : fr, 'N'),
                            sol: askN ? R`Constant velocity, so up = down: \(P = ${sled} + ${rider} = ${N}\) N.` : R`Constant velocity, so left = right: \(f = ${pull} + ${push} = ${fr}\) N.`,
                        };
                    }
                    if (kind === 1) {
                        // crate at rest: someone pulls up on it but it doesn't lift; push sideways balanced by friction
                        const W = rng.int(20, 40) * 10, lift = rng.int(3, 12) * 10, push = rng.int(5, 15) * 10, askN = rng.bool(0.6);
                        const N = W - lift;
                        return {
                            q: `A crate weighing ${W} N rests on the floor. A rope pulls it up with ${lift} N and a person pushes it sideways with ${push} N, but it does not move. Find the ${askN ? 'upward push P of the floor' : 'friction force f'}.`,
                            fig: forceFig('crate', { up: [{ v: lift }, { v: N, label: askN ? 'P = ?' : `${N} N` }], down: forces([W]), right: forces([push]), left: [{ v: push, label: askN ? `${push} N` : 'f = ?' }] }),
                            ans: CA.num(askN ? N : push, 'N'),
                            sol: askN ? R`At rest, so up = down: \(P + ${lift} = ${W}\), so \(P = ${W} - ${lift} = ${N}\) N.` : R`At rest, so the sideways forces balance: friction equals the push, \(f = ${push}\) N.`,
                        };
                    }
                    // drone flying level at constant velocity, two rotor lifts, carrying a package
                    const body = rng.int(4, 9) * 10, pack = rng.int(2, 8) * 10, thrust = rng.int(3, 9) * 10, wind = rng.int(1, 5) * 10;
                    if (wind >= thrust) return this.gen(rng);
                    const lift = body + pack, drag = thrust - wind, askLift = rng.bool();
                    return {
                        q: `A drone carrying a package flies level at a constant velocity. The drone weighs ${body} N and the package ${pack} N. A wind pushes it backward with ${wind} N. Find ${askLift ? 'the lift L' : 'the air resistance A'}.`,
                        fig: forceFig('drone', { right: forces([thrust]), left: [{ v: wind }, { v: drag, label: askLift ? `${drag} N` : 'A = ?' }], down: forces([body, pack]), up: [{ v: lift, label: askLift ? 'L = ?' : `${lift} N` }] }),
                        ans: CA.num(askLift ? lift : drag, 'N'),
                        sol: askLift ? R`Constant velocity, so up = down: \(L = ${body} + ${pack} = ${lift}\) N.` : R`Constant velocity, so forward = backward: \(${thrust} = ${wind} + A\), so \(A = ${drag}\) N.`,
                    };
                },
            },
            {
                id: 'reasoning', name: 'Thinking it through: space, ice and buses', level: 3,
                gen(rng) { return fromBank(rng, REASONING); },
            },
        ],

        assignment: [
            ['net-two', 4], ['net-words', 3], ['what-next', 4], ['basics', 4],
            ['net-many', 4], ['missing-force', 4], ['steady-words', 4], ['balanced-or-not', 4], ['everyday', 4], ['inertia-mass', 3],
            ['fbd-net', 4], ['fbd-missing', 3], ['reasoning', 5],
        ],
    });
})();
