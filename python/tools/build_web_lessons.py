#!/usr/bin/env python3
"""Build the Web Coding track: the hub page and every lesson.

    python3 python/tools/build_web_lessons.py

Nine pages share one shape - tabs, a Description panel, a Practice panel full
of playgrounds - and writing that shape out nine times by hand is how pages
drift apart. So each lesson is described once, in weblessons/<slug>.py, and
this renders them.

The lessons themselves are ordinary HTML afterwards, exactly like the Python
lessons next to them. Regenerate rather than editing the .html by hand.
"""

import html
import importlib
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent
sys.path.insert(0, str(HERE))

# The order the lessons appear, and the order they are meant to be done in.
ORDER = ["html", "html-text", "css", "js", "js-logic", "dom", "canvas", "canvas-art"]


# --------------------------------------------------------------- the pieces

def code_block(text, kind="out"):
    """A block of code to read, not to run."""
    return '<div class="code-block">%s</div>' % html.escape(text)


def demo(source, kind="html", label="Try it — this is live", tall=False):
    """A worked example that really runs, right there in the lesson."""
    return ('<div class="web-demo%s" data-kind="%s">\n'
            '    <code class="demo-code">%s</code>\n'
            '    <span class="demo-label">%s</span>\n'
            '    <iframe class="web-preview" title="Example" sandbox="allow-scripts"></iframe>\n'
            '</div>' % (" demo-tall" if tall else "", kind, html.escape(source), label))


def info(body):
    return '<div class="info-box">%s</div>' % body


def tip(title, body):
    return '<div class="tip-box"><h4>%s</h4>%s</div>' % (title, body)


def warn(title, body):
    return '<div class="warn-box"><h4>%s</h4>%s</div>' % (title, body)


def section(heading, *blocks):
    """One chunk of the Description tab."""
    return ('            <section class="lesson-section">\n'
            '                <h2>%s</h2>\n%s\n'
            '            </section>' % (heading, "\n".join("                " + b for b in blocks)))


def task(badge, title, difficulty, goal, kind, solution, **checks):
    """One playground in the Practice tab.

    INPUT:  badge/title/difficulty/goal - what the student reads
            kind - page, html, js or canvas (see web-playground.js)
            solution - the reference answer behind the Solution button
            checks - expected, check, expect_tags, expect_calls
    """
    attrs = ['data-kind="%s"' % kind]
    for name, value in (("expected", checks.get("expected")),
                        ("check", checks.get("check")),
                        ("expect-tags", checks.get("expect_tags")),
                        ("expect-calls", checks.get("expect_calls"))):
        if value:
            attrs.append('data-%s="%s"' % (name, html.escape(value, quote=True)))

    level = {"Easy": "diff-easy", "Medium": "diff-medium", "Hard": "diff-hard"}[difficulty]

    return '''            <div class="task" %s>
                <div class="task-head">
                    <span class="task-badge">%s</span>
                    <h3>%s</h3>
                    <span class="task-difficulty %s">%s</span>
                </div>
                <p class="task-goal">%s</p>
                <div class="playground web-playground">
                    <textarea class="code-input" spellcheck="false" aria-label="Your code"></textarea>
                    <div class="pg-buttons">
                        <button class="run-btn">▶ Run</button>
                        <button class="check-btn">✓ Check</button>
                        <button class="reset-btn">↺ Reset</button>
                        <button class="solution-btn">💡 Solution</button>
                    </div>
                    <div class="web-stage">
                        <iframe class="web-preview" title="Your page" sandbox="allow-scripts"></iframe>
                    </div>
                    <pre class="pg-output" aria-live="polite"></pre>
                </div>
                <div class="solution" hidden>
                    <pre>%s</pre>
                </div>
            </div>''' % (" ".join(attrs), badge, html.escape(title), level, difficulty,
                         goal, html.escape(solution))


# ---------------------------------------------------------------- the pages

SHELL = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s</title>
    <link rel="stylesheet" href="../styles/main.css">
%s</head>
<body>
    <div class="container">
%s    </div>
%s</body>
</html>
'''

LESSON_STYLES = ('    <link rel="stylesheet" href="../styles/grammar-lesson.css">\n'
                 '    <link rel="stylesheet" href="../styles/python.css">\n'
                 '    <link rel="stylesheet" href="../styles/web.css">\n')

HUB_STYLES = ('    <link rel="stylesheet" href="../styles/python.css">\n'
              '    <link rel="stylesheet" href="../styles/web.css">\n')


def lesson_nav(index, lessons):
    """Previous and next, so a reader never has to go back to the hub."""
    links = []
    if index > 0:
        before = lessons[index - 1]
        links.append('<a href="web-%s.html">← Lesson %d: %s</a>'
                     % (before["slug"], before["number"], html.escape(before["title"])))
    else:
        links.append('<a href="web.html">← Web Coding Hub</a>')

    if index < len(lessons) - 1:
        after = lessons[index + 1]
        links.append('<a href="web-%s.html">Lesson %d: %s →</a>'
                     % (after["slug"], after["number"], html.escape(after["title"])))
    else:
        links.append('<a href="web.html">Back to the Web Coding Hub →</a>')

    return ('        <div class="lesson-nav">\n            %s\n        </div>'
            % "\n            ".join(links))


def build_lesson(lesson, index, lessons):
    """Write one lesson page."""
    body = '''        <header>
            <h1>%s Lesson %d: %s</h1>
            <p class="subtitle">%s</p>
            <a href="web.html" class="back-link">← Back to Web Coding</a>
        </header>

        <div class="lesson-tabs">
            <button class="lesson-tab active" data-panel="description">📖 Description</button>
            <button class="lesson-tab" data-panel="practice">🎮 Practice</button>
        </div>

        <!-- ============ DESCRIPTION ============ -->
        <div id="description" class="tab-panel">
