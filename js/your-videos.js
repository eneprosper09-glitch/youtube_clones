// =============================================
// YOUR VIDEOS PAGE
// =============================================

let userVideos = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Your Videos page loaded');
    
    // Load user videos from localStorage
    loadUserVideos();
    
    // Setup event listeners
    setupUploadButton();
    setupRefreshButton();
});

// =============================================
// LOAD USER VIDEOS
// =============================================

function loadUserVideos() {
    const grid = document.getElementById('yourVideosGrid');
    const countDisplay = document.getElementById('videoCount');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    // Get user videos from localStorage
    userVideos = JSON.parse(localStorage.getItem('userVideos')) || [];
    
    console.log('User videos loaded:', userVideos.length);
    
    // Update count
    if (countDisplay) {
        countDisplay.textContent = userVideos.length + ' video' + (userVideos.length !== 1 ? 's' : '');
    }
    
    // Show/hide empty state
    if (emptyState) {
        if (userVideos.length === 0) {
            emptyState.style.display = 'block';
            grid.innerHTML = '';
            return;
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Render videos
    renderUserVideos(userVideos);
}

// =============================================
// RENDER USER VIDEOS
// =============================================

function renderUserVideos(videoList) {
    const grid = document.getElementById('yourVideosGrid');
    
    if (!grid) return;
    
    if (videoList.length === 0) {
        grid.innerHTML = `
            <div class="no-videos-msg">
                <p>No videos uploaded yet.</p>
                <p style="color:#888;font-size:14px;">Click "Upload Video" to add your first video!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = videoList.map((video, index) => `
        <div class="video-card" data-id="${video.id || index}">
            <div class="thumbnail">
                <img src="${video.thumbnail || 'https://via.placeholder.com/320x180/272727/888?text=No+Thumbnail'}" alt="${video.title}" loading="lazy">
                <span class="duration">${video.duration || '10:30'}</span>
                <div class="video-upload-badge">📤 Uploaded</div>
            </div>
            <div class="video-info">
                <div class="channel-avatar">${video.channelAvatar || 'Y'}</div>
                <div class="video-details">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="channel-name">${video.channel || 'Your Channel'}</p>
                    <p class="video-meta">${video.views || '0'} views • ${video.uploaded || 'Just now'}</p>
                </div>
            </div>
            <div class="video-actions-row">
                <button class="video-action-btn edit-btn" data-index="${index}">✏️ Edit</button>
                <button class="video-action-btn delete-btn" data-index="${index}">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
    
    // Click to go to watch page
    document.querySelectorAll('#yourVideosGrid .video-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons
            if (e.target.closest('.video-action-btn')) return;
            
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            editVideo(index);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            deleteVideo(index);
        });
    });
}

// =============================================
// UPLOAD VIDEO
// =============================================

function uploadVideo() {
    console.log('Upload video clicked');
    
    // Get channel data for the user
    const channelData = JSON.parse(localStorage.getItem('channelData')) || {
        name: 'Your Channel',
        avatar: 'Y'
    };
    
    // Show upload form via prompts
    const title = prompt('Enter video title:');
    if (title === null) return; // User cancelled
    
    if (title.trim() === '') {
        alert('Please enter a title.');
        return;
    }
    
    const description = prompt('Enter video description (optional):') || 'No description.';
    
    const thumbnail = prompt('Enter thumbnail URL (optional - leave blank for default):') || 'https://via.placeholder.com/320x180/272727/888?text=' + encodeURIComponent(title.substring(0, 10));
    
    const duration = prompt('Enter duration (e.g., 5:30):') || '5:00';
    
    const category = prompt('Enter category (Music, Gaming, News, Sports, Live, Mixes, Podcasts):') || 'Gaming';
    
    // Get YouTube URL
    const videoUrl = prompt('Enter YouTube video URL (e.g., https://youtu.be/XXXXX):');
    if (!videoUrl || videoUrl.trim() === '') {
        alert('Please enter a YouTube URL.');
        return;
    }
    
    // Load existing videos
    const userVideos = JSON.parse(localStorage.getItem('userVideos')) || [];
    
    // Create new video object
    const newVideo = {
        id: Date.now(),
        title: title.trim(),
        channel: channelData.name,
        channelAvatar: channelData.avatar || 'Y',
        description: description,
        thumbnail: thumbnail,
        duration: duration,
        category: category,
        views: '0',
        uploaded: 'Just now',
        videoUrl: videoUrl.trim(),
        uploadedAt: new Date().toISOString()
    };
    
    // Add to array
    userVideos.push(newVideo);
    
    // Save to localStorage
    localStorage.setItem('userVideos', JSON.stringify(userVideos));
    
    // Also add to main videos array for homepage
    // We'll add it to a special "user videos" section
    addToMainVideos(newVideo);
    
    // Reload the page
    loadUserVideos();
    
    alert('✅ Video "' + title.trim() + '" uploaded successfully!');
}

