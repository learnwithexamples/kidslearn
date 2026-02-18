// Mental Math Practice Application
let currentMode = 'speed-drill';
let currentDifficulty = 'medium';
let selectedOperations = ['addition', 'subtraction', 'multiplication', 'division'];
let timeLimit = 60;
let questionCount = 20;

// Session state
let sessionActive = false;
let currentQuestion = null;
let questionsAnswered = 0;
let correctAnswers = 0;
let currentStreak = 0;
let bestStreak = 0;
let sessionStartTime = null;
let timerInterval = null;
let timeRemaining = 0;
let questionStartTime = null;
let totalTimeSpent = 0;

// Difficulty settings
const difficultySettings = {
    easy: {
        addition: { min: 1, max: 20 },
        subtraction: { min: 1, max: 20 },
        multiplication: { min: 1, max: 10 },
        division: { min: 1, max: 10 },
        squares: { min: 1, max: 10 },
        percentages: { values: [10, 25, 50, 75], max: 100 },
        estimation: { min: 10, max: 100 }
    },
    medium: {
        addition: { min: 10, max: 99 },
        subtraction: { min: 10, max: 99 },
        multiplication: { min: 5, max: 15 },
        division: { min: 2, max: 15 },
        squares: { min: 5, max: 15 },
        percentages: { values: [10, 15, 20, 25, 30, 50, 75], max: 200 },
        estimation: { min: 50, max: 500 }
    },
    hard: {
        addition: { min: 50, max: 999 },
        subtraction: { min: 50, max: 999 },
        multiplication: { min: 10, max: 25 },
        division: { min: 5, max: 25 },
        squares: { min: 10, max: 25 },
        percentages: { values: [12, 15, 18, 20, 25, 30, 35, 40, 60, 75, 80], max: 500 },
        estimation: { min: 100, max: 5000 }
    },
    expert: {
        addition: { min: 100, max: 9999 },
        subtraction: { min: 100, max: 9999 },
        multiplication: { min: 15, max: 99 },
        division: { min: 10, max: 99 },
        squares: { min: 15, max: 50 },
        percentages: { values: [12, 15, 17, 18, 22, 28, 33, 45, 66, 78, 85, 92], max: 1000 },
        estimation: { min: 1000, max: 50000 }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Mode selection
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
        });
    });

    // Operation selection (multi-select)
    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            updateSelectedOperations();
        });
    });

    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDifficulty = this.dataset.difficulty;
        });
    });

    // Start button
    document.getElementById('start-btn').addEventListener('click', startSession);

    // Answer input
    const answerInput = document.getElementById('answer-input');
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });

    // Submit button
    document.getElementById('submit-btn').addEventListener('click', submitAnswer);

    // Skip button
    document.getElementById('skip-btn').addEventListener('click', skipQuestion);

    // Stop button
    document.getElementById('stop-btn').addEventListener('click', stopSession);

    // Retry button
    document.getElementById('retry-btn').addEventListener('click', function() {
        showScreen('practice-screen');
        resetSession();
        startSession();
    });

    // Change settings button
    document.getElementById('change-settings-btn').addEventListener('click', function() {
        showScreen('setup-screen');
        resetSession();
    });
}

// Update selected operations
function updateSelectedOperations() {
    selectedOperations = [];
    document.querySelectorAll('.operation-btn.active').forEach(btn => {
        selectedOperations.push(btn.dataset.operation);
    });
    
    // Ensure at least one operation is selected
    if (selectedOperations.length === 0) {
        document.querySelector('.operation-btn').classList.add('active');
        selectedOperations = ['addition'];
    }
}

// Show screen
function showScreen(screenId) {
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('practice-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById(screenId).style.display = 'block';
}

// Start session
function startSession() {
    sessionActive = true;
    questionsAnswered = 0;
    correctAnswers = 0;
    currentStreak = 0;
    bestStreak = 0;
    sessionStartTime = Date.now();
    totalTimeSpent = 0;
    
    timeLimit = parseInt(document.getElementById('time-limit').value) || 60;
    questionCount = parseInt(document.getElementById('question-count').value) || 20;
    
    showScreen('practice-screen');
    
    // Start timer based on mode
    if (currentMode === 'speed-drill' || currentMode === 'progressive') {
        timeRemaining = timeLimit;
        startTimer();
    }
    
    updateStats();
    generateNewQuestion();
    
    // Focus on input
    document.getElementById('answer-input').focus();
}

// Reset session
function resetSession() {
    sessionActive = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    document.getElementById('answer-input').value = '';
    document.getElementById('feedback-message').textContent = '';
}

// Start timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('time-remaining').textContent = formatTime(timeRemaining);
        
        if (timeRemaining <= 0) {
            stopSession();
        }
    }, 1000);
}

