// =============================================
// SHORTS PAGE
// =============================================

let currentShortIndex = 0;
let shortsList = [];

document.addEventListener('DOMContentLoaded', function() {
    // Make sure shorts array exists
    if (typeof shorts !== 'undefined') {
        shortsList = shorts;
        
        if (shortsList.length > 0) {
            // Check if a specific short was selected from homepage
            const savedIndex = localStorage.getItem('selectedShortIndex');
            let startIndex = 0;
            
            if (savedIndex !== null) {
                startIndex = parseInt(savedIndex);
                // Clear it so next time it starts from 0
                localStorage.removeItem('selectedShortIndex');
            }
            
            // Make sure index is valid
            if (startIndex >= shortsList.length || startIndex < 0) {
                startIndex = 0;
            }
            
            loadShort(startIndex);
            loadShortsList();
            setupShortsNavigation();
            setupShortsButtons();
        } else {
            document.getElementById('shortsVideoTitle').textContent = 'No shorts available';
        }
    }
});

// =============================================
// LOAD SHORT
// =============================================

function loadShort(index) {
    if (index < 0) index = shortsList.length - 1;
    if (index >= shortsList.length) index = 0;
    
    currentShortIndex = index;
    const short = shortsList[index];
    
    if (!short) return;
    
    // Get YouTube video ID from thumbnail
    let youtubeId = '';
    if (short.thumbnail) {
        const match = short.thumbnail.match(/\/vi\/([^\/]+)\//);
        if (match) {
            youtubeId = match[1];
        }
    }
    
    // Update YouTube iframe
    const iframe = document.getElementById('shortsIframe');
    if (iframe && youtubeId) {
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    } else if (iframe) {
        iframe.src = '';
        document.getElementById('shortsYouTubePlayer').innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#000;color:#fff;padding:20px;text-align:center;font-size:18px;">
                ⚠️ Short not available
            </div>
        `;
    }
    
    // Update info
    document.getElementById('shortsVideoTitle').textContent = short.title;
    document.getElementById('shortsChannelName').textContent = short.channel;
    document.getElementById('shortsChannelAvatar').textContent = short.channel.charAt(0);
    document.getElementById('shortsViews').textContent = short.views + ' views';
    
    // Update like/dislike counts
    updateShortsCounts(short.id);
    
    // Check button states
    checkShortsButtonStates(short.id);
    
    // Highlight active short in list
    document.querySelectorAll('.shorts-list-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// =============================================
// UPDATE SHORTS COUNTS
// =============================================

function updateShortsCounts(shortId) {
    const likeKey = `liked_${shortId}`;
    const dislikeKey = `disliked_${shortId}`;
    const likeCountKey = `${likeKey}_count`;
    const dislikeCountKey = `${dislikeKey}_count`;
    
    let likeCount = parseInt(localStorage.getItem(likeCountKey)) || 0;
    let dislikeCount = parseInt(localStorage.getItem(dislikeCountKey)) || 0;
    
    if (localStorage.getItem(likeKey) === 'true' && likeCount === 0) {
        likeCount = 1;
        localStorage.setItem(likeCountKey, likeCount);
    }
    
    if (localStorage.getItem(dislikeKey) === 'true' && dislikeCount === 0) {
        dislikeCount = 1;
        localStorage.setItem(dislikeCountKey, dislikeCount);
    }
    
    document.getElementById('shortsLikeCount').textContent = likeCount;
    document.getElementById('shortsDislikeCount').textContent = dislikeCount;
}

// =============================================
// CHECK SHORTS BUTTON STATES
// =============================================

function checkShortsButtonStates(shortId) {
    const likeKey = `liked_${shortId}`;
    const dislikeKey = `disliked_${shortId}`;
    const subscribeKey = `subscribed_${shortId}`;
    
    if (localStorage.getItem(likeKey) === 'true') {
        document.getElementById('shortsLikeBtn').classList.add('active');
    }
    
    if (localStorage.getItem(dislikeKey) === 'true') {
        document.getElementById('shortsDislikeBtn').classList.add('active');
    }
    
    if (localStorage.getItem(subscribeKey) === 'true') {
        const subBtn = document.getElementById('shortsSubscribeBtn');
        subBtn.textContent = '✅ Subscribed';
        subBtn.classList.add('subscribed');
    }
}

// =============================================
// SETUP SHORTS NAVIGATION
// =============================================

function setupShortsNavigation() {
    const prevBtn = document.getElementById('prevShortBtn');
    const nextBtn = document.getElementById('nextShortBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            loadShort(currentShortIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            loadShort(currentShortIndex + 1);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            loadShort(currentShortIndex - 1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            loadShort(currentShortIndex + 1);
        }
    });
}

// =============================================
// SETUP SHORTS BUTTONS
// =============================================

function setupShortsButtons() {
    const likeBtn = document.getElementById('shortsLikeBtn');
    const dislikeBtn = document.getElementById('shortsDislikeBtn');
    const subscribeBtn = document.getElementById('shortsSubscribeBtn');
    const shareBtn = document.getElementById('shortsShareBtn');
    
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            const short = shortsList[currentShortIndex];
            if (!short) return;
            
            const videoId = short.id;
            const likeKey = `liked_${videoId}`;
            const dislikeKey = `disliked_${videoId}`;
            const likeCountKey = `${likeKey}_count`;
            const dislikeCountKey = `${dislikeKey}_count`;
            
            const isLiked = localStorage.getItem(likeKey) === 'true';
            const isDisliked = localStorage.getItem(dislikeKey) === 'true';
            
            let likeCount = parseInt(localStorage.getItem(likeCountKey)) || 0;
            let dislikeCount = parseInt(localStorage.getItem(dislikeCountKey)) || 0;
            
            if (isLiked) {
                localStorage.removeItem(likeKey);
                likeCount = Math.max(0, likeCount - 1);
                localStorage.setItem(likeCountKey, likeCount);
                this.classList.remove('active');
            } else {
                localStorage.setItem(likeKey, 'true');
                likeCount = likeCount + 1;
                localStorage.setItem(likeCountKey, likeCount);
                this.classList.add('active');
                
                if (isDisliked) {
                    localStorage.removeItem(dislikeKey);
                    dislikeCount = Math.max(0, dislikeCount - 1);
                    localStorage.setItem(dislikeCountKey, dislikeCount);
                    document.getElementById('shortsDislikeBtn').classList.remove('active');
                }
            }
            
            document.getElementById('shortsLikeCount').textContent = likeCount;
            document.getElementById('shortsDislikeCount').textContent = dislikeCount;
        });
    }
    
    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', function() {
            const short = shortsList[currentShortIndex];
            if (!short) return;
            
            const videoId = short.id;
            const likeKey = `liked_${videoId}`;
            const dislikeKey = `disliked_${videoId}`;
            const likeCountKey = `${likeKey}_count`;
            const dislikeCountKey = `${dislikeKey}_count`;
            
            const isLiked = localStorage.getItem(likeKey) === 'true';
            const isDisliked = localStorage.getItem(dislikeKey) === 'true';
            
            let likeCount = parseInt(localStorage.getItem(likeCountKey)) || 0;
            let dislikeCount = parseInt(localStorage.getItem(dislikeCountKey)) || 0;
            
            if (isDisliked) {
                localStorage.removeItem(dislikeKey);
                dislikeCount = Math.max(0, dislikeCount - 1);
                localStorage.setItem(dislikeCountKey, dislikeCount);
                this.classList.remove('active');
            } else {
                localStorage.setItem(dislikeKey, 'true');
                dislikeCount = dislikeCount + 1;
                localStorage.setItem(dislikeCountKey, dislikeCount);
                this.classList.add('active');
                
                if (isLiked) {
                    localStorage.removeItem(likeKey);
                    likeCount = Math.max(0, likeCount - 1);
                    localStorage.setItem(likeCountKey, likeCount);
                    document.getElementById('shortsLikeBtn').classList.remove('active');
                }
            }
            
            document.getElementById('shortsLikeCount').textContent = likeCount;
            document.getElementById('shortsDislikeCount').textContent = dislikeCount;
        });
    }
    
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            const short = shortsList[currentShortIndex];
            if (!short) return;
            
            const subscribeKey = `subscribed_${short.id}`;
            const isSubscribed = localStorage.getItem(subscribeKey) === 'true';
            
            if (isSubscribed) {
                localStorage.removeItem(subscribeKey);
                this.textContent = '🔔 Subscribe';
                this.classList.remove('subscribed');
            } else {
                localStorage.setItem(subscribeKey, 'true');
                this.textContent = '✅ Subscribed';
                this.classList.add('subscribed');
            }
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const short = shortsList[currentShortIndex];
            if (short && short.thumbnail) {
                const match = short.thumbnail.match(/\/vi\/([^\/]+)\//);
                if (match) {
                    const url = `https://youtu.be/${match[1]}`;
                    navigator.clipboard.writeText(url).then(() => {
                        alert('Short link copied to clipboard! 📋');
                    }).catch(() => {
                        alert('Share: ' + url);
                    });
                }
            }
        });
    }
}

// =============================================
// LOAD SHORTS LIST
// =============================================

function loadShortsList() {
    const grid = document.getElementById('shortsListGrid');
    
    if (!grid) return;
    
    grid.innerHTML = shortsList.map((short, index) => `
        <div class="shorts-list-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${short.thumbnail}" alt="${short.title}">
            <div class="shorts-list-info">
                <h4>${short.title}</h4>
                <p>${short.channel}</p>
                <p>${short.views} views</p>
            </div>
        </div>
    `).join('');
    
    // Click to load short
    document.querySelectorAll('.shorts-list-item').forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            loadShort(index);
        });
    });
}