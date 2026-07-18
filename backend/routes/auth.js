const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../server');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password, bio, location } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (name, email, password, bio, location) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, bio || '', location || ''],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Email already registered' });
                    }
                    return res.status(500).json({ error: 'Registration failed' });
                }

                // Create default notifications
                db.run(
                    'INSERT INTO notifications (user_id, title, body, icon) VALUES (?, ?, ?, ?)',
                    [this.lastID, 'Selamat datang! 🎉', `Halo ${name}, selamat bergabung di ReadLib!`, '👋']
                );

                const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '7d' });
                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: { id: this.lastID, name, email, bio: bio || '', location: location || '' }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// LOGIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        try {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
            
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    bio: user.bio || '',
                    location: user.location || '',
                    avatar: user.avatar
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    });
});

module.exports = router;