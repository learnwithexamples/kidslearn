/* ============================================================
   wordfall-steps.js - the 12 steps of "Build Word Rain"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const WORDFALL_STEPS = [
    {
        "id": "speed_for_level",
        "fnName": "speedForLevel",
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
        "starter": "function speedForLevel(level) {\n    return START_SPEED;\n}\n",
        "answer": "function speedForLevel(level) {\n    const speed = START_SPEED + (level - 1) * SPEED_STEP;\n    return speed > MAX_SPEED ? MAX_SPEED : speed;\n}\n",
        "hints": [
            "(level - 1) is what makes level 1 come out at exactly START_SPEED.",
            "Math.min(speed, MAX_SPEED) does the ceiling in one go.",
            "return speed > MAX_SPEED ? MAX_SPEED : speed;"
        ],
        "tests": [
            {
                "name": "Level 1 is the starting speed",
                "code": "assert(speedForLevel(1) === START_SPEED, 'got ' + speedForLevel(1) + ', expected ' + START_SPEED);"
            },
            {
                "name": "Level 2 is one step faster",
                "code": "assert(speedForLevel(2) === START_SPEED + SPEED_STEP, 'got ' + speedForLevel(2));"
            },
            {
                "name": "Level 5 is four steps faster",
                "code": "assert(speedForLevel(5) === START_SPEED + 4 * SPEED_STEP, 'got ' + speedForLevel(5));"
            },
            {
                "name": "It never stops getting harder — until the ceiling",
                "code": "for (let level = 1; level < 20; level++) {\n    assert(speedForLevel(level + 1) >= speedForLevel(level), 'level ' + (level + 1) + ' was slower than level ' + level);\n}"
            },
            {
                "name": "A very high level is capped",
                "code": "assert(speedForLevel(500) === MAX_SPEED, 'got ' + speedForLevel(500) + ' — did you forget the ceiling?');"
            },
            {
                "name": "Nothing ever goes over the ceiling",
                "code": "for (let level = 1; level < 300; level++) {\n    assert(speedForLevel(level) <= MAX_SPEED, 'level ' + level + ' reached ' + speedForLevel(level));\n}"
            },
            {
                "name": "A word still takes a moment to fall, even at the top speed",
                "code": "const seconds = GROUND_Y / speedForLevel(999);\nassert(seconds > 1.5, 'at the hardest level a word falls in ' + seconds.toFixed(1) + ' seconds — nobody could type that fast');"
            }
        ],
        "demo": {
            "kind": "pace",
            "caption": "Press Level + and watch the words come down harder. The number under the sky is your function."
        }
    },
    {
        "id": "gap_for_level",
        "fnName": "gapForLevel",
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
        "starter": "function gapForLevel(level) {\n    return START_GAP;\n}\n",
        "answer": "function gapForLevel(level) {\n    const gap = START_GAP - (level - 1) * GAP_STEP;\n    return gap < MIN_GAP ? MIN_GAP : gap;\n}\n",
        "hints": [
            "This one SUBTRACTS where the last one added.",
            "Math.max(gap, MIN_GAP) does the floor in one go.",
            "return gap < MIN_GAP ? MIN_GAP : gap;"
        ],
        "tests": [
            {
                "name": "Level 1 waits the full gap",
                "code": "assert(gapForLevel(1) === START_GAP, 'got ' + gapForLevel(1));"
            },
            {
                "name": "Level 2 waits one step less",
                "code": "assert(gapForLevel(2) === START_GAP - GAP_STEP, 'got ' + gapForLevel(2));"
            },
            {
                "name": "The wait keeps shrinking",
                "code": "for (let level = 1; level < 20; level++) {\n    assert(gapForLevel(level + 1) <= gapForLevel(level), 'level ' + (level + 1) + ' waited longer than level ' + level);\n}"
            },
            {
                "name": "A very high level hits the floor",
                "code": "assert(gapForLevel(500) === MIN_GAP, 'got ' + gapForLevel(500) + ' — did you forget the floor?');"
            },
            {
                "name": "The wait is never zero, and never negative",
                "code": "for (let level = 1; level < 300; level++) {\n    assert(gapForLevel(level) >= MIN_GAP, 'level ' + level + ' asked for a gap of ' + gapForLevel(level));\n    assert(gapForLevel(level) > 0, 'a gap of ' + gapForLevel(level) + ' would drop a word every single frame');\n}"
            },
            {
                "name": "It is the mirror of speedForLevel",
                "code": "assert(gapForLevel(1) > gapForLevel(10), 'higher levels should wait less');\nassert(speedForLevel(1) < speedForLevel(10), 'and fall faster');"
            },
            {
                "name": "Even at the floor there is time to type a word",
                "code": "const arriving = MIN_GAP / 1000;\nassert(arriving > 0.3, 'a word every ' + arriving.toFixed(2) + ' seconds is not a game, it is a wall');"
            }
        ],
        "demo": {
            "kind": "pace",
            "caption": "The second number is this function — how long the sky waits before the next word."
        }
    },
    {
        "id": "word_width",
        "fnName": "wordWidth",
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
        "starter": "function wordWidth(text) {\n    return 0;\n}\n",
        "answer": "function wordWidth(text) {\n    return text.length * LETTER_WIDTH;\n}\n",
        "hints": [
            "text.length is how many letters there are.",
            "One multiplication is all it takes.",
            "return text.length * LETTER_WIDTH;"
        ],
        "tests": [
            {
                "name": "A three-letter word",
                "code": "assert(wordWidth('cat') === 3 * LETTER_WIDTH, 'got ' + wordWidth('cat'));"
            },
            {
                "name": "A seven-letter word",
                "code": "assert(wordWidth('rainbow') === 7 * LETTER_WIDTH, 'got ' + wordWidth('rainbow'));"
            },
            {
                "name": "An empty word takes no room",
                "code": "assert(wordWidth('') === 0);"
            },
            {
                "name": "A longer word is wider",
                "code": "assert(wordWidth('elephant') > wordWidth('ant'));"
            },
            {
                "name": "Two words of the same length are the same width",
                "code": "assert(wordWidth('cat') === wordWidth('dog'), 'that is what monospace means — every letter the same');"
            },
            {
                "name": "Every word in the game fits on the screen",
                "code": "for (const word of WORD_POOL) {\n    assert(wordWidth(word) < FIELD_WIDTH - SKY_MARGIN * 2, '\"' + word + '\" is ' + wordWidth(word) + 'px wide, but the sky is only ' + FIELD_WIDTH + 'px');\n}"
            },
            {
                "name": "Widths add up the way you would expect",
                "code": "assert(wordWidth('cat') + wordWidth('dog') === wordWidth('catdog'));"
            }
        ],
        "demo": {
            "kind": "sizes",
            "caption": "Five words, each in a box exactly as wide as your function says."
        }
    },
    {
        "id": "word_for_level",
        "fnName": "wordForLevel",
        "title": "Pick a word",
        "adds": "Longer words start arriving.",
        "intro": "<p>Level 1 should drop <em>cat</em> and <em>sun</em>. Level 20 should drop <em>thunder</em> and <em>lantern</em>. So the pool of words a level may use grows as you go.</p><p>Work out the longest word this level is allowed — three letters at level 1, one more every two levels, never past seven — then keep only the words that short and pick one at random.</p><p>This is <strong>filter then choose</strong>, and it turns up everywhere: narrow the list down to what is allowed, then pick from what is left. Doing it the other way round — picking first and checking afterwards — means sometimes picking again, and again, and you can never say how long that will take.</p><p>Two things guard it. The player can bring their own list of words — a spelling lesson — so take a <code>pool</code> and fall back to the game's own when there is not one. And if <em>nothing</em> in that list is short enough, use the whole list rather than filtering it down to nothing: picking at random from an empty list is a crash, and a vocabulary lesson may not hold a single three-letter word.</p>",
        "spec": {
            "input": "level — 1, 2, 3 … pool — the words to choose from, or nothing for the game's own.",
            "output": "one word from WORD_POOL",
            "algorithm": [
                "Choose from the pool if there is one, or WORD_POOL if not.",
                "The longest allowed is 3 + (level − 1) ÷ 2, rounded down — but never more than 7.",
                "Keep only the words that short.",
                "If that left nothing at all, use the whole list instead.",
                "Pick one of those at random."
            ]
        },
        "starter": "function wordForLevel(level, pool) {\n    return WORD_POOL[0];\n}\n",
        "answer": "function wordForLevel(level, pool) {\n    const from = (pool && pool.length > 0) ? pool : WORD_POOL;\n\n    let longest = 3 + Math.floor((level - 1) / 2);\n    if (longest > 7) { longest = 7; }\n\n    let choices = from.filter(function (word) { return word.length <= longest; });\n    if (choices.length === 0) { choices = from; }\n\n    return choices[Math.floor(Math.random() * choices.length)];\n}\n",
        "hints": [
            "Work out which list to use FIRST, then do everything else to that.",
            "Math.floor((level - 1) / 2) grows by one every two levels.",
            "After filtering, check for an empty list before you pick from it."
        ],
        "tests": [
            {
                "name": "It always gives back a real word",
                "code": "for (let i = 0; i < 40; i++) {\n    const word = wordForLevel(3);\n    assert(WORD_POOL.indexOf(word) !== -1, '\"' + word + '\" is not one of the game\\'s words');\n}"
            },
            {
                "name": "Level 1 only drops three-letter words",
                "code": "for (let i = 0; i < 60; i++) {\n    const word = wordForLevel(1);\n    assert(word.length === 3, 'level 1 gave \"' + word + '\" — too long for a beginner');\n}"
            },
            {
                "name": "Level 3 allows four letters",
                "code": "let seen = 0;\nfor (let i = 0; i < 200; i++) {\n    const word = wordForLevel(3);\n    assert(word.length <= 4, 'level 3 gave \"' + word + '\"');\n    if (word.length === 4) { seen = seen + 1; }\n}\nassert(seen > 0, 'level 3 never used a four-letter word');"
            },
            {
                "name": "The words get longer as the levels go up",
                "code": "const longestAt = function (level) {\n    let longest = 0;\n    for (let i = 0; i < 400; i++) { longest = Math.max(longest, wordForLevel(level).length); }\n    return longest;\n};\nassert(longestAt(9) > longestAt(1), 'level 9 should reach further than level 1');"
            },
            {
                "name": "Nothing is ever longer than seven letters",
                "code": "for (let i = 0; i < 300; i++) {\n    assert(wordForLevel(500).length <= 7, 'a very high level gave a word of ' + wordForLevel(500).length + ' letters');\n}"
            },
            {
                "name": "It really is random",
                "code": "const seen = {};\nfor (let i = 0; i < 200; i++) { seen[wordForLevel(4)] = true; }\nassert(Object.keys(seen).length > 8, 'only ' + Object.keys(seen).length + ' different words in 200 tries');"
            },
            {
                "name": "Every word it picks fits on the screen",
                "code": "for (let i = 0; i < 100; i++) {\n    assert(wordWidth(wordForLevel(30)) < FIELD_WIDTH - SKY_MARGIN * 2);\n}"
            },
            {
                "name": "A list of your own is used instead",
                "code": "const mine = ['alpha', 'bravo', 'charlie'];\nfor (let i = 0; i < 60; i++) {\n    assert(mine.indexOf(wordForLevel(9, mine)) !== -1, 'it picked a word that was not on my list');\n}"
            },
            {
                "name": "A list with nothing short enough still works",
                "code": "const long = ['photosynthesis', 'constellation'];\nfor (let i = 0; i < 40; i++) {\n    const word = wordForLevel(1, long);\n    assert(long.indexOf(word) !== -1, 'level 1 allows three letters and my list has none — it must use the whole list rather than pick from nothing');\n}"
            }
        ],
        "demo": {
            "kind": "sizes",
            "caption": "Press New words — these come from your function, one for each length it allows."
        }
    },
    {
        "id": "make_word",
        "fnName": "makeWord",
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
        "starter": "function makeWord(text, x) {\n    return {};\n}\n",
        "answer": "function makeWord(text, x) {\n    return { text: text, x: x, y: 0 };\n}\n",
        "hints": [
            "Three properties: text, x and y.",
            "y always starts at 0, whatever the level.",
            "return { text: text, x: x, y: 0 };"
        ],
        "tests": [
            {
                "name": "It remembers what it says",
                "code": "assert(makeWord('cat', 50).text === 'cat');"
            },
            {
                "name": "It remembers where across it is",
                "code": "assert(makeWord('cat', 50).x === 50);"
            },
            {
                "name": "It always starts at the top",
                "code": "assert(makeWord('cat', 50).y === 0, 'y is ' + makeWord('cat', 50).y);\nassert(makeWord('rainbow', 200).y === 0);"
            },
            {
                "name": "Two words are two separate things",
                "code": "const a = makeWord('cat', 10);\nconst b = makeWord('dog', 20);\na.y = 100;\nassert(b.y === 0, 'moving one word moved the other — they must not share');"
            },
            {
                "name": "It works for any word in the game",
                "code": "for (const word of WORD_POOL) {\n    const made = makeWord(word, 0);\n    assert(made.text === word && made.y === 0);\n}"
            },
            {
                "name": "A brand-new word has not landed",
                "code": "assert(hasLanded(makeWord('cat', 50)) === false, 'a word at the top of the sky cannot have landed');"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Press Drop. Every word you see was built by your function."
        }
    },
    {
        "id": "spawn_word",
        "fnName": "spawnWord",
        "title": "Drop it somewhere",
        "adds": "The rain starts falling on its own.",
        "intro": "<p>Now put a word in the sky. Pick one for the level, then pick somewhere across to drop it.</p><p>The catch is the <strong>right-hand edge</strong>. Drop a seven-letter word at x = 330 and most of it hangs off the side of the screen where nobody can read it — and you cannot type what you cannot read. So the random position must stop early enough that the whole word still fits.</p><p>Work out the <em>room</em> first: the width of the sky, less the width of the word, less a margin at each side. Then drop it anywhere from the left margin to the left margin plus that room.</p>",
        "spec": {
            "input": "state — the whole game",
            "output": "the word that was dropped (and it is added to state.words)",
            "algorithm": [
                "Ask wordForLevel for a word, handing it state.pool — the player's own list.",
                "Room = FIELD_WIDTH − wordWidth(text) − SKY_MARGIN × 2. Never let it go below 0.",
                "Pick x anywhere from SKY_MARGIN to SKY_MARGIN + room.",
                "Make the word, add it to state.words, and give it back."
            ]
        },
        "starter": "function spawnWord(state) {\n    // pick a word, pick a place, drop it\n}\n",
        "answer": "function spawnWord(state) {\n    const text = wordForLevel(state.level, state.pool);\n    let room = FIELD_WIDTH - wordWidth(text) - SKY_MARGIN * 2;\n    if (room < 0) { room = 0; }\n\n    const word = makeWord(text, SKY_MARGIN + Math.random() * room);\n    state.words.push(word);\n    return word;\n}\n",
        "hints": [
            "Use the two functions you already wrote: wordForLevel and wordWidth.",
            "Pass state.pool through, so a chosen word list is actually used.",
            "Math.random() * room gives you somewhere from 0 up to room.",
            "Do not forget state.words.push(word) — and to give the word back."
        ],
        "tests": [
            {
                "name": "It adds one word to the sky",
                "code": "const state = createGame();\nstate.words = [];\nspawnWord(state);\nassert(state.words.length === 1, 'there are ' + state.words.length + ' words');"
            },
            {
                "name": "It hands the word back too",
                "code": "const state = createGame();\nstate.words = [];\nconst word = spawnWord(state);\nassert(word === state.words[0], 'give back the very word you added');"
            },
            {
                "name": "The word starts at the top",
                "code": "const state = createGame();\nstate.words = [];\nassert(spawnWord(state).y === 0);"
            },
            {
                "name": "Dropping twice gives two words",
                "code": "const state = createGame();\nstate.words = [];\nspawnWord(state);\nspawnWord(state);\nassert(state.words.length === 2);"
            },
            {
                "name": "The whole word always fits on the screen",
                "code": "const state = createGame();\nstate.level = 40;\nfor (let i = 0; i < 300; i++) {\n    state.words = [];\n    const word = spawnWord(state);\n    assert(word.x >= 0, '\"' + word.text + '\" was dropped at x ' + word.x.toFixed(1));\n    assert(word.x + wordWidth(word.text) <= FIELD_WIDTH, '\"' + word.text + '\" hangs ' + (word.x + wordWidth(word.text) - FIELD_WIDTH).toFixed(1) + 'px off the right edge');\n}"
            },
            {
                "name": "Words land all over the sky, not in one place",
                "code": "const state = createGame();\nstate.words = [];\nlet left = 0, right = 0;\nfor (let i = 0; i < 200; i++) {\n    state.words = [];\n    const word = spawnWord(state);\n    if (word.x < FIELD_WIDTH / 2) { left = left + 1; } else { right = right + 1; }\n}\nassert(left > 30 && right > 30, 'the split was ' + left + ' left, ' + right + ' right');"
            },
            {
                "name": "It uses words the level allows",
                "code": "const state = createGame();\nstate.level = 1;\nfor (let i = 0; i < 50; i++) {\n    state.words = [];\n    assert(spawnWord(state).text.length === 3, 'level 1 should only drop three-letter words');\n}"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Press Drop and a new word appears — somewhere random, but always fully on screen."
        }
    },
    {
        "id": "move_words",
        "fnName": "moveWords",
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
        "starter": "function moveWords(state, seconds) {\n    // everything comes down\n}\n",
        "answer": "function moveWords(state, seconds) {\n    const speed = speedForLevel(state.level);\n    for (let i = 0; i < state.words.length; i++) {\n        state.words[i].y = state.words[i].y + speed * seconds;\n    }\n}\n",
        "hints": [
            "Work the speed out once, before the loop — it is the same for every word.",
            "Add to y. Do not replace it.",
            "state.words[i].y = state.words[i].y + speed * seconds;"
        ],
        "tests": [
            {
                "name": "An empty sky is fine",
                "code": "const state = createGame();\nstate.words = [];\nmoveWords(state, 0.1);\nassert(state.words.length === 0);"
            },
            {
                "name": "A word moves down",
                "code": "const state = createGame();\nstate.level = 1;\nstate.words = [makeWord('cat', 10)];\nmoveWords(state, 1);\nassert(state.words[0].y === speedForLevel(1), 'after one second it should be ' + speedForLevel(1) + ' down, but it is ' + state.words[0].y);"
            },
            {
                "name": "Down means a BIGGER y",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nmoveWords(state, 0.5);\nassert(state.words[0].y > 0, 'y is ' + state.words[0].y + ' — on a canvas, down is positive');"
            },
            {
                "name": "Every word moves, not just the first",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10), makeWord('dog', 40), makeWord('pig', 70)];\nmoveWords(state, 0.5);\nfor (const word of state.words) {\n    assert(word.y > 0, '\"' + word.text + '\" did not move');\n}"
            },
            {
                "name": "A longer frame moves them further",
                "code": "const slow = createGame();\nslow.words = [makeWord('cat', 10)];\nconst fast = createGame();\nfast.words = [makeWord('cat', 10)];\nmoveWords(slow, 0.05);\nmoveWords(fast, 0.10);\nassert(Math.abs(fast.words[0].y - slow.words[0].y * 2) < 0.0001, 'twice the time should be twice the distance');"
            },
            {
                "name": "A higher level falls faster",
                "code": "const easy = createGame();\neasy.level = 1;\neasy.words = [makeWord('cat', 10)];\nconst hard = createGame();\nhard.level = 10;\nhard.words = [makeWord('cat', 10)];\nmoveWords(easy, 1);\nmoveWords(hard, 1);\nassert(hard.words[0].y > easy.words[0].y, 'level 10 should fall faster than level 1');"
            },
            {
                "name": "Sideways is left alone",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 123)];\nmoveWords(state, 1);\nassert(state.words[0].x === 123, 'words fall straight down — x must not change');"
            },
            {
                "name": "Lots of small steps go as far as one big one",
                "code": "const many = createGame();\nmany.level = 3;\nmany.words = [makeWord('cat', 10)];\nfor (let i = 0; i < 60; i++) { moveWords(many, 1 / 60); }\nconst once = createGame();\nonce.level = 3;\nonce.words = [makeWord('cat', 10)];\nmoveWords(once, 1);\nassert(Math.abs(many.words[0].y - once.words[0].y) < 0.0001, 'the frame rate should not matter: ' + many.words[0].y.toFixed(2) + ' vs ' + once.words[0].y.toFixed(2));"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Now they fall by themselves. Press Nudge to shove them all down at once."
        }
    },
    {
        "id": "has_landed",
        "fnName": "hasLanded",
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
        "starter": "function hasLanded(word) {\n    return false;\n}\n",
        "answer": "function hasLanded(word) {\n    return word.y >= GROUND_Y;\n}\n",
        "hints": [
            "You do not need an if — a comparison is already true or false.",
            "Use >= so a word sitting exactly on the line counts as landed.",
            "return word.y >= GROUND_Y;"
        ],
        "tests": [
            {
                "name": "A word at the top has not landed",
                "code": "assert(hasLanded({ text: 'cat', x: 10, y: 0 }) === false);"
            },
            {
                "name": "A word halfway down has not landed",
                "code": "assert(hasLanded({ text: 'cat', x: 10, y: GROUND_Y / 2 }) === false);"
            },
            {
                "name": "A word on the line HAS landed",
                "code": "assert(hasLanded({ text: 'cat', x: 10, y: GROUND_Y }) === true, 'exactly on the ground counts — use >=');"
            },
            {
                "name": "A word past the line has landed",
                "code": "assert(hasLanded({ text: 'cat', x: 10, y: GROUND_Y + 20 }) === true);"
            },
            {
                "name": "One pixel short does not count",
                "code": "assert(hasLanded({ text: 'cat', x: 10, y: GROUND_Y - 1 }) === false);"
            },
            {
                "name": "It does not care how long the word is",
                "code": "assert(hasLanded({ text: 'a', x: 0, y: GROUND_Y }) === hasLanded({ text: 'lantern', x: 0, y: GROUND_Y }));"
            },
            {
                "name": "A falling word eventually lands",
                "code": "const state = createGame();\nstate.level = 1;\nstate.words = [makeWord('cat', 10)];\nlet frames = 0;\nwhile (!hasLanded(state.words[0]) && frames < 5000) {\n    moveWords(state, 1 / 60);\n    frames = frames + 1;\n}\nassert(hasLanded(state.words[0]), 'it never landed');\nassert(frames < 3000, 'it took ' + (frames / 60).toFixed(1) + ' seconds — that is a very long wait');"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Watch a word reach the hatched ground — that is the moment this function turns true."
        }
    },
    {
        "id": "remove_landed_words",
        "fnName": "removeLandedWords",
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
        "starter": "function removeLandedWords(state) {\n    return 0;\n}\n",
        "answer": "function removeLandedWords(state) {\n    const falling = [];\n    let landed = 0;\n\n    for (let i = 0; i < state.words.length; i++) {\n        if (hasLanded(state.words[i])) {\n            landed = landed + 1;\n        } else {\n            falling.push(state.words[i]);\n        }\n    }\n    state.words = falling;\n\n    if (landed > 0) {\n        state.missed = state.missed + landed;\n        state.lives = state.lives - landed;\n        if (state.lives <= 0) {\n            state.lives = 0;\n            state.isOver = true;\n        }\n    }\n    return landed;\n}\n",
        "hints": [
            "Make an empty array first and push the survivors into it.",
            "hasLanded(word) is the test — you wrote it last step.",
            "Do not let lives go negative: if they reach 0 or below, set them to 0 and end the game."
        ],
        "tests": [
            {
                "name": "An empty sky loses nothing",
                "code": "const state = createGame();\nstate.words = [];\nassert(removeLandedWords(state) === 0);"
            },
            {
                "name": "A word still falling is kept",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nassert(removeLandedWords(state) === 0);\nassert(state.words.length === 1, 'it had not landed yet');"
            },
            {
                "name": "A landed word is taken away",
                "code": "const state = createGame();\nconst word = makeWord('cat', 10);\nword.y = GROUND_Y;\nstate.words = [word];\nassert(removeLandedWords(state) === 1);\nassert(state.words.length === 0);"
            },
            {
                "name": "And it costs a life",
                "code": "const state = createGame();\nconst before = state.lives;\nconst word = makeWord('cat', 10);\nword.y = GROUND_Y;\nstate.words = [word];\nremoveLandedWords(state);\nassert(state.lives === before - 1, 'lives went from ' + before + ' to ' + state.lives);\nassert(state.missed === 1);"
            },
            {
                "name": "The ones still falling are kept, in order",
                "code": "const state = createGame();\nconst a = makeWord('aaa', 10);\nconst b = makeWord('bbb', 20); b.y = GROUND_Y;\nconst c = makeWord('ccc', 30);\nstate.words = [a, b, c];\nassert(removeLandedWords(state) === 1);\nassert(state.words.length === 2, 'kept ' + state.words.length);\nassert(state.words[0].text === 'aaa' && state.words[1].text === 'ccc', 'got ' + state.words.map(function (w) { return w.text; }).join(','));"
            },
            {
                "name": "Several landing at once cost several lives",
                "code": "const state = createGame();\nstate.lives = 5;\nstate.words = [];\nfor (let i = 0; i < 3; i++) {\n    const word = makeWord('cat', i * 40);\n    word.y = GROUND_Y + 5;\n    state.words.push(word);\n}\nassert(removeLandedWords(state) === 3);\nassert(state.lives === 2, 'lives is ' + state.lives);"
            },
            {
                "name": "Nothing is ever skipped",
                "code": "const state = createGame();\nstate.lives = 99;\nstate.words = [];\nfor (let i = 0; i < 6; i++) {\n    const word = makeWord('cat', i * 40);\n    word.y = GROUND_Y + 1;\n    state.words.push(word);\n}\nassert(removeLandedWords(state) === 6, 'only ' + state.words.length + ' were left — deleting from a list while looping over it skips items');\nassert(state.words.length === 0);"
            },
            {
                "name": "Losing the last life ends the game",
                "code": "const state = createGame();\nstate.lives = 1;\nconst word = makeWord('cat', 10);\nword.y = GROUND_Y;\nstate.words = [word];\nremoveLandedWords(state);\nassert(state.isOver === true, 'the game should be over');\nassert(state.lives === 0, 'lives is ' + state.lives + ' — it must never go negative');"
            }
        ],
        "demo": {
            "kind": "sky",
            "caption": "Let one reach the ground. It vanishes — and in the real game that is a life gone."
        }
    },
    {
        "id": "matching_word",
        "fnName": "matchingWord",
        "title": "Which one do you mean?",
        "adds": "The game reads your mind.",
        "intro": "<p>This is the clever bit, and the reason the game feels good to play.</p><p>Six words are falling. You never click one, never press Tab, never choose at all — you just start typing, and the game knows. Type <strong>c</strong> and only the words beginning with c are still in the running. Type <strong>ca</strong> and it is narrower still.</p><p>When several still match, take the one <strong>furthest down</strong> — the one in the most trouble. That is almost always the one the player meant, and it is the one they would lose a life over.</p><p>One rule beats even that: a word you have typed <strong>in full</strong> wins, wherever it is. Without it, finishing <em>graduate</em> while <em>graduation</em> hangs lower would clear nothing at all — and retyping would not help, because you would land on <em>graduation</em> again. Stuck.</p><p><code>lowestWhere</code> is written for you: give it a test, and it hands back the lowest word that passes. Ask it twice.</p><p>It is the same idea as a search box finishing your sentence: the letters themselves are the choice.</p>",
        "spec": {
            "input": "state — the whole game. typed — the letters so far.",
            "output": "the word being typed, or nothing at all",
            "algorithm": [
                "If nothing has been typed, there is no match — give back nothing.",
                "First ask lowestWhere for a word whose text IS exactly what was typed.",
                "If there is one, that is the answer.",
                "Otherwise ask lowestWhere for the lowest word that STARTS WITH the typing.",
                "Give that one back, or nothing if none matched."
            ]
        },
        "starter": "function matchingWord(state, typed) {\n    return null;\n}\n",
        "answer": "function matchingWord(state, typed) {\n    if (typed.length === 0) {\n        return null;\n    }\n\n    const finished = lowestWhere(state, function (word) { return word.text === typed; });\n    if (finished !== null) {\n        return finished;\n    }\n\n    return lowestWhere(state, function (word) { return word.text.indexOf(typed) === 0; });\n}\n",
        "hints": [
            "lowestWhere(state, test) does the searching — you only choose the test.",
            "Ask it twice: first for word.text === typed, then for a word that starts with it.",
            "word.text.indexOf(typed) === 0 means the word STARTS WITH what was typed."
        ],
        "tests": [
            {
                "name": "Typing nothing matches nothing",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nassert(matchingWord(state, '') === null);"
            },
            {
                "name": "An empty sky matches nothing",
                "code": "const state = createGame();\nstate.words = [];\nassert(matchingWord(state, 'c') === null);"
            },
            {
                "name": "One letter finds the word",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nassert(matchingWord(state, 'c').text === 'cat');"
            },
            {
                "name": "A letter that fits nothing finds nothing",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nassert(matchingWord(state, 'z') === null);"
            },
            {
                "name": "It must START with the typing, not just contain it",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nassert(matchingWord(state, 'at') === null, 'typing \"at\" must not land on \"cat\"');\nassert(matchingWord(state, 'ca').text === 'cat');"
            },
            {
                "name": "The whole word still matches itself",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nassert(matchingWord(state, 'cat').text === 'cat');"
            },
            {
                "name": "More letters narrow it down",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10), makeWord('cow', 60)];\nassert(matchingWord(state, 'c') !== null, 'both still match');\nassert(matchingWord(state, 'ca').text === 'cat');\nassert(matchingWord(state, 'co').text === 'cow');"
            },
            {
                "name": "When two match, it takes the lower one",
                "code": "const state = createGame();\nconst high = makeWord('cat', 10); high.y = 40;\nconst low = makeWord('cup', 60); low.y = 300;\nstate.words = [high, low];\nassert(matchingWord(state, 'c').text === 'cup', 'the one nearest the ground is the one in trouble');"
            },
            {
                "name": "Order in the list makes no difference",
                "code": "const high = makeWord('cat', 10); high.y = 40;\nconst low = makeWord('cup', 60); low.y = 300;\nconst one = createGame(); one.words = [high, low];\nconst two = createGame(); two.words = [low, high];\nassert(matchingWord(one, 'c').text === matchingWord(two, 'c').text);"
            },
            {
                "name": "It gives back the very word from the sky",
                "code": "const state = createGame();\nconst word = makeWord('cat', 10);\nstate.words = [word];\nassert(matchingWord(state, 'ca') === word, 'give back the word itself, not a copy of it');"
            },
            {
                "name": "A word typed IN FULL beats a longer one hanging lower",
                "code": "const state = createGame();\nconst whole = makeWord('graduate', 10); whole.y = 40;\nconst longer = makeWord('graduation', 150); longer.y = 300;\nstate.words = [whole, longer];\nassert(matchingWord(state, 'graduate').text === 'graduate', 'finishing a word must clear it, even with a longer one closer to the ground — otherwise you are stuck for ever');\nassert(matchingWord(state, 'gradua').text === 'graduation', 'half way through, the lower one is still the one in trouble');"
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
        "fnName": "typeLetter",
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
        "starter": "function typeLetter(state, letter) {\n    return false;\n}\n",
        "answer": "function typeLetter(state, letter) {\n    if (state.isOver || state.isPaused) {\n        return false;\n    }\n    if (String(letter).length !== 1) {\n        return false;\n    }\n\n    const wanted = state.typed + letter;\n    if (matchingWord(state, wanted) === null) {\n        state.slips = state.slips + 1;\n        return false;\n    }\n\n    state.typed = wanted;\n    state.keystrokes = state.keystrokes + 1;\n    return true;\n}\n",
        "hints": [
            "Build the would-be typing in a variable first: state.typed + letter.",
            "Then ask matchingWord about THAT, before changing anything.",
            "Only set state.typed once you know the letter is worth keeping."
        ],
        "tests": [
            {
                "name": "A letter that fits is taken",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = '';\nassert(typeLetter(state, 'c') === true);\nassert(state.typed === 'c');"
            },
            {
                "name": "A letter that fits nothing is refused",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = '';\nassert(typeLetter(state, 'z') === false);\nassert(state.typed === '', 'the typing should be untouched');"
            },
            {
                "name": "A refused letter is counted as a slip",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = '';\nstate.slips = 0;\ntypeLetter(state, 'z');\nassert(state.slips === 1, 'slips is ' + state.slips);"
            },
            {
                "name": "Letters build up",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = '';\ntypeLetter(state, 'c');\ntypeLetter(state, 'a');\ntypeLetter(state, 't');\nassert(state.typed === 'cat', 'got \"' + state.typed + '\"');"
            },
            {
                "name": "A wrong letter halfway through is refused too",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = 'c';\nassert(typeLetter(state, 'x') === false);\nassert(state.typed === 'c', 'you should still be on \"c\", not \"cx\"');"
            },
            {
                "name": "A finished game takes no letters",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = '';\nstate.isOver = true;\nassert(typeLetter(state, 'c') === false);\nassert(state.typed === '');"
            },
            {
                "name": "A paused game takes no letters",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = '';\nstate.isPaused = true;\nassert(typeLetter(state, 'c') === false);"
            },
            {
                "name": "Two words starting the same both stay possible",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10), makeWord('cow', 60)];\nstate.typed = '';\nassert(typeLetter(state, 'c') === true);\nassert(typeLetter(state, 'o') === true, 'after \"c\", both cat and cow are still going — \"o\" must be allowed');\nassert(state.typed === 'co');"
            },
            {
                "name": "You can always type a word right through",
                "code": "const state = createGame();\nstate.words = [makeWord('lantern', 10)];\nstate.typed = '';\nfor (const letter of 'lantern') {\n    assert(typeLetter(state, letter) === true, 'it refused \"' + letter + '\" of lantern');\n}\nassert(state.typed === 'lantern');"
            }
        ],
        "demo": {
            "kind": "match",
            "caption": "Each press of Type ▶ is one call to your function — watch the black letters grow."
        }
    },
    {
        "id": "zap_word",
        "fnName": "zapWord",
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
        "starter": "function zapWord(state) {\n    return false;\n}\n",
        "answer": "function zapWord(state) {\n    const target = matchingWord(state, state.typed);\n    if (target === null || target.text !== state.typed) {\n        return false;\n    }\n\n    state.words = state.words.filter(function (word) { return word !== target; });\n    state.score = state.score + target.text.length * POINTS_PER_LETTER;\n    state.cleared = state.cleared + 1;\n    state.typed = '';\n\n    if (state.cleared % WORDS_PER_LEVEL === 0) {\n        state.level = state.level + 1;\n    }\n    return true;\n}\n",
        "hints": [
            "target.text !== state.typed is the 'not finished yet' guard.",
            "filter keeps everything the test says true for — so keep the words that are NOT the target.",
            "state.cleared % WORDS_PER_LEVEL === 0 is 'every sixth word'."
        ],
        "tests": [
            {
                "name": "A half-typed word is not cleared",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = 'ca';\nassert(zapWord(state) === false);\nassert(state.words.length === 1, 'it should still be falling');"
            },
            {
                "name": "Typing nothing clears nothing",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = '';\nassert(zapWord(state) === false);"
            },
            {
                "name": "A finished word disappears",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = 'cat';\nassert(zapWord(state) === true);\nassert(state.words.length === 0);"
            },
            {
                "name": "And the typing is cleared for the next one",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10)];\nstate.typed = 'cat';\nzapWord(state);\nassert(state.typed === '', 'got \"' + state.typed + '\"');"
            },
            {
                "name": "A longer word is worth more",
                "code": "const short = createGame();\nshort.words = [makeWord('cat', 10)];\nshort.typed = 'cat';\nshort.score = 0;\nzapWord(short);\nconst long = createGame();\nlong.words = [makeWord('lantern', 10)];\nlong.typed = 'lantern';\nlong.score = 0;\nzapWord(long);\nassert(long.score > short.score, 'lantern scored ' + long.score + ', cat scored ' + short.score);\nassert(short.score === 3 * POINTS_PER_LETTER);"
            },
            {
                "name": "Only that word goes",
                "code": "const state = createGame();\nstate.words = [makeWord('cat', 10), makeWord('dog', 60), makeWord('pig', 110)];\nstate.typed = 'dog';\nzapWord(state);\nassert(state.words.length === 2, 'kept ' + state.words.length);\nassert(state.words[0].text === 'cat' && state.words[1].text === 'pig');"
            },
            {
                "name": "Two words saying the same thing do not both vanish",
                "code": "const state = createGame();\nconst first = makeWord('cat', 10);\nconst second = makeWord('cat', 200);\nsecond.y = 100;\nstate.words = [first, second];\nstate.typed = 'cat';\nzapWord(state);\nassert(state.words.length === 1, 'both went — compare the words themselves, not what they say');"
            },
            {
                "name": "Six words takes you up a level",
                "code": "const state = createGame();\nstate.level = 1;\nstate.cleared = 0;\nfor (let i = 0; i < WORDS_PER_LEVEL; i++) {\n    state.words = [makeWord('cat', 10)];\n    state.typed = 'cat';\n    zapWord(state);\n}\nassert(state.level === 2, 'level is ' + state.level + ' after ' + WORDS_PER_LEVEL + ' words');"
            },
            {
                "name": "But five words does not",
                "code": "const state = createGame();\nstate.level = 1;\nstate.cleared = 0;\nfor (let i = 0; i < WORDS_PER_LEVEL - 1; i++) {\n    state.words = [makeWord('cat', 10)];\n    state.typed = 'cat';\n    zapWord(state);\n}\nassert(state.level === 1, 'level is ' + state.level + ' too early');"
            },
            {
                "name": "A whole game can be played",
                "code": "const state = createGame();\nlet cleared = 0;\nfor (let frame = 0; frame < 4000 && !state.isOver; frame++) {\n    updateGame(state, 16);\n    let lowest = null;\n    for (const word of state.words) {\n        if (state.typed.length > 0 && word.text.indexOf(state.typed) !== 0) { continue; }\n        if (lowest === null || word.y > lowest.y) { lowest = word; }\n    }\n    if (lowest !== null) {\n        typeLetter(state, lowest.text.charAt(state.typed.length));\n        if (zapWord(state)) { cleared = cleared + 1; }\n    }\n}\nassert(cleared > 20, 'a perfect typist only cleared ' + cleared + ' words');\nassert(state.level > 3, 'and only reached level ' + state.level);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Every function is yours now. Type at the sky — or press Type ▶ if you would rather watch."
        }
    }
];
