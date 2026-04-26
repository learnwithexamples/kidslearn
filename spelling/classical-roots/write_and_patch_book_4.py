#!/usr/bin/env python3
"""Generate vocabulary_from_classical_roots_words_4.csv and patch vocabulary-data.js book-4."""
import csv, re
from collections import Counter

CSV_PATH = "/Users/yyw/github/kidslearn/spelling/classical-roots/vocabulary_from_classical_roots_words_4.csv"
JS_PATH  = "/Users/yyw/github/kidslearn/data/vocabulary-data.js"

rows = [
    # ── Lesson 1 ──────────────────────────────────────────────
    (1,"gradually","GRAJ-oo-uh-lee","adverb","slowly and in small stages; by degrees","The weather gradually improved as the storm moved away."),
    (1,"graduate","GRAJ-oo-ayt","verb/noun","to earn a degree or diploma; a person who has done so","She worked hard to graduate at the top of her class."),
    (1,"graduation","graj-oo-AY-shun","noun","the ceremony for receiving a degree or diploma","The whole family attended his graduation from middle school."),
    (1,"sensation","sen-SAY-shun","noun","a physical feeling caused by something touching the body; great excitement","The ice-cold water created a tingling sensation on her skin."),
    (1,"sensational","sen-SAY-shun-ul","adjective","causing great excitement or interest","The magician performed a sensational trick that amazed the crowd."),
    (1,"senseless","SEN-sles","adjective","lacking common sense; unconscious","It was senseless to go outside without a coat in the snow."),
    (1,"sensible","SEN-suh-bul","adjective","showing good judgment; practical","Wearing a helmet when biking is the sensible thing to do."),
    (1,"sensitive","SEN-suh-tiv","adjective","quick to feel or notice; easily affected by others' feelings","She is very sensitive to criticism and takes it personally."),
    # ── Lesson 2 ──────────────────────────────────────────────
    (2,"motel","moh-TEL","noun","a roadside hotel for motorists","The family stopped at a motel halfway through their long road trip."),
    (2,"motionless","MOH-shun-les","adjective","not moving; completely still","The deer stood motionless at the edge of the forest."),
    (2,"motivate","MOH-tuh-vayt","verb","to cause someone to act or try harder","The coach's pep talk helped motivate the team before the big game."),
    (2,"motive","MOH-tiv","noun","a reason for doing something","The detective tried to find the motive behind the mysterious disappearance."),
    (2,"motor","MOH-ter","noun","a machine that produces power to make something move","The electric motor in the toy car made its wheels spin."),
    (2,"numerator","NYOO-mer-ay-ter","noun","the top number in a fraction that tells how many parts you have","In the fraction three-fourths, three is the numerator."),
    (2,"numerical","nyoo-MER-ih-kul","adjective","relating to or expressed as numbers","The students arranged the cards in numerical order from one to twenty."),
    (2,"numerous","NYOO-mer-us","adjective","many; consisting of a great number","The park was home to numerous species of birds and butterflies."),
    # ── Lesson 3 ──────────────────────────────────────────────
    (3,"delicacy","DEL-ih-kuh-see","noun","something that is fine or delicate; a rare, exotic food","Oysters are considered a delicacy in many parts of the world."),
    (3,"delicate","DEL-ih-kit","adjective","very fine in texture or structure; easily broken or damaged","The lace tablecloth was so delicate that she handled it with great care."),
    (3,"delicatessen","del-ih-kuh-TES-en","noun","a store or section of a store that sells prepared foods and specialty meats","Mom picked up sandwiches at the delicatessen on the way home."),
    (3,"delicious","dih-LISH-us","adjective","highly pleasing to the taste or smell","The freshly baked cookies smelled absolutely delicious."),
    (3,"delightful","dih-LYT-ful","adjective","causing delight; charming and pleasant","We had a delightful afternoon picnicking in the sunny park."),
    (3,"quest","kwest","noun","a long search for something important","The knight set off on a quest to find the mysterious treasure."),
    (3,"questionable","KWES-chun-uh-bul","adjective","doubtful; not certain or reliable","His questionable excuse for missing practice didn't convince the coach."),
    (3,"questionnaire","kwes-chun-AIR","noun","a written set of questions used to gather information","Each student filled out a questionnaire about their favorite subjects."),
    # ── Lesson 5 ──────────────────────────────────────────────
    (5,"partial","PAR-shul","adjective","not complete; favoring one side more than the other","He only finished a partial draft of the essay before time ran out."),
    (5,"particle","PAR-tih-kul","noun","a very small piece of something","A particle of dust floated in the beam of sunlight."),
    (5,"particular","per-TIK-yuh-ler","adjective","specific; more than others; hard to please","She was very particular about how her room was organized."),
    (5,"partition","par-TISH-un","noun/verb","a dividing wall or screen; to divide into parts","The classroom was divided by a partition to create two separate spaces."),
    (5,"partner","PAR-tner","noun","a person who shares in an activity with another","She chose her best friend as her partner for the science project."),
    (5,"studio","STOO-dee-oh","noun","a room where an artist works or where recordings are made","The painter worked all day in her sunlit studio."),
    (5,"studiousness","STOO-dee-us-nes","noun","the quality of being diligent and hardworking in one's studies","His studiousness paid off when he earned straight A's on his report card."),
    (5,"understudy","UN-der-stud-ee","noun/verb","an actor who learns another's role to replace them if needed; to learn a role this way","She served as the understudy for the lead in the school play."),
    # ── Lesson 6 ──────────────────────────────────────────────
    (6,"deserve","dih-ZURV","verb","to have earned or be worthy of something","After months of hard work, the team deserved the championship trophy."),
    (6,"server","SUR-ver","noun","a person who serves food; a computer that provides data to others","The server brought the food to the table quickly and politely."),
    (6,"service","SUR-vis","noun","work done to help others; a system supplying public needs","The restaurant was known for its fast and friendly service."),
    (6,"serviceable","SUR-vih-suh-bul","adjective","functional and adequate; able to be used","The old bike was not flashy but perfectly serviceable for getting to school."),
    (6,"variable","VAIR-ee-uh-bul","adjective/noun","liable to change; an element that can vary","Rainfall in this region is highly variable from one year to the next."),
    (6,"variation","vair-ee-AY-shun","noun","a change or difference in form, position, or condition","Each shell on the beach showed a beautiful variation in color and pattern."),
    (6,"variety","vuh-RY-ih-tee","noun","a number of different things; diversity","The farmers' market offered a variety of fresh fruits and vegetables."),
    (6,"various","VAIR-ee-us","adjective","more than one; of different kinds","Students were given various options for their book report project."),
    # ── Lesson 7 ──────────────────────────────────────────────
    (7,"ease","eez","noun/verb","freedom from difficulty; to make less difficult","She solved the puzzle with ease, finishing in under two minutes."),
    (7,"easiest","EE-zee-ist","adjective","requiring the least effort; simplest","The easiest route to school takes only five minutes to walk."),
    (7,"finale","fih-NAL-ee","noun","the last section of a performance or event","The fireworks display was the grand finale of the Fourth of July celebration."),
    (7,"finalist","FY-nuh-list","noun","a competitor who reaches the final round","She was proud to be named a finalist in the national spelling bee."),
    (7,"finally","FY-nuh-lee","adverb","at the end; after a long time","After weeks of waiting, the package finally arrived at her door."),
    (7,"finite","FY-nyt","adjective","having limits or bounds; not infinite","The amount of water on Earth is finite, so we must use it wisely."),
    (7,"uneasy","un-EE-zee","adjective","feeling anxious or uncomfortable","He felt uneasy walking alone on the dark street at night."),
    (7,"unfinished","un-FIN-isht","adjective","not completed; still needing more work","She left the unfinished painting on her easel and went to bed."),
    # ── Lesson 9 ──────────────────────────────────────────────
    (9,"familiar","fuh-MIL-yer","adjective","well known from long association; common; informal","The smell of her grandmother's cooking was warm and familiar."),
    (9,"familiarity","fuh-mil-ee-AR-ih-tee","noun","close acquaintance with something; informal friendliness","His familiarity with the software made him the go-to person in the office."),
    (9,"familiarize","fuh-MIL-yer-yz","verb","to make someone knowledgeable about something","She spent the weekend familiarizing herself with the new math textbook."),
    (9,"specialist","SPESH-uh-list","noun","a person with expert knowledge in a particular area","The eye specialist recommended glasses to correct her vision."),
    (9,"specialty","SPESH-ul-tee","noun","a product or skill that someone is especially known for","Fresh pasta is the chef's specialty at this Italian restaurant."),
    (9,"species","SPEE-sheez","noun","a group of living things that share common traits and can breed together","The giant panda is an endangered species protected by international law."),
    (9,"specific","spuh-SIF-ik","adjective","clearly defined; precise","The teacher gave specific instructions for completing the assignment."),
    (9,"specify","SPES-uh-fy","verb","to state exactly and in detail","Please specify which size shirt you want when placing your order."),
    # ── Lesson 10 ─────────────────────────────────────────────
    (10,"active","AK-tiv","adjective","engaged in physical movement or action; working","The children stayed active all afternoon playing in the backyard."),
    (10,"activity","ak-TIV-ih-tee","noun","the condition of being active; a specific task or exercise","Swimming is her favorite physical activity on hot summer days."),
    (10,"actor","AK-ter","noun","a person who performs in plays, movies, or other productions","The young actor memorized all of his lines in just two days."),
    (10,"actually","AK-choo-uh-lee","adverb","in fact; really; used for emphasis","I actually finished my homework before dinner for once."),
    (10,"enact","en-AKT","verb","to make a bill into law; to put into practice; to perform","Congress voted to enact the new environmental protection bill."),
    (10,"officer","AW-fih-ser","noun","a person in authority; a police officer or military officer","The police officer helped the lost child find her parents."),
    (10,"official","uh-FISH-ul","adjective/noun","authorized or approved; a person holding a position of authority","The official start time of the race was precisely eight o'clock."),
    (10,"officiate","uh-FISH-ee-ayt","verb","to perform the duties of an official; to conduct a ceremony","The mayor was asked to officiate at the ribbon-cutting ceremony."),
    # ── Lesson 11 ─────────────────────────────────────────────
    (11,"captivate","KAP-tuh-vayt","verb","to attract and hold the interest of someone strongly","The storyteller's vivid descriptions captivated every child in the room."),
    (11,"captive","KAP-tiv","noun/adjective","a person or animal kept in confinement; imprisoned","The captive bird was released back into the wild after it healed."),
    (11,"captivity","kap-TIV-ih-tee","noun","the state of being kept captive or imprisoned","The animals at the rescue center had never known life outside of captivity."),
    (11,"recapture","ree-KAP-cher","verb","to capture again; to recover a previous feeling or time","The photo helped her recapture the joy she felt on that summer day."),
    (11,"statement","STAYT-ment","noun","a declaration of something; a written or spoken remark","The witness gave a detailed statement to the detective."),
    (11,"stationary","STAY-shun-er-ee","adjective","not moving or not intended to be moved","The exercise bicycle is stationary but it still provides a great workout."),
    (11,"statue","STACH-oo","noun","a carved or modeled figure of a person or animal","A bronze statue of the town founder stands in the center of the park."),
    (11,"understate","un-der-STAYT","verb","to express in restrained terms; to describe as less than it really is","To say he was disappointed would be to understate how he truly felt."),
    # ── Lesson 13 ─────────────────────────────────────────────
    (13,"classic","KLAS-ik","adjective/noun","judged over time to be of the highest quality; a work of enduring excellence","The teacher assigned a classic novel that students still read a century later."),
    (13,"classical","KLAS-ih-kul","adjective","relating to ancient Greek and Roman culture; traditional in style","She enjoyed both classical music and modern pop songs."),
    (13,"classification","klas-ih-fih-KAY-shun","noun","the action of sorting things into groups; a category","The library uses the Dewey Decimal classification system to organize its books."),
    (13,"classify","KLAS-ih-fy","verb","to arrange into groups based on shared qualities","Scientists classify living things into kingdoms, phyla, and other categories."),
    (13,"gratify","GRAT-ih-fy","verb","to please someone; to satisfy a desire","It gratified the teacher to see her students succeed."),
    (13,"gratitude","GRAT-ih-tood","noun","the quality of being thankful; appreciation for kindness","She expressed her gratitude with a heartfelt thank-you letter."),
    (13,"gratuity","gruh-TOO-ih-tee","noun","a tip given to someone in return for a service","The satisfied diners left a generous gratuity for their attentive waiter."),
    (13,"ungrateful","un-GRAYT-ful","adjective","not showing thanks; not appreciating kindness received","It seemed ungrateful to complain after such a generous gift."),
    # ── Lesson 14 ─────────────────────────────────────────────
    (14,"disorganized","dis-OR-guh-nyzd","adjective","not organized; lacking order or planning","His desk was so disorganized that he could never find what he needed."),
    (14,"organ","OR-gun","noun","a part of the body with a specific function; a large keyboard instrument","The heart is the organ responsible for pumping blood through the body."),
    (14,"organism","OR-guh-niz-um","noun","a living thing such as a plant, animal, or bacterium","A single drop of pond water can contain millions of tiny organisms."),
    (14,"organist","OR-guh-nist","noun","a person who plays the organ","The organist practiced for hours to prepare for the Sunday service."),
    (14,"organization","or-guh-nih-ZAY-shun","noun","an organized group of people; the act of organizing","She joined a volunteer organization that helps feed families in need."),
    (14,"probability","prob-uh-BIL-ih-tee","noun","the likelihood that something will happen","The weather forecast gave a high probability of rain for the weekend."),
    (14,"probable","PROB-uh-bul","adjective","likely to happen or be true","It seems probable that the game will be canceled because of the storm."),
    (14,"probe","prohb","noun/verb","a device used to explore; to investigate thoroughly","The scientist used a probe to measure the temperature deep in the ocean."),
    # ── Lesson 15 ─────────────────────────────────────────────
    (15,"local","LOH-kul","adjective/noun","relating to a particular place or area; a local person","The local library offers free reading programs for children all summer."),
    (15,"location","loh-KAY-shun","noun","a particular place or position","The new school will be built at a central location close to the bus routes."),
    (15,"locomotion","loh-kuh-MOH-shun","noun","movement from one place to another","Wheels are one of humanity's greatest inventions for locomotion."),
    (15,"relocate","ree-loh-KAYT","verb","to move to a new place","The company decided to relocate its headquarters to a larger building."),
    (15,"technicality","tek-nih-KAL-ih-tee","noun","a point of procedure or detail based on rules; a minor detail","The case was dismissed on a legal technicality rather than on its merits."),
    (15,"technician","tek-NISH-un","noun","a worker skilled in a technical subject","The computer technician repaired the broken laptop in under an hour."),
    (15,"technique","tek-NEEK","noun","a particular way of doing something skillfully","The art teacher showed students a new brush technique for blending colors."),
    (15,"technology","tek-NOL-oh-jee","noun","the application of scientific knowledge for practical purposes; machinery and devices","Modern technology has made it easy to communicate with people around the world."),
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

def root_words_js(words, indent=16):
    return ",\n".join(word_block(w, indent) for w in words)

# Existing lesson 1 structure (preserve, append image words to first root)
existing_l1_root1_words = [
    {"word":"conform","pronunciation":"kuhn-FAWRM","partOfSpeech":"verb",
     "definition":"to act in accordance with rules or customs",
     "example":"Students must conform to the school's dress code."},
    {"word":"deform","pronunciation":"dih-FAWRM","partOfSpeech":"verb",
     "definition":"to spoil the shape or appearance of",
     "example":"The accident deformed the car's front bumper."},
    {"word":"formal","pronunciation":"FAWR-muhl","partOfSpeech":"adjective",
     "definition":"following proper rules or customs; official",
     "example":"The wedding was a formal event requiring fancy dress."},
]
existing_l1_root2_words = [
    {"word":"magnify","pronunciation":"MAG-nuh-fy","partOfSpeech":"verb",
     "definition":"to make something appear larger",
     "example":"Use this lens to magnify the tiny text."},
    {"word":"maximum","pronunciation":"MAK-suh-muhm","partOfSpeech":"noun",
     "definition":"the greatest amount or highest degree",
     "example":"The maximum speed limit on this road is 65 mph."},
]

# Existing lesson 2 structure (preserve, append image words)
existing_l2_root1_words = [
    {"word":"mobile","pronunciation":"MOH-buhl","partOfSpeech":"adjective",
     "definition":"able to move or be moved easily",
     "example":"The mobile crane can be transported to different sites."},
    {"word":"motion","pronunciation":"MOH-shuhn","partOfSpeech":"noun",
     "definition":"the act or process of moving",
     "example":"The motion of the waves rocked the boat."},
]

pad8  = "        "
pad10 = "          "
pad12 = "            "
pad14 = "              "
pad16 = "                "

def build_lesson1():
    # Root 1: FORM (existing + image words appended)
    all_root1 = existing_l1_root1_words + by_lesson.get(1, [])
    root1_words = root_words_js(all_root1, 16)
    # Root 2: MAG/MAJ/MAX (existing words only)
    root2_words = root_words_js(existing_l1_root2_words, 16)
    return (
        f'{pad8}{{\n'
        f'{pad10}"number": 1,\n'
        f'{pad10}"title": "Form, Shape, and Size",\n'
        f'{pad10}"roots": [\n'
        f'{pad12}{{\n'
        f'{pad14}"root": "FORM",\n'
        f'{pad14}"origin": "Latin",\n'
        f'{pad14}"meaning": "shape",\n'
        f'{pad14}"words": [\n'
        f'{root1_words}\n'
        f'{pad14}]\n'
        f'{pad12}}},\n'
        f'{pad12}{{\n'
        f'{pad14}"root": "MAG/MAJ/MAX",\n'
        f'{pad14}"origin": "Latin",\n'
        f'{pad14}"meaning": "great, large",\n'
        f'{pad14}"words": [\n'
        f'{root2_words}\n'
        f'{pad14}]\n'
        f'{pad12}}}\n'
        f'{pad10}]\n'
        f'{pad8}}}'
    )

def build_lesson2():
    all_words = existing_l2_root1_words + by_lesson.get(2, [])
    words_js = root_words_js(all_words, 16)
    return (
        f'{pad8}{{\n'
        f'{pad10}"number": 2,\n'
        f'{pad10}"title": "Movement and Action",\n'
        f'{pad10}"roots": [\n'
        f'{pad12}{{\n'
        f'{pad14}"root": "MOV/MOT/MOB",\n'
        f'{pad14}"origin": "Latin",\n'
        f'{pad14}"meaning": "move",\n'
        f'{pad14}"words": [\n'
        f'{words_js}\n'
        f'{pad14}]\n'
        f'{pad12}}}\n'
        f'{pad10}]\n'
        f'{pad8}}}'
    )

def build_new_lesson(number, words):
    words_js = root_words_js(words, 16)
    return (
        f'{pad8}{{\n'
        f'{pad10}"number": {number},\n'
        f'{pad10}"title": "",\n'
        f'{pad10}"roots": [\n'
        f'{pad12}{{\n'
        f'{pad14}"root": "",\n'
        f'{pad14}"origin": "",\n'
        f'{pad14}"meaning": "",\n'
        f'{pad14}"words": [\n'
        f'{words_js}\n'
        f'{pad14}]\n'
        f'{pad12}}}\n'
        f'{pad10}]\n'
        f'{pad8}}}'
    )

lesson_blocks = []
lesson_blocks.append(build_lesson1())
lesson_blocks.append(build_lesson2())
for n in [3, 5, 6, 7, 9, 10, 11, 13, 14, 15]:
    lesson_blocks.append(build_new_lesson(n, by_lesson.get(n, [])))

new_book_4 = (
    '    "book-4": {\n'
    '      "title": "Book 4",\n'
    '      "level": "Elementary",\n'
    '      "description": "Elementary level vocabulary from Greek and Latin roots",\n'
    '      "lessons": [\n'
    + ",\n".join(lesson_blocks) + "\n"
    '      ]\n'
    '    }'
)

with open(JS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'"book-4"\s*:\s*\{.*?\}(?=\s*,\s*"book-5")'
replaced, n = re.subn(pattern, new_book_4, content, flags=re.DOTALL)
if n != 1:
    raise RuntimeError(f"Expected 1 replacement, got {n}")

with open(JS_PATH, "w", encoding="utf-8") as f:
    f.write(replaced)

print(f"\nPatched vocabulary-data.js (1 match replaced).")
