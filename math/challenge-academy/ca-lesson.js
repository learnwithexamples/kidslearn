/* Challenge Academy — the lesson page: lesson.html?n=3
 * Add &debug=1 to lay every tab open and show samples of every practice
 * generator with its answer (handy when writing a lesson). */
(function () {
    'use strict';

    const params = new URLSearchParams(location.search);
    const id = Number(params.get('n')) || 1;
    const debug = params.has('debug');
    const $ = sel => document.querySelector(sel);

    const typeset = el => CA.typeset(el);

    function fail(msg) {
        $('#ca-subtitle').textContent = msg;
        $('#ca-tabs').classList.add('ca-hidden');
    }

    function start() {
        const info = CA.info(id);
        if (!info) return fail('That lesson does not exist.');
        if (!CA.isAvailable(id)) {
            $('#ca-title').textContent = `${info.icon} Lesson ${id}: ${info.title}`;
            return fail('This lesson is coming soon.');
        }
        document.title = `Lesson ${id}: ${info.title} - Challenge Academy - KidsLearn`;
        $('#ca-title').textContent = `${info.icon} Lesson ${id}: ${info.title}`;
        $('#ca-subtitle').textContent = info.blurb;

        const prev = CA.info(id - 1), next = CA.isAvailable(id + 1) ? CA.info(id + 1) : null;
        $('#ca-nav').innerHTML =
            (prev ? `<a href="lesson.html?n=${prev.id}">← Lesson ${prev.id}: ${prev.title}</a>` : '<span></span>') +
            (next ? `<a href="lesson.html?n=${next.id}">Lesson ${next.id}: ${next.title} →</a>` : '<span></span>');

        const s = document.createElement('script');
        s.src = CA.lessonFile(id);
        s.onload = () => (CA.lessons[id] ? render(CA.lessons[id], info) : fail('This lesson could not be loaded.'));
        s.onerror = () => fail('This lesson is not available yet.');
        document.head.appendChild(s);
    }

    function render(lesson, info) {
        renderTutorial(lesson);
        renderExamples(lesson);
        renderAssignment(lesson, info);
        if (debug) renderDebug(lesson); else renderPractice(lesson);

        const tabs = document.querySelectorAll('.ca-tab');
        const show = name => {
            tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
            ['tutorial', 'examples', 'practice', 'assignment'].forEach(k =>
                $('#panel-' + k).classList.toggle('ca-hidden', !debug && k !== name));
        };
        tabs.forEach(t => t.addEventListener('click', () => {
            show(t.dataset.tab);
            history.replaceState(null, '', '#' + t.dataset.tab);
        }));
        const want = location.hash.slice(1);
        show(['tutorial', 'examples', 'practice', 'assignment'].includes(want) ? want : 'tutorial');
    }

    // ── Tutorial ─────────────────────────────────────────────────────────
    function renderTutorial(lesson) {
        const el = $('#panel-tutorial');
        el.innerHTML = lesson.tutorial.map(sec =>
            `<section class="ca-section"><h2>${sec.h}</h2>${sec.html}</section>`).join('') +
            summaryHTML(lesson) +
            `<div class="ca-actions"><button class="ca-btn" data-goto="examples">Next: worked examples →</button></div>`;
        wireGoto(el);
        typeset(el);
    }

    /** The lesson at a glance: a small mind map of topics and their key points. */
    function summaryHTML(lesson) {
        if (!lesson.summary || !lesson.summary.length) return '';
        return `<section class="ca-section ca-summary"><h2>🗺️ Lesson summary</h2>
            <div class="ca-map">${lesson.summary.map((t, i) => `
                <div class="ca-map-row c${i % 4}">
                    <div class="ca-map-topic">${t.topic}</div>
                    <ul class="ca-map-points">${t.points.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>`).join('')}
            </div></section>`;
    }

    function wireGoto(el) {
        el.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
            document.querySelector(`.ca-tab[data-tab="${b.dataset.goto}"]`).click();
            window.scrollTo({ top: $('#ca-tabs').offsetTop - 10, behavior: 'smooth' });
        }));
    }

    // ── Examples ─────────────────────────────────────────────────────────
    function renderExamples(lesson) {
        const el = $('#panel-examples');
        el.innerHTML = lesson.examples.map((ex, i) => `
            <section class="ca-section ca-example">
                <h2>Example ${i + 1}${ex.title ? ': ' + ex.title : ''}</h2>
                <p class="ca-q">${ex.q}</p>
                ${ex.fig || ''}
                <div class="ca-steps${debug ? '' : ' ca-hidden'}">
                    ${ex.steps.map((st, k) => `<div class="${debug ? '' : 'ca-hidden'}"><strong>Step ${k + 1}.</strong> ${st}</div>`).join('')}
                    <div class="ca-answer${debug ? '' : ' ca-hidden'}">Answer: ${ex.answer}</div>
                </div>
                <div class="ca-actions">
                    <button class="ca-btn" data-act="step">Show next step</button>
                    <button class="ca-btn ghost" data-act="all">Show whole solution</button>
                </div>
            </section>`).join('') +
            `<div class="ca-actions"><button class="ca-btn" data-goto="practice">Next: practice →</button></div>`;
        el.querySelectorAll('.ca-example').forEach(card => {
            const box = card.querySelector('.ca-steps');
            const stepBtn = card.querySelector('[data-act="step"]');
            const reveal = all => {
                box.classList.remove('ca-hidden');
                const hidden = [...box.children].filter(c => c.classList.contains('ca-hidden'));
                (all ? hidden : hidden.slice(0, 1)).forEach(c => c.classList.remove('ca-hidden'));
                if (all || hidden.length <= 1) {
                    stepBtn.disabled = true;
                    card.querySelector('[data-act="all"]').disabled = true;
                } else if (hidden.length === 2) stepBtn.textContent = 'Show the answer';
            };
            stepBtn.addEventListener('click', () => reveal(false));
            card.querySelector('[data-act="all"]').addEventListener('click', () => reveal(true));
        });
        wireGoto(el);
        typeset(el);
    }

    // ── Practice ─────────────────────────────────────────────────────────
    const levelLabel = { 1: '⭐ Warm-up', 2: '⭐⭐ Core', 3: '⭐⭐⭐ Challenge' };

    function renderPractice(lesson) {
        const el = $('#panel-practice');
        el.innerHTML = `
            <section class="ca-section">
                <div class="ca-practice-bar">
                    <label>Skill:
                        <select id="ca-skill">
                            <option value="">Mixed — all skills</option>
                            ${lesson.practice.map(g => `<option value="${g.id}">${'⭐'.repeat(g.level || 2)} ${g.name}</option>`).join('')}
                        </select>
                    </label>
                    <span class="ca-score">Score: <span id="ca-right">0</span> / <span id="ca-total">0</span></span>
                </div>
                <div id="ca-card"></div>
            </section>`;
        const rng = CA.rng((Date.now() ^ (Math.random() * 2 ** 32)) >>> 0);
        const card = $('#ca-card');
        let cur = null, right = 0, total = 0, answered = false, picked = null, last = '';

        function next() {
            const skill = $('#ca-skill').value;
            let g, p;
            for (let i = 0; i < 20; i++) {  // avoid showing the same question twice in a row
                g = skill ? lesson.practice.find(x => x.id === skill) : rng.pick(lesson.practice);
                p = g.gen(rng);
                if (p.q !== last) break;
            }
            last = p.q;
            cur = p; answered = false; picked = null;
            const a = p.ans;
            let input;
            if (a.kind === 'mc') {
                input = `<div class="ca-choices">${a.choices.map((c, i) =>
                    `<button class="ca-choice" data-i="${i}"><b>${'ABCDEF'[i]}</b>${c}</button>`).join('')}</div>`;
            } else if (a.kind === 'root') {
                input = `<div class="ca-answer-row"><input class="small" id="ca-in1" inputmode="numeric" autocomplete="off" aria-label="number in front of the root"> √ <input class="small" id="ca-in2" inputmode="numeric" autocomplete="off" aria-label="number under the root"> ${a.unit || ''}</div>
                    <p class="ca-hint">Simplest form. No root left? Leave the second box empty.</p>`;
            } else {
                const pre = a.unit === '$' ? '$' : '';
                const post = (a.kind === 'pi' ? 'π ' : '') + (a.unit && a.unit !== '$' ? a.unit : '');
                const ph = a.kind === 'ratio' ? 'a : b' : '?';
                input = `<div class="ca-answer-row">${pre}<input id="ca-in1" ${a.kind === 'text' || a.kind === 'ratio' ? '' : 'inputmode="text"'} autocomplete="off" placeholder="${ph}" aria-label="your answer"> ${post}</div>` +
                    (a.kind === 'num' || a.kind === 'pi' ? '<p class="ca-hint">Fractions like 3/4 are fine.</p>' : '');
            }
            card.innerHTML = `
                <span class="ca-level">${levelLabel[g.level || 2]} · ${g.name}</span>
                <div class="ca-problem">${p.q}${p.fig || ''}</div>
                ${input}
                <div class="ca-feedback" id="ca-fb"></div>
                <div class="ca-steps ca-hidden" id="ca-sol"></div>
                <div class="ca-actions">
                    <button class="ca-btn" id="ca-check">✓ Check</button>
                    <button class="ca-btn ghost" id="ca-show">Show solution</button>
                    <button class="ca-btn ghost" id="ca-next">Next question →</button>
                </div>`;
            typeset(card);
            card.querySelectorAll('.ca-choice').forEach(b => b.addEventListener('click', () => {
                if (answered) return;
                picked = Number(b.dataset.i);
                card.querySelectorAll('.ca-choice').forEach(x => x.classList.toggle('selected', x === b));
            }));
            card.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }));
            $('#ca-check').addEventListener('click', check);
            $('#ca-show').addEventListener('click', () => { if (!answered) { total++; score(); } reveal(); });
            $('#ca-next').addEventListener('click', next);
            const first = card.querySelector('input');
            if (first && total > 0) first.focus();
        }

        function score() {
            $('#ca-right').textContent = right;
            $('#ca-total').textContent = total;
        }

        function reveal() {
            answered = true;
            const sol = $('#ca-sol');
            sol.innerHTML = `${cur.sol ? `<div>${cur.sol}</div>` : ''}<div class="ca-answer">Answer: ${cur.ans.html}</div>`;
            sol.classList.remove('ca-hidden');
            typeset(sol);
            if (cur.ans.kind === 'mc') card.querySelectorAll('.ca-choice').forEach(b => {
                if (Number(b.dataset.i) === cur.ans.index) b.classList.add('right');
            });
            $('#ca-check').disabled = true;
            $('#ca-show').disabled = true;
        }

        function check() {
            if (answered) return next();
            const a = cur.ans, fb = $('#ca-fb');
            let input;
            if (a.kind === 'mc') {
                if (picked == null) { fb.textContent = 'Pick an answer first.'; fb.className = 'ca-feedback bad'; return; }
                input = picked;
            } else if (a.kind === 'root') {
                input = [$('#ca-in1').value, $('#ca-in2').value];
                if (!input[0].trim() && !input[1].trim()) { fb.textContent = 'Type an answer first.'; fb.className = 'ca-feedback bad'; return; }
            } else {
                input = $('#ca-in1').value;
                if (!input.trim()) { fb.textContent = 'Type an answer first.'; fb.className = 'ca-feedback bad'; return; }
            }
            total++;
            if (CA.check(a, input)) {
                right++;
                fb.textContent = '🎉 Correct!'; fb.className = 'ca-feedback good';
            } else {
                fb.textContent = 'Not quite — study the solution below.'; fb.className = 'ca-feedback bad';
                if (a.kind === 'mc') card.querySelector(`.ca-choice[data-i="${picked}"]`).classList.add('wrong');
            }
            score();
            reveal();
        }

        $('#ca-skill').addEventListener('change', next);
        next();
    }

    // ── Assignment ───────────────────────────────────────────────────────
    function renderAssignment(lesson, info) {
        $('#panel-assignment').innerHTML = `
            <section class="ca-section">
                <h2>📄 Lesson ${lesson.id} Assignment</h2>
                <p>A printable sheet of <strong>${CA.ASSIGNMENT_SIZE} problems</strong> on ${info.title}, sorted from
                   warm-up to challenge, with a full <strong>answer key</strong> on the last pages. Download it, print
                   it, and work through it away from the screen.</p>
                <div class="ca-actions" style="margin-top:16px;">
                    <a class="ca-btn" href="${CA.pdfFile(lesson.id)}" download>⬇ Download assignment (PDF)</a>
                    <a class="ca-btn ghost" href="assignment.html?n=${lesson.id}" target="_blank" rel="noopener">Open printable page</a>
                </div>
                <div class="ca-tip" style="margin-top:18px;"><strong>How to use it:</strong> do Part A without help, check
                   your answers, then move on. If a Part C problem beats you, read its solution in the key, close the
                   key, and try it again tomorrow.</div>
            </section>`;
    }

    // ── Debug: samples of every generator ────────────────────────────────
    function renderDebug(lesson) {
        const el = $('#panel-practice');
        const rng = CA.rng(12345);
        el.innerHTML = lesson.practice.map(g => {
            let html = `<section class="ca-section"><h2>${g.id} — ${g.name} (level ${g.level || 2})</h2>`;
            for (let i = 0; i < 3; i++) {
                const p = g.gen(rng);
                html += `<div class="ca-problem" style="border-top:1px solid #ddd;padding-top:8px;margin-top:8px;">${p.q}${p.fig || ''}` +
                    (p.ans.kind === 'mc' ? `<div class="ca-choices">${p.ans.choices.map((c, k) => `<div class="ca-choice"><b>${'ABCDEF'[k]}</b>${c}</div>`).join('')}</div>` : '') +
                    `<div class="ca-steps"><div>${p.sol || ''}</div><div class="ca-answer">Answer: ${p.ans.html}</div></div></div>`;
            }
            return html + '</section>';
        }).join('');
        typeset(el);
    }

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);
})();
