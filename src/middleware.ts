import { NextResponse } from 'next/server';

export function middleware(request: Request) {

    const url = new URL(request.url);

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set('x-url', url.href);
    const cleanedUrl = request.url.split('?')[0]

    console.log(cleanedUrl, 'huzhciuzifcholzcouzhoumh')
    return NextResponse.rewrite(cleanedUrl.toString(), {
        request: {
            headers: requestHeaders,
        }
    });
}

export const config = {
    matcher: '/:path*'
};
