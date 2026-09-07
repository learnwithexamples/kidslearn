#!/usr/bin/env python3
"""build_pages.py - write the four HTML pages for every Fun Time game.

    python3 funtime/tools/build_pages.py

Each game has four pages that are almost identical apart from their words:

    <game>.html                the JavaScript game
    <game>-build.html          the JavaScript workshop
    <game>-python.html         the Python game
    <game>-python-build.html   the Python workshop

Rather than keep four hand-written copies per game (and 80 of them in total),
each game is described once in games.py and this script writes the pages.
Re-run it after changing a description; the pages are ordinary files, so the
site itself never depends on this script.
"""

import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
FUNTIME = HERE.parent
sys.path.insert(0, str(HERE))

from games import GAMES, CLASSICS, WORKSHOP_CLASSICS, PYTHON_CLASSICS   # noqa: E402

GAME_STYLE = """        body { background: #2b2b2b; }
        .container { background: #fafafa; }
        h1, .subtitle { color: #111; text-shadow: none; }
        .subtitle { color: #555; }

        .game-wrap { max-width: 880px; margin: 0 auto; }

        .game-layout {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: flex-start;
            gap: 26px;
        }

        canvas.board {
            display: block;
            background: #ffffff;
            border: 3px solid #111;
            image-rendering: pixelated;
            touch-action: none;
            max-width: 100%;
            height: auto;
        }

        .side-panel { display: flex; flex-direction: column; gap: 14px; min-width: 160px; }

        .panel-box { background: #fff; border: 3px solid #111; padding: 10px 16px; text-align: center; }
        .panel-box .label { font-family: monospace; font-size: 0.8em; letter-spacing: 2px; color: #555; text-transform: uppercase; }
        .panel-box .value { font-family: monospace; font-size: 1.9em; font-weight: bold; color: #111; line-height: 1.1; }

        .btn-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

        .mono-btn {
            font-family: monospace; font-weight: bold; font-size: 1em;
            background: #fff; color: #111; border: 3px solid #111; padding: 10px 18px; cursor: pointer;
        }
        .mono-btn:hover { background: #111; color: #fff; }
        .mono-btn:active { transform: translateY(1px); }

        .touch-pad { display: grid; gap: 10px; max-width: 340px; margin: 20px auto 0; }
        .touch-pad .mono-btn { padding: 14px 0; font-size: 1.15em; }
        .touch-pad .spacer { visibility: hidden; }

        .help-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin: 26px 0 0; }
        .help-card { background: #fff; border: 2px solid #111; padding: 16px 20px; }
        .help-card h3 { margin: 0 0 10px; color: #111; }
        .help-card ul { margin: 0; padding-left: 20px; }
        .help-card li { margin-bottom: 6px; color: #333; }

        .key {
            display: inline-block; min-width: 26px; padding: 2px 8px; text-align: center;
            background: #111; color: #fff; border-radius: 4px;
            font-family: monospace; font-weight: bold; font-size: 0.9em;
        }

        .coder-box { background: #fff; border: 2px dashed #111; padding: 18px 22px; margin-top: 26px; }
        .coder-box h3 { margin: 0 0 10px; color: #111; }
        .coder-box p { color: #333; margin-bottom: 10px; }
        .coder-box code { background: #111; color: #fff; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 0.9em; }

        .file-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .file-table th, .file-table td { border: 1px solid #999; padding: 7px 10px; text-align: left; font-size: 0.94em; }
        .file-table th { background: #111; color: #fff; font-family: monospace; }
        .file-table td:first-child { font-family: monospace; white-space: nowrap; }

        .py-badge {
            font-family: monospace; font-size: 0.42em; vertical-align: middle;
            background: #111; color: #fff; padding: 6px 10px; border-radius: 6px;
        }

        .py-status {
            font-family: monospace; font-size: 0.9em; text-align: center;
            border: 2px dashed #111; padding: 10px; margin: 0 auto 18px; max-width: 640px; color: #333;
        }
        .py-status.ready { border-style: solid; background: #111; color: #fff; }
        .py-status.error { border-style: solid; background: #fff; color: #111; font-weight: bold; }

        footer p { color: #444; }"""


