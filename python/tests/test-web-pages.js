/* ============================================================
   test-web-pages.js — the Web Coding pages themselves

       node python/tests/test-web-pages.js

   Nine pages come out of one generator, so a mistake in it is a mistake in
   all nine at once. This checks the things that do not need a browser and so
   can be checked in a second: that the markup is balanced, that every file a
   page asks for really ships, that the lessons link to each other in order,
   and that every task is complete and actually checks something.

   The browser-side half — does a right answer pass and a wrong one fail —
   lives in test-web-lessons.js, which needs Chrome.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const PAGES = path.join(ROOT, 'python');

const LESSONS = ['html', 'html-text', 'css', 'js', 'js-logic', 'dom', 'canvas', 'canvas-art'];
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
                      'link', 'meta', 'source', 'track', 'wbr']);

let failures = 0;
let checks = 0;

function check(name, ok, extra) {
    checks++;
    if (ok) {
        console.log('  ok   ' + name);
    } else {
        failures++;
        console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + extra : ''));
    }
}

function read(name) { return fs.readFileSync(path.join(PAGES, name), 'utf8'); }

/** balanced — is every tag closed, in the right order? */
function balanced(html) {
    const open = [];
    const problems = [];
    const tag = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;
    /* Skip anything inside a comment, a <script> or a <pre>: those hold
       example markup that is text, not structure. */
    const text = html.replace(/<!--[\s\S]*?-->/g, '')
                     .replace(/<script\b[\s\S]*?<\/script>/gi, '')
                     .replace(/<pre\b[\s\S]*?<\/pre>/gi, '')
                     .replace(/<code class="demo-code">[\s\S]*?<\/code>/g, '')
                     .replace(/<textarea\b[\s\S]*?<\/textarea>/gi, '');

    let found;
    while ((found = tag.exec(text)) !== null) {
        const [, slash, name, selfClose] = found;
        if (VOID.has(name.toLowerCase()) || selfClose) { continue; }
        if (slash) {
            if (open.length === 0) { problems.push('stray </' + name + '>'); }
            else if (open[open.length - 1] !== name) {
                problems.push('</' + name + '> but <' + open[open.length - 1] + '> is open');
                open.pop();
            } else { open.pop(); }
        } else {
            open.push(name);
        }
    }
    if (open.length) { problems.push('never closed: ' + open.join(', ')); }
    return problems;
}

/* ----------------------------------------------------------- the markup */

console.log('the pages are well formed');

const ALL = ['web.html'].concat(LESSONS.map(s => 'web-' + s + '.html'));
ALL.forEach(function (name) {
    const problems = balanced(read(name));
    check(name + ': every tag is closed, in order', problems.length === 0, problems[0]);
});

/* ------------------------------------------------ the files they ask for */

console.log('every file they ask for really ships');

const tracked = new Set(execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter(Boolean));