%s
        </div>

        <!-- ============ PRACTICE ============ -->
        <div id="practice" class="tab-panel" style="display:none;">
            <div class="practice-intro">
                <h2>🎮 Time to Practice!</h2>
                <p>%s</p>
            </div>

%s

            <div class="practice-intro">
                <h2>🏋️ Extra Practice — Drill Time!</h2>
                <p>This is where it sticks. Try every one — and if you get stuck, read your own earlier answers before you peek.</p>
            </div>

%s
        </div>

%s

        <footer>
            <p>%s</p>
        </footer>
''' % (lesson["icon"], lesson["number"], html.escape(lesson["title"]), lesson["subtitle"],
       "\n\n".join(lesson["sections"]), lesson["practice_intro"],
       "\n\n".join(lesson["tasks"]), "\n\n".join(lesson["extra"]),
       lesson_nav(index, lessons), lesson["footer"])

    page = SHELL % ("Lesson %d: %s - Web Coding - KidsLearn" % (lesson["number"], lesson["title"]),
                    LESSON_STYLES, body,
                    '    <script src="../scripts/web-playground.js"></script>\n')
    (OUT / ("web-%s.html" % lesson["slug"])).write_text(page, encoding="utf-8")
    return "web-%s.html" % lesson["slug"]


def build_hub(lessons):
    """Write the track hub, with a card for every lesson."""
    cards = []
    for lesson in lessons:
        cards.append('''                <a href="web-%s.html" class="lesson-card">
                    <span class="lesson-number">%d</span>
                    <h3>%s</h3>
                    <p>%s</p>
                    <span class="lesson-tag">%s</span>
                </a>''' % (lesson["slug"], lesson["number"], html.escape(lesson["title"]),
                           lesson["card"], lesson["tag"]))

    body = '''        <header>
            <h1>🌐 Web Coding</h1>
            <p class="subtitle">Build real web pages with HTML, CSS and JavaScript — and draw with code</p>
            <a href="python.html" class="back-link">← Back to Python Hub</a>
        </header>

        <main>
            <div class="course-intro">
                <h2>👋 Every website you have ever used is made of three things</h2>
                <p><strong>HTML</strong> puts things on the page — headings, pictures, buttons. <strong>CSS</strong> decides how they look. <strong>JavaScript</strong> makes them <em>do</em> something when you click. That is it. Every site you know is those three, stacked up.</p>
                <p>And here is the lovely part: you already own the tools. The browser you are reading this in can run every line of code you write. Nothing to install, nothing to buy.</p>
                <p>Each lesson has a <strong>📖 Description</strong> tab that explains an idea with examples you can see running, and a <strong>🎮 Practice</strong> tab where you write code and watch your own page appear beside it.</p>
                <p>By Lesson 8 you will be drawing pictures with code on a <strong>canvas</strong> — the same thing the games in <a href="../funtime/funtime.html">Fun Time</a> are built on. 🎨</p>
            </div>

            <div class="lesson-grid">
%s
            </div>

            <div class="path-note">
                <p>💡 <strong>Never written code before?</strong> This is a friendly place to start — HTML is not really programming, it is labelling. By the time real programming turns up in Lesson 4, the page will already feel like yours.</p>
            </div>

            <div class="path-note">
                <p>🐍 <strong>Already know some Python?</strong> Lessons 4 and 5 will feel familiar — variables, if/else and loops are the same ideas in a new accent. Compare them with <a href="basics.html">Python Basics</a> and you will learn both twice as well.</p>
            </div>
        </main>

        <footer>
            <p>View Source on any website you like. That is all anybody did. 🌐💛</p>
        </footer>
''' % "\n\n".join(cards)

    page = SHELL % ("Web Coding - HTML, CSS &amp; JavaScript - KidsLearn", HUB_STYLES, body, "")
    (OUT / "web.html").write_text(page, encoding="utf-8")
    return "web.html"


def main():
    lessons = []
    for number, slug in enumerate(ORDER, start=1):
        module = importlib.import_module("weblessons." + slug.replace("-", "_"))
        lesson = dict(module.LESSON)
        lesson["slug"] = slug
        lesson["number"] = number
        lessons.append(lesson)

    written = [build_hub(lessons)]
    for index, lesson in enumerate(lessons):
        written.append(build_lesson(lesson, index, lessons))

    print("Web Coding track written:")
    for name in written:
        print("  " + name)


# The lesson files import the helpers above, so main() must not run when they
# do - only when this file is the one being run.
if __name__ == "__main__":
    main()
