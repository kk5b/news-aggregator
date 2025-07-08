const express = require('express');
const cors = require('cors');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
require('dotenv').config();

const app = express();

// --- DYNAMIC CORS CONFIGURATION ---
const productionUrl = 'https://news-aggregator-two-gray.vercel.app';
const allowedOrigins = [
    productionUrl,
    'http://localhost:5173' // For local development
];

const corsOptions = {
    origin: (origin, callback) => {
        // This regex will match your production URL AND any Vercel preview URL
        // for this project (e.g., news-aggregator-....vercel.app)
        const vercelPreviewRegex = /^https:\/\/news-aggregator-.*\.vercel\.app$/;

        // Allow requests from the defined list or any matching Vercel preview URL
        if (!origin || allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(globalLimiter);

app.get('/', (req, res) => {
    res.send('Backend server is running!');
});
// Routes must NOT have the /api prefix here
app.use('/auth', authLimiter, require('./routes/auth'));
app.use('/news', require('./routes/news'));
app.use('/bookmarks', require('./routes/bookmarks'));
app.use('/profile', require('./routes/profile'));
app.use('/history', require('./routes/history'));

// Export the app for Vercel
module.exports = app;