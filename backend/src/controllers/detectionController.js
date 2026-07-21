const detectionRepository = require('../repositories/detectionRepository');
const { predictImage } = require('../services/aiService');

const uploadAndDetect = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image provided');
    }

    const imagePath = req.file.path;
    const upload = await detectionRepository.createUpload(imagePath);
    
    // Call FastAPI Service
    const aiResponse = await predictImage(imagePath);

    const detection = await detectionRepository.createDetectionWithRelations(
      upload.id,
      aiResponse.processing_time_ms || 0,
      !!aiResponse.success,
      aiResponse.detections || []
    );

    res.json({
      id: detection.id,
      image_path: imagePath,
      ai_result: aiResponse
    });
  } catch (error) {
    next(error);
  }
};

const getDetections = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const { search, className, success, sortBy, order } = req.query;

    const filters = { search, className };
    if (success !== undefined) filters.success = success === 'true';

    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'asc' ? 'asc' : 'desc';
    } else {
      sort.createdAt = 'desc';
    }
    
    const detections = await detectionRepository.getDetections(page, limit, filters, sort);
    res.json(detections);
  } catch (error) {
    next(error);
  }
};

const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No video provided');
    }

    const videoPath = req.file.path;
    const upload = await detectionRepository.createUpload(videoPath);
    
    // Call FastAPI Video Service
    const { predictVideo } = require('../services/aiService');
    const aiResponse = await predictVideo(videoPath);
    
    if (aiResponse.success && aiResponse.data) {
      const data = aiResponse.data;
      await detectionRepository.createVideoMetadata(
        upload.id,
        data.processing_time_ms,
        data.frame_count,
        data.fps,
        data.average_confidence,
        data.detection_summary
      );
      
      res.json({
        id: upload.id,
        video_path: videoPath,
        processed_video: data.output_path,
        ai_result: data
      });
    } else {
      res.status(500);
      throw new Error('Video processing failed');
    }
  } catch (error) {
    next(error);
  }
};

const predictStreamFrame = async (req, res, next) => {
  try {
    const { image } = req.body;
    if (!image) {
      res.status(400);
      throw new Error('No image frame provided');
    }

    const { predictStream } = require('../services/aiService');
    const response = await predictStream(image);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAndDetect, getDetections, uploadVideo, predictStreamFrame };