// =============================================
// ADD TO MAIN VIDEOS
// =============================================

function addToMainVideos(video) {
    // Get existing user videos from data.js
    const existingUserVideos = JSON.parse(localStorage.getItem('mainUserVideos')) || [];
    existingUserVideos.push(video);
    localStorage.setItem('mainUserVideos', JSON.stringify(existingUserVideos));
}

// =============================================
// EDIT VIDEO
// =============================================

function editVideo(index) {
    const userVideos = JSON.parse(localStorage.getItem('userVideos')) || [];
    const video = userVideos[index];
    
    if (!video) {
        alert('Video not found!');
        return;
    }
    
    console.log('Editing video:', video.title);
    
    const newTitle = prompt('Edit title:', video.title);
    if (newTitle === null) return;
    if (newTitle.trim() !== '') video.title = newTitle.trim();
    
    const newDescription = prompt('Edit description:', video.description);
    if (newDescription !== null) video.description = newDescription.trim() || 'No description.';
    
    const newThumbnail = prompt('Edit thumbnail URL:', video.thumbnail);
    if (newThumbnail !== null && newThumbnail.trim() !== '') {
        video.thumbnail = newThumbnail.trim();
    }
    
    const newDuration = prompt('Edit duration:', video.duration);
    if (newDuration !== null && newDuration.trim() !== '') {
        video.duration = newDuration.trim();
    }
    
    const newCategory = prompt('Edit category:', video.category);
    if (newCategory !== null && newCategory.trim() !== '') {
        video.category = newCategory.trim();
    }
    
    // Save changes
    userVideos[index] = video;
    localStorage.setItem('userVideos', JSON.stringify(userVideos));
    
    // Update main videos
    updateMainVideos(video);
    
    // Reload
    loadUserVideos();
    alert('✅ Video updated successfully!');
}

// =============================================
// UPDATE MAIN VIDEOS
// =============================================

function updateMainVideos(video) {
    const mainVideos = JSON.parse(localStorage.getItem('mainUserVideos')) || [];
    const index = mainVideos.findIndex(v => v.id === video.id);
    if (index !== -1) {
        mainVideos[index] = video;
        localStorage.setItem('mainUserVideos', JSON.stringify(mainVideos));
    }
}

// =============================================
// DELETE VIDEO
// =============================================

function deleteVideo(index) {
    const userVideos = JSON.parse(localStorage.getItem('userVideos')) || [];
    const video = userVideos[index];
    
    if (!video) {
        alert('Video not found!');
        return;
    }
    
    if (confirm('Delete video "' + video.title + '"?')) {
        // Remove from user videos
        userVideos.splice(index, 1);
        localStorage.setItem('userVideos', JSON.stringify(userVideos));
        
        // Remove from main videos
        removeFromMainVideos(video.id);
        
        // Reload
        loadUserVideos();
        alert('🗑️ Video deleted!');
    }
}

// =============================================
// REMOVE FROM MAIN VIDEOS
// =============================================

function removeFromMainVideos(videoId) {
    const mainVideos = JSON.parse(localStorage.getItem('mainUserVideos')) || [];
    const updated = mainVideos.filter(v => v.id !== videoId);
    localStorage.setItem('mainUserVideos', JSON.stringify(updated));
}

// =============================================
// SETUP UPLOAD BUTTON
// =============================================

function setupUploadButton() {
    const uploadBtn = document.getElementById('uploadVideoBtn');
    const uploadBtn2 = document.getElementById('uploadBtn');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            uploadVideo();
        });
    }
    
    if (uploadBtn2) {
        uploadBtn2.addEventListener('click', function() {
            uploadVideo();
        });
    }
}

// =============================================
// SETUP REFRESH BUTTON
// =============================================

function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadUserVideos();
            alert('🔄 Videos refreshed!');
        });
    }
}