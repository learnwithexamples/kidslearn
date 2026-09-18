"""Lesson 7 - Drawing on a Canvas."""
from build_web_lessons import section, demo, info, tip, warn, code_block, task

LESSON = dict(
    icon="🖼️",
    title="Drawing on a Canvas",
    subtitle="A blank rectangle, and code that paints on it",
    tag="Draw with code",
    card="The canvas element, its upside-down coordinates, and the commands for rectangles, colours and lines.",
    practice_intro="Every task from here draws something. Press Run and compare your canvas with the goal beside it. The faint dashed line round each one marks the edge of the canvas — it is not part of the drawing.",
    footer="Every game in Fun Time is this, thirty times a second. 🖼️",

    sections=[
        section("🖼️ A rectangle you can paint on",
            info("<p>A <code>&lt;canvas&gt;</code> is a blank patch of page. HTML gives you the patch; it cannot draw a single thing on it. <strong>Everything</strong> you see on a canvas was put there by JavaScript — which means every picture is a program.</p>"),
            "<p>Two steps to get started, and they are the same two every time:</p>",
            demo('''<canvas id="board" width="300" height="160"></canvas>

<script>
    const canvas = document.getElementById("board");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "crimson";
    ctx.fillRect(20, 20, 120, 80);
<''' + '''/script>''', kind="html", tall=True),
            '''<ul>
                    <li><code>getElementById</code> finds the canvas — same as Lesson 6.</li>
                    <li><code>getContext("2d")</code> hands you the <strong>brush</strong>. Everybody calls it <code>ctx</code>.</li>
                </ul>''',
            tip("┈ About that dashed line",
                "<p>A canvas has no edge of its own — it is completely invisible until you draw. The faint <strong>dashed grey line</strong> round every canvas in these lessons is put there by the page, just so you can see where the edges are. It is <em>not</em> part of the picture and you never have to draw it.</p>"
                "<p>On a page of your own you would add a real one yourself with CSS: <code>&lt;canvas style=\"border:2px solid #333\"&gt;</code>.</p>"),

            warn("📏 Set the size in the HTML, not the CSS",
                 "<p><code>width=\"300\" height=\"160\"</code> as attributes sets how many <em>pixels</em> the canvas has. Setting it in CSS instead stretches those pixels like a blown-up photo, and everything goes blurry.</p>")),

        section("🧭 Where is (0, 0)?",
            "<p>Top-left. And <strong>y grows downwards</strong> — this trips up everyone who did coordinates in maths class.</p>",
            demo('''const ctx = document.getElementById("board").getContext("2d");

ctx.fillStyle = "#1a5490";
ctx.fillRect(0, 0, 40, 40);

ctx.fillStyle = "seagreen";
ctx.fillRect(120, 0, 40, 40);

ctx.fillStyle = "darkorange";
ctx.fillRect(0, 100, 40, 40);

ctx.fillStyle = "#111";
ctx.font = "13px monospace";
ctx.fillText("(0,0) is up here", 50, 25);
ctx.fillText("bigger y = further DOWN", 50, 125);''', kind="canvas"),
            tip("🔢 Every measurement is in pixels",
                "<p>No centimetres, no percentages. <code>(120, 40)</code> means 120 pixels across from the left edge and 40 pixels down from the top.</p>")),

        section("🟦 Rectangles",
            "<p>Three commands, and all four numbers mean the same thing every time: <strong>x, y, width, height</strong>.</p>",
            demo('''const ctx = document.getElementById("board").getContext("2d");

ctx.fillStyle = "#4a90d9";
ctx.fillRect(20, 20, 90, 60);

ctx.strokeStyle = "crimson";
ctx.lineWidth = 4;
ctx.strokeRect(130, 20, 90, 60);

ctx.fillStyle = "gold";
ctx.fillRect(20, 110, 200, 60);
ctx.clearRect(60, 130, 60, 30);''', kind="canvas"),
            '''<div class="canvas-table-wrap">
                <table class="canvas-table">
                    <tr><th>Command</th><th>What it does</th></tr>
                    <tr><td><code>ctx.fillRect(x, y, w, h)</code></td><td>a solid rectangle</td></tr>
                    <tr><td><code>ctx.strokeRect(x, y, w, h)</code></td><td>just the outline</td></tr>
                    <tr><td><code>ctx.clearRect(x, y, w, h)</code></td><td>rubs that patch out</td></tr>
                    <tr><td><code>ctx.fillStyle = "…"</code></td><td>the colour <em>fills</em> use</td></tr>
                    <tr><td><code>ctx.strokeStyle = "…"</code></td><td>the colour <em>outlines</em> use</td></tr>
                    <tr><td><code>ctx.lineWidth = 4</code></td><td>how thick outlines are</td></tr>
                </table>
            </div>''',
            info("<p>Notice the pattern: <code>fillStyle</code> and <code>lineWidth</code> are <strong>settings</strong> you change, and they stay changed until you change them again. <code>fillRect</code> is an <strong>action</strong>. Set the paint, then paint.</p>")),

        section("📏 Lines and paths",
            "<p>A line is not one command — it is a little journey. Start a path, move the pen, draw to somewhere, then say what to do with it.</p>",
            demo('''const ctx = document.getElementById("board").getContext("2d");

ctx.strokeStyle = "#1a5490";
ctx.lineWidth = 5;

ctx.beginPath();
ctx.moveTo(30, 30);
ctx.lineTo(270, 30);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(30, 70);
ctx.lineTo(150, 200);
ctx.lineTo(270, 70);
ctx.closePath();
ctx.stroke();''', kind="canvas"),
            '''<ul>
                    <li><code>beginPath()</code> — forget the last shape, start fresh</li>
                    <li><code>moveTo(x, y)</code> — lift the pen and put it here</li>
                    <li><code>lineTo(x, y)</code> — draw from where the pen is to here</li>
                    <li><code>closePath()</code> — draw back to where the path started</li>
                    <li><code>stroke()</code> — actually ink it. Or <code>fill()</code> to colour it in.</li>
                </ul>''',
            warn("😖 Forgetting beginPath",
                 "<p>Leave it out and the new shape joins on to the old one — and every <code>stroke()</code> redraws <em>everything</em> in the path, so old lines get thicker and change colour. If your drawing is mysteriously all one colour, this is why.</p>")),

        section("✍️ Writing on the canvas",
            demo('''const ctx = document.getElementById("board").getContext("2d");

ctx.fillStyle = "#1a5490";
ctx.font = "bold 30px sans-serif";
ctx.fillText("Hello!", 20, 50);

ctx.font = "16px monospace";
ctx.fillStyle = "seagreen";
ctx.fillText("small and green", 20, 90);

ctx.strokeStyle = "crimson";
ctx.lineWidth = 1;
ctx.strokeText("outlined", 20, 130);''', kind="canvas"),
            tip("📐 Text sits ON the y line",
                "<p>The y you give <code>fillText</code> is the <strong>baseline</strong> — the line the letters stand on, not their top. Ask for y = 0 and the text is above the canvas where nobody can see it.</p>")),

        section("✅ What you learned",
            '''<div class="takeaway-box">
                    <ul>
                        <li><code>&lt;canvas width height&gt;</code> makes the patch; JavaScript does all the drawing.</li>
                        <li><code>const ctx = canvas.getContext("2d")</code> — every drawing starts here.</li>
                        <li>(0, 0) is <strong>top-left</strong> and y grows <strong>downwards</strong>.</li>
                        <li>Rectangles take <strong>x, y, width, height</strong>.</li>
                        <li>Settings (<code>fillStyle</code>) stay set; actions (<code>fillRect</code>) happen once.</li>
                        <li>Lines need <code>beginPath</code> → <code>moveTo</code> → <code>lineTo</code> → <code>stroke</code>.</li>
                    </ul>
                </div>'''),
    ],

    tasks=[
        task("🟦", "Task 1: One Blue Square", "Easy",
             "The canvas and <code>ctx</code> are already made for you — just draw. Set <code>ctx.fillStyle</code> to <code>\"blue\"</code> and fill a rectangle at x 50, y 50, 100 wide and 100 tall.",
             "canvas", 'ctx.fillStyle = "blue";\nctx.fillRect(50, 50, 100, 100);',
             expect_calls="fillRect"),

        task("🖼️", "Task 2: Filled and Outlined", "Easy",
             "Draw a <strong>filled</strong> green rectangle on the left and an <strong>outlined</strong> red one on the right. Give the outline a <code>lineWidth</code> of 4.",
             "canvas", '''ctx.fillStyle = "seagreen";
ctx.fillRect(20, 40, 110, 90);

ctx.strokeStyle = "crimson";
ctx.lineWidth = 4;
ctx.strokeRect(180, 40, 110, 90);''',
             expect_calls="fillRect, strokeRect"),

        task("📏", "Task 3: A Big X", "Medium",
             "Draw two lines crossing to make an X across the canvas — one from the top-left corner to the bottom-right, one from the top-right to the bottom-left. The canvas is 320 by 240. Use <code>beginPath</code> for each.",
             "canvas", '''ctx.strokeStyle = "#1a5490";
ctx.lineWidth = 5;

ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(320, 240);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(320, 0);
ctx.lineTo(0, 240);
ctx.stroke();''',
             expect_calls="beginPath, moveTo, lineTo, stroke"),
    ],

    extra=[
        task("🚩", "Task 4: A Flag", "Medium",
             "Three tall stripes side by side, filling the whole 320×240 canvas — so each is about 107 wide and 240 tall. Any three colours.",
             "canvas", '''ctx.fillStyle = "#0055a4";
ctx.fillRect(0, 0, 107, 240);
ctx.fillStyle = "#ffffff";
ctx.fillRect(107, 0, 107, 240);
ctx.fillStyle = "#ef4135";
ctx.fillRect(214, 0, 106, 240);''',
             expect_calls="fillRect"),

        task("🏠", "Task 5: A House", "Medium",
             "A square for the walls, a triangle on top for the roof (three points, <code>closePath</code>, then <code>fill</code>), and a small rectangle for the door.",
             "canvas", '''ctx.fillStyle = "#e8d5a3";
ctx.fillRect(90, 110, 140, 110);

ctx.fillStyle = "#a83232";
ctx.beginPath();
ctx.moveTo(75, 110);
ctx.lineTo(160, 40);
ctx.lineTo(245, 110);
ctx.closePath();
ctx.fill();

ctx.fillStyle = "#5a3a1a";
ctx.fillRect(140, 160, 40, 60);''',
             expect_calls="fillRect, beginPath, moveTo, lineTo, fill"),

        task("✍️", "Task 6: Sign Your Work", "Easy",
             "Fill the whole canvas with a colour you like, then write your name on top of it in a different colour, in a font of at least 24px.",
             "canvas", '''ctx.fillStyle = "#1a5490";
ctx.fillRect(0, 0, 320, 240);

ctx.fillStyle = "gold";
ctx.font = "bold 34px sans-serif";
ctx.fillText("Maya", 40, 130);''',
             expect_calls="fillRect, fillText"),

        task("🪜", "Task 7: Boss Level — A Ladder", "Hard",
             "Two long vertical lines for the sides, and <strong>five</strong> horizontal rungs between them, evenly spaced. Use a loop for the rungs — do not write <code>lineTo</code> five times.",
             "canvas", '''ctx.strokeStyle = "#5a3a1a";
ctx.lineWidth = 6;

ctx.beginPath();
ctx.moveTo(100, 20);
ctx.lineTo(100, 220);
ctx.moveTo(220, 20);
ctx.lineTo(220, 220);
ctx.stroke();

for (let i = 0; i < 5; i++) {
    const y = 45 + i * 40;
    ctx.beginPath();
    ctx.moveTo(100, y);
    ctx.lineTo(220, y);
    ctx.stroke();
}''',
             expect_calls="beginPath, moveTo, lineTo, stroke"),
    ],
)
