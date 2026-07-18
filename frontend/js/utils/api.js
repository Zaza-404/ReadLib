const API_URL = 'http://localhost:5000/api';

let authToken = null;

export function setAuthToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem('readlib_token', token);
    } else {
        localStorage.removeItem('readlib_token');
    }
}

export function getAuthToken() {
    if (!authToken) {
        authToken = localStorage.getItem('readlib_token');
    }
    return authToken;
}

async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

// ===== AUTH =====
export async function login(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    setAuthToken(data.token);
    return data;
}

export async function register(name, email, password, bio = '', location = '') {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, bio, location })
    });
    setAuthToken(data.token);
    return data;
}

export function logout() {
    setAuthToken(null);
}

// ===== BOOKS =====
export async function getBooks() {
    return await apiRequest('/books');
}

export async function getBook(id) {
    return await apiRequest(`/books/${id}`);
}

export async function searchBooks(query) {
    return await apiRequest(`/books/search/${encodeURIComponent(query)}`);
}

export async function getBooksByGenre(genre) {
    return await apiRequest(`/books/genre/${encodeURIComponent(genre)}`);
}

// ===== COLLECTIONS =====
export async function getCollection() {
    return await apiRequest('/collections');
}

export async function addToCollection(bookId) {
    return await apiRequest('/collections', {
        method: 'POST',
        body: JSON.stringify({ bookId })
    });
}

export async function removeFromCollection(bookId) {
    return await apiRequest(`/collections/${bookId}`, {
        method: 'DELETE'
    });
}

export async function checkInCollection(bookId) {
    return await apiRequest(`/collections/check/${bookId}`);
}

// ===== PROGRESS =====
export async function getProgress() {
    return await apiRequest('/progress');
}

export async function updateProgress(bookId, progress, currentPage = null) {
    return await apiRequest('/progress', {
        method: 'POST',
        body: JSON.stringify({ bookId, progress, currentPage })
    });
}

// ===== PROFILE =====
export async function getProfile() {
    return await apiRequest('/profile');
}

export async function updateProfile(data) {
    return await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

export async function getStats() {
    return await apiRequest('/profile/stats');
}

export async function getNotifications() {
    return await apiRequest('/profile/notifications');
}

export async function markNotificationRead(id) {
    return await apiRequest(`/profile/notifications/${id}`, {
        method: 'PUT'
    });
}

export async function markAllNotificationsRead() {
    return await apiRequest('/profile/notifications/read-all', {
        method: 'PUT'
    });
}