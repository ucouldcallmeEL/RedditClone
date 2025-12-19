const express = require('express');
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

// CORS configuration - must specify exact origin (not wildcard) when using credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // React dev server default port
  credentials: true, // Allow cookies/credentials to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Log all requests in dev so 404s are obvious
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');
const homeRoutes = require('./routes/homeRoutes');
const uploadRouter = require("./routes/upload");
const notificationRouter = require("./routes/notification.routes");
const userRouter = require("./routes/userRoutes"); // Changed from user.routes to userRoutes
const aiRouter = require("./routes/ai");
const topicRoutes = require('./routes/topicRoutes');

// Use routes    

app.use('/r', communityRoutes);
app.use('/api/posts', postRoutes);
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