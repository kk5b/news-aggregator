const express = require('express');
const cors = require('cors');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(globalLimiter);

// CORS Configuration
const allowedOrigins = [
    'https://news-aggregator-two-gray.vercel.app/',
    'http://localhost:5173'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));

// Routes must NOT have the /api prefix here
app.use('/auth', authLimiter, require('./routes/auth'));
app.use('/news', require('./routes/news'));
app.use('/bookmarks', require('./routes/bookmarks'));
app.use('/profile', require('./routes/profile'));
app.use('/history', require('./routes/history'));

// Export the app for Vercel
module.exports = app;