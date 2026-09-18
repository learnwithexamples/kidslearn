"""Lesson 4 - Your First JavaScript."""
from build_web_lessons import section, demo, info, tip, warn, code_block, task

LESSON = dict(
    icon="⚡",
    title="Your First JavaScript",
    subtitle="Where labelling stops and real programming begins",
    tag="Real code now",
    card="console.log, variables, numbers and text. If you know Python, this is the same music in a different key.",
    practice_intro="These tasks have no page to look at — the output box below each one is where your <code>console.log</code> lines appear.",
    footer="Every browser in the world speaks JavaScript. Including yours. ⚡",

    sections=[
        section("⚡ HTML labels. JavaScript decides.",
            info("<p>HTML and CSS cannot count, cannot compare, cannot remember. <strong>JavaScript</strong> can. It is a real programming language, it is built into every browser, and it is what makes a page <em>do</em> something instead of just sitting there.</p>"),
            "<p>It goes inside a <code>&lt;script&gt;</code> tag:</p>",
            demo('''<p>Look in the box below.</p>
<pre id="__out"></pre>
<script>
    console.log("Hello from JavaScript!");
<''' + '''/script>''', kind="html"),
            "<p><code>console.log(...)</code> is JavaScript's <code>print()</code>. It writes a line out where a programmer can read it.</p>"),

        section("📦 Variables",
            "<p>Same idea as Python, with one extra word at the front:</p>",
            code_block('''let score = 100;
const name = "Maya";'''),
            '''<ul>
                    <li><code>let</code> — a box whose contents can change later.</li>
                    <li><code>const</code> — a box that is set once and never changed.</li>
                </ul>''',
            demo('''let score = 10;
console.log(score);

score = score + 5;
console.log(score);

const name = "Maya";
console.log(name);''', kind="js"),
            tip("🔒 Reach for const first",
                "<p>Use <code>const</code> unless you know the value has to change. A box that cannot change is one less thing that can go wrong — and when you read the code later, <code>const</code> promises you it is still what it was.</p>")),

        section("🐍 If you know Python…",
            '''<div class="algo-table-wrap">
                <table class="canvas-table">
                    <tr><th>Python</th><th>JavaScript</th><th></th></tr>
                    <tr><td><code>score = 10</code></td><td><code>let score = 10;</code></td><td>say let or const</td></tr>
                    <tr><td><code>print(x)</code></td><td><code>console.log(x);</code></td><td>same job</td></tr>
                    <tr><td><code># a note</code></td><td><code>// a note</code></td><td>two slashes</td></tr>
                    <tr><td><code>True</code> / <code>False</code></td><td><code>true</code> / <code>false</code></td><td>lower case</td></tr>
                    <tr><td><code>None</code></td><td><code>null</code></td><td>nothing at all</td></tr>
                    <tr><td>indentation</td><td><code>{ }</code></td><td>braces group things</td></tr>
                </table>
            </div>''',
            info("<p>The ideas are identical. Variables, text, numbers, decisions, loops — you are not learning to program twice, you are learning one thing in a second accent.</p>")),

        section("🔢 Numbers and text",
            demo('''let a = 7;
let b = 2;

console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);
console.log(a % b);''', kind="js"),
            "<p>Note <code>7 / 2</code> gives <code>3.5</code> — JavaScript has only one kind of number, so no whole-number division surprise.</p>",
            "<p>Joining text together is done with <code>+</code> as well, but there is a much nicer way — <strong>backticks</strong> with <code>${...}</code> holes in them:</p>",
            demo('''const name = "Maya";
const age = 11;

console.log("Hi " + name + ", you are " + age);
console.log(`Hi ${name}, you are ${age}`);''', kind="js"),
            warn("⚠️ + means two different things",
                 "<p><code>2 + 3</code> is <code>5</code>. But <code>\"2\" + 3</code> is <code>\"23\"</code>, because a piece of text next to a <code>+</code> turns the whole thing into joining. This catches everybody once.</p>")),

        section("🧰 A few things you can ask of text",
            demo('''const word = "dragon";

console.log(word.length);
console.log(word.toUpperCase());
console.log(word[0]);
console.log(word.includes("ago"));''', kind="js"),
            tip("📏 length has no brackets",
                "<p><code>word.length</code> is a <em>fact about</em> the text, so no brackets. <code>word.toUpperCase()</code> is something you ask it to <em>do</em>, so it gets brackets. That difference runs all the way through the language.</p>")),

        section("✅ What you learned",
            '''<div class="takeaway-box">
                    <ul>
                        <li>JavaScript lives in <code>&lt;script&gt;</code> tags and runs in the browser.</li>
                        <li><code>console.log()</code> prints. <code>//</code> starts a comment.</li>
                        <li><code>let</code> for a box that changes, <code>const</code> for one that does not.</li>
                        <li>Backticks and <code>${ }</code> beat gluing text with <code>+</code>.</li>
                        <li>Lines usually end with a semicolon.</li>
                    </ul>
                </div>'''),
    ],

    tasks=[
        task("👋", "Task 1: Hello, Console", "Easy",
             "Print the exact words <code>Hello, JavaScript!</code>",
             "js", 'console.log("Hello, JavaScript!");',
             expected="Hello, JavaScript!"),

        task("📦", "Task 2: Two Boxes", "Easy",
             "Make a <code>const</code> called <code>pet</code> holding <code>\"Buddy\"</code> and a <code>let</code> called <code>age</code> holding <code>7</code>. Print each one on its own line — the values, not the words.",
             "js", 'const pet = "Buddy";\nlet age = 7;\nconsole.log(pet);\nconsole.log(age);',
             expected="Buddy\n7"),

        task("🧮", "Task 3: A Little Maths", "Medium",
             "Two variables, <code>a = 12</code> and <code>b = 5</code>. Print their sum, then their difference, then their product — three lines, in that order.",
             "js", 'const a = 12;\nconst b = 5;\nconsole.log(a + b);\nconsole.log(a - b);\nconsole.log(a * b);',
             expected="17\n7\n60"),
    ],

    extra=[
        task("💬", "Task 4: Use a Template", "Medium",
             "Make <code>const name = \"Sam\"</code> and <code>const age = 10</code>, then print exactly <code>Sam is 10 years old</code> using backticks and <code>${ }</code> — not <code>+</code>.",
             "js", 'const name = "Sam";\nconst age = 10;\nconsole.log(`${name} is ${age} years old`);',
             expected="Sam is 10 years old"),

        task("🔁", "Task 5: Change the Box", "Easy",
             "Make <code>let score = 10</code>. Print it. Add 5 to it and print it again. Double it and print it a third time.",
             "js", 'let score = 10;\nconsole.log(score);\nscore = score + 5;\nconsole.log(score);\nscore = score * 2;\nconsole.log(score);',
             expected="10\n15\n30"),

        task("🔤", "Task 6: Ask a Word Some Questions", "Medium",
             "Make <code>const word = \"elephant\"</code>. Print its length, then the whole word in capitals, then its first letter — three lines.",
             "js", 'const word = "elephant";\nconsole.log(word.length);\nconsole.log(word.toUpperCase());\nconsole.log(word[0]);',
             expected="8\nELEPHANT\ne"),

        task("🪤", "Task 7: The Plus Trap", "Hard",
             "Print three lines that show the trap. Line 1: <code>2 + 3</code> as numbers. Line 2: <code>\"2\" + 3</code> with the 2 in quotes. Line 3: the word <code>different</code>. Your output should read <code>5</code>, then <code>23</code>, then <code>different</code>.",
             "js", 'console.log(2 + 3);\nconsole.log("2" + 3);\nconsole.log("different");',
             expected="5\n23\ndifferent"),

        task("🎁", "Task 8: Boss Level — A Receipt", "Hard",
             "<code>const item = \"Cake\"</code>, <code>const price = 4</code>, <code>const many = 3</code>. Print exactly two lines:<br><code>Cake x3</code><br><code>Total: 12</code><br>Work the total out with <code>*</code> — do not type <code>12</code> yourself.",
             "js", 'const item = "Cake";\nconst price = 4;\nconst many = 3;\nconsole.log(`${item} x${many}`);\nconsole.log(`Total: ${price * many}`);',
             expected="Cake x3\nTotal: 12"),
    ],
)
