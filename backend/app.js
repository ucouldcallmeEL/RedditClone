const express = require('express');
const { databaseConnection } = require('./managers/databaseConnection');

const app = express();

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Import routes
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');
const homeRoutes = require('./routes/homeRoutes');

// Use routes
app.use('/r', communityRoutes);
app.use('/post', postRoutes);
app.use('/', homeRoutes);

databaseConnection()
  .then(() => {
    console.log('Connection OK');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Connection Error', err);
    process.exit(1);
  });