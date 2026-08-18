// =============================================
// CHANNEL PAGE
// =============================================

let channelVideos = [];
let channelShorts = [];
let playlists = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Channel page loaded');
    
    // Make sure data exists
    if (typeof videos !== 'undefined') {
        channelVideos = videos;
        console.log('Videos loaded:', channelVideos.length);
    } else {
        console.log('Videos not found!');
    }
    
    if (typeof shorts !== 'undefined') {
        channelShorts = shorts;
        console.log('Shorts loaded:', channelShorts.length);
    } else {
        console.log('Shorts not found!');
    }
    
    // Load playlists from localStorage
    playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    console.log('Playlists loaded:', playlists.length);
    
    // Load everything
    loadChannelInfo();
    loadChannelVideos();
    loadChannelShorts();
    loadPlaylists();
    setupChannelTabs();
    setupChannelEdit();
});

// =============================================
// LOAD CHANNEL INFO
// =============================================

function loadChannelInfo() {
    console.log('Loading channel info...');
    
    // Get user data from localStorage or use defaults
    const channelData = JSON.parse(localStorage.getItem('channelData')) || {
        name: 'Your Channel',
        handle: 'yourchannel',
        avatar: 'C',
        description: 'Welcome to my channel! I create content about coding, design, and creativity. Subscribe and join the community! 🚀',
        joined: '2026'
    };
    
    // Update display
    document.getElementById('channelName').textContent = channelData.name;
    document.getElementById('channelHandle').textContent = '@' + channelData.handle;
    document.getElementById('channelAvatar').textContent = channelData.avatar;
    document.getElementById('channelDescription').textContent = channelData.description;
    document.getElementById('aboutJoined').textContent = channelData.joined;
    
    // Calculate stats
    const totalSubscribers = getTotalSubscribers();
    const totalVideos = channelVideos.length + channelShorts.length;
    const totalViews = getTotalViews();
    
    document.getElementById('channelStats').textContent = 
        `${totalSubscribers.toLocaleString()} subscribers • ${totalVideos} videos`;
    document.getElementById('aboutSubscribers').textContent = totalSubscribers.toLocaleString();
    document.getElementById('aboutVideos').textContent = totalVideos;
    document.getElementById('aboutViews').textContent = totalViews.toLocaleString();
    
    console.log('Channel info loaded');
}

// =============================================
// GET TOTAL SUBSCRIBERS
// =============================================

function getTotalSubscribers() {
    let subscribers = 0;
    
    // Count subscriptions from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('subscribed_')) {
            if (localStorage.getItem(key) === 'true') {
                subscribers++;
            }
        }
    }
    
    // If no subscribers, show random number for demo
    if (subscribers === 0) {
        subscribers = Math.floor(Math.random() * 1000) + 100;
    }
    
    return subscribers;
}

// =============================================
// GET TOTAL VIEWS
// =============================================

function getTotalViews() {
    let totalViews = 0;
    
    // Get view counts from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('views_')) {
            const views = parseInt(localStorage.getItem(key)) || 0;
            totalViews += views;
        }
    }
    
    // If no views, generate random for demo
    if (totalViews === 0) {
        totalViews = Math.floor(Math.random() * 50000) + 5000;
    }
    
    return totalViews;
}

// =============================================
// LOAD CHANNEL VIDEOS
// =============================================

