// Fractions Practice Application
let currentType = 'simplify';
let questions = [];
let startTime = null;
let timerInterval = null;
let isChecked = false;
let isPaused = false;
let elapsedTime = 0;

// Configuration
const config = {
    maxNumerator: 20,
    maxDenominator: 20,
    rows: 5,
    cols: 4
};

// Type descriptions
const typeDescriptions = {
    'simplify': 'Reduce fractions to their simplest form',
    'addition': 'Add two fractions together',
    'subtraction': 'Subtract one fraction from another',
    'multiplication': 'Multiply two fractions',
    'division': 'Divide one fraction by another',
    'compare': 'Compare two fractions using <, >, or =',
    'equivalent': 'Find equivalent fractions',
    'mixed-conversion': 'Convert between mixed numbers and improper fractions',
    'decimal': 'Convert fractions to decimal numbers',
    'mixed-operations': 'Random mix of all fraction operations'
};

// Hints for each type
const hints = {
    'simplify': `
        <p><strong>To simplify a fraction:</strong></p>
        <ol>
            <li>Find the Greatest Common Factor (GCF) of the numerator and denominator</li>
            <li>Divide both the numerator and denominator by the GCF</li>
            <li>Example: 8/12 → GCF is 4 → 8÷4 / 12÷4 = 2/3</li>
        </ol>
    `,
    'addition': `
        <p><strong>To add fractions:</strong></p>
        <ol>
            <li>Find a common denominator (usually the Least Common Multiple)</li>
            <li>Convert both fractions to equivalent fractions with that denominator</li>
            <li>Add the numerators, keep the denominator</li>
            <li>Simplify if needed</li>
            <li>Example: 1/4 + 1/6 → 3/12 + 2/12 = 5/12</li>
        </ol>
    `,
    'subtraction': `
        <p><strong>To subtract fractions:</strong></p>
        <ol>
            <li>Find a common denominator</li>
            <li>Convert both fractions to equivalent fractions with that denominator</li>
            <li>Subtract the numerators, keep the denominator</li>
            <li>Simplify if needed</li>
            <li>Example: 3/4 - 1/6 → 9/12 - 2/12 = 7/12</li>
        </ol>
    `,
    'multiplication': `
        <p><strong>To multiply fractions:</strong></p>
        <ol>
            <li>Multiply the numerators together</li>
            <li>Multiply the denominators together</li>
            <li>Simplify the result</li>
            <li>Example: 2/3 × 3/4 = 6/12 = 1/2</li>
        </ol>
    `,
    'division': `
        <p><strong>To divide fractions:</strong></p>
        <ol>
            <li>Keep the first fraction</li>
            <li>Change division to multiplication</li>
            <li>Flip the second fraction (reciprocal)</li>
            <li>Multiply and simplify</li>
            <li>Example: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6</li>
        </ol>
    `,
    'compare': `
        <p><strong>To compare fractions:</strong></p>
        <ol>
            <li>Find a common denominator</li>
            <li>Convert both fractions</li>
            <li>Compare the numerators</li>
            <li>Or use cross-multiplication: compare a×d with b×c for a/b vs c/d</li>
        </ol>
    `,
    'equivalent': `
        <p><strong>To find equivalent fractions:</strong></p>
        <ol>
            <li>Multiply (or divide) both numerator and denominator by the same number</li>
            <li>The value stays the same</li>
            <li>Example: 2/3 = 4/6 = 6/9 = 8/12...</li>
        </ol>
    `,
    'mixed-conversion': `
        <p><strong>Improper to Mixed:</strong> Divide numerator by denominator. Quotient is whole number, remainder is new numerator.</p>
        <p><strong>Mixed to Improper:</strong> Multiply whole number by denominator, add numerator.</p>
        <p>Example: 7/3 = 2⅓ | 2⅓ = (2×3+1)/3 = 7/3</p>
    `,
    'decimal': `
        <p><strong>To convert fraction to decimal:</strong></p>
        <ol>
            <li>Divide the numerator by the denominator</li>
            <li>Round to 2-3 decimal places if needed</li>
            <li>Example: 3/4 = 3 ÷ 4 = 0.75</li>
        </ol>
    `
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    generateQuestions();
});

