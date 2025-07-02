const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/preferences', auth, async (req, res) => {
    try {
        const user = await pool.query('SELECT preferences FROM users WHERE user_id = $1', [req.user.user_id]);
        res.json(user.rows[0].preferences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/preferences', auth, async (req, res) => {
    const { preferences } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE users SET preferences = $1 WHERE user_id = $2 RETURNING user_id, preferences',
            [preferences, req.user.user_id]
        );
        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;