// =============================================
// SUBSCRIPTIONS PAGE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Make sure videos array exists
    if (typeof videos !== 'undefined') {
        loadSubscriptions();
    }
});

// =============================================
// LOAD SUBSCRIPTIONS
// =============================================

function loadSubscriptions() {
    const grid = document.getElementById('subscriptionsGrid');
    const countDisplay = document.getElementById('subscriptionCount');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    // Get all subscribed channels from localStorage
    const subscribedChannels = getSubscribedChannels();
    
    // Filter videos to only show subscribed channels
    const subscribedVideos = videos.filter(video => 
        subscribedChannels.includes(video.channel)
    );
    
    // Update count
    if (countDisplay) {
        if (subscribedChannels.length === 0) {
            countDisplay.textContent = 'You are not subscribed to any channels yet.';
        } else {
            countDisplay.textContent = `Showing videos from ${subscribedChannels.length} subscribed channel${subscribedChannels.length > 1 ? 's' : ''}`;
        }
    }
    
    // Show/hide empty state
    if (emptyState) {
        if (subscribedVideos.length === 0) {
            emptyState.style.display = 'block';
            grid.innerHTML = '';
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Render videos
    if (subscribedVideos.length > 0) {
        renderSubscriptionVideos(subscribedVideos);
    } else if (subscribedChannels.length > 0) {
        // Subscribed but no videos from those channels yet
        grid.innerHTML = `
            <div class="no-videos-msg">
                <p>No videos from your subscribed channels yet.</p>
                <p style="color:#888;font-size:14px;">Check back later!</p>
            </div>
        `;
    }
}

// =============================================
// GET SUBSCRIBED CHANNELS
// =============================================

function getSubscribedChannels() {
    const subscribedChannels = [];
    
    // Loop through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Check if it's a subscription key
        if (key && key.startsWith('subscribed_')) {
            const isSubscribed = localStorage.getItem(key) === 'true';
            
            if (isSubscribed) {
                // Extract video ID from key
                const videoId = key.replace('subscribed_', '');
                
                // Find the video to get channel name
                const video = videos.find(v => v.id === parseInt(videoId));
                
                if (video && !subscribedChannels.includes(video.channel)) {
                    subscribedChannels.push(video.channel);
                }
            }
        }
    }
    
    return subscribedChannels;
}

// =============================================
// RENDER SUBSCRIPTION VIDEOS
// =============================================

function renderSubscriptionVideos(videoList) {
    const grid = document.getElementById('subscriptionsGrid');
    
    if (!grid) return;
    
    grid.innerHTML = videoList.map(video => `
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
    document.querySelectorAll('#subscriptionsGrid .video-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
}