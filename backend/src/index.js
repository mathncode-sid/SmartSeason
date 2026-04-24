const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fieldsRoutes = require('./routes/fields');
const updatesRoutes = require('./routes/updates');
const assignmentsRoutes = require('./routes/assignments');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`SmartSeason backend running on http://localhost:${PORT}`);
  console.log('API Documentation:');
  console.log('POST /api/auth/register - Register new user');
  console.log('POST /api/auth/login - Login user');
  console.log('GET /api/fields - Get fields');
  console.log('POST /api/fields - Create field (admin)');
  console.log('GET /api/dashboard - Get dashboard data');
});
