// =============================================
// LOGIN / SIGNUP SYSTEM
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    // Show/hide signup form
    document.getElementById('showSignup').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.login-box').style.display = 'none';
        document.getElementById('signupBox').style.display = 'block';
    });

    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('signupBox').style.display = 'none';
        document.querySelector('.login-box').style.display = 'block';
    });

    // Handle Login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Handle Signup
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });
});

// =============================================
// LOGIN FUNCTION
// =============================================

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert('⚠️ Please fill in all fields.');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('❌ Invalid email or password. Please try again.');
        return;
    }

    // Save current user session
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Also update channel data
    localStorage.setItem('channelData', JSON.stringify({
        name: user.name,
        handle: user.handle,
        avatar: user.name.charAt(0).toUpperCase(),
        description: 'Welcome to my channel! 🚀',
        joined: new Date().getFullYear()
    }));

    localStorage.setItem('userData', JSON.stringify({
        name: user.name,
        handle: user.handle,
        email: user.email,
        avatar: user.name.charAt(0).toUpperCase(),
        joined: new Date().getFullYear()
    }));

    alert('✅ Welcome back, ' + user.name + '!');
    window.location.href = 'index.html';
}

// =============================================
// SIGNUP FUNCTION
// =============================================

function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const handle = document.getElementById('signupHandle').value.trim();

    if (!name || !email || !password || !handle) {
        alert('⚠️ Please fill in all fields.');
        return;
    }

    if (password.length < 6) {
        alert('⚠️ Password must be at least 6 characters.');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert('❌ This email is already registered. Please sign in.');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        handle: handle,
        joined: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login after signup
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    localStorage.setItem('channelData', JSON.stringify({
        name: name,
        handle: handle,
        avatar: name.charAt(0).toUpperCase(),
        description: 'Welcome to my channel! 🚀',
        joined: new Date().getFullYear()
    }));

    localStorage.setItem('userData', JSON.stringify({
        name: name,
        handle: handle,
        email: email,
        avatar: name.charAt(0).toUpperCase(),
        joined: new Date().getFullYear()
    }));

    alert('🎉 Account created successfully! Welcome, ' + name + '!');
    window.location.href = 'index.html';
}

// =============================================
// CHECK LOGIN STATUS
// =============================================

function isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user !== null;
}

// =============================================
// LOGOUT FUNCTION (called from other pages)
// =============================================

function logoutUser() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}