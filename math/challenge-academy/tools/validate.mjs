#!/usr/bin/env node
/* Checks Challenge Academy lessons without a browser.
 *
 *   node math/challenge-academy/tools/validate.mjs          # every lesson that exists
 *   node math/challenge-academy/tools/validate.mjs 3 4 5    # just these
 *
 * For each lesson: the shape of the file, every practice generator run a few
 * hundred times (the answer it gives must be accepted by its own checker), and
 * the 50-problem assignment built and checked for repeats.  Exits 1 on any error.
 */
import { createRequire } from 'node:module';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CA = require(path.join(dir, 'ca-core.js'));

const RUNS = 300;
// Numbers are Challenge Academy lessons; names are worksheets for the other math
// pages (math/worksheets/topics/<name>.js). --topics checks every worksheet.
// A worksheet is "speed" (a math page) or "physics/speed" (a page in another subject folder).
const repo = path.resolve(dir, '..', '..');
const topicDir = path.resolve(dir, '..', 'worksheets', 'topics');
const topicParts = id => (id.includes('/') ? id.split('/') : ['math', id]);
const topicFile = id => { const [subj, slug] = topicParts(id); return path.join(repo, subj, 'worksheets', 'topics', `${slug}.js`); };
const argv = process.argv.slice(2);
const allTopics = () => (existsSync(topicDir) ? readdirSync(topicDir).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3)).sort() : []);
let ids = argv.filter(a => /^\d+$/.test(a)).map(Number).concat(argv.filter(a => /^[a-z][a-z0-9-]*(\/[a-z0-9-]+)?$/.test(a)));
if (argv.includes('--topics')) ids = ids.concat(allTopics());
const si = argv.indexOf('--subject');          // --subject physics: every worksheet in physics/worksheets/topics
if (si >= 0) {
    const d = path.join(repo, argv[si + 1], 'worksheets', 'topics');
    ids = ids.filter(x => x !== argv[si + 1]).concat(readdirSync(d).filter(f => f.endsWith('.js')).sort().map(f => `${argv[si + 1]}/${f.slice(0, -3)}`));
}
if (!argv.length) ids = CA.catalog.map(l => l.id).filter(id => CA.isAvailable(id));

let errors = 0;
const err = (where, msg) => { errors++; console.log(`  ✗ ${where}: ${msg}`); };
const warn = (where, msg) => console.log(`  ! ${where}: ${msg}`);

/** Things that should never appear in text a student reads. */
function checkText(where, s, { allowEmpty = false } = {}) {
    if (typeof s !== 'string') return err(where, `expected a string, got ${typeof s}`);
    if (!allowEmpty && !s.trim()) return err(where, 'is empty');
    // A normal (non-raw) template literal turns \f \t \b \v \r into control characters.
    const ctl = s.match(/[\x00-\x09\x0b-\x1f]/);
    if (ctl) err(where, `contains control character 0x${ctl[0].charCodeAt(0).toString(16)} — write TeX in String.raw templates`);
    for (const bad of ['undefined', 'NaN', '[object', 'Infinity']) if (s.includes(bad)) err(where, `contains "${bad}": ${snippet(s, bad)}`);
    const open = (s.match(/\\\(/g) || []).length, close = (s.match(/\\\)/g) || []).length;
    if (open !== close) err(where, `unbalanced \\( \\): ${open} open, ${close} close`);
    const dopen = (s.match(/\\\[/g) || []).length, dclose = (s.match(/\\\]/g) || []).length;
    if (dopen !== dclose) err(where, `unbalanced \\[ \\]`);
    // TeX commands outside math delimiters will show up as raw backslashes.
    const outside = s.replace(/\\\([\s\S]*?\\\)/g, '').replace(/\\\[[\s\S]*?\\\]/g, '');
    const stray = outside.match(/\\[a-zA-Z]+/);
    if (stray) err(where, `TeX outside \\( \\): "${stray[0]}" in ${snippet(outside, stray[0])}`);
    if (/\$[^$\d\s][^$]*\$/.test(outside) && /\\|\^|_/.test(outside)) warn(where, 'looks like $…$ math; use \\( … \\)');
    const svgOpen = (s.match(/<svg/g) || []).length, svgClose = (s.match(/<\/svg>/g) || []).length;
    if (svgOpen !== svgClose) err(where, 'unbalanced <svg>');
}
const snippet = (s, bad) => { const i = s.indexOf(bad); return JSON.stringify(s.slice(Math.max(0, i - 40), i + 40)); };

function checkProblem(where, p) {
    if (!p || typeof p !== 'object') return err(where, 'gen() did not return an object');
    checkText(`${where} q`, p.q);
    if (p.fig != null) { checkText(`${where} fig`, p.fig); if (!/<svg/.test(p.fig)) err(`${where} fig`, 'is not an SVG'); }
    checkText(`${where} sol`, p.sol);
    const a = p.ans;
    if (!a || !a.kind) return err(where, 'has no ans (use CA.num / CA.frac / CA.pi / CA.root / CA.ratio / CA.mc / CA.text)');
    checkText(`${where} ans.html`, a.html);
    if (!CA.check(a, a.canon)) err(where, `its own answer is rejected by the checker (canon ${JSON.stringify(a.canon)})`);
    if (a.kind === 'mc') {
        a.choices.forEach((c, i) => checkText(`${where} choice ${i}`, String(c)));
        if (new Set(a.choices).size !== a.choices.length) err(where, 'has duplicate choices');
        if (a.choices.length < 2) err(where, 'needs at least 2 choices');
    }
    if (a.kind === 'num' && Math.abs(a.value) > 1e9) warn(where, `very large answer ${a.value}`);
    if (a.kind === 'num' && !Number.isInteger(a.value) && /^\\\(-?\d+\.\d{4,}\\\)/.test(a.html)) warn(where, `long decimal answer ${a.html} — use CA.frac or round`);
}

