class AuthManager {
  constructor() {
    this.baseURL = window.location.origin;
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.init();
  }

  init() {
    this.updateAuthUI();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Logout button
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('logout-btn')) {
        this.logout();
      }
    });
  }

  async handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch(`${this.baseURL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.updateAuthUI();
        this.showMessage('Login successful!', 'success');
        this.closeModal();
      } else {
        this.showMessage(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      this.showMessage('Network error. Please try again.', 'error');
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      this.showMessage('Passwords do not match', 'error');
      return;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.updateAuthUI();
        this.showMessage('Registration successful!', 'success');
        this.closeModal();
      } else {
        this.showMessage(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      this.showMessage('Network error. Please try again.', 'error');
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.updateAuthUI();
    this.showMessage('Logged out successfully', 'success');
  }

  updateAuthUI() {
    const userIcon = document.querySelector('.userIcon');
    if (!userIcon) return;

    const userContainer = userIcon.parentElement;
    
    if (this.user) {
      userContainer.innerHTML = `
        <div class="user-dropdown">
          <span class="username">${this.user.username}</span>
          <button class="logout-btn">Logout</button>
        </div>
      `;
    } else {
      userContainer.innerHTML = `
        <i class="fas fa-user-circle userIcon" onclick="authManager.showAuthModal()"></i>
      `;
    }
  }

  showAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="authManager.closeModal()">&times;</span>
        <div class="auth-tabs">
          <button class="tab-btn active" onclick="authManager.showTab('login')">Login</button>
          <button class="tab-btn" onclick="authManager.showTab('register')">Register</button>
        </div>
        
        <div id="loginTab" class="tab-content active">
          <form id="loginForm">
            <h2>Login</h2>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
          </form>
        </div>
        
        <div id="registerTab" class="tab-content">
          <form id="registerForm">
            <h2>Register</h2>
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.setupEventListeners();
  }

  showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
  }

  closeModal() {
    const modal = document.querySelector('.auth-modal');
    if (modal) {
      modal.remove();
    }
  }

  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      z-index: 10000;
      background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Initialize auth manager
const authManager = new AuthManager();