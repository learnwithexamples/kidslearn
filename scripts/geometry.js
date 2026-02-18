// Geometry Practice Application
let currentProblemType = 'area';
let currentDifficulty = 'medium';
let currentProblem = null;
let score = 0;
let totalProblems = 0;
let identifyScore = 0;
let identifyTotal = 0;
let currentShape = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupCanvas();
});

// Setup event listeners
function setupEventListeners() {
    // Topic tabs
    document.querySelectorAll('.topic-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.topic-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const topic = this.dataset.topic;
            document.getElementById('practice-section').style.display = topic === 'practice' ? 'block' : 'none';
            document.getElementById('reference-section').style.display = topic === 'reference' ? 'block' : 'none';
            document.getElementById('identify-section').style.display = topic === 'identify' ? 'block' : 'none';
            
            if (topic === 'identify') {
                generateIdentifyQuestion();
            }
        });
    });

    // Problem type cards
    document.querySelectorAll('.shape-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.shape-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentProblemType = this.dataset.type;
        });
    });

    // Difficulty buttons
    document.querySelectorAll('[data-difficulty]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-difficulty]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDifficulty = this.dataset.difficulty;
        });
    });

    // Generate button
    document.getElementById('generate-btn').addEventListener('click', generateProblem);

    // Show formula button
    document.getElementById('show-formula-btn').addEventListener('click', toggleFormula);

    // Check answer button
    document.getElementById('check-answer-btn').addEventListener('click', checkAnswer);

    // Next shape button
    document.getElementById('next-shape-btn').addEventListener('click', generateIdentifyQuestion);
}

