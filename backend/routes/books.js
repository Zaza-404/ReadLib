const express = require('express');
const { db } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET ALL BOOKS
router.get('/', authenticate, (req, res) => {
    db.all('SELECT * FROM books ORDER BY id', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch books' });
        }
        res.json(rows);
    });
});

// GET BOOK BY ID
router.get('/:id', authenticate, (req, res) => {
    const bookId = req.params.id;
    
    db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Get user's progress for this book
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
    
    db.all(
        `SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ? ORDER BY title`,
        [query, query, query],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Search failed' });
            }
            res.json(rows);
        }
    );
});

// GET BOOKS BY GENRE
router.get('/genre/:genre', authenticate, (req, res) => {
    db.all(
        'SELECT * FROM books WHERE genre = ? ORDER BY title',
        [req.params.genre],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch books by genre' });
            }
            res.json(rows);
        }
    );
});

module.exports = router;