// Set up all event listeners
function setupEventListeners() {
    // Operation type buttons
    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.operation-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentType = this.dataset.type;
            document.getElementById('type-description').textContent = typeDescriptions[currentType];
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

    // Show hint button
    document.getElementById('show-hint-btn').addEventListener('click', function() {
        const hintSection = document.getElementById('hint-section');
        const hintContent = document.getElementById('hint-content');
        
        if (hintSection.style.display === 'none') {
            const hintText = hints[currentType] || hints[currentType.split('-')[0]] || '<p>Practice makes perfect!</p>';
            hintContent.innerHTML = hintText;
            hintSection.style.display = 'block';
            this.textContent = '🙈 Hide Hints';
        } else {
            hintSection.style.display = 'none';
            this.textContent = '💡 Show Hints';
        }
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
    ['max-numerator', 'max-denominator', 'grid-rows', 'grid-cols'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateConfig);
    });
}

// Update configuration from inputs
function updateConfig() {
    config.maxNumerator = parseInt(document.getElementById('max-numerator').value) || 20;
    config.maxDenominator = parseInt(document.getElementById('max-denominator').value) || 20;
    config.rows = parseInt(document.getElementById('grid-rows').value) || 5;
    config.cols = parseInt(document.getElementById('grid-cols').value) || 4;
}

// GCD function (Greatest Common Divisor)
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// LCM function (Least Common Multiple)
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

// Simplify a fraction
function simplifyFraction(num, den) {
    if (den === 0) return { numerator: 0, denominator: 1 };
    const divisor = gcd(num, den);
    return {
        numerator: num / divisor,
        denominator: den / divisor
    };
}

// Generate a random fraction
function generateFraction(maxNum = null, maxDen = null) {
    const mn = maxNum || config.maxNumerator;
    const md = maxDen || config.maxDenominator;
    const numerator = Math.floor(Math.random() * mn) + 1;         // [1, mn]
    const denominator = Math.floor(Math.random() * (md - 1)) + 2; // [2, md]
    return { numerator, denominator };
}

// Generate a simplifiable fraction
function generateSimplifiableFraction() {
    // factor must satisfy: factor*1 <= maxNumerator AND factor*2 <= maxDenominator
    const maxFactor = Math.min(6, config.maxNumerator, Math.floor(config.maxDenominator / 2));
    const factor = Math.floor(Math.random() * Math.max(1, maxFactor - 1)) + 2; // [2, maxFactor]
    const maxSimpleNum = Math.max(1, Math.floor(config.maxNumerator / factor));
    const maxSimpleDen = Math.max(2, Math.floor(config.maxDenominator / factor));
    const simpleNum = Math.floor(Math.random() * maxSimpleNum) + 1;
    const simpleDen = Math.floor(Math.random() * (maxSimpleDen - 1)) + 2;
    return {
        numerator: simpleNum * factor,
        denominator: simpleDen * factor
    };
}

// Generate improper fraction
function generateImproperFraction() {
    // denominator must be strictly less than numerator, both within config limits
    const maxDen = Math.min(config.maxDenominator, config.maxNumerator - 1);
    const denominator = Math.floor(Math.random() * (maxDen - 1)) + 2; // [2, maxDen]
    const maxExtra = config.maxNumerator - denominator; // >= 1 since maxDen <= maxNumerator-1
    const numerator = denominator + Math.floor(Math.random() * maxExtra) + 1;
    return { numerator, denominator };
}

// Convert improper to mixed number
function improperToMixed(num, den) {
    const whole = Math.floor(num / den);
    const remainder = num % den;
    return { whole, numerator: remainder, denominator: den };
}

