/* ============================================================
   sokoban-python-steps.js - the 6 steps of "Build Sokoban in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const SOKOBAN_PYTHON_STEPS = [
    {
        "id": "is_wall",
        "fnName": "is_wall",
        "title": "What can you walk on?",
        "adds": "The walls become solid.",
        "intro": "<p>The level is stored as a list of true/false: is this square a wall?</p><p>There is one extra rule worth copying into every grid game you ever write: anything <em>outside</em> the level counts as a wall too. Get that right here and no other function ever has to worry about walking off the edge of the world.</p>",
        "spec": {
            "input": "state, x, y",
            "output": "True if you cannot walk there",
            "algorithm": [
                "If x or y is outside the level, return True.",
                "Otherwise look the square up in state.walls."
            ]
        },
        "starter": "def is_wall(state, x, y):\n    # outside the level counts as a wall too\n    pass\n",
        "answer": "def is_wall(state, x, y):\n    if not (0 <= x < LEVEL_WIDTH) or not (0 <= y < LEVEL_HEIGHT):\n        return True\n    return state[\"walls\"][cell_index(x, y)]\n",
        "hints": [
            "Check the edges FIRST, before looking anything up in the list.",
            "0 <= x < LEVEL_WIDTH checks both edges in one go.",
            "Outside the level returns True - not False."
        ],
        "tests": [
            {
                "name": "The border of every level is wall",
                "code": "state = create_game()\nassert is_wall(state, 0, 0) is True\nassert is_wall(state, 0, 3) is True"
            },
            {
                "name": "Open floor is not",
                "code": "state = create_game()\nassert is_wall(state, 4, 3) is False"
            },
            {
                "name": "Outside the level counts as wall",
                "code": "state = create_game()\nassert is_wall(state, -1, 3) is True\nassert is_wall(state, LEVEL_WIDTH, 3) is True\nassert is_wall(state, 4, -1) is True\nassert is_wall(state, 4, LEVEL_HEIGHT) is True"
            },
            {
                "name": "The level with a wall in the middle knows about it",
                "code": "state = create_game()\nload_level(state, 3)\nassert is_wall(state, 4, 2) is True"
            },
            {
                "name": "You can never walk off any level",
                "code": "state = create_game()\nfor level in range(len(LEVELS)):\n    load_level(state, level)\n    for x in range(LEVEL_WIDTH):\n        assert is_wall(state, x, 0) and is_wall(state, x, LEVEL_HEIGHT - 1)"
            }
        ],
        "demo": {
            "kind": "walls",
            "caption": "Move the dashed box around and see which squares are wall."
        }
    },
    {
        "id": "box_at",
        "fnName": "box_at",
        "title": "Which box is that?",
        "adds": "The game can find its boxes.",
        "intro": "<p>The boxes are a list of positions, and the move function needs to know not just <em>whether</em> there is a box in the way, but <strong>which one</strong> — so it can move that one.</p><p>So this returns a number: 0, 1, 2 … or -1 for none. Using -1 to mean 'not found' is an old convention you will meet everywhere.</p>",
        "spec": {
            "input": "state, x, y",
            "output": "which box it is, or -1 for none",
            "algorithm": [
                "Look through the boxes one at a time.",
                "If a box's x and y both match, return its position in the list.",
                "If you get all the way through, return -1."
            ]
        },
        "starter": "def box_at(state, x, y):\n    # which box is standing here? -1 for none\n    pass\n",
        "answer": "def box_at(state, x, y):\n    for i, box in enumerate(state[\"boxes\"]):\n        if box[\"x\"] == x and box[\"y\"] == y:\n            return i\n    return -1\n",
        "hints": [
            "enumerate gives you the position and the box together.",
            "BOTH the x and the y have to match.",
            "return -1 goes after the loop, not inside it."
        ],
        "tests": [
            {
                "name": "It finds a box that is there",
                "code": "state = create_game()\nbox = state['boxes'][0]\nassert box_at(state, box['x'], box['y']) == 0"
            },
            {
                "name": "Empty floor gives -1",
                "code": "state = create_game()\nassert box_at(state, 1, 1) == -1"
            },
            {
                "name": "It finds the SECOND box too",
                "code": "state = create_game()\nload_level(state, 2)\nbox = state['boxes'][1]\nassert box_at(state, box['x'], box['y']) == 1, 'the answer must say WHICH box'"
            },
            {
                "name": "Both the x and the y have to match",
                "code": "state = create_game()\nbox = state['boxes'][0]\nassert box_at(state, box['x'], box['y'] + 1) == -1\nassert box_at(state, box['x'] + 1, box['y']) == -1"
            },
            {
                "name": "Every box can be found where it stands",
                "code": "state = create_game()\nload_level(state, 4)\nfor i, box in enumerate(state['boxes']):\n    assert box_at(state, box['x'], box['y']) == i"
            }
        ],
        "demo": {
            "kind": "boxes",
            "caption": "Move the dashed box onto a crate and watch the number change."
        }
    },
    {
        "id": "boxes_on_goals",
        "fnName": "boxes_on_goals",
        "title": "How many are home?",
        "adds": "The game can tell how you are doing.",
        "intro": "<p>A short one that does two jobs: it fills in the scoreboard, and the next function is built entirely out of it.</p>",
        "spec": {
            "input": "state",
            "output": "how many boxes are standing on a target",
            "algorithm": [
                "Start a count at 0.",
                "For each box, ask is-goal whether it is standing on a target.",
                "Add 1 if it is."
            ]
        },
        "starter": "def boxes_on_goals(state):\n    # count the boxes standing on a target\n    pass\n",
        "answer": "def boxes_on_goals(state):\n    return sum(1 for box in state[\"boxes\"] if is_goal(state, box[\"x\"], box[\"y\"]))\n",
        "hints": [
            "is_goal(state, x, y) is written for you.",
            "Walk the BOXES, not the whole level.",
            "sum(1 for ... if ...) counts the ones that match."
        ],
        "tests": [
            {
                "name": "A fresh level has nothing home",
                "code": "assert boxes_on_goals(create_game()) == 0"
            },
            {
                "name": "Pushing a box home counts it",
                "code": "state = create_game()\nmove_player(state, -1, 0)\nassert boxes_on_goals(state) == 1"
            },
            {
                "name": "It counts every box, not just the first",
                "code": "state = create_game()\nload_level(state, 2)\nstate['boxes'][0] = {'x': 4, 'y': 2}\nstate['boxes'][1] = {'x': 5, 'y': 2}\nassert boxes_on_goals(state) == 2"
            },
            {
                "name": "A box on plain floor does not count",
                "code": "state = create_game()\nload_level(state, 2)\nstate['boxes'][0] = {'x': 1, 'y': 1}\nassert boxes_on_goals(state) < len(state['boxes'])"
            },
            {
                "name": "It never counts more boxes than there are",
                "code": "state = create_game()\nfor level in range(len(LEVELS)):\n    load_level(state, level)\n    assert boxes_on_goals(state) <= len(state['boxes'])"
            }
        ],
        "demo": {
            "kind": "push",
            "caption": "Push the boxes about and watch the count."
        }
    },
    {
        "id": "move_player",
        "fnName": "move_player",
        "title": "Walk and push",
        "adds": "The game can be played!",
        "intro": "<p>The heart of Sokoban, and it is all about looking <em>two</em> squares ahead.</p><p>Step into a wall and nothing happens. Step into a box and you have to check the square <strong>behind the box</strong> as well — because that is where the box is going. If a wall or another box is there, nothing moves at all: not the box, and not you.</p><p>Save a snapshot for undo <em>before</em> you change anything, or the undo will remember the move you just made instead of the one before it.</p>",
        "spec": {
            "input": "state. dx, dy — the step, e.g. 1 and 0 for 'right'.",
            "output": "True if anything moved",
            "algorithm": [
                "Work out the square you are stepping into. If it is a wall, stop.",
                "Ask box-at whether a box is there.",
                "If it is: work out where the box would go. If that square is a wall or holds another box, stop.",
                "Save a snapshot onto the history, then move the box and count the push.",
                "If there was no box, just save the snapshot.",
                "Move yourself, count the move, and see whether the level is solved."
            ]
        },
        "starter": "def move_player(state, dx, dy):\n    # 1. wall? stop\n    # 2. box? check BEHIND the box too\n    # 3. save for undo, then move\n    pass\n",
        "answer": "def move_player(state, dx, dy):\n    if state[\"is_solved\"] or state[\"is_paused\"]:\n        return False\n    to_x = state[\"player\"][\"x\"] + dx\n    to_y = state[\"player\"][\"y\"] + dy\n\n    if is_wall(state, to_x, to_y):\n        return False\n\n    box = box_at(state, to_x, to_y)\n    if box != -1:\n        box_to_x = to_x + dx\n        box_to_y = to_y + dy\n        if is_wall(state, box_to_x, box_to_y) or box_at(state, box_to_x, box_to_y) != -1:\n            return False\n        state[\"history\"].append(snapshot(state))\n        state[\"boxes\"][box] = {\"x\": box_to_x, \"y\": box_to_y}\n        state[\"pushes\"] += 1\n    else:\n        state[\"history\"].append(snapshot(state))\n\n    state[\"player\"] = {\"x\": to_x, \"y\": to_y}\n    state[\"moves\"] += 1\n\n    if is_solved(state):\n        state[\"is_solved\"] = True\n    return True\n",
        "hints": [
            "The box goes one step FURTHER in the same direction: to_x + dx.",
            "Two things can block a box: a wall, and another box.",
            "snapshot(state) and state['history'].append(...) do the undo bookkeeping."
        ],
        "tests": [
            {
                "name": "Walking on empty floor works",
                "code": "state = create_game()\nbefore = state['player']['x']\nmove_player(state, 1, 0)\nassert state['player']['x'] == before + 1"
            },
            {
                "name": "A wall stops you dead",
                "code": "state = create_game()\nstate['player'] = {'x': 1, 'y': 1}\nassert move_player(state, -1, 0) is False\nassert state['player']['x'] == 1"
            },
            {
                "name": "Walking into a box pushes it",
                "code": "state = create_game()\nbefore = dict(state['boxes'][0])\nmove_player(state, -1, 0)\nassert state['boxes'][0]['x'] == before['x'] - 1"
            },
            {
                "name": "Pushing a box into a wall does nothing at all",
                "code": "state = create_game()\nload_level(state, 1)\nstate['player'] = {'x': 5, 'y': 2}\nstate['boxes'][0] = {'x': 5, 'y': 1}\nassert move_player(state, 0, -1) is False\nassert state['player']['y'] == 2"
            },
            {
                "name": "A box cannot be pushed into another box",
                "code": "state = create_game()\nload_level(state, 2)\nstate['player'] = {'x': 2, 'y': 3}\nstate['boxes'][0] = {'x': 3, 'y': 3}\nstate['boxes'][1] = {'x': 4, 'y': 3}\nassert move_player(state, 1, 0) is False"
            },
            {
                "name": "A push is counted",
                "code": "state = create_game()\nmove_player(state, -1, 0)\nassert state['pushes'] == 1"
            },
            {
                "name": "Walking without pushing does not count as a push",
                "code": "state = create_game()\nmove_player(state, 1, 0)\nassert state['pushes'] == 0"
            },
            {
                "name": "Every move is remembered for undo",
                "code": "state = create_game()\nmove_player(state, 1, 0)\nmove_player(state, 0, 1)\nassert len(state['history']) == 2"
            },
            {
                "name": "Getting the box home solves the level",
                "code": "state = create_game()\nmove_player(state, -1, 0)\nassert state['is_solved'] is True"
            },
            {
                "name": "Level 1 can really be solved",
                "code": "state = create_game()\nassert move_player(state, -1, 0) is True\nassert boxes_on_goals(state) == len(state['boxes'])"
            }
        ],
        "demo": {
            "kind": "push",
            "caption": "Walk around and push the boxes onto the rings."
        },
        "warning": "Check the square BEHIND the box as well. Miss that and boxes will happily slide into walls and through each other."
    },
    {
        "id": "undo_move",
        "fnName": "undo_move",
        "title": "Undo",
        "adds": "You can take a move back.",
        "intro": "<p>Sokoban only lets you push, never pull. Shove a box into a corner and the level is finished — not lost, just impossible. Without undo that would be miserable.</p><p>The history is a <strong>stack</strong>: snapshots piled up, newest on top. Undo takes the top one off and puts it back. Because every move added exactly one, undo can walk all the way to the start of the level.</p>",
        "spec": {
            "input": "state",
            "output": "True if there was anything to undo",
            "algorithm": [
                "If the history is empty, there is nothing to undo.",
                "Take the newest snapshot off the top.",
                "Put its player and boxes back into the state.",
                "Count it as a move, and work out whether the level is still solved."
            ]
        },
        "starter": "def undo_move(state):\n    # take the newest snapshot off the stack and put it back\n    pass\n",
        "answer": "def undo_move(state):\n    if not state[\"history\"]:\n        return False\n    past = state[\"history\"].pop()\n    state[\"player\"] = past[\"player\"]\n    state[\"boxes\"] = past[\"boxes\"]\n    state[\"moves\"] += 1\n    state[\"is_solved\"] = is_solved(state)\n    return True\n",
        "hints": [
            "pop() takes the LAST thing off a list - the newest snapshot.",
            "Put back both the player and the boxes.",
            "Work out is_solved again - undoing can un-solve a level."
        ],
        "tests": [
            {
                "name": "Undo puts the player back",
                "code": "state = create_game()\nbefore = state['player']['x']\nmove_player(state, 1, 0)\nundo_move(state)\nassert state['player']['x'] == before"
            },
            {
                "name": "Undo puts a pushed box back",
                "code": "state = create_game()\nbefore = state['boxes'][0]['x']\nmove_player(state, -1, 0)\nundo_move(state)\nassert state['boxes'][0]['x'] == before"
            },
            {
                "name": "Undo with nothing to undo does nothing",
                "code": "assert undo_move(create_game()) is False"
            },
            {
                "name": "Undo can walk all the way back",
                "code": "state = create_game()\nstart = dict(state['player'])\nmove_player(state, 1, 0)\nmove_player(state, 0, 1)\nmove_player(state, 1, 0)\nwhile undo_move(state):\n    pass\nassert state['player'] == start"
            },
            {
                "name": "Undo un-solves a solved level",
                "code": "state = create_game()\nmove_player(state, -1, 0)\nassert state['is_solved'] is True\nundo_move(state)\nassert state['is_solved'] is False"
            },
            {
                "name": "The snapshots really are separate copies",
                "code": "state = create_game()\nmove_player(state, -1, 0)\nstate['boxes'][0]['x'] = 99\nundo_move(state)\nassert state['boxes'][0]['x'] != 99, 'the saved snapshot must be a COPY'"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Push a box somewhere silly, then press Undo until you are back at the start."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function. Four directions, plus undo, reset and next.</p><p>Notice that undo has three keys — U, Z and Backspace. Different people reach for different ones, and letting all three work costs nothing.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "The arrows or WASD walk.",
                "U, Z or Backspace → 'undo'. R → 'reset'. N or Enter → 'next'. P → 'pause'.",
                "Anything else → null / None."
            ]
        },
        "starter": "def action_for_key(key):\n    keys = {\n        # \"arrowup\": \"up\", ...\n    }\n    return keys.get(str(key).lower())\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"u\": \"undo\", \"z\": \"undo\", \"backspace\": \"undo\",\n        \"r\": \"reset\", \"n\": \"next\", \"enter\": \"next\", \"p\": \"pause\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "Backspace's key name is exactly 'Backspace' - lower-cased, 'backspace'.",
            "Three different keys can all point at \"undo\".",
            "keys.get(...) gives None for anything not listed."
        ],
        "tests": [
            {
                "name": "The arrows walk",
                "code": "assert action_for_key('ArrowUp') == 'up'\nassert action_for_key('ArrowDown') == 'down'\nassert action_for_key('ArrowLeft') == 'left'\nassert action_for_key('ArrowRight') == 'right'"
            },
            {
                "name": "WASD walks too",
                "code": "assert action_for_key('w') == 'up'\nassert action_for_key('s') == 'down'\nassert action_for_key('a') == 'left'\nassert action_for_key('d') == 'right'"
            },
            {
                "name": "All three undo keys work",
                "code": "assert action_for_key('u') == 'undo'\nassert action_for_key('z') == 'undo'\nassert action_for_key('Backspace') == 'undo'"
            },
            {
                "name": "R resets and N moves on",
                "code": "assert action_for_key('r') == 'reset'\nassert action_for_key('n') == 'next'\nassert action_for_key('Enter') == 'next'"
            },
            {
                "name": "Capital letters work",
                "code": "assert action_for_key('U') == 'undo'\nassert action_for_key('R') == 'reset'"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert action_for_key('q') is None\nassert action_for_key('Tab') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then solve all six levels with the arrow keys. U undoes."
        }
    }
];
