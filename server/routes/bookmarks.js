const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
    try {
        const { article } = req.body;
        const userId = req.user.user_id;

        const newBookmark = await pool.query(
            'INSERT INTO bookmarks (user_id, article) VALUES ($1, $2) RETURNING *',
            [userId, article]
        );

        res.json(newBookmark.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const userBookmarks = await pool.query(
            'SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        res.json(userBookmarks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id } = req.params;

        const deleteResponse = await pool.query(
            'DELETE FROM bookmarks WHERE bookmark_id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (deleteResponse.rows.length === 0) {
            return res.status(404).json({ msg: 'Bookmark not found or user not authorized' });
        }

        res.json({ msg: 'Bookmark removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/delete-by-url', auth, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ msg: 'URL is required' });
        }

        const deleteResponse = await pool.query(
            "DELETE FROM bookmarks WHERE user_id = $1 AND article->>'url' = $2 RETURNING *",
            [userId, url]
        );

        if (deleteResponse.rows.length === 0) {
            return res.status(404).json({ msg: 'Bookmark not found' });
        }

        res.json({ msg: 'Bookmark removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;