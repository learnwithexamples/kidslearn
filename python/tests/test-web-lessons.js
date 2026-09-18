/* ============================================================
   test-web-lessons.js — the Web Coding lessons, driven like a student

       node python/tests/test-web-lessons.js

   These lessons cannot be tested the way the rest of this repo is tested.
   The whole point of them is that HTML gets RENDERED and JavaScript RUNS, so
   checking them means opening a real browser, clicking the Practice tab,
   typing into a playground and pressing Check.

   So that is what this does: it starts a local server and a headless Chrome,
   talks to it over the DevTools protocol, and for every lesson types both a
   RIGHT answer and a WRONG one into the same task. The right one must be
   accepted and the wrong one must be refused — a checker that says yes to
   everything is worse than no checker at all.

   Everything runs on the real clock. Chrome's --virtual-time-budget will
   fast-forward past an iframe's own load and report failures that a person
   would never see, which is exactly how this file came to exist.
   ============================================================ */

const { spawn, spawnSync } = require('child_process');
const http = require('http');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const PORT = 8749;
const DEBUG_PORT = 9333;

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

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

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ------------------------------------------------------------- the server */

function startServer() {
    const fs = require('fs');
    const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
                    '.json': 'application/json', '.png': 'image/png' };
    const server = http.createServer((req, res) => {
        const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
        fs.readFile(file, (err, data) => {
            if (err) { res.writeHead(404); res.end('no'); return; }
            res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'text/plain' });
            res.end(data);
        });
    });
    return new Promise(r => server.listen(PORT, () => r(server)));
}

/* ------------------------------------------------- talking to the browser */

async function connect() {
    for (let tries = 0; tries < 60; tries++) {
        try {
            const list = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
            const page = list.find(t => t.type === 'page');
            if (page) { return page.webSocketDebuggerUrl; }
        } catch (e) { /* not up yet */ }
        await wait(250);
    }
    throw new Error('Chrome never opened its debugging port');
}

function talk(url) {
    return new Promise((ready, broke) => {
        const socket = new WebSocket(url);
        let id = 0;
        const pending = new Map();

        socket.onmessage = (event) => {
            const note = JSON.parse(event.data);
            if (note.id && pending.has(note.id)) {
                const settle = pending.get(note.id);
                pending.delete(note.id);
                settle(note);
            }
        };
        socket.onerror = broke;
        socket.onopen = () => ready({
            send(method, params) {
                id += 1;
                const mine = id;
                return new Promise(done => {
                    pending.set(mine, done);
                    socket.send(JSON.stringify({ id: mine, method, params: params || {} }));
                });
            },
            close() { socket.close(); }
        });
    });
}

/** evaluate — run an expression in the page and wait for its promise. */
async function evaluate(tab, expression) {
    const reply = await tab.send('Runtime.evaluate', {
        expression, awaitPromise: true, returnByValue: true
    });
    if (reply.result && reply.result.exceptionDetails) {
        throw new Error(reply.result.exceptionDetails.text);
    }
    return reply.result.result.value;
}

/* The probe that lives in the page: type an answer, press Check, and wait
   for the verdict to actually appear. Real timers, no polling of a clock
   that somebody else is winding forward. */
const TRY_ONE = `
(function (index, code) {
    return new Promise(function (done) {
        var practice = document.querySelector('.lesson-tab[data-panel="practice"]');
        if (practice) { practice.click(); }
        var task = document.querySelectorAll('.task')[index];
        if (!task) { return done('NO SUCH TASK'); }
        var out = task.querySelector('.pg-output');
        out.textContent = '';
        task.querySelector('.code-input').value = code;
        task.querySelector('.check-btn').click();

        var tries = 0;
        var tick = setInterval(function () {
            tries += 1;
            var text = out.textContent;
            if (text.indexOf('🎉') !== -1) { clearInterval(tick); done('PASS'); }
            else if (text.indexOf('🤔') !== -1) {
                clearInterval(tick);
                done('REFUSED: ' + text.replace(/\\s+/g, ' ').slice(0, 120));
            } else if (tries > 100) { clearInterval(tick); done('NO VERDICT'); }
        }, 50);
    });
})`;

async function tryAnswer(tab, index, code) {
    return evaluate(tab, `${TRY_ONE}(${index}, ${JSON.stringify(code)})`);
}

