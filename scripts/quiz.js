// Quiz Application
let currentBookData = null;
let currentBook = null;
let selectedLessons = [];
let quizWords = [];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answers = [];

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
    
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    document.getElementById('next-question-btn').addEventListener('click', nextQuestion);
    document.getElementById('retry-wrong-btn').addEventListener('click', retryWrongAnswers);
    document.getElementById('retake-btn').addEventListener('click', retakeQuiz);
    document.getElementById('new-quiz-btn').addEventListener('click', newQuiz);
    document.getElementById('review-btn').addEventListener('click', toggleReview);
}

// Start quiz
function startQuiz() {
    if (selectedLessons.length === 0) {
        alert('Please select at least one lesson.');
        return;
    }
    
    collectWords();
    
    if (quizWords.length < 4) {
        alert('Not enough words available. Please select more lessons.');
        return;
    }
    
    generateQuestions();
    
    if (questions.length === 0) {
        alert('Unable to generate questions.');
        return;
    }
    
    currentQuestionIndex = 0;
    score = 0;
    answers = [];
    
    document.querySelector('.controls-panel').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    displayQuestion();
}

// Collect words from selected lessons
function collectWords() {
    quizWords = [];
    
    currentBookData.lessons.forEach(lesson => {
        if (selectedLessons.includes(lesson.number)) {
            lesson.roots.forEach(root => {
                root.words.forEach(word => {
                    quizWords.push({
                        word: word.word,
                        definition: word.definition,
                        partOfSpeech: word.partOfSpeech,
                        lessonNumber: lesson.number
                    });
                });
            });
        }
    });
}

// Generate questions
function generateQuestions() {
    const questionCount = document.getElementById('question-count').value;
    const maxQuestions = questionCount === 'all' ? quizWords.length : parseInt(questionCount);
    const numQuestions = Math.min(maxQuestions, quizWords.length);
    
    // Shuffle words
    const shuffled = [...quizWords].sort(() => Math.random() - 0.5);
    
    questions = [];
    
    for (let i = 0; i < numQuestions; i++) {
        const correctWord = shuffled[i];
        const incorrectWords = quizWords
            .filter(w => w.word !== correctWord.word)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        
        const choices = [correctWord, ...incorrectWords]
            .sort(() => Math.random() - 0.5);
        
        questions.push({
            word: correctWord.word,
            correctDefinition: correctWord.definition,
            choices: choices,
            correctAnswer: correctWord.definition,
            lessonNumber: correctWord.lessonNumber
        });
    }
}

// Display current question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Update progress
    document.getElementById('question-counter').textContent = 
        `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    document.getElementById('score-display').textContent = 
        `Score: ${score}/${currentQuestionIndex}`;
    
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    // Update question text
    document.getElementById('question-word').textContent = question.word;
    
    // Generate answer choices
    const choicesContainer = document.getElementById('answer-choices');
    choicesContainer.innerHTML = '';
    
    question.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'answer-choice';
        button.textContent = choice.definition;
        button.addEventListener('click', () => selectAnswer(choice.definition));
        choicesContainer.appendChild(button);
    });
    
    // Hide feedback
    document.getElementById('feedback').classList.add('hidden');
}

// Select answer
function selectAnswer(selectedDefinition) {
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedDefinition === question.correctAnswer;
    
    if (isCorrect) {
        score++;
    }
    
    // Record answer
    answers.push({
        word: question.word,
        selectedDefinition: selectedDefinition,
        correctDefinition: question.correctAnswer,
        isCorrect: isCorrect
    });
    
    // Update score display
    document.getElementById('score-display').textContent = 
        `Score: ${score}/${currentQuestionIndex + 1}`;
    
    // Show feedback
    showFeedback(isCorrect, question.correctAnswer);
    
    // Disable all choice buttons
    document.querySelectorAll('.answer-choice').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedDefinition && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
}

// Show feedback
function showFeedback(isCorrect, correctAnswer) {
    const feedback = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');
    
    feedback.classList.remove('hidden', 'correct-feedback', 'incorrect-feedback');
    
    if (isCorrect) {
        feedback.classList.add('correct-feedback');
        feedbackText.innerHTML = '✅ <strong>Correct!</strong> Well done!';
    } else {
        feedback.classList.add('incorrect-feedback');
        feedbackText.innerHTML = `❌ <strong>Incorrect.</strong> The correct answer is:<br><em>"${correctAnswer}"</em>`;
    }
}

// Next question
function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// Show results
function showResults() {
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('results-area').classList.remove('hidden');
    
    const percentage = Math.round((score / questions.length) * 100);
    
    document.getElementById('final-percentage').textContent = `${percentage}%`;
    document.getElementById('final-score-text').textContent = 
        `You scored ${score} out of ${questions.length}`;
    
    // Performance message
    let message = '';
    if (percentage === 100) {
        message = '🌟 Perfect score! You\'re a vocabulary master!';
    } else if (percentage >= 80) {
        message = '🎉 Great job! You have a strong vocabulary!';
    } else if (percentage >= 60) {
        message = '👍 Good work! Keep practicing to improve!';
    } else {
        message = '💪 Keep studying! Practice makes perfect!';
    }
    
    document.getElementById('performance-text').textContent = message;
    
    // Generate review list
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
                <p class="review-answer ${answer.isCorrect ? '' : 'wrong'}">${answer.selectedDefinition}</p>
                ${!answer.isCorrect ? `
                    <p class="review-label">Correct answer:</p>
                    <p class="review-answer correct-answer">${answer.correctDefinition}</p>
                ` : ''}
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

// Retry wrong answers only
function retryWrongAnswers() {
    // Filter questions that were answered incorrectly
    const wrongAnswers = answers.filter(answer => !answer.isCorrect);
    
    if (wrongAnswers.length === 0) {
        alert('You answered all questions correctly! No wrong answers to retry.');
        return;
    }
    
    // Recreate questions from wrong answers
    questions = wrongAnswers.map(answer => {
        const word = answer.word;
        const correctDef = answer.correctDefinition;
        
        // Find the original word data
        const wordData = quizWords.find(w => w.word === word);
        if (!wordData) return null;
        
        // Get other definitions for choices (get full word objects, not just definitions)
        const otherWords = quizWords.filter(w => w.word !== word);
        const shuffled = otherWords.sort(() => Math.random() - 0.5);
        const wrongChoices = shuffled.slice(0, 3);
        
        const choices = [wordData, ...wrongChoices].sort(() => Math.random() - 0.5);
        
        return {
            word: word,
            choices: choices,
            correctAnswer: correctDef
        };
    }).filter(q => q !== null);
    
    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    answers = [];
    
    document.getElementById('results-area').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    displayQuestion();
}

// Retake quiz
function retakeQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answers = [];
    
    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5);
    
    document.getElementById('results-area').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    displayQuestion();
}

// New quiz
function newQuiz() {
    document.getElementById('results-area').classList.add('hidden');
    document.querySelector('.controls-panel').classList.remove('hidden');
}
