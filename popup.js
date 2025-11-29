// Send message to content script
function sendMessage(action, value) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action, value});
    });
}

// Load saved settings
function loadSettings() {
    chrome.storage.sync.get([
        'textSize',
        'lineHeight',
        'letterSpacing',
        'readingGuide',
        'focusHighlight',
        'largeCursor'
    ], (result) => {
        if (result.textSize) {
            document.getElementById('currentSize').textContent = result.textSize + '%';
        }
        
        document.getElementById('toggleLineHeight').checked = result.lineHeight || false;
        document.getElementById('toggleLetterSpacing').checked = result.letterSpacing || false;
        document.getElementById('toggleReadingGuide').checked = result.readingGuide || false;
        document.getElementById('toggleFocusHighlight').checked = result.focusHighlight || false;
        document.getElementById('toggleCursorSize').checked = result.largeCursor || false;
    });
}

// Text Size Controls
document.getElementById('increaseText').addEventListener('click', () => {
    sendMessage('increaseText');
    updateTextSize(10);
});

document.getElementById('decreaseText').addEventListener('click', () => {
    sendMessage('decreaseText');
    updateTextSize(-10);
});

document.getElementById('resetText').addEventListener('click', () => {
    sendMessage('resetText');
    chrome.storage.sync.set({textSize: 100});
    document.getElementById('currentSize').textContent = '100%';
});

function updateTextSize(change) {
    chrome.storage.sync.get(['textSize'], (result) => {
        let currentSize = result.textSize || 100;
        currentSize += change;
        currentSize = Math.max(50, Math.min(300, currentSize));
        chrome.storage.sync.set({textSize: currentSize});
        document.getElementById('currentSize').textContent = currentSize + '%';
    });
}

// Theme Controls
document.getElementById('normalTheme').addEventListener('click', () => {
    sendMessage('setTheme', 'normal');
    chrome.storage.sync.set({theme: 'normal'});
});

document.getElementById('darkMode').addEventListener('click', () => {
    sendMessage('setTheme', 'dark');
    chrome.storage.sync.set({theme: 'dark'});
});

document.getElementById('highContrast').addEventListener('click', () => {
    sendMessage('setTheme', 'highContrast');
    chrome.storage.sync.set({theme: 'highContrast'});
});

document.getElementById('yellowBlack').addEventListener('click', () => {
    sendMessage('setTheme', 'yellowBlack');
    chrome.storage.sync.set({theme: 'yellowBlack'});
});

// Reading Aids Toggles
document.getElementById('toggleLineHeight').addEventListener('change', (e) => {
    sendMessage('toggleLineHeight', e.target.checked);
    chrome.storage.sync.set({lineHeight: e.target.checked});
});

document.getElementById('toggleLetterSpacing').addEventListener('change', (e) => {
    sendMessage('toggleLetterSpacing', e.target.checked);
    chrome.storage.sync.set({letterSpacing: e.target.checked});
});

document.getElementById('toggleReadingGuide').addEventListener('change', (e) => {
    sendMessage('toggleReadingGuide', e.target.checked);
    chrome.storage.sync.set({readingGuide: e.target.checked});
});

// Focus & Navigation Toggles
document.getElementById('toggleFocusHighlight').addEventListener('change', (e) => {
    sendMessage('toggleFocusHighlight', e.target.checked);
    chrome.storage.sync.set({focusHighlight: e.target.checked});
});

document.getElementById('toggleCursorSize').addEventListener('change', (e) => {
    sendMessage('toggleCursorSize', e.target.checked);
    chrome.storage.sync.set({largeCursor: e.target.checked});
});

// Reset All
document.getElementById('resetAll').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all accessibility settings?')) {
        chrome.storage.sync.clear();
        sendMessage('resetAll');
        
        document.getElementById('currentSize').textContent = '100%';
        document.getElementById('toggleLineHeight').checked = false;
        document.getElementById('toggleLetterSpacing').checked = false;
        document.getElementById('toggleReadingGuide').checked = false;
        document.getElementById('toggleFocusHighlight').checked = false;
        document.getElementById('toggleCursorSize').checked = false;
        
        alert('All settings have been reset!');
    }
});

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', loadSettings);
