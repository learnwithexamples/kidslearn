// Crossword Puzzle Game Logic
let currentBookData = null;
let currentBook = '';
let selectedLessons = [];
let puzzleSize = 'medium';
let crosswordData = null;
let selectedCell = null;
let currentDirection = 'across';
let timerInterval = null;
let startTime = null;
let isChecking = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentBook = urlParams.get('book');
    
    if (!currentBook) {
        window.location.href = '../vocabulary.html';
        return;
    }
    
    loadBookData();
    setupEventListeners();
});

// Load book data and populate UI
function loadBookData() {
    if (typeof vocabularyData !== 'undefined' && vocabularyData.books[currentBook]) {
        currentBookData = vocabularyData.books[currentBook];
    } else {
        alert('Book data not found. Please return to the book page.');
        return;
    }
    
    // Set header
    document.getElementById('book-title').textContent = `${currentBookData.title} - Crossword Puzzle`;
    document.getElementById('back-link').href = `${currentBook}.html`;
    
    // Populate lessons
    const container = document.getElementById('lesson-checkboxes');
    container.innerHTML = '';
    
    currentBookData.lessons.forEach(lesson => {
        const label = document.createElement('label');
        label.className = 'lesson-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = lesson.number;
        checkbox.checked = true;
        
        const span = document.createElement('span');
        span.textContent = `Lesson ${lesson.number}: ${lesson.title}`;
        
        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('select-all-btn').addEventListener('click', () => {
        document.querySelectorAll('#lesson-checkboxes input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });
    });
    
    document.getElementById('deselect-all-btn').addEventListener('click', () => {
        document.querySelectorAll('#lesson-checkboxes input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
    });
    
    document.getElementById('puzzle-size').addEventListener('change', (e) => {
        puzzleSize = e.target.value;
    });
    
    document.getElementById('generate-puzzle-btn').addEventListener('click', generatePuzzle);
    document.getElementById('check-answers-btn').addEventListener('click', checkAnswers);
    document.getElementById('reveal-word-btn').addEventListener('click', revealWord);
    document.getElementById('new-puzzle-btn').addEventListener('click', generatePuzzle);
    document.getElementById('new-puzzle-modal-btn').addEventListener('click', () => {
        document.getElementById('completion-modal').classList.add('hidden');
        generatePuzzle();
    });
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        document.getElementById('completion-modal').classList.add('hidden');
    });
}

// Generate crossword puzzle
function generatePuzzle() {
    // Get selected lessons
    const checkboxes = document.querySelectorAll('#lesson-checkboxes input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one lesson');
        return;
    }
    
    selectedLessons = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    // Get words from selected lessons
    let words = [];
    selectedLessons.forEach(lessonNumber => {
        const lesson = currentBookData.lessons.find(l => l.number === lessonNumber);
        if (lesson) {
            lesson.roots.forEach(root => {
                root.words.forEach(wordObj => {
                    words.push({
                        word: wordObj.word,
                        definition: wordObj.definition
                    });
                });
            });
        }
    });
    
    // Determine number of words based on size
    let wordCount;
    switch(puzzleSize) {
        case 'small': wordCount = Math.min(10, words.length); break;
        case 'medium': wordCount = Math.min(15, words.length); break;
        case 'large': wordCount = Math.min(20, words.length); break;
    }
    
    // Shuffle and select words
    words = shuffleArray(words).slice(0, wordCount);
    
    // Generate crossword
    crosswordData = createCrossword(words);
    
    if (!crosswordData) {
        alert('Could not generate crossword. Try selecting more lessons or changing size.');
        return;
    }
    
    // Reset timer
    if (timerInterval) clearInterval(timerInterval);
    startTime = null;
    document.getElementById('timer').textContent = '00:00';
    
    // Render puzzle
    renderCrossword();
    
    // Show puzzle area
    document.getElementById('crossword-area').classList.remove('hidden');
    
    // Reset checking state
    isChecking = false;
}

// Create crossword from words
function createCrossword(words) {
    const maxAttempts = 50;
    let bestGrid = null;
    let bestScore = 0;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const grid = attemptCrossword(words);
        if (grid && grid.placedWords.length > bestScore) {
            bestGrid = grid;
            bestScore = grid.placedWords.length;
        }
        if (bestScore === words.length) break;
    }
    
    return bestGrid;
}

// Attempt to create crossword
function attemptCrossword(words) {
    const gridSize = 25;
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
    const placedWords = [];
    
    // Sort by length (longer first)
    words = [...words].sort((a, b) => b.word.length - a.word.length);
    
    // Place first word horizontally in middle
    const firstWord = words[0];
    const startRow = Math.floor(gridSize / 2);
    const startCol = Math.floor((gridSize - firstWord.word.length) / 2);
    
    if (!placeWord(grid, firstWord, startRow, startCol, 'across', placedWords)) {
        return null;
    }
    
    // Try to place remaining words
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        let placed = false;
        
        // Try to intersect with existing words
        for (const placedWord of placedWords) {
            if (placed) break;
            
            for (let j = 0; j < word.word.length; j++) {
                if (placed) break;
                
                for (let k = 0; k < placedWord.word.length; k++) {
                    if (word.word[j].toLowerCase() === placedWord.word[k].toLowerCase()) {
                        // Found intersection
                        const newDir = placedWord.direction === 'across' ? 'down' : 'across';
                        let newRow, newCol;
                        
                        if (newDir === 'across') {
                            newRow = placedWord.row + k;
                            newCol = placedWord.col - j;
                        } else {
                            newRow = placedWord.row - j;
                            newCol = placedWord.col + k;
                        }
                        
                        if (placeWord(grid, word, newRow, newCol, newDir, placedWords)) {
                            placed = true;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    // Trim grid
    const trimmed = trimGrid(grid, placedWords);
    
    return {
        grid: trimmed.grid,
        placedWords: placedWords,
        rows: trimmed.rows,
        cols: trimmed.cols
    };
}

// Place word on grid
function placeWord(grid, wordObj, row, col, direction, placedWords) {
    const word = wordObj.word.toUpperCase();
    const gridSize = grid.length;
    
    // Check if word fits
    if (direction === 'across') {
        if (col < 0 || col + word.length > gridSize) return false;
        
        // Check before and after
        if (col > 0 && grid[row][col - 1]) return false;
        if (col + word.length < gridSize && grid[row][col + word.length]) return false;
        
        // Check each position
        for (let i = 0; i < word.length; i++) {
            const c = col + i;
            if (grid[row][c] && grid[row][c] !== word[i]) return false;
            
            // Check perpendicular cells (except intersections)
            if (!grid[row][c]) {
                if (row > 0 && grid[row - 1][c]) return false;
                if (row < gridSize - 1 && grid[row + 1][c]) return false;
            }
        }
        
        // Place word
        for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
        }
        
    } else { // down
        if (row < 0 || row + word.length > gridSize) return false;
        
        // Check before and after
        if (row > 0 && grid[row - 1][col]) return false;
        if (row + word.length < gridSize && grid[row + word.length][col]) return false;
        
        // Check each position
        for (let i = 0; i < word.length; i++) {
            const r = row + i;
            if (grid[r][col] && grid[r][col] !== word[i]) return false;
            
            // Check perpendicular cells (except intersections)
            if (!grid[r][col]) {
                if (col > 0 && grid[r][col - 1]) return false;
                if (col < gridSize - 1 && grid[r][col + 1]) return false;
            }
        }
        
        // Place word
        for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
        }
    }
    
    placedWords.push({
        word: word,
        row: row,
        col: col,
        direction: direction,
        definition: wordObj.definition,
        number: placedWords.length + 1
    });
    
    return true;
}

// Trim grid to minimum size
function trimGrid(grid, placedWords) {
    let minRow = grid.length, maxRow = -1;
    let minCol = grid[0].length, maxCol = -1;
    
    placedWords.forEach(pw => {
        minRow = Math.min(minRow, pw.row);
        maxRow = Math.max(maxRow, pw.row + (pw.direction === 'down' ? pw.word.length - 1 : 0));
        minCol = Math.min(minCol, pw.col);
        maxCol = Math.max(maxCol, pw.col + (pw.direction === 'across' ? pw.word.length - 1 : 0));
    });
    
    const rows = maxRow - minRow + 1;
    const cols = maxCol - minCol + 1;
    const newGrid = Array(rows).fill().map(() => Array(cols).fill(null));
    
    // Copy trimmed section
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newGrid[r][c] = grid[minRow + r][minCol + c];
        }
    }
    
    // Adjust coordinates
    placedWords.forEach(pw => {
        pw.row -= minRow;
        pw.col -= minCol;
    });
    
    return { grid: newGrid, rows, cols };
}

// Render crossword
function renderCrossword() {
    const gridContainer = document.getElementById('crossword-grid');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${crosswordData.cols}, 35px)`;
    
    // Create cells
    for (let r = 0; r < crosswordData.rows; r++) {
        for (let c = 0; c < crosswordData.cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'crossword-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            if (crosswordData.grid[r][c]) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.answer = crosswordData.grid[r][c];
                
                input.addEventListener('focus', () => selectCell(cell));
                input.addEventListener('input', handleInput);
                input.addEventListener('keydown', handleKeydown);
                
                cell.appendChild(input);
            } else {
                cell.classList.add('black');
            }
            
            gridContainer.appendChild(cell);
        }
    }
    
    // Add numbers
    crosswordData.placedWords.forEach(pw => {
        const cell = document.querySelector(`[data-row="${pw.row}"][data-col="${pw.col}"]`);
        if (cell) {
            const number = document.createElement('span');
            number.className = 'cell-number';
            number.textContent = pw.number;
            cell.appendChild(number);
        }
    });
    
    // Render clues
    renderClues();
    
    // Update progress
    updateProgress();
}

// Render clues
function renderClues() {
    const acrossList = document.getElementById('across-clues');
    const downList = document.getElementById('down-clues');
    
    acrossList.innerHTML = '';
    downList.innerHTML = '';
    
    crosswordData.placedWords.forEach(pw => {
        const li = document.createElement('li');
        li.className = 'clue-item';
        li.dataset.number = pw.number;
        li.dataset.direction = pw.direction;
        
        const number = document.createElement('span');
        number.className = 'clue-number';
        number.textContent = `${pw.number}.`;
        
        const text = document.createElement('span');
        text.className = 'clue-text';
        text.textContent = pw.definition;
        
        li.appendChild(number);
        li.appendChild(text);
        
        li.addEventListener('click', () => selectWord(pw));
        
        if (pw.direction === 'across') {
            acrossList.appendChild(li);
        } else {
            downList.appendChild(li);
        }
    });
}

// Select cell
function selectCell(cell) {
    if (!startTime) {
        startTime = Date.now();
        startTimer();
    }
    
    selectedCell = cell;
    
    // Clear previous highlights
    document.querySelectorAll('.crossword-cell').forEach(c => {
        c.classList.remove('selected', 'highlighted');
    });
    
    cell.classList.add('selected');
    
    // Find which word this cell belongs to
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    let word = null;
    crosswordData.placedWords.forEach(pw => {
        if (pw.direction === currentDirection) {
            if (currentDirection === 'across' && pw.row === row && col >= pw.col && col < pw.col + pw.word.length) {
                word = pw;
            } else if (currentDirection === 'down' && pw.col === col && row >= pw.row && row < pw.row + pw.word.length) {
                word = pw;
            }
        }
    });
    
    if (word) {
        highlightWord(word);
        highlightClue(word);
    }
}

// Highlight word
function highlightWord(word) {
    for (let i = 0; i < word.word.length; i++) {
        let cell;
        if (word.direction === 'across') {
            cell = document.querySelector(`[data-row="${word.row}"][data-col="${word.col + i}"]`);
        } else {
            cell = document.querySelector(`[data-row="${word.row + i}"][data-col="${word.col}"]`);
        }
        if (cell && !cell.classList.contains('selected')) {
            cell.classList.add('highlighted');
        }
    }
}

// Highlight clue
function highlightClue(word) {
    document.querySelectorAll('.clue-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const clue = document.querySelector(`.clue-item[data-number="${word.number}"][data-direction="${word.direction}"]`);
    if (clue) {
        clue.classList.add('active');
        clue.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Select word from clue
function selectWord(word) {
    currentDirection = word.direction;
    const cell = document.querySelector(`[data-row="${word.row}"][data-col="${word.col}"]`);
    if (cell) {
        const input = cell.querySelector('input');
        if (input) input.focus();
    }
}

// Handle input
function handleInput(e) {
    const input = e.target;
    const value = input.value.toUpperCase();
    
    if (value) {
        input.value = value;
        moveToNext(input);
    }
    
    updateProgress();
}

// Handle keydown
function handleKeydown(e) {
    const input = e.target;
    
    if (e.key === 'Backspace' && !input.value) {
        e.preventDefault();
        moveToPrevious(input);
    } else if (e.key === 'Tab') {
        e.preventDefault();
        currentDirection = currentDirection === 'across' ? 'down' : 'across';
        selectCell(input.parentElement);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        moveByArrow(input, e.key);
    }
}

// Move to next cell
function moveToNext(input) {
    const cell = input.parentElement;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    let nextCell;
    if (currentDirection === 'across') {
        nextCell = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
    } else {
        nextCell = document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`);
    }
    
    if (nextCell && !nextCell.classList.contains('black')) {
        const nextInput = nextCell.querySelector('input');
        if (nextInput) nextInput.focus();
    }
}

// Move to previous cell
function moveToPrevious(input) {
    const cell = input.parentElement;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    let prevCell;
    if (currentDirection === 'across') {
        prevCell = document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`);
    } else {
        prevCell = document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`);
    }
    
    if (prevCell && !prevCell.classList.contains('black')) {
        const prevInput = prevCell.querySelector('input');
        if (prevInput) {
            prevInput.focus();
            prevInput.value = '';
        }
    }
}

// Move by arrow keys
function moveByArrow(input, key) {
    const cell = input.parentElement;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    let newRow = row, newCol = col;
    
    switch(key) {
        case 'ArrowLeft': newCol--; currentDirection = 'across'; break;
        case 'ArrowRight': newCol++; currentDirection = 'across'; break;
        case 'ArrowUp': newRow--; currentDirection = 'down'; break;
        case 'ArrowDown': newRow++; currentDirection = 'down'; break;
    }
    
    const newCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
    if (newCell && !newCell.classList.contains('black')) {
        const newInput = newCell.querySelector('input');
        if (newInput) newInput.focus();
    }
}

// Update progress
function updateProgress() {
    let completed = 0;
    
    crosswordData.placedWords.forEach(pw => {
        let wordComplete = true;
        for (let i = 0; i < pw.word.length; i++) {
            let cell;
            if (pw.direction === 'across') {
                cell = document.querySelector(`[data-row="${pw.row}"][data-col="${pw.col + i}"]`);
            } else {
                cell = document.querySelector(`[data-row="${pw.row + i}"][data-col="${pw.col}"]`);
            }
            
            const input = cell ? cell.querySelector('input') : null;
            if (!input || input.value.toUpperCase() !== pw.word[i]) {
                wordComplete = false;
                break;
            }
        }
        
        if (wordComplete) {
            completed++;
            const clue = document.querySelector(`.clue-item[data-number="${pw.number}"][data-direction="${pw.direction}"]`);
            if (clue) clue.classList.add('completed');
        } else {
            const clue = document.querySelector(`.clue-item[data-number="${pw.number}"][data-direction="${pw.direction}"]`);
            if (clue) clue.classList.remove('completed');
        }
    });
    
    document.getElementById('words-completed').textContent = `${completed} / ${crosswordData.placedWords.length}`;
    
    if (completed === crosswordData.placedWords.length && !isChecking) {
        setTimeout(showCompletion, 500);
    }
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Check answers
function checkAnswers() {
    isChecking = true;
    
    crosswordData.placedWords.forEach(pw => {
        for (let i = 0; i < pw.word.length; i++) {
            let cell;
            if (pw.direction === 'across') {
                cell = document.querySelector(`[data-row="${pw.row}"][data-col="${pw.col + i}"]`);
            } else {
                cell = document.querySelector(`[data-row="${pw.row + i}"][data-col="${pw.col}"]`);
            }
            
            const input = cell ? cell.querySelector('input') : null;
            if (input) {
                cell.classList.remove('correct', 'incorrect');
                if (input.value.toUpperCase() === pw.word[i]) {
                    cell.classList.add('correct');
                } else if (input.value) {
                    cell.classList.add('incorrect');
                }
            }
        }
    });
    
    setTimeout(() => {
        document.querySelectorAll('.crossword-cell').forEach(cell => {
            cell.classList.remove('correct', 'incorrect');
        });
        isChecking = false;
    }, 2000);
}

// Reveal word
function revealWord() {
    if (!selectedCell) {
        alert('Please select a word first');
        return;
    }
    
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    
    // Find the word in currentDirection; fall back to the other direction if not found
    const directions = currentDirection === 'across' ? ['across', 'down'] : ['down', 'across'];
    let word = null;
    for (const dir of directions) {
        crosswordData.placedWords.forEach(pw => {
            if (!word && pw.direction === dir) {
                if (dir === 'across' && pw.row === row && col >= pw.col && col < pw.col + pw.word.length) {
                    word = pw;
                } else if (dir === 'down' && pw.col === col && row >= pw.row && row < pw.row + pw.word.length) {
                    word = pw;
                }
            }
        });
        if (word) break;
    }
    
    if (word) {
        for (let i = 0; i < word.word.length; i++) {
            let cell;
            if (word.direction === 'across') {
                cell = document.querySelector(`[data-row="${word.row}"][data-col="${word.col + i}"]`);
            } else {
                cell = document.querySelector(`[data-row="${word.row + i}"][data-col="${word.col}"]`);
            }
            
            const input = cell ? cell.querySelector('input') : null;
            if (input) {
                input.value = word.word[i];
            }
        }
        updateProgress();
    }
}

// Show completion
function showCompletion() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    document.getElementById('completion-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('completion-score').textContent = `${crosswordData.placedWords.length} words completed!`;
    document.getElementById('completion-modal').classList.remove('hidden');
}

// Shuffle array
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
