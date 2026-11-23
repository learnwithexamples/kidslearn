"""LearnCamp Class 6 — Matrices (lists of lists)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools'))
from lc import Problem, lines, ints  # noqa: E402


def grid(r, n, m, lo, hi):
    """An n x m matrix of random integers in [lo, hi]."""
    return [[r.randint(lo, hi) for _ in range(m)] for _ in range(n)]


def nm(M, head=None):
    """The common input shape: 'n m' (or a custom first line), then the rows."""
    if head is None:
        head = f'{len(M)} {len(M[0])}'
    return lines(head, *[ints(row) for row in M])


def sq(M):
    """Square matrix input: n, then the n rows."""
    return lines(len(M), *[ints(row) for row in M])


def rows_of(M):
    return [ints(row) for row in M]


def dims(r, lo=1, hi=30):
    return r.randint(lo, hi), r.randint(lo, hi)


def chars(r, n, m, alphabet, weights=None):
    """n strings of length m drawn from alphabet."""
    return [''.join(r.choices(alphabet, weights=weights, k=m)) for _ in range(n)]


def rot_cw(M):
    return [list(t) for t in zip(*M[::-1])]


def siamese(n):
    """A magic square of odd order n."""
    M = [[0] * n for _ in range(n)]
    i, j = 0, n // 2
    for v in range(1, n * n + 1):
        M[i][j] = v
        ni, nj = (i - 1) % n, (j + 1) % n
        if M[ni][nj]:
            ni, nj = (i + 1) % n, j
        i, j = ni, nj
    return M


DURER = [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]]


def rectangles(r, n, m, tries):
    """A '.'/'#' grid holding solid rectangles that never touch, not even at a corner."""
    g = [['.'] * m for _ in range(n)]
    for _ in range(tries):
        h, w = r.randint(1, max(1, n // 3)), r.randint(1, max(1, m // 3))
        top, left = r.randint(0, n - h), r.randint(0, m - w)
        clear = all(g[i][j] == '.' for i in range(max(0, top - 1), min(n, top + h + 1))
                    for j in range(max(0, left - 1), min(m, left + w + 1)))
        if clear:
            for i in range(top, top + h):
                for j in range(left, left + w):
                    g[i][j] = '#'
    return [''.join(row) for row in g]


def ttt_boards(r, k):
    """Random tic-tac-toe boards where at most one player has three in a line."""
    L = [[(0, 0), (0, 1), (0, 2)], [(1, 0), (1, 1), (1, 2)], [(2, 0), (2, 1), (2, 2)],
         [(0, 0), (1, 0), (2, 0)], [(0, 1), (1, 1), (2, 1)], [(0, 2), (1, 2), (2, 2)],
         [(0, 0), (1, 1), (2, 2)], [(0, 2), (1, 1), (2, 0)]]
    out = []
    while len(out) < k:
        b = chars(r, 3, 3, 'XO.', [3, 3, 2])
        wins = {p for p in 'XO' for line in L if all(b[i][j] == p for i, j in line)}
        if len(wins) <= 1:
            out.append(lines(*b))
    return out


CLASS = dict(
    id=6,
    title='Matrices',
    blurb='Lists inside a list make a grid: read it, walk its rows and columns, turn it, flip it and look at a cell\'s neighbours.',
    summary='''
<p>Plenty of things come as a grid rather than a line: a chessboard, a seating plan, a spreadsheet, a game map, the
pixels of a photo. In Python a grid is simply a list whose items are themselves lists, one list per row. Such a
table of numbers is called a <strong>matrix</strong>, and with two indexes, one for the row and one for the column,
you can reach any cell in it. This class is about getting comfortable moving around inside one.</p>
<ul>
    <li>Building a matrix from input or with a comprehension, and steering clear of the <code>[[0] * m] * n</code> trap.</li>
    <li>Reaching a cell with <code>m[i][j]</code> and printing a matrix neatly, one row per line.</li>
    <li>Walking along rows and down columns: row sums, column sums, largest and smallest values.</li>
    <li>Reshaping a grid: transposing (also with <code>zip(*m)</code>), swapping rows, flipping and turning by 90°.</li>
    <li>The main diagonal, the anti-diagonal and the cell "opposite" a cell through the centre.</li>
    <li>The 4 or 8 neighbours of a cell, checked carefully so you never step off the edge.</li>
    <li>Real grids: boards, seat maps, Minesweeper, the Game of Life and pictures stored as numbers.</li>
</ul>''',
    tutorial=[
        dict(h='A list of lists', html='''
<p>A matrix is a list of rows, and every row is a list. To reach a cell you first pick the row, then the column
inside that row: <code>m[i][j]</code> is row <code>i</code>, column <code>j</code>. Both count from 0.</p>
<pre class="try">m = [[5, 1, 8, 2],
     [7, 3, 0, 4],
     [6, 9, 2, 1]]
print(m[0])          # the whole first row
print(m[1][2])       # row 1, column 2
print(m[2][-1])      # last item of the last row
print(len(m), len(m[0]))   # 3 rows, 4 columns</pre>
<p>Here is where every cell of that 3 × 4 matrix lives:</p>
<table>
<tr><th></th><th>column 0</th><th>column 1</th><th>column 2</th><th>column 3</th></tr>
<tr><th>row 0</th><td>m[0][0] = 5</td><td>m[0][1] = 1</td><td>m[0][2] = 8</td><td>m[0][3] = 2</td></tr>
<tr><th>row 1</th><td>m[1][0] = 7</td><td>m[1][1] = 3</td><td>m[1][2] = 0</td><td>m[1][3] = 4</td></tr>
<tr><th>row 2</th><td>m[2][0] = 6</td><td>m[2][1] = 9</td><td>m[2][2] = 2</td><td>m[2][3] = 1</td></tr>
</table>
<div class="lc-key">Row first, column second: <code>m[row][col]</code>. The number of rows is
<code>len(m)</code>, the number of columns is <code>len(m[0])</code>. A problem that says "row 2, column 3"
(counting from 1) means <code>m[1][2]</code>.</div>'''),
        dict(h='Reading a matrix and printing it', html='''
<p>The usual input gives the size <code>n m</code> first and then <code>n</code> lines with <code>m</code>
numbers each. Read one row per line and append it:</p>
<pre class="try" data-input="2 3\\n1 2 3\\n4 5 6">n, m = map(int, input().split())
a = []
for _ in range(n):
    a.append(list(map(int, input().split())))
print(a)</pre>
<p>The same thing in one line with a list comprehension:
<code>a = [list(map(int, input().split())) for _ in range(n)]</code>.</p>
<p>Printing <code>a</code> directly shows the brackets, which judges do not want. Print each row on its own line
with single spaces instead:</p>
<pre class="try">a = [[1, 2, 3], [4, 5, 6]]
for row in a:
    print(*row)
for row in a:                              # the same, with join
    print(' '.join(map(str, row)))</pre>
<div class="lc-tip"><code>' '.join(...)</code> only accepts strings, so numbers have to go through
<code>map(str, row)</code> first. <code>print(*row)</code> does that conversion for you.</div>'''),
        dict(h='Building a matrix (and a famous trap)', html='''
<p>To make an <code>n × m</code> matrix of zeros, build a <em>new</em> row for every row:</p>
<pre class="try">n, m = 3, 4
a = [[0] * m for _ in range(n)]
a[0][1] = 7
for row in a:
    print(*row)</pre>
<p>A comprehension can fill in values from the position too, like a multiplication table:</p>
<pre class="try">t = [[i * j for j in range(1, 6)] for i in range(1, 4)]
for row in t:
    print(*row)</pre>
<p>Now the trap. <code>[[0] * m] * n</code> <em>looks</em> the same, but it makes one row and puts
<strong>the same row</strong> into the outer list <code>n</code> times. Change one cell and every row changes:</p>
<pre class="try">bad = [[0] * 4] * 3
bad[0][1] = 7
for row in bad:
    print(*row)          # the 7 shows up in every row!</pre>
<div class="lc-warn">Never write <code>[[0] * m] * n</code>. Use <code>[[0] * m for _ in range(n)]</code>. For
the same reason <code>b = a</code> does not copy a matrix; to copy it write
<code>b = [row[:] for row in a]</code>.</div>'''),
        dict(h='Walking rows and columns', html='''
<p>Two nested loops visit every cell: the outer loop picks a row, the inner loop walks along it. A row is a
list, so <code>sum</code>, <code>max</code> and friends work on it directly.</p>
<pre class="try">a = [[5, 1, 8],
     [7, 3, 0],
     [6, 9, 2]]
n, m = len(a), len(a[0])
total = 0
for i in range(n):
    for j in range(m):
        total += a[i][j]
print('total', total)
print('row sums', [sum(row) for row in a])
print('row maxima', [max(row) for row in a])</pre>
<p>A column is not stored as a list, so you collect it: column <code>j</code> is <code>a[i][j]</code> for every
row <code>i</code>. Swap the order of the loops to walk down the columns:</p>
<pre class="try">a = [[5, 1, 8],
     [7, 3, 0],
     [6, 9, 2]]
n, m = len(a), len(a[0])
for j in range(m):
    col = [a[i][j] for i in range(n)]
    print('column', j, col, 'sum', sum(col))</pre>
<div class="lc-tip"><code>zip(*a)</code> hands you the columns one by one (as tuples), so
<code>[sum(c) for c in zip(*a)]</code> is every column sum at once.</div>'''),
        dict(h='Transposing, swapping and turning', html='''
<p>The <strong>transpose</strong> turns rows into columns: the new matrix has <code>m</code> rows and
<code>n</code> columns, and its cell <code>[j][i]</code> is the old cell <code>[i][j]</code>.</p>
<pre class="try">a = [[1, 2, 3],
     [4, 5, 6]]
n, m = len(a), len(a[0])
t = [[a[i][j] for i in range(n)] for j in range(m)]
for row in t:
    print(*row)
print(list(zip(*a)))        # zip does the same job</pre>
<p>Rows are just items of the outer list, so swapping two rows is one line, and reversing the outer list turns
the picture upside down. Reversing every row mirrors it left to right.</p>
<pre class="try">a = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
a[0], a[2] = a[2], a[0]               # swap rows 0 and 2
print(a)
print(a[::-1])                        # upside down
print([row[::-1] for row in a])       # mirror image</pre>
<p>Turning by 90° clockwise is "upside down, then transpose": the old bottom row becomes the new first
column.</p>
<pre class="try">a = [[1, 2, 3],
     [4, 5, 6]]
cw = [list(r) for r in zip(*a[::-1])]
for row in cw:
    print(*row)</pre>'''),
        dict(h='Diagonals and opposite cells', html='''
<p>In a square <code>n × n</code> matrix the <strong>main diagonal</strong> runs from the top-left to the
bottom-right corner: the cells where <code>i == j</code>. The <strong>anti-diagonal</strong> runs from the
top-right to the bottom-left: the cells where <code>i + j == n - 1</code>.</p>
<table>
<tr><th></th><th>j = 0</th><th>j = 1</th><th>j = 2</th><th>j = 3</th></tr>
<tr><th>i = 0</th><td>main</td><td></td><td></td><td>anti</td></tr>
<tr><th>i = 1</th><td></td><td>main</td><td>anti</td><td></td></tr>
<tr><th>i = 2</th><td></td><td>anti</td><td>main</td><td></td></tr>
<tr><th>i = 3</th><td>anti</td><td></td><td></td><td>main</td></tr>
</table>
<pre class="try">a = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
n = len(a)
print([a[i][i] for i in range(n)])          # main diagonal
print([a[i][n - 1 - i] for i in range(n)])  # anti-diagonal
below = all(a[i][j] == 0 for i in range(n) for j in range(i))
print('zeros below the diagonal?', below)</pre>
<p>Cells below the main diagonal have <code>i &gt; j</code>; cells above it have <code>i &lt; j</code>. Mirroring
across the main diagonal sends <code>(i, j)</code> to <code>(j, i)</code>, so a matrix is
<strong>symmetric</strong> when <code>a[i][j] == a[j][i]</code> everywhere.</p>
<div class="lc-key">Spinning a picture half a turn around its centre sends cell <code>(i, j)</code> of an
<code>n × m</code> grid to <code>(n - 1 - i, m - 1 - j)</code>. With positions counted from 1 the same rule reads
<code>(n + 1 - i, m + 1 - j)</code>.</div>'''),
        dict(h='Neighbours of a cell', html='''
<p>Many grid problems ask about the cells next to a cell. List the steps as row and column changes, then check
each neighbour really is inside the grid before you touch it:</p>
<pre class="try">a = [[1, 2, 3],
     [4, 5, 6]]
n, m = len(a), len(a[0])
steps4 = [(-1, 0), (1, 0), (0, -1), (0, 1)]          # up, down, left, right
i, j = 0, 0
for di, dj in steps4:
    r, c = i + di, j + dj
    if 0 &lt;= r &lt; n and 0 &lt;= c &lt; m:
        print('neighbour', r, c, 'holds', a[r][c])</pre>
<p>The 8 neighbours (the four sides plus the four corners) are every step with <code>di</code> and
<code>dj</code> in <code>-1, 0, 1</code>, except standing still:</p>
<pre class="try">grid = ['*..',
        '.*.',
        '...']
n, m = len(grid), len(grid[0])
i, j = 1, 2
count = 0
for di in (-1, 0, 1):
    for dj in (-1, 0, 1):
        if di == 0 and dj == 0:
            continue
        r, c = i + di, j + dj
        if 0 &lt;= r &lt; n and 0 &lt;= c &lt; m and grid[r][c] == '*':
            count += 1
print(count)</pre>
<div class="lc-warn">Without the bounds check, <code>a[-1][j]</code> does <em>not</em> crash: it quietly reads
the last row, giving a wrong answer that is hard to spot. Always check <code>0 &lt;= r &lt; n</code> and
<code>0 &lt;= c &lt; m</code>.</div>'''),
        dict(h='Grids of characters: boards, maps and pictures', html='''
<p>A board or map usually arrives as lines of characters, like <code>#..#</code>. A string can already be
indexed like a row, so a list of strings works as a read-only grid. When you need to change cells, turn each
line into a list of characters and join it back when printing.</p>
<pre class="try" data-input="3 4\\n#..#\\n.##.\\n#..#">n, m = map(int, input().split())
g = [list(input()) for _ in range(n)]
g[0][1] = 'X'                  # change one cell
for row in g:
    print(''.join(row))
print(sum(row.count('#') for row in g), 'walls')</pre>
<p>A grey-scale picture is just a matrix of brightness values from 0 (black) to 255 (white). Making it brighter
means adding to every pixel, but a pixel can never go past 255:</p>
<pre class="try">img = [[10, 200, 250],
       [0, 128, 90]]
brighter = [[min(255, p + 40) for p in row] for row in img]
for row in brighter:
    print(*row)</pre>
<div class="lc-tip">When every cell of the next step depends on the old grid (like the Game of Life or a
blur), build a brand-new grid for the result. Changing the old one in place would mix old and new values.</div>'''),
    ],
)

# ── Problems ─────────────────────────────────────────────────────────────
PROBLEMS = [
    # ── Level 1 ──────────────────────────────────────────────────────────
    Problem(
        slug='absolute-matrix', title='Make Them Positive', level=1,
        statement='<p>You are given a matrix of integers. Replace every number with its absolute value (its distance from 0, '
                  'so −39 becomes 39 and 22 stays 22) and print the new matrix.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>, the number of rows and columns. '
              'Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p><code>n</code> lines, each with <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −100 and 100.</p>',
        examples=[('5 5\n22 62 -39 -15 37\n-34 95 -85 26 -57\n8 33 -36 69 -4\n-36 -55 -92 96 -70\n79 -93 -42 -44 66\n',
                   '22 62 39 15 37\n34 95 85 26 57\n8 33 36 69 4\n36 55 92 96 70\n79 93 42 44 66\n')],
        hint='<p>Python has a built-in <code>abs</code>. Handle one row at a time: read it, change it, print it.</p>',
        solution=r'''
n, m = map(int, input().split())
for _ in range(n):
    row = list(map(int, input().split()))
    print(*[abs(x) for x in row])
''',
        alt=r'''
import sys
data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
vals = [abs(int(t)) for t in data[2:]]
for i in range(n):
    print(' '.join(str(v) for v in vals[i * m:(i + 1) * m]))
''',
        tests=lambda r: [nm([[-7]]), nm([[0, -100, 100]]), nm([[-1], [2], [-3]])] + [
            nm(grid(r, *dims(r), -100, 100)) for _ in range(6)],
    ),
    Problem(
        slug='matrix-total', title='Add Up the Grid', level=1,
        statement='<p>Find the sum of all the numbers in a matrix.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One integer: the sum of all <code>n · m</code> numbers.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('2 3\n1 2 3\n4 5 6\n', '21\n'), ('1 1\n-7\n', '-7\n')],
        hint='<p>Keep a running total and add the sum of each row as you read it.</p>',
        solution=r'''
n, m = map(int, input().split())
total = 0
for _ in range(n):
    row = list(map(int, input().split()))
    total += sum(row)
print(total)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
t = 0
for i in range(n):
    for j in range(m):
        t += a[i][j]
print(t)
''',
        tests=lambda r: [nm([[0]]), nm([[1000] * 30] * 30), nm([[-5, 5], [3, -3]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='row-sums', title='Sum of Every Row', level=1,
        statement='<p>For each row of a matrix, print the sum of the numbers in that row.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p><code>n</code> lines: the sum of row 1, the sum of row 2, and so on.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('3 4\n1 2 3 4\n5 5 5 5\n-1 0 1 0\n', '10\n20\n0\n')],
        hint='<p>A row is a list, and <code>sum</code> works on lists.</p>',
        solution=r'''
n, m = map(int, input().split())
for _ in range(n):
    row = list(map(int, input().split()))
    print(sum(row))
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    s = 0
    for j in range(m):
        s += a[i][j]
    print(s)
''',
        tests=lambda r: [nm([[4]]), nm([[1, 2, 3, 4, 5]]), nm([[1], [-2], [3]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='look-up-cells', title='What Is in That Cell?', level=1,
        statement='<p>A matrix is given, followed by some questions. Each question names a cell by its row and column, '
                  'both counted from 1. Answer each question with the number stored in that cell.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>, then <code>n</code> lines with <code>m</code> integers each. '
              'The next line holds <code>q</code>, and each of the last <code>q</code> lines holds a row <code>r</code> and a column <code>c</code>.</p>',
        output='<p><code>q</code> lines: the number in each asked cell.</p>',
        constraints='<p>1 ≤ n, m ≤ 20; 1 ≤ q ≤ 50; 1 ≤ r ≤ n; 1 ≤ c ≤ m; every number is between −1000 and 1000.</p>',
        examples=[('3 3\n1 2 3\n4 5 6\n7 8 9\n3\n1 1\n2 3\n3 2\n', '1\n6\n8\n')],
        hint='<p>Row <code>r</code> and column <code>c</code> counted from 1 live at <code>a[r - 1][c - 1]</code>.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
q = int(input())
for _ in range(q):
    r, c = map(int, input().split())
    print(a[r - 1][c - 1])
''',
        alt=r'''
import sys
d = sys.stdin.read().split()
n, m = int(d[0]), int(d[1])
flat = d[2:2 + n * m]
q = int(d[2 + n * m])
p = 3 + n * m
for _ in range(q):
    r, c = int(d[p]), int(d[p + 1])
    p += 2
    print(flat[(r - 1) * m + (c - 1)])
''',
        tests=lambda r: [lines('1 1', 5, 1, '1 1'), lines('1 3', '7 8 9', 3, '1 3', '1 1', '1 2'), lines('3 1', 4, 5, 6, 2, '3 1', '1 1')] + [
            (lambda n, m: lines(f'{n} {m}', *rows_of(grid(r, n, m, -1000, 1000)), q := r.randint(1, 50),
                                *[f'{r.randint(1, n)} {r.randint(1, m)}' for _ in range(q)]))(*dims(r, 1, 20)) for _ in range(6)],
    ),
    Problem(
        slug='times-k', title='Multiply the Matrix', level=1,
        statement='<p>Multiply every number of a matrix by the same integer <code>k</code> and print the result.</p>',
        input='<p>The first line holds <code>n</code>, <code>m</code> and <code>k</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>The new matrix: <code>n</code> lines of <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; −100 ≤ k ≤ 100; every number is between −100 and 100.</p>',
        examples=[('2 3 3\n1 -2 0\n4 5 -6\n', '3 -6 0\n12 15 -18\n')],
        hint='<p>A list comprehension can build each new row from the old one.</p>',
        solution=r'''
n, m, k = map(int, input().split())
for _ in range(n):
    row = list(map(int, input().split()))
    print(*[x * k for x in row])
''',
        alt=r'''
n, m, k = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    for j in range(m):
        a[i][j] *= k
for row in a:
    print(' '.join(map(str, row)))
''',
        tests=lambda r: [nm([[5]], '1 1 0'), nm([[1, -1, 2]], '1 3 -1'), nm([[3], [4]], '2 1 100')] + [
            (lambda M: nm(M, f'{len(M)} {len(M[0])} {r.randint(-100, 100)}'))(grid(r, *dims(r), -100, 100)) for _ in range(6)],
    ),
    Problem(
        slug='add-matrices', title='Adding Two Matrices', level=1,
        statement='<p>Two matrices of the same size are given. Their sum is the matrix whose every cell is the sum of the two '
                  'cells in the same place. Print it.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. The next <code>n</code> lines hold the first matrix, '
              'and the <code>n</code> lines after that hold the second matrix.</p>',
        output='<p>The sum: <code>n</code> lines of <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 20; every number is between −1000 and 1000.</p>',
        examples=[('2 2\n1 2\n3 4\n10 20\n30 40\n', '11 22\n33 44\n')],
        hint='<p>Read both matrices first. Then cell <code>[i][j]</code> of the answer is <code>a[i][j] + b[i][j]</code>.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
b = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    print(*[a[i][j] + b[i][j] for j in range(m)])
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
b = [list(map(int, input().split())) for _ in range(n)]
for ra, rb in zip(a, b):
    print(' '.join(str(x + y) for x, y in zip(ra, rb)))
''',
        tests=lambda r: [lines('1 1', 0, 0), lines('1 3', '1 2 3', '-1 -2 -3'), lines('2 1', 1000, -1000, 1000, -1000)] + [
            (lambda n, m: lines(f'{n} {m}', *rows_of(grid(r, n, m, -1000, 1000)), *rows_of(grid(r, n, m, -1000, 1000))))(*dims(r, 1, 20))
            for _ in range(6)],
    ),
    Problem(
        slug='times-table', title='Times Table', level=1,
        statement='<p>Build the times table with <code>n</code> rows and <code>m</code> columns: the number in row <code>i</code>, '
                  'column <code>j</code> (both counted from 1) is <code>i × j</code>. Print it.</p>',
        input='<p>One line with <code>n</code> and <code>m</code>.</p>',
        output='<p><code>n</code> lines with <code>m</code> numbers each, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 20.</p>',
        examples=[('3 4\n', '1 2 3 4\n2 4 6 8\n3 6 9 12\n')],
        hint='<p>Two loops: one over the rows <code>i = 1 … n</code>, one inside it over the columns <code>j = 1 … m</code>.</p>',
        solution=r'''
n, m = map(int, input().split())
for i in range(1, n + 1):
    row = []
    for j in range(1, m + 1):
        row.append(i * j)
    print(*row)
''',
        alt=r'''
n, m = map(int, input().split())
t = [[i * j for j in range(1, m + 1)] for i in range(1, n + 1)]
for row in t:
    print(' '.join(map(str, row)))
''',
        tests=['1 1', '1 20', '20 1', '20 20', '9 9', '2 7', '12 5', '5 12'],
    ),
    Problem(
        slug='chessboard', title='Chessboard', level=1,
        statement='<p>Draw an <code>n × m</code> chessboard. The top-left square is dark, and dark and light squares alternate '
                  'along every row and every column. A dark square is drawn as <code>#</code> and a light one as <code>.</code>.</p>',
        input='<p>One line with <code>n</code> and <code>m</code>.</p>',
        output='<p><code>n</code> lines of <code>m</code> characters each, with no spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 50.</p>',
        examples=[('3 5\n', '#.#.#\n.#.#.\n#.#.#\n')],
        hint='<p>Look at <code>i + j</code> for each square. What do all the dark squares have in common?</p>',
        solution=r'''
n, m = map(int, input().split())
for i in range(n):
    line = ''
    for j in range(m):
        if (i + j) % 2 == 0:
            line += '#'
        else:
            line += '.'
    print(line)
''',
        alt=r'''
n, m = map(int, input().split())
a = ('#.' * m)[:m]
b = ('.#' * m)[:m]
for i in range(n):
    print(a if i % 2 == 0 else b)
''',
        tests=['1 1', '1 6', '6 1', '2 2', '50 50', '8 8', '7 3', '4 9'],
    ),
    Problem(
        slug='plus-zero-minus', title='Plus, Zero, Minus', level=1,
        statement='<p>Count how many numbers in a matrix are positive, how many are zero and how many are negative.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One line with three numbers: the count of positive numbers, of zeros, and of negative numbers.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −100 and 100.</p>',
        examples=[('3 3\n1 0 -2\n0 0 5\n-1 -1 0\n', '2 4 3\n')],
        hint='<p>Three counters, one pass over every cell.</p>',
        solution=r'''
n, m = map(int, input().split())
pos = zero = neg = 0
for _ in range(n):
    for x in map(int, input().split()):
        if x > 0:
            pos += 1
        elif x == 0:
            zero += 1
        else:
            neg += 1
print(pos, zero, neg)
''',
        alt=r'''
import sys
v = list(map(int, sys.stdin.read().split()))[2:]
print(sum(1 for x in v if x > 0), v.count(0), sum(1 for x in v if x < 0))
''',
        tests=lambda r: [nm([[0]]), nm([[5, 6]]), nm([[-1], [-2]])] + [
            nm(grid(r, *dims(r), -3, 3)) for _ in range(4)] + [nm(grid(r, *dims(r), -100, 100)) for _ in range(2)],
    ),
    Problem(
        slug='row-maxima', title='Best of Each Row', level=1,
        statement='<p>For every row of a matrix, find the largest number in that row.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One line with <code>n</code> numbers separated by single spaces: the largest number of row 1, of row 2, and so on.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('3 4\n3 8 1 2\n-5 -2 -9 -3\n7 7 0 7\n', '8 -2 7\n')],
        hint='<p>Collect <code>max(row)</code> for each row into a list, then print the list.</p>',
        solution=r'''
n, m = map(int, input().split())
best = []
for _ in range(n):
    row = list(map(int, input().split()))
    best.append(max(row))
print(*best)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
out = []
for i in range(n):
    b = a[i][0]
    for j in range(1, m):
        if a[i][j] > b:
            b = a[i][j]
    out.append(str(b))
print(' '.join(out))
''',
        tests=lambda r: [nm([[-1000]]), nm([[1, 2, 3, 2, 1]]), nm([[4], [-4], [0]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='ones-per-column', title='Ones in Each Column', level=1,
        statement='<p>A matrix holds only 0s and 1s. For every column, count how many 1s it contains.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> numbers, each 0 or 1.</p>',
        output='<p><code>m</code> lines: the number of 1s in column 1, in column 2, and so on.</p>',
        constraints='<p>1 ≤ n, m ≤ 40.</p>',
        examples=[('3 5\n0 0 1 1 0\n0 1 1 0 1\n1 0 0 1 0\n', '1\n1\n2\n2\n1\n'),
                  ('5 8\n1 1 1 0 0 1 0 1\n0 0 1 1 1 0 1 1\n1 0 0 1 1 0 1 0\n0 0 0 0 1 1 1 1\n0 0 1 1 1 1 1 0\n', '2\n1\n3\n3\n4\n3\n4\n3\n')],
        hint='<p>Keep a list of <code>m</code> counters, one per column. Every row adds its numbers to the matching counters.</p>',
        solution=r'''
n, m = map(int, input().split())
count = [0] * m
for _ in range(n):
    row = list(map(int, input().split()))
    for j in range(m):
        count[j] += row[j]
for c in count:
    print(c)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for col in zip(*a):
    print(col.count(1))
''',
        tests=lambda r: [nm([[0]]), nm([[1]]), nm([[1, 0, 1, 1]]), nm([[1], [1], [0]])] + [
            nm(grid(r, *dims(r, 1, 40), 0, 1)) for _ in range(5)],
    ),
    Problem(
        slug='mirror-rows', title='In the Mirror', level=1,
        statement='<p>Show a matrix as it would look in a mirror standing on its right side: every row is written backwards, '
                  'while the rows stay in the same order.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>The mirrored matrix: <code>n</code> lines of <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('2 4\n1 2 3 4\n5 6 7 8\n', '4 3 2 1\n8 7 6 5\n')],
        hint='<p>A slice with step <code>-1</code> reverses a list.</p>',
        solution=r'''
n, m = map(int, input().split())
for _ in range(n):
    row = input().split()
    print(*row[::-1])
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    print(*[a[i][m - 1 - j] for j in range(m)])
''',
        tests=lambda r: [nm([[9]]), nm([[1, 2, 3]]), nm([[1], [2], [3]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='upside-down', title='Upside Down', level=1,
        statement='<p>Turn a matrix upside down: the last row comes first and the first row comes last. '
                  'Each row itself is not changed.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>The rows in reverse order, one per line, numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('3 2\n1 2\n3 4\n5 6\n', '5 6\n3 4\n1 2\n')],
        hint='<p>Store all the rows first; you can only print the first row after you have seen the last one.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for row in a[::-1]:
    print(*row)
''',
        alt=r'''
n, m = map(int, input().split())
a = [input().split() for _ in range(n)]
for i in range(n - 1, -1, -1):
    print(' '.join(a[i]))
''',
        tests=lambda r: [nm([[9]]), nm([[1, 2, 3]]), nm([[1], [2], [3]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='main-diagonal', title='Down the Diagonal', level=1,
        statement='<p>A square matrix is given. Its <em>main diagonal</em> runs from the top-left corner to the bottom-right '
                  'corner: the 1st number of row 1, the 2nd number of row 2, and so on. Print the numbers on it and their sum.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>n</code> integers.</p>',
        output='<p>Two lines: the diagonal numbers from top to bottom, separated by single spaces, then their sum.</p>',
        constraints='<p>1 ≤ n ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('3\n1 2 3\n4 5 6\n7 8 9\n', '1 5 9\n15\n')],
        hint='<p>The cells on the main diagonal are the ones whose row index equals their column index.</p>',
        solution=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
d = [a[i][i] for i in range(n)]
print(*d)
print(sum(d))
''',
        alt=r'''
n = int(input())
d = []
for i in range(n):
    row = input().split()
    d.append(int(row[i]))
print(' '.join(map(str, d)))
print(sum(d))
''',
        tests=lambda r: [sq([[7]]), sq([[1, 2], [3, 4]]), sq([[-1000] * 3] * 3)] + [
            sq(grid(r, n, n, -1000, 1000)) for n in (r.randint(2, 30) for _ in range(6))],
    ),
    Problem(
        slug='largest-and-where', title='The Biggest Number and Its Cell', level=1,
        statement='<p>Find the largest number in a matrix and where it is. If it appears more than once, report the one in the '
                  'highest row, and in that row the one furthest to the left.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One line: the largest number, its row and its column (rows and columns counted from 1).</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('3 4\n1 9 3 9\n9 2 0 1\n5 5 5 5\n', '9 1 2\n'), ('2 2\n-5 -3\n-3 -4\n', '-3 1 2\n')],
        hint='<p>Walk row by row, left to right, and only replace your best so far when you see something <em>strictly</em> bigger.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
best, br, bc = a[0][0], 0, 0
for i in range(n):
    for j in range(m):
        if a[i][j] > best:
            best, br, bc = a[i][j], i, j
print(best, br + 1, bc + 1)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
best = max(max(row) for row in a)
for i in range(n):
    if best in a[i]:
        print(best, i + 1, a[i].index(best) + 1)
        break
''',
        tests=lambda r: [nm([[0]]), nm([[3, 3, 3]]), nm([[1], [5], [5]])] + [
            nm(grid(r, *dims(r), -5, 5)) for _ in range(3)] + [nm(grid(r, *dims(r), -1000, 1000)) for _ in range(3)],
    ),

    # ── Level 2 ──────────────────────────────────────────────────────────
    Problem(
        slug='transpose', title='Rows Become Columns', level=2,
        statement='<p>The <em>transpose</em> of a matrix swaps its rows and columns: row 1 of the original becomes column 1 '
                  'of the answer, row 2 becomes column 2, and so on. An <code>n × m</code> matrix turns into an '
                  '<code>m × n</code> one. Print the transpose.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p><code>m</code> lines with <code>n</code> numbers each, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('5 4\n3 3 3 4\n2 0 0 3\n0 3 1 4\n3 4 3 3\n1 0 3 3\n', '3 2 0 3 1\n3 0 3 4 0\n3 0 1 3 3\n4 3 4 3 3\n'),
                  ('1 3\n1 2 3\n', '1\n2\n3\n')],
        hint='<p>Line <code>j</code> of the answer is column <code>j</code> of the original: <code>a[0][j], a[1][j], …, a[n-1][j]</code>.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for j in range(m):
    print(*[a[i][j] for i in range(n)])
''',
        alt=r'''
n, m = map(int, input().split())
a = [input().split() for _ in range(n)]
for col in zip(*a):
    print(' '.join(col))
''',
        tests=lambda r: [nm([[5]]), nm([[1], [2], [3]]), nm([[1, 2], [3, 4]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='row-exchanges', title='Swapping Rows', level=2,
        statement='<p>A matrix is given, followed by a list of instructions. Each instruction names two rows <code>x</code> and '
                  '<code>y</code> and means "swap row <code>x</code> and row <code>y</code>". Carry out all the instructions in order '
                  'and print the final matrix.</p>',
        input='<p>The first line holds <code>n</code>, <code>m</code> and <code>q</code>. The next <code>n</code> lines hold the matrix. '
              'Each of the last <code>q</code> lines holds <code>x</code> and <code>y</code> (rows counted from 1; they may be equal).</p>',
        output='<p>The matrix after all the swaps: <code>n</code> lines of <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; 1 ≤ q ≤ 100; 1 ≤ x, y ≤ n; every number is between 0 and 100.</p>',
        examples=[('5 5 5\n21 63 94 12 82\n16 4 13 82 34\n37 65 42 52 3\n78 99 9 65 18\n7 78 79 99 79\n4 5\n4 5\n3 5\n2 1\n2 1\n',
                   '21 63 94 12 82\n16 4 13 82 34\n7 78 79 99 79\n78 99 9 65 18\n37 65 42 52 3\n',
                   'Swapping rows 4 and 5 twice changes nothing, and so does swapping rows 1 and 2 twice. Only the swap of rows 3 and 5 is left.')],
        hint='<p>Rows are items of the outer list, so one Python swap <code>a[i], a[j] = a[j], a[i]</code> moves a whole row.</p>',
        solution=r'''
n, m, q = map(int, input().split())
a = [input().split() for _ in range(n)]
for _ in range(q):
    x, y = map(int, input().split())
    a[x - 1], a[y - 1] = a[y - 1], a[x - 1]
for row in a:
    print(*row)
''',
        alt=r'''
n, m, q = map(int, input().split())
a = [input().split() for _ in range(n)]
order = list(range(n))
for _ in range(q):
    x, y = map(int, input().split())
    order[x - 1], order[y - 1] = order[y - 1], order[x - 1]
for k in order:
    print(' '.join(a[k]))
''',
        tests=lambda r: [lines('1 1 1', 5, '1 1'), lines('2 3 1', '1 2 3', '4 5 6', '1 2'), lines('3 1 2', 1, 2, 3, '1 3', '2 2')] + [
            (lambda n, m, q: lines(f'{n} {m} {q}', *rows_of(grid(r, n, m, 0, 100)),
                                   *[f'{r.randint(1, n)} {r.randint(1, n)}' for _ in range(q)]))(*dims(r, 1, 25), r.randint(1, 100))
            for _ in range(6)],
    ),
    Problem(
        slug='both-diagonals', title='Two Diagonals', level=2,
        statement='<p>A square matrix has two diagonals: the <em>main</em> one from the top-left to the bottom-right corner, and '
                  'the <em>anti-diagonal</em> from the top-right to the bottom-left corner. Find the sum of each.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>n</code> integers.</p>',
        output='<p>One line: the sum of the main diagonal, then the sum of the anti-diagonal.</p>',
        constraints='<p>1 ≤ n ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('3\n2 0 1\n0 5 0\n3 0 4\n', '11 9\n')],
        hint='<p>In row <code>i</code> (counting from 0) the anti-diagonal cell is in column <code>n - 1 - i</code>.</p>',
        solution=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
main = anti = 0
for i in range(n):
    main += a[i][i]
    anti += a[i][n - 1 - i]
print(main, anti)
''',
        alt=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
main = sum(a[i][j] for i in range(n) for j in range(n) if i == j)
anti = sum(a[i][j] for i in range(n) for j in range(n) if i + j == n - 1)
print(main, anti)
''',
        tests=lambda r: [sq([[7]]), sq([[1, 2], [3, 4]]), sq([[1, 0, 0], [0, 1, 0], [0, 0, 1]])] + [
            sq(grid(r, n, n, -1000, 1000)) for n in (r.randint(2, 30) for _ in range(6))],
    ),
    Problem(
        slug='totals-table', title='Table With Totals', level=2,
        statement='<p>Give a matrix totals, like a spreadsheet: add a column at the right holding the sum of each row, and a row '
                  'at the bottom holding the sum of each column. The bottom-right corner holds the sum of everything.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p><code>n + 1</code> lines with <code>m + 1</code> numbers each, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 25; every number is between −1000 and 1000.</p>',
        examples=[('2 3\n1 2 3\n4 5 6\n', '1 2 3 6\n4 5 6 15\n5 7 9 21\n')],
        hint='<p>Print each row followed by <code>sum(row)</code>. For the last line, collect the column sums, then add their total.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for row in a:
    print(*row, sum(row))
cols = [sum(a[i][j] for i in range(n)) for j in range(m)]
print(*cols, sum(cols))
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
t = [row + [sum(row)] for row in a]
t.append([sum(c) for c in zip(*t)])
for row in t:
    print(' '.join(map(str, row)))
''',
        tests=lambda r: [nm([[5]]), nm([[1, 2, 3]]), nm([[1], [2], [3]])] + [
            nm(grid(r, *dims(r, 1, 25), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='heaviest-column', title='The Heaviest Column', level=2,
        statement='<p>Which column of a matrix has the largest sum? If several columns tie, choose the leftmost one.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One line: the number of that column (counted from 1) and its sum.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −100 and 100.</p>',
        examples=[('3 4\n1 5 2 5\n3 0 4 1\n2 1 3 0\n', '3 9\n'), ('2 3\n4 1 4\n0 3 0\n', '1 4\n')],
        hint='<p>Work out all the column sums first, then find the biggest and the first place it appears.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
sums = [0] * m
for row in a:
    for j in range(m):
        sums[j] += row[j]
best = max(sums)
print(sums.index(best) + 1, best)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
bj, bs = -1, None
for j, col in enumerate(zip(*a)):
    s = sum(col)
    if bs is None or s > bs:
        bj, bs = j, s
print(bj + 1, bs)
''',
        tests=lambda r: [nm([[-4]]), nm([[1, 2, 2]]), nm([[1], [2]]), nm([[-1, -1], [-1, -1]])] + [
            nm(grid(r, *dims(r), -3, 3)) for _ in range(3)] + [nm(grid(r, *dims(r), -100, 100)) for _ in range(3)],
    ),
    Problem(
        slug='identity-check', title='Is It the Identity?', level=2,
        statement='<p>The <em>identity matrix</em> has 1s on its main diagonal (top-left to bottom-right) and 0s everywhere else. '
                  'Decide whether a given square matrix is the identity matrix.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>n</code> integers.</p>',
        output='<p><code>YES</code> if it is the identity matrix, otherwise <code>NO</code>.</p>',
        constraints='<p>1 ≤ n ≤ 30; every number is between −10 and 10.</p>',
        examples=[('3\n1 0 0\n0 1 0\n0 0 1\n', 'YES\n'), ('2\n1 0\n1 1\n', 'NO\n')],
        hint='<p>For each cell, work out what it <em>should</em> hold (1 or 0) from whether <code>i == j</code>, and compare.</p>',
        solution=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
ok = True
for i in range(n):
    for j in range(n):
        want = 1 if i == j else 0
        if a[i][j] != want:
            ok = False
print('YES' if ok else 'NO')
''',
        alt=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
ident = [[int(i == j) for j in range(n)] for i in range(n)]
print('YES' if a == ident else 'NO')
''',
        tests=lambda r: [sq([[1]]), sq([[0]]), sq([[1, 0], [0, 1]]), sq([[0, 1], [1, 0]]), sq([[1, 0, 0], [0, 2, 0], [0, 0, 1]])] + [
            (lambda n, ident: sq(ident) if r.random() < 0.4 else sq([[v if (i, j) != (n // 2, (n // 3)) else v + r.choice([-1, 1])
                                                                    for j, v in enumerate(row)] for i, row in enumerate(ident)]))(
                n, [[int(i == j) for j in range(n)] for i in range(n)]) for n in (r.randint(2, 30) for _ in range(5))],
    ),
    Problem(
        slug='symmetric-check', title='Mirror Across the Diagonal', level=2,
        statement='<p>A square matrix is <em>symmetric</em> if folding it along its main diagonal (top-left to bottom-right) '
                  'puts equal numbers on top of each other: the number in row <code>i</code>, column <code>j</code> always equals '
                  'the number in row <code>j</code>, column <code>i</code>. Is the given matrix symmetric?</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>n</code> integers.</p>',
        output='<p><code>YES</code> or <code>NO</code>.</p>',
        constraints='<p>1 ≤ n ≤ 30; every number is between −100 and 100.</p>',
        examples=[('3\n1 7 3\n7 4 -5\n3 -5 6\n', 'YES\n'), ('2\n1 2\n3 1\n', 'NO\n')],
        hint='<p>Compare <code>a[i][j]</code> with <code>a[j][i]</code>. It is enough to check the cells above the diagonal.</p>',
        solution=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
ok = True
for i in range(n):
    for j in range(i + 1, n):
        if a[i][j] != a[j][i]:
            ok = False
print('YES' if ok else 'NO')
''',
        alt=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
print('YES' if [list(c) for c in zip(*a)] == a else 'NO')
''',
        tests=lambda r: [sq([[5]]), sq([[1, 2], [2, 1]]), sq([[1, 2, 3], [2, 1, 2], [4, 2, 1]])] + [
            (lambda n, M, flip: sq([[M[min(i, j)][max(i, j)] + (1 if flip and (i, j) == (n - 1, 0) else 0) for j in range(n)] for i in range(n)]))(
                n, grid(r, n, n, -100, 99), r.random() < 0.5) for n in (r.randint(2, 30) for _ in range(6))],
    ),
    Problem(
        slug='upper-triangular', title='Zeros Below the Diagonal', level=2,
        statement='<p>A square matrix is <em>upper triangular</em> if every number below its main diagonal is 0 (the numbers on '
                  'and above the diagonal can be anything). Decide whether the given matrix is upper triangular.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>n</code> integers.</p>',
        output='<p><code>YES</code> or <code>NO</code>.</p>',
        constraints='<p>1 ≤ n ≤ 30; every number is between −100 and 100.</p>',
        examples=[('3\n1 2 3\n0 4 5\n0 0 6\n', 'YES\n'), ('3\n1 2 3\n0 4 5\n0 7 6\n', 'NO\n')],
        hint='<p>Which cells are below the diagonal? Compare the row index with the column index.</p>',
        solution=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
ok = True
for i in range(n):
    for j in range(i):
        if a[i][j] != 0:
            ok = False
print('YES' if ok else 'NO')
''',
        alt=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
print('YES' if all(x == 0 for i in range(n) for x in a[i][:i]) else 'NO')
''',
        tests=lambda r: [sq([[0]]), sq([[-3]]), sq([[1, 2], [0, 3]]), sq([[1, 0], [2, 3]]), sq([[0] * 4] * 4)] + [
            (lambda n, M, bad: sq([[0 if j < i and (i, j) != bad else M[i][j] for j in range(n)] for i in range(n)]))(
                n, grid(r, n, n, 1, 100), (r.randint(1, n - 1), 0) if r.random() < 0.5 else None) for n in (r.randint(2, 30) for _ in range(5))],
    ),
    Problem(
        slug='above-average', title='Above Average', level=2,
        statement='<p>How many numbers in a matrix are strictly greater than the average of all its numbers?</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One integer: how many numbers are above the average.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between 0 and 1000.</p>',
        examples=[('2 3\n1 2 3\n4 5 6\n', '3\n', 'The average is 3.5, and 4, 5 and 6 are above it.'), ('2 2\n5 5\n5 5\n', '0\n')],
        hint='<p>You need the total before you can compare anything, so store the whole matrix first. '
             'Comparing <code>x * count &gt; total</code> avoids decimals completely.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
total = sum(sum(row) for row in a)
count = 0
for row in a:
    for x in row:
        if x * n * m > total:
            count += 1
print(count)
''',
        alt=r'''
n, m = map(int, input().split())
vals = [int(t) for _ in range(n) for t in input().split()]
from fractions import Fraction
avg = Fraction(sum(vals), len(vals))
print(sum(1 for v in vals if v > avg))
''',
        tests=lambda r: [nm([[0]]), nm([[1, 2]]), nm([[1], [1], [2]])] + [
            nm(grid(r, *dims(r), 0, 3)) for _ in range(3)] + [nm(grid(r, *dims(r), 0, 1000)) for _ in range(3)],
    ),
    Problem(
        slug='brighter-picture', title='Turn Up the Brightness', level=2,
        statement='<p>A grey-scale picture is stored as a matrix of pixels, each from 0 (black) to 255 (white). Changing the '
                  'brightness by <code>d</code> adds <code>d</code> to every pixel, but a pixel can never go below 0 or above 255: '
                  'anything smaller becomes 0 and anything bigger becomes 255. Print the new picture.</p>',
        input='<p>The first line holds <code>n</code>, <code>m</code> and <code>d</code>. Each of the next <code>n</code> lines holds <code>m</code> pixels.</p>',
        output='<p>The new picture: <code>n</code> lines of <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; −255 ≤ d ≤ 255; 0 ≤ pixel ≤ 255.</p>',
        examples=[('2 3 50\n0 100 230\n255 10 200\n', '50 150 255\n255 60 250\n'), ('1 3 -100\n50 150 255\n', '0 50 155\n')],
        hint='<p><code>min(255, …)</code> keeps a value from going too high and <code>max(0, …)</code> from going too low.</p>',
        solution=r'''
n, m, d = map(int, input().split())
for _ in range(n):
    row = list(map(int, input().split()))
    print(*[max(0, min(255, p + d)) for p in row])
''',
        alt=r'''
n, m, d = map(int, input().split())
for _ in range(n):
    out = []
    for p in map(int, input().split()):
        v = p + d
        if v < 0:
            v = 0
        if v > 255:
            v = 255
        out.append(str(v))
    print(' '.join(out))
''',
        tests=lambda r: [nm([[0]], '1 1 -255'), nm([[255]], '1 1 255'), nm([[0, 128, 255]], '1 3 0'), nm([[10], [250]], '2 1 10')] + [
            (lambda M: nm(M, f'{len(M)} {len(M[0])} {r.randint(-255, 255)}'))(grid(r, *dims(r), 0, 255)) for _ in range(5)],
    ),
    Problem(
        slug='rotate-clockwise', title='Quarter Turn Clockwise', level=2,
        statement='<p>Turn a matrix a quarter turn clockwise, the way you would turn a photo lying on a table. The first column, '
                  'read from bottom to top, becomes the first row; the top row becomes the last column. An <code>n × m</code> matrix '
                  'turns into an <code>m × n</code> one.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>The turned matrix: <code>m</code> lines of <code>n</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('2 3\n1 2 3\n4 5 6\n', '4 1\n5 2\n6 3\n'), ('3 3\n1 2 3\n4 5 6\n7 8 9\n', '7 4 1\n8 5 2\n9 6 3\n')],
        hint='<p>Row <code>j</code> of the answer is column <code>j</code> of the original, read from the bottom row up.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for j in range(m):
    print(*[a[i][j] for i in range(n - 1, -1, -1)])
''',
        alt=r'''
n, m = map(int, input().split())
a = [input().split() for _ in range(n)]
for row in zip(*a[::-1]):
    print(' '.join(row))
''',
        tests=lambda r: [nm([[5]]), nm([[1, 2, 3]]), nm([[1], [2], [3]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='rotate-anticlockwise', title='Quarter Turn Anticlockwise', level=2,
        statement='<p>Now turn a matrix a quarter turn <em>anticlockwise</em>. The last column, read from top to bottom, becomes '
                  'the first row, and the first column becomes the last row. An <code>n × m</code> matrix turns into an '
                  '<code>m × n</code> one.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>The turned matrix: <code>m</code> lines of <code>n</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('2 3\n1 2 3\n4 5 6\n', '3 6\n2 5\n1 4\n')],
        hint='<p>Which column of the original ends up as row 1? Which as the last row? Read each one top to bottom.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for j in range(m - 1, -1, -1):
    print(*[a[i][j] for i in range(n)])
''',
        alt=r'''
n, m = map(int, input().split())
a = [input().split() for _ in range(n)]
for row in list(zip(*a))[::-1]:
    print(' '.join(row))
''',
        tests=lambda r: [nm([[5]]), nm([[1, 2, 3]]), nm([[1], [2], [3]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(6)],
    ),
    Problem(
        slug='snake-fill', title='Snake Numbering', level=2,
        statement='<p>Fill an <code>n × m</code> grid with the numbers 1, 2, 3, … like a snake: the first row goes from left to right, '
                  'the second from right to left, the third from left to right again, and so on. Print the grid.</p>',
        input='<p>One line with <code>n</code> and <code>m</code>.</p>',
        output='<p><code>n</code> lines with <code>m</code> numbers each, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 25.</p>',
        examples=[('3 4\n', '1 2 3 4\n8 7 6 5\n9 10 11 12\n')],
        hint='<p>Fill every row left to right first; then reverse the rows with an odd index.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [[0] * m for _ in range(n)]
k = 1
for i in range(n):
    for j in range(m):
        if i % 2 == 0:
            a[i][j] = k
        else:
            a[i][m - 1 - j] = k
        k += 1
for row in a:
    print(*row)
''',
        alt=r'''
n, m = map(int, input().split())
for i in range(n):
    row = list(range(i * m + 1, i * m + m + 1))
    if i % 2:
        row.reverse()
    print(' '.join(map(str, row)))
''',
        tests=['1 1', '1 7', '7 1', '2 2', '25 25', '4 3', '6 10', '11 5'],
    ),
    Problem(
        slug='matrix-multiplication', title='Multiplying Matrices', level=2,
        statement='<p>To multiply an <code>n × m</code> matrix <code>A</code> by an <code>m × p</code> matrix <code>B</code>, '
                  'each cell of the <code>n × p</code> answer <code>C</code> is made from one row of <code>A</code> and one column of '
                  '<code>B</code>: <code>C[i][j]</code> is the sum of <code>A[i][k] × B[k][j]</code> over all <code>k</code>. '
                  'In words: walk along row <code>i</code> of <code>A</code> and down column <code>j</code> of <code>B</code> at the '
                  'same time, multiply the pairs and add them up. Print <code>C</code>.</p>',
        input='<p>The first line holds <code>n</code>, <code>m</code> and <code>p</code>. The next <code>n</code> lines hold '
              '<code>A</code> (<code>m</code> numbers each), then <code>m</code> lines hold <code>B</code> (<code>p</code> numbers each).</p>',
        output='<p><code>n</code> lines with <code>p</code> numbers each, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m, p ≤ 15; every number is between −20 and 20.</p>',
        examples=[('2 3 2\n1 2 3\n4 5 6\n7 8\n9 10\n11 12\n', '58 64\n139 154\n', 'For example 58 = 1·7 + 2·9 + 3·11.')],
        hint='<p>Three loops: over <code>i</code> (rows of A), over <code>j</code> (columns of B), and an inner one over <code>k</code> that adds up the products.</p>',
        solution=r'''
n, m, p = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(n)]
B = [list(map(int, input().split())) for _ in range(m)]
for i in range(n):
    row = []
    for j in range(p):
        s = 0
        for k in range(m):
            s += A[i][k] * B[k][j]
        row.append(s)
    print(*row)
''',
        alt=r'''
n, m, p = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(n)]
B = [list(map(int, input().split())) for _ in range(m)]
cols = list(zip(*B))
for row in A:
    print(' '.join(str(sum(x * y for x, y in zip(row, c))) for c in cols))
''',
        tests=lambda r: [lines('1 1 1', 3, -4), lines('1 3 1', '1 2 3', 4, 5, 6), lines('3 1 3', 1, 2, 3, '4 5 6'),
                         lines('2 2 2', '1 0', '0 1', '5 -6', '7 8')] + [
            (lambda n, m, p: lines(f'{n} {m} {p}', *rows_of(grid(r, n, m, -20, 20)), *rows_of(grid(r, m, p, -20, 20))))(
                r.randint(1, 15), r.randint(1, 15), r.randint(1, 15)) for _ in range(5)],
    ),
    Problem(
        slug='symmetric-pairs', title='Matching Opposites', level=2,
        statement='<p>Picture a square <code>n × n</code> grid of numbers, with rows and columns counted from 1. Spinning the grid '
                  'half a turn around its centre moves the cell in row <code>x</code>, column <code>y</code> to row '
                  '<code>n + 1 − x</code>, column <code>n + 1 − y</code>; call these two cells <em>opposite</em>. In other words two '
                  'cells <code>(x1, y1)</code> and <code>(x2, y2)</code> are opposite when <code>x1 + x2 = n + 1</code> and '
                  '<code>y1 + y2 = n + 1</code>.</p>'
                  '<p>Two <strong>different</strong> opposite cells holding the same number form a <em>matching pair</em>. '
                  'Count the matching pairs. Each pair counts once, and when <code>n</code> is odd the centre cell is opposite only '
                  'itself, so it never forms a pair.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>n</code> integers.</p>',
        output='<p>One integer: the number of matching pairs.</p>',
        constraints='<p>1 ≤ n ≤ 30; every number is between 0 and 100.</p>',
        examples=[('5\n3 3 3 4 1\n2 0 0 3 1\n0 3 1 4 1\n3 4 3 3 1\n1 0 3 3 1\n', '3\n',
                   'The pairs are (1,2) with (5,4), (1,3) with (5,3), and (1,5) with (5,1).')],
        hint='<p>Look at every cell and its opposite, but count each pair only once: for example only when the cell comes '
             'before its opposite in reading order.</p>',
        solution=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
count = 0
for i in range(n):
    for j in range(n):
        oi, oj = n - 1 - i, n - 1 - j
        if (i, j) < (oi, oj) and a[i][j] == a[oi][oj]:
            count += 1
print(count)
''',
        alt=r'''
n = int(input())
flat = []
for _ in range(n):
    flat += input().split()
k = len(flat)
same = sum(1 for p in range(k) if flat[p] == flat[k - 1 - p])
if k % 2 == 1:
    same -= 1
print(same // 2)
''',
        explanation='<p>Reading the grid row by row into one long list, the opposite of position <code>p</code> is simply '
                    'position <code>n·n − 1 − p</code>, so the problem is the same as comparing a list with its reverse. '
                    'That is what the second solution does.</p>',
        tests=lambda r: [sq([[5]]), sq([[1, 1], [1, 1]]), sq([[1, 2], [3, 4]]), sq([[7] * 3] * 3)] + [
            sq(grid(r, n, n, 0, 2)) for n in (r.randint(2, 30) for _ in range(3))] + [
            sq(grid(r, n, n, 0, 100)) for n in (r.randint(2, 30) for _ in range(2))],
    ),
    Problem(
        slug='neighbour-sums', title='Sum of the Neighbours', level=2,
        statement='<p>For every cell of a matrix, add up the numbers in the cells directly above, below, to the left and to the '
                  'right of it. Cells at the edge have fewer neighbours; only the neighbours that exist are added. '
                  'Print a new matrix of these sums.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p><code>n</code> lines of <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −100 and 100. A 1 × 1 matrix has no neighbours, so its answer is 0.</p>',
        examples=[('2 3\n1 2 3\n4 5 6\n', '6 9 8\n6 12 8\n')],
        hint='<p>Loop over the four steps <code>(-1, 0), (1, 0), (0, -1), (0, 1)</code> and skip any neighbour that falls outside the grid.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    out = []
    for j in range(m):
        s = 0
        for di, dj in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            r, c = i + di, j + dj
            if 0 <= r < n and 0 <= c < m:
                s += a[r][c]
        out.append(s)
    print(*out)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
p = [[0] * (m + 2)] + [[0] + row + [0] for row in a] + [[0] * (m + 2)]
for i in range(1, n + 1):
    print(' '.join(str(p[i - 1][j] + p[i + 1][j] + p[i][j - 1] + p[i][j + 1]) for j in range(1, m + 1)))
''',
        explanation='<p>The second solution puts a border of zeros around the matrix. Then every real cell has all four '
                    'neighbours and no bounds checks are needed.</p>',
        tests=lambda r: [nm([[5]]), nm([[1, 2, 3, 4]]), nm([[1], [2], [3]])] + [
            nm(grid(r, *dims(r), -100, 100)) for _ in range(6)],
    ),
    Problem(
        slug='minesweeper', title='Minesweeper Numbers', level=2,
        statement='<p>A Minesweeper field is a grid where <code>*</code> is a mine and <code>.</code> is a safe square. For every safe '
                  'square, the game shows how many mines touch it, counting all 8 surrounding squares (sides and corners). '
                  'Print the field with every <code>.</code> replaced by that count; mines stay as <code>*</code>.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> characters, '
              'each <code>*</code> or <code>.</code>.</p>',
        output='<p><code>n</code> lines of <code>m</code> characters, with no spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 40.</p>',
        examples=[('3 4\n*...\n..*.\n....\n', '*211\n12*1\n0111\n')],
        hint='<p>For each safe square, look at every <code>di</code> and <code>dj</code> in <code>-1, 0, 1</code> (except both 0), '
             'and check the neighbour is inside the field before reading it.</p>',
        solution=r'''
n, m = map(int, input().split())
g = [input() for _ in range(n)]
for i in range(n):
    line = ''
    for j in range(m):
        if g[i][j] == '*':
            line += '*'
            continue
        count = 0
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                r, c = i + di, j + dj
                if 0 <= r < n and 0 <= c < m and g[r][c] == '*':
                    count += 1
        line += str(count)
    print(line)
''',
        alt=r'''
n, m = map(int, input().split())
g = [input() for _ in range(n)]
cnt = [[0] * m for _ in range(n)]
for i in range(n):
    for j in range(m):
        if g[i][j] == '*':
            for r in range(max(0, i - 1), min(n, i + 2)):
                for c in range(max(0, j - 1), min(m, j + 2)):
                    cnt[r][c] += 1
for i in range(n):
    print(''.join('*' if g[i][j] == '*' else str(cnt[i][j]) for j in range(m)))
''',
        tests=lambda r: [lines('1 1', '.'), lines('1 1', '*'), lines('1 5', '*.*.*'), lines('3 1', '*', '.', '*'), lines('3 3', '***', '*.*', '***')] + [
            (lambda n, m: lines(f'{n} {m}', *chars(r, n, m, '.*', [4, 1])))(*dims(r, 1, 40)) for _ in range(5)],
    ),
    Problem(
        slug='local-peaks', title='Hilltops', level=2,
        statement='<p>A matrix is a height map. A cell is a <em>hilltop</em> if its height is strictly greater than every one of its '
                  'neighbours directly above, below, left and right (neighbours outside the map do not count). '
                  'How many hilltops are there?</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One integer: the number of hilltops.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every height is between 0 and 100. In a 1 × 1 map the only cell has no neighbours, so it is a hilltop.</p>',
        examples=[('3 3\n1 2 1\n2 5 2\n1 2 9\n', '2\n'), ('1 1\n7\n', '1\n')],
        hint='<p>Assume a cell is a hilltop, then look at each existing neighbour; one neighbour that is as high or higher spoils it.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
count = 0
for i in range(n):
    for j in range(m):
        top = True
        for di, dj in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            r, c = i + di, j + dj
            if 0 <= r < n and 0 <= c < m and a[r][c] >= a[i][j]:
                top = False
        if top:
            count += 1
print(count)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
p = [[-1] * (m + 2)] + [[-1] + row + [-1] for row in a] + [[-1] * (m + 2)]
print(sum(1 for i in range(1, n + 1) for j in range(1, m + 1)
          if p[i][j] > max(p[i - 1][j], p[i + 1][j], p[i][j - 1], p[i][j + 1])))
''',
        tests=lambda r: [nm([[0]]), nm([[1, 3, 2, 5, 4]]), nm([[2], [2], [2]]), nm([[1, 2], [3, 4]])] + [
            nm(grid(r, *dims(r), 0, 3)) for _ in range(2)] + [nm(grid(r, *dims(r), 0, 100)) for _ in range(3)],
    ),
    Problem(
        slug='tic-tac-toe', title='Who Won the Game?', level=2,
        statement='<p>A tic-tac-toe board is a 3 × 3 grid. Each square holds <code>X</code>, <code>O</code> or <code>.</code> (empty). '
                  'A player wins with three of their marks in a line: a whole row, a whole column, or one of the two diagonals. '
                  'Who has won?</p>',
        input='<p>Three lines with three characters each.</p>',
        output='<p><code>X</code> or <code>O</code> for the winner, or <code>nobody</code> if neither player has three in a line.</p>',
        constraints='<p>At most one of the players has a line (both never win at once). The board does not have to come from a real game.</p>',
        examples=[('XOX\nOXO\nOOX\n', 'X\n'), ('XO.\nOX.\n..O\n', 'nobody\n')],
        hint='<p>Write down all 8 lines as lists of cells, then check each one.</p>',
        solution=r'''
g = [input() for _ in range(3)]
lines = []
for i in range(3):
    lines.append(g[i])
    lines.append(g[0][i] + g[1][i] + g[2][i])
lines.append(g[0][0] + g[1][1] + g[2][2])
lines.append(g[0][2] + g[1][1] + g[2][0])
winner = 'nobody'
for line in lines:
    if line == 'XXX':
        winner = 'X'
    if line == 'OOO':
        winner = 'O'
print(winner)
''',
        alt=r'''
g = [input() for _ in range(3)]
def wins(p):
    for i in range(3):
        if all(g[i][j] == p for j in range(3)) or all(g[j][i] == p for j in range(3)):
            return True
    return all(g[k][k] == p for k in range(3)) or all(g[k][2 - k] == p for k in range(3))
print('X' if wins('X') else 'O' if wins('O') else 'nobody')
''',
        tests=lambda r: [lines('...', '...', '...'), lines('OOO', 'X.X', 'X..'), lines('X.O', 'X.O', 'XO.'), lines('..O', '.O.', 'OXX'),
                         lines('XOX', 'XOO', 'OXX')] + ttt_boards(r, 6),
    ),
    Problem(
        slug='two-seats-together', title='Two Seats Together', level=2,
        statement='<p>A cinema seat map shows each seat as <code>0</code> (free) or <code>1</code> (taken). Two friends want two free seats '
                  'next to each other in the same row. Find the first such pair: the one in the frontmost row (row 1 is the front), and '
                  'within that row the leftmost one.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>, the number of rows and seats per row. Each of the next '
              '<code>n</code> lines holds <code>m</code> numbers, each 0 or 1.</p>',
        output='<p>The row number and the seat number of the <em>left</em> seat of the pair (both counted from 1), or the word '
               '<code>full</code> if there is no such pair.</p>',
        constraints='<p>1 ≤ n, m ≤ 30.</p>',
        examples=[('3 5\n1 0 1 0 1\n0 1 0 0 1\n0 0 0 0 0\n', '2 3\n'), ('2 3\n0 1 0\n1 0 1\n', 'full\n')],
        hint='<p>Within a row, seat <code>j</code> and seat <code>j + 1</code> are a pair when both are 0. Stop as soon as you find one.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
answer = 'full'
for i in range(n):
    for j in range(m - 1):
        if a[i][j] == 0 and a[i][j + 1] == 0:
            answer = f'{i + 1} {j + 1}'
            break
    if answer != 'full':
        break
print(answer)
''',
        alt=r'''
n, m = map(int, input().split())
rows = [input().replace(' ', '') for _ in range(n)]
for i, s in enumerate(rows):
    k = s.find('00')
    if k != -1:
        print(i + 1, k + 1)
        break
else:
    print('full')
''',
        tests=lambda r: [nm([[0]]), nm([[0, 0]]), nm([[0], [0]]), nm([[1, 1, 1], [1, 1, 1]]), nm([[1, 0, 1, 0, 0]])] + [
            nm(grid(r, *dims(r), 0, 1)) for _ in range(2)] + [
            nm([[1 if r.random() < 0.8 else 0 for _ in range(m)] for _ in range(n)]) for n, m in (dims(r) for _ in range(3))],
    ),
    Problem(
        slug='pascal-triangle', title="Pascal's Triangle", level=2,
        statement="<p>Pascal's triangle starts with a single 1. Every next row starts and ends with 1, and each number in between is "
                  'the sum of the two numbers just above it (the one above-left and the one above). Build the first <code>n</code> '
                  'rows as a list of lists and print them.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p><code>n</code> lines; line <code>k</code> holds the <code>k</code> numbers of row <code>k</code>, separated by single spaces.</p>',
        constraints='<p>1 ≤ n ≤ 30.</p>',
        examples=[('5\n', '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n')],
        hint='<p>Start with <code>[[1]]</code>. To make the next row from <code>prev</code>, the middle numbers are '
             '<code>prev[j - 1] + prev[j]</code>.</p>',
        solution=r'''
n = int(input())
t = [[1]]
for k in range(1, n):
    prev = t[-1]
    row = [1]
    for j in range(1, k):
        row.append(prev[j - 1] + prev[j])
    row.append(1)
    t.append(row)
for row in t:
    print(*row)
''',
        alt=r'''
from math import comb
n = int(input())
for k in range(n):
    print(' '.join(str(comb(k, j)) for j in range(k + 1)))
''',
        tests=['1', '2', '3', '30', '10', '17', '24', '7'],
    ),
    Problem(
        slug='border-sum', title='Around the Edge', level=2,
        statement='<p>Add up the numbers on the outer edge of a matrix: the whole first row, the whole last row, the whole first '
                  'column and the whole last column. A cell that lies on two edges (a corner) is still counted only once.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One integer: the sum of the edge cells.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −100 and 100.</p>',
        examples=[('3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n', '65\n'), ('1 3\n4 5 6\n', '15\n')],
        hint='<p>Rather than adding four sides (and worrying about corners and thin matrices), ask of each cell: is it in the first '
             'or last row, or the first or last column?</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
total = 0
for i in range(n):
    for j in range(m):
        if i == 0 or i == n - 1 or j == 0 or j == m - 1:
            total += a[i][j]
print(total)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
everything = sum(map(sum, a))
inside = sum(sum(row[1:m - 1]) for row in a[1:n - 1])
print(everything - inside)
''',
        tests=lambda r: [nm([[5]]), nm([[1], [2], [3]]), nm([[1, 2], [3, 4]]), nm([[1, 1, 1], [1, 100, 1], [1, 1, 1]])] + [
            nm(grid(r, *dims(r), -100, 100)) for _ in range(5)],
    ),
    Problem(
        slug='sort-rows-by-sum', title='Lightest Rows First', level=2,
        statement='<p>Reorder the rows of a matrix so that their sums go from smallest to largest. Rows with equal sums keep the '
                  'order they had in the input. The rows themselves are not changed.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>The reordered matrix: <code>n</code> lines of <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −100 and 100.</p>',
        examples=[('4 3\n3 3 3\n1 0 0\n5 -5 1\n2 2 2\n', '1 0 0\n5 -5 1\n2 2 2\n3 3 3\n')],
        hint='<p><code>sorted</code> takes a <code>key</code> function, and Python\'s sort never swaps two items that compare equal.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for row in sorted(a, key=sum):
    print(*row)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for i in range(1, n):
    j = i
    while j > 0 and sum(a[j - 1]) > sum(a[j]):
        a[j - 1], a[j] = a[j], a[j - 1]
        j -= 1
for row in a:
    print(' '.join(map(str, row)))
''',
        tests=lambda r: [nm([[5]]), nm([[1, 2, 3]]), nm([[3], [1], [2], [1]]), nm([[1, 0], [0, 1], [2, -1]])] + [
            nm(grid(r, *dims(r), -2, 2)) for _ in range(2)] + [nm(grid(r, *dims(r), -100, 100)) for _ in range(3)],
    ),

    # ── Level 3 ──────────────────────────────────────────────────────────
    Problem(
        slug='saddle-points', title='Saddle Points', level=3,
        statement='<p>A cell of a matrix is a <em>saddle point</em> if its number is the smallest in its row (no number in the row is '
                  'smaller) and at the same time the largest in its column (no number in the column is larger). Find every saddle point.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>First the number of saddle points. Then one line per saddle point with its row and column (counted from 1), '
               'in reading order: top row first, left to right within a row.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −100 and 100.</p>',
        examples=[('3 3\n1 2 3\n4 5 6\n7 8 9\n', '1\n3 1\n'), ('2 2\n1 2\n2 1\n', '0\n')],
        hint='<p>Work out every row minimum and every column maximum once, before you test the cells.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
row_min = [min(row) for row in a]
col_max = [max(a[i][j] for i in range(n)) for j in range(m)]
found = []
for i in range(n):
    for j in range(m):
        if a[i][j] == row_min[i] and a[i][j] == col_max[j]:
            found.append((i + 1, j + 1))
print(len(found))
for r, c in found:
    print(r, c)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
out = []
for i in range(n):
    for j in range(m):
        x = a[i][j]
        if all(x <= y for y in a[i]) and all(x >= a[k][j] for k in range(n)):
            out.append(f'{i + 1} {j + 1}')
print(len(out))
if out:
    print('\n'.join(out))
''',
        tests=lambda r: [nm([[4]]), nm([[3, 1, 2]]), nm([[3], [1], [2]]), nm([[2, 2], [2, 2]]), nm([[5, 6, 7], [1, 9, 0], [4, 8, 4]])] + [
            nm(grid(r, *dims(r, 1, 6), 0, 2)) for _ in range(3)] + [nm(grid(r, *dims(r), -100, 100)) for _ in range(2)],
    ),
    Problem(
        slug='spiral-order', title='Reading in a Spiral', level=3,
        statement='<p>Read a matrix in a clockwise spiral: start at the top-left corner, go right along the top row, down the right '
                  'column, left along the bottom row and up the left column, then keep spiralling inwards in the same way until '
                  'every number has been read exactly once.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>All <code>n · m</code> numbers on one line in spiral order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n', '1 2 3 4 8 12 11 10 9 5 6 7\n')],
        hint='<p>Keep four borders: <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>. After walking one side, '
             'move that border inwards. Be careful when only a single row or column is left.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
top, bottom, left, right = 0, n - 1, 0, m - 1
out = []
while top <= bottom and left <= right:
    for j in range(left, right + 1):
        out.append(a[top][j])
    top += 1
    for i in range(top, bottom + 1):
        out.append(a[i][right])
    right -= 1
    if top <= bottom:
        for j in range(right, left - 1, -1):
            out.append(a[bottom][j])
        bottom -= 1
    if left <= right:
        for i in range(bottom, top - 1, -1):
            out.append(a[i][left])
        left += 1
print(*out)
''',
        alt=r'''
n, m = map(int, input().split())
a = [input().split() for _ in range(n)]
out = []
while a:
    out += a[0]
    a = [list(c) for c in zip(*a[1:])][::-1]
print(' '.join(out))
''',
        explanation='<p>The second solution takes the top row, then turns what is left a quarter turn anticlockwise, so the '
                    'next side to read is again the top row.</p>',
        tests=lambda r: [nm([[5]]), nm([[1, 2, 3, 4]]), nm([[1], [2], [3]]), nm([[1, 2], [3, 4]]),
                         nm([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(4)],
    ),
    Problem(
        slug='spiral-fill', title='Spiral Numbering', level=3,
        statement='<p>Fill an <code>n × m</code> grid with 1, 2, 3, … in a clockwise spiral: start in the top-left corner, go right '
                  'along the top row, down the right side, left along the bottom, up the left side, and keep spiralling inwards '
                  'until the grid is full. Print it.</p>',
        input='<p>One line with <code>n</code> and <code>m</code>.</p>',
        output='<p><code>n</code> lines with <code>m</code> numbers each, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 20.</p>',
        examples=[('3 4\n', '1 2 3 4\n10 11 12 5\n9 8 7 6\n'), ('4 1\n', '1\n2\n3\n4\n')],
        hint='<p>Walk step by step with a direction (right, down, left, up). Turn right whenever the next cell would be outside the grid '
             'or is already filled.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [[0] * m for _ in range(n)]
steps = [(0, 1), (1, 0), (0, -1), (-1, 0)]
d = 0
i = j = 0
for k in range(1, n * m + 1):
    a[i][j] = k
    r, c = i + steps[d][0], j + steps[d][1]
    if not (0 <= r < n and 0 <= c < m and a[r][c] == 0):
        d = (d + 1) % 4
        r, c = i + steps[d][0], j + steps[d][1]
    i, j = r, c
for row in a:
    print(*row)
''',
        alt=r'''
n, m = map(int, input().split())
a = [[0] * m for _ in range(n)]
top, bottom, left, right = 0, n - 1, 0, m - 1
k = 1
while top <= bottom and left <= right:
    cells = [(top, j) for j in range(left, right + 1)]
    cells += [(i, right) for i in range(top + 1, bottom + 1)]
    if top < bottom:
        cells += [(bottom, j) for j in range(right - 1, left - 1, -1)]
    if left < right:
        cells += [(i, left) for i in range(bottom - 1, top, -1)]
    for i, j in cells:
        a[i][j] = k
        k += 1
    top, bottom, left, right = top + 1, bottom - 1, left + 1, right - 1
for row in a:
    print(' '.join(map(str, row)))
''',
        tests=['1 1', '1 6', '4 1', '2 2', '20 20', '3 3', '5 8', '9 4', '6 6', '7 2'],
    ),
    Problem(
        slug='zigzag-diagonals', title='Zigzag Through the Diagonals', level=3,
        statement='<p>Read a matrix in zigzag order along its diagonals, the way some picture formats store their pixels. '
                  'Number the diagonals by <code>d = i + j</code> (row index plus column index, both from 0), and visit '
                  '<code>d = 0, 1, 2, …</code> in turn. On a diagonal with odd <code>d</code> walk from its top-right end down to its '
                  'bottom-left end; on a diagonal with even <code>d</code> walk from its bottom-left end up to its top-right end.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>All <code>n · m</code> numbers on one line in zigzag order, separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; every number is between −1000 and 1000.</p>',
        examples=[('3 3\n1 2 3\n4 5 6\n7 8 9\n', '1 2 4 7 5 3 6 8 9\n')],
        hint='<p>On diagonal <code>d</code> the row <code>i</code> goes from <code>max(0, d − (m − 1))</code> to <code>min(d, n − 1)</code>, '
             'and the column is <code>d − i</code>. Collect that diagonal, then reverse it when needed.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
out = []
for d in range(n + m - 1):
    diag = []
    for i in range(max(0, d - (m - 1)), min(d, n - 1) + 1):
        diag.append(a[i][d - i])
    if d % 2 == 0:
        diag.reverse()
    out += diag
print(*out)
''',
        alt=r'''
n, m = map(int, input().split())
a = [input().split() for _ in range(n)]
cells = [(i, j) for i in range(n) for j in range(m)]
cells.sort(key=lambda p: (p[0] + p[1], p[0] if (p[0] + p[1]) % 2 else -p[0]))
print(' '.join(a[i][j] for i, j in cells))
''',
        tests=lambda r: [nm([[5]]), nm([[1, 2, 3, 4]]), nm([[1], [2], [3]]), nm([[1, 2], [3, 4]]), nm([[1, 2, 3], [4, 5, 6]])] + [
            nm(grid(r, *dims(r), -1000, 1000)) for _ in range(4)],
    ),
    Problem(
        slug='game-of-life', title='The Game of Life', level=3,
        statement='<p>In the Game of Life every cell of a grid is alive (<code>#</code>) or dead (<code>.</code>). Each step, all cells '
                  'change at the same moment, looking at their 8 neighbours (sides and corners; cells outside the grid count as dead):</p>'
                  '<ul><li>a live cell with 2 or 3 live neighbours stays alive, otherwise it dies;</li>'
                  '<li>a dead cell with exactly 3 live neighbours comes alive, otherwise it stays dead.</li></ul>'
                  '<p>Show the grid after <code>k</code> steps.</p>',
        input='<p>The first line holds <code>n</code>, <code>m</code> and <code>k</code>. Each of the next <code>n</code> lines holds '
              '<code>m</code> characters, each <code>#</code> or <code>.</code>.</p>',
        output='<p>The grid after <code>k</code> steps: <code>n</code> lines of <code>m</code> characters.</p>',
        constraints='<p>1 ≤ n, m ≤ 25; 1 ≤ k ≤ 10.</p>',
        examples=[('5 5 1\n.....\n..#..\n..#..\n..#..\n.....\n', '.....\n.....\n.###.\n.....\n.....\n',
                   'A line of three cells flips between standing up and lying down.')],
        hint='<p>Build a brand-new grid for the next step from the old one. Updating the old grid in place would make some cells see '
             'their neighbours\' <em>new</em> states.</p>',
        solution=r'''
n, m, k = map(int, input().split())
g = [input() for _ in range(n)]
for _ in range(k):
    new = []
    for i in range(n):
        line = ''
        for j in range(m):
            alive = 0
            for di in (-1, 0, 1):
                for dj in (-1, 0, 1):
                    if di == 0 and dj == 0:
                        continue
                    r, c = i + di, j + dj
                    if 0 <= r < n and 0 <= c < m and g[r][c] == '#':
                        alive += 1
            if g[i][j] == '#':
                line += '#' if alive in (2, 3) else '.'
            else:
                line += '#' if alive == 3 else '.'
        new.append(line)
    g = new
for line in g:
    print(line)
''',
        alt=r'''
n, m, k = map(int, input().split())
live = {(i, j) for i in range(n) for j, ch in enumerate(input()) if ch == '#'}
for _ in range(k):
    cnt = {}
    for i, j in live:
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                if di or dj:
                    p = (i + di, j + dj)
                    cnt[p] = cnt.get(p, 0) + 1
    live = {p for p, c in cnt.items() if 0 <= p[0] < n and 0 <= p[1] < m and (c == 3 or (c == 2 and p in live))}
for i in range(n):
    print(''.join('#' if (i, j) in live else '.' for j in range(m)))
''',
        tests=lambda r: [lines('1 1 1', '#'), lines('1 5 2', '#####'), lines('2 2 3', '##', '##'), lines('3 1 1', '#', '#', '#'),
                         lines('6 6 4', '.#....', '..#...', '###...', '......', '......', '......')] + [
            (lambda n, m: lines(f'{n} {m} {r.randint(1, 10)}', *chars(r, n, m, '.#', [2, 1])))(*dims(r, 1, 25)) for _ in range(5)],
    ),
    Problem(
        slug='magic-square', title='Is It Magic?', level=3,
        statement='<p>An <code>n × n</code> grid is a <em>magic square</em> if it holds each of the numbers 1, 2, …, <code>n²</code> '
                  'exactly once, and every row, every column and both diagonals add up to the same total. Decide whether the given '
                  'grid is a magic square.</p>',
        input='<p>The first line holds <code>n</code>. Each of the next <code>n</code> lines holds <code>n</code> integers.</p>',
        output='<p><code>YES</code> or <code>NO</code>.</p>',
        constraints='<p>1 ≤ n ≤ 15; every number is between 0 and 1000.</p>',
        examples=[('3\n2 7 6\n9 5 1\n4 3 8\n', 'YES\n'), ('3\n5 5 5\n5 5 5\n5 5 5\n', 'NO\n', 'All the sums match, but the numbers are not 1 to 9.')],
        hint='<p>Two separate checks: sort all the numbers and compare with <code>1 … n²</code>; then collect the <code>2n + 2</code> '
             'sums into a list and see whether they are all equal.</p>',
        solution=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
nums = sorted(x for row in a for x in row)
ok = nums == list(range(1, n * n + 1))
sums = [sum(row) for row in a]
sums += [sum(a[i][j] for i in range(n)) for j in range(n)]
sums.append(sum(a[i][i] for i in range(n)))
sums.append(sum(a[i][n - 1 - i] for i in range(n)))
if len(set(sums)) != 1:
    ok = False
print('YES' if ok else 'NO')
''',
        alt=r'''
n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
target = n * (n * n + 1) // 2
seen = [False] * (n * n + 1)
ok = True
for row in a:
    for x in row:
        if x < 1 or x > n * n or seen[x]:
            ok = False
        else:
            seen[x] = True
for i in range(n):
    if sum(a[i]) != target or sum(a[k][i] for k in range(n)) != target:
        ok = False
d1 = d2 = 0
for i in range(n):
    d1 += a[i][i]
    d2 += a[i][n - 1 - i]
if d1 != target or d2 != target:
    ok = False
print('YES' if ok else 'NO')
''',
        tests=lambda r: [sq([[1]]), sq([[5]]), sq([[1, 2], [3, 4]]), sq(DURER), sq(rot_cw(siamese(5))), sq(siamese(15)),
                         sq([[1, 5, 9], [6, 7, 2], [8, 3, 4]]),
                         sq([[x + 1 for x in row] for row in siamese(3)]), sq([row[::-1] for row in DURER]),
                         sq([[2, 7, 6], [9, 5, 1], [4, 8, 3]])] + [
            (lambda M: sq([[M[(i + 1) % len(M)][j] if (i, j) in ((0, 0),) else M[i][j] for j in range(len(M))] for i in range(len(M))]))(siamese(n))
            for n in (7, 9)],
    ),
    Problem(
        slug='best-square', title='The Richest Square', level=3,
        statement='<p>A field is divided into an <code>n × m</code> grid, and each square of land has a value (which can be negative). '
                  'You may buy one block of <code>k × k</code> squares. Which block is worth the most? If several blocks tie, choose '
                  'the one whose top-left corner is highest, and then furthest left.</p>',
        input='<p>The first line holds <code>n</code>, <code>m</code> and <code>k</code>. Each of the next <code>n</code> lines holds <code>m</code> integers.</p>',
        output='<p>One line: the best total, then the row and column of the block\'s top-left square (counted from 1).</p>',
        constraints='<p>1 ≤ n, m ≤ 30; 1 ≤ k ≤ min(n, m); every value is between −100 and 100.</p>',
        examples=[('3 4 2\n1 2 -1 4\n0 3 5 -2\n2 1 0 1\n', '9 1 2\n')],
        hint='<p>Try every possible top-left corner <code>(i, j)</code> with <code>i + k ≤ n</code> and <code>j + k ≤ m</code>, add up the '
             'block, and replace your best only on a strictly bigger total.</p>',
        solution=r'''
n, m, k = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
best = None
for i in range(n - k + 1):
    for j in range(m - k + 1):
        s = 0
        for r in range(i, i + k):
            s += sum(a[r][j:j + k])
        if best is None or s > best:
            best, bi, bj = s, i, j
print(best, bi + 1, bj + 1)
''',
        alt=r'''
n, m, k = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
P = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(n):
    for j in range(m):
        P[i + 1][j + 1] = a[i][j] + P[i][j + 1] + P[i + 1][j] - P[i][j]
cands = []
for i in range(n - k + 1):
    for j in range(m - k + 1):
        s = P[i + k][j + k] - P[i][j + k] - P[i + k][j] + P[i][j]
        cands.append((-s, i, j))
s, i, j = min(cands)
print(-s, i + 1, j + 1)
''',
        explanation='<p>The second solution uses a 2-D prefix sum: <code>P[i][j]</code> is the total of the top-left '
                    '<code>i × j</code> corner, and any block\'s total comes from four of those corners.</p>',
        tests=lambda r: [nm([[-5]], '1 1 1'), nm([[1, 2, 3]], '1 3 1'), nm([[1], [2], [3]], '3 1 1'), nm([[1, 1], [1, 1]], '2 2 2'),
                         nm([[0] * 4] * 4, '4 4 2')] + [
            (lambda M: nm(M, f'{len(M)} {len(M[0])} {r.randint(1, min(len(M), len(M[0])))}'))(grid(r, *dims(r), -100, 100)) for _ in range(5)],
    ),
    Problem(
        slug='box-blur', title='Blurring a Picture', level=3,
        statement='<p>A simple way to blur a grey-scale picture: every pixel becomes the average of itself and its 8 neighbours. '
                  'Pixels at the edge or in a corner have fewer neighbours, and only the pixels that exist are averaged. The average is '
                  'rounded down to a whole number. All new values are worked out from the <em>original</em> picture.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> pixels.</p>',
        output='<p>The blurred picture: <code>n</code> lines of <code>m</code> numbers separated by single spaces.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; 0 ≤ pixel ≤ 255.</p>',
        examples=[('2 3\n10 20 30\n40 50 60\n', '30 35 40\n30 35 40\n'), ('1 3\n0 1 255\n', '0 85 128\n')],
        hint='<p>For each pixel, add up the values in the 3 × 3 block around it that lie inside the picture, count how many there were, '
             'and use <code>//</code>.</p>',
        solution=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    out = []
    for j in range(m):
        total = count = 0
        for r in range(i - 1, i + 2):
            for c in range(j - 1, j + 2):
                if 0 <= r < n and 0 <= c < m:
                    total += a[r][c]
                    count += 1
        out.append(total // count)
    print(*out)
''',
        alt=r'''
n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    rows = a[max(0, i - 1):i + 2]
    out = []
    for j in range(m):
        block = [x for row in rows for x in row[max(0, j - 1):j + 2]]
        out.append(str(sum(block) // len(block)))
    print(' '.join(out))
''',
        tests=lambda r: [nm([[200]]), nm([[0, 255, 0, 255]]), nm([[255], [0], [1]]), nm([[255] * 3] * 3)] + [
            nm(grid(r, *dims(r), 0, 255)) for _ in range(5)],
    ),
    Problem(
        slug='count-rectangles', title='Counting Rooftops', level=3,
        statement='<p>A satellite photo shows a town from above: <code>#</code> is a roof and <code>.</code> is open ground. Every '
                  'building has a solid rectangular roof, and no two buildings touch each other, not even at a corner. '
                  'How many buildings are there?</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> characters, '
              'each <code>#</code> or <code>.</code>.</p>',
        output='<p>One integer: the number of buildings.</p>',
        constraints='<p>1 ≤ n, m ≤ 40.</p>',
        examples=[('4 6\n##..#.\n##..#.\n......\n.###..\n', '3\n')],
        hint='<p>Every rectangle has exactly one top-left corner. What is special about the cells above and to the left of that corner?</p>',
        solution=r'''
n, m = map(int, input().split())
g = [input() for _ in range(n)]
count = 0
for i in range(n):
    for j in range(m):
        if g[i][j] == '#':
            up = i > 0 and g[i - 1][j] == '#'
            left = j > 0 and g[i][j - 1] == '#'
            if not up and not left:
                count += 1
print(count)
''',
        alt=r'''
n, m = map(int, input().split())
g = [list(input()) for _ in range(n)]
count = 0
for i in range(n):
    for j in range(m):
        if g[i][j] == '#':
            count += 1
            r = i
            while r < n and g[r][j] == '#':
                c = j
                while c < m and g[r][c] == '#':
                    g[r][c] = '.'
                    c += 1
                r += 1
print(count)
''',
        explanation='<p>The second solution finds a roof, counts it and then wipes the whole rectangle off the map so it is not counted again.</p>',
        tests=lambda r: [lines('1 1', '.'), lines('1 1', '#'), lines('1 7', '#.##.#.'), lines('4 1', '#', '#', '.', '#'), lines('3 3', '###', '###', '###')] + [
            (lambda n, m: lines(f'{n} {m}', *rectangles(r, n, m, r.randint(3, 60))))(*dims(r, 2, 40)) for _ in range(5)],
    ),
    Problem(
        slug='rotation-check', title='Turned or Not?', level=3,
        statement='<p>Two square matrices <code>A</code> and <code>B</code> of the same size are given. Can <code>B</code> be made by '
                  'turning <code>A</code> clockwise by 0°, 90°, 180° or 270°? Print the smallest such angle, or <code>-1</code> if no '
                  'turn works. (A mirror image is not a turn.)</p>',
        input='<p>The first line holds <code>n</code>. The next <code>n</code> lines hold <code>A</code>, and the <code>n</code> lines after '
              'that hold <code>B</code>.</p>',
        output='<p>One of <code>0</code>, <code>90</code>, <code>180</code>, <code>270</code> or <code>-1</code>.</p>',
        constraints='<p>1 ≤ n ≤ 20; every number is between 0 and 100.</p>',
        examples=[('2\n1 2\n3 4\n3 1\n4 2\n', '90\n'), ('2\n1 2\n3 4\n1 3\n2 4\n', '-1\n')],
        hint='<p>Write a function that turns a matrix a quarter turn clockwise. Compare, turn, compare again — four tries at most.</p>',
        solution=r'''
n = int(input())
A = [list(map(int, input().split())) for _ in range(n)]
B = [list(map(int, input().split())) for _ in range(n)]

def turn(M):
    return [[M[n - 1 - i][j] for i in range(n)] for j in range(n)]

answer = -1
for angle in (0, 90, 180, 270):
    if A == B:
        answer = angle
        break
    A = turn(A)
print(answer)
''',
        alt=r'''
n = int(input())
A = [list(map(int, input().split())) for _ in range(n)]
B = [list(map(int, input().split())) for _ in range(n)]
def same(f):
    return all(B[i][j] == f(i, j) for i in range(n) for j in range(n))
checks = [(0, lambda i, j: A[i][j]),
          (90, lambda i, j: A[n - 1 - j][i]),
          (180, lambda i, j: A[n - 1 - i][n - 1 - j]),
          (270, lambda i, j: A[j][n - 1 - i])]
print(next((ang for ang, f in checks if same(f)), -1))
''',
        tests=lambda r: [lines(1, 5, 5), lines(1, 5, 6), lines(2, '1 1', '1 1', '1 1', '1 1'), lines(2, '1 2', '3 4', '4 3', '2 1'),
                         lines(2, '1 2', '3 4', '2 4', '1 3'), lines(3, '1 2 1', '2 3 2', '1 2 1', '1 2 1', '2 3 2', '1 2 1'),
                         lines(2, '1 2', '2 1', '2 1', '1 2')] + [
            (lambda n, A, t, bump: lines(n, *rows_of(A), *rows_of(
                (lambda B: [[B[i][j] + (1 if bump and (i, j) == (0, n - 1) else 0) for j in range(n)] for i in range(n)])(
                    __import__('functools').reduce(lambda M, _: rot_cw(M), range(t), A)))))(
                n, grid(r, n, n, 0, r.choice([1, 100])), r.randint(0, 3), r.random() < 0.3) for n in (r.randint(2, 20) for _ in range(5))],
    ),
    Problem(
        slug='queen-moves', title='Where Can the Queen Go?', level=3,
        statement='<p>A chess queen stands on an <code>n × n</code> board. In one move she can slide any number of squares in one of '
                  '8 directions: up, down, left, right or along any of the four diagonals. Some squares hold blocks (<code>#</code>); '
                  'the queen cannot land on a block or jump over it, and she cannot leave the board. How many squares can she reach '
                  'in one move?</p>',
        input='<p>The first line holds <code>n</code>, then the queen\'s row <code>r</code> and column <code>c</code> (counted from 1). '
              'Each of the next <code>n</code> lines holds <code>n</code> characters: <code>.</code> for an empty square or <code>#</code> '
              'for a block. The queen\'s own square is always <code>.</code>.</p>',
        output='<p>One integer: the number of squares the queen can reach.</p>',
        constraints='<p>1 ≤ n ≤ 40; 1 ≤ r, c ≤ n.</p>',
        examples=[('5 3 3\n.....\n.#...\n.....\n...#.\n.....\n', '12\n')],
        hint='<p>For each of the 8 directions <code>(di, dj)</code>, keep stepping from the queen\'s square until you leave the board or '
             'hit a block, counting the squares on the way.</p>',
        solution=r'''
n, r, c = map(int, input().split())
g = [input() for _ in range(n)]
r -= 1
c -= 1
count = 0
for di in (-1, 0, 1):
    for dj in (-1, 0, 1):
        if di == 0 and dj == 0:
            continue
        i, j = r + di, c + dj
        while 0 <= i < n and 0 <= j < n and g[i][j] == '.':
            count += 1
            i += di
            j += dj
print(count)
''',
        alt=r'''
n, r, c = map(int, input().split())
g = [input() for _ in range(n)]
r -= 1
c -= 1
def clear(i, j):
    di = (i > r) - (i < r)
    dj = (j > c) - (j < c)
    x, y = r + di, c + dj
    while (x, y) != (i, j):
        if g[x][y] == '#':
            return False
        x, y = x + di, y + dj
    return g[i][j] == '.'
count = 0
for i in range(n):
    for j in range(n):
        if (i, j) != (r, c) and (i == r or j == c or abs(i - r) == abs(j - c)) and clear(i, j):
            count += 1
print(count)
''',
        tests=lambda r: [lines('1 1 1', '.'), lines('3 2 2', '###', '#.#', '###'), lines('8 1 1', *['........'] * 8),
                         lines('8 4 5', *['........'] * 8), lines('2 1 2', '..', '#.')] + [
            (lambda n: (lambda g, qr, qc: lines(f'{n} {qr + 1} {qc + 1}', *[''.join('.' if (i, j) == (qr, qc) else g[i][j] for j in range(n)) for i in range(n)]))(
                chars(r, n, n, '.#', [r.randint(2, 9), 1]), r.randrange(n), r.randrange(n)))(r.randint(2, 40)) for _ in range(5)],
    ),
    Problem(
        slug='word-search', title='Word Search', level=3,
        statement='<p>In a word-search puzzle a word can be hidden in a straight line in any of 8 directions: left to right, right to left, '
                  'up, down, or along any of the four diagonals. Count how many times the given word appears in the grid. Each '
                  'starting square together with a direction counts as a separate appearance.</p>',
        input='<p>The first line holds <code>n</code> and <code>m</code>. Each of the next <code>n</code> lines holds <code>m</code> capital '
              'letters. The last line holds the word.</p>',
        output='<p>One integer: the number of appearances.</p>',
        constraints='<p>1 ≤ n, m ≤ 30; the word has between 2 and 10 capital letters.</p>',
        examples=[('3 4\nCATS\nAXAX\nTATC\nCAT\n', '2\n'), ('2 2\nAB\nBA\nAB\n', '4\n', 'Across the top row, across the bottom row backwards, '
                                                                                          'down the left column and up the right column.')],
        hint='<p>For every starting square and every one of the 8 directions, step along the word letter by letter, stopping as soon as '
             'you leave the grid or a letter does not match.</p>',
        solution=r'''
n, m = map(int, input().split())
g = [input() for _ in range(n)]
word = input()
L = len(word)
count = 0
for i in range(n):
    for j in range(m):
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                if di == 0 and dj == 0:
                    continue
                k = 0
                while k < L:
                    r, c = i + di * k, j + dj * k
                    if not (0 <= r < n and 0 <= c < m) or g[r][c] != word[k]:
                        break
                    k += 1
                if k == L:
                    count += 1
print(count)
''',
        alt=r'''
n, m = map(int, input().split())
g = [input() for _ in range(n)]
w = input()
lines = []
lines += g
lines += [''.join(g[i][j] for i in range(n)) for j in range(m)]
for d in range(-(n - 1), m):
    lines.append(''.join(g[i][i + d] for i in range(n) if 0 <= i + d < m))
for s in range(n + m - 1):
    lines.append(''.join(g[i][s - i] for i in range(n) if 0 <= s - i < m))
def occ(t, p):
    return sum(1 for k in range(len(t) - len(p) + 1) if t[k:k + len(p)] == p)
print(sum(occ(t, w) + occ(t, w[::-1]) for t in lines))
''',
        explanation='<p>The second solution collects every row, column and diagonal as a string and counts the word in it read both '
                    'ways — the eight directions are four lines, each read forwards and backwards.</p>',
        tests=lambda r: [lines('1 1', 'A', 'AB'), lines('1 3', 'ABA', 'AB'), lines('3 1', 'A', 'B', 'A', 'BA'), lines('3 3', 'AAA', 'AAA', 'AAA', 'AA'),
                         lines('2 5', 'HELLO', 'OLLEH', 'HELLO')] + [
            (lambda n, m: (lambda g: lines(f'{n} {m}', *g, ''.join(r.choices('AB', k=r.randint(2, min(4, max(n, m)) if max(n, m) >= 2 else 2)))))(
                chars(r, n, m, 'AB')))(*dims(r, 1, 30)) for _ in range(3)] + [
            (lambda n, m: lines(f'{n} {m}', *chars(r, n, m, 'CATS'), r.choice(['CAT', 'SAT', 'TACT', 'ACTS'])))(*dims(r, 4, 30)) for _ in range(3)],
    ),
]
