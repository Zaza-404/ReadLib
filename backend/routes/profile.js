const express = require('express');
const { db } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET PROFILE
router.get('/', authenticate, (req, res) => {
    db.get(
        'SELECT id, name, email, bio, location, avatar, created_at FROM users WHERE id = ?',
        [req.userId],
        (err, row) => {
            if (err || !row) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(row);
        }
    );
});

// UPDATE PROFILE
router.put('/', authenticate, (req, res) => {
    const { name, bio, location, avatar } = req.body;

    db.run(
        'UPDATE users SET name = COALESCE(?, name), bio = COALESCE(?, bio), location = COALESCE(?, location), avatar = COALESCE(?, avatar) WHERE id = ?',
        [name, bio, location, avatar, req.userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update profile' });
            }

            db.get(
                'SELECT id, name, email, bio, location, avatar, created_at FROM users WHERE id = ?',
                [req.userId],
                (err, user) => {
                    res.json({ message: 'Profile updated', user });
                }
            );
        }
    );
});

// GET USER STATS
router.get('/stats', authenticate, (req, res) => {
    const stats = {};

    db.get(
        'SELECT COUNT(DISTINCT book_id) as read_count FROM reading_progress WHERE user_id = ? AND progress >= 100',
        [req.userId],
        (err, row) => {
            stats.read_count = row?.read_count || 0;
        }
    );

    db.get(
        'SELECT COUNT(*) as collection_count FROM collections WHERE user_id = ?',
        [req.userId],
        (err, row) => {
            stats.collection_count = row?.collection_count || 0;
        }
    );

    db.get(
        'SELECT COUNT(*) as bookmark_count FROM bookmarks WHERE user_id = ?',
        [req.userId],
        (err, row) => {
            stats.bookmark_count = row?.bookmark_count || 0;
        }
    );

    // Wait for all queries to complete
    const checkComplete = () => {
        if (stats.read_count !== undefined && stats.collection_count !== undefined && stats.bookmark_count !== undefined) {
            res.json(stats);
        } else {
            setTimeout(checkComplete, 100);
        }
    };
    checkComplete();
});

// GET USER NOTIFICATIONS
router.get('/notifications', authenticate, (req, res) => {
    db.all(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
        [req.userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch notifications' });
            }
            res.json(rows);
        }
    );
});

// MARK NOTIFICATION READ
router.put('/notifications/:id', authenticate, (req, res) => {
    const id = req.params.id;

    db.run(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [id, req.userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update notification' });
            }
            res.json({ message: 'Notification marked as read' });
        }
    );
});

// MARK ALL NOTIFICATIONS READ
router.put('/notifications/read-all', authenticate, (req, res) => {
    db.run(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
        [req.userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update notifications' });
            }
            res.json({ message: 'All notifications marked as read' });
        }
    );
});

module.exports = router;