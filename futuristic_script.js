// Futuristic Interactive Script for Lumina Interactive

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor implementation
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);
    
    const cursorRing = document.createElement('div');
    cursorRing.classList.add('cursor-ring');
    document.body.appendChild(cursorRing);
    
    document.addEventListener('mousemove', function(e) {
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        
        // Add slight delay to ring for smooth effect
        setTimeout(() => {
            cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }, 50);
    });
    
    // Add active class on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('active');
            cursorRing.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('active');
            cursorRing.classList.remove('active');
        });
    });
    
    // Particle system using Three.js
    initParticleSystem();
    
    // Initialize product card visuals
    initProductVisuals();
    
    // Add parallax effect
    initParallaxEffect();
});

// Particle system implementation
function initParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particles
    const particleCount = window.innerWidth > 768 ? 2000 : 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x3a1c71); // Primary color
    const color2 = new THREE.Color(0xd76d77); // Secondary color
    const color3 = new THREE.Color(0xffaf7b); // Accent color
    
    for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 100; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
        
        // Color - blend between the three colors
        const mixFactor1 = Math.random();
        const mixFactor2 = Math.random() * (1 - mixFactor1);
        const mixFactor3 = 1 - mixFactor1 - mixFactor2;
        
        const particleColor = new THREE.Color()
            .addScaledVector(color1, mixFactor1)
            .addScaledVector(color2, mixFactor2)
            .addScaledVector(color3, mixFactor3);
        
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
        
        // Size
        sizes[i] = Math.random() * 2 + 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create particle material
    const particleMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5, 0.5));
                if (distance > 0.5) discard;
                
                float alpha = 1.0 - smoothstep(0.4, 0.5, distance);
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true,
        vertexColors: true
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth mouse following
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        // Rotate particle system based on mouse position
        particleSystem.rotation.x = targetY * 0.5;
        particleSystem.rotation.y = targetX * 0.5;
        
        // Subtle continuous rotation
        particleSystem.rotation.z += 0.001;
        
        // Update particle positions for flowing effect
        const positions = particles.attributes.position.array;
        const time = Date.now() * 0.0001;
        
        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;
            
            // Apply sine wave motion
            positions[iy] += Math.sin(time + positions[ix] * 0.1) * 0.01;
            positions[ix] += Math.cos(time + positions[iz] * 0.1) * 0.01;
            
            // Reset particles that go too far
            if (positions[ix] > 50) positions[ix] = -50;
            if (positions[ix] < -50) positions[ix] = 50;
            if (positions[iy] > 50) positions[iy] = -50;
            if (positions[iy] < -50) positions[iy] = 50;
            if (positions[iz] > 50) positions[iz] = -50;
            if (positions[iz] < -50) positions[iz] = 50;
        }
        
        particles.attributes.position.needsUpdate = true;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize product card visuals
function initProductVisuals() {
    const productCards = document.querySelectorAll('.product-card-visual');
    
    productCards.forEach((card, index) => {
        // Create canvas for each product card
        const canvas = document.createElement('canvas');
        canvas.width = card.clientWidth;
        canvas.height = card.clientHeight;
        card.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Different visualization for each product
        switch (index % 5) {
            case 0: // Neural Resonance
                drawNeuralVisualization(ctx, canvas.width, canvas.height);
                break;
            case 1: // Quantum Particle
                drawQuantumVisualization(ctx, canvas.width, canvas.height);
                break;
            case 2: // Biometric Identity
                drawBiometricVisualization(ctx, canvas.width, canvas.height);
                break;
            case 3: // Spatial Memory
                drawSpatialVisualization(ctx, canvas.width, canvas.height);
                break;
            case 4: // Collective Consciousness
                drawCollectiveVisualization(ctx, canvas.width, canvas.height);
                break;
        }
    });
}

