import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export const useAPI = () => {
    const baseURL = "http://localhost:8080";
    const auth = useAuthStore();
    const headers = {
        "Content-Type": "application/json",
    };
    console.log("token: " + auth.token);
    if(auth.isAuthenticated()) {
        headers['Authorization'] = `Bearer ${auth.token}`;
    }
    const api = axios.create({
        baseURL: baseURL,
        headers: headers,
    });

    // GET 요청
    const get = async (url, params) => {
        try {
            const response = await api.get(url, params);
            return response;
        } catch (error) {
            console.log(error);
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
