/* Challenge Academy — Lesson 10: Advanced Square Roots and Irrational Numbers */
(function () {
    'use strict';
    const R = String.raw, F = CA.fig, m = CA.m, T = CA.tex;

    // ── Small helpers ────────────────────────────────────────────────────
    const isqrt = n => { let a = Math.floor(Math.sqrt(n)); while (a * a > n) a--; while ((a + 1) * (a + 1) <= n) a++; return a; };
    const nonSquare = (rng, lo, hi) => { for (;;) { const n = rng.int(lo, hi); if (!CA.isSquare(n)) return n; } };
    /** k√n written in simplest form, as TeX. */
    const simp = (n, k = 1) => { const [c, r] = CA.simplifyRoot(n); return T.root(k * c, r); };
    /** The book's two steps for √n as TeX: √72 = √(36×2) = 6√2, or √36 = 6, or just √15. */
    const steps = n => {
        const [c, r] = CA.simplifyRoot(n);
        if (c === 1) return R`\sqrt{${n}}`;
        if (r === 1) return R`\sqrt{${n}}=${c}`;
        return R`\sqrt{${n}}=\sqrt{${c * c}\times${r}}=${T.root(c, r)}`;
    };
    /** Answer k√n: a plain number when n is a perfect square, otherwise two boxes. */
    const rootAns = (k, n, unit = '') => { const [c, r] = CA.simplifyRoot(n); return r === 1 ? CA.num(k * c, unit) : CA.root(k, n, unit); };
    /** U+221A text for SVG labels: 3√2. */
    const uroot = (c, r) => (r === 1 ? `${c}` : `${c === 1 ? '' : c}√${r}`);
    /**
     * A sum of radicals as TeX plus its value.  terms = [[c, r], …] means c√r; r = 1 is a plain number.
     * lin([[5, 1], [2, 6]]) → 5+2√6.  Nothing is simplified or collected.
     */
    function lin(terms) {
        const ts = terms.filter(t => t[0] !== 0);
        if (!ts.length) return { t: '0', v: 0 };
        let t = '';
        ts.forEach(([c, r], i) => { t += i === 0 ? T.root(c, r) : (c < 0 ? '-' : '+') + T.root(Math.abs(c), r); });
        return { t, v: ts.reduce((s, [c, r]) => s + c * Math.sqrt(r), 0) };
    }
    /** (n·√rad)/d in simplest form (square factors pulled out of rad, fraction reduced), as TeX plus value. */
    function fr(n, d, rad = 1) {
        const [c, r] = CA.simplifyRoot(rad);
        [n, d] = CA.reduce(n * c, d);
        return { t: d === 1 ? T.root(n, r) : R`${n < 0 ? '-' : ''}\dfrac{${T.root(Math.abs(n), r)}}{${d}}`, v: n * Math.sqrt(r) / d, n, d, r };
    }
    const plain = (n, d = 1) => ({ t: T.frac(n, d).replace('\\frac', '\\dfrac'), v: n / d });
    /**
     * Multiple choice between expressions {t: TeX, v: value}.  Wrong choices that are equal in
     * value to the right one (or to each other) are thrown out; returns null if fewer than 3 survive.
     */
    function mcv(rng, correct, wrongs) {
        const kept = [correct];
        for (const w of wrongs) if (!kept.some(k => k.t === w.t || Math.abs(k.v - w.v) < 1e-9)) kept.push(w);
        if (kept.length < 4) return null;
        return CA.mc(rng, m(correct.t), kept.slice(1, 4).map(k => m(k.t)));
    }
    /** A fraction-times-radical answer: number boxes when it is k√r, multiple choice when it is a fraction. */
    const fracAns = (rng, correct, wrongs) => (correct.d === 1 ? rootAns(correct.n, correct.r) : mcv(rng, correct, wrongs));
    /** Exact fraction arithmetic on [n, d] pairs. */
    const fadd = ([a, b], [c, d]) => CA.reduce(a * d + c * b, b * d);

    // ── Figures ──────────────────────────────────────────────────────────
    /** A rectangle w by h (numbers, for proportions) with side labels and an optional dashed diagonal. */
    function rectFig(w, h, lab = {}) {
        const s = Math.min(150 / w, 96 / h), W = w * s, H = h * s, x = 52, y = 10;
        let b = F.rect(x, y, W, H, { fill: F.colors.FILL });
        if (lab.d != null) b += F.line(x, y + H, x + W, y, { dash: true, stroke: F.colors.ACCENT }) + F.text(x + W / 2 - 9, y + H / 2 - 7, lab.d, { fill: F.colors.ACCENT, bold: true });
        if (lab.w != null) b += F.text(x + W / 2, y + H + 16, lab.w);
        if (lab.h != null) b += F.text(x - 6, y + H / 2 + 4, lab.h, { anchor: 'end' });
        return F.svg(x + W + 14, y + H + 24, b, { label: 'rectangle' });
    }
    /** An equilateral triangle with its height dashed. */
    function equiFig(side, height) {
        const S = 116, H = S * Math.sqrt(3) / 2, x = 24, y = 10;
        let b = F.poly([[x, y + H], [x + S, y + H], [x + S / 2, y]], { fill: F.colors.FILL });
        b += F.line(x + S / 2, y, x + S / 2, y + H, { dash: true, stroke: F.colors.ACCENT }) + F.rightAngle(x + S / 2, y + H, 1, 0, 0, -1, 7);
        b += F.text(x + S * 0.75 + 8, y + H / 2, side, { anchor: 'start' }) + F.text(x + S / 2 - 6, y + H * 0.6, height, { anchor: 'end', fill: F.colors.ACCENT, bold: true });
        b += F.text(x + S / 2, y + H + 16, side);
        return F.svg(x + S + 56, y + H + 24, b, { label: 'equilateral triangle' });
    }
    const TUT_SQUARE = rectFig(1, 1, { w: 's', h: 's', d: 's√2' });
    const TUT_RECT = rectFig(2, 1, { w: 'a', h: 'b', d: '√(a²+b²)' });

    const PRIMES = [2, 3, 5, 7, 11];
    const SQF = [2, 3, 5, 6, 7, 10, 11, 13];

    CA.register({
        id: 10,

        tutorial: [
            {
                h: 'Multiplying radical expressions',
                html: R`
                <p>In Lesson 9 you met square roots one at a time. Now we do <em>arithmetic</em> with them. An expression
                   such as \(\sqrt{2}\) or \(3\sqrt{5}\) is a <strong>radical expression</strong>; \(3\sqrt5\) simply means
                   \(3\times\sqrt5\). To multiply, multiply the numbers in front together and the numbers under the
                   radical together:</p>
                <div class="ca-formula">\[ m\sqrt{a}\cdot n\sqrt{b} = mn\sqrt{ab} \qquad (a \ge 0,\ b \ge 0) \]</div>
                <p><strong>Why?</strong> Square \(\sqrt a\times\sqrt b\): you get \(\sqrt a\,\sqrt a\,\sqrt b\,\sqrt b = ab\).
                   So \(\sqrt a\times\sqrt b\) is the positive number whose square is \(ab\) — and that is exactly what
                   \(\sqrt{ab}\) means. The numbers in front just multiply as usual.</p>
                <ul>
                    <li>\(\sqrt{3}\cdot\sqrt{5} = \sqrt{15}\)</li>
                    <li>\(\sqrt{2}\cdot\sqrt{8} = \sqrt{16} = 4\)</li>
                    <li>\(2\sqrt{3}\cdot 5\sqrt{7} = 10\sqrt{21}\)</li>
                    <li>\(\sqrt{5}\cdot\sqrt{5} = 5\), so \((3\sqrt5)^2 = 9\times5 = 45\)</li>
                </ul>
                <p><strong>Simplifying a square root.</strong> Read the rule backwards and you can pull a perfect square
                   <em>out</em> of the radical. To simplify \(\sqrt{a}\) when \(a\) has a factor that is a perfect square:</p>
                <div class="ca-key"><strong>Step 1.</strong> Write \(a\) as a product of two numbers, one of which is a perfect square.<br>
                   <strong>Step 2.</strong> Find the square root of the perfect square, and keep the rest under the \(\sqrt{\phantom{a}}\).
                   \[ \sqrt{72} = \sqrt{36\times 2} = \sqrt{36}\times\sqrt{2} = 6\sqrt{2} \]</div>
                <p>Use the <strong>biggest</strong> perfect square you can find (try 4, 9, 16, 25, 36, 49, …). A radical is in
                   <strong>simplest form</strong> when the number under the root has no perfect-square factor bigger than 1.</p>
                <table>
                    <tr><th>\(\sqrt{8}\)</th><th>\(\sqrt{12}\)</th><th>\(\sqrt{18}\)</th><th>\(\sqrt{20}\)</th><th>\(\sqrt{27}\)</th><th>\(\sqrt{32}\)</th><th>\(\sqrt{45}\)</th><th>\(\sqrt{48}\)</th><th>\(\sqrt{50}\)</th><th>\(\sqrt{75}\)</th></tr>
                    <tr>${[8, 12, 18, 20, 27, 32, 45, 48, 50, 75].map(n => `<td>${m(simp(n))}</td>`).join('')}</tr>
                </table>
                <p>After multiplying, always simplify: \(2\sqrt3\cdot5\sqrt6 = 10\sqrt{18} = 10\times3\sqrt2 = 30\sqrt2\).</p>
                <div class="ca-warn"><strong>Not finished?</strong> \(\sqrt{72} = 2\sqrt{18}\) is true but not simplest, because
                   18 still hides a 9. Keep going: \(2\times3\sqrt2 = 6\sqrt2\).</div>
                <div class="ca-tip"><strong>Going the other way.</strong> To push a number back under the root, square it:
                   \(3\sqrt{5} = \sqrt{9\times5} = \sqrt{45}\). This is the trick for comparing radicals.</div>`,
            },
            {
                h: 'Dividing radical expressions',
                html: R`
                <p>Division works the same way: numbers in front divide, numbers under the radical divide.</p>
                <div class="ca-formula">\[ m\sqrt{a} \div n\sqrt{b} = \frac{m}{n}\cdot\frac{\sqrt{a}}{\sqrt{b}} = \frac{m}{n}\sqrt{\frac{a}{b}} \qquad (a \ge 0,\ b &gt; 0,\ n \ne 0) \]</div>
                <ul>
                    <li>\(6\sqrt{15} \div 3\sqrt{5} = \dfrac{6}{3}\sqrt{\dfrac{15}{5}} = 2\sqrt{3}\)</li>
                    <li>\(\sqrt{72}\div\sqrt{2} = \sqrt{36} = 6\)</li>
                    <li>\(10\sqrt{6} \div 5\sqrt{2} = 2\sqrt{3}\)</li>
                </ul>
                <p><strong>Simplifying \(\sqrt{\dfrac{a}{b}}\).</strong> A radical in simplest form has no fraction under the root
                   and no root in the denominator. Two steps get rid of both:</p>
                <div class="ca-key"><strong>Step 1.</strong> \(\sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}\).<br>
                   <strong>Step 2.</strong> Multiply the top and the bottom by \(\sqrt{b}\):
                   \[ \frac{\sqrt{a}}{\sqrt{b}} = \frac{\sqrt{a}\times\sqrt{b}}{\sqrt{b}\times\sqrt{b}} = \frac{\sqrt{ab}}{b} \]</div>
                <p>The value does not change, because \(\dfrac{\sqrt b}{\sqrt b} = 1\). Getting the root out of the
                   denominator like this is called <strong>rationalising the denominator</strong>. Then simplify as usual:</p>
                <ul>
                    <li>\(\sqrt{\dfrac{3}{8}} = \dfrac{\sqrt3}{\sqrt8} = \dfrac{\sqrt3\times\sqrt8}{\sqrt8\times\sqrt8} = \dfrac{\sqrt{24}}{8} = \dfrac{2\sqrt6}{8} = \dfrac{\sqrt6}{4}\)</li>
                    <li>\(\dfrac{4}{\sqrt6} = \dfrac{4\sqrt6}{6} = \dfrac{2\sqrt6}{3}\)</li>
                    <li>\(\dfrac{6}{\sqrt3} = \dfrac{6\sqrt3}{3} = 2\sqrt3\)</li>
                    <li>\(3\sqrt2 \div 2\sqrt3 = \dfrac32\sqrt{\dfrac23} = \dfrac32\times\dfrac{\sqrt6}{3} = \dfrac{\sqrt6}{2}\)</li>
                </ul>
                <div class="ca-tip"><strong>Simplify the root first.</strong> \(\dfrac{12}{\sqrt{8}} = \dfrac{12}{2\sqrt2} = \dfrac{6}{\sqrt2} = \dfrac{6\sqrt2}{2} = 3\sqrt2\).
                   Smaller numbers, fewer mistakes.</div>
                <div class="ca-warn"><strong>Two classic slips.</strong> (1) \(\sqrt b\times\sqrt b = b\), not \(b^2\):
                   \(\dfrac{4}{\sqrt6} \ne \dfrac{4\sqrt6}{36}\). (2) You may only cancel numbers <em>outside</em> the root:
                   \(\dfrac{2\sqrt6}{3}\) is finished — it is not \(2\sqrt2\).</div>`,
            },
            {
                h: 'Adding and subtracting radical expressions',
                html: R`
                <p>\(3\sqrt2 + 5\sqrt2\) is “3 lots of \(\sqrt2\) plus 5 lots of \(\sqrt2\)”: 8 lots altogether. Terms with the
                   <em>same number under the radical symbol</em> collect exactly like \(3x + 5x = 8x\). Terms with different
                   numbers under the radical, such as \(\sqrt2 + \sqrt3\), cannot be combined.</p>
                <div class="ca-key"><strong>Simplify first if possible.</strong> Then:<br>
                   <strong>Step 1.</strong> Group the terms with the same number under the radical symbol.<br>
                   <strong>Step 2.</strong> Add or subtract the numbers before the radical symbol.</div>
                <p>Radicals that look different may turn out to be the same kind once simplified:</p>
                <div class="ca-formula">\[ \sqrt{8} + \sqrt{18} = 2\sqrt2 + 3\sqrt2 = 5\sqrt2 \]
                   \[ 2\sqrt{12} - \sqrt{27} + \sqrt{75} = 4\sqrt3 - 3\sqrt3 + 5\sqrt3 = 6\sqrt3 \]</div>
                <p>With two kinds, group each kind and keep the two groups apart:</p>
                <div class="ca-formula">\[ \sqrt{8} + 2\sqrt{3} + \sqrt{18} - \sqrt{27} = (2\sqrt2 + 3\sqrt2) + (2\sqrt3 - 3\sqrt3) = 5\sqrt2 - \sqrt3 \]</div>
                <p>Fractions follow the same steps: \(\sqrt{12} - \sqrt{\tfrac13} = 2\sqrt3 - \dfrac{\sqrt3}{3} = \dfrac{5\sqrt3}{3}\).</p>
                <div class="ca-warn"><strong>Common mistake.</strong> \(\sqrt{8}+\sqrt{18} = \sqrt{26}\) is wrong: there is no
                   rule \(\sqrt a + \sqrt b = \sqrt{a+b}\). Check with decimals: \(2.83 + 4.24 = 7.07\), while
                   \(\sqrt{26}\approx5.10\). (And \(5\sqrt2 \approx 7.07\). ✓)</div>`,
            },
            {
                h: 'Going further: brackets and conjugates',
                html: R`
                <p><strong>Brackets</strong> expand just as in algebra — multiply every term by every term, then simplify:</p>
                <ul>
                    <li>\(\sqrt2\,(\sqrt6 + 3) = \sqrt{12} + 3\sqrt2 = 2\sqrt3 + 3\sqrt2\)</li>
                    <li>\((\sqrt3 + \sqrt2)^2 = 3 + 2\sqrt6 + 2 = 5 + 2\sqrt6\) — do not forget the middle term \(2\sqrt{ab}\)!</li>
                    <li>\((3 + \sqrt5)(3 - \sqrt5) = 9 - 3\sqrt5 + 3\sqrt5 - 5 = 4\)</li>
                </ul>
                <div class="ca-key"><strong>Conjugates.</strong> \(a + \sqrt b\) and \(a - \sqrt b\) are called
                   <strong>conjugates</strong>. Their product is a difference of squares, and the root disappears:
                   \[ (a+\sqrt b)(a-\sqrt b) = a^2 - b \qquad\qquad (\sqrt a+\sqrt b)(\sqrt a-\sqrt b) = a - b \]</div>
                <p>That makes conjugates the tool for a sum or difference in the denominator: multiply top and bottom by
                   the conjugate.</p>
                <div class="ca-formula">\[ \frac{1}{\sqrt3 - 1} = \frac{1}{\sqrt3-1}\times\frac{\sqrt3+1}{\sqrt3+1} = \frac{\sqrt3+1}{3-1} = \frac{\sqrt3+1}{2} \]</div>
                <div class="ca-warn"><strong>Wrong conjugate.</strong> Multiplying \(\dfrac{1}{\sqrt3-1}\) by \(\dfrac{\sqrt3-1}{\sqrt3-1}\)
                   gives \((\sqrt3-1)^2 = 4 - 2\sqrt3\) underneath — the root is still there. Flip the sign in the middle.</div>`,
            },
            {
                h: 'Going further: comparing, integer part and decimal part',
                html: R`
                <p><strong>Which is bigger, \(2\sqrt5\) or \(3\sqrt2\)?</strong> Both are positive, so compare their squares:
                   \((2\sqrt5)^2 = 20\) and \((3\sqrt2)^2 = 18\). Since \(20 &gt; 18\), \(2\sqrt5 &gt; 3\sqrt2\).</p>
                <p><strong>Integer part and decimal part.</strong> Since \(3^2 = 9 &lt; 11 &lt; 16 = 4^2\), we know
                   \(\sqrt{11} = 3.3166\ldots\) The <strong>integer part</strong> is 3. The <strong>decimal part</strong> is
                   everything after the point — and we can write it <em>exactly</em>:</p>
                <div class="ca-formula">\[ \text{decimal part of } \sqrt{11} \;=\; \sqrt{11} - 3 \]</div>
                <p>Contest problems love this, because conjugates then make the roots vanish. If \(b = \sqrt{11}-3\), then
                   \(b\,(b+6) = (\sqrt{11}-3)(\sqrt{11}+3) = 11 - 9 = 2\).</p>
                <div class="ca-warn"><strong>Careful with subtraction.</strong> The integer part of \(10 - \sqrt{11}\) is not
                   \(10 - 3 = 7\). Since \(\sqrt{11}\approx3.32\), \(10-\sqrt{11}\approx 6.68\), whose integer part is 6.</div>`,
            },
            {
                h: 'Going further: radicals in geometry',
                html: R`
                <p>Radicals turn up the moment you draw a diagonal. By the Pythagorean theorem, a right triangle with legs
                   \(a\) and \(b\) has hypotenuse \(\sqrt{a^2+b^2}\).</p>
                ${F.row(F.cap(TUT_SQUARE, 'Square: diagonal = side × √2'), F.cap(TUT_RECT, 'Rectangle: diagonal = √(a² + b²)'))}
                <ul>
                    <li>A square of side 5 has diagonal \(\sqrt{25+25} = \sqrt{50} = 5\sqrt2\).</li>
                    <li>A square with diagonal 8 has side \(\dfrac{8}{\sqrt2} = 4\sqrt2\) and area \((4\sqrt2)^2 = 32\).</li>
                    <li>An equilateral triangle of side \(2k\) has height \(\sqrt{(2k)^2-k^2} = k\sqrt3\).</li>
                    <li>A rectangle \(\sqrt{12}\) by \(\sqrt{6}\) has area \(\sqrt{72} = 6\sqrt2\); a rectangle \(\sqrt{8}\)
                        by \(\sqrt{18}\) has perimeter \(2(2\sqrt2 + 3\sqrt2) = 10\sqrt2\).</li>
                </ul>`,
            },
        ],

        // Mirrors the textbook's own summary page for this lesson.
        summary: [
            {
                topic: 'Multiplying Radical Expressions',
                points: [
                    R`\(m\sqrt{a}\cdot n\sqrt{b} = mn\sqrt{ab}\) \((a \ge 0,\ b \ge 0)\).`,
                    R`To simplify a square root like \(\sqrt{a}\), where \(a\) has a factor which is a perfect square:<br>
                      Step 1: write \(a\) as a product of two numbers, one of which is a perfect square.<br>
                      Step 2: find the square root of the perfect square and keep the rest under the \(\sqrt{\phantom{a}}\).`,
                ],
            },
            {
                topic: 'Dividing Radical Expressions',
                points: [
                    R`\(m\sqrt{a}\div n\sqrt{b} = \dfrac{m}{n}\cdot\dfrac{\sqrt{a}}{\sqrt{b}} = \dfrac{m}{n}\sqrt{\dfrac{a}{b}}\) \((a \ge 0,\ b &gt; 0,\ n \ne 0)\).`,
                    R`To simplify a square root like \(\sqrt{\dfrac{a}{b}}\):<br>
                      Step 1: \(\sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}\).<br>
                      Step 2: \(\dfrac{\sqrt{a}}{\sqrt{b}} = \dfrac{\sqrt{a}\times\sqrt{b}}{\sqrt{b}\times\sqrt{b}} = \dfrac{\sqrt{ab}}{b}\).`,
                ],
            },
            {
                topic: 'Adding/Subtracting Radical Expressions',
                points: [
                    R`Simplify first if possible.`,
                    R`Step 1: group terms with the same number under the radical symbol.`,
                    R`Step 2: add or subtract the numbers before the radical symbol.`,
                ],
            },
        ],

        examples: [
            {
                title: 'Multiplying, then simplifying',
                q: R`(a) Write \(\sqrt{180}\) in simplest form. (b) Calculate \(2\sqrt{3}\cdot5\sqrt{6}\).`,
                steps: [
                    R`(a) Step 1: write 180 as a product with a perfect square — the biggest is 36: \(180 = 36\times5\).`,
                    R`Step 2: take the square root of 36 and keep the 5 under the root: \(\sqrt{180} = \sqrt{36}\times\sqrt5 = 6\sqrt5\).`,
                    R`(b) Numbers in front together, numbers under the radical together: \(2\sqrt3\cdot5\sqrt6 = 10\sqrt{18}\).`,
                    R`Simplify: \(\sqrt{18} = \sqrt{9\times2} = 3\sqrt2\), so \(10\sqrt{18} = 30\sqrt2\).`,
                ],
                answer: R`(a) \(6\sqrt5\) &nbsp; (b) \(30\sqrt2\)`,
            },
            {
                title: 'Dividing',
                q: R`Calculate (a) \(6\sqrt{15}\div3\sqrt{5}\) &nbsp; (b) \(3\sqrt{2}\div2\sqrt{3}\).`,
                steps: [
                    R`(a) \(\dfrac{6}{3}\sqrt{\dfrac{15}{5}} = 2\sqrt3\).`,
                    R`(b) \(\dfrac{3}{2}\sqrt{\dfrac{2}{3}}\). The fraction under the root must go.`,
                    R`\(\sqrt{\dfrac23} = \dfrac{\sqrt2}{\sqrt3} = \dfrac{\sqrt2\times\sqrt3}{\sqrt3\times\sqrt3} = \dfrac{\sqrt6}{3}\).`,
                    R`So the answer is \(\dfrac32\times\dfrac{\sqrt6}{3} = \dfrac{\sqrt6}{2}\).`,
                ],
                answer: R`(a) \(2\sqrt3\) &nbsp; (b) \(\dfrac{\sqrt6}{2}\)`,
            },
            {
                title: 'No fraction under the root, no root in the denominator',
                q: R`Write in simplest form: (a) \(\sqrt{\dfrac{3}{8}}\) &nbsp; (b) \(\dfrac{4}{\sqrt6}\).`,
                steps: [
                    R`(a) Step 1: \(\sqrt{\dfrac38} = \dfrac{\sqrt3}{\sqrt8}\).`,
                    R`Step 2: multiply top and bottom by \(\sqrt8\): \(\dfrac{\sqrt3\times\sqrt8}{\sqrt8\times\sqrt8} = \dfrac{\sqrt{24}}{8} = \dfrac{2\sqrt6}{8} = \dfrac{\sqrt6}{4}\).`,
                    R`(b) Multiply top and bottom by \(\sqrt6\): \(\dfrac{4\sqrt6}{6}\). Cancel the 2 outside the root: \(\dfrac{2\sqrt6}{3}\).`,
                ],
                answer: R`(a) \(\dfrac{\sqrt6}{4}\) &nbsp; (b) \(\dfrac{2\sqrt6}{3}\)`,
            },
            {
                title: 'Adding and subtracting',
                q: R`Simplify (a) \(\sqrt{12} + \sqrt{27} - \sqrt{48}\) &nbsp; (b) \(\sqrt{8} + 2\sqrt{3} + \sqrt{18} - \sqrt{27}\).`,
                steps: [
                    R`(a) Simplify first: \(\sqrt{12} = 2\sqrt3\), \(\sqrt{27} = 3\sqrt3\), \(\sqrt{48} = 4\sqrt3\). All the same kind: \((2+3-4)\sqrt3 = \sqrt3\).`,
                    R`(b) Simplify first: \(\sqrt8 = 2\sqrt2\), \(\sqrt{18} = 3\sqrt2\), \(\sqrt{27} = 3\sqrt3\).`,
                    R`Step 1, group: \((2\sqrt2 + 3\sqrt2) + (2\sqrt3 - 3\sqrt3)\).`,
                    R`Step 2, add the numbers in front: \(5\sqrt2 - \sqrt3\). The two kinds stay apart.`,
                ],
                answer: R`(a) \(\sqrt3\) &nbsp; (b) \(5\sqrt2 - \sqrt3\)`,
            },
            {
                title: 'Brackets and conjugates',
                q: R`Simplify (a) \((3+\sqrt5)(3-\sqrt5)\) &nbsp; (b) \((\sqrt3+\sqrt2)^2\) &nbsp; (c) \(\dfrac{4}{\sqrt5-1}\).`,
                steps: [
                    R`(a) Conjugates give a difference of squares: \(3^2 - (\sqrt5)^2 = 9 - 5 = 4\).`,
                    R`(b) \((\sqrt3)^2 + 2\times\sqrt3\times\sqrt2 + (\sqrt2)^2 = 3 + 2\sqrt6 + 2 = 5 + 2\sqrt6\).`,
                    R`(c) Multiply top and bottom by the conjugate \(\sqrt5+1\): the denominator becomes \(5 - 1 = 4\), so \(\dfrac{4(\sqrt5+1)}{4} = \sqrt5+1\).`,
                ],
                answer: R`(a) \(4\) &nbsp; (b) \(5+2\sqrt6\) &nbsp; (c) \(\sqrt5+1\)`,
            },
            {
                title: 'Comparing, and the decimal part',
                q: R`(a) Put \(4\), \(2\sqrt5\) and \(3\sqrt2\) in increasing order. (b) Let \(b\) be the decimal part of \(\sqrt{11}\). Find \(b^2 + 6b\).`,
                steps: [
                    R`(a) Square each: \(4^2 = 16\), \((2\sqrt5)^2 = 20\), \((3\sqrt2)^2 = 18\). So \(4 &lt; 3\sqrt2 &lt; 2\sqrt5\).`,
                    R`(b) \(9 &lt; 11 &lt; 16\), so the integer part of \(\sqrt{11}\) is 3 and \(b = \sqrt{11} - 3\).`,
                    R`\(b^2 + 6b = b(b+6) = (\sqrt{11}-3)(\sqrt{11}+3) = 11 - 9 = 2\).`,
                ],
                answer: R`(a) \(4 &lt; 3\sqrt2 &lt; 2\sqrt5\) &nbsp; (b) \(2\)`,
            },
        ],

        practice: [
            // ── Level 1 ──────────────────────────────────────────────────
            {
                id: 'simplify', name: 'Simplifying a square root', level: 1,
                gen(rng) {
                    const r = rng.pick([2, 2, 3, 3, 5, 6, 7, 10, 11, 13, 15]);
                    const type = rng.int(0, 3);
                    if (type === 3) {
                        const c = rng.int(2, 4), k = rng.int(2, 5), n = c * c * r;
                        return { q: R`Write \(${k}\sqrt{${n}}\) in simplest radical form.`, ans: CA.root(k, n), sol: R`Step 1: \(${n}=${c * c}\times${r}\). Step 2: \(\sqrt{${n}}=${T.root(c, r)}\), so \(${k}\sqrt{${n}}=${k}\times${T.root(c, r)}=${T.root(k * c, r)}\).` };
                    }
                    const c = rng.int(2, r > 7 ? 5 : 10), n = c * c * r;
                    const q = [R`Write \(\sqrt{${n}}\) in simplest radical form.`, R`Simplify \(\sqrt{${n}}\).`, R`Write \(\sqrt{${n}}\) in the form \(a\sqrt{b}\), where \(b\) is as small as possible.`][type];
                    return { q, ans: CA.rootOf(n), sol: R`Step 1: write ${n} with its biggest perfect-square factor, \(${n}=${c * c}\times${r}\). Step 2: \(\sqrt{${n}}=\sqrt{${c * c}}\times\sqrt{${r}}=${T.root(c, r)}\).` };
                },
            },
            {
                id: 'multiply-roots', name: 'Multiplying square roots', level: 1,
                gen(rng) {
                    if (rng.bool(0.65)) {
                        for (;;) {
                            const [a, b] = rng.sample([2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 18, 20, 21, 27, 32], 2);
                            const c = CA.simplifyRoot(a * b)[0];
                            if (a * b > 400 || c === 1) continue;
                            const dot = rng.bool() ? R`\times` : R`\cdot`;
                            return { q: R`Calculate \(\sqrt{${a}}${dot}\sqrt{${b}}\) and give the answer in simplest form.`, ans: rootAns(1, a * b), sol: R`\(\sqrt{${a}}${dot}\sqrt{${b}}=\sqrt{${a}\times${b}}=${steps(a * b)}\).` };
                        }
                    }
                    const a = nonSquare(rng, 2, 30), k = rng.int(2, 9), j = rng.int(2, 6), s = rng.pick(SQF);
                    const [e, v, sol] = rng.pick([
                        [R`\left(${k}\sqrt{${s}}\right)^2`, k * k * s, R`\(${k}\sqrt{${s}}\cdot${k}\sqrt{${s}}=${k}\times${k}\times\sqrt{${s}\times${s}}=${k * k}\times${s}=${k * k * s}\).`],
                        [R`\left(-${k}\sqrt{${s}}\right)^2`, k * k * s, R`\((-${k})^2\times(\sqrt{${s}})^2=${k * k}\times${s}=${k * k * s}\). The square is positive.`],
                        [R`${k}\sqrt{${s}}\cdot${j}\sqrt{${s}}`, k * j * s, R`\(${k}\times${j}\times\sqrt{${s}\times${s}}=${k * j}\times${s}=${k * j * s}\).`],
                        [R`\sqrt{${a}}\cdot\sqrt{${a}}`, a, R`\(\sqrt{${a}}\cdot\sqrt{${a}}=\sqrt{${a * a}}=${a}\).`],
                    ]);
                    return { q: R`Calculate \(${e}\).`, ans: CA.num(v), sol };
                },
            },
            {
                id: 'divide-roots', name: 'Dividing square roots', level: 1,
                gen(rng) {
                    const b = rng.pick([2, 3, 5, 6, 7]), q = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 18, 20, 25, 27, 32, 45, 50].filter(x => x !== b));
                    const a = b * q;
                    if (rng.bool(0.45)) {
                        const e = rng.bool() ? R`\dfrac{\sqrt{${a}}}{\sqrt{${b}}}` : R`\sqrt{${a}}\div\sqrt{${b}}`;
                        return { q: R`Calculate \(${e}\) and give the answer in simplest form.`, ans: rootAns(1, q), sol: R`\(\sqrt{\dfrac{${a}}{${b}}}=${steps(q)}\).` };
                    }
                    const n = rng.int(2, 5), k = rng.int(1, 6), mm = n * k;
                    const [c, r] = CA.simplifyRoot(q);
                    const tail = k === 1 ? (c === 1 ? '' : R`=${T.root(c, r)}`) : (c === 1 ? '' : R`=${k}\times${T.root(c, r)}=${T.root(k * c, r)}`);
                    return {
                        q: R`Calculate \(${mm}\sqrt{${a}}\div${n}\sqrt{${b}}\) and give the answer in simplest form.`,
                        ans: rootAns(k, q),
                        sol: R`Divide the numbers in front and the numbers under the radical: \(\dfrac{${mm}}{${n}}\sqrt{\dfrac{${a}}{${b}}}=${T.root(k, q)}${tail}\).`,
                    };
                },
            },
            {
                id: 'like-radicals', name: 'Adding and subtracting like radicals', level: 1,
                gen(rng) {
                    for (;;) {
                        const r = rng.pick(SQF), n = rng.pick([2, 2, 3]);
                        const cs = Array.from({ length: n }, (_, i) => rng.int(1, 12) * (i > 0 && rng.bool(0.45) ? -1 : 1));
                        const total = cs.reduce((a, b) => a + b, 0);
                        if (total < 1 || cs.every(c => Math.abs(c) === 1)) continue;
                        const e = lin(cs.map(c => [c, r]));
                        return {
                            q: R`Simplify \(${e.t}\).`,
                            ans: CA.root(total, r),
                            sol: R`Every term has ${r} under the radical, so add or subtract the numbers in front: \((${cs.map((c, i) => (i && c > 0 ? '+' : '') + c).join('')})\sqrt{${r}}=${T.root(total, r)}\).`,
                        };
                    }
                },
            },

            // ── Level 2 ──────────────────────────────────────────────────
            {
                id: 'multiply-coefficients', name: 'Multiplying radical expressions', level: 2,
                gen(rng) {
                    for (;;) {
                        if (rng.bool(0.3)) {
                            const [p, q, s] = rng.sample([2, 3, 5, 6, 10, 15, 14, 21, 35], 3), k = rng.pick([1, 1, 2, 3]);
                            const [c, r] = CA.simplifyRoot(p * q * s);
                            if (c === 1 || p * q * s > 1500) continue;
                            return {
                                q: R`Calculate \(${T.root(k, p)}\cdot\sqrt{${q}}\cdot\sqrt{${s}}\) and give the answer in simplest form.`,
                                ans: rootAns(k, p * q * s),
                                sol: R`\(${k === 1 ? '' : k}\sqrt{${p}\times${q}\times${s}}=${T.root(k, p * q * s)}\), and \(${steps(p * q * s)}\), so the answer is \(${T.root(k * c, r)}\).`,
                            };
                        }
                        const [p, q] = rng.sample([2, 3, 5, 6, 7, 8, 10, 12, 15, 18], 2), a = rng.int(1, 6), b = rng.int(1, 6);
                        const [c, r] = CA.simplifyRoot(p * q);
                        if ((a === 1 && b === 1) || (c === 1 && rng.bool(0.85))) continue;
                        return {
                            q: R`Calculate \(${T.root(a, p)}\cdot${T.root(b, q)}\) and give the answer in simplest form.`,
                            ans: rootAns(a * b, p * q),
                            sol: R`\(m\sqrt a\cdot n\sqrt b=mn\sqrt{ab}\): \(${a === 1 || b === 1 ? a * b : R`${a}\times${b}`}\sqrt{${p}\times${q}}=${T.root(a * b, p * q)}\)` + (c === 1 ? '.' : R`. Then \(${steps(p * q)}\), giving \(${a * b}\times${T.root(c, r)}=${T.root(a * b * c, r)}\).`),
                        };
                    }
                },
            },
            {
                id: 'divide-simplify', name: 'Simplifying quotients and fractions under the root', level: 2,
                gen(rng) {
                    for (;;) {
                        const type = rng.int(0, 4);
                        let e, correct, wrongs, sol;
                        if (type === 0 || type === 2) {
                            // √(p/q) or √p/√q with p, q coprime and q not a perfect square
                            const qq = rng.pick([2, 3, 5, 6, 7, 8, 10, 12, 18, 20, 24, 27]), p = rng.int(1, 11);
                            if (CA.gcd(p, qq) !== 1 || p === qq) continue;
                            e = type === 0 ? R`\sqrt{\dfrac{${p}}{${qq}}}` : R`\dfrac{\sqrt{${p}}}{\sqrt{${qq}}}`;
                            correct = fr(1, qq, p * qq);
                            wrongs = [fr(1, qq, p), fr(1, qq * qq, p * qq), fr(1, p, p * qq), fr(1, 1, p * qq)];
                            sol = (type === 0 ? R`Step 1: \(\sqrt{\dfrac{${p}}{${qq}}}=\dfrac{\sqrt{${p}}}{\sqrt{${qq}}}\). Step 2: ` : R`Multiply `) +
                                R`top and bottom by \(\sqrt{${qq}}\): \(\dfrac{\sqrt{${p}}\times\sqrt{${qq}}}{\sqrt{${qq}}\times\sqrt{${qq}}}=\dfrac{\sqrt{${p * qq}}}{${qq}}=${correct.t}\).`;
                        } else if (type === 1) {
                            // k/√b
                            const b = rng.pick([2, 3, 5, 6, 7, 8, 10, 12, 15, 18]), k = rng.int(1, 12);
                            e = R`\dfrac{${k}}{\sqrt{${b}}}`;
                            correct = fr(k, b, b);
                            wrongs = [fr(k, b * b, b), fr(1, k, b), fr(k, 1, b), plain(k, b)];
                            sol = R`Multiply top and bottom by \(\sqrt{${b}}\): \(\dfrac{${k}\sqrt{${b}}}{\sqrt{${b}}\times\sqrt{${b}}}=\dfrac{${T.root(k, b)}}{${b}}=${correct.t}\).`;
                        } else if (type === 3) {
                            // m√a ÷ n√b that does not come out whole
                            const [a, b] = rng.sample([2, 3, 5, 6, 7, 10], 2), mm = rng.int(1, 6), n = rng.int(2, 6);
                            if (a % b === 0 || mm === n) continue;
                            e = R`${T.root(mm, a)}\div${T.root(n, b)}`;
                            correct = fr(mm, n * b, a * b);
                            wrongs = [fr(mm, n, a * b), fr(n, mm * a, a * b), fr(mm, n * b * b, a * b), fr(mm * b, n, a * b)];
                            sol = R`\(\dfrac{${mm}}{${n}}\sqrt{\dfrac{${a}}{${b}}}=\dfrac{${mm}}{${n}}\times\dfrac{\sqrt{${a}}\times\sqrt{${b}}}{\sqrt{${b}}\times\sqrt{${b}}}=\dfrac{${mm}}{${n}}\times\dfrac{\sqrt{${a * b}}}{${b}}=${correct.t}\).`;
                        } else {
                            // a mixed number under the root
                            const g = rng.pick([2, 3, 5, 6, 7, 8]), f = rng.int(1, g - 1), w = rng.int(1, 3), top = w * g + f;
                            if (CA.gcd(f, g) !== 1 || CA.isSquare(top)) continue;
                            e = R`\sqrt{${w}\dfrac{${f}}{${g}}}`;
                            correct = fr(1, g, top * g);
                            wrongs = [fr(1, g, top), fr(1, g * g, top * g), fr(1, top, top * g), { t: R`${T.root(1, w)}+${fr(1, g, f * g).t}`, v: Math.sqrt(w) + Math.sqrt(f / g) }];
                            sol = R`First an improper fraction: \(${w}\dfrac{${f}}{${g}}=\dfrac{${top}}{${g}}\). Then \(\dfrac{\sqrt{${top}}}{\sqrt{${g}}}=\dfrac{\sqrt{${top}}\times\sqrt{${g}}}{${g}}=\dfrac{\sqrt{${top * g}}}{${g}}=${correct.t}\).`;
                        }
                        const ans = fracAns(rng, correct, wrongs);
                        if (!ans) continue;
                        return {
                            q: correct.d === 1 ? R`Write \(${e}\) in simplest form.` : R`Which of these is \(${e}\) in simplest form?`,
                            ans, sol,
                        };
                    }
                },
            },
            {
                id: 'combine-unlike', name: 'Simplify first, then add and subtract', level: 2,
                gen(rng) {
                    for (;;) {
                        const r = rng.pick([2, 3, 5, 6, 7]), n = rng.pick([2, 3, 3]);
                        const us = rng.sample(r >= 5 ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 7], n);
                        const terms = us.map((u, i) => ({ u, k: rng.pick([1, 1, 1, 2, 3]) * (i > 0 && rng.bool(0.45) ? -1 : 1) }));
                        const total = terms.reduce((s, t) => s + t.k * t.u, 0);
                        if (total < 1) continue;
                        const e = lin(terms.map(t => [t.k, r * t.u * t.u])), mid = lin(terms.map(t => [t.k * t.u, r]));
                        return {
                            q: R`Simplify \(${e.t}\). Give your answer in simplest radical form.`,
                            ans: CA.root(total, r),
                            sol: R`Simplify first: ${terms.filter(t => t.u > 1).map(t => m(R`\sqrt{${r * t.u * t.u}}=${T.root(t.u, r)}`)).join(', ')}. Now every term has \(\sqrt{${r}}\): \(${mid.t}=${T.root(total, r)}\).`,
                        };
                    }
                },
            },
            {
                id: 'group-terms', name: 'Grouping two kinds of radicals', level: 2,
                gen(rng) {
                    for (;;) {
                        const [r1, r2] = rng.sample([2, 3, 5, 6, 7], 2);
                        // four terms, two of each kind; each is k√(r·u²), worth k·u√r
                        const terms = [r1, r1, r2, r2].map((r, i) => ({ r, u: rng.pick([1, 1, 2, 3, 4]), k: rng.pick([1, 1, 2, 3]), s: i % 2 && rng.bool(0.6) ? -1 : 1 }));
                        if (!terms.some(t => t.u > 1) || terms.filter(t => t.u > 1).length > 3) continue;
                        const coef = r => terms.filter(t => t.r === r).reduce((s, t) => s + t.s * t.k * t.u, 0);
                        const A = coef(r1), B = coef(r2);
                        if (A === 0 || B === 0 || (A < 0 && B < 0)) continue;
                        const order = rng.shuffle(terms);
                        if (order[0].s < 0) continue;
                        const e = lin(order.map(t => [t.s * t.k, t.r * t.u * t.u]));
                        const pair = (a, b) => (a < 0 && b > 0 ? lin([[b, r2], [a, r1]]) : lin([[a, r1], [b, r2]]));
                        const correct = pair(A, B);
                        // real mistakes: no grouping at all, dropping the k when simplifying, a lost minus sign
                        const noK = r => terms.filter(t => t.r === r).reduce((s, t) => s + t.s * (t.u > 1 ? t.u : t.k), 0);
                        const flip = r => terms.filter(t => t.r === r).reduce((s, t) => s + t.k * t.u, 0);
                        const wrongs = [lin([[A + B, r1]]), lin([[A + B, r2]]), pair(noK(r1), noK(r2)), pair(flip(r1), B), pair(A, flip(r2)), pair(A, -B)];
                        const ans = mcv(rng, correct, wrongs.filter(w => w.v !== 0));
                        if (!ans) continue;
                        const simpd = terms.filter(t => t.u > 1).map(t => m(R`${T.root(t.k, t.r * t.u * t.u)}=${T.root(t.k * t.u, t.r)}`)).join(', ');
                        const grp = r => lin(terms.filter(t => t.r === r).map(t => [t.s * t.k * t.u, r])).t;
                        return {
                            q: R`Simplify \(${e.t}\). Which of these is the result?`,
                            ans,
                            sol: R`Simplify first: ${simpd}. Step 1, group: \((${grp(r1)})+(${grp(r2)})\). Step 2, add the numbers in front: \(${correct.t}\).`,
                        };
                    }
                },
            },
            {
                id: 'expand-conjugate', name: 'Brackets and conjugates', level: 2,
                gen(rng) {
                    for (;;) {
                        const type = rng.int(0, 5);
                        const b = rng.pick(SQF), a = rng.int(2, 9);
                        if (type === 0) return { q: R`Expand and simplify \(\left(${a}+\sqrt{${b}}\right)\left(${a}-\sqrt{${b}}\right)\).`, ans: CA.num(a * a - b), sol: R`Conjugates give a difference of squares: \(${a}^2-(\sqrt{${b}})^2=${a * a}-${b}=${a * a - b}\).` };
                        if (type === 1) {
                            const [x, y] = rng.sample([2, 3, 5, 6, 7, 10, 11, 13, 15, 17, 19], 2);
                            return { q: R`Expand and simplify \(\left(\sqrt{${x}}+\sqrt{${y}}\right)\left(\sqrt{${x}}-\sqrt{${y}}\right)\).`, ans: CA.num(x - y), sol: R`Difference of squares: \((\sqrt{${x}})^2-(\sqrt{${y}})^2=${x}-${y}=${x - y}\).` };
                        }
                        if (type === 2) {
                            const [x, y] = rng.sample([2, 3, 5, 6, 7], 2), p = rng.int(2, 5), q = rng.int(2, 5);
                            const v = p * p * x - q * q * y;
                            return { q: R`Expand and simplify \(\left(${p}\sqrt{${x}}+${q}\sqrt{${y}}\right)\left(${p}\sqrt{${x}}-${q}\sqrt{${y}}\right)\).`, ans: CA.num(v), sol: R`Difference of squares: \((${p}\sqrt{${x}})^2-(${q}\sqrt{${y}})^2=${p * p * x}-${q * q * y}=${v}\).` };
                        }
                        if (type === 3) return { q: R`Simplify \(\left(${a}+\sqrt{${b}}\right)^2+\left(${a}-\sqrt{${b}}\right)^2\).`, ans: CA.num(2 * (a * a + b)), sol: R`\((${a}+\sqrt{${b}})^2=${a * a + b}+${2 * a}\sqrt{${b}}\) and \((${a}-\sqrt{${b}})^2=${a * a + b}-${2 * a}\sqrt{${b}}\). The root terms cancel: \(2\times${a * a + b}=${2 * (a * a + b)}\).` };
                        let e, correct, wrongs, sol;
                        if (type === 4) {
                            const [x, y] = rng.sample(PRIMES, 2), s = rng.pick([1, -1]), sg = s > 0 ? '+' : '-';
                            e = R`\left(\sqrt{${x}}${sg}\sqrt{${y}}\right)^2`;
                            correct = lin([[x + y, 1], [2 * s, x * y]]);
                            wrongs = [plain(x + y), lin([[x + y, 1], [s, x * y]]), lin([[x * x + y * y, 1], [2 * s, x * y]]), lin([[x + y, 1], [-2 * s, x * y]]), plain(Math.abs(x - y))];
                            sol = R`\((\sqrt{${x}})^2${sg}2\sqrt{${x}}\sqrt{${y}}+(\sqrt{${y}})^2=${x}${sg}2\sqrt{${x * y}}+${y}=${correct.t}\). Do not forget the middle term.`;
                        } else {
                            const p = rng.int(1, 6), s = rng.pick([1, -1]), sg = s > 0 ? '+' : '-', bb = rng.pick([2, 3, 5, 6, 7]);
                            e = R`\left(${p}${sg}\sqrt{${bb}}\right)^2`;
                            correct = lin([[p * p + bb, 1], [2 * p * s, bb]]);
                            wrongs = [plain(p * p + bb), lin([[p * p + bb * bb, 1], [2 * p * s, bb]]), lin([[p * p + bb, 1], [p * s, bb]]), lin([[p * p + bb, 1], [2 * s, bb]]), lin([[p * p - bb, 1], [2 * p * s, bb]])];
                            sol = R`\(${p}^2${sg}2\times${p}\times\sqrt{${bb}}+(\sqrt{${bb}})^2=${p * p}${sg}${T.root(2 * p, bb)}+${bb}=${correct.t}\).`;
                        }
                        const ans = mcv(rng, correct, wrongs);
                        if (!ans) continue;
                        return { q: R`Expand and simplify \(${e}\). Which of these is the result?`, ans, sol };
                    }
                },
            },
            {
                id: 'geometry', name: 'Diagonals, areas and perimeters', level: 2,
                gen(rng) {
                    const type = rng.int(0, 7);
                    if (type === 0) {
                        const s = rng.int(2, 15);
                        return { q: `A square has sides of ${s} cm. Find the length of its diagonal in simplest radical form.`, fig: rectFig(1, 1, { w: `${s}`, h: `${s}`, d: '?' }), ans: CA.root(s, 2, 'cm'), sol: R`\(d^2=${s}^2+${s}^2=${2 * s * s}\), so \(d=\sqrt{${2 * s * s}}=${T.root(s, 2)}\) cm.` };
                    }
                    if (type === 1) {
                        const h = rng.int(2, 12), d = 2 * h;
                        if (rng.bool()) return { q: `The diagonal of a square is ${d} cm long. Find the length of a side in simplest radical form.`, fig: rectFig(1, 1, { w: '?', d: `${d}` }), ans: CA.root(h, 2, 'cm'), sol: R`\(s^2+s^2=${d}^2\), so \(s^2=${d * d / 2}\) and \(s=\sqrt{${d * d / 2}}=${T.root(h, 2)}\) cm.` };
                        return { q: `The diagonal of a square is ${d} cm long. What is the area of the square?`, fig: rectFig(1, 1, { d: `${d}` }), ans: CA.num(d * d / 2, 'cm²'), sol: R`\(s^2+s^2=${d}^2=${d * d}\), and the area is \(s^2=${d * d}\div2=${d * d / 2}\) cm².` };
                    }
                    if (type === 2) {
                        for (;;) {
                            const a = rng.int(1, 9), b = rng.int(a + 1, Math.min(14, 3 * a));
                            const [c, r] = CA.simplifyRoot(a * a + b * b);
                            if (c === 1 || r === 1) continue;
                            return { q: `A rectangle is ${b} cm long and ${a} cm wide. Find the length of its diagonal in simplest radical form.`, fig: rectFig(b, a, { w: `${b}`, h: `${a}`, d: '?' }), ans: CA.rootOf(a * a + b * b, 'cm'), sol: R`\(d^2=${b}^2+${a}^2=${a * a + b * b}\), so \(d=\sqrt{${a * a + b * b}}=\sqrt{${c * c}\times${r}}=${T.root(c, r)}\) cm.` };
                        }
                    }
                    if (type === 3) {
                        for (;;) {
                            const [a, b] = rng.sample([2, 3, 5, 6, 10], 2), p = rng.int(1, 4), q = rng.int(1, 4);
                            const w = p * Math.sqrt(a), h = q * Math.sqrt(b);
                            if (w < h || w > 3 * h) continue;
                            return { q: R`A rectangle has sides \(${T.root(p, a)}\) cm and \(${T.root(q, b)}\) cm. Find its area in simplest radical form.`, fig: rectFig(w, h, { w: uroot(p, a), h: uroot(q, b) }), ans: CA.root(p * q, a * b, 'cm²'), sol: R`\(${T.root(p, a)}\times${T.root(q, b)}=${T.root(p * q, a * b)}` + (CA.simplifyRoot(a * b)[0] > 1 ? R`=${simp(a * b, p * q)}\) cm².` : R`\) cm².`) };
                        }
                    }
                    if (type === 4) {
                        const r = rng.pick([2, 3, 5]), [v, u] = rng.sample([1, 2, 3, 4, 5], 2).sort((x, y) => x - y);
                        const A = r * u * u, B = r * v * v;
                        return { q: R`A rectangle has sides \(\sqrt{${A}}\) cm and \(\sqrt{${B}}\) cm. Find its perimeter in simplest radical form.`, fig: rectFig(u, v, { w: `√${A}`, h: `√${B}` }), ans: CA.root(2 * (u + v), r, 'cm'), sol: R`Simplify first: \(\sqrt{${A}}=${T.root(u, r)}\) and \(\sqrt{${B}}=${T.root(v, r)}\). Perimeter \(=2\times(${T.root(u, r)}+${T.root(v, r)})=2\times${T.root(u + v, r)}=${T.root(2 * (u + v), r)}\) cm.` };
                    }
                    if (type === 5) {
                        const k = rng.int(1, 9), wantH = rng.bool();
                        return wantH
                            ? { q: `An equilateral triangle has sides of ${2 * k} cm. Find its height in simplest radical form.`, fig: equiFig(`${2 * k}`, '?'), ans: CA.root(k, 3, 'cm'), sol: R`The height splits the base into two pieces of ${k} cm. \(h^2=${2 * k}^2-${k}^2=${3 * k * k}\), so \(h=\sqrt{${3 * k * k}}=${T.root(k, 3)}\) cm.` }
                            : { q: `An equilateral triangle has sides of ${2 * k} cm. Find its area in simplest radical form.`, fig: equiFig(`${2 * k}`, 'h'), ans: CA.root(k * k, 3, 'cm²'), sol: R`Height: \(h^2=${2 * k}^2-${k}^2=${3 * k * k}\), so \(h=${T.root(k, 3)}\) cm. Area \(=\frac12\times${2 * k}\times${T.root(k, 3)}=${T.root(k * k, 3)}\) cm².` };
                    }
                    if (type === 6) {
                        for (;;) {
                            const a = nonSquare(rng, 2, 30), b = nonSquare(rng, a + 1, 40);
                            const [c, r] = CA.simplifyRoot(a + b);
                            if (c === 1 || b > 5 * a) continue;
                            return { q: R`The legs of a right triangle are \(\sqrt{${a}}\) cm and \(\sqrt{${b}}\) cm long. Find the length of the hypotenuse in simplest form.`, fig: F.rightTriangle(Math.sqrt(a), Math.sqrt(b), { a: `√${a}`, b: `√${b}`, c: '?' }, { max: 110 }), ans: CA.rootOf(a + b, 'cm'), sol: R`\(c^2=(\sqrt{${a}})^2+(\sqrt{${b}})^2=${a}+${b}=${a + b}\), so \(c=${steps(a + b)}\) cm.` };
                        }
                    }
                    const p = rng.int(2, 6), r = rng.pick([2, 3, 5, 6, 7]);
                    return { q: R`A square has sides of \(${T.root(p, r)}\) cm. What is its area?`, fig: rectFig(1, 1, { w: uroot(p, r), h: uroot(p, r) }), ans: CA.num(p * p * r, 'cm²'), sol: R`\((${T.root(p, r)})^2=${p * p}\times${r}=${p * p * r}\) cm².` };
                },
            },

            // ── Level 3 ──────────────────────────────────────────────────
            {
                id: 'mixed-operations', name: 'Multiply, divide, then add', level: 3,
                gen(rng) {
                    for (;;) {
                        const r = rng.pick([2, 3, 5, 6, 7]);
                        const kinds = rng.sample([0, 1, 2, 3], 3);
                        const parts = kinds.map((kind, i) => {
                            const sign = i > 0 && rng.bool(0.5) ? -1 : 1;
                            if (kind === 0) { const k = rng.pick([1, 1, 2, 3]), q = rng.int(2, 5); return { sign, e: T.root(k, r * q * q), c: k * q }; }
                            if (kind === 1) { const j = rng.int(1, 6); return { sign, e: R`\dfrac{${j * r}}{\sqrt{${r}}}`, c: j }; }
                            if (kind === 2) { const a = rng.pick([2, 3, 5, 7].filter(x => x !== r)); return { sign, e: R`\sqrt{${r * a}}\times\sqrt{${a}}`, c: a }; }
                            const d = rng.pick([2, 3, 5]), q = rng.int(2, 4); return { sign, e: R`\dfrac{\sqrt{${r * d * q * q}}}{\sqrt{${d}}}`, c: q };
                        });
                        const total = parts.reduce((s, p) => s + p.sign * p.c, 0);
                        if (total < 1) continue;
                        const e = parts.map((p, i) => (i ? (p.sign > 0 ? '+' : '-') : '') + p.e).join('');
                        return {
                            q: R`Simplify \(${e}\). Give your answer in simplest radical form.`,
                            ans: CA.root(total, r),
                            sol: R`Turn each part into a multiple of \(\sqrt{${r}}\): ${parts.map(p => m(R`${p.e}=${T.root(p.c, r)}`)).join(', ')}. Then add the numbers in front: \(${lin(parts.map(p => [p.sign * p.c, r])).t}=${T.root(total, r)}\).`,
                        };
                    }
                },
            },
            {
                id: 'fraction-sums', name: 'Adding radicals with fractions', level: 3,
                gen(rng) {
                    for (;;) {
                        const r = rng.pick([2, 3, 5, 6, 7]);
                        // each term is worth (n/d)·√r; `naive` is what a student gets by ignoring the denominator
                        const make = kind => {
                            if (kind === 0) { const k = rng.pick([1, 1, 2, 3]), u = rng.int(2, 4); return { e: T.root(k, r * u * u), f: [k * u, 1], naive: [k * u, 1], how: R`${T.root(k, r * u * u)}=${T.root(k * u, r)}` }; }
                            if (kind === 1) return { e: R`\sqrt{\dfrac{1}{${r}}}`, f: [1, r], naive: [1, 1], how: R`\sqrt{\dfrac{1}{${r}}}=\dfrac{\sqrt{${r}}}{${r}}` };
                            if (kind === 2) { const k = rng.pick([1, 2, 3, 4, 5, 6].filter(x => x % r)); return { e: R`\dfrac{${k}}{\sqrt{${r}}}`, f: CA.reduce(k, r), naive: [k, 1], how: R`\dfrac{${k}}{\sqrt{${r}}}=${fr(k, r, r).t}` }; }
                            if (kind === 3) { const u = rng.pick([2, 3].filter(x => x % r)); return { e: R`\sqrt{\dfrac{${u * u}}{${r}}}`, f: CA.reduce(u, r), naive: [u, 1], how: R`\sqrt{\dfrac{${u * u}}{${r}}}=\dfrac{${u}}{\sqrt{${r}}}=${fr(u, r, r).t}` }; }
                            const u = rng.int(2, 4); return { e: R`\sqrt{\dfrac{${r}}{${u * u}}}`, f: [1, u], naive: [1, 1], how: R`\sqrt{\dfrac{${r}}{${u * u}}}=\dfrac{\sqrt{${r}}}{${u}}` };
                        };
                        const kinds = [0, rng.pick([1, 2, 3, 4])];
                        if (rng.bool(0.5)) kinds.push(rng.pick([0, 1, 2, 3, 4]));
                        const parts = rng.shuffle(kinds.map(make)).map((p, i) => ({ ...p, s: i > 0 && rng.bool(0.5) ? -1 : 1 }));
                        if (new Set(parts.map(p => p.e)).size < parts.length) continue;
                        const sum = key => parts.reduce((acc, p) => fadd(acc, [p.s * p[key][0], p[key][1]]), [0, 1]);
                        const [N, D] = sum('f');
                        if (N <= 0 || D === 1) continue;
                        const [nN, nD] = sum('naive');
                        const last = parts[parts.length - 1];
                        const [fN, fD] = fadd([N, D], [-2 * last.s * last.f[0], last.f[1]]);
                        const correct = fr(N, D, r);
                        const ans = mcv(rng, correct, [fr(nN, nD, r), fr(fN, fD, r), plain(N, D), fr(N, D * r, r)].filter(w => w.v !== 0));
                        if (!ans) continue;
                        const e = parts.map((p, i) => (i ? (p.s > 0 ? '+' : '-') : '') + p.e).join('');
                        const mid = parts.map((p, i) => (i ? (p.s > 0 ? '+' : '-') : '') + fr(p.f[0], p.f[1], r).t).join('');
                        return {
                            q: R`Simplify \(${e}\). Which of these is the result?`,
                            ans,
                            sol: R`Simplify each term first: ${parts.map(p => m(p.how)).join(', ')}. All are multiples of \(\sqrt{${r}}\), so add the numbers in front: \(${mid}=${correct.t}\).`,
                        };
                    }
                },
            },
            {
                id: 'conjugate-rationalise', name: 'Rationalising with a conjugate', level: 3,
                gen(rng) {
                    for (;;) {
                        const form = rng.int(0, 2), s = rng.pick([1, -1]), t = rng.int(1, 4);
                        const sg = s > 0 ? '+' : '-', og = s > 0 ? '-' : '+';
                        let den, conj, D, correct, wrongs;
                        if (form === 0) {
                            const [b, a] = rng.sample(SQF, 2).sort((x, y) => x - y);
                            D = a - b;
                            den = R`\sqrt{${a}}${sg}\sqrt{${b}}`; conj = R`\sqrt{${a}}${og}\sqrt{${b}}`;
                            const k = D * t;
                            correct = lin([[t, a], [-s * t, b]]);
                            wrongs = [lin([[t, a], [s * t, b]]), s > 0 ? lin([[t, b], [-t, a]]) : lin([[k, a], [k, b]]), lin([[k, a], [-s * k, b]]), plain(t), { t: simp(D, t), v: t * Math.sqrt(D) }, lin([[2 * t, a], [-s * 2 * t, b]])];
                        } else if (form === 1) {
                            const a = rng.pick(SQF), c = rng.int(1, isqrt(a));
                            D = a - c * c;
                            den = R`\sqrt{${a}}${sg}${c}`; conj = R`\sqrt{${a}}${og}${c}`;
                            const k = D * t;
                            correct = lin([[t, a], [-s * t * c, 1]]);
                            wrongs = [lin([[t, a], [s * t * c, 1]]), lin([[k, a], [-s * k * c, 1]]), lin([[t, a], [-s * t, 1]]), lin([[t, a], [-s * t * c * c, 1]]), plain(t), lin([[2 * t, a], [-s * 2 * t * c, 1]])];
                        } else {
                            const a = rng.pick(SQF), c = isqrt(a) + rng.int(1, 2);
                            D = c * c - a;
                            den = R`${c}${sg}\sqrt{${a}}`; conj = R`${c}${og}\sqrt{${a}}`;
                            const k = D * t;
                            correct = lin([[t * c, 1], [-s * t, a]]);
                            wrongs = [lin([[t * c, 1], [s * t, a]]), lin([[k * c, 1], [-s * k, a]]), lin([[t, 1], [-s * t, a]]), lin([[t * c * c, 1], [-s * t, a]]), plain(t), lin([[2 * t * c, 1], [-s * 2 * t, a]])];
                        }
                        if (D > 12) continue;
                        const k = D * t;
                        const ans = mcv(rng, correct, wrongs);
                        if (!ans) continue;
                        return {
                            q: R`Rationalise the denominator of \(\dfrac{${k}}{${den}}\). Which of these is it equal to?`,
                            ans,
                            sol: R`Multiply top and bottom by the conjugate \(${conj}\). The denominator becomes a difference of squares equal to \(${D}\), so the fraction is \(\dfrac{${k}\left(${conj}\right)}{${D}}=${correct.t}\).`,
                        };
                    }
                },
            },
            {
                id: 'integer-decimal-part', name: 'Comparing; integer part and decimal part', level: 3,
                gen(rng) {
                    const type = rng.int(0, 5);
                    if (type === 5) {
                        const rad = () => { const c = rng.int(2, 7), r = rng.pick([2, 3, 5, 6, 7, 10, 11]); return { t: T.root(c, r), s: c * c * r, why: R`(${T.root(c, r)})^2=${c * c * r}` }; };
                        const int = () => { const k = rng.int(3, 16); return { t: `${k}`, s: k * k, why: `${k}^2=${k * k}` }; };
                        for (;;) {
                            const items = rng.shuffle([rad(), rad(), rng.bool(0.6) ? int() : rad()]);
                            const sorted = items.slice().sort((p, q) => p.s - q.s);
                            if (sorted[0].s === sorted[1].s || sorted[1].s === sorted[2].s || sorted[2].s - sorted[0].s > 24) continue;
                            if (new Set(items.map(i => i.t)).size < 3) continue;
                            const which = rng.pick(['greatest', 'least']);
                            const target = which === 'greatest' ? sorted[2] : sorted[0];
                            return {
                                q: R`Which of \(${items[0].t}\), \(${items[1].t}\) and \(${items[2].t}\) is the <strong>${which}</strong>?`,
                                ans: CA.mc(rng, m(target.t), items.map(i => m(i.t)), { keepOrder: true }),
                                sol: R`Compare squares: ${items.map(i => m(i.why)).join(', ')}. So \(${sorted.map(i => i.t).join('&lt;')}\), and the ${which} is \(${target.t}\).`,
                            };
                        }
                    }
                    const n = nonSquare(rng, 3, 99), a = isqrt(n);
                    const trap = R`\(${a}^2=${a * a}&lt;${n}&lt;${(a + 1) ** 2}=${a + 1}^2\), so the integer part of \(\sqrt{${n}}\) is ${a}`;
                    if (type === 0) {
                        const ans = mcv(rng, { t: R`\sqrt{${n}}-${a}`, v: Math.sqrt(n) - a }, [
                            { t: R`\sqrt{${n}}-${a + 1}`, v: Math.sqrt(n) - a - 1 }, { t: R`${a + 1}-\sqrt{${n}}`, v: a + 1 - Math.sqrt(n) },
                            { t: R`\sqrt{${n - a * a}}`, v: Math.sqrt(n - a * a) }, { t: R`\dfrac{\sqrt{${n}}}{${a + 1}}`, v: Math.sqrt(n) / (a + 1) }]);
                        return { q: R`Which expression is exactly equal to the <strong>decimal part</strong> of \(\sqrt{${n}}\)?`, ans, sol: trap + R`. Decimal part = number − integer part \(=\sqrt{${n}}-${a}\).` };
                    }
                    if (type === 1) return { q: R`Let \(b\) be the decimal part of \(\sqrt{${n}}\). Find the exact value of \(b^2+${2 * a}b\).`, ans: CA.num(n - a * a), sol: trap + R` and \(b=\sqrt{${n}}-${a}\). Then \(b^2+${2 * a}b=b(b+${2 * a})=(\sqrt{${n}}-${a})(\sqrt{${n}}+${a})=${n}-${a * a}=${n - a * a}\).` };
                    if (type === 2) return { q: R`Let \(a\) be the integer part and \(b\) the decimal part of \(\sqrt{${n}}\). Find the exact value of \(b\left(\sqrt{${n}}+a\right)\).`, ans: CA.num(n - a * a), sol: trap + R`: \(a=${a}\) and \(b=\sqrt{${n}}-${a}\). So \(b(\sqrt{${n}}+a)=(\sqrt{${n}}-${a})(\sqrt{${n}}+${a})=${n}-${a * a}=${n - a * a}\).` };
                    if (type === 3) {
                        const K = a + rng.int(2, 9);
                        return { q: R`What is the integer part of \(${K}-\sqrt{${n}}\)?`, ans: CA.num(K - a - 1), sol: trap + R`: \(${a}&lt;\sqrt{${n}}&lt;${a + 1}\). Subtracting from ${K} flips the order: \(${K - a - 1}&lt;${K}-\sqrt{${n}}&lt;${K - a}\). The integer part is ${K - a - 1} (not ${K - a}).` };
                    }
                    const c = rng.int(2, 7), r = rng.pick([2, 3, 5, 6, 7, 10]), N = c * c * r, f = isqrt(N);
                    return { q: R`What is the integer part of \(${T.root(c, r)}\)?`, ans: CA.num(f), sol: R`Push the ${c} under the root: \(${T.root(c, r)}=\sqrt{${c * c}\times${r}}=\sqrt{${N}}\). \(${f}^2=${f * f}&lt;${N}&lt;${(f + 1) ** 2}=${f + 1}^2\), so the integer part is ${f}.` };
                },
            },
        ],

        assignment: [
            ['simplify', 4], ['multiply-roots', 4], ['divide-roots', 4], ['like-radicals', 3],
            ['multiply-coefficients', 4], ['divide-simplify', 5], ['combine-unlike', 4], ['group-terms', 4], ['expand-conjugate', 3], ['geometry', 3],
            ['mixed-operations', 3], ['fraction-sums', 3], ['conjugate-rationalise', 3], ['integer-decimal-part', 3],
        ],
    });
})();
