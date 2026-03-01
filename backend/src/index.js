require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8000;

// Security Middleware
app.use(helmet());

// Rate Limiting (100 requests per 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Optimization Middleware
app.use(compression());
app.use(express.json({ limit: '10kb' })); // Mitigate large payloads
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Logging Middleware
app.use(morgan('combined'));

const os = require('os');
const cluster = require('cluster');

// Highly Scalable Node Architecture: Multi-Core Clustering
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`[Primary] Setting up ${numCPUs} workers for extreme scale...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`[Primary] Worker ${worker.process.pid} died. Spinning up a new one...`);
    cluster.fork();
  });
} else {
  // Worker Logic Handles Scaling Loads

  // Deeply Optimized Database Connection Pooling
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 100, // Handle thousands of concurrent requests smoothly
    minPoolSize: 10   // Maintain active pipes for latency bursts
  })
    .then(() => console.log(`[Worker ${process.pid}] MongoDB connected`))
    .catch((err) => console.error(`[Worker ${process.pid}] MongoDB connection error:`, err));

  // Routes
  const userRoutes = require('./routes/userRoutes');
  const videoRoutes = require('./routes/videoRoutes');
  const sponsorshipRoutes = require('./routes/sponsorshipRoutes');
  const taskRoutes = require('./routes/taskRoutes');
  const { errorHandler } = require('./middlewares/errorHandler');

  app.get('/', (req, res) => {
    res.send(`InfluencerzHub Backend Worker ${process.pid} is running`);
  });

  app.use('/api/users', userRoutes);
  app.use('/api/videos', videoRoutes);
  app.use('/api/sponsorships', sponsorshipRoutes);
  app.use('/api/tasks', taskRoutes);

  // Global Error Handler (MUST BE LAST)
  app.use(errorHandler);

  // Start Server Socket
  app.listen(PORT, () => {
    console.log(`[Worker ${process.pid}] HTTP Server Socket bound on http://localhost:${PORT}`);
  });
}