const express = require('express');
const cors = require('cors');
const { databaseConnection } = require('./managers/databaseConnection');

// Import routes
const userRoutes = require('./routes/userRoutes');
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // React dev server default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to database and start server
databaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

module.exports = app;

