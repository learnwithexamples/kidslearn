/* ============================================================
   simon-python-steps.js - the 6 steps of "Build Simon Says in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const SIMON_PYTHON_STEPS = [
    {
        "id": "random_pad",
        "fnName": "random_pad",
        "title": "Pick a pad",
        "adds": "The game can think of a pad.",
        "intro": "<p>Four pads, numbered 0 to 3. Everything in this game starts with picking one at random.</p>",
        "spec": {
            "input": "nothing",
            "output": "0, 1, 2 or 3",
            "algorithm": [
                "Pick a random whole number from 0 up to PAD_COUNT - 1."
            ]
        },
        "starter": "def random_pad():\n    # a random pad number\n    pass\n",
        "answer": "def random_pad():\n    return random.randrange(PAD_COUNT)\n",
        "hints": [
            "random.randrange(4) gives 0, 1, 2 or 3 (random is already imported).",
            "One line.",
            "return random.randrange(PAD_COUNT)"
        ],
        "tests": [
            {
                "name": "Every answer is a real pad",
                "code": "for _ in range(200):\n    pad = random_pad()\n    assert 0 <= pad < PAD_COUNT, f'gave {pad}'"
            },
            {
                "name": "The answers are whole numbers",
                "code": "assert all(isinstance(random_pad(), int) for _ in range(50))"
            },
            {
                "name": "All four pads come up",
                "code": "seen = {random_pad() for _ in range(500)}\nassert len(seen) == PAD_COUNT, f'in 500 tries it only used {len(seen)} pads'"
            }
        ],
        "demo": {
            "kind": "pads",
            "caption": "Press the buttons to light each pad — these are the four your function picks from."
        }
    },
    {
        "id": "add_step",
        "fnName": "add_step",
        "title": "Grow the sequence",
        "adds": "The game remembers a longer and longer tune.",
        "intro": "<p>Every round the game adds one more pad to the end of the sequence. The sequence you already had stays exactly the same — that is what makes the game a memory test rather than a new puzzle each time.</p>",
        "spec": {
            "input": "sequence - the pads so far",
            "output": "a NEW list with one more random pad on the end",
            "algorithm": [
                "Copy the list.",
                "Add a random pad to the end of the copy.",
                "Return the copy."
            ]
        },
        "starter": "def add_step(sequence):\n    # a copy, plus one more random pad\n    pass\n",
        "answer": "def add_step(sequence):\n    return list(sequence) + [random_pad()]\n",
        "hints": [
            "list(sequence) copies a list.",
            "Two lists can be glued together with +.",
            "return list(sequence) + [random_pad()]"
        ],
        "tests": [
            {
                "name": "It makes the sequence one longer",
                "code": "assert len(add_step([])) == 1\nassert len(add_step([0, 1, 2])) == 4"
            },
            {
                "name": "The pads already there do not change",
                "code": "after = add_step([3, 1, 2])\nassert after[:3] == [3, 1, 2], f'gave {after}'"
            },
            {
                "name": "The new pad is a real pad",
                "code": "for _ in range(50):\n    pad = add_step([])[0]\n    assert 0 <= pad < PAD_COUNT, f'gave {pad}'"
            },
            {
                "name": "The list you were given is not changed",
                "code": "before = [1]\nadd_step(before)\nassert before == [1], 'you changed the list you were given'"
            },
            {
                "name": "It returns a new list",
                "code": "before = [1]\nassert add_step(before) is not before"
            }
        ],
        "demo": {
            "kind": "sequence",
            "caption": "Press Add a step and watch the sequence grow."
        }
    },
    {
        "id": "is_correct_so_far",
        "fnName": "is_correct_so_far",
        "title": "Is the answer still right?",
        "adds": "The game watches every pad you press.",
        "intro": "<p>The game does not wait until the end to check you. After <em>every</em> press it asks: is this still right?</p><p>Careful with two edge cases: pressing nothing yet is fine (you have not gone wrong), and pressing more pads than the sequence has is always wrong.</p>",
        "spec": {
            "input": "sequence - what the game flashed. input - what the player has pressed.",
            "output": "True while every pad pressed matches the sequence",
            "algorithm": [
                "If the input is longer than the sequence, it is wrong.",
                "Compare each pressed pad with the pad in the same place in the sequence.",
                "If any pair differs, it is wrong; otherwise it is still right."
            ]
        },
        "starter": "def is_correct_so_far(sequence, input_pads):\n    # every pressed pad must match the same place in the sequence\n    pass\n",
        "answer": "def is_correct_so_far(sequence, input_pads):\n    if len(input_pads) > len(sequence):\n        return False\n    return all(pad == sequence[i] for i, pad in enumerate(input_pads))\n",
        "hints": [
            "Deal with the too-long case first.",
            "enumerate(input_pads) gives the position and the pad together.",
            "all(...) is True when every comparison is."
        ],
        "tests": [
            {
                "name": "Nothing pressed yet is fine",
                "code": "assert is_correct_so_far([1, 2, 3], []) is True"
            },
            {
                "name": "A right first pad is fine",
                "code": "assert is_correct_so_far([1, 2, 3], [1]) is True"
            },
            {
                "name": "A wrong first pad is not",
                "code": "got = is_correct_so_far([1, 2, 3], [2])\nassert got is False, f'gave {got!r}'"
            },
            {
                "name": "A right start of a longer answer is fine",
                "code": "assert is_correct_so_far([1, 2, 3], [1, 2]) is True"
            },
            {
                "name": "The whole sequence is fine",
                "code": "assert is_correct_so_far([1, 2, 3], [1, 2, 3]) is True"
            },
            {
                "name": "Going wrong at the end is spotted",
                "code": "assert is_correct_so_far([1, 2, 3], [1, 2, 0]) is False"
            },
            {
                "name": "Too many pads is wrong",
                "code": "assert is_correct_so_far([1], [1, 1]) is False"
            }
        ],
        "demo": {
            "kind": "sequence",
            "caption": "Build a sequence, then press pads and watch the answer change."
        },
        "warning": "An empty input is CORRECT so far. If you get that wrong the game ends the moment the player's turn starts."
    },
    {
        "id": "is_round_complete",
        "fnName": "is_round_complete",
        "title": "Has the round been finished?",
        "adds": "Finishing a round starts the next one.",
        "intro": "<p>A round is finished when the player has repeated the whole sequence — right, <em>and</em> all of it.</p><p>This one is built entirely from the function you just wrote.</p>",
        "spec": {
            "input": "sequence, input",
            "output": "True when the input matches the sequence exactly",
            "algorithm": [
                "It must be correct so far.",
                "AND the input must be the same length as the sequence."
            ]
        },
        "starter": "def is_round_complete(sequence, input_pads):\n    # right so far, and the same length\n    pass\n",
        "answer": "def is_round_complete(sequence, input_pads):\n    return is_correct_so_far(sequence, input_pads) and len(input_pads) == len(sequence)\n",
        "hints": [
            "Reuse is_correct_so_far.",
            "Join the two checks with `and`.",
            "return is_correct_so_far(sequence, input_pads) and len(input_pads) == len(sequence)"
        ],
        "tests": [
            {
                "name": "Repeating the whole sequence finishes the round",
                "code": "assert is_round_complete([1, 2], [1, 2]) is True"
            },
            {
                "name": "Half an answer does not",
                "code": "assert is_round_complete([1, 2], [1]) is False"
            },
            {
                "name": "Nothing pressed does not",
                "code": "assert is_round_complete([1, 2], []) is False"
            },
            {
                "name": "A wrong answer of the right length does not",
                "code": "assert is_round_complete([1, 2], [1, 3]) is False"
            },
            {
                "name": "A one-pad round works",
                "code": "assert is_round_complete([3], [3]) is True"
            }
        ],
        "demo": {
            "kind": "sequence",
            "caption": "Press the pads in the right order — the note says COMPLETE when you finish."
        }
    },
    {
        "id": "flash_interval",
        "fnName": "flash_interval",
        "title": "Make it faster",
        "adds": "Later rounds flash quicker.",
        "intro": "<p>Round 1 flashes each pad for 620 milliseconds — slow and friendly. Every round takes 25 ms off, down to a floor of 260 ms.</p><p>Without the floor, round 30 would flash for a negative time and you would see nothing at all.</p>",
        "spec": {
            "input": "round - which round you are on",
            "output": "milliseconds each flash lasts",
            "algorithm": [
                "Work out 620 - (round - 1) * 25.",
                "Never return less than 260."
            ]
        },
        "starter": "def flash_interval(round_number):\n    # 620 ms in round 1, 25 ms quicker each round, never below 260\n    pass\n",
        "answer": "def flash_interval(round_number):\n    return max(260, 620 - (round_number - 1) * 25)\n",
        "hints": [
            "max(260, something) gives 260 whenever something drops below it.",
            "Round 1 must give exactly 620, so the sum uses (round_number - 1).",
            "return max(260, 620 - (round_number - 1) * 25)"
        ],
        "tests": [
            {
                "name": "Round 1 flashes for 620 ms",
                "code": "got = flash_interval(1)\nassert got == 620, f'gave {got}'"
            },
            {
                "name": "Round 2 flashes for 595 ms",
                "code": "assert flash_interval(2) == 595"
            },
            {
                "name": "Round 5 flashes for 520 ms",
                "code": "assert flash_interval(5) == 520"
            },
            {
                "name": "Round 20 has hit the floor",
                "code": "got = flash_interval(20)\nassert got == 260, f'gave {got}'"
            },
            {
                "name": "Round 99 is still 260",
                "code": "assert flash_interval(99) == 260"
            },
            {
                "name": "It never goes below 260",
                "code": "for r in range(1, 61):\n    assert flash_interval(r) >= 260, f'round {r} gave {flash_interval(r)}'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play a few rounds and feel the flashes speed up."
        }
    },
    {
        "id": "press_pad",
        "fnName": "press_pad",
        "title": "Press a pad",
        "adds": "The game can be played!",
        "intro": "<p>The move itself, and it pulls together everything you have written.</p><p>One press can do three different things: nothing (if it is not your turn), end the game (if it is wrong), or start the next round (if it finishes the sequence).</p>",
        "spec": {
            "input": "state - the game. pad - 0 to 3.",
            "output": "True if the press counted",
            "algorithm": [
                "Ignore the press unless state.phase is 'play' and the game is running.",
                "Add the pad to the input, light it up and reset the flash timer.",
                "If the answer is no longer correct so far: the phase becomes 'over' and the game ends.",
                "If the round is complete: add score-for-round points, add 1 to the round, grow the sequence with add-step, empty the input, and go back to phase 'watch' at the first flash."
            ]
        },
        "starter": "def press_pad(state, pad):\n    # 1. only during your turn\n    # 2. remember the press\n    # 3. wrong? game over. complete? next round.\n    pass\n",
        "answer": "def press_pad(state, pad):\n    if state[\"phase\"] != \"play\" or state[\"is_over\"] or state[\"is_paused\"]:\n        return False\n\n    state[\"input\"].append(pad)\n    state[\"lit\"] = pad\n    state[\"flash_timer\"] = 0\n\n    if not is_correct_so_far(state[\"sequence\"], state[\"input\"]):\n        state[\"phase\"] = \"over\"\n        state[\"is_over\"] = True\n        return True\n\n    if is_round_complete(state[\"sequence\"], state[\"input\"]):\n        state[\"score\"] += score_for_round(state[\"round\"])\n        state[\"round\"] += 1\n        state[\"sequence\"] = add_step(state[\"sequence\"])\n        state[\"input\"] = []\n        state[\"phase\"] = \"watch\"\n        state[\"flash_index\"] = 0\n        state[\"flash_on\"] = True\n        state[\"lit\"] = state[\"sequence\"][0]\n    return True\n",
        "hints": [
            "The guard is: state[\"phase\"] != \"play\".",
            "Check for WRONG before checking for complete.",
            "Starting the next round resets input, flash_index and phase together."
        ],
        "tests": [
            {
                "name": "A press during your turn is remembered",
                "code": "state = create_game()\nstate.update({'phase': 'play', 'sequence': [1, 2], 'input': []})\npress_pad(state, 1)\nassert state['input'] == [1], f\"input is {state['input']}\""
            },
            {
                "name": "A press while the game is flashing is ignored",
                "code": "state = create_game()\nstate.update({'phase': 'watch', 'sequence': [1], 'input': []})\npress_pad(state, 1)\nassert state['input'] == [], 'presses only count on your turn'"
            },
            {
                "name": "A wrong pad ends the game",
                "code": "state = create_game()\nstate.update({'phase': 'play', 'sequence': [1, 2], 'input': []})\npress_pad(state, 3)\nassert state['is_over'] is True"
            },
            {
                "name": "Finishing the sequence scores and starts the next round",
                "code": "state = create_game()\nstate.update({'phase': 'play', 'round': 1, 'sequence': [1], 'input': []})\npress_pad(state, 1)\nassert state['score'] == 10, f\"score is {state['score']}\"\nassert state['round'] == 2\nassert len(state['sequence']) == 2, 'the sequence should have grown'\nassert state['input'] == []\nassert state['phase'] == 'watch'"
            },
            {
                "name": "Half an answer keeps your turn going",
                "code": "state = create_game()\nstate.update({'phase': 'play', 'sequence': [1, 2], 'input': []})\npress_pad(state, 1)\nassert state['phase'] == 'play' and state['is_over'] is False"
            },
            {
                "name": "A finished game ignores presses",
                "code": "state = create_game()\nstate.update({'phase': 'play', 'is_over': True, 'sequence': [1], 'input': []})\npress_pad(state, 1)\nassert state['input'] == []"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Watch the flashes, then repeat them. Click the page and the number keys work too."
        },
        "warning": "Check whether the answer is WRONG before checking whether it is complete — otherwise a wrong last pad would still finish the round."
    }
];
