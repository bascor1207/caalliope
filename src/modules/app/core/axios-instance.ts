import axios from 'axios';

import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';

const isServer = typeof window === 'undefined'

export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_DEFAULT_URL}/api`,
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

axiosInstance.interceptors.request.use(cookiesInterceptor);