// Format time
function formatTime(seconds) {
    if (seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

// Generate new question
function generateNewQuestion() {
    if (!sessionActive) return;
    
    // Check if timed test is complete
    if (currentMode === 'timed-test' && questionsAnswered >= questionCount) {
        stopSession();
        return;
    }
    
    // For progressive mode, increase difficulty
    let difficulty = currentDifficulty;
    if (currentMode === 'progressive') {
        if (questionsAnswered > 20) difficulty = 'expert';
        else if (questionsAnswered > 10) difficulty = 'hard';
        else if (questionsAnswered > 5) difficulty = 'medium';
        else difficulty = 'easy';
    }
    
    // Select random operation from selected operations
    const operation = selectedOperations[Math.floor(Math.random() * selectedOperations.length)];
    
    // Generate question based on operation
    switch (operation) {
        case 'addition':
            currentQuestion = generateAddition(difficulty);
            break;
        case 'subtraction':
            currentQuestion = generateSubtraction(difficulty);
            break;
        case 'multiplication':
            currentQuestion = generateMultiplication(difficulty);
            break;
        case 'division':
            currentQuestion = generateDivision(difficulty);
            break;
        case 'squares':
            currentQuestion = generateSquares(difficulty);
            break;
        case 'percentages':
            currentQuestion = generatePercentages(difficulty);
            break;
        case 'estimation':
            currentQuestion = generateEstimation(difficulty);
            break;
    }
    
    // Display question
    document.getElementById('question-display').textContent = currentQuestion.question;
    document.getElementById('answer-input').value = '';
    document.getElementById('feedback-message').textContent = '';
    questionStartTime = Date.now();
    
    // Focus on input
    document.getElementById('answer-input').focus();
}

// Generate addition question
function generateAddition(difficulty) {
    const settings = difficultySettings[difficulty].addition;
    const a = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    const b = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    
    return {
        question: `${a} + ${b}`,
        answer: a + b,
        operation: 'addition'
    };
}

// Generate subtraction question
function generateSubtraction(difficulty) {
    const settings = difficultySettings[difficulty].subtraction;
    let a = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    let b = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    
    // Ensure a >= b for positive results
    if (a < b) [a, b] = [b, a];
    
    return {
        question: `${a} - ${b}`,
        answer: a - b,
        operation: 'subtraction'
    };
}

// Generate multiplication question
function generateMultiplication(difficulty) {
    const settings = difficultySettings[difficulty].multiplication;
    const a = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    const b = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    
    return {
        question: `${a} × ${b}`,
        answer: a * b,
        operation: 'multiplication'
    };
}

// Generate division question
function generateDivision(difficulty) {
    const settings = difficultySettings[difficulty].division;
    const b = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    const quotient = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    const a = b * quotient; // Ensure whole number result
    
    return {
        question: `${a} ÷ ${b}`,
        answer: quotient,
        operation: 'division'
    };
}

// Generate squares question
function generateSquares(difficulty) {
    const settings = difficultySettings[difficulty].squares;
    const n = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    
    return {
        question: `${n}²`,
        answer: n * n,
        operation: 'squares'
    };
}

// Generate percentages question
function generatePercentages(difficulty) {
    const settings = difficultySettings[difficulty].percentages;
    const percent = settings.values[Math.floor(Math.random() * settings.values.length)];
    const num = Math.floor(Math.random() * settings.max) + 10;
    
    return {
        question: `${percent}% of ${num}`,
        answer: Math.round((percent / 100) * num),
        operation: 'percentages',
        tolerance: 1 // Allow rounding difference
    };
}

// Generate estimation question
function generateEstimation(difficulty) {
    const settings = difficultySettings[difficulty].estimation;
    const a = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    const b = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    if (op === '+') answer = a + b;
    else if (op === '-') answer = Math.abs(a - b);
    else answer = a * b;
    
    // Round to nearest appropriate value
    const roundTo = answer > 1000 ? 100 : answer > 100 ? 10 : 5;
    answer = Math.round(answer / roundTo) * roundTo;
    
    return {
        question: `${a} ${op} ${b} ≈ ?`,
        answer: answer,
        operation: 'estimation',
        tolerance: Math.max(Math.round(answer * 0.1), roundTo) // 10% tolerance
    };
}

// Submit answer
function submitAnswer() {
    if (!sessionActive || !currentQuestion) return;
    
    const userAnswer = parseFloat(document.getElementById('answer-input').value);
    
    if (isNaN(userAnswer)) {
        document.getElementById('feedback-message').textContent = 'Please enter a number!';
        document.getElementById('feedback-message').className = 'feedback-message';
        return;
    }
    
    // Calculate time for this question
    const questionTime = Date.now() - questionStartTime;
    totalTimeSpent += questionTime;
    
    // Check answer
    const tolerance = currentQuestion.tolerance || 0;
    const isCorrect = Math.abs(userAnswer - currentQuestion.answer) <= tolerance;
    
    questionsAnswered++;
    
    if (isCorrect) {
        correctAnswers++;
        currentStreak++;
        if (currentStreak > bestStreak) bestStreak = currentStreak;
        
        document.getElementById('feedback-message').textContent = getPositiveFeedback();
        document.getElementById('feedback-message').className = 'feedback-message correct';
    } else {
        currentStreak = 0;
        
        document.getElementById('feedback-message').textContent = 
            `❌ Incorrect! Answer: ${currentQuestion.answer}`;
        document.getElementById('feedback-message').className = 'feedback-message incorrect';
    }
    
    updateStats();
    
    // Generate next question after short delay
    setTimeout(() => {
        if (sessionActive) {
            generateNewQuestion();
        }
    }, 1000);
}

// Skip question
function skipQuestion() {
    if (!sessionActive || !currentQuestion) return;
    
    questionsAnswered++;
    currentStreak = 0;
    
    document.getElementById('feedback-message').textContent = 
        `⏭️ Skipped! Answer was: ${currentQuestion.answer}`;
    document.getElementById('feedback-message').className = 'feedback-message';
    
    updateStats();
    
    setTimeout(() => {
        if (sessionActive) {
            generateNewQuestion();
        }
    }, 1000);
}

// Get positive feedback
function getPositiveFeedback() {
    const messages = [
        '✓ Correct!',
        '🎉 Great job!',
        '⭐ Excellent!',
        '🌟 Perfect!',
        '👏 Well done!',
        '🚀 Amazing!',
        '💯 Fantastic!',
        '🎯 Right on!',
        '✨ Brilliant!',
        '🏆 Outstanding!'
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
}

// Update stats display
function updateStats() {
    document.getElementById('questions-answered').textContent = questionsAnswered;
    document.getElementById('correct-count').textContent = correctAnswers;
    
    const accuracy = questionsAnswered > 0 
        ? Math.round((correctAnswers / questionsAnswered) * 100) 
        : 100;
    document.getElementById('accuracy-display').textContent = `${accuracy}%`;
    
    // Update streak display
    if (currentStreak >= 3) {
        const fires = '🔥'.repeat(Math.min(Math.floor(currentStreak / 3), 5));
        document.getElementById('streak-display').textContent = 
            `${fires} ${currentStreak} in a row! ${fires}`;
    } else {
        document.getElementById('streak-display').textContent = '';
    }
    
    // Update time display for timed test
    if (currentMode === 'timed-test') {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        document.getElementById('time-remaining').textContent = formatTime(elapsed);
    }
}

// Stop session
function stopSession() {
    sessionActive = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Calculate stats
    const totalTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    const accuracy = questionsAnswered > 0 
        ? Math.round((correctAnswers / questionsAnswered) * 100) 
        : 0;
    const avgTime = questionsAnswered > 0 
        ? (totalTimeSpent / questionsAnswered / 1000).toFixed(1) 
        : 0;
    
    // Display results
    document.getElementById('result-total').textContent = questionsAnswered;
    document.getElementById('result-correct').textContent = correctAnswers;
    document.getElementById('result-accuracy').textContent = `${accuracy}%`;
    document.getElementById('result-time').textContent = `${totalTime}s`;
    document.getElementById('result-avg-time').textContent = `${avgTime}s`;
    document.getElementById('result-streak').textContent = bestStreak;
    
    // Performance message
    let message = '';
    if (accuracy >= 95) {
        message = '🏆 Outstanding performance! You\'re a mental math master!';
    } else if (accuracy >= 85) {
        message = '🌟 Excellent work! Keep practicing!';
    } else if (accuracy >= 70) {
        message = '👍 Good job! You\'re improving!';
    } else if (accuracy >= 50) {
        message = '💪 Nice effort! Keep practicing to improve!';
    } else {
        message = '📚 Keep practicing! You\'ll get better!';
    }
    
    if (bestStreak >= 10) {
        message += ' 🔥 Amazing streak!';
    }
    
    document.getElementById('performance-message').textContent = message;
    
    showScreen('results-screen');
}
