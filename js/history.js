// =============================================
// HISTORY PAGE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    setupClearButton();
});

// =============================================
// LOAD HISTORY
// =============================================

function loadHistory() {
    const grid = document.getElementById('historyGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    // Get history from localStorage
    const history = getHistory();
    
    // Show/hide empty state
    if (emptyState) {
        if (history.length === 0) {
            emptyState.style.display = 'block';
            grid.innerHTML = '';
            return;
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Render history videos
    renderHistoryVideos(history);
}

// =============================================
// GET HISTORY
// =============================================

function getHistory() {
    const historyKey = 'watchHistory';
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    return history;
}

// =============================================
// RENDER HISTORY VIDEOS
// =============================================

function renderHistoryVideos(historyList) {
    const grid = document.getElementById('historyGrid');
    
    if (!grid) return;
    
    // If no history, show empty message
    if (historyList.length === 0) {
        grid.innerHTML = `
            <div class="no-history-msg">
                <p>Your watch history is empty.</p>
                <p style="color:#888;font-size:14px;">Watch some videos to see them here!</p>
            </div>
        `;
        return;
    }
    
    // Get full video data for each history item
    const historyVideos = historyList.map(historyItem => {
        // Find the video in our videos array
        const video = videos.find(v => v.id === parseInt(historyItem.id));
        if (video) {
            return video;
        }
        return null;
    }).filter(v => v !== null); // Remove any videos that weren't found
    
    if (historyVideos.length === 0) {
        grid.innerHTML = `
            <div class="no-history-msg">
                <p>No videos found in history.</p>
                <p style="color:#888;font-size:14px;">Some videos may have been removed.</p>
            </div>
        `;
        return;
    }
    
    // Render the videos
    grid.innerHTML = historyVideos.map(video => `
        <div class="video-card" data-id="${video.id}">
            <div class="thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <span class="duration">${video.duration || '10:30'}</span>
            </div>
            <div class="video-info">
                <div class="channel-avatar">${video.channelAvatar}</div>
                <div class="video-details">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="channel-name">${video.channel}</p>
                    <p class="video-meta">${video.views} views • ${video.uploaded}</p>
                </div>
            </div>
        </div>
    `).join('');
    
    // Click to go to watch page
    document.querySelectorAll('#historyGrid .video-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
}

// =============================================
// CLEAR HISTORY
// =============================================

function setupClearButton() {
    const clearBtn = document.getElementById('clearHistoryBtn');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            // Confirm before clearing
            if (confirm('Are you sure you want to clear your entire watch history?')) {
                localStorage.removeItem('watchHistory');
                loadHistory(); // Reload the page content
            }
        });
    }
}

// =============================================
// FORMAT DATE (optional helper)
// =============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';
    
    // If older than a week, show the date
    return date.toLocaleDateString();
}