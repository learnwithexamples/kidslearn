#!/usr/bin/env python3
"""Patch vocabulary-data.js book-c with all words from the book-c CSV."""
import csv, json, re, textwrap

CSV_PATH = "/Users/yyw/github/kidslearn/spelling/classical-roots/vocabulary_from_classical_roots_words_c.csv"
JS_PATH  = "/Users/yyw/github/kidslearn/data/vocabulary-data.js"

# ── 1. Read CSV ──────────────────────────────────────────────
by_lesson: dict[int, list[dict]] = {}
with open(CSV_PATH, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        lesson = int(row["lesson"])
        by_lesson.setdefault(lesson, []).append({
            "word":          row["word"],
            "pronunciation": row["pronunciation"],
            "partOfSpeech":  row["partOfSpeech"],
            "definition":    row["definition"],
            "example":       row["example"],
        })

# ── 2. Build replacement JS text ────────────────────────────
def word_block(w: dict, indent: int) -> str:
    pad = " " * indent
    def esc(s): return s.replace("\\", "\\\\").replace('"', '\\"')
    return (
        f'{pad}{{\n'
        f'{pad}  "word": "{esc(w["word"])}",\n'
        f'{pad}  "pronunciation": "{esc(w["pronunciation"])}",\n'
        f'{pad}  "partOfSpeech": "{esc(w["partOfSpeech"])}",\n'
        f'{pad}  "definition": "{esc(w["definition"])}",\n'
        f'{pad}  "example": "{esc(w["example"])}"\n'
        f'{pad}}}'
    )

def lesson_js(number: int, title: str, root: str, origin: str, meaning: str,
              existing_words_js: str, csv_words: list[dict]) -> str:
    """Build a lesson JSON block. existing_words_js is raw JS already indented."""
    pad = "        "  # 8 spaces — matches book-b layout
    word_blocks = []
    if existing_words_js:
        word_blocks.append(existing_words_js)
    for w in csv_words:
        word_blocks.append(word_block(w, indent=16))
    words_joined = ",\n".join(word_blocks)
    return (
        f'        {{\n'
        f'          "number": {number},\n'
        f'          "title": "{title}",\n'
        f'          "roots": [\n'
        f'            {{\n'
        f'              "root": "{root}",\n'
        f'              "origin": "{origin}",\n'
        f'              "meaning": "{meaning}",\n'
        f'              "words": [\n'
        f'{words_joined}\n'
        f'              ]\n'
        f'            }}\n'
        f'          ]\n'
        f'        }}'
    )

# Lesson 1: keep existing biography entry, append CSV words
existing_biography = (
    '                {\n'
    '                  "word": "biography",\n'
    '                  "pronunciation": "by-OG-ruh-fee",\n'
    '                  "partOfSpeech": "noun",\n'
    '                  "definition": "a written account of someone\'s life",\n'
    '                  "example": "She wrote a biography of Abraham Lincoln."\n'
    '                }'
)

lessons_js = []
for n in range(1, 17):
    words = by_lesson.get(n, [])
    if n == 1:
        blk = lesson_js(1, "The Nature of Life", "BIO", "Greek", "life",
                        existing_biography, words)
    else:
        blk = lesson_js(n, "", "", "", "", "", words)
    lessons_js.append(blk)

new_book_c = (
    '    "book-c": {\n'
    '      "title": "Book C",\n'
    '      "level": "Middle School",\n'
    '      "description": "Middle school level vocabulary from Greek and Latin roots",\n'
    '      "lessons": [\n'
    + ",\n".join(lessons_js) + "\n"
    '      ]\n'
    '    }'
)

# ── 3. Replace in vocabulary-data.js ────────────────────────
with open(JS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'"book-c"\s*:\s*\{.*?\}(?=\s*,\s*"book-d")'
replaced, n = re.subn(pattern, new_book_c, content, flags=re.DOTALL)
if n != 1:
    raise RuntimeError(f"Expected 1 replacement, got {n}")

with open(JS_PATH, "w", encoding="utf-8") as f:
    f.write(replaced)

print(f"Done — replaced book-c section ({n} match).")

# ── 4. Quick validation via node ─────────────────────────────
import subprocess, pathlib
result = subprocess.run(
    ["node", "-e", f"const v=require('{JS_PATH}'); "
     "const c=v.vocabularyData.books['book-c']; "
     "console.log('lessons:', c.lessons.length); "
     "c.lessons.forEach((l,i)=>console.log('L'+(i+1)+': '+l.roots[0].words.length+' words'));"],
    capture_output=True, text=True
)
print(result.stdout or result.stderr)
