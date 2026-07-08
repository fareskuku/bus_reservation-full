const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

console.log('🚀 SERVER STARTING...');

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

const authRoutes = require('./src/routes/authRoutes');
const busRoutes = require('./src/routes/busRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Server is running'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/register',
      buses: '/api/buses',
      routes: '/api/routes',
      bookings: '/api/bookings',
      dashboard: '/api/dashboard',
      admin: '/api/admin/users'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: err.message 
  });
});

app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.url 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/register`);
  console.log(`🚌 Buses: http://localhost:${PORT}/api/buses`);
  console.log(`🗺️ Routes: http://localhost:${PORT}/api/routes`);
  console.log(`🎫 Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`👑 Admin: http://localhost:${PORT}/api/admin/users`);
});