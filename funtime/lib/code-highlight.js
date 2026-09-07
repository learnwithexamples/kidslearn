/* ============================================================
   code-highlight.js — colours in the workshop editor

   A textarea cannot colour its own text, so this does the usual trick: a
   <pre> sits exactly underneath holding a coloured copy of the code, and the
   textarea on top is made see-through apart from its cursor. Line them up
   with the same font, size and padding and the two layers look like one
   editor.

   No library, no download — the whole highlighter is the table of rules
   below. It knows JavaScript and Python, which is all these pages need.
   ============================================================ */

(function () {
    'use strict';

    /* Every rule is one bracketed group in one big pattern. Whichever group
       matched names the colour, so the order here is the priority order:
       comments and strings come first, because a keyword inside a string is
       not a keyword. */
    function rules(parts) {
        return {
            pattern: new RegExp(parts.map(function (p) { return '(' + p[1] + ')'; }).join('|'), 'g'),
            classes: parts.map(function (p) { return p[0]; })
        };
    }

    const JS_KEYWORDS = 'const|let|var|function|return|if|else|for|while|do|break|continue|' +
        'new|typeof|instanceof|in|of|this|null|true|false|undefined|class|extends|super|' +
        'throw|try|catch|finally|switch|case|default|delete|void|yield|async|await|=>';

    const JS_BUILTINS = 'Math|JSON|Object|Array|String|Number|Boolean|Date|Error|' +
        'window|document|console|parseInt|parseFloat|isNaN|localStorage';

    const PY_KEYWORDS = 'def|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|' +
        'import|from|class|try|except|finally|raise|with|as|pass|break|continue|lambda|' +
        'global|nonlocal|assert|del|yield';

    const PY_BUILTINS = 'len|range|int|float|str|list|dict|tuple|set|bool|abs|min|max|sum|' +
        'sorted|reversed|enumerate|zip|round|print|any|all|isinstance|math|random';

    const LANGUAGES = {
        javascript: rules([
            ['comment', '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/'],
            ['string', "'(?:\\\\.|[^'\\\\\\n])*'|\"(?:\\\\.|[^\"\\\\\\n])*\"|`(?:\\\\.|[^`\\\\])*`"],
            ['number', '\\b\\d+(?:\\.\\d+)?\\b'],
            ['keyword', '\\b(?:' + JS_KEYWORDS + ')\\b'],
            ['builtin', '\\b(?:' + JS_BUILTINS + ')\\b'],
            ['constant', '\\b[A-Z][A-Z0-9_]+\\b'],
            ['call', '[A-Za-z_$][\\w$]*(?=\\s*\\()']
        ]),
        python: rules([
            ['comment', '#[^\\n]*'],
            ['string', '"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|' +
                       "'(?:\\\\.|[^'\\\\\\n])*'|\"(?:\\\\.|[^\"\\\\\\n])*\""],
            ['number', '\\b\\d+(?:\\.\\d+)?\\b'],
            ['keyword', '\\b(?:' + PY_KEYWORDS + ')\\b'],
            ['builtin', '\\b(?:' + PY_BUILTINS + ')\\b'],
            ['constant', '\\b[A-Z][A-Z0-9_]+\\b'],
            ['call', '[A-Za-z_][\\w]*(?=\\s*\\()']
        ])
    };

    /** escapeHtml — text into a <pre> has to stop being markup first. */
    function escapeHtml(text) {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /**
     * highlight — colour one piece of code.
     *
     * INPUT:  code — the text. language — 'javascript' or 'python'.
     * OUTPUT: HTML, with a <span> round every word worth a colour.
     *
     * ALGORITHM: walk the code with one pattern. Everything between matches
     *            is plain text; every match is wrapped in the span its group
     *            names. Both halves are escaped, so code can never become
     *            markup by accident.
     */
    function highlight(code, language) {
        const rule = LANGUAGES[language] || LANGUAGES.javascript;
        let out = '';
        let last = 0;
        let found;

        rule.pattern.lastIndex = 0;
        while ((found = rule.pattern.exec(code)) !== null) {
            out += escapeHtml(code.slice(last, found.index));
            let cls = 'plain';
            for (let i = 1; i < found.length; i++) {
                if (found[i] !== undefined) { cls = rule.classes[i - 1]; break; }
            }
            out += '<span class="tok-' + cls + '">' + escapeHtml(found[0]) + '</span>';
            last = found.index + found[0].length;
        }
        return out + escapeHtml(code.slice(last));
    }

    /**
     * attach — keep a <pre> showing a coloured copy of a textarea.
     *
     * INPUT:  textarea, pre — the two layers. language — which rules to use.
     * OUTPUT: { refresh } — call refresh() after changing the value in code.
     *
     * ALGORITHM: on every edit, re-colour, then grow the textarea to fit its
     *            own text. Growing it means it never needs a scrollbar, and
     *            without a scrollbar the two layers cannot drift apart.
     */
    function attach(textarea, pre, language) {
        if (!textarea || !pre) {
            return { refresh: function () {} };
        }
        let last = null;

        function fitHeight() {
            /* Guard for test harnesses, where a fake element has no height. */
            if (typeof textarea.scrollHeight !== 'number') { return; }
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }

        function refresh() {
            const code = textarea.value;
            if (code === last) { return; }
            last = code;
            /* The trailing newline keeps the final blank line tall enough. */
            pre.innerHTML = highlight(code, language) + '\n';
            fitHeight();
        }

        textarea.addEventListener('input', refresh);
        refresh();
        return { refresh: refresh };
    }

    window.CodeHighlight = { highlight: highlight, attach: attach, LANGUAGES: LANGUAGES };
})();
