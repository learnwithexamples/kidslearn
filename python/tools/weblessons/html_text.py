"""Lesson 2 — Text, Lists and Links."""
from build_web_lessons import section, demo, info, tip, warn, code_block, task

LESSON = dict(
    icon="🔗",
    title="Text, Lists & Links",
    subtitle="Bold, italics, bullet points, links and pictures",
    tag="Building blocks",
    card="The tags you will use most: emphasis, ordered and bulleted lists, links to other pages, and images.",
    practice_intro="Six new tags in this lesson. Use every one of them at least once and they will stick.",
    footer="A link is what makes it a <em>web</em>. 🕸️",

    sections=[
        section("✍️ Making words stand out",
            "<p>Two tags, and the difference between them matters more than it looks:</p>",
            demo("<p>This is <strong>important</strong>.</p>\n<p>This is <em>said with emphasis</em>.</p>\n<p>This is <mark>highlighted</mark>.</p>"),
            tip("🔊 Why not just &lt;b&gt; and &lt;i&gt;?",
                "<p>They exist, and they only change the <em>look</em>. <code>&lt;strong&gt;</code> and <code>&lt;em&gt;</code> change the <em>meaning</em> — a screen reader actually reads them with more force, so a blind visitor hears what you meant. Same appearance, more care.</p>")),

        section("📝 Lists",
            "<p>A list is two tags: one for the list itself, one for each item.</p>",
            "<p><strong>Bulleted</strong> — order does not matter (<code>ul</code>, for <em>unordered</em>):</p>",
            demo("<ul>\n    <li>Milk</li>\n    <li>Eggs</li>\n    <li>Dragon food</li>\n</ul>"),
            "<p><strong>Numbered</strong> — order does matter (<code>ol</code>, for <em>ordered</em>):</p>",
            demo("<ol>\n    <li>Wake up</li>\n    <li>Write some HTML</li>\n    <li>Rule the world</li>\n</ol>"),
            info("<p>You never type the bullets or the numbers. You say <em>this is a list, these are its items</em>, and the browser counts for you. Add an item in the middle of an <code>ol</code> and everything below renumbers itself.</p>")),

        section("🔗 Links",
            "<p>The tag that built the internet. <code>&lt;a&gt;</code> stands for <em>anchor</em>, and it needs an <strong>attribute</strong> to say where it goes:</p>",
            code_block('<a href="https://example.com">Visit Example</a>'),
            '''<div class="tag-anatomy">
                    <div class="tag-part"><code>href</code><span>the <strong>attribute name</strong> — "hypertext reference"</span></div>
                    <div class="tag-part"><code>"https://…"</code><span>its <strong>value</strong>, always in quotes</span></div>
                    <div class="tag-part"><code>Visit Example</code><span>the words you actually click</span></div>
                </div>''',
            demo('<p>Go and read about <a href="https://en.wikipedia.org/wiki/Octopus">octopuses</a>.</p>\n<p>Or visit <a href="html.html">another page in this folder</a>.</p>'),
            tip("📎 Two kinds of address",
                "<p>A full address starting <code>https://</code> goes anywhere on the web. A bare name like <code>about.html</code> means <em>a file sitting next to this one</em> — that is how the pages of one site link to each other.</p>")),

        section("🖼️ Pictures",
            "<p><code>&lt;img&gt;</code> is different in two ways. It has no closing tag — there is nothing to put inside it — and it needs <strong>two</strong> attributes:</p>",
            code_block('<img src="cat.jpg" alt="A ginger cat asleep on a keyboard">'),
            demo('<img src="img/example-photo.svg"\n     alt="A cartoon cat asleep on a keyboard"\n     width="120">'),
            "<p>That picture lives in a file next to this page. Change the <code>src</code> to a name that does not exist and the browser shows the <code>alt</code> text instead — which is the first reason to write one.</p>",
            warn("⚠️ alt is not optional",
                 "<p><code>alt</code> describes the picture for anyone who cannot see it — a blind visitor, or anybody whose connection dropped. Writing it is a two-second kindness, and every professional does it.</p>")),

        section("📏 A line and a break",
            "<p>Two more tags with nothing inside them:</p>",
            demo("<p>Roses are red<br>Violets are blue</p>\n<hr>\n<p>A horizontal rule divides one part from the next.</p>"),
            tip("↩️ Enter does nothing",
                "<p>Press Enter twenty times in your HTML and the browser shows one space. It collapses <em>all</em> runs of whitespace. If you want a new line, you have to ask for one — <code>&lt;br&gt;</code> for a line break, or a new <code>&lt;p&gt;</code> for a new paragraph.</p>")),

        section("✅ What you learned",
            '''<div class="takeaway-box">
                    <ul>
                        <li><code>strong</code> and <code>em</code> carry <strong>meaning</strong>, not just looks.</li>
                        <li><code>ul</code> + <code>li</code> for bullets; <code>ol</code> + <code>li</code> when the order matters.</li>
                        <li><code>&lt;a href="…"&gt;</code> makes a link. <strong>Attributes</strong> go in the opening tag, values in quotes.</li>
                        <li><code>&lt;img src="…" alt="…"&gt;</code> has no closing tag and always needs <code>alt</code>.</li>
                        <li>The browser ignores your line breaks. Use <code>&lt;br&gt;</code> or a new paragraph.</li>
                    </ul>
                </div>'''),
    ],

    tasks=[
        task("🛒", "Task 1: Shopping List", "Easy",
             "Write an <code>h1</code> saying <code>Shopping</code> and a <strong>bulleted</strong> list with three items: <code>Bread</code>, <code>Cheese</code>, <code>Apples</code>.",
             "html", "<h1>Shopping</h1>\n<ul>\n    <li>Bread</li>\n    <li>Cheese</li>\n    <li>Apples</li>\n</ul>",
             expect_tags="h1, ul, ul li", expected="Cheese"),

        task("🍳", "Task 2: A Recipe", "Easy",
             "An <code>h2</code> saying <code>How to make toast</code>, then a <strong>numbered</strong> list of three steps in the right order.",
             "html", "<h2>How to make toast</h2>\n<ol>\n    <li>Put bread in the toaster</li>\n    <li>Wait</li>\n    <li>Eat it</li>\n</ol>",
             expect_tags="h2, ol, ol li", expected="Wait"),

        task("🔗", "Task 3: Make a Link", "Medium",
             "Write a paragraph that says <code>I am learning at KidsLearn.</code> — with the words <code>KidsLearn</code> being a link to <code>../index.html</code>.",
             "html", '<p>I am learning at <a href="../index.html">KidsLearn</a>.</p>',
             expect_tags="p a[href]", expected="I am learning at KidsLearn."),
    ],

    extra=[
        task("💪", "Task 4: Strong Feelings", "Easy",
             "One paragraph containing the sentence <code>Never feed a dragon after midnight.</code> with the word <code>Never</code> in <code>&lt;strong&gt;</code> and the word <code>midnight</code> in <code>&lt;em&gt;</code>.",
             "html", "<p><strong>Never</strong> feed a dragon after <em>midnight</em>.</p>",
             expect_tags="p strong, p em", expected="Never feed a dragon after midnight."),

        task("🪺", "Task 5: A List Inside a List", "Hard",
             "Make a bulleted list with two items, <code>Fruit</code> and <code>Vegetables</code>. Inside the <code>Fruit</code> item, put <em>another</em> bulleted list with <code>Apple</code> and <code>Pear</code>. The inner <code>&lt;ul&gt;</code> goes inside the outer <code>&lt;li&gt;</code>, before its closing tag.",
             "html", '''<ul>
    <li>Fruit
        <ul>
            <li>Apple</li>
            <li>Pear</li>
        </ul>
    </li>
    <li>Vegetables</li>
</ul>''',
             expect_tags="ul li ul li", expected="Pear"),

        task("📇", "Task 6: A Tiny Profile", "Medium",
             "Build a little profile card: an <code>h1</code> with a name, an <code>&lt;img&gt;</code> with any <code>src</code> and a proper <code>alt</code>, a paragraph, a horizontal rule, and a link to <code>https://example.com</code>.",
             "html", '''<h1>Ada</h1>
<img src="ada.jpg" alt="A portrait of Ada" width="90">
<p>Writes programs for machines that do not exist yet.</p>
<hr>
<a href="https://example.com">Her website</a>''',
             expect_tags="h1, img[alt], p, hr, a[href]"),

        task("📜", "Task 7: Boss Level — The Whole Page", "Hard",
             "A complete page (doctype and all) titled <code>My Top Three</code>. In the body: an <code>h1</code>, a numbered list of your three favourite things, and a final paragraph with a link in it. Every tag properly closed.",
             "page", '''<!DOCTYPE html>
<html>
<head>
    <title>My Top Three</title>
</head>
<body>
    <h1>My Top Three</h1>
    <ol>
        <li>Octopuses</li>
        <li>Thunderstorms</li>
        <li>Toast</li>
    </ol>
    <p>Read more at <a href="https://example.com">Example</a>.</p>
</body>
</html>''',
             expect_tags="html, head, title, body, h1, ol li, p a[href]"),
    ],
)
