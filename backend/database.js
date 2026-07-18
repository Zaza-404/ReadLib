const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Buat koneksi database
const db = new sqlite3.Database('./database/readlib.db', (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

module.exports = db;