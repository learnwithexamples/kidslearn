"""match3_rules.py - the rules of Match Three, in Python.

Swap two neighbouring shapes to make a line of three or more. They vanish,
everything above falls down, new shapes drop in from the top - and if that
makes another line, it all happens again.

That last part is the best bit of this game, and it comes free: clear, fall,
look again, and keep going while there is still something to find.
"""

import random

GRID_SIZE = 8
CELL_COUNT = GRID_SIZE * GRID_SIZE
SHAPE_COUNT = 6
EMPTY = -1

MIN_RUN = 3
POINTS_PER_GEM = 10


def gem_index(column, row):
    """Turn a column and row into a place in the flat list."""
    return row * GRID_SIZE + column


def is_inside_board(column, row):
    """Is this square on the board?"""
    return 0 <= column < GRID_SIZE and 0 <= row < GRID_SIZE


def random_shape():
    """One of the six shapes, at random."""
    return random.randrange(SHAPE_COUNT)


def are_neighbours(a, b):
    """Are these two squares next to each other?

    ALGORITHM: add up how far apart they are across and down. Neighbours are
    exactly 1 apart in total - which neatly rules out the diagonals, where the
    total is 2, and a square with itself, where it is 0.
    """
    across = abs(a["column"] - b["column"])
    down = abs(a["row"] - b["row"])
    return across + down == 1


def swap_gems(board, a, b):
    """Exchange two shapes.

    OUTPUT: a NEW board with the two swapped.
    ALGORITHM: copy the board first, then put each shape where the other was.
    Making a copy means the game can try a swap, look at what would happen,
    and throw the whole thing away if it does not match.
    """
    copy = list(board)
    first = gem_index(a["column"], a["row"])
    second = gem_index(b["column"], b["row"])

    copy[first] = board[second]
    copy[second] = board[first]
    return copy


def scan_line(board, cells, mark_run):
    """Find the runs along one row or column.

    ALGORITHM: keep a run length. Every time the shape changes, report the run
    that just ended and start a new one. Report the last run too - forgetting
    that is the classic bug, and it means a match that reaches the edge of the
    board never counts.
    """
    run_start = 0
    run_length = 1

    for i in range(1, len(cells) + 1):
        same = (i < len(cells)
                and board[cells[i]] == board[cells[i - 1]]
                and board[cells[i]] != EMPTY)
        if same:
            run_length += 1
        else:
            if board[cells[run_start]] != EMPTY:
                mark_run(cells, run_start, run_length)
            run_start = i
            run_length = 1


def find_matches(board):
    """Every shape that is part of a line of three or more.

    OUTPUT: a sorted list of the places to clear, with no repeats.
    ALGORITHM: walk each row keeping a RUN - how many of the same shape you
    have seen in a row. When the shape changes (or the row ends), look at how
    long the run was: three or more and every square in it goes on the list.
    Then do exactly the same down the columns.

    A square in a cross shape belongs to both a row and a column, so a plain
    list would hold it twice - which is why the marks go into a SET.
    """
    marked = set()

    def mark_run(cells, start, length):
        if length >= MIN_RUN:
            marked.update(cells[start:start + length])

    for row in range(GRID_SIZE):
        scan_line(board, [gem_index(c, row) for c in range(GRID_SIZE)], mark_run)

    for column in range(GRID_SIZE):
        scan_line(board, [gem_index(column, r) for r in range(GRID_SIZE)], mark_run)

    return sorted(marked)


def apply_gravity(board):
    """Empty squares fill up from above.

    OUTPUT: a NEW board with everything fallen and the gaps at the top refilled.
    ALGORITHM: take one column at a time. Read it from the BOTTOM upwards,
    collecting the shapes that are still there. Put them back at the bottom in
    the same order, and fill whatever is left at the top with new shapes.
    """
    result = list(board)

    for column in range(GRID_SIZE):
        kept = []
        for row in range(GRID_SIZE - 1, -1, -1):
            shape = board[gem_index(column, row)]
            if shape != EMPTY:
                kept.append(shape)

        for row in range(GRID_SIZE - 1, -1, -1):
            from_bottom = GRID_SIZE - 1 - row
            result[gem_index(column, row)] = (kept[from_bottom]
                                              if from_bottom < len(kept)
                                              else random_shape())
    return result


def clear_matches(board, matches):
    """Take the matched shapes off the board."""
    result = list(board)
    for index in matches:
        result[index] = EMPTY
    return result


