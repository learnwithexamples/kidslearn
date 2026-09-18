"""Lesson 5 - Decisions, Loops and Functions."""
from build_web_lessons import section, demo, info, tip, warn, code_block, task

LESSON = dict(
    icon="🔀",
    title="Decisions, Loops & Functions",
    subtitle="if, for, and giving a job a name",
    tag="The big three",
    card="Choose between paths, repeat work without repeating yourself, and bundle a job up so you can use it again.",
    practice_intro="Three ideas here do most of the work in every program ever written. Take your time with them.",
    footer="A loop you write once runs a million times. That is the deal. 🔁",

    sections=[
        section("🔀 Making a choice",
            "<p>A condition in round brackets, the work in curly ones:</p>",
            demo('''const age = 12;

if (age >= 13) {
    console.log("Teenager");
} else {
    console.log("Not yet");
}''', kind="js"),
            "<p>The tests you can put in the brackets:</p>",
            '''<div class="algo-table-wrap">
                <table class="canvas-table">
                    <tr><th>Test</th><th>Means</th><th>Test</th><th>Means</th></tr>
                    <tr><td><code>===</code></td><td>is exactly equal to</td><td><code>&gt;</code></td><td>bigger than</td></tr>
                    <tr><td><code>!==</code></td><td>is not equal to</td><td><code>&lt;</code></td><td>smaller than</td></tr>
                    <tr><td><code>&gt;=</code></td><td>at least</td><td><code>&lt;=</code></td><td>at most</td></tr>
                    <tr><td><code>&amp;&amp;</code></td><td>and — both must hold</td><td><code>||</code></td><td>or — either will do</td></tr>
                </table>
            </div>''',
            warn("⚠️ Three equals, not one",
                 "<p><code>=</code> puts a value in a box. <code>===</code> asks whether two things are the same. Writing <code>if (x = 5)</code> quietly <em>sets</em> x to 5 and is always true — a bug that has cost the world a great deal of time.</p>")),

        section("🪜 More than two paths",
            demo('''const score = 72;

if (score >= 90) {
    console.log("A");
} else if (score >= 80) {
    console.log("B");
} else if (score >= 70) {
    console.log("C");
} else {
    console.log("Keep going");
}''', kind="js"),
            tip("⬇️ Order matters",
                "<p>JavaScript takes the <strong>first</strong> branch that fits and skips the rest. Put <code>score >= 70</code> at the top and every score above 70 gets a C — including 95.</p>")),

        section("🔁 Loops",
            "<p>A <code>for</code> loop says three things in one line: where to start, when to stop, and how to step.</p>",
            demo('''for (let i = 1; i <= 5; i++) {
    console.log(i);
}''', kind="js"),
            '''<div class="tag-anatomy">
                    <div class="tag-part"><code>let i = 1</code><span>start here</span></div>
                    <div class="tag-part"><code>i &lt;= 5</code><span>keep going while this is true</span></div>
                    <div class="tag-part"><code>i++</code><span>add one each time round</span></div>
                </div>''',
            "<p><code>i++</code> is shorthand for <code>i = i + 1</code>. You will see it everywhere.</p>",
            demo('''let total = 0;

for (let n = 1; n <= 10; n++) {
    total = total + n;
}

console.log(`1 to 10 adds up to ${total}`);''', kind="js"),
            warn("♾️ The loop that never ends",
                 "<p>If the middle test never becomes false — say you forget the <code>i++</code> — the loop runs for ever and the page freezes. If that happens, close the tab and look at your three parts.</p>")),

        section("📋 Lists of things",
            "<p>JavaScript calls them <strong>arrays</strong>. Square brackets, commas between:</p>",
            demo('''const pets = ["cat", "dog", "newt"];

console.log(pets.length);
console.log(pets[0]);
console.log(pets[2]);

for (const pet of pets) {
    console.log(`I have a ${pet}`);
}''', kind="js"),
            info("<p><code>for (const x of list)</code> is the easy loop: it hands you each item in turn and you never have to think about counting. Use it whenever you do not actually need the position.</p>")),

        section("🧰 Functions: giving a job a name",
            "<p>A function is a chunk of work with a name, so you can do it again without writing it again:</p>",
            demo('''function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("Maya"));
console.log(greet("Sam"));
console.log(greet("the dragon"));''', kind="js"),
            '''<ul>
                    <li><code>function</code> then a name, then what it needs in brackets.</li>
                    <li><code>return</code> hands an answer back to whoever asked.</li>
                    <li>Nothing happens until somebody <strong>calls</strong> it: <code>greet("Maya")</code>.</li>
                </ul>''',
            demo('''function double(n) {
    return n * 2;
}

function biggest(a, b) {
    if (a > b) {
        return a;
    }
    return b;
}

console.log(double(21));
console.log(biggest(3, 9));''', kind="js"),
            tip("🎁 Write the name you wish existed",
                "<p>If your code has a confusing lump in the middle, pull it out into a function and name it after what it <em>does</em>. <code>if (isWeekend(day))</code> reads better than the six lines it replaces.</p>")),

        section("✅ What you learned",
            '''<div class="takeaway-box">
                    <ul>
                        <li><code>if / else if / else</code> — the first match wins.</li>
                        <li><code>===</code> compares, <code>=</code> assigns. Never muddle them.</li>
                        <li><code>for (let i = 0; i &lt; n; i++)</code> when you need the number; <code>for (const x of list)</code> when you do not.</li>
                        <li>Arrays use <code>[ ]</code>, count from <strong>0</strong>, and know their own <code>.length</code>.</li>
                        <li>A <code>function</code> names a job; <code>return</code> hands the answer back.</li>
                    </ul>
                </div>'''),
    ],

    tasks=[
        task("🔀", "Task 1: Old Enough?", "Easy",
             "Make <code>const age = 15</code>. If it is 13 or more print <code>Teenager</code>, otherwise print <code>Not yet</code>.",
             "js", 'const age = 15;\nif (age >= 13) {\n    console.log("Teenager");\n} else {\n    console.log("Not yet");\n}',
             expected="Teenager"),

        task("🔢", "Task 2: Count to Five", "Easy",
             "Use a <code>for</code> loop to print the numbers 1 to 5, one per line.",
             "js", 'for (let i = 1; i <= 5; i++) {\n    console.log(i);\n}',
             expected="1\n2\n3\n4\n5"),

        task("🧰", "Task 3: A Function of Your Own", "Medium",
             "Write a function <code>square(n)</code> that returns <code>n</code> times itself. Then print <code>square(4)</code> and <code>square(9)</code> — two lines.",
             "js", 'function square(n) {\n    return n * n;\n}\nconsole.log(square(4));\nconsole.log(square(9));',
             expected="16\n81"),
    ],

    extra=[
        task("🪜", "Task 4: Grades", "Medium",
             "Make <code>const score = 85</code>. Print <code>A</code> for 90 or more, <code>B</code> for 80 or more, <code>C</code> for 70 or more, otherwise <code>Keep going</code>. Get the order right.",
             "js", 'const score = 85;\nif (score >= 90) {\n    console.log("A");\n} else if (score >= 80) {\n    console.log("B");\n} else if (score >= 70) {\n    console.log("C");\n} else {\n    console.log("Keep going");\n}',
             expected="B"),

        task("➕", "Task 5: Add Them Up", "Medium",
             "Use a loop to add up every number from 1 to 100, then print just the total.",
             "js", 'let total = 0;\nfor (let n = 1; n <= 100; n++) {\n    total = total + n;\n}\nconsole.log(total);',
             expected="5050"),

        task("📋", "Task 6: Walk a List", "Medium",
             "Make an array <code>const pets = [\"cat\", \"dog\", \"newt\"]</code>. Loop over it and print <code>I have a cat</code>, <code>I have a dog</code>, <code>I have a newt</code>.",
             "js", 'const pets = ["cat", "dog", "newt"];\nfor (const pet of pets) {\n    console.log(`I have a ${pet}`);\n}',
             expected="I have a cat\nI have a dog\nI have a newt"),

        task("🎲", "Task 7: Even or Odd", "Hard",
             "Write a function <code>evenOrOdd(n)</code> that returns <code>\"even\"</code> or <code>\"odd\"</code> (use <code>%</code>). Then loop from 1 to 5 printing <code>1 is odd</code>, <code>2 is even</code>, and so on.",
             "js", '''function evenOrOdd(n) {
    if (n % 2 === 0) {
        return "even";
    }
    return "odd";
}

for (let i = 1; i <= 5; i++) {
    console.log(`${i} is ${evenOrOdd(i)}`);
}''',
             expected="1 is odd\n2 is even\n3 is odd\n4 is even\n5 is odd"),

        task("⭐", "Task 8: Boss Level — A Triangle", "Hard",
             "Print a triangle of stars five rows tall: one star, then two, up to five. You will need a loop inside a loop, or a string you keep adding to.",
             "js", 'let row = "";\nfor (let i = 1; i <= 5; i++) {\n    row = row + "*";\n    console.log(row);\n}',
             expected="*\n**\n***\n****\n*****"),
    ],
)
