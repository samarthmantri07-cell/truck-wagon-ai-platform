const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const env = require('./config/env');
const { errorHandler } = require('./middleware/errorMiddleware');
const { checkAiHealth } = require('./services/aiService');

// Prisma handles database connection automatically when queries are made.

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/detections', require('./routes/detectionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health and Settings
app.get('/api/health', async (req, res) => {
  const aiHealth = await checkAiHealth();
  res.json({
    status: 'ok',
    backend: 'Node.js Express',
    ai_engine: aiHealth
  });
});

app.get('/api/settings', (req, res) => {
  res.json({ message: 'Settings endpoint' });
});

// Error Handler
app.use(errorHandler);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
