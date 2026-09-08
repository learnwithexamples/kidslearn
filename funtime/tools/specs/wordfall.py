"""The description of the Word Rain game, used to build its four pages."""

SPEC = dict(
    slug="wordfall",
    name="Word Rain",
    icon="🌧️",
    title="WORD RAIN",
    subtitle="Words fall out of the sky — type them before they hit the ground",
    python_subtitle="The same downpour — the falling, the matching and the levels all in Python",
    canvas_id="wordfall-board", canvas_width=340, canvas_height=400,
    hud=[("Score", "score", "0"), ("Level", "level", "1"),
         ("Lives", "lives", "3"), ("Best", "best", "0")],
    play_label="⏸ Pause",
    touchpad=[[("btn-keyboard", "⌨ TAP TO TYPE")]],
    hidden_input=True,
    extra_scripts=(
        "    <!-- The Classical Roots words, shared with the vocabulary section. -->\n"
        '    <script src="../data/vocabulary-data.js"></script>\n'
        '    <script src="lib/wordlists.js"></script>\n'
    ),
    extra_panel="""            <div class="word-source" id="word-source">
                <h3>\u2699\ufe0f Set it up</h3>
                <p class="source-hint">Start wherever you like, and race on the everyday words or on a Classical Roots lesson. Pick one book, then tick as many lessons as you want.</p>

                <div class="source-row">
                    <label for="start-level">Start at level</label>
                    <input id="start-level" type="number" min="1" max="99" step="1" value="1">
                    <span class="source-aside">\u2191 and \u2193 change it while you play</span>
                </div>

                <div class="source-row">
                    <label for="book-choice">Book</label>
                    <select id="book-choice"></select>
                </div>

                <div class="lesson-list" id="lesson-list"></div>

                <div class="btn-row">
                    <button class="mono-btn small" id="lessons-all">All lessons</button>
                    <button class="mono-btn small" id="lessons-none">None</button>
                    <button class="mono-btn small primary" id="lessons-use">\u2713 Use these words</button>
                </div>

                <p class="source-note" id="source-note"></p>
            </div>
""",
    help=[
        ("⌨️ Controls", [
            'Just start typing — no need to pick a word first',
            '<span class="key">↑</span> faster &nbsp;•&nbsp; <span class="key">↓</span> slower — change the level whenever you like',
            '<span class="key">BACKSPACE</span> rub out a letter',
            '<span class="key">SPACE</span> give up on this word and start another',
            '<span class="key">ENTER</span> new game &nbsp;•&nbsp; <span class="key">ESC</span> pause',
        ]),
        ("🎯 How to play", [
            "Type a word and it vanishes. Let one touch the ground and it costs you a life.",
            "You never choose a word — the letters do it for you. Type <strong>c</strong> and every word starting with c lights up.",
            "The one with the <strong>line under it</strong> is the one you are on: always the lowest that still matches.",
            "Three lives. Three words on the ground and the rain has won.",
        ]),
        ("📈 It gets faster", [
            "Every <strong>six words</strong> you clear takes you up a level.",
            "Each level the words fall <strong>faster</strong> and arrive <strong>closer together</strong>.",
            "Too slow or too easy? Press <span class=\'key\'>↑</span> or <span class=\'key\'>↓</span> and change it yourself, mid-game.",
            "Nobody lasts for ever. The question is how far you get.",
        ]),
        ("📚 Your own word lists", [
            "Under the sky you can swap the everyday words for a <strong>Classical Roots</strong> lesson.",
            "Pick <strong>one book</strong>, then tick <strong>as many lessons</strong> as you want.",
            "Long words are given proportionally longer to fall, so a vocabulary lesson is a fair game and not an impossible one.",
            "Your book, your lessons and your starting level are all remembered.",
        ]),
    ],
    js_files=["wordfall-rules.js", "wordfall-draw.js", "wordfall-main.js"],
    py_files=["wordfall_rules.py", "wordfall_draw.py", "wordfall_web.py"],
    py_workshop_files=["wordfall_rules.py", "wordfall_draw.py", "wordfall_demo.py",
                       "workshop_support.py"],
    js_coder_rows=[
        ("lib/wordfall-rules.js", "The rules: the falling, the matching, the levels",
         "<code>speedForLevel</code>, <code>matchingWord</code>, <code>typeLetter</code>, <code>zapWord</code>"),
        ("lib/wordfall-draw.js", "Painting the sky, the ground and the half-typed words",
         "<code>drawWord</code>, <code>drawGround</code>, <code>renderGame</code>"),
        ("lib/wordfall-main.js", "The glue: the keyboard, the phone keyboard, the loop",
         "<code>doAction</code>, <code>connectKeyboard</code>, <code>gameLoop</code>"),
    ],
    py_coder_rows=[
        ("pylib/wordfall_rules.py", "The rules: the falling, the matching, the levels",
         "<code>speed_for_level</code>, <code>matching_word</code>, <code>type_letter</code>, <code>zap_word</code>"),
        ("pylib/wordfall_draw.py", "Painting the sky — Python calling the canvas",
         "<code>draw_word</code>, <code>draw_ground</code>, <code>render_game</code>"),
        ("pylib/wordfall_web.py", "The glue: the keyboard, the phone keyboard, the loop",
         "<code>do_action</code>, <code>on_hidden_input</code>, <code>frame</code>"),
    ],
    big_idea="<strong>you never choose a target — the letters choose it for you.</strong> Six words are falling, you press one key, and the game works out which one you meant: of everything that starts with what you have typed, the one nearest the ground. That is the same idea behind a search box completing your sentence, and it is twelve lines of code.",
    step_count=12,
    py_steps_const="WORDFALL_PYTHON_STEPS",
    next_challenge="give a bonus for clearing a word high in the sky, add a rare golden word that clears the whole screen, or let the player type their own list of spellings to practise.",
    footer="Type fast. The sky is not waiting. 🌧️",
)
