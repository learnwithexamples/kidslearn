"""games.py - the list of Fun Time games, in the order they appear.

Each game is described in its own file under tools/specs/. Adding a game means
writing specs/<game>.py and adding its name to ORDER below - nothing else in
the build has to change.
"""

import importlib

# The order games appear on the Fun Time hub.
ORDER = [
    "memory",
    "lights",
    "tictactoe",
    "connect4",
    "whack",
    "simon",
    "breakout",
    "flappy",
    "frogger",
    "invaders",
    "mines",
    "twenty48",
    "sokoban",
    "maze",
    "hangman",
    "typing",
    "reaction",
    "match3",
    "asteroids",
    "bubbles",
    "floors",
    "wordfall",
]

GAMES = [importlib.import_module("specs." + name).SPEC for name in ORDER]

# The games that were hand-written before the factory existed. They are listed
# here so the Fun Time hub can be generated in one place.
CLASSICS = [
    dict(icon="⚽", name="Home Pong", page="homepong.html", link="Play Now!",
         blurb="A two-player soccer pong. Defend your goal and bounce the ball past your friend!"),
    dict(icon="▩", name="Tetris", page="tetris.html", link="Play Now!",
         blurb="The classic black-and-white block puzzle. Rotate, slide, drop — and clear the lines!"),
    dict(icon="🐍", name="Snake", page="snake.html", link="Play Now!",
         blurb="Eat the apples, grow longer, and never bite your own tail."),
    dict(icon="🏎️", name="Car Racing", page="race.html", link="Play Now!",
         blurb="Dodge the traffic on a three-lane road that never ends."),
]

WORKSHOP_CLASSICS = [
    dict(icon="🛠️", name="Build Tetris Yourself", page="tetris-build.html", link="Start Building!",
         blurb="Write the twelve functions behind Tetris, one at a time, and watch the game grow."),
    dict(icon="🛠️", name="Build Snake Yourself", page="snake-build.html", link="Start Building!",
         blurb="Write the twelve functions behind Snake — and see where Python beats JavaScript."),
    dict(icon="🛠️", name="Build Car Racing Yourself", page="race-build.html", link="Start Building!",
         blurb="Twelve functions including the rectangle crash test every game needs."),
]

PYTHON_CLASSICS = [
    dict(icon="▩", name="Tetris in Python", page="tetris-python.html", link="Play in Python!",
         blurb="The block puzzle again — rules and drawing all in Python."),
    dict(icon="🐍", name="Snake in Python", page="snake-python.html", link="Play in Python!",
         blurb="Tuples, lists and `in` — the same snake, said the Python way."),
    dict(icon="🏎️", name="Car Racing in Python", page="race-python.html", link="Play in Python!",
         blurb="Dodge the traffic on a road drawn entirely by Python."),
    dict(icon="🛠️", name="Build Tetris in Python", page="tetris-python-build.html", link="Start Building!",
         blurb="Twelve Python functions, each tested by real Python as you write it."),
    dict(icon="🛠️", name="Build Snake in Python", page="snake-python-build.html", link="Start Building!",
         blurb="Write the snake in Python, one tested function at a time."),
    dict(icon="🛠️", name="Build Car Racing in Python", page="race-python-build.html", link="Start Building!",
         blurb="Lanes, clamping and the crash test — in Python this time."),
]
