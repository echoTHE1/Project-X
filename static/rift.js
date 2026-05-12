/**
 * RIFT - Modern Web Proxy Interface Controller
 * Version: 1.0
 * Built by: Colt
 * License: AGPL-3.0
 */

class RiftInterface {
  constructor() {
    this.currentView = 'home';
    this.proxyUrl = null;
    this.customTabTitle = null;
    this.cloakingEnabled = false;
    this.panicKey = 'Escape';
    this.recentProxies = [];
    
    this.init();
  }

  /**
   * Initialize RIFT interface
   */
  init() {
    this.loadSettings();
    this.attachEventListeners();
    this.registerServiceWorker();
    this.renderHomeView();
    console.log('RIFT Interface initialized');
  }

  /**
   * Load saved settings from localStorage
   */
  loadSettings() {
    const saved = localStorage.getItem('riftSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      this.customTabTitle = settings.customTabTitle || null;
      this.cloakingEnabled = settings.cloakingEnabled || false;
      this.panicKey = settings.panicKey || 'Escape';
    }
    
    const proxies = localStorage.getItem('riftRecentProxies');
    this.recentProxies = proxies ? JSON.parse(proxies) : [];
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    const settings = {
      customTabTitle: this.customTabTitle,
      cloakingEnabled: this.cloakingEnabled,
      panicKey: this.panicKey
    };
    localStorage.setItem('riftSettings', JSON.stringify(settings));
    localStorage.setItem('riftRecentProxies', JSON.stringify(this.recentProxies));
  }

