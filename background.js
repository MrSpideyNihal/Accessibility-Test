// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
            switch(command) {
                case 'increase-text':
                    chrome.tabs.sendMessage(tabs[0].id, {action: 'increaseText'});
                    updateTextSize(tabs[0].id, 10);
                    break;
                case 'decrease-text':
                    chrome.tabs.sendMessage(tabs[0].id, {action: 'decreaseText'});
                    updateTextSize(tabs[0].id, -10);
                    break;
                case 'toggle-high-contrast':
                    toggleHighContrast(tabs[0].id);
                    break;
            }
        }
    });
});

// Update text size in storage
function updateTextSize(tabId, change) {
    chrome.storage.sync.get(['textSize'], (result) => {
        let currentSize = result.textSize || 100;
        currentSize += change;
        currentSize = Math.max(50, Math.min(300, currentSize));
        chrome.storage.sync.set({textSize: currentSize});
    });
}

// Toggle high contrast mode
function toggleHighContrast(tabId) {
    chrome.storage.sync.get(['theme'], (result) => {
        const newTheme = result.theme === 'highContrast' ? 'normal' : 'highContrast';
        chrome.storage.sync.set({theme: newTheme});
        chrome.tabs.sendMessage(tabId, {action: 'setTheme', value: newTheme});
    });
}

// Install/Update handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Accessibility Helper extension installed');
        // Set default values
        chrome.storage.sync.set({
            textSize: 100,
            theme: 'normal',
            lineHeight: false,
            letterSpacing: false,
            readingGuide: false,
            focusHighlight: false,
            largeCursor: false
        });
    } else if (details.reason === 'update') {
        console.log('Accessibility Helper extension updated');
    }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        chrome.storage.sync.get(null, (settings) => {
            sendResponse(settings);
        });
        return true; // Keep channel open for async response
    }
});

console.log('Accessibility Helper background script loaded');
