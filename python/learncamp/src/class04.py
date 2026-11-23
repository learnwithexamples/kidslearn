"""LearnCamp Class 4 — Bubble sort and selection sort."""
import string
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


def nk(xs, k):
    """n and k on the first line, the n numbers on the next."""
    return lines(f'{len(xs)} {k}', ints(xs))


def sort_tests(r, lo, hi, big=600):
    """Edge cases plus random lists for a plain 'sort these numbers' problem."""
    return [nl([lo]), nl([hi, lo]), nl([7] * 9), nl(list(range(1, 41))), nl(list(range(50, 0, -1))),
            nl(sorted(rl(r, 30, lo, hi))[::-1]), nl(rl(r, 12, lo, hi)), nl(rl(r, 100, lo, hi)),
            nl(rl(r, big, lo, hi)), nl(rl(r, big, lo, lo + 5)), nl(sorted(rl(r, big, lo, hi), reverse=True))]


def word(r, lo=1, hi=8, letters=string.ascii_lowercase):
    return ''.join(r.choice(letters) for _ in range(r.randint(lo, hi)))


def nearly_sorted(r, n, swaps):
    a = list(range(1, n + 1))
    for _ in range(swaps):
        i = r.randrange(n - 1)
        a[i], a[i + 1] = a[i + 1], a[i]
    return a


CLASS = dict(
    id=4,
    title='Bubble Sort & Selection Sort',
    blurb='Put a list in order by hand: swap neighbours until the big ones bubble up, or pick the smallest again and again.',
    summary='''
<p>Python can sort a list in one line, so why learn to do it yourself? Because the two oldest sorting methods,
<strong>bubble sort</strong> and <strong>selection sort</strong>, are the clearest way to see how an algorithm
turns a messy list into an ordered one, one small step at a time, and how to count and compare the work it does.
Once you know how they move numbers around, you can predict exactly what the list looks like after every step,
bend them to sort in any order you like, and know when the built-in tools are the better choice.</p>
<ul>
    <li>Bubble sort: compare neighbours, swap them when they are out of order, and repeat pass after pass.</li>
    <li>Stopping early when a pass makes no swaps, and why the number of swaps equals the number of
        out-of-order pairs.</li>
    <li>Selection sort: find the smallest of the part that is not sorted yet and swap it to the front.</li>
    <li>Counting comparisons and swaps, and what <em>stable</em> means.</li>
    <li>Sorting from largest to smallest and by a <em>key</em>: a second number, a total, a length, a digit sum.</li>
    <li>Python's <code>sorted()</code> and <code>.sort()</code> with <code>key=</code> and <code>reverse=</code>.</li>
</ul>''',
    tutorial=[
        dict(h='Why put things in order?', html='''
<p>Sorted data is easy data. Once a list is in order, many questions become simple:</p>
<ul>
    <li>The smallest is at the front, the largest at the back, and the <strong>median</strong> sits in the middle.</li>
    <li>The 3rd smallest is just <code>a[2]</code>; the top three scores are the last three.</li>
    <li>Equal values end up next to each other, so repeats are easy to count or remove.</li>
    <li>The two closest numbers are always <em>neighbours</em> in the sorted list.</li>
</ul>
<pre class="try" data-input="7\\n31 7 18 7 42 25 12">n = int(input())
a = list(map(int, input().split()))
a.sort()
print(a)
print('smallest', a[0], 'largest', a[-1], 'median', a[n // 2])</pre>
<p>In this class you will write the sorting yourself, so you understand what happens inside that one line.</p>'''),
        dict(h='Bubble sort, step by step', html='''
<p>Bubble sort only ever looks at two <strong>neighbours</strong>. Walk along the list comparing
<code>a[j]</code> with <code>a[j + 1]</code>; whenever the left one is bigger, swap them. One walk from the
front to the back is called a <strong>pass</strong>. During a pass the biggest number gets picked up and carried
all the way to the end, like a bubble rising to the top of a glass.</p>
<p>Here is the first pass on <code>5 1 4 2 8</code>:</p>
<table>
<tr><th>Compare</th><th>Swap?</th><th>List afterwards</th></tr>
<tr><td>5 and 1</td><td>yes</td><td>1 5 4 2 8</td></tr>
<tr><td>5 and 4</td><td>yes</td><td>1 4 5 2 8</td></tr>
<tr><td>5 and 2</td><td>yes</td><td>1 4 2 5 8</td></tr>
<tr><td>5 and 8</td><td>no</td><td>1 4 2 5 8</td></tr>
</table>
<p>After pass 1 the largest number, 8, is in its final place. After pass 2 the second largest is too, and so on.
So pass <code>i</code> (counting from 0) only needs to look at the first <code>n − i</code> numbers, and
<code>n − 1</code> passes are always enough.</p>
<pre class="try" data-input="5\\n5 1 4 2 8">n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):                 # pass number i
    for j in range(n - 1 - i):         # neighbours j and j + 1
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
    print('after pass', i + 1, ':', *a)
print(*a)</pre>
<div class="lc-key"><code>a[j], a[j + 1] = a[j + 1], a[j]</code> swaps two items in one line. Python works out
the right side first, then fills in the left side.</div>
<div class="lc-warn">The inner loop stops at <code>n − 1 − i</code>, not <code>n − i</code>: it reads
<code>a[j + 1]</code>, and the last valid index is <code>n − 1</code>.</div>'''),
        dict(h='Stopping early and counting swaps', html='''
<p>Look at the output above: the list was already sorted after pass 2, yet passes 3 and 4 still ran. If a whole
pass makes <strong>no swaps</strong>, every pair of neighbours is in order, so the list is sorted and we can stop.</p>
<table>
<tr><th>Pass</th><th>Comparisons</th><th>Swaps</th><th>List afterwards</th></tr>
<tr><td>1</td><td>4</td><td>3</td><td>1 4 2 5 8</td></tr>
<tr><td>2</td><td>3</td><td>1</td><td>1 2 4 5 8</td></tr>
<tr><td>3</td><td>2</td><td>0</td><td>1 2 4 5 8 — no swaps, stop</td></tr>
</table>
<pre class="try" data-input="5\\n5 1 4 2 8">n = int(input())
a = list(map(int, input().split()))
swaps = 0
for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            swaps += 1
            swapped = True
    if not swapped:
        break
print(*a)
print('swaps:', swaps)</pre>
<p>Here is a neat fact. Call a pair of positions <code>i &lt; j</code> an <strong>inversion</strong> if
<code>a[i] &gt; a[j]</code> (the pair is the wrong way round). Every bubble-sort swap swaps two neighbours that are
the wrong way round, so it fixes exactly <em>one</em> inversion and creates none. That means:</p>
<div class="lc-key">The number of swaps bubble sort makes = the number of inversions in the list = the fewest
swaps of <em>neighbours</em> that can sort it. <code>5 1 4 2 8</code> has 4 inversions: (5,1), (5,4), (5,2), (4,2).</div>
<div class="lc-tip">With early stopping, a list that is already sorted costs only one pass. That makes bubble sort
surprisingly good on data that is <em>nearly</em> sorted.</div>'''),
        dict(h='Selection sort', html='''
<p>Selection sort thinks about the list as two parts: a sorted part at the front (empty at first) and the rest.
At each step it <strong>selects the smallest</strong> number in the rest and swaps it to the front of the rest.
Then the sorted part is one longer.</p>
<table>
<tr><th>Step</th><th>Smallest of the rest</th><th>List afterwards (sorted part in bold)</th></tr>
<tr><td>start</td><td></td><td>64 25 12 22 11</td></tr>
<tr><td>1</td><td>11, swap with 64</td><td><strong>11</strong> 25 12 22 64</td></tr>
<tr><td>2</td><td>12, swap with 25</td><td><strong>11 12</strong> 25 22 64</td></tr>
<tr><td>3</td><td>22, swap with 25</td><td><strong>11 12 22</strong> 25 64</td></tr>
<tr><td>4</td><td>25, already in place</td><td><strong>11 12 22 25</strong> 64</td></tr>
</table>
<pre class="try" data-input="5\\n64 25 12 22 11">n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    m = i                              # index of the smallest so far
    for j in range(i + 1, n):
        if a[j] &lt; a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
    print('step', i + 1, ':', *a)
print(*a)</pre>
<div class="lc-tip">Using <code>&lt;</code> (not <code>&lt;=</code>) keeps the <em>leftmost</em> smallest
when there are ties. Many problems tell you which one to pick, so read carefully.</div>
<p>Counting the work: step 1 compares <code>n − 1</code> pairs, step 2 compares <code>n − 2</code>, …, so there
are always <code>(n − 1) + (n − 2) + … + 1 = n(n − 1)/2</code> comparisons, even if the list was sorted to begin
with. But there is <strong>at most one swap per step</strong>, so at most <code>n − 1</code> swaps in total.</p>'''),
        dict(h='Bubble or selection?', html='''
<table>
<tr><th></th><th>Bubble sort</th><th>Selection sort</th></tr>
<tr><td>Comparisons</td><td>up to n(n − 1)/2</td><td>always n(n − 1)/2</td></tr>
<tr><td>Swaps</td><td>= number of inversions (up to n(n − 1)/2)</td><td>at most n − 1</td></tr>
<tr><td>Already sorted list</td><td>one pass, then stop</td><td>still does every comparison</td></tr>
<tr><td>Stable?</td><td>yes</td><td>no</td></tr>
</table>
<p>Both do about <code>n²/2</code> comparisons in the worst case; we say they are <strong>O(n²)</strong>. For 1000
numbers that is about half a million steps, which is fine. For a million numbers it is far too slow, and that is
when you want Python's built-in sort.</p>
<p>A sort is <strong>stable</strong> if equal items keep their original order. Bubble sort only swaps when the
left item is <em>strictly</em> bigger, so two equal items never jump over each other. Selection sort can break
the order with one long-distance swap:</p>
<pre class="try">cards = [(2, 'a'), (2, 'b'), (1, 'c')]   # sort by the number only
n = len(cards)
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if cards[j][0] &lt; cards[m][0]:
            m = j
    cards[i], cards[m] = cards[m], cards[i]
print(cards)     # 2b now comes before 2a!</pre>
<div class="lc-key">Stability matters when you sort records (names with scores, say) by one field and want ties
to stay in the order they were given.</div>'''),
        dict(h='Largest first, and sorting by a key', html='''
<p>Only the comparison decides the order. To sort from largest to smallest, swap when the left one is
<em>smaller</em>:</p>
<pre class="try">a = [3, 9, 1, 7]
n = len(a)
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] &lt; a[j + 1]:            # was a[j] > a[j + 1]
            a[j], a[j + 1] = a[j + 1], a[j]
print(*a)</pre>
<p>Often we sort <strong>records</strong> by one part of them, called the <strong>key</strong>. Write a small
function that says "should <code>x</code> come after <code>y</code>?" and use it as the swap test. Here pairs are
sorted by their second number, and ties by the first:</p>
<pre class="try" data-input="4\\n3 5\\n1 2\\n7 2\\n2 5">def after(x, y):
    """True if x must come after y."""
    if x[1] != y[1]:
        return x[1] > y[1]
    return x[0] > y[0]

n = int(input())
p = [tuple(map(int, input().split())) for _ in range(n)]
for i in range(n - 1):
    for j in range(n - 1 - i):
        if after(p[j], p[j + 1]):
            p[j], p[j + 1] = p[j + 1], p[j]
for x, y in p:
    print(x, y)</pre>
<div class="lc-tip">Sorting students by total score, highest first, with ties by name? The test becomes
"<code>x</code> comes after <code>y</code> if its total is smaller, or the totals are equal and its name is
later in the alphabet."</div>
<div class="lc-warn">If two different records can tie on every rule, the problem must tell you what to do. Usually
it is "keep the input order", and a stable sort does that for free.</div>'''),
        dict(h="Python's sorted() and sort()", html='''
<p>In real programs, use the built-ins. They are fast (about <code>n log n</code> steps) and <strong>stable</strong>.</p>
<pre class="try">a = [5, 2, 9, 1]
print(sorted(a))                 # a new list; a is unchanged
print(sorted(a, reverse=True))   # largest first
a.sort()                         # sorts a itself, returns None
print(a)
words = ['pear', 'fig', 'banana', 'kiwi']
print(sorted(words))             # alphabetical
print(sorted(words, key=len))    # by length; ties keep their order (stable)</pre>
<p><code>key=</code> takes a function that turns each item into the thing to compare. Return a
<strong>tuple</strong> to sort by several rules at once: Python compares the first parts, then the second parts
only to break ties. Put a minus sign in front of a number to sort that part largest first.</p>
<pre class="try">people = [('Amy', 90), ('Ben', 85), ('Cleo', 90), ('Dan', 85)]
print(sorted(people, key=lambda p: (-p[1], p[0])))   # score high to low, then name A to Z
nums = [-4, 3, -1, 2]
print(sorted(nums, key=abs))                         # by size, ignoring the sign
print(sorted(nums, key=lambda x: (x % 2, x)))        # evens first, each part ascending</pre>
<div class="lc-key">When a problem says "implement bubble sort", write the loops yourself — that is the
exercise. When sorting is only a tool on the way to an answer, <code>sorted()</code> with a good
<code>key</code> is shorter and much faster.</div>'''),
    ],
)

