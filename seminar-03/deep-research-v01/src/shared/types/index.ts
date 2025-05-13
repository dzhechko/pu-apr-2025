/**
 * Shared type definitions for the Multi-Agent Internet Research System
 */

// Triage Agent Types
export interface PlanRequest {
  question: string;
}

export interface PlanItem {
  id: number;
  query: string;
  domain: string;
  priority: number;
}

export interface PlanResponse {
  plan: PlanItem[];
}

// Research Agent Types
export interface SearchRequest extends PlanItem {}

export interface Hit {
  title: string | null;
  url: string;
  snippet: string;
  date?: string;
  highlights?: string[];
}

export interface SearchResponse {
  query: string;
  hits: Hit[];
}

// Editor Agent Types
export interface CompileRequest {
  originalQuestion: string;
  plan: PlanItem[];
  results: SearchResponse[];
}

// Orchestrator Types
export interface AskRequest {
  question: string;
}

export interface ResearchProgress {
  stage: 'triage' | 'research' | 'editor' | 'complete' | 'error';
  progress: number;
  message: string;
}

// Error Types
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Exa Search Types
export interface ExaSearchParams {
  query: string;
  domain: string;
  numResults?: number;
  useAutoprompt?: boolean;
} 