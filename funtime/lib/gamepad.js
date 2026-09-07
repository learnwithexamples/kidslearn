/* ============================================================
   gamepad.js — play any of these games with an Xbox controller

   There is NO DRIVER TO INSTALL. Every modern browser has the Gamepad API
   built in, and macOS pairs an Xbox Wireless Controller over Bluetooth or a
   USB cable all by itself. This one file is the whole of the support.

   THE TRICK, and it is worth understanding: none of the games know this file
   exists. Every one of them already listens for `keydown` and `keyup` on the
   document and turns the key into an action. So rather than teaching
   twenty-four games about controllers, this file turns the controller into
   KEY PRESSES and lets every game carry on exactly as it was. The Python
   games work too, because they listen to the very same document.

   That is a good habit in general: when you want to add a new way of doing
   something, look for the narrow place everything already passes through.
   ============================================================ */

(function () {
    'use strict';

    /* A stick is never perfectly still, so it has to be pushed a good way
       before it counts as pressed — and it has to come most of the way back
       before it counts as released. Two different numbers, so a stick resting
       near the line cannot chatter on and off many times a second. */
    const PRESS_AT = 0.55;
    const RELEASE_AT = 0.35;

    /* Holding a direction repeats, the way a held keyboard key does. */
    const REPEAT_AFTER = 300;
    const REPEAT_EVERY = 110;

    /**
     * BUTTON_KEYS — which key each control on the pad sends.
     *
     * The numbers come from the browser's "standard" gamepad layout, which is
     * what an Xbox controller reports. The keys are the ones the games
     * already understand, so nothing else has to change.
     */
    const BUTTON_KEYS = {
        0: ' ',            /* A      — the do-it button: fire, dig, flap, pick */
        1: 'Enter',        /* B      — the other confirm: new word, next level */
        2: 'f',            /* X      — flag, in Minesweeper                    */
        3: 'h',            /* Y      — hint, in Maze Runner                    */
        4: 'z',            /* LB     — undo, in Sokoban                        */
        5: 'n',            /* RB     — next / new                              */
        8: 'r',            /* View   — restart                                 */
        9: 'p',            /* Menu   — pause                                   */
        12: 'ArrowUp',     /* D-pad                                            */
        13: 'ArrowDown',
        14: 'ArrowLeft',
        15: 'ArrowRight'
    };

    /* Only the directions repeat while held. A held fire button firing sixty
       times a second would not be a kindness. */
    const REPEATING = {
        ArrowUp: true, ArrowDown: true, ArrowLeft: true, ArrowRight: true
    };

    /* key -> { since, lastSent } for everything currently held down */
    const held = {};
    let connected = false;
    let badge = null;
    let badgeTimer = 0;

    /**
     * sendKey — pretend somebody pressed a key.
     *
     * INPUT:  type — 'keydown' or 'keyup'. key — the key's name.
     * OUTPUT: nothing; the event goes out to the whole page
     *
     * ALGORITHM: build a real KeyboardEvent and let it loose on the document,
     *            which is exactly where every game is already listening.
     */
    function sendKey(type, key) {
        document.dispatchEvent(new KeyboardEvent(type, {
            key: key,
            bubbles: true,
            cancelable: true
        }));
    }

    /**
     * setHeld — remember that a control went down or came up, and send the key.
     *
     * INPUT:  key, isDown, now — the time in milliseconds
     * OUTPUT: nothing
     *
     * ALGORITHM: only act on the CHANGES. A control that was already down and
     *            is still down sends nothing new — except for the directions,
     *            which repeat after a pause, the way a held keyboard key does.
     */
    function setHeld(key, isDown, now) {
        const wasDown = held[key] !== undefined;

        if (isDown && !wasDown) {
            held[key] = { since: now, lastSent: now };
            sendKey('keydown', key);

        } else if (!isDown && wasDown) {
            delete held[key];
            sendKey('keyup', key);

        } else if (isDown && REPEATING[key]) {
            const record = held[key];
            const waited = now - record.since;
            const sinceLast = now - record.lastSent;
            if (waited > REPEAT_AFTER && sinceLast > REPEAT_EVERY) {
                record.lastSent = now;
                sendKey('keydown', key);
            }
        }
    }

    /**
     * axisKey — turn one stick axis into a pressed direction, or nothing.
     *
     * INPUT:  value — the axis, -1 to 1. lowKey, highKey — the two directions.
     *         alreadyHeld — which of them is currently held.
     * OUTPUT: the key that should be held, or null
     *
     * ALGORITHM: push past PRESS_AT to start; you only stop once you have come
     *            back inside RELEASE_AT. That gap is what stops the chatter.
     */
    function axisKey(value, lowKey, highKey) {
        const lowIsHeld = held[lowKey] !== undefined;
        const highIsHeld = held[highKey] !== undefined;

        if (value <= -PRESS_AT || (lowIsHeld && value <= -RELEASE_AT)) {
            return lowKey;
        }
        if (value >= PRESS_AT || (highIsHeld && value >= RELEASE_AT)) {
            return highKey;
        }
        return null;
    }

    /**
     * readPad — look at one controller and send whatever it is saying.
     * INPUT: pad, now. OUTPUT: nothing.
     */
    function readPad(pad, now) {
        /* the left stick, and the right one as well so either works */
        const acrossValue = worstOf(pad.axes[0], pad.axes[2]);
        const downValue = worstOf(pad.axes[1], pad.axes[3]);

        const across = axisKey(acrossValue, 'ArrowLeft', 'ArrowRight');
        const down = axisKey(downValue, 'ArrowUp', 'ArrowDown');

        /* every button, including the D-pad */
        const pressed = {};
        for (const index in BUTTON_KEYS) {
            const button = pad.buttons[index];
            if (button && button.pressed) {
                pressed[BUTTON_KEYS[index]] = true;
            }
        }
        if (across) { pressed[across] = true; }
        if (down) { pressed[down] = true; }

        /* send a change for every key we know about */
        for (const index in BUTTON_KEYS) {
            const key = BUTTON_KEYS[index];
            setHeld(key, pressed[key] === true, now);
        }
    }

    /**
     * worstOf — whichever of two axes is pushed further from the middle.
     * INPUT: a, b — either may be missing on a simpler pad. OUTPUT: a number.
     */
    function worstOf(a, b) {
        const first = typeof a === 'number' ? a : 0;
        const second = typeof b === 'number' ? b : 0;
        return Math.abs(first) >= Math.abs(second) ? first : second;
    }

    /** firstPad — the first controller the browser is actually reporting. */
    function firstPad() {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < pads.length; i++) {
            if (pads[i] && pads[i].connected) {
                return pads[i];
            }
        }
        return null;
    }

    /** releaseEverything — let go of every key, so nothing sticks down. */
    function releaseEverything() {
        for (const key in held) {
            delete held[key];
            sendKey('keyup', key);
        }
    }

    /** makeBadge — the little pill that says a controller has been noticed. */
    function makeBadge() {
        const pill = document.createElement('div');
        pill.style.cssText = [
            'position:fixed', 'right:14px', 'bottom:14px', 'z-index:9999',
            'background:#111', 'color:#fff', 'font:600 12px/1 ui-monospace,monospace',
            'padding:9px 13px', 'border-radius:999px', 'pointer-events:none',
            'opacity:0', 'transition:opacity .3s'
        ].join(';');
        document.body.appendChild(pill);
        return pill;
    }

    /** say — show the pill for a few seconds. */
    function say(words) {
        if (!badge) {
            if (!document.body) { return; }
            badge = makeBadge();
        }
        badge.textContent = words;
        badge.style.opacity = '1';
        window.clearTimeout(badgeTimer);
        badgeTimer = window.setTimeout(function () {
            badge.style.opacity = '0';
        }, 4000);
    }

    /**
     * poll — once every frame: is there a pad, and what is it saying?
     * ALGORITHM: the browser hands out a fresh snapshot each time, so the pad
     *            has to be fetched again every frame rather than kept.
     */
    function poll() {
        const pad = firstPad();

        if (pad && !connected) {
            connected = true;
            say('🎮 Controller ready');
        } else if (!pad && connected) {
            connected = false;
            releaseEverything();
            say('🎮 Controller unplugged');
        }

        if (pad) {
            readPad(pad, Date.now());
        }
        window.requestAnimationFrame(poll);
    }

    /* Some browsers only admit a pad exists once a button has been pressed on
       it, so this event may arrive long after the page has loaded. Either way
       the polling below notices. */
    window.addEventListener('gamepadconnected', function () { /* noticed by poll */ });
    window.addEventListener('gamepaddisconnected', releaseEverything);

    /* A pad held down when the page is hidden would stay held for ever. */
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { releaseEverything(); }
    });

    /* The controller-tester page reads this so it can show the same mapping
       this file actually uses, rather than a copy that could drift out of
       step with it. */
    window.GAMEPAD_BUTTON_KEYS = BUTTON_KEYS;

    if (navigator.getGamepads) {
        window.requestAnimationFrame(poll);
    }
})();