function loadChannelVideos() {
    const grid = document.getElementById('channelVideoGrid');
    
    if (!grid) {
        console.log('Video grid not found!');
        return;
    }
    
    console.log('Loading channel videos...');
    
    if (channelVideos.length === 0) {
        grid.innerHTML = `
            <div class="no-videos-msg">
                <p>No videos uploaded yet.</p>
                <p style="color:#888;font-size:14px;">Upload your first video!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = channelVideos.map(video => `
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
    document.querySelectorAll('#channelVideoGrid .video-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
    
    console.log('Channel videos loaded:', channelVideos.length);
}

// =============================================
// LOAD CHANNEL SHORTS
// =============================================

function loadChannelShorts() {
    const grid = document.getElementById('channelShortsGrid');
    
    if (!grid) {
        console.log('Shorts grid not found!');
        return;
    }
    
    console.log('Loading channel shorts...');
    
    if (channelShorts.length === 0) {
        grid.innerHTML = `
            <div class="no-videos-msg">
                <p>No shorts uploaded yet.</p>
                <p style="color:#888;font-size:14px;">Upload your first short!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = channelShorts.map((short, index) => `
        <div class="short-card" data-index="${index}">
            <img src="${short.thumbnail}" alt="${short.title}" loading="lazy">
            <div class="short-info">
                <h4>${short.title}</h4>
                <p>${short.views} views</p>
                <p class="short-channel">${short.channel}</p>
            </div>
        </div>
    `).join('');
    
    // Click to go to shorts page
    document.querySelectorAll('#channelShortsGrid .short-card').forEach(card => {
        card.addEventListener('click', function() {
            const index = this.dataset.index;
            localStorage.setItem('selectedShortIndex', index);
            window.location.href = 'shorts-page.html';
        });
    });
    
    console.log('Channel shorts loaded:', channelShorts.length);
}

// =============================================
// LOAD PLAYLISTS
// =============================================

function loadPlaylists() {
    const container = document.getElementById('tab-playlists');
    
    if (!container) {
        console.log('Playlists container not found!');
        return;
    }
    
    console.log('Loading playlists...');
    
    // Reload playlists from localStorage
    playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    
    if (playlists.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="display:block;">
                <div class="empty-icon">📂</div>
                <h2>No playlists yet</h2>
                <p>Create your first playlist to organize your videos.</p>
                <button class="browse-btn" id="createPlaylistBtn">+ Create Playlist</button>
            </div>
        `;
        
        const createBtn = document.getElementById('createPlaylistBtn');
        if (createBtn) {
            createBtn.addEventListener('click', function() {
                createPlaylist();
            });
        }
        return;
    }
    
    // Build playlists HTML
    let html = `
        <div class="playlists-header">
            <h3>Your Playlists (${playlists.length})</h3>
            <button class="browse-btn" id="createPlaylistBtn">+ New Playlist</button>
        </div>
        <div class="playlists-grid">
    `;
    
    playlists.forEach((playlist, index) => {
        const videoCount = playlist.videos ? playlist.videos.length : 0;
        const thumbnail = playlist.videos && playlist.videos.length > 0 
            ? playlist.videos[0].thumbnail 
            : 'https://via.placeholder.com/320x180/272727/888?text=No+Videos';
        
        html += `
            <div class="playlist-card" data-index="${index}">
                <div class="playlist-thumbnail">
                    <img src="${thumbnail}" alt="${playlist.name}">
                    <span class="playlist-count">${videoCount} videos</span>
                </div>
                <div class="playlist-info">
                    <h4>${playlist.name}</h4>
                    <p>Created ${new Date(playlist.created).toLocaleDateString()}</p>
                    <div class="playlist-actions">
                        <button class="playlist-btn view-btn" data-index="${index}">👁️ View</button>
                        <button class="playlist-btn delete-btn" data-index="${index}">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Add event listeners
    const createBtn = document.getElementById('createPlaylistBtn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            createPlaylist();
        });
    }
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            viewPlaylist(index);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            deletePlaylist(index);
        });
    });
    
    console.log('Playlists loaded:', playlists.length);
}

// =============================================
// CREATE PLAYLIST
// =============================================

function createPlaylist() {
    const playlistName = prompt('Enter playlist name:');
    
    if (playlistName === null) return; // User cancelled
    
    if (playlistName.trim() === '') {
        alert('Please enter a name for your playlist.');
        return;
    }
    
    // Create new playlist
    const newPlaylist = {
        id: Date.now(),
        name: playlistName.trim(),
        videos: [],
        created: new Date().toISOString()
    };
    
    playlists.push(newPlaylist);
    localStorage.setItem('playlists', JSON.stringify(playlists));
    
    // Reload playlists
    loadPlaylists();
    alert('✅ Playlist "' + playlistName.trim() + '" created successfully!');
}

// =============================================
// VIEW PLAYLIST
// =============================================

function viewPlaylist(index) {
    const playlist = playlists[index];
    
    if (!playlist) {
        alert('Playlist not found!');
        return;
    }
    
    const videos = playlist.videos || [];
    
    if (videos.length === 0) {
        alert('📂 ' + playlist.name + '\n\nThis playlist has no videos yet.\nAdd videos from the watch page!');
        return;
    }
    
    let message = '📂 ' + playlist.name + '\n\n';
    videos.forEach((video, i) => {
        message += (i + 1) + '. ' + video.title + ' (' + video.channel + ')\n';
    });
    message += '\nTotal: ' + videos.length + ' videos';
    
    alert(message);
}

// =============================================
// DELETE PLAYLIST
// =============================================

function deletePlaylist(index) {
    const playlist = playlists[index];
    
    if (!playlist) {
        alert('Playlist not found!');
        return;
    }
    
    if (confirm('Delete playlist "' + playlist.name + '"?')) {
        playlists.splice(index, 1);
        localStorage.setItem('playlists', JSON.stringify(playlists));
        loadPlaylists();
        alert('🗑️ Playlist deleted!');
    }
}

// =============================================
// SETUP CHANNEL TABS
// =============================================

function setupChannelTabs() {
    const tabs = document.querySelectorAll('.channel-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.channel-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const tabName = this.dataset.tab;
            const target = document.getElementById('tab-' + tabName);
            
            if (target) {
                target.classList.add('active');
                
                // Reload playlists when switching to playlists tab
                if (tabName === 'playlists') {
                    loadPlaylists();
                }
            }
        });
    });
    
    console.log('Channel tabs setup complete');
}

// =============================================
// SETUP CHANNEL EDIT
// =============================================

function setupChannelEdit() {
    const editBtn = document.getElementById('editChannelBtn');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Get current data
            const channelData = JSON.parse(localStorage.getItem('channelData')) || {
                name: 'Your Channel',
                handle: 'yourchannel',
                avatar: 'C',
                description: 'Welcome to my channel! I create content about coding, design, and creativity. Subscribe and join the community! 🚀',
                joined: '2026'
            };
            
            // Edit channel name
            const newName = prompt('Channel Name:', channelData.name);
            if (newName !== null && newName.trim() !== '') {
                channelData.name = newName.trim();
            }
            
            // Edit channel handle
            const newHandle = prompt('Channel Handle (without @):', channelData.handle);
            if (newHandle !== null && newHandle.trim() !== '') {
                channelData.handle = newHandle.trim();
            }
            
            // Edit channel avatar
            const newAvatar = prompt('Channel Avatar (single letter or emoji):', channelData.avatar);
            if (newAvatar !== null && newAvatar.trim() !== '') {
                channelData.avatar = newAvatar.trim();
            }
            
            // Edit channel description
            const newDescription = prompt('Channel Description:', channelData.description);
            if (newDescription !== null && newDescription.trim() !== '') {
                channelData.description = newDescription.trim();
            }
            
            // Save to localStorage
            localStorage.setItem('channelData', JSON.stringify(channelData));
            
            // Reload channel info
            loadChannelInfo();
            
            alert('✅ Channel updated successfully!');
        });
    }
// =============================================
// COMMENTS
// =============================================

// Load comments when video loads
function loadComments(videoId) {
    const commentsList = document.getElementById('commentsList');
    const commentCount = document.getElementById('commentCount');
    
    if (!commentsList) return;
    
    // Get comments from localStorage
    const comments = getComments(videoId);
    
    // Update count
    if (commentCount) {
        commentCount.textContent = comments.length + ' Comment' + (comments.length !== 1 ? 's' : '');
    }
    
    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="no-comments">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        `;
        return;
    }
    
    // Render comments (newest first)
    commentsList.innerHTML = comments.reverse().map(comment => `
        <div class="comment-item" data-id="${comment.id}">
            <div class="comment-avatar">${comment.userAvatar || 'U'}</div>
            <div class="comment-content">
                <div class="comment-user">
                    <strong>${comment.username}</strong>
                    <span>${comment.timeAgo || 'Just now'}</span>
                </div>
                <p>${comment.text}</p>
                <div class="comment-actions-row">
                    <button class="comment-like-btn" data-id="${comment.id}">
                        👍 <span class="comment-like-count">${comment.likes || 0}</span>
                    </button>
                    <button class="comment-reply-btn" data-id="${comment.id}">Reply</button>
                    <button class="comment-delete-btn" data-id="${comment.id}">🗑️</button>
                </div>
                <!-- Replies -->
                <div class="comment-replies" id="replies-${comment.id}">
                    ${comment.replies && comment.replies.length > 0 ? comment.replies.map(reply => `
                        <div class="comment-item reply-item" data-id="${reply.id}">
                            <div class="comment-avatar">${reply.userAvatar || 'U'}</div>
                            <div class="comment-content">
                                <div class="comment-user">
                                    <strong>${reply.username}</strong>
                                    <span>${reply.timeAgo || 'Just now'}</span>
                                </div>
                                <p>${reply.text}</p>
                                <div class="comment-actions-row">
                                    <button class="comment-delete-btn" data-id="${reply.id}" data-parent="${comment.id}">🗑️</button>
                                </div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
                <!-- Reply Input -->
                <div class="reply-input-wrapper" style="display:none;" id="replyInput-${comment.id}">
                    <input type="text" class="reply-input" placeholder="Write a reply..." />
                    <button class="reply-submit-btn" data-parent="${comment.id}">Reply</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for comment buttons
    setupCommentEventListeners(videoId);
}

// =============================================
// GET COMMENTS
// =============================================

function getComments(videoId) {
    const key = 'comments_' + videoId;
    const comments = JSON.parse(localStorage.getItem(key)) || [];
    return comments;
}

// =============================================
// SAVE COMMENTS
// =============================================

function saveComments(videoId, comments) {
    const key = 'comments_' + videoId;
    localStorage.setItem(key, JSON.stringify(comments));
}

// =============================================
// ADD COMMENT
// =============================================

function addComment(videoId, text) {
    if (!text || text.trim() === '') return;
    
    const comments = getComments(videoId);
    
    // Get user name from localStorage or use default
    const userData = JSON.parse(localStorage.getItem('channelData')) || {
        name: 'You',
        avatar: 'Y'
    };
    
    const newComment = {
        id: Date.now(),
        username: userData.name,
        userAvatar: userData.avatar,
        text: text.trim(),
        timeAgo: 'Just now',
        likes: 0,
        replies: [],
        timestamp: new Date().toISOString()
    };
    
    comments.push(newComment);
    saveComments(videoId, comments);
    
    // Reload comments
    loadComments(videoId);
    
    // Clear input
    document.getElementById('commentInput').value = '';
}

// =============================================
// DELETE COMMENT
// =============================================

function deleteComment(videoId, commentId, parentId) {
    const comments = getComments(videoId);
    
    if (parentId) {
        // Delete a reply
        const parentComment = comments.find(c => c.id === parentId);
        if (parentComment && parentComment.replies) {
            parentComment.replies = parentComment.replies.filter(r => r.id !== commentId);
            saveComments(videoId, comments);
            loadComments(videoId);
        }
    } else {
        // Delete a main comment
        const updatedComments = comments.filter(c => c.id !== commentId);
        saveComments(videoId, updatedComments);
        loadComments(videoId);
    }
}

// =============================================
// LIKE COMMENT
// =============================================

function likeComment(videoId, commentId) {
    const comments = getComments(videoId);
    const comment = comments.find(c => c.id === commentId);
    
    if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        saveComments(videoId, comments);
        loadComments(videoId);
    }
}

// =============================================
// ADD REPLY
// =============================================

function addReply(videoId, parentId, text) {
    if (!text || text.trim() === '') return;
    
    const comments = getComments(videoId);
    const parentComment = comments.find(c => c.id === parentId);
    
    if (!parentComment) return;
    
    const userData = JSON.parse(localStorage.getItem('channelData')) || {
        name: 'You',
        avatar: 'Y'
    };
    
    const newReply = {
        id: Date.now(),
        username: userData.name,
        userAvatar: userData.avatar,
        text: text.trim(),
        timeAgo: 'Just now',
        timestamp: new Date().toISOString()
    };
    
    if (!parentComment.replies) {
        parentComment.replies = [];
    }
    
    parentComment.replies.push(newReply);
    saveComments(videoId, comments);
    loadComments(videoId);
}

// =============================================
// SETUP COMMENT EVENT LISTENERS
// =============================================

function setupCommentEventListeners(videoId) {
    // Submit comment
    const submitBtn = document.getElementById('submitCommentBtn');
    const commentInput = document.getElementById('commentInput');
    
    if (submitBtn && commentInput) {
        // Remove old listeners by cloning
        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        
        newSubmitBtn.addEventListener('click', function() {
            const text = document.getElementById('commentInput').value;
            addComment(videoId, text);
        });
        
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const text = this.value;
                addComment(videoId, text);
            }
        });
    }
    
    // Like buttons
    document.querySelectorAll('.comment-like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = parseInt(this.dataset.id);
            likeComment(videoId, commentId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.comment-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = parseInt(this.dataset.id);
            const parentId = this.dataset.parent ? parseInt(this.dataset.parent) : null;
            if (confirm('Delete this comment?')) {
                deleteComment(videoId, commentId, parentId);
            }
        });
    });
    
    // Reply buttons - show reply input
    document.querySelectorAll('.comment-reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = parseInt(this.dataset.id);
            const replyInput = document.getElementById('replyInput-' + commentId);
            if (replyInput) {
                replyInput.style.display = replyInput.style.display === 'none' ? 'flex' : 'none';
                const input = replyInput.querySelector('.reply-input');
                if (input) input.focus();
            }
        });
    });
    
    // Reply submit buttons
    document.querySelectorAll('.reply-submit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parentId = parseInt(this.dataset.parent);
            const wrapper = document.getElementById('replyInput-' + parentId);
            const input = wrapper ? wrapper.querySelector('.reply-input') : null;
            if (input && input.value.trim() !== '') {
                addReply(videoId, parentId, input.value);
            }
        });
    });
    
    // Reply input enter key
    document.querySelectorAll('.reply-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const parentId = parseInt(this.closest('.reply-input-wrapper').dataset.parent || 
                    this.closest('.reply-input-wrapper').querySelector('.reply-submit-btn').dataset.parent);
                const text = this.value;
                if (text.trim() !== '') {
                    addReply(videoId, parentId, text);
                }
            }
        });
    });
}
}   