// Setup canvas
function setupCanvas() {
    const canvas = document.getElementById('shape-canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Generate problem
function generateProblem() {
    totalProblems++;
    document.getElementById('total').textContent = totalProblems;
    
    switch (currentProblemType) {
        case 'area':
            currentProblem = generateAreaProblem();
            break;
        case 'perimeter':
            currentProblem = generatePerimeterProblem();
            break;
        case 'volume':
            currentProblem = generateVolumeProblem();
            break;
        case 'angles':
            currentProblem = generateAngleProblem();
            break;
    }
    
    displayProblem();
}

// Generate area problem
function generateAreaProblem() {
    const shapes = ['rectangle', 'square', 'triangle', 'circle', 'parallelogram'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    let problem = { shape, type: 'area' };
    
    const range = currentDifficulty === 'easy' ? [3, 10] : 
                  currentDifficulty === 'medium' ? [5, 20] : [10, 50];
    
    switch (shape) {
        case 'rectangle':
            problem.length = randomInt(range[0], range[1]);
            problem.width = randomInt(range[0], range[1]);
            problem.answer = problem.length * problem.width;
            problem.formula = 'Area = length × width';
            problem.unit = 'square units';
            break;
            
        case 'square':
            problem.side = randomInt(range[0], range[1]);
            problem.answer = problem.side * problem.side;
            problem.formula = 'Area = side²';
            problem.unit = 'square units';
            break;
            
        case 'triangle':
            problem.base = randomInt(range[0], range[1]);
            problem.height = randomInt(range[0], range[1]);
            problem.answer = (problem.base * problem.height) / 2;
            problem.formula = 'Area = ½ × base × height';
            problem.unit = 'square units';
            break;
            
        case 'circle':
            problem.radius = randomInt(range[0], Math.floor(range[1] / 2));
            problem.answer = Math.round(Math.PI * problem.radius * problem.radius * 100) / 100;
            problem.formula = 'Area = πr² (use π ≈ 3.14)';
            problem.unit = 'square units';
            break;
            
        case 'parallelogram':
            problem.base = randomInt(range[0], range[1]);
            problem.height = randomInt(range[0], range[1]);
            problem.answer = problem.base * problem.height;
            problem.formula = 'Area = base × height';
            problem.unit = 'square units';
            break;
    }
    
    return problem;
}

// Generate perimeter problem
function generatePerimeterProblem() {
    const shapes = ['rectangle', 'square', 'triangle', 'circle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    let problem = { shape, type: 'perimeter' };
    
    const range = currentDifficulty === 'easy' ? [3, 10] : 
                  currentDifficulty === 'medium' ? [5, 20] : [10, 50];
    
    switch (shape) {
        case 'rectangle':
            problem.length = randomInt(range[0], range[1]);
            problem.width = randomInt(range[0], range[1]);
            problem.answer = 2 * (problem.length + problem.width);
            problem.formula = 'Perimeter = 2(length + width)';
            problem.unit = 'units';
            break;
            
        case 'square':
            problem.side = randomInt(range[0], range[1]);
            problem.answer = 4 * problem.side;
            problem.formula = 'Perimeter = 4 × side';
            problem.unit = 'units';
            break;
            
        case 'triangle':
            problem.side1 = randomInt(range[0], range[1]);
            problem.side2 = randomInt(range[0], range[1]);
            problem.side3 = randomInt(range[0], range[1]);
            problem.answer = problem.side1 + problem.side2 + problem.side3;
            problem.formula = 'Perimeter = side1 + side2 + side3';
            problem.unit = 'units';
            break;
            
        case 'circle':
            problem.radius = randomInt(range[0], Math.floor(range[1] / 2));
            problem.answer = Math.round(2 * Math.PI * problem.radius * 100) / 100;
            problem.formula = 'Circumference = 2πr (use π ≈ 3.14)';
            problem.unit = 'units';
            break;
    }
    
    return problem;
}

// Generate volume problem
function generateVolumeProblem() {
    const shapes = ['cube', 'rectangular-prism', 'cylinder', 'sphere'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    let problem = { shape, type: 'volume' };
    
    const range = currentDifficulty === 'easy' ? [2, 8] : 
                  currentDifficulty === 'medium' ? [3, 12] : [5, 20];
    
    switch (shape) {
        case 'cube':
            problem.side = randomInt(range[0], range[1]);
            problem.answer = Math.pow(problem.side, 3);
            problem.formula = 'Volume = side³';
            problem.unit = 'cubic units';
            break;
            
        case 'rectangular-prism':
            problem.length = randomInt(range[0], range[1]);
            problem.width = randomInt(range[0], range[1]);
            problem.height = randomInt(range[0], range[1]);
            problem.answer = problem.length * problem.width * problem.height;
            problem.formula = 'Volume = length × width × height';
            problem.unit = 'cubic units';
            break;
            
        case 'cylinder':
            problem.radius = randomInt(range[0], Math.floor(range[1] / 2));
            problem.height = randomInt(range[0], range[1]);
            problem.answer = Math.round(Math.PI * problem.radius * problem.radius * problem.height * 100) / 100;
            problem.formula = 'Volume = πr²h (use π ≈ 3.14)';
            problem.unit = 'cubic units';
            break;
            
        case 'sphere':
            problem.radius = randomInt(range[0], Math.floor(range[1] / 2));
            problem.answer = Math.round((4/3) * Math.PI * Math.pow(problem.radius, 3) * 100) / 100;
            problem.formula = 'Volume = (4/3)πr³ (use π ≈ 3.14)';
            problem.unit = 'cubic units';
            break;
    }
    
    return problem;
}

// Generate angle problem
function generateAngleProblem() {
    const types = ['triangle', 'straight-line', 'around-point'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let problem = { shape: type, type: 'angles' };
    
    switch (type) {
        case 'triangle':
            problem.angle1 = randomInt(30, 80);
            problem.angle2 = randomInt(30, 80);
            problem.answer = 180 - problem.angle1 - problem.angle2;
            problem.formula = 'Triangle angles sum = 180°';
            problem.unit = 'degrees';
            break;
            
        case 'straight-line':
            problem.angle1 = randomInt(40, 140);
            problem.answer = 180 - problem.angle1;
            problem.formula = 'Angles on a straight line = 180°';
            problem.unit = 'degrees';
            break;
            
        case 'around-point':
            problem.angle1 = randomInt(60, 120);
            problem.angle2 = randomInt(60, 120);
            problem.angle3 = randomInt(40, 100);
            problem.answer = 360 - problem.angle1 - problem.angle2 - problem.angle3;
            problem.formula = 'Angles around a point = 360°';
            problem.unit = 'degrees';
            break;
    }
    
    return problem;
}

// Display problem
function displayProblem() {
    const problem = currentProblem;
    
    // Update description
    let description = '';
    switch (problem.type) {
        case 'area':
            description = `Find the area of the ${formatShapeName(problem.shape)}`;
            break;
        case 'perimeter':
            description = problem.shape === 'circle' ? 
                `Find the circumference of the circle` :
                `Find the perimeter of the ${formatShapeName(problem.shape)}`;
            break;
        case 'volume':
            description = `Find the volume of the ${formatShapeName(problem.shape)}`;
            break;
        case 'angles':
            description = `Find the missing angle`;
            break;
    }
    document.getElementById('problem-description').textContent = description;
    
    // Draw shape
    drawShape(problem);
    
    // Create input
    const inputsDiv = document.getElementById('answer-inputs');
    inputsDiv.innerHTML = `
        <div class="answer-row">
            <label>Answer:</label>
            <input type="number" id="answer-input" step="0.01" placeholder="Enter answer">
            <span class="unit">${problem.unit}</span>
        </div>
    `;
    
    // Show check button
    document.getElementById('check-answer-btn').style.display = 'inline-block';
    document.getElementById('feedback').textContent = '';
    
    // Focus input
    document.getElementById('answer-input').focus();
    
    // Hide formula
    document.getElementById('formula-display').style.display = 'none';
}

// Draw shape on canvas
function drawShape(problem) {
    const canvas = document.getElementById('shape-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#667eea';
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.lineWidth = 3;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    switch (problem.shape) {
        case 'rectangle':
            drawRectangle(ctx, centerX, centerY, problem);
            break;
        case 'square':
            drawSquare(ctx, centerX, centerY, problem);
            break;
        case 'triangle':
            drawTriangle(ctx, centerX, centerY, problem);
            break;
        case 'circle':
            drawCircle(ctx, centerX, centerY, problem);
            break;
        case 'parallelogram':
            drawParallelogram(ctx, centerX, centerY, problem);
            break;
        case 'cube':
            drawCube(ctx, centerX, centerY, problem);
            break;
        case 'rectangular-prism':
            drawRectangularPrism(ctx, centerX, centerY, problem);
            break;
        case 'cylinder':
            drawCylinder(ctx, centerX, centerY, problem);
            break;
        case 'sphere':
            drawSphere(ctx, centerX, centerY, problem);
            break;
        case 'straight-line':
            drawStraightLineAngles(ctx, centerX, centerY, problem);
            break;
        case 'around-point':
            drawAroundPointAngles(ctx, centerX, centerY, problem);
            break;
    }
}

// Drawing functions
function drawRectangle(ctx, x, y, problem) {
    const scale = 8;
    const w = (problem.length || problem.width) * scale;
    const h = (problem.width || problem.height || problem.length) * scale;
    
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    ctx.strokeStyle = '#667eea';
    ctx.strokeRect(x - w/2, y - h/2, w, h);
    
    ctx.fillStyle = '#333';
    if (problem.length) ctx.fillText(problem.length, x, y - h/2 - 10);
    if (problem.width) ctx.fillText(problem.width, x - w/2 - 25, y);
    if (problem.height) ctx.fillText(problem.height, x - w/2 - 25, y);
}

function drawSquare(ctx, x, y, problem) {
    const scale = 10;
    const s = problem.side * scale;
    
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.fillRect(x - s/2, y - s/2, s, s);
    ctx.strokeStyle = '#667eea';
    ctx.strokeRect(x - s/2, y - s/2, s, s);
    
    ctx.fillStyle = '#333';
    ctx.fillText(problem.side, x, y - s/2 - 10);
}

function drawTriangle(ctx, x, y, problem) {
    const scale = 10;
    const base = (problem.base || problem.side1 || 10) * scale;
    const height = (problem.height || 8) * scale;
    
    ctx.beginPath();
    ctx.moveTo(x - base/2, y + height/2);
    ctx.lineTo(x + base/2, y + height/2);
    ctx.lineTo(x, y - height/2);
    ctx.closePath();
    
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#667eea';
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    if (problem.base) ctx.fillText(problem.base, x, y + height/2 + 20);
    if (problem.height) {
        ctx.beginPath();
        ctx.strokeStyle = '#999';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x, y - height/2);
        ctx.lineTo(x, y + height/2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText(problem.height, x + 10, y);
    }
    if (problem.angle1) ctx.fillText(problem.angle1 + '°', x - base/4, y + height/4);
    if (problem.angle2) ctx.fillText(problem.angle2 + '°', x + base/4, y + height/4);
    if (problem.type === 'angles') ctx.fillText('?', x, y - height/3);
}

function drawCircle(ctx, x, y, problem) {
    const scale = 12;
    const r = problem.radius * scale;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#667eea';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, y);
    ctx.lineTo(x + r, y);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#333';
    ctx.fillText('r = ' + problem.radius, x + r/2, y - 10);
}

function drawParallelogram(ctx, x, y, problem) {
    const scale = 10;
    const base = problem.base * scale;
    const height = problem.height * scale;
    const skew = 20;
    
    ctx.beginPath();
    ctx.moveTo(x - base/2 + skew, y - height/2);
    ctx.lineTo(x + base/2 + skew, y - height/2);
    ctx.lineTo(x + base/2 - skew, y + height/2);
    ctx.lineTo(x - base/2 - skew, y + height/2);
    ctx.closePath();
    
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#667eea';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x + skew, y - height/2);
    ctx.lineTo(x + skew, y + height/2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#333';
    ctx.fillText(problem.base, x, y + height/2 + 20);
    ctx.fillText('h = ' + problem.height, x + skew + 10, y);
}

function drawCube(ctx, x, y, problem) {
    const scale = 15;
    const s = problem.side * scale;
    const offset = s * 0.3;
    
    // Front face
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.fillRect(x - s/2, y - s/2, s, s);
    ctx.strokeStyle = '#667eea';
    ctx.strokeRect(x - s/2, y - s/2, s, s);
    
    // Top face
    ctx.beginPath();
    ctx.moveTo(x - s/2, y - s/2);
    ctx.lineTo(x - s/2 + offset, y - s/2 - offset);
    ctx.lineTo(x + s/2 + offset, y - s/2 - offset);
    ctx.lineTo(x + s/2, y - s/2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.4)';
    ctx.fill();
    ctx.stroke();
    
    // Side face
    ctx.beginPath();
    ctx.moveTo(x + s/2, y - s/2);
    ctx.lineTo(x + s/2 + offset, y - s/2 - offset);
    ctx.lineTo(x + s/2 + offset, y + s/2 - offset);
    ctx.lineTo(x + s/2, y + s/2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.fillText(problem.side, x, y + s/2 + 20);
}

function drawRectangularPrism(ctx, x, y, problem) {
    const scale = 12;
    const l = problem.length * scale;
    const w = problem.width * scale;
    const h = problem.height * scale;
    const offset = 20;
    
    // Front face
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.fillRect(x - l/2, y - h/2, l, h);
    ctx.strokeStyle = '#667eea';
    ctx.strokeRect(x - l/2, y - h/2, l, h);
    
    // Top face
    ctx.beginPath();
    ctx.moveTo(x - l/2, y - h/2);
    ctx.lineTo(x - l/2 + offset, y - h/2 - offset);
    ctx.lineTo(x + l/2 + offset, y - h/2 - offset);
    ctx.lineTo(x + l/2, y - h/2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.4)';
    ctx.fill();
    ctx.stroke();
    
    // Side face
    ctx.beginPath();
    ctx.moveTo(x + l/2, y - h/2);
    ctx.lineTo(x + l/2 + offset, y - h/2 - offset);
    ctx.lineTo(x + l/2 + offset, y + h/2 - offset);
    ctx.lineTo(x + l/2, y + h/2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.fillText('l=' + problem.length, x, y + h/2 + 20);
    ctx.fillText('h=' + problem.height, x - l/2 - 30, y);
    ctx.fillText('w=' + problem.width, x + l/2 + offset + 10, y);
}

function drawCylinder(ctx, x, y, problem) {
    const scale = 12;
    const r = problem.radius * scale;
    const h = problem.height * scale;
    
    // Top ellipse
    ctx.beginPath();
    ctx.ellipse(x, y - h/2, r, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(102, 126, 234, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#667eea';
    ctx.stroke();
    
    // Sides
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.fillRect(x - r, y - h/2, r * 2, h);
    ctx.strokeStyle = '#667eea';
    ctx.beginPath();
    ctx.moveTo(x - r, y - h/2);
    ctx.lineTo(x - r, y + h/2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + r, y - h/2);
    ctx.lineTo(x + r, y + h/2);
    ctx.stroke();
    
    // Bottom ellipse
    ctx.beginPath();
    ctx.ellipse(x, y + h/2, r, r * 0.3, 0, 0, Math.PI);
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.fillText('r=' + problem.radius, x + r + 10, y - h/2);
    ctx.fillText('h=' + problem.height, x - r - 30, y);
}

function drawSphere(ctx, x, y, problem) {
    const scale = 15;
    const r = problem.radius * scale;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#667eea';
    ctx.stroke();
    
    // Draw radius line
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, y);
    ctx.lineTo(x + r, y);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw equator
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.3, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#999';
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.fillText('r = ' + problem.radius, x + r/2, y - 10);
}

function drawStraightLineAngles(ctx, x, y, problem) {
    const length = 150;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(x - length, y);
    ctx.lineTo(x + length, y);
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw angle arc
    const angle1Rad = (problem.angle1 * Math.PI) / 180;
    ctx.beginPath();
    ctx.arc(x, y, 50, Math.PI, Math.PI - angle1Rad, true);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.fill();
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.fillText(problem.angle1 + '°', x - 40, y - 20);
    ctx.fillText('?', x + 40, y - 20);
}

function drawAroundPointAngles(ctx, x, y, problem) {
    const angles = [problem.angle1, problem.angle2, problem.angle3];
    let currentAngle = 0;
    const radius = 60;
    
    angles.forEach((angle, i) => {
        const angleRad = (angle * Math.PI) / 180;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, currentAngle, currentAngle + angleRad);
        ctx.closePath();
        
        ctx.fillStyle = `rgba(102, 126, 234, ${0.2 + i * 0.15})`;
        ctx.fill();
        ctx.strokeStyle = '#667eea';
        ctx.stroke();
        
        // Label
        const labelAngle = currentAngle + angleRad / 2;
        const labelX = x + Math.cos(labelAngle) * (radius / 2);
        const labelY = y + Math.sin(labelAngle) * (radius / 2);
        ctx.fillStyle = '#333';
        ctx.fillText(angle + '°', labelX - 10, labelY + 5);
        
        currentAngle += angleRad;
    });
    
    // Draw the unknown angle
    const remainingAngle = 2 * Math.PI - currentAngle;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, currentAngle, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 193, 7, 0.3)';
    ctx.fill();
    ctx.stroke();
    
    const labelAngle = currentAngle + remainingAngle / 2;
    const labelX = x + Math.cos(labelAngle) * (radius / 2);
    const labelY = y + Math.sin(labelAngle) * (radius / 2);
    ctx.fillStyle = '#333';
    ctx.fillText('?', labelX - 5, labelY + 5);
}

// Check answer
function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer-input').value);
    
    if (isNaN(userAnswer)) {
        document.getElementById('feedback').textContent = 'Please enter a number!';
        document.getElementById('feedback').style.color = '#f44336';
        return;
    }
    
    const tolerance = currentProblem.answer > 100 ? 1 : 0.5;
    const isCorrect = Math.abs(userAnswer - currentProblem.answer) <= tolerance;
    
    if (isCorrect) {
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('feedback').textContent = '✓ Correct! Well done!';
        document.getElementById('feedback').style.color = '#4caf50';
    } else {
        document.getElementById('feedback').textContent = 
            `✗ Incorrect. The answer is ${currentProblem.answer} ${currentProblem.unit}`;
        document.getElementById('feedback').style.color = '#f44336';
    }
}

// Toggle formula
function toggleFormula() {
    const display = document.getElementById('formula-display');
    const text = document.getElementById('formula-text');
    
    if (display.style.display === 'none') {
        text.textContent = currentProblem.formula;
        display.style.display = 'block';
    } else {
        display.style.display = 'none';
    }
}

// Format shape name
function formatShapeName(shape) {
    return shape.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Random integer
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shape identification section
const shapeDefinitions = [
    { name: 'Square', sides: 4, properties: 'All sides equal, all angles 90°' },
    { name: 'Rectangle', sides: 4, properties: 'Opposite sides equal, all angles 90°' },
    { name: 'Triangle', sides: 3, properties: 'Three sides, three angles' },
    { name: 'Circle', sides: 0, properties: 'Round, no corners' },
    { name: 'Pentagon', sides: 5, properties: 'Five sides, five angles' },
    { name: 'Hexagon', sides: 6, properties: 'Six sides, six angles' },
    { name: 'Octagon', sides: 8, properties: 'Eight sides, eight angles' },
    { name: 'Parallelogram', sides: 4, properties: 'Opposite sides parallel and equal' },
    { name: 'Trapezoid', sides: 4, properties: 'One pair of parallel sides' },
    { name: 'Rhombus', sides: 4, properties: 'All sides equal, opposite angles equal' }
];

function generateIdentifyQuestion() {
    currentShape = shapeDefinitions[Math.floor(Math.random() * shapeDefinitions.length)];
    
    // Draw the shape
    const canvas = document.getElementById('identify-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 100;
    
    ctx.strokeStyle = '#667eea';
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.lineWidth = 3;
    
    drawIdentifyShape(ctx, centerX, centerY, size, currentShape.name);
    
    // Create options
    const options = [currentShape.name];
    while (options.length < 4) {
        const randomShape = shapeDefinitions[Math.floor(Math.random() * shapeDefinitions.length)];
        if (!options.includes(randomShape.name)) {
            options.push(randomShape.name);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    // Display options
    const optionsDiv = document.getElementById('shape-options');
    optionsDiv.innerHTML = '';
    optionsDiv.style.display = 'grid';
    optionsDiv.style.gridTemplateColumns = 'repeat(2, 1fr)';
    optionsDiv.style.gap = '15px';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'mode-btn';
        button.textContent = option;
        button.style.padding = '15px';
        button.addEventListener('click', () => checkIdentify(option));
        optionsDiv.appendChild(button);
    });
    
    document.getElementById('identify-feedback').textContent = '';
}

function drawIdentifyShape(ctx, x, y, size, shapeName) {
    ctx.beginPath();
    
    switch (shapeName) {
        case 'Square':
            ctx.rect(x - size/2, y - size/2, size, size);
            break;
            
        case 'Rectangle':
            ctx.rect(x - size * 0.7, y - size/2, size * 1.4, size);
            break;
            
        case 'Triangle':
            ctx.moveTo(x, y - size/2);
            ctx.lineTo(x - size/2, y + size/2);
            ctx.lineTo(x + size/2, y + size/2);
            ctx.closePath();
            break;
            
        case 'Circle':
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            break;
            
        case 'Pentagon':
            drawPolygon(ctx, x, y, size/2, 5);
            break;
            
        case 'Hexagon':
            drawPolygon(ctx, x, y, size/2, 6);
            break;
            
        case 'Octagon':
            drawPolygon(ctx, x, y, size/2, 8);
            break;
            
        case 'Parallelogram':
            ctx.moveTo(x - size/2 + 20, y - size/2);
            ctx.lineTo(x + size/2 + 20, y - size/2);
            ctx.lineTo(x + size/2 - 20, y + size/2);
            ctx.lineTo(x - size/2 - 20, y + size/2);
            ctx.closePath();
            break;
            
        case 'Trapezoid':
            ctx.moveTo(x - size/3, y - size/2);
            ctx.lineTo(x + size/3, y - size/2);
            ctx.lineTo(x + size/2, y + size/2);
            ctx.lineTo(x - size/2, y + size/2);
            ctx.closePath();
            break;
            
        case 'Rhombus':
            ctx.moveTo(x, y - size/2);
            ctx.lineTo(x + size/2, y);
            ctx.lineTo(x, y + size/2);
            ctx.lineTo(x - size/2, y);
            ctx.closePath();
            break;
    }
    
    ctx.fill();
    ctx.stroke();
}

function drawPolygon(ctx, x, y, radius, sides) {
    const angle = (Math.PI * 2) / sides;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const px = x + radius * Math.cos(angle * i - Math.PI / 2);
        const py = y + radius * Math.sin(angle * i - Math.PI / 2);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

function checkIdentify(selected) {
    identifyTotal++;
    document.getElementById('identify-total').textContent = identifyTotal;
    
    const feedback = document.getElementById('identify-feedback');
    
    if (selected === currentShape.name) {
        identifyScore++;
        document.getElementById('identify-score').textContent = identifyScore;
        feedback.textContent = '✓ Correct! ' + currentShape.properties;
        feedback.style.color = '#4caf50';
    } else {
        feedback.textContent = '✗ Incorrect. That was a ' + currentShape.name + '. ' + currentShape.properties;
        feedback.style.color = '#f44336';
    }
}
