class DarkModeManager {
  constructor() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.init();
  }

  init() {
    this.applyTheme();
    this.createToggleButton();
    this.setupEventListeners();
  }

  createToggleButton() {
    // Add dark mode toggle to header
    const header = document.getElementById('container');
    if (header) {
      const toggleButton = document.createElement('button');
      toggleButton.id = 'darkModeToggle';
      toggleButton.className = 'dark-mode-toggle';
      toggleButton.innerHTML = this.isDarkMode ? '☀️' : '🌙';
      toggleButton.title = this.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      
      // Insert before user section
      const userSection = document.getElementById('user');
      if (userSection) {
        header.insertBefore(toggleButton, userSection);
      }
    }
  }

  setupEventListeners() {
    const toggleButton = document.getElementById('darkModeToggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggle();
      });
    }
  }

  toggle() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyTheme();
    this.updateToggleButton();
  }

  applyTheme() {
    const root = document.documentElement;
    
    if (this.isDarkMode) {
      root.style.setProperty('--bg-color', '#1a1a1a');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--card-bg', '#2d2d2d');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--input-bg', '#333333');
      root.style.setProperty('--shadow', '0 2px 10px rgba(0,0,0,0.5)');
      root.style.setProperty('--header-bg', '#2d2d2d');
      root.style.setProperty('--accent-color', '#4CAF50');
      document.body.classList.add('dark-mode');
    } else {
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#333333');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--border-color', '#e0e0e0');
      root.style.setProperty('--input-bg', '#f5f5f5');
      root.style.setProperty('--shadow', '0 2px 10px rgba(0,0,0,0.1)');
      root.style.setProperty('--header-bg', '#ffffff');
      root.style.setProperty('--accent-color', '#007bff');
      document.body.classList.remove('dark-mode');
    }
  }

  updateToggleButton() {
    const toggleButton = document.getElementById('darkModeToggle');
    if (toggleButton) {
      toggleButton.innerHTML = this.isDarkMode ? '☀️' : '🌙';
      toggleButton.title = this.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }
}

// Initialize dark mode manager
const darkModeManager = new DarkModeManager();