# ── Problems ─────────────────────────────────────────────────────────────
PROBLEMS = [
    # ── Level 1 ──────────────────────────────────────────────────────────
    Problem(
        slug='bubble-sort', title='Bubble Sort', level=1,
        statement='<p>Sort a list of whole numbers from smallest to largest. Write it yourself with <strong>bubble sort</strong>: '
                  'walk through the list comparing neighbours and swapping any pair where the left number is bigger, and repeat these passes until the list is in order.</p>'
                  '<p>(The judge only checks your output, but this problem is here to practise bubble sort, so do not just call <code>sorted()</code>.)</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The <code>n</code> integers in ascending order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('5\n1 4 2 3 5\n', '1 2 3 4 5\n')],
        hint='<p>Two loops: the outer one counts passes, the inner one walks over neighbours <code>j</code> and <code>j + 1</code>. '
             'After each pass the largest remaining number has reached the end, so the next pass can stop one place earlier.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            swapped = True
    if not swapped:
        break
print(*a)
''',
        alt=r'''
n = int(input())
print(*sorted(map(int, input().split())))
''',
        tests=lambda r: sort_tests(r, 0, 10 ** 9),
    ),
    Problem(
        slug='selection-sort', title='Selection Sort', level=1,
        statement='<p>Sort a list of whole numbers from smallest to largest, this time with <strong>selection sort</strong>: '
                  'find the smallest number among those not yet placed, swap it into the first unplaced position, and repeat.</p>'
                  '<p>(Again the judge only checks the output, but write the selection sort yourself.)</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The <code>n</code> integers in ascending order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('5\n1 4 2 3 5\n', '1 2 3 4 5\n')],
        hint='<p>For each position <code>i</code>, keep the index <code>m</code> of the smallest number seen so far in <code>a[i:]</code>. '
             'When the inner loop ends, swap <code>a[i]</code> and <code>a[m]</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
a.sort()
print(' '.join(map(str, a)))
''',
        tests=lambda r: sort_tests(r, 0, 10 ** 9),
    ),
    Problem(
        slug='largest-first', title='Largest First', level=1,
        statement='<p>The scoreboard should show the biggest numbers at the top. Sort the list from <strong>largest to smallest</strong> '
                  'using bubble sort — think about which comparison decides when two neighbours swap.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The <code>n</code> integers in descending order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; −10<sup>6</sup> ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('6\n3 -1 4 1 -5 9\n', '9 4 3 1 -1 -5\n')],
        hint='<p>In ascending bubble sort you swap when the left neighbour is bigger. For descending order, swap when it is <em>smaller</em>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] < a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
print(*a)
''',
        alt=r'''
n = int(input())
print(*sorted(map(int, input().split()), reverse=True))
''',
        tests=lambda r: sort_tests(r, -10 ** 6, 10 ** 6),
    ),
    Problem(
        slug='in-order', title='Already in Order?', level=1,
        statement='<p>Before sorting, it is worth checking whether there is anything to do. Decide whether a list is already in '
                  '<strong>non-decreasing</strong> order, meaning every number is less than or equal to the one after it.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p><code>YES</code> if the list is in non-decreasing order, otherwise <code>NO</code>.</p>',
        constraints='<p>1 ≤ n ≤ 1000; −10<sup>9</sup> ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('5\n1 2 2 5 7\n', 'YES\n', 'Equal neighbours (2 and 2) are fine.'), ('4\n1 3 2 4\n', 'NO\n')],
        hint='<p>This is exactly one pass of bubble sort without the swapping: look at every pair of neighbours. One bad pair is enough to say <code>NO</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
ok = True
for j in range(n - 1):
    if a[j] > a[j + 1]:
        ok = False
        break
print('YES' if ok else 'NO')
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
print('YES' if a == sorted(a) else 'NO')
''',
        tests=lambda r: [nl([5]), nl([3, 3, 3]), nl([2, 1]), nl([-10 ** 9, 10 ** 9]), nl(list(range(1, 200)) + [0]),
                         nl([5] + list(range(6, 300))), nl(sorted(rl(r, 500, -10 ** 9, 10 ** 9))),
                         (lambda a: nl(a[:250] + [a[251], a[250]] + a[252:]))(sorted(r.sample(range(10 ** 6), 600))),
                         nl(rl(r, 100, -5, 5)), nl(sorted(rl(r, 1000, 0, 20)))],
    ),
    Problem(
        slug='median', title='The Middle Number', level=1,
        statement='<p>The <em>median</em> of a list with an odd number of values is the one that ends up exactly in the middle once the list is sorted: '
                  'half of the other values are at most it and half are at least it. Find the median.</p>',
        input='<p>The first line holds <code>n</code> (an odd number). The second line holds <code>n</code> integers.</p>',
        output='<p>The median.</p>',
        constraints='<p>1 ≤ n ≤ 1000 and <code>n</code> is odd; −10<sup>9</sup> ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('3\n2 3 1\n', '2\n'), ('5\n9 1 7 3 3\n', '3\n', 'Sorted: 1 3 3 7 9. The middle one is 3.')],
        hint='<p>Sort first. With <code>n</code> numbers, which index is the middle one? Try it for <code>n = 1</code>, 3 and 5.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
print(a[n // 2])
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
for x in a:
    less = sum(1 for y in a if y < x)
    more = sum(1 for y in a if y > x)
    if less <= n // 2 and more <= n // 2:
        print(x)
        break
''',
        tests=lambda r: [nl([42]), nl([5, 5, 5]), nl([1, 2, 3]), nl([3, 2, 1]), nl([-10 ** 9, 10 ** 9, 0])] + [
            nl(rl(r, 2 * r.randint(2, 50) + 1, -100, 100)) for _ in range(3)] + [nl(rl(r, 451, -10 ** 9, 10 ** 9)), nl(rl(r, 501, 0, 3))],
    ),
    Problem(
        slug='kth-smallest', title='The k-th Smallest', level=1,
        statement='<p>Find the <code>k</code>-th smallest number in a list. Repeated numbers count separately: in <code>1 1 2</code>, '
                  'the 1st and 2nd smallest are both 1 and the 3rd smallest is 2.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The <code>k</code>-th smallest number.</p>',
        constraints='<p>1 ≤ k ≤ n ≤ 1000; −10<sup>9</sup> ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('6 3\n5 1 4 1 9 2\n', '2\n', 'Sorted: 1 1 2 4 5 9. The 3rd one is 2.')],
        hint='<p>Selection sort places the 1st smallest, then the 2nd, then the 3rd… You can stop as soon as position <code>k</code> is filled.</p>',
        solution=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
for i in range(k):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
print(a[k - 1])
''',
        alt=r'''
n, k = map(int, input().split())
a = sorted(map(int, input().split()))
print(a[k - 1])
''',
        tests=lambda r: [nk([7], 1), nk([3, 3, 3], 2), nk([1, 2], 2), nk([2, 1], 1), nk(list(range(100, 0, -1)), 100)] + [
            (lambda a: nk(a, r.randint(1, len(a))))(rl(r, r.randint(2, 600), -10 ** 9, 10 ** 9)) for _ in range(4)] + [nk(rl(r, 600, 0, 5), 300)],
    ),
    Problem(
        slug='podium', title='The Podium', level=1,
        statement='<p>After a race the three best (highest) scores go on the podium. Print the three highest scores, the best first. '
                  'If two runners have the same score, both scores count: the scores <code>9 9 8 7</code> give a podium of <code>9 9 8</code>.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> scores.</p>',
        output='<p>The three highest scores in descending order, separated by single spaces.</p>',
        constraints='<p>3 ≤ n ≤ 1000; 0 ≤ every score ≤ 100.</p>',
        examples=[('6\n70 95 88 95 60 81\n', '95 95 88\n')],
        hint='<p>You don\'t need the whole list sorted. Three passes of bubble sort already bring the three largest numbers to the end. Which order are they in?</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(3):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
print(a[-1], a[-2], a[-3])
''',
        alt=r'''
n = int(input())
a = sorted(map(int, input().split()), reverse=True)
print(*a[:3])
''',
        tests=lambda r: [nl([1, 2, 3]), nl([3, 2, 1]), nl([50, 50, 50, 50]), nl([0, 100, 0, 0]), nl([7, 7, 8, 9, 9])] + [
            nl(rl(r, r.randint(3, 1000), 0, 100)) for _ in range(5)],
    ),
    Problem(
        slug='dictionary-order', title='Dictionary Order', level=1,
        statement='<p>Put a list of words into dictionary (alphabetical) order. Python compares strings with <code>&lt;</code> and <code>&gt;</code> '
                  'letter by letter, so the same bubble sort or selection sort you wrote for numbers works for words too.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> words made of lowercase letters, separated by spaces.</p>',
        output='<p>The words in alphabetical order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 300; each word has 1 to 10 letters. Words may repeat.</p>',
        examples=[('5\npear apple fig banana cherry\n', 'apple banana cherry fig pear\n'),
                  ('3\ncat ca cab\n', 'ca cab cat\n', 'A word that is the start of a longer word comes first.')],
        hint='<p><code>\'ca\' &lt; \'cab\'</code> is <code>True</code>, and <code>\'cab\' &lt; \'cat\'</code> is <code>True</code>. Just compare the words directly.</p>',
        solution=r'''
n = int(input())
w = input().split()
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if w[j] < w[m]:
            m = j
    w[i], w[m] = w[m], w[i]
print(*w)
''',
        alt=r'''
input()
print(' '.join(sorted(input().split())))
''',
        tests=lambda r: [lines(1, 'z'), lines(3, 'b a b'), lines(4, 'a aa aaa a'), lines(3, 'zz zy za')] + [
            (lambda ws: lines(len(ws), ' '.join(ws)))([word(r, 1, 10) for _ in range(r.randint(2, 300))]) for _ in range(3)] + [
            (lambda ws: lines(len(ws), ' '.join(ws)))([word(r, 1, 4, 'abc') for _ in range(300)])],
    ),
    Problem(
        slug='judges-score', title="The Judges' Score", level=1,
        statement='<p>In a diving contest, <code>n</code> judges each give a score. To be fair, <strong>one</strong> highest score and <strong>one</strong> lowest score are '
                  'thrown away (if several judges share the highest score, only one of them is dropped; the same for the lowest). The final score is the average of the rest.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> scores.</p>',
        output='<p>The final score with exactly two digits after the decimal point, printed with <code>f\'{x:.2f}\'</code> where <code>x</code> is the average.</p>',
        constraints='<p>3 ≤ n ≤ 100; 0 ≤ every score ≤ 100 (whole numbers).</p>',
        examples=[('5\n90 75 100 85 60\n', '83.33\n', 'Drop 100 and 60. (90 + 75 + 85) / 3 = 83.333…'), ('3\n5 5 5\n', '5.00\n')],
        hint='<p>After sorting, the scores to keep are a slice: everything except the first and the last.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
middle = a[1:n - 1]
print(f'{sum(middle) / len(middle):.2f}')
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
x = (sum(a) - max(a) - min(a)) / (n - 2)
print(f'{x:.2f}')
''',
        tests=lambda r: [nl([0, 0, 0]), nl([100, 0, 50]), nl([100, 100, 100, 0]), nl([1, 2, 3, 4]), nl([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])] + [
            nl(rl(r, r.randint(3, 100), 0, 100)) for _ in range(5)],
    ),
    Problem(
        slug='closest-two', title='The Closest Two', level=1,
        statement='<p>Among <code>n</code> numbers, find two (at different positions) whose difference is as small as possible, and print that difference. '
                  'Two equal numbers have difference 0.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The smallest difference between any two of the numbers.</p>',
        constraints='<p>2 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('5\n10 3 17 8 1\n', '2\n', 'Sorted: 1 3 8 10 17. Neighbours differ by 2, 5, 2, 7.')],
        hint='<p>Checking every pair works but is slow for big lists. After sorting, the closest two numbers are always <em>neighbours</em>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
best = a[1] - a[0]
for i in range(1, n - 1):
    if a[i + 1] - a[i] < best:
        best = a[i + 1] - a[i]
print(best)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
print(min(abs(a[i] - a[j]) for i in range(n) for j in range(i + 1, n)))
''',
        tests=lambda r: [nl([1, 1]), nl([0, 10 ** 9]), nl([5, 1]), nl([4, 9, 4]), nl(list(range(0, 3000, 7)))] + [
            nl(rl(r, r.randint(2, 600), 0, 10 ** 9)) for _ in range(4)] + [nl(r.sample(range(0, 10 ** 6, 13), 600))],
    ),
    Problem(
        slug='one-pass', title='Just One Pass', level=1,
        statement='<p>Do exactly <strong>one pass</strong> of bubble sort and show the result. A pass compares positions 1 and 2, then 2 and 3, and so on up to '
                  'positions <code>n − 1</code> and <code>n</code>, swapping each pair whose left number is bigger than the right one. '
                  'Swaps happen immediately, so a big number can be carried a long way in one pass.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The list after one pass, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n5 1 4 2 8\n', '1 4 2 5 8\n'), ('4\n3 9 1 2\n', '3 1 2 9\n')],
        hint='<p>One loop over <code>j</code> from 0 to <code>n − 2</code>, comparing <code>a[j]</code> and <code>a[j + 1]</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for j in range(n - 1):
    if a[j] > a[j + 1]:
        a[j], a[j + 1] = a[j + 1], a[j]
print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
out = []
carry = a[0]                 # the biggest number seen so far rides along
for x in a[1:]:
    if x < carry:
        out.append(x)
    else:
        out.append(carry)
        carry = x
out.append(carry)
print(*out)
''',
        tests=lambda r: [nl([4]), nl([2, 1]), nl([1, 2]), nl([6, 6, 6]), nl(list(range(30, 0, -1))), nl(list(range(30)))] + [
            nl(rl(r, r.randint(2, 50), 0, 20)) for _ in range(2)] + [nl(rl(r, 800, 0, 10 ** 6))],
    ),
    Problem(
        slug='first-selection-step', title='The First Selection', level=1,
        statement='<p>Do only the <strong>first step</strong> of selection sort: find the smallest number in the whole list and swap it with the number in position 1. '
                  'If the smallest value appears more than once, use the one that comes first (leftmost). If it is already in position 1, nothing changes.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The list after this one step, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; −10<sup>6</sup> ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n64 25 12 22 11\n', '11 25 12 22 64\n'), ('4\n3 1 2 1\n', '1 3 2 1\n', 'The leftmost 1 is the one that moves.')],
        hint='<p>Keep the <em>index</em> of the smallest number, not just its value — you need to know where to swap. Update it only when you find something strictly smaller.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
m = 0
for j in range(1, n):
    if a[j] < a[m]:
        m = j
a[0], a[m] = a[m], a[0]
print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
m = a.index(min(a))
a[0], a[m] = a[m], a[0]
print(*a)
''',
        tests=lambda r: [nl([5]), nl([2, 1]), nl([1, 2]), nl([1, 5, 1]), nl([4, 4, 4, 4]), nl([3, 2, 2, 3])] + [
            nl(rl(r, r.randint(2, 40), -5, 5)) for _ in range(2)] + [nl(rl(r, 700, -10 ** 6, 10 ** 6))],
    ),
    Problem(
        slug='no-repeats', title='Sorted, No Repeats', level=1,
        statement='<p>Sort the numbers and keep only one copy of each value. Print how many different values there are, and then the values themselves in ascending order.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>Two lines: the number of different values, then those values in ascending order separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 1000.</p>',
        examples=[('7\n4 1 4 2 1 9 4\n', '4\n1 2 4 9\n')],
        hint='<p>After sorting, copies of the same value sit next to each other. Keep a number only if it differs from the one just before it.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
out = [a[0]]
for x in a[1:]:
    if x != out[-1]:
        out.append(x)
print(len(out))
print(*out)
''',
        alt=r'''
input()
s = sorted(set(map(int, input().split())))
print(len(s))
print(*s)
''',
        tests=lambda r: [nl([0]), nl([5, 5, 5]), nl([3, 2, 1]), nl(list(range(1, 11)))] + [
            nl(rl(r, r.randint(2, 600), 0, k)) for k in (3, 10, 1000, 1000, 100)],
    ),
    Problem(
        slug='sort-letters', title='Letters in Line', level=1,
        statement='<p>Rearrange the letters of a word so they appear in alphabetical order, and also print them in reverse alphabetical order.</p>',
        input='<p>One word of lowercase letters.</p>',
        output='<p>Two lines: the letters in alphabetical order, then in reverse alphabetical order.</p>',
        constraints='<p>The word has 1 to 500 letters.</p>',
        examples=[('banana\n', 'aaabnn\nnnbaaa\n')],
        hint='<p>A string cannot be changed, so put the letters into a list with <code>list(word)</code>, sort the list, and join it back with <code>\'\'.join(...)</code>.</p>',
        solution=r'''
s = list(input().strip())
n = len(s)
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if s[j] < s[m]:
            m = j
    s[i], s[m] = s[m], s[i]
print(''.join(s))
print(''.join(s[::-1]))
''',
        alt=r'''
s = input().strip()
print(''.join(sorted(s)))
print(''.join(sorted(s, reverse=True)))
''',
        tests=lambda r: ['a\n', 'zz\n', 'abc\n', 'cba\n', 'mississippi\n', string.ascii_lowercase[::-1] + '\n',
                         word(r, 30, 30) + '\n', word(r, 500, 500) + '\n', word(r, 400, 400, 'xy') + '\n'],
    ),
    Problem(
        slug='evens-then-odds', title='Evens Before Odds', level=1,
        statement='<p>Arrange the numbers so that all the <strong>even</strong> numbers come first, in ascending order, followed by all the <strong>odd</strong> numbers, also in ascending order.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The rearranged numbers, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('7\n5 8 3 2 7 6 1\n', '2 6 8 1 3 5 7\n')],
        hint='<p>Either sort the evens and the odds as two separate lists and glue them together, or use one bubble sort where '
             '"<code>x</code> should come after <code>y</code>" means: <code>x</code> is odd and <code>y</code> is even, or they are both the same kind and <code>x &gt; y</code>.</p>',
        solution=r'''
def after(x, y):
    if x % 2 != y % 2:
        return x % 2 == 1
    return x > y


n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if after(a[j], a[j + 1]):
            a[j], a[j + 1] = a[j + 1], a[j]
print(*a)
''',
        alt=r'''
input()
a = sorted(map(int, input().split()))
print(*([x for x in a if x % 2 == 0] + [x for x in a if x % 2 == 1]))
''',
        tests=lambda r: [nl([0]), nl([1]), nl([3, 1, 5]), nl([8, 2, 4]), nl([1, 2]), nl([2, 2, 1, 1])] + [
            nl(rl(r, r.randint(2, 600), 0, k)) for k in (10, 10 ** 6, 10 ** 6)],
    ),

    # ── Level 2 ──────────────────────────────────────────────────────────
    Problem(
        slug='zigzag-order', title='Biggest, Smallest, Biggest, Smallest', level=2,
        statement='<p>Print the numbers in a zig-zag order: first the largest, then the smallest, then the second largest, then the second smallest, and so on, '
                  'until every number has been printed exactly once. Repeated values are separate numbers.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one integer.</p>',
        output='<p><code>n</code> lines, one number per line, in the zig-zag order.</p>',
        constraints='<p>1 ≤ n ≤ 1000; −10<sup>9</sup> ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('5\n10\n-1\n3\n3\n-9\n', '10\n-9\n3\n-1\n3\n', 'Sorted: −9 −1 3 3 10. Take from the right end, then the left end, and keep alternating.')],
        hint='<p>Sort the list, then keep two positions: one at the right end and one at the left end. Print from the right, move it in, print from the left, move it in, until they cross.</p>',
        solution=r'''
n = int(input())
a = [int(input()) for _ in range(n)]
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
lo, hi = 0, n - 1
take_big = True
while lo <= hi:
    if take_big:
        print(a[hi])
        hi -= 1
    else:
        print(a[lo])
        lo += 1
    take_big = not take_big
''',
        alt=r'''
import sys
data = sys.stdin.read().split()
n = int(data[0])
a = sorted(map(int, data[1:n + 1]))
out = []
while a:
    out.append(a.pop())
    if a:
        out.append(a.pop(0))
print('\n'.join(map(str, out)))
''',
        tests=lambda r: [lines(1, 7), lines(2, 1, 2), lines(2, 5, 5), lines(3, 3, 2, 1), lines(4, 0, 0, 1, 1)] + [
            lines(n, *rl(r, n, -10 ** 9, 10 ** 9)) for n in (6, 51, 400)] + [lines(500, *rl(r, 500, -3, 3))],
    ),
    Problem(
        slug='carriage-swaps', title='The Turntable Bridge', level=2,
        statement='<p>At an old railway station, carriages are put in order using a small turntable bridge. The bridge holds exactly two carriages: '
                  'it picks up two carriages standing next to each other, turns half a circle, and puts them back the other way round. '
                  'In other words, one turn swaps two <strong>neighbouring</strong> carriages.</p>'
                  '<p>Given the carriage numbers in their current order, find the fewest turns needed to arrange them in ascending order.</p>',
        input='<p>The first line holds <code>N</code>. The second line holds the <code>N</code> different carriage numbers, in their current order.</p>',
        output='<p>The minimum number of turns.</p>',
        constraints='<p>1 ≤ N ≤ 1000; the carriage numbers are different integers between 1 and 10<sup>6</sup>.</p>',
        examples=[('4\n4 3 2 1\n', '6\n'), ('3\n1 3 2\n', '1\n')],
        hint='<p>Bubble sort only ever swaps neighbours, and it never wastes a swap. Count its swaps.</p>',
        explanation='<p>Every swap of two neighbours that are in the wrong order fixes exactly one out-of-order pair, and no swap of neighbours can fix more than one. '
                    'So the answer is the number of out-of-order pairs, which is exactly how many swaps bubble sort makes.</p>',
        solution=r'''
import sys
data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:n + 1]))
turns = 0
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            turns += 1
print(turns)
''',
        alt=r'''
import sys
data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:n + 1]))
print(sum(1 for i in range(n) for j in range(i + 1, n) if a[i] > a[j]))
''',
        tests=lambda r: [nl([1]), nl([1, 2]), nl([2, 1]), nl(list(range(600, 0, -1))), nl(list(range(1, 601)))] + [
            nl(r.sample(range(1, 10 ** 6), n)) for n in (10, 100, 500, 600)] + [nl(nearly_sorted(r, 600, 40))],
    ),
    Problem(
        slug='pass-by-pass', title='Bubble Sort, Pass by Pass', level=2,
        statement='<p>Show how bubble sort works by printing the list after every pass. Use exactly this version:</p>'
                  '<ul><li>Pass 1 compares neighbours at positions (1, 2), (2, 3), …, (<code>n − 1</code>, <code>n</code>); pass 2 stops one pair earlier, at '
                  '(<code>n − 2</code>, <code>n − 1</code>); each later pass stops one pair earlier again.</li>'
                  '<li>Whenever the left number of a pair is bigger than the right one, they are swapped.</li>'
                  '<li>Sorting stops after a pass that made <strong>no swaps</strong> (that pass is still printed), or after pass <code>n − 1</code>, whichever comes first.</li></ul>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One line per pass: the whole list after that pass, numbers separated by single spaces.</p>',
        constraints='<p>2 ≤ n ≤ 100; 0 ≤ every number ≤ 1000.</p>',
        examples=[('5\n2 1 3 5 4\n', '1 2 3 4 5\n1 2 3 4 5\n', 'Pass 1 makes two swaps. Pass 2 makes none, so it is printed and sorting stops.'),
                  ('4\n4 1 3 2\n', '1 3 2 4\n1 2 3 4\n1 2 3 4\n')],
        hint='<p>Use a <code>swapped</code> flag that is reset to <code>False</code> at the start of every pass. Print after the pass, <em>then</em> check the flag.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            swapped = True
    print(*a)
    if not swapped:
        break
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
end = n - 1                     # last index the current pass may reach
while end >= 1:
    before = a[:]
    for j in range(end):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
    print(' '.join(map(str, a)))
    if a == before:
        break
    end -= 1
''',
        tests=lambda r: [nl([1, 2]), nl([2, 1]), nl([3, 3]), nl([5, 4, 3, 2, 1]), nl([1, 2, 3, 4, 5]), nl([2, 3, 4, 5, 1])] + [
            nl(rl(r, r.randint(3, 12), 0, 9)) for _ in range(3)] + [nl(rl(r, 100, 0, 1000)), nl(nearly_sorted(r, 60, 5))],
    ),
    Problem(
        slug='step-by-step', title='Selection Sort, Step by Step', level=2,
        statement='<p>Show how selection sort works by printing the list after every step. Use exactly this version:</p>'
                  '<ul><li>There are <code>n − 1</code> steps. In step <code>i</code>, look at positions <code>i</code> to <code>n</code> and find the smallest number there. '
                  'If the smallest value appears more than once, take the <strong>leftmost</strong> one.</li>'
                  '<li>Swap it with the number in position <code>i</code> (if it is already there, nothing changes, but the step still counts).</li></ul>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>Exactly <code>n − 1</code> lines: the whole list after each step, numbers separated by single spaces.</p>',
        constraints='<p>2 ≤ n ≤ 100; 0 ≤ every number ≤ 1000.</p>',
        examples=[('5\n64 25 12 22 11\n', '11 25 12 22 64\n11 12 25 22 64\n11 12 22 25 64\n11 12 22 25 64\n')],
        hint='<p>Print inside the outer loop, right after the swap. With <code>&lt;</code> in the comparison you automatically keep the leftmost smallest.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
    print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    rest = a[i:]
    m = i + rest.index(min(rest))
    a[i], a[m] = a[m], a[i]
    print(' '.join(map(str, a)))
''',
        tests=lambda r: [nl([1, 2]), nl([2, 1]), nl([3, 3]), nl([5, 4, 3, 2, 1]), nl([1, 2, 3, 4, 5]), nl([2, 1, 2, 1, 2])] + [
            nl(rl(r, r.randint(3, 12), 0, 9)) for _ in range(3)] + [nl(rl(r, 100, 0, 1000))],
    ),
    Problem(
        slug='count-passes', title='How Many Passes?', level=2,
        statement='<p>Bubble sort with early stopping keeps making passes while they still swap something (each pass stops one pair earlier than the one before, '
                  'as in the tutorial). How many passes make <strong>at least one swap</strong>? The final check pass that finds nothing to swap does not count.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The number of passes that make at least one swap.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n5 1 4 2 8\n', '2\n'), ('3\n1 2 3\n', '0\n')],
        hint='<p>Simulate bubble sort and count passes whose <code>swapped</code> flag ends up <code>True</code>. '
             '(Puzzle for later: a number moves left by at most one place per pass. Can you get the answer without simulating?)</p>',
        explanation='<p>A small number moves <em>left</em> by only one position per pass, because once it has been swapped with the bigger number before it, the pass moves on. '
                    'So the answer is the largest number of bigger values standing in front of any single element.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
