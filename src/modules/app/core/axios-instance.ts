import axios from 'axios';

import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';

const isServer = typeof window === 'undefined'

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true
});

const cookiesInterceptor = async (req: any) => {
    if (isServer) {
        const { cookies } = (await import('next/headers'))
        req.headers.cookie = cookies().getAll()
            .map((item) => `${item.name}=${item.value}`)
            .join('; ')
    } else {
        req.headers.cookie = HttpCookiesProvider.getCookie('token')
    }
    return req
}

axiosInstance.interceptors.request.use(cookiesInterceptor)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login'
        }
        if (error.response?.status === 403) {
            window.location.href = '/forbidden'
        }
        return Promise.reject(error)
    }
)
