import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
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
    matcher: { source: '/my-account/:path*', has: [{ type: 'query', key:'activeTab' }] }
};
