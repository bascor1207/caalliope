import acceptLanguage from 'accept-language'
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const languages = ['en', 'fr'];

acceptLanguage.languages(languages)

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const languageCookie = request.cookies.get('i18next');
    const language = languageCookie?.value || 'fr';
    const headers = new Headers(request.headers);

    if (url.pathname.includes('/catalog/')) {
        headers.set('bookId', request.nextUrl.pathname.split('/')[3]);
    }

    const supportedLanguages = ['en', 'fr'];
    if (!supportedLanguages.some((lang) => url.pathname.startsWith(`/${lang}`))) {
        url.pathname = `/${language}${url.pathname}`;
        return NextResponse.redirect(url, { headers });
    }

    if (url.pathname === '/auth') {
        url.pathname = `/${language}/auth/sign-in`;
        return NextResponse.redirect(url), { headers };
    }

    const token = request.cookies.get('token');
    if (!token && url.pathname.includes('/my-account')) {
        url.pathname = `/${language}/auth/sign-in`;
        return NextResponse.redirect(url, { headers });
    }


    if (request.nextUrl.searchParams.get('activeTab')) {
        const searchParams = url.searchParams;
        searchParams.delete('activeTab');
        const existingCookieActiveTab = request.cookies.get('activeTab')?.value;
        const queryActiveTab = request.nextUrl.searchParams.get('activeTab');

        const activeTab = queryActiveTab || existingCookieActiveTab || 'my-infos';

        const response = NextResponse.redirect(url.toString(), { headers });
        response.cookies.set('activeTab', activeTab, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
        return response;
    }

    return NextResponse.next({
        request: {
            headers,
        }
    });
}

export const config = {
    matcher: [
        { source: '/:locale(fr|en)?/my-account' },
        { source: '/:locale(fr|en)?/auth' },
        { source: '/:locale(fr|en)?/catalog/:path*' },
        { source: '/' }
    ]
};
