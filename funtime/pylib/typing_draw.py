"""typing_draw.py - everything you can see in Typing Race, in Python."""

import math

from typing_rules import (SECONDS_PER_RACE, current_word, matching_letters,
                          words_per_minute, accuracy, time_left)

FIELD_WIDTH = 340
FIELD_HEIGHT = 250

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_DONE = "#c4c4c4"
COLOR_FAINT = "#e4e4e4"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the page."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def layout_words(ctx, words, start_index):
    """Work out where each word goes, wrapping onto new lines.

    ALGORITHM: put words along a line until the next one would not fit, then
    start a new line. Three lines is all that fits on the page.
    """
    laid = []
    left = 16
    right = FIELD_WIDTH - 16
    x = left
    y = 44

    ctx.font = "17px monospace"
    for i in range(start_index, len(words)):
        width = ctx.measureText(words[i]).width
        if x + width > right:
            x = left
            y += 26
            if y > 96:
                break
        laid.append({"word": words[i], "index": i, "x": x, "y": y, "width": width})
        x += width + 10
    return laid


def draw_words(ctx, state):
    """The line of words, with the current one boxed."""
    laid = layout_words(ctx, state["words"], state["index"])

    ctx.font = "17px monospace"
    ctx.textAlign = "left"
    for item in laid:
        if item["index"] == state["index"]:
            ctx.fillStyle = COLOR_FAINT
            ctx.fillRect(item["x"] - 4, item["y"] - 15, item["width"] + 8, 21)
            ctx.strokeStyle = COLOR_INK
            ctx.lineWidth = 1.5
            ctx.strokeRect(item["x"] - 4, item["y"] - 15, item["width"] + 8, 21)
            ctx.fillStyle = COLOR_INK
        else:
            ctx.fillStyle = COLOR_DONE
        ctx.fillText(item["word"], item["x"], item["y"])


def draw_typed(ctx, state):
    """What the player has typed, big.

    ALGORITHM: the part that still matches the word is drawn solid; anything
    after the first mistake is struck through, so a wrong letter is obvious
    without stopping to read.
    """
    word = current_word(state)
    good = matching_letters(word, state["typed"])
    right_part = state["typed"][:good]
    wrong_part = state["typed"][good:]

    ctx.font = "bold 26px monospace"
    ctx.textAlign = "left"

    total_width = ctx.measureText(state["typed"]).width
    x = FIELD_WIDTH / 2 - total_width / 2
    y = 150

    ctx.fillStyle = COLOR_INK
    ctx.fillText(right_part, x, y)
    x += ctx.measureText(right_part).width

    if wrong_part:
        ctx.fillStyle = COLOR_INK
        ctx.fillText(wrong_part, x, y)
        wrong_width = ctx.measureText(wrong_part).width
        ctx.lineWidth = 3
        ctx.strokeStyle = COLOR_INK
        ctx.beginPath()
        ctx.moveTo(x, y - 9)
        ctx.lineTo(x + wrong_width, y - 9)
        ctx.stroke()

    ctx.fillStyle = COLOR_INK
    ctx.fillRect(x + ctx.measureText(wrong_part).width + 2, y - 20, 2, 24)


def draw_time_bar(ctx, state):
    """How much of the minute is left."""
    fraction = time_left(state) / SECONDS_PER_RACE
    width = FIELD_WIDTH - 32

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(16, 178, width, 14)
    ctx.fillStyle = COLOR_INK
    ctx.fillRect(18, 180, (width - 4) * fraction, 10)


def draw_stats(ctx, state):
    """The numbers along the bottom."""
    ctx.fillStyle = COLOR_INK
    ctx.font = "13px monospace"
    ctx.textAlign = "center"
    ctx.fillText("%d WPM   -   %d%% right   -   %ds left"
                 % (words_per_minute(state), accuracy(state), math.ceil(time_left(state))),
                 FIELD_WIDTH / 2, 214)
    ctx.font = "11px monospace"
    ctx.fillStyle = COLOR_DONE
    ctx.fillText("%d of %d words" % (state["correct"], len(state["words"])),
                 FIELD_WIDTH / 2, 232)
    ctx.textAlign = "left"


def draw_title(ctx, state):
    """A line of instructions across the top."""
    ctx.fillStyle = COLOR_DONE
    ctx.font = "11px monospace"
    ctx.textAlign = "center"
    ctx.fillText("SPACE after each word" if state["has_started"] else "just start typing...",
                 FIELD_WIDTH / 2, 22)
    ctx.textAlign = "left"


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the page."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
    ctx.fillRect(0, height / 2 - 44, width, 88)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / FIELD_WIDTH
    title_size = max(14, round(28 * scale))
    subtitle_size = max(9, round(13 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 2)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)

    draw_title(ctx, state)
    draw_words(ctx, state)
    draw_typed(ctx, state)
    draw_time_bar(ctx, state)
    draw_stats(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT,
                     "%d WPM" % words_per_minute(state),
                     "%d%% right - press ENTER to race again" % accuracy(state))
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "PAUSED", "Press ESC to carry on")