// Convert mixed to improper
function mixedToImproper(whole, num, den) {
    return {
        numerator: whole * den + num,
        denominator: den
    };
}

// Generate all questions based on type
function generateQuestions() {
    questions = [];
    const totalQuestions = config.rows * config.cols;
    
    for (let i = 0; i < totalQuestions; i++) {
        let questionType = currentType;
        
        // For mixed operations, randomly select a type
        if (currentType === 'mixed-operations') {
            const types = ['simplify', 'addition', 'subtraction', 'multiplication', 'division', 'compare'];
            questionType = types[Math.floor(Math.random() * types.length)];
        }
        
        let question;
        switch (questionType) {
            case 'simplify':
                question = generateSimplifyQuestion();
                break;
            case 'addition':
                question = generateAdditionQuestion();
                break;
            case 'subtraction':
                question = generateSubtractionQuestion();
                break;
            case 'multiplication':
                question = generateMultiplicationQuestion();
                break;
            case 'division':
                question = generateDivisionQuestion();
                break;
            case 'compare':
                question = generateCompareQuestion();
                break;
            case 'equivalent':
                question = generateEquivalentQuestion();
                break;
            case 'mixed-conversion':
                question = generateMixedConversionQuestion();
                break;
            case 'decimal':
                question = generateDecimalQuestion();
                break;
        }
        
        questions.push(question);
    }
    
    renderQuestions();
    updateTimerButton();
}

// Generate simplify question
function generateSimplifyQuestion() {
    const frac = generateSimplifiableFraction();
    const answer = simplifyFraction(frac.numerator, frac.denominator);
    
    return {
        type: 'simplify',
        display: `<div class="fraction"><div class="numerator">${frac.numerator}</div><div class="denominator">${frac.denominator}</div></div>`,
        answer: answer,
        checkAnswer: (userNum, userDen) => {
            return parseInt(userNum) === answer.numerator && parseInt(userDen) === answer.denominator;
        }
    };
}

// Generate addition question
function generateAdditionQuestion() {
    const frac1 = generateFraction();
    const frac2 = generateFraction();
    
    const commonDen = lcm(frac1.denominator, frac2.denominator);
    const num1 = frac1.numerator * (commonDen / frac1.denominator);
    const num2 = frac2.numerator * (commonDen / frac2.denominator);
    const resultNum = num1 + num2;
    
    const answer = simplifyFraction(resultNum, commonDen);
    
    return {
        type: 'addition',
        display: `<div class="fraction"><div class="numerator">${frac1.numerator}</div><div class="denominator">${frac1.denominator}</div></div> + <div class="fraction"><div class="numerator">${frac2.numerator}</div><div class="denominator">${frac2.denominator}</div></div>`,
        answer: answer,
        checkAnswer: (userNum, userDen) => {
            const userSimplified = simplifyFraction(parseInt(userNum), parseInt(userDen));
            return userSimplified.numerator === answer.numerator && userSimplified.denominator === answer.denominator;
        }
    };
}

// Generate subtraction question
function generateSubtractionQuestion() {
    let frac1 = generateFraction();
    let frac2 = generateFraction();
    
    // Ensure frac1 > frac2 to avoid negative results
    if (frac1.numerator * frac2.denominator < frac2.numerator * frac1.denominator) {
        [frac1, frac2] = [frac2, frac1];
    }
    
    const commonDen = lcm(frac1.denominator, frac2.denominator);
    const num1 = frac1.numerator * (commonDen / frac1.denominator);
    const num2 = frac2.numerator * (commonDen / frac2.denominator);
    const resultNum = num1 - num2;
    
    const answer = simplifyFraction(resultNum, commonDen);
    
    return {
        type: 'subtraction',
        display: `<div class="fraction"><div class="numerator">${frac1.numerator}</div><div class="denominator">${frac1.denominator}</div></div> - <div class="fraction"><div class="numerator">${frac2.numerator}</div><div class="denominator">${frac2.denominator}</div></div>`,
        answer: answer,
        checkAnswer: (userNum, userDen) => {
            const userSimplified = simplifyFraction(parseInt(userNum), parseInt(userDen));
            return userSimplified.numerator === answer.numerator && userSimplified.denominator === answer.denominator;
        }
    };
}

