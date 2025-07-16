const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on('connect', () => {
  console.log('✅ Connected to Redis');
});

client.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

client.connect();

module.exports = client;