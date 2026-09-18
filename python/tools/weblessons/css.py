"""Lesson 3 - Colour and Style with CSS."""
from build_web_lessons import section, demo, info, tip, warn, code_block, task

LESSON = dict(
    icon="🎨",
    title="Colour & Style",
    subtitle="CSS: telling the browser how your page should look",
    tag="Make it yours",
    card="Colours, sizes, spacing and borders. One stylesheet can restyle a hundred pages at once.",
    practice_intro="Every task here is about making something look the way you want. There is no single right answer — but there is a rule to get right each time.",
    footer="HTML is the bones. CSS is everything else. 🎨",

    sections=[
        section("🖌️ HTML says what. CSS says how.",
            info("<p>Your pages so far have used the browser's own taste: black text, blue links, Times New Roman. <strong>CSS</strong> is how you override that. It stands for <em>Cascading Style Sheets</em>, and a rule looks like this:</p>"),
            code_block('''h1 {
    color: crimson;
    font-size: 40px;
}'''),
            '''<div class="tag-anatomy">
                    <div class="tag-part"><code>h1</code><span>the <strong>selector</strong> — which elements</span></div>
                    <div class="tag-part"><code>color</code><span>the <strong>property</strong> — what about them</span></div>
                    <div class="tag-part"><code>crimson</code><span>the <strong>value</strong> — how it should be</span></div>
                </div>''',
            "<p>Read it as a sentence: <em>every h1 on this page has crimson text at 40 pixels.</em></p>"),

        section("📍 Where the CSS goes",
            "<p>Put your rules inside a <code>&lt;style&gt;</code> tag, up in the <code>&lt;head&gt;</code>:</p>",
            demo('''<style>
    h1 { color: crimson; }
    p  { color: #2c6e49; font-size: 18px; }
</style>

<h1>Styled at last</h1>
<p>And this paragraph is green.</p>'''),
            tip("🎯 One rule, every match",
                "<p>Write <code>p { color: green }</code> once and <em>every</em> paragraph turns green — ten of them, or a thousand. That is the whole reason CSS is separate from HTML: say it once, apply it everywhere.</p>")),

        section("🌈 Colours",
            "<p>Three ways to name one, and they all work:</p>",
            demo('''<style>
    .one   { color: tomato; }
    .two   { color: #1a5490; }
    .three { color: rgb(46, 139, 87); }
</style>

<p class="one">A name — about 140 of them exist</p>
<p class="two">A hex code — # then red, green, blue</p>
<p class="three">rgb() — three numbers from 0 to 255</p>'''),
            "<p>Names are easiest to start with. Hex codes turn up everywhere once you start copying colours from designs, so it is worth knowing that <code>#1a5490</code> means <code>1a</code> red, <code>54</code> green, <code>90</code> blue.</p>"),

        section("🏷️ Picking exactly what you want",
            "<p><code>h1</code> selects every h1. But often you want <em>this one particular thing</em>. Give it a <strong>class</strong>:</p>",
            demo('''<style>
    .warning { color: white; background: crimson; padding: 8px; }
    .calm    { color: white; background: seagreen; padding: 8px; }
</style>

<p class="warning">Dragon loose in the building</p>
<p class="calm">Dragon has been given a biscuit</p>
<p>An ordinary paragraph, untouched.</p>'''),
            info("<p>In the HTML you write <code>class=\"warning\"</code>. In the CSS you write <code>.warning</code> with a dot in front. The dot means <em>this is a class name, not a tag name</em>.</p>"),
            tip("🔁 A class can be used as often as you like",
                "<p>Twenty elements can all be <code>class=\"warning\"</code>. That is the point — name a <em>kind</em> of thing once, then apply it wherever it belongs.</p>")),

        section("📦 Boxes: space, borders and backgrounds",
            "<p>Every element is a rectangle, whether it looks like one or not. Four properties control the rectangle:</p>",
            demo('''<style>
    .card {
        background: #eef6fb;
        border: 3px solid #1a5490;
        padding: 14px;
        margin: 10px;
        border-radius: 10px;
    }
</style>

<div class="card">
    <h2>A card</h2>
    <p>padding is space INSIDE the border.</p>
    <p>margin is space OUTSIDE it.</p>
</div>'''),
            '''<ul>
                    <li><code>background</code> — the colour behind it</li>
                    <li><code>border</code> — thickness, style, colour, in that order</li>
                    <li><code>padding</code> — breathing room <em>inside</em> the border</li>
                    <li><code>margin</code> — space pushing other things <em>away</em></li>
                </ul>''',
            warn("😖 The one everybody muddles",
                 "<p>padding is inside, margin is outside. If your text is squashed against its own border you want <strong>padding</strong>. If two boxes are touching each other you want <strong>margin</strong>.</p>")),

        section("📐 &lt;div&gt; and &lt;span&gt;: boxes with no opinions",
            "<p>Sometimes you need a container that means nothing at all, just so you can style a group of things. That is <code>&lt;div&gt;</code> (a block, on its own lines) and <code>&lt;span&gt;</code> (inline, inside a sentence).</p>",
            demo('''<style>
    .box  { border: 2px dashed #888; padding: 10px; }
    .shout { color: crimson; font-weight: bold; }
</style>

<div class="box">
    <p>Everything in here is grouped.</p>
    <p>I can move or style the whole lot at once.</p>
</div>
<p>And you can highlight <span class="shout">just these words</span> mid-sentence.</p>''')),

        section("✅ What you learned",
            '''<div class="takeaway-box">
                    <ul>
                        <li>A rule is <strong>selector { property: value; }</strong> — put them in <code>&lt;style&gt;</code>.</li>
                        <li>A tag selector styles every one; a <strong>class</strong> (<code>.name</code>) styles the ones you choose.</li>
                        <li>Colours can be names, <code>#hex</code>, or <code>rgb()</code>.</li>
                        <li><code>padding</code> is inside the border, <code>margin</code> is outside it.</li>
                        <li><code>div</code> and <code>span</code> are containers with no meaning — handy for grouping.</li>
                    </ul>
                </div>'''),
    ],

    tasks=[
        task("🎨", "Task 1: Colour a Heading", "Easy",
             "Write a <code>&lt;style&gt;</code> block that makes every <code>h1</code> the colour <code>darkorange</code>, then an <code>h1</code> saying <code>Bright Ideas</code>.",
             "html", "<style>\n    h1 { color: darkorange; }\n</style>\n\n<h1>Bright Ideas</h1>",
             expect_tags="style, h1", expected="Bright Ideas"),

        task("🏷️", "Task 2: Two Classes", "Medium",
             "Make two classes, <code>.good</code> (green text) and <code>.bad</code> (red text). Then write two paragraphs, one of each class.",
             "html", '''<style>
    .good { color: seagreen; }
    .bad  { color: crimson; }
</style>

<p class="good">This went well.</p>
<p class="bad">This did not.</p>''',
             expect_tags="style, p.good, p.bad"),

        task("📦", "Task 3: Build a Card", "Medium",
             "Make a <code>&lt;div class=\"card\"&gt;</code> holding an <code>h2</code> and a paragraph. Style <code>.card</code> with a background colour, a <code>border</code>, and <code>padding</code> of at least 10px.",
             "html", '''<style>
    .card {
        background: #eef6fb;
        border: 3px solid #1a5490;
        padding: 14px;
        border-radius: 10px;
    }
</style>

<div class="card">
    <h2>My Card</h2>
    <p>Nicely boxed.</p>
</div>''',
             expect_tags="style, div.card, div.card h2, div.card p"),
    ],

    extra=[
        task("🖍️", "Task 4: Three Colours, Three Ways", "Medium",
             "Three paragraphs. Colour the first with a colour <strong>name</strong>, the second with a <code>#hex</code> code, and the third with <code>rgb()</code>. Use a class for each.",
             "html", '''<style>
    .one   { color: tomato; }
    .two   { color: #1a5490; }
    .three { color: rgb(46, 139, 87); }
</style>

<p class="one">By name</p>
<p class="two">By hex</p>
<p class="three">By rgb</p>''',
             expect_tags="p.one, p.two, p.three"),

        task("🔤", "Task 5: Highlight One Word", "Medium",
             "Write a paragraph containing the sentence <code>The password is swordfish.</code> — with just the word <code>swordfish</code> inside a <code>&lt;span&gt;</code> that has a yellow background.",
             "html", '''<style>
    .secret { background: gold; padding: 2px 5px; }
</style>

<p>The password is <span class="secret">swordfish</span>.</p>''',
             expect_tags="p span", expected="The password is swordfish."),

        task("🧱", "Task 6: Padding vs Margin", "Hard",
             "Two divs, both with the class <code>.block</code> — a border and a background. Give <code>.block</code> <code>padding: 20px</code> so the text is not squashed, and <code>margin: 20px</code> so the two boxes do not touch. Put a paragraph inside each.",
             "html", '''<style>
    .block {
        border: 3px solid #333;
        background: #f4f4f4;
        padding: 20px;
        margin: 20px;
    }
</style>

<div class="block"><p>First box</p></div>
<div class="block"><p>Second box</p></div>''',
             expect_tags="div.block, div.block p"),

        task("🏆", "Task 7: Boss Level — A Styled Page", "Hard",
             "A complete page (doctype and all) titled <code>My Styled Page</code>. Give it a <code>&lt;style&gt;</code> in the head that sets the <code>body</code> background to something soft, styles <code>h1</code>, and defines a <code>.card</code> class. In the body: an <code>h1</code> and two cards, each with a heading and a paragraph.",
             "page", '''<!DOCTYPE html>
<html>
<head>
    <title>My Styled Page</title>
    <style>
        body { background: #fdf6e3; font-family: sans-serif; }
        h1   { color: #1a5490; }
        .card {
            background: #fff;
            border: 2px solid #1a5490;
            border-radius: 10px;
            padding: 14px;
            margin: 12px 0;
        }
    </style>
</head>
<body>
    <h1>My Styled Page</h1>
    <div class="card"><h2>One</h2><p>First card.</p></div>
    <div class="card"><h2>Two</h2><p>Second card.</p></div>
</body>
</html>''',
             expect_tags="html, head, title, style, body, h1, div.card h2, div.card p"),
    ],
)
