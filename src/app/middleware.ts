import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import axios from 'axios';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('Authorization')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        console.log(payload)
        // req.user = payload as Record<string, any>;
        return NextResponse.next();
    } catch (error) {
        if (error instanceof Error && error.name === 'JWTExpired') {
            return await handleTokenRefresh(req);
        }

        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}

async function handleTokenRefresh(req: NextRequest) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {}, {
            withCredentials: true,
        });

        if (response.status === 200) {
            const newToken = response.data.token;
            const res = NextResponse.next();
            res.cookies.set('Authorization', `Bearer ${newToken}`, { httpOnly: true });
            return res;
        } else {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}
