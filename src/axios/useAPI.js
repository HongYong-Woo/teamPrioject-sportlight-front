import axios from "axios";

export const useAPI = () => {
    const baseURL = "http://localhost:8080";

    const api = axios.create({
        baseURL: baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // GET 요청
    const get = async (url, params) => {
        try {
            const response = await api.get(url, { params });
            return response;
        } catch (error) {
            throw error;
        }
    };

    // POST 요청
    const post = async (url, params) => {
        try {
            const response = await api.post(url, { params });
            return response;
        } catch (error) {
            throw error;
        }
    };

    // PATCH 요청
    const patch = async (url, params) => {
        try {
            const response = await api.patch(url, { params });
            return response;
        } catch (error) {
            throw error;
        }
    };
    
    // DELETE 요청
    const remove = async (url, params) => {
        try {
            const response = await api.delete(url, { params });
            return response;
        } catch (error) {
            throw error;
        }
    };

    return { get, post, patch, remove };
}