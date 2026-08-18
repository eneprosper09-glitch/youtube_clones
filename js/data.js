// =============================================
// VIDEO DATA
// =============================================

const videos = [
    // === MUSIC VIDEOS ===
    {
    id: 21, // Or use a unique ID like 27
    title: "Davido - AWAY (Official Video)",
    channel: "Davido",
    channelAvatar: "D",
    views: "N/A", // You can update this with the actual view count
    uploaded: "N/A", // You can update this with the upload date
    thumbnail: "https://i.ytimg.com/vi/SbgKpHi-Cao/hqdefault.jpg",
    category: "Music",
    duration: "TBD", // You can add the duration if you know it
    videoUrl: "https://youtu.be/SbgKpHi-Cao"
},
    
    {
        id: 2,
        title: "How to Walk in the Spirit of Wisdom | Bishop David Oyedepo",
        channel: "Gospel Home Channel",
        channelAvatar: "G",
        views: "85.6K",
        uploaded: "2 years ago",
        thumbnail: "https://i.ytimg.com/vi/yY-WFAIoRVI/hqdefault.jpg",
        category: "Live",
        duration: "15:20",
        videoUrl: "https://youtu.be/yY-WFAIoRVI"
    },
    {
        id: 3,
        title: "How to Make Learning as Addictive as Social Media | Duolingo's Luis Von Ahn | TED",
        channel: "TED",
        channelAvatar: "T",
        views: "11M",
        uploaded: "1 year ago",
        thumbnail: "https://i.ytimg.com/vi/P6FORpg0KVo/hqdefault.jpg",
        category: "News",
        duration: "12:45",
        videoUrl: "https://youtu.be/P6FORpg0KVo"
    },
    {
        id: 4,
        title: "Ed Sheeran - Shape Of You (Official Music Video)",
        channel: "Ed Sheeran",
        channelAvatar: "E",
        views: "3.5B",
        uploaded: "4 years ago",
        thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
        category: "Music",
        duration: "4:24",
        videoUrl: "https://youtu.be/JGwWNGJdvx8"
    },
    {
        id: 6,
        title: "Less Than Human",
        channel: "The Animation Workshop",
        channelAvatar: "T",
        views: "23.7M",
        uploaded: "3 years ago",
        thumbnail: "https://i.ytimg.com/vi/Kp1paRWGYPY/hqdefault.jpg",
        category: "Mixes",
        duration: "18:30",
        videoUrl: "https://youtu.be/Kp1paRWGYPY"
    },
    {
        id: 7,
        title: "Adele - Someone Like You (Official Music Video)",
        channel: "Adele",
        channelAvatar: "A",
        views: "2.8B",
        uploaded: "6 years ago",
        thumbnail: "https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg",
        category: "Music",
        duration: "4:47",
        videoUrl: "https://youtu.be/hLQl3WQQoQ0"
    },
    // === MORE MUSIC VIDEOS ===
    {
        id: 20,
        title: "The Weeknd - Blinding Lights (Official Music Video)",
        channel: "The Weeknd",
        channelAvatar: "W",
        views: "3.2B",
        uploaded: "4 years ago",
        thumbnail: "https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg",
        category: "Music",
        duration: "4:23",
        videoUrl: "https://youtu.be/4NRXx6U8ABQ"
    },
    {
        id: 21,
        title: "Dua Lipa - Levitating (Official Music Video)",
        channel: "Dua Lipa",
        channelAvatar: "D",
        views: "1.8B",
        uploaded: "3 years ago",
        thumbnail: "https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg",
        category: "Music",
        duration: "3:45",
        videoUrl: "https://youtu.be/TUVcZfQe-Kw"
    },
    {
        id: 23,
        title: "Taylor Swift - Anti-Hero (Official Music Video)",
        channel: "Taylor Swift",
        channelAvatar: "T",
        views: "650M",
        uploaded: "2 years ago",
        thumbnail: "https://i.ytimg.com/vi/b1kbLwvqugk/hqdefault.jpg",
        category: "Music",
        duration: "4:14",
        videoUrl: "https://youtu.be/b1kbLwvqugk"
    },
    {
        id: 24,
        title: "Imagine Dragons - Believer (Official Music Video)",
        channel: "Imagine Dragons",
        channelAvatar: "I",
        views: "2.1B",
        uploaded: "5 years ago",
        thumbnail: "https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg",
        category: "Music",
        duration: "4:02",
        videoUrl: "https://youtu.be/7wtfhZwyrcc"
    },

    // === GAMING VIDEOS ===
    {
        id: 30,
        title: "Minecraft But I Can't Stop Jumping...",
        channel: "Dream",
        channelAvatar: "D",
        views: "45M",
        uploaded: "2 years ago",
        thumbnail: "https://i.ytimg.com/vi/6ZfuNTqbHE8/hqdefault.jpg",
        category: "Gaming",
        duration: "18:23",
        videoUrl: "https://youtu.be/6ZfuNTqbHE8"
    },
    {
        id: 31,
        title: "I FINALLY Beat Elden Ring (No Hit Run)",
        channel: "GamerChamp",
        channelAvatar: "G",
        views: "8.2M",
        uploaded: "1 year ago",
        thumbnail: "https://i.ytimg.com/vi/E3Huy2cdih0/hqdefault.jpg",
        category: "Gaming",
        duration: "32:15",
        videoUrl: "https://youtu.be/E3Huy2cdih0"
    },
   // === NEWS VIDEOS ===
{
    id: 40,
    title: "Osun Election And The Lessons For Nigeria - Victor Okhai | Dengiyefa Angalapu",
    channel: "Arise News",
    channelAvatar: "A",
    views: "46K",
    uploaded: "2 days ago",
    thumbnail: "https://i.ytimg.com/vi/7SJ44d_Oq2M/hqdefault.jpg",
    category: "News",
    duration: "12:30",
    videoUrl: "https://youtu.be/7SJ44d_Oq2M"
},
{
    id: 41,
    title: "Iran urges U.S. to 'accept the reality of defeat'",
    channel: "NBC News",
    channelAvatar: "N",
    views: "248K",
    uploaded: "3 days ago",
    thumbnail: "https://i.ytimg.com/vi/PeXrersen5o/hqdefault.jpg",
    category: "News",
    duration: "8:45",
    videoUrl: "https://youtu.be/PeXrersen5o"
},
{
    id: 42,
    title: "Who controls the Strait of Hormuz, Iran or the US? | BBC News",
    channel: "BBC News",
    channelAvatar: "B",
    views: "263K",
    uploaded: "5 days ago",
    thumbnail: "https://i.ytimg.com/vi/KdWSR6EIa2M/hqdefault.jpg",
    category: "News",
    duration: "15:10",
    videoUrl: "https://youtu.be/KdWSR6EIa2M"
},
// === SPORTS VIDEOS ===
{
    id: 50,
    title: "Greatest Sports Moments",
    channel: "WTD Productions",
    channelAvatar: "W",
    views: "35.6M",
    uploaded: "2 years ago",
    thumbnail: "https://i.ytimg.com/vi/o7W7OvETO40/hqdefault.jpg",
    category: "Sports",
    duration: "14:20",
    videoUrl: "https://youtu.be/o7W7OvETO40"
},
{
    id: 51,
    title: "Top 10 Moments from the World Athletics Relays Gaborone 2026",
    channel: "World Athletics",
    channelAvatar: "W",
    views: "429K",
    uploaded: "3 months ago",
    thumbnail: "https://i.ytimg.com/vi/6OeLLKS5EoA/hqdefault.jpg",
    category: "Sports",
    duration: "12:15",
    videoUrl: "https://youtu.be/6OeLLKS5EoA"
},

    
];

