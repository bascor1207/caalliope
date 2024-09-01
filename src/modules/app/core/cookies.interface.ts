export interface CookiesInterface {
    destroyCookies(cookieName: string): void;

    setCookie(cookieName: string, cookieValue: string): void;
}
