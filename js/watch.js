// =============================================
// WATCH PAGE - LOAD VIDEO
// =============================================

// Get the video ID from localStorage
const videoId = localStorage.getItem('selectedVideoId');

// Find the video in our data
let selectedVideo = null;
let allVideos = [];

// Wait for data to load
document.addEventListener('DOMContentLoaded', function() {
    // Make sure videos array exists
    if (typeof videos !== 'undefined') {
        allVideos = videos;
        
        // Find the selected video
        if (videoId) {
            selectedVideo = videos.find(v => v.id === parseInt(videoId));
        }
        
        // If no video found, use the first one
        if (!selectedVideo && videos.length > 0) {
            selectedVideo = videos[0];
        }
        
        // Load the video
        if (selectedVideo) {
            loadVideo(selectedVideo);
        } else {
            document.getElementById('watchVideoTitle').textContent = 'Video not found';
        }
        
        // Load suggested videos
        loadSuggestedVideos();
        
        // Setup buttons
        setupButtons();
    }
});

// =============================================
// LOAD VIDEO
// =============================================

function loadVideo(video) {
    // Get YouTube video ID from the URL
    let youtubeId = '';
    
    if (video.videoUrl) {
        // Extract ID from YouTube URL
        const url = video.videoUrl;
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([^&]+)/,
            /(?:youtu\.be\/)([^?]+)/,
            /(?:youtube\.com\/shorts\/)([^?]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                youtubeId = match[1];
                break;
            }
        }
    }
    
    // If no YouTube ID found, use the thumbnail ID as fallback
    if (!youtubeId && video.thumbnail) {
        const match = video.thumbnail.match(/\/vi\/([^\/]+)\//);
        if (match) {
            youtubeId = match[1];
        }
    }
    
    // Update YouTube iframe
    const iframe = document.getElementById('youtubeIframe');
    if (iframe && youtubeId) {
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    } else if (iframe) {
        iframe.src = '';
        document.getElementById('youtubePlayer').innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#000;color:#fff;padding:20px;text-align:center;font-size:18px;">
                ⚠️ Video not available<br>
                <span style="font-size:14px;color:#888;">No YouTube ID found for this video</span>
            </div>
        `;
    }
    
    // Update video info
    document.getElementById('watchVideoTitle').textContent = video.title;
    document.getElementById('watchViews').textContent = video.views + ' views';
    document.getElementById('watchUploaded').textContent = video.uploaded;
    document.getElementById('watchChannelName').textContent = video.channel;
    document.getElementById('watchChannelAvatar').textContent = video.channelAvatar;
    document.getElementById('watchDescription').textContent = video.description || 'No description available.';
    
    // Set channel subscribers (random number for demo)
    const subs = Math.floor(Math.random() * 1000000) + 1000;
    document.getElementById('watchSubscribers').textContent = subs.toLocaleString() + ' subscribers';
    
    // Load like/dislike counts from localStorage
    updateLikeDislikeCounts(video.id);
    
    // Check if already liked/disliked/subscribed
    checkButtonStates(video.id);
    
    // Save to history
    saveToHistory(video);
    
    // Load comments
    loadComments(video.id);
}

// =============================================
// UPDATE LIKE/DISLIKE COUNTS
// =============================================

function updateLikeDislikeCounts(videoId) {
    const likeKey = `liked_${videoId}`;
    const dislikeKey = `disliked_${videoId}`;
    
    let likeCount = parseInt(localStorage.getItem(`${likeKey}_count`)) || 0;
    let dislikeCount = parseInt(localStorage.getItem(`${dislikeKey}_count`)) || 0;
    
    if (localStorage.getItem(likeKey) === 'true' && likeCount === 0) {
        likeCount = 1;
        localStorage.setItem(`${likeKey}_count`, likeCount);
    }
    
    if (localStorage.getItem(dislikeKey) === 'true' && dislikeCount === 0) {
        dislikeCount = 1;
        localStorage.setItem(`${dislikeKey}_count`, dislikeCount);
    }
    
    document.getElementById('likeCount').textContent = likeCount;
    document.getElementById('dislikeCount').textContent = dislikeCount;
}

// =============================================
// SETUP BUTTONS
// =============================================

function setupButtons() {
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const watchLaterBtn = document.getElementById('watchLaterBtn');
    
    // ==========================================
    // LIKE BUTTON
    // ==========================================
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            if (!selectedVideo) return;
            
            const videoId = selectedVideo.id;
            const likeKey = `liked_${videoId}`;
            const dislikeKey = `disliked_${videoId}`;
            const likeCountKey = `${likeKey}_count`;
            const dislikeCountKey = `${dislikeKey}_count`;
            
            const isLiked = localStorage.getItem(likeKey) === 'true';
            const isDisliked = localStorage.getItem(dislikeKey) === 'true';
            
            let likeCount = parseInt(localStorage.getItem(likeCountKey)) || 0;
            let dislikeCount = parseInt(localStorage.getItem(dislikeCountKey)) || 0;
            
            if (isLiked) {
                // UNLIKE
                localStorage.removeItem(likeKey);
                likeCount = Math.max(0, likeCount - 1);
                localStorage.setItem(likeCountKey, likeCount);
                this.classList.remove('active');
            } else {
                // LIKE
                localStorage.setItem(likeKey, 'true');
                likeCount = likeCount + 1;
                localStorage.setItem(likeCountKey, likeCount);
                this.classList.add('active');
                
                // SEND NOTIFICATION FOR LIKE
                sendNotification('like', selectedVideo);
                
                // If disliked, remove dislike
                if (isDisliked) {
                    localStorage.removeItem(dislikeKey);
                    dislikeCount = Math.max(0, dislikeCount - 1);
                    localStorage.setItem(dislikeCountKey, dislikeCount);
                    document.getElementById('dislikeBtn').classList.remove('active');
                }
            }
            
            document.getElementById('likeCount').textContent = likeCount;
            document.getElementById('dislikeCount').textContent = dislikeCount;
        });
    }
    
    // ==========================================
    // DISLIKE BUTTON
    // ==========================================
    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', function() {
            if (!selectedVideo) return;
            
            const videoId = selectedVideo.id;
            const likeKey = `liked_${videoId}`;
            const dislikeKey = `disliked_${videoId}`;
            const likeCountKey = `${likeKey}_count`;
            const dislikeCountKey = `${dislikeKey}_count`;
            
            const isLiked = localStorage.getItem(likeKey) === 'true';
            const isDisliked = localStorage.getItem(dislikeKey) === 'true';
            
            let likeCount = parseInt(localStorage.getItem(likeCountKey)) || 0;
            let dislikeCount = parseInt(localStorage.getItem(dislikeCountKey)) || 0;
            
            if (isDisliked) {
                // UNDISLIKE
                localStorage.removeItem(dislikeKey);
                dislikeCount = Math.max(0, dislikeCount - 1);
                localStorage.setItem(dislikeCountKey, dislikeCount);
                this.classList.remove('active');
            } else {
                // DISLIKE
                localStorage.setItem(dislikeKey, 'true');
                dislikeCount = dislikeCount + 1;
                localStorage.setItem(dislikeCountKey, dislikeCount);
                this.classList.add('active');
                
                // SEND NOTIFICATION FOR DISLIKE
                sendNotification('dislike', selectedVideo);
                
                // If liked, remove like
                if (isLiked) {
                    localStorage.removeItem(likeKey);
                    likeCount = Math.max(0, likeCount - 1);
                    localStorage.setItem(likeCountKey, likeCount);
                    document.getElementById('likeBtn').classList.remove('active');
                }
            }
            
            document.getElementById('likeCount').textContent = likeCount;
            document.getElementById('dislikeCount').textContent = dislikeCount;
        });
    }
    
    // ==========================================
    // SUBSCRIBE BUTTON
    // ==========================================
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            if (!selectedVideo) return;
            
            const subscribeKey = `subscribed_${selectedVideo.id}`;
            const isSubscribed = localStorage.getItem(subscribeKey) === 'true';
            
            if (isSubscribed) {
                // UNSUBSCRIBE
                localStorage.removeItem(subscribeKey);
                this.textContent = '🔔 Subscribe';
                this.classList.remove('subscribed');
            } else {
                // SUBSCRIBE
                localStorage.setItem(subscribeKey, 'true');
                this.textContent = '✅ Subscribed';
                this.classList.add('subscribed');
                
                // SEND NOTIFICATION FOR SUBSCRIBE
                sendNotification('subscribe', selectedVideo);
            }
        });
    }
    
    // ==========================================
    // WATCH LATER BUTTON
    // ==========================================
    if (watchLaterBtn) {
        watchLaterBtn.addEventListener('click', function() {
            if (!selectedVideo) return;
            
            const watchLaterKey = 'watchLater';
            let watchLater = JSON.parse(localStorage.getItem(watchLaterKey)) || [];
            
            // Check if already in watch later
            const exists = watchLater.some(item => item.id === selectedVideo.id);
            
            if (exists) {
                // Remove from watch later
                watchLater = watchLater.filter(item => item.id !== selectedVideo.id);
                this.textContent = '⏰ Watch Later';
                this.classList.remove('added');
                alert('⏰ Removed from Watch Later!');
            } else {
                // Add to watch later
                watchLater.push({
                    id: selectedVideo.id,
                    title: selectedVideo.title,
                    channel: selectedVideo.channel,
                    channelAvatar: selectedVideo.channelAvatar,
                    thumbnail: selectedVideo.thumbnail,
                    duration: selectedVideo.duration || '10:30',
                    addedAt: new Date().toISOString()
                });
                this.textContent = '✅ Added';
                this.classList.add('added');
                alert('✅ Added to Watch Later!');
            }
            
            localStorage.setItem(watchLaterKey, JSON.stringify(watchLater));
        });
    }
}

// =============================================
// SEND NOTIFICATION
// =============================================

function sendNotification(type, video) {
    const channelData = JSON.parse(localStorage.getItem('channelData')) || { name: 'You' };
    
    let message = '';
    let videoTitle = video ? video.title : null;
    let videoId = video ? video.id : null;
    
    switch(type) {
        case 'like':
            message = 'liked your video';
            break;
        case 'dislike':
            message = 'disliked your video';
            break;
        case 'subscribe':
            message = 'subscribed to your channel';
            videoTitle = null;
            videoId = null;
            break;
        case 'comment':
            message = 'commented on your video';
            break;
        default:
            message = 'interacted with your content';
    }
    
    // Get existing notifications
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // Create new notification
    const newNotification = {
        id: Date.now(),
        type: type,
        username: channelData.name || 'Someone',
        message: message,
        videoTitle: videoTitle,
        videoId: videoId,
        read: false,
        timestamp: new Date().toISOString()
    };
    
    // Add to beginning of array (newest first)
    notifications.unshift(newNotification);
    
    // Save back to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    console.log('✅ Notification added:', newNotification);
    
    // Update badge if function exists
    if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge();
    }
}

// =============================================
// CHECK BUTTON STATES
// =============================================

function checkButtonStates(videoId) {
    const likeKey = `liked_${videoId}`;
    const dislikeKey = `disliked_${videoId}`;
    const subscribeKey = `subscribed_${videoId}`;
    const watchLaterKey = 'watchLater';
    
    // Like
    if (localStorage.getItem(likeKey) === 'true') {
        document.getElementById('likeBtn').classList.add('active');
    }
    
    // Dislike
    if (localStorage.getItem(dislikeKey) === 'true') {
        document.getElementById('dislikeBtn').classList.add('active');
    }
    
    // Subscribe
    if (localStorage.getItem(subscribeKey) === 'true') {
        const subBtn = document.getElementById('subscribeBtn');
        subBtn.textContent = '✅ Subscribed';
        subBtn.classList.add('subscribed');
    }
    
    // Watch Later
    let watchLater = JSON.parse(localStorage.getItem(watchLaterKey)) || [];
    const exists = watchLater.some(item => item.id === videoId);
    const watchLaterBtn = document.getElementById('watchLaterBtn');
    if (watchLaterBtn) {
        if (exists) {
            watchLaterBtn.textContent = '✅ Added';
            watchLaterBtn.classList.add('added');
        } else {
            watchLaterBtn.textContent = '⏰ Watch Later';
            watchLaterBtn.classList.remove('added');
        }
    }
}

// =============================================
// SUGGESTED VIDEOS
// =============================================

function loadSuggestedVideos() {
    const grid = document.getElementById('suggestedGrid');
    
    if (!grid) return;
    
    let suggested = videos.filter(v => v.id !== parseInt(videoId));
    
    if (suggested.length > 5) {
        suggested = suggested.slice(0, 5);
    }
    
    if (suggested.length === 0) {
        grid.innerHTML = '<p style="color:#888;">No more videos to suggest.</p>';
        return;
    }
    
    grid.innerHTML = suggested.map(video => `
        <div class="suggested-card" data-id="${video.id}">
            <div class="suggested-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
            </div>
            <div class="suggested-info">
                <h4>${video.title}</h4>
                <p>${video.channel}</p>
                <p>${video.views} views</p>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.suggested-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.reload();
        });
    });
}

