import express from 'express';
import cors from 'cors';
import compileRoutes from './routes/compile.routes';
import { errorHandler } from '../../shared/utils/error-handler';
import config from '../../shared/config';

// Create Express server
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));  // Allow larger JSON bodies for search results
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// API Routes
app.use('/api/compile', compileRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.services.editor.port;
app.listen(PORT, () => {
  console.log(`[EDITOR] Editor Service running on port ${PORT}`);
  console.log(`[EDITOR] OpenAI API Key configured: ${!!config.api.openai.apiKey}`);
});

export default app; 