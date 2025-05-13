import { ExaSearchParams, SearchResponse } from '../../../shared/types';
/**
 * Search the internet using Exa API
 * Based on the Langbase example: https://langbase.com/docs/examples/internet-research-tool
 */
export declare function searchInternet({ query, domain, numResults, useAutoprompt, }: ExaSearchParams): Promise<SearchResponse>;
