// =============================================
// LIKED VIDEOS PAGE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Make sure videos array exists
    if (typeof videos !== 'undefined') {
        loadLikedVideos();
    }
});

// =============================================
// LOAD LIKED VIDEOS
// =============================================

function loadLikedVideos() {
    const grid = document.getElementById('likedGrid');
    const countDisplay = document.getElementById('likedCount');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    // Get all liked video IDs from localStorage
    const likedIds = getLikedVideoIds();
    
    // Update count
    if (countDisplay) {
        if (likedIds.length === 0) {
            countDisplay.textContent = '0 liked videos';
        } else {
            countDisplay.textContent = `${likedIds.length} liked video${likedIds.length > 1 ? 's' : ''}`;
        }
    }
    
    // Show/hide empty state
    if (emptyState) {
        if (likedIds.length === 0) {
            emptyState.style.display = 'block';
            grid.innerHTML = '';
            return;
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Get full video data for each liked video
    const likedVideos = likedIds.map(id => {
        const video = videos.find(v => v.id === parseInt(id));
        return video || null;
    }).filter(v => v !== null); // Remove any videos that weren't found
    
    if (likedVideos.length === 0) {
        grid.innerHTML = `
            <div class="no-liked-msg">
                <p>No liked videos found.</p>
                <p style="color:#888;font-size:14px;">Some videos may have been removed.</p>
            </div>
        `;
        return;
    }
    
    // Render the videos
    renderLikedVideos(likedVideos);
}

// =============================================
// GET LIKED VIDEO IDS
// =============================================

function getLikedVideoIds() {
    const likedIds = [];
    
    // Loop through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Check if it's a like key
        if (key && key.startsWith('liked_') && key !== 'liked_count') {
            const isLiked = localStorage.getItem(key) === 'true';
            
            if (isLiked) {
                // Extract video ID from key (remove 'liked_' prefix)
                const videoId = key.replace('liked_', '');
                likedIds.push(videoId);
            }
        }
    }
    
    return likedIds;
}

// =============================================
// RENDER LIKED VIDEOS
// =============================================

function renderLikedVideos(videoList) {
    const grid = document.getElementById('likedGrid');
    
    if (!grid) return;
    
    grid.innerHTML = videoList.map(video => `
        <div class="video-card" data-id="${video.id}">
            <div class="thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <span class="duration">${video.duration || '10:30'}</span>
                <div class="liked-badge">❤️</div>
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
    document.querySelectorAll('#likedGrid .video-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
}