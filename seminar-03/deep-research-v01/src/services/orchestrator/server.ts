import express from 'express';
import cors from 'cors';
import askRoutes from './routes/ask.routes';
import { errorHandler } from '../../shared/utils/error-handler';
import config from '../../shared/config';

// Create Express server
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));  // Allow larger JSON bodies for search results
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// API Routes
app.use('/api/ask', askRoutes);

// HTML content for the frontend
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Multi-Agent Internet Research System</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    textarea { width: 100%; height: 100px; margin-bottom: 10px; padding: 10px; }
    button { padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
    button:hover { background-color: #45a049; }
    #progress { margin-top: 20px; display: none; }
    #report { margin-top: 20px; background-color: #f9f9f9; padding: 20px; white-space: pre-wrap; }
    .progress-bar { width: 100%; background-color: #ddd; }
    .progress-bar-fill { height: 30px; background-color: #4CAF50; width: 0%; text-align: center; line-height: 30px; color: white; }
    .example { cursor: pointer; color: #4CAF50; margin-right: 10px; text-decoration: underline; }
    .example:hover { color: #45a049; }
    .examples { margin-bottom: 10px; }
    .action-buttons { margin-top: 20px; display: none; }
    .action-button { margin-right: 10px; padding: 8px 16px; background-color: #2196F3; color: white; border: none; cursor: pointer; }
    .action-button:hover { background-color: #0b7dda; }
    .tooltip { display: none; background-color: black; color: white; text-align: center; border-radius: 6px; padding: 5px; position: absolute; z-index: 1; }
  </style>
</head>
<body>
  <h1>Multi-Agent Internet Research System</h1>
  <p>Enter your question below and our agents will research and compile a comprehensive report.</p>
  
  <div class="examples">
    <strong>Try examples:</strong> 
    <span class="example" onclick="setExample('What are the key differences between REST and GraphQL?')">REST vs GraphQL</span>
    <span class="example" onclick="setExample('What are the latest developments in quantum computing?')">Quantum Computing</span>
    <span class="example" onclick="setExample('How has climate change affected agriculture in California?')">Climate & Agriculture</span>
  </div>
  
  <textarea id="question" placeholder="Enter your research question here... (10-500 characters)" minlength="10" maxlength="500"></textarea>
  <button id="submit">Submit Question</button>
  
  <div id="progress">
    <h3 id="progressStage">Processing...</h3>
    <div class="progress-bar">
      <div class="progress-bar-fill" id="progressBar">0%</div>
    </div>
    <p id="progressMessage"></p>
  </div>
  
  <div id="report"></div>
  
  <div class="action-buttons" id="actionButtons">
    <button class="action-button" id="copyButton">Copy to Clipboard</button>
    <button class="action-button" id="downloadButton">Download as Markdown</button>
    <span class="tooltip" id="copyTooltip">Copied!</span>
  </div>
  
  <script>
    // Set example questions
    function setExample(text) {
      document.getElementById('question').value = text;
    }
    
    // Validate question length
    function validateQuestion(question) {
      if (question.length < 10) {
        alert('Question is too short. Please enter at least 10 characters.');
        return false;
      }
      if (question.length > 500) {
        alert('Question is too long. Please enter at most 500 characters.');
        return false;
      }
      return true;
    }
    
    // Copy to clipboard functionality
    document.getElementById('copyButton').addEventListener('click', () => {
      const reportText = document.getElementById('report').innerText;
      navigator.clipboard.writeText(reportText)
        .then(() => {
          const tooltip = document.getElementById('copyTooltip');
          tooltip.style.display = 'block';
          setTimeout(() => {
            tooltip.style.display = 'none';
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy to clipboard');
        });
    });
    
    // Download as Markdown
    document.getElementById('downloadButton').addEventListener('click', () => {
      const reportText = document.getElementById('report').innerText;
      const blob = new Blob([reportText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Get current date/time for filename
      const now = new Date();
      const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
      
      a.download = "research-report-" + timestamp + ".md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    document.getElementById('submit').addEventListener('click', async () => {
      const question = document.getElementById('question').value.trim();
      
      if (!validateQuestion(question)) {
        return;
      }
      
      // Show progress section
      document.getElementById('progress').style.display = 'block';
      document.getElementById('report').innerHTML = '';
      document.getElementById('actionButtons').style.display = 'none';
      
      // Update progress elements
      const progressStage = document.getElementById('progressStage');
      const progressBar = document.getElementById('progressBar');
      const progressMessage = document.getElementById('progressMessage');
      
      // Set initial progress state
      progressStage.textContent = 'Starting...';
      progressBar.style.width = '0%';
      progressBar.textContent = '0%';
      progressMessage.textContent = 'Initializing research request...';
      
      try {
        // Create and configure EventSource for SSE
        const encodedQuestion = encodeURIComponent(question);
        const eventSource = new EventSource('/api/ask?question=' + encodedQuestion);
        
        // Listen for progress updates
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.stage === 'error') {
              progressStage.textContent = 'Error';
              progressMessage.textContent = data.message;
              eventSource.close();
              return;
            }
            
            if (data.report) {
              // Final report received
              document.getElementById('report').innerHTML = data.report;
              document.getElementById('actionButtons').style.display = 'flex';
              eventSource.close();
              return;
            }
            
            // Update progress
            progressBar.style.width = data.progress + '%';
            progressBar.textContent = data.progress + '%';
            
            switch(data.stage) {
              case 'triage':
                progressStage.textContent = 'Planning Research';
                break;
              case 'research':
                progressStage.textContent = 'Gathering Information';
                break;
              case 'editor':
                progressStage.textContent = 'Compiling Report';
                break;
              case 'complete':
                progressStage.textContent = 'Complete';
                break;
            }
            
            progressMessage.textContent = data.message;
          } catch (err) {
            console.error('Error parsing event data:', err, event.data);
            progressMessage.textContent = 'Error processing server response';
          }
        };
        
        // Handle SSE connection errors
        eventSource.onerror = (err) => {
          console.error('EventSource error:', err);
          progressStage.textContent = 'Connection Error';
          progressMessage.textContent = 'Lost connection to server. Try refreshing the page.';
          eventSource.close();
        };
        
        // No need to make a separate fetch call - the EventSource handles the request
      } catch (error) {
        progressStage.textContent = 'Error';
        progressMessage.textContent = 'An error occurred: ' + error.message;
        console.error('Error setting up EventSource:', error);
      }
    });
  </script>
</body>
</html>
`;

// Simple frontend for demo purposes
app.get('/', (_req, res) => {
  res.send(htmlContent);
});

// Add a favicon.ico route to prevent 404 errors
app.get('/favicon.ico', (_req, res) => {
  res.status(204).end(); // No content response
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.services.orchestrator.port;
app.listen(PORT, () => {
  console.log(`[ORCHESTRATOR] Orchestrator Service running on port ${PORT}`);
  console.log(`[ORCHESTRATOR] Visit http://localhost:${PORT} to use the research system`);
});

export default app; 