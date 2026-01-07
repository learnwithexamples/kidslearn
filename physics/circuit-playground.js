// Circuit Playground - Interactive Circuit Builder
class CircuitPlayground {
    constructor() {
        this.components = [];
        this.voltage = 9;
        this.resistance = 100;
        this.draggedElement = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.nextId = 1;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.updateReadings();
    }

    setupEventListeners() {
        // Drag and drop from palette
        const paletteItems = document.querySelectorAll('.component-item');
        paletteItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
        });

        // Drop zone
        const boardGrid = document.getElementById('board-grid');
        boardGrid.addEventListener('dragover', (e) => e.preventDefault());
        boardGrid.addEventListener('drop', (e) => this.handleDrop(e));

        // Voltage control
        const voltageInput = document.getElementById('voltage-input');
        voltageInput.addEventListener('input', (e) => {
            this.voltage = parseFloat(e.target.value);
            document.getElementById('voltage-display').textContent = `${this.voltage}V`;
            this.updateCircuit();
        });

        // Resistance control
        const resistanceInput = document.getElementById('resistance-input');
        resistanceInput.addEventListener('input', (e) => {
            this.resistance = parseFloat(e.target.value);
            document.getElementById('resistance-display').textContent = `${this.resistance}Ω`;
            this.updateCircuit();
        });

        // Clear circuit button
        document.getElementById('clear-circuit').addEventListener('click', () => {
            this.clearCircuit();
        });
    }

    setupCanvas() {
        const canvas = document.getElementById('wire-canvas');
        const boardGrid = document.getElementById('board-grid');
        canvas.width = boardGrid.offsetWidth;
        canvas.height = boardGrid.offsetHeight;
        
        // Redraw on window resize
        window.addEventListener('resize', () => {
            canvas.width = boardGrid.offsetWidth;
            canvas.height = boardGrid.offsetHeight;
            this.drawWires();
        });
    }

    handleDragStart(e) {
        const componentType = e.target.closest('.component-item').dataset.type;
        e.dataTransfer.setData('componentType', componentType);
    }

    handleDrop(e) {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('componentType');
        
        if (!componentType) return;

        // Check if component already exists (only one of each type allowed)
        const existing = this.components.find(c => c.type === componentType);
        if (existing) {
            this.showStatus('You can only have one ' + componentType + ' in the circuit!', 'error');
            return;
        }

        const boardGrid = document.getElementById('board-grid');
        const rect = boardGrid.getBoundingClientRect();
        const x = e.clientX - rect.left - 50; // Center the component
        const y = e.clientY - rect.top - 50;

        this.addComponent(componentType, x, y);
    }

    addComponent(type, x, y) {
        const component = {
            id: this.nextId++,
            type: type,
            x: x,
            y: y,
            active: false
        };

        this.components.push(component);
        this.renderComponent(component);
        this.updateCircuit();
    }

    renderComponent(component) {
        const boardGrid = document.getElementById('board-grid');
        const el = document.createElement('div');
        el.className = 'placed-component';
        el.dataset.id = component.id;
        el.style.left = component.x + 'px';
        el.style.top = component.y + 'px';

        const icons = {
            battery: '🔋',
            led: '💡',
            switch: '🔘',
            resistor: '⚡'
        };

        const labels = {
            battery: 'Battery',
            led: 'LED',
            switch: 'Switch',
            resistor: 'Resistor'
        };

        let iconClass = component.type + '-icon';
        if (component.type === 'switch') {
            iconClass += component.active ? ' switch-on' : ' switch-off';
        }
        if (component.type === 'led' && component.active) {
            iconClass += ' led-on';
        }

        el.innerHTML = `
            <div class="component-icon ${iconClass}">${icons[component.type]}</div>
            <span class="component-label">${labels[component.type]}</span>
            <button class="remove-btn">✕</button>
        `;

        // Make switch clickable
        if (component.type === 'switch') {
            el.style.cursor = 'pointer';
            el.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-btn')) {
                    this.toggleSwitch(component.id);
                }
            });
        }

        // Remove button
        el.querySelector('.remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeComponent(component.id);
        });

        // Make draggable
        el.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('remove-btn')) return;
            if (component.type === 'switch') return; // Don't drag switch, let it toggle
            this.startDrag(component.id, e);
        });

        boardGrid.appendChild(el);
    }

    startDrag(componentId, e) {
        const component = this.components.find(c => c.id === componentId);
        if (!component) return;

        const el = document.querySelector(`[data-id="${componentId}"]`);
        this.draggedElement = { component, el, startX: e.clientX - component.x, startY: e.clientY - component.y };

        const handleMove = (e) => {
            if (!this.draggedElement) return;
            const boardGrid = document.getElementById('board-grid');
            const rect = boardGrid.getBoundingClientRect();
            component.x = e.clientX - rect.left - this.draggedElement.startX;
            component.y = e.clientY - rect.top - this.draggedElement.startY;
            el.style.left = component.x + 'px';
            el.style.top = component.y + 'px';
            this.drawWires();
        };

        const handleUp = () => {
            this.draggedElement = null;
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
    }

    removeComponent(componentId) {
        this.components = this.components.filter(c => c.id !== componentId);
        const el = document.querySelector(`[data-id="${componentId}"]`);
        if (el) el.remove();
        this.updateCircuit();
    }

    toggleSwitch(componentId) {
        const component = this.components.find(c => c.id === componentId);
        if (!component) return;

        component.active = !component.active;
        const el = document.querySelector(`[data-id="${componentId}"]`);
        const icon = el.querySelector('.component-icon');
        
        if (component.active) {
            icon.classList.remove('switch-off');
            icon.classList.add('switch-on');
        } else {
            icon.classList.remove('switch-on');
            icon.classList.add('switch-off');
        }

        this.updateCircuit();
    }

    updateCircuit() {
        const hasBattery = this.components.some(c => c.type === 'battery');
        const hasLed = this.components.some(c => c.type === 'led');
        const hasSwitch = this.components.some(c => c.type === 'switch');
        const hasResistor = this.components.some(c => c.type === 'resistor');

        let circuitComplete = false;
        let switchOn = true;

        // Check if circuit is complete
        if (hasBattery && hasLed) {
            circuitComplete = true;
            
            // If there's a switch, check if it's on
            if (hasSwitch) {
                const switchComponent = this.components.find(c => c.type === 'switch');
                switchOn = switchComponent.active;
            }
        }

        // Update LED state
        const ledComponent = this.components.find(c => c.type === 'led');
        if (ledComponent) {
            ledComponent.active = circuitComplete && switchOn;
            const ledEl = document.querySelector(`[data-id="${ledComponent.id}"]`);
            const ledIcon = ledEl.querySelector('.component-icon');
            
            if (ledComponent.active) {
                ledIcon.classList.add('led-on');
                ledEl.classList.add('active');
            } else {
                ledIcon.classList.remove('led-on');
                ledEl.classList.remove('active');
            }
        }

        // Update battery visual state
        const batteryComponent = this.components.find(c => c.type === 'battery');
        if (batteryComponent) {
            const batteryEl = document.querySelector(`[data-id="${batteryComponent.id}"]`);
            if (circuitComplete && switchOn) {
                batteryEl.classList.add('active');
            } else {
                batteryEl.classList.remove('active');
            }
        }

        // Calculate and display readings
        this.calculateReadings(circuitComplete && switchOn);
        
        // Draw connecting wires
        this.drawWires();

        // Update status message
        this.updateStatus(hasBattery, hasLed, hasSwitch, circuitComplete, switchOn);
    }

    calculateReadings(circuitActive) {
        if (!circuitActive) {
            document.getElementById('current-reading').textContent = '-';
            document.getElementById('power-reading').textContent = '-';
            return;
        }

        // Use user-defined resistance or default LED resistance
        const hasResistor = this.components.some(c => c.type === 'resistor');
        const totalResistance = hasResistor ? this.resistance : 100; // Default LED resistance

        // Calculate current using Ohm's Law: I = V / R
        const current = this.voltage / totalResistance;
        
        // Calculate power: P = V × I
        const power = this.voltage * current;

        // Display with appropriate units
        let currentDisplay, powerDisplay;
        
        if (current < 1) {
            currentDisplay = `${(current * 1000).toFixed(1)} mA`;
        } else {
            currentDisplay = `${current.toFixed(2)} A`;
        }

        if (power < 1) {
            powerDisplay = `${(power * 1000).toFixed(1)} mW`;
        } else {
            powerDisplay = `${power.toFixed(2)} W`;
        }

        document.getElementById('current-reading').textContent = currentDisplay;
        document.getElementById('power-reading').textContent = powerDisplay;
    }

    drawWires() {
        const canvas = document.getElementById('wire-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.components.length < 2) return;

        const hasBattery = this.components.some(c => c.type === 'battery');
        const hasLed = this.components.some(c => c.type === 'led');
        const hasSwitch = this.components.some(c => c.type === 'switch');
        
        if (!hasBattery || !hasLed) return;

        const battery = this.components.find(c => c.type === 'battery');
        const led = this.components.find(c => c.type === 'led');
        const switchComp = this.components.find(c => c.type === 'switch');

        // Wire color and style
        const isActive = led.active;
        ctx.strokeStyle = isActive ? '#4caf50' : '#999';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Draw wires connecting components
        ctx.beginPath();
        
        if (switchComp) {
            // Battery -> Switch -> LED -> Battery
            this.drawLine(ctx, battery, switchComp);
            this.drawLine(ctx, switchComp, led);
            this.drawLine(ctx, led, battery);
        } else {
            // Battery -> LED -> Battery
            this.drawLine(ctx, battery, led);
            this.drawLine(ctx, led, battery);
        }

        ctx.stroke();

        // Add current flow animation if active
        if (isActive) {
            ctx.setLineDash([10, 10]);
            ctx.strokeStyle = '#ffeb3b';
            ctx.lineWidth = 2;
            
            // Animate by changing dash offset
            const offset = (Date.now() / 50) % 20;
            ctx.lineDashOffset = -offset;
            
            ctx.beginPath();
            if (switchComp) {
                this.drawLine(ctx, battery, switchComp);
                this.drawLine(ctx, switchComp, led);
            } else {
                this.drawLine(ctx, battery, led);
            }
            ctx.stroke();
            
            ctx.setLineDash([]);
            
            // Continue animation
            requestAnimationFrame(() => this.drawWires());
        }
    }

    drawLine(ctx, comp1, comp2) {
        const x1 = comp1.x + 50; // Center of component (100px width / 2)
        const y1 = comp1.y + 50; // Center of component
        const x2 = comp2.x + 50;
        const y2 = comp2.y + 50;
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }

    updateStatus(hasBattery, hasLed, hasSwitch, circuitComplete, switchOn) {
        const statusEl = document.getElementById('circuit-status');
        
        if (!hasBattery) {
            statusEl.textContent = 'Add a battery to power your circuit!';
            statusEl.className = 'status-message';
        } else if (!hasLed) {
            statusEl.textContent = 'Add an LED to see the light!';
            statusEl.className = 'status-message';
        } else if (hasSwitch && !switchOn) {
            statusEl.textContent = 'Click the switch to turn it ON!';
            statusEl.className = 'status-message';
        } else if (circuitComplete && switchOn) {
            statusEl.textContent = '✨ Circuit is complete and working!';
            statusEl.className = 'status-message success';
        } else {
            statusEl.textContent = 'Circuit ready! Add more components or adjust values.';
            statusEl.className = 'status-message';
        }
    }

    showStatus(message, type = 'error') {
        const statusEl = document.getElementById('circuit-status');
        statusEl.textContent = message;
        statusEl.className = 'status-message ' + type;
        
        setTimeout(() => {
            this.updateCircuit();
        }, 3000);
    }

    clearCircuit() {
        this.components.forEach(comp => {
            const el = document.querySelector(`[data-id="${comp.id}"]`);
            if (el) el.remove();
        });
        this.components = [];
        this.updateCircuit();
        this.showStatus('Circuit cleared! Drop components to start building!', '');
    }
}

// Initialize the playground when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CircuitPlayground();
});
