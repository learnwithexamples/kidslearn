"""Lesson 1 — Your First Web Page."""
from build_web_lessons import section, demo, info, tip, warn, code_block, task

LESSON = dict(
    icon="🌐",
    title="Your First Web Page",
    subtitle="Tags, elements, and the skeleton every web page shares",
    tag="Start here ✨",
    card="What HTML actually is, how a tag works, and the six lines every single web page begins with.",
    practice_intro="Write real HTML and watch your page appear beside it. There is no way to break anything — press Run as often as you like.",
    footer="Right-click any website and choose View Source. It is all just this. 🌐",

    sections=[
        section("🏷️ HTML is labelling, not programming",
            info("<p>Imagine writing out a story and then going back with a highlighter: <em>this bit is the title</em>, <em>this bit is a paragraph</em>, <em>this bit is a picture</em>. That is all HTML is. You write the words, then you label each piece so the browser knows what it is looking at.</p>"),
            "<p>The labels are called <strong>tags</strong>, and they come in pairs that wrap around the thing they describe:</p>",
            demo("<h1>Dragons</h1>\n<p>Dragons are large and usually on fire.</p>",
                 label="↓ and here is what the browser makes of it"),
            "<p>You did not tell the browser to make the title big and bold. You told it <em>this is a heading</em>, and it already knew what headings look like.</p>"),

        section("🔎 The parts of a tag",
            "<p>Every element has the same three parts:</p>",
            '''<div class="tag-anatomy">
                    <div class="tag-part"><code>&lt;p&gt;</code><span>the <strong>opening tag</strong> — "a paragraph starts here"</span></div>
                    <div class="tag-part"><code>Hello!</code><span>the <strong>content</strong> — whatever goes inside</span></div>
                    <div class="tag-part"><code>&lt;/p&gt;</code><span>the <strong>closing tag</strong> — note the slash</span></div>
                </div>''',
            "<p>Put together, one <strong>element</strong>:</p>",
            code_block("<p>Hello!</p>"),
            tip("📌 The slash is the whole difference",
                "<p><code>&lt;p&gt;</code> opens. <code>&lt;/p&gt;</code> closes. Forget the slash and the browser keeps waiting for the paragraph to end — and everything after it joins in.</p>")),

        section("📐 Headings come in six sizes",
            "<p><code>h1</code> is the biggest and most important, down to <code>h6</code>. Use <code>h1</code> for the name of the page, and the smaller ones for sections inside it.</p>",
            demo("<h1>h1 — the title of the page</h1>\n<h2>h2 — a big section</h2>\n<h3>h3 — a smaller one</h3>\n<p>And a p for ordinary writing.</p>"),
            warn("⚠️ Size is not the point",
                 "<p>It is tempting to pick <code>h3</code> because you like the size. Pick by <em>importance</em> instead — a page with its headings in order is one a blind reader's screen reader can navigate, and one Google can understand.</p>")),

        section("🦴 The skeleton",
            "<p>So far you have written the interesting bit. A complete page wraps it in a little skeleton that every web page in the world shares:</p>",
            code_block('''<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello!</h1>
</body>
</html>'''),
            '''<ul>
                    <li><code>&lt;!DOCTYPE html&gt;</code> — "this is a modern web page". Not really a tag; just say it first.</li>
                    <li><code>&lt;html&gt;</code> — everything lives inside this one.</li>
                    <li><code>&lt;head&gt;</code> — facts <em>about</em> the page. Nobody sees these.</li>
                    <li><code>&lt;title&gt;</code> — the name on the browser tab.</li>
                    <li><code>&lt;body&gt;</code> — everything you can actually see.</li>
                </ul>''',
            tip("🪆 Tags nest like Russian dolls",
                "<p><code>&lt;body&gt;</code> is inside <code>&lt;html&gt;</code>, and your <code>&lt;h1&gt;</code> is inside <code>&lt;body&gt;</code>. Whatever opens last must close first — never <code>&lt;b&gt;&lt;i&gt;text&lt;/b&gt;&lt;/i&gt;</code>.</p>")),

        section("💬 Notes to yourself",
            "<p>Anything between <code>&lt;!--</code> and <code>--&gt;</code> is a <strong>comment</strong>. The browser skips it entirely — it is there for the humans.</p>",
            demo("<h1>Party</h1>\n<!-- remember to add the date here -->\n<p>Bring cake.</p>"),
            "<p>Real pages are full of them. Leave notes for the person who reads your code next — which is usually you, three weeks later.</p>"),

        section("✅ What you learned",
            '''<div class="takeaway-box">
                    <ul>
                        <li>HTML <strong>labels</strong> pieces of a page; the browser already knows how each label should look.</li>
                        <li>An element is an <strong>opening tag</strong>, <strong>content</strong>, and a <strong>closing tag</strong> with a slash.</li>
                        <li><code>h1</code>–<code>h6</code> for headings, <code>p</code> for paragraphs.</li>
                        <li>Every page has the same skeleton: doctype, <code>html</code>, <code>head</code>, <code>body</code>.</li>
                        <li>Tags <strong>nest</strong> — last opened, first closed.</li>
                    </ul>
                </div>'''),
    ],

    tasks=[
        task("👋", "Task 1: Say Hello", "Easy",
             "Write a heading that says <code>Hello, world!</code> and a paragraph underneath saying <code>I am building a web page.</code>",
             "html", "<h1>Hello, world!</h1>\n<p>I am building a web page.</p>",
             expect_tags="h1, p", expected="Hello, world!"),

        task("🐉", "Task 2: A Page About Anything", "Easy",
             "Pick something you like. Give it an <code>h1</code> with its name, then an <code>h2</code> saying <code>Why it is great</code>, then a paragraph of your own words underneath.",
             "html", "<h1>Dragons</h1>\n<h2>Why it is great</h2>\n<p>They can fly and they are on fire.</p>",
             expect_tags="h1, h2, p", expected="Why it is great"),

        task("🦴", "Task 3: The Whole Skeleton", "Medium",
             "This time write the <strong>complete</strong> page — doctype, <code>html</code>, <code>head</code> with a <code>title</code> of <code>My First Page</code>, and a <code>body</code> holding an <code>h1</code> that says <code>It works!</code>",
             "page", '''<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>It works!</h1>
</body>
</html>''',
             expect_tags="html, head, title, body, h1", expected="It works!"),
    ],

    extra=[
        task("📚", "Task 4: Three Sections", "Easy",
             "Write an <code>h1</code> called <code>My Week</code>, then three <code>h2</code> headings — <code>Monday</code>, <code>Tuesday</code>, <code>Wednesday</code> — each with a paragraph after it saying anything you like.",
             "html", '''<h1>My Week</h1>
<h2>Monday</h2>
<p>Swimming.</p>
<h2>Tuesday</h2>
<p>Piano.</p>
<h2>Wednesday</h2>
<p>Nothing at all.</p>''',
             expect_tags="h1, h2, p", expected="Wednesday"),

        task("🔧", "Task 5: Fix the Broken Tag", "Medium",
             "Type this out, but <strong>fix the mistake</strong> first — one closing tag has no slash, so the browser never learns the paragraph ended:<br><code>&lt;h1&gt;Broken&lt;/h1&gt; &lt;p&gt;This paragraph never ends.&lt;p&gt;</code>",
             "html", "<h1>Broken</h1>\n<p>This paragraph never ends.</p>",
             expect_tags="h1, p", expected="This paragraph never ends."),

        task("💬", "Task 6: Leave a Note", "Easy",
             "Write an <code>h1</code> saying <code>Secret Plans</code> and a paragraph saying <code>Step one: learn HTML.</code> — and put an HTML comment between them that nobody will see on the page.",
             "html", "<h1>Secret Plans</h1>\n<!-- step two is a secret -->\n<p>Step one: learn HTML.</p>",
             expect_tags="h1, p", expected="Step one: learn HTML."),

        task("🪆", "Task 7: Boss Level — Nesting", "Hard",
             "Write a complete page (doctype and all). Its <code>title</code> should be <code>Nesting Practice</code>. In the body put an <code>h1</code> saying <code>Inside Out</code>, and a paragraph containing the words <code>this bit is bold</code> wrapped in <code>&lt;strong&gt;</code> tags — inside the paragraph, not around it.",
             "page", '''<!DOCTYPE html>
<html>
<head>
    <title>Nesting Practice</title>
</head>
<body>
    <h1>Inside Out</h1>
    <p>Look, <strong>this bit is bold</strong> and this bit is not.</p>
</body>
</html>''',
             expect_tags="html, head, title, body, h1, p strong", expected="this bit is bold"),
    ],
)
