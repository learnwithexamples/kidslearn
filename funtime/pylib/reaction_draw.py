"""reaction_draw.py - everything you can see in Reaction Test, in Python."""

from reaction_rules import HISTORY_LENGTH, rating, average_time, best_time

FIELD_WIDTH = 320
FIELD_HEIGHT = 300

PANEL_TOP = 40
PANEL_HEIGHT = 150

COLOR_INK = "#111111"
COLOR_PAPER = "#ffffff"
COLOR_FAINT = "#cfcfcf"


def clear_canvas(ctx, width, height, color):
    """Paint the whole canvas one flat colour."""
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)


def draw_frame(ctx, width, height):
    """The thin border round the page."""
    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)


def panel_words(state):
    """What the big panel should say, and how it should look.

    ALGORITHM: one branch per phase. Keeping the words in their own function
    means the drawing below never has to know the rules.
    """
    if state["phase"] == "ready":
        return {"title": "READY?", "subtitle": "press SPACE to begin", "solid": False}
    if state["phase"] == "waiting":
        return {"title": "WAIT...", "subtitle": "do NOT press yet", "solid": False}
    if state["phase"] == "go":
        return {"title": "PRESS!", "subtitle": "now now now", "solid": True}
    if state["phase"] == "toosoon":
        return {"title": "TOO SOON", "subtitle": "press SPACE to try again", "solid": False}
    return {
        "title": "%d ms" % state["last_time"],
        "subtitle": "%s - press SPACE to go again" % rating(state["last_time"]),
        "solid": False,
    }


def draw_hatching(ctx):
    """The diagonal lines that mean "not yet"."""
    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 2
    x = -PANEL_HEIGHT
    while x < FIELD_WIDTH:
        ctx.beginPath()
        ctx.moveTo(16 + x, PANEL_TOP + PANEL_HEIGHT)
        ctx.lineTo(16 + x + PANEL_HEIGHT, PANEL_TOP)
        ctx.stroke()
        x += 12


def draw_panel(ctx, state):
    """The big signal square."""
    look = panel_words(state)
    left = 16
    width = FIELD_WIDTH - 32

    ctx.save()
    ctx.beginPath()
    ctx.rect(left, PANEL_TOP, width, PANEL_HEIGHT)
    ctx.clip()

    if look["solid"]:
        ctx.fillStyle = COLOR_INK
        ctx.fillRect(left, PANEL_TOP, width, PANEL_HEIGHT)
    else:
        ctx.fillStyle = COLOR_PAPER
        ctx.fillRect(left, PANEL_TOP, width, PANEL_HEIGHT)
        if state["phase"] == "waiting":
            draw_hatching(ctx)
    ctx.restore()

    ctx.strokeStyle = COLOR_INK
    ctx.lineWidth = 3
    ctx.strokeRect(left, PANEL_TOP, width, PANEL_HEIGHT)

    ctx.fillStyle = COLOR_PAPER if look["solid"] else COLOR_INK
    ctx.textAlign = "center"
    ctx.font = "bold 34px monospace"
    ctx.fillText(look["title"], FIELD_WIDTH / 2, PANEL_TOP + 82)
    ctx.font = "13px monospace"
    ctx.fillText(look["subtitle"], FIELD_WIDTH / 2, PANEL_TOP + 112)
    ctx.textAlign = "left"


def draw_history(ctx, state):
    """A little bar chart of the recent goes.

    ALGORITHM: every bar is drawn against the slowest go so far, so the chart
    always fills its space whatever the times happen to be.
    """
    left = 16
    bottom = 268
    height = 52
    width = FIELD_WIDTH - 32

    ctx.strokeStyle = COLOR_FAINT
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(left, bottom)
    ctx.lineTo(left + width, bottom)
    ctx.stroke()

    if not state["times"]:
        ctx.fillStyle = COLOR_FAINT
        ctx.font = "11px monospace"
        ctx.textAlign = "center"
        ctx.fillText("your last eight goes will appear here", FIELD_WIDTH / 2, bottom - 18)
        ctx.textAlign = "left"
        return

    slowest = max(state["times"])
    bar_width = width / HISTORY_LENGTH
    fastest = best_time(state)

    for i, time_taken in enumerate(state["times"]):
        tall = max(4, height * time_taken / slowest)
        ctx.fillStyle = COLOR_INK if time_taken == fastest else COLOR_FAINT
        ctx.fillRect(left + i * bar_width + 3, bottom - tall, bar_width - 6, tall)

    ctx.fillStyle = COLOR_INK
    ctx.font = "10px monospace"
    ctx.textAlign = "center"
    for i, time_taken in enumerate(state["times"]):
        ctx.fillText(str(time_taken), left + i * bar_width + bar_width / 2, bottom + 12)
    ctx.textAlign = "left"


def draw_stats(ctx, state):
    """The line of numbers under the panel."""
    ctx.fillStyle = COLOR_INK
    ctx.font = "13px monospace"
    ctx.textAlign = "center"
    ctx.fillText("best %s   -   average %s   -   %d goes"
                 % (best_time(state) or "-", average_time(state) or "-", state["attempts"]),
                 FIELD_WIDTH / 2, 210)
    ctx.textAlign = "left"


def draw_title(ctx, state):
    """A line of instructions across the top."""
    ctx.fillStyle = COLOR_FAINT
    ctx.font = "11px monospace"
    ctx.textAlign = "center"
    text = ("%d false start(s)" % state["false_starts"]) if state["false_starts"] else "wait for the black"
    ctx.fillText(text, FIELD_WIDTH / 2, 24)
    ctx.textAlign = "left"


def render_game(ctx, state):
    """Draw one complete frame."""
    clear_canvas(ctx, FIELD_WIDTH, FIELD_HEIGHT, COLOR_PAPER)

    draw_title(ctx, state)
    draw_panel(ctx, state)
    draw_stats(ctx, state)
    draw_history(ctx, state)
    draw_frame(ctx, FIELD_WIDTH, FIELD_HEIGHT)

    if state["is_paused"]:
        ctx.fillStyle = "rgba(255, 255, 255, 0.93)"
        ctx.fillRect(0, 120, FIELD_WIDTH, 60)
        ctx.fillStyle = COLOR_INK
        ctx.font = "bold 26px monospace"
        ctx.textAlign = "center"
        ctx.fillText("PAUSED", FIELD_WIDTH / 2, 158)
        ctx.textAlign = "left"
