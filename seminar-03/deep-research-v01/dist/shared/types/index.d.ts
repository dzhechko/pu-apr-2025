/**
 * Shared type definitions for the Multi-Agent Internet Research System
 */
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
export interface SearchRequest extends PlanItem {
}
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
export interface CompileRequest {
    originalQuestion: string;
    plan: PlanItem[];
    results: SearchResponse[];
}
export interface AskRequest {
    question: string;
}
export interface ResearchProgress {
    stage: 'triage' | 'research' | 'editor' | 'complete' | 'error';
    progress: number;
    message: string;
}
export interface ApiError {
    status: number;
    message: string;
    details?: any;
}
export interface ExaSearchParams {
    query: string;
    domain: string;
    numResults?: number;
    useAutoprompt?: boolean;
}
