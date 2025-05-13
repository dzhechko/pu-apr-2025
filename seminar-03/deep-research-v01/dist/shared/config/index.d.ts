interface ServiceConfig {
    port: number;
    url: string;
}
interface Config {
    nodeEnv: string;
    isProduction: boolean;
    isDevelopment: boolean;
    services: {
        triage: ServiceConfig;
        research: ServiceConfig;
        editor: ServiceConfig;
        orchestrator: ServiceConfig;
    };
    api: {
        exa: {
            apiKey: string;
        };
        openai: {
            apiKey: string;
        };
        langbase: {
            apiKey: string;
        };
    };
    performance: {
        maxConcurrentSearches: number;
        searchTimeoutMs: number;
        maxResultsPerSearch: number;
        totalReportTimeoutMs: number;
    };
}
declare const config: Config;
export default config;
