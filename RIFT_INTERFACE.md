# RIFT Interface Integration

## Overview
The RIFT interface is a modern, feature-rich web proxy UI built into Project-X. It provides users with a sleek, responsive experience for web proxying with multiple views and settings.

## Files

### Core Files
- **`rift-interface.html`** - Main UI structure with all views (Home, Browse, Games, Apps, Settings)
- **`styles.css`** - Complete styling with dark theme, animations, and responsive design
- **`rift.js`** - JavaScript controller handling all interactions and proxy logic

### Key Features

#### 1. **Home View**
- RIFT branding and logo
- Main search bar for URL input
- Quick access to Games and Apps
- Recent proxies display

#### 2. **Browse View**
- URL/search input field
- Proxy content rendering area
- Status indicators (Proxying via, No active session)

#### 3. **Games & Apps Views**
- Search functionality for games/apps
- Grid-based card layout
- Extensible content structure

#### 4. **Settings**
- **Tab Cloaking**: about:blank window mode
- **Custom Tab Title**: Disguise tab titles
- **Inspect Element**: DevTools access
- **Panic Key**: Quick escape shortcut (default: Escape)
- **Proxy Transport**: Configurable proxy methods
- **Theme Settings**: UI customization

## JavaScript API

### RiftInterface Class

#### Properties
```javascript
currentView        // Current active view (home, browse, games, apps, settings)
panicKey          // Keyboard shortcut for panic (default: 'Escape')
proxyUrl          // Current proxying URL
customTabTitle    // Custom browser tab title
cloakingEnabled   // Tab cloaking status
recentProxies     // Array of recent proxy URLs
```

#### Methods

**View Management:**
- `renderHomeView()` - Display home view
- `renderBrowseView()` - Display browse/proxy view
- `renderGamesView()` - Display games view
- `renderAppsView()` - Display apps view
- `renderSettingsView()` - Display settings view

**Proxy Operations:**
- `handleProxySearch()` - Process URL search input
- `startProxying(url)` - Initiate proxying
- `proxyRequest(url, method, body)` - Make proxied request
- `normalizeUrl(url)` - Convert input to valid URL

**Security:**
- `handlePanic()` - Execute panic button
- `openCloaked(url)` - Open in about:blank window
- `closeTab()` - Close the current tab

**Settings Management:**
- `saveSettings()` - Persist settings to localStorage
- `loadSettings()` - Retrieve saved settings
- `applyCustomTitle()` - Apply custom tab title
- `updatePanicKeyDisplay()` - Update panic key UI

**Utilities:**
- `addRecentProxy(url)` - Track proxy history
- `loadRecentProxies()` - Retrieve proxy history
- `toggleSidebar()` - Show/hide sidebar

## CSS Customization

### Design Variables
```css
--primary-color: #00d4ff       /* Cyan/Blue */
--secondary-color: #1a1a2e     /* Dark Blue */
--accent-color: #16213e        /* Darker Blue */
--text-primary: #ffffff        /* White */
--text-secondary: #b0b0b0      /* Gray */
--success-color: #00ff88       /* Green */
--danger-color: #ff4444        /* Red */
```

### Key Classes
- `.rift-input` - Text input styling
- `.rift-btn-primary` - Primary button
- `.rift-tag` - Badge/tag elements
- `.rift-anim` - Slide-in animations
- `.grid-card` - Content cards
- `.sidebar` - Left navigation
- `.top-bar` - Section headers

## Integration Points

### Service Worker
The interface integrates with `sw.js` for offline functionality and request interception:
```javascript
navigator.serviceWorker.register('sw.js')
```

### localStorage API
Persistent storage for:
- Recent proxies: `riftRecentProxies`
- Settings: `riftSettings`

### Keyboard Shortcuts
- **Escape** (configurable) - Panic/close
- **Ctrl/Cmd + H** - Home view
- **Ctrl/Cmd + B** - Browse view
- **Ctrl/Cmd + G** - Games view
- **Ctrl/Cmd + A** - Apps view
- **Ctrl/Cmd + ,** - Settings

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design
- **Desktop**: Full sidebar + content layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation (configurable)

## Event Handling

### Global Functions
- `panicClose()` - Panic button handler
- `proxySearch()` - Search handler
- `showGames()` - Games view toggle
- `showApps()` - Apps view toggle
- `showSettings()` - Settings view toggle
- `showHome()` - Home view toggle

## Performance Optimizations
- CSS animations use GPU acceleration
- Event delegation for buttons
- Debounced search input
- Lazy loading for content
- Minimal reflows/repaints

## Security Features
1. **Tab Cloaking** - Hides proxy from browser history
2. **Panic Key** - Quick exit mechanism
3. **Custom Titles** - Hide true page identity
4. **Service Worker** - Request isolation
5. **Secure Contexts** - HTTPS enforcement

## Future Enhancements
- [ ] Games/Apps data integration
- [ ] User authentication
- [ ] Cloud settings sync
- [ ] Themes (light/dark/custom)
- [ ] Proxy statistics
- [ ] Advanced filtering
- [ ] Dark reader mode
- [ ] Bookmarks system

## Development

### Adding New Views
```javascript
renderCustomView() {
  this.currentView = 'custom';
  // Add view-specific logic
}
```

### Extending Settings
Add new sections in settings with:
```html
<section class="rift-section" title="Your Section">
  <!-- Settings content -->
</section>
```

### Custom Event Handlers
```javascript
document.querySelector('.your-element').addEventListener('click', () => {
  // Handler logic
});
```

## Troubleshooting

**Styles not loading?**
- Check `styles.css` path is correct
- Verify CSS file exists in `static/` directory
- Clear browser cache

**JavaScript not running?**
- Check browser console for errors
- Verify `rift.js` is loaded after HTML
- Check for JavaScript errors in other scripts

**Proxy not working?**
- Verify backend `/api/proxy` endpoint exists
- Check network requests in DevTools
- Ensure proper CORS headers

---

**Version:** 1.0  
**Built by:** Colt  
**License:** AGPL-3.0
