// Tourism Explorer - Interactive JavaScript

// Global variables
let currentDestinations = [];
let displayedDestinations = 6;
let allDestinations = [];
let currentUser = null;

// Jharkhand destinations data
const destinationsData = [
    {
        id: 1,
        name: "Dassam Falls",
        description: "Magnificent waterfall cascading from 144 feet height, surrounded by lush greenery and perfect for nature lovers.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        price: "₹500",
        tags: ["Waterfall", "Nature", "Adventure"],
        location: "Ranchi",
        duration: "1 day"
    },
    {
        id: 2,
        name: "Betla National Park",
        description: "Rich wildlife sanctuary with tigers, elephants, and diverse flora and fauna in their natural habitat.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        price: "₹800",
        tags: ["Wildlife", "Nature", "Safari"],
        location: "Palamu",
        duration: "2 days"
    },
    {
        id: 3,
        name: "Jagannath Temple",
        description: "Ancient temple dedicated to Lord Jagannath with beautiful architecture and spiritual significance.",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        price: "₹200",
        tags: ["Temple", "Spiritual", "Historic"],
        location: "Ranchi",
        duration: "Half day"
    },
    {
        id: 4,
        name: "Hundru Falls",
        description: "Stunning waterfall with a height of 320 feet, perfect for adventure seekers and photography enthusiasts.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        price: "₹400",
        tags: ["Waterfall", "Adventure", "Photography"],
        location: "Ranchi",
        duration: "1 day"
    },
    {
        id: 5,
        name: "Netarhat",
        description: "Queen of Chotanagpur - a hill station with pleasant climate, scenic views, and peaceful environment.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        price: "₹600",
        tags: ["Hill Station", "Nature", "Peaceful"],
        location: "Latehar",
        duration: "2 days"
    },
    {
        id: 6,
        name: "Baidyanath Temple",
        description: "One of the 12 Jyotirlingas, a sacred pilgrimage site for devotees with rich spiritual heritage.",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        price: "₹300",
        tags: ["Temple", "Spiritual", "Pilgrimage"],
        location: "Deoghar",
        duration: "1 day"
    },
    {
        id: 7,
        name: "Patratu Valley",
        description: "Picturesque valley with winding roads, beautiful landscapes, and perfect for road trips.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        price: "₹350",
        tags: ["Valley", "Nature", "Road Trip"],
        location: "Ramgarh",
        duration: "1 day"
    },
    {
        id: 8,
        name: "Hazaribagh National Park",
        description: "Wildlife sanctuary with diverse species, beautiful forest trails, and nature photography opportunities.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        price: "₹700",
        tags: ["Wildlife", "Nature", "Photography"],
        location: "Hazaribagh",
        duration: "2 days"
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
    setupNavigation();
    loadDestinations();
    setupSearch();
    setupContactForm();
    setupNewsletter();
    setupScrollAnimations();
    setupImageLazyLoading();
    setupQuickGuideForm();
    setupUserAuthentication();
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

// Admin Section Functions
const ADMIN_PASSKEY = "admin123"; // Default passkey - change this in production

function showAdminLogin() {
    const modal = document.getElementById('admin-login-modal');
    modal.style.display = 'flex';
    document.getElementById('admin-passkey').focus();
}

function closeAdminLogin() {
    const modal = document.getElementById('admin-login-modal');
    modal.style.display = 'none';
    document.getElementById('admin-passkey').value = '';
}

function verifyAdminPasskey() {
    const passkey = document.getElementById('admin-passkey').value;
    
    if (passkey === ADMIN_PASSKEY) {
        closeAdminLogin();
        showAdminPanel();
    } else {
        alert('Invalid passkey. Please try again.');
        document.getElementById('admin-passkey').value = '';
    }
}

function showAdminPanel() {
    const adminSection = document.getElementById('admin-section');
    adminSection.style.display = 'block';
    adminSection.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Load admin data
    loadAdminData();
}

function closeAdminPanel() {
    const adminSection = document.getElementById('admin-section');
    adminSection.classList.remove('show');
    setTimeout(() => {
        adminSection.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function showAdminTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`admin-${tabName}`).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Load specific data for the tab
    if (tabName === 'users') {
        loadUsersData();
    } else if (tabName === 'guides') {
        loadGuidesData();
    } else if (tabName === 'destinations') {
        loadDestinationsData();
    } else if (tabName === 'blocked') {
        loadBlockedUsersData();
    }
}

function loadAdminData() {
    // Update last updated time
    document.getElementById('last-updated').textContent = new Date().toLocaleDateString();
    
    // Load overview data
    loadOverviewData();
}

function loadOverviewData() {
    // Count users
    const userData = localStorage.getItem('user');
    const totalUsers = userData ? 1 : 0;
    document.getElementById('total-users').textContent = totalUsers;
    
    // Count guide applications
    const guideApp = localStorage.getItem('guideApplication');
    const quickGuideApp = localStorage.getItem('quickGuideApplication');
    const totalGuides = (guideApp ? 1 : 0) + (quickGuideApp ? 1 : 0);
    document.getElementById('total-guides').textContent = totalGuides;
    
    // Count destinations
    document.getElementById('total-destinations').textContent = allDestinations.length;
    
    // Simulate page views
    const pageViews = localStorage.getItem('pageViews') || '0';
    const newPageViews = parseInt(pageViews) + 1;
    localStorage.setItem('pageViews', newPageViews.toString());
    document.getElementById('page-views').textContent = newPageViews;
}

function loadUsersData() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    const userData = localStorage.getItem('user');
    if (userData) {
        const user = JSON.parse(userData);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName || user.name || 'N/A'} ${user.lastName || ''}</td>
            <td>${user.email}</td>
            <td>${user.country || 'N/A'}</td>
            <td>${user.travelInterests || 'N/A'}</td>
            <td>${new Date(user.signupTime || user.loginTime).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center; color: #666;">No users registered yet</td>';
        tbody.appendChild(row);
    }
}

function loadGuidesData() {
    const tbody = document.getElementById('guides-table-body');
    tbody.innerHTML = '';
    
    const guideApp = localStorage.getItem('guideApplication');
    const quickGuideApp = localStorage.getItem('quickGuideApplication');
    
    if (guideApp) {
        const guide = JSON.parse(guideApp);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guide.firstName} ${guide.lastName}</td>
            <td>${guide.email}</td>
            <td>${guide.address || 'N/A'}</td>
            <td>${guide.experience}</td>
            <td>${guide.specialties}</td>
            <td><span style="color: #ffd700;">${guide.status}</span></td>
            <td>${new Date(guide.applicationDate).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    }
    
    if (quickGuideApp) {
        const guide = JSON.parse(quickGuideApp);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guide.firstName} ${guide.lastName}</td>
            <td>${guide.email}</td>
            <td>${guide.location}</td>
            <td>${guide.experience}</td>
            <td>${guide.specialty}</td>
            <td><span style="color: #ffd700;">${guide.status}</span></td>
            <td>${new Date(guide.applicationDate).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    }
    
    if (!guideApp && !quickGuideApp) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" style="text-align: center; color: #666;">No guide applications yet</td>';
        tbody.appendChild(row);
    }
}

function loadDestinationsData() {
    const tbody = document.getElementById('destinations-table-body');
    tbody.innerHTML = '';
    
    allDestinations.forEach(destination => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${destination.name}</td>
            <td>${destination.location}</td>
            <td>${'★'.repeat(Math.floor(destination.rating))} ${destination.rating}</td>
            <td>${destination.price}</td>
            <td>${destination.duration}</td>
            <td>${destination.tags.join(', ')}</td>
        `;
        tbody.appendChild(row);
    });
}

// User Authentication Setup
function setupUserAuthentication() {
    // Check if user is authenticated
    if (checkUserAuthentication()) {
        // User is logged in, update navigation
        const token = localStorage.getItem('authToken');
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            updateNavigationForLoggedInUser({
                firstName: payload.firstName || 'User',
                lastName: payload.lastName || '',
                email: payload.email
            });
        } catch (error) {
            api.removeToken();
        }
    }
    
    // Track page view
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    trackPageView(currentPage);
}

// Track page views using API
async function trackPageView(page) {
    try {
        const token = localStorage.getItem('authToken');
        let userId = null;
        
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                userId = payload.id;
            } catch (error) {
                // Token is invalid, ignore
            }
        }

        await api.trackPageView(page, userId);
    } catch (error) {
        console.error('Failed to track page view:', error);
        // Fallback to localStorage
        const pageViews = localStorage.getItem('pageViews') || '0';
        const newPageViews = parseInt(pageViews) + 1;
        localStorage.setItem('pageViews', newPageViews.toString());
    }
}

// Blocked Users Management
function loadBlockedUsersData() {
    const tbody = document.getElementById('blocked-users-table-body');
    tbody.innerHTML = '';
    
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    
    if (blockedUsers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center; color: #666;">No blocked users</td>';
        tbody.appendChild(row);
    } else {
        blockedUsers.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.reason}</td>
                <td>${new Date(user.blockedDate).toLocaleDateString()}</td>
                <td>${user.blockedBy}</td>
                <td>
                    <button class="unblock-btn" onclick="unblockUser(${index})">Unblock</button>
                    <button class="delete-btn" onclick="deleteBlockedUser(${index})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Update blocked stats
    updateBlockedStats();
}

function updateBlockedStats() {
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyBlocked = blockedUsers.filter(user => {
        const blockedDate = new Date(user.blockedDate);
        return blockedDate.getMonth() === currentMonth && blockedDate.getFullYear() === currentYear;
    });
    
    document.getElementById('total-blocked-count').textContent = blockedUsers.length;
    document.getElementById('monthly-blocked-count').textContent = monthlyBlocked.length;
    document.getElementById('active-blocks-count').textContent = blockedUsers.length;
}

function showBlockUserModal() {
    const modal = document.getElementById('block-user-modal');
    modal.style.display = 'flex';
    document.getElementById('block-user-email').focus();
}

function closeBlockUserModal() {
    const modal = document.getElementById('block-user-modal');
    modal.style.display = 'none';
    
    // Reset form
    document.getElementById('block-user-email').value = '';
    document.getElementById('block-reason').value = '';
    document.getElementById('block-details').value = '';
    document.getElementById('block-duration').value = 'temporary';
}

function blockUser() {
    const email = document.getElementById('block-user-email').value;
    const reason = document.getElementById('block-reason').value;
    const details = document.getElementById('block-details').value;
    const duration = document.getElementById('block-duration').value;
    
    if (!email || !reason) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Check if user is already blocked
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    if (blockedUsers.some(user => user.email === email)) {
        alert('This user is already blocked.');
        return;
    }
    
    // Create blocked user record
    const blockedUser = {
        id: 'BLK' + Date.now(),
        email: email,
        reason: reason,
        details: details,
        duration: duration,
        blockedDate: new Date().toISOString(),
        blockedBy: 'Admin',
        status: 'active'
    };
    
    // Add to blocked users list
    blockedUsers.push(blockedUser);
    localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
    
    // Check if current user is being blocked
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentUser && currentUser.email === email) {
        alert('You have been blocked from accessing this website.');
        localStorage.removeItem('user');
        window.location.reload();
        return;
    }
    
    alert('User blocked successfully.');
    closeBlockUserModal();
    loadBlockedUsersData();
}

function unblockUser(index) {
    if (confirm('Are you sure you want to unblock this user?')) {
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
        blockedUsers.splice(index, 1);
        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
        loadBlockedUsersData();
        alert('User unblocked successfully.');
    }
}

function deleteBlockedUser(index) {
    if (confirm('Are you sure you want to permanently delete this blocked user record?')) {
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
        blockedUsers.splice(index, 1);
        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
        loadBlockedUsersData();
        alert('Blocked user record deleted successfully.');
    }
}

function refreshBlockedUsers() {
    loadBlockedUsersData();
    alert('Blocked users list refreshed.');
}

// Check if current user is blocked
function checkUserBlocked() {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentUser) {
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
        const isBlocked = blockedUsers.some(user => user.email === currentUser.email && user.status === 'active');
        
        if (isBlocked) {
            alert('Your account has been blocked. Please contact support.');
            localStorage.removeItem('user');
            window.location.reload();
        }
    }
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