passes = 0
for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            swapped = True
    if not swapped:
        break
    passes += 1
print(passes)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
best = 0
for i in range(n):
    bigger_before = sum(1 for k in range(i) if a[k] > a[i])
    best = max(best, bigger_before)
print(best)
''',
        tests=lambda r: [nl([3]), nl([1, 2]), nl([2, 1]), nl([4, 4, 4]), nl(list(range(600, 0, -1))), nl(list(range(2, 601)) + [1]),
                         nl([600] + list(range(1, 600)))] + [nl(rl(r, n, 0, 10 ** 6)) for n in (10, 300, 600)] + [nl(nearly_sorted(r, 600, 30)), nl(rl(r, 600, 0, 3))],
    ),
    Problem(
        slug='selection-swaps', title='Counting Selection Swaps', level=2,
        statement='<p>Run selection sort on the list: for each position <code>i</code> from 1 to <code>n − 1</code>, find the smallest number in positions <code>i</code> to <code>n</code> '
                  '(the <strong>leftmost</strong> one if there is a tie), and if it is <em>not</em> already at position <code>i</code>, swap it there. '
                  'Count how many swaps actually happen.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The number of swaps.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n64 25 12 22 11\n', '3\n', 'Steps 1, 2 and 3 swap; in step 4 the 25 is already in place.'),
                  ('4\n2 2 1 1\n', '2\n')],
        hint='<p>Only add 1 when the index of the smallest differs from <code>i</code>. Ties matter: a different choice of "smallest" can change the count.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
swaps = 0
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    if m != i:
        a[i], a[m] = a[m], a[i]
        swaps += 1
print(swaps)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
swaps = 0
for i in range(n - 1):
    rest = a[i:]
    m = i + rest.index(min(rest))
    if m > i:
        a[i], a[m] = a[m], a[i]
        swaps += 1
print(swaps)
''',
        tests=lambda r: [nl([1]), nl([1, 2]), nl([2, 1]), nl([5, 5, 5, 5]), nl(list(range(600, 0, -1))), nl(list(range(1, 601))),
                         nl([3, 1, 2, 1, 3, 2])] + [nl(rl(r, n, 0, 10 ** 6)) for n in (8, 100, 600)] + [nl(rl(r, 600, 0, 4))],
    ),
    Problem(
        slug='k-passes', title='After k Passes', level=2,
        statement='<p>Run bubble sort for exactly <code>k</code> passes (or until the list is sorted, if that happens sooner — extra passes would change nothing anyway) '
                  'and print the list. Pass 1 compares every neighbouring pair from the front to the back, swapping when the left number is bigger; each later pass may stop one pair earlier.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The list after <code>k</code> passes, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ k ≤ 10<sup>6</sup>; 0 ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('6 2\n6 5 4 3 2 1\n', '4 3 2 1 5 6\n'), ('5 1\n5 1 4 2 8\n', '1 4 2 5 8\n')],
        hint='<p><code>k</code> can be huge. A list of <code>n</code> numbers never needs more than <code>n − 1</code> passes, so you can do <code>min(k, n − 1)</code> passes.</p>',
        solution=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
for i in range(min(k, n - 1)):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
print(*a)
''',
        alt=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
done = 0
while done < k:
    changed = False
    for j in range(n - 1):          # always the full list: the sorted tail never swaps
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            changed = True
    done += 1
    if not changed:
        break
print(' '.join(map(str, a)))
''',
        tests=lambda r: [nk([3], 5), nk([2, 1], 1), nk([1, 2], 1), nk(list(range(10, 0, -1)), 3), nk(list(range(10, 0, -1)), 10 ** 6),
                         nk([9, 1, 1, 1, 1], 2)] + [nk(rl(r, n, 0, 10 ** 6), r.randint(1, n)) for n in (8, 50, 300, 600)] + [nk(rl(r, 600, 0, 9), 10 ** 6)],
    ),
    Problem(
        slug='max-to-the-end', title='Selection Sort Backwards', level=2,
        statement='<p>Selection sort can also work from the back. In this version, the steps go for <code>i = n, n − 1, …, 2</code>: '
                  'find the <strong>largest</strong> number in positions 1 to <code>i</code> (the <strong>leftmost</strong> one if there is a tie) and swap it with the number in position <code>i</code>. '
                  'Print the list after every step.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>Exactly <code>n − 1</code> lines: the list after each step, numbers separated by single spaces.</p>',
        constraints='<p>2 ≤ n ≤ 100; 0 ≤ every number ≤ 1000.</p>',
        examples=[('5\n3 1 4 1 5\n', '3 1 4 1 5\n3 1 1 4 5\n1 1 3 4 5\n1 1 3 4 5\n',
                   'Step 1: 5 is already last. Step 2: 4 swaps with the second 1. Step 3: 3 swaps with the other 1. Step 4: the two 1s.')],
        hint='<p>The outer loop runs <code>i</code> backwards with <code>range(n - 1, 0, -1)</code> (0-based). Use <code>&gt;</code> (not <code>&gt;=</code>) to keep the leftmost largest.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1, 0, -1):
    m = 0
    for j in range(1, i + 1):
        if a[j] > a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
    print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n, 1, -1):
    front = a[:i]
    m = front.index(max(front))
    a[i - 1], a[m] = a[m], a[i - 1]
    print(' '.join(map(str, a)))
