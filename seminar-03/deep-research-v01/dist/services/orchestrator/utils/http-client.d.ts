/**
 * HTTP client for communicating with other services
 */
export declare const httpClient: {
    /**
     * Send a request to the Triage service
     */
    triage: {
        /**
         * Generate a research plan for a question
         */
        createPlan: (question: string) => Promise<any>;
    };
    /**
     * Send a request to the Research service
     */
    research: {
        /**
         * Execute a search for a specific query
         */
        search: (searchRequest: any) => Promise<any>;
    };
    /**
     * Send a request to the Editor service
     */
    editor: {
        /**
         * Compile search results into a report
         */
        compileReport: (compileRequest: any) => Promise<any>;
    };
};
