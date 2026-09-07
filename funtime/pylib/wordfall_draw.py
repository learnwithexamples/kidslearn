"""wordfall_draw.py - everything you can see in Word Rain, drawn by Python.

Black and white: the sky is empty paper, the ground is a hatched band at the
bottom, and the words fall in between. The part of a word you have already
typed is solid black; the rest is grey - so a half-typed word shows you exactly
how far you have got without your eyes leaving the sky.
"""

from wordfall_rules import (FIELD_WIDTH, FIELD_HEIGHT, GROUND_Y, START_LIVES,
                            word_width, matching_word)

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_GREY = "#b4b4b4"
COLOR_FAINT = "#e8e8e8"

WORD_FONT = "18px monospace"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the sky."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def draw_ground(ctx):
    """The hatched band a word must not reach.

    ALGORITHM: one thick line, then diagonal strokes below it. The hatching is
    what makes it read as solid ground rather than just a rule.
    """
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(FIELD_WIDTH, GROUND_Y)
    ctx.stroke()

    ctx.lineWidth = 1
    for x in range(-14, FIELD_WIDTH, 12):
        ctx.beginPath()
        ctx.moveTo(x, GROUND_Y + 14)
        ctx.lineTo(x + 14, GROUND_Y)
        ctx.stroke()


def draw_word(ctx, word, done, target):
    """One falling word.

    INPUT: done - how many letters are already typed. target - True if this is
    the word the next letter will go to.

    ALGORITHM: draw the finished letters in black, then carry on where they
    ended and draw the rest in grey. A monospace font means the two halves line
    up exactly, with no gap to work out.

    A word is drawn with its FEET on its y, so the moment it lands is the
    moment it touches the ground line.
    """
    black = word["text"][:done]
    grey = word["text"][done:]

    ctx.font = WORD_FONT
    ctx.textAlign = "left"

    if target:
        ctx.fillStyle = COLOR_FAINT
        ctx.fillRect(word["x"] - 4, word["y"] - 16, word_width(word["text"]) + 8, 21)

    ctx.fillStyle = COLOR_INK
    ctx.fillText(black, word["x"], word["y"])
    ctx.fillStyle = COLOR_GREY
    ctx.fillText(grey, word["x"] + ctx.measureText(black).width, word["y"])

    if target:
        ctx.strokeStyle = COLOR_INK
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(word["x"] - 4, word["y"] + 5)
        ctx.lineTo(word["x"] + word_width(word["text"]) + 4, word["y"] + 5)
        ctx.stroke()


def draw_words(ctx, state):
    """Every word in the sky, with your progress shown on each."""
    target = matching_word(state, state["typed"])

    for word in state["words"]:
        matches = state["typed"] and word["text"].startswith(state["typed"])
        draw_word(ctx, word, len(state["typed"]) if matches else 0, word is target)


def draw_typed(ctx, state):
    """The letters you have typed, big, down on the ground."""
    ctx.font = "bold 24px monospace"
    ctx.textAlign = "center"
    ctx.fillStyle = COLOR_INK if state["typed"] else COLOR_GREY
    ctx.fillText(state["typed"] if state["typed"] else "type a word...",
                 FIELD_WIDTH / 2, FIELD_HEIGHT - 16)
    ctx.textAlign = "left"


def draw_lives(ctx, state):
    """One square for each life left, and a hollow one for each lost.

    ALGORITHM: draw ALL of them, filled or hollow. Showing only what is left
    would hide how close you are to the end.
    """
    for i in range(START_LIVES):
        x = FIELD_WIDTH - 20 - i * 16
        ctx.strokeStyle = COLOR_INK
        ctx.lineWidth = 2
        ctx.strokeRect(x, 12, 11, 11)
        if i < state["lives"]:
            ctx.fillStyle = COLOR_INK
            ctx.fillRect(x + 2, 14, 7, 7)


def draw_level(ctx, state):
    """Which level you have reached, up in the corner."""
    ctx.fillStyle = COLOR_GREY
    ctx.font = "11px monospace"
    ctx.textAlign = "left"
    ctx.fillText("LEVEL %d" % state["level"], 12, 22)


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the sky."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
    ctx.fillRect(0, height / 2 - 46, width, 92)
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(0, height / 2 - 46, width, 92)

    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"
    scale = width / FIELD_WIDTH
    title_size = max(14, round(28 * scale))
    subtitle_size = max(9, round(13 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, height / 2 - 2)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, height / 2 + title_size * 0.85)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)

    draw_level(ctx, state)
    draw_lives(ctx, state)
    draw_words(ctx, state)
    draw_ground(ctx)
    draw_typed(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "THE RAIN WON",
                     "%d points - press ENTER to try again" % state["score"])
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "PAUSED", "Press ESC to carry on")
