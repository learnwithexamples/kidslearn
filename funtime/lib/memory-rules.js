/* ============================================================
   memory-rules.js — the rules of Memory Match

   Sixteen cards lie face down in a 4 x 4 grid. Behind them are eight pairs of
   symbols. Turn two cards over: if they match they stay up, and if they do not
   they turn back down. Find every pair to win.

   A CARD is an object:

       { symbol: 3, faceUp: false, matched: false }

   The whole board is one flat LIST of sixteen cards, read left to right and
   top to bottom — so the card in column 2 of row 1 is at index 1 * 4 + 2 = 6.

   Nothing here draws anything or reads the keyboard.
   ============================================================ */

/** The board is 4 columns by 4 rows, so eight pairs. */
const GRID_COLUMNS = 4;
const GRID_ROWS = 4;
const PAIR_COUNT = (GRID_COLUMNS * GRID_ROWS) / 2;

/** How long the two wrong cards stay up before turning back, in milliseconds. */
const PEEK_MS = 900;

/**
 * cardIndex — turn a column and row into a place in the list.
 *
 * INPUT:  column — 0 to 3, left to right. row — 0 to 3, top to bottom.
 * OUTPUT: the position of that card in the flat list of sixteen
 *
 * ALGORITHM: every row holds GRID_COLUMNS cards, so skip that many for each
 *            whole row, then add the column: row * GRID_COLUMNS + column.
 *
 * This little sum turns a grid into a list, and it appears in almost every
 * game that has a board.
 */
function cardIndex(column, row) {
    return row * GRID_COLUMNS + column;
}

/**
 * shuffle — mix a list into a random order.
 *
 * INPUT:  items — an array
 * OUTPUT: a NEW array holding the same items in a random order
 *
 * ALGORITHM (Fisher-Yates): copy the list, then walk it backwards swapping
 *            each item with a random one at or before it.
 */
function shuffle(items) {
    const mixed = items.slice();
    for (let i = mixed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const keep = mixed[i];
        mixed[i] = mixed[j];
        mixed[j] = keep;
    }
    return mixed;
}

/**
 * createDeck — build the sixteen shuffled cards.
 *
 * INPUT:  none
 * OUTPUT: an array of 16 cards, every symbol from 0 to 7 appearing exactly twice
 *
 * ALGORITHM:
 *   1. Make a list with every symbol number twice.
 *   2. Shuffle it.
 *   3. Turn each symbol into a card object that starts face down and unmatched.
 */
function createDeck() {
    const symbols = [];
    for (let symbol = 0; symbol < PAIR_COUNT; symbol++) {
        symbols.push(symbol);
        symbols.push(symbol);
    }
    return shuffle(symbols).map(function (symbol) {
        return { symbol: symbol, faceUp: false, matched: false };
    });
}

/**
 * createGame — start a brand-new game.
 *
 * INPUT:  none
 * OUTPUT: the game state:
 *           cards    — the sixteen cards
 *           picked   — the indexes of the cards turned up this turn (0, 1 or 2)
 *           moves    — how many pairs have been tried
 *           pairs    — how many pairs have been found
 *           peekTimer— counts down while two wrong cards are showing
 *           cursor   — where the keyboard cursor is, { column, row }
 *           isOver   — true once every pair is found
 */
function createGame() {
    return {
        cards: createDeck(),
        picked: [],
        moves: 0,
        pairs: 0,
        peekTimer: 0,
        cursor: { column: 0, row: 0 },
        isOver: false,
        isPaused: false
    };
}

/**
 * canFlip — may this card be turned over right now?
 *
 * INPUT:  state — the game. index — which card.
 * OUTPUT: true if the card can be turned up
 *
 * ALGORITHM: you cannot turn a card that is already up or already matched,
 *            you cannot turn a third card, and nothing moves while the two
 *            wrong cards are still showing.
 */
function canFlip(state, index) {
    if (state.isOver || state.peekTimer > 0 || state.picked.length >= 2) {
        return false;
    }
    const card = state.cards[index];
    return card !== undefined && !card.faceUp && !card.matched;
}

/**
 * flipCard — turn one card face up.
 *
 * INPUT:  state — the game. index — which card.
 * OUTPUT: true if the card was turned over
 *
 * ALGORITHM:
 *   1. If canFlip says no, do nothing and answer false.
 *   2. Turn the card face up and remember it in state.picked.
 *   3. If that was the second card, this counts as a move: add one, and check
 *      for a match — a matching pair stays up, a wrong pair starts the timer
 *      that will turn them back down.
 */
function flipCard(state, index) {
    if (!canFlip(state, index)) {
        return false;
    }

    state.cards[index].faceUp = true;
    state.picked.push(index);

    if (state.picked.length === 2) {
        state.moves = state.moves + 1;
        if (isMatch(state)) {
            keepMatch(state);
        } else {
            state.peekTimer = PEEK_MS;
        }
    }
    return true;
}

