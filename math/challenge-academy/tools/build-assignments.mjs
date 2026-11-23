#!/usr/bin/env node
/* Builds the downloadable assignment PDFs by printing assignment.html in
 * headless Chrome, and checks the rendered pages for broken maths.
 *
 *   node math/challenge-academy/tools/build-assignments.mjs            # every lesson
 *   node math/challenge-academy/tools/build-assignments.mjs 3 4        # just these
 *   node … 3 --preview /some/dir   # also write PNGs of the PDF pages and of the
 *                                  # lesson page (debug view) to look at
 *   node … 3 --no-pdf --preview /some/dir   # previews only; leaves assignments/ alone
 *
 * Needs Google Chrome, and a network connection (the pages load KaTeX from a CDN).
 * Previews need PyMuPDF: the repo's .venv has it.
 */
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(dir, '..', '..');
const CA = require(path.join(dir, 'ca-core.js'));

const CHROME = process.env.CHROME || [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(existsSync);
if (!CHROME) { console.error('Google Chrome not found. Set CHROME=/path/to/chrome'); process.exit(1); }

const argv = process.argv.slice(2);
const pv = argv.indexOf('--preview');
const previewDir = pv >= 0 ? path.resolve(argv[pv + 1]) : null;
const noPdf = argv.includes('--no-pdf');
const idArgs = argv.filter((a, i) => /^\d+$/.test(a) && !(pv >= 0 && i === pv + 1)).map(Number);
const ids = idArgs.length ? idArgs : CA.catalog.map(l => l.id).filter(id => CA.isAvailable(id));

function chrome(extra, url) {
    const profile = mkdtempSync(path.join(os.tmpdir(), 'ca-chrome-'));
    try {
        return execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
            `--user-data-dir=${profile}`, '--allow-file-access-from-files', '--virtual-time-budget=20000', ...extra, url],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024, timeout: 480000 });
    } finally { rmSync(profile, { recursive: true, force: true }); }
}
const pageUrl = (page, id, extra = '') => `${pathToFileURL(path.join(dir, page)).href}?n=${id}${extra}`;

/** Look at the rendered DOM for maths that failed to typeset. */
function checkDom(label, url) {
    let dom;
    try { dom = chrome(['--dump-dom'], url); } catch (e) {
        console.log(`  ✗ ${label}: Chrome failed (${e.code || e.signal || e.status || 'error'})`);
        return 1;
    }
    const problems = [];
    if (!dom.includes('class="katex"')) problems.push('KaTeX did not run (no network?)');
    const bad = dom.match(/class="katex-error"[^>]*title="([^"]*)"/);
    if (bad) problems.push(`KaTeX error: ${bad[1]}`);
    const count = (dom.match(/class="katex-error"/g) || []).length;
    if (count > 1) problems.push(`${count} KaTeX errors in total`);
    const text = dom.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<annotation[\s\S]*?<\/annotation>/g, '').replace(/<[^>]+>/g, '');
    const raw = text.match(/\\\(|\\\)|\\frac|\\sqrt|\\times|\\pi/);
    if (raw) problems.push(`raw TeX left in the page near: ${JSON.stringify(text.slice(Math.max(0, raw.index - 50), raw.index + 30))}`);
    for (const p of problems) console.log(`  ✗ ${label}: ${p}`);
    return problems.length;
}

function toPng(pdf, prefix) {
    const py = [path.join(repo, '.venv/bin/python3'), 'python3'].find(p => p === 'python3' || existsSync(p));
    execFileSync(py, ['-c', `
import sys, fitz
doc = fitz.open(sys.argv[1])
for i, page in enumerate(doc):
    page.get_pixmap(dpi=80).save(f"{sys.argv[2]}-p{i + 1:02d}.png")
print(f"    {len(doc)} page(s) -> {sys.argv[2]}-pNN.png")
`, pdf, prefix], { stdio: 'inherit' });
}

let failures = 0;
mkdirSync(path.join(dir, 'assignments'), { recursive: true });
if (previewDir) mkdirSync(previewDir, { recursive: true });

for (const id of ids) {
    const info = CA.info(id);
    console.log(`Lesson ${id}: ${info.title}`);
    failures += checkDom('assignment page', pageUrl('assignment.html', id));
    failures += checkDom('lesson page', pageUrl('lesson.html', id, '&debug=1'));

    const out = noPdf ? path.join(previewDir || os.tmpdir(), `lesson-${CA.pad2(id)}-assignment.pdf`) : path.join(dir, CA.pdfFile(id));
    chrome(['--no-pdf-header-footer', `--print-to-pdf=${out}`], pageUrl('assignment.html', id));
    if (!existsSync(out) || statSync(out).size < 20000) { console.log('  ✗ the PDF was not written'); failures++; continue; }
    console.log(`  ✓ ${path.relative(repo, out)} (${Math.round(statSync(out).size / 1024)} KB)`);

    if (previewDir) {
        toPng(out, path.join(previewDir, `lesson-${CA.pad2(id)}-assignment`));
        const dbg = path.join(previewDir, `lesson-${CA.pad2(id)}-page.pdf`);
        chrome(['--no-pdf-header-footer', `--print-to-pdf=${dbg}`], pageUrl('lesson.html', id, '&debug=1'));
        toPng(dbg, path.join(previewDir, `lesson-${CA.pad2(id)}-page`));
    }
}
console.log(failures ? `\n${failures} problem(s).` : '\nDone.');
process.exit(failures ? 1 : 0);
