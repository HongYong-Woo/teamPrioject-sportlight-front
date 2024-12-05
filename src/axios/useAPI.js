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
                    const success = await auth.refreshToken();
                    if (success) {
                        const newToken = localStorage.getItem("accessToken");
                        onRefreshed(newToken);
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                    
                    await auth.logout();
                    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
                } catch (refreshError) {
                    await auth.logout();
                    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
                } finally {
                    isRefreshing = false;
                }
            }

            if (error.response.status === 403) {
                console.error("Permission denied:", error);
                throw new Error("접근 권한이 없습니다.");
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