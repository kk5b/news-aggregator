const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
    try {
        const { article } = req.body;
        const userId = req.user.user_id;

        const articleUrl = article.url;
        const sourceId = article.source?.id || null;
        const category = req.body.category || null;

        if (!articleUrl) {
            return res.status(400).json({ msg: 'Article URL is required.' });
        }

        // To prevent logging the same article view repeatedly, you could add a check here.
        // For this implementation, we will log each view.
        await pool.query(
            'INSERT INTO view_history (user_id, article_url, source_id, category) VALUES ($1, $2, $3, $4)',
            [userId, articleUrl, sourceId, category]
        );

        res.status(200).json({ msg: 'History logged successfully.' });
    } catch (err) {
        console.error('Error in history route:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;