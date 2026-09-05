#!/usr/bin/env python3
"""Check the Python versions of the three games.

    python3 funtime/tests/test_python_games.py

These are the same checks the JavaScript suites make, written against the
Python modules in funtime/pylib. The drawing modules are tested too, with a
pretend canvas that simply counts what it was asked to draw.
"""

import pathlib
import random
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "pylib"))

import race_draw                      # noqa: E402
import race_rules as race             # noqa: E402
import snake_draw                     # noqa: E402
import snake_rules as snake           # noqa: E402
import tetris_draw                    # noqa: E402
import tetris_rules as tetris         # noqa: E402

failures = 0
checks = 0


def check(name, condition, extra=None):
    """Report one check."""
    global failures, checks
    checks += 1
    if condition:
        print("  ok   " + name)
    else:
        failures += 1
        print("  FAIL " + name + ("  -> " + str(extra) if extra is not None else ""))


class FakeCanvas:
    """A pretend canvas that counts the drawing calls instead of painting."""

    def __init__(self):
        object.__setattr__(self, "calls", {})

    def __getattr__(self, name):
        def record(*args):
            self.calls[name] = self.calls.get(name, 0) + 1
        return record

    def __setattr__(self, name, value):
        pass


print("Snake in Python - the grid:")
check("the grid is 20 x 20", snake.GRID_WIDTH == 20 and snake.GRID_HEIGHT == 20)
check("up means y goes down", snake.DIRECTIONS["up"] == (0, -1))
check("same_position compares values", snake.same_position((3, 7), (3, 7)) and not snake.same_position((3, 7), (7, 3)))
check("add_direction steps one square", snake.add_direction((5, 5), snake.DIRECTIONS["up"]) == (5, 4))
check("is_inside_grid knows all four walls",
      snake.is_inside_grid((0, 0)) and snake.is_inside_grid((19, 19))
      and not snake.is_inside_grid((-1, 5)) and not snake.is_inside_grid((20, 5))
      and not snake.is_inside_grid((5, -1)) and not snake.is_inside_grid((5, 20)))
check("contains_position finds a square", snake.contains_position([(1, 1), (2, 2)], (2, 2))
      and not snake.contains_position([], (0, 0)))
check("is_opposite_direction spots U-turns only",
      snake.is_opposite_direction(snake.DIRECTIONS["up"], snake.DIRECTIONS["down"])
      and not snake.is_opposite_direction(snake.DIRECTIONS["up"], snake.DIRECTIONS["left"])
      and not snake.is_opposite_direction(snake.DIRECTIONS["up"], snake.DIRECTIONS["up"]))
check("empty_cells leaves out the snake", len(snake.empty_cells([(0, 0), (1, 0)])) == 398)
check("random_empty_cell is never on the snake",
      all(not snake.contains_position(snake.create_starting_snake(),
                                      snake.random_empty_cell(snake.create_starting_snake()))
          for _ in range(50)))
check("a full board gives None",
      snake.random_empty_cell([(x, y) for y in range(20) for x in range(20)]) is None)

print("Snake in Python - the rules:")
check("a new snake is 3 squares in the middle", snake.create_starting_snake() == [(10, 10), (9, 10), (8, 10)])
check("move_snake adds a head and drops the tail",
      snake.move_snake([(2, 0), (1, 0), (0, 0)], (3, 0), False) == [(3, 0), (2, 0), (1, 0)])
check("move_snake keeps the tail when growing",
      len(snake.move_snake([(2, 0), (1, 0), (0, 0)], (3, 0), True)) == 4)


def snake_state(**changes):
    state = snake.create_game()
    state.update(changes)
    return state


state = snake_state(food=(0, 0))
snake.step_game(state)
check("one step moves the snake forward", state["snake"][0] == (11, 10))

state = snake_state(food=(0, 0), snake=[(19, 10), (18, 10), (17, 10)])
snake.step_game(state)
check("the snake dies against a wall", state["is_over"])

state = snake_state(food=(0, 0), snake=[(5, 5), (4, 5), (4, 4), (5, 4), (6, 4), (6, 5)],
                    direction=snake.DIRECTIONS["up"])
snake.step_game(state)
check("the snake dies biting its own body", state["is_over"])

state = snake_state(food=(0, 0), snake=[(5, 5), (5, 4), (6, 4), (6, 5)],
                    direction=snake.DIRECTIONS["right"])
snake.step_game(state)
check("the square the tail is leaving is safe", not state["is_over"])

state = snake_state(snake=[(5, 5), (4, 5), (3, 5)], direction=snake.DIRECTIONS["right"], food=(6, 5))
snake.step_game(state)
check("eating grows, scores and moves the apple",
      len(state["snake"]) == 4 and state["score"] == 10 and state["food"] != (6, 5))

