"""hangman_draw.py - everything you can see in Hangman, in Python."""

import math

from hangman_rules import (MAX_WRONG, LETTERS, masked_word, wrong_letters, wrong_count)

FIELD_WIDTH = 320
FIELD_HEIGHT = 330

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#c8c8c8"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the page."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def draw_gallows(ctx):
    """The frame the poor fellow hangs from."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 4
    ctx.lineCap = "round"

    ctx.beginPath()
    ctx.moveTo(30, 190)
    ctx.lineTo(110, 190)
    ctx.moveTo(60, 190)
    ctx.lineTo(60, 30)
    ctx.moveTo(60, 30)
    ctx.lineTo(140, 30)
    ctx.moveTo(140, 30)
    ctx.lineTo(140, 50)
    ctx.stroke()
    ctx.lineCap = "butt"


def draw_parts(ctx, wrong):
    """The drawing grows with every wrong guess - six pieces, six ifs."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 3
    ctx.lineCap = "round"

    if wrong >= 1:
        ctx.beginPath()
        ctx.arc(140, 66, 16, 0, math.pi * 2)
        ctx.stroke()
    if wrong >= 2:
        ctx.beginPath()
        ctx.moveTo(140, 82)
        ctx.lineTo(140, 132)
        ctx.stroke()
    if wrong >= 3:
        ctx.beginPath()
        ctx.moveTo(140, 95)
        ctx.lineTo(118, 115)
        ctx.stroke()
    if wrong >= 4:
        ctx.beginPath()
        ctx.moveTo(140, 95)
        ctx.lineTo(162, 115)
        ctx.stroke()
    if wrong >= 5:
        ctx.beginPath()
        ctx.moveTo(140, 132)
        ctx.lineTo(122, 165)
        ctx.stroke()
    if wrong >= 6:
        ctx.beginPath()
        ctx.moveTo(140, 132)
        ctx.lineTo(158, 165)
        ctx.stroke()

        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(134, 62)
        ctx.lineTo(138, 66)
        ctx.moveTo(138, 62)
        ctx.lineTo(134, 66)
        ctx.moveTo(142, 62)
        ctx.lineTo(146, 66)
        ctx.moveTo(146, 62)
        ctx.lineTo(142, 66)
        ctx.moveTo(133, 76)
        ctx.quadraticCurveTo(140, 69, 147, 76)
        ctx.stroke()
    ctx.lineCap = "butt"


def draw_lives(ctx, state):
    """A row of small marks, crossed off as they are used."""
    used = wrong_count(state)
    for i in range(MAX_WRONG):
        x = 210 + (i % 3) * 30
        y = 60 + (i // 3) * 30
        ctx.strokeStyle = COLOR_FAINT if i < used else COLOR_INK
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, 20, 20)
        if i < used:
            ctx.beginPath()
            ctx.moveTo(x + 4, y + 4)
            ctx.lineTo(x + 16, y + 16)
            ctx.moveTo(x + 16, y + 4)
            ctx.lineTo(x + 4, y + 16)
            ctx.stroke()
    ctx.fillStyle = COLOR_INK
    ctx.font = "11px monospace"
    ctx.textAlign = "left"
    ctx.fillText("LIVES", 210, 48)


def draw_word(ctx, state):
    """The masked word, big, across the bottom."""
    text = masked_word(state["word"], state["guessed"])
    size = 18 if len(text) > 24 else 24

    ctx.fillStyle = COLOR_INK
    ctx.font = "bold %dpx monospace" % size
    ctx.textAlign = "center"
    ctx.fillText(text, FIELD_WIDTH / 2, 232)
    ctx.textAlign = "left"


def draw_wrong(ctx, state):
    """The letters that were not in the word."""
    wrong = wrong_letters(state)
    ctx.fillStyle = COLOR_INK
    ctx.font = "12px monospace"
    ctx.textAlign = "center"
    ctx.fillText("WRONG:  " + ("-" if wrong == "" else " ".join(wrong)),
                 FIELD_WIDTH / 2, 262)
    ctx.textAlign = "left"


def draw_alphabet(ctx, state):
    """Every letter, with the used ones faded out."""
    ctx.font = "13px monospace"
    ctx.textAlign = "center"
    for i, letter in enumerate(LETTERS):
        x = 22 + (i % 13) * 22
        y = 292 + (i // 13) * 22
        ctx.fillStyle = COLOR_FAINT if letter in state["guessed"] else COLOR_INK
        ctx.fillText(letter, x, y)
    ctx.textAlign = "left"


def letter_at_pixel(x, y):
    """Which letter of the alphabet row was clicked?"""
    for i, letter in enumerate(LETTERS):
        letter_x = 22 + (i % 13) * 22
        letter_y = 292 + (i // 13) * 22
        if abs(x - letter_x) < 11 and letter_y - 14 < y < letter_y + 6:
            return letter
    return None


def draw_message(ctx, width, height, title, subtitle):
    """Big centred words across the page."""
    ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
    ctx.fillRect(0, 100, width, 76)
    ctx.fillStyle = COLOR_INK
    ctx.textAlign = "center"

    scale = width / FIELD_WIDTH
    title_size = max(14, round(26 * scale))
    subtitle_size = max(9, round(13 * scale))

    ctx.font = "bold %dpx monospace" % title_size
    ctx.fillText(title, width / 2, 136)
    ctx.font = "%dpx monospace" % subtitle_size
    ctx.fillText(subtitle, width / 2, 136 + title_size * 0.8)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)

    draw_gallows(ctx)
    draw_parts(ctx, wrong_count(state))
    draw_lives(ctx, state)
    draw_word(ctx, state)
    draw_wrong(ctx, state)
    draw_alphabet(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_won"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "YOU GOT IT!",
                     "Press ENTER for a new word")
    elif state["is_over"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "IT WAS " + state["word"],
                     "Press ENTER to try again")
    elif state["is_paused"]:
        draw_message(ctx, FIELD_WIDTH, FIELD_HEIGHT, "PAUSED", "Press ESC to carry on")
