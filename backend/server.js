import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS & Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MVC API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    architecture: 'MVC (Model-View-Controller)',
    message: 'RateHub Express & PostgreSQL Authentication & Admin API operational',
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Express MVC Backend running on http://localhost:${PORT}`);
  console.log(`📡 Auth Login API: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`📡 Auth Register API: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`📡 Admin Stats API (JWT): GET http://localhost:${PORT}/api/admin/stats`);
  console.log(`📡 Admin Users API (JWT): GET/POST http://localhost:${PORT}/api/admin/users`);
  console.log(`📡 Admin Stores API (JWT): GET/POST http://localhost:${PORT}/api/admin/stores`);
  console.log(`====================================================`);
});