''',
        tests=lambda r: [nl([1, 2]), nl([2, 1]), nl([7, 7]), nl([5, 4, 3, 2, 1]), nl([1, 2, 3, 4, 5]), nl([2, 9, 2, 9, 2])] + [
            nl(rl(r, r.randint(3, 12), 0, 9)) for _ in range(3)] + [nl(rl(r, 100, 0, 1000))],
    ),
    Problem(
        slug='sort-by-second', title='Pairs by Their Second Number', level=2,
        statement='<p>You are given <code>n</code> pairs of numbers. Sort them by their <strong>second</strong> number, smallest first. '
                  'Pairs with the same second number are sorted by their first number, smallest first.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one pair: two integers <code>a b</code>.</p>',
        output='<p><code>n</code> lines, the pairs in sorted order, each written as <code>a b</code>.</p>',
        constraints='<p>1 ≤ n ≤ 500; −1000 ≤ a, b ≤ 1000.</p>',
        examples=[('4\n3 5\n1 2\n7 2\n2 5\n', '1 2\n7 2\n2 5\n3 5\n')],
        hint='<p>Write a function <code>after(x, y)</code> that returns <code>True</code> when pair <code>x</code> must come after pair <code>y</code>, and use it as the swap test in bubble sort.</p>',
        solution=r'''
def after(x, y):
    if x[1] != y[1]:
        return x[1] > y[1]
    return x[0] > y[0]


n = int(input())
p = [tuple(map(int, input().split())) for _ in range(n)]
for i in range(n - 1):
    for j in range(n - 1 - i):
        if after(p[j], p[j + 1]):
            p[j], p[j + 1] = p[j + 1], p[j]
for a, b in p:
    print(a, b)
''',
        alt=r'''
n = int(input())
p = [tuple(map(int, input().split())) for _ in range(n)]
for a, b in sorted(p, key=lambda t: (t[1], t[0])):
    print(a, b)
''',
        tests=lambda r: [lines(1, '4 4'), lines(2, '1 1', '1 1'), lines(3, '3 0', '2 0', '1 0'), lines(3, '0 3', '0 2', '0 1')] + [
            (lambda n, k: lines(n, *[f'{r.randint(-k, k)} {r.randint(-k, k)}' for _ in range(n)]))(n, k) for n, k in ((6, 3), (40, 5), (300, 1000), (500, 20))],
    ),
    Problem(
        slug='stable-scoreboard', title='A Fair Scoreboard', level=2,
        statement='<p>List the players by score, highest first. When two players have the same score, the one who appears earlier in the input must stay earlier — '
                  'the sort must be <strong>stable</strong>.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds a name and a score.</p>',
        output='<p><code>n</code> lines, each <code>name score</code>, in the sorted order.</p>',
        constraints='<p>1 ≤ n ≤ 500; names are 1 to 10 letters (no spaces) and may repeat; 0 ≤ score ≤ 100.</p>',
        examples=[('5\nAmy 90\nBen 85\nCleo 90\nDan 70\nEve 85\n', 'Amy 90\nCleo 90\nBen 85\nEve 85\nDan 70\n')],
        hint='<p>Bubble sort is stable as long as you only swap when the scores are <em>strictly</em> in the wrong order. Equal scores must never be swapped.</p>',
        solution=r'''
n = int(input())
rows = []
for _ in range(n):
    name, score = input().split()
    rows.append((name, int(score)))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if rows[j][1] < rows[j + 1][1]:
            rows[j], rows[j + 1] = rows[j + 1], rows[j]
for name, score in rows:
    print(name, score)
''',
        alt=r'''
n = int(input())
rows = [input().split() for _ in range(n)]
for name, score in sorted(rows, key=lambda t: -int(t[1])):
    print(name, score)
''',
        tests=lambda r: [lines(1, 'Solo 50'), lines(3, 'A 1', 'B 1', 'C 1'), lines(3, 'C 0', 'B 50', 'A 100'), lines(2, 'Zed 9', 'Amy 9')] + [
            (lambda n, k: lines(n, *[f'{word(r, 1, 10, string.ascii_letters)} {r.randint(100 - k, 100)}' for _ in range(n)]))(n, k)
            for n, k in ((8, 3), (50, 10), (300, 100), (500, 5))],
    ),
    Problem(
        slug='top-students', title='Top Five Students', level=2,
        statement='<p>Students are numbered 1 to <code>n</code> in the order of the input, and each has three scores: maths, English and science. '
                  'Rank them by <strong>total</strong> score, highest first. If two totals are equal, the higher <strong>maths</strong> score ranks higher; '
                  'if those are equal too, the smaller student number ranks higher. Print the top five (or everyone, if there are fewer than five).</p>',
        input='<p>The first line holds <code>n</code>. Line <code>i + 1</code> holds the three scores of student <code>i</code>.</p>',
        output='<p>Up to five lines, each with a student number and that student\'s total, best first.</p>',
        constraints='<p>1 ≤ n ≤ 300; every score is between 0 and 100.</p>',
        examples=[('6\n90 80 70\n85 85 70\n100 60 60\n70 90 90\n85 80 75\n60 60 60\n', '4 250\n1 240\n2 240\n5 240\n3 220\n',
                   'Students 1, 2 and 5 all total 240. Student 1 has the best maths (90); 2 and 5 tie on maths too, so 2 comes first.')],
        hint='<p>Store each student as <code>(number, total, maths)</code>. Then "<code>x</code> comes after <code>y</code>" is: smaller total; or same total and smaller maths; or both equal and bigger number.</p>',
        solution=r'''
