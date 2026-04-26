#!/usr/bin/env python3
"""Generate vocabulary_from_classical_roots_words_5.csv and patch vocabulary-data.js book-5."""
import csv, re
from collections import Counter

CSV_PATH = "/Users/yyw/github/kidslearn/spelling/classical-roots/vocabulary_from_classical_roots_words_5.csv"
JS_PATH  = "/Users/yyw/github/kidslearn/data/vocabulary-data.js"

rows = [
    # ── Lesson 1 ──────────────────────────────────────────────
    (1,"circuit","SUR-kit","noun","a roughly circular path or route; the complete path of an electric current","The electrician checked every circuit in the house for faulty wiring."),
    (1,"circular","SUR-kyuh-ler","adjective","having the form of a circle; moving in a circle","The circular track at the park is exactly one mile around."),
    (1,"circulate","SUR-kyuh-layt","verb","to move continuously in a closed path; to pass from place to place","Blood circulates through the heart and lungs many times each minute."),
    (1,"cycle","SY-kul","noun/verb","a series of events that repeats; to ride a bicycle","The water cycle moves moisture from oceans to clouds to rain and back again."),
    (1,"cyclone","SY-klohn","noun","a system of winds rotating around a center of low pressure; a violent tropical storm","The cyclone brought high winds and heavy rain to the coastal towns."),
    (1,"recycle","ree-SY-kul","verb","to convert waste into reusable material; to use again","Our school encourages students to recycle paper, cans, and plastic bottles."),
    (1,"semicircle","SEM-ee-sur-kul","noun","half of a circle","The students arranged their desks in a semicircle facing the board."),
    (1,"unicycle","YOO-nih-sy-kul","noun","a cycle with a single wheel, propelled by pedaling","Learning to balance on a unicycle takes a great deal of practice."),
    # ── Lesson 2 ──────────────────────────────────────────────
    (2,"dependent","dih-PEN-dent","adjective","relying on another for support; conditional on something","Young children are dependent on adults to meet their basic needs."),
    (2,"equality","ih-KWOL-ih-tee","noun","the state of being equal in rights, opportunities, or status","The civil rights movement fought for equality for all citizens."),
    (2,"equate","ih-KWAYT","verb","to consider or treat as equal or equivalent","You should not equate price with quality — some cheap products are excellent."),
    (2,"equator","ih-KWAY-ter","noun","the imaginary line around the middle of the Earth equidistant from both poles","Countries near the equator experience warm temperatures throughout the year."),
    (2,"equidistant","ee-kwih-DIS-tent","adjective","at equal distances from two or more places","The referee placed the ball at a point equidistant from both goal posts."),
    (2,"equilateral","ee-kwih-LAT-er-ul","adjective","having all sides equal in length","An equilateral triangle has three sides of exactly the same length."),
    (2,"pending","PEN-ding","adjective/preposition","awaiting a decision or outcome; while waiting for","The contract is pending approval from the company's board of directors."),
    (2,"pendulum","PEN-juh-lum","noun","a weight hung from a fixed point that swings freely; something that shifts from one extreme to another","The pendulum of the grandfather clock swung back and forth with a steady tick."),
    # ── Lesson 3 ──────────────────────────────────────────────
    (3,"interactive","in-ter-AK-tiv","adjective","allowing communication between a computer and a user; involving people working together","The interactive exhibit let visitors control the display with hand gestures."),
    (3,"interfere","in-ter-FEER","verb","to get in the way of; to involve oneself without being asked","Please do not interfere with the experiment once it has started."),
    (3,"intermittent","in-ter-MIT-ent","adjective","stopping and starting at irregular intervals","The forecast called for intermittent showers throughout the afternoon."),
    (3,"intersect","in-ter-SEKT","verb","to cross or divide by passing through; to meet at a point","Main Street and Oak Avenue intersect right in the center of town."),
    (3,"interval","IN-ter-vul","noun","a space of time between events; the difference in pitch between two musical notes","The bus arrives at fifteen-minute intervals during rush hour."),
    (3,"transact","tran-ZAKT","verb","to conduct or carry out business or dealings","You can now transact almost any banking task online without visiting a branch."),
    (3,"transfer","TRANS-fer","noun/verb","moving something from one place or person to another; to move","She arranged a transfer of funds to her savings account."),
    (3,"transfusion","trans-FYOO-zhun","noun","a process of transferring blood or fluid into a person's bloodstream","The accident victim required an emergency blood transfusion during surgery."),
    (3,"transmit","trans-MIT","verb","to cause to pass from one place or person to another; to broadcast","Satellites transmit signals around the world in a fraction of a second."),
    # ── Lesson 5 ──────────────────────────────────────────────
    (5,"aquaculture","AK-wuh-kul-cher","noun","the farming of fish and other aquatic organisms in controlled conditions","Aquaculture supplies much of the salmon and shrimp sold in supermarkets today."),
    (5,"aquamarine","ak-wuh-muh-REEN","noun/adjective","a blue-green gemstone or color; light blue-green","The artist used an aquamarine paint to capture the color of the tropical sea."),
    (5,"aquatic","uh-KWAT-ik","adjective","relating to water; living or taking place in water","Dolphins are aquatic mammals that breathe air but spend their entire lives in the ocean."),
    (5,"Mediterranean","med-ih-tuh-RAY-nee-un","adjective/noun","relating to the Mediterranean Sea or the countries around it","Mediterranean cuisine uses olive oil, fresh vegetables, and herbs abundantly."),
    (5,"subterranean","sub-tuh-RAY-nee-un","adjective","existing, occurring, or done underground","The hikers discovered a subterranean cave hidden beneath the rocky hillside."),
    (5,"terrace","TER-is","noun","a flat area next to a building used as an outdoor space; a raised flat platform of earth","The family ate dinner on the terrace and watched the sunset over the valley."),
    (5,"terrain","tuh-RAYN","noun","the physical features of a stretch of land","The mountain terrain made the hike far more challenging than expected."),
    (5,"territory","TER-ih-tor-ee","noun","an area of land under the control of a particular ruler or state; the area an animal defends","The hawk marked out its territory and drove away any rival birds."),
    # ── Lesson 6 ──────────────────────────────────────────────
    (6,"astronaut","AS-troh-nawt","noun","a person trained to travel in spacecraft","The astronaut spent six months aboard the International Space Station."),
    (6,"astronomical","as-troh-NOM-ih-kul","adjective","relating to astronomy; very large","The cost of replacing every window in the skyscraper was astronomical."),
    (6,"astronomy","uh-STRON-oh-mee","noun","the scientific study of stars, planets, and the universe","She bought a telescope so she could pursue her interest in astronomy."),
    (6,"telecast","TEL-ih-kast","noun/verb","a television broadcast; to broadcast by television","The championship game was telecast live to viewers in thirty countries."),
    (6,"teleconference","tel-ih-KON-fer-ens","noun","a conference in which participants in different locations are linked by telecommunications","The team held a teleconference to review the project with colleagues overseas."),
    (6,"telegraph","TEL-ih-graf","noun/verb","a system for sending messages using electrical signals; to send such a message","In the 1800s, news was transmitted across the country by telegraph."),
    (6,"telemarketing","tel-ih-MAR-kih-ting","noun","the marketing of goods or services by telephone","The company's telemarketing team called hundreds of potential customers each day."),
    (6,"telescope","TEL-ih-skohp","noun","an optical instrument for observing distant objects","With a small telescope you can see the craters on the surface of the moon."),
    # ── Lesson 7 ──────────────────────────────────────────────
    (7,"inactive","in-AK-tiv","adjective","not active; not working or in use","The volcano has been inactive for more than three hundred years."),
    (7,"informal","in-FOR-mul","adjective","not official or formal; relaxed and casual","The meeting was informal, so employees were encouraged to share ideas freely."),
    (7,"insignificant","in-sig-NIF-ih-kent","adjective","too small or unimportant to be worth attention","The town was so small it seemed insignificant on the national map."),
    (7,"insomnia","in-SOM-nee-uh","noun","inability to sleep","Stress and worry are common causes of insomnia in students before exams."),
    (7,"semiannual","sem-ee-AN-yoo-ul","adjective","occurring twice a year","The dentist recommended semiannual checkups to keep her teeth healthy."),
    (7,"semicolon","SEM-ee-koh-lun","noun","a punctuation mark (;) used to link two closely related independent clauses","She used a semicolon to join the two sentences without making them completely separate."),
    (7,"semiconscious","sem-ee-KON-shus","adjective","partially conscious; not fully awake or aware","The patient was semiconscious when the paramedics arrived on the scene."),
    (7,"semiformal","sem-ee-FOR-mul","adjective","partly formal; less formal than formal but more formal than casual","The dance was semiformal, so students wore dresses and dress shirts but not tuxedos."),
    (7,"semiprecious","sem-ee-PRESH-us","adjective","having value but considered less valuable than precious gems","Amethyst and turquoise are examples of semiprecious stones used in jewelry."),
    # ── Lesson 9 ──────────────────────────────────────────────
    (9,"civics","SIV-iks","noun","the study of rights and duties of citizenship","The civics class taught students how local and national government functions."),
    (9,"civil","SIV-ul","adjective","relating to ordinary citizens; polite and courteous","Even during the heated debate, both sides managed to remain civil."),
    (9,"civilian","sih-VIL-yun","noun/adjective","a person not in the armed forces or police; relating to civilians","After years of military service he returned to civilian life and started a business."),
    (9,"civility","sih-VIL-ih-tee","noun","polite and courteous behavior; formal politeness","The teacher insisted on civility in all classroom discussions, no matter how heated."),
    (9,"coordinate","koh-OR-dih-nayt","verb/noun","to organize people or things to work together effectively; a set of values locating a point","She volunteered to coordinate the school's community service project."),
    (9,"extraordinary","ek-STROR-dih-ner-ee","adjective","very unusual or remarkable; beyond the ordinary","The young pianist gave an extraordinary performance that stunned the audience."),
    (9,"ordinarily","or-dih-NAIR-ih-lee","adverb","in the usual course of events; normally","Ordinarily she walked to school, but today she took the bus because of the rain."),
    (9,"uncivilized","un-SIV-ih-lyzd","adjective","not considered to behave according to civilized norms; barbaric","The explorer described the remote island as wild and uncivilized by modern standards."),
    # ── Lesson 10 ─────────────────────────────────────────────
    (10,"diameter","dy-AM-ih-ter","noun","a straight line passing through the center of a circle from side to side","The pizza had a diameter of twelve inches — enough for four people."),
    (10,"geometry","jee-OM-ih-tree","noun","the branch of mathematics concerned with shapes, sizes, and properties of space","Geometry teaches students about angles, triangles, circles, and three-dimensional forms."),
    (10,"metronome","MET-roh-nohm","noun","a device that marks exact time in music with a regular tick","The piano student practiced her scales using a metronome set to sixty beats per minute."),
    (10,"perimeter","puh-RIM-ih-ter","noun","the continuous line forming the boundary of a closed figure; its total length","To find the perimeter of a rectangle, add the lengths of all four sides."),
    (10,"symmetrical","sih-MET-rih-kul","adjective","made up of exactly similar parts facing each other; balanced","A butterfly's wings are nearly perfectly symmetrical on either side of its body."),
    (10,"thermal","THUR-mul","adjective/noun","relating to heat; a rising current of warm air used by birds and gliders","The hawk rode a thermal high above the valley without flapping its wings."),
    (10,"thermometer","ther-MOM-ih-ter","noun","an instrument for measuring temperature","The nurse placed a thermometer under the patient's tongue to check for fever."),
    (10,"thermostat","THUR-moh-stat","noun","a device that automatically adjusts temperature by switching heating or cooling on and off","She set the thermostat to sixty-eight degrees before leaving for work."),
    # ── Lesson 11 ─────────────────────────────────────────────
    (11,"construction","kun-STRUK-shun","noun","the process of building something; a structure that has been built","The construction of the new bridge will take approximately three years."),
    (11,"contraction","kun-TRAK-shun","noun","a shortening of a word by omission of letters; a shortening or tightening","The word 'don't' is a contraction of 'do not.'"),
    (11,"destructive","dih-STRUK-tiv","adjective","causing great damage; tending to destroy","The destructive tornado tore through the neighborhood in less than a minute."),
    (11,"extract","EK-strakt","noun/verb","a preparation obtained from something; to remove or take out forcibly","The dentist had to extract the badly damaged tooth."),
    (11,"protractor","proh-TRAK-ter","noun","a semicircular instrument for measuring angles","Every student in geometry class used a protractor to measure the angles in the triangle."),
    (11,"reconstruct","ree-kun-STRUKT","verb","to build or form again after damage; to piece together past events","Archaeologists worked to reconstruct the ancient temple from thousands of fragments."),
    (11,"retract","rih-TRAKT","verb","to draw back; to withdraw a statement","The landing gear retracts automatically after the plane lifts off."),
    (11,"structure","STRUK-cher","noun/verb","something built; the arrangement of parts; to arrange","The suspension bridge is an impressive structure spanning the entire river gorge."),
    (11,"traction","TRAK-shun","noun","the grip of a wheel or tyre on a surface; pulling force; an idea gaining support","New snow tires gave the car better traction on the icy mountain road."),
    # ── Lesson 13 ─────────────────────────────────────────────
    (13,"abrupt","uh-BRUPT","adjective","sudden and unexpected; not smooth; curt in manner","The meeting came to an abrupt end when the fire alarm went off."),
    (13,"disrupt","dis-RUPT","verb","to interrupt the normal course of something; to cause disorder","A loud noise from outside disrupted the test and caused everyone to look up."),
    (13,"fractional","FRAK-shun-ul","adjective","relating to a fraction; very small","There was only a fractional difference in time between the two swimmers."),
    (13,"fracture","FRAK-cher","noun/verb","a break or crack in a bone or hard object; to break or crack","The x-ray revealed a hairline fracture in the bone just below her wrist."),
    (13,"fragility","fruh-JIL-ih-tee","noun","the quality of being easily broken or damaged; delicateness","The fragility of the ancient vase made the museum staff handle it with extreme care."),
    (13,"fragment","FRAG-ment","noun/verb","a small part broken off; to break into small pieces","Archaeologists found fragments of pottery scattered across the ancient site."),
    (13,"interruption","in-tuh-RUP-shun","noun","a break in continuity; something that stops an activity temporarily","The interruption by a late arrival broke the speaker's concentration mid-sentence."),
    (13,"rupture","RUP-cher","noun/verb","a break or breach; to break or burst suddenly","A water main rupture flooded the street and halted traffic for several hours."),
    # ── Lesson 14 ─────────────────────────────────────────────
    (14,"basement","BAYS-ment","noun","the floor of a building that is below street level","The family kept their old furniture and holiday decorations in the basement."),
    (14,"basis","BAY-sis","noun","the underlying support for an idea or argument; the foundation","Hard work and honesty formed the basis of his philosophy for success."),
    (14,"bass","bays","noun/adjective","the lowest part in music; a type of freshwater fish; low in pitch","The bass guitar provides the deep rhythmic foundation for the rest of the band."),
    (14,"composition","kom-puh-ZIH-shun","noun","a piece of writing or music; the way in which something is made up","The composition she wrote for the school concert was performed by the full orchestra."),
    (14,"dispose","dih-SPOHZ","verb","to get rid of; to place or arrange; to make willing","Please dispose of all litter in the bins provided along the trail."),
    (14,"exposure","ek-SPOH-zher","noun","the state of being exposed; the amount of time film is exposed to light","Long exposure to direct sunlight without sunscreen can damage the skin."),
    (14,"position","puh-ZIH-shun","noun/verb","a place where someone or something is; a point of view; to place","She applied for the position of team captain at the start of the season."),
    (14,"positive","POZ-ih-tiv","adjective","constructive and confident; having a value greater than zero; certain","Maintaining a positive attitude helped him push through the hardest part of the race."),
    # ── Lesson 15 ─────────────────────────────────────────────
    (15,"committee","kuh-MIT-ee","noun","a group selected to manage or investigate a particular matter","The school committee met to review the proposals for the new gymnasium."),
    (15,"communicate","kuh-MYOO-nih-kayt","verb","to share or exchange information; to convey a feeling","Athletes learn to communicate effectively with their teammates during play."),
    (15,"conjunction","kun-JUNGK-shun","noun","a word used to connect clauses; the occurrence of two events at the same time","The conjunction 'but' shows contrast between two ideas in a sentence."),
    (15,"converse","kun-VURS","verb/noun","to talk informally; the opposite or reverse of something","She loved to converse with her grandfather about his childhood adventures."),
    (15,"reaction","ree-AK-shun","noun","a response to an event or situation; a chemical change","Her reaction to the surprise party was a mix of shock and delight."),
    (15,"reelect","ree-ih-LEKT","verb","to elect someone again to the same position","The community voted to reelect the mayor for a second four-year term."),
    (15,"reflect","rih-FLEKT","verb","to throw back light, heat, or sound; to think carefully; to bring credit or discredit","The still water reflected the mountains perfectly like a giant mirror."),
    (15,"relate","rih-LAYT","verb","to make or show a connection between; to feel sympathy with","She found it easy to relate to the main character in the novel."),
]

