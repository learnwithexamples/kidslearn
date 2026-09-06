/* ============================================================
   simon-steps.js - the 6 steps of "Build Simon Says"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const SIMON_STEPS = [
    {
        "id": "random_pad",
        "fnName": "randomPad",
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
        "starter": "function randomPad() {\n    // a random pad number\n}\n",
        "answer": "function randomPad() {\n    return Math.floor(Math.random() * PAD_COUNT);\n}\n",
        "hints": [
            "Math.random() gives a decimal from 0 up to (not including) 1.",
            "Multiply by PAD_COUNT and round down with Math.floor.",
            "return Math.floor(Math.random() * PAD_COUNT);"
        ],
        "tests": [
            {
                "name": "Every answer is a real pad",
                "code": "for (let i = 0; i < 200; i++) { const pad = randomPad();\n    assert(pad >= 0 && pad < PAD_COUNT, 'gave ' + pad); }"
            },
            {
                "name": "The answers are whole numbers",
                "code": "for (let i = 0; i < 50; i++) { assert(Number.isInteger(randomPad()), 'gave a decimal — did you round down?'); }"
            },
            {
                "name": "All four pads come up",
                "code": "const seen = {};\nfor (let i = 0; i < 500; i++) { seen[randomPad()] = true; }\nassert(Object.keys(seen).length === PAD_COUNT, 'in 500 tries it only used ' + Object.keys(seen).length + ' pads');"
            }
        ],
        "demo": {
            "kind": "pads",
            "caption": "Press the buttons to light each pad — these are the four your function picks from."
        }
    },
    {
        "id": "add_step",
        "fnName": "addStep",
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
        "starter": "function addStep(sequence) {\n    // a copy, plus one more random pad\n}\n",
        "answer": "function addStep(sequence) {\n    const longer = sequence.slice();\n    longer.push(randomPad());\n    return longer;\n}\n",
        "hints": [
            "sequence.slice() copies a list.",
            "push() adds to the end.",
            "Use the randomPad you wrote in step 1."
        ],
        "tests": [
            {
                "name": "It makes the sequence one longer",
                "code": "assert(addStep([]).length === 1, 'gave ' + addStep([]).length);\nassert(addStep([0, 1, 2]).length === 4);"
            },
            {
                "name": "The pads already there do not change",
                "code": "const before = [3, 1, 2];\nconst after = addStep(before);\nassert(after.slice(0, 3).join(',') === '3,1,2', 'gave ' + after.join(','));"
            },
            {
                "name": "The new pad is a real pad",
                "code": "for (let i = 0; i < 50; i++) { const pad = addStep([])[0];\n    assert(pad >= 0 && pad < PAD_COUNT, 'gave ' + pad); }"
            },
            {
                "name": "The list you were given is not changed",
                "code": "const before = [1];\naddStep(before);\nassert(before.length === 1, 'you changed the list you were given instead of a copy');"
            },
            {
                "name": "It returns a new list",
                "code": "const before = [1];\nassert(addStep(before) !== before);"
            }
        ],
        "demo": {
            "kind": "sequence",
            "caption": "Press Add a step and watch the sequence grow."
        }
    },
    {
        "id": "is_correct_so_far",
        "fnName": "isCorrectSoFar",
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
        "starter": "function isCorrectSoFar(sequence, input) {\n    // every pressed pad must match the same place in the sequence\n}\n",
        "answer": "function isCorrectSoFar(sequence, input) {\n    if (input.length > sequence.length) {\n        return false;\n    }\n    for (let i = 0; i < input.length; i++) {\n        if (input[i] !== sequence[i]) {\n            return false;\n        }\n    }\n    return true;\n}\n",
        "hints": [
            "Deal with the too-long case first.",
            "Loop over the INPUT, not the sequence — the player may not have finished.",
            "return true; goes after the loop."
        ],
        "tests": [
            {
                "name": "Nothing pressed yet is fine",
                "code": "assert(isCorrectSoFar([1, 2, 3], []) === true, 'the player has not gone wrong yet');"
            },
            {
                "name": "A right first pad is fine",
                "code": "assert(isCorrectSoFar([1, 2, 3], [1]) === true);"
            },
            {
                "name": "A wrong first pad is not",
                "code": "assert(isCorrectSoFar([1, 2, 3], [2]) === false, 'gave ' + isCorrectSoFar([1, 2, 3], [2]));"
            },
            {
                "name": "A right start of a longer answer is fine",
                "code": "assert(isCorrectSoFar([1, 2, 3], [1, 2]) === true);"
            },
            {
                "name": "The whole sequence is fine",
                "code": "assert(isCorrectSoFar([1, 2, 3], [1, 2, 3]) === true);"
            },
            {
                "name": "Going wrong at the end is spotted",
                "code": "assert(isCorrectSoFar([1, 2, 3], [1, 2, 0]) === false, 'the last pad is wrong');"
            },
            {
                "name": "Too many pads is wrong",
                "code": "assert(isCorrectSoFar([1], [1, 1]) === false, 'the player pressed more pads than the game flashed');"
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
        "fnName": "isRoundComplete",
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
        "starter": "function isRoundComplete(sequence, input) {\n    // right so far, and the same length\n}\n",
        "answer": "function isRoundComplete(sequence, input) {\n    return isCorrectSoFar(sequence, input) && input.length === sequence.length;\n}\n",
        "hints": [
            "Reuse isCorrectSoFar — you already wrote it.",
            "Join the two checks with &&.",
            "return isCorrectSoFar(sequence, input) && input.length === sequence.length;"
        ],
        "tests": [
            {
                "name": "Repeating the whole sequence finishes the round",
                "code": "assert(isRoundComplete([1, 2], [1, 2]) === true);"
            },
            {
                "name": "Half an answer does not",
                "code": "assert(isRoundComplete([1, 2], [1]) === false, 'there is one pad still to press');"
            },
            {
                "name": "Nothing pressed does not",
                "code": "assert(isRoundComplete([1, 2], []) === false);"
            },
            {
                "name": "A wrong answer of the right length does not",
                "code": "assert(isRoundComplete([1, 2], [1, 3]) === false, 'the second pad is wrong');"
            },
            {
                "name": "A one-pad round works",
                "code": "assert(isRoundComplete([3], [3]) === true);"
            }
        ],
        "demo": {
            "kind": "sequence",
            "caption": "Press the pads in the right order — the note says COMPLETE when you finish."
        }
    },
    {
        "id": "flash_interval",
        "fnName": "flashInterval",
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
        "starter": "function flashInterval(round) {\n    // 620 ms in round 1, 25 ms quicker each round, never below 260\n}\n",
        "answer": "function flashInterval(round) {\n    const milliseconds = 620 - (round - 1) * 25;\n    if (milliseconds < 260) {\n        return 260;\n    }\n    return milliseconds;\n}\n",
        "hints": [
            "Work the number out into a variable first.",
            "Round 1 must give exactly 620, so the sum uses (round - 1).",
            "Math.max(260, milliseconds) does the floor in one line."
        ],
        "tests": [
            {
                "name": "Round 1 flashes for 620 ms",
                "code": "assert(flashInterval(1) === 620, 'gave ' + flashInterval(1));"
            },
            {
                "name": "Round 2 flashes for 595 ms",
                "code": "assert(flashInterval(2) === 595, 'gave ' + flashInterval(2));"
            },
            {
                "name": "Round 5 flashes for 520 ms",
                "code": "assert(flashInterval(5) === 520);"
            },
            {
                "name": "Round 20 has hit the floor",
                "code": "assert(flashInterval(20) === 260, 'gave ' + flashInterval(20));"
            },
            {
                "name": "Round 99 is still 260",
                "code": "assert(flashInterval(99) === 260);"
            },
            {
                "name": "It never goes below 260",
                "code": "for (let round = 1; round <= 60; round++) { assert(flashInterval(round) >= 260, 'round ' + round + ' gave ' + flashInterval(round)); }"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Play a few rounds and feel the flashes speed up."
        }
    },
    {
        "id": "press_pad",
        "fnName": "pressPad",
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
        "starter": "function pressPad(state, pad) {\n    // 1. only during your turn\n    // 2. remember the press\n    // 3. wrong? game over. complete? next round.\n}\n",
        "answer": "function pressPad(state, pad) {\n    if (state.phase !== 'play' || state.isOver || state.isPaused) {\n        return false;\n    }\n\n    state.input.push(pad);\n    state.lit = pad;\n    state.flashTimer = 0;\n\n    if (!isCorrectSoFar(state.sequence, state.input)) {\n        state.phase = 'over';\n        state.isOver = true;\n        return true;\n    }\n\n    if (isRoundComplete(state.sequence, state.input)) {\n        state.score = state.score + scoreForRound(state.round);\n        state.round = state.round + 1;\n        state.sequence = addStep(state.sequence);\n        state.input = [];\n        state.phase = 'watch';\n        state.flashIndex = 0;\n        state.flashOn = true;\n        state.lit = state.sequence[0];\n    }\n    return true;\n}\n",
        "hints": [
            "The guard is: state.phase !== 'play' — presses during the flashing do not count.",
            "Check for WRONG before checking for complete.",
            "Starting the next round means resetting input, flashIndex and phase together."
        ],
        "tests": [
            {
                "name": "A press during your turn is remembered",
                "code": "const state = createGame();\nstate.phase = 'play';\nstate.sequence = [1, 2];\nstate.input = [];\npressPad(state, 1);\nassert(state.input.join(',') === '1', 'input is ' + JSON.stringify(state.input));"
            },
            {
                "name": "A press while the game is flashing is ignored",
                "code": "const state = createGame();\nstate.phase = 'watch';\nstate.sequence = [1];\nstate.input = [];\npressPad(state, 1);\nassert(state.input.length === 0, 'presses only count on your turn');"
            },
            {
                "name": "A wrong pad ends the game",
                "code": "const state = createGame();\nstate.phase = 'play';\nstate.sequence = [1, 2];\nstate.input = [];\npressPad(state, 3);\nassert(state.isOver === true, 'pad 3 is not pad 1');"
            },
            {
                "name": "Finishing the sequence scores and starts the next round",
                "code": "const state = createGame();\nstate.phase = 'play';\nstate.round = 1;\nstate.sequence = [1];\nstate.input = [];\npressPad(state, 1);\nassert(state.score === 10, 'score is ' + state.score);\nassert(state.round === 2, 'round is ' + state.round);\nassert(state.sequence.length === 2, 'the sequence should have grown');\nassert(state.input.length === 0, 'the input should be empty for the new round');\nassert(state.phase === 'watch', 'the game should be flashing again');"
            },
            {
                "name": "Half an answer keeps your turn going",
                "code": "const state = createGame();\nstate.phase = 'play';\nstate.sequence = [1, 2];\nstate.input = [];\npressPad(state, 1);\nassert(state.phase === 'play', 'there is still one pad to press');\nassert(state.isOver === false);"
            },
            {
                "name": "A finished game ignores presses",
                "code": "const state = createGame();\nstate.phase = 'play';\nstate.isOver = true;\nstate.sequence = [1];\nstate.input = [];\npressPad(state, 1);\nassert(state.input.length === 0);"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Watch the flashes, then repeat them. Click the page and the number keys work too."
        },
        "warning": "Check whether the answer is WRONG before checking whether it is complete — otherwise a wrong last pad would still finish the round."
    }
];
