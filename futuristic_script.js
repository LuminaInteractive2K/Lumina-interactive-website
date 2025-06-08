// Futuristic Interactive Script for Lumina Interactive

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle background
    initParticles();
    
    // Play videos when they come into view
    initVideoPlayback();
    
    // Initialize product interactions
    initProductInteractions();
    
    // Initialize tab system
    initTabSystem();
    
    // Initialize pricing toggle
    initPricingToggle();
    
    // Initialize form validation
    initFormValidation();
});

// Initialize particle.js background
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
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
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
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
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
    }
}

// Play videos when they come into view
function initVideoPlayback() {
    const videos = document.querySelectorAll('.product-video');
    
    // Play all videos initially
    videos.forEach(video => {
        video.play().catch(e => {
            console.log('Auto-play prevented:', e);
            // Add play button or other fallback if needed
        });
    });
    
    // Add intersection observer to play/pause videos based on visibility
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play().catch(e => console.log('Play error:', e));
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.5 });
        
        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }
}

// Initialize product interactions
function initProductInteractions() {
    // Handle discover button clicks
    const discoverButtons = document.querySelectorAll('.discover-btn');
    const productDetailSections = document.querySelectorAll('.product-detail-section');
    const closeButtons = document.querySelectorAll('.close-detail');
    
    discoverButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product');
            const detailSection = document.getElementById(`${productId}-details`);
            
            if (detailSection) {
                // Hide all detail sections first
                productDetailSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show the selected detail section
                detailSection.classList.add('active');
                
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
                
                // Ensure the demo tab is active for all products
                const demoTab = detailSection.querySelector('[data-tab="demo"]');
                if (demoTab) {
                    // First deactivate all tabs
                    const allTabs = detailSection.querySelectorAll('.tab-button');
                    allTabs.forEach(tab => tab.classList.remove('active'));
                    
                    // Then activate the demo tab
                    demoTab.classList.add('active');
                    
                    // Show the demo content
                    const allContents = detailSection.querySelectorAll('.tab-content');
                    allContents.forEach(content => content.classList.remove('active'));
                    
                    const demoContent = detailSection.querySelector(`.tab-content[data-tab="demo"][data-product="${productId}"]`);
                    if (demoContent) {
                        demoContent.classList.add('active');
                    }
                }
            }
        });
    });
    
    // Handle close button clicks
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailSection = this.closest('.product-detail-section');
            if (detailSection) {
                detailSection.classList.remove('active');
                // Restore body scrolling
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close detail section when clicking outside content
    productDetailSections.forEach(section => {
        section.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Handle escape key to close detail sections
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            productDetailSections.forEach(section => {
                if (section.classList.contains('active')) {
                    section.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
}

// Initialize tab system
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            const productId = this.getAttribute('data-product');
            const detailSection = this.closest('.product-detail-section');
            
            if (detailSection) {
                // Deactivate all tabs in this section
                const allTabs = detailSection.querySelectorAll('.tab-button');
                allTabs.forEach(tab => tab.classList.remove('active'));
                
                // Activate this tab
                this.classList.add('active');
                
                // Hide all content in this section
                const allContents = detailSection.querySelectorAll('.tab-content');
                allContents.forEach(content => content.classList.remove('active'));
                
                // Show the selected content
                const selectedContent = detailSection.querySelector(`.tab-content[data-tab="${tabName}"][data-product="${productId}"]`);
                if (selectedContent) {
                    selectedContent.classList.add('active');
                }
            }
        });
    });
}

// Initialize pricing toggle
function initPricingToggle() {
    const toggleSwitches = document.querySelectorAll('.pricing-toggle input[type="checkbox"]');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const pricingContainer = this.closest('.pricing-options');
            
            if (pricingContainer) {
                const digitalCard = pricingContainer.querySelector('.price-card.digital');
                const physicalCard = pricingContainer.querySelector('.price-card.physical');
                const digitalOption = pricingContainer.querySelector('.toggle-option:first-child');
                const physicalOption = pricingContainer.querySelector('.toggle-option:last-child');
                
                if (this.checked) {
                    // Show physical, hide digital
                    if (digitalCard) digitalCard.classList.remove('active');
                    if (physicalCard) physicalCard.classList.add('active');
                    if (digitalOption) digitalOption.classList.remove('active');
                    if (physicalOption) physicalOption.classList.add('active');
                } else {
                    // Show digital, hide physical
                    if (digitalCard) digitalCard.classList.add('active');
                    if (physicalCard) physicalCard.classList.remove('active');
                    if (digitalOption) digitalOption.classList.add('active');
                    if (physicalOption) physicalOption.classList.remove('active');
                }
            }
        });
    });
}

// Initialize form validation
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let valid = true;
            const inputs = this.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (valid) {
                // Simulate form submission
                const submitButton = this.querySelector('.submit-button');
                if (submitButton) {
                    const originalText = submitButton.textContent;
                    submitButton.textContent = 'Sending...';
                    submitButton.disabled = true;
                    
                    // Simulate API call
                    setTimeout(() => {
                        submitButton.textContent = 'Message Sent!';
                        this.reset();
                        
                        // Reset button after delay
                        setTimeout(() => {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        }, 3000);
                    }, 1500);
                }
            }
        });
    }
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add active class to nav links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Add cursor effects
document.addEventListener('mousemove', function(e) {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-trail');
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
    
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        cursor.remove();
    }, 1000);
});


