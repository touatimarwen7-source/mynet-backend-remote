// controllers/user.controller.js
const { getPool } = require('../db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const pool = getPool();

function issueToken(user_id, username, email) {
    const payload = { user_id, username, email };
    return jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' } 
    );
}

async function register(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING user_id, username, email, created_at;
        `;
        const values = [username, email, password_hash];
        const result = await pool.query(query, values);

        const user = result.rows[0];
        const token = issueToken(user.user_id, user.username, user.email);

        res.status(201).json({
            message: 'User registered successfully!',
            token: token,
            user: user
        });

    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ error: 'Username or Email already exists.' });
        }
        console.error('Error during user registration:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        const result = await pool.query(
            'SELECT user_id, username, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Authentication failed. Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed. Invalid email or password.' });
        }

        const token = issueToken(user.user_id, user.username, user.email);

        res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = {
    register,
    login
};