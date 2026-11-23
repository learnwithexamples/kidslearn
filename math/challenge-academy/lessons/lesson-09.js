/* Challenge Academy — Lesson 9: Basic Square Roots and Irrational Numbers */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, T = CA.tex;

    // ── Small helpers ────────────────────────────────────────────────────
    const sq = x => R`\sqrt{${x}}`;
    const cb = x => R`\sqrt[3]{${x}}`;
    /** Integer part of √n, exact. */
    const isqrt = n => { let a = Math.floor(Math.sqrt(n)); while (a * a > n) a--; while ((a + 1) * (a + 1) <= n) a++; return a; };
    const nonSquare = (rng, lo, hi) => { for (;;) { const n = rng.int(lo, hi); if (!CA.isSquare(n)) return n; } };
    const dec = (x, dp = 4) => String(CA.round(x, dp));
    const neg = x => (x < 0 ? `(${x})` : `${x}`);

    /** A number line from lo to hi (integers) with marked points [{x, label}]. */
    function numberLine(lo, hi, pts) {
        const W = 300, x0 = 24, x1 = 276, y = 46, u = (x1 - x0) / (hi - lo);
        const X = v => x0 + (v - lo) * u;
        let b = F.line(x0 - 14, y, x1 + 14, y);
        b += F.poly([[x1 + 14, y], [x1 + 8, y - 4], [x1 + 8, y + 4]], { fill: F.colors.INK });
        b += F.poly([[x0 - 14, y], [x0 - 8, y - 4], [x0 - 8, y + 4]], { fill: F.colors.INK });
        for (let k = lo; k <= hi; k++) {
            b += F.line(X(k), y - 6, X(k), y + 6) + F.text(X(k), y + 21, k < 0 ? `−${-k}` : k);
            if (k < hi) b += F.line(X(k + 0.5), y - 3, X(k + 0.5), y + 3, { width: 1 });
        }
        for (const p of pts) b += F.dot(X(p.x), y, { fill: F.colors.ACCENT, r: 3.5 }) + F.text(X(p.x), y - 12, p.label, { bold: true, fill: F.colors.ACCENT });
        return F.svg(W, 74, b, { label: 'number line' });
    }
    /** A square with its area written inside. */
    function areaSquare(text) {
        return F.svg(120, 104, F.rect(22, 6, 76, 76, { fill: F.colors.FILL }) + F.text(60, 49, text) + F.text(60, 98, '?', { bold: true }), { label: 'square' });
    }

    // ── Numbers to classify as rational / irrational ─────────────────────
    const REPEATING = [['0.333\\ldots', '\\frac{1}{3}'], ['0.777\\ldots', '\\frac{7}{9}'], ['0.1666\\ldots', '\\frac{1}{6}'], ['0.272727\\ldots', '\\frac{3}{11}'],
        ['1.444\\ldots', '\\frac{13}{9}'], ['0.8333\\ldots', '\\frac{5}{6}'], ['0.454545\\ldots', '\\frac{5}{11}'], ['2.666\\ldots', '\\frac{8}{3}']];
    const SQ_DEC = [[0.25, 0.5], [0.09, 0.3], [1.44, 1.2], [0.49, 0.7], [2.25, 1.5], [0.01, 0.1], [6.25, 2.5], [0.81, 0.9], [1.69, 1.3], [0.64, 0.8]];
    const TRAP_DEC = [['0.4', '\\frac{2}{5}'], ['0.9', '\\frac{9}{10}'], ['2.5', '\\frac{5}{2}'], ['1.6', '\\frac{8}{5}'], ['0.1', '\\frac{1}{10}'], ['4.9', '\\frac{49}{10}'], ['3.6', '\\frac{18}{5}'], ['8.1', '\\frac{81}{10}']];
    const BARRED = ['1.\\overline{35}', '-4.07\\overline{24}', '0.\\overline{6}', '2.\\overline{07}', '0.1\\overline{6}', '-0.\\overline{42}', '5.3\\overline{8}', '0.\\overline{123}'];
    const PATTERNED = ['1.030030003\\ldots', '0.101001000100001\\ldots', '0.123456789101112\\ldots', '2.202002000200002\\ldots', '-0.515115111511115\\ldots'];
    const NON_CUBES = [2, 4, 9, 10, 16, 25, 36, 100];
    const RATIONAL = [
        rng => { const k = rng.int(2, 15); return { t: m(sq(k * k)), why: R`\(\sqrt{${k * k}}=${k}\), an integer` }; },
        rng => { const k = rng.int(2, 12); return { t: m('-' + sq(k * k)), why: R`\(-\sqrt{${k * k}}=-${k}\), an integer` }; },
        rng => { for (;;) { const p = rng.int(1, 9), q = rng.int(2, 9); if (p !== q && CA.gcd(p, q) === 1) return { t: m(sq(T.frac(p * p, q * q))), why: R`\(\sqrt{${T.frac(p * p, q * q)}}=${T.frac(p, q)}\), a fraction` }; } },
        rng => { const [d, f] = rng.pick(REPEATING); return { t: m(d), why: R`\(${d}=${f}\) (a repeating decimal is a fraction)` }; },
        rng => { for (;;) { const n = rng.int(11, 999); if (n % 10) return { t: m(dec(n / 100)), why: R`\(${dec(n / 100)}=\frac{${n}}{100}\) (a terminating decimal)` }; } },
        rng => { const [p, q] = rng.pick([[22, 7], [22, 7], [5, 3], [-7, 4], [17, 6], [3, 8], [-2, 9], [41, 29], [355, 113]]); return { t: m(T.frac(p, q)), why: R`\(${T.frac(p, q)}\) is a fraction of integers` + (p > 20 && q === 7 || p === 355 ? R` (close to \(\pi\), but not equal to it)` : '') }; },
        rng => { const [a, b] = rng.pick(SQ_DEC); return { t: m(sq(a)), why: R`\(\sqrt{${a}}=${b}\), a terminating decimal` }; },
        rng => { const k = rng.int(2, 6); return { t: m(cb(k ** 3)), why: R`\(\sqrt[3]{${k ** 3}}=${k}\), an integer` }; },
        rng => { const d = rng.pick(BARRED); return { t: m(d), why: R`\(${d}\) is a repeating decimal (the bar marks the block that repeats), so it is a fraction` }; },
    ];
    const IRRATIONAL = [
        rng => { const n = nonSquare(rng, 2, 99); return { t: m(sq(n)), why: R`\(\sqrt{${n}}\) is irrational because ${n} is not a perfect square` }; },
        rng => { const n = nonSquare(rng, 2, 99); return { t: m(sq(n)), why: R`\(\sqrt{${n}}\) is irrational because ${n} is not a perfect square` }; },
        rng => { const p = rng.pick(['\\pi', '2\\pi', '\\frac{\\pi}{2}', '\\pi+1', '\\frac{\\pi}{3}', '\\pi-3']); return { t: m(p), why: R`\(${p}\) is irrational because \(\pi\) is` }; },
        rng => { const k = rng.int(2, 7), n = rng.pick([2, 3, 5, 6, 7, 10]); return { t: m(T.root(k, n)), why: R`\(${T.root(k, n)}\) is irrational (a nonzero rational times the irrational \(\sqrt{${n}}\))` }; },
        rng => { const [d, f] = rng.pick(TRAP_DEC); return { t: m(sq(d)), why: R`\(\sqrt{${d}}=\sqrt{${f}}\) is irrational (\(${f}\) is not the square of a fraction)` }; },
        rng => { const q = rng.pick([4, 9, 16, 25]), p = rng.pick([2, 3, 5, 7]); const [a, b] = rng.bool() ? [p, q] : [q, p]; return { t: m(sq(T.frac(a, b))), why: R`\(\sqrt{${T.frac(a, b)}}\) is irrational (${p} is not a perfect square)` }; },
        rng => { const d = rng.pick(PATTERNED); return { t: m(d), why: R`\(${d}\) is irrational (the digits go on for ever and never settle into a repeating block)` }; },
        rng => { const n = rng.pick(NON_CUBES); return { t: m(cb(n)), why: R`\(\sqrt[3]{${n}}\) is irrational because ${n} is not a perfect cube` }; },
        rng => { const n = rng.pick([2, 3, 5, 7]), k = rng.int(1, 5); return { t: m(`${sq(n)}+${k}`), why: R`\(\sqrt{${n}}+${k}\) is irrational (an irrational plus an integer)` }; },
        rng => { const n = nonSquare(rng, 2, 30); return { t: m('-' + sq(n)), why: R`\(-\sqrt{${n}}\) is irrational because ${n} is not a perfect square` }; },
    ];

    // ── Tutorial pieces computed here so they cannot be mistyped ─────────
    const sqRow = ns => `<tr><th>\\(n\\)</th>${ns.map(n => `<td>${n}</td>`).join('')}</tr><tr><th>\\(n^2\\)</th>${ns.map(n => `<td>${n * n}</td>`).join('')}</tr>`;
    const SQUARE_TABLE = `<table>${sqRow([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}${sqRow([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])}${sqRow([25, 30, 40, 50, 60, 70, 80, 90, 100])}</table>`;
    const TUT_LINE = numberLine(0, 4, [{ x: Math.SQRT2, label: '√2' }, { x: Math.sqrt(5), label: '√5' }, { x: Math.PI, label: 'π' }, { x: Math.sqrt(15), label: '√15' }]);

    CA.register({
        id: 9,

        tutorial: [
            {
                h: 'Understanding square roots',
                html: R`
                <p><strong>Squaring</strong> a number means multiplying it by itself: \(7^2 = 7\times 7 = 49\).
                   A <strong>square root</strong> runs the film backwards.</p>
                <div class="ca-key"><strong>Definition.</strong> If \(x^2 = a\) (with \(a \ge 0\)), then \(x\) is a
                   <strong>square root</strong> of \(a\).</div>
                <p>Both \(7^2\) and \((-7)^2\) equal 49. So 49 has <strong>two</strong> square roots, \(7\) and \(-7\).
                   To avoid confusion, the symbol \(\sqrt{\phantom{9}}\) is reserved for the <strong>positive</strong> one,
                   called the <strong>principal</strong> square root:</p>
                <div class="ca-formula">\[ \text{the square roots of 49 are } 7 \text{ and } -7 \]
                   \[ \text{but}\quad \sqrt{49} = 7 \quad\text{and}\quad -\sqrt{49} = -7 \]</div>
                <table>
                    <tr><th>Number \(a\)</th><th>Its square roots (solutions of \(x^2=a\))</th><th>How many</th></tr>
                    <tr><td>positive, e.g. 49</td><td>\(7\) and \(-7\), written \(\pm 7\)</td><td>2 (opposites)</td></tr>
                    <tr><td>0</td><td>\(0\) only: zero is its own square root</td><td>1</td></tr>
                    <tr><td>negative, e.g. \(-49\)</td><td>none: no number has a negative square</td><td>0</td></tr>
                </table>
                <p>The picture to keep in your head is a square. If its side is \(s\), its area is \(s^2\); if you know the
                   area \(A\), the side is \(\sqrt{A}\). A side cannot be negative, which is why geometry only ever needs the
                   principal root.</p>
                <div class="ca-key"><strong>Squaring and rooting undo each other — with one catch.</strong>
                   \[ (\sqrt{a})^2 = a \quad (a \ge 0) \qquad\qquad \sqrt{a^2} = |a| \]
                   Squaring first throws the sign away, and the root cannot bring it back:
                   \(\sqrt{(-5)^2} = \sqrt{25} = 5\), not \(-5\).</div>
                <div class="ca-warn"><strong>Common mistake.</strong> Writing \(\sqrt{49} = \pm 7\). The symbol gives one
                   answer. The “\(\pm\)” belongs to the question “what are the square roots of 49?” or to solving
                   \(x^2 = 49\), where you must find <em>every</em> number that works.</div>`,
            },
            {
                h: 'Perfect squares and roots you can find exactly',
                html: R`
                <p>If the square roots of a number are integers, the number is a <strong>perfect square</strong>:
                   1, 4, 9, 16, 25, … Learn this table by heart — everything else in the lesson leans on it.</p>
                ${SQUARE_TABLE}
                <div class="ca-tip"><strong>Quick checks.</strong> A perfect square can only end in 0, 1, 4, 5, 6 or 9.
                   A number ending in 5 squares easily: \(35^2\) is \(3\times4=12\) followed by 25, so \(35^2=1225\).</div>
                <p><strong>Fractions.</strong> Because \(\left(\frac{3}{4}\right)^2 = \frac{9}{16}\), root the top and the bottom:
                   \(\sqrt{\frac{9}{16}} = \frac{3}{4}\). Turn a mixed number into an improper fraction first:
                   \(\sqrt{2\frac14} = \sqrt{\frac94} = \frac32\).</p>
                <p><strong>Decimals</strong> are fractions in disguise: \(\sqrt{0.25} = \sqrt{\frac{25}{100}} = \frac{5}{10} = 0.5\)
                   and \(\sqrt{1.44} = \frac{12}{10} = 1.2\). Decimal places halve (\(\sqrt{0.0009} = 0.03\)), and so do zeros
                   (\(\sqrt{4900} = 70\)).</p>
                <p><strong>Products.</strong> \(\sqrt{a\times b} = \sqrt{a}\times\sqrt{b}\), so \(\sqrt{4\times 9} = 2\times 3 = 6\),
                   \(\sqrt{8\times 18} = \sqrt{144} = 12\) and \(\sqrt{2^4\times 5^2} = 2^2\times 5 = 20\) (halve each exponent).</p>
                <div class="ca-warn"><strong>Roots do NOT split over addition.</strong> \(\sqrt{9+16} = \sqrt{25} = 5\), but
                   \(\sqrt{9}+\sqrt{16} = 3+4 = 7\). Always add (or subtract) first, then take the root.</div>`,
            },
            {
                h: 'Rational numbers and irrational numbers',
                html: R`
                <p>A number that can be written as a ratio \(\frac{a}{b}\) of two integers (with \(b \ne 0\)) is a
                   <strong>rational number</strong>. A number that <em>cannot</em> be written that way is an
                   <strong>irrational number</strong>. Together they make up the real numbers.</p>
                <table>
                    <tr><th colspan="2">Kind of number</th><th>Examples</th></tr>
                    <tr><td rowspan="4"><strong>Rational</strong><br>can be written \(\frac{a}{b}\)</td><td>Integers</td><td>\(-3,\ 0,\ 7\)</td></tr>
                    <tr><td>Terminating decimals</td><td>\(3.68,\ -0.214\)</td></tr>
                    <tr><td>Repeating decimals</td><td>\(1.\overline{35},\ -4.07\overline{24},\ 0.333\ldots\)</td></tr>
                    <tr><td>Fractions</td><td>\(-\frac{1}{3},\ \frac{16}{5}\)</td></tr>
                    <tr><td><strong>Irrational</strong><br>cannot be written \(\frac{a}{b}\)</td><td>Infinite non-repeating decimals</td><td>\(\pi,\ 1.030030003\ldots,\ -\sqrt{2}\)</td></tr>
                </table>
                <ul>
                    <li><strong>Bar notation.</strong> The bar marks the block of digits that repeats for ever:
                        \(1.\overline{35} = 1.353535\ldots\) and \(0.\overline{3} = 0.333\ldots = \frac13\). Every repeating
                        decimal is a fraction, so it is rational.</li>
                    <li><strong>A pattern is not the same as repeating.</strong> In \(1.030030003\ldots\) the gaps keep growing
                        (one zero, two zeros, three zeros, …), so no fixed block repeats. It never ends and never repeats: irrational.</li>
                    <li><strong>The square-root test.</strong> For a whole number \(n\), \(\sqrt{n}\) is an integer when \(n\) is a
                        perfect square and irrational otherwise. \(\sqrt{49} = 7\) is rational; \(\sqrt{50}\) and \(-\sqrt2\) are irrational.</li>
                </ul>
                <p><strong>Why is \(\sqrt{2}\) irrational?</strong> Suppose \(\sqrt{2} = \frac{p}{q}\) in lowest terms. Then
                   \(p^2 = 2q^2\), so \(p\) is even: \(p = 2k\). Then \(4k^2 = 2q^2\), so \(q^2 = 2k^2\) and \(q\) is even too. But a
                   fraction in lowest terms cannot have top and bottom both even. Contradiction — no such fraction exists.</p>
                <div class="ca-warn"><strong>Two classic traps.</strong> (1) \(\frac{22}{7}\) and \(3.14\) are rational; only
                   \(\pi\) itself is irrational. (2) \(\sqrt{0.4}\) looks like \(0.2\), but \(0.2^2 = 0.04\). In fact
                   \(0.4 = \frac{2}{5}\) is not the square of any fraction, so \(\sqrt{0.4}\) is irrational. (\(\sqrt{0.04} = 0.2\) is rational.)</div>`,
            },
            {
                h: 'Estimating irrational numbers',
                html: R`
                <p>An irrational root such as \(\sqrt{57}\) has no exact decimal, but we can trap it as tightly as we like.
                   The whole method rests on one fact: <strong>when \(a \ge 0\), \((\sqrt{a})^2 = a\)</strong>. So square the
                   root (you get 57) and ask: <em>between which two perfect squares does this number fall?</em></p>
                <ul>
                    <li><strong>Between which integers?</strong> \(7^2 = 49 &lt; 57 &lt; 64 = 8^2\), so \(7 &lt; \sqrt{57} &lt; 8\).</li>
                    <li><strong>Nearest integer?</strong> Test the halfway number: \(7.5^2 = 56.25\). Since \(57 &gt; 56.25\),
                        \(\sqrt{57}\) is past halfway, so it is nearer to 8.</li>
                    <li><strong>One decimal place?</strong> \(7.5^2 = 56.25\) and \(7.6^2 = 57.76\), so it lies between 7.5 and 7.6.
                        Halfway again: \(7.55^2 = 57.0025 &gt; 57\), so \(\sqrt{57} \approx 7.5\).</li>
                </ul>
                <div class="ca-key"><strong>Bigger number, bigger root.</strong> For positive numbers, \(a &lt; b\) exactly when
                   \(\sqrt{a} &lt; \sqrt{b}\). So to compare or trap roots, <em>compare the squares</em>.</div>
                <div class="ca-tip"><strong>The halfway shortcut.</strong> \((n+0.5)^2 = n^2 + n + 0.25\). So \(\sqrt{k}\) rounds
                   down to \(n\) when \(k \le n^2 + n\), and up to \(n+1\) when \(k \ge n^2+n+1\). For \(n = 7\): \(49 + 7 = 56\), and
                   57 is bigger, so round up.</div>
                <div class="ca-tip"><strong>The gaps grow.</strong> Consecutive squares differ by the odd numbers:
                   \((n+1)^2 - n^2 = 2n+1\). From \(7^2\) to \(8^2\) is a jump of 15, from \(20^2\) to \(21^2\) a jump of 41.
                   So square roots of big numbers creep up very slowly.</div>`,
            },
            {
                h: 'Comparing irrational numbers',
                html: R`
                <p>Every real number, rational or irrational, has its own point on the number line. An irrational number is not “fuzzy” — \(\sqrt{2}\) sits at one exact
                   spot, a little less than halfway from 1 to 2.</p>
                ${F.row(TUT_LINE)}
                <p>To place \(\sqrt{15}\): \(3^2 = 9 &lt; 15 &lt; 16 = 4^2\), and 15 is almost 16, so the point is just to the
                   left of 4 (\(\sqrt{15}\approx 3.87\)).</p>
                <p>To <strong>compare</strong> positive numbers, <strong>square them</strong>: the bigger square belongs to the
                   bigger number. To order a mixed list such as \(3,\ \sqrt{10},\ \pi,\ 3.1\):</p>
                <ul>
                    <li>\(3.1^2 = 9.61 &lt; 10\), so \(3.1 &lt; \sqrt{10}\).</li>
                    <li>\(\pi \approx 3.1416\) and \(\pi^2 \approx 9.87 &lt; 10\), so \(\pi &lt; \sqrt{10}\).</li>
                    <li>Altogether: \(3 &lt; 3.1 &lt; \pi &lt; \sqrt{10}\).</li>
                </ul>
                <div class="ca-tip"><strong>Useful values to remember:</strong> \(\sqrt{2}\approx 1.414\), \(\sqrt{3}\approx 1.732\),
                   \(\sqrt{5}\approx 2.236\), \(\sqrt{10}\approx 3.162\), \(\pi\approx 3.142\).</div>
                <div class="ca-tip"><strong>Shifting the decimal point.</strong> \(\sqrt{200} = \sqrt{2\times100} = 10\sqrt{2}\approx 14.14\),
                   and \(\sqrt{0.02} = \frac{\sqrt2}{10}\approx 0.1414\). Moving the point <em>two</em> places under the root moves
                   it <em>one</em> place in the answer.</div>`,
            },
            {
                h: 'A quick look at cube roots',
                html: R`
                <p>The <strong>cube root</strong> undoes cubing: \(\sqrt[3]{64} = 4\) because \(4^3 = 64\). A cube with volume
                   64 cm³ has edges of 4 cm.</p>
                <table>
                    <tr><th>\(n\)</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr>
                    <tr><th>\(n^3\)</th><td>${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => n ** 3).join('</td><td>')}</td></tr>
                </table>
                <div class="ca-key"><strong>Cube roots like negatives.</strong> \((-2)^3 = -8\), so \(\sqrt[3]{-8} = -2\).
                   Every number has exactly <em>one</em> real cube root, and it has the same sign as the number. Compare:
                   \(\sqrt{-4}\) does not exist, but \(\sqrt[3]{-8}\) is perfectly fine.</div>
                <p>Fractions work as before: \(\sqrt[3]{\frac{8}{27}} = \frac{2}{3}\). And just like square roots, the cube
                   root of a whole number that is not a perfect cube (such as \(\sqrt[3]{9}\)) is irrational.</p>`,
            },
        ],

        summary: [
            {
                topic: 'Understanding square roots',
                points: [
                    R`If \(x^2 = a\) (\(a \ge 0\)), then \(x\) is a square root of \(a\). A positive number has two square roots, \(\sqrt{a}\) and \(-\sqrt{a}\); the symbol \(\sqrt{\phantom{9}}\) means the positive (principal) one.`,
                    R`If the square roots of a number are integers, the number is a perfect square.`,
                    R`0 has exactly one square root: itself.`,
                    R`A negative number has no square root.`,
                ],
            },
            {
                topic: 'Rational numbers and irrational numbers',
                points: [
                    R`Rational numbers can be written as a ratio \(\frac{a}{b}\) of integers with \(b \ne 0\): integers (\(-3, 0, 7\)), terminating decimals (\(3.68\)), repeating decimals (\(1.\overline{35}\)) and fractions (\(-\frac13, \frac{16}{5}\)).`,
                    R`Irrational numbers cannot be written that way. They are the infinite non-repeating decimals, such as \(\pi\), \(1.030030003\ldots\) and \(-\sqrt2\).`,
                ],
            },
            {
                topic: 'Estimating and comparing irrational numbers',
                points: [
                    R`When \(a \ge 0\), \((\sqrt{a})^2 = a\).`,
                    R`To estimate or compare, square first. The key is to find the two perfect squares the number falls between: \(49 &lt; 57 &lt; 64\), so \(7 &lt; \sqrt{57} &lt; 8\).`,
                    R`For positive numbers, the bigger square belongs to the bigger number.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Roots of perfect squares, fractions and decimals',
                q: R`Evaluate \(\sqrt{196}\), \(\sqrt{\frac{25}{81}}\) and \(\sqrt{0.36}\).`,
                steps: [
                    R`From the table, \(14^2 = 196\), so \(\sqrt{196} = 14\).`,
                    R`Root the top and the bottom: \(\sqrt{\frac{25}{81}} = \frac{\sqrt{25}}{\sqrt{81}} = \frac{5}{9}\).`,
                    R`\(0.36 = \frac{36}{100}\), so \(\sqrt{0.36} = \frac{6}{10} = 0.6\). (Check: \(0.6\times0.6 = 0.36\).)`,
                ],
                answer: R`\(14\), \(\frac{5}{9}\) and \(0.6\)`,
            },
            {
                title: 'Equations with squares',
                q: R`Solve (a) \(x^2 = 121\) and (b) \((x-3)^2 = 49\).`,
                steps: [
                    R`(a) Two numbers square to 121: \(x = 11\) or \(x = -11\).`,
                    R`(b) The bracket is a number whose square is 49, so \(x - 3 = 7\) or \(x - 3 = -7\).`,
                    R`Add 3 to each: \(x = 10\) or \(x = -4\). (Check: \((-4-3)^2 = (-7)^2 = 49\).)`,
                ],
                answer: R`(a) \(x=\pm 11\) &nbsp; (b) \(x = 10\) or \(x=-4\)`,
            },
            {
                title: 'Trapping a root',
                q: R`Without a calculator, find \(\sqrt{57}\) to the nearest integer and then to one decimal place.`,
                steps: [
                    R`\(7^2 = 49\) and \(8^2 = 64\), so \(\sqrt{57}\) is between 7 and 8.`,
                    R`Halfway: \(7.5^2 = 56.25 &lt; 57\). So \(\sqrt{57} &gt; 7.5\) and the nearest integer is 8.`,
                    R`\(7.6^2 = 57.76 &gt; 57\), so \(\sqrt{57}\) is between 7.5 and 7.6.`,
                    R`Halfway: \(7.55^2 = 57.0025 &gt; 57\), so \(\sqrt{57} &lt; 7.55\). It rounds to 7.5.`,
                ],
                answer: R`8 to the nearest integer; 7.5 to one decimal place`,
            },
            {
                title: 'Rational or irrational?',
                q: R`Sort these into rational and irrational numbers: \(\sqrt{49}\), \(0.333\ldots\), \(\sqrt{10}\), \(\frac{22}{7}\), \(\frac{\pi}{2}\), \(\sqrt{0.4}\).`,
                steps: [
                    R`\(\sqrt{49} = 7\): rational. \(0.333\ldots = \frac{1}{3}\): rational. \(\frac{22}{7}\) is already a fraction: rational.`,
                    R`10 is not a perfect square, so \(\sqrt{10}\) is irrational.`,
                    R`\(\pi\) is irrational, and halving it cannot make it a fraction: \(\frac{\pi}{2}\) is irrational.`,
                    R`\(0.4 = \frac{4}{10} = \frac{2}{5}\). Neither 2 nor 5 is a perfect square, so \(\sqrt{0.4}\) is irrational.`,
                ],
                answer: R`Rational: \(\sqrt{49}\), \(0.333\ldots\), \(\frac{22}{7}\). Irrational: \(\sqrt{10}\), \(\frac{\pi}{2}\), \(\sqrt{0.4}\).`,
            },
            {
                title: 'Putting numbers in order',
                q: R`Write in order from least to greatest: \(\sqrt{10}\), \(3.1\), \(\pi\), \(\frac{22}{7}\), \(3\).`,
                steps: [
                    R`Decimals: \(\pi = 3.1415\ldots\) and \(\frac{22}{7} = 3.1428\ldots\), so \(3 &lt; 3.1 &lt; \pi &lt; \frac{22}{7}\).`,
                    R`Where does \(\sqrt{10}\) go? Square the rivals: \(3.1^2 = 9.61\) and \(3.2^2 = 10.24\), so \(\sqrt{10}\) is between 3.1 and 3.2.`,
                    R`Sharper: \(3.15^2 = 9.9225 &lt; 10\), so \(\sqrt{10} &gt; 3.15\), which beats \(\frac{22}{7}\approx 3.143\).`,
                ],
                answer: R`\(3 &lt; 3.1 &lt; \pi &lt; \frac{22}{7} &lt; \sqrt{10}\)`,
            },
            {
                title: 'Two contest favourites',
                q: R`(a) How many integers lie between \(\sqrt{20}\) and \(\sqrt{200}\)? (b) What is the smallest positive integer \(n\) for which \(\sqrt{48n}\) is an integer?`,
                steps: [
                    R`(a) \(4^2 = 16 &lt; 20 &lt; 25\), so \(\sqrt{20}\) is between 4 and 5. \(14^2 = 196 &lt; 200 &lt; 225\), so \(\sqrt{200}\) is between 14 and 15.`,
                    R`The integers in between are \(5, 6, \ldots, 14\): that is \(14 - 5 + 1 = 10\) integers.`,
                    R`(b) \(48 = 16\times 3 = 4^2\times 3\). The 16 is already a square; the lonely 3 needs a partner.`,
                    R`Take \(n = 3\): \(48\times 3 = 144 = 12^2\). Any smaller \(n\) leaves the 3 unpaired.`,
                ],
                answer: R`(a) 10 &nbsp; (b) \(n = 3\)`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'perfect-squares', name: 'Roots of perfect squares', level: 1,
                gen(rng) {
                    const k = rng.pick([...Array.from({ length: 17 }, (_, i) => i + 4), 25, 30, 40, 50, 60]);
                    const N = k * k;
                    const type = rng.int(0, 4);
                    if (type === 0) return { q: R`Evaluate \(\sqrt{${N}}\).`, ans: CA.num(k), sol: R`\(${k}\times${k}=${N}\), so \(\sqrt{${N}}=${k}\).` };
                    if (type === 1) return { q: `Which positive number, multiplied by itself, gives ${N}?`, ans: CA.num(k), sol: R`\(${k}^2=${N}\), so the number is \(\sqrt{${N}}=${k}\).` };
                    if (type === 2) {
                        const u = rng.pick(['cm', 'm', 'mm']);
                        return { q: `A square has an area of ${N} ${u}². How long is each side?`, fig: areaSquare(`${N} ${u}²`), ans: CA.num(k, u), sol: R`Side \(=\sqrt{${N}}=${k}\) ${u}, because \(${k}^2=${N}\).` };
                    }
                    if (type === 3) return { q: R`Evaluate \(-\sqrt{${N}}\).`, ans: CA.num(-k), sol: R`\(\sqrt{${N}}=${k}\) (the root sign gives the positive root), so \(-\sqrt{${N}}=-${k}\).` };
                    const j = rng.int(2, 12), op = rng.pick(['+', '-', '\\times']);
                    const v = op === '+' ? k + j : op === '-' ? k - j : k * j;
                    return { q: R`Evaluate \(\sqrt{${N}}${op}\sqrt{${j * j}}\).`, ans: CA.num(v), sol: R`\(\sqrt{${N}}=${k}\) and \(\sqrt{${j * j}}=${j}\), so the answer is \(${k}${op}${j}=${v}\).` };
                },
            },
            {
                id: 'two-roots', name: 'Square roots of a number', level: 1,
                gen(rng) {
                    const k = rng.int(2, 20), N = k * k;
                    const type = rng.int(0, 8);
                    if (type === 6) {
                        return {
                            q: `Which of these lists <strong>all</strong> the square roots of ${N}?`,
                            ans: CA.mc(rng, R`\(${k}\) and \(-${k}\)`, [R`\(${k}\) only`, R`\(-${k}\) only`, R`\(${N * N}\) only`, 'It has no square roots']),
                            sol: R`\(${k}^2=${N}\) and \((-${k})^2=${N}\), so ${N} has two square roots, \(${k}\) and \(-${k}\). (The symbol \(\sqrt{${N}}\) means only the positive one, ${k}.)`,
                        };
                    }
                    if (type === 7) {
                        const c = rng.pick([N, nonSquare(rng, 2, 99), 0, -N, -N]);
                        const n = c > 0 ? 2 : c === 0 ? 1 : 0;
                        return { q: `How many square roots does the number ${c < 0 ? '−' + -c : c} have?`, ans: CA.num(n), sol: c > 0 ? R`A positive number has two square roots: \(\sqrt{${c}}\) and \(-\sqrt{${c}}\).` : c === 0 ? 'Zero has exactly one square root, itself.' : 'A negative number has no square root, because no number has a negative square.' };
                    }
                    if (type === 8) {
                        const j = rng.int(2, 12);
                        return { q: R`Let \(p\) be the <strong>negative</strong> square root of ${N} and let \(q=\sqrt{${j * j}}\). What is \(p+q\)?`, ans: CA.num(j - k), sol: R`The square roots of ${N} are \(\pm${k}\), so \(p=-${k}\). The symbol \(\sqrt{${j * j}}\) means the positive root, so \(q=${j}\). \(p+q=${j - k}\).` };
                    }
                    if (type === 0) return { q: R`What is the <strong>negative</strong> solution of \(x^2=${N}\)?`, ans: CA.num(-k), sol: R`\(x=\pm\sqrt{${N}}=\pm${k}\). The negative solution is \(-${k}\).` };
                    if (type === 1) return { q: R`The equation \(x^2=${N}\) has two solutions, \(a\) and \(b\), with \(a&gt;b\). What is \(a-b\)?`, ans: CA.num(2 * k), sol: R`\(a=${k}\) and \(b=-${k}\), so \(a-b=${k}-(-${k})=${2 * k}\).` };
                    if (type === 2) return { q: `The number ${N} has two square roots. What is their <strong>product</strong>?`, ans: CA.num(-N), sol: R`The square roots are \(${k}\) and \(-${k}\). \(${k}\times(-${k})=-${N}\).` };
                    if (type === 3) {
                        const c = rng.pick([N, N, 0, -N]);
                        const n = c > 0 ? 2 : c === 0 ? 1 : 0;
                        return { q: R`How many real numbers \(x\) satisfy \(x^2=${c}\)?`, ans: CA.num(n), sol: c > 0 ? R`\(x=${k}\) and \(x=-${k}\) both work: 2 solutions.` : c === 0 ? R`Only \(x=0\) works: 1 solution.` : R`A square is never negative, so there are 0 solutions.` };
                    }
                    if (type === 4) {
                        const c = rng.int(2, 30);
                        return { q: R`\(x^2=${N}\) and \(x\) is negative. What is \(x+${c}\)?`, ans: CA.num(c - k), sol: R`The negative solution is \(x=-${k}\), so \(x+${c}=-${k}+${c}=${c - k}\).` };
                    }
                    const c = rng.int(1, 15);
                    return { q: R`What is the <strong>positive</strong> solution of \(x^2-${c}=${N - c}\)?`, ans: CA.num(k), sol: R`Add ${c}: \(x^2=${N}\), so \(x=\pm${k}\). The positive solution is \(${k}\).` };
                },
            },
            {
                id: 'fraction-decimal-roots', name: 'Roots of fractions and decimals', level: 1,
                gen(rng) {
                    const type = rng.int(0, 3);
                    if (type === 0) {
                        for (;;) {
                            const p = rng.int(1, 12), q = rng.int(2, 13);
                            if (p === q || CA.gcd(p, q) !== 1) continue;
                            return { q: R`Evaluate \(\sqrt{\frac{${p * p}}{${q * q}}}\). Give your answer as a fraction.`, ans: CA.frac(p, q), sol: R`\(\frac{\sqrt{${p * p}}}{\sqrt{${q * q}}}=${T.frac(p, q)}\).` };
                        }
                    }
                    if (type === 1) {
                        for (;;) {
                            const q = rng.int(2, 5), p = rng.int(q + 1, 4 * q);
                            if (CA.gcd(p, q) !== 1) continue;
                            return { q: R`Evaluate \(\sqrt{${T.mixed(p * p, q * q)}}\). Give your answer as a fraction or mixed number.`, ans: CA.frac(p, q, '', { mixed: true }), sol: R`Make it improper first: \(${T.mixed(p * p, q * q)}=\frac{${p * p}}{${q * q}}\). Then \(\sqrt{\frac{${p * p}}{${q * q}}}=\frac{${p}}{${q}}=${T.mixed(p, q)}\).` };
                        }
                    }
                    if (type === 2) {
                        const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 25]);
                        const d = (k * k / 100).toFixed(2);
                        return { q: R`Evaluate \(\sqrt{${d}}\). Give your answer as a decimal.`, ans: CA.num(k / 10, '', { tol: 0.001 }), sol: R`\(${d}=\frac{${k * k}}{100}\), so the root is \(\frac{${k}}{10}=${dec(k / 10)}\). (Check: \(${dec(k / 10)}^2=${d}\).)` };
                    }
                    const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15]);
                    const d = (k * k / 10000).toFixed(4);
                    return { q: R`Evaluate \(\sqrt{${d}}\). Give your answer as a decimal.`, ans: CA.num(k / 100, '', { tol: 0.0005 }), sol: R`\(${d}=\frac{${k * k}}{10000}\), so the root is \(\frac{${k}}{100}=${dec(k / 100)}\). Four decimal places become two.` };
                },
            },
            {
                id: 'between-integers', name: 'Between which two integers?', level: 1,
                gen(rng) {
                    const n = nonSquare(rng, 3, 399), a = isqrt(n);
                    const trap = R`\(${a}^2=${a * a}&lt;${n}&lt;${(a + 1) ** 2}=${a + 1}^2\), so \(${a}&lt;\sqrt{${n}}&lt;${a + 1}\).`;
                    const type = rng.int(0, 3);
                    if (type === 0) return { q: R`\(\sqrt{${n}}\) lies between two consecutive integers. What is the <strong>smaller</strong> one?`, ans: CA.num(a), sol: trap };
                    if (type === 1) return { q: R`\(\sqrt{${n}}\) lies between two consecutive integers. What is the <strong>larger</strong> one?`, ans: CA.num(a + 1), sol: trap };
                    if (type === 2) return { q: R`What is the greatest integer that is less than \(\sqrt{${n}}\)?`, ans: CA.num(a), sol: trap + ` The greatest integer below it is ${a}.` };
                    return { q: R`What is the smallest integer that is greater than \(\sqrt{${n}}\)?`, ans: CA.num(a + 1), sol: trap + ` The smallest integer above it is ${a + 1}.` };
                },
            },
            {
                id: 'classify', name: 'Rational or irrational?', level: 1,
                gen(rng) {
                    if (rng.bool(0.45)) {
                        const isRat = rng.bool();
                        const item = rng.pick(isRat ? RATIONAL : IRRATIONAL)(rng);
                        return {
                            q: `Is the number ${item.t} rational or irrational?`,
                            ans: CA.mc(rng, isRat ? 'Rational' : 'Irrational', ['Rational', 'Irrational'], { keepOrder: true }),
                            sol: isRat ? `Rational: ${item.why}.` : `${item.why}.`,
                        };
                    }
                    const wantIrr = rng.bool();
                    for (;;) {
                        const one = rng.pick(wantIrr ? IRRATIONAL : RATIONAL)(rng);
                        const others = rng.sample(wantIrr ? RATIONAL : IRRATIONAL, 3).map(f => f(rng));
                        if (new Set([one.t, ...others.map(o => o.t)]).size < 4) continue;
                        const all = rng.shuffle([one, ...others]).map(o => o.t);
                        return {
                            q: `Exactly one of the numbers ${all.slice(0, 3).join(', ')} and ${all[3]} is <strong>${wantIrr ? 'irrational' : 'rational'}</strong>. Which one?`,
                            ans: CA.mc(rng, one.t, all, { keepOrder: true }),
                            sol: `${one.why}. The others are ${wantIrr ? 'rational' : 'irrational'}: ${others.map(o => o.why).join('; ')}.`,
                        };
                    }
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'estimate', name: 'Estimating square roots', level: 2,
                gen(rng) {
                    if (rng.bool()) {
                        const a = rng.int(2, 17);
                        let n;
                        do { n = rng.bool(0.6) ? a * a + a + rng.pick([-2, -1, 0, 1, 2, 3]) : rng.int(a * a + 1, a * a + 2 * a); } while (CA.isSquare(n));
                        const up = n > a * a + a, ans = up ? a + 1 : a;
                        const sol = R`\(${a}^2=${a * a}\) and \(${a + 1}^2=${(a + 1) ** 2}\), so the root is between ${a} and ${a + 1}. Halfway: \(${a}.5^2=${a * a + a}.25\), and ${n} is ${up ? 'more' : 'less'} than that, so \(\sqrt{${n}}\) rounds ${up ? 'up' : 'down'} to ${ans}.`;
                        const [q, unit] = rng.pick([
                            [R`What is \(\sqrt{${n}}\) to the nearest integer?`, ''],
                            [R`Which integer is closest to \(\sqrt{${n}}\)?`, ''],
                            [`A square garden has an area of ${n} m². Find the length of its side to the nearest metre.`, 'm'],
                            [`A square tile has an area of ${n} cm². Find the length of its side to the nearest centimetre.`, 'cm'],
                        ]);
                        return { q, ans: CA.num(ans, unit), sol };
                    }
                    const n = nonSquare(rng, 2, 99);
                    let t = Math.floor(Math.sqrt(n) * 10);                    // tenths: t² ≤ 100n < (t+1)²
                    while (t * t > 100 * n) t--;
                    while ((t + 1) * (t + 1) <= 100 * n) t++;
                    const up = (2 * t + 1) ** 2 < 400 * n;                    // is √n above t + 0.05 tenths?
                    const r = (up ? t + 1 : t) / 10;
                    const lo = (t / 10).toFixed(1), hi = ((t + 1) / 10).toFixed(1), mid = (t / 10 + 0.05).toFixed(2);
                    const midSq = dec((2 * t + 1) ** 2 / 400, 4);
                    return {
                        q: R`Without a calculator, find \(\sqrt{${n}}\) correct to <strong>one decimal place</strong>.`,
                        ans: CA.num(r, '', { tol: 0.001, show: m(r.toFixed(1)) }),
                        sol: R`\(${lo}^2=${dec(t * t / 100)}\) and \(${hi}^2=${dec((t + 1) ** 2 / 100)}\), so \(\sqrt{${n}}\) is between ${lo} and ${hi}. Halfway: \(${mid}^2=${midSq}\), which is ${up ? 'less' : 'more'} than ${n}, so \(\sqrt{${n}}\approx${r.toFixed(1)}\).`,
                    };
                },
            },
            {
                id: 'compare-order', name: 'Comparing and ordering real numbers', level: 2,
                gen(rng) {
                    for (;;) {
                        const k = rng.pick([1, 2, 3, 3, 3, 4, 5, 6, 7, 8]);
                        const pool = [];
                        const j1 = rng.int(1, 2 * k), j2 = rng.int(1, 2 * k);
                        const rootItem = j => { const n = k * k + j, t = Math.floor(Math.sqrt(n) * 10) / 10; return { t: sq(n), v: Math.sqrt(n), ap: R`\sqrt{${n}}\approx${Math.sqrt(n).toFixed(2)}`, note: R`\(${t.toFixed(1)}^2=${dec(t * t)}\) and \(${(t + 0.1).toFixed(1)}^2=${dec((t + 0.1) ** 2)}\) trap \(\sqrt{${n}}\)` }; };
                        pool.push(rootItem(j1));
                        if (j2 !== j1 && rng.bool(0.5)) pool.push(rootItem(j2));
                        const d = rng.int(1, 9);
                        pool.push({ t: `${k}.${d}`, v: k + d / 10, ap: `${k}.${d}` });
                        const q = rng.pick([2, 3, 4, 5, 6, 7]), p = rng.int(1, q - 1);
                        if (CA.gcd(p, q) === 1) pool.push({ t: R`\frac{${k * q + p}}{${q}}`, v: k + p / q, ap: R`\frac{${k * q + p}}{${q}}` + ((k * q + p) / q === CA.round((k * q + p) / q, 2) ? '=' : R`\approx`) + (k + p / q).toFixed(2) });
                        if (k === 3 && rng.bool(0.7)) pool.push({ t: R`\pi`, v: Math.PI, ap: R`\pi\approx3.14` });
                        if (rng.bool(0.4)) { const d2 = rng.int(11, 99); if (d2 % 10) pool.push({ t: `${k}.${d2}`, v: k + d2 / 100, ap: `${k}.${d2}` }); }
                        const order3 = rng.bool(0.35);
                        const items = rng.sample(pool, order3 ? 3 : 4);
                        if (items.length < (order3 ? 3 : 4) || !items.some(i => i.note)) continue;
                        const sorted = items.slice().sort((a, b) => a.v - b.v);
                        if (sorted.some((x, i) => i && x.v - sorted[i - 1].v < 0.02)) continue;
                        const approx = `Write each one as a decimal: ${items.map(i => m(i.ap)).join(', ')} (${items.find(i => i.note).note}).`;
                        const chain = m(sorted.map(i => i.t).join('&lt;'));
                        if (order3) {
                            const list = arr => m(arr.map(i => i.t).join(',\\ '));
                            const perms = [[0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(pm => list(pm.map(i => sorted[i])));
                            return {
                                q: `Which list shows the numbers ${items.map(i => m(i.t)).join(', ')} in order from <strong>least to greatest</strong>?`,
                                ans: CA.mc(rng, list(sorted), rng.sample(perms, 3)),
                                sol: `${approx} So ${chain}.`,
                            };
                        }
                        const big = rng.bool(), target = big ? sorted[sorted.length - 1] : sorted[0];
                        return {
                            q: `Which of the numbers ${items.slice(0, 3).map(i => m(i.t)).join(', ')} and ${m(items[3].t)} is the <strong>${big ? 'greatest' : 'least'}</strong>?`,
                            ans: CA.mc(rng, m(target.t), items.map(i => m(i.t)), { keepOrder: true }),
                            sol: `${approx} In order: ${chain}, so the ${big ? 'greatest' : 'least'} is ${m(target.t)}.`,
                        };
                    }
                },
            },
            {
                id: 'inverse-operations', name: 'Squares, roots and products', level: 2,
                gen(rng) {
                    if (rng.bool(0.4)) return this.products(rng);
                    const a = rng.int(2, 15), b = rng.int(2, 12), n = nonSquare(rng, 2, 40), p = nonSquare(rng, 2, 30), k = rng.int(2, 6);
                    const [e, v, sol] = rng.pick([
                        [R`\sqrt{(-${a})^2}`, a, R`\((-${a})^2=${a * a}\), and \(\sqrt{${a * a}}=${a}\). (\(\sqrt{x^2}=|x|\), never negative.)`],
                        [R`\left(\sqrt{${n}}\right)^2`, n, R`Squaring undoes the square root: \((\sqrt{${n}})^2=${n}\).`],
                        [R`-\sqrt{${a}^2}`, -a, R`\(\sqrt{${a}^2}=${a}\), and the minus sign in front stays: \(-${a}\).`],
                        [R`\left(-\sqrt{${n}}\right)^2`, n, R`A negative times a negative is positive: \((-\sqrt{${n}})^2=(\sqrt{${n}})^2=${n}\).`],
                        [R`\sqrt{${a}^2}+\sqrt{(-${b})^2}`, a + b, R`\(\sqrt{${a}^2}=${a}\) and \(\sqrt{(-${b})^2}=\sqrt{${b * b}}=${b}\). Sum: \(${a + b}\).`],
                        [R`\left(\sqrt{${n}}\right)^2-\sqrt{(-${b})^2}`, n - b, R`\((\sqrt{${n}})^2=${n}\) and \(\sqrt{(-${b})^2}=${b}\). \(${n}-${b}=${n - b}\).`],
                        [R`\sqrt{(${b}-${b + a})^2}`, a, R`\(${b}-${b + a}=-${a}\), and \(\sqrt{(-${a})^2}=|-${a}|=${a}\).`],
                        [R`\left(${k}\sqrt{${p}}\right)^2`, k * k * p, R`Square both parts: \(${k}^2\times(\sqrt{${p}})^2=${k * k}\times${p}=${k * k * p}\).`],
                        [R`\left(\sqrt{${n}}\right)^2+\left(-\sqrt{${p}}\right)^2`, n + p, R`\((\sqrt{${n}})^2=${n}\) and \((-\sqrt{${p}})^2=${p}\). Sum: \(${n + p}\).`],
                    ]);
                    return { q: R`Evaluate \(${e}\).`, ans: CA.num(v), sol };
                },
                products(rng) {
                    const type = rng.int(0, 4);
                    if (type === 0) {
                        const [a, b] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2);
                        return { q: R`Evaluate \(\sqrt{${a * a}\times${b * b}}\).`, ans: CA.num(a * b), sol: R`\(\sqrt{${a * a}}\times\sqrt{${b * b}}=${a}\times${b}=${a * b}\).` };
                    }
                    if (type === 1) {
                        const r = rng.pick([2, 3, 5, 6, 7]), [u, v] = rng.sample([1, 2, 3, 4, 5], 2);
                        const p = r * u * u, q = r * v * v;
                        return { q: R`Evaluate \(\sqrt{${p}\times${q}}\).`, ans: CA.num(r * u * v), sol: R`\(${p}\times${q}=${p * q}=${r * u * v}^2\). Or regroup: \(${p}\times${q}=(${r}\times${u * u})\times(${r}\times${v * v})=${r * r}\times${u * u}\times${v * v}\), whose root is \(${r}\times${u}\times${v}=${r * u * v}\).` };
                    }
                    if (type === 2) {
                        const [a, b, c] = rng.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29], [9, 40, 41]]);
                        if (rng.bool()) return { q: R`Evaluate \(\sqrt{${a * a}+${b * b}}\).`, ans: CA.num(c), sol: R`Add first: \(${a * a}+${b * b}=${c * c}\), and \(\sqrt{${c * c}}=${c}\). (It is <em>not</em> \(${a}+${b}\).)` };
                        return { q: R`Evaluate \(\sqrt{${c * c}-${a * a}}\).`, ans: CA.num(b), sol: R`Subtract first: \(${c * c}-${a * a}=${b * b}\), and \(\sqrt{${b * b}}=${b}\). (It is <em>not</em> \(${c}-${a}\).)` };
                    }
                    if (type === 3) {
                        const [p, q] = rng.sample([2, 3, 5, 7], 2), i = rng.int(1, p === 2 ? 3 : 2), j = rng.int(1, q === 2 ? 3 : q === 7 ? 1 : 2);
                        const v = p ** i * q ** j;
                        return { q: R`Evaluate \(\sqrt{${p}^{${2 * i}}\times${q}^{${2 * j}}}\).`, ans: CA.num(v), sol: R`Halve each exponent: \(${p}^{${i}}\times${q}^{${j}}=${p ** i}\times${q ** j}=${v}\).` };
                    }
                    const k = rng.int(2, 15), z = rng.pick([100, 100, 10000]);
                    return { q: R`Evaluate \(\sqrt{${k * k * z}}\).`, ans: CA.num(k * Math.sqrt(z)), sol: R`\(${k * k * z}=${k * k}\times${z}\), so the root is \(${k}\times${Math.sqrt(z)}=${k * Math.sqrt(z)}\).` };
                },
            },
            {
                id: 'classify-tree', name: 'Sorting numbers into families', level: 2,
                gen(rng) {
                    if (rng.bool(0.4)) {
                        for (;;) {
                            const nIrr = rng.int(1, 4), wantIrr = rng.bool(0.6);
                            const items = rng.shuffle([...rng.sample(IRRATIONAL, nIrr).map(f => ({ ...f(rng), irr: true })), ...rng.sample(RATIONAL, 5 - nIrr).map(f => ({ ...f(rng), irr: false }))]);
                            if (new Set(items.map(i => i.t)).size < 5) continue;
                            const pickOut = items.filter(i => i.irr === wantIrr);
                            return {
                                q: `How many of these five numbers are <strong>${wantIrr ? 'irrational' : 'rational'}</strong>?<br>${items.map(i => i.t).join(', &nbsp; ')}`,
                                ans: CA.num(pickOut.length),
                                sol: `The ${wantIrr ? 'irrational' : 'rational'} ones are ${pickOut.map(i => i.t).join(', ')}. Reasons: ${items.map(i => i.why).join('; ')}.`,
                            };
                        }
                    }
                    const FAM = ['An integer', 'A terminating decimal', 'A repeating decimal', 'An infinite non-repeating decimal'];
                    const [t, fam, why] = rng.pick([
                        () => { const k = rng.int(2, 15); return [sq(k * k), 0, R`\(\sqrt{${k * k}}=${k}\), an integer`]; },
                        () => { const k = rng.int(2, 12); return ['-' + sq(k * k), 0, R`\(-\sqrt{${k * k}}=-${k}\), an integer`]; },
                        () => { const [a, b] = rng.pick(SQ_DEC); return [sq(a), 1, R`\(\sqrt{${a}}=${b}\), which terminates`]; },
                        () => { const [p, q, d] = rng.pick([[3, 8, '0.375'], [7, 20, '0.35'], [16, 5, '3.2'], [9, 4, '2.25'], [11, 25, '0.44'], [13, 40, '0.325']]); return [T.frac(p, q), 1, R`\(${T.frac(p, q)}=${d}\), which terminates`]; },
                        () => { for (;;) { const p = rng.int(1, 9), q = rng.pick([2, 4, 5, 8]); if (p === q || CA.gcd(p, q) !== 1) continue; const v = dec(p / q); return [sq(T.frac(p * p, q * q)), 1, R`\(\sqrt{${T.frac(p * p, q * q)}}=${T.frac(p, q)}=${v}\), which terminates`]; } },
                        () => { const [p, q, d] = rng.pick([[1, 3, '0.\\overline{3}'], [-1, 3, '-0.\\overline{3}'], [5, 6, '0.8\\overline{3}'], [2, 9, '0.\\overline{2}'], [7, 11, '0.\\overline{63}'], [4, 3, '1.\\overline{3}'], [5, 12, '0.41\\overline{6}']]); return [T.frac(p, q), 2, R`\(${T.frac(p, q)}=${d}\), which repeats`]; },
                        () => { const d = rng.pick(BARRED); return [d, 2, 'the bar marks a block of digits that repeats for ever']; },
                        () => { const [p, q, d] = rng.pick([[1, 9, '\\frac{1}{3}=0.\\overline{3}'], [4, 9, '\\frac{2}{3}=0.\\overline{6}'], [25, 9, '\\frac{5}{3}=1.\\overline{6}'], [1, 36, '\\frac{1}{6}=0.1\\overline{6}'], [49, 9, '\\frac{7}{3}=2.\\overline{3}']]); return [sq(T.frac(p, q)), 2, R`\(\sqrt{${T.frac(p, q)}}=${d}\), which repeats`]; },
                        () => { const n = nonSquare(rng, 2, 99); return [sq(n), 3, R`${n} is not a perfect square, so \(\sqrt{${n}}\) is irrational`]; },
                        () => { const n = nonSquare(rng, 2, 30); return ['-' + sq(n), 3, R`${n} is not a perfect square, so \(-\sqrt{${n}}\) is irrational`]; },
                        () => { const d = rng.pick(PATTERNED); return [d, 3, 'the digits follow a pattern but no fixed block repeats, so it is irrational']; },
                        () => { const d = rng.pick(['\\pi', '2\\pi', '\\frac{\\pi}{4}', '-\\pi']); return [d, 3, R`\(\pi\) is irrational`]; },
                        () => { const [a, f] = rng.pick(TRAP_DEC); return [sq(a), 3, R`\(${a}=${f}\) is not the square of a fraction, so the root is irrational`]; },
                    ])();
                    return {
                        q: R`When the number \(${t}\) is written as a decimal, what do you get?`,
                        ans: CA.mc(rng, FAM[fam], FAM, { keepOrder: true }),
                        sol: `${FAM[fam]}: ${why}.`,
                    };
                },
            },
            {
                id: 'side-from-area', name: 'Squares, areas and sides', level: 2,
                gen(rng) {
                    const type = rng.int(0, 5);
                    const u = rng.pick(['cm', 'm']);
                    if (type === 0) {
                        const k = rng.int(5, 25);
                        return { q: `A square has an area of ${k * k} ${u}². What is its perimeter?`, ans: CA.num(4 * k, u), sol: R`Side \(=\sqrt{${k * k}}=${k}\) ${u}. Perimeter \(=4\times${k}=${4 * k}\) ${u}.` };
                    }
                    if (type === 1) {
                        const r = rng.pick([2, 3, 5]), [x, y] = rng.sample([1, 2, 3, 4, 5, 6], 2);
                        const a = r * x * x, b = r * y * y, s = r * x * y;
                        return { q: `A rectangle measures ${a} ${u} by ${b} ${u}. A square has the same area as the rectangle. How long is a side of the square?`, ans: CA.num(s, u), sol: R`Area \(=${a}\times${b}=${a * b}\) ${u}². Side \(=\sqrt{${a * b}}=${s}\) ${u}.` };
                    }
                    if (type === 2) {
                        const k = rng.int(3, 12);
                        return { q: `The total surface area of a cube is ${6 * k * k} cm². What is the length of one edge?`, ans: CA.num(k, 'cm'), sol: R`One face: \(${6 * k * k}\div6=${k * k}\) cm². Edge \(=\sqrt{${k * k}}=${k}\) cm.` };
                    }
                    if (type === 3) {
                        const j = rng.int(3, 9), t = rng.pick([10, 15, 20, 25, 30, 40]);
                        return { q: `${j * j} identical square tiles, each with an area of ${t * t} cm², are laid to make one large square. What is the perimeter of the large square?`, ans: CA.num(4 * j * t, 'cm'), sol: R`Each tile has side \(\sqrt{${t * t}}=${t}\) cm, and there are \(\sqrt{${j * j}}=${j}\) tiles along each side. Side \(=${j}\times${t}=${j * t}\) cm; perimeter \(=4\times${j * t}=${4 * j * t}\) cm.` };
                    }
                    if (type === 4) {
                        const k = rng.int(3, 12), f = rng.pick([2, 3, 4, 5]);
                        return { q: `A square photo has an area of ${k * k} cm². It is enlarged so that its area becomes ${f * f} times as large, and it is still a square. How long is a side of the enlargement?`, ans: CA.num(k * f, 'cm'), sol: R`New area \(=${f * f}\times${k * k}=${f * f * k * k}\) cm². Side \(=\sqrt{${f * f}\times${k * k}}=${f}\times${k}=${k * f}\) cm.` };
                    }
                    const k = rng.int(4, 15), w = rng.int(1, 3);
                    return { q: `A square lawn has an area of ${k * k} m². A path ${w} m wide runs all the way round the outside of it. What is the area of the path?`, ans: CA.num((k + 2 * w) ** 2 - k * k, 'm²'), sol: R`The lawn has side \(\sqrt{${k * k}}=${k}\) m. Lawn and path together make a square of side \(${k}+2\times${w}=${k + 2 * w}\) m. Path \(=${k + 2 * w}^2-${k}^2=${(k + 2 * w) ** 2}-${k * k}=${(k + 2 * w) ** 2 - k * k}\) m².` };
                },
            },
            {
                id: 'number-line', name: 'Roots on the number line', level: 2,
                gen(rng) {
                    for (;;) {
                        const n = nonSquare(rng, 2, 90), a = isqrt(n), x = Math.sqrt(n);
                        const lo = Math.max(0, a - 1), hi = lo + 3;
                        const others = rng.sample(Array.from({ length: 27 }, (_, i) => lo + 0.2 + i * 0.1), 3);
                        const xs = [x, ...others].sort((p, q) => p - q);
                        if (xs.some((v, i) => i && v - xs[i - 1] < 0.36)) continue;
                        if (!others.some(v => Math.floor(v) === a)) continue;      // one rival in the same unit interval
                        const pts = xs.map((v, i) => ({ x: v, label: 'ABCD'[i] }));
                        const correct = 'ABCD'[xs.indexOf(x)];
                        const frac = x - a;
                        const where = frac < 0.4 ? `closer to ${a}` : frac > 0.6 ? `closer to ${a + 1}` : 'near the middle';
                        return {
                            q: R`Which point on the number line shows \(\sqrt{${n}}\)?`,
                            fig: numberLine(lo, hi, pts),
                            ans: CA.mc(rng, correct, ['A', 'B', 'C', 'D'], { keepOrder: true }),
                            sol: R`\(${a}^2=${a * a}&lt;${n}&lt;${(a + 1) ** 2}=${a + 1}^2\), so the point is between ${a} and ${a + 1}, ${where}: \(${a}.5^2=${a * a + a}.25\) and \(\sqrt{${n}}\approx${x.toFixed(1)}\). That is point ${correct}.`,
                        };
                    }
                },
            },
            {
                id: 'cube-roots', name: 'Cube roots', level: 2,
                gen(rng) {
                    const type = rng.int(0, 6);
                    const k = rng.int(2, 10);
                    if (type === 0) return { q: R`Evaluate \(\sqrt[3]{${k ** 3}}\).`, ans: CA.num(k), sol: R`\(${k}\times${k}\times${k}=${k ** 3}\), so \(\sqrt[3]{${k ** 3}}=${k}\).` };
                    if (type === 1) return { q: R`Evaluate \(\sqrt[3]{-${k ** 3}}\).`, ans: CA.num(-k), sol: R`\((-${k})^3=-${k ** 3}\), so \(\sqrt[3]{-${k ** 3}}=-${k}\). A negative number has a negative cube root.` };
                    if (type === 2) {
                        for (;;) {
                            const p = rng.int(1, 6), q = rng.int(2, 6);
                            if (p === q || CA.gcd(p, q) !== 1) continue;
                            return { q: R`Evaluate \(\sqrt[3]{\frac{${p ** 3}}{${q ** 3}}}\). Give your answer as a fraction.`, ans: CA.frac(p, q), sol: R`\(\frac{\sqrt[3]{${p ** 3}}}{\sqrt[3]{${q ** 3}}}=${T.frac(p, q)}\).` };
                        }
                    }
                    if (type === 3) {
                        const what = rng.bool();
                        return { q: `A cube has a volume of ${k ** 3} cm³. What is ${what ? 'the length of one edge' : 'its total surface area'}?`, ans: what ? CA.num(k, 'cm') : CA.num(6 * k * k, 'cm²'), sol: R`Edge \(=\sqrt[3]{${k ** 3}}=${k}\) cm.` + (what ? '' : R` Surface area \(=6\times${k}^2=${6 * k * k}\) cm².`) };
                    }
                    if (type === 4) {
                        const j = rng.int(2, 12), plus = rng.bool();
                        return { q: R`Evaluate \(\sqrt{${j * j}}${plus ? '+' : '-'}\sqrt[3]{${k ** 3}}\).`, ans: CA.num(plus ? j + k : j - k), sol: R`\(\sqrt{${j * j}}=${j}\) and \(\sqrt[3]{${k ** 3}}=${k}\), so the answer is \(${j}${plus ? '+' : '-'}${k}=${plus ? j + k : j - k}\).` };
                    }
                    if (type === 5) {
                        const d = rng.int(1, 9), v = (d ** 3 / 1000).toFixed(3);
                        return { q: R`Evaluate \(\sqrt[3]{${v}}\). Give your answer as a decimal.`, ans: CA.num(d / 10, '', { tol: 0.001 }), sol: R`\(${v}=\frac{${d ** 3}}{1000}\), so the cube root is \(\frac{${d}}{10}=${dec(d / 10)}\).` };
                    }
                    for (;;) {
                        const n = rng.int(2, 999), a = Math.round(Math.cbrt(n));
                        if (a ** 3 === n) continue;
                        const f = a ** 3 > n ? a - 1 : a;
                        return { q: R`\(\sqrt[3]{${n}}\) lies between two consecutive integers. What is the smaller one?`, ans: CA.num(f), sol: R`\(${f}^3=${f ** 3}&lt;${n}&lt;${(f + 1) ** 3}=${f + 1}^3\), so \(${f}&lt;\sqrt[3]{${n}}&lt;${f + 1}\).` };
                    }
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'count-integers', name: 'Counting integers and squares', level: 3,
                gen(rng) {
                    const type = rng.int(0, 5);
                    if (type === 0) {
                        for (;;) {
                            const a = nonSquare(rng, 2, 60), b = nonSquare(rng, a + 15, a + 250);
                            const fa = isqrt(a), fb = isqrt(b);
                            if (fb - fa < 2) continue;
                            return { q: R`How many integers lie between \(\sqrt{${a}}\) and \(\sqrt{${b}}\)?`, ans: CA.num(fb - fa), sol: R`\(\sqrt{${a}}\) is between ${fa} and ${fa + 1}; \(\sqrt{${b}}\) is between ${fb} and ${fb + 1}. The integers in between run from ${fa + 1} to ${fb}: \(${fb}-${fa + 1}+1=${fb - fa}\).` };
                        }
                    }
                    if (type === 1) {
                        const p = rng.int(1, 12), q = p + rng.int(1, 3);
                        return { q: R`How many positive integers \(n\) satisfy \(${p}&lt;\sqrt{n}&lt;${q}\)?`, ans: CA.num(q * q - p * p - 1), sol: R`Square everything: \(${p * p}&lt;n&lt;${q * q}\). So \(n\) runs from ${p * p + 1} to ${q * q - 1}: \(${q * q - 1}-${p * p + 1}+1=${q * q - p * p - 1}\) values.` };
                    }
                    if (type === 2) {
                        const a = nonSquare(rng, 2, 120), b = nonSquare(rng, 2, 120);
                        const fa = isqrt(a), fb = isqrt(b);
                        return { q: R`How many integers \(x\) satisfy \(-\sqrt{${a}}&lt;x&lt;\sqrt{${b}}\)?`, ans: CA.num(fa + fb + 1), sol: R`\(\sqrt{${a}}\) is between ${fa} and ${fa + 1}, and \(\sqrt{${b}}\) is between ${fb} and ${fb + 1}. So \(x\) runs from \(-${fa}\) to \(${fb}\): ${fa} negative integers, zero, and ${fb} positive ones, \(${fa}+1+${fb}=${fa + fb + 1}\).` };
                    }
                    if (type === 3) {
                        for (;;) {
                            const A = nonSquare(rng, 10, 300), B = nonSquare(rng, A + 60, A + 900);
                            const fa = isqrt(A), fb = isqrt(B);
                            if (fb - fa < 3) continue;
                            return { q: `How many perfect squares are there between ${A} and ${B}?`, ans: CA.num(fb - fa), sol: R`The first is \(${fa + 1}^2=${(fa + 1) ** 2}\) and the last is \(${fb}^2=${fb * fb}\). That is \(${fb}-${fa + 1}+1=${fb - fa}\) squares.` };
                        }
                    }
                    if (type === 4) {
                        const N = rng.int(20, 250), f = isqrt(N);
                        return { q: R`For how many integers \(n\) from 1 to ${N} is \(\sqrt{n}\) <strong>irrational</strong>?`, ans: CA.num(N - f), sol: R`\(\sqrt{n}\) is rational only when \(n\) is a perfect square. The squares up to ${N} are \(1^2,\ldots,${f}^2\) (\(${f}^2=${f * f}\), \(${f + 1}^2=${(f + 1) ** 2}\) is too big): ${f} of them. So \(${N}-${f}=${N - f}\) are irrational.` };
                    }
                    const k = rng.int(3, 14), h = rng.bool();
                    // √n < k + 0.5  ⇔  n < k² + k + 0.25  ⇔  n ≤ k² + k
                    return h
                        ? { q: R`What is the largest integer \(n\) for which \(\sqrt{n}&lt;${k}.5\)?`, ans: CA.num(k * k + k), sol: R`Square: \(n&lt;${k}.5^2=${k * k + k}.25\). The largest integer below that is ${k * k + k}.` }
                        : { q: R`How many positive integers \(n\) have \(\sqrt{n}\) closer to ${k} than to any other integer?`, ans: CA.num(2 * k), sol: R`We need \(${k - 1}.5&lt;\sqrt{n}&lt;${k}.5\), that is \(${k * k - k}.25&lt;n&lt;${k * k + k}.25\). So \(n\) runs from ${k * k - k + 1} to ${k * k + k}: \(${2 * k}\) values.` };
                },
            },
            {
                id: 'solve-square', name: 'Equations with squares', level: 3,
                gen(rng) {
                    const type = rng.int(0, 5);
                    const k = rng.int(2, 12);
                    if (type === 0) {
                        const a = rng.int(1, 15) * rng.pick([1, -1]), big = rng.bool();
                        const lhs = a > 0 ? `(x-${a})^2` : `(x+${-a})^2`;
                        return { q: R`Find the <strong>${big ? 'larger' : 'smaller'}</strong> solution of \(${lhs}=${k * k}\).`, ans: CA.num(big ? a + k : a - k), sol: R`\(x${a > 0 ? '-' + a : '+' + -a}=${k}\) or \(-${k}\), so \(x=${a + k}\) or \(x=${a - k}\). The ${big ? 'larger' : 'smaller'} is \(${big ? a + k : a - k}\).` };
                    }
                    if (type === 1) {
                        for (;;) {
                            const p = rng.int(2, 9), q = rng.int(1, 12);
                            if (CA.gcd(p, q) !== 1) continue;
                            return { q: R`Find the <strong>positive</strong> solution of \(${p * p}x^2=${q * q}\). Give your answer as a fraction.`, ans: CA.frac(q, p), sol: R`\(x^2=\frac{${q * q}}{${p * p}}\), so \(x=\pm\frac{${q}}{${p}}\). The positive solution is \(\frac{${q}}{${p}}\).` };
                        }
                    }
                    if (type === 2) {
                        const c = rng.int(2, 9), d = rng.int(1, 30), plus = rng.bool();
                        const rhs = plus ? c * k * k + d : c * k * k - d;
                        return { q: R`Find the <strong>negative</strong> solution of \(${c}x^2${plus ? '+' : '-'}${d}=${rhs}\).`, ans: CA.num(-k), sol: R`${plus ? 'Subtract' : 'Add'} ${d}: \(${c}x^2=${c * k * k}\). Divide by ${c}: \(x^2=${k * k}\), so \(x=\pm${k}\). The negative solution is \(-${k}\).` };
                    }
                    if (type === 3) {
                        const kk = 2 * rng.int(1, 6) + 1, b = (2 * rng.int(0, 5) + 1) * rng.pick([1, -1]), big = rng.bool();
                        const x1 = (kk - b) / 2, x2 = (-kk - b) / 2;
                        const inner = `2x${b > 0 ? '+' + b : '-' + -b}`;
                        return { q: R`Find the <strong>${big ? 'larger' : 'smaller'}</strong> solution of \((${inner})^2=${kk * kk}\).`, ans: CA.num(big ? x1 : x2), sol: R`\(${inner}=${kk}\) gives \(x=${x1}\); \(${inner}=-${kk}\) gives \(x=${x2}\). The ${big ? 'larger' : 'smaller'} is \(${big ? x1 : x2}\).` };
                    }
                    if (type === 4) {
                        const a = rng.int(1, 12) * rng.pick([1, -1]);
                        const lhs = a > 0 ? `(x-${a})^2` : `(x+${-a})^2`;
                        const what = rng.pick(['sum', 'product']);
                        const v = what === 'sum' ? 2 * a : a * a - k * k;
                        return { q: R`The equation \(${lhs}=${k * k}\) has two solutions. What is their <strong>${what}</strong>?`, ans: CA.num(v), sol: R`\(x=${a}+${k}=${a + k}\) or \(x=${a}-${k}=${a - k}\). Their ${what} is \(${neg(a + k)}${what === 'sum' ? '+' : '\\times'}${neg(a - k)}=${v}\).` };
                    }
                    const s = rng.int(2, 9), w = rng.int(1, 6);
                    const A = (s + 2 * w) ** 2;
                    return { q: `A square picture is surrounded by a frame ${w} cm wide. Picture and frame together form a square of area ${A} cm². What is the area of the picture alone?`, ans: CA.num(s * s, 'cm²'), sol: R`The outer square has side \(\sqrt{${A}}=${s + 2 * w}\) cm. Take off the frame on both sides: \(${s + 2 * w}-2\times${w}=${s}\) cm. Picture area \(=${s}^2=${s * s}\) cm².` };
                },
            },
            {
                id: 'root-puzzles', name: 'Root puzzles', level: 3,
                gen(rng) {
                    const type = rng.int(0, 4);
                    if (type === 0) {
                        for (;;) {
                            const p = rng.int(3, 9), q = rng.int(2, 9), r = rng.int(2, 9);
                            const mid = q * q - r, out = p * p - q;
                            if (mid < 1 || out < 1) continue;
                            return { q: R`Evaluate \(\sqrt{${out}+\sqrt{${mid}+\sqrt{${r * r}}}}\).`, ans: CA.num(p), sol: R`Work from the inside out: \(\sqrt{${r * r}}=${r}\); \(\sqrt{${mid}+${r}}=\sqrt{${q * q}}=${q}\); \(\sqrt{${out}+${q}}=\sqrt{${p * p}}=${p}\).` };
                        }
                    }
                    if (type === 1) {
                        const k = rng.pick([8, 12, 18, 20, 24, 27, 28, 32, 40, 44, 45, 48, 50, 52, 54, 60, 63, 72, 75, 80, 84, 90, 96, 98, 108, 120, 125, 147, 150, 162, 175, 180, 200, 242, 245, 252]);
                        const [c, r] = CA.simplifyRoot(k);
                        return { q: R`What is the smallest positive integer \(n\) for which \(\sqrt{${k}n}\) is an integer?`, ans: CA.num(r), sol: R`\(${k}=${c * c}\times${r}=${c}^2\times${r}\). The factor ${r} has no square in it, so \(n\) must supply another ${r}: \(n=${r}\), and \(\sqrt{${k}\times${r}}=\sqrt{${k * r}}=${c * r}\).` };
                    }
                    if (type === 2) {
                        const n = rng.int(6, 40);
                        return { q: R`Evaluate \(\sqrt{1+3+5+\cdots+${2 * n - 3}+${2 * n - 1}}\) (the sum of all the odd numbers from 1 to ${2 * n - 1}).`, ans: CA.num(n), sol: R`There are \(\frac{${2 * n - 1}+1}{2}=${n}\) odd numbers, and the sum of the first \(k\) odd numbers is \(k^2\). So the sum is \(${n}^2=${n * n}\) and its root is ${n}.` };
                    }
                    if (type === 3) {
                        const n = rng.pick([2, 3, 5, 6, 7, 11, 13, 15]);
                        const v = Math.sqrt(n).toFixed(3);
                        if (rng.bool()) return { q: R`Given that \(\sqrt{${n}}\approx${v}\), find \(\sqrt{${n * 100}}\) correct to two decimal places.`, ans: CA.num(CA.round(v * 10, 2), '', { tol: 0.0051, show: m((v * 10).toFixed(2)) }), sol: R`\(\sqrt{${n * 100}}=\sqrt{100}\times\sqrt{${n}}=10\times${v}=${(v * 10).toFixed(2)}\).` };
                        return { q: R`Given that \(\sqrt{${n}}\approx${v}\), find \(\sqrt{${n * 10000}}\) correct to one decimal place.`, ans: CA.num(CA.round(v * 100, 1), '', { tol: 0.051, show: m((v * 100).toFixed(1)) }), sol: R`\(\sqrt{${n * 10000}}=\sqrt{10000}\times\sqrt{${n}}=100\times${v}=${(v * 100).toFixed(1)}\).` };
                    }
                    const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 6);
                    const x = a * a, y = b * b;
                    return { q: R`If \(\sqrt{x}=${a}\) and \(\sqrt{y}=${b}\), what is \(\sqrt{${c * c}xy}\)?`, ans: CA.num(c * a * b), sol: R`\(\sqrt{${c * c}xy}=\sqrt{${c * c}}\times\sqrt{x}\times\sqrt{y}=${c}\times${a}\times${b}=${c * a * b}\). (Check: \(x=${x}\), \(y=${y}\), and \(${c * c}\times${x}\times${y}=${c * c * x * y}=${c * a * b}^2\).)` };
                },
            },
        ],

        assignment: [
            ['perfect-squares', 3], ['two-roots', 4], ['fraction-decimal-roots', 2], ['between-integers', 3], ['classify', 3],
            ['classify-tree', 4], ['estimate', 4], ['compare-order', 4], ['inverse-operations', 4], ['number-line', 3], ['side-from-area', 2], ['cube-roots', 2],
            ['count-integers', 4], ['solve-square', 4], ['root-puzzles', 4],
        ],
    });
})();
