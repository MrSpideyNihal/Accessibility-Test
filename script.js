// Theme management
const themes = {
    default: '',
    dark: 'dark-theme',
    highContrast: 'high-contrast',
    light: 'light-theme'
};

// Apply theme function
function applyTheme(themeName) {
    // Remove all theme classes
    document.body.className = '';
    
    // Apply new theme if not default
    if (themeName !== 'default') {
        document.body.classList.add(themes[themeName]);
    }
    
    // Save to localStorage
    localStorage.setItem('selectedTheme', themeName);
    
    // Show notification
    showNotification(`${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme applied`);
}

// Show notification function
function showNotification(message) {
    // Remove existing notification if any
    const existingNotif = document.querySelector('.theme-notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Button event listeners
document.getElementById('defaultTheme').addEventListener('click', () => applyTheme('default'));
document.getElementById('darkTheme').addEventListener('click', () => applyTheme('dark'));
document.getElementById('highContrast').addEventListener('click', () => applyTheme('highContrast'));
document.getElementById('lightTheme').addEventListener('click', () => applyTheme('light'));
document.getElementById('resetTheme').addEventListener('click', () => {
    applyTheme('default');
    localStorage.removeItem('selectedTheme');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Check if Alt key is pressed
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                applyTheme('default');
                break;
            case '2':
                e.preventDefault();
                applyTheme('dark');
                break;
            case '3':
                e.preventDefault();
                applyTheme('highContrast');
                break;
            case '4':
                e.preventDefault();
                applyTheme('light');
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                applyTheme('default');
                localStorage.removeItem('selectedTheme');
                break;
        }
    }
});

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && themes[savedTheme]) {
        document.body.classList.add(themes[savedTheme]);
    }
});

// Announce theme changes for screen readers
function announceThemeChange(themeName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = `Theme changed to ${themeName}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
}

console.log('Theme switcher initialized. Use Alt+1/2/3/4 or Alt+R for keyboard shortcuts.');
