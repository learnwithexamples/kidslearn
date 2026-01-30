// Math Fact Sheet Application
let currentOperation = '+';
let questions = [];
let startTime = null;
let timerInterval = null;
let isChecked = false;
let isPaused = false;
let elapsedTime = 0;

// Configuration
const config = {
    aMin: 1,
    aMax: 99,
    aDecimals: 0,
    bMin: 1,
    bMax: 99,
    bDecimals: 0,
    rows: 6,
    cols: 10
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    generateQuestions();
});

// Set up all event listeners
function setupEventListeners() {
    // Operation buttons
    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.operation-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentOperation = this.dataset.operation;
        });
    });

    // Generate button
    document.getElementById('generate-btn').addEventListener('click', function() {
        updateConfig();
        generateQuestions();
        resetTimer();
        hideScore();
        isChecked = false;
    });

    // Check button
    document.getElementById('check-btn').addEventListener('click', function() {
        checkAnswers();
        if (!isChecked) {
            stopTimer();
            isChecked = true;
        }
    });

    // Timer control button
    document.getElementById('timer-btn').addEventListener('click', function() {
        toggleTimer();
    });

    // Configuration inputs
    ['a-min', 'a-max', 'a-decimals', 'b-min', 'b-max', 'b-decimals', 'grid-rows', 'grid-cols'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateConfig);
    });
}

// Update configuration from inputs
function updateConfig() {
    config.aMin = parseInt(document.getElementById('a-min').value) || 1;
    config.aMax = parseInt(document.getElementById('a-max').value) || 99;
    config.aDecimals = parseInt(document.getElementById('a-decimals').value) || 0;
    config.bMin = parseInt(document.getElementById('b-min').value) || 1;
    config.bMax = parseInt(document.getElementById('b-max').value) || 99;
    config.bDecimals = parseInt(document.getElementById('b-decimals').value) || 0;
    config.rows = parseInt(document.getElementById('grid-rows').value) || 6;
    config.cols = parseInt(document.getElementById('grid-cols').value) || 10;
    
    // Ensure max >= min
    if (config.aMax < config.aMin) {
        config.aMax = config.aMin;
        document.getElementById('a-max').value = config.aMax;
    }
    if (config.bMax < config.bMin) {
        config.bMax = config.bMin;
        document.getElementById('b-max').value = config.bMax;
    }
}

// Generate a random number based on configuration
function generateNumber(min, max, decimals) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    
    if (decimals > 0) {
        const decimalPart = Math.random().toFixed(decimals).substring(2);
        num = parseFloat(num + '.' + decimalPart);
    }
    
    return num;
}

// Generate all questions
function generateQuestions() {
    questions = [];
    const totalQuestions = config.rows * config.cols;
    
    for (let i = 0; i < totalQuestions; i++) {
        let a = generateNumber(config.aMin, config.aMax, config.aDecimals);
        let b = generateNumber(config.bMin, config.bMax, config.bDecimals);
        
        // For subtraction, ensure a >= b to avoid negative results for kids
        if (currentOperation === '-' && a < b) {
            [a, b] = [b, a];
        }
        
        // For division, ensure b is not zero and result is reasonable
        if (currentOperation === '/') {
            if (b === 0) b = 1;
            // Make it easier by ensuring a is divisible by b for whole number results
            if (config.aDecimals === 0 && config.bDecimals === 0) {
                a = b * Math.floor(Math.random() * 10 + 1);
            }
        }
        
        const answer = calculateAnswer(a, b, currentOperation);
        
        questions.push({ a, b, answer, userAnswer: null });
    }
    
    renderQuestions();
    // Don't start timer automatically
    updateTimerButton();
}

// Calculate the correct answer
function calculateAnswer(a, b, operation) {
    let result;
    switch (operation) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            result = a / b;
            break;
        default:
            result = 0;
    }
    
    // Round to avoid floating point precision issues
    return Math.round(result * 1000) / 1000;
}