// =============================================
// HISTORY
// =============================================

function saveToHistory(video) {
    const historyKey = 'watchHistory';
    let history = JSON.parse(localStorage.getItem(historyKey)) || [];
    
    history = history.filter(item => item.id !== video.id);
    
    history.unshift({
        id: video.id,
        title: video.title,
        channel: video.channel,
        thumbnail: video.thumbnail,
        watchedAt: new Date().toISOString()
    });
    
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
}

// =============================================
// COMMENTS SECTION
// =============================================

function loadComments(videoId) {
    const commentsList = document.getElementById('commentsList');
    const commentCount = document.getElementById('commentCount');
    
    if (!commentsList) return;
    
    const comments = getComments(videoId);
    
    if (commentCount) {
        commentCount.textContent = comments.length + ' Comment' + (comments.length !== 1 ? 's' : '');
    }
    
    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="no-comments">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        `;
        setupCommentInputListeners(videoId);
        return;
    }
    
    const sortedComments = [...comments].reverse();
    
    commentsList.innerHTML = sortedComments.map(comment => {
        const avatar = comment.userAvatar || 'U';
        const username = comment.username || 'Unknown User';
        const text = comment.text || '';
        const likes = comment.likes || 0;
        const timeAgo = comment.timeAgo || 'Just now';
        const replies = comment.replies || [];
        
        return `
            <div class="comment-item" data-id="${comment.id}">
                <div class="comment-avatar">${avatar}</div>
                <div class="comment-content">
                    <div class="comment-user">
                        <strong>${username}</strong>
                        <span>${timeAgo}</span>
                    </div>
                    <p>${text}</p>
                    <div class="comment-actions-row">
                        <button class="comment-like-btn" data-id="${comment.id}">
                            👍 <span class="comment-like-count">${likes}</span>
                        </button>
                        <button class="comment-reply-btn" data-id="${comment.id}">Reply</button>
                        <button class="comment-delete-btn" data-id="${comment.id}">🗑️</button>
                    </div>
                    <div class="comment-replies" id="replies-${comment.id}">
                        ${replies.map(reply => `
                            <div class="comment-item reply-item" data-id="${reply.id}">
                                <div class="comment-avatar">${reply.userAvatar || 'U'}</div>
                                <div class="comment-content">
                                    <div class="comment-user">
                                        <strong>${reply.username || 'Unknown'}</strong>
                                        <span>${reply.timeAgo || 'Just now'}</span>
                                    </div>
                                    <p>${reply.text || ''}</p>
                                    <div class="comment-actions-row">
                                        <button class="comment-delete-btn" data-id="${reply.id}" data-parent="${comment.id}">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="reply-input-wrapper" style="display:none;" id="replyInput-${comment.id}">
                        <input type="text" class="reply-input" placeholder="Write a reply..." />
                        <button class="reply-submit-btn" data-parent="${comment.id}">Reply</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    setupAllCommentEventListeners(videoId);
}

function getComments(videoId) {
    const key = 'comments_' + videoId;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveComments(videoId, comments) {
    const key = 'comments_' + videoId;
    localStorage.setItem(key, JSON.stringify(comments));
}

function addComment(videoId, text) {
    if (!text || text.trim() === '') {
        alert('Please enter a comment.');
        return;
    }
    
    const comments = getComments(videoId);
    const channelData = JSON.parse(localStorage.getItem('channelData')) || { name: 'You', avatar: 'Y' };
    
    const newComment = {
        id: Date.now(),
        username: channelData.name || 'You',
        userAvatar: channelData.avatar || 'Y',
        text: text.trim(),
        timeAgo: 'Just now',
        likes: 0,
        replies: [],
        timestamp: new Date().toISOString()
    };
    
    comments.push(newComment);
    saveComments(videoId, comments);
    loadComments(videoId);
    
    // SEND NOTIFICATION FOR COMMENT
    if (selectedVideo) {
        sendNotification('comment', selectedVideo);
    }
    
    const input = document.getElementById('commentInput');
    if (input) input.value = '';
}

function deleteComment(videoId, commentId, parentId) {
    const comments = getComments(videoId);
    
    if (parentId) {
        const parentComment = comments.find(c => c.id === parentId);
        if (parentComment && parentComment.replies) {
            parentComment.replies = parentComment.replies.filter(r => r.id !== commentId);
            saveComments(videoId, comments);
            loadComments(videoId);
        }
    } else {
        const updatedComments = comments.filter(c => c.id !== commentId);
        saveComments(videoId, updatedComments);
        loadComments(videoId);
    }
}

function likeComment(videoId, commentId) {
    const comments = getComments(videoId);
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        saveComments(videoId, comments);
        loadComments(videoId);
    }
}

function addReply(videoId, parentId, text) {
    if (!text || text.trim() === '') {
        alert('Please enter a reply.');
        return;
    }
    
    const comments = getComments(videoId);
    const parentComment = comments.find(c => c.id === parentId);
    if (!parentComment) return;
    
    const channelData = JSON.parse(localStorage.getItem('channelData')) || { name: 'You', avatar: 'Y' };
    
    const newReply = {
        id: Date.now(),
        username: channelData.name || 'You',
        userAvatar: channelData.avatar || 'Y',
        text: text.trim(),
        timeAgo: 'Just now',
        timestamp: new Date().toISOString()
    };
    
    if (!parentComment.replies) parentComment.replies = [];
    parentComment.replies.push(newReply);
    saveComments(videoId, comments);
    loadComments(videoId);
}

function setupCommentInputListeners(videoId) {
    const submitBtn = document.getElementById('submitCommentBtn');
    const commentInput = document.getElementById('commentInput');
    
    if (submitBtn) {
        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        newSubmitBtn.addEventListener('click', function() {
            const input = document.getElementById('commentInput');
            if (input) addComment(videoId, input.value);
        });
    }
    
    if (commentInput) {
        const newInput = commentInput.cloneNode(true);
        commentInput.parentNode.replaceChild(newInput, commentInput);
        newInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addComment(videoId, this.value);
            }
        });
    }
    
    const cancelBtn = document.getElementById('cancelCommentBtn');
    if (cancelBtn) {
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        newCancelBtn.addEventListener('click', function() {
            const input = document.getElementById('commentInput');
            if (input) input.value = '';
        });
    }
}

function setupAllCommentEventListeners(videoId) {
    setupCommentInputListeners(videoId);
    
    document.querySelectorAll('.comment-like-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', function() {
            likeComment(videoId, parseInt(this.dataset.id));
        });
    });
    
    document.querySelectorAll('.comment-delete-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', function() {
            const commentId = parseInt(this.dataset.id);
            const parentId = this.dataset.parent ? parseInt(this.dataset.parent) : null;
            if (confirm('Delete this comment?')) {
                deleteComment(videoId, commentId, parentId);
            }
        });
    });
    
    document.querySelectorAll('.comment-reply-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', function() {
            const commentId = parseInt(this.dataset.id);
            const replyInput = document.getElementById('replyInput-' + commentId);
            if (replyInput) {
                replyInput.style.display = replyInput.style.display === 'none' ? 'flex' : 'none';
                const input = replyInput.querySelector('.reply-input');
                if (input) input.focus();
            }
        });
    });
    
    document.querySelectorAll('.reply-submit-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', function() {
            const parentId = parseInt(this.dataset.parent);
            const wrapper = document.getElementById('replyInput-' + parentId);
            const input = wrapper ? wrapper.querySelector('.reply-input') : null;
            if (input && input.value.trim() !== '') {
                addReply(videoId, parentId, input.value);
                input.value = '';
                wrapper.style.display = 'none';
            }
        });
    });
    
    document.querySelectorAll('.reply-input').forEach(input => {
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        newInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const wrapper = this.closest('.reply-input-wrapper');
                const submitBtn = wrapper ? wrapper.querySelector('.reply-submit-btn') : null;
                if (submitBtn) {
                    const parentId = parseInt(submitBtn.dataset.parent);
                    const text = this.value;
                    if (text.trim() !== '') {
                        addReply(videoId, parentId, text);
                        this.value = '';
                        wrapper.style.display = 'none';
                    }
                }
            }
        });
    });
}