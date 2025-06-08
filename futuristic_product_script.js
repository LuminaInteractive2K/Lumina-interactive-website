// Futuristic Product Page Script for Lumina Interactive

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tab navigation
    initTabs();
    
    // Initialize neural hero visual
    initNeuralHeroVisual();
    
    // Initialize video player
    initVideoPlayer();
    
    // Initialize pricing toggle
    initPricingToggle();
    
    // Initialize platform icons
    initPlatformIcons();
    
    // Initialize feature icons
    initFeatureIcons();
    
    // Initialize highlight icons
    initHighlightIcons();
});

// Tab navigation functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Neural hero visual
function initNeuralHeroVisual() {
    const container = document.getElementById('neural-hero-visual');
    if (!container) return;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Neural network parameters
    const nodeCount = 100;
    const nodes = [];
    const connections = [];
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 100 - 50, // z-depth for 3D effect
            radius: Math.random() * 3 + 1,
            color: `rgba(58, 28, 113, ${Math.random() * 0.5 + 0.5})`,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            vz: (Math.random() - 0.5) * 0.5
        });
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dz = nodes[i].z - nodes[j].z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance < 100) {
                connections.push({
                    from: i,
                    to: j,
                    distance: distance,
                    opacity: 1 - distance / 100
                });
            }
        }
    }
    
    // Animation function
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Sort nodes by z-depth for proper 3D rendering
        const sortedNodes = [...nodes].sort((a, b) => a.z - b.z);
        
        // Draw connections
        connections.forEach(conn => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            
            // Calculate size based on z-depth
            const fromScale = (fromNode.z + 50) / 100;
            const toScale = (toNode.z + 50) / 100;
            
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            
            // Gradient for connections
            const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
            gradient.addColorStop(0, `rgba(215, 109, 119, ${conn.opacity * fromScale * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 175, 123, ${conn.opacity * toScale * 0.5})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
        
        // Draw nodes
        sortedNodes.forEach(node => {
            // Calculate size based on z-depth
            const scale = (node.z + 50) / 100;
            const scaledRadius = node.radius * scale * 2;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, scaledRadius, 0, Math.PI * 2);
            
            // Color based on depth
            const alpha = 0.3 + scale * 0.7;
            ctx.fillStyle = `rgba(58, 28, 113, ${alpha})`;
            ctx.fill();
            
            // Add glow effect
            ctx.beginPath();
            ctx.arc(node.x, node.y, scaledRadius * 1.5, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                node.x, node.y, scaledRadius * 0.5,
                node.x, node.y, scaledRadius * 1.5
            );
            gradient.addColorStop(0, `rgba(215, 109, 119, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(215, 109, 119, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            node.z += node.vz;
            
            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            if (node.z < -50 || node.z > 50) node.vz *= -1;
        });
        
        // Update connections
        connections.forEach(conn => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            const dx = fromNode.x - toNode.x;
            const dy = fromNode.y - toNode.y;
            const dz = fromNode.z - toNode.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            conn.distance = distance;
            conn.opacity = 1 - distance / 100;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    });
    
    // Interactive effect with mouse
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        nodes.forEach(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                node.vx += dx * force * 0.01;
                node.vy += dy * force * 0.01;
            }
        });
    });
}

// Video player functionality
function initVideoPlayer() {
    const video = document.getElementById('demo-video');
    const playButton = document.querySelector('.video-play-button');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (!video || !playButton || !videoOverlay) return;
    
    playButton.addEventListener('click', () => {
        video.play();
        videoOverlay.classList.add('hidden');
    });
    
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            videoOverlay.classList.add('hidden');
        } else {
            video.pause();
            videoOverlay.classList.remove('hidden');
        }
    });
    
    video.addEventListener('ended', () => {
        videoOverlay.classList.remove('hidden');
    });
    
    video.addEventListener('pause', () => {
        videoOverlay.classList.remove('hidden');
    });
}

