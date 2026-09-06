/* ============================================================
   reaction-steps.js - the 5 steps of "Build Reaction Test"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const REACTION_STEPS = [
    {
        "id": "random_delay",
        "fnName": "randomDelay",
        "title": "Make it unpredictable",
        "adds": "The wait is never the same twice.",
        "intro": "<p>The whole test depends on the player not knowing when the signal will come.</p><p>Wait exactly two seconds every time and after three goes anyone can press on the beat with their eyes shut — and score 20 ms, which nobody can really do. A random wait between 1.5 and 4.5 seconds makes that impossible.</p>",
        "spec": {
            "input": "nothing",
            "output": "milliseconds, between SHORTEST_WAIT and LONGEST_WAIT",
            "algorithm": [
                "Work out how much room there is between the two: LONGEST_WAIT - SHORTEST_WAIT.",
                "Take a random slice of that.",
                "Add it to SHORTEST_WAIT."
            ]
        },
        "starter": "function randomDelay() {\n    // somewhere between the shortest and the longest wait\n}\n",
        "answer": "function randomDelay() {\n    return SHORTEST_WAIT + Math.random() * (LONGEST_WAIT - SHORTEST_WAIT);\n}\n",
        "hints": [
            "Math.random() gives a decimal from 0 up to (not including) 1.",
            "Multiply it by the gap between the two limits.",
            "return SHORTEST_WAIT + Math.random() * (LONGEST_WAIT - SHORTEST_WAIT);"
        ],
        "tests": [
            {
                "name": "It never comes back too short",
                "code": "for (let i = 0; i < 500; i++) {\n    assert(randomDelay() >= SHORTEST_WAIT, 'gave ' + randomDelay());\n}"
            },
            {
                "name": "It never comes back too long",
                "code": "for (let i = 0; i < 500; i++) {\n    assert(randomDelay() <= LONGEST_WAIT, 'gave ' + randomDelay());\n}"
            },
            {
                "name": "Two waits in a row are different",
                "code": "assert(randomDelay() !== randomDelay(), 'a predictable wait would let a player press with their eyes shut');"
            },
            {
                "name": "It really does use the whole range",
                "code": "let shortest = LONGEST_WAIT;\nlet longest = SHORTEST_WAIT;\nfor (let i = 0; i < 800; i++) {\n    const wait = randomDelay();\n    if (wait < shortest) { shortest = wait; }\n    if (wait > longest) { longest = wait; }\n}\nassert(shortest < SHORTEST_WAIT + 400, 'the short waits never happen');\nassert(longest > LONGEST_WAIT - 400, 'the long waits never happen');"
            },
            {
                "name": "The average lands in the middle",
                "code": "let total = 0;\nfor (let i = 0; i < 2000; i++) { total = total + randomDelay(); }\nconst average = total / 2000;\nconst middle = (SHORTEST_WAIT + LONGEST_WAIT) / 2;\nassert(Math.abs(average - middle) < 300, 'the average was ' + Math.round(average) + ' but should be near ' + middle);"
            }
        ],
        "demo": {
            "kind": "phases",
            "caption": "Press to arm it, then wait. The delay is different every time."
        }
    },
    {
        "id": "update_game",
        "fnName": "updateGame",
        "title": "The clock",
        "adds": "The signal arrives by itself.",
        "intro": "<p>One clock, two completely different jobs — and which one it is doing depends on the phase.</p><p>While <strong>waiting</strong>, it is counting down to the signal. The instant it arrives, the phase becomes 'go' and the clock is <em>reset to zero</em> — because from that moment on the same clock is measuring the player.</p><p>That single line, <code>elapsed = 0</code>, is what turns a countdown into a stopwatch.</p>",
        "spec": {
            "input": "state, elapsedMs",
            "output": "nothing; it moves the game along",
            "algorithm": [
                "Do nothing at all if the game is paused.",
                "If the phase is 'waiting': add the time on. Once it reaches waitFor, switch to 'go' AND set the clock back to 0.",
                "If the phase is 'go': just add the time on — that is the player's score ticking up.",
                "In any other phase, nothing happens."
            ]
        },
        "starter": "function updateGame(state, elapsedMs) {\n    // waiting: count down to the signal\n    // go: count up the player's time\n}\n",
        "answer": "function updateGame(state, elapsedMs) {\n    if (state.isPaused) {\n        return;\n    }\n\n    if (state.phase === 'waiting') {\n        state.elapsed = state.elapsed + elapsedMs;\n        if (state.elapsed >= state.waitFor) {\n            state.phase = 'go';\n            state.elapsed = 0;\n        }\n    } else if (state.phase === 'go') {\n        state.elapsed = state.elapsed + elapsedMs;\n    }\n}\n",
        "hints": [
            "Two branches: one for 'waiting' and one for 'go'.",
            "Do not forget state.elapsed = 0 when the signal comes.",
            "Every other phase does nothing at all."
        ],
        "tests": [
            {
                "name": "Waiting counts up towards the signal",
                "code": "const state = createGame();\nstate.phase = 'waiting';\nstate.waitFor = 1000;\nstate.elapsed = 0;\nupdateGame(state, 400);\nassert(state.elapsed === 400);\nassert(state.phase === 'waiting', 'it is not time yet');"
            },
            {
                "name": "The signal comes when the wait is up",
                "code": "const state = createGame();\nstate.phase = 'waiting';\nstate.waitFor = 1000;\nstate.elapsed = 0;\nupdateGame(state, 1200);\nassert(state.phase === 'go', 'phase is ' + state.phase);"
            },
            {
                "name": "The clock restarts at the signal",
                "code": "const state = createGame();\nstate.phase = 'waiting';\nstate.waitFor = 1000;\nstate.elapsed = 0;\nupdateGame(state, 1200);\nassert(state.elapsed === 0, 'elapsed is ' + state.elapsed + ' — the stopwatch must start from zero, or the player gets the whole wait added to their time');"
            },
            {
                "name": "On 'go' the clock counts the player",
                "code": "const state = createGame();\nstate.phase = 'go';\nstate.elapsed = 0;\nupdateGame(state, 150);\nupdateGame(state, 100);\nassert(state.elapsed === 250);"
            },
            {
                "name": "Nothing happens while showing a result",
                "code": "const state = createGame();\nstate.phase = 'result';\nstate.elapsed = 0;\nupdateGame(state, 500);\nassert(state.elapsed === 0);"
            },
            {
                "name": "Nothing happens before the game has begun",
                "code": "const state = createGame();\nupdateGame(state, 500);\nassert(state.phase === 'ready');"
            },
            {
                "name": "A paused game is frozen",
                "code": "const state = createGame();\nstate.phase = 'go';\nstate.elapsed = 0;\nstate.isPaused = true;\nupdateGame(state, 500);\nassert(state.elapsed === 0);"
            },
            {
                "name": "A whole wait plays out sensibly",
                "code": "const state = createGame();\nstate.phase = 'waiting';\nstate.waitFor = 2000;\nstate.elapsed = 0;\nlet frames = 0;\nfor (let i = 0; i < 500; i++) {\n    updateGame(state, 16);\n    if (state.phase === 'go') { break; }\n    frames = frames + 1;\n}\nassert(state.phase === 'go', 'the signal never came');\nassert(frames > 100 && frames < 140, 'two seconds at 16 ms a frame is about 125 frames, but it took ' + frames);"
            }
        ],
        "demo": {
            "kind": "phases",
            "caption": "Press, then wait for the black. Or press Skip the wait to hurry it along."
        },
        "warning": "Reset the clock to zero when the signal comes. Forget that one line and every score includes the whole wait — three thousand milliseconds instead of three hundred."
    },
    {
        "id": "press",
        "fnName": "press",
        "title": "The button",
        "adds": "The game works!",
        "intro": "<p>One button, and it means five different things depending on the phase. That is what makes this game a good place to meet the idea.</p><p>The interesting case is 'waiting'. A press there is a <strong>false start</strong>: it does not count, it does not score, and it certainly does not become a very fast time. Miss that branch and the whole game can be beaten by holding the space bar down.</p>",
        "spec": {
            "input": "state",
            "output": "the phase the game has moved into",
            "algorithm": [
                "Do nothing if the game is paused.",
                "'ready' → start waiting.",
                "'waiting' → that is a false start: phase becomes 'toosoon' and count it.",
                "'go' → round the elapsed time, remember it, keep only the last HISTORY_LENGTH, count the attempt, and show the result.",
                "Anything else → start waiting again."
            ]
        },
        "starter": "function press(state) {\n    // what a press means depends on the phase\n}\n",
        "answer": "function press(state) {\n    if (state.isPaused) {\n        return state.phase;\n    }\n\n    if (state.phase === 'ready') {\n        startWaiting(state);\n    } else if (state.phase === 'waiting') {\n        state.phase = 'toosoon';\n        state.falseStarts = state.falseStarts + 1;\n    } else if (state.phase === 'go') {\n        state.lastTime = Math.round(state.elapsed);\n        state.times.push(state.lastTime);\n        if (state.times.length > HISTORY_LENGTH) {\n            state.times.shift();\n        }\n        state.attempts = state.attempts + 1;\n        state.phase = 'result';\n    } else {\n        startWaiting(state);\n    }\n    return state.phase;\n}\n",
        "hints": [
            "startWaiting(state) is written for you — it picks a fresh delay.",
            "shift() takes the OLDEST time off the front of the list.",
            "The last branch covers both 'result' and 'toosoon': go again."
        ],
        "tests": [
            {
                "name": "The first press arms the test",
                "code": "const state = createGame();\nassert(press(state) === 'waiting');"
            },
            {
                "name": "Pressing too early is a false start",
                "code": "const state = createGame();\npress(state);\nassert(press(state) === 'toosoon', 'phase is ' + state.phase);\nassert(state.falseStarts === 1);"
            },
            {
                "name": "A false start does not score",
                "code": "const state = createGame();\npress(state);\npress(state);\nassert(state.times.length === 0, 'jumping the gun must not count as a very fast time');\nassert(state.attempts === 0);"
            },
            {
                "name": "Pressing on the signal records the time",
                "code": "const state = createGame();\nstate.phase = 'go';\nstate.elapsed = 237.4;\nassert(press(state) === 'result');\nassert(state.lastTime === 237, 'gave ' + state.lastTime);\nassert(state.times[0] === 237);"
            },
            {
                "name": "A recorded go counts as an attempt",
                "code": "const state = createGame();\nstate.phase = 'go';\nstate.elapsed = 300;\npress(state);\nassert(state.attempts === 1);"
            },
            {
                "name": "Pressing after a result goes again",
                "code": "const state = createGame();\nstate.phase = 'result';\nassert(press(state) === 'waiting');"
            },
            {
                "name": "Pressing after a false start goes again",
                "code": "const state = createGame();\nstate.phase = 'toosoon';\nassert(press(state) === 'waiting');"
            },
            {
                "name": "Only the last few times are kept",
                "code": "const state = createGame();\nfor (let i = 0; i < HISTORY_LENGTH + 5; i++) {\n    state.phase = 'go';\n    state.elapsed = 200 + i;\n    press(state);\n}\nassert(state.times.length === HISTORY_LENGTH, 'the list is ' + state.times.length + ' long');\nassert(state.times[state.times.length - 1] === 200 + HISTORY_LENGTH + 4, 'the newest go must be at the end');"
            },
            {
                "name": "A paused game ignores presses",
                "code": "const state = createGame();\nstate.isPaused = true;\npress(state);\nassert(state.phase === 'ready');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play it properly. Try pressing early on purpose and see what happens."
        },
        "warning": "Handle the 'waiting' press. Without that branch, a player can hold the button down and score 0 ms every time."
    },
    {
        "id": "average_time",
        "fnName": "averageTime",
        "title": "How fast are you really?",
        "adds": "The scoreboard fills in.",
        "intro": "<p>One good go might be luck. The average of the last eight is what you actually are.</p><p>And once again the whole difficulty is the empty case: at the start of a game there are no times at all, and dividing by zero is not a number. Check for it first.</p>",
        "spec": {
            "input": "state",
            "output": "the average in milliseconds, or 0 if there are none",
            "algorithm": [
                "If the list of times is empty, return 0.",
                "Add all the times up.",
                "Divide by how many there are, and round."
            ]
        },
        "starter": "function averageTime(state) {\n    // the average of state.times, or 0 if there are none\n}\n",
        "answer": "function averageTime(state) {\n    if (state.times.length === 0) {\n        return 0;\n    }\n    let total = 0;\n    for (let i = 0; i < state.times.length; i++) {\n        total = total + state.times[i];\n    }\n    return Math.round(total / state.times.length);\n}\n",
        "hints": [
            "Check for an empty list BEFORE you divide.",
            "Add the times up in a loop, then divide by state.times.length.",
            "Math.round(...) gives a whole number of milliseconds."
        ],
        "tests": [
            {
                "name": "No goes gives 0",
                "code": "const state = createGame();\nassert(averageTime(state) === 0, 'gave ' + averageTime(state) + ' — an empty list must not be divided by');"
            },
            {
                "name": "One go is its own average",
                "code": "const state = createGame();\nstate.times = [240];\nassert(averageTime(state) === 240);"
            },
            {
                "name": "Two goes average out",
                "code": "const state = createGame();\nstate.times = [200, 300];\nassert(averageTime(state) === 250);"
            },
            {
                "name": "Four goes average out",
                "code": "const state = createGame();\nstate.times = [240, 310, 195, 420];\nassert(averageTime(state) === 291, 'gave ' + averageTime(state));"
            },
            {
                "name": "The answer is a whole number",
                "code": "const state = createGame();\nstate.times = [200, 201];\nassert(averageTime(state) === Math.round(averageTime(state)));"
            },
            {
                "name": "The average sits between the fastest and the slowest",
                "code": "const state = createGame();\nstate.times = [180, 260, 310, 420, 600];\nconst average = averageTime(state);\nassert(average >= bestTime(state), 'the average cannot be faster than your best go');\nassert(average <= 600, 'nor slower than your worst');"
            }
        ],
        "demo": {
            "kind": "stats",
            "caption": "Add fast and slow goes with the buttons and watch the average move."
        }
    },
    {
        "id": "rating",
        "fnName": "rating",
        "title": "Say something nice",
        "adds": "The game talks back.",
        "intro": "<p>A number on its own means very little to a seven-year-old. \"quick\" means a lot.</p><p>This is a ladder of bands, and the order is the whole trick: check the fastest first. Write them the other way round and every single time would come back as \"were you asleep?\", because every number under 200 is also under 550.</p>",
        "spec": {
            "input": "milliseconds",
            "output": "a short description",
            "algorithm": [
                "Under 200 → 'lightning!'",
                "Under 250 → 'very quick'",
                "Under 320 → 'quick'",
                "Under 400 → 'not bad'",
                "Under 550 → 'a bit slow'",
                "Anything else → 'were you asleep?'"
            ]
        },
        "starter": "function rating(milliseconds) {\n    // a ladder of bands — fastest first!\n}\n",
        "answer": "function rating(milliseconds) {\n    if (milliseconds < 200) { return 'lightning!'; }\n    if (milliseconds < 250) { return 'very quick'; }\n    if (milliseconds < 320) { return 'quick'; }\n    if (milliseconds < 400) { return 'not bad'; }\n    if (milliseconds < 550) { return 'a bit slow'; }\n    return 'were you asleep?';\n}\n",
        "hints": [
            "Six lines, each one an if with a return.",
            "The order matters: fastest band first.",
            "The last one needs no if at all — anything that got that far is slow."
        ],
        "tests": [
            {
                "name": "150 ms is lightning",
                "code": "assert(rating(150) === 'lightning!');"
            },
            {
                "name": "230 ms is very quick",
                "code": "assert(rating(230) === 'very quick');"
            },
            {
                "name": "300 ms is quick",
                "code": "assert(rating(300) === 'quick');"
            },
            {
                "name": "380 ms is not bad",
                "code": "assert(rating(380) === 'not bad');"
            },
            {
                "name": "500 ms is a bit slow",
                "code": "assert(rating(500) === 'a bit slow');"
            },
            {
                "name": "900 ms was a nap",
                "code": "assert(rating(900) === 'were you asleep?');"
            },
            {
                "name": "The bands are in the right order",
                "code": "assert(rating(199) === 'lightning!', '199 must be the top band — did you check the slow bands first?');\nassert(rating(200) === 'very quick', '200 is exactly the edge and belongs to the next band down');"
            },
            {
                "name": "A faster time is never rated worse",
                "code": "const bands = [];\nfor (let ms = 50; ms < 900; ms += 10) {\n    const band = rating(ms);\n    if (bands.length === 0 || bands[bands.length - 1] !== band) { bands.push(band); }\n}\nassert(bands.length === 6, 'there should be six bands, going from fastest to slowest — got ' + bands.length);\nassert(bands[0] === 'lightning!' && bands[5] === 'were you asleep?');"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then press SPACE and see what the game says about you."
        },
        "warning": "Fastest band first. The other way round and everybody is told they were asleep."
    }
];
