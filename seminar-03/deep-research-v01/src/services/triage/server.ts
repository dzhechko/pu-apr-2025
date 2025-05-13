import express from 'express';
import cors from 'cors';
import planRoutes from './routes/plan.routes';
import { errorHandler } from '../../shared/utils/error-handler';
import config from '../../shared/config';

// Create Express server
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use('/api/plan', planRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.services.triage.port;
app.listen(PORT, () => {
  console.log(`[TRIAGE] Triage Service running on port ${PORT}`);
  console.log(`[TRIAGE] OpenAI API Key configured: ${!!config.api.openai.apiKey}`);
});

export default app; 