// =============================================
// SHORTS DATA
// =============================================

const shorts = [
    {
        id: 101,
        title: "Stoicism and Nihilism 🤔 (explained)",
        channel: "Philosophy Hub",
        views: "484",
        thumbnail: "https://i.ytimg.com/vi/wlvBq73zD8o/hqdefault.jpg"
    },
    {
        id: 102,
        title: "Philosophy is Useless",
        channel: "Philosophy Hub",
        views: "2.3K",
        thumbnail: "https://i.ytimg.com/vi/x5L-MG6q5bA/hqdefault.jpg"
    },
    {
        id: 103,
        title: "Existentialism vs. Nihilism vs. Absurdism",
        channel: "Philosophy Hub",
        views: "326K",
        thumbnail: "https://i.ytimg.com/vi/m_SJjpFB_GM/hqdefault.jpg"
    },
    {
        id: 104,
        title: "Build AI apps in minutes with Enter Pro",
        channel: "Ads-creative",
        views: "140K",
        thumbnail: "https://i.ytimg.com/vi/W7SwKZzl0kY/hqdefault.jpg"
    },
    {
        id: 105,
        title: "How do you know if someone has low EQ",
        channel: "EQ Insights",
        views: "515",
        thumbnail: "https://i.ytimg.com/vi/KwddlnXkJqs/hqdefault.jpg"
    },
    {
        id: 106,
        title: "The Stoic Mindset - Jordan Peterson",
        channel: "Jordan Peterson Clips",
        views: "1.2K",
        thumbnail: "https://i.ytimg.com/vi/hfePd0-8KCM/hqdefault.jpg"
    },
    {
        id: 107,
        title: "1 Year of Coding #programming #comedy",
        channel: "CodeComedy",
        views: "2K",
        thumbnail: "https://i.ytimg.com/vi/hRUJ41rdp4M/hqdefault.jpg"
    },
    {
        id: 108,
        title: "Change your Personality with this Method!",
        channel: "Mindset Lvl Up",
        views: "17.4K",
        thumbnail: "https://i.ytimg.com/vi/Y3-fMyNuVFc/hqdefault.jpg"
    },
    {
        id: 109,
        title: "Was Isaac Newton the greatest scientist ever?",
        channel: "Science Clips",
        views: "31.4M",
        thumbnail: "https://i.ytimg.com/vi/-edBurb9WAk/hqdefault.jpg"
    },
    {
        id: 110,
        title: "#london #asake rehearsals with @compozers",
        channel: "Afrobeat Clips",
        views: "459",
        thumbnail: "https://i.ytimg.com/vi/XHYr9C5J1FQ/hqdefault.jpg"
    },
    {
        id: 111,
        title: "Deep Philosophy Short",
        channel: "Philosophy Hub",
        views: "1.5K",
        thumbnail: "https://i.ytimg.com/vi/tc3b2X1m-dI/hqdefault.jpg"
    },
    {
        id: 112,
        title: "Motivational Short",
        channel: "Mindset Lvl Up",
        views: "8.2K",
        thumbnail: "https://i.ytimg.com/vi/goDN8fnb8uA/hqdefault.jpg"
    }
];