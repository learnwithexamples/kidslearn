/* ============================================================
   test-judge.js — LearnCamp's in-browser judge, driven like a student

       node python/learncamp/tests/test-judge.js            # every problem of every class
       node python/learncamp/tests/test-judge.js 2          # just class 2
       node python/learncamp/tests/test-judge.js 2 tree     # class 2, slugs containing "tree"

   Starts a local web server and headless Chrome, opens each problem, types the
   reference solution into the editor and presses Submit: it must be Accepted
   by the real Pyodide judge (so Python-in-the-browser agrees with the CPython
   that recorded the answers). It also checks the judge refuses a wrong answer,
   reports a crash, and survives an endless loop.
   Needs Chrome and a network connection (Pyodide loads from a CDN).
   ============================================================ */
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const LC = path.join(__dirname, '..');
const PORT = Number(process.env.LC_PORT) || 8761, DEBUG_PORT = Number(process.env.LC_DEBUG_PORT) || 9345;   // set both to run two at once
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const wait = ms => new Promise(r => setTimeout(r, ms));

const [classArg, slugArg] = process.argv.slice(2);
let failures = 0, checks = 0;
const check = (name, ok, extra) => { checks++; if (ok) console.log('  ok   ' + name); else { failures++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); } };

function startServer() {
    const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
    const server = http.createServer((req, res) => {
        const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
        fs.readFile(file, (err, data) => {
            if (err) { res.writeHead(404); res.end('no'); return; }
            res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'text/plain' });
            res.end(data);
        });
    });
    return new Promise(r => server.listen(PORT, () => r(server)));
}

async function connect() {
    for (let i = 0; i < 80; i++) {
        try {
            const list = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
            const page = list.find(t => t.type === 'page');
            if (page) return page.webSocketDebuggerUrl;
        } catch (e) { /* not up yet */ }
        await wait(250);
    }
    throw new Error('Chrome never opened its debugging port');
}

function talk(url) {
    return new Promise((ready, broke) => {
        const ws = new WebSocket(url);
        let id = 0;
        const pending = new Map();
        ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
        ws.onerror = broke;
        ws.onopen = () => ready({
            send(method, params) { const mine = ++id; return new Promise(done => { pending.set(mine, done); ws.send(JSON.stringify({ id: mine, method, params: params || {} })); }); },
            close() { ws.close(); },
        });
    });
}

async function evaluate(tab, expression) {
    const r = await tab.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300));
    return r.result.result.value;
}

/* In the page: open a problem, type code, press Submit, wait for the verdict. */
const SUBMIT = `
(function (slug, code, maxMs) {
    return new Promise(function (done) {
        location.hash = '#p=' + slug;
        setTimeout(function () {
            var ta = document.querySelector('.lc-main');
            if (!ta) return done('NO EDITOR');
            ta.value = code;
            document.getElementById('lc-submit').click();
            var t0 = Date.now();
            var tick = setInterval(function () {
                var v = document.querySelector('.lc-verdict');
                var text = v ? v.textContent : '';
                if (v && (v.classList.contains('good') || v.classList.contains('bad'))) {
                    clearInterval(tick);
                    var fail = document.querySelector('.lc-fail');
                    done(text + (fail ? ' | ' + fail.textContent.replace(/\\s+/g, ' ').slice(0, 300) : ''));
                } else if (Date.now() - t0 > maxMs) { clearInterval(tick); done('NO VERDICT: ' + text); }
            }, 100);
        }, 150);
    });
})`;
const submit = (tab, slug, code, maxMs = 120000) => evaluate(tab, `${SUBMIT}(${JSON.stringify(slug)}, ${JSON.stringify(code)}, ${maxMs})`);

function loadClass(file) {
    const LCobj = { register(c) { this.c = c; } };
    new Function('LC', fs.readFileSync(file, 'utf8'))(LCobj);
    return LCobj.c;
}

(async () => {
    const files = fs.readdirSync(path.join(LC, 'data')).filter(f => /^class-\d+\.js$/.test(f)).sort()
        .filter(f => !classArg || Number(f.match(/\d+/)[0]) === Number(classArg));
    const server = await startServer();
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lc-chrome-'));
    const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`,
        `--remote-debugging-port=${DEBUG_PORT}`, 'about:blank'], { stdio: 'ignore' });
    let tab;
    try {
        tab = await talk(await connect());
        await tab.send('Runtime.enable');
        for (const f of files) {
            const C = loadClass(path.join(LC, 'data', f));
            console.log(`Class ${C.id}: ${C.title}`);
            await tab.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/python/learncamp/class.html?c=${C.id}#problems` });
            await wait(1500);
            const probs = C.problems.filter(p => !slugArg || p.slug.includes(slugArg));
            for (const p of probs) {
                const v = await submit(tab, p.slug, p.solution);
                check(`${p.slug}: reference solution accepted`, /Accepted/.test(v), v);
            }
            if (!slugArg) {   // the judge must also say no, and must survive bad programs
                const p = C.problems[0];
                check('wrong answer is refused', /tests passed/.test(await submit(tab, p.slug, 'print("definitely wrong")')));
                check('a crash is reported', /crashed/.test(await submit(tab, p.slug, 'print(1/0)')));
                check('an endless loop is stopped', /Too slow/.test(await submit(tab, p.slug, 'while True:\n    pass', 240000)));
                check('the judge still works afterwards', /Accepted/.test(await submit(tab, p.slug, p.solution)));
            }
        }
    } catch (e) {
        failures++; console.log('  FAIL ' + e.message);
    } finally {
        if (tab) tab.close();
        chrome.kill();
        server.close();
        await wait(500);
        try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5 }); } catch (e) { /* Chrome still closing */ }
    }
    console.log(`\n${checks - failures} / ${checks} checks passed.`);
    process.exit(failures ? 1 : 0);
})();
