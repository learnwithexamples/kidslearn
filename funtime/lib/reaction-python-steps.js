/* ============================================================
   reaction-python-steps.js - the 5 steps of "Build Reaction Test in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const REACTION_PYTHON_STEPS = [
    {
        "id": "random_delay",
        "fnName": "random_delay",
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
        "starter": "def random_delay():\n    # somewhere between the shortest and the longest wait\n    pass\n",
        "answer": "def random_delay():\n    return random.uniform(SHORTEST_WAIT, LONGEST_WAIT)\n",
        "hints": [
            "random.uniform(a, b) gives a decimal between two numbers.",
            "One line.",
            "return random.uniform(SHORTEST_WAIT, LONGEST_WAIT)"
        ],
        "tests": [
            {
                "name": "It never comes back too short",
                "code": "for _ in range(500):\n    assert random_delay() >= SHORTEST_WAIT"
            },
            {
                "name": "It never comes back too long",
                "code": "for _ in range(500):\n    assert random_delay() <= LONGEST_WAIT"
            },
            {
                "name": "Two waits in a row are different",
                "code": "assert random_delay() != random_delay()"
            },
            {
                "name": "It really does use the whole range",
                "code": "waits = [random_delay() for _ in range(800)]\nassert min(waits) < SHORTEST_WAIT + 400, 'the short waits never happen'\nassert max(waits) > LONGEST_WAIT - 400, 'the long waits never happen'"
            },
            {
                "name": "The average lands in the middle",
                "code": "waits = [random_delay() for _ in range(2000)]\naverage = sum(waits) / len(waits)\nmiddle = (SHORTEST_WAIT + LONGEST_WAIT) / 2\nassert abs(average - middle) < 300, f'the average was {average:.0f}'"
            }
        ],
        "demo": {
            "kind": "phases",
            "caption": "Press to arm it, then wait. The delay is different every time."
        }
    },
    {
        "id": "update_game",
        "fnName": "update_game",
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
        "starter": "def update_game(state, elapsed_ms):\n    # waiting: count down to the signal\n    # go: count up the player's time\n    pass\n",
        "answer": "def update_game(state, elapsed_ms):\n    if state[\"is_paused\"]:\n        return\n\n    if state[\"phase\"] == \"waiting\":\n        state[\"elapsed\"] += elapsed_ms\n        if state[\"elapsed\"] >= state[\"wait_for\"]:\n            state[\"phase\"] = \"go\"\n            state[\"elapsed\"] = 0\n    elif state[\"phase\"] == \"go\":\n        state[\"elapsed\"] += elapsed_ms\n",
        "hints": [
            "Two branches: one for 'waiting' and one for 'go'.",
            "Do not forget state['elapsed'] = 0 when the signal comes.",
            "Every other phase does nothing at all."
        ],
        "tests": [
            {
                "name": "Waiting counts up towards the signal",
                "code": "state = create_game()\nstate.update({'phase': 'waiting', 'wait_for': 1000, 'elapsed': 0})\nupdate_game(state, 400)\nassert state['elapsed'] == 400 and state['phase'] == 'waiting'"
            },
            {
                "name": "The signal comes when the wait is up",
                "code": "state = create_game()\nstate.update({'phase': 'waiting', 'wait_for': 1000, 'elapsed': 0})\nupdate_game(state, 1200)\nassert state['phase'] == 'go'"
            },
            {
                "name": "The clock restarts at the signal",
                "code": "state = create_game()\nstate.update({'phase': 'waiting', 'wait_for': 1000, 'elapsed': 0})\nupdate_game(state, 1200)\nassert state['elapsed'] == 0, 'the stopwatch must start from zero'"
            },
            {
                "name": "On 'go' the clock counts the player",
                "code": "state = create_game()\nstate.update({'phase': 'go', 'elapsed': 0})\nupdate_game(state, 150)\nupdate_game(state, 100)\nassert state['elapsed'] == 250"
            },
            {
                "name": "Nothing happens while showing a result",
                "code": "state = create_game()\nstate.update({'phase': 'result', 'elapsed': 0})\nupdate_game(state, 500)\nassert state['elapsed'] == 0"
            },
            {
                "name": "Nothing happens before the game has begun",
                "code": "state = create_game()\nupdate_game(state, 500)\nassert state['phase'] == 'ready'"
            },
            {
                "name": "A paused game is frozen",
                "code": "state = create_game()\nstate.update({'phase': 'go', 'elapsed': 0, 'is_paused': True})\nupdate_game(state, 500)\nassert state['elapsed'] == 0"
            },
            {
                "name": "A whole wait plays out sensibly",
                "code": "state = create_game()\nstate.update({'phase': 'waiting', 'wait_for': 2000, 'elapsed': 0})\nframes = 0\nfor _ in range(500):\n    update_game(state, 16)\n    if state['phase'] == 'go':\n        break\n    frames += 1\nassert state['phase'] == 'go', 'the signal never came'\nassert 100 < frames < 140, f'about 125 frames expected, got {frames}'"
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
        "starter": "def press(state):\n    # what a press means depends on the phase\n    pass\n",
        "answer": "def press(state):\n    if state[\"is_paused\"]:\n        return state[\"phase\"]\n\n    if state[\"phase\"] == \"ready\":\n        start_waiting(state)\n    elif state[\"phase\"] == \"waiting\":\n        state[\"phase\"] = \"toosoon\"\n        state[\"false_starts\"] += 1\n    elif state[\"phase\"] == \"go\":\n        state[\"last_time\"] = round(state[\"elapsed\"])\n        state[\"times\"].append(state[\"last_time\"])\n        if len(state[\"times\"]) > HISTORY_LENGTH:\n            state[\"times\"].pop(0)\n        state[\"attempts\"] += 1\n        state[\"phase\"] = \"result\"\n    else:\n        start_waiting(state)\n    return state[\"phase\"]\n",
        "hints": [
            "start_waiting(state) is written for you - it picks a fresh delay.",
            "pop(0) takes the OLDEST time off the front of the list.",
            "The last branch covers both 'result' and 'toosoon': go again."
        ],
        "tests": [
            {
                "name": "The first press arms the test",
                "code": "assert press(create_game()) == 'waiting'"
            },
            {
                "name": "Pressing too early is a false start",
                "code": "state = create_game()\npress(state)\nassert press(state) == 'toosoon'\nassert state['false_starts'] == 1"
            },
            {
                "name": "A false start does not score",
                "code": "state = create_game()\npress(state)\npress(state)\nassert state['times'] == [] and state['attempts'] == 0"
            },
            {
                "name": "Pressing on the signal records the time",
                "code": "state = create_game()\nstate.update({'phase': 'go', 'elapsed': 237.4})\nassert press(state) == 'result'\nassert state['last_time'] == 237\nassert state['times'][0] == 237"
            },
            {
                "name": "A recorded go counts as an attempt",
                "code": "state = create_game()\nstate.update({'phase': 'go', 'elapsed': 300})\npress(state)\nassert state['attempts'] == 1"
            },
            {
                "name": "Pressing after a result goes again",
                "code": "state = create_game()\nstate['phase'] = 'result'\nassert press(state) == 'waiting'"
            },
            {
                "name": "Pressing after a false start goes again",
                "code": "state = create_game()\nstate['phase'] = 'toosoon'\nassert press(state) == 'waiting'"
            },
            {
                "name": "Only the last few times are kept",
                "code": "state = create_game()\nfor i in range(HISTORY_LENGTH + 5):\n    state.update({'phase': 'go', 'elapsed': 200 + i})\n    press(state)\nassert len(state['times']) == HISTORY_LENGTH\nassert state['times'][-1] == 200 + HISTORY_LENGTH + 4"
            },
            {
                "name": "A paused game ignores presses",
                "code": "state = create_game()\nstate['is_paused'] = True\npress(state)\nassert state['phase'] == 'ready'"
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
        "fnName": "average_time",
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
        "starter": "def average_time(state):\n    # the average of state['times'], or 0 if there are none\n    pass\n",
        "answer": "def average_time(state):\n    if not state[\"times\"]:\n        return 0\n    return round(sum(state[\"times\"]) / len(state[\"times\"]))\n",
        "hints": [
            "Check for an empty list BEFORE you divide.",
            "sum(...) adds a list up and len(...) counts it.",
            "round(sum(state['times']) / len(state['times']))"
        ],
        "tests": [
            {
                "name": "No goes gives 0",
                "code": "assert average_time(create_game()) == 0"
            },
            {
                "name": "One go is its own average",
                "code": "state = create_game()\nstate['times'] = [240]\nassert average_time(state) == 240"
            },
            {
                "name": "Two goes average out",
                "code": "state = create_game()\nstate['times'] = [200, 300]\nassert average_time(state) == 250"
            },
            {
                "name": "Four goes average out",
                "code": "state = create_game()\nstate['times'] = [240, 310, 195, 420]\nassert average_time(state) == 291"
            },
            {
                "name": "The answer is a whole number",
                "code": "state = create_game()\nstate['times'] = [200, 201]\nassert isinstance(average_time(state), int)"
            },
            {
                "name": "The average sits between the fastest and the slowest",
                "code": "state = create_game()\nstate['times'] = [180, 260, 310, 420, 600]\nassert best_time(state) <= average_time(state) <= 600"
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
        "starter": "def rating(milliseconds):\n    # a ladder of bands - fastest first!\n    pass\n",
        "answer": "def rating(milliseconds):\n    if milliseconds < 200:\n        return \"lightning!\"\n    if milliseconds < 250:\n        return \"very quick\"\n    if milliseconds < 320:\n        return \"quick\"\n    if milliseconds < 400:\n        return \"not bad\"\n    if milliseconds < 550:\n        return \"a bit slow\"\n    return \"were you asleep?\"\n",
        "hints": [
            "Six branches, each one an if with a return.",
            "The order matters: fastest band first.",
            "The last one needs no if at all."
        ],
        "tests": [
            {
                "name": "150 ms is lightning",
                "code": "assert rating(150) == 'lightning!'"
            },
            {
                "name": "230 ms is very quick",
                "code": "assert rating(230) == 'very quick'"
            },
            {
                "name": "300 ms is quick",
                "code": "assert rating(300) == 'quick'"
            },
            {
                "name": "380 ms is not bad",
                "code": "assert rating(380) == 'not bad'"
            },
            {
                "name": "500 ms is a bit slow",
                "code": "assert rating(500) == 'a bit slow'"
            },
            {
                "name": "900 ms was a nap",
                "code": "assert rating(900) == 'were you asleep?'"
            },
            {
                "name": "The bands are in the right order",
                "code": "assert rating(199) == 'lightning!', 'did you check the slow bands first?'\nassert rating(200) == 'very quick'"
            },
            {
                "name": "A faster time is never rated worse",
                "code": "bands = []\nfor ms in range(50, 900, 10):\n    band = rating(ms)\n    if not bands or bands[-1] != band:\n        bands.append(band)\nassert len(bands) == 6, f'six bands expected, got {len(bands)}'\nassert bands[0] == 'lightning!' and bands[5] == 'were you asleep?'"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then press SPACE and see what the game says about you."
        },
        "warning": "Fastest band first. The other way round and everybody is told they were asleep."
    }
];
