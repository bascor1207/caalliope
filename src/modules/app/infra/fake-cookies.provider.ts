import type { CookiesInterface } from '@/modules/app/core/cookies.interface';

export class FakeCookiesProvider implements CookiesInterface {
    public cookies = new Map<string, string>()

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    destroyCookies(cookieName: string) {
        this.cookies.delete(cookieName);
    }

    setCookie(cookieName: string, cookieValue: string): void {
        this.cookies.set(cookieName, cookieValue)
    }
}
