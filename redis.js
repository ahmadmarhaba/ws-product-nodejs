require('dotenv').config()
const Redis = require('ioredis');
const redis = new Redis(`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT_URI}:${process.env.REDIS_ENDPOINT_PORT}/0`)// <ignore scan-env>

module.exports = redis ? redis : null;