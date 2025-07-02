// In server/routes/auth.js

const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /auth/register - Register a new user
router.post('/register', async (req, res) => {
    try {
        // 1. Destructure the req.body
        const { username, email, password } = req.body;

        // 2. Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            return res.status(401).json('User already exists!');
        }

        // 3. Bcrypt the user password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. Enter the new user inside our database
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, bcryptPassword]
        );

        // 5. Generate the JWT token
        const token = jwt.sign({ user_id: newUser.rows[0].user_id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /auth/login - Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 2. Check if user doesn't exist
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json('Invalid Credential');
        }

        // 3. Check if incoming password is the same as the database password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json('Invalid Credential');
        }

        // 4. Give them the jwt token
        const token = jwt.sign({ user_id: user.rows[0].user_id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;