def hud_html(spec):
    """The row of score boxes down the side of the board."""
    boxes = []
    for label, element_id, start in spec["hud"]:
        boxes.append('''                    <div class="panel-box">
                        <div class="label">%s</div>
                        <div class="value" id="%s">%s</div>
                    </div>''' % (label, element_id, start))
    return "\n\n".join(boxes)


def padded_row(row, columns):
    """One row of buttons, padded out to the full width of the pad.

    INPUT:  row - the buttons wanted. columns - how wide the pad is.
    OUTPUT: a list exactly `columns` long, with None where a gap goes.

    WHY: the pad is a CSS grid, and a grid fills itself cell by cell. A row
    with two buttons in a three-wide pad would let the next row's first button
    slide up beside it, and the whole pad shifts out of shape. Padding each
    short row - a bit on the left, the rest on the right, so it stays centred
    - keeps every row where it belongs.
    """
    missing = columns - len(row)
    if missing <= 0:
        return list(row)
    left = missing // 2
    return [None] * left + list(row) + [None] * (missing - left)


# Every page loads this. It is the whole of the Xbox-controller support: it
# turns the pad into key presses, so no game has to know it exists.
GAMEPAD_SCRIPT = (
    "    <!-- An Xbox controller, for anyone who has one. No driver needed. -->\n"
    '    <script src="lib/gamepad.js"></script>\n'
)


def touchpad_html(spec):
    """The on-screen buttons under the board."""
    rows = spec.get("touchpad", [])
    if not rows:
        return ""
    columns = max(len(row) for row in rows)
    cells = []
    for row in rows:
        for cell in padded_row(row, columns):
            if cell is None:
                cells.append('                <div class="spacer"></div>')
            else:
                element_id, label = cell
                cells.append('                <button class="mono-btn" id="%s">%s</button>' % (element_id, label))
    return ('            <div class="touch-pad" style="grid-template-columns: repeat(%d, 1fr);">\n'
            % columns) + "\n".join(cells) + "\n            </div>\n"


# The two typing games cannot be played on a controller: you cannot type
# twenty-six letters with eight buttons. Every other game can.
KEYBOARD_ONLY = ("hangman", "typing")

GAMEPAD_HELP = ('🎮 <strong>Xbox controller?</strong> Just plug it in or pair it — '
                'the stick and D-pad are the arrow keys, <strong>A</strong> is '
                '<span class="key">SPACE</span>, <strong>Menu</strong> pauses and '
                '<strong>View</strong> starts again')

GAMEPAD_HELP_TYPING = ('🎮 <strong>Xbox controller?</strong> Not this one, sorry — '
                       'this game is about typing letters, and a controller has no '
                       'letters on it. Every other game takes a pad.')


def help_html(spec):
    """The three cards explaining the game.

    The first card is always the controls, so the line about the controller is
    added there — one place, rather than in all twenty-four descriptions.
    """
    cards = []
    for index, (title, items) in enumerate(spec["help"]):
        if index == 0:
            note = GAMEPAD_HELP_TYPING if spec["slug"] in KEYBOARD_ONLY else GAMEPAD_HELP
            items = list(items) + [note]
        lines = "\n".join("                        <li>%s</li>" % item for item in items)
        cards.append('''                <div class="help-card">
                    <h3>%s</h3>
                    <ul>
%s
                    </ul>
                </div>''' % (title, lines))
    return "\n\n".join(cards)