/**
 * isMatch — do the two picked cards show the same symbol?
 *
 * INPUT:  state — the game
 * OUTPUT: true if exactly two cards are picked and their symbols are equal
 *
 * ALGORITHM: look up both cards in state.cards and compare their symbols.
 */
function isMatch(state) {
    if (state.picked.length !== 2) {
        return false;
    }
    const first = state.cards[state.picked[0]];
    const second = state.cards[state.picked[1]];
    return first.symbol === second.symbol;
}

/**
 * keepMatch — the two cards match, so they stay up for good.
 *
 * INPUT:  state — the game
 * OUTPUT: nothing
 *
 * ALGORITHM: mark both cards matched, empty the picked list, count the pair,
 *            and if that was the last pair the game is won.
 */
function keepMatch(state) {
    state.picked.forEach(function (index) {
        state.cards[index].matched = true;
    });
    state.picked = [];
    state.pairs = state.pairs + 1;
    if (isGameWon(state)) {
        state.isOver = true;
    }
}

/**
 * hideUnmatched — turn the two wrong cards back face down.
 *
 * INPUT:  state — the game
 * OUTPUT: nothing
 *
 * ALGORITHM: for every picked card that is not matched, set faceUp back to
 *            false; then empty the picked list and stop the timer.
 */
function hideUnmatched(state) {
    state.picked.forEach(function (index) {
        if (!state.cards[index].matched) {
            state.cards[index].faceUp = false;
        }
    });
    state.picked = [];
    state.peekTimer = 0;
}

/**
 * isGameWon — has every pair been found?
 *
 * INPUT:  state — the game
 * OUTPUT: true if all sixteen cards are matched
 *
 * ALGORITHM: check every card; if any is still unmatched the answer is false.
 */
function isGameWon(state) {
    for (let i = 0; i < state.cards.length; i++) {
        if (!state.cards[i].matched) {
            return false;
        }
    }
    return true;
}

/**
 * starsForMoves — how well did the player do?
 *
 * INPUT:  moves — how many pairs were tried
 * OUTPUT: 3, 2 or 1 star
 *
 * ALGORITHM: eight pairs cannot be found in fewer than eight moves, so
 *            12 moves or fewer is 3 stars, 18 or fewer is 2 stars, and
 *            anything else is 1 star. Everybody gets at least one star.
 */
function starsForMoves(moves) {
    if (moves <= 12) {
        return 3;
    }
    if (moves <= 18) {
        return 2;
    }
    return 1;
}

/**
 * updateGame — let time pass (called about 60 times a second).
 *
 * INPUT:  state — the game. elapsedMs — milliseconds since the last call.
 * OUTPUT: nothing
 *
 * ALGORITHM: if two wrong cards are showing, count the timer down; when it
 *            reaches zero, turn them back over.
 */
function updateGame(state, elapsedMs) {
    if (state.isOver || state.isPaused) {
        return;
    }
    if (state.peekTimer > 0) {
        state.peekTimer = state.peekTimer - elapsedMs;
        if (state.peekTimer <= 0) {
            hideUnmatched(state);
        }
    }
}

/**
 * moveCursor — move the keyboard cursor around the grid.
 *
 * INPUT:  state — the game. dx, dy — the step to take.
 * OUTPUT: nothing
 *
 * ALGORITHM: add the step, then keep the cursor on the board by clamping it
 *            between 0 and the last column or row.
 */
function moveCursor(state, dx, dy) {
    const column = state.cursor.column + dx;
    const row = state.cursor.row + dy;
    state.cursor.column = Math.max(0, Math.min(GRID_COLUMNS - 1, column));
    state.cursor.row = Math.max(0, Math.min(GRID_ROWS - 1, row));
}

/**
 * togglePause — freeze or unfreeze the game.
 * INPUT: state. OUTPUT: nothing.
 */
function togglePause(state) {
    if (!state.isOver) {
        state.isPaused = !state.isPaused;
    }
}

/**
 * actionForKey — turn a keyboard key into the name of a game action.
 *
 * INPUT:  key — the key name from the browser
 * OUTPUT: 'up', 'down', 'left', 'right', 'flip', 'pause', 'restart' — or null
 *
 * ALGORITHM: lowercase the key, then look it up.
 */
function actionForKey(key) {
    const k = String(key).toLowerCase();

    if (k === 'arrowup' || k === 'w') { return 'up'; }
    if (k === 'arrowdown' || k === 's') { return 'down'; }
    if (k === 'arrowleft' || k === 'a') { return 'left'; }
    if (k === 'arrowright' || k === 'd') { return 'right'; }
    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'flip'; }
    if (k === 'p') { return 'pause'; }
    if (k === 'r') { return 'restart'; }

    return null;
}