(function () {
    const missing = [];
    const untracked = [];
    ALL.forEach(function (name) {
        /* <code> holds example markup for the reader to look at, not real
           references — "&lt;a href='…'&gt;" is prose, not a broken link. */
        const html = read(name).replace(/<code>[\s\S]*?<\/code>/g, '');
        const pattern = /(?:href|src)="([^"#?:]+)"/g;
        let found;
        while ((found = pattern.exec(html)) !== null) {
            const ref = found[1];
            if (/^(https?:)?\/\//.test(ref)) { continue; }
            const onDisk = path.resolve(PAGES, ref);
            const repoPath = path.relative(ROOT, onDisk);
            if (!fs.existsSync(onDisk)) { missing.push(name + ' -> ' + ref); }
            else if (!tracked.has(repoPath)) { untracked.push(name + ' -> ' + repoPath); }
        }
    });
    check('no page points at a file that is not there', missing.length === 0, missing[0]);
    check('and every one of them is committed', untracked.length === 0, untracked[0]);
})();

/* ----------------------------------------------------------- the linking */

console.log('the lessons are joined up');

(function () {
    const hub = read('web.html');
    const unlinked = LESSONS.filter(s => hub.indexOf('web-' + s + '.html') === -1);
    check('the hub links to all ' + LESSONS.length + ' lessons', unlinked.length === 0, unlinked[0]);

    let wrong = [];
    LESSONS.forEach(function (slug, i) {
        const html = read('web-' + slug + '.html');
        if (html.indexOf('href="web.html"') === -1) { wrong.push(slug + ' has no way back'); }
        if (i > 0 && html.indexOf('web-' + LESSONS[i - 1] + '.html') === -1) {
            wrong.push(slug + ' does not link back to ' + LESSONS[i - 1]);
        }
        if (i < LESSONS.length - 1 && html.indexOf('web-' + LESSONS[i + 1] + '.html') === -1) {
            wrong.push(slug + ' does not link on to ' + LESSONS[i + 1]);
        }
    });
    check('every lesson links to the one before and after', wrong.length === 0, wrong[0]);

    const pythonHub = read('python.html');
    check('the Python hub offers the Web Coding track',
          pythonHub.indexOf('href="web.html"') !== -1);
})();

/* ------------------------------------------------------------- the tasks */

console.log('every task is complete and checks something');

(function () {
    let total = 0;
    const incomplete = [];
    const uncheckable = [];
    const mismatched = [];

    LESSONS.forEach(function (slug) {
        const html = read('web-' + slug + '.html');
        const blocks = html.split('<div class="task"').slice(1);

        blocks.forEach(function (block, i) {
            total++;
            const where = slug + ' task ' + (i + 1);
            const head = block.slice(0, block.indexOf('>'));

            ['class="code-input"', 'class="run-btn"', 'class="check-btn"',
             'class="reset-btn"', 'class="solution-btn"', 'class="web-preview"',
             'class="goal-preview"', 'class="goal-output"', 'class="web-goal"',
             'class="pg-output"', 'class="solution"'].forEach(function (needed) {
                if (block.indexOf(needed) === -1) { incomplete.push(where + ' has no ' + needed); }
            });

            const kind = (head.match(/data-kind="([a-z]+)"/) || [])[1];
            if (!kind || ['page', 'html', 'js', 'canvas'].indexOf(kind) === -1) {
                incomplete.push(where + ' has a strange data-kind: ' + kind);
            }

            const hasCheck = /data-expected="|data-expect-tags="|data-expect-calls="/.test(head);
            if (!hasCheck) { uncheckable.push(where + ' checks nothing at all'); }

            /* A solution that does not satisfy its own task is a broken
               promise: press the button, paste it in, and be told no. */
            const solution = block.slice(block.indexOf('<div class="solution"'));
            /* The goal picture is generated by RUNNING this, so an empty
               answer would show a child a blank rectangle as the aim. */
            const answer = (solution.match(/<pre>([\s\S]*?)<\/pre>/) || [])[1] || '';
            if (answer.trim().length < 10) {
                incomplete.push(where + ' has no real answer to make a goal from');
            }
            const calls = (head.match(/data-expect-calls="([^"]*)"/) || [])[1];
            if (calls) {
                calls.split(',').map(c => c.trim()).filter(Boolean).forEach(function (call) {
                    if (solution.indexOf(call) === -1) {
                        mismatched.push(where + ': the answer never calls ' + call + '()');
                    }
                });
            }
            const tags = (head.match(/data-expect-tags="([^"]*)"/) || [])[1];
            if (tags) {
                tags.split(',').map(t => t.trim()).filter(Boolean).forEach(function (selector) {
                    const element = selector.split(/[ >]/).pop().split(/[.#\[]/)[0];
                    if (element && solution.indexOf('&lt;' + element) === -1) {
                        mismatched.push(where + ': the answer has no <' + element + '> for "' + selector + '"');
                    }
                });
            }
        });
    });

    check('there are plenty of tasks altogether', total >= 50, total);
    check('every task has an editor, four buttons, a preview and an answer',
          incomplete.length === 0, incomplete[0]);
    check('every task checks something', uncheckable.length === 0, uncheckable[0]);
    check('every answer satisfies its own task', mismatched.length === 0, mismatched[0]);
    console.log('       (' + total + ' tasks across ' + LESSONS.length + ' lessons)');
})();

/* --------------------------------------------- nothing that looks like ink */

console.log('the canvas edge is a guide, not a drawing');

(function () {
    const playground = fs.readFileSync(
        path.join(ROOT, 'scripts', 'web-playground.js'), 'utf8');

    /* A solid dark border round the preview canvas is indistinguishable from
       something drawn with strokeRect, and a child reading "draw an X" will
       reasonably wonder whether the box round it is theirs to draw as well.
       Whatever marks the edge has to be unmistakably NOT ink. */
    /* The stylesheet is built by joining string literals, so glue the
       adjacent ones back together before looking for the rule. */
    const joined = playground.replace(/'\s*\+\s*'/g, '');
    const rule = (joined.match(/canvas \{([^}]*)\}/) || [])[1] || '';
    check('the preview canvas has no border of its own',
          rule.indexOf('border:') === -1, rule.trim());
    check('its edge is marked with a dashed line instead',
          /outline:[^;]*dashed/.test(rule), rule.trim());

    /* And the lessons say so in words, because a guide nobody explained is
       still a guide somebody will try to draw. */
    ['canvas', 'canvas-art'].forEach(function (slug) {
        const html = read('web-' + slug + '.html');
        const explained = /not part of the (picture|drawing)/.test(html) ||
                          /nothing to draw/.test(html);
        check('web-' + slug + '.html explains the dashed edge',
              /dashed/.test(html) && explained);
    });
})();

/* ------------------------------------------------- the live examples */

console.log('the live examples');

(function () {
    let demos = 0;
    const wrong = [];
    LESSONS.forEach(function (slug) {
        const html = read('web-' + slug + '.html');
        const blocks = html.split('<div class="web-demo').slice(1);
        demos += blocks.length;
        blocks.forEach(function (block, i) {
            if (block.indexOf('class="demo-code"') === -1) {
                wrong.push(slug + ' demo ' + (i + 1) + ' has no code');
            }
            if (block.indexOf('class="web-preview"') === -1) {
                wrong.push(slug + ' demo ' + (i + 1) + ' has no preview');
            }
        });
        if (blocks.length === 0) { wrong.push(slug + ' has no live examples at all'); }
    });
    check('every lesson shows working examples', wrong.length === 0, wrong[0]);
    console.log('       (' + demos + ' live examples)');
})();

console.log('\n' + checks + ' checks run');
if (failures) {
    console.log(failures + ' PROBLEM(S)');
    process.exit(1);
}
console.log('ALL WEB PAGE TESTS PASSED');