# ── Write CSV ────────────────────────────────────────────────
with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["lesson","word","pronunciation","partOfSpeech","definition","example"])
    w.writerows(rows)

counts = Counter(r[0] for r in rows)
print(f"Written {len(rows)} rows to {CSV_PATH}")
for lesson in sorted(counts):
    print(f"  Lesson {lesson}: {counts[lesson]} words")

# ── Patch vocabulary-data.js ─────────────────────────────────
by_lesson: dict = {}
for r in rows:
    by_lesson.setdefault(r[0], []).append({
        "word": r[1], "pronunciation": r[2],
        "partOfSpeech": r[3], "definition": r[4], "example": r[5]
    })

def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

def word_block(w, indent):
    pad = " " * indent
    return (
        f'{pad}{{\n'
        f'{pad}  "word": "{esc(w["word"])}",\n'
        f'{pad}  "pronunciation": "{esc(w["pronunciation"])}",\n'
        f'{pad}  "partOfSpeech": "{esc(w["partOfSpeech"])}",\n'
        f'{pad}  "definition": "{esc(w["definition"])}",\n'
        f'{pad}  "example": "{esc(w["example"])}"\n'
        f'{pad}}}'
    )

def words_js(words, indent=16):
    return ",\n".join(word_block(w, indent) for w in words)

p8  = "        "
p10 = "          "
p12 = "            "
p14 = "              "

# Existing L1 words to preserve
existing_l1 = [
    {"word":"uniform","pronunciation":"YOO-nuh-form","partOfSpeech":"noun",
     "definition":"special clothing worn by members of a group",
     "example":"All students must wear their school uniform."},
    {"word":"unite","pronunciation":"yoo-NITE","partOfSpeech":"verb",
     "definition":"to join together to form a single unit",
     "example":"The two companies will unite to form a larger corporation."},
]

def build_lesson1():
    all_words = existing_l1 + by_lesson.get(1, [])
    return (
        f'{p8}{{\n'
        f'{p10}"number": 1,\n'
        f'{p10}"title": "Numbers and Quantity",\n'
        f'{p10}"roots": [\n'
        f'{p12}{{\n'
        f'{p14}"root": "UNI",\n'
        f'{p14}"origin": "Latin",\n'
        f'{p14}"meaning": "one",\n'
        f'{p14}"words": [\n'
        f'{words_js(all_words, 16)}\n'
        f'{p14}]\n'
        f'{p12}}}\n'
        f'{p10}]\n'
        f'{p8}}}'
    )

def build_lesson(number, lesson_words):
    return (
        f'{p8}{{\n'
        f'{p10}"number": {number},\n'
        f'{p10}"title": "",\n'
        f'{p10}"roots": [\n'
        f'{p12}{{\n'
        f'{p14}"root": "",\n'
        f'{p14}"origin": "",\n'
        f'{p14}"meaning": "",\n'
        f'{p14}"words": [\n'
        f'{words_js(lesson_words, 16)}\n'
        f'{p14}]\n'
        f'{p12}}}\n'
        f'{p10}]\n'
        f'{p8}}}'
    )

lesson_blocks = [build_lesson1()]
for n in [2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15]:
    lesson_blocks.append(build_lesson(n, by_lesson.get(n, [])))

new_book_5 = (
    '    "book-5": {\n'
    '      "title": "Book 5",\n'
    '      "level": "Elementary",\n'
    '      "description": "Elementary level vocabulary from Greek and Latin roots",\n'
    '      "lessons": [\n'
    + ",\n".join(lesson_blocks) + "\n"
    '      ]\n'
    '    }'
)

with open(JS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'"book-5"\s*:\s*\{.*?\}(?=\s*,\s*"book-6")'
replaced, n = re.subn(pattern, new_book_5, content, flags=re.DOTALL)
if n != 1:
    raise RuntimeError(f"Expected 1 replacement, got {n}")

with open(JS_PATH, "w", encoding="utf-8") as f:
    f.write(replaced)

print(f"\nPatched vocabulary-data.js (1 match replaced).")