state = snake.create_game()
check("a U-turn is refused", snake.turn_snake(state, snake.DIRECTIONS["left"]) is False)
check("a real turn is accepted", snake.turn_snake(state, snake.DIRECTIONS["up"]) is True)
check("score_for_food is 10 x level", [snake.score_for_food(n) for n in (1, 3)] == [10, 30])
check("level_for_food climbs every 5 apples",
      [snake.level_for_food(n) for n in (0, 4, 5, 23)] == [1, 1, 2, 5])
check("step_interval_for_level has a floor",
      snake.step_interval_for_level(1) == 200 and snake.step_interval_for_level(20) == 70)
check("action_for_key maps the keys",
      [snake.action_for_key(k) for k in ("ArrowUp", "w", "p", " ", "r", "q")]
      == ["up", "up", "pause", "pause", "restart", None])

state = snake.create_game()
state["food"] = (0, 0)
start = state["snake"][0]
snake.update_game(state, 210)
check("gravity crawls the snake on its own", state["snake"][0] != start)

print("Snake in Python - a long game:")
legal = True
for _ in range(20):
    state = snake.create_game()
    for _ in range(600):
        if state["is_over"]:
            break
        if random.random() < 0.25:
            snake.turn_snake(state, random.choice(list(snake.DIRECTIONS.values())))
        snake.step_game(state)
        if not all(snake.is_inside_grid(square) for square in state["snake"]):
            legal = False
        if len(state["snake"]) != 3 + state["eaten"]:
            legal = False
check("20 random games stay legal", legal)

print("Tetris in Python:")
check("seven shapes of four blocks",
      all(sum(sum(row) for row in tetris.SHAPES[t]) == 4 for t in tetris.SHAPE_TYPES))
check("rotate_matrix_clockwise turns the T piece",
      tetris.rotate_matrix_clockwise([[0, 1, 0], [1, 1, 1], [0, 0, 0]]) == [[0, 1, 0], [0, 1, 1], [0, 1, 0]])
check("four turns come back to the start",
      tetris.rotate_matrix_clockwise(tetris.rotate_matrix_clockwise(tetris.rotate_matrix_clockwise(
          tetris.rotate_matrix_clockwise(tetris.SHAPES["J"])))) == tetris.SHAPES["J"])

piece = tetris.create_piece("I")
piece["x"], piece["y"] = 3, 5
twice = tetris.rotate_piece(tetris.rotate_piece(piece))
check("the I piece does not drift when turned twice",
      tetris.piece_blocks(twice) == tetris.piece_blocks(piece),
      tetris.piece_blocks(twice))
check("every piece returns to its squares after four turns",
      all(tetris.piece_blocks(
          tetris.rotate_piece(tetris.rotate_piece(tetris.rotate_piece(tetris.rotate_piece(
              dict(tetris.create_piece(t), x=3, y=5))))))
          == tetris.piece_blocks(dict(tetris.create_piece(t), x=3, y=5))
          for t in tetris.SHAPE_TYPES))

board = tetris.create_empty_board(10, 20)
check("an empty board is 10 x 20 of zeros",
      len(board) == 20 and len(board[0]) == 10 and not any(any(row) for row in board))
check("each row is its own list", board[0] is not board[1])
check("is_row_full", tetris.is_row_full([1] * 10) and not tetris.is_row_full([1, 0]))
check("find_full_rows", tetris.find_full_rows([[1, 1], [1, 0], [1, 1]]) == [0, 2])
check("remove_rows keeps the height and pads the top",
      tetris.remove_rows([[1, 1], [0, 1], [1, 0]], [1]) == [[0, 0], [1, 1], [1, 0]])

piece = tetris.create_piece("O")
piece["x"], piece["y"] = 4, 0
check("drop_distance to an empty floor", tetris.drop_distance(board, piece) == 18)
piece["x"] = -1
check("a piece through the wall cannot be placed", not tetris.can_place_piece(board, piece))
check("score_for_lines table",
      [tetris.score_for_lines(n, 1) for n in range(5)] == [0, 100, 300, 500, 800])
check("level_for_lines", [tetris.level_for_lines(n) for n in (0, 9, 10, 35)] == [1, 1, 2, 4])
check("drop_interval_for_level has a floor",
      tetris.drop_interval_for_level(1) == 800 and tetris.drop_interval_for_level(30) == 90)

game = tetris.create_game()
tetris.hard_drop(game)
check("a hard drop locks four blocks",
      sum(sum(row) for row in game["board"]) == 4 and game["score"] > 0)

game = tetris.create_game()
for row in game["board"]:
    for x in range(len(row)):
        row[x] = 1
tetris.spawn_piece(game)
check("the game ends when the pile reaches the top", game["is_over"])

print("Racing in Python:")
check("three lanes fit between the verges",
      race.EDGE_WIDTH * 2 + race.LANE_COUNT * race.LANE_WIDTH == race.ROAD_WIDTH)
check("lane centres are 60, 150, 240", [race.lane_center_x(i) for i in range(3)] == [60, 150, 240])
check("clamp squeezes a number",
      [race.clamp(50, 0, 100), race.clamp(-30, 0, 100), race.clamp(300, 0, 100)] == [50, 0, 100])
