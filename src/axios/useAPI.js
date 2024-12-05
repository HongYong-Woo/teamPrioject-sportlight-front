import axios from "axios";
import { useAuthStore } from "@/stores/auth";

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

export const useAPI = () => {
    const baseURL = "http://localhost:8080/api";
    const auth = useAuthStore();
    
    const api = axios.create({
        baseURL: baseURL,
        withCredentials: true,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json"
        }
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");
            if (token && !config.url.includes('/login')) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
        const originalRequest = error.config;
    
        if (!error.response) {
            return Promise.reject(new Error("네트워크 연결을 확인해주세요."));
        }
    
        if (originalRequest.url.includes('/login') || originalRequest.url.includes('/reissue')) {
            return Promise.reject(error);
        }
    
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
            return new Promise(resolve => {
                subscribeTokenRefresh(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                resolve(api(originalRequest));
                });
            });
            }
    
            originalRequest._retry = true;
            isRefreshing = true;
    
            try {
            const response = await api.post('/auth/reissue');
            const newToken = response.data.data;
            
            if (newToken) {
                localStorage.setItem('accessToken', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                onRefreshed(newToken);
                return api(originalRequest);
            }
            } catch (refreshError) {
            isRefreshing = false;
            await auth.logout();
            return Promise.reject(refreshError);
            } finally {
            isRefreshing = false;
            }
        }
    
        return Promise.reject(error);
        }
    );

    const get = async (url, params) => {
        try {
            const response = await api.get(url, { params });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const post = async (url, data, config = {}) => {
        try {
            const response = await api.post(url, data, config);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const patch = async (url, data, config = {}) => {
        try {
            const response = await api.patch(url, data, {
                ...config,
                headers: {
                    ...config.headers
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const remove = async (url, params) => {
        try {
            const response = await api.delete(url, { params });
            return response;
        } catch (error) {
            throw error;
        }
    };

    return { get, post, patch, remove };
};