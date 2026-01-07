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
        this.selectedPoint = null; // {componentId, pointIndex}
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
        
        let draggingControl = null;
        
        // Change cursor when hovering over wires or control points
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (draggingControl) {
                // Update control point position
                const canvasRect = canvas.getBoundingClientRect();
                draggingControl.controlPoint.x = x;
                draggingControl.controlPoint.y = y;
                this.drawWires();
                return;
            }
            
            const controlPoint = this.findControlPointAt(x, y);
            const connection = this.findConnectionAtPoint(x, y);
            canvas.style.cursor = (controlPoint || connection) ? 'pointer' : 'default';
        });
        
        // Mouse down to start dragging control point
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const controlPoint = this.findControlPointAt(x, y);
            if (controlPoint) {
                draggingControl = controlPoint;
                e.stopPropagation();
            }
        });
        
        // Mouse up to stop dragging or remove wire
        canvas.addEventListener('mouseup', (e) => {
            if (draggingControl) {
                draggingControl = null;
                return;
            }
        });
        
        // Click on canvas to remove wires
        canvas.addEventListener('click', (e) => {
            if (draggingControl) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if click is near any wire
            const clickedConnection = this.findConnectionAtPoint(x, y);
            if (clickedConnection) {
                this.removeConnection(clickedConnection);
            }
        });
        
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
            bulb: '💡'
        };

        const labels = {
            battery: 'Battery',
            bulb: 'Bulb'
        };

        let iconClass = component.type + '-icon';
        if (component.type === 'bulb' && component.active) {
            iconClass += ' bulb-on';
        }

        el.innerHTML = `
            <div class="connection-point" data-point="0" title="Connection Point 1">●</div>
            <div class="component-icon ${iconClass}">${icons[component.type]}</div>
            <span class="component-label">${labels[component.type]}</span>
            <div class="connection-point" data-point="1" title="Connection Point 2">●</div>
            <button class="remove-btn">✕</button>
        `;

        // Connection points
        el.querySelectorAll('.connection-point').forEach(point => {
            point.addEventListener('click', (e) => {
                e.stopPropagation();
                const pointIndex = parseInt(point.dataset.point);
                console.log('🔗 Connection point clicked:', component.id, 'point:', pointIndex);
                this.handleConnectionPointClick(component.id, pointIndex);
            });
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

        // Make draggable (but not buttons or connection points)
        el.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('remove-btn')) return;
            if (e.target.classList.contains('connection-point')) return;
            this.startDrag(component.id, e);
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
            conn => conn.from.componentId !== componentId && conn.to.componentId !== componentId
        );
        
        this.components = this.components.filter(c => c.id !== componentId);
        const el = document.querySelector(`[data-id="${componentId}"]`);
        if (el) el.remove();
        this.updateCircuit();
    }

    removeConnection(connection) {
        const index = this.connections.indexOf(connection);
        if (index > -1) {
            this.connections.splice(index, 1);
            this.updateCircuit();
            this.showStatus('Connection removed!', 'success');
            console.log('🗑️ Connection removed');
        }
    }

    findConnectionAtPoint(x, y) {
        const canvas = document.getElementById('wire-canvas');
        const threshold = 12; // Click within 12 pixels of wire
        
        for (const conn of this.connections) {
            const comp1 = this.components.find(c => c.id === conn.from.componentId);
            const comp2 = this.components.find(c => c.id === conn.to.componentId);
            
            if (!comp1 || !comp2) continue;

            // Get connection point elements
            const el1 = document.querySelector(`[data-id="${comp1.id}"]`);
            const el2 = document.querySelector(`[data-id="${comp2.id}"]`);
            
            if (!el1 || !el2) continue;
            
            const point1 = el1.querySelector(`[data-point="${conn.from.pointIndex}"]`);
            const point2 = el2.querySelector(`[data-point="${conn.to.pointIndex}"]`);
            
            if (!point1 || !point2) continue;
            
            const rect1 = point1.getBoundingClientRect();
            const rect2 = point2.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const x1 = rect1.left + rect1.width / 2 - canvasRect.left;
            const y1 = rect1.top + rect1.height / 2 - canvasRect.top;
            const x2 = rect2.left + rect2.width / 2 - canvasRect.left;
            const y2 = rect2.top + rect2.height / 2 - canvasRect.top;
            
            const cpX = conn.controlPoint.x;
            const cpY = conn.controlPoint.y;

            // Check distance to quadratic bezier curve
            // Sample points along the curve
            let minDist = Infinity;
            for (let t = 0; t <= 1; t += 0.05) {
                const curveX = (1-t)*(1-t)*x1 + 2*(1-t)*t*cpX + t*t*x2;
                const curveY = (1-t)*(1-t)*y1 + 2*(1-t)*t*cpY + t*t*y2;
                const dist = Math.sqrt((x - curveX)**2 + (y - curveY)**2);
                minDist = Math.min(minDist, dist);
            }
            
            if (minDist < threshold) {
                return conn;
            }
        }
        
        return null;
    }

    pointToLineDistance(px, py, x1, y1, x2, y2) {
        // Calculate distance from point (px, py) to line segment (x1, y1) - (x2, y2)
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    handleConnectionPointClick(componentId, pointIndex) {
        console.log('🟠 Connection point clicked:', componentId, pointIndex);
        
        if (!this.selectedPoint) {
            // First click - select this point
            this.selectedPoint = { componentId, pointIndex };
            this.isConnecting = true;
            
            // Highlight the selected point
            const el = document.querySelector(`[data-id="${componentId}"]`);
            const point = el.querySelector(`[data-point="${pointIndex}"]`);
            document.querySelectorAll('.connection-point').forEach(p => p.classList.remove('selected'));
            point.classList.add('selected');
            
            this.showStatus('Click on another connection point to connect!', '');
            console.log('✅ First point selected');
        } else {
            // Second click - complete connection
            const fromPoint = this.selectedPoint;
            const toPoint = { componentId, pointIndex };
            
            // Can't connect a point to itself
            if (fromPoint.componentId === toPoint.componentId && fromPoint.pointIndex === toPoint.pointIndex) {
                console.log('❌ Cannot connect point to itself');
                this.cancelConnection();
                return;
            }
            
            // Check if this connection already exists
            const exists = this.connections.some(conn => 
                (conn.from.componentId === fromPoint.componentId && 
                 conn.from.pointIndex === fromPoint.pointIndex &&
                 conn.to.componentId === toPoint.componentId && 
                 conn.to.pointIndex === toPoint.pointIndex) ||
                (conn.from.componentId === toPoint.componentId && 
                 conn.from.pointIndex === toPoint.pointIndex &&
                 conn.to.componentId === fromPoint.componentId && 
                 conn.to.pointIndex === fromPoint.pointIndex)
            );
            
            if (exists) {
                console.log('⚠️ Connection already exists');
                this.showStatus('These points are already connected!', 'error');
                this.cancelConnection();
                return;
            }
            
            // Add the connection with a control point for the curve
            const midX = (fromPoint.componentId === toPoint.componentId) ? 0 : 0;
            const midY = (fromPoint.componentId === toPoint.componentId) ? 0 : 0;
            
            this.connections.push({ 
                from: fromPoint, 
                to: toPoint,
                controlPoint: { x: midX, y: midY } // Offset from midpoint
            });
            console.log('✅ Connection created:', fromPoint, '→', toPoint);
            
            this.cancelConnection();
            this.updateCircuit();
            this.showStatus('Connection created! 🔌', 'success');
        }
    }

    cancelConnection() {
        this.isConnecting = false;
        this.selectedPoint = null;
        document.querySelectorAll('.connection-point').forEach(p => p.classList.remove('selected'));
    }

    updateCircuit() {
        const hasBattery = this.components.some(c => c.type === 'battery');
        const hasBulb = this.components.some(c => c.type === 'bulb');

        // Check if circuit forms a complete path
        const circuitComplete = this.checkCircuitComplete();

        // Update all bulb states
        const bulbComponents = this.components.filter(c => c.type === 'bulb');
        bulbComponents.forEach(bulbComponent => {
            // Check if this specific bulb is in a complete circuit path from battery
            const batteryComponents = this.components.filter(c => c.type === 'battery');
            const isInCompletePath = batteryComponents.some(battery => 
                this.isConnectedPath(battery.id, bulbComponent.id)
            );
            
            bulbComponent.active = isInCompletePath;
            const bulbEl = document.querySelector(`[data-id="${bulbComponent.id}"]`);
            if (bulbEl) {
                const bulbIcon = bulbEl.querySelector('.component-icon');
                
                if (bulbComponent.active) {
                    bulbIcon.classList.add('bulb-on');
                    bulbEl.classList.add('active');
                } else {
                    bulbIcon.classList.remove('bulb-on');
                    bulbEl.classList.remove('active');
                }
            }
        });

        // Update all battery visual states
        const batteryComponents = this.components.filter(c => c.type === 'battery');
        batteryComponents.forEach(batteryComponent => {
            const batteryEl = document.querySelector(`[data-id="${batteryComponent.id}"]`);
            if (batteryEl) {
                if (circuitComplete) {
                    batteryEl.classList.add('active');
                } else {
                    batteryEl.classList.remove('active');
                }
            }
        });

        // Calculate and display readings
        this.calculateReadings(circuitComplete);
        
        // Draw connecting wires
        this.drawWires();

        // Update status message
        if (!this.isConnecting) {
            this.updateStatus(hasBattery, hasBulb, circuitComplete);
        }
    }

    checkCircuitComplete() {
        // Need at least one battery and one bulb
        const hasBattery = this.components.some(c => c.type === 'battery');
        const hasBulb = this.components.some(c => c.type === 'bulb');
        
        if (!hasBattery || !hasBulb) return false;
        if (this.connections.length === 0) return false;

        const batteries = this.components.filter(c => c.type === 'battery');
        const bulbs = this.components.filter(c => c.type === 'bulb');
        
        // For a complete circuit, we need a closed loop
        // Each component must have at least 2 connections (except in very simple circuits)
        // Check if there's a path AND if it forms a closed loop
        
        for (const battery of batteries) {
            for (const bulb of bulbs) {
                // Check if battery and bulb are connected
                if (!this.isConnectedPath(battery.id, bulb.id)) continue;
                
                // Check if both battery and bulb have at least 2 connections (forming a loop)
                const batteryConnections = this.getComponentConnections(battery.id);
                const bulbConnections = this.getComponentConnections(bulb.id);
                
                // A complete circuit requires both terminals to be connected
                if (batteryConnections.length >= 2 && bulbConnections.length >= 2) {
                    return true;
                }
            }
        }
        
        return false;
    }

    isConnectedPath(fromId, toId) {
        // Build adjacency list from connection points
        const graph = {};
        this.components.forEach(c => {
            graph[c.id] = [];
        });
        
        this.connections.forEach(conn => {
            // Connections are between points, but we check component connectivity
            const comp1 = conn.from.componentId;
            const comp2 = conn.to.componentId;
            if (!graph[comp1].includes(comp2)) {
                graph[comp1].push(comp2);
            }
            if (!graph[comp2].includes(comp1)) {
                graph[comp2].push(comp1);
            }
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

        // Only count bulbs that are fully connected (have 2 connections)
        const allBulbs = this.components.filter(c => c.type === 'bulb');
        const connectedBulbs = allBulbs.filter(bulb => {
            const connections = this.getComponentConnections(bulb.id);
            return connections.length >= 2;
        });
        
        if (connectedBulbs.length === 0) {
            document.getElementById('current-reading').textContent = '-';
            document.getElementById('power-reading').textContent = '-';
            return;
        }

        // Analyze circuit to calculate effective voltage
        const { totalVoltage } = this.analyzeCircuit();
        
        if (totalVoltage === 0) {
            document.getElementById('current-reading').textContent = '-';
            document.getElementById('power-reading').textContent = '-';
            return;
        }

        const bulbsInParallel = this.areComponentsInParallel(connectedBulbs);
        const bulbsInSeries = this.areComponentsInSeries(connectedBulbs);
        
        let current, power;
        
        if (bulbsInParallel && connectedBulbs.length > 1) {
            // Parallel: Each bulb gets full voltage
            // Current through each bulb = V / R
            current = totalVoltage / this.resistance;
            const powerPerBulb = totalVoltage * current;
            power = powerPerBulb * connectedBulbs.length; // Total power = sum of all bulbs
        } else if (bulbsInSeries && !bulbsInParallel && connectedBulbs.length > 1) {
            // Series: Same current through all bulbs
            // Total resistance = R1 + R2 + ...
            const totalResistance = this.resistance * connectedBulbs.length;
            current = totalVoltage / totalResistance;
            power = totalVoltage * current; // Total power
        } else {
            // Single bulb or mixed circuit
            const totalResistance = this.resistance;
            current = totalVoltage / totalResistance;
            power = totalVoltage * current;
        }

        // Display with appropriate units
        let currentDisplay, powerDisplay;
        
        if (current < 1) {
            currentDisplay = `${(current * 1000).toFixed(1)} mA`;
        } else {
            currentDisplay = `${current.toFixed(2)} A`;
        }
        
        // Add indicator for parallel circuits
        if (bulbsInParallel && connectedBulbs.length > 1) {
            currentDisplay += ' (per bulb)';
        }

        if (power < 1) {
            powerDisplay = `${(power * 1000).toFixed(1)} mW`;
        } else {
            powerDisplay = `${power.toFixed(2)} W`;
        }
        
        // Add indicator for total power
        if (connectedBulbs.length > 1) {
            powerDisplay += ' (total)';
        }

        document.getElementById('current-reading').textContent = currentDisplay;
        document.getElementById('power-reading').textContent = powerDisplay;
    }

    analyzeCircuit() {
        // Find all batteries and only fully connected bulbs (with 2 connections)
        const batteries = this.components.filter(c => c.type === 'battery');
        const allBulbs = this.components.filter(c => c.type === 'bulb');
        const bulbs = allBulbs.filter(bulb => {
            const connections = this.getComponentConnections(bulb.id);
            return connections.length >= 2;
        });
        
        if (batteries.length === 0 || bulbs.length === 0) {
            return { totalVoltage: 0, totalResistance: 0 };
        }

        // Check circuit configuration
        const bulbsInSeries = this.areComponentsInSeries(bulbs);
        const bulbsInParallel = this.areComponentsInParallel(bulbs);
        const batteriesInSeries = this.areComponentsInSeries(batteries);
        
        let totalVoltage;
        if (batteriesInSeries) {
            // Series batteries: voltages add
            totalVoltage = this.voltage * batteries.length;
        } else {
            // Parallel or mixed: use base voltage
            totalVoltage = this.voltage;
        }
        
        let totalResistance;
        if (bulbs.length === 1) {
            totalResistance = this.resistance;
        } else if (bulbsInSeries && !bulbsInParallel) {
            // Pure series: resistances add
            totalResistance = this.resistance * bulbs.length;
        } else if (bulbsInParallel && !bulbsInSeries) {
            // Pure parallel: 1/R_total = 1/R1 + 1/R2 + ... = n/R for identical R
            // So R_total = R/n
            totalResistance = this.resistance / bulbs.length;
        } else {
            // Mixed or complex circuit - use average as approximation
            totalResistance = this.resistance;
        }
        
        return { totalVoltage, totalResistance };
    }

    areComponentsInParallel(components) {
        if (components.length <= 1) return false;
        
        // Components are in parallel if they share the same two connection nodes
        // Check if all components connect to the same two distinct nodes
        
        const firstComp = components[0];
        const firstConnections = this.getComponentConnections(firstComp.id);
        
        if (firstConnections.length < 2) return false;
        
        // Get the two nodes this component connects to (via its connection points)
        const firstNodes = new Set();
        firstConnections.forEach(conn => {
            if (conn.from.componentId === firstComp.id) {
                firstNodes.add(conn.to.componentId);
            } else {
                firstNodes.add(conn.from.componentId);
            }
        });
        
        // Check if all other components of the same type connect to the same nodes
        for (let i = 1; i < components.length; i++) {
            const comp = components[i];
            const compConnections = this.getComponentConnections(comp.id);
            
            const compNodes = new Set();
            compConnections.forEach(conn => {
                if (conn.from.componentId === comp.id) {
                    compNodes.add(conn.to.componentId);
                } else {
                    compNodes.add(conn.from.componentId);
                }
            });
            
            // Check if nodes match (parallel components share the same connection points)
            if (compNodes.size !== firstNodes.size) return false;
            
            const nodesMatch = Array.from(compNodes).every(node => 
                Array.from(firstNodes).some(firstNode => {
                    // Check if these nodes are connected (same electrical node)
                    return node === firstNode || this.isConnectedPath(node, firstNode);
                })
            );
            
            if (!nodesMatch) return false;
        }
        
        return true;
    }

    areComponentsInSeries(components) {
        if (components.length <= 1) return false;
        
        // Check if components are connected in a chain (series)
        // In series: each component connects to exactly 2 other components
        // and they form a single path
        
        for (let i = 0; i < components.length - 1; i++) {
            const comp1 = components[i];
            const comp2 = components[i + 1];
            
            // Check if these two components are directly connected
            const directlyConnected = this.connections.some(conn =>
                (conn.from.componentId === comp1.id && conn.to.componentId === comp2.id) ||
                (conn.from.componentId === comp2.id && conn.to.componentId === comp1.id)
            );
            
            if (directlyConnected) {
                // Check if they only connect to each other and endpoints
                const comp1Connections = this.getComponentConnections(comp1.id).length;
                const comp2Connections = this.getComponentConnections(comp2.id).length;
                
                // In a pure series, each component should have exactly 2 connections
                // (except possibly the first and last)
                if (i === 0 || i === components.length - 1) {
                    if (comp1Connections !== 2 && comp2Connections !== 2) {
                        return false;
                    }
                }
            }
        }
        
        // Simplified: if all components of same type are in one continuous path, they're in series
        return true;
    }

    getComponentConnections(componentId) {
        return this.connections.filter(conn =>
            conn.from.componentId === componentId || conn.to.componentId === componentId
        );
    }

    drawWires() {
        const canvas = document.getElementById('wire-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.connections.length === 0) return;

        // Determine if circuit is active
        const circuitComplete = this.checkCircuitComplete();
        let isActive = circuitComplete;

        // Draw each connection
        this.connections.forEach(conn => {
            const comp1 = this.components.find(c => c.id === conn.from.componentId);
            const comp2 = this.components.find(c => c.id === conn.to.componentId);
            
            if (!comp1 || !comp2) return;

            // Get connection point elements
            const el1 = document.querySelector(`[data-id="${comp1.id}"]`);
            const el2 = document.querySelector(`[data-id="${comp2.id}"]`);
            
            if (!el1 || !el2) return;
            
            const point1 = el1.querySelector(`[data-point="${conn.from.pointIndex}"]`);
            const point2 = el2.querySelector(`[data-point="${conn.to.pointIndex}"]`);
            
            if (!point1 || !point2) return;
            
            const rect1 = point1.getBoundingClientRect();
            const rect2 = point2.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const x1 = rect1.left + rect1.width / 2 - canvasRect.left;
            const y1 = rect1.top + rect1.height / 2 - canvasRect.top;
            const x2 = rect2.left + rect2.width / 2 - canvasRect.left;
            const y2 = rect2.top + rect2.height / 2 - canvasRect.top;

            // Calculate control point (use stored or default to midpoint with offset)
            let cpX = conn.controlPoint.x;
            let cpY = conn.controlPoint.y;
            
            // If control point is at origin (newly created), set default curve
            if (cpX === 0 && cpY === 0) {
                cpX = (x1 + x2) / 2 + (y2 - y1) * 0.2; // Perpendicular offset
                cpY = (y1 + y2) / 2 - (x2 - x1) * 0.2;
                conn.controlPoint.x = cpX;
                conn.controlPoint.y = cpY;
            }

            // Draw curved wire
            ctx.strokeStyle = isActive ? '#4caf50' : '#999';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(cpX, cpY, x2, y2);
            ctx.stroke();

            // Draw control point handle (small circle)
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(cpX, cpY, 6, 0, Math.PI * 2);
            ctx.fill();

            // Add current flow animation if active
            if (isActive) {
                ctx.setLineDash([10, 10]);
                ctx.strokeStyle = '#ffeb3b';
                ctx.lineWidth = 2;
                
                const offset = (Date.now() / 50) % 20;
                ctx.lineDashOffset = -offset;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.quadraticCurveTo(cpX, cpY, x2, y2);
                ctx.stroke();
                
                ctx.setLineDash([]);
            }
        });

        // Continue animation if active
        if (isActive) {
            requestAnimationFrame(() => this.drawWires());
        }
    }

    findControlPointAt(x, y) {
        const threshold = 10;
        
        for (const conn of this.connections) {
            const cpX = conn.controlPoint.x;
            const cpY = conn.controlPoint.y;
            
            const dist = Math.sqrt((x - cpX) ** 2 + (y - cpY) ** 2);
            if (dist < threshold) {
                return conn;
            }
        }
        
        return null;
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
