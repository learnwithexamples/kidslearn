// Circuit Playground - Interactive Circuit Builder
class CircuitPlayground {
    constructor() {
        this.components = [];
        this.connections = [];
        this.voltage = 9;
        this.resistance = 100;
        this.draggedElement = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.nextId = 1;
        this.selectedComponent = null;
        this.isConnecting = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.updateCircuit();
    }

    setupEventListeners() {
        console.log('=== Setting up event listeners ===');
        
        // Drag and drop from palette
        const paletteItems = document.querySelectorAll('.component-item');
        console.log('Found palette items:', paletteItems.length, paletteItems);
        
        paletteItems.forEach((item, index) => {
            console.log(`Setting up item ${index}, type:`, item.dataset.type);
            item.setAttribute('draggable', 'true');
            
            // Also make child elements non-draggable to prevent interference
            item.querySelectorAll('*').forEach(child => {
                child.setAttribute('draggable', 'false');
            });
            
            item.addEventListener('dragstart', (e) => {
                console.log('🎯 Drag start event fired!', e.target);
                this.handleDragStart(e);
            });
            
            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        });

        // Drop zone - both board-grid and circuit-board
        const boardGrid = document.getElementById('board-grid');
        const circuitBoard = document.getElementById('circuit-board');
        
        console.log('Board grid:', boardGrid);
        console.log('Circuit board:', circuitBoard);
        
        [boardGrid, circuitBoard].forEach(element => {
            if (!element) return;
            
            element.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                element.classList.add('drag-over');
                console.log('🎯 Dragover event on', element.id);
            });
            
            element.addEventListener('dragleave', (e) => {
                if (e.target === element) {
                    element.classList.remove('drag-over');
                }
            });
            
            element.addEventListener('drop', (e) => {
                console.log('🎯 Drop event fired!', e);
                element.classList.remove('drag-over');
                this.handleDrop(e);
            });
        });

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

        // Canvas click for connection mode (reuse boardGrid from above)
        boardGrid.addEventListener('click', (e) => {
            if (e.target === boardGrid || e.target.id === 'wire-canvas') {
                this.cancelConnection();
            }
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
        console.log('handleDragStart called');
        const componentItem = e.target.closest('.component-item');
        if (!componentItem) {
            console.log('No component item found');
            return;
        }
        
        const componentType = componentItem.dataset.type;
        console.log('Dragging component type:', componentType);
        
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', componentType);
        e.dataTransfer.setData('componentType', componentType);
        
        // Visual feedback
        componentItem.style.opacity = '0.5';
    }

    handleDrop(e) {
        console.log('handleDrop called');
        e.preventDefault();
        e.stopPropagation();
        
        const componentType = e.dataTransfer.getData('componentType') || e.dataTransfer.getData('text/plain');
        
        console.log('Dropped component type:', componentType);
        
        if (!componentType) {
            console.log('No component type in drop data');
            return;
        }

        // Check if component already exists (only one of each type allowed)
        const existing = this.components.find(c => c.type === componentType);
        if (existing) {
            this.showStatus('You can only have one ' + componentType + ' in the circuit!', 'error');
            return;
        }

        // Calculate drop position relative to board-grid
        const boardGrid = document.getElementById('board-grid');
        const rect = boardGrid.getBoundingClientRect();
        let x = e.clientX - rect.left - 50; // Center the component (component width is ~100px)
        let y = e.clientY - rect.top - 50;
        
        console.log('Drop position:', x, y);
        
        // Keep within bounds
        x = Math.max(0, Math.min(x, rect.width - 100));
        y = Math.max(0, Math.min(y, rect.height - 100));

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
            <button class="connect-btn" title="Connect to another component">🔗</button>
        `;

        // Connect button
        el.querySelector('.connect-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.startConnection(component.id);
        });

        // Make switch clickable
        if (component.type === 'switch') {
            const icon = el.querySelector('.component-icon');
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSwitch(component.id);
            });
        }

        // Remove button
        el.querySelector('.remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeComponent(component.id);
        });

        // Make draggable (but not the icon for switch)
        el.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('remove-btn')) return;
            if (e.target.classList.contains('connect-btn')) return;
            if (e.target.classList.contains('component-icon') && component.type === 'switch') return;
            this.startDrag(component.id, e);
        });

        // Click to complete connection
        el.addEventListener('click', (e) => {
            if (this.isConnecting && this.selectedComponent !== component.id) {
                if (!e.target.classList.contains('remove-btn') && 
                    !e.target.classList.contains('connect-btn') &&
                    !(e.target.classList.contains('component-icon') && component.type === 'switch')) {
                    this.completeConnection(component.id);
                }
            }
        });

        boardGrid.appendChild(el);
    }

    startDrag(componentId, e) {
        const component = this.components.find(c => c.id === componentId);
        if (!component) return;

        const el = document.querySelector(`[data-id="${componentId}"]`);
        const boardGrid = document.getElementById('board-grid');
        const rect = boardGrid.getBoundingClientRect();
        
        // Calculate offset from mouse to component position (relative to board)
        const mouseXInBoard = e.clientX - rect.left;
        const mouseYInBoard = e.clientY - rect.top;
        
        this.draggedElement = { 
            component, 
            el, 
            startX: mouseXInBoard - component.x, 
            startY: mouseYInBoard - component.y 
        };

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
        // Remove connections involving this component
        this.connections = this.connections.filter(
            conn => conn.from !== componentId && conn.to !== componentId
        );
        
        this.components = this.components.filter(c => c.id !== componentId);
        const el = document.querySelector(`[data-id="${componentId}"]`);
        if (el) el.remove();
        this.updateCircuit();
    }

    startConnection(componentId) {
        this.isConnecting = true;
        this.selectedComponent = componentId;
        
        // Highlight the selected component
        document.querySelectorAll('.placed-component').forEach(el => {
            el.classList.remove('connecting-from');
        });
        const el = document.querySelector(`[data-id="${componentId}"]`);
        el.classList.add('connecting-from');
        
        this.showStatus('Click on another component to connect!', '');
    }

    completeConnection(targetId) {
        if (!this.isConnecting || !this.selectedComponent) return;
        
        const fromId = this.selectedComponent;
        const toId = targetId;
        
        // Check if connection already exists
        const exists = this.connections.some(
            conn => (conn.from === fromId && conn.to === toId) || 
                    (conn.from === toId && conn.to === fromId)
        );
        
        if (exists) {
            this.showStatus('Components are already connected!', 'error');
            this.cancelConnection();
            return;
        }
        
        // Add the connection
        this.connections.push({ from: fromId, to: toId });
        
        this.cancelConnection();
        this.updateCircuit();
        this.showStatus('Connection created! 🔌', 'success');
    }

    cancelConnection() {
        this.isConnecting = false;
        this.selectedComponent = null;
        document.querySelectorAll('.placed-component').forEach(el => {
            el.classList.remove('connecting-from');
        });
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

        // Check if circuit forms a complete path
        const circuitComplete = this.checkCircuitComplete();
        
        let switchOn = true;
        if (hasSwitch && circuitComplete) {
            const switchComponent = this.components.find(c => c.type === 'switch');
            switchOn = switchComponent.active;
        }

        // Update LED state
        const ledComponent = this.components.find(c => c.type === 'led');
        if (ledComponent) {
            ledComponent.active = circuitComplete && switchOn;
            const ledEl = document.querySelector(`[data-id="${ledComponent.id}"]`);
            if (ledEl) {
                const ledIcon = ledEl.querySelector('.component-icon');
                
                if (ledComponent.active) {
                    ledIcon.classList.add('led-on');
                    ledEl.classList.add('active');
                } else {
                    ledIcon.classList.remove('led-on');
                    ledEl.classList.remove('active');
                }
            }
        }

        // Update battery visual state
        const batteryComponent = this.components.find(c => c.type === 'battery');
        if (batteryComponent) {
            const batteryEl = document.querySelector(`[data-id="${batteryComponent.id}"]`);
            if (batteryEl) {
                if (circuitComplete && switchOn) {
                    batteryEl.classList.add('active');
                } else {
                    batteryEl.classList.remove('active');
                }
            }
        }

        // Calculate and display readings
        this.calculateReadings(circuitComplete && switchOn);
        
        // Draw connecting wires
        this.drawWires();

        // Update status message
        if (!this.isConnecting) {
            this.updateStatus(hasBattery, hasLed, hasSwitch, circuitComplete, switchOn);
        }
    }

    checkCircuitComplete() {
        // Need at least battery and LED
        const battery = this.components.find(c => c.type === 'battery');
        const led = this.components.find(c => c.type === 'led');
        
        if (!battery || !led) return false;
        if (this.connections.length === 0) return false;

        // Check if there's a path from battery to LED and back
        // For simplicity, check if all required components are connected
        const hasSwitch = this.components.some(c => c.type === 'switch');
        
        if (hasSwitch) {
            // Need connections: battery-switch, switch-led, led-battery (or variations)
            const switchComp = this.components.find(c => c.type === 'switch');
            return this.isConnectedPath(battery.id, led.id);
        } else {
            // Just need battery connected to LED
            return this.isConnectedPath(battery.id, led.id);
        }
    }

    isConnectedPath(fromId, toId) {
        // Build adjacency list
        const graph = {};
        this.components.forEach(c => {
            graph[c.id] = [];
        });
        
        this.connections.forEach(conn => {
            graph[conn.from].push(conn.to);
            graph[conn.to].push(conn.from);
        });

        // BFS to check if path exists
        const visited = new Set();
        const queue = [fromId];
        visited.add(fromId);

        while (queue.length > 0) {
            const current = queue.shift();
            if (current === toId) return true;

            for (const neighbor of (graph[current] || [])) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        return false;
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

        if (this.connections.length === 0) return;

        // Determine if circuit is active
        const circuitComplete = this.checkCircuitComplete();
        const hasSwitch = this.components.some(c => c.type === 'switch');
        let isActive = circuitComplete;
        
        if (hasSwitch && circuitComplete) {
            const switchComp = this.components.find(c => c.type === 'switch');
            isActive = switchComp.active;
        }

        // Draw each connection
        this.connections.forEach(conn => {
            const comp1 = this.components.find(c => c.id === conn.from);
            const comp2 = this.components.find(c => c.id === conn.to);
            
            if (!comp1 || !comp2) return;

            // Wire color based on state
            ctx.strokeStyle = isActive ? '#4caf50' : '#999';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';

            const x1 = comp1.x + 50;
            const y1 = comp1.y + 50;
            const x2 = comp2.x + 50;
            const y2 = comp2.y + 50;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Add current flow animation if active
            if (isActive) {
                ctx.setLineDash([10, 10]);
                ctx.strokeStyle = '#ffeb3b';
                ctx.lineWidth = 2;
                
                const offset = (Date.now() / 50) % 20;
                ctx.lineDashOffset = -offset;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                
                ctx.setLineDash([]);
            }
        });

        // Continue animation if active
        if (isActive) {
            requestAnimationFrame(() => this.drawWires());
        }
    }

    updateStatus(hasBattery, hasLed, hasSwitch, circuitComplete, switchOn) {
        const statusEl = document.getElementById('circuit-status');
        
        if (!hasBattery) {
            statusEl.textContent = 'Add a battery to power your circuit!';
            statusEl.className = 'status-message';
        } else if (!hasLed) {
            statusEl.textContent = 'Add an LED to see the light!';
            statusEl.className = 'status-message';
        } else if (this.connections.length === 0) {
            statusEl.textContent = 'Click the 🔗 button on components to connect them!';
            statusEl.className = 'status-message';
        } else if (!circuitComplete) {
            statusEl.textContent = 'Connect all components to complete the circuit!';
            statusEl.className = 'status-message';
        } else if (hasSwitch && !switchOn) {
            statusEl.textContent = 'Click the switch icon to turn it ON!';
            statusEl.className = 'status-message';
        } else if (circuitComplete && switchOn) {
            statusEl.textContent = '✨ Circuit is complete and working!';
            statusEl.className = 'status-message success';
        } else {
            statusEl.textContent = 'Keep building your circuit!';
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
        this.connections = [];
        this.cancelConnection();
        this.updateCircuit();
        this.showStatus('Circuit cleared! Drop components to start building!', '');
    }
}

// Initialize the playground when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CircuitPlayground();
});