def file_table(rows):
    """The table of library files in the "for young coders" box."""
    body = []
    for name, job, functions in rows:
        body.append('''                    <tr>
                        <td>%s</td>
                        <td>%s</td>
                        <td>%s</td>
                    </tr>''' % (name, job, functions))
    return '''                <table class="file-table">
                    <tr>
                        <th>File</th>
                        <th>What it does</th>
                        <th>Good functions to try re-writing</th>
                    </tr>
%s
                </table>''' % ("\n".join(body))


def page_shell(title, style_extra, body):
    """The bits every page shares."""
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s - KidsLearn</title>
    <link rel="stylesheet" href="../styles/main.css">
    <style>
%s%s
    </style>
</head>
<body>
%s</body>
</html>
''' % (title, GAME_STYLE, style_extra, body)


def build_game_page(spec, python=False):
    """Write one playable game page (JavaScript or Python)."""
    slug = spec["slug"]
    badge = ' <span class="py-badge">in Python</span>' if python else ""
    subtitle = spec["python_subtitle"] if python else spec["subtitle"]
    status = ('        <div class="py-status" id="py-status">🐍 Starting Python…</div>\n\n'
              if python else "")

    if python:
        scripts = '''    <!-- One small piece of JavaScript, whose only job is to start Python. -->
    <script src="lib/python-runner.js"></script>
    <script>
        startPythonGame({
            files: [%s],
            setup: 'import %s_web\\n%s_web.start_game()',
            status: 'py-status'
        });
    </script>
''' % (", ".join("'" + name + "'" for name in spec["py_files"]),
       slug.replace("-", "_"), slug.replace("-", "_")) + GAMEPAD_SCRIPT
        coder = '''            <div class="coder-box">
                <h3>🧑‍💻 This whole game is Python</h3>
                <p>There is almost no JavaScript on this page. The browser downloaded <strong>Pyodide</strong> — a complete Python interpreter compiled to WebAssembly — and then ran the <code>.py</code> files in <code>funtime/pylib/</code>. Python does the rules, the maths <em>and</em> the drawing.</p>
%s
                <p style="margin-top:12px;">🔍 <strong>Compare the two versions.</strong> Open <code>lib/%s-rules.js</code> and <code>pylib/%s_rules.py</code> side by side — same ideas, two languages.</p>
                <p style="margin-top:12px;">🛠️ <strong>Build it yourself:</strong> <a href="%s-python-build.html"><strong>Build %s in Python</strong></a> walks you through the functions one at a time.</p>
                <p style="margin-top:12px;">⚠️ <strong>If the game never starts:</strong> the page has to read its <code>.py</code> files, which a browser will not do for a page opened straight off your disk. Use the live site, or run <code>python3 -m http.server</code> in the project folder.</p>
            </div>
''' % (file_table(spec["py_coder_rows"]), slug, slug.replace("-", "_"), slug, spec["name"])
    else:
        scripts = "    <!-- The libraries, in the order they need each other -->\n" + \
                  "\n".join('    <script src="lib/%s"></script>' % name for name in spec["js_files"]) + \
                  "\n" + GAMEPAD_SCRIPT
        coder = '''            <div class="coder-box">
                <h3>🧑‍💻 For young coders: build this game yourself</h3>
                <p>This game is split into small library files inside <code>funtime/lib/</code>, and every function has a comment saying exactly what goes <strong>in</strong>, what comes <strong>out</strong>, and the <strong>algorithm</strong> in plain English. Empty any function out, read its comment, and write it yourself.</p>
%s
                <p style="margin-top:12px;">💡 <strong>The big idea:</strong> %s</p>
                <p style="margin-top:12px;">🛠️ <strong>Want to be walked through it?</strong> <a href="%s-build.html"><strong>Build %s Yourself</strong></a> takes you through the key functions one step at a time and tests each one you write. There is a <a href="%s-python.html">Python version</a> too.</p>
            </div>
''' % (file_table(spec["js_coder_rows"]), spec["big_idea"], slug, spec["name"], slug)

    body = '''    <div class="container">
        <header>
            <h1>%s %s%s</h1>
            <p class="subtitle">%s</p>
            <a href="funtime.html" class="back-link">← Back to Fun Time</a>
        </header>

