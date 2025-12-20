const express = require('express');
const path = require('path');
const { databaseConnection } = require('./managers/databaseConnection');
require("dotenv").config();
const cors = require("cors");


const app = express();

// Debug helpers (safe for local dev). Lets you verify which server/process is
// actually responding on :3000 and what routes are mounted.
app.get("/api/_debug/whoami", (req, res) => {
  res.json({
    ok: true,
    service: "backend",
    pid: process.pid,
    cwd: process.cwd(),
    node: process.version,
    time: new Date().toISOString(),
  });
});

app.get("/api/_debug/routes", (req, res) => {
  try {
    // Express 5 keeps internals slightly differently; support both shapes.
    const router = app?._router || app?.router;
    const stack = router?.stack || [];
    const out = [];
    for (const layer of stack) {
      if (layer?.route?.path) {
        const methods = Object.keys(layer.route.methods || {}).filter(Boolean);
        out.push({ type: "route", path: layer.route.path, methods });
        continue;
      }
      // Mounted routers appear as "handle" with nested stack
      if (layer?.name === "router" && layer?.handle?.stack) {
        const prefix =
          layer?.regexp?.source
            ?.replace("^\\/", "/")
            ?.replace("\\/?(?=\\/|$)", "")
            ?.replace("(?=\\/|$)", "")
            ?.replace("\\/", "/")
            ?.replace("\\", "") || "";
        for (const nested of layer.handle.stack) {
          if (!nested?.route?.path) continue;
          const methods = Object.keys(nested.route.methods || {}).filter(Boolean);
          out.push({ type: "mounted", prefix, path: nested.route.path, methods });
        }
      }
    }
    res.json({ ok: true, count: out.length, routes: out });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

// CORS configuration - supports multiple origins for production (Cloud Run)
// FRONTEND_URL can be a single URL or comma-separated list of URLs
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000']; // Default to local dev server

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/credentials to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Log all requests in dev so 404s are obvious
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static resources (e.g., default avatars)
app.use('/resources', express.static(path.join(__dirname, '../resources')));

// Import routes
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');
const homeRoutes = require('./routes/homeRoutes');
const uploadRouter = require("./routes/upload");
const notificationRouter = require("./routes/notification.routes");
const userRouter = require("./routes/userRoutes"); // Changed from user.routes to userRoutes
const aiRouter = require("./routes/ai");
const topicRoutes = require('./routes/topicRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Use routes    

app.use('/r', communityRoutes);
app.use('/api/r', communityRoutes); // alias to support frontend api base path
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/', homeRoutes);
app.use("/api/upload", uploadRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/users", userRouter);
app.use('/topics', topicRoutes);
// Reuse the same router for both:
// - frontend fetches: GET /post/:id
// - API create:      POST /api/posts/create
// app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRouter);
app.use("/api/modmail", require('./routes/modmailRoutes'));

app.use('/api/communities', communityRoutes);
app.use('/api/queue', require('./routes/queueRoutes'));


// Explicit 404 handler to make it clear when a route isn't mounted
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    method: req.method,
    path: req.originalUrl,
    hint:
      "If you expected a route here, check /api/_debug/routes to see what this server actually mounted.",
  });
});

const PORT = process.env.PORT || 4000;

databaseConnection()
  .then(() => {
    console.log('Connection OK');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Connection Error', err);
    process.exit(1);
  });