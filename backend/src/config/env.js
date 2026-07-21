const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret_key_truck_wagon',
  AI_API_URL: process.env.AI_API_URL || 'http://127.0.0.1:8000',
  DB_PATH: process.env.DB_PATH || './src/database/app.db'
};
