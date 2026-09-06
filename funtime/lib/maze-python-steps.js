/* ============================================================
   maze-python-steps.js - the 5 steps of "Build Maze Runner in Python"

   Each step teaches one function. Every test is a few lines of real
   Python ending in an assert, so a failing test explains itself.
   ============================================================ */

const MAZE_PYTHON_STEPS = [
    {
        "id": "is_wall",
        "fnName": "is_wall",
        "title": "Solid rock",
        "adds": "The maze knows where you can walk.",
        "intro": "<p>The maze is one long list of true/false: is this square solid rock?</p><p>And the same rule as always — anything <em>outside</em> the maze counts as rock too. One line here, and no other function ever has to worry about walking off the edge of the world.</p>",
        "spec": {
            "input": "maze, x, y",
            "output": "True if you cannot walk there",
            "algorithm": [
                "If x or y is outside the maze, return True.",
                "Otherwise look the square up in the maze list."
            ]
        },
        "starter": "def is_wall(maze, x, y):\n    # outside the maze is solid too\n    pass\n",
        "answer": "def is_wall(maze, x, y):\n    if not is_inside_maze(x, y):\n        return True\n    return maze[maze_index(x, y)]\n",
        "hints": [
            "is_inside_maze(x, y) is written for you.",
            "maze_index(x, y) turns a pair into a place in the list.",
            "Outside the maze returns True - not False."
        ],
        "tests": [
            {
                "name": "Solid rock is wall",
                "code": "assert is_wall(solid_maze(), 5, 5) is True"
            },
            {
                "name": "A dug-out square is not",
                "code": "maze = solid_maze()\nmaze[maze_index(5, 5)] = False\nassert is_wall(maze, 5, 5) is False"
            },
            {
                "name": "Outside the maze counts as wall",
                "code": "maze = solid_maze()\nassert is_wall(maze, -1, 5) is True\nassert is_wall(maze, MAZE_WIDTH, 5) is True\nassert is_wall(maze, 5, -1) is True\nassert is_wall(maze, 5, MAZE_HEIGHT) is True"
            },
            {
                "name": "A real maze has open corridors",
                "code": "assert is_wall(carve_maze(), 1, 1) is False"
            },
            {
                "name": "A real maze has a solid border",
                "code": "maze = carve_maze()\nfor x in range(MAZE_WIDTH):\n    assert is_wall(maze, x, 0) and is_wall(maze, x, MAZE_HEIGHT - 1)\nfor y in range(MAZE_HEIGHT):\n    assert is_wall(maze, 0, y) and is_wall(maze, MAZE_WIDTH - 1, y)"
            }
        ],
        "demo": {
            "kind": "rock",
            "caption": "Move the dashed box around a tiny hand-dug maze."
        }
    },
    {
        "id": "room_neighbours",
        "fnName": "room_neighbours",
        "title": "Rooms and the walls between",
        "adds": "The digger knows where it could go next.",
        "intro": "<p>Here is the idea that makes maze-digging easy. The maze is stored so that <strong>rooms sit at odd coordinates</strong> — (1,1), (1,3), (3,1) and so on — and the square between two rooms is the wall that separates them.</p><p>So a neighbouring room is <em>two</em> squares away, and the wall to knock through is the <em>one</em> square in between. This function returns both, so the digger has everything it needs.</p>",
        "spec": {
            "input": "x, y — a room",
            "output": "a list of the neighbouring rooms and the wall between each",
            "algorithm": [
                "Try all four steps: up two, right two, down two, left two.",
                "Skip any that would land outside the maze.",
                "For each one that fits, give back the room's x and y, and the wall's x and y — which is halfway there."
            ]
        },
        "starter": "def room_neighbours(x, y):\n    found = []\n    # the room two away, and the wall one away\n    return found\n",
        "answer": "def room_neighbours(x, y):\n    found = []\n    for dx, dy in ((0, -2), (2, 0), (0, 2), (-2, 0)):\n        nx, ny = x + dx, y + dy\n        if is_inside_maze(nx, ny):\n            found.append((nx, ny, x + dx // 2, y + dy // 2))\n    return found\n",
        "hints": [
            "The wall is exactly halfway, so use dx // 2 and dy // 2.",
            "is_inside_maze(nx, ny) keeps you on the board.",
            "Give back a tuple: (room x, room y, wall x, wall y)."
        ],
        "tests": [
            {
                "name": "A room in the middle has four neighbours",
                "code": "assert len(room_neighbours(5, 5)) == 4"
            },
            {
                "name": "The top-left room has only two",
                "code": "assert len(room_neighbours(1, 1)) == 2"
            },
            {
                "name": "Neighbours really are two squares away",
                "code": "for nx, ny, wx, wy in room_neighbours(5, 5):\n    assert abs(nx - 5) + abs(ny - 5) == 2"
            },
            {
                "name": "The wall is halfway between",
                "code": "for nx, ny, wx, wy in room_neighbours(5, 5):\n    assert wx == (5 + nx) // 2 and wy == (5 + ny) // 2"
            },
            {
                "name": "Every neighbour it names is on the maze",
                "code": "for y in range(1, MAZE_HEIGHT, 2):\n    for x in range(1, MAZE_WIDTH, 2):\n        for nx, ny, wx, wy in room_neighbours(x, y):\n            assert is_inside_maze(nx, ny)"
            },
            {
                "name": "Every neighbour is a room, not a wall square",
                "code": "for nx, ny, wx, wy in room_neighbours(5, 5):\n    assert nx % 2 == 1 and ny % 2 == 1, 'rooms live at ODD coordinates'"
            }
        ],
        "demo": {
            "kind": "rock",
            "caption": "The rooms are at odd coordinates — walk the box along row 1 and see."
        }
    },
    {
        "id": "carve_maze",
        "fnName": "carve_maze",
        "title": "Dig the maze",
        "adds": "A brand-new maze, every game.",
        "intro": "<p>The big one. This is the <strong>recursive backtracker</strong>, and it is the algorithm behind most of the mazes you have ever played.</p><p>It works exactly like walking through solid rock with a pick and a piece of string:</p><ol><li>Dig out the first room and hold on to it (that is the stack).</li><li>Look at the room you are standing in. Are any of its neighbours still solid?</li><li>If yes: pick one at random, knock through the wall between, dig it out, and walk in. Hold on to that room too.</li><li>If no: walk back one room along your string, and look again.</li><li>When your string runs out, every room has been dug and the maze is finished.</li></ol><p>What you get is a <em>perfect</em> maze: every room reachable, exactly one route between any two of them, no loops.</p>",
        "spec": {
            "input": "nothing",
            "output": "a maze — a list where True means wall",
            "algorithm": [
                "Start with solid rock. Dig out room (1, 1) and put it on the stack.",
                "While the stack is not empty, look at the room on TOP of it.",
                "Shuffle its neighbours, and look for the first one that is still solid rock.",
                "If you find one: knock out the wall between, dig out the room, and push the room onto the stack.",
                "If there is none: pop the top room off the stack.",
                "When the stack is empty, return the maze."
            ]
        },
        "starter": "def carve_maze():\n    maze = solid_maze()\n    # dig (1,1), then walk with a stack until it is empty\n    return maze\n",
        "answer": "def carve_maze():\n    maze = solid_maze()\n    maze[maze_index(1, 1)] = False\n\n    stack = [(1, 1)]\n    while stack:\n        x, y = stack[-1]\n        options = room_neighbours(x, y)\n        random.shuffle(options)\n\n        dug = False\n        for nx, ny, wall_x, wall_y in options:\n            if is_wall(maze, nx, ny):\n                maze[maze_index(wall_x, wall_y)] = False\n                maze[maze_index(nx, ny)] = False\n                stack.append((nx, ny))\n                dug = True\n                break\n\n        if not dug:\n            stack.pop()\n    return maze\n",
        "hints": [
            "stack[-1] is the room you are standing in - LOOK at it, do not remove it yet.",
            "random.shuffle(options) mixes the list up in place.",
            "Knock out TWO squares: the wall between, and the room itself.",
            "Only pop when there was nowhere new to dig."
        ],
        "tests": [
            {
                "name": "The starting room is dug out",
                "code": "assert is_wall(carve_maze(), 1, 1) is False"
            },
            {
                "name": "Every room gets dug out",
                "code": "maze = carve_maze()\nfor y in range(1, MAZE_HEIGHT, 2):\n    for x in range(1, MAZE_WIDTH, 2):\n        assert is_wall(maze, x, y) is False, f'room ({x},{y}) was never dug'"
            },
            {
                "name": "The border stays solid",
                "code": "maze = carve_maze()\nfor x in range(MAZE_WIDTH):\n    assert is_wall(maze, x, 0) and is_wall(maze, x, MAZE_HEIGHT - 1)\nfor y in range(MAZE_HEIGHT):\n    assert is_wall(maze, 0, y) and is_wall(maze, MAZE_WIDTH - 1, y)"
            },
            {
                "name": "Every room can be reached from the start",
                "code": "maze = carve_maze()\nfor y in range(1, MAZE_HEIGHT, 2):\n    for x in range(1, MAZE_WIDTH, 2):\n        assert find_path(maze, {'x': 1, 'y': 1}, {'x': x, 'y': y}), f'room ({x},{y}) is walled off'"
            },
            {
                "name": "The exit can be reached",
                "code": "for _ in range(12):\n    assert shortest_from_start(carve_maze()) > 0"
            },
            {
                "name": "Corners of the wall grid stay solid",
                "code": "maze = carve_maze()\nassert is_wall(maze, 2, 2) is True, 'the square where four walls meet can never be dug'\nassert is_wall(maze, 4, 6) is True"
            },
            {
                "name": "Two mazes in a row are different",
                "code": "assert carve_maze() != carve_maze()"
            }
        ],
        "demo": {
            "kind": "carve",
            "caption": "Press the button and watch a brand-new maze appear, every time."
        },
        "warning": "LOOK at the top of the stack, do not pop it, until you are sure there is nowhere new to dig. Pop too early and the digger never walks back — leaving most of the maze solid rock."
    },
    {
        "id": "find_path",
        "fnName": "find_path",
        "title": "Find the way out",
        "adds": "The maze can show you the shortest route.",
        "intro": "<p>The most useful algorithm in this whole collection: <strong>breadth-first search</strong>. It finds the shortest way through anything — a maze, a road map, a chess position, six degrees of separation.</p><p>It works by spreading out evenly, like a ripple:</p><ol><li>Put the starting square in a <strong>queue</strong>, and remember that you came to it from nowhere.</li><li>Take the square at the FRONT of the queue.</li><li>For each open neighbour you have never seen: remember which square you came from, and add it to the BACK of the queue.</li><li>When you take the target off the queue, follow the 'came from' trail backwards to build the route.</li></ol><p>The queue is the whole trick. Front in, back out means you always look at the nearest squares first — so the first time you arrive anywhere is by the shortest possible route.</p>",
        "spec": {
            "input": "maze. from, to — two squares.",
            "output": "a list of squares from start to finish, or an empty list",
            "algorithm": [
                "Remember where you came from for each square. The start came from nowhere: -1.",
                "Keep a queue, starting with the first square, and take squares from the FRONT.",
                "If this square is the target, build the path and return it.",
                "Otherwise look at the four squares around it. If one is open and you have never seen it, note where it came from and add it to the BACK of the queue.",
                "If the queue empties out, there is no way through: return an empty list."
            ]
        },
        "starter": "def find_path(maze, start, goal):\n    # breadth-first search: a queue, and a trail of where you came from\n    return []\n",
        "answer": "def find_path(maze, start, goal):\n    came_from = {maze_index(start[\"x\"], start[\"y\"]): -1}\n    queue = deque([start])\n\n    while queue:\n        here = queue.popleft()\n\n        if here[\"x\"] == goal[\"x\"] and here[\"y\"] == goal[\"y\"]:\n            return build_path(came_from, goal)\n\n        for dx, dy in ((0, -1), (1, 0), (0, 1), (-1, 0)):\n            nx, ny = here[\"x\"] + dx, here[\"y\"] + dy\n            key = maze_index(nx, ny)\n            if not is_wall(maze, nx, ny) and key not in came_from:\n                came_from[key] = maze_index(here[\"x\"], here[\"y\"])\n                queue.append({\"x\": nx, \"y\": ny})\n    return []\n",
        "hints": [
            "deque is already imported. popleft() takes from the FRONT — that is what makes it a queue.",
            "build_path(came_from, goal) is written for you.",
            "`key not in came_from` is how you check you have never seen a square before."
        ],
        "tests": [
            {
                "name": "It finds a way through a real maze",
                "code": "maze = carve_maze()\nassert find_path(maze, {'x': 1, 'y': 1}, exit_square())"
            },
            {
                "name": "The path starts where you asked",
                "code": "maze = carve_maze()\npath = find_path(maze, {'x': 1, 'y': 1}, exit_square())\nassert path[0] == {'x': 1, 'y': 1}"
            },
            {
                "name": "The path ends where you asked",
                "code": "maze = carve_maze()\ngoal = exit_square()\npath = find_path(maze, {'x': 1, 'y': 1}, goal)\nassert path[-1] == goal"
            },
            {
                "name": "Every step of the path is one square",
                "code": "maze = carve_maze()\npath = find_path(maze, {'x': 1, 'y': 1}, exit_square())\nfor i in range(1, len(path)):\n    d = abs(path[i]['x'] - path[i-1]['x']) + abs(path[i]['y'] - path[i-1]['y'])\n    assert d == 1, f'step {i} jumps {d} squares'"
            },
            {
                "name": "The path never goes through rock",
                "code": "maze = carve_maze()\nfor square in find_path(maze, {'x': 1, 'y': 1}, exit_square()):\n    assert is_wall(maze, square['x'], square['y']) is False"
            },
            {
                "name": "Standing on the target gives a path of one",
                "code": "maze = carve_maze()\nassert len(find_path(maze, {'x': 1, 'y': 1}, {'x': 1, 'y': 1})) == 1"
            },
            {
                "name": "It really is the SHORTEST route",
                "code": "maze = solid_maze()\nfor x in range(1, 6):\n    maze[maze_index(x, 1)] = False\n    maze[maze_index(x, 5)] = False\nfor y in range(1, 6):\n    maze[maze_index(1, y)] = False\n    maze[maze_index(5, y)] = False\n    maze[maze_index(3, y)] = False\npath = find_path(maze, {'x': 1, 'y': 1}, {'x': 3, 'y': 5})\nassert len(path) == 7, f'the shortest way is 7 squares, but it found {len(path)}'"
            },
            {
                "name": "A walled-off square gives nothing",
                "code": "maze = solid_maze()\nmaze[maze_index(1, 1)] = False\nmaze[maze_index(9, 9)] = False\nassert find_path(maze, {'x': 1, 'y': 1}, {'x': 9, 'y': 9}) == []"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Press Hint and the shortest way out lights up as a trail of dots."
        },
        "warning": "Take from the FRONT of the queue, not the back. Take from the back and you have a stack, not a queue — it still finds a way out, but a wandering one, not the shortest."
    },
    {
        "id": "action_for_key",
        "fnName": "action_for_key",
        "title": "Take control",
        "adds": "The game is finished!",
        "intro": "<p>The last function. Four directions, a hint, and a new maze.</p>",
        "spec": {
            "input": "key",
            "output": "an action name, or nothing at all",
            "algorithm": [
                "The arrows or WASD walk.",
                "H or space → 'hint'. N or Enter → 'new'. P → 'pause'.",
                "Anything else → null / None."
            ]
        },
        "starter": "def action_for_key(key):\n    keys = {\n        # \"arrowup\": \"up\", ...\n    }\n    return keys.get(str(key).lower())\n",
        "answer": "def action_for_key(key):\n    keys = {\n        \"arrowup\": \"up\", \"w\": \"up\",\n        \"arrowdown\": \"down\", \"s\": \"down\",\n        \"arrowleft\": \"left\", \"a\": \"left\",\n        \"arrowright\": \"right\", \"d\": \"right\",\n        \"h\": \"hint\", \" \": \"hint\", \"spacebar\": \"hint\",\n        \"n\": \"new\", \"enter\": \"new\", \"p\": \"pause\",\n    }\n    return keys.get(str(key).lower())\n",
        "hints": [
            "H for hint, and the space bar as well.",
            "A dictionary is tidier than seven ifs.",
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
                "name": "H and space both ask for a hint",
                "code": "assert action_for_key('h') == 'hint'\nassert action_for_key(' ') == 'hint'"
            },
            {
                "name": "N and Enter both dig a new maze",
                "code": "assert action_for_key('n') == 'new'\nassert action_for_key('Enter') == 'new'"
            },
            {
                "name": "Capital letters work",
                "code": "assert action_for_key('H') == 'hint'\nassert action_for_key('N') == 'new'"
            },
            {
                "name": "Other keys do nothing",
                "code": "assert action_for_key('q') is None\nassert action_for_key('Tab') is None"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then find your way out with the arrow keys. H if you get lost."
        }
    }
];
