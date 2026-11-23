/* Challenge Academy — Lesson 3: Exponents of Negative Numbers */
(function () {
    'use strict';
    const R = String.raw, m = CA.m, T = CA.tex;

    // ── Small helpers ────────────────────────────────────────────────────
    const par = x => (x < 0 ? R`(${x})` : R`${x}`);                  // -3 → (-3)
    const pw = (b, n) => R`${par(b)}^{${n}}`;                       // (-2)^{4}
    const negpw = (a, n) => R`-${a}^{${n}}`;                        // -2^{4}, which means -(2^4)
    const fpw = (p, q, n) => R`\left(-\frac{${p}}{${q}}\right)^{${n}}`;   // (-p/q)^n
    const sgn = n => (n % 2 === 0 ? 1 : -1);                       // the value of (-1)^n
    const parity = n => (n % 2 === 0 ? 'even' : 'odd');
    const signWord = v => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'zero');
    const SIGNS = ['positive', 'negative', 'zero'];
    // The same expression always gets the same instruction word, so a sheet never
    // shows one expression twice under two different wordings.
    const hash = s => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 100003; return h; };
    const ask = t => R`${['Evaluate', 'Find the value of', 'Work out', 'Calculate'][hash(t) % 4]} ${m(t)}.`;
    // Exact fractions with BigInt, for comparing powers that are too big for ordinary numbers.
    const big = (b, n) => BigInt(b) ** BigInt(n);
    const cmp = ([a, b], [c, d]) => { const l = a * d, r = c * b; return l < r ? '<' : l > r ? '>' : '='; };

    // Every (a, n) with a^n small enough to work out by hand.
    const POWS = [];
    for (let a = 2; a <= 10; a++) for (let n = 2; n <= 7; n++) if (a ** n <= 1100) POWS.push([a, n]);
    const SMALL = POWS.filter(([a, n]) => a ** n <= 130);

    // "Which single power is this?" — multiple choice, so the exponents can be big.
    function singlePower(rng) {
        const a = rng.int(2, 9), form = rng.int(0, 2);
        let i, j, t, e, wrong, rule;
        if (form === 0) {
            do { i = rng.int(3, 12); j = rng.int(3, 12); } while (i === j);
            t = R`${pw(-a, i)}\times${pw(-a, j)}`; e = i + j; wrong = i * j; rule = 'Multiplying powers of the same base: add the exponents.';
        } else if (form === 1) {
            j = rng.int(2, 9); i = j + rng.int(3, 12);
            t = R`${pw(-a, i)}\div${pw(-a, j)}`; e = i - j; wrong = i + j; rule = 'Dividing powers of the same base: subtract the exponents.';
        } else {
            do { i = rng.int(2, 9); j = rng.int(2, 7); } while (i === j || i * j === i + j);
            t = R`\left(${pw(-a, i)}\right)^{${j}}`; e = i * j; wrong = i + j; rule = 'A power of a power: multiply the exponents.';
        }
        const show = (s, k) => m(R`${s < 0 ? '-' : ''}${a}^{${k}}`);
        return {
            q: R`Which of these is equal to ${m(t)}?`,
            ans: CA.mc(rng, show(sgn(e), e), [show(-sgn(e), e), show(sgn(wrong), wrong), show(-sgn(wrong), wrong)]),
            sol: R`${rule} ${m(R`${t}=${pw(-a, e)}`)}. ${e} is ${parity(e)}, so this is ${show(sgn(e), e)}.`,
        };
    }

    // −2⁴ against (−2)⁴ and friends.
    function bracketTrap(rng) {
        const [a, n] = rng.pick(SMALL), form = rng.pick([0, 0, 1, 1, 2, 3]);
        const p = a ** n, q = (-a) ** n;
        let t, v, sol;
        if (form === 0) {
            t = negpw(a, n); v = -p;
            sol = R`No bracket: the exponent belongs to ${a} only. ${m(R`${t}=-(${a}^{${n}})=${v}`)}.`;
        } else if (form === 1) {
            t = R`-${pw(-a, n)}`; v = -q;
            sol = R`Power first: ${m(R`${pw(-a, n)}=${q}`)} (${n} is ${parity(n)}). Then take the opposite: ${m(String(v))}.`;
        } else if (form === 2) {
            t = R`${negpw(a, n)}+${pw(-a, n)}`; v = -p + q;
            sol = R`${m(R`${negpw(a, n)}=${-p}`)} (the base is ${a}) and ${m(R`${pw(-a, n)}=${q}`)} (the base is ${m(String(-a))}). ${m(R`${-p}+${par(q)}=${v}`)}.`;
        } else {
            t = R`${pw(-a, n)}-(${negpw(a, n)})`; v = q + p;
            sol = R`${m(R`${pw(-a, n)}=${q}`)} and ${m(R`${negpw(a, n)}=${-p}`)}. ${m(R`${q}-(${-p})=${v}`)}.`;
        }
        return { q: ask(t), ans: CA.num(v), sol };

    }

    // (−1)¹ + (−1)² + … : long sums of powers of −1.
    function sumOfOnes(rng) {
        const form = rng.pick([0, 0, 1, 1, 2]);
        let t, sol, lo, hi, step = 1;
        if (form === 0) {
            lo = 1; hi = rng.int(20, 300);
            t = R`(-1)^{1}+(-1)^{2}+(-1)^{3}+\cdots+(-1)^{${hi}}`;
            sol = R`The terms are ${m('-1,+1,-1,+1,\\dots')} and each neighbouring pair adds to 0. There are ${hi} terms` +
                (hi % 2 ? R`, so one is left over: the last one, ${m(R`${pw(-1, hi)}=-1`)}. The sum is ${m('-1')}.` : R`, an even number, so everything cancels. The sum is ${m('0')}.`);
        } else if (form === 1) {
            lo = rng.int(2, 30); hi = lo + rng.int(15, 150);
            const cnt = hi - lo + 1;
            t = R`(-1)^{${lo}}+(-1)^{${lo + 1}}+(-1)^{${lo + 2}}+\cdots+(-1)^{${hi}}`;
            sol = R`There are ${m(R`${hi}-${lo}+1=${cnt}`)} terms, alternating between ${m('1')} and ${m('-1')}, and each neighbouring pair adds to 0. ` +
                (cnt % 2 ? R`${cnt} is odd, so the last term is left over: ${m(R`${pw(-1, hi)}=${sgn(hi)}`)}.` : R`${cnt} is even, so everything cancels: the sum is ${m('0')}.`);
        } else {
            const odd = rng.bool(), k = rng.int(8, 60);
            lo = odd ? 1 : 2; hi = lo + 2 * (k - 1); step = 2;
            t = R`(-1)^{${lo}}+(-1)^{${lo + 2}}+(-1)^{${lo + 4}}+\cdots+(-1)^{${hi}}`;
            sol = R`Every exponent is ${odd ? 'odd' : 'even'}, so every term is ${m(odd ? '-1' : '1')}. The exponents ${lo}, ${lo + 2}, …, ${hi} number ${m(odd ? R`(${hi}+1)\div2=${k}` : R`${hi}\div2=${k}`)}, so the sum is ${m(String(odd ? -k : k))}.`;
        }
        let v = 0;
        for (let e = lo; e <= hi; e += step) v += sgn(e);
        return { q: ask(t), ans: CA.num(v), sol };

    }

    // The greatest or least of four look-alike powers.
    function greatestLeast(rng) {
        const a = rng.pick([2, 2, 3, 3, 4, 5]), want = rng.pick(['greatest', 'least']);
        const frac = R`\frac{1}{${a}}`;
        const make = e => [
            { t: pw(-a, e), n: (-a) ** e, d: 1 },
            { t: negpw(a, e), n: -(a ** e), d: 1 },
            { t: R`-${pw(-a, e)}`, n: -((-a) ** e), d: 1 },
            { t: fpw(1, a, e), n: sgn(e), d: a ** e },
            { t: R`-\left(${frac}\right)^{${e}}`, n: -1, d: a ** e },
            { t: R`-${fpw(1, a, e)}`, n: -sgn(e), d: a ** e },
        ];
        const pool = [2, 3, 4, 5].filter(e => a ** e <= 700).flatMap(make);
        for (;;) {
            const four = rng.sample(pool, 4);
            const vals = four.map(x => x.n / x.d);
            if (new Set(vals).size < 4) continue;
            if (vals.filter(x => x > 0).length < 1 || vals.filter(x => x < 0).length < 2) continue;
            const best = want === 'greatest' ? Math.max(...vals) : Math.min(...vals);
            const correct = four[vals.indexOf(best)];
            return {
                q: R`Work out the value of the <strong>${want}</strong> of these four numbers. \[ ${four.map(x => x.t).join(R`,\quad `)} \]`,
                ans: CA.frac(correct.n, correct.d),
                sol: R`Work each one out: ${four.map(x => m(R`${x.t}=${T.frac(x.n, x.d)}`)).join(', ')}. The ${want} is ${m(T.frac(correct.n, correct.d))}.`,
            };
        }

    }

    // ── Signed numbers (three or more multiplied / divided) ──────────────
    const negCount = xs => xs.filter(x => x < 0).length;
    const negWords = k => R`${k} negative number${k === 1 ? '' : 's'}`;
    const signLine = xs => { const k = negCount(xs); return R`There ${k === 1 ? 'is' : 'are'} ${negWords(k)} — an ${parity(k)} count — so the result is ${signWord(sgn(k))}.`; };
    /** A chain of whole numbers joined by × and ÷ that stays whole when worked left to right. Sizes only. */
    function chain(rng, len, max = 400) {
        for (;;) {
            const nums = [rng.int(2, 12)], ops = [];
            let cur = nums[0];
            for (let i = 1; i < len; i++) {
                const divs = []; for (let d = 2; d <= 12; d++) if (cur % d === 0 && d < cur) divs.push(d);
                if (divs.length && rng.bool(0.55)) { const d = rng.pick(divs); ops.push('\\div'); nums.push(d); cur /= d; }
                else { const f = rng.int(2, 6); ops.push('\\times'); nums.push(f); cur *= f; }
            }
            if (cur <= max && ops.includes('\\div') && ops.includes('\\times')) return { nums, ops, size: cur };
        }
    }
    const giveSigns = (rng, nums) => { for (;;) { const xs = nums.map(x => (rng.bool(0.6) ? -x : x)); if (negCount(xs) >= 1) return xs; } };
    const joinOps = (parts, ops) => parts.map((x, i) => (i ? ops[i - 1] : '') + x).join('');

    const tbl = [1, 2, 3, 4, 5, 6];

    CA.register({
        id: 3,

        tutorial: [
            {
                h: 'Multiplying and dividing three or more signed numbers',
                html: R`
                <p>You already know the sign rules for <em>two</em> numbers: like signs give a positive answer, unlike
                   signs give a negative one. With three or more numbers you could go step by step — but there is a
                   much faster way. Every <em>pair</em> of negative signs cancels, so only one thing matters:
                   <strong>how many negative numbers are there?</strong></p>
                <div class="ca-key">
                    <strong>Count the negative multipliers.</strong><br>
                    An <strong>odd</strong> number of negatives → the result is <strong>negative</strong>.<br>
                    An <strong>even</strong> number of negatives → the result is <strong>positive</strong>.<br>
                    If <strong>0</strong> is one of the multipliers, the result is <strong>0</strong>.
                </div>
                <p>So the method has two steps: <strong>decide the sign, then find each absolute value and
                   calculate</strong> with ordinary positive numbers.</p>
                <table>
                    <tr><th>Calculation</th><th>Negatives</th><th>Sign</th><th>Absolute values</th><th>Result</th></tr>
                    <tr><td>\((-2)\times3\times(-5)\)</td><td>2 (even)</td><td>+</td><td>\(2\times3\times5=30\)</td><td>\(30\)</td></tr>
                    <tr><td>\((-2)\times(-3)\times(-5)\)</td><td>3 (odd)</td><td>−</td><td>\(2\times3\times5=30\)</td><td>\(-30\)</td></tr>
                    <tr><td>\((-12)\div3\times(-5)\div(-2)\)</td><td>3 (odd)</td><td>−</td><td>\(12\div3\times5\div2=10\)</td><td>\(-10\)</td></tr>
                    <tr><td>\((-37)\times0\times(-58)\times41\)</td><td>—</td><td></td><td>a 0 multiplier</td><td>\(0\)</td></tr>
                </table>
                <div class="ca-tip"><strong>Division plays by the same rule.</strong> Dividing by a number is the same
                   as multiplying by its reciprocal, and a reciprocal keeps its sign. So in a mixture of × and ÷ you
                   still just count the negative numbers. It works for fractions and decimals too:
                   \(\left(-\frac23\right)\times(-6)\div\left(-\frac12\right)\) has three negatives, so it is
                   \(-\left(\frac23\times6\div\frac12\right)=-8\).</div>
                <div class="ca-warn"><strong>The counting rule is for × and ÷ only.</strong> It says nothing about
                   adding and subtracting: \((-2)+(-3)\) has two negatives but is certainly not positive.</div>`,
            },
            {
                h: 'Powers with a negative base',
                html: R`
                <p>A power is repeated multiplication. The <strong>base</strong> is the number being multiplied and the
                   <strong>exponent</strong> says how many copies there are:</p>
                <div class="ca-formula">\[ (-2)^4 = \underbrace{(-2)\times(-2)\times(-2)\times(-2)}_{4\text{ copies}} = 16 \]</div>
                <p>This is just a product of several negative numbers — so the counting rule from the last section
                   tells us the sign at once. The number of negative multipliers <em>is</em> the exponent.</p>
                <table>
                    <tr><th>Power</th>${tbl.map(n => R`<td>\((-2)^{${n}}\)</td>`).join('')}</tr>
                    <tr><th>Value</th>${tbl.map(n => R`<td>\(${(-2) ** n}\)</td>`).join('')}</tr>
                    <tr><th>Sign</th>${tbl.map(n => R`<td>${sgn(n) > 0 ? '+' : '−'}</td>`).join('')}</tr>
                </table>
                <div class="ca-key"><strong>When \(x\) is negative, \(x^{\text{odd}}\) is negative and \(x^{\text{even}}\) is positive.</strong>
                    \[ (-a)^{\text{even}} = a^{\text{even}} \qquad\qquad (-a)^{\text{odd}} = -\,a^{\text{odd}} \]
                    The <em>size</em> of \((-a)^n\) is just \(a^n\); the exponent's parity gives the sign.</div>
                <ul>
                    <li>\((-3)^4 = 3^4 = 81\) &nbsp; (4 is even) &nbsp; and &nbsp; \((-3)^5 = -3^5 = -243\) &nbsp; (5 is odd).</li>
                    <li>\((-7)^{100}\) is positive and \((-7)^{101}\) is negative — no calculating needed.</li>
                    <li>Powers of \(-1\) just hop between two values: \((-1)^{\text{even}}=1\) and
                        \((-1)^{\text{odd}}=-1\). So \((-1)^{2024}=1\) and \((-1)^{2025}=-1\).</li>
                </ul>
                <div class="ca-tip"><strong>Squares are never negative.</strong> Any number squared — positive or
                   negative — is positive (or zero). The same is true for every even power.</div>`,
            },
            {
                h: 'The bracket trap: −2⁴ is not (−2)⁴',
                html: R`
                <p>This is the most common mistake in the whole topic, so read slowly.</p>
                <table>
                    <tr><th>Written</th><th>Means</th><th>Value</th></tr>
                    <tr><td>\((-2)^4\)</td><td>\((-2)\times(-2)\times(-2)\times(-2)\) — the base is \(-2\)</td><td>\(16\)</td></tr>
                    <tr><td>\(-2^4\)</td><td>\(-(2\times2\times2\times2)\) — the base is \(2\); the minus waits outside</td><td>\(-16\)</td></tr>
                    <tr><td>\(-(-2)^4\)</td><td>the opposite of \((-2)^4\)</td><td>\(-16\)</td></tr>
                    <tr><td>\(-(-2)^3\)</td><td>the opposite of \((-2)^3=-8\)</td><td>\(8\)</td></tr>
                </table>
                <div class="ca-warn"><strong>An exponent only touches what is immediately to its left.</strong> In
                   \(-2^4\) that is the 2, not the minus sign. In \((-2)^4\) it is the whole bracket. Think of
                   \(-2^4\) as \(0-2^4\) or \(-1\times2^4\).</div>
                <p>The same thing happens with fractions and decimals. The exponent must be applied to
                   <em>everything</em> inside the bracket — the sign, the top and the bottom:</p>
                <div class="ca-formula">\[ \left(-\frac{2}{3}\right)^{3} = -\frac{2^3}{3^3} = -\frac{8}{27}
                    \qquad\quad \left(-\frac{2}{3}\right)^{2} = \frac{4}{9} \qquad\quad (-0.2)^3 = -0.008 \]</div>
                <div class="ca-tip"><strong>Decimals:</strong> \(0.2^3\) has \(3\times1=3\) decimal places because
                   \(0.2^3=\dfrac{2^3}{10^3}=\dfrac{8}{1000}\). Change a mixed number to an improper fraction first:
                   \(\left(-1\frac12\right)^2=\left(-\frac32\right)^2=\frac94=2\frac14\).</div>`,
            },
            {
                h: 'Order of operations',
                html: R`
                <p>Powers are worked out <strong>before</strong> multiplying, dividing, adding and subtracting — and
                   before a minus sign in front is applied. The order is:</p>
                <ul>
                    <li><strong>1.</strong> Brackets</li>
                    <li><strong>2.</strong> Powers</li>
                    <li><strong>3.</strong> Multiplication and division, left to right</li>
                    <li><strong>4.</strong> Addition and subtraction, left to right</li>
                </ul>
                <div class="ca-key"><strong>Find the value of the power first, and then calculate the remaining
                   part.</strong> Treat each power as one sealed parcel: work out its value (sign and size), write
                   that number in its place, and only then do the rest.</div>
                <p>Take \(-2^2+(-3)^2-(-1)^5\). Work out the three powers first, keeping each one's sign:</p>
                <div class="ca-formula">\[ \underbrace{-2^2}_{-4} + \underbrace{(-3)^2}_{9} - \underbrace{(-1)^5}_{-1}
                    \;=\; -4+9-(-1) \;=\; 6 \]</div>
                <div class="ca-tip"><strong>Substituting a negative number?</strong> Always put it in brackets. If
                   \(a=-3\) then \(a^2=(-3)^2=9\), and \(-a^2=-(-3)^2=-9\). Writing \(-3^2\) for \(a^2\) is the bracket
                   trap again.</div>
                <div class="ca-warn"><strong>Do not multiply before the power.</strong> \(5-2\times(-3)^2\) is
                   \(5-2\times9=-13\), not \((5-2)\times9\) and not \(5-(-6)^2\).</div>`,
            },
            {
                h: 'Multiplying and dividing powers with a negative base',
                html: R`
                <p>When two powers have the <strong>same base</strong>, count the factors. \((-2)^3\times(-2)^4\) is
                   three copies of \(-2\) followed by four more: seven copies. Dividing <em>cancels</em> copies
                   instead.</p>
                <div class="ca-formula">\[ a^m\times a^n=a^{m+n} \qquad\quad a^m\div a^n=a^{m-n}\;\;(m\ge n) \]
                    \[ a^0=1\;\;(a\ne0) \]</div>
                <p><strong>Why is \(a^0=1\)?</strong> Divide a power by itself: \((-5)^3\div(-5)^3\) is obviously 1,
                   and the rule says it is \((-5)^{3-3}=(-5)^0\). So \((-5)^0=1\) — and the same for every base except 0.</p>
                <div class="ca-key"><strong>First determine the sign (+/−) of the result. Then take the absolute value
                   of the base to calculate.</strong></div>
                <table>
                    <tr><th>Calculation</th><th>One power</th><th>Sign</th><th>Size</th><th>Result</th></tr>
                    <tr><td>\((-2)^3\times(-2)^4\)</td><td>\((-2)^7\)</td><td>7 is odd: −</td><td>\(2^7=128\)</td><td>\(-128\)</td></tr>
                    <tr><td>\((-5)^{12}\div(-5)^{10}\)</td><td>\((-5)^2\)</td><td>2 is even: +</td><td>\(5^2=25\)</td><td>\(25\)</td></tr>
                    <tr><td>\((-3)^{8}\div(-3)^{8}\)</td><td>\((-3)^0\)</td><td></td><td></td><td>\(1\)</td></tr>
                    <tr><td>\((-2)^5\times(-2)^6\div(-2)^8\)</td><td>\((-2)^{5+6-8}=(-2)^3\)</td><td>3 is odd: −</td><td>\(2^3=8\)</td><td>\(-8\)</td></tr>
                </table>
                <div class="ca-tip"><strong>Mixed bases such as \((-2)^5\div2^3\).</strong> The bases \(-2\) and \(2\) have
                   the same absolute value, so the method still works: the sign is negative (5 is odd), and the size
                   is \(2^5\div2^3=2^2=4\). Answer \(-4\).</div>
                <p>Two more rules follow from counting factors in the same way: a power of a power,
                   \(\left(a^m\right)^n=a^{mn}\), and powers with the same exponent, \(a^n\times b^n=(ab)^n\). For example
                   \(\left((-2)^3\right)^2=(-2)^6=64\) and \((-2)^5\times(-5)^5=10^5\).</p>
                <div class="ca-warn"><strong>\(-7^0\) is not \((-7)^0\).</strong> The bracket trap again:
                   \((-7)^0=1\) but \(-7^0=-(7^0)=-1\).</div>`,
            },
            {
                h: 'Comparing powers, long products and patterns',
                html: R`
                <p><strong>Comparing.</strong> Look at the signs first — any positive number beats any negative number.
                   Only if the signs agree do you compare sizes, and remember that for negative numbers the
                   <em>bigger size is the smaller number</em>: \(-32&lt;-16\).</p>
                <ul>
                    <li>\((-2)^{10}&gt;(-2)^{11}\): positive against negative.</li>
                    <li>\((-2)^{5}&lt;(-2)^{3}\): both negative, and \(-32&lt;-8\).</li>
                    <li>\(\left(-\frac12\right)^{2}&gt;\left(-\frac12\right)^{4}\): both positive, and powers of a
                        fraction between 0 and 1 <em>shrink</em>: \(\frac14&gt;\frac1{16}\).</li>
                </ul>
                <p><strong>The sign of a long product.</strong> Count the negative factors. An even number of them
                   gives a positive product; an odd number gives a negative one. A power with an even exponent is
                   positive, so it can be ignored when counting. And a single factor of 0 makes the whole product 0.
                   (This is the rule from the first section, used on powers.)</p>
                <div class="ca-key">\((-2)^5\times(-3)^4\times(-5)^7\times6^3\): the negative factors are \((-2)^5\)
                   and \((-5)^7\). Two negatives — the product is <strong>positive</strong>.</div>
                <p><strong>Sums of powers of −1.</strong> In \((-1)^1+(-1)^2+(-1)^3+\cdots+(-1)^n\) the terms are
                   \(-1,+1,-1,+1,\dots\) Pair them up: each pair adds to 0.</p>
                <ul>
                    <li>If \(n\) is even, everything cancels: the sum is \(0\).</li>
                    <li>If \(n\) is odd, one \(-1\) is left over: the sum is \(-1\).</li>
                </ul>
                <p>The same pairing idea cracks \(-1+2-3+4-\cdots\): each pair \((-1+2), (-3+4), \dots\) adds to \(1\).</p>`,
            },
            {
                h: 'Simple equations with powers',
                html: R`
                <p>Because a negative number squared is positive, <strong>two</strong> different numbers have the same
                   square.</p>
                <div class="ca-key">\[ x^2=49 \quad\Longrightarrow\quad x=7 \;\text{ or }\; x=-7 \]</div>
                <table>
                    <tr><th>Equation</th><th>Solutions</th><th>Why</th></tr>
                    <tr><td>\(x^2=49\)</td><td>\(7\) and \(-7\)</td><td>even power: both signs work</td></tr>
                    <tr><td>\(x^2=-49\)</td><td>none</td><td>a square is never negative</td></tr>
                    <tr><td>\(x^3=-27\)</td><td>\(-3\) only</td><td>odd power keeps the sign of \(x\)</td></tr>
                    <tr><td>\(x^3=27\)</td><td>\(3\) only</td><td>\((-3)^3\) would be \(-27\)</td></tr>
                </table>
                <p>When the unknown is the <em>exponent</em>, use the sign to find out whether it is even or odd, then
                   match the size. To solve \((-2)^n=-32\): the answer is negative, so \(n\) is odd; and \(2^5=32\), so
                   \(n=5\).</p>
                <div class="ca-warn"><strong>Do not forget the second solution.</strong> "\(x^2=49\), so \(x=7\)" is only
                   half an answer, unless the question tells you that \(x\) is positive.</div>`,
            },
        ],

        summary: [
            {
                topic: 'Multiplication / division involving negative numbers (three or more numbers)',
                points: [
                    R`Count the negative multipliers: an <strong>odd</strong> number gives a <strong>negative</strong> result, an <strong>even</strong> number gives a <strong>positive</strong> result. If 0 is one of the multipliers, the result is 0.`,
                    R`Find each absolute value first, and then calculate: \((-2)\times3\times(-5)=+(2\times3\times5)=30\).`,
                ],
            },
            {
                topic: 'Powers with a negative base',
                points: [
                    R`When \(x\) is negative, \(x^{\text{odd}}\) is negative and \(x^{\text{even}}\) is positive.`,
                    R`Find the value of the power first, and then calculate the remaining part. Mind the brackets: \((-2)^4=16\) but \(-2^4=-16\).`,
                ],
            },
            {
                topic: 'Multiplication and division of powers with a negative base',
                points: [
                    R`\(a^m\times a^n=a^{m+n}\), &nbsp; \(a^m\div a^n=a^{m-n}\) \((m\ge n)\), &nbsp; and \(a^0=1\) \((a\ne0)\).`,
                    R`First determine the sign (+/−) of the result. Then take the absolute value of the base to calculate.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Three or more signed numbers',
                q: R`Evaluate (a) \((-4)\times(-5)\times(-3)\) &nbsp; and &nbsp; (b) \((-18)\div(-3)\times2\div(-4)\times(-5)\).`,
                steps: [
                    R`(a) Count the negative numbers: 3, which is odd. The result is negative.`,
                    R`(a) Now use the absolute values: \(4\times5\times3=60\). So the answer is \(-60\).`,
                    R`(b) Count the negative numbers: \(-18,\,-3,\,-4,\,-5\) — four of them, which is even. The result is positive.`,
                    R`(b) Absolute values, left to right: \(18\div3\times2\div4\times5=6\times2\div4\times5=12\div4\times5=3\times5=15\).`,
                ],
                answer: R`(a) \(-60\) &nbsp; (b) \(15\)`,
            },
            {
                title: 'Sign first, then size',
                q: R`Evaluate \((-3)^4\) and \((-3)^5\), and then \(10-2\times(-3)^4\).`,
                steps: [
                    R`The size comes from powers of 3: \(3^4=81\) and \(3^5=243\).`,
                    R`In \((-3)^4\) the exponent is even, so the result is positive: \((-3)^4=81\). In \((-3)^5\) the exponent is odd, so \((-3)^5=-243\).`,
                    R`For \(10-2\times(-3)^4\), find the value of the power first: \((-3)^4=81\).`,
                    R`Then calculate the remaining part: \(10-2\times81=10-162=-152\).`,
                ],
                answer: R`\(81\), \(-243\) and \(-152\)`,
            },
            {
                title: 'The bracket trap in a sum',
                q: R`Evaluate \(-2^4+(-2)^4-(-2)^3\).`,
                steps: [
                    R`\(-2^4\): no bracket, so the base is 2 and the minus sign waits. \(-2^4=-16\).`,
                    R`\((-2)^4\): the base is \(-2\) and the exponent is even. \((-2)^4=16\).`,
                    R`\((-2)^3\): odd exponent, so \((-2)^3=-8\).`,
                    R`Now add and subtract: \(-16+16-(-8)=0+8=8\).`,
                ],
                answer: R`\(8\)`,
            },
            {
                title: 'A negative fraction to a power',
                q: R`Evaluate \(\left(-\dfrac{2}{3}\right)^{3}\times(-3)^{4}\).`,
                steps: [
                    R`The exponent applies to the sign, the top and the bottom: \(\left(-\frac23\right)^3=-\frac{2^3}{3^3}=-\frac{8}{27}\).`,
                    R`\((-3)^4=81\), positive because 4 is even.`,
                    R`Multiply: \(-\frac{8}{27}\times81=-8\times3=-24\).`,
                ],
                answer: R`\(-24\)`,
            },
            {
                title: 'Powers with the same negative base',
                q: R`Evaluate (a) \((-2)^{7}\times(-2)^{9}\div(-2)^{11}\) &nbsp; and &nbsp; (b) \((-6)^{15}\div(-6)^{15}+(-6)^{2}\).`,
                steps: [
                    R`(a) Same base, so add the exponents when multiplying and subtract when dividing: \(7+9-11=5\). The expression is \((-2)^5\).`,
                    R`(a) First determine the sign: 5 is odd, so the result is negative. Then take the absolute value of the base: \(2^5=32\). Answer \(-32\).`,
                    R`(b) \((-6)^{15}\div(-6)^{15}=(-6)^{0}=1\) — any non-zero number to the power 0 is 1.`,
                    R`(b) \((-6)^2=36\) (even exponent, positive). So the value is \(1+36=37\).`,
                ],
                answer: R`(a) \(-32\) &nbsp; (b) \(37\)`,
            },
            {
                title: 'Equations with powers',
                q: R`(a) Find all numbers \(x\) with \(x^2=64\). &nbsp; (b) Find the whole number \(n\) with \((-3)^n=-243\).`,
                steps: [
                    R`(a) \(8^2=64\), and also \((-8)^2=64\) because a negative times a negative is positive. So \(x=8\) or \(x=-8\).`,
                    R`(b) The result \(-243\) is negative, so \(n\) must be odd.`,
                    R`The size: \(3^1=3,\;3^2=9,\;3^3=27,\;3^4=81,\;3^5=243\). So \(n=5\), which is odd as needed.`,
                ],
                answer: R`(a) \(x=8\) or \(x=-8\) &nbsp; (b) \(n=5\)`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'eval-power', name: 'Evaluate a power with a negative base', level: 1,
                gen(rng) {
                    if (rng.bool(0.45)) return bracketTrap(rng);
                    const [a, n] = rng.pick(POWS), v = (-a) ** n;
                    return {
                        q: ask(pw(-a, n)),
                        ans: CA.num(v),
                        sol: R`The exponent ${n} is ${parity(n)}, so the answer is ${signWord(v)}. ${m(R`${a}^{${n}}=${a ** n}`)}, so ${m(R`${pw(-a, n)}=${v}`)}.`,
                    };
                },
            },
            {
                id: 'sign-of-power', name: 'Positive or negative?', level: 1,
                gen(rng) {
                    const a = rng.int(2, 25), n = rng.int(11, 99), form = rng.pick([0, 0, 1, 2]);
                    let t, s, why;
                    if (form === 0) {
                        t = pw(-a, n); s = sgn(n);
                        why = R`The base is ${m(String(-a))} and the exponent ${n} is ${parity(n)}, so the power is ${signWord(s)}.`;
                    } else if (form === 1) {
                        t = negpw(a, n); s = -1;
                        why = R`There is no bracket, so the base is ${a}: ${m(R`${a}^{${n}}`)} is positive, and the minus sign in front makes the result negative (whatever the exponent).`;
                    } else {
                        t = R`-${pw(-a, n)}`; s = -sgn(n);
                        why = R`${n} is ${parity(n)}, so ${m(pw(-a, n))} is ${signWord(sgn(n))}. The minus sign in front flips it: ${signWord(s)}.`;
                    }
                    return {
                        q: R`Without working it out, decide whether ${m(t)} is positive, negative or zero.`,
                        ans: CA.mc(rng, signWord(s), SIGNS, { keepOrder: true }),
                        sol: why,
                    };
                },
            },
            {
                id: 'powers-of-minus-one', name: 'Powers of −1', level: 1,
                gen(rng) {
                    const a = rng.int(12, 999), b = rng.int(12, 999), form = rng.int(0, 5);
                    const one = n => R`${m(R`${pw(-1, n)}=${sgn(n)}`)} (${n} is ${parity(n)})`;
                    let t, v, sol;
                    if (form === 0) { t = pw(-1, a); v = sgn(a); sol = R`${a} is ${parity(a)}, so ${m(R`${t}=${v}`)}.`; }
                    else if (form === 1) { t = R`-1^{${a}}`; v = -1; sol = R`No bracket, so the base is 1: ${m(R`1^{${a}}=1`)}, and the minus sign in front gives ${m('-1')} — whatever the exponent.`; }
                    else if (form === 2) { t = R`${pw(-1, a)}+${pw(-1, b)}`; v = sgn(a) + sgn(b); sol = R`${one(a)} and ${one(b)}. ${m(R`${sgn(a)}+${par(sgn(b))}=${v}`)}.`; }
                    else if (form === 3) { t = R`${pw(-1, a)}-${pw(-1, b)}`; v = sgn(a) - sgn(b); sol = R`${one(a)} and ${one(b)}. ${m(R`${sgn(a)}-${par(sgn(b))}=${v}`)}.`; }
                    else if (form === 4) { t = R`${pw(-1, a)}\times${pw(-1, b)}`; v = sgn(a) * sgn(b); sol = R`Add the exponents: ${m(R`${pw(-1, a + b)}`)}, and ${a + b} is ${parity(a + b)}, so the value is ${m(String(v))}.`; }
                    else { t = R`-${pw(-1, a)}`; v = -sgn(a); sol = R`${one(a)}; the minus sign in front flips it to ${m(String(v))}.`; }
                    return { q: ask(t), ans: CA.num(v), sol };
                },
            },

            {
                id: 'signed-product', name: 'Multiply and divide three or more signed numbers', level: 1,
                gen(rng) {
                    const form = rng.pick([0, 0, 0, 1, 2, 2, 2]);
                    if (form === 1) {               // a zero among the factors
                        const xs = Array.from({ length: rng.int(3, 4) }, () => rng.int(11, 49) * rng.pick([1, -1, -1]));
                        xs.splice(rng.int(0, xs.length), 0, 0);
                        const t = xs.map(par).join('\\times');
                        return { q: ask(t), ans: CA.num(0), sol: R`One of the numbers being multiplied is 0, so the product is ${m('0')} — no other work is needed.` };
                    }
                    if (form === 0) {               // a product
                        let xs;
                        do { xs = Array.from({ length: rng.int(3, 4) }, () => rng.int(1, 6) * rng.pick([1, -1, -1])); }
                        while (negCount(xs) === 0 || Math.abs(xs.reduce((a, b) => a * b)) > 300 || xs.filter(x => Math.abs(x) === 1).length > 1);
                        const size = Math.abs(xs.reduce((a, b) => a * b)), v = sgn(negCount(xs)) * size;
                        return {
                            q: ask(xs.map(par).join('\\times')), ans: CA.num(v),
                            sol: R`${signLine(xs)} Absolute values: ${m(R`${xs.map(Math.abs).join(R`\times`)}=${size}`)}. Answer: ${m(String(v))}.`,
                        };
                    }
                    const c = chain(rng, 3), xs = giveSigns(rng, c.nums), v = sgn(negCount(xs)) * c.size;
                    return {
                        q: ask(joinOps(xs.map(par), c.ops)), ans: CA.num(v),
                        sol: R`${signLine(xs)} Absolute values, left to right: ${m(R`${joinOps(c.nums, c.ops)}=${c.size}`)}. Answer: ${m(String(v))}.`,
                    };
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'order-of-operations', name: 'Order of operations', level: 2,
                gen(rng) {
                    const form = rng.int(0, 4);
                    let t, v, sol;
                    if (form === 0) {               // three powers added and subtracted
                        const first = () => {
                            const k = rng.int(0, 2), a = rng.int(2, 5), n = rng.int(2, 3), e = rng.int(3, 25);
                            return k === 0 ? { t: negpw(a, n), v: -(a ** n) } : k === 1 ? { t: pw(-a, n), v: (-a) ** n } : { t: pw(-1, e), v: sgn(e) };
                        };
                        const later = () => {
                            const k = rng.int(0, 3), a = rng.int(2, 5), n = rng.int(2, 3), e = rng.int(3, 25);
                            return k === 0 ? { t: R`${a}^{${n}}`, v: a ** n } : k <= 2 ? { t: pw(-a, n), v: (-a) ** n } : { t: pw(-1, e), v: sgn(e) };
                        };
                        let terms;
                        do { terms = [first(), later(), later()]; } while (new Set(terms.map(x => x.t)).size < 3);
                        const ops = ['', rng.pick(['+', '-']), rng.pick(['+', '-'])];
                        t = terms.map((x, i) => ops[i] + x.t).join('');
                        v = terms.reduce((s, x, i) => s + (ops[i] === '-' ? -1 : 1) * x.v, 0);
                        sol = R`Powers first: ${terms.map(x => m(R`${x.t}=${x.v}`)).join(', ')}. Then ${m(terms.map((x, i) => ops[i] + (i ? par(x.v) : x.v)).join('') + '=' + v)}.`;
                    } else if (form === 1) {        // p ± q × (−c)^n
                        const p = rng.int(1, 20), q = rng.int(2, 6), c = rng.int(2, 4), n = rng.int(2, 3), op = rng.pick(['+', '-']);
                        const pv = (-c) ** n, w = q * pv;
                        t = R`${p}${op}${q}\times${pw(-c, n)}`;
                        v = op === '+' ? p + w : p - w;
                        sol = R`Power first: ${m(R`${pw(-c, n)}=${pv}`)}. Then multiply: ${m(R`${q}\times${par(pv)}=${w}`)}. Last: ${m(R`${p}${op}${par(w)}=${v}`)}.`;
                    } else if (form === 2) {        // (a − b)^n × c ± d
                        const d0 = rng.int(1, 4), a = rng.int(1, 8), b = a + d0, n = rng.int(2, 3), c = rng.int(2, 5), d = rng.int(1, 15), op = rng.pick(['+', '-']);
                        const pv = (-d0) ** n;
                        t = R`(${a}-${b})^{${n}}\times${c}${op}${d}`;
                        v = pv * c + (op === '+' ? d : -d);
                        sol = R`Bracket first: ${m(R`${a}-${b}=${-d0}`)}. Power: ${m(R`${pw(-d0, n)}=${pv}`)}. Then ${m(R`${pv}\times${c}${op}${d}=${pv * c}${op}${d}=${v}`)}.`;
                    } else if (form === 3) {        // (−a)^n ÷ (−b) ± c
                        const [a, n] = rng.pick(SMALL.filter(([x, k]) => x ** k >= 8));
                        const divs = []; for (let k = 2; k < a ** n; k++) if ((a ** n) % k === 0 && k <= 12) divs.push(k);
                        const b = rng.pick(divs), c = rng.int(1, 12), op = rng.pick(['+', '-']);
                        const pv = (-a) ** n, qv = pv / -b;
                        t = R`${pw(-a, n)}\div(${-b})${op}${c}`;
                        v = qv + (op === '+' ? c : -c);
                        sol = R`Power first: ${m(R`${pw(-a, n)}=${pv}`)}. Divide: ${m(R`${pv}\div(${-b})=${qv}`)}. Then ${m(R`${qv}${op}${c}=${v}`)}.`;
                    } else {                        // −a² × (−b) ± (−c)³
                        const a = rng.int(2, 5), b = rng.int(2, 6), c = rng.int(2, 4), op = rng.pick(['+', '-']);
                        const first = -(a * a) * -b, cube = (-c) ** 3;
                        t = R`-${a}^{2}\times(${-b})${op}${pw(-c, 3)}`;
                        v = first + (op === '+' ? cube : -cube);
                        sol = R`Powers first: ${m(R`-${a}^{2}=${-(a * a)}`)} and ${m(R`${pw(-c, 3)}=${cube}`)}. Multiply: ${m(R`${-(a * a)}\times(${-b})=${first}`)}. Then ${m(R`${first}${op}(${cube})=${v}`)}.`;
                    }
                    return { q: ask(t), ans: CA.num(v), sol };
                },
            },
            {
                id: 'fraction-power', name: 'Negative fractions and decimals to a power', level: 2,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 2, 2, 3]);
                    if (form === 0 || form === 3) {     // (−p/q)^n, or −(−p/q)^n
                        let p, q, n;
                        do { q = rng.int(2, 6); p = rng.int(1, q - 1); n = rng.int(2, 4); } while (CA.gcd(p, q) !== 1 || q ** n > 650);
                        const s = sgn(n) * (form === 3 ? -1 : 1);
                        const t = (form === 3 ? '-' : '') + fpw(p, q, n);
                        return {
                            q: R`${ask(t)} Give your answer as a fraction in lowest terms.`,
                            ans: CA.frac(s * p ** n, q ** n),
                            sol: R`The exponent applies to the sign, the top and the bottom. ${n} is ${parity(n)}, so ${m(R`${fpw(p, q, n)}=${sgn(n) < 0 ? '-' : ''}\frac{${p}^{${n}}}{${q}^{${n}}}=${T.frac(sgn(n) * p ** n, q ** n)}`)}` +
                                (form === 3 ? R`; the minus sign in front then gives ${m(T.frac(s * p ** n, q ** n))}.` : '.'),
                        };
                    }
                    if (form === 1) {                   // a negative mixed number
                        let w, r, q, n;
                        do { w = rng.int(1, 3); q = rng.int(2, 4); r = rng.int(1, q - 1); n = rng.int(2, 3); } while (CA.gcd(r, q) !== 1 || q ** n > 30 || (w * q + r) ** n > 400);
                        const top = w * q + r, s = sgn(n);
                        const t = R`\left(-${w}\frac{${r}}{${q}}\right)^{${n}}`;
                        return {
                            q: R`${ask(t)} Give your answer as a fraction or a mixed number.`,
                            ans: CA.frac(s * top ** n, q ** n, '', { mixed: true }),
                            sol: R`Change to an improper fraction: ${m(R`-${w}\frac{${r}}{${q}}=-\frac{${top}}{${q}}`)}. ${n} is ${parity(n)}, so ${m(R`${fpw(top, q, n)}=${T.frac(s * top ** n, q ** n)}=${T.mixed(s * top ** n, q ** n)}`)}.`,
                        };
                    }
                    // a negative decimal with one decimal place
                    const d = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15]), n = d > 9 ? 2 : rng.int(2, 3);
                    const base = (d / 10).toFixed(1), s = sgn(n);
                    const val = Number((s * d ** n / 10 ** n).toFixed(n));
                    const t = R`(-${base})^{${n}}`;
                    return {
                        q: R`${ask(t)} Give your answer as a decimal.`,
                        ans: CA.num(val, '', { tol: 1e-9, show: m(String(val)) }),
                        sol: R`${n} is ${parity(n)}, so the answer is ${signWord(s)}. ${m(R`${d}^{${n}}=${d ** n}`)}, and ${n} factors with one decimal place each give ${n} decimal places: ${m(String(val))}.`,
                    };
                },
            },
            {
                id: 'rules-evaluate', name: 'Multiply and divide powers with a negative base', level: 2,
                gen(rng) {
                    if (rng.bool(0.2)) return singlePower(rng);
                    const form = rng.pick([0, 0, 1, 1, 2, 3, 4, 5, 5, 5]);
                    // The book's order: decide the sign first, then use the absolute value of the base.
                    const signSize = (a, e) => R`Sign first: ${e} is ${parity(e)}, so the result is ${signWord(sgn(e))}. Then the size: ${m(R`${a}^{${e}}=${a ** e}`)}. Answer: ${m(String((-a) ** e))}.`;
                    let t, v, sol;
                    if (form === 0) {               // product
                        const a = rng.pick([2, 2, 3]), tot = rng.int(4, a === 2 ? 9 : 6), i = rng.int(1, tot - 1), j = tot - i;
                        t = R`${pw(-a, i)}\times${pw(-a, j)}`; v = (-a) ** tot;
                        sol = R`Same base, so add the exponents: ${m(R`${t}=${pw(-a, tot)}`)}. ${signSize(a, tot)}`;
                    } else if (form === 1) {        // quotient with big exponents
                        const a = rng.int(2, 9), d = rng.int(1, a <= 3 ? 4 : a <= 5 ? 3 : 2), j = rng.int(6, 40), i = j + d;
                        t = R`${pw(-a, i)}\div${pw(-a, j)}`; v = (-a) ** d;
                        sol = R`Same base, so subtract the exponents: ${m(R`${t}=${pw(-a, d)}`)}. ${signSize(a, d)}`;
                    } else if (form === 2) {        // power of a power
                        const a = rng.pick([2, 2, 3]);
                        let i, j; do { i = rng.int(2, 4); j = rng.int(2, 3); } while (i * j > (a === 2 ? 9 : 6));
                        t = R`\left(${pw(-a, i)}\right)^{${j}}`; v = (-a) ** (i * j);
                        sol = R`A power of a power: multiply the exponents. ${m(R`${t}=${pw(-a, i * j)}`)}. ${signSize(a, i * j)}`;
                    } else if (form === 3) {        // same exponent: (−a)^n × (±b)^n with ab = 10
                        const [a, b] = rng.pick([[2, 5], [5, 2]]), n = rng.int(2, 6), bneg = rng.bool();
                        const prod = bneg ? a * b : -a * b;
                        t = R`${pw(-a, n)}\times${pw(bneg ? -b : b, n)}`; v = prod ** n;
                        sol = R`Same exponent, so pair the bases up: ${m(R`${t}=\left(${-a}\times${par(bneg ? -b : b)}\right)^{${n}}=${pw(prod, n)}=${v}`)}.`;
                    } else if (form === 4) {        // (−a)^i ÷ a^j
                        const a = rng.int(2, 6), d = rng.int(1, a <= 3 ? 4 : 2), j = rng.int(5, 30), i = j + d, sg = sgn(i) < 0 ? '-' : '';
                        t = R`${pw(-a, i)}\div${a}^{${j}}`; v = sgn(i) * a ** d;
                        sol = R`Sign first: ${i} is ${parity(i)}, so ${m(pw(-a, i))} is ${signWord(sgn(i))} and so is the answer. Then use the absolute value of the base: ${m(R`${a}^{${i}}\div${a}^{${j}}=${a}^{${d}}=${a ** d}`)}. Answer: ${m(String(v))}.`;
                    } else {                        // the zero exponent
                        const a = rng.int(2, 99), b = rng.int(2, 99), i = rng.int(3, 40), sub = rng.int(0, 4);
                        if (sub === 0) { t = pw(-a, 0); v = 1; sol = R`Any non-zero number to the power 0 is 1, so ${m(R`${t}=1`)}.`; }
                        else if (sub === 1) { t = R`-${a}^{0}`; v = -1; sol = R`There is no bracket, so the base is ${a}: ${m(R`${a}^{0}=1`)}. The minus sign in front then gives ${m('-1')}.`; }
                        else if (sub === 2) { t = R`${pw(-a, i)}\div${pw(-a, i)}`; v = 1; sol = R`Subtract the exponents: ${m(R`${t}=${pw(-a, 0)}=1`)}. (Of course: a number divided by itself is 1.)`; }
                        else if (sub === 3) {
                            const c = rng.int(2, 9), o = rng.pick(['+', '-']);
                            t = R`${pw(-a, 0)}${o}${c}\times${pw(-b, 0)}`; v = o === '+' ? 1 + c : 1 - c;
                            sol = R`Both powers are 1, because any non-zero number to the power 0 is 1: ${m(R`1${o}${c}\times1=${v}`)}.`;
                        } else {
                            const [x, n] = rng.pick(SMALL);
                            t = R`${pw(-x, n)}\times${pw(-x, 0)}`; v = (-x) ** n;
                            sol = R`${m(R`${pw(-x, 0)}=1`)}, so this is just ${m(R`${pw(-x, n)}=${v}`)} (${n} is ${parity(n)}, and ${m(R`${x}^{${n}}=${x ** n}`)}).`;
                        }
                    }
                    return { q: ask(t), ans: CA.num(v), sol };
                },
            },
            {
                id: 'compare-powers', name: 'Compare powers', level: 2,
                gen(rng) {
                    if (rng.bool(0.3)) return greatestLeast(rng);
                    const form = rng.int(0, 4);
                    let A, B, why;      // each { t, v: [BigInt num, BigInt den] }
                    const I = (t, n) => ({ t, v: [n, 1n] });
                    if (form === 0) {
                        const a = rng.int(2, 9), i = rng.int(5, 30);
                        A = I(pw(-a, i), big(-a, i)); B = I(pw(-a, i + 1), big(-a, i + 1));
                        why = R`${m(A.t)} is ${signWord(sgn(i))} (${i} is ${parity(i)}) and ${m(B.t)} is ${signWord(-sgn(i))}. A positive number is greater than a negative number.`;
                    } else if (form === 1) {
                        const a = rng.int(2, 9), n = rng.int(2, 9);
                        A = I(negpw(a, n), -big(a, n)); B = I(pw(-a, n), big(-a, n));
                        why = n % 2 ? R`${m(A.t)} means ${m(R`-(${a}^{${n}})`)}. Because ${n} is odd, ${m(B.t)} is also ${m(R`-${a}^{${n}}`)}. They are equal.`
                            : R`${m(A.t)} means ${m(R`-(${a}^{${n}})`)}, which is negative. ${m(B.t)} is positive because ${n} is even.`;
                    } else if (form === 2) {
                        const [a, b] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 2), n = rng.int(3, 15);
                        A = I(pw(-a, n), big(-a, n)); B = I(pw(-b, n), big(-b, n));
                        why = n % 2 ? R`${n} is odd, so both are negative. ${m(R`${Math.max(a, b)}^{${n}}`)} is the bigger size, so ${m(pw(-Math.max(a, b), n))} is further below zero — it is the smaller number.`
                            : R`${n} is even, so both are positive: compare ${m(R`${a}^{${n}}`)} with ${m(R`${b}^{${n}}`)}. The bigger base gives the bigger power.`;
                    } else if (form === 3) {
                        const q = rng.int(2, 5), i = rng.int(2, 7);
                        A = { t: fpw(1, q, i), v: [BigInt(sgn(i)), big(q, i)] }; B = { t: fpw(1, q, i + 2), v: [BigInt(sgn(i)), big(q, i + 2)] };
                        why = i % 2 ? R`Both exponents are odd, so both are negative. Powers of ${m(R`\frac{1}{${q}}`)} shrink, so ${m(B.t)} is closer to zero — and for negative numbers, closer to zero means greater.`
                            : R`Both exponents are even, so both are positive. Powers of ${m(R`\frac{1}{${q}}`)} shrink as the exponent grows, so the smaller exponent gives the greater number.`;
                    } else {
                        const a = rng.int(2, 9), i = rng.int(3, 20);
                        A = I(pw(-a, i), big(-a, i)); B = I(pw(-a, i + 2), big(-a, i + 2));
                        why = i % 2 ? R`Both exponents are odd, so both are negative. ${m(B.t)} has the bigger size, so it is further below zero — the smaller number.`
                            : R`Both exponents are even, so both are positive, and the bigger exponent gives the bigger number.`;
                    }
                    if (rng.bool()) [A, B] = [B, A];
                    const sym = cmp(A.v, B.v);
                    const S = { '<': m('<'), '>': m('>'), '=': m('=') };
                    return {
                        q: R`Which symbol belongs in the box? \[ ${A.t}\;\;\square\;\;${B.t} \]`,
                        ans: CA.mc(rng, S[sym], [S['<'], S['>'], S['=']], { keepOrder: true }),
                        sol: R`${why} So ${m(R`${A.t}${sym}${B.t}`)}.`,
                    };
                },
            },
            {
                id: 'sign-of-product', name: 'Sign of a long product or quotient', level: 2,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 2, 3, 4, 5, 5, 5, 6]);
                    let q, s, sol;
                    if (form === 0) {               // a product of powers
                        const k = rng.int(3, 4), bases = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 11], k);
                        const fs = bases.map((b, i) => ({ b: (i === 0 || rng.bool(0.65)) ? -b : b, n: rng.int(2, 15) }));
                        const neg = fs.filter(f => f.b < 0 && f.n % 2);
                        s = sgn(neg.length);
                        q = R`Without working it out, decide whether this product is positive, negative or zero: \[ ${fs.map(f => pw(f.b, f.n)).join('\\times')} \]`;
                        sol = (neg.length ? R`The negative factors are the negative bases with odd exponents: ${neg.map(f => m(pw(f.b, f.n))).join(', ')}. That is ${neg.length} negative factor${neg.length > 1 ? 's' : ''}` : 'Every negative base has an even exponent, so there are 0 negative factors') +
                            R` — an ${parity(neg.length)} number — so the product is ${signWord(s)}.`;
                    } else if (form === 1) {        // counted factors
                        const p = rng.int(5, 40), k = rng.int(2, 30);
                        s = sgn(p);
                        q = R`${p} negative numbers and ${k} positive numbers are multiplied together. Is the product positive, negative or zero?`;
                        sol = R`Only the negative factors matter: ${p} is ${parity(p)}, so the product is ${signWord(s)}.`;
                    } else if (form === 2) {        // (−1)(−2)…(−n)
                        const n = rng.int(8, 60);
                        s = sgn(n);
                        q = R`Is the product \((-1)\times(-2)\times(-3)\times\cdots\times(${-n})\) positive, negative or zero?`;
                        sol = R`There are ${n} factors, all negative. ${n} is ${parity(n)}, so the product is ${signWord(s)}.`;
                    } else if (form === 3) {        // integers from −a to b, through zero
                        const a = rng.int(3, 30), b = rng.int(2, 30);
                        s = 0;
                        q = R`All the whole numbers from ${m(String(-a))} to ${m(String(b))} (including both) are multiplied together. Is the product positive, negative or zero?`;
                        sol = R`The list runs from ${m(String(-a))} up to ${m(String(b))}, so it includes 0. Anything multiplied by 0 is zero.`;
                    } else if (form === 5 || form === 6) {   // plain signed numbers, too big to work out
                        const k = rng.int(5, 7), xs = rng.sample([13, 17, 19, 23, 27, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71], k).map(x => (rng.bool(0.6) ? -x : x));
                        const ops = xs.slice(1).map(() => (rng.bool(0.3) ? '\\div' : '\\times')), parts = xs.map(par);
                        if (form === 6) { const at = rng.int(1, k - 1); parts.splice(at, 0, '0'); ops.splice(at - 1, 0, '\\times'); }
                        const neg = negCount(xs);
                        s = form === 6 ? 0 : sgn(neg);
                        q = R`Without working it out, decide whether the result is positive, negative or zero: \[ ${joinOps(parts, ops)} \]`;
                        sol = form === 6 ? R`One of the numbers being multiplied is 0, so the result is zero.`
                            : R`Count the negative numbers: there ${neg === 1 ? 'is' : 'are'} ${neg}. ${neg === 0 ? 'With none' : R`${neg} is ${parity(neg)}`}, so the result is ${signWord(s)}. (Dividing follows the same sign rule as multiplying.)`;
                    } else {                        // integers from −a to −b
                        const b = rng.int(1, 12), a = b + rng.int(4, 30), cnt = a - b + 1;
                        s = sgn(cnt);
                        q = R`All the whole numbers from ${m(String(-a))} to ${m(String(-b))} (including both) are multiplied together. Is the product positive, negative or zero?`;
                        sol = R`There are ${m(R`${a}-${b}+1=${cnt}`)} factors, all negative. ${cnt} is ${parity(cnt)}, so the product is ${signWord(s)}.`;
                    }
                    return { q, ans: CA.mc(rng, signWord(s), SIGNS, { keepOrder: true }), sol };
                },
            },
            {
                id: 'solve-power-equation', name: 'Equations with powers', level: 2,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 2, 3, 3]);
                    if (form === 0) {               // (−a)^n = v
                        const [a, n] = rng.pick(POWS.filter(([x]) => x <= 5)), v = (-a) ** n;
                        return {
                            q: R`Find the whole number ${m('n')} for which ${m(R`(${-a})^{n}=${v}`)}.`,
                            ans: CA.num(n),
                            sol: R`${m(String(v))} is ${signWord(v)}, so ${m('n')} is ${parity(n)}. For the size, ${m(R`${a}^{${n}}=${a ** n}`)}. So ${m(R`n=${n}`)}.`,
                        };
                    }
                    if (form === 1) {               // odd power: one solution
                        const [k, n] = rng.pick([[2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [10, 3], [2, 5], [3, 5], [2, 7]]), s = rng.pick([-1, -1, 1]);
                        return {
                            q: R`Find the number ${m('x')} for which ${m(R`x^{${n}}=${s * k ** n}`)}.`,
                            ans: CA.num(s * k),
                            sol: R`${m(R`${k}^{${n}}=${k ** n}`)}. An odd power keeps the sign of ${m('x')}, so ${m('x')} must be ${signWord(s)}: ${m(R`x=${s * k}`)}.`,
                        };
                    }
                    if (form === 2) {               // even power, told the sign
                        const [k, n] = rng.pick([[2, 4], [3, 4], [4, 4], [5, 4], [2, 6], [4, 2], [6, 2], [7, 2], [8, 2], [9, 2], [11, 2], [12, 2], [13, 2], [15, 2], [20, 2]]);
                        return {
                            q: R`The number ${m('x')} is negative and ${m(R`x^{${n}}=${k ** n}`)}. Find ${m('x')}.`,
                            ans: CA.num(-k),
                            sol: R`${m(R`${k}^{${n}}=${k ** n}`)} and also ${m(R`${pw(-k, n)}=${k ** n}`)}, because ${n} is even. Since ${m('x')} is negative, ${m(R`x=${-k}`)}.`,
                        };
                    }
                    // which values work?
                    const k = rng.int(2, 12), kind = rng.pick(['sq', 'sq', 'negsq', 'negcube', 'cube', 'fourth']);
                    const opt = { pos: R`${m(R`x=${k}`)} only`, neg: R`${m(R`x=${-k}`)} only`, both: R`${m(R`x=${k}`)} or ${m(R`x=${-k}`)}`, none: R`no number works` };
                    const K = { sq: [R`x^{2}=${k * k}`, 'both', R`Both ${m(R`${k}^{2}`)} and ${m(R`(${-k})^{2}`)} equal ${k * k}, so there are two solutions.`],
                        negsq: [R`x^{2}=${-k * k}`, 'none', R`A square is never negative, so no number works.`],
                        negcube: [R`x^{3}=${-(k ** 3)}`, 'neg', R`${m(R`(${-k})^{3}=${-(k ** 3)}`)}, but ${m(R`${k}^{3}=${k ** 3}`)} has the wrong sign. Only ${m(R`x=${-k}`)} works.`],
                        cube: [R`x^{3}=${k ** 3}`, 'pos', R`${m(R`${k}^{3}=${k ** 3}`)}, but ${m(R`(${-k})^{3}=${-(k ** 3)}`)} has the wrong sign. Only ${m(R`x=${k}`)} works.`],
                        fourth: [R`x^{4}=${Math.min(k, 5) ** 4}`, 'both', ''] }[kind];
                    if (kind === 'fourth') {
                        const j = Math.min(k, 5);
                        Object.assign(opt, { pos: R`${m(R`x=${j}`)} only`, neg: R`${m(R`x=${-j}`)} only`, both: R`${m(R`x=${j}`)} or ${m(R`x=${-j}`)}` });
                        K[2] = R`4 is even, so both ${m(R`${j}^{4}`)} and ${m(R`(${-j})^{4}`)} equal ${j ** 4}: two solutions.`;
                    }
                    return {
                        q: R`Which numbers ${m('x')} make ${m(K[0])} true?`,
                        ans: CA.mc(rng, opt[K[1]], [opt.pos, opt.neg, opt.both, opt.none]),
                        sol: K[2],
                    };
                },
            },
            {
                id: 'substitute', name: 'Substitute negative numbers', level: 2,
                gen(rng) {
                    const a = -rng.int(2, 5), b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
                    const A = R`(${a})`, B = par(b);
                    const E = rng.pick([
                        { t: 'a^{2}+b', sub: R`${A}^{2}+${B}`, mid: R`${a * a}+${B}`, v: a * a + b },
                        { t: '-a^{2}+b', sub: R`-${A}^{2}+${B}`, mid: R`${-a * a}+${B}`, v: -a * a + b },
                        { t: 'a^{3}-b^{2}', sub: R`${A}^{3}-${B}^{2}`, mid: R`${a ** 3}-${b * b}`, v: a ** 3 - b * b },
                        { t: '(a-b)^{2}', sub: R`(${a}-${B})^{2}`, mid: R`${par(a - b)}^{2}`, v: (a - b) ** 2 },
                        { t: 'a^{2}b', sub: R`${A}^{2}\times${B}`, mid: R`${a * a}\times${B}`, v: a * a * b },
                        { t: 'ab^{2}-a', sub: R`${A}\times${B}^{2}-${A}`, mid: R`${a * b * b}+${-a}`, v: a * b * b - a },
                        { t: '-a^{3}', sub: R`-${A}^{3}`, mid: R`-(${a ** 3})`, v: -(a ** 3) },
                        { t: 'a^{2}-2ab+b^{2}', sub: R`${A}^{2}-2\times${A}\times${B}+${B}^{2}`, mid: R`${a * a}-${par(2 * a * b)}+${b * b}`, v: a * a - 2 * a * b + b * b },
                        { t: '(-a)^{3}+b^{2}', sub: R`(-${A})^{3}+${B}^{2}`, mid: R`${-a}^{3}+${b * b}`, v: (-a) ** 3 + b * b },
                        { t: '-b^{2}-a^{2}', sub: R`-${B}^{2}-${A}^{2}`, mid: R`${-b * b}-${a * a}`, v: -b * b - a * a },
                        { t: 'b-a^{3}', sub: R`${b}-${A}^{3}`, mid: R`${b}-(${a ** 3})`, v: b - a ** 3 },
                    ]);
                    return {
                        q: R`If ${m(R`a=${a}`)} and ${m(R`b=${b}`)}, find the value of ${m(E.t)}.`,
                        ans: CA.num(E.v),
                        sol: R`Put each negative number in brackets: ${m(R`${E.t}=${E.sub}=${E.mid}=${E.v}`)}.`,
                    };
                },
            },

            {
                id: 'signed-mult-div', name: 'Longer products and quotients (fractions and decimals too)', level: 2,
                gen(rng) {
                    const form = rng.pick([0, 0, 1, 1, 2]);
                    if (form === 0) {               // four or five whole numbers
                        const c = chain(rng, rng.int(4, 5), 600), xs = giveSigns(rng, c.nums), v = sgn(negCount(xs)) * c.size;
                        return {
                            q: ask(joinOps(xs.map(par), c.ops)), ans: CA.num(v),
                            sol: R`${signLine(xs)} Absolute values, left to right: ${m(R`${joinOps(c.nums, c.ops)}=${c.size}`)}. Answer: ${m(String(v))}.`,
                        };
                    }
                    if (form === 1) {               // fractions and whole numbers
                        for (;;) {
                            const k = rng.int(3, 4), items = [], ops = [];
                            for (let i = 0; i < k; i++) {
                                const neg = rng.bool(0.6);
                                if (rng.bool(0.5)) { let p, q; do { q = rng.int(2, 6); p = rng.int(1, 7); } while (CA.gcd(p, q) !== 1 || p === q); items.push({ n: p, d: q, neg, frac: true }); }
                                else items.push({ n: rng.int(2, 12), d: 1, neg, frac: false });
                                if (i) ops.push(rng.bool(0.35) ? '\\div' : '\\times');
                            }
                            const nf = items.filter(x => x.frac).length, negs = items.filter(x => x.neg).length;
                            if (nf === 0 || nf === k || negs < 2) continue;
                            let [n, d] = [items[0].n, items[0].d];
                            items.slice(1).forEach((x, i) => { if (ops[i] === '\\times') { n *= x.n; d *= x.d; } else { n *= x.d; d *= x.n; } });
                            [n, d] = CA.reduce(n, d);
                            if (d > 12 || n > 150) continue;
                            const mag = x => (x.frac ? R`\frac{${x.n}}{${x.d}}` : R`${x.n}`);
                            const show = x => (x.neg ? (x.frac ? R`\left(-${mag(x)}\right)` : R`(-${x.n})`) : mag(x));
                            const s = sgn(negs);
                            return {
                                q: R`${ask(joinOps(items.map(show), ops))} Give a whole number or a fraction in lowest terms.`,
                                ans: CA.frac(s * n, d),
                                sol: R`There are ${negWords(negs)} — an ${parity(negs)} count — so the result is ${signWord(s)}. Absolute values (dividing by a fraction means multiplying by its reciprocal): ${m(R`${joinOps(items.map(mag), ops)}=${T.frac(n, d)}`)}. Answer: ${m(T.frac(s * n, d))}.`,
                            };
                        }
                    }
                    // decimals with one decimal place, and whole numbers
                    const ds = rng.sample([2, 3, 4, 5, 6, 12, 15, 25], 2), ints = rng.sample([2, 3, 4, 5, 6, 8, 10], rng.int(1, 2));
                    const mags = rng.shuffle([...ds.map(x => (x / 10).toFixed(1)), ...ints.map(String)]);
                    const negs = mags.map(() => rng.bool(0.6)); if (!negs.includes(true)) negs[0] = true;
                    const k = negs.filter(Boolean).length, s = sgn(k);
                    const size = Number((ds[0] * ds[1] * ints.reduce((a, b) => a * b, 1) / 100).toFixed(2)), v = s * size;
                    return {
                        q: ask(mags.map((x, i) => (negs[i] ? R`(-${x})` : x)).join('\\times')),
                        ans: CA.num(v, '', { tol: 1e-9, show: m(String(v)) }),
                        sol: R`There ${k === 1 ? 'is' : 'are'} ${negWords(k)} — an ${parity(k)} count — so the result is ${signWord(s)}. Absolute values: ${m(R`${mags.join(R`\times`)}=${size}`)}. Answer: ${m(String(v))}.`,
                    };
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'mixed-expression', name: 'Mixed expressions', level: 3,
                gen(rng) {
                    const form = rng.int(0, 5);
                    let t, v, sol;
                    if (form === 0) {               // (−a)³ × (−1/a)² − (−b)² ÷ (−1)^k
                        const a = rng.int(2, 6), b = rng.int(2, 7), k = rng.int(5, 40);
                        const second = b * b / sgn(k);
                        t = R`${pw(-a, 3)}\times${fpw(1, a, 2)}-${pw(-b, 2)}\div${pw(-1, k)}`;
                        v = -a - second;
                        sol = R`${m(R`${pw(-a, 3)}\times${fpw(1, a, 2)}=${(-a) ** 3}\times\frac{1}{${a * a}}=${-a}`)}. ${m(R`${pw(-b, 2)}\div${pw(-1, k)}=${b * b}\div${par(sgn(k))}=${second}`)}. So ${m(R`${-a}-${par(second)}=${v}`)}.`;
                    } else if (form === 1) {        // (−p/q)² × (−q)³ + c
                        let p, q; do { q = rng.int(2, 5); p = rng.int(1, 6); } while (CA.gcd(p, q) !== 1 || p === q);
                        const c = rng.int(1, 30), op = rng.pick(['+', '-']);
                        const first = -p * p * q;
                        t = R`${fpw(p, q, 2)}\times${pw(-q, 3)}${op}${c}`;
                        v = first + (op === '+' ? c : -c);
                        sol = R`${m(R`${fpw(p, q, 2)}=\frac{${p * p}}{${q * q}}`)} and ${m(R`${pw(-q, 3)}=${(-q) ** 3}`)}. Their product is ${m(R`\frac{${p * p}}{${q * q}}\times(${(-q) ** 3})=${first}`)}. Then ${m(R`${first}${op}${c}=${v}`)}.`;
                    } else if (form === 2) {        // [(−a)² − (−b)³] ÷ (−d)
                        let a, b, d, inside;
                        do { a = rng.int(2, 9); b = rng.int(2, 4); d = rng.int(2, 9); inside = a * a + b ** 3; } while (inside % d !== 0 || inside === d);
                        t = R`\left[${pw(-a, 2)}-${pw(-b, 3)}\right]\div(${-d})`;
                        v = inside / -d;
                        sol = R`Inside the bracket: ${m(R`${pw(-a, 2)}=${a * a}`)} and ${m(R`${pw(-b, 3)}=${-(b ** 3)}`)}, so ${m(R`${a * a}-(${-(b ** 3)})=${inside}`)}. Then ${m(R`${inside}\div(${-d})=${v}`)}.`;
                    } else if (form === 3) {        // −a² ± (−a)² ± (−a)³ ÷ a
                        const a = rng.int(2, 9), o1 = rng.pick(['+', '-']), o2 = rng.pick(['+', '-']);
                        const sq = a * a, third = -sq;
                        t = R`-${a}^{2}${o1}${pw(-a, 2)}${o2}${pw(-a, 3)}\div${a}`;
                        v = -sq + (o1 === '+' ? sq : -sq) + (o2 === '+' ? third : -third);
                        sol = R`${m(R`-${a}^{2}=${-sq}`)}, ${m(R`${pw(-a, 2)}=${sq}`)}, and ${m(R`${pw(-a, 3)}\div${a}=${(-a) ** 3}\div${a}=${third}`)}. So ${m(R`${-sq}${o1}${sq}${o2}(${third})=${v}`)}.`;
                    } else if (form === 4) {        // (−1)^i × (−a)³ − (−b)² × (−1)^j
                        const a = rng.int(2, 5), b = rng.int(2, 9), i = rng.int(11, 99), j = rng.int(11, 99);
                        const x = sgn(i) * (-a) ** 3, y = b * b * sgn(j);
                        t = R`${pw(-1, i)}\times${pw(-a, 3)}-${pw(-b, 2)}\times${pw(-1, j)}`;
                        v = x - y;
                        sol = R`${m(R`${pw(-1, i)}=${sgn(i)}`)} and ${m(R`${pw(-1, j)}=${sgn(j)}`)}. So the expression is ${m(R`${par(sgn(i))}\times(${(-a) ** 3})-${b * b}\times${par(sgn(j))}=${x}-${par(y)}=${v}`)}.`;
                    } else {                        // (−1/2)^i × (−2)^j ± c
                        const q = rng.pick([2, 2, 3]), i = rng.int(2, 5), d = rng.int(1, q === 2 ? 4 : 3), j = i + d, c = rng.int(1, 20), op = rng.pick(['+', '-']);
                        const first = sgn(i + j) * q ** d;
                        t = R`${fpw(1, q, i)}\times${pw(-q, j)}${op}${c}`;
                        v = first + (op === '+' ? c : -c);
                        sol = R`${m(R`${fpw(1, q, i)}=${T.frac(sgn(i), q ** i)}`)} and ${m(R`${pw(-q, j)}=${(-q) ** j}`)}. Their product is ${m(R`${T.frac(sgn(i), q ** i)}\times${par((-q) ** j)}=${first}`)}. Then ${m(R`${first}${op}${c}=${v}`)}.`;
                    }
                    return { q: ask(t), ans: CA.num(v), sol };
                },
            },
            {
                id: 'patterns', name: 'Patterns with powers', level: 3,
                gen(rng) {
                    if (rng.bool(0.3)) return sumOfOnes(rng);
                    const form = rng.pick([0, 0, 1, 2, 2, 3]);
                    if (form === 0) {               // −1 + 2 − 3 + 4 − …
                        const n = rng.int(20, 200);
                        let v = 0; for (let k = 1; k <= n; k++) v += sgn(k) * k;
                        const pairs = Math.floor(n / 2);
                        return {
                            q: R`${ask(R`(-1)^{1}\times1+(-1)^{2}\times2+(-1)^{3}\times3+\cdots+(-1)^{${n}}\times${n}`)}`,
                            ans: CA.num(v),
                            sol: R`The sum is ${m(R`-1+2-3+4-\cdots`)}. Each pair ${m(R`(-1+2),(-3+4),\dots`)} adds to 1, and there are ${pairs} pairs` +
                                (n % 2 ? R`, with the last term ${m(String(-n))} left over: ${m(R`${pairs}-${n}=${v}`)}.` : R`: the sum is ${m(String(v))}.`),
                        };
                    }
                    if (form === 1) {               // product of powers of −1
                        const n = rng.int(10, 120), tot = n * (n + 1) / 2;
                        let v = 1; for (let k = 1; k <= n; k++) v *= sgn(k);
                        return {
                            q: R`${ask(R`(-1)^{1}\times(-1)^{2}\times(-1)^{3}\times\cdots\times(-1)^{${n}}`)}`,
                            ans: CA.num(v),
                            sol: R`Add the exponents: ${m(R`1+2+3+\cdots+${n}=\frac{${n}\times${n + 1}}{2}=${tot}`)}. ${tot} is ${parity(tot)}, so the product is ${m(R`${pw(-1, tot)}=${v}`)}.`,
                        };
                    }
                    if (form === 2) {               // (−a)^n + (−a)^(n+1) = k × a^n
                        const a = rng.int(2, 6), n = rng.int(8, 30), minus = rng.bool(0.4);
                        const lhs = minus ? big(-a, n) - big(-a, n + 1) : big(-a, n) + big(-a, n + 1);
                        const k = Number(lhs / big(a, n));
                        const inner = minus ? R`1-(${-a})` : R`1+(${-a})`, innerV = minus ? 1 + a : 1 - a;
                        return {
                            q: R`The number ${m(R`${pw(-a, n)}${minus ? '-' : '+'}${pw(-a, n + 1)}`)} can be written as ${m(R`k\times${a}^{${n}}`)}. Find ${m('k')}.`,
                            ans: CA.num(k),
                            sol: R`${m(R`${pw(-a, n + 1)}=${pw(-a, n)}\times(${-a})`)}, so the expression is ${m(R`${pw(-a, n)}\times\left[${inner}\right]=${pw(-a, n)}\times${par(innerV)}`)}. Since ${n} is ${parity(n)}, ${m(R`${pw(-a, n)}=${sgn(n) < 0 ? '-' : ''}${a}^{${n}}`)}, so ${m(R`k=${k}`)}.`,
                        };
                    }
                    // expressions that do not depend on n
                    const pool = [
                        { t: '(-1)^{2n}', f: n => sgn(2 * n), why: R`\(2n\) is even` },
                        { t: '(-1)^{2n+1}', f: n => sgn(2 * n + 1), why: R`\(2n+1\) is odd` },
                        { t: '(-1)^{n}\\times(-1)^{n+1}', f: n => sgn(n) * sgn(n + 1), why: R`the exponents add to \(2n+1\), odd` },
                        { t: '(-1)^{4n-1}', f: n => sgn(4 * n - 1), why: R`\(4n-1\) is odd` },
                        { t: '(-1)^{2n+2}', f: n => sgn(2 * n + 2), why: R`\(2n+2\) is even` },
                        { t: '\\left[(-1)^{n}\\right]^{2}', f: n => sgn(n) ** 2, why: R`a square of \(\pm1\)` },
                        { t: '(-1)^{n}\\times(-1)^{n}', f: n => sgn(n) * sgn(n), why: R`the exponents add to \(2n\), even` },
                    ];
                    const ts = rng.sample(pool, 3), ops = ['', rng.pick(['+', '-']), rng.pick(['+', '-'])], c = [rng.int(1, 5), rng.int(2, 6), rng.int(2, 6)];
                    const vals = ts.map(x => x.f(5));
                    const v = vals.reduce((s, x, i) => s + (ops[i] === '-' ? -1 : 1) * c[i] * x, 0);
                    const t = ts.map((x, i) => R`${ops[i]}${c[i] === 1 ? '' : c[i] + '\\times'}${x.t}`).join('');
                    return {
                        q: R`${m('n')} is a positive whole number. Find the value of \[ ${t} \]`,
                        ans: CA.num(v),
                        sol: R`Whatever ${m('n')} is: ` + ts.map((x, i) => R`${m(R`${x.t}=${vals[i]}`)} (${x.why})`).join(', ') + R`. So the value is ${m(vals.map((x, i) => R`${ops[i]}${c[i] === 1 ? '' : c[i] + '\\times'}${par(x)}`).join('') + '=' + v)}.`,
                    };
                },
            },
            {
                id: 'rules-chain', name: 'Chains of powers with a negative base', level: 3,
                gen(rng) {
                    const a = rng.pick([2, 2, 3, 3, 4, 5, 10]), lim = { 2: 7, 3: 5, 4: 4, 5: 3, 10: 4 }[a], form = rng.int(0, 4);
                    const d = rng.int(form === 1 ? 1 : 0, lim);
                    const end = e => (e === 0 ? R`Any non-zero number to the power 0 is 1.`
                        : R`Sign first: ${e} is ${parity(e)}, so the result is ${signWord(sgn(e))}. Size: ${m(R`${a}^{${e}}=${a ** e}`)}. Answer: ${m(String((-a) ** e))}.`);
                    let t, v, sol;
                    if (form === 0) {               // (−a)^i × (−a)^j ÷ (−a)^k
                        const k = rng.int(5, 20), i = rng.int(2, k + d - 2), j = k + d - i;
                        t = R`${pw(-a, i)}\times${pw(-a, j)}\div${pw(-a, k)}`; v = (-a) ** d;
                        sol = R`Add, then subtract, the exponents: ${m(R`${i}+${j}-${k}=${d}`)}, so the expression is ${m(pw(-a, d))}. ${end(d)}`;
                    } else if (form === 1) {        // (−a)^i × (−a)^j ÷ a^k
                        const k = rng.int(5, 20), i = rng.int(2, k + d - 2), j = k + d - i, sg = sgn(i + j);
                        t = R`${pw(-a, i)}\times${pw(-a, j)}\div${a}^{${k}}`; v = sg * a ** d;
                        sol = R`Sign first: ${m(R`${pw(-a, i)}\times${pw(-a, j)}=${pw(-a, i + j)}`)}, and ${i + j} is ${parity(i + j)}, so the result is ${signWord(sg)}. Then use the absolute value of the base: ${m(R`${a}^{${i + j}}\div${a}^{${k}}=${a}^{${d}}=${a ** d}`)}. Answer: ${m(String(v))}.`;
                    } else if (form === 2) {        // [(−a)^i]^j ÷ (−a)^k
                        let i, j; do { i = rng.int(2, 6); j = rng.int(2, 4); } while (i * j - d < 2);
                        const k = i * j - d;
                        t = R`\left[${pw(-a, i)}\right]^{${j}}\div${pw(-a, k)}`; v = (-a) ** d;
                        sol = R`${m(R`\left[${pw(-a, i)}\right]^{${j}}=${pw(-a, i * j)}`)} (${j} lots of ${i} factors). Then subtract the exponents: ${m(R`${i * j}-${k}=${d}`)}, giving ${m(pw(-a, d))}. ${end(d)}`;
                    } else if (form === 3) {        // (−a)^i × (−a)^j ÷ [(−a)^k × (−a)^l]
                        const k = rng.int(3, 12), l = rng.int(3, 12), i = rng.int(2, k + l + d - 2), j = k + l + d - i;
                        t = R`${pw(-a, i)}\times${pw(-a, j)}\div\left[${pw(-a, k)}\times${pw(-a, l)}\right]`; v = (-a) ** d;
                        sol = R`Top: ${m(R`${pw(-a, i)}\times${pw(-a, j)}=${pw(-a, i + j)}`)}. Bracket: ${m(R`${pw(-a, k)}\times${pw(-a, l)}=${pw(-a, k + l)}`)}. Dividing: ${m(R`${i + j}-${k + l}=${d}`)}, giving ${m(pw(-a, d))}. ${end(d)}`;
                    } else {                        // (−a)^(n+e) ÷ (−a)^n ± (−a)^k ÷ (−a)^k
                        const e = rng.int(1, Math.min(lim, 4)), n = rng.int(5, 30), k = rng.int(5, 30), o = rng.pick(['+', '-']), c = rng.int(2, 9);
                        const first = (-a) ** e;
                        t = R`${pw(-a, n + e)}\div${pw(-a, n)}${o}${c}\times${pw(-a, k)}\div${pw(-a, k)}`; v = o === '+' ? first + c : first - c;
                        sol = R`${m(R`${pw(-a, n + e)}\div${pw(-a, n)}=${pw(-a, e)}=${first}`)} and ${m(R`${pw(-a, k)}\div${pw(-a, k)}=${pw(-a, 0)}=1`)}. So the value is ${m(R`${first}${o}${c}\times1=${v}`)}.`;
                    }
                    return { q: ask(t), ans: CA.num(v), sol };
                },
            },
        ],

        assignment: [
            ['signed-product', 5], ['eval-power', 5], ['sign-of-power', 3], ['powers-of-minus-one', 2],
            ['signed-mult-div', 4], ['sign-of-product', 3], ['order-of-operations', 4], ['fraction-power', 3], ['rules-evaluate', 6],
            ['compare-powers', 2], ['solve-power-equation', 1], ['substitute', 1],
            ['rules-chain', 4], ['mixed-expression', 4], ['patterns', 3],
        ],
    });
})();
