import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import path from 'path';

import { ImageService } from './services/imageService';
import { WebSocketService } from './services/websocketService';
import { createImageRoutes } from './routes/imageRoutes';
import { createSessionRoutes } from './routes/sessionRoutes';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ["http://localhost:3000", "http://localhost:3002"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize services with empty config (will be updated via API)
const imageService = new ImageService({
  baseUrl: process.env.API_BASE_URL || '',
  apiKey: process.env.API_KEY || ''
});

const wsService = new WebSocketService(server);

// Routes
app.use('/api/images', createImageRoutes(imageService, wsService));
app.use('/api/sessions', createSessionRoutes(wsService));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Classroom Interactive API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      images: '/api/images',
      sessions: '/api/sessions',
      uploads: '/uploads'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Cleanup inactive sessions every 10 minutes
setInterval(() => {
  wsService.cleanupInactiveSessions();
}, 10 * 60 * 1000);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Classroom Interactive API server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Upload directory: ${process.env.UPLOAD_DIR || 'uploads'}`);
  
  if (!process.env.API_BASE_URL || !process.env.API_KEY) {
    console.warn('⚠️  Warning: API_BASE_URL or API_KEY not configured. Please set them via API config endpoint or environment variables.');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
