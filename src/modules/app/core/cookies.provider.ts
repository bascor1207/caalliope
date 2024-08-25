import { CookiesInterface } from '@/modules/app/core/cookies.interface';
import { destroyCookie, setCookie } from 'nookies';

export class CookiesProvider implements CookiesInterface {
    destroyCookies(_context:null, cookieName: string): void {
        destroyCookie(null, cookieName)
    }

    setCookie(_context: null, cookieName: string, cookieValue: string): void {
        setCookie(null, cookieName, cookieValue)
    }
}
