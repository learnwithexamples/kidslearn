"""LearnCamp Class 1 — Python review: input, output, conditions and loops."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools'))
from fractions import Fraction  # noqa: E402

from lc import Problem, lines, ints  # noqa: E402

CLASS = dict(
    id=1,
    title='Python Review: Input, Output, Conditions & Loops',
    blurb='Read any kind of input, make decisions, repeat with loops and print answers in exactly the right format.',
    summary='''
<p>This class is a fast, thorough review of the Python you need for everything that follows. The focus is on
<strong>input and output</strong>, because a contest-style problem is only solved when your program reads the
input exactly as given and prints exactly what is asked.</p>
<ul>
    <li>Reading one number, several numbers on a line, and many lines.</li>
    <li>Reading until a stop value (like <code>0 0</code>) or until the input runs out.</li>
    <li>Printing with <code>sep</code>, <code>end</code> and f-strings, including lining numbers up in columns.</li>
    <li><code>if</code> / <code>elif</code> / <code>else</code>, <code>for</code> and <code>while</code> loops, counting and adding up.</li>
</ul>''',
    tutorial=[
        dict(h='How a judged problem works', html='''
<p>Every problem gives you some <strong>input</strong> and asks for some <strong>output</strong>. Your program
reads the input with <code>input()</code> and writes the answer with <code>print()</code>. A judge then feeds
your program many test inputs and compares what you print with the correct answer, character by character.</p>
<div class="lc-key"><strong>Golden rule:</strong> print <em>only</em> what the problem asks for. No
"Enter a number:" prompts, no "The answer is". Spaces at the end of a line and blank lines at the very end
are ignored, but everything else must match.</div>
<pre class="try" data-input="7">n = int(input())        # input() gives text; int() turns it into a number
print(n * n)</pre>'''),
        dict(h='Reading numbers on one line', html='''
<p><code>input()</code> returns the whole line as one string. <code>.split()</code> cuts it at the spaces, and
<code>map(int, …)</code> turns every piece into an integer.</p>
<pre class="try" data-input="3 8">a, b = map(int, input().split())
print(a + b)
print(a * b)</pre>
<p>When you don't know how many numbers are on the line, make a list instead:</p>
<pre class="try" data-input="4 9 1 7 3">nums = list(map(int, input().split()))
print(len(nums), sum(nums), max(nums))</pre>
<div class="lc-tip">A first line often tells you how many numbers follow:
<code>n = int(input())</code>, then <code>nums = list(map(int, input().split()))</code>.</div>'''),
        dict(h='Many lines of input', html='''
<p><strong>A known number of lines.</strong> Loop exactly that many times:</p>
<pre class="try" data-input="3\\n1 2\\n10 20\\n7 8">t = int(input())
for _ in range(t):
    a, b = map(int, input().split())
    print(a + b)</pre>
<p><strong>A stop value.</strong> Keep reading until the special line arrives, then stop:</p>
<pre class="try" data-input="1 5\\n10 20\\n0 0">while True:
    a, b = map(int, input().split())
    if a == 0 and b == 0:
        break
    print(a + b)</pre>
<p><strong>Until the input runs out (end of file).</strong> Loop over <code>sys.stdin</code>; the loop ends
by itself when there are no more lines:</p>
<pre class="try" data-input="1 5\\n10 20\\n3 4">import sys
for line in sys.stdin:
    if not line.strip():      # skip empty lines
        continue
    a, b = map(int, line.split())
    print(a + b)</pre>
<div class="lc-tip">Another way to read everything at once: <code>data = sys.stdin.read().split()</code> gives one
list of every word in the input, which you can walk through with an index.</div>'''),
        dict(h='Printing exactly right', html='''
<table>
<tr><th>You want</th><th>Write</th><th>Prints</th></tr>
<tr><td>items separated by commas</td><td><code>print(1, 2, 3, sep=',')</code></td><td><code>1,2,3</code></td></tr>
<tr><td>stay on the same line</td><td><code>print('a', end='')</code></td><td><code>a</code> (no newline)</td></tr>
<tr><td>a list with spaces</td><td><code>print(*nums)</code></td><td><code>4 9 1</code></td></tr>
<tr><td>2 decimal places</td><td><code>print(f'{x:.2f}')</code></td><td><code>3.14</code></td></tr>
<tr><td>right-aligned in width 4</td><td><code>print(f'{n:4d}')</code></td><td><code>&nbsp;&nbsp;42</code></td></tr>
<tr><td>left-aligned in width 4</td><td><code>print(f'{n:<4d}')</code></td><td><code>42&nbsp;&nbsp;</code></td></tr>
<tr><td>zero-padded to 3 digits</td><td><code>print(f'{n:03d}')</code></td><td><code>042</code></td></tr>
</table>
<pre class="try">for i in range(1, 4):
    for j in range(1, 4):
        print(f'{i * j:4d}', end='')
    print()           # finish the row</pre>'''),
        dict(h='Decisions: if, elif, else', html='''
<p>Conditions use <code>==  !=  &lt;  &lt;=  &gt;  &gt;=</code>, joined with <code>and</code>, <code>or</code>,
<code>not</code>. Only the <em>first</em> true branch runs.</p>
<pre class="try" data-input="2024">year = int(input())
if year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):
    print('leap year')
else:
    print('common year')</pre>
<div class="lc-warn"><code>=</code> stores a value, <code>==</code> compares. And remember that
<code>input()</code> is text: <code>'5' == 5</code> is <code>False</code> until you convert it.</div>'''),
        dict(h='Loops: counting, adding, digits', html='''
<p>Most loop problems use one of a few patterns: a <strong>counter</strong>, a <strong>running total</strong>,
a <strong>best so far</strong>, or taking a number <strong>apart digit by digit</strong>.</p>
<pre class="try" data-input="2024">n = int(input())
total, count = 0, 0
while n > 0:
    total += n % 10      # last digit
    count += 1
    n //= 10             # drop the last digit
print(count, total)</pre>
<p>Strings make digit work even easier: <code>str(n)</code> is a string you can loop over, and
<code>str(n).count('1')</code> counts the 1s.</p>
<pre class="try">count = 0
for k in range(1, 12):
    count += str(k).count('1')
print(count)    # the digit 1 appears 4 times in 1..11</pre>
<div class="lc-tip">To test whether <code>d</code> divides <code>n</code>, check <code>n % d == 0</code>. Divisors come in
pairs (<code>d</code> and <code>n // d</code>), so you only need to try <code>d</code> while
<code>d * d &lt;= n</code> — that makes prime tests on big numbers fast.</div>'''),
        dict(h='Best so far, averages and rounding', html='''
<p>To find the largest value as the numbers go by, keep a <strong>best so far</strong>. Start it from the
<em>first</em> value (not from 0 — what if every number is negative?), then compare each new value with it.</p>
<pre class="try" data-input="6\\n-3 -8 -1 -9 -1 -4">n = int(input())
nums = list(map(int, input().split()))
best = nums[0]
where = 1
for i in range(1, n):
    if nums[i] > best:        # &gt; keeps the FIRST position on a tie; &gt;= would keep the last
        best = nums[i]
        where = i + 1
print(best, where)</pre>
<p>An average is a total divided by a count. <code>/</code> always gives a float, so print it with a fixed number
of decimals using an f-string:</p>
<pre class="try" data-input="90 85 77">a, b, c = map(int, input().split())
avg = (a + b + c) / 3
print(avg)              # 84.0 — not what a problem usually wants
print(f'{avg:.2f}')     # 84.00 — exactly 2 decimal places</pre>
<div class="lc-warn">Check the count before you divide: if there are no numbers, <code>total / 0</code> crashes.
And use <code>//</code> (whole-number division) and <code>%</code> (remainder) for things like turning seconds into
minutes: <code>3725 // 60</code> is <code>62</code>, <code>3725 % 60</code> is <code>5</code>.</div>'''),
        dict(h='Nested loops and patterns', html='''
<p>A shape made of characters is printed <strong>row by row</strong>. For each row, work out how many spaces
and how many stars it needs — usually a simple formula in the row number. String multiplication helps:
<code>'*' * 5</code> is <code>*****</code>.</p>
<pre class="try" data-input="4">n = int(input())
for i in range(1, n + 1):
    print(' ' * (n - i) + '*' * (2 * i - 1))</pre>
<p>Write the first few rows on paper in a small table — row number, spaces, stars — and the pattern jumps out.
For a grid (like a multiplication table) the outer loop picks the row and the inner loop walks along it:</p>
<pre class="try" data-input="3">n = int(input())
for i in range(1, n + 1):
    row = []
    for j in range(1, n + 1):
        row.append(str(i * j))
    print(' '.join(row))</pre>
<div class="lc-tip">Spaces at the <em>start</em> of a line count, spaces at the end don't. So a shape only needs
its left padding right; you never have to pad the right-hand side.</div>'''),
    ],
)

# ── Problems ─────────────────────────────────────────────────────────────


def _no_half(vals):
    """True if the average of vals, times 100, does not end in exactly .5 —
    so '2 decimal places' can never be a rounding tie."""
    return Fraction(100 * sum(vals), len(vals)).denominator != 2


def _scores_until_minus_one(r):
    while True:
        vals = [r.randint(0, 100) for _ in range(r.randint(1, 60))]
        if _no_half(vals):
            return lines(*vals, -1)


PROBLEMS = [
    # ── Level 1: warm-up ────────────────────────────────────────────────
    Problem(
        slug='a-plus-b', title='A + B', level=1,
        statement='<p>Read two integers and print their sum.</p>',
        input='<p>One line with two integers <code>a</code> and <code>b</code>, separated by a space.</p>',
        output='<p>One integer: <code>a + b</code>.</p>',
        constraints='<p>0 ≤ a, b ≤ 1000</p>',
        examples=[('1 2\n', '3\n'), ('10 20\n', '30\n')],
        hint='<p>Read both numbers from one line with <code>a, b = map(int, input().split())</code>.</p>',
        solution='a, b = map(int, input().split())\nprint(a + b)\n',
        tests=lambda r: ['0 0', '1000 1000', '0 1000', '999 1'] + [f'{r.randint(0, 1000)} {r.randint(0, 1000)}' for _ in range(6)],
    ),
    Problem(
        slug='rectangle-area-perimeter', title='Rectangle Area and Perimeter', level=1,
        statement='<p>A rectangle is <code>w</code> units wide and <code>h</code> units high. Print its area and its perimeter (the distance all the way around it).</p>',
        input='<p>One line with two integers <code>w</code> and <code>h</code>.</p>',
        output='<p>One line with two integers separated by a space: the area, then the perimeter.</p>',
        constraints='<p>1 ≤ w, h ≤ 10 000</p>',
        examples=[('3 5\n', '15 16\n'), ('7 7\n', '49 28\n')],
        hint='<p>Area is width × height; the perimeter adds up all four sides. <code>print(x, y)</code> puts one space between two values.</p>',
        solution='w, h = map(int, input().split())\nprint(w * h, 2 * (w + h))\n',
        tests=lambda r: ['1 1', '10000 10000', '1 10000', '10000 1'] + [f'{r.randint(1, 10000)} {r.randint(1, 10000)}' for _ in range(6)],
    ),
    Problem(
        slug='a-plus-b-many-lines', title='A + B, Line After Line', level=1,
        statement='<p>The input has several lines, and each line holds a pair of integers. For every line, print the sum of its pair.</p>',
        input='<p>Several lines, each with two integers <code>A</code> and <code>B</code>. You are not told how many lines there are: keep reading until the input ends.</p>',
        output='<p>One line per input line: <code>A + B</code>.</p>',
        constraints='<p>All numbers fit in an ordinary integer; at most 100 lines.</p>',
        examples=[('1 5\n10 20\n', '6\n30\n')],
        hint='<p>Loop over the input until it runs out: <code>import sys</code>, then <code>for line in sys.stdin:</code> and split each line.</p>',
        solution='import sys\n\nfor line in sys.stdin:\n    if line.strip():\n        a, b = map(int, line.split())\n        print(a + b)\n',
        alt='import sys\ndata = list(map(int, sys.stdin.read().split()))\nfor i in range(0, len(data), 2):\n    print(data[i] + data[i + 1])\n',
        tests=lambda r: ['5 7\n', '-3 3\n0 0\n', '2147483647 0\n-2147483648 0\n'] + [
            lines(*[f'{r.randint(-10**6, 10**6)} {r.randint(-10**6, 10**6)}' for _ in range(r.randint(2, 40))]) for _ in range(6)],
    ),
    Problem(
        slug='sum-min-max', title='Sum, Smallest, Largest', level=1,
        statement='<p>You are given a list of integers. Print their sum, the smallest of them and the largest of them.</p>',
        input='<p>The first line holds <code>n</code>, how many numbers there are. The second line holds the <code>n</code> integers, separated by spaces.</p>',
        output='<p>One line with three integers separated by spaces: the sum, the minimum and the maximum.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('5\n4 -2 9 0 3\n', '14 -2 9\n')],
        hint='<p>Read the first line with <code>int(input())</code> and the second into a list with <code>list(map(int, input().split()))</code>. Python has <code>sum</code>, <code>min</code> and <code>max</code> built in.</p>',
        solution='n = int(input())\nnums = list(map(int, input().split()))\nprint(sum(nums), min(nums), max(nums))\n',
        alt='n = int(input())\nnums = list(map(int, input().split()))\ntotal = 0\nlo = hi = nums[0]\nfor x in nums:\n    total += x\n    if x < lo:\n        lo = x\n    if x > hi:\n        hi = x\nprint(total, lo, hi)\n',
        tests=lambda r: ['1\n0\n', '1\n-1000\n', '3\n-5 -9 -2\n', lines(100, ints([1000] * 100))] + [
            (lambda k: lines(k, ints(r.randint(-1000, 1000) for _ in range(k))))(r.randint(1, 100)) for _ in range(6)],
    ),
    Problem(
        slug='average-of-three', title='Average of Three', level=1,
        statement='<p>Read three test scores and print their average.</p>',
        input='<p>One line with three integers separated by spaces.</p>',
        output='<p>The average, printed with exactly 2 digits after the decimal point (for example <code>80.00</code> or <code>1.67</code>).</p>',
        constraints='<p>Each score is between 0 and 100.</p>',
        examples=[('90 80 70\n', '80.00\n'), ('1 2 2\n', '1.67\n')],
        hint='<p>Add the three numbers and divide by 3. To get exactly two decimal places, print with an f-string: <code>f"{avg:.2f}"</code>.</p>',
        solution='a, b, c = map(int, input().split())\navg = (a + b + c) / 3\nprint(f"{avg:.2f}")\n',
        alt='a, b, c = map(int, input().split())\nt = a + b + c\nh = (t * 100 * 2 + 3) // 6   # hundredths, rounded half up\nprint(f"{h // 100}.{h % 100:02d}")\n',
        explanation='<p><code>print(avg)</code> would show <code>80.0</code> or <code>1.6666666666666667</code> — the format <code>:.2f</code> rounds to exactly two decimals.</p>',
        tests=lambda r: ['0 0 0', '100 100 100', '0 0 1', '0 0 2', '100 100 99', '0 100 0'] + [f'{r.randint(0, 100)} {r.randint(0, 100)} {r.randint(0, 100)}' for _ in range(6)],
    ),
    Problem(
        slug='celsius-to-fahrenheit', title='Celsius to Fahrenheit', level=1,
        statement='<p>Convert a temperature from degrees Celsius to degrees Fahrenheit using the formula F = C × 9 / 5 + 32.</p>',
        input='<p>One integer <code>C</code>.</p>',
        output='<p>The temperature in Fahrenheit, with exactly 1 digit after the decimal point.</p>',
        constraints='<p>−100 ≤ C ≤ 100</p>',
        examples=[('100\n', '212.0\n'), ('37\n', '98.6\n')],
        hint='<p>Work it out with <code>/</code>, then print using <code>f"{f:.1f}"</code> so that you get exactly one decimal digit.</p>',
        solution='c = int(input())\nf = c * 9 / 5 + 32\nprint(f"{f:.1f}")\n',
        alt='c = int(input())\nt = c * 18 + 320        # tenths of a degree, exact\nsign = "-" if t < 0 else ""\nt = abs(t)\nprint(f"{sign}{t // 10}.{t % 10}")\n',
        explanation='<p>Try <code>print(37 * 9 / 5 + 32)</code>: it shows <code>98.60000000000001</code>, because computers store most decimals only approximately. Formatting with <code>:.1f</code> hides that tiny error.</p>',
        tests=['0', '-40', '-100', '100', '37', '-17', '-18', '1', '-1', '55', '-73', '99'],
    ),
    Problem(
        slug='digital-clock', title='Digital Clock', level=1,
        statement='<p>A digital clock always shows two digits for the hours, the minutes and the seconds, like <code>07:05:00</code>. Given the time as three numbers, print it the way the clock shows it.</p>',
        input='<p>One line with three integers <code>h</code>, <code>m</code> and <code>s</code>.</p>',
        output='<p>The time as <code>HH:MM:SS</code>, each part with exactly two digits (add a leading zero when needed).</p>',
        constraints='<p>0 ≤ h ≤ 23, 0 ≤ m ≤ 59, 0 ≤ s ≤ 59</p>',
        examples=[('7 5 0\n', '07:05:00\n'), ('23 59 59\n', '23:59:59\n')],
        hint='<p>The format <code>:02d</code> pads a number with zeros to width 2. Put the colons straight into the f-string.</p>',
        solution='h, m, s = map(int, input().split())\nprint(f"{h:02d}:{m:02d}:{s:02d}")\n',
        alt='h, m, s = map(int, input().split())\nprint(":".join(str(v).zfill(2) for v in (h, m, s)))\n',
        tests=lambda r: ['0 0 0', '12 0 9', '9 9 9', '10 10 10'] + [f'{r.randint(0, 23)} {r.randint(0, 59)} {r.randint(0, 59)}' for _ in range(6)],
    ),
    Problem(
        slug='count-with-commas', title='Count with Commas', level=1,
        statement='<p>Print the numbers from 1 up to <code>n</code> on one line, separated by commas. Then, on a second line, print them from <code>n</code> back down to 1, separated by single spaces.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>Two lines. The first has <code>1,2,…,n</code> with no spaces and no comma at the end. The second has <code>n … 2 1</code> separated by spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100</p>',
        examples=[('5\n', '1,2,3,4,5\n5 4 3 2 1\n')],
        hint='<p>Unpack a range into <code>print</code> and choose the separator: <code>print(*range(1, n + 1), sep=",")</code>. A range can also count down: <code>range(n, 0, -1)</code>.</p>',
        solution='n = int(input())\nprint(*range(1, n + 1), sep=",")\nprint(*range(n, 0, -1))\n',
        alt='n = int(input())\nfor i in range(1, n + 1):\n    if i < n:\n        print(i, end=",")\n    else:\n        print(i)\nprint(" ".join(str(i) for i in reversed(range(1, n + 1))))\n',
        tests=['1', '2', '3', '9', '10', '11', '37', '64', '99', '100'],
    ),
    Problem(
        slug='middle-of-three', title='The Middle One', level=1,
        statement='<p>Three friends compare their heights. Print the height of the one in the middle — the value that would be second if the three numbers were sorted.</p>',
        input='<p>One line with three integers.</p>',
        output='<p>One integer: the middle value.</p>',
        constraints='<p>Each number is between −1000 and 1000. Numbers may be equal.</p>',
        examples=[('5 1 3\n', '3\n'), ('2 7 2\n', '2\n')],
        hint='<p>The middle value is the one that is neither the smallest nor the largest. One neat trick: add all three and take away the smallest and the largest.</p>',
        solution='a, b, c = map(int, input().split())\nprint(a + b + c - min(a, b, c) - max(a, b, c))\n',
        alt='a, b, c = map(int, input().split())\nif (b <= a <= c) or (c <= a <= b):\n    print(a)\nelif (a <= b <= c) or (c <= b <= a):\n    print(b)\nelse:\n    print(c)\n',
        tests=lambda r: ['1 2 3', '3 2 1', '2 3 1', '1 3 2', '5 5 5', '5 5 1', '1 5 5', '-1000 1000 0'] + [f'{r.randint(-1000, 1000)} {r.randint(-1000, 1000)} {r.randint(-1000, 1000)}' for _ in range(4)],
    ),
    Problem(
        slug='plus-minus-zero', title='Plus, Minus, Zero', level=1,
        statement='<p>Count how many numbers in a list are positive, how many are negative and how many are zero.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers separated by spaces.</p>',
        output='<p>One line with three integers: the number of positive values, negative values and zeros, in that order.</p>',
        constraints='<p>1 ≤ n ≤ 100; each value is between −100 and 100.</p>',
        examples=[('7\n3 -1 0 7 -5 0 2\n', '3 2 2\n')],
        hint='<p>Keep three counters starting at 0. For each number, an <code>if</code> / <code>elif</code> / <code>else</code> decides which counter to add 1 to.</p>',
        solution='n = int(input())\nnums = list(map(int, input().split()))\npos = neg = zero = 0\nfor x in nums:\n    if x > 0:\n        pos += 1\n    elif x < 0:\n        neg += 1\n    else:\n        zero += 1\nprint(pos, neg, zero)\n',
        alt='n = int(input())\nnums = list(map(int, input().split()))\nprint(sum(1 for x in nums if x > 0), sum(1 for x in nums if x < 0), nums.count(0))\n',
        tests=lambda r: ['1\n0\n', '1\n5\n', '1\n-5\n', '4\n1 2 3 4\n'] + [
            (lambda k: lines(k, ints(r.randint(-3, 3) * r.choice([1, 30]) for _ in range(k))))(r.randint(1, 100)) for _ in range(6)],
    ),
    Problem(
        slug='leap-years', title='Leap Years', level=1,
        statement='<p>A year is a <em>leap year</em> if it is divisible by 4 — except that years divisible by 100 are not leap years, unless they are also divisible by 400. So 2024 and 2000 are leap years, but 1900 and 2023 are not. Decide for several years.</p>',
        input='<p>The first line holds <code>T</code>, the number of years. Each of the next <code>T</code> lines holds one year.</p>',
        output='<p>For each year, one line: <code>leap</code> or <code>common</code>.</p>',
        constraints='<p>1 ≤ T ≤ 50; 1 ≤ year ≤ 9999</p>',
        examples=[('4\n2024\n1900\n2000\n2023\n', 'leap\ncommon\nleap\ncommon\n')],
        hint='<p>Loop <code>T</code> times. The rule turns into one condition with <code>or</code> and <code>and</code>: divisible by 400, <em>or</em> (divisible by 4 <em>and</em> not by 100).</p>',
        solution='t = int(input())\nfor _ in range(t):\n    y = int(input())\n    if y % 400 == 0 or (y % 4 == 0 and y % 100 != 0):\n        print("leap")\n    else:\n        print("common")\n',
        alt='t = int(input())\nfor _ in range(t):\n    y = int(input())\n    if y % 400 == 0:\n        print("leap")\n    elif y % 100 == 0:\n        print("common")\n    elif y % 4 == 0:\n        print("leap")\n    else:\n        print("common")\n',
        tests=lambda r: ['1\n1\n', '1\n4\n', '1\n100\n', '1\n400\n', lines(8, 1600, 1700, 1800, 1900, 2000, 2100, 2400, 9999)] + [
            (lambda k: lines(k, *[r.choice([r.randint(1, 9999), r.randint(1, 99) * 100, r.randint(1, 2499) * 4]) for _ in range(k)]))(r.randint(5, 50)) for _ in range(5)],
    ),
    Problem(
        slug='letter-grades', title='Letter Grades', level=1,
        statement='<p>Turn test scores into letter grades: 90 or more is <code>A</code>, 80–89 is <code>B</code>, 70–79 is <code>C</code>, 60–69 is <code>D</code> and anything below 60 is <code>F</code>.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> scores separated by spaces.</p>',
        output='<p>One line with the <code>n</code> letter grades in the same order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; 0 ≤ score ≤ 100</p>',
        examples=[('5\n95 80 79 60 12\n', 'A B C D F\n')],
        hint='<p>Check the grades from the top: <code>if s &gt;= 90</code>, then <code>elif s &gt;= 80</code>, … Since only the first true branch runs, you don\'t need to check the upper end of each range.</p>',
        solution='n = int(input())\nscores = list(map(int, input().split()))\ngrades = []\nfor s in scores:\n    if s >= 90:\n        grades.append("A")\n    elif s >= 80:\n        grades.append("B")\n    elif s >= 70:\n        grades.append("C")\n    elif s >= 60:\n        grades.append("D")\n    else:\n        grades.append("F")\nprint(" ".join(grades))\n',
        alt='n = int(input())\nscores = list(map(int, input().split()))\nout = []\nfor s in scores:\n    k = min(s // 10, 9)\n    out.append("FFFFFFDCBA"[k] if s < 100 else "A")\nprint(*out)\n',
        tests=lambda r: ['1\n100\n', '1\n0\n', '1\n59\n', lines(10, ints([89, 90, 79, 80, 69, 70, 59, 60, 100, 0]))] + [
            (lambda k: lines(k, ints(r.randint(0, 100) for _ in range(k))))(r.randint(1, 100)) for _ in range(5)],
    ),
    Problem(
        slug='times-table', title='Times Table', level=1,
        statement='<p>Print the times table of a number <code>n</code>, from <code>n * 1</code> up to <code>n * 9</code>.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>Nine lines. Line <code>i</code> is <code>n * i = </code> followed by the product, with single spaces exactly as in the example.</p>',
        constraints='<p>1 ≤ n ≤ 100</p>',
        examples=[('7\n', '7 * 1 = 7\n7 * 2 = 14\n7 * 3 = 21\n7 * 4 = 28\n7 * 5 = 35\n7 * 6 = 42\n7 * 7 = 49\n7 * 8 = 56\n7 * 9 = 63\n')],
        hint='<p>Loop <code>i</code> over <code>range(1, 10)</code> and build each line with an f-string: <code>f"{n} * {i} = {n * i}"</code>.</p>',
        solution='n = int(input())\nfor i in range(1, 10):\n    print(f"{n} * {i} = {n * i}")\n',
        alt='n = int(input())\ni = 1\nwhile i <= 9:\n    print(n, "*", i, "=", n * i)\n    i += 1\n',
        tests=['1', '2', '7', '9', '10', '12', '25', '64', '99', '100'],
    ),
    Problem(
        slug='factorial', title='Factorial', level=1,
        statement='<p>The factorial of <code>n</code>, written <code>n!</code>, is the product 1 × 2 × 3 × … × n. By definition, 0! = 1. Compute <code>n!</code>.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>One integer: <code>n!</code>.</p>',
        constraints='<p>0 ≤ n ≤ 25</p>',
        examples=[('5\n', '120\n'), ('0\n', '1\n')],
        hint='<p>Start a running product at 1 (not 0!) and multiply it by every number from 1 to <code>n</code>. Python integers never overflow, so big answers are fine.</p>',
        solution='n = int(input())\nf = 1\nfor k in range(1, n + 1):\n    f *= k\nprint(f)\n',
        alt='import math\nprint(math.factorial(int(input())))\n',
        tests=['0', '1', '2', '3', '5', '10', '13', '20', '21', '25'],
    ),
    Problem(
        slug='star-staircase', title='Star Staircase', level=1,
        statement='<p>Draw a staircase of <code>n</code> steps made of <code>*</code>, leaning to the right: row <code>i</code> has <code>i</code> stars, pushed to the right edge with spaces so that every row ends in the same column.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p><code>n</code> lines. Line <code>i</code> is <code>n − i</code> spaces followed by <code>i</code> stars.</p>',
        constraints='<p>1 ≤ n ≤ 40</p>',
        examples=[('3\n', '  *\n **\n***\n'), ('5\n', '    *\n   **\n  ***\n ****\n*****\n')],
        hint='<p>String multiplication builds each row: <code>" " * (n - i) + "*" * i</code>.</p>',
        solution='n = int(input())\nfor i in range(1, n + 1):\n    print(" " * (n - i) + "*" * i)\n',
        alt='n = int(input())\nfor i in range(1, n + 1):\n    print(("*" * i).rjust(n))\n',
        explanation='<p>The spaces on the left are part of the answer — the judge only ignores spaces at the <em>end</em> of a line.</p>',
        tests=['1', '2', '3', '4', '5', '8', '13', '21', '33', '40'],
    ),

    # ── Level 2: core ───────────────────────────────────────────────────
    Problem(
        slug='a-plus-b-until-zero', title='A + B Until 0 0', level=2,
        statement='<p>Each line of input holds a pair of integers A and B. Print A + B for each pair. The line <code>0 0</code> marks the end of the input: stop there, and do not print anything for it.</p>',
        input='<p>Several lines with two integers each. The last line is <code>0 0</code>.</p>',
        output='<p>One sum per line, for every pair before <code>0 0</code>.</p>',
        examples=[('1 5\n10 20\n0 0\n', '6\n30\n')],
        hint='<p>Use <code>while True:</code>, read a line, and <code>break</code> as soon as both numbers are 0 — before printing.</p>',
        solution='while True:\n    a, b = map(int, input().split())\n    if a == 0 and b == 0:\n        break\n    print(a + b)\n',
        explanation='<p>Only <em>both</em> numbers being 0 ends the input: a line like <code>0 5</code> is an ordinary pair.</p>',
        tests=lambda r: ['0 0\n', '0 5\n5 0\n0 0\n', '-4 4\n0 0\n'] + [
            lines(*[f'{r.randint(-500, 500)} {r.randint(1, 500)}' for _ in range(r.randint(1, 30))], '0 0') for _ in range(6)],
    ),
    Problem(
        slug='seconds-to-time', title='Seconds to Hours, Minutes, Seconds', level=2,
        statement='<p>A stopwatch counted <code>t</code> seconds. Show that time as hours, minutes and seconds.</p>',
        input='<p>One integer <code>t</code>.</p>',
        output='<p>The time as <code>H:MM:SS</code>: the hours with no extra zeros (they can be more than 24), then the minutes and seconds with exactly two digits each.</p>',
        constraints='<p>0 ≤ t ≤ 10 000 000</p>',
        examples=[('3725\n', '1:02:05\n', '3725 seconds = 1 hour (3600 s) + 2 minutes (120 s) + 5 seconds.'), ('59\n', '0:00:59\n')],
        hint='<p>There are 3600 seconds in an hour. <code>t // 3600</code> gives the whole hours; what is left over is <code>t % 3600</code>. Split that the same way into minutes and seconds.</p>',
        solution='t = int(input())\nh = t // 3600\nm = t % 3600 // 60\ns = t % 60\nprint(f"{h}:{m:02d}:{s:02d}")\n',
        alt='t = int(input())\nh, rest = divmod(t, 3600)\nm, s = divmod(rest, 60)\nprint(str(h) + ":" + str(m).zfill(2) + ":" + str(s).zfill(2))\n',
        tests=lambda r: ['0', '1', '60', '3599', '3600', '86399', '86400', '10000000'] + [str(r.randint(0, 10**7)) for _ in range(4)],
    ),
    Problem(
        slug='which-quadrant', title='Which Quadrant?', level=2,
        statement='<p>The two axes split the plane into four quadrants: Q1 is where x &gt; 0 and y &gt; 0, Q2 where x &lt; 0 and y &gt; 0, Q3 where both are negative and Q4 where x &gt; 0 and y &lt; 0. A point with a 0 coordinate is on an axis instead. Say where each point lies.</p>',
        input='<p>The first line holds <code>T</code>. Each of the next <code>T</code> lines holds two integers <code>x y</code>.</p>',
        output='<p>For each point, one line: <code>Q1</code>, <code>Q2</code>, <code>Q3</code>, <code>Q4</code>, <code>x-axis</code> (y is 0 but x is not), <code>y-axis</code> (x is 0 but y is not) or <code>origin</code> (both are 0).</p>',
        constraints='<p>1 ≤ T ≤ 100; −1000 ≤ x, y ≤ 1000</p>',
        examples=[('5\n3 4\n-2 7\n0 0\n5 0\n-1 -1\n', 'Q1\nQ2\norigin\nx-axis\nQ3\n')],
        hint='<p>Deal with the special cases first: both zero, then y zero, then x zero. After that, both coordinates are non-zero and their signs pick the quadrant.</p>',
        solution='t = int(input())\nfor _ in range(t):\n    x, y = map(int, input().split())\n    if x == 0 and y == 0:\n        print("origin")\n    elif y == 0:\n        print("x-axis")\n    elif x == 0:\n        print("y-axis")\n    elif x > 0 and y > 0:\n        print("Q1")\n    elif x < 0 and y > 0:\n        print("Q2")\n    elif x < 0:\n        print("Q3")\n    else:\n        print("Q4")\n',
        alt='t = int(input())\nfor _ in range(t):\n    x, y = map(int, input().split())\n    if x and y:\n        print("Q" + str({(1, 1): 1, (-1, 1): 2, (-1, -1): 3, (1, -1): 4}[(1 if x > 0 else -1, 1 if y > 0 else -1)]))\n    elif x:\n        print("x-axis")\n    elif y:\n        print("y-axis")\n    else:\n        print("origin")\n',
        tests=lambda r: ['1\n0 0\n', '1\n0 -3\n', '1\n7 -3\n', lines(7, '1 1', '-1 1', '-1 -1', '1 -1', '0 9', '-9 0', '0 0')] + [
            (lambda k: lines(k, *[f'{r.randint(-2, 2) * r.choice([1, 400])} {r.randint(-2, 2) * r.choice([1, 400])}' for _ in range(k)]))(r.randint(5, 100)) for _ in range(5)],
    ),
    Problem(
        slug='days-in-month', title='Days in a Month', level=2,
        statement='<p>How many days are there in a given month of a given year? April, June, September and November have 30 days; February has 29 days in a leap year and 28 otherwise; every other month has 31. (A leap year is divisible by 4, except years divisible by 100 that are not divisible by 400.)</p>',
        input='<p>One line with two integers: the year <code>y</code> and the month <code>m</code> (1 = January, …, 12 = December).</p>',
        output='<p>One integer: the number of days in that month.</p>',
        constraints='<p>1 ≤ y ≤ 9999, 1 ≤ m ≤ 12</p>',
        examples=[('2024 2\n', '29\n'), ('2023 4\n', '30\n')],
        hint='<p>February is the only month that depends on the year. For the others, <code>m in (4, 6, 9, 11)</code> picks out the 30-day months.</p>',
        solution='y, m = map(int, input().split())\nif m == 2:\n    if y % 400 == 0 or (y % 4 == 0 and y % 100 != 0):\n        print(29)\n    else:\n        print(28)\nelif m in (4, 6, 9, 11):\n    print(30)\nelse:\n    print(31)\n',
        alt='import calendar\ny, m = map(int, input().split())\nprint(calendar.monthrange(y, m)[1])\n',
        tests=lambda r: ['2000 2', '1900 2', '2023 2', '2024 2', '1 1', '9999 12', '2023 6', '2023 9', '2023 11', '2023 7', '2023 8'] + [f'{r.randint(1, 9999)} {r.randint(1, 12)}' for _ in range(4)],
    ),
    Problem(
        slug='triangle-kind', title='What Kind of Triangle?', level=2,
        statement='<p>You are given three stick lengths. Can they make a triangle — and if so, what kind? Three lengths make a triangle only if the two shorter ones together are <em>longer</em> than the longest one.</p>',
        input='<p>One line with three positive integers, in any order.</p>',
        output='<p>Exactly one of these words, checked in this order:</p><ul><li><code>not a triangle</code></li><li><code>equilateral</code> — all three sides equal</li><li><code>isosceles</code> — exactly two sides equal</li><li><code>right</code> — it has a right angle (the two shorter sides a, b and the longest c satisfy a² + b² = c²)</li><li><code>scalene</code> — any other triangle</li></ul>',
        constraints='<p>1 ≤ each length ≤ 1000</p>',
        examples=[('3 4 5\n', 'right\n'), ('1 2 3\n', 'not a triangle\n', '1 + 2 is not longer than 3: the sticks lie flat.')],
        hint='<p>Sort the three lengths first (<code>a, b, c = sorted(...)</code>) so that <code>c</code> is the longest. Then the triangle test is a single comparison, and so is the right-angle test.</p>',
        solution='a, b, c = sorted(map(int, input().split()))\nif a + b <= c:\n    print("not a triangle")\nelif a == c:\n    print("equilateral")\nelif a == b or b == c:\n    print("isosceles")\nelif a * a + b * b == c * c:\n    print("right")\nelse:\n    print("scalene")\n',
        alt='x, y, z = map(int, input().split())\nok = x + y > z and y + z > x and x + z > y\nequal_pairs = (x == y) + (y == z) + (x == z)\nsq = sorted([x * x, y * y, z * z])\nif not ok:\n    print("not a triangle")\nelif equal_pairs == 3:\n    print("equilateral")\nelif equal_pairs == 1:\n    print("isosceles")\nelif sq[0] + sq[1] == sq[2]:\n    print("right")\nelse:\n    print("scalene")\n',
        explanation='<p>Sorting removes all the "which one is the longest?" cases. With whole-number sides a right triangle can never be isosceles, so the order of the checks is safe.</p>',
        tests=lambda r: ['1 1 1', '1 1 2', '2 2 3', '3 2 2', '2 3 2', '5 4 3', '13 5 12', '1 1 1000', '999 1000 1000', '4 5 6', '10 3 4', '600 800 1000', '7 7 13', '7 7 14'] + [
            f'{r.randint(1, 30)} {r.randint(1, 30)} {r.randint(1, 30)}' for _ in range(4)],
    ),
    Problem(
        slug='water-bill', title='Water Bill', level=2,
        statement='<p>The water company charges in steps. The first 10 tons of water cost 3 dollars per ton. Each ton from the 11th to the 20th costs 4 dollars. Every ton after the 20th costs 6 dollars. Work out the bill.</p>',
        input='<p>One integer <code>u</code>, the number of tons used.</p>',
        output='<p>One integer: the bill in dollars.</p>',
        constraints='<p>0 ≤ u ≤ 100 000</p>',
        examples=[('25\n', '100\n', '10 × 3 + 10 × 4 + 5 × 6 = 30 + 40 + 30 = 100.'), ('8\n', '24\n')],
        hint='<p>Split into cases: <code>u &lt;= 10</code>, <code>u &lt;= 20</code>, and more. In each case, the full steps below cost a fixed amount and only the last step depends on <code>u</code>.</p>',
        solution='u = int(input())\nif u <= 10:\n    bill = 3 * u\nelif u <= 20:\n    bill = 30 + 4 * (u - 10)\nelse:\n    bill = 70 + 6 * (u - 20)\nprint(bill)\n',
        alt='u = int(input())\nbill = 0\nfor ton in range(1, u + 1):\n    if ton <= 10:\n        bill += 3\n    elif ton <= 20:\n        bill += 4\n    else:\n        bill += 6\nprint(bill)\n',
        tests=['0', '1', '10', '11', '20', '21', '25', '8', '15', '57', '99999', '100000'],
    ),
    Problem(
        slug='seven-clap', title='Seven Clap', level=2,
        statement='<p>In the counting game <em>Seven Clap</em>, players count up from 1, but instead of saying a number that is a multiple of 7 <em>or</em> has the digit 7 in it, they clap. Write down how the game goes from 1 to <code>n</code>.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p><code>n</code> lines. Line <code>k</code> is the word <code>clap</code> if <code>k</code> is divisible by 7 or contains the digit 7; otherwise it is <code>k</code> itself.</p>',
        constraints='<p>1 ≤ n ≤ 1000</p>',
        examples=[('17\n', '1\n2\n3\n4\n5\n6\nclap\n8\n9\n10\n11\n12\n13\nclap\n15\n16\nclap\n')],
        hint='<p>Two tests joined by <code>or</code>: <code>k % 7 == 0</code>, and <code>"7" in str(k)</code>.</p>',
        solution='n = int(input())\nfor k in range(1, n + 1):\n    if k % 7 == 0 or "7" in str(k):\n        print("clap")\n    else:\n        print(k)\n',
        alt='n = int(input())\nfor k in range(1, n + 1):\n    has7 = False\n    m = k\n    while m > 0:\n        if m % 10 == 7:\n            has7 = True\n        m //= 10\n    print("clap" if has7 or k % 7 == 0 else k)\n',
        tests=['1', '6', '7', '17', '70', '77', '100', '177', '700', '1000'],
    ),
    Problem(
        slug='reverse-a-number', title='Reverse a Number', level=2,
        statement='<p>Write the digits of an integer backwards. Zeros that end up at the front disappear (so 1200 becomes 21), and a negative number stays negative (−450 becomes −54).</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>One integer: <code>n</code> with its digits reversed.</p>',
        constraints='<p>−1 000 000 000 ≤ n ≤ 1 000 000 000</p>',
        examples=[('1200\n', '21\n'), ('-450\n', '-54\n')],
        hint='<p>Work with the absolute value and remember the sign. Build the answer with a loop: take the last digit with <code>% 10</code>, append it with <code>rev = rev * 10 + digit</code>, and drop it with <code>// 10</code>.</p>',
        solution='n = int(input())\nsign = -1 if n < 0 else 1\nn = abs(n)\nrev = 0\nwhile n > 0:\n    rev = rev * 10 + n % 10\n    n //= 10\nprint(sign * rev)\n',
        alt='s = input().strip()\nif s.startswith("-"):\n    print(-int(s[1:][::-1]))\nelse:\n    print(int(s[::-1]))\n',
        explanation='<p>Watch out for 0 and for −0: the answer for <code>0</code> is <code>0</code>, never <code>-0</code> or an empty line.</p>',
        tests=lambda r: ['0', '5', '-5', '10', '-10', '1000000000', '-1000000000', '123456789', '-987654321'] + [str(r.randint(-10**9, 10**9)) for _ in range(4)],
    ),
    Problem(
        slug='count-a-digit', title='Count a Digit', level=2,
        statement='<p>How many times does the digit <code>x</code> appear when you write out all the integers from 1 to <code>n</code>? For example, from 1 to 11 (1, 2, …, 9, 10, 11) the digit 1 appears 4 times.</p>',
        input='<p>Two integers <code>n</code> and <code>x</code>, separated by a space.</p>',
        output='<p>One integer: how many times the digit <code>x</code> appears.</p>',
        constraints='<p>1 ≤ n ≤ 1 000 000, 0 ≤ x ≤ 9</p>',
        examples=[('11 1\n', '4\n', 'The 1s are in 1, 10 (one) and 11 (two).')],
        hint='<p>Loop <code>k</code> from 1 to <code>n</code> and add up how many times the digit appears in each <code>k</code>: <code>str(k).count(str(x))</code>, or take <code>k</code> apart with <code>% 10</code> and <code>// 10</code>.</p>',
        solution='n, x = map(int, input().split())\nd = str(x)\nprint(sum(str(k).count(d) for k in range(1, n + 1)))\n',
        alt='n, x = map(int, input().split())\ncount = 0\nfor k in range(1, n + 1):\n    while k > 0:\n        if k % 10 == x:\n            count += 1\n        k //= 10\nprint(count)\n',
        tests=['1 1', '1 0', '9 0', '10 0', '100 0', '100 1', '1000 9', '99999 5', '1000000 0', '1000000 1', '54321 3', '777777 7'],
    ),
    Problem(
        slug='palindrome-numbers', title='Palindrome Numbers', level=2,
        statement='<p>A palindrome number reads the same forwards and backwards, like 7, 44, 121 or 12321. How many palindrome numbers are there from <code>a</code> to <code>b</code> (including both ends)?</p>',
        input='<p>One line with two integers <code>a</code> and <code>b</code>.</p>',
        output='<p>One integer: the count.</p>',
        constraints='<p>1 ≤ a ≤ b ≤ 100 000</p>',
        examples=[('1 20\n', '10\n', '1, 2, …, 9 and 11.'), ('100 200\n', '10\n')],
        hint='<p>A number is a palindrome if <code>str(k) == str(k)[::-1]</code>. Or reverse it with <code>% 10</code> and <code>// 10</code> and compare with the original.</p>',
        solution='a, b = map(int, input().split())\ncount = 0\nfor k in range(a, b + 1):\n    s = str(k)\n    if s == s[::-1]:\n        count += 1\nprint(count)\n',
        alt='a, b = map(int, input().split())\ncount = 0\nfor k in range(a, b + 1):\n    rev, m = 0, k\n    while m > 0:\n        rev = rev * 10 + m % 10\n        m //= 10\n    if rev == k:\n        count += 1\nprint(count)\n',
        tests=['1 1', '10 10', '11 11', '1 9', '1 100000', '100000 100000', '99999 100000', '12 21', '1000 9999', '54321 98765'],
    ),
    Problem(
        slug='prime-or-not', title='Prime or Not?', level=2,
        statement='<p>A prime number is a whole number greater than 1 whose only divisors are 1 and itself: 2, 3, 5, 7, 11, … Decide whether each given number is prime.</p>',
        input='<p>The first line holds <code>T</code>. Each of the next <code>T</code> lines holds one integer <code>n</code>.</p>',
        output='<p>For each number, one line: <code>prime</code> or <code>not prime</code>.</p>',
        constraints='<p>1 ≤ T ≤ 10; 1 ≤ n ≤ 1 000 000 000</p>',
        examples=[('4\n1\n2\n15\n97\n', 'not prime\nprime\nnot prime\nprime\n')],
        hint='<p>Trying every divisor up to <code>n</code> is far too slow for a billion. If <code>n</code> has a divisor, it has one with <code>d * d &lt;= n</code>, so you only need to try <code>d</code> up to the square root. And remember 1 is not prime.</p>',
        solution='t = int(input())\nfor _ in range(t):\n    n = int(input())\n    prime = n >= 2\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            prime = False\n            break\n        d += 1\n    print("prime" if prime else "not prime")\n',
        alt='def is_prime(n):\n    if n < 2:\n        return False\n    if n < 4:\n        return True\n    if n % 2 == 0 or n % 3 == 0:\n        return False\n    i = 5\n    while i * i <= n:\n        if n % i == 0 or n % (i + 2) == 0:\n            return False\n        i += 6\n    return True\n\nt = int(input())\nfor _ in range(t):\n    print("prime" if is_prime(int(input())) else "not prime")\n',
        explanation='<p>The square-root trick takes about 31 623 steps for a billion instead of a billion steps. Note that the worst case is a big <em>prime</em>: the loop never breaks early.</p>',
        tests=lambda r: ['1\n1\n', '1\n2\n', '1\n4\n', lines(10, 999999937, 999999929, 1000000000, 999999893, 999999883, 999999797, 999999761, 999999757, 999999751, 999999739),
                         lines(6, 961, 1369, 998623201, 998812807, 999002449, 999999733), lines(6, 3, 9, 25, 49, 121, 169)] + [
            (lambda k: lines(k, *[r.randint(1, 10**9) for _ in range(k)]))(10) for _ in range(4)],
    ),
    Problem(
        slug='list-divisors', title='All the Divisors', level=2,
        statement='<p>List every divisor of <code>n</code> — every positive whole number that divides <code>n</code> with no remainder.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>Two lines. The first has all the divisors in increasing order, separated by spaces. The second has how many divisors there are.</p>',
        constraints='<p>1 ≤ n ≤ 100 000</p>',
        examples=[('12\n', '1 2 3 4 6 12\n6\n'), ('1\n', '1\n1\n')],
        hint='<p>Try every <code>d</code> from 1 to <code>n</code> and keep the ones with <code>n % d == 0</code> in a list. Then print the list with <code>print(*divs)</code> and its length.</p>',
        solution='n = int(input())\ndivs = []\nfor d in range(1, n + 1):\n    if n % d == 0:\n        divs.append(d)\nprint(*divs)\nprint(len(divs))\n',
        alt='n = int(input())\nsmall, big = [], []\nd = 1\nwhile d * d <= n:\n    if n % d == 0:\n        small.append(d)\n        if d != n // d:\n            big.append(n // d)\n    d += 1\ndivs = small + big[::-1]\nprint(" ".join(map(str, divs)))\nprint(len(divs))\n',
        tests=['1', '2', '12', '16', '36', '97', '100000', '83160', '99991', '65536', '720', '10000'],
    ),
    Problem(
        slug='gcd-and-lcm', title='GCD and LCM', level=2,
        statement='<p>The <em>greatest common divisor</em> (GCD) of two numbers is the largest number that divides both. The <em>least common multiple</em> (LCM) is the smallest positive number that both divide. Find both.</p>',
        input='<p>One line with two integers <code>a</code> and <code>b</code>.</p>',
        output='<p>One line with two integers: the GCD, then the LCM.</p>',
        constraints='<p>1 ≤ a, b ≤ 1 000 000</p>',
        examples=[('12 18\n', '6 36\n'), ('7 5\n', '1 35\n')],
        hint='<p>Euclid\'s idea: the GCD of <code>a</code> and <code>b</code> is the same as the GCD of <code>b</code> and <code>a % b</code>. Repeat until the second number is 0. Then use GCD × LCM = a × b.</p>',
        solution='a, b = map(int, input().split())\nx, y = a, b\nwhile y != 0:\n    x, y = y, x % y\ng = x\nprint(g, a * b // g)\n',
        alt='import math\na, b = map(int, input().split())\ng = math.gcd(a, b)\nl = a\nwhile l % b != 0:\n    l += a\nprint(g, l)\n',
        explanation='<p>Notice that the loop needs the <em>original</em> <code>a</code> and <code>b</code> again at the end for the LCM — so loop on copies.</p>',
        tests=lambda r: ['1 1', '1 1000000', '1000000 1000000', '999983 999979', '17 34', '34 17', '1024 768', '123456 654321'] + [f'{r.randint(1, 10**6)} {r.randint(1, 10**6)}' for _ in range(4)],
    ),
    Problem(
        slug='fibonacci-numbers', title='Fibonacci Numbers', level=2,
        statement='<p>The Fibonacci numbers start 1, 1, and then every number is the sum of the two before it: 1, 1, 2, 3, 5, 8, 13, … Print the first <code>n</code> of them.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>One line with the first <code>n</code> Fibonacci numbers, separated by spaces.</p>',
        constraints='<p>1 ≤ n ≤ 90</p>',
        examples=[('7\n', '1 1 2 3 5 8 13\n'), ('1\n', '1\n')],
        hint='<p>Keep just the last two numbers in two variables <code>a</code> and <code>b</code>. Each step prints <code>a</code> and moves along with <code>a, b = b, a + b</code>.</p>',
        solution='n = int(input())\na, b = 1, 1\nout = []\nfor _ in range(n):\n    out.append(a)\n    a, b = b, a + b\nprint(*out)\n',
        alt='n = int(input())\nfib = [1, 1]\nwhile len(fib) < n:\n    fib.append(fib[-1] + fib[-2])\nprint(" ".join(str(x) for x in fib[:n]))\n',
        tests=['1', '2', '3', '7', '10', '20', '45', '60', '89', '90'],
    ),
    Problem(
        slug='collatz-steps', title='The 3n + 1 Walk', level=2,
        statement='<p>Start from a positive integer <code>n</code>. If it is even, halve it; if it is odd, replace it with <code>3n + 1</code>. Repeat until you reach 1. (Nobody has ever found a start that doesn\'t reach 1!) Count the steps, and find the largest number visited on the way.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>Two lines: the number of steps to reach 1, then the largest value reached (including <code>n</code> itself).</p>',
        constraints='<p>1 ≤ n ≤ 1 000 000</p>',
        examples=[('6\n', '8\n16\n', '6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1: eight steps, and 16 is the highest.'), ('1\n', '0\n1\n')],
        hint='<p>A <code>while n != 1:</code> loop. Inside, change <code>n</code>, add 1 to a step counter, and update the largest value seen so far. Use <code>//</code> to halve, so <code>n</code> stays a whole number.</p>',
        solution='n = int(input())\nsteps = 0\npeak = n\nwhile n != 1:\n    if n % 2 == 0:\n        n //= 2\n    else:\n        n = 3 * n + 1\n    steps += 1\n    peak = max(peak, n)\nprint(steps)\nprint(peak)\n',
        alt='n = int(input())\nseq = [n]\nwhile seq[-1] > 1:\n    x = seq[-1]\n    seq.append(x // 2 if x % 2 == 0 else 3 * x + 1)\nprint(len(seq) - 1)\nprint(max(seq))\n',
        tests=['1', '2', '3', '6', '7', '27', '97', '871', '77031', '837799', '1000000', '524288'],
    ),
    Problem(
        slug='average-until-minus-one', title='Average Until −1', level=2,
        statement='<p>A teacher types in test scores one at a time and types <code>-1</code> when there are no more. Print how many scores there were and their average.</p>',
        input='<p>Several lines, each with one integer. The last line is <code>-1</code>, which is not a score.</p>',
        output='<p>One line with the number of scores and the average rounded to 2 decimal places (as <code>f"{avg:.2f}"</code> prints it), separated by a space. If <code>-1</code> is the very first line, print <code>no data</code> instead.</p>',
        constraints='<p>Every score is between 0 and 100; at most 1000 scores. The tests never contain an average that sits exactly halfway between two possible answers.</p>',
        examples=[('90\n85\n77\n-1\n', '3 84.00\n'), ('-1\n', 'no data\n')],
        hint='<p>Keep a running total and a counter, read in a <code>while True:</code> loop and <code>break</code> on <code>-1</code>. Check the counter before you divide — dividing by 0 crashes.</p>',
        solution='total = 0\ncount = 0\nwhile True:\n    x = int(input())\n    if x == -1:\n        break\n    total += x\n    count += 1\nif count == 0:\n    print("no data")\nelse:\n    print(count, f"{total / count:.2f}")\n',
        alt='import sys\nvals = []\nfor tok in sys.stdin.read().split():\n    if tok == "-1":\n        break\n    vals.append(int(tok))\nif vals:\n    h = (sum(vals) * 200 + len(vals)) // (2 * len(vals))   # hundredths, rounded half up\n    print(len(vals), f"{h // 100}.{h % 100:02d}")\nelse:\n    print("no data")\n',
        tests=lambda r: ['-1\n', '0\n-1\n', '100\n-1\n', '100\n99\n-1\n', '1\n0\n0\n-1\n', lines(*([100] * 1000), -1)] + [_scores_until_minus_one(r) for _ in range(5)],
    ),
    Problem(
        slug='max-per-case', title='Largest in Each Case', level=2,
        statement='<p>The input holds several separate test cases. Each case is a list of integers; print the largest number of each list, labelled with the case number.</p>',
        input='<p>The first line holds <code>T</code>, the number of cases. Each case is two lines: a line with <code>n</code>, then a line with <code>n</code> integers.</p>',
        output='<p>For case number <code>k</code> (counting from 1), one line <code>Case k: m</code> where <code>m</code> is the largest number in that case.</p>',
        constraints='<p>1 ≤ T ≤ 20; 1 ≤ n ≤ 100; numbers between −10 000 and 10 000.</p>',
        examples=[('2\n3\n4 -1 7\n1\n-5\n', 'Case 1: 7\nCase 2: -5\n')],
        hint='<p>An outer loop over the cases with <code>for k in range(1, t + 1):</code>. Inside it, read <code>n</code> and then the list. The label is an f-string: <code>f"Case {k}: {best}"</code>.</p>',
        solution='t = int(input())\nfor k in range(1, t + 1):\n    n = int(input())\n    nums = list(map(int, input().split()))\n    print(f"Case {k}: {max(nums)}")\n',
        alt='import sys\ndata = sys.stdin.read().split()\npos = 0\nt = int(data[pos]); pos += 1\nfor k in range(1, t + 1):\n    n = int(data[pos]); pos += 1\n    best = int(data[pos])\n    for i in range(n):\n        best = max(best, int(data[pos + i]))\n    pos += n\n    print("Case", str(k) + ":", best)\n',
        tests=lambda r: ['1\n1\n0\n', '1\n3\n-3 -2 -1\n', lines(3, 2, '5 5', 1, 10000, 4, '-10000 -10000 -9999 -10000')] + [
            (lambda T: lines(T, *[x for _ in range(T) for x in (lambda n: (n, ints(r.randint(-10000, 10000) for _ in range(n))))(r.randint(1, 60))]))(r.randint(1, 20)) for _ in range(6)],
    ),
    Problem(
        slug='record-highs', title='Record Highs', level=2,
        statement='<p>A weather station writes down the temperature every day. A day <em>sets a record</em> if its temperature is strictly higher than every day before it. The first day always sets a record. How many days set a record?</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> temperatures, separated by spaces.</p>',
        output='<p>One line with two integers: the number of record days, and the final record (the highest temperature).</p>',
        constraints='<p>1 ≤ n ≤ 1000; each temperature is between −50 and 50.</p>',
        examples=[('7\n3 5 2 5 8 1 9\n', '4 9\n', 'Records are set by 3, 5, 8 and 9. The second 5 only equals the record, so it does not count.')],
        hint='<p>Keep a <em>best so far</em>, starting from the first day. Each later day: if it beats the best, count it and update the best.</p>',
        solution='n = int(input())\ntemps = list(map(int, input().split()))\nbest = temps[0]\nrecords = 1\nfor x in temps[1:]:\n    if x > best:\n        best = x\n        records += 1\nprint(records, best)\n',
        alt='n = int(input())\ntemps = list(map(int, input().split()))\nrecords = 0\nfor i in range(n):\n    if all(temps[j] < temps[i] for j in range(i)):\n        records += 1\nprint(records, max(temps))\n',
        explanation='<p>Starting the best at 0 would be a bug: on a cold day of −10 the first day would not count.</p>',
        tests=lambda r: ['1\n-50\n', '3\n-5 -5 -5\n', '5\n1 2 3 4 5\n', '5\n5 4 3 2 1\n', lines(101, ints(range(-50, 51)))] + [
            (lambda k: lines(k, ints(r.randint(-50, 50) for _ in range(k))))(r.randint(1, 300)) for _ in range(5)],
    ),
    Problem(
        slug='top-scorer', title='Top Scorer', level=2,
        statement='<p>After a quiz, every player\'s name and score are listed. Find the player with the highest score. If several players share the highest score, choose the one listed first.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds a name (one word of letters) and an integer score, separated by a space.</p>',
        output='<p>One line: the winner\'s name and score, separated by a space.</p>',
        constraints='<p>1 ≤ n ≤ 100; 0 ≤ score ≤ 1000; names are at most 15 letters.</p>',
        examples=[('4\nAva 72\nBen 95\nCleo 88\nDan 95\n', 'Ben 95\n', 'Ben and Dan both have 95, and Ben comes first.')],
        hint='<p>Split each line into a name and a score (<code>name, s = input().split()</code>, then <code>int(s)</code>). Keep the best name and best score; update them only when a score is strictly bigger.</p>',
        solution='n = int(input())\nbest_name, best_score = "", -1\nfor _ in range(n):\n    name, s = input().split()\n    s = int(s)\n    if s > best_score:\n        best_name, best_score = name, s\nprint(best_name, best_score)\n',
        alt='n = int(input())\nrows = [input().split() for _ in range(n)]\ntop = max(int(s) for _, s in rows)\nfor name, s in rows:\n    if int(s) == top:\n        print(name, top)\n        break\n',
        tests=lambda r: ['1\nZoe 0\n', '2\nA 5\nB 5\n', '3\nMia 0\nLeo 0\nKai 1\n'] + [
            (lambda k: lines(k, *[f'{"".join(r.choice("abcdefghijklmnop") for _ in range(r.randint(1, 15))).capitalize()} {r.randint(0, r.choice([10, 1000]))}' for _ in range(k)]))(r.randint(2, 100)) for _ in range(7)],
    ),
    Problem(
        slug='number-triangle', title='Number Triangle', level=2,
        statement='<p>Print a triangle of consecutive numbers starting from 1. Row <code>i</code> holds <code>i</code> numbers. Every number takes up exactly <strong>4 characters</strong>, right-aligned (padded with spaces on the left).</p>',
        input='<p>One integer <code>n</code>, the number of rows.</p>',
        output='<p><code>n</code> lines; line <code>i</code> contains <code>i</code> numbers, each printed in a width of 4.</p>',
        constraints='<p>1 ≤ n ≤ 40</p>',
        examples=[('4\n', '   1\n   2   3\n   4   5   6\n   7   8   9  10\n')],
        hint='<p>Keep a counter that starts at 1 and goes up by one each time you print. Print each number with <code>f"{k:4d}"</code> and <code>end=""</code>, then a plain <code>print()</code> to end the row.</p>',
        solution='n = int(input())\nk = 1\nfor i in range(1, n + 1):\n    for _ in range(i):\n        print(f"{k:4d}", end="")\n        k += 1\n    print()\n',
        alt='n = int(input())\nk = 1\nfor i in range(1, n + 1):\n    row = "".join(str(v).rjust(4) for v in range(k, k + i))\n    print(row)\n    k += i\n',
        explanation='<p>The spaces at the start of each line are part of the answer — only spaces at the <em>end</em> of a line are ignored.</p>',
        tests=['1', '2', '3', '5', '9', '13', '14', '20', '33', '40'],
    ),
    Problem(
        slug='star-pyramid', title='Star Pyramid', level=2,
        statement='<p>Draw a pyramid of stars with <code>n</code> rows. The top row has 1 star, and each row has 2 more stars than the one above it. Every row is centred, so the pyramid is symmetric.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p><code>n</code> lines. Row <code>i</code> (counting from 1) is <code>n − i</code> spaces followed by <code>2i − 1</code> stars.</p>',
        constraints='<p>1 ≤ n ≤ 40</p>',
        examples=[('3\n', '  *\n ***\n*****\n'), ('1\n', '*\n')],
        hint='<p>Make a little table for n = 3: row 1 has 2 spaces and 1 star, row 2 has 1 space and 3 stars, row 3 has 0 spaces and 5 stars. Turn the columns into formulas in <code>i</code>.</p>',
        solution='n = int(input())\nfor i in range(1, n + 1):\n    print(" " * (n - i) + "*" * (2 * i - 1))\n',
        alt='n = int(input())\nwidth = 2 * n - 1\nfor i in range(1, n + 1):\n    print(("*" * (2 * i - 1)).center(width).rstrip())\n',
        tests=['1', '2', '3', '4', '6', '9', '15', '24', '33', '40'],
    ),
    Problem(
        slug='hollow-square', title='Hollow Square', level=2,
        statement='<p>Draw the outline of an <code>n</code> × <code>n</code> square with stars: the top and bottom rows and the left and right columns are <code>*</code>, and the inside is filled with spaces.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p><code>n</code> lines of <code>n</code> characters each (spaces at the end of a line don\'t matter).</p>',
        constraints='<p>1 ≤ n ≤ 40</p>',
        examples=[('4\n', '****\n*  *\n*  *\n****\n'), ('2\n', '**\n**\n')],
        hint='<p>The first and last rows are all stars. Every row in between is a star, <code>n − 2</code> spaces, and a star. Be careful with <code>n = 1</code>: the square is a single star.</p>',
        solution='n = int(input())\nfor i in range(1, n + 1):\n    if i == 1 or i == n:\n        print("*" * n)\n    else:\n        print("*" + " " * (n - 2) + "*")\n',
        alt='n = int(input())\nfor r in range(n):\n    row = ""\n    for c in range(n):\n        if r == 0 or r == n - 1 or c == 0 or c == n - 1:\n            row += "*"\n        else:\n            row += " "\n    print(row)\n',
        tests=['1', '2', '3', '4', '5', '7', '10', '19', '32', '40'],
    ),
    Problem(
        slug='multiplication-grid', title='Multiplication Grid', level=2,
        statement='<p>Print the full <code>n</code> × <code>n</code> multiplication grid: row <code>i</code>, column <code>j</code> holds <code>i × j</code>. To keep the columns straight, every entry is right-aligned in a width equal to the number of digits of the biggest entry, <code>n × n</code>, and entries are separated by one space.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p><code>n</code> lines of <code>n</code> entries each, formatted as described.</p>',
        constraints='<p>1 ≤ n ≤ 30</p>',
        examples=[('4\n', ' 1  2  3  4\n 2  4  6  8\n 3  6  9 12\n 4  8 12 16\n', 'The biggest entry, 16, has 2 digits, so every entry is printed in width 2.')],
        hint='<p>The width is <code>w = len(str(n * n))</code>. An f-string can take the width from a variable: <code>f"{x:{w}d}"</code>, or use <code>str(x).rjust(w)</code>. Collect a row in a list and <code>" ".join</code> it.</p>',
        solution='n = int(input())\nw = len(str(n * n))\nfor i in range(1, n + 1):\n    row = []\n    for j in range(1, n + 1):\n        row.append(f"{i * j:{w}d}")\n    print(" ".join(row))\n',
        alt='n = int(input())\nw = len(str(n * n))\nfor i in range(1, n + 1):\n    for j in range(1, n + 1):\n        end = "\\n" if j == n else " "\n        print(str(i * j).rjust(w), end=end)\n',
        tests=['1', '2', '3', '4', '9', '10', '11', '12', '25', '30'],
    ),

    # ── Level 3: challenge ──────────────────────────────────────────────
    Problem(
        slug='longest-streak', title='Longest Streak', level=3,
        statement='<p>In a list of numbers, a <em>streak</em> is a run of equal numbers standing next to each other. Find the longest streak. If two streaks are equally long, report the one that comes first.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers separated by spaces.</p>',
        output='<p>One line with two integers: the length of the longest streak and the number it is made of.</p>',
        constraints='<p>1 ≤ n ≤ 1000; each number is between −100 and 100.</p>',
        examples=[('8\n1 1 2 2 2 3 3 3\n', '3 2\n', 'The 2s and the 3s both form streaks of 3; the 2s come first.'), ('3\n4 5 4\n', '1 4\n')],
        hint='<p>Walk along the list keeping the length of the <em>current</em> streak: if a number equals the one before it, the streak grows; otherwise a new streak of length 1 starts. Whenever the current streak beats the best one, remember it.</p>',
        solution='n = int(input())\na = list(map(int, input().split()))\nbest_len, best_val = 1, a[0]\ncur = 1\nfor i in range(1, n):\n    if a[i] == a[i - 1]:\n        cur += 1\n    else:\n        cur = 1\n    if cur > best_len:\n        best_len, best_val = cur, a[i]\nprint(best_len, best_val)\n',
        alt='n = int(input())\na = list(map(int, input().split()))\nbest = (0, 0)\ni = 0\nwhile i < n:\n    j = i\n    while j < n and a[j] == a[i]:\n        j += 1\n    if j - i > best[0]:\n        best = (j - i, a[i])\n    i = j\nprint(*best)\n',
        explanation='<p>A common bug is to update the best only when a streak <em>ends</em> — then a streak that runs to the very end of the list is never counted. Checking after every step avoids that.</p>',
        tests=lambda r: ['1\n-7\n', '4\n9 9 9 9\n', '5\n1 2 3 4 5\n', '6\n1 2 2 3 3 3\n', '6\n5 5 5 7 7 7\n'] + [
            (lambda k: lines(k, ints(r.choice([r.randint(-1, 1), r.randint(-100, 100)]) for _ in range(k))))(r.randint(1, 1000)) for _ in range(5)],
    ),
    Problem(
        slug='clock-hands', title='Angle Between Clock Hands', level=3,
        statement='<p>On a round clock face, what is the angle between the hour hand and the minute hand? The minute hand moves 6° per minute. The hour hand moves 30° per hour <em>and</em> keeps creeping forward as the minutes pass — half a degree per minute. Always give the smaller of the two angles between the hands (at most 180°).</p>',
        input='<p>The first line holds <code>T</code>. Each of the next <code>T</code> lines is a time written <code>H:MM</code> on a 24-hour clock.</p>',
        output='<p>For each time, one line with the angle in degrees, with exactly 1 digit after the decimal point.</p>',
        constraints='<p>1 ≤ T ≤ 100; 0 ≤ H ≤ 23; 0 ≤ MM ≤ 59</p>',
        examples=[('3\n3:00\n9:45\n12:30\n', '90.0\n22.5\n165.0\n', 'At 9:45 the hour hand is at 9 × 30 + 45 × 0.5 = 292.5° and the minute hand at 45 × 6 = 270°.')],
        hint='<p>Split the time at the colon: <code>h, m = map(int, line.split(":"))</code>. A 24-hour clock face only shows 12 hours, so use <code>h % 12</code>. Find both hand positions in degrees, take the difference, and if it is more than 180 use <code>360 − difference</code>.</p>',
        solution='t = int(input())\nfor _ in range(t):\n    h, m = map(int, input().split(":"))\n    hour = (h % 12) * 30 + m * 0.5\n    minute = m * 6\n    diff = abs(hour - minute)\n    if diff > 180:\n        diff = 360 - diff\n    print(f"{diff:.1f}")\n',
        alt='t = int(input())\nfor _ in range(t):\n    s = input().strip()\n    h = int(s[:s.index(":")])\n    m = int(s[s.index(":") + 1:])\n    d2 = abs(60 * (h % 12) - 11 * m)   # twice the angle, a whole number\n    d2 = min(d2, 720 - d2)\n    print(str(d2 // 2) + (".5" if d2 % 2 else ".0"))\n',
        tests=lambda r: ['1\n0:00\n', '1\n12:00\n', '1\n6:00\n', '1\n18:00\n', '2\n23:59\n0:01\n', lines(4, '9:00', '21:00', '3:30', '15:30')] + [
            (lambda k: lines(k, *[f'{r.randint(0, 23)}:{r.randint(0, 59):02d}' for _ in range(k)]))(r.randint(5, 100)) for _ in range(5)],
    ),
    Problem(
        slug='next-day', title='Tomorrow\'s Date', level=3,
        statement='<p>Given a date, print the date of the next day. Remember the month lengths: April, June, September and November have 30 days; February has 29 days in a leap year and 28 otherwise; the rest have 31. (A leap year is divisible by 4, except years divisible by 100 that are not divisible by 400.)</p>',
        input='<p>One date written <code>YYYY-MM-DD</code>.</p>',
        output='<p>The next day, in the same format <code>YYYY-MM-DD</code> (4-digit year, 2-digit month and day).</p>',
        constraints='<p>The date is valid and between 1000-01-01 and 9998-12-31.</p>',
        examples=[('2024-02-28\n', '2024-02-29\n'), ('2023-12-31\n', '2024-01-01\n')],
        hint='<p>Split the text at the dashes and turn the parts into numbers. Work out how many days this month has; add 1 to the day, and if that goes past the end of the month, move to day 1 of the next month — and maybe the next year. Print with <code>:02d</code>.</p>',
        solution='y, m, d = map(int, input().split("-"))\nif m == 2:\n    if y % 400 == 0 or (y % 4 == 0 and y % 100 != 0):\n        days = 29\n    else:\n        days = 28\nelif m in (4, 6, 9, 11):\n    days = 30\nelse:\n    days = 31\nd += 1\nif d > days:\n    d = 1\n    m += 1\n    if m > 12:\n        m = 1\n        y += 1\nprint(f"{y:04d}-{m:02d}-{d:02d}")\n',
        alt='import datetime\ny, m, d = map(int, input().strip().split("-"))\nprint((datetime.date(y, m, d) + datetime.timedelta(days=1)).isoformat())\n',
        tests=lambda r: ['2024-02-29', '2023-02-28', '1900-02-28', '2000-02-28', '2000-02-29', '2023-04-30', '2023-01-31', '1999-12-31', '9998-12-31', '1000-01-01', '2023-06-15', '2023-11-30'] + [
            (lambda y, m: f'{y:04d}-{m:02d}-{r.randint(1, 28):02d}')(r.randint(1000, 9998), r.randint(1, 12)) for _ in range(3)],
    ),
    Problem(
        slug='snail-in-a-well', title='Snail in a Well', level=3,
        statement='<p>A snail at the bottom of a well <code>h</code> metres deep wants to get out. Every day it climbs up <code>u</code> metres, but every night, while asleep, it slides back down <code>d</code> metres. As soon as it reaches the top (height <code>h</code> or more) during a day, it is out. On which day does it get out?</p>',
        input='<p>One line with three integers <code>h</code>, <code>u</code> and <code>d</code>.</p>',
        output='<p>The number of the day on which the snail gets out (the first day is day 1), or the word <code>never</code> if it never does.</p>',
        constraints='<p>1 ≤ h ≤ 100 000; 1 ≤ u ≤ 100 000; 0 ≤ d ≤ 100 000</p>',
        examples=[('10 3 2\n', '8\n', 'Each full day-and-night gains 1 m. On the morning of day 8 the snail is at 7 m and climbs to 10 m.'), ('5 2 2\n', 'never\n')],
        hint='<p>Simulate: start at height 0, and each day add <code>u</code>, check whether it is out, then subtract <code>d</code>. Before you start, decide when the answer is <code>never</code> — otherwise your loop runs forever. (What if the very first climb is enough?)</p>',
        solution='h, u, d = map(int, input().split())\nif u < h and u <= d:\n    print("never")\nelse:\n    height = 0\n    day = 0\n    while True:\n        day += 1\n        height += u\n        if height >= h:\n            break\n        height -= d\n    print(day)\n',
        alt='h, u, d = map(int, input().split())\nif u >= h:\n    print(1)\nelif u <= d:\n    print("never")\nelse:\n    need = h - u                   # height to reach before the last climb\n    print((need + (u - d) - 1) // (u - d) + 1)\n',
        explanation='<p>The trap: if the snail climbs out on the first day, the slide doesn\'t matter at all — <code>5 6 100</code> is day 1, not <code>never</code>.</p>',
        tests=lambda r: ['1 1 0', '1 1 1', '5 6 100', '5 5 5', '6 5 5', '100000 2 1', '100000 100000 0', '100000 99999 99998', '10 4 1', '12 5 2'] + [
            (lambda u: f'{r.randint(1, 100000)} {u} {r.randint(0, u - 1)}')(r.randint(2, 2000)) for _ in range(3)],
    ),
    Problem(
        slug='prime-factors', title='Prime Factors', level=3,
        statement='<p>Every whole number greater than 1 can be written as a product of primes in exactly one way, like 360 = 2 × 2 × 2 × 3 × 3 × 5. Write <code>n</code> as such a product, using powers for repeated primes.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>One line: <code>n = </code> followed by the prime factors from smallest to largest, joined by <code> * </code>. A prime that appears more than once is written <code>p^e</code>; one that appears once is just <code>p</code>. See the examples for the exact spacing.</p>',
        constraints='<p>2 ≤ n ≤ 1 000 000 000</p>',
        examples=[('360\n', '360 = 2^3 * 3^2 * 5\n'), ('13\n', '13 = 13\n')],
        hint='<p>Try <code>p = 2, 3, 4, …</code> while <code>p * p &lt;= n</code>; each time <code>p</code> divides <code>n</code>, divide it out as many times as you can and count. (Non-primes like 4 never divide by then.) Whatever is left above 1 at the end is one last prime.</p>',
        solution='n = int(input())\norig = n\nparts = []\np = 2\nwhile p * p <= n:\n    e = 0\n    while n % p == 0:\n        n //= p\n        e += 1\n    if e == 1:\n        parts.append(str(p))\n    elif e > 1:\n        parts.append(f"{p}^{e}")\n    p += 1\nif n > 1:\n    parts.append(str(n))\nprint(orig, "=", " * ".join(parts))\n',
        alt='n = int(input())\nfactors = []\nm = n\nd = 2\nwhile d * d <= m:\n    if m % d == 0:\n        factors.append(d)\n        m //= d\n    else:\n        d += 1 if d == 2 else 2\nif m > 1:\n    factors.append(m)\nout = []\nfor f in sorted(set(factors)):\n    c = factors.count(f)\n    out.append(str(f) if c == 1 else str(f) + "^" + str(c))\nprint(str(n) + " = " + " * ".join(out))\n',
        tests=['2', '4', '360', '13', '1000000000', '999999937', '536870912', '999999893', '999002449', '998812807', '223092870', '97', '961', '600851475'],
    ),
    Problem(
        slug='perfect-numbers', title='Perfect Numbers', level=3,
        statement='<p>A number is <em>perfect</em> if it equals the sum of its divisors other than itself. For example 6 = 1 + 2 + 3 and 28 = 1 + 2 + 4 + 7 + 14. Find every perfect number up to <code>n</code>.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>One line for each perfect number up to <code>n</code>, smallest first, in the form <code>6 = 1 + 2 + 3</code> (the divisors in increasing order, joined by <code> + </code>). If there are none, print <code>none</code>.</p>',
        constraints='<p>1 ≤ n ≤ 10 000</p>',
        examples=[('30\n', '6 = 1 + 2 + 3\n28 = 1 + 2 + 4 + 7 + 14\n'), ('5\n', 'none\n')],
        hint='<p>Checking every number up to <code>k</code> as a divisor of every <code>k</code> up to 10 000 is about 50 million steps — too slow. Divisors come in pairs <code>d</code> and <code>k // d</code>, so stop at <code>d * d &lt;= k</code> and add both. Is 1 perfect? Its only divisor is itself, so the sum is 0.</p>',
        solution='n = int(input())\nfound = False\nfor k in range(2, n + 1):\n    small, big = [], []\n    d = 1\n    while d * d <= k:\n        if k % d == 0:\n            small.append(d)\n            if d != k // d and d != 1:\n                big.append(k // d)\n        d += 1\n    divs = small + big[::-1]\n    if sum(divs) == k:\n        found = True\n        print(k, "=", " + ".join(map(str, divs)))\nif not found:\n    print("none")\n',
        alt='n = int(input())\ns = [0] * (n + 1)\nfor d in range(1, n // 2 + 1):\n    for m in range(2 * d, n + 1, d):\n        s[m] += d\nperfect = [k for k in range(2, n + 1) if s[k] == k]\nif not perfect:\n    print("none")\nfor k in perfect:\n    print(str(k) + " = " + " + ".join(str(d) for d in range(1, k) if k % d == 0))\n',
        explanation='<p>Careful with the pairs: for <code>d = 1</code> the partner is <code>k</code> itself, which must be left out, and for a perfect square <code>d = k // d</code> must only be added once.</p>',
        tests=['1', '2', '5', '6', '27', '28', '30', '495', '496', '8127', '8128', '10000'],
    ),
    Problem(
        slug='armstrong-numbers', title='Armstrong Numbers', level=3,
        statement='<p>An <em>Armstrong number</em> equals the sum of its own digits, each raised to the power of how many digits it has. For example 153 has 3 digits and 1³ + 5³ + 3³ = 153. Every one-digit number is an Armstrong number too. List the Armstrong numbers from <code>a</code> to <code>b</code>.</p>',
        input='<p>One line with two integers <code>a</code> and <code>b</code>.</p>',
        output='<p>The Armstrong numbers from <code>a</code> to <code>b</code> (inclusive), in increasing order, on one line separated by spaces. If there are none, print <code>none</code>.</p>',
        constraints='<p>1 ≤ a ≤ b ≤ 100 000</p>',
        examples=[('100 500\n', '153 370 371 407\n'), ('10 100\n', 'none\n')],
        hint='<p>For each <code>k</code>, let <code>s = str(k)</code>; the power is <code>len(s)</code>. Add up <code>int(c) ** len(s)</code> over the characters <code>c</code> of <code>s</code>. Collect the matches in a list so you can print <code>none</code> when it is empty.</p>',
        solution='a, b = map(int, input().split())\nfound = []\nfor k in range(a, b + 1):\n    s = str(k)\n    p = len(s)\n    total = 0\n    for c in s:\n        total += int(c) ** p\n    if total == k:\n        found.append(k)\nif found:\n    print(*found)\nelse:\n    print("none")\n',
        alt='a, b = map(int, input().split())\nout = []\nfor k in range(a, b + 1):\n    digits = []\n    m = k\n    while m > 0:\n        digits.append(m % 10)\n        m //= 10\n    if sum(x ** len(digits) for x in digits) == k:\n        out.append(str(k))\nprint(" ".join(out) if out else "none")\n',
        tests=['1 1', '1 9', '1 100000', '10 152', '153 153', '154 369', '371 371', '1000 9999', '10000 100000', '50000 60000', '95000 100000'],
    ),
    Problem(
        slug='goldbach', title='Two Primes Make an Even', level=3,
        statement='<p>Goldbach guessed in 1742 that every even number greater than 2 is the sum of two primes: 28 = 5 + 23, 100 = 3 + 97. Nobody has proved it yet, but it has been checked far beyond the numbers here. For each even number, split it into two primes <code>p + q</code> with <code>p ≤ q</code>, choosing the smallest possible <code>p</code>.</p>',
        input='<p>The first line holds <code>T</code>. Each of the next <code>T</code> lines holds an even integer <code>n</code>.</p>',
        output='<p>For each <code>n</code>, one line <code>n = p + q</code>.</p>',
        constraints='<p>1 ≤ T ≤ 20; 4 ≤ n ≤ 1 000 000, n is even</p>',
        examples=[('3\n4\n28\n100\n', '4 = 2 + 2\n28 = 5 + 23\n100 = 3 + 97\n')],
        hint='<p>Write a helper <code>def is_prime(x):</code> that tries divisors up to the square root. Then try <code>p = 2, 3, 4, …</code> and stop at the first <code>p</code> where both <code>p</code> and <code>n − p</code> are prime.</p>',
        solution='def is_prime(x):\n    if x < 2:\n        return False\n    d = 2\n    while d * d <= x:\n        if x % d == 0:\n            return False\n        d += 1\n    return True\n\nt = int(input())\nfor _ in range(t):\n    n = int(input())\n    p = 2\n    while not (is_prime(p) and is_prime(n - p)):\n        p += 1\n    print(f"{n} = {p} + {n - p}")\n',
        alt='LIMIT = 1000001\nsieve = bytearray([1]) * LIMIT\nsieve[0] = sieve[1] = 0\nfor i in range(2, 1001):\n    if sieve[i]:\n        sieve[i * i::i] = bytearray(len(range(i * i, LIMIT, i)))\nt = int(input())\nfor _ in range(t):\n    n = int(input())\n    for p in range(2, n // 2 + 1):\n        if sieve[p] and sieve[n - p]:\n            print(n, "=", p, "+", n - p)\n            break\n',
        tests=lambda r: ['1\n4\n', '1\n6\n', '1\n8\n', lines(3, 1000000, 999998, 999996), lines(5, 10, 12, 14, 16, 18), lines(20, *range(980000, 980040, 2))] + [
            (lambda k: lines(k, *[2 * r.randint(2, 500000) for _ in range(k)]))(20) for _ in range(4)],
    ),
    Problem(
        slug='collatz-champion', title='Longest 3n + 1 Walk', level=3,
        statement='<p>Use the rule from <em>The 3n + 1 Walk</em>: an even number is halved and an odd number <code>n</code> becomes <code>3n + 1</code>, until you reach 1. Which starting number from 1 to <code>n</code> takes the most steps? If there is a tie, choose the smallest such start.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>One line with two integers: the best starting number and its number of steps.</p>',
        constraints='<p>1 ≤ n ≤ 3000</p>',
        examples=[('10\n', '9 19\n'), ('1\n', '1 0\n')],
        hint='<p>Put a loop around your step-counting code: for every start from 1 to <code>n</code>, count its steps, and keep the best so far. Use a strict <code>&gt;</code> so that the smallest start wins a tie.</p>',
        solution='n = int(input())\nbest_start, best_steps = 1, 0\nfor start in range(1, n + 1):\n    x = start\n    steps = 0\n    while x != 1:\n        if x % 2 == 0:\n            x //= 2\n        else:\n            x = 3 * x + 1\n        steps += 1\n    if steps > best_steps:\n        best_start, best_steps = start, steps\nprint(best_start, best_steps)\n',
        alt='n = int(input())\nsteps = [0] * (n + 1)\nfor s in range(2, n + 1):\n    x, c = s, 0\n    while x >= s:\n        x = x // 2 if x % 2 == 0 else 3 * x + 1\n        c += 1\n    steps[s] = c + steps[x]\nbest = max(steps[1:])\nprint(steps.index(best, 1), best)\n',
        tests=['1', '2', '3', '6', '7', '10', '26', '27', '100', '1000', '2463', '3000'],
    ),
    Problem(
        slug='hollow-diamond', title='Hollow Diamond', level=3,
        statement='<p>Draw the outline of a diamond with stars. The diamond has <code>2n − 1</code> rows; its widest row, in the middle, is <code>2n − 1</code> characters wide. Only the border is drawn: each row has a star at its left edge and one at its right edge (the top and bottom rows have just one star).</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p><code>2n − 1</code> lines forming the hollow diamond, as in the examples.</p>',
        constraints='<p>1 ≤ n ≤ 30</p>',
        examples=[('3\n', '  *\n * *\n*   *\n * *\n  *\n'), ('1\n', '*\n')],
        hint='<p>Treat the top half (rows 1 to <code>n</code>) and the bottom half separately — the bottom half is the top half backwards without its last row. For row <code>i</code> of the top: <code>n − i</code> spaces, a star, and — if <code>i &gt; 1</code> — <code>2i − 3</code> spaces and another star.</p>',
        solution='n = int(input())\nrows = []\nfor i in range(1, n + 1):\n    if i == 1:\n        rows.append(" " * (n - 1) + "*")\n    else:\n        rows.append(" " * (n - i) + "*" + " " * (2 * i - 3) + "*")\nfor row in rows + rows[-2::-1]:\n    print(row)\n',
        alt='n = int(input())\nsize = 2 * n - 1\nc = n - 1\nfor r in range(size):\n    k = abs(r - c)          # distance from the middle row\n    line = ""\n    for col in range(size):\n        line += "*" if abs(col - c) == c - k else " "\n    print(line.rstrip())\n',
        tests=['1', '2', '3', '4', '5', '7', '10', '16', '25', '30'],
    ),
    Problem(
        slug='palindrome-pyramid', title='Palindrome Pyramid', level=3,
        statement='<p>Build a centred pyramid of digits in which every row reads the same forwards and backwards: row <code>i</code> counts up from 1 to <code>i</code> and back down to 1, with no spaces between the digits.</p>',
        input='<p>One integer <code>n</code>, the number of rows.</p>',
        output='<p><code>n</code> lines. Row <code>i</code> is <code>n − i</code> spaces followed by the digits <code>1 2 … i … 2 1</code> written together.</p>',
        constraints='<p>1 ≤ n ≤ 9</p>',
        examples=[('4\n', '   1\n  121\n 12321\n1234321\n')],
        hint='<p>Build the row in two parts with loops (or <code>join</code>): the rising part <code>1…i</code> and the falling part <code>i−1…1</code>. Don\'t forget the spaces in front.</p>',
        solution='n = int(input())\nfor i in range(1, n + 1):\n    up = "".join(str(k) for k in range(1, i + 1))\n    down = "".join(str(k) for k in range(i - 1, 0, -1))\n    print(" " * (n - i) + up + down)\n',
        alt='n = int(input())\nfor i in range(1, n + 1):\n    print(" " * (n - i) + str(int("1" * i) ** 2))\n',
        explanation='<p>A fun fact hides in the second solution: 1² = 1, 11² = 121, 111² = 12321, … up to 111111111² = 12345678987654321.</p>',
        tests=['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ),
    Problem(
        slug='month-calendar', title='Month Calendar', level=3,
        statement='<p>Print one month of a wall calendar. Weeks start on Monday. You are told how many days the month has and on which weekday it starts.</p>',
        input='<p>One line with two integers: <code>d</code>, the number of days in the month, and <code>w</code>, the weekday of the 1st (1 = Monday, 2 = Tuesday, …, 7 = Sunday).</p>',
        output='<p>First the header line <code>Mo Tu We Th Fr Sa Su</code>. Then one line per week. Each day number is right-aligned in width 2, and the seven columns are separated by single spaces, so each day lines up under its weekday. Before the 1st, the empty columns are blank (two spaces each). A new line starts after every Sunday; the last week simply ends after the last day.</p>',
        constraints='<p>28 ≤ d ≤ 31; 1 ≤ w ≤ 7</p>',
        examples=[('30 3\n', 'Mo Tu We Th Fr Sa Su\n       1  2  3  4  5\n 6  7  8  9 10 11 12\n13 14 15 16 17 18 19\n20 21 22 23 24 25 26\n27 28 29 30\n'),
                  ('28 1\n', 'Mo Tu We Th Fr Sa Su\n 1  2  3  4  5  6  7\n 8  9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28\n')],
        hint='<p>Keep track of the current column (1 to 7). Start by printing <code>w − 1</code> blank cells. For each day, print it with <code>f"{day:2d}"</code>; end the line when the column reaches 7, otherwise print a space after it.</p>',
        solution='d, w = map(int, input().split())\nprint("Mo Tu We Th Fr Sa Su")\ncells = ["  "] * (w - 1)\nfor day in range(1, d + 1):\n    cells.append(f"{day:2d}")\nfor i in range(0, len(cells), 7):\n    print(" ".join(cells[i:i + 7]))\n',
        alt='d, w = map(int, input().split())\nprint("Mo Tu We Th Fr Sa Su")\ncol = w\nline = "   " * (w - 1)\nfor day in range(1, d + 1):\n    line += str(day).rjust(2)\n    if col == 7 or day == d:\n        print(line)\n        line = ""\n        col = 1\n    else:\n        line += " "\n        col += 1\n',
        explanation='<p>When the month ends exactly on a Sunday, make sure you don\'t print an extra empty line — although a blank line at the very end is ignored by the judge, one in the middle would not be.</p>',
        tests=['28 1', '28 7', '29 7', '30 3', '30 6', '31 6', '31 7', '31 1', '29 4', '30 7', '31 5', '28 2'],
    ),
]
