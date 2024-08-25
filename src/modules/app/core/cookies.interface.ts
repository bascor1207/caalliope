export interface CookiesInterface {
    destroyCookies(context: null, cookieName: string): void;

    setCookie(context: null, cookieName: string, cookieValue: string): void;
}
