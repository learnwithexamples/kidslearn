/* ============================================================
   floors-steps.js - the 6 steps of "Build Hundred Floors"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const FLOORS_STEPS = [
    {
        "id": "screen_y",
        "fnName": "screenY",
        "title": "Where does the camera look?",
        "adds": "The shaft can be drawn.",
        "intro": "<p>Here is the idea the whole game rests on, and it is worth getting straight before anything else: <strong>the shaft does not move. The camera does.</strong></p><p>Every platform is given a place in the world when it is made, and it stays there for ever. What changes is how far down we are looking. To draw something you take the camera's depth off its world position.</p><p>You could have written this game the other way round, sliding every platform upwards. It seems simpler — right up until you notice that a player standing on a platform has to be dragged along with it, so speeding up the view would physically fling the player into the ceiling. Moving the camera touches nobody.</p>",
        "spec": {
            "input": "state, worldY — where something is in the world",
            "output": "the y to draw it at",
            "algorithm": [
                "Take the camera's depth off the world position. That is the whole function."
            ]
        },
        "starter": "function screenY(state, worldY) {\n    // the world position, minus how far down we are looking\n}\n",
        "answer": "function screenY(state, worldY) {\n    return worldY - state.camera;\n}\n",
        "hints": [
            "The camera is state.camera — how far down the shaft we are looking.",
            "Something at the same depth as the camera appears at the very top.",
            "return worldY - state.camera;"
        ],
        "tests": [
            {
                "name": "At the start the camera is at the top",
                "code": "const state = createGame();\nassert(state.camera === 0);\nassert(screenY(state, 100) === 100, 'with the camera at 0, world and screen are the same');"
            },
            {
                "name": "Looking further down moves things up the screen",
                "code": "const state = createGame();\nstate.camera = 50;\nassert(screenY(state, 100) === 50, 'gave ' + screenY(state, 100));"
            },
            {
                "name": "Something at the camera's own depth is at the very top",
                "code": "const state = createGame();\nstate.camera = 137;\nassert(screenY(state, 137) === 0);"
            },
            {
                "name": "Something above the camera has a negative screen y",
                "code": "const state = createGame();\nstate.camera = 200;\nassert(screenY(state, 150) < 0, 'that is off the top of the screen');"
            },
            {
                "name": "The gap between two things never changes",
                "code": "const state = createGame();\nstate.camera = 0;\nconst apart = screenY(state, 300) - screenY(state, 200);\nstate.camera = 500;\nassert(screenY(state, 300) - screenY(state, 200) === apart, 'moving the camera must not stretch the world');"
            },
            {
                "name": "The player starts in view",
                "code": "const state = createGame();\nconst y = screenY(state, state.player.y);\nassert(y > 0 && y < FIELD_HEIGHT, 'the player should be on screen, but is at ' + y);"
            }
        ],
        "demo": {
            "kind": "kinds",
            "caption": "One of every kind of platform, all drawn through screenY."
        }
    },
    {
        "id": "random_kind",
        "fnName": "randomKind",
        "title": "Deal a platform",
        "adds": "The shaft fills with six different kinds.",
        "intro": "<p>Six kinds of platform, but they are not equally likely — plain ones are common and 锯齿 spikes are rarer, and the deeper you go the nastier the mixture gets.</p><p>The way to do that is <strong>weighted random choice</strong>, and it is genuinely useful. Picture a row of buckets of different widths and a dart thrown at random: a wide bucket catches more darts.</p><ol><li>Add up all the weights — that is how wide the whole row of buckets is.</li><li>Pick a random number somewhere in that total — that is where the dart lands.</li><li>Walk along, taking each weight off your number. The moment it goes below zero, you are standing in that bucket.</li></ol>",
        "spec": {
            "input": "floor — how deep we are",
            "output": "one of the six kinds",
            "algorithm": [
                "Ask kind-weights for the list of kinds and their weights.",
                "Add all the weights together.",
                "Pick a random number from 0 up to that total.",
                "Walk the list, taking each weight off your number. As soon as it drops below 0, return that kind."
            ]
        },
        "starter": "function randomKind(floor) {\n    const weights = kindWeights(floor);\n    // add them up, throw a dart, walk along\n    return PLAIN;\n}\n",
        "answer": "function randomKind(floor) {\n    const weights = kindWeights(floor);\n\n    let total = 0;\n    for (let i = 0; i < weights.length; i++) {\n        total = total + weights[i].weight;\n    }\n\n    let ticket = Math.random() * total;\n    for (let i = 0; i < weights.length; i++) {\n        ticket = ticket - weights[i].weight;\n        if (ticket < 0) {\n            return weights[i].kind;\n        }\n    }\n    return PLAIN;\n}\n",
        "hints": [
            "kindWeights(floor) gives you a list of { kind, weight }.",
            "Math.random() * total throws the dart somewhere in the whole row.",
            "Take each weight off the ticket, and return as soon as it goes below zero."
        ],
        "tests": [
            {
                "name": "It always gives back a real kind",
                "code": "for (let i = 0; i < 300; i++) {\n    const kind = randomKind(1);\n    assert(kind >= PLAIN && kind <= CRUMBLING, 'gave ' + kind);\n}"
            },
            {
                "name": "Every kind turns up sooner or later",
                "code": "const seen = {};\nfor (let i = 0; i < 3000; i++) { seen[randomKind(20)] = true; }\nassert(Object.keys(seen).length === 6, 'only ' + Object.keys(seen).length + ' of the six kinds ever appeared');"
            },
            {
                "name": "Plain platforms are the commonest",
                "code": "const counts = {};\nfor (let i = 0; i < 4000; i++) {\n    const kind = randomKind(1);\n    counts[kind] = (counts[kind] || 0) + 1;\n}\nfor (let kind = 1; kind <= CRUMBLING; kind++) {\n    assert(counts[PLAIN] > (counts[kind] || 0), 'plain should be commoner than kind ' + kind);\n}"
            },
            {
                "name": "Spikes get likelier the deeper you go",
                "code": "let shallow = 0;\nlet deep = 0;\nfor (let i = 0; i < 4000; i++) {\n    if (randomKind(1) === SPIKED) { shallow = shallow + 1; }\n    if (randomKind(60) === SPIKED) { deep = deep + 1; }\n}\nassert(deep > shallow * 1.5, 'floor 60 had ' + deep + ' spikes and floor 1 had ' + shallow + ' — it should get much nastier');"
            },
            {
                "name": "The weights really are respected",
                "code": "const counts = {};\nfor (let i = 0; i < 8000; i++) {\n    const kind = randomKind(1);\n    counts[kind] = (counts[kind] || 0) + 1;\n}\nconst weights = kindWeights(1);\nlet total = 0;\nweights.forEach(function (w) { total = total + w.weight; });\nweights.forEach(function (w) {\n    const expected = w.weight / total * 8000;\n    const got = counts[w.kind] || 0;\n    assert(Math.abs(got - expected) < expected * 0.35 + 40,\n           'kind ' + w.kind + ' came up ' + got + ' times but should be near ' + Math.round(expected));\n});"
            },
            {
                "name": "Two shafts in a row are different",
                "code": "let same = 0;\nfor (let i = 0; i < 40; i++) {\n    if (randomKind(30) === randomKind(30)) { same = same + 1; }\n}\nassert(same < 40, 'it should not give the same answer every single time');"
            }
        ],
        "demo": {
            "kind": "kinds",
            "caption": "Step through the six kinds and read what each one is."
        }
    },
    {
        "id": "is_over",
        "fnName": "isOver",
        "title": "Are you standing on it?",
        "adds": "You stop balancing on thin air.",
        "intro": "<p>A small function with a surprisingly big effect. Are you over this platform?</p><p>The obvious answer is \"do our rectangles overlap?\" — and it is wrong. With that rule you can stand balanced on <em>half a pixel</em> of platform, hanging in mid-air and refusing to fall, while the shaft carries you up into the ceiling spikes. It looks like the game has frozen.</p><p>Use the player's <strong>middle</strong> instead. You fall the moment you walk past the edge, which is exactly what a player expects.</p>",
        "spec": {
            "input": "player, platform",
            "output": "True if the player's middle is above the platform",
            "algorithm": [
                "Work out the middle of the player: their x plus half their width.",
                "That has to be past the platform's left edge and before its right edge."
            ]
        },
        "starter": "function isOver(player, platform) {\n    // the player's MIDDLE has to be above the platform\n}\n",
        "answer": "function isOver(player, platform) {\n    const middle = player.x + PLAYER_WIDTH / 2;\n    return middle > platform.x && middle < platform.x + PLATFORM_WIDTH;\n}\n",
        "hints": [
            "The middle of the player is player.x + PLAYER_WIDTH / 2.",
            "The platform runs from platform.x to platform.x + PLATFORM_WIDTH.",
            "Both comparisons, joined with &&."
        ],
        "tests": [
            {
                "name": "Standing in the middle counts",
                "code": "const platform = { x: 100, y: 0 };\nassert(isOver({ x: 121 }, platform) === true);"
            },
            {
                "name": "Standing well to the side does not",
                "code": "const platform = { x: 100, y: 0 };\nassert(isOver({ x: 250 }, platform) === false);"
            },
            {
                "name": "Just over the left edge counts",
                "code": "const platform = { x: 100, y: 0 };\nassert(isOver({ x: 92 }, platform) === true, 'the middle is at 102, which is on the platform');"
            },
            {
                "name": "Balancing on a sliver does NOT count",
                "code": "const platform = { x: 100, y: 0 };\nassert(isOver({ x: 81 }, platform) === false, 'only the last pixel of the player overlaps — the middle is at 91, off the edge, so they must fall');"
            },
            {
                "name": "Nor does hanging off the right",
                "code": "const platform = { x: 100, y: 0 };\nassert(isOver({ x: 161 }, platform) === false, 'the middle is at 171, past the right-hand edge at 162');"
            },
            {
                "name": "A player can only be over one platform at a time",
                "code": "const left = { x: 100, y: 0 };\nconst right = { x: 162, y: 0 };\nfor (let x = 60; x < 240; x++) {\n    const both = isOver({ x: x }, left) && isOver({ x: x }, right);\n    assert(!both, 'at x ' + x + ' the player is somehow on both platforms at once');\n}"
            },
            {
                "name": "It agrees with stillOnPlatform",
                "code": "const platform = { x: 100, y: 0 };\nassert(stillOnPlatform({ x: 121 }, platform) === isOver({ x: 121 }, platform));"
            }
        ],
        "demo": {
            "kind": "land",
            "caption": "Walk off the edge and you fall the moment your middle passes it."
        },
        "warning": "Use the middle, not the whole body. Any-overlap-counts lets a player balance on half a pixel and hang in the air for ever."
    },
    {
        "id": "lands_on",
        "fnName": "landsOn",
        "title": "Did you land on it?",
        "adds": "You can stand on things.",
        "intro": "<p>The most important test in the game: has the player's feet just crossed the top of this platform?</p><p>The tempting version is \"are the feet near the top?\" — and it breaks. At full speed the player falls seven pixels in a single frame, and a platform is ten thick. A fast fall skips straight past the \"near\" window and lands on nothing.</p><p>So ask a better question: were the feet <strong>above</strong> the platform last frame, and are they <strong>level with or below</strong> it now? That cannot be skipped over, however fast the fall.</p>",
        "spec": {
            "input": "player — with y, dy and lastFeet. platform.",
            "output": "True if the player just landed on it",
            "algorithm": [
                "If the player is not falling (dy is 0 or less), it is not a landing — going up through a platform is allowed.",
                "Work out where the feet are now: y plus PLAYER_HEIGHT.",
                "If the feet were already below the platform's top last frame, we did not land on it.",
                "If the feet have not reached it yet, we have not landed either.",
                "Otherwise it comes down to whether we are over it — use is-over."
            ]
        },
        "starter": "function landsOn(player, platform) {\n    // falling, crossed the top this frame, and over it\n}\n",
        "answer": "function landsOn(player, platform) {\n    if (player.dy <= 0) {\n        return false;\n    }\n    const rect = platformRect(platform);\n    const feet = player.y + PLAYER_HEIGHT;\n\n    if (player.lastFeet > rect.y || feet < rect.y) {\n        return false;\n    }\n    return isOver(player, platform);\n}\n",
        "hints": [
            "player.lastFeet is where the feet were at the start of the frame.",
            "'Crossed it' means lastFeet was above the top AND feet is now at or below it.",
            "Finish with isOver(player, platform) — the function you just wrote."
        ],
        "tests": [
            {
                "name": "Falling onto a platform is a landing",
                "code": "const platform = { x: 100, y: 200 };\nconst player = { x: 121, y: 180, dy: 200, lastFeet: 200 };\nassert(landsOn(player, platform) === true, 'the feet went from 200 to 204, crossing the top at 200');"
            },
            {
                "name": "Still above it is not a landing",
                "code": "const platform = { x: 100, y: 200 };\nconst player = { x: 121, y: 100, dy: 200, lastFeet: 120 };\nassert(landsOn(player, platform) === false, 'the feet are nowhere near it yet');"
            },
            {
                "name": "Already below it is not a landing",
                "code": "const platform = { x: 100, y: 200 };\nconst player = { x: 121, y: 300, dy: 200, lastFeet: 310 };\nassert(landsOn(player, platform) === false, 'the feet were already past it last frame');"
            },
            {
                "name": "Rising up through it is allowed",
                "code": "const platform = { x: 100, y: 200 };\nconst player = { x: 121, y: 180, dy: -200, lastFeet: 210 };\nassert(landsOn(player, platform) === false, 'a spring has thrown the player upwards — they should pass straight through');"
            },
            {
                "name": "Falling past it to one side is not a landing",
                "code": "const platform = { x: 100, y: 200 };\nconst player = { x: 250, y: 180, dy: 200, lastFeet: 200 };\nassert(landsOn(player, platform) === false);"
            },
            {
                "name": "A very fast fall is still caught",
                "code": "const platform = { x: 100, y: 200 };\n/* the feet jumped from 190 all the way to 230 in one frame */\nconst player = { x: 121, y: 206, dy: MAX_FALL_SPEED, lastFeet: 190 };\nassert(landsOn(player, platform) === true, 'the feet leapt right over the platform in one frame, but they still crossed it');"
            },
            {
                "name": "Landing exactly on the edge of the top counts",
                "code": "const platform = { x: 100, y: 200 };\nconst player = { x: 121, y: 176, dy: 100, lastFeet: 199 };\nassert(landsOn(player, platform) === true);"
            },
            {
                "name": "A real game lands on things",
                "code": "const state = createGame();\n/* drop the player from a standstill, squarely above a real platform */\nconst platform = state.platforms[1];\nstate.player.riding = null;\nstate.player.x = platform.x + PLATFORM_WIDTH / 2 - PLAYER_WIDTH / 2;\nstate.player.y = platform.y - 90;\nstate.player.dy = 0;\nstate.player.lastFeet = state.player.y + PLAYER_HEIGHT;\nstate.steering = 0;\nlet landed = false;\nfor (let frame = 0; frame < 90 && !landed; frame++) {\n    updateGame(state, 16);\n    if (state.player.riding) { landed = true; }\n}\nassert(landed, 'the player was dropped straight onto a platform and never landed on it');"
            }
        ],
        "demo": {
            "kind": "land",
            "caption": "A still shaft to practise on. Walk about and watch the landings."
        },
        "warning": "Compare where the feet WERE with where they are NOW. A 'near the top' test misses fast falls, and the player drops straight through solid platforms."
    },
    {
        "id": "land_on_platform",
        "fnName": "landOnPlatform",
        "title": "What kind did you land on?",
        "adds": "The 锯齿 start to hurt.",
        "intro": "<p>Now the fun part — and the heart of the whole game. You have landed; what happens next depends entirely on <em>what you landed on</em>.</p><ul><li><strong>plain</strong> — nothing at all, and that is a relief.</li><li><strong>锯齿 spiked</strong> — it costs you SPIKE_DAMAGE blood. This is the one to avoid.</li><li><strong>spring</strong> — it throws you straight back up, and you are airborne again at once.</li><li><strong>crumbling</strong> — it starts falling apart the moment you touch it.</li><li><strong>sliding</strong> — it carries you sideways while you stand on it (that is handled while you walk).</li></ul><p>Whatever the kind, first stand the player neatly on top and count the floor.</p>",
        "spec": {
            "input": "state, platform",
            "output": "nothing; it changes the player and the platform",
            "algorithm": [
                "Put the player exactly on top: the platform's y, minus PLAYER_HEIGHT. Stop them falling and remember what they are riding.",
                "If this platform is deeper than any reached before, that is a new floor: remember it and score 10.",
                "Spiked? hurt the player by SPIKE_DAMAGE.",
                "Spring? set dy to SPRING_SPEED, stop riding (you are in the air again), and count the bounce.",
                "Crumbling? start its timer at CRUMBLE_SECONDS."
            ]
        },
        "starter": "function landOnPlatform(state, platform) {\n    // stand on top, count the floor, then do what this KIND does\n}\n",
        "answer": "function landOnPlatform(state, platform) {\n    const rect = platformRect(platform);\n\n    state.player.y = rect.y - PLAYER_HEIGHT;\n    state.player.dy = 0;\n    state.player.riding = platform;\n\n    if (platform.floor > state.floor) {\n        state.floor = platform.floor;\n        state.score = state.score + 10;\n    }\n\n    if (platform.kind === SPIKED) {\n        hurt(state, SPIKE_DAMAGE);\n\n    } else if (platform.kind === SPRING) {\n        state.player.dy = SPRING_SPEED;\n        state.player.riding = null;\n        state.bounces = state.bounces + 1;\n\n    } else if (platform.kind === CRUMBLING) {\n        platform.crumbling = CRUMBLE_SECONDS;\n    }\n}\n",
        "hints": [
            "Standing on top means y = the platform's y MINUS the player's height.",
            "hurt(state, amount) is written for you.",
            "A spring has to clear riding as well as setting dy — you are in the air again."
        ],
        "tests": [
            {
                "name": "Landing stands you on top",
                "code": "const state = createGame();\nconst platform = { x: 100, y: 300, kind: PLAIN, floor: 9, crumbling: 0 };\nstate.player.x = 121;\nlandOnPlatform(state, platform);\nassert(state.player.y === 300 - PLAYER_HEIGHT, 'y is ' + state.player.y);\nassert(state.player.dy === 0);"
            },
            {
                "name": "Landing counts a new floor",
                "code": "const state = createGame();\nconst platform = { x: 100, y: 300, kind: PLAIN, floor: 9, crumbling: 0 };\nlandOnPlatform(state, platform);\nassert(state.floor === 9);\nassert(state.score === 10);"
            },
            {
                "name": "Landing on a floor you have already had scores nothing",
                "code": "const state = createGame();\nstate.floor = 20;\nstate.score = 0;\nconst platform = { x: 100, y: 300, kind: PLAIN, floor: 9, crumbling: 0 };\nlandOnPlatform(state, platform);\nassert(state.score === 0, 'you have already been to floor 9');"
            },
            {
                "name": "A plain platform does nothing else",
                "code": "const state = createGame();\nconst platform = { x: 100, y: 300, kind: PLAIN, floor: 9, crumbling: 0 };\nlandOnPlatform(state, platform);\nassert(state.health === MAX_HEALTH, 'a plain platform is safe');\nassert(state.player.riding === platform);"
            },
            {
                "name": "锯齿 spikes cost blood",
                "code": "const state = createGame();\nconst platform = { x: 100, y: 300, kind: SPIKED, floor: 9, crumbling: 0 };\nlandOnPlatform(state, platform);\nassert(state.health === MAX_HEALTH - SPIKE_DAMAGE, 'blood is ' + state.health);"
            },
            {
                "name": "A spring throws you back up",
                "code": "const state = createGame();\nconst platform = { x: 100, y: 300, kind: SPRING, floor: 9, crumbling: 0 };\nlandOnPlatform(state, platform);\nassert(state.player.dy === SPRING_SPEED, 'dy is ' + state.player.dy);\nassert(state.player.dy < 0, 'upwards is negative');\nassert(state.player.riding === null, 'you are in the air again, not standing on it');"
            },
            {
                "name": "A crumbling platform starts falling apart",
                "code": "const state = createGame();\nconst platform = { x: 100, y: 300, kind: CRUMBLING, floor: 9, crumbling: 0 };\nlandOnPlatform(state, platform);\nassert(platform.crumbling === CRUMBLE_SECONDS, 'its timer should have started');"
            },
            {
                "name": "A sliding platform is safe to land on",
                "code": "const state = createGame();\nconst platform = { x: 100, y: 300, kind: SLIDE_LEFT, floor: 9, crumbling: 0 };\nlandOnPlatform(state, platform);\nassert(state.health === MAX_HEALTH, 'it carries you along, it does not hurt you');\nassert(state.player.riding === platform);"
            },
            {
                "name": "Enough spikes finish you off",
                "code": "const state = createGame();\nfor (let i = 0; i < MAX_HEALTH; i++) {\n    landOnPlatform(state, { x: 100, y: 300, kind: SPIKED, floor: 1, crumbling: 0 });\n}\nassert(state.health === 0);\nassert(isDead(state) === true);"
            }
        ],
        "demo": {
            "kind": "land",
            "caption": "Six platforms, one of each kind. Land on the 锯齿 one and watch the blood bar."
        },
        "warning": "A spring must clear `riding` as well as setting dy. Leave the player marked as standing on it and they will be glued to a platform that is trying to throw them off."
    },
    {
        "id": "is_dead",
        "fnName": "isDead",
        "title": "Two ways to go",
        "adds": "The game can end.",
        "intro": "<p>The last rule, and it says exactly what the game is about.</p><p><strong>Run out of blood</strong> — too many 锯齿.<br><strong>Fall off the bottom of the screen</strong> — you missed every platform on the way down.</p><p>Note the second one has to be measured on the SCREEN, not in the world. In the world you are always falling deeper; what matters is whether the camera has lost you.</p>",
        "spec": {
            "input": "state",
            "output": "True if the player is finished",
            "algorithm": [
                "No blood left is death.",
                "So is being below the bottom of the screen — use screen-y to find out where the player actually appears."
            ]
        },
        "starter": "function isDead(state) {\n    // no blood left, or fallen off the bottom of the screen\n}\n",
        "answer": "function isDead(state) {\n    return state.health <= 0 || screenY(state, state.player.y) > FIELD_HEIGHT;\n}\n",
        "hints": [
            "Two things joined with || — either one is enough.",
            "Use screenY(state, state.player.y), not the world position.",
            "FIELD_HEIGHT is the bottom of the screen."
        ],
        "tests": [
            {
                "name": "A fresh game is not over",
                "code": "assert(isDead(createGame()) === false);"
            },
            {
                "name": "No blood left is death",
                "code": "const state = createGame();\nstate.health = 0;\nassert(isDead(state) === true);"
            },
            {
                "name": "Falling off the bottom is death",
                "code": "const state = createGame();\nstate.player.y = state.camera + FIELD_HEIGHT + 1;\nassert(isDead(state) === true, 'the player is below the bottom of the screen');"
            },
            {
                "name": "Being near the bottom is still alive",
                "code": "const state = createGame();\nstate.player.y = state.camera + FIELD_HEIGHT - 20;\nassert(isDead(state) === false, 'still on screen, still in the game');"
            },
            {
                "name": "It is the SCREEN that matters, not the world",
                "code": "const state = createGame();\nstate.camera = 5000;\nstate.player.y = 5100;\nassert(isDead(state) === false, 'a world y of 5100 sounds enormous, but with the camera at 5000 the player is 100 pixels down the screen and perfectly fine');"
            },
            {
                "name": "One point of blood is enough to live on",
                "code": "const state = createGame();\nstate.health = 1;\nassert(isDead(state) === false);"
            }
        ],
        "demo": {
            "kind": "final",
            "flags": {
                "robot": true
            },
            "caption": "A robot climber plays the finished game. Click the page and take over with ← and →."
        }
    }
];
