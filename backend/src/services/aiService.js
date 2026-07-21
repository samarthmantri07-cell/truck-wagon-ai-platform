const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const env = require('../config/env');

const predictImage = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${env.AI_API_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error communicating with AI Service:', error.message);
    throw new Error('AI Service failed to process the image');
  }
};

const predictVideo = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${env.AI_API_URL}/video/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    return response.data;
  } catch (error) {
    console.error('Error communicating with AI Service for video:', error.message);
    throw new Error('AI Service failed to process the video');
  }
};

const predictStream = async (imageBase64) => {
  try {
    const response = await axios.post(`${env.AI_API_URL}/stream/predict`, {
      image_b64: imageBase64
    });

    return response.data;
  } catch (error) {
    console.error('Error communicating with AI stream service:', error.message);
    throw new Error('AI Service failed to process the stream frame');
  }
};

const checkAiHealth = async () => {
  try {
    const response = await axios.get(`${env.AI_API_URL}/health`);
    return response.data;
  } catch (error) {
    return { status: 'down', error: error.message };
  }
};

module.exports = { predictImage, predictVideo, predictStream, checkAiHealth };
