// Futuristic Interactive Script for Lumina Interactive

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle background
    initParticles();
    
    // Initialize quantum cursor
    initQuantumCursor();
    
    // Initialize product videos
    initProductVideos();
    
    // Initialize tab system
    initTabs();
    
    // Initialize pricing toggle
    initPricingToggle();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Initialize navigation highlighting
    initNavHighlighting();
});

// Initialize particles.js background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    } else {
        console.warn('particles.js not loaded');
        // Fallback to simple CSS background
        document.body.classList.add('fallback-bg');
    }
}

// Initialize quantum cursor effect
function initQuantumCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('quantum-cursor');
    
    const follower = document.createElement('div');
    follower.classList.add('quantum-cursor-follower');
    
    document.body.appendChild(cursor);
    document.body.appendChild(follower);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Change cursor size on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .product-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
}

// Initialize product videos
function initProductVideos() {
    const productVideos = document.querySelectorAll('.product-video');
    
    productVideos.forEach(video => {
        // Play videos when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(video);
        
        // Add hover effect
        const productCard = video.closest('.product-card');
        if (productCard) {
            productCard.addEventListener('mouseenter', () => {
                video.play();
            });
            
            productCard.addEventListener('mouseleave', () => {
                // Only pause if not in viewport
                if (!isElementInViewport(video)) {
                    video.pause();
                }
            });
        }
    });
}

// Initialize tab system
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const productDetails = document.querySelectorAll('.product-detail-section');
    const discoverButtons = document.querySelectorAll('.discover-btn');
    
    // Handle tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const tab = button.getAttribute('data-tab');
            
            // Deactivate all tabs for this product
            document.querySelectorAll(`.tab-button[data-product="${product}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activate clicked tab
            button.classList.add('active');
            
            // Hide all tab content for this product
            document.querySelectorAll(`.tab-content[data-product="${product}"]`).forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            document.querySelector(`.tab-content[data-product="${product}"][data-tab="${tab}"]`).classList.add('active');
        });
    });
    
    // Handle discover button clicks
    discoverButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const product = button.getAttribute('data-product');
            const detailSection = document.getElementById(`${product}-details`);
            
            // Hide all product detail sections
            productDetails.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected product detail section
            if (detailSection) {
                detailSection.style.display = 'block';
                
                // Scroll to detail section
                detailSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Initialize pricing toggle
function initPricingToggle() {
    const pricingToggles = document.querySelectorAll('.pricing-toggle input');
    
    pricingToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const parent = toggle.closest('.pricing-options');
            const digitalCard = parent.querySelector('.price-card.digital');
            const physicalCard = parent.querySelector('.price-card.physical');
            const digitalOption = parent.querySelector('.toggle-option:first-child');
            const physicalOption = parent.querySelector('.toggle-option:last-child');
            
            if (toggle.checked) {
                // Physical selected
                digitalCard.classList.remove('active');
                physicalCard.classList.add('active');
                digitalOption.classList.remove('active');
                physicalOption.classList.add('active');
            } else {
                // Digital selected
                digitalCard.classList.add('active');
                physicalCard.classList.remove('active');
                digitalOption.classList.add('active');
                physicalOption.classList.remove('active');
            }
        });
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .section-title, .about-content > *, .contact-form, .contact-info');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize navigation highlighting
function initNavHighlighting() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

