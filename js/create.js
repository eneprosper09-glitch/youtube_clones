// =============================================
// CREATE PAGE - UPLOAD VIDEO
// =============================================

let thumbnailData = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Create page loaded');
    setupThumbnailUpload();
    setupSubmitForm();
    setupCancelButton();
    updateNotificationBadge();
});

// =============================================
// SETUP THUMBNAIL UPLOAD
// =============================================

function setupThumbnailUpload() {
    const area = document.getElementById('thumbnailArea');
    const input = document.getElementById('thumbnailInput');
    const preview = document.getElementById('thumbnailPreview');
    
    if (area && input) {
        // Click to upload
        area.addEventListener('click', function() {
            input.click();
        });
        
        // Handle file selection
        input.addEventListener('change', function(e) {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    thumbnailData = event.target.result;
                    
                    // Update preview
                    preview.innerHTML = `
                        <img src="${thumbnailData}" alt="Thumbnail" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
                    `;
                    preview.style.background = 'transparent';
                    preview.style.border = 'none';
                    preview.style.padding = '0';
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Drag and drop support
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#3ea6ff';
            this.style.background = '#1a1a3e';
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#303030';
            this.style.background = 'transparent';
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#303030';
            this.style.background = 'transparent';
            
            const file = e.dataTransfer.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    thumbnailData = event.target.result;
                    preview.innerHTML = `
                        <img src="${thumbnailData}" alt="Thumbnail" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
                    `;
                    preview.style.background = 'transparent';
                    preview.style.border = 'none';
                    preview.style.padding = '0';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// =============================================
// SETUP SUBMIT FORM
// =============================================

function setupSubmitForm() {
    const submitBtn = document.getElementById('submitBtn');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            uploadVideo();
        });
    }
}

// =============================================
// UPLOAD VIDEO
// =============================================

function uploadVideo() {
    // Get form values
    const title = document.getElementById('titleInput').value.trim();
    const description = document.getElementById('descriptionInput').value.trim();
    const videoUrl = document.getElementById('videoUrlInput').value.trim();
    const category = document.getElementById('categorySelect').value;
    const duration = document.getElementById('durationInput').value.trim() || '5:00';
    const tags = document.getElementById('tagsInput').value.trim();
    
    // Validate
    if (!title) {
        alert('⚠️ Please enter a title.');
        document.getElementById('titleInput').focus();
        return;
    }
    
    if (!videoUrl) {
        alert('⚠️ Please enter a YouTube video URL.');
        document.getElementById('videoUrlInput').focus();
        return;
    }
    
    // Validate YouTube URL
    const youtubePattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = videoUrl.match(youtubePattern);
    if (!match) {
        alert('⚠️ Please enter a valid YouTube URL.\n\nExample: https://youtu.be/XXXXXXXXXXX');
        document.getElementById('videoUrlInput').focus();
        return;
    }
    
    const videoId = match[1];
    
    // Get channel data
    const channelData = JSON.parse(localStorage.getItem('channelData')) || {
        name: 'Your Channel',
        avatar: 'Y'
    };
    
    // Create thumbnail URL
    let thumbnail = thumbnailData || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    
    // Create video object
    const newVideo = {
        id: Date.now(),
        title: title,
        channel: channelData.name,
        channelAvatar: channelData.avatar || 'Y',
        description: description || 'No description.',
        thumbnail: thumbnail,
        duration: duration,
        category: category,
        views: '0',
        uploaded: 'Just now',
        videoUrl: videoUrl,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        uploadedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    let userVideos = JSON.parse(localStorage.getItem('userVideos')) || [];
    userVideos.unshift(newVideo);
    localStorage.setItem('userVideos', JSON.stringify(userVideos));
    
    // Also add to main videos array for homepage
    let mainVideos = JSON.parse(localStorage.getItem('mainUserVideos')) || [];
    mainVideos.unshift(newVideo);
    localStorage.setItem('mainUserVideos', JSON.stringify(mainVideos));
    
    // Add notification for upload
    addNotification(
        'upload',
        channelData.name || 'You',
        'uploaded a new video: "' + title + '"',
        title,
        newVideo.id
    );
    
    alert('✅ Video uploaded successfully!\n\n"' + title + '" is now live!');
    
    // Reset form
    resetForm();
    
    // Redirect to your videos page after a moment
    setTimeout(function() {
        window.location.href = 'your-videos.html';
    }, 1500);
}

// =============================================
// RESET FORM
// =============================================

function resetForm() {
    document.getElementById('titleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('videoUrlInput').value = '';
    document.getElementById('durationInput').value = '';
    document.getElementById('tagsInput').value = '';
    document.getElementById('categorySelect').value = 'Music';
    
    // Reset thumbnail
    thumbnailData = null;
    const preview = document.getElementById('thumbnailPreview');
    preview.innerHTML = `
        <span class="upload-icon">🖼️</span>
        <p>Click to upload thumbnail</p>
        <small>JPG, PNG, or GIF • Max 2MB</small>
    `;
    preview.style.background = '#1a1a1a';
    preview.style.border = '2px dashed #303030';
    preview.style.padding = '40px 20px';
}

// =============================================
// SETUP CANCEL BUTTON
// =============================================

function setupCancelButton() {
    const cancelBtn = document.getElementById('cancelBtn');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel?\nYour progress will be lost.')) {
                resetForm();
                window.location.href = 'index.html';
            }
        });
    }
}

// =============================================
// ADD NOTIFICATION
// =============================================

function addNotification(type, username, message, videoTitle, videoId) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    const newNotification = {
        id: Date.now(),
        type: type || 'upload',
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