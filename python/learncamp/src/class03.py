"""LearnCamp Class 3 — Strings and ASCII."""
import string
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools'))
from lc import Problem, lines, ints  # noqa: E402

CLASS = dict(
    id=3,
    title='Strings and ASCII',
    blurb='Slice, search, split and rebuild text; turn letters into numbers with ord and chr; count, encode and compare strings.',
    summary='''
<p>Almost every program handles text, and many puzzles are really string puzzles in disguise. This class
teaches you to treat a string as a row of characters you can <strong>index, slice, search and rebuild</strong>,
and to look underneath each character at the <strong>number</strong> the computer stores for it.</p>
<ul>
    <li>Indexing and slicing, <code>len</code>, and why a string can never be changed in place.</li>
    <li>The everyday methods: <code>find</code>, <code>count</code>, <code>replace</code>, <code>upper</code> /
        <code>lower</code> / <code>swapcase</code>, <code>isdigit</code> / <code>isalpha</code>, <code>split</code> /
        <code>join</code> / <code>strip</code>.</li>
    <li>Building new strings in a loop, reversing them and testing for palindromes.</li>
    <li>ASCII codes with <code>ord</code> and <code>chr</code>: letter positions, Caesar shifts and other ciphers.</li>
    <li>Counting letters with a list of 26 or a dictionary, run-length encoding, comparing strings, and
        converting between strings and numbers.</li>
</ul>''',
    tutorial=[
        dict(h='A string is a row of characters', html='''
<p>A string is written between quotes: <code>'cat'</code> or <code>"cat"</code> mean the same thing. Each
character has a position called its <strong>index</strong>, starting at 0. Negative indexes count from the end,
so <code>s[-1]</code> is always the last character. <code>len(s)</code> tells you how many characters there are.</p>
<pre class="try">s = 'python'
print(len(s))        # 6
print(s[0], s[5])    # p n
print(s[-1], s[-2])  # n o</pre>
<p>A <strong>slice</strong> <code>s[a:b]</code> gives the characters from index <code>a</code> up to, but not
including, <code>b</code>. Leave a side out to mean "from the start" or "to the end". A third number is the step.</p>
<pre class="try">s = 'abcdefgh'
print(s[2:5])     # cde      (indexes 2, 3, 4)
print(s[:3])      # abc
print(s[5:])      # fgh
print(s[::2])     # aceg     (every second character)
print(s[::-1])    # hgfedcba (the whole string backwards)</pre>
<div class="lc-key">To take the characters from <code>l</code> to <code>r</code> <em>inclusive</em>, write
<code>s[l:r + 1]</code>. The end of a slice is always left out.</div>
<div class="lc-warn">Strings are <strong>immutable</strong>: <code>s[0] = 'P'</code> is an error. To "change" a
string you build a new one, for example <code>s = 'P' + s[1:]</code>.</div>'''),
        dict(h='Searching and changing case', html='''
<table>
<tr><th>Write</th><th>Gives</th><th>For <code>s = 'banana'</code></th></tr>
<tr><td><code>'nan' in s</code></td><td>is it inside?</td><td><code>True</code></td></tr>
<tr><td><code>s.find('an')</code></td><td>first index, or −1 if missing</td><td><code>1</code></td></tr>
<tr><td><code>s.rfind('an')</code></td><td>last index, or −1</td><td><code>3</code></td></tr>
<tr><td><code>s.index('x')</code></td><td>like <code>find</code>, but an error if missing</td><td>error</td></tr>
<tr><td><code>s.count('a')</code></td><td>how many times (not overlapping)</td><td><code>3</code></td></tr>
<tr><td><code>s.replace('a', 'o')</code></td><td>a new string with every match replaced</td><td><code>'bonono'</code></td></tr>
</table>
<pre class="try">t = 'Hello World'
print(t.upper(), t.lower())
print(t.swapcase())               # hELLO wORLD
print('hELLO wORLD'.capitalize()) # Hello world (only the first letter)
print('hELLO wORLD'.title())      # Hello World (every word)</pre>
<p>Questions about characters return <code>True</code> or <code>False</code>:</p>
<pre class="try">for c in 'aZ7 !':
    print(repr(c), c.isalpha(), c.isdigit(), c.isupper(), c.islower(), c.isspace())</pre>
<div class="lc-tip"><code>s.count('aa')</code> on <code>'aaaa'</code> gives 2, not 3: it never reuses a character
that was already part of a match. If overlapping matches should count, check every starting position yourself.</div>'''),
        dict(h='Words: split, join and strip', html='''
<p><code>s.split()</code> cuts a line into words at any run of spaces and throws the spaces away.
<code>' '.join(words)</code> glues a list of strings back together with a separator between them.
<code>s.strip()</code> removes spaces (and newlines) from both ends.</p>
<pre class="try" data-input="   the   quick brown    fox  ">line = input()
words = line.split()
print(words)
print(len(words), 'words')
print(' '.join(words))          # tidy: single spaces
print('-'.join(reversed(words)))
print('[' + line.strip() + ']')</pre>
<div class="lc-key">When a line may contain spaces, read it <strong>whole</strong> with <code>line = input()</code>.
Only call <code>.split()</code> when you really want the separate words.</div>
<p><code>split</code> can also cut at a chosen separator: <code>'2024-11-23'.split('-')</code> gives
<code>['2024', '11', '23']</code>.</p>'''),
        dict(h='Looping and building strings', html='''
<p>A <code>for</code> loop visits the characters one by one. Use <code>range(len(s))</code> when you also need
the index. To build an answer, start with an empty string and add to it, or collect pieces in a list and
<code>join</code> them at the end (faster for long strings).</p>
<pre class="try" data-input="Hello, World 42">s = input()
out = ''
for c in s:
    if c.isalpha():
        out += c.upper()
    elif c.isdigit():
        out += '#'
print(out)

pieces = []
for i in range(len(s)):
    if i % 2 == 0:
        pieces.append(s[i])
print(''.join(pieces))</pre>
<p><strong>Reversing and palindromes.</strong> A palindrome reads the same both ways. The shortest test is
<code>s == s[::-1]</code>; the two-pointer loop shows what is really happening.</p>
<pre class="try" data-input="racecar">s = input()
print(s == s[::-1])
i, j = 0, len(s) - 1
ok = True
while i &lt; j:
    if s[i] != s[j]:
        ok = False
        break
    i += 1
    j -= 1
print(ok)</pre>'''),
        dict(h='ASCII: every character is a number', html='''
<p>The computer stores each character as a number called its <strong>code</strong>. For ordinary English
characters this is the <strong>ASCII</strong> code. <code>ord(c)</code> gives the code of a character, and
<code>chr(n)</code> gives the character with code <code>n</code>.</p>
<table>
<tr><th>Characters</th><th>Codes</th><th>Remember</th></tr>
<tr><td>space</td><td>32</td><td>the smallest printable character</td></tr>
<tr><td><code>'0'</code> … <code>'9'</code></td><td>48 … 57</td><td><code>ord('0') = 48</code></td></tr>
<tr><td><code>'A'</code> … <code>'Z'</code></td><td>65 … 90</td><td><code>ord('A') = 65</code></td></tr>
<tr><td><code>'a'</code> … <code>'z'</code></td><td>97 … 122</td><td><code>ord('a') = 97</code>, exactly 32 more than the capital</td></tr>
</table>
<p>Because each range is in order, subtracting the first code gives a <strong>position</strong>:
<code>ord(c) - ord('a')</code> is 0 for <code>a</code>, 1 for <code>b</code>, … 25 for <code>z</code>.
And <code>ord(d) - ord('0')</code> turns a digit character into its value.</p>
<pre class="try">print(ord('A'), ord('a'), ord('0'), ord(' '))
print(chr(72) + chr(105))
print(ord('k') - ord('a'))            # k is letter number 10 (counting from 0)
print(chr(ord('a') + 25))             # z
print(ord('7') - ord('0'))            # 7
for code in range(65, 71):
    print(code, chr(code), chr(code + 32))</pre>
<p><strong>Caesar shift.</strong> To move a letter <code>k</code> places forward and wrap from <code>z</code>
back to <code>a</code>: turn it into a position, add, take <code>% 26</code>, and turn it back.</p>
<pre class="try" data-input="3\\nHello, Zoe!">k = int(input())
s = input()
out = ''
for c in s:
    if 'a' &lt;= c &lt;= 'z':
        out += chr((ord(c) - ord('a') + k) % 26 + ord('a'))
    elif 'A' &lt;= c &lt;= 'Z':
        out += chr((ord(c) - ord('A') + k) % 26 + ord('A'))
    else:
        out += c          # spaces and punctuation stay
print(out)</pre>
<div class="lc-tip">Comparisons like <code>'a' &lt;= c &lt;= 'z'</code> work because they compare the codes.
To go back <code>k</code> places, add <code>-k</code>: Python's <code>%</code> always gives an answer from 0 to 25.</div>'''),
        dict(h='Counting letters and run-length encoding', html='''
<p>To count how often each letter appears, keep a <strong>list of 26 counters</strong> and use the letter
position as the index. A <strong>dictionary</strong> works for any characters at all.</p>
<pre class="try" data-input="mississippi">s = input()
cnt = [0] * 26
for c in s:
    cnt[ord(c) - ord('a')] += 1
for i in range(26):
    if cnt[i] &gt; 0:
        print(chr(ord('a') + i), cnt[i])

d = {}
for c in s:
    d[c] = d.get(c, 0) + 1
print(d)</pre>
<p><strong>Run-length encoding</strong> squeezes runs of the same character: <code>aaabcc</code> becomes
<code>a3b1c2</code>. Walk along the string, and each time the character changes, write out the run you just
finished.</p>
<pre class="try" data-input="aaabccdddd">s = input()
out = ''
i = 0
while i &lt; len(s):
    j = i
    while j &lt; len(s) and s[j] == s[i]:
        j += 1                 # j stops at the first different character
    out += s[i] + str(j - i)
    i = j
print(out)</pre>'''),
        dict(h='Comparing strings and converting numbers', html='''
<p>Strings compare in <strong>dictionary order</strong>, character by character using the codes. The first
difference decides; if one string runs out first, the shorter one is smaller. Since every capital letter
has a smaller code than every small letter, <code>'Zebra' &lt; 'apple'</code> is <code>True</code>.</p>
<pre class="try">print('apple' &lt; 'banana', 'app' &lt; 'apple', 'Zebra' &lt; 'apple')
print('Zebra'.lower() &lt; 'apple'.lower())   # compare ignoring case
print(min(['pear', 'fig', 'plum']), sorted('python'))</pre>
<div class="lc-warn">Numbers stored as text compare as text: <code>'10' &lt; '9'</code> is <code>True</code>
because <code>'1'</code> comes before <code>'9'</code>. Convert with <code>int()</code> first if you mean numbers.</div>
<p><code>int(s)</code> and <code>str(n)</code> convert between text and numbers. A number written as a string is
handy for working digit by digit, and you can rebuild a number from its digits yourself, which also works in other
bases:</p>
<pre class="try" data-input="1011">s = input()
print(int(s), int(s, 2), str(255) + '!')
value = 0
for c in s:
    value = value * 2 + (ord(c) - ord('0'))   # read it as binary
print(value)
print(sum(int(c) for c in '2024'))           # digit sum</pre>'''),
    ],
)

