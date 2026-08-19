// =============================================
// RENDER VIDEOS
// =============================================

function renderVideos(videoList) {
    const grid = document.getElementById('videoGrid');
    
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
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
}

// =============================================
// RENDER SHORTS (with click to play)
// =============================================

function renderShorts(shortsList) {
    const grid = document.getElementById('shortsGrid');
    
    if (!grid) return;
    
    grid.innerHTML = shortsList.map((short, index) => `
        <div class="short-card" data-index="${index}">
            <img src="${short.thumbnail}" alt="${short.title}" loading="lazy">
            <div class="short-info">
                <h4>${short.title}</h4>
                <p>${short.views} views</p>
                <p class="short-channel">${short.channel}</p>
            </div>
        </div>
    `).join('');
    
    // Click to go to shorts page with this short
    document.querySelectorAll('.short-card').forEach(card => {
        card.addEventListener('click', function() {
            const index = this.dataset.index;
            // Save the short index to localStorage
            localStorage.setItem('selectedShortIndex', index);
            // Navigate to shorts page
            window.location.href = 'shorts-page.html';
        });
    });
}

// =============================================
// CATEGORY FILTER
// =============================================

function setupCategoryFilter() {
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(cat => {
        cat.addEventListener('click', function() {
            // Update active state
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            if (category === 'All') {
                renderVideos(videos);
            } else {
                const filtered = videos.filter(v => v.category === category);
                renderVideos(filtered);
            }
        });
    });
}

// =============================================
// SEARCH
// =============================================

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchButton');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            renderVideos(videos);
            return;
        }
        
        const results = videos.filter(v => 
            v.title.toLowerCase().includes(query) ||
            v.channel.toLowerCase().includes(query)
        );
        
        renderVideos(results);
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// =============================================
// SIDEBAR TOGGLE
// =============================================

function setupSidebar() {
    const menuBtn = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (!menuBtn || !sidebar) return;
    
    menuBtn.addEventListener('click', function() {
        // For mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
        } else {
            // For desktop - collapse
            sidebar.classList.toggle('collapsed');
            if (mainContent) {
                mainContent.classList.toggle('expanded');
            }
        }
    });
    
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Initialize sidebar when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupSidebar();
});

// =============================================
// RESPONSIVE SIDEBAR
// =============================================

function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

// =============================================
// SHORTS "MORE" BUTTON
// =============================================

function setupShortsMore() {
    const moreBtn = document.getElementById('shortsMoreButton');
    moreBtn.addEventListener('click', function() {
        alert('More shorts coming soon! 🎬');
    });
}

// =============================================
// INITIALIZE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    renderVideos(videos);
    renderShorts(shorts);
    setupCategoryFilter();
    setupSearch();
    setupSidebar();
    setupShortsMore();
    handleResize();
});

window.addEventListener('resize', handleResize);
// =============================================
// RENDER MORE VIDEOS (after shorts)
// =============================================

function renderMoreVideos(videoList) {
    const grid = document.getElementById('moreVideosGrid');
    
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
    document.querySelectorAll('#moreVideosGrid .video-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    renderVideos(videos);
    renderShorts(shorts);
    
    // NEW: Render the "more videos" section with videos 7-12
    const extraVideos = videos.slice(6); // Gets videos from index 6 to end
    renderMoreVideos(extraVideos);
    
    setupCategoryFilter();
    setupSearch();
    setupSidebar();
});
// =============================================
// LOGOUT FUNCTION
// =============================================

function logoutUser() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear user session
        localStorage.removeItem('currentUser');
        localStorage.removeItem('channelData');
        localStorage.removeItem('userData');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}