const express = require('express');
const { db } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET USER COLLECTION
router.get('/', authenticate, (req, res) => {
    db.all(
        `SELECT b.*, c.added_at 
         FROM collections c
         JOIN books b ON c.book_id = b.id
         WHERE c.user_id = ?
         ORDER BY c.added_at DESC`,
        [req.userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch collection' });
            }
            res.json(rows);
        }
    );
});

// ADD TO COLLECTION
router.post('/', authenticate, (req, res) => {
    const { bookId } = req.body;

    if (!bookId) {
        return res.status(400).json({ error: 'Book ID is required' });
    }

    // Check if book exists
    db.get('SELECT id FROM books WHERE id = ?', [bookId], (err, book) => {
        if (err || !book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        db.run(
            'INSERT OR IGNORE INTO collections (user_id, book_id) VALUES (?, ?)',
            [req.userId, bookId],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to add to collection' });
                }

                // Create notification
                db.get('SELECT title FROM books WHERE id = ?', [bookId], (err, book) => {
                    if (!err && book) {
                        db.run(
                            'INSERT INTO notifications (user_id, title, body, icon) VALUES (?, ?, ?, ?)',
                            [req.userId, '📚 Buku ditambahkan', `"${book.title}" berhasil ditambahkan ke koleksi`, '📚']
                        );
                    }
                });

                res.status(201).json({ 
                    message: 'Book added to collection',
                    added: true
                });
            }
        );
    });
});

// REMOVE FROM COLLECTION
router.delete('/:bookId', authenticate, (req, res) => {
    const bookId = req.params.bookId;

    db.run(
        'DELETE FROM collections WHERE user_id = ? AND book_id = ?',
        [req.userId, bookId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to remove from collection' });
            }
            res.json({ 
                message: 'Book removed from collection',
                removed: true
            });
        }
    );
});

// CHECK IF BOOK IN COLLECTION
router.get('/check/:bookId', authenticate, (req, res) => {
    const bookId = req.params.bookId;

    db.get(
        'SELECT id FROM collections WHERE user_id = ? AND book_id = ?',
        [req.userId, bookId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to check collection' });
            }
            res.json({ inCollection: !!row });
        }
    );
});

module.exports = router;