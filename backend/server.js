const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// ===== DATABASE SETUP =====
const db = new sqlite3.Database('./database/readlib.db', (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initDatabase();
    }
});

function initDatabase() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            bio TEXT,
            location TEXT,
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Books table (master data)
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            genre TEXT NOT NULL,
            rating REAL,
            cover TEXT,
            pages INTEGER,
            synopsis TEXT,
            year INTEGER
        )
    `);

    // User collection
    db.run(`
        CREATE TABLE IF NOT EXISTS collections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (book_id) REFERENCES books(id),
            UNIQUE(user_id, book_id)
        )
    `);

    // Reading progress
    db.run(`
        CREATE TABLE IF NOT EXISTS reading_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            progress INTEGER DEFAULT 0,
            current_page INTEGER DEFAULT 0,
            last_read DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (book_id) REFERENCES books(id),
            UNIQUE(user_id, book_id)
        )
    `);

    // Bookmarks
    db.run(`
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            page INTEGER NOT NULL,
            note TEXT,
            chapter TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (book_id) REFERENCES books(id)
        )
    `);

    // Notifications
    db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            icon TEXT,
            is_read BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Seed initial books if empty
    db.get('SELECT COUNT(*) as count FROM books', (err, row) => {
        if (err) {
            console.error('Error checking books:', err.message);
            return;
        }
        if (row.count === 0) {
            seedBooks();
        }
    });
}

function seedBooks() {
    const books = [
        {title: "Atomic Habits", author: "James Clear", genre: "Self-Help", rating: 4.8, cover: "https://covers.openlibrary.org/b/id/10521270-L.jpg", pages: 320, synopsis: "Tiny changes, remarkable results. This book will reshape the way you think about progress and success, and give you the tools to transform your habits.", year: 2018},
        {title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", rating: 4.9, cover: "https://covers.openlibrary.org/b/id/9255566-L.jpg", pages: 688, synopsis: "Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides, whose family accepts control of the desert planet Arrakis.", year: 1965},
        {title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", rating: 4.2, cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg", pages: 180, synopsis: "A portrayal of the Jazz Age, with its decadence and idealism, set against the backdrop of the American Dream.", year: 1925},
        {title: "1984", author: "George Orwell", genre: "Dystopia", rating: 4.7, cover: "https://covers.openlibrary.org/b/id/8575708-L.jpg", pages: 328, synopsis: "A chilling vision of a totalitarian society where Big Brother watches your every move and free thought is a crime.", year: 1949},
        {title: "Sapiens", author: "Yuval Noah Harari", genre: "History", rating: 4.6, cover: "https://covers.openlibrary.org/b/id/10085533-L.jpg", pages: 443, synopsis: "A brief history of humankind, exploring how Homo sapiens came to dominate the Earth and shape the modern world.", year: 2011},
        {title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", rating: 4.5, cover: "https://covers.openlibrary.org/b/id/8906045-L.jpg", pages: 197, synopsis: "A magical story about Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.", year: 1988},
        {title: "Think and Grow Rich", author: "Napoleon Hill", genre: "Self-Help", rating: 4.3, cover: "https://covers.openlibrary.org/b/id/7888361-L.jpg", pages: 233, synopsis: "The philosophy of achievement and success through studying the lives of more than forty millionaires.", year: 1937},
        {title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", rating: 4.8, cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg", pages: 281, synopsis: "Through the eyes of Scout Finch, the story explores themes of racial inequality and moral growth in the American South.", year: 1960},
    ];

    const stmt = db.prepare(`
        INSERT INTO books (title, author, genre, rating, cover, pages, synopsis, year)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    books.forEach(book => {
        stmt.run(book.title, book.author, book.genre, book.rating, book.cover, book.pages, book.synopsis, book.year);
    });

    stmt.finalize();
    console.log('✅ Seed books added successfully');
}

// ===== ROUTES =====
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const collectionRoutes = require('./routes/collections');
const progressRoutes = require('./routes/progress');
const profileRoutes = require('./routes/profile');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/profile', profileRoutes);

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = { db };