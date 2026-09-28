import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

// Import routes
import healthRoutes from './routes/health';
import uploadRoutes from './routes/upload';
import analysisRoutes from './routes/analysis';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Root
app.get('/', (req, res) => {
  res.json({ message: 'ResuScore Backend API is running!' });
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analysis', analysisRoutes);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ error: error.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 ResuScore Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💾 Storage: In-Memory (data resets on server restart)`);
  console.log(`✅ No database connection required\n`);
});