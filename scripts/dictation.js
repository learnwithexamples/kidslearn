// Dictation Application
let currentBookData = null;
let currentBook = null;
let selectedLessons = [];
let dictationWords = [];
let currentWordIndex = 0;
let score = 0;
let answers = [];
let voicesLoaded = false;
let hasPlayedWord = false;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    currentBook = getBookIdFromURL();
    
    if (currentBook) {
        loadBookData();
        setupEventListeners();
    }
    
    // Load voices when available
    if ('speechSynthesis' in window) {
        speechSynthesis.addEventListener('voiceschanged', function() {
            voicesLoaded = true;
        });
        
        speechSynthesis.getVoices();
        
        setTimeout(() => {
            if (speechSynthesis.getVoices().length > 0) {
                voicesLoaded = true;
            }
        }, 100);
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
    
    document.getElementById('start-dictation-btn').addEventListener('click', startDictation);
    document.getElementById('play-word-btn').addEventListener('click', playWord);
    document.getElementById('replay-btn').addEventListener('click', playWord);
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('next-word-btn').addEventListener('click', nextWord);
    document.getElementById('retake-btn').addEventListener('click', retakeDictation);
    document.getElementById('new-dictation-btn').addEventListener('click', newDictation);
    document.getElementById('review-btn').addEventListener('click', toggleReview);
    
    // Allow Enter key to check answer
    document.getElementById('word-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !document.getElementById('check-btn').disabled) {
            checkAnswer();
        }
    });
}

// Start dictation
function startDictation() {
    if (selectedLessons.length === 0) {
        alert('Please select at least one lesson.');
        return;
    }
    
    collectWords();
    
    if (dictationWords.length === 0) {
        alert('No words available. Please select lessons with words.');
        return;
    }
    
    currentWordIndex = 0;
    score = 0;
    answers = [];
    
    document.querySelector('.controls-panel').classList.add('hidden');
    document.getElementById('dictation-area').classList.remove('hidden');
    displayWord();
}

// Collect words from selected lessons
function collectWords() {
    const allWords = [];
    
    currentBookData.lessons.forEach(lesson => {
        if (selectedLessons.includes(lesson.number)) {
            lesson.roots.forEach(root => {
                root.words.forEach(word => {
                    allWords.push({
                        word: word.word,
                        pronunciation: word.pronunciation,
                        definition: word.definition,
                        partOfSpeech: word.partOfSpeech,
                        lessonNumber: lesson.number
                    });
                });
            });
        }
    });
    
    // Shuffle and select requested number
    const shuffled = allWords.sort(() => Math.random() - 0.5);
    const wordCount = document.getElementById('word-count').value;
    const maxWords = wordCount === 'all' ? shuffled.length : parseInt(wordCount);
    dictationWords = shuffled.slice(0, Math.min(maxWords, shuffled.length));
}

// Display current word
function displayWord() {
    if (currentWordIndex >= dictationWords.length) {
        showResults();
        return;
    }
    
    hasPlayedWord = false;
    
    // Update progress
    document.getElementById('word-counter').textContent = 
        `Word ${currentWordIndex + 1} of ${dictationWords.length}`;
    document.getElementById('score-display').textContent = 
        `Score: ${score}/${currentWordIndex}`;
    
    const progress = ((currentWordIndex + 1) / dictationWords.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    // Reset input and feedback
    document.getElementById('word-input').value = '';
    document.getElementById('word-input').disabled = false;
    document.getElementById('word-input').focus();
    document.getElementById('check-btn').disabled = false;
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('word-details').classList.add('hidden');
    document.getElementById('next-word-btn').classList.add('hidden');
    
    // Automatically play the word
    setTimeout(() => playWord(), 500);
}

// Play word using speech synthesis
function playWord() {
    if (dictationWords.length === 0) return;
    
    const word = dictationWords[currentWordIndex].word;
    
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') && (
                voice.name.includes('Google') ||
                voice.name.includes('Premium') ||
                voice.name.includes('Natural') ||
                voice.name.includes('Enhanced') ||
                voice.name.includes('Samantha') ||
                voice.name.includes('Alex')
            )
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        hasPlayedWord = true;
    } else {
        alert('Sorry, your browser does not support text-to-speech.');
    }
}

