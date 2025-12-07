// Vocabulary Loader - Dynamically loads vocabulary data from JS file
let currentBookData = null;
let currentBook = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get book ID from URL or page
    currentBook = getBookId();
    
    if (currentBook) {
        loadVocabularyData();
        renderBookContent();
    }
});

// Get the book ID from the page
function getBookId() {
    // Extract from URL path (e.g., /classical-roots/book-4.html -> book-4)
    const path = window.location.pathname;
    const match = path.match(/book-([a-e0-9]+)\.html/i);
    return match ? `book-${match[1].toLowerCase()}` : null;
}

// Load vocabulary data from JS file
function loadVocabularyData() {
    try {
        // vocabularyData is loaded from vocabulary-data.js
        if (typeof vocabularyData !== 'undefined' && vocabularyData.books[currentBook]) {
            currentBookData = vocabularyData.books[currentBook];
        } else {
            throw new Error('Vocabulary data not found');
        }
    } catch (error) {
        console.error('Error loading vocabulary data:', error);
        showError('Unable to load vocabulary data. Please try again later.');
    }
}

// Render the book content
// Render the book content
function renderBookContent() {
    if (!currentBookData) {
        showError('No vocabulary data available for this book.');
        return;
    }
    
    // Update page title and subtitle
    updateBookHeader();
    
    // Render lessons
    renderLessons();
}

// Update the book header with data from JS
function updateBookHeader() {
    const titleElement = document.querySelector('header h1');
    const subtitleElement = document.querySelector('.subtitle');
    const introDescription = document.querySelector('.book-intro p');
    
    if (titleElement) {
        titleElement.textContent = `📖 ${currentBookData.title} - Vocabulary from Classical Roots`;
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = `${currentBookData.level} Level`;
    }
    
    if (introDescription) {
        introDescription.textContent = currentBookData.description;
    }
}

// Render all lessons
function renderLessons() {
    const lessonsGrid = document.querySelector('.lessons-grid');
    if (!lessonsGrid) return;
    
    lessonsGrid.innerHTML = '';
    
    currentBookData.lessons.forEach(lesson => {
        const lessonCard = createLessonCard(lesson);
        lessonsGrid.appendChild(lessonCard);
    });
}
// Create a lesson card element
function createLessonCard(lesson) {
    const card = document.createElement('div');
    card.className = 'lesson-card';
    card.innerHTML = `
        <div class="lesson-number">Lesson ${lesson.number}</div>
        <h3>${lesson.title}</h3>
        <p>${lesson.roots.length} root${lesson.roots.length > 1 ? 's' : ''}, ${countWords(lesson)} words</p>
        <a href="#" class="lesson-link" data-lesson="${lesson.number}">Start Lesson</a>
    `;
    
    // Add click handler for lesson link
    const link = card.querySelector('.lesson-link');
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showLessonDetails(lesson);
    });
    
    return card;
}

// Count total words in a lesson
function countWords(lesson) {
    return lesson.roots.reduce((total, root) => total + root.words.length, 0);
}

// Show lesson details in a modal or new section
function showLessonDetails(lesson) {
    // Create or get modal container
    let modal = document.getElementById('lesson-modal');
    if (!modal) {
        modal = createLessonModal();
        document.body.appendChild(modal);
    }
    
    // Populate modal with lesson content
    const modalContent = modal.querySelector('.lesson-modal-content');
    modalContent.innerHTML = `
        <div class="lesson-header">
            <h2>Lesson ${lesson.number}: ${lesson.title}</h2>
            <button class="close-modal">&times;</button>
        </div>
        <div class="lesson-body">
            ${renderLessonRoots(lesson.roots)}
        </div>
    `;
    
    // Add close handler
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Show modal
    modal.classList.add('active');
}

// Create modal element
function createLessonModal() {
    const modal = document.createElement('div');
    modal.id = 'lesson-modal';
    modal.className = 'lesson-modal';
    modal.innerHTML = '<div class="lesson-modal-content"></div>';
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    return modal;
}

// Render roots and words for a lesson
function renderLessonRoots(roots) {
    return roots.map(root => `
        <div class="root-section">
            <div class="root-header">
                <h3 class="root-name">${root.root}</h3>
                <span class="root-origin">${root.origin}</span>
                <span class="root-meaning">Meaning: <strong>${root.meaning}</strong></span>
            </div>
            <div class="words-list">
                ${root.words.map(word => `
                    <div class="word-card">
                        <div class="word-header">
                            <h4 class="word-name">${word.word}</h4>
                            <span class="word-pronunciation">${word.pronunciation}</span>
                            <span class="word-pos">${word.partOfSpeech}</span>
                        </div>
                        <p class="word-definition">${word.definition}</p>
                        <p class="word-example"><em>"${word.example}"</em></p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Show error message
function showError(message) {
    const container = document.querySelector('.book-content') || document.querySelector('.container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        `;
        container.insertBefore(errorDiv, container.firstChild);
    }
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadVocabularyData,
        getBookId
    };
}
