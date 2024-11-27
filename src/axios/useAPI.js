import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export const useAPI = () => {
    const baseURL = "http://localhost:8080";

    const api = axios.create({
        baseURL: baseURL,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 10000,
    });

    api.interceptors.request.use(
        (config) => {
            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            } catch (error) {
                console.error("Request interceptor error:", error);
                return Promise.reject(error);
            }
        },
        (error) => {
            console.error("Request interceptor error:", error);
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

            if (
                error.response.status === 401 && 
                !originalRequest._retry && 
                !originalRequest.url.includes('/login')
            ) {
                originalRequest._retry = true;
                
                try {
                    const authStore = useAuthStore();
                    const success = await authStore.refreshToken();
                    
                    if (success) {
                        const newToken = localStorage.getItem("accessToken");
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    const authStore = useAuthStore();
                    await authStore.logout();
                    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
                }
            }

            if (error.response.status === 403) {
                console.error("Permission denied:", error);
                throw new Error("접근 권한이 없습니다.");
            }

            return Promise.reject(error);
        }
    );


    // GET 요청
    const get = async (url, params) => {
        try {
            const response = await api.get(url, params);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // POST 요청
    const post = async (url, params, config = {}) => {
        try {
            const response = await api.post(url, params, config); // config로 추가 설정 전달
            return response;
        } catch (error) {
            throw error;
        }
    };

    // PATCH 요청
    const patch = async (url, params) => {
        try {
            const response = await api.patch(url, params);
            return response;
        } catch (error) {
            throw error;
        }
    };
    
    // DELETE 요청
    const remove = async (url, params) => {
        try {
            const response = await api.delete(url, params);
            return response;
        } catch (error) {
            throw error;
        }
    };

    

    return { get, post, patch, remove };
}