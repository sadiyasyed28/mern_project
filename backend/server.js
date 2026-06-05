const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');
const path    = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── CORS: allow localhost in dev, any origin in prod (lock down in production) ──
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL  // e.g. https://freshthingsonly.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/cart',       require('./routes/cartRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// ── Health check ──
app.get('/',    (req, res) => res.json({ message: 'FreshThingsOnly API is running! 🥬' }));
app.get('/api', (req, res) => res.json({ message: 'FreshThingsOnly API is running! 🥬', version: '1.0.0' }));

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🥬 FreshThingsOnly server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app; // needed for Vercel serverless
