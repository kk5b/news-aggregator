const express = require('express');
const cors = require('cors');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
require('dotenv').config();

const app = express();

// This tells Express to trust the headers set by Vercel's proxy
app.set('trust proxy', 1);

// --- Dynamic CORS Configuration ---
const productionUrl = 'https://news-aggregator-two-gray.vercel.app';
const allowedOrigins = [
    productionUrl,
    'http://localhost:5173' // For local development
];

const corsOptions = {
    origin: (origin, callback) => {
        const vercelPreviewRegex = /^https:\/\/news-aggregator-.*\.vercel\.app$/;
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

// Health check route for testing the server
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// Your API routes
app.use('/auth', authLimiter, require('./routes/auth'));
app.use('/news', require('./routes/news'));
app.use('/bookmarks', require('./routes/bookmarks'));
app.use('/profile', require('./routes/profile'));
app.use('/history', require('./routes/history'));

// Export the app for Vercel
module.exports = app;