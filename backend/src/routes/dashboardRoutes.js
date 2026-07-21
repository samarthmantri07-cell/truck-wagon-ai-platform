const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics, getReports } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/analytics/throughput', protect, getAnalytics);
router.get('/reports', protect, getReports);

module.exports = router;
