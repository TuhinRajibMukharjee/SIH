// Tourism Explorer - Interactive JavaScript

// Global variables
let currentDestinations = [];
let displayedDestinations = 6;
let allDestinations = [];
let currentUser = null;

// Sample destinations data
const destinationsData = [
    {
        id: 1,
        name: "Santorini, Greece",
        description: "Experience the breathtaking sunsets and white-washed buildings of this iconic Greek island.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        price: "$1,200",
        tags: ["Beach", "Romantic", "Historic"],
        location: "Greece",
        duration: "5 days"
    },
    {
        id: 2,
        name: "Kyoto, Japan",
        description: "Discover ancient temples, traditional gardens, and the beauty of Japanese culture.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        price: "$1,500",
        tags: ["Cultural", "Historic", "Temples"],
        location: "Japan",
        duration: "7 days"
    },
    {
        id: 3,
        name: "Machu Picchu, Peru",
        description: "Hike to the ancient Incan citadel and witness one of the world's most spectacular archaeological sites.",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        price: "$2,000",
        tags: ["Adventure", "Historic", "Hiking"],
        location: "Peru",
        duration: "10 days"
    },
    {
        id: 4,
        name: "Bali, Indonesia",
        description: "Relax on pristine beaches, explore lush rice terraces, and immerse yourself in Balinese culture.",
        image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        price: "$800",
        tags: ["Beach", "Cultural", "Nature"],
        location: "Indonesia",
        duration: "8 days"
    },
    {
        id: 5,
        name: "Iceland",
        description: "Witness the Northern Lights, geysers, and dramatic landscapes of this Nordic wonderland.",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        price: "$1,800",
        tags: ["Nature", "Adventure", "Northern Lights"],
        location: "Iceland",
        duration: "6 days"
    },
    {
        id: 6,
        name: "Dubai, UAE",
        description: "Experience luxury shopping, world-class dining, and modern architectural marvels.",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        price: "$1,400",
        tags: ["Luxury", "Modern", "Shopping"],
        location: "UAE",
        duration: "5 days"
    },
    {
        id: 7,
        name: "New Zealand",
        description: "Explore stunning fjords, adventure sports, and the breathtaking landscapes of Middle Earth.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        price: "$2,200",
        tags: ["Adventure", "Nature", "Hiking"],
        location: "New Zealand",
        duration: "12 days"
    },
    {
        id: 8,
        name: "Morocco",
        description: "Wander through ancient medinas, ride camels in the Sahara, and experience vibrant culture.",
        image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        price: "$1,100",
        tags: ["Cultural", "Desert", "Historic"],
        location: "Morocco",
        duration: "9 days"
    },
    {
        id: 9,
        name: "Switzerland",
        description: "Ski in the Alps, cruise on pristine lakes, and enjoy Swiss chocolate and cheese.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        price: "$1,900",
        tags: ["Mountains", "Skiing", "Lakes"],
        location: "Switzerland",
        duration: "7 days"
    },
    {
        id: 10,
        name: "Thailand",
        description: "Discover golden temples, tropical beaches, and the vibrant street food scene.",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        price: "$900",
        tags: ["Beach", "Cultural", "Food"],
        location: "Thailand",
        duration: "10 days"
    }
];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    checkUserAuthentication();
    setupNavigation();
    loadDestinations();
    setupSearch();
    setupContactForm();
    setupNewsletter();
    setupScrollAnimations();
    setupImageLazyLoading();
    setupQuickGuideForm();
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load and display destinations
function loadDestinations() {
    allDestinations = [...destinationsData];
    currentDestinations = allDestinations.slice(0, displayedDestinations);
    renderDestinations();
}

function renderDestinations() {
    const grid = document.getElementById('destinations-grid');
    grid.innerHTML = '';

    currentDestinations.forEach(destination => {
        const card = createDestinationCard(destination);
        grid.appendChild(card);
    });

    // Add animation to new cards
    const cards = grid.querySelectorAll('.destination-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.innerHTML = `
        <div class="destination-image">
            <img src="${destination.image}" alt="${destination.name}" loading="lazy">
            <div class="destination-overlay">
                <div class="overlay-content">
                    <h4>${destination.name}</h4>
                    <p>Click to explore</p>
                </div>
            </div>
        </div>
        <div class="destination-info">
            <h3>${destination.name}</h3>
            <p>${destination.description}</p>
            <div class="destination-meta">
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(destination.rating))}</span>
                    <span>${destination.rating}</span>
                </div>
                <div class="price">${destination.price}</div>
            </div>
            <div class="destination-tags">
                ${destination.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;

    // Add click event for destination details
    card.addEventListener('click', function() {
        showDestinationDetails(destination);
    });

    return card;
}

