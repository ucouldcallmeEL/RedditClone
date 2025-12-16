const express = require('express');
const { databaseConnection } = require('./managers/databaseConnection');
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./Db_config/connectDB");

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
const uploadRouter = require("./Routes/upload");
const notificationRouter = require("./Routes/notification.routes");
const userRouter = require("./Routes/user.routes");
const postRouter = require("./Routes/post.routes");
const aiRouter = require("./Routes/ai")

// Use routes
app.use(cors({origin: "*"}));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

app.use('/r', communityRoutes);
app.use('/post', postRoutes);
app.use('/', homeRoutes);
app.use("/api/upload", uploadRouter);
app.use("/api/notifications" , notificationRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/ai", aiRouter);

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