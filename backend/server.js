require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./src/routes/auth');
const symptomsRoutes = require('./src/routes/symptoms');
const doctorsRoutes = require('./src/routes/doctors');
const consultationsRoutes = require('./src/routes/consultations');
const subscriptionsRoutes = require('./src/routes/subscriptions');
const progressRoutes = require('./src/routes/progress');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: true, // React Native mobile apps don't enforce CORS; allow all origins
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
});
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'AI rate limit exceeded. Please wait a moment.' },
});
app.use('/api/symptoms', aiLimiter);
app.use(limiter);

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/consultations', consultationsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/progress', progressRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Health AI India backend running on port ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = app;