// Neural Resonance visualization
function drawNeuralVisualization(ctx, width, height) {
    const nodeCount = 50;
    const nodes = [];
    const connections = [];
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3 + 1,
            color: `rgba(58, 28, 113, ${Math.random() * 0.5 + 0.5})`,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 70) {
                connections.push({
                    from: i,
                    to: j,
                    distance: distance,
                    opacity: 1 - distance / 70
                });
            }
        }
    }
    
    // Animation function
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        connections.forEach(conn => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.strokeStyle = `rgba(215, 109, 119, ${conn.opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
        });
        
        // Update connections
        connections.forEach(conn => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            const dx = fromNode.x - toNode.x;
            const dy = fromNode.y - toNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            conn.distance = distance;
            conn.opacity = 1 - distance / 70;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Quantum Particle visualization
function drawQuantumVisualization(ctx, width, height) {
    const particleCount = 100;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: width / 2,
            y: height / 2,
            radius: Math.random() * 2 + 1,
            color: `rgba(255, 175, 123, ${Math.random() * 0.7 + 0.3})`,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 1 + 0.5,
            spin: (Math.random() - 0.5) * 0.1,
            distance: Math.random() * 50 + 20
        });
    }
    
    // Animation function
    function animate() {
        ctx.fillStyle = 'rgba(20, 20, 43, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        particles.forEach(particle => {
            // Update position
            particle.angle += particle.spin;
            particle.x = width / 2 + Math.cos(particle.angle) * particle.distance;
            particle.y = height / 2 + Math.sin(particle.angle) * particle.distance;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Draw trail
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(
                particle.x - Math.cos(particle.angle) * 5,
                particle.y - Math.sin(particle.angle) * 5
            );
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = particle.radius / 2;
            ctx.stroke();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Biometric Identity visualization
function drawBiometricVisualization(ctx, width, height) {
    const lineCount = 20;
    const lines = [];
    
    // Create wave lines
    for (let i = 0; i < lineCount; i++) {
        lines.push({
            y: height * (i / lineCount),
            amplitude: Math.random() * 10 + 5,
            frequency: Math.random() * 0.05 + 0.01,
            speed: Math.random() * 0.02 + 0.01,
            color: `rgba(215, 109, 119, ${Math.random() * 0.5 + 0.3})`
        });
    }
    
    // Animation function
    let time = 0;
    function animate() {
        ctx.fillStyle = 'rgba(20, 20, 43, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        time += 0.05;
        
        lines.forEach(line => {
            ctx.beginPath();
            
            for (let x = 0; x < width; x++) {
                const y = line.y + Math.sin(x * line.frequency + time * line.speed) * line.amplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.strokeStyle = line.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Spatial Memory visualization
function drawSpatialVisualization(ctx, width, height) {
    const gridSize = 10;
    const cellSize = Math.min(width, height) / gridSize;
    const grid = [];
    
    // Create grid
    for (let x = 0; x < gridSize; x++) {
        grid[x] = [];
        for (let y = 0; y < gridSize; y++) {
            grid[x][y] = {
                height: Math.random(),
                color: `rgba(76, 201, 240, ${Math.random() * 0.5 + 0.3})`,
                targetHeight: Math.random(),
                speed: Math.random() * 0.05 + 0.01
            };
        }
    }
    
    // Animation function
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const cell = grid[x][y];
                
                // Update height
                cell.height += (cell.targetHeight - cell.height) * cell.speed;
                
                // Occasionally change target height
                if (Math.random() < 0.01) {
                    cell.targetHeight = Math.random();
                }
                
                // Draw cell
                const cellX = x * cellSize;
                const cellY = y * cellSize;
                const cellHeight = cell.height * cellSize;
                
                ctx.fillStyle = cell.color;
                ctx.fillRect(cellX, cellY, cellSize, cellSize);
                
                // Draw 3D effect
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(cellX, cellY + cellSize - cellHeight, cellSize, cellHeight);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Collective Consciousness visualization
function drawCollectiveVisualization(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 10;
    const particleCount = 100;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * maxRadius;
        
        particles.push({
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            radius: Math.random() * 3 + 1,
            color: `rgba(58, 28, 113, ${Math.random() * 0.7 + 0.3})`,
            targetX: centerX + Math.cos(angle) * distance,
            targetY: centerY + Math.sin(angle) * distance,
            speed: Math.random() * 0.05 + 0.02,
            connectionRadius: Math.random() * 50 + 30
        });
    }
    
    // Animation function
    function animate() {
        ctx.fillStyle = 'rgba(20, 20, 43, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < p1.connectionRadius) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = 1 - distance / p1.connectionRadius;
                    ctx.strokeStyle = `rgba(215, 109, 119, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        // Draw and update particles
        particles.forEach(p => {
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Update position
            p.x += (p.targetX - p.x) * p.speed;
            p.y += (p.targetY - p.y) * p.speed;
            
            // Occasionally change target
            if (Math.random() < 0.01) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * maxRadius;
                p.targetX = centerX + Math.cos(angle) * distance;
                p.targetY = centerY + Math.sin(angle) * distance;
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Parallax effect
function initParallaxEffect() {
    const heroContent = document.querySelector('.hero-content-wrapper');
    const productCards = document.querySelectorAll('.product-card-futuristic');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Parallax for hero content
        if (heroContent) {
            gsap.to(heroContent, {
                x: mouseX * 20,
                y: mouseY * 20,
                duration: 1,
                ease: 'power2.out'
            });
        }
        
        // Parallax for product cards
        productCards.forEach((card, index) => {
            gsap.to(card, {
                x: mouseX * 10 * (index % 3 + 1),
                y: mouseY * 10 * (index % 2 + 1),
                rotateX: mouseY * 5,
                rotateY: -mouseX * 5,
                duration: 1,
                ease: 'power2.out'
            });
        });
    });
}

// Add compatibility badges to product cards
function addCompatibilityBadges() {
    const productCards = document.querySelectorAll('.product-card-futuristic');
    
    productCards.forEach(card => {
        const badgeContainer = document.createElement('div');
        badgeContainer.classList.add('compatibility-badges');
        
        const platforms = ['Windows', 'macOS', 'Android', 'iOS'];
        
        platforms.forEach(platform => {
            const badge = document.createElement('span');
            badge.classList.add('compatibility-badge');
            badge.textContent = platform;
            badgeContainer.appendChild(badge);
        });
        
        card.appendChild(badgeContainer);
    });
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addCompatibilityBadges();
});
