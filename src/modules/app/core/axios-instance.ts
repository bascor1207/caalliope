import axios from 'axios';
import { parseCookies } from 'nookies';

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        const cookies = parseCookies();
        const token = cookies.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);
