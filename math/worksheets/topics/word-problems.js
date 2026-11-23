/* Worksheet: Word Problems — turning stories into + − × ÷, money, two-step problems. */
(function () {
    'use strict';
    const R = String.raw;

    const NAMES = ['Maya', 'Liam', 'Sofia', 'Noah', 'Ava', 'Ethan', 'Mia', 'Lucas', 'Zara', 'Kai', 'Priya', 'Omar', 'Lily', 'Ben'];
    const ITEMS = [['apple', 'apples'], ['sticker', 'stickers'], ['marble', 'marbles'], ['pencil', 'pencils'], ['cookie', 'cookies'],
        ['card', 'cards'], ['book', 'books'], ['shell', 'shells'], ['stamp', 'stamps'], ['bead', 'beads']];
    const BOXES = [['box', 'boxes'], ['bag', 'bags'], ['basket', 'baskets'], ['jar', 'jars'], ['tray', 'trays']];
    /** Two different names. */
    const two = rng => { const [a, b] = rng.sample(NAMES, 2); return [a, b]; };
    /** Things to buy, with a sensible whole-dollar price range. */
    const SHOP = [[['notebook', 'notebooks'], 2, 5], [['pen', 'pens'], 1, 3], [['comic', 'comics'], 3, 8], [['toy car', 'toy cars'], 3, 9],
        [['ball', 'balls'], 4, 12], [['puzzle', 'puzzles'], 6, 15], [['sticker pack', 'sticker packs'], 1, 4], [['plant', 'plants'], 4, 10]];
    const money = x => (Number.isInteger(x) ? `$${x}` : `$${x.toFixed(2)}`);
    const mtex = x => (Number.isInteger(x) ? String(x) : x.toFixed(2));
    const cents = x => Math.round(x * 100) / 100;

    CA.register({
        id: 'word-problems',
        title: 'Word Problems',
        page: 'word-problems.html',
        assignmentNote: 'Read each story carefully, decide which operation(s) to use, write a number sentence and solve it. Give the unit with your answer.',

        practice: [
            // ── Part A ──────────────────────────────────────────────────
            {
                id: 'add-sub', name: 'Add or subtract', level: 1,
                gen(rng) {
                    const [n, o] = two(rng), it = rng.pick(ITEMS), kind = rng.int(0, 4);
                    if (kind === 0) {
                        const a = rng.int(8, 60), b = rng.int(5, 40);
                        return { q: `${n} has ${a} ${it[1]} and gets ${b} more. How many ${it[1]} does ${n} have now?`, ans: CA.num(a + b, it[1]), sol: R`"More" means add: \(${a} + ${b} = ${a + b}\) ${it[1]}.` };
                    }
                    if (kind === 1) {
                        const a = rng.int(20, 90), b = rng.int(5, a - 3);
                        return { q: `${n} had ${a} ${it[1]} and gave away ${b}. How many ${it[1]} are left?`, ans: CA.num(a - b, it[1]), sol: R`"Gave away … left" means subtract: \(${a} - ${b} = ${a - b}\) ${it[1]}.` };
                    }
                    if (kind === 2) {
                        const a = rng.int(25, 90), b = rng.int(8, a - 5);
                        return { q: `${n} has ${a} ${it[1]}. ${o} has ${b} ${it[1]}. How many more ${it[1]} does ${n} have than ${o}?`, ans: CA.num(a - b, it[1]), sol: R`"How many more" is the difference: \(${a} - ${b} = ${a - b}\) ${it[1]}.` };
                    }
                    if (kind === 3) {
                        const a = rng.int(120, 480), b = rng.int(60, 300);
                        return { q: `A library lent out ${a} books on Saturday and ${b} books on Sunday. How many books did it lend out altogether?`, ans: CA.num(a + b, 'books'), sol: R`"Altogether" means add: \(${a} + ${b} = ${a + b}\) books.` };
                    }
                    const total = rng.int(30, 300), seated = rng.int(10, total - 5);
                    return { q: `A school hall has ${total} chairs. ${seated} of them are taken. How many chairs are still empty?`, ans: CA.num(total - seated, 'chairs'), sol: R`Subtract the taken chairs: \(${total} - ${seated} = ${total - seated}\) chairs.` };
                },
            },
            {
                id: 'multiply', name: 'Multiply', level: 1,
                gen(rng) {
                    const it = rng.pick(ITEMS), c = rng.pick(BOXES), kind = rng.int(0, 3);
                    if (kind === 0) {
                        const g = rng.int(3, 9), e = rng.int(3, 12);
                        return { q: `There are ${g} ${c[1]} with ${e} ${it[1]} in each ${c[0]}. How many ${it[1]} are there in total?`, ans: CA.num(g * e, it[1]), sol: R`"In each … in total" means multiply: \(${g} \times ${e} = ${g * e}\) ${it[1]}.` };
                    }
                    if (kind === 1) {
                        const r = rng.int(4, 15), s = rng.int(6, 12);
                        return { q: `Chairs are set out in ${r} rows with ${s} chairs in each row. How many chairs are there?`, ans: CA.num(r * s, 'chairs'), sol: R`\(${r} \times ${s} = ${r * s}\) chairs.` };
                    }
                    if (kind === 2) {
                        const [animal, legs] = rng.pick([['spiders', 8], ['dogs', 4], ['ants', 6], ['ducks', 2], ['octopuses', 8], ['beetles', 6]]), k = rng.int(4, 15);
                        return { q: `How many legs do ${k} ${animal} have altogether?`, ans: CA.num(k * legs, 'legs'), sol: R`Each has ${legs} legs: \(${k} \times ${legs} = ${k * legs}\) legs.` };
                    }
                    const n = rng.pick(NAMES), p = rng.int(5, 25), w = rng.int(2, 4);
                    return { q: `${n} reads ${p} pages every day. How many pages does ${n} read in ${w} weeks?`, ans: CA.num(p * 7 * w, 'pages'), sol: R`${w} weeks is \(${w} \times 7 = ${7 * w}\) days, so \(${p} \times ${7 * w} = ${p * 7 * w}\) pages.` };
                },
            },
            {
                id: 'divide', name: 'Divide', level: 1,
                gen(rng) {
                    const n = rng.pick(NAMES), it = rng.pick(ITEMS), c = rng.pick(BOXES), kind = rng.int(0, 3);
                    if (kind === 0) {
                        const e = rng.int(3, 12), g = rng.int(3, 9);
                        return { q: `${n} shares ${e * g} ${it[1]} equally among ${g} ${c[1]}. How many ${it[1]} go in each ${c[0]}?`, ans: CA.num(e, it[1]), sol: R`"Shares equally" means divide: \(${e * g} \div ${g} = ${e}\) ${it[1]}.` };
                    }
                    if (kind === 1) {
                        const e = rng.pick([4, 6, 8, 10, 12]), g = rng.int(3, 12);
                        return { q: `Eggs are packed in boxes of ${e}. How many boxes are needed for ${e * g} eggs?`, ans: CA.num(g, 'boxes'), sol: R`\(${e * g} \div ${e} = ${g}\) boxes.` };
                    }
                    if (kind === 2) {
                        const k = rng.int(3, 8), each = rng.int(4, 12);
                        return { q: `${k} friends share a prize of $${k * each} equally. How much does each friend get?`, ans: CA.num(each, '$'), sol: R`\(${k * each} \div ${k} = ${each}\), so ${money(each)} each.` };
                    }
                    const t = rng.int(3, 8), per = rng.pick([4, 5, 6]);
                    return { q: `A class of ${t * per} students is split into teams of ${per}. How many teams are there?`, ans: CA.num(t, 'teams'), sol: R`\(${t * per} \div ${per} = ${t}\) teams.` };
                },
            },
            {
                id: 'money', name: 'Money', level: 1,
                gen(rng) {
                    const n = rng.pick(NAMES), [it, lo, hi] = rng.pick(SHOP), kind = rng.int(0, 2);
                    if (kind === 0) {
                        const p = rng.int(lo, hi), q = rng.int(2, 8);
                        return { q: `Each ${it[0]} costs $${p}. ${n} buys ${q} ${it[1]}. What is the total cost?`, ans: CA.num(p * q, '$'), sol: R`Cost = price × quantity: \(${p} \times ${q} = ${p * q}\), so ${money(p * q)}.` };
                    }
                    if (kind === 1) {
                        const [a, b] = rng.sample(['a T-shirt', 'a cap', 'a book', 'a ball', 'a puzzle', 'a kite', 'a lunchbox'], 2), x = rng.int(5, 30), y = rng.int(3, 25);
                        return { q: `${n} buys ${a} for $${x} and ${b} for $${y}. How much does ${n} spend altogether?`, ans: CA.num(x + y, '$'), sol: R`\(${x} + ${y} = ${x + y}\), so ${money(x + y)}.` };
                    }
                    const have = rng.int(20, 80), spend = rng.int(5, have - 3);
                    return { q: `${n} has $${have} and spends $${spend} at the fair. How much money is left?`, ans: CA.num(have - spend, '$'), sol: R`\(${have} - ${spend} = ${have - spend}\), so ${money(have - spend)} is left.` };
                },
            },

            // ── Part B ──────────────────────────────────────────────────
            {
                id: 'change', name: 'Change from a purchase', level: 2,
                gen(rng) {
                    const n = rng.pick(NAMES), [it, lo, hi] = rng.pick(SHOP), kind = rng.int(0, 2);
                    if (kind === 0) {
                        const p = rng.int(lo, hi), q = rng.int(2, 6), notes = [10, 20, 50, 100].filter(x => x > p * q);
                        const paid = notes[rng.bool(0.75) ? 0 : Math.min(1, notes.length - 1)];
                        return { q: `${n} buys ${q} ${it[1]} at $${p} each and pays with a $${paid} note. How much change does ${n} get?`, ans: CA.num(paid - p * q, '$'), sol: R`Cost: \(${q} \times ${p} = ${p * q}\). Change: \(${paid} - ${p * q} = ${paid - p * q}\), so ${money(paid - p * q)}.` };
                    }
                    if (kind === 1) {
                        const p = rng.int(3, 8) + rng.pick([0.25, 0.5, 0.75]), q = rng.int(2, 4), cost = cents(p * q);
                        const paid = cost < 10 ? 10 : cost < 20 ? 20 : 50;
                        return { q: `A sandwich costs ${money(p)}. ${n} buys ${q} sandwiches and pays with $${paid}. How much change is given?`, ans: CA.num(cents(paid - cost), '$'), sol: R`Cost: \(${q} \times ${mtex(p)} = ${mtex(cost)}\). Change: \(${paid} - ${mtex(cost)} = ${mtex(cents(paid - cost))}\).` };
                    }
                    const a = rng.int(3, 8), b = rng.int(2, 6), qa = rng.int(2, 5), paid = a * qa + b < 20 ? 20 : 50;
                    const cost = a * qa + b;
                    return { q: `${n} buys ${qa} notebooks at $${a} each and one pen for $${b}. ${n} pays with a $${paid} note. How much change does ${n} get?`, ans: CA.num(paid - cost, '$'), sol: R`Cost: \(${qa} \times ${a} + ${b} = ${cost}\). Change: \(${paid} - ${cost} = ${paid - cost}\), so ${money(paid - cost)}.` };
                },
            },
            {
                id: 'two-step', name: 'Two-step add and subtract', level: 2,
                gen(rng) {
                    const [n, o] = two(rng), it = rng.pick(ITEMS), kind = rng.int(0, 3);
                    if (kind === 0) {
                        const a = rng.int(15, 60), b = rng.int(5, 30), c = rng.int(5, a + b - 5);
                        return { q: `${n} had ${a} ${it[1]}, bought ${b} more, then gave ${c} to ${o}. How many ${it[1]} does ${n} have now?`, ans: CA.num(a + b - c, it[1]), sol: R`\(${a} + ${b} = ${a + b}\), then \(${a + b} - ${c} = ${a + b - c}\) ${it[1]}.` };
                    }
                    if (kind === 1) {
                        const s = rng.int(150, 400), on = rng.int(10, 40), off = rng.int(10, 40);
                        return { q: `A train has ${s} passengers. At the next station ${off} people get off and ${on} get on. How many passengers are on the train now?`, ans: CA.num(s - off + on, 'passengers'), sol: R`\(${s} - ${off} + ${on} = ${s - off + on}\) passengers.` };
                    }
                    if (kind === 2) {
                        const a = rng.int(12, 40), more = rng.int(4, 15);
                        return { q: `${n} has ${a} ${it[1]}. ${o} has ${more} more than ${n}. How many ${it[1]} do they have altogether?`, ans: CA.num(2 * a + more, it[1]), sol: R`${o}: \(${a} + ${more} = ${a + more}\). Together: \(${a} + ${a + more} = ${2 * a + more}\) ${it[1]}.` };
                    }
                    const total = rng.int(60, 150), red = rng.int(10, 40), blue = rng.int(10, total - red - 10);
                    return { q: `A bag holds ${total} beads. ${red} are red, ${blue} are blue and the rest are green. How many beads are green?`, ans: CA.num(total - red - blue, 'beads'), sol: R`\(${total} - ${red} - ${blue} = ${total - red - blue}\) green beads.` };
                },
            },
            {
                id: 'remainders', name: 'What to do with a remainder', level: 2,
                gen(rng) {
                    const kind = rng.int(0, 3);
                    let size, groups, extra;
                    do { size = rng.pick([4, 5, 6, 8, 10, 12, 15, 30, 40, 45]); groups = rng.int(2, 9); extra = rng.int(1, size - 1); } while (size * groups + extra > 400);
                    const total = size * groups + extra;
                    if (kind === 0) return { q: `${total} students are going on a trip. Each bus holds ${size} students. How many buses are needed?`, ans: CA.num(groups + 1, 'buses'), sol: R`\(${total} \div ${size} = ${groups}\) remainder ${extra}. The ${extra} left over still need a bus, so ${groups + 1} buses.` };
                    if (kind === 1) return { q: `A baker has ${total} muffins and packs them in boxes of ${size}. How many boxes can be filled completely?`, ans: CA.num(groups, 'boxes'), sol: R`\(${total} \div ${size} = ${groups}\) remainder ${extra}. Only ${groups} boxes are full.` };
                    if (kind === 2) return { q: `${total} stickers are shared equally among ${size} children, giving each child as many as possible. How many stickers are left over?`, ans: CA.num(extra, 'stickers'), sol: R`\(${total} \div ${size} = ${groups}\) remainder ${extra}, so ${extra} are left over.` };
                    return { q: `A ribbon is ${total} cm long. How many pieces ${size} cm long can be cut from it?`, ans: CA.num(groups, 'pieces'), sol: R`\(${total} \div ${size} = ${groups}\) remainder ${extra}. The ${extra} cm left is too short, so ${groups} pieces.` };
                },
            },
            {
                id: 'times-as-many', name: 'Times as many', level: 2,
                gen(rng) {
                    const [n, o] = two(rng), it = rng.pick(ITEMS), k = rng.int(2, 6), b = rng.int(4, 20), kind = rng.int(0, 3);
                    const times = k === 2 ? 'twice' : `${k} times`;
                    if (kind === 0) return { q: `${o} has ${b} ${it[1]}. ${n} has ${times} as many. How many ${it[1]} does ${n} have?`, ans: CA.num(k * b, it[1]), sol: R`\(${k} \times ${b} = ${k * b}\) ${it[1]}.` };
                    if (kind === 1) return { q: `${n} has ${k * b} ${it[1]}, which is ${times} as many as ${o}. How many ${it[1]} does ${o} have?`, ans: CA.num(b, it[1]), sol: R`Divide: \(${k * b} \div ${k} = ${b}\) ${it[1]}.` };
                    if (kind === 2) return { q: `${o} has ${b} ${it[1]} and ${n} has ${times} as many. How many ${it[1]} do they have altogether?`, ans: CA.num((k + 1) * b, it[1]), sol: R`${n}: \(${k} \times ${b} = ${k * b}\). Together: \(${k * b} + ${b} = ${(k + 1) * b}\) ${it[1]}.` };
                    return { q: `A tree is ${b} m tall. A tower is ${times} as tall as the tree. How much taller is the tower than the tree?`, ans: CA.num((k - 1) * b, 'm'), sol: R`Tower: \(${k} \times ${b} = ${k * b}\) m. Difference: \(${k * b} - ${b} = ${(k - 1) * b}\) m.` };
                },
            },
            {
                id: 'rates', name: 'Rates and time', level: 2,
                gen(rng) {
                    const n = rng.pick(NAMES), kind = rng.int(0, 4);
                    if (kind === 0) {
                        const r = rng.pick([40, 45, 50, 60, 65, 70, 80, 90]), h = rng.int(2, 6);
                        return { q: `A car travels at ${r} km per hour. How far does it go in ${h} hours?`, ans: CA.num(r * h, 'km'), sol: R`Distance = speed × time: \(${r} \times ${h} = ${r * h}\) km.` };
                    }
                    if (kind === 1) {
                        const r = rng.int(8, 16), h = rng.int(3, 9);
                        return { q: `${n} earns $${r} per hour babysitting. How much does ${n} earn in ${h} hours?`, ans: CA.num(r * h, '$'), sol: R`\(${r} \times ${h} = ${r * h}\), so ${money(r * h)}.` };
                    }
                    if (kind === 2) {
                        const mins = rng.pick([15, 20, 25, 30, 35, 40, 45]), d = rng.int(4, 7);
                        return { q: `${n} practises the violin for ${mins} minutes a day for ${d} days. How many minutes is that in total?`, ans: CA.num(mins * d, 'minutes'), sol: R`\(${mins} \times ${d} = ${mins * d}\) minutes.` };
                    }
                    if (kind === 3) {
                        const per = rng.int(12, 30), mins = rng.int(3, 9);
                        return { q: `A printer prints ${per} pages a minute. How long does it take to print ${per * mins} pages?`, ans: CA.num(mins, 'minutes'), sol: R`\(${per * mins} \div ${per} = ${mins}\) minutes.` };
                    }
                    const start = rng.int(7, 10), sm = rng.pick([0, 15, 30, 45]), dur = rng.pick([35, 50, 75, 90, 105, 120, 135]);
                    const end = start * 60 + sm + dur, eh = Math.floor(end / 60), em = end % 60;
                    if (end >= 12 * 60) return this.gen(rng);
                    return { q: `A film starts at ${start}:${String(sm).padStart(2, '0')} and ends at ${eh}:${String(em).padStart(2, '0')} in the morning. How many minutes long is it?`, ans: CA.num(dur, 'minutes'), sol: R`From ${start}:${String(sm).padStart(2, '0')} to ${eh}:${String(em).padStart(2, '0')} is ${dur < 60 ? '' : `${Math.floor(dur / 60)} h ${dur % 60} min = `}${dur} minutes.` };
                },
            },
            {
                id: 'average', name: 'Average (fair share)', level: 2,
                gen(rng) {
                    const n = rng.pick(NAMES), k = rng.int(3, 5), kind = rng.int(0, 2);
                    let vals, mean;
                    do { mean = rng.int(kind === 2 ? 15 : 10, kind === 2 ? 35 : 30); vals = Array.from({ length: k }, () => mean + rng.int(-6, 6)); } while (vals.reduce((a, b) => a + b, 0) % k !== 0 || new Set(vals).size < 3 || Math.max(...vals) - Math.min(...vals) < 6);
                    const sum = vals.reduce((a, b) => a + b, 0), avg = sum / k;
                    const list = vals.slice(0, -1).join(', ') + ' and ' + vals[k - 1];
                    const q = kind === 0 ? `${n} scored ${list} points in ${k} basketball games. What was the average number of points per game?`
                        : kind === 1 ? `${k} children collected ${list} shells. They put them together and share them equally. How many shells does each child get?`
                            : `The temperature at noon on ${k} days was ${list} °C. What was the average noon temperature?`;
                    const unit = kind === 0 ? 'points' : kind === 1 ? 'shells' : '°C';
                    return { q, ans: CA.num(avg, unit), sol: R`Add them: \(${vals.join(' + ')} = ${sum}\). Share by ${k}: \(${sum} \div ${k} = ${avg}\) ${unit}.` };
                },
            },

            // ── Part C ──────────────────────────────────────────────────
            {
                id: 'budget', name: 'Shopping on a budget', level: 3,
                gen(rng) {
                    const n = rng.pick(NAMES), kind = rng.int(0, 3);
                    if (kind === 3) {                                           // family tickets, change
                        const ad = rng.int(9, 18), ch = rng.int(4, ad - 3), na = rng.int(1, 2), nc = rng.int(2, 4), cost = na * ad + nc * ch;
                        const paid = cost < 50 ? 50 : 100;
                        return { q: `Museum tickets cost $${ad} for an adult and $${ch} for a child. ${n}'s family buys tickets for ${na === 1 ? '1 adult' : `${na} adults`} and ${nc} children and pays with a $${paid} note. How much change do they get?`, ans: CA.num(paid - cost, '$'), sol: R`Cost: \(${na} \times ${ad} + ${nc} \times ${ch} = ${na * ad} + ${nc * ch} = ${cost}\). Change: \(${paid} - ${cost} = ${paid - cost}\).` };
                    }
                    if (kind === 0) {
                        const a = rng.int(2, 6), qa = rng.int(2, 5), b = rng.int(3, 9), qb = rng.int(2, 4), have = rng.pick([40, 50, 60, 80, 100]);
                        if (a * qa + b * qb >= have) return this.gen(rng);
                        return { q: `${n} has $${have}. ${n} buys ${qa} notebooks at $${a} each and ${qb} paint sets at $${b} each. How much money is left?`, ans: CA.num(have - a * qa - b * qb, '$'), sol: R`Spent: \(${qa} \times ${a} + ${qb} \times ${b} = ${a * qa} + ${b * qb} = ${a * qa + b * qb}\). Left: \(${have} - ${a * qa + b * qb} = ${have - a * qa - b * qb}\).` };
                    }
                    if (kind === 1) {
                        const entry = rng.int(5, 15), ride = rng.int(2, 6), have = rng.int(30, 60);
                        const rides = Math.floor((have - entry) / ride);
                        if (rides < 2) return this.gen(rng);
                        return { q: `Entry to a fair costs $${entry} and each ride costs $${ride}. ${n} has $${have}. What is the greatest number of rides ${n} can go on?`, ans: CA.num(rides, 'rides'), sol: R`After entry: \(${have} - ${entry} = ${have - entry}\). \(${have - entry} \div ${ride} = ${rides}\) remainder ${(have - entry) % ride}, so ${rides} rides.` };
                    }
                    const save = rng.int(4, 12), weeks = rng.int(3, 8), cost = save * weeks + rng.int(1, save - 1);
                    const need = Math.ceil(cost / save);
                    return { q: `${n} wants a game that costs $${cost} and saves $${save} every week. How many weeks will it take to save enough?`, ans: CA.num(need, 'weeks'), sol: R`\(${cost} \div ${save} = ${Math.floor(cost / save)}\) remainder ${cost % save}. After ${Math.floor(cost / save)} weeks there is not quite enough, so ${need} weeks.` };
                },
            },
            {
                id: 'parts', name: 'Halves, thirds and quarters', level: 3,
                gen(rng) {
                    const n = rng.pick(NAMES), kind = rng.int(0, 3);
                    if (kind === 3) {                                           // fraction of a class
                        const [a, b, words] = rng.pick([[2, 5, 'Two fifths'], [2, 3, 'Two thirds'], [3, 5, 'Three fifths'], [3, 8, 'Three eighths'], [5, 6, 'Five sixths'], [3, 4, 'Three quarters']]);
                        const one = rng.int(Math.ceil(12 / b), Math.floor(36 / b)), total = b * one;
                        return { q: `A class has ${total} students. ${words} of them are boys. How many girls are in the class?`, ans: CA.num(total - a * one, 'girls'), sol: R`One ${b === 3 ? 'third' : b === 4 ? 'quarter' : b === 5 ? 'fifth' : b === 6 ? 'sixth' : 'eighth'} of ${total} is ${one}, so there are \(${a} \times ${one} = ${a * one}\) boys and \(${total} - ${a * one} = ${total - a * one}\) girls.` };
                    }
                    if (kind === 0) {
                        const x = rng.int(3, 15), total = 6 * x;                // half eaten, then a third of the rest
                        return { q: `A bowl has ${total} strawberries. ${n} eats half of them, then a friend eats a third of what is left. How many strawberries remain?`, ans: CA.num(2 * x, 'strawberries'), sol: R`Half of ${total} is ${3 * x}, so ${3 * x} are left. A third of ${3 * x} is ${x}, so \(${3 * x} - ${x} = ${2 * x}\) remain.` };
                    }
                    if (kind === 1) {
                        const q = rng.int(3, 20), total = 4 * q, k = rng.pick([1, 3]);
                        return { q: `There are ${total} students in a year group. ${k === 1 ? 'A quarter' : 'Three quarters'} of them play a sport. How many students do <b>not</b> play a sport?`, ans: CA.num(total - k * q, 'students'), sol: R`A quarter of ${total} is ${q}. ${k === 1 ? '' : R`Three quarters is \(3 \times ${q} = ${3 * q}\). `}Not playing: \(${total} - ${k * q} = ${total - k * q}\).` };
                    }
                    const t = rng.int(4, 20), total = 3 * t, lunch = rng.int(3, Math.min(12, 2 * t - 1));
                    return { q: `${n} had $${total}, spent a third of it on a book and then $${lunch} on lunch. How much money is left?`, ans: CA.num(2 * t - lunch, '$'), sol: R`A third of ${total} is ${t}, leaving \(${total} - ${t} = ${2 * t}\). Then \(${2 * t} - ${lunch} = ${2 * t - lunch}\), so ${money(2 * t - lunch)}.` };
                },
            },
            {
                id: 'sum-difference', name: 'Bar-model puzzles', level: 3,
                gen(rng) {
                    const [n, o] = two(rng), it = rng.pick(ITEMS), kind = rng.int(0, 2);
                    if (kind === 0) {
                        const small = rng.int(8, 40), diff = rng.int(2, 20), big = small + diff;
                        return { q: `${n} and ${o} have ${small + big} ${it[1]} altogether. ${n} has ${diff} more than ${o}. How many ${it[1]} does ${o} have?`, ans: CA.num(small, it[1]), sol: R`Take away the extra: \(${small + big} - ${diff} = ${2 * small}\). That is two equal bars, so \(${2 * small} \div 2 = ${small}\).` };
                    }
                    if (kind === 1) {
                        const b = rng.int(5, 25), k = rng.int(2, 5), times = k === 2 ? 'twice' : `${k} times`;
                        return { q: `${n} has ${times} as many ${it[1]} as ${o}. Together they have ${(k + 1) * b}. How many ${it[1]} does ${n} have?`, ans: CA.num(k * b, it[1]), sol: R`${o} is 1 bar and ${n} is ${k} bars: ${k + 1} bars \(= ${(k + 1) * b}\), so one bar is ${b}. ${n} has \(${k} \times ${b} = ${k * b}\).` };
                    }
                    const child = rng.int(6, 14), gap = rng.int(22, 36), years = rng.int(2, 10);
                    return { q: `${n}'s mother is ${gap} years older than ${n}. In ${years} years their ages will add up to ${2 * (child + years) + gap}. How old is ${n} now?`, ans: CA.num(child, 'years'), sol: R`In ${years} years: \(${2 * (child + years) + gap} - ${gap} = ${2 * (child + years)}\), half is ${child + years}. Now ${n} is \(${child + years} - ${years} = ${child}\).` };
                },
            },
            {
                id: 'work-backwards', name: 'Work backwards', level: 3,
                gen(rng) {
                    const n = rng.pick(NAMES), kind = rng.int(0, 2);
                    if (kind === 0) {
                        const x = rng.int(3, 20), a = rng.int(2, 6), b = rng.int(1, 15);
                        return { q: `I think of a number, multiply it by ${a} and then add ${b}. The answer is ${a * x + b}. What was my number?`, ans: CA.num(x), sol: R`Undo the steps: \(${a * x + b} - ${b} = ${a * x}\), then \(${a * x} \div ${a} = ${x}\).` };
                    }
                    if (kind === 1) {
                        const left = rng.int(4, 20), after1 = 2 * left, spent1 = rng.int(5, 25), start = after1 + spent1;
                        return { q: `${n} spent $${spent1} on a book and then half of the money left on a jacket. Now ${n} has $${left}. How much did ${n} have at the start?`, ans: CA.num(start, '$'), sol: R`Before the jacket: \(${left} \times 2 = ${after1}\). Before the book: \(${after1} + ${spent1} = ${start}\), so ${money(start)}.` };
                    }
                    const end = rng.int(10, 60), got = rng.int(5, 30), gave = rng.int(5, 30), start = end - got + gave;
                    if (start <= gave) return this.gen(rng);
                    return { q: `${n} gave away ${gave} cards and then won ${got} cards in a game. Now ${n} has ${end} cards. How many cards did ${n} have to begin with?`, ans: CA.num(start, 'cards'), sol: R`Undo the steps: \(${end} - ${got} = ${end - got}\), then \(${end - got} + ${gave} = ${start}\) cards.` };
                },
            },
        ],

        assignment: [
            ['add-sub', 4], ['multiply', 4], ['divide', 4], ['money', 3],
            ['change', 4], ['two-step', 4], ['remainders', 4], ['times-as-many', 4], ['rates', 4], ['average', 3],
            ['budget', 3], ['parts', 3], ['sum-difference', 3], ['work-backwards', 3],
        ],
    });
})();
