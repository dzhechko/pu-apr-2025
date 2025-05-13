import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/search.routes';
import { errorHandler } from '../../shared/utils/error-handler';
import config from '../../shared/config';

// Create Express server
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use('/api/search', searchRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.services.research.port;
app.listen(PORT, () => {
  console.log(`[RESEARCH] Research Service running on port ${PORT}`);
  console.log(`[RESEARCH] Exa API Key configured: ${!!config.api.exa.apiKey}`);
});

export default app; 