// Generate multiplication question
function generateMultiplicationQuestion() {
    const frac1 = generateFraction();
    const frac2 = generateFraction();
    
    const resultNum = frac1.numerator * frac2.numerator;
    const resultDen = frac1.denominator * frac2.denominator;
    
    const answer = simplifyFraction(resultNum, resultDen);
    
    return {
        type: 'multiplication',
        display: `<div class="fraction"><div class="numerator">${frac1.numerator}</div><div class="denominator">${frac1.denominator}</div></div> × <div class="fraction"><div class="numerator">${frac2.numerator}</div><div class="denominator">${frac2.denominator}</div></div>`,
        answer: answer,
        checkAnswer: (userNum, userDen) => {
            const userSimplified = simplifyFraction(parseInt(userNum), parseInt(userDen));
            return userSimplified.numerator === answer.numerator && userSimplified.denominator === answer.denominator;
        }
    };
}

// Generate division question
function generateDivisionQuestion() {
    const frac1 = generateFraction();
    const frac2 = generateFraction();
    
    // Divide by flipping and multiplying
    const resultNum = frac1.numerator * frac2.denominator;
    const resultDen = frac1.denominator * frac2.numerator;
    
    const answer = simplifyFraction(resultNum, resultDen);
    
    return {
        type: 'division',
        display: `<div class="fraction"><div class="numerator">${frac1.numerator}</div><div class="denominator">${frac1.denominator}</div></div> ÷ <div class="fraction"><div class="numerator">${frac2.numerator}</div><div class="denominator">${frac2.denominator}</div></div>`,
        answer: answer,
        checkAnswer: (userNum, userDen) => {
            const userSimplified = simplifyFraction(parseInt(userNum), parseInt(userDen));
            return userSimplified.numerator === answer.numerator && userSimplified.denominator === answer.denominator;
        }
    };
}

// Generate compare question
function generateCompareQuestion() {
    const frac1 = generateFraction();
    const frac2 = generateFraction();
    
    const val1 = frac1.numerator / frac1.denominator;
    const val2 = frac2.numerator / frac2.denominator;
    
    let symbol;
    if (val1 < val2) symbol = '<';
    else if (val1 > val2) symbol = '>';
    else symbol = '=';
    
    return {
        type: 'compare',
        display: `<div class="fraction"><div class="numerator">${frac1.numerator}</div><div class="denominator">${frac1.denominator}</div></div> ___ <div class="fraction"><div class="numerator">${frac2.numerator}</div><div class="denominator">${frac2.denominator}</div></div>`,
        answer: symbol,
        checkAnswer: (userAnswer) => {
            return userAnswer.trim() === symbol;
        }
    };
}

// Generate equivalent fraction question
function generateEquivalentQuestion() {
    const baseFrac = generateFraction();
    const multiplier = Math.floor(Math.random() * 5) + 2;
    
    const choice = Math.random() < 0.5;
    
    if (choice) {
        // Given simplified, find equivalent
        return {
            type: 'equivalent',
            display: `<div class="fraction"><div class="numerator">${baseFrac.numerator}</div><div class="denominator">${baseFrac.denominator}</div></div> = <div class="fraction"><div class="numerator">?</div><div class="denominator">${baseFrac.denominator * multiplier}</div></div>`,
            answer: { numerator: baseFrac.numerator * multiplier, denominator: baseFrac.denominator * multiplier },
            checkAnswer: (userNum) => {
                return parseInt(userNum) === baseFrac.numerator * multiplier;
            }
        };
    } else {
        // Given equivalent, find simplified
        const largeNum = baseFrac.numerator * multiplier;
        const largeDen = baseFrac.denominator * multiplier;
        return {
            type: 'equivalent',
            display: `<div class="fraction"><div class="numerator">${largeNum}</div><div class="denominator">${largeDen}</div></div> = <div class="fraction"><div class="numerator">?</div><div class="denominator">${baseFrac.denominator}</div></div>`,
            answer: baseFrac,
            checkAnswer: (userNum) => {
                return parseInt(userNum) === baseFrac.numerator;
            }
        };
    }
}