// Pricing toggle functionality
function initPricingToggle() {
    const toggle = document.getElementById('pricing-toggle');
    const digitalOptions = document.getElementById('digital-options');
    const physicalOptions = document.getElementById('physical-options');
    
    if (!toggle || !digitalOptions || !physicalOptions) return;
    
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            digitalOptions.classList.remove('active');
            physicalOptions.classList.add('active');
        } else {
            digitalOptions.classList.add('active');
            physicalOptions.classList.remove('active');
        }
    });
}

// Platform icons initialization
function initPlatformIcons() {
    const platformIcons = document.querySelectorAll('.platform-icon');
    
    platformIcons.forEach(icon => {
        const platform = icon.getAttribute('data-platform');
        
        // Create SVG for each platform
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '30');
        svg.setAttribute('height', '30');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        
        // Set path based on platform
        let path;
        switch (platform) {
            case 'windows':
                // Windows logo
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M3 5l9-2v9H3V5zm0 14l9 2v-9H3v7zm11-16l8-2v11h-8V3zm0 18l8 2v-9h-8v7z');
                break;
            case 'macos':
                // Apple logo
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 2a8 8 0 0 0-8 8v12h16V10a8 8 0 0 0-8-8zm0 4a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4z');
                break;
            case 'android':
                // Android logo
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M5 16V8a7 7 0 0 1 14 0v8M1 16h22M7 16v3M17 16v3M12 1l-2 4M12 1l2 4');
                break;
            case 'ios':
                // iOS logo
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M9 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm7-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 20v-6H5v6h4zm-5-8h20M12 6v14M17 20v-6h4v6h-4z');
                break;
        }
        
        if (path) {
            svg.appendChild(path);
            icon.appendChild(svg);
        }
    });
}

// Feature icons initialization
function initFeatureIcons() {
    const featureIcons = document.querySelectorAll('.feature-icon');
    
    featureIcons.forEach((icon, index) => {
        const iconType = icon.getAttribute('data-icon') || `feature-${index}`;
        
        // Create SVG for each feature
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '30');
        svg.setAttribute('height', '30');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'white');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        
        // Set path based on icon type
        let path;
        switch (iconType) {
            case 'brainwave':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 2a8 8 0 0 0-8 8v4a8 8 0 0 0 16 0v-4a8 8 0 0 0-8-8zm0 14a6 6 0 0 1-6-6V8a6 6 0 0 1 12 0v2a6 6 0 0 1-6 6z');
                break;
            case 'performance':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83');
                break;
            case 'creative':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zM9 21h6');
                break;
            case 'emotional':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
                break;
            case 'consciousness':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zM9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0z');
                break;
            case 'sync':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9V3m-9 9a9 9 0 0 1 9-9');
                break;
            default:
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z');
        }
        
        if (path) {
            svg.appendChild(path);
            icon.appendChild(svg);
        }
    });
}

// Highlight icons initialization
function initHighlightIcons() {
    const highlightIcons = document.querySelectorAll('.highlight-icon');
    
    highlightIcons.forEach((icon, index) => {
        const iconType = icon.getAttribute('data-icon') || `highlight-${index}`;
        
        // Create SVG for each highlight
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '30');
        svg.setAttribute('height', '30');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'white');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        
        // Set path based on icon type
        let path;
        switch (iconType) {
            case 'brain':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M9.5 2A2.5 2.5 0 0 1 12 4.5V12h7.5a2.5 2.5 0 0 1 0 5H12v2.5a2.5 2.5 0 0 1-5 0V12H4.5a2.5 2.5 0 0 1 0-5H7V4.5A2.5 2.5 0 0 1 9.5 2z');
                break;
            case 'quantum':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-5-8a5 5 0 0 1 10 0m-10 0a5 5 0 0 0 10 0m-5-5v10');
                break;
            case 'exclusive':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
                break;
            default:
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z');
        }
        
        if (path) {
            svg.appendChild(path);
            icon.appendChild(svg);
        }
    });
}
