const express = require('express');
const db = require('../database');  // ← PAKAI database.js
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ===== GET PROFILE =====
router.get('/', authenticate, (req, res) => {
    console.log('📋 Get profile for user:', req.userId);
    
    db.get(
        'SELECT id, name, email, bio, location, avatar, created_at FROM users WHERE id = ?',
        [req.userId],
        (err, row) => {
            if (err) {
                console.error('❌ Database error:', err.message);
                return res.status(500).json({ error: 'Failed to fetch profile: ' + err.message });
            }
            if (!row) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log('✅ Profile found for:', row.email);
            res.json(row);
        }
    );
});

// ===== UPDATE PROFILE =====
router.put('/', authenticate, (req, res) => {
    console.log('📝 Update profile for user:', req.userId);
    const { name, bio, location, avatar } = req.body;

    db.run(
        `UPDATE users 
         SET name = COALESCE(?, name), 
             bio = COALESCE(?, bio), 
             location = COALESCE(?, location), 
             avatar = COALESCE(?, avatar) 
         WHERE id = ?`,
        [name, bio, location, avatar, req.userId],
        function(err) {
            if (err) {
                console.error('❌ Update error:', err.message);
                return res.status(500).json({ error: 'Failed to update profile: ' + err.message });
            }

            db.get(
                'SELECT id, name, email, bio, location, avatar, created_at FROM users WHERE id = ?',
                [req.userId],
                (err, user) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to fetch updated profile' });
                    }
                    console.log('✅ Profile updated for:', user.email);
                    res.json({ message: 'Profile updated', user });
                }
            );
        }
    );
});

// ===== GET USER STATS =====
router.get('/stats', authenticate, (req, res) => {
    console.log('📊 Get stats for user:', req.userId);
    
    let readCount = 0;
    let collectionCount = 0;
    let bookmarkCount = 0;
    let completed = 0;

    // Get completed books count
    db.get(
        'SELECT COUNT(DISTINCT book_id) as count FROM reading_progress WHERE user_id = ? AND progress >= 100',
        [req.userId],
        (err, row) => {
            if (err) {
                console.error('❌ Stats error (reading):', err.message);
                return res.status(500).json({ error: 'Failed to fetch stats' });
            }
            completed = row ? row.count : 0;
            checkComplete();
        }
    );

    // Get collection count
    db.get(
        'SELECT COUNT(*) as count FROM collections WHERE user_id = ?',
        [req.userId],
        (err, row) => {
            if (err) {
                console.error('❌ Stats error (collection):', err.message);
                return res.status(500).json({ error: 'Failed to fetch stats' });
            }
            collectionCount = row ? row.count : 0;
            checkComplete();
        }
    );

    // Get bookmark count
    db.get(
        'SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ?',
        [req.userId],
        (err, row) => {
            if (err) {
                console.error('❌ Stats error (bookmark):', err.message);
                return res.status(500).json({ error: 'Failed to fetch stats' });
            }
            bookmarkCount = row ? row.count : 0;
            checkComplete();
        }
    );

    let callsComplete = 0;
    const checkComplete = () => {
        callsComplete++;
        if (callsComplete === 3) {
            console.log('✅ Stats:', { completed, collectionCount, bookmarkCount });
            res.json({
                read_count: completed,
                collection_count: collectionCount,
                bookmark_count: bookmarkCount
            });
        }
    };
});

// ===== GET NOTIFICATIONS =====
router.get('/notifications', authenticate, (req, res) => {
    console.log('🔔 Get notifications for user:', req.userId);
    
    db.all(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
        [req.userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Notifications error:', err.message);
                return res.status(500).json({ error: 'Failed to fetch notifications: ' + err.message });
            }
            console.log(`✅ ${rows ? rows.length : 0} notifications found`);
            res.json(rows || []);
        }
    );
});

// ===== MARK NOTIFICATION READ =====
router.put('/notifications/:id', authenticate, (req, res) => {
    const id = req.params.id;
    console.log(`📌 Mark notification ${id} as read for user:`, req.userId);

    db.run(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [id, req.userId],
        function(err) {
            if (err) {
                console.error('❌ Update notification error:', err.message);
                return res.status(500).json({ error: 'Failed to update notification: ' + err.message });
            }
            res.json({ message: 'Notification marked as read' });
        }
    );
});

// ===== MARK ALL NOTIFICATIONS READ =====
router.put('/notifications/read-all', authenticate, (req, res) => {
    console.log('📌 Mark all notifications as read for user:', req.userId);

    db.run(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
        [req.userId],
        function(err) {
            if (err) {
                console.error('❌ Update all notifications error:', err.message);
                return res.status(500).json({ error: 'Failed to update notifications: ' + err.message });
            }
            res.json({ message: 'All notifications marked as read' });
        }
    );
});

module.exports = router;