%s        <div class="game-wrap">
            <div class="game-layout">
                <canvas class="board" id="%s" width="%d" height="%d"></canvas>

                <div class="side-panel">
%s

                    <div class="btn-row">
                        <button class="mono-btn" id="pause-btn">%s</button>
                        <button class="mono-btn" id="restart-btn">↺ New</button>
                    </div>
                </div>
            </div>

%s
            <div class="help-grid">
%s
            </div>

%s        </div>

        <footer>
            <p>%s</p>
        </footer>
    </div>

%s''' % (spec["icon"], spec["title"], badge, subtitle, status,
         spec["canvas_id"], spec["canvas_width"], spec["canvas_height"],
         hud_html(spec), spec.get("play_label", "▶ Play"), touchpad_html(spec),
         help_html(spec), coder, spec["footer"], scripts)

    name = "%s-python.html" % spec["slug"] if python else "%s.html" % spec["slug"]
    (FUNTIME / name).write_text(page_shell(
        "%s in Python" % spec["name"] if python else spec["name"], "", body))
    return name


def build_workshop_page(spec, python=False):
    """Write one Build-it-yourself page (JavaScript or Python)."""
    slug = spec["slug"]
    badge = ' <span class="py-badge">in Python</span>' if python else ""
    language = "Python" if python else "JavaScript"
    status = ('        <div class="py-status" id="py-status">🐍 Starting Python…</div>\n\n'
              if python else "")

    if python:
        scripts = '''    <script src="lib/python-runner.js"></script>
    <script src="lib/workshop.js"></script>
    <script src="lib/workshop-python.js"></script>
    <script src="lib/%s-python-steps.js"></script>
    <script>
        startPythonWorkshop({
            storagePrefix: '%s-python-build',
            steps: %s,
            module: '%s_rules',
            demoModule: '%s_demo',
            files: [%s],
            status: 'py-status'
        });
    </script>
''' % (slug, slug, spec["py_steps_const"], slug.replace("-", "_"), slug.replace("-", "_"),
       ", ".join("'" + name + "'" for name in spec["py_workshop_files"])) + GAMEPAD_SCRIPT
        other = '<a href="%s-build.html">the JavaScript version</a>' % slug
        play = '<a href="%s-python.html">%s %s in Python</a>' % (slug, spec["icon"], spec["name"])
    else:
        scripts = "\n".join('    <script src="lib/%s"></script>' % name
                            for name in spec["js_files"] if not name.endswith("-main.js")) + '''
    <script src="lib/workshop.js"></script>
    <script src="lib/%s-steps.js"></script>
    <script src="lib/%s-build.js"></script>
    <!-- An Xbox controller, for anyone who has one. No driver needed. -->
    <script src="lib/gamepad.js"></script>
''' % (slug, slug)
        other = '<a href="%s-python-build.html">the Python version</a>' % slug
        play = '<a href="%s.html">%s %s</a>' % (slug, spec["icon"], spec["name"])

    body = '''    <div class="container">
        <header>
            <h1>🛠️ Build %s%s</h1>
            <p class="subtitle">%d %s functions. Write them one at a time, test each one, and watch the game come alive.</p>
            <a href="funtime.html" class="back-link">← Back to Fun Time</a>
        </header>