async function open(tab, page) {
    await tab.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/python/${page}` });
    await wait(700);
}

/* ------------------------------------------------------------- the lessons */

const TRIALS = [
    ['web-html.html', 'Lesson 1 — HTML', [
        [0, '<h1>Hello, world!</h1><p>I am building a web page.</p>', '<h1>Hello, world!</h1>'],
        [2, '<!DOCTYPE html><html><head><title>My First Page</title></head><body><h1>It works!</h1></body></html>',
            '<h1>It works!</h1>'],
        [6, '<!DOCTYPE html><html><head><title>Nesting Practice</title></head><body><h1>Inside Out</h1><p>a <strong>this bit is bold</strong> b</p></body></html>',
            '<p>this bit is bold</p>']
    ]],
    ['web-html-text.html', 'Lesson 2 — text & links', [
        [0, '<h1>Shopping</h1><ul><li>Bread</li><li>Cheese</li><li>Apples</li></ul>', '<h1>Shopping</h1>'],
        [2, '<p>I am learning at <a href="../index.html">KidsLearn</a>.</p>', '<p>I am learning at KidsLearn.</p>'],
        [4, '<ul><li>Fruit<ul><li>Apple</li><li>Pear</li></ul></li><li>Vegetables</li></ul>',
            '<ul><li>Fruit</li><li>Pear</li></ul>']
    ]],
    ['web-css.html', 'Lesson 3 — CSS', [
        [0, '<style>h1{color:darkorange}</style><h1>Bright Ideas</h1>', '<h1>Bright Ideas</h1>'],
        [1, '<style>.good{color:green}.bad{color:red}</style><p class="good">a</p><p class="bad">b</p>',
            '<p class="good">a</p>'],
        [2, '<style>.card{background:#eef;border:2px solid #333;padding:14px}</style><div class="card"><h2>t</h2><p>p</p></div>',
            '<div class="card"><h2>t</h2></div>']
    ]],
    ['web-js.html', 'Lesson 4 — JavaScript', [
        [0, 'console.log("Hello, JavaScript!");', 'console.log("nope");'],
        [2, 'const a=12;const b=5;console.log(a+b);console.log(a-b);console.log(a*b);',
            'console.log(17);console.log(7);'],
        [7, 'const i="Cake";const p=4;const m=3;console.log(`${i} x${m}`);console.log(`Total: ${p*m}`);',
            'console.log("Cake x3");']
    ]],
    ['web-js-logic.html', 'Lesson 5 — logic', [
        [1, 'for(let i=1;i<=5;i++){console.log(i);}', 'for(let i=1;i<=4;i++){console.log(i);}'],
        [4, 'let t=0;for(let n=1;n<=100;n++){t=t+n;}console.log(t);', 'console.log(5049);'],
        [7, 'let r="";for(let i=1;i<=5;i++){r=r+"*";console.log(r);}',
            'let r="";for(let i=1;i<=4;i++){r=r+"*";console.log(r);}']
    ]],
    ['web-dom.html', 'Lesson 6 — the DOM', [
        [0, '<h1 id="title">Before</h1><scr' + 'ipt>document.getElementById("title").textContent="It worked!";</scr' + 'ipt>',
            '<h1 id="title">Before</h1>'],
        [2, '<button id="go">Press me</button><p id="out"></p><scr' + 'ipt>document.getElementById("go").addEventListener("click",function(){});</scr' + 'ipt>',
            '<button id="go">Press me</button>'],
        [6, '<input id="n"><button id="go">Go</button><p id="out"></p><scr' + 'ipt>1;</scr' + 'ipt>',
            '<button id="go">Go</button><p id="out"></p>']
    ]],
    ['web-canvas.html', 'Lesson 7 — canvas', [
        [0, 'ctx.fillStyle="blue";ctx.fillRect(50,50,100,100);', 'const x = 1;'],
        [1, 'ctx.fillRect(20,40,110,90);ctx.strokeRect(180,40,110,90);', 'ctx.fillRect(20,40,110,90);'],
        [2, 'ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(320,240);ctx.stroke();', 'ctx.fillRect(0,0,10,10);'],
        [6, 'ctx.beginPath();ctx.moveTo(100,20);ctx.lineTo(100,220);ctx.stroke();', 'ctx.fillRect(0,0,10,10);']
    ]],
    ['web-canvas-art.html', 'Lesson 8 — circles & loops', [
        [0, 'ctx.beginPath();ctx.arc(160,120,60,0,Math.PI*2);ctx.fill();', 'ctx.fillRect(100,60,120,120);'],
        [6, 'for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(160,120,100-i*20,0,Math.PI*2);ctx.fill();}',
            'ctx.fillRect(60,20,200,200);'],
        [7, 'ctx.fillRect(0,0,320,240);ctx.beginPath();ctx.arc(265,45,30,0,Math.PI*2);ctx.fill();ctx.fillText("by Maya",12,28);',
            'ctx.fillRect(0,0,320,240);']
    ]]
];

async function main() {
    if (!require('fs').existsSync(CHROME)) {
        console.log('  SKIP  Chrome is not installed here, so the lessons cannot be driven.');
        console.log('\n0 checks run (skipped)');
        return;
    }

    const server = await startServer();
    const profile = require('fs').mkdtempSync(require('os').tmpdir() + '/web-lessons-');
    const chrome = spawn(CHROME, [
        '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
        `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`, 'about:blank'
    ], { stdio: 'ignore' });

    let tab;
    try {
        tab = await talk(await connect());
        await tab.send('Runtime.enable');
        await tab.send('Page.enable');

        for (const [page, label, trials] of TRIALS) {
            console.log('\n' + label + '  (' + page + ')');
            await open(tab, page);

            const counts = await evaluate(tab,
                '({tasks: document.querySelectorAll(".task").length,' +
                ' demos: document.querySelectorAll(".web-demo").length})');
            check(label + ': the page has tasks and live examples',
                  counts.tasks > 0 && counts.demos > 0, JSON.stringify(counts));

            for (const [index, right, wrong] of trials) {
                const yes = await tryAnswer(tab, index, right);
                check(label + ': task ' + (index + 1) + ' accepts a correct answer',
                      yes === 'PASS', yes);

                const no = await tryAnswer(tab, index, wrong);
                check(label + ': task ' + (index + 1) + ' refuses a wrong one',
                      no.startsWith('REFUSED'), no);
            }
        }
    } finally {
        if (tab) { tab.close(); }
        chrome.kill();
        server.close();
        spawnSync('rm', ['-rf', profile]);
    }

    console.log('\n' + checks + ' checks run');
    if (failures) {
        console.log(failures + ' PROBLEM(S)');
        process.exit(1);
    }
    console.log('ALL WEB LESSON TESTS PASSED');
}

main().catch(err => { console.error(err); process.exit(1); });