function showDestinationDetails(destination) {
    // Create modal for destination details
    const modal = document.createElement('div');
    modal.className = 'destination-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-image">
                    <img src="${destination.image}" alt="${destination.name}">
                </div>
                <div class="modal-info">
                    <h2>${destination.name}</h2>
                    <p class="modal-description">${destination.description}</p>
                    <div class="modal-details">
                        <div class="detail-item">
                            <strong>Location:</strong> ${destination.location}
                        </div>
                        <div class="detail-item">
                            <strong>Duration:</strong> ${destination.duration}
                        </div>
                        <div class="detail-item">
                            <strong>Rating:</strong> ${'★'.repeat(Math.floor(destination.rating))} ${destination.rating}
                        </div>
                        <div class="detail-item">
                            <strong>Price:</strong> ${destination.price}
                        </div>
                    </div>
                    <div class="modal-tags">
                        ${destination.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="book-now-btn" onclick="bookDestination('${destination.name}')">Book Now</button>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .destination-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s ease;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            z-index: 1;
        }
        
        .modal-image img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 15px 15px 0 0;
        }
        
        .modal-info {
            padding: 2rem;
        }
        
        .modal-info h2 {
            color: #2c5aa0;
            margin-bottom: 1rem;
        }
        
        .modal-description {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .modal-details {
            margin-bottom: 1.5rem;
        }
        
        .detail-item {
            margin-bottom: 0.5rem;
            color: #333;
        }
        
        .book-now-btn {
            background: #2c5aa0;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }
        
        .book-now-btn:hover {
            background: #1e3d72;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.destination-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function bookDestination(destinationName) {
    alert(`Thank you for your interest in ${destinationName}! Our booking system will be available soon. Please contact us for more information.`);
    closeModal();
}

// Load more destinations
function loadMoreDestinations() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    loadMoreBtn.innerHTML = '<span class="loading"></span> Loading...';
    
    setTimeout(() => {
        displayedDestinations += 3;
        currentDestinations = allDestinations.slice(0, displayedDestinations);
        renderDestinations();
        
        if (displayedDestinations >= allDestinations.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.innerHTML = 'Load More Destinations';
        }
    }, 1000);
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('destination-search');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (query.length > 0) {
            searchDestinations(query);
        } else {
            loadDestinations();
        }
    });
}

function searchDestinations(query = null) {
    if (!query) {
        query = document.getElementById('destination-search').value.toLowerCase().trim();
    }
    
    if (query.length === 0) {
        loadDestinations();
        return;
    }
    
    const filteredDestinations = allDestinations.filter(destination => 
        destination.name.toLowerCase().includes(query) ||
        destination.description.toLowerCase().includes(query) ||
        destination.location.toLowerCase().includes(query) ||
        destination.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    currentDestinations = filteredDestinations.slice(0, displayedDestinations);
    renderDestinations();
    
    // Update load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (filteredDestinations.length <= displayedDestinations) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.innerHTML = 'Load More Destinations';
    }
}

// Interactive features
function openMap() {
    alert('Interactive map feature coming soon! This will show all destinations on a world map with detailed information.');
}

function openPlanner() {
    alert('Travel planner feature coming soon! This will help you create custom itineraries for your trips.');
}