// Generate mixed/improper conversion question
function generateMixedConversionQuestion() {
    const choice = Math.random() < 0.5;
    
    if (choice) {
        // Improper to mixed
        const improper = generateImproperFraction();
        const mixed = improperToMixed(improper.numerator, improper.denominator);
        
        return {
            type: 'mixed-conversion',
            display: `<div class="fraction"><div class="numerator">${improper.numerator}</div><div class="denominator">${improper.denominator}</div></div> = ?`,
            answer: mixed,
            isMixed: true,
            checkAnswer: (whole, num, den) => {
                return parseInt(whole) === mixed.whole && 
                       parseInt(num) === mixed.numerator && 
                       parseInt(den) === mixed.denominator;
            }
        };
    } else {
        // Mixed to improper
        const whole = Math.floor(Math.random() * 5) + 1;
        const frac = generateFraction();
        const improper = mixedToImproper(whole, frac.numerator, frac.denominator);
        
        return {
            type: 'mixed-conversion',
            display: `${whole}<div class="fraction"><div class="numerator">${frac.numerator}</div><div class="denominator">${frac.denominator}</div></div> = ?`,
            answer: improper,
            isMixed: false,
            checkAnswer: (userNum, userDen) => {
                return parseInt(userNum) === improper.numerator && 
                       parseInt(userDen) === improper.denominator;
            }
        };
    }
}

// Generate decimal conversion question
function generateDecimalQuestion() {
    const frac = generateFraction();
    const decimal = (frac.numerator / frac.denominator).toFixed(3);
    const answer = parseFloat(decimal);
    
    return {
        type: 'decimal',
        display: `<div class="fraction"><div class="numerator">${frac.numerator}</div><div class="denominator">${frac.denominator}</div></div> = ?`,
        answer: answer,
        checkAnswer: (userAnswer) => {
            const userNum = parseFloat(userAnswer);
            return Math.abs(userNum - answer) < 0.01; // Allow small rounding differences
        }
    };
}

// Render questions in the grid
function renderQuestions() {
    const grid = document.getElementById('questions-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
    
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        let inputHTML;
        if (q.type === 'compare') {
            inputHTML = `
                <input type="text" 
                       class="answer-input" 
                       data-index="${index}"
                       placeholder="<, >, ="
                       maxlength="1"
                       autocomplete="off">
            `;
        } else if (q.type === 'decimal') {
            inputHTML = `
                <input type="text" 
                       class="answer-input" 
                       data-index="${index}"
                       placeholder="0.00"
                       autocomplete="off"
                       inputmode="decimal">
            `;
        } else if (q.type === 'equivalent') {
            inputHTML = `
                <input type="number" 
                       class="answer-input" 
                       data-index="${index}"
                       placeholder="?"
                       autocomplete="off">
            `;
        } else if (q.type === 'mixed-conversion' && q.isMixed) {
            inputHTML = `
                <div class="answer-input-group">
                    <input type="number" class="answer-input" data-index="${index}" data-part="whole" placeholder="whole" style="width: 80px;">
                    <input type="number" class="answer-input" data-index="${index}" data-part="num" placeholder="num" style="width: 80px;">
                    <span class="fraction-slash">/</span>
                    <input type="number" class="answer-input" data-index="${index}" data-part="den" placeholder="den" style="width: 80px;">
                </div>
            `;
        } else {
            // Normal fraction answer (numerator/denominator)
            inputHTML = `
                <div class="answer-input-group">
                    <input type="number" class="answer-input" data-index="${index}" data-part="num" placeholder="num" autocomplete="off">
                    <span class="fraction-slash">/</span>
                    <input type="number" class="answer-input" data-index="${index}" data-part="den" placeholder="den" autocomplete="off">
                </div>
            `;
        }
        
        questionDiv.innerHTML = `
            <div class="question-text">${q.display}</div>
            ${inputHTML}
            <span class="result-icon"></span>
        `;
        grid.appendChild(questionDiv);
    });
    
    // Focus on first input
    const firstInput = grid.querySelector('.answer-input');
    if (firstInput) firstInput.focus();
}

