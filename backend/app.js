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

// Log all requests in dev so 404s are obvious
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

// Import routes
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');
const homeRoutes = require('./routes/homeRoutes');
const uploadRouter = require("./routes/upload");
const notificationRouter = require("./routes/notification.routes");
const userRouter = require("./routes/user.routes");
const aiRouter = require("./routes/ai");

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
// Reuse the same router for both:
// - frontend fetches: GET /post/:id
// - API create:      POST /api/posts/create
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRouter);

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