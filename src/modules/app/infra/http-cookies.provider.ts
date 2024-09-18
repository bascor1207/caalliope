import { destroyCookie, parseCookies, setCookie } from 'nookies';

import type { CookiesInterface } from '@/modules/app/core/cookies.interface';

export class HttpCookiesProvider implements CookiesInterface {
    destroyCookies(cookieName: string): void {
        destroyCookie(null, cookieName, { path: '/' })
    }

    setCookie(cookieName: string, cookieValue: string): void {
        setCookie(null, cookieName, cookieValue, { path: '/' })
    }

    static getCookie(cookieName: string): string | undefined {
       const cookies = parseCookies();
       return cookies?.[cookieName]
    }
}
