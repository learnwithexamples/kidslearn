"""LearnCamp Class 2 — Lists and list applications."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools'))
from lc import Problem, lines, ints  # noqa: E402


def rl(r, n, lo, hi):
    """n random integers in [lo, hi]."""
    return [r.randint(lo, hi) for _ in range(n)]


def nl(xs):
    """The common input shape: n on one line, the n numbers on the next."""
    return lines(len(xs), ints(xs))


def lost_and_twice(r, n):
    """1..n shuffled, with one number replaced by another (so one is missing, one repeated)."""
    missing, twice = r.sample(range(1, n + 1), 2)
    p = [twice if v == missing else v for v in range(1, n + 1)]
    r.shuffle(p)
    return p


def gen_cmds(r, q):
    """Random valid commands for list-commands: `pop` only when the list is non-empty; ends with `show`."""
    a, ops = [], []
    for _ in range(q - 1):
        kind = r.choice(['add', 'add', 'front', 'pop', 'remove', 'remove', 'show'])
        if kind == 'pop' and not a:
            kind = 'add'
        x = r.randint(1, 12)
        if kind == 'add':
            a.append(x)
        elif kind == 'front':
            a.insert(0, x)
        elif kind == 'pop':
            a.pop()
        elif kind == 'remove' and x in a:
            a.remove(x)
        ops.append(kind if kind in ('pop', 'show') else f'{kind} {x}')
    return ops + ['show']


CLASS = dict(
    id=2,
    title='Lists and List Applications',
    blurb='Store many values in one list, then slice, change, sort, count, mark and add them up in clever ways.',
    summary='''
<p>One variable can only hold one value, but real problems are about <em>many</em> values: all the scores in a
class, every plot along a road, the heights of a row of plants. A <strong>list</strong> keeps them together, in
order, so you can come back to any of them by its position. This class teaches the list toolkit and the handful of
classic tricks built on top of it.</p>
<ul>
    <li>Making and reading lists, indexing from the front and from the back, and slicing out pieces.</li>
    <li>Changing a list: <code>append</code>, <code>insert</code>, <code>pop</code>, <code>remove</code>, and assigning to a position.</li>
    <li>Built-in helpers: <code>len</code>, <code>sum</code>, <code>min</code>, <code>max</code>, <code>in</code>, <code>count</code>, <code>index</code>, <code>sorted</code>.</li>
    <li>Walking through lists with <code>enumerate</code> and <code>zip</code>, and building new ones with list comprehensions.</li>
    <li>Lists as tables: counting how often each value appears, and marking which positions are taken.</li>
    <li>Prefix sums and difference arrays, which answer range questions and apply range updates quickly.</li>
</ul>''',
    tutorial=[
        dict(h='Making a list and reading from it', html='''
<p>A list is written with square brackets. Each item has a position called its <strong>index</strong>, and
indexes start at <strong>0</strong>. A negative index counts from the end: <code>a[-1]</code> is the last item,
<code>a[-2]</code> the one before it.</p>
<pre class="try">a = [10, 20, 30, 40, 50]
print(a[0], a[2])      # first item, third item
print(a[-1], a[-2])    # last item, second to last
print(len(a))          # how many items</pre>
<p>Most problems give you the numbers on one line. Turn that line straight into a list of integers:</p>
<pre class="try" data-input="5\\n8 3 5 1 9">n = int(input())
a = list(map(int, input().split()))
print(a)
print(a[n - 1])        # the last of the n numbers</pre>
<div class="lc-warn">Positions in a problem usually start at 1, but list indexes start at 0. The 3rd card is
<code>a[2]</code>. Asking for an index that does not exist, like <code>a[5]</code> in a list of 5, crashes
with <code>IndexError</code>.</div>'''),
        dict(h='Slicing: taking a piece of a list', html='''
<p><code>a[start:stop]</code> gives a new list from index <code>start</code> up to <em>but not including</em>
<code>stop</code>. Leave a side out to go all the way to that end. A third number is the step.</p>
<pre class="try">a = [1, 2, 3, 4, 5, 6, 7, 8]
print(a[2:5])     # indexes 2, 3, 4
print(a[:3])      # the first three
print(a[-3:])     # the last three
print(a[::2])     # every other item, starting at index 0
print(a[::-1])    # the whole list backwards</pre>
<div class="lc-tip">To take the 1-based positions <code>l</code> to <code>r</code> (inclusive), write
<code>a[l - 1:r]</code>. The stop index is not included, so it is <code>r</code>, not <code>r - 1</code>.</div>
<p>Slicing never crashes: if the range runs past the end you simply get fewer items. And because a slice is a
new list, <code>b = a[:]</code> is a quick way to make a copy.</p>'''),
        dict(h='Changing a list', html='''
<table>
<tr><th>You want</th><th>Write</th></tr>
<tr><td>change the item at index i</td><td><code>a[i] = x</code></td></tr>
<tr><td>add x at the end</td><td><code>a.append(x)</code></td></tr>
<tr><td>put x at index i (the rest shift right)</td><td><code>a.insert(i, x)</code></td></tr>
<tr><td>take off the last item (and get it)</td><td><code>a.pop()</code></td></tr>
<tr><td>take off the item at index i</td><td><code>a.pop(i)</code></td></tr>
<tr><td>delete the first x</td><td><code>a.remove(x)</code></td></tr>
</table>
<pre class="try">a = []
a.append(5)
a.append(7)
a.insert(0, 3)     # [3, 5, 7]
a[1] = 50          # [3, 50, 7]
last = a.pop()     # takes 7 off
a.remove(3)        # [50]
print(a, last)</pre>
<div class="lc-warn"><code>a.remove(x)</code> crashes if <code>x</code> is not in the list. Check with
<code>if x in a:</code> first.</div>'''),
        dict(h='Asking questions about a list', html='''
<pre class="try">a = [4, 9, 2, 9, 1]
print(len(a), sum(a), min(a), max(a))
print(9 in a, 5 in a)   # is it there?
print(a.count(9))       # how many 9s
print(a.index(9))       # index of the FIRST 9
print(sorted(a))        # a new sorted list; a is unchanged
print(sorted(a, reverse=True))
a.sort()                # sorts a itself
a.reverse()             # reverses a itself
print(a)</pre>
<div class="lc-key"><code>sorted(a)</code> <strong>returns</strong> a new list. <code>a.sort()</code>
<strong>changes</strong> <code>a</code> and returns <code>None</code>, so never write
<code>a = a.sort()</code>.</div>
<div class="lc-warn">Like <code>remove</code>, <code>a.index(x)</code> crashes when <code>x</code> is missing.
Test <code>x in a</code> before you ask where it is.</div>
<p>To print a list the way judges like it, numbers separated by single spaces, unpack it with a star:
<code>print(*a)</code>. An empty list then prints an empty line.</p>'''),
        dict(h='Walking through a list: enumerate and zip', html='''
<p>A plain <code>for x in a</code> gives the items. When you also need the position, use
<code>enumerate</code>; it hands you <code>(index, item)</code> pairs. Pass a start value to count from 1.</p>
<pre class="try">scores = [70, 95, 88]
for i, s in enumerate(scores, 1):
    print('student', i, 'scored', s)</pre>
<p>Two lists that line up position by position are called <strong>parallel lists</strong>: <code>names[i]</code>
belongs with <code>scores[i]</code>. <code>zip</code> walks through them together.</p>
<pre class="try" data-input="3\\nAmy 88\\nBen 95\\nCleo 72">n = int(input())
names, scores = [], []
for _ in range(n):
    name, s = input().split()
    names.append(name)
    scores.append(int(s))
best = scores.index(max(scores))
print(names[best])
for name, s in zip(names, scores):
    print(name, s + 5)       # everybody gets 5 bonus points</pre>'''),
        dict(h='List comprehensions', html='''
<p>A list comprehension builds a new list in one line: <em>what to keep</em>, <code>for</code> each item,
optionally <code>if</code> a condition holds.</p>
<pre class="try">a = [3, 8, 5, 2, 7, 6]
print([x * x for x in a])              # every square
print([x for x in a if x % 2 == 0])    # only the even ones
print([x for x in a if x != 5])        # everything except 5
print([i for i, x in enumerate(a) if x > 5])   # indexes of big ones
print([0] * 6)                         # six zeros</pre>
<p>Comprehensions also read input neatly, and <code>sum</code> works on them directly:</p>
<pre class="try" data-input="4 10 15 20 25">a = [int(t) for t in input().split()]
print(sum(1 for x in a if x >= 15))    # how many are at least 15</pre>
<div class="lc-tip">Removing every copy of a value with <code>remove</code> in a loop is slow and easy to get
wrong. <code>a = [x for x in a if x != v]</code> does it safely.</div>'''),
        dict(h='Lists as tables: counting and marking', html='''
<p>When the values are small whole numbers (scores 0–100, candidates 1–m, plots 0–n), use the <em>value</em>
as an index into a second list. <code>counts[v]</code> can say how often <code>v</code> appeared, and
<code>taken[p]</code> can say whether plot <code>p</code> is used.</p>
<pre class="try" data-input="8\\n90 85 90 100 85 90 70 100">n = int(input())
scores = list(map(int, input().split()))
counts = [0] * 101            # indexes 0..100
for s in scores:
    counts[s] += 1
for v in range(100, -1, -1):
    if counts[v] > 0:
        print(v, counts[v])</pre>
<p>Marking works the same way with <code>True</code>/<code>False</code>. Here trees are planted on plots of a
road; a plot planted twice still holds only one tree:</p>
<pre class="try">taken = [False] * 11          # plots 0..10
for l, r in [(2, 5), (4, 8)]:
    for p in range(l, r + 1):
        taken[p] = True
print(sum(taken))             # True counts as 1</pre>
<p>A "seen" table also removes duplicates while keeping the original order:</p>
<pre class="try">a = [3, 1, 3, 2, 1, 5]
seen, out = set(), []
for x in a:
    if x not in seen:
        seen.add(x)
        out.append(x)
print(*out)</pre>'''),
        dict(h='Prefix sums and range updates', html='''
<p>A <strong>prefix sum</strong> list stores running totals: <code>pre[i]</code> is the sum of the first
<code>i</code> numbers. Then the sum of positions <code>l..r</code> (1-based) is just
<code>pre[r] - pre[l - 1]</code>, with no loop at all.</p>
<pre class="try">a = [3, 1, 4, 1, 5, 9]
pre = [0]
for x in a:
    pre.append(pre[-1] + x)
print(pre)
l, r = 2, 5
print(pre[r] - pre[l - 1])     # 1 + 4 + 1 + 5</pre>
<p>The reverse trick is the <strong>difference array</strong>. To add <code>c</code> to every position
<code>l..r</code>, record <code>+c</code> at <code>l</code> and <code>-c</code> just after <code>r</code>. After all
the updates, one running total rebuilds every value.</p>
<pre class="try">n = 8
diff = [0] * (n + 2)
for l, r, c in [(1, 4, 2), (3, 8, 5)]:
    diff[l] += c
    diff[r + 1] -= c
value, out = 0, []
for i in range(1, n + 1):
    value += diff[i]
    out.append(value)
print(*out)</pre>
<div class="lc-key">With a loop, each range update costs as many steps as the range is long. With a difference
array each update costs two steps, which matters when there are thousands of long ranges.</div>'''),
    ],
)

# ── Problems ─────────────────────────────────────────────────────────────
PROBLEMS = [
    # ── Level 1 ──────────────────────────────────────────────────────────
    Problem(
        slug='reverse-order', title='Backwards', level=1,
        statement='<p>Read a list of integers and print it in reverse order.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The same <code>n</code> integers, last one first, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('5\n1 2 3 4 5\n', '5 4 3 2 1\n'), ('3\n-7 0 12\n', '12 0 -7\n')],
        hint='<p>A slice with step <code>-1</code> walks a list from the end to the start.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
print(*a[::-1])
''',
        tests=lambda r: [nl([42]), nl([1, 1]), nl([-1000, 1000])] + [nl(rl(r, r.randint(2, 100), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='card-lookup', title='Card Lookup', level=1,
        statement='<p>You hold <code>n</code> cards numbered 1 to <code>n</code>, and each card has an attack power. '
                  'Your friend asks about <code>m</code> cards by their numbers. For every question, say the attack power of that card.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. The second line holds the <code>n</code> attack powers, '
              'card 1 first. The third line holds the <code>m</code> card numbers being asked about.</p>',
        output='<p>One line with the <code>m</code> attack powers, in the order they were asked, separated by single spaces.</p>',
        constraints='<p>1 ≤ m ≤ n ≤ 100; 0 ≤ attack power ≤ 10000; every asked number is between 1 and n.</p>',
        examples=[('5 3\n8 3 5 1 9\n3 2 5\n', '5 3 9\n')],
        hint='<p>Card number <code>t</code> is stored at list index <code>t - 1</code>.</p>',
        solution=r'''
n, m = map(int, input().split())
power = list(map(int, input().split()))
asks = list(map(int, input().split()))
print(*[power[t - 1] for t in asks])
''',
        tests=lambda r: ['1 1\n7\n1\n', '3 3\n1 2 3\n3 2 1\n', '4 2\n0 10000 5 5\n2 2\n'] + [
            (lambda n, m: lines(f'{n} {m}', ints(rl(r, n, 0, 10000)), ints(rl(r, m, 1, n))))(n := r.randint(1, 100), r.randint(1, n))
            for _ in range(6)],
    ),
    Problem(
        slug='max-min-sum', title='Largest, Smallest, Total', level=1,
        statement='<p>Read a list of integers and report its largest value, its smallest value and the sum of all of them.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One line: the largest value, the smallest value and the sum, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −10000 and 10000.</p>',
        examples=[('5\n3 -1 4 1 5\n', '5 -1 12\n')],
        hint='<p>Python already has <code>max</code>, <code>min</code> and <code>sum</code> for lists.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
print(max(a), min(a), sum(a))
''',
        tests=lambda r: [nl([0]), nl([-5]), nl([7, 7, 7]), nl([-10000] * 3 + [10000])] + [nl(rl(r, r.randint(2, 100), -10000, 10000)) for _ in range(6)],
    ),
    Problem(
        slug='count-from-the-end', title='Counting From the End', level=1,
        statement='<p>Read a list of integers and a number <code>k</code>. Print the <code>k</code>-th number counted from the '
                  '<em>end</em> of the list: <code>k = 1</code> means the last number, <code>k = 2</code> the one before it, and so on.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers. The third line holds <code>k</code>.</p>',
        output='<p>One integer: the <code>k</code>-th number from the end.</p>',
        constraints='<p>1 ≤ k ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('5\n10 20 30 40 50\n2\n', '40\n'), ('3\n7 8 9\n3\n', '7\n')],
        hint='<p>Negative indexes count from the end of a list.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
k = int(input())
print(a[-k])
''',
        tests=lambda r: [lines(1, 5, 1), lines(2, '1 2', 1), lines(2, '1 2', 2)] + [
            (lambda a: lines(len(a), ints(a), r.randint(1, len(a))))(rl(r, r.randint(1, 100), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='how-many-times', title='How Many Times?', level=1,
        statement='<p>Read a list of integers and one more integer <code>x</code>. How many times does <code>x</code> appear in the list?</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers. The third line holds <code>x</code>.</p>',
        output='<p>One integer: the number of times <code>x</code> appears (possibly 0).</p>',
        constraints='<p>1 ≤ n ≤ 100; all numbers are between −100 and 100.</p>',
        examples=[('6\n1 2 1 3 1 2\n1\n', '3\n'), ('3\n4 5 6\n7\n', '0\n')],
        hint='<p>Lists have a method that counts a value for you.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
x = int(input())
print(a.count(x))
''',
        tests=lambda r: [lines(1, 5, 5), lines(1, 5, -5), lines(4, '2 2 2 2', 2)] + [
            lines(n := r.randint(1, 100), ints(rl(r, n, -5, 5)), r.randint(-6, 6)) for _ in range(6)],
    ),
    Problem(
        slug='slice-it', title='Slice It Out', level=1,
        statement='<p>Read a list of integers and two positions <code>a</code> and <code>b</code> (counted from 1). '
                  'Print the numbers from position <code>a</code> to position <code>b</code>, both included.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers. The third line holds <code>a</code> and <code>b</code>.</p>',
        output='<p>The numbers in positions <code>a</code> through <code>b</code>, in order, separated by single spaces.</p>',
        constraints='<p>1 ≤ a ≤ b ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('6\n5 8 2 9 4 7\n2 4\n', '8 2 9\n')],
        hint='<p>Position <code>a</code> is index <code>a - 1</code>. Remember that a slice stops <em>before</em> its end index.</p>',
        solution=r'''
n = int(input())
nums = list(map(int, input().split()))
a, b = map(int, input().split())
print(*nums[a - 1:b])
''',
        alt=r'''
n = int(input())
nums = input().split()
a, b = map(int, input().split())
out = []
for i in range(a, b + 1):
    out.append(nums[i - 1])
print(' '.join(out))
''',
        tests=lambda r: [lines(1, 3, '1 1'), lines(5, '1 2 3 4 5', '1 5'), lines(5, '1 2 3 4 5', '5 5'), lines(5, '1 2 3 4 5', '3 3')] + [
            (lambda n: (lambda a: lines(n, ints(rl(r, n, -1000, 1000)), f'{a} {r.randint(a, n)}'))(r.randint(1, n)))(r.randint(1, 100)) for _ in range(6)],
    ),
    Problem(
        slug='every-other-one', title='Every Other One', level=1,
        statement='<p>Read a list of integers. First print the numbers at the odd positions (1st, 3rd, 5th, …), '
                  'then the numbers at the even positions (2nd, 4th, …).</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>Two lines. The first holds the numbers at odd positions, the second the numbers at even positions, '
               'each in their original order and separated by single spaces. If there are no even positions (n = 1), the second line is empty.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('5\n9 8 7 6 5\n', '9 7 5\n8 6\n')],
        hint='<p>Positions 1, 3, 5, … are indexes 0, 2, 4, …. A slice can take a step.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
print(*a[::2])
print(*a[1::2])
''',
        alt=r'''
n = int(input())
a = input().split()
odd = [a[i] for i in range(n) if i % 2 == 0]
even = [a[i] for i in range(n) if i % 2 == 1]
print(' '.join(odd))
print(' '.join(even))
''',
        tests=lambda r: [nl([4]), nl([1, 2]), nl([1, 2, 3])] + [nl(rl(r, r.randint(1, 100), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='even-squares', title='Squares of the Even Ones', level=1,
        statement='<p>Read a list of integers. Print the square of every <strong>even</strong> number in the list, '
                  'in the order the numbers appear. If the list has no even numbers, print <code>none</code>.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The squares separated by single spaces, or the word <code>none</code>.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000. Negative numbers can be even too.</p>',
        examples=[('6\n1 2 3 4 5 6\n', '4 16 36\n'), ('2\n1 3\n', 'none\n')],
        hint='<p>A list comprehension with an <code>if</code> part builds the list in one line. Then check whether it came out empty.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
sq = [x * x for x in a if x % 2 == 0]
if sq:
    print(*sq)
else:
    print('none')
''',
        tests=lambda r: [nl([0]), nl([-2]), nl([-3, 5, 7]), nl([1000, -1000])] + [nl(rl(r, r.randint(1, 100), -1000, 1000)) for _ in range(5)] + [nl([2 * r.randint(-50, 50) + 1 for _ in range(20)])],
    ),
    Problem(
        slug='is-it-in-the-list', title='Is It in the List?', level=1,
        statement='<p>Read a list of integers, then a number of questions. Each question is an integer; answer whether it appears in the list.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers. The third line holds <code>q</code>, '
              'and the fourth line holds the <code>q</code> integers to look for.</p>',
        output='<p><code>q</code> lines, one per question: <code>YES</code> if the number is in the list, otherwise <code>NO</code>.</p>',
        constraints='<p>1 ≤ n, q ≤ 100; all numbers are between −100 and 100.</p>',
        examples=[('5\n3 9 4 1 7\n3\n4 5 7\n', 'YES\nNO\nYES\n')],
        hint='<p>The <code>in</code> operator answers "is this value somewhere in the list?"</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
q = int(input())
for x in map(int, input().split()):
    print('YES' if x in a else 'NO')
''',
        tests=lambda r: [lines(1, 0, 1, 0), lines(1, 0, 1, 1), lines(3, '1 2 3', 3, '-1 -2 -3')] + [
            lines(n := r.randint(1, 100), ints(rl(r, n, -30, 30)), q := r.randint(1, 100), ints(rl(r, q, -30, 30))) for _ in range(6)],
    ),
    Problem(
        slug='add-two-lists', title='Adding Two Lists', level=1,
        statement='<p>Two lists of the same length are given. Make a new list whose <code>i</code>-th number is the '
                  '<code>i</code>-th number of the first list plus the <code>i</code>-th number of the second list, and print it.</p>',
        input='<p>The first line holds <code>n</code>. The second and third lines each hold <code>n</code> integers.</p>',
        output='<p>The <code>n</code> sums on one line, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('3\n1 2 3\n10 20 30\n', '11 22 33\n')],
        hint='<p><code>zip(a, b)</code> gives you the matching pairs of two lists, one pair at a time.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
print(*[x + y for x, y in zip(a, b)])
''',
        tests=lambda r: [lines(1, 0, 0), lines(1, -1000, -1000), lines(2, '5 -5', '-5 5')] + [
            lines(n := r.randint(1, 100), ints(rl(r, n, -1000, 1000)), ints(rl(r, n, -1000, 1000))) for _ in range(6)],
    ),
    Problem(
        slug='sort-both-ways', title='Sort Both Ways', level=1,
        statement='<p>Read a list of integers and print it sorted from smallest to largest, and then from largest to smallest.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>Two lines: the numbers in increasing order, then in decreasing order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('5\n3 1 4 1 5\n', '1 1 3 4 5\n5 4 3 1 1\n')],
        hint='<p><code>sorted</code> takes an optional <code>reverse=True</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
print(*sorted(a))
print(*sorted(a, reverse=True))
''',
        tests=lambda r: [nl([1]), nl([2, 1]), nl([5, 5, 5]), nl([-3, 10, -3, 0])] + [nl(rl(r, r.randint(2, 100), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='biggest-and-where', title='The Biggest and Where It Is', level=1,
        statement='<p>Read a list of integers. Print the largest value and its position in the list (counting from 1). '
                  'If the largest value appears more than once, give the position of its first appearance.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One line: the largest value and its position, separated by a space.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('6\n4 9 2 9 1 3\n', '9 2\n')],
        hint='<p><code>a.index(v)</code> gives the index of the first <code>v</code>. Positions start at 1, indexes at 0.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
big = max(a)
print(big, a.index(big) + 1)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
best = 0
for i in range(1, n):
    if a[i] > a[best]:
        best = i
print(a[best], best + 1)
''',
        tests=lambda r: [nl([-5]), nl([3, 3, 3]), nl([1, 2, 3]), nl([-1, -2, -1])] + [nl(rl(r, r.randint(2, 100), -20, 20)) for _ in range(6)],
    ),
    Problem(
        slug='insert-at-position', title='Squeeze It In', level=1,
        statement='<p>Read a list of integers, then a position <code>p</code> and a number <code>x</code>. Insert <code>x</code> into the list so that it '
                  'becomes the <code>p</code>-th number (counting from 1); the numbers that were at position <code>p</code> and after move one place right. Print the new list.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers; the third line holds <code>p</code> and <code>x</code>.</p>',
        output='<p>The <code>n + 1</code> numbers of the new list, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; 1 ≤ p ≤ n + 1 (p = n + 1 means "at the end"); all numbers are between −1000 and 1000.</p>',
        examples=[('4\n10 20 30 40\n3 25\n', '10 20 25 30 40\n'), ('2\n1 2\n3 9\n', '1 2 9\n')],
        hint='<p><code>a.insert(i, x)</code> puts <code>x</code> at index <code>i</code>. Which index is position <code>p</code>?</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
p, x = map(int, input().split())
a.insert(p - 1, x)
print(*a)
''',
        alt=r'''
n = int(input())
a = input().split()
p, x = input().split()
p = int(p)
print(' '.join(a[:p - 1] + [x] + a[p - 1:]))
''',
        tests=lambda r: [lines(1, 5, '1 7'), lines(1, 5, '2 7'), lines(3, '1 2 3', '1 0')] + [
            lines(n := r.randint(1, 100), ints(rl(r, n, -1000, 1000)), f'{r.randint(1, n + 1)} {r.randint(-1000, 1000)}') for _ in range(6)],
    ),
    Problem(
        slug='remove-every-x', title='Get Rid of x', level=1,
        statement='<p>Read a list of integers and a number <code>x</code>. Remove <strong>every</strong> copy of <code>x</code> from the list and print what is left, '
                  'in the original order. If nothing is left, print <code>empty</code>.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers; the third line holds <code>x</code>.</p>',
        output='<p>The remaining numbers separated by single spaces, or <code>empty</code>.</p>',
        constraints='<p>1 ≤ n ≤ 100; all numbers are between −100 and 100.</p>',
        examples=[('7\n1 2 3 2 4 2 5\n2\n', '1 3 4 5\n'), ('3\n6 6 6\n6\n', 'empty\n')],
        hint='<p>Rather than deleting items one by one, build a new list that keeps only the numbers that are not <code>x</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
x = int(input())
left = [v for v in a if v != x]
print(*left if left else ['empty'])
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
x = int(input())
while x in a:
    a.remove(x)
if a:
    print(*a)
else:
    print('empty')
''',
        tests=lambda r: [lines(1, 4, 4), lines(1, 4, 5), lines(4, '2 2 3 2', 2), lines(4, '1 2 3 4', 9)] + [
            lines(n := r.randint(1, 100), ints(rl(r, n, -3, 3)), r.randint(-3, 3)) for _ in range(6)],
    ),
    Problem(
        slug='odds-then-evens', title='Odds, Then Evens', level=1,
        statement='<p>Read a list of non-negative integers. Print all the odd numbers on one line and all the even numbers on the next, '
                  'each group in the order the numbers appeared.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>Two lines: the odd numbers, then the even numbers, separated by single spaces. A group with no numbers is printed as an empty line.</p>',
        constraints='<p>1 ≤ n ≤ 100; 0 ≤ every number ≤ 1000.</p>',
        examples=[('6\n3 8 5 2 7 6\n', '3 5 7\n8 2 6\n'), ('2\n4 10\n', '\n4 10\n')],
        hint='<p>Two list comprehensions, one for each line. <code>print(*[])</code> prints an empty line.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
print(*[x for x in a if x % 2 == 1])
print(*[x for x in a if x % 2 == 0])
''',
        alt=r'''
n = int(input())
odd, even = [], []
for t in input().split():
    (odd if int(t) % 2 else even).append(t)
print(' '.join(odd))
print(' '.join(even))
''',
        tests=lambda r: [nl([0]), nl([1]), nl([1, 3, 5]), nl([2, 4, 6])] + [nl(rl(r, r.randint(1, 100), 0, 1000)) for _ in range(6)],
    ),

    # ── Level 2 ──────────────────────────────────────────────────────────
    Problem(
        slug='position-of-number', title='Where Is the Number?', level=2,
        statement='<p>The input holds several data sets. Each one is a list of integers and a number <code>m</code> to look for. '
                  'For each data set, print the index of the first place <code>m</code> appears in the list, '
                  'where the first number of the list has index <strong>0</strong>. If <code>m</code> is not in the list, print <code>No</code>.</p>',
        input='<p>Data sets follow one another until the end of the input. Each data set is three lines: <code>n</code>; '
              'then <code>n</code> integers; then <code>m</code>.</p>',
        output='<p>One line per data set: the index, or <code>No</code>.</p>',
        constraints='<p>1 ≤ n &lt; 20; at most 50 data sets; all numbers are between −1000 and 1000.</p>',
        examples=[('3\n4 5 6\n5\n4\n2 2 2 2\n2\n', '1\n0\n')],
        hint='<p>You do not know how many data sets there are. One safe way is to read <em>all</em> the words of the input with '
             '<code>sys.stdin.read().split()</code> and walk through them with an index: first <code>n</code>, then the next <code>n</code> words, then <code>m</code>.</p>',
        solution=r'''
import sys

data = list(map(int, sys.stdin.read().split()))
i = 0
while i < len(data):
    n = data[i]
    a = data[i + 1:i + 1 + n]
    m = data[i + 1 + n]
    i += n + 2
    print(a.index(m) if m in a else 'No')
''',
        alt=r'''
import sys
lines_ = [ln for ln in sys.stdin.read().splitlines() if ln.strip()]
for k in range(0, len(lines_), 3):
    a = list(map(int, lines_[k + 1].split()))
    m = int(lines_[k + 2])
    ans = 'No'
    for i, v in enumerate(a):
        if v == m:
            ans = i
            break
    print(ans)
''',
        tests=lambda r: [lines(1, 7, 7), lines(1, 7, 8), lines(3, '1 2 3', 3, 3, '1 2 3', 4)] + [
            ''.join((lambda n: lines(n, ints(rl(r, n, -5, 5)), r.randint(-6, 6)))(r.randint(1, 19)) for _ in range(r.randint(1, 50))) for _ in range(6)],
    ),
    Problem(
        slug='scores-below-average', title='Below Average', level=2,
        statement='<p>Each line of the input describes one group of students: how many there are, followed by their scores. '
                  'For each group, print every score that is <strong>strictly less</strong> than the group\'s average, keeping the order of the input.</p>',
        input='<p>Several lines, until the end of the input. Each line starts with <code>n</code>, followed by <code>n</code> integer scores.</p>',
        output='<p>One line per group: the below-average scores separated by single spaces. If no score is below the average, print an empty line.</p>',
        constraints='<p>1 ≤ n ≤ 100; 0 ≤ score ≤ 100; at most 50 lines.</p>',
        examples=[('3 40 50 60\n2 90 80\n5 10 10 90 80 80\n', '40\n80\n10 10\n',
                   'The averages are 50, 85 and 54.')],
        hint='<p>Loop over <code>sys.stdin</code> line by line. The first number on a line is the count; the rest are the scores. '
             'Work out the average first, then pick the scores below it.</p>',
        solution=r'''
import sys

for line in sys.stdin:
    nums = list(map(int, line.split()))
    if not nums:
        continue
    n = nums[0]
    scores = nums[1:n + 1]
    avg = sum(scores) / n
    print(*[s for s in scores if s < avg])
''',
        alt=r'''
import sys
for line in sys.stdin.read().splitlines():
    t = line.split()
    if not t:
        continue
    n = int(t[0])
    s = [int(x) for x in t[1:]]
    total = sum(s)
    print(' '.join(str(x) for x in s if x * n < total))
''',
        explanation='<p>When every score is the same, nothing is below the average and the line is empty. '
                    'Comparing <code>s * n &lt; total</code> avoids decimals altogether.</p>',
        tests=lambda r: ['1 50\n', '3 70 70 70\n2 0 100\n', '4 0 0 0 1\n'] + [
            lines(*[(lambda n: f'{n} ' + ints(rl(r, n, 0, 100)))(r.randint(1, 30)) for _ in range(r.randint(1, 15))]) for _ in range(5)] + [
            lines('100 ' + ints(rl(r, 100, 0, 100)), '100 ' + ints([100] * 99 + [99]))],
    ),
    Problem(
        slug='all-positions', title='Every Place It Appears', level=2,
        statement='<p>Read a list of integers and a number <code>x</code>. Print every position (counting from 1) where <code>x</code> appears. '
                  'If it does not appear at all, print <code>none</code>.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers; the third line holds <code>x</code>.</p>',
        output='<p>The positions in increasing order, separated by single spaces, or <code>none</code>.</p>',
        constraints='<p>1 ≤ n ≤ 100; all numbers are between −100 and 100.</p>',
        examples=[('8\n5 3 5 5 1 0 5 2\n5\n', '1 3 4 7\n'), ('2\n1 2\n3\n', 'none\n')],
        hint='<p><code>enumerate(a, 1)</code> gives you each number together with its position, starting the count at 1.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
x = int(input())
pos = [i for i, v in enumerate(a, 1) if v == x]
if pos:
    print(*pos)
else:
    print('none')
''',
        tests=lambda r: [lines(1, 0, 0), lines(1, 0, 1), lines(5, '9 9 9 9 9', 9)] + [
            lines(n := r.randint(1, 100), ints(rl(r, n, -4, 4)), r.randint(-5, 5)) for _ in range(6)],
    ),
    Problem(
        slug='running-total', title='Running Total', level=2,
        statement='<p>A piggy bank starts empty. Each day some money is put in or taken out. Print how much is in the bank at the end of each day.</p>',
        input='<p>The first line holds <code>n</code>, the number of days. The second line holds <code>n</code> integers: '
              'the change on each day (negative means money was taken out).</p>',
        output='<p>One line with <code>n</code> integers: the amount after day 1, after day 2, …, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; every change is between −1000 and 1000.</p>',
        examples=[('5\n1 2 3 4 5\n', '1 3 6 10 15\n'), ('3\n10 -4 -6\n', '10 6 0\n')],
        hint='<p>Keep one running total. Add today\'s change, then remember the total in a result list.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
total, out = 0, []
for x in a:
    total += x
    out.append(total)
print(*out)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
print(*[sum(a[:i + 1]) for i in range(n)])
''',
        tests=lambda r: [nl([0]), nl([-5]), nl([1000] * 100)] + [nl(rl(r, r.randint(1, 100), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='tree-planting', title='Planting Trees', level=2,
        statement='<p>Along a road there are plots at the integer positions <code>0, 1, 2, …, n</code>, and at first none of them has a tree. '
                  'Trees are planted <code>m</code> times. Each time, a tree is planted on every plot from <code>l</code> to <code>r</code> (both included) — '
                  'but a plot that already has a tree keeps just the one. After each planting, print how many plots have a tree.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>m</code>. Each of the next <code>m</code> lines holds <code>l</code> and <code>r</code>.</p>',
        output='<p><code>m</code> lines: the number of plots with a tree after each planting.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ m ≤ 1000; 0 ≤ l ≤ r ≤ n.</p>',
        examples=[('3\n2\n1 2\n0 1\n', '2\n3\n', 'Plots 1 and 2 get trees, then plot 0 is new and plot 1 already had one.')],
        hint='<p>Keep a list of <code>n + 1</code> marks, one per plot. When you mark a plot that was not marked yet, the count goes up by one.</p>',
        solution=r'''
n = int(input())
m = int(input())
planted = [False] * (n + 1)
count = 0
for _ in range(m):
    l, r = map(int, input().split())
    for p in range(l, r + 1):
        if not planted[p]:
            planted[p] = True
            count += 1
    print(count)
''',
        alt=r'''
import sys
data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
s = set()
for k in range(m):
    l, r = int(data[2 + 2 * k]), int(data[3 + 2 * k])
    s |= set(range(l, r + 1))
    print(len(s))
''',
        tests=lambda r: [lines(1, 1, '0 1'), lines(5, 3, '2 2', '2 2', '0 5'), lines(10, 2, '0 0', '10 10')] + [
            (lambda n, m: lines(n, m, *[(lambda a, b: f'{min(a, b)} {max(a, b)}')(r.randint(0, n), r.randint(0, n)) for _ in range(m)]))(r.choice([10, 100, 1000]), r.randint(1, 300))
            for _ in range(5)] + [lines(1000, 500, *[f'{r.randint(0, 50)} {r.randint(950, 1000)}' for _ in range(500)])],
    ),
    Problem(
        slug='plant-heights', title='Growing Plants', level=2,
        statement='<p>A row of <code>n</code> plants, numbered 1 to <code>n</code>, start at given heights. For <code>m</code> days the gardener '
                  'picks a stretch of the row and feeds it: on a day described by <code>a b c</code>, every plant from number <code>a</code> to number <code>b</code> '
                  '(both included) grows by <code>c</code>. Print the heights at the end.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds the <code>n</code> starting heights. '
              'The third line holds <code>m</code>; each of the next <code>m</code> lines holds <code>a b c</code>.</p>',
        output='<p>The <code>n</code> final heights on one line, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 100; 1 ≤ a ≤ b ≤ n; 1 ≤ c ≤ 1000; 1 ≤ starting height ≤ 100.</p>',
        examples=[('4\n1 2 3 4\n3\n1 2 1\n2 3 1\n4 4 1\n', '2 4 4 5\n')],
        hint='<p>Plant number <code>k</code> lives at index <code>k - 1</code>. For each day, loop over the plants in the stretch.</p>',
        solution=r'''
n = int(input())
h = list(map(int, input().split()))
m = int(input())
for _ in range(m):
    a, b, c = map(int, input().split())
    for k in range(a - 1, b):
        h[k] += c
print(*h)
''',
        alt=r'''
n = int(input())
h = list(map(int, input().split()))
m = int(input())
diff = [0] * (n + 2)
for _ in range(m):
    a, b, c = map(int, input().split())
    diff[a] += c
    diff[b + 1] -= c
run = 0
for i in range(1, n + 1):
    run += diff[i]
    h[i - 1] += run
print(*h)
''',
        tests=lambda r: [lines(1, 5, 1, '1 1 1000'), lines(3, '1 1 1', 2, '1 3 1', '1 3 1'), lines(5, '100 100 100 100 100', 1, '5 5 7')] + [
            (lambda n, m: lines(n, ints(rl(r, n, 1, 100)), m, *[(lambda a, b: f'{min(a, b)} {max(a, b)} {r.randint(1, 1000)}')(r.randint(1, n), r.randint(1, n)) for _ in range(m)]))(r.randint(1, 100), r.randint(1, 100))
            for _ in range(6)],
    ),
    Problem(
        slug='vote-counter', title='Counting the Votes', level=2,
        statement='<p>A class election has <code>m</code> candidates, numbered 1 to <code>m</code>. Every ballot names one candidate. '
                  'Count the votes for each candidate, then announce the winner: the candidate with the most votes. '
                  'If several candidates tie for the most, the one with the smallest number wins.</p>',
        input='<p>The first line holds <code>m</code> and <code>n</code> (the number of ballots). The second line holds the <code>n</code> ballots.</p>',
        output='<p>Two lines. The first lists the vote counts of candidates 1 to <code>m</code>, separated by single spaces. The second holds the winner\'s number.</p>',
        constraints='<p>1 ≤ m ≤ 50; 1 ≤ n ≤ 1000; every ballot is between 1 and m.</p>',
        examples=[('3 7\n1 3 3 2 3 1 1\n', '3 1 3\n1\n', 'Candidates 1 and 3 both have 3 votes; 1 has the smaller number.')],
        hint='<p>Make a list of zeros with one slot per candidate and add 1 to the right slot for each ballot. '
             '<code>max</code> finds the top count and <code>index</code> finds the first candidate who has it.</p>',
        solution=r'''
m, n = map(int, input().split())
votes = [0] * (m + 1)
for b in map(int, input().split()):
    votes[b] += 1
print(*votes[1:])
print(votes.index(max(votes)))
''',
        alt=r'''
m, n = map(int, input().split())
ballots = list(map(int, input().split()))
counts = [ballots.count(c) for c in range(1, m + 1)]
print(*counts)
best = 1
for c in range(2, m + 1):
    if counts[c - 1] > counts[best - 1]:
        best = c
print(best)
''',
        tests=lambda r: [lines('1 1', 1), lines('5 1', 5), lines('4 4', '4 3 2 1'), lines('3 6', '2 2 3 3 1 1')] + [
            (lambda m, n: lines(f'{m} {n}', ints(rl(r, n, 1, m))))(r.randint(1, 50), r.randint(1, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='score-frequency', title='Score Table', level=2,
        statement='<p>A test is marked out of 100. Given everybody\'s score, make a table: for every score that somebody got, '
                  'print the score and how many students got it, from the highest score down to the lowest.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> scores.</p>',
        output='<p>One line per different score, highest first: the score and how many students got it, separated by a space.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ score ≤ 100.</p>',
        examples=[('7\n90 85 90 100 85 90 70\n', '100 1\n90 3\n85 2\n70 1\n')],
        hint='<p>A list of 101 counters, <code>counts[0]</code> to <code>counts[100]</code>, can hold the whole table. '
             'Then walk the scores from 100 down to 0 and print only the ones with a count above zero.</p>',
        solution=r'''
n = int(input())
counts = [0] * 101
for s in map(int, input().split()):
    counts[s] += 1
for s in range(100, -1, -1):
    if counts[s]:
        print(s, counts[s])
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
for s in sorted(set(a), reverse=True):
    print(s, a.count(s))
''',
        tests=lambda r: [nl([0]), nl([100]), nl([0, 100, 0, 100]), nl(list(range(101)))] + [nl(rl(r, r.randint(1, 1000), lo, 100)) for lo in (0, 60, 90, 0, 0)] + [nl(rl(r, 1000, 0, 100))],
    ),
    Problem(
        slug='first-repeat', title='Seen It Before', level=2,
        statement='<p>Read a list of integers from left to right. Which number is the first one you meet <em>for the second time</em>? '
                  'Print it, or print <code>none</code> if every number is different.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The first number that repeats, or <code>none</code>.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 1000.</p>',
        examples=[('7\n4 2 7 2 4 7 1\n', '2\n', 'Reading left to right, the second 2 (position 4) comes before the second 4 (position 5).'),
                  ('3\n1 2 3\n', 'none\n')],
        hint='<p>Keep a list of 1001 marks, one per possible value. Before marking a number, check whether its mark is already set.</p>',
        solution=r'''
n = int(input())
seen = [False] * 1001
answer = 'none'
for x in map(int, input().split()):
    if seen[x]:
        answer = x
        break
    seen[x] = True
print(answer)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
best = None
for j in range(n):
    if a[j] in a[:j]:
        best = a[j]
        break
print('none' if best is None else best)
''',
        tests=lambda r: [nl([5]), nl([5, 5]), nl([0, 1, 0]), nl(list(range(1001))[:900])] + [nl(rl(r, r.randint(2, 60), 0, k)) for k in (20, 100, 1000, 300)] + [
            nl(r.sample(range(1001), 500) + [r.randint(0, 1000)]), nl(rl(r, 300, 0, 50))],
    ),
    Problem(
        slug='second-largest', title='Runner-Up', level=2,
        statement='<p>Find the second largest <strong>different</strong> value in a list. For example, in <code>7 3 9 9 4</code> the largest value is 9 and the runner-up is 7 '
                  '(the second 9 does not count, because it is the same value). If all the numbers are equal, there is no runner-up: print <code>none</code>.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The second largest different value, or <code>none</code>.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('5\n7 3 9 9 4\n', '7\n'), ('3\n5 5 5\n', 'none\n')],
        hint='<p>Find the largest value first. Then look for the largest value among the numbers that are <em>smaller</em> than it — there might not be any.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
top = max(a)
rest = [x for x in a if x < top]
print(max(rest) if rest else 'none')
''',
        alt=r'''
n = int(input())
a = sorted(set(map(int, input().split())))
print(a[-2] if len(a) >= 2 else 'none')
''',
        tests=lambda r: [nl([8]), nl([1, 2]), nl([2, 1]), nl([-1000, -1000, 1000]), nl([4, 4, 4, 3])] + [nl(rl(r, r.randint(2, 100), -1000, 1000)) for _ in range(4)] + [nl(rl(r, 30, 0, 2))],
    ),
    Problem(
        slug='no-duplicates', title='No Duplicates', level=2,
        statement='<p>Remove repeated numbers from a list: keep only the <strong>first</strong> time each number appears, and keep those in their original order.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The numbers left, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; every number is between −1000 and 1000.</p>',
        examples=[('8\n3 1 3 2 1 5 2 3\n', '3 1 2 5\n')],
        hint='<p>Build the answer list as you go. Add a number only if it is not already in the answer (or in a "seen" set).</p>',
        explanation='<p><code>sorted(set(a))</code> is <em>not</em> the answer: a set forgets the order, and sorting changes it.</p>',
        solution=r'''
n = int(input())
seen, out = set(), []
for x in map(int, input().split()):
    if x not in seen:
        seen.add(x)
        out.append(x)
print(*out)
''',
        alt=r'''
n = int(input())
a = input().split()
out = []
for x in a:
    if x not in out:
        out.append(x)
print(' '.join(out))
''',
        tests=lambda r: [nl([7]), nl([7, 7, 7]), nl([-1, 1, -1, 1]), nl([5, 4, 3, 2, 1])] + [nl(rl(r, r.randint(2, 1000), -k, k)) for k in (3, 20, 1000, 50, 200, 1000)],
    ),
    Problem(
        slug='rotate-right', title='Rotate the Row', level=2,
        statement='<p>A row of numbers is rotated to the right <code>k</code> times. In one rotation, the last number jumps to the front and everything else moves one place right. '
                  'Print the row after all <code>k</code> rotations.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers; the third line holds <code>k</code>.</p>',
        output='<p>The rotated row, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; 0 ≤ k ≤ 1 000 000 000; every number is between −1000 and 1000.</p>',
        examples=[('5\n1 2 3 4 5\n2\n', '4 5 1 2 3\n'), ('5\n1 2 3 4 5\n7\n', '4 5 1 2 3\n')],
        hint='<p><code>k</code> can be huge, but rotating <code>n</code> times brings the row back to where it started. '
             'After that, two slices glue the answer together.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
k = int(input()) % n
print(*(a[n - k:] + a[:n - k]))
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
k = int(input()) % n
for _ in range(k):
    a.insert(0, a.pop())
print(*a)
''',
        tests=lambda r: [lines(1, 9, 1000000000), lines(3, '1 2 3', 0), lines(3, '1 2 3', 3), lines(4, '1 2 3 4', 1), lines(4, '1 2 3 4', 999999999)] + [
            lines(n := r.randint(1, 100), ints(rl(r, n, -1000, 1000)), r.choice([r.randint(0, 200), r.randint(0, 10**9)])) for _ in range(5)],
    ),
    Problem(
        slug='merge-sorted-lists', title='Merging Two Sorted Lists', level=2,
        statement='<p>Two lists are each already sorted from smallest to largest. Combine them into one sorted list.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds the first list. The third line holds <code>m</code>; the fourth line holds the second list.</p>',
        output='<p>All <code>n + m</code> numbers in non-decreasing order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 500; every number is between −10000 and 10000; both lists are sorted.</p>',
        examples=[('3\n1 4 9\n4\n2 4 5 10\n', '1 2 4 4 5 9 10\n')],
        hint='<p>Try doing it the classic way: keep one finger on each list, and repeatedly take the smaller of the two numbers under your fingers. '
             'When one list runs out, the rest of the other list goes on the end.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = list(map(int, input().split()))
i = j = 0
out = []
while i < n and j < m:
    if a[i] <= b[j]:
        out.append(a[i])
        i += 1
    else:
        out.append(b[j])
        j += 1
out += a[i:] + b[j:]
print(*out)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = list(map(int, input().split()))
print(*sorted(a + b))
''',
        tests=lambda r: [lines(1, 5, 1, 5), lines(1, 9, 3, '1 2 3'), lines(3, '1 2 3', 1, -4), lines(2, '1 2', 2, '3 4')] + [
            (lambda n, m: lines(n, ints(sorted(rl(r, n, -10000, 10000))), m, ints(sorted(rl(r, m, -10000, 10000)))))(r.randint(1, 400), r.randint(1, 400)) for _ in range(5)] + [
            lines(5, '1 1 1 1 1', 5, '1 1 1 1 1')],
    ),
    Problem(
        slug='list-commands', title='List Commander', level=2,
        statement='<p>Start with an empty list and carry out a series of commands:</p>'
                  '<ul><li><code>add x</code> — put <code>x</code> at the end;</li>'
                  '<li><code>front x</code> — put <code>x</code> at the very front;</li>'
                  '<li><code>pop</code> — take away the last number (the list is never empty when this happens);</li>'
                  '<li><code>remove x</code> — take away the first <code>x</code> in the list; if there is no <code>x</code>, do nothing;</li>'
                  '<li><code>show</code> — print the list.</li></ul>',
        input='<p>The first line holds <code>q</code>, the number of commands. Each of the next <code>q</code> lines holds one command.</p>',
        output='<p>For every <code>show</code>, one line with the list\'s numbers separated by single spaces, or <code>empty</code> if the list is empty.</p>',
        constraints='<p>1 ≤ q ≤ 300; every x is between 1 and 100.</p>',
        examples=[('7\nadd 5\nadd 7\nfront 3\nshow\nremove 5\npop\nshow\n', '3 5 7\n3\n')],
        hint='<p>Split each command line. The first word says which list method to use: <code>append</code>, <code>insert(0, …)</code>, <code>pop</code>, or <code>remove</code> '
             '(but only after checking with <code>in</code>).</p>',
        solution=r'''
q = int(input())
a = []
for _ in range(q):
    cmd = input().split()
    if cmd[0] == 'add':
        a.append(int(cmd[1]))
    elif cmd[0] == 'front':
        a.insert(0, int(cmd[1]))
    elif cmd[0] == 'pop':
        a.pop()
    elif cmd[0] == 'remove':
        x = int(cmd[1])
        if x in a:
            a.remove(x)
    else:
        print(*a if a else ['empty'])
''',
        alt=r'''
import sys
cmds = sys.stdin.read().splitlines()[1:]
a = []
for c in cmds:
    w = c.split()
    if not w:
        continue
    if w[0] == 'add':
        a = a + [w[1]]
    elif w[0] == 'front':
        a = [w[1]] + a
    elif w[0] == 'pop':
        a = a[:-1]
    elif w[0] == 'remove':
        for i in range(len(a)):
            if a[i] == w[1]:
                a = a[:i] + a[i + 1:]
                break
    else:
        print(' '.join(a) if a else 'empty')
''',
        tests=lambda r: [lines(1, 'show'), lines(3, 'add 1', 'pop', 'show'), lines(4, 'remove 3', 'add 3', 'remove 3', 'show'), lines(5, 'add 2', 'add 2', 'front 2', 'remove 2', 'show')] + [
            (lambda ops: lines(len(ops), *ops))(gen_cmds(r, r.randint(5, 300))) for _ in range(6)],
    ),
    Problem(
        slug='best-and-worst-student', title='Top and Bottom of the Class', level=2,
        statement='<p>You get each student\'s name and score. Print the student with the highest score and the student with the lowest score. '
                  'If several students share the highest (or lowest) score, choose the one who comes first in the input.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds a name (one word) and an integer score.</p>',
        output='<p>Two lines: the top student\'s name and score, then the bottom student\'s name and score, each separated by a space.</p>',
        constraints='<p>1 ≤ n ≤ 100; 0 ≤ score ≤ 100; names are made of letters.</p>',
        examples=[('4\nAmy 88\nBen 95\nCleo 72\nDan 95\n', 'Ben 95\nCleo 72\n')],
        hint='<p>Keep two parallel lists, <code>names</code> and <code>scores</code>. The index of the best score in <code>scores</code> is also the index of the right name in <code>names</code>.</p>',
        solution=r'''
n = int(input())
names, scores = [], []
for _ in range(n):
    name, s = input().split()
    names.append(name)
    scores.append(int(s))
hi = scores.index(max(scores))
lo = scores.index(min(scores))
print(names[hi], scores[hi])
print(names[lo], scores[lo])
''',
        alt=r'''
n = int(input())
rows = [input().split() for _ in range(n)]
best = worst = rows[0]
for row in rows[1:]:
    if int(row[1]) > int(best[1]):
        best = row
    if int(row[1]) < int(worst[1]):
        worst = row
print(*best)
print(*worst)
''',
        tests=lambda r: [lines(1, 'Zoe 50'), lines(3, 'A 7', 'B 7', 'C 7'), lines(2, 'Max 0', 'Min 100')] + [
            (lambda n: lines(n, *[f'{nm}{i} {r.randint(0, 100)}' for i, nm in enumerate(r.choices(['Amy', 'Ben', 'Cleo', 'Dan', 'Eva', 'Finn', 'Gus'], k=n))]))(r.randint(2, 100))
            for _ in range(6)],
    ),
    Problem(
        slug='swap-min-max', title='Swap the Smallest and the Largest', level=2,
        statement='<p>In a list of integers, swap the smallest number and the largest number, and print the list. '
                  'If the smallest or the largest value appears several times, use its first appearance. (If all numbers are equal, the list does not change.)</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The list after the swap, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('5\n3 9 1 7 9\n', '3 1 9 7 9\n')],
        hint='<p>Find the <em>index</em> of the first minimum and of the first maximum, then swap the two positions: <code>a[i], a[j] = a[j], a[i]</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
i, j = a.index(min(a)), a.index(max(a))
a[i], a[j] = a[j], a[i]
print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
lo = hi = 0
for k in range(n):
    if a[k] < a[lo]:
        lo = k
    if a[k] > a[hi]:
        hi = k
lo_v, hi_v = a[lo], a[hi]
a[lo] = hi_v
a[hi] = lo_v
print(*a)
''',
        tests=lambda r: [nl([5]), nl([2, 2]), nl([1, 2]), nl([2, 1]), nl([4, 4, 1, 1, 9, 9])] + [nl(rl(r, r.randint(2, 100), -k, k)) for k in (3, 1000, 10, 1000, 5)],
    ),
    Problem(
        slug='judges-average', title='Fair Judging', level=2,
        statement='<p>In a contest, <code>n</code> judges each give a score. To be fair, one highest score and one lowest score are thrown away '
                  '(only one copy of each, even if there are ties). The final score is the average of the scores that remain.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> integer scores.</p>',
        output='<p>The final score with exactly two digits after the decimal point, for example with <code>f"{x:.2f}"</code>.</p>',
        constraints='<p>3 ≤ n ≤ 20; 0 ≤ score ≤ 100.</p>',
        examples=[('5\n8 9 6 10 7\n', '8.00\n'), ('4\n90 85 85 100\n', '87.50\n')],
        hint='<p>Remove one copy of <code>max</code> and one copy of <code>min</code> with <code>remove</code>, or sort the list and slice off both ends.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
a.remove(max(a))
a.remove(min(a))
print(f'{sum(a) / len(a):.2f}')
''',
        alt=r'''
n = int(input())
a = sorted(map(int, input().split()))
mid = a[1:-1]
print(f'{sum(mid) / (n - 2):.2f}')
''',
        tests=lambda r: [nl([1, 2, 3]), nl([5, 5, 5]), nl([0, 100, 100, 0]), nl([100] * 20), nl([1, 2, 2, 2, 3, 3, 3, 4])] + [nl(rl(r, r.randint(3, 20), 0, 100)) for _ in range(5)],
    ),
    Problem(
        slug='reverse-a-segment', title='Flip a Section', level=2,
        statement='<p>Read a list of integers and two positions <code>l</code> and <code>r</code> (counted from 1). Reverse only the part of the list from position <code>l</code> '
                  'to position <code>r</code> (both included), and print the whole list.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers; the third line holds <code>l</code> and <code>r</code>.</p>',
        output='<p>The changed list, separated by single spaces.</p>',
        constraints='<p>1 ≤ l ≤ r ≤ n ≤ 100; every number is between −1000 and 1000.</p>',
        examples=[('6\n1 2 3 4 5 6\n2 5\n', '1 5 4 3 2 6\n')],
        hint='<p>Cut the list into three slices — before, middle, after — and reverse only the middle one. You can also assign to a slice: <code>a[i:j] = …</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
l, r = map(int, input().split())
a[l - 1:r] = a[l - 1:r][::-1]
print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
l, r = map(int, input().split())
i, j = l - 1, r - 1
while i < j:
    a[i], a[j] = a[j], a[i]
    i += 1
    j -= 1
print(*a)
''',
        tests=lambda r: [lines(1, 4, '1 1'), lines(2, '1 2', '1 2'), lines(5, '1 2 3 4 5', '1 5'), lines(5, '1 2 3 4 5', '3 3')] + [
            (lambda n: (lambda l: lines(n, ints(rl(r, n, -1000, 1000)), f'{l} {r.randint(l, n)}'))(r.randint(1, n)))(r.randint(1, 100)) for _ in range(6)],
    ),
    Problem(
        slug='common-elements', title='In Both Lists', level=2,
        statement='<p>Given two lists A and B, print the numbers of A that also appear somewhere in B. Keep the order in which they appear in A, '
                  'and print each number only once (at its first appearance in A). If there are none, print <code>none</code>.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds list A. The third line holds <code>m</code>; the fourth line holds list B.</p>',
        output='<p>The common numbers separated by single spaces, or <code>none</code>.</p>',
        constraints='<p>1 ≤ n, m ≤ 300; all numbers are between −1000 and 1000.</p>',
        examples=[('6\n4 1 7 4 9 2\n5\n9 4 3 4 8\n', '4 9\n'), ('2\n1 2\n2\n3 4\n', 'none\n')],
        hint='<p>Walk through A. Keep a number if it is <code>in</code> B and not yet in your answer.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = set(map(int, input().split()))
out = []
for x in a:
    if x in b and x not in out:
        out.append(x)
print(*out if out else ['none'])
''',
        alt=r'''
n = int(input())
a = input().split()
m = int(input())
b = input().split()
out = []
for i, x in enumerate(a):
    if x in b and x not in a[:i]:
        out.append(x)
print(' '.join(out) if out else 'none')
''',
        tests=lambda r: [lines(1, 5, 1, 5), lines(1, 5, 1, 6), lines(4, '3 3 3 3', 2, '3 3'), lines(3, '1 2 3', 3, '3 2 1')] + [
            (lambda n, m, k: lines(n, ints(rl(r, n, -k, k)), m, ints(rl(r, m, -k, k))))(r.randint(1, 300), r.randint(1, 300), r.choice([10, 50, 1000])) for _ in range(6)],
    ),
    Problem(
        slug='light-switches', title='Light Switches', level=2,
        statement='<p>A hallway has <code>n</code> lamps numbered 1 to <code>n</code>, all switched off. Then <code>m</code> people walk by, one after another. '
                  'Person number <code>i</code> flips the switch of every lamp whose number is a multiple of <code>i</code> (on becomes off, off becomes on). '
                  'Which lamps are on at the end?</p>',
        input='<p>One line with <code>n</code> and <code>m</code>.</p>',
        output='<p>The numbers of the lamps that are on, in increasing order, separated by single spaces.</p>',
        constraints='<p>1 ≤ m ≤ n ≤ 1000.</p>',
        examples=[('5 3\n', '1 5\n', 'Person 1 turns all five on; person 2 turns off 2 and 4; person 3 turns off 3.')],
        hint='<p>Keep a list of <code>n + 1</code> True/False values. Person <code>i</code> visits lamps <code>i, 2i, 3i, …</code> — <code>range(i, n + 1, i)</code> lists them.</p>',
        solution=r'''
n, m = map(int, input().split())
on = [False] * (n + 1)
for i in range(1, m + 1):
    for lamp in range(i, n + 1, i):
        on[lamp] = not on[lamp]
print(*[k for k in range(1, n + 1) if on[k]])
''',
        alt=r'''
n, m = map(int, input().split())
out = []
for k in range(1, n + 1):
    flips = sum(1 for i in range(1, m + 1) if k % i == 0)
    if flips % 2 == 1:
        out.append(k)
print(*out)
''',
        explanation='<p>Lamp 1 is flipped only by person 1, so at least one lamp is always on.</p>',
        tests=['1 1', '2 2', '10 1', '10 10', '100 100', '1000 1000', '1000 1', '999 500', '37 20', '500 499'],
    ),
    Problem(
        slug='prefix-sum-queries', title='Quick Totals', level=2,
        statement='<p>Read a list of integers, then answer many questions of the form "what is the sum of the numbers from position <code>l</code> to position <code>r</code>?" '
                  '(positions count from 1, both ends included).</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers. The third line holds <code>q</code>; '
              'each of the next <code>q</code> lines holds <code>l</code> and <code>r</code>.</p>',
        output='<p><code>q</code> lines, one sum per question.</p>',
        constraints='<p>1 ≤ n, q ≤ 1000; 1 ≤ l ≤ r ≤ n; every number is between −1000 and 1000.</p>',
        examples=[('5\n3 1 4 1 5\n3\n1 3\n2 5\n4 4\n', '8\n11\n1\n')],
        hint='<p>Build the running totals once: <code>pre[0] = 0</code> and <code>pre[i] = pre[i-1] + a[i]</code>. Then each question is one subtraction.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
pre = [0]
for x in a:
    pre.append(pre[-1] + x)
q = int(input())
for _ in range(q):
    l, r = map(int, input().split())
    print(pre[r] - pre[l - 1])
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
q = int(input())
for _ in range(q):
    l, r = map(int, input().split())
    print(sum(a[l - 1:r]))
''',
        tests=lambda r: [lines(1, 7, 1, '1 1'), lines(3, '-1 -2 -3', 2, '1 3', '2 2')] + [
            (lambda n, q: lines(n, ints(rl(r, n, -1000, 1000)), q, *[(lambda a, b: f'{min(a, b)} {max(a, b)}')(r.randint(1, n), r.randint(1, n)) for _ in range(q)]))(r.randint(1, 300), r.randint(1, 350))
            for _ in range(6)] + [lines(1000, ints(rl(r, 1000, 0, 9)), 200, *[f'1 {r.randint(900, 1000)}' for _ in range(200)])],
    ),
    Problem(
        slug='longest-rising-run', title='Longest Climb', level=2,
        statement='<p>A hiker writes down the height every hour. A <em>climb</em> is a stretch of consecutive readings in which each reading is strictly higher than the one before. '
                  'How long is the longest climb (counted in readings)? A single reading on its own is a climb of length 1.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One integer: the length of the longest climb.</p>',
        constraints='<p>1 ≤ n ≤ 1000; every number is between 0 and 10000.</p>',
        examples=[('8\n1 2 2 3 4 5 1 2\n', '4\n', 'The climb is 2 3 4 5. The two 2s next to each other break the climb, since equal is not higher.')],
        hint='<p>Walk through the list keeping the length of the current climb: if this reading beats the previous one, the climb grows by 1; otherwise a new climb of length 1 starts.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
best = cur = 1
for i in range(1, n):
    if a[i] > a[i - 1]:
        cur += 1
    else:
        cur = 1
    best = max(best, cur)
print(best)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
best = 1
for i in range(n):
    j = i
    while j + 1 < n and a[j + 1] > a[j]:
        j += 1
    best = max(best, j - i + 1)
print(best)
''',
        tests=lambda r: [nl([5]), nl([1, 2]), nl([2, 1]), nl([3, 3, 3]), nl(list(range(1000))), nl(list(range(500, 0, -1)))] + [nl(rl(r, r.randint(2, 1000), 0, k)) for k in (3, 10000, 20, 100)],
    ),
    Problem(
        slug='missing-and-repeated', title='One Lost, One Twice', level=2,
        statement='<p>The numbers 1 to <code>n</code> were supposed to be written down once each. By mistake, one number was written twice and another number was left out. '
                  'Find both.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> numbers as they were written.</p>',
        output='<p>One line: the number written twice, then the missing number, separated by a space.</p>',
        constraints='<p>2 ≤ n ≤ 1000. Exactly one number appears twice and exactly one is missing.</p>',
        examples=[('5\n3 1 3 5 2\n', '3 4\n')],
        hint='<p>Count how many times each number 1..n appears, in a list of counters. One count is 2 and one is 0.</p>',
        solution=r'''
n = int(input())
counts = [0] * (n + 1)
for x in map(int, input().split()):
    counts[x] += 1
print(counts.index(2), counts.index(0, 1))
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
twice = sum(a) - sum(set(a))
missing = n * (n + 1) // 2 - sum(set(a))
print(twice, missing)
''',
        tests=lambda r: ['2\n1 1\n', '2\n2 2\n', '3\n3 3 1\n'] + [
            nl(lost_and_twice(r, r.randint(3, n))) for n in (10, 50, 1000, 1000, 300, 5, 800)],
    ),

    # ── Level 3 ──────────────────────────────────────────────────────────
    Problem(
        slug='riffle-shuffle', title='The Perfect Shuffle', level=3,
        statement='<p>A deck has <code>2n</code> cards numbered 1 to <code>2n</code> from top to bottom. A <em>perfect shuffle</em> cuts the deck into the top half '
                  '(cards in positions 1..n) and the bottom half (positions n+1..2n), then interleaves them exactly: first card of the top half, first card of the bottom half, '
                  'second of the top, second of the bottom, and so on. For a deck of 8 cards, <code>1 2 3 4 5 6 7 8</code> becomes <code>1 5 2 6 3 7 4 8</code>.</p>'
                  '<p>Print the deck after one perfect shuffle, and then how many perfect shuffles in a row it takes to get the deck back to <code>1 2 … 2n</code>.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>Two lines: the deck after one shuffle (separated by single spaces), and the number of shuffles needed to restore the order.</p>',
        constraints='<p>1 ≤ n ≤ 100.</p>',
        examples=[('4\n', '1 5 2 6 3 7 4 8\n3\n')],
        hint='<p>Write a function that takes a deck (a list) and returns the shuffled deck — <code>zip</code> of the two halves helps. '
             'Then keep shuffling and counting until the deck equals the starting list.</p>',
        solution=r'''
def shuffle(deck):
    half = len(deck) // 2
    out = []
    for x, y in zip(deck[:half], deck[half:]):
        out.append(x)
        out.append(y)
    return out


n = int(input())
start = list(range(1, 2 * n + 1))
deck = shuffle(start)
print(*deck)
count = 1
while deck != start:
    deck = shuffle(deck)
    count += 1
print(count)
''',
        alt=r'''
n = int(input())
m = 2 * n
deck = [0] * m
for i in range(m):
    if i % 2 == 0:
        deck[i] = i // 2 + 1
    else:
        deck[i] = n + i // 2 + 1
print(*deck)
# follow where position 2 goes: card at index i moves to index (2*i) mod (m-1)
if m <= 2:
    print(1)
else:
    k, p = 1, 2 % (m - 1)
    while p != 1:
        p = p * 2 % (m - 1)
        k += 1
    print(k)
''',
        tests=['1', '2', '3', '5', '7', '10', '26', '50', '64', '99', '100'],
    ),
    Problem(
        slug='balance-point', title='The Balance Point', level=3,
        statement='<p>Find the first position <code>i</code> (counting from 1) in a list where the sum of all numbers <em>to the left</em> of position <code>i</code> equals the sum of all numbers '
                  '<em>to the right</em> of it. The number at position <code>i</code> itself belongs to neither side, and an empty side has sum 0. If there is no such position, print <code>none</code>.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The first balance position, or <code>none</code>.</p>',
        constraints='<p>1 ≤ n ≤ 1000; every number is between −1000 and 1000.</p>',
        examples=[('6\n1 7 3 6 5 6\n', '4\n', 'Left of position 4: 1 + 7 + 3 = 11. Right of it: 5 + 6 = 11.'),
                  ('3\n1 2 3\n', 'none\n')],
        hint='<p>You do not need to add up both sides from scratch each time. Keep the left sum as you walk; the right sum is <code>total − left − a[i]</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
total = sum(a)
left = 0
answer = 'none'
for i, x in enumerate(a, 1):
    if left == total - left - x:
        answer = i
        break
    left += x
print(answer)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
ans = 'none'
for i in range(n):
    if sum(a[:i]) == sum(a[i + 1:]):
        ans = i + 1
        break
print(ans)
''',
        tests=lambda r: [nl([5]), nl([0, 0]), nl([1, -1]), nl([2, 1, -1]), nl([1, 2, 1]), nl([-1, -1, -1, 0, 1, 1])] + [
            nl(rl(r, r.randint(2, 30), -3, 3)) for _ in range(3)] + [
            (lambda a: nl(a + [r.randint(-1000, 1000)] + [sum(a)] + [0] * r.randint(0, 3)))(rl(r, 400, -1000, 1000)), nl(rl(r, 1000, -1000, 1000))],
    ),
    Problem(
        slug='out-of-order-pairs', title='Out-of-Order Pairs', level=3,
        statement='<p>A pair of positions <code>i &lt; j</code> in a list is <em>out of order</em> if the number at <code>i</code> is <strong>strictly greater</strong> than the number at <code>j</code>. '
                  'Count the out-of-order pairs. (A sorted list has none; the more mixed up the list, the more there are.)</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One integer: the number of out-of-order pairs.</p>',
        constraints='<p>1 ≤ n ≤ 500; every number is between 0 and 1000.</p>',
        examples=[('5\n3 1 4 1 5\n', '3\n', 'The pairs are (3, 1), (3, the second 1) and (4, the second 1). The two 1s are equal, so they do not count.')],
        hint='<p>Two nested loops: for each position <code>i</code>, look at every later position <code>j</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
count = 0
for i in range(n):
    for j in range(i + 1, n):
        if a[i] > a[j]:
            count += 1
print(count)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
seen = [0] * 1001          # how many of each value we have seen so far
count = 0
for x in a:
    count += sum(seen[x + 1:])
    seen[x] += 1
print(count)
''',
        tests=lambda r: [nl([1]), nl([1, 2]), nl([2, 1]), nl([7, 7, 7]), nl(list(range(500, 0, -1))), nl(list(range(500)))] + [nl(rl(r, r.randint(2, 500), 0, k)) for k in (5, 1000, 1000, 50)],
    ),
    Problem(
        slug='best-k-window', title='Best Stretch of k Days', level=3,
        statement='<p>A shop records its profit for <code>n</code> days (it can be negative). Find the <code>k</code> consecutive days with the largest total profit. '
                  'Print that total and the day (counting from 1) the stretch starts. If several stretches tie, give the earliest one.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds the <code>n</code> daily profits.</p>',
        output='<p>One line: the largest total and its starting day, separated by a space.</p>',
        constraints='<p>1 ≤ k ≤ n ≤ 1000; every profit is between −1000 and 1000.</p>',
        examples=[('7 3\n2 -1 4 3 -2 5 1\n', '6 2\n', 'The stretches total 5, 6, 5, 6 and 4. The first 6 starts on day 2.')],
        hint='<p>Sliding window: when the window moves one day right, add the day that enters and subtract the day that leaves, instead of adding all <code>k</code> days again.</p>',
        solution=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
cur = sum(a[:k])
best, start = cur, 1
for i in range(k, n):
    cur += a[i] - a[i - k]
    if cur > best:
        best, start = cur, i - k + 2
print(best, start)
''',
        alt=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
sums = [sum(a[i:i + k]) for i in range(n - k + 1)]
best = max(sums)
print(best, sums.index(best) + 1)
''',
        tests=lambda r: [lines('1 1', 5), lines('3 3', '1 2 3'), lines('4 1', '-5 -2 -2 -9'), lines('4 2', '0 0 0 0')] + [
            (lambda n: lines(f'{n} {r.randint(1, n)}', ints(rl(r, n, -1000, 1000))))(r.randint(1, 1000)) for _ in range(5)] + [lines('1000 500', ints(rl(r, 1000, -3, 3)))],
    ),
    Problem(
        slug='next-greater', title='Who Is Taller Next?', level=3,
        statement='<p>Children stand in a line, and you know their heights. For each child, find the first child standing <em>after</em> them (to their right) who is '
                  '<strong>strictly taller</strong>, and print that child\'s height. If nobody to the right is taller, print <code>-1</code> for that child.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> heights, from the front of the line to the back.</p>',
        output='<p>One line with <code>n</code> integers separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ height ≤ 300.</p>',
        examples=[('6\n2 7 3 5 4 6\n', '7 -1 5 6 6 -1\n')],
        hint='<p>For each child, scan to the right and stop at the first taller one. (There is also a faster way: walk from the <em>back</em> of the line and keep a list of '
             'children who could still be the answer for someone.)</p>',
        solution=r'''
n = int(input())
h = list(map(int, input().split()))
ans = [-1] * n
stack = []                 # heights to the right that could still be an answer, tallest at the bottom
for i in range(n - 1, -1, -1):
    while stack and stack[-1] <= h[i]:
        stack.pop()
    if stack:
        ans[i] = stack[-1]
    stack.append(h[i])
print(*ans)
''',
        alt=r'''
n = int(input())
h = list(map(int, input().split()))
out = []
for i in range(n):
    found = -1
    for j in range(i + 1, n):
        if h[j] > h[i]:
            found = h[j]
            break
    out.append(found)
print(*out)
''',
        tests=lambda r: [nl([5]), nl([1, 2]), nl([2, 1]), nl([4, 4, 4]), nl(list(range(1, 301))), nl(list(range(300, 0, -1)))] + [nl(rl(r, r.randint(2, 1000), 1, k)) for k in (300, 5, 300, 50)],
    ),
    Problem(
        slug='rank-of-scores', title='Ranking the Class', level=3,
        statement='<p>For each student, work out their rank: 1 plus the number of students who scored <strong>strictly higher</strong>. Students with equal scores share a rank. '
                  'For example, the scores <code>90 75 90 100</code> get the ranks <code>2 4 2 1</code>.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> scores.</p>',
        output='<p>One line with each student\'s rank, in the same order as the input, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ score ≤ 100.</p>',
        examples=[('6\n90 75 90 100 60 75\n', '2 4 2 1 6 4\n')],
        hint='<p>Count how many students got each score (a list of 101 counters). Then, going from 100 down to 0, you can work out for every score how many students beat it.</p>',
        solution=r'''
n = int(input())
s = list(map(int, input().split()))
counts = [0] * 101
for x in s:
    counts[x] += 1
higher = [0] * 101         # higher[v] = how many scored more than v
above = 0
for v in range(100, -1, -1):
    higher[v] = above
    above += counts[v]
print(*[higher[x] + 1 for x in s])
''',
        alt=r'''
n = int(input())
s = list(map(int, input().split()))
print(*[1 + sum(1 for y in s if y > x) for x in s])
''',
        tests=lambda r: [nl([50]), nl([0, 100]), nl([70, 70, 70]), nl(list(range(101)))] + [nl(rl(r, r.randint(2, 1000), lo, 100)) for lo in (0, 0, 90, 50)] + [nl(rl(r, 1000, 0, 100)), nl(rl(r, 1000, 99, 100))],
    ),
    Problem(
        slug='max-subarray-sum', title='The Luckiest Stretch', level=3,
        statement='<p>A game is played for <code>n</code> rounds, and each round you win or lose some points. Choose a stretch of one or more <em>consecutive</em> rounds '
                  'with the largest possible total. Print that total.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> integer scores.</p>',
        output='<p>One integer: the largest total of a non-empty stretch of consecutive rounds.</p>',
        constraints='<p>1 ≤ n ≤ 1000; every score is between −1000 and 1000.</p>',
        examples=[('9\n-2 1 -3 4 -1 2 1 -5 4\n', '6\n', 'The best stretch is 4 −1 2 1.'), ('3\n-5 -2 -9\n', '-2\n')],
        hint='<p>Prefix sums turn "total of a stretch" into "a later prefix minus an earlier prefix". For each end point, which earlier prefix should you subtract? '
             'Keep track of the smallest prefix seen so far.</p>',
        explanation='<p>If every score is negative, the answer is the largest single score — the stretch cannot be empty.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
best = a[0]
pre = 0
low = 0                    # the smallest prefix sum before the current position
for x in a:
    pre += x
    best = max(best, pre - low)
    low = min(low, pre)
print(best)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
best = a[0]
for i in range(n):
    s = 0
    for j in range(i, n):
        s += a[j]
        if s > best:
            best = s
print(best)
''',
        tests=lambda r: [nl([7]), nl([-7]), nl([-3, -1, -2]), nl([1, 2, 3]), nl([5, -10, 5]), nl([0, 0, 0])] + [nl(rl(r, r.randint(2, 1000), -1000, 1000)) for _ in range(3)] + [nl(rl(r, 800, -10, 8))],
    ),
    Problem(
        slug='subarrays-with-sum-k', title='Stretches That Hit the Target', level=3,
        statement='<p>Count how many stretches of one or more <em>consecutive</em> numbers in a list add up to exactly <code>k</code>. '
                  'Stretches that start or end at different positions count as different, even if they hold the same numbers.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One integer: the number of stretches whose sum is <code>k</code>.</p>',
        constraints='<p>1 ≤ n ≤ 300; numbers are between −10 and 10; −100 ≤ k ≤ 100.</p>',
        examples=[('5 3\n1 2 1 2 1\n', '4\n', 'They are 1 2, 2 1, 1 2 and 2 1, starting at positions 1, 2, 3 and 4.'),
                  ('3 0\n0 0 0\n', '6\n')],
        hint='<p>Build prefix sums <code>pre</code> with <code>pre[0] = 0</code>. The stretch from position <code>i+1</code> to <code>j</code> adds up to <code>pre[j] − pre[i]</code>. Try every pair <code>i &lt; j</code>.</p>',
        solution=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
pre = [0]
for x in a:
    pre.append(pre[-1] + x)
count = 0
for i in range(n):
    for j in range(i + 1, n + 1):
        if pre[j] - pre[i] == k:
            count += 1
print(count)
''',
        alt=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
seen = {0: 1}
pre = 0
count = 0
for x in a:
    pre += x
    count += seen.get(pre - k, 0)
    seen[pre] = seen.get(pre, 0) + 1
print(count)
''',
        tests=lambda r: [lines('1 5', 5), lines('1 5', 4), lines('4 -2', '-1 -1 -1 -1'), lines('300 0', ints([0] * 300))] + [
            lines(f'{n} {r.randint(-10, 10)}', ints(rl(r, n, -m, m))) for n, m in ((50, 3), (300, 10), (300, 2), (100, 5), (300, 1))] + [
            lines('300 100', ints(rl(r, 300, 0, 10)))],
    ),
    Problem(
        slug='fair-candy-packs', title='Fair Candy Packs', level=3,
        statement='<p>There are <code>n</code> packs of candy, each with some number of candies. You must give one pack to each of <code>k</code> friends. '
                  'To be as fair as possible, choose the <code>k</code> packs so that the difference between the biggest and the smallest chosen pack is as small as possible. '
                  'Print that smallest difference.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds the <code>n</code> pack sizes.</p>',
        output='<p>One integer: the smallest possible difference.</p>',
        constraints='<p>1 ≤ k ≤ n ≤ 1000; 1 ≤ pack size ≤ 100000.</p>',
        examples=[('7 3\n7 3 2 4 9 12 56\n', '2\n', 'Choose the packs 2, 3 and 4.')],
        hint='<p>Sort the packs first. In the best choice, the chosen packs sit next to each other in sorted order — so you only need to check windows of <code>k</code> neighbours.</p>',
        solution=r'''
n, k = map(int, input().split())
a = sorted(map(int, input().split()))
print(min(a[i + k - 1] - a[i] for i in range(n - k + 1)))
''',
        alt=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
best = None
for i in range(n):
    # use pack i as the smallest; take the k-1 smallest packs that are not smaller
    rest = sorted(a[j] for j in range(n) if j != i and a[j] >= a[i])
    if len(rest) >= k - 1:
        top = rest[k - 2] if k > 1 else a[i]
        if best is None or top - a[i] < best:
            best = top - a[i]
print(best)
''',
        tests=lambda r: [lines('1 1', 5), lines('2 2', '1 100000'), lines('5 1', '9 3 7 1 5'), lines('4 3', '5 5 5 1')] + [
            (lambda n: lines(f'{n} {r.randint(1, n)}', ints(rl(r, n, 1, 100000))))(r.randint(2, 300)) for _ in range(4)] + [
            lines('1000 10', ints(rl(r, 1000, 1, 100000))), lines('500 250', ints(rl(r, 500, 1, 1000)))],
    ),
    Problem(
        slug='is-it-a-rotation', title='Is It a Rotation?', level=3,
        statement='<p>Rotating a list to the right once moves its last number to the front. You are given two lists A and B of the same length. '
                  'Find the smallest number of right rotations (0 or more) that turns A into B, or print <code>NO</code> if no number of rotations does.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds list A; the third line holds list B.</p>',
        output='<p>The smallest number of right rotations, or <code>NO</code>.</p>',
        constraints='<p>1 ≤ n ≤ 200; all numbers are between 0 and 9.</p>',
        examples=[('5\n1 2 3 4 5\n4 5 1 2 3\n', '2\n'), ('3\n1 2 3\n1 3 2\n', 'NO\n')],
        hint='<p>Rotating right <code>k</code> times gives <code>A[n-k:] + A[:n-k]</code>. Try every <code>k</code> from 0 up to <code>n − 1</code>; more than that just repeats.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
answer = 'NO'
for k in range(n):
    if a[n - k:] + a[:n - k] == b:
        answer = k
        break
print(answer)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
ans = 'NO'
for k in range(n):
    ok = True
    for i in range(n):
        if a[i] != b[(i + k) % n]:
            ok = False
            break
    if ok:
        ans = k
        break
print(ans)
''',
        tests=lambda r: [lines(1, 4, 4), lines(1, 4, 5), lines(4, '1 1 1 1', '1 1 1 1'), lines(4, '1 2 1 2', '2 1 2 1'), lines(3, '1 2 3', '3 2 1')] + [
            (lambda a: lines(len(a), ints(a), ints((lambda k: a[len(a) - k:] + a[:len(a) - k])(r.randrange(len(a))))))(rl(r, r.randint(2, 200), 0, 2)) for _ in range(3)] + [
            (lambda a: lines(len(a), ints(a), ints(sorted(a))))(rl(r, 150, 0, 9)), (lambda a: lines(200, ints(a), ints(a[7:] + a[:7])))(rl(r, 200, 0, 9))],
    ),
    Problem(
        slug='counting-off', title='Counting Off in a Circle', level=3,
        statement='<p><code>n</code> children, numbered 1 to <code>n</code>, stand in a circle. Starting with child 1, they count 1, 2, 3, … around the circle, '
                  'and the child who says <code>k</code> leaves. The next child starts again from 1, and so on, until everyone has left. Print the order in which the children leave.</p>',
        input='<p>One line with <code>n</code> and <code>k</code>.</p>',
        output='<p>The numbers of the children in the order they leave, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 200; 1 ≤ k ≤ 1000.</p>',
        examples=[('7 3\n', '3 6 2 7 5 1 4\n')],
        hint='<p>Keep the children still in the circle in a list, and the index of the child who will say "1". The child who says <code>k</code> is <code>k − 1</code> places further on, '
             'wrapping around with <code>%</code>. After <code>pop</code>, the next child slides into that same index.</p>',
        solution=r'''
n, k = map(int, input().split())
circle = list(range(1, n + 1))
i = 0
out = []
while circle:
    i = (i + k - 1) % len(circle)
    out.append(circle.pop(i))
print(*out)
''',
        alt=r'''
n, k = map(int, input().split())
alive = [True] * (n + 1)
out = []
pos = 0          # last child who spoke (0 = nobody yet)
for _ in range(n):
    said = 0
    while said < k:
        pos = pos % n + 1
        if alive[pos]:
            said += 1
    alive[pos] = False
    out.append(pos)
print(*out)
''',
        tests=['1 1', '1 5', '2 1', '2 2', '5 1', '5 5', '10 3', '41 3', '200 1000', '200 7', '150 2', '13 13'],
    ),
    Problem(
        slug='festival-lanterns', title='Festival Lanterns', level=3,
        statement='<p>A street has <code>n</code> houses, numbered 1 to <code>n</code>, and at first no lanterns. For a festival, <code>m</code> groups of volunteers come by. '
                  'A group described by <code>l r c</code> hangs <code>c</code> lanterns on <em>every</em> house from <code>l</code> to <code>r</code> (both included). '
                  'At the end, what is the largest number of lanterns on a single house, and how many houses have exactly that many?</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>m</code> lines holds <code>l r c</code>.</p>',
        output='<p>One line: the largest number of lanterns on one house, and how many houses have that many, separated by a space.</p>',
        constraints='<p>1 ≤ n ≤ 200000; 1 ≤ m ≤ 300; 1 ≤ l ≤ r ≤ n; 1 ≤ c ≤ 1000.</p>',
        examples=[('10 3\n1 5 2\n4 8 3\n6 10 1\n', '5 2\n', 'Houses 1–3 get 2, houses 4–5 get 5, houses 6–8 get 4 and houses 9–10 get 1.')],
        hint='<p>The street can be very long and every group can cover most of it, so adding to every house one by one may be too slow. '
             'Use a difference array: each group changes only two entries, and one running total at the end gives every house\'s count.</p>',
        solution=r'''
import sys

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
diff = [0] * (n + 2)
for g in range(m):
    l, r, c = int(data[2 + 3 * g]), int(data[3 + 3 * g]), int(data[4 + 3 * g])
    diff[l] += c
    diff[r + 1] -= c
best = count = cur = 0
for i in range(1, n + 1):
    cur += diff[i]
    if cur > best:
        best, count = cur, 1
    elif cur == best:
        count += 1
print(best, count)
''',
        alt=r'''
n, m = map(int, input().split())
ev = {}
for _ in range(m):
    l, r, c = map(int, input().split())
    ev[l] = ev.get(l, 0) + c
    ev[r + 1] = ev.get(r + 1, 0) - c
pts = sorted(ev)
cur = best = cnt = 0
for i, p in enumerate(pts):
    if p > n:
        break
    cur += ev[p]
    nxt = pts[i + 1] if i + 1 < len(pts) else n + 1
    length = min(nxt, n + 1) - p
    if cur > best:
        best, cnt = cur, length
    elif cur == best:
        cnt += length
print(best, cnt)
''',
        explanation='<p>With up to 300 groups each covering up to 200000 houses, the one-by-one loop can take 60 million steps; '
                    'the difference array needs about 200000.</p>',
        tests=lambda r: [lines('1 1', '1 1 5'), lines('5 2', '1 2 3', '4 5 3'), lines('5 2', '1 3 1', '3 5 1'), lines('200000 1', '1 200000 1000')] + [
            (lambda n, m: lines(f'{n} {m}', *[(lambda a, b: f'{min(a, b)} {max(a, b)} {r.randint(1, 1000)}')(r.randint(1, n), r.randint(1, n)) for _ in range(m)]))(n, m)
            for n, m in ((20, 10), (1000, 100), (200000, 300), (200000, 300), (150000, 250))] + [
            lines('200000 300', *[f'{r.randint(1, 100)} {r.randint(199900, 200000)} {r.randint(1, 3)}' for _ in range(300)])],
    ),
]