// Render questions in the grid
function renderQuestions() {
    const grid = document.getElementById('questions-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
    
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="question-text">${q.a} ${currentOperation} ${q.b} =</div>
            <input type="text" 
                   class="answer-input" 
                   data-index="${index}"
                   autocomplete="off"
                   inputmode="decimal">
            <span class="result-icon"></span>
        `;
        grid.appendChild(questionDiv);
    });
    
    // Set up arrow key navigation
    setupKeyboardNavigation();
    
    // Focus on first input
    const firstInput = grid.querySelector('.answer-input');
    if (firstInput) firstInput.focus();
}

// Setup keyboard navigation between inputs
function setupKeyboardNavigation() {
    const inputs = document.querySelectorAll('.answer-input');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            const currentIndex = parseInt(this.dataset.index);
            const row = Math.floor(currentIndex / config.cols);
            const col = currentIndex % config.cols;
            let newIndex = currentIndex;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    if (row > 0) {
                        newIndex = (row - 1) * config.cols + col;
                    }
                    break;
                case 'ArrowDown':
                case 'Enter':
                    e.preventDefault();
                    if (row < config.rows - 1) {
                        newIndex = (row + 1) * config.cols + col;
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (col > 0) {
                        newIndex = currentIndex - 1;
                    }
                    break;
                case 'ArrowRight':
                case 'Tab':
                    if (e.key === 'Tab') e.preventDefault();
                    if (col < config.cols - 1) {
                        newIndex = currentIndex + 1;
                    } else if (row < config.rows - 1) {
                        newIndex = (row + 1) * config.cols;
                    }
                    break;
            }
            
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < inputs.length) {
                inputs[newIndex].focus();
            }
        });
    });
}

// Timer functions
function startTimer() {
    if (isPaused) {
        // Resume from pause
        startTime = Date.now() - elapsedTime;
        isPaused = false;
    } else {
        // Fresh start
        elapsedTime = 0;
        startTime = Date.now();
    }
    
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
    updateTimerButton();
}

function updateTimer() {
    if (!startTime || isPaused) return;
    
    elapsedTime = Date.now() - startTime;
    const elapsed = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isPaused = false;
    updateTimerButton();
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isPaused = true;
    updateTimerButton();
}

function toggleTimer() {
    if (isPaused || !timerInterval) {
        startTimer();
    } else {
        pauseTimer();
    }
}

function resetTimer() {
    stopTimer();
    startTime = null;
    elapsedTime = 0;
    isPaused = false;
    document.getElementById('timer').textContent = '00:00';
    updateTimerButton();
}

function updateTimerButton() {
    const btn = document.getElementById('timer-btn');
    if (!timerInterval || isPaused) {
        btn.textContent = '▶️ Start';
        btn.classList.remove('paused');
    } else {
        btn.textContent = '⏸️ Pause';
        btn.classList.add('paused');
    }
}

// Check all answers
function checkAnswers() {
    const inputs = document.querySelectorAll('.answer-input');
    let correct = 0;
    let total = questions.length;
    
    inputs.forEach((input, index) => {
        const userAnswer = parseFloat(input.value) || null;
        questions[index].userAnswer = userAnswer;
        
        const questionItem = input.closest('.question-item');
        const resultIcon = questionItem.querySelector('.result-icon');
        
        // Clear previous states
        questionItem.classList.remove('correct', 'incorrect');
        
        if (userAnswer !== null) {
            const isCorrect = Math.abs(userAnswer - questions[index].answer) < 0.001;
            
            if (isCorrect) {
                questionItem.classList.add('correct');
                resultIcon.textContent = '✓';
                resultIcon.title = '';
                correct++;
            } else {
                questionItem.classList.add('incorrect');
                resultIcon.textContent = '✗';
                resultIcon.title = `Correct answer: ${questions[index].answer}`;
            }
        } else {
            questionItem.classList.add('incorrect');
            resultIcon.textContent = '✗';
            resultIcon.title = `Correct answer: ${questions[index].answer}`;
        }
    });
    
    showScore(correct, total);
}

// Show the score
function showScore(correct, total) {
    const scoreDisplay = document.getElementById('score-display');
    const scoreValue = document.getElementById('score-value');
    const percentage = Math.round((correct / total) * 100);
    
    scoreValue.textContent = `${correct}/${total} (${percentage}%)`;
    scoreDisplay.classList.remove('hidden');
}

// Hide the score
function hideScore() {
    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.classList.add('hidden');
}