def settle_board(state, board):
    """Clear, drop, and keep going while more lines appear.

    OUTPUT: (the new board, how many cleared, how many chains).
    ALGORITHM: this is where the cascades come from. Clear what matched, let
    everything fall, then LOOK AGAIN. If the falling shapes made a new line,
    round we go - and each round is worth more than the last.
    """
    working = board
    cleared = 0
    chains = 0

    matches = find_matches(working)
    while matches:
        chains += 1
        cleared += len(matches)
        state["score"] += len(matches) * POINTS_PER_GEM * chains

        working = clear_matches(working, matches)
        working = apply_gravity(working)
        matches = find_matches(working)

    return working, cleared, chains


def try_swap(state, a, b):
    """The player's move.

    OUTPUT: True if the swap was allowed.
    ALGORITHM: refuse anything that is not a swap of two neighbours. Then swap
    them and look for a match. NO match means the move was not legal after
    all, so put them back exactly as they were - that is why swap_gems hands
    back a copy instead of changing the board.
    """
    if state["is_over"] or state["is_paused"] or not are_neighbours(a, b):
        return False

    swapped = swap_gems(state["board"], a, b)
    if not find_matches(swapped):
        state["bad_swaps"] += 1
        return False

    board, cleared, chains = settle_board(state, swapped)
    state["board"] = board
    state["moves"] += 1
    state["cleared"] += cleared
    if chains > state["best_chain"]:
        state["best_chain"] = chains
    return True


def has_any_move(board):
    """Is there a swap left anywhere on the board?

    ALGORITHM: try swapping every square with the one to its right and the one
    below it. Every possible move gets tried exactly once that way.
    """
    for row in range(GRID_SIZE):
        for column in range(GRID_SIZE):
            here = {"column": column, "row": row}
            for other in ({"column": column + 1, "row": row},
                          {"column": column, "row": row + 1}):
                if (is_inside_board(other["column"], other["row"])
                        and find_matches(swap_gems(board, here, other))):
                    return True
    return False


def fresh_board():
    """A board with no lines on it already, and at least one move available."""
    for _ in range(60):
        board = [random_shape() for _ in range(CELL_COUNT)]
        throwaway = {"score": 0}
        board = settle_board(throwaway, board)[0]

        if has_any_move(board):
            return board
    return None


def move_cursor(state, d_column, d_row):
    """Slide the keyboard cursor, staying on the board."""
    column = state["cursor"]["column"] + d_column
    row = state["cursor"]["row"] + d_row
    if is_inside_board(column, row):
        state["cursor"] = {"column": column, "row": row}
        return True
    return False


def pick_square(state, square):
    """Choose a square, or swap with the one already chosen.

    OUTPUT: 'picked', 'swapped' or 'cancelled'.
    """
    if state["is_over"] or state["is_paused"]:
        return "cancelled"
    if state["picked"] is None:
        state["picked"] = square
        return "picked"
    if state["picked"] == square:
        state["picked"] = None
        return "cancelled"

    from_square = state["picked"]
    state["picked"] = None
    if try_swap(state, from_square, square):
        return "swapped"
    return "cancelled"


def create_game():
    """Start a brand-new game."""
    return {
        "board": fresh_board(),
        "cursor": {"column": 0, "row": 0},
        "picked": None,
        "score": 0,
        "moves": 0,
        "cleared": 0,
        "bad_swaps": 0,
        "best_chain": 0,
        "is_over": False,
        "is_paused": False,
    }


def shuffle_board(state):
    """Deal a whole new board when the player is stuck."""
    state["board"] = fresh_board()
    state["picked"] = None


def update_game(state, elapsed_ms):
    """Match Three has no clock, so a frame changes nothing."""
    return


def toggle_pause(state):
    """Freeze or unfreeze the game."""
    if not state["is_over"]:
        state["is_paused"] = not state["is_paused"]


def action_for_key(key):
    """Turn a keyboard key into an action name, or None."""
    keys = {
        "arrowup": "up", "w": "up",
        "arrowdown": "down", "s": "down",
        "arrowleft": "left", "a": "left",
        "arrowright": "right", "d": "right",
        " ": "pick", "spacebar": "pick", "enter": "pick",
        "n": "shuffle", "r": "restart", "p": "pause",
    }
    return keys.get(str(key).lower())