// Check answers
function checkAnswers() {
    let correct = 0;
    const total = questions.length;
    
    questions.forEach((q, index) => {
        const questionDiv = document.querySelectorAll('.question-item')[index];
        const resultIcon = questionDiv.querySelector('.result-icon');
        
        let isCorrect = false;
        
        if (q.type === 'compare' || q.type === 'decimal') {
            const input = questionDiv.querySelector('.answer-input');
            const userAnswer = input.value.trim();
            isCorrect = q.checkAnswer(userAnswer);
        } else if (q.type === 'equivalent') {
            const input = questionDiv.querySelector('.answer-input');
            const userNum = input.value;
            isCorrect = q.checkAnswer(userNum);
        } else if (q.type === 'mixed-conversion' && q.isMixed) {
            const wholeInput = questionDiv.querySelector('[data-part="whole"]');
            const numInput = questionDiv.querySelector('[data-part="num"]');
            const denInput = questionDiv.querySelector('[data-part="den"]');
            isCorrect = q.checkAnswer(wholeInput.value, numInput.value, denInput.value);
        } else {
            // Fraction answer
            const numInput = questionDiv.querySelector('[data-part="num"]');
            const denInput = questionDiv.querySelector('[data-part="den"]');
            isCorrect = q.checkAnswer(numInput.value, denInput.value);
        }
        
        if (isCorrect) {
            correct++;
            resultIcon.textContent = '✓';
            resultIcon.style.color = '#4caf50';
            questionDiv.classList.add('correct');
        } else {
            resultIcon.textContent = '✗';
            resultIcon.style.color = '#f44336';
            questionDiv.classList.add('incorrect');
        }
    });
    
    showScore(correct, total);
}

// Show score
function showScore(correct, total) {
    const percentage = Math.round((correct / total) * 100);
    const finalTime = document.getElementById('timer').textContent;
    
    document.getElementById('final-score').textContent = `${correct}/${total}`;
    document.getElementById('percentage').textContent = `${percentage}%`;
    document.getElementById('final-time').textContent = finalTime;
    document.getElementById('score-display').style.display = 'block';
}

// Hide score
function hideScore() {
    document.getElementById('score-display').style.display = 'none';
    // Clear all result icons
    document.querySelectorAll('.result-icon').forEach(icon => {
        icon.textContent = '';
    });
    document.querySelectorAll('.question-item').forEach(item => {
        item.classList.remove('correct', 'incorrect');
    });
}

// Timer functions
function startTimer() {
    if (isPaused) {
        startTime = Date.now() - elapsedTime;
        isPaused = false;
    } else {
        elapsedTime = 0;
        startTime = Date.now();
    }
    
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
    updateTimerButton();
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        elapsedTime = Date.now() - startTime;
        isPaused = true;
    }
    updateTimerButton();
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    startTime = null;
    elapsedTime = 0;
    isPaused = false;
    document.getElementById('timer').textContent = '00:00';
    updateTimerButton();
}

function updateTimer() {
    if (!startTime) return;
    
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor(elapsed / 1000 / 60);
    
    document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toggleTimer() {
    if (timerInterval) {
        stopTimer();
    } else {
        startTimer();
    }
}

function updateTimerButton() {
    const btn = document.getElementById('timer-btn');
    if (timerInterval) {
        btn.textContent = '⏸️';
    } else {
        btn.textContent = '▶️';
    }
}
