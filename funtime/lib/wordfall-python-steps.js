/* ============================================================
   wordfall-python-steps.js - the 12 steps of "Build Word Rain in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const WORDFALL_PYTHON_STEPS = [
    {
        "id": "speed_for_level",
        "fnName": "speed_for_level",
        "title": "How fast does it fall?",
        "adds": "The words start coming down.",
        "intro": "<p>Every level the words fall a little faster. That is the whole promise of the game, and it is one line of arithmetic: start at <code>START_SPEED</code> and add <code>SPEED_STEP</code> for each level after the first.</p><p>Then the interesting half: <strong>put a ceiling on it</strong>. Without one, level 30 would drop words faster than anybody could read, and level 100 would drop them faster than the screen can draw. A game nobody can play is not a hard game — it is a broken one.</p>",
        "spec": {
            "input": "level — 1, 2, 3 …",
            "output": "how many pixels the words fall each second",
            "algorithm": [
                "Work out START_SPEED + (level − 1) × SPEED_STEP.",
                "If that is over MAX_SPEED, give back MAX_SPEED instead.",
                "Otherwise give back what you worked out."
            ]
        },
        "starter": "def speed_for_level(level):\n    return START_SPEED\n",
        "answer": "def speed_for_level(level):\n    return min(START_SPEED + (level - 1) * SPEED_STEP, MAX_SPEED)\n",
        "hints": [
            "(level - 1) is what makes level 1 come out at exactly START_SPEED.",
            "min(a, b) gives back the smaller of two numbers — that is your ceiling.",
            "return min(START_SPEED + (level - 1) * SPEED_STEP, MAX_SPEED)"
        ],
        "tests": [
            {
                "name": "Level 1 is the starting speed",
                "code": "assert speed_for_level(1) == START_SPEED, f'got {speed_for_level(1)}'"
            },
            {
                "name": "Level 2 is one step faster",
                "code": "assert speed_for_level(2) == START_SPEED + SPEED_STEP"
            },
            {
                "name": "Level 5 is four steps faster",
                "code": "assert speed_for_level(5) == START_SPEED + 4 * SPEED_STEP"
            },
            {
                "name": "It never stops getting harder — until the ceiling",
                "code": "for level in range(1, 20):\n    assert speed_for_level(level + 1) >= speed_for_level(level), f'level {level + 1} was slower'"
            },
            {
                "name": "A very high level is capped",
                "code": "assert speed_for_level(500) == MAX_SPEED, 'did you forget the ceiling?'"
            },
            {
                "name": "Nothing ever goes over the ceiling",
                "code": "for level in range(1, 300):\n    assert speed_for_level(level) <= MAX_SPEED, f'level {level} reached {speed_for_level(level)}'"
            },
            {
                "name": "A word still takes a moment to fall, even at the top speed",
                "code": "seconds = GROUND_Y / speed_for_level(999)\nassert seconds > 1.5, f'a word falls in {seconds:.1f} seconds at the hardest level'"
            }
        ],
        "demo": {
            "kind": "pace",
            "caption": "Press Level + and watch the words come down harder. The number under the sky is your function."
        }
    },
    {
        "id": "gap_for_level",
        "fnName": "gap_for_level",
        "title": "How often does one arrive?",
        "adds": "The rain gets heavier.",
        "intro": "<p>Falling faster is only half of getting harder. The other half is words arriving <em>closer together</em>, and this is the mirror image of the last step: start at <code>START_GAP</code> milliseconds and take <code>GAP_STEP</code> off for each level.</p><p>Where the last one needed a <strong>ceiling</strong>, this one needs a <strong>floor</strong>. Keep subtracting and the gap reaches zero, then goes negative — and a gap of zero means a new word every single frame. The sky would fill up faster than you could blink.</p><p>Two functions, the same shape, opposite directions. Getting both right is what makes a difficulty curve instead of a cliff.</p>",
        "spec": {
            "input": "level — 1, 2, 3 …",
            "output": "how many milliseconds to wait before the next word",
            "algorithm": [
                "Work out START_GAP − (level − 1) × GAP_STEP.",
                "If that is under MIN_GAP, give back MIN_GAP instead.",
                "Otherwise give back what you worked out."
            ]
        },
        "starter": "def gap_for_level(level):\n    return START_GAP\n",
        "answer": "def gap_for_level(level):\n    return max(START_GAP - (level - 1) * GAP_STEP, MIN_GAP)\n",
        "hints": [
            "This one SUBTRACTS where the last one added.",
            "max(a, b) gives back the bigger of two numbers — that is your floor.",
            "return max(START_GAP - (level - 1) * GAP_STEP, MIN_GAP)"
        ],
        "tests": [
            {
                "name": "Level 1 waits the full gap",
                "code": "assert gap_for_level(1) == START_GAP"
            },
            {
                "name": "Level 2 waits one step less",
                "code": "assert gap_for_level(2) == START_GAP - GAP_STEP"
            },
            {
                "name": "The wait keeps shrinking",
                "code": "for level in range(1, 20):\n    assert gap_for_level(level + 1) <= gap_for_level(level), f'level {level + 1} waited longer'"
            },
            {
                "name": "A very high level hits the floor",
                "code": "assert gap_for_level(500) == MIN_GAP, 'did you forget the floor?'"
            },
            {
                "name": "The wait is never zero, and never negative",
                "code": "for level in range(1, 300):\n    assert gap_for_level(level) >= MIN_GAP, f'level {level} asked for {gap_for_level(level)}'\n    assert gap_for_level(level) > 0"
            },
            {
                "name": "It is the mirror of speed_for_level",
                "code": "assert gap_for_level(1) > gap_for_level(10), 'higher levels should wait less'\nassert speed_for_level(1) < speed_for_level(10), 'and fall faster'"
            },
            {
                "name": "Even at the floor there is time to type a word",
                "code": "arriving = MIN_GAP / 1000\nassert arriving > 0.3, f'a word every {arriving:.2f} seconds is a wall, not a game'"
            }
        ],
        "demo": {
            "kind": "pace",
            "caption": "The second number is this function — how long the sky waits before the next word."
        }
    },
    {
        "id": "word_width",
        "fnName": "word_width",
        "title": "How wide is a word?",
        "adds": "The game can measure text.",
        "intro": "<p>Measuring text is normally a fiddly job — every letter is a different width, so you have to ask the drawing system and it has to look at the font.</p><p>Unless the font is <strong>monospace</strong>. In a monospace font every single letter is exactly as wide as every other one — that is what the name means — and measuring text collapses into a multiplication.</p><p>The game needs this twice: to stop a long word being dropped half off the edge of the screen, and to draw the box round the word you are typing.</p>",
        "spec": {
            "input": "text — a word",
            "output": "how wide it is, in pixels",
            "algorithm": [
                "Count the letters.",
                "Multiply by LETTER_WIDTH.",
                "That is the whole function."
            ]
        },
        "starter": "def word_width(text):\n    return 0\n",
        "answer": "def word_width(text):\n    return len(text) * LETTER_WIDTH\n",
        "hints": [
            "len(text) is how many letters there are.",
            "One multiplication is all it takes.",
            "return len(text) * LETTER_WIDTH"
        ],
        "tests": [
            {
                "name": "A three-letter word",
                "code": "assert word_width('cat') == 3 * LETTER_WIDTH"
            },
            {
                "name": "A seven-letter word",
                "code": "assert word_width('rainbow') == 7 * LETTER_WIDTH"
            },
            {
                "name": "An empty word takes no room",
                "code": "assert word_width('') == 0"
            },
            {
                "name": "A longer word is wider",
                "code": "assert word_width('elephant') > word_width('ant')"
            },
            {
                "name": "Two words of the same length are the same width",
                "code": "assert word_width('cat') == word_width('dog'), 'that is what monospace means'"
            },
            {
                "name": "Every word in the game fits on the screen",
                "code": "for word in WORD_POOL:\n    assert word_width(word) < FIELD_WIDTH - SKY_MARGIN * 2, f'{word} is {word_width(word)}px wide'"
            },
            {
                "name": "Widths add up the way you would expect",
                "code": "assert word_width('cat') + word_width('dog') == word_width('catdog')"
            }
        ],
        "demo": {
            "kind": "sizes",
            "caption": "Five words, each in a box exactly as wide as your function says."
        }
    },
    {
        "id": "word_for_level",
        "fnName": "word_for_level",
        "title": "Pick a word",
        "adds": "Longer words start arriving.",
        "intro": "<p>Level 1 should drop <em>cat</em> and <em>sun</em>. Level 20 should drop <em>thunder</em> and <em>lantern</em>. So the pool of words a level may use grows as you go.</p><p>Work out the longest word this level is allowed — three letters at level 1, one more every two levels, never past seven — then keep only the words that short and pick one at random.</p><p>This is <strong>filter then choose</strong>, and it turns up everywhere: narrow the list down to what is allowed, then pick from what is left. Doing it the other way round — picking first and checking afterwards — means sometimes picking again, and again, and you can never say how long that will take.</p>",
        "spec": {
            "input": "level — 1, 2, 3 …",
            "output": "one word from WORD_POOL",
            "algorithm": [
                "The longest allowed is 3 + (level − 1) ÷ 2, rounded down — but never more than 7.",
                "Keep only the words in WORD_POOL that are that short.",
                "Pick one of those at random."
            ]
        },
        "starter": "def word_for_level(level):\n    return WORD_POOL[0]\n",
        "answer": "def word_for_level(level):\n    longest = min(3 + (level - 1) // 2, 7)\n    choices = [word for word in WORD_POOL if len(word) <= longest]\n    return random.choice(choices)\n",
        "hints": [
            "(level - 1) // 2 grows by one every two levels — // throws the remainder away.",
            "A list comprehension gives you just the short enough words.",
            "random.choice(choices) picks one."
        ],
        "tests": [
            {
                "name": "It always gives back a real word",
                "code": "for i in range(40):\n    assert word_for_level(3) in WORD_POOL"
            },
            {
                "name": "Level 1 only drops three-letter words",
                "code": "for i in range(60):\n    word = word_for_level(1)\n    assert len(word) == 3, f'level 1 gave {word}'"
            },
            {
                "name": "Level 3 allows four letters",
                "code": "words = [word_for_level(3) for i in range(200)]\nassert all(len(w) <= 4 for w in words)\nassert any(len(w) == 4 for w in words), 'level 3 never used a four-letter word'"
            },
            {
                "name": "The words get longer as the levels go up",
                "code": "longest = lambda level: max(len(word_for_level(level)) for i in range(400))\nassert longest(9) > longest(1), 'level 9 should reach further than level 1'"
            },
            {
                "name": "Nothing is ever longer than seven letters",
                "code": "for i in range(300):\n    assert len(word_for_level(500)) <= 7"
            },
            {
                "name": "It really is random",
                "code": "seen = {word_for_level(4) for i in range(200)}\nassert len(seen) > 8, f'only {len(seen)} different words in 200 tries'"
            },
            {
                "name": "Every word it picks fits on the screen",
                "code": "for i in range(100):\n    assert word_width(word_for_level(30)) < FIELD_WIDTH - SKY_MARGIN * 2"
            }
        ],
        "demo": {
            "kind": "sizes",
            "caption": "Press New words — these come from your function, one for each length it allows."
        }
    },
    {
        "id": "make_word",
        "fnName": "make_word",
        "title": "One falling word",
        "adds": "Something appears in the sky.",
        "intro": "<p>A falling word needs to know three things: what it says, how far across the sky it is, and how far down. That is the whole object.</p><p>It starts at <code>y = 0</code>, right at the top. And here is a small drawing decision that makes the rest of the game simpler: a word is drawn with its <strong>feet</strong> on its y, not its head. So a word at y = 0 is just above the screen and slides into view — and the moment it lands is the moment its feet touch the ground line. No fiddly adding on of heights anywhere else.</p>",
        "spec": {
            "input": "text — what the word says. x — how far across the sky.",
            "output": "a new word: { text, x, y }",
            "algorithm": [
                "Give back an object holding the text.",
                "Put x where you were told.",
                "Start y at 0 — the very top of the sky."
            ]
        },
        "starter": "def make_word(text, x):\n    return {}\n",
        "answer": "def make_word(text, x):\n    return {\"text\": text, \"x\": x, \"y\": 0}\n",
        "hints": [
            "Three keys: text, x and y.",
            "y always starts at 0, whatever the level.",
            "return {'text': text, 'x': x, 'y': 0}"
        ],
        "tests": [
            {
                "name": "It remembers what it says",
                "code": "assert make_word('cat', 50)['text'] == 'cat'"
            },
            {
                "name": "It remembers where across it is",
                "code": "assert make_word('cat', 50)['x'] == 50"
            },
            {
                "name": "It always starts at the top",
                "code": "assert make_word('cat', 50)['y'] == 0\nassert make_word('rainbow', 200)['y'] == 0"
            },
            {
                "name": "Two words are two separate things",
                "code": "a = make_word('cat', 10)\nb = make_word('dog', 20)\na['y'] = 100\nassert b['y'] == 0, 'moving one word moved the other'"
            },
            {
                "name": "It works for any word in the game",
                "code": "for word in WORD_POOL:\n    made = make_word(word, 0)\n    assert made['text'] == word and made['y'] == 0"
            },
            {
                "name": "A brand-new word has not landed",
                "code": "assert has_landed(make_word('cat', 50)) is False"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Press Drop. Every word you see was built by your function."
        }
    },
    {
        "id": "spawn_word",
        "fnName": "spawn_word",
        "title": "Drop it somewhere",
        "adds": "The rain starts falling on its own.",
        "intro": "<p>Now put a word in the sky. Pick one for the level, then pick somewhere across to drop it.</p><p>The catch is the <strong>right-hand edge</strong>. Drop a seven-letter word at x = 330 and most of it hangs off the side of the screen where nobody can read it — and you cannot type what you cannot read. So the random position must stop early enough that the whole word still fits.</p><p>Work out the <em>room</em> first: the width of the sky, less the width of the word, less a margin at each side. Then drop it anywhere from the left margin to the left margin plus that room.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "the word that was dropped (and it is added to state.words)",
            "algorithm": [
                "Ask wordForLevel for a word.",
                "Room = FIELD_WIDTH − wordWidth(text) − SKY_MARGIN × 2. Never let it go below 0.",
                "Pick x anywhere from SKY_MARGIN to SKY_MARGIN + room.",
                "Make the word, add it to state.words, and give it back."
            ]
        },
        "starter": "def spawn_word(state):\n    # pick a word, pick a place, drop it\n    pass\n",
        "answer": "def spawn_word(state):\n    text = word_for_level(state[\"level\"])\n    room = max(0, FIELD_WIDTH - word_width(text) - SKY_MARGIN * 2)\n\n    word = make_word(text, SKY_MARGIN + random.random() * room)\n    state[\"words\"].append(word)\n    return word\n",
        "hints": [
            "Use the two functions you already wrote: word_for_level and word_width.",
            "random.random() * room gives you somewhere from 0 up to room.",
            "Do not forget state['words'].append(word) — and to give the word back."
        ],
        "tests": [
            {
                "name": "It adds one word to the sky",
                "code": "state = create_game()\nstate['words'] = []\nspawn_word(state)\nassert len(state['words']) == 1"
            },
            {
                "name": "It hands the word back too",
                "code": "state = create_game()\nstate['words'] = []\nword = spawn_word(state)\nassert word is state['words'][0], 'give back the very word you added'"
            },
            {
                "name": "The word starts at the top",
                "code": "state = create_game()\nstate['words'] = []\nassert spawn_word(state)['y'] == 0"
            },
            {
                "name": "Dropping twice gives two words",
                "code": "state = create_game()\nstate['words'] = []\nspawn_word(state)\nspawn_word(state)\nassert len(state['words']) == 2"
            },
            {
                "name": "The whole word always fits on the screen",
                "code": "state = create_game()\nstate['level'] = 40\nfor i in range(300):\n    state['words'] = []\n    word = spawn_word(state)\n    assert word['x'] >= 0\n    assert word['x'] + word_width(word['text']) <= FIELD_WIDTH, f\"{word['text']} hangs off the right edge\""
            },
            {
                "name": "Words land all over the sky, not in one place",
                "code": "state = create_game()\nxs = []\nfor i in range(200):\n    state['words'] = []\n    xs.append(spawn_word(state)['x'])\nleft = sum(1 for x in xs if x < FIELD_WIDTH / 2)\nassert 30 < left < 170, f'the split was {left} left of centre out of 200'"
            },
            {
                "name": "It uses words the level allows",
                "code": "state = create_game()\nstate['level'] = 1\nfor i in range(50):\n    state['words'] = []\n    assert len(spawn_word(state)['text']) == 3"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Press Drop and a new word appears — somewhere random, but always fully on screen."
        }
    },
    {
        "id": "move_words",
        "fnName": "move_words",
        "title": "Down they come",
        "adds": "The sky really falls.",
        "intro": "<p>One loop. Every word in the sky moves down by this level's speed, multiplied by how long the frame lasted.</p><p>That multiplication is the part worth remembering. Without it you would be saying &ldquo;move 2 pixels per <em>frame</em>&rdquo;, and a fast computer draws twice as many frames as a slow one — so the same game would be twice as hard on a good machine. Multiplying by the seconds gone by makes <code>speedForLevel</code> mean pixels per <strong>second</strong>, which is a promise every computer can keep.</p>",
        "spec": {
            "input": "state — the whole game. seconds — how long this frame lasted.",
            "output": "nothing; it moves the words",
            "algorithm": [
                "Ask speedForLevel how fast words fall on this level.",
                "For every word in state.words, add speed × seconds to its y."
            ]
        },
        "starter": "def move_words(state, seconds):\n    # everything comes down\n    pass\n",
        "answer": "def move_words(state, seconds):\n    speed = speed_for_level(state[\"level\"])\n    for word in state[\"words\"]:\n        word[\"y\"] += speed * seconds\n",
        "hints": [
            "Work the speed out once, before the loop — it is the same for every word.",
            "Use += so you ADD to y rather than replacing it.",
            "for word in state['words']: word['y'] += speed * seconds"
        ],
        "tests": [
            {
                "name": "An empty sky is fine",
                "code": "state = create_game()\nstate['words'] = []\nmove_words(state, 0.1)\nassert state['words'] == []"
            },
            {
                "name": "A word moves down",
                "code": "state = create_game()\nstate['level'] = 1\nstate['words'] = [make_word('cat', 10)]\nmove_words(state, 1)\nassert state['words'][0]['y'] == speed_for_level(1)"
            },
            {
                "name": "Down means a BIGGER y",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nmove_words(state, 0.5)\nassert state['words'][0]['y'] > 0, 'on a canvas, down is positive'"
            },
            {
                "name": "Every word moves, not just the first",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10), make_word('dog', 40), make_word('pig', 70)]\nmove_words(state, 0.5)\nassert all(w['y'] > 0 for w in state['words'])"
            },
            {
                "name": "A longer frame moves them further",
                "code": "slow = create_game(); slow['words'] = [make_word('cat', 10)]\nfast = create_game(); fast['words'] = [make_word('cat', 10)]\nmove_words(slow, 0.05)\nmove_words(fast, 0.10)\nassert abs(fast['words'][0]['y'] - slow['words'][0]['y'] * 2) < 0.0001"
            },
            {
                "name": "A higher level falls faster",
                "code": "easy = create_game(); easy['level'] = 1; easy['words'] = [make_word('cat', 10)]\nhard = create_game(); hard['level'] = 10; hard['words'] = [make_word('cat', 10)]\nmove_words(easy, 1)\nmove_words(hard, 1)\nassert hard['words'][0]['y'] > easy['words'][0]['y']"
            },
            {
                "name": "Sideways is left alone",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 123)]\nmove_words(state, 1)\nassert state['words'][0]['x'] == 123, 'words fall straight down'"
            },
            {
                "name": "Lots of small steps go as far as one big one",
                "code": "many = create_game(); many['level'] = 3; many['words'] = [make_word('cat', 10)]\nfor i in range(60):\n    move_words(many, 1 / 60)\nonce = create_game(); once['level'] = 3; once['words'] = [make_word('cat', 10)]\nmove_words(once, 1)\nassert abs(many['words'][0]['y'] - once['words'][0]['y']) < 0.0001, 'the frame rate should not matter'"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Now they fall by themselves. Press Nudge to shove them all down at once."
        }
    },
    {
        "id": "has_landed",
        "fnName": "has_landed",
        "title": "Has it touched down?",
        "adds": "The ground starts to matter.",
        "intro": "<p>The smallest function in the game, and worth having a name for anyway.</p><p>A word is drawn with its feet on its y, so it has landed the moment its y reaches <code>GROUND_Y</code>. One comparison.</p><p>Why not just write <code>word.y >= GROUND_Y</code> wherever it is needed? Because <code>hasLanded(word)</code> says what you <em>mean</em>, and the next step reads much better for it. A name is the cheapest comment you will ever write.</p>",
        "spec": {
            "input": "word — one falling word",
            "output": "true if it has reached the ground",
            "algorithm": [
                "Give back whether the word's y has reached GROUND_Y."
            ]
        },
        "starter": "def has_landed(word):\n    return False\n",
        "answer": "def has_landed(word):\n    return word[\"y\"] >= GROUND_Y\n",
        "hints": [
            "You do not need an if — a comparison is already True or False.",
            "Use >= so a word sitting exactly on the line counts as landed.",
            "return word['y'] >= GROUND_Y"
        ],
        "tests": [
            {
                "name": "A word at the top has not landed",
                "code": "assert has_landed({'text': 'cat', 'x': 10, 'y': 0}) is False"
            },
            {
                "name": "A word halfway down has not landed",
                "code": "assert has_landed({'text': 'cat', 'x': 10, 'y': GROUND_Y / 2}) is False"
            },
            {
                "name": "A word on the line HAS landed",
                "code": "assert has_landed({'text': 'cat', 'x': 10, 'y': GROUND_Y}) is True, 'use >='"
            },
            {
                "name": "A word past the line has landed",
                "code": "assert has_landed({'text': 'cat', 'x': 10, 'y': GROUND_Y + 20}) is True"
            },
            {
                "name": "One pixel short does not count",
                "code": "assert has_landed({'text': 'cat', 'x': 10, 'y': GROUND_Y - 1}) is False"
            },
            {
                "name": "It does not care how long the word is",
                "code": "assert has_landed({'text': 'a', 'x': 0, 'y': GROUND_Y}) == has_landed({'text': 'lantern', 'x': 0, 'y': GROUND_Y})"
            },
            {
                "name": "A falling word eventually lands",
                "code": "state = create_game()\nstate['level'] = 1\nstate['words'] = [make_word('cat', 10)]\nframes = 0\nwhile not has_landed(state['words'][0]) and frames < 5000:\n    move_words(state, 1 / 60)\n    frames += 1\nassert has_landed(state['words'][0]), 'it never landed'\nassert frames < 3000, f'it took {frames / 60:.1f} seconds'"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Watch a word reach the hatched ground — that is the moment this function turns true."
        }
    },
    {
        "id": "remove_landed_words",
        "fnName": "remove_landed_words",
        "title": "That one cost you",
        "adds": "Missing a word finally hurts.",
        "intro": "<p>Every word that reached the ground has to go — and take a life with it.</p><p>Build a <strong>new list</strong> of the words still falling rather than deleting from the old one. Removing items from a list while you are walking along it is one of the classic ways to skip an item by accident: the list gets shorter under your feet and the next item slides into a place you have already passed. Collecting the keepers into a fresh list simply cannot go wrong.</p><p>Count what you left out, take that many lives, and if none are left the rain has won.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "how many words landed",
            "algorithm": [
                "Start an empty list, and a count of 0.",
                "For each word: if hasLanded, count it; if not, keep it.",
                "Put the keepers back on state.words.",
                "Take that many lives off, and add to state.missed.",
                "If lives reach 0, set them to 0 and the game is over."
            ]
        },
        "starter": "def remove_landed_words(state):\n    return 0\n",
        "answer": "def remove_landed_words(state):\n    falling = []\n    landed = 0\n\n    for word in state[\"words\"]:\n        if has_landed(word):\n            landed += 1\n        else:\n            falling.append(word)\n    state[\"words\"] = falling\n\n    if landed > 0:\n        state[\"missed\"] += landed\n        state[\"lives\"] -= landed\n        if state[\"lives\"] <= 0:\n            state[\"lives\"] = 0\n            state[\"is_over\"] = True\n    return landed\n",
        "hints": [
            "Make an empty list first and append the survivors to it.",
            "has_landed(word) is the test — you wrote it last step.",
            "Do not let lives go negative: if they reach 0 or below, set them to 0 and end the game."
        ],
        "tests": [
            {
                "name": "An empty sky loses nothing",
                "code": "state = create_game()\nstate['words'] = []\nassert remove_landed_words(state) == 0"
            },
            {
                "name": "A word still falling is kept",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nassert remove_landed_words(state) == 0\nassert len(state['words']) == 1"
            },
            {
                "name": "A landed word is taken away",
                "code": "state = create_game()\nword = make_word('cat', 10)\nword['y'] = GROUND_Y\nstate['words'] = [word]\nassert remove_landed_words(state) == 1\nassert state['words'] == []"
            },
            {
                "name": "And it costs a life",
                "code": "state = create_game()\nbefore = state['lives']\nword = make_word('cat', 10)\nword['y'] = GROUND_Y\nstate['words'] = [word]\nremove_landed_words(state)\nassert state['lives'] == before - 1\nassert state['missed'] == 1"
            },
            {
                "name": "The ones still falling are kept, in order",
                "code": "state = create_game()\na = make_word('aaa', 10)\nb = make_word('bbb', 20); b['y'] = GROUND_Y\nc = make_word('ccc', 30)\nstate['words'] = [a, b, c]\nassert remove_landed_words(state) == 1\nassert [w['text'] for w in state['words']] == ['aaa', 'ccc']"
            },
            {
                "name": "Several landing at once cost several lives",
                "code": "state = create_game()\nstate['lives'] = 5\nstate['words'] = []\nfor i in range(3):\n    word = make_word('cat', i * 40)\n    word['y'] = GROUND_Y + 5\n    state['words'].append(word)\nassert remove_landed_words(state) == 3\nassert state['lives'] == 2"
            },
            {
                "name": "Nothing is ever skipped",
                "code": "state = create_game()\nstate['lives'] = 99\nstate['words'] = []\nfor i in range(6):\n    word = make_word('cat', i * 40)\n    word['y'] = GROUND_Y + 1\n    state['words'].append(word)\nassert remove_landed_words(state) == 6, 'deleting from a list while looping over it skips items'\nassert state['words'] == []"
            },
            {
                "name": "Losing the last life ends the game",
                "code": "state = create_game()\nstate['lives'] = 1\nword = make_word('cat', 10)\nword['y'] = GROUND_Y\nstate['words'] = [word]\nremove_landed_words(state)\nassert state['is_over'] is True\nassert state['lives'] == 0, 'lives must never go negative'"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Let one reach the ground. It vanishes — and in the real game that is a life gone."
        }
    },
    {
        "id": "matching_word",
        "fnName": "matching_word",
        "title": "Which one do you mean?",
        "adds": "The game reads your mind.",
        "intro": "<p>This is the clever bit, and the reason the game feels good to play.</p><p>Six words are falling. You never click one, never press Tab, never choose at all — you just start typing, and the game knows. Type <strong>c</strong> and only the words beginning with c are still in the running. Type <strong>ca</strong> and it is narrower still.</p><p>When several still match, take the one <strong>furthest down</strong> — the one in the most trouble. That is almost always the one the player meant, and it is the one they would lose a life over.</p><p>It is the same idea as a search box finishing your sentence: the letters themselves are the choice.</p>",
        "spec": {
            "input": "state — the whole game. typed — the letters so far.",
            "output": "the word being typed, or nothing at all",
            "algorithm": [
                "If nothing has been typed, there is no match — give back nothing.",
                "Look at every word in the sky.",
                "Skip it unless its text STARTS WITH what has been typed.",
                "Of the ones left, keep the one with the biggest y — the lowest in the sky.",
                "Give that one back, or nothing if none matched."
            ]
        },
        "starter": "def matching_word(state, typed):\n    return None\n",
        "answer": "def matching_word(state, typed):\n    if not typed:\n        return None\n\n    best = None\n    for word in state[\"words\"]:\n        if word[\"text\"].startswith(typed):\n            if best is None or word[\"y\"] > best[\"y\"]:\n                best = word\n    return best\n",
        "hints": [
            "Python has a word for this: word['text'].startswith(typed).",
            "Keep a `best` starting at None, and replace it whenever you find one further down.",
            "Bigger y means lower down the screen, and lower down means more urgent."
        ],
        "tests": [
            {
                "name": "Typing nothing matches nothing",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nassert matching_word(state, '') is None"
            },
            {
                "name": "An empty sky matches nothing",
                "code": "state = create_game()\nstate['words'] = []\nassert matching_word(state, 'c') is None"
            },
            {
                "name": "One letter finds the word",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nassert matching_word(state, 'c')['text'] == 'cat'"
            },
            {
                "name": "A letter that fits nothing finds nothing",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nassert matching_word(state, 'z') is None"
            },
            {
                "name": "It must START with the typing, not just contain it",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nassert matching_word(state, 'at') is None, 'typing \"at\" must not land on \"cat\"'\nassert matching_word(state, 'ca')['text'] == 'cat'"
            },
            {
                "name": "The whole word still matches itself",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nassert matching_word(state, 'cat')['text'] == 'cat'"
            },
            {
                "name": "More letters narrow it down",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10), make_word('cow', 60)]\nassert matching_word(state, 'c') is not None\nassert matching_word(state, 'ca')['text'] == 'cat'\nassert matching_word(state, 'co')['text'] == 'cow'"
            },
            {
                "name": "When two match, it takes the lower one",
                "code": "state = create_game()\nhigh = make_word('cat', 10); high['y'] = 40\nlow = make_word('cup', 60); low['y'] = 300\nstate['words'] = [high, low]\nassert matching_word(state, 'c')['text'] == 'cup', 'the one nearest the ground is in trouble'"
            },
            {
                "name": "Order in the list makes no difference",
                "code": "high = make_word('cat', 10); high['y'] = 40\nlow = make_word('cup', 60); low['y'] = 300\none = create_game(); one['words'] = [high, low]\ntwo = create_game(); two['words'] = [low, high]\nassert matching_word(one, 'c')['text'] == matching_word(two, 'c')['text']"
            },
            {
                "name": "It gives back the very word from the sky",
                "code": "state = create_game()\nword = make_word('cat', 10)\nstate['words'] = [word]\nassert matching_word(state, 'ca') is word, 'give back the word itself, not a copy'"
            }
        ],
        "demo": {
            "kind": "match",
            "caption": "Press Type ▶ and watch the line move to whichever word you are on."
        },
        "warning": "A word STARTS WITH the typing — it does not merely contain it. Typing “at” must not match “cat”, or the letters you press would go somewhere you never expected."
    },
    {
        "id": "type_letter",
        "fnName": "type_letter",
        "title": "One letter at a time",
        "adds": "You can type at the sky.",
        "intro": "<p>A letter is only worth taking if it still spells something up there.</p><p>So <strong>try it first</strong>: stick the letter on the end and ask <code>matchingWord</code> whether anything still matches. If nothing does, throw the letter away and count it as a slip. If something does, keep it.</p><p>That one guard is what stops the game becoming unplayable. Without it, a single mistyped letter would leave you spelling a word that is not in the sky, and every letter after it would be wasted while the rain kept falling.</p>",
        "spec": {
            "input": "state — the whole game. letter — one letter.",
            "output": "true if the letter was taken",
            "algorithm": [
                "Refuse if the game is over or paused.",
                "Refuse anything that is not exactly one character.",
                "Work out what the typing WOULD be with this letter on the end.",
                "If matchingWord finds nothing for that, add one to state.slips and give back false.",
                "Otherwise keep it, count the keystroke, and give back true."
            ]
        },
        "starter": "def type_letter(state, letter):\n    return False\n",
        "answer": "def type_letter(state, letter):\n    if state[\"is_over\"] or state[\"is_paused\"]:\n        return False\n    if len(str(letter)) != 1:\n        return False\n\n    wanted = state[\"typed\"] + letter\n    if matching_word(state, wanted) is None:\n        state[\"slips\"] += 1\n        return False\n\n    state[\"typed\"] = wanted\n    state[\"keystrokes\"] += 1\n    return True\n",
        "hints": [
            "Build the would-be typing in a variable first: state['typed'] + letter.",
            "Then ask matching_word about THAT, before changing anything.",
            "Only set state['typed'] once you know the letter is worth keeping."
        ],
        "tests": [
            {
                "name": "A letter that fits is taken",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = ''\nassert type_letter(state, 'c') is True\nassert state['typed'] == 'c'"
            },
            {
                "name": "A letter that fits nothing is refused",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = ''\nassert type_letter(state, 'z') is False\nassert state['typed'] == ''"
            },
            {
                "name": "A refused letter is counted as a slip",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = ''\nstate['slips'] = 0\ntype_letter(state, 'z')\nassert state['slips'] == 1"
            },
            {
                "name": "Letters build up",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = ''\nfor letter in 'cat':\n    type_letter(state, letter)\nassert state['typed'] == 'cat'"
            },
            {
                "name": "A wrong letter halfway through is refused too",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = 'c'\nassert type_letter(state, 'x') is False\nassert state['typed'] == 'c'"
            },
            {
                "name": "A finished game takes no letters",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = ''\nstate['is_over'] = True\nassert type_letter(state, 'c') is False"
            },
            {
                "name": "A paused game takes no letters",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = ''\nstate['is_paused'] = True\nassert type_letter(state, 'c') is False"
            },
            {
                "name": "Two words starting the same both stay possible",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10), make_word('cow', 60)]\nstate['typed'] = ''\nassert type_letter(state, 'c') is True\nassert type_letter(state, 'o') is True, 'cow is still going, so o must be allowed'\nassert state['typed'] == 'co'"
            },
            {
                "name": "You can always type a word right through",
                "code": "state = create_game()\nstate['words'] = [make_word('lantern', 10)]\nstate['typed'] = ''\nfor letter in 'lantern':\n    assert type_letter(state, letter) is True, f'it refused {letter}'\nassert state['typed'] == 'lantern'"
            }
        ],
        "demo": {
            "kind": "match",
            "caption": "Each press of Type ▶ is one call to your function — watch the black letters grow."
        }
    },
    {
        "id": "zap_word",
        "fnName": "zap_word",
        "title": "Gone!",
        "adds": "Word Rain is finished. Go and play it.",
        "intro": "<p>The last one. When what you have typed spells a whole word, that word disappears and you score for it.</p><p>Two details make it right. Only a word typed <strong>in full</strong> counts — being partway through <em>lantern</em> must not clear it. And when you take it out, compare the words <strong>themselves</strong>, not what they say: <code>word !== target</code> asks &ldquo;is this a different word object?&rdquo;, where <code>word.text !== target.text</code> would ask &ldquo;does it say something different?&rdquo; — and would wipe out both if two words in the sky happened to say the same thing.</p><p>Then score by length, and step up a level every <code>WORDS_PER_LEVEL</code>. That is the whole game.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "true if a word was cleared",
            "algorithm": [
                "Ask matchingWord which word is being typed.",
                "If there is none, or its text is not exactly what was typed, give back false.",
                "Keep every word except that very one.",
                "Score its length × POINTS_PER_LETTER, count it cleared, and empty the typing.",
                "Every WORDS_PER_LEVEL words cleared, go up a level."
            ]
        },
        "starter": "def zap_word(state):\n    return False\n",
        "answer": "def zap_word(state):\n    target = matching_word(state, state[\"typed\"])\n    if target is None or target[\"text\"] != state[\"typed\"]:\n        return False\n\n    state[\"words\"] = [word for word in state[\"words\"] if word is not target]\n    state[\"score\"] += len(target[\"text\"]) * POINTS_PER_LETTER\n    state[\"cleared\"] += 1\n    state[\"typed\"] = \"\"\n\n    if state[\"cleared\"] % WORDS_PER_LEVEL == 0:\n        state[\"level\"] += 1\n    return True\n",
        "hints": [
            "target['text'] != state['typed'] is the 'not finished yet' guard.",
            "`is not` asks whether it is a DIFFERENT object; != would ask whether it says something different.",
            "state['cleared'] % WORDS_PER_LEVEL == 0 is 'every sixth word'."
        ],
        "tests": [
            {
                "name": "A half-typed word is not cleared",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = 'ca'\nassert zap_word(state) is False\nassert len(state['words']) == 1"
            },
            {
                "name": "Typing nothing clears nothing",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = ''\nassert zap_word(state) is False"
            },
            {
                "name": "A finished word disappears",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = 'cat'\nassert zap_word(state) is True\nassert state['words'] == []"
            },
            {
                "name": "And the typing is cleared for the next one",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10)]\nstate['typed'] = 'cat'\nzap_word(state)\nassert state['typed'] == ''"
            },
            {
                "name": "A longer word is worth more",
                "code": "short = create_game(); short['words'] = [make_word('cat', 10)]; short['typed'] = 'cat'; short['score'] = 0\nzap_word(short)\nlong = create_game(); long['words'] = [make_word('lantern', 10)]; long['typed'] = 'lantern'; long['score'] = 0\nzap_word(long)\nassert long['score'] > short['score']\nassert short['score'] == 3 * POINTS_PER_LETTER"
            },
            {
                "name": "Only that word goes",
                "code": "state = create_game()\nstate['words'] = [make_word('cat', 10), make_word('dog', 60), make_word('pig', 110)]\nstate['typed'] = 'dog'\nzap_word(state)\nassert [w['text'] for w in state['words']] == ['cat', 'pig']"
            },
            {
                "name": "Two words saying the same thing do not both vanish",
                "code": "state = create_game()\nfirst = make_word('cat', 10)\nsecond = make_word('cat', 200); second['y'] = 100\nstate['words'] = [first, second]\nstate['typed'] = 'cat'\nzap_word(state)\nassert len(state['words']) == 1, 'both went — compare the words themselves, not what they say'"
            },
            {
                "name": "Six words takes you up a level",
                "code": "state = create_game()\nstate['level'] = 1\nstate['cleared'] = 0\nfor i in range(WORDS_PER_LEVEL):\n    state['words'] = [make_word('cat', 10)]\n    state['typed'] = 'cat'\n    zap_word(state)\nassert state['level'] == 2"
            },
            {
                "name": "But five words does not",
                "code": "state = create_game()\nstate['level'] = 1\nstate['cleared'] = 0\nfor i in range(WORDS_PER_LEVEL - 1):\n    state['words'] = [make_word('cat', 10)]\n    state['typed'] = 'cat'\n    zap_word(state)\nassert state['level'] == 1"
            },
            {
                "name": "A whole game can be played",
                "code": "state = create_game()\ncleared = 0\nfor frame in range(4000):\n    if state['is_over']:\n        break\n    update_game(state, 16)\n    lowest = None\n    for word in state['words']:\n        if state['typed'] and not word['text'].startswith(state['typed']):\n            continue\n        if lowest is None or word['y'] > lowest['y']:\n            lowest = word\n    if lowest is not None:\n        type_letter(state, lowest['text'][len(state['typed'])])\n        if zap_word(state):\n            cleared += 1\nassert cleared > 20, f'a perfect typist only cleared {cleared} words'\nassert state['level'] > 3, f\"and only reached level {state['level']}\""
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Every function is yours now. Type at the sky — or press Type ▶ if you would rather watch."
        }
    }
];
