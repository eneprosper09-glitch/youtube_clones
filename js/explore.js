// =============================================
// EXPLORE PAGE
// =============================================

// Get category from URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category') || 'trending';

// Category details
const categoryInfo = {
    trending: {
        title: 'Trending',
        icon: '🔥',
        filter: (video) => parseInt(video.views.replace(/[^0-9.]/g, '')) > 1000000
    },
    music: {
        title: 'Music',
        icon: '♫',
        filter: (video) => video.category === 'Music'
    },
    gaming: {
        title: 'Gaming',
        icon: '🎮',
        filter: (video) => video.category === 'Gaming'
    },
    news: {
        title: 'News',
        icon: '📰',
        filter: (video) => video.category === 'News'
    },
    sports: {
        title: 'Sports',
        icon: '⚽',
        filter: (video) => video.category === 'Sports'
    },
    movies: {
        title: 'Movies & TV',
        icon: '🎬',
        filter: (video) => video.category === 'Movies' || video.category === 'Mixes'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    loadExploreCategory();
    setupSidebarHighlight();
});

// =============================================
// LOAD EXPLORE CATEGORY
// =============================================

function loadExploreCategory() {
    const grid = document.getElementById('exploreGrid');
    const emptyState = document.getElementById('emptyState');
    const title = document.getElementById('categoryTitle');
    const icon = document.getElementById('categoryIcon');
    const count = document.getElementById('categoryCount');
    
    if (!grid) return;
    
    // Get category info
    const info = categoryInfo[category] || categoryInfo.trending;
    
    // Update header
    if (title) title.textContent = info.title;
    if (icon) icon.textContent = info.icon;
    
    // Filter videos
    let filteredVideos = [];
    
    if (category === 'trending') {
        // Trending: videos with high views
        filteredVideos = videos.filter(video => {
            // Parse views (remove M, B, K suffixes)
            let viewCount = 0;
            if (video.views) {
                const viewStr = video.views.replace(/[^0-9.]/g, '');
                const num = parseFloat(viewStr) || 0;
                if (video.views.includes('B')) viewCount = num * 1000000000;
                else if (video.views.includes('M')) viewCount = num * 1000000;
                else if (video.views.includes('K')) viewCount = num * 1000;
                else viewCount = num;
            }
            return viewCount > 500000;
        });
        // Sort by views (highest first)
        filteredVideos.sort((a, b) => {
            let viewA = 0, viewB = 0;
            if (a.views) {
                const viewStrA = a.views.replace(/[^0-9.]/g, '');
                const numA = parseFloat(viewStrA) || 0;
                if (a.views.includes('B')) viewA = numA * 1000000000;
                else if (a.views.includes('M')) viewA = numA * 1000000;
                else if (a.views.includes('K')) viewA = numA * 1000;
                else viewA = numA;
            }
            if (b.views) {
                const viewStrB = b.views.replace(/[^0-9.]/g, '');
                const numB = parseFloat(viewStrB) || 0;
                if (b.views.includes('B')) viewB = numB * 1000000000;
                else if (b.views.includes('M')) viewB = numB * 1000000;
                else if (b.views.includes('K')) viewB = numB * 1000;
                else viewB = numB;
            }
            return viewB - viewA;
        });
    } else {
        // Regular category filter
        filteredVideos = videos.filter(info.filter);
    }
    
    // Update count
    if (count) {
        count.textContent = filteredVideos.length + ' video' + (filteredVideos.length !== 1 ? 's' : '');
    }
    
    // Show/hide empty state
    if (emptyState) {
        if (filteredVideos.length === 0) {
            emptyState.style.display = 'block';
            grid.innerHTML = '';
            return;
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Render videos
    renderExploreVideos(filteredVideos);
}

// =============================================
// RENDER EXPLORE VIDEOS
// =============================================

function renderExploreVideos(videoList) {
    const grid = document.getElementById('exploreGrid');
    
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
    document.querySelectorAll('#exploreGrid .video-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            localStorage.setItem('selectedVideoId', id);
            window.location.href = 'watch.html';
        });
    });
}

// =============================================
// HIGHLIGHT ACTIVE SIDEBAR ITEM
// =============================================

function setupSidebarHighlight() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes('explore.html')) {
            const itemCategory = href.split('=')[1];
            if (itemCategory === category) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}