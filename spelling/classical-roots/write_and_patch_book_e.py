#!/usr/bin/env python3
import csv, os

workspace = '/Users/yyw/github/kidslearn'
csv_path = os.path.join(workspace, 'spelling/classical-roots/vocabulary_from_classical_roots_words_e.csv')
js_path = os.path.join(workspace, 'data/vocabulary-data.js')

lessons_data = {
    1:  ["abstruse", "acquiesce", "extrude", "interloper", "internecine", "interpolate", "interpose", "interregnum", "juxtapose", "obtrude", "propinquity", "quiescent", "rapprochement", "requiem", "unrequited"],
    2:  ["altercation", "altruism", "anathema", "antithesis", "ephemeral", "epitaph", "epithet", "epitome", "eponymous", "paradigm", "paradox", "paragon", "parameter", "peripatetic", "peripheral"],
    3:  ["aggregation", "anarchy", "archaic", "archetype", "archipelago", "archive", "demagogue", "demographer", "egregious", "endemic", "gregarious", "icon", "iconoclastic", "oligarchy", "pandemic"],
    4:  ["annunciation", "exegesis", "hegemony", "induce", "politic", "polity", "potentate", "puissant", "redoubt", "regalia", "regency", "renunciation", "traduce", "viceroy"],
    5:  ["bas-relief", "debase", "declivity", "echelon", "imponderable", "impunity", "leaven", "legerdemain", "leverage", "levitate", "levity", "penchant", "ponderous", "preponderant", "proclivity", "transcendent"],
    6:  ["aver", "cataclysm", "catapult", "hypochondria", "hypothesis", "incubus", "incumbent", "recumbent", "subjective", "sublimate", "suborn", "subterfuge", "succumb", "verisimilitude", "verity"],
    7:  ["acquisitive", "demise", "dynamo", "dynasty", "emissary", "importune", "inquisition", "meretricious", "meritorious", "opportunist", "premise", "presumption", "querulous", "subsume", "sumptuary"],
    8:  ["acerbic", "acrid", "acrimony", "acumen", "acute", "comportment", "exacerbate", "impecunious", "pecuniary", "peremptory", "plutocrat", "preempt", "purport", "redemption", "technocracy"],
    9:  ["adumbrate", "denigrate", "elucidate", "lucent", "lucid", "luminary", "luminescence", "muster", "necromancy", "pall", "palliate", "pallid", "pellucid", "remonstrate", "umbrage"],
    10: ["apocalypse", "apocryphal", "apoplexy", "apostate", "castigate", "chasten", "clavier", "conclave", "conducive", "diadem", "diametrical", "diaspora", "diatribe", "enclave", "occlusion", "recluse"],
    11: ["abate", "battery", "battlement", "bellicose", "belligerent", "carte blanche", "cartel", "cartographer", "daunt", "forte", "fortitude", "impugn", "indomitable", "pugilist", "pugnacious"],
    12: ["accede", "cadence", "casuistry", "cede", "compunction", "concession", "decadent", "depredation", "expunge", "intercede", "Occident", "predatory", "punctilious", "pungent", "recidivism"],
    13: ["aesthete", "aesthetic", "beatific", "beatitude", "benign", "benignant", "benison", "bona fide", "bonanza", "bon vivant", "boon", "debonair", "eugenics", "euphemism", "euphony"],
    14: ["emendation", "illicit", "impeccable", "licentious", "maladroit", "malaise", "malapropism", "malefactor", "malevolent", "malfeasance", "malign", "malinger", "mendacious", "mendicant", "peccadillo"],
    15: ["allege", "approbation", "censorious", "censure", "legate", "probity", "punitive", "relegate", "reprobate", "reproof", "subpoena", "vendetta", "vindicate", "vindictive"],
    16: ["abjure", "abrogate", "adjudicate", "adjure", "arbitrary", "arbitrate", "arrogate", "conjure", "exhort", "hortatory", "judicious", "perjury", "prerogative", "rogue", "surrogate"],
}

# ── Write CSV ────────────────────────────────────────────────────────────────
rows = []
for lesson_num in sorted(lessons_data.keys()):
    for word in lessons_data[lesson_num]:
        rows.append({
            'lesson': lesson_num, 'word': word,
            'pronunciation': '', 'partOfSpeech': '',
            'definition': '', 'example': '',
        })

with open(csv_path, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['lesson','word','pronunciation','partOfSpeech','definition','example'])
    writer.writeheader()
    writer.writerows(rows)

print(f'Written {len(rows)} rows to {csv_path}')
for n in sorted(lessons_data.keys()):
    print(f'  L{n}: {len(lessons_data[n])} words')

# ── Build JS book-e block ────────────────────────────────────────────────────
def build_lesson_block(lesson_num, words):
    ind = ' ' * 8
    word_blocks = []
    for w in words:
        word_blocks.append(
            f'{ind}        {{\n'
            f'{ind}          "word": "{w}",\n'
            f'{ind}          "pronunciation": "",\n'
            f'{ind}          "partOfSpeech": "",\n'
            f'{ind}          "definition": "",\n'
            f'{ind}          "example": ""\n'
            f'{ind}        }}'
        )
    words_str = ',\n'.join(word_blocks)
    return (
        f'{ind}{{\n'
        f'{ind}  "number": {lesson_num},\n'
        f'{ind}  "title": "",\n'
        f'{ind}  "roots": [\n'
        f'{ind}    {{\n'
        f'{ind}      "root": "",\n'
        f'{ind}      "origin": "",\n'
        f'{ind}      "meaning": "",\n'
        f'{ind}      "words": [\n'
        f'{words_str}\n'
        f'{ind}      ]\n'
        f'{ind}    }}\n'
        f'{ind}  ]\n'
        f'{ind}}}'
    )

lesson_blocks = [build_lesson_block(n, lessons_data[n]) for n in sorted(lessons_data.keys())]
lessons_str = ',\n'.join(lesson_blocks)

new_book_e = (
    '    "book-e": {\n'
    '      "title": "Book E",\n'
    '      "level": "High School",\n'
    '      "description": "High school level vocabulary from Greek and Latin roots",\n'
    '      "lessons": [\n'
    + lessons_str + '\n'
    '      ]\n'
    '    }'
)

# ── Patch vocabulary-data.js ─────────────────────────────────────────────────
with open(js_path, 'r') as f:
    content = f.read()

idx = content.index('"book-e"')
start = content.rfind('\n', 0, idx) + 1   # beginning of the "book-e" line
new_content = content[:start] + new_book_e + '\n  }\n}\n'

with open(js_path, 'w') as f:
    f.write(new_content)

print('Patched vocabulary-data.js (book-e fully replaced)')
