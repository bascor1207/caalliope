import axios from 'axios';
import { parseCookies } from 'nookies';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
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