def after(x, y):
    if x[1] != y[1]:
        return x[1] < y[1]
    if x[2] != y[2]:
        return x[2] < y[2]
    return x[0] > y[0]


n = int(input())
st = []
for i in range(1, n + 1):
    m, e, s = map(int, input().split())
    st.append((i, m + e + s, m))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if after(st[j], st[j + 1]):
            st[j], st[j + 1] = st[j + 1], st[j]
for num, total, maths in st[:5]:
    print(num, total)
''',
        alt=r'''
n = int(input())
st = []
for i in range(1, n + 1):
    m, e, s = map(int, input().split())
    st.append((-(m + e + s), -m, i))
st.sort()
for t, m, i in st[:5]:
    print(i, -t)
''',
        tests=lambda r: [lines(1, '0 0 0'), lines(2, '50 50 50', '50 50 50'), lines(3, '10 0 0', '0 10 0', '0 0 10'), lines(5, *['100 100 100'] * 5),
                         lines(7, *[f'{r.randint(0, 2)} {r.randint(0, 2)} {r.randint(0, 2)}' for _ in range(7)])] + [
            (lambda n, k: lines(n, *[' '.join(str(r.randint(100 - k, 100)) for _ in range(3)) for _ in range(n)]))(n, k) for n, k in ((20, 3), (100, 10), (300, 100), (300, 2))],
    ),
    Problem(
        slug='digit-sum-order', title='Sorted by Digit Sum', level=2,
        statement='<p>Sort the numbers by the <strong>sum of their digits</strong>, smallest sum first. Numbers with the same digit sum go in ascending order of the numbers themselves.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> positive integers.</p>',
        output='<p>The sorted numbers, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 300; 1 ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('6\n91 19 100 23 5 1000\n', '100 1000 5 23 19 91\n', 'Digit sums: 91→10, 19→10, 100→1, 23→5, 5→5, 1000→1.')],
        hint='<p>Write a function <code>digit_sum(x)</code> first (<code>x % 10</code> and <code>x // 10</code>, or <code>sum(map(int, str(x)))</code>). Compare the digit sums first, the numbers second.</p>',
        solution=r'''
def digit_sum(x):
    s = 0
    while x > 0:
        s += x % 10
        x //= 10
    return s


n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        x, y = a[j], a[j + 1]
        if digit_sum(x) > digit_sum(y) or (digit_sum(x) == digit_sum(y) and x > y):
            a[j], a[j + 1] = y, x
print(*a)
''',
        alt=r'''
input()
a = list(map(int, input().split()))
print(*sorted(a, key=lambda x: (sum(map(int, str(x))), x)))
''',
        tests=lambda r: [nl([7]), nl([10, 1]), nl([1, 10, 100]), nl([5, 14, 23, 50, 41, 32]), nl([999999999, 1000000000])] + [
            nl(rl(r, n, 1, k)) for n, k in ((10, 100), (100, 1000), (300, 10 ** 9), (300, 10 ** 5))],
    ),
    Problem(
        slug='short-words-first', title='Short Words First', level=2,
        statement='<p>Sort a list of words by <strong>length</strong>, shortest first. Words of the same length go in alphabetical order.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one word of lowercase letters.</p>',
        output='<p>The <code>n</code> words in sorted order, one per line.</p>',
        constraints='<p>1 ≤ n ≤ 300; each word has 1 to 12 letters. Words may repeat.</p>',
        examples=[('6\nkiwi\nfig\napple\nplum\nbanana\npear\n', 'fig\nkiwi\npear\nplum\napple\nbanana\n')],
        hint='<p>Swap two neighbours when the left word is longer, or when they are the same length and the left word comes later in the alphabet.</p>',
        solution=r'''
n = int(input())
w = [input().strip() for _ in range(n)]
for i in range(n - 1):
    for j in range(n - 1 - i):
        x, y = w[j], w[j + 1]
        if len(x) > len(y) or (len(x) == len(y) and x > y):
            w[j], w[j + 1] = y, x
for x in w:
    print(x)
''',
        alt=r'''
n = int(input())
w = [input().strip() for _ in range(n)]
print('\n'.join(sorted(w, key=lambda s: (len(s), s))))
''',
        tests=lambda r: [lines(1, 'a'), lines(3, 'ccc', 'bb', 'a'), lines(3, 'b', 'a', 'b'), lines(4, 'dog', 'cat', 'ant', 'bee')] + [
            (lambda ws: lines(len(ws), *ws))([word(r, 1, k) for _ in range(n)]) for n, k in ((10, 4), (60, 12), (300, 12), (300, 3))],
    ),
    Problem(
        slug='closest-to-zero', title='Closest to Zero First', level=2,
        statement='<p>Sort the numbers by their distance from zero (their absolute value), closest first. If a number and its opposite are both present, '
                  'the <strong>negative</strong> one comes first: <code>-2</code> before <code>2</code>.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The sorted numbers, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 500; −1000 ≤ every number ≤ 1000.</p>',
        examples=[('7\n3 -2 2 -5 0 1 -1\n', '0 -1 1 -2 2 3 -5\n')],
        hint='<p><code>abs(x)</code> gives the distance from zero. When the distances are equal, which of the two numbers is smaller?</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        x, y = a[j], a[j + 1]
        if abs(x) > abs(y) or (abs(x) == abs(y) and x > y):
            a[j], a[j + 1] = y, x
print(*a)
''',
        alt=r'''
input()
a = list(map(int, input().split()))
print(*sorted(a, key=lambda x: (abs(x), x)))
''',
        tests=lambda r: [nl([0]), nl([-1]), nl([1, -1]), nl([-1, 1]), nl([5, -5, 5, -5]), nl(list(range(-10, 11)))] + [
            nl(rl(r, n, -k, k)) for n, k in ((10, 5), (100, 50), (500, 1000))],
    ),
    Problem(
        slug='kth-largest-value', title='The k-th Largest Value', level=2,
        statement='<p>Among the <strong>different</strong> values in a list, find the <code>k</code>-th largest. Repeats count only once here: in <code>9 9 7</code>, '
                  'the 1st largest value is 9 and the 2nd largest is 7. If there are fewer than <code>k</code> different values, print <code>-1</code>.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The <code>k</code>-th largest different value, or <code>-1</code>.</p>',
        constraints='<p>1 ≤ k ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('7 3\n5 9 5 1 9 7 3\n', '5\n', 'The different values from largest: 9, 7, 5, 3, 1.'), ('4 3\n2 2 8 8\n', '-1\n')],
        hint='<p>Sort from largest to smallest, then walk along counting a value only when it differs from the previous one.</p>',
        solution=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] > a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
count = 0
answer = -1
for i in range(n):
    if i == 0 or a[i] != a[i - 1]:
        count += 1
        if count == k:
            answer = a[i]
            break
print(answer)
''',
        alt=r'''
