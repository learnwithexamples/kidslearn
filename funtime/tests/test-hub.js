/* ============================================================
   test-hub.js — the Fun Time hub and its four tabs.

       node funtime/tests/test-hub.js

   The hub is the front door: if it is wrong, nothing else gets found. This
   checks the four tabs are wired to four panels, that exactly one is showing
   to begin with, that every game appears in the right one — and then runs the
   page's own switching code against a pretend browser to make sure clicking a
   tab really does swap the panels over.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HUB = fs.readFileSync(path.join(__dirname, '..', 'funtime.html'), 'utf8');

let failures = 0;
let checks = 0;

function check(name, ok, detail) {
    checks++;
    if (ok) {
        console.log('  ok    ' + name);
    } else {
        failures++;
        console.log('  FAIL  ' + name + (detail !== undefined ? '  -> ' + JSON.stringify(detail) : ''));
    }
}

const KEYS = ['play', 'build', 'play-python', 'build-python'];

/** panelOf — the slice of HTML belonging to one tab's panel. */
function panelOf(key) {
    const start = HUB.indexOf('id="panel-' + key + '"');
    if (start === -1) { return ''; }
    const end = HUB.indexOf('</section>', start);
    return HUB.slice(start, end);
}

console.log('\nthe four tabs:');

KEYS.forEach(function (key) {
    check('there is a tab and a panel for "' + key + '"',
          HUB.indexOf('data-tab="' + key + '"') !== -1 &&
          HUB.indexOf('id="panel-' + key + '"') !== -1);
});

check('there are exactly four tabs',
      (HUB.match(/class="tab" role="tab"/g) || []).length === 4,
      (HUB.match(/class="tab" role="tab"/g) || []).length);

/** openingTag — just the <section ...> tag of one panel, not its contents. */
function openingTag(key) {
    const start = HUB.indexOf('<section class="tab-panel" id="panel-' + key + '"');
    return start === -1 ? '' : HUB.slice(start, HUB.indexOf('>', start) + 1);
}

/* only the first panel may be open when the page loads, or the reader sees
   ninety-seven cards at once - which is the mess this replaced */
const openPanels = KEYS.filter(key => !/\shidden\s*>/.test(openingTag(key)));
check('exactly one panel is showing to begin with', openPanels.length === 1, openPanels);
check('and it is the play tab', openPanels[0] === 'play', openPanels);

console.log('\nwhat is in each tab:');

/* every game page on disk has to be reachable from the hub, and from the
   RIGHT tab - a Python build page in the JavaScript play tab helps nobody */
const rules = [
    ['play', name => !name.includes('-build') && !name.includes('-python')],
    ['build', name => name.endsWith('-build.html') && !name.includes('-python')],
    ['play-python', name => name.endsWith('-python.html')],
    ['build-python', name => name.endsWith('-python-build.html')]
];

const pages = fs.readdirSync(path.join(__dirname, '..'))
    .filter(n => n.endsWith('.html') && n !== 'funtime.html' && n !== 'gamepad-test.html');

rules.forEach(function ([key, belongs]) {
    const panel = panelOf(key);
    const want = pages.filter(belongs).sort();
    const absent = want.filter(name => panel.indexOf('href="' + name + '"') === -1);
    check(key.padEnd(13) + ' lists all ' + want.length + ' of its pages', absent.length === 0, absent);
});

/* and nothing should be listed twice across the whole page */
const linked = (HUB.match(/href="([a-z0-9-]+\.html)"/g) || [])
    .map(h => h.slice(6, -1))
    .filter(n => n !== 'funtime.html' && n !== 'gamepad-test.html');
const twice = linked.filter((n, i) => linked.indexOf(n) !== i);
check('no game is listed in two tabs', twice.length === 0, Array.from(new Set(twice)));

console.log('\nclicking the tabs:');
{
    /* a pretend browser, just big enough to run the hub's own switching code */
    const elements = {};
    const tabs = KEYS.map(function (key) {
        return {
            dataset: { tab: key },
            attributes: { 'aria-selected': key === 'play' ? 'true' : 'false' },
            setAttribute(name, value) { this.attributes[name] = value; },
            getAttribute(name) { return this.attributes[name]; },
            addEventListener(type, fn) { this.handlers = this.handlers || {}; this.handlers[type] = fn; },
            focus() { /* nothing to do */ }
        };
    });
    KEYS.forEach(function (key, i) {
        elements['panel-' + key] = { hidden: i !== 0 };
    });

    const bar = { addEventListener(type, fn) { this.handlers = { [type]: fn }; } };
    const store = {};

    const sandbox = {
        console, Array,
        document: {
            querySelectorAll: () => tabs,
            querySelector: () => bar,
            getElementById: id => elements[id]
        },
        window: {
            localStorage: {
                getItem: k => (k in store ? store[k] : null),
                setItem: (k, v) => { store[k] = v; }
            },
            location: { hash: '' },
            scrollTo() { /* nothing to do */ }
        }
    };
    vm.createContext(sandbox);

    const script = HUB.slice(HUB.indexOf('<script>') + 8, HUB.lastIndexOf('</script>'));
    vm.runInContext(script, sandbox);

    const showing = () => KEYS.filter(k => !elements['panel-' + k].hidden);

    check('the play tab is open at the start', showing().join() === 'play', showing());

    tabs[3].handlers.click();              /* click "Build - Python" */
    check('clicking a tab opens its panel', showing().join() === 'build-python', showing());
    check('and closes the others', showing().length === 1, showing());
    check('the clicked tab is marked as chosen',
          tabs[3].getAttribute('aria-selected') === 'true' &&
          tabs[0].getAttribute('aria-selected') === 'false');
    check('the choice is remembered for next time', store['funtime-tab'] === 'build-python', store);

    bar.handlers.keydown({ key: 'ArrowRight', preventDefault() {} });
    check('the right arrow walks on to the next tab', showing().join() === 'play', showing());

    bar.handlers.keydown({ key: 'ArrowLeft', preventDefault() {} });
    check('the left arrow walks back', showing().join() === 'build-python', showing());
}

console.log('\ndeep links:');
{
    ['#build', '#play-python', '#nonsense'].forEach(function (hash) {
        const elements = {};
        const tabs = KEYS.map(key => ({
            dataset: { tab: key }, attributes: {},
            setAttribute(n, v) { this.attributes[n] = v; },
            getAttribute(n) { return this.attributes[n]; },
            addEventListener() {}, focus() {}
        }));
        KEYS.forEach((key, i) => { elements['panel-' + key] = { hidden: i !== 0 }; });
        const store = {};
        const sandbox = {
            console, Array,
            document: {
                querySelectorAll: () => tabs,
                querySelector: () => ({ addEventListener() {} }),
                getElementById: id => elements[id]
            },
            window: {
                localStorage: { getItem: k => (k in store ? store[k] : null),
                                setItem: (k, v) => { store[k] = v; } },
                location: { hash: hash },
                scrollTo() {}
            }
        };
        vm.createContext(sandbox);
        vm.runInContext(HUB.slice(HUB.indexOf('<script>') + 8, HUB.lastIndexOf('</script>')), sandbox);
        const open = KEYS.filter(k => !elements['panel-' + k].hidden);
        const expected = hash === '#nonsense' ? 'play' : hash.slice(1);
        check('funtime.html' + hash + ' opens the ' + expected + ' tab',
              open.join() === expected, open);
    });
}

console.log('\n' + checks + ' checks run');
console.log(failures === 0 ? 'ALL HUB TESTS PASSED' : failures + ' TEST(S) FAILED');
process.exit(failures === 0 ? 0 : 1);
