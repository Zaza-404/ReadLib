// ===== KONFIGURASI =====
const API_URL = 'http://localhost:5000/api';

let authToken = null;

// ===== TOKEN MANAGEMENT =====
function setAuthToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem('readlib_token', token);
        console.log('✅ Token saved to localStorage');
    } else {
        localStorage.removeItem('readlib_token');
        console.log('🗑️ Token removed from localStorage');
    }
}

function getAuthToken() {
    if (!authToken) {
        authToken = localStorage.getItem('readlib_token');
        if (authToken) {
            console.log('📋 Token loaded from localStorage');
        }
    }
    return authToken;
}

// ===== API REQUEST =====
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Using auth token');
    }

    const url = `${API_URL}${endpoint}`;
    console.log(`📡 ${options.method || 'GET'} ${url}`);

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        console.log(`📡 Response status: ${response.status}`);

        const data = await response.json();
        console.log(`📡 Response data:`, data);

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
}

// ===== AUTH =====
async function login(email, password) {
    console.log('🔐 Login attempt for:', email);
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    setAuthToken(data.token);
    return data;
}

async function register(name, email, password, bio = '', location = '') {
    console.log('📝 Register attempt for:', email);
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, bio, location })
    });
    setAuthToken(data.token);
    return data;
}

function logout() {
    console.log('🚪 Logout');
    setAuthToken(null);
}

// ===== BOOKS =====
async function getBooks() {
    return await apiRequest('/books');
}

async function getBook(id) {
    return await apiRequest(`/books/${id}`);
}

async function searchBooks(query) {
    return await apiRequest(`/books/search/${encodeURIComponent(query)}`);
}

async function getBooksByGenre(genre) {
    return await apiRequest(`/books/genre/${encodeURIComponent(genre)}`);
}

// ===== COLLECTIONS =====
async function getCollection() {
    return await apiRequest('/collections');
}

async function addToCollection(bookId) {
    return await apiRequest('/collections', {
        method: 'POST',
        body: JSON.stringify({ bookId })
    });
}

async function removeFromCollection(bookId) {
    return await apiRequest(`/collections/${bookId}`, {
        method: 'DELETE'
    });
}

async function checkInCollection(bookId) {
    return await apiRequest(`/collections/check/${bookId}`);
}

// ===== PROGRESS =====
async function getProgress() {
    return await apiRequest('/progress');
}

async function updateProgress(bookId, progress, currentPage = null) {
    return await apiRequest('/progress', {
        method: 'POST',
        body: JSON.stringify({ bookId, progress, currentPage })
    });
}

// ===== PROFILE =====
async function getProfile() {
    return await apiRequest('/profile');
}

async function updateProfile(data) {
    return await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async function getStats() {
    return await apiRequest('/profile/stats');
}

async function getNotifications() {
    return await apiRequest('/profile/notifications');
}

async function markNotificationRead(id) {
    return await apiRequest(`/profile/notifications/${id}`, {
        method: 'PUT'
    });
}

async function markAllNotificationsRead() {
    return await apiRequest('/profile/notifications/read-all', {
        method: 'PUT'
    });
}