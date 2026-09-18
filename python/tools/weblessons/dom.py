"""Lesson 6 - Making the Page Do Things."""
from build_web_lessons import section, demo, info, tip, warn, code_block, task

LESSON = dict(
    icon="🖱️",
    title="Making the Page Do Things",
    subtitle="Buttons, clicks, and changing the page while it is running",
    tag="It's alive!",
    card="Find an element from JavaScript, change it, and make something happen when a button is clicked.",
    practice_intro="From here on your pages answer back. Click your own buttons and watch the page change.",
    footer="The page is not a picture. It is a thing you can reach into. 🖱️",

    sections=[
        section("🔍 Finding something on the page",
            info("<p>So far HTML and JavaScript have been strangers living in the same file. This is where they meet: JavaScript can reach into the page, <strong>find</strong> an element, and change it.</p>"),
            "<p>Give the element an <code>id</code>, then look it up by that id:</p>",
            demo('''<h1 id="title">Before</h1>

<script>
    const heading = document.getElementById("title");
    heading.textContent = "After!";
<''' + '''/script>''', kind="html"),
            "<p>The page loads saying <em>Before</em>, and the script changes it so fast you only ever see <em>After!</em>.</p>",
            tip("🏷️ id versus class",
                "<p>A <code>class</code> can be on many elements — it is a <em>kind</em> of thing. An <code>id</code> must be on exactly <strong>one</strong> — it is a <em>name</em>. Use an id when JavaScript needs to find one particular element.</p>")),

        section("✏️ Changing what you found",
            demo('''<p id="one">Change my words</p>
<p id="two">Change my colour</p>
<p id="three">Change my size</p>

<script>
    document.getElementById("one").textContent = "Changed!";
    document.getElementById("two").style.color = "crimson";
    document.getElementById("three").style.fontSize = "28px";
<''' + '''/script>''', kind="html"),
            '''<ul>
                    <li><code>.textContent</code> — the words inside it</li>
                    <li><code>.style.color</code> — any CSS property, set from code</li>
                    <li><code>.style.backgroundColor</code> — note the capital C</li>
                </ul>''',
            warn("🐫 CSS names change shape in JavaScript",
                 "<p>In CSS it is <code>background-color</code>. In JavaScript a hyphen would look like a minus sign, so it becomes <code>backgroundColor</code> — hyphen gone, next letter capitalised. Same for <code>font-size</code> → <code>fontSize</code>.</p>")),

        section("🖱️ Doing something when a button is clicked",
            "<p>This is the whole point. <code>addEventListener</code> says: <em>when this happens, run this.</em></p>",
            demo('''<button id="go">Click me</button>
<p id="count">Clicked 0 times</p>

<script>
    let clicks = 0;
    const button = document.getElementById("go");
    const label = document.getElementById("count");

    button.addEventListener("click", function () {
        clicks = clicks + 1;
        label.textContent = `Clicked ${clicks} times`;
    });
<''' + '''/script>''', kind="html", tall=True),
            info("<p>Read it as a sentence: <em>on the button, listen for a click, and when one comes, run this function.</em> The function sits there doing nothing until somebody clicks.</p>"),
            tip("⏳ The script must come after the button",
                "<p>The browser reads your page top to bottom. Put the <code>&lt;script&gt;</code> above the button and <code>getElementById</code> comes back with <code>null</code>, because the button does not exist yet. Script at the bottom, always.</p>")),

        section("⌨️ Reading what someone typed",
            "<p>An <code>&lt;input&gt;</code> box carries what the user typed in its <code>.value</code>:</p>",
            demo('''<input id="name" placeholder="Your name">
<button id="say">Say hello</button>
<p id="out"></p>

<script>
    document.getElementById("say").addEventListener("click", function () {
        const typed = document.getElementById("name").value;
        document.getElementById("out").textContent = `Hello, ${typed}!`;
    });
<''' + '''/script>''', kind="html", tall=True),
            warn("🔢 What comes out of an input is always text",
                 "<p>Type <code>5</code> into a box and <code>.value</code> gives you <code>\"5\"</code>, not <code>5</code>. Adding it to a number joins instead of adds. Wrap it in <code>Number(...)</code> first.</p>")),

        section("➕ Making new things from code",
            "<p>You are not limited to what the HTML already contains — you can build more:</p>",
            demo('''<button id="add">Add a line</button>
<ul id="list"></ul>

<script>
    let n = 0;
    document.getElementById("add").addEventListener("click", function () {
        n = n + 1;
        const item = document.createElement("li");
        item.textContent = `Item number ${n}`;
        document.getElementById("list").appendChild(item);
    });
<''' + '''/script>''', kind="html", tall=True),
            "<p><code>createElement</code> makes it, <code>appendChild</code> puts it on the page. Until you append it, nobody can see it.</p>"),

        section("✅ What you learned",
            '''<div class="takeaway-box">
                    <ul>
                        <li><code>document.getElementById("name")</code> finds one element by its <code>id</code>.</li>
                        <li><code>.textContent</code> changes its words; <code>.style.something</code> changes its look.</li>
                        <li>CSS names lose their hyphen and gain a capital: <code>backgroundColor</code>.</li>
                        <li><code>addEventListener("click", function () { … })</code> makes things happen.</li>
                        <li><code>.value</code> reads an input — and it is always <strong>text</strong>.</li>
                        <li>Put the <code>&lt;script&gt;</code> <strong>after</strong> the things it looks for.</li>
                    </ul>
                </div>'''),
    ],

    tasks=[
        task("✏️", "Task 1: Change the Words", "Easy",
             "Write an <code>h1</code> with <code>id=\"title\"</code> saying <code>Before</code>, then a script that changes its <code>textContent</code> to <code>It worked!</code>",
             "html", '<h1 id="title">Before</h1>\n\n<script>\n    document.getElementById("title").textContent = "It worked!";\n<' + '/script>',
             expect_tags="h1#title", expected="It worked!"),

        task("🎨", "Task 2: Change the Colour", "Easy",
             "A paragraph with <code>id=\"note\"</code> saying <code>Look at me</code>, and a script that turns it <code>crimson</code> using <code>.style.color</code>.",
             "html", '<p id="note">Look at me</p>\n\n<script>\n    document.getElementById("note").style.color = "crimson";\n<' + '/script>',
             expect_tags="p#note", expected="Look at me"),

        task("🖱️", "Task 3: Your First Button", "Medium",
             "A <code>&lt;button id=\"go\"&gt;</code> saying <code>Press me</code> and a <code>&lt;p id=\"out\"&gt;</code>. When the button is clicked, the paragraph should say <code>You pressed it!</code> Remember: script last.",
             "html", '''<button id="go">Press me</button>
<p id="out"></p>

<script>
    document.getElementById("go").addEventListener("click", function () {
        document.getElementById("out").textContent = "You pressed it!";
    });
<''' + '''/script>''',
             expect_tags="button#go, p#out, script"),
    ],

    extra=[
        task("🔢", "Task 4: A Counter", "Medium",
             "A button and a paragraph showing <code>0</code>. Every click adds one to the number on the page. Keep the count in a <code>let</code> outside the click function.",
             "html", '''<button id="go">Count</button>
<p id="out">0</p>

<script>
    let n = 0;
    document.getElementById("go").addEventListener("click", function () {
        n = n + 1;
        document.getElementById("out").textContent = n;
    });
<''' + '''/script>''',
             expect_tags="button#go, p#out"),

        task("💡", "Task 5: A Light Switch", "Hard",
             "A button and a <code>&lt;div id=\"lamp\"&gt;</code>. Clicking the button should swap the div's background between <code>gold</code> and <code>#333</code> each time. Keep a <code>let on = false</code> and flip it.",
             "html", '''<button id="flip">Flip</button>
<div id="lamp" style="width:120px;height:80px;background:#333"></div>

<script>
    let on = false;
    document.getElementById("flip").addEventListener("click", function () {
        on = !on;
        document.getElementById("lamp").style.backgroundColor = on ? "gold" : "#333";
    });
<''' + '''/script>''',
             expect_tags="button#flip, div#lamp"),

        task("⌨️", "Task 6: Greet the Typist", "Medium",
             "An <code>&lt;input id=\"name\"&gt;</code>, a button, and a paragraph. Clicking the button should make the paragraph say <code>Hello, </code> then whatever was typed.",
             "html", '''<input id="name" placeholder="Your name">
<button id="say">Say hello</button>
<p id="out"></p>

<script>
    document.getElementById("say").addEventListener("click", function () {
        const typed = document.getElementById("name").value;
        document.getElementById("out").textContent = `Hello, ${typed}!`;
    });
<''' + '''/script>''',
             expect_tags="input#name, button#say, p#out"),

        task("🧮", "Task 7: Boss Level — A Doubler", "Hard",
             "An input, a button and a paragraph. Clicking the button reads the number typed, doubles it, and shows the answer. Remember that <code>.value</code> is text — wrap it in <code>Number(...)</code> or you will get <code>55</code> instead of <code>10</code>.",
             "html", '''<input id="n" placeholder="A number">
<button id="go">Double it</button>
<p id="out"></p>

<script>
    document.getElementById("go").addEventListener("click", function () {
        const value = Number(document.getElementById("n").value);
        document.getElementById("out").textContent = value * 2;
    });
<''' + '''/script>''',
             expect_tags="input#n, button#go, p#out"),
    ],
)
