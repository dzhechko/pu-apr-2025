import OpenAI from 'openai';
import config from '../../../shared/config';
import { CompileRequest } from '../../../shared/types';
import { createError } from '../../../shared/utils/error-handler';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.api.openai.apiKey,
  timeout: 30000, // 30 second timeout
});

/**
 * Compile the research results into a report
 */
export async function compileReport(request: CompileRequest): Promise<string> {
  try {
    console.log(`[EDITOR] Compiling report for: "${request.originalQuestion}"`);
    
    // Check if there are any search results to work with
    const nonEmptyResults = request.results.filter(result => result.hits.length > 0);
    if (nonEmptyResults.length === 0) {
      console.log('[EDITOR] No search results found, generating minimal report');
      return generateMinimalReport(request.originalQuestion);
    }
    
    // Format the search results for the prompt
    const resultsText = request.results.map((result, index) => {
      const planItem = request.plan.find(item => item.query === result.query);
      let formattedResult = `SEARCH ${index + 1}: ${result.query}\n`;
      formattedResult += `Priority: ${planItem?.priority || 'Unknown'}\n`;
      formattedResult += `Domain: ${planItem?.domain || 'Unknown'}\n`;
      formattedResult += `Results: ${result.hits.length} hits\n\n`;
      
      result.hits.forEach((hit, hitIndex) => {
        formattedResult += `Hit ${hitIndex + 1}:\n`;
        formattedResult += `Title: ${hit.title || 'No title'}\n`;
        formattedResult += `URL: ${hit.url}\n`;
        
        if (hit.date) {
          formattedResult += `Date: ${hit.date}\n`;
        }
        
        formattedResult += `Content: ${hit.snippet}\n`;
        
        if (hit.highlights && hit.highlights.length > 0) {
          formattedResult += `Highlights:\n`;
          hit.highlights.forEach(highlight => {
            formattedResult += `- ${highlight}\n`;
          });
        }
        
        formattedResult += `\n`;
      });
      
      return formattedResult;
    }).join('\n---\n\n');
    
    // Set up the system prompt
    const systemPrompt = `
You are an expert editor creating a research report based on web search results.

Your task is to:
1. Synthesize the information from search results into a coherent Markdown report.
2. Organize the information logically with clear headings and structure.
3. Include proper citations (as footnotes or inline links) to source URLs.
4. Use direct quotes sparingly, and clearly mark them.
5. Ensure the report directly answers the original question.
6. Be concise but comprehensive (target length: 500-800 words).
7. Include a brief introduction and conclusion.

FORMATTING GUIDELINES:
- Use Markdown formatting
- Create clear section headings with ## and ###
- Use bullet points or numbered lists where appropriate
- Include hyperlinks to sources [text](url)
- Bold key points with **text**
- Use proper citation format
- Include a "References" section at the end

The report should be well-organized, factual, and directly answer the user's question.
`;

    // Set up a promise with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(createError.timeoutError('OpenAI request timed out after 25 seconds'));
      }, 25000);
    });

    // Make the OpenAI request with timeout
    const completionPromise = openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `
ORIGINAL QUESTION: "${request.originalQuestion}"

SEARCH RESULTS:
${resultsText}

Please create a well-organized Markdown report that answers the original question based on these search results.
` 
        }
      ],
      temperature: 0.3,
    });
    
    // Race between completion and timeout
    const completion = await Promise.race([completionPromise, timeoutPromise]);

    // Extract the completion text
    const reportText = completion.choices[0]?.message?.content;
    
    if (!reportText) {
      throw createError.internalServerError('Failed to generate report: empty response');
    }
    
    console.log(`[EDITOR] Generated report for: "${request.originalQuestion}"`);
    return reportText;
  } catch (error: any) {
    console.error('[EDITOR] Error generating report:', error);
    
    if (error.status) {
      // If it's already an ApiError from createError, pass it along
      throw error;
    }
    
    // Check for specific OpenAI error types
    if (error.name === 'AbortError' || error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      throw createError.timeoutError('OpenAI request timed out');
    }
    
    // Otherwise, wrap it in a service unavailable error
    throw createError.serviceUnavailable(`OpenAI error: ${error.message}`);
  }
}

/**
 * Generate a minimal report when no search results are available
 */
function generateMinimalReport(question: string): string {
  return `# Research Results: ${question}

## Summary

We were unable to find relevant information from web searches to answer your question. This could be due to:

1. Network connectivity issues with search providers
2. Limited search results for specialized topics
3. Temporary service unavailability

## Recommendations

- Try refining your question to be more specific
- Consider breaking down complex questions into simpler parts
- Try again later when search services might be more responsive

We apologize for the inconvenience and appreciate your understanding.
`;
} 