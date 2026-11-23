/* Challenge Academy — the printable assignment: assignment.html?n=3
 * The PDFs in assignments/ are this page printed by tools/build-assignments.mjs. */
(function () {
    'use strict';

    const params = new URLSearchParams(location.search);
    const topic = params.get('t');
    const id = Number(params.get('n')) || 1;
    const sheet = document.getElementById('ca-sheet');

    /** A worksheet for one of the ordinary math pages: worksheets/topics/<slug>.js */
    function startTopic() {
        if (!/^[a-z0-9-]+$/.test(topic)) { sheet.textContent = 'That worksheet does not exist.'; return; }
        const s = document.createElement('script');
        s.src = `topics/${topic}.js`;
        s.onload = () => {
            const T = CA.lessons[topic];
            if (!T) { sheet.textContent = 'That worksheet does not exist.'; return; }
            document.title = `${T.title} Assignment - KidsLearn`;
            document.getElementById('ca-back').href = `../${T.page}`;
            document.getElementById('ca-pdf').href = `pdf/${topic}-assignment.pdf`;
            render(T, { title: T.title, series: `KidsLearn ${T.subject || 'Math'} · Practice Assignment`, keyTitle: T.title });
        };
        s.onerror = () => { sheet.textContent = 'That worksheet does not exist.'; };
        document.head.appendChild(s);
    }

    function start() {
        if (topic) return startTopic();
        const info = CA.info(id);
        if (!info) { sheet.textContent = 'That lesson does not exist.'; return; }
        if (!CA.isAvailable(id)) { sheet.textContent = 'This lesson is coming soon.'; return; }
        document.title = `Lesson ${id} Assignment - ${info.title} - Challenge Academy`;
        document.getElementById('ca-back').href = `lesson.html?n=${id}#assignment`;
        document.getElementById('ca-pdf').href = CA.pdfFile(id);
        const s = document.createElement('script');
        s.src = CA.lessonFile(id);
        s.onload = () => render(CA.lessons[id], { title: info.title, series: `Challenge Academy · Book ${info.book} · Lesson ${id} · Assignment`, keyTitle: `Lesson ${id}: ${info.title}` });
        s.onerror = () => { sheet.textContent = 'This lesson is not available yet.'; };
        document.head.appendChild(s);
    }

    function problemHTML(p) {
        const opts = p.ans.kind === 'mc'
            ? `<ol class="opts">${p.ans.choices.map((c, i) => `<li><span>(${'ABCDEF'[i]})</span> ${c}</li>`).join('')}</ol>` : '';
        return `<div class="ca-p${opts ? ' has-opts' : ''}"><span class="n">${p.n}.</span><div class="body">${p.q}${p.fig || ''}${opts}</div></div>`;
    }

    function render(lesson, info) {
        const problems = CA.buildAssignment(lesson);
        const cols = (lesson.assignmentCols === 1 ? ' one-col' : '') + (lesson.compact ? ' compact' : '');
        let html = `
            <div class="ca-sheet-head">
                <div class="series">${info.series}</div>
                <h1>${info.title}</h1>
            </div>
            <div class="ca-sheet-meta"><span>Name:</span><span class="narrow">Date:</span><span class="narrow">Score: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / ${problems.length}</span></div>
            <p class="ca-sheet-note">${lesson.assignmentNote || 'Show your working in the space under each problem. Give exact answers (fractions, π or square roots) unless a problem asks you to round.'} Answers are at the end.</p>`;
        let level = 0, open = false;
        for (const p of problems) {
            if (p.level !== level) {
                if (open) html += '</div>';
                level = p.level;
                html += `<h2 class="ca-part">${CA.levelNames[level]}</h2><div class="ca-problems${cols}">`;
                open = true;
            }
            html += problemHTML(p);
        }
        if (open) html += '</div>';
        html += `
            <div class="ca-key-page">
                <h2>Answer Key — ${info.keyTitle}</h2>
                <div class="ca-key-list">
                    ${problems.map(p => `<div class="k"><span class="n">${p.n}.</span><div><span class="a">${p.ans.html}</span>${p.sol ? `<span class="s">${p.sol}</span>` : ''}</div></div>`).join('')}
                </div>
            </div>`;
        sheet.innerHTML = html;
        CA.typeset(sheet);
        document.body.dataset.ready = '1';
    }

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);
})();
