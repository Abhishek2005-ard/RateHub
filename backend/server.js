import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'RateHub Express & PostgreSQL API operational',
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Express Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Registration API Endpoint: http://localhost:${PORT}/api/auth/register`);
  console.log(`====================================================`);
});
