/* ============================================================
   memory-steps.js - the 9 steps of "Build Memory Match"

   Each step teaches one function. Every test is a few lines of real
   JavaScript ending in an assert, so a failing test explains itself.
   ============================================================ */

const MEMORY_STEPS = [
    {
        "id": "card_index",
        "fnName": "cardIndex",
        "title": "Number the squares",
        "adds": "The board has places to put cards.",
        "intro": "<p>Sixteen cards lie in a 4 x 4 grid, but they are stored as one flat <strong>list</strong> of sixteen. So the game needs a way to turn \"column 2, row 1\" into \"card number 6\".</p><pre class=\"mini-code\"> 0  1  2  3\n 4  5  6  7\n 8  9 10 11\n12 13 14 15</pre><p>Every row holds GRID_COLUMNS cards, so skipping a whole row means skipping that many places.</p>",
        "spec": {
            "input": "column - 0 to 3, left to right. row - 0 to 3, top to bottom.",
            "output": "the position of that card in the flat list of sixteen",
            "algorithm": [
                "Skip a whole row of cards for every row above this one: row * GRID_COLUMNS.",
                "Add the column.",
                "Return the answer."
            ]
        },
        "starter": "function cardIndex(column, row) {\n    // skip whole rows, then add the column\n}\n",
        "answer": "function cardIndex(column, row) {\n    return row * GRID_COLUMNS + column;\n}\n",
        "hints": [
            "The whole function is one line.",
            "Skipping `row` rows means skipping row * GRID_COLUMNS cards.",
            "return row * GRID_COLUMNS + column;"
        ],
        "tests": [
            {
                "name": "The first card is number 0",
                "code": "assert(cardIndex(0, 0) === 0, 'cardIndex(0,0) gave ' + cardIndex(0, 0));"
            },
            {
                "name": "Column 2 of row 1 is number 6",
                "code": "assert(cardIndex(2, 1) === 6, 'cardIndex(2,1) gave ' + cardIndex(2, 1) + ', expected 6');"
            },
            {
                "name": "The last card is number 15",
                "code": "assert(cardIndex(3, 3) === 15, 'cardIndex(3,3) gave ' + cardIndex(3, 3));"
            },
            {
                "name": "Moving one column right adds 1",
                "code": "assert(cardIndex(1, 2) - cardIndex(0, 2) === 1, 'one step right should add 1');"
            },
            {
                "name": "Moving one row down adds a whole row",
                "code": "assert(cardIndex(0, 2) - cardIndex(0, 1) === GRID_COLUMNS, 'one step down should add GRID_COLUMNS');"
            },
            {
                "name": "Every square gets a different number",
                "code": "const seen = {};\nfor (let r = 0; r < GRID_ROWS; r++) { for (let c = 0; c < GRID_COLUMNS; c++) { seen[cardIndex(c, r)] = true; } }\nassert(Object.keys(seen).length === 16, 'only ' + Object.keys(seen).length + ' different numbers - two squares share one');"
            }
        ],
        "demo": {
            "kind": "grid",
            "caption": "Your function numbers every square on the board."
        }
    },
    {
        "id": "create_deck",
        "fnName": "createDeck",
        "title": "Deal the cards",
        "adds": "The cards exist — eight pairs, shuffled.",
        "intro": "<p>Eight symbols, each on two cards, mixed into a random order. A card remembers three things: which symbol it hides, whether it is face up, and whether it has been matched.</p>",
        "spec": {
            "input": "nothing",
            "output": "a list of 16 cards, every symbol from 0 to PAIR_COUNT-1 appearing exactly twice, in a random order",
            "algorithm": [
                "Build a list holding every symbol number twice.",
                "Shuffle it.",
                "Turn each symbol into a card that starts face down and unmatched."
            ]
        },
        "starter": "function createDeck() {\n    // every symbol twice, shuffled, turned into cards\n}\n",
        "answer": "function createDeck() {\n    const symbols = [];\n    for (let symbol = 0; symbol < PAIR_COUNT; symbol++) {\n        symbols.push(symbol);\n        symbols.push(symbol);\n    }\n    return shuffle(symbols).map(function (symbol) {\n        return { symbol: symbol, faceUp: false, matched: false };\n    });\n}\n",
        "hints": [
            "Push each symbol number twice inside a loop.",
            "shuffle(list) is written for you and returns a mixed copy.",
            "Turn the shuffled numbers into objects: { symbol: symbol, faceUp: false, matched: false }"
        ],
        "tests": [
            {
                "name": "There are sixteen cards",
                "code": "const deck = createDeck();\nassert(deck.length === 16, 'got ' + deck.length + ' cards');"
            },
            {
                "name": "Every card starts face down and unmatched",
                "code": "const deck = createDeck();\nassert(deck.every(c => c.faceUp === false && c.matched === false), 'a card started face up or matched');"
            },
            {
                "name": "Every symbol appears exactly twice",
                "code": "const counts = {};\ncreateDeck().forEach(c => { counts[c.symbol] = (counts[c.symbol] || 0) + 1; });\nassert(Object.keys(counts).length === PAIR_COUNT, 'expected ' + PAIR_COUNT + ' different symbols, got ' + Object.keys(counts).length);\nassert(Object.values(counts).every(n => n === 2), 'some symbol does not appear exactly twice');"
            },
            {
                "name": "The symbols are 0 up to PAIR_COUNT - 1",
                "code": "assert(createDeck().every(c => c.symbol >= 0 && c.symbol < PAIR_COUNT), 'a symbol was out of range');"
            },
            {
                "name": "The deck really is shuffled",
                "code": "const first = createDeck().map(c => c.symbol).join('');\nlet different = false;\nfor (let i = 0; i < 20; i++) { if (createDeck().map(c => c.symbol).join('') !== first) { different = true; } }\nassert(different, 'twenty decks came out in the same order - did you shuffle?');"
            }
        ],
        "demo": {
            "kind": "deck",
            "caption": "Your deck, dealt face up so you can check the pairs."
        }
    },
    {
        "id": "is_match",
        "fnName": "isMatch",
        "title": "Do they match?",
        "adds": "The game can tell a pair from a miss.",
        "intro": "<p>When two cards are face up the game asks one question: are they the same symbol?</p><p>The two turned-up cards are remembered in <code>picked</code>, a list of their <em>positions</em> in the deck — so look each one up before comparing.</p>",
        "spec": {
            "input": "state - the game",
            "output": "True if exactly two cards are picked and their symbols are equal",
            "algorithm": [
                "If there are not exactly two picked cards, the answer is False.",
                "Look up both cards in the deck using the numbers in picked.",
                "Return whether their symbols are equal."
            ]
        },
        "starter": "function isMatch(state) {\n    // exactly two picked cards, showing the same symbol?\n}\n",
        "answer": "function isMatch(state) {\n    if (state.picked.length !== 2) {\n        return false;\n    }\n    const first = state.cards[state.picked[0]];\n    const second = state.cards[state.picked[1]];\n    return first.symbol === second.symbol;\n}\n",
        "hints": [
            "Deal with the \"not two cards\" case first and return false.",
            "state.cards[state.picked[0]] is the first turned-up card.",
            "Compare the two symbols with ==="
        ],
        "tests": [
            {
                "name": "Two of the same symbol match",
                "code": "const state = { cards: [{symbol: 3}, {symbol: 3}], picked: [0, 1] };\nassert(isMatch(state) === true, 'two 3s should match');"
            },
            {
                "name": "Two different symbols do not",
                "code": "const state = { cards: [{symbol: 3}, {symbol: 5}], picked: [0, 1] };\nassert(isMatch(state) === false, 'a 3 and a 5 should not match');"
            },
            {
                "name": "One card picked is not a match",
                "code": "assert(isMatch({ cards: [{symbol: 1}], picked: [0] }) === false, 'one card cannot be a pair');"
            },
            {
                "name": "No cards picked is not a match",
                "code": "assert(isMatch({ cards: [], picked: [] }) === false, 'nothing picked cannot be a pair');"
            },
            {
                "name": "It looks the cards up, wherever they are",
                "code": "const state = { cards: [{symbol: 0}, {symbol: 7}, {symbol: 2}, {symbol: 7}], picked: [1, 3] };\nassert(isMatch(state) === true, 'cards 1 and 3 are both 7s');"
            }
        ],
        "demo": {
            "kind": "pair",
            "caption": "Change the two symbols and watch your function decide."
        }
    },
    {
        "id": "can_flip",
        "fnName": "canFlip",
        "title": "What may be turned over?",
        "adds": "The game stops you cheating.",
        "intro": "<p>Not every card may be turned over. You cannot turn one that is already up, or one that has been matched, or a third card while two are showing — and nothing moves while the game is paused, finished, or while the two wrong cards are still being looked at.</p>",
        "spec": {
            "input": "state - the game. index - which card.",
            "output": "True if that card may be turned face up right now",
            "algorithm": [
                "Say no if the game is over or paused.",
                "Say no while the peek timer is still running, or two cards are already picked.",
                "Say no if the index is not a real card.",
                "Otherwise say yes when the card is neither face up nor matched."
            ]
        },
        "starter": "function canFlip(state, index) {\n    // four reasons to say no, then yes\n}\n",
        "answer": "function canFlip(state, index) {\n    if (state.isOver || state.isPaused) {\n        return false;\n    }\n    if (state.peekTimer > 0 || state.picked.length >= 2) {\n        return false;\n    }\n    const card = state.cards[index];\n    if (card === undefined) {\n        return false;\n    }\n    return !card.faceUp && !card.matched;\n}\n",
        "hints": [
            "Write the four \"no\" checks first, each returning false.",
            "state.cards[index] is undefined when the index is not a real card.",
            "The last line is: return !card.faceUp && !card.matched;"
        ],
        "tests": [
            {
                "name": "A fresh face-down card may be turned",
                "code": "const state = createGame();\nassert(canFlip(state, 0) === true, 'the first card of a new game should be flippable');"
            },
            {
                "name": "A card that is already face up may not",
                "code": "const state = createGame();\nstate.cards[0].faceUp = true;\nassert(canFlip(state, 0) === false, 'it is already up');"
            },
            {
                "name": "A matched card may not",
                "code": "const state = createGame();\nstate.cards[0].matched = true;\nassert(canFlip(state, 0) === false, 'it has already been found');"
            },
            {
                "name": "A third card may not be turned",
                "code": "const state = createGame();\nstate.picked = [1, 2];\nassert(canFlip(state, 0) === false, 'only two cards at a time');"
            },
            {
                "name": "Nothing may be turned while the wrong pair is showing",
                "code": "const state = createGame();\nstate.peekTimer = 500;\nassert(canFlip(state, 0) === false, 'wait for the cards to turn back');"
            },
            {
                "name": "Nothing may be turned when the game is over or paused",
                "code": "const over = createGame(); over.isOver = true;\nconst paused = createGame(); paused.isPaused = true;\nassert(canFlip(over, 0) === false && canFlip(paused, 0) === false, 'a finished or paused game does not move');"
            },
            {
                "name": "A card that does not exist may not be turned",
                "code": "assert(canFlip(createGame(), 99) === false, 'there is no card 99');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Try to break the rules — your function will not let you."
        }
    },
    {
        "id": "flip_card",
        "fnName": "flipCard",
        "title": "Turn a card over",
        "adds": "The game can be played!",
        "intro": "<p>This is the move itself. Turn the card face up, remember it, and if it was the second one, count the move and see whether it is a pair.</p><p>Two helpers are already written: <code>keepMatch</code> makes a pair stay up for good, and the peek timer turns a wrong pair back down a moment later.</p>",
        "spec": {
            "input": "state - the game. index - which card.",
            "output": "True if the card was turned over",
            "algorithm": [
                "If can-flip says no, do nothing and answer False.",
                "Turn the card face up and add its number to picked.",
                "If two cards are now picked: add one to moves, and either keep the match or start the peek timer (PEEK_MS)."
            ]
        },
        "starter": "function flipCard(state, index) {\n    // 1. allowed?\n    // 2. turn it up and remember it\n    // 3. if that was the second card: count the move, match or peek\n}\n",
        "answer": "function flipCard(state, index) {\n    if (!canFlip(state, index)) {\n        return false;\n    }\n\n    state.cards[index].faceUp = true;\n    state.picked.push(index);\n\n    if (state.picked.length === 2) {\n        state.moves = state.moves + 1;\n        if (isMatch(state)) {\n            keepMatch(state);\n        } else {\n            state.peekTimer = PEEK_MS;\n        }\n    }\n    return true;\n}\n",
        "hints": [
            "Start with: if (!canFlip(state, index)) { return false; }",
            "state.picked.push(index) remembers which card was turned.",
            "Only when picked.length === 2 do you count a move and check for a match."
        ],
        "tests": [
            {
                "name": "Turning a card puts it face up",
                "code": "const state = createGame();\nflipCard(state, 0);\nassert(state.cards[0].faceUp === true, 'the card is still face down');"
            },
            {
                "name": "The turned card is remembered",
                "code": "const state = createGame();\nflipCard(state, 3);\nassert(state.picked.join(',') === '3', 'picked is ' + JSON.stringify(state.picked));"
            },
            {
                "name": "One card is not yet a move",
                "code": "const state = createGame();\nflipCard(state, 0);\nassert(state.moves === 0, 'a move is a PAIR of cards');"
            },
            {
                "name": "Two cards count as one move",
                "code": "const state = createGame();\nflipCard(state, 0);\nflipCard(state, 1);\nassert(state.moves === 1, 'moves is ' + state.moves);"
            },
            {
                "name": "A matching pair stays up and scores",
                "code": "const state = createGame();\nstate.cards = [{symbol: 1, faceUp: false, matched: false}, {symbol: 1, faceUp: false, matched: false}];\nflipCard(state, 0);\nflipCard(state, 1);\nassert(state.cards[0].matched && state.cards[1].matched, 'a matching pair should stay up');\nassert(state.pairs === 1, 'pairs is ' + state.pairs);"
            },
            {
                "name": "A wrong pair starts the peek timer",
                "code": "const state = createGame();\nstate.cards = [{symbol: 1, faceUp: false, matched: false}, {symbol: 2, faceUp: false, matched: false}];\nflipCard(state, 0);\nflipCard(state, 1);\nassert(state.peekTimer > 0, 'the two wrong cards must show for a moment');\nassert(state.pairs === 0, 'that was not a pair');"
            },
            {
                "name": "Turning a card that may not be turned answers false",
                "code": "const state = createGame();\nstate.cards[0].matched = true;\nassert(flipCard(state, 0) === false, 'a matched card cannot be turned');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Now you can really play. Use the buttons to move and flip."
        },
        "warning": "Count the move when the SECOND card is turned, not the first — a move is a pair of cards."
    },
    {
        "id": "hide_unmatched",
        "fnName": "hideUnmatched",
        "title": "Turn the wrong ones back",
        "adds": "Wrong pairs no longer stay up for ever.",
        "intro": "<p>A moment after two wrong cards are turned up, they go back face down — and the player has to remember what was there. That memory is the whole game.</p>",
        "spec": {
            "input": "state - the game",
            "output": "nothing; it changes the cards",
            "algorithm": [
                "For every picked card that has not been matched, set it face down again.",
                "Empty the picked list.",
                "Set the peek timer back to 0."
            ]
        },
        "starter": "function hideUnmatched(state) {\n    // turn the picked cards back down, forget them, stop the timer\n}\n",
        "answer": "function hideUnmatched(state) {\n    state.picked.forEach(function (index) {\n        if (!state.cards[index].matched) {\n            state.cards[index].faceUp = false;\n        }\n    });\n    state.picked = [];\n    state.peekTimer = 0;\n}\n",
        "hints": [
            "Loop over state.picked - those are the card numbers.",
            "Only turn a card down if it is not matched.",
            "Do not forget the last two lines: state.picked = []; and state.peekTimer = 0;"
        ],
        "tests": [
            {
                "name": "The two wrong cards go face down",
                "code": "const state = createGame();\nstate.cards[0].faceUp = true;\nstate.cards[1].faceUp = true;\nstate.picked = [0, 1];\nhideUnmatched(state);\nassert(state.cards[0].faceUp === false && state.cards[1].faceUp === false, 'both should be face down again');"
            },
            {
                "name": "The picked list is emptied",
                "code": "const state = createGame();\nstate.picked = [0, 1];\nhideUnmatched(state);\nassert(state.picked.length === 0, 'picked is ' + JSON.stringify(state.picked));"
            },
            {
                "name": "The timer is stopped",
                "code": "const state = createGame();\nstate.picked = [0, 1];\nstate.peekTimer = 500;\nhideUnmatched(state);\nassert(state.peekTimer === 0, 'peekTimer is ' + state.peekTimer);"
            },
            {
                "name": "Matched cards are left alone",
                "code": "const state = createGame();\nstate.cards[0].faceUp = true;\nstate.cards[0].matched = true;\nstate.picked = [0];\nhideUnmatched(state);\nassert(state.cards[0].faceUp === true, 'a found pair must stay showing');"
            },
            {
                "name": "Other cards are not touched",
                "code": "const state = createGame();\nstate.cards[5].faceUp = true;\nstate.picked = [0, 1];\nhideUnmatched(state);\nassert(state.cards[5].faceUp === true, 'only the picked cards should change');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Pick two wrong cards and watch them turn back over."
        }
    },
    {
        "id": "is_game_won",
        "fnName": "isGameWon",
        "title": "Have you won?",
        "adds": "The game knows when every pair is found.",
        "intro": "<p>The game is won when there is not a single unmatched card left on the table.</p>",
        "spec": {
            "input": "state - the game",
            "output": "True if every card has been matched",
            "algorithm": [
                "Look at every card.",
                "If any is still unmatched, the answer is False.",
                "If you get through them all, the answer is True."
            ]
        },
        "starter": "function isGameWon(state) {\n    // is every card matched?\n}\n",
        "answer": "function isGameWon(state) {\n    for (let i = 0; i < state.cards.length; i++) {\n        if (!state.cards[i].matched) {\n            return false;\n        }\n    }\n    return true;\n}\n",
        "hints": [
            "A for loop over state.cards, returning false the moment you find an unmatched card.",
            "return true; goes AFTER the loop.",
            "state.cards.every(c => c.matched) does the same job in one line."
        ],
        "tests": [
            {
                "name": "A brand-new game is not won",
                "code": "assert(isGameWon(createGame()) === false, 'nothing has been found yet');"
            },
            {
                "name": "A board with every card matched is won",
                "code": "const state = createGame();\nstate.cards.forEach(c => { c.matched = true; });\nassert(isGameWon(state) === true, 'every pair has been found');"
            },
            {
                "name": "One unmatched card means not won",
                "code": "const state = createGame();\nstate.cards.forEach(c => { c.matched = true; });\nstate.cards[7].matched = false;\nassert(isGameWon(state) === false, 'card 7 is still hidden');"
            },
            {
                "name": "Face up is not the same as matched",
                "code": "const state = createGame();\nstate.cards.forEach(c => { c.faceUp = true; });\nassert(isGameWon(state) === false, 'turning cards up is not finding pairs');"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Find all eight pairs and your function ends the game."
        }
    },
    {
        "id": "stars_for_moves",
        "fnName": "starsForMoves",
        "title": "Award the stars",
        "adds": "Playing well is worth something.",
        "intro": "<p>Eight pairs cannot be found in fewer than eight moves, so a really sharp player finishes in about twelve. The rating: <strong>12 moves or fewer is three stars</strong>, 18 or fewer is two, and anything else is one — because everybody who finishes deserves a star.</p>",
        "spec": {
            "input": "moves - how many pairs were tried",
            "output": "3, 2 or 1",
            "algorithm": [
                "12 or fewer: 3.",
                "18 or fewer: 2.",
                "Otherwise: 1."
            ]
        },
        "starter": "function starsForMoves(moves) {\n    // 3 stars, 2 stars or 1 star\n}\n",
        "answer": "function starsForMoves(moves) {\n    if (moves <= 12) {\n        return 3;\n    }\n    if (moves <= 18) {\n        return 2;\n    }\n    return 1;\n}\n",
        "hints": [
            "Two ifs and a return - check the best score first.",
            "if (moves <= 12) { return 3; }",
            "The last line is just: return 1;"
        ],
        "tests": [
            {
                "name": "A perfect 8 moves is three stars",
                "code": "assert(starsForMoves(8) === 3, 'gave ' + starsForMoves(8));"
            },
            {
                "name": "12 moves is still three stars",
                "code": "assert(starsForMoves(12) === 3, 'gave ' + starsForMoves(12));"
            },
            {
                "name": "13 moves drops to two stars",
                "code": "assert(starsForMoves(13) === 2, 'gave ' + starsForMoves(13));"
            },
            {
                "name": "18 moves is still two stars",
                "code": "assert(starsForMoves(18) === 2, 'gave ' + starsForMoves(18));"
            },
            {
                "name": "19 moves is one star",
                "code": "assert(starsForMoves(19) === 1, 'gave ' + starsForMoves(19));"
            },
            {
                "name": "Everybody gets at least one star",
                "code": "for (let moves = 0; moves < 200; moves++) { assert(starsForMoves(moves) >= 1, 'moves ' + moves + ' gave ' + starsForMoves(moves)); }"
            }
        ],
        "demo": {
            "kind": "game",
            "caption": "Finish the board and see your rating."
        }
    },
    {
        "id": "action_for_key",
        "fnName": "actionForKey",
        "title": "Wire up the keyboard",
        "adds": "You can play without a mouse — the game is finished!",
        "intro": "<p>Arrows move a dashed cursor around the grid and the space bar turns a card over. As always, the browser gives us a key name and the game needs the name of an action.</p>",
        "spec": {
            "input": "key - the key name from the browser",
            "output": "\"up\", \"down\", \"left\", \"right\", \"flip\", \"pause\", \"restart\" - or nothing for other keys",
            "algorithm": [
                "Lowercase the key first.",
                "Arrows or WASD move the cursor.",
                "Space or Enter flips; p pauses; r restarts; anything else is nothing."
            ]
        },
        "starter": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n    // return the action name for this key, or null\n}\n",
        "answer": "function actionForKey(key) {\n    const k = String(key).toLowerCase();\n\n    if (k === 'arrowup' || k === 'w') { return 'up'; }\n    if (k === 'arrowdown' || k === 's') { return 'down'; }\n    if (k === 'arrowleft' || k === 'a') { return 'left'; }\n    if (k === 'arrowright' || k === 'd') { return 'right'; }\n    if (k === ' ' || k === 'spacebar' || k === 'enter') { return 'flip'; }\n    if (k === 'p') { return 'pause'; }\n    if (k === 'r') { return 'restart'; }\n\n    return null;\n}\n",
        "hints": [
            "One if per action, each returning straight away.",
            "Two or three keys can share an action with ||.",
            "The last line is: return null;"
        ],
        "tests": [
            {
                "name": "ArrowUp moves up",
                "code": "assert(actionForKey('ArrowUp') === 'up', 'gave ' + actionForKey('ArrowUp'));"
            },
            {
                "name": "W moves up too",
                "code": "assert(actionForKey('w') === 'up');"
            },
            {
                "name": "A capital W still works",
                "code": "assert(actionForKey('W') === 'up', 'did you lowercase the key?');"
            },
            {
                "name": "The arrows all work",
                "code": "assert(actionForKey('ArrowDown') === 'down' && actionForKey('ArrowLeft') === 'left' && actionForKey('ArrowRight') === 'right');"
            },
            {
                "name": "Space turns a card over",
                "code": "assert(actionForKey(' ') === 'flip', 'gave ' + actionForKey(' '));"
            },
            {
                "name": "Enter turns a card over too",
                "code": "assert(actionForKey('Enter') === 'flip');"
            },
            {
                "name": "P pauses and R restarts",
                "code": "assert(actionForKey('p') === 'pause' && actionForKey('r') === 'restart');"
            },
            {
                "name": "An unused key gives null",
                "code": "assert(actionForKey('q') === null, 'gave ' + actionForKey('q'));"
            }
        ],
        "demo": {
            "kind": "final",
            "caption": "Click the page, then play with the arrow keys and space."
        },
        "warning": "Return null (JavaScript) or None (Python) for keys the game does not use."
    }
];