n, k = map(int, input().split())
s = sorted(set(map(int, input().split())), reverse=True)
print(s[k - 1] if k <= len(s) else -1)
''',
        tests=lambda r: [nk([4], 1), nk([3, 3], 2), nk([1, 2], 2), nk([0, 0, 0, 5], 2), nk(list(range(100)), 100)] + [
            nk(rl(r, n, 0, v), k) for n, v, k in ((10, 5, 3), (10, 5, 8), (300, 10 ** 9, 150), (600, 50, 40), (600, 50, 51))],
    ),
    Problem(
        slug='competition-ranks', title='Who Came Where?', level=2,
        statement='<p>In a competition, a player\'s <em>rank</em> is 1 plus the number of players with a <strong>strictly higher</strong> score. '
                  'So players with equal scores share a rank, and the next rank is skipped: scores <code>95 95 80</code> get ranks <code>1 1 3</code>. '
                  'Print every player\'s rank, in the order the players were given.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> scores.</p>',
        output='<p>The <code>n</code> ranks, in input order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every score ≤ 10<sup>6</sup>.</p>',
        examples=[('6\n80 95 80 70 95 60\n', '3 1 3 5 1 6\n')],
        hint='<p>Sort a copy from highest to lowest. The rank of a score is (the position where it <em>first</em> appears in the sorted copy) + 1. '
             'A dictionary from score to rank makes the second part quick.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
b = a[:]
for i in range(n - 1):
    for j in range(n - 1 - i):
        if b[j] < b[j + 1]:
            b[j], b[j + 1] = b[j + 1], b[j]
rank = {}
for i, s in enumerate(b):
    if s not in rank:
        rank[s] = i + 1
print(*[rank[s] for s in a])
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
print(*[1 + sum(1 for y in a if y > x) for x in a])
''',
        tests=lambda r: [nl([7]), nl([5, 5]), nl([1, 2]), nl([3, 2, 1]), nl([0] * 10), nl(list(range(30)))] + [
            nl(rl(r, n, 0, k)) for n, k in ((10, 5), (100, 50), (600, 10 ** 6), (600, 20))],
    ),
    Problem(
        slug='meeting-clash', title='Double-Booked?', level=2,
        statement='<p>A meeting room has <code>n</code> bookings. Booking <code>i</code> uses the room from minute <code>s</code> up to minute <code>e</code>: '
                  'it starts at <code>s</code> and the room is free again at <code>e</code>. So a booking that ends at 600 and another that starts at 600 do <strong>not</strong> clash. '
                  'Is there any pair of bookings that overlap?</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>s e</code>.</p>',
        output='<p><code>YES</code> if some two bookings overlap, otherwise <code>NO</code>.</p>',
        constraints='<p>1 ≤ n ≤ 500; 0 ≤ s &lt; e ≤ 1440.</p>',
        examples=[('3\n540 600\n600 660\n700 720\n', 'NO\n'), ('3\n60 120\n300 400\n100 200\n', 'YES\n', 'The first and the last booking share minutes 100 to 120.')],
        hint='<p>Sort the bookings by start time. Then a clash, if there is one, shows up between two bookings that are next to each other: does the next one start before the previous one ends?</p>',
        solution=r'''
n = int(input())
b = [tuple(map(int, input().split())) for _ in range(n)]
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if b[j] < b[m]:
            m = j
    b[i], b[m] = b[m], b[i]
clash = False
for i in range(n - 1):
    if b[i + 1][0] < b[i][1]:
        clash = True
print('YES' if clash else 'NO')
''',
        alt=r'''
n = int(input())
b = [tuple(map(int, input().split())) for _ in range(n)]
clash = any(max(b[i][0], b[j][0]) < min(b[i][1], b[j][1]) for i in range(n) for j in range(i + 1, n))
print('YES' if clash else 'NO')
''',
        explanation='<p>Careful: checking only neighbours works because the list is sorted by start. If booking <code>i</code> overlaps a later booking, '
                    'it also overlaps (or a booking in between already overlaps) the very next one.</p>',
        tests=lambda r: [lines(1, '0 1440'), lines(2, '0 10', '10 20'), lines(2, '0 11', '10 20'), lines(2, '5 6', '0 1440'),
                         lines(3, '0 100', '10 20', '50 60'), lines(144, *[f'{i * 10} {i * 10 + 10}' for i in range(143, -1, -1)])] + [
            (lambda n: lines(n, *[(lambda s: f'{s} {r.randint(s + 1, min(1440, s + 30))}')(r.randint(0, 1439)) for _ in range(n)]))(n) for n in (3, 10, 40)] + [
            (lambda cuts: lines(len(cuts) - 1, *[f'{cuts[i]} {cuts[i + 1]}' for i in r.sample(range(len(cuts) - 1), len(cuts) - 1)]))(sorted(r.sample(range(1441), 300))),
            (lambda cuts: lines(len(cuts) - 1, *[f'{cuts[i]} {cuts[i + 1] + (1 if i == 77 else 0)}' for i in r.sample(range(len(cuts) - 1), len(cuts) - 1)]))(sorted(r.sample(range(1440), 200)))],
    ),
    Problem(
        slug='odd-ones-sorted', title='Sort the Odd Ones Only', level=2,
        statement='<p>Sort the <strong>odd</strong> numbers into ascending order, but leave every even number exactly where it is. '
                  'The odd numbers only move among the places that held odd numbers.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The new list, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('7\n5 8 3 2 7 6 1\n', '1 8 3 2 5 6 7\n', 'The odd numbers 5, 3, 7, 1 sit at positions 1, 3, 5, 7. Sorted, they are 1, 3, 5, 7.')],
        hint='<p>Pull the odd numbers out into their own list and sort it. Then walk along the original list and replace each odd number with the next one from the sorted list.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
odd = [x for x in a if x % 2 == 1]
k = len(odd)
for i in range(k - 1):
    for j in range(k - 1 - i):
        if odd[j] > odd[j + 1]:
            odd[j], odd[j + 1] = odd[j + 1], odd[j]
t = 0
for i in range(n):
    if a[i] % 2 == 1:
        a[i] = odd[t]
        t += 1
print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
pos = [i for i in range(n) if a[i] % 2]
vals = sorted(a[i] for i in pos)
for i, v in zip(pos, vals):
    a[i] = v
print(*a)
''',
        tests=lambda r: [nl([3]), nl([4]), nl([2, 4, 6]), nl([5, 3, 1]), nl([9, 2, 7, 4, 5]), nl([1, 1, 2, 1])] + [
            nl(rl(r, n, 0, k)) for n, k in ((10, 9), (100, 100), (600, 10 ** 6))],
    ),
    Problem(
        slug='widest-gap', title='The Widest Gap', level=2,
        statement='<p>Picture the numbers as points on a number line. Find the widest empty gap between two points that are next to each other on the line, '
                  'that is, the largest difference between neighbours once the numbers are sorted.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The largest difference between two neighbouring values in sorted order.</p>',
        constraints='<p>2 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('5\n10 3 17 8 1\n', '7\n', 'Sorted: 1 3 8 10 17. The gaps are 2, 5, 2 and 7.')],
        hint='<p>Sort, then look at <code>a[i + 1] − a[i]</code> for every <code>i</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
best = 0
for i in range(n - 1):
    best = max(best, a[i + 1] - a[i])
print(best)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
best = 0
for x in a:
    above = [y for y in a if y > x]
    if above:
        best = max(best, min(above) - x)
print(best)
''',
        tests=lambda r: [nl([4, 4]), nl([0, 10 ** 9]), nl([9, 1]), nl([5, 5, 5, 6]), nl(list(range(0, 500, 5)))] + [
            nl(rl(r, n, 0, k)) for n, k in ((5, 20), (50, 1000), (400, 10 ** 9), (400, 10 ** 4))],
    ),
    Problem(
        slug='medal-table', title='The Medal Table', level=2,
        statement='<p>Build the medal table of a sports event. Countries with more <strong>gold</strong> medals rank higher; if gold is equal, more <strong>silver</strong> ranks higher; '
                  'if that is equal too, more <strong>bronze</strong>; and if all three are equal, the countries go in alphabetical order of their names.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds a country name (one word) and its gold, silver and bronze counts.</p>',
        output='<p><code>n</code> lines in table order, each written like the input: <code>name gold silver bronze</code>.</p>',
        constraints='<p>1 ≤ n ≤ 200; names are different, 1 to 12 letters; every count is between 0 and 50.</p>',
        examples=[('4\nNorway 5 3 2\nChina 5 4 1\nJapan 2 8 8\nBrazil 5 3 2\n', 'China 5 4 1\nBrazil 5 3 2\nNorway 5 3 2\nJapan 2 8 8\n')],
        hint='<p>Compare gold first; only if equal compare silver; only if equal compare bronze; only if equal compare names. Writing this as a small function keeps the sorting loop clean.</p>',
        solution=r'''
def after(x, y):
    for k in (1, 2, 3):
        if x[k] != y[k]:
            return x[k] < y[k]
    return x[0] > y[0]


n = int(input())
t = []
for _ in range(n):
    name, g, s, b = input().split()
    t.append((name, int(g), int(s), int(b)))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if after(t[j], t[j + 1]):
            t[j], t[j + 1] = t[j + 1], t[j]
for row in t:
    print(*row)
''',
        alt=r'''
n = int(input())
t = []
for _ in range(n):
    name, g, s, b = input().split()
    t.append((-int(g), -int(s), -int(b), name))
for g, s, b, name in sorted(t):
    print(name, -g, -s, -b)
''',
        tests=lambda r: [lines(1, 'Peru 0 0 0'), lines(2, 'B 1 0 0', 'A 0 9 9'), lines(3, 'C 1 1 1', 'B 1 1 1', 'A 1 1 1'), lines(3, 'X 0 0 1', 'Y 0 1 0', 'Z 1 0 0')] + [
            (lambda n, k: lines(n, *[f'{nm} {r.randint(0, k)} {r.randint(0, k)} {r.randint(0, k)}'
                                     for nm in r.sample(sorted({word(r, 1, 12, string.ascii_letters) for _ in range(3 * n)}), n)]))(n, k)
            for n, k in ((8, 2), (30, 3), (200, 50), (200, 1))],
    ),
    Problem(
        slug='rearrange-digits', title='Smallest and Largest Rearrangement', level=2,
        statement='<p>Rearrange the digits of a positive whole number to make the <strong>smallest</strong> and the <strong>largest</strong> numbers possible, '
                  'using every digit exactly once. A number may not start with 0 (unless it is just a single 0 — but our number is positive, so this does not happen).</p>',
        input='<p>One positive integer with no leading zeros.</p>',
        output='<p>Two lines: the smallest possible rearrangement, then the largest.</p>',
        constraints='<p>The number has 1 to 18 digits.</p>',
        examples=[('3021\n', '1023\n3210\n', 'Sorting gives 0123, but a number cannot start with 0, so the smallest non-zero digit, 1, goes first.'),
                  ('700\n', '700\n700\n')],
        hint='<p>Sort the digits as characters. For the smallest number, if the first digit is <code>0</code>, swap it with the first non-zero digit.</p>',
        solution=r'''
d = list(input().strip())
n = len(d)
for i in range(n - 1):
    for j in range(n - 1 - i):
        if d[j] > d[j + 1]:
            d[j], d[j + 1] = d[j + 1], d[j]
largest = ''.join(d[::-1])
k = 0
while d[k] == '0':
    k += 1
d[0], d[k] = d[k], d[0]
print(''.join(d))
print(largest)
''',
        alt=r'''
s = input().strip()
first = min(c for c in s if c != '0')
rest = list(s)
rest.remove(first)
print(first + ''.join(sorted(rest)))
print(''.join(sorted(s, reverse=True)))
''',
        tests=['5\n', '10\n', '100000000000000000\n', '987654321\n', '123456789\n', '102030\n', '999999999999999999\n',
               '505\n', '900000000000000001\n', '314159265358979323\n', '200100\n'],
    ),
    Problem(
        slug='most-frequent-first', title='Most Frequent First', level=2,
        statement='<p>Rearrange the numbers so that values that appear <strong>more often</strong> come first. Values that appear equally often go in ascending order. '
                  'All copies of a value stay together: every number from the input is printed, each the same number of times it appeared.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The <code>n</code> rearranged numbers, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ every number ≤ 100.</p>',
        examples=[('8\n4 6 2 6 4 4 3 2\n', '4 4 4 2 2 6 6 3\n', '4 appears three times; 2 and 6 twice each (2 is smaller, so it goes first); 3 once.')],
        hint='<p>Count each value first (a list of 101 counters works). Then sort the different values by "count high to low, value low to high", and print each value <code>count</code> times.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
cnt = [0] * 101
for x in a:
    cnt[x] += 1
vals = [v for v in range(1, 101) if cnt[v] > 0]
k = len(vals)
for i in range(k - 1):
    for j in range(k - 1 - i):
        x, y = vals[j], vals[j + 1]
        if cnt[x] < cnt[y] or (cnt[x] == cnt[y] and x > y):
            vals[j], vals[j + 1] = y, x
out = []
for v in vals:
    out += [v] * cnt[v]
print(*out)
''',
        alt=r'''
input()
a = list(map(int, input().split()))
print(*sorted(a, key=lambda x: (-a.count(x), x)))
''',
        tests=lambda r: [nl([1]), nl([5, 5, 5]), nl([3, 1, 2]), nl([1, 2, 2, 1]), nl([100, 1, 100])] + [
            nl(rl(r, n, 1, k)) for n, k in ((10, 4), (60, 20), (600, 100), (600, 8))],
    ),
    Problem(
        slug='h-index', title='The Scientist\'s Score', level=2,
        statement='<p>A scientist has written <code>n</code> papers, and you know how many times each one has been cited. '
                  'The scientist\'s <em>h-score</em> is the largest number <code>h</code> such that at least <code>h</code> papers have each been cited at least <code>h</code> times.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> citation counts.</p>',
        output='<p>The h-score.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every count ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n3 0 6 1 5\n', '3\n', 'Three papers (3, 6 and 5) have at least 3 citations each, but there are not four papers with at least 4.'),
                  ('3\n0 0 0\n', '0\n')],
        hint='<p>Sort from most cited to least. Look at the paper in position <code>i</code> (counting from 1): if it has at least <code>i</code> citations, then <code>h</code> can be at least <code>i</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] < a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
h = 0
for i in range(n):
    if a[i] >= i + 1:
        h = i + 1
print(h)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
h = 0
for t in range(n + 1):
    if sum(1 for x in a if x >= t) >= t:
        h = t
print(h)
''',
        tests=lambda r: [nl([0]), nl([1]), nl([100]), nl([1, 1]), nl([2, 2]), nl([5] * 5), nl(list(range(600)))] + [
            nl(rl(r, n, 0, k)) for n, k in ((10, 10), (100, 60), (600, 10 ** 6), (600, 600))],
    ),

    # ── Level 3 ──────────────────────────────────────────────────────────
    Problem(
        slug='bubble-work', title='How Hard Did Bubble Sort Work?', level=3,
        statement='<p>Measure the work done by bubble sort with early stopping, exactly as in the tutorial: pass 1 compares <code>n − 1</code> neighbouring pairs, '
                  'pass 2 compares <code>n − 2</code> pairs, and so on; a pair is swapped when its left number is bigger; sorting stops right after a pass with no swaps, or after pass <code>n − 1</code>. '
                  'Count the total number of <strong>comparisons</strong> and the total number of <strong>swaps</strong>.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>Two integers on one line: the number of comparisons and the number of swaps.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n5 1 4 2 8\n', '9 4\n', 'Passes compare 4, 3 and 2 pairs (the third pass finds nothing and stops). Swaps: 3 + 1 + 0.'),
                  ('3\n1 2 3\n', '2 0\n')],
        hint='<p>Count a comparison every time the inner loop runs the <code>if</code>, and a swap every time it swaps. For <code>n = 1</code> there is nothing to compare.</p>',
        explanation='<p>Without simulating: the swaps equal the number of out-of-order pairs, and the number of passes that swap is the largest count of bigger numbers in front of any element. '
                    'Add one more pass for the final check (unless all <code>n − 1</code> passes were already used).</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
comparisons = swaps = 0
for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
        comparisons += 1
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            swaps += 1
            swapped = True
    if not swapped:
        break
print(comparisons, swaps)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
inv = 0
worst = 0
for i in range(n):
    before = sum(1 for k in range(i) if a[k] > a[i])
    inv += before
    worst = max(worst, before)
