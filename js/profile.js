// =============================================
// PROFILE PAGE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    loadProfileStats();
    setupProfileEdit();
    setupAvatarChange();
    setupDarkMode();
    setupNotifToggle();
    setupPrivacyBtn();
    setupClearData();
    setupLogout();
    updateNotificationBadge();
});

// =============================================
// LOAD PROFILE DATA
// =============================================

function loadProfileData() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        name: 'Your Name',
        handle: 'yourhandle',
        email: 'you@email.com',
        avatar: 'P',
        joined: '2026'
    };
    
    // Update display
    document.getElementById('profileName').textContent = userData.name;
    document.getElementById('profileHandle').textContent = '@' + userData.handle;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileAvatar').textContent = userData.avatar;
    
    // Also update channel data if it exists
    const channelData = JSON.parse(localStorage.getItem('channelData')) || {};
    if (channelData.name) {
        document.getElementById('profileName').textContent = channelData.name;
    }
    if (channelData.handle) {
        document.getElementById('profileHandle').textContent = '@' + channelData.handle;
    }
    if (channelData.avatar) {
        document.getElementById('profileAvatar').textContent = channelData.avatar;
    }
}

// =============================================
// LOAD PROFILE STATS
// =============================================

function loadProfileStats() {
    // Get subscribers
    let subscribers = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('subscribed_') && localStorage.getItem(key) === 'true') {
            subscribers++;
        }
    }
    if (subscribers === 0) subscribers = Math.floor(Math.random() * 1000) + 100;
    
    // Get videos
    const userVideos = JSON.parse(localStorage.getItem('userVideos')) || [];
    const videosCount = userVideos.length;
    
    // Get likes
    let likes = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('liked_') && !key.includes('_count')) {
            if (localStorage.getItem(key) === 'true') {
                likes++;
            }
        }
    }
    
    // Get total views from history
    const history = JSON.parse(localStorage.getItem('watchHistory')) || [];
    const views = history.length * 100 + Math.floor(Math.random() * 5000);
    
    // Update display
    document.getElementById('statSubscribers').textContent = subscribers.toLocaleString();
    document.getElementById('statVideos').textContent = videosCount;
    document.getElementById('statLikes').textContent = likes;
    document.getElementById('statViews').textContent = views.toLocaleString();
}

// =============================================
// SETUP PROFILE EDIT
// =============================================

function setupProfileEdit() {
    const editBtn = document.getElementById('editProfileBtn');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Get current user data
            const userData = JSON.parse(localStorage.getItem('userData')) || {
                name: 'Your Name',
                handle: 'yourhandle',
                email: 'you@email.com',
                avatar: 'P',
                joined: '2026'
            };
            
            // Get channel data
            const channelData = JSON.parse(localStorage.getItem('channelData')) || {};
            
            // Edit name
            const newName = prompt('Full Name:', userData.name || channelData.name || 'Your Name');
            if (newName !== null && newName.trim() !== '') {
                userData.name = newName.trim();
                channelData.name = newName.trim();
            }
            
            // Edit handle
            const newHandle = prompt('Handle (without @):', userData.handle || channelData.handle || 'yourhandle');
            if (newHandle !== null && newHandle.trim() !== '') {
                userData.handle = newHandle.trim();
                channelData.handle = newHandle.trim();
            }
            
            // Edit email
            const newEmail = prompt('Email:', userData.email || 'you@email.com');
            if (newEmail !== null && newEmail.trim() !== '') {
                userData.email = newEmail.trim();
            }
            
            // Edit avatar
            const newAvatar = prompt('Avatar (single letter or emoji):', userData.avatar || channelData.avatar || 'P');
            if (newAvatar !== null && newAvatar.trim() !== '') {
                userData.avatar = newAvatar.trim();
                channelData.avatar = newAvatar.trim();
            }
            
            // Save to localStorage
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('channelData', JSON.stringify(channelData));
            
            // Reload profile
            loadProfileData();
            alert('✅ Profile updated successfully!');
        });
    }
}

