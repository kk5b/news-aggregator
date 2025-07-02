const express = require('express');
const cors = require('cors');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(globalLimiter);

// Routes
app.use('/auth', authLimiter, require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/history', require('./routes/history'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});