// =============================================
// NOTIFICATIONS
// =============================================

let notifications = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Notifications page loaded');
    loadNotifications();
    setupNotificationTabs();
    setupMarkAllRead();
    setupClearAll();
    updateNotificationBadge();
});

// =============================================
// LOAD NOTIFICATIONS
// =============================================

function loadNotifications() {
    const list = document.getElementById('notificationsList');
    const countDisplay = document.getElementById('notificationCount');
    const emptyState = document.getElementById('emptyState');
    
    if (!list) {
        console.log('Notifications list not found!');
        return;
    }
    
    // Get notifications from localStorage
    notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    console.log('Notifications loaded:', notifications.length);
    
    // Update count
    if (countDisplay) {
        const unreadCount = notifications.filter(n => !n.read).length;
        countDisplay.textContent = notifications.length + ' notification' + (notifications.length !== 1 ? 's' : '');
    }
    
    // Update badge in header
    updateNotificationBadge();
    
    // Show/hide empty state
    if (emptyState) {
        if (notifications.length === 0) {
            emptyState.style.display = 'block';
            list.innerHTML = '';
            return;
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Filter notifications
    let filtered = notifications;
    if (currentFilter !== 'all') {
        filtered = notifications.filter(n => n.type === currentFilter);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Render notifications
    renderNotifications(filtered);
}

// =============================================
// RENDER NOTIFICATIONS
// =============================================

function renderNotifications(notifList) {
    const list = document.getElementById('notificationsList');
    
    if (!list) return;
    
    if (notifList.length === 0) {
        list.innerHTML = `
            <div class="no-notifications-msg">
                <p>No ${currentFilter !== 'all' ? currentFilter : ''} notifications.</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = notifList.map((notif, index) => `
        <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
            <div class="notification-icon">${getNotificationIcon(notif.type)}</div>
            <div class="notification-content">
                <div class="notification-message">
                    <strong>${notif.username || 'Someone'}</strong>
                    ${notif.message}
                    ${notif.videoTitle ? `: "${notif.videoTitle}"` : ''}
                </div>
                <div class="notification-time">${formatTimeAgo(notif.timestamp)}</div>
            </div>
            <div class="notification-actions">
                <button class="notification-remove-btn" data-id="${notif.id}">✕</button>
            </div>
        </div>
    `).join('');
    
    // Remove notification buttons
    document.querySelectorAll('.notification-remove-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            removeNotification(id);
        });
    });
    
    // Click on notification to mark as read
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            markNotificationRead(id);
        });
    });
}

// =============================================
// GET NOTIFICATION ICON
// =============================================

function getNotificationIcon(type) {
    const icons = {
        like: '👍',
        comment: '💬',
        subscribe: '🔔',
        upload: '📤',
        default: '📢'
    };
    return icons[type] || icons.default;
}

// =============================================
// FORMAT TIME AGO
// =============================================

function formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';
    if (diffWeeks < 4) return diffWeeks + 'w ago';
    if (diffMonths < 12) return diffMonths + 'mo ago';
    return diffYears + 'y ago';
}

// =============================================
// MARK NOTIFICATION AS READ
// =============================================

function markNotificationRead(id) {
    const notif = notifications.find(n => n.id === id);
    if (!notif) return;
    
    notif.read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications();
    updateNotificationBadge();
}

// =============================================
// REMOVE NOTIFICATION
// =============================================

function removeNotification(id) {
    if (confirm('Remove this notification?')) {
        notifications = notifications.filter(n => n.id !== id);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        loadNotifications();
        updateNotificationBadge();
    }
}

// =============================================
// MARK ALL AS READ
// =============================================

function setupMarkAllRead() {
    const markBtn = document.getElementById('markAllBtn');
    
    if (markBtn) {
        markBtn.addEventListener('click', function() {
            const unreadCount = notifications.filter(n => !n.read).length;
            
            if (unreadCount === 0) {
                alert('All notifications are already read!');
                return;
            }
            
            notifications.forEach(n => n.read = true);
            localStorage.setItem('notifications', JSON.stringify(notifications));
            loadNotifications();
            updateNotificationBadge();
            alert('✅ All notifications marked as read!');
        });
    }
}

// =============================================
// CLEAR ALL NOTIFICATIONS
// =============================================

function setupClearAll() {
    const clearBtn = document.getElementById('clearAllBtn');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (notifications.length === 0) {
                alert('No notifications to clear!');
                return;
            }
            
            if (confirm('Clear all notifications?')) {
                notifications = [];
                localStorage.setItem('notifications', JSON.stringify(notifications));
                loadNotifications();
                updateNotificationBadge();
                alert('🗑️ All notifications cleared!');
            }
        });
    }
}

// =============================================
// SETUP NOTIFICATION TABS
// =============================================

function setupNotificationTabs() {
    const tabs = document.querySelectorAll('.notification-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.type;
            loadNotifications();
        });
    });
}

// =============================================
// UPDATE NOTIFICATION BADGE IN HEADER
// =============================================

function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Find the notification badge in header
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

// =============================================
// ADD NOTIFICATION (called from other pages)
// =============================================

function addNotification(type, username, message, videoTitle, videoId) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    const newNotification = {
        id: Date.now(),
        type: type, // 'like', 'comment', 'subscribe', 'upload'
        username: username,
        message: message,
        videoTitle: videoTitle || null,
        videoId: videoId || null,
        read: false,
        timestamp: new Date().toISOString()
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Update badge
    updateNotificationBadge();
    
    console.log('Notification added:', newNotification);
}