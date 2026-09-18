const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler.middleware');
const ApiResponse = require('./utils/apiResponse');

// Initialize database
connectDB();

const app = express();

// Security & Core Middleware
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  return ApiResponse.success(res, { status: 'ONLINE', timestamp: new Date() }, 'NLAMS API Gateway Healthy');
});

// Mount Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/projects', require('./routes/projects.routes'));
app.use('/api/parcels', require('./routes/parcels.routes'));
app.use('/api/gis', require('./routes/gis.routes'));
app.use('/api/documents', require('./routes/documents.routes'));
app.use('/api/compensation', require('./routes/compensation.routes'));
app.use('/api/rr', require('./routes/rr.routes'));
app.use('/api/grievances', require('./routes/grievances.routes'));
app.use('/api/notifications', require('./routes/notifications.routes'));
app.use('/api/audit', require('./routes/audit.routes'));

// 404 Catch-all handler
app.use((req, res) => {
  return ApiResponse.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
});

// Centralized error handler
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  logger.success(`NLAMS API Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`Health check available at http://localhost:${env.PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, err.stack);
  server.close(() => process.exit(1));
});

module.exports = app;
