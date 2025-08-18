import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export const useBrothers = () => {
    const [brothers, setBrothers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios retry
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 2000; // Exponential backoff: 2s, 4s, 6s
        },
        retryCondition: (error) => {
            // Retry on most 5xx errors and network issues
            return error.response && error.response.status >= 500;
        },
    });

    const fetchBrothers = async () => {
        try {
            setLoading(true);
            setError(null);
            // Try Netlify function first, then fall back to local Django API
            const endpoints = [
                '/.netlify/functions/get_brothers',
                'http://127.0.0.1:8000/api/brothers/'
            ];

            let data = [];
            let lastError = null;
            for (const url of endpoints) {
                try {
                    const res = await axios.get(url, { timeout: 10000 });
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        data = res.data;
                        break;
                    }
                    // Some APIs might wrap results; accept as-is if array
                    if (Array.isArray(res.data)) {
                        data = res.data;
                        break;
                    }
                } catch (e) {
                    lastError = e;
                }
            }

            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw lastError || new Error('No data returned from any endpoint');
            }

            console.log('Brothers loaded:', Array.isArray(data) ? data.length : 'unknown');
            setBrothers(data);
        } catch (error) {
            console.error('Error fetching brothers data:', error);
            setError(error.message);
            setBrothers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrothers();
    }, []);

    const refetch = () => {
        fetchBrothers();
    };

    return {
        brothers,
        loading,
        error,
        refetch
    };
}; 