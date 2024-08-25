import { CookiesInterface } from '@/modules/app/core/cookies.interface';

export class FakeCookiesProvider implements CookiesInterface {
    public cookies = new Map<string, string>()

    constructor() {}

    destroyCookies(_context: null, cookieName: string) {
        this.cookies.delete(cookieName);
    }

    setCookie(_context: null, cookieName: string, cookieValue: string): void {
        this.cookies.set(cookieName, cookieValue)
    }
}