// Check answer
function checkAnswer() {
    const userInput = document.getElementById('word-input').value.trim();
    
    if (!userInput) {
        alert('Please type a word before checking.');
        return;
    }
    
    if (!hasPlayedWord) {
        alert('Please listen to the word first by clicking the play button.');
        return;
    }
    
    const correctWord = dictationWords[currentWordIndex].word;
    const isCorrect = userInput.toLowerCase() === correctWord.toLowerCase();
    
    if (isCorrect) {
        score++;
    }
    
    // Record answer
    answers.push({
        word: correctWord,
        userAnswer: userInput,
        isCorrect: isCorrect,
        pronunciation: dictationWords[currentWordIndex].pronunciation,
        definition: dictationWords[currentWordIndex].definition
    });
    
    // Update score display
    document.getElementById('score-display').textContent = 
        `Score: ${score}/${currentWordIndex + 1}`;
    
    // Show feedback
    showFeedback(isCorrect, correctWord);
    
    // Disable input and check button
    document.getElementById('word-input').disabled = true;
    document.getElementById('check-btn').disabled = true;
    
    // Show next button
    document.getElementById('next-word-btn').classList.remove('hidden');
}

// Show feedback
function showFeedback(isCorrect, correctWord) {
    const feedback = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');
    const wordDetails = document.getElementById('word-details');
    
    feedback.classList.remove('hidden', 'correct-feedback', 'incorrect-feedback');
    
    if (isCorrect) {
        feedback.classList.add('correct-feedback');
        feedbackText.innerHTML = '✅ <strong>Correct!</strong> Well done!';
    } else {
        feedback.classList.add('incorrect-feedback');
        feedbackText.innerHTML = `❌ <strong>Incorrect.</strong>`;
    }
    
    // Show word details
    wordDetails.classList.remove('hidden');
    document.getElementById('correct-spelling').textContent = correctWord;
    document.getElementById('word-pronunciation').textContent = dictationWords[currentWordIndex].pronunciation;
    document.getElementById('word-definition').textContent = dictationWords[currentWordIndex].definition;
}

// Next word
function nextWord() {
    currentWordIndex++;
    displayWord();
}

// Show results
function showResults() {
    document.getElementById('dictation-area').classList.add('hidden');
    document.getElementById('results-area').classList.remove('hidden');
    
    const percentage = Math.round((score / dictationWords.length) * 100);
    
    document.getElementById('final-percentage').textContent = `${percentage}%`;
    document.getElementById('final-score-text').textContent = 
        `You scored ${score} out of ${dictationWords.length}`;
    
    let message = '';
    if (percentage === 100) {
        message = '🌟 Perfect spelling! You\'re a vocabulary champion!';
    } else if (percentage >= 80) {
        message = '🎉 Great job! You have excellent spelling skills!';
    } else if (percentage >= 60) {
        message = '👍 Good work! Keep practicing to improve!';
    } else {
        message = '💪 Keep studying! Practice makes perfect!';
    }
    
    document.getElementById('performance-text').textContent = message;
    
    generateReviewList();
}

// Generate review list
function generateReviewList() {
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    
    answers.forEach((answer, index) => {
        const item = document.createElement('div');
        item.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        item.innerHTML = `
            <div class="review-number">${index + 1}</div>
            <div class="review-content">
                <h4>${answer.word}</h4>
                <p class="review-label">Your answer:</p>
                <p class="review-answer ${answer.isCorrect ? '' : 'wrong'}">${answer.userAnswer}</p>
                ${!answer.isCorrect ? `
                    <p class="review-label">Correct spelling:</p>
                    <p class="review-answer correct-answer">${answer.word}</p>
                ` : ''}
                <p class="review-label">Pronunciation:</p>
                <p class="review-detail">${answer.pronunciation}</p>
                <p class="review-label">Definition:</p>
                <p class="review-detail">${answer.definition}</p>
            </div>
            <div class="review-icon">${answer.isCorrect ? '✓' : '✗'}</div>
        `;
        
        reviewList.appendChild(item);
    });
}

// Toggle review
function toggleReview() {
    const reviewSection = document.getElementById('review-section');
    reviewSection.classList.toggle('hidden');
    
    const btn = document.getElementById('review-btn');
    if (reviewSection.classList.contains('hidden')) {
        btn.textContent = '📋 Review Answers';
    } else {
        btn.textContent = '🔼 Hide Review';
    }
}

// Retake dictation
function retakeDictation() {
    currentWordIndex = 0;
    score = 0;
    answers = [];
    
    // Shuffle words
    dictationWords = dictationWords.sort(() => Math.random() - 0.5);
    
    document.getElementById('results-area').classList.add('hidden');
    document.getElementById('dictation-area').classList.remove('hidden');
    displayWord();
}

// New dictation
function newDictation() {
    document.getElementById('results-area').classList.add('hidden');
    document.querySelector('.controls-panel').classList.remove('hidden');
}
