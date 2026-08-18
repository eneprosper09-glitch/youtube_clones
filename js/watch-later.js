// =============================================
// WATCH LATER PAGE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    loadWatchLater();
    setupClearButton();
});

// =============================================
// LOAD WATCH LATER
// =============================================

function loadWatchLater() {
    const grid = document.getElementById('watchLaterGrid');
    const countDisplay = document.getElementById('watchLaterCount');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    // Get watch later from localStorage
    let watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
    
    // Update count
    if (countDisplay) {
        countDisplay.textContent = watchLater.length + ' video' + (watchLater.length !== 1 ? 's' : '') + ' saved';
    }
    
    // Show/hide empty state
    if (emptyState) {
        if (watchLater.length === 0) {
            emptyState.style.display = 'block';
            grid.innerHTML = '';
            return;
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Render videos
    renderWatchLaterVideos(watchLater);
}

// =============================================
// RENDER WATCH LATER VIDEOS
// =============================================

function renderWatchLaterVideos(watchList) {
    const grid = document.getElementById('watchLaterGrid');
    
    if (!grid) return;
    
    grid.innerHTML = watchList.map((video, index) => `
        <div class="video-card" data-id="${video.id}">
            <div class="thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <span class="duration">${video.duration || '10:30'}</span>
                <div class="watch-later-badge">⏰</div>
            </div>
            <div class="video-info">
                <div class="channel-avatar">${video.channelAvatar || 'C'}</div>
                <div class="video-details">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="channel-name">${video.channel}</p>
                    <p class="video-meta">Added ${new Date(video.addedAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="video-actions-row">
                <button class="video-action-btn remove-btn" data-index="${index}">❌ Remove</button>
            </div>
        </div>
    `).join('');
    
    // Click to go to watch page
    document.querySelectorAll('#watchLaterGrid .video-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.remove-btn')) return;
            
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            removeFromWatchLater(index);
        });
    });
}

// =============================================
// REMOVE FROM WATCH LATER
// =============================================

function removeFromWatchLater(index) {
    let watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
    const video = watchLater[index];
    
    if (!video) return;
    
    if (confirm('Remove "' + video.title + '" from Watch Later?')) {
        watchLater.splice(index, 1);
        localStorage.setItem('watchLater', JSON.stringify(watchLater));
        loadWatchLater();
        alert('❌ Removed from Watch Later!');
    }
}

// =============================================
// CLEAR WATCH LATER
// =============================================

function setupClearButton() {
    const clearBtn = document.getElementById('clearWatchLaterBtn');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            let watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
            
            if (watchLater.length === 0) {
                alert('Your Watch Later list is already empty!');
                return;
            }
            
            if (confirm('Clear all videos from Watch Later?')) {
                localStorage.removeItem('watchLater');
                loadWatchLater();
                alert('🗑️ Watch Later cleared!');
            }
        });
    }
}