for (const id of ids) {
    const isTopic = typeof id === 'string';
    const idn = isTopic ? [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 100003, 7) : id;
    const info = isTopic ? null : CA.info(id);
    const file = isTopic ? topicFile(id) : path.join(dir, CA.lessonFile(id));
    console.log(isTopic ? `Worksheet ${id}` : `Lesson ${id}: ${info ? info.title : '???'}`);
    if (!existsSync(file)) { err('file', `${path.relative(dir, file)} does not exist`); continue; }
    try { require(file); } catch (e) { err('load', e.stack.split('\n').slice(0, 4).join(' | ')); continue; }
    const L = CA.lessons[isTopic ? topicParts(id)[1] : id];
    if (!L) { err('register', `the file did not call CA.register({ id: ${JSON.stringify(id)}, … })`); continue; }
    if (isTopic) {
        checkText('title', L.title);
        const subj = topicParts(id)[0];
        if (!L.page || !existsSync(path.resolve(repo, subj, L.page))) err('page', `page ${JSON.stringify(L.page)} is not a file in ${subj}/`);
    }

    // Tutorial (Challenge Academy lessons only; worksheets have just practice)
    if (!isTopic && (!Array.isArray(L.tutorial) || L.tutorial.length < 4)) err('tutorial', 'needs at least 4 sections');
    (L.tutorial || []).forEach((s, i) => { checkText(`tutorial[${i}].h`, s.h); checkText(`tutorial[${i}].html`, s.html); });

    // Summary (optional)
    if (L.summary != null) {
        if (!Array.isArray(L.summary) || !L.summary.length) err('summary', 'must be a non-empty array of { topic, points }');
        else L.summary.forEach((t, i) => {
            checkText(`summary[${i}].topic`, t.topic);
            if (!Array.isArray(t.points) || !t.points.length) err(`summary[${i}]`, 'needs points');
            (t.points || []).forEach((pt, k) => checkText(`summary[${i}].points[${k}]`, pt));
        });
    }

    // Examples
    if (!isTopic && (!Array.isArray(L.examples) || L.examples.length < 4)) err('examples', 'needs at least 4 worked examples');
    (L.examples || []).forEach((e, i) => {
        checkText(`examples[${i}].q`, e.q);
        if (e.fig != null) checkText(`examples[${i}].fig`, e.fig);
        if (!Array.isArray(e.steps) || e.steps.length < 2) err(`examples[${i}]`, 'needs at least 2 steps');
        (e.steps || []).forEach((s, k) => checkText(`examples[${i}].steps[${k}]`, s));
        checkText(`examples[${i}].answer`, e.answer);
    });

    // Practice generators
    const gens = L.practice || [];
    if (gens.length < 8) err('practice', `needs at least 8 generators, has ${gens.length}`);
    const seenIds = new Set();
    const levels = new Set();
    for (const g of gens) {
        const where = `practice "${g.id}"`;
        if (!g.id || !g.name || typeof g.gen !== 'function') { err(where, 'needs id, name and gen(rng)'); continue; }
        if (seenIds.has(g.id)) err(where, 'duplicate id');
        seenIds.add(g.id);
        if (![1, 2, 3].includes(g.level)) err(where, 'level must be 1, 2 or 3');
        levels.add(g.level);
        const distinct = new Set();
        const before = errors;
        for (let i = 0; i < RUNS && errors - before < 3; i++) {
            let p;
            try { p = g.gen(CA.rng(1000 + i * 7919 + idn)); } catch (e) { err(where, `threw: ${e.message} (seed ${1000 + i * 7919 + idn})`); continue; }
            checkProblem(`${where} seed ${1000 + i * 7919 + idn}`, p);
            if (p && p.q) distinct.add(p.q + '|' + (p.fig || ''));
        }
        if (distinct.size < 8) warn(where, `only ${distinct.size} different problems in ${RUNS} runs — add variety`);
    }
    for (const lv of [1, 2, 3]) if (!levels.has(lv)) err('practice', `no level ${lv} generator`);

    // Assignment
    try {
        const sheet = CA.buildAssignment(L);
        if (sheet.length !== CA.ASSIGNMENT_SIZE) err('assignment', `has ${sheet.length} problems`);
        const perLevel = [1, 2, 3].map(lv => sheet.filter(p => p.level === lv).length);
        const again = CA.buildAssignment(L);
        if (JSON.stringify(sheet) !== JSON.stringify(again)) err('assignment', 'is not deterministic — a generator uses Math.random() instead of rng');
        console.log(`  assignment: ${sheet.length} problems (A ${perLevel[0]}, B ${perLevel[1]}, C ${perLevel[2]}); ${gens.length} generators` + (isTopic ? '' : `, ${L.tutorial.length} tutorial sections, ${L.examples.length} examples`));
    } catch (e) { err('assignment', e.message); }
}

console.log(errors ? `\n${errors} error(s).` : '\nAll good.');
process.exit(errors ? 1 : 0);
