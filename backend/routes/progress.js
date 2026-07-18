const express = require('express');
const db = require('../database');  // ← PAKAI database.js
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET USER PROGRESS FOR ALL BOOKS
router.get('/', authenticate, (req, res) => {
    console.log('📊 Get progress for user:', req.userId);
    
    db.all(
        `SELECT p.*, b.title, b.author, b.cover, b.pages
         FROM reading_progress p
         JOIN books b ON p.book_id = b.id
         WHERE p.user_id = ?
         ORDER BY p.last_read DESC`,
        [req.userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Progress error:', err.message);
                return res.status(500).json({ error: 'Failed to fetch progress: ' + err.message });
            }
            console.log(`✅ ${rows ? rows.length : 0} progress items`);
            res.json(rows || []);
        }
    );
});

// UPDATE PROGRESS
router.post('/', authenticate, (req, res) => {
    const { bookId, progress, currentPage } = req.body;
    console.log(`📊 Update progress for book ${bookId}: ${progress}% for user:`, req.userId);

    if (!bookId || progress === undefined) {
        return res.status(400).json({ error: 'Book ID and progress are required' });
    }

    if (progress < 0 || progress > 100) {
        return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    db.get('SELECT pages FROM books WHERE id = ?', [bookId], (err, book) => {
        if (err || !book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const page = currentPage || Math.round((progress / 100) * book.pages);

        db.run(
            `INSERT INTO reading_progress (user_id, book_id, progress, current_page, last_read)
             VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(user_id, book_id) DO UPDATE SET
             progress = excluded.progress,
             current_page = excluded.current_page,
             last_read = CURRENT_TIMESTAMP`,
            [req.userId, bookId, progress, page],
            function(err) {
                if (err) {
                    console.error('❌ Update progress error:', err.message);
                    return res.status(500).json({ error: 'Failed to update progress: ' + err.message });
                }

                if (progress === 100) {
                    db.get('SELECT title FROM books WHERE id = ?', [bookId], (err, book) => {
                        if (!err && book) {
                            db.run(
                                'INSERT INTO notifications (user_id, title, body, icon) VALUES (?, ?, ?, ?)',
                                [req.userId, '🎉 Buku selesai!', `Selamat! Kamu telah menyelesaikan "${book.title}"`, '🎉']
                            );
                        }
                    });
                }

                res.json({
                    message: 'Progress updated successfully',
                    progress,
                    currentPage: page
                });
            }
        );
    });
});

module.exports = router;