const express = require('express');
const router = express.Router();
const { generateReport, getReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getReports);

router.route('/generate')
  .post(generateReport);

module.exports = router;
