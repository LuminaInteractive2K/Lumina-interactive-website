/* Lumina Interactive - Main JavaScript */

// Particle background initialization
document.addEventListener('DOMContentLoaded', function() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#6e8efb"
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#a777e3",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    });
  }
});

// Modal functionality
function showProductDetails(productId) {
  const modal = document.getElementById('product-modal');
  const product = productData[productId];
  
  if (!product) return;
  
  // Set product details
  document.querySelector('.product-title').textContent = product.name;
  document.querySelector('.product-description').textContent = product.description;
  
  // Set features
  const featureList = document.querySelector('.feature-list');
  featureList.innerHTML = '';
  product.features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    featureList.appendChild(li);
  });
  
  // Set video source
  const video = document.getElementById('demo-video');
  video.src = product.videoSrc;
  
  // Store product ID for purchase
  modal.dataset.productId = productId;
  
  // Show modal
  modal.style.display = 'block';
  
  // Set first tab as active
  document.querySelector('.tab-btn[data-tab="overview"]').click();
}

// Close modal when clicking the X
document.addEventListener('DOMContentLoaded', function() {
  const closeButton = document.querySelector('.close-modal');
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      document.getElementById('product-modal').style.display = 'none';
      document.getElementById('demo-video').pause();
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
      modal.style.display = 'none';
      document.getElementById('demo-video').pause();
    }
  });
  
  // Tab functionality
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all tabs
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });
      
      // Add active class to clicked tab
      this.classList.add('active');
      document.getElementById(this.dataset.tab).classList.add('active');
    });
  });
});

// Select pricing tier and go to payment portal
function selectPricing(tier) {
  const modal = document.getElementById('product-modal');
  const productId = modal.dataset.productId;
  const product = productData[productId];
  
  // Get selected devices
  const selectedDevices = [];
  document.querySelectorAll('input[name="device"]:checked').forEach(checkbox => {
    selectedDevices.push(checkbox.value);
  });
  
  // Validate device selection
  if (selectedDevices.length === 0) {
    alert('Please select at least one device compatibility option.');
    return;
  }
  
  // Get pricing based on tier
  let price;
  switch(tier) {
    case 'basic':
      price = 299;
      break;
    case 'pro':
      price = 499;
      break;
    case 'enterprise':
      price = 999;
      break;
    default:
      price = 299;
  }
  
  // Store purchase info in session storage
  const purchaseInfo = {
    product: product.name,
    productId: productId,
    tier: tier,
    price: price,
    devices: selectedDevices
  };
  
  sessionStorage.setItem('purchaseInfo', JSON.stringify(purchaseInfo));
  
  // Redirect to payment portal
  window.location.href = 'payment_portal.html';
}

// Payment Portal Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the payment portal page
  if (document.getElementById('payment-form')) {
    // Get purchase info from session storage
    const purchaseInfo = JSON.parse(sessionStorage.getItem('purchaseInfo')) || {
      product: 'Demo Product',
      tier: 'basic',
      price: 299,
      devices: ['windows', 'mac']
    };
    
    // Set product details
    document.getElementById('product-name').textContent = purchaseInfo.product;
    document.getElementById('product-tier').textContent = capitalizeFirstLetter(purchaseInfo.tier) + ' Package';
    
    // Set product description based on tier
    let description = '';
    switch(purchaseInfo.tier) {
      case 'basic':
        description = 'Core functionality with 1 year of updates and standard support.';
        break;
      case 'pro':
        description = 'Advanced features with 2 years of updates and priority support.';
        break;
      case 'enterprise':
        description = 'Complete solution with lifetime updates, 24/7 support, and custom integration.';
        break;
      default:
        description = 'Standard package with core features.';
    }
    document.getElementById('product-description').textContent = description;
    
    // Set device list
    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = '';
    purchaseInfo.devices.forEach(device => {
      const deviceTag = document.createElement('span');
      deviceTag.className = 'device-tag';
      deviceTag.textContent = capitalizeFirstLetter(device);
      deviceList.appendChild(deviceTag);
    });
    
    // Set prices
    const price = purchaseInfo.price;
    const taxRate = 0.08; // 8% tax rate
    const taxAmount = price * taxRate;
    const total = price + taxAmount;
    
    document.getElementById('product-price').textContent = '$' + price.toFixed(2);
    document.getElementById('tax-amount').textContent = '$' + taxAmount.toFixed(2);
    document.getElementById('total-price').textContent = '$' + total.toFixed(2);
    
    // Form submission
    document.getElementById('payment-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // In a real implementation, this would send the payment data to a secure payment processor
      alert('Thank you for your purchase! Your order has been processed successfully.');
      
      // Clear session storage
      sessionStorage.removeItem('purchaseInfo');
      
      // Redirect to thank you page or homepage
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    });
  }
});

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