check("a new car sits in the middle of its lane",
      race.create_car(0, 100)["x"] + race.CAR_WIDTH / 2 == race.lane_center_x(0))
check("overlapping rectangles are spotted",
      race.overlaps({"x": 0, "y": 0, "width": 10, "height": 10},
                    {"x": 9, "y": 0, "width": 10, "height": 10}))
check("touching edges do not count",
      not race.overlaps({"x": 0, "y": 0, "width": 10, "height": 10},
                        {"x": 10, "y": 0, "width": 10, "height": 10}))
check("cars in different lanes never touch",
      not race.overlaps(race.create_car(0, 100), race.create_car(1, 100)))

game = race.create_game()
game["steering"] = -1
for _ in range(100):
    race.steer_player(game, 0.1)
check("the car stops at the left verge", game["player"]["x"] == race.PLAYER_MIN_X)

check("move_cars slides them down and copies",
      race.move_cars([race.create_car(0, 10)], 25)[0]["y"] == 35)
check("keep_cars_on_screen drops the ones past the bottom",
      race.keep_cars_on_screen([race.create_car(0, race.ROAD_HEIGHT + 5)]) == [])

game = race.create_game()
for _ in range(200):
    race.spawn_car(game)
check("spawn_car never repeats a lane",
      all(game["cars"][i]["lane"] != game["cars"][i - 1]["lane"] for i in range(1, len(game["cars"]))))
check("spawn_car still uses every lane", len({car["lane"] for car in game["cars"]}) == 3)

game = race.create_game()
game["cars"] = [race.create_car(1, race.PLAYER_Y)]
check("driving into a car is a crash", race.has_crashed(game))
game["cars"] = [race.create_car(0, race.PLAYER_Y), race.create_car(2, race.PLAYER_Y)]
check("a car in another lane is not", not race.has_crashed(game))

check("speed_for_level rises then stops",
      race.speed_for_level(1) == 180 and race.speed_for_level(40) == 520)
check("every level leaves time to change lanes",
      all(race.seconds_between_cars(level) >= 2 * (race.LANE_WIDTH / race.STEER_SPEED)
          for level in range(1, 41)))

game = race.create_game()
game["cars"] = [race.create_car(0, race.ROAD_HEIGHT - 1)]
race.update_race(game, 100)
check("overtaking scores and counts", game["passed"] == 1 and game["score"] == 10)

game = race.create_game()
game["is_paused"] = True
race.update_race(game, 500)
check("a paused race does not move", game["distance"] == 0)

print("Racing in Python - a long drive:")
game = race.create_game()
frames = 0
while not game["is_over"] and frames < 6000:
    def busy(lane):
        look = race.speed_for_level(game["level"]) * 0.9
        return any(car["lane"] == lane
                   and car["y"] + car["height"] > game["player"]["y"] - look
                   and car["y"] < game["player"]["y"] + game["player"]["height"] + 20
                   for car in game["cars"])

    here = round((game["player"]["x"] + game["player"]["width"] / 2
                  - race.EDGE_WIDTH - race.LANE_WIDTH / 2) / race.LANE_WIDTH)
    target = here
    if busy(here):
        if here - 1 >= 0 and not busy(here - 1):
            target = here - 1
        elif here + 1 < race.LANE_COUNT and not busy(here + 1):
            target = here + 1
    want = race.lane_center_x(target) - race.CAR_WIDTH / 2
    game["steering"] = 0 if abs(want - game["player"]["x"]) < 4 else (1 if want > game["player"]["x"] else -1)
    race.update_race(game, 16)
    frames += 1
check("a careful driver survives 6000 frames", not game["is_over"],
      "crashed after %d frames, %d cars passed" % (frames, game["passed"]))
check("and overtakes plenty of cars", game["passed"] > 30, game["passed"])

print("Drawing (with a pretend canvas):")
canvas = FakeCanvas()
snake_draw.render_game(canvas, snake.create_game(), 20)
check("the snake game draws blocks and an apple",
      canvas.calls.get("fillRect", 0) > 0 and canvas.calls.get("arc", 0) > 0)

canvas = FakeCanvas()
tetris_draw.render_game(canvas, tetris.create_game(), 30)
tetris_draw.render_next_piece(canvas, "T", 110, 110, 22)
check("the tetris game draws blocks", canvas.calls.get("fillRect", 0) > 0)

canvas = FakeCanvas()
race_state = race.create_game()
race.spawn_car(race_state)
race_draw.render_game(canvas, race_state)
check("the racing game draws the road and cars", canvas.calls.get("fillRect", 0) > 20)

print("\n%d checks run" % checks)
print("ALL PYTHON GAME TESTS PASSED" if failures == 0 else "%d TEST(S) FAILED" % failures)
sys.exit(0 if failures == 0 else 1)
