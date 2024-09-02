import { destroyCookie, setCookie } from 'nookies';

import type { CookiesInterface } from '@/modules/app/core/cookies.interface';

export class HttpCookiesProvider implements CookiesInterface {
    destroyCookies(cookieName: string): void {
        destroyCookie(null, cookieName)
    }

    setCookie(cookieName: string, cookieValue: string): void {
        setCookie(null, cookieName, cookieValue)
    }
}
