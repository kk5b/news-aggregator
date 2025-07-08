const express = require('express');
const cors = require('cors');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
require('dotenv').config();

const app = express();

// --- Temporarily allow all origins for testing ---
app.use(cors());

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