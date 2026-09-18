"""Lesson 8 - Circles, Loops and Art."""
from build_web_lessons import section, demo, info, tip, warn, code_block, task

LESSON = dict(
    icon="🎨",
    title="Circles, Loops & Art",
    subtitle="Where a loop and a canvas together make something you could not draw by hand",
    tag="Finale 🏆",
    card="Circles with arc(), then loops that draw a hundred shapes from four lines of code — and a final project.",
    practice_intro="The last set. Every task here is a picture built by a loop, which is the whole trick of drawing with code.",
    footer="You wrote a program that made a picture. That is computer graphics. 🎨🏆",

    sections=[
        section("⭕ Circles",
            "<p>There is no <code>circle()</code>. There is <code>arc()</code>, which draws a slice of a circle — and a whole circle is just a slice that goes all the way round.</p>",
            demo('''const ctx = document.getElementById("board").getContext("2d");

ctx.fillStyle = "crimson";
ctx.beginPath();
ctx.arc(80, 120, 50, 0, Math.PI * 2);
ctx.fill();

ctx.strokeStyle = "#1a5490";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.arc(220, 120, 50, 0, Math.PI * 2);
ctx.stroke();''', kind="canvas"),
            '''<div class="tag-anatomy">
                    <div class="tag-part"><code>80, 120</code><span>the <strong>middle</strong> of the circle</span></div>
                    <div class="tag-part"><code>50</code><span>the <strong>radius</strong> — half the width</span></div>
                    <div class="tag-part"><code>0, Math.PI * 2</code><span>start angle, end angle</span></div>
                </div>''',
            info("<p><code>Math.PI * 2</code> is a full turn, measured in radians. You do not have to understand radians to use it — <code>0, Math.PI * 2</code> means <em>all the way round</em>, and that is the only pair you need for a whole circle.</p>"),
            tip("🍕 Half a turn is a semicircle",
                "<p>Try <code>0, Math.PI</code> instead and you get half. <code>0, Math.PI / 2</code> gives you a quarter — a pie slice, once you <code>fill()</code> it.</p>")),

        section("🔁 The trick: a loop that draws",
            info("<p>Here is where drawing with code beats drawing by hand. You do not write a hundred shapes. You write <strong>one</strong> shape and a loop that moves it.</p>"),
            demo('''const ctx = document.getElementById("board").getContext("2d");

for (let i = 0; i < 10; i++) {
    ctx.fillStyle = "#1a5490";
    ctx.fillRect(10 + i * 30, 100, 20, 40);
}''', kind="canvas"),
            "<p>The whole picture is <code>10 + i * 30</code>. As <code>i</code> counts 0, 1, 2, the x jumps 10, 40, 70 — evenly spaced, for free. Change the 10 to 30 and every square moves at once.</p>",
            demo('''const ctx = document.getElementById("board").getContext("2d");

for (let i = 0; i < 12; i++) {
    ctx.fillStyle = `hsl(${i * 30}, 80%, 55%)`;
    ctx.beginPath();
    ctx.arc(30 + i * 22, 120, 10 + i * 2, 0, Math.PI * 2);
    ctx.fill();
}''', kind="canvas"),
            tip("🌈 hsl() is the easy rainbow",
                "<p><code>hsl(hue, saturation, lightness)</code> — the hue is an angle round a colour wheel from 0 to 360. Multiply it by the loop counter and you get a rainbow without picking a single colour by hand.</p>")),

        section("🔲 A loop inside a loop",
            "<p>One loop gives you a row. A loop inside a loop gives you a grid.</p>",
            demo('''const ctx = document.getElementById("board").getContext("2d");

for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 0) {
            ctx.fillStyle = "#2c3e50";
        } else {
            ctx.fillStyle = "#e8e8e8";
        }
        ctx.fillRect(col * 40, row * 40, 40, 40);
    }
}''', kind="canvas"),
            info("<p>Forty-eight squares from eight lines. The chessboard pattern is the <code>(row + col) % 2</code> — neighbouring squares always differ by one, so they always land on opposite colours.</p>")),

        section("🎲 A bit of randomness",
            demo('''const ctx = document.getElementById("board").getContext("2d");

for (let i = 0; i < 40; i++) {
    const x = Math.random() * 320;
    const y = Math.random() * 240;
    const size = Math.random() * 20 + 4;

    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}''', kind="canvas"),
            "<p><code>Math.random()</code> gives a number from 0 up to 1. Multiply it to stretch it: <code>Math.random() * 320</code> lands anywhere across the canvas.</p>",
            tip("🔄 Run it twice",
                "<p>Press Run again and you get a different picture from exactly the same code. Every run is a new one — which is how every starfield and every snowstorm in every game is made.</p>")),

        section("🧰 Wrapping a shape in a function",
            "<p>Once a shape has a name you can scatter it about without repeating yourself:</p>",
            demo('''const ctx = document.getElementById("board").getContext("2d");

function star(x, y, size, colour) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
        const angle = i * Math.PI / 5 - Math.PI / 2;
        const reach = (i % 2 === 0) ? size : size / 2.4;
        ctx.lineTo(x + Math.cos(angle) * reach, y + Math.sin(angle) * reach);
    }
    ctx.closePath();
    ctx.fill();
}

star(70, 80, 40, "gold");
star(180, 140, 55, "crimson");
star(270, 60, 30, "#4a90d9");''', kind="canvas"),
            info("<p>Three stars, three sizes, three colours — and the shape itself is written once. That is the same idea as Lesson 5's functions, pointed at a picture.</p>")),

        section("✅ What you learned",
            '''<div class="takeaway-box">
                    <ul>
                        <li><code>arc(x, y, radius, 0, Math.PI * 2)</code> is a whole circle — wrap it in <code>beginPath</code> and <code>fill</code>.</li>
                        <li>A loop plus <code>i * spacing</code> makes a row; a loop inside a loop makes a grid.</li>
                        <li><code>hsl(hue, …)</code> gives you a rainbow from the loop counter.</li>
                        <li><code>Math.random()</code> gives 0 to 1 — multiply to stretch it.</li>
                        <li>A shape in a <strong>function</strong> can be used anywhere, at any size.</li>
                    </ul>
                </div>'''),
    ],

    tasks=[
        task("⭕", "Task 1: One Circle", "Easy",
             "Draw one filled circle in the middle of the canvas — the middle of 320×240 is (160, 120) — with a radius of 60. Any colour.",
             "canvas", 'ctx.fillStyle = "crimson";\nctx.beginPath();\nctx.arc(160, 120, 60, 0, Math.PI * 2);\nctx.fill();',
             expect_calls="beginPath, arc, fill"),

        task("🚦", "Task 2: Traffic Lights", "Medium",
             "A dark rectangle standing upright, with three circles down it — red, amber and green. Each circle needs its own <code>beginPath</code>.",
             "canvas", '''ctx.fillStyle = "#2c3e50";
ctx.fillRect(120, 20, 80, 200);

const colours = ["crimson", "orange", "seagreen"];
for (let i = 0; i < 3; i++) {
    ctx.fillStyle = colours[i];
    ctx.beginPath();
    ctx.arc(160, 60 + i * 60, 24, 0, Math.PI * 2);
    ctx.fill();
}''',
             expect_calls="fillRect, beginPath, arc, fill"),

        task("🔁", "Task 3: A Row of Circles", "Medium",
             "Use a <strong>loop</strong> to draw eight circles in a row across the canvas, evenly spaced, all the same size. Do not write <code>arc</code> eight times.",
             "canvas", '''ctx.fillStyle = "#1a5490";
for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(25 + i * 40, 120, 16, 0, Math.PI * 2);
    ctx.fill();
}''',
             expect_calls="beginPath, arc, fill"),
    ],

    extra=[
        task("🌈", "Task 4: A Rainbow Row", "Medium",
             "Twelve rectangles in a row, each a different colour. Use <code>hsl(${i * 30}, 80%, 55%)</code> inside backticks so the loop counter picks the colour for you.",
             "canvas", '''for (let i = 0; i < 12; i++) {
    ctx.fillStyle = `hsl(${i * 30}, 80%, 55%)`;
    ctx.fillRect(i * 27, 60, 25, 120);
}''',
             expect_calls="fillRect"),

        task("🏁", "Task 5: A Chessboard", "Hard",
             "A loop inside a loop, drawing an 8 by 6 grid of 40-pixel squares that alternate between two colours. The test is <code>(row + col) % 2 === 0</code>.",
             "canvas", '''for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? "#2c3e50" : "#e8e8e8";
        ctx.fillRect(col * 40, row * 40, 40, 40);
    }
}''',
             expect_calls="fillRect"),

        task("✨", "Task 6: A Starry Sky", "Medium",
             "Fill the whole canvas with a dark colour, then use a loop to scatter 50 small white circles at random positions with <code>Math.random()</code>.",
             "canvas", '''ctx.fillStyle = "#0b1026";
ctx.fillRect(0, 0, 320, 240);

ctx.fillStyle = "white";
for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 320, Math.random() * 240, Math.random() * 2 + 1, 0, Math.PI * 2);
    ctx.fill();
}''',
             expect_calls="fillRect, beginPath, arc, fill"),

        task("🎯", "Task 7: A Target", "Hard",
             "Five circles all with the same middle, each smaller than the last, alternating red and white. A loop, counting <em>down</em> in size — draw the biggest first or the small ones vanish underneath.",
             "canvas", '''for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? "crimson" : "white";
    ctx.beginPath();
    ctx.arc(160, 120, 100 - i * 20, 0, Math.PI * 2);
    ctx.fill();
}''',
             expect_calls="beginPath, arc, fill"),

        task("🏆", "Task 8: Boss Level — A Scene", "Hard",
             "Put it all together. Draw a picture with: a filled background, at least one <strong>rectangle</strong>, at least one <strong>circle</strong>, something drawn with a <strong>loop</strong>, and your name in <strong>text</strong>. A house under a sun with a fence, a rocket in a starfield — whatever you like.",
             "canvas", '''ctx.fillStyle = "#87ceeb";
ctx.fillRect(0, 0, 320, 240);

ctx.fillStyle = "gold";
ctx.beginPath();
ctx.arc(265, 45, 30, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "#6b8e23";
ctx.fillRect(0, 180, 320, 60);

ctx.fillStyle = "#e8d5a3";
ctx.fillRect(60, 110, 120, 80);
ctx.fillStyle = "#a83232";
ctx.beginPath();
ctx.moveTo(48, 110);
ctx.lineTo(120, 60);
ctx.lineTo(192, 110);
ctx.closePath();
ctx.fill();

ctx.strokeStyle = "#5a3a1a";
ctx.lineWidth = 4;
for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(200 + i * 15, 165);
    ctx.lineTo(200 + i * 15, 200);
    ctx.stroke();
}

ctx.fillStyle = "#111";
ctx.font = "bold 18px sans-serif";
ctx.fillText("by Maya", 12, 28);''',
             expect_calls="fillRect, arc, fill, fillText"),
    ],
)
