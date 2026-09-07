/* ============================================================
   no-scroll.js — stop the arrow keys scrolling the page

   In a browser the arrow keys and the space bar scroll the page. That is
   exactly right on an ordinary page and exactly wrong in a game: press DOWN
   to duck and the whole page lurches downwards instead.

   Each game already stops the keys IT uses, by calling preventDefault. But a
   game only knows about its own keys — Breakout never uses DOWN, so nothing
   stopped it, and the page scrolled. This file closes that gap once for every
   game rather than twenty-four times over.

   TWO THINGS IT IS CAREFUL ABOUT:

     • Typing still works. If the key went to a text box the page must behave
       normally, or the workshop editor would become impossible to use.

     • Only the arrows and the space bar are stopped. Page Up, Page Down, Home
       and End are left alone, so somebody reading the help underneath the
       game can still move around with the keyboard.
   ============================================================ */

(function () {
    'use strict';

    /* The keys a game is likely to want, which would otherwise scroll. */
    const GAME_KEYS = {
        ArrowUp: true, ArrowDown: true, ArrowLeft: true, ArrowRight: true,
        ' ': true, Spacebar: true
    };

    /**
     * isTyping — is this key going into a text box?
     *
     * INPUT:  target — whatever the key was aimed at
     * OUTPUT: true if it is somewhere the reader is typing
     *
     * ALGORITHM: look at what kind of element it is. The workshop editor is a
     *            textarea and the typing game has a hidden input, and in both
     *            the arrow keys have to keep doing their ordinary job.
     */
    function isTyping(target) {
        if (!target) {
            return false;
        }
        const tag = String(target.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' ||
               target.isContentEditable === true;
    }

    document.addEventListener('keydown', function (event) {
        /* leave the browser's and the system's own shortcuts alone */
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        if (isTyping(event.target)) {
            return;
        }
        if (GAME_KEYS[event.key] === true) {
            event.preventDefault();
        }
    }, { passive: false });
})();
