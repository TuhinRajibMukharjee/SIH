// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Helper Functions
class ApiClient {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  logout() {
    this.removeToken();
    window.location.reload();
  }

  // Destinations methods
  async getDestinations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/destinations${queryString ? `?${queryString}` : ''}`);
  }

  async getDestination(id) {
    return this.request(`/destinations/${id}`);
  }

  // Guide application methods
  async submitGuideApplication(applicationData) {
    return this.request('/guides/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  }

  // Contact methods
  async submitContactForm(formData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  }

  // Newsletter methods
  async subscribeNewsletter(email) {
    return this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // Admin methods
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async getAdminGuides() {
    return this.request('/admin/guides');
  }

  async blockUser(userId, reason) {
    return this.request('/admin/block-user', {
      method: 'POST',
      body: JSON.stringify({ userId, reason })
    });
  }

  async unblockUser(userId) {
    return this.request('/admin/unblock-user', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  }

  // Analytics methods
  async trackPageView(page, userId = null) {
    return this.request('/track-page-view', {
      method: 'POST',
      body: JSON.stringify({
        page,
        userId,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent
      })
    });
  }

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }
}

// Create global API client instance
const api = new ApiClient();

// Authentication Functions
async function registerUser(formData) {
  try {
    const response = await api.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    });

    showNotification('Registration successful! Please log in.', 'success');
    return response;
  } catch (error) {
    showNotification(error.message, 'error');
    throw error;
  }
}

async function loginUser(credentials) {
  try {
    const response = await api.login(credentials);
    showNotification('Login successful!', 'success');
    updateNavigationForLoggedInUser(response.user);
    return response;
  } catch (error) {
    showNotification(error.message, 'error');
    throw error;
  }
}

function logoutUser() {
  api.logout();
  showNotification('Logged out successfully!', 'success');
  updateNavigationForLoggedOutUser();
}

// User Management Functions
function checkUserAuthentication() {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 > Date.now()) {
        // Token is valid, user is logged in
        return true;
      } else {
        // Token expired
        api.removeToken();
        return false;
      }
    } catch (error) {
      api.removeToken();
      return false;
    }
  }
  return false;
}

function updateNavigationForLoggedInUser(user) {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) {
    // Remove existing auth links
    const authLinks = navMenu.querySelectorAll('.auth-link');
    authLinks.forEach(link => link.remove());

    // Add user menu
    const userMenu = document.createElement('li');
    userMenu.className = 'nav-item user-menu';
    userMenu.innerHTML = `
      <div class="user-dropdown">
        <button class="user-dropdown-btn">
          👤 ${user.firstName} ${user.lastName}
        </button>
        <div class="user-dropdown-content">
          <a href="#" onclick="showUserProfile()">Profile</a>
          <a href="#" onclick="showUserBookings()">My Bookings</a>
          <a href="#" onclick="showUserFavorites()">Favorites</a>
          <a href="#" onclick="logoutUser()">Sign Out</a>
        </div>
      </div>
    `;
    navMenu.appendChild(userMenu);
  }
}

function updateNavigationForLoggedOutUser() {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) {
    // Remove user menu
    const userMenu = navMenu.querySelector('.user-menu');
    if (userMenu) {
      userMenu.remove();
    }

    // Add auth links back
    const signInLink = document.createElement('li');
    signInLink.className = 'nav-item auth-link';
    signInLink.innerHTML = '<a href="signin.html" class="nav-link">Sign In</a>';

    const signUpLink = document.createElement('li');
    signUpLink.className = 'nav-item auth-link';
    signUpLink.innerHTML = '<a href="signup.html" class="nav-link">Sign Up</a>';

    navMenu.appendChild(signInLink);
    navMenu.appendChild(signUpLink);
  }
}

// Destination Functions
async function loadDestinations() {
  try {
    const destinations = await api.getDestinations({ limit: 8 });
    displayDestinations(destinations);
  } catch (error) {
    console.error('Failed to load destinations:', error);
    showNotification('Failed to load destinations', 'error');
  }
}

function displayDestinations(destinations) {
  const grid = document.getElementById('destinations-grid');
  if (!grid) return;

  grid.innerHTML = '';

  destinations.forEach(destination => {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.innerHTML = `
      <div class="card-image">
        <img src="${destination.image_url}" alt="${destination.name}" loading="lazy">
        <div class="card-overlay">
          <button class="btn btn-primary" onclick="viewDestination(${destination.id})">View Details</button>
        </div>
      </div>
      <div class="card-content">
        <h3>${destination.name}</h3>
        <p class="card-location">📍 ${destination.location}</p>
        <p class="card-description">${destination.description.substring(0, 100)}...</p>
        <div class="card-meta">
          <div class="card-rating">
            <span class="stars">${'★'.repeat(Math.floor(destination.rating))}</span>
            <span class="rating-text">${destination.rating}</span>
          </div>
          <div class="card-price">${destination.price}</div>
        </div>
        <div class="card-tags">
          ${destination.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function searchDestinations() {
  const searchInput = document.getElementById('destination-search');
  const query = searchInput.value.trim();

  try {
    const destinations = await api.getDestinations({ search: query, limit: 20 });
    displayDestinations(destinations);
  } catch (error) {
    console.error('Search failed:', error);
    showNotification('Search failed', 'error');
  }
}

async function viewDestination(id) {
  try {
    const destination = await api.getDestination(id);
    showDestinationModal(destination);
  } catch (error) {
    console.error('Failed to load destination:', error);
    showNotification('Failed to load destination details', 'error');
  }
}

function showDestinationModal(destination) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content destination-modal">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
      <div class="destination-details">
        <div class="destination-image">
          <img src="${destination.image_url}" alt="${destination.name}">
        </div>
        <div class="destination-info">
          <h2>${destination.name}</h2>
          <p class="destination-location">📍 ${destination.location}</p>
          <div class="destination-rating">
            <span class="stars">${'★'.repeat(Math.floor(destination.rating))}</span>
            <span class="rating-text">${destination.rating}/5</span>
          </div>
          <p class="destination-description">${destination.description}</p>
          <div class="destination-meta">
            <div class="meta-item">
              <strong>Price:</strong> ${destination.price}
            </div>
            <div class="meta-item">
              <strong>Duration:</strong> ${destination.duration}
            </div>
            <div class="meta-item">
              <strong>Category:</strong> ${destination.category}
            </div>
          </div>
          <div class="destination-tags">
            ${destination.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
          </div>
          <div class="destination-actions">
            <button class="btn btn-primary" onclick="bookDestination(${destination.id})">Book Now</button>
            <button class="btn btn-secondary" onclick="addToFavorites(${destination.id})">Add to Favorites</button>
          </div>
        </div>
      </div>
      ${destination.reviews && destination.reviews.length > 0 ? `
        <div class="destination-reviews">
          <h3>Reviews</h3>
          ${destination.reviews.map(review => `
            <div class="review-item">
              <div class="review-header">
                <strong>${review.first_name} ${review.last_name}</strong>
                <span class="review-rating">${'★'.repeat(review.rating)}</span>
              </div>
              <p class="review-comment">${review.comment}</p>
              <small class="review-date">${new Date(review.created_at).toLocaleDateString()}</small>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  document.body.appendChild(modal);
}

// Guide Application Functions
async function submitGuideApplication(formData) {
  try {
    await api.submitGuideApplication(formData);
    showNotification('Guide application submitted successfully!', 'success');
    return true;
  } catch (error) {
    showNotification(error.message, 'error');
    return false;
  }
}

// Contact Form Functions
async function submitContactForm(formData) {
  try {
    await api.submitContactForm(formData);
    showNotification('Message sent successfully!', 'success');
    return true;
  } catch (error) {
    showNotification(error.message, 'error');
    return false;
  }
}

// Newsletter Functions
async function subscribeNewsletter(email) {
  try {
    await api.subscribeNewsletter(email);
    showNotification('Successfully subscribed to newsletter!', 'success');
    return true;
  } catch (error) {
    showNotification(error.message, 'error');
    return false;
  }
}

// Admin Functions
async function loadAdminData() {
  try {
    const [stats, users, guides] = await Promise.all([
      api.getAdminStats(),
      api.getAdminUsers(),
      api.getAdminGuides()
    ]);

    updateAdminOverview(stats);
    updateAdminUsers(users);
    updateAdminGuides(guides);
  } catch (error) {
    console.error('Failed to load admin data:', error);
    showNotification('Failed to load admin data', 'error');
  }
}

function updateAdminOverview(stats) {
  document.getElementById('total-users').textContent = stats.totalUsers || 0;
  document.getElementById('total-guides').textContent = stats.totalGuideApplications || 0;
  document.getElementById('total-destinations').textContent = stats.totalDestinations || 0;
  document.getElementById('total-bookings').textContent = stats.totalBookings || 0;
  document.getElementById('total-page-views').textContent = stats.totalPageViews || 0;
}

function updateAdminUsers(users) {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">No users found</td></tr>';
    return;
  }

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>${user.first_name} ${user.last_name}</td>
      <td>${user.role}</td>
      <td>
        <span class="status ${user.is_blocked ? 'blocked' : 'active'}">
          ${user.is_blocked ? 'Blocked' : 'Active'}
        </span>
      </td>
      <td>
        ${user.is_blocked ? 
          `<button class="unblock-btn" onclick="unblockUser(${user.id})">Unblock</button>` :
          `<button class="block-btn" onclick="blockUser(${user.id})">Block</button>`
        }
      </td>
    `;
    tbody.appendChild(row);
  });
}

function updateAdminGuides(guides) {
  const tbody = document.getElementById('guides-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (guides.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No guide applications found</td></tr>';
    return;
  }

  guides.forEach(guide => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${guide.id}</td>
      <td>${guide.full_name}</td>
      <td>${guide.email}</td>
      <td>${guide.phone}</td>
      <td>${guide.experience_years} years</td>
      <td>
        <span class="status ${guide.status}">${guide.status}</span>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function blockUser(userId) {
  const reason = prompt('Enter reason for blocking this user:');
  if (!reason) return;

  try {
    await api.blockUser(userId, reason);
    showNotification('User blocked successfully', 'success');
    loadAdminData(); // Refresh data
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function unblockUser(userId) {
  try {
    await api.unblockUser(userId);
    showNotification('User unblocked successfully', 'success');
    loadAdminData(); // Refresh data
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Analytics Functions
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
  }
}

// Utility Functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Initialize API client when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
});
