const express = require('express');
const router = express.Router();
const { uploadAndDetect, getDetections, uploadVideo, predictStreamFrame } = require('../controllers/detectionController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/upload', protect, upload.single('file'), uploadAndDetect);
router.post('/video/upload', protect, upload.single('file'), uploadVideo);
router.post('/stream/frame', protect, predictStreamFrame);
router.get('/', protect, getDetections);

module.exports = router;