  /**
   * Register Service Worker for offline support
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.warn('Service Worker registration failed:', err);
      });
    }
  }

  /**
   * Attach global event listeners
   */
  attachEventListeners() {
    // Panic button
    document.addEventListener('keydown', (e) => {
      if (e.key === this.panicKey) {
        e.preventDefault();
        this.handlePanic();
      }
    });

    // Panic button click
    const panicBtn = document.querySelector('button[title="Panic — close tab"]');
    if (panicBtn) {
      panicBtn.addEventListener('click', () => this.handlePanic());
    }

    // Search buttons
    document.querySelectorAll('.rift-btn-primary').forEach(btn => {
      if (btn.textContent.trim() === 'GO') {
        btn.addEventListener('click', () => this.handleProxySearch());
      }
    });

    // Settings buttons
    document.querySelectorAll('.rift-input').forEach(input => {
      if (input.placeholder?.includes('URL') || input.placeholder?.includes('search')) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.handleProxySearch();
          }
        });
      }
    });

    // Tab cloaking toggle
    const cloakToggle = document.getElementById('cloak-toggle');
    if (cloakToggle) {
      cloakToggle.checked = this.cloakingEnabled;
      cloakToggle.addEventListener('change', () => {
        this.cloakingEnabled = cloakToggle.checked;
        this.saveSettings();
      });
    }
  }

  /**
   * Handle proxy search
   */
  handleProxySearch() {
    const inputs = document.querySelectorAll('.rift-input');
    let url = null;

    // Find the active search input
    inputs.forEach(input => {
      if (input.value && (input.placeholder?.includes('URL') || input.placeholder?.includes('proxy'))) {
        url = input.value;
      }
    });

    if (url) {
      this.startProxying(url);
    }
  }

  /**
   * Start proxying a URL
   */
  startProxying(urlInput) {
    const url = this.normalizeUrl(urlInput);
    
    if (!url) {
      this.showNotification('Invalid URL', 'error');
      return;
    }

    this.proxyUrl = url;
    this.addRecentProxy(url);
    this.renderBrowseView();

    // Make proxy request
    this.proxyRequest(url);
  }

  /**
   * Make proxied request to backend
   */
  proxyRequest(url, method = 'GET', body = null) {
    const proxyData = {
      url: url,
      method: method,
      body: body
    };

    // Send to backend API
    fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proxyData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        this.renderProxyContent(data);
        if (this.customTabTitle) {
          document.title = this.customTabTitle;
        }
      } else {
        this.showNotification('Proxy request failed', 'error');
      }
    })
    .catch(err => {
      console.error('Proxy error:', err);
      this.showNotification('Connection error', 'error');
    });
  }

  /**
   * Normalize and validate URL
   */
  normalizeUrl(input) {
    if (!input) return null;

    try {
      // Add protocol if missing
      if (!input.match(/^https?:\/\//i)) {
        input = 'http://' + input;
      }

      const url = new URL(input);
      return url.toString();
    } catch (e) {
      return null;
    }
  }

  /**
   * Add URL to recent proxies
   */
  addRecentProxy(url) {
    if (!this.recentProxies.includes(url)) {
      this.recentProxies.unshift(url);
      if (this.recentProxies.length > 10) {
        this.recentProxies.pop();
      }
      this.saveSettings();
    }
  }

  /**
   * Render home view
   */
  renderHomeView() {
    this.currentView = 'home';
    this.hideAllViews();
    
    const views = document.querySelectorAll('.rift-anim');
    views.forEach((view, idx) => {
      if (idx === 0) { // First rift-anim is home
        view.classList.add('active');
      }
    });
  }

  /**
   * Render browse view
   */
  renderBrowseView() {
    this.currentView = 'browse';
    this.hideAllViews();

    const views = document.querySelectorAll('.rift-anim');
    if (views[1]) {
      views[1].classList.add('active'); // Second view is browse
    }
  }

  /**
   * Render games view
   */
  renderGamesView() {
    this.currentView = 'games';
    this.hideAllViews();

    const views = document.querySelectorAll('.rift-anim');
    if (views[2]) {
      views[2].classList.add('active');
    }
  }

  /**
   * Render apps view
   */
  renderAppsView() {
    this.currentView = 'apps';
    this.hideAllViews();

    const views = document.querySelectorAll('.rift-anim');
    if (views[3]) {
      views[3].classList.add('active');
    }
  }

  /**
   * Render settings view
   */
  renderSettingsView() {
    this.currentView = 'settings';
    this.hideAllViews();

    const views = document.querySelectorAll('.rift-anim');
    if (views[4]) {
      views[4].classList.add('active');
    }
  }

  /**
   * Hide all views
   */
  hideAllViews() {
    document.querySelectorAll('.rift-anim').forEach(view => {
      view.classList.remove('active');
    });
  }

  /**
   * Render proxy content
   */
  renderProxyContent(data) {
    const proxyArea = document.querySelector('.rift-anim.active > div:last-child');
    if (proxyArea) {
      proxyArea.innerHTML = data.html || '<div>Loading...</div>';
    }
  }

  /**
   * Handle panic button - close and redirect
   */
  handlePanic() {
    // Clear sensitive data
    this.proxyUrl = null;
    localStorage.removeItem('riftRecentProxies');

    // Redirect to safe page
    const redirectUrl = 'https://www.google.com';
    
    if (this.cloakingEnabled) {
      // Close in about:blank window
      this.openCloaked(redirectUrl);
      window.close();
    } else {
      // Simple redirect
      window.location.href = redirectUrl;
    }
  }

  /**
   * Open URL in about:blank cloaked window
   */
  openCloaked(url) {
    const win = window.open('about:blank', '_blank');
    if (win) {
      win.location.href = url;
    }
  }

  /**
   * Apply custom tab title
   */
  applyCustomTitle(title) {
    this.customTabTitle = title;
    document.title = title;
    this.saveSettings();
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'error' ? '#ff4444' : '#00d4ff'};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.rift = new RiftInterface();
});

// Global shortcut functions for HTML onclick handlers
window.showHome = () => window.rift?.renderHomeView();
window.showBrowse = () => window.rift?.renderBrowseView();
window.showGames = () => window.rift?.renderGamesView();
window.showApps = () => window.rift?.renderAppsView();
window.showSettings = () => window.rift?.renderSettingsView();
window.proxySearch = () => window.rift?.handleProxySearch();
window.panicClose = () => window.rift?.handlePanic();
