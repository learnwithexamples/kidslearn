// Flashcards Application
let currentBookData = null;
let currentBook = null;
let selectedLessons = [];
let flashcards = [];
let currentCardIndex = 0;
let isFlipped = false;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    currentBook = getBookIdFromURL();
    
    if (currentBook) {
        loadBookData();
        setupEventListeners();
    }
});

// Get book ID from URL
function getBookIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('book');
}

// Load book data
function loadBookData() {
    if (typeof vocabularyData !== 'undefined' && vocabularyData.books[currentBook]) {
        currentBookData = vocabularyData.books[currentBook];
        updatePageTitle();
        generateLessonCheckboxes();
        updateBackLink();
    } else {
        alert('Book data not found. Please return to the book page.');
    }
}

// Update page title
function updatePageTitle() {
    document.getElementById('book-title').textContent = `${currentBookData.title} - ${currentBookData.level} Level`;
}

// Update back link
function updateBackLink() {
    const backLink = document.getElementById('back-link');
    backLink.href = `${currentBook}.html`;
}

// Generate lesson checkboxes
function generateLessonCheckboxes() {
    const container = document.getElementById('lesson-checkboxes');
    container.innerHTML = '';
    
    currentBookData.lessons.forEach(lesson => {
        const label = document.createElement('label');
        label.className = 'lesson-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = lesson.number;
        checkbox.checked = true;
        checkbox.addEventListener('change', updateSelectedLessons);
        
        const span = document.createElement('span');
        const wordCount = lesson.roots.reduce((sum, root) => sum + root.words.length, 0);
        span.textContent = `Lesson ${lesson.number}: ${lesson.title} (${wordCount} words)`;
        
        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
    });
    
    updateSelectedLessons();
}

// Update selected lessons
function updateSelectedLessons() {
    const checkboxes = document.querySelectorAll('#lesson-checkboxes input[type="checkbox"]');
    selectedLessons = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.value));
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('select-all-btn').addEventListener('click', function() {
        document.querySelectorAll('#lesson-checkboxes input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });
        updateSelectedLessons();
    });
    
    document.getElementById('deselect-all-btn').addEventListener('click', function() {
        document.querySelectorAll('#lesson-checkboxes input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        updateSelectedLessons();
    });
    
    document.getElementById('start-flashcards-btn').addEventListener('click', startFlashcards);
    document.getElementById('prev-btn').addEventListener('click', previousCard);
    document.getElementById('next-btn').addEventListener('click', nextCard);
    document.getElementById('flip-btn').addEventListener('click', flipCard);
    document.getElementById('shuffle-btn').addEventListener('click', shuffleCards);
    document.getElementById('flashcard').addEventListener('click', flipCard);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('flashcard-area').classList.contains('hidden')) return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                flipCard();
                break;
            case 'ArrowLeft':
                previousCard();
                break;
            case 'ArrowRight':
                nextCard();
                break;
        }
    });
}

// Start flashcards
function startFlashcards() {
    if (selectedLessons.length === 0) {
        alert('Please select at least one lesson.');
        return;
    }
    
    generateFlashcards();
    
    if (flashcards.length === 0) {
        alert('No flashcards available for selected lessons.');
        return;
    }
    
    currentCardIndex = 0;
    document.querySelector('.controls-panel').classList.add('hidden');
    document.getElementById('flashcard-area').classList.remove('hidden');
    displayCard();
}

// Generate flashcards from selected lessons
function generateFlashcards() {
    flashcards = [];
    
    currentBookData.lessons.forEach(lesson => {
        if (selectedLessons.includes(lesson.number)) {
            lesson.roots.forEach(root => {
                root.words.forEach(word => {
                    flashcards.push({
                        word: word.word,
                        pronunciation: word.pronunciation,
                        partOfSpeech: word.partOfSpeech,
                        definition: word.definition,
                        example: word.example,
                        root: root.root,
                        meaning: root.meaning,
                        lessonNumber: lesson.number,
                        lessonTitle: lesson.title
                    });
                });
            });
        }
    });
}

// Display current card
function displayCard() {
    if (flashcards.length === 0) return;
    
    const card = flashcards[currentCardIndex];
    
    // Update card content
    document.getElementById('card-word').textContent = card.word;
    document.getElementById('card-pronunciation').textContent = card.pronunciation;
    document.getElementById('card-pos').textContent = card.partOfSpeech;
    document.getElementById('card-definition').textContent = card.definition;
    document.getElementById('card-example').innerHTML = `<em>"${card.example}"</em>`;
    document.getElementById('card-root').textContent = card.root;
    document.getElementById('card-meaning').textContent = card.meaning;
    
    // Update progress info
    document.getElementById('card-counter').textContent = `Card ${currentCardIndex + 1} of ${flashcards.length}`;
    document.getElementById('lesson-info').textContent = `Lesson ${card.lessonNumber}: ${card.lessonTitle}`;
    
    // Reset flip state
    if (isFlipped) {
        flipCard();
    }
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = currentCardIndex === 0;
    document.getElementById('next-btn').disabled = currentCardIndex === flashcards.length - 1;
}

// Flip card
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

// Previous card
function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayCard();
    }
}

// Next card
function nextCard() {
    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        displayCard();
    }
}

// Shuffle cards
function shuffleCards() {
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentCardIndex = 0;
    displayCard();
}