function openGallery() {
    // Create photo gallery modal
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeGallery()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeGallery()">&times;</button>
                <h2>Photo Gallery</h2>
                <div class="gallery-grid">
                    ${allDestinations.slice(0, 8).map(dest => `
                        <div class="gallery-item">
                            <img src="${dest.image}" alt="${dest.name}" onclick="openImageModal('${dest.image}', '${dest.name}')">
                            <p>${dest.name}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add gallery styles
    const style = document.createElement('style');
    style.textContent = `
        .gallery-modal .modal-content {
            max-width: 1000px;
        }
        
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .gallery-item {
            text-align: center;
        }
        
        .gallery-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .gallery-item img:hover {
            transform: scale(1.05);
        }
        
        .gallery-item p {
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: #666;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function openImageModal(imageSrc, imageTitle) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeImageModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeImageModal()">&times;</button>
                <img src="${imageSrc}" alt="${imageTitle}" style="width: 100%; max-height: 80vh; object-fit: contain;">
                <h3 style="text-align: center; margin-top: 1rem; color: #2c5aa0;">${imageTitle}</h3>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
    }
}

function openReviews() {
    alert('Reviews and ratings feature coming soon! This will show authentic reviews from fellow travelers.');
}

// Guide signup modal functions
function openGuideSignup() {
    const modal = document.getElementById('guide-signup-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGuideSignup() {
    const modal = document.getElementById('guide-signup-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Quick guide form submission
function setupQuickGuideForm() {
    const form = document.getElementById('quick-guide-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateQuickGuideForm(data)) {
                return;
            }
            
            // Submit application
            submitQuickGuideApplication(data);
        });
    }
}

function validateQuickGuideForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'location', 'experience', 'specialty', 'languages', 'description'];
    
    for (let field of requiredFields) {
        if (!data[field] || !data[field].trim()) {
            alert(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`);
            return false;
        }
    }
    
    if (!isValidEmail(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    if (!data.terms) {
        alert('You must agree to the Terms of Service and Privacy Policy.');
        return false;
    }
    
    return true;
}

function submitQuickGuideApplication(data) {
    const form = document.getElementById('quick-guide-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store application data
        const applicationData = {
            ...data,
            applicationDate: new Date().toISOString(),
            status: 'pending',
            type: 'quick'
        };
        
        localStorage.setItem('quickGuideApplication', JSON.stringify(applicationData));
        
        alert('Application submitted successfully! We will review your application and contact you within 3-5 business days.');
        
        // Close modal and reset form
        closeGuideSignup();
        document.getElementById('quick-guide-form').reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showGuideTerms() {
    alert('Guide Terms of Service: As a guide, you agree to provide safe, accurate, and professional services. You are responsible for your own insurance, taxes, and compliance with local laws. Tourism Explorer takes a commission from bookings and provides platform support.');
}

function showGuidePrivacy() {
    alert('Guide Privacy Policy: We protect your personal information and only share it as necessary for verification and platform operations. Your contact information will be shared with guests only after confirmed bookings.');
}

// Contact form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you within 24 hours.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Newsletter subscription
function setupNewsletter() {
    // Newsletter functionality is handled by the subscribeNewsletter function
}

function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate subscription
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Subscribing...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for subscribing to our newsletter!');
        document.getElementById('newsletter-email').value = '';
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .about-text, .about-image, .contact-info, .contact-form');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Lazy loading for images
function setupImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
window.addEventListener('load', function() {
    // Preload critical images
    const criticalImages = [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Authentication functions
function checkUserAuthentication() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateNavigationForLoggedInUser();
    }
}

function updateNavigationForLoggedInUser() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && currentUser) {
        // Remove sign in/sign up links
        const signInLink = navMenu.querySelector('a[href="signin.html"]');
        const signUpLink = navMenu.querySelector('a[href="signup.html"]');
        
        if (signInLink) signInLink.parentElement.remove();
        if (signUpLink) signUpLink.parentElement.remove();
        
        // Add user menu
        const userMenuItem = document.createElement('li');
        userMenuItem.className = 'nav-item';
        userMenuItem.innerHTML = `
            <div class="user-menu">
                <span class="user-name">👤 ${currentUser.firstName || currentUser.name || 'User'}</span>
                <div class="user-dropdown">
                    <a href="#" onclick="showUserProfile()">Profile</a>
                    <a href="#" onclick="showUserBookings()">My Bookings</a>
                    <a href="#" onclick="showUserFavorites()">Favorites</a>
                    <a href="#" onclick="signOut()">Sign Out</a>
                </div>
            </div>
        `;
        navMenu.appendChild(userMenuItem);
    }
}

function signOut() {
    localStorage.removeItem('user');
    currentUser = null;
    location.reload();
}

function showUserProfile() {
    if (currentUser) {
        alert(`User Profile:\nName: ${currentUser.firstName || currentUser.name}\nEmail: ${currentUser.email}\nMember since: ${new Date(currentUser.signupTime || currentUser.loginTime).toLocaleDateString()}`);
    }
}

function showUserBookings() {
    alert('My Bookings feature coming soon! This will show your travel bookings and reservations.');
}

function showUserFavorites() {
    alert('Favorites feature coming soon! This will show your saved destinations and wishlist.');
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