LOW = string.ascii_lowercase
UP = string.ascii_uppercase
LET = string.ascii_letters
PUNCT = ',.!?;:-\''


def rs(r, n, alpha=LOW):
    return ''.join(r.choice(alpha) for _ in range(n))


def word(r, lo=1, hi=8, alpha=LOW):
    return rs(r, r.randint(lo, hi), alpha)


def sentence(r, n, alpha=LOW, lo=1, hi=8):
    return ' '.join(word(r, lo, hi, alpha) for _ in range(n))


def messy(r, n):
    """A line of mixed characters with single spaces inside, no space at either end."""
    pool = LET + string.digits + PUNCT
    return ' '.join(rs(r, r.randint(1, 8), pool) for _ in range(n))


def runs(r, alpha, nruns, maxlen):
    return ''.join(r.choice(alpha) * r.randint(1, maxlen) for _ in range(nruns))


# ── Problems ─────────────────────────────────────────────────────────────
PROBLEMS = [
    # ── Level 1 ──────────────────────────────────────────────────────────
    Problem(
        slug='string-length', title='How Long Is It?', level=1,
        statement='<p>Read one line of text and print how many characters it has. Spaces and punctuation count as characters too.</p>',
        input='<p>One line of text. It may contain spaces inside, but it does not start or end with a space.</p>',
        output='<p>One integer: the number of characters on the line.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('hello world\n', '11\n'), ('Hi!\n', '3\n')],
        hint='<p>Read the whole line with <code>input()</code> (do not split it) and use <code>len</code>.</p>',
        solution='print(len(input()))\n',
        tests=lambda r: ['a', 'x' * 200, 'a b', '1 2 3 4 5'] + [messy(r, r.randint(1, 20)) for _ in range(6)],
    ),
    Problem(
        slug='substring', title='Cut Out a Piece', level=1,
        statement='<p>You are given a string of lowercase letters and two positions <code>l</code> and <code>r</code>, counted from 0. Print the part of the string from position <code>l</code> to position <code>r</code>, including both ends.</p>',
        input='<p>Line 1: the string. Line 2: two integers <code>l</code> and <code>r</code> separated by a space.</p>',
        output='<p>The characters at positions <code>l</code>, <code>l+1</code>, …, <code>r</code>, on one line.</p>',
        constraints='<p>1 ≤ length ≤ 100, 0 ≤ l ≤ r &lt; length</p>',
        examples=[('abc\n2 2\n', 'c\n'), ('abcdefg\n1 4\n', 'bcde\n', 'Positions 1, 2, 3, 4 hold b, c, d, e.')],
        hint='<p>A slice <code>s[a:b]</code> stops <em>before</em> index <code>b</code>. Which end do you need to move by one?</p>',
        solution='s = input()\nl, r = map(int, input().split())\nprint(s[l:r + 1])\n',
        alt='s = input()\nl, r = map(int, input().split())\nout = ""\nfor i in range(l, r + 1):\n    out += s[i]\nprint(out)\n',
        tests=lambda r: ['a\n0 0', 'hello\n0 4', 'hello\n4 4', 'hello\n0 0'] + [
            (lambda s, a, b: f'{s}\n{min(a, b)} {max(a, b)}')(s, r.randrange(len(s)), r.randrange(len(s)))
            for s in [rs(r, r.randint(1, 100)) for _ in range(6)]],
    ),
    Problem(
        slug='first-and-last', title='First and Last', level=1,
        statement='<p>Print the first and the last character of a word.</p>',
        input='<p>One word (letters only, no spaces).</p>',
        output='<p>The first character and the last character, separated by one space. A one-letter word has the same first and last character.</p>',
        constraints='<p>1 ≤ length ≤ 100</p>',
        examples=[('python\n', 'p n\n'), ('X\n', 'X X\n')],
        hint='<p><code>s[0]</code> is the first character. Which index always means "the last one", whatever the length?</p>',
        solution='s = input()\nprint(s[0], s[-1])\n',
        alt='s = input()\nprint(s[0] + " " + s[len(s) - 1])\n',
        tests=lambda r: ['a', 'ab', 'Zz', 'abcdefghijklmnopqrstuvwxyz'] + [word(r, 1, 100, LET) for _ in range(6)],
    ),
    Problem(
        slug='digit-sum', title='Digit Sum of a Giant Number', level=1,
        statement='<p>You are given a non-negative integer that can have up to 100 digits. Print the sum of its digits. Treat the number as a string of digit characters and add them up one by one.</p>',
        input='<p>One integer <code>N</code> with no leading zeros (unless it is just <code>0</code>).</p>',
        output='<p>One integer: the sum of the digits of <code>N</code>.</p>',
        constraints='<p><code>N</code> has 1 to 100 digits.</p>',
        examples=[('12345\n', '15\n')],
        hint='<p>Loop over the characters of the line. Each one is a digit character like <code>\'7\'</code>; <code>int(c)</code> turns it into the number 7.</p>',
        solution='s = input().strip()\ntotal = 0\nfor c in s:\n    total += int(c)\nprint(total)\n',
        alt='n = int(input())\nt = 0\nwhile n > 0:\n    t += n % 10\n    n //= 10\nprint(t)\n',
        tests=lambda r: ['0', '9', '10', '9' * 100, '1' + '0' * 99] + [
            str(r.randint(1, 9)) + rs(r, r.randint(0, 99), string.digits) for _ in range(5)],
    ),
    Problem(
        slug='shout', title='Shout It', level=1,
        statement='<p>Print the line in capital letters. Characters that are not letters stay as they are.</p>',
        input='<p>One line of text (letters, digits, spaces and punctuation).</p>',
        output='<p>The same line with every lowercase letter changed to uppercase.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('Hello, world 2!\n', 'HELLO, WORLD 2!\n')],
        hint='<p>Strings have a method that does exactly this.</p>',
        solution='print(input().upper())\n',
        alt='s = input()\nout = ""\nfor c in s:\n    if "a" <= c <= "z":\n        c = chr(ord(c) - 32)\n    out += c\nprint(out)\n',
        tests=lambda r: ['a', 'Z', '123', 'ALREADY LOUD'] + [messy(r, r.randint(1, 20)) for _ in range(6)],
    ),
    Problem(
        slug='swap-case', title='Upside-Down Case', level=1,
        statement='<p>Change every uppercase letter to lowercase and every lowercase letter to uppercase. Everything else stays the same.</p>',
        input='<p>One line of text (letters, digits, spaces and punctuation).</p>',
        output='<p>The line with the case of every letter swapped.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('Hello World 42\n', 'hELLO wORLD 42\n')],
        hint='<p>Either use the built-in string method, or loop over the characters and use <code>isupper()</code> / <code>islower()</code>.</p>',
        solution='print(input().swapcase())\n',
        alt='s = input()\nout = ""\nfor c in s:\n    if "a" <= c <= "z":\n        out += chr(ord(c) - 32)\n    elif "A" <= c <= "Z":\n        out += chr(ord(c) + 32)\n    else:\n        out += c\nprint(out)\n',
        tests=lambda r: ['a', 'Z', '!?', 'aBcDeF'] + [messy(r, r.randint(1, 20)) for _ in range(6)],
    ),
    Problem(
        slug='reverse-string', title='Backwards', level=1,
        statement='<p>Print the line written backwards, last character first.</p>',
        input='<p>One line of text. It may contain spaces inside, but it does not start or end with a space.</p>',
        output='<p>The characters of the line in reverse order.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('stressed\n', 'desserts\n'), ('Hi there!\n', '!ereht iH\n')],
        hint='<p>A slice with a step of <code>-1</code> walks through a string from the end.</p>',
        solution='print(input()[::-1])\n',
        alt='s = input()\nout = ""\nfor c in s:\n    out = c + out\nprint(out)\n',
        tests=lambda r: ['a', 'ab', 'racecar', 'a b c'] + [messy(r, r.randint(1, 20)) for _ in range(6)],
    ),
    Problem(
        slug='ascii-code', title='What Is My Code?', level=1,
        statement='<p>Every character is stored as a number, its ASCII code. Read one character and print its code.</p>',
        input='<p>One line with a single character: a letter, a digit or a punctuation mark (not a space).</p>',
        output='<p>One integer: the ASCII code of that character.</p>',
        constraints='<p>The code is between 33 and 126.</p>',
        examples=[('A\n', '65\n'), ('a\n', '97\n')],
        hint='<p>There is a built-in function that turns a character into its code.</p>',
        solution='c = input()\nprint(ord(c[0]))\n',
        tests=['0', '9', 'Z', 'z', '!', '~', '?', 'M', 'q', '@', '[', '5'],
    ),
    Problem(
        slug='codes-to-word', title='Secret Codes to Text', level=1,
        statement='<p>A message has been written as a list of ASCII codes. Turn every code back into its character and print the message.</p>',
        input='<p>Line 1: an integer <code>n</code>. Line 2: <code>n</code> integers, the codes, separated by spaces.</p>',
        output='<p>The <code>n</code> characters, joined together with nothing between them.</p>',
        constraints='<p>1 ≤ n ≤ 100; every code is between 33 and 126 (so there are no spaces).</p>',
        examples=[('5\n72 101 108 108 111\n', 'Hello\n')],
        hint='<p><code>chr(n)</code> gives the character with code <code>n</code>. Print them all with <code>end=""</code>, or join them into one string.</p>',
        solution='n = int(input())\ncodes = map(int, input().split())\nprint("".join(chr(c) for c in codes))\n',
        tests=lambda r: ['1\n33', '1\n126', '3\n65 66 67', '4\n80 121 116 104'] + [
            (lambda w: f'{len(w)}\n' + ints(ord(c) for c in w))(rs(r, r.randint(1, 100), LET + string.digits + PUNCT)) for _ in range(6)],
    ),
    Problem(
        slug='count-a-letter', title='Count a Letter', level=1,
        statement='<p>How many times does a given letter appear in a line of text? Capital and small letters are different: <code>A</code> and <code>a</code> are not the same letter here.</p>',
        input='<p>Line 1: the text (it may contain spaces). Line 2: a single letter.</p>',
        output='<p>One integer: how many times the letter appears in the text.</p>',
        constraints='<p>1 ≤ text length ≤ 200</p>',
        examples=[('banana bread\na\n', '4\n'), ('Anna and Alan\nA\n', '2\n')],
        hint='<p>Strings have a method that counts how often something appears. Or loop and compare each character.</p>',
        solution='s = input()\nc = input()\nprint(s.count(c))\n',
        alt='s = input()\nc = input()[0]\nk = 0\nfor x in s:\n    if x == c:\n        k += 1\nprint(k)\n',
        tests=lambda r: ['a\na', 'a\nb', 'AAA aaa\na', 'AAA aaa\nA'] + [
            f'{sentence(r, r.randint(1, 20), "abcAB")}\n{r.choice("abcAB")}' for _ in range(6)],
    ),
    Problem(
        slug='count-vowels', title='Vowel Counter', level=1,
        statement='<p>Count the vowels in a line of text. The vowels are <code>a e i o u</code>, in either uppercase or lowercase.</p>',
        input='<p>One line of text (letters, digits, spaces and punctuation).</p>',
        output='<p>One integer: the number of vowels.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('Programming Is Fun\n', '5\n')],
        hint='<p>For each character, check whether it is <code>in</code> the string <code>\'aeiouAEIOU\'</code>.</p>',
        solution='s = input()\nk = 0\nfor c in s:\n    if c in "aeiouAEIOU":\n        k += 1\nprint(k)\n',
        alt='s = input().lower()\nprint(sum(s.count(v) for v in "aeiou"))\n',
        tests=lambda r: ['xyz', 'AEIOU', 'a', 'rhythm and blues'] + [messy(r, r.randint(1, 20)) for _ in range(6)],
    ),
    Problem(
        slug='even-and-odd-positions', title='Even and Odd Positions', level=1,
        statement='<p>Split a word into two parts: the characters at even positions (0, 2, 4, …) and the characters at odd positions (1, 3, 5, …).</p>',
        input='<p>One word (letters only).</p>',
        output='<p>Line 1: the characters at even positions, in order. Line 2: the characters at odd positions, in order (this line is empty if the word has only one letter).</p>',
        constraints='<p>1 ≤ length ≤ 100</p>',
        examples=[('abcdefg\n', 'aceg\nbdf\n')],
        hint='<p>A slice can take a step: <code>s[start::2]</code>.</p>',
        solution='s = input()\nprint(s[::2])\nprint(s[1::2])\n',
        alt='s = input()\na = b = ""\nfor i in range(len(s)):\n    if i % 2 == 0:\n        a += s[i]\n    else:\n        b += s[i]\nprint(a)\nprint(b)\n',
        tests=lambda r: ['a', 'ab', 'abc', 'Hello'] + [word(r, 1, 100, LET) for _ in range(6)],
    ),
    Problem(
        slug='count-words', title='How Many Words?', level=1,
        statement='<p>Count the words in a line. A word is a group of non-space characters. Words can be separated by one or more spaces, and there may be extra spaces at the start or end of the line.</p>',
        input='<p>One line of text containing at least one word.</p>',
        output='<p>One integer: the number of words.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('the  quick brown   fox\n', '4\n')],
        hint='<p><code>split()</code> with no argument treats any run of spaces as one separator.</p>',
        solution='print(len(input().split()))\n',
        alt='s = input()\nk = 0\nprev = " "\nfor c in s:\n    if c != " " and prev == " ":\n        k += 1\n    prev = c\nprint(k)\n',
        tests=lambda r: ['word', '   a', 'a   ', ' x y z ', 'one two'] + [
            ' ' * r.randint(0, 3) + (' ' * r.randint(1, 4)).join(rs(r, r.randint(1, 6), LET + PUNCT) for _ in range(r.randint(1, 15))) + ' ' * r.randint(0, 3)
            for _ in range(6)],
    ),
    Problem(
        slug='initials', title='Initials', level=1,
        statement='<p>Make an abbreviation from a phrase: take the first letter of every word and write it as a capital letter.</p>',
        input='<p>One line: words made of letters, separated by single spaces.</p>',
        output='<p>The first letters of the words, in uppercase, with nothing between them.</p>',
        constraints='<p>1 ≤ number of words ≤ 30</p>',
        examples=[('portable network graphics\n', 'PNG\n'), ('Read The Manual\n', 'RTM\n')],
        hint='<p>Split the line into words. <code>w[0]</code> is the first letter of a word.</p>',
        solution='words = input().split()\nprint("".join(w[0].upper() for w in words))\n',
        alt='s = input()\nout = ""\nfor i in range(len(s)):\n    if s[i] != " " and (i == 0 or s[i - 1] == " "):\n        out += s[i].upper()\nprint(out)\n',
        tests=lambda r: ['a', 'Z', 'hello world', 'as soon as possible'] + [sentence(r, r.randint(1, 30), LET) for _ in range(6)],
    ),
    Problem(
        slug='character-kinds', title='Sort the Characters Into Kinds', level=1,
        statement='<p>Count four kinds of characters on a line: uppercase letters, lowercase letters, digits, and everything else (spaces and punctuation).</p>',
        input='<p>One line of text (letters, digits, spaces and punctuation). It does not start or end with a space.</p>',
        output='<p>Four integers on one line, separated by spaces: the number of uppercase letters, lowercase letters, digits, and other characters.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('Hello, World 2024!\n', '2 8 4 4\n', 'The "other" characters are the comma, two spaces and the !.')],
        hint='<p>Keep four counters. For each character ask <code>isupper()</code>, <code>islower()</code>, <code>isdigit()</code> — or compare with <code>\'A\' &lt;= c &lt;= \'Z\'</code> and friends.</p>',
        solution='s = input()\nup = low = dig = other = 0\nfor c in s:\n    if c.isupper():\n        up += 1\n    elif c.islower():\n        low += 1\n    elif c.isdigit():\n        dig += 1\n    else:\n        other += 1\nprint(up, low, dig, other)\n',
        alt='s = input()\nup = sum(65 <= ord(c) <= 90 for c in s)\nlow = sum(97 <= ord(c) <= 122 for c in s)\ndig = sum(48 <= ord(c) <= 57 for c in s)\nprint(up, low, dig, len(s) - up - low - dig)\n',
        tests=lambda r: ['a', 'A', '7', '!', 'ABC def 123 ?!'] + [messy(r, r.randint(1, 25)) for _ in range(6)],
    ),

    # ── Level 2 ──────────────────────────────────────────────────────────
    Problem(
        slug='is-palindrome', title='Palindrome?', level=2,
        statement='<p>A palindrome reads the same forwards and backwards, like <code>racecar</code> or <code>noon</code>. Decide whether a word is a palindrome.</p>',
        input='<p>One word of lowercase letters.</p>',
        output='<p><code>yes</code> if the word is a palindrome, otherwise <code>no</code>.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('racecar\n', 'yes\n'), ('rocket\n', 'no\n')],
        hint='<p>Compare the word with its reverse — or compare the first and last letters, then move both ends inward.</p>',
        solution='s = input()\nprint("yes" if s == s[::-1] else "no")\n',
        alt='s = input()\nok = all(s[i] == s[len(s) - 1 - i] for i in range(len(s) // 2))\nprint("yes" if ok else "no")\n',
        tests=lambda r: ['a', 'aa', 'ab', 'abba', 'abca', 'abcba'] + [
            (lambda h: h + h[::-1] if r.random() < 0.5 else h + r.choice(LOW) + h[::-1])(rs(r, r.randint(1, 90), 'ab')) for _ in range(4)] + [
            rs(r, r.randint(2, 50), 'ab') for _ in range(3)],
    ),
    Problem(
        slug='reverse-words', title='Words in Reverse Order', level=2,
        statement='<p>Reverse the order of the words in a sentence. The letters inside each word stay as they are.</p>',
        input='<p>One line: words separated by single spaces. A word is any group of non-space characters.</p>',
        output='<p>The same words in the opposite order, separated by single spaces.</p>',
        constraints='<p>1 ≤ number of words ≤ 50</p>',
        examples=[('one two three\n', 'three two one\n'), ('I love Python!\n', 'Python! love I\n')],
        hint='<p>Split into a list of words, reverse the list, and join it back with spaces.</p>',
        solution='words = input().split()\nprint(" ".join(words[::-1]))\n',
        alt='words = input().split()\nout = []\nfor i in range(len(words) - 1, -1, -1):\n    out.append(words[i])\nprint(*out)\n',
        tests=lambda r: ['solo', 'a b', 'x y z'] + [messy(r, r.randint(1, 50)) for _ in range(7)],
    ),
    Problem(
        slug='capitalize-words', title='Tidy Title', level=2,
        statement='<p>Someone typed a title with the caps lock key going on and off. Fix it: every word should start with a capital letter and the rest of the word should be lowercase.</p>',
        input='<p>One line: words made of letters only, separated by single spaces.</p>',
        output='<p>The fixed title, words separated by single spaces.</p>',
        constraints='<p>1 ≤ number of words ≤ 30, each word has 1 to 15 letters</p>',
        examples=[('hELLO wORLD from pYTHON\n', 'Hello World From Python\n')],
        hint='<p>For each word: the first letter in uppercase, plus the rest of the word (a slice) in lowercase.</p>',
        solution='words = input().split()\nprint(" ".join(w[0].upper() + w[1:].lower() for w in words))\n',
        alt='print(input().title())\n',
        tests=lambda r: ['a', 'Z', 'ABC', 'aBC dEF'] + [sentence(r, r.randint(1, 30), LET, 1, 15) for _ in range(6)],
    ),
    Problem(
        slug='squeeze-spaces', title='Squeeze the Spaces', level=2,
        statement='<p>A line was typed with far too many spaces. Remove the spaces at the start of the line, and wherever there are several spaces in a row, keep only one.</p>',
        input='<p>One line containing at least one non-space character. Spaces may appear anywhere, including at the start and at the end.</p>',
        output='<p>The words of the line separated by exactly one space, with no space at the start.</p>',
        constraints='<p>1 ≤ length ≤ 300</p>',
        examples=[('   too    many   spaces  here\n', 'too many spaces here\n')],
        hint='<p>You could build the answer character by character and skip a space when the previous kept character was also a space. Or think about what <code>split()</code> already does for you.</p>',
        solution='print(" ".join(input().split()))\n',
        alt='s = input()\nout = ""\nfor c in s:\n    if c == " " and (out == "" or out[-1] == " "):\n        continue\n    out += c\nprint(out.rstrip())\n',
        tests=lambda r: ['x', '   x', 'a b', 'a     b      c'] + [
            ' ' * r.randint(0, 5) + ''.join(rs(r, r.randint(1, 6), LET + PUNCT) + ' ' * r.randint(1, 6) for _ in range(r.randint(1, 15))).rstrip() + ' ' * r.randint(0, 3)
            for _ in range(6)],
    ),
    Problem(
        slug='remove-duplicates', title='Keep the First One', level=2,
        statement='<p>Remove repeated letters from a word: keep only the <em>first</em> time each letter appears, and drop every later copy. The letters you keep stay in their original order.</p>',
        input='<p>One word of lowercase letters.</p>',
        output='<p>The word with all repeated letters removed.</p>',
        constraints='<p>1 ≤ length ≤ 1000</p>',
        examples=[('bananas\n', 'bans\n'), ('mississippi\n', 'misp\n')],
        hint='<p>Build the answer one letter at a time, and only add a letter if it is not <code>in</code> the answer yet.</p>',
        solution='s = input()\nout = ""\nfor c in s:\n    if c not in out:\n        out += c\nprint(out)\n',
        alt='s = input()\nprint("".join(c for i, c in enumerate(s) if s.find(c) == i))\n',
        tests=lambda r: ['a', 'aaaa', 'abc', 'abcabc', LOW[::-1] * 3] + [rs(r, r.randint(1, 1000), LOW[:r.randint(1, 26)]) for _ in range(5)],
    ),
    Problem(
        slug='anagram-check', title='Anagrams?', level=2,
        statement='<p>Two words are <strong>anagrams</strong> if one can be made by rearranging the letters of the other, using every letter exactly once — like <code>listen</code> and <code>silent</code>. Decide whether two words are anagrams.</p>',
        input='<p>Two lines, each with one word of lowercase letters.</p>',
        output='<p><code>yes</code> if they are anagrams of each other, otherwise <code>no</code>.</p>',
        constraints='<p>1 ≤ length of each word ≤ 1000</p>',
        examples=[('listen\nsilent\n', 'yes\n'), ('hello\nworld\n', 'no\n')],
        hint='<p>Two ideas: sort the letters of each word and compare, or count how many of each letter both words have.</p>',
        solution='a = input()\nb = input()\nprint("yes" if sorted(a) == sorted(b) else "no")\n',
        alt='a = input()\nb = input()\nca = [0] * 26\ncb = [0] * 26\nfor c in a:\n    ca[ord(c) - 97] += 1\nfor c in b:\n    cb[ord(c) - 97] += 1\nprint("yes" if ca == cb else "no")\n',
        tests=lambda r: ['a\na', 'a\nb', 'ab\nba', 'aab\nabb', 'abc\nabcd'] + [
            (lambda w: w + '\n' + ''.join(r.sample(w, len(w))))(rs(r, r.randint(1, 1000), 'abc')) for _ in range(3)] + [
            (lambda w: w + '\n' + ''.join(r.sample(w, len(w)))[:-1] + r.choice('abc'))(rs(r, r.randint(2, 1000), 'abc')) for _ in range(3)],
    ),
    Problem(
        slug='caesar-shift', title='Caesar Cipher', level=2,
        statement='<p>Julius Caesar hid his messages by moving every letter a fixed number of places forward in the alphabet. With a shift of 3, <code>a</code> becomes <code>d</code>, <code>b</code> becomes <code>e</code>, and at the end it wraps around: <code>x</code> becomes <code>a</code>, <code>z</code> becomes <code>c</code>. Capital letters shift the same way and stay capital. Spaces, digits and punctuation are not changed.</p><p>Encrypt a message with shift <code>k</code>.</p>',
        input='<p>Line 1: the shift <code>k</code>. Line 2: the message (it may contain spaces).</p>',
        output='<p>The encrypted message.</p>',
        constraints='<p>0 ≤ k ≤ 1000, 1 ≤ message length ≤ 200</p>',
        examples=[('3\nHello, World!\n', 'Khoor, Zruog!\n'), ('1\nzebra Z\n', 'afcsb A\n')],
        hint='<p>For a lowercase letter: its position is <code>ord(c) - ord(\'a\')</code>. Add <code>k</code>, take <code>% 26</code> so it wraps, and turn the position back into a letter with <code>chr</code>.</p>',
        solution='k = int(input())\ns = input()\nout = ""\nfor c in s:\n    if "a" <= c <= "z":\n        out += chr((ord(c) - 97 + k) % 26 + 97)\n    elif "A" <= c <= "Z":\n        out += chr((ord(c) - 65 + k) % 26 + 65)\n    else:\n        out += c\nprint(out)\n',
        alt='import string\nk = int(input()) % 26\nlo, up = string.ascii_lowercase, string.ascii_uppercase\ntable = str.maketrans(lo + up, lo[k:] + lo[:k] + up[k:] + up[:k])\nprint(input().translate(table))\n',
        explanation='<p>A shift of 26 does nothing, so a shift of 1000 is the same as <code>1000 % 26 = 12</code>. Taking <code>% 26</code> after adding handles both the wrap-around and big shifts.</p>',
        tests=lambda r: ['0\nabc', '26\nabc XYZ', '25\nabc ABC', '1000\nThe Quick Brown Fox!', '13\nuryyb'] + [
            f'{r.randint(0, 1000)}\n{messy(r, r.randint(1, 20))}' for _ in range(5)],
    ),
    Problem(
        slug='atbash-cipher', title='Mirror Alphabet', level=2,
        statement='<p>The Atbash cipher swaps each letter with its "mirror" in the alphabet: <code>a</code>↔<code>z</code>, <code>b</code>↔<code>y</code>, <code>c</code>↔<code>x</code>, and so on. Capital letters work the same way and stay capital. Anything that is not a letter is left alone. Apply the cipher to a line.</p>',
        input='<p>One line of text (it may contain spaces).</p>',
        output='<p>The line with every letter replaced by its mirror letter.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('Hello, World!\n', 'Svool, Dliow!\n')],
        hint='<p>If a letter is at position <code>p</code> (0 for a, 25 for z), its mirror is at position <code>25 - p</code>.</p>',
        solution='s = input()\nout = ""\nfor c in s:\n    if "a" <= c <= "z":\n        out += chr(ord("z") - (ord(c) - ord("a")))\n    elif "A" <= c <= "Z":\n        out += chr(ord("Z") - (ord(c) - ord("A")))\n    else:\n        out += c\nprint(out)\n',
        alt='import string\nlo, up = string.ascii_lowercase, string.ascii_uppercase\nprint(input().translate(str.maketrans(lo + up, lo[::-1] + up[::-1])))\n',
        explanation='<p>Applying Atbash twice gives back the original text.</p>',
        tests=lambda r: ['a', 'z', 'abcxyz', 'ABC xyz 123', LOW + UP] + [messy(r, r.randint(1, 20)) for _ in range(5)],
    ),
    Problem(
        slug='binary-to-decimal', title='Binary to Decimal', level=2,
        statement='<p>A binary number is written with only the digits 0 and 1. Read one and print its value in ordinary decimal. Try to do the conversion yourself, digit by digit, instead of using a ready-made function.</p>',
        input='<p>One line: a string of <code>0</code>s and <code>1</code>s (it may start with zeros).</p>',
        output='<p>The value as a decimal integer.</p>',
        constraints='<p>1 ≤ length ≤ 60</p>',
        examples=[('1011\n', '11\n', '1·8 + 0·4 + 1·2 + 1·1 = 11'), ('0\n', '0\n')],
        hint='<p>Read the digits from left to right. Each new digit doubles everything you had so far, then adds itself: <code>value = value * 2 + digit</code>.</p>',
        solution='s = input().strip()\nvalue = 0\nfor c in s:\n    value = value * 2 + (ord(c) - ord("0"))\nprint(value)\n',
        alt='print(int(input(), 2))\n',
        tests=lambda r: ['1', '10', '0000', '1' * 60, '1' + '0' * 59, '000101'] + [rs(r, r.randint(1, 60), '01') for _ in range(4)],
    ),
    Problem(
        slug='replace-all', title='Find and Replace', level=2,
        statement='<p>Replace every occurrence of one piece of text with another. Scan the text from left to right: when the piece you are looking for starts at the current position, write the replacement and jump past the whole match; otherwise copy one character and move on. (So matches never overlap.)</p>',
        input='<p>Line 1: the text (it may contain spaces). Line 2: the piece to find. Line 3: the replacement. Lines 2 and 3 are not empty and contain no spaces.</p>',
        output='<p>The text after all replacements.</p>',
        constraints='<p>1 ≤ text length ≤ 200; 1 ≤ length of each piece ≤ 10</p>',
        examples=[('the cat sat on the mat\nat\nog\n', 'the cog sog on the mog\n'), ('aaaa\naa\nb\n', 'bb\n')],
        hint='<p>Python has a string method for this, and it follows exactly the left-to-right rule above.</p>',
        solution='s = input()\nold = input()\nnew = input()\nprint(s.replace(old, new))\n',
        alt='s = input()\na = input()\nb = input()\nout = []\ni = 0\nwhile i < len(s):\n    if s[i:i + len(a)] == a:\n        out.append(b)\n        i += len(a)\n    else:\n        out.append(s[i])\n        i += 1\nprint("".join(out))\n',
        tests=lambda r: ['abc\nx\ny', 'aaa\naa\nb', 'abc\nabc\nxyz', 'ab ab ab\nab\nabab'] + [
            f'{sentence(r, r.randint(1, 20), "abc", 1, 6)}\n{rs(r, r.randint(1, 3), "abc")}\n{rs(r, r.randint(1, 4), "xyz")}' for _ in range(6)],
    ),
    Problem(
        slug='count-and-say-encoding', title='Count and Say', level=2,
        statement='<p>Compress a string of digits: replace every block of equal digits that are next to each other (as long as possible) by <em>how many digits are in the block</em>, followed by <em>the digit itself</em>. For example <code>444</code> becomes <code>34</code> ("three 4s") and a lone <code>7</code> becomes <code>17</code>.</p>',
        input='<p>One line: a string of digits.</p>',
        output='<p>The encoded string.</p>',
        constraints='<p>1 ≤ length ≤ 1000</p>',
        examples=[
            ('122344111\n', '1122132431\n', 'one 1, two 2s, one 3, two 4s, three 1s'),
            ('1111111111\n', '101\n', 'ten 1s'),
            ('00000000000\n', '110\n'),
            ('100200300\n', '112012201320\n'),
        ],
        hint='<p>Walk along the string with an index. From each position, move a second index forward while the digit stays the same; the distance between them is the length of the block.</p>',
        solution='s = input().strip()\nout = ""\ni = 0\nwhile i < len(s):\n    j = i\n    while j < len(s) and s[j] == s[i]:\n        j += 1\n    out += str(j - i) + s[i]\n    i = j\nprint(out)\n',
        alt='s = input().strip()\nparts = []\ncount = 1\nfor k in range(1, len(s) + 1):\n    if k < len(s) and s[k] == s[k - 1]:\n        count += 1\n    else:\n        parts.append(f"{count}{s[k - 1]}")\n        count = 1\nprint("".join(parts))\n',
        explanation='<p>A block can be 10 or more digits long, so its count can have more than one digit — that is why <code>1111111111</code> gives <code>101</code>.</p>',
        tests=lambda r: ['5', '12', '0' * 1000, '9' * 12] + [runs(r, string.digits, r.randint(1, 100), 12)[:1000] for _ in range(4)] + [
            rs(r, r.randint(1, 1000), string.digits) for _ in range(2)],
    ),
    Problem(
        slug='run-length-decode', title='Unpack the Runs', level=2,
        statement='<p>A string was packed by writing each run of the same letter as the letter followed by how many times it repeats. Unpack it. For example <code>a3b2c1</code> means <code>aaa</code> + <code>bb</code> + <code>c</code>.</p>',
        input='<p>One line: a letter, then a positive count, then a letter, then a count, and so on. Letters are lowercase; a count may have more than one digit.</p>',
        output='<p>The unpacked string.</p>',
        constraints='<p>Each count is from 1 to 99; the unpacked string has at most 3000 characters.</p>',
        examples=[('a3b2c1\n', 'aaabbc\n'), ('x12y1\n', 'xxxxxxxxxxxxy\n')],
        hint='<p>Read one letter, then keep reading characters while they are digits to collect the whole count. <code>letter * count</code> repeats the letter.</p>',
        solution='s = input().strip()\nout = ""\ni = 0\nwhile i < len(s):\n    letter = s[i]\n    i += 1\n    j = i\n    while j < len(s) and s[j].isdigit():\n        j += 1\n    out += letter * int(s[i:j])\n    i = j\nprint(out)\n',
        alt='import re\ns = input()\nprint("".join(c * int(n) for c, n in re.findall(r"([a-z])([0-9]+)", s)))\n',
        tests=lambda r: ['a1', 'z99', 'a1b1c1', 'a10a10', 'q9w10e11'] + [
            ''.join(r.choice(LOW) + str(r.randint(1, 99)) for _ in range(r.randint(1, 50))) for _ in range(5)],
    ),
    Problem(
        slug='decrypt-the-records', title='Decrypt the Records', level=2,
        statement='<p>Some old records were hidden with a three-step code, applied in this order:</p><ol><li>Every letter was moved <strong>3 places back</strong> in the alphabet, wrapping around at the start: <code>d</code>→<code>a</code>, <code>e</code>→<code>b</code>, <code>c</code>→<code>z</code>, <code>a</code>→<code>x</code>. Capital letters are moved the same way.</li><li>The whole string was <strong>reversed</strong>.</li><li>The <strong>case</strong> of every letter was swapped (capital ↔ small).</li></ol><p>Given a hidden record, recover the original.</p>',
        input='<p>One line: the hidden record, made of letters only.</p>',
        output='<p>The original record.</p>',
        constraints='<p>1 ≤ length &lt; 50</p>',
        examples=[('GSOOWFASOq\n', 'Trvdizrrvj\n')],
        hint='<p>To undo the steps you must undo them in the <em>opposite</em> order: undo step 3 first, then step 2, then step 1. What is the opposite of moving 3 places back?</p>',
        solution='s = input().strip()\nt = s.swapcase()[::-1]\nout = ""\nfor c in t:\n    base = ord("A") if c.isupper() else ord("a")\n    out += chr((ord(c) - base + 3) % 26 + base)\nprint(out)\n',
        alt='import string\nletters = string.ascii_letters\n\ndef enc(c):\n    if c.islower():\n        c = chr((ord(c) - 97 - 3) % 26 + 97)\n    else:\n        c = chr((ord(c) - 65 - 3) % 26 + 65)\n    return c.swapcase()\n\nback = {enc(x): x for x in letters}\ns = input().strip()\nn = len(s)\norig = [""] * n\nfor i in range(n):\n    orig[n - 1 - i] = back[s[i]]\nprint("".join(orig))\n',
        explanation='<p>Check with the example: swapping the case of <code>GSOOWFASOq</code> gives <code>gsoowfasoQ</code>; reversing gives <code>Qosafwoosg</code>; moving every letter 3 forward gives <code>Trvdizrrvj</code>.</p>',
        tests=lambda r: ['a', 'Z', 'abc', 'XYZ', 'AaZz'] + [rs(r, r.randint(1, 49), LET) for _ in range(6)],
    ),
    Problem(
        slug='letter-frequency', title='Letter Frequencies', level=2,
        statement='<p>Count how many times each letter of the alphabet appears in a line of text, treating capital and small letters as the same letter. Ignore everything that is not a letter.</p>',
        input='<p>One line of text containing at least one letter.</p>',
        output='<p>For every letter that appears, in alphabetical order, one line with the lowercase letter, a space, and its count. Letters that do not appear are not printed.</p>',
        constraints='<p>1 ≤ length ≤ 300</p>',
        examples=[('Hello World\n', 'd 1\ne 1\nh 1\nl 3\no 2\nr 1\nw 1\n')],
        hint='<p>Make a list of 26 zeros. For every letter, add 1 at index <code>ord(c.lower()) - ord(\'a\')</code>. Then go through the list in order.</p>',
        solution='s = input()\ncnt = [0] * 26\nfor c in s.lower():\n    if "a" <= c <= "z":\n        cnt[ord(c) - ord("a")] += 1\nfor i in range(26):\n    if cnt[i] > 0:\n        print(chr(ord("a") + i), cnt[i])\n',
        alt='from collections import Counter\nc = Counter(x for x in input().lower() if x.isalpha())\nfor k in sorted(c):\n    print(k, c[k])\n',
        tests=lambda r: ['a', 'ZzZ', 'A1b2C3!', 'The quick brown fox jumps over the lazy dog'] + [messy(r, r.randint(1, 30)) for _ in range(6)],
    ),
    Problem(
        slug='most-common-letter', title='The Most Common Letter', level=2,
        statement='<p>Find the letter that appears most often in a line. If several letters are tied for the most, choose the one that comes first in the alphabet.</p>',
        input='<p>One line of lowercase letters and spaces, with at least one letter.</p>',
        output='<p>The letter and how many times it appears, separated by a space.</p>',
        constraints='<p>1 ≤ length ≤ 1000</p>',
        examples=[('banana bread\n', 'a 4\n'), ('abc cba\n', 'a 2\n', 'a, b and c all appear twice; a comes first.')],
        hint='<p>Count with a list of 26. Then scan the list from <code>a</code> to <code>z</code> and only replace your best letter when you find a <em>strictly</em> bigger count.</p>',
        solution='s = input()\ncnt = [0] * 26\nfor c in s:\n    if c != " ":\n        cnt[ord(c) - 97] += 1\nbest = 0\nfor i in range(26):\n    if cnt[i] > cnt[best]:\n        best = i\nprint(chr(97 + best), cnt[best])\n',
        alt='s = input().replace(" ", "")\nbest = max(sorted(set(s)), key=s.count)\nprint(best, s.count(best))\n',
        tests=lambda r: ['z', 'zy', 'zzy', 'y zz y', 'a b c d'] + [sentence(r, r.randint(1, 100), LOW[:r.randint(2, 26)], 1, 9) for _ in range(5)],
    ),
    Problem(
        slug='pangram', title='Every Letter?', level=2,
        statement='<p>A <strong>pangram</strong> is a sentence that uses every letter of the alphabet at least once (capital or small does not matter). Check a sentence. If it is a pangram, say so; if not, list the letters it is missing.</p>',
        input='<p>One line of text.</p>',
        output='<p><code>pangram</code> if every letter appears; otherwise the missing letters, in lowercase and in alphabetical order, with nothing between them.</p>',
        constraints='<p>1 ≤ length ≤ 300</p>',
        examples=[('The quick brown fox jumps over the lazy dog\n', 'pangram\n'), ('Hello World\n', 'abcfgijkmnpqstuvxyz\n')],
        hint='<p>Lowercase the whole line first. Then for each letter from <code>a</code> to <code>z</code>, check whether it is <code>in</code> the line.</p>',
        solution='s = input().lower()\nmissing = ""\nfor i in range(26):\n    c = chr(ord("a") + i)\n    if c not in s:\n        missing += c\nprint(missing if missing else "pangram")\n',
        alt='import string\nseen = set(input().lower())\nm = [c for c in string.ascii_lowercase if c not in seen]\nprint("".join(m) or "pangram")\n',
        tests=lambda r: ['123 !!!', 'a', 'abcdefghijklmnopqrstuvwxy', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'Pack my box with five dozen liquor jugs.'] + [messy(r, r.randint(5, 30)) for _ in range(5)],
    ),
    Problem(
        slug='first-unique-character', title='First One of a Kind', level=2,
        statement='<p>Find the first character in a string that appears <strong>exactly once</strong> in the whole string.</p>',
        input='<p>One line: a string of lowercase letters.</p>',
        output='<p>The first character that appears exactly once, or <code>no</code> if every character appears more than once.</p>',
        constraints='<p>1 ≤ length &lt; 100 000</p>',
        examples=[('abcabd\n', 'c\n', 'a and b appear twice; c is the first that appears only once.'), ('aabb\n', 'no\n')],
        hint='<p>Two passes: first count every letter (a list of 26 is enough). Then walk through the string again and stop at the first letter whose count is 1. Calling <code>s.count</code> inside the loop would be far too slow for a long string.</p>',
        solution='s = input().strip()\ncnt = [0] * 26\nfor c in s:\n    cnt[ord(c) - 97] += 1\nfor c in s:\n    if cnt[ord(c) - 97] == 1:\n        print(c)\n        break\nelse:\n    print("no")\n',
        alt='s = input().strip()\nbest = None\nfor c in "abcdefghijklmnopqrstuvwxyz":\n    i = s.find(c)\n    if i != -1 and s.rfind(c) == i and (best is None or i < best):\n        best = i\nprint(s[best] if best is not None else "no")\n',
        explanation='<p>The <code>for … else</code> runs the <code>else</code> part only when the loop finished without a <code>break</code> — exactly the "nothing found" case.</p>',
        tests=lambda r: ['a', 'aa', 'ab', 'aab', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy'] + [
            (lambda t: ''.join(r.sample(t, len(t))))(rs(r, 2900) * 2), rs(r, 5000), rs(r, 5000, 'abc') + 'z',
            (lambda t: ''.join(r.sample(t, len(t))))(rs(r, 2000) * 2) + 'q' + rs(r, 900), rs(r, 100)],
    ),
    Problem(
        slug='count-overlapping', title='Count the Matches (Overlaps Too)', level=2,
        statement='<p>Count how many times a pattern appears in a text, <strong>including overlapping</strong> appearances. In <code>aaaa</code> the pattern <code>aa</code> starts at positions 0, 1 and 2, so the answer is 3.</p>',
        input='<p>Line 1: the text. Line 2: the pattern. Both are lowercase letters, no spaces.</p>',
        output='<p>One integer: the number of positions where the pattern starts.</p>',
        constraints='<p>1 ≤ pattern length ≤ text length ≤ 2000</p>',
        examples=[('aaaa\naa\n', '3\n'), ('abababa\naba\n', '3\n')],
        hint='<p><code>text.count(pattern)</code> does <em>not</em> count overlaps. Instead try every starting position <code>i</code> and compare the slice <code>text[i:i + m]</code> with the pattern.</p>',
        solution='t = input()\np = input()\nm = len(p)\nk = 0\nfor i in range(len(t) - m + 1):\n    if t[i:i + m] == p:\n        k += 1\nprint(k)\n',
        alt='t = input()\np = input()\nk = 0\ni = t.find(p)\nwhile i != -1:\n    k += 1\n    i = t.find(p, i + 1)\nprint(k)\n',
        tests=lambda r: ['a\na', 'ab\nb', 'abc\nabc', 'abc\nd', 'a' * 2000 + '\n' + 'a' * 5, 'ab' * 1000 + '\nbab'] + [
            f'{rs(r, r.randint(50, 2000), "ab")}\n{rs(r, r.randint(1, 4), "ab")}' for _ in range(4)],
    ),
    Problem(
        slug='sum-of-numbers-in-text', title='Numbers Hiding in Text', level=2,
        statement='<p>A line of text has numbers mixed in with letters and other characters. A number is a group of digits next to each other that is as long as possible, so <code>ab12cd</code> contains the number 12 (not 1 and 2). Add up all the numbers in the line. A number may start with zeros: <code>007</code> is just 7.</p>',
        input='<p>One line of letters, digits, spaces and punctuation.</p>',
        output='<p>One integer: the sum of all numbers in the line (0 if there are none).</p>',
        constraints='<p>1 ≤ length ≤ 300; each number has at most 9 digits</p>',
        examples=[('ab12cd3 4x\n', '19\n', '12 + 3 + 4'), ('no digits here\n', '0\n')],
        hint='<p>Keep a "current number" while you walk. A digit extends it (<code>cur = cur * 10 + digit</code>); any other character finishes it, so add it to the total and start again. Do not forget the number that may be running when the line ends.</p>',
        solution='s = input()\ntotal = 0\ncur = 0\nfor c in s:\n    if c.isdigit():\n        cur = cur * 10 + int(c)\n    else:\n        total += cur\n        cur = 0\ntotal += cur\nprint(total)\n',
        alt='import re\nprint(sum(int(x) for x in re.findall(r"[0-9]+", input())))\n',
        tests=lambda r: ['5', 'abc', '007', 'x1y2z3', '999999999 999999999'] + [
            ''.join(r.choice([rs(r, r.randint(1, 9), string.digits), rs(r, r.randint(1, 4), LET + ' ' + PUNCT)]) for _ in range(r.randint(1, 30)))
            for _ in range(5)],
    ),
    Problem(
        slug='sentence-palindrome', title='Palindrome Sentences', level=2,
        statement='<p>Some whole sentences are palindromes if you ignore spaces, punctuation and capital letters — like <em>A man, a plan, a canal: Panama!</em> Decide whether a sentence is a palindrome when only its letters and digits are kept and capitals are treated as small letters.</p>',
        input='<p>One line of text containing at least one letter or digit.</p>',
        output='<p><code>yes</code> or <code>no</code>.</p>',
        constraints='<p>1 ≤ length ≤ 300</p>',
        examples=[('A man, a plan, a canal: Panama!\n', 'yes\n'), ('Hello, olleh?!\n', 'yes\n'), ('Race a car\n', 'no\n')],
        hint='<p>First build a cleaned-up string: keep only characters that are letters or digits, in lowercase. Then check the cleaned string.</p>',
        solution='s = input()\nclean = ""\nfor c in s:\n    if c.isalnum():\n        clean += c.lower()\nprint("yes" if clean == clean[::-1] else "no")\n',
        alt='s = input()\ni, j = 0, len(s) - 1\nok = True\nwhile i < j:\n    if not s[i].isalnum():\n        i += 1\n    elif not s[j].isalnum():\n        j -= 1\n    else:\n        if s[i].lower() != s[j].lower():\n            ok = False\n            break\n        i += 1\n        j -= 1\nprint("yes" if ok else "no")\n',
        tests=lambda r: ['a', '!a!', 'ab', 'No lemon, no melon', 'Was it a car or a cat I saw?', '12 21', '1a2'] + [
            (lambda h: ''.join(c + (r.choice(' ,.!') if r.random() < 0.3 else '') for c in (h + h[::-1]).swapcase()))(rs(r, r.randint(1, 60), 'abAB12')) for _ in range(2)] + [
            ''.join(r.choice('abAB, ') for _ in range(r.randint(3, 30))) + 'a'],
    ),
    Problem(
        slug='camel-to-snake', title='camelCase to snake_case', level=2,
        statement='<p>Programmers name things in different styles. In <em>camelCase</em> the words are joined and each new word starts with a capital: <code>helloWorldFoo</code>. In <em>snake_case</em> the words are lowercase and joined with underscores: <code>hello_world_foo</code>.</p><p>Convert a camelCase name to snake_case: every capital letter becomes an underscore followed by the same letter in lowercase.</p>',
        input='<p>One word of letters that starts with a lowercase letter.</p>',
        output='<p>The name in snake_case.</p>',
        constraints='<p>1 ≤ length ≤ 100</p>',
        examples=[('helloWorldFoo\n', 'hello_world_foo\n'), ('myHTMLPage\n', 'my_h_t_m_l_page\n', 'Every capital letter gets its own underscore.')],
        hint='<p>Build the answer character by character. When <code>c.isupper()</code>, add <code>\'_\'</code> and <code>c.lower()</code> instead of <code>c</code>.</p>',
        solution='s = input()\nout = ""\nfor c in s:\n    if c.isupper():\n        out += "_" + c.lower()\n    else:\n        out += c\nprint(out)\n',
        alt='import re\nprint(re.sub(r"([A-Z])", lambda m: "_" + m.group(1).lower(), input()))\n',
        tests=lambda r: ['x', 'aB', 'abc', 'aBCD', 'getHTTPResponseCode'] + [r.choice(LOW) + rs(r, r.randint(0, 99), LET) for _ in range(5)],
    ),
    Problem(
        slug='password-check', title='Password Checker', level=2,
        statement='<p>A website accepts a password only if it passes all five rules:</p><ol><li><code>length</code> — it has at least 8 characters;</li><li><code>upper</code> — it has an uppercase letter;</li><li><code>lower</code> — it has a lowercase letter;</li><li><code>digit</code> — it has a digit;</li><li><code>symbol</code> — it has a character that is not a letter or a digit.</li></ol><p>Check a password.</p>',
        input='<p>One line: the password (printable characters, no spaces).</p>',
        output='<p><code>OK</code> if it passes every rule. Otherwise, the names of the rules it fails, one per line, in the order listed above.</p>',
        constraints='<p>1 ≤ length ≤ 50</p>',
        examples=[('Passw0rd!\n', 'OK\n'), ('hello\n', 'length\nupper\ndigit\nsymbol\n')],
        hint='<p>Use one True/False variable per rule, set by looping over the characters (or with <code>any(...)</code>). Then print the names of the rules that are False, in order.</p>',
        solution='p = input()\nrules = [\n    ("length", len(p) >= 8),\n    ("upper", any(c.isupper() for c in p)),\n    ("lower", any(c.islower() for c in p)),\n    ("digit", any(c.isdigit() for c in p)),\n    ("symbol", any(not c.isalnum() for c in p)),\n]\nfailed = [name for name, ok in rules if not ok]\nif failed:\n    print("\\n".join(failed))\nelse:\n    print("OK")\n',
        alt='p = input()\nup = low = dig = sym = False\nfor c in p:\n    o = ord(c)\n    if 65 <= o <= 90:\n        up = True\n    elif 97 <= o <= 122:\n        low = True\n    elif 48 <= o <= 57:\n        dig = True\n    else:\n        sym = True\nbad = False\nfor name, ok in (("length", len(p) >= 8), ("upper", up), ("lower", low), ("digit", dig), ("symbol", sym)):\n    if not ok:\n        print(name)\n        bad = True\nif not bad:\n    print("OK")\n',
        tests=lambda r: ['a', 'A', '1', '!', 'abcdefgh', 'ABCDEFGH1', 'Ab1!', 'Ab1!Ab1!', '!!!!!!!!!!'] + [
            rs(r, r.randint(1, 20), r.choice([LET, LET + string.digits, LOW + '!#', LET + string.digits + '!@#$%'])) for _ in range(5)],
    ),
    Problem(
        slug='longest-common-prefix', title='Common Beginning', level=2,
        statement='<p>Find the longest piece of text that <em>every</em> word in a list starts with.</p>',
        input='<p>Line 1: an integer <code>n</code>. The next <code>n</code> lines: one word of lowercase letters each.</p>',
        output='<p>The longest common prefix of all the words, or <code>none</code> if they do not share even the first letter.</p>',
        constraints='<p>1 ≤ n ≤ 100, 1 ≤ word length ≤ 50</p>',
        examples=[('3\nflower\nflow\nflight\n', 'fl\n'), ('2\ndog\ncat\n', 'none\n')],
        hint='<p>Start with the first word as your answer. For each other word, shorten the answer until the word <code>startswith</code> it.</p>',
        solution='n = int(input())\nwords = [input() for _ in range(n)]\nprefix = words[0]\nfor w in words[1:]:\n    while not w.startswith(prefix):\n        prefix = prefix[:-1]\nprint(prefix if prefix else "none")\n',
        alt='n = int(input())\nws = [input() for _ in range(n)]\na, b = min(ws), max(ws)\ni = 0\nwhile i < len(a) and a[i] == b[i]:\n    i += 1\nprint(a[:i] or "none")\n',
        explanation='<p>The alternative trick: after sorting, the words that differ most are the first and the last, so the common prefix of those two is the common prefix of all.</p>',
        tests=lambda r: ['1\nabc', '2\nabc\nabc', '2\nab\nabc', '3\na\nb\nc', '3\nprefix\npre\npresent'] + [
            (lambda base: lines(n := r.randint(2, 100), *[base[:r.randint(len(base) // 2, len(base))] + rs(r, r.randint(0, 5), 'ab') for _ in range(n)]))(rs(r, r.randint(1, 40), 'ab'))
            for _ in range(5)],
    ),

    # ── Level 3 ──────────────────────────────────────────────────────────
    Problem(
        slug='look-and-say', title='Look and Say, Again and Again', level=3,
        statement='<p>One "look and say" step reads a string of digits aloud, block by block, and writes down what it hears: <code>1211</code> is "one 1, one 2, two 1s", so it becomes <code>111221</code>. (Each block of equal neighbouring digits is replaced by its length and then the digit.)</p><p>Start from a given string and apply the step <code>n</code> times.</p>',
        input='<p>Line 1: a string of digits. Line 2: an integer <code>n</code>.</p>',
        output='<p>The string after <code>n</code> steps (the starting string itself if <code>n = 0</code>).</p>',
        constraints='<p>1 ≤ starting length ≤ 10, 0 ≤ n ≤ 20</p>',
        examples=[('1\n5\n', '312211\n', '1 → 11 → 21 → 1211 → 111221 → 312211'), ('333\n2\n', '23\n', '333 → 33 → 23')],
        hint='<p>Write the single step as a function that takes a string and returns the next one. Then call it <code>n</code> times in a loop.</p>',
        solution='def step(s):\n    out = []\n    i = 0\n    while i < len(s):\n        j = i\n        while j < len(s) and s[j] == s[i]:\n            j += 1\n        out.append(str(j - i) + s[i])\n        i = j\n    return "".join(out)\n\ns = input().strip()\nn = int(input())\nfor _ in range(n):\n    s = step(s)\nprint(s)\n',
        alt='from itertools import groupby\ns = input().strip()\nfor _ in range(int(input())):\n    s = "".join(str(len(list(g))) + d for d, g in groupby(s))\nprint(s)\n',
        tests=['1\n0', '1\n1', '1\n20', '22\n20', '3\n15', '1111111111\n20', '1234567890\n12', '0\n10', '9999999999\n7', '312211\n18'],
    ),
    Problem(
        slug='anagram-difference', title='Delete to Make Anagrams', level=3,
        statement='<p>You may delete letters from either of two words. What is the smallest total number of letters you must delete so that the two words that are left are anagrams of each other (they use exactly the same letters the same number of times)? Deleting everything is allowed: two empty words count as anagrams.</p>',
        input='<p>Two lines, each with one word of lowercase letters.</p>',
        output='<p>One integer: the smallest number of deletions.</p>',
        constraints='<p>1 ≤ length of each word ≤ 2000</p>',
        examples=[('abc\ncd\n', '3\n', 'Delete a and b from the first word and d from the second; c is left in both.'), ('hello\nbillion\n', '6\n')],
        hint='<p>Think about each letter of the alphabet separately. If one word has 5 <code>e</code>s and the other has 2, how many <code>e</code>s must go?</p>',
        solution='a = input()\nb = input()\nca = [0] * 26\ncb = [0] * 26\nfor c in a:\n    ca[ord(c) - 97] += 1\nfor c in b:\n    cb[ord(c) - 97] += 1\nprint(sum(abs(ca[i] - cb[i]) for i in range(26)))\n',
        alt='from collections import Counter\na = Counter(input())\nb = Counter(input())\nprint(sum(((a - b) + (b - a)).values()))\n',
        tests=lambda r: ['a\na', 'a\nb', 'abc\ncba', 'aaaa\na', 'xyz\nabc'] + [
            f'{rs(r, r.randint(1, 2000), LOW[:k])}\n{rs(r, r.randint(1, 2000), LOW[:k])}' for k in (1, 3, 10, 26, 26)],
    ),
    Problem(
        slug='roman-to-integer', title='Reading Roman Numerals', level=3,
        statement='<p>Roman numerals use the letters <code>I</code>=1, <code>V</code>=5, <code>X</code>=10, <code>L</code>=50, <code>C</code>=100, <code>D</code>=500, <code>M</code>=1000. Normally the values are added from left to right, largest first: <code>MMXXIV</code> = 2024. But when a smaller letter stands just before a larger one, it is <em>subtracted</em>: <code>IV</code> = 4, <code>IX</code> = 9, <code>XL</code> = 40, <code>XC</code> = 90, <code>CD</code> = 400, <code>CM</code> = 900.</p><p>Convert a Roman numeral to an ordinary number.</p>',
        input='<p>One line: a correctly written Roman numeral.</p>',
        output='<p>Its value.</p>',
        constraints='<p>The value is between 1 and 3999.</p>',
        examples=[('XIV\n', '14\n'), ('MCMXCIV\n', '1994\n', 'M + CM + XC + IV = 1000 + 900 + 90 + 4')],
        hint='<p>Look at each letter together with the letter after it. If the next letter is worth more, this letter counts as negative; otherwise it counts as positive.</p>',
        solution='val = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}\ns = input().strip()\ntotal = 0\nfor i in range(len(s)):\n    if i + 1 < len(s) and val[s[i]] < val[s[i + 1]]:\n        total -= val[s[i]]\n    else:\n        total += val[s[i]]\nprint(total)\n',
        alt='def roman(n):\n    th = ["", "M", "MM", "MMM"]\n    hu = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"]\n    te = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"]\n    on = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]\n    return th[n // 1000] + hu[n // 100 % 10] + te[n // 10 % 10] + on[n % 10]\n\ntable = {roman(n): n for n in range(1, 4000)}\nprint(table[input().strip()])\n',
        tests=['I\n', 'IV\n', 'IX\n', 'XL\n', 'XC\n', 'CD\n', 'CM\n', 'MMMCMXCIX\n', 'MMXXIV\n', 'LXXXVIII\n', 'CDXLIV\n', 'DCCCXC\n', 'MMMDCCCLXXXVIII\n'],
    ),
    Problem(
        slug='vigenere-decrypt', title='The Keyword Cipher', level=3,
        statement='<p>The Vigenère cipher is a Caesar cipher whose shift keeps changing. A keyword of lowercase letters gives the shifts: <code>a</code> means shift 0, <code>b</code> shift 1, …, <code>z</code> shift 25. The first letter of the message is shifted forward by the first letter of the key, the second letter by the second letter of the key, and so on; when the key runs out, it starts again from its beginning. Only letters use up a key letter — spaces and punctuation are copied unchanged and do not move the key along. Capital letters stay capital.</p><p>For example, with the key <code>lemon</code>, <code>Attack at dawn!</code> becomes <code>Lxfopv ef rnhr!</code>.</p><p>You are given the key and an encrypted message. Decrypt it.</p>',
        input='<p>Line 1: the key (lowercase letters). Line 2: the encrypted message (letters, spaces and punctuation).</p>',
        output='<p>The original message.</p>',
        constraints='<p>1 ≤ key length ≤ 20, 1 ≤ message length ≤ 300</p>',
        examples=[('lemon\nLxfopv ef rnhr!\n', 'Attack at dawn!\n')],
        hint='<p>Keep a separate counter <code>j</code> for "which key letter is next", and only increase it when you decrypt a letter. To undo a forward shift of <code>k</code>, shift back by <code>k</code> and wrap with <code>% 26</code>.</p>',
        solution='key = input().strip()\ns = input()\nout = ""\nj = 0\nfor c in s:\n    if "a" <= c <= "z" or "A" <= c <= "Z":\n        base = ord("a") if c.islower() else ord("A")\n        k = ord(key[j % len(key)]) - ord("a")\n        out += chr((ord(c) - base - k) % 26 + base)\n        j += 1\n    else:\n        out += c\nprint(out)\n',
        alt='import string\nlo, up = string.ascii_lowercase, string.ascii_uppercase\nkey = input().strip()\nshifts = [lo.index(c) for c in key]\nres = []\npos = 0\nfor c in input():\n    if c in lo:\n        res.append(lo[(lo.index(c) - shifts[pos]) % 26])\n        pos = (pos + 1) % len(shifts)\n    elif c in up:\n        res.append(up[(up.index(c) - shifts[pos]) % 26])\n        pos = (pos + 1) % len(shifts)\n    else:\n        res.append(c)\nprint("".join(res))\n',
        tests=lambda r: ['a\nHello, World!', 'b\nb', 'z\nAa Zz', 'abc\n!!! ... ???', 'key\nThe Key Is Long'] + [
            f'{word(r, 1, 20)}\n{messy(r, r.randint(1, 40))}' for _ in range(5)],
    ),
    Problem(
        slug='crack-the-caesar', title='Crack the Caesar Cipher', level=3,
        statement='<p>A message of lowercase words was encrypted with a Caesar cipher: every letter was moved <code>k</code> places forward in the alphabet (wrapping from <code>z</code> to <code>a</code>), for some secret <code>k</code> from 0 to 25. Spaces were not changed. You do not know <code>k</code>, but you know one word that appears in the original message.</p><p>Find the <strong>smallest</strong> <code>k</code> such that, after shifting every letter back by <code>k</code>, the known word is one of the words of the message (a whole word, not just part of one). Print that <code>k</code> and the decrypted message.</p>',
        input='<p>Line 1: the known word. Line 2: the encrypted message: lowercase words separated by single spaces.</p>',
        output='<p>Line 1: the smallest suitable <code>k</code>. Line 2: the message decrypted with that <code>k</code>.</p>',
        constraints='<p>At least one <code>k</code> works. The message has at most 50 words of at most 10 letters.</p>',
        examples=[('cat\nwkh fdw vdw grzq\n', '3\nthe cat sat down\n')],
        hint='<p>Try every <code>k</code> from 0 to 25 in order. For each one, decrypt the whole message, split it into words, and check whether the known word is <code>in</code> that list. Stop at the first <code>k</code> that works.</p>',
        solution='def shift(s, k):\n    out = ""\n    for c in s:\n        if c == " ":\n            out += c\n        else:\n            out += chr((ord(c) - 97 + k) % 26 + 97)\n    return out\n\nknown = input().strip()\nmsg = input()\nfor k in range(26):\n    plain = shift(msg, -k)\n    if known in plain.split():\n        print(k)\n        print(plain)\n        break\n',
        alt='import string\nlo = string.ascii_lowercase\nknown = input().strip()\nmsg = input()\nwords = msg.split()\nfor k in range(26):\n    enc = "".join(lo[(lo.index(c) + k) % 26] for c in known)\n    if enc in words:\n        print(k)\n        print(msg.translate(str.maketrans(lo, lo[-k:] + lo[:-k] if k else lo)))\n        break\n',
        explanation='<p>Shifting back by <code>k</code> is the same as shifting forward by <code>-k</code>; Python\'s <code>%</code> keeps the result between 0 and 25.</p>',
        tests=lambda r: [
            (lambda known, words, k: f'{known}\n' + ' '.join(''.join(chr((ord(c) - 97 + k) % 26 + 97) for c in w) for w in words))(
                kn, (lambda ws: ws[:p] + [kn] + ws[p:])([word(r, 1, 10) for _ in range(nw)]), kk)
            for kn, nw, p, kk in [('a', 0, 0, 0), ('a', 3, 1, 25), ('the', 5, 0, 13), ('zebra', 4, 4, 1), ('ab', 6, 2, 7), ('abc', 2, 1, 0)]
        ] + [
            (lambda known, k: (lambda ws: f'{known}\n' + ' '.join(''.join(chr((ord(c) - 97 + k) % 26 + 97) for c in w) for w in ws))(
                [word(r, 1, 10) for _ in range(r.randint(0, 40))] + [known] + [word(r, 1, 10) for _ in range(r.randint(0, 8))]))(word(r, 1, 3), r.randint(0, 25))
            for _ in range(5)],
    ),
    Problem(
        slug='shortest-repeating-block', title='Shortest Repeating Block', level=3,
        statement='<p>Some strings are made by writing one block several times in a row: <code>abcabcabc</code> is <code>abc</code> written 3 times. Find the length of the <strong>shortest</strong> block that builds the whole string when it is repeated a whole number of times. (Every string is its own block written once, so the answer is at most the length of the string.)</p>',
        input='<p>One line: a string of lowercase letters.</p>',
        output='<p>One integer: the length of the shortest block.</p>',
        constraints='<p>1 ≤ length ≤ 2000</p>',
        examples=[('abcabcabc\n', '3\n'), ('abcab\n', '5\n', 'abc does not fit a whole number of times, so the only block is the whole string.')],
        hint='<p>Only lengths that divide the length of the string can work. For each such length <code>k</code>, from small to large, check whether <code>s[:k]</code> repeated <code>len(s) // k</code> times equals <code>s</code>.</p>',
        solution='s = input().strip()\nn = len(s)\nfor k in range(1, n + 1):\n    if n % k == 0 and s[:k] * (n // k) == s:\n        print(k)\n        break\n',
        alt='s = input().strip()\nprint((s + s).find(s, 1))\n',
        explanation='<p>A neat trick: the shortest block length is the first position (after 0) where <code>s</code> appears again inside <code>s + s</code>.</p>',
        tests=lambda r: ['a', 'aa', 'ab', 'aaaaaaaaaaaaaaaaaaab', 'abab', 'abaaba', 'a' * 2000, 'ab' * 999 + 'ba'] + [
            (lambda b: b * (2000 // len(b)))(rs(r, r.choice([3, 4, 5, 8, 16, 40]), 'ab')) for _ in range(3)] + [
            rs(r, r.randint(1, 50), 'ab')],
    ),
    Problem(
        slug='smallest-rotation', title='The Smallest Rotation', level=3,
        statement='<p>A <strong>rotation</strong> of a string moves some characters from the front to the back: the rotations of <code>bca</code> are <code>bca</code>, <code>cab</code> and <code>abc</code>. Print the rotation that comes first in dictionary order.</p>',
        input='<p>One line: a string of lowercase letters.</p>',
        output='<p>The smallest rotation.</p>',
        constraints='<p>1 ≤ length ≤ 1000</p>',
        examples=[('bca\n', 'abc\n'), ('baba\n', 'abab\n')],
        hint='<p>The rotation that starts at position <code>i</code> is <code>s[i:] + s[:i]</code>. Strings can be compared with <code>&lt;</code> directly, so keep the smallest one you have seen.</p>',
        solution='s = input().strip()\nbest = s\nfor i in range(1, len(s)):\n    r = s[i:] + s[:i]\n    if r < best:\n        best = r\nprint(best)\n',
        alt='s = input().strip()\nn = len(s)\ni, j, k = 0, 1, 0\nwhile i < n and j < n and k < n:\n    a = s[(i + k) % n]\n    b = s[(j + k) % n]\n    if a == b:\n        k += 1\n        continue\n    if a > b:\n        i += k + 1\n    else:\n        j += k + 1\n    if i == j:\n        j += 1\n    k = 0\nst = min(i, j)\nprint(s[st:] + s[:st])\n',
        tests=lambda r: ['a', 'ba', 'aaaa', 'zyx', 'abab', 'aab' * 300, 'z' * 999 + 'a'] + [
            rs(r, r.randint(1, 1000), 'ab'), rs(r, r.randint(1, 1000), 'abc'), rs(r, r.randint(1, 1000))],
    ),
    Problem(
        slug='word-count-ranking', title='Word Popularity Contest', level=3,
        statement='<p>Read a piece of text and rank its words by how often they appear. A word is a group of English letters next to each other, as long as possible; anything that is not a letter separates words. Capital and small letters count as the same, so <code>The</code> and <code>the</code> are the same word.</p>',
        input='<p>Several lines of text, until the end of the input. There is at least one word.</p>',
        output='<p>Every different word (in lowercase) followed by a space and its count, one per line. Words that appear more often come first; words with the same count are in alphabetical order.</p>',
        constraints='<p>At most 50 lines of at most 100 characters each.</p>',
        examples=[('The cat and the hat.\nThe END, the end!\n', 'the 4\nend 2\nand 1\ncat 1\nhat 1\n')],
        hint='<p>Read everything with <code>sys.stdin.read()</code> and lowercase it. Count words in a dictionary. To order them, sort the (word, count) pairs with a key like <code>(-count, word)</code>.</p>',
        solution='import sys\ntext = sys.stdin.read().lower()\ncount = {}\nw = ""\nfor c in text + " ":\n    if "a" <= c <= "z":\n        w += c\n    elif w:\n        count[w] = count.get(w, 0) + 1\n        w = ""\nfor word, k in sorted(count.items(), key=lambda p: (-p[1], p[0])):\n    print(word, k)\n',
        alt='import re, sys\nfrom collections import Counter\nc = Counter(re.findall(r"[a-z]+", sys.stdin.read().lower()))\nbykey = sorted(c)\nfor k in range(max(c.values()), 0, -1):\n    for w in bykey:\n        if c[w] == k:\n            print(w, k)\n',
        tests=lambda r: ['a', 'A a A', 'one\ntwo\nthree', "it's a dog's life", 'x1y2z3 x-y-z X.Y.Z'] + [
            lines(*[' '.join(r.choice(['the', 'The', 'a', 'cat', 'dog', 'Dog', 'and', 'or', 'it', 'is', 'big', 'small', 'red']) + r.choice(['', '', ',', '.', '!', "'s"]) for _ in range(r.randint(1, 15))) for _ in range(r.randint(1, 30))])
            for _ in range(5)],
    ),
    Problem(
        slug='column-name', title='Spreadsheet Column Names', level=3,
        statement='<p>Spreadsheet columns are named <code>A</code>, <code>B</code>, …, <code>Z</code>, then <code>AA</code>, <code>AB</code>, …, <code>AZ</code>, <code>BA</code>, …, <code>ZZ</code>, then <code>AAA</code>, and so on. Column 1 is <code>A</code>, column 26 is <code>Z</code> and column 27 is <code>AA</code>. Given a column number, print its name.</p>',
        input='<p>One integer <code>n</code>.</p>',
        output='<p>The name of column <code>n</code>.</p>',
        constraints='<p>1 ≤ n ≤ 1 000 000 000</p>',
        examples=[('28\n', 'AB\n'), ('702\n', 'ZZ\n'), ('703\n', 'AAA\n')],
        hint='<p>This is almost base 26, except that there is no "zero" letter: the letters stand for 1 to 26. Try subtracting 1 from <code>n</code> before each <code>% 26</code> and <code>// 26</code>.</p>',
        solution='n = int(input())\nname = ""\nwhile n > 0:\n    n -= 1\n    name = chr(ord("A") + n % 26) + name\n    n //= 26\nprint(name)\n',
        alt='n = int(input())\nlength, block = 1, 26\nwhile n > block:\n    n -= block\n    length += 1\n    block *= 26\nn -= 1\ndigits = []\nfor _ in range(length):\n    digits.append(chr(65 + n % 26))\n    n //= 26\nprint("".join(reversed(digits)))\n',
        explanation='<p>Normal base 26 would need a digit for 0, but there is no such letter: after <code>Z</code> comes <code>AA</code>, not <code>BA</code>. Subtracting 1 first shifts the letters to 0…25 for each step.</p>',
        tests=lambda r: ['1', '26', '27', '52', '53', '676', '677', '18278', '18279', '1000000000'] + [str(r.randint(1, 10**9)) for _ in range(3)],
    ),
    Problem(
        slug='longest-unique-substring', title='Longest Stretch Without Repeats', level=3,
        statement='<p>Find the longest <strong>substring</strong> (a piece of neighbouring characters) in which no character appears twice. If several substrings have that length, choose the one that starts first.</p>',
        input='<p>One line: a string of lowercase letters.</p>',
        output='<p>Line 1: the length of the longest such substring. Line 2: the substring itself.</p>',
        constraints='<p>1 ≤ length ≤ 3000</p>',
        examples=[('abcabcbb\n', '3\nabc\n'), ('pwwkew\n', '3\nwke\n')],
        hint='<p>Keep a window <code>[left, right]</code> with no repeats and slide <code>right</code> forward. When the new character is already inside the window, move <code>left</code> just past its earlier copy. Remember where each letter was last seen.</p>',
        solution='s = input().strip()\nlast = {}\nleft = 0\nbest_len, best_start = 0, 0\nfor right, c in enumerate(s):\n    if c in last and last[c] >= left:\n        left = last[c] + 1\n    last[c] = right\n    if right - left + 1 > best_len:\n        best_len = right - left + 1\n        best_start = left\nprint(best_len)\nprint(s[best_start:best_start + best_len])\n',
        alt='s = input().strip()\nbest = ""\nfor i in range(len(s)):\n    seen = set()\n    j = i\n    while j < len(s) and s[j] not in seen:\n        seen.add(s[j])\n        j += 1\n    if j - i > len(best):\n        best = s[i:j]\nprint(len(best))\nprint(best)\n',
        tests=lambda r: ['a', 'aaaa', 'abcdefghijklmnopqrstuvwxyz', 'abba', 'dvdf', 'abcdefghijklmnopqrstuvwxyz' * 100] + [
            rs(r, r.randint(1, 3000), LOW[:k]) for k in (2, 5, 12, 26)],
    ),
    Problem(
        slug='longest-palindrome-substring', title='Longest Palindrome Inside', level=3,
        statement='<p>Find the longest substring (a piece of neighbouring characters) that is a palindrome — it reads the same forwards and backwards. If several have the greatest length, print the one that starts first.</p>',
        input='<p>One line: a string of lowercase letters.</p>',
        output='<p>The longest palindromic substring.</p>',
        constraints='<p>1 ≤ length ≤ 1000</p>',
        examples=[('babad\n', 'bab\n', 'aba is just as long, but bab starts first.'), ('cbbd\n', 'bb\n')],
        hint='<p>Every palindrome has a middle: either one letter (odd length) or the gap between two letters (even length). From each possible middle, grow outwards while the two ends match.</p>',
        solution='s = input().strip()\nn = len(s)\nbest_start, best_len = 0, 1\nfor mid in range(n):\n    for lo, hi in ((mid, mid), (mid, mid + 1)):\n        while lo >= 0 and hi < n and s[lo] == s[hi]:\n            lo -= 1\n            hi += 1\n        length = hi - lo - 1\n        if length > best_len:\n            best_start, best_len = lo + 1, length\nprint(s[best_start:best_start + best_len])\n',
        alt='s = input().strip()\nn = len(s)\nfound = None\nfor L in range(n, 0, -1):\n    for i in range(n - L + 1):\n        t = s[i:i + L]\n        if t == t[::-1]:\n            found = t\n            break\n    if found:\n        break\nprint(found)\n',
        explanation='<p>Two palindromes of the same length have the same kind of middle, and the one whose middle is further left also starts further left. So scanning middles from left to right and replacing the best only when a <em>longer</em> one appears gives the first one automatically.</p>',
        tests=lambda r: ['a', 'ab', 'aa', 'abc', 'aaaa', 'abacdfgdcaba', 'a' * 1000,
                         (lambda h: rs(r, 300) + h + h[::-1] + rs(r, 300))(rs(r, 150))] + [
            rs(r, r.randint(1, 1000), LOW[:k]) for k in (2, 3, 26)],
    ),
    Problem(
        slug='distinct-substrings', title='How Many Different Pieces?', level=3,
        statement='<p>A substring is a piece of neighbouring characters of a string (it must not be empty). Count how many <strong>different</strong> substrings a string has. For example <code>abab</code> has 7: <code>a</code>, <code>b</code>, <code>ab</code>, <code>ba</code>, <code>aba</code>, <code>bab</code> and <code>abab</code>.</p>',
        input='<p>One line: a string of lowercase letters.</p>',
        output='<p>One integer: the number of different non-empty substrings.</p>',
        constraints='<p>1 ≤ length ≤ 200</p>',
        examples=[('abab\n', '7\n'), ('aaa\n', '3\n')],
        hint='<p>A substring is fixed by where it starts and where it ends. Put every one into a <code>set</code>, which keeps only one copy of each.</p>',
        solution='s = input().strip()\nseen = set()\nfor i in range(len(s)):\n    for j in range(i + 1, len(s) + 1):\n        seen.add(s[i:j])\nprint(len(seen))\n',
        alt='s = input().strip()\nn = len(s)\nsuf = sorted(s[i:] for i in range(n))\ntotal = 0\nprev = ""\nfor t in suf:\n    k = 0\n    while k < len(t) and k < len(prev) and t[k] == prev[k]:\n        k += 1\n    total += len(t) - k\n    prev = t\nprint(total)\n',
        explanation='<p>The alternative counts without a set: sort all the suffixes; each suffix adds as many new substrings as it has characters, minus the part it shares with the suffix just before it.</p>',
        tests=lambda r: ['a', 'ab', 'abc', 'aaaa', 'a' * 200, 'ab' * 100, 'abcdefghijklmnopqrstuvwxyz'] + [
            rs(r, r.randint(1, 200), LOW[:k]) for k in (2, 3, 26)],
    ),
]
