import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const languageCookie = request.cookies.get('i18next');
    const language = languageCookie?.value || 'fr';

    const supportedLanguages = ['en', 'fr'];
    if (!supportedLanguages.some((lang) => url.pathname.startsWith(`/${lang}`))) {
        url.pathname = `/${language}${url.pathname}`;
        return NextResponse.redirect(url);
    }

    if (url.pathname === '/auth') {
        url.pathname = `/${language}/auth/sign-in`;
        return NextResponse.redirect(url);
    }

    const token = request.cookies.get('token');
    if (!token && url.pathname.startsWith('/my-account')) {
        url.pathname = `/${language}/auth/sign-in`;
        return NextResponse.redirect(url);
    }


    if (request.nextUrl.searchParams.get('activeTab')) {
        const searchParams = url.searchParams;
        searchParams.delete('activeTab');
        const existingCookieActiveTab = request.cookies.get('activeTab')?.value;
        const queryActiveTab = request.nextUrl.searchParams.get('activeTab');

        const activeTab = queryActiveTab || existingCookieActiveTab || 'my-infos';

        const response = NextResponse.redirect(url.toString());
        response.cookies.set('activeTab', activeTab, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        { source: '/:locale(fr|en)?/my-account' },
        { source: '/:locale(fr|en)?/auth' },
        { source: '/' }
    ]
};
