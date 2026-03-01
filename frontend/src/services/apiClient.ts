import axios from 'axios';

// Base API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // Increased timeout for slow 3G network
});

// Cache Layer Optimization
const requestCache = new Map<string, { data: any, timestamp: number, promise?: Promise<any> }>();
const CACHE_TTL_MS = 60000; // 60 Seconds TTL for GET caches

// Slow network retry logic configuration
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

// Request Interceptor: Deduplication & Cache Guard
apiClient.interceptors.request.use(
    (config) => {
        // Implement cache checking only for GET operations
        if (config.method?.toLowerCase() === 'get') {
            const cacheKey = `${config.url}?${new URLSearchParams(config.params || {}).toString()}`;

            // Do we have it cached and is it fresh?
            if (requestCache.has(cacheKey)) {
                const cachedEntry = requestCache.get(cacheKey)!;
                if (Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {

                    // If there is an active inflight request promise, return empty adapter that resolves instantly to avoid duplicate network hits
                    if (cachedEntry.promise) {
                        config.adapter = () => cachedEntry.promise!.then(res => ({
                            data: res, status: 200, statusText: 'OK', headers: {}, config, request: {}
                        }));
                    } else if (cachedEntry.data) {
                        config.adapter = () => Promise.resolve({
                            data: cachedEntry.data, status: 200, statusText: 'OK', headers: {}, config, request: {}
                        });
                    }
                } else {
                    // Stale cache, wipe it
                    requestCache.delete(cacheKey);
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Caching and Retries
apiClient.interceptors.response.use(
    (response) => {
        const config = response.config;
        if (config.method?.toLowerCase() === 'get') {
            const cacheKey = `${config.url}?${new URLSearchParams(config.params || {}).toString()}`;
            requestCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        }
        return response.data;
    },
    async (error) => {
        const config = error.config;

        // Ensure configuration and retry count exist
        const customConfig = config as any;
        if (!customConfig || !customConfig.retryCount) {
            if (customConfig) customConfig.retryCount = 0;
        }

        // Retry on pure network timeouts or 5xx server drops
        const isRetryableError = error.code === 'ECONNABORTED' || error.message === 'Network Error' || (error.response && error.response.status >= 500);

        if (isRetryableError && customConfig && customConfig.retryCount < MAX_RETRIES) {
            customConfig.retryCount += 1;
            console.warn(`[Slow Network Retry] Retrying request ${config.url} ... Attempt ${customConfig.retryCount}`);

            // Wait with specific exponential backoff formula
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * customConfig.retryCount));
            return apiClient(config);
        }

        console.error("API Error Response:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;
