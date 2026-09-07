/* ============================================================
   test-assets.js — every file a page asks for must really ship.

       node funtime/tests/test-assets.js

   This catches the nastiest kind of bug in a static site: a file that exists
   on the machine it was written on, works perfectly there, and then 404s for
   everybody else because it was never committed. Nothing about the page looks
   wrong locally, so it can sit broken for a long time.

   So there are two checks, not one:
     1. does the file exist on disk at all?
     2. is it actually IN GIT, and therefore on the server?
   ============================================================ */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const PAGES = path.join(__dirname, '..');

let failures = 0;
let checks = 0;

function check(name, ok, detail) {
    checks++;
    if (ok) {
        console.log('  ok    ' + name);
    } else {
        failures++;
        console.log('  FAIL  ' + name);
        (detail || []).slice(0, 12).forEach(line => console.log('           ' + line));
    }
}

/** trackedFiles — everything git knows about, as a set of repo-relative paths. */
function trackedFiles() {
    const out = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' });
    return new Set(out.split('\n').filter(Boolean));
}

/**
 * referencesIn — every local file one page asks for.
 * INPUT: the page's path. OUTPUT: a list of { ref, onDisk, repoPath }.
 * ALGORITHM: pull every href and src out of the HTML, throw away the ones
 *            that point at other websites, and work out where each one lands.
 */
function referencesIn(pageFile) {
    const text = fs.readFileSync(pageFile, 'utf8');
    const found = [];
    const pattern = /(?:href|src)="([^"#?:]+)"/g;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        const ref = match[1];
        if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:') || ref.startsWith('mailto:')) {
            continue;
        }
        const onDisk = path.resolve(path.dirname(pageFile), ref);
        found.push({
            ref: ref,
            onDisk: onDisk,
            repoPath: path.relative(ROOT, onDisk).split(path.sep).join('/')
        });
    }
    return found;
}

const tracked = trackedFiles();
const pages = fs.readdirSync(PAGES).filter(name => name.endsWith('.html')).sort();

const missing = [];
const notShipped = new Map();

pages.forEach(function (name) {
    referencesIn(path.join(PAGES, name)).forEach(function (item) {
        if (item.repoPath.startsWith('..')) {
            return;                                  /* outside the repo entirely */
        }
        if (!fs.existsSync(item.onDisk)) {
            missing.push(name + '  ->  ' + item.ref);
        } else if (!tracked.has(item.repoPath)) {
            if (!notShipped.has(item.repoPath)) { notShipped.set(item.repoPath, []); }
            notShipped.get(item.repoPath).push(name);
        }
    });
});

console.log('\n' + pages.length + ' pages checked\n');

check('every file a page asks for exists on disk', missing.length === 0, missing);

check('every file a page asks for is committed, so the server has it too',
      notShipped.size === 0,
      Array.from(notShipped.entries()).map(([file, users]) =>
          file + '  — wanted by ' + users.length + ' page(s), e.g. ' + users[0]));

/* the stylesheet that all the workshop pages depend on is the one that got
   away before, so it is worth naming outright */
check('the workshop stylesheet is committed',
      tracked.has('styles/workshop.css'),
      ['styles/workshop.css is missing from git — every Build page loses its layout']);

console.log('\n' + checks + ' checks run');
console.log(failures === 0 ? 'ALL ASSET TESTS PASSED' : failures + ' TEST(S) FAILED');
process.exit(failures === 0 ? 0 : 1);
