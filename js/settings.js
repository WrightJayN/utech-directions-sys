// settings.js

const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const aboutBtn = document.getElementById('aboutBtn');
const aboutPopup = document.getElementById('aboutPopup');
const closeAbout = document.getElementById('closeAbout');
const themeButtons = document.querySelectorAll('.theme-buttons button');
const startupTab = document.getElementById('startupTab');
const versionDisplay = document.getElementById('appVersion'); // We'll add this in HTML

let currentVersion = null; // Will store the version loaded on page start

// Fetch version and store it as currentVersion
async function loadVersion() {
    try {
        const response = await fetch('version.txt?t=' + Date.now()); // Cache-bust
        const text = await response.text();
        const version = text.trim();

        if (versionDisplay) {
            versionDisplay.textContent = version;
        }

        // On first load, save as current version
        if (!currentVersion) {
            currentVersion = version;
        }

        return version;
    } catch (err) {
        console.error('Failed to load version.txt', err);
        if (versionDisplay) versionDisplay.textContent = 'Offline';
        return null;
    }
}

// Check for new version every 5 minutes (300000 ms)
// You can change this interval — e.g., 60000 for every minute (good for development)
// Check for new version and show toast if available
async function checkForUpdate() {
    const newVersion = await loadVersion();
    
    if (newVersion && currentVersion && newVersion !== currentVersion) {
        // Key to track if user has already been notified about THIS exact version
        const notifiedKey = `update_notified_${newVersion}`;
        
        // If we've already notified about this version in this session, skip
        if (sessionStorage.getItem(notifiedKey)) {
            return; // Do nothing — user already saw it
        }

        // Show toast
        const toast = document.getElementById('updateToast');
        const versionText = document.getElementById('newVersionText');
        const reloadBtn = document.getElementById('reloadNow');
        const dismissBtn = document.getElementById('dismissToast');

        versionText.textContent = newVersion;
        toast.classList.add('show');

        // Mark that we've notified about this version
        sessionStorage.setItem(notifiedKey, 'true');

        // Clean up old notification flags (optional, prevents storage bloat)
        // Remove flags for previous versions
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('update_notified_') && key !== notifiedKey) {
                sessionStorage.removeItem(key);
            }
        });

        // Event listeners
        reloadBtn.onclick = () => {
            location.reload(true);
        };

        dismissBtn.onclick = () => {
            toast.classList.remove('show');
        };

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (toast.classList.contains('show')) {
                toast.classList.remove('show');
            }
        }, 10000);
    }
}

// Initial load
loadVersion();

// Start periodic checks (every 5 minutes)
setInterval(checkForUpdate, 300000); // 300000 ms = 5 minutes



// Toggle settings menu
settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
});

// Close menu when clicking outside
document.addEventListener('click', () => {
    settingsMenu.style.display = 'none';
});

settingsMenu.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing when clicking inside menu
});

// Theme switching
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const theme = btn.dataset.theme;
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else if (theme === 'light') {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else { // system
            document.body.classList.remove('dark-mode', 'light-mode');
            localStorage.removeItem('theme');
            applySystemTheme();
        }
    });
});

// About popup
aboutBtn.addEventListener('click', () => {
    aboutPopup.style.display = 'flex';
    settingsMenu.style.display = 'none';
});

closeAbout.addEventListener('click', () => {
    aboutPopup.style.display = 'none';
});

aboutPopup.addEventListener('click', (e) => {
    if (e.target === aboutPopup) aboutPopup.style.display = 'none';
});

// Save startup tab
startupTab.addEventListener('change', () => {
    localStorage.setItem('startupTab', startupTab.value);
});

// Load version from version.txt and display it
fetch('version.txt')
    .then(response => response.text())
    .then(version => {
        const cleanedVersion = version.trim();
        if (versionDisplay) {
            versionDisplay.textContent = cleanedVersion;
        }
    })
    .catch(err => {
        console.error('Could not load version.txt', err);
        if (versionDisplay) versionDisplay.textContent = '?.?.?';
    });

// Load saved preferences
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    const savedTab = localStorage.getItem('startupTab');

    if (savedTheme) {
        document.body.classList.add(savedTheme + '-mode');
        document.querySelector(`[data-theme="${savedTheme}"]`)?.classList.add('active');
    } else {
        applySystemTheme();
        document.querySelector('[data-theme="system"]')?.classList.add('active');
    }

    if (savedTab) {
        startupTab.value = savedTab;
    }
});

// Apply system theme preference
function applySystemTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme);