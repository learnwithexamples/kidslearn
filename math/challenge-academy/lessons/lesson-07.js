/* Challenge Academy — Lesson 7: Understanding Benefits and Costs */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m;

    // ── Small helpers ────────────────────────────────────────────────────
    const usd = x => CA.num(x, '$'), pct = x => CA.num(x, '%');
    const D = x => R`\$${x}`;                                   // dollars inside maths
    const P = x => R`${x}\%`;                                   // percent inside maths
    const dec = p => String(p / 100);                           // 80 → "0.8", 125 → "1.25"
    /** Smallest step for a price so that taking each of these percentages gives whole dollars. */
    const unit = (...ps) => ps.reduce((u, p) => CA.lcm(u, 100 / CA.gcd(p, 100)), 1);
    /** A price that is a multiple of `u`, roughly between lo and hi. */
    const price = (rng, u, lo, hi) => u * rng.int(Math.max(1, Math.ceil(lo / u)), Math.max(1, Math.ceil(lo / u), Math.floor(hi / u)));
    const cap = s => s.replace(/^./, c => c.toUpperCase());
    const ITEMS = ['a jacket', 'a scooter', 'a backpack', 'a desk lamp', 'a guitar', 'a watch', 'a skateboard', 'a tent', 'a pair of boots',
        'a camera', 'a bicycle', 'a printer', 'a chess set', 'a telescope', 'a drone', 'a keyboard', 'a suitcase', 'a tennis racket'];
    const GOODS = ['mugs', 'caps', 'posters', 'notebooks', 'pot plants', 'kites', 'scarves', 'candles', 'water bottles', 'puzzles', 'key rings', 'T-shirts'];
    const SELLERS = ['A shop', 'A market stall', 'A dealer', 'A store', 'An online shop'];
    const outcome = (x, money) => (x === 0 ? 'no profit and no loss' : `a ${x > 0 ? 'profit' : 'loss'} of ${money ? '$' + Math.abs(x) : Math.abs(x) + '%'}`);

    /** A problem.  `chk` holds the givens for the independent checker outside the repo; it never reaches a page. */
    function mk(q, ans, sol, chk) {
        const o = { q, ans, sol };
        Object.defineProperty(o, 'chk', { value: chk });
        return o;
    }

    // ── Figure: price bars ───────────────────────────────────────────────
    /** rows: [label, value, text, colour]; all bars share one scale. */
    function bars(rows, opt = {}) {
        const max = Math.max(...rows.map(r => r[1])), W = opt.width || 250, L = 92, h = 22, gap = 12;
        let body = '';
        rows.forEach(([label, v, text, col], i) => {
            const y = 8 + i * (h + gap), w = v / max * W;
            body += F.text(L - 8, y + h / 2 + 4.5, label, { anchor: 'end' });
            body += F.rect(L, y, w, h, { fill: col || F.colors.FILL });
            body += F.text(L + w / 2, y + h / 2 + 4.5, text, { bold: true, size: 12 });
        });
        if (opt.mark != null) {
            const x = L + opt.mark / max * W;
            body += F.line(x, 2, x, 8 + rows.length * (h + gap) - gap + 6, { dash: true, width: 1, stroke: F.colors.ACCENT });
        }
        return F.svg(L + W + 12, 8 + rows.length * (h + gap), body, { label: 'price bars' });
    }

    // ── Building blocks: the practice list below uses these, sometimes one kind of question at a time ──
    const POOL = [
        // ── Level 1 ──────────────────────────────────────────────────
        {
            id: 'profit-basic', name: 'Cost, price and profit', level: 1,
            gen(rng) {
                const t = rng.int(0, 5), item = rng.pick(ITEMS), who = rng.pick(SELLERS);
                const c = 5 * rng.int(4, 60), p = rng.pick([5, 10, 15]) * rng.int(1, Math.max(1, Math.floor(c / 20)));
                if (t === 0) return mk(`${who} buys ${item} for $${c} and sells it for $${c + p}. How much profit does the seller make?`, usd(p),
                    R`Profit = price − cost: ${m(`${D(c + p)}-${D(c)}=${D(p)}`)}.`, { t: 'basic', c, s: c + p, want: 'profit' });
                if (t === 1) return mk(`${who} buys ${item} for $${c} but has to sell it for only $${c - p}. How much does the seller lose?`, usd(p),
                    R`Loss = cost − price: ${m(`${D(c)}-${D(c - p)}=${D(p)}`)}.`, { t: 'basic', c, s: c - p, want: 'loss' });
                if (t === 2) return mk(`${cap(item)} costs a shop $${c}. The shop wants to make a profit of $${p} on it. What should the price be?`, usd(c + p),
                    R`Price = cost + profit: ${m(`${D(c)}+${D(p)}=${D(c + p)}`)}.`, { t: 'basic', c, s: c + p, want: 's' });
                if (t === 3) return mk(`${who} sells ${item} for $${c + p} and makes a profit of $${p}. How much did the seller pay for it?`, usd(c),
                    R`Cost = price − profit: ${m(`${D(c + p)}-${D(p)}=${D(c)}`)}.`, { t: 'basic', c, s: c + p, want: 'c' });
                if (t === 4) return mk(`${who} sells ${item} for $${c - p}, which is a loss of $${p}. How much did the seller pay for it?`, usd(c),
                    R`Cost = price + loss: ${m(`${D(c - p)}+${D(p)}=${D(c)}`)}.`, { t: 'basic', c, s: c - p, want: 'c' });
                const n = rng.pick([10, 12, 20, 25, 30, 40, 50]), each = rng.int(2, 9), sell = each + rng.int(1, 6), goods = rng.pick(GOODS);
                return mk(`${who} buys ${n} ${goods} for $${n * each} altogether and sells them all for $${sell} each. What is the total profit?`, usd(n * sell - n * each),
                    R`Money received: ${m(R`${n}\times${D(sell)}=${D(n * sell)}`)}. Profit: ${m(`${D(n * sell)}-${D(n * each)}=${D(n * sell - n * each)}`)}.`, { t: 'bulk', n, total: n * each, bad: 0, p: sell });
            },
        },
        {
            id: 'profit-percentage', name: 'Profit percentage', level: 1,
            gen(rng) {
                const style = rng.int(0, 1), gain = rng.bool(0.7), r = gain ? rng.pick([10, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150]) : rng.pick([10, 20, 25, 30, 40, 50, 60]);
                const c = price(rng, unit(r), 20, 400), d = c * r / 100, s = gain ? c + d : c - d;
                const item = rng.pick(ITEMS), who = rng.pick(SELLERS);
                const q = gain
                    ? [`${who} buys ${item} for $${c} and sells it for $${s}. What is the profit percentage?`,
                        `${cap(item)} that cost $${c} is sold for $${s}. What is the profit percentage (profit as a percentage of the cost)?`][style]
                    : [`${who} buys ${item} for $${c} and sells it for $${s}. What is the loss percentage (the loss as a percentage of the cost)?`,
                        `${cap(item)} that cost $${c} is sold for only $${s}. What percentage of the cost is lost?`][style];
                return mk(q, pct(r), R`${gain ? 'Profit' : 'Loss'}: ${m(gain ? `${D(s)}-${D(c)}=${D(d)}` : `${D(c)}-${D(s)}=${D(d)}`)}. As a fraction of the cost: ${m(R`\frac{${d}}{${c}}=${P(r)}`)}.`,
                    { t: 'rate', c, s, gain });
            },
        },
        {
            id: 'new-price', name: 'Discounts: find the new price', level: 1,
            gen(rng) {
                const t = rng.int(0, 3), item = rng.pick(ITEMS);
                const d = rng.pick([10, 15, 20, 25, 30, 40, 50, 60, 70]), M = price(rng, unit(d), 40, 400), S = M * (100 - d) / 100;
                if (t === 0) return mk(`${cap(item)} has an original price of $${M}. It is on sale at ${d}% off. What is the new price?`, usd(S),
                    R`${d}% off means paying ${100 - d}%: ${m(R`${D(M)}\times${dec(100 - d)}=${D(S)}`)}.`, { t: 'disc', M, d, want: 'S' });
                if (t === 1) return mk(`${cap(item)} with an original price of $${M} is sold at ${100 - d}% of its original price. How much does the customer pay?`, usd(S),
                    R`${m(R`${D(M)}\times${dec(100 - d)}=${D(S)}`)}.`, { t: 'disc', M, d, want: 'S' });
                if (t === 2) return mk(`${cap(item)} has an original price of $${M}. In a sale it has a discount of ${d}%. How many dollars does a customer save?`, usd(M - S),
                    R`The saving is ${d}% of the original price: ${m(R`${D(M)}\times${dec(d)}=${D(M - S)}`)}.`, { t: 'disc', M, d, want: 'save' });
                const item2 = rng.pick(ITEMS.filter(x => x !== item)), M2 = price(rng, unit(d), 40, 300);
                return mk(`A sign says “Everything ${d}% off!”. Ravi buys ${item} with an original price of $${M} and ${item2} with an original price of $${M2}. How much does he pay altogether?`, usd((M + M2) * (100 - d) / 100),
                    R`The original prices total ${m(D(M + M2))}; he pays ${100 - d}% of that: ${m(R`${D(M + M2)}\times${dec(100 - d)}=${D((M + M2) * (100 - d) / 100)}`)}.`, { t: 'disc', M: M + M2, d, want: 'S' });
            },
        },
        {
            id: 'price-from-percentage', name: 'Price from a profit percentage', level: 1,
            gen(rng, kinds) {
                const t = kinds ? rng.pick(kinds) : rng.int(0, 2), r = t === 2 ? rng.pick([10, 15, 20, 25, 30, 40]) : rng.pick([10, 15, 20, 25, 30, 35, 40, 50, 60, 75, 80]);
                const c = price(rng, unit(r), 20, 400), d = c * r / 100, item = rng.pick(ITEMS), who = rng.pick(SELLERS);
                if (t === 0) return mk(`${who} buys ${item} for $${c} and wants a profit percentage of ${r}%. What should the price be?`, usd(c + d),
                    R`The price is ${100 + r}% of the cost: ${m(R`${D(c)}\times${dec(100 + r)}=${D(c + d)}`)}.`, { t: 'fromRate', c, r, want: 's' });
                if (t === 1) return mk(`${who} buys ${item} for $${c} and sells it at a profit percentage of ${r}%. How many dollars of profit is that?`, usd(d),
                    R`Profit = cost × profit percentage: ${m(R`${D(c)}\times${dec(r)}=${D(d)}`)}.`, { t: 'fromRate', c, r, want: 'p' });
                return mk(`${who} bought ${item} for $${c} but had to sell it at a loss of ${r}% of the cost. What was the price?`, usd(c - d),
                    R`The price is ${100 - r}% of the cost: ${m(R`${D(c)}\times${dec(100 - r)}=${D(c - d)}`)}.`, { t: 'fromRate', c, r: -r, want: 's' });
            },
        },

        // ── Level 2 ──────────────────────────────────────────────────
        {
            id: 'find-cost', name: 'Find the cost', level: 2,
            gen(rng, kinds) {
                const t = kinds ? rng.pick(kinds) : rng.int(0, 3), r = t === 1 ? rng.pick([10, 20, 25, 30, 40, 50]) : rng.pick([10, 20, 25, 30, 40, 50, 60, 75, 80, 150, ...(t === 0 ? [100] : [])]);
                const c = price(rng, unit(r), 20, 500), d = c * r / 100, item = rng.pick(ITEMS), who = rng.pick(SELLERS);
                if (t === 0) return mk(`${who} sells ${item} for $${c + d}, which gives a profit percentage of ${r}%. How much did the seller pay for it?`, usd(c),
                    R`The price is ${100 + r}% of the cost: ${m(R`\text{cost}=${D(c + d)}\div${dec(100 + r)}=${D(c)}`)}.`, { t: 'findCost', s: c + d, r, want: 'c' });
                if (t === 1) return mk(`${who} sells ${item} for $${c - d}, which is a loss of ${r}% of the cost. How much did the seller pay for it?`, usd(c),
                    R`The price is ${100 - r}% of the cost: ${m(R`\text{cost}=${D(c - d)}\div${dec(100 - r)}=${D(c)}`)}.`, { t: 'findCost', s: c - d, r: -r, want: 'c' });
                if (t === 3) return mk(`${who} makes a profit of $${d} on ${item}. The profit percentage is ${r}%. How much did the seller pay for it?`, usd(c),
                    R`Cost = profit ÷ profit percentage: ${m(R`${D(d)}\div${dec(r)}=${D(c)}`)}.`, { t: 'findCost', p: d, r, want: 'c' });
                return mk(`${who} makes a profit of $${d} on ${item}. This profit is ${r}% of the cost. What was the price?`, usd(c + d),
                    R`${m(R`\text{cost}=${D(d)}\div${dec(r)}=${D(c)}`)}, so the price was ${m(`${D(c)}+${D(d)}=${D(c + d)}`)}.`, { t: 'findCost', p: d, r, want: 's' });
            },
        },
        {
            id: 'discount-backwards', name: 'Original price and discount rate', level: 2,
            gen(rng, kinds) {
                const t = kinds ? rng.pick(kinds) : rng.int(0, 4), item = rng.pick(ITEMS);
                if (t <= 2) {
                    const d = rng.pick([10, 15, 20, 25, 30, 40, 50, 60]), M = price(rng, unit(d), 50, 500), S = M * (100 - d) / 100;
                    if (t === 0) return mk(`After a discount of ${d}%, ${item} costs $${S}. What was its original price?`, usd(M),
                        R`$${S} is ${100 - d}% of the original price: ${m(R`${D(S)}\div${dec(100 - d)}=${D(M)}`)}.`, { t: 'disc', S, d, want: 'M' });
                    if (t === 1) return mk(`The price of ${item} is reduced from $${M} to $${S}. What is the discount rate?`, pct(d),
                        R`The discount is ${m(`${D(M)}-${D(S)}=${D(M - S)}`)}; as a fraction of the original price, ${m(R`\frac{${M - S}}{${M}}=${P(d)}`)}.`, { t: 'disc', M, S, want: 'd' });
                    return mk(`In a sale, ${item} is ${d}% off, which saves the customer $${M - S}. What is the new price?`, usd(S),
                        R`$${M - S} is ${d}% of the original price, so the original price is ${m(R`${D(M - S)}\div${dec(d)}=${D(M)}`)}. New price: ${m(`${D(M)}-${D(M - S)}=${D(S)}`)}.`, { t: 'disc', save: M - S, d, want: 'S' });
                }
                const [d1, d2] = rng.pick([[20, 10], [10, 10], [20, 20], [30, 10], [40, 10], [25, 20], [50, 20], [50, 10], [30, 20], [50, 50], [40, 25], [20, 5], [50, 40], [40, 30]]);
                const single = 100 - (100 - d1) * (100 - d2) / 100;
                if (t === 3) {
                    const M = price(rng, 100, 100, 800), S = M * (100 - d1) * (100 - d2) / 10000;
                    return mk(`${cap(item)} has an original price of $${M}. Its price is reduced by ${d1}%, and later the new price is reduced by a further ${d2}%. What is the final price?`, usd(S),
                        R`${m(R`${D(M)}\times${dec(100 - d1)}\times${dec(100 - d2)}=${D(S)}`)}.`, { t: 'twoDisc', M, d1, d2, want: 'S' });
                }
                return mk(`A price is reduced by ${d1}%, and then the new price is reduced by a further ${d2}%. What single discount rate would give the same final price?`, pct(single),
                    R`${m(R`${dec(100 - d1)}\times${dec(100 - d2)}=${dec((100 - d1) * (100 - d2) / 100)}`)}: the final price is ${(100 - d1) * (100 - d2) / 100}% of the original, a single discount rate of ${m(P(single))} (not ${d1 + d2}%).`, { t: 'twoDisc', d1, d2, want: 'single' });
            },
        },
        {
            id: 'markup-discount', name: 'Price above cost, then a discount', level: 2,
            gen(rng) {
                const t = rng.int(0, 2), item = rng.pick(ITEMS), who = rng.pick(SELLERS);
                for (;;) {
                    const u = rng.pick([20, 25, 30, 40, 50, 60, 80, 100]), d = rng.pick([10, 20, 25, 30, 40, 50]);
                    const net = (100 + u) * (100 - d) / 100 - 100;
                    if (!Number.isInteger(net)) continue;
                    if (t === 2) {
                        if (u === d && rng.bool(0.5)) continue;
                        const lead = rng.pick([
                            `A shop sets the original price of all its goods ${u}% above cost, and then sells them with a discount of ${d}%.`,
                            `A trader sets original prices ${u}% above cost. In a sale, everything has a discount of ${d}%.`,
                        ]);
                        return mk(`${lead} Measured as a percentage of the cost, what is the result?`,
                            CA.mc(rng, outcome(net), [outcome(u - d), outcome(-net), outcome(0), outcome(d - u), outcome(net > 0 ? net + 5 : net - 5), outcome(2 * net)]),
                            R`${m(R`${dec(100 + u)}\times${dec(100 - d)}=${dec(100 + net)}`)}: the new price is ${100 + net}% of the cost — ${outcome(net)}.`, { t: 'chain', u, d, want: 'netMC' });
                    }
                    if (net <= 0) continue;
                    const c = price(rng, CA.lcm(unit(u), 100 / CA.gcd(100, (100 + u) * (100 - d) / CA.gcd((100 + u) * (100 - d), 100) % 100 || 100)), 40, 600);
                    const M = c * (100 + u) / 100, S = M * (100 - d) / 100;
                    if (!Number.isInteger(M) || !Number.isInteger(S)) continue;
                    const lead = `${who} buys ${item} for $${c}, sets its original price ${u}% above the cost, and then sells it with a discount of ${d}%.`;
                    const work = R`Original price: ${m(R`${D(c)}\times${dec(100 + u)}=${D(M)}`)}. New price: ${m(R`${D(M)}\times${dec(100 - d)}=${D(S)}`)}.`;
                    if (t === 0) return mk(`${lead} How much profit is made?`, usd(S - c), R`${work} Profit: ${m(`${D(S)}-${D(c)}=${D(S - c)}`)}.`, { t: 'chain', c, u, d, want: 'profit' });
                    return mk(`${lead} What is the profit percentage?`, pct(net), R`${work} Profit ${m(D(S - c))}, and ${m(R`\frac{${S - c}}{${c}}=${P(net)}`)}.`, { t: 'chain', c, u, d, want: 'net' });
                }
            },
        },
        {
            id: 'bulk-unsold', name: 'Broken and unsold stock', level: 2,
            gen(rng) {
                const t = rng.int(0, 2);
                const [goods, bad, lo, hi] = rng.pick([['boxes of eggs', 'are broken on the way', 2, 4], ['mugs', 'arrive broken', 2, 6], ['melons', 'go bad before they can be sold', 2, 5], ['T-shirts', 'are never sold', 4, 10],
                    ['magazines', 'are left unsold and thrown away', 2, 5], ['pot plants', 'die before they can be sold', 3, 8], ['glass vases', 'arrive cracked', 4, 12], ['cakes', 'are dropped on the floor', 4, 10], ['lamps', 'do not work and cannot be sold', 6, 12]]);
                const who = rng.pick(['A shop', 'A market stall', 'A school fair', 'A café', 'A trader']);
                for (;;) {
                    const n = rng.pick([40, 50, 60, 80, 100, 120, 150, 200]), c = rng.int(lo, hi), f = rng.pick([5, 10, 20, 25]);
                    const k = n * f / 100, p = c + rng.int(1, Math.max(2, Math.ceil(c * 0.75)));
                    if (!Number.isInteger(k)) continue;
                    const cost = n * c, rev = (n - k) * p, profit = rev - cost;
                    if (profit <= 0) continue;
                    const lost = rng.bool() ? `${k} of them` : `${f}% of them`;
                    const lead = `${who} buys ${n} ${goods} at $${c} each. ${cap(lost)} ${bad}.`;
                    const sold = lost.includes('%') ? R`Sold: ${m(R`${n}-${n}\times${dec(f)}=${n - k}`)}.` : R`Sold: ${m(`${n}-${k}=${n - k}`)}.`;
                    if (t === 0) return mk(`${lead} The rest are sold for $${p} each. What is the total profit?`, usd(profit),
                        R`Cost: ${m(R`${n}\times${D(c)}=${D(cost)}`)}. ${sold} Received: ${m(R`${n - k}\times${D(p)}=${D(rev)}`)}. Profit: ${m(`${D(rev)}-${D(cost)}=${D(profit)}`)}.`, { t: 'bulk', n, total: cost, bad: k, p });
                    if (t === 1) return mk(`${lead} At what price must each of the others be sold to make a total profit of $${profit}?`, usd(p),
                        R`Cost: ${m(R`${n}\times${D(c)}=${D(cost)}`)}. Money needed: ${m(`${D(cost)}+${D(profit)}=${D(rev)}`)}. ${sold} Price: ${m(R`${D(rev)}\div${n - k}=${D(p)}`)}.`, { t: 'bulkPrice', n, total: cost, bad: k, profit });
                    if ((profit * 100) % cost) continue;
                    return mk(`${lead} The rest are sold for $${p} each. What is the overall profit percentage (the total profit as a percentage of the total cost)?`, pct(profit * 100 / cost),
                        R`Cost: ${m(R`${n}\times${D(c)}=${D(cost)}`)}. ${sold} Received: ${m(R`${n - k}\times${D(p)}=${D(rev)}`)}. Profit ${m(D(profit))}, and ${m(R`\frac{${profit}}{${cost}}=${P(profit * 100 / cost)}`)}.`, { t: 'bulkRate', n, total: cost, bad: k, p });
                }
            },
        },
        {
            id: 'batches', name: 'Selling at different prices', level: 2,
            gen(rng) {
                const goods = rng.pick(GOODS), who = rng.pick(['A shop', 'A market stall', 'A trader', 'A school club', 'A museum shop']), t = rng.int(0, 2);
                for (;;) {
                    const n = rng.pick([40, 50, 60, 80, 100, 120, 150, 200]), c = rng.int(3, 15), a = n * rng.pick([50, 60, 70, 75, 80, 90]) / 100;
                    if (!Number.isInteger(a)) continue;
                    const p1 = c + rng.int(2, 10), d = rng.pick([20, 25, 40, 50, 60, 75]);
                    const p2 = t === 1 ? p1 * (100 - d) / 100 : rng.int(Math.max(1, c - 4), p1 - 1);
                    if (!Number.isInteger(p2) || p2 < 1) continue;
                    const cost = n * c, rev = a * p1 + (n - a) * p2, profit = rev - cost;
                    if (profit <= 0) continue;
                    const work = R`Cost: ${m(R`${n}\times${D(c)}=${D(cost)}`)}. Received: ${m(R`${a}\times${D(p1)}+${n - a}\times${D(p2)}=${D(rev)}`)}. Profit: ${m(`${D(rev)}-${D(cost)}=${D(profit)}`)}.`;
                    if (t === 0) return mk(`${who} buys ${n} ${goods} at $${c} each. It sells ${a} of them at $${p1} each and the rest in a clearance at $${p2} each. What is the total profit?`, usd(profit), work,
                        { t: 'batch', n, c, a, p1, p2, want: 'profit' });
                    if (t === 1) return mk(`${who} buys ${n} ${goods} at $${c} each. It sells ${a} of them at $${p1} each. The rest are sold at ${d}% off that price. What is the total profit?`, usd(profit),
                        R`Reduced price: ${m(R`${D(p1)}\times${dec(100 - d)}=${D(p2)}`)}. ${work}`, { t: 'batch', n, c, a, p1, p2: p1 * (100 - d) / 100, want: 'profit' });
                    return mk(`${who} buys ${n} ${goods} at $${c} each. Some are sold at $${p1} each and all the others in a clearance at $${p2} each. The total profit is $${profit}. How many were sold at $${p1}?`, CA.num(a),
                        R`Total received: ${m(`${D(cost)}+${D(profit)}=${D(rev)}`)}. If all ${n} had sold at ${m(D(p2))} that would be ${m(D(n * p2))}; the extra ${m(D(rev - n * p2))} comes from ${m(D(p1 - p2))} more on each full-price one: ${m(R`${rev - n * p2}\div${p1 - p2}=${a}`)}.`,
                        { t: 'batch', n, c, a, p1, p2, profit, want: 'a' });
                }
            },
        },
        {
            id: 'break-even', name: 'Break-even', level: 2,
            gen(rng) {
                const [setup, thing, lo, hi] = rng.pick([
                    ['Ella pays $F to rent a stall for the day. She sells cups of lemonade', 'cups', 1, 2],
                    ['A band pays $F to hire a studio and print the artwork for a CD. It sells CDs', 'CDs', 2, 5],
                    ['A club pays $F for a T-shirt printing machine. It sells printed T-shirts', 'T-shirts', 4, 9],
                    ['Sam pays $F for a table at a craft fair. He sells bracelets', 'bracelets', 2, 5],
                    ['A class pays $F to hire a popcorn machine. It sells bags of popcorn', 'bags', 1, 2],
                    ['Maya pays $F for a baking course and equipment. She sells cakes', 'cakes', 5, 12],
                ]);
                const c = rng.int(lo, hi), g = rng.int(Math.max(1, lo), hi + 3), p = c + g, n0 = rng.pick([20, 25, 30, 40, 50, 60, 75, 80, 100]), Fx = n0 * g;
                const lead = `${setup.replace('$F', '$' + Fx)} for $${p} each; each one costs $${c} to make.`;
                const t = rng.int(0, 2), per = R`Each one brings in ${m(`${D(p)}-${D(c)}=${D(g)}`)} more than it costs.`;
                if (t === 0) return mk(`${lead} How many ${thing} must be sold to break even (no profit and no loss)?`, CA.num(n0, thing),
                    R`${per} ${m(R`${D(Fx)}\div${D(g)}=${n0}`)}.`, { t: 'even', F: Fx, c, p, target: 0, want: 'n' });
                if (t === 1) {
                    const X = g * rng.pick([10, 15, 20, 25, 30, 40, 50]);
                    return mk(`${lead} How many ${thing} must be sold to make a profit of $${X}?`, CA.num((Fx + X) / g, thing),
                        R`${per} They must cover ${m(`${D(Fx)}+${D(X)}=${D(Fx + X)}`)}: ${m(R`${Fx + X}\div${g}=${(Fx + X) / g}`)}.`, { t: 'even', F: Fx, c, p, target: X, want: 'n' });
                }
                const n = n0 + rng.pick([10, 15, 20, 30, 40, 50]);
                return mk(`${lead} What is the profit if ${n} ${thing} are sold?`, usd(n * g - Fx),
                    R`${per} ${m(R`${n}\times${D(g)}-${D(Fx)}=${D(n * g - Fx)}`)}.`, { t: 'even', F: Fx, c, p, n, want: 'profit' });
            },
        },
        {
            id: 'tax-interest', name: 'Sales tax and simple interest', level: 2,
            gen(rng) {
                const t = rng.int(0, 5), item = rng.pick(ITEMS);
                if (t === 0 || t === 1) {
                    const x = rng.pick([5, 8, 10, 15, 20]), Pz = price(rng, unit(x), 20, 400), T = Pz * (100 + x) / 100;
                    if (t === 0) return mk(`${cap(item)} is priced at $${Pz} before tax. A sales tax of ${x}% is added. What is the total price?`, usd(T),
                        R`${m(R`${D(Pz)}\times${dec(100 + x)}=${D(T)}`)}.`, { t: 'tax', P: Pz, x, want: 'T' });
                    return mk(`${cap(item)} costs $${T} including a sales tax of ${x}%. What was the price before tax?`, usd(Pz),
                        R`$${T} is ${100 + x}% of the price before tax: ${m(R`${D(T)}\div${dec(100 + x)}=${D(Pz)}`)}.`, { t: 'tax', T, x, want: 'P' });
                }
                if (t === 2) {
                    for (;;) {
                        const d = rng.pick([10, 20, 25, 30, 50]), x = rng.pick([5, 10, 20]), M = price(rng, 20, 40, 600), S = M * (100 - d) / 100, T = S * (100 + x) / 100;
                        if (!Number.isInteger(S) || !Number.isInteger(T)) continue;
                        return mk(`${cap(item)} has an original price of $${M}. It is sold at ${d}% off, and then a sales tax of ${x}% is added to the new price. How much does the customer pay?`, usd(T),
                            R`New price: ${m(R`${D(M)}\times${dec(100 - d)}=${D(S)}`)}. With tax: ${m(R`${D(S)}\times${dec(100 + x)}=${D(T)}`)}.`, { t: 'discTax', M, d, x });
                    }
                }
                const Pr = 100 * rng.int(2, 30), r = rng.int(2, 8), y = rng.int(2, 6), I = Pr * r * y / 100, who = rng.pick(['Leah', 'Marco', 'Priya', 'Tom', 'Aisha', 'Ken']);
                const lead = `${who} puts $${Pr} into a savings account that pays simple interest`;
                const work = m(R`${D(Pr)}\times${dec(r)}\times${y}=${D(I)}`);
                if (t === 3) return mk(`${lead} of ${r}% per year. How much interest is earned in ${y} years?`, usd(I), R`Interest = principal × rate × years: ${work}.`, { t: 'interest', P: Pr, r, y, want: 'I' });
                if (t === 4) return mk(`${lead} of ${r}% per year. How much is in the account altogether after ${y} years?`, usd(Pr + I), R`Interest: ${work}. Total: ${m(`${D(Pr)}+${D(I)}=${D(Pr + I)}`)}.`, { t: 'interest', P: Pr, r, y, want: 'total' });
                return mk(`${lead}. After ${y} years the account has earned $${I} in interest. What is the interest rate per year?`, pct(r),
                    R`Interest per year: ${m(R`${D(I)}\div${y}=${D(I / y)}`)}. As a fraction of the principal: ${m(R`\frac{${I / y}}{${Pr}}=${P(r)}`)}.`, { t: 'interest', P: Pr, I, y, want: 'r' });
            },
        },

        // ── Level 3 ──────────────────────────────────────────────────
        {
            id: 'two-items', name: 'Two items: one profit, one loss', level: 3,
            gen(rng) {
                const [g, l, u] = rng.pick([[20, 20, 12], [25, 25, 15], [10, 10, 99], [50, 50, 3], [25, 20, 20], [50, 25, 12], [60, 20, 8], [100, 20, 4], [25, 50, 5], [20, 40, 6], [50, 40, 3], [100, 50, 2], [40, 30, 7], [50, 20, 12]]);
                const S = u * (u >= 90 ? rng.int(1, 3) : rng.int(Math.ceil(30 / u), Math.floor(480 / u)));
                const c1 = S * 100 / (100 + g), c2 = S * 100 / (100 - l), net = 2 * S - c1 - c2;
                const things = rng.pick(['bikes', 'paintings', 'phones', 'vases', 'cameras', 'old coins', 'guitars', 'armchairs']);
                const who = rng.pick(['A dealer', 'A collector', 'A trader', 'Mr Novak', 'Mrs Okafor']);
                const naive = Math.round(S * (g - l) / 100);
                return mk(`${who} sells two ${things} for $${S} each. On the first there is a profit of ${g}% on its cost; on the second there is a loss of ${l}% of its cost. Overall, the seller makes…`,
                    CA.mc(rng, outcome(net, true), [outcome(-net, true), outcome(0, true), outcome(naive, true), outcome(2 * net, true), outcome(net - 5, true), outcome(net + 10, true)]),
                    R`Costs: ${m(R`${D(S)}\div${dec(100 + g)}=${D(c1)}`)} and ${m(R`${D(S)}\div${dec(100 - l)}=${D(c2)}`)}, total ${m(D(c1 + c2))}. Received ${m(R`2\times${D(S)}=${D(2 * S)}`)}. Result: ${outcome(net, true)}.`,
                    { t: 'twoItems', S, g, l });
            },
        },
        {
            id: 'max-discount', name: 'How big a discount?', level: 3,
            gen(rng) {
                for (;;) {
                    const u = rng.pick([25, 40, 50, 60, 80, 100, 150]), d = rng.pick([10, 12, 15, 20, 25, 30, 40, 50]);
                    const r = (100 + u) * (100 - d) / 100 - 100;
                    if (!Number.isInteger(r) || r < 0) continue;
                    const t = rng.int(0, 2), item = rng.pick(ITEMS);
                    if (t === 0) {
                        const c = price(rng, CA.lcm(unit(u), unit(r || 100)), 20, 600), M = c * (100 + u) / 100, low = c * (100 + r) / 100;
                        const want = r === 0 ? 'does not want to make a loss' : `wants a profit percentage of at least ${r}%`;
                        return mk(`${cap(item)} costs a shop $${c} and has an original price of $${M}. The shop ${want}. What is the largest discount rate it can give?`, pct(d),
                            R`Lowest price: ${r === 0 ? m(D(c)) : m(R`${D(c)}\times${dec(100 + r)}=${D(low)}`)}. That is ${m(R`\frac{${low}}{${M}}=${P(100 - d)}`)} of the original price, so the discount rate is at most ${m(P(d))}.`,
                            { t: 'maxDisc', c, M, r, want: 'd' });
                    }
                    if (r === 0) continue;
                    if (t === 1) return mk(`A shop sets its original prices ${u}% above cost. During a sale it gives a discount and still has a profit percentage of ${r}%. What is the discount rate?`, pct(d),
                        R`Pretend the cost is $100: original price ${m(D(100 + u))}, new price ${m(D(100 + r))}. ${m(R`\frac{${100 + r}}{${100 + u}}=${P(100 - d)}`)}, so the discount rate is ${m(P(d))}.`, { t: 'maxDisc', c: 100, M: 100 + u, r, want: 'd' });
                    return mk(`A shop sells its goods at ${d}% off the original price and still makes a profit of ${r}% on the cost. By what percentage of the cost is the original price above the cost?`, pct(u),
                        R`Pretend the cost is $100: the new price is ${m(D(100 + r))}, which is ${100 - d}% of the original price. Original price: ${m(R`${100 + r}\div${dec(100 - d)}=${D(100 + u)}`)} — ${m(P(u))} above the cost.`, { t: 'maxDisc', c: 100, d, r, want: 'u' });
                }
            },
        },
        {
            id: 'find-cost-chain', name: 'Find the cost from clues', level: 3,
            gen(rng) {
                const t = rng.int(0, 2), item = rng.pick(ITEMS), who = rng.pick(SELLERS);
                for (;;) {
                    if (t === 0) {
                        const u = rng.pick([20, 25, 30, 40, 50, 60, 80, 100]), d = rng.pick([10, 20, 25, 30, 40]), net = (100 + u) * (100 - d) / 100 - 100;
                        if (!Number.isInteger(net) || net <= 0) continue;
                        const c = price(rng, 20, 40, 800), profit = c * net / 100;
                        if (!Number.isInteger(profit) || !Number.isInteger(c * (100 + u) / 100)) continue;
                        return mk(`${who} sets the original price of ${item} ${u}% above its cost and then sells it with a discount of ${d}%. The profit is $${profit}. What did it cost the seller?`, usd(c),
                            R`${m(R`${dec(100 + u)}\times${dec(100 - d)}=${dec(100 + net)}`)}: the new price is ${100 + net}% of the cost, so the profit is ${net}% of the cost. ${m(R`${D(profit)}\div${dec(net)}=${D(c)}`)}.`, { t: 'chainBack', u, d, profit });
                    }
                    const d1 = rng.pick([0, 10, 10, 20]), d2 = d1 + rng.pick([10, 20, 30]), M = price(rng, 10, 100, 900);
                    const s1 = M * (100 - d1) / 100, s2 = M * (100 - d2) / 100;
                    const c = t === 1 ? rng.int(Math.floor(s2 / 5) + 1, Math.ceil(s1 / 5) - 1) * 5 : rng.int(Math.floor(s2 * 0.6 / 5), Math.ceil(s2 / 5) - 1) * 5;
                    const a = s1 - c, b = s2 - c;      // profit at the first price, profit (or loss if negative) at the second
                    if (!(c > 0 && a > 0 && b !== 0) || (t === 1 && b >= 0) || (t === 2 && b <= 0)) continue;
                    const first = d1 === 0 ? 'at its original price' : `at ${d1}% off its original price`;
                    const second = b < 0 ? `there would be a loss of $${-b}` : `the profit would be only $${b}`;
                    return mk(`If ${item} is sold ${first}, the shop makes a profit of $${a}. If it is sold at ${d2}% off its original price, ${second}. What did it cost the shop?`, usd(c),
                        R`The two prices differ by ${m(b < 0 ? `${D(a)}+${D(-b)}=${D(a - b)}` : `${D(a)}-${D(b)}=${D(a - b)}`)}, which is ${d2 - d1}% of the original price. Original price: ${m(R`${D(a - b)}\div${dec(d2 - d1)}=${D(M)}`)}. Cost: ${m(d1 === 0 ? `${D(M)}-${D(a)}=${D(c)}` : R`${D(M)}\times${dec(100 - d1)}-${D(a)}=${D(c)}`)}.`,
                        { t: 'twoClues', d1, d2, a, b });
                }
            },
        },
        {
            id: 'overall-percentage', name: 'Overall profit percentage', level: 3,
            gen(rng) {
                const t = rng.int(0, 3), goods = rng.pick(['strawberries', 'apples', 'fish', 'flowers', 'bread', 'eggs', 'tomatoes', 'peaches', 'concert T-shirts', 'calendars']);
                const FR = [[50, 'half'], [75, 'three-quarters'], [80, '80%'], [60, '60%'], [90, '90%'], [25, 'a quarter'], [40, '40%'], [70, '70%']];
                for (;;) {
                    if (t === 0) {
                        const [f, fw] = rng.pick(FR), g = rng.pick([20, 25, 30, 40, 50, 60, 80, 100]), l = rng.pick([0, 10, 20, 25, 30, 40, 50]);
                        const net = (f * g - (100 - f) * l) / 100;
                        if (!Number.isInteger(net) || net <= 0) continue;
                        const rest = l === 0 ? 'at cost price (no profit)' : `at a loss of ${l}%`;
                        return mk(`A trader buys a load of ${goods}. ${cap(fw)} of the load is sold at a profit of ${g}%, and the rest is sold ${rest}. What is the overall profit percentage (the total profit as a percentage of the total cost)?`, pct(net),
                            R`Pretend the load cost $100: ${m(D(f))} of it sells for ${m(R`${f}\times${dec(100 + g)}=${D(f * (100 + g) / 100)}`)} and the other ${m(D(100 - f))} sells for ${m(R`${100 - f}\times${dec(100 - l)}=${D((100 - f) * (100 - l) / 100)}`)}. Total ${m(D(100 + net))}: a profit of ${m(P(net))}.`,
                            { t: 'mix', f, g, l: -l });
                    }
                    const x = rng.pick([10, 20, 25, 40, 50]), g = rng.pick([20, 25, 50, 60, 80, 100, 150]), net = (100 - x) * (100 + g) / 100 - 100;
                    if (!Number.isInteger(net) || net <= 0) continue;
                    const lead = `A trader buys a load of ${goods}. ${x}% of the load is spoiled and has to be thrown away.`;
                    if (t === 1) return mk(`${lead} The rest is sold at ${g}% above its cost price. What is the overall profit percentage (the total profit as a percentage of the total cost)?`, pct(net),
                        R`Pretend the load cost $100. The part sold cost ${m(D(100 - x))} and sells for ${m(R`${100 - x}\times${dec(100 + g)}=${D(100 + net)}`)}: a profit of ${m(P(net))}.`, { t: 'spoil', x, g, want: 'net' });
                    if (t === 2) return mk(`${lead} The trader still wants an overall profit of ${net}% on the total cost. By what percentage above its cost price must the rest be sold?`, pct(g),
                        R`Pretend the load cost $100: the trader needs ${m(D(100 + net))} from goods that cost ${m(D(100 - x))}. ${m(R`${100 + net}\div${100 - x}=${dec(100 + g)}`)}, so the price must be ${m(P(g))} above cost.`, { t: 'spoil', x, net, want: 'g' });
                    const [f, fw] = rng.pick(FR.filter(e => e[0] <= 80)), g2 = rng.pick([20, 30, 40, 50, 60, 80, 100]), dd = rng.pick([20, 25, 30, 40, 50]);
                    const second = (100 + g2) * (100 - dd) / 100, net2 = (f * (100 + g2) + (100 - f) * second) / 100 - 100;
                    if (!Number.isInteger(net2) || net2 <= 0 || !Number.isInteger(second)) continue;
                    return mk(`A shop sets the original price of a batch of ${goods} ${g2}% above cost. ${cap(fw)} of the batch is sold at the original price, and the rest at ${dd}% off the original price. What is the overall profit percentage (the total profit as a percentage of the total cost)?`, pct(net2),
                        R`Pretend the batch cost $100, so at the original price it would bring in ${m(D(100 + g2))}. Received: ${m(R`${dec(f)}\times${100 + g2}+${dec(100 - f)}\times${100 + g2}\times${dec(100 - dd)}=${D(100 + net2)}`)}: a profit of ${m(P(net2))}.`,
                        { t: 'mixDisc', f, g: g2, d: dd });
                }
            },
        },
    ];
    /** The building block `id`; `kinds` (optional) limits it to some of its kinds of question. */
    const old = (id, kinds) => { const g = POOL.find(x => x.id === id); return rng => g.gen(rng, kinds); };
    /** A generator that picks one of several building blocks each time. */
    const either = (...ids) => rng => old(rng.pick(ids))(rng);

    CA.register({
        id: 7,
        assignmentNote: 'Show your working in the space under each problem. A profit or loss given as a percentage always means a percentage of the cost.',

        tutorial: [
            {
                h: 'Cost, price, profit and profit percentage',
                html: R`
                <p>Every shop does the same thing: it <strong>buys</strong> something and then <strong>sells</strong> it.
                   Four words describe what happens.</p>
                <ul>
                    <li><strong>Cost</strong> — what the seller paid for the item.</li>
                    <li><strong>Price</strong> — what the customer pays for it (the selling price).</li>
                    <li><strong>Profit</strong> — the money the seller gains: the price minus the cost.</li>
                    <li><strong>Profit percentage</strong> — the profit compared with the cost, as a percentage.</li>
                </ul>
                <div class="ca-formula">\[ \text{Price} = \text{Cost} + \text{Profit} \qquad \text{Profit percentage} = \frac{\text{Profit}}{\text{Cost}} \times 100\% \]</div>
                ${F.row(bars([['Cost', 40, '$40'], ['Price', 52, '$52', F.colors.SHADE]], { mark: 40 }))}
                <p>A shop buys a jacket for $40 and sells it for $52. The profit is \(${D(52)}-${D(40)}=${D(12)}\) — the part
                   of the lower bar that sticks out past the dashed line. The profit percentage is
                   \(\frac{12}{40}\times100\%=30\%\).</p>
                <p><strong>Why a percentage?</strong> Is $12 profit good? On a $40 jacket it is excellent; on a $4,000 car
                   it is terrible. The profit percentage measures the profit <em>against what was spent</em>, so different
                   deals can be compared.</p>
                <div class="ca-key"><strong>The cost is the 100%.</strong> A profit percentage is always a percentage
                   <em>of the cost</em> — never of the price.</div>
                <div class="ca-tip"><strong>Losses.</strong> If the price is <em>less</em> than the cost, the seller makes a
                   <strong>loss</strong>: loss = cost − price, and the loss percentage is \(\frac{\text{loss}}{\text{cost}}\times100\%\).
                   A $50 lamp sold for $40 is a $10 loss, which is 20%.</div>`,
            },
            {
                h: 'Calculating with the profit percentage',
                html: R`
                <p>The two formulas above can each be turned around. Altogether there are four calculations to master —
                   two that multiply and two that undo them by dividing.</p>
                <div class="ca-formula">
                    \[ \text{Profit} = \text{Cost} \times \text{Profit percentage} \]
                    \[ \text{Cost} = \text{Profit} \div \text{Profit percentage} \]
                    \[ \text{Price} = \text{Cost} \times (1 + \text{Profit percentage}) \]
                    \[ \text{Cost} = \text{Price} \div (1 + \text{Profit percentage}) \]
                </div>
                <table>
                    <tr><th>You know</th><th>You want</th><th>Do this</th><th>Example</th></tr>
                    <tr><td>cost $60, profit percentage 40%</td><td>profit</td><td>cost × 40%</td><td>\(60\times0.4=${D(24)}\)</td></tr>
                    <tr><td>profit $24, profit percentage 40%</td><td>cost</td><td>profit ÷ 40%</td><td>\(24\div0.4=${D(60)}\)</td></tr>
                    <tr><td>cost $60, profit percentage 40%</td><td>price</td><td>cost × (1 + 40%)</td><td>\(60\times1.4=${D(84)}\)</td></tr>
                    <tr><td>price $84, profit percentage 40%</td><td>cost</td><td>price ÷ (1 + 40%)</td><td>\(84\div1.4=${D(60)}\)</td></tr>
                </table>
                <p><strong>Why \(1+\) profit percentage?</strong> The price is the cost (100% of the cost) plus the profit
                   (40% of the cost): 140% of the cost altogether. So multiply the cost by 1.4 to get the price, and divide
                   the price by 1.4 to get back to the cost.</p>
                <div class="ca-warn"><strong>Classic mistake.</strong> A watch is sold for $84 at a profit percentage of
                   40%. To find the cost, do <em>not</em> take 40% off $84 (\(84\times0.6=50.40\)). The 40% is 40% of the
                   <em>cost</em>, which you do not know yet — it is not 40% of $84. To undo “× 1.4” you must divide by 1.4.</div>
                <div class="ca-tip"><strong>With a loss</strong> the same idea works with a minus sign:
                   price = cost × (1 − loss percentage). A 20% loss means the price is 80% of the cost.</div>`,
            },
            {
                h: 'Discounts: original price, new price and discount rate',
                html: R`
                <p>In a sale, the <strong>original price</strong> is the price before the reduction and the
                   <strong>new price</strong> is what you pay now. The <strong>discount rate</strong> tells you how big
                   the reduction is, compared with the original price.</p>
                <div class="ca-formula">\[ \text{Discount rate} = \frac{\text{Original price} - \text{New price}}{\text{Original price}} \times 100\% \]</div>
                <p>A scooter's price drops from $150 to $120. The discount rate is
                   \(\frac{150-120}{150}\times100\%=20\%\). Shops write this as “20% off” or “a discount of 20%”.</p>
                <div class="ca-key"><strong>If an item has a discount of \(x\%\):</strong>
                   \[ \text{New price} = \text{Original price} \times (1 - x\%) \]
                   \[ \text{Original price} = \text{New price} \div (1 - x\%) \]
                   “20% off” means you pay \(100\%-20\%=80\%\) of the original price.</div>
                <ul>
                    <li><strong>Forwards.</strong> A $150 scooter with a discount of 20% costs \(150\times(1-20\%)=150\times0.8=${D(120)}\).
                        Some shops say the same thing as “sold at 80% of the original price”.</li>
                    <li><strong>Backwards.</strong> After a discount of 25% a tent costs $90. The $90 is 75% of the
                        original price, so the original price was \(90\div0.75=${D(120)}\).</li>
                </ul>
                <p><strong>Two discounts in a row.</strong> “20% off, then a further 10% off” is not 30% off. Each discount
                   is taken from the price <em>at that moment</em>: \(0.8\times0.9=0.72\), so you pay 72% — the same as a
                   single discount rate of 28%.</p>
                <div class="ca-tip"><strong>Two different 100%s.</strong> A profit percentage is measured on the
                   <em>cost</em>; a discount rate is measured on the <em>original price</em>. In every problem, ask:
                   “percent of what?”</div>`,
            },
            {
                h: 'Putting them together: price above cost, then a discount',
                html: R`
                <p>Shops set an original price well above the cost, then tempt customers with a discount. Is there still a
                   profit? Chain the multipliers.</p>
                <p>A shop buys a guitar for $200, sets the original price 50% above the cost, then sells it with a discount
                   of 20%.</p>
                ${F.row(bars([['Cost', 200, '$200'], ['Original price', 300, '$300', '#f5f7ff'], ['New price', 240, '$240', F.colors.SHADE]], { mark: 200 }))}
                <ul>
                    <li>Original price: \(200\times(1+50\%)=${D(300)}\).</li>
                    <li>New price: \(300\times(1-20\%)=${D(240)}\).</li>
                    <li>Profit: \(240-200=${D(40)}\), a profit percentage of \(\frac{40}{200}=20\%\).</li>
                </ul>
                <div class="ca-key"><strong>Shortcut.</strong> \(1.5\times0.8=1.2\): the new price is 120% of the cost, so
                   the profit percentage is 20% — whatever the cost is. If the product of the multipliers is less than 1,
                   the shop makes a loss.</div>
                <div class="ca-warn"><strong>Up 20% then down 20% does not get you back.</strong>
                   \(1.2\times0.8=0.96\): a 4% loss. The 20% that comes off is 20% of a <em>bigger</em> number than the 20%
                   that went on.</div>
                <p><strong>A famous trap.</strong> A dealer sells two bikes for $60 each. On one he makes a profit of 20%,
                   on the other a loss of 20%. Did he break even? No! The costs were \(60\div(1+20\%)=${D(50)}\) and
                   \(60\div(1-20\%)=${D(75)}\) — $125 in all — and he received only $120: a loss of $5.</p>`,
            },
            {
                h: 'Buying and selling in bulk',
                html: R`
                <p>With many items, forget about individual profits. Just compare the money in with the money out.</p>
                <div class="ca-formula">\[ \text{total profit} = \text{total money received} - \text{total cost} \]</div>
                <p><strong>Broken, spoiled or unsold items still cost money.</strong> A café buys 200 mugs at $3 each. In
                   the delivery 20 break, and the rest are sold at $5 each.</p>
                <ul>
                    <li>Total cost: \(200\times3=${D(600)}\) — all 200 were paid for.</li>
                    <li>Money received: \(180\times5=${D(900)}\) — only 180 were sold.</li>
                    <li>Profit: \(900-600=${D(300)}\), a profit percentage of \(\frac{300}{600}=50\%\).</li>
                </ul>
                <p><strong>Different prices on different days.</strong> If 150 of the mugs had sold at $5 and the last 30 at
                   $2 in a clearance, the money received would be \(150\times5+30\times2=${D(810)}\) and the profit $210.</p>
                <p><strong>Break-even.</strong> A stall costs $60 to rent. Lemonade costs $1 a cup to make and sells for $3.
                   Each cup brings in $2 more than it costs, so the rent is covered after \(60\div2=30\) cups. That is the
                   <strong>break-even point</strong>: no profit, no loss. Every cup after that is $2 of profit.</p>
                <div class="ca-formula">\[ \text{break-even number} = \frac{\text{fixed cost}}{\text{price} - \text{cost per item}} \]</div>`,
            },
            {
                h: 'Working backwards — and the “pretend it costs $100” trick',
                html: R`
                <p><strong>What discount can the shop afford?</strong> A lamp costs the shop $80 and its original price is
                   $120. The shop wants a profit percentage of at least 20%. The lowest acceptable price is
                   \(80\times(1+20\%)=${D(96)}\). Since \(96\div120=0.8\), the customer must pay at least 80% of the
                   original price: the biggest possible discount rate is 20%.</p>
                <div class="ca-key"><strong>No prices given? Pretend the cost is $100.</strong> Percentages do not care
                   about the actual amount, and with a cost of $100 every profit in dollars <em>is</em> the profit
                   percentage.</div>
                <p><strong>Example.</strong> Goods are priced 60% above cost. A quarter of the stock is sold at this
                   original price and the rest at half of it. What is the overall profit or loss? Pretend there are 4 items
                   costing $100 each: cost $400. Original price $160. Money received:
                   \(1\times160+3\times80=${D(400)}\). Exactly break-even!</p>
                <p><strong>Two clues, one unknown.</strong> With a discount of 10%, a shop makes $20 on a coat. With a
                   discount of 20% it would lose $10. The two new prices differ by \(20+10=${D(30)}\), and they also differ
                   by 10% of the original price. So the original price is $300, and the cost is
                   \(300\times0.9-20=${D(250)}\).</p>
                <div class="ca-tip"><strong>Extras you will meet.</strong> <em>Sales tax</em> is added as a percentage of
                   the price: $80 plus 5% tax is \(80\times1.05=${D(84)}\). <em>Simple interest</em> is a percentage of the
                   money saved or borrowed, earned every year:
                   \(\text{interest}=\text{principal}\times\text{rate}\times\text{years}\). $500 at 4% a year for 3 years
                   earns \(500\times0.04\times3=${D(60)}\).</div>`,
            },
        ],

        // Mirrors the textbook's own summary page for this lesson.
        summary: [
            {
                topic: 'Concepts of cost, price, profit and profit percentage',
                points: [
                    R`\(\text{Price} = \text{Cost} + \text{Profit}\)`,
                    R`\(\text{Profit percentage} = \dfrac{\text{Profit}}{\text{Cost}} \times 100\%\) — always a percentage of the <em>cost</em>.`,
                ],
            },
            {
                topic: 'Calculation',
                points: [
                    R`\(\text{Profit} = \text{Cost} \times \text{Profit percentage}\) &nbsp;and&nbsp; \(\text{Cost} = \text{Profit} \div \text{Profit percentage}\)`,
                    R`\(\text{Price} = \text{Cost} \times (1 + \text{Profit percentage})\) &nbsp;and&nbsp; \(\text{Cost} = \text{Price} \div (1 + \text{Profit percentage})\)`,
                ],
            },
            {
                topic: 'Concepts and calculation of discount',
                points: [
                    R`\(\text{Discount rate} = \dfrac{\text{Original price} - \text{New price}}{\text{Original price}} \times 100\%\)`,
                    R`If an item has a discount of \(x\%\): &nbsp;\(\text{New price} = \text{Original price} \times (1 - x\%)\) &nbsp;and&nbsp; \(\text{Original price} = \text{New price} \div (1 - x\%)\).`,
                ],
            },
        ],

        examples: [
            {
                title: 'Profit and profit percentage',
                q: 'A shop buys a backpack for $40 and sells it for $52. Find the profit and the profit percentage.',
                steps: [
                    R`Profit = price − cost: \(${D(52)}-${D(40)}=${D(52 - 40)}\).`,
                    R`Profit percentage = profit ÷ cost: \(\frac{${52 - 40}}{40}=${(52 - 40) / 40}\).`,
                    R`As a percentage: \(${(52 - 40) / 40 * 100}\%\). (Divide by the <em>cost</em>, not by the price.)`,
                ],
                answer: R`$${52 - 40} profit, a profit percentage of ${(52 - 40) / 40 * 100}%`,
            },
            {
                title: 'Finding the cost',
                q: 'A watch is sold for $84. The seller makes a profit of 40%. How much did the watch cost the seller?',
                steps: [
                    R`The cost is the 100%. A 40% profit means the price is \(100\%+40\%=140\%\) of the cost.`,
                    R`So \(\text{cost}\times1.4=84\).`,
                    R`\(\text{cost}=84\div1.4=${84 / 1.4}\). Check: 40% of $${84 / 1.4} is $${84 / 1.4 * 0.4}, and \(${84 / 1.4}+${84 / 1.4 * 0.4}=84\). ✓`,
                ],
                answer: R`$${84 / 1.4}`,
            },
            {
                title: 'Price above cost, then a discount',
                q: 'A shop buys a guitar for $200. It sets the original price 50% above the cost, and later sells the guitar with a discount of 20%. What is the profit, and what is the profit percentage?',
                steps: [
                    R`Original price: \(200\times1.5=${D(200 * 1.5)}\).`,
                    R`New price: 20% off means paying 80%: \(300\times0.8=${D(300 * 0.8)}\).`,
                    R`Profit: \(240-200=${D(40)}\).`,
                    R`Profit percentage: \(\frac{40}{200}=20\%\). (Shortcut: \(1.5\times0.8=1.2\), so the new price is 120% of the cost.)`,
                ],
                answer: R`$40 profit, a profit percentage of 20%`,
            },
            {
                title: 'Two items, one up and one down',
                q: 'A dealer sells two bikes for $60 each. On the first he makes a profit of 20%; on the second he makes a loss of 20%. Overall, does he make a profit or a loss, and how much?',
                steps: [
                    R`First bike: $60 is 120% of its cost, so it cost \(60\div1.2=${D(60 / 1.2)}\).`,
                    R`Second bike: $60 is 80% of its cost, so it cost \(60\div0.8=${D(60 / 0.8)}\).`,
                    R`Total cost: \(50+75=${D(125)}\). Total received: \(60+60=${D(120)}\).`,
                    R`\(125-120=5\): he loses $5. The 20% loss was 20% of a bigger cost than the 20% profit.`,
                ],
                answer: R`a loss of $5`,
            },
            {
                title: 'Broken stock',
                q: 'A café buys 200 mugs at $3 each. 10% of them arrive broken and cannot be sold. The rest are sold for $5 each. Find the total profit and the profit percentage.',
                steps: [
                    R`Total cost: \(200\times3=${D(600)}\). The broken mugs were paid for too.`,
                    R`Mugs sold: \(200-20=180\). Money received: \(180\times5=${D(900)}\).`,
                    R`Profit: \(900-600=${D(300)}\).`,
                    R`Profit percentage: \(\frac{300}{600}=50\%\).`,
                ],
                answer: R`$300 profit, a profit percentage of 50%`,
            },
            {
                title: 'The biggest discount',
                q: 'A lamp costs a shop $80 and has an original price of $120. The shop wants to make a profit of at least 20%. What is the largest percentage discount it can offer?',
                steps: [
                    R`Lowest acceptable price: \(80\times1.2=${D(96)}\).`,
                    R`As a fraction of the original price: \(\frac{96}{120}=0.8=80\%\).`,
                    R`The customer must pay at least 80% of the original price, so the discount can be at most \(100\%-80\%=20\%\).`,
                ],
                answer: R`20%`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            { id: 'profit-basic', name: 'Price = cost + profit', level: 1, gen: old('profit-basic') },
            { id: 'profit-percentage', name: 'Profit percentage = profit ÷ cost', level: 1, gen: old('profit-percentage') },
            { id: 'profit-from-percentage', name: 'Profit = cost × profit percentage', level: 1, gen: old('price-from-percentage', [1]) },
            { id: 'price-from-percentage', name: 'Price = cost × (1 + profit percentage)', level: 1, gen: old('price-from-percentage', [0, 0, 2]) },
            { id: 'new-price', name: 'New price = original price × (1 − x%)', level: 1, gen: old('new-price') },
            { id: 'discount-rate', name: 'Discount rate', level: 1, gen: old('discount-backwards', [1]) },

            // ── Level 2 ──────────────────────────────────────────────────
            { id: 'cost-from-profit', name: 'Cost = profit ÷ profit percentage', level: 2, gen: old('find-cost', [3, 3, 2]) },
            { id: 'cost-from-price', name: 'Cost = price ÷ (1 + profit percentage)', level: 2, gen: old('find-cost', [0, 0, 1]) },
            { id: 'original-price', name: 'Original price = new price ÷ (1 − x%)', level: 2, gen: old('discount-backwards', [0, 0, 2]) },
            { id: 'chain', name: 'Price above cost, then a discount; two discounts', level: 2, gen: rng => (rng.bool(0.7) ? old('markup-discount')(rng) : old('discount-backwards', [3, 4])(rng)) },
            { id: 'shopkeeping', name: 'Bulk buying, break-even, tax and interest', level: 2, gen: either('bulk-unsold', 'batches', 'break-even', 'tax-interest') },

            // ── Level 3 ──────────────────────────────────────────────────
            { id: 'two-items', name: 'Two items: one profit, one loss', level: 3, gen: old('two-items') },
            { id: 'max-discount', name: 'How big a discount?', level: 3, gen: old('max-discount') },
            { id: 'find-cost-chain', name: 'Find the cost from clues', level: 3, gen: old('find-cost-chain') },
            { id: 'overall-percentage', name: 'Overall profit percentage', level: 3, gen: old('overall-percentage') },
        ],

        assignment: [
            ['profit-basic', 3], ['profit-percentage', 3], ['profit-from-percentage', 2], ['price-from-percentage', 3], ['new-price', 2], ['discount-rate', 2],
            ['cost-from-profit', 4], ['cost-from-price', 5], ['original-price', 5], ['chain', 4], ['shopkeeping', 5],
            ['two-items', 3], ['max-discount', 3], ['find-cost-chain', 3], ['overall-percentage', 3],
        ],
    });
})();
