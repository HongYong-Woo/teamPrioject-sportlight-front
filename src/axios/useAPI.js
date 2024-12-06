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
            if (token) {
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
        
            if (originalRequest.url.includes('/login') || 
                originalRequest.url.includes('/reissue')) {
                return Promise.reject(error);
            }
        
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
        
                try {
                    await auth.refreshToken();
                    const token = localStorage.getItem("accessToken");
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    await auth.logout();
                    return Promise.reject(refreshError);
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
