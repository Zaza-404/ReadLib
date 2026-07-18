const jwt = require('jsonwebtoken');
const { db } = require('../server');

const JWT_SECRET = process.env.JWT_SECRET || 'readlib-secret-key-2024';

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        
        // Verify user still exists
        db.get('SELECT id FROM users WHERE id = ?', [decoded.userId], (err, row) => {
            if (err || !row) {
                return res.status(401).json({ error: 'User not found' });
            }
            next();
        });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = { authenticate, JWT_SECRET };