// =============================================
// SETUP AVATAR CHANGE
// =============================================

function setupAvatarChange() {
    const changeBtn = document.getElementById('changeAvatarBtn');
    
    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            const userData = JSON.parse(localStorage.getItem('userData')) || {
                name: 'Your Name',
                handle: 'yourhandle',
                email: 'you@email.com',
                avatar: 'P',
                joined: '2026'
            };
            
            const channelData = JSON.parse(localStorage.getItem('channelData')) || {};
            
            const newAvatar = prompt('Enter new avatar (single letter or emoji):', userData.avatar || 'P');
            if (newAvatar !== null && newAvatar.trim() !== '') {
                userData.avatar = newAvatar.trim();
                channelData.avatar = newAvatar.trim();
                
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('channelData', JSON.stringify(channelData));
                
                loadProfileData();
                alert('✅ Avatar updated!');
            }
        });
    }
}

// =============================================
// SETUP DARK MODE
// =============================================

function setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    
    if (toggle) {
        // Check saved preference
        const darkMode = localStorage.getItem('darkMode') === 'true';
        toggle.checked = darkMode;
        applyDarkMode(darkMode);
        
        toggle.addEventListener('change', function() {
            const isDark = this.checked;
            localStorage.setItem('darkMode', isDark);
            applyDarkMode(isDark);
        });
    }
}

function applyDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.body.style.background = '#0f0f0f';
        document.body.style.color = '#f1f1f1';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.style.background = '#ffffff';
        document.body.style.color = '#0f0f0f';
    }
}

// =============================================
// SETUP NOTIFICATION TOGGLE
// =============================================

function setupNotifToggle() {
    const toggle = document.getElementById('notifToggle');
    
    if (toggle) {
        const notifEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
        toggle.checked = notifEnabled;
        
        toggle.addEventListener('change', function() {
            localStorage.setItem('notificationsEnabled', this.checked);
            alert(this.checked ? '✅ Notifications enabled!' : '🔕 Notifications disabled!');
        });
    }
}

// =============================================
// SETUP PRIVACY BUTTON
// =============================================

function setupPrivacyBtn() {
    const btn = document.getElementById('privacyBtn');
    
    if (btn) {
        btn.addEventListener('click', function() {
            alert('🔒 Privacy Settings\n\n' +
                  'Your data is stored locally in your browser.\n' +
                  'No data is sent to any server.\n\n' +
                  'You can clear all your data using the "Clear Data" button below.');
        });
    }
}

// =============================================
// SETUP CLEAR DATA
// =============================================

function setupClearData() {
    const btn = document.getElementById('clearDataBtn');
    
    if (btn) {
        btn.addEventListener('click', function() {
            if (confirm('⚠️ This will clear ALL your data including:\n\n' +
                       '• Watch History\n' +
                       '• Liked Videos\n' +
                       '• Subscriptions\n' +
                       '• Watch Later\n' +
                       '• Comments\n' +
                       '• Notifications\n\n' +
                       'Are you sure you want to continue?')) {
                
                if (confirm('⚠️ FINAL WARNING: This cannot be undone!\n\n' +
                           'All your data will be permanently deleted.')) {
                    
                    // Clear all app data
                    const keysToKeep = ['userData', 'channelData', 'darkMode'];
                    
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && !keysToKeep.includes(key)) {
                            localStorage.removeItem(key);
                        }
                    }
                    
                    alert('🗑️ All data cleared successfully!\nThe page will now reload.');
                    window.location.reload();
                }
            }
        });
    }
}

// =============================================
// SETUP LOGOUT
// =============================================

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to sign out?')) {
                // Clear user session data
                localStorage.removeItem('userData');
                localStorage.removeItem('channelData');
                
                // Reload to home
                window.location.href = 'index.html';
            }
        });
    }
}

// =============================================
// UPDATE NOTIFICATION BADGE
// =============================================

function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    const badge = document.getElementById('notifBadge');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.style.display = 'inline-block';
        } else {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
    }
}