%s        <div class="progress-wrap">
            <div id="progress"></div>
            <div id="progress-text"></div>
        </div>

        <div class="workshop">
            <div class="lesson-col">
                <div class="panel">
                    <div class="step-label" id="step-number">Step 1</div>
                    <h2 id="step-title">…</h2>
                    <div class="step-adds" id="step-adds"></div>
                    <div id="step-intro"></div>
                    <div class="spec" id="step-spec"></div>
                    <div class="warn" id="step-warning" style="display:none;"></div>
                </div>

                <div class="panel">
                    <h3>✏️ Write your function</h3>
                    <textarea id="code-editor" spellcheck="false"></textarea>
                    <div class="btn-row">
                        <button class="mono-btn primary" id="btn-test">▶ Test it</button>
                        <button class="mono-btn" id="btn-hint">💡 Hint</button>
                        <button class="mono-btn" id="btn-answer">🔑 Answer</button>
                        <button class="mono-btn" id="btn-reset">↺ Start over</button>
                    </div>
                    <div class="hint-box" id="hint-box" style="display:none;"></div>

                    <div class="test-summary" id="test-summary">Write your function, then press ▶ Test it.</div>
                    <ul id="test-results"></ul>

                    <div class="nav-row">
                        <button class="mono-btn" id="btn-prev">← Previous step</button>
                        <button class="mono-btn primary" id="btn-next" disabled>Next step →</button>
                    </div>
                </div>

                <div class="panel finish-panel" id="finish-panel" style="display:none;">
                    <h2>🏆 You built %s!</h2>
                    <p>Every function running in that game is one you wrote yourself.</p>
                    <p>Play the finished version at %s, or try %s of this same workshop.</p>
                    <p><strong>Next challenge:</strong> %s</p>
                </div>
            </div>

            <div class="demo-col">
                <div class="panel">
                    <h3>🎮 The game so far</h3>
                    <div class="demo-switch">
                        <button class="mono-btn small" id="btn-demo-yours">🧑‍💻 My code</button>
                        <button class="mono-btn small" id="btn-demo-goal">🎬 The goal</button>
                    </div>
                    <div class="demo-status goal" id="demo-status">…</div>
                    <canvas id="demo-canvas" width="240" height="400"></canvas>
                    <div id="demo-controls"></div>
                    <div id="demo-note"></div>
                    <div id="demo-caption"></div>
                </div>
            </div>
        </div>

        <div class="panel">
            <h3>📋 How this works</h3>
            <ul>
                <li>Each step asks for <strong>one function</strong>. Read the <strong>INPUT / OUTPUT / ALGORITHM</strong> box — it tells you everything you need.</li>
                <li>Press <strong>▶ Test it</strong> to run real checks. Every ❌ says what it expected and what it got.</li>
                <li>When all the tests pass, the next step unlocks and the demo switches to <strong>your</strong> code.</li>
                <li>Your work is saved in this browser, so you can come back later.</li>
                <li>⚠️ A loop that never stops is caught after 2 seconds and reported as a mistake.</li>
            </ul>
            <button class="mono-btn small" id="btn-restart-course">🗑️ Erase my work and start again</button>
        </div>

        <footer>
            <p>Reading code teaches you a little. Writing it teaches you everything. 🛠️</p>
        </footer>
    </div>

%s''' % (spec["name"] + badge, "", spec["step_count"], language, status,
         spec["name"], play, other, spec["next_challenge"], scripts)

    name = "%s-python-build.html" % slug if python else "%s-build.html" % slug
    style = '\n    </style>\n    <link rel="stylesheet" href="../styles/workshop.css">\n    <style>\n'
    page = page_shell("Build %s%s" % (spec["name"], " in Python" if python else " Yourself"), style, body)
    (FUNTIME / name).write_text(page)
    return name


def card(icon, name, blurb, page, link):
    """One card on the Fun Time hub."""
    return '''            <div class="topic-card">
                <div class="topic-icon">%s</div>
                <h2>%s</h2>
                <p>%s</p>
                <a href="%s" class="topic-link">%s</a>
            </div>''' % (icon, name, blurb, page, link)


def build_hub():
    """Write funtime.html, listing every game in one place.

    INPUT:  nothing (it reads games.py)
    OUTPUT: the file name it wrote
    ALGORITHM: three sections - the games, the workshops, and the Python
    versions - each a grid of cards built from the game descriptions.
    """
    play = [card(g["icon"], g["name"], g["subtitle"], g["slug"] + ".html", "Play Now!") for g in GAMES]
    build = [card("🛠️", "Build " + g["name"] + " Yourself",
                  "Write the %d functions behind %s, one at a time." % (g["step_count"], g["name"]),
                  g["slug"] + "-build.html", "Start Building!") for g in GAMES]
    python_play = [card(g["icon"], g["name"] + " in Python", g["python_subtitle"],
                        g["slug"] + "-python.html", "Play in Python!") for g in GAMES]
    python_build = [card("🛠️", "Build " + g["name"] + " in Python",
                         "The same %d functions, written and tested in Python." % g["step_count"],
                         g["slug"] + "-python-build.html", "Start Building!") for g in GAMES]

    classics = [card(c["icon"], c["name"], c["blurb"], c["page"], c["link"]) for c in CLASSICS]
    workshops = [card(c["icon"], c["name"], c["blurb"], c["page"], c["link"]) for c in WORKSHOP_CLASSICS]
    python_classics = [card(c["icon"], c["name"], c["blurb"], c["page"], c["link"]) for c in PYTHON_CLASSICS]

    sections = [
        ("🎮 Play a game", "Every one is black and white, and every one is yours to take apart",
         classics + play),
        ("🛠️ Build a game yourself", "Not games — workshops. Write the real functions, one at a time, and watch each game come alive",
         workshops + build),
        ("🐍 The same games, in Python", "Real Python, running in your browser — no installing anything",
         python_classics + python_play + python_build),
    ]

    body = []
    for index, (title, subtitle, cards) in enumerate(sections):
        top = "" if index == 0 else ' style="margin-top: 40px;"'
        body.append('''        <header%s>
            <h1>%s</h1>
            <p class="subtitle">%s</p>%s
        </header>

        <main class="topics-grid">
%s
        </main>''' % (top, title, subtitle,
                      '\n            <a href="../index.html" class="back-link">← Back to Home</a>' if index == 0 else "",
                      "\n\n".join(cards)))

    page = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fun Time - KidsLearn</title>
    <link rel="stylesheet" href="../styles/main.css">
</head>
<body>
    <div class="container">
%s

        <div class="help-card" style="margin-top: 40px;">
            <h3>🎮 Playing with an Xbox controller</h3>
            <ul>
                <li>Nothing to install. Plug the controller in with a USB cable, or hold
                    its pairing button and add it under <strong>System Settings →
                    Bluetooth</strong>.</li>
                <li>Open any game and <strong>press a button on the pad</strong> — a
                    little <em>🎮 Controller ready</em> badge appears in the corner.</li>
                <li>Not sure it is working? <a href="gamepad-test.html"><strong>Test your
                    controller here</strong></a> — every button lights up as you press it.</li>
                <li>The stick and the D-pad are the arrow keys, <strong>A</strong> is
                    <span class="key">SPACE</span>, <strong>Menu</strong> pauses and
                    <strong>View</strong> starts again.</li>
                <li>The keyboard keeps working at the same time, so two people can share
                    a game — one on the pad, one on the keys.</li>
                <li>The two typing games — Hangman and Typing Race — need a keyboard, for
                    the obvious reason.</li>
            </ul>
        </div>

        <footer>
            <p>Play hard, learn hard — then build the games yourself. 🌟</p>
        </footer>
    </div>
</body>
</html>
''' % ("\n\n".join(body))
    (FUNTIME / "funtime.html").write_text(page)
    return "funtime.html"


def main():
    written = []
    for spec in GAMES:
        written.append(build_game_page(spec, python=False))
        written.append(build_workshop_page(spec, python=False))
        written.append(build_game_page(spec, python=True))
        written.append(build_workshop_page(spec, python=True))
    written.append(build_hub())
    print("wrote %d pages:" % len(written))
    for name in written:
        print("  " + name)


if __name__ == "__main__":
    main()
