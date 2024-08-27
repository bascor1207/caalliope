import { CookiesInterface } from '@/modules/app/core/cookies.interface';

export class FakeCookiesProvider implements CookiesInterface {
    public cookies = new Map<string, string>()

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    destroyCookies(_context: null, cookieName: string) {
        this.cookies.delete(cookieName);
    }

    setCookie(_context: null, cookieName: string, cookieValue: string): void {
        this.cookies.set(cookieName, cookieValue)
    }
}
