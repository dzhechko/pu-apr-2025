# Multi-Agent Internet Research System

A microservices-based application that answers users' questions by searching the internet and compiling the information into a comprehensive Markdown report.

## Architecture

This system consists of three specialized AI agents working in sequence:

1. **Triage Agent**: Analyzes questions and creates a research plan with prioritized sub-queries
2. **Research Agent**: Searches the internet for information using Exa API
3. **Editor Agent**: Compiles the research findings into a well-formatted Markdown report

## Features

- Processes complex research questions by breaking them down into focused sub-queries
- Prioritizes most relevant searches to optimize research efficiency
- Executes concurrent searches to minimize latency
- Produces well-structured Markdown reports with proper citations
- Provides real-time progress updates via Server-Sent Events (SSE)
- Integrates with Exa for high-quality semantic search
- Target response time under 30 seconds for complete reports

## Requirements

- Node.js (v18+)
- Exa API key (for internet search)
- OpenAI API key (for AI agents)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/deep-research-v01.git
   cd deep-research-v01
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API keys:
   
   Copy the example.env file to .env:
   ```bash
   cp example.env .env
   ```
   
   Then edit the .env file to add your API keys:
   ```
   EXA_API_KEY="your_exa_api_key"
   OPENAI_API_KEY="your_openai_api_key"
   ```

## Starting the Services

The system uses a microservices architecture. You can start all services in development mode with:

```bash
# Start all services in separate terminals
npm run dev:triage
npm run dev:research  
npm run dev:editor
npm run dev
```

Or start just the orchestrator (which will attempt to connect to other services):

```bash
npm run dev
```

## Usage

Once the services are running:

1. Visit http://localhost:3000 in your browser
2. Enter your research question in the text box
3. Click "Submit Question"
4. Watch the progress as each agent performs its task
5. View the final Markdown report

## API Endpoints

The system exposes the following main endpoints:

- `POST /api/ask` - Submit a research question
- `GET /api/ask/health` - Check the health of all services

## Development

The project follows a microservices architecture with these components:

- `src/services/triage` - Question analysis and research planning
- `src/services/research` - Internet search using Exa API
- `src/services/editor` - Report compilation and formatting
- `src/services/orchestrator` - Coordination and frontend serving

## License

MIT