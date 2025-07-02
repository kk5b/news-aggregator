const router = require('express').Router();
const axios = require('axios');
const pool = require('../db');
const auth = require('../middleware/auth');
const { getFromCache, setInCache } = require('../utils/cache');

router.get('/sources', async (req, res) => {
    try {
        const cacheKey = 'news-sources';
        const cached = getFromCache(cacheKey);
        if (cached) return res.json({ sources: cached });

        const response = await axios.get(`https://newsapi.org/v2/top-headlines/sources?apiKey=${process.env.NEWS_API_KEY}`);
        const sources = response.data.sources;
        setInCache(cacheKey, sources);
        res.json({ sources });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sources' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const { category, country, q, sources, page = 1, pageSize = 9, sortBy } = req.query;
        const apiUrlBase = `https://newsapi.org/v2/`;

        if (q) {
            const sort = sortBy || 'publishedAt';
            const cacheKey = `search-q=${q}-sort=${sort}-page=${page}`;
            const cached = getFromCache(cacheKey);
            if (cached) return res.json(cached);

            const url = `${apiUrlBase}everything?q=${encodeURIComponent(q)}&sortBy=${sort}&pageSize=${pageSize}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
            const response = await axios.get(url);
            setInCache(cacheKey, response.data);
            return res.json(response.data);
        }

        if (sources || category || country) {
            const cacheKey = `filters-src=${sources}-cat=${category}-cnt=${country}-page=${page}`;
            const cached = getFromCache(cacheKey);
            if (cached) return res.json(cached);

            let url = `${apiUrlBase}top-headlines?`;
            if (sources) {
                url += `sources=${sources}`;
            } else {
                url += `country=${country || 'us'}`;
                if (category) url += `&category=${category}`;
            }
            url += `&pageSize=${pageSize}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;

            const response = await axios.get(url);
            setInCache(cacheKey, response.data);
            return res.json(response.data);
        }

        const user = await pool.query('SELECT preferences FROM users WHERE user_id = $1', [req.user.user_id]);
        const preferredCategories = user.rows[0]?.preferences?.categories || [];

        if (preferredCategories.length > 0) {
            const prefKey = preferredCategories.sort().join(',');
            const cacheKey = `personalized-prefs=${prefKey}`;
            const cachedList = getFromCache(cacheKey);

            if (cachedList) {
                const start = (page - 1) * pageSize;
                const end = start + Number(pageSize);
                return res.json({ articles: cachedList.slice(start, end), totalResults: cachedList.length });
            }

            const requests = preferredCategories.map(cat => axios.get(`${apiUrlBase}top-headlines?category=${cat}&country=us&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`));
            const responses = await Promise.all(requests);
            const allArticles = responses.flatMap(r => r.data.articles);

            const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.url, a])).values());
            const sorted = uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

            setInCache(cacheKey, sorted);
            const start = (page - 1) * pageSize;
            const end = start + Number(pageSize);
            return res.json({ articles: sorted.slice(start, end), totalResults: sorted.length });
        }

        const fallbackKey = `fallback-us-page=${page}`;
        const cached = getFromCache(fallbackKey);
        if (cached) return res.json(cached);

        const fallbackUrl = `${apiUrlBase}top-headlines?country=us&pageSize=${pageSize}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
        const fallbackResponse = await axios.get(fallbackUrl);
        setInCache(fallbackKey, fallbackResponse.data);
        return res.json(fallbackResponse.data);

    } catch (error) {
        if (error.response) return res.status(error.response.status).json(error.response.data);
        res.status(500).json({ message: 'Failed to fetch news' });
    }
});

module.exports = router;