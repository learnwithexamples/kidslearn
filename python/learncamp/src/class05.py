"""LearnCamp Class 5 — Insertion sort and sorting in practice."""
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


def word(r, lo, hi, letters='abcdefghijklmnopqrstuvwxyz'):
    return ''.join(r.choice(letters) for _ in range(r.randint(lo, hi)))


def words_input(ws):
    return lines(len(ws), *ws)


def two_sorted(r, n, m, lo, hi):
    return lines(f'{n} {m}', ints(sorted(rl(r, n, lo, hi))), ints(sorted(rl(r, m, lo, hi))))


def nearly_sorted(r, n, swaps, lo, hi):
    a = sorted(rl(r, n, lo, hi))
    for _ in range(swaps):
        i = r.randrange(n - 1)
        a[i], a[i + 1] = a[i + 1], a[i]
    return a


FIRST = ['Anna', 'Ben', 'Cara', 'Dan', 'Eva', 'Finn', 'Gina', 'Hugo', 'Ivy', 'Jack', 'Kim', 'Leo', 'Mia', 'Noah', 'Olga', 'Paul']
LAST = ['Smith', 'Jones', 'Brown', 'Lee', 'Wong', 'Garcia', 'Khan', 'Novak', 'Silva', 'Ito', 'Moore', 'Clark']


def interview_case(r, n):
    ids = r.sample(range(1000, 10000), n)
    m = r.randint(1, max(1, n * 2 // 3))
    while m * 3 // 2 > n:
        m -= 1
    m = max(m, 1)
    rows = [f'{i} {r.randint(60, 100)}' for i in ids]
    return lines(f'{n} {m}', *rows)


CLASS = dict(
    id=5,
    title='Insertion Sort',
    blurb='Sort like a card player, see why nearly sorted data is fast, then sort strings and records by any key and merge sorted lists.',
    summary='''
<p>Bubble sort and selection sort showed that sorting is just a careful pattern of comparing and moving. This
class adds the third classic method, <strong>insertion sort</strong>, which is the one most people already use
when they pick up playing cards. It is short, it is stable, and it is very quick when the data is almost in order,
which is why real libraries still use it for small pieces.</p>
<p>The second half is about sorting the way you will do it every day: with Python's built-in tools, on strings
and on whole records, by whatever rule the problem asks for.</p>
<ul>
    <li>Insertion sort: the idea, a step-by-step trace, the code, and counting its shifts.</li>
    <li>Why shifts equal <em>inversions</em>, why nearly sorted lists are fast, and what <em>stable</em> means.</li>
    <li>Bubble, selection and insertion side by side.</li>
    <li>Ordering strings and characters: dictionary order, ASCII order, ignoring case.</li>
    <li><code>sorted(..., key=..., reverse=...)</code> with tuples and <code>lambda</code> for multi-rule sorting.</li>
    <li>Merging two sorted lists, and other two-pointer tricks that work because the data is sorted.</li>
</ul>''',
    tutorial=[
        dict(h='The card player\'s method', html='''
<p>Imagine you are dealt cards one at a time. The cards already in your hand are kept in order. When a new card
arrives you look from the right end of your hand, slide every card that is <em>bigger</em> than the new one one
place to the right, and drop the new card into the gap. Your hand is in order again.</p>
<p>Insertion sort does exactly that with a list. The left part <code>a[0..i-1]</code> is the "hand" and is
already sorted. The value <code>a[i]</code> is the new card, called the <strong>key</strong>. We shift bigger
values right and put the key into the hole.</p>
<p>Here is the whole run on <code>5 2 4 6 1 3</code>. The sorted part is the hand; the bold number is the key that was just inserted.</p>
<table>
<tr><th>Step</th><th>Key</th><th>Shifted right</th><th>List afterwards</th><th>Shifts</th></tr>
<tr><td>start</td><td></td><td></td><td>5 | 2 4 6 1 3</td><td></td></tr>
<tr><td>i = 1</td><td>2</td><td>5</td><td><b>2</b> 5 | 4 6 1 3</td><td>1</td></tr>
<tr><td>i = 2</td><td>4</td><td>5</td><td>2 <b>4</b> 5 | 6 1 3</td><td>1</td></tr>
<tr><td>i = 3</td><td>6</td><td>nothing</td><td>2 4 5 <b>6</b> | 1 3</td><td>0</td></tr>
<tr><td>i = 4</td><td>1</td><td>6, 5, 4, 2</td><td><b>1</b> 2 4 5 6 | 3</td><td>4</td></tr>
<tr><td>i = 5</td><td>3</td><td>6, 5, 4</td><td>1 2 <b>3</b> 4 5 6</td><td>3</td></tr>
</table>
<div class="lc-key">After step <code>i</code>, the first <code>i + 1</code> values are sorted among themselves.
They are not yet in their final places (the 1 was still to come), which is different from selection sort,
where each step fixes one value for good.</div>'''),
        dict(h='Writing insertion sort', html='''
<p>Copy the key out, then walk left with an index <code>j</code> while the value there is bigger than the key,
moving each one a step right. When the loop stops, <code>j + 1</code> is the hole.</p>
<pre class="try" data-input="6\\n5 2 4 6 1 3">n = int(input())
a = list(map(int, input().split()))
for i in range(1, n):
    key = a[i]
    j = i - 1
    while j &gt;= 0 and a[j] &gt; key:
        a[j + 1] = a[j]      # shift the bigger value right
        j -= 1
    a[j + 1] = key           # drop the key into the hole
    print('after step', i, ':', *a)
print(*a)</pre>
<div class="lc-warn">Check <code>j &gt;= 0</code> <em>first</em>. If <code>j</code> becomes −1 and you test
<code>a[j]</code>, Python happily reads the <em>last</em> item instead of crashing, and the sort goes wrong
silently.</div>
<p>To sort from largest to smallest, only the comparison changes: shift while <code>a[j] &lt; key</code>.</p>
<pre class="try">a = [3, 9, 1, 9, 4]
for i in range(1, len(a)):
    key = a[i]
    j = i - 1
    while j &gt;= 0 and a[j] &lt; key:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = key
print(a)</pre>'''),
        dict(h='Shifts, inversions and nearly sorted data', html='''
<p>A pair of positions <code>i &lt; j</code> with <code>a[i] &gt; a[j]</code> is called an
<strong>inversion</strong>: two values in the wrong order. Every shift in insertion sort moves a bigger value
past a smaller one, fixing exactly one inversion and never creating new ones. So:</p>
<div class="lc-key">The number of shifts insertion sort makes equals the number of inversions in the list.</div>
<pre class="try">a = [5, 2, 4, 6, 1, 3]
inv = 0
for i in range(len(a)):
    for j in range(i + 1, len(a)):
        if a[i] &gt; a[j]:
            inv += 1
print('inversions:', inv)

shifts = 0
b = a[:]
for i in range(1, len(b)):
    key, j = b[i], i - 1
    while j &gt;= 0 and b[j] &gt; key:
        b[j + 1] = b[j]
        j -= 1
        shifts += 1
    b[j + 1] = key
print('shifts:', shifts)</pre>
<p>That explains its speed:</p>
<ul>
<li><strong>Already sorted:</strong> no inversions, so every key stops after one comparison. About
<code>n</code> steps in total.</li>
<li><strong>Nearly sorted</strong> (each value only a few places from home): few inversions, so still close to
<code>n</code> steps.</li>
<li><strong>Reversed:</strong> every pair is an inversion, <code>n(n−1)/2</code> shifts. For 1000 numbers that is
about half a million.</li>
</ul>
<div class="lc-tip">This is why insertion sort is used for lists that are "almost done", such as a sorted list
that just had a few new values added at the end.</div>'''),
        dict(h='Stability and the three simple sorts', html='''
<p>A sort is <strong>stable</strong> if values that compare equal stay in the order they had before. Insertion
sort is stable because it only shifts values that are strictly <em>bigger</em> than the key (<code>&gt;</code>, not
<code>&gt;=</code>), so a key never jumps over an equal value.</p>
<p>Stability matters when you sort <em>records</em>. If a list of students is already in sign-up order and you
sort it by score with a stable sort, students with equal scores are still in sign-up order.</p>
<table>
<tr><th></th><th>Bubble sort</th><th>Selection sort</th><th>Insertion sort</th></tr>
<tr><td>Idea</td><td>swap neighbours that are out of order; big values drift to the end</td>
<td>find the smallest of the rest and swap it to the front</td><td>take the next value and slide it into the sorted part</td></tr>
<tr><td>Comparisons, worst case</td><td>about n²/2</td><td>always n(n−1)/2</td><td>about n²/2</td></tr>
<tr><td>Already sorted input</td><td>n−1 comparisons, if it stops after a pass with no swaps</td><td>still n(n−1)/2</td><td>n−1 comparisons, no shifts</td></tr>
<tr><td>Values moved</td><td>one swap per inversion</td><td>at most n−1 swaps</td><td>one shift per inversion</td></tr>
<tr><td>Stable?</td><td>yes</td><td>no (the long swap can jump over an equal value)</td><td>yes</td></tr>
</table>
<div class="lc-key">All three take about n² steps on random data. Python's own <code>sorted</code> takes about
n·log n steps and is stable. Write the simple sorts to understand them; use <code>sorted</code> when you only
need the answer.</div>'''),
        dict(h='Sorting strings and characters', html='''
<p>Strings are compared character by character using their codes, just like words in a dictionary. If one word is
the start of the other, the shorter one comes first. Because every capital letter (65–90) has a smaller code than
every small letter (97–122), <strong>all uppercase words come before lowercase ones</strong>.</p>
<pre class="try">print(sorted(['pear', 'apple', 'Zebra', 'app', 'banana', 'Apple']))
print('apple' &lt; 'apply', 'app' &lt; 'apple', 'Zoo' &lt; 'ant')</pre>
<p><code>sorted</code> on a string gives a <em>list</em> of its characters in code order; <code>join</code>
turns that back into a string. Spaces (code 32) and digits come before letters.</p>
<pre class="try" data-input="Hello World 42">s = input()
print(sorted(s))
print(''.join(sorted(s)))
print(''.join(sorted(s.replace(' ', ''))))
print(''.join(sorted(s, reverse=True)))</pre>
<p>To ignore case, sort by the lowercase version of each word. The words themselves are not changed.</p>
<pre class="try">w = ['banana', 'Apple', 'cherry', 'apple', 'Banana']
print(sorted(w))                  # ASCII order
print(sorted(w, key=str.lower))   # dictionary order, case ignored</pre>
<div class="lc-tip">Two words are anagrams exactly when <code>sorted(a) == sorted(b)</code>: sorting puts the
letters of each word into a standard order.</div>'''),
        dict(h='Sorting records with key and reverse', html='''
<p><code>sorted(items, key=f)</code> calls <code>f</code> on every item and sorts by what it returns. A
<code>lambda</code> is a one-line function written right where it is needed. <code>reverse=True</code> turns the
order around.</p>
<pre class="try">words = ['kiwi', 'fig', 'banana', 'apple', 'plum']
print(sorted(words, key=len))                     # by length; equal lengths keep their order
print(sorted(words, key=lambda w: w[-1]))         # by last letter
print(sorted([15, 3, 42, 8], reverse=True))       # biggest first</pre>
<p><strong>Several rules at once.</strong> Tuples compare item by item: first items first, and only on a tie the
second items, and so on. So return a tuple from the key, most important rule first.</p>
<pre class="try">words = ['kiwi', 'fig', 'banana', 'apple', 'plum', 'date']
print(sorted(words, key=lambda w: (len(w), w)))   # by length, then alphabetically</pre>
<p>For "biggest score first, then name A to Z", one rule goes down and the other goes up. Put a minus sign on the
number so that bigger numbers sort first:</p>
<pre class="try" data-input="4\\nzoe 90\\namy 85\\nbob 90\\ncat 85">n = int(input())
people = []
for _ in range(n):
    name, score = input().split()
    people.append((name, int(score)))
for name, score in sorted(people, key=lambda p: (-p[1], p[0])):
    print(name, score)</pre>
<div class="lc-key"><code>sorted</code> is stable. If the problem says "equal ones keep the input order", sort
by the main rule only and stability does the rest. <code>reverse=True</code> keeps that promise too: equal items
are not flipped.</div>
<div class="lc-warn">Read numbers as <code>int</code> before sorting them. As strings, <code>'100' &lt; '9'</code>
because <code>'1'</code> comes before <code>'9'</code>.</div>'''),
        dict(h='Merging two sorted lists', html='''
<p>Two lists that are already sorted can be combined into one sorted list in a single pass. Keep one pointer in
each list. Compare the two values they point at, copy the smaller one into the answer and move that pointer on.
When one list runs out, copy the rest of the other.</p>
<pre class="try" data-input="1 4 7 8\\n2 4 6 9 10">a = list(map(int, input().split()))
b = list(map(int, input().split()))
i = j = 0
out = []
while i &lt; len(a) and j &lt; len(b):
    if a[i] &lt;= b[j]:
        out.append(a[i])
        i += 1
    else:
        out.append(b[j])
        j += 1
out += a[i:] + b[j:]     # one of these is empty
print(*out)</pre>
<p>Each step moves one pointer forward, so the whole merge takes about <code>len(a) + len(b)</code> steps.
The same <strong>two-pointer</strong> idea answers many questions about sorted lists: values the two lists have
in common, the closest pair across two lists, or pairs inside one list that add up to a target.</p>
<pre class="try">a = [1, 3, 4, 6, 7, 9]      # sorted
target = 10
i, j = 0, len(a) - 1
while i &lt; j:
    s = a[i] + a[j]
    if s == target:
        print(a[i], '+', a[j])
        i += 1
        j -= 1
    elif s &lt; target:
        i += 1               # need a bigger sum
    else:
        j -= 1               # need a smaller sum</pre>'''),
        dict(h='Keeping a list sorted as values arrive', html='''
<p>Sometimes the numbers come one at a time and you must answer a question after each one: "what is the
middle value so far?", "what rank is this new score?". Instead of sorting everything again each time, do one
insertion-sort step: append the new value, then slide it left into place.</p>
<pre class="try" data-input="6\\n5 2 8 1 9 3">n = int(input())
nums = list(map(int, input().split()))
hand = []
for x in nums:
    hand.append(x)
    j = len(hand) - 2
    while j &gt;= 0 and hand[j] &gt; x:
        hand[j + 1] = hand[j]
        j -= 1
    hand[j + 1] = x
    print(hand)</pre>
<p>Python's <code>bisect</code> module finds the right position with binary search, halving the range each step:
<code>bisect_right(a, x)</code> is the number of items <code>&lt;= x</code>, which is exactly the index where
<code>x</code> goes after any equal values. <code>insort</code> finds that place and inserts.</p>
<pre class="try">from bisect import bisect_left, bisect_right, insort
a = [1, 3, 3, 6, 9]
print(bisect_left(a, 3), bisect_right(a, 3))   # 1 3
insort(a, 4)
print(a)</pre>'''),
    ],
)

# ── Problems ─────────────────────────────────────────────────────────────
PROBLEMS = [
    # ── Level 1 ──────────────────────────────────────────────────────────
    Problem(
        slug='insertion-sort', title='Insertion Sort', level=1,
        statement='<p>Sort a list of whole numbers from smallest to largest. Write the sorting yourself using '
                  '<strong>insertion sort</strong>: take each number in turn, shift the bigger numbers before it one place '
                  'to the right, and drop it into the gap.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>The <code>n</code> numbers in increasing order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ every number ≤ 10<sup>9</sup>.</p>',
        examples=[('5\n1 4 2 3 5\n', '1 2 3 4 5\n'), ('4\n7 7 0 3\n', '0 3 7 7\n')],
        hint='<p>Keep the key in a variable, then use a <code>while</code> loop that walks left as long as the index is '
             'not negative and the value there is bigger than the key.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(1, n):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = key
print(*a)
''',
        alt=r'''
n = int(input())
print(*sorted(map(int, input().split())))
''',
        tests=lambda r: [nl([0]), nl([10 ** 9, 0]), nl([5, 5, 5, 5]), nl(list(range(1, 401))),
                         nl(sorted(rl(r, 400, 0, 10 ** 9), reverse=True)), nl(rl(r, 1000, 0, 999)),
                         nl(nearly_sorted(r, 450, 20, 0, 10 ** 9))] + [nl(rl(r, r.randint(2, 450), 0, 10 ** 9)) for _ in range(4)],
    ),
    Problem(
        slug='five-biggest-first', title='Five Numbers, Biggest First', level=1,
        statement='<p>You are given five positive whole numbers. Print them from largest to smallest.</p>',
        input='<p>One line with five integers separated by spaces.</p>',
        output='<p>The five numbers in decreasing order, separated by commas (no spaces).</p>',
        constraints='<p>Every number is between 1 and 1000.</p>',
        examples=[('3 2 5 5 4\n', '5,5,4,3,2\n')],
        hint='<p>Sort in reverse, then turn every number into a string so you can <code>join</code> them with <code>\',\'</code>.</p>',
        solution=r'''
a = list(map(int, input().split()))
a.sort(reverse=True)
print(','.join(str(x) for x in a))
''',
        alt=r'''
a = list(map(int, input().split()))
out = []
while a:
    big = max(a)
    out.append(str(big))
    a.remove(big)
print(','.join(out))
''',
        tests=lambda r: ['1 1 1 1 1\n', '1 2 3 4 5\n', '1000 999 1 1000 2\n', '5 4 3 2 1\n', '9 100 10 1000 1\n']
        + [ints(rl(r, 5, 1, 1000)) for _ in range(5)],
    ),
    Problem(
        slug='names-in-order', title='Names in Dictionary Order', level=1,
        statement='<p>A teacher has a list of names and wants them in dictionary order. Print the names sorted alphabetically.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one name.</p>',
        output='<p>The <code>n</code> names in dictionary order, one per line.</p>',
        constraints='<p>1 ≤ n ≤ 1000; every name is 1 to 20 lowercase letters. Names may repeat.</p>',
        examples=[('3\nabd\nabc\nbcd\n', 'abc\nabd\nbcd\n')],
        hint='<p>Python already compares strings in dictionary order. Remember that a word comes before any longer word that starts with it.</p>',
        solution=r'''
n = int(input())
names = [input() for _ in range(n)]
names.sort()
for s in names:
    print(s)
''',
        alt=r'''
n = int(input())
a = [input() for _ in range(n)]
for i in range(1, n):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = key
print('\n'.join(a))
''',
        tests=lambda r: [words_input(['solo']), words_input(['abc', 'ab', 'a', 'abcd']), words_input(['zz', 'zz', 'a']),
                         words_input(['b' * 20, 'a' * 20])]
        + [words_input([word(r, 1, 5, 'abc') for _ in range(r.randint(2, 60))]) for _ in range(3)]
        + [words_input([word(r, 1, 8) for _ in range(r.randint(100, 500))]) for _ in range(2)],
    ),
    Problem(
        slug='sort-the-characters', title='Sorting Characters', level=1,
        statement='<p>Read one line of text. Throw away all the spaces and print the other characters sorted by their ASCII code, smallest first.</p>',
        input='<p>One line of printable ASCII characters. It may contain spaces anywhere, including at the start and the end.</p>',
        output='<p>One line: the characters that are not spaces, in ASCII order, with nothing between them.</p>',
        constraints='<p>The line has at most 100000 characters and at least one character that is not a space.</p>',
        examples=[('I am a boy\n', 'Iaabmoy\n')],
        hint='<p>Read the whole line with <code>input()</code> (not <code>split</code>). <code>sorted</code> on a string gives a list of characters; <code>\'\'.join</code> glues them back.</p>',
        solution=r'''
s = input()
s = s.replace(' ', '')
print(''.join(sorted(s)))
''',
        alt=r'''
s = input()
count = [0] * 128
for c in s:
    count[ord(c)] += 1
out = []
for code in range(33, 128):
    out.append(chr(code) * count[code])
print(''.join(out))
''',
        tests=lambda r: ['x\n', '   z   \n', 'Zz Aa 09 !~\n', 'banana BANANA\n', '  Hello, World!  \n']
        + [''.join(r.choice([chr(c) for c in range(33, 127)] + [' '] * 10) for _ in range(r.randint(20, 5000))) + '!\n' for _ in range(5)],
    ),
    Problem(
        slug='apple-picking', title='Apple Picking', level=1,
        statement='<p>Ten apples hang on a tree, each at some height. A girl can reach up to a certain height with her hand, '
                  'and she also has a stool 30 cm tall to stand on. She can pick an apple if its height is at most her reach plus 30. '
                  'How many of the ten apples can she pick?</p>',
        input='<p>The first line holds 10 integers: the heights of the apples in centimetres. '
              'The second line holds one integer: the highest point she can touch without the stool.</p>',
        output='<p>One integer: the number of apples she can pick.</p>',
        constraints='<p>Apple heights are between 100 and 200; her reach is between 100 and 120.</p>',
        examples=[('100 200 150 140 129 134 167 198 200 111\n110\n', '5\n', '<p>With the stool she reaches 140, and five apples hang at 140 or lower.</p>')],
        hint='<p>Work out the highest point she can reach with the stool once, then count the apples not above it.</p>',
        solution=r'''
apples = list(map(int, input().split()))
reach = int(input()) + 30
print(sum(1 for h in apples if h <= reach))
''',
        alt=r'''
apples = sorted(map(int, input().split()))
reach = int(input()) + 30
k = 0
while k < len(apples) and apples[k] <= reach:
    k += 1
print(k)
''',
        tests=lambda r: [lines(ints([100] * 10), 100), lines(ints([200] * 10), 120), lines(ints([200] * 10), 100),
                         lines(ints([130, 131, 150, 151, 149, 100, 200, 160, 140, 129]), 120)]
        + [lines(ints(rl(r, 10, 100, 200)), r.randint(100, 120)) for _ in range(6)],
    ),
    Problem(
        slug='count-in-range', title='How Many in the Range?', level=1,
        statement='<p>Read a list of numbers, then answer some questions. Each question gives two numbers <code>l</code> and <code>r</code>: '
                  'how many numbers of the list are between <code>l</code> and <code>r</code>, both included?</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers. The third line holds <code>q</code>, '
              'and each of the next <code>q</code> lines holds <code>l</code> and <code>r</code>.</p>',
        output='<p><code>q</code> lines, one answer per question.</p>',
        constraints='<p>1 ≤ n, q ≤ 1000; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>; l ≤ r.</p>',
        examples=[('6\n5 1 9 3 7 3\n3\n3 7\n10 20\n1 1\n', '4\n0\n1\n')],
        hint='<p>Sort the list once. In a sorted list the numbers inside a range sit next to each other, and <code>bisect</code> can find both edges of that block.</p>',
        solution=r'''
from bisect import bisect_left, bisect_right
n = int(input())
a = sorted(map(int, input().split()))
q = int(input())
for _ in range(q):
    l, r = map(int, input().split())
    print(bisect_right(a, r) - bisect_left(a, l))
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
q = int(input())
for _ in range(q):
    l, r = map(int, input().split())
    print(sum(1 for x in a if l <= x <= r))
''',
        tests=lambda r: [lines(1, 5, 2, '5 5', '6 9'), lines(3, '2 2 2', 2, '1 3', '-1000000 1000000'), lines(2, '-1000000 1000000', 1, '-1000000 1000000')]
        + [(lambda n, q: lines(n, ints(rl(r, n, -100, 100)), q, *[(lambda l: f'{l} {l + r.randint(0, 60)}')(r.randint(-120, 100)) for _ in range(q)]))(r.randint(1, 300), r.randint(1, 200)) for _ in range(6)],
    ),
    Problem(
        slug='insert-into-sorted', title='One More Card', level=1,
        statement='<p>You are holding a sorted row of numbers and get one more number <code>x</code>. Put it in the right place so the row '
                  'stays sorted, and print the new row. Try to do it the insertion-sort way: add it at the end and slide it left.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers in non-decreasing order. The third line holds <code>x</code>.</p>',
        output='<p>The <code>n + 1</code> numbers in non-decreasing order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('5\n2 4 4 7 9\n5\n', '2 4 4 5 7 9\n'), ('3\n1 2 3\n0\n', '0 1 2 3\n')],
        hint='<p>Append <code>x</code>, then while the number to its left is bigger, swap or shift. You never have to look past the first number that is not bigger.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
x = int(input())
a.append(x)
j = n - 1
while j >= 0 and a[j] > x:
    a[j + 1] = a[j]
    j -= 1
a[j + 1] = x
print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
x = int(input())
print(*sorted(a + [x]))
''',
        tests=lambda r: [lines(1, 5, 5), lines(1, 5, 9), lines(1, 5, -9), lines(4, '1 1 1 1', 1), lines(3, '-3 0 3', 1000000)]
        + [lines(n := r.randint(1, 400), ints(sorted(rl(r, n, -1000, 1000))), r.randint(-1100, 1100)) for _ in range(5)],
    ),
    Problem(
        slug='first-and-last-word', title='First and Last in the Dictionary', level=1,
        statement='<p>Of a list of words, which one would come first in a dictionary, and which one would come last?</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one word of lowercase letters.</p>',
        output='<p>Two lines: the word that comes first in dictionary order, then the word that comes last.</p>',
        constraints='<p>1 ≤ n ≤ 1000; each word has 1 to 20 letters. Words may repeat.</p>',
        examples=[('4\nmango\napple\nzebra\napp\n', 'app\nzebra\n', '<p><code>app</code> comes before <code>apple</code> because it is the start of it.</p>')],
        hint='<p>Strings can be compared with <code>&lt;</code> and <code>&gt;</code>, so <code>min</code> and <code>max</code> work on them too. '
             'You do not even need to sort the whole list.</p>',
        solution=r'''
n = int(input())
words = [input() for _ in range(n)]
print(min(words))
print(max(words))
''',
        alt=r'''
n = int(input())
words = sorted(input() for _ in range(n))
print(words[0])
print(words[-1])
''',
        tests=lambda r: [words_input(['solo']), words_input(['b', 'a']), words_input(['aa', 'a', 'aaa']), words_input(['z' * 20, 'z' * 19 + 'y'])]
        + [words_input([word(r, 1, 6, 'abc' if k % 2 else string.ascii_lowercase) for _ in range(r.randint(2, 500))]) for k in range(6)],
    ),
    Problem(
        slug='letters-any-case', title='Letters in Order, Any Case', level=1,
        statement='<p>Rearrange the letters of a word into alphabetical order, treating capital and small letters as the same letter. '
                  'When the same letter appears in both forms, the capital ones come before the small ones.</p>',
        input='<p>One line with a word made of English letters.</p>',
        output='<p>The rearranged word.</p>',
        constraints='<p>The word has 1 to 1000 letters.</p>',
        examples=[('bAnaNa\n', 'AaabNn\n')],
        hint='<p>Sort with a key that is a pair: the lowercase version of the letter first, and the letter itself second. '
             'Why does the second part put <code>A</code> before <code>a</code>?</p>',
        solution=r'''
s = input().strip()
print(''.join(sorted(s, key=lambda c: (c.lower(), c))))
''',
        alt=r'''
s = input().strip()
out = ''
for c in 'abcdefghijklmnopqrstuvwxyz':
    out += c.upper() * s.count(c.upper()) + c * s.count(c)
print(out)
''',
        tests=lambda r: ['a\n', 'Z\n', 'aA\n', 'Aa\n', 'zZyYxX\n', 'Banana\n']
        + [word(r, 1, 1000, 'abcABC' if k % 2 else string.ascii_letters) + '\n' for k in range(5)],
    ),
    Problem(
        slug='sort-a-section', title='Sort Just the Middle', level=1,
        statement='<p>Sort only part of a list: the numbers from position <code>l</code> to position <code>r</code> (counting from 1, both included) '
                  'go into increasing order, and every other number stays where it is.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers. The third line holds <code>l</code> and <code>r</code>.</p>',
        output='<p>The whole list after the change, separated by single spaces.</p>',
        constraints='<p>1 ≤ l ≤ r ≤ n ≤ 1000; every number is between −1000 and 1000.</p>',
        examples=[('7\n9 8 7 6 5 4 3\n2 5\n', '9 5 6 7 8 4 3\n')],
        hint='<p>Slice out the piece, sort it, and glue the three pieces back together. Position <code>l</code> is index <code>l - 1</code>.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
l, r = map(int, input().split())
a[l - 1:r] = sorted(a[l - 1:r])
print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
l, r = map(int, input().split())
for i in range(l, r):
    key = a[i]
    j = i - 1
    while j >= l - 1 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = key
print(*a)
''',
        tests=lambda r: [lines(1, 5, '1 1'), lines(3, '3 2 1', '1 3'), lines(3, '3 2 1', '2 2'), lines(4, '4 3 2 1', '3 4')]
        + [(lambda n: (lambda l: lines(n, ints(rl(r, n, -1000, 1000)), f'{l} {r.randint(l, n)}'))(r.randint(1, n)))(r.randint(2, 400)) for _ in range(6)],
    ),
    Problem(
        slug='ascii-word-order', title='Capitals Go First', level=1,
        statement='<p>Sort the words of a line by plain ASCII order, the way Python compares strings. Because capital letters have smaller codes than '
                  'small letters, every word that starts with a capital comes before every word that starts with a small letter.</p>',
        input='<p>One line of words separated by spaces. Each word is made of English letters, small or capital.</p>',
        output='<p>The words in ASCII order on one line, separated by single spaces.</p>',
        constraints='<p>1 to 300 words; each word has 1 to 10 letters. Words may repeat.</p>',
        examples=[('banana Apple cherry apple Banana\n', 'Apple Banana apple banana cherry\n')],
        hint='<p>No special rule is needed: <code>split</code> the line and sort the list as it is.</p>',
        solution=r'''
words = input().split()
words.sort()
print(' '.join(words))
''',
        alt=r'''
words = input().split()
key = lambda w: [ord(c) for c in w]
print(*sorted(words, key=key))
''',
        tests=lambda r: ['Hello\n', 'b B a A\n', 'aaa aa a AAA AA A\n', 'Zebra apple\n', 'cat Cat cAt caT\n']
        + [' '.join(word(r, 1, 10, 'abcABC' if k % 2 else string.ascii_letters) for _ in range(r.randint(2, 300))) for k in range(5)],
    ),
    Problem(
        slug='anagram-check', title='Same Letters?', level=1,
        statement='<p>Two words are <strong>anagrams</strong> if one can be made by rearranging all the letters of the other, '
                  'like <code>listen</code> and <code>silent</code>. Decide whether two given words are anagrams.</p>',
        input='<p>Two lines, each with one word of lowercase letters.</p>',
        output='<p><code>YES</code> if they are anagrams, otherwise <code>NO</code>.</p>',
        constraints='<p>Each word has 1 to 1000 letters. The words may have different lengths.</p>',
        examples=[('listen\nsilent\n', 'YES\n'), ('apple\npaper\n', 'NO\n')],
        hint='<p>Sort the letters of each word. What do two anagrams look like after that?</p>',
        solution=r'''
a = input()
b = input()
print('YES' if sorted(a) == sorted(b) else 'NO')
''',
        alt=r'''
a = input()
b = input()
ok = len(a) == len(b) and all(a.count(c) == b.count(c) for c in set(a))
print('YES' if ok else 'NO')
''',
        tests=lambda r: ['a\na\n', 'a\nb\n', 'ab\nba\n', 'aab\nabb\n', 'abc\nabcd\n', 'stop\npots\n']
        + [(lambda w: lines(w, ''.join(r.sample(w, len(w)))))(word(r, 1, 1000, 'abcde')) for _ in range(3)]
        + [(lambda w: lines(w, ''.join(r.sample(w, len(w) - 1)) + r.choice('abcde')))(word(r, 2, 1000, 'abcde')) for _ in range(3)],
    ),
    Problem(
        slug='by-last-letter', title='Sorted by the Last Letter', level=1,
        statement='<p>Sort a list of words by their <strong>last</strong> letter, from <code>a</code> to <code>z</code>. '
                  'Words that end with the same letter keep the order in which they appear in the input.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one word of lowercase letters.</p>',
        output='<p>The words in the new order, one per line.</p>',
        constraints='<p>1 ≤ n ≤ 500; each word has 1 to 10 letters.</p>',
        examples=[('6\nlemon\nkiwi\nbanana\nmelon\nfig\nplum\n', 'banana\nfig\nkiwi\nplum\nlemon\nmelon\n')],
        hint='<p>Use a <code>key</code> that picks the last character. Python\'s sort is stable, so ties look after themselves.</p>',
        solution=r'''
n = int(input())
words = [input() for _ in range(n)]
for w in sorted(words, key=lambda w: w[-1]):
    print(w)
''',
        alt=r'''
n = int(input())
words = [input() for _ in range(n)]
for c in 'abcdefghijklmnopqrstuvwxyz':
    for w in words:
        if w[-1] == c:
            print(w)
''',
        tests=lambda r: [words_input(['a']), words_input(['ba', 'ab']), words_input(['xa', 'ya', 'za']), words_input(['z', 'y', 'x'])]
        + [words_input([word(r, 1, 10, 'abcd' if k % 2 else string.ascii_lowercase) for _ in range(r.randint(2, 450))]) for k in range(6)],
    ),
    Problem(
        slug='where-will-i-stand', title='Where Will I Stand?', level=1,
        statement='<p>The class lines up from shortest to tallest. Tom\'s height is the first number in the list; the others are his classmates\' heights. '
                  'All heights are different. At which place in the line (counting from 1) will Tom stand?</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> heights in centimetres, Tom\'s first.</p>',
        output='<p>One integer: Tom\'s place in the line.</p>',
        constraints='<p>1 ≤ n ≤ 1000; heights are different integers between 100 and 2000.</p>',
        examples=[('5\n150 162 145 158 139\n', '3\n', '<p>Only 139 and 145 are shorter, so Tom is third.</p>')],
        hint='<p>You could sort and look up Tom\'s height, but there is a shortcut: his place is one more than the number of shorter classmates.</p>',
        solution=r'''
n = int(input())
h = list(map(int, input().split()))
print(1 + sum(1 for x in h if x < h[0]))
''',
        alt=r'''
n = int(input())
h = list(map(int, input().split()))
print(sorted(h).index(h[0]) + 1)
''',
        tests=lambda r: [nl([150]), nl([100, 2000]), nl([2000, 100]), nl(list(range(110, 100, -1)))]
        + [nl(r.sample(range(100, 2001), r.randint(2, 600))) for _ in range(6)],
    ),
    Problem(
        slug='most-toys', title='As Many Toys as Possible', level=1,
        statement='<p>A shop sells <code>n</code> different toys, each with its own price. You have <code>B</code> coins and want to buy as many toys as possible '
                  '(at most one of each). How many toys can you buy?</p>',
        input='<p>The first line holds <code>n</code> and <code>B</code>. The second line holds the <code>n</code> prices.</p>',
        output='<p>One integer: the largest number of toys whose total price is at most <code>B</code>.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ price ≤ 10<sup>6</sup>; 0 ≤ B ≤ 10<sup>9</sup>.</p>',
        examples=[('5 20\n8 3 12 5 4\n', '4\n', '<p>3 + 4 + 5 + 8 = 20.</p>'), ('2 1\n5 6\n', '0\n')],
        hint='<p>To fit in as many toys as possible, which toys should you pick first?</p>',
        solution=r'''
n, b = map(int, input().split())
prices = sorted(map(int, input().split()))
count = 0
for p in prices:
    if p > b:
        break
    b -= p
    count += 1
print(count)
''',
        alt=r'''
n, b = map(int, input().split())
p = list(map(int, input().split()))
k = 0
while k < n:
    cheapest = sorted(p)[:k + 1]
    if sum(cheapest) > b:
        break
    k += 1
print(k)
''',
        tests=lambda r: ['1 0\n1\n', '1 1\n1\n', '3 1000000000\n1000000 1000000 1000000\n', '4 10\n10 10 10 10\n', '4 9\n10 10 10 10\n']
        + [(lambda n: lines(f'{n} {r.randint(0, n * 30)}', ints(rl(r, n, 1, 100))))(r.randint(2, 400)) for _ in range(5)],
    ),

    # ── Level 2 ──────────────────────────────────────────────────────────
    Problem(
        slug='caesar-cipher', title='Caesar\'s Secret Message', level=2,
        statement='<p>Encrypt a word by moving every letter <code>t</code> places forward in the alphabet. After <code>z</code> '
                  'the alphabet starts again at <code>a</code> (and after <code>Z</code> at <code>A</code>). Capital letters stay capital, small letters stay small.</p>',
        input='<p>One line: a word made of English letters, then a space, then the integer <code>t</code>.</p>',
        output='<p>The encrypted word.</p>',
        constraints='<p>The word has 1 to 100 letters; 0 ≤ t ≤ 260.</p>',
        examples=[('china 4\n', 'glmre\n'), ('antDZYO 30\n', 'erxHDCS\n', '<p>Moving 30 places is the same as moving 4, because 26 places brings a letter back to itself.</p>')],
        hint='<p>Turn a letter into its position 0–25 with <code>ord</code>, add <code>t</code>, use <code>% 26</code>, and turn it back with <code>chr</code>. Handle capitals with <code>\'A\'</code> as the base.</p>',
        solution=r'''
w, t = input().split()
t = int(t) % 26
out = ''
for c in w:
    base = ord('A') if c.isupper() else ord('a')
    out += chr((ord(c) - base + t) % 26 + base)
print(out)
''',
        alt=r'''
import string
w, t = input().split()
t = int(t)
lo, up = string.ascii_lowercase, string.ascii_uppercase
res = []
for c in w:
    for abc in (lo, up):
        if c in abc:
            res.append(abc[(abc.index(c) + t) % 26])
print(''.join(res))
''',
        tests=lambda r: ['a 0\n', 'z 1\n', 'Z 1\n', 'abc 26\n', 'xyzXYZ 260\n', 'Hello 13\n']
        + [f'{word(r, 1, 100, string.ascii_letters)} {r.randint(0, 260)}\n' for _ in range(5)],
    ),
    Problem(
        slug='word-row-check', title='A Tidy Row of Words', level=2,
        statement='<p>A tidy row is a line made only of the word <code>oier</code> (all lowercase), repeated one or more times, '
                  'with <strong>exactly one</strong> space between neighbouring words and <strong>no</strong> spaces at the start or the end. '
                  'Decide whether a given line is a tidy row.</p>',
        input='<p>One line of text. Read it as it is: spaces at the start and the end are part of the line.</p>',
        output='<p><code>YES</code> if the line is a tidy row, otherwise <code>NO</code>.</p>',
        constraints='<p>The line has 1 to 100 characters: letters and spaces.</p>',
        examples=[('Oier oier oier\n', 'NO\n'), ('oier oier oier\n', 'YES\n'), ('  oier oier   \n', 'NO\n')],
        hint='<p>Do not <code>strip</code> the line, and do not use plain <code>split()</code>, which hides extra spaces. '
             'What does <code>line.split(\' \')</code> give when there are two spaces in a row, or a space at the start?</p>',
        solution=r'''
line = input().rstrip('\n')
parts = line.split(' ')
print('YES' if all(p == 'oier' for p in parts) else 'NO')
''',
        alt=r'''
line = input().rstrip('\n')
words = line.split()
k = len(words)
print('YES' if k > 0 and line == ' '.join(['oier'] * k) else 'NO')
''',
        tests=lambda r: ['oier\n', ' oier\n', 'oier \n', 'oier  oier\n', 'oieroier\n', 'oier oieR\n', '   \n', 'oiers\n', 'oie\n', 'OIER\n',
                         ' '.join(['oier'] * 20) + '\n']
        + [''.join(r.choice(['oier', 'oier', 'oier', ' ', 'Oier', 'oir']) + ' ' for _ in range(r.randint(1, 15))).rstrip(' ') + '\n' for _ in range(3)],
    ),
    Problem(
        slug='merge-two-sorted', title='Merge Two Sorted Lists', level=2,
        statement='<p>Two lists are each sorted from smallest to largest. Combine them into one sorted list. Try to do it in one pass with two pointers, without sorting again.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. The second line holds <code>n</code> integers in non-decreasing order; '
              'the third line holds <code>m</code> integers in non-decreasing order.</p>',
        output='<p>All <code>n + m</code> numbers in non-decreasing order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 10<sup>5</sup> (the tests here are smaller); every number is between −10<sup>9</sup> and 10<sup>9</sup>.</p>',
        examples=[('4 5\n1 4 7 8\n2 4 6 9 10\n', '1 2 4 4 6 7 8 9 10\n')],
        hint='<p>Look at the front of both lists, take the smaller, and step forward in that list only. When one list is used up, the rest of the other is already in order.</p>',
        solution=r'''
n, m = map(int, input().split())
a = list(map(int, input().split()))
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
input()
a = list(map(int, input().split()))
b = list(map(int, input().split()))
print(*sorted(a + b))
''',
        tests=lambda r: ['1 1\n5\n5\n', '1 1\n9\n-9\n', '3 2\n1 2 3\n10 20\n', '2 3\n10 20\n1 2 3\n', '1 4\n-1000000000\n1000000000 1000000000 1000000000 1000000000\n']
        + [two_sorted(r, r.randint(1, 300), r.randint(1, 300), -1000, 1000) for _ in range(3)]
        + [two_sorted(r, r.randint(1, 200), r.randint(1, 200), -10 ** 9, 10 ** 9) for _ in range(2)],
    ),
    Problem(
        slug='score-ranking', title='Ranking by Total Score', level=2,
        statement='<p>Each student has a Chinese score and a maths score. Sort the students by their total score, highest first. '
                  'Students with the same total keep the order in which they appear in the input. Print each student with both scores and the total.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds a name, the Chinese score and the maths score. '
              'The fields are separated by one or more spaces.</p>',
        output='<p><code>n</code> lines, each <code>name chinese maths total</code> with single spaces, in the sorted order.</p>',
        constraints='<p>1 ≤ n ≤ 100; names are 1 to 10 lowercase letters; scores are between 0 and 100.</p>',
        examples=[('4\ngaoxiang 78 96\nwangxi 70 99\nliujia 90 87\nzhangjin 78 91\n',
                   'liujia 90 87 177\ngaoxiang 78 96 174\nwangxi 70 99 169\nzhangjin 78 91 169\n')],
        hint='<p>Use <code>split()</code> with no argument so extra spaces do not matter. A stable sort by the total (biggest first) keeps ties in input order: '
             'either sort by <code>-total</code>, or use <code>reverse=True</code>, which is stable too.</p>',
        solution=r'''
n = int(input())
rows = []
for _ in range(n):
    name, c, m = input().split()
    c, m = int(c), int(m)
    rows.append((name, c, m, c + m))
rows.sort(key=lambda t: -t[3])
for name, c, m, total in rows:
    print(name, c, m, total)
''',
        alt=r'''
n = int(input())
rows = []
for _ in range(n):
    name, c, m = input().split()
    rows.append([name, int(c), int(m)])
for i in range(1, n):
    key = rows[i]
    j = i - 1
    while j >= 0 and rows[j][1] + rows[j][2] < key[1] + key[2]:
        rows[j + 1] = rows[j]
        j -= 1
    rows[j + 1] = key
for name, c, m in rows:
    print(name, c, m, c + m)
''',
        tests=lambda r: [lines(1, 'solo 0 0'), lines(3, 'a 50 50', 'b 100 0', 'c 0 100'), lines(2, 'x   1    2', 'y 3 0'),
                         lines(3, 'p 0 0', 'q 100 100', 'r 50 50')]
        + [words_input([f'{word(r, 1, 10)}{" " * r.randint(1, 3)}{r.randint(0, 100)}{" " * r.randint(1, 3)}{r.randint(0, 100)}' for _ in range(r.randint(2, 100))]) for _ in range(3)]
        + [words_input([f'{word(r, 1, 10)} {r.randint(40, 50)} {r.randint(40, 50)}' for _ in range(r.randint(20, 100))]) for _ in range(3)],
    ),
    Problem(
        slug='insertion-steps', title='Watch Insertion Sort Work', level=2,
        statement='<p>Run insertion sort on a list (smallest to largest) and show the list after each insertion step. '
                  'Step <code>i</code> (for <code>i = 2, 3, …, n</code>) inserts the <code>i</code>-th number into the sorted part made of the first <code>i − 1</code> numbers.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p><code>n − 1</code> lines: the whole list after steps 2, 3, …, <code>n</code>, numbers separated by single spaces. '
               'Print a line even when a step moves nothing.</p>',
        constraints='<p>2 ≤ n ≤ 50; every number is between −100 and 100.</p>',
        examples=[('5\n5 2 4 6 1\n', '2 5 4 6 1\n2 4 5 6 1\n2 4 5 6 1\n1 2 4 5 6\n')],
        hint='<p>Write ordinary insertion sort and add one <code>print(*a)</code> at the end of each pass of the outer loop.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(1, n):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = key
    print(*a)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
for i in range(2, n + 1):
    print(*(sorted(a[:i]) + a[i:]))
''',
        tests=lambda r: [nl([1, 2]), nl([2, 1]), nl([3, 3, 3]), nl([5, 4, 3, 2, 1]), nl([1, 2, 3, 4, 5])]
        + [nl(rl(r, r.randint(2, 50), -100, 100)) for _ in range(5)],
    ),
    Problem(
        slug='count-shifts', title='Counting the Shifts', level=2,
        statement='<p>Insertion sort moves a number one place to the right each time it is bigger than the key being inserted. '
                  'We call each such move a <strong>shift</strong>. How many shifts does insertion sort make to sort the given list from smallest to largest?</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One integer: the total number of shifts.</p>',
        constraints='<p>1 ≤ n ≤ 600; every number is between 0 and 1000. Equal numbers are never shifted past each other.</p>',
        examples=[('5\n5 2 4 6 1\n', '6\n'), ('3\n1 2 3\n', '0\n')],
        hint='<p>Run insertion sort and add 1 every time the inner loop moves a value. (There is also a way to count without sorting: think about pairs that are in the wrong order.)</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
shifts = 0
for i in range(1, n):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1
        shifts += 1
    a[j + 1] = key
print(shifts)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
inv = 0
for i in range(n):
    for j in range(i + 1, n):
        if a[i] > a[j]:
            inv += 1
print(inv)
''',
        tests=lambda r: [nl([7]), nl([2, 1]), nl([4, 4, 4, 4]), nl(list(range(600, 0, -1))), nl(nearly_sorted(r, 600, 30, 0, 1000))]
        + [nl(rl(r, r.randint(2, 600), 0, r.choice([3, 1000]))) for _ in range(5)],
    ),
    Problem(
        slug='insert-position', title='Where Does It Go?', level=2,
        statement='<p>A list is sorted from smallest to largest. For each question number <code>x</code>, say at which position (counting from 1) '
                  '<code>x</code> would be placed if it were inserted into the list, <em>after</em> any numbers equal to it. The list itself does not change between questions.</p>',
        input='<p>The first line holds <code>n</code>; the second line holds <code>n</code> integers in non-decreasing order. '
              'The third line holds <code>q</code>; the fourth line holds the <code>q</code> question numbers.</p>',
        output='<p>One line with <code>q</code> positions separated by single spaces.</p>',
        constraints='<p>1 ≤ n, q ≤ 1000; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('5\n1 3 3 6 9\n4\n3 0 10 5\n', '4 1 6 4\n', '<p>A new 3 goes after both 3s, so it becomes the 4th number.</p>')],
        hint='<p>The position is one more than how many numbers are less than or equal to <code>x</code>. Since the list is sorted, binary search '
             '(or <code>bisect_right</code>) finds that count quickly.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
q = int(input())
out = []
for x in map(int, input().split()):
    lo, hi = 0, n          # find the first index whose value is > x
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] <= x:
            lo = mid + 1
        else:
            hi = mid
    out.append(lo + 1)
print(*out)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
q = int(input())
print(*[sum(1 for v in a if v <= x) + 1 for x in map(int, input().split())])
''',
        tests=lambda r: [lines(1, 5, 3, '4 5 6'), lines(3, '2 2 2', 3, '1 2 3'), lines(2, '-1000000 1000000', 2, '1000000 -1000000')]
        + [(lambda n, q: lines(n, ints(sorted(rl(r, n, -100, 100))), q, ints(rl(r, q, -110, 110))))(r.randint(1, 400), r.randint(1, 400)) for _ in range(6)],
    ),
    Problem(
        slug='leaderboard-rank', title='Live Leaderboard', level=2,
        statement='<p>Players finish a game one after another, and each gets a score. As soon as a player finishes, the screen shows their rank among '
                  'everyone who has finished so far: 1 plus the number of earlier players with a strictly higher score. Print the rank shown for each player.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> scores in finishing order.</p>',
        output='<p>One line with <code>n</code> ranks separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 500; 0 ≤ score ≤ 10000.</p>',
        examples=[('5\n50 80 80 30 90\n', '1 1 1 4 1\n')],
        hint='<p>Keep the scores seen so far in a sorted list, inserting each new score the insertion-sort way. The rank comes from how many are bigger.</p>',
        solution=r'''
n = int(input())
scores = list(map(int, input().split()))
board = []          # sorted from high to low
out = []
for s in scores:
    board.append(s)
    j = len(board) - 2
    while j >= 0 and board[j] < s:
        board[j + 1] = board[j]
        j -= 1
    board[j + 1] = s
    rank = 1
    while board[rank - 1] > s:
        rank += 1
    out.append(rank)
print(*out)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
print(*[1 + sum(1 for b in a[:i] if b > a[i]) for i in range(n)])
''',
        tests=lambda r: [nl([7]), nl([1, 2, 3, 4]), nl([4, 3, 2, 1]), nl([5, 5, 5])]
        + [nl(rl(r, r.randint(2, 500), 0, r.choice([10, 10000]))) for _ in range(6)],
    ),
    Problem(
        slug='shifts-per-step', title='How Far Each Card Slides', level=2,
        statement='<p>Run insertion sort (smallest to largest) on a list. For every step <code>i = 2, 3, …, n</code>, which inserts the <code>i</code>-th number, '
                  'report how many numbers were shifted one place to the right during that step.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>One line with <code>n − 1</code> integers, the shift counts of steps 2 to <code>n</code>, separated by single spaces.</p>',
        constraints='<p>2 ≤ n ≤ 600; every number is between 0 and 1000. Equal numbers are never shifted past each other.</p>',
        examples=[('6\n5 2 4 6 1 3\n', '1 1 0 4 3\n')],
        hint='<p>Reset a counter at the start of each step and add one each time the inner loop moves a value. '
             'Can you see what each count means in the original list, without sorting at all?</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
out = []
for i in range(1, n):
    key = a[i]
    j = i - 1
    moved = 0
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1
        moved += 1
    a[j + 1] = key
    out.append(moved)
print(*out)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
print(*[sum(1 for k in range(i) if a[k] > a[i]) for i in range(1, n)])
''',
        tests=lambda r: [nl([1, 2]), nl([2, 1]), nl([3, 3, 3]), nl(list(range(600, 0, -1))), nl(nearly_sorted(r, 500, 25, 0, 1000))]
        + [nl(rl(r, r.randint(2, 600), 0, r.choice([3, 1000]))) for _ in range(5)],
    ),
    Problem(
        slug='by-last-name', title='Sorting by Family Name', level=2,
        statement='<p>A list of people is given as first name and family name. Sort them by family name; people with the same family name are sorted by first name.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds a first name and a family name separated by a space.</p>',
        output='<p><code>n</code> lines, each <code>First Family</code> as in the input, in the sorted order.</p>',
        constraints='<p>1 ≤ n ≤ 500; each name is one capital letter followed by 1 to 9 lowercase letters. The same person may appear twice.</p>',
        examples=[('4\nAnna Smith\nBen Jones\nCara Smith\nAdam Jones\n', 'Adam Jones\nBen Jones\nAnna Smith\nCara Smith\n')],
        hint='<p>Split each line into its two names. The sort key is the pair (family name, first name).</p>',
        solution=r'''
n = int(input())
people = [input().split() for _ in range(n)]
people.sort(key=lambda p: (p[1], p[0]))
for first, last in people:
    print(first, last)
''',
        alt=r'''
n = int(input())
people = [input().split() for _ in range(n)]
people.sort(key=lambda p: p[0])
people.sort(key=lambda p: p[1])
for p in people:
    print(' '.join(p))
''',
        tests=lambda r: [lines(1, 'Zed Abe'), lines(2, 'Bo Lee', 'Al Lee'), lines(2, 'Al Lee', 'Al Ito'), lines(3, 'Al Lee', 'Al Lee', 'Al Le')]
        + [words_input([f'{r.choice(FIRST)} {r.choice(LAST)}' for _ in range(r.randint(2, 300))]) for _ in range(6)],
    ),
    Problem(
        slug='ignore-case-order', title='Dictionary Order, Any Case', level=2,
        statement='<p>Sort a list of words alphabetically, <strong>ignoring</strong> whether letters are capital or small. '
                  'Words that are the same when case is ignored (like <code>apple</code> and <code>Apple</code>) keep their input order. Print the words as they were written.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one word of English letters.</p>',
        output='<p>The words in the new order, one per line.</p>',
        constraints='<p>1 ≤ n ≤ 500; each word has 1 to 10 letters.</p>',
        examples=[('5\nbanana\nApple\ncherry\napple\nBanana\n', 'Apple\napple\nbanana\nBanana\ncherry\n')],
        hint='<p>Sort by the lowercase version of each word. A stable sort takes care of the ties for you.</p>',
        solution=r'''
n = int(input())
words = [input() for _ in range(n)]
for w in sorted(words, key=str.lower):
    print(w)
''',
        alt=r'''
n = int(input())
w = [input() for _ in range(n)]
for i in range(1, n):
    key = w[i]
    j = i - 1
    while j >= 0 and w[j].lower() > key.lower():
        w[j + 1] = w[j]
        j -= 1
    w[j + 1] = key
print('\n'.join(w))
''',
        tests=lambda r: [words_input(['Z']), words_input(['b', 'A']), words_input(['abc', 'ABC', 'Abc', 'aBC']), words_input(['Zoo', 'ant', 'Bee'])]
        + [words_input([word(r, 1, 4 if k % 2 else 10, 'abAB' if k % 2 else string.ascii_letters) for _ in range(r.randint(2, 400))]) for k in range(6)],
    ),
    Problem(
        slug='group-anagrams', title='Anagram Families', level=2,
        statement='<p>Words are in the same <strong>family</strong> if they are anagrams of each other (made of exactly the same letters). '
                  'Split a list of words into families.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one word of lowercase letters.</p>',
        output='<p>One line per family: its words in dictionary order, separated by single spaces. A repeated word appears as many times as it was given. '
               'The lines are ordered by their first word, in dictionary order.</p>',
        constraints='<p>1 ≤ n ≤ 500; each word has 1 to 8 letters.</p>',
        examples=[('6\nlisten\ngoogle\nenlist\ncat\nsilent\nact\n', 'act cat\nenlist listen silent\ngoogle\n')],
        hint='<p>Sorting the letters of a word gives a "family name" that all its anagrams share, like <code>eilnst</code>. '
             'Collect the words in a dictionary keyed by that name, then sort inside and between the families.</p>',
        solution=r'''
n = int(input())
families = {}
for _ in range(n):
    w = input()
    key = ''.join(sorted(w))
    families.setdefault(key, []).append(w)
groups = [sorted(g) for g in families.values()]
groups.sort()
for g in groups:
    print(*g)
''',
        alt=r'''
n = int(input())
words = sorted(input() for _ in range(n))
used = [False] * n
for i in range(n):
    if used[i]:
        continue
    group = []
    for j in range(i, n):
        if not used[j] and sorted(words[j]) == sorted(words[i]):
            used[j] = True
            group.append(words[j])
    print(' '.join(group))
''',
        tests=lambda r: [words_input(['a']), words_input(['ab', 'ba', 'ab']), words_input(['abc', 'def', 'ghi']), words_input(['b', 'a', 'ba', 'ab'])]
        + [words_input([word(r, 1, 4, 'abc' if k % 2 else 'abcdef') for _ in range(r.randint(2, 500))]) for k in range(4)]
        + [words_input([''.join(r.sample(w, len(w))) for w in (r.choice(['listen', 'stone', 'heart', 'night', 'cat', 'dusty', 'loop']) for _ in range(r.randint(2, 300)))]) for _ in range(2)],
    ),
    Problem(
        slug='only-in-first', title='Only in the First List', level=2,
        statement='<p>Two lists are each sorted from smallest to largest. Print the numbers of the first list whose value does <strong>not</strong> appear anywhere in the second list. '
                  'Keep repeats: if such a value appears three times in the first list, print it three times.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. The second line holds <code>n</code> integers in non-decreasing order; '
              'the third line holds <code>m</code> integers in non-decreasing order.</p>',
        output='<p>The numbers in non-decreasing order separated by single spaces, or <code>NONE</code> if there are none.</p>',
        constraints='<p>1 ≤ n, m ≤ 1000; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('6 4\n1 2 2 4 7 9\n2 3 7 10\n', '1 4 9\n'), ('2 3\n5 5\n1 5 9\n', 'NONE\n')],
        hint='<p>Walk through the first list with one pointer. Move a second pointer along the second list while its value is smaller; '
             'then you can tell at once whether the current value is in the second list.</p>',
        solution=r'''
n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
j = 0
out = []
for x in a:
    while j < m and b[j] < x:
        j += 1
    if j == m or b[j] != x:
        out.append(x)
print(*out if out else ['NONE'])
''',
        alt=r'''
input()
a = list(map(int, input().split()))
b = set(map(int, input().split()))
out = [x for x in a if x not in b]
print(' '.join(map(str, out)) if out else 'NONE')
''',
        tests=lambda r: ['1 1\n5\n5\n', '1 1\n5\n6\n', '3 1\n4 4 4\n3\n', '3 3\n-1000000 0 1000000\n-1000000 0 1000000\n']
        + [two_sorted(r, r.randint(1, 400), r.randint(1, 400), -k, k) for k in (5, 50, 500, 100000)]
        + [two_sorted(r, r.randint(1, 50), r.randint(1, 50), 0, 60) for _ in range(2)],
    ),
    Problem(
        slug='pairs-at-most', title='Pairs Within Budget', level=2,
        statement='<p>You want to buy exactly two different items, and their prices together must be at most <code>t</code>. '
                  'How many different pairs of items can you choose? (Two items with the same price are still different items.)</p>',
        input='<p>The first line holds <code>n</code> and <code>t</code>. The second line holds the <code>n</code> prices.</p>',
        output='<p>One integer: the number of pairs (each pair counted once) whose total is at most <code>t</code>.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ price ≤ 10<sup>6</sup>; 1 ≤ t ≤ 2·10<sup>6</sup>.</p>',
        examples=[('5 8\n5 1 3 7 2\n', '7\n')],
        hint='<p>Sort, then put one pointer at the cheapest and one at the most expensive item. If those two fit the budget, '
             'then the cheapest item also fits with <em>every</em> item between them. How many is that?</p>',
        solution=r'''
n, t = map(int, input().split())
a = sorted(map(int, input().split()))
i, j = 0, n - 1
count = 0
while i < j:
    if a[i] + a[j] <= t:
        count += j - i
        i += 1
    else:
        j -= 1
print(count)
''',
        alt=r'''
n, t = map(int, input().split())
a = list(map(int, input().split()))
print(sum(1 for i in range(n) for j in range(i + 1, n) if a[i] + a[j] <= t))
''',
        tests=lambda r: ['1 10\n5\n', '2 10\n5 5\n', '2 9\n5 5\n', '4 2000000\n1000000 1000000 1000000 1000000\n', '3 1\n1 1 1\n']
        + [(lambda n, k: lines(f'{n} {r.randint(1, 2 * k)}', ints(rl(r, n, 1, k))))(r.randint(2, 600), r.choice([10, 1000, 1000000])) for _ in range(5)],
    ),
    Problem(
        slug='date-order', title='Putting Dates in Order', level=2,
        statement='<p>Dates are written as <code>DD/MM/YYYY</code> (day, month, year). Print them from the earliest to the latest. '
                  'Notice that sorting the text directly would compare the days first, which is wrong.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one date.</p>',
        output='<p>The dates from earliest to latest, one per line, written exactly as in the input.</p>',
        constraints='<p>1 ≤ n ≤ 500; all dates are valid, with years between 1900 and 2100. A date may appear more than once.</p>',
        examples=[('4\n05/11/2023\n17/03/2024\n30/01/2023\n01/12/2023\n', '30/01/2023\n05/11/2023\n01/12/2023\n17/03/2024\n')],
        hint='<p>Split each date at <code>/</code> and sort by the tuple (year, month, day).</p>',
        solution=r'''
n = int(input())
dates = [input().strip() for _ in range(n)]
def key(d):
    day, month, year = d.split('/')
    return (int(year), int(month), int(day))
for d in sorted(dates, key=key):
    print(d)
''',
        alt=r'''
n = int(input())
dates = [input().strip() for _ in range(n)]
dates.sort(key=lambda d: d[6:] + d[3:5] + d[:2])
print('\n'.join(dates))
''',
        tests=lambda r: [words_input(['01/01/2000']), words_input(['31/12/1999', '01/01/2000']), words_input(['02/01/2000', '01/02/2000']),
                         words_input(['15/06/2100', '15/06/1900', '15/06/2000'])]
        + [words_input([f'{r.randint(1, 28):02d}/{r.randint(1, 12):02d}/{r.choice([r.randint(1900, 2100), 2024])}' for _ in range(r.randint(2, 400))]) for _ in range(6)],
    ),
    Problem(
        slug='common-values', title='In Both Lists', level=2,
        statement='<p>Two lists are each sorted from smallest to largest and may contain repeated values. Print every value that appears in '
                  '<strong>both</strong> lists, once each, from smallest to largest. Use two pointers, one walking along each list.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. The second line holds <code>n</code> integers in non-decreasing order; '
              'the third line holds <code>m</code> integers in non-decreasing order.</p>',
        output='<p>The common values separated by single spaces, or <code>NONE</code> if there are none.</p>',
        constraints='<p>1 ≤ n, m ≤ 1000; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('6 5\n1 2 2 4 7 9\n2 2 3 7 10\n', '2 7\n'), ('2 2\n1 3\n2 4\n', 'NONE\n')],
        hint='<p>Compare <code>a[i]</code> with <code>b[j]</code>. Move the pointer at the smaller value. When they are equal you found a common value: '
             'record it unless you just recorded it, and move both.</p>',
        solution=r'''
n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
i = j = 0
out = []
while i < n and j < m:
    if a[i] < b[j]:
        i += 1
    elif a[i] > b[j]:
        j += 1
    else:
        if not out or out[-1] != a[i]:
            out.append(a[i])
        i += 1
        j += 1
print(*out if out else ['NONE'])
''',
        alt=r'''
input()
a = set(map(int, input().split()))
b = set(map(int, input().split()))
c = sorted(a & b)
print(' '.join(map(str, c)) if c else 'NONE')
''',
        tests=lambda r: ['1 1\n5\n5\n', '1 1\n5\n6\n', '3 3\n1 1 1\n1 1 1\n', '3 2\n-1000000 0 1000000\n1000000 1000000\n']
        + [two_sorted(r, r.randint(1, 400), r.randint(1, 400), -k, k) for k in (5, 50, 500, 100000) for _ in range(1)]
        + [two_sorted(r, r.randint(1, 50), r.randint(1, 50), 0, 1000) for _ in range(2)],
    ),
    Problem(
        slug='union-sorted', title='In Either List', level=2,
        statement='<p>Two lists are each sorted from smallest to largest and may contain repeated values. Print every value that appears in '
                  '<strong>at least one</strong> of them, once each, from smallest to largest.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. The second line holds <code>n</code> integers in non-decreasing order; '
              'the third line holds <code>m</code> integers in non-decreasing order.</p>',
        output='<p>The values separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 1000; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('4 4\n1 3 3 5\n2 3 6 6\n', '1 2 3 5 6\n')],
        hint='<p>Merge the two lists with two pointers, but only append a value if it is different from the last value you appended.</p>',
        solution=r'''
n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
i = j = 0
out = []
while i < n or j < m:
    if j == m or (i < n and a[i] <= b[j]):
        x = a[i]
        i += 1
    else:
        x = b[j]
        j += 1
    if not out or out[-1] != x:
        out.append(x)
print(*out)
''',
        alt=r'''
input()
a = list(map(int, input().split()))
b = list(map(int, input().split()))
print(*sorted(set(a + b)))
''',
        tests=lambda r: ['1 1\n5\n5\n', '1 1\n6\n5\n', '3 3\n1 1 1\n1 1 1\n', '2 3\n-1000000 1000000\n0 0 0\n']
        + [two_sorted(r, r.randint(1, 400), r.randint(1, 400), -k, k) for k in (5, 50, 500, 100000)]
        + [two_sorted(r, r.randint(1, 50), r.randint(1, 50), 0, 1000) for _ in range(2)],
    ),
    Problem(
        slug='pair-sum-count', title='Pairs That Add Up', level=2,
        statement='<p>A sorted list of <strong>different</strong> integers and a target <code>t</code> are given. Count the pairs of numbers in the list '
                  '(two different positions, each pair counted once) whose sum is exactly <code>t</code>.</p>',
        input='<p>The first line holds <code>n</code> and <code>t</code>. The second line holds <code>n</code> distinct integers in increasing order.</p>',
        output='<p>One integer: the number of pairs.</p>',
        constraints='<p>1 ≤ n ≤ 1000; all numbers and <code>t</code> are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('6 10\n1 3 4 6 7 9\n', '3\n', '<p>1 + 9, 3 + 7 and 4 + 6.</p>'), ('3 4\n1 2 3\n', '1\n')],
        hint='<p>Start one pointer at the smallest number and one at the largest. If their sum is too small, which pointer should move? If it is too big?</p>',
        solution=r'''
n, t = map(int, input().split())
a = list(map(int, input().split()))
i, j = 0, n - 1
count = 0
while i < j:
    s = a[i] + a[j]
    if s == t:
        count += 1
        i += 1
        j -= 1
    elif s < t:
        i += 1
    else:
        j -= 1
print(count)
''',
        alt=r'''
n, t = map(int, input().split())
a = list(map(int, input().split()))
print(sum(1 for i in range(n) for j in range(i + 1, n) if a[i] + a[j] == t))
''',
        tests=lambda r: ['1 10\n5\n', '2 10\n4 6\n', '2 0\n-3 3\n', '4 100\n1 2 3 4\n', '5 0\n-2 -1 0 1 2\n']
        + [(lambda a: lines(f'{len(a)} {r.choice(a) + r.choice(a)}', ints(a)))(sorted(r.sample(range(-k, k + 1), r.randint(2, min(500, 2 * k)))))
           for k in (20, 200, 1000, 1000000, 1000)],
    ),
    Problem(
        slug='sorted-squares', title='Squares in Order', level=2,
        statement='<p>A list of integers, possibly with negatives, is sorted from smallest to largest. Print the squares of all the numbers, also from smallest to largest. '
                  'Try to do it without sorting again: the biggest square is always at one of the two ends.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers in non-decreasing order.</p>',
        output='<p>The <code>n</code> squares in non-decreasing order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 1000; every number is between −10<sup>4</sup> and 10<sup>4</sup>.</p>',
        examples=[('5\n-4 -1 0 3 10\n', '0 1 9 16 100\n')],
        hint='<p>Use a pointer at each end. Compare the two squares, put the larger one at the <em>back</em> of the answer, and move that pointer inwards.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
out = [0] * n
i, j = 0, n - 1
for k in range(n - 1, -1, -1):
    if a[i] * a[i] > a[j] * a[j]:
        out[k] = a[i] * a[i]
        i += 1
    else:
        out[k] = a[j] * a[j]
        j -= 1
print(*out)
''',
        alt=r'''
n = int(input())
print(*sorted(x * x for x in map(int, input().split())))
''',
        tests=lambda r: [nl([0]), nl([-5]), nl([-3, 3]), nl([-10000, -1, 0, 0, 1, 10000]), nl(list(range(-10, 0))), nl(list(range(1, 11)))]
        + [nl(sorted(rl(r, r.randint(2, 600), -10000, r.choice([0, 10000])))) for _ in range(4)],
    ),
    Problem(
        slug='kth-of-two-lists', title='The k-th Number of Two Lists', level=2,
        statement='<p>Two lists are each sorted from smallest to largest. If you put all their numbers together and sorted them, which number would be <code>k</code>-th (counting from 1)?</p>',
        input='<p>The first line holds <code>n</code>, <code>m</code> and <code>k</code>. The second line holds <code>n</code> integers in non-decreasing order; '
              'the third line holds <code>m</code> integers in non-decreasing order.</p>',
        output='<p>One integer: the <code>k</code>-th smallest of all <code>n + m</code> numbers.</p>',
        constraints='<p>1 ≤ n, m ≤ 1000; 1 ≤ k ≤ n + m; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('4 3 5\n1 4 7 8\n2 4 6\n', '6\n', '<p>All together in order: 1 2 4 4 <b>6</b> 7 8.</p>')],
        hint='<p>Merge with two pointers, but stop as soon as you have taken <code>k</code> numbers.</p>',
        solution=r'''
n, m, k = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
i = j = 0
for _ in range(k):
    if j == m or (i < n and a[i] <= b[j]):
        x = a[i]
        i += 1
    else:
        x = b[j]
        j += 1
print(x)
''',
        alt=r'''
n, m, k = map(int, input().split())
c = list(map(int, input().split())) + list(map(int, input().split()))
c.sort()
print(c[k - 1])
''',
        tests=lambda r: ['1 1 1\n5\n3\n', '1 1 2\n5\n3\n', '3 1 4\n1 2 3\n0\n', '2 2 2\n7 7\n7 7\n']
        + [(lambda n, m: lines(f'{n} {m} {r.randint(1, n + m)}', ints(sorted(rl(r, n, -1000, 1000))), ints(sorted(rl(r, m, -1000, 1000)))))(r.randint(1, 300), r.randint(1, 300)) for _ in range(6)],
    ),
    Problem(
        slug='vowel-order', title='Most Vowels First', level=2,
        statement='<p>Sort a list of words by how many vowels (<code>a e i o u</code>) they contain, the most first. Words with the same number of vowels are in dictionary order.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one word of lowercase letters.</p>',
        output='<p>The words in the new order, one per line.</p>',
        constraints='<p>1 ≤ n ≤ 500; each word has 1 to 12 letters. Words may repeat.</p>',
        examples=[('5\nsky\nbanana\nidea\ntree\napple\n', 'banana\nidea\napple\ntree\nsky\n')],
        hint='<p>Write a small function that counts the vowels of a word. The key is a pair, and one part of it needs a minus sign.</p>',
        solution=r'''
def vowels(w):
    return sum(1 for c in w if c in 'aeiou')

n = int(input())
words = [input() for _ in range(n)]
words.sort(key=lambda w: (-vowels(w), w))
for w in words:
    print(w)
''',
        alt=r'''
n = int(input())
words = sorted(input() for _ in range(n))
for v in range(12, -1, -1):
    for w in words:
        if sum(w.count(c) for c in 'aeiou') == v:
            print(w)
''',
        tests=lambda r: [words_input(['x']), words_input(['b', 'a']), words_input(['aaa', 'bbb', 'aab', 'abb']), words_input(['zoo', 'ant', 'eel'])]
        + [words_input([word(r, 1, 12, 'aebcd' if k % 2 else string.ascii_lowercase) for _ in range(r.randint(2, 450))]) for k in range(6)],
    ),
    Problem(
        slug='group-by-first-letter', title='Grouped by First Letter', level=2,
        statement='<p>Make an index of words: sort them alphabetically and group them by their first letter. Print one line for each letter that starts at least one word.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one word of lowercase letters.</p>',
        output='<p>For each starting letter, in alphabetical order, one line: the letter, a colon, then its words in dictionary order, '
               'all separated by single spaces (see the example). Repeated words are printed as many times as they appear.</p>',
        constraints='<p>1 ≤ n ≤ 500; words have 1 to 10 letters.</p>',
        examples=[('6\nbanana\napple\navocado\ncherry\nblueberry\napple\n', 'a: apple apple avocado\nb: banana blueberry\nc: cherry\n')],
        hint='<p>After sorting, words with the same first letter are next to each other. Start a new group whenever the first letter changes.</p>',
        solution=r'''
n = int(input())
words = sorted(input() for _ in range(n))
group = [words[0]]
for w in words[1:]:
    if w[0] == group[0][0]:
        group.append(w)
    else:
        print(group[0][0] + ':', *group)
        group = [w]
print(group[0][0] + ':', *group)
''',
        alt=r'''
n = int(input())
words = [input() for _ in range(n)]
for c in 'abcdefghijklmnopqrstuvwxyz':
    g = sorted(w for w in words if w[0] == c)
    if g:
        print(c + ': ' + ' '.join(g))
''',
        tests=lambda r: [words_input(['z']), words_input(['b', 'a']), words_input(['aa', 'a', 'aaa']), words_input(['x', 'y', 'z', 'x'])]
        + [words_input([word(r, 1, 10, 'abcde' if k % 2 else string.ascii_lowercase) for _ in range(r.randint(2, 450))]) for k in range(6)],
    ),
    Problem(
        slug='version-order', title='Sorting Version Numbers', level=2,
        statement='<p>Software versions look like <code>1.10.2</code>: whole numbers separated by dots. Version A is older than version B if, comparing the numbers part by part from the left, '
                  'the first different part is smaller in A. If one version is the start of the other (like <code>1.2</code> and <code>1.2.0</code>), the shorter one is older. '
                  'Print the versions from oldest to newest.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds one version.</p>',
        output='<p>The versions from oldest to newest, one per line, written exactly as in the input.</p>',
        constraints='<p>1 ≤ n ≤ 500; each version has 1 to 4 parts; each part is a whole number from 0 to 99 written without extra leading zeros. Versions may repeat.</p>',
        examples=[('5\n1.10\n1.2\n1.2.0\n0.9.9\n1.9\n', '0.9.9\n1.2\n1.2.0\n1.9\n1.10\n', '<p>As text, <code>1.10</code> would come before <code>1.9</code>, but 10 is bigger than 9.</p>')],
        hint='<p>Split a version at the dots and turn the parts into integers. A <em>list</em> or <em>tuple</em> of integers already compares exactly the way this problem wants.</p>',
        solution=r'''
n = int(input())
vs = [input().strip() for _ in range(n)]
vs.sort(key=lambda v: [int(p) for p in v.split('.')])
for v in vs:
    print(v)
''',
        alt=r'''
n = int(input())
vs = [input().strip() for _ in range(n)]
vs.sort(key=lambda v: '.'.join(p.zfill(2) for p in v.split('.')))
print('\n'.join(vs))
''',
        tests=lambda r: [words_input(['1']), words_input(['1.0', '1']), words_input(['2', '10', '9']), words_input(['1.2.3.4', '1.2.3', '1.2', '1'])]
        + [words_input(['.'.join(str(r.randint(0, k)) for _ in range(r.randint(1, 4))) for _ in range(r.randint(2, 450))]) for k in (2, 12, 99, 99, 3, 11)],
    ),

    # ── Level 3 ──────────────────────────────────────────────────────────
    Problem(
        slug='insertion-comparisons', title='Shifts and Comparisons', level=3,
        statement='<p>Here is insertion sort:</p>'
                  '<pre>for i in range(1, n):\n    key = a[i]\n    j = i - 1\n    while j &gt;= 0 and a[j] &gt; key:\n        a[j + 1] = a[j]\n        j -= 1\n    a[j + 1] = key</pre>'
                  '<p>For a given list, count two things: the number of <strong>shifts</strong> (times the line <code>a[j + 1] = a[j]</code> runs) and the number of '
                  '<strong>comparisons</strong> (times <code>a[j] &gt; key</code> is actually checked; when <code>j &gt;= 0</code> is false, Python does not check it).</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> integers.</p>',
        output='<p>Two integers on one line: the number of shifts and the number of comparisons.</p>',
        constraints='<p>1 ≤ n ≤ 600; every number is between 0 and 1000.</p>',
        examples=[('6\n5 2 4 6 1 3\n', '9 12\n'), ('1\n5\n', '0 0\n')],
        hint='<p>You can simply add counters to the code. To be sure about comparisons, think about each pass: every successful comparison causes a shift, '
             'and the loop stops either because a comparison failed or because <code>j</code> ran off the front.</p>',
        solution=r'''
n = int(input())
a = list(map(int, input().split()))
shifts = comps = 0
for i in range(1, n):
    key = a[i]
    j = i - 1
    while j >= 0:
        comps += 1
        if a[j] > key:
            a[j + 1] = a[j]
            shifts += 1
            j -= 1
        else:
            break
    a[j + 1] = key
print(shifts, comps)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
shifts = comps = 0
for i in range(1, n):
    s = sum(1 for k in range(i) if a[k] > a[i])
    shifts += s
    comps += s + (1 if s < i else 0)
print(shifts, comps)
''',
        tests=lambda r: [nl([1, 2]), nl([2, 1]), nl([3, 3, 3]), nl(list(range(600))), nl(list(range(600, 0, -1)))]
        + [nl(rl(r, r.randint(2, 600), 0, r.choice([3, 1000]))) for _ in range(5)],
    ),
    Problem(
        slug='running-median', title='The Middle So Far', level=3,
        statement='<p>Numbers arrive one at a time. After each new number, print the <strong>median</strong> of all numbers received so far: '
                  'sort them, and take the middle one. If there is an even count, take the <em>smaller</em> of the two middle numbers.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>n</code> numbers in the order they arrive.</p>',
        output='<p>One line with <code>n</code> medians separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 500; every number is between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('6\n5 2 8 1 9 3\n', '5 2 5 2 5 3\n', '<p>For example, after four numbers the sorted list is 1 2 5 8; the middle two are 2 and 5, so the answer is 2.</p>')],
        hint='<p>Keep a sorted list and insert each new number into place with one insertion-sort step. With <code>k</code> numbers stored, which index is the median?</p>',
        solution=r'''
n = int(input())
nums = list(map(int, input().split()))
hand = []
out = []
for x in nums:
    hand.append(x)
    j = len(hand) - 2
    while j >= 0 and hand[j] > x:
        hand[j + 1] = hand[j]
        j -= 1
    hand[j + 1] = x
    out.append(hand[(len(hand) - 1) // 2])
print(*out)
''',
        alt=r'''
n = int(input())
a = list(map(int, input().split()))
print(*[sorted(a[:k])[(k - 1) // 2] for k in range(1, n + 1)])
''',
        tests=lambda r: [nl([7]), nl([1, 2]), nl([2, 1]), nl([4, 4, 4, 4]), nl(list(range(1, 501))), nl(list(range(500, 0, -1)))]
        + [nl(rl(r, r.randint(2, 500), -10 ** r.choice([1, 6]), 10 ** 6)) for _ in range(4)],
    ),
    Problem(
        slug='closest-across-lists', title='The Closest Pair Across Two Lists', level=3,
        statement='<p>Two lists are each sorted from smallest to largest. Pick one number from each list so that their difference is as small as possible. Print that difference.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. The second line holds <code>n</code> integers in non-decreasing order; '
              'the third line holds <code>m</code> integers in non-decreasing order.</p>',
        output='<p>One integer: the smallest value of |x − y| with x from the first list and y from the second.</p>',
        constraints='<p>1 ≤ n, m ≤ 1000; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('4 3\n1 6 11 20\n8 14 30\n', '2\n', '<p>6 and 8.</p>')],
        hint='<p>Use one pointer in each list and check the current pair. Then move the pointer that is at the smaller value: moving the other one could only make the gap bigger.</p>',
        solution=r'''
n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
i = j = 0
best = abs(a[0] - b[0])
while i < n and j < m:
    best = min(best, abs(a[i] - b[j]))
    if a[i] < b[j]:
        i += 1
    else:
        j += 1
print(best)
''',
        alt=r'''
input()
a = list(map(int, input().split()))
b = list(map(int, input().split()))
print(min(abs(x - y) for x in a for y in b))
''',
        tests=lambda r: ['1 1\n5\n5\n', '1 1\n-1000000\n1000000\n', '3 3\n1 2 3\n10 20 30\n', '3 3\n10 20 30\n1 2 3\n', '2 2\n1 100\n50 51\n']
        + [two_sorted(r, r.randint(1, 300), r.randint(1, 300), -k, k) for k in (1000, 1000000, 100000)]
        + [two_sorted(r, r.randint(1, 30), r.randint(1, 30), -1000000, 1000000) for _ in range(2)],
    ),
    Problem(
        slug='pairs-with-difference', title='Pairs With a Given Gap', level=3,
        statement='<p>A list of <strong>different</strong> integers (in any order) and a number <code>k</code> are given. Count the pairs of numbers from the list whose difference is exactly <code>k</code>. '
                  'Each pair is counted once.</p>',
        input='<p>The first line holds <code>n</code> and <code>k</code>. The second line holds <code>n</code> distinct integers.</p>',
        output='<p>One integer: the number of pairs.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ k ≤ 10<sup>6</sup>; all numbers are between −10<sup>6</sup> and 10<sup>6</sup>.</p>',
        examples=[('6 2\n1 5 3 4 2 8\n', '3\n', '<p>(1, 3), (3, 5) and (2, 4).</p>')],
        hint='<p>Sort first. Then keep two pointers <code>i &lt; j</code> that both only move forward: if <code>a[j] − a[i]</code> is too small move <code>j</code>, if it is too big move <code>i</code>.</p>',
        solution=r'''
n, k = map(int, input().split())
a = sorted(map(int, input().split()))
i, j = 0, 1
count = 0
while j < n:
    d = a[j] - a[i]
    if d == k:
        count += 1
        i += 1
        j += 1
    elif d < k:
        j += 1
    else:
        i += 1
        if i == j:
            j += 1
print(count)
''',
        alt=r'''
n, k = map(int, input().split())
a = list(map(int, input().split()))
s = set(a)
print(sum(1 for x in a if x + k in s))
''',
        tests=lambda r: ['1 1\n5\n', '2 1\n5 6\n', '2 3\n5 6\n', '5 1\n5 4 3 2 1\n', '2 1000000\n-1000000 0\n']
        + [(lambda a: lines(f'{len(a)} {r.randint(1, 10)}', ints(a)))(r.sample(range(-k, k + 1), r.randint(2, min(500, 2 * k)))) for k in (10, 100, 1000, 3000)]
        + [(lambda a: lines(f'{len(a)} {r.randint(1, 1000000)}', ints(a)))(r.sample(range(-1000000, 1000001), 300))],
    ),
    Problem(
        slug='cookies-and-children', title='Cookies for Everyone?', level=3,
        statement='<p>There are <code>n</code> children and <code>m</code> cookies. Child <code>i</code> is happy only with a cookie of size at least <code>g<sub>i</sub></code>. '
                  'Each child can get at most one cookie and each cookie can go to at most one child. What is the largest number of children you can make happy?</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. The second line holds the <code>n</code> values <code>g<sub>i</sub></code>; '
              'the third line holds the <code>m</code> cookie sizes.</p>',
        output='<p>One integer: the largest number of happy children.</p>',
        constraints='<p>1 ≤ n, m ≤ 1000; all values are between 1 and 10<sup>6</sup>.</p>',
        examples=[('3 2\n1 2 3\n1 1\n', '1\n'), ('2 3\n1 2\n1 2 3\n', '2\n')],
        hint='<p>Sort both lists. Go through the cookies from smallest to largest; give a cookie to the least demanding child still waiting if it is big enough, otherwise the cookie is useless.</p>',
        solution=r'''
n, m = map(int, input().split())
g = sorted(map(int, input().split()))
s = sorted(map(int, input().split()))
child = 0
for size in s:
    if child < n and size >= g[child]:
        child += 1
print(child)
''',
        alt=r'''
n, m = map(int, input().split())
g = sorted(map(int, input().split()), reverse=True)
s = sorted(map(int, input().split()), reverse=True)
j = 0
happy = 0
for need in g:
    if j < m and s[j] >= need:
        happy += 1
        j += 1
print(happy)
''',
        tests=lambda r: ['1 1\n5\n4\n', '1 1\n5\n5\n', '3 3\n1 1 1\n1 1 1\n', '2 4\n10 10\n1 2 3 4\n', '4 2\n1 2 3 4\n1000000 1000000\n']
        + [(lambda n, m, k: lines(f'{n} {m}', ints(rl(r, n, 1, k)), ints(rl(r, m, 1, k))))(r.randint(1, 400), r.randint(1, 400), r.choice([10, 1000, 1000000])) for _ in range(5)],
    ),
    Problem(
        slug='boat-trips', title='Boat Trips', level=3,
        statement='<p>A group of <code>n</code> people must cross a river. Each boat trip can carry <strong>at most two</strong> people, and their total weight must not exceed <code>L</code>. '
                  'Nobody weighs more than <code>L</code>. What is the smallest number of trips needed?</p>',
        input='<p>The first line holds <code>n</code> and <code>L</code>. The second line holds the <code>n</code> weights.</p>',
        output='<p>One integer: the smallest number of boat trips.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 1 ≤ weight ≤ L ≤ 10<sup>6</sup>.</p>',
        examples=[('4 100\n70 50 80 50\n', '3\n', '<p>80 alone, 70 alone, and the two 50s together.</p>'), ('3 10\n3 5 7\n', '2\n')],
        hint='<p>Sort the weights. The heaviest person must go in some boat; the best partner to try is the lightest person left. Two pointers, one at each end.</p>',
        solution=r'''
n, L = map(int, input().split())
w = sorted(map(int, input().split()))
i, j = 0, n - 1
trips = 0
while i <= j:
    if i < j and w[i] + w[j] <= L:
        i += 1
    j -= 1
    trips += 1
print(trips)
''',
        alt=r'''
n, L = map(int, input().split())
w = sorted(map(int, input().split()))
trips = 0
while w:
    big = w.pop()
    partner = -1
    for k in range(len(w) - 1, -1, -1):
        if w[k] + big <= L:
            partner = k
            break
    if partner >= 0:
        w.pop(partner)
    trips += 1
print(trips)
''',
        tests=lambda r: ['1 5\n5\n', '2 10\n5 5\n', '2 9\n5 5\n', '5 10\n1 1 1 1 1\n', '4 6\n6 6 6 6\n']
        + [(lambda n, L: lines(f'{n} {L}', ints(rl(r, n, 1, L))))(r.randint(2, 500), r.choice([10, 100, 1000000])) for _ in range(5)],
    ),
    Problem(
        slug='interview-cutoff', title='Who Gets an Interview?', level=3,
        statement='<p>A school plans to accept <code>m</code> students from <code>n</code> applicants, and invites about one and a half times that many to an interview. '
                  'Sort the applicants by test score (highest first; equal scores by smaller ID first). The <strong>cut-off score</strong> is the score of the applicant in place '
                  '⌊1.5 × m⌋ of this order. Everyone whose score is at least the cut-off is invited, which may be more than ⌊1.5 × m⌋ people because of ties.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds an applicant\'s ID and score.</p>',
        output='<p>The first line holds the cut-off score and the number of invited applicants. Then one line per invited applicant, <code>ID score</code>, in the sorted order.</p>',
        constraints='<p>1 ≤ m, ⌊1.5 × m⌋ ≤ n ≤ 500; IDs are distinct four-digit numbers (1000–9999); scores are between 1 and 100.</p>',
        examples=[('6 3\n1000 90\n3239 88\n2390 95\n7231 84\n1005 95\n1001 88\n', '88 5\n1005 95\n2390 95\n1000 90\n1001 88\n3239 88\n',
                   '<p>⌊1.5 × 3⌋ = 4, and the 4th applicant in order has 88, so everyone with 88 or more is invited.</p>')],
        hint='<p>Sort with the key (−score, ID). Compute <code>m * 3 // 2</code> to avoid decimals; the cut-off is at index one less than that.</p>',
        solution=r'''
n, m = map(int, input().split())
apps = []
for _ in range(n):
    i, s = map(int, input().split())
    apps.append((i, s))
apps.sort(key=lambda p: (-p[1], p[0]))
cut = apps[m * 3 // 2 - 1][1]
chosen = [p for p in apps if p[1] >= cut]
print(cut, len(chosen))
for i, s in chosen:
    print(i, s)
''',
        alt=r'''
n, m = map(int, input().split())
apps = [tuple(map(int, input().split())) for _ in range(n)]
scores = sorted((s for _, s in apps), reverse=True)
cut = scores[int(m * 1.5) - 1]
chosen = sorted((p for p in apps if p[1] >= cut), key=lambda p: p[0])
chosen.sort(key=lambda p: p[1], reverse=True)
print(cut, len(chosen))
for p in chosen:
    print(*p)
''',
        tests=lambda r: ['1 1\n1234 50\n', '3 2\n1000 10\n1001 10\n1002 10\n', '2 1\n5000 1\n4000 100\n', '4 2\n1000 70\n2000 80\n3000 90\n4000 60\n']
        + [interview_case(r, r.randint(2, 400)) for _ in range(6)],
    ),
    Problem(
        slug='fair-pairs', title='Fair Pairs', level=3,
        statement='<p>There are <code>2n</code> children, and child <code>i</code> carries a bag of weight <code>w<sub>i</sub></code>. They walk in <code>n</code> pairs, '
                  'and each pair carries their two bags together. Split the children into pairs so that the <strong>heaviest</strong> pair load is as light as possible. Print that load.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds the <code>2n</code> weights.</p>',
        output='<p>One integer: the smallest possible value of the heaviest pair load.</p>',
        constraints='<p>1 ≤ n ≤ 500; 1 ≤ w<sub>i</sub> ≤ 10<sup>6</sup>.</p>',
        examples=[('3\n5 1 9 3 7 4\n', '10\n', '<p>Pairs (1, 9), (3, 7) and (4, 5) carry 10, 10 and 9.</p>')],
        hint='<p>The heaviest bag needs the lightest partner it can get. After that pair is made, the same reasoning applies to what is left. Sort, and use two pointers.</p>',
        explanation='<p>Why is this best? Take any pairing where the heaviest bag is not with the lightest one. Swapping partners so that it is never makes the largest load bigger, '
                    'so the "lightest with heaviest" pairing is at least as good as every other.</p>',
        solution=r'''
n = int(input())
w = sorted(map(int, input().split()))
best = 0
for i in range(n):
    best = max(best, w[i] + w[2 * n - 1 - i])
print(best)
''',
        alt=r'''
n = int(input())
w = list(map(int, input().split()))
worst = 0
while w:
    a = max(w)
    w.remove(a)
    b = min(w)
    w.remove(b)
    worst = max(worst, a + b)
print(worst)
''',
        tests=lambda r: [lines(1, '3 4'), lines(2, '1 1 1 1'), lines(2, '1 2 3 100'), lines(2, '1000000 1000000 1 1')]
        + [(lambda n: lines(n, ints(rl(r, 2 * n, 1, r.choice([10, 1000, 1000000])))))(r.randint(1, 400)) for _ in range(6)],
    ),
    Problem(
        slug='three-sum-zero', title='Three That Cancel Out', level=3,
        statement='<p>Given <code>n</code> <strong>different</strong> integers, count how many groups of three of them add up to exactly 0. '
                  'A group is a set of three numbers; the order does not matter.</p>',
        input='<p>The first line holds <code>n</code>. The second line holds <code>n</code> distinct integers.</p>',
        output='<p>One integer: the number of groups.</p>',
        constraints='<p>1 ≤ n ≤ 300; every number is between −10<sup>5</sup> and 10<sup>5</sup>.</p>',
        examples=[('6\n-1 0 1 2 -4 3\n', '2\n', '<p>−1 + 0 + 1 and −4 + 1 + 3.</p>')],
        hint='<p>Three nested loops would check millions of groups. Sort, fix the smallest number of the group, and find the other two with the two-pointer pair-sum method on the numbers to its right.</p>',
        solution=r'''
n = int(input())
a = sorted(map(int, input().split()))
count = 0
for i in range(n - 2):
    lo, hi = i + 1, n - 1
    while lo < hi:
        s = a[i] + a[lo] + a[hi]
        if s == 0:
            count += 1
            lo += 1
            hi -= 1
        elif s < 0:
            lo += 1
        else:
            hi -= 1
print(count)
''',
        alt=r'''
n = int(input())
a = sorted(map(int, input().split()))
s = set(a)
count = 0
for i in range(n):
    for j in range(i + 1, n):
        c = -(a[i] + a[j])
        if c > a[j] and c in s:
            count += 1
print(count)
''',
        tests=lambda r: [nl([0]), nl([0, 1]), nl([-1, 0, 1]), nl([1, 2, 3]), nl(list(range(-10, 11)))]
        + [nl(r.sample(range(-k, k + 1), min(300, 2 * k))) for k in (20, 100, 1000, 100000)]
        + [nl(r.sample(range(-200, 201), 150))],
    ),
    Problem(
        slug='light-triples', title='Light Enough Triples', level=3,
        statement='<p>A lift can take three boxes at a time, but only if their total weight is <strong>less than</strong> <code>t</code>. '
                  'Given the weights of <code>n</code> boxes, count how many different groups of three boxes the lift can take. Boxes with equal weights are still different boxes.</p>',
        input='<p>The first line holds <code>n</code> and <code>t</code>. The second line holds the <code>n</code> weights.</p>',
        output='<p>One integer: the number of groups of three boxes with total weight less than <code>t</code>.</p>',
        constraints='<p>1 ≤ n ≤ 300; 1 ≤ weight ≤ 10<sup>5</sup>; 1 ≤ t ≤ 3·10<sup>5</sup>.</p>',
        examples=[('5 10\n2 7 1 4 3\n', '4\n', '<p>1+2+3, 1+2+4, 1+3+4 and 2+3+4.</p>')],
        hint='<p>Sort, and fix the lightest box of the group. For the other two use pointers <code>lo</code> and <code>hi</code>: '
             'if box <code>lo</code> and box <code>hi</code> fit, then box <code>lo</code> also fits with every box between them.</p>',
        solution=r'''
n, t = map(int, input().split())
a = sorted(map(int, input().split()))
count = 0
for i in range(n - 2):
    lo, hi = i + 1, n - 1
    while lo < hi:
        if a[i] + a[lo] + a[hi] < t:
            count += hi - lo
            lo += 1
        else:
            hi -= 1
print(count)
''',
        alt=r'''
from bisect import bisect_left
n, t = map(int, input().split())
a = sorted(map(int, input().split()))
count = 0
for i in range(n):
    for j in range(i + 1, n):
        k = bisect_left(a, t - a[i] - a[j], j + 1)
        count += k - (j + 1)
print(count)
''',
        tests=lambda r: ['1 100\n5\n', '3 10\n3 3 3\n', '3 9\n3 3 3\n', '4 300000\n100000 100000 100000 100000\n', '5 4\n1 1 1 1 1\n']
        + [(lambda n, k: lines(f'{n} {r.randint(3, 3 * k)}', ints(rl(r, n, 1, k))))(r.randint(3, 300), r.choice([10, 1000, 100000])) for _ in range(5)],
    ),
    Problem(
        slug='alien-alphabet', title='An Alien Alphabet', level=3,
        statement='<p>On another planet the 26 lowercase letters are used in a different order. Given that order, sort a list of words the way an alien dictionary would: '
                  'compare letter by letter using the alien order, and if one word is the start of the other, the shorter word comes first.</p>',
        input='<p>The first line holds the 26 letters in alien order (each letter once). The second line holds <code>n</code>. Each of the next <code>n</code> lines holds one word.</p>',
        output='<p>The words in alien dictionary order, one per line.</p>',
        constraints='<p>1 ≤ n ≤ 500; words are 1 to 10 lowercase letters and may repeat.</p>',
        examples=[('zyxwvutsrqponmlkjihgfedcba\n4\nabc\nb\nab\nzz\n', 'zz\nb\nab\nabc\n')],
        hint='<p>Turn each word into a list of numbers: the alien position of each letter. Python compares lists just like strings, including the "shorter prefix first" rule.</p>',
        solution=r'''
order = input().strip()
pos = {c: i for i, c in enumerate(order)}
n = int(input())
words = [input().strip() for _ in range(n)]
words.sort(key=lambda w: [pos[c] for c in w])
for w in words:
    print(w)
''',
        alt=r'''
order = input().strip()
to_normal = str.maketrans(order, 'abcdefghijklmnopqrstuvwxyz')
n = int(input())
words = [input().strip() for _ in range(n)]
for w in sorted(words, key=lambda w: w.translate(to_normal)):
    print(w)
''',
        tests=lambda r: [lines('abcdefghijklmnopqrstuvwxyz', 3, 'b', 'a', 'ab'), lines('zyxwvutsrqponmlkjihgfedcba', 1, 'q'),
                         lines('bacdefghijklmnopqrstuvwxyz', 4, 'ab', 'ba', 'a', 'b')]
        + [(lambda o: lines(o, n := r.randint(2, 450), *[word(r, 1, 10, o[:4] if k % 2 else o) for _ in range(n)]))(''.join(r.sample(string.ascii_lowercase, 26))) for k in range(6)],
    ),
    Problem(
        slug='busiest-moment', title='The Busiest Moment', level=3,
        statement='<p>A museum records when each visitor came in and went out. Visitor <code>i</code> is inside from time <code>a<sub>i</sub></code> up to, '
                  'but not including, time <code>b<sub>i</sub></code>: someone who leaves at time 5 and someone who arrives at time 5 are never inside together. '
                  'What is the largest number of visitors inside at the same moment?</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>a<sub>i</sub></code> and <code>b<sub>i</sub></code>.</p>',
        output='<p>One integer: the largest number of visitors inside at once.</p>',
        constraints='<p>1 ≤ n ≤ 1000; 0 ≤ a<sub>i</sub> &lt; b<sub>i</sub> ≤ 10<sup>4</sup>.</p>',
        examples=[('4\n1 5\n2 3\n3 7\n5 6\n', '2\n'), ('3\n1 10\n2 9\n3 8\n', '3\n')],
        hint='<p>Make one sorted list of arrival times and one sorted list of leaving times, and merge them with two pointers like a timeline. '
             'When an arrival and a departure happen at the same time, handle the departure first.</p>',
        solution=r'''
n = int(input())
arr, dep = [], []
for _ in range(n):
    a, b = map(int, input().split())
    arr.append(a)
    dep.append(b)
arr.sort()
dep.sort()
i = j = 0
inside = best = 0
while i < n:
    if arr[i] < dep[j]:
        inside += 1
        best = max(best, inside)
        i += 1
    else:
        inside -= 1
        j += 1
print(best)
''',
        alt=r'''
n = int(input())
diff = [0] * 10002
for _ in range(n):
    a, b = map(int, input().split())
    diff[a] += 1
    diff[b] -= 1
cur = best = 0
for d in diff:
    cur += d
    best = max(best, cur)
print(best)
''',
        tests=lambda r: [lines(1, '0 1'), lines(2, '1 5', '5 9'), lines(2, '1 5', '4 9'), lines(3, '0 10000', '0 10000', '9999 10000')]
        + [(lambda n, k: words_input([(lambda a: f'{a} {r.randint(a + 1, min(10000, a + k))}')(r.randint(0, 9999)) for _ in range(n)]))(r.randint(2, 500), r.choice([5, 100, 10000])) for _ in range(6)],
    ),
]