passes = min(worst + 1, n - 1) if n > 1 else 0
print(sum(n - p for p in range(1, passes + 1)), inv)
''',
        tests=lambda r: [nl([1]), nl([1, 2]), nl([2, 1]), nl([3, 3, 3]), nl(list(range(600, 0, -1))), nl(list(range(1, 601))), nl([2, 1] + list(range(3, 400))),
                         nl(list(range(2, 500)) + [1])] + [nl(rl(r, n, 0, 10 ** 6)) for n in (7, 100, 600)] + [nl(nearly_sorted(r, 600, 25))],
    ),
    Problem(
        slug='shaker-sort', title='Shaker Sort', level=3,
        statement='<p><em>Shaker sort</em> is bubble sort that goes both ways. Keep a left end <code>lo = 1</code> and a right end <code>hi = n</code>. Each <strong>round</strong> does this:</p>'
                  '<ol><li><strong>Forward:</strong> for <code>j = lo, lo + 1, …, hi − 1</code>, compare positions <code>j</code> and <code>j + 1</code> and swap if the left number is bigger. '
                  'The largest number of the range is now at <code>hi</code>, so <code>hi</code> goes down by 1.</li>'
                  '<li><strong>Backward:</strong> for <code>j = hi, hi − 1, …, lo + 1</code>, compare positions <code>j − 1</code> and <code>j</code> and swap if the left number is bigger. '
                  'The smallest number of the range is now at <code>lo</code>, so <code>lo</code> goes up by 1.</li>'
                  '<li>Print the list.</li></ol>'
                  '<p>Rounds continue while <code>lo &lt; hi</code>, but stop right after a round in which no swap happened at all.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One line per round: the list after that round, numbers separated by single spaces.</p>',
        constraints='<p>2 ≤ n ≤ 100; 0 ≤ every number ≤ 1000.</p>',
        examples=[('5\n5 1 4 2 8\n', '1 2 4 5 8\n1 2 4 5 8\n', 'Round 1 sorts the list. Round 2 finds nothing to swap, so it is the last one.'),
                  ('4\n2 3 4 1\n', '1 2 3 4\n1 2 3 4\n', 'Plain bubble sort needs three passes to bring the 1 to the front; shaker sort does it in one backward sweep.')],
        hint='<p>Work with 0-based indexes: <code>lo = 0</code>, <code>hi = n − 1</code>. The forward loop is <code>range(lo, hi)</code>; the backward loop is <code>range(hi, lo, -1)</code> '
             'and compares <code>a[j − 1]</code> with <code>a[j]</code>. Watch the order: shrink <code>hi</code> <em>before</em> the backward sweep.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
lo, hi = 0, n - 1
while lo < hi:
    swapped = False
    for j in range(lo, hi):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            swapped = True
    hi -= 1
    for j in range(hi, lo, -1):
        if a[j - 1] > a[j]:
            a[j - 1], a[j] = a[j], a[j - 1]
            swapped = True
    lo += 1
    print(*a)
    if not swapped:
        break
''',
        alt=r'''
def forward(a, lo, hi):
    """Bubble the largest of a[lo..hi] to hi; return the number of swaps."""
    c = 0
    j = lo
    while j < hi:
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            c += 1
        j += 1
    return c


def backward(a, lo, hi):
    """Sink the smallest of a[lo..hi] to lo; return the number of swaps."""
    c = 0
    j = hi
    while j > lo:
        if a[j - 1] > a[j]:
            a[j - 1], a[j] = a[j], a[j - 1]
            c += 1
        j -= 1
    return c


n = int(input())
a = list(map(int, input().split()))
lo, hi = 0, n - 1
rounds = []
while lo < hi:
    c = forward(a, lo, hi)
    hi -= 1
    c += backward(a, lo, hi)
    lo += 1
    rounds.append(' '.join(map(str, a)))
    if c == 0:
        break
print('\n'.join(rounds))
''',
        tests=lambda r: [nl([1, 2]), nl([2, 1]), nl([4, 4]), nl([5, 4, 3, 2, 1]), nl([1, 2, 3, 4, 5]), nl([2, 3, 4, 5, 6, 1]), nl([6, 1, 2, 3, 4, 5])] + [
            nl(rl(r, r.randint(3, 12), 0, 9)) for _ in range(3)] + [nl(rl(r, 100, 0, 1000)), nl(nearly_sorted(r, 50, 6))],
    ),
    Problem(
        slug='fraction-order', title='Fractions in Order', level=3,
        statement='<p>Sort a list of positive fractions from smallest to largest value. Fractions with the same value (like <code>1/2</code> and <code>2/4</code>) '
                  'are ordered by their <strong>denominator</strong>, smallest first. Print each fraction exactly as it was written.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one fraction <code>p/q</code>.</p>',
        output='<p><code>n</code> lines: the fractions in sorted order.</p>',
        constraints='<p>1 ≤ n ≤ 300; 1 ≤ p, q ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n1/2\n1/3\n2/4\n3/4\n2/6\n', '1/3\n2/6\n1/2\n2/4\n3/4\n')],
        hint='<p>Avoid decimals: <code>a/b &lt; c/d</code> exactly when <code>a·d &lt; c·b</code> (both denominators are positive). Use that in your swap test.</p>',
        explanation='<p>Floating-point division can make two equal fractions look slightly different (or two different ones look equal when the numbers are large). '
                    'Cross-multiplying uses whole numbers only, so it is always exact.</p>',
        solution=r'''
def after(x, y):
    a, b = x
    c, d = y
    if a * d != c * b:
        return a * d > c * b
    return b > d


n = int(input())
f = []
for _ in range(n):
    p, q = input().strip().split('/')
    f.append((int(p), int(q)))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if after(f[j], f[j + 1]):
            f[j], f[j + 1] = f[j + 1], f[j]
for p, q in f:
    print(f'{p}/{q}')
''',
        alt=r'''
from fractions import Fraction
n = int(input())
f = [input().strip() for _ in range(n)]
key = lambda s: (Fraction(int(s.split('/')[0]), int(s.split('/')[1])), int(s.split('/')[1]))
print('\n'.join(sorted(f, key=key)))
''',
        tests=lambda r: [lines(1, '7/3'), lines(2, '2/4', '1/2'), lines(3, '3/3', '1/1', '2/2'), lines(2, '999999/1000000', '999998/999999'),
                         lines(2, '1000000/999999', '999999/999998')] + [
            (lambda n, k: lines(n, *[f'{r.randint(1, k)}/{r.randint(1, k)}' for _ in range(n)]))(n, k) for n, k in ((8, 4), (60, 12), (300, 10 ** 6), (300, 30))] + [
            lines(100, *[(lambda m, p, q: f'{p * m}/{q * m}')(r.randint(1, 50), *r.choice([(1, 2), (2, 3), (3, 7), (1, 1)])) for _ in range(100)])],
    ),
    Problem(
        slug='biggest-number', title='The Biggest Number', level=3,
        statement='<p>You have <code>n</code> cards, each with a positive whole number written on it. Lay all the cards in a row so that, read together as one long number, '
                  'the result is as <strong>large</strong> as possible. Print that number.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> numbers.</p>',
        output='<p>The largest number you can make (it may be very long).</p>',
        constraints='<p>1 ≤ n ≤ 200; 1 ≤ every number ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n3 30 34 5 9\n', '9534330\n'), ('2\n10 2\n', '210\n', '"Larger number first" would give 102, but 210 is bigger.')],
        hint='<p>Sorting by value, or by first digit, fails on <code>3</code> and <code>30</code>. Instead, for two cards <code>x</code> and <code>y</code>, ask which string is bigger: '
             '<code>x + y</code> or <code>y + x</code>? Use that question as the swap test in bubble sort.</p>',
        explanation='<p>The rule "put <code>x</code> before <code>y</code> when <code>x+y &gt; y+x</code>" is consistent (if <code>x</code> beats <code>y</code> and <code>y</code> beats <code>z</code>, '
                    'then <code>x</code> beats <code>z</code>), so sorting with it works. Strings of the same length compare just like numbers, and <code>x+y</code> and <code>y+x</code> always have the same length.</p>',
        solution=r'''
n = int(input())
s = input().split()
for i in range(n - 1):
    for j in range(n - 1 - i):
        if s[j] + s[j + 1] < s[j + 1] + s[j]:
            s[j], s[j + 1] = s[j + 1], s[j]
print(''.join(s))
''',
        alt=r'''
from functools import cmp_to_key
input()
s = input().split()
s.sort(key=cmp_to_key(lambda x, y: int(y + x) - int(x + y)))
print(''.join(s))
''',
        tests=lambda r: [nl([7]), nl([1, 1]), nl([10, 100, 1000]), nl([9, 99, 999, 98]), nl([121, 12]), nl([824, 8247]), nl([1000000, 1, 10])] + [
            nl(rl(r, n, 1, k)) for n, k in ((10, 100), (50, 1000), (200, 10 ** 6))] + [
            nl([int(r.choice(['3', '30', '34', '303', '330', '33'])) for _ in range(150)])],
    ),
    Problem(
        slug='fewest-swaps', title='Fewest Swaps of Any Two', level=3,
        statement='<p>This time you may swap <strong>any two</strong> numbers in one move, not just neighbours. The numbers are all different. '
                  'What is the fewest number of swaps needed to put the list in ascending order?</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> different integers.</p>',
        output='<p>The minimum number of swaps.</p>',
        constraints='<p>1 ≤ n ≤ 1000; the numbers are different, between 1 and 10<sup>9</sup>.</p>',
        examples=[('5\n4 3 1 2 5\n', '3\n'), ('4\n4 3 2 1\n', '2\n', 'Swap 4 with 1, then 3 with 2.')],
        hint='<p>Selection sort makes at most one swap per position, and every swap it makes puts a number into its final place for good. '
             'Count only the swaps it really needs (when the smallest is not already in place).</p>',
        explanation='<p>Why is selection sort optimal here? Draw an arrow from each position to the position where its number belongs. The arrows form loops (cycles). '
                    'A loop of length <code>L</code> needs <code>L − 1</code> swaps, and one swap can never split a loop into more than two. '
                    'So the minimum is <code>n − (number of loops)</code>, and selection sort achieves exactly that.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
swaps = 0
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    if m != i:
        a[i], a[m] = a[m], a[i]
        swaps += 1
print(swaps)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
target = {v: i for i, v in enumerate(sorted(a))}
seen = [False] * n
cycles = 0
for i in range(n):
    if not seen[i]:
        cycles += 1
        j = i
        while not seen[j]:
            seen[j] = True
            j = target[a[j]]
print(n - cycles)
''',
        tests=lambda r: [nl([1]), nl([1, 2]), nl([2, 1]), nl([2, 3, 1]), nl(list(range(600, 0, -1))), nl(list(range(1, 601))),
                         nl(list(range(2, 601)) + [1])] + [nl(r.sample(range(1, 10 ** 9), n)) for n in (8, 100, 600, 600)] + [nl(nearly_sorted(r, 600, 50))],
    ),
    Problem(
        slug='k-neighbour-swaps', title='Best Order with k Swaps', level=3,
        statement='<p>You may swap two <strong>neighbouring</strong> numbers at most <code>k</code> times in total. Make the list as small as possible in '
                  '<em>dictionary order</em>: first make the first number as small as possible, then (keeping that) the second number, and so on.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The best list you can reach, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 500; 0 ≤ k ≤ 10<sup>6</sup>; 0 ≤ every number ≤ 1000.</p>',
        examples=[('5 3\n4 2 5 1 3\n', '1 4 2 5 3\n', 'Bringing the 1 to the front takes 3 neighbour swaps, which uses up all of k.'),
                  ('4 2\n3 1 2 4\n', '1 2 3 4\n')],
        hint='<p>Be greedy. For the first position, the numbers you can afford to bring there are the ones at most <code>k</code> places away. '
             'Pick the smallest of them (the nearest one if there is a tie), slide it to the front one neighbour swap at a time, subtract the cost from <code>k</code>, and move on to the next position.</p>',
        solution=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
for i in range(n):
    if k == 0:
        break
    m = i
    for j in range(i + 1, min(n, i + k + 1)):
        if a[j] < a[m]:
            m = j
    for j in range(m, i, -1):
        a[j - 1], a[j] = a[j], a[j - 1]
    k -= m - i
print(*a)
''',
        alt=r'''
n, k = map(int, input().split())
rest = list(map(int, input().split()))
out = []
while rest:
    window = rest[:k + 1]
    m = window.index(min(window))
    out.append(rest.pop(m))
    k -= m
print(' '.join(map(str, out)))
''',
        tests=lambda r: [nk([5], 3), nk([2, 1], 0), nk([2, 1], 1), nk([3, 2, 1], 1), nk([3, 2, 1], 10 ** 6), nk([1, 1, 1, 0], 2), nk([5, 0, 5, 0], 3)] + [
            nk(rl(r, n, 0, v), k) for n, v, k in ((10, 9, 5), (50, 20, 100), (500, 1000, 3000), (500, 1000, 10 ** 6), (500, 3, 700))],
    ),
    Problem(
        slug='shortest-job-first', title='Shortest Job First', level=3,
        statement='<p><code>n</code> customers are waiting at a single counter; customer <code>i</code> needs <code>t<sub>i</sub></code> minutes to be served. '
                  'Customers are served one after another, and a customer\'s <em>waiting time</em> is the time from the start until their own service begins. '
                  'Choose the serving order that makes the <strong>average waiting time</strong> as small as possible. If two customers need the same time, the smaller customer number goes first.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>t<sub>1</sub> … t<sub>n</sub></code>.</p>',
        output='<p>Two lines: the customer numbers in serving order (separated by single spaces), then the average waiting time printed with <code>f\'{x:.2f}\'</code>.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ t<sub>i</sub> ≤ 1000.</p>',
        examples=[('4\n5 2 8 2\n', '2 4 1 3\n3.75\n', 'Serve times 2, 2, 5, 8. Waiting times: 0, 2, 4, 9. Average 15 / 4 = 3.75.')],
        hint='<p>Everyone behind a customer waits for that customer, so short jobs should go first. Sort the pairs <code>(time, number)</code>, then add up the waiting times as you go.</p>',
        solution=r'''
n = int(input())
t = list(map(int, input().split()))
jobs = [(t[i], i + 1) for i in range(n)]
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if jobs[j] < jobs[m]:
            m = j
    jobs[i], jobs[m] = jobs[m], jobs[i]
clock = total_wait = 0
for need, who in jobs:
    total_wait += clock
    clock += need
print(*[who for need, who in jobs])
print(f'{total_wait / n:.2f}')
''',
        alt=r'''
n = int(input())
t = list(map(int, input().split()))
order = sorted(range(1, n + 1), key=lambda i: t[i - 1])     # stable: ties keep number order
wait = sum(t[order[k] - 1] * (n - 1 - k) for k in range(n))
print(' '.join(map(str, order)))
print(f'{wait / n:.2f}')
''',
        tests=lambda r: [nl([5]), nl([3, 3]), nl([9, 1]), nl([1, 2, 3]), nl([4, 4, 4, 1])] + [
            nl(rl(r, n, 1, k)) for n, k in ((7, 10), (30, 5), (300, 1000), (600, 1000), (600, 3))],
    ),
    Problem(
        slug='merge-ranges', title='Merging Ranges', level=3,
        statement='<p>You are given <code>n</code> ranges of whole numbers <code>[l, r]</code> (both ends included). Merge every group of ranges that <strong>share at least one number</strong> '
                  'into a single range, and print the result from left to right. Ranges that only sit next to each other, like <code>[1, 3]</code> and <code>[4, 6]</code>, share no number and stay separate.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>l r</code>.</p>',
        output='<p>The number of merged ranges on the first line, then each merged range as <code>l r</code> on its own line, in increasing order.</p>',
        constraints='<p>1 ≤ n ≤ 500; 0 ≤ l ≤ r ≤ 10<sup>6</sup>.</p>',
        examples=[('4\n1 3\n8 10\n2 6\n10 12\n', '2\n1 6\n8 12\n', '[1, 3] and [2, 6] share 2 and 3; [8, 10] and [10, 12] share 10.')],
        hint='<p>Sort the ranges by their left end. Walk through them keeping the current merged range: if the next range starts at or before its right end, stretch it; otherwise start a new one.</p>',
        solution=r'''
n = int(input())
g = [tuple(map(int, input().split())) for _ in range(n)]
for i in range(n - 1):
    for j in range(n - 1 - i):
        if g[j] > g[j + 1]:
            g[j], g[j + 1] = g[j + 1], g[j]
merged = [list(g[0])]
for l, r in g[1:]:
    if l <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], r)
    else:
        merged.append([l, r])
print(len(merged))
for l, r in merged:
    print(l, r)
''',
        alt=r'''
n = int(input())
g = [list(map(int, input().split())) for _ in range(n)]
# keep joining any two overlapping ranges until none overlap
changed = True
while changed:
    changed = False
    for i in range(len(g)):
        for j in range(i + 1, len(g)):
            if max(g[i][0], g[j][0]) <= min(g[i][1], g[j][1]):
                g[i] = [min(g[i][0], g[j][0]), max(g[i][1], g[j][1])]
                g.pop(j)
                changed = True
                break
        if changed:
            break
g.sort()
print(len(g))
for l, r in g:
    print(l, r)
''',
        tests=lambda r: [lines(1, '5 5'), lines(2, '1 3', '4 6'), lines(2, '1 3', '3 6'), lines(2, '0 1000000', '5 6'), lines(3, '5 6', '5 6', '5 6'),
                         lines(3, '7 9', '1 2', '3 4')] + [
            (lambda n, span, w: lines(n, *[(lambda l: f'{l} {min(span, l + r.randint(0, w))}')(r.randint(0, span)) for _ in range(n)]))(n, span, w)
            for n, span, w in ((6, 30, 5), (40, 1000, 30), (150, 10 ** 6, 3000), (150, 10 ** 6, 20000))],
    ),
    Problem(
        slug='stable-or-not', title='Did Selection Sort Keep the Order?', level=3,
        statement='<p>Each card has a number and a different name tag. Sort the cards by number with selection sort, exactly like this: for each position <code>i</code> from 1 to <code>n − 1</code>, '
                  'find the card with the smallest number in positions <code>i</code> to <code>n</code> (the <strong>leftmost</strong> such card if there is a tie) and swap it with the card at position <code>i</code>.</p>'
                  '<p>Print the tags in the final order. Then say whether the result is <strong>stable</strong>: every group of cards with the same number is still in the same order as in the input.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds a number and a tag.</p>',
        output='<p>Two lines: the tags in the final order separated by single spaces, then <code>stable</code> or <code>not stable</code>.</p>',
        constraints='<p>1 ≤ n ≤ 300; 0 ≤ every number ≤ 100; tags are different words of 1 to 6 lowercase letters.</p>',
        examples=[('4\n2 a\n2 b\n1 c\n3 d\n', 'c b a d\nnot stable\n', 'Step 1 swaps card c with card a, which jumps a over b.'),
                  ('3\n1 x\n3 y\n2 z\n', 'x z y\nstable\n')],
        hint='<p>Run the selection sort on <code>(number, tag)</code> pairs, but compare only the numbers. To check stability, compare your tag order with the tag order from a sort that is known to be stable '
             '(bubble sort, or Python\'s <code>sorted</code> with a key).</p>',
        solution=r'''
n = int(input())
cards = []
for _ in range(n):
    v, tag = input().split()
    cards.append((int(v), tag))
original = cards[:]
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if cards[j][0] < cards[m][0]:
            m = j
    cards[i], cards[m] = cards[m], cards[i]
print(*[tag for v, tag in cards])
stable = sorted(original, key=lambda c: c[0])
print('stable' if cards == stable else 'not stable')
''',
        alt=r'''
n = int(input())
cards = [input().split() for _ in range(n)]
pos = {c[1]: i for i, c in enumerate(cards)}
for i in range(n - 1):
    rest = [int(c[0]) for c in cards[i:]]
    m = i + rest.index(min(rest))
    cards[i], cards[m] = cards[m], cards[i]
print(' '.join(c[1] for c in cards))
ok = all(not (cards[k][0] == cards[k + 1][0] and pos[cards[k][1]] > pos[cards[k + 1][1]]) for k in range(n - 1))
print('stable' if ok else 'not stable')
''',
        tests=lambda r: [lines(1, '5 solo'), lines(2, '1 a', '1 b'), lines(2, '2 a', '1 b'), lines(3, '1 a', '1 b', '0 c'), lines(3, '0 c', '1 a', '1 b')] + [
            (lambda n, k: (lambda tags: lines(n, *[f'{r.randint(0, k)} {t}' for t in tags]))(r.sample(sorted({word(r, 1, 6) for _ in range(3 * n + 20)}), n)))(n, k)
            for n, k in ((5, 2), (8, 3), (20, 100), (100, 5), (300, 100))],
    ),
    Problem(
        slug='triangle-sticks', title='Triangles from Sticks', level=3,
        statement='<p>You have <code>n</code> sticks. Three sticks can form a triangle if the two shorter ones together are <strong>longer</strong> than the longest one '
                  '(if they are exactly equal, the triangle would be flat, which does not count). How many ways are there to choose three of the sticks that form a triangle? '
                  'Sticks are different objects even if they have the same length.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> stick lengths.</p>',
        output='<p>The number of ways.</p>',
        constraints='<p>3 ≤ n ≤ 300; 1 ≤ every length ≤ 1000.</p>',
        examples=[('4\n2 2 3 4\n', '3\n', 'The sets 2, 2, 3 and 2, 3, 4 (twice, once for each 2) work; 2, 2, 4 is flat.')],
        hint='<p>After sorting, for <code>i &lt; j &lt; k</code> the longest stick is <code>a[k]</code>, so you only need one check: <code>a[i] + a[j] &gt; a[k]</code>. '
             'For a fixed <code>k</code>, can you count all good pairs <code>i, j</code> without trying every pair?</p>',
        explanation='<p>Fix the longest stick <code>k</code>, and start with <code>i</code> at the left and <code>j = k − 1</code>. If <code>a[i] + a[j] &gt; a[k]</code>, then every '
                    '<code>i</code> from here up to <code>j − 1</code> also works with this <code>j</code>: count <code>j − i</code> and move <code>j</code> left. Otherwise move <code>i</code> right. '
                    'That makes the whole count about <code>n²</code> steps instead of <code>n³</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
count = 0
for k in range(2, n):
    i, j = 0, k - 1
    while i < j:
        if a[i] + a[j] > a[k]:
            count += j - i
            j -= 1
        else:
            i += 1
print(count)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
count = 0
for i in range(n):
    for j in range(i + 1, n):
        for k in range(j + 1, n):
            x, y, z = sorted((a[i], a[j], a[k]))
            if x + y > z:
                count += 1
print(count)
''',
        tests=lambda r: [nl([1, 1, 1]), nl([1, 2, 3]), nl([1, 1, 2, 2]), nl([5, 5, 5, 5, 5]), nl([1, 2, 4, 8, 16, 32]), nl(list(range(1, 31)))] + [
            nl(rl(r, n, 1, k)) for n, k in ((8, 10), (40, 100), (120, 1000), (120, 20))],
    ),
    Problem(
        slug='most-meetings', title='As Many Meetings as Possible', level=3,
        statement='<p>There are <code>n</code> meeting requests for one room. Request <code>i</code> wants the room from time <code>s</code> to time <code>e</code>. '
                  'Two accepted meetings may not overlap, but one may start at the very moment another ends. What is the largest number of requests you can accept?</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>s e</code>.</p>',
        output='<p>The largest number of meetings that can be accepted.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ s &lt; e ≤ 10<sup>6</sup>.</p>',
        examples=[('5\n1 4\n3 5\n0 6\n5 7\n8 9\n', '3\n', 'For example 1–4, 5–7 and 8–9.')],
        hint='<p>Which meeting should you accept first? Not the shortest and not the earliest-starting one, but the one that <em>ends</em> earliest: it leaves the most room for the rest. '
             'Sort by end time and be greedy.</p>',
        explanation='<p>Swapping argument: take any best schedule. Its first meeting ends no earlier than the meeting that ends earliest overall, so replacing it with that one still works. '
                    'Repeat the same idea for the rest of the day.</p>',
        solution=r'''
n = int(input())
m = []
for _ in range(n):
    s, e = map(int, input().split())
    m.append((e, s))
for i in range(n - 1):
    k = i
    for j in range(i + 1, n):
        if m[j] < m[k]:
            k = j
    m[i], m[k] = m[k], m[i]
count = 0
free_at = -1
for e, s in m:
    if s >= free_at:
        count += 1
        free_at = e
print(count)
''',
        alt=r'''
n = int(input())
m = sorted((tuple(map(int, input().split())) for _ in range(n)), key=lambda t: t[1])
ends = [e for s, e in m]
best = [0] * (n + 1)          # best[i] = most meetings using only the first i (by end time)
for i in range(1, n + 1):
    s, e = m[i - 1]
    p = 0                     # how many meetings end by time s
    while p < i - 1 and ends[p] <= s:
        p += 1
    best[i] = max(best[i - 1], 1 + best[p])
print(best[n])
''',
        tests=lambda r: [lines(1, '0 1'), lines(2, '0 5', '5 10'), lines(2, '0 6', '5 10'), lines(3, '0 100', '1 2', '3 4'), lines(3, '1 2', '1 2', '1 2')] + [
            (lambda n, span, w: lines(n, *[(lambda s: f'{s} {s + r.randint(1, w)}')(r.randint(0, span)) for _ in range(n)]))(n, span, w)
            for n, span, w in ((8, 20, 6), (50, 200, 30), (400, 10 ** 5, 2000), (400, 990000, 10000), (500, 100, 5))],
    ),
    Problem(
        slug='fair-team', title='The Fairest Team', level=3,
        statement='<p>A coach must pick <code>k</code> of the <code>n</code> players for a team. To keep the team even, the difference between the tallest and the shortest chosen player '
                  'should be as small as possible. Print that smallest possible difference.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds the <code>n</code> heights.</p>',
        output='<p>The smallest possible difference between the tallest and the shortest of <code>k</code> chosen players.</p>',
        constraints='<p>1 ≤ k ≤ n ≤ 1000; 1 ≤ every height ≤ 10<sup>9</sup>.</p>',
        examples=[('7 3\n10 100 300 200 1000 20 30\n', '20\n', 'Choose 10, 20 and 30.')],
        hint='<p>In the sorted list, a best team is always <code>k</code> players standing next to each other. Why would you ever skip someone in between?</p>',
        solution=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if a[j] < a[m]:
            m = j
    a[i], a[m] = a[m], a[i]
best = a[k - 1] - a[0]
for i in range(1, n - k + 1):
    best = min(best, a[i + k - 1] - a[i])
print(best)
''',
        alt=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
best = None
for low in a:                          # try every player as the shortest one
    taller = sorted(x for x in a if x >= low)
    if len(taller) >= k:
        d = taller[k - 1] - low
        if best is None or d < best:
            best = d
print(best)
''',
        tests=lambda r: [nk([5], 1), nk([3, 9], 1), nk([3, 9], 2), nk([4, 4, 4, 4], 3), nk(list(range(1, 101)), 100), nk([1, 1000000000, 2, 999999999], 2)] + [
            nk(rl(r, n, 1, v), k) for n, v, k in ((10, 50, 4), (100, 1000, 10), (400, 10 ** 9, 37), (400, 10 ** 9, 400))],
    ),
]
