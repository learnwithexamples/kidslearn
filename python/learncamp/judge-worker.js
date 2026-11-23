/* LearnCamp judge — runs a student's Python in Pyodide inside a Web Worker, so a
 * runaway loop can be stopped by terminating the worker.
 *
 *   → { id, code, input }        run `code` with `input` as stdin
 *   ← { type: 'ready' }          Python has loaded
 *   ← { id, out, err, ms }       what the program printed, any error, time taken
 */
/* global importScripts, loadPyodide */
const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
importScripts(PYODIDE_BASE + 'pyodide.js');

const HARNESS = `
import sys, io, traceback

class _Out(io.StringIO):
    LIMIT = 200_000
    def write(self, s):
        if self.tell() > self.LIMIT:
            raise RuntimeError('Output limit exceeded: your program printed far too much (an endless loop?)')
        return super().write(s)

def _lc_run(code, stdin):
    out = _Out()
    saved = sys.stdin, sys.stdout, sys.stderr
    sys.stdin, sys.stdout, sys.stderr = io.StringIO(stdin), out, out
    err = ''
    try:
        exec(compile(code, 'main.py', 'exec'), {'__name__': '__main__'})
    except SystemExit:
        pass
    except BaseException as e:
        tb = e.__traceback__.tb_next if e.__traceback__ else None   # hide this harness
        err = ''.join(traceback.format_exception(type(e), e, tb))
    finally:
        sys.stdin, sys.stdout, sys.stderr = saved
    return [out.getvalue(), err]
`;

const ready = (async () => {
    const py = await loadPyodide({ indexURL: PYODIDE_BASE });
    py.runPython(HARNESS);
    return py;
})();
ready.then(() => postMessage({ type: 'ready' }), e => postMessage({ type: 'fail', err: String(e) }));

onmessage = async (e) => {
    const { id, code, input } = e.data;
    const py = await ready;
    const t0 = performance.now();
    let out = '', err = '';
    try {
        const res = py.globals.get('_lc_run')(code, input);
        [out, err] = res.toJs();
        res.destroy();
    } catch (ex) {
        err = String(ex && ex.message || ex);
    }
    postMessage({ id, out, err, ms: Math.round(performance.now() - t0) });
};
