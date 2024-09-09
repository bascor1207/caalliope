import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    if (url.pathname === '/auth') {
        url.pathname = '/auth/sign-in';
        return NextResponse.redirect(url);
    }

    const token = request.cookies.get('token');
    if (!token && url.pathname.includes('/my-account')) {
        url.pathname = '/auth/sign-in';
        return NextResponse.redirect(url);
    }
    const searchParams = url.searchParams;
    searchParams.delete('activeTab');
    const existingCookieActiveTab = request.cookies.get('activeTab')?.value;
    const queryActiveTab = request.nextUrl.searchParams.get('activeTab');

    const activeTab = queryActiveTab || existingCookieActiveTab || 'my-infos';

    const response = NextResponse.redirect(url.toString());
    response.cookies.set('activeTab', activeTab, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    });
    return response;
}

export const config = {
    matcher: [
        { source: '/my-account', has: [{ type: 'query', key:'activeTab' }] },
        { source: '/my-account' },
        { source: '/auth' }
    ]
};
