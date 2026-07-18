const express = require('express');
const db = require('../database');  // ← PAKAI database.js
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET ALL BOOKS
router.get('/', authenticate, (req, res) => {
    console.log('📚 Get all books for user:', req.userId);
    
    db.all('SELECT * FROM books ORDER BY id', (err, rows) => {
        if (err) {
            console.error('❌ Books error:', err.message);
            return res.status(500).json({ error: 'Failed to fetch books: ' + err.message });
        }
        
        // Get user's progress for each book
        const booksWithProgress = rows.map(book => {
            // Get progress from reading_progress table
            return new Promise((resolve) => {
                db.get(
                    'SELECT progress, current_page FROM reading_progress WHERE user_id = ? AND book_id = ?',
                    [req.userId, book.id],
                    (err, progress) => {
                        if (err || !progress) {
                            resolve({ ...book, user_progress: 0, current_page: 0 });
                        } else {
                            resolve({ ...book, user_progress: progress.progress, current_page: progress.current_page });
                        }
                    }
                );
            });
        });

        Promise.all(booksWithProgress)
            .then(results => {
                console.log(`✅ ${results.length} books returned`);
                res.json(results);
            })
            .catch(err => {
                console.error('❌ Error processing books:', err);
                res.json(rows);
            });
    });
});

// GET BOOK BY ID
router.get('/:id', authenticate, (req, res) => {
    const bookId = req.params.id;
    console.log(`📖 Get book ${bookId} for user:`, req.userId);
    
    db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, row) => {
        if (err) {
            console.error('❌ Book error:', err.message);
            return res.status(500).json({ error: 'Failed to fetch book: ' + err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Book not found' });
        }

        db.get(
            'SELECT progress, current_page FROM reading_progress WHERE user_id = ? AND book_id = ?',
            [req.userId, bookId],
            (err, progress) => {
                if (!err && progress) {
                    row.user_progress = progress.progress;
                    row.current_page = progress.current_page;
                } else {
                    row.user_progress = 0;
                    row.current_page = 0;
                }
                res.json(row);
            }
        );
    });
});

// SEARCH BOOKS
router.get('/search/:query', authenticate, (req, res) => {
    const query = `%${req.params.query}%`;
    console.log(`🔍 Search books for: ${req.params.query}`);
    
    db.all(
        `SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ? ORDER BY title`,
        [query, query, query],
        (err, rows) => {
            if (err) {
                console.error('❌ Search error:', err.message);
                return res.status(500).json({ error: 'Search failed: ' + err.message });
            }
            console.log(`✅ ${rows ? rows.length : 0} search results`);
            res.json(rows || []);
        }
    );
});

// GET BOOKS BY GENRE
router.get('/genre/:genre', authenticate, (req, res) => {
    console.log(`📚 Get books by genre: ${req.params.genre}`);
    
    db.all(
        'SELECT * FROM books WHERE genre = ? ORDER BY title',
        [req.params.genre],
        (err, rows) => {
            if (err) {
                console.error('❌ Genre error:', err.message);
                return res.status(500).json({ error: 'Failed to fetch books by genre: ' + err.message });
            }
            res.json(rows || []);
        }
    );
});

module.exports = router;