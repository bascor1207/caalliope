import { CookiesInterface } from '@/modules/app/core/cookies.interface';
import { destroyCookie, setCookie } from 'nookies';

export class CookiesProvider implements CookiesInterface {
    destroyCookies(cookieName: string): void {
        destroyCookie(null, cookieName)
    }

    setCookie(cookieName: string, cookieValue: string): void {
        setCookie(null, cookieName, cookieValue)
    }
}
