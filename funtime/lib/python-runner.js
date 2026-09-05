/* ============================================================
   python-runner.js — run a real Python game in the browser

   The games in funtime/pylib/ are written in ordinary Python. This file is
   the only JavaScript involved: it downloads Pyodide (CPython compiled to
   WebAssembly), loads the game's .py files into it, and then gets out of the
   way. Python does the rest — the rules, the maths AND the drawing, by
   calling the canvas straight from Python.

   To start a Python game a page calls:

       startPythonGame({
           files: ['snake_rules.py', 'snake_draw.py', 'snake_web.py'],
           setup: 'start_game()',        // Python to run once, after loading
           status: 'py-status'           // id of the element to write news into
       });
   ============================================================ */

const PYODIDE_VERSION = 'v0.26.4';
const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/' + PYODIDE_VERSION + '/full/';

/**
 * loadScript — pull a script into the page and wait for it.
 * INPUT: src — a URL. OUTPUT: a promise that resolves when it has loaded.
 */
function loadScript(src) {
    return new Promise(function (resolve, reject) {
        const tag = document.createElement('script');
        tag.src = src;
        tag.onload = resolve;
        tag.onerror = function () { reject(new Error('could not load ' + src)); };
        document.head.appendChild(tag);
    });
}

/**
 * showStatus — write a line of news onto the page while we wait.
 * INPUT: id — the element's id. text — what to say. isError — true to shout.
 */
function showStatus(id, text, isError) {
    const box = document.getElementById(id);
    if (!box) {
        return;
    }
    box.textContent = text;
    box.className = isError ? 'py-status error' : 'py-status';
}

/**
 * fetchText — read one file from the site.
 *
 * INPUT:  url — where the file is
 * OUTPUT: a promise for the text inside it
 *
 * ALGORITHM: ask the browser for it and hand back the text; if the browser
 *            refuses (which it does for files opened straight off your disk),
 *            explain that in plain English instead of a cryptic error.
 */
function fetchText(url) {
    return fetch(url).then(function (response) {
        if (!response.ok) {
            throw new Error('could not read ' + url + ' (' + response.status + ')');
        }
        return response.text();
    }).catch(function (error) {
        if (String(error.message).indexOf('Failed to fetch') !== -1) {
            throw new Error('The browser will not let this page read ' + url +
                            ' from your disk. Open the page through a web server ' +
                            '(for example: python3 -m http.server) or on the live site.');
        }
        throw error;
    });
}

/**
 * bootPython — start Pyodide and load a list of .py files into it.
 *
 * INPUT:  files — the .py file names. statusId — where to write news.
 *         folder — which folder the files live in.
 * OUTPUT: a promise for the pyodide object
 *
 * ALGORITHM:
 *   1. Say what is happening — Pyodide is a big download the first time.
 *   2. Load pyodide.js, then start the Python interpreter.
 *   3. Fetch each .py file and write it into Python's own little file system,
 *      so `import snake_rules` works exactly as it would on a computer.
 *   4. Run the setup line, which starts the game.
 */
function bootPython(files, statusId, folder) {
    showStatus(statusId, '🐍 Downloading Python… (this takes a few seconds the first time)');

    return loadScript(PYODIDE_BASE + 'pyodide.js')
        .then(function () {
            /* global loadPyodide */
            return loadPyodide({ indexURL: PYODIDE_BASE });
        })
        .then(function (pyodide) {
            showStatus(statusId, '🐍 Python is here. Loading the game…');
            const jobs = files.map(function (name) {
                return fetchText(folder + name).then(function (source) {
                    return { name: name, source: source };
                });
            });
            return Promise.all(jobs).then(function (files) {
                files.forEach(function (file) {
                    pyodide.FS.writeFile(file.name, file.source, { encoding: 'utf8' });
                });
                pyodide.runPython('import sys\nsys.path.insert(0, "")');
                return pyodide;
            });
        })
        .catch(function (error) {
            showStatus(statusId, '⚠️ ' + error.message, true);
            throw error;
        });
}

/**
 * startPythonGame — boot Python, then run the line that starts the game.
 *
 * INPUT:  options — { files, setup, status, pythonDir }
 * OUTPUT: a promise for the pyodide object (handy for testing)
 */
function startPythonGame(options) {
    const statusId = options.status || 'py-status';
    return bootPython(options.files, statusId, options.pythonDir || 'pylib/')
        .then(function (pyodide) {
            showStatus(statusId, '🐍 Running your Python game — press a key to play!');
            pyodide.runPython(options.setup);
            const box = document.getElementById(statusId);
            if (box) {
                box.className = 'py-status ready';
            }
            return pyodide;
        })
        .catch(function (error) {
            showStatus(statusId, '⚠️ ' + error.message, true);
            